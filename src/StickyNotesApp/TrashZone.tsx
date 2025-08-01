import classes from "./TrashZone.module.css";

interface TrashZoneProps {
  onDelete: (id: string) => void;
}
export const TrashZone: React.FC<TrashZoneProps> = ({ onDelete }) => {
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDelete(e.dataTransfer.getData("text"));
  };

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
