import { ActivityLog } from '../types';

export const getStreak = (logs: ActivityLog[]): number => {
  const sortedLogs = [...logs]
    .filter((log) => log.completed)
    .sort((a, b) => b.timestamp - a.timestamp);

  let streak = 0;
  const currentDate = new Date();

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    const diffDays = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getLongestStreak = (logs: ActivityLog[]): number => {
  const sortedLogs = [...logs]
    .filter((log) => log.completed)
    .sort((a, b) => a.timestamp - b.timestamp);

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);

    if (lastDate) {
      const diffDays = Math.floor(
        (logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    lastDate = logDate;
  }

  return Math.max(maxStreak, currentStreak);
};

export const getLast30DaysCompletion = (logs: ActivityLog[]): number => {
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return last30Days.filter((date) => {
    const log = logs.find((l) => l.date === date);
    return log?.completed;
  }).length;
};
