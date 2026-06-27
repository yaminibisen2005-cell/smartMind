import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Cpu, 
  User, 
  Volume2, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { SUGGESTED_QUESTIONS } from "../data";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m_init",
      sender: "ai",
      text: "Hello! I am your Smart AI Traffic Cop assistant. Ask me anything about Mumbai traffic flow, smart parking, public transport schedules, or active green corridors! Try a suggested question below.",
      timestamp: "10:00 AM"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();
      
      const aiMsg: Message = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error in AI assistant conversation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate speech-to-text trigger
      handleSend("Is any Green Corridor active currently?");
    } else {
      setIsRecording(true);
      // Simulate active recording state, auto-sending in 4s if user doesn't toggle
      setTimeout(() => {
        setIsRecording(false);
      }, 4000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend(inputText);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start h-[calc(100vh-120px)]">
      
      {/* Chat workspace */}
      <div className="xl:col-span-8 flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Chat Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Gemini Traffic Cop assistant</h3>
              <span className="text-[10px] text-slate-500">Powered by gemini-3.5-flash model</span>
            </div>
          </div>
          
          <button 
            id="reset-chat"
            onClick={() => setMessages([messages[0]])}
            className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            title="Reset Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Message Board */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {messages.map((m) => {
            const isAI = m.sender === "ai";
            return (
              <div 
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border font-semibold text-xs ${
                  isAI 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-slate-950 text-white border-slate-800"
                }`}>
                  {isAI ? "🤖" : "👤"}
                </div>

                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                    isAI 
                      ? "bg-slate-950 text-slate-300 border-slate-900" 
                      : "bg-emerald-500 text-slate-950 font-medium border-emerald-400"
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 block px-1">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs animate-spin">
                ⏳
              </div>
              <div className="space-y-1">
                <div className="bg-slate-950 text-slate-500 p-3.5 rounded-2xl text-xs border border-slate-900 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce delay-100"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce delay-200"></span>
                  </div>
                  <span>AI Cop is calculating coordinates...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef}></div>
        </div>

        {/* Recording Waveform Overlay */}
        {isRecording && (
          <div className="bg-slate-950 border-t border-slate-900 px-5 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-mono text-rose-400 font-semibold uppercase">Microphone listening:</span>
            
            {/* Animated Waveform Lines */}
            <div className="flex-1 flex gap-0.5 items-end h-5">
              {[6, 12, 4, 18, 10, 22, 14, 5, 12, 18, 6, 14, 22, 10, 4, 12].map((h, i) => (
                <span 
                  key={i} 
                  className="w-1 bg-rose-500 rounded-full animate-pulse" 
                  style={{ 
                    height: `${h}px`, 
                    animationDelay: `${i * 100}ms`,
                    animationDuration: "0.8s"
                  }}
                ></span>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Will speak choice query...</span>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 bg-slate-950 border-t border-slate-900 shrink-0 flex items-center gap-3">
          <button 
            id="mic-speak-btn"
            onClick={handleMicToggle}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              isRecording 
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Voice Input Option"
          >
            {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>

          <input 
            id="chat-input"
            type="text"
            placeholder="Ask AI Cop about traffic speed, weather bottlenecks, parking slots..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
          />

          <button 
            id="chat-send-btn"
            onClick={() => handleSend(inputText)}
            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Suggested chips panel */}
      <div className="xl:col-span-4 space-y-6 h-full flex flex-col justify-between">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Suggested telemetry queries
          </h4>
          
          <div className="flex flex-col gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                id={`suggested-q-${i}`}
                onClick={() => handleSend(q)}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-950 text-left rounded-xl border border-slate-900 hover:border-slate-800 text-xs text-slate-400 hover:text-emerald-400 transition-all cursor-pointer font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Travel cop advice card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-2">
          <Volume2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-white uppercase font-mono">Hands-Free voice cop</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">Toggle the micro-terminal in hands-free mode. Commuters can query traffic alerts safely while maintaining steering wheel focus.</p>
        </div>
      </div>

    </div>
  );
}
