"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");

      // console.log(res);
      
      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();
      console.log(data);
      
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch notes when page loads
  useEffect(() => {
    fetchNotes();
  }, []);

  // Create / Update note
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill all the data...");
      return;
    }

    try {
      setIsLoading(true);

      // =========================
      // UPDATE NOTE
      // =========================
      if (editingId) {
        console.log("Updating note:", editingId);
        console.log("Title:", title);
        console.log("Content:", content);

        const res = await fetch(`/api/notes/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
          }),
        });

        const data = await res.json();

        console.log("Update response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to update note");
        }

        alert("Note updated successfully");

        // Clear form
        setTitle("");
        setContent("");
        setEditingId(null);

        // Refresh notes
        await fetchNotes();
      }

      // =========================
      // CREATE NOTE
      // =========================
      else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
          }),
        });

        const data = await res.json();

        console.log("Create response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to create note");
        }

        alert("Note created successfully");

        // Clear form
        setTitle("");
        setContent("");

        // Refresh notes
        await fetchNotes();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // EDIT NOTE
  // =========================
  const handleEdit = (note) => {
    console.log("Editing note:", note);

    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  // =========================
  // DELETE NOTE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      console.log("Delete response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      alert("Note deleted successfully");

      await fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);

      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            MY NOTES
          </h1>

          <p className="text-gray-400 mt-2">
            Create and manage your notes
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-md font-bold text-yellow-500 mb-2">
                Title
              </label>

              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-md font-bold text-yellow-500 mb-2">
                Content
              </label>

              <textarea
                rows="5"
                placeholder="Enter your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              {/* Cancel */}
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition duration-200"
              >
                {isLoading
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                  ? "Update Note"
                  : "Add Note"}
              </button>

            </div>
          </form>
        </div>

        {/* Notes */}
        <div className="mt-10">

          <h2 className="text-2xl font-bold text-white mb-5">
            Your Notes
          </h2>

          {/* No notes */}
          {notes.length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400">
                No notes found. Create your first note!
              </p>
            </div>
          ) : (

            /* Notes Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-5 shadow-md hover:border-yellow-500 transition"
                >

                  {/* Title */}
                  <h3 className="text-xl font-bold text-yellow-500 mb-3">
                    {note.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-300 leading-relaxed mb-5">
                    {note.content}
                  </p>

                  {/* Timestamp */}
                  {note.createdAt && (
                    <p className="text-xs text-gray-500 mb-4">
                      Created:{" "}
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(note._id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}