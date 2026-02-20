import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const logout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={closeMenu} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 tracking-tight hover:opacity-80 transition-opacity">
              EngageU {isAdmin && <span className="text-xs font-medium text-gray-500 ml-1 tracking-normal">Admin</span>}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Home</Link>

            {isAdmin ? (
              // Admin Menu
              <>
                <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Dashboard</Link>
                <Link to="/admin/events" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Manage Events</Link>
                <Link to="/admin/clubs" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Manage Clubs</Link>
              </>
            ) : (
              // Student Menu
              <>
                <Link to="/events" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Events</Link>
                <Link to="/clubs" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Clubs</Link>
                {user && (
                  <>
                    <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">My Events</Link>
                    <Link to="/myclubs" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">My Clubs</Link>
                  </>
                )}
              </>
            )}

            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              {!user ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden lg:block">Hi, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-red-500 hover:text-red-600 font-medium border border-red-200 hover:border-red-300 px-4 py-1.5 rounded-full transition-all text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open. */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Home</Link>

            {isAdmin ? (
              <>
                <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Dashboard</Link>
                <Link to="/admin/events" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Manage Events</Link>
                <Link to="/admin/clubs" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Manage Clubs</Link>
              </>
            ) : (
              <>
                <Link to="/events" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Events</Link>
                <Link to="/clubs" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Clubs</Link>
                {user && (
                  <>
                    <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">My Events</Link>
                    <Link to="/myclubs" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">My Clubs</Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="pt-4 pb-4 border-t border-gray-200">
            {!user ? (
              <div className="px-5 space-y-3">
                <Link to="/login" onClick={closeMenu} className="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-600 bg-white hover:bg-gray-50 border-gray-200">
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <div className="px-5">
                <div className="flex items-center mb-3">
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
