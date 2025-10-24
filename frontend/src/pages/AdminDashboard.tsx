
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Navbar } from '../components/Navbar'

export default function AdminDashboard(){
  const [stats,setStats] = useState<any>(null)
  const [reports,setReports] = useState<any[]>([])

  async function load(){
    const s = await api.get('/stats/summary')
    setStats(s.data)
    const r = await api.get('/reports', { params: { pageSize: 100 } })
    setReports(Array.isArray(r.data) ? r.data : r.data.data)
  }
  useEffect(()=>{ load() }, [])

  async function changeStatus(id:number, status:string){
    try{
      await api.patch(`/reports/${id}/status`, { status })
      load()
    }catch{ alert('Precisa estar logado como ADMIN') }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', fontFamily:'system-ui' }}>
      <Navbar/>
      <h1>Dashboard (Admin)</h1>
      {!stats ? (<p>Carregando...</p>) : (
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          <div>Total: <b>{stats.total}</b></div>
          <div>
            Por status:
            <ul>
              {stats.byStatus.map((s:any)=>(<li key={s.status}>{s.status}: {s._count._all}</li>))}
            </ul>
          </div>
          <div>
            Por categoria:
            <ul>
              {stats.byCategory.map((c:any)=>(<li key={c.category}>{c.category}: {c._count._all}</li>))}
            </ul>
          </div>
        </div>
      )}

      <h2>Gerenciar denúncias</h2>
      <table border={1} cellPadding={6}>
        <thead>
          <tr><th>Título</th><th>Categoria</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.category}</td>
              <td>{r.status}</td>
              <td style={{ display:'flex', gap:6 }}>
                <button onClick={()=>changeStatus(r.id,'ABERTA')}>Aberta</button>
                <button onClick={()=>changeStatus(r.id,'EM_ANALISE')}>Em Análise</button>
                <button onClick={()=>changeStatus(r.id,'RESOLVIDA')}>Resolvida</button>
                <button onClick={()=>changeStatus(r.id,'REJEITADA')}>Rejeitada</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
