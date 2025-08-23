import React, { useState, useEffect } from 'react';
import './App.css';
import OnboardingFlow from './OnboardingFlow';
import FreelancerDashboard from './FreelancerDashboard';
import { getCurrentSession, getStoredSessionData, signOutUser, isSessionValid } from './supabaseClient';
import { 
  FreelancerPurposeStep, 
  BusinessTypeStep, 
  SocialLinksStep, 
  BusinessNameStep, 
  AccountDetailsStep, 
  BusinessNameAndAccountStep,
  ReviewStep, 
  ProcessingStep, 
  SuccessStep 
} from './OnboardingSteps';

// Floating shapes component for dynamic background
const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-accent-400/20 to-primary-600/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-r from-primary-300/30 to-accent-300/30 rounded-full blur-xl animate-bounce-slow"></div>
      <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-primary-500/20 rounded-full blur-lg animate-pulse-slow"></div>
    </div>
  );
};

// Login Card Component
const LoginCard = ({ title, subtitle, icon, gradient, hoverGradient, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-xl transition-all duration-500 ${isHovered ? 'opacity-75 scale-105' : 'opacity-50'}`}></div>
      <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 transition-all duration-500 hover:transform hover:scale-105 cursor-pointer shadow-2xl">
        <div className="text-6xl mb-4 animate-bounce-slow">{icon}</div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-600 mb-6">{subtitle}</p>
        <div className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${gradient} text-white font-semibold transition-all duration-300 hover:shadow-lg text-center`}>
          Get Started
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ onStartOnboarding }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <FloatingShapes />
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent mb-6 leading-tight">
            ClientAIMap
          </h1>
          <p className="text-2xl md:text-3xl text-neutral-600 mb-12 font-light leading-relaxed">
            Discover hidden opportunities. Connect smarter.
          </p>
        </div>
        
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-lg md:text-xl text-neutral-500 mb-16 max-w-3xl mx-auto leading-relaxed">
            Revolutionize how businesses and freelancers connect with AI-powered opportunity discovery and intelligent matching.
          </p>
        </div>

        {/* Login Options */}
        <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <LoginCard 
            title="Log in as Freelancer"
            subtitle="Discover opportunities that match your skills"
            icon="👨‍💻"
            gradient="from-primary-500 to-primary-700"
            hoverGradient="from-primary-600 to-primary-800"
            onClick={() => onStartOnboarding('freelancer')}
          />
          <LoginCard 
            title="Log in as Business"
            subtitle="Find the perfect talent for your projects"
            icon="🏢"
            gradient="from-accent-500 to-accent-700"
            hoverGradient="from-accent-600 to-accent-800"
            onClick={() => onStartOnboarding('business')}
          />
        </div>
      </div>
    </section>
  );
};

// Mockup Components
const MapMockup = () => (
  <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl p-6 h-48 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 animate-pulse-slow"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white rounded-full px-4 py-2 text-sm font-semibold text-primary-600">
          📍 Search Location
        </div>
        <div className="w-8 h-8 bg-primary-500 rounded-full animate-glow"></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 bg-white/50 rounded-lg animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
        ))}
      </div>
    </div>
  </div>
);

const FilterMockup = () => (
  <div className="bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl p-6 h-48">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-accent-700">🎯 Smart Filters</span>
        <div className="w-12 h-6 bg-accent-500 rounded-full relative">
          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 animate-bounce-slow"></div>
        </div>
      </div>
      {['Skills', 'Budget', 'Timeline', 'Rating'].map((filter, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-accent-500 rounded-full animate-pulse-slow" style={{animationDelay: `${i * 0.2}s`}}></div>
          <div className="flex-1 h-3 bg-white/70 rounded-full">
            <div className="h-full bg-gradient-to-r from-accent-400 to-primary-400 rounded-full animate-pulse" style={{width: `${60 + i * 10}%`}}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ScanMockup = () => (
  <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl p-6 h-48 relative overflow-hidden">
    <div className="absolute inset-0">
      <div className="w-full h-full bg-gradient-to-r from-transparent via-primary-300/30 to-transparent animate-pulse-slow transform -skew-x-12"></div>
    </div>
    <div className="relative z-10">
      <div className="text-sm font-semibold text-primary-700 mb-4">🔍 AI Scanning...</div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm text-neutral-600">Hidden opportunity detected</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="text-sm text-neutral-600">Market gap identified</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="text-sm text-neutral-600">Perfect match found</div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs rounded-full animate-glow">
          3 opportunities discovered
        </div>
      </div>
    </div>
  </div>
);

const WeakPointsMockup = () => (
  <div className="bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl p-6 h-48">
    <div className="text-sm font-semibold text-accent-700 mb-4">⚡ AI Analysis</div>
    <div className="space-y-3">
      <div className="bg-white/70 rounded-lg p-3 relative">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-700">Profile Completeness</span>
          <span className="text-xs text-red-500 font-semibold">65%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
          <div className="h-full bg-gradient-to-r from-red-400 to-yellow-400 rounded-full animate-pulse" style={{width: '65%'}}></div>
        </div>
      </div>
      <div className="bg-white/70 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-neutral-600">Missing portfolio samples</span>
        </div>
      </div>
      <div className="bg-white/70 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
          <span className="text-xs text-neutral-600">Low response rate</span>
        </div>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ feature, isVisible, index }) => {
  return (
    <div className={`transition-all duration-1000 ${feature.delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="group relative bg-white/60 backdrop-blur-sm border border-white/30 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="mb-6 transform group-hover:scale-105 transition-transform duration-500">
            {feature.mockup}
          </div>
          
          <h3 className="text-2xl font-bold text-neutral-800 mb-4">{feature.title}</h3>
          <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleFeatures([0, 1, 2, 3]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Search Any Area",
      description: "Explore opportunities in any location with our intelligent map-based search",
      mockup: <MapMockup />,
      delay: "delay-100"
    },
    {
      title: "Smart Filters",
      description: "Refine your search with AI-powered filters that understand your needs",
      mockup: <FilterMockup />,
      delay: "delay-200"
    },
    {
      title: "Scan Hidden Demands",
      description: "Our AI discovers opportunities others miss, giving you the competitive edge",
      mockup: <ScanMockup />,
      delay: "delay-300"
    },
    {
      title: "AI Finds Weak Points",
      description: "Identify improvement opportunities in business profiles with AI analysis",
      mockup: <WeakPointsMockup />,
      delay: "delay-400"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-primary-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-200/30 to-accent-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-accent-200/30 to-primary-200/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Experience the future of business-freelancer connections with our cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              feature={feature}
              isVisible={visibleFeatures.includes(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Section Component
const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-r from-primary-900 to-accent-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-200 to-accent-200 bg-clip-text text-transparent">
          ClientAIMap
        </h3>
        <p className="text-primary-200 mb-8">
          The future of business-freelancer connections
        </p>
        <div className="border-t border-primary-800 pt-8">
          <p className="text-primary-300 text-sm">
            © 2024 ClientAIMap. Revolutionizing connections with AI.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('loading'); // 'loading', 'landing', 'onboarding', 'freelancer-dashboard', 'business-dashboard'
  const [onboardingFlow, setOnboardingFlow] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize app and check for existing session
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      
      try {
        // Add a small delay to ensure localStorage is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if we're returning from Google OAuth
        const oauthPending = localStorage.getItem('clientaimap_oauth_pending');
        const oauthUserType = localStorage.getItem('clientaimap_oauth_usertype');
        const storedUserData = localStorage.getItem('clientaimap_userdata');
        
        if (oauthPending && oauthUserType && storedUserData) {
          console.log('Handling Google OAuth callback');
          
          try {
            const userData = JSON.parse(storedUserData);
            
            // Get the current Supabase session (should be set by OAuth)
            const sessionResult = await getCurrentSession();
            
            if (sessionResult.success && sessionResult.session) {
              console.log('OAuth session found, completing setup');
              
              // Create complete user data with session
              const completeUserData = {
                ...userData,
                user: sessionResult.session.user,
                session: sessionResult.session,
                email: sessionResult.session.user.email,
                id: sessionResult.session.user.id
              };
              
              // Store the complete session
              localStorage.setItem('clientaimap_session', JSON.stringify({
                user: sessionResult.session.user,
                session: sessionResult.session,
                userData: completeUserData,
                timestamp: Date.now()
              }));
              
              // Clean up OAuth flags
              localStorage.removeItem('clientaimap_oauth_pending');
              localStorage.removeItem('clientaimap_oauth_usertype');
              
              setUserData(completeUserData);
              
              // Redirect to appropriate dashboard
              if (userData.userType === 'freelancer') {
                console.log('Redirecting OAuth user to freelancer dashboard');
                setCurrentView('freelancer-dashboard');
              } else {
                console.log('Redirecting OAuth user to business dashboard');
                setCurrentView('business-dashboard');
              }
              
              setIsInitialized(true);
              return;
            }
          } catch (error) {
            console.error('Error handling OAuth callback:', error);
            // Clean up and fall through to normal flow
            localStorage.removeItem('clientaimap_oauth_pending');
            localStorage.removeItem('clientaimap_oauth_usertype');
          }
        }
        
        // Normal session check
        const storedSessionData = getStoredSessionData();
        console.log('Stored session data:', storedSessionData);
        
        if (storedSessionData && isSessionValid()) {
          console.log('Valid session found, restoring user:', storedSessionData.userData);
          setUserData(storedSessionData.userData);
          
          // Redirect to appropriate dashboard
          if (storedSessionData.userData.userType === 'freelancer') {
            console.log('Redirecting to freelancer dashboard');
            setCurrentView('freelancer-dashboard');
          } else {
            console.log('Redirecting to business dashboard');
            setCurrentView('business-dashboard');
          }
        } else {
          console.log('No valid session found, going to landing page');
          setCurrentView('landing');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setCurrentView('landing');
      } finally {
        setIsInitialized(true);
        console.log('App initialization complete');
      }
    };

    initializeApp();
  }, []);

  const handleStartOnboarding = (userType) => {
    setOnboardingFlow(userType);
    setCurrentView('onboarding');
  };

  const handleCloseOnboarding = () => {
    setOnboardingFlow(null);
    setCurrentView('landing');
  };

  const handleOnboardingComplete = (completedUserData) => {
    console.log('Onboarding completed in App.js:', completedUserData);
    
    // Validate that we have the required data
    if (!completedUserData || !completedUserData.userType) {
      console.error('Invalid user data received:', completedUserData);
      setCurrentView('landing');
      return;
    }

    // Set user data and clear onboarding flow
    setUserData(completedUserData);
    setOnboardingFlow(null);
    
    // Ensure session is stored (backup in case OnboardingFlow didn't do it)
    try {
      localStorage.setItem('clientaimap_session', JSON.stringify({
        user: completedUserData.user,
        session: completedUserData.session,
        userData: completedUserData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error storing session in App.js:', error);
    }
    
    // Redirect based on user type
    console.log('Redirecting to dashboard for user type:', completedUserData.userType);
    if (completedUserData.userType === 'freelancer') {
      setCurrentView('freelancer-dashboard');
    } else {
      setCurrentView('business-dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUserData(null);
      setCurrentView('landing');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if API call fails
      setUserData(null);
      setCurrentView('landing');
    }
  };

  // Show loading screen while initializing
  if (!isInitialized || currentView === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent mb-2">
            ClientAIMap
          </h1>
          <p className="text-neutral-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render different views based on current state
  if (currentView === 'freelancer-dashboard') {
    return <FreelancerDashboard userData={userData} onLogout={handleLogout} />;
  }

  if (currentView === 'business-dashboard') {
    // TODO: Create BusinessDashboard component
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Business Dashboard</h1>
          <p className="text-neutral-600 mb-8">Coming soon...</p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-gradient-to-r from-accent-500 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Landing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-white">
      <HeroSection onStartOnboarding={handleStartOnboarding} />
      <FeaturesSection />
      <FooterSection />
      
      {/* Onboarding Flow Modal */}
      {currentView === 'onboarding' && onboardingFlow && (
        <OnboardingFlow
          userType={onboardingFlow}
          onClose={handleCloseOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}

export default App;
