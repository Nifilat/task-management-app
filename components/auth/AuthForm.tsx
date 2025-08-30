'use client';

import React, { memo, useMemo } from 'react';
import type { Control } from 'react-hook-form';
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

const FormFieldComponent = memo(
  ({
    field,
    formControl,
  }: {
    field: AuthFormProps['config']['fields'][number];
    formControl: Control<Record<string, unknown>>;
  }) => (
    <FormField
      control={formControl}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="pl-1">{field.label}</FormLabel>
          <FormControl>
            <Input
              {...formField}
              type={field.type}
              placeholder={field.placeholder}
              className="h-11 px-4 py-3"
              value={formField.value as string}
              autoComplete={
                field.type === 'email'
                  ? 'email'
                  : field.type === 'password'
                    ? 'current-password'
                    : 'off'
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
);

FormFieldComponent.displayName = 'FormFieldComponent';

const GridFieldComponent = memo(
  ({
    field,
    nextField,
    formControl,
  }: {
    field: AuthFormProps['config']['fields'][number];
    nextField: AuthFormProps['config']['fields'][number];
    formControl: Control<Record<string, unknown>>;
  }) => (
    <div className="grid grid-cols-2 gap-4">
      <FormFieldComponent field={field} formControl={formControl} />
      <FormFieldComponent field={nextField} formControl={formControl} />
    </div>
  )
);

GridFieldComponent.displayName = 'GridFieldComponent';

const ImageUpload = memo(
  ({
    imagePreview,
    onImageSelect,
  }: {
    imagePreview?: string;
    onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <Avatar className="h-20 w-20">
          {imagePreview ? (
            <AvatarImage src={imagePreview} alt="Profile preview" loading="eager" decoding="sync" />
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
        Click to upload profile photo (optional). Not more than 1MB.
      </p>
    </div>
  )
);

ImageUpload.displayName = 'ImageUpload';

const AuthForm: React.FC<AuthFormProps> = memo(
  ({ config, form, onSubmit, loading, error, imagePreview, onImageSelect }) => {
    const renderedFields = useMemo(() => {
      const fields = [];
      let i = 0;

      while (i < config.fields.length) {
        const field = config.fields[i];
        const nextField = config.fields[i + 1];

        const isGridField = field.gridCols && nextField?.gridCols === field.gridCols;

        if (isGridField) {
          fields.push(
            <GridFieldComponent
              key={`grid-${i}`}
              field={field}
              nextField={nextField}
              formControl={form.control}
            />
          );
          i += 2;
        } else {
          fields.push(
            <FormFieldComponent key={field.name} field={field} formControl={form.control} />
          );
          i += 1;
        }
      }

      return fields;
    }, [config.fields, form.control]);

    return (
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload for Registration */}
            {config.hasImageUpload && onImageSelect && (
              <ImageUpload imagePreview={imagePreview} onImageSelect={onImageSelect} />
            )}

            {/* Render memoized fields */}
            {renderedFields}

            {error && (
              <div className="text-destructive text-sm text-center" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? config.loadingText : config.submitText}
            </Button>
          </form>
        </Form>
      </div>
    );
  }
);

AuthForm.displayName = 'AuthForm';

export default AuthForm;
