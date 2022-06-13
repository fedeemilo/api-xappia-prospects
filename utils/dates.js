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

const correctHour = date.setHours(hour - 3);

const fullDate = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;

const simpleDate = `${day}-${month}-${year}`;

const currentTime = `${correctHour}:${minutes}:${seconds}`;

module.exports = { simpleDate, fullDate, currentTime };
