// hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/libs/dashboard';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  });
};