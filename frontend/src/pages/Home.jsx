import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/40 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-200/40 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-center px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <div className="animate-fade-in mb-8 inline-flex items-center px-4 py-1.5 rounded-full border border-primary-200 bg-white/50 backdrop-blur-sm text-primary-700 text-sm font-medium shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
          The Official Event Platform for CBIT
        </div>

        {/* Hero Text */}
        <h1 className="animate-slide-up text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl leading-tight">
          Discover & Join <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-gradient-x">
            Amazing Events
          </span>
        </h1>

        <p className="animate-slide-up text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.2s' }}>
          Connect with peers, join clubs, and participate in the most exciting activities happening on campus. Your journey starts here.
        </p>

        {/* Action Buttons */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.4s' }}>
          <Link to="/events" className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-primary-500/40 hover:-translate-y-1">
            Explore Events
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link to="/clubs" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-primary-600 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1">
            Browse Clubs
          </Link>
        </div>

        {/* Stats Grid - Optional visual flair */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-primary-600">50+</span>
            <span className="text-gray-500 text-sm">Active Clubs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-secondary-600">100+</span>
            <span className="text-gray-500 text-sm">Monthly Events</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-pink-500">2k+</span>
            <span className="text-gray-500 text-sm">Students</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-teal-500">24/7</span>
            <span className="text-gray-500 text-sm">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
