CREATE TABLE IF NOT EXISTS chat_conversation_turns (
 conversation_id TEXT NOT NULL,
 turn_index INTEGER NOT NULL CHECK(turn_index > 0),
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 question TEXT NOT NULL,
 answer TEXT NOT NULL,
 input_source TEXT NOT NULL,
 selection_confirmed INTEGER NOT NULL DEFAULT 0,
 requested_product_ids TEXT NOT NULL DEFAULT '[]',
 selected_product_ids TEXT NOT NULL DEFAULT '[]',
 recommended_product_ids TEXT NOT NULL DEFAULT '[]',
 offered_product_ids TEXT NOT NULL DEFAULT '[]',
 response_choices TEXT NOT NULL DEFAULT '[]',
 answer_mode TEXT NOT NULL,
 cache_status TEXT,
 status TEXT NOT NULL,
 PRIMARY KEY(conversation_id, turn_index)
);
CREATE INDEX IF NOT EXISTS chat_conversation_turns_created_at ON chat_conversation_turns(created_at);
