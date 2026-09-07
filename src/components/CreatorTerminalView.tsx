import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, ExternalLink, Mail, Github, Code, Sparkles, User } from 'lucide-react';

export const CreatorTerminalView: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; output: React.ReactNode }>>([
    {
      cmd: 'fastfetch --developer',
      output: (
        <div className="space-y-1 text-slate-300">
          <div className="text-cyan-400 font-bold">ashraf@network-hub</div>
          <div className="text-slate-500">----------------------</div>
          <div><span className="text-slate-400 font-semibold">OS:</span> macOS Sonoma (Terminal Emulation)</div>
          <div><span className="text-slate-400 font-semibold">Host:</span> Front-End Architecture & Network Utility</div>
          <div><span className="text-slate-400 font-semibold">Uptime:</span> 99.99% Reliable Client-Side Service</div>
          <div><span className="text-slate-400 font-semibold">Shell:</span> zsh 5.9 (x86_64-apple-darwin23.0)</div>
          <div><span className="text-slate-400 font-semibold">Terminal:</span> iTerm2 Dark Minimalist</div>
          <div><span className="text-slate-400 font-semibold">Developer:</span> Ashraf hossen jubaed</div>
        </div>
      )
    },
    {
      cmd: 'cat profile.json',
      output: (
        <div className="font-mono text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-500">{'{'}</span><br />
          &nbsp;&nbsp;<span className="text-cyan-400">"name"</span>: <span className="text-emerald-300">"Ashraf hossen jubaed"</span>,<br />
          &nbsp;&nbsp;<span className="text-cyan-400">"role"</span>: <span className="text-emerald-300">"Expert Front-End Web Developer & UI/UX Designer"</span>,<br />
          &nbsp;&nbsp;<span className="text-cyan-400">"email"</span>: <span className="text-amber-300">"ashrafhossenjubayed71@gmail.com"</span>,<br />
          &nbsp;&nbsp;<span className="text-cyan-400">"github"</span>: <span className="text-sky-300">"ashraf-dev71"</span>,<br />
          &nbsp;&nbsp;<span className="text-cyan-400">"specialties"</span>: [<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-300">"Client-Side SPAs"</span>, <span className="text-purple-300">"Performance Optimization"</span>, <span className="text-purple-300">"Modern UI/UX"</span><br />
          &nbsp;&nbsp;],<br />
          &nbsp;&nbsp;<span className="text-cyan-400">"status"</span>: <span className="text-emerald-400">"Available for projects & collaboration"</span><br />
          <span className="text-slate-500">{'}'}</span>
        </div>
      )
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputCommand.trim().toLowerCase();
    if (!cleanCmd) return;

    let output: React.ReactNode = null;

    switch (cleanCmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-slate-300">
            <div className="text-cyan-400 font-semibold">Available Terminal Commands:</div>
            <div>• <span className="text-amber-300 font-mono">about</span> : Developer summary & background</div>
            <div>• <span className="text-amber-300 font-mono">contact</span> : Email and collaboration channels</div>
            <div>• <span className="text-amber-300 font-mono">skills</span> : Core technical stack & tooling</div>
            <div>• <span className="text-amber-300 font-mono">github</span> : Direct GitHub profile link</div>
            <div>• <span className="text-amber-300 font-mono">clear</span> : Clear terminal history</div>
          </div>
        );
        break;
      case 'about':
        output = (
          <div className="text-slate-300 leading-relaxed">
            Ashraf hossen jubaed is an experienced front-end developer and designer specializing in responsive, client-side web applications, performance-driven web utilities, and clean UI/UX architectures.
          </div>
        );
        break;
      case 'contact':
        output = (
          <div className="space-y-1 text-slate-300">
            <div>Email: <span className="text-cyan-300 font-mono">ashrafhossenjubayed71@gmail.com</span></div>
            <div>GitHub: <span className="text-cyan-300 font-mono">https://github.com/ashraf-dev71</span></div>
          </div>
        );
        break;
      case 'skills':
        output = (
          <div className="space-y-1 text-slate-300">
            <div>• <span className="text-emerald-400">Core:</span> JavaScript (ES6+), TypeScript, HTML5, CSS3, Flexbox/Grid</div>
            <div>• <span className="text-cyan-400">Frameworks:</span> React, Tailwind CSS, Vite, Leaflet.js, Next.js</div>
            <div>• <span className="text-purple-400">Specialties:</span> SPAs, Responsive Auto-Scaling, UI Motion, Network APIs</div>
          </div>
        );
        break;
      case 'github':
        output = (
          <div className="text-slate-300">
            Opening GitHub... <a href="https://github.com/ashraf-dev71" target="_blank" rel="noreferrer" className="text-cyan-400 underline">https://github.com/ashraf-dev71</a>
          </div>
        );
        break;
      case 'clear':
        setCommandHistory([]);
        setInputCommand('');
        return;
      default:
        output = (
          <div className="text-rose-400 font-mono">
            zsh: command not found: {cleanCmd}. Type <span className="text-cyan-300 underline font-semibold">help</span> for available commands.
          </div>
        );
    }

    setCommandHistory((prev) => [...prev, { cmd: inputCommand, output }]);
    setInputCommand('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4">
      
      {/* Quick Profile Card Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-cyan-400 font-bold text-xl font-mono">
              AJ
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">Ashraf hossen jubaed</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Creator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Expert Front-End Web Developer & UI/UX Designer
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-copy-email"
            onClick={() => copyToClipboard('ashrafhossenjubayed71@gmail.com', 'email')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedField === 'email' ? 'Email Copied!' : 'Copy Email'}</span>
          </button>

          <a
            id="btn-open-github"
            href="https://github.com/ashraf-dev71"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Profile</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* macOS Terminal Window */}
      <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* macOS Window Title Bar */}
        <div className="h-10 bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center justify-between select-none">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80 transition-opacity" />
          </div>

          {/* Window Title */}
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>ashraf@network-hub: ~ (zsh)</span>
          </div>

          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto">
          
          {/* Welcome Banner */}
          <div className="text-slate-400 text-[11px] leading-relaxed border-b border-slate-800/60 pb-3">
            Last login: {new Date().toLocaleDateString()} on ttys001<br />
            Type <span className="text-cyan-400 font-bold">help</span> to list commands or use quick pill triggers below.
          </div>

          {/* Command History */}
          {commandHistory.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="text-slate-500">ashraf@network-terminal:~$</span>
                <span className="text-slate-200">{item.cmd}</span>
              </div>
              <div className="pl-4 border-l border-slate-800/60 py-1">
                {item.output}
              </div>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-slate-500 shrink-0">ashraf@network-terminal:~$</span>
            <input
              id="input-terminal-cmd"
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="type 'help', 'skills', 'contact', 'clear'..."
              className="flex-1 bg-transparent text-slate-200 focus:outline-none placeholder:text-slate-600 font-mono text-xs"
              autoComplete="off"
              spellCheck="false"
            />
          </form>

          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer with Quick Command Chips */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center gap-2">
          <span className="text-slate-500 text-[10px]">Quick Commands:</span>
          {['help', 'about', 'skills', 'contact', 'clear'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInputCommand(cmd);
                setTimeout(() => {
                  const form = document.querySelector('form');
                  form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }, 50);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] border border-slate-700/60 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

      </div>

      {/* Creator Contact Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Direct Email</div>
            <div className="text-xs font-semibold text-slate-200 truncate select-all">
              ashrafhossenjubayed71@gmail.com
            </div>
          </div>
          <button
            onClick={() => copyToClipboard('ashrafhossenjubayed71@gmail.com', 'email2')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title="Copy email"
          >
            {copiedField === 'email2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Github className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">GitHub Profile</div>
            <div className="text-xs font-semibold text-slate-200 truncate">
              @ashraf-dev71
            </div>
          </div>
          <a
            href="https://github.com/ashraf-dev71"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title="Open GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  );
};
