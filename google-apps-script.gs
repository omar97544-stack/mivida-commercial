/**
 * Lead receiver for the Mivida Boulevard landing page.
 * Saves each enquiry as a row in this Google Sheet and (optionally) emails a notification.
 * Setup steps: see README.md.
 */
const NOTIFY_EMAIL = ''; // e.g. 'sales@example.com' - leave empty to skip emails
const SHEET_NAME = 'Leads';
const COLUMNS = ['submitted', 'name', 'phone', 'email', 'unit', 'profile', 'time', 'gclid', 'page', 'id'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const lead = JSON.parse(e.postData.contents);
    if (!lead.name || !lead.phone) return out({ ok: false, error: 'missing fields' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(COLUMNS);

    lead.id = Utilities.getUuid();
    // Prefix with ' so Sheets keeps phone numbers and text as typed and never runs them as formulas.
    sh.appendRow(COLUMNS.map(c => "'" + String(lead[c] || '').slice(0, 300)));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New Mivida lead: ' + lead.name + ' (' + lead.unit + ')',
        COLUMNS.map(c => c + ': ' + (lead[c] || '-')).join('\n'));
    }
    return out({ ok: true, id: lead.id });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
