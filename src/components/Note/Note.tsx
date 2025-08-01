import { useCallback, useEffect, useRef } from "react";
import type { IDragState, INote, IPosition } from "../../types";
import { NoteUtils } from "../../utilities/NoteUtils";
import classes from "./Note.module.css";
import { MAX_NOTE_SIZE, MIN_NOTE_SIZE } from "../../constants";

interface NoteProps {
  note: INote;
  updateNote: (id: string, updates: Partial<INote>) => void;
  deleteNote: (id: string) => void;
  overlapNote: (id: string) => void;
  startDrag: (
    event: React.MouseEvent,

    position: IPosition
  ) => void;
  drag: (event: React.DragEvent<HTMLElement>) => IPosition;
  dragState: IDragState;
}

export const Note: React.FC<NoteProps> = ({
  note,
  updateNote,
  overlapNote,
  dragState,
  startDrag,
  drag,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // use native textarea resize for note resize
  useEffect(() => {
    function updateSize() {
      if (textareaRef.current) {
        updateNote(note.id, {
          size: NoteUtils.confineSize({
            height: textareaRef.current.offsetHeight,
            width: textareaRef.current.offsetWidth,
          }),
        });
      }
    }
    const resizeObserver = new ResizeObserver(updateSize);

    if (textareaRef.current) {
      resizeObserver.observe(textareaRef.current);
    }

    return () => {
      resizeObserver.disconnect(); // disconnect the observer when component unmounts
    };
  }, [note.id, updateNote]);

  const onChangeContent = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNote(note.id, { content: event.target.value });
    },
    [note.id, updateNote]
  );

  const onDragEnd = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (dragState.isDragging) {
        const result = drag(e);

        updateNote(note.id, { position: result });
      }
    },
    [dragState.isDragging, drag, note.id, updateNote]
  );

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.dataTransfer.setData("text", note.id);
    },
    [note.id]
  );

  const onMouseDown = useCallback(() => {
    overlapNote(note.id);
  }, [note.id, overlapNote]);

  const onMouseDownDragHandle = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      startDrag(e, note.position);
    },
    [note.position, startDrag]
  );

  return (
    <article
      className={classes.Note}
      style={{
        left: note.position.x,
        top: note.position.y,
        zIndex: note.zIndex,
      }}
      onMouseDown={onMouseDown}
      aria-label={`sticky note: ${note.content || "empty note"}`}
      tabIndex={0}
      draggable={dragState.isDragging}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <header
        className={classes.NoteHeader}
        onMouseDown={onMouseDownDragHandle}
      >
        <h6 className={classes.NoteTitle}>{note.id}</h6>
      </header>

      <textarea
        ref={textareaRef}
        value={note.content}
        onChange={onChangeContent}
        placeholder="type your note here..."
        className={classes.NoteTextarea}
        style={{
          backgroundColor: note.color,
          width: note.size.width,
          height: note.size.height,
          maxWidth: MAX_NOTE_SIZE.width,
          maxHeight: MAX_NOTE_SIZE.height,
          minWidth: MIN_NOTE_SIZE.width,
          minHeight: MIN_NOTE_SIZE.height,
        }}
        aria-label="note content"
      />
    </article>
  );
};
