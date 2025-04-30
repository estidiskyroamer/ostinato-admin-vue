import { Company } from './company'

export interface StudentGrade {
  id: string
  studentId: string
  gradeId: string
  examDate?: Date
  examScore?: string
  isActive: number
  grade: Grade
}

export interface Grade {
  id?: string
  name: string
  company?: Company
  tuitionFee: number
}
