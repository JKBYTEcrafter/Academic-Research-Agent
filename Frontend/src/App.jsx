import React, { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import {
  Menu,
  X,
  Sparkles,
  Search,
  BookOpen,
  Microscope,
  Lightbulb,
  Target,
  FileText,
  Award,
  PiggyBank,
  Send,
  Loader2,
  Copy,
  Check,
  Download,
  Zap,
  ChevronRight,
  Brain,
  FlaskConical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const AGENTS = [
  {
    id: "planning",
    name: "Planning Agent",
    icon: <Target className="w-5 h-5" />,
    description: "Defines high-level objectives and a research plan.",
    placeholder: "Enter your research topic (e.g. 'Quantum computing in drug discovery')",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/40",
    glow: "shadow-blue-500/20",
    outputKey: "planner_output",
  },
  {
    id: "retrieval",
    name: "Literature Retrieval",
    icon: <Search className="w-5 h-5" />,
    description: "Searches academic databases for relevant research papers.",
    placeholder: "Enter your research topic to retrieve literature",
    color: "text-indigo-400",
    gradient: "from-indigo-500/20 to-indigo-600/10",
    border: "border-indigo-500/40",
    glow: "shadow-indigo-500/20",
    outputKey: "literature",
  },
  {
    id: "analysis",
    name: "Literature Analysis",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Extracts trends, methods and limitations from papers.",
    placeholder: "Enter your research topic to analyze literature",
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/40",
    glow: "shadow-purple-500/20",
    outputKey: "literature_analysis",
  },
  {
    id: "gap",
    name: "Research Gap Agent",
    icon: <Microscope className="w-5 h-5" />,
    description: "Identifies missing and unexplored research areas.",
    placeholder: "Enter your research topic to find gaps",
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/40",
    glow: "shadow-pink-500/20",
    outputKey: "research_gap",
  },
  {
    id: "novelty",
    name: "Novelty Evaluator",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Evaluates and scores the novelty of your research idea.",
    placeholder: "Enter your research topic to evaluate novelty",
    color: "text-rose-400",
    gradient: "from-rose-500/20 to-rose-600/10",
    border: "border-rose-500/40",
    glow: "shadow-rose-500/20",
    outputKey: "novelty_evaluation",
  },
  {
    id: "funding",
    name: "Funding Alignment",
    icon: <Award className="w-5 h-5" />,
    description: "Matches your proposal with relevant funding agencies.",
    placeholder: "Enter your research topic to find funding opportunities",
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-orange-600/10",
    border: "border-orange-500/40",
    glow: "shadow-orange-500/20",
    outputKey: "funding_alignment",
  },
  {
    id: "methodology",
    name: "Methodology Design",
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Designs a complete research methodology write-up.",
    placeholder: "Enter your research topic to design methodology",
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/40",
    glow: "shadow-amber-500/20",
    outputKey: "methodology",
  },
  {
    id: "budget",
    name: "Budget & Timeline",
    icon: <PiggyBank className="w-5 h-5" />,
    description: "Creates detailed cost and timeline estimates.",
    placeholder: "Enter your research topic to get budget & timeline",
    color: "text-teal-400",
    gradient: "from-teal-500/20 to-teal-600/10",
    border: "border-teal-500/40",
    glow: "shadow-teal-500/20",
    outputKey: "budget",
  },
  {
    id: "writer",
    name: "Proposal Writer",
    icon: <FileText className="w-5 h-5" />,
    description: "Writes the complete grant proposal document.",
    placeholder: "Enter your research topic to generate a full proposal",
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/40",
    glow: "shadow-emerald-500/20",
    outputKey: "proposal",
  },
];

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-gray-400 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

// ─── Download Button ──────────────────────────────────────────────────────────
function DownloadButton({ text, filename }) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "output.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      title="Download as Markdown"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 text-gray-400 hover:text-white"
    >
      <Download className="w-3.5 h-3.5" />
      Download
    </button>
  );
}

// ─── Output Card ─────────────────────────────────────────────────────────────
function OutputCard({ agent, text, isFullPipeline }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-slate-800/60 backdrop-blur rounded-2xl border ${agent.border} shadow-lg ${agent.glow} overflow-hidden`}
    >
      {/* Card Header */}
      <div className={`px-5 py-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-r ${agent.gradient}`}>
        <div className="flex items-center gap-3">
          <div className={`${agent.color} p-2 bg-white/5 rounded-lg`}>
            {agent.icon}
          </div>
          <div>
            <div className={`font-semibold text-sm ${agent.color}`}>{agent.name}</div>
            <div className="text-xs text-gray-500">{agent.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={text} />
          <DownloadButton
            text={text}
            filename={`${agent.id}-output.md`}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Welcome / Empty State ────────────────────────────────────────────────────
function WelcomeState({ agent }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center px-8 py-16"
    >
      {/* Animated glow orb */}
      <div className="relative mb-8">
        <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full bg-gradient-to-br ${agent.gradient}`} />
        <div className={`relative ${agent.color} p-6 bg-white/5 rounded-2xl border ${agent.border}`}>
          <div className="w-10 h-10">{agent.icon}</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">{agent.name}</h2>
      <p className="text-gray-400 max-w-md mb-6 leading-relaxed">{agent.description}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-4 py-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Type your research topic below and press Enter to generate
      </div>
    </motion.div>
  );
}

// ─── Full Pipeline Progress ───────────────────────────────────────────────────
function PipelineProgress({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
        </div>
        <div>
          <div className="font-semibold text-white text-sm">Running Full Pipeline</div>
          <div className="text-xs text-gray-400">
            Processing all 9 agents sequentially...
          </div>
        </div>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-2 text-right">{Math.round(progress)}% complete</div>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);          // single agent output
  const [pipelineOutputs, setPipelineOutputs] = useState(null); // full pipeline
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [mode, setMode] = useState("single"); // "single" | "pipeline"
  const contentRef = useRef(null);

  // Auto-scroll to new output
  useEffect(() => {
    if ((output || pipelineOutputs) && contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [output, pipelineOutputs]);

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setOutput(null);
    setPipelineOutputs(null);
    setInput("");
    // Auto-close on mobile
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setOutput(null);
    setPipelineOutputs(null);

    try {
      const response = await fetch(`${API_URL}/run-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input, agent: selectedAgent.id }),
      });

      const data = await response.json();
      setOutput(data.output || data.error || "No output received.");
    } catch {
      setOutput("⚠️ Error connecting to backend. Make sure the Flask server is running on port 5000.");
    }

    setIsProcessing(false);
  };

  const handleFullPipeline = async (e) => {
    e.preventDefault();
    if (!input.trim() || isPipelineRunning) return;

    setIsPipelineRunning(true);
    setOutput(null);
    setPipelineOutputs(null);
    setPipelineProgress(0);

    // Simulate progress while backend runs
    const progressInterval = setInterval(() => {
      setPipelineProgress((prev) => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + 5;
      });
    }, 2000);

    try {
      const response = await fetch(`${API_URL}/run-full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input }),
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setPipelineProgress(100);

      // Map keys to agent configs
      const results = AGENTS.map((agent) => ({
        agent,
        text: data[agent.id] || "",
      })).filter((r) => r.text);

      setTimeout(() => {
        setPipelineOutputs(results);
        setIsPipelineRunning(false);
      }, 500);
    } catch {
      clearInterval(progressInterval);
      setPipelineOutputs([{
        agent: AGENTS[0],
        text: "⚠️ Error connecting to backend. Make sure the Flask server is running on port 5000.",
      }]);
      setIsPipelineRunning(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (mode === "pipeline") handleFullPipeline(e);
      else handleSubmit(e);
    }
  };

  const isLoading = isProcessing || isPipelineRunning;

  return (
    <div className="flex h-screen bg-[#0d0f1a] text-white overflow-hidden font-sans">

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed md:relative z-30 w-72 h-full bg-[#111827] border-r border-white/5 flex flex-col"
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight">
                Research<span className="text-indigo-400">Pilot</span>
              </h1>
              <p className="text-[10px] text-gray-500">AI Grant Assistant</p>
            </div>
          </div>
          <button
            className="md:hidden p-1 rounded-lg hover:bg-white/5 text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex rounded-xl bg-white/5 p-1 gap-1">
            <button
              onClick={() => { setMode("single"); setOutput(null); setPipelineOutputs(null); }}
              className={`flex-1 text-xs py-1.5 rounded-lg transition-all duration-200 font-medium ${
                mode === "single"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Single Agent
            </button>
            <button
              onClick={() => { setMode("pipeline"); setOutput(null); setPipelineOutputs(null); }}
              className={`flex-1 text-xs py-1.5 rounded-lg transition-all duration-200 font-medium ${
                mode === "pipeline"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Full Pipeline
            </button>
          </div>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {mode === "pipeline" && (
            <div className="px-3 py-3 mb-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium mb-1">
                <Zap className="w-3.5 h-3.5" />
                Full Pipeline Mode
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Runs all 9 agents sequentially and returns a complete research proposal.
              </p>
            </div>
          )}

          {AGENTS.map((agent, idx) => {
            const active = mode === "single" && selectedAgent.id === agent.id;
            return (
              <motion.button
                key={agent.id}
                whileHover={{ x: 2 }}
                onClick={() => {
                  if (mode === "single") handleAgentSelect(agent);
                }}
                disabled={mode === "pipeline"}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                  active
                    ? `bg-gradient-to-r ${agent.gradient} border ${agent.border}`
                    : mode === "pipeline"
                    ? "opacity-40 cursor-default"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <div className={`${agent.color} shrink-0`}>{agent.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${active ? "text-white" : ""}`}>
                    {agent.name}
                  </div>
                </div>
                {active && <ChevronRight className={`w-4 h-4 ${agent.color} shrink-0`} />}
                {mode === "pipeline" && (
                  <div className="text-[10px] text-gray-600 shrink-0">#{idx + 1}</div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FlaskConical className="w-3.5 h-3.5" />
            Powered by Gemini 2.5 Flash + LangGraph
          </div>
        </div>
      </motion.aside>

      {/* ── Main Area ── */}
      <main className="flex-1 flex flex-col relative min-w-0">

        {/* Header */}
        <header className="h-14 border-b border-white/5 flex items-center px-5 shrink-0 bg-[#0d0f1a]/80 backdrop-blur sticky top-0 z-10">
          <button
            className="mr-4 md:hidden p-1.5 rounded-lg hover:bg-white/5 text-gray-400"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            {mode === "pipeline" ? (
              <>
                <div className="p-1.5 bg-indigo-500/20 rounded-lg shrink-0">
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-sm text-white">Full Pipeline</h2>
                  <p className="text-xs text-gray-500 truncate">All 9 agents → Complete research proposal</p>
                </div>
              </>
            ) : (
              <>
                <div className={`${selectedAgent.color} shrink-0 p-1.5 bg-white/5 rounded-lg`}>
                  {selectedAgent.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-sm text-white truncate">{selectedAgent.name}</h2>
                  <p className="text-xs text-gray-500 truncate">{selectedAgent.description}</p>
                </div>
              </>
            )}
          </div>

          {/* Status dot */}
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-xs text-gray-500 hidden sm:block">
              {isLoading ? "Processing..." : "Ready"}
            </span>
          </div>
        </header>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-6 pb-44 w-full">

            {/* Pipeline progress indicator */}
            {isPipelineRunning && (
              <PipelineProgress currentStep={pipelineProgress} totalSteps={100} />
            )}

            {/* Pipeline outputs */}
            {pipelineOutputs && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3"
                >
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-emerald-300">Pipeline Complete!</div>
                    <div className="text-xs text-gray-400">All {pipelineOutputs.length} agents ran successfully.</div>
                  </div>
                  <div className="ml-auto">
                    <DownloadButton
                      text={pipelineOutputs.map(r => `# ${r.agent.name}\n\n${r.text}`).join("\n\n---\n\n")}
                      filename="full-research-proposal.md"
                    />
                  </div>
                </motion.div>

                {pipelineOutputs.map(({ agent, text }, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <OutputCard agent={agent} text={text} isFullPipeline />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Single agent output */}
            {output && !pipelineOutputs && (
              <OutputCard agent={selectedAgent} text={output} />
            )}

            {/* Welcome state */}
            {!output && !pipelineOutputs && !isLoading && (
              <WelcomeState agent={mode === "pipeline" ? {
                ...AGENTS[8],
                name: "Full Pipeline",
                description: "Run all 9 research agents in sequence to generate a complete grant proposal.",
                icon: <Zap className="w-5 h-5" />,
              } : selectedAgent} />
            )}

          </div>
        </div>

        {/* ── Input Bar ── */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-8 bg-gradient-to-t from-[#0d0f1a] via-[#0d0f1a]/95 to-transparent">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={mode === "pipeline" ? handleFullPipeline : handleSubmit}
              className="bg-[#111827] border border-white/10 rounded-2xl p-3 shadow-2xl focus-within:border-indigo-500/50 transition-all duration-300"
            >
              <textarea
                className="w-full bg-transparent outline-none resize-none px-2 py-1 text-white placeholder-gray-600 text-sm leading-relaxed"
                placeholder={
                  mode === "pipeline"
                    ? "Enter your research topic to run the full pipeline..."
                    : selectedAgent.placeholder
                }
                value={input}
                rows={2}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />

              <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1">
                <span className="text-[11px] text-gray-600">
                  {mode === "pipeline"
                    ? "⚡ Full pipeline · ~2-3 min"
                    : "↵ Enter to submit · Shift+Enter for new line"}
                </span>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                    mode === "pipeline"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      {mode === "pipeline" ? "Running Pipeline..." : "Generating..."}
                    </>
                  ) : mode === "pipeline" ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Run Full Pipeline
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}