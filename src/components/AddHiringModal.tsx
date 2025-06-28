import React, { useState, memo } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import { Hiring } from '../types/Hiring';
import SkillsInput from './SkillsInput';

interface AddHiringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hiring: Hiring) => void;
}

const AddHiringModal: React.FC<AddHiringModalProps> = memo(({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Omit<Hiring, 'id' | 'createdAt' | 'updatedAt'>>({
    team: '',
    requisitionType: '',
    sharepointId: '',
    incrementalType: '',
    skills: [],
    experienceLevel: '',
    candidateName: '',
    remarks: '',
    status: 'Active hiring',
    vendor: '',
    hiringManager: '',
    updatedBy: '',
    createdBy: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});

  // Auto-suggestion data
  const suggestionData = {
    team: [
      'Coral/Atlantis/Achievers', 'Skyrocket', 'Achievers', 'OFS', 'Engineering Team A',
      'Engineering Team B', 'Product Team', 'Design Team', 'QA Team', 'Infrastructure Team'
    ]
  };

  const skillsSuggestions = [
    'React', 'JavaScript', 'TypeScript', 'Java', 'Spring Boot', 'Kafka', 'PostgreSQL',
    'Docker', 'AWS', 'Kubernetes', 'Python', 'Machine Learning', 'SQL', 'Node.js',
    'Angular', 'Vue.js', 'MongoDB', 'Redis', 'Jenkins', 'Terraform', 'Infrastructure',
    'Gen AI', 'DevOps', 'API Testing', 'Automation'
  ];

  const statusOptions = ['Hired', 'Active hiring', 'To be approved', 'Approved', 'Need to ask profiles', 'On Hold', 'Cancelled'];
  const vendorOptions = ['PS', 'CTS', 'TCS', 'Infosys', 'Wipro', 'Accenture'];
  const hiringManagerOptions = ['Keshav', 'Kunjal', 'Sarah Mitchell', 'David Thompson', 'Emily Rodriguez', 'Michael Chen'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Candidate name is required';
    }
    if (!formData.team.trim()) {
      newErrors.team = 'Team is required';
    }
    if (!formData.experienceLevel?.trim()) {
      newErrors.experienceLevel = 'Experience level is required';
    }
    if (!formData.hiringManager.trim()) {
      newErrors.hiringManager = 'Hiring manager is required';
    }
    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newHiring: Hiring = {
        ...formData,
        id: `hire-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        updatedBy: 'Current User'
      };
      onSave(newHiring);
      onClose();
      // Reset form
      setFormData({
        team: '',
        requisitionType: '',
        sharepointId: '',
        incrementalType: '',
        skills: [],
        experienceLevel: '',
        candidateName: '',
        remarks: '',
        status: 'Active hiring',
        vendor: '',
        hiringManager: '',
        updatedBy: '',
        createdBy: ''
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
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

  const handleSuggestionClick = (field: keyof typeof formData, suggestion: string) => {
    setFormData(prev => ({ ...prev, [field]: suggestion }));
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
  };

  const renderInputWithSuggestions = (
    field: keyof typeof formData,
    label: string,
    placeholder: string,
    required: boolean = false
  ) => (
    <div className="flex flex-col relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex items-center justify-center min-h-screen">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-orange-600">
              Add New Hiring Record
            </h3>
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
                {/* Candidate Name */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.candidateName}
                    onChange={(e) => handleInputChange('candidateName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.candidateName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.candidateName && (
                    <p className="mt-1 text-sm text-red-600">{errors.candidateName}</p>
                  )}
                </div>

                {/* Team */}
                {renderInputWithSuggestions('team', 'Team', 'Enter team name', true)}

                {/* Experience Level */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.experienceLevel || ''}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    placeholder="e.g., EL3, EL4"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.experienceLevel ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.experienceLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.experienceLevel}</p>
                  )}
                </div>

                {/* Hiring Manager */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiring Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hiringManager}
                    onChange={(e) => handleInputChange('hiringManager', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.hiringManager ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Hiring Manager</option>
                    {hiringManagerOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.hiringManager && (
                    <p className="mt-1 text-sm text-red-600">{errors.hiringManager}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.status ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                  )}
                </div>

                {/* Requisition Type */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requisition Type
                  </label>
                  <input
                    type="text"
                    value={formData.requisitionType || ''}
                    onChange={(e) => handleInputChange('requisitionType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sharepoint ID */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sharepoint ID
                  </label>
                  <input
                    type="text"
                    value={formData.sharepointId || ''}
                    onChange={(e) => handleInputChange('sharepointId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Incremental Type */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incremental Type
                  </label>
                  <input
                    type="text"
                    value={formData.incrementalType || ''}
                    onChange={(e) => handleInputChange('incrementalType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Vendor */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor
                  </label>
                  <select
                    value={formData.vendor || ''}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vendor</option>
                    {vendorOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Remarks */}
                <div className="flex flex-col md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks || ''}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    rows={3}
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
                  suggestions={skillsSuggestions}
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
              Add Hiring Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

AddHiringModal.displayName = 'AddHiringModal';

export default AddHiringModal;