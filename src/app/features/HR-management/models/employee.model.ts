export type Education = 'diploma' | 'bachelors' | 'masters' | 'phd';
export type Gender = 'male' | 'female';
export interface Employee {
    id: string;
    name: string;
    unitId: number;
    gender: Gender;
    mobileNumber?: string;
    education: Education;
}
