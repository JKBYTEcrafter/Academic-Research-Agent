from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.5
)

def run(state):

    methodology = state["agent_outputs"]["methodology"]

    prompt = f"""
    Create a budget and timeline for this research project.

    Methodology:
    {methodology}

    Give an estimated budget in rupees
    Give proper timeline, when to do what
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["budget"] = response.content

    return state