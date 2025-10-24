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
  },
  user: {
    get: (userId: string) => `${API_URL}/api/edge/users/${userId}`,
    userGuilds: () => `${API_URL}/api/edge/users/discord/guilds`,
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
  },
  utility: {
    cookies: () => `${API_URL}/api/stable/utility/cookie-test`,
  },
  taskStatus: {
    createTaskStatus: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/statuses`,
    updateTaskStatus: (projectId: string, taskStatusId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/statuses/${taskStatusId}`,
    deleteTaskStatus: (projectId: string) =>
      `${API_URL}/api/edge/projects/${projectId}/statuses/bulk`,
    getAllTaskStatuses: (projectId: string) => `${API_URL}/api/edge/projects/${projectId}/statuses`,
  },
};
