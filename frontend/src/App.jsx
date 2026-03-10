import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { useDataset } from './hooks/useDataset';
import ChatPanel from './components/ChatPanel';
import DashboardCanvas from './components/DashboardCanvas';
import UploadZone from './components/UploadZone';
import DataPreview from './components/DataPreview';

export default function App() {
  const { messages, charts, isLoading, sendMessage } = useChat();
  const { schema, isUploading, uploadResult, datasetName, uploadCSV } = useDataset();
  const [showUpload, setShowUpload] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const handleUpload = async (file) => {
    try {
      await uploadCSV(file);
      setShowUpload(false);
    } catch (err) {
      // Error is handled in useDataset
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-dt-bg-primary overflow-hidden">
      {/* ─── Top Bar ─── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-dt-bg-primary/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dt-accent-cyan to-dt-accent-green flex items-center justify-center">
            <svg className="w-4 h-4 text-dt-bg-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="text-lg font-sora font-bold text-dt-text-primary tracking-tight">
            Data<span className="text-dt-accent-cyan">Talk</span>
          </h1>

          {/* Dataset badge */}
          <div className="ml-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-dt-text-muted">
            {datasetName}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Schema toggle */}
          <button
            onClick={() => { setShowSchema(!showSchema); setShowUpload(false); }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showSchema ? 'bg-dt-accent-cyan/10 text-dt-accent-cyan' : 'text-dt-text-muted hover:text-dt-text-primary hover:bg-white/[0.04]'
            }`}
            title="View schema"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5V19A9 3 0 0 0 21 19V5" />
              <path d="M3 12A9 3 0 0 0 21 12" />
            </svg>
          </button>

          {/* Upload toggle */}
          <button
            onClick={() => { setShowUpload(!showUpload); setShowSchema(false); }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showUpload ? 'bg-dt-accent-green/10 text-dt-accent-green' : 'text-dt-text-muted hover:text-dt-text-primary hover:bg-white/[0.04]'
            }`}
            title="Upload CSV"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" /><path d="m16 16-4-4-4 4" />
            </svg>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg text-dt-text-muted hover:text-dt-text-primary hover:bg-white/[0.04] transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="w-[35%] min-w-[320px] max-w-[480px] border-r border-white/[0.06] flex flex-col">
          {/* Upload zone (conditional) */}
          {showUpload && (
            <UploadZone onUpload={handleUpload} isUploading={isUploading} />
          )}
          {/* Schema preview (conditional) */}
          {showSchema && (
            <DataPreview schema={schema} uploadResult={uploadResult} />
          )}
          {/* Chat */}
          <div className="flex-1 min-h-0">
            <ChatPanel
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Right Panel: Dashboard */}
        <div className="flex-1 bg-dt-bg-secondary/50">
          <DashboardCanvas charts={charts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
