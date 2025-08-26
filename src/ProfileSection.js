import React, { useState, useEffect } from 'react';
import { getStoredSessionData } from './supabaseClient';

// Profile Section Component
const ProfileSection = ({ userData, isVisible = true }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (userData) {
      setProfileData(userData);
    }
  }, [userData]);

  if (!profileData) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading profile...</p>
      </div>
    );
  }

  const getUserTypeConfig = () => {
    if (profileData.userType === 'freelancer') {
      return {
        icon: '👨‍💻',
        title: 'Freelancer Profile',
        gradient: 'from-primary-500 to-primary-700',
        bgGradient: 'from-primary-50 to-primary-100'
      };
    } else {
      return {
        icon: '🏢',
        title: 'Business Profile',
        gradient: 'from-accent-500 to-accent-700',
        bgGradient: 'from-accent-50 to-accent-100'
      };
    }
  };

  const config = getUserTypeConfig();

  const getPurposeLabel = (purpose) => {
    const purposes = {
      'find-work': 'Find freelance work',
      'build-network': 'Build professional network',
      'showcase-skills': 'Showcase my skills',
      'learn-grow': 'Learn and grow',
      'other': 'Other'
    };
    return purposes[purpose] || purpose;
  };

  const getBusinessTypeLabel = (type) => {
    const types = {
      'startup': 'Startup',
      'small-business': 'Small Business',
      'enterprise': 'Enterprise',
      'agency': 'Agency',
      'nonprofit': 'Non-profit',
      'freelancer': 'Solo Freelancer',
      'other': 'Other'
    };
    return types[type] || type;
  };

  const getSocialPlatformIcon = (platform) => {
    const icons = {
      linkedin: '💼',
      instagram: '📸',
      facebook: '👥'
    };
    return icons[platform] || '🔗';
  };

  const getSocialPlatformColor = (platform) => {
    const colors = {
      linkedin: 'from-blue-500 to-blue-700',
      instagram: 'from-pink-500 to-purple-600',
      facebook: 'from-blue-600 to-blue-800'
    };
    return colors[platform] || 'from-neutral-500 to-neutral-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const OverviewTab = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* User Type & Purpose */}
      <div className={`bg-gradient-to-r ${config.bgGradient} rounded-2xl p-4 sm:p-6 border border-neutral-200`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="text-3xl sm:text-4xl">{config.icon}</div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">{config.title}</h3>
            <p className="text-neutral-600 text-sm sm:text-base">Member since {formatDate(profileData.createdAt)}</p>
          </div>
        </div>
        
        {profileData.userType === 'freelancer' ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <span className="font-medium text-neutral-700 text-sm sm:text-base">Purpose:</span>
              <span className="text-neutral-600 text-sm sm:text-base">{getPurposeLabel(profileData.purpose)}</span>
            </div>
            {profileData.purpose === 'other' && profileData.customPurpose && (
              <div className="bg-white/50 rounded-lg p-3">
                <span className="text-sm text-neutral-600">"{profileData.customPurpose}"</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <span className="font-medium text-neutral-700 text-sm sm:text-base">Business Type:</span>
              <span className="text-neutral-600 text-sm sm:text-base">{getBusinessTypeLabel(profileData.businessType)}</span>
            </div>
            {profileData.businessType === 'other' && profileData.customBusinessType && (
              <div className="bg-white/50 rounded-lg p-3">
                <span className="text-sm text-neutral-600">"{profileData.customBusinessType}"</span>
              </div>
            )}
            {profileData.businessName && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="font-medium text-neutral-700 text-sm sm:text-base">Business Name:</span>
                <span className="text-neutral-600 text-sm sm:text-base">{profileData.businessName}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-bold text-neutral-800 mb-4 flex items-center space-x-2">
          <span>📧</span>
          <span>Contact Information</span>
        </h4>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <span className="font-medium text-neutral-700 w-full sm:w-16 text-sm sm:text-base">Email:</span>
            <span className="text-neutral-600 text-sm sm:text-base break-all">{profileData.email}</span>
          </div>
          {profileData.name && (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
              <span className="font-medium text-neutral-700 w-full sm:w-16 text-sm sm:text-base">Name:</span>
              <span className="text-neutral-600 text-sm sm:text-base">{profileData.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SocialTab = () => {
    const socialLinks = profileData.socialLinks || {};
    const hasSocialLinks = Object.values(socialLinks).some(link => link && link.trim());

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-bold text-neutral-800 mb-4 flex items-center space-x-2">
            <span>🌐</span>
            <span>Social Media Profiles</span>
          </h4>
          
          {hasSocialLinks ? (
            <div className="space-y-4">
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url || !url.trim()) return null;
                
                return (
                  <div key={platform} className="group">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r hover:from-neutral-50 hover:to-primary-50"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getSocialPlatformColor(platform)} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-105 transition-transform flex-shrink-0`}>
                        {getSocialPlatformIcon(platform)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-neutral-800 capitalize text-sm sm:text-base">{platform}</h5>
                        <p className="text-xs sm:text-sm text-neutral-600 truncate">{url}</p>
                      </div>
                      <div className="text-primary-500 group-hover:text-primary-600 transition-colors self-end sm:self-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <div className="text-3xl sm:text-4xl mb-3 opacity-50">🔗</div>
              <h5 className="text-base sm:text-lg font-medium text-neutral-700 mb-2">No social media links added</h5>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-md mx-auto">Add your social media profiles to increase visibility and build trust with potential clients.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SettingsTab = () => {
    const socialLinks = profileData.socialLinks || {};
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h4 className="text-lg font-bold text-neutral-800 mb-4 flex items-center space-x-2">
            <span>⚙️</span>
            <span>Account Settings</span>
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-neutral-200 rounded-xl">
              <h5 className="font-medium text-neutral-800 mb-2">Account Type</h5>
              <p className="text-neutral-600 text-sm">You are registered as a {profileData.userType}.</p>
            </div>
            
            <div className="p-4 border border-neutral-200 rounded-xl">
              <h5 className="font-medium text-neutral-800 mb-2">Profile Completion</h5>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Object.values(socialLinks).filter(link => link && link.trim()).length * 30 + 40}%`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-600">
                  {Object.values(socialLinks).filter(link => link && link.trim()).length * 30 + 40}%
                </span>
              </div>
              <p className="text-neutral-500 text-sm mt-2">
                Complete your profile by adding social media links and additional information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Profile Header */}
      <div className="mb-6 sm:mb-8">
        <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border border-white/30">
                {config.icon}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {profileData.name || profileData.businessName || 'Your Profile'}
                </h2>
                <p className="text-white/90 text-base sm:text-lg">
                  {config.title}
                </p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-white/30">
                    {profileData.email}
                  </span>
                  <span className="text-white/80 text-xs sm:text-sm">
                    Joined {formatDate(profileData.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-6 bg-neutral-100 rounded-2xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '👤' },
          { id: 'social', label: 'Social Media', icon: '🌐' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-white/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'social' && <SocialTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default ProfileSection;