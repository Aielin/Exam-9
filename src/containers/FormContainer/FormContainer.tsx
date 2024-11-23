import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../app/Store/store';
import { addTransaction, editTransaction, Transaction } from '../../app/Store/transactionsSlice';
import { fetchCategories} from '../../app/Store/categoriesSlice';
import ModalForm from '../../Components/ModalForm/ModalForm';

const FormContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.items);
    const transactions = useSelector((state: RootState) => state.transactions.items);

    const [formData, setFormData] = useState<Partial<Transaction>>({
        category: '',
        amount: undefined,
        createdAt: '',
    });

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchCategories());
        }

        if (id) {
            const transaction = transactions.find((t) => t.id === id);
            if (transaction) {
                setFormData(transaction);
            }
        }
    }, [categories, transactions, id, dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (data: { category: string; amount: number; type: 'income' | 'expense' }) => {
        const transaction: Transaction = {
            id: id || '',
            category: data.category,
            amount: data.amount,
            type: data.type,
            createdAt: id ? formData.createdAt! : new Date().toISOString(),
        };

        if (id) {
            dispatch(editTransaction(transaction));
        } else {
            dispatch(addTransaction(transaction));
        }
        navigate('/');
    };

    const handleClose = () => {
        navigate('/');
    };

    return (
        <ModalForm
            type={categories.find((cat) => cat.id === formData.category)?.type || 'expense'} // Пример логики
            category={formData.category || ''}
            amount={formData.amount || 0}
            categories={categories}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onClose={handleClose}
        />
    );
};

export default FormContainer;
