import { useCallback, useEffect, useMemo, useState } from "react";
import { AUTO_SAVE_DELAY, DEFAULT_NOTE_SIZE } from "../constants";
import { APIService } from "../services/APIService";
import { StorageService } from "../services/StorageService";
import type { INote, IPosition } from "../types";
import { NoteUtils } from "../utilities/NoteUtils";

export const useNoteManagement = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const highestZIndex = useMemo(() => {
    return Math.max(...notes.map((note) => note.zIndex), 0);
  }, [notes]);

  // initialize notes from localStorage
  useEffect(() => {
    const savedNotes = StorageService.loadNotes();
    if (savedNotes.length > 0) {
      setNotes(savedNotes);
    }
  }, []);

  // sync notes
  useEffect(() => {
    // sync notes to localStorage
    StorageService.saveNotes(notes);

    // sync notes to API
    const syncTimer = setTimeout(async () => {
      try {
        await APIService.syncNotes(notes);
      } catch (error) {
        console.error("Failed to sync notes to API:", error);
      }
    }, AUTO_SAVE_DELAY);

    return () => clearTimeout(syncTimer);
  }, [notes]);

  const createNote = useCallback(
    (position: IPosition) => {
      const newNote: INote = {
        id: NoteUtils.generateNoteId(),
        position: position,
        size: DEFAULT_NOTE_SIZE,
        content: "",
        color: NoteUtils.generateNoteColor(),
        zIndex: highestZIndex + 1,
      };

      setNotes((prev) => [...prev, newNote]);

      APIService.createNote(newNote).catch(console.error);
    },
    [highestZIndex]
  );

  const updateNote = useCallback((id: string, updates: Partial<INote>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));

    try {
      await APIService.deleteNote(id);
    } catch (error) {
      console.error("Failed to delete note from API:", error);
    }
  }, []);

  const overlapNote = useCallback(
    (id: string) => {
      const newZIndex = highestZIndex + 1;
      updateNote(id, { zIndex: newZIndex });
    },
    [highestZIndex, updateNote]
  );

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    overlapNote,
  };
};
