import os
import tempfile

import pytest

from memory import MemoryManager


@pytest.fixture
def temp_memory_db():
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name
    memory_mgr = MemoryManager(db_path=db_path)
    yield memory_mgr
    if os.path.exists(db_path):
        os.remove(db_path)


def test_save_and_retrieve_memory(temp_memory_db: MemoryManager):
    temp_memory_db.save_fact(
        category="user_preference", key="favorite_color", value="plum purple"
    )
    temp_memory_db.save_fact(
        category="project", key="current_project", value="ROSIE Fairytale AI"
    )

    memories = temp_memory_db.get_all_memories()
    assert len(memories) == 2

    search_res = temp_memory_db.search_memories("favorite_color")
    assert len(search_res) == 1
    assert search_res[0]["value"] == "plum purple"


def test_formatted_context(temp_memory_db: MemoryManager):
    temp_memory_db.save_fact(category="user_info", key="user_name", value="Developer")
    ctx = temp_memory_db.get_formatted_context()
    assert "user_name: Developer" in ctx
