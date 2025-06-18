import axiosInstance from './axiosInstance.js'; // or use axios directly if no wrapper

export const notesAPI = {
  getAll: (includeArchived = false) =>
    axiosInstance.get('/notes', {
      params: { includeArchived },
    }),

  getById: (noteId, includeArchived = false) =>
    axiosInstance.get(`/notes/${noteId}`, {
      params: { includeArchived },
    }),

  create: (data) => axiosInstance.post('/notes', data),

  update: (noteId, data) => axiosInstance.patch(`/notes/${noteId}`, data),

  archive: (noteId) => axiosInstance.delete(`/notes/${noteId}`),
  delete: (noteId) => axiosInstance.delete(`/notes/${noteId}/permanent`),

  restore: (noteId) => axiosInstance.patch(`/notes/${noteId}/restore`),

  getVersions: (noteId) => axiosInstance.get(`/notes/${noteId}/versions`),

  revertToVersion: (noteId, versionId) =>
    axiosInstance.post(`/notes/${noteId}/versions/${versionId}/revert`),

  getAuditLogs: (noteId) => axiosInstance.get(`/notes/${noteId}/audit-logs`),

  getNotesOfUser: (userid) =>
    axiosInstance.get(`/notes/admin/user-notes/${userid}`),

  getPublic: () => axiosInstance.get(`/notes/shared`),
};
