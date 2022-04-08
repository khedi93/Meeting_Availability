const moment = require("moment");

function momentInitial(timeString) {
  return moment(timeString).parseZone()._i;
}

export const findFreeTimes = (start, end, duration, events) => {
  const outputIntervals = [];
  const eventsInSetInterval = [];
  const durationInMillisecs = moment.duration(duration, "minutes").as('milliseconds');

  for (let i = 0; i < events.length; i++) {
    let eventStart = events[i].start;
    let eventEnd = events[i].end;

    if (moment(eventStart).isAfter(start) && moment(eventStart).isBefore(end)) {
      let event = { start: eventStart, end: eventEnd };
      eventsInSetInterval.push(event);
    }
  }

  let previousEnd;

  for (let i = 0; i < eventsInSetInterval.length; i++) {
    let eventStart = eventsInSetInterval[i].start;
    let eventEnd = eventsInSetInterval[i].end;

    if (i === 0 && (moment(eventStart).diff(start) > durationInMillisecs)) {
      outputIntervals.push({ start: momentInitial(start), end: eventStart });
      previousEnd = eventEnd;
    } else if (i !== 0 && ((moment(eventStart).diff(moment(previousEnd)) > durationInMillisecs))) {
      outputIntervals.push({ start: momentInitial(previousEnd), end: eventStart });
      previousEnd = eventEnd;
    } else {
      previousEnd = eventEnd;
    }
  }

  if (end.diff(moment(previousEnd)) > durationInMillisecs) {
    outputIntervals.push({ start: momentInitial(previousEnd), end: momentInitial(end) });
  }

  return outputIntervals;
}