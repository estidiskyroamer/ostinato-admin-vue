import { Company } from "./company";

export interface Grade {
    id?: string;
    name: string;
    company?: Company;
    tuitionFee: number;
}