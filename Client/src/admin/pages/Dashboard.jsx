import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/admin/users").then(res => setUsers(res.data));
    API.get("/admin/premium-users").then(res => setPremiumUsers(res.data));
  }, []);

  const chartData = useMemo(() => {
    const map = {};

    users.forEach(u => {
      const key = new Date(u.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      if (!map[key]) map[key] = { month: key, users: 0, premium: 0 };
      map[key].users++;
    });

    premiumUsers.forEach(p => {
      const key = new Date(p.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });
      if (!map[key]) map[key] = { month: key, users: 0, premium: 0 };
      map[key].premium++;
    });

    return Object.values(map);
  }, [users, premiumUsers]);

  const filteredUsers = useMemo(() => {
    if (filter === "premium") return users.filter(u => u.isPremium);
    if (filter === "free") return users.filter(u => !u.isPremium);
    return users;
  }, [filter, users]);

  return (
    <div className="p-6 space-y-8 bg-[#f7f7f8] min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Total Users" value={users.length} />
        <Stat title="Premium Users" value={premiumUsers.length} accent />
        <Stat title="Free Users" value={users.length - premiumUsers.length} />
      </div>

      <div className="bg-white rounded-2xl p-4 border shadow-sm">
        <div className="text-lg font-semibold mb-3 text-gray-900">
          Users Growth (Monthly)
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#4b5563" }} />
            <YAxis tick={{ fill: "#4b5563" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="premium" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterBtn>
        <FilterBtn active={filter === "premium"} onClick={() => setFilter("premium")}>
          Premium
        </FilterBtn>
        <FilterBtn active={filter === "free"} onClick={() => setFilter("free")}>
          Free
        </FilterBtn>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Premium</th>
              <th className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-gray-500">{u.email}</td>
                <td className="p-3 text-center">{u.role}</td>
                <td className="p-3 text-center">
                  {u.isPremium ? (
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                      Yes
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      No
                    </span>
                  )}
                </td>
                <td className="p-3 text-gray-500">
                  {new Date(u.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Stat({ title, value, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-3xl font-bold ${accent ? "text-emerald-600" : "text-gray-900"}`}>
        {value}
      </div>
    </div>
  );
}

function FilterBtn({ children, active, ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-full text-sm font-medium transition
        ${active
          ? "bg-emerald-600 text-white"
          : "bg-white border text-gray-700 hover:bg-gray-100"
        }`}
    >
      {children}
    </button>
  );
}
