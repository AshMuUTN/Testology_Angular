export interface QuestionScoreFilter {
    id?: number;
    from?: number;
    to?: number;
    rank: number;
    questionId: number;
    scoreFilterId: number;
    value: number;
    isForCorrectAnswers?: boolean;
}
