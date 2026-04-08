import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Salaries from './pages/Salaries';
import Expenses from './pages/Expenses';
import Passwords from './pages/Passwords';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';

const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/salaries" element={<Salaries />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/passwords" element={<Passwords />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
