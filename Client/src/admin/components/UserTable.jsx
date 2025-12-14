import { useMemo, useState } from "react";

export default function UserTable({ users = [] }) {
  const [role, setRole] = useState("all");
  const [premium, setPremium] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchRole = role === "all" ? true : u.role === role;
      const matchPremium =
        premium === "all"
          ? true
          : premium === "premium"
          ? u.isPremium
          : !u.isPremium;

      return matchRole && matchPremium;
    });
  }, [users, role, premium]);

  return (
    <div className="space-y-5">

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="px-4 py-2 rounded-xl border text-sm bg-white"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>

        <select
          value={premium}
          onChange={e => setPremium(e.target.value)}
          className="px-4 py-2 rounded-xl border text-sm bg-white"
        >
          <option value="all">All Plans</option>
          <option value="premium">Premium</option>
          <option value="free">Free</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left font-semibold">User</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Plan</th>
              <th className="p-4 text-left font-semibold">Joined</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {filteredUsers.map(u => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">
                  {u.name || "—"}
                </td>

                <td className="p-4 text-gray-600">
                  {u.email}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      u.role === "admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="p-4">
                  {u.isPremium ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      Premium
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      Free
                    </span>
                  )}
                </td>

                <td className="p-4 text-xs text-gray-500">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No users found
          </div>
        )}

        {filteredUsers.map(u => (
          <div
            key={u._id}
            className="bg-white rounded-2xl border p-4 space-y-2 shadow-sm"
          >
            <div className="font-semibold text-gray-900">
              {u.name || "—"}
            </div>

            <div className="text-sm text-gray-600 break-all">
              {u.email}
            </div>

            <div className="flex gap-2 flex-wrap pt-2">
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  u.role === "admin"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {u.role}
              </span>

              {u.isPremium ? (
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                  Premium
                </span>
              ) : (
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  Free
                </span>
              )}
            </div>

            <div className="text-xs text-gray-400 pt-1">
              Joined:{" "}
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
