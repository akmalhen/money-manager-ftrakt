// This is a simplified auth module for the quiz feature
// In a real application, you would use a proper auth system like NextAuth.js

// Get user info from localStorage or generate a new user if none exists
const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    // Try to get existing user from localStorage
    const storedUser = localStorage.getItem('fintrack_current_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.warn("Failed to parse stored user:", error);
      }
    }
    
    // Generate a new user if none exists
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      email: `user-${Date.now()}@fintrack.example`
    };
    
    // Store the new user
    localStorage.setItem('fintrack_current_user', JSON.stringify(newUser));
    return newUser;
  }
  
  // Fallback for server-side rendering
  return {
    id: "demo-user",
    name: "Demo User",
    email: "demo@example.com"
  };
};

export const auth = async () => {
  // Return a session with the current user
  return {
    user: getCurrentUser()
  };
};

export function signIn(userData?: { id?: string; name: string; email: string }) {
  if (typeof window !== 'undefined') {
    // Create a new user with provided data or generate random data
    const newUser = userData ? {
      ...userData,
      id: userData.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    } : {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      email: `user-${Date.now()}@fintrack.example`
    };
    
    // Store the user
    localStorage.setItem('fintrack_current_user', JSON.stringify(newUser));
  }
  
  return { success: true };
};

export const signOut = async () => {
  if (typeof window !== 'undefined') {
    // Clear the current user
    localStorage.removeItem('fintrack_current_user');
  }
  
  return { success: true };
};

export const getCurrentUserInfo = () => {
  return getCurrentUser();
};
