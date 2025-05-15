export const DEFAULT_PASSWORD = 'default'
export const scheduleStatuses = ['done', 'canceled', null] as const

export type SCHEDULE_STATUS = (typeof scheduleStatuses)[number]
