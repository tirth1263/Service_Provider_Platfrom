import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('requests');
  const [bookings, setBookings] = useState(JSON.parse(localStorage.getItem('bookings')) || []);
  const [services, setServices] = useState(JSON.parse(localStorage.getItem('services')) || []);
  const [reviews, setReviews] = useState(JSON.parse(localStorage.getItem('reviews')) || []);
  const [providerId] = useState(2); // Current provider id for demo

  const showSection = (section) => {
    setActiveSection(section);
  };

  const loadRequests = () => {
    let html = (
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-left">Service</th>
            <th className="px-4 py-2 border text-left">User</th>
            <th className="px-4 py-2 border text-left">Days</th>
            <th className="px-4 py-2 border text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.service}>
              <td className="px-4 py-2 border">{b.service}</td>
              <td className="px-4 py-2 border">{b.user} ({b.email})</td>
              <td className="px-4 py-2 border">{b.days}</td>
              <td className="px-4 py-2 border">
                <button onClick={() => acceptRequest(b.service)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Accept</button>
                <button onClick={() => declineRequest(b.service)} className="bg-red-500 text-white px-4 py-2 rounded">Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    return html;
  };

  const acceptRequest = (service) => {
    const updatedBookings = bookings.map((b) => (b.service === service && b.status !== 'accepted') ? { ...b, status: 'accepted' } : b);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    alert(`Service "${service}" accepted!`);
  };

  const declineRequest = (service) => {
    if (window.confirm(`Decline "${service}"?`)) {
      const updatedBookings = bookings.map((b) => (b.service === service && b.status !== 'rejected') ? { ...b, status: 'rejected' } : b);
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      alert(`Service "${service}" declined.`);
    }
  };

  const loadAccepted = () => {
    const html = (
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-left">Service</th>
            <th className="px-4 py-2 border text-left">User</th>
            <th className="px-4 py-2 border text-left">Days</th>
            <th className="px-4 py-2 border text-left">Status</th>
            <th className="px-4 py-2 border text-left">Mark Completed</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            b.status === 'accepted' && (
              <tr key={b.service}>
                <td className="px-4 py-2 border">{b.service}</td>
                <td className="px-4 py-2 border">{b.user} ({b.email})</td>
                <td className="px-4 py-2 border">{b.days}</td>
                <td className="px-4 py-2 border">{b.status}</td>
                <td className="px-4 py-2 border">
                  <button onClick={() => markCompleted(b.service)} className="bg-blue-500 text-white px-4 py-2 rounded">Mark Completed</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    );
    return html;
  };

  const markCompleted = (service) => {
    alert(`Service "${service}" marked as completed!`);
  };

  const loadMyServices = () => {
    const myServices = services.filter((s) => s.providerId === providerId);
    const html = (
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border text-left">Name</th>
            <th className="px-4 py-2 border text-left">Category</th>
            <th className="px-4 py-2 border text-left">Cost</th>
            <th className="px-4 py-2 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {myServices.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-2 border">{s.name}</td>
              <td className="px-4 py-2 border">{s.category}</td>
              <td className="px-4 py-2 border">${s.cost}</td>
              <td className="px-4 py-2 border">
                <button onClick={() => deleteService(s.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    return html;
  };

  const deleteService = (id) => {
    if (window.confirm('Delete this service?')) {
      const updatedServices = services.filter((s) => s.id !== id);
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
    }
  };

  const loadReviews = () => {
    const html = reviews.map((r) => (
      <p key={r.service}>Service: {r.service} | Rating: {r.rating}/5 | Feedback: "{r.comment}"</p>
    ));
    return html;
  };

  const loadFeedbackAnalytics = () => {
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = (totalRating / reviews.length).toFixed(1);
    return <p><strong>Average Rating:</strong> {avgRating}/5</p>;
  };

  return (
    <div className="font-sans bg-gray-100">
      <header className="bg-blue-900 text-white text-center p-4 text-2xl font-semibold">Service Provider Dashboard - Mastang Resort</header>
      <nav className="bg-gray-800 text-white p-4 flex justify-center space-x-6">
        <Link to="#" onClick={() => showSection('requests')} className="hover:bg-yellow-400 px-4 py-2 rounded">Requested Services</Link>
        <Link to="#" onClick={() => showSection('accepted')} className="hover:bg-yellow-400 px-4 py-2 rounded">Accepted Services</Link>
        <Link to="#" onClick={() => showSection('manageServices')} className="hover:bg-yellow-400 px-4 py-2 rounded">Manage Services</Link>
        <Link to="#" onClick={() => showSection('profile')} className="hover:bg-yellow-400 px-4 py-2 rounded">Profile Management</Link>
        <Link to="#" onClick={() => showSection('reviews')} className="hover:bg-yellow-400 px-4 py-2 rounded">Reviews & Ratings</Link>
        <Link to="#" onClick={() => logout()} className="hover:bg-yellow-400 px-4 py-2 rounded">Logout</Link>
      </nav>

      <div className="container mx-auto p-6">
        {activeSection === 'requests' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Requested Services</h2>
            {loadRequests()}
          </div>
        )}
        {activeSection === 'accepted' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Accepted Services</h2>
            {loadAccepted()}
          </div>
        )}
        {activeSection === 'manageServices' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
            {loadMyServices()}
          </div>
        )}
        {activeSection === 'profile' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
            {/* Profile form goes here */}
          </div>
        )}
        {activeSection === 'reviews' && (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>
            {loadReviews()}
            {loadFeedbackAnalytics()}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;