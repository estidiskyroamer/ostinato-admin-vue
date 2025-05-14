import { Admin, Student, Teacher, User } from '@/interfaces/user'
import axiosInstance from './config'
import Cookies from 'js-cookie'
import { ApiResponse, Paginated } from '@/interfaces/common'
import { AxiosError } from 'axios'

export const addUser = async (userData: User): Promise<User | null> => {
  try {
    const response = await axiosInstance.post<ApiResponse<User>>('/admin/users', {
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
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

export const updateUser = async (userData: User): Promise<User | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<User>>(
      '/admin/users/user/' + userData.id,
      { name: userData.name, email: userData.email, phoneNumber: userData.phoneNumber },
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

export const deleteUser = async (userData: User): Promise<User | null> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<User>>(
      '/admin/users/user/' + userData.id,
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

export const addTeacher = async ({
  name,
  email,
  phoneNumber,
  password,
  companyId,
}: {
  name: string
  email: string
  phoneNumber: string
  password: string
  companyId: string
}): Promise<Teacher | null> => {
  try {
    const response = await axiosInstance.post('/admin/teachers', {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      companyId: companyId,
      isActive: true,
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

export const updateTeacher = async ({
  teacherId,
  name,
  email,
  phoneNumber,
  password,
  companyId,
  isActive,
}: {
  teacherId: string
  name: string
  email: string
  phoneNumber: string
  password: string
  companyId: string
  isActive: boolean
}): Promise<User | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<User>>(
      '/admin/teachers/teacher/' + teacherId,
      {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        companyId: companyId,
        isActive: isActive,
      },
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

export const deleteTeacher = async (teacherData: User): Promise<User | null> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<User>>(
      '/admin/teachers/teacher/' + teacherData.id,
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

export const getTeacherListPaginated = async (): Promise<Paginated<User[]> | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Paginated<User[]>>>(
      '/admin/teachers?limit=25',
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

export const getTeacherList = async (): Promise<User[] | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/admin/teachers')
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

export const addAdmin = async ({
  name,
  email,
  phoneNumber,
  password,
  companyId,
}: {
  name: string
  email: string
  phoneNumber: string
  password: string
  companyId: string
}): Promise<Admin | null> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Admin>>('/admin/admins', {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      companyId: companyId,
      isActive: true,
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

export const updateAdmin = async ({
  adminId,
  name,
  email,
  phoneNumber,
  password,
  companyId,
  isActive,
}: {
  adminId: string
  name: string
  email: string
  phoneNumber: string
  password: string
  companyId: string
  isActive: boolean
}): Promise<Admin | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Admin>>('/admin/admins/admin/' + adminId, {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      companyId: companyId,
      isActive: isActive,
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

export const deleteAdmin = async (adminData: Admin): Promise<Admin | null> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<Admin>>(
      '/admin/admins/admin/' + adminData.id,
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

export const getAdminListPaginated = async (): Promise<Paginated<User[]> | null> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<Paginated<User[]>>>('/admin/admins?limit=25')
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

export const getAdminList = async (): Promise<User[] | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/admin/admins')
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

export const addStudent = async ({
  name,
  email,
  birthDate,
  address,
  phoneNumber,
  password,
  companyId,
  gradeId,
}: {
  name: string
  email: string
  birthDate: string
  address: string
  phoneNumber: string
  password: string
  companyId: string
  gradeId?: string
}): Promise<ApiResponse<Student | null> | null> => {
  try {
    const response = await axiosInstance.post('/admin/students', {
      name: name,
      email: email,
      birthDate: birthDate,
      address: address,
      phoneNumber: phoneNumber,
      password: password,
      companyId: companyId,
      isActive: true,
      gradeId: gradeId ?? null,
    })
    return response.data
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      const err = error.response!.data
      return err
    }
  }
  return null
}

export const updateStudent = async ({
  studentId,
  name,
  email,
  address,
  phoneNumber,
  password,
  companyId,
  isActive,
  gradeId,
}: {
  studentId: string
  name: string
  email: string
  birthDate: string
  address: string
  phoneNumber: string
  password: string
  companyId: string
  isActive: boolean
  gradeId: string
}): Promise<ApiResponse<Student | null> | null> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Student>>(
      '/admin/students/student/' + studentId,
      {
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        password: password,
        companyId: companyId,
        isActive: isActive,
        gradeId: gradeId,
      },
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

export const deleteStudent = async (
  studentData: User,
): Promise<ApiResponse<Student | null> | null> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<Student>>(
      '/admin/students/student/' + studentData.id,
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

export const getStudentListPaginated = async (page: number): Promise<Paginated<User[]> | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Paginated<User[]>>>(
      '/admin/students?limit=25&page=' + page,
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

export const getStudentList = async (): Promise<User[] | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/admin/students')
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
