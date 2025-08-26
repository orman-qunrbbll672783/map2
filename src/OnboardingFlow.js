import React, { useState, useEffect } from 'react';
import { saveFreelancerData, saveBusinessData, signUpUser, signUpWithGoogle } from './supabaseClient';
import { 
  FreelancerPurposeStep, 
  BusinessTypeStep, 
  SocialLinksStep, 
  BusinessNameStep, 
  AccountDetailsStep, 
  BusinessNameAndAccountStep,
  GoogleMapsVerificationStep,
  ReviewStep, 
  ProcessingStep, 
  SuccessStep 
} from './OnboardingSteps';

// Onboarding Flow Component
const OnboardingFlow = ({ userType, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: userType,
    purpose: '',
    businessType: '',
    businessName: '',
    googleMapsUrl: '',
    verifiedBusinessData: null,
    businessDescription: '',
    socialLinks: {
      linkedin: '',
      instagram: '',
      facebook: ''
    },
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = userType === 'freelancer' ? 3 : 4;

  // Update form data
  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};
    
    if (userType === 'freelancer') {
      switch (step) {
        case 1:
          if (!formData.purpose.trim()) {
            newErrors.purpose = 'Please tell us your purpose on the platform';
          }
          break;
        case 3:
          if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
          }
          if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
          }
          if (!formData.password) {
            newErrors.password = 'Password is required';
          } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
          }
          if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          }
          break;
      }
    } else {
      switch (step) {
        case 1:
          if (!formData.businessType.trim()) {
            newErrors.businessType = 'Please select your business type';
          }
          break;
        case 3:
          if (!formData.businessName.trim()) {
            newErrors.businessName = 'Business name is required';
          }
          if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
          }
          if (!formData.password) {
            newErrors.password = 'Password is required';
          } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
          }
          if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          }
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === totalSteps) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit form and save to Supabase
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Store user data for persistence
      localStorage.setItem('clientaimap_userdata', JSON.stringify(formData));

      // First, create the user account
      const authResult = await signUpUser(formData.email, formData.password, {
        user_type: formData.userType,
        name: formData.name || formData.businessName
      });

      if (!authResult.success) {
        throw new Error(authResult.error);
      }

      // Then save additional profile data
      let saveResult;
      if (formData.userType === 'freelancer') {
        saveResult = await saveFreelancerData(formData);
      } else {
        saveResult = await saveBusinessData(formData);
      }

      if (!saveResult.success) {
        console.warn('Profile data save failed:', saveResult.error);
        // Continue anyway - the user account was created
      }

      console.log('Successfully created account and session:', {
        user: authResult.data?.user,
        session: authResult.session,
        userData: formData
      });
      
      // Ensure session data is properly stored
      const completeUserData = {
        ...formData,
        user: authResult.data?.user,
        session: authResult.session,
        isAuthenticated: true,
        email: authResult.data?.user?.email || formData.email,
        id: authResult.data?.user?.id
      };

      // Store complete user data in localStorage for persistence
      localStorage.setItem('clientaimap_session', JSON.stringify({
        user: authResult.data?.user,
        session: authResult.session,
        userData: completeUserData,
        timestamp: Date.now()
      }));
      
      console.log('Session stored successfully:', completeUserData);
      
      // Show success step
      setCurrentStep(totalSteps + 1);
      
      // Complete onboarding immediately with full user data
      setTimeout(() => {
        console.log('Completing onboarding with data:', completeUserData);
        onComplete(completeUserData);
      }, 1500); // Shorter delay
      
    } catch (error) {
      console.error('Error creating account:', error);
      setErrors({ submit: `Failed to create account: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth signup
  const handleGoogleSignUp = async () => {
    try {
      const userData = {
        userType: formData.userType,
        name: formData.name || formData.businessName,
        purpose: formData.purpose,
        businessType: formData.businessType,
        businessName: formData.businessName,
        socialLinks: formData.socialLinks,
        isAuthenticated: true
      };

      // Store the user data and mark it as Google OAuth
      localStorage.setItem('clientaimap_userdata', JSON.stringify(userData));
      localStorage.setItem('clientaimap_oauth_pending', 'true');
      localStorage.setItem('clientaimap_oauth_usertype', formData.userType);

      console.log('Storing OAuth user data:', userData);

      const result = await signUpWithGoogle(userData);
      
      if (result.success) {
        console.log('Google OAuth initiated successfully');
        // The redirect will happen automatically
      } else {
        setErrors({ submit: `Google sign up failed: ${result.error}` });
        // Clean up if OAuth fails
        localStorage.removeItem('clientaimap_oauth_pending');
        localStorage.removeItem('clientaimap_oauth_usertype');
      }
    } catch (error) {
      console.error('Error with Google OAuth:', error);
      setErrors({ submit: 'Failed to sign up with Google. Please try again.' });
      // Clean up if OAuth fails
      localStorage.removeItem('clientaimap_oauth_pending');
      localStorage.removeItem('clientaimap_oauth_usertype');
    }
  };

  // Render current step content
  const renderStepContent = () => {
    if (userType === 'freelancer') {
      return renderFreelancerStep();
    } else {
      return renderBusinessStep();
    }
  };

  // Freelancer steps
  const renderFreelancerStep = () => {
    switch (currentStep) {
      case 1:
        return <FreelancerPurposeStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return <SocialLinksStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 3:
        return <AccountDetailsStep formData={formData} updateFormData={updateFormData} errors={errors} showName={true} onGoogleSignUp={handleGoogleSignUp} />;
      case 4:
        return isLoading ? <ProcessingStep isLoading={isLoading} /> : <SuccessStep userType="freelancer" />;
      default:
        return null;
    }
  };

  // Business steps
  const renderBusinessStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessTypeStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return <GoogleMapsVerificationStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 3:
        return <SocialLinksStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 4:
        return <BusinessNameAndAccountStep formData={formData} updateFormData={updateFormData} errors={errors} onGoogleSignUp={handleGoogleSignUp} />;
      case 5:
        return isLoading ? <ProcessingStep isLoading={isLoading} /> : <SuccessStep userType="business" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative z-60 max-h-[calc(100vh-4rem)]">
        <div className="onboarding-modal max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-neutral-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800">
                {userType === 'freelancer' ? 'Join as Freelancer' : 'Join as Business'}
              </h2>
              <p className="text-neutral-500 mt-1">
                Step {Math.min(currentStep, totalSteps)} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out"
                style={{ width: `${(Math.min(currentStep, totalSteps) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pb-8">
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer */}
        {currentStep <= totalSteps && (
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-neutral-200 p-6 rounded-b-3xl">
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 rounded-2xl border border-neutral-300 text-neutral-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
              >
                {currentStep === totalSteps ? (isLoading ? 'Creating Account...' : 'Create Account') : 'Next'}
              </button>
            </div>
            
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errors.submit}
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
