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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadUsers();
    loadServices();
    loadReviews();
    
    // Load user theme preference
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.themePreference) {
      setDarkMode(currentUser.themePreference === 'dark');
    } else {
      // Default to system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply theme classes when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    
    // Save user preference
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.themePreference = newTheme ? 'dark' : 'light';
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Also update the user in the users array
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = allUsers.map(user => {
        if (user.id === currentUser.id) {
          return {...user, themePreference: newTheme ? 'dark' : 'light'};
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const loadUsers = () => {
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    console.log("Loaded users from localStorage:", storedUsers);
    storedUsers = storedUsers.map((user, index) => ({
      id: user.id || index + 1,
      name: user.name || 'Unknown',  // Using name instead of username to match your data structure
      email: user.email || 'No email',
      role: user.role || 'User',
      themePreference: user.themePreference || 'light'
    }));
    setUsers(storedUsers);
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
      (user.name && user.name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
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

  const handleAddNewService = () => {
    navigate('/edit-service');
  };

  // Export functionality
  const exportToJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleExportUsers = () => {
    exportToJSON(users, 'users_list.json');
  };

  const handleExportServices = () => {
    exportToJSON(services, 'services_list.json');
  };

  // Dynamically generate classes based on theme with emerald colors
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-emerald-50';
  const textColor = darkMode ? 'text-white' : 'text-gray-800';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const headerBg = darkMode ? 'bg-emerald-900' : 'bg-emerald-800';
  const tableBg = darkMode ? 'bg-emerald-900' : 'bg-emerald-700';
  const tableHeaderText = 'text-white';
  const tableBodyBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const tableBorder = darkMode ? 'border-gray-700' : 'border-emerald-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-white';
  const inputText = darkMode ? 'text-white' : 'text-gray-800';
  const inputBorder = darkMode ? 'border-gray-600' : 'border-emerald-300';
  const buttonBg = darkMode ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700';
  const deleteButtonBg = darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700';
  const editButtonBg = darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600';

  return (
    <div className={`font-['Poppins',sans-serif] ${bgColor} ${textColor} min-h-screen`}>
      <header className={`${headerBg} text-white text-center py-4 text-xl font-semibold relative`}>
        <div className="absolute right-4 top-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-emerald-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              // Sun icon for light mode
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        Admin Dashboard - Mastang Resort
      </header>

      <div className="w-11/12 mx-auto py-5">
        <h2 className="text-center text-2xl font-semibold mb-4">User Management</h2>

        <div className={`${cardBg} p-5 rounded-lg shadow-md mb-6`}>
          <h3 className="text-xl font-medium mb-3">User List</h3>
          <input
            type="text"
            placeholder="Search by name, email or role"
            className={`w-full p-2 ${inputBg} ${inputText} border ${inputBorder} rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />

          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>ID</th>
                    <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Username</th>
                    <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Email</th>
                    <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Role</th>
                    <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Theme</th>
                    <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterUsers().map(user => (
                    <tr key={user.id} className={tableBodyBg}>
                      <td className={`border ${tableBorder} p-2 text-center`}>{user.id}</td>
                      <td className={`border ${tableBorder} p-2 text-center`}>{user.name}</td>
                      <td className={`border ${tableBorder} p-2 text-center`}>{user.email || 'No email'}</td>
                      <td className={`border ${tableBorder} p-2 text-center`}>{user.role || 'User'}</td>
                      <td className={`border ${tableBorder} p-2 text-center`}>{user.themePreference || 'light'}</td>
                      <td className={`border ${tableBorder} p-2 text-center`}>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className={`${deleteButtonBg} text-white py-1 px-3 rounded`}
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

          <div className="flex justify-end mt-4">
            <button
              onClick={handleExportUsers}
              className={`${buttonBg} text-white py-2 px-4 rounded`}
            >
              Export Users to JSON
            </button>
          </div>

        </div>

        <h2 className="text-center text-2xl font-semibold mb-4">Service Management</h2>

        <div className={`${cardBg} p-5 rounded-lg shadow-md mb-6`}>
          <h3 className="text-xl font-medium mb-3">Service List</h3>
          <input
            type="text"
            placeholder="Search by name, category, or cost"
            className={`w-full p-2 ${inputBg} ${inputText} border ${inputBorder} rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            value={serviceSearchTerm}
            onChange={(e) => setServiceSearchTerm(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>ID</th>
                  <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Name</th>
                  <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Description</th>
                  <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Cost</th>
                  <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Category</th>
                  <th className={`${tableBg} ${tableHeaderText} border ${tableBorder} p-2`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterServices().map(service => (
                  <tr key={service.id} className={tableBodyBg}>
                    <td className={`border ${tableBorder} p-2 text-center`}>{service.id}</td>
                    <td className={`border ${tableBorder} p-2 text-center`}>{service.name}</td>
                    <td className={`border ${tableBorder} p-2 text-center`}>{service.description}</td>
                    <td className={`border ${tableBorder} p-2 text-center`}>${service.cost}</td>
                    <td className={`border ${tableBorder} p-2 text-center`}>{service.category}</td>
                    <td className={`border ${tableBorder} p-2 text-center`}>
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          onClick={() => handleEditService(service.id)}
                          className={`${editButtonBg} text-white px-4 py-2 rounded-md`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className={`${deleteButtonBg} text-white px-4 py-2 rounded-md`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <button
              onClick={handleAddNewService}
              className={`${editButtonBg} text-white py-2 px-4 rounded`}
            >
              Add Service
            </button>
            <button
              onClick={handleExportServices}
              className={`${buttonBg} text-white py-2 px-4 rounded`}
            >
              Export Services to JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;