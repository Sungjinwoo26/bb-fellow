ALTER TABLE chat_conversation_turns ADD COLUMN request_id TEXT;
CREATE INDEX IF NOT EXISTS chat_conversation_turns_request_id ON chat_conversation_turns(request_id);
