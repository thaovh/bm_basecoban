import { ServiceTest } from './service-test.entity';

export interface IServiceTestRepository {
    findById(id: string): Promise<ServiceTest | null>;
    findByCode(testCode: string): Promise<ServiceTest | null>;
    findByName(testName: string): Promise<ServiceTest | null>;
    save(serviceTest: ServiceTest): Promise<ServiceTest>;
    delete(id: string): Promise<void>;
    findActiveServiceTests(limit: number, offset: number): Promise<[ServiceTest[], number]>;
    findByUnitOfMeasure(unitOfMeasureId: string): Promise<ServiceTest[]>;
    findByService(serviceId: string): Promise<ServiceTest[]>;
}

export interface ServiceTestResponseDto {
    id: string;
    testCode: string;
    testName: string;
    shortName: string;
    serviceId: string;
    serviceName?: string;
    serviceCode?: string;
    unitOfMeasureId: string;
    unitOfMeasureName?: string;
    rangeText?: string;
    rangeLow?: number;
    rangeHigh?: number;
    mapping?: string;
    testOrder: number;
    isActiveFlag: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceTestListResponseDto {
    serviceTests: ServiceTestResponseDto[];
    total: number;
    limit: number;
    offset: number;
}
