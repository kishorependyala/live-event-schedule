import './App.css'
import { useEffect, useState } from 'react'

const performerImages = {
  alice: '/assets/alice.jpg',
  bob: '/assets/bob.jpg',
  carol: '/assets/carol.jpg',
  dave: '/assets/dave.jpg',
  eve: '/assets/eve.jpg',
  frank: '/assets/frank.jpg',
};

function App() {
  const [events, setEvents] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [route, setRoute] = useState(window.location.pathname);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ title: '', duration: '', coordinator: '', performers: [] });

  useEffect(() => {
    fetch('http://localhost:8000/api/performances')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (!events.length) return;
    let idx = 0;
    setActiveIdx(idx);
  }, [events]);

  // Admin actions
  const handleEdit = async idx => {
    setEditIdx(idx);
    setForm({ ...events[idx] });
  };
  const handleDelete = async idx => {
    await fetch(`http://localhost:8000/api/performances/${idx}`, { method: 'DELETE' });
    setEvents(events => events.filter((_, i) => i !== idx));
    setEditIdx(null);
  };
  const handleSave = async () => {
    if (editIdx !== null) {
      await fetch(`http://localhost:8000/api/performances/${editIdx}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      // Refetch from backend to ensure latest data
      const res = await fetch('http://localhost:8000/api/performances');
      const data = await res.json();
      setEvents(data);
    } else {
      await fetch('http://localhost:8000/api/performances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const res = await fetch('http://localhost:8000/api/performances');
      const data = await res.json();
      setEvents(data);
    }
    setEditIdx(null);
    setForm({ title: '', duration: '', coordinator: '', performers: [] });
  };
  const handleAdd = () => {
    setEditIdx(null);
    setForm({ title: '', duration: '', coordinator: '', performers: [] });
  };
  const handleReorder = async (from, to) => {
    await fetch('http://localhost:8000/api/performances/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to })
    });
    const res = await fetch('http://localhost:8000/api/performances');
    const data = await res.json();
    setEvents(data);
  };

  // Simple routing
  const goTo = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };
  useEffect(() => {
    window.onpopstate = () => setRoute(window.location.pathname);
  }, []);

  if (!events.length) {
    return <div className="app-layout"><div className="header"><div className="header-title">Ganapati Cultural Day</div><div className="header-details"><div className="header-location">Marigold Way</div></div></div><div style={{textAlign:'center',marginTop:'40px'}}>Loading...</div></div>;
  }

  if (route === '/admin') {
    return (
      <div className="app-layout">
        <div className="header">
          <div className="header-title">Ganapati Cultural Day - Admin</div>
          <div className="header-details"><div className="header-location">Marigold Way</div></div>
        </div>
        <div style={{padding:'32px',maxWidth:'800px',margin:'0 auto'}}>
          <div style={{marginBottom:'16px',color:'#718096',fontSize:'1rem'}}>
            <b>Data file path:</b> /Users/kishorependyala/git/live-event-schedule-data/data.json
          </div>
          <button onClick={() => {
            setEditIdx('add');
            setForm({ title: '', duration: '', coordinator: '', performers: [] });
          }} style={{marginBottom:'12px'}}>Add Performance</button>
          <h2>Manage Performances</h2>
          <ul style={{listStyle:'none',padding:0}}>
            {events.map((ev, idx) => (
              <li key={idx} style={{marginBottom:'18px',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'12px',background:'#f9fafb'}}>
                <b>{ev.title}</b> ({ev.duration})<br/>
                Coordinator: {ev.coordinator}<br/>
                Performers: {ev.performers.map(p=>p.name).join(', ')}<br/>
                <button onClick={()=>handleEdit(idx)} style={{marginRight:'8px'}}>Edit</button>
                <button onClick={()=>handleDelete(idx)} style={{marginRight:'8px'}}>Delete</button>
                {idx > 0 && <button onClick={()=>handleReorder(idx,idx-1)} style={{marginRight:'8px'}}>Move Up</button>}
                {idx < events.length-1 && <button onClick={()=>handleReorder(idx,idx+1)}>Move Down</button>}
              </li>
            ))}
          </ul>
          {(editIdx !== null || form.title) && (
            <div style={{marginTop:'24px',border:'1px solid #cbd5e1',borderRadius:'8px',padding:'16px',background:'#fff'}}>
              <h3>{editIdx !== null && editIdx !== 'add' ? 'Edit' : 'Add'} Performance</h3>
              <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{marginBottom:'8px',width:'100%'}}/><br/>
              <input placeholder="Duration" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} style={{marginBottom:'8px',width:'100%'}}/><br/>
              <input placeholder="Coordinator" value={form.coordinator} onChange={e=>setForm({...form,coordinator:e.target.value})} style={{marginBottom:'8px',width:'100%'}}/><br/>
              <input placeholder="Performers (comma separated)" value={form.performers.map(p=>p.name).join(', ')} onChange={e=>setForm({...form,performers:e.target.value.split(',').map(n=>({name:n.trim(),img:''}))})} style={{marginBottom:'8px',width:'100%'}}/><br/>
              <button onClick={async () => {
                if (editIdx === 'add') {
                  await fetch('http://localhost:8000/api/performances', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                  });
                } else if (editIdx !== null) {
                  await fetch(`http://localhost:8000/api/performances/${editIdx}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                  });
                }
                const res = await fetch('http://localhost:8000/api/performances');
                const data = await res.json();
                setEvents(data);
                setEditIdx(null);
                setForm({ title: '', duration: '', coordinator: '', performers: [] });
              }} style={{marginRight:'8px'}}>Save</button>
              <button onClick={()=>{setEditIdx(null);setForm({ title: '', duration: '', coordinator: '', performers: [] });}}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback to first event if index is out of bounds
  const active = events[activeIdx] || events[0];
  const nextPerformances = events.slice((activeIdx || 0) + 1);

  return (
    <div className="app-layout">
      <div className="header">
        <div className="header-title">Ganapati Cultural Day</div>
        <div className="header-details">
          <div className="header-location">Marigold Way</div>
        </div>
        <button onClick={()=>goTo('/admin')} style={{position:'absolute',top:20,right:20}}>Admin</button>
      </div>
      <div className="main-content">
        <div className="left-section">
          <div className="active-performance">
            <div className="performance-title">{active.title}</div>
            <div className="performance-duration">Duration: {active.duration}</div>
            <div className="performance-coordinator">Coordinator: {active.coordinator}</div>
            <div className="performance-performers">
              {active.performers.map((perf, idx) => (
                <div className="performance-performer" key={idx}>
                  <img src={performerImages[perf.name.toLowerCase()] || perf.img} alt={perf.name} />
                  <div className="performance-performer-name">{perf.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="right-section">
          {nextPerformances.map((event, idx) => (
            <div className="remaining-performance" key={idx}>
              <div className="performance-title">{event.title}</div>
              <div className="performance-duration">Duration: {event.duration}</div>
              <div className="performance-coordinator">Coordinator: {event.coordinator}</div>
              <div className="performance-performers">
                {event.performers.map((perf, pidx) => (
                  <span className="performance-performer-name" key={pidx}>{perf.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App
