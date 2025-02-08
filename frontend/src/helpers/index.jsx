export function convertMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedMinutes =
    remainingMinutes < 10 ? `${remainingMinutes}` : remainingMinutes;

  return `${hours} hr ${formattedMinutes} min`;
}

export function formatDateToTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const getDefaultDate = () => {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate;
};

export const getFormattedDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};
