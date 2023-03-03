export const formatDuration = (duration: number): string => {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  }).format(new Date(Math.round(duration) * 1000));
};
