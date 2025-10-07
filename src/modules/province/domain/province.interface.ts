import { Province } from './province.entity';

export interface IProvinceRepository {
    findById(id: string): Promise<Province | null>;
    findByCode(provinceCode: string): Promise<Province | null>;
    findByName(provinceName: string): Promise<Province | null>;
    save(province: Province): Promise<Province>;
    delete(id: string): Promise<void>;
    findActiveProvinces(limit: number, offset: number): Promise<[Province[], number]>;
    findAllProvinces(limit: number, offset: number): Promise<[Province[], number]>;
    searchProvinces(searchTerm: string, limit: number, offset: number): Promise<[Province[], number]>;
}

export interface IProvinceService {
    createProvince(createProvinceDto: any): Promise<Province>;
    updateProvince(id: string, updateProvinceDto: any): Promise<Province>;
    deleteProvince(id: string): Promise<void>;
    getProvinceById(id: string): Promise<Province>;
    getProvinces(limit: number, offset: number, search?: string): Promise<[Province[], number]>;
}
