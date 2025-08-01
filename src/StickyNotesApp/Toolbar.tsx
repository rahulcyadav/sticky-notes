interface ToolbarProps {
  onCreateNote: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onCreateNote }) => (
  <div>
    <button onClick={onCreateNote} aria-label="create new note">
      <span>new note</span>
    </button>
  </div>
);
