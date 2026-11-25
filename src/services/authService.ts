import type { AuthUser } from '../types';
import { MOCK_AUTH } from '../data/mockData';

const STORAGE_KEY = 'aifit_user';

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: 'invalid_credentials' | 'account_locked' | 'network_error';
}

export interface RegisterResult {
  success: boolean;
  error?: 'email_exists' | 'network_error';
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));

    const mockAuthRecord = MOCK_AUTH as Record<string, { password: string; user: AuthUser } | undefined>;
    const entry = mockAuthRecord[email.toLowerCase()];
    if (!entry) {
      return { success: false, error: 'invalid_credentials' };
    }
    if (entry.password !== password) {
      return { success: false, error: 'invalid_credentials' };
    }

    // Check if locked
    const { MOCK_USERS } = await import('../data/mockData');
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user?.status === 'Locked') {
      return { success: false, error: 'account_locked' };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
    return { success: true, user: entry.user };
  },

  async register(fullName: string, email: string, _password: string): Promise<RegisterResult> {
    await new Promise(r => setTimeout(r, 600));

    const { MOCK_USERS } = await import('../data/mockData');
    const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    const mockAuthRecord = MOCK_AUTH as Record<string, { password: string; user: AuthUser } | undefined>;
    if (exists || mockAuthRecord[email.toLowerCase()]) {
      return { success: false, error: 'email_exists' };
    }

    // In mock mode, just succeed (new user won't be persisted across reloads, but that's fine for mock)
    const newUser: AuthUser = { id: Date.now(), fullName, email, role: 'Trainee' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  updateUser(updates: Partial<AuthUser>): void {
    const current = authService.getUser();
    if (current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...updates }));
    }
  },
};
