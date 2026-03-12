from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.5
)

def run(state):

    topic = state["topic"]
    planner = state["agent_outputs"]["planner_output"]
    literature = state["agent_outputs"]["literature_analysis"]
    gap = state["agent_outputs"]["research_gap"]
    novelty = state["agent_outputs"]["novelty_evaluation"]
    methodology = state["agent_outputs"]["methodology"]
    funding = state["agent_outputs"]["funding_alignment"]
    budget = state["agent_outputs"]["budget"]

    prompt = f"""
    Write a research grant proposal.

    {topic}

    Research Plan:
    {planner}

    Literature Review:
    {literature}

    Reserach Gap:
    {gap}
    
    Novelty Evaluation:
    {novelty}

    Methodology:
    {methodology}

    Funding:
    {funding}

    Budget and Timeline:
    {budget}
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["proposal"] = response.content

    return state