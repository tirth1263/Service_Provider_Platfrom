import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginUser = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name to continue');
      return;
    }

    // Admin check
    if (email === 'tirth.rank@gmail.com' && password === 'Tirth@1263') {
      toast.success(`Welcome Admin ${name}!`);
      localStorage.setItem('username', email);
      localStorage.setItem('userFullName', name);
      navigate('/admin-dashboard');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      // Verify name matches stored name
      if (user.name && user.name !== name) {
        toast.error('Name does not match our records. Please try again.');
        return;
      }

      localStorage.setItem('username', user.email);
      localStorage.setItem('userFullName', name);
      toast.success(`Welcome ${name} (${user.role})!`);

      // Route based on role
      if (user.role === 'customer') {
        navigate('/consumer-dashboard');
      } else if (user.role === 'provider') {
        navigate('/service-provider');
      }
    } else {
      toast.error('Invalid email or password. Please register first.');
      navigate('/register');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins px-4 py-6 sm:px-6 md:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Login</h2>
        <form onSubmit={loginUser} className="space-y-3 sm:space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full p-2 sm:p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4 sm:mt-6">
          <Link to="/register" className="text-gray-700 hover:text-gray-900 text-sm sm:text-base">
            Don't have an account? Register
          </Link>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />


    </div>
  );
};

export default Login;