import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    category: ""
  });

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
    loadServices();
    loadReviews();
  }, []);

  const loadUsers = () => {
    // Get users from localStorage and ensure they have the expected structure
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // For debugging - check if there are users in localStorage
    console.log("Loaded users from localStorage:", storedUsers);

    // Ensure each user has required properties
    storedUsers = storedUsers.map((user, index) => ({
      id: user.id || index + 1,
      username: user.username || 'Unknown',
      email: user.email || 'No email',
      role: user.role || 'User'
    }));

    setUsers(storedUsers);

    // If no users are found, you might want to add some initial test data
    if (storedUsers.length === 0) {
      const initialUsers = [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'User' }
      ];
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  };

  const loadServices = () => {
    const storedServices = JSON.parse(localStorage.getItem('services')) || [];
    console.log("Loaded services from localStorage:", storedServices);
    setServices(storedServices);
  };

  const loadReviews = () => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(storedReviews);
  };

  const deleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const deleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter(service => service.id !== id);
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addService = (e) => {
    e.preventDefault();
    // Make sure we're working with numeric IDs
    const newId = services.length
      ? Math.max(...services.map(s => typeof s.id === 'number' ? s.id : 0)) + 1
      : 1;

    const newService = {
      id: newId,
      name: formData.name,
      description: formData.description,
      cost: formData.cost,
      category: formData.category
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));

    // Reset form
    setFormData({
      name: '',
      description: '',
      cost: '',
      category: ''
    });

    alert('Service added successfully!');
  };
  const filterUsers = () => {
    if (!userSearchTerm) return users;

    return users.filter(user =>
      (user.username && user.username.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
  };

  const filterServices = () => {
    if (!serviceSearchTerm) return services;

    return services.filter(service =>
      (service.name && service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())) ||
      (service.category && service.category.toLowerCase().includes(serviceSearchTerm.toLowerCase())) ||
      (service.cost && service.cost.toString().includes(serviceSearchTerm))
    );
  };

  const handleEditService = (serviceId) => {
    console.log("Editing service with ID:", serviceId);
    navigate(`/edit-service?id=${serviceId}`);
  };

  return (
    <div className="font-['Poppins',sans-serif] bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-[#1f2a44] text-white text-center py-4 text-xl font-semibold">
        Admin Dashboard - Mastang Resort
      </header>

      <div className="w-11/12 mx-auto py-5">
        <h2 className="text-center text-2xl font-semibold mb-4">User Management</h2>

        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-medium mb-3">User List</h3>
          <input
            type="text"
            placeholder="Search by name, email or role"
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />

          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">ID</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Username</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Email</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Role</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterUsers().map(user => (
                    <tr key={user.id}>
                      <td className="border border-gray-300 p-2 text-center">{user.id}</td>
                      <td className="border border-gray-300 p-2 text-center">{user.username}</td>
                      <td className="border border-gray-300 p-2 text-center">{user.email || 'No email'}</td>
                      <td className="border border-gray-300 p-2 text-center">{user.role || 'User'}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-3">No users found. Please add users to the system.</p>
          )}

          {filterUsers().length === 0 && users.length > 0 && (
            <p className="text-center py-3">No users match your search criteria.</p>
          )}
        </div>

        <h2 className="text-center text-2xl font-semibold mb-4">Service Management</h2>

        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-medium mb-3">Add Service</h3>
          <form onSubmit={addService}>
            <input
              type="text"
              name="name"
              placeholder="Service Name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
              value={formData.name}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              value={formData.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="cost"
              placeholder="Cost"
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              value={formData.cost}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              required
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              value={formData.category}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md cursor-pointer"
            >
              Add Service
            </button>
          </form>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-medium mb-3">Service List</h3>
          <input
            type="text"
            placeholder="Search by name, category, or cost"
            className="w-full p-2 border border-gray-300 rounded-md mb-3"
            value={serviceSearchTerm}
            onChange={(e) => setServiceSearchTerm(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">ID</th>
                  <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Name</th>
                  <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Description</th>
                  <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Cost</th>
                  <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Category</th>
                  <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterServices().map(service => (
                  <tr key={service.id}>
                    <td className="border border-gray-300 p-2 text-center">{service.id}</td>
                    <td className="border border-gray-300 p-2 text-center">{service.name}</td>
                    <td className="border border-gray-300 p-2 text-center">{service.description}</td>
                    <td className="border border-gray-300 p-2 text-center">${service.cost}</td>
                    <td className="border border-gray-300 p-2 text-center">{service.category}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          onClick={() => handleEditService(service.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filterServices().length === 0 && (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 p-2 text-center">No services found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-medium mb-3">Customer Reviews</h3>

          {reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Service</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">User</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Rating</th>
                    <th className="bg-[#2c3e50] text-white border border-gray-300 p-2">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">{review.service}</td>
                      <td className="border border-gray-300 p-2 text-center">{review.user}</td>
                      <td className="border border-gray-300 p-2 text-center">{review.rating}</td>
                      <td className="border border-gray-300 p-2 text-center">{review.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-3">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;