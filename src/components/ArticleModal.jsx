import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  Eye, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Send, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ArticleModal({ 
  article, 
  onClose, 
  isSaved, 
  onToggleBookmark, 
  onSelectRelated, 
  relatedArticles = [] 
}) {
  const [likes, setLikes] = useState(article?.likes || 120);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'DevGenZ', time: '12m ago', text: 'This is a huge milestone for the tech community! Great breakdown by GenZ Live.' },
    { id: 2, user: 'CyberNaut', time: '5m ago', text: 'Looking forward to seeing how this impacts AI development in India.' }
  ]);
  const [newComment, setNewComment] = useState('');

  if (!article) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        user: 'You (GenZ Reader)',
        time: 'Just now',
        text: newComment
      }
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
        {/* Modal Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="category-badge">
              {article.categoryName}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 hidden sm:inline">{article.publishedAt}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Reader Toggle */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPlayingAudio 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Pause Narration' : 'Listen'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-full border transition-colors ${
                isSaved 
                  ? 'bg-purple-600 border-purple-500 text-white' 
                  : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white relative"
              title="Share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Audio Bar Indicator if Playing */}
          {isPlayingAudio && (
            <div className="bg-cyan-950/60 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-cyan-300 animate-pulse">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Playing AI voice narration for <strong>"{article.title}"</strong></span>
              </div>
              <span className="font-mono text-[11px]">01:45 / 04:20</span>
            </div>
          )}

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-base text-slate-300 font-medium">
                {article.subtitle}
              </p>
            )}
          </div>

          {/* Author Meta */}
          <div className="flex items-center justify-between border-y border-white/10 py-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              {article.authorAvatar && (
                <img 
                  src={article.authorAvatar} 
                  alt={article.author}
                  className="w-10 h-10 rounded-full border border-purple-500/50 object-cover" 
                />
              )}
              <div>
                <span className="font-bold text-white block">{article.author}</span>
                {article.authorRole && <span className="text-purple-400">{article.authorRole}</span>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> {article.views}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-80 md:h-96 object-cover" 
            />
          </div>

          {/* Content Html Body */}
          <div 
            className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Action Engagement Bar */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                hasLiked 
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
              <span>{likes} Likes</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Community Discussion ({comments.length})
            </h3>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts on this story..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-900/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comment List */}
            <div className="space-y-3 pt-2">
              {comments.map((c) => (
                <div key={c.id} className="bg-slate-950/60 border border-white/5 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{c.user}</span>
                    <span className="text-[10px] text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Recommended Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 2).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 bg-slate-950 border border-white/10 rounded-xl flex gap-3 cursor-pointer hover:border-purple-500/50 transition-colors"
                  >
                    <img 
                      src={rel.image} 
                      alt={rel.title}
                      className="w-16 h-16 rounded-lg object-cover" 
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white line-clamp-2">{rel.title}</h4>
                      <span className="text-[10px] text-purple-400 flex items-center gap-1">
                        Read story <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
