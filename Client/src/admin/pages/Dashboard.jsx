import { useEffect, useState } from "react";
import API from "../../api/api";
import StatCard from "../components/StatCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/admin/users").then(r => setUsers(r.data));
    API.get("/payments/all").then(r => setPayments(r.data.payments));
  }, []);

  const totalRevenue = payments.reduce(
    (s, p) => s + (p.amount || 0),
    0
  );

  const premiumUsers = users.filter(u => u.isPremium).length;

  const revenueByMonth = {};
  payments.forEach(p => {
    const m = new Date(p.createdAt).toLocaleString("default", {
      month: "short"
    });
    revenueByMonth[m] = (revenueByMonth[m] || 0) + p.amount;
  });

  const revenueData = Object.keys(revenueByMonth).map(m => ({
    month: m,
    revenue: revenueByMonth[m]
  }));

  const usersByMonth = {};
  users.forEach(u => {
    const m = new Date(u.createdAt).toLocaleString("default", {
      month: "short"
    });
    usersByMonth[m] = (usersByMonth[m] || 0) + 1;
  });

  const userChartData = Object.keys(usersByMonth).map(m => ({
    month: m,
    users: usersByMonth[m]
  }));

  return (
    <div className="space-y-10">

    
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length}
          subtitle="All registered users"
          to="/admin/users"
          gradient="from-indigo-400 to-indigo-600"
        />

        <StatCard
          title="Premium Users"
          value={premiumUsers}
          subtitle="Active subscriptions"
          to="/admin/premium-users"
          gradient="from-emerald-400 to-emerald-600"
        />

        <StatCard
          title="Payments"
          value={payments.length}
          subtitle="Successful payments"
          gradient="from-sky-400 to-sky-600"
        />

        <StatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          subtitle="Total earnings"
          gradient="from-amber-400 to-amber-600"
        />
      </div>

    
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            User Growth
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Monthly new users
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userChartData}>
                <defs>
                  <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  dataKey="users"
                  type="monotone"
                  stroke="#6366F1"
                  fill="url(#userFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Revenue Growth
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Monthly earnings
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  stroke="#10B981"
                  fill="url(#revFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
