from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

def run(state):

    topic = state["topic"]

    prompt = f"""
    Create a research plan for the topic:

    {topic}

    Include:
    - problem definition
    - objectives
    - key research questions
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["planner_output"] = response.content

    return state