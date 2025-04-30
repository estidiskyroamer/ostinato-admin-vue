import axiosInstance from './config'
import Cookies from 'js-cookie'
import { ApiResponse } from '@/interfaces/common'
import { Summary } from '@/interfaces/summary'

export const getSummary = async (): Promise<Summary | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Summary>>('/admin/summary')
    console.log(response.data)
    return response.data.data
  } catch (error) {
    console.log(error)
    /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
    return null
  }
}
