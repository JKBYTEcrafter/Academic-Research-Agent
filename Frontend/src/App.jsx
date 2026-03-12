import React, { useState } from "react";
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
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AGENTS = [
  {
    id: "planning",
    name: "Planning Agent",
    icon: <Target className="w-5 h-5" />,
    description:
      "Defines high-level objectives and gives a research plan.",
    placeholder: "Give the topic",
    color: "text-blue-400",
  },
  {
    id: "retrieval",
    name: "Literature Retrieval Agent",
    icon: <Search className="w-5 h-5" />,
    description: "Searches academic databases for relevant research.",
    placeholder: "Give the topic",
    color: "text-indigo-400",
  },
  {
    id: "analysis",
    name: "Literature Analysis Agent",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Extracts insights from papers.",
    placeholder: "Give the topic",
    color: "text-purple-400",
  },
  {
    id: "gap",
    name: "Research Gap Agent",
    icon: <Microscope className="w-5 h-5" />,
    description: "Identifies missing research areas.",
    placeholder: "Give the topic",
    color: "text-pink-400",
  },
  {
    id: "novelty",
    name: "Novelty Agent",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Evaluates research novelty.",
    placeholder: "Give the topic",
    color: "text-rose-400",
  },
  {
    id: "funding",
    name: "Funding Alignment Agent",
    icon: <Award className="w-5 h-5" />,
    description: "Matches proposal with funding goals.",
    placeholder: "Give the topic",
    color: "text-orange-400",
  },
  {
    id: "methodology",
    name: "Methodology Design Agent",
    icon: <Lightbulb className="w-5 h-5" />,
    description: "Gives a proper methodology write-up",
    placeholder: "Give the topic",
    color: "text-amber-400",
  },
  {
    id: "budget",
    name: "Budget & Timeline Agent",
    icon: <PiggyBank className="w-5 h-5" />,
    description: "Creates cost and timeline estimates.",
    placeholder: "Give the topic",
    color: "text-teal-400",
  },
  {
    id: "writer",
    name: "Proposal Writer Agent",
    icon: <FileText className="w-5 h-5" />,
    description: "Writes the final proposal.",
    placeholder: "Give the topic",
    color: "text-emerald-400",
  },
];

export default function App() {

  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentOutputs, setAgentOutputs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setOutput(null);

    try {

      const response = await fetch("http://localhost:5000/run-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: input,
          agent: selectedAgent.id
        })
      });

      const data = await response.json();

      const result = data.output;

      setAgentOutputs((prev) => [
        ...prev,
        { agent: selectedAgent.name, text: result }
      ]);

      setOutput(result);

    } catch (error) {

      setOutput("Error connecting to backend.");

    }

    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed md:relative z-30 w-72 h-full bg-slate-800 border-r border-white/10 flex flex-col pt-4 pb-6"
      >

        <div className="px-6 mb-6 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg">
              RESEARCH<span className="text-indigo-400"> PILOT</span>
            </h1>
          </div>

          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X/>
          </button>

        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">

          {AGENTS.map((agent) => {

            const active = selectedAgent.id === agent.id;

            return (

              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent);
                  setInput("");
                  setOutput(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition
                ${
                  active
                    ? "bg-indigo-500/20 border border-indigo-400"
                    : "hover:bg-white/5 text-gray-400"
                }`}
              >

                <div className={`${agent.color}`}>
                  {agent.icon}
                </div>

                <span className="text-sm">
                  {agent.name}
                </span>

              </button>

            );

          })}

        </div>

      </motion.aside>

      {/* Main */}

      <main className="flex-1 flex flex-col relative">

        <header className="h-16 border-b border-white/10 flex items-center px-6">

          <button
            className="mr-4 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu/>
          </button>

          <div className="flex items-center gap-3">

            <div className={`${selectedAgent.color}`}>
              {selectedAgent.icon}
            </div>

            <div>

              <h2 className="font-semibold text-lg">
                {selectedAgent.name}
              </h2>

              <p className="text-xs text-gray-400">
                {selectedAgent.description}
              </p>

            </div>

          </div>

        </header>

        {/* Content */}

        <div className="flex-1 overflow-y-auto p-8 max-w-4xl w-full mx-auto pb-40">

          {output && (

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 p-6 rounded-xl border border-white/10"
            >

              <div className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400"/>
                Agent Output
              </div>

              <div className="prose prose-invert max-w-none text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {output}
                </ReactMarkdown>
              </div>

            </motion.div>

          )}

        </div>

        {/* Input */}

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900">

          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 border border-white/10 rounded-xl p-3 flex flex-col"
          >

            <textarea
              className="bg-transparent outline-none resize-none p-3 text-white placeholder-gray-500"
              placeholder={selectedAgent.placeholder}
              value={input}
              rows={2}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {

                if (e.key === "Enter" && !e.shiftKey) {

                  e.preventDefault();
                  handleSubmit(e);

                }

              }}
            />

            <div className="flex justify-between items-center border-t border-white/10 pt-2">

              <span className="text-xs text-gray-400">
                Press Enter to submit
              </span>

              <button
                disabled={!input.trim() || isProcessing}
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >

                {isProcessing
                  ? <Loader2 className="animate-spin w-4 h-4"/>
                  : <Send className="w-4 h-4"/>
                }

                {isProcessing ? "Processing" : "Generate"}

              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}