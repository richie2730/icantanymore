import React, { memo } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Hiring } from '../types/Hiring';
import SortableHeader from './SortableHeader';

interface HiringTableProps {
  hiringData: Hiring[];
  loading: boolean;
  isAdmin: boolean;
  selectedHiring: string[];
  onSelectHiring: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onDeleteHiring: (id: string) => void;
  onEditHiring: (hiring: Hiring) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}

const HiringTable: React.FC<HiringTableProps> = memo(({ 
  hiringData, 
  loading, 
  isAdmin,
  selectedHiring,
  onSelectHiring,
  onSelectAll,
  onDeleteHiring,
  onEditHiring,
  sortConfig,
  onSort
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Active hiring':
        return 'bg-blue-100 text-blue-800';
      case 'To be approved':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-sky-100 text-sky-800';
      case 'Need to ask profiles':
        return 'bg-orange-100 text-orange-800';
      case 'On Hold':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const isAllSelected = hiringData.length > 0 && selectedHiring.length === hiringData.length;
  const isIndeterminate = selectedHiring.length > 0 && selectedHiring.length < hiringData.length;

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading hiring data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="flex-1 overflow-auto">
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
              <SortableHeader
                sortKey="team"
                currentSort={sortConfig}
                onSort={onSort}
                className="min-w-[150px]"
              >
                Team
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Requisition Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                Sharepoint ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Incremental Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Skills
              </th>
              <SortableHeader
                sortKey="experienceLevel"
                currentSort={sortConfig}
                onSort={onSort}
                className="min-w-[100px]"
              >
                EL Level
              </SortableHeader>
              <SortableHeader
                sortKey="candidateName"
                currentSort={sortConfig}
                onSort={onSort}
                className="min-w-[150px]"
              >
                Candidate Name
              </SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Remarks
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Vendor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                Hiring Manager
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Updated By
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hiringData.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 14 : 13} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl text-gray-400">📋</span>
                    </div>
                    <p className="text-lg font-medium">No hiring data found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              hiringData.map((hiring, index) => (
                <tr 
                  key={hiring.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  } ${selectedHiring.includes(hiring.id) ? 'bg-blue-50' : ''}`}
                >
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedHiring.includes(hiring.id)}
                        onChange={() => onSelectHiring(hiring.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hiring.team}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.requisitionType || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.sharepointId || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.incrementalType || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {hiring.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                      {hiring.skills.length > 2 && (
                        <span className="text-xs text-gray-500">+{hiring.skills.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.experienceLevel || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.candidateName || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.remarks || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hiring.status)}`}>
                      {hiring.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.vendor || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {hiring.hiringManager}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div>{hiring.updatedBy || '-'}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(hiring.updatedAt)}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditHiring(hiring)}
                          className="text-blue-800 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Edit hiring record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteHiring(hiring.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete hiring record"
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
      
      {hiringData.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Displaying <span className="font-medium">{hiringData.length}</span> hiring records
              {selectedHiring.length > 0 && (
                <span className="ml-2 text-blue-600">
                  ({selectedHiring.length} selected)
                </span>
              )}
            </p>
            <div className="text-sm text-gray-500">
              Total records: {hiringData.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

HiringTable.displayName = 'HiringTable';

export default HiringTable;