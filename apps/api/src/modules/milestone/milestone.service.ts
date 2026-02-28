import {
    MilestoneDal,
    type DbMilestone,
    type DbNewMilestone,
} from "@taskcord/database";

export default class MilestoneService {
    public async createMilestone(
        milestoneData: DbNewMilestone,
    ): Promise<DbMilestone> {
        return MilestoneDal.createMilestone(milestoneData);
    }

    public async getProjectMilestones(
        projectId: string,
    ): Promise<DbMilestone[]> {
        return MilestoneDal.getProjectMilestones(projectId);
    }

    public async getMilestoneById(id: string): Promise<DbMilestone | null> {
        return MilestoneDal.getMilestoneById(id);
    }

    public async updateMilestone(
        id: string,
        milestoneData: Partial<DbNewMilestone>,
    ): Promise<DbMilestone | null> {
        return MilestoneDal.updateMilestone(id, milestoneData);
    }

    public async deleteMilestone(id: string): Promise<DbMilestone | null> {
        return MilestoneDal.deleteMilestone(id);
    }
}
