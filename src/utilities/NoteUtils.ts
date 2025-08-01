import { MAX_NOTE_SIZE, MIN_NOTE_SIZE, NOTE_COLORS } from "../constants";
import type { IPosition, ISize } from "../types";

export class NoteUtils {
  static getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }
  static generateNoteId(): string {
    return `note-${crypto.randomUUID()}`;
  }

  static generateNoteColor(): string {
    return NOTE_COLORS[this.getRandomIntInclusive(0, NOTE_COLORS.length - 1)];
  }

  static confinePosition(
    position: IPosition,
    note: ISize,
    workspace: ISize
  ): IPosition {
    return {
      x: Math.max(0, Math.min(position.x, workspace.width - note.width)),
      y: Math.max(0, Math.min(position.y, workspace.height - note.height)),
    };
  }

  static confineSize(size: ISize): ISize {
    return {
      width: Math.max(
        MIN_NOTE_SIZE.width,
        Math.min(size.width, MAX_NOTE_SIZE.width)
      ),
      height: Math.max(
        MIN_NOTE_SIZE.height,
        Math.min(size.height, MAX_NOTE_SIZE.height)
      ),
    };
  }
}
