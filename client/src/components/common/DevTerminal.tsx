import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";

const HELP = `Available commands: help, about, projects, contact, clear`;

export default function DevTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>(["Welcome to Jirat's dev terminal. Type 'help' to get started."]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;
      if (!typing && e.key.toLowerCase() === "j" && !e.metaKey && !e.ctrlKey) {
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const run = (cmdRaw: string) => {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;
    let output = "";
    switch (cmd) {
      case "help":
        output = HELP;
        break;
      case "about":
        output = "Jirat Sitthiwetkiat — Junior Frontend Developer with a Software Testing mindset.";
        break;
      case "projects":
        output = "Check out Anonymous Talk and CID Hotel Wallet in the Projects section.";
        window.location.hash = "projects";
        break;
      case "contact":
        output = "Reach out via the GitHub, LinkedIn, or email icons in the footer.";
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      default:
        output = `Command not found: ${cmd}. Type 'help' for a list of commands.`;
    }
    setLines((prev) => [...prev, `$ ${cmdRaw}`, output]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-[90] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-ink-800 bg-ink-950 font-mono text-xs text-brand-400 shadow-2xl"
          role="dialog"
          aria-label="Developer terminal easter egg"
        >
          <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-900 px-3 py-2">
            <TerminalSquare size={14} />
            <span className="text-ink-300">jirat@portfolio:~</span>
            <button onClick={() => setOpen(false)} className="ml-auto text-ink-500 hover:text-white" aria-label="Close terminal">
              ×
            </button>
          </div>
          <div className="h-48 space-y-1 overflow-y-auto p-3">
            {lines.map((line, i) => (
              <p key={i} className="whitespace-pre-wrap text-ink-200">
                {line}
              </p>
            ))}
          </div>
          <form
            className="flex items-center gap-2 border-t border-ink-800 px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
            }}
          >
            <span className="text-brand-500">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-ink-100 outline-none"
              aria-label="Terminal command input"
              autoComplete="off"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
