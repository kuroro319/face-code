-- ============================================================
-- FACE CODE Supabase マイグレーション
-- Supabase ダッシュボード → SQL Editor で実行してください
-- ============================================================

-- 1. 無料コンテンツキャッシュ（恋愛傾向・仕事運）
CREATE TABLE IF NOT EXISTS free_content (
  type_code VARCHAR(4) PRIMARY KEY,
  love      TEXT NOT NULL,
  fortune   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. コメント
CREATE TABLE IF NOT EXISTS comments (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type_code  VARCHAR(4) NOT NULL,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username   TEXT NOT NULL,
  content    TEXT NOT NULL,
  likes      INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_type_code_idx ON comments(type_code);

-- 3. コメントいいね
CREATE TABLE IF NOT EXISTS comment_likes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(comment_id, user_id)
);

-- 4. いいね増減用ストアドプロシージャ
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS void AS $$
  UPDATE comments SET likes = likes + 1 WHERE id = comment_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id UUID)
RETURNS void AS $$
  UPDATE comments SET likes = GREATEST(0, likes - 1) WHERE id = comment_id;
$$ LANGUAGE sql;

-- 5. RLS（Row Level Security）設定
ALTER TABLE free_content   ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes   ENABLE ROW LEVEL SECURITY;

-- free_content: 全員読み取り可、書き込みはservice_roleのみ
CREATE POLICY "free_content_read" ON free_content FOR SELECT USING (true);

-- comments: 全員読み取り可、認証済みユーザーのみ自分のコメントを投稿・削除可
CREATE POLICY "comments_read"   ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- comment_likes: 認証済みユーザーのみ操作可
CREATE POLICY "likes_read"   ON comment_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "likes_insert" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- [リセット用] 職業定義を更新した後に実行してください
-- free_content をクリアすると次回アクセス時に Claude が再生成します
-- ============================================================
-- TRUNCATE TABLE free_content;
