export function hoursToSeconds(hours: number): number {
  const secondsPerHour = 3600; // 60 seconds/minute * 60 minutes/hour

  const seconds = hours * secondsPerHour;
  return seconds;
}
