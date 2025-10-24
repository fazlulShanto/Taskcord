import { useQuery } from '@tanstack/react-query';
import { APIs } from '../lib/api';
import { HttpClient } from '@/lib/httpClient';
import { z } from 'zod';

export interface AuthenticatedUser {
  id: string;
  discordId: string;
  fullName: string;
  nickName: string;
  avatar: string;
  email: string;
  lastAuth: string;
  isVerified: boolean;
  updatedAt: string;
  createdAt: string;
}

export const AuthSchema = z.object({
  user: z.object({
    id: z.string().uuid().min(1),
    discordId: z.string().min(1),
    fullName: z.string(),
    nickName: z.string(),
    avatar: z.string().min(1),
    email: z.string().email().optional(),
    lastAuth: z.string().datetime(),
    isVerified: z.boolean(),
    updatedAt: z.string().datetime(),
    createdAt: z.string().datetime().min(1),
  }),
});

export const useAuthQuery = () => {
  const { isError, data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      const res = await HttpClient.get(APIs.auth.me());
      return res.data as AuthenticatedUser;
    },
  });

  // if authData is not valid, redirect to login
  const authData = AuthSchema.safeParse(data);

  return {
    data: authData.data?.user || null,
    isLoading,
    isAuthenticated: !isError && !isLoading && authData.success,
  };
};
