from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3
)

def run(state):

    gap = state["agent_outputs"]["research_gap"]

    prompt = f"""
    Evaluate the novelty of addressing the following research gap:

    {gap}

    Explain new or innovative way of approaching this idea which has not been worked upon.
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["novelty_evaluation"] = response.content

    return state