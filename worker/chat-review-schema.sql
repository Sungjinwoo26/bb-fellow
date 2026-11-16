CREATE TABLE IF NOT EXISTS chat_review (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 question TEXT NOT NULL,
 question_key TEXT NOT NULL,
 answer TEXT NOT NULL,
 answer_mode TEXT NOT NULL,
 status TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS chat_review_question_key ON chat_review(question_key);
CREATE INDEX IF NOT EXISTS chat_review_created_at ON chat_review(created_at);
