import { useEffect, useState } from 'react';
import FileUpload from '../../components/ui/FileUpload.jsx';
import Select from '../../components/ui/Select.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { DOCUMENT_TYPES } from '../../config/constants.js';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters.js';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const statusIcon = { verified: CheckCircle, pending: Clock, rejected: XCircle };
const statusColor = { verified: 'text-emerald', pending: 'text-amber', rejected: 'text-ruby' };

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ documentType: '', documentName: '' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/documents').then(r => setDocs(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file || !form.documentType || !form.documentName) { toast.error('Fill all fields and select a file'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('documentType', form.documentType);
      fd.append('documentName', form.documentName);
      await api.post('/documents/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded!');
      setFile(null); setForm({ documentType: '', documentName: '' });
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Upload failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-display text-3xl font-bold text-platinum mb-8">My <span className="gold-text">Documents</span></h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={upload} className="glass-card rounded-sm p-6 space-y-4">
          <h3 className="text-platinum font-semibold text-sm tracking-widest uppercase">Upload New Document</h3>
          <Select label="Document Type" value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })} options={DOCUMENT_TYPES} placeholder="Select type" />
          <Input label="Document Name" value={form.documentName} onChange={(e) => setForm({ ...form, documentName: e.target.value })} placeholder="e.g. Passport" />
          <FileUpload onFile={setFile} label="Select File" />
          <Button type="submit" loading={loading} className="w-full">Upload</Button>
        </form>

        <div className="glass-card rounded-sm p-6">
          <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Uploaded Documents</h3>
          {docs.length === 0 && <p className="text-muted text-sm">No documents uploaded.</p>}
          <ul className="space-y-3">
            {docs.map((d) => {
              const Icon = statusIcon[d.verificationStatus] || Clock;
              return (
                <li key={d._id} className="flex items-center gap-3 py-3 border-b border-navy-mid last:border-0">
                  <FileText size={18} className="text-gold-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-platinum text-sm truncate">{d.documentName}</p>
                    <p className="text-muted text-xs capitalize">{d.documentType?.replace('_', ' ')} · {formatDate(d.createdAt)}</p>
                  </div>
                  <Icon size={16} className={statusColor[d.verificationStatus]} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
