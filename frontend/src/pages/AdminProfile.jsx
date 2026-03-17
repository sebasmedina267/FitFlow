import React, { useState, useMemo } from 'react';
import '../styles/pages/admin-profile.css';

const AdminProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    role: 'Administrator',
    avatar: 'https://via.placeholder.com/150',
    info: {
      age: 35,
      gender: 'Male',
      address: '123 Main St, Anytown, USA',
    },
  });

  const [activities, setActivities] = useState([
    { id: 1, action: 'Logged in', timestamp: '2023-10-27 10:00:00' },
    { id: 2, action: 'Created a new class: Yoga Basics', timestamp: '2023-10-27 11:30:00' },
    { id: 3, action: 'Added a new member: Jane Smith', timestamp: '2023-10-27 14:15:00' },
    { id: 4, action: 'Updated a machine: Treadmill #3', timestamp: '2023-10-28 09:00:00' },
    { id: 5, action: 'Generated a new report', timestamp: '2023-10-28 16:00:00' },
    { id: 6, action: 'Logged out', timestamp: '2023-10-28 18:00:00' },
  ]);

  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedActivities = useMemo(() => {
    return activities
      .filter((activity) =>
        activity.action.toLowerCase().includes(filter.toLowerCase()) ||
        activity.timestamp.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return sortOrder === 'asc' ? dateA - dateB : dateB - a;
      });
  }, [activities, filter, sortOrder]);

  return (
    <div className="admin-profile-container">
      <header className="profile-header-card">
        <div className="avatar-container">
          <img src={user.avatar} alt="User Avatar" className="avatar-image" />
        </div>
        <div className="user-info-container">
          <h1>{user.name}</h1>
          <p className="role">{user.role}</p>
          <button className="btn btn-primary edit-profile-btn">Edit Profile</button>
        </div>
      </header>

      <section className="profile-details-card">
        <h2>Profile Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Age:</strong> {user.info.age}
          </div>
          <div className="info-item">
            <strong>Gender:</strong> {user.info.gender}
          </div>
          <div className="info-item">
            <strong>Address:</strong> {user.info.address}
          </div>
        </div>
      </section>

      <section className="activity-log-card">
        <h2>Activity Log</h2>
        <div className="controls-container">
          <input
            type="text"
            placeholder="Filter activities..."
            value={filter}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <button onClick={handleSortOrderChange} className="btn btn-secondary sort-btn">
            Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
        </div>
        <div className="activity-table-container">
          <table className="table activity-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.action}</td>
                  <td>{activity.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;
