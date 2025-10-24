
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom'

type Status = 'ABERTA' | 'RESOLVIDA'

export default function PublicReports(){
  const [tab, setTab] = useState<Status>('ABERTA')
  const [items, setItems] = useState<any[]>([])

  useEffect(() => { load() }, [tab])

  async function load(){
    const { data } = await api.get('/reports', { params: { status: tab, pageSize: 50 } })
    setItems(Array.isArray(data) ? data : data.data)
  }

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', fontFamily:'system-ui' }}>
      <Navbar/>
      <h1>Denúncias Públicas</h1>
      <div style={{ display:'flex', gap:8, margin:'12px 0' }}>
        <button onClick={()=>setTab('ABERTA')} style={{ fontWeight: tab==='ABERTA'?'bold':'normal' }}>Abertas</button>
        <button onClick={()=>setTab('RESOLVIDA')} style={{ fontWeight: tab==='RESOLVIDA'?'bold':'normal' }}>Resolvidas</button>
      </div>
      <ul>
        {items.map(r => (
          <li key={r.id}><Link to={`/report/${r.id}`}>{r.title}</Link> — {r.category} — {r.status} <small>({new Date(r.createdAt).toLocaleDateString()})</small></li>
        ))}
      </ul>
    </div>
  )
}
