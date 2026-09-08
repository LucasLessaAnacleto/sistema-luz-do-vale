import { useState } from 'react';
import { ArrowLeft, Plus, Heart, Image as ImageIcon, X, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { formatDate, formatTime } from '../../types';

interface MuralPost {
  id: string;
  content: string;
  timestamp: number;
  date: string;
  time: string;
  likes: number;
  likedByCurrentUser: boolean;
  authorRole: string;
}

interface MuralScreenProps {
  posts: MuralPost[];
  onBack: () => void;
  onAddPost: (post: Omit<MuralPost, 'id' | 'likes' | 'likedByCurrentUser'>) => void;
  onLikePost: (postId: string) => void;
}

function NewPostModal({ onSave, onCancel }: {
  onSave: (post: Omit<MuralPost, 'id' | 'likes' | 'likedByCurrentUser'>) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorRole, setAuthorRole] = useState('Equipe Reabilitah');

  const handleSave = () => {
    if (!content.trim()) return;
    const now = new Date();
    onSave({
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      timestamp: Date.now(),
      date: formatDate(now),
      time: formatTime(now),
      authorRole: authorRole.trim() || 'Equipe Reabilitah',
    });
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card w-full max-w-lg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-foreground">Nova Publicação</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Conteúdo da publicação *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Escreva um comunicado, notícia ou mensagem motivacional para a comunidade..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Identificação do autor</label>
            <input
              value={authorRole}
              onChange={e => setAuthorRole(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Ex: Equipe de Saúde, Coordenação, Abel Rodrigues..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> URL da imagem (opcional)
            </label>
            <input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">Cancelar</button>
            <button onClick={handleSave} disabled={!content.trim()} className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm disabled:opacity-50">Publicar</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function MuralScreen({ posts, onBack, onAddPost, onLikePost }: MuralScreenProps) {
  const [showNewPost, setShowNewPost] = useState(false);

  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Mural Institucional</h1>
              <p className="text-white/70 text-xs mt-0.5">Centro de Recuperação Luz do Vale</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Publicar
          </button>
        </div>

        {/* Identity block */}
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Comunicados e Notícias</p>
            <p className="text-white/70 text-xs mt-0.5">Mensagens da coordenação e equipe para pacientes e familiares</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-5 space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-foreground">Nenhuma publicação ainda</p>
            <p className="text-sm text-muted-foreground mt-1">Publique comunicados e notícias para a comunidade</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="mt-4 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium"
            >
              Criar primeira publicação
            </button>
          </div>
        ) : (
          sortedPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="overflow-hidden">
                {/* Post header */}
                <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {post.authorRole || 'Equipe Reabilitah'}
                    </p>
                    <p className="text-xs text-muted-foreground">{post.date} às {post.time}</p>
                  </div>
                </div>

                {/* Image */}
                {post.imageUrl && (
                  <div className="mx-4 mb-3">
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full rounded-xl object-cover max-h-48"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
                </div>

                {/* Like button */}
                <div className="px-4 pb-4 border-t border-border pt-3 flex items-center gap-3">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      post.likedByCurrentUser
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-accent text-muted-foreground border border-border hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current' : ''}`} />
                    {post.likes > 0 ? post.likes : 'Curtir'}
                  </button>
                  {post.likes > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {post.likes} curtida{post.likes !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {showNewPost && (
        <NewPostModal
          onSave={onAddPost}
          onCancel={() => setShowNewPost(false)}
        />
      )}
    </div>
  );
}
