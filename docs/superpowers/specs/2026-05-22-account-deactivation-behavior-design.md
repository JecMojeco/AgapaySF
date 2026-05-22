# Design Spec: Account Deactivation Behavior

**Goal:** Implement a robust mechanism to handle account deactivation, including real-time session invalidation, graceful redirection, and strict login blocking.

**Architecture:**
- **Backend Middleware:** Update `server/middleware/authMiddleware.js` to verify user status in the database on every protected request.
- **Frontend Auth Context:** Update `src/context/AuthContext.jsx` to handle session invalidation and global redirection when the backend returns 401/403/404.
- **Backend Controller:** Ensure `authController.js` login logic provides the correct error message for inactive users.

**Implementation Details:**

1. **`server/middleware/authMiddleware.js`**
   - Modify `requireAuth` to query the `USER` table for the current `user_id`.
   - If user not found or status is `INACTIVE`, destroy the session and return 401.
   
2. **`src/context/AuthContext.jsx`**
   - Update `checkSession` to clear local storage and set user to `null` if the API call fails.
   - (Optional but recommended) Add an interceptor or check to handle mid-session deactivations on any API call. For now, the next navigation or `/auth/me` check will catch it.

3. **`server/controllers/authController.js`**
   - Update the error message for `user.status === 'INACTIVE'` to match the requirement: "Your account has been deactivated. Please contact the administrator."

**Success Criteria:**
- Admin deactivates user → User's next protected request fails → User is redirected to login.
- Inactive user attempts login → Access blocked with custom message.
- Session is cleared on both frontend and backend upon deactivation detection.
