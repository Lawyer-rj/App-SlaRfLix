import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import '../styles/login-register.css'

function LoginRegister({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result

      if (isLogin) {
        result = await login(email, password)
      } else {
        if (!name) {
          throw new Error('Nome é obrigatório')
        }
        result = await register(email, password, name)
      }

      if (result.success) {
        onSuccess?.()
        onClose()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="login-container">
          <h2 className="login-title">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <input
                type="text"
                placeholder="Seu Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Registrar')}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setEmail('')
                  setPassword('')
                  setName('')
                }}
              >
                {isLogin ? 'Registre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginRegister
