import { useState, useEffect } from "react";

function Attendance() {
  const [families, setFamilies] = useState(() => {
    const saved = localStorage.getItem("attendance");

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return parsed.map((f) => ({
      name: f.name || "",
      members: Array.isArray(f.members) ? f.members : [],
    }));
  });

  const [familyName, setFamilyName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(families));
  }, [families]);

  // ADD FAMILY
  const addFamily = () => {
    if (!familyName) return;

    setFamilies([...families, { name: familyName, members: [] }]);
    setFamilyName("");
  };

  // ADD MEMBER
  const addMember = () => {
    if (!memberName || selectedFamily === null) return;

    const updated = [...families];
    updated[selectedFamily].members.push({
      name: memberName,
      present: false,
    });

    setFamilies(updated);
    setMemberName("");
  };

  // TOGGLE STATUS
  const toggleStatus = (familyIndex, memberIndex) => {
    const updated = [...families];
    updated[familyIndex].members[memberIndex].present =
      !updated[familyIndex].members[memberIndex].present;

    setFamilies(updated);
  };

  // DELETE MEMBER
  const deleteMember = (familyIndex, memberIndex) => {
    const updated = [...families];
    updated[familyIndex].members.splice(memberIndex, 1);
    setFamilies(updated);
  };

  // DELETE FAMILY
  const deleteFamily = (familyIndex) => {
    const updated = families.filter((_, i) => i !== familyIndex);
    setFamilies(updated);
  };

  // 🔥 COUNTS
  const totalFamilies = families.length;

  const totalMembers = families.reduce(
    (total, f) => total + (f.members ? f.members.length : 0),
    0
  );

  const totalPresent = families.reduce(
    (total, f) =>
      total +
      (f.members
        ? f.members.filter((m) => m.present).length
        : 0),
    0
  );

  const totalAbsent = totalMembers - totalPresent;

  return (
    <div className="p-5">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-200">
            Family Attendance
          </h1>

          <input
            type="text"
            placeholder="Search family or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 border border-white/30 text-gray-200 p-2 rounded w-64"
          />
        </div>

        {/* COUNTS */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl w-40">
            <p className="text-gray-400 text-sm">Families</p>
            <h2 className="text-2xl font-bold text-gray-200">
              {totalFamilies}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl w-40">
            <p className="text-gray-400 text-sm">Members</p>
            <h2 className="text-2xl font-bold text-gray-200">
              {totalMembers}
            </h2>
          </div>

          <div className="bg-green-500/20 border border-green-500/40 p-4 rounded-xl w-40">
            <p className="text-green-300 text-sm">Present</p>
            <h2 className="text-2xl font-bold text-green-400">
              {totalPresent}
            </h2>
          </div>

          <div className="bg-red-500/20 border border-red-500/40 p-4 rounded-xl w-40">
            <p className="text-red-300 text-sm">Absent</p>
            <h2 className="text-2xl font-bold text-red-400">
              {totalAbsent}
            </h2>
          </div>
        </div>

        {/* ADD FAMILY */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h2 className="text-gray-200 mb-2">Add Family</h2>

          <div className="flex gap-3">
            <input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Family Name"
              className="bg-white/10 border border-white/30 text-gray-200 p-2 rounded w-60"
            />

            <button
              onClick={addFamily}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* ADD MEMBER */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h2 className="text-gray-200 mb-2">Add Member</h2>

          <div className="flex gap-3 flex-wrap">
            <select
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-white/10 border border-white/30 text-gray-200 p-2 rounded"
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
              className="bg-white/10 border border-white/30 text-gray-200 p-2 rounded w-60"
            />

            <button
              onClick={addMember}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
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
              return (
                family.name.toLowerCase().includes(searchText) ||
                family.members?.some((m) =>
                  m.name.toLowerCase().includes(searchText)
                )
              );
            })
            .map((family, fIndex) => (
              <div
                key={fIndex}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-gray-200 font-semibold">
                    {family.name}
                  </h2>

                  <button
                    onClick={() => deleteFamily(fIndex)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>

                {!family.members || family.members.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No members added
                  </p>
                ) : (
                  family.members.map((member, mIndex) => (
                    <div
                      key={mIndex}
                      className="flex justify-between items-center border-b border-white/10 py-2"
                    >
                      <span className="text-gray-200">
                        {member.name}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toggleStatus(fIndex, mIndex)
                          }
                          className={`px-3 py-1 rounded text-sm text-white ${
                            member.present
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {member.present ? "Present" : "Absent"}
                        </button>

                        <button
                          onClick={() =>
                            deleteMember(fIndex, mIndex)
                          }
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
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