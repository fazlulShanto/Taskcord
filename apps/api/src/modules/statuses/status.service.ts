import { StatusDal, type DbNewStatus, type DbStatus } from "@taskcord/database";

export default class StatusService {
  public async createStatus(input: DbNewStatus) {
    return StatusDal.createStatus(input);
  }

  public async getStatusById(id: string) {
    return StatusDal.getStatusById(id);
  }

  public async getStatusesByProjectId(projectId: string): Promise<DbStatus[]> {
    return StatusDal.getStatusesByProjectId(projectId);
  }

  public async updateStatus(
    id: string,
    data: Partial<DbNewStatus>,
  ): Promise<DbStatus | null> {
    return StatusDal.updateStatus(id, data);
  }

  public async deleteStatus(id: string): Promise<DbStatus | null> {
    return StatusDal.deleteStatus(id);
  }

  public async deleteStatusBulk(ids: string[]): Promise<DbStatus[]> {
    return StatusDal.deleteStatusBulk(ids);
  }
}
