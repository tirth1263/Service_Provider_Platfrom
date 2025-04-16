import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import img1 from "../Img/Standard-Room.jpg"
import img2 from "../Img/Deluxe-Room.jpg"
import img3 from "../Img/Suite.jpg"
import img4 from "../Img/Villa.jpg"

function UserDashboard() {
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState("services")
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [availability, setAvailability] = useState({})
  const [serviceQuery, setServiceQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedService, setSelectedService] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    profilePicture: "", // Add profilePicture field
  })
  const [reviewData, setReviewData] = useState({
    service: "",
    rating: "5",
    comment: "",
  })
  const [currentUser, setCurrentUser] = useState({ username: "Guest" })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  // const [actualPassword, setActualPassword] = useState("");
  // const [actualNewPassword, setActualNewPassword] = useState("");

  useEffect(() => {
    // Load data from localStorage
    const storedUser = localStorage.getItem("currentUser")
    const username = localStorage.getItem("username")
    const userFullName = localStorage.getItem('userFullName')
    const storedServices = localStorage.getItem("services")
    const storedBookings = localStorage.getItem("bookings")
    const storedReviews = localStorage.getItem("reviews")
    const storedWishlist = localStorage.getItem("wishlist")
    const storedAvailability = localStorage.getItem("availableDates")
    const profilePicture = localStorage.getItem("profilePicture") // Load profile picture
  
    console.log("Stored user from localStorage:", storedUser)
    console.log("Username from localStorage:", username)
  
    // Get user's actual password from users array
    const users = JSON.parse(localStorage.getItem("users")) || []
    let userPassword = ""
    
    if (username) {
      // Find user by email/username
      const userRecord = users.find(user => user.email === username)
      if (userRecord) {
        userPassword = userRecord.password
      }
    }
  
    // Check if either currentUser or username exists
    if (username || userFullName) {
      const userData = {
        email: username || "",
        name: userFullName || "",
        password: userPassword,  // Add the actual password here
        profilePicture: profilePicture || "" // Add profile picture
      }
  
      // Store it for consistency
      localStorage.setItem('currentUser', JSON.stringify(userData))
      setCurrentUser(userData)
      setIsLoggedIn(true)
  
      setProfileData({
        name: userFullName || "",
        email: username || "",
        password: userPassword, // Set the actual password
        newPassword: "",
        profilePicture: profilePicture || ""
      });
    } else if (storedUser) {
      // Original code for handling storedUser
      try {
        const userData = JSON.parse(storedUser)
        setCurrentUser(userData)
        setIsLoggedIn(true)
  
        // Get user's actual password if not already in userData
        if (!userData.password) {
          const userRecord = users.find(user => user.email === userData.email)
          if (userRecord) {
            userData.password = userRecord.password
          }
        }
  
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          password: userData.password || "",
          newPassword: "",
          profilePicture: userData.profilePicture || profilePicture || ""
        })
      } catch (error) {
        console.error("Error parsing user data:", error)
        setCurrentUser({ username: "Guest" })
        setIsLoggedIn(false)
      }
    } else {
      setCurrentUser({ username: "Guest" })
      setIsLoggedIn(false)
    }

    // Define room data with proper image imports
    const roomServices = [
      {
        id: "room1",
        name: "Standard Room",
        description: "Comfortable room with basic amenities",
        category: "Budget",
        cost: 100,
        available: true,
        imageSource: img1, // Use the imported image
      },
      {
        id: "room2",
        name: "Deluxe Room",
        description: "Spacious room with premium amenities",
        category: "Premium",
        cost: 150,
        available: true,
        imageSource: img2,
      },
      {
        id: "room3",
        name: "Suite",
        description: "Luxurious suite with separate living area",
        category: "Luxury",
        cost: 180,
        available: true,
        imageSource: img3,
      },
      {
        id: "room4",
        name: "Villa",
        description: "Private villa with exclusive amenities",
        category: "Premium",
        cost: 300,
        available: true,
        imageSource: img4,
      },
    ]

    // Merge room services with existing services
    let allServices = []
    if (storedServices) {
      try {
        allServices = [...JSON.parse(storedServices)]
      } catch (error) {
        console.error("Error parsing services data:", error)
      }
    }

    // Check if room services already exist to avoid duplicates
    const existingRoomIds = allServices.filter((s) => s.id.toString().startsWith("room")).map((s) => s.id)
    const newRooms = roomServices.filter((r) => !existingRoomIds.includes(r.id))

    if (newRooms.length > 0) {
      allServices = [...allServices, ...newRooms]
      localStorage.setItem("services", JSON.stringify(allServices))
    }

    setServices(allServices)

    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings))
      } catch (error) {
        console.error("Error parsing bookings data:", error)
        setBookings([])
      }
    }

    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews))
      } catch (error) {
        console.error("Error parsing reviews data:", error)
        setReviews([])
      }
    }

    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Error parsing wishlist data:", error)
        setWishlist([])
      }
    }

    if (storedAvailability) {
      try {
        setAvailability(JSON.parse(storedAvailability))
      } catch (error) {
        console.error("Error parsing availability data:", error)
        setAvailability({})
      }
    }
  }, [])

  // Check login status - used in multiple places
  const checkLoginStatus = () => {
    // Check both currentUser and username in localStorage
    const storedUser = localStorage.getItem("currentUser")
    const username = localStorage.getItem("username")
    const userFullName = localStorage.getItem("userFullName")

    if (!storedUser && !username) {
      setIsLoggedIn(false)
      setCurrentUser({ username: "Guest" })
      return false
    }

    // If we have a username but no currentUser, create one
    if (!storedUser && username) {
      const userData = {
        username: username,
        email: username,
        name: userFullName || "" // Add this line
      }
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setCurrentUser(userData)
    }

    setIsLoggedIn(true)
    return true
  }

  const handleNavClick = (section) => {
    setActiveSection(section)

    // Reset editing profile state when switching sections
    if (section !== "profile") {
      setIsEditingProfile(false)
    }

    // If switching to calendar, reset selected date
    if (section === "calendar") {
      const today = new Date()
      const formattedDate = today.toISOString().split("T")[0]
      setSelectedDate(formattedDate)
    }
  }

  const handleLogout = () => {
    // Remove all user-related data from localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("username");
    localStorage.removeItem("userFullName");
    // Don't remove profile picture on logout so it persists between sessions
    // localStorage.removeItem("profilePicture");

    // Reset state
    setCurrentUser({ username: "Guest" });
    setIsLoggedIn(false);

    // Navigate to login page
    navigate("/login");
  }

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileData({ ...profileData, profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    // Check if the password has been changed
    const isPasswordChanged = profileData.newPassword && profileData.newPassword.trim() !== "";

    // Create updated user object
    const updatedUser = {
      ...currentUser,
      name: profileData.name,
      email: profileData.email,
      password: profileData.newPassword || profileData.password, // Use new password if provided, otherwise current
      profilePicture: profileData.profilePicture // Add profile picture to user data
    };

    // Update users array in localStorage if password changed
    if (isPasswordChanged) {
      // Get existing users
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Find and update the current user's password
      const updatedUsers = users.map(user => {
        if (user.email === profileData.email) {
          return {
            ...user,
            password: profileData.newPassword,
            profilePicture: profileData.profilePicture // Update profile picture in users array
          };
        }
        return user;
      });

      // Save updated users back to localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    // Save profile picture to localStorage separately
    localStorage.setItem("profilePicture", profileData.profilePicture);

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("userFullName", profileData.name);

    // Update current user state
    setCurrentUser(updatedUser);

    // Exit edit mode
    setIsEditingProfile(false);

    if (isPasswordChanged) {
      alert("Password changed successfully! Please login again with your new password.");
      handleLogout(); // Log the user out
      navigate("/login"); // Redirect to login page
    } else {
      alert("Profile updated successfully!");
    }
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    const newReviews = [
      ...reviews,
      {
        service: reviewData.service,
        rating: reviewData.rating,
        comment: reviewData.comment,
        user: currentUser.username,
      },
    ]

    setReviews(newReviews)
    localStorage.setItem("reviews", JSON.stringify(newReviews))
    alert("Feedback submitted!")

    // Reset form
    setReviewData({
      service: "",
      rating: "5",
      comment: "",
    })
  }

  const bookService = (serviceId) => {
    // First check if user is logged in by directly checking localStorage
    const storedUser = localStorage.getItem("currentUser")
    const username = localStorage.getItem("username")

    // If neither currentUser nor username exists in localStorage, user is not logged in
    if (!storedUser && !username) {
      alert("Please login first to book services!")
      navigate("/login")
      return
    }

    // Set login state to true if we got here (user is logged in)
    setIsLoggedIn(true)

    // If we have username but not currentUser, create a currentUser object
    if (!storedUser && username) {
      const userData = { username: username, email: username }
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setCurrentUser(userData)
    }

    // Continue with booking process
    const daysElem = document.getElementById(`days-${serviceId}`)
    const dateElem = document.getElementById(`date-${serviceId}`)

    if (!daysElem || !dateElem) {
      console.error("Could not find days or date elements")
      return
    }

    const days = daysElem.value
    const date = dateElem.value

    if (!date) {
      alert("Please select a booking date.")
      return
    }

    // Check if the selected date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(date)

    if (selectedDate < today) {
      alert("Please select a date in the future.")
      return
    }

    const service = services.find((s) => s.id === serviceId)
    if (!service) {
      console.error("Service not found")
      return
    }

    const availableDates = availability[service.name] || []

    if (availableDates.length) {
      const earliest = availableDates.sort()[0]
      if (new Date(date) < new Date(earliest)) {
        alert(`"${service.name}" is available from ${earliest}. Please choose a valid date.`)
        return
      }
    }

    // Get user data from either currentUser or username in localStorage
    let userData
    try {
      userData = storedUser ? JSON.parse(storedUser) : { username: username, email: username }
      // Add this line to make sure name is included in the object
      if (storedUser && JSON.parse(storedUser).name) {
        userData.name = JSON.parse(storedUser).name
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      userData = { username: username || "Guest", email: username }
    }

    const newBooking = {
      id: Date.now(), // Use timestamp to ensure unique IDs
      service: service.name,
      user: userData.name || userData.username || userData.email,
      email: userData.email,
      days: days,
      date: date,
      revenue: service.cost * days,
      status: "pending",
    }

    // Get fresh bookings data from localStorage
    let updatedBookings = []
    const storedBookings = localStorage.getItem("bookings")
    if (storedBookings) {
      try {
        updatedBookings = JSON.parse(storedBookings)
      } catch (error) {
        console.error("Error parsing bookings:", error)
        updatedBookings = []
      }
    }

    updatedBookings = [...updatedBookings, newBooking]
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
    setBookings(updatedBookings)

    alert(`Service "${service.name}" booked for ${date}!`)
  }

  const handleDateClick = (day) => {
    // Create date from day number (using current month and year)
    const today = new Date()
    const selectedDay = new Date(today.getFullYear(), today.getMonth(), day)

    // Check if the selected date is in the past
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (selectedDay < currentDate) {
      alert("You cannot select dates in the past.")
      return
    }

    const formattedDate = selectedDay.toISOString().split("T")[0]
    setSelectedDate(formattedDate)

    // If a service is already selected, auto-fill its date input
    if (selectedService) {
      const dateElem = document.getElementById(`date-${selectedService}`)
      if (dateElem) {
        dateElem.value = formattedDate
      }
    }

    // Navigate to services section if user wants to make a booking
    if (window.confirm("Would you like to book a service for this date?")) {
      setActiveSection("services")
    }
  }

  const saveToWishlist = (id) => {
    // Enhanced login check
    if (!checkLoginStatus()) {
      alert("Please login first to save to wishlist!")
      navigate("/login")
      return
    }

    if (!wishlist.includes(id)) {
      const updatedWishlist = [...wishlist, id]
      setWishlist(updatedWishlist)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
      alert("Added to wishlist!")
    }
  }

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((w) => w !== id)
    setWishlist(updatedWishlist)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
  }

  const cancelBooking = (id) => {
    if (window.confirm("Cancel this booking?")) {
      const updatedBookings = bookings.filter((b) => b.id !== id)
      setBookings(updatedBookings)
      localStorage.setItem("bookings", JSON.stringify(updatedBookings))
    }
  }

  const deleteReview = (index) => {
    const myReviews = reviews.filter((r) => r.user === currentUser.username)
    const target = myReviews[index]
    const updatedReviews = reviews.filter(
      (r) => !(r.user === target.user && r.comment === target.comment && r.service === target.service),
    )
    setReviews(updatedReviews)
    localStorage.setItem("reviews", JSON.stringify(updatedReviews))
  }

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId)

    // If date is already selected from the calendar, auto-fill the date input
    if (selectedDate) {
      const dateElem = document.getElementById(`date-${serviceId}`)
      if (dateElem) {
        dateElem.value = selectedDate
      }
    }
  }

  const toggleEditProfile = () => {
    setIsEditingProfile(!isEditingProfile)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(serviceQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceQuery.toLowerCase()) ||
      (service.subCategory && service.subCategory.toLowerCase().includes(serviceQuery.toLowerCase())) ||
      String(service.cost).includes(serviceQuery),
  )

  const userBookings = bookings.filter((b) => {
    return currentUser && (b.user === currentUser.username || b.user === currentUser.email || b.user === currentUser.name)
  })

  const userReviews = reviews.filter((r) => {
    return currentUser && (r.user === currentUser.username || r.user === currentUser.email || r.user === currentUser.name)
  })

  // Helper function to get image source - improved to correctly handle imported images
  const getImageSource = (service) => {
    // First check for the new imageSource property
    if (service.imageSource) {
      return service.imageSource
    }

    // Handle legacy image property
    if (service.image) {
      return service.image
    }

    // Return a default placeholder if nothing else works
    return "https://via.placeholder.com/150"
  }

  const today = new Date()
  const currentYear = today.getFullYear()

  return (
    <div className="font-[Poppins] bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-[#1f2a44] text-white text-center py-5 text-2xl font-semibold">
        User Dashboard - Mastang Resort
      </header>

      <nav className="bg-[#2c3e50] p-3 flex flex-wrap justify-center">
        {[
          { id: "services", label: "Browse Services" },
          { id: "bookings", label: "My Bookings" },
          { id: "wishlist", label: "My Wishlist" },
          { id: "profile", label: "My Profile" },
          { id: "reviews", label: "Submit Feedback" },
          { id: "review-history", label: "My Reviews" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`text-white mx-2 my-1 px-4 py-2 rounded text-lg hover:bg-[#f39c12] hover:text-black transition duration-200`}
          >
            {item.label}
          </button>
        ))}
        {/* Show Login or Logout based on isLoggedIn state */}
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="text-white mx-2 my-1 px-4 py-2 rounded text-lg hover:bg-[#f39c12] hover:text-black transition duration-200"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="text-white mx-2 my-1 px-4 py-2 rounded text-lg hover:bg-[#f39c12] hover:text-black transition duration-200"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Welcome message showing login status - Modified to show name instead of email */}
      <div className="w-11/12 mx-auto mt-4 p-3 bg-white rounded-lg shadow mb-5">
        <h2 className="text-xl">
          {isLoggedIn
            ? `Welcome, ${currentUser.name || localStorage.getItem('userFullName') || currentUser.username}!`
            : "Welcome, Guest! Please login to book services."}
        </h2>
      </div>

      <div className="w-11/12 mx-auto p-5">
        {/* Services Section */}
        {activeSection === "services" && (
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
              {filteredServices.map((service) => {
                const availableDates = availability[service.name] || []
                const earliestDate = availableDates.length ? availableDates.sort()[0] : "N/A"

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between"
                    onClick={() => handleServiceClick(service.id)}
                  >
                    <img
                      src={getImageSource(service) || "/placeholder.svg"}
                      alt={service.name}
                      className="w-auto h-20 object-cover rounded mr-4 mb-4 sm:mb-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-600">{service.description}</p>
                      <p>Category: {service.category}</p>
                      <p>Cost: ${service.cost}</p>
                      <p>
                        <strong>Available From:</strong> {earliestDate}
                      </p>

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
                            min={new Date().toISOString().split('T')[0]} // Prevent past dates
                          />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation() // Prevent triggering handleServiceClick
                            bookService(service.id)
                          }}
                          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation() // Prevent triggering handleServiceClick
                            saveToWishlist(service.id)
                          }}
                          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                        >
                          ❤️ Save
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {filteredServices.length === 0 && (
                <p className="text-center py-4">No services found matching your search.</p>
              )}
            </div>
          </div>
        )}

        {/* Wishlist Section */}
        {activeSection === "wishlist" && (
          <div className="bg-white p-5 rounded-lg shadow mb-5">
            <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>

            <div className="space-y-4">
              {wishlist.map((id) => {
                const service = services.find((s) => s.id === id)
                if (!service) return null

                return (
                  <div key={service.id} className="bg-white rounded-lg shadow p-4 flex items-center flex-wrap">
                    <img
                      src={getImageSource(service) || "/placeholder.svg"}
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
                )
              })}

              {wishlist.length === 0 && <p className="text-center py-4">Your wishlist is empty.</p>}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeSection === "bookings" && (
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
                  {userBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="border border-gray-300 p-2 text-center">{booking.service}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.days}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.date || "-"}</td>
                      <td className="border border-gray-300 p-2 text-center">{booking.status || "pending"}</td>
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
                      <td colSpan="5" className="border border-gray-300 p-4 text-center">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
{/* Profile Section - Enhanced with profile picture upload */}
{activeSection === "profile" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">My Profile</h2>

    {isLoggedIn ? (
      <>
        {!isEditingProfile ? (
          <div className="flex flex-col md:flex-row items-start">
            <div className="mb-4 md:mr-8">
              {profileData.profilePicture ? (
                <img 
                  src={profileData.profilePicture} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                  <span className="text-3xl">👤</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="mb-2"><strong>Name:</strong> {profileData.name || "(Not set)"}</p>
              <p className="mb-2"><strong>Email:</strong> {profileData.email}</p>
              <p className="mb-4"><strong>Password:</strong> ••••••••</p>
              
              <button
                onClick={toggleEditProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="mb-6">
              <label className="block mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile Preview" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300" 
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePictureChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded"
                required
                disabled
              />
              <small className="text-gray-500">Email cannot be changed</small>
            </div>
            
            <div className="relative">
              <label className="block mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={profileData.password}
                  onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded pr-10"
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <label className="block mb-2">New Password (leave blank to keep current)</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={toggleEditProfile}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </>
    ) : (
      <div className="text-center py-4">
        <p>Please login to view your profile.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    )}
  </div>
)}

{/* Submit Review Section */}
{activeSection === "reviews" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>

    {isLoggedIn ? (
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label htmlFor="service" className="block mb-2">
            Select Service
          </label>
          <select
            id="service"
            value={reviewData.service}
            onChange={(e) => setReviewData({ ...reviewData, service: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded"
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rating" className="block mb-2">
            Rating
          </label>
          <select
            id="rating"
            value={reviewData.rating}
            onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded"
            required
          >
            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
            <option value="4">⭐⭐⭐⭐ (4/5)</option>
            <option value="3">⭐⭐⭐ (3/5)</option>
            <option value="2">⭐⭐ (2/5)</option>
            <option value="1">⭐ (1/5)</option>
          </select>
        </div>

        <div>
          <label htmlFor="comment" className="block mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded min-h-[120px]"
            required
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Review
        </button>
      </form>
    ) : (
      <div className="text-center py-4">
        <p>Please login to submit feedback.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    )}
  </div>
)}

{/* Review History Section */}
{activeSection === "review-history" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">My Reviews</h2>

    {isLoggedIn ? (
      <div className="space-y-4">
        {userReviews.map((review, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{review.service}</h3>
                <p className="text-yellow-500">
                  {Array(parseInt(review.rating)).fill("⭐").join("")} ({review.rating}/5)
                </p>
                <p className="mt-2">{review.comment}</p>
              </div>
              <button
                onClick={() => deleteReview(index)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {userReviews.length === 0 && <p className="text-center py-4">You haven't submitted any reviews yet.</p>}
      </div>
    ) : (
      <div className="text-center py-4">
        <p>Please login to view your reviews.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    )}
  </div>
)}

{/* Calendar View Section */}
{activeSection === "calendar" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">Availability Calendar</h2>

    <div className="mb-4">
      <p>
        <strong>Selected Date:</strong> {selectedDate || "None"}
      </p>
    </div>

    <div className="grid grid-cols-7 gap-1">
      {/* Day names */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-semibold p-2 bg-[#2c3e50] text-white">
          {day}
        </div>
      ))}

      {/* Days */}
      {Array(31)
        .fill(null)
        .map((_, i) => {
          const day = i + 1
          const date = new Date(today.getFullYear(), today.getMonth(), day)
          const isPast = date < today && date.getMonth() === today.getMonth()
          const isCurrentDay = day === today.getDate() && date.getMonth() === today.getMonth()

          // Skip days that are not in the current month
          if (date.getMonth() !== today.getMonth()) return null

          return (
            <div
              key={i}
              onClick={() => !isPast && handleDateClick(day)}
              className={`cursor-pointer text-center p-3 border ${
                isCurrentDay
                  ? "bg-blue-100 border-blue-500"
                  : isPast
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "hover:bg-green-100"
              }`}
            >
              {day}
            </div>
          )
        })}
    </div>

    <div className="mt-4">
      <h3 className="font-semibold">Services Available on Selected Date</h3>
      <div className="mt-2">
        {selectedDate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {services.map((service) => {
              const availableDates = availability[service.name] || []
              const isAvailable =
                !availableDates.length ||
                availableDates.some((date) => new Date(date) <= new Date(selectedDate))

              return (
                <div
                  key={service.id}
                  className={`p-3 border rounded ${isAvailable ? "border-green-500" : "border-red-300"}`}
                >
                  <p className="font-semibold">{service.name}</p>
                  <p className={isAvailable ? "text-green-600" : "text-red-600"}>
                    {isAvailable ? "Available" : "Not Available"}
                  </p>
                  {isAvailable && (
                    <button
                      onClick={() => {
                        // Set selected service and navigate to services section
                        handleServiceClick(service.id)
                        setActiveSection("services")
                      }}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p>Please select a date to see available services.</p>
        )}
      </div>
    </div>
  </div>
)}
      </div>

      <footer className="bg-[#1f2a44] text-white text-center p-5 mt-auto">
        <p>&copy; {currentYear} Mastang Resort. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default UserDashboard