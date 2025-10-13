import { ServiceGroup } from './service-group.entity';

// Repository Interface
export interface IServiceGroupRepository {
  findById(id: string): Promise<ServiceGroup | null>;
  findByCode(serviceGroupCode: string): Promise<ServiceGroup | null>;
  findByName(serviceGroupName: string): Promise<ServiceGroup | null>;
  save(serviceGroup: ServiceGroup): Promise<ServiceGroup>;
  delete(id: string): Promise<void>;
  findAndCount(limit: number, offset: number, search?: string): Promise<[ServiceGroup[], number]>;
  findActiveServiceGroups(limit: number, offset: number): Promise<[ServiceGroup[], number]>;
}

// Service Interface
export interface IServiceGroupService {
  createServiceGroup(data: CreateServiceGroupData): Promise<ServiceGroup>;
  updateServiceGroup(id: string, data: UpdateServiceGroupData): Promise<ServiceGroup>;
  deleteServiceGroup(id: string): Promise<void>;
  getServiceGroupById(id: string): Promise<ServiceGroup>;
  getServiceGroups(limit: number, offset: number, search?: string): Promise<[ServiceGroup[], number]>;
  getActiveServiceGroups(limit: number, offset: number): Promise<[ServiceGroup[], number]>;
}

// DTOs
export interface CreateServiceGroupData {
  serviceGroupCode: string;
  serviceGroupName: string;
  shortName: string;
  mapping?: string;
}

export interface UpdateServiceGroupData {
  serviceGroupCode?: string;
  serviceGroupName?: string;
  shortName?: string;
  mapping?: string;
}

export interface ServiceGroupResponseDto {
  id: string;
  serviceGroupCode: string;
  serviceGroupName: string;
  shortName: string;
  mapping?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  version: number;
}
