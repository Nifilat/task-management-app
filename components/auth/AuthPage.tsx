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
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (user) {
      router.replace('/tasks');
    }
  }, [user, router]);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
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
  });

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setAuthError('Profile photo must not be more than 1MB.');
        setSelectedImage(null);
        setImagePreview('');
        return;
      }

      setAuthError('');

      setSelectedImage(file);
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        setAuthError('Failed to process image. Please try again.');
      }
    }
  };

  const onLogin = async (values: LoginSchema) => {
    setLoading(true);
    setAuthError('');

    try {
      await loginUser(values);

      await refreshUser();
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setAuthError(error.message || 'Login failed. Please check your credentials.');
      } else {
        setAuthError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterSchema) => {
    setLoading(true);
    setAuthError('');

    try {
      await registerUser(values, selectedImage || undefined);
      await refreshUser();
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        setAuthError(error.message || 'Registration failed. Please try again.');
      } else {
        setAuthError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
          <CardTitle className="text-2xl font-bold text-center">Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
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
                error={authError}
              />
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <AuthForm
                config={authFormConfigs.register}
                form={registerForm}
                onSubmit={onRegister}
                loading={loading}
                error={authError}
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
