import React, { useState } from 'react';
import { Category } from '../../app/Store/categoriesSlice.ts';

interface ModalFormProps {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  categories: Category[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (data: { category: string; amount: number; type: 'income' | 'expense' }) => void;
  onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ onSubmit, onClose, categories }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: 0,
    type: 'expense' as 'income' | 'expense',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { category, amount, type } = formData;

    if (!category || amount <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({ category, amount, type });
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Expense/Income</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">Type</label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
