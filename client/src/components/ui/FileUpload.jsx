import { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export default function FileUpload({ onFile, accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx', label }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);

  const handle = (f) => { setFile(f); onFile?.(f); };

  return (
    <div>
      {label && <p className="text-silver text-sm mb-2">{label}</p>}
      <div
        className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all
          ${drag ? 'border-gold-primary bg-gold-primary/5' : 'border-navy-light hover:border-gold-dark'}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handle(e.target.files[0])} />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="text-gold-primary" size={24} />
            <span className="text-platinum text-sm">{file.name}</span>
            <button className="text-muted hover:text-ruby" onClick={(e) => { e.stopPropagation(); setFile(null); onFile?.(null); }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <Upload size={32} />
            <p className="text-sm">Drag & drop or click to upload</p>
            <p className="text-xs">PDF, JPG, PNG, DOC up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
