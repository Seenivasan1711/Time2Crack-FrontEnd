import { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  togglePassword?: () => void;
  showPassword?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, icon, togglePassword, showPassword, ...props }, ref) => {
    const isPasswordField = props.type === 'password' || props.type === 'text' && togglePassword;
    
    return (
      <div className="space-y-1">
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'input',
              icon ? 'pl-10' : '',
              isPasswordField ? 'pr-10' : '',
              error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : '',
              className
            )}
            {...props}
          />
          
          {isPasswordField && togglePassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={togglePassword}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;