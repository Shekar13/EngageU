import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 tracking-tight hover:opacity-80 transition-opacity">
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
        </div>
      </div>
    </nav>
  );
}
