import React, { useState } from "react";
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPersonModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [jobTitles, setJobTitles] = useState([""]);
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleAddJobTitle = () => {
    setJobTitles([...jobTitles, ""]);
  };

  const handleJobTitleChange = (index: number, value: string) => {
    const updated = [...jobTitles];
    updated[index] = value;
    setJobTitles(updated);
  };

  const isContactValid = /^\d{10}$/.test(contact);
  const isEmailValid = /^[^\s@]+@optum\.com$/.test(email);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-orange-600">Add Employee Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UCMG/PRJ Core Alignment
              </label>
              <input 
                type="text" 
                placeholder="UCMG/PRJ Core Alignment" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager
              </label>
              <input 
                type="text" 
                placeholder="Manager" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input 
                type="text" 
                placeholder="Emp ID" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Name
              </label>
              <input 
                type="text" 
                placeholder="Resource Name" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hire/Term Date
              </label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Core Team
              </label>
              <input 
                type="text" 
                placeholder="Core Team" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Team
              </label>
              <input 
                type="text" 
                placeholder="Secondary Team" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Active">Active</option>
                <option value="Term">Term</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <input 
                type="text" 
                placeholder="Vendor" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID (@optum.com)
              </label>
              <input
                type="email"
                placeholder="Email ID (@optum.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                  email && !isEmailValid ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="Contact #"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                  contact && !isContactValid ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Select Role Type</option>
                <option value="Eng">Engineering</option>
                <option value="Non-Eng">Non-Engineering</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Location
              </label>
              <input 
                type="text" 
                placeholder="Base Location" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title / Skill Set
              </label>
              <div className="max-h-[120px] overflow-y-auto space-y-2 pr-2">
                {jobTitles.map((title, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleJobTitleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
                      placeholder={`Skill ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (jobTitles.length > 1) {
                          const updated = [...jobTitles];
                          updated.splice(index, 1);
                          setJobTitles(updated);
                        }
                      }}
                      className="text-red-500 text-sm font-bold hover:text-red-700 px-2 py-1"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddJobTitle}
                className="text-orange-600 text-sm font-medium mt-2 hover:text-orange-700"
              >
                + Add More
              </button>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            type="submit"
            disabled={!isContactValid || !isEmailValid}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPersonModal;