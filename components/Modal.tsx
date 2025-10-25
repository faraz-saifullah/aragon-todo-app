import { useState } from 'react';

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
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-gray-800 rounded-lg w-full max-w-md mx-4 p-6 shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
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

export function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-900 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
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

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
}: TextAreaProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-gray-900 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none`}
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
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-900 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors`}
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
      ? 'bg-purple-600 hover:bg-purple-700 text-white'
      : 'bg-gray-700 hover:bg-gray-600 text-gray-300';

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

