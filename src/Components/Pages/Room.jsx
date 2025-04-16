    import React, { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import img1 from '../../Img/Standard-Room.jpg'
    import img2 from '../../Img/Deluxe-Room.jpg'
    import img3 from '../../Img/Suite.jpg'
    import img4 from '../../Img/Villa.jpg'

    const Room = () => {
      const [username, setUsername] = useState('');
      const navigate = useNavigate();

      useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
          navigate('/login'); 
        } else {
          setUsername(storedUsername); // Set the username from localStorage
        }
      }, [navigate]);

      const rooms = [
        { id: 1, name: "Standard Room", price: 100, available: true, images: [img1] },
        { id: 2, name: "Deluxe Room", price: 150, available: true, images: [img2] },
        { id: 3, name: "suite", price: 180, available: true, images: [img3] },
        { id: 4, name: "Villa", price: 300, available: true, images: [img4] }
      ];

      const [bookings, setBookings] = useState([]);
      const [imageViewerVisible, setImageViewerVisible] = useState(false);
      const [currentImage, setCurrentImage] = useState('');
      const [selectedDays, setSelectedDays] = useState({}); // ✅ Track days for each room

      const handleBooking = (room, days) => {
        const userName = username;
        const userEmail = prompt("Enter your email:");

        if (userEmail) {
          const booking = {
            id: bookings.length + 1,
            room: room.name,
            days: days,
            user: userName,
            email: userEmail,
            revenue: room.price * days
          };
          setBookings([...bookings, booking]);
          alert(`Thank you, ${userName}! Your booking for ${room.name} is confirmed for ${days} days.`);
        }
      };

      const viewImage = (imageUrl) => {
        setCurrentImage(imageUrl);
        setImageViewerVisible(true);
      };

      const closeImageViewer = () => {
        setImageViewerVisible(false);
      };

      return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
          <h2 className="text-3xl text-center font-semibold mb-6">Mastang Resort - Available Rooms</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white p-6 rounded-lg shadow-lg border">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-40 object-cover rounded cursor-pointer mb-4"
                  onClick={() => viewImage(room.images[0])}
                />
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="text-gray-600 mb-4">Price: ${room.price} per night</p>
                <div className="mb-4">
                  <label htmlFor={`days-${room.id}`} className="block text-sm">Days:</label>
                  <input
                    type="number"
                    id={`days-${room.id}`}
                    min="1"
                    value={selectedDays[room.id] || 1}
                    onChange={(e) =>
                      setSelectedDays({ ...selectedDays, [room.id]: parseInt(e.target.value) })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  onClick={() => handleBooking(room, selectedDays[room.id] || 1)}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 w-full"
                >
                  Book
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Bookings Dashboard</h3>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p>No bookings yet.</p>
              ) : (
                bookings.map((booking) => (
                  <p key={booking.id}>
                    {booking.room} booked for {booking.days} days by {booking.user} ({booking.email})
                  </p>
                ))
              )}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold">Total Revenue: ${bookings.reduce((sum, booking) => sum + booking.revenue, 0)}</h4>
            </div>
          </div>

          {/* Image Viewer Modal */}
          {imageViewerVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
              <div className="relative bg-white p-4 rounded">
                <button
                  onClick={closeImageViewer}
                  className="absolute top-0 right-0 bg-black text-white p-2 rounded-full"
                >
                  ❌
                </button>
                <img src={currentImage} alt="Room" className="max-w-md max-h-screen" />
              </div>
            </div>
          )}
        </div>
      );
    };

    export default Room;
