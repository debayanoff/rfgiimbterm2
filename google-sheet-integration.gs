/**
 * Google Apps Script to receive form data from the website and write it into a Google Sheet.
 *
 * Deployment:
 * 1. Create a new Google Sheet.
 * 2. Open Extensions → Apps Script.
 * 3. Paste this file.
 * 4. Replace SHEET_ID with your actual spreadsheet ID.
 * 5. Deploy as a web app and set access to Anyone, even anonymous.
 * 6. Use the deployed URL in google-sheets.js.
 */

const SHEET_ID = '1ejbbCVqty-_EZN9nvGpiRPEkS08A8IfJvjKM-mFl4Gc';

function doPost(e) {
  const result = { success: false };
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    if (!payload.type) {
      throw new Error('Missing payload type');
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    switch (payload.type) {
      case 'register':
        appendRegisterRow(ss, payload);
        break;
      case 'login':
        appendLoginRow(ss, payload);
        break;
      case 'membership':
        appendMembershipRow(ss, payload);
        break;
      default:
        throw new Error('Unknown payload type: ' + payload.type);
    }

    result.success = true;
  } catch (error) {
    result.error = error.message;
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function appendRegisterRow(ss, data) {
  const sheet = getOrCreateSheet(ss, 'Register');
  ensureHeader(sheet, ['Name', 'Email', 'Password', 'Registered At']);
  sheet.appendRow([
    data.name || '',
    data.email || '',
    data.password || '',
    data.createdAt ? new Date(data.createdAt) : new Date()
  ]);
}

function appendLoginRow(ss, data) {
  const sheet = getOrCreateSheet(ss, 'Login');
  ensureHeader(sheet, ['Email', 'Timestamp', 'Status']);
  sheet.appendRow([
    data.email || '',
    data.timestamp ? new Date(data.timestamp) : new Date(),
    data.status || ''
  ]);
}

function appendMembershipRow(ss, data) {
  const sheet = getOrCreateSheet(ss, 'Membership');
  ensureHeader(sheet, ['Full Name', 'Email', 'Phone', 'Plan', 'Submitted At']);
  sheet.appendRow([
    data.fullName || '',
    data.email || '',
    data.phone || '',
    data.plan || '',
    data.submittedAt ? new Date(data.submittedAt) : new Date()
  ]);
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeader(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (existing.join('|') !== headers.join('|')) {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }
}
