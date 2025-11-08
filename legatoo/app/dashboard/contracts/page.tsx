'use client'

import React from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { FileText, Plus, Search, Filter } from 'lucide-react'

export default function ContractsPage() {
  const contracts = [
    {
      id: 1,
      title: 'Employment Agreement - Tech Corp',
      client: 'Tech Corp Inc.',
      status: 'In Review',
      date: '2024-01-15',
      amount: '$5,000',
      type: 'Employment',
    },
    {
      id: 2,
      title: 'Service Contract - StartupXYZ',
      client: 'StartupXYZ',
      status: 'Draft',
      date: '2024-01-14',
      amount: '$3,500',
      type: 'Service',
    },
    {
      id: 3,
      title: 'Partnership Agreement - Legal Firm',
      client: 'Legal Partners LLC',
      status: 'Completed',
      date: '2024-01-12',
      amount: '$7,200',
      type: 'Partnership',
    },
    {
      id: 4,
      title: 'NDA - Confidential Project',
      client: 'Confidential Client',
      status: 'In Review',
      date: '2024-01-10',
      amount: '$1,500',
      type: 'NDA',
    },
    {
      id: 5,
      title: 'Lease Agreement - Office Space',
      client: 'Office Solutions Ltd',
      status: 'Draft',
      date: '2024-01-08',
      amount: '$12,000',
      type: 'Lease',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your contract agreements.
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search contracts..."
                  className="block w-full pl-10 pr-3 py-2 border !border-primary rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border !border-primary rounded-md text-sm focus:outline-none focus:ring-1 text-primary focus:ring-primary focus:border-primary">
                <option>All Status</option>
                <option>Draft</option>
                <option>In Review</option>
                <option>Completed</option>
              </select>
              <select className="px-3 py-2 border !border-primary rounded-md text-sm focus:outline-none focus:ring-1 text-primary focus:ring-primary focus:border-primary">
                <option>All Types</option>
                <option>Employment</option>
                <option>Service</option>
                <option>Partnership</option>
                <option>NDA</option>
                <option>Lease</option>
              </select>
              <button className="inline-flex items-center px-3 py-2 border !border-primary rounded-md text-sm font-medium text-primary bg-white hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Contracts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary/80 mr-3">
                        Edit
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
