import { UserData } from "@entities/user/user-data";

export interface Test {
    id: number;
    userEmail: string;
    name: string;
    description: string;
    createdAt?: string; // present in test retrieved from backend, but not in initial test creation post
}

export const mockTests: Test[] = [
    {
        id: 1,
        userEmail: 'fake@mail.com',
        name: 'ENMU',
        description: 'Un test psicologico que prueba tu memoria',
        createdAt: "2021-05-18T00:32:15.162Z"
    }

]
