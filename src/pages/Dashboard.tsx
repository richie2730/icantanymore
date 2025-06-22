import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

import ConfirmationModal from '../components/ConfirmationModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import EditHiringModal from '../components/EditHiringModal';
import type { Employee } from '../types/Employee';
import type { Hiring } from '../types/Hiring';
import { mockEmployees } from '../data/mockData';
import { mockHiringData } from '../data/hiringData';
import EmployeeTable from '../components/EmployeeTable';
import HiringTable from '../components/HiringTable';
import AddPersonModal from "../components/AddPersonModal";
import AddMultiple from "../components/AddMultiple";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [selectedPage, setSelectedPage] = useState('Resourcing');
  const [filter, setFilter] = useState('Select');
  const [value, setValue] = useState('');
  const [goToPage, setGoToPage] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // State management
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [hiringData, setHiringData] = useState<Hiring[]>(mockHiringData);
  const [isAdmin] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedHiring, setSelectedHiring] = useState<number[]>([]);

  // Modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  const [editEmployeeModal, setEditEmployeeModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
  }>({
    isOpen: false,
    employee: null
  });

  const [editHiringModal, setEditHiringModal] = useState<{
    isOpen: boolean;
    hiring: Hiring | null;
    index: number;
  }>({
    isOpen: false,
    hiring: null,
    index: -1
  });

  const [isAddPersonModal, setIsAddPersonModal] = useState<boolean>(false);
  const [isAddMultipleModal, setIsAddMultipleModal] = useState<boolean>(false);

  // Memoized data calculations
  const currentData = useMemo(() => 
    selectedPage === 'Hiring' ? hiringData : employees, 
    [selectedPage, hiringData, employees]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return currentData.slice(startIndex, endIndex);
  }, [currentData, currentPage, entriesPerPage]);

  const totalEntries = currentData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Reset page when changing entries per page or selected page
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage, selectedPage]);

  // Event handlers
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  const handleGo = useCallback(() => {
    const pageNum = parseInt(goToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setGoToPage('');
    }
  }, [goToPage, totalPages]);

  const getFilterOptions = useCallback(() => {
    if (selectedPage === 'Hiring') {
      return ['Team', 'Status', 'Hiring Manager'];
    }
    return ['Team', 'Manager'];
  }, [selectedPage]);

  const handleAddFilter = useCallback(() => {
    const filterOptions = getFilterOptions();
    if (filterOptions.includes(filter) && value.trim() !== '') {
      const formatted = `${filter} - ${value.trim()}`;
      if (!selectedFilters.includes(formatted)) {
        setSelectedFilters(prev => [...prev, formatted]);
        setValue('');
      }
    }
  }, [filter, value, selectedFilters, getFilterOptions]);

  const handleRemoveFilter = useCallback((val: string) => {
    setSelectedFilters(prev => prev.filter((item) => item !== val));
  }, []);

  const handleReset = useCallback(() => {
    setSelectedFilters([]);
    setFilter('Select');
    setValue('');
    setCurrentPage(1);
    setGoToPage('');
    setEntriesPerPage(50);
  }, []);

  // Employee handlers
  const handleSelectEmployee = useCallback((empId: number) => {
    setSelectedEmployees(prev =>
      prev.includes(empId)
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    );
  }, []);

  const handleSelectAllEmployees = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedEmployees(employees.map(emp => emp.emp_id));
    } else {
      setSelectedEmployees([]);
    }
  }, [employees]);

  const handleDeleteEmployee = useCallback((empId: number) => {
    const employee = employees.find(emp => emp.emp_id === empId);
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Employee',
      message: `Are you sure you want to delete ${employee?.resource_name}? This action cannot be undone.`,
      onConfirm: () => {
        setEmployees(prev => prev.filter(emp => emp.emp_id !== empId));
        setSelectedEmployees(prev => prev.filter(id => id !== empId));
      }
    });
  }, [employees]);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditEmployeeModal({
      isOpen: true,
      employee
    });
  }, []);

  const handleSaveEmployee = useCallback((updatedEmployee: Employee) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.emp_id === updatedEmployee.emp_id ? updatedEmployee : emp
      )
    );
  }, []);

  // Hiring handlers
  const handleSelectHiring = useCallback((index: number) => {
    setSelectedHiring(prev =>
      prev.includes(index)
        ? prev.filter(id => id !== index)
        : [...prev, index]
    );
  }, []);

  const handleSelectAllHiring = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedHiring(hiringData.map((_, index) => index));
    } else {
      setSelectedHiring([]);
    }
  }, [hiringData]);

  const handleDeleteHiring = useCallback((index: number) => {
    const hiring = hiringData[index];
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Hiring Record',
      message: `Are you sure you want to delete the hiring record for ${hiring?.team}? This action cannot be undone.`,
      onConfirm: () => {
        setHiringData(prev => prev.filter((_, i) => i !== index));
        setSelectedHiring(prev => prev.filter(id => id !== index));
      }
    });
  }, [hiringData]);

  const handleEditHiring = useCallback((hiring: Hiring, index: number) => {
    setEditHiringModal({
      isOpen: true,
      hiring,
      index
    });
  }, []);

  const handleSaveHiring = useCallback((updatedHiring: Hiring, index: number) => {
    setHiringData(prev =>
      prev.map((hiring, i) =>
        i === index ? updatedHiring : hiring
      )
    );
  }, []);

  const handleExportCSV = useCallback(() => {
    if (selectedPage === 'Hiring') {
      const headers = [
        "Team",
        "REQ/FG",
        "Sharepoint ID",
        "Incremental/Backfill",
        "Skill Set",
        "EL Level",
        "Resource",
        "Remarks",
        "Status",
        "Vendor",
        "Hiring Manager"
      ];

      const rows = hiringData.map(hiring => [
        hiring.team,
        hiring.req_fg,
        hiring.sharepoint_id,
        hiring.incremental_backfill,
        hiring.skill_set,
        hiring.el_level,
        hiring.resource,
        hiring.remarks,
        hiring.status,
        hiring.vendor,
        hiring.hiring_manager
      ]);

      let csvContent =
        headers.join(",") + "\n" +
        rows.map(row => row.map(field =>
          `"${(field ?? "").toString().replace(/"/g, '""')}"`
        ).join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'hiring_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = [
        "PRJ core alignment",
        "Employee ID",
        "Name",
        "Core alignment",
        "Core Team",
        "Job Title",
        "Role type",
        "Skills",
        "Email",
        "Vendor",
        "Contact Number",
        "Team Name",
        "Secondary Team",
        "Manager Name",
        "Status",
        "Location",
        "Hire Date",
        "Termination Date",
        "Modified By",
        "Modified at",
      ];

      const rows = employees.map(emp => [
        emp.prj_align,
        emp.emp_id,
        emp.resource_name,
        emp.core_alignment,
        emp.core_team,
        emp.job_title,
        emp.role_type,
        emp.email_id,
        emp.vendor,
        emp.contact_number,
        emp.team_name,
        emp.secondary_team,
        emp.manager_name,
        emp.status,
        emp.base_location,
        emp.hire_date,
        emp.term_date,
        emp.modified_by,
        emp.modified_at,
      ]);

      let csvContent =
        headers.join(",") + "\n" +
        rows.map(row => row.map(field =>
          `"${(field ?? "").toString().replace(/"/g, '""')}"`
        ).join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedPage, hiringData, employees]);

  return (
    <div className="flex flex-col h-screen w-full p-4">
      <div className="flex md:items-center flex-col gap-2 md:flex-row justify-between mb-4 sm:space-y-0">
        <div className="flex flex-wrap items-center space-x-4">
          <div className="flex flex-col sm:w-auto">
            <label className="text-xs text-gray-600 mb-1">Page</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-32 h-8 px-2 border border-gray-300 rounded text-sm bg-white cursor-pointer"
            >
              <option value="Resourcing">Resourcing</option>
              <option value="Hiring">Hiring</option>
            </select>
          </div>

          <div className="flex flex-col sm:w-auto">
            <label className="text-xs text-gray-600 mb-1">Filter<span className="text-red-500">*</span></label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-30 h-8 px-1 border border-gray-300 rounded text-sm bg-white cursor-pointer"
            >
              <option>Select</option>
              {getFilterOptions().map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Value<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFilter()}
              className="w-24 h-8 px-2 border border-gray-300 rounded text-sm bg-white"
            />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-1 space-x-2">
          <button
            onClick={handleAddFilter}
            className="cursor-pointer h-8 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1" style={{ background: '#003a72' }}
          >
            <Search size={14} />
            <span>Search</span>
          </button>
          <button
            onClick={handleReset}
            className="cursor-pointer h-8 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1" style={{ background: '#003a72' }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {selectedPage === 'Resourcing' && (
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="cursor-pointer h-8 w-33 hover:bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-1" style={{ background: '#003a72' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Plus size={14} className="mr-1" />
                Add User
                <ChevronDown size={14} className="ml-2" />
              </button>

              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsAddPersonModal(true);
                        setShowDropdown(false);
                      }}
                      className="cursor-pointer text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Add New User
                    </button>
                    <button
                      onClick={() => {
                        setIsAddMultipleModal(true);
                        setShowDropdown(false);
                      }}
                      className="cursor-pointer text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Add Multiple Users
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="cursor-pointer h-8 hover:bg-blue-900 text-white px-3 py-2 rounded text-sm font-medium flex items-center space-x-1"
            style={{ background: '#003a72' }}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {selectedFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedFilters.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
            >
              <span className="px-1">{item}</span>
              <button
                onClick={() => handleRemoveFilter(item)}
                className="ml-1 p-0.5 text-blue-500 hover:text-red-500 focus:outline-none rounded-full text-sm leading-none hover:bg-blue-100 cursor-pointer"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className='flex-1 my-2'>
        {selectedPage === 'Hiring' ? (
          <HiringTable
            hiringData={paginatedData as Hiring[]}
            loading={false}
            isAdmin={isAdmin}
            selectedHiring={selectedHiring}
            onSelectHiring={handleSelectHiring}
            onSelectAll={handleSelectAllHiring}
            onDeleteHiring={handleDeleteHiring}
            onEditHiring={handleEditHiring}
          />
        ) : (
          <EmployeeTable
            employees={paginatedData as Employee[]}
            loading={false}
            isAdmin={isAdmin}
            selectedEmployees={selectedEmployees}
            onSelectEmployee={handleSelectEmployee}
            onSelectAll={handleSelectAllEmployees}
            onDeleteEmployee={handleDeleteEmployee}
            onEditEmployee={handleEditEmployee}
          />
        )}
      </div>

      <div className="flex md:items-center flex-col gap-2 md:flex-row justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Entries per page</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white cursor-pointer"
          >
            <option value={4}>4</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center flex-wrap gap-1 space-x-4 ">
          <span className="text-sm text-gray-700">
            Displaying Page {currentPage} of {totalPages}
          </span>

          <span className="text-sm text-gray-700">Go to Page</span>
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            placeholder={currentPage.toString()}
            min="1"
            max={totalPages}
            className="w-16 h-8 px-2 border border-gray-300 rounded text-sm bg-white text-center"
            onKeyPress={(e) => e.key === 'Enter' && handleGo()}
          />
          <div className="flex items-center flex-wrap gap-1 space-x-2">
            <button
              onClick={handleGo}
              className="cursor-pointer hover:bg-blue-900 text-white px-3 py-1 rounded text-sm font-medium" style={{ background: '#003a72' }}
            >
              Go
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="cursor-pointer hover:bg-blue-900 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium flex items-center" style={{ background: '#003a72' }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="cursor-pointer hover:bg-blue-900 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium flex items-center" style={{ background: '#003a72' }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <EditEmployeeModal
        isOpen={editEmployeeModal.isOpen}
        onClose={() => setEditEmployeeModal({ isOpen: false, employee: null })}
        onSave={handleSaveEmployee}
        employee={editEmployeeModal.employee}
      />

      <EditHiringModal
        isOpen={editHiringModal.isOpen}
        onClose={() => setEditHiringModal({ isOpen: false, hiring: null, index: -1 })}
        onSave={handleSaveHiring}
        hiring={editHiringModal.hiring}
        index={editHiringModal.index}
      />

      <AddPersonModal isOpen={isAddPersonModal} onClose={() => setIsAddPersonModal(false)} />
      <AddMultiple isOpen={isAddMultipleModal} onClose={() => setIsAddMultipleModal(false)} />
    </div>
  );
};

export default Dashboard;