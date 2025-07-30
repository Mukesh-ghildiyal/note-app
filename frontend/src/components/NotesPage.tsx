import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast, Toaster } from "react-hot-toast";
import { Trash2, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/notes/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.data.notes);
        setUser(res.data.data.user);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load notes");
      }
    };
    fetchData();
  }, []);

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) {
      toast.error("Please enter a note title");
      return;
    }

    try {
      const res = await API.post(
        "/notes",
        { title: newNote.title.trim(), content: newNote.content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([res.data.data.note, ...notes]);
      setNewNote({ title: "", content: "" });
      setIsCreateDialogOpen(false);
      toast.success("Note created successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await API.delete(`/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== noteId));
      toast.success("Note deleted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    toast.success("Signed out successfully!");
    navigate("/login");
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                  <circle cx="12" cy="12" r="4" />
                </g>
              </svg>
              <span className="text-xl font-bold text-gray-800">HD</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome, {userName}!</h1>
            <p className="text-gray-600 text-sm">{userEmail}</p>
          </div>

          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Note
          </button>

          <div className="space-y-3">
            <h2 className="text-lg font-medium text-gray-800">Notes</h2>
            {notes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-gray-500">No notes yet. Create your first note!</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                      {note.content && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {note.content}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
                  <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                    <circle cx="12" cy="12" r="4" />
                  </g>
                </svg>
                <span className="text-xl font-bold text-gray-800">HD</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
              <h1 className="text-xl font-semibold text-gray-800 mb-1">Welcome, {userName}!</h1>
              <p className="text-gray-600 text-sm">{userEmail}</p>
            </div>

            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </button>
          </div>
          
          <div className="border-t p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Notes</h2>
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No notes yet. Create your first note!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="bg-white rounded-lg shadow-sm p-4 group hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                        {note.content && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {note.content}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600 mb-6">
                Welcome to your notes dashboard. Select or create a note to get started.
              </p>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-500">
                Your notes will appear in the sidebar. Click "Create Note" to add your first note.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Note Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Create New Note</h2>
              <p className="text-gray-600 text-sm">Add a new note to your collection.</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Note content (optional)"
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage; 