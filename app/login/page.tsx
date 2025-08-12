import { Metadata } from 'next';
import AuthPage from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your task manager account',
};

export default function LoginPage() {
  return <AuthPage />;
}
