function sendMeetingTranscript() {
  Logger.log("=== Script Execution Started ===");
  
  var dryMode = true; // Change to false to send actual emails
  Logger.log("Dry Mode: " + dryMode);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Calendly Allocation");
  var transcriptSheet = ss.getSheetByName("Email Trans");

  if (!sheet || !transcriptSheet) {
    Logger.log("ERROR: Missing sheet(s). Ensure 'Calendly Allocation' and 'Email Trans' exist.");
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("ERROR: No data found in 'Calendly Allocation'.");
    return;
  }

  var clientEmail = sheet.getRange(lastRow, 5).getValue() || "dummy.client@example.com";  
  var eventName = sheet.getRange(lastRow, 8).getValue();
  var eventDateRaw = sheet.getRange(lastRow, 6).getValue();
  var eventTime = sheet.getRange(lastRow, 7).getValue();
  var advisorEmail = sheet.getRange(lastRow, 15).getValue() || "dummy.advisor@example.com";

  Logger.log(`Client Email: ${clientEmail}, Event Name: ${eventName}, Event Date: ${eventDateRaw}, Event Time: ${eventTime}, Advisor Email: ${advisorEmail}`);

  if (!eventName || !eventDateRaw || !eventTime) {
    Logger.log("ERROR: Missing event details (Name, Date, or Time).");
    return;
  }

  if (eventName.includes("|")) eventName = eventName.split("|")[1].trim();
         
  var eventDate = parseDate(eventDateRaw);
  Logger.log(eventDate);
  if (!eventDate) {
    Logger.log("ERROR: Invalid Event Date format.");
    return;
  }

  var eventDateTime = combineDateTime(eventDate, eventTime);
  if (!eventDateTime) {
    Logger.log("ERROR: Invalid Event Date or Time format.");
    return;
  }

  var transcriptData = transcriptSheet.getDataRange().getValues();
  Logger.log(`Transcript Data Fetched: ${transcriptData.length} rows`);

  var transcriptText = "";
  for (var i = 1; i < transcriptData.length; i++) {
    var transcriptEvent = transcriptData[i][1] || "";
    var transcriptDateRaw = transcriptData[i][5];

    if (transcriptEvent.includes("|")) transcriptEvent = transcriptEvent.split("|")[1].trim();
    
    var transcriptDate = parseDate(transcriptDateRaw);
    if (!transcriptDate) {
      Logger.log(`Skipping row ${i}: Invalid date`);
      continue;
    }

      Logger.log(transcriptEvent);
      Logger.log(eventName);
      Logger.log(transcriptDate.getTime())
      Logger.log(eventDate.getTime());

    if (transcriptEvent === eventName && transcriptDate.getTime() === eventDate.getTime()) {
      transcriptText = `Meeting Summary:\n${transcriptData[i][7]}\n\nAction Items:\n${transcriptData[i][8]}`;
      Logger.log(`Matching Transcript Found at Row ${i}`);
      break;
    }
  }

  if (!transcriptText) {
    Logger.log("ERROR: No transcript found for this meeting.");
    return;
  }

  var subject = `Meeting Transcript: ${eventName}`;
  var body = `Hello,\n\nHere is the transcript for your recent meeting:\n\n${transcriptText}\n\nBest regards,\nYour Team`;

  var sendTime = new Date(eventDateTime.getTime() + 60 * 60 * 1000);
  Logger.log(`Scheduled Email Time: ${sendTime}`);

  if (!dryMode) {
    Logger.log("Scheduling Email Trigger...");
    ScriptApp.newTrigger("sendActualEmail")
      .timeBased()
      .at(sendTime)
      .create();
    Logger.log("Email Trigger Created.");
  } else {
    Logger.log("==== Dry Mode Enabled - Emails will not be sent. ====");
  }

  Logger.log("=== Script Execution Completed ===");
}

function parseDate(rawDate) {
  Logger.log(`Parsing Date: ${rawDate}`);

  if (rawDate instanceof Date) {
    // Logger.log("Date is a Date object.");
    return new Date(rawDate.setHours(0, 0, 0, 0));
  }

  if (typeof rawDate === "string") {
    var formats = ["MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"];
    for (var format of formats) {
      var parsedDate = tryParseDate(rawDate, format);
      if (parsedDate) return parsedDate;
    }
  }

  Logger.log(`ERROR: Invalid Date - ${rawDate}`);
  return null;
}

function tryParseDate(dateStr, format) {
  try {
    var parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : new Date(parsedDate.setHours(0, 0, 0, 0));
  } catch (e) {
    return null;
  }
}

function combineDateTime(date, timeString) {
  Logger.log(`Combining Date and Time | Date: ${date} | Time: ${timeString}`);

  if (typeof timeString !== "string") {
    Logger.log(`ERROR: Invalid Time Format - ${timeString}`);
    return null;
  }

  var timeParts = timeString.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
  if (!timeParts) {
    Logger.log(`ERROR: Invalid Time Format - ${timeString}`);
    return null;
  }

  var hours = parseInt(timeParts[1], 10);
  var minutes = parseInt(timeParts[2], 10);
  var ampm = timeParts[3] ? timeParts[3].toUpperCase() : null;

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  var eventDateTime = new Date(date);
  eventDateTime.setHours(hours, minutes, 0, 0);

  Logger.log(`Combined Event DateTime: ${eventDateTime}`);
  return eventDateTime;
}
