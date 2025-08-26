import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database functions for saving user data
export const saveFreelancerData = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('freelancers')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          purpose: formData.purpose,
          custom_purpose: formData.customPurpose,
          linkedin: formData.socialLinks.linkedin,
          instagram: formData.socialLinks.instagram,
          facebook: formData.socialLinks.facebook,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving freelancer data:', error);
    return { success: false, error: error.message };
  }
};

export const saveBusinessData = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert([
        {
          business_name: formData.businessName,
          business_type: formData.businessType,
          custom_business_type: formData.customBusinessType,
          email: formData.email,
          linkedin: formData.socialLinks.linkedin,
          instagram: formData.socialLinks.instagram,
          facebook: formData.socialLinks.facebook,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving business data:', error);
    return { success: false, error: error.message };
  }
};

// Authentication functions
export const signUpUser = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: userData,
        emailRedirectTo: window.location.origin
      }
    });

    if (error) throw error;

    // If user is immediately confirmed (no email verification required)
    if (data.user && data.session) {
      // Store session data in localStorage for persistence
      localStorage.setItem('clientaimap_session', JSON.stringify({
        user: data.user,
        session: data.session,
        userData: userData,
        timestamp: Date.now()
      }));
    }

    return { success: true, data, session: data.session };
  } catch (error) {
    console.error('Error signing up user:', error);
    return { success: false, error: error.message };
  }
};

// Sign in existing user
export const signInUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    // Store session data in localStorage for persistence
    if (data.user && data.session) {
      const storedUserData = localStorage.getItem('clientaimap_userdata');
      const userData = storedUserData ? JSON.parse(storedUserData) : {};

      localStorage.setItem('clientaimap_session', JSON.stringify({
        user: data.user,
        session: data.session,
        userData: userData,
        timestamp: Date.now()
      }));
    }

    return { success: true, data, session: data.session };
  } catch (error) {
    console.error('Error signing in user:', error);
    return { success: false, error: error.message };
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (session) {
      // Update localStorage with fresh session
      const storedData = localStorage.getItem('clientaimap_session');
      const existingData = storedData ? JSON.parse(storedData) : {};
      
      localStorage.setItem('clientaimap_session', JSON.stringify({
        ...existingData,
        user: session.user,
        session: session,
        timestamp: Date.now()
      }));
    }
    
    return { success: true, session };
  } catch (error) {
    console.error('Error getting session:', error);
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // Clear all stored session data
    localStorage.removeItem('clientaimap_session');
    localStorage.removeItem('clientaimap_userdata');
    localStorage.removeItem('pendingUserData');
    
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

// Check if session is valid
export const isSessionValid = () => {
  try {
    const storedSession = localStorage.getItem('clientaimap_session');
    if (!storedSession) {
      console.log('No stored session found');
      return false;
    }
    
    const sessionData = JSON.parse(storedSession);
    console.log('Checking session validity:', sessionData);
    
    if (!sessionData.timestamp) {
      console.log('Session missing timestamp');
      return false;
    }
    
    const now = Date.now();
    const sessionAge = now - sessionData.timestamp;
    
    // Session expires after 24 hours of inactivity
    const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
    
    if (sessionAge > SESSION_EXPIRY) {
      console.log('Session expired, removing from storage');
      localStorage.removeItem('clientaimap_session');
      return false;
    }
    
    // Check if we have the required session data
    const hasValidData = sessionData.userData && sessionData.userData.userType;
    console.log('Session validation result:', hasValidData);
    
    return hasValidData;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
};

// Get stored session data
export const getStoredSessionData = () => {
  try {
    const storedSession = localStorage.getItem('clientaimap_session');
    console.log('Raw stored session:', storedSession);
    
    if (!storedSession) {
      console.log('No session in localStorage');
      return null;
    }
    
    const sessionData = JSON.parse(storedSession);
    console.log('Parsed session data:', sessionData);
    
    if (isSessionValid()) {
      console.log('Session is valid, returning data');
      return sessionData;
    }
    
    console.log('Session is not valid');
    return null;
  } catch (error) {
    console.error('Error getting stored session:', error);
    return null;
  }
};

// Google OAuth sign up
export const signUpWithGoogle = async (userData) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) throw error;
    
    // Store user data in localStorage temporarily for after OAuth callback
    if (userData) {
      localStorage.setItem('pendingUserData', JSON.stringify(userData));
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error signing up with Google:', error);
    return { success: false, error: error.message };
  }
};

// Saved Businesses Functions
export const getSavedBusinesses = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('saved_businesses')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    
    // Extract business_data from each record
    const businesses = data.map(record => ({
      ...record.business_data,
      savedAt: record.saved_at,
      savedId: record.id
    }));
    
    return { success: true, data: businesses };
  } catch (error) {
    console.error('Error getting saved businesses:', error);
    return { success: false, error: error.message, data: [] };
  }
};

export const saveBusinessToSupabase = async (business) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if business is already saved
    const { data: existing } = await supabase
      .from('saved_businesses')
      .select('id')
      .eq('user_id', user.id)
      .eq('business_place_id', business.id)
      .single();

    if (existing) {
      return { success: false, error: 'Business already saved' };
    }

    const { data, error } = await supabase
      .from('saved_businesses')
      .insert([
        {
          user_id: user.id,
          business_place_id: business.id,
          business_data: business,
          saved_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving business:', error);
    return { success: false, error: error.message };
  }
};

export const removeSavedBusiness = async (businessId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('saved_businesses')
      .delete()
      .eq('user_id', user.id)
      .eq('business_place_id', businessId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing saved business:', error);
    return { success: false, error: error.message };
  }
};

export const isBusinessSaved = async (businessId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: true, isSaved: false };
    }

    const { data, error } = await supabase
      .from('saved_businesses')
      .select('id')
      .eq('user_id', user.id)
      .eq('business_place_id', businessId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }
    
    return { success: true, isSaved: !!data };
  } catch (error) {
    console.error('Error checking if business is saved:', error);
    return { success: false, error: error.message, isSaved: false };
  }
};

// Google Maps Business Verification Functions
export const extractPlaceIdFromGoogleMapsUrl = (url) => {
  try {
    // Handle different Google Maps URL formats
    const patterns = [
      /place_id:([A-Za-z0-9_-]+)/,
      /data=.*?1s([A-Za-z0-9_-]+)/,
      /cid=([0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting place ID:', error);
    return null;
  }
};

export const verifyGoogleMapsLink = async (googleMapsUrl) => {
  try {
    const placeId = extractPlaceIdFromGoogleMapsUrl(googleMapsUrl);
    
    if (!placeId) {
      return { 
        success: false, 
        error: 'Invalid Google Maps URL. Please ensure you\'re using a valid Google Maps business link.' 
      };
    }

    // For now, we'll create mock data structure
    // In production, you would integrate with Google Places API
    const mockBusinessData = {
      placeId: placeId,
      name: 'Sample Business Name',
      address: '123 Business Street, City, State 12345',
      phone: '+1 (555) 123-4567',
      website: 'https://samplebusiness.com',
      category: 'Restaurant',
      rating: 4.5,
      totalRatings: 127,
      verified: true,
      extractedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: mockBusinessData
    };
  } catch (error) {
    console.error('Error verifying Google Maps link:', error);
    return {
      success: false,
      error: 'Failed to verify Google Maps link. Please try again.'
    };
  }
};

export const saveVerifiedBusinessData = async (businessData, description = '') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('verified_businesses')
      .insert([
        {
          user_id: user.id,
          place_id: businessData.placeId,
          business_name: businessData.name,
          address: businessData.address,
          phone: businessData.phone,
          website: businessData.website,
          category: businessData.category,
          rating: businessData.rating,
          total_ratings: businessData.totalRatings,
          description: description,
          google_maps_data: businessData,
          verified: true,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving verified business data:', error);
    return { success: false, error: error.message };
  }
};

export const getVerifiedBusinessProfile = async (userId = null) => {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!targetUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('verified_businesses')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('verified', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return { success: true, data: data || null };
  } catch (error) {
    console.error('Error getting verified business profile:', error);
    return { success: false, error: error.message, data: null };
  }
};

export const getAllVerifiedBusinesses = async () => {
  try {
    const { data, error } = await supabase
      .from('verified_businesses')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting all verified businesses:', error);
    return { success: false, error: error.message, data: [] };
  }
};

export const updateBusinessDescription = async (description) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('verified_businesses')
      .update({ 
        description: description,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating business description:', error);
    return { success: false, error: error.message };
  }
};
