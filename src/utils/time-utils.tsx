import { CalendarDate, Time } from "@internationalized/date";

export function parseStringToTime(timeString: string): Time {
    const [hour, minute, second] = timeString.split(':').map(Number);
    return new Time(hour, minute, second);
}

export function parseTimeToString(time: Time | string): string {
    if (typeof time === 'string') {
        time = parseStringToTime(time);
    }
    return time.toString().slice(0, 5);
}

export function parseStringToCalendarDate(dateString: string): CalendarDate {
    const [year, month, date] = dateString.split('-').map(Number);
    return new CalendarDate(year, month, date);
}

export function parseCalendarDateToString(date: CalendarDate | string, format: 'long' | 'short'): string {
    if (typeof date === 'string') {
        date = parseStringToCalendarDate(date);
    }
    const dateObj = new Date(date.year, date.month - 1, date.day);
    let formattedDate = '';
    if (format == 'short') {
        formattedDate = dateObj.toLocaleDateString('sv-SE');
    }
    else if (format == 'long') {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        };
        return dateObj.toLocaleDateString('en-ID', options);
    }
    return formattedDate;
}