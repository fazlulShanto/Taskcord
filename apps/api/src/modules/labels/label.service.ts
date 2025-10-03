import { LabelDal, type DbLabel, type DbNewLabel } from "@taskcord/database";

export default class LabelService {
  public async createLabel(labelData: DbNewLabel): Promise<DbLabel> {
    const label = await LabelDal.createLabel(labelData);

    return label;
  }

  public async getAllLabelsByProjectId(projectId: string): Promise<DbLabel[]> {
    return LabelDal.getLabelsByProjectId(projectId);
  }

  public async updateLabel(
    id: string,
    labelData: Partial<DbNewLabel>,
  ): Promise<DbLabel | null> {
    return LabelDal.updateLabel(id, labelData);
  }

  public async deleteLabel(id: string): Promise<DbLabel | null> {
    return LabelDal.deleteLabel(id);
  }
}
