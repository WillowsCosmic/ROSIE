from urllib.parse import urlencode
import logging
from livekit.agents import RunContext, function_tool
from livekit.agents.llm import ToolError
from langchain_community.tools import DuckDuckGoSearchRun

#from browser import BrowserError, BrowserManager
@function_tool
async def search_web(context: RunContext,query:str):
    """
    Use tis tool to search the web for information related to the given query.
    """

    try:
        result = DuckDuckGoSearchRun().run(tool_input=query)
        logging.info(f"Web search result for query '{query}':{result}")
        return result
    except Exception as e:
        logging.error(f"Error occured while searching the web for query '{query}':{e}")
        
