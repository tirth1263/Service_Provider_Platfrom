import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Pages/Login';
import Register from './Components/Pages/Register';
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
        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit-service" element={<EditService />} />
        <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
        <Route path="/service-provider" element={<ServiceProviderDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
