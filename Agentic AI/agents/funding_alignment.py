from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

def run(state):

    topic = state["topic"]

    prompt = f"""
    Suggest funding agencies that may support research on:

    {topic}

    Explain why the topic aligns with their priorities.
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["funding_alignment"] = response.content

    return state