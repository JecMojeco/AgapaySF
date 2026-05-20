import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const ReportPrintTemplate = ({
  summary,
  events,
  selectedEvent,
  damageData,
  evacuationData,
  damageDetails,
  evacuationDetails
}) => {
  const eventTitle = selectedEvent === 'all' 
    ? 'All Events Summary' 
    : events.find(e => e.id === parseInt(selectedEvent))?.name || 'Event Summary';

  return (
    <div className="hidden print:block p-8 bg-white text-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-1">AgapaySF</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Disaster Response Management System</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Situation Report Summary</h2>
          <p className="text-sm text-gray-600">Generated on: {format(new Date(), 'MMMM d, yyyy HH:mm')}</p>
          <p className="text-sm font-medium mt-1">{eventTitle}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Residents</p>
          <p className="text-2xl font-bold">{summary.totalResidents || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Structures</p>
          <p className="text-2xl font-bold">{summary.totalStructures || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Damage Reports</p>
          <p className="text-2xl font-bold">{summary.totalDamageReports || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Evacuation Logs</p>
          <p className="text-2xl font-bold">{summary.totalEvacuationLogs || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Damage Assessment Section */}
        <div>
          <h3 className="text-lg font-bold border-b mb-4 pb-2">Damage Assessment Overview</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {damageData.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm capitalize">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-bold mb-2">Detailed Breakdown</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border">Severity</th>
                    <th className="text-right p-2 border">Count</th>
                    <th className="text-right p-2 border">%</th>
                  </tr>
                </thead>
                <tbody>
                  {damageDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="p-2 border capitalize">{detail.severity}</td>
                      <td className="p-2 border text-right">{detail.count}</td>
                      <td className="p-2 border text-right">{detail.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Evacuation Section */}
        <div>
          <h3 className="text-lg font-bold border-b mb-4 pb-2">Evacuation Overview</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {evacuationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-1">
                  <span className="text-sm capitalize">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-bold mb-2">Detailed Breakdown</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border">Status</th>
                    <th className="text-right p-2 border">Count</th>
                    <th className="text-right p-2 border">%</th>
                  </tr>
                </thead>
                <tbody>
                  {evacuationDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="p-2 border capitalize">{detail.status}</td>
                      <td className="p-2 border text-right">{detail.count}</td>
                      <td className="p-2 border text-right">{detail.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Signature Area */}
      <div className="mt-16 pt-8 border-t flex justify-between italic text-sm text-gray-500">
        <div>
          <p>Verified by:</p>
          <div className="mt-8 border-b border-black w-48"></div>
          <p className="mt-1">Incident Commander / Authority</p>
        </div>
        <div className="text-right">
          <p>AgapaySF System Generated Report</p>
          <p>Confidential - For Official Use Only</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPrintTemplate;
