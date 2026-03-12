from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

def run(state):

    topic = state["topic"]

    prompt = f"""
    List important recent research papers related to:

    {topic}

    Provide 5 papers with its abstract and also tell the source from where you are getting the paper.
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["literature"] = response.content

    return state