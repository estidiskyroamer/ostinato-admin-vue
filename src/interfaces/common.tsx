import { Company } from "./company";
import { Instrument } from "./instrument";
import { Admin, User } from "./user";

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface Paginated<T> {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: number;
    total: number;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export class Convert {
    public static toAdminDetail(json: string): ApiResponse<Admin> {
        return JSON.parse(json);
    }

    public static adminDetailToJson(value: ApiResponse<Admin>): string {
        return JSON.stringify(value);
    }

    public static toAdmin(json: string): Admin {
        return JSON.parse(json);
    }

    public static adminToJson(value: Admin): string {
        return JSON.stringify(value);
    }

    public static toUser(json: string): User {
        return JSON.parse(json);
    }

    public static userToJson(value: User): string {
        return JSON.stringify(value);
    }

    public static toCompany(json: string): Company {
        return JSON.parse(json);
    }

    public static companyToJson(value: Company): string {
        return JSON.stringify(value);
    }

    public static toInstrument(json: string): Instrument {
        return JSON.parse(json);
    }

    public static instrumentToJson(value: Instrument): string {
        return JSON.stringify(value);
    }
}