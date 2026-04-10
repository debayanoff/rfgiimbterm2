const GOOGLE_SHEETS_WEB_APP = 'https://script.google.com/macros/s/AKfycbxBAz_56hV_8rc_kAXR5bVgIOc9N-XWzSH7IkX5illRfGROHZvsM6of1lMGYrlXp54/exec';

/**
 * Sends a row of data to Google Sheets via the deployed Apps Script web app.
 * Uses no-cors + form encoding — required for Google Apps Script from browser.
 */
async function sendGoogleSheetRow(payload) {
  if (!GOOGLE_SHEETS_WEB_APP || GOOGLE_SHEETS_WEB_APP.includes('REPLACE_WITH')) {
    console.warn('Google Sheets URL not configured.');
    return;
  }

  try {
    // Build a URL-encoded form body — Apps Script requires this for no-cors requests
    const formBody = Object.entries(payload)
      .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v ?? ''))
      .join('&');

    // no-cors is required — Apps Script does not send CORS headers for POST
    // Response will be opaque (unreadable) but the data WILL arrive.
    await fetch(GOOGLE_SHEETS_WEB_APP, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody
    });
  } catch (err) {
    console.warn('Google Sheets sync error:', err);
  }
}
