export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info'): void => {
  const timestamp = new Date().toLocaleString();

  switch (level.toLowerCase()) {
    case 'info':
      console.log(`[${timestamp}] \x1b[32m[INFO]\x1b[0m ${message}`);
      break;
    case 'warning':
      console.warn(`[${timestamp}] \x1b[33m[WARNING]\x1b[0m ${message}`);
      break;
    case 'error':
      console.error(`[${timestamp}] \x1b[31m[ERROR]\x1b[0m ${message}`);
      break;
    default:
      console.log(`[${timestamp}] ${message}`);
  }
};

export const formatDate = (date: Date, showHour: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: showHour ? '2-digit' : undefined,
    minute: showHour ? '2-digit' : undefined,
    second: showHour ? '2-digit' : undefined,
    hour12: false,
  };

  return date.toLocaleString('es-AR', options).replace(/, /, ' ');
};

export const addTimeToDateString = (date: string) => {
  // Get the current date and time
  const currentDatetime = new Date();

  // Format the time as HH:mm:ss
  const formattedTime = currentDatetime.toTimeString().slice(0, 8);

  // Combine the date and time
  const extendedDateString = `${date} ${formattedTime}`;

  return extendedDateString;
};
