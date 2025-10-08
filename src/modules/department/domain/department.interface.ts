import { Department } from './department.entity';

export interface IDepartmentRepository {
    findById(id: string): Promise<Department | null>;
    findByCode(departmentCode: string): Promise<Department | null>;
    findByName(departmentName: string): Promise<Department | null>;
    save(department: Department): Promise<Department>;
    delete(id: string): Promise<void>;
    findAllDepartments(limit: number, offset: number): Promise<[Department[], number]>;
    findActiveDepartments(limit: number, offset: number): Promise<[Department[], number]>;
    findDepartmentsByBranch(branchId: string, limit: number, offset: number): Promise<[Department[], number]>;
    findDepartmentsByType(departmentTypeId: string, limit: number, offset: number): Promise<[Department[], number]>;
    findDepartmentsByParent(parentDepartmentId: string, limit: number, offset: number): Promise<[Department[], number]>;
    findParentDepartments(limit: number, offset: number): Promise<[Department[], number]>;
    findSubDepartments(parentDepartmentId: string, limit: number, offset: number): Promise<[Department[], number]>;
    searchDepartments(searchTerm: string, limit: number, offset: number): Promise<[Department[], number]>;
}

export interface IDepartmentService {
    createDepartment(departmentData: any): Promise<Department>;
    updateDepartment(id: string, departmentData: any): Promise<Department>;
    deleteDepartment(id: string): Promise<void>;
    getDepartmentById(id: string): Promise<Department>;
    getAllDepartments(limit: number, offset: number): Promise<[Department[], number]>;
}
