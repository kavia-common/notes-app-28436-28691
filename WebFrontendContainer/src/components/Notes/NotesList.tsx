import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listNotes, deleteNote } from "../../services/api";
// Using runtime JS; types are optional during build and not imported

type Props = {
  onError: (msg: string) => void;
};

const NotesList: React.FC<Props> = ({ onError }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("page_size") || 10);
  const search = searchParams.get("search") || "";

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await listNotes({ page, page_size: pageSize, search });
      // The API spec returns an array; if pagination meta is not available, we'll just display array
      setNotes(Array.isArray(data) ? data : data?.items || []);
    } catch (e: any) {
      onError(e?.response?.data?.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    setSearchParams({ page: "1", page_size: String(pageSize), search: input.value });
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      await fetchNotes();
    } catch (e: any) {
      onError(e?.response?.data?.message || "Failed to delete note.");
    }
  };

  return (
    <div className="container" style={{ padding: 16 }}>
      <form onSubmit={onSubmitSearch} style={{ marginBottom: 12 }}>
        <input
          name="q"
          defaultValue={search}
          placeholder="Search notes..."
          aria-label="Search notes"
          style={{ padding: 8, width: "60%", maxWidth: 420 }}
        />
        <button type="submit" className="theme-toggle" style={{ marginLeft: 8, padding: "8px 12px" }}>
          Search
        </button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <div>No notes found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((n) => (
            <li key={n.id} style={{ border: "1px solid var(--border-color)", padding: 12, borderRadius: 8, marginBottom: 10, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <Link to={`/notes/${n.id}`} style={{ fontWeight: 600, textDecoration: "none" }}>{n.title}</Link>
                  <div style={{ color: "gray", fontSize: 12 }}>{new Date(n.updated_at || n.created_at).toLocaleString()}</div>
                  {n.summary && <div style={{ fontStyle: "italic", marginTop: 6 }}>Summary: {n.summary}</div>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/notes/${n.id}`} className="App-link">View</Link>
                  <Link to={`/notes/${n.id}/edit`} className="App-link">Edit</Link>
                  <button onClick={() => onDelete(n.id)} className="theme-toggle" style={{ padding: "6px 10px" }}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          disabled={page <= 1}
          onClick={() => setSearchParams({ page: String(page - 1), page_size: String(pageSize), search })}
          className="theme-toggle"
          style={{ padding: "6px 10px", opacity: page <= 1 ? 0.6 : 1 }}
        >
          Prev
        </button>
        <div style={{ alignSelf: "center" }}>Page {page}</div>
        <button
          onClick={() => setSearchParams({ page: String(page + 1), page_size: String(pageSize), search })}
          className="theme-toggle"
          style={{ padding: "6px 10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotesList;
