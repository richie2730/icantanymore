import React, { useState, useEffect, memo } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import { Hiring } from '../types/Hiring';

interface EditHiringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hiring: Hiring, index: number) => void;
  hiring: Hiring | null;
  index: number;
}

const EditHiringModal: React.FC<EditHiringModalProps> = memo(({
  isOpen,
  onClose,
  onSave,
  hiring,
  index
}) => {
  const [formData, setFormData] = useState<Hiring>({
    team: '',
    req_fg: '',
    sharepoint_id: '',
    incremental_backfill: '',
    skill_set: '',
    el_level: '',
    resource: '',
    remarks: '',
    status: '',
    vendor: '',
    hiring_manager: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = ['Hired', 'Active hiring', 'To be approved', 'Approved', 'Need to ask profiles', 'On Hold', 'Cancelled'];
  const vendorOptions = ['PS', 'CTS', 'TCS', 'Infosys', 'Wipro', 'Accenture'];
  const hiringManagerOptions = [
    'Keshav',
    'Kunjal',
    'Sarah Mitchell',
    'David Thompson',
    'Emily Rodriguez',
    'Michael Chen'
  ];

  useEffect(() => {
    if (hiring) {
      setFormData(hiring);
    }
  }, [hiring]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.team.trim()) {
      newErrors.team = 'Team is required';
    }
    if (!formData.skill_set.trim()) {
      newErrors.skill_set = 'Skill set is required';
    }
    if (!formData.el_level.trim()) {
      newErrors.el_level = 'EL Level is required';
    }
    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }
    if (!formData.hiring_manager.trim()) {
      newErrors.hiring_manager = 'Hiring manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData, index);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Hiring, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !hiring) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div className="flex items-center justify-center min-h-screen">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900">
                Edit Hiring Record - {hiring.team}
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
                {/* Team - Now a text input */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.team ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.team && (
                    <p className="mt-1 text-sm text-red-600">{errors.team}</p>
                  )}
                </div>

                {/* REQ/FG */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    REQ/FG
                  </label>
                  <input
                    type="text"
                    value={formData.req_fg}
                    onChange={(e) => handleInputChange('req_fg', e.target.value)}
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
                    value={formData.sharepoint_id}
                    onChange={(e) => handleInputChange('sharepoint_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Incremental/Backfill */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incremental/Backfill
                  </label>
                  <input
                    type="text"
                    value={formData.incremental_backfill}
                    onChange={(e) => handleInputChange('incremental_backfill', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Skill Set */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Set <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.skill_set}
                    onChange={(e) => handleInputChange('skill_set', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.skill_set ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.skill_set && (
                    <p className="mt-1 text-sm text-red-600">{errors.skill_set}</p>
                  )}
                </div>

                {/* EL Level - Now a text input */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EL Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.el_level}
                    onChange={(e) => handleInputChange('el_level', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.el_level ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.el_level && (
                    <p className="mt-1 text-sm text-red-600">{errors.el_level}</p>
                  )}
                </div>

                {/* Resource */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource
                  </label>
                  <input
                    type="text"
                    value={formData.resource}
                    onChange={(e) => handleInputChange('resource', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Remarks */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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

                {/* Vendor */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor
                  </label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vendor</option>
                    {vendorOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Hiring Manager */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiring Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hiring_manager}
                    onChange={(e) => handleInputChange('hiring_manager', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.hiring_manager ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Hiring Manager</option>
                    {hiringManagerOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.hiring_manager && (
                    <p className="mt-1 text-sm text-red-600">{errors.hiring_manager}</p>
                  )}
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

EditHiringModal.displayName = 'EditHiringModal';

export default EditHiringModal;