
import { Link } from 'react-router-dom'

export function Navbar(){
  const s = { padding: '10px 0', display:'flex', gap:12, borderBottom:'1px solid #eee', marginBottom:16 } as const
  return (
    <nav style={s}>
      <Link to="/">Home</Link>
      <Link to="/publico">Denúncias Públicas</Link>
      <Link to="/mapa">Mapa</Link>
      <Link to="/nova">Nova Denúncia</Link>
      <Link to="/admin">Dashboard</Link>
    </nav>
  )
}
