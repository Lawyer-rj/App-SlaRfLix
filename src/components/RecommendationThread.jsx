import { useState, useEffect, useContext } from 'react';
import { useRecommendationComments } from '../hooks/useRecommendationComments';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/recommendation-thread.css';

export function RecommendationThread({ recommendation, onClose }) {
  const { user } = useContext(AuthContext);
  const { addComment, getComments, loading } = useRecommendationComments();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      const data = await getComments(recommendation.id);
      setComments(data);
      setLoadingComments(false);
    };

    fetchComments();
  }, [recommendation.id, getComments]);

  const handleSendComment = async () => {
    if (!newComment.trim()) {
      alert('Escreva um comentário!');
      return;
    }

    const userName = user?.user_metadata?.full_name || 'Usuário';
    const success = await addComment(recommendation.id, newComment, userName);

    if (success) {
      const newData = await getComments(recommendation.id);
      setComments(newData);
      setNewComment('');
    } else {
      alert('Erro ao enviar comentário');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="recommendation-thread-overlay" onClick={onClose}>
      <div className="recommendation-thread" onClick={e => e.stopPropagation()}>
        <div className="thread-header">
          <h3>Discussão sobre a indicação</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="thread-body">
          <div className="recommendation-info">
            <strong>{recommendation.from_user_name}</strong> indicou este filme para <strong>{recommendation.to_user_name || 'você'}</strong>
            {recommendation.message && (
              <div className="recommendation-message">
                <p>"{recommendation.message}"</p>
              </div>
            )}
          </div>

          <div className="comments-section">
            <h4>💬 Comentários</h4>
            {loadingComments ? (
              <p className="loading">Carregando comentários...</p>
            ) : comments.length === 0 ? (
              <p className="no-comments">Nenhum comentário ainda. Seja o primeiro!</p>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <strong>{comment.user_name}</strong>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="comment-text">{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="thread-footer">
          {user ? (
            <div className="comment-input-section">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Compartilhe sua opinião sobre este filme..."
                className="comment-input"
              />
              <button
                onClick={handleSendComment}
                disabled={loading}
                className="send-comment-btn"
              >
                Enviar
              </button>
            </div>
          ) : (
            <p className="login-required">Faça login para comentar</p>
          )}
        </div>
      </div>
    </div>
  );
}
