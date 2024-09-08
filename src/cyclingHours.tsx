const cyclingHoursStart = 7 // 07:00
const cyclingHoursDuration = 14 // 07:00 to 20:00, inclusive
export const cyclingHours = [...Array(cyclingHoursDuration).keys()].map(hour => hour + cyclingHoursStart)
