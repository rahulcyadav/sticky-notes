import type { IAPIResponse, INote } from "../types";
import { NoteUtils } from "../utilities/NoteUtils";

export class APIService {
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private static randomDelay(): Promise<void> {
    return this.delay(NoteUtils.getRandomIntInclusive(1000, 3000));
  }
  private static occasionallyFail<T>(
    response: T,
    errorMsg: string
  ): IAPIResponse<T> {
    if (NoteUtils.getRandomIntInclusive(1, 5) === 1) {
      return { success: false, error: errorMsg };
    }
    return { success: true, data: response };
  }

  static async createNote(note: INote): Promise<IAPIResponse<INote>> {
    await this.randomDelay();
    return this.occasionallyFail(note, "failed to create note");
  }

  static async deleteNote(noteId: string): Promise<IAPIResponse<void>> {
    await this.randomDelay();
    return this.occasionallyFail(undefined, `failed to delete note ${noteId}`);
  }

  static async syncNotes(notes: INote[]): Promise<IAPIResponse<INote[]>> {
    await this.randomDelay();
    return this.occasionallyFail(notes, "failed to sync noted");
  }
}
