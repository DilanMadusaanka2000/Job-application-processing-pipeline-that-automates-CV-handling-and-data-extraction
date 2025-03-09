const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
    keyFile: './primptopia-354ab9fefed2.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '16zN4IArMtME8E2myOOIBnudhZdAJhFKOy7BTkAcAhxc';

// ✅ Define checkHeaderExists
async function checkHeaderExists() {
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A1:F1' // Check the header range
        });
        const rows = res.data.values;
        if (rows && rows.length > 0) {
            return true; // Header already exists
        }
        return false;
    } catch (error) {
        console.error('Error checking header:', error);
        return false;
    }
}

// ✅ Write data to the sheet
async function writeToSheet(values) {
    const valueInputOption = 'USER_ENTERED';

    try {
        // Check if headers already exist
        const headerExists = await checkHeaderExists();

        // Remove headers if already present
        if (headerExists && values[0][0] === 'Name') {
            values.shift(); // Remove the first row (headers) from the incoming data
        }

        // If headers don’t exist, add them
        if (!headerExists) {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Sheet1!A1',
                valueInputOption,
                insertDataOption: 'INSERT_ROWS',
                resource: { values: [['Name', 'Email', 'Phone', 'Education', 'Qualification', 'Projects', 'CV Link']] }
            });
        }

        // Append the actual data
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption,
            insertDataOption: 'INSERT_ROWS',
            resource: { values }
        });

        return res;
    } catch (error) {
        console.error('Error writing to Google Sheet:', error);
    }
}

module.exports = { writeToSheet, checkHeaderExists };
