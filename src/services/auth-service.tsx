import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "./config";
import Cookies from 'js-cookie';
import { Admin, User } from "@/interfaces/user";
import { ApiResponse, Convert } from "@/interfaces/common";

export interface LoginResponse {
    error?: string;
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    refresh_ttl?: number;
}

export const login = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.post<LoginResponse>('/api/login', { 'email': email, 'password': password, });
        if (response.data.access_token != null) {
            Cookies.set('accessToken', response.data.access_token, { expires: 14 });
            const userFetched = await getMe();
            return userFetched;
        }
        return false;
    } catch (error) {
        return false;
        /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
    }
}

export const getMe = async (): Promise<boolean> => {
    try {
        const response = await axiosInstance.get<ApiResponse<User>>('/admin/admins/show');
        if (response.data.data != null) {
            Cookies.set('userId', response.data.data.id!, { expires: 14 });
            Cookies.set('companyId', response.data.data.companies![0].id!, { expires: 14 });
            Cookies.set('user', Convert.userToJson(response.data.data), { expires: 14 });
            Cookies.set('company', response.data.data.companies != null ? Convert.companyToJson(response.data.data.companies![0]) : '', { expires: 14 });
        }
        return true;
    } catch (error) {
        /* if (error instanceof AxiosError) {
            let err = error.response!.data.error;
            return error.response!.data;
        } */
        return false;
    }
}

export const logout = (): boolean => {
    Cookies.remove('accessToken');
    Cookies.remove('userId');
    Cookies.remove('adminId');
    Cookies.remove('companyId');
    Cookies.remove('user');
    Cookies.remove('admin');
    Cookies.remove('company');
    // localStorage.clear();
    return true;
}