/* ARMAR OBJETO LEAD */
const date = new Date();
const [month, day, year] = [
    date.getMonth(),
    date.getDate(),
    date.getFullYear()
];

const [hour, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
];

const fullDate = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
const simpleDate = `${day}-${month}-${year}`;

module.exports = { simpleDate, fullDate };
