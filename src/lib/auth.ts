// Auth utilities for cookie-based JWT management

const TOKEN_KEY = 'ubelong_token';
const REFRESH_TOKEN_KEY = 'ubelong_refresh_token';
const USER_KEY = 'ubelong_user';

export interface StoredUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'caregiver' | 'doctor' | 'admin';
  avatar_url: string | null;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Store tokens securely
export function setTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser) return;

  // Store in localStorage for now (httpOnly cookies require server-side handling)
  // In production, these should be httpOnly cookies set by the server
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  if (!isBrowser) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Store user data
export function setUser(user: StoredUser): void {
  if (!isBrowser) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (!isBrowser) return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Check if user has doctor role
export function isDoctor(): boolean {
  const user = getUser();
  return user?.role === 'doctor' || user?.role === 'admin';
}

// Get full name
export function getFullName(user: StoredUser | null): string {
  if (!user) return '';
  return `${user.first_name} ${user.last_name}`.trim() || user.email;
}

// Get initials for avatar
export function getInitials(user: StoredUser | null): string {
  if (!user) return '?';
  const first = user.first_name?.[0] || '';
  const last = user.last_name?.[0] || '';
  return (first + last).toUpperCase() || user.email[0].toUpperCase();
}
