import { Instrument } from "./instrument";
import { Student, Teacher, User } from "./user";

export interface Schedule {
    id?: string;
    studentId: string;
    teacherId: string;
    instrumentId: string;
    date: string;
    created_at: Date;
    createdBy: string;
    deleted_at?: Date;
    startTime: string;
    endTime: string;
    updated_at?: Date;
    status?: string;
    student: User;
    teacher: User;
    instrument: Instrument;
    isRescheduled: number;
}