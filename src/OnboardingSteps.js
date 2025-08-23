import React from 'react';

// Freelancer Purpose Step
export const FreelancerPurposeStep = ({ formData, updateFormData, errors }) => {
  const purposes = [
    { id: 'find-work', label: 'Find freelance work', icon: '💼', description: 'Looking for projects and clients' },
    { id: 'build-network', label: 'Build professional network', icon: '🤝', description: 'Connect with other professionals' },
    { id: 'showcase-skills', label: 'Showcase my skills', icon: '⭐', description: 'Display portfolio and expertise' },
    { id: 'learn-grow', label: 'Learn and grow', icon: '📈', description: 'Develop new skills and knowledge' },
    { id: 'other', label: 'Other', icon: '💭', description: 'Something else in mind' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">What brings you here?</h3>
        <p className="text-lg text-neutral-600">Help us understand your goals so we can personalize your experience</p>
      </div>

      <div className="grid gap-4">
        {purposes.map((purpose) => (
          <div
            key={purpose.id}
            onClick={() => updateFormData('purpose', purpose.id)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              formData.purpose === purpose.id
                ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-accent-50 shadow-lg'
                : 'border-neutral-200 hover:border-primary-300 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{purpose.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-800 mb-1">{purpose.label}</h4>
                <p className="text-neutral-600 text-sm">{purpose.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                formData.purpose === purpose.id ? 'border-primary-500 bg-primary-500' : 'border-neutral-300'
              }`}>
                {formData.purpose === purpose.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {formData.purpose === 'other' && (
        <div className="animate-slide-in-up">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Tell us more about your purpose
          </label>
          <textarea
            value={formData.customPurpose || ''}
            onChange={(e) => updateFormData('customPurpose', e.target.value)}
            placeholder="What would you like to achieve on ClientAIMap?"
            className="w-full p-4 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-24"
          />
        </div>
      )}

      {errors.purpose && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.purpose}
        </div>
      )}
    </div>
  );
};

// Business Type Step
export const BusinessTypeStep = ({ formData, updateFormData, errors }) => {
  const businessTypes = [
    { id: 'startup', label: 'Startup', icon: '🚀', description: 'Early-stage innovative company' },
    { id: 'small-business', label: 'Small Business', icon: '🏪', description: 'Local or regional business' },
    { id: 'enterprise', label: 'Enterprise', icon: '🏢', description: 'Large established corporation' },
    { id: 'agency', label: 'Agency', icon: '🎨', description: 'Creative or marketing agency' },
    { id: 'nonprofit', label: 'Non-profit', icon: '❤️', description: 'Non-profit organization' },
    { id: 'freelancer', label: 'Solo Freelancer', icon: '👤', description: 'Individual looking to hire others' },
    { id: 'other', label: 'Other', icon: '💼', description: 'Different type of business' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">What kind of business are you?</h3>
        <p className="text-lg text-neutral-600">This helps us tailor the platform to your needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {businessTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => updateFormData('businessType', type.id)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              formData.businessType === type.id
                ? 'border-accent-500 bg-gradient-to-r from-accent-50 to-primary-50 shadow-lg'
                : 'border-neutral-200 hover:border-accent-300 bg-white'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{type.icon}</div>
              <h4 className="font-semibold text-neutral-800 mb-2">{type.label}</h4>
              <p className="text-neutral-600 text-sm">{type.description}</p>
            </div>
          </div>
        ))}
      </div>

      {formData.businessType === 'other' && (
        <div className="animate-slide-in-up">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Describe your business type
          </label>
          <input
            type="text"
            value={formData.customBusinessType || ''}
            onChange={(e) => updateFormData('customBusinessType', e.target.value)}
            placeholder="e.g., E-commerce platform, Consulting firm..."
            className="w-full p-4 border border-neutral-300 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
      )}

      {errors.businessType && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.businessType}
        </div>
      )}
    </div>
  );
};

// Social Links Step (for both freelancer and business)
export const SocialLinksStep = ({ formData, updateFormData, errors }) => {
  const socialPlatforms = [
    { 
      key: 'linkedin', 
      label: 'LinkedIn', 
      icon: '💼', 
      placeholder: 'https://linkedin.com/in/yourprofile',
      description: 'Professional networking'
    },
    { 
      key: 'instagram', 
      label: 'Instagram', 
      icon: '📸', 
      placeholder: 'https://instagram.com/yourusername',
      description: 'Visual portfolio & brand'
    },
    { 
      key: 'facebook', 
      label: 'Facebook', 
      icon: '👥', 
      placeholder: 'https://facebook.com/yourpage',
      description: 'Community & business page'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">Boost your visibility</h3>
        <p className="text-lg text-neutral-600">Add your social media links to build trust and showcase your work</p>
        <div className="mt-2 text-sm text-neutral-500">Optional - but highly recommended</div>
      </div>

      <div className="space-y-6 onboarding-content">
        {socialPlatforms.map((platform, index) => (
          <div key={platform.key} className="social-card bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-accent-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {platform.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-neutral-800 text-lg">{platform.label}</label>
                    <span className="text-sm text-neutral-500 hidden sm:block">{platform.description}</span>
                  </div>
                  <div className="sm:hidden mt-1">
                    <span className="text-sm text-neutral-500">{platform.description}</span>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <input
                  type="url"
                  value={formData.socialLinks[platform.key]}
                  onChange={(e) => updateFormData(`socialLinks.${platform.key}`, e.target.value)}
                  placeholder={platform.placeholder}
                  className="social-input w-full p-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-neutral-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-primary-800 mb-1">Pro Tip</h4>
            <p className="text-primary-700 text-sm">
              Adding social links increases your profile credibility by up to 70% and helps potential clients or collaborators learn more about you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Business Name Step
export const BusinessNameStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">What's your business name?</h3>
        <p className="text-lg text-neutral-600">This will be displayed on your business profile</p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          Business Name *
        </label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => updateFormData('businessName', e.target.value)}
          placeholder="Enter your business name"
          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent text-lg ${
            errors.businessName ? 'border-red-300' : 'border-neutral-300'
          }`}
        />
        
        {errors.businessName && (
          <div className="mt-2 text-red-600 text-sm">{errors.businessName}</div>
        )}
      </div>

      <div className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-2xl p-4 max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">✨</div>
          <div>
            <h4 className="font-semibold text-accent-800 mb-1">Your Brand Matters</h4>
            <p className="text-accent-700 text-sm">
              A clear, professional business name helps freelancers find and remember you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Account Details Step
export const AccountDetailsStep = ({ formData, updateFormData, errors, showName, onGoogleSignUp }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">Create your account</h3>
        <p className="text-lg text-neutral-600">Just a few more details to get you started</p>
      </div>

      {/* Google OAuth Option */}
      <div className="max-w-md mx-auto">
        <button
          type="button"
          onClick={onGoogleSignUp}
          className="w-full p-4 border-2 border-neutral-300 rounded-2xl hover:border-primary-400 transition-all duration-300 hover:shadow-lg bg-white flex items-center justify-center space-x-3 group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-semibold text-neutral-700 group-hover:text-primary-600">Continue with Google</span>
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-neutral-500">or create with email</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {showName && (
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-neutral-300'
              }`}
            />
            {errors.name && (
              <div className="mt-1 text-red-600 text-sm">{errors.name}</div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter your email address"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.email && (
            <div className="mt-1 text-red-600 text-sm">{errors.email}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            placeholder="Create a secure password"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.password ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.password && (
            <div className="mt-1 text-red-600 text-sm">{errors.password}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.confirmPassword && (
            <div className="mt-1 text-red-600 text-sm">{errors.confirmPassword}</div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl p-4 max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🔒</div>
          <div>
            <h4 className="font-semibold text-primary-800 mb-1">Secure & Private</h4>
            <p className="text-primary-700 text-sm">
              Your data is encrypted and secure. We never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Review Step
export const ReviewStep = ({ formData, userType }) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">Review your information</h3>
        <p className="text-lg text-neutral-600">Make sure everything looks correct before we create your account</p>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 space-y-4">
        {userType === 'freelancer' ? (
          <>
            <div>
              <label className="text-sm font-semibold text-neutral-600">Purpose</label>
              <p className="text-neutral-800">{getPurposeLabel(formData.purpose)}</p>
              {formData.customPurpose && (
                <p className="text-neutral-600 text-sm mt-1">"{formData.customPurpose}"</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-600">Name</label>
              <p className="text-neutral-800">{formData.name}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-semibold text-neutral-600">Business Type</label>
              <p className="text-neutral-800">{getBusinessTypeLabel(formData.businessType)}</p>
              {formData.customBusinessType && (
                <p className="text-neutral-600 text-sm mt-1">"{formData.customBusinessType}"</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-600">Business Name</label>
              <p className="text-neutral-800">{formData.businessName}</p>
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-semibold text-neutral-600">Email</label>
          <p className="text-neutral-800">{formData.email}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-600">Social Links</label>
          <div className="space-y-1">
            {formData.socialLinks.linkedin && (
              <p className="text-neutral-800 text-sm">💼 LinkedIn: {formData.socialLinks.linkedin}</p>
            )}
            {formData.socialLinks.instagram && (
              <p className="text-neutral-800 text-sm">📸 Instagram: {formData.socialLinks.instagram}</p>
            )}
            {formData.socialLinks.facebook && (
              <p className="text-neutral-800 text-sm">👥 Facebook: {formData.socialLinks.facebook}</p>
            )}
            {!formData.socialLinks.linkedin && !formData.socialLinks.instagram && !formData.socialLinks.facebook && (
              <p className="text-neutral-500 text-sm">No social links added</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎉</div>
          <div>
            <h4 className="font-semibold text-accent-800 mb-1">Almost There!</h4>
            <p className="text-accent-700 text-sm">
              Click "Create Account" to join ClientAIMap and start discovering amazing opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Processing Step
export const ProcessingStep = ({ isLoading }) => {
  return (
    <div className="text-center py-12">
      <div className="animate-spin w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-neutral-800 mb-4">Creating your account...</h3>
      <p className="text-neutral-600">
        We're setting up your profile and getting everything ready for you.
      </p>
    </div>
  );
};

// Combined Business Name and Account Details Step
export const BusinessNameAndAccountStep = ({ formData, updateFormData, errors, onGoogleSignUp }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-neutral-800 mb-4">Business Details & Account</h3>
        <p className="text-lg text-neutral-600">Let's set up your business profile and account</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => updateFormData('businessName', e.target.value)}
            placeholder="Enter your business name"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent ${
              errors.businessName ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.businessName && (
            <div className="mt-1 text-red-600 text-sm">{errors.businessName}</div>
          )}
        </div>

        {/* Google OAuth Option */}
        <div className="my-6">
          <button
            type="button"
            onClick={onGoogleSignUp}
            className="w-full p-4 border-2 border-neutral-300 rounded-2xl hover:border-accent-400 transition-all duration-300 hover:shadow-lg bg-white flex items-center justify-center space-x-3 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-semibold text-neutral-700 group-hover:text-accent-600">Continue with Google</span>
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">or create with email</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter your email address"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.email && (
            <div className="mt-1 text-red-600 text-sm">{errors.email}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            placeholder="Create a secure password"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent ${
              errors.password ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.password && (
            <div className="mt-1 text-red-600 text-sm">{errors.password}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-accent-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'
            }`}
          />
          {errors.confirmPassword && (
            <div className="mt-1 text-red-600 text-sm">{errors.confirmPassword}</div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-2xl p-4 max-w-md mx-auto">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🔒</div>
          <div>
            <h4 className="font-semibold text-accent-800 mb-1">Secure & Private</h4>
            <p className="text-accent-700 text-sm">
              Your data is encrypted and secure. We never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Step
export const SuccessStep = ({ userType }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="text-3xl text-white">✓</div>
      </div>
      <h3 className="text-3xl font-bold text-neutral-800 mb-4">Welcome to ClientAIMap! 🎉</h3>
      <p className="text-lg text-neutral-600 mb-6">
        Your {userType} account has been successfully created.
      </p>
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl p-6 max-w-md mx-auto">
        <h4 className="font-semibold text-primary-800 mb-2">What's next?</h4>
        <p className="text-primary-700 text-sm">
          {userType === 'freelancer' 
            ? "You'll be redirected to your dashboard where you can start exploring opportunities and building your profile."
            : "You'll be redirected to your business dashboard where you can start posting projects and finding talented freelancers."
          }
        </p>
      </div>
    </div>
  );
};
