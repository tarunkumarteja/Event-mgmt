import { useState, useEffect } from "react";

function Events() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!name || !date) return;

    setEvents([...events, { title: name, note, date }]);

    setName("");
    setNote("");
    setDate("");
  };

  const deleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const saveNote = (index) => {
    const updated = [...events];
    updated[index].note = editNote;
    setEvents(updated);
    setEditingIndex(null);
  };

  const highlightText = (text) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="bg-yellow-100 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredEvents = events
    .filter((e) => {
      const s = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(s) ||
        (e.date && e.date.toLowerCase().includes(s))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = filteredEvents.filter((e) => e.date > today);

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const month = new Date(event.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  return (
    <div className="p-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl text-gray-200">Events</h1>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />
        </div>

        {/* ADD EVENT */}
        <div className="flex flex-col gap-3 mb-6">
          <input
            placeholder="Event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <textarea
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-white/10 p-2 rounded"
          />

          <button
            onClick={addEvent}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Add Event
          </button>
        </div>

        {/* TODAY */}
        <h2 className="text-blue-400 mb-2">Today</h2>
        <div className="space-y-2 mb-6">
          {filteredEvents.filter((e) => e.date === today).length === 0 ? (
            <p className="text-gray-400 text-sm">No events today</p>
          ) : (
            filteredEvents
              .filter((e) => e.date === today)
              .map((e, i) => {
                const index = events.findIndex(
                  (ev) => ev.title === e.title && ev.date === e.date
                );

                return (
                  <div key={i} className="bg-blue-900/40 p-3 rounded">
                    {highlightText(e.title)} - {e.date}
                  </div>
                );
              })
          )}
        </div>

        {/* UPCOMING */}
        <h2 className="text-green-400 mb-2">Upcoming</h2>
        <div className="space-y-2 mb-6">
          {upcomingEvents.map((e, i) => (
            <div key={i} className="bg-green-900/30 p-3 rounded">
              {highlightText(e.title)} - {e.date}
            </div>
          ))}
        </div>

        {/* GROUPED */}
        {Object.keys(groupedEvents).map((month) => (
          <div key={month} className="mb-6">
            <h2 className="text-yellow-400 mb-2">{month}</h2>

            {groupedEvents[month].map((e) => {
              const index = events.findIndex(
                (ev) => ev.title === e.title && ev.date === e.date
              );

              return (
                <div
                  key={index}
                  className="bg-white/5 p-3 rounded border border-white/10"
                >
                  <div className="flex justify-between">
                    <span>{highlightText(e.title)}</span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditNote(e.note || "");
                        }}
                        className="text-blue-400 text-sm"
                      >
                        Note
                      </button>

                      <button
                        onClick={() => deleteEvent(index)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">{e.date}</p>

                  {editingIndex === index ? (
                    <div className="mt-2">
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="bg-white/10 p-2 rounded w-full"
                      />

                      <button
                        onClick={() => saveNote(index)}
                        className="mt-2 bg-green-600 px-2 py-1 rounded text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    e.note && <p className="text-sm mt-1">{e.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
}

export default Events;