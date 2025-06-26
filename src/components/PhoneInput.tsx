import React, { useState, useEffect } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  className = "",
  error
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
      const formatted = formatPhoneNumber(cleaned);
      setDisplayValue(formatted);
      onChange(cleaned);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${error ? 'border-red-300' : 'border-gray-300'}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;