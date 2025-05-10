function sendWhatsAppMessages() {
  const dryRun = true; // ✅ DRY RUN MODE
  Logger.log("Entering function process clients");
processClients();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const worldSheet = ss.getSheetByName("Sheet1");
  const calendlySheet = ss.getSheetByName("Calendly Allocation");

  // ✅ CREATE "Map" SHEET IF MISSING
  let mapSheet = ss.getSheetByName("Map");
  if (!mapSheet) {
    mapSheet = ss.insertSheet("Map");
    mapSheet.appendRow(["AdvisorEmail", "ClientEmail", "Date", "Time", "UniqueKey", "Timestamp"]);
  }

  const worldData = worldSheet.getDataRange().getValues();
  const calendlyData = calendlySheet.getDataRange().getValues();
  const mapData = mapSheet.getDataRange().getValues().slice(1); // Exclude header

  Logger.log("Checking Calendly Allocation sheet");

  // ✅ Store existing unique keys in a Set for fast lookups
  const existingKeys = new Set(mapData.map(row => row[4])); 

  const newRows = []; // Buffer for batch appending

  for (let i = 1; i < calendlyData.length; i++) {
    const row = calendlyData[i];
    const clientPhone =  row[1]; // Phone number
    const clientEmail = row[4];
    const clientName = row[3];
    const event = row[7];
    const date = row[5];
    const time = row[6];
    const expertSalutation = row[13];
    const clientbio = row[15];

    // Find advisor
    let advisorEmail = "";
    let advisorPhone = "";
    let advisorName = "";
    let advisorBio = "";

    Logger.log("Searching for expert in  sheet 1...");
    for (let j = 2; j < worldData.length; j++) {
      if (worldData[j][3] === expertSalutation) {
        advisorEmail = worldData[j][5];  // Email
        advisorPhone =  worldData[j][4]; // Phone
        advisorName = worldData[j][2];   // Name
        advisorBio = worldData[j][7];    // Bio
        break;
      }
    }

    Logger.log(`Advisor Found: ${advisorName} (${advisorEmail})`);
    
    if (!advisorEmail || !clientEmail || !advisorName ) continue;

    // ✅ CREATE A UNIQUE KEY
    const uniqueKey = `${advisorEmail}|${clientEmail}`;

    // ✅ CHECK FOR DUPLICATES USING THE SET
    if (existingKeys.has(uniqueKey)) continue;

    // Format messages
    const clientMessage = `Hi ${clientName}, your upcoming session is with ${advisorName}. Here's a bit about them:\n${advisorBio}`;
    const advisorMessage = `Hi ${advisorName},\nYou're scheduled for a ${event} with:\nName: ${clientName}\nPhone: ${row[1]}\nEmail: ${clientEmail}\nDate & Time: ${date} ${time}  Here's a bit about them:\n${clientbio}`;

    if (dryRun) {
      Logger.log("DRY RUN: Would send to client " + clientPhone + ": " + clientMessage);
      Logger.log("DRY RUN: Would send to advisor " + advisorPhone + ": " + advisorMessage);
    } else {
      sendToAiSensy(clientName, clientPhone, "+91", advisorBio, advisorName);           //clientphone
      sendViaSensy(advisorName, advisorPhone, "+91", clientbio, clientName,date,time);    //advisorphone
    }

    // ✅ ADD NEW ENTRY TO BUFFER INSTEAD OF IMMEDIATE appendRow() 
    newRows.push([advisorEmail, clientEmail, date, time, uniqueKey, new Date()]);
    existingKeys.add(uniqueKey); // Add to Set immediately to prevent duplicate checks in this run
  }

  // ✅ BATCH WRITE TO "MAP" SHEET (MUCH FASTER THAN appendRow)
  if (newRows.length > 0) {
    mapSheet.getRange(mapSheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }
}






function sendToAiSensy(assignedClients, phoneNumber, countryCode, bio, advisorName) {
  Logger.log("function 4");
  Logger.log(assignedClients);
  Logger.log(phoneNumber);
  Logger.log(bio);

  var api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NmRjZjM5ODNkM2Y3NTE5MWE0MjNjOSIsIm5hbWUiOiJUdXJ0bGUgRmluYW5jaWFsIEFkdmlzb3JzIExMUCIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NTZkY2YzOTgzZDNmNzUxOTFhNDIzYzQiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcwMTY5NTI4OX0.Y2GRCcovQJozad8LycQO13qBlXN7HvdVGvIPYciR0DM";
  var destination_number = String(countryCode) + String(phoneNumber);
  Logger.log(["Formatted Phone Number:", destination_number]);

  var user_name = assignedClients;
  var bio = bio.replace(/(\n|\t)/g, " ").replace(/\s{5,}/g, " ");
  var campaign_name = "campign_advisor_bio_sharing_to_client_2";
  var template_params = [advisorName, assignedClients, advisorName, bio]; 
  var tags = [];
  var attributes = { "ClientName": assignedClients, "BIO": bio };

  var url = "https://backend.aisensy.com/campaign/t1/api/v2";

  var aisensyPayload = {
    "apiKey": api_key,
    "campaignName": campaign_name,
    "destination": destination_number,
    "userName": user_name,
    "templateParams": template_params,
    "tags": tags,
    "attributes": attributes
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(aisensyPayload)
  };

  var scriptProperties = PropertiesService.getScriptProperties();
  var scriptID = String(phoneNumber);
  var lastSentTime = scriptProperties.getProperty(scriptID);
  var now = new Date().getTime();

  var minDelay = 15000; // 15 seconds between messages to avoid spam (adjust as needed)
  
  if (lastSentTime) {
    var timeDiff = now - parseInt(lastSentTime);
    if (timeDiff < minDelay) {
      var waitTime = minDelay - timeDiff;
      Logger.log(`Rate limiting: Waiting ${waitTime}ms before sending the message to ${phoneNumber}`);
      Utilities.sleep(waitTime); // Pause execution to prevent spam
    }
  }

  scriptProperties.setProperty(scriptID, now.toString());

  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    if (responseCode === 200) {
      Logger.log("API request successful.");
    } else {
      Logger.log(`API failed from AiSensy server. Received Code: ${responseCode}`);
    }
    return true;
  } catch (e) {
    Logger.log("Error in API request: " + e);
    return false;
  }
}


function sendViaSensy(advisorName, phoneNumber, countryCode, bio, clientName,date,time) {
  Logger.log("function 5");
  Logger.log(clientName);
  Logger.log(phoneNumber);
  Logger.log(bio);

  var api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NmRjZjM5ODNkM2Y3NTE5MWE0MjNjOSIsIm5hbWUiOiJUdXJ0bGUgRmluYW5jaWFsIEFkdmlzb3JzIExMUCIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NTZkY2YzOTgzZDNmNzUxOTFhNDIzYzQiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcwMTY5NTI4OX0.Y2GRCcovQJozad8LycQO13qBlXN7HvdVGvIPYciR0DM";
  var destination_number = String(countryCode) + String(phoneNumber);
  Logger.log(["Formatted Phone Number:", destination_number]);

  var user_name = clientName;
  var parts = bio.split("\n");

    var biodetail = parts[0]?.trim() || "";
    var address = parts[1]?.trim() || "";
    var linkedin = parts[2]?.replace(/LinkedIn:\s*/i, "").trim() || "";

  var campaign_name = "campign_client_bio_sharing_to_advisor";
  var template_params = [advisorName, clientName,date,time,biodetail,address,linkedin]; 
  var tags = [];
  var attributes = { "ClientName": clientName, "BIO": bio };

  var url = "https://backend.aisensy.com/campaign/t1/api/v2";

  var aisensyPayload = {
    "apiKey": api_key,
    "campaignName": campaign_name,
    "destination": destination_number,
    "userName": user_name,
    "templateParams": template_params,
    "tags": tags,
    "attributes": attributes
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(aisensyPayload)
  };

  var scriptProperties = PropertiesService.getScriptProperties();
  var scriptID = String(phoneNumber);
  var lastSentTime = scriptProperties.getProperty(scriptID);
  var now = new Date().getTime();

  var minDelay = 15000; // 15 seconds between messages to avoid spam (adjust as needed)
  
  if (lastSentTime) {
    var timeDiff = now - parseInt(lastSentTime);
    if (timeDiff < minDelay) {
      var waitTime = minDelay - timeDiff;
      Logger.log(`Rate limiting: Waiting ${waitTime}ms before sending the message to ${phoneNumber}`);
      Utilities.sleep(waitTime); // Pause execution to prevent spam
    }
  }

  scriptProperties.setProperty(scriptID, now.toString());

  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    if (responseCode === 200) {
      Logger.log("API request successful.");
    } else {
      Logger.log(`API failed from AiSensy server. Received Code: ${responseCode}`);
    }
    return true;
  } catch (e) {
    Logger.log("Error in API request: " + e);
    return false;
  }
}
