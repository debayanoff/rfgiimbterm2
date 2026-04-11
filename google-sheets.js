const GOOGLE_SHEETS_WEB_APP = 'https://script.google.com/macros/s/AKfycbzP0osl-TkXv2-XgF-fAG9BedH0h0bSOs-2jiOAKpu5pdJiuGpkkZUjd3J-HDiJ25e9/exec';

/**
 * Sends data to Google Sheets using a GET request with URL parameters.
 * GET requests work reliably with Google Apps Script from browsers —
 * no CORS preflight issues, no redirect problems.
 */
function sendGoogleSheetRow(payload) {
  if (!GOOGLE_SHEETS_WEB_APP || GOOGLE_SHEETS_WEB_APP.includes('REPLACE_WITH')) {
    console.warn('Google Sheets URL not configured.');
    return;
  }

  try {
    // Encode all payload fields as URL query parameters
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => params.append(k, v ?? ''));

    const url = GOOGLE_SHEETS_WEB_APP + '?' + params.toString();

    // Use an Image object — most reliable way to fire a cross-origin GET
    // with zero CORS restrictions. Works in all browsers, all environments.
    const img = new Image();
    img.src = url;

    // Also try fetch as backup (works when redirect is allowed)
    fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {});

  } catch (err) {
    console.warn('Google Sheets sync error:', err);
  }
}

/**
 * Fetches all live data from the Google Sheet for the Admin Panel.
 */
async function fetchLiveSheetData() {
  if (!GOOGLE_SHEETS_WEB_APP || GOOGLE_SHEETS_WEB_APP.includes('REPLACE_WITH')) {
    console.warn('Google Sheets URL not configured.');
    return null;
  }

  try {
    const response = await fetch(`${GOOGLE_SHEETS_WEB_APP}?action=readAllData`);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result.success ? result : null;
  } catch (err) {
    console.error('Fetch live data error:', err);
    return null;
  }
}
