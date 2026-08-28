import { useState, useEffect, useContext } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useRecommendations } from '../hooks/useRecommendations';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles/recommend-dialog.css';

export function RecommendDialog({ movie, onClose }) {
  const { getAllUsers } = useUsers();
  const { recommendToUser, loading } = useRecommendations();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const data = await getAllUsers();
      setUsers(data);
      setLoadingUsers(false);
    };

    fetchUsers();
  }, [getAllUsers]);

  const toggleUser = (userId) => {
    setSelected(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRecommend = async () => {
    if (selected.length === 0) {
      alert('Selecione pelo menos um usuário!');
      return;
    }

    const currentUserName = user?.user_metadata?.full_name || 'Usuário';

    for (const toUserId of selected) {
      await recommendToUser(toUserId, movie.id, movie.media_type || 'movie', message, currentUserName);
    }

    alert(`Recomendação enviada para ${selected.length} usuário(s)!`);
    onClose();
  };

  return (
    <div className="recommend-dialog-overlay" onClick={onClose}>
      <div className="recommend-dialog" onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>Recomendar "{movie.title || movie.name}"</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-body">
          {loadingUsers ? (
            <p className="loading">Carregando usuários...</p>
          ) : users.length === 0 ? (
            <p className="no-users">Nenhum usuário disponível</p>
          ) : (
            <>
              <div className="users-list">
                {users.map(user => (
                  <label key={user.id} className="user-item">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                    <span className="user-name">{user.full_name || 'Usuário'}</span>
                  </label>
                ))}
              </div>

              <div className="message-section">
                <textarea
                  placeholder="Adicione uma mensagem (opcional)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="message-input"
                />
              </div>
            </>
          )}
        </div>

        <div className="dialog-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button
            className="btn-recommend"
            onClick={handleRecommend}
            disabled={loading || selected.length === 0}
          >
            Recomendar {selected.length > 0 && `(${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
