# Design Spec: PDF Summary Template (CSS Print)

Implement a structured, printable report template using CSS print media queries. This template will remain hidden during normal viewing but will become the sole visible element when printing.

## Architecture

- **Approach**: CSS Print Template (`@media print`).
- **Component**: Create a new `ReportPrintTemplate.jsx` component.
- **Trigger**: The existing "Print Report" button will trigger `window.print()`.
- **Visibility**: 
  - Standard view: Template has `hidden` class.
  - Print view: Template has `print:block`, while standard dashboard has `print:hidden`.

## Components

### `ReportPrintTemplate.jsx`
A structured A4-style layout accepting report data as props.

**Structure:**
1.  **Header**: 
    - Official Barangay/System Logo.
    - Title: "AgapaySF Disaster Response Report".
    - Event Name & Generation Date.
2.  **Executive Summary (Summary Tables)**:
    - Total Residents, Active Evacuations, Damage Reports.
3.  **Damage Assessment (Charts as Tables)**:
    - Summary of Damage Levels (Total, Partial, Minor).
4.  **Evacuation Status (Charts as Tables)**:
    - Summary of statuses (Evacuated, Returned).
5.  **Detailed Logs**:
    - Abbreviated list of recent damage reports.
    - Abbreviated list of recent evacuation logs.

### `ReportsPage.jsx`
- Import and mount `<ReportPrintTemplate />` at the bottom of the page.
- Pass `summary`, `damageData`, `evacuationData`, `damageDetails`, and `evacuationDetails` as props.
- Add `print:hidden` to the main dashboard container.

## Styling Details
- Use Tailwind classes with `print:` prefix where necessary.
- Ensure page breaks are handled (`break-inside-avoid` for tables).
- Typography optimized for print (black and white, readable fonts).

## Testing
- Trigger print dialog.
- Verify dashboard is hidden.
- Verify template is visible, well-structured, and contains accurate data.
- Verify page breaks don't split rows awkwardly.
