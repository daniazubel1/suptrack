import React, { useState } from 'react';
import { useSup } from '../context/SupContext';
import { supplementDB } from '../data/supplementDB';
import { Copy, Check, Database, Upload, AlertCircle, Share2 } from 'lucide-react';

export default function Settings() {
    const { exportData, importData } = useSup();
    const [copied, setCopied] = useState(false);
    const [importString, setImportString] = useState('');
    const [importStatus, setImportStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    const handleCopy = () => {
        const data = exportData();
        navigator.clipboard.writeText(data).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleImport = () => {
        if (!importString) return;

        const result = importData(importString);
        if (result.success) {
            setImportStatus({ type: 'success', message: `Successfully imported ${result.count} supplements and history!` });
            setImportString('');
        } else {
            setImportStatus({ type: 'error', message: 'Invalid data format. Please check the JSON.' });
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-bold text-white">Settings</h2>

            {/* Export Section */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Database size={20} className="text-indigo-400" />
                    Backup & Export
                </h3>
                <p className="text-sm text-zinc-400">
                    Export your data to JSON format. Use this to move your data between devices or browsers.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl transition-colors border border-white/10"
                    >
                        {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>

                    {navigator.share && (
                        <button
                            onClick={() => {
                                const data = exportData();
                                navigator.share({ title: 'Suptrack Backup', text: data }).catch(() => { });
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <Share2 size={18} />
                            Share
                        </button>
                    )}
                </div>
            </div>

            {/* Import Section */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Upload size={20} className="text-emerald-400" />
                    Import Data
                </h3>
                <p className="text-sm text-zinc-400">
                    Paste your exported JSON data here to restore your stack and history.
                </p>

                <textarea
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                    placeholder='Paste JSON data here...'
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />

                {importStatus && (
                    <div className={`text-sm flex items-center gap-2 ${importStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {importStatus.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                        {importStatus.message}
                    </div>
                )}

                <button
                    onClick={handleImport}
                    disabled={!importString}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                >
                    Restore Data
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">App Info</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                    <p>Database Version: <span className="text-zinc-200">1.0.0</span></p>
                    <p>Total Supplements in DB: <span className="text-zinc-200">{supplementDB.length}</span></p>
                </div>
            </div>
        </div>
    );
}
