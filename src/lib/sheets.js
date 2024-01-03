const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './lib/credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

// Instance of Google Sheets API
module.exports = async function getSheets() {
  // Create client instance for auth
  const client = await auth.getClient();
  return google.sheets({version: 'v4', auth: client});
}