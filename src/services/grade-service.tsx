import { Grade } from '@/interfaces/grade'
import axiosInstance from './config'
import { ApiResponse, Paginated } from '@/interfaces/common'

export const addGrade = async ({
  name,
  tuitionFee,
}: {
  name: string
  tuitionFee: Number
}): Promise<Grade | null> => {
  try {
    const response = await axiosInstance.post('/admin/grades', {
      name: name,
      tuitionFee: tuitionFee,
    })
    return response.data.data
  } catch (error) {
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}

export const updateGrade = async ({
  gradeId,
  name,
  tuitionFee,
}: {
  gradeId: string
  name: string
  tuitionFee: string
}): Promise<Grade | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Grade>>('/admin/grades/grade/' + gradeId, {
      name: name,
      tuitionFee: tuitionFee,
    })
    return response.data.data
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

export const deleteGrade = async (gradeData: Grade): Promise<Grade | null> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<Grade>>(
      '/admin/grades/grade/' + gradeData.id,
    )
    return response.data.data
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

export const getGradeListPaginated = async (page: number): Promise<Paginated<Grade[]> | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Paginated<Grade[]>>>(
      '/admin/grades?limit=25&page=' + page,
    )
    return response.data.data
  } catch (error) {
    console.log(error)
    return null
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}

export const getGradeList = async (): Promise<Grade[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Grade[]>>('/admin/grades')
    return response.data.data
  } catch (error) {
    console.log(error)
    return []
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
  }
}
