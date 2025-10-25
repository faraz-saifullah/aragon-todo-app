import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  wide?: boolean; // Optional prop for wider modal
}

/**
 * Modal component - reusable modal wrapper
 */
export default function Modal({ isOpen, onClose, children, title, wide = false }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = wide ? 'max-w-4xl' : 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className={`relative bg-surface-primary rounded-lg w-full ${maxWidthClass} mx-3 sm:mx-4 shadow-2xl border border-surface-secondary`}
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6 p-4 sm:p-6 pb-0">
          <h2 className="text-text-primary text-base sm:text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 80px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  onBlur?: () => void;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  maxLength,
  autoFocus,
  onBlur,
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-text-primary text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`w-full bg-surface-secondary border ${
          error ? 'border-red-500' : 'border-surface-primary'
        } rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-accent transition-colors`}
      />
      <div className="flex justify-between items-center mt-1">
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {maxLength && (
          <p className="text-text-muted text-xs ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  onBlur?: () => void;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  maxLength,
  onBlur,
}: TextAreaProps) {
  return (
    <div className="mb-4">
      <label className="block text-text-primary text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full bg-surface-secondary border ${
          error ? 'border-red-500' : 'border-surface-primary'
        } rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-accent transition-colors resize-none`}
      />
      <div className="flex justify-between items-center mt-1">
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {maxLength && (
          <p className="text-text-muted text-xs ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, value, onChange, options, error }: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-text-primary text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-surface-secondary border ${
          error ? 'border-red-500' : 'border-surface-primary'
        } rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-surface-accent transition-colors`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({
  onClick,
  type = 'button',
  variant = 'primary',
  children,
  disabled,
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  const variantStyles =
    variant === 'primary'
      ? 'bg-surface-accent hover:bg-surface-accent/90 text-text-primary'
      : 'bg-surface-secondary hover:bg-surface-secondary/80 text-text-secondary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles}`}
    >
      {disabled && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
