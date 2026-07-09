export interface GetRoleArgs {
    id?: number;
}

export interface CreateRoleArgs {
    name: string;
    description?: string;
    permissionIDs: number[];
}

export interface UpdateRoleArgs {
    id: number;
    name: string;
    description?: string;
    permissionIDs: number[];
}

export interface DeleteRoleArgs {
    id: number;
}