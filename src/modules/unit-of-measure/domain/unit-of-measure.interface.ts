import { UnitOfMeasure } from './unit-of-measure.entity';
import { BaseEntityDto } from '../../../common/dtos/base-entity.dto';

export interface CreateUnitOfMeasureData {
    unitOfMeasureCode: string;
    unitOfMeasureName: string;
    description?: string;
    mapping?: string;
    isActiveFlag?: number;
}

export interface UpdateUnitOfMeasureData {
    unitOfMeasureName?: string;
    description?: string;
    mapping?: string;
    isActiveFlag?: number;
}

export interface UnitOfMeasureResponseDto extends BaseEntityDto {
    unitOfMeasureCode: string;
    unitOfMeasureName: string;
    description?: string;
    mapping?: string;
    isActiveFlag: number;
}

export interface IUnitOfMeasureRepository {
    findById(id: string): Promise<UnitOfMeasure | null>;
    findByCode(unitOfMeasureCode: string): Promise<UnitOfMeasure | null>;
    findByName(unitOfMeasureName: string): Promise<UnitOfMeasure | null>;
    save(unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure>;
    delete(id: string): Promise<void>;
    findAndCount(
        limit: number,
        offset: number,
        search?: string,
        isActive?: boolean,
    ): Promise<[UnitOfMeasure[], number]>;
    findActiveUnitOfMeasures(limit: number, offset: number): Promise<[UnitOfMeasure[], number]>;
}

export interface IUnitOfMeasureService {
    createUnitOfMeasure(data: CreateUnitOfMeasureData): Promise<UnitOfMeasure>;
    updateUnitOfMeasure(id: string, data: UpdateUnitOfMeasureData): Promise<UnitOfMeasure>;
    deleteUnitOfMeasure(id: string): Promise<void>;
    getUnitOfMeasureById(id: string): Promise<UnitOfMeasure>;
    getUnitOfMeasures(
        limit: number,
        offset: number,
        search?: string,
        isActive?: boolean,
    ): Promise<[UnitOfMeasure[], number]>;
}
