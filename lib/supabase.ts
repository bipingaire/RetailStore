/**
 * Supabase client placeholder
 * This file is deprecated - use backend API via apiClient instead
 */

export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: () => Promise.resolve({ data: null, error: new Error('Supabase deprecated') }),
    signOut: () => Promise.resolve({ error: null }),
  },
};
