import './App.css'

// Sample performer images (use public URLs or local assets)
const performerImages = {
  alice: '/assets/alice.jpg',
  bob: '/assets/bob.jpg',
  carol: '/assets/carol.jpg',
  dave: '/assets/dave.jpg',
  eve: '/assets/eve.jpg',
  frank: '/assets/frank.jpg',
};

function App() {
  // Test data for live event schedule with performers and coordinators
  const events = [
    { time: '10:00 AM', title: 'Opening Ceremony', duration: '30 min', coordinator: 'John Smith', performers: [{ name: 'Alice', img: performerImages.alice }] },
    { time: '11:00 AM', title: 'Keynote: The Future of Tech', duration: '45 min', coordinator: 'Jane Doe', performers: [{ name: 'Bob', img: performerImages.bob }] },
    { time: '12:30 PM', title: 'Networking Lunch', duration: '60 min', coordinator: 'Mike Lee', performers: [{ name: 'Carol', img: performerImages.carol }] },
    { time: '2:00 PM', title: 'Workshop: AI in Practice', duration: '90 min', coordinator: 'Sara Kim', performers: [{ name: 'Dave', img: performerImages.dave }, { name: 'Eve', img: performerImages.eve }] },
    { time: '4:00 PM', title: 'Panel Discussion', duration: '60 min', coordinator: 'Tom Brown', performers: [{ name: 'Frank', img: performerImages.frank }] },
    { time: '5:30 PM', title: 'Closing Remarks', duration: '30 min', coordinator: 'Anna White', performers: [{ name: 'Alice', img: performerImages.alice }, { name: 'Bob', img: performerImages.bob }] },
  ];

  // Split events for layout
  const active = events[0];
  const nextPerformances = events.slice(1);

  return (
    <div className="app-layout">
      <div className="header">
        <div className="header-title">Ganapati Cultural Day</div>
        <div className="header-details">
          <div className="header-time">5PM onwards</div>
          <div className="header-location">Marigold Way</div>
        </div>
      </div>
      <div className="main-content">
        <div className="left-section">
          <div className="active-performance">
            <div className="performance-title">{active.title}</div>
            <div className="performance-time">{active.time}</div>
            <div className="performance-duration">Duration: {active.duration}</div>
            <div className="performance-coordinator">Coordinator: {active.coordinator}</div>
            <div className="performance-performers">
              {active.performers.map((perf, idx) => (
                <div className="performance-performer" key={idx}>
                  <img src={perf.img} alt={perf.name} />
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
              <div className="performance-time">{event.time}</div>
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
