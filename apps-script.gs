/**
 * Wedding site — Google Apps Script web app.
 * Paste this into the Apps Script editor (Extensions ▸ Apps Script), set the
 * three CONFIG values below, then Deploy ▸ New deployment ▸ Web app
 *   • Execute as: Me
 *   • Who has access: Anyone
 * Copy the /exec URL into content/wedding.ts -> rsvp.endpoint.
 *
 * Handles three things from a single endpoint:
 *   1. RSVP submissions  -> "RSVPs" tab   (one row per party: primary + plus-one)
 *   2. Trivia answers    -> "Trivia" tab  (one row per submission)
 *   3. Plus-one updates  -> writes the typed guest name back onto the guest list
 */

// ===== CONFIG =====
var RSVP_SHEET_ID  = '1T1Cf13M3OFWh5L-jH6oBhCApqj0FGh8VxZDvuLRmzoM'; // RSVP responses — keep PRIVATE
var GUEST_SHEET_ID = '1w0DCumOOjYJoRWMWAlJQpZscgcYg7yemYdGlBLYq0wA'; // Name | Plus one sheet (shared "Anyone with link → Viewer")
var GUEST_TAB      = '';                                             // '' = use the first tab (name doesn't matter)

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // --- 3. Save a typed/updated plus-one name back onto the guest list ---
    if (d.kind === 'plusone') {
      updatePlusOne(d.name, d.plusOne);
      return ok();
    }

    // --- 1. RSVP (one row per party: primary guest + plus-one) ---
    var ss = SpreadsheetApp.openById(RSVP_SHEET_ID);
    var rsvp = ss.getSheetByName('RSVPs') || ss.insertSheet('RSVPs');
    var HEADERS = ['Submitted At', 'Primary guest', 'Primary attending',
                   'Plus-one', 'Plus-one attending', 'Email', 'Dietary', 'Note'];
    setHeader(rsvp, HEADERS); // create or correct the header row so it never drifts
    var guests = d.guests || [];
    var g0 = guests[0] || {};
    var g1 = guests[1] || {};
    rsvp.appendRow([
      d.submittedAt || new Date(),
      g0.name || '',
      g0.attending || '',
      g1.name || '',
      g1.attending || '',
      d.email || '',
      d.dietary || '',
      d.message || ''
    ]);

    // --- 2. Trivia (only if they answered something) ---
    var answers = d.answers || [];
    var answered = answers.some(function (a) { return a && String(a).trim(); });
    if (answered) {
      var triv = ss.getSheetByName('Trivia') || ss.insertSheet('Trivia');
      if (triv.getLastRow() === 0) {
        triv.appendRow(['Timestamp', 'Party'].concat(d.questions || []));
      }
      triv.appendRow([d.submittedAt || new Date(), d.partyName || ''].concat(answers));
    }

    return ok();
  } catch (err) {
    return ContentService.createTextOutput('ERR: ' + err).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Save the typed "Guest" name for an invitee. Writes to column C ("Guest name")
 * and leaves column B as "Guest", so the slot stays editable on a return visit.
 */
function updatePlusOne(name, guestName) {
  if (!name) return;
  var gss = SpreadsheetApp.openById(GUEST_SHEET_ID);
  var sh = (GUEST_TAB && gss.getSheetByName(GUEST_TAB)) || gss.getSheets()[0];
  if (!sh) return;
  if (!sh.getRange(1, 3).getValue()) sh.getRange(1, 3).setValue('Guest name'); // ensure header
  var data = sh.getDataRange().getValues(); // includes the header row
  var target = String(name).trim().toLowerCase();
  for (var r = 1; r < data.length; r++) {   // r=1 skips the header
    if (String(data[r][0]).trim().toLowerCase() === target) {
      sh.getRange(r + 1, 3).setValue(guestName); // column 3 = "Guest name"
      return;
    }
  }
}

/** Ensure row 1 of a sheet matches the expected headers (creates or corrects them). */
function setHeader(sh, headers) {
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }
  var firstRow = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  var matches = headers.every(function (h, i) { return String(firstRow[i]) === h; });
  if (!matches) sh.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function ok() {
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}
