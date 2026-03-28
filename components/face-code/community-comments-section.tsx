"use client"

import { useState } from "react"
import { MessageCircle, Send, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Comment {
  id: number
  username: string
  avatar: string
  content: string
  timestamp: string
  likes: number
}

interface CommunityCommentsSectionProps {
  typeName: string
}

const sampleComments: Comment[] = [
  {
    id: 1,
    username: "さくら",
    avatar: "S",
    content: "めっちゃ当たってる！特に「注目されたい」ってとこ笑",
    timestamp: "2時間前",
    likes: 24
  },
  {
    id: 2,
    username: "みゆき",
    avatar: "M",
    content: "私も同じタイプでした！仲間がいて嬉しい",
    timestamp: "5時間前",
    likes: 18
  },
  {
    id: 3,
    username: "あやか",
    avatar: "A",
    content: "創造性のところ、すごく共感します。アート系の仕事してます",
    timestamp: "8時間前",
    likes: 31
  },
  {
    id: 4,
    username: "れいな",
    avatar: "R",
    content: "SNSの反応気にしちゃうの、分かりすぎて笑った",
    timestamp: "12時間前",
    likes: 42
  },
  {
    id: 5,
    username: "はるか",
    avatar: "H",
    content: "承認欲求のくだり、刺さりました...気をつけます",
    timestamp: "1日前",
    likes: 15
  },
  {
    id: 6,
    username: "なつみ",
    avatar: "N",
    content: "同じタイプの有名人、好きな人ばかりで嬉しい！",
    timestamp: "1日前",
    likes: 56
  }
]

const avatarColors = [
  "from-[#E8A0A0] to-[#D4847B]",
  "from-[#D4847B] to-[#C67068]",
  "from-[#7EB8C9] to-[#5FA3B8]",
  "from-[#A889BD] to-[#9070A8]",
  "from-[#E8C0A0] to-[#D4A87B]",
  "from-[#A8BD89] to-[#90A870]",
]

export function CommunityCommentsSection({ typeName }: CommunityCommentsSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(sampleComments)
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      username: "あなた",
      avatar: "あ",
      content: newComment,
      timestamp: "たった今",
      likes: 0
    }
    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleLike = (commentId: number) => {
    setLikedComments(prev => {
      const next = new Set(prev)
      if (next.has(commentId)) {
        next.delete(commentId)
      } else {
        next.add(commentId)
      }
      return next
    })
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-[#E8A0A0]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-5 h-5 text-[#E8A0A0]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground/90 mb-2">
            みんなのコメント
          </h2>
          <p className="text-foreground/50 text-sm">
            {typeName}タイプの仲間たちの声
          </p>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8A0A0] to-[#D4847B] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">あ</span>
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1 rounded-full border-foreground/10 bg-[#FFF8F5] focus:border-[#E8A0A0] focus:ring-[#E8A0A0]/20"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-[#E8A0A0] hover:bg-[#D4847B] text-white"
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">送信</span>
              </Button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-2xl bg-[#FFF8F5] hover:bg-[#FFF0ED] transition-colors"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-sm font-medium">{comment.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground/80 text-sm">
                    {comment.username}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-1 text-foreground/40 hover:text-[#E8A0A0] transition-colors self-start pt-1"
              >
                <Heart
                  className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-[#E8A0A0] text-[#E8A0A0]' : ''}`}
                />
                <span className="text-xs">
                  {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
