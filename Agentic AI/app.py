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
from agents.methodology import run as methodology_agent
from agents.funding_alignment import run as funding_agent

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

        # Independent agents
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

        # Graph based agents
        elif agent == "analysis":
            result = research_graph.invoke(state)
            output = result["agent_outputs"]["literature_analysis"]

        elif agent == "gap":
            result = research_graph.invoke(state)
            output = result["agent_outputs"]["research_gap"]

        elif agent == "novelty":
            result = research_graph.invoke(state)
            output = result["agent_outputs"]["novelty_evaluation"]

        elif agent == "budget":
            result = proposal_graph.invoke(state)
            output = result["agent_outputs"]["budget"]

        elif agent == "writer":
            result = proposal_graph.invoke(state)
            output = result["agent_outputs"]["proposal"]

        else:
            output = "Invalid agent."

        return jsonify({"output": output})

    except Exception as e:
        return jsonify({"output": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)