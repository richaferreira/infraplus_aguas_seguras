
import { useEffect, useState } from 'react'
import { api, setToken } from '../services/api'
import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom'

interface Report { id:number; title:string; category:string; status:string; createdAt:string }

export default function Home(){
  const [email,setEmail] = useState('admin@demo.com')
  const [password,setPassword] = useState('admin123')
  const [token,setT] = useState<string|undefined>()
  const [reports,setReports] = useState<Report[]>([])

  useEffect(() => { load() }, [])

  async function load(){
    const { data } = await api.get('/reports')
    const list = Array.isArray(data) ? data : data.data
    setReports(list)
  }
  async function login(){
    const { data } = await api.post('/auth/login', { email, password })
    setT(data.token); setToken(data.token)
  }

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', fontFamily:'system-ui' }}>
      <Navbar/>
      <h1>InfraPlus — Águas Seguras</h1>
      {!token && (
        <div style={{ display:'flex', gap:8, margin:'12px 0' }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email'/>
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='senha'/>
          <button onClick={login}>Entrar</button>
        </div>
      )}
      <h2>Últimas denúncias</h2>
      <ul>
        {reports.slice(0,10).map(r => (
          <li key={r.id}><Link to={`/report/${r.id}`}>{r.title}</Link> — {r.category} — {r.status}</li>
        ))}
      </ul>
    </div>
  )
}
