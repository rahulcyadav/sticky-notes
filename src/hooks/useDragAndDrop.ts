import { useCallback, useState } from "react";
import type { IDragState, IPosition } from "../types";
import { NoteUtils } from "../utilities/NoteUtils";

export const useDragAndDrop = (
  workspaceRef: React.RefObject<HTMLDivElement | null>
) => {
  const [dragState, setDragState] = useState<IDragState>({
    isDragging: false,
    offset: { x: 0, y: 0 },
  });

  const startDrag = useCallback(
    (event: React.MouseEvent, notePosition: IPosition) => {
      if (workspaceRef.current) {
        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        setDragState({
          isDragging: true,
          offset: {
            x: event.clientX - workspaceRect.left - notePosition.x,
            y: event.clientY - workspaceRect.top - notePosition.y,
          },
        });
      }
    },
    [workspaceRef]
  );

  const drag = useCallback(
    (event: React.DragEvent<HTMLElement>): IPosition => {
      if (workspaceRef.current && dragState.isDragging) {
        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        const noteRect = event.currentTarget.getBoundingClientRect();

        const newPosition = {
          x: event.clientX - workspaceRect.left - dragState.offset.x,
          y: event.clientY - workspaceRect.top - dragState.offset.y,
        };
        return NoteUtils.confinePosition(
          newPosition,
          { height: noteRect.height, width: noteRect.width },
          {
            width: workspaceRect.width,
            height: workspaceRect.height,
          }
        );
      }
      return { x: 0, y: 0 };
    },
    [dragState, workspaceRef]
  );

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      offset: { x: 0, y: 0 },
    });
  }, []);

  return { dragState, startDrag, drag, endDrag };
};
