import { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface Event {
  id: number;
  type: "image" | "xml";
  content_url?: string;
  content_text?: string;
  created_at: string;
}

export default function ManageEvents() {
  const { api } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState<"image" | "xml">("xml");
  const [contentText, setContentText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/events", {
        type: eventType,
        content_text: eventType === "xml" ? contentText : null,
      });
      setShowModal(false);
      fetchEvents();
      setContentText("");
      setImageFile(null);
      setEventType("xml");
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/api/admin/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-orange-400 to-red-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent neon-glow">
              Manage Events
            </h1>
            <p className="text-orange-100/70 mt-2">
              Create and manage department events and announcements
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
        >
          <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="neon-glow">Add Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="bg-gradient-to-br from-slate-900/80 via-orange-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <span className="ml-3 text-orange-400 neon-glow">
              Loading events...
            </span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="w-8 h-8 text-white/40" />
            </div>
            <span className="text-white/60">No events created yet</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-orange-400/50 transition-all duration-300"
              >
                {event.type === "image" && event.content_url ? (
                  <div className="relative">
                    <img
                      src={event.content_url}
                      alt="Event"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 bg-orange-500/80 rounded-full flex items-center justify-center">
                        <FiImage className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-400/30">
                        <FiFileText className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-orange-300 text-sm font-medium">
                        Announcement
                      </span>
                    </div>
                    <p className="text-white/90 leading-relaxed">
                      {event.content_text}
                    </p>
                  </div>
                )}
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white/60 text-xs">
                    {(() => {
                      try {
                        const date = new Date(event.created_at);
                        return isNaN(date.getTime())
                          ? "Date not available"
                          : date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                      } catch (error) {
                        return "Date not available";
                      }
                    })()}
                  </span>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-400/30 hover:border-red-400 transition-all duration-300"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 rounded-2xl p-8 max-w-lg w-full mx-4 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Add New Event
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-orange-300 mb-2">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) =>
                    setEventType(e.target.value as "image" | "xml")
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400/80 transition-all duration-500 outline-none"
                >
                  <option value="xml" className="bg-slate-800">
                    Text Announcement
                  </option>
                  <option value="image" className="bg-slate-800">
                    Image/Flyer
                  </option>
                </select>
              </div>

              {eventType === "xml" ? (
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Announcement Text
                  </label>
                  <textarea
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400/80 transition-all duration-500 outline-none"
                    rows={4}
                    placeholder="Enter announcement text..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-orange-300 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-orange-400/50 transition-colors duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="image-upload"
                      required
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <FiImage className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-white/60">
                        {imageFile
                          ? imageFile.name
                          : "Click to upload an image"}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setContentText("");
                    setImageFile(null);
                    setEventType("xml");
                  }}
                  className="flex-1 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
