function onSheetChange(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  var then = scriptProperties.getProperty('lastRunTime');
  var then2 = scriptProperties.getProperty('lastRunTime2');
  var now = new Date();
  var timeDiff = now.getTime()-then;
  var timeDiff2 = now.getTime()-then2;

  var eSheet = e.source.getActiveSheet();
  var eSheetName = eSheet.getSheetName();

  Logger.log(`The Change: ${e.changeType} | Sheet: ${eSheetName}`);
  Logger.log(`timeDiff: ${timeDiff} | timeDiff2: ${timeDiff2}`);

  if (timeDiff2 < 5000) { // 10000
    Logger.log("Just ran this function");
  } else {
    scriptProperties.setProperty('lastRunTime2', now.getTime());
    Utilities.sleep(2500); // 7999
    checkNewCancellations();
  }

  if (timeDiff < 5000) { // 10000
    Logger.log("Just ran this function");
  } else {
    scriptProperties.setProperty('lastRunTime', now.getTime());
    Utilities.sleep(2500); // 7999
    findNewBooking();
  }
 
  Logger.log("END OF FUNC");
}

function findNewBooking() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = spreadsheet.getSheetByName("Calendly Allocation");

  var dataRange = sourceSheet.getDataRange();
  var values = dataRange.getValues();
  var today = new Date();

  var date = today.getDate().toString().padStart(2, '0');
  var month = (today.getMonth() + 1).toString().padStart(2, '0');
  var year = today.getFullYear();
  today = JSON.stringify(year+"-"+month+"-"+date);

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (row[1]==="") {
      Logger.log("Breaking out from loop");
      break;
    }
    
    if (row[12]==="") {
      Logger.log([i, "There is a new booking"]);
      var formattedDate = formatDate(row[5]);
      if (true) { // eventCreated === today
        Logger.log([i, "This event was created today"]);
        var rescheduleTinyUrl = shorter_URL(row[10]);
        
        var result = sendAisensyBookingMessage(row[3], row[1], row[7], row[10], rescheduleTinyUrl, row[8], row[4], formattedDate, row[6]);
        
        if (result) {
          Logger.log(["Booking Message triggered for", row[3], row[1], row[7], formattedDate, row[6], row[8], row[4]]);
          sourceSheet.getRange(i + 1, 13).setValue("Yes");
        } else {
          Logger.log(["Booking Message failed for", row[3], row[1], row[7], formattedDate, row[6], row[8], row[4]]);
          sourceSheet.getRange(i + 1, 13).setValue("No");
        }

        var autoAllocationStatus = tryAutoExpertAllocation(row[14], row[7]);

        if (autoAllocationStatus) {
          sourceSheet.getRange(i + 1, 14).setValue(autoAllocationStatus);
          Logger.log(`autoAllocationStatus: ${autoAllocationStatus}`);
        }
      }
    }
  }
}

function formatDate(inputDate) {
  // Parse the input date
  var dateObject = new Date(inputDate);

  // Format the date
  var formattedDate = Utilities.formatDate(dateObject, 'GMT', 'EEEE, d MMMM');

  return formattedDate.toString();
}


