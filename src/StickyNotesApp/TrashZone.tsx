import { useCallback } from "react";
import classes from "./TrashZone.module.css";

interface TrashZoneProps {
  onDelete: (id: string) => void;
  dataKey: string;
}
export const TrashZone: React.FC<TrashZoneProps> = ({ onDelete, dataKey }) => {
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDelete(e.dataTransfer.getData(dataKey));
    },
    [dataKey, onDelete]
  );

  return (
    <div
      className={classes.TrashZone}
      role="region"
      aria-label="delete zone - drag notes here to delete"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <span>trash zone</span>
    </div>
  );
};
