import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginUser = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert('Please enter your name to continue');
      return;
    }

    // Admin check
    if (email === 'tirth.rank@gmail.com' && password === 'Tirth@1263') {
      alert(`Welcome Admin ${name}!`);
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
        alert('Name does not match our records. Please try again.');
        return;
      }
      
      localStorage.setItem('username', user.email);
      localStorage.setItem('userFullName', name);
      alert(`Welcome ${name} (${user.role})!`);

      // Route based on role
      if (user.role === 'customer') {
        navigate('/consumer-dashboard');
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
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          />
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