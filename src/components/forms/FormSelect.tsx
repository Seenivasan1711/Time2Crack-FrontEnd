import { forwardRef, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  icon?: ReactNode;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, className, icon, ...props }, ref) => {
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
          
          <select
            ref={ref}
            className={cn(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
              icon ? 'pl-10' : '',
              error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : '',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;