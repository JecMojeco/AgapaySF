# Design Spec: Logo and Favicon Replacement

Centralize branding by creating a reusable `Logo` component and updating the system favicon.

## Architecture

- **Reusable Component**: Create `Logo.jsx` to encapsulate the logo image and styling.
- **Favicon Update**: Replace the existing generic favicon with the new `favicon.svg`.

## Components

### `Logo` Component (`src/components/ui/Logo.jsx`)
- Renders `AgapaySF.svg`.
- Accepts `className` for sizing.
- Default size optimized for Navbar.

### `Navbar` (`src/components/layout/Navbar.jsx`)
- Remove generic CSS-based logo ("A" square).
- Remove text "AgapaySF" (or keep next to logo if desired - will replace both for clean look).
- Insert `<Logo className="h-8" />`.

### `LoginForm` & `RegisterForm`
- Import `Logo`.
- Insert `<Logo className="h-16 mx-auto mb-2" />` above the `CardTitle` in `CardHeader`.

## Assets
- Copy `src/assets/favicon.svg` to `public/favicon.svg`.

## Testing
- Visual verification: Logo should appear correctly in Navbar and above Auth forms.
- Favicon check: Browser tab should show the new AgapaySF favicon.
- Responsiveness: Logo should scale or stay appropriately sized on mobile.
