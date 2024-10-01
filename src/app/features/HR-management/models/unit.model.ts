export type UnitStatus = 'active' | 'inactive'
export interface Unit {
    id: string;
    name: string;
    status: UnitStatus;
    establishmentDate: string;
}