import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/Store/store';
import { deleteCategory, fetchCategories } from '../../app/Store/categoriesSlice';

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: categories, loading, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="container mt-4">
      <h1>Categories</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && categories.length > 0 ? (
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td className={category.type === 'income' ? 'text-success' : 'text-danger'}>
                {category.type}
              </td>
              <td>
                <button className="btn btn-primary btn-sm me-2">Edit</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No categories found.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
