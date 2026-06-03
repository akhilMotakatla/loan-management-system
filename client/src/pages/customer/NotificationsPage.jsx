import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../../utils/api.js';
import { formatDate } from '../../utils/formatters.js';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const load = () => api.get('/notifications').then(r => setNotifications(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markAll = async () => { await api.put('/notifications/read-all'); load(); toast.success('All marked as read'); };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-display text-3xl font-bold text-platinum"><span className="gold-text">Notifications</span></h1>
        {notifications.some(n => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={markAll}><CheckCheck size={14} /> Mark All Read</Button>
        )}
      </div>
      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="glass-card rounded-sm p-12 text-center text-muted">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        )}
        {notifications.map((n) => (
          <div key={n._id} className={`glass-card rounded-sm p-5 border border-transparent transition-all ${!n.isRead ? 'border-gold-primary/30 bg-gold-primary/5' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.isRead ? 'bg-gold-primary' : 'bg-muted'}`} />
                <div>
                  <p className="text-platinum text-sm font-medium">{n.title}</p>
                  <p className="text-muted text-xs mt-1">{n.message}</p>
                </div>
              </div>
              <p className="text-muted text-xs flex-shrink-0 ml-4">{formatDate(n.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
