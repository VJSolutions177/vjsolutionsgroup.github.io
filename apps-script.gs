// VJ Solutions Google Apps Script Backend
// Sheet tab required: Applications
// Columns: Date | Name | Phone | Email | Domain | Message | Status | Source | Resume URL | Resume File Name

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Applications") || ss.insertSheet("Applications");
  ensureHeaders_(sheet);
  var data = JSON.parse(e.postData.contents || "{}");

  if (data.action === "updateStatus") {
    sheet.getRange(Number(data.row), 7).setValue(data.status);
    return ContentService.createTextOutput("updated");
  }

  var resumeUrl = "";
  if (data.resumeBase64 && data.resumeFileName) {
    var folder = getOrCreateFolder_("VJ Solutions Resumes");
    var bytes = Utilities.base64Decode(data.resumeBase64);
    var blob = Utilities.newBlob(bytes, data.resumeMimeType || "application/octet-stream", data.resumeFileName);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    resumeUrl = file.getUrl();
  }

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.domain || "",
    data.message || "",
    data.status || "Applied",
    data.source || "Website",
    resumeUrl,
    data.resumeFileName || ""
  ]);

  if (data.email) {
    MailApp.sendEmail({
      to: data.email,
      subject: "Application Received - VJ Solutions",
      htmlBody: "Dear " + (data.name || "Candidate") + ",<br><br>Thank you for applying with <b>VJ SOLUTIONS</b>. Our team will contact you shortly.<br><br>Contact/WhatsApp: 7729950118<br><br>Regards,<br>VJ Solutions"
    });
  }

  return ContentService.createTextOutput("success");
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === "list") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Applications");
    if (!sheet) return json_([]);
    var values = sheet.getDataRange().getValues();
    var rows = [];
    for (var i = 1; i < values.length; i++) {
      rows.push({
        row: i + 1,
        date: values[i][0] ? Utilities.formatDate(new Date(values[i][0]), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm") : "",
        name: values[i][1] || "",
        phone: values[i][2] || "",
        email: values[i][3] || "",
        domain: values[i][4] || "",
        message: values[i][5] || "",
        status: values[i][6] || "Applied",
        source: values[i][7] || "",
        resumeUrl: values[i][8] || "",
        resumeFileName: values[i][9] || ""
      });
    }
    return json_(rows.reverse());
  }
  return ContentService.createTextOutput("VJ Solutions backend running");
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Date", "Name", "Phone", "Email", "Domain", "Message", "Status", "Source", "Resume URL", "Resume File Name"]);
  }
}

function getOrCreateFolder_(name) {
  var folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
