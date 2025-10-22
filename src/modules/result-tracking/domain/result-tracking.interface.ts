import { ResultTracking } from './result-tracking.entity';

export interface IResultTrackingRepository {
    findById(id: string): Promise<ResultTracking | null>;
    findByServiceRequestId(serviceRequestId: string): Promise<ResultTracking[]>;
    findByResultStatusId(resultStatusId: string): Promise<ResultTracking[]>;
    findByRoomId(roomId: string): Promise<ResultTracking[]>;
    findActiveInRoom(roomId: string): Promise<ResultTracking[]>;
    findCurrentTrackingByServiceRequest(serviceRequestId: string): Promise<ResultTracking | null>;
    findAll(limit?: number, offset?: number): Promise<[ResultTracking[], number]>;
    save(resultTracking: ResultTracking): Promise<ResultTracking>;
    update(id: string, resultTracking: Partial<ResultTracking>): Promise<ResultTracking>;
    delete(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
    search(searchTerm: string, limit?: number, offset?: number): Promise<[ResultTracking[], number]>;
    findByDateRange(startDate: Date, endDate: Date, limit?: number, offset?: number): Promise<[ResultTracking[], number]>;
    findOverdueTrackings(limit?: number, offset?: number): Promise<[ResultTracking[], number]>;
    getTrackingStatistics(serviceRequestId?: string, roomId?: string, resultStatusId?: string): Promise<any>;
}
