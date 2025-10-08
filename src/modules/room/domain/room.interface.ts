import { Room } from './room.entity';

export interface IRoomRepository {
    findById(id: string): Promise<Room | null>;
    findByCode(roomCode: string): Promise<Room | null>;
    findByName(roomName: string): Promise<Room | null>;
    save(room: Room): Promise<Room>;
    delete(id: string): Promise<void>;
    findAllRooms(limit: number, offset: number): Promise<[Room[], number]>;
    findActiveRooms(limit: number, offset: number): Promise<[Room[], number]>;
    findRoomsByDepartment(departmentId: string, limit: number, offset: number): Promise<[Room[], number]>;
    searchRooms(searchTerm: string, limit: number, offset: number): Promise<[Room[], number]>;
}

export interface IRoomService {
    createRoom(roomData: any): Promise<Room>;
    updateRoom(id: string, roomData: any): Promise<Room>;
    deleteRoom(id: string): Promise<void>;
    getRoomById(id: string): Promise<Room>;
    getAllRooms(limit: number, offset: number): Promise<[Room[], number]>;
}
