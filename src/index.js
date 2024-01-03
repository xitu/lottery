// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const getSheets = require('./lib/sheets');
const getPrices = require('./prices');
const getWinners = require('./winners');

const spreadsheetId = process.env.SHEET_ID;

async function getPriceByType(type) {
  const prices = (await getPrices()).prices;
  return prices.filter(p => p.name === type)[0];
}

function pick(candidates, winners, count) {
  const avaliableCandidates = candidates.filter(c => {
    return winners.filter((w) => w.phone !== c.phone)
  });
  // console.log(avaliableCandidates);
  const picked = [];
  for(let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * avaliableCandidates.length);
    [avaliableCandidates[idx], avaliableCandidates[avaliableCandidates.length - 1]]
    = [avaliableCandidates[avaliableCandidates.length - 1], avaliableCandidates[idx]];
    picked.push(avaliableCandidates.pop());
    if(avaliableCandidates.length <= 0) break;
  }
  return picked;
}

module.exports = async function (params, context) {
  const {type, count} = params;

  const price = await getPriceByType(type);
  if(!price) {
    return {
      error: '没有这个奖项',
    }
  }

  // Read rows from spreadsheet
  const googleSheets = await getSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A2:B9999',
  });

  if(getRows.data.values) {
    const candidates = getRows.data.values.map(v => {
      return {
        phone: v[0],
      };
    });
    const winners = (await getWinners()).winners;
    const lottery = pick(candidates, winners, count).map((l) => {
      return {
        ...l,
        price,
      };
    });

    const result = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet3!A2:D9999',
      valueInputOption: "USER_ENTERED", // RAW | USER_ENTERED
      resource: {
        values: lottery.map(l => [l.phone, l.price.name, l.price.summary]),
      },
    });
    return {winners: lottery};
  }
  
  return {
    error: 'Unknow error.',
  };
};
