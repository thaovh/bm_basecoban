import { User } from './user.entity';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    findActiveUsers(limit: number, offset: number): Promise<[User[], number]>;
    findUsersByRole(role: 'admin' | 'user', limit: number, offset: number): Promise<[User[], number]>;
    searchUsers(searchTerm: string, limit: number, offset: number): Promise<[User[], number]>;
}

export interface IUserService {
    createUser(userData: CreateUserData): Promise<User>;
    updateUser(id: string, userData: UpdateUserData): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getUserById(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    getUsers(limit: number, offset: number): Promise<[User[], number]>;
    searchUsers(searchTerm: string, limit: number, offset: number): Promise<[User[], number]>;
    activateUser(id: string): Promise<User>;
    deactivateUser(id: string): Promise<User>;
    changeUserRole(id: string, role: 'admin' | 'user'): Promise<User>;
}

export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    address?: string;
    role?: 'admin' | 'user';
    createdBy?: string;
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    address?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
    updatedBy?: string;
}

export interface UserSearchCriteria {
    searchTerm?: string;
    role?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
}
