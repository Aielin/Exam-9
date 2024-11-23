import React, { useState } from 'react';
import { Category } from '../../app/Store/categoriesSlice';

interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
}

interface CategoryFormProps {
  category?: Category;
  onSave: (data: Omit<Category, 'id'>) => void;
  onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    type: category?.type || 'expense',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Name is required!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{category ? 'Edit Category' : 'Add Category'}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to cancel? Unsaved changes will be lost.'
                    )
                  ) {
                    onClose();
                  }
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to cancel? Unsaved changes will be lost.'
                    )
                  ) {
                    onClose();
                  }
                }}
              >
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
  );
};

export default CategoryForm;
