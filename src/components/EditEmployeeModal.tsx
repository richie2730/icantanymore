import React, { useState, useEffect, memo } from 'react';
import { X, Save, User } from 'lucide-react';
import { Employee } from '../types/Employee';

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
    emp_id: 0,
    resource_name: '',
    prj_align: '',
    core_alignment: '',
    core_team: '',
    job_title: '',
    role_type: '',
    status: '',
    base_location: '',
    email_id: '',
    hire_date: '',
    term_date: '',
    modified_by: '',
    modified_at: '',
    vendor: '',
    contact_number: '',
    team_name: '',
    manager_name: '',
    secondary_team: '',
    skills: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});

  // Auto-suggestion data
  const suggestionData = {
    prj_align: ['PRJ7782', 'PRJ8722', 'PRJ9901', 'PRJ5543', 'PRJ3321'],
    core_alignment: [
      'Frontend Development',
      'Backend Development',
      'Full Stack Development',
      'Product Management',
      'UI/UX Design',
      'Quality Assurance',
      'DevOps',
      'Data Science',
      'Marketing',
      'Sales'
    ],
    core_team: [
      'Engineering Team A',
      'Engineering Team B',
      'Product Team',
      'Design Team',
      'QA Team',
      'Infrastructure Team',
      'Data Team',
      'Marketing Team',
      'Sales Team'
    ],
    job_title: [
      'Senior Frontend Developer',
      'Lead Backend Developer',
      'Product Manager',
      'Senior UX Designer',
      'Senior QA Engineer',
      'DevOps Engineer',
      'Data Scientist',
      'Software Engineer',
      'Technical Lead',
      'Principal Engineer'
    ],
    skills: [
      'React',
      'JavaScript',
      'TypeScript',
      'Java',
      'Spring Boot',
      'Kafka',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Kubernetes',
      'Python',
      'Machine Learning',
      'SQL',
      'Node.js',
      'Angular',
      'Vue.js',
      'MongoDB',
      'Redis',
      'Jenkins',
      'Terraform',
      'Figma',
      'Sketch',
      'Product Strategy',
      'Agile',
      'Scrum'
    ],
    vendor: [
      'TechCorp Solutions',
      'DevSolutions Inc',
      'ProductWorks LLC',
      'DesignHub Studios',
      'QualityFirst Partners',
      'CloudOps Solutions',
      'DataTech Analytics'
    ],
    team_name: [
      'Frontend Development Team',
      'Backend Development Team',
      'Product Strategy Team',
      'UX Design Team',
      'Quality Assurance Team',
      'Infrastructure Team',
      'Data Science Team'
    ],
    manager_name: [
      'Sarah Mitchell',
      'David Thompson',
      'Emily Rodriguez',
      'Michael Chen',
      'Jessica Williams',
      'Robert Johnson',
      'Amanda Davis',
      'Christopher Lee'
    ],
    secondary_team: [
      'UI/UX Team',
      'DevOps Team',
      'Marketing Team',
      'Product Team',
      'Engineering Team A',
      'Backend Development Team'
    ],
    base_location: [
      'New York, NY',
      'San Francisco, CA',
      'Austin, TX',
      'Seattle, WA',
      'Chicago, IL',
      'Denver, CO',
      'Boston, MA',
      'Los Angeles, CA',
      'Atlanta, GA',
      'Dallas, TX'
    ]
  };

  const roleTypeOptions = ['Engineering', 'Non Engineering', 'Both'];
  const statusOptions = ['Active', 'Inactive', 'Open', 'To Be Approved'];

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.resource_name.trim()) {
      newErrors.resource_name = 'Name is required';
    }
    if (!formData.email_id.trim()) {
      newErrors.email_id = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = 'Email is invalid';
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }
    if (!formData.hire_date) {
      newErrors.hire_date = 'Hire date is required';
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedEmployee = {
        ...formData,
        modified_at: new Date().toISOString().split('T')[0]
      };
      onSave(updatedEmployee);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Employee, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Handle auto-suggestions
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
        value={formData[field] as string}
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

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="ml-4 text-lg leading-6 font-medium text-orange-600">
                Edit Employee - {employee.resource_name}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Employee ID - Read only */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    value={formData.emp_id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Name */}
                {renderInputWithSuggestions('resource_name', 'Name', 'Enter name', true)}

                {/* Project Alignment */}
                {renderInputWithSuggestions('prj_align', 'Project Alignment', 'Select project')}

                {/* Core Alignment */}
                {renderInputWithSuggestions('core_alignment', 'Core Alignment', 'Select core alignment')}

                {/* Core Team */}
                {renderInputWithSuggestions('core_team', 'Core Team', 'Select core team')}

                {/* Job Title */}
                {renderInputWithSuggestions('job_title', 'Job Title', 'Enter job title', true)}

                {/* Role Type */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Type
                  </label>
                  <select
                    value={formData.role_type}
                    onChange={(e) => handleInputChange('role_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role Type</option>
                    {roleTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Skills */}
                {renderInputWithSuggestions('skills', 'Skills', 'Enter skills (comma separated)')}

                {/* Email */}
                {renderInputWithSuggestions('email_id', 'Email', 'Enter email', true, 'email')}

                {/* Vendor */}
                {renderInputWithSuggestions('vendor', 'Vendor', 'Select vendor')}

                {/* Contact Number */}
                {renderInputWithSuggestions('contact_number', 'Contact Number', 'Enter contact number', true, 'tel')}

                {/* Team Name */}
                {renderInputWithSuggestions('team_name', 'Team Name', 'Select team name')}

                {/* Secondary Team */}
                {renderInputWithSuggestions('secondary_team', 'Secondary Team', 'Select secondary team')}

                {/* Manager Name */}
                {renderInputWithSuggestions('manager_name', 'Manager Name', 'Select manager')}

                {/* Status */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                {renderInputWithSuggestions('base_location', 'Base Location', 'Enter location')}

                {/* Hire Date */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.hire_date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.hire_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>
                  )}
                </div>

                {/* Termination Date */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Termination Date
                  </label>
                  <input
                    type="date"
                    value={formData.term_date || ''}
                    onChange={(e) => handleInputChange('term_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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