import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  skills,
  onChange,
  suggestions = [],
  placeholder = "Add a skill...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !skills.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, skills]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addSkill(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex flex-wrap gap-1 items-center">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center flex-1 min-w-[120px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue.trim()) {
                  setShowSuggestions(filteredSuggestions.length > 0);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder={skills.length === 0 ? placeholder : ""}
              className="flex-1 outline-none text-sm bg-transparent"
            />
            <button
              type="button"
              onClick={() => addSkill(inputValue)}
              disabled={!inputValue.trim()}
              className="ml-2 p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto mt-1">
          {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsInput;