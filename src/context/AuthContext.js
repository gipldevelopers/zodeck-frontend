// src\context\AuthContext.js
"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth-services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

 useEffect(() => {
    // Check if user is logged in on app load
    // const checkAuth = async () => {
    //   try {
    //     const savedToken = localStorage.getItem('token');
    //     const savedUser = localStorage.getItem('hrms_user');
    //     const savedCompanyId = localStorage.getItem('company_id');

    //     if (savedToken && savedUser && savedCompanyId) {
    //       setToken(savedToken);
    //       setUser(JSON.parse(savedUser));
          
    //       // Verify token is still valid by fetching current user
    //       const response = await authService.getCurrentUser();
    //       if (response.success) {
    //         // Update user data with fresh data from server
    //         setUser(response.data);
    //         localStorage.setItem('hrms_user', JSON.stringify(response.data));
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Auth check failed:', error);
        
    //     // Don't logout here - just clear invalid data
    //     // localStorage.removeItem('token');
    //     // localStorage.removeItem('hrms_user');
    //     // setUser(null);
    //     // setToken(null);

    //      // Clear all auth data
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('hrms_user');
    //     localStorage.removeItem('company_id');
    //     localStorage.removeItem('company_subdomain');
    //     setUser(null);
    //     setToken(null);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('hrms_user');
        const savedCompanyId = localStorage.getItem('company_id');

        if (savedToken && savedUser && savedCompanyId) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid by fetching current user
          const response = await authService.getCurrentUser();
          if (response.success) {
            const userData = response.data;
            
            // Fetch permissions separately
            try {
              const permissionsResponse = await authService.getUserPermissions();
              if (permissionsResponse.success) {
                userData.permissions = permissionsResponse.data;
              }
            } catch (permError) {
              console.warn('Could not fetch permissions:', permError);
              userData.permissions = {};
            }
            
            // Update user data with fresh data from server
            setUser(userData);
            localStorage.setItem('hrms_user', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('hrms_user');
        localStorage.removeItem('company_id');
        localStorage.removeItem('company_subdomain');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        const { user: userData, token: userToken
          // , requiresPasswordChange 
        } = response.data;

         // Use systemRole instead of role (FIX for backend)
        const userRole = userData.systemRole;
        // Store auth data
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('hrms_user', JSON.stringify(userData));

      // Set role in cookie for middleware
      // const userRole = userData.systemRole || userData.role;
      // document.cookie = `userRole=${userData.role}; path=/; max-age=86400; secure; samesite=lax`;
       document.cookie = `userRole=${userRole}; path=/; max-age=86400; secure; samesite=lax`;

         // Check if password change is required FIRST
      // if (requiresPasswordChange) {
      //   return {
      //     success: true,
      //     data: userData,
      //     redirect: '/change-password?firstLogin=true'
      //   };
      // }

        // Redirect based on systemRole
        let redirectPath = '/employee/dashboard';
        if (userRole === 'HR_ADMIN') {
          redirectPath = '/hr/dashboard';
        } else if (userRole === 'SUPER_ADMIN') {
          redirectPath = '/super-admin/dashboard';
        }
          console.log('Redirecting to:', redirectPath, 'for role:', userRole);
        
        return {
          success: true,
          data: userData,
          redirect: redirectPath
        };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

   const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('hrms_user');
      localStorage.removeItem('company_id');
      localStorage.removeItem('company_subdomain');

       // Clear role cookie
      // document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        // Clear role cookie
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  };

  const changePassword = async (passwords) => {
    try {
      const response = await authService.changePassword(passwords);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('hrms_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    changePassword,
    refreshUser,
    isAuthenticated: !!user && !!token,
    isHR: user?.systemRole === 'HR_ADMIN', // Use systemRole
    isSuperAdmin: user?.systemRole === 'SUPER_ADMIN', // Use systemRole
    isEmployee: user?.systemRole === 'EMPLOYEE' // Use systemRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};