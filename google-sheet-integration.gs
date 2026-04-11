/**
 * Google Apps Script — RAW FITNESS GYM Data Receiver
 * Receives data via GET request URL parameters from the website.
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Replace all existing code with this entire file
 * 3. Click Save (💾)
 * 4. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Authorise if prompted → copy the new Web App URL
 * 6. Paste that URL into google-sheets.js line 1
 * 7. Commit and push to GitHub
 */

const SHEET_ID = '1ejbbCVqty-_EZN9nvGpiRPEkS08A8IfJvjKM-mFl4Gc';

// ── Main entry point (GET request with URL params) ──────────────────────────
function doGet(e) {
  const result = { success: false };

  try {
    const data = e.parameter || {};
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // ── FETCH LIVE DATA FOR ADMIN ──
    if (data.action === 'readAllData') {
      const output = {
        success: true,
        register: getSheetDataAsJson(ss, 'Register'),
        login: getSheetDataAsJson(ss, 'Login'),
        membership: getSheetDataAsJson(ss, 'Membership')
      };
      return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
    }

    if (!data.type) {
      // If no type param, return a simple health-check response
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'RAW FITNESS GYM sheet is live' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    switch (data.type) {
      case 'register':   appendRegisterRow(ss, data);   break;
      case 'login':      appendLoginRow(ss, data);      break;
      case 'membership': appendMembershipRow(ss, data); break;
      default:
        throw new Error('Unknown type: ' + data.type);
    }

    result.success = true;

  } catch (error) {
    result.error = error.message;
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Also handle POST just in case ───────────────────────────────────────────
function doPost(e) {
  return doGet(e);
}

// ── Data Reader Helper ───────────────────────────────────────────────────────

function getSheetDataAsJson(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      // Map sheet headers to consistent JS keys
      let key = h.replace(/ /g, '').replace(/^[A-Z]/, c => c.toLowerCase());
      // Handle the "Received At" header manually or keep as is
      obj[key] = row[i];
    });
    return obj;
  });
}

// ── Row Writers ──────────────────────────────────────────────────────────────

function appendRegisterRow(ss, d) {
  const sheet = getOrCreateSheet(ss, 'Register');
  ensureHeader(sheet, ['Received At', 'Name', 'Email', 'Password', 'Registered At']);
  sheet.appendRow([
    new Date(),
    d.name     || '',
    d.email    || '',
    d.password || '',
    d.createdAt ? new Date(Number(d.createdAt)) : new Date()
  ]);
}

function appendLoginRow(ss, d) {
  const sheet = getOrCreateSheet(ss, 'Login');
  ensureHeader(sheet, ['Received At', 'Email', 'Login Time', 'Status']);
  sheet.appendRow([
    new Date(),
    d.email  || '',
    d.timestamp ? new Date(Number(d.timestamp)) : new Date(),
    d.status || ''
  ]);
}

function appendMembershipRow(ss, d) {
  const sheet = getOrCreateSheet(ss, 'Membership');
  ensureHeader(sheet, [
    'Received At', 'Full Name', 'Email', 'Phone',
    'Blood Group', 'DOB', 'Gender', 'Plan', 'Payment Method', 'Submitted At'
  ]);
  sheet.appendRow([
    new Date(),
    d.fullName      || '',
    d.email         || '',
    d.phone         || '',
    d.bloodGroup    || '',
    d.dob           || '',
    d.gender        || '',
    d.plan          || '',
    d.paymentMethod || 'online',
    d.submittedAt   ? new Date(Number(d.submittedAt)) : new Date()
  ]);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeader(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    const range = sheet.getRange(1, 1, 1, headers.length);
    range.setValues([headers]);
    range.setBackground('#e8192c');
    range.setFontColor('#ffffff');
    range.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
