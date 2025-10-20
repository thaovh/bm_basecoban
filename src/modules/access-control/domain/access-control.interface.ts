export interface IAccessControlService {
    getAttendanceEvents(params: AttendanceEventParams): Promise<AttendanceEventResponse>;
    getImageAsBase64(imagePath: string): Promise<string>;
}

export interface AttendanceEventParams {
    employeeNoString: string;
    startTime: string;
    endTime: string;
    maxResults?: number;
    searchResultPosition?: number;
}

export interface AttendanceEventResponse {
    searchID: string;
    totalMatches: number;
    responseStatusStrg: string;
    numOfMatches: number;
    InfoList: AttendanceEventInfo[];
}

export interface AttendanceEventInfo {
    major: number;
    minor: number;
    time: string;
    cardNo: string;
    cardType: number;
    name: string;
    cardReaderNo: number;
    doorNo: number;
    employeeNoString: string;
    serialNo: number;
    userType: string;
    currentVerifyMode: string;
    mask: string;
    pictureURL: string;
    image?: string; // Base64 encoded image
    FaceRect: FaceRect;
    currentAuthenticationTimes: number;
    allowAuthenticationTimes: number;
}

export interface FaceRect {
    height: number;
    width: number;
    x: number;
    y: number;
}
