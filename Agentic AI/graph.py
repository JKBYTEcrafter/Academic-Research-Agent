from langgraph.graph import StateGraph, END

from agents import (
    literature_retrieval,
    literature_analysis,
    research_gap,
    novelty,
    methodology,
    budget,
    planner,
    funding_alignment,
    writer
)


def build_research_graph():

    builder = StateGraph(dict)

    builder.add_node("literature", literature_retrieval.run)
    builder.add_node("analysis", literature_analysis.run)
    builder.add_node("gap", research_gap.run)
    builder.add_node("novelty", novelty.run)

    builder.set_entry_point("literature")

    builder.add_edge("literature", "analysis")
    builder.add_edge("analysis", "gap")
    builder.add_edge("gap", "novelty")
    builder.add_edge("novelty", END)

    return builder.compile()


def build_proposal_graph():

    builder = StateGraph(dict)

    builder.add_node("planner", planner.run)
    builder.add_node("literature", literature_retrieval.run)
    builder.add_node("analysis", literature_analysis.run)
    builder.add_node("gap", research_gap.run)
    builder.add_node("novelty", novelty.run)
    builder.add_node("funding", funding_alignment.run)
    builder.add_node("methodology", methodology.run)
    builder.add_node("budget", budget.run)
    builder.add_node("writer", writer.run)

    builder.set_entry_point("planner")

    builder.add_edge("planner", "literature")
    builder.add_edge("literature", "analysis")
    builder.add_edge("analysis", "gap")
    builder.add_edge("gap", "novelty")
    builder.add_edge("novelty", "funding")
    builder.add_edge("funding", "methodology")
    builder.add_edge("methodology", "budget")
    builder.add_edge("budget", "writer")
    builder.add_edge("writer", END)

    return builder.compile()