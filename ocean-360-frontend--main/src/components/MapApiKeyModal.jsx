import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';

export default function MapApiKeyModal({ isOpen, onClose, onSaveKey, currentKey, currentProvider, onSaveProvider }) {
  const [keyInput, setKeyInput] = useState(currentKey || '');
  const [provider, setProvider] = useState(currentProvider || 'carto');
  const [showKey, setShowKey] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    setKeyInput(currentKey || '');
    setProvider(currentProvider || 'carto');
  }, [currentKey, currentProvider, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKey(keyInput.trim());
    if (onSaveProvider) onSaveProvider(provider);
    setStatusMsg({ type: 'success', text: keyInput.trim() ? 'API key saved and applied to map tiles.' : 'Key cleared. Map using free public tiles.' });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
    setStatusMsg({ type: 'info', text: 'API key removed. Using free public tile tier.' });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-surface-300 rounded-2xl max-w-lg w-full p-5 md:p-6 space-y-4 shadow-2xl animate-slide-up text-text-primary"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-50 border border-accent-200 flex items-center justify-center text-accent">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Map Provider & API Key
              </h3>
              <p className="text-xs text-text-secondary">
                Configure CARTO or custom provider API keys for raster tiles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status notice */}
        {statusMsg && (
          <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
            statusMsg.type === 'success' ? 'bg-accent-50 text-accent border border-accent-200' : 'bg-surface-100 text-text-secondary border border-surface-300'
          }`}>
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Provider Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Map Provider
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProvider('carto')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                provider === 'carto'
                  ? 'bg-accent-50 text-accent border-accent-200 ring-1 ring-accent/30'
                  : 'bg-surface-50 text-text-secondary border-surface-300 hover:border-surface-400'
              }`}
            >
              <div>
                <div className="font-semibold text-text-primary">CARTO</div>
                <div className="text-[10px] text-text-tertiary">Light / Dark / Voyager</div>
              </div>
              {provider === 'carto' && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>

            <button
              type="button"
              onClick={() => setProvider('mapbox')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                provider === 'mapbox'
                  ? 'bg-accent-50 text-accent border-accent-200 ring-1 ring-accent/30'
                  : 'bg-surface-50 text-text-secondary border-surface-300 hover:border-surface-400'
              }`}
            >
              <div>
                <div className="font-semibold text-text-primary">Mapbox</div>
                <div className="text-[10px] text-text-tertiary">Access Token (pk.*)</div>
              </div>
              {provider === 'mapbox' && <Check className="w-3.5 h-3.5 text-accent" />}
            </button>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">
                {provider === 'carto' ? 'CARTO API Key / Access Token' : 'Mapbox Access Token'}
              </label>
              <a
                href={provider === 'carto' ? 'https://carto.com/' : 'https://account.mapbox.com/access-tokens/'}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent hover:underline flex items-center gap-1"
              >
                <span>Get key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={
                  provider === 'carto'
                    ? 'e.g. carto_live_key_... or default_public'
                    : 'e.g. pk.eyJ1...'
                }
                className="w-full text-xs font-mono bg-surface-50 border border-surface-300 rounded-lg px-3 py-2.5 pr-14 text-text-primary outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary hover:text-text-primary px-1"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>

            <p className="text-[11px] text-text-tertiary leading-relaxed">
              {provider === 'carto'
                ? 'Optional: CARTO tiles work free without a key. Providing a CARTO API key appends ?api_key= to all CARTO raster tile requests.'
                : 'Required if using Mapbox tiles: token will be appended as access_token=.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-200">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-text-tertiary hover:text-red-600 transition-colors"
            >
              Clear Key
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3.5 rounded-lg border border-surface-300 text-text-secondary hover:text-text-primary hover:bg-surface-50 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-map-key"
                className="h-9 px-4 rounded-lg bg-accent text-white hover:bg-accent-600 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Apply</span>
              </button>
            </div>
          </div>
        </form>

        {/* Security badge */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-text-tertiary border-t border-surface-100">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>Keys are stored locally in your browser's localStorage. Never sent to any external server.</span>
        </div>
      </div>
    </div>
  );
}
