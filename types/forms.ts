export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  gridCols?: string;
}

export interface FormConfig {
  title: string;
  submitText: string;
  loadingText: string;
  fields: FormFieldConfig[];
  hasImageUpload?: boolean;
}

export interface AuthFormProps {
  config: FormConfig;
  form: any;
  onSubmit: (values: any) => void;
  loading: boolean;
  error: string;
  selectedImage?: File | null;
  imagePreview?: string;
  onImageSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
