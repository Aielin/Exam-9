import { Route, Routes } from 'react-router-dom';
import FormContainer from './containers/FormContainer/FormContainer.tsx';
import TransactionsPage from './containers/TransactionsPage/TransactionsPage.tsx';
import CategoriesPage from './containers/CategoriesPage/CategoriesPage.tsx';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TransactionsPage />} />
      <Route path="/transactions/add" element={<FormContainer />} />
      <Route path="/transactions/edit/:id" element={<FormContainer />} />
      <Route path="/categories" element={<CategoriesPage />} />
    </Routes>

  );
};

export default App;