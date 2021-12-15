import { Protocol } from "@entities/protocol/protocol";
import { ReportSubtest } from "./report-subtest";

export interface Report {
    subtests: ReportSubtest[];
    protocol: Protocol;
    total: number;
    percentage: number;
}
