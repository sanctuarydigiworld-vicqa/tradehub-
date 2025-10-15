
'use client';

import { useUser } from '@/firebase';
import type { User } from 'firebase/auth';

// This hook is now a simple wrapper around the `useUser` hook from the main Firebase provider.
// It simplifies accessing user data without needing direct dependency on onAuthStateChanged in components.
export function useAuth(): { user: User | null, loading: boolean } {
  const { user, isUserLoading } = useUser();
  
  return { user, loading: isUserLoading };
}
