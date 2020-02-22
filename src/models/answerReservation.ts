
export enum EReservationStatus {
    submitted,
    accepted,
    discarded,
}

export interface IAnswerReservation {
    id: string;
    user: string;
    timestamp: Date;
    status: EReservationStatus;
}