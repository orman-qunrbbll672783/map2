import React from 'react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to Business Directory
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect freelancers with verified businesses. Paste your Google Maps URL to get started and build your professional network.
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={() => onNavigate('freelancer-dashboard')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Get Started as Freelancer
          </button>
          
          <button
            onClick={() => onNavigate('freelancer-dashboard')}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
          >
            Register Your Business
          </button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Google Maps Integration</h3>
            <p className="text-gray-600">Paste any Google Maps URL and we'll automatically fetch your business details</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">No Validation Rules</h3>
            <p className="text-gray-600">Any URL format works - shortened links, full URLs, everything is accepted</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-lg font-semibold mb-2">Professional Network</h3>
            <p className="text-gray-600">Connect with verified businesses and freelancers in your area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;