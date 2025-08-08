'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import {
  LoginSchema,
  loginSchema,
  registerSchema,
  RegisterSchema,
} from '@/utils/validation/authSchema';
import { loginUser, registerUser, fileToBase64 } from '@/utils/auth';
import { authFormConfigs } from '@/config/formFields';
import type { FormConfig } from '@/config/types';

// Generic Form Component
interface AuthFormProps {
  config: FormConfig;
  form: any;
  onSubmit: (values: any) => void;
  loading: boolean;
  error: string;
  selectedImage?: File | null;
  imagePreview?: string;
  onImageSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  config,
  form,
  onSubmit,
  loading,
  error,
  selectedImage,
  imagePreview,
  onImageSelect,
}) => {
  const renderField = (field: any, index: number) => {
    const isGridField =
      field.gridCols &&
      index < config.fields.length - 1 &&
      config.fields[index + 1]?.gridCols === field.gridCols;

    if (isGridField && index % 2 === 0) {
      // Render two fields in a grid
      const nextField = config.fields[index + 1];
      return (
        <div key={`grid-${index}`} className="grid grid-cols-2 gap-4">
          {[field, nextField].map(gridField => (
            <FormField
              key={gridField.name}
              control={form.control}
              name={gridField.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{gridField.label}</FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      type={gridField.type}
                      placeholder={gridField.placeholder}
                      className={gridField.className}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      );
    }

    // Skip the second field in grid as it's already rendered
    if (field.gridCols && index > 0 && config.fields[index - 1]?.gridCols === field.gridCols) {
      return null;
    }

    // Render single field
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Input
                {...formField}
                type={field.type}
                placeholder={field.placeholder}
                className={field.className}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload for Registration */}
          {config.hasImageUpload && onImageSelect && (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="Profile preview" />
                  ) : (
                    <AvatarFallback className="bg-gray-200">
                      <User className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-3 w-3 text-white" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={onImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">Click to upload profile photo (optional)</p>
            </div>
          )}

          {/* Dynamic Fields */}
          {config.fields.map((field, index) => renderField(field, index))}

          {/* Error Display */}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? config.loadingText : config.submitText}
          </Button>
        </form>
      </Form>
    </div>
  );
};

// Main Auth Page Component
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
      }
    }
  };

  const onLogin = async (values: LoginSchema) => {
    setLoading(true);
    setAuthError('');

    try {
      await loginUser(values);
    } catch (error: any) {
      setAuthError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterSchema) => {
    setLoading(true);
    setAuthError('');

    try {
      await registerUser(values, selectedImage || undefined);
    } catch (error: any) {
      setAuthError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
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
