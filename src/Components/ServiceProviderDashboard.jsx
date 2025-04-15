/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

function ServiceProviderDashboard() {
  const [activeSection, setActiveSection] = useState('requests');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceName, setServiceName] = useState('');
  const [availableDates, setAvailableDates] = useState({});
  const [availableDate, setAvailableDate] = useState('');
  const [newService, setNewService] = useState({
    serviceName: '',
    serviceDesc: '',
    serviceCost: '',
    serviceCategory: '',
    serviceSubCategory: ''
  });
  const [profile, setProfile] = useState({
    providerName: '',
    providerEmail: '',
    providerExpertise: ''
  });

  const currentProviderId = 2;

  useEffect(() => {
    // Load data from localStorage
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const storedServices = JSON.parse(localStorage.getItem('services')) || [];
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const storedAvailableDates = JSON.parse(localStorage.getItem('availableDates')) || {};
    
    setBookings(storedBookings);
    setServices(storedServices);
    setReviews(storedReviews);
    setAvailableDates(storedAvailableDates);
    
    // Check for new bookings
    alertNewBooking();
  }, []);

  const showSection = (section) => {
    setActiveSection(section);
  };

  const acceptRequest = (service) => {
    const updatedBookings = bookings.map(b => {
      if (b.service === service && b.status !== 'accepted') {
        return { ...b, status: 'accepted' };
      }
      return b;
    });
    
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    alert(`Service "${service}" accepted!`);
  };

  const declineRequest = (service) => {
    if (window.confirm(`Decline "${service}"?`)) {
      const updatedBookings = bookings.map(b => {
        if (b.service === service && b.status !== 'rejected') {
          return { ...b, status: 'rejected' };
        }
        return b;
      });
      
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      alert(`Service "${service}" declined.`);
    }
  };

  const markCompleted = (service) => {
    alert(`Service "${service}" marked as completed!`);
  };

  const addService = (e) => {
    e.preventDefault();
    
    const newServiceObj = {
      id: services.length + 1,
      name: newService.serviceName,
      description: newService.serviceDesc,
      cost: newService.serviceCost,
      category: newService.serviceCategory,
      subCategory: newService.serviceSubCategory,
      providerId: currentProviderId
    };
    
    const updatedServices = [...services, newServiceObj];
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    
    // Reset form
    setNewService({
      serviceName: '',
      serviceDesc: '',
      serviceCost: '',
      serviceCategory: '',
      serviceSubCategory: ''
    });
    
    alert('Service added!');
  };

  const deleteService = (id) => {
    if (window.confirm('Delete this service?')) {
      const updatedServices = services.filter(s => s.id !== id);
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
    }
  };

  const updateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated!');
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    alert('Logged out!');
    window.location.href = '/login';
  };

  const setAvailability = () => {
    if (!serviceName || !availableDate) return;
    
    const allAvail = { ...availableDates };
    if (!allAvail[serviceName]) {
      allAvail[serviceName] = [];
    }
    
    if (!allAvail[serviceName].includes(availableDate)) {
      allAvail[serviceName].push(availableDate);
    }
    
    setAvailableDates(allAvail);
    localStorage.setItem('availableDates', JSON.stringify(allAvail));
    setAvailableDate('');
  };

  const removeAvailability = (service, date) => {
    const allAvail = { ...availableDates };
    
    if (allAvail[service]) {
      allAvail[service] = allAvail[service].filter(d => d !== date);
      if (allAvail[service].length === 0) delete allAvail[service];
      
      setAvailableDates(allAvail);
      localStorage.setItem('availableDates', JSON.stringify(allAvail));
    }
  };

   
  const alertNewBooking = () => {
    const last = parseInt(localStorage.getItem('lastBookingCount')) || 0;
    if (bookings.length > last) {
      alert('🔔 New Booking Alert!');
      localStorage.setItem('lastBookingCount', bookings.length);
    }
  };

  // Calculate revenue summary data
  const getRevenueSummary = () => {
    const counts = {};
    let total = 0;
    let topService = '-';
    
    bookings.forEach(b => {
      if (b.revenue) total += b.revenue;
      counts[b.service] = (counts[b.service] || 0) + 1;
    });
    
    if (Object.keys(counts).length > 0) {
      topService = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '-');
    }
    
    return {
      total,
      bookingsCount: bookings.length,
      topService
    };
  };

  // Calculate feedback analytics
  const getFeedbackAnalytics = () => {
    if (!reviews.length) return { avgRating: 0, wordFreq: {} };
    
    let total = 0;
    const wordFreq = {};
    
    reviews.forEach(r => {
      total += parseInt(r.rating);
      r.comment.split(' ').forEach(w => {
        w = w.toLowerCase();
        if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
      });
    });
    
    const avgRating = (total / reviews.length).toFixed(1);
    return { avgRating, wordFreq };
  };

  const revenueSummary = getRevenueSummary();
  const feedbackAnalytics = getFeedbackAnalytics();

  const handleInputChange = (e, formSetter, formState) => {
    formSetter({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="font-['Poppins'] bg-gray-100 min-h-screen">
      <header className="bg-[#1f2a44] text-white p-5 text-center text-2xl font-semibold">
        Service Provider Dashboard - Mastang Resort
      </header>
      
      <nav className="flex justify-center flex-wrap bg-[#2c3e50] p-3">
        <button onClick={() => showSection('requests')} className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg">
          Requested Services
        </button>
        <button onClick={() => showSection('accepted')} className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg">
          Accepted Services
        </button>
        <button onClick={() => showSection('manageServices')} className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg">
          Manage Services
        </button>
        <button onClick={() => showSection('profile')} className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg">
          Profile Management
        </button>
        <button onClick={() => showSection('reviews')} className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg">
          Reviews & Ratings
        </button>
        <button onClick={logout} className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg">
          Logout
        </button>
      </nav>

      <div className="w-[90%] mx-auto p-5">
        {activeSection === 'requests' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Requested Services</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Service</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">User</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Days</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.user} ({booking.email})</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button 
                          onClick={() => acceptRequest(booking.service)}
                          className="bg-green-600 text-white p-2 rounded m-1 hover:bg-green-700 w-full md:w-auto"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => declineRequest(booking.service)}
                          className="bg-red-600 text-white p-2 rounded m-1 hover:bg-red-700 w-full md:w-auto"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Summary Section */}
        <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
          <h2 className="text-center mb-5 text-xl font-semibold">Revenue Summary</h2>
          <p className=""><strong>Total Earnings:</strong> ${revenueSummary.total}</p>
          <p className=""><strong>Total Bookings:</strong> {revenueSummary.bookingsCount}</p>
          <p className=""><strong>Most Booked Service:</strong> {revenueSummary.topService}</p>
        </div>

        {/* Filter Bookings Section */}
        <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
          <h2 className="text-center mb-5 text-xl font-semibold">Filter Bookings</h2>
          <select 
            className="w-full p-3 border border-gray-300 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Availability Calendar Section */}
        <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
          <h2 className="text-center mb-5 text-xl font-semibold">Set Availability</h2>
          <label className="block mb-2">Enter Service Name:</label>
          <input 
            type="text" 
            placeholder="Type the service name" 
            className="w-full p-3 border border-gray-300 rounded mb-4"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />

          <label className="block mb-2">Select Available Date:</label>
          <input 
            type="date" 
            className="w-full p-3 border border-gray-300 rounded mb-4"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
          />
          <button 
            className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
            onClick={setAvailability}
          >
            Add Availability
          </button>

          <div className="mt-4">
            {availableDates[serviceName] && availableDates[serviceName].map((date, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <span>{date}</span>
                <button 
                  className="bg-red-600 text-white p-1 px-2 rounded hover:bg-red-700 flex items-center"
                  onClick={() => removeAvailability(serviceName, date)}
                >
                  <XCircle size={16} className="mr-1" /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Analytics Section */}
        <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
          <h2 className="text-center mb-5 text-xl font-semibold">Feedback Analytics</h2>
          <p><strong>Average Rating:</strong> {feedbackAnalytics.avgRating}/5</p>
          <div className="mt-4 flex flex-wrap">
            {Object.entries(feedbackAnalytics.wordFreq).map(([word, freq], index) => (
              <span 
                key={index} 
                className="mr-2 mb-2"
                style={{ fontSize: `${12 + freq * 2}px` }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {activeSection === 'accepted' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Accepted Services</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Service</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">User</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Days</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Status</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Mark Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(b => statusFilter === 'all' || b.status === statusFilter)
                    .map((booking, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                        <td className="border border-gray-300 p-2 text-center">{booking.user} ({booking.email})</td>
                        <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                        <td className="border border-gray-300 p-2 text-center">{booking.status || 'upcoming'}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button 
                            onClick={() => markCompleted(booking.service)}
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full"
                          >
                            Mark Completed
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'manageServices' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Manage Services</h2>
            <form onSubmit={addService} className="mb-5">
              <input 
                type="text" 
                name="serviceName"
                placeholder="Service Name" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={newService.serviceName}
                onChange={(e) => handleInputChange(e, setNewService, newService)}
              />
              <input 
                type="text" 
                name="serviceDesc"
                placeholder="Description" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={newService.serviceDesc}
                onChange={(e) => handleInputChange(e, setNewService, newService)}
              />
              <input 
                type="number" 
                name="serviceCost"
                placeholder="Cost" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={newService.serviceCost}
                onChange={(e) => handleInputChange(e, setNewService, newService)}
              />
              <input 
                type="text" 
                name="serviceCategory"
                placeholder="Category" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={newService.serviceCategory}
                onChange={(e) => handleInputChange(e, setNewService, newService)}
              />
              <input 
                type="text" 
                name="serviceSubCategory"
                placeholder="Sub-category" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={newService.serviceSubCategory}
                onChange={(e) => handleInputChange(e, setNewService, newService)}
              />
              <button 
                type="submit"
                className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Service
              </button>
            </form>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Name</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Category</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Cost</th>
                    <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .filter(s => s.providerId === currentProviderId)
                    .map((service) => (
                      <tr key={service.id}>
                        <td className="border border-gray-300 p-2 text-center">{service.name}</td>
                        <td className="border border-gray-300 p-2 text-center">{service.category}</td>
                        <td className="border border-gray-300 p-2 text-center">${service.cost}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button 
                            onClick={() => deleteService(service.id)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 w-full"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Profile Management</h2>
            <form onSubmit={updateProfile}>
              <input 
                type="text" 
                name="providerName"
                placeholder="Name" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={profile.providerName}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
              />
              <input 
                type="email" 
                name="providerEmail"
                placeholder="Email" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={profile.providerEmail}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
              />
              <input 
                type="text" 
                name="providerExpertise"
                placeholder="Expertise" 
                required
                className="w-full p-3 mb-3 border border-gray-300 rounded"
                value={profile.providerExpertise}
                onChange={(e) => handleInputChange(e, setProfile, profile)}
              />
              <button 
                type="submit"
                className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

        {activeSection === 'reviews' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Reviews & Ratings</h2>
            <div>
              {reviews.map((review, index) => (
                <div key={index} className="p-3 border-b">
                  <p>Service: <strong>{review.service}</strong> | Rating: <strong>{review.rating}/5</strong></p>
                  <p>Feedback: "{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceProviderDashboard;

