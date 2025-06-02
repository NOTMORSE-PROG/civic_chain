import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActor } from '../utils/icp';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing AuthContext...');
        await getActor(); // Ensure actor is ready
        await checkAuth(); // Check session
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize authentication');
        localStorage.removeItem('civicchain_user');
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('civicchain_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
          console.log('Session restored:', parsedUser);
        } else {
          throw new Error('Invalid stored user format');
        }
      } else {
        console.log('No user in storage.');
      }
    } catch (err) {
      console.error('Session check error:', err);
      setError('Failed to restore session');
      localStorage.removeItem('civicchain_user');
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name,
    email,
    password,
    role,
    departments = [],
    barangays = [],
    phoneNumber = '',
    idNumber = ''
  ) => {
    try {
      console.log('Registering user...', { name, email, role, phoneNumber, idNumber });
      setError(null);
      const actor = await getActor();
      
      // Format role for backend
      const formattedRole = { [role]: null };

      // Ensure idNumber is null for citizens
      const finalIdNumber = role === "Citizen" ? null : idNumber;
      
      const result = await actor.registerUser(
        name,
        email,
        password,
        formattedRole,
        departments.length > 0 ? departments[0] : null,
        barangays.length > 0 ? barangays[0] : null,
        phoneNumber,
        finalIdNumber
      );
      
      if ('Ok' in result) {
        const userId = result.Ok;
        console.log('User registered successfully:', userId);
        // Registration successful, but do not log the user in automatically
        // The user should log in separately after registration
        return { success: true, userId: userId };
      } else if ('Err' in result) {
        console.error('Registration failed:', result.Err);
        return { success: false, error: result.Err || 'Registration failed' };
      } else {
         console.error('Registration failed: Unexpected response', result);
         return { success: false, error: 'Registration failed: Unexpected response from server' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to register user' };
    }
  };  

  const login = async (identifier, password, role) => {
    try {
      setError(null);
      const actor = await getActor();
      const formattedRole = { [role]: null };
      const result = await actor.login(identifier, password, formattedRole);

      if ('Ok' in result) {
        const userData = result.Ok;
        setUser(userData);
        localStorage.setItem('civicchain_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        const errorMsg = result.Err || 'Invalid credentials';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Login failed. Try again.' };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const actor = await getActor();
      await actor.logoutUser();
      setUser(null);
      localStorage.removeItem('civicchain_user');
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: 'Logout failed. Try again.' };
    }
  };

  const value = {
    user,
    loading,
    error,
    isInitialized,
    register,
    login,
    logout,
  };

  if (!isInitialized) {
    return null; // Prevent rendering children until initialized
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
