// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const getSheets = require('./lib/sheets');

const spreadsheetId = process.env.SHEET_ID;

module.exports = async function () {
  const googleSheets = await getSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet2!A2:C9999',
  });

  if(getRows.data.values) {
    const prices = getRows.data.values.map(v => {
      return {
        name: v[0],
        summary: v[1],
        description: v[2],
      }
    });
    return {prices};
  }

  return {
    error: 'Unknow error.',
  };
};
