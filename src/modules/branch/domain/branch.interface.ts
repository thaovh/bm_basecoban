import { Branch } from './branch.entity';

export interface IBranchRepository {
    findById(id: string): Promise<Branch | null>;
    findByCode(branchCode: string): Promise<Branch | null>;
    findByName(branchName: string): Promise<Branch | null>;
    save(branch: Branch): Promise<Branch>;
    delete(id: string): Promise<void>;
    findAllBranches(limit: number, offset: number): Promise<[Branch[], number]>;
    findActiveBranches(limit: number, offset: number): Promise<[Branch[], number]>;
    findBranchesByProvince(provinceId: string, limit: number, offset: number): Promise<[Branch[], number]>;
    findBranchesByWard(wardId: string, limit: number, offset: number): Promise<[Branch[], number]>;
    searchBranches(searchTerm: string, limit: number, offset: number): Promise<[Branch[], number]>;
}

export interface IBranchService {
    createBranch(branchData: any): Promise<Branch>;
    updateBranch(id: string, branchData: any): Promise<Branch>;
    deleteBranch(id: string): Promise<void>;
    getBranchById(id: string): Promise<Branch>;
    getAllBranches(limit: number, offset: number): Promise<[Branch[], number]>;
}
