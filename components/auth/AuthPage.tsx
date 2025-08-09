'use client';

import React, { useState } from 'react';
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

const AuthPage: React.FC = () => {
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterSchema) => {
    setLoading(true);
    setAuthError('');

    try {
      console.log('Starting registration with values:', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        hasImage: !!selectedImage
      });
      
      await registerUser(values, selectedImage || undefined);
      console.log('Registration completed successfully');
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Task Manager
          </CardTitle>
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