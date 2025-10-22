import { Patient } from './patient.entity';

export interface IPatientRepository {
    findById(id: string): Promise<Patient | null>;
    findByCode(patientCode: string): Promise<Patient | null>;
    findByHisId(hisId: number): Promise<Patient | null>;
    save(patient: Patient): Promise<Patient>;
    delete(id: string): Promise<void>;
    findActivePatients(limit: number, offset: number): Promise<[Patient[], number]>;
    findAllPatients(limit: number, offset: number): Promise<[Patient[], number]>;
    searchPatients(searchTerm: string, limit: number, offset: number): Promise<[Patient[], number]>;
}

export interface IPatientService {
    createPatient(createPatientDto: any): Promise<Patient>;
    updatePatient(id: string, updatePatientDto: any): Promise<Patient>;
    deletePatient(id: string): Promise<void>;
    getPatientById(id: string): Promise<Patient>;
    getPatientByCode(patientCode: string): Promise<Patient>;
    getPatientByHisId(hisId: number): Promise<Patient>;
    getPatients(query: any): Promise<any>;
    searchPatients(searchTerm: string, query: any): Promise<any>;
    syncPatientFromHis(hisPatientData: any): Promise<Patient>;
}
