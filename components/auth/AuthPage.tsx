'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LoginSchema,
  loginSchema,
  registerSchema,
  RegisterSchema,
} from '@/utils/validation/authSchema';
import { loginUser, registerUser, fileToBase64 } from '@/utils/auth';
import { authFormConfigs } from '@/config/formFields';
import AuthForm from './AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { MAX_IMAGE_SIZE } from '@/constants/shared';

const AuthPage: React.FC = () => {
  const { user, refreshUser, error: authError, clearAuthError } = useAuth();
  const router = useRouter();
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const displayError = authError || localError;

  useEffect(() => {
    if (user) {
      router.replace('/tasks');
    }
  }, [user, router]);

  useEffect(() => {
    return () => {
      clearAuthError();
      setLocalError('');
    };
  }, [clearAuthError]);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setLocalError('Profile photo must not be more than 1MB.');
        setSelectedImage(null);
        setImagePreview('');
        return;
      }

      setLocalError('');
      clearAuthError();

      setSelectedImage(file);
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        setLocalError('Failed to process image. Please try again.');
      }
    }
  };

  const onLogin = async (values: LoginSchema) => {
    setLoading(true);
    setLocalError('');
    clearAuthError();

    try {
      await loginUser(values);
      await refreshUser();
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setLocalError(error.message || 'Login failed. Please check your credentials.');
      } else {
        setLocalError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterSchema) => {
    setLoading(true);
    setLocalError('');
    clearAuthError();

    try {
      await registerUser(values, selectedImage || undefined);
      await refreshUser();
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        setLocalError(error.message || 'Registration failed. Please try again.');
      } else {
        setLocalError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = () => {
    setLocalError('');
    clearAuthError();
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="lcp-optimized text-xl sm:text-2xl font-bold text-center">
            Task Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <AuthForm
                config={authFormConfigs.login}
                form={loginForm}
                onSubmit={onLogin}
                loading={loading}
                error={displayError}
              />
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <AuthForm
                config={authFormConfigs.register}
                form={registerForm}
                onSubmit={onRegister}
                loading={loading}
                error={displayError}
                selectedImage={selectedImage}
                imagePreview={imagePreview}
                onImageSelect={handleImageSelect}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
