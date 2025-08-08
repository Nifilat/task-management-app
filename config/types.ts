export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  className?: string;
  gridCols?: string;
}

export interface FormConfig {
  title: string;
  submitText: string;
  loadingText: string;
  fields: FormFieldConfig[];
  hasImageUpload?: boolean;
}
