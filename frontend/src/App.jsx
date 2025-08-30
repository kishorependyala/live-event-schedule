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

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/performances')
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

  if (!events.length) {
    return <div className="app-layout"><div className="header"><div className="header-title">Ganapati Cultural Day</div><div className="header-details"><div className="header-location">Marigold Way</div></div></div><div style={{textAlign:'center',marginTop:'40px'}}>Loading...</div></div>;
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
