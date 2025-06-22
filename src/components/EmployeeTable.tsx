import React, { memo } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Employee } from '../types/Employee';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  isAdmin: boolean;
  selectedEmployees: number[];
  onSelectEmployee: (empId: number) => void;
  onSelectAll: (selected: boolean) => void;
  onDeleteEmployee: (empId: number) => void;
  onEditEmployee: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = memo(({ 
  employees, 
  loading, 
  isAdmin, 
  selectedEmployees, 
  onSelectEmployee, 
  onSelectAll,
  onDeleteEmployee,
  onEditEmployee
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'; // #CFE8CC background, #22543D text
      case 'Inactive':
        return 'bg-red-100 text-red-800'; // #F3C1C6 background, #9B1C1C text
      case 'Open':
        return 'bg-yellow-100 text-yellow-800'; // #FFE9A9 background, #7B341E text
      case 'To Be Approved':
        return 'bg-blue-100 text-blue-800'; // #B5D3E7 background, #1C3D5A text
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleTypeColor = (roleType: string) => {
    switch (roleType) {
      case 'Engineering':
        return 'bg-blue-100 text-blue-800'; // #A7C7E7 background, #1E3A8A text
      case 'Non Engineering':
        return 'bg-purple-100 text-purple-800'; // #D5B8FF background, #5B21B6 text
      case 'Both':
        return 'bg-green-100 text-green-800'; // #B5EAD7 background, #065F46 text
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isAllSelected = employees.length > 0 && selectedEmployees.length === employees.length;
  const isIndeterminate = selectedEmployees.length > 0 && selectedEmployees.length < employees.length;

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading employees...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              {isAdmin && (
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                PRJ Core Alignment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Employee ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                Core Alignment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Core Team
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Job Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Role Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Skills
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                Contact Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Team Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                Secondary Team
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                Manager Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[110px]">
                Hire Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                Termination Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Modified By
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 22 : 21} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl text-gray-400">📊</span>
                    </div>
                    <p className="text-lg font-medium">No employees found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr 
                  key={employee.emp_id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  } ${selectedEmployees.includes(employee.emp_id) ? 'bg-blue-50' : ''}`}
                >
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.emp_id)}
                        onChange={() => onSelectEmployee(employee.emp_id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.prj_align}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.emp_id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.resource_name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.core_alignment}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.core_team}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.job_title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleTypeColor(employee.role_type)}`}>
                      {employee.role_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 max-w-[200px]">
                    <div className="truncate" title={employee.skills}>
                      {employee.skills}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <a href={`mailto:${employee.email_id}`}>{employee.email_id}</a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.vendor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <a href={`tel:${employee.contact_number}`} className="text-blue-600 hover:text-blue-800">
                      {employee.contact_number}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.team_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.secondary_team}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.manager_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.base_location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.hire_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {employee.term_date ? new Date(employee.term_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>{employee.modified_by}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(employee.modified_at).toLocaleDateString()}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditEmployee(employee)}
                          className="text-blue-800 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Edit employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(employee.emp_id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {employees.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Displaying <span className="font-medium">{employees.length}</span> employees
              {selectedEmployees.length > 0 && (
                <span className="ml-2 text-blue-600">
                  ({selectedEmployees.length} selected)
                </span>
              )}
            </p>
            <div className="text-sm text-gray-500">
              Total records: {employees.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

EmployeeTable.displayName = 'EmployeeTable';

export default EmployeeTable;