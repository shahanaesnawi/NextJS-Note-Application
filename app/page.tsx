"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import NoteItem, { Note } from "./components/NoteItem";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [loaded, setLoaded] = useState(false);  

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes, loaded]);

  useEffect(() => {
    const name = title.trim().toLowerCase();
    const exists = notes.some(
      (n) => n.title.trim().toLowerCase() === name && n.id !== editingId
    );
    setIsDuplicate(name !== "" && exists);
  }, [title, notes, editingId]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || isDuplicate) return;

    if (editingId) {
      setNotes(notes.map((n) => (n.id === editingId ? { ...n, title, description } : n)));
    } else {
      setNotes([...notes, { id: Date.now(), title, description }]);
    }
    resetForm();
  }

  function handleEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
  }

  function handleDelete(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="stage">
      <div className="window">
        <div className="titlebar">
          <div className="tab">♥ notes</div>
          <div className="tab tab-inactive">★ by you</div>
          <span className="win-btns">– ▢ ✕</span>
        </div>
        <div className="addressbar">
          <span>☺</span>
          <div className="url">notetitle.com</div>
        </div>

        <div className="content">
          <h1 className="welcome">Note Diaries</h1>

          <form onSubmit={handleSubmit} className="form">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {isDuplicate && <p className="warn">A note with this title already exists.</p>}
            <div className="row">
              <button className="btn" type="submit" disabled={!title.trim() || isDuplicate}>
                {editingId ? "Save changes" : "Add note"}
              </button>
              {editingId && (
                <button className="btn ghost" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <p className="count">{notes.length} {notes.length === 1 ? "note" : "notes"}</p>

          {notes.length === 0 ? (
            <p className="empty">No notes yet. Add your first one above.</p>
          ) : (
            <ul className="notes">
              {notes.map((note) => (
                <NoteItem key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}