export const getBaseApiUrl = (): string => {
  if (['production', 'staging'].includes(import.meta.env.MODE)) {
    return import.meta.env.VITE_PROD_API_URL;
  }
  return import.meta.env.VITE_DEV_API_URL;
};

export const API_URL = getBaseApiUrl();

export const APIs = {
  auth: {
    initDiscordAuth: (redirectUrl: string) =>
      `${API_URL}/api/edge/auth/discord/init?redirect_url=${redirectUrl}`,
    me: () => `${API_URL}/api/edge/users/@me`,
    createProject: () => `${API_URL}/api/edge/project`,
  },
  project: {
    getAllProjects: () => `${API_URL}/api/edge/project`,
    get: (projectId: string) => `${API_URL}/api/edge/project/${projectId}`,
    update: (projectId: string) => `${API_URL}/api/edge/project/${projectId}`,
    listInvites: (projectId: string) => `${API_URL}/api/edge/project/${projectId}/invitations`,
    createInvite: (projectId: string) => `${API_URL}/api/edge/project/${projectId}/invitations`,
    revokeInvite: (projectId: string, inviteId: string) =>
      `${API_URL}/api/edge/project/${projectId}/invitations/${inviteId}`,
    listRoles: (projectId: string) => `${API_URL}/api/edge/project/${projectId}/roles`,
  },
  user: {
    get: (userId: string) => `${API_URL}/api/edge/users/${userId}`,
    userGuilds: () => `${API_URL}/api/edge/users/discord/guilds`,
    projectUserRoles: (projectId: string) => `${API_URL}/api/edge/users/projects/${projectId}`,
  },
  discord: {
    guilds: () => `${API_URL}/api/edge/users/discord/guilds`,
  },
  bot: {
    botServerVerification: (serverId: string) =>
      `${API_URL}/api/edge/project/${serverId}/is-bot-in-server`,
  },
  label: {
    getAllLabels: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/labels`,
    createLabel: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/labels`,
    updateLabel: (projectId: string, labelId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/labels/${labelId}`,
    deleteLabel: (projectId: string, labelId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/labels/${labelId}`,
    deleteLabelsBulk: (projectId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/labels/bulk`,
  },
  taskType: {
    getAllTaskTypes: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/task-types`,
    createTaskType: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/task-types`,
    updateTaskType: (projectId: string, taskTypeId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/task-types/${taskTypeId}`,
    deleteTaskType: (projectId: string, taskTypeId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/task-types/${taskTypeId}`,
    deleteTaskTypesBulk: (projectId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/task-types/bulk`,
  },
  milestone: {
    getAllMilestones: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/milestones`,
    createMilestone: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/milestones`,
    getMilestone: (projectId: string, milestoneId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/milestones/${milestoneId}`,
    updateMilestone: (projectId: string, milestoneId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/milestones/${milestoneId}`,
    deleteMilestone: (projectId: string, milestoneId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/milestones/${milestoneId}`,
  },
  task: {
    getAllTasks: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/tasks`,
    createTask: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/tasks`,
    getTask: (projectId: string, taskId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}`,
    updateTask: (projectId: string, taskId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}`,
    deleteTask: (projectId: string, taskId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}`,
  },
  taskComment: {
    getTaskComments: (projectId: string, taskId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}/comments`,
    createTaskComment: (projectId: string, taskId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}/comments`,
    getTaskComment: (projectId: string, taskId: string, commentId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    updateTaskComment: (projectId: string, taskId: string, commentId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    deleteTaskComment: (projectId: string, taskId: string, commentId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
  },
  utility: {
    cookies: () => `${API_URL}/api/stable/utility/cookie-test`,
  },
  github: {
    init: (projectId: string, redirectUrl?: string) => {
      const url = new URL(`${API_URL}/api/edge/github/init`);
      url.searchParams.set('project_id', projectId);
      if (redirectUrl) {
        url.searchParams.set('redirect_url', redirectUrl);
      }
      return url.toString();
    },
    listProjectRepos: (projectId: string) =>
      `${API_URL}/api/edge/github/projects/${projectId}/repositories`,
    upsertProjectRepo: (projectId: string) =>
      `${API_URL}/api/edge/github/projects/${projectId}/repositories`,
  },
};
