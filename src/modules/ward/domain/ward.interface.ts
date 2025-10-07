import { Ward } from './ward.entity';

export interface IWardRepository {
    findById(id: string): Promise<Ward | null>;
    findByCode(wardCode: string): Promise<Ward | null>;
    findByName(wardName: string): Promise<Ward | null>;
    findByProvinceId(provinceId: string): Promise<Ward[]>;
    save(ward: Ward): Promise<Ward>;
    delete(id: string): Promise<void>;
    findActiveWards(limit: number, offset: number): Promise<[Ward[], number]>;
    findAllWards(limit: number, offset: number): Promise<[Ward[], number]>;
    searchWards(searchTerm: string, limit: number, offset: number): Promise<[Ward[], number]>;
    findWardsByProvince(provinceId: string, limit: number, offset: number): Promise<[Ward[], number]>;
}

export interface IWardService {
    createWard(createWardDto: any): Promise<Ward>;
    updateWard(id: string, updateWardDto: any): Promise<Ward>;
    deleteWard(id: string): Promise<void>;
    getWardById(id: string): Promise<Ward>;
    getWards(limit: number, offset: number, search?: string, provinceId?: string): Promise<[Ward[], number]>;
    getWardsByProvince(provinceId: string, limit: number, offset: number): Promise<[Ward[], number]>;
}
