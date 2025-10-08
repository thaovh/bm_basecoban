import { SampleType } from './sample-type.entity';

export interface ISampleTypeRepository {
    findById(id: string): Promise<SampleType | null>;
    findByCode(typeCode: string): Promise<SampleType | null>;
    findByName(typeName: string): Promise<SampleType | null>;
    save(sampleType: SampleType): Promise<SampleType>;
    delete(id: string): Promise<void>;
    findAllSampleTypes(limit: number, offset: number): Promise<[SampleType[], number]>;
    findActiveSampleTypes(limit: number, offset: number): Promise<[SampleType[], number]>;
    searchSampleTypes(searchTerm: string, limit: number, offset: number): Promise<[SampleType[], number]>;
}

export interface ISampleTypeService {
    createSampleType(sampleTypeData: any): Promise<SampleType>;
    updateSampleType(id: string, sampleTypeData: any): Promise<SampleType>;
    deleteSampleType(id: string): Promise<void>;
    getSampleTypeById(id: string): Promise<SampleType>;
    getAllSampleTypes(limit: number, offset: number): Promise<[SampleType[], number]>;
    generateSampleCode(typeCode: string, sequence: number): Promise<string>;
}
