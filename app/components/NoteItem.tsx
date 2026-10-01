// Bonus #2: a separate component for one note.
export type Note = { id: number; title: string; description: string };

type NoteItemProps = {
  note: Note;                          // the note data
  onEdit: (note: Note) => void;        // function from page.tsx
  onDelete: (id: number) => void;      // function from page.tsx
};

export default function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  return (
    <li className="note">
      <h3>{note.title}</h3>
      <p>{note.description}</p>
      <div className="note-actions">
        <button className="btn small" onClick={() => onEdit(note)}>Edit</button>
        <button className="btn small ghost" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </li>
  );
}