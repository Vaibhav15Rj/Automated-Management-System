function feedback() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = spreadsheet.getSheetByName("Calendly Allocation");
  
  // Get the data range of the source sheet
  var dataRange = sourceSheet.getDataRange();
  var values = dataRange.getValues();
  
  // Calculate today's date
  var today = new Date();
  var todayDate = (today.getDate()).toString().padStart(2, '0');
  var todayMonth =(today.getMonth() + 1).toString().padStart(2, '0');

  todayDate = ""+today.getFullYear()+"-"+todayMonth+"-"+todayDate;
  
  // Loop through each row in the source sheet
  for (var i = 1; i < values.length; i++) { // Start from 1 to skip header row
    var row = values[i];
    var dateValue = row[5].toString(); // Assuming date is in column F (index 5)
    
    // Check if the date in column F is today
    if (dateValue === todayDate) {
      Logger.log([i, "falls on today"]);
      // Check if the row is not already in the target sheet
      var eventTime = row[6].toString();
      var eventHour = parseInt(eventTime.substring(0,2));
      var eventMin = parseInt(eventTime.substring(3));

      var event = row[7].toString();

      var todayHour = parseInt(today.getHours());
      var todayMin = parseInt(today.getMinutes());
      var notification = false;
     
      if (todayHour === eventHour+1) {
        if (eventMin === 15 && todayMin >= 30 && todayMin < 45){
          notification = true;
          Logger.log("This Hour - 15");
        }
        if (eventMin === 30 && todayMin >= 45){
          notification = true;
          Logger.log("This Hour - 30");
        }
        if (eventMin === 00 && todayMin >= 15 && todayMin < 30){
          notification = true;
          Logger.log("This Hour - 45");
        }
      }
      if (todayHour === eventHour+2) {
        if (eventMin === 45 && todayMin < 15){
          notification = true;
          Logger.log("Next Hour - 00");
        }
      }
      if (notification) {
        if (!cancellationCheck(row[8])) {
          // var msg = ""+row[3]+"'s "+ row[7] +" is over. This is just a reminder to execute the next steps!";
          if (event !== "Kick-off Conversation" && event !== "Check In with Turtle") {
            if (event === "Karma Conversation") {
              var result = sendAisensyClientMessages(row[3], row[1], row[7], row[6], row[8], row[4], "Karma Conversation Feedback Message");
            } else if (event === "ITR Filing | Kick-off Conversation") {
              var result = sendAisensyITRPaymentMessages(row[3], row[1]);
            } else {
              var result = sendAisensyClientMessages(row[3], row[1], row[7], row[6], row[8], row[4], "Expert Call Feedback Message");
              sendAisensyExpertAfterCallMessage(row[13], row[3]);
            }
            if (result===null){
              Logger.log(["No Feedback Message triggers", row[3], row[1], row[7], row[6], row[8], row[4]]);
            } else if (result) {
              Logger.log(["Feedback Message triggered for", row[3], row[1], row[7], row[6], row[8], row[4]], "Morning Reminder Message - Clients");
            } else {
              Logger.log(["Feedback Message failed for", row[3], row[1], row[7], row[6], row[8], row[4]], "Morning Reminder Message - Clients");
            }
          }
        }
      }
    }
  }
}

// x:00 - x:45    - x+1:15 - :30
// x:15 - x+1:00  - x+1:30 - :45
// x:30 - x+1:15  - x+1:45 - :00
// x:45 - x+1:30  - x+2:00 - :15
