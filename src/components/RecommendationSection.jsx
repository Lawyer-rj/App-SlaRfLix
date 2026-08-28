import { useEffect, useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import '../styles/recommendation-section.css';

export function RecommendationSection({ movieId }) {
  const { getRecommendations } = useRecommendations();
  const [recommenders, setRecommenders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const data = await getRecommendations(movieId);
      setRecommenders(data);
      setLoading(false);
    };

    fetchRecommendations();
  }, [movieId, getRecommendations]);

  if (loading) return null;
  if (!recommenders.length) return null;

  return (
    <div className="recommendation-section">
      <div className="recommendation-header">
        👍 Indicado por {recommenders.length} {recommenders.length === 1 ? 'pessoa' : 'pessoas'}
      </div>
      <div className="recommendation-avatars">
        {recommenders.slice(0, 5).map((rec, idx) => (
          <div key={rec.id} className="recommendation-avatar" title={rec.comment || 'Recomendado'}>
            <span>{String.fromCharCode(65 + (idx % 26))}</span>
          </div>
        ))}
        {recommenders.length > 5 && (
          <div className="recommendation-avatar more">+{recommenders.length - 5}</div>
        )}
      </div>
    </div>
  );
}
