import { ResultStatus } from './result-status.entity';

export interface IResultStatusRepository {
    findById(id: string): Promise<ResultStatus | null>;
    findByCode(statusCode: string): Promise<ResultStatus | null>;
    findAll(limit?: number, offset?: number): Promise<[ResultStatus[], number]>;
    findActive(limit?: number, offset?: number): Promise<[ResultStatus[], number]>;
    findByOrderRange(minOrder: number, maxOrder: number): Promise<ResultStatus[]>;
    save(resultStatus: ResultStatus): Promise<ResultStatus>;
    update(id: string, resultStatus: Partial<ResultStatus>): Promise<ResultStatus>;
    delete(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
    search(searchTerm: string, limit?: number, offset?: number): Promise<[ResultStatus[], number]>;
}
