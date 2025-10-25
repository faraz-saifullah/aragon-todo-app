interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

/**
 * Modal component - reusable modal wrapper
 */
export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-surface-primary rounded-lg w-full max-w-md mx-3 sm:mx-4 p-4 sm:p-6 shadow-2xl border border-surface-secondary">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
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
        {children}
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
}

export function Input({ label, value, onChange, placeholder, error, required }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-text-primary text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-surface-secondary border ${
          error ? 'border-red-500' : 'border-surface-primary'
        } rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-accent transition-colors`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
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
}

export function TextArea({ label, value, onChange, placeholder, error, rows = 4 }: TextAreaProps) {
  return (
    <div className="mb-4">
      <label className="block text-text-primary text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-surface-secondary border ${
          error ? 'border-red-500' : 'border-surface-primary'
        } rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-accent transition-colors resize-none`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
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
    'px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
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
      {children}
    </button>
  );
}
