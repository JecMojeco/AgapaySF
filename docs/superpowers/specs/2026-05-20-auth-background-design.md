# Design Spec: Auth Pages Background Image

Implement a background image for `LoginPage` and `RegisterPage` using a CSS pseudo-element to maintain clean DOM structure and control opacity.

## Architecture

- **Approach**: CSS `::before` pseudo-element on the main container of Auth pages.
- **Image**: `src/assets/background.jpg`.
- **Styling**: Tailwind CSS classes and custom CSS if needed.

## Components

### `LoginPage` & `RegisterPage`
- Add a custom class (e.g., `auth-bg-overlay`) to the root `div`.
- Ensure root `div` is `relative` and `overflow-hidden`.

## Styling Details

```css
/* Proposed CSS addition to index.css */
.auth-bg-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/src/assets/background.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.8; /* 80% opacity as requested */
  z-index: -1;
}
```

## Testing
- Visual verification: Background image should cover the entire viewport behind the login/register forms.
- Opacity check: Form should remain fully opaque and readable while background is dimmed.
- Responsiveness: `background-size: cover` should handle various screen sizes.
