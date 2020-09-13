import { ParametrageCompte } from "./Entities/ParametrageCompte";


export class ParametrageListModel {
    public hasNextPage: boolean;
    public hasPreviousPage: boolean;
    public nextPageNumber: number;
    public pageNumber: number;
    public pageSize: number;
    public previousPageNumber: number;
    public totalItems: number;
    public totalPages: number;
    public list: ParametrageCompte[];
}