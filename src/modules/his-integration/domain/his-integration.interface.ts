import { HisToken } from './his-token.entity';

export interface IHisTokenRepository {
    findById(id: string): Promise<HisToken | null>;
    findByTokenCode(tokenCode: string): Promise<HisToken | null>;
    findByUserLoginName(userLoginName: string): Promise<HisToken | null>;
    findActiveTokenByUser(userLoginName: string): Promise<HisToken | null>;
    save(hisToken: HisToken): Promise<HisToken>;
    delete(id: string): Promise<void>;
    findAllActiveTokens(): Promise<HisToken[]>;
    findExpiredTokens(): Promise<HisToken[]>;
    cleanupExpiredTokens(): Promise<void>;
}

export interface IHisIntegrationService {
    loginToHISDirect(username: string, password: string): Promise<HisToken>;
    loginToHISWithCurrentUser(currentUserId: string, currentUsername?: string): Promise<HisToken>;
    loginToHIS(username?: string, password?: string, currentUserId?: string): Promise<HisToken>;
    renewToken(renewCode: string): Promise<HisToken>;
    getValidToken(userLoginName?: string): Promise<HisToken>;
    refreshTokenIfNeeded(userLoginName?: string): Promise<HisToken>;
    callHISAPI(endpoint: string, data?: any, userLoginName?: string): Promise<any>;
    logoutFromHIS(userLoginName: string): Promise<void>;
    getCurrentUserHISUsername(currentUserId: string): Promise<string>;
    cleanupExpiredTokens(): Promise<void>;
}

export interface HisLoginResponse {
    ValidAddress: string;
    TokenCode: string;
    RenewCode: string;
    LoginTime: string;
    ExpireTime: string;
    LoginAddress: string;
    User: {
        LoginName: string;
        UserName: string;
        ApplicationCode: string;
        GCode: string;
        Email: string;
        Mobile: string;
    };
    VersionApp: string;
    MachineName: string;
    LastAccessTime: string;
    AuthorSystemCode: string | null;
    AuthenticationCode: string | null;
    RoleDatas: Array<{
        RoleCode: string;
        RoleName: string;
    }> | null;
}

export interface HisApiResponse<T = any> {
    Data: T;
    Success: boolean;
    Param: any;
}
