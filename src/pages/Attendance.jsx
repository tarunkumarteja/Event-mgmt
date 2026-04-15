import { useState, useEffect } from "react";

function Attendance() {
  const deleteMember = (familyIndex, memberIndex) => {
  const updated = [...families];
  updated[familyIndex].members.splice(memberIndex, 1);
  setFamilies(updated);
};

const deleteFamily = (familyIndex) => {
  const updated = families.filter((_, i) => i !== familyIndex);
  setFamilies(updated);
};
 const [families, setFamilies] = useState(() => {
  const saved = localStorage.getItem("attendance");

  if (!saved) return [];

  const parsed = JSON.parse(saved);

  // 🔥 FIX: ensure members exists
  return parsed.map((f) => ({
    name: f.name || "",
    members: Array.isArray(f.members) ? f.members : [],
  }));
});

  const [familyName, setFamilyName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [selectedFamily, setSelectedFamily] = useState(null);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(families));
  }, [families]);

  // Add family
  const addFamily = () => {
    if (!familyName) return;

    setFamilies([
      ...families,
      { name: familyName, members: [] }
    ]);

    setFamilyName("");
  };

  // Add member
  const addMember = () => {
    if (!memberName || selectedFamily === null) return;

    const updated = [...families];
    updated[selectedFamily].members.push({
      name: memberName,
      present: false
    });

    setFamilies(updated);
    setMemberName("");
  };

  // Toggle present
  const toggleStatus = (familyIndex, memberIndex) => {
    const updated = [...families];
    updated[familyIndex].members[memberIndex].present =
      !updated[familyIndex].members[memberIndex].present;

    setFamilies(updated);
  };
  const [search, setSearch] = useState("");

 return (
  <div className="p-5">
    {/* OUTER GLASS CONTAINER */}
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg">

      {/* HEADER + SEARCH */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Family Attendance
        </h1>

        <input
          type="text"
          placeholder="Search family or member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/20 border border-white/30 text-white placeholder-gray-200 p-2 rounded w-64 focus:outline-none"
        />
      </div>

      {/* ADD FAMILY */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-2 text-white">
          Add Family
        </h2>

        <div className="flex gap-3">
          <input
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family Name"
            className="bg-white/20 border border-white/30 text-white placeholder-gray-200 p-2 rounded w-60"
          />

          <button
            onClick={addFamily}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>
      </div>

      {/* ADD MEMBER */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-2 text-white">
          Add Member
        </h2>

        <div className="flex gap-3 flex-wrap">
          <select
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="bg-white/20 border border-white/30 text-white p-2 rounded"
          >
            <option className="text-black">Select Family</option>
            {families.map((f, i) => (
              <option key={i} value={i} className="text-black">
                {f.name}
              </option>
            ))}
          </select>

          <input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Member Name"
            className="bg-white/20 border border-white/30 text-white placeholder-gray-200 p-2 rounded w-60"
          />

          <button
            onClick={addMember}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {families
          .filter((family) => {
            const searchText = search.toLowerCase();
            const familyMatch = family.name
              .toLowerCase()
              .includes(searchText);

            const memberMatch = family.members?.some((m) =>
              m.name.toLowerCase().includes(searchText)
            );

            return familyMatch || memberMatch;
          })
          .map((family, fIndex) => (
            <div
              key={fIndex}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
            >
              {/* FAMILY HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">
                  {family.name}
                </h2>

                <button
                  onClick={() => deleteFamily(fIndex)}
                  className="bg-red-500/70 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>

              {/* MEMBERS */}
              {!family.members || family.members.length === 0 ? (
                <p className="text-gray-300 text-sm">
                  No members added
                </p>
              ) : (
                family.members
                  .filter((member) =>
                    member.name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((member, mIndex) => (
                    <div
                      key={mIndex}
                      className="flex justify-between items-center border-b border-white/20 py-2"
                    >
                      <span className="text-white">
                        {member.name}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toggleStatus(fIndex, mIndex)
                          }
                          className={`px-3 py-1 rounded text-white text-sm ${
                            member.present
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {member.present
                            ? "Present"
                            : "Absent"}
                        </button>

                        <button
                          onClick={() =>
                            deleteMember(fIndex, mIndex)
                          }
                          className="bg-white/20 px-3 py-1 rounded text-white text-sm hover:bg-white/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          ))}
      </div>
    </div>
  </div>
);
}

export default Attendance;