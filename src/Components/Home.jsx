import { Link, useLocation } from 'react-router-dom';
import Slideshow from './SlideShow';
import { useEffect, useState } from 'react';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    alert('Logged out!');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-emerald-100">
      <header className="bg-emerald-800 text-white text-center p-5 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">Mastang Resort - Luxury Stay</h1>

        <nav className="bg-emerald-600 mt-4 p-3 flex flex-wrap justify-center gap-4 rounded-md shadow-md">
          <Link
            to="/rooms"
            className="text-white px-5 py-2 bg-emerald-700 rounded-full hover:bg-yellow-400 hover:text-black transition"
          >
            Rooms
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="text-white px-5 py-2 bg-emerald-700 rounded-full hover:bg-yellow-400 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white px-5 py-2 bg-emerald-700 rounded-full hover:bg-yellow-400 hover:text-black transition"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-white px-5 py-2 bg-red-600 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <div className="p-5">
        {/* Only render Slideshow if the current path is '/' */}
        {location.pathname === '/' && <Slideshow />}
        
        <h2 className="text-2xl md:text-3xl font-semibold mt-8 text-center text-emerald-900">
          Welcome to Mastang Resort Booking Platform!
        </h2>
      </div>
    </div>
  );
};

export default Home;
