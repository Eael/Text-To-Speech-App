import React from 'react';
import './TextInput.css';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "Enter text to convert to speech...",
  disabled = false,
}) => {
  return (
    <div className="text-input-container">
      <label htmlFor="text-input" className="text-input-label">
        Text to Speech
      </label>
      <textarea
        id="text-input"
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
        maxLength={5000}
      />
      <div className="character-count">
        {value.length} / 5000 characters
      </div>
    </div>
  );
};

export default TextInput;