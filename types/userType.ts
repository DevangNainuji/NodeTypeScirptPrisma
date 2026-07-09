export interface GetUserArgs {
    id?: number;
}

export interface CreateUserArgs {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
}

export interface UpdateUserArgs {
    id: number;
    name: string;
    email: string;
    roleId: number;
}

export interface DeleteUserArgs {
    id: number;
}