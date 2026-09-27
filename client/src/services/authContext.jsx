import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from './firebase';

const AuthContext = createContext(null);

const STORAGE_KEY = 'kodaverse_auth_user';

export const DEMO_ACCOUNTS = [
  {
    id: 'usr-parent-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'parent',
    timezone: 'America/New_York',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    title: 'Parent (US Eastern • New York)',
    phone: '+1 (555) 234-8901',
    childName: 'Leo Jenkins',
    childAge: 9,
    grade: 'Grade 4',
    badge: 'Parent Portal'
  },
  {
    id: 'usr-mentor-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@codeyoung.com',
    role: 'mentor',
    timezone: 'Asia/Kolkata',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    title: 'Lead Mentor (India • Asia/Kolkata)',
    specialties: ['Python', 'Scratch', 'AI & Game Logic'],
    rating: 4.95,
    badge: 'Mentor Portal (IST)'
  },
  {
    id: 'usr-student-1',
    name: 'Young Innovator',
    email: 'innovator@codeyoung.com',
    role: 'student',
    timezone: 'America/New_York',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    title: 'Student Innovator (Grade 4)',
    badge: 'Student Portal',
    points: 350,
    level: 2
  },
  {
    id: 'usr-mentor-2',
    name: 'Priya Nair',
    email: 'priya.nair@codeyoung.com',
    role: 'mentor',
    timezone: 'Asia/Kolkata',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    title: 'Senior STEM Educator (IST)',
    specialties: ['Web Development', 'Scratch', 'Python'],
    rating: 4.92,
    badge: 'Mentor Portal (IST)'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Default initial user: null so visitors see Sign In button
    return null;
  });

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' | 'signup' | 'demo'
  const [authToast, setAuthToast] = useState(null);

  // Synchronize Firebase Auth listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Map Firebase user to app user profile if signed in directly via Firebase
        const mappedUser = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email,
          role: 'parent',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'User')}`,
          title: 'Verified Firebase Account',
          badge: 'Firebase Auth',
          isFirebase: true
        };
        setUser(mappedUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }, [user]);

  const showToast = (msg) => {
    setAuthToast(msg);
    setTimeout(() => setAuthToast(null), 3500);
  };

  const login = async ({ email, password, role }) => {
    // 1. Try Firebase Auth first if credentials provided
    if (email && password && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        const profile = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email,
          role: role || 'parent',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
          title: `${(role || 'Parent').toUpperCase()} Portal (Firebase)`,
          badge: 'Firebase Verified',
          isFirebase: true
        };
        setUser(profile);
        showToast(`Firebase Sign-In Success: ${profile.name}`);
        closeAuthModal();
        return profile;
      } catch (fbErr) {
        // If not in Firebase (e.g. demo account or offline), seamlessly fall back to local/backend auth
        console.log('Firebase auth fallback to local/demo handler:', fbErr.message);
      }
    }

    // 2. Backend / Demo Auth Fallback
    try {
      const result = await api.login({ email, password, role });
      if (result && result.user) {
        setUser(result.user);
        showToast(`Signed in as ${result.user.name} (${result.user.role.toUpperCase()})`);
        closeAuthModal();
        return result.user;
      }
    } catch (err) {
      // Local fallback
      let matched = DEMO_ACCOUNTS.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) ||
                    DEMO_ACCOUNTS.find(u => u.role === role) ||
                    {
                      id: `usr-${Date.now()}`,
                      name: email ? email.split('@')[0] : 'User',
                      email: email || 'user@example.com',
                      role: role || 'parent',
                      timezone: 'America/New_York',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                      title: `${role || 'Parent'} Portal`,
                      badge: `${role || 'Parent'} Portal`
                    };
      setUser(matched);
      showToast(`Signed in as ${matched.name} (${matched.role.toUpperCase()})`);
      closeAuthModal();
      return matched;
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth not available');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const profile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google User',
        email: fbUser.email,
        role: 'parent',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'User')}`,
        title: 'Google Verified Parent',
        badge: 'Google Auth',
        isFirebase: true
      };
      setUser(profile);
      showToast(`Signed in with Google as ${profile.name}`);
      closeAuthModal();
      return profile;
    } catch (err) {
      showToast(`Google Sign-In Notice: ${err.message}`);
      throw err;
    }
  };

  const register = async (userData) => {
    // 1. Try Firebase registration
    if (userData.email && userData.password && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        if (userData.name) {
          await updateProfile(userCredential.user, { displayName: userData.name });
        }
        const profile = {
          id: userCredential.user.uid,
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          role: userData.role || 'parent',
          timezone: userData.timezone || 'America/New_York',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
          title: `${(userData.role || 'parent').toUpperCase()} Portal (Firebase)`,
          badge: 'Firebase Account',
          childName: userData.childName,
          childAge: userData.childAge,
          isFirebase: true
        };
        setUser(profile);
        showToast(`Firebase Account created! Welcome, ${profile.name}`);
        closeAuthModal();
        return profile;
      } catch (fbErr) {
        console.log('Firebase register fallback:', fbErr.message);
      }
    }

    // 2. Backend API fallback
    try {
      const res = await api.register(userData);
      if (res && res.user) {
        setUser(res.user);
        showToast(`Account created! Welcome, ${res.user.name}`);
        closeAuthModal();
        return res.user;
      }
    } catch (err) {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'parent',
        timezone: userData.timezone || 'America/New_York',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
        title: `${userData.role === 'mentor' ? 'Certified Mentor' : userData.role === 'student' ? 'Student Innovator' : 'Parent'}`,
        badge: `${userData.role || 'Parent'} Portal`,
        childName: userData.childName,
        childAge: userData.childAge
      };
      setUser(newUser);
      showToast(`Account created! Welcome, ${newUser.name}`);
      closeAuthModal();
      return newUser;
    }
  };

  const switchUser = (selectedUser) => {
    setUser(selectedUser);
    showToast(`Switched account to ${selectedUser.name} (${selectedUser.title})`);
  };

  const switchRole = (role) => {
    const target = DEMO_ACCOUNTS.find(u => u.role === role) || DEMO_ACCOUNTS[0];
    setUser(target);
    showToast(`Switched to ${role.toUpperCase()} mode: ${target.name}`);
  };

  const logout = async () => {
    try {
      if (auth && auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (e) {}
    setUser(null);
    showToast('Signed out of Codeyoung portal.');
  };

  const openAuthModal = (tab = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userRole: user?.role || 'parent',
        login,
        loginWithGoogle,
        register,
        switchUser,
        switchRole,
        logout,
        demoAccounts: DEMO_ACCOUNTS,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        authToast,
        firebaseUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
