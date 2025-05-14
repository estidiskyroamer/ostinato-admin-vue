import { ApiResponse, Paginated } from '@/interfaces/common'
import { Schedule } from '@/interfaces/schedule'
import axiosInstance from './config'

export const addSchedule = async ({
  studentId,
  teacherId,
  instrumentId,
  date,
  startTime,
  endTime,
  repeat,
}: {
  studentId: string
  teacherId: string
  instrumentId: string
  date: string
  startTime: string
  endTime: string
  repeat: string
}): Promise<ApiResponse<Schedule> | null> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Schedule>>('/admin/schedules/' + repeat, {
      studentId: studentId,
      teacherId: teacherId,
      instrumentId: instrumentId,
      date: date,
      startTime: startTime,
      endTime: endTime,
    })
    return response.data
  } catch (error) {
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}

export const updateSchedule = async ({
  scheduleId,
  studentId,
  teacherId,
  instrumentId,
  status,
  date,
  startTime,
  endTime,
}: {
  scheduleId: string
  studentId: string
  teacherId: string
  instrumentId: string
  date: string
  status: string | null
  startTime: string
  endTime: string
}): Promise<ApiResponse<Schedule> | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Schedule>>(
      '/admin/schedules/schedule/' + scheduleId,
      {
        studentId: studentId,
        teacherId: teacherId,
        instrumentId: instrumentId,
        date: date,
        status: status,
        startTime: startTime,
        endTime: endTime,
      },
    )
    return response.data
  } catch (error) {
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}

export const deleteSchedule = async (
  scheduleData: Schedule,
): Promise<ApiResponse<Schedule> | null> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<Schedule>>(
      '/admin/schedules/schedule/' + scheduleData.id,
    )
    return response.data
  } catch (error) {
    console.log(error)
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}

export const getDailySchedulePaginated = async (
  date: Date,
): Promise<ApiResponse<Paginated<Schedule[]>> | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Paginated<Schedule[]>>>(
      '/admin/schedules?year=' +
        date.getFullYear() +
        '&month=' +
        (date.getMonth() + 1) +
        '&day=' +
        date.getDate() +
        '&limit=25',
    )
    return response.data
  } catch (error) {
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}

export const getStudentSchedulePaginated = async (
  studentId: string,
): Promise<ApiResponse<Schedule[]> | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Schedule[]>>(
      '/admin/students/showSchedule/' + studentId,
    )
    return response.data
  } catch (error) {
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}
