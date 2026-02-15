export interface DaySchedule {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface RoadmapWeek {
  week: string;
  phase: string;
  day: string;
  timeBlock: string;
  duration: string;
  activityType: string;
  topic: string;
  resource: string;
  practicalExercise: string;
  dsaPractice: string;
  weeklyMilestone: string;
  cumulativeDSACount: number;
}

export interface ActivityLog {
  date: string;
  activity: string;
  completed: boolean;
  timestamp: number;
}

export interface NotificationSchedule {
  time: string;
  title: string;
  body: string;
}
