
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import { Navbar } from '../components/Navbar'

export default function ReportDetail(){
  const { id } = useParams()
  const [report, setReport] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [msg, setMsg] = useState('')

  async function load(){
    const { data } = await api.get(`/reports/${id}`)
    setReport(data)
  }
  useEffect(()=>{ load() }, [id])

  async function sendComment(){
    try{
      await api.post('/comments', { reportId: Number(id), content: comment })
      setComment('')
      load()
    }catch{ setMsg('Para comentar, faça login.') }
  }

  if(!report) return <div><Navbar/><p>Carregando...</p></div>

  const images: string[] = report.imagesJson ? JSON.parse(report.imagesJson) : []

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', fontFamily:'system-ui' }}>
      <Navbar/>
      <h1>{report.title}</h1>
      <p><b>Categoria:</b> {report.category} — <b>Status:</b> {report.status}</p>
      <p>{report.description}</p>

      {images.length > 0 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', margin:'8px 0' }}>
          {images.map((src, i) => (
            <a href={src} target="_blank" key={i}><img src={src} style={{ width: 160, height: 120, objectFit:'cover', border:'1px solid #ddd' }} /></a>
          ))}
        </div>
      )}

      <h3>Comentários</h3>
      <ul>
        {report.comments?.map((c:any)=>(<li key={c.id}><b>{c.user?.name}</b>: {c.content}</li>))}
      </ul>

      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder='Adicionar comentário'/>
        <button onClick={sendComment}>Enviar</button>
      </div>
      {msg && <p>{msg}</p>}
    </div>
  )
}
