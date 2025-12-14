import { useEffect, useState } from "react";
import API from "../../api/api";
import UserTable from "../components/UserTable";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/users")
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">Loading users...</div>
    );
  }

  return <UserTable users={users} />;
}
