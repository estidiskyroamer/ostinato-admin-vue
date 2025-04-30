import axiosInstance from './config'
import Cookies from 'js-cookie'
import { Company } from '@/interfaces/company'
import { ApiResponse } from '@/interfaces/common'

export const getCompany = async (companyId: string): Promise<Company | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Company>>(
      '/admin/companies/show/' + companyId,
    )
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

export const updateCompany = async ({
  companyId,
  companyCode,
  name,
  address,
  phoneNumber,
}: {
  companyId: string
  name: string
  companyCode: string
  address: string
  phoneNumber: string
}): Promise<Company | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Company>>(
      '/admin/companies/company/' + companyId,
      { name: name, companyCode: companyCode, address: address, phoneNumber: phoneNumber },
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
