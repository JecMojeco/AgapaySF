# PDF Summary Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a structured, printable report template using CSS print media queries that includes summary tables, charts-as-tables, and detailed logs.

**Architecture:** Create a `ReportPrintTemplate` component that renders a printable A4 layout. This component is hidden in standard view but visible during printing (`print:block`), while the main dashboard is hidden (`print:hidden`).

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Create ReportPrintTemplate Component

**Files:**
- Create: `src/components/dashboard/ReportPrintTemplate.jsx`

- [ ] **Step 1: Implement ReportPrintTemplate component**

Create the component with a structured layout for printing.

```jsx
import { Logo } from "@/components/ui/Logo";

export function ReportPrintTemplate({ 
  summary, 
  events, 
  selectedEvent, 
  damageData, 
  evacuationData, 
  damageDetails, 
  evacuationDetails 
}) {
  const currentEvent = events.find(e => e.event_id.toString() === selectedEvent);
  const totalDamage = damageData.reduce((acc, curr) => acc + parseInt(curr.count), 0);
  const totalEvacuation = evacuationData.reduce((acc, curr) => acc + parseInt(curr.count), 0);

  return (
    <div className="hidden print:block print:p-8 bg-white text-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-8">
        <div className="flex items-center gap-4">
          <Logo className="h-16" />
          <div>
            <h1 className="text-2xl font-bold uppercase">AgapaySF Disaster Response Report</h1>
            <p className="text-sm font-semibold italic text-gray-700">Official Operational Summary</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Report Generation Date</p>
          <p className="text-sm font-bold">{new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })}</p>
        </div>
      </div>

      {/* Executive Summary Section */}
      <section className="mb-8 break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 uppercase tracking-tight">1. Executive Summary</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="border border-gray-300 p-4 rounded text-center">
            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Total Residents</p>
            <p className="text-2xl font-bold">{summary?.totalResidents || 0}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded text-center bg-gray-50">
            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Active Evacuations</p>
            <p className="text-2xl font-bold">{summary?.activeEvacuations || 0}</p>
          </div>
          <div className="border border-gray-300 p-4 rounded text-center">
            <p className="text-xs font-bold uppercase text-gray-600 mb-1">Total Damage Reports</p>
            <p className="text-2xl font-bold">{summary?.totalAssessments || 0}</p>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="mb-8 break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 uppercase tracking-tight">2. Event Details</h2>
        <div className="bg-gray-50 p-4 border border-gray-300 rounded">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <p className="font-bold">Event Name:</p>
            <p>{currentEvent?.event_name || 'N/A'}</p>
            <p className="font-bold">Disaster Type:</p>
            <p>{currentEvent?.disaster_type || 'N/A'}</p>
            <p className="font-bold">Status:</p>
            <p>{currentEvent?.date_ended ? 'Completed' : 'Ongoing'}</p>
            <p className="font-bold">Date Started:</p>
            <p>{currentEvent?.date_started ? new Date(currentEvent.date_started).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Tables Section (formerly Charts) */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <section className="break-inside-avoid">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-3 pb-1 uppercase text-gray-700">3. Damage Distribution</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border border-gray-300">
                <th className="p-2 text-left border border-gray-300">Damage Level</th>
                <th className="p-2 text-right border border-gray-300">Count</th>
                <th className="p-2 text-right border border-gray-300">%</th>
              </tr>
            </thead>
            <tbody>
              {damageData.map((item, idx) => (
                <tr key={idx} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-semibold">{item.damage_level}</td>
                  <td className="p-2 text-right border border-gray-300">{item.count}</td>
                  <td className="p-2 text-right border border-gray-300">
                    {Math.round((parseInt(item.count) / totalDamage) * 100)}%
                  </td>
                </tr>
              ))}
              {damageData.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center italic text-gray-500">No data available</td></tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="break-inside-avoid">
          <h2 className="text-sm font-bold border-b border-gray-300 mb-3 pb-1 uppercase text-gray-700">4. Evacuation Status</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border border-gray-300">
                <th className="p-2 text-left border border-gray-300">Status</th>
                <th className="p-2 text-right border border-gray-300">Count</th>
                <th className="p-2 text-right border border-gray-300">%</th>
              </tr>
            </thead>
            <tbody>
              {evacuationData.map((item, idx) => (
                <tr key={idx} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-semibold">{item.status}</td>
                  <td className="p-2 text-right border border-gray-300">{item.count}</td>
                  <td className="p-2 text-right border border-gray-300">
                    {Math.round((parseInt(item.count) / totalEvacuation) * 100)}%
                  </td>
                </tr>
              ))}
              {evacuationData.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center italic text-gray-500">No data available</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* Detailed Logs Section */}
      <section className="mb-8">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 uppercase tracking-tight">5. Detailed Logs (Summary)</h2>
        
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase text-gray-600 mb-2 italic">A. Structure Assessment Log</h3>
          <table className="w-full text-[10px] border-collapse">
            <thead className="bg-gray-50">
              <tr className="border border-gray-300">
                <th className="p-1.5 text-left border border-gray-300">Address</th>
                <th className="p-1.5 text-left border border-gray-300">Type</th>
                <th className="p-1.5 text-left border border-gray-300">Level</th>
                <th className="p-1.5 text-left border border-gray-300">Zone</th>
                <th className="p-1.5 text-left border border-gray-300">Reporter</th>
              </tr>
            </thead>
            <tbody>
              {damageDetails.slice(0, 15).map((detail, idx) => (
                <tr key={idx} className="border border-gray-300">
                  <td className="p-1.5 border border-gray-300">{detail.address}</td>
                  <td className="p-1.5 border border-gray-300">{detail.structure_type}</td>
                  <td className="p-1.5 border border-gray-300 font-bold">{detail.damage_level}</td>
                  <td className="p-1.5 border border-gray-300">{detail.zone_name}</td>
                  <td className="p-1.5 border border-gray-300">{detail.reporter_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {damageDetails.length > 15 && <p className="text-[9px] italic mt-1 text-gray-500">* Showing first 15 records. Refer to CSV for full dataset.</p>}
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-gray-600 mb-2 italic">B. Evacuation Log</h3>
          <table className="w-full text-[10px] border-collapse">
            <thead className="bg-gray-50">
              <tr className="border border-gray-300">
                <th className="p-1.5 text-left border border-gray-300">Resident Name</th>
                <th className="p-1.5 text-left border border-gray-300">Zone</th>
                <th className="p-1.5 text-right border border-gray-300">Family</th>
                <th className="p-1.5 text-left border border-gray-300">Status</th>
                <th className="p-1.5 text-left border border-gray-300">Arrival</th>
              </tr>
            </thead>
            <tbody>
              {evacuationDetails.slice(0, 15).map((detail, idx) => (
                <tr key={idx} className="border border-gray-300">
                  <td className="p-1.5 border border-gray-300">{detail.resident_name}</td>
                  <td className="p-1.5 border border-gray-300">{detail.zone_name}</td>
                  <td className="p-1.5 text-right border border-gray-300">{detail.family_size}</td>
                  <td className="p-1.5 border border-gray-300 font-bold">{detail.status}</td>
                  <td className="p-1.5 border border-gray-300">{new Date(detail.arrival_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {evacuationDetails.length > 15 && <p className="text-[9px] italic mt-1 text-gray-500">* Showing first 15 records. Refer to CSV for full dataset.</p>}
        </div>
      </section>

      {/* Footer */}
      <div className="fixed bottom-8 left-8 right-8 border-t border-gray-200 pt-4 flex justify-between items-center text-[9px] text-gray-500 uppercase font-bold tracking-widest">
        <p>Generated by AgapaySF Resilience System</p>
        <p>Page 1 of 1</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit changes**

```bash
git add src/components/dashboard/ReportPrintTemplate.jsx
git commit -m "feat: add ReportPrintTemplate component for PDF summary"
```

### Task 2: Integrate into ReportsPage

**Files:**
- Modify: `src/pages/ReportsPage.jsx`

- [ ] **Step 1: Import and mount ReportPrintTemplate**

Import `ReportPrintTemplate` and mount it at the end of the return statement. Add `print:hidden` to the main container.

- [ ] **Step 2: Commit changes**

```bash
git add src/pages/ReportsPage.jsx
git commit -m "feat: integrate ReportPrintTemplate into ReportsPage"
```

### Task 3: Verification

- [ ] **Step 1: Visual Check**
- Visit `/reports`.
- Click "Print PDF Summary".
- Verify the print preview shows the structured template, not the dashboard dashboard UI.
- Verify summary tables and logs are correctly populated and well-arranged.
