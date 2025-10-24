
import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api'
import { Navbar } from '../components/Navbar'
import L from 'leaflet'

export default function MapPage(){
  const mapRef = useRef<HTMLDivElement>(null)
  const [reports, setReports] = useState<any[]>([])

  useEffect(()=>{ load() }, [])
  async function load(){
    const { data } = await api.get('/reports', { params: { pageSize: 200 } })
    setReports(Array.isArray(data) ? data : data.data)
  }

  useEffect(()=>{
    if(!mapRef.current) return
    const map = L.map(mapRef.current).setView([-22.92, -42.51], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map)
    reports.forEach(r=>{
      L.marker([r.lat, r.lng]).addTo(map).bindPopup(`<b>${r.title}</b><br/>${r.category} — ${r.status}`)
    })
    return ()=>{ map.remove() }
  }, [reports])

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', fontFamily:'system-ui' }}>
      <Navbar/>
      <h1>Mapa de Denúncias</h1>
      <div ref={mapRef} style={{ height: 500, width: '100%', border:'1px solid #ddd' }} />
    </div>
  )
}
