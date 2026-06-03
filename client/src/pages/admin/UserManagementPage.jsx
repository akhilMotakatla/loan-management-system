import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import UserTable from '../../components/admin/UserTable.jsx';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(r => { setUsers(r.data.data.users); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-display text-3xl font-bold text-platinum mb-8">User <span className="gold-text">Management</span></h1>
      <div className="glass-card rounded-sm p-4">
        <UserTable data={users} loading={loading} />
      </div>
    </div>
  );
}
