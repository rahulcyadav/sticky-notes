import React, { useCallback, useRef } from "react";
import { Note } from "../components/Note/Note";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useNoteManagement } from "../hooks/useNoteManagement";
import classes from "./StickyNotesApp.module.css";
import { TrashZone } from "./TrashZone";
import { Toolbar } from "./Toolbar";
import AppBar from "../components/AppBar";

const StickyNotesApp: React.FC = () => {
  const workspaceRef = useRef<HTMLDivElement>(null);

  const { notes, createNote, updateNote, deleteNote, overlapNote } =
    useNoteManagement();

  const { dragState, startDrag, drag, endDrag } = useDragAndDrop(workspaceRef);

  const onCreateNote = useCallback(() => {
    const position = {
      x: 0,
      y: 0,
    };
    createNote(position);
  }, [createNote]);

  const onDelete = useCallback(
    (id: string) => {
      deleteNote(id);
      endDrag();
    },
    [deleteNote, endDrag]
  );

  return (
    <div className={classes.StickyNotesApp}>
      <AppBar
        title="sticky notes"
        toolbar={<Toolbar onCreateNote={onCreateNote} />}
      />

      <main
        ref={workspaceRef}
        className={classes.Workspace}
        aria-label="sticky notes workspace"
      >
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            updateNote={updateNote}
            deleteNote={deleteNote}
            overlapNote={overlapNote}
            startDrag={startDrag}
            drag={drag}
            dragState={dragState}
          />
        ))}

        {/* empty state */}
        {notes.length === 0 && (
          <div className={classes.EmptyStateContainer}>
            <div className={classes.EmptyState}>
              <h2>no notes</h2>
              <button onClick={onCreateNote} aria-label="create new note">
                <span>new note</span>
              </button>
            </div>
          </div>
        )}

        <TrashZone onDelete={onDelete} dataKey="text" />
      </main>
    </div>
  );
};

export default StickyNotesApp;
