import React, { useState } from 'react';
import './RubbishCollectionFinder.css'; 
import axios from 'axios';

function App() {
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedUPRN, setSelectedUPRN] = useState('');
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');

  const fetchAddresses = async () => {
    try {
      setError('');
      setCollections([]);
      const { data } = await axios.post(
        'https://iweb.itouchvision.com/portal/itouchvision/kmbd_demo/address',
        new URLSearchParams({
          P_GUID: 'FF93E12280E5471FE053A000A8C08BEB',
          P_POSTCODE: postcode.trim(),
        })
      );
      setAddresses(data.ADDRESS || []);
    } catch (err) {
      setError('Failed to fetch addresses');
    }
  };

  const fetchCollections = async () => {
    try {
      const { data } = await axios.post(
        'https://iweb.itouchvision.com/portal/itouchvision/kmbd_demo/collectionDay',
        new URLSearchParams({
          P_GUID: 'FF93E12280E5471FE053A000A8C08BEB',
          P_UPRN: selectedUPRN,
          P_CLIENT_ID: '130',
          P_COUNCIL_ID: '260',
        })
      );
      if (data.collectionDay && data.collectionDay.length) {
        setCollections(data.collectionDay);
      } else {
        setError('No collection available for your address');
      }
    } catch (err) {
      setError('Failed to fetch collection data');
    }
  };

  return (
    <div className="app-wrapper">
      <div className="header">
        <h1>Find out your rubbish collection day</h1>
        <p>Check when your rubbish collected.</p>
      </div>

      <div className="form-wrapper">
        <div className="form-block">
          <label htmlFor="postcode">Enter a postcode</label>
          <input
            id="postcode"
            type="text"
            placeholder="For example SW1A 2AA"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          <button onClick={fetchAddresses}>Search</button>

          {addresses.length <= 0 && (
            <>
              <label>No addresses available for your postcode.</label>
            </>
           )}
 
          {addresses.length > 0 && (
            <>
              <label>Select an address</label>
              <select onChange={(e) => setSelectedUPRN(e.target.value)}>
                <option value="">-- Select --</option>
                {addresses.map((addr, i) => ( 
                  <option key={i} value={addr.UPRN}>{addr.FULL_ADDRESS}</option>
                ))}
              </select>
            </>
          )}

          {selectedUPRN && (
            <button onClick={fetchCollections}>Get Collection Info</button>
          )}

          <a href="#" onClick={() => {
            setPostcode('');
            setAddresses([]);
            setSelectedUPRN('');
            setCollections([]);
            setError('');
          }} className="clear-link">Clear address and start again</a>
        </div>

        <div className="right-column">
          <div className="related">
            <h4>Related content</h4>
            <ul>
              <li><a href="#">Add to your calender</a></li>
              <li><a href="#">Download printable schedule</a></li>
              <li><a href="#">Join our rubbish collection notification list</a></li>
            </ul>
          </div>
          <div className="services">
            <h4>More services</h4>
            <ul>
              <li><a href="#">Request a replacement container</a></li>
              <li><a href="#">Report a missed collection</a></li>
              <li><a href="#">Book a bulky collection</a></li>
              <li><a href="#">Request an assisted collection</a></li>
            </ul>
          </div>
        </div>
      </div>

      <h3>Your next collections</h3>
      {error && <p className="error">{error}</p>}

      <div className="collections">
        {collections.map((col, idx) => (
          <div
            key={idx}
            className="collection-card"
            style={{ backgroundColor: col.binColor }}
          >
            <p className="bin-type">{col.binType}</p>
            <p className="bin-day">{col.collectionDay}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;