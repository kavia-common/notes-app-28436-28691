import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listNotes, deleteNote } from "../../services/api";

type Props = {
  onError: (msg: string) => void;
};

const NotesList: React.FC<Props> = ({ onError }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("page_size") || 9);
  const searchParam = searchParams.get("search") || "";

  // local input state with debounce
  const [q, setQ] = useState(searchParam);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await listNotes({ page, page_size: pageSize, search: searchParam });
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
  }, [page, pageSize, searchParam]);

  // Debounce apply of searchParam from q
  useEffect(() => {
    const id = setTimeout(() => {
      if (q !== searchParam) {
        setSearchParams({ page: "1", page_size: String(pageSize), search: q });
      }
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(id);
      await fetchNotes();
    } catch (e: any) {
      onError(e?.response?.data?.message || "Failed to delete note.");
    }
  };

  const skeletons = useMemo(() => new Array(6).fill(0), []);

  return (
    <main className="section">
      <div className="container stack">
        <div className="toolbar">
          <div className="row">
            <div className="card" style={{ padding: 8, flex: 1 }}>
              <label htmlFor="search" className="label">Search notes</label>
              <input
                id="search"
                className="input"
                placeholder="Type a title, content, or keyword..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search notes"
              />
            </div>
          </div>
          <div className="row-right">
            <Link to="/notes/new" className="btn btn-primary">New Note</Link>
          </div>
        </div>

        {loading ? (
          <div className="grid" role="status" aria-live="polite">
            {skeletons.map((_, i) => (
              <div className="card note-card" key={i}>
                <div className="skeleton" style={{ height: 18, width: "65%" }} />
                <div className="skeleton" style={{ height: 12, width: "40%" }} />
                <div className="skeleton" style={{ height: 80, width: "100%" }} />
                <div className="row">
                  <div className="skeleton" style={{ height: 32, width: 80 }} />
                  <div className="skeleton" style={{ height: 32, width: 80 }} />
                  <div className="skeleton" style={{ height: 32, width: 80 }} />
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div className="h2">No notes yet</div>
            <p className="muted" style={{ marginTop: 8 }}>Try creating your first note or adjust your search.</p>
            <div style={{ marginTop: 12 }}>
              <Link to="/notes/new" className="btn btn-primary">Create a note</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid" role="list">
              {notes.map((n) => (
                <article className="card note-card" role="listitem" key={n.id}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <Link to={`/notes/${n.id}`} className="note-title">{n.title}</Link>
                    <span className="badge">Updated</span>
                  </div>
                  <div className="note-meta">
                    {new Date(n.updated_at || n.created_at).toLocaleString()}
                  </div>
                  {n.summary ? (
                    <div className="note-summary">Summary: {n.summary}</div>
                  ) : (
                    <div className="muted" style={{ fontSize: 13 }}>No summary generated yet.</div>
                  )}
                  <div className="row">
                    <Link to={`/notes/${n.id}`} className="btn btn-ghost">View</Link>
                    <Link to={`/notes/${n.id}/edit`} className="btn btn-ghost">Edit</Link>
                    <button onClick={() => onDelete(n.id)} className="btn btn-danger" aria-label={`Delete note ${n.title}`}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="row-right" style={{ marginTop: 8 }}>
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setSearchParams({ page: String(page - 1), page_size: String(pageSize), search: searchParam })}
                aria-label="Previous page"
              >
                Prev
              </button>
              <div className="muted" aria-live="polite" style={{ minWidth: 80, textAlign: "center" }}>Page {page}</div>
              <button
                className="btn"
                onClick={() => setSearchParams({ page: String(page + 1), page_size: String(pageSize), search: searchParam })}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default NotesList;
