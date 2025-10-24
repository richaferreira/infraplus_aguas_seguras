
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Navbar } from '../components/Navbar'

export default function NewReport(){
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [category,setCategory] = useState('FALTA_AGUA')
  const [lat,setLat] = useState<number|null>(null)
  const [lng,setLng] = useState<number|null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [msg,setMsg] = useState('')

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(p=>{ setLat(p.coords.latitude); setLng(p.coords.longitude) })
    }
  },[])

  async function submit(e: React.FormEvent){
    e.preventDefault()
    try{
      const form = new FormData()
      form.append('title', title)
      form.append('description', description)
      form.append('category', category)
      form.append('lat', String(lat ?? -22.92))
      form.append('lng', String(lng ?? -42.51))
      if (files) Array.from(files).forEach(f => form.append('images', f))

      await api.post('/reports/with-upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Denúncia registrada com sucesso!')
      setTitle(''); setDescription(''); setFiles(null)
    }catch(err:any){
      setMsg('Falha: faça login para registrar ou verifique os dados.')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', fontFamily:'system-ui' }}>
      <Navbar/>
      <h1>Nova Denúncia</h1>
      <form onSubmit={submit} style={{ display:'grid', gap:8 }}>
        <input required placeholder='Título' value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea required placeholder='Descrição' value={description} onChange={e=>setDescription(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value='FALTA_AGUA'>Falta de Água</option>
          <option value='VAZAMENTO'>Vazamento</option>
          <option value='QUALIDADE'>Qualidade</option>
          <option value='OUTROS'>Outros</option>
        </select>
        <div style={{ display:'flex', gap:8 }}>
          <input placeholder='Lat' value={lat ?? ''} onChange={e=>setLat(Number(e.target.value))} />
          <input placeholder='Lng' value={lng ?? ''} onChange={e=>setLng(Number(e.target.value))} />
        </div>
        <input type="file" multiple onChange={e=>setFiles(e.target.files)} />
        <button type='submit'>Enviar</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
