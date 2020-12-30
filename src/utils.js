export const stringToDate = str => {
  if (str === '*') {
    return new Date(str);
  }

  const [month, year] = str.split('-');
  return new Date(`${month} 1 20${year}`);
}

export const dateToString = d => {
  if (isNaN(d.valueOf())) {
    return '*';
  }

  const [_, month, __, year] = d.toString().split(' ');
  return `${month.toUpperCase()}-${year.slice(2, 4)}`
}

export const parseCSV = str => {
  let [headers, ...lines] = str.split(';\n');

  headers = headers.split(';');

  return lines.map(line => {
    return line
      .split(';')
      .reduce((acc, value, i) => {
        if (['ACCOUNT', 'DEBIT', 'CREDIT'].includes(headers[i])) {
          acc[headers[i]] = parseInt(value, 10);
        } else if (headers[i] === 'PERIOD') {
          acc[headers[i]] = stringToDate(value);
        } else {
          acc[headers[i]] = value;
        }
        return acc;
      }, {});
  });
}

export const toCSV = arr => {
  let headers = Object.keys(arr[0]).join(';');
  let lines = arr.map(obj => Object.values(obj).join(';'));
  return [headers, ...lines].join(';\n');
}

export const parseUserInput = str => {
  const [
    startAccount, endAccount, startPeriod, endPeriod, format
  ] = str.split(' ');

  return {
    startAccount: parseInt(startAccount, 10),
    endAccount: parseInt(endAccount, 10),
    startPeriod: stringToDate(startPeriod),
    endPeriod: stringToDate(endPeriod),
    format
  };
}
