const NOTION_API_KEY = 'secret_wjneIMpKRICvB4o9TDLkQbr68ATLxSaTGDD6beWD6gR';

function processClients() {
  Logger.log("Processing Clients...");

  const mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Notion Turtle client');
  const referenceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendly Allocation');

  if (!mainSheet || !referenceSheet) {
    Logger.log('Error: One or both sheets not found.');
    return;
  }

  const mainData = mainSheet.getDataRange().getValues().slice(1); // Skip header row
  const referenceData = referenceSheet.getDataRange().getValues();

  // Create a mapping of Email -> Bio
  let bioMap = {};

  mainData.forEach(([ , , , email, , , notionPageId]) => {
    Logger.log(email);
    Logger.log(notionPageId);
    if (!notionPageId || notionPageId.toUpperCase() === 'NA') return;

    let bioData = fetchBioFromNotion(notionPageId);
    if (bioData) {
      bioMap[email.trim()] = bioData;
    }
  });

  if (Object.keys(bioMap).length === 0) {
    Logger.log('No valid bios found.');
    return;
  }

  // Find "Email" column index in referenceData
  const headerRow = referenceData[0];
  const emailIndex = headerRow.indexOf('Email');
  let bioIndex = headerRow.indexOf('Bio');

  // If "Bio" column does not exist, add it
  if (bioIndex === -1) {
    referenceSheet.getRange(1, headerRow.length + 1).setValue('Bio');
    bioIndex = headerRow.length;
  }
Logger.log("updating of bio sheet start");
  // Update Bio column in referenceSheet based on Email match
  let updatedRows = [];
  for (let i = 1; i < referenceData.length; i++) {
    let row = referenceData[i];
    let email = row[emailIndex]?.trim();

    if (bioMap[email]) {
      updatedRows.push([bioMap[email]]);
    } else {
      updatedRows.push([row[bioIndex] || ""]);
    }
  }

  // Write the updated Bio column back to referenceSheet
  if (updatedRows.length > 0) {
    referenceSheet.getRange(2, bioIndex + 1, updatedRows.length, 1).setValues(updatedRows);
    Logger.log('Bio column updated successfully.');
  }
}

function fetchBioFromNotion(pageId) {
  Logger.log(`Fetching Bio for Notion Page ID: ${pageId}`);
const NOTION_API_KEY = 'secret_wjneIMpKRICvB4o9TDLkQbr68ATLxSaTGDD6beWD6gR';
  try {
    const response = UrlFetchApp.fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });

    const blocks = JSON.parse(response.getContentText()).results;
    if (!blocks?.length) return null;

    const bioContent = blocks
      .filter(block => block.type === 'paragraph' && block.paragraph.rich_text.length)
      .map(block => block.paragraph.rich_text.map(text => text.text.content).join(' '))
      .join('\n');

    return bioContent.replace(/^Bio:\s*/, '').trim() || null;
  } catch (e) {
    Logger.log(`Error fetching Notion bio for pageId ${pageId}: ${e.message}`);
    return null;
  }
}
