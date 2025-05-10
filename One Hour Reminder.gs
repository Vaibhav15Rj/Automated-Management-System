function hourBeforeExperts() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = spreadsheet.getSheetByName("Calendly Allocation");
  var checkerSheet = spreadsheet.getSheetByName("Calendly Cancellations");

  var dataRange = sourceSheet.getDataRange();
  var values = dataRange.getValues();
  
  var cancellationData = checkerSheet.getDataRange().getValues().map(row => row[14].toString());

  var today = new Date();
  var todayDate = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, '0') + "-" + today.getDate().toString().padStart(2, '0');

  var eventData = {};
  var scriptProperties = PropertiesService.getScriptProperties();
  
  for (var i = 1; i < values.length; i++) { 
    var row = values[i];
    var dateValue = row[5].toString();
    // Logger.log(todayDate);
    if (dateValue === todayDate && !cancellationData.includes(row[8].toString())) {
      var eventName = row[7]; 
      var eventTime = row[6].toString(); 
         Logger.log(eventName);
      var eventDateTime = parseTimeString(eventTime, todayDate);
      if (!eventDateTime) {
        Logger.log(`Invalid event time format: ${eventTime}`);
        continue;
      }

      var currentDateTime = new Date();
      Logger.log(eventDateTime);
      Logger.log(currentDateTime);
      var timeDifference = (eventDateTime - currentDateTime) / (1000 * 60);
            Logger.log(timeDifference);
      var eventKey = eventName + "_" + eventTime; // Unique key for tracking
      
      if (timeDifference >= 45 && timeDifference <= 75) {
        if (scriptProperties.getProperty(eventKey) !== "Sent") {
          Logger.log([eventName, "One Hour Reminder Message will be triggered for this event"]);
          var newRow = mainOneHourExpert(eventName, [row]);
          sendAisensyExpertMessages(newRow);
          // sendOneHourEmailReminderExpert(newRow);

          // Store the event key so it doesn't trigger again
          scriptProperties.setProperty(eventKey, "Sent");
        }
      }
    }
  }
}


/**
 * Helper function to parse a time string (e.g., "14:30") into a Date object.
 * @param {string} timeString - The time string in 24-hour format (e.g., "14:30").
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @returns {Date|null} - Returns a Date object or null if the time string is invalid.
 */
function parseTimeString(timeString, dateString) {
  // Validate the time string format (e.g., "14:30")
  if (!/^\d{1,2}:\d{2}$/.test(timeString)) {
    return null;
  }

  // Split the time string into hours and minutes
  var [hours, minutes] = timeString.split(':').map(Number);

  // Validate hours and minutes
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  // Create a Date object using the provided date and time
  var dateTimeString = `${dateString}T${timeString}:00`; // ISO 8601 format
  var dateTime = new Date(dateTimeString);

  // Check if the Date object is valid
  if (isNaN(dateTime.getTime())) {
    return null;
  }
  Logger.log(dateTime);
  return dateTime;
}

function mainOneHourExpert(eventName, rows) {
  Logger.log("function 2");
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const expertSheet = spreadsheet.getSheetByName("Sheet1");

  let phoneNumberList = {};
  let eventCall = {};

  // Hardcoded data (fallback)
  const hardcodedPhoneNumberList = {
    "Raj": "9535507833", "Mukund": "9999885624",
    "Krishna Ji": "9922943372", "Anuj Ji": "8437023444", "Robins": "9811031535",
    "Rishabh": "8904440511", "Nikhil": "9982952626", "Rahul": "9953629956",
    "Anunay": "8800628336", "Team": "9900558600", "Nishadh": "9822980957",
    "Siva": "8754224112", "NA": "9999885624", "Shadab": "9930543858",
    "Raj Ahuja": "9535507833"
  };

  const hardcodedEventCall = {
    "Call": ["Raj", "Mukund"],
    "Financial Planning Conversation": ["Krishna Ji", "Robins"],
    "Insurance Advisory Conversation": ["Rishabh", "Anuj Ji", "Shadab"],
    "Tax Planning Conversation": ["Nikhil", "Rahul"],
    "Will Drafting Conversation": ["Anunay", "Team"],
    "Credit Card Advisory Conversation": ["Nishadh"],
    "test call": ["Siva"],
    "unassigned call": ["NA"],
    "First Conversation with Turtle": ["Raj Ahuja"]
  };

  // ✅ Fetch data from the sheet (if available)
  if (expertSheet) {
    const expertValues = expertSheet.getDataRange().getValues();
    // Assuming first row is header, so start from i = 1
    for (let i = 2; i < expertValues.length; i++) {
      const expertName = expertValues[i][3]; // Column C: Expert Name
      const phoneNumber = String(expertValues[i][4]); // Column E: Phone Number
      const callType = expertValues[i][1]; // Column B: Event Name
            Logger.log(callType)
      if (expertName && phoneNumber) {
        phoneNumberList[expertName] = phoneNumber;
        if (eventCall[callType]) {
          eventCall[callType].push(expertName);
        } else {
          eventCall[callType] = [expertName];
        }
      }
    }
  } else {
    // Fallback to hardcoded data if sheet is not found
    phoneNumberList = hardcodedPhoneNumberList;
    eventCall = hardcodedEventCall;
  }

  Logger.log(`PhoneNumberList: ${JSON.stringify(phoneNumberList, null, 2)}`);
  Logger.log(`EventCall: ${JSON.stringify(eventCall, null, 2)}`);

  // Prepare the new row data
  const experts = eventCall[eventName] || ["No Expert Found"];
  const phoneNumbers = experts.map(expert => phoneNumberList[expert] || "No Phone Found").join(', ');
  const clientList = rows.map(row => row[3]).join(', '); // Assuming client name is in column D (index 3)

  const newRow = [
    phoneNumbers, // Phone numbers of experts
    "91", // Country code
    String(experts), // Event name
    clientList, // List of clients
    eventName, // Event type
    rows[0][8], // Event link (assuming it's in column I (index 8))
    rows[0][6] + " IST", // Event time (assuming it's in column G (index 6))
    "campign_one_hour_reminder_expert_msg3"
  ];

  Logger.log(newRow);
  return newRow;
}

// EMAIL REMINDER

function sendOneHourEmailReminderExpert(rowData) {
  var url = 'https://opsturtle.pythonanywhere.com/api/email-reminders/one-hour-reminder-experts';
  
  var payload = {
    "PhoneNumber": String(rowData[0]),
    "CountryCode": String(rowData[1]),
    "ExpertName": String(rowData[2]), // Event name
    "ClientName": String(rowData[3]), // List of clients
    "Event": String(rowData[4]), // Event type
    "EventLink": String(rowData[5]), // Event link
    "EventTime": String(rowData[6]), // Event time
  };

  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload),
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var jsonResponse = JSON.parse(response.getContentText());
    Logger.log(jsonResponse); // Log the response from the server
  } catch (error) {
    Logger.log('Error sending POST request: ' + error.toString());
  }
}
