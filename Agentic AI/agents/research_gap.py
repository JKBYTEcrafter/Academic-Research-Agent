from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

def run(state):

    analysis = state["agent_outputs"]["literature_analysis"]

    prompt = f"""
    Based on the literature analysis below,
    identify research gaps.

    {analysis}
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["research_gap"] = response.content

    return state