import { Service } from './service.entity';
import { ServicePriceHistory } from './service-price-history.entity';
import { BaseEntityDto } from '../../../common/dtos/base-entity.dto';

export interface CreateServiceData {
    serviceCode: string;
    serviceName: string;
    shortName: string;
    serviceGroupId: string;
    unitOfMeasureId: string;
    mapping?: string;
    numOrder?: number;
    currentPrice?: number;
    parentServiceId?: string;
    isActiveFlag?: number;
}

export interface UpdateServiceData {
    serviceName?: string;
    shortName?: string;
    serviceGroupId?: string;
    unitOfMeasureId?: string;
    mapping?: string;
    numOrder?: number;
    currentPrice?: number;
    parentServiceId?: string;
    isActiveFlag?: number;
}

export interface ServiceResponseDto extends BaseEntityDto {
    serviceCode: string;
    serviceName: string;
    shortName: string;
    serviceGroupId: string;
    unitOfMeasureId: string;
    mapping?: string;
    numOrder: number;
    currentPrice?: number;
    parentServiceId?: string;
    isActiveFlag: number;

    // Relationship objects
    serviceGroup?: {
        id: string;
        serviceGroupCode: string;
        serviceGroupName: string;
        shortName: string;
    };
    unitOfMeasure?: {
        id: string;
        unitOfMeasureCode: string;
        unitOfMeasureName: string;
    };
    parentService?: {
        id: string;
        serviceCode: string;
        serviceName: string;
        shortName: string;
    };
    subServices?: ServiceResponseDto[];
}

export interface ServicePriceHistoryResponseDto extends BaseEntityDto {
    serviceId: string;
    price: number;
    effectiveFrom: Date;
    effectiveTo?: Date;
    reason?: string;
}

export interface UpdatePriceData {
    price: number;
    effectiveFrom: Date;
    reason?: string;
}

export interface IServiceRepository {
    findById(id: string): Promise<Service | null>;
    findByCode(serviceCode: string): Promise<Service | null>;
    findByName(serviceName: string): Promise<Service | null>;
    save(service: Service): Promise<Service>;
    delete(id: string): Promise<void>;
    findAndCount(
        limit: number,
        offset: number,
        search?: string,
        serviceGroupId?: string,
        unitOfMeasureId?: string,
        parentServiceId?: string,
        isActive?: boolean,
    ): Promise<[Service[], number]>;
    findActiveServices(limit: number, offset: number): Promise<[Service[], number]>;
    findByServiceGroup(serviceGroupId: string, limit: number, offset: number): Promise<[Service[], number]>;
    findByParentService(parentServiceId: string, limit: number, offset: number): Promise<[Service[], number]>;
    findHierarchy(): Promise<Service[]>;
}

export interface IServicePriceHistoryRepository {
    findByServiceId(serviceId: string): Promise<ServicePriceHistory[]>;
    findByServiceIdAndDate(serviceId: string, date: Date): Promise<ServicePriceHistory | null>;
    findCurrentPrice(serviceId: string): Promise<ServicePriceHistory | null>;
    save(priceHistory: ServicePriceHistory): Promise<ServicePriceHistory>;
    closeCurrentPriceHistory(serviceId: string, effectiveTo: Date): Promise<void>;
}

export interface IServiceService {
    createService(data: CreateServiceData): Promise<Service>;
    updateService(id: string, data: UpdateServiceData): Promise<Service>;
    deleteService(id: string): Promise<void>;
    getServiceById(id: string): Promise<Service>;
    getServices(
        limit: number,
        offset: number,
        search?: string,
        serviceGroupId?: string,
        unitOfMeasureId?: string,
        parentServiceId?: string,
        isActive?: boolean,
    ): Promise<[Service[], number]>;
    getServicesByGroup(serviceGroupId: string, limit: number, offset: number): Promise<[Service[], number]>;
    getServicesByParent(parentServiceId: string, limit: number, offset: number): Promise<[Service[], number]>;
    getServiceHierarchy(): Promise<Service[]>;
    updateServicePrice(serviceId: string, data: UpdatePriceData): Promise<ServicePriceHistory>;
    getServicePriceHistory(serviceId: string): Promise<ServicePriceHistory[]>;
    getServicePriceAtDate(serviceId: string, date: Date): Promise<number>;
}
