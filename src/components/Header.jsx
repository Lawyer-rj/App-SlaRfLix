import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import '../styles/header.css'

function Header({ onSearch, onGenreChange, onLoginClick, onProfileClick, currentPage }) {
  const [searchInput, setSearchInput] = useState('')
  const { user, logout } = useContext(AuthContext)

  const handleSearch = (e) => {
    setSearchInput(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="header-content">
            <img src="/images/surf-logo.png" alt="SURF Logo" className="surf-logo" />
            <p className="tagline">Descubra filmes e séries que estão disponíveis agora no Brasil</p>
          </div>

          <div className="auth-buttons">
            {user ? (
              <>
                <button
                  className={`profile-link ${currentPage === 'profile' ? 'active' : ''}`}
                  onClick={onProfileClick}
                >
                  👤 {user.name}
                </button>
                <button className="logout-btn" onClick={logout}>Sair</button>
              </>
            ) : (
              <button className="login-btn" onClick={onLoginClick}>Entrar</button>
            )}
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar filmes..."
            value={searchInput}
            onChange={handleSearch}
          />
        </div>

        <div className="filters">
          <button className="filter-btn active">Filmes Populares</button>
          <button className="filter-btn">Novos</button>
          <button className="filter-btn">Top Rated</button>
        </div>
      </div>
    </header>
  )
}

export default Header
