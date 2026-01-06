import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'member';

interface UseUserRoleReturn {
  role: AppRole | null;
  isAdmin: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('member'); // Default to member if error
      } else {
        setRole(data?.role as AppRole || 'member');
      }
    } catch (err) {
      console.error('Error fetching role:', err);
      setRole('member');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [user?.id]);

  return {
    role,
    isAdmin: role === 'admin',
    loading,
    refetch: fetchRole,
  };
};
