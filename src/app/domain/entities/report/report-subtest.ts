import { ReportQuestion } from "./report-question";

export interface ReportSubtest {
    questions: ReportQuestion[];
    score: number;
    percentage: number;
    name: string;
    isScorable: boolean;
    createdAt: string;
}
