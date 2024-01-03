// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const getSheets = require('./lib/sheets');

const spreadsheetId = process.env.SHEET_ID;

module.exports = async function () {
  const googleSheets = await getSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet3!A2:C9999',
  });

  if(getRows.data.values) {
    const winners = getRows.data.values.map(v => {
      return {
        phone: v[0],
        prices: v[1],
      }
    });
    return {winners};
  }

  return {
    error: '还没有人中奖',
    winners: [],
  };
};
