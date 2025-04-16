// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const registerUser = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert('Please enter your name to continue');
      return;
    }

    // Admin email restriction
    if (email === 'tirth.rank@gmail.com') {
      alert('This email is reserved for admin!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some((u) => u.email === email);
    const passwordExists = users.some((u) => u.password === password);

    // Check if email already exists
    if (emailExists && passwordExists) {
      // If both email and password exist, show error message
      alert('This password is already in use. Please choose a different password.');
      return;
    }

    // Allow same email but with different password
    if (emailExists) {
      // If only email exists, replace the existing user with new details
      const updatedUsers = users.filter(u => u.email !== email);
      updatedUsers.push({ name, email, password, role });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      alert('Your account has been updated with new information. Please login.');
      navigate('/login');
      return;
    }

    // Check if password already exists with different email
    if (passwordExists) {
      alert('This password is already in use by another account. Please choose a different password.');
      return;
    }

    // Save new user
    users.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-poppins px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">Register</h2>
        <form onSubmit={registerUser}>
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
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="provider">Service Provider</option>
          </select>
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-gray-700 hover:text-gray-900">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;