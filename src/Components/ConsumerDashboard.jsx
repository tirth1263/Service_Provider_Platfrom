import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
  // New state for service availability
  const [serviceName, setServiceName] = useState("")
  const [availableDate, setAvailableDate] = useState("")
  const [availableDates, setAvailableDates] = useState({})
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
        const loadedAvailability = JSON.parse(storedAvailability)
        setAvailability(loadedAvailability)
        setAvailableDates(loadedAvailability) // Set the availableDates state too
      } catch (error) {
        console.error("Error parsing availability data:", error)
        setAvailability({})
        setAvailableDates({})
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
    setActiveSection(section);

    // Reset editing profile state when switching sections
    if (section !== "profile") {
      setIsEditingProfile(false);
    }

    // If switching to calendar, reset selected date
    if (section === "calendar") {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      setSelectedDate(formattedDate);
    }
  };

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
      toast.success("Password changed successfully! Please login again with your new password.");
      handleLogout();
      navigate("/login");
    } else {
      toast.success("Profile updated successfully!");
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
    toast.success("Feedback submitted!");

    // Reset form
    setReviewData({
      service: "",
      rating: "5",
      comment: "",
    })
  }

  // Function to add new availability
  const setServiceAvailability = () => {
    if (!serviceName || !availableDate) {
      toast.error("Please select both service and date");
      return;
    }

    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(availableDate);

    if (selectedDate < today) {
      toast.error("Please select a date in the future.");
      return;
    }

    // Update availability state
    const updatedAvailability = { ...availableDates };

    // If this service doesn't exist in the availability object yet, create an empty array for it
    if (!updatedAvailability[serviceName]) {
      updatedAvailability[serviceName] = [];
    }

    // Only add the date if it's not already in the array
    if (!updatedAvailability[serviceName].includes(availableDate)) {
      updatedAvailability[serviceName].push(availableDate);

      // Save to localStorage
      localStorage.setItem("availableDates", JSON.stringify(updatedAvailability));

      // Update both state objects
      setAvailableDates(updatedAvailability);
      setAvailability(updatedAvailability);

      toast.success(`Availability for ${serviceName} on ${availableDate} has been added.`);
      // Reset form fields
      setAvailableDate("");
    } else {
      toast.info("This date is already available for this service.");
    }
  }

  // Function to remove availability
  const removeServiceAvailability = (service, date) => {
    const updatedAvailability = { ...availableDates };

    // Filter out the date to remove
    updatedAvailability[service] = updatedAvailability[service].filter(d => d !== date);

    // If no more dates for this service, remove the service key
    if (updatedAvailability[service].length === 0) {
      delete updatedAvailability[service];
    }

    // Save to localStorage
    localStorage.setItem("availableDates", JSON.stringify(updatedAvailability));

    // Update both state objects
    setAvailableDates(updatedAvailability);
    setAvailability(updatedAvailability);

    toast.success(`Availability for ${service} on ${date} has been removed.`);
  }

  const bookService = (serviceId) => {
    // First check if user is logged in by directly checking localStorage
    const storedUser = localStorage.getItem("currentUser")
    const username = localStorage.getItem("username")
  
    // If neither currentUser nor username exists in localStorage, user is not logged in
    if (!storedUser && !username) {
      toast.error("Please login first to book services!");
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
      toast.error("Please select a booking date.");
      return
    }
  
    // Check if the selected date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(date)
  
    if (selectedDate < today) {
      toast.error("Please select a date in the future.");
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
        toast.error(`"${service.name}" is available from ${earliest}. Please choose a valid date.`);
        return
      }
    }
  
    // Generate a unique toast ID for this booking confirmation
    const toastId = `booking-confirmation-${serviceId}-${Date.now()}`;
  
    // Show confirmation toast
    toast.info(
      <div>
        <p className="mb-3">Confirm booking for "{service.name}" on {date}?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
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
  
              // Close the confirmation toast
              toast.dismiss(toastId)
  
              // Show success message
              toast.success(`Service "${service.name}" booked for ${date}!`);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        toastId: toastId,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        position: "top-center"
      }
    );
  }

  const handleDateClick = (day) => {
    // Create date from day number (using current month and year)
    const today = new Date();
    const selectedDay = new Date(today.getFullYear(), today.getMonth(), day);
  
    // Check if the selected date is in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    if (selectedDay < currentDate) {
      toast.error("You cannot select dates in the past.");
      return;
    }
  
    const formattedDate = selectedDay.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  
    // If a service is already selected, auto-fill its date input
    if (selectedService) {
      const dateElem = document.getElementById(`date-${selectedService}`);
      if (dateElem) {
        dateElem.value = formattedDate;
      }
    }
  
    // Create unique toast ID
    const toastId = `date-booking-${formattedDate}`;
  
    // Navigate to services section if user wants to make a booking
    toast.info(
      <div>
        <p className="mb-3">Would you like to book a service for this date?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              // Navigate to services section
              setActiveSection("services");
              
              // Close the confirmation toast
              toast.dismiss(toastId);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            OK
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        toastId: toastId,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        position: "top-center"
      }
    );
  }

  const saveToWishlist = (id) => {
    // Enhanced login check
    if (!checkLoginStatus()) {
      toast.error("Please login first to save to wishlist!");
      navigate("/login")
      return
    }

    if (!wishlist.includes(id)) {
      const updatedWishlist = [...wishlist, id]
      setWishlist(updatedWishlist)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
      toast.success("Added to wishlist!");
    }
  }

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((w) => w !== id)
    setWishlist(updatedWishlist)
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
  }

  const cancelBooking = (id) => {
    // Create a unique ID for this toast
    const toastId = `cancel-booking-${id}`;

    // Show confirmation toast with buttons
    toast.info(
      <div>
        <p className="mb-3">Cancel this booking?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              // Perform the cancellation
              const updatedBookings = bookings.filter((b) => b.id !== id);
              setBookings(updatedBookings);
              localStorage.setItem("bookings", JSON.stringify(updatedBookings));

              // Close the confirmation toast
              toast.dismiss(toastId);

              // Show success message
              toast.success('Booking cancelled successfully!');
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            OK
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        toastId: toastId,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        position: "top-center"
      }
    );
  };

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

 {/* Bookings Section */}
{activeSection === "bookings" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
    {userBookings.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Service</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Days</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Date</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Cost</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Status</th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-2 px-4 border-b border-gray-200">{booking.service}</td>
                <td className="py-2 px-4 border-b border-gray-200">{booking.days}</td>
                <td className="py-2 px-4 border-b border-gray-200">{booking.date}</td>
                <td className="py-2 px-4 border-b border-gray-200">${booking.revenue}</td>
                <td className="py-2 px-4 border-b border-gray-200 capitalize">
                  <span 
                    className={`px-2 py-1 rounded ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {booking.status === "pending" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center py-4">You have no bookings yet.</p>
    )}
  </div>
)}

{/* Wishlist Section */}
{activeSection === "wishlist" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
    {wishlist.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((id) => {
          const service = services.find((s) => s.id === id);
          if (!service) return null;
          
          return (
            <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={getImageSource(service)}
                alt={service.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <p className="mb-2">Category: {service.category}</p>
                <p className="mb-3">Cost: ${service.cost}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => bookService(service.id)}
                    className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => removeFromWishlist(service.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-center py-4">Your wishlist is empty.</p>
    )}
  </div>
)}

{/* Profile Section */}
{activeSection === "profile" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">My Profile</h2>
      <button
        onClick={toggleEditProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEditingProfile ? "Cancel Edit" : "Edit Profile"}
      </button>
    </div>

    {!isEditingProfile ? (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          {profileData.profilePicture ? (
            <img
              src={profileData.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-4xl border-4 border-gray-200">
              {currentUser.name?.charAt(0) || currentUser.username?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="mb-3">
            <label className="block text-gray-600">Name</label>
            <div className="font-semibold text-lg">{profileData.name || "Not set"}</div>
          </div>
          <div className="mb-3">
            <label className="block text-gray-600">Email</label>
            <div className="font-semibold text-lg">{profileData.email}</div>
          </div>
          
        </div>
      </div>
    ) : (
      <form onSubmit={handleProfileSubmit}>
        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-gray-600 mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            {profileData.profilePicture ? (
              <img 
                src={profileData.profilePicture} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl">
                {currentUser.name?.charAt(0) || currentUser.username?.charAt(0) || "?"}
              </div>
            )}
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="w-full max-w-xs"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={profileData.password}
              onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              readOnly
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-600 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={profileData.newPassword}
              onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-1">Leave blank if you don't want to change password</p>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={toggleEditProfile}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
)}

{/* Submit Reviews Section */}
{activeSection === "reviews" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>

    {isLoggedIn ? (
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label htmlFor="service" className="block text-gray-600 mb-2">Select Service</label>
          <select
            id="service"
            value={reviewData.service}
            onChange={(e) => setReviewData({ ...reviewData, service: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
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
          <label htmlFor="rating" className="block text-gray-600 mb-2">Rating</label>
          <select
            id="rating"
            value={reviewData.rating}
            onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="5">5 Stars (Excellent)</option>
            <option value="4">4 Stars (Good)</option>
            <option value="3">3 Stars (Average)</option>
            <option value="2">2 Stars (Poor)</option>
            <option value="1">1 Star (Very Poor)</option>
          </select>
        </div>

        <div>
          <label htmlFor="comment" className="block text-gray-600 mb-2">Your Comments</label>
          <textarea
            id="comment"
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded h-32"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    ) : (
      <div className="text-center py-4">
        <p className="mb-3">Please login to submit a review.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    )}
  </div>
)}

{/* Review History Section */}
{activeSection === "review-history" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">My Reviews</h2>

    {userReviews.length > 0 ? (
      <div className="space-y-4">
        {userReviews.map((review, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{review.service}</h3>
              <div className="flex items-center">
                <span className="mr-2">
                  {Array(parseInt(review.rating))
                    .fill("⭐")
                    .join("")}
                </span>
                <button
                  onClick={() => deleteReview(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center py-4">You haven't submitted any reviews yet.</p>
    )}
  </div>
)}

{/* Calendar/Availability Section */}
{activeSection === "calendar" && (
  <div className="bg-white p-5 rounded-lg shadow mb-5">
    <h2 className="text-xl font-semibold mb-4">Service Calendar</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select a Date</h3>
        
        <div className="bg-gray-50 p-4 rounded shadow-inner">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            <div className="text-gray-500 font-medium">Sun</div>
            <div className="text-gray-500 font-medium">Mon</div>
            <div className="text-gray-500 font-medium">Tue</div>
            <div className="text-gray-500 font-medium">Wed</div>
            <div className="text-gray-500 font-medium">Thu</div>
            <div className="text-gray-500 font-medium">Fri</div>
            <div className="text-gray-500 font-medium">Sat</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: new Date(currentYear, today.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
              const currentDate = new Date(currentYear, today.getMonth(), day);
              const isToday = today.getDate() === day;
              const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const formattedDate = currentDate.toISOString().split("T")[0];
              
              // Check if any service is available on this date
              const isAvailable = Object.values(availability).some(dates => dates.includes(formattedDate));
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                  className={`
                    h-12 flex items-center justify-center rounded-lg
                    ${isToday ? "bg-blue-100 border border-blue-500" : ""}
                    ${isPast ? "text-gray-400 bg-gray-100" : "hover:bg-blue-50"}
                    ${isAvailable ? "border-2 border-green-500" : ""}
                    ${selectedDate === formattedDate ? "bg-blue-200" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p>Selected Date: <strong>{selectedDate}</strong></p>
            <p className="mt-2">Available Services:</p>
            <ul className="list-disc ml-5 mt-1">
              {Object.entries(availability).filter(([_, dates]) => dates.includes(selectedDate)).map(([service]) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Set Service Availability</h3>
          
          <div className="bg-gray-50 p-4 rounded shadow-inner">
            <div className="mb-4">
              <label className="block mb-2">Service:</label>
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
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
            
            <div className="mb-4">
              <label className="block mb-2">Available Date:</label>
              <input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <button
              onClick={setServiceAvailability}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Set Availability
            </button>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Current Availability:</h4>
            <div className="max-h-64 overflow-y-auto">
              {Object.entries(availableDates).map(([service, dates]) => (
                <div key={service} className="mb-3">
                  <h5 className="font-medium">{service}</h5>
                  <ul className="ml-5">
                    {dates.map((date) => (
                      <li key={date} className="flex justify-between items-center text-sm">
                        <span>{date}</span>
                        <button
                          onClick={() => removeServiceAvailability(service, date)}
                          className="text-red-500 text-xs hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {Object.keys(availableDates).length === 0 && (
                <p className="text-gray-500 text-sm">No availability set yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

{/* Footer */}
<footer className="mt-auto bg-[#1f2a44] text-white text-center py-3 text-sm">
  <p>&copy; {currentYear} Mastang Resort. All rights reserved.</p>
</footer>

{/* Toast container for notifications */}
<ToastContainer position="top-right" autoClose={5000} />
</div>
</div>
);
}

export default UserDashboard;