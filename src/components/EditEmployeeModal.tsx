import React, { useState, useEffect, memo } from 'react';
import { X, Save, User } from 'lucide-react';
import { Employee } from '../types/Employee';
import SkillsInput from './SkillsInput';
import PhoneInput from './PhoneInput';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employee: Employee | null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = memo(({
  isOpen,
  onClose,
  onSave,
  employee
}) => {
  const [formData, setFormData] = useState<Employee>({
    id: '',
    employeeId: '',
    name: '',
    coreAlignment: '',
    coreTeam: '',
    secondaryTeam: '',
    email: '',
    contactNumber: '',
    dateOfJoining: '',
    dateOfTermination: null,
    role: '',
    status: 'Active',
    jobTitle: '',
    roleType: 'Engineering',
    baseLocation: '',
    manager: '',
    vendor: '',
    skills: [],
    updatedBy: '',
    createdBy: '',
    createdAt: null,
    updatedAt: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});

  // Auto-suggestion data
  const suggestionData = {
    skills: [
      'React', 'JavaScript', 'TypeScript', 'Java', 'Spring Boot', 'Kafka', 'PostgreSQL',
      'Docker', 'AWS', 'Kubernetes', 'Python', 'Machine Learning', 'SQL', 'Node.js',
      'Angular', 'Vue.js', 'MongoDB', 'Redis', 'Jenkins', 'Terraform', 'Figma',
      'Sketch', 'Product Strategy', 'Agile', 'Scrum'
    ],
    secondaryTeam: [
      'UI/UX Team', 'DevOps Team', 'Marketing Team', 'Product Team',
      'Engineering Team A', 'Backend Development Team'
    ],
    coreTeam: [
      'Engineering Team A', 'Engineering Team B', 'Product Team', 'Design Team',
      'QA Team', 'Infrastructure Team', 'Data Team', 'Marketing Team', 'Sales Team'
    ],
    baseLocation: [
      'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA',
      'Chicago, IL', 'Denver, CO', 'Boston, MA', 'Los Angeles, CA',
      'Atlanta, GA', 'Dallas, TX'
    ]
  };

  const statusOptions = ['Active', 'Open', 'Inactive', 'Term'];
  const roleTypeOptions = ['Engineering', 'NonEngineering', 'Both'];

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = 'Hire date is required';
    }
    if (!formData.coreTeam?.trim()) {
      newErrors.coreTeam = 'Core team is required';
    }
    if (!formData.manager?.trim()) {
      newErrors.manager = 'Manager is required';
    }
    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (formData.contactNumber.replace(/\D/g, '').length !== 10) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedEmployee = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: 'Current User' // In real app, this would be the logged-in user
      };
      onSave(updatedEmployee);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Employee, value: string | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle auto-suggestions for string fields
    if (typeof value === 'string' && suggestionData[field as keyof typeof suggestionData]) {
      const fieldSuggestions = suggestionData[field as keyof typeof suggestionData];
      const filteredSuggestions = fieldSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(prev => ({ ...prev, [field]: filteredSuggestions }));
      setShowSuggestions(prev => ({ ...prev, [field]: value.length > 0 && filteredSuggestions.length > 0 }));
    }
  };

  const handleSuggestionClick = (field: keyof Employee, suggestion: string) => {
    setFormData(prev => ({ ...prev, [field]: suggestion }));
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
  };

  const renderInputWithSuggestions = (
    field: keyof Employee,
    label: string,
    placeholder: string,
    required: boolean = false,
    type: string = 'text'
  ) => (
    <div className="flex flex-col relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={(formData[field] as string) || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        onFocus={() => {
          if (suggestionData[field as keyof typeof suggestionData]) {
            const fieldSuggestions = suggestionData[field as keyof typeof suggestionData];
            setSuggestions(prev => ({ ...prev, [field]: fieldSuggestions }));
            setShowSuggestions(prev => ({ ...prev, [field]: true }));
          }
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(prev => ({ ...prev, [field]: false })), 200);
        }}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field] ? 'border-red-300' : 'border-gray-300'
        }`}
      />
      {showSuggestions[field] && suggestions[field] && suggestions[field].length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {suggestions[field].slice(0, 5).map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onMouseDown={() => handleSuggestionClick(field, suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  );

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex items-center justify-center min-h-screen">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="ml-4 text-lg leading-6 font-medium text-orange-600">
                Edit Employee - {employee.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee ID */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.employeeId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.employeeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
                  )}
                </div>

                {/* Name */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    value={formData.contactNumber || ''}
                    onChange={(value) => handleInputChange('contactNumber', value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    error={errors.contactNumber}
                  />
                </div>

                {/* Hire Date */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dateOfJoining ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfJoining && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfJoining}</p>
                  )}
                </div>

                {/* Core Team */}
                {renderInputWithSuggestions('coreTeam', 'Core Team', 'Select core team', true)}

                {/* Manager */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.manager || ''}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.manager ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.manager && (
                    <p className="mt-1 text-sm text-red-600">{errors.manager}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as Employee['status'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Role Type */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Type
                  </label>
                  <select
                    value={formData.roleType}
                    onChange={(e) => handleInputChange('roleType', e.target.value as Employee['roleType'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roleTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Core Alignment */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Core Alignment
                  </label>
                  <input
                    type="text"
                    value={formData.coreAlignment || ''}
                    onChange={(e) => handleInputChange('coreAlignment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Secondary Team */}
                {renderInputWithSuggestions('secondaryTeam', 'Secondary Team', 'Select secondary team')}

                {/* Job Title */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Base Location */}
                {renderInputWithSuggestions('baseLocation', 'Base Location', 'Enter location')}

                {/* Vendor */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={formData.vendor || ''}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Termination Date */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Termination Date
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfTermination ? new Date(formData.dateOfTermination).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('dateOfTermination', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <SkillsInput
                  skills={formData.skills}
                  onChange={(skills) => handleInputChange('skills', skills)}
                  suggestions={suggestionData.skills}
                  placeholder="Add a skill..."
                />
              </div>
            </form>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

EditEmployeeModal.displayName = 'EditEmployeeModal';

export default EditEmployeeModal;