import React, { useState, useRef } from "react";
import { X, Upload, FileSpreadsheet } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'employee' | 'hiring';
}

const AddMultiple: React.FC<ModalProps> = ({ isOpen, onClose, type = 'employee' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel" ||
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls')) {
        setUploadedFile(file);
      } else {
        alert("Please upload only Excel files (.xlsx, .xls)");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          file.type === "application/vnd.ms-excel" ||
          file.name.endsWith('.xlsx') || 
          file.name.endsWith('.xls')) {
        setUploadedFile(file);
      } else {
        alert("Please upload only Excel files (.xlsx, .xls)");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (uploadedFile) {
      // Here you would typically process the Excel file
      console.log("Processing file:", uploadedFile.name);
      // Add your file processing logic here
      onClose();
      setUploadedFile(null);
    }
  };

  const getInstructions = () => {
    if (type === 'hiring') {
      return {
        title: 'Add New Hiring',
        requiredColumns: 'Required columns: Candidate Name, Team, Experience Level, Hiring Manager, Status',
        optionalColumns: 'Optional columns: Requisition Type, Sharepoint ID, Incremental Type, Skills, Vendor, Remarks',
        templateData: 'John Doe,Engineering Team A,EL3,Keshav,Active hiring,UHGJP00103805,2025-Rossin_2518,,"React,Java",PS,Initial screening completed'
      };
    }
    return {
      title: 'Add New Employee',
      requiredColumns: 'Required columns: Employee ID, Name, Email, Contact Number, Hire Date, Core Team, Manager, Job Title, Core Alignment, Base Location',
      optionalColumns: 'Optional columns: Secondary Team, Vendor, Skills, Role Type, Status',
      templateData: 'E1001,John Doe,john.doe@company.com,5551234567,2024-01-15,Engineering Team A,Sarah Mitchell,Senior Developer,Frontend Development,New York NY,UI/UX Team,TechCorp,"React,JavaScript,TypeScript",Engineering,Active'
    };
  };

  const instructions = getInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-orange-500 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">{instructions.title}</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : uploadedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-green-800">{uploadedFile.name}</p>
                    <p className="text-sm text-green-600">
                      File size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drag and drop your Excel file here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      or{' '}
                      <button
                        onClick={handleUploadClick}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        browse to choose a file
                      </button>
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Supported formats: .xlsx, .xls (Max size: 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">File Format Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Excel file should contain headers in the first row</li>
                <li>• {instructions.requiredColumns}</li>
                <li>• {instructions.optionalColumns}</li>
                <li>• Skills should be comma-separated in a single cell</li>
                <li>• Date format should be MM/DD/YYYY or YYYY-MM-DD</li>
              </ul>
            </div>

            {/* Sample Template */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Need a template?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download our sample Excel template to ensure your data is formatted correctly.
              </p>
              <button
                onClick={() => {
                  // Create and download sample template
                  const headers = type === 'hiring' 
                    ? ['Candidate Name', 'Team', 'Experience Level', 'Hiring Manager', 'Status', 'Requisition Type', 'Sharepoint ID', 'Incremental Type', 'Skills', 'Vendor', 'Remarks']
                    : ['Employee ID', 'Name', 'Email', 'Contact Number', 'Hire Date', 'Core Team', 'Manager', 'Job Title', 'Core Alignment', 'Base Location', 'Secondary Team', 'Vendor', 'Skills', 'Role Type', 'Status'];
                  
                  const csvContent = headers.join(',') + '\n' + instructions.templateData;
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${type}_template.csv`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Download Sample Template
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!uploadedFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Upload & Process
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMultiple;