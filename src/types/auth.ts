export type UserRole = 'owner' | 'manager' | 'operator' | 'accountant';

export interface PressProfile {
  pressName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  tagline?: string;
  tradeLicenseNo?: string;
  currency: string;
  currencySymbol: string;
  defaultPlateCost: number;
  defaultImpressionRate: number;
  defaultAdvancePercent: number;
  equipment: string[];
  preferredPaperSizes: string[];
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  pressProfile?: PressProfile;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnline: boolean;
  error: string | null;
}
