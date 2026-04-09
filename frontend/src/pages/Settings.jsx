import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="settings-shell">
      <div className="settings-card">
        <div className="settings-header">
          <h1 className="text-3xl font-brand font-bold">Account Settings</h1>
          <p className="text-sm text-[var(--muted)]">Manage your public profile and password.</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-grid">
          <div className="settings-section">
            <h2 className="settings-title">Profile</h2>
            <div className="settings-avatar">
              <div className="settings-avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" />
                ) : (
                  <span>{(username || 'U').charAt(0)}</span>
                )}
              </div>
              <div>
                <label className="settings-label">Profile picture</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="settings-file" />
              </div>
            </div>
            <label className="settings-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="settings-input"
            />
            <label className="settings-label">Email</label>
            <input type="email" value={email} disabled className="settings-input settings-input-disabled" />
          </div>

          <div className="settings-section">
            <h2 className="settings-title">Password</h2>
            <label className="settings-label">New password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="settings-input"
            />
            <label className="settings-label">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="settings-input"
            />
            <button type="submit" className="settings-button">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Settings;
