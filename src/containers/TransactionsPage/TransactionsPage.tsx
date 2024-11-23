import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/Store/store';
import { addTransaction, deleteTransaction, fetchTransactions } from '../../app/Store/transactionsSlice';
import dayjs from 'dayjs';
import ModalForm from '../../Components/ModalForm/ModalForm';
import { fetchCategories } from '../../app/Store/categoriesSlice';
import { useNavigate } from 'react-router-dom';

interface TransactionFormData {
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

const TransactionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items: transactions, loading, error } = useSelector(
      (state: RootState) => state.transactions
  );
  const categories = useSelector((state: RootState) => state.categories.items);

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = (transactionData: TransactionFormData) => {
    const transactionWithTimestamp = {
      ...transactionData,
      createdAt: new Date().toISOString(),
    };

    dispatch(addTransaction(transactionWithTimestamp))
        .then(() => dispatch(fetchTransactions()))
        .finally(() => handleCloseModal());
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const calculateTotal = () =>
      transactions.reduce((total, transaction) => {
        const category = categories.find((cat) => cat.id === transaction.category);
        return category?.type === 'income'
            ? total + transaction.amount
            : total - transaction.amount;
      }, 0);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (transactions.length === 0) {
      dispatch(fetchTransactions());
    }
  }, [categories.length, transactions.length, dispatch]);

  return (
      <div className="container mt-4">
        <div className="d-flex justify-content-end mb-3">
          <a href="/categories" className="btn btn-link">Categories</a>
          <button onClick={handleShowModal} className="btn btn-primary">Add</button>
        </div>

        <h1>Finance Tracker</h1>

        <div className="mb-4">
          <h4>
            Total: <span className={calculateTotal() >= 0 ? 'text-success' : 'text-danger'}>
            {calculateTotal()} KGS
          </span>
          </h4>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && transactions.length > 0 && (
            <table className="table table-striped">
              <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {transactions
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{dayjs(transaction.createdAt).format('DD.MM.YYYY HH:mm')}</td>
                        <td>{getCategoryName(transaction.category)}</td>
                        <td
                            className={
                              categories.find((cat) => cat.id === transaction.category)?.type === 'income'
                                  ? 'text-success'
                                  : 'text-danger'
                            }
                        >
                          {categories.find((cat) => cat.id === transaction.category)?.type === 'income'
                              ? '+'
                              : '-'}
                          {transaction.amount} KGS
                        </td>
                        <td>
                          <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                          >
                            Edit
                          </button>
                          <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(transaction.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  ))}
              </tbody>
            </table>
        )}

        {!loading && transactions.length === 0 && <p>No transactions found.</p>}
        {showModal && (
            <ModalForm
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                categories={categories}
            />
        )}
      </div>
  );
};

export default TransactionsPage;
