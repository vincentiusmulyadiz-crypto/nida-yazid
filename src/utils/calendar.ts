import { EventDetail } from '../types';

export function createGoogleCalendarUrl(event: EventDetail): string {
  const { title, description, location, start, end } = event.calendarEvent;
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: title,
    dates: `${start}/${end}`,
    details: `${description}\n\nVenue: ${event.venueName}\nAddress: ${event.address}`,
    location: `${event.venueName}, ${event.address}`,
  });
  return `${baseUrl}&${params.toString()}`;
}

export function downloadIcsFile(event: EventDetail): void {
  const { title, description, location, start, end } = event.calendarEvent;
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Alif and Lakshita Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}\\nVenue: ${event.venueName}`,
    `LOCATION:${location}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
