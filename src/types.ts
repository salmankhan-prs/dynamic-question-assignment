
export enum ERegions {
    US = "US",
    SG = "SG",
    IN = "IN"
}

export interface IQuestionCreate {
    text: string;
    region: ERegions;
}