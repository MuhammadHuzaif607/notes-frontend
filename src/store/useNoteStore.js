import { create } from 'zustand';
import { notesAPI } from '../api/notesAPI';

export const useNoteStore = create((set) => ({
  notes: [],
  selectedNote: null,
  publicNotes: [],
  isLoading: false,
  error: null,

  fetchNotes: async (includeArchived = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await notesAPI.getAll(includeArchived);
      set({ notes: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch notes',
        isLoading: false,
      });
    }
  },
  getNotesOfUser: async (userid) => {
    set({ isLoading: true, error: null });
    try {
      const res = await notesAPI.getNotesOfUser(userid);
      set({ notes: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch notes',
        isLoading: false,
      });
    }
  },

  fetchNoteById: async (noteId, includeArchived = false) => {
    set({ isLoading: true, error: null });
    try {
      const res = await notesAPI.getById(noteId, includeArchived);
      set({ selectedNote: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch note',
        isLoading: false,
      });
    }
  },

  createNote: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await notesAPI.create(data);
      await useNoteStore.getState().fetchNotes();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to create note',
        isLoading: false,
      });
    }
  },

  updateNote: async (noteId, data) => {
    set({ isLoading: true, error: null });
    try {
      await notesAPI.update(noteId, data);
      await useNoteStore.getState().fetchNotes();
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to update note',
        isLoading: false,
      });
    }
  },

  archiveNote: async (noteId) => {
    try {
      await notesAPI.archive(noteId);
      await useNoteStore.getState().fetchNotes();
    } catch (err) {
      console.log('Error', err);
      set({ error: 'Failed to archive note' });
    }
  },
  deleteNote: async (noteId) => {
    try {
      await notesAPI.delete(noteId);
      await useNoteStore.getState().fetchNotes();
    } catch (err) {
      console.log('Error', err);
      set({ error: 'Failed to archive note' });
    }
  },

  restoreNote: async (noteId) => {
    try {
      await notesAPI.restore(noteId);
      await useNoteStore.getState().fetchNotes(true);
    } catch (err) {
      console.log('Error', err);
      set({ error: 'Failed to restore note' });
    }
  },
  getPublicNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await notesAPI.getPublic();
      set({ publicNotes: res.data, isLoading: false });
    } catch (err) {
      console.log('Error', err);
      set({ error: 'Failed to get public note' });
    }
  },

  resetState: () => set({ notes: [], selectedNote: null, error: null }),
}));
