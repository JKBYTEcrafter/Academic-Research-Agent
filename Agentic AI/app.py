from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

from graph import build_research_graph, build_proposal_graph

research_graph = build_research_graph()
proposal_graph = build_proposal_graph()

from agents.planner import run as planner_agent
from agents.literature_retrieval import run as literature_retrieval_agent
from agents.literature_analysis import run as literature_analysis_agent
from agents.research_gap import run as research_gap_agent
from agents.novelty import run as novelty_agent
from agents.methodology import run as methodology_agent
from agents.funding_alignment import run as funding_agent
from agents.budget import run as budget_agent
from agents.writer import run as writer_agent

app = Flask(__name__)
CORS(app)


@app.route("/run-agent", methods=["POST"])
def run_agent():

    data = request.json
    topic = data.get("topic")
    agent = data.get("agent")

    state = {
        "topic": topic,
        "agent_outputs": {}
    }

    try:

        if agent == "planning":
            state = planner_agent(state)
            output = state["agent_outputs"]["planner_output"]

        elif agent == "retrieval":
            state = literature_retrieval_agent(state)
            output = state["agent_outputs"]["literature"]

        elif agent == "methodology":
            state = methodology_agent(state)
            output = state["agent_outputs"]["methodology"]

        elif agent == "funding":
            state = funding_agent(state)
            output = state["agent_outputs"]["funding_alignment"]

        # Graph-based: chain through the research pipeline up to the requested step
        elif agent == "analysis":
            state = literature_retrieval_agent(state)
            state = literature_analysis_agent(state)
            output = state["agent_outputs"]["literature_analysis"]

        elif agent == "gap":
            state = literature_retrieval_agent(state)
            state = literature_analysis_agent(state)
            state = research_gap_agent(state)
            output = state["agent_outputs"]["research_gap"]

        elif agent == "novelty":
            state = literature_retrieval_agent(state)
            state = literature_analysis_agent(state)
            state = research_gap_agent(state)
            state = novelty_agent(state)
            output = state["agent_outputs"]["novelty_evaluation"]

        elif agent == "budget":
            state = methodology_agent(state)
            state = budget_agent(state)
            output = state["agent_outputs"]["budget"]

        elif agent == "writer":
            result = proposal_graph.invoke(state)
            output = result["agent_outputs"]["proposal"]

        else:
            output = "Invalid agent."

        return jsonify({"output": output})

    except Exception as e:
        return jsonify({"output": str(e)}), 500


@app.route("/run-full", methods=["POST"])
def run_full():
    """Run the complete proposal pipeline and return all agent outputs."""

    data = request.json
    topic = data.get("topic")

    state = {
        "topic": topic,
        "agent_outputs": {}
    }

    try:
        result = proposal_graph.invoke(state)
        outputs = result["agent_outputs"]

        return jsonify({
            "planning": outputs.get("planner_output", ""),
            "retrieval": outputs.get("literature", ""),
            "analysis": outputs.get("literature_analysis", ""),
            "gap": outputs.get("research_gap", ""),
            "novelty": outputs.get("novelty_evaluation", ""),
            "funding": outputs.get("funding_alignment", ""),
            "methodology": outputs.get("methodology", ""),
            "budget": outputs.get("budget", ""),
            "writer": outputs.get("proposal", ""),
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)