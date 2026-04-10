/**
 * Google Apps Script — RAW FITNESS GYM Data Receiver
 * Handles POST requests from the website and writes rows into Google Sheets.
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Replace all code with this file
 * 3. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into google-sheets.js
 */

const SHEET_ID = '1ejbbCVqty-_EZN9nvGpiRPEkS08A8IfJvjKM-mFl4Gc';

function doGet(e) {
  // Allow GET requests too (some browsers send preflight as GET)
  return doPost(e);
}

function doPost(e) {
  const result = { success: false };

  try {
    let payload = {};

    // Try parsing as JSON first, then fall back to form parameters
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (_) {
        // Not JSON — parse as URL-encoded form data
        payload = parseFormData(e.postData.contents);
      }
    } else if (e.parameter) {
      // GET or form params
      payload = e.parameter;
    }

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
        throw new Error('Unknown type: ' + payload.type);
    }

    result.success = true;

  } catch (error) {
    result.error = error.message;
  }

  // Return with permissive CORS headers
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Parsers ──────────────────────────────────────────

function parseFormData(body) {
  const result = {};
  body.split('&').forEach(pair => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    result[key] = value;
  });
  return result;
}

// ── Row Writers ──────────────────────────────────────

function appendRegisterRow(ss, data) {
  const sheet = getOrCreateSheet(ss, 'Register');
  ensureHeader(sheet, ['Timestamp', 'Name', 'Email', 'Password', 'Registered At']);
  sheet.appendRow([
    new Date(),
    data.name    || '',
    data.email   || '',
    data.password || '',
    data.createdAt ? new Date(Number(data.createdAt)) : new Date()
  ]);
}

function appendLoginRow(ss, data) {
  const sheet = getOrCreateSheet(ss, 'Login');
  ensureHeader(sheet, ['Timestamp', 'Email', 'Login Time', 'Status']);
  sheet.appendRow([
    new Date(),
    data.email   || '',
    data.timestamp ? new Date(Number(data.timestamp)) : new Date(),
    data.status  || ''
  ]);
}

function appendMembershipRow(ss, data) {
  const sheet = getOrCreateSheet(ss, 'Membership');
  ensureHeader(sheet, ['Timestamp', 'Full Name', 'Email', 'Phone', 'Blood Group', 'DOB', 'Gender', 'Plan', 'Payment Method', 'Submitted At']);
  sheet.appendRow([
    new Date(),
    data.fullName      || '',
    data.email         || '',
    data.phone         || '',
    data.bloodGroup    || '',
    data.dob           || '',
    data.gender        || '',
    data.plan          || '',
    data.paymentMethod || 'online',
    data.submittedAt ? new Date(Number(data.submittedAt)) : new Date()
  ]);
}

// ── Helpers ───────────────────────────────────────────

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeader(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#e8192c');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
  }
}
