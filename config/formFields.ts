import { Upload, User } from 'lucide-react';
import { FormConfig } from './types';

export const authFormConfigs: Record<'login' | 'register', FormConfig> = {
  login: {
    title: 'Welcome Back',
    submitText: 'Login',
    loadingText: 'Logging in...',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        className: 'focus:ring-blue-500 focus:border-blue-500',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Your password',
        className: 'focus:ring-blue-500 focus:border-blue-500',
      },
    ],
  },
  register: {
    title: 'Create Account',
    submitText: 'Create Account',
    loadingText: 'Creating Account...',
    hasImageUpload: true,
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        className: 'focus:ring-blue-500 focus:border-blue-500',
        gridCols: 'grid-cols-2',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        className: 'focus:ring-blue-500 focus:border-blue-500',
        gridCols: 'grid-cols-2',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        className: 'focus:ring-blue-500 focus:border-blue-500',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
        className: 'focus:ring-blue-500 focus:border-blue-500',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
        className: 'focus:ring-blue-500 focus:border-blue-500',
      },
    ],
  },
};
