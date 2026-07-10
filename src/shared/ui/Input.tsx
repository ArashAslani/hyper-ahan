import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-gray-700">
          {label}
        </label>
      ) : null}
      <input id={id} className={`${fieldClass} ${className}`} {...props} />
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, id, className = "", ...props }: TextareaProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="mb-1 block text-gray-700">
          {label}
        </label>
      ) : null}
      <textarea id={id} className={`${fieldClass} ${className}`} {...props} />
    </div>
  );
}
