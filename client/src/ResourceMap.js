import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Leaflet + Webpack
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

function SetViewOnClick({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
}

export default function ResourceMap() {
  console.log("API URL ResourceMap:", process.env.REACT_APP_API_URL);
  //return <div style={{border: "5px solid green", height: 100}}>TEST MAP COMPONENT</div>;
  const [resources, setResources] = useState([]);
  const [externalHospitals, setExternalHospitals] = useState([]);
  const [lat, setLat] = useState(40.7128); // Default: NYC
  const [lng, setLng] = useState(-74.0060);
  const [tempMarker, setTempMarker] = useState(null);
  const [radius, setRadius] = useState(5000); // meters
  const [loading, setLoading] = useState(false);

  // Resource creation form state
  const [form, setForm] = useState({
    name: '',
    type: 'shelter',
    description: '',
    lat: 40.7128,
    lng: -74.0060
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');
  const [descWarning, setDescWarning] = useState("");

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line
  }, []);

  function fetchResources() {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_API_URL}/resources/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    )
      .then((res) => res.json())
      .then((data) => setResources(data))
      .finally(() => setLoading(false));
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setDescWarning("");
    if (!form.description.trim()) {
      setDescWarning("Description is required to create a resource.");
      return;
    }
    setCreating(true);
    setCreateMsg('');
    fetch(`${process.env.REACT_APP_API_URL}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng)
      })
    })
      .then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err)))
      .then(data => {
        setCreateMsg('Resource created!');
        setForm(f => ({ ...f, name: '', description: '' }));
        fetchResources();
      })
      .catch(err => setCreateMsg(err.error || 'Error creating resource'))
      .finally(() => setCreating(false));
  }

  // Compute invalid resources for warning
  const invalidResources = resources.filter(r => !r.location || !Array.isArray(r.location.coordinates) || r.location.coordinates.length !== 2);

  return (
    <div style={{
      maxWidth: 900,
      margin: "2rem auto",
      border: "2.5px solid #ff9800",
      background: "linear-gradient(120deg, #fbeee6 0%, #ffe0b2 40%, #e3f0ff 100%)",
      borderRadius: 28,
      boxShadow: '0 8px 36px 0 rgba(25, 118, 210, 0.11)',
      padding: '36px 26px 32px 26px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 80% 10%, #fffde4 16%, transparent 70%), radial-gradient(circle at 20% 80%, #e3f0ff 10%, transparent 60%)',
        opacity: 0.45,
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <h2 style={{
        fontSize: 36,
        color: '#1976d2',
        fontWeight: 900,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'relative',
        zIndex: 1
      }}>
        <span role="img" aria-label="map" style={{fontSize:32}}>🗺️</span> <span>Resource Map</span>
      </h2>
      <div style={{height: 5, width: 90, background: 'linear-gradient(90deg, #ff9800 40%, #1976d2 100%)', borderRadius: 6, margin: '0 0 32px 2px', zIndex: 1, position: 'relative'}}></div>

      {/* Resource Creation Form */}
      {descWarning && (
        <div style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: 6, padding: '8px 12px', marginBottom: 12, fontWeight: 500 }}>
          {descWarning}
        </div>
      )}
      <form onSubmit={handleFormSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', marginBottom: 24, background: '#ffe0b2', padding: 26, borderRadius: 16, boxShadow: '0 2px 12px rgba(255,152,0,0.08)', border: '1.5px solid #ffd180', position: 'relative', zIndex: 1
      }}>
        <b style={{ fontSize: 20, marginBottom: 10, color: '#ff9800', display: 'flex', alignItems: 'center', gap: 8 }}><span role="img" aria-label="add">➕</span> Add New Resource</b>
        <div style={{ display: 'flex', gap: 16, width: '100%' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Name</label>
            <input name="name" required placeholder="Name" value={form.name} onChange={handleFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Type</label>
            <select name="type" value={form.type} onChange={handleFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
              <option value="shelter">Shelter</option>
              <option value="medical">Medical</option>
              <option value="supply">Supply</option>
              <option value="food">Food</option>
            </select>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Description</label>
          <input name="description" required placeholder="Description" value={form.description} onChange={handleFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, width: '100%' }}>
          <div>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Latitude</label>
            <input name="lat" type="number" step="0.0001" required placeholder="Lat" value={form.lat} onChange={handleFormChange} style={{ width: 120, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Longitude</label>
            <input name="lng" type="number" step="0.0001" required placeholder="Lng" value={form.lng} onChange={handleFormChange} style={{ width: 120, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          </div>
        </div>
        <button type="submit" disabled={creating} style={{
          minWidth: 140,
          padding: '10px 20px',
          background: creating ? '#bdbdbd' : '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 16,
          cursor: creating ? 'not-allowed' : 'pointer',
          boxShadow: '0 1px 4px rgba(25, 118, 210, 0.08)'
        }}>{creating ? 'Creating...' : 'Add Resource'}</button>
        {createMsg && <span style={{
          background: createMsg.includes('created') ? '#d4edda' : '#f8d7da',
          color: createMsg.includes('created') ? '#155724' : '#721c24',
          border: '1px solid ' + (createMsg.includes('created') ? '#c3e6cb' : '#f5c6cb'),
          borderRadius: 6,
          padding: '6px 12px',
          marginLeft: 8,
          fontWeight: 500
        }}>{createMsg}</span>}
      </form>
      <div style={{ marginBottom: 16 }}>
        <label>
          Lat: <input type="number" value={lat} onChange={e => setLat(Number(e.target.value))} step="0.0001" />
        </label>
        <label style={{ marginLeft: 8 }}>
          Lng: <input type="number" value={lng} onChange={e => setLng(Number(e.target.value))} step="0.0001" />
        </label>
        <label style={{ marginLeft: 8 }}>
          Radius (meters): <input type="number" value={radius} onChange={e => setRadius(Number(e.target.value))} />
        </label>
        <button onClick={fetchResources} style={{ marginLeft: 8 }}>Search</button>
      </div>
      <button onClick={async () => {
        // Fetch hospitals from Nominatim
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=20&extratags=1&bounded=1&viewbox=${lng - 0.1},${lat + 0.1},${lng + 0.1},${lat - 0.1}`;
        const resp = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        const data = await resp.json();
        setExternalHospitals(data.map(h => ({
          id: h.place_id,
          name: h.display_name.split(',')[0],
          lat: parseFloat(h.lat),
          lng: parseFloat(h.lon)
        })));
      }} style={{ marginBottom: 12 }}>
        Find Hospitals Nearby
      </button>
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: "400px", width: "100%" }}
        onclick={e => {
          const { latlng } = e;
          setTempMarker([latlng.lat, latlng.lng]);
          setForm(f => ({ ...f, lat: latlng.lat, lng: latlng.lng }));
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <SetViewOnClick lat={lat} lng={lng} />
        {resources.filter(r => r.location && Array.isArray(r.location.coordinates) && r.location.coordinates.length === 2).map((r) => (
          <Marker
            key={r.id}
            position={[r.location.coordinates[1], r.location.coordinates[0]]}
          >
            <Popup>
              <b>{r.name}</b><br />
              Type: {r.type}<br />
              {r.description}
            </Popup>
          </Marker>
        ))}
        {externalHospitals.map(h => (
          <Marker
            key={h.id}
            position={[h.lat, h.lng]}
            icon={L.icon({
              iconUrl: "https://maps.google.com/mapfiles/ms/icons/hospitals.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            })}
          >
            <Popup>
              <b>External Hospital</b><br />
              {h.name}
            </Popup>
          </Marker>
        ))}
        {tempMarker && (
          <Marker position={tempMarker}>
            <Popup>New Resource Location</Popup>
          </Marker>
        )}
      </MapContainer>
      {loading && <div>Loading...</div>}
      <div style={{ marginTop: 16 }}>
        <b>Results:</b> {resources.length} resources found.
      </div>
    </div>
  );
}
