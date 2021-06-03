export interface Option {
    id: number;
    text?: string; // option will include either text or number but never both
    number?: number;
    isCorrect: boolean;
    questionId: number;
    deleted?: boolean; // only use this to delete option
}
