const KEYWORD = "text-pink-400";
const FUNC = "text-brand-400";
const STRING = "text-amber-300";
const PROP = "text-sky-300";
const COMMENT = "text-ink-500";
const PUNCT = "text-ink-400";

export default function CodeCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-950 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-ink-800 bg-ink-900 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-xs text-ink-400">Developer.tsx</span>
      </div>
      <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed sm:text-sm">
        <code>
          <span className={COMMENT}>{"// who's building this?"}</span>
          {"\n"}
          <span className={KEYWORD}>const</span> <span className={FUNC}>Developer</span> = () =&gt; {"{"}
          {"\n  "}
          <span className={KEYWORD}>return</span> {"{"}
          {"\n    "}
          <span className={PROP}>name</span>: <span className={STRING}>"Jirat Sitthiwetkiat"</span>,
          {"\n    "}
          <span className={PROP}>role</span>: <span className={STRING}>"Frontend Developer"</span>,
          {"\n    "}
          <span className={PROP}>mindset</span>: <span className={STRING}>"Quality First"</span>,
          {"\n    "}
          <span className={PROP}>stack</span>: [<span className={STRING}>"React"</span>, <span className={STRING}>"TypeScript"</span>,{" "}
          <span className={STRING}>"Tailwind"</span>],
          {"\n    "}
          <span className={PROP}>background</span>: <span className={STRING}>"QA + Frontend"</span>,
          {"\n  "}
          {"}"};
          {"\n"}
          {"}"};
          {"\n\n"}
          <span className={KEYWORD}>export default</span> <span className={FUNC}>Developer</span>
          <span className={PUNCT}>;</span>
          <span className="ml-1 inline-block h-4 w-2 animate-blink bg-brand-400 align-middle" aria-hidden="true" />
        </code>
      </pre>
    </div>
  );
}
