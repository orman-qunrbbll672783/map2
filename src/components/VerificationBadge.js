import React from 'react';

// Verification Badge Component for Verified Businesses
const VerificationBadge = ({ 
  isVerified = false, 
  size = 'md', 
  showText = true, 
  businessData = null,
  className = "" 
}) => {
  if (!isVerified) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-lg ${sizeClasses[size]} ${className}`}>
      <span className={`${iconSizes[size]}`}>✓</span>
      {showText && <span>Verified Business</span>}
      {businessData && businessData.rating && (
        <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-white/30">
          <span className="text-yellow-300">⭐</span>
          <span className="text-xs">{businessData.rating}</span>
        </div>
      )}
    </div>
  );
};

// Business Card Component with Verification Badge
export const VerifiedBusinessCard = ({ business, onClick, className = "" }) => {
  return (
    <div 
      className={`bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Header with Verification Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors line-clamp-1">
            {business.business_name || business.name}
          </h3>
          <p className="text-neutral-600 text-sm mt-1">{business.category}</p>
        </div>
        <VerificationBadge 
          isVerified={business.verified} 
          size="sm" 
          showText={false}
          businessData={business.google_maps_data}
          className="flex-shrink-0"
        />
      </div>

      {/* Business Details */}
      <div className="space-y-3 mb-4">
        {business.address && (
          <div className="flex items-start space-x-2 text-sm text-neutral-600">
            <span className="text-primary-500 mt-0.5">📍</span>
            <span className="line-clamp-2">{business.address}</span>
          </div>
        )}
        
        {business.description && (
          <div className="text-sm text-neutral-700 line-clamp-3">
            {business.description}
          </div>
        )}

        {business.google_maps_data && (
          <div className="flex items-center space-x-4 text-xs text-neutral-500">
            {business.google_maps_data.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">⭐</span>
                <span>{business.google_maps_data.rating}</span>
                <span>({business.google_maps_data.totalRatings})</span>
              </div>
            )}
            {business.google_maps_data.phone && (
              <div className="flex items-center space-x-1">
                <span>📞</span>
                <span>{business.google_maps_data.phone}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <div className="text-xs text-neutral-500">
          Verified {business.created_at ? new Date(business.created_at).toLocaleDateString() : 'Recently'}
        </div>
        <div className="flex items-center text-primary-600 group-hover:text-primary-700 transition-colors">
          <span className="text-sm font-medium">View Details</span>
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Verification Status Indicator for Lists
export const VerificationStatusIndicator = ({ isVerified, inline = false }) => {
  if (inline) {
    return isVerified ? (
      <span className="inline-flex items-center space-x-1 text-green-600 text-sm">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span>Verified</span>
      </span>
    ) : (
      <span className="inline-flex items-center space-x-1 text-neutral-500 text-sm">
        <span className="w-2 h-2 bg-neutral-300 rounded-full"></span>
        <span>Unverified</span>
      </span>
    );
  }

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
      isVerified 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
    }`}>
      {isVerified ? '✓ Verified' : 'Unverified'}
    </div>
  );
};

export default VerificationBadge;