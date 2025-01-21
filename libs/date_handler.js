const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

exports.date_handler = {
    get: {
        now: ({ tz = 'Asia/Makassar', date = dayjs() }) => {
            return dayjs(date).tz(tz).format().toString(); // returns current date in specified tz
        },
        dateonly: ( tz = 'Asia/Makassar', date = dayjs() ) => {
            return dayjs(date).tz(tz).format('YYYY-MM-DD').toString(); // returns current date in specified tz
        },
        day: ({ tz = 'Asia/Makassar', as_name = false, date = dayjs() }) => {
            const formattedDate = dayjs(date).tz(tz);
            if (as_name) {
                return formattedDate.format('dddd'); // Returns day name (e.g. 'Monday')
            }
            return formattedDate.date(); // Returns numeric day (e.g. 1, 2, 3,...)
        },

        month: ({ tz = 'Asia/Makassar', as_name = false, date = dayjs() }) => {
            const formattedDate = dayjs(date).tz(tz);
            if (as_name) {
                return formattedDate.format('MMMM'); // Returns full month name (e.g. 'January')
            }
            return formattedDate.month() + 1; // Returns numeric month (1-12)
        },

        year: ({ tz = 'Asia/Makassar', date = dayjs() }) => {
            return dayjs(date).tz(tz).year(); // Returns year (e.g. 2024)
        },

        time: ( tz = 'Asia/Makassar', format = 'HH:mm:ss', date = dayjs() ) => {
            return dayjs(date).tz(tz).format(format); // Returns formatted time (e.g. '14:30:00')
        }
    }
};
