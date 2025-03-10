export interface Summary {
    students: StudentSummary;
    teachers: TeacherSummary;
    courses: CourseSummary;
}

export interface CourseSummary {
    no_status: number;
    canceled: number;
    done: number;
}

export interface TeacherSummary {
    total_teachers: number;
    total_new_teachers: number;
    total_leaving_teachers: number;
}

export interface StudentSummary {
    total_students: number;
    total_new_students: number;
    total_leaving_students: number;
}