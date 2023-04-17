export interface Developer {
    developerId: number;
    developerName: string;
    developerEmail: string;
    developerInfoDeveloperSince: Date | null;
    developerInfoPreferredOS: string | null;
}
export interface DeveloperInfo{
    id: number,
    developerSince: Date,
    preferredOS: string,
    developerId: number
}