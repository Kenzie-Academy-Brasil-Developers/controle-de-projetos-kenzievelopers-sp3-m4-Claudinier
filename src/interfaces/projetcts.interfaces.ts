export interface projectRegister{
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: string,
    endDate?: string,
    developerId: number
}
export interface project{
    id: number
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: string,
    endDate?: string,
    developerId: number
}