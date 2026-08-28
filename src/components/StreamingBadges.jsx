import '../styles/streaming-badges.css'

// Mapeamento de nomes de provedores para ícones/cores
const PROVIDER_INFO = {
  'netflix': { name: 'Netflix', icon: '🎬', color: '#E50914' },
  'prime_video': { name: 'Prime Video', icon: '▶️', color: '#146EB4' },
  'disney_plus': { name: 'Disney+', icon: '⭐', color: '#113CCF' },
  'globoplay': { name: 'Globoplay', icon: '📺', color: '#003d82' },
  'crunchyroll': { name: 'Crunchyroll', icon: '🎌', color: '#F47D31' },
  'nowTV': { name: 'NOW', icon: '▶️', color: '#0066CC' },
  'hbo_max': { name: 'Max', icon: '🔲', color: '#000000' },
  'apple_tv': { name: 'Apple TV+', icon: '🍎', color: '#000000' },
}

function StreamingBadges({ providers = {} }) {
  const flatrate = providers.flatrate || []
  const rent = providers.rent || []
  const buy = providers.buy || []

  if (!flatrate.length && !rent.length && !buy.length) {
    return <p className="no-providers">Informações de streaming não disponíveis</p>
  }

  return (
    <div className="streaming-badges">
      {/* Subscrição (aparece em qualquer plataforma com subcrisão) */}
      {flatrate.length > 0 && (
        <div className="provider-group">
          <span className="provider-type">Inclusos:</span>
          <div className="badges">
            {flatrate.map((provider, idx) => {
              const info = PROVIDER_INFO[provider] || { name: provider, icon: '📺' }
              return (
                <span key={idx} className="badge" title={info.name}>
                  {info.icon} {info.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Aluguel */}
      {rent.length > 0 && (
        <div className="provider-group">
          <span className="provider-type">Aluguel:</span>
          <div className="badges">
            {rent.map((provider, idx) => {
              const info = PROVIDER_INFO[provider] || { name: provider, icon: '📺' }
              return (
                <span key={idx} className="badge badge-rent" title={info.name}>
                  {info.icon} {info.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Compra */}
      {buy.length > 0 && (
        <div className="provider-group">
          <span className="provider-type">Compra:</span>
          <div className="badges">
            {buy.map((provider, idx) => {
              const info = PROVIDER_INFO[provider] || { name: provider, icon: '📺' }
              return (
                <span key={idx} className="badge badge-buy" title={info.name}>
                  {info.icon} {info.name}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamingBadges
