import logging

from dotenv import load_dotenv
from google.genai import types as genai_types
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    TurnHandlingOptions,
    cli,
    inference,
    room_io,
)
from livekit.agents.beta.tools import EndCallTool
from livekit.plugins import google

from browser import BrowserManager
from memory import MemoryManager, MemoryTools
from prompts import AGENT_INSTRUCTIONS
from tools import BrowserTools

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(
        self,
        browser: BrowserManager | None = None,
        memory: MemoryManager | None = None,
    ) -> None:
        self.browser = browser or BrowserManager(headless=False)
        self.memory = memory or MemoryManager()
        self.browser_tools = BrowserTools(self.browser)
        self.memory_tools = MemoryTools(self.memory)
        self._end_call_tool = EndCallTool(
            extra_description=(
                "Only end the call after the user clearly says they are finished, "
                "says goodbye, or directly asks to end the call."
            ),
            end_instructions=(
                "Give Rosie's brief, polite farewell, then end the call."
            ),
        )

        memory_context = self.memory.get_formatted_context()
        full_instructions = f"{AGENT_INSTRUCTIONS}\n\n{memory_context}"

        super().__init__(
            llm=google.beta.realtime.RealtimeModel(
                model="gemini-3.1-flash-live-preview",
                voice="Aoede",
                language="en-US",
                tool_response_scheduling=genai_types.FunctionResponseScheduling.WHEN_IDLE,
            ),
            instructions=full_instructions,
            tools=[
                *self.browser_tools.tools,
                *self.memory_tools.tools,
                *self._end_call_tool.tools,
            ],
        )


server = AgentServer()


@server.rtc_session(agent_name="rosie")
async def my_agent(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    browser = BrowserManager(headless=False)
    ctx.add_shutdown_callback(browser.close)

    session = AgentSession(
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
            interruption={"mode": "adaptive"},
            preemptive_generation={"enabled": True},
        ),
        expressive=True,
    )

    await session.start(
        agent=Assistant(browser),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            video_input=True,
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
