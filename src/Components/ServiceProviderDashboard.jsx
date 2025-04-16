import React, { useState, useEffect } from 'react';
import { XCircle, Bell, MessageSquare, Send, Maximize2, Minimize2 } from 'lucide-react';

function ServiceProviderDashboard() {
  const [activeSection, setActiveSection] = useState('requests');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceName, setServiceName] = useState('');
  const [availableDates, setAvailableDates] = useState({});
  const [availableDate, setAvailableDate] = useState('');
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
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

  // Chat feature states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [chatNotification, setChatNotification] = useState(false);
  const [activeChatUsers, setActiveChatUsers] = useState([]);

  const currentProviderId = 2;

  // Check for new bookings every 30 seconds
  useEffect(() => {
    // Initial load
    loadData();

    // Set up interval for checking new bookings
    const intervalId = setInterval(() => {
      checkForNewBookings();
    }, 30000); // Check every 30 seconds

    // Set up storage event listener for real-time updates
    window.addEventListener('storage', handleStorageChange);

    // Load mock chat data
    loadMockChatData();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load mock chat data
  const loadMockChatData = () => {
    const mockConversations = {
      'john_doe': [
        { sender: 'user', message: 'Hello, I have a question about my kayaking booking.', timestamp: '10:30 AM' },
        { sender: 'provider', message: 'Hi John! How can I help you with your kayaking booking?', timestamp: '10:32 AM' },
        { sender: 'user', message: 'I want to know if I can bring my 10-year-old child.', timestamp: '10:33 AM' }
      ],
      'sarah_smith': [
        { sender: 'user', message: 'Hi, I need to reschedule my spa appointment.', timestamp: '11:15 AM' },
        { sender: 'provider', message: 'Hi, I need to reschedule my spa appointment.', timestamp: '11:15 AM' },
      ],
      'mike_jones': [
        { sender: 'user', message: 'Can I get a refund for my boat tour?', timestamp: '9:45 AM' }
      ]
    };

    setConversations(mockConversations);
    setUnreadMessages({
      'john_doe': 1,
      'mike_jones': 1
    });

    setActiveChatUsers(['john_doe', 'sarah_smith', 'mike_jones']);
  };

  // Toggle chat window
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) {
      setChatNotification(false);
    }
  };

  // Toggle chat expansion
  const toggleChatExpansion = () => {
    setChatExpanded(!chatExpanded);
  };

  // Open specific chat
  const openChat = (userId) => {
    setActiveChat(userId);

    // Mark messages as read
    if (unreadMessages[userId]) {
      const updatedUnread = { ...unreadMessages };
      delete updatedUnread[userId];
      setUnreadMessages(updatedUnread);
    }
  };

  // Send message in chat
  const sendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      sender: 'provider',
      message: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversations = { ...conversations };
    if (!updatedConversations[activeChat]) {
      updatedConversations[activeChat] = [];
    }

    updatedConversations[activeChat] = [...updatedConversations[activeChat], newMessage];
    setConversations(updatedConversations);
    setMessageInput('');
  };

  // Mock receive message (for demo purposes)
  const mockReceiveMessage = (userId) => {
    const mockResponses = [
      "Thank you for your response!",
      "When can I expect you to be available?",
      "That's perfect, I appreciate your help.",
      "Do you have any availability this weekend?",
      "Great, I'll see you then!"
    ];

    const randomMessage = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    const newMessage = {
      sender: 'user',
      message: randomMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedConversations = { ...conversations };
    if (!updatedConversations[userId]) {
      updatedConversations[userId] = [];
    }

    updatedConversations[userId] = [...updatedConversations[userId], newMessage];
    setConversations(updatedConversations);

    // Add unread notification if not in active chat
    if (activeChat !== userId) {
      const updatedUnread = { ...unreadMessages };
      updatedUnread[userId] = (updatedUnread[userId] || 0) + 1;
      setUnreadMessages(updatedUnread);
      setChatNotification(true);
    }
  };

  // Function to handle localStorage changes from other tabs/windows
  const handleStorageChange = (event) => {
    if (event.key === 'bookings') {
      checkForNewBookings();
    }
  };

  // Load all data from localStorage
  const loadData = () => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const storedServices = JSON.parse(localStorage.getItem('services')) || [];
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const storedAvailableDates = JSON.parse(localStorage.getItem('availableDates')) || {};

    setBookings(storedBookings);
    setServices(storedServices);
    setReviews(storedReviews);
    setAvailableDates(storedAvailableDates);

    // Check for new bookings on initial load
    checkForNewBookings();
  };

  // Check for new bookings
  const checkForNewBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const lastCount = parseInt(localStorage.getItem('lastBookingCount')) || 0;
    const lastProcessedIds = JSON.parse(localStorage.getItem('lastProcessedBookingIds')) || [];

    // Check if there are new bookings
    const newBookings = storedBookings.filter(booking =>
      !lastProcessedIds.includes(booking.id) &&
      (booking.status === 'pending' || !booking.status)
    );

    if (newBookings.length > 0) {
      // Update bookings state
      setBookings(storedBookings);

      // Show notification
      setNotification(true);
      setNotificationCount(newBookings.length);
      setNotificationMessage(`${newBookings.length} new booking request${newBookings.length > 1 ? 's' : ''}!`);

      // Play sound (optional)
      try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
        audio.play();
      } catch (e) {
        console.log('Sound playback failed:', e);
      }

      // Save processed booking IDs
      const processedIds = [
        ...lastProcessedIds,
        ...newBookings.map(booking => booking.id)
      ];
      localStorage.setItem('lastProcessedBookingIds', JSON.stringify(processedIds));
      localStorage.setItem('lastBookingCount', storedBookings.length);

      // Auto-hide notification after 10 seconds
      setTimeout(() => {
        setNotification(false);
      }, 10000);
    }
  };

  const dismissNotification = () => {
    setNotification(false);
  };

  const showSection = (section) => {
    setActiveSection(section);
    if (section === 'requests') {
      setNotification(false);
    }
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
    const updatedBookings = bookings.map(b => {
      if (b.service === service && b.status === 'accepted') {
        return { ...b, status: 'completed' };
      }
      return b;
    });

    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
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

  // Filter bookings based on the selected filter
  const getFilteredBookings = () => {
    if (statusFilter === 'all') {
      return bookings;
    } else {
      return bookings.filter(booking => booking.status === statusFilter);
    }
  };

  // Get count of pending requests
  const getPendingRequestsCount = () => {
    return bookings.filter(b => !b.status || b.status === 'pending').length;
  };

  // Get total unread messages count
  const getTotalUnreadCount = () => {
    return Object.values(unreadMessages).reduce((total, count) => total + count, 0);
  };

  // Get user display name
  const getUserDisplayName = (userId) => {
    const names = {
      'john_doe': 'John Doe',
      'sarah_smith': 'Sarah Smith',
      'mike_jones': 'Mike Jones'
    };
    return names[userId] || userId;
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-5 bg-white shadow-lg rounded-lg p-4 z-50 w-64 border-l-4 border-yellow-500 animate-bounce">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bell size={20} className="text-yellow-500 mr-2" />
              <span className="font-semibold">New Booking Alert!</span>
            </div>
            <button
              onClick={dismissNotification}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={20} />
            </button>
          </div>
          <p className="mt-2">{notificationMessage}</p>
          <button
            onClick={() => showSection('requests')}
            className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded text-sm hover:bg-yellow-600 w-full"
          >
            View Requests
          </button>
        </div>
      )}

      <header className="bg-[#1f2a44] text-white p-5 text-center text-2xl font-semibold">
        Service Provider Dashboard - Mastang Resort
      </header>

      <nav className="flex justify-center flex-wrap bg-[#2c3e50] p-3">
        <button
          onClick={() => showSection('requests')}
          className="text-white mx-2 my-1 px-4 py-2 rounded hover:bg-[#f39c12] hover:text-black text-lg relative"
        >
          Requested Services
          {getPendingRequestsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {getPendingRequestsCount()}
            </span>
          )}
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
                    <tr key={index} className={(!booking.status || booking.status === 'pending') ? 'bg-yellow-50' : ''}>
                      <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {booking.user}
                        <button
                          onClick={() => {
                            // Convert user name to userId format (demo purposes)
                            const userId = booking.user.toLowerCase().replace(' ', '_');
                            openChat(userId);
                            toggleChat();
                          }}
                          className="ml-2 bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                        >
                          <MessageSquare size={14} className="inline mr-1" />
                          Chat
                        </button>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => acceptRequest(booking.service)}
                          className={`bg-green-600 text-white p-2 rounded m-1 hover:bg-green-700 w-full md:w-auto ${booking.status === 'accepted' || booking.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={booking.status === 'accepted' || booking.status === 'rejected'}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineRequest(booking.service)}
                          className={`bg-red-600 text-white p-2 rounded m-1 hover:bg-red-700 w-full md:w-auto ${booking.status === 'accepted' || booking.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={booking.status === 'accepted' || booking.status === 'rejected'}
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
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Show filtered bookings */}
          <div className="mt-4 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Filtered Bookings</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Service</th>
                  <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">User</th>
                  <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Days</th>
                  <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredBookings().map((booking, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                    <td className="border border-gray-300 p-2 text-center">{booking.user}</td>
                    <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                    <td className="border border-gray-300 p-2 text-center">{booking.status || 'upcoming'}</td>
                  </tr>
                ))}
                {getFilteredBookings().length === 0 && (
                  <tr>
                    <td colSpan="4" className="border border-gray-300 p-2 text-center">No bookings found with the selected filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                  {getFilteredBookings()
                    .map((booking, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {booking.user}
                          <button
                            onClick={() => {
                              // Convert user name to userId format (demo purposes)
                              const userId = booking.user.toLowerCase().replace(' ', '_');
                              openChat(userId);
                              toggleChat();
                            }}
                            className="ml-2 bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                          >
                            <MessageSquare size={14} className="inline mr-1" />
                            Chat
                          </button>
                        </td>
                        <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                        <td className="border border-gray-300 p-2 text-center">{booking.status || 'upcoming'}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            onClick={() => markCompleted(booking.service)}
                            className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full ${booking.status === 'completed' || booking.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={booking.status === 'completed' || booking.status === 'rejected'}
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

            <div>
              <h3 className="font-semibold mb-2">Add New Service:</h3>
              <form onSubmit={addService} className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Service Name:</label>
                    <input
                      type="text"
                      name="serviceName"
                      value={newService.serviceName}
                      onChange={(e) => handleInputChange(e, setNewService, newService)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Service Cost ($):</label>
                    <input
                      type="number"
                      name="serviceCost"
                      value={newService.serviceCost}
                      onChange={(e) => handleInputChange(e, setNewService, newService)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Category:</label>
                    <input
                      type="text"
                      name="serviceCategory"
                      value={newService.serviceCategory}
                      onChange={(e) => handleInputChange(e, setNewService, newService)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Sub-Category:</label>
                    <input
                      type="text"
                      name="serviceSubCategory"
                      value={newService.serviceSubCategory}
                      onChange={(e) => handleInputChange(e, setNewService, newService)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Description:</label>
                  <textarea
                    name="serviceDesc"
                    value={newService.serviceDesc}
                    onChange={(e) => handleInputChange(e, setNewService, newService)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Service
                </button>
              </form>

              <h3 className="font-semibold mb-2 mt-6">Your Services:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Name</th>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Cost</th>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Category</th>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.filter(s => s.providerId === currentProviderId).map((service, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 text-center">{service.name}</td>
                        <td className="border border-gray-300 p-2 text-center">${service.cost}</td>
                        <td className="border border-gray-300 p-2 text-center">{service.category}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            onClick={() => deleteService(service.id)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
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
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Profile Management</h2>

            <form onSubmit={updateProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    name="providerName"
                    value={profile.providerName}
                    onChange={(e) => handleInputChange(e, setProfile, profile)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email:</label>
                  <input
                    type="email"
                    name="providerEmail"
                    value={profile.providerEmail}
                    onChange={(e) => handleInputChange(e, setProfile, profile)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Expertise/Bio:</label>
                <textarea
                  name="providerExpertise"
                  value={profile.providerExpertise}
                  onChange={(e) => handleInputChange(e, setProfile, profile)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                  placeholder="Describe your expertise and experience..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

        {activeSection === 'reviews' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Reviews & Ratings</h2>

            <div className="mb-5">
              <div className="text-center p-4 bg-gray-100 rounded mb-4">
                <h3 className="text-lg font-semibold">Overall Rating</h3>
                <div className="text-3xl font-bold text-yellow-500">{feedbackAnalytics.avgRating}/5</div>
                <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
              </div>

              <h3 className="font-semibold mb-2">Recent Reviews:</h3>
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">{review.user}</div>
                        <div className="text-yellow-500">{review.rating}/5 stars</div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <div className="text-xs text-gray-500 mt-2">For: {review.service}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Widget */}
      <div className={`fixed bottom-5 right-5 z-50 ${chatOpen ? 'block' : 'block'}`}>
        {/* Chat Toggle Button */}
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center relative"
        >
          <MessageSquare size={24} />
          {getTotalUnreadCount() > 0 && !chatOpen && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {getTotalUnreadCount()}
            </span>
          )}
        </button>

        {/* Chat Window */}
        {chatOpen && (
          <div
            className={`bg-white rounded-lg shadow-xl overflow-hidden absolute bottom-16 right-0 transition-all duration-300 ease-in-out ${chatExpanded ? 'w-96 h-96' : 'w-80 h-80'
              }`}
          >
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center">
                {activeChat && (
                  <button
                    onClick={() => setActiveChat(null)}
                    className="mr-2 text-white hover:text-gray-200"
                  >
                    ← Back
                  </button>
                )}
                <h3 className="font-semibold">
                  {activeChat ? `Chat with ${getUserDisplayName(activeChat)}` : 'Customer Chat'}
                </h3>
              </div>
              <div className="flex items-center">
                <button onClick={toggleChatExpansion} className="mr-2 text-white hover:text-gray-200">
                  {chatExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={toggleChat} className="text-white hover:text-gray-200">
                  <XCircle size={18} />
                </button>
              </div>
            </div>

            {/* Chat Sidebar (When No Chat is Selected) */}
            {!activeChat && (
              <div className="h-full overflow-y-auto p-2">
                <h4 className="text-sm font-semibold text-gray-600 mb-2 px-2">Active Conversations</h4>
                {activeChatUsers.map((userId) => (
                  <div
                    key={userId}
                    onClick={() => openChat(userId)}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                        {getUserDisplayName(userId).charAt(0)}
                      </div>
                      <span>{getUserDisplayName(userId)}</span>
                    </div>
                    {unreadMessages[userId] && (
                      <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {unreadMessages[userId]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            {activeChat && (
              <>
                <div className="h-[calc(100%-96px)] overflow-y-auto p-3">
                  {conversations[activeChat] && conversations[activeChat].map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 max-w-[75%] ${msg.sender === 'provider'
                          ? 'ml-auto bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                          : 'mr-auto bg-gray-200 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'
                        } p-2 rounded-lg`}
                    >
                      <p>{msg.message}</p>
                      <div className={`text-xs mt-1 ${msg.sender === 'provider' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceProviderDashboard;