import axiosInstance from './config'
import Cookies from 'js-cookie'
import { Company } from '@/interfaces/company'
import { ApiResponse } from '@/interfaces/common'
import { Instrument } from '@/interfaces/instrument'

export const getInstrumentList = async (): Promise<Instrument[] | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Instrument[]>>('/api/instruments')
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
