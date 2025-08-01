import type { INote } from "../types";

export class StorageService {
  private static readonly STORAGE_KEY = "sticky_notes_data";

  static saveNotes(notes: INote[]): void {
    try {
      const serializedNotes = JSON.stringify(notes);
      localStorage.setItem(this.STORAGE_KEY, serializedNotes);
    } catch (error) {
      console.error("failed to save notes to localStorage:", error);
    }
  }

  static loadNotes(): INote[] {
    try {
      const serializedNotes = localStorage.getItem(this.STORAGE_KEY);
      return serializedNotes
        ? (JSON.parse(serializedNotes) satisfies INote[])
        : [];
    } catch (error) {
      console.error("failed to load notes from localStorage:", error);
      return [];
    }
  }
}
