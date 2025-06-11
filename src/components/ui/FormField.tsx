import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: FieldError;
  type?: string;
  children: React.ReactNode;
}

const FormField = ({
  id,
  label,
  placeholder,
  error,
  type = 'text',
  children
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;