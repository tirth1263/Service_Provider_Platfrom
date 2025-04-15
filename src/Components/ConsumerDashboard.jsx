import React, { useState, useEffect } from 'react';

function UserDashboard() {
  const [activeSection, setActiveSection] = useState('services');
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [availability, setAvailability] = useState({});
  const [serviceQuery, setServiceQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [reviewData, setReviewData] = useState({
    service: '',
    rating: '5',
    comment: ''
  });
  const [currentUser, setCurrentUser] = useState({ username: "User" });

  useEffect(() => {
    // Load data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedServices = localStorage.getItem('services');
    const storedBookings = localStorage.getItem('bookings');
    const storedReviews = localStorage.getItem('reviews');
    const storedWishlist = localStorage.getItem('wishlist');
    const storedAvailability = localStorage.getItem('availableDates');

    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    
    // Define room data
    const roomServices = [
      { 
        id: 'room1', 
        name: "Standard Room", 
        description: "Comfortable room with basic amenities",
        category: "Budget", 
        cost: 100, 
        available: true, 
        image: "img1.jpg" 
      },
      { 
        id: 'room2', 
        name: "Deluxe Room", 
        description: "Spacious room with premium amenities", 
        category: "Premium", 
        cost: 150, 
        available: true, 
        image: "img2.jpg" 
      },
      { 
        id: 'room3', 
        name: "Suite", 
        description: "Luxurious suite with separate living area", 
        category: "Luxury", 
        cost: 180, 
        available: true, 
        image: "img3.jpg" 
      },
      { 
        id: 'room4', 
        name: "Villa", 
        description: "Private villa with exclusive amenities", 
        category: "Premium", 
        cost: 300, 
        available: true, 
        image: "img4.jpg" 
      }
    ];
    
    // Merge room services with existing services
    let allServices = [];
    if (storedServices) {
      allServices = [...JSON.parse(storedServices)];
    }
    
    // Check if room services already exist to avoid duplicates
    const existingRoomIds = allServices.filter(s => s.id.toString().startsWith('room')).map(s => s.id);
    const newRooms = roomServices.filter(r => !existingRoomIds.includes(r.id));
    
    if (newRooms.length > 0) {
      allServices = [...allServices, ...newRooms];
      localStorage.setItem('services', JSON.stringify(allServices));
    }
    
    setServices(allServices);
    
    if (storedBookings) setBookings(JSON.parse(storedBookings));
    if (storedReviews) setReviews(JSON.parse(storedReviews));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedAvailability) setAvailability(JSON.parse(storedAvailability));
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    
    // If switching to calendar, reset selected date
    if (section === 'calendar') {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setSelectedDate(formattedDate);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    alert('Logged out!');
    window.location.href = 'login.html';
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully! (Simulated)');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReviews = [...reviews, {
      service: reviewData.service,
      rating: reviewData.rating,
      comment: reviewData.comment,
      user: currentUser.username
    }];
    
    setReviews(newReviews);
    localStorage.setItem('reviews', JSON.stringify(newReviews));
    alert('Feedback submitted!');
    
    // Reset form
    setReviewData({
      service: '',
      rating: '5',
      comment: ''
    });
  };

  const bookService = (serviceId) => {
    const daysElem = document.getElementById(`days-${serviceId}`);
    const dateElem = document.getElementById(`date-${serviceId}`);
    
    if (!daysElem || !dateElem) return;
    
    const days = daysElem.value;
    const date = dateElem.value;
    
    if (!date) {
      alert('Please select a booking date.');
      return;
    }
    
    const service = services.find(s => s.id === serviceId);
    const availableDates = availability[service.name] || [];
    
    if (availableDates.length) {
      const earliest = availableDates.sort()[0];
      if (new Date(date) < new Date(earliest)) {
        alert(`"${service.name}" is available from ${earliest}. Please choose a valid date.`);
        return;
      }
    }
    
    const newBooking = {
      id: bookings.length + 1,
      service: service.name,
      user: currentUser.username,
      email: currentUser.email,
      days: days,
      date: date,
      revenue: service.cost * days,
      status: 'pending'
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    alert(`Service "${service.name}" booked for ${date}!`);
  };

  const handleDateClick = (day) => {
    // Create date from day number (using current month and year)
    const today = new Date();
    const selectedDay = new Date(today.getFullYear(), today.getMonth(), day);
    const formattedDate = selectedDay.toISOString().split('T')[0];
    
    setSelectedDate(formattedDate);
    
    // If a service is already selected, auto-fill its date input
    if (selectedService) {
      const dateElem = document.getElementById(`date-${selectedService}`);
      if (dateElem) {
        dateElem.value = formattedDate;
      }
    }
    
    // Navigate to services section if user wants to make a booking
    if (window.confirm('Would you like to book a service for this date?')) {
      setActiveSection('services');
    }
  };

  const saveToWishlist = (id) => {
    if (!wishlist.includes(id)) {
      const updatedWishlist = [...wishlist, id];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      alert('Added to wishlist!');
    }
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(w => w !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const cancelBooking = (id) => {
    if (window.confirm('Cancel this booking?')) {
      const updatedBookings = bookings.filter(b => b.id !== id);
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    }
  };

  const deleteReview = (index) => {
    const myReviews = reviews.filter(r => r.user === currentUser.username);
    const target = myReviews[index];
    const updatedReviews = reviews.filter(r => !(
      r.user === target.user && 
      r.comment === target.comment && 
      r.service === target.service
    ));
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId);
    
    // If date is already selected from the calendar, auto-fill the date input
    if (selectedDate) {
      const dateElem = document.getElementById(`date-${serviceId}`);
      if (dateElem) {
        dateElem.value = selectedDate;
      }
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(serviceQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(serviceQuery.toLowerCase()) ||
    (service.subCategory && service.subCategory.toLowerCase().includes(serviceQuery.toLowerCase())) ||
    String(service.cost).includes(serviceQuery)
  );

  const userBookings = bookings.filter(b => b.user === currentUser.username);
  const userReviews = reviews.filter(r => r.user === currentUser.username);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Create calendar grid
    const calendarDays = [];
    let dayCounter = 1;
    
    // Generate weeks
    for (let i = 0; i < 6; i++) {
      const week = [];
      // Generate days for each week
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
          // Empty cell
          week.push(null);
        } else {
          week.push(dayCounter);
          dayCounter++;
        }
      }
      calendarDays.push(week);
      // Stop if we've added all days
      if (dayCounter > daysInMonth) break;
    }
    
    return calendarDays;
  };

  const calendarData = generateCalendarDays();
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  return (
    <div className="font-[Poppins] bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-[#1f2a44] text-white text-center py-5 text-2xl font-semibold">
        User Dashboard - Mastang Resort
      </header>
      
      <nav className="bg-[#2c3e50] p-3 flex flex-wrap justify-center">
        {[
          { id: 'services', label: 'Browse Services' },
          { id: 'bookings', label: 'My Bookings' },
          { id: 'wishlist', label: 'My Wishlist' },
          { id: 'calendar', label: 'Booking Calendar' },
          { id: 'profile', label: 'My Profile' },
          { id: 'reviews', label: 'Submit Feedback' },
          { id: 'review-history', label: 'My Reviews' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`text-white mx-2 my-1 px-4 py-2 rounded text-lg hover:bg-[#f39c12] hover:text-black transition duration-200`}
          >
            {item.label}
          </button>
        ))}
        <button 
          onClick={handleLogout}
          className="text-white mx-2 my-1 px-4 py-2 rounded text-lg hover:bg-[#f39c12] hover:text-black transition duration-200"
        >
          Logout
        </button>
      </nav>

      <div className="w-11/12 mx-auto p-5">
        {/* Services Section */}
        {activeSection === 'services' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">Service Listing</h2>
            <input
              type="text"
              placeholder="Search by name, category, sub-category or price"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
            />
            
            <div className="space-y-4">
              {filteredServices.map(service => {
                const availableDates = availability[service.name] || [];
                const earliestDate = availableDates.length ? availableDates.sort()[0] : 'N/A';
                
                return (
                  <div 
                    key={service.id} 
                    className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <img 
                      src={service.image || `img${service.id}.jpg`} 
                      alt={service.name}
                      onError={(e) => { e.target.src = 'default.jpg' }}
                      className="w-32 h-20 object-cover rounded mr-4 mb-4 sm:mb-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-600">{service.description}</p>
                      <p>Category: {service.category}</p>
                      <p>Cost: ${service.cost}</p>
                      <p><strong>Available From:</strong> {earliestDate}</p>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block">Days:</label>
                          <input 
                            type="number" 
                            id={`days-${service.id}`} 
                            min="1" 
                            defaultValue="1"
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block">Date:</label>
                          <input 
                            type="date" 
                            id={`date-${service.id}`}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                            defaultValue={selectedDate}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button 
                          onClick={() => bookService(service.id)}
                          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                          Book Now
                        </button>
                        <button 
                          onClick={() => saveToWishlist(service.id)}
                          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                        >
                          ❤️ Save
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredServices.length === 0 && (
                <p className="text-center py-4">No services found matching your search.</p>
              )}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeSection === 'bookings' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2c3e50] text-white">
                    <th className="border border-gray-300 p-2">Service</th>
                    <th className="border border-gray-300 p-2">Days</th>
                    <th className="border border-gray-300 p-2">Date</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.map(booking => (
                    <tr key={booking.id}>
                      <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.date || '-'}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.status || 'pending'}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button 
                          onClick={() => cancelBooking(booking.id)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {userBookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="border border-gray-300 p-4 text-center">No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wishlist Section */}
        {activeSection === 'wishlist' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
            
            <div className="space-y-4">
              {wishlist.map(id => {
                const service = services.find(s => s.id === id);
                if (!service) return null;
                
                return (
                  <div key={service.id} className="bg-white rounded-lg shadow p-4 flex items-center flex-wrap">
                    <img 
                      src={service.image || `img${service.id}.jpg`}
                      alt={service.name}
                      className="w-32 h-20 object-cover rounded mr-4 mb-4 sm:mb-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-600">{service.description}</p>
                      <p>${service.cost}</p>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button 
                          onClick={() => bookService(service.id)}
                          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                          Book Now
                        </button>
                        <button 
                          onClick={() => removeFromWishlist(service.id)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {wishlist.length === 0 && (
                <p className="text-center py-4">Your wishlist is empty.</p>
              )}
            </div>
          </div>
        )}

        {/* Calendar Section */}
        {activeSection === 'calendar' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">Booking Calendar</h2>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">{currentMonth} {currentYear}</h3>
              {selectedDate && (
                <p className="mt-2 text-blue-600">Selected Date: {selectedDate}</p>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Sun</th>
                    <th className="border border-gray-300 p-2">Mon</th>
                    <th className="border border-gray-300 p-2">Tue</th>
                    <th className="border border-gray-300 p-2">Wed</th>
                    <th className="border border-gray-300 p-2">Thu</th>
                    <th className="border border-gray-300 p-2">Fri</th>
                    <th className="border border-gray-300 p-2">Sat</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarData.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                      {week.map((day, dayIndex) => {
                        if (day === null) {
                          return <td key={dayIndex} className="border border-gray-300 p-3"></td>;
                        }
                        
                        const isToday = day === today.getDate();
                        const isSelected = selectedDate && day === parseInt(selectedDate.split('-')[2]);
                        const isBooked = userBookings.some(b => 
                          b.date && new Date(b.date).getDate() === day && 
                          new Date(b.date).getMonth() === today.getMonth() && 
                          new Date(b.date).getFullYear() === today.getFullYear()
                        );
                        
                        return (
                          <td 
                            key={dayIndex}
                            onClick={() => handleDateClick(day)}
                            className={`border border-gray-300 p-3 text-center cursor-pointer
                              ${isToday ? 'bg-blue-100' : ''}
                              ${isSelected ? 'bg-blue-500 text-white' : ''}
                              ${isBooked ? 'bg-green-600 text-white' : ''}
                              hover:bg-gray-100
                            `}
                          >
                            {day}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-100 mr-2"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            
            <form onSubmit={handleProfileSubmit}>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded mb-3"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded mb-3"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 border border-gray-300 rounded mb-3"
                value={profileData.password}
                onChange={(e) => setProfileData({...profileData, password: e.target.value})}
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
            
            <form onSubmit={handleReviewSubmit}>
              <input
                type="text"
                placeholder="Service Name"
                className="w-full p-3 border border-gray-300 rounded mb-3"
                value={reviewData.service}
                onChange={(e) => setReviewData({...reviewData, service: e.target.value})}
                required
              />
              <select
                className="w-full p-3 border border-gray-300 rounded mb-3"
                value={reviewData.rating}
                onChange={(e) => setReviewData({...reviewData, rating: e.target.value})}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
              <input
                type="text"
                placeholder="Write your feedback..."
                className="w-full p-3 border border-gray-300 rounded mb-3"
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </form>
            
            <div className="mt-6">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 py-3">
                  <p>
                    <strong>{review.user}</strong> rated <strong>{review.service}</strong>: 
                    {review.rating}/5 - "{review.comment}"
                  </p>
                </div>
              ))}
              
              {reviews.length === 0 && (
                <p className="text-center py-4">No reviews yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Review History Section */}
        {activeSection === 'review-history' && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">Review History</h2>
            
            <div className="space-y-3">
              {userReviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 py-3 flex flex-wrap justify-between items-center">
                  <p className="mb-2 sm:mb-0">
                    <strong>{review.service}</strong>: {review.rating}/5 - "{review.comment}"
                  </p>
                  <button
                    onClick={() => deleteReview(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
              
              {userReviews.length === 0 && (
                <p className="text-center py-4">You haven't submitted any reviews yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;