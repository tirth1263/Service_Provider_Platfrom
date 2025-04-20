import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XCircle, Bell, MessageSquare, Send, Maximize2, Minimize2, Menu } from 'lucide-react';

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
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  const [chatNotification, setChatNotification] = useState(false);
  const [activeChatUsers, setActiveChatUsers] = useState([]);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
  // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line no-unused-vars
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
    // Close mobile menu after selection on mobile
    setMobileMenuOpen(false);
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
    toast.success(`Service "${service}" accepted!`);
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
      toast.warn(`Service "${service}" declined.`);
    }
  };

  const markCompleted = (service) => {
    const updatedBookings = bookings.map(b => {
      if (b.service === service && b.status === 'accepted') {
        return { ...b, status: 'completed' };
      }
      return b;
    });

    // Update both localStorage and state
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    toast.success(`Service "${service}" marked as completed!`);
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

    toast.success('Service added successfully!');
  };

  const deleteService = (id) => {
    if (window.confirm('Delete this service?')) {
      const updatedServices = services.filter(s => s.id !== id);
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
    }
    toast.error('Service deleted!');
  };

  const updateProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    toast.info('Logged out successfully!');
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

      {/* Desktop Navigation */}
      <nav className="lg:flex justify-center flex-wrap bg-[#2c3e50] p-3 hidden">
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

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden bg-[#2c3e50] p-3 flex justify-between items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-white p-2"
        >
          <Menu size={24} />
        </button>
        <div className="text-white text-lg font-medium">
          {activeSection === 'requests' && 'Requested Services'}
          {activeSection === 'accepted' && 'Accepted Services'}
          {activeSection === 'manageServices' && 'Manage Services'}
          {activeSection === 'profile' && 'Profile Management'}
          {activeSection === 'reviews' && 'Reviews & Ratings'}
        </div>
        <div className="w-8">
          {getPendingRequestsCount() > 0 && (
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {getPendingRequestsCount()}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#2c3e50] text-white shadow-md z-40">
          <div className="flex flex-col">
            <button
              onClick={() => showSection('requests')}
              className="p-4 text-left hover:bg-[#3e5871] border-b border-[#1f2a44] flex justify-between items-center"
            >
              <span>Requested Services</span>
              {getPendingRequestsCount() > 0 && (
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {getPendingRequestsCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => showSection('accepted')}
              className="p-4 text-left hover:bg-[#3e5871] border-b border-[#1f2a44]"
            >
              Accepted Services
            </button>
            <button
              onClick={() => showSection('manageServices')}
              className="p-4 text-left hover:bg-[#3e5871] border-b border-[#1f2a44]"
            >
              Manage Services
            </button>
            <button
              onClick={() => showSection('profile')}
              className="p-4 text-left hover:bg-[#3e5871] border-b border-[#1f2a44]"
            >
              Profile Management
            </button>
            <button
              onClick={() => showSection('reviews')}
              className="p-4 text-left hover:bg-[#3e5871] border-b border-[#1f2a44]"
            >
              Reviews & Ratings
            </button>
            <button
              onClick={logout}
              className="p-4 text-left hover:bg-[#3e5871]"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="w-[90%] mx-auto p-5">
        {/* REQUESTED SERVICES SECTION */}
        {activeSection === 'requests' && (
          <>
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
                            className={`bg-green-600 text-white p-2 rounded m-1 hover:bg-green-700 w-full md:w-auto ${booking.status === 'accepted' || booking.status === 'rejected' || booking.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={booking.status === 'accepted' || booking.status === 'rejected' || booking.status === 'completed'}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => declineRequest(booking.service)}
                            className={`bg-red-600 text-white p-2 rounded m-1 hover:bg-red-700 w-full md:w-auto ${booking.status === 'accepted' || booking.status === 'rejected' || booking.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={booking.status === 'accepted' || booking.status === 'rejected' || booking.status === 'completed'}
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
          </>
        )}

        {/* ACCEPTED SERVICES SECTION */}
        {activeSection === 'accepted' && (
          <>
            <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
              <h2 className="text-center mb-5 text-xl font-semibold">Accepted Services</h2>
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
                    {bookings
                      .filter(booking => booking.status === 'accepted' || booking.status === 'completed')
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
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => markCompleted(booking.service)}
                              className={`bg-purple-600 text-white p-2 rounded m-1 hover:bg-purple-700 w-full ${booking.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={booking.status === 'completed'}
                            >
                              {booking.status === 'completed' ? 'Completed' : 'Mark Completed'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    {bookings.filter(booking => booking.status === 'accepted').length === 0 && (
                      <tr>
                        <td colSpan="4" className="border border-gray-300 p-2 text-center">No accepted bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Set Availability Section */}
            <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
              <h2 className="text-center mb-5 text-xl font-semibold">Set Service Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  >
                    <option value="">Select Service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    value={availableDate}
                    onChange={(e) => setAvailableDate(e.target.value)}
                  />

                  <button
                    onClick={setAvailability}
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                  >
                    Add Availability
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Availability</h3>
                  {Object.keys(availableDates).length === 0 ? (
                    <p className="text-gray-500">No availability set.</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto">
                      {Object.keys(availableDates).map((service) => (
                        <div key={service} className="mb-3">
                          <h4 className="font-medium">{service}</h4>
                          <ul className="list-disc pl-5">
                            {availableDates[service].map((date, i) => (
                              <li key={i} className="flex justify-between items-center">
                                <span>{new Date(date).toLocaleDateString()}</span>
                                <button
                                  onClick={() => removeAvailability(service, date)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Summary Section */}
            <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
              <h2 className="text-center mb-5 text-xl font-semibold">Revenue Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">Total Revenue</h3>
                  <p className="text-2xl font-bold">${revenueSummary.total.toFixed(2)}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Total Bookings</h3>
                  <p className="text-2xl font-bold">{revenueSummary.bookingsCount}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">Top Service</h3>
                  <p className="text-2xl font-bold">{revenueSummary.topService}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MANAGE SERVICES SECTION */}
        {activeSection === 'manageServices' && (
          <>
            <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
              <h2 className="text-center mb-5 text-xl font-semibold">Add New Service</h2>
              <form onSubmit={addService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Service Name</label>
                  <input
                    type="text"
                    name="serviceName"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={newService.serviceName}
                    onChange={(e) => handleInputChange(e, setNewService, newService)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Cost ($)</label>
                  <input
                    type="number"
                    name="serviceCost"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={newService.serviceCost}
                    onChange={(e) => handleInputChange(e, setNewService, newService)}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Category</label>
                  <select
                    name="serviceCategory"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={newService.serviceCategory}
                    onChange={(e) => handleInputChange(e, setNewService, newService)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Tour">Tour</option>
                    <option value="Water Sports">Water Sports</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Sub-category</label>
                  <input
                    type="text"
                    name="serviceSubCategory"
                    className="w-full p-3 border border-gray-300 rounded"
                    value={newService.serviceSubCategory}
                    onChange={(e) => handleInputChange(e, setNewService, newService)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2">Description</label>
                  <textarea
                    name="serviceDesc"
                    className="w-full p-3 border border-gray-300 rounded"
                    rows="4"
                    value={newService.serviceDesc}
                    onChange={(e) => handleInputChange(e, setNewService, newService)}
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
              <h2 className="text-center mb-5 text-xl font-semibold">Your Services</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Name</th>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Category</th>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Cost</th>
                      <th className="border border-gray-300 p-2 bg-[#2c3e50] text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services
                      .filter(service => service.providerId === currentProviderId)
                      .map((service, index) => (
                        <tr key={index}>
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
                    {services.filter(service => service.providerId === currentProviderId).length === 0 && (
                      <tr>
                        <td colSpan="4" className="border border-gray-300 p-2 text-center">No services found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* PROFILE MANAGEMENT SECTION */}
        {activeSection === 'profile' && (
          <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
            <h2 className="text-center mb-5 text-xl font-semibold">Profile Management</h2>
            <form onSubmit={updateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  name="providerName"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={profile.providerName}
                  onChange={(e) => handleInputChange(e, setProfile, profile)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="providerEmail"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={profile.providerEmail}
                  onChange={(e) => handleInputChange(e, setProfile, profile)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Expertise</label>
                <textarea
                  name="providerExpertise"
                  className="w-full p-3 border border-gray-300 rounded"
                  rows="4"
                  value={profile.providerExpertise}
                  onChange={(e) => handleInputChange(e, setProfile, profile)}
                  placeholder="Your professional expertise and experience..."
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Profile Photo</label>
                <input
                  type="file"
                  className="w-full p-3 border border-gray-300 rounded"
                  accept="image/*"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* REVIEWS SECTION */}
        {activeSection === 'reviews' && (
          <>
            <div className="bg-white p-5 rounded-lg mb-5 shadow-md">
              <h2 className="text-center mb-5 text-xl font-semibold">Reviews & Ratings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Analytics Overview</h3>
                  <div className="bg-blue-50 p-4 rounded mb-4">
                    <p className="text-xl">Average Rating: <span className="font-bold">{feedbackAnalytics.avgRating}/5</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${(feedbackAnalytics.avgRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Common Feedback Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(feedbackAnalytics.wordFreq)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 10)
                      .map(([word, count], i) => (
                        <span
                          key={i}
                          className="bg-gray-200 px-3 py-1 rounded text-sm"
                          style={{ fontSize: `${Math.min(count * 0.5 + 0.8, 1.5)}rem` }}
                        >
                          {word}
                        </span>
                      ))}
                    {Object.keys(feedbackAnalytics.wordFreq).length === 0 && (
                      <p className="text-gray-500">No feedback data available.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
                  <div className="max-h-96 overflow-y-auto">
                    {reviews.length === 0 ? (
                      <p className="text-gray-500">No reviews available.</p>
                    ) : (
                      reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded mb-3 border-l-4 border-blue-500">
                          <div className="flex justify-between">
                            <p className="font-semibold">{review.user}</p>
                            <p>Rating: {review.rating}/5</p>
                          </div>
                          <p className="mt-2">{review.comment}</p>
                          <p className="text-gray-500 text-sm mt-1">{review.date}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat feature */}
      <div className={`fixed bottom-5 right-5 z-40 transition-all duration-300 ${chatOpen ? 'w-80' : 'w-16'} ${chatExpanded ? 'h-auto' : 'h-auto'}`}>
        {/* Chat toggle button */}
        <button
          onClick={toggleChat}
          className={`flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 relative ${chatOpen ? 'absolute top-0 right-0' : ''}`}
        >
          <MessageSquare size={24} />
          {!chatOpen && getTotalUnreadCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {getTotalUnreadCount()}
            </span>
          )}
        </button>

        {/* Chat window */}
        {chatOpen && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full">
            {/* Chat header */}
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <div className="font-semibold flex items-center">
                {activeChat && (
                  <button
                    onClick={() => setActiveChat(null)}
                    className="mr-2 text-white hover:text-blue-200 flex items-center"
                  >
                    <span className="hidden md:inline">← back</span>
                    <span className="md:hidden">←</span>
                  </button>
                )}
                {activeChat ? getUserDisplayName(activeChat) : 'Messages'}
              </div>
              <div className="flex">
                <button
                  onClick={toggleChatExpansion}
                  className="text-white hover:text-blue-200 mr-2"
                >
                  {chatExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white hover:text-blue-200"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-hidden">
              {activeChat ? (
                <>
                  {/* Chat messages */}
                  <div className="h-[calc(100%-60px)] overflow-y-auto p-3">
                    {conversations[activeChat] && conversations[activeChat].map((msg, i) => (
                      <div
                        key={i}
                        className={`mb-2 max-w-[75%] p-2 rounded ${msg.sender === 'provider'
                          ? 'bg-blue-100 ml-auto'
                          : 'bg-gray-100'
                          }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chat input */}
                  <form onSubmit={sendMessage} className="h-[60px] border-t flex p-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-l-md focus:outline-none"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 rounded-r-md"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </>
              ) : (
                /* User list */
                <div className="h-full overflow-y-auto">
                  {activeChatUsers.map((userId) => (
                    <div
                      key={userId}
                      onClick={() => openChat(userId)}
                      className="p-3 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{getUserDisplayName(userId)}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {conversations[userId] && conversations[userId].length > 0
                            ? conversations[userId][conversations[userId].length - 1].message.substring(0, 30) + '...'
                            : 'No messages yet'}
                        </div>
                      </div>
                      {unreadMessages[userId] && (
                        <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {unreadMessages[userId]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
}

export default ServiceProviderDashboard;