import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
import Room from './Components/Pages/Room';
import ProtectedRoute from './Components/ProtectedRoute';
import EditService from './Components/Pages/EditServices';
import ConsumerDashboard from './Components/ConsumerDashboard'
import AdminDashboard from './Components/AdminDashboard'
import ServiceProviderDashboard from './Components/ServiceProviderDashboard';

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 font-[Poppins]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit-service" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
        <Route path="/consumer-dashboard" element={<ProtectedRoute><ConsumerDashboard /></ProtectedRoute>} />
        <Route path="/service-provider" element={<ProtectedRoute><ServiceProviderDashboard /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
