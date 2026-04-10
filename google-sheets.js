const GOOGLE_SHEETS_WEB_APP = 'https://script.google.com/macros/s/AKfycbxBAz_56hV_8rc_kAXR5bVgIOc9N-XWzSH7IkX5illRfGROHZvsM6of1lMGYrlXp54/exec';

async function sendGoogleSheetRow(payload) {
  if (!GOOGLE_SHEETS_WEB_APP || GOOGLE_SHEETS_WEB_APP.includes('REPLACE_WITH_DEPLOYED_URL')) {
    console.warn('Google Sheets web app URL is not configured.');
    return null;
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_WEB_APP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Google Sheets request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Google Sheets sync failed:', error);
    return null;
  }
}
