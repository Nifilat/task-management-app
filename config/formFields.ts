import type { FormConfig } from '@/types/forms';

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
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Your password',
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
        gridCols: 'grid-cols-2',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Doe',
        gridCols: 'grid-cols-2',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm your password',
      },
    ],
  },
};
