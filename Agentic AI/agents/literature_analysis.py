from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

def run(state):

    literature = state["agent_outputs"]["literature"]

    prompt = f"""
    Analyze the following literature.

    Identify:
    - key trends
    - common methods
    - limitations

    Literature:
    {literature}

    Instead of writing Paper 1,2.... like this, write the paper titles.
    """

    response = llm.invoke(prompt)

    state["agent_outputs"]["literature_analysis"] = response.content

    return state