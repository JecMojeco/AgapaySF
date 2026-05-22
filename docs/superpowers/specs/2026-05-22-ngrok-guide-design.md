# Design Spec: Ngrok URL Update Guide

**Date:** 2026-05-22  
**Topic:** Ngrok Guide  
**Status:** Approved

## 1. Overview
Ngrok URLs in the free tier reset whenever the process is restarted or the PC is shut down. This project uses ngrok to expose the local server for mobile testing. Currently, the ngrok URL is hardcoded in `server/server.js` and `vite.config.js`. This guide will document the process for updating these links manually.

## 2. Goals
- Provide a clear, step-by-step guide for developers to update the ngrok URL.
- Ensure the system remains accessible via mobile devices after an ngrok reset.
- Educate the team on ngrok's static domain feature to minimize future resets.

## 3. Proposed Changes (README.md)

### New Section: "Updating Ngrok URL"
This section will be added under a new main heading or as a subsection of "Usage".

#### Contents:
1. **Introduction:** Explain that ngrok URLs change on restart.
2. **Step 1: Get New URL:**
   - Command: `ngrok http 5173` (or the appropriate command used by the team).
3. **Step 2: Update Backend CORS:**
   - File: `server/server.js`
   - Action: Update the `origin` array with the new `https://...ngrok-free.dev` URL.
4. **Step 3: Update Frontend Vite Config:**
   - File: `vite.config.js`
   - Action: Update `allowedHosts` with the new domain.
5. **Optimization Tip:** Mention the "Static Domain" feature in ngrok's dashboard to get a permanent URL for free.

## 4. Technical Details
- **Affected Files:**
  - `README.md` (Target for the guide)
  - `server/server.js` (Reference for the guide)
  - `vite.config.js` (Reference for the guide)
- **Consistency:** Ensure the guide matches the current implementation (e.g., using `allowedHosts` in Vite).

## 5. Success Criteria
- A developer can successfully update the ngrok link by following the `README.md` instructions.
- The instructions are accurate and easy to follow.
