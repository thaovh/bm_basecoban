import { DepartmentType } from './department-type.entity';

export interface IDepartmentTypeRepository {
    findById(id: string): Promise<DepartmentType | null>;
    findByCode(typeCode: string): Promise<DepartmentType | null>;
    findByName(typeName: string): Promise<DepartmentType | null>;
    save(departmentType: DepartmentType): Promise<DepartmentType>;
    delete(id: string): Promise<void>;
    findAllDepartmentTypes(limit: number, offset: number): Promise<[DepartmentType[], number]>;
    findActiveDepartmentTypes(limit: number, offset: number): Promise<[DepartmentType[], number]>;
    searchDepartmentTypes(searchTerm: string, limit: number, offset: number): Promise<[DepartmentType[], number]>;
}

export interface IDepartmentTypeService {
    createDepartmentType(departmentTypeData: any): Promise<DepartmentType>;
    updateDepartmentType(id: string, departmentTypeData: any): Promise<DepartmentType>;
    deleteDepartmentType(id: string): Promise<void>;
    getDepartmentTypeById(id: string): Promise<DepartmentType>;
    getAllDepartmentTypes(limit: number, offset: number): Promise<[DepartmentType[], number]>;
}
