import React, { useState, useEffect, useRef } from 'react';
import { Bot, RefreshCw, Sparkles, Shield, Check, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TypewriterTraceProps {
  traceText: string;
  source: 'gemini_api' | 'fallback_template' | 'initial';
  onRegenerate?: () => Promise<void>;
}

export const TypewriterTrace: React.FC<TypewriterTraceProps> = ({
  traceText,
  source,
  onRegenerate,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTypewriter = (textToType: string) => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setIsStreaming(true);
    setDisplayedText('');

    let currentIndex = 0;
    const speed = 14; // ms per chunk

    streamTimerRef.current = setInterval(() => {
      if (currentIndex < textToType.length) {
        // Stream in small realistic character chunks
        const nextChunkLength = Math.min(Math.floor(Math.random() * 3) + 2, textToType.length - currentIndex);
        setDisplayedText(textToType.slice(0, currentIndex + nextChunkLength));
        currentIndex += nextChunkLength;
      } else {
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
        setIsStreaming(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (traceText) {
      startTypewriter(traceText);
    }
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [traceText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(traceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    if (onRegenerate && !isRefreshing) {
      setIsRefreshing(true);
      await onRegenerate();
      setIsRefreshing(false);
    } else {
      startTypewriter(traceText);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#141C3D] to-[#0E1530] border border-[#5B6CFF]/30 p-5 shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B6CFF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#9AA6D6]/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5B6CFF]/20 border border-[#5B6CFF]/40 flex items-center justify-center text-[#22D3EE]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-semibold text-sm text-[#E8ECFF]">
                Investigation Trace
              </h4>
              <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-[#5B6CFF]/15 text-[#22D3EE] border border-[#5B6CFF]/30">
                Layer C Explainability
              </span>
            </div>
            <p className="text-[11px] text-[#5F6B99]">
              Strictly neutral evidence synthesis • Max 120 words • Non-verdict
            </p>
          </div>
        </div>

        {/* Source and actions */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-code px-2 py-1 rounded bg-[#070B1A] text-[#9AA6D6] border border-[#9AA6D6]/15 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${source === 'gemini_api' ? 'bg-[#22D3EE] animate-pulse' : 'bg-[#FFB020]'}`} />
            {source === 'gemini_api' ? 'Gemini 3.8 Flash' : 'Deterministic Forensic Fallback'}
          </span>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isStreaming}
            className="p-1.5 rounded-lg bg-[#070B1A] hover:bg-[#141C3D] border border-[#9AA6D6]/15 text-[#9AA6D6] hover:text-[#E8ECFF] transition-all disabled:opacity-50"
            title="Re-stream / Re-synthesize explanation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#22D3EE]' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-[#070B1A] hover:bg-[#141C3D] border border-[#9AA6D6]/15 text-[#9AA6D6] hover:text-[#E8ECFF] transition-all"
            title="Copy Investigation Trace to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2DD4A3]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Streamed Text Content */}
      <div className="relative font-mono-code text-xs md:text-sm text-[#E8ECFF] leading-relaxed min-h-[5.5rem] bg-[#070B1A]/60 rounded-xl p-4 border border-[#9AA6D6]/10">
        <span>{displayedText}</span>
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-[#22D3EE] ml-1 align-middle animate-pulse" />
        )}
      </div>

      {/* Mandatory Statutory Attribution Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[#5F6B99] pt-2">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-[#FFB020]" />
          <span>Statutory Notice: System provides evidence tracing only. No black-box scores.</span>
        </span>
        <span className="text-[10px] text-[#9AA6D6]">
          {isStreaming ? 'Streaming token synthesis…' : 'Synthesized Trace Complete'}
        </span>
      </div>
    </div>
  );
};
