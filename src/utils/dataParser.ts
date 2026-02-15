import * as XLSX from 'xlsx';
import { DaySchedule, RoadmapWeek } from '../types';

export const parseXLSXData = async (filePath: string) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Parse Daily Schedule from "Days" sheet
    const daysSheet = workbook.Sheets['Days'];
    const daysData: any[][] = XLSX.utils.sheet_to_json(daysSheet, { header: 1 });

    const scheduleData: DaySchedule[] = [];
    for (let i = 1; i < daysData.length; i++) {
      const row = daysData[i];
      if (row[0]) {
        scheduleData.push({
          time: row[0],
          monday: row[1] || '',
          tuesday: row[2] || '',
          wednesday: row[3] || '',
          thursday: row[4] || '',
          friday: row[5] || '',
          saturday: row[6] || '',
          sunday: row[7] || '',
        });
      }
    }

    // Parse Roadmap from "65-Week Detailed Plan" sheet
    const roadmapSheet = workbook.Sheets['65-Week Detailed Plan'];
    const roadmapData: any[][] = XLSX.utils.sheet_to_json(roadmapSheet, { header: 1 });

    const weekData: RoadmapWeek[] = [];
    for (let i = 1; i < roadmapData.length; i++) {
      const row = roadmapData[i];
      if (row[0]) {
        weekData.push({
          week: row[0] || '',
          phase: row[1] || '',
          day: row[2] || '',
          timeBlock: row[3] || '',
          duration: row[4] || '',
          activityType: row[5] || '',
          topic: row[6] || '',
          resource: row[7] || '',
          practicalExercise: row[8] || '',
          dsaPractice: row[9] || '',
          weeklyMilestone: row[10] || '',
          cumulativeDSACount: parseInt(row[11]) || 0,
        });
      }
    }

    return {
      scheduleData,
      weekData,
    };
  } catch (error) {
    console.error('Error parsing XLSX:', error);
    return {
      scheduleData: [],
      weekData: [],
    };
  }
};
