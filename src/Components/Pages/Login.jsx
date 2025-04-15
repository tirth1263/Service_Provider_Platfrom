import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginUser = (event) => {
    event.preventDefault();

    // Admin check
    if (email === 'tirth.rank@gmail.com' && password === 'Tirth@1263') {
      alert('Welcome Admin!');
      localStorage.setItem('username', email);
      navigate('/admin-dashboard');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('username', user.email);
      alert(`Welcome ${user.role}!`);

      // Route based on role
      if (user.role === 'consumer') {
        navigate('/rooms');
      } else if (user.role === 'provider') {
        navigate('/service-provider');
      }
    } else {
      alert('Invalid email or password. Please register first.');
      navigate('/register');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">Login</h2>
        <form onSubmit={loginUser}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="text-gray-700 hover:text-gray-900">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
