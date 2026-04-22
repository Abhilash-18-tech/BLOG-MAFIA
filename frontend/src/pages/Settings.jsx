import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const presetAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Peanut',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2'
  ];

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setSelectedAvatarUrl(''); // clear preset selection
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handlePresetSelect = (url) => {
    setAvatarFile(null); // clear file selection
    setSelectedAvatarUrl(url);
    setAvatarPreview(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const formData = new FormData();
      formData.append('username', username);
      
      if (avatarFile) {
        formData.append('profilePicture', avatarFile);
      } else if (selectedAvatarUrl) {
        // If a preset was chosen and no file is uploaded, send the URL
        formData.append('profilePicture', selectedAvatarUrl);
      }

      const response = await api.put('/users/me/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      if (password) {
        // Assume reset password or similar if you implement password change here
        // or clear them after success.
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
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
              <div className="flex flex-col gap-2">
                <label className="settings-label">Upload a photo</label>       
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="settings-file" />
              </div>
            </div>

            <div className="mt-4">
              <label className="settings-label">Or choose an avatar</label>
              <div className="flex gap-4 mt-2 overflow-x-auto pb-2">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(url)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform hover:scale-110 ${
                      selectedAvatarUrl === url ? 'border-[var(--accent)] scale-110' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <label className="settings-label mt-4">Username</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="settings-input"
            />
            <label className="settings-label mt-4">Email</label>
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
              placeholder="Leave blank to keep same"
            />
            <label className="settings-label">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}      
              className="settings-input"
              placeholder="Confirm new password"
            />
            
            {message.text && (
              <p className={`mt-2 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}

            <button type="submit" disabled={loading} className="settings-button mt-4 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Settings;
