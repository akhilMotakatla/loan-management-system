import { useState } from 'react';
import { useAuthStore } from '../../store/authStore.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import { initials } from '../../utils/formatters.js';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.put('/users/me', form);
      updateUser(data.data); toast.success('Profile updated');
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const changePassword = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put('/users/me/password', pwdForm);
      toast.success('Password changed');
      setPwdForm({ currentPassword: '', newPassword: '' });
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-display text-3xl font-bold text-platinum mb-8">My <span className="gold-text">Profile</span></h1>

      <div className="glass-card rounded-sm p-8 mb-6">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center text-navy-deep text-2xl font-bold">
            {initials(user?.firstName, user?.lastName)}
          </div>
          <div>
            <h2 className="text-platinum text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-muted">{user?.email}</p>
            <p className="text-xs mt-1 capitalize">
              KYC: <span className={user?.kycStatus === 'verified' ? 'text-emerald' : 'text-amber'}>{user?.kycStatus}</span>
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input label="Last Name"  value={form.lastName}  onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </div>

      <div className="glass-card rounded-sm p-8">
        <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Change Password</h3>
        <form onSubmit={changePassword} className="space-y-4">
          <Input label="Current Password" type="password" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
          <Input label="New Password" type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
          <Button type="submit" loading={loading} variant="outline">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
