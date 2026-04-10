# Google Sheets Live Integration Setup

This project includes a live Google Sheets integration for `register.html`, `login.html`, and `membership.html`.

## What is included
- `google-sheets.js` — front-end helper that sends data to your Google Apps Script web app.
- `google-sheet-integration.gs` — Apps Script code to paste into a new Google Sheet project.

## Steps to enable live syncing

1. Open the existing Google Sheet at your provided link.
2. Open the sheet and go to `Extensions` → `Apps Script`.
3. Replace any starter code with the contents of `google-sheet-integration.gs`.
4. The sheet ID is already set in `google-sheet-integration.gs` to `1ejbbCVqty-_EZN9nvGpiRPEkS08A8IfJvjKM-mFl4Gc`.
5. Save the Apps Script project.
6. Deploy it as a web app:
   - Click `Deploy` → `New deployment`.
   - Select `Web app`.
   - Under `Who has access`, choose `Anyone` or `Anyone with the link`.
   - Deploy and copy the `Web app` URL.
7. Open `google-sheets.js` and replace `REPLACE_WITH_DEPLOYED_URL` with your deployed URL.
8. Save all files and upload/deploy your website.

## How it works
- Registration forms send a POST request with `type: 'register'`.
- Login attempts send a POST request with `type: 'login'`.
- Membership submissions send a POST request with `type: 'membership'`.

Each payload is appended to the matching worksheet tab in your Google Sheet.

## Notes
- This is a demo integration. Storing plain text passwords in a sheet is not secure for production.
- For production, use secure authentication and hash passwords on the server.
