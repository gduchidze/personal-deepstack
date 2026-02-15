import { format, differenceInWeeks, startOfDay } from 'date-fns';

// Program start date - Week 1 begins on Feb 16, 2026
export const PROGRAM_START_DATE = new Date('2026-02-16');
export const TOTAL_WEEKS = 65;

export const getCurrentWeek = (): number => {
  const today = new Date();
  const weeksDiff = differenceInWeeks(startOfDay(today), startOfDay(PROGRAM_START_DATE));
  // Ensure we're at least in Week 1 and don't exceed total weeks
  return Math.min(Math.max(1, weeksDiff + 1), TOTAL_WEEKS);
};

export const getProgress = (currentWeek: number, totalWeeks: number = TOTAL_WEEKS): number => {
  return Math.min((currentWeek / totalWeeks) * 100, 100);
};

export const getDayOfWeek = (): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

export const getDayOfWeekGeorgian = (): string => {
  const days = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
  return days[new Date().getDay()];
};

export const getCurrentTime = (): string => {
  return format(new Date(), 'HH:mm:ss');
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const isProgramActive = (): boolean => {
  const today = new Date();
  return today >= PROGRAM_START_DATE;
};

export const getDaysIntoProgram = (): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - PROGRAM_START_DATE.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
