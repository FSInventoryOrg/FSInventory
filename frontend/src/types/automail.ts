export interface AutoMailType {
  contact: string;
  recipient: string[];
  frequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
  day: number | undefined;
  weekday: number | undefined;
  time: string;
  nextRoll?: Date;
  lastRollOut?: Date;
}
