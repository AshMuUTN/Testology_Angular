export interface DomainTest {
    id: number;
    userEmail: string;
    name: string;
    description: string;
    created_at?: string; // present in test retrieved from backend, but not in initial test creation post
}
