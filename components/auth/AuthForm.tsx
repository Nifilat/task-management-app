'use client';

import React from 'react';
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
import type { AuthFormProps } from '@/types/forms';

const AuthForm: React.FC<AuthFormProps> = ({
  config,
  form,
  onSubmit,
  loading,
  error,
  imagePreview,
  onImageSelect,
}) => {
  const renderField = (field: AuthFormProps['config']['fields'][number], index: number) => {
    const isGridField =
      field.gridCols &&
      index < config.fields.length - 1 &&
      config.fields[index + 1]?.gridCols === field.gridCols;

    if (isGridField && index % 2 === 0) {
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

    if (field.gridCols && index > 0 && config.fields[index - 1]?.gridCols === field.gridCols) {
      return null;
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Input {...formField} type={field.type} placeholder={field.placeholder} />
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
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-3 w-3 text-primary-foreground" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={onImageSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Click to upload profile photo (optional)
              </p>
            </div>
          )}

          {/* Dynamic Fields */}
          {config.fields.map((field, index) => renderField(field, index))}

          {/* Error Display */}
          {error && <div className="text-destructive text-sm text-center">{error}</div>}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? config.loadingText : config.submitText}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
