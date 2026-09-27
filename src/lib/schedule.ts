import type { ScheduleStatus } from '@/src/db/enums';

export const SCHEDULE_LABELS: Record<ScheduleStatus, string> = {
  OPEN: 'OPEN',
  LIMITED: 'LIMITED',
  FULL: 'FULL',
  SOLD_OUT: 'SOLD OUT',
  CLOSED: 'CLOSED',
};

export const SCHEDULE_BADGE: Record<ScheduleStatus, string> = {
  OPEN: 'bg-green-100 text-green-700',
  LIMITED: 'bg-orange-100 text-orange-700',
  FULL: 'bg-red-100 text-brand-red',
  SOLD_OUT: 'bg-red-100 text-brand-red',
  CLOSED: 'bg-gray-100 text-gray-500',
};

/** Only OPEN/LIMITED departures can be picked for a WhatsApp booking. */
export function isBookable(status: ScheduleStatus): boolean {
  return status === 'OPEN' || status === 'LIMITED';
}
