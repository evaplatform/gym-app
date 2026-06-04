import { post, get, patch, remove } from "../api";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { IGroup } from "@/shared/models/IGroup";

export class GroupServices {
    static async getAll() {
        return get<IGroup[]>('/group');
    }

    static async getById(id: string) {
        return get<IGroup>(`/group/${id}`);
    }

    static async create(body: ApiRequestType<IGroup>) {
        return post<ApiRequestType<IGroup>, IGroup>('/group', body)
    }

    static async update(body: ApiRequestType<IGroup>) {
        return patch<ApiRequestType<IGroup>, IGroup>(`/group`, body);
    }

    static async delete(id: string) {
        const response = await remove<{ message: string }>(`/group/${id}`);
        return response.message;
    }

    static async getByUserId(id: string) {
        return get<IGroup[]>(`/group/user/${id}`);
    }
}   