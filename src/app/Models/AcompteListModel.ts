import { Acompte } from "./Entities/Acompte";


// export class AcompteDataModel {
//   data: AcompteListModel
//   total: number
// }
export class AcompteListModel {
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public nextPageNumber: number;
  public pageNumber: number;
  public pageSize: number;
  public previousPageNumber: number;
  public totalItems: number;
  public totalPages: number;
  public list: Acompte[];
}