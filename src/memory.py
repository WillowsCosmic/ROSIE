"""Long-term memory module for ROSIE agent."""

import os
import sqlite3
from typing import Any

from livekit.agents import RunContext, function_tool
from livekit.agents.llm import ToolError


class MemoryManager:
    """SQLite-backed long-term memory store for persistent user facts and context."""

    def __init__(self, db_path: str = "data/rosie_memory.db") -> None:
        self.db_path = db_path
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._get_connection() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS memories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category TEXT NOT NULL DEFAULT 'general',
                    key TEXT NOT NULL UNIQUE,
                    value TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            conn.commit()

    def save_fact(self, key: str, value: str, category: str = "general") -> None:
        key_clean = key.strip().casefold()
        val_clean = value.strip()
        with self._get_connection() as conn:
            conn.execute(
                """
                INSERT INTO memories (category, key, value, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET
                    category = excluded.category,
                    value = excluded.value,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (category, key_clean, val_clean),
            )
            conn.commit()

    def search_memories(self, query: str) -> list[dict[str, Any]]:
        q = f"%{query.strip().casefold()}%"
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT category, key, value, updated_at FROM memories
                WHERE key LIKE ? OR value LIKE ? OR category LIKE ?
                ORDER BY updated_at DESC
                """,
                (q, q, q),
            )
            rows = cursor.fetchall()
            return [dict(r) for r in rows]

    def get_all_memories(self) -> list[dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.execute(
                "SELECT category, key, value, updated_at FROM memories ORDER BY category, key"
            )
            rows = cursor.fetchall()
            return [dict(r) for r in rows]

    def get_formatted_context(self) -> str:
        memories = self.get_all_memories()
        if not memories:
            return "No long-term memories saved yet."

        lines = ["--- Rosie's Remembered Hearth Context ---"]
        for m in memories:
            lines.append(f"• [{m['category']}] {m['key']}: {m['value']}")
        return "\n".join(lines)


class MemoryTools:
    """Function tool wrappers for Rosie's long-term memory."""

    def __init__(self, memory_manager: MemoryManager) -> None:
        self.memory_manager = memory_manager

    @property
    def tools(self) -> list:
        return [
            self.remember_user_fact,
            self.recall_user_memory,
        ]

    @function_tool()
    async def remember_user_fact(
        self,
        context: RunContext,
        key: str,
        value: str,
        category: str = "preference",
    ) -> str:
        """Store or update a key fact, user preference, or project detail in Rosie's long-term memory.

        Use this whenever the user shares important information about themselves, their project,
        preferences, or instructions they want Rosie to remember for future sessions.

        Args:
            key: A short descriptor for the fact (e.g., 'user_name', 'favorite_color', 'current_project').
            value: The exact detail or preference to remember.
            category: Optional classification category (e.g., 'preference', 'project', 'instruction').
        """
        try:
            self.memory_manager.save_fact(key=key, value=value, category=category)
            return f"Successfully saved memory: {key} -> {value}"
        except Exception as exc:
            raise ToolError(f"Failed to save memory: {exc}") from exc

    @function_tool()
    async def recall_user_memory(
        self,
        context: RunContext,
        query: str,
    ) -> str:
        """Search Rosie's long-term memory store for previously saved facts or user details.

        Args:
            query: The keyword or topic to search for in Rosie's memory.
        """
        try:
            results = self.memory_manager.search_memories(query)
            if not results:
                return f"No memories found matching query {query!r}."

            mem_strings = [f"• {r['key']}: {r['value']}" for r in results]
            return f"Found memories for {query!r}:\n" + "\n".join(mem_strings)
        except Exception as exc:
            raise ToolError(f"Failed to recall memory: {exc}") from exc
