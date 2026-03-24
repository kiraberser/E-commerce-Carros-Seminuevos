'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/AuthContext';
import type { Comment } from '@/shared/types';

import { commentsApi } from '../api';

interface CommentsSectionProps {
  vehicleId: number;
}

export function CommentsSection({ vehicleId }: CommentsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    commentsApi.list(vehicleId).then((res) => {
      setComments(res.data.results ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [vehicleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentsApi.create(vehicleId, body.trim());
      setComments((prev) => [res.data, ...prev]);
      setBody('');
      toast.success('Comentario publicado');
    } catch {
      toast.error('No se pudo publicar el comentario.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await commentsApi.delete(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast('Comentario eliminado');
    } catch {
      toast.error('No se pudo eliminar el comentario.');
    }
  };

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground mb-6">Comentarios</h2>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Escribe un comentario…"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="mt-2 bg-accent hover:bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? 'Enviando…' : 'Publicar comentario'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-6 bg-white rounded-xl px-4 py-3 border border-gray-100">
          <a href="/auth/login" className="text-accent hover:underline font-medium">Inicia sesión</a> para dejar un comentario.
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">Todavía no hay comentarios. ¡Sé el primero!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl p-4 border border-gray-50 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary-dark flex-shrink-0">
                  {comment.author_avatar ? (
                    <Image src={comment.author_avatar} alt={comment.author_name} fill className="object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{comment.author_name}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(comment.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 break-words">{comment.body}</p>
                </div>
                {(user?.id === comment.author || user?.is_staff) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    title="Eliminar"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
