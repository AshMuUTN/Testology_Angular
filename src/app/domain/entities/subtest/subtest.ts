export interface Subtest {
    id: number;
    name: string;
    description: string;
    testId: number;
    createdAt?: string; // present in test retrieved from backend, but not in initial test creation post
    isCalculable?: boolean; // if undefined, backend should assign false
    isScorable?: boolean; // if undefined, backend should assign false
}