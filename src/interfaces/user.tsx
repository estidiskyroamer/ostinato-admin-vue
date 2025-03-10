import { ApiResponse, Meta } from "./common";
import { Company } from "./company";

export interface Admin {
    id?: string;
    userId: string;
    isActive: number;
    created_at?: Date;
    deleted_at?: Date;
    updated_at?: Date;
    companyId?: string;
    user: User;
    company?: Company;
}

export interface Teacher {
    id?: string;
    userId: string;
    isActive: number;
    created_at?: Date;
    deleted_at?: Date;
    updated_at?: Date;
    companyId?: string;
    user?: User;
}

export interface Student {
    id?: string;
    userId: string;
    isActive: number;
    address: string;
    birthDate: string;
    created_at?: Date;
    deleted_at?: Date;
    updated_at?: Date;
    companyId?: string;
    user?: User;
}

export interface User {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    address?: string;
    birthDate?: string;
    created_at?: Date;
    deleted_at?: Date;
    password?: string;
    companies?: Array<Company>;
    isActive?: number;
    updated_at?: Date;
    createdBy?: string;
}

