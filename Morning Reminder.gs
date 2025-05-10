//Hi this is VRJ created by me
function morningMsgExpert() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = spreadsheet.getSheetByName("Calendly Allocation");
  const checkerSheet = spreadsheet.getSheetByName("Calendly Cancellations");

  const values = sourceSheet.getDataRange().getValues();
  const cancellationData = checkerSheet.getDataRange().getValues().map(row => row[14].toString());

  let clientList = [];
  let eventList = [];

  var today = new Date();
  var currentDate = today.getDate().toString().padStart(2, '0');
  var currentMonth = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-11
  var currentYear = today.getFullYear().toString();
  
  var todayDate = "" + currentYear + "-" + currentMonth + "-" + currentDate;

  for (var i = 1; i < values.length; i++) { 
    var row = values[i];
    var dateValue = row[5];  // Assuming date is in column 6 (0-indexed)
    
    if (dateValue === todayDate) {

      var eventTime = row[6].toString();
      var eventHour = parseInt(eventTime.substring(0,2));

      if (eventHour<9) {
        Logger.log("Event is before 9 am");
        continue;
      }
      
      if (!cancellationData.includes(row[8].toString())) {  // Replace with your own logic for checking cancellation
        clientList.push(row);
        eventList.push(row[7]); // Assuming event name is in column 8 (0-indexed)
        Logger.log([i , 'Morning Message will be triggered for this event']);
      }
    }
  }

  eventList = [...new Set(eventList)]; // Remove duplicates
  const eventData = createEventDict(clientList, eventList); // Create dictionary with event names as keys
  const newRowData = mainMorningExpert(eventData); // Process data based on event names

  newRowData.forEach(newData => sendAisensyExpertMessages(newData));
  newRowData.forEach(newData => sendMorningEmailReminderExpert(newData)); // Trigger POST request after appending the row
}

// Create a dictionary with event names as keys
function createEventDict(clientList, eventList) {
  const eventData = Object.fromEntries(eventList.map(event => [event, []])); // Initialize with empty arrays

  clientList.forEach(client => {
    eventData[client[7]].push(client); // Assuming event name is in column 8 (0-indexed)
  });

  Logger.log(eventData);
  return eventData;
}

function mainMorningExpert(eventData) {
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
      const expertName = expertValues[i][3];      // Column C: Expert Name
      const phoneNumber = String(expertValues[i][4]);     // Column E: Phone Number
      const callType = expertValues[i][1];        // Column B: Event Name (or any other source for call type)

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

  const currentDate = getCurrentDate();
  Logger.log(`PhoneNumberList: ${JSON.stringify(phoneNumberList, null, 2)}`);
  Logger.log(`EventCall: ${JSON.stringify(eventCall, null, 2)}`);
      
  // ✅ Process eventData
  const newRowData = Object.entries(eventData).map(([eventName, rows]) => {
    const sortedRows = rows.sort((a, b) => {
      const timeA = a[6].split(':').map(Number);
      const timeB = b[6].split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

    const callList = sortedRows
      .map((row, i) => `${i + 1}) ${row[3]} at ${row[6]} IST`)
      .join(', ');

    const noOfCalls = rows.length;
    const experts = eventCall[eventName] || ["No Expert Found"];
    const phoneNumbers = experts.map(expert => phoneNumberList[expert] || "No Phone Found").join(', ');

    return [
      phoneNumbers, "91", String(experts), noOfCalls.toString(),
      callList, eventName, currentDate, "morning_msg_expert_2"
    ];
  });

  Logger.log(["newRowData", newRowData]);
  return newRowData;
}


function getCurrentDate() {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const dayOfMonth = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  
  // Function to add "st," "nd," "rd," or "th" to the day of the month
  function getDayWithSuffix(day) {
    if (day >= 4) {
      return day + "th";
    }
    else if (day === 1) {
      return day + "st";
    }
    else if (day === 2) {
      return day + "nd";
    }
    else if (day === 3) {
      return day + "rd";
    }
  }
  
  const dayWithSuffix = getDayWithSuffix(dayOfMonth);
  
  return `${dayOfWeek}, ${dayWithSuffix} ${month}`;
}


// EMAIL REMINDER

function sendMorningEmailReminderExpert(rowData) {
  var url = 'https://opsturtle.pythonanywhere.com/api/email-reminders/morning-reminder-experts';
  
  // Reformat the payload to match the backend's expected structure
  var payload = {};
  var eventName = String(rowData[5]); // Event name
  payload[eventName] = {
    "experts": String(rowData[2]).split(','), // Convert comma-separated string to array
    "call_list": String(rowData[4]), // Call list
    "today": String(rowData[6]) // Current date
  };

Logger.log(payload);
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() === 200) {
      var jsonResponse = JSON.parse(response.getContentText());
      Logger.log(jsonResponse); // Log the response from the server
    } else {
      Logger.log('Error: Received response code ' + response.getResponseCode());
    }
  } catch (error) {
    Logger.log('Error sending POST request: ' + error.toString());
  }
}
