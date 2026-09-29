'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, PressProfile, UserRole } from '@/types/auth';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

const DEFAULT_PRESS_PROFILE: PressProfile = {
  pressName: 'আল-মদিনা অফসেট প্রেস & প্যাকেজিং',
  ownerName: 'মোহাম্মদ রফিক হোসেন',
  phone: '+880 1711-234567',
  email: 'rafiq@almadinapress.com',
  address: '৬৭/১ আরামবাগ প্রেস মার্কেট, মতিঝিল, ঢাকা-১০০০',
  tagline: 'বাণিজ্যিক ও মানসম্মত কালার প্রিন্টিং সেবা',
  tradeLicenseNo: 'TRAD/DSCC/024819/2024',
  currency: 'BDT',
  currencySymbol: '৳',
  defaultPlateCost: 250,
  defaultImpressionRate: 120,
  defaultAdvancePercent: 30,
  equipment: [
    'Heidelberg Speedmaster 74 (4-Color Offset)',
    'Polar 115 High-Speed Paper Cutting Machine',
    'Thermal CTP Plate Setter (Kodak Trendsetter)',
    'Automatic Film Lamination & UV Machine',
    'Die-Punching & Carton Creasing Machine',
  ],
  preferredPaperSizes: ['20" x 30"', '23" x 36"', '25" x 37"'],
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
};

const DEMO_USERS: Record<UserRole, AuthUser> = {
  owner: {
    id: 'usr_demo_owner',
    name: 'রফিক হোসেন (মালিক)',
    email: 'owner@almadinapress.com',
    phone: '+880 1711-234567',
    role: 'owner',
    pressProfile: DEFAULT_PRESS_PROFILE,
  },
  manager: {
    id: 'usr_demo_manager',
    name: 'তানভীর আহমেদ (প্রেস ম্যানেজার)',
    email: 'manager@almadinapress.com',
    phone: '+880 1819-876543',
    role: 'manager',
    pressProfile: DEFAULT_PRESS_PROFILE,
  },
  operator: {
    id: 'usr_demo_operator',
    name: 'কালাম মিয়া (মেশিন অপারেটর)',
    email: 'operator@almadinapress.com',
    phone: '+880 1912-345678',
    role: 'operator',
    pressProfile: DEFAULT_PRESS_PROFILE,
  },
  accountant: {
    id: 'usr_demo_accountant',
    name: 'আরিফুল হক (হিসাবরক্ষক)',
    email: 'accounts@almadinapress.com',
    phone: '+880 1610-987654',
    role: 'accountant',
    pressProfile: DEFAULT_PRESS_PROFILE,
  },
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAppwriteConnected: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    pass: string,
    pressName: string,
    phone: string
  ) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (role?: UserRole, forceOnboarding?: boolean) => void;
  logout: () => Promise<void>;
  updatePressProfile: (profile: Partial<PressProfile>) => Promise<void>;
  completeOnboarding: (profile: PressProfile) => Promise<void>;
  resetOnboarding: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'print_os_auth_user';

type AppwritePreferences = {
  pressProfile?: PressProfile;
  pressName?: string;
  phone?: string;
  role?: UserRole;
  onboardingCompleted?: boolean;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error) return fallback;
  const msg =
    (error as { message?: string })?.message ||
    (error instanceof Error ? error.message : '') ||
    '';
  const type = (error as { type?: string })?.type || '';
  const code = (error as { code?: number })?.code || 0;

  // Appwrite specific error types
  if (type === 'user_invalid_credentials' || code === 401)
    return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।';
  if (type === 'user_not_found')
    return 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। নতুন অ্যাকাউন্ট তৈরি করুন।';
  if (type === 'user_already_exists' || code === 409)
    return 'এই ইমেইলে ইতোমধ্যে একটি অ্যাকাউন্ট আছে। লগইন করুন।';
  if (type === 'user_password_mismatch')
    return 'পাসওয়ার্ড মিলছে না। আবার চেক করুন।';
  if (type === 'user_email_not_whitelisted')
    return 'এই ইমেইল ঠিকানাটি অনুমোদিত নয়।';
  if (type === 'user_blocked')
    return 'এই অ্যাকাউন্টটি সাময়িকভাবে ব্লক করা হয়েছে। সাপোর্টে যোগাযোগ করুন।';
  if (type === 'rate_limit_exceeded' || code === 429)
    return 'অনেক বেশি প্রচেষ্টা হয়েছে। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।';
  if (type === 'general_unauthorized' || msg.includes('missing scope'))
    return 'সংযোগ সমস্যা হয়েছে। পেজ রিফ্রেশ করুন এবং আবার চেষ্টা করুন।';
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch'))
    return 'ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।';
  if (msg.includes('Invalid `password`') || msg.includes('password'))
    return 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।';
  if (msg.includes('Invalid document structure'))
    return 'ডেটা সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।';

  return fallback;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAppwriteConnected, setIsAppwriteConnected] = useState<boolean>(false);

  // Initialize session from Appwrite or LocalStorage
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      setIsLoading(true);

      // 1. Try checking Appwrite Cloud session
      try {
        const appwriteUser = await account.get();
        if (isMounted && appwriteUser) {
          setIsAppwriteConnected(true);
          const prefs = (appwriteUser.prefs as AppwritePreferences) || {};
          const pressProfile: PressProfile = prefs.pressProfile || {
            ...DEFAULT_PRESS_PROFILE,
            pressName: prefs.pressName || `${appwriteUser.name}'s Press`,
            ownerName: appwriteUser.name,
            email: appwriteUser.email,
            onboardingCompleted: !!prefs.onboardingCompleted,
          };

          const loadedUser: AuthUser = {
            id: appwriteUser.$id,
            name: appwriteUser.name,
            email: appwriteUser.email,
            phone: appwriteUser.phone || prefs.phone || '',
            role: (prefs.role as UserRole) || 'owner',
            pressProfile,
          };

          setUser(loadedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedUser));
          setIsLoading(false);
          return;
        }
      } catch {
        // Not logged in to Appwrite or offline
        // Fallback to local session if available
      }

      // 2. Check LocalStorage fallback
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as AuthUser;
          if (parsed && parsed.id) {
            if (isMounted) setUser(parsed);
          }
        }
      } catch (storageErr) {
        console.error('Error loading local session:', storageErr);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to storage
  const persistUser = useCallback((updated: AuthUser | null) => {
    setUser(updated);
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Regular Email/Password Login
  const login = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        try {
          await account.createEmailPasswordSession(email, pass);
        } catch (sessionErr: unknown) {
          const errMsg = sessionErr instanceof Error ? sessionErr.message : '';
          if (errMsg.toLowerCase().includes('already active')) {
            await account.deleteSession('current').catch(() => {});
            await account.createEmailPasswordSession(email, pass);
          } else {
            throw sessionErr;
          }
        }
        const appwriteUser = await account.get();
        setIsAppwriteConnected(true);

        const prefs = (appwriteUser.prefs as AppwritePreferences) || {};
          const pressProfile: PressProfile = prefs.pressProfile || {
            ...DEFAULT_PRESS_PROFILE,
            pressName: prefs.pressName || `${appwriteUser.name}'s Press`,
            ownerName: appwriteUser.name,
            email: appwriteUser.email,
            onboardingCompleted: !!prefs.onboardingCompleted,
          };

          const loggedUser: AuthUser = {
            id: appwriteUser.$id,
            name: appwriteUser.name,
            email: appwriteUser.email,
            phone: appwriteUser.phone || prefs.phone || '',
            role: (prefs.role as UserRole) || 'owner',
            pressProfile,
          };

        persistUser(loggedUser);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        setIsLoading(false);
        return {
          success: false,
          error: getErrorMessage(err, 'লগইন প্রক্রিয়ায় সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'),
        };
      }
    },
    [persistUser]
  );

  // New User Registration
  const register = useCallback(
    async (
      name: string,
      email: string,
      pass: string,
      pressName: string,
      phone: string
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      const newProfile: PressProfile = {
        ...DEFAULT_PRESS_PROFILE,
        pressName: pressName.trim() || `${name}'s Press`,
        ownerName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        onboardingCompleted: false, // Must trigger onboarding wizard!
        createdAt: new Date().toISOString(),
      };

      try {
        await account.deleteSession('current').catch(() => {});
        const userId = ID.unique();
        await account.create(userId, email, pass, name);
        await account.createEmailPasswordSession(email, pass);
        await account.updatePrefs({
          pressName,
          phone,
          role: 'owner',
          onboardingCompleted: false,
          pressProfile: newProfile,
        });

          const registeredUser: AuthUser = {
            id: userId,
            name,
            email,
            phone,
            role: 'owner',
            pressProfile: newProfile,
          };

        persistUser(registeredUser);
        setIsAppwriteConnected(true);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        setIsLoading(false);
        return {
          success: false,
          error: getErrorMessage(err, 'রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।'),
        };
      }
    },
    [persistUser]
  );

  // Demo 1-Click Login
  const demoLogin = useCallback(
    (role: UserRole = 'owner', forceOnboarding: boolean = false) => {
      const baseUser = DEMO_USERS[role] || DEMO_USERS.owner;
      const userToSet: AuthUser = {
        ...baseUser,
        pressProfile: {
          ...baseUser.pressProfile!,
          onboardingCompleted: !forceOnboarding,
        },
      };
      persistUser(userToSet);
    },
    [persistUser]
  );

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await account.deleteSession('current');
    } catch (err) {
      // Ignore if no active cloud session
    } finally {
      persistUser(null);
      setIsLoading(false);
    }
  }, [persistUser]);

  // Update Press Profile
  const updatePressProfile = useCallback(
    async (profileUpdate: Partial<PressProfile>) => {
      if (!user) return;
      const currentProfile = user.pressProfile || DEFAULT_PRESS_PROFILE;
      const mergedProfile: PressProfile = {
        ...currentProfile,
        ...profileUpdate,
      };

      const updatedUser: AuthUser = {
        ...user,
        pressProfile: mergedProfile,
      };

      persistUser(updatedUser);

      try {
        await account.updatePrefs({
          pressProfile: mergedProfile,
          pressName: mergedProfile.pressName,
        });
      } catch (err) {
        // Local state is already updated
      }
    },
    [user, persistUser]
  );

  // Complete Onboarding Wizard
  const completeOnboarding = useCallback(
    async (completedProfile: PressProfile) => {
      if (!user) return;
      const finalProfile: PressProfile = {
        ...completedProfile,
        onboardingCompleted: true,
      };

      const updatedUser: AuthUser = {
        ...user,
        name: finalProfile.ownerName || user.name,
        pressProfile: finalProfile,
      };

      persistUser(updatedUser);

      try {
        await account.updatePrefs({
          onboardingCompleted: true,
          pressProfile: finalProfile,
          pressName: finalProfile.pressName,
        });
      } catch (err) {
        // Saved locally
      }
    },
    [user, persistUser]
  );

  // Reset Onboarding (allows running wizard again)
  const resetOnboarding = useCallback(() => {
    if (!user || !user.pressProfile) return;
    const updatedUser: AuthUser = {
      ...user,
      pressProfile: {
        ...user.pressProfile,
        onboardingCompleted: false,
      },
    };
    persistUser(updatedUser);
  }, [user, persistUser]);

  // Switch role for test & permissions preview
  const switchRole = useCallback(
    (newRole: UserRole) => {
      if (!user) return;
      const updatedUser: AuthUser = {
        ...user,
        role: newRole,
      };
      persistUser(updatedUser);
    },
    [user, persistUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAppwriteConnected,
        login,
        register,
        demoLogin,
        logout,
        updatePressProfile,
        completeOnboarding,
        resetOnboarding,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
