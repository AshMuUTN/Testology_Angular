export interface Test {
    id: number;
    userEmail: string;
    name: string;
    description: string;
    createdAt?: string; // present in test retrieved from backend, but not in initial test creation post
}
