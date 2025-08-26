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
      {/* Primary floating elements with better gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-full blur-3xl animate-float opacity-60"></div>
      <div className="absolute top-40 right-16 w-80 h-80 bg-gradient-to-r from-accent-400/20 to-primary-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-300/25 to-accent-300/25 rounded-full blur-2xl animate-bounce-slow opacity-70"></div>
      <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-primary-500/15 rounded-full blur-xl animate-pulse-slow"></div>
      
      {/* Additional modern elements */}
      <div className="absolute top-1/2 left-20 w-56 h-56 bg-gradient-to-r from-accent-200/15 to-primary-200/15 rounded-full blur-3xl animate-float opacity-50" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-3/4 right-20 w-32 h-32 bg-gradient-to-r from-primary-400/15 to-accent-400/15 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      
      {/* Extra subtle background elements */}
      <div className="absolute top-10 right-1/4 w-24 h-24 bg-gradient-to-r from-emerald-300/10 to-teal-300/10 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-r from-violet-300/10 to-purple-300/10 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '2.5s'}}></div>
    </div>
  );
};

// Login Card Component
const LoginCard = ({ title, subtitle, icon, gradient, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700`}></div>
      
      {/* Main card */}
      <div className="relative bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl p-10 transition-all duration-700 hover:transform hover:scale-[1.03] shadow-2xl hover:shadow-3xl">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-700">
            {icon}
          </div>
          <div className={`w-20 h-1.5 bg-gradient-to-r ${gradient} rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-700 shadow-md`}></div>
        </div>
        
        {/* Content */}
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
            {title}
          </h3>
          <p className="text-neutral-600 leading-relaxed text-lg">
            {subtitle}
          </p>
        </div>
        
        {/* CTA Button */}
        <div className="mt-10">
          <div className={`w-full py-5 px-8 rounded-2xl bg-gradient-to-r ${gradient} text-white font-semibold transition-all duration-500 hover:shadow-2xl text-center group-hover:shadow-2xl transform group-hover:scale-[1.02] text-lg`}>
            <span className="flex items-center justify-center space-x-3">
              <span>Get Started</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ onStartOnboarding }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-primary-50/20">
      <FloatingShapes />
      
      {/* Content Container */}
      <div className="relative z-10 text-center px-8 py-32 max-w-8xl mx-auto">
        
        {/* Main Heading */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-neutral-900 via-primary-600 to-accent-600 bg-clip-text text-transparent mb-8 leading-[0.85] tracking-tighter">
              ClientAI<span className="text-primary-500">Map</span>
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-12 shadow-lg"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-neutral-700 mb-12 font-light leading-relaxed max-w-5xl mx-auto">
            Where <span className="font-semibold text-primary-600 relative">
              opportunities
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-transparent opacity-60"></div>
            </span> meet <span className="font-semibold text-accent-600 relative">
              intelligence
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-400 to-transparent opacity-60"></div>
            </span>
          </h2>
        </div>
        
        {/* Subtitle */}
        <div className={`transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl md:text-2xl text-neutral-600 mb-20 max-w-4xl mx-auto leading-relaxed font-light">
            AI-powered platform connecting businesses and freelancers through intelligent opportunity discovery and smart matching.
            <br />
            <span className="text-primary-600 font-medium">Discover what others miss.</span>
          </p>
        </div>

        {/* Login Cards */}
        <div className={`transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-24">
            <LoginCard 
              title="For Freelancers"
              subtitle="Discover perfect projects and build meaningful client relationships with AI-powered matching"
              icon="👨‍💻"
              gradient="from-primary-500 to-primary-700"
              onClick={() => onStartOnboarding('freelancer')}
            />
            <LoginCard 
              title="For Businesses"
              subtitle="Find exceptional talent and streamline your hiring process with intelligent recommendations"
              icon="🏢"
              gradient="from-accent-500 to-accent-700"
              onClick={() => onStartOnboarding('business')}
            />
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className={`transition-all duration-1000 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-wrap items-center justify-center gap-12 text-neutral-500">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-base font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg" style={{animationDelay: '0.5s'}}></div>
              <span className="text-base font-medium">Smart Matching</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg" style={{animationDelay: '1s'}}></div>
              <span className="text-base font-medium">Global Network</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg" style={{animationDelay: '1.5s'}}></div>
              <span className="text-base font-medium">Secure & Trusted</span>
            </div>
          </div>
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
      <div className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.02] hover:bg-white/80">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          {/* Image placeholder - INSERT YOUR IMAGE HERE */}
          <div className="mb-8 transform group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300 relative overflow-hidden">
              {/* Replace this div with your image component: */}
              {/* <img src="your-image-path.jpg" alt={feature.title} className="w-full h-full object-cover rounded-2xl" /> */}
              
              {/* Placeholder content - remove when adding your image */}
              <div className="text-center text-neutral-500">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <p className="text-sm font-medium">Insert your image here</p>
                <p className="text-xs opacity-75">Recommended: 400x200px</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors">
              {feature.title}
            </h3>
            <p className="text-neutral-600 leading-relaxed group-hover:text-neutral-700 transition-colors">
              {feature.description}
            </p>
          </div>
          
          {/* Subtle indicator */}
          <div className="mt-6 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-sm font-medium">Learn more</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
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
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "Smart Location Search",
      description: "Explore opportunities anywhere with our intelligent map-based discovery system that finds hidden gems and untapped markets.",
      icon: "🗺️",
      delay: "delay-100"
    },
    {
      title: "AI-Powered Filters",
      description: "Refine your search with machine learning filters that understand your preferences and requirements for perfect matches.",
      icon: "🎯",
      delay: "delay-200"
    },
    {
      title: "Opportunity Scanner",
      description: "Our AI continuously scans for emerging opportunities and market gaps others haven't discovered yet, giving you the edge.",
      icon: "🔍",
      delay: "delay-300"
    },
    {
      title: "Profile Optimization",
      description: "Get AI-driven insights to improve your profile and increase your chances of landing great projects with data-backed recommendations.",
      icon: "⚡",
      delay: "delay-400"
    }
  ];

  return (
    <section className="py-32 lg:py-40 bg-gradient-to-b from-white to-neutral-50/50 relative overflow-hidden">
      {/* Background elements - larger and more prominent */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-primary-100/30 to-accent-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-accent-100/30 to-primary-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-emerald-100/20 to-teal-100/20 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 max-w-8xl mx-auto px-8">
        {/* Section Header - improved spacing */}
        <div className="text-center mb-28">
          <div className="inline-flex items-center space-x-3 bg-primary-50/80 backdrop-blur-sm text-primary-600 px-6 py-3 rounded-full text-base font-semibold mb-8 border border-primary-100/50 shadow-sm">
            <span className="text-xl">✨</span>
            <span>Powerful Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
            Built for the
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> future</span>
          </h2>
          <p className="text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience next-generation tools designed to revolutionize how you discover opportunities and build meaningful connections.
          </p>
        </div>

        {/* Features Grid - better spacing */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
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
    <footer className="bg-gradient-to-br from-neutral-900 via-primary-900/90 to-accent-900/90 text-white py-24 relative overflow-hidden">
      {/* Background elements - more dramatic */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-r from-primary-500/15 to-accent-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-accent-500/15 to-primary-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-400/10 to-accent-400/10 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        {/* Logo and tagline - improved spacing */}
        <div className="mb-12">
          <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-accent-200 bg-clip-text text-transparent">
            ClientAIMap
          </h3>
          <p className="text-primary-200 text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Empowering connections between visionaries and creators through intelligent technology.
            <br />
            <span className="text-white/80 text-lg">Building the future of work, one connection at a time.</span>
          </p>
        </div>
        
        {/* Divider - more prominent */}
        <div className="w-32 h-1.5 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 mx-auto mb-12 rounded-full shadow-lg"></div>
        
        {/* Additional features or social proof */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-8 text-primary-300">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌐</span>
              <span className="font-medium">Global Reach</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔒</span>
              <span className="font-medium">Secure Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span className="font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎨</span>
              <span className="font-medium">Creative Solutions</span>
            </div>
          </div>
        </div>
        
        {/* Copyright - refined */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-primary-300 text-base">
            © 2024 ClientAIMap. All rights reserved. • <span className="text-white/80">Revolutionizing connections with AI.</span>
          </p>
          <p className="text-primary-400 text-sm mt-2">
            Made with ♥️ for the future of work
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
