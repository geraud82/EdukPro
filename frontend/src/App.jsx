import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  BarChart3, 
  School, 
  Users, 
  TrendingUp, 
  UserCircle, 
  Baby, 
  DollarSign, 
  BookOpen, 
  MessageCircle,
  GraduationCap,
  Receipt,
  CheckSquare,
  Building2,
  UserCheck,
  UsersRound,
  ShieldCheck
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import SchoolInfo from './components/SchoolInfo';
import SchoolBrowser from './components/SchoolBrowser';
import StudentEnrollmentForm from './components/StudentEnrollmentForm';
import Notifications from './components/Notifications';
import HomePage from './components/HomePage';
import OwnerDashboard from './components/OwnerDashboard';
import Pricing from './components/Pricing';
import SchoolPublicPage from './components/SchoolPublicPage';
import { API_URL } from './utils/config';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/school/:id" element={<SchoolPublicPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/parent/*" element={<ParentLayout />} />
          <Route path="/teacher/*" element={<TeacherLayout />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/owner/*" element={<OwnerLayout />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

/* ======================= 404 NOT FOUND PAGE ======================= */

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div style={{ 
        textAlign: 'center', 
        marginTop: '4rem',
        animation: 'fadeIn 0.5s ease-in'
      }}>
        <div style={{ 
          fontSize: '8rem', 
          marginBottom: '1rem',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
          lineHeight: 1
        }}>
          🎓
        </div>
        
        <div style={{
          fontSize: '6rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          lineHeight: 1
        }}>
          404
        </div>

        <h1 className="title" style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          Page Not Found
        </h1>
        
        <p className="subtitle" style={{ 
          fontSize: '1.2rem', 
          color: 'rgba(255, 255, 255, 0.95)',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem auto'
        }}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="card" style={{ 
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: '1.5rem',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
        }}>
          🧭
        </div>
        
        <h3 style={{ 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          color: 'var(--text-primary)'
        }}>
          Let's get you back on track
        </h3>
        
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          The page you're trying to reach might have been removed, renamed, or is temporarily unavailable.
        </p>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <button 
            className="btn" 
            onClick={() => navigate(-1)}
            style={{ 
              padding: '1rem 2rem', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            ← Go Back
          </button>
          
          <button 
            className="btn" 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '1rem 2rem', 
              fontSize: '1.1rem',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            🏠 Go to Home
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <p style={{ 
            fontSize: '0.9rem', 
            color: 'var(--text-secondary)',
            marginBottom: '1rem'
          }}>
            Need help? Here are some quick links:
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0.75rem',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.75rem',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.background = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
            >
              🔐 Login
            </button>
            
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '0.75rem',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.background = 'white';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--bg-secondary)';
              }}
            >
              ✨ Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================= LOGIN PAGE ======================= */

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();

// Vérifie que la réponse est bien du JSON
let data;
try {
  data = JSON.parse(text);
} catch (e) {
  console.error('Non-JSON response:', text);
  throw new Error('Server error: invalid response');
}

if (!res.ok) {
  throw new Error(data.message || 'Login failed');
}

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'parent') navigate('/parent');
      else if (data.user.role === 'teacher') navigate('/teacher');
      else if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'owner') navigate('/owner');
       else navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}>
          🎓
        </div>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          Welcome Back
        </h1>
        <p className="subtitle" style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)' }}>
          Sign in to your EduckPro account
        </p>
      </div>

      <div className="card" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <form onSubmit={handleSubmit}>
          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              marginBottom: '1rem',
              fontSize: '1rem'
            }}
          />

          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Password
          </label>
          <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                marginBottom: 0,
                fontSize: '1rem',
                paddingRight: '3rem'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', margin: 0, fontWeight: '400' }}>
              <input type="checkbox" style={{ marginRight: '0.5rem', width: 'auto', marginBottom: 0 }} />
              Remember me
            </label>
            <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
              Forgot password?
            </a>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%', fontSize: '1.05rem', padding: '0.875rem' }}>
            {loading ? '🔄 Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: 'inherit'
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ======================= SIGN UP PAGE ======================= */

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = `${API_URL}/api/auth/register`;
      console.log('🔵 [SIGNUP] Starting registration...');
      console.log('🔵 [SIGNUP] API URL:', apiUrl);
      console.log('🔵 [SIGNUP] Request data:', {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: '***hidden***'
      });

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      console.log('🔵 [SIGNUP] Response status:', res.status, res.statusText);

      const data = await res.json();
      console.log('🔵 [SIGNUP] Response data:', data);

      if (!res.ok) {
        console.error('🔴 [SIGNUP] Registration failed:', data.message || 'Unknown error');
        throw new Error(data.message || 'Registration failed');
      }

      console.log('✅ [SIGNUP] Registration successful!');
      console.log('✅ [SIGNUP] User role:', data.user.role);

      // Auto-login after successful registration
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'parent') navigate('/parent');
      else if (data.user.role === 'teacher') navigate('/teacher');
      else if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'owner') navigate('/owner');
      else navigate('/login');

    } catch (err) {
      console.error('🔴 [SIGNUP] Error:', err);
      console.error('🔴 [SIGNUP] Error message:', err.message);
      console.error('🔴 [SIGNUP] Error stack:', err.stack);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}>
          🎓
        </div>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#ffffff', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          Join EduckPro
        </h1>
        <p className="subtitle" style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)' }}>
          Create your account to get started
        </p>
      </div>

      <div className="card" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <form onSubmit={handleSubmit}>
          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            style={{
              marginBottom: '1rem',
              fontSize: '1rem'
            }}
          />

          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            style={{
              marginBottom: '1rem',
              fontSize: '1rem'
            }}
          />

          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              marginBottom: '1rem',
              fontSize: '1rem'
            }}
          >
            <option value="parent">Parent</option>
            <option value="admin">School Admin</option>
          </select>
          <p style={{ 
            fontSize: '0.8rem', 
            color: '#6b7280', 
            marginTop: '-0.5rem',
            marginBottom: '1rem',
            fontStyle: 'italic'
          }}>
            ℹ️ Note: Teachers are added by school administrators and assigned to classes
          </p>

          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Password
          </label>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 6 characters"
              style={{
                marginBottom: 0,
                fontSize: '1rem',
                paddingRight: '3rem'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              style={{
                marginBottom: 0,
                fontSize: '1rem',
                paddingRight: '3rem'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem'
              }}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%', fontSize: '1.05rem', padding: '0.875rem' }}>
            {loading ? '🔄 Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1.5rem', 
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: 'inherit'
              }}
            >

              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===================== OWNER LAYOUT ===================== */

function OwnerLayout() {
  const [me, setMe] = useState(null);
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'schools' | 'users' | 'analytics'
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    role: 'parent',
    password: '',
    schoolId: '',
  });

  // Sidebar tabs configuration
  const ownerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'schools', label: 'Schools', icon: <School size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> },
  ];

  // Load current user from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setMe(u);
    } catch {
      setMe(null);
    }
  }, []);

  // Sync tab state with URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'schools', 'users', 'analytics', 'profile'].includes(hash)) {
      setTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && ['dashboard', 'schools', 'users', 'analytics', 'profile'].includes(newHash)) {
        setTab(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load schools
  useEffect(() => {
    async function fetchSchools() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/schools`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load schools');
        setSchools(data);
      } catch (err) {
        console.error('Failed to load schools:', err);
      }
    }
    fetchSchools();
  }, []);

  // Load all users
  async function loadUsers() {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API_URL}/api/owner/users${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    async function handleCreateUser(e) {
    e.preventDefault();
    setCreateError('');
    try {
      setCreating(true);
      const token = localStorage.getItem('token');

      const payload = {
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
      };

      if (createForm.role !== 'owner') {
        payload.schoolId = Number(createForm.schoolId);
      }

      const res = await fetch(`${API_URL}/api/owner/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create user');

      setUsers(prev => [data, ...prev]);
      setCreateForm({
        name: '',
        email: '',
        role: 'parent',
        password: '',
        schoolId: '',
      });
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function changeRole(id, role) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/owner/users/${id}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change role');

      setUsers(prev => prev.map(u => (u.id === id ? data : u)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggleActive(user) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/owner/users/${user.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !user.isActive }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      setUsers(prev => prev.map(u => (u.id === user.id ? data : u)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function resetPassword(id) {
    if (!window.confirm('Reset password for this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/owner/users/${id}/reset-password`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      alert(
        `Password reset successful.\nNew temporary password: ${data.newPassword}`
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/owner/users/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');

      setUsers(prev => prev.filter(u => u.id !== id));
      alert('User deleted successfully');
    } catch (err) {
      alert(err.message);
    }
  }

  if (!me) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  if (me.role !== 'owner') {
    return (
      <div className="page">
        <h2 className="title">Access denied</h2>
        <p>You must be an owner to view this page.</p>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalSchools = schools.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const usersByRole = {
    parent: users.filter(u => u.role === 'parent').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    admin: users.filter(u => u.role === 'admin').length,
    owner: users.filter(u => u.role === 'owner').length,
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        userRole="owner"
        userName={me?.name}
        userEmail={me?.email}
        currentTab={tab}
        onTabChange={setTab}
        tabs={ownerTabs}
      />
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="title" style={{ marginBottom: '0.5rem' }}>👑 Owner Dashboard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
            Manage all users and schools across the platform
          </p>
        </div>

        {/* Statistics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div 
            className="card" 
            onClick={() => setTab('users')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><Users size={32} color="var(--primary-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalUsers}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Users</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('users')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><UserCheck size={32} color="var(--success-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{activeUsers}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('schools')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><School size={32} color="var(--info-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--info-color)' }}>{totalSchools}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Schools</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('users')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><UsersRound size={32} color="var(--warning-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{usersByRole.parent}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Parents</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('users')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><GraduationCap size={32} color="var(--success-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{usersByRole.teacher}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Teachers</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('users')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><ShieldCheck size={32} color="var(--danger-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>{usersByRole.admin}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admins</div>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && <OwnerDashboard />}

        {/* ANALYTICS TAB */}
        {tab === 'analytics' && <OwnerDashboard />}

        {/* Tabs */}
        {tab !== 'dashboard' && tab !== 'analytics' && (
          <div className="tab-container">
            <button
              onClick={() => setTab('dashboard')}
              className={`tab-button ${tab === 'dashboard' ? 'active' : ''}`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setTab('schools')}
              className={`tab-button ${tab === 'schools' ? 'active' : ''}`}
            >
              🏫 Schools
            </button>
            <button
              onClick={() => setTab('users')}
              className={`tab-button ${tab === 'users' ? 'active' : ''}`}
            >
              👥 Users
            </button>
          </div>
        )}

        {/* OLD DASHBOARD - Remove this section */}
        {tab === 'dashboard-old' && (
          <div className="card">
            <h3>📊 Platform Overview</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Welcome to the EduckPro admin panel. Monitor and manage your entire platform.
            </p>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#eff6ff', 
                borderRadius: '0.5rem',
                border: '1px solid #60a5fa'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📈</span>
                  <strong style={{ color: '#1e40af' }}>Platform Statistics</strong>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>
                  <div style={{ marginBottom: '0.5rem' }}>• {totalUsers} users registered across {totalSchools} schools</div>
                  <div style={{ marginBottom: '0.5rem' }}>• {activeUsers} active users ({Math.round((activeUsers/totalUsers)*100)}% activity rate)</div>
                  <div>• User distribution: {usersByRole.parent} parents, {usersByRole.teacher} teachers, {usersByRole.admin} admins</div>
                </div>
              </div>

              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#d1fae5', 
                borderRadius: '0.5rem',
                border: '1px solid #34d399'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🎯</span>
                  <strong style={{ color: '#065f46' }}>Quick Actions</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <button 
                    className="btn" 
                    onClick={() => setTab('users')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    ➕ Create New User
                  </button>
                  <button 
                    className="btn" 
                    onClick={() => setTab('schools')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#10b981' }}
                  >
                    🏫 View Schools
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCHOOLS TAB */}
        {tab === 'schools' && (
          <div className="card">
            <h3>🏫 Schools Management</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              View and manage all schools on the platform
            </p>
            
            {schools.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No schools registered yet</p>
                <p style={{ fontSize: '0.9rem' }}>Schools will appear here as admins create them</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {schools.map(school => (
                  <li
                    key={school.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                      backgroundColor: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                          🏫 {school.name}
                        </h4>
                        {school.address && (
                          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            📍 {school.address}
                            {school.city && `, ${school.city}`}
                            {school.country && `, ${school.country}`}
                          </div>
                        )}
                        {school._count && (
                          <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.5rem' }}>
                            <span style={{ marginRight: '1rem' }}>👨‍🎓 {school._count.students || 0} students</span>
                            <span style={{ marginRight: '1rem' }}>📚 {school._count.classes || 0} classes</span>
                            <span>👥 {school._count.users || 0} users</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <>
            {/* Create user */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3>➕ Create New User</h3>
              <form onSubmit={handleCreateUser}>
          <input
            placeholder="Full name"
            value={createForm.name}
            onChange={e =>
              setCreateForm(f => ({ ...f, name: e.target.value }))
            }
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={createForm.email}
            onChange={e =>
              setCreateForm(f => ({ ...f, email: e.target.value }))
            }
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <select
            value={createForm.role}
            onChange={e =>
              setCreateForm(f => ({ ...f, role: e.target.value }))
            }
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          >
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="admin">School Admin</option>
            <option value="owner">Owner (global)</option>
          </select>

          {createForm.role !== 'owner' && (
            <select
              value={createForm.schoolId}
              onChange={e =>
                setCreateForm(f => ({ ...f, schoolId: e.target.value }))
              }
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            >
              <option value="">Select school</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="password"
            placeholder="Initial password"
            value={createForm.password}
            onChange={e =>
              setCreateForm(f => ({ ...f, password: e.target.value }))
            }
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />

          {createError && (
            <p style={{ color: 'red', marginBottom: '0.5rem' }}>{createError}</p>
          )}

          <button className="btn" type="submit" disabled={creating}>
            {creating ? 'Creating...' : 'Create user'}
          </button>
        </form>
      </div>

      {/* Users list */}
      <div className="card">
        <h3>All users</h3>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            alignItems: 'center',
          }}
        >
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.4rem' }}
          />
          <button className="btn" type="button" onClick={loadUsers}>
            Search / Refresh
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(u => (
              <li
                key={u.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.75rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {u.name}{' '}
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    ({u.email})
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Role:{' '}
                  <select
                    value={u.role}
                    onChange={e => changeRole(u.id, e.target.value)}
                    style={{ padding: '0.2rem 0.4rem', marginRight: '0.5rem' }}
                  >
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">School Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                  Status:{' '}
                  <span
                    style={{
                      fontWeight: 600,
                      color: u.isActive ? 'green' : 'red',
                    }}
                  >
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Created:{' '}
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleString()
                    : '—'}
                </div>

                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => resetPassword(u.id)}
                  >
                    Reset password
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => toggleActive(u)}
                  >
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => deleteUser(u.id)}
                    style={{ backgroundColor: '#ef4444' }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
        </>
      )}

      {/* PROFILE TAB */}
      {tab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
}


/* ======================= PARENT LAYOUT ======================= */

function ParentLayout() {
  const [tab, setTab] = useState('children'); // 'children' | 'fees' | 'classes' | 'messages' | 'schools'
  const [me, setMe] = useState(null);

  // Load current user
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setMe(u);
    } catch {
      setMe(null);
    }
  }, []);

  // Sidebar tabs configuration
  const parentTabs = [
    { id: 'children', label: 'Children', icon: <Baby size={20} /> },
    { id: 'fees', label: 'Fees', icon: <DollarSign size={20} /> },
    { id: 'schools', label: 'Schools', icon: <School size={20} /> },
    { id: 'classes', label: 'Classes', icon: <BookOpen size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> },
  ];

  // Children state
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState('');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
  });
  const [uploadedDocs, setUploadedDocs] = useState({
    birthCertificate: null,
    medicalRecords: null,
    idDocument: null,
    otherDocuments: [],
  });

  // Fees / invoices state
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const [payingId, setPayingId] = useState(null);

  // Classes state
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classError, setClassError] = useState('');

  // Load classes when "classes" tab active
  useEffect(() => {
    if (tab !== 'classes') return;

    async function fetchClasses() {
      try {
        setLoadingClasses(true);
        setClassError('');
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/api/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load classes');

        setClasses(data);
      } catch (err) {
        setClassError(err.message);
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, [tab]);

  // Load students on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        setStudentError('');
        setLoadingStudents(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingStudents(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/students/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          // Token invalid/expired - silently fail
          console.log('Students: Authentication required');
          setLoadingStudents(false);
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load students');
        }

        setStudents(data);
      } catch (err) {
        // Silently fail for network errors
        console.log('Students: Unable to load', err.message);
      } finally {
        setLoadingStudents(false);
      }
    }

    fetchStudents();
  }, []);

  // Load invoices when tab "fees" is opened first time or force reload
  const [reloadInvoices, setReloadInvoices] = useState(0);
  
  useEffect(() => {
    if (tab !== 'fees' && invoices.length > 0 && reloadInvoices === 0) return;

    async function fetchInvoices() {
      try {
        setInvoiceError('');
        setLoadingInvoices(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingInvoices(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/invoices/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          // Token invalid/expired - silently fail
          console.log('Invoices: Authentication required');
          setLoadingInvoices(false);
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load invoices');
        }

        setInvoices(data);
      } catch (err) {
        // Silently fail for network errors
        console.log('Invoices: Unable to load', err.message);
      } finally {
        setLoadingInvoices(false);
      }
    }

    fetchInvoices();
  }, [tab, reloadInvoices]);

  // Socket.IO for real-time invoice notifications
  const [socket, setSocket] = useState(null);
  const [newInvoiceAlert, setNewInvoiceAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(API_URL, {
      auth: { token },
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected (parent):', s.id);
    });

    s.on('invoice:created', (data) => {
      console.log('New invoice notification:', data);
      setNewInvoiceAlert(data);
      // Auto-reload invoices
      setReloadInvoices(prev => prev + 1);
      
      // Clear alert after 10 seconds
      setTimeout(() => {
        setNewInvoiceAlert(null);
      }, 10000);
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected (parent)');
    });

    return () => {
      s.disconnect();
    };
  }, []);

  async function handleAddStudent(e) {
    e.preventDefault();
    setStudentError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare the student data
      const studentData = {
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        dateOfBirth: studentForm.dateOfBirth || null,
        gender: studentForm.gender || null,
        address: studentForm.address || null,
        city: studentForm.city || null,
        state: studentForm.state || null,
        country: studentForm.country || null,
        postalCode: studentForm.postalCode || null,
        phone: studentForm.phone || null,
        email: studentForm.email || null,
        emergencyContact: studentForm.emergencyContact || null,
        emergencyPhone: studentForm.emergencyPhone || null,
      };

      const res = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add student');
      }

      setStudents(prev => [data, ...prev]);
      
      // Reset form
      setStudentForm({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        phone: '',
        email: '',
        emergencyContact: '',
        emergencyPhone: '',
      });
      setShowStudentForm(false);
      
      alert('Child added successfully! You can now enroll them in classes.');
    } catch (err) {
      setStudentError(err.message);
    }
  }

  async function handlePayInvoice(invoiceId) {
    try {
      setInvoiceError('');
      setPayingId(invoiceId);
      const token = localStorage.getItem('token');

      const res = await fetch(
        `${API_URL}/api/invoices/${invoiceId}/pay`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to pay invoice');
      }

      setInvoices(prev =>
        prev.map(inv => (inv.id === data.invoice.id ? data.invoice : inv))
      );
    } catch (err) {
      setInvoiceError(err.message);
    } finally {
      setPayingId(null);
    }
  }

  // Calculate statistics
  const totalChildren = students.length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING').length;
  const totalPending = invoices
    .filter(inv => inv.status === 'PENDING')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const enrolledClasses = new Set(students.flatMap(s => s.enrollments?.map(e => e.classId) || [])).size;

  return (
    <div className="dashboard-layout">
      <Sidebar 
        userRole="parent"
        userName={me?.name}
        userEmail={me?.email}
        currentTab={tab}
        onTabChange={setTab}
        tabs={parentTabs}
      />
      <div className="dashboard-content">
        {/* Notifications Bell */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
          <Notifications />
        </div>

        {/* New Invoice Notification Alert */}
        {newInvoiceAlert && (
          <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '0.5rem',
            padding: '1rem 1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>💰</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#92400e', marginBottom: '0.25rem' }}>
                  New Invoice Created!
                </div>
                <div style={{ fontSize: '0.9rem', color: '#78350f', marginBottom: '0.5rem' }}>
                  {newInvoiceAlert.message}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#92400e' }}>
                  Amount: {newInvoiceAlert.invoice.amount?.toLocaleString()} {newInvoiceAlert.invoice.fee?.currency || 'XOF'}
                </div>
                <button
                  onClick={() => {
                    setNewInvoiceAlert(null);
                    setTab('fees');
                  }}
                  className="btn"
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    backgroundColor: '#f59e0b',
                  }}
                >
                  View Invoice →
                </button>
              </div>
              <button
                onClick={() => setNewInvoiceAlert(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#92400e',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="title" style={{ marginBottom: '0.5rem' }}>👨‍👩‍👧‍👦 Parent Dashboard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>Manage your children, classes and school fees</p>
        </div>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><Baby size={32} color="var(--primary-color)" /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalChildren}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Children</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><BookOpen size={32} color="var(--success-color)" /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{enrolledClasses}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classes</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><DollarSign size={32} color="var(--warning-color)" /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{pendingInvoices}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending</div>
        </div>
        <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><DollarSign size={32} color="var(--danger-color)" /></div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>{totalPending.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>XOF Due</div>
        </div>
      </div>

      {/* Top tabs */}
      <div className="tab-container">
        <button
          onClick={() => setTab('children')}
          className={`tab-button ${tab === 'children' ? 'active' : ''}`}
        >
          👶 Children
        </button>
        <button
          onClick={() => setTab('fees')}
          className={`tab-button ${tab === 'fees' ? 'active' : ''}`}
        >
          💰 Fees
        </button>
        <button
          onClick={() => setTab('schools')}
          className={`tab-button ${tab === 'schools' ? 'active' : ''}`}
        >
          🏫 Schools
        </button>
        <button
          onClick={() => setTab('classes')}
          className={`tab-button ${tab === 'classes' ? 'active' : ''}`}
        >
          📚 Classes
        </button>
        <button
          onClick={() => setTab('messages')}
          className={`tab-button ${tab === 'messages' ? 'active' : ''}`}
        >
          💬 Messages
        </button>
      </div>

      {/* CHILDREN TAB */}
      {tab === 'children' && (
        <>
          {!showStudentForm ? (
            <div className="card" style={{ marginBottom: '1rem', textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👶</div>
              <h3 style={{ marginBottom: '1rem' }}>Add Your Child</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Please provide comprehensive information to help schools process enrollment requests efficiently
              </p>
              <button 
                className="btn" 
                onClick={() => setShowStudentForm(true)}
                style={{ padding: '0.75rem 2rem', fontSize: '1.05rem' }}
              >
                ✨ Add a Child
              </button>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Add a Child</h3>
                <button 
                  onClick={() => {
                    setShowStudentForm(false);
                    setStudentError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '0.25rem'
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddStudent}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      First Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      placeholder="e.g., John"
                      value={studentForm.firstName}
                      onChange={e => setStudentForm(f => ({ ...f, firstName: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Last Name <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      placeholder="e.g., Doe"
                      value={studentForm.lastName}
                      onChange={e => setStudentForm(f => ({ ...f, lastName: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={studentForm.dateOfBirth}
                      onChange={e => setStudentForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Gender
                    </label>
                    <select
                      value={studentForm.gender}
                      onChange={e => setStudentForm(f => ({ ...f, gender: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                    Address
                  </label>
                  <input
                    placeholder="Street address"
                    value={studentForm.address}
                    onChange={e => setStudentForm(f => ({ ...f, address: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      City
                    </label>
                    <input
                      placeholder="City"
                      value={studentForm.city}
                      onChange={e => setStudentForm(f => ({ ...f, city: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      State/Province
                    </label>
                    <input
                      placeholder="State"
                      value={studentForm.state}
                      onChange={e => setStudentForm(f => ({ ...f, state: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Country
                    </label>
                    <input
                      placeholder="Country"
                      value={studentForm.country}
                      onChange={e => setStudentForm(f => ({ ...f, country: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Postal Code
                    </label>
                    <input
                      placeholder="Postal code"
                      value={studentForm.postalCode}
                      onChange={e => setStudentForm(f => ({ ...f, postalCode: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={studentForm.phone}
                      onChange={e => setStudentForm(f => ({ ...f, phone: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Student's email (optional)"
                    value={studentForm.email}
                    onChange={e => setStudentForm(f => ({ ...f, email: e.target.value }))}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>


                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Emergency Contact Name
                    </label>
                    <input
                      placeholder="Emergency contact name"
                      value={studentForm.emergencyContact}
                      onChange={e => setStudentForm(f => ({ ...f, emergencyContact: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Emergency contact phone"
                      value={studentForm.emergencyPhone}
                      onChange={e => setStudentForm(f => ({ ...f, emergencyPhone: e.target.value }))}
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                </div>

                {/* Document Upload Section */}
                <div style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  border: '2px dashed #3b82f6',
                  borderRadius: '0.5rem',
                }}>
                  <h4 style={{ 
                    margin: '0 0 1rem 0', 
                    fontSize: '1rem',
                    color: '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    📎 Upload Documents (Optional)
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '1rem' }}>
                    Upload supporting documents to help schools verify your child's information
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {/* Birth Certificate */}
                    <div>
                      <label style={{ 
                        fontSize: '0.85rem', 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        📄 Birth Certificate
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedDocs(prev => ({ ...prev, birthCertificate: file }));
                          }
                        }}
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem',
                          fontSize: '0.85rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                        }}
                      />
                      {uploadedDocs.birthCertificate && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: '#d1fae5',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          color: '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>✅ {uploadedDocs.birthCertificate.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadedDocs(prev => ({ ...prev, birthCertificate: null }))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              fontSize: '1rem',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ID Document */}
                    <div>
                      <label style={{ 
                        fontSize: '0.85rem', 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        🪪 ID Document
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedDocs(prev => ({ ...prev, idDocument: file }));
                          }
                        }}
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem',
                          fontSize: '0.85rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                        }}
                      />
                      {uploadedDocs.idDocument && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: '#d1fae5',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          color: '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>✅ {uploadedDocs.idDocument.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadedDocs(prev => ({ ...prev, idDocument: null }))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              fontSize: '1rem',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Medical Records */}
                    <div>
                      <label style={{ 
                        fontSize: '0.85rem', 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        🏥 Medical Records
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedDocs(prev => ({ ...prev, medicalRecords: file }));
                          }
                        }}
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem',
                          fontSize: '0.85rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                        }}
                      />
                      {uploadedDocs.medicalRecords && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: '#d1fae5',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          color: '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>✅ {uploadedDocs.medicalRecords.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadedDocs(prev => ({ ...prev, medicalRecords: null }))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              fontSize: '1rem',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Other Documents */}
                    <div>
                      <label style={{ 
                        fontSize: '0.85rem', 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        📋 Other Documents
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            setUploadedDocs(prev => ({ 
                              ...prev, 
                              otherDocuments: [...prev.otherDocuments, ...files] 
                            }));
                          }
                        }}
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem',
                          fontSize: '0.85rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                        }}
                      />
                      {uploadedDocs.otherDocuments.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          {uploadedDocs.otherDocuments.map((file, index) => (
                            <div
                              key={index}
                              style={{ 
                                marginBottom: '0.25rem',
                                padding: '0.5rem',
                                backgroundColor: '#d1fae5',
                                borderRadius: '0.375rem',
                                fontSize: '0.8rem',
                                color: '#065f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>✅ {file.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadedDocs(prev => ({
                                    ...prev,
                                    otherDocuments: prev.otherDocuments.filter((_, i) => i !== index)
                                  }));
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  padding: '0.25rem',
                                  fontSize: '1rem',
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#fff',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}>
                    <strong>📌 Note:</strong> Accepted formats: PDF, JPG, JPEG, PNG. Max size: 5MB per file.
                    Documents are optional but recommended for faster enrollment processing.
                  </div>
                </div>

                {studentError && (
                  <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    ⚠️ {studentError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" type="submit" style={{ flex: 1, padding: '0.75rem' }}>
                    ✨ Add Child
                  </button>
                  <button 
                    type="button"
                    className="btn" 
                    onClick={() => {
                      setShowStudentForm(false);
                      setStudentError('');
                    }}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6b7280' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <h3>Your children</h3>
            {loadingStudents ? (
              <p>Loading...</p>
            ) : students.length === 0 ? (
              <p>No children yet. Add one above.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {students.map(s => (
                  <li
                    key={s.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '1.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {/* Child Header */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                    }}>
                      <div style={{ 
                        width: '3rem', 
                        height: '3rem', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--primary-color)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'white',
                        marginRight: '1rem',
                      }}>
                        👶
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>
                          {s.firstName} {s.lastName}
                        </h4>
                        {s.dateOfBirth && (
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                            📅 Born: {new Date(s.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Enrollments Info */}
                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap',
                      marginBottom: '1rem',
                      marginLeft: '1rem',
                    }}>
                      <button
                        className="btn"
                        onClick={() => {
                          // TODO: Add edit student functionality
                          alert('Edit student functionality - Coming soon!');
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        ✏️ Update Info
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setTab('schools');
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        📚 Enroll in Class
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setTab('fees');
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        💰 View Fees
                      </button>
                      {s.enrollments && s.enrollments.length > 0 && s.enrollments.some(e => e.class?.teacher) && (
                        <button
                          className="btn"
                          onClick={() => {
                            setTab('messages');
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            backgroundColor: '#8b5cf6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          💬 Chat with Teacher
                        </button>
                      )}
                    </div>

                    {s.enrollments && s.enrollments.length > 0 ? (
                      <div style={{ marginLeft: '1rem' }}>
                        <h5 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#374151' }}>
                          📚 Enrolled Classes ({s.enrollments.length})
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {s.enrollments.map((enrollment) => (
                            <div
                              key={enrollment.id}
                              style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                              }}
                            >
                              {/* Class Info */}
                              <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📖</span>
                                  <strong style={{ fontSize: '1.05rem' }}>
                                    {enrollment.class?.name || 'Unknown Class'}
                                  </strong>
                                  {enrollment.class?.level && (
                                    <span style={{
                                      marginLeft: '0.5rem',
                                      padding: '0.2rem 0.6rem',
                                      fontSize: '0.75rem',
                                      backgroundColor: '#eff6ff',
                                      color: '#1e40af',
                                      borderRadius: '0.25rem',
                                      fontWeight: '600',
                                    }}>
                                      {enrollment.class.level}
                                    </span>
                                  )}
                                  <span style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.2rem 0.6rem',
                                    fontSize: '0.75rem',
                                    backgroundColor: enrollment.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7',
                                    color: enrollment.status === 'ACTIVE' ? '#065f46' : '#92400e',
                                    borderRadius: '0.25rem',
                                    fontWeight: '600',
                                  }}>
                                    {enrollment.status}
                                  </span>
                                </div>

                                {/* School Info */}
                                {enrollment.class?.school && (
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    fontSize: '0.9rem', 
                                    color: '#4b5563',
                                    marginBottom: '0.25rem',
                                  }}>
                                    <span style={{ marginRight: '0.5rem' }}>🏫</span>
                                    <strong>{enrollment.class.school.name}</strong>
                                    {enrollment.class.school.address && (
                                      <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                                        • {enrollment.class.school.address}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Teacher Info */}
                                {enrollment.class?.teacher && (
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    marginTop: '0.5rem',
                                    padding: '0.5rem',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '0.375rem',
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>👨‍🏫</span>
                                      <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                          {enrollment.class.teacher.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                          {enrollment.class.teacher.email}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      className="btn"
                                      onClick={() => {
                                        setTab('messages');
                                        // Message functionality will open messages tab
                                      }}
                                      style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                      }}
                                    >
                                      💬 Message
                                    </button>
                                  </div>
                                )}

                                {enrollment.class?.description && (
                                  <p style={{ 
                                    fontSize: '0.85rem', 
                                    color: '#6b7280', 
                                    marginTop: '0.5rem',
                                    marginBottom: 0,
                                  }}>
                                    {enrollment.class.description}
                                  </p>
                                )}
                              </div>

                              {/* Enrollment Date */}
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#9ca3af', 
                                marginTop: '0.5rem',
                                paddingTop: '0.5rem',
                                borderTop: '1px solid #e5e7eb',
                              }}>
                                Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '1rem',
                        backgroundColor: '#fef3c7',
                        borderRadius: '0.5rem',
                        marginLeft: '1rem',
                        fontSize: '0.9rem',
                        color: '#92400e',
                      }}>
                        ℹ️ Not enrolled in any classes yet. Visit the Schools or Classes tab to enroll.
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* FEES TAB */}
      {tab === 'fees' && (
        <div className="card">
          <h3>Your fees & invoices</h3>
          {invoiceError && (
            <p style={{ color: 'red', marginBottom: '0.5rem' }}>{invoiceError}</p>
          )}
          {loadingInvoices ? (
            <p>Loading...</p>
          ) : invoices.length === 0 ? (
            <p>No invoices yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {invoices.map(inv => (
                <li
                  key={inv.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{ fontWeight: '600' }}>
                    {inv.fee?.name || 'Fee'} –{' '}
                    {(inv.amount || 0).toLocaleString()} {inv.fee?.currency || 'XOF'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                    Child: {inv.student?.firstName} {inv.student?.lastName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Status:{' '}
                    <span
                      style={{
                        fontWeight: '600',
                        color:
                          inv.status === 'PAID'
                            ? 'green'
                            : inv.status === 'PENDING'
                            ? '#d97706'
                            : 'red',
                      }}
                    >
                      {inv.status}
                    </span>{' '}
                    {inv.dueDate &&
                      `• Due: ${new Date(inv.dueDate).toLocaleDateString()}`}
                  </div>
                  {inv.status === 'PENDING' && (
                    <button
                      className="btn"
                      type="button"
                      style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem' }}
                      onClick={() => handlePayInvoice(inv.id)}
                      disabled={payingId === inv.id}
                    >
                      {payingId === inv.id ? 'Paying...' : 'Pay now'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* SCHOOLS TAB */}
      {tab === 'schools' && (
        <SchoolBrowser 
          students={students}
          onSelectSchool={(school, classes) => {
            // When a school is selected for enrollment, we can show an enrollment modal
            // or redirect to a specific enrollment flow
            alert(`Selected ${school.name}. Please select a class from the "Available Classes" section to enroll your child.`);
          }}
        />
      )}

      {/* CLASSES TAB */}
      {tab === 'classes' && (
        <div className="card">
          <h3>Available Classes</h3>
          {classError && <p style={{ color: 'red' }}>{classError}</p>}
          {loadingClasses ? (
            <p>Loading...</p>
          ) : classes.length === 0 ? (
            <p>No classes available yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {classes.map(cls => (
                <li
                  key={cls.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <strong>{cls.name}</strong> {cls.level && `(${cls.level})`}
                  {cls.description && (
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      {cls.description}
                    </div>
                  )}

                  {cls.enrollmentFee && (
                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Enrollment fee:{' '}
                      {cls.enrollmentFee.amount.toLocaleString()}{' '}
                      {cls.enrollmentFee.currency}
                    </div>
                  )}
                  {cls.tuitionFee && (
                    <div style={{ fontSize: '0.85rem' }}>
                      Tuition fee:{' '}
                      {cls.tuitionFee.amount.toLocaleString()}{' '}
                      {cls.tuitionFee.currency}
                    </div>
                  )}

                  <div style={{ marginTop: '0.75rem' }}>
                    <EnrollForm cls={cls} students={students} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* MESSAGES TAB */}
      {tab === 'messages' && <ParentMessages />}

      {/* PROFILE TAB */}
      {tab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
}

/* ======================= PARENT MESSAGES ======================= */

function ParentMessages() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [contactFilter, setContactFilter] = useState('all'); // 'all' | 'teacher' | 'admin'

  // Contacts with unread count
  useEffect(() => {
    async function fetchContacts() {
      try {
        setMsgError('');
        setLoadingContacts(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load contacts');
        
        // Filter to only show teachers and admins (school staff)
        const filteredContacts = data.filter(contact => 
          contact.role === 'teacher' || contact.role === 'admin'
        );
        
        setContacts(filteredContacts);
      } catch (err) {
        setMsgError(err.message);
      } finally {
        setLoadingContacts(false);
      }
    }
    fetchContacts();
  }, []);

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(API_URL, {
      auth: { token },
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected (parent):', s.id);
    });

    s.on('chat:new-message', msg => {
      if (
        selectedContact &&
        (msg.senderId === selectedContact.id || msg.receiverId === selectedContact.id)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected (parent)');
    });

    return () => {
      s.disconnect();
    };
  }, [selectedContact]);

  async function loadConversation(contact) {
    try {
      setSelectedContact(contact);
      setMsgError('');
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/chat/conversation/${contact.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load messages');
      setMessages(data);
      
      // Mark messages as read
      await markMessagesAsRead(contact.id);
      
      // Update contact's unread count in the list
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      setMsgError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function markMessagesAsRead(contactId) {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/chat/mark-read/${contactId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedContact || !newMessage.trim()) return;

    try {
      setMsgError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');

      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (err) {
      setMsgError(err.message);
    }
  }

  const filteredContacts = contactFilter === 'all' 
    ? contacts 
    : contacts.filter(c => c.role === contactFilter);

  return (
    <div className="card">
      <h3>Messages</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Chat with teachers and school administrators
      </p>
      {msgError && <p style={{ color: 'red' }}>{msgError}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {/* Contacts list */}
        <div
          style={{
            width: '35%',
            maxHeight: '300px',
            overflowY: 'auto',
            borderRight: '1px solid #e5e7eb',
            paddingRight: '0.5rem',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <select
              value={contactFilter}
              onChange={e => setContactFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
              }}
            >
              <option value="all">All Contacts</option>
              <option value="teacher">Teachers Only</option>
              <option value="admin">School Admins</option>
            </select>
          </div>

          {loadingContacts ? (
            <p>Loading...</p>
          ) : filteredContacts.length === 0 ? (
            <p style={{ fontSize: '0.85rem' }}>No contacts found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredContacts.map(c => (
                <li key={c.id} style={{ marginBottom: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => loadConversation(c)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem',
                      borderRadius: '0.5rem',
                      border:
                        selectedContact && selectedContact.id === c.id
                          ? '2px solid #2563eb'
                          : '1px solid #e5e7eb',
                      background:
                        selectedContact && selectedContact.id === c.id
                          ? '#eff6ff'
                          : '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 600 }}>
                        {c.name}{' '}
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.1rem 0.3rem', 
                          borderRadius: '0.25rem',
                          background: c.role === 'teacher' ? '#dbeafe' : '#fef3c7',
                          color: c.role === 'teacher' ? '#1e40af' : '#92400e'
                        }}>
                          {c.role === 'teacher' ? '👨‍🏫' : '🏫'}
                        </span>
                      </div>
                      {c.unreadCount > 0 && (
                        <span style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          borderRadius: '9999px',
                          padding: '0.1rem 0.4rem',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          minWidth: '1.2rem',
                          textAlign: 'center',
                        }}>
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {c.email}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Conversation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedContact ? (
            <>
              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.25rem',
                }}
              >
                <strong>{selectedContact.name}</strong>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {selectedContact.email}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  marginBottom: '0.5rem',
                  paddingRight: '0.25rem',
                }}
              >
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p style={{ fontSize: '0.85rem' }}>No messages yet. Say hello 👋</p>
                ) : (
                  messages.map(m => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent:
                          m.senderId === getCurrentUserId()
                            ? 'flex-end'
                            : 'flex-start',
                        marginBottom: '0.3rem',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '0.75rem',
                          background:
                            m.senderId === getCurrentUserId()
                              ? '#2563eb'
                              : '#e5e7eb',
                          color:
                            m.senderId === getCurrentUserId()
                              ? '#ffffff'
                              : '#111827',
                          fontSize: '0.85rem',
                        }}
                      >
                        {m.content}
                        <div
                          style={{
                            fontSize: '0.7rem',
                            marginTop: '0.15rem',
                            opacity: 0.8,
                          }}
                        >
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                style={{ display: 'flex', gap: '0.25rem' }}
              >
                <input
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem' }}
                />
                <button
                  type="submit"
                  className="btn"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <p style={{ fontSize: '0.85rem' }}>
              Select a teacher to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* Helper for messages */

function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  } catch {
    return null;
  }
}

/* ======================= TEACHER LAYOUT & MESSAGES ======================= */

function TeacherLayout() {
  const [tab, setTab] = useState('classes'); // 'classes' | 'students' | 'messages'
  const [me, setMe] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classError, setClassError] = useState('');

  // Load current user
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setMe(u);
    } catch {
      setMe(null);
    }
  }, []);

  // Sidebar tabs configuration
  const teacherTabs = [
    { id: 'classes', label: 'My Classes', icon: <BookOpen size={20} /> },
    { id: 'students', label: 'Students', icon: <GraduationCap size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> },
  ];

  // Load teacher's classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoadingClasses(true);
        setClassError('');
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${API_URL}/api/classes/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load classes');

        setClasses(data);
      } catch (err) {
        setClassError(err.message);
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchClasses();
  }, []);

  // Calculate statistics
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.enrollments?.filter(e => e.status === 'ACTIVE').length || 0), 0);
  const totalEnrollments = classes.reduce((sum, cls) => sum + (cls.enrollments?.length || 0), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar 
        userRole="teacher"
        userName={me?.name}
        userEmail={me?.email}
        currentTab={tab}
        onTabChange={setTab}
        tabs={teacherTabs}
      />
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="title" style={{ marginBottom: '0.5rem' }}>👨‍🏫 Teacher Dashboard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
            Manage your classes and communicate with students
          </p>
        </div>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalClasses}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>My Classes</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🎓</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{totalStudents}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Students</div>
          </div>
          <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{totalEnrollments}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Enrollments</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-container">
          <button
            onClick={() => setTab('classes')}
            className={`tab-button ${tab === 'classes' ? 'active' : ''}`}
          >
            📚 My Classes
          </button>
          <button
            onClick={() => setTab('students')}
            className={`tab-button ${tab === 'students' ? 'active' : ''}`}
          >
            👨‍🎓 Students
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`tab-button ${tab === 'messages' ? 'active' : ''}`}
          >
            💬 Messages
          </button>
        </div>

        {/* CLASSES TAB */}
        {tab === 'classes' && (
          <div className="card">
            <h3>📚 My Classes</h3>
            {classError && <p style={{ color: 'red' }}>{classError}</p>}
            {loadingClasses ? (
              <p>Loading...</p>
            ) : classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No classes assigned yet</p>
                <p style={{ fontSize: '0.9rem' }}>Contact your school admin to be assigned to classes</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {classes.map(cls => (
                  <li
                    key={cls.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '1.1rem' }}>📖 {cls.name}</strong>
                          {cls.level && (
                            <span style={{ 
                              marginLeft: '0.5rem',
                              padding: '0.2rem 0.6rem',
                              fontSize: '0.75rem',
                              backgroundColor: '#eff6ff',
                              color: '#1e40af',
                              borderRadius: '0.25rem',
                              fontWeight: '600',
                            }}>
                              {cls.level}
                            </span>
                          )}
                        </div>
                        
                        {cls.description && (
                          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.5rem 0' }}>
                            {cls.description}
                          </p>
                        )}

                        {/* School Info */}
                        {cls.school && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontSize: '0.85rem', 
                            color: '#6b7280',
                            marginTop: '0.5rem'
                          }}>
                            <span style={{ marginRight: '0.5rem' }}>🏫</span>
                            <span>{cls.school.name}</span>
                            {cls.school.address && (
                              <span style={{ marginLeft: '0.5rem' }}>• {cls.school.address}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ 
                        marginLeft: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        minWidth: '80px'
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                          {cls.enrollments?.filter(e => e.status === 'ACTIVE').length || 0}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Students</div>
                      </div>
                    </div>

                    {/* Enrolled Students */}
                    {cls.enrollments && cls.enrollments.length > 0 && (
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem'
                      }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#374151' }}>
                          Enrolled Students:
                        </h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {cls.enrollments.filter(e => e.status === 'ACTIVE').map(enrollment => (
                            <div
                              key={enrollment.id}
                              style={{
                                padding: '0.4rem 0.8rem',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <span>👨‍🎓</span>
                              <span>{enrollment.student?.firstName} {enrollment.student?.lastName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div className="card">
            <h3>👨‍🎓 All My Students</h3>
            {loadingClasses ? (
              <p>Loading...</p>
            ) : classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🎓</div>
                <p>No students yet. You need to be assigned to classes first.</p>
              </div>
            ) : (
              <div>
                {classes.map(cls => (
                  cls.enrollments && cls.enrollments.filter(e => e.status === 'ACTIVE').length > 0 && (
                    <div key={cls.id} style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        marginBottom: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem'
                      }}>
                        📖 {cls.name} {cls.level && `(${cls.level})`}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cls.enrollments
                          .filter(e => e.status === 'ACTIVE')
                          .map(enrollment => (
                            <li
                              key={enrollment.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem',
                                marginBottom: '0.5rem',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '2.5rem',
                                  height: '2.5rem',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--primary-color)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.2rem',
                                  color: 'white'
                                }}>
                                  👨‍🎓
                                </div>
                                <div>
                                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                                    {enrollment.student?.firstName} {enrollment.student?.lastName}
                                  </div>
                                  {enrollment.student?.parent && (
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                      Parent: {enrollment.student.parent.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {tab === 'messages' && <TeacherMessages />}

        {/* PROFILE TAB */}
        {tab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
}

function TeacherMessages() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setMsgError('');
        setLoadingContacts(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load contacts');
        setContacts(data);
      } catch (err) {
        setMsgError(err.message);
      } finally {
        setLoadingContacts(false);
      }
    }
    fetchContacts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(API_URL, {
      auth: { token },
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected (teacher):', s.id);
    });

    s.on('chat:new-message', msg => {
      if (
        selectedContact &&
        (msg.senderId === selectedContact.id || msg.receiverId === selectedContact.id)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected (teacher)');
    });

    return () => {
      s.disconnect();
    };
  }, [selectedContact]);

  async function loadConversation(contact) {
    try {
      setSelectedContact(contact);
      setMsgError('');
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/chat/conversation/${contact.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load messages');
      setMessages(data);
    } catch (err) {
      setMsgError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedContact || !newMessage.trim()) return;

    try {
      setMsgError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');

      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (err) {
      setMsgError(err.message);
    }
  }

  return (
    <div className="card">
      <h3>Messages</h3>
      {msgError && <p style={{ color: 'red' }}>{msgError}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {/* Contacts list (parents) */}
        <div
          style={{
            width: '35%',
            maxHeight: '300px',
            overflowY: 'auto',
            borderRight: '1px solid #e5e7eb',
            paddingRight: '0.5rem',
          }}
        >
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Parents</h4>
          {loadingContacts ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p style={{ fontSize: '0.85rem' }}>No parents found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {contacts
                .filter(c => c.role === 'parent')
                .map(c => (
                  <li key={c.id} style={{ marginBottom: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => loadConversation(c)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.4rem',
                        borderRadius: '0.5rem',
                        border:
                          selectedContact && selectedContact.id === c.id
                            ? '2px solid #2563eb'
                            : '1px solid #e5e7eb',
                        background:
                          selectedContact && selectedContact.id === c.id
                            ? '#eff6ff'
                            : '#ffffff',
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {c.email}
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Conversation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedContact ? (
            <>
              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.25rem',
                }}
              >
                <strong>{selectedContact.name}</strong>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {selectedContact.email}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  marginBottom: '0.5rem',
                  paddingRight: '0.25rem',
                }}
              >
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p style={{ fontSize: '0.85rem' }}>No messages yet.</p>
                ) : (
                  messages.map(m => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent:
                          m.senderId === getCurrentUserId()
                            ? 'flex-end'
                            : 'flex-start',
                        marginBottom: '0.3rem',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '0.75rem',
                          background:
                            m.senderId === getCurrentUserId()
                              ? '#2563eb'
                              : '#e5e7eb',
                          color:
                            m.senderId === getCurrentUserId()
                              ? '#ffffff'
                              : '#111827',
                          fontSize: '0.85rem',
                        }}
                      >
                        {m.content}
                        <div
                          style={{
                            fontSize: '0.7rem',
                            marginTop: '0.15rem',
                            opacity: 0.8,
                          }}
                        >
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                style={{ display: 'flex', gap: '0.25rem' }}
              >
                <input
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem' }}
                />
                <button
                  type="submit"
                  className="btn"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <p style={{ fontSize: '0.85rem' }}>
              Select a parent to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================= ADMIN LAYOUT ======================= */

function AdminLayout() {
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'fees' | 'invoices' | 'enrollments' | 'messages'
  const [me, setMe] = useState(null);

  // Load current user
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setMe(u);
    } catch {
      setMe(null);
    }
  }, []);

  // Sidebar tabs configuration
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'school', label: 'School', icon: <School size={20} /> },
    { id: 'teachers', label: 'Teachers', icon: <GraduationCap size={20} /> },
    { id: 'classes', label: 'Classes', icon: <BookOpen size={20} /> },
    { id: 'fees', label: 'Fees', icon: <DollarSign size={20} /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt size={20} /> },
    { id: 'enrollments', label: 'Enrollments', icon: <CheckSquare size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle size={20} /> },
  ];

  // School info state
  const [hasSchool, setHasSchool] = useState(false);
  const [checkingSchool, setCheckingSchool] = useState(true);
  const [schoolName, setSchoolName] = useState('');

  // Fees
  const [fees, setFees] = useState([]);
  const [feeName, setFeeName] = useState('');
  const [feeDescription, setFeeDescription] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeCurrency, setFeeCurrency] = useState('XOF');
  const [feeError, setFeeError] = useState('');
  const [loadingFees, setLoadingFees] = useState(true);
  const [editingFeeId, setEditingFeeId] = useState(null);

  // Students & invoices
  const [students, setStudents] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceStudentId, setInvoiceStudentId] = useState('');
  const [invoiceFeeId, setInvoiceFeeId] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceError, setInvoiceError] = useState('');
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Enrollments
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [enrollmentError, setEnrollmentError] = useState('');
  // Classes for enrollment
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classError, setClassError] = useState('');

  // Admin create-enrollment form
  const [enrollStudentId, setEnrollStudentId] = useState('');
  const [enrollClassId, setEnrollClassId] = useState('');
  const [creatingEnrollment, setCreatingEnrollment] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState('');

  // New Student Enrollment Form
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  // Class management
  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    level: '',
    enrollmentFeeId: '',
    tuitionFeeId: '',
    teacherId: '',
  });
  const [creatingClass, setCreatingClass] = useState(false);
  const [classFormError, setClassFormError] = useState('');
  const [classFormSuccess, setClassFormSuccess] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);

  // Load pending enrollments when tab active
  useEffect(() => {
    if (tab !== 'enrollments') return;

    async function fetchEnrollments() {
      try {
        setLoadingEnrollments(true);
        setEnrollmentError('');
        const token = localStorage.getItem('token');

        const res = await fetch(
          `${API_URL}/api/admin/enrollments?status=PENDING`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load enrollments');

        setEnrollments(data);
      } catch (err) {
        setEnrollmentError(err.message);
      } finally {
        setLoadingEnrollments(false);
      }
    }

    fetchEnrollments();
  }, [tab]);

  async function approveEnrollment(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/admin/enrollments/${id}/approve`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Approval failed');

      setEnrollments(prev => prev.filter(e => e.id !== id));
      alert('Enrollment approved! Invoices have been created.');
    } catch (err) {
      alert(err.message);
    }
  }

  // Check if admin has a school
  useEffect(() => {
    async function checkSchool() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (res.ok && data.school) {
          setHasSchool(true);
          setSchoolName(data.school.name || '');
        } else {
          setHasSchool(false);
          setSchoolName('');
        }
      } catch (err) {
        console.error('Failed to check school:', err);
        setHasSchool(false);
        setSchoolName('');
      } finally {
        setCheckingSchool(false);
      }
    }

    checkSchool();
  }, [tab]); // Re-check when tab changes

  // Load fees, students, invoices, and classes on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function fetchFees() {
      try {
        setLoadingFees(true);
        const res = await fetch(`${API_URL}/api/fees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load fees');
        setFees(data);
      } catch (err) {
        setFeeError(err.message);
      } finally {
        setLoadingFees(false);
      }
    }

    async function fetchStudents() {
      try {
        const res = await fetch(`${API_URL}/api/admin/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load students');
        setStudents(data);
      } catch (err) {
        setInvoiceError(err.message);
      }
    }

    async function fetchInvoices() {
      try {
        setLoadingInvoices(true);
        const res = await fetch(`${API_URL}/api/admin/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load invoices');
        setInvoices(data);
      } catch (err) {
        setInvoiceError(err.message);
      } finally {
        setLoadingInvoices(false);
      }
    }

    async function fetchClasses() {
      try {
        setLoadingClasses(true);
        setClassError('');
        const res = await fetch(`${API_URL}/api/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load classes');
        setClasses(data);
      } catch (err) {
        setClassError(err.message);
      } finally {
        setLoadingClasses(false);
      }
    }

    fetchFees();
    fetchStudents();
    fetchInvoices();
    fetchClasses();
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      setLoadingTeachers(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load teachers');
      setTeachers(data);
    } catch (err) {
      console.error('Failed to load teachers:', err.message);
    } finally {
      setLoadingTeachers(false);
    }
  }


  async function handleCreateFee(e) {
    e.preventDefault();
    setFeeError('');

    try {
      const token = localStorage.getItem('token');
      
      // Check if we're editing or creating
      const url = editingFeeId 
        ? `${API_URL}/api/fees/${editingFeeId}`
        : `${API_URL}/api/fees`;
      const method = editingFeeId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: feeName,
          description: feeDescription,
          amount: Number(feeAmount),
          currency: feeCurrency,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${editingFeeId ? 'update' : 'create'} fee`);

      if (editingFeeId) {
        // Update existing fee in the list
        setFees(prev => prev.map(f => f.id === editingFeeId ? data : f));
        alert('Fee updated successfully!');
      } else {
        // Add new fee to the list
        setFees(prev => [data, ...prev]);
      }
      
      // Clear form
      setFeeName('');
      setFeeDescription('');
      setFeeAmount('');
      setEditingFeeId(null);
    } catch (err) {
      setFeeError(err.message);
    }
  }

  async function handleCreateInvoice(e) {
    e.preventDefault();
    setInvoiceError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: Number(invoiceStudentId),
          feeId: Number(invoiceFeeId),
          dueDate: invoiceDueDate || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create invoice');

      setInvoices(prev => [data, ...prev]);
      setInvoiceStudentId('');
      setInvoiceFeeId('');
      setInvoiceDueDate('');
    } catch (err) {
      setInvoiceError(err.message);
    }
  }

  async function handleAdminEnroll(e) {
    e.preventDefault();
    setEnrollError('');
    setEnrollSuccess('');

    try {
      setCreatingEnrollment(true);
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_URL}/api/admin/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: Number(enrollStudentId),
          classId: Number(enrollClassId),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enrollment failed');

      setEnrollSuccess('Student enrolled successfully and invoices created.');
      setEnrollStudentId('');
      setEnrollClassId('');

      // optional: refresh pending enrollments list
      if (tab === 'enrollments') {
        // you can re-trigger the enrollments fetch here if you want
      }
    } catch (err) {
      setEnrollError(err.message);
    } finally {
      setCreatingEnrollment(false);
    }
  }

  async function handleCreateClass(e) {
    e.preventDefault();
    setClassFormError('');
    setClassFormSuccess('');

    try {
      setCreatingClass(true);
      const token = localStorage.getItem('token');

      // Get schoolId from current user
      if (!me?.schoolId) {
        throw new Error('School information not found. Please set up your school first.');
      }

      const payload = {
        name: classForm.name,
        description: classForm.description || null,
        level: classForm.level || null,
        schoolId: me.schoolId,
        enrollmentFeeId: classForm.enrollmentFeeId ? Number(classForm.enrollmentFeeId) : null,
        tuitionFeeId: classForm.tuitionFeeId ? Number(classForm.tuitionFeeId) : null,
        teacherId: classForm.teacherId ? Number(classForm.teacherId) : null,
      };

      // Check if we're editing or creating
      const url = editingClassId 
        ? `${API_URL}/api/classes/${editingClassId}`
        : `${API_URL}/api/classes`;
      const method = editingClassId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${editingClassId ? 'update' : 'create'} class`);

      if (editingClassId) {
        // Update existing class in the list
        setClasses(prev => prev.map(c => c.id === editingClassId ? data : c));
        setClassFormSuccess('Class updated successfully!');
      } else {
        // Add new class to the list
        setClasses(prev => [data, ...prev]);
        setClassFormSuccess('Class created successfully!');
      }

      // Clear form
      setClassForm({
        name: '',
        description: '',
        level: '',
        enrollmentFeeId: '',
        tuitionFeeId: '',
        teacherId: '',
      });
      setEditingClassId(null);
    } catch (err) {
      setClassFormError(err.message);
    } finally {
      setCreatingClass(false);
    }
  }




  // Calculate statistics
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalFees = fees.length;
  const pendingInvoicesCount = invoices.filter(inv => inv.status === 'PENDING').length;
  const pendingEnrollmentsCount = enrollments.filter(e => e.status === 'PENDING').length;
  const totalRevenue = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const pendingRevenue = invoices
    .filter(inv => inv.status === 'PENDING')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar 
        userRole="admin"
        userName={me?.name}
        userEmail={me?.email}
        currentTab={tab}
        onTabChange={setTab}
        tabs={adminTabs}
      />
      <div className="dashboard-content">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="title" style={{ marginBottom: '0.5rem' }}>🎓 Admin Dashboard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
            Manage school fees, invoices, and enrollments
          </p>
        </div>

        {/* Statistics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div 
            className="card" 
            onClick={() => setTab('classes')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><GraduationCap size={32} color="var(--primary-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalStudents}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Students</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('classes')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><BookOpen size={32} color="var(--success-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{totalClasses}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classes</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('fees')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><DollarSign size={32} color="var(--info-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--info-color)' }}>{totalFees}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fee Types</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('invoices')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><Receipt size={32} color="var(--warning-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{pendingInvoicesCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pending</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('enrollments')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><CheckSquare size={32} color="var(--danger-color)" /></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>{pendingEnrollmentsCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To Review</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('invoices')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><DollarSign size={32} color="var(--success-color)" /></div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>XOF Paid</div>
          </div>
          <div 
            className="card" 
            onClick={() => setTab('invoices')}
            style={{ 
              padding: '1rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><DollarSign size={32} color="var(--warning-color)" /></div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{pendingRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>XOF Due</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-container">
          <button
            onClick={() => setTab('dashboard')}
            className={`tab-button ${tab === 'dashboard' ? 'active' : ''}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setTab('classes')}
            className={`tab-button ${tab === 'classes' ? 'active' : ''}`}
          >
            📚 Classes
          </button>
          <button
            onClick={() => setTab('fees')}
            className={`tab-button ${tab === 'fees' ? 'active' : ''}`}
          >
            💵 Fees
          </button>
          <button
            onClick={() => setTab('invoices')}
            className={`tab-button ${tab === 'invoices' ? 'active' : ''}`}
          >
            📋 Invoices
          </button>
          <button
            onClick={() => setTab('enrollments')}
            className={`tab-button ${tab === 'enrollments' ? 'active' : ''}`}
          >
            ✅ Enrollments
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`tab-button ${tab === 'messages' ? 'active' : ''}`}
          >
            💬 Messages
          </button>
        </div>

      {/* SCHOOL TAB */}
      {tab === 'school' && <SchoolInfo />}

      {/* TEACHERS TAB */}
      {tab === 'teachers' && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3>👨‍🏫 Add New Teacher</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Create teacher accounts for your school staff
            </p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const teacherData = {
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
              };

              try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/admin/teachers`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(teacherData),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to create teacher');

                alert('Teacher account created successfully!');
                e.target.reset();
                fetchTeachers();
              } catch (err) {
                alert('Error: ' + err.message);
              }
            }}>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Full Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                name="name"
                placeholder="e.g., John Smith"
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Email Address <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="teacher@school.com"
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Initial Password <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                minLength={6}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <div style={{
                padding: '0.75rem',
                backgroundColor: '#eff6ff',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#1e40af'
              }}>
                ℹ️ <strong>Note:</strong> Teachers can be assigned to classes in the Classes tab after creation.
              </div>

              <button className="btn" type="submit" style={{ width: '100%', padding: '0.75rem' }}>
                ✨ Create Teacher Account
              </button>
            </form>
          </div>

          <div className="card">
            <h3>👥 All Teachers ({teachers.length})</h3>
            {loadingTeachers ? (
              <p>Loading teachers...</p>
            ) : teachers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No teachers yet</p>
                <p style={{ fontSize: '0.9rem' }}>Create your first teacher account above</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {teachers.map(teacher => (
                  <li
                    key={teacher.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                      backgroundColor: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>👨‍🏫</span>
                          <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                              {teacher.name}
                            </h4>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              ✉️ {teacher.email}
                            </div>
                          </div>
                        </div>

                        {teacher._count && (
                          <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.5rem' }}>
                            📚 Teaching {teacher._count.classes || 0} class{teacher._count.classes !== 1 ? 'es' : ''}
                          </div>
                        )}

                        {teacher.classes && teacher.classes.length > 0 && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                              <strong>Assigned Classes:</strong>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {teacher.classes.map(cls => (
                                <span
                                  key={cls.id}
                                  style={{
                                    padding: '0.25rem 0.6rem',
                                    backgroundColor: '#dbeafe',
                                    border: '1px solid #60a5fa',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: '#1e40af',
                                  }}
                                >
                                  📖 {cls.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{
                        marginLeft: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        minWidth: '80px',
                        border: '1px solid #e5e7eb',
                      }}>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: 'bold', 
                          color: teacher.isActive ? 'var(--success-color)' : 'var(--danger-color)' 
                        }}>
                          {teacher.isActive ? '✅' : '❌'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          {teacher.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      <button
                        className="btn"
                        onClick={() => setTab('classes')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#10b981' }}
                      >
                        📚 Assign to Class
                      </button>
                      <button
                        className="btn"
                        onClick={async () => {
                          if (!window.confirm(`Reset password for ${teacher.name}?`)) return;
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${API_URL}/api/admin/teachers/${teacher.id}/reset-password`, {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            alert(`Password reset successful!\nNew temporary password: ${data.newPassword}`);
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#f59e0b' }}
                      >
                        🔑 Reset Password
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3>📊 Quick Overview</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Welcome to your admin dashboard. Here's a summary of your school management system.
              </p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pendingEnrollmentsCount > 0 && (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#fef3c7', 
                    borderRadius: '0.5rem',
                    border: '1px solid #fbbf24'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚠️</span>
                      <strong style={{ color: '#92400e' }}>
                        {pendingEnrollmentsCount} Enrollment{pendingEnrollmentsCount !== 1 ? 's' : ''} Pending Approval
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e' }}>
                      Review and approve student enrollment requests in the Enrollments tab.
                    </p>
                    <button 
                      className="btn" 
                      onClick={() => setTab('enrollments')}
                      style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      Review Now →
                    </button>
                  </div>
                )}

                {pendingInvoicesCount > 0 && (
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#dbeafe', 
                    borderRadius: '0.5rem',
                    border: '1px solid #60a5fa'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💳</span>
                      <strong style={{ color: '#1e40af' }}>
                        {pendingInvoicesCount} Pending Invoice{pendingInvoicesCount !== 1 ? 's' : ''}
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e40af' }}>
                      Total outstanding: {pendingRevenue.toLocaleString()} XOF
                    </p>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setTab('invoices')}
                      style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                      View Invoices →
                    </button>
                  </div>
                )}

                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#d1fae5', 
                  borderRadius: '0.5rem',
                  border: '1px solid #34d399'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✅</span>
                    <strong style={{ color: '#065f46' }}>
                      Revenue Collected: {totalRevenue.toLocaleString()} XOF
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#065f46' }}>
                    Great job! Keep monitoring payments and enrollments.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3>📝 Recent Invoices</h3>
              {invoices.slice(0, 5).length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No recent invoices.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {invoices.slice(0, 5).map(inv => (
                    <li
                      key={inv.id}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                            {inv.student?.firstName} {inv.student?.lastName}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                            {inv.fee?.name} • {inv.amount.toLocaleString()} {inv.fee?.currency || 'XOF'}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: inv.status === 'PAID' ? '#d1fae5' : '#fef3c7',
                            color: inv.status === 'PAID' ? '#065f46' : '#92400e',
                          }}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

      {/* CLASSES TAB */}
      {tab === 'classes' && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3>📚 Create a Class</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Create classes and assign enrollment and tuition fees
            </p>
            
            <form onSubmit={handleCreateClass}>
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Class Name *
              </label>
              <input
                placeholder="e.g., Mathematics Grade 10"
                value={classForm.name}
                onChange={e => setClassForm(f => ({ ...f, name: e.target.value }))}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Description
              </label>
              <textarea
                placeholder="Class description..."
                value={classForm.description}
                onChange={e => setClassForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem', resize: 'vertical' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Level / Grade
              </label>
              <input
                placeholder="e.g., Grade 10, Beginner, Advanced"
                value={classForm.level}
                onChange={e => setClassForm(f => ({ ...f, level: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Enrollment Fee
              </label>
              <select
                value={classForm.enrollmentFeeId}
                onChange={e => setClassForm(f => ({ ...f, enrollmentFeeId: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              >
                <option value="">No enrollment fee</option>
                {fees.map(fee => (
                  <option key={fee.id} value={fee.id}>
                    {fee.name} - {fee.amount.toLocaleString()} {fee.currency}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Tuition Fee
              </label>
              <select
                value={classForm.tuitionFeeId}
                onChange={e => setClassForm(f => ({ ...f, tuitionFeeId: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              >
                <option value="">No tuition fee</option>
                {fees.map(fee => (
                  <option key={fee.id} value={fee.id}>
                    {fee.name} - {fee.amount.toLocaleString()} {fee.currency}
                  </option>
                ))}
              </select>

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Assign Teacher
              </label>
              <select
                value={classForm.teacherId}
                onChange={e => setClassForm(f => ({ ...f, teacherId: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              >
                <option value="">No teacher assigned</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>

              {classFormError && (
                <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>
                  ⚠️ {classFormError}
                </div>
              )}
              {classFormSuccess && (
                <div className="alert alert-success" style={{ marginBottom: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  ✅ {classFormSuccess}
                </div>
              )}

              <button className="btn" type="submit" disabled={creatingClass}>
                {creatingClass ? '⏳ Creating...' : '✨ Create Class'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3>📋 All Classes ({classes.length})</h3>
            {loadingClasses ? (
              <p>Loading classes...</p>
            ) : classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No classes yet</p>
                <p style={{ fontSize: '0.9rem' }}>Create your first class above</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {classes.map(cls => (
                  <li
                    key={cls.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                      backgroundColor: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                            📖 {cls.name}
                          </strong>
                          {cls.level && (
                            <span style={{
                              marginLeft: '0.5rem',
                              padding: '0.2rem 0.6rem',
                              fontSize: '0.75rem',
                              backgroundColor: '#eff6ff',
                              color: '#1e40af',
                              borderRadius: '0.25rem',
                              fontWeight: '600',
                            }}>
                              {cls.level}
                            </span>
                          )}
                        </div>

                        {cls.description && (
                          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.5rem 0' }}>
                            {cls.description}
                          </p>
                        )}

                        {/* Teacher Info */}
                        {cls.teacher && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.85rem',
                            color: '#4b5563',
                            marginTop: '0.5rem',
                          }}>
                            <span style={{ marginRight: '0.5rem' }}>👨‍🏫</span>
                            <strong>Teacher:</strong>&nbsp;{cls.teacher.name}
                          </div>
                        )}

                        {/* Fees Info */}
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {cls.enrollmentFee && (
                            <div style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#dbeafe',
                              borderRadius: '0.375rem',
                              fontSize: '0.8rem',
                            }}>
                              <strong>Enrollment:</strong> {cls.enrollmentFee.amount.toLocaleString()} {cls.enrollmentFee.currency}
                            </div>
                          )}
                          {cls.tuitionFee && (
                            <div style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#d1fae5',
                              borderRadius: '0.375rem',
                              fontSize: '0.8rem',
                            }}>
                              <strong>Tuition:</strong> {cls.tuitionFee.amount.toLocaleString()} {cls.tuitionFee.currency}
                            </div>
                          )}
                          {!cls.enrollmentFee && !cls.tuitionFee && (
                            <div style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#fef3c7',
                              borderRadius: '0.375rem',
                              fontSize: '0.8rem',
                              color: '#92400e',
                            }}>
                              No fees assigned
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Student Count */}
                      <div style={{
                        marginLeft: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        minWidth: '80px',
                        border: '1px solid #e5e7eb',
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                          {cls._count?.enrollments || 0}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Students</div>
                      </div>
                    </div>

                    {/* Enrollments Preview */}
                    {cls.enrollments && cls.enrollments.length > 0 && (
                      <div style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #e5e7eb',
                      }}>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          <strong>Recent Enrollments:</strong>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {cls.enrollments.slice(0, 5).map(enrollment => (
                            <span
                              key={enrollment.id}
                              style={{
                                padding: '0.25rem 0.6rem',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                              }}
                            >
                              👨‍🎓 {enrollment.student?.firstName} {enrollment.student?.lastName}
                            </span>
                          ))}
                          {cls.enrollments.length > 5 && (
                            <span style={{
                              padding: '0.25rem 0.6rem',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                            }}>
                              +{cls.enrollments.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      <button
                        className="btn"
                        onClick={() => {
                          setClassForm({
                            name: cls.name,
                            description: cls.description || '',
                            level: cls.level || '',
                            enrollmentFeeId: cls.enrollmentFeeId?.toString() || '',
                            tuitionFeeId: cls.tuitionFeeId?.toString() || '',
                            teacherId: cls.teacherId?.toString() || '',
                          });
                          setEditingClassId(cls.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#3b82f6' }}
                      >
                        ✏️ Edit Class
                      </button>
                      <button
                        className="btn"
                        onClick={async () => {
                          if (!window.confirm(`Delete class "${cls.name}"? This cannot be undone.`)) return;
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${API_URL}/api/classes/${cls.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            setClasses(prev => prev.filter(c => c.id !== cls.id));
                            alert('Class deleted successfully!');
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          backgroundColor: '#ef4444',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* FEES TAB */}
      {tab === 'fees' && (
        <>
          {!checkingSchool && !hasSchool && (
            <div className="card" style={{ 
              marginBottom: '1rem',
              backgroundColor: '#fef3c7',
              border: '2px solid #fbbf24',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>School Setup Required</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#92400e' }}>
                    Before you can create fees, you need to set up your school information first.
                    This ensures all fees are properly associated with your school.
                  </p>
                  <button 
                    className="btn" 
                    onClick={() => setTab('school')}
                    style={{ 
                      backgroundColor: '#f59e0b',
                      padding: '0.75rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    🏫 Go to School Setup
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasSchool && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3>Create a fee</h3>
              <form onSubmit={handleCreateFee}>
              {/* School Name - Read Only */}
              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: '#374151' }}>
                School
              </label>
              <input
                type="text"
                value={schoolName}
                readOnly
                disabled
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  marginBottom: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'not-allowed',
                  border: '1px solid #e5e7eb',
                }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Fee Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                placeholder="e.g., Tuition Term 1, Enrollment Fee"
                value={feeName}
                onChange={e => setFeeName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Description (Optional)
              </label>
              <input
                placeholder="Brief description of the fee"
                value={feeDescription}
                onChange={e => setFeeDescription(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Amount <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                value={feeAmount}
                onChange={e => setFeeAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', fontWeight: '600' }}>
                Currency
              </label>
              <input
                placeholder="e.g., XOF, USD, EUR"
                value={feeCurrency}
                onChange={e => setFeeCurrency(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
              />

              {feeError && (
                <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>
                  ⚠️ {feeError}
                </div>
              )}

                <button className="btn" type="submit" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                  💰 Create Fee
                </button>
              </form>
            </div>
          )}

          <div className="card">
            <h3>Existing fees</h3>
            {loadingFees ? (
              <p>Loading...</p>
            ) : fees.length === 0 ? (
              <p>No fees yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {fees.map(fee => (
                  <li
                    key={fee.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '0.75rem',
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                        {fee.name} – {fee.amount.toLocaleString()} {fee.currency}
                      </div>
                      {fee.description && (
                        <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.25rem' }}>
                          {fee.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        className="btn"
                        onClick={() => {
                          setFeeName(fee.name);
                          setFeeDescription(fee.description || '');
                          setFeeAmount(fee.amount.toString());
                          setFeeCurrency(fee.currency);
                          setEditingFeeId(fee.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#3b82f6',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn"
                        onClick={async () => {
                          if (!window.confirm(`Delete fee "${fee.name}"? This cannot be undone.`)) return;
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${API_URL}/api/fees/${fee.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            setFees(prev => prev.filter(f => f.id !== fee.id));
                            alert('Fee deleted successfully!');
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.85rem',
                          backgroundColor: '#ef4444',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* INVOICES TAB */}
      {tab === 'invoices' && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3>Create an invoice</h3>
            <form onSubmit={handleCreateInvoice}>
              <label style={{ fontSize: '0.85rem' }}>Student</label>
              <select
                value={invoiceStudentId}
                onChange={e => setInvoiceStudentId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <option value="">Select a student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} (Parent: {s.parent?.name})
                  </option>
                ))}
              </select>

              <label style={{ fontSize: '0.85rem' }}>Fee</label>
              <select
                value={invoiceFeeId}
                onChange={e => setInvoiceFeeId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <option value="">Select a fee</option>
                {fees.map(fee => (
                  <option key={fee.id} value={fee.id}>
                    {fee.name} ({fee.amount.toLocaleString()} {fee.currency})
                  </option>
                ))}
              </select>

              <label style={{ fontSize: '0.85rem' }}>Due date (optional)</label>
              <input
                type="date"
                value={invoiceDueDate}
                onChange={e => setInvoiceDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              />

              {invoiceError && (
                <p style={{ color: 'red', marginBottom: '0.5rem' }}>{invoiceError}</p>
              )}

              <button className="btn" type="submit">
                Create invoice
              </button>
            </form>
          </div>

          <div className="card">
            <h3>All invoices</h3>
            {loadingInvoices ? (
              <p>Loading...</p>
            ) : invoices.length === 0 ? (
              <p>No invoices yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {invoices.map(inv => (
                  <li
                    key={inv.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '0.75rem',
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                          💰 {inv.fee?.name || 'Fee'} – {inv.amount?.toLocaleString() || '0'} {inv.fee?.currency || 'XOF'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                          👨‍🎓 <strong>Student:</strong> {inv.student?.firstName || 'N/A'} {inv.student?.lastName || ''}
                          {inv.student?.enrollments && inv.student.enrollments.length > 0 && (
                            <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                              • 📚 {inv.student.enrollments[0]?.class?.name || 'No class'}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                          👨‍👩‍👧 <strong>Parent:</strong> {inv.student?.parent?.name || 'N/A'}
                          {inv.student?.parent?.email && (
                            <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                              ({inv.student.parent.email})
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: inv.status === 'PAID' ? '#d1fae5' : inv.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                          color: inv.status === 'PAID' ? '#065f46' : inv.status === 'PENDING' ? '#92400e' : '#991b1b',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                      {inv.dueDate && `📅 Due: ${new Date(inv.dueDate).toLocaleDateString()}`}
                      {inv.paidAt && ` • ✅ Paid: ${new Date(inv.paidAt).toLocaleDateString()}`}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn"
                        onClick={async () => {
                          const newStatus = prompt('Update invoice status (PENDING, PAID, OVERDUE):', inv.status);
                          if (!newStatus || newStatus === inv.status) return;
                          
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${API_URL}/api/admin/invoices/${inv.id}/status`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ status: newStatus.toUpperCase() }),
                            });
                            
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            
                            setInvoices(prev => prev.map(i => i.id === inv.id ? data : i));
                            alert('Invoice status updated!');
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#3b82f6' }}
                      >
                        ✏️ Update Status
                      </button>
                      <button
                        className="btn"
                        onClick={async () => {
                          const newDueDate = prompt('Update due date (YYYY-MM-DD):', inv.dueDate ? inv.dueDate.split('T')[0] : '');
                          if (!newDueDate) return;
                          
                          try {
                            const token = localStorage.getItem('token');
                            const res = await fetch(`${API_URL}/api/admin/invoices/${inv.id}/due-date`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ dueDate: newDueDate }),
                            });
                            
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message);
                            
                            setInvoices(prev => prev.map(i => i.id === inv.id ? data : i));
                            alert('Invoice due date updated!');
                          } catch (err) {
                            alert('Error: ' + err.message);
                          }
                        }}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#10b981' }}
                      >
                        📅 Update Due Date
                      </button>
                      {inv.status === 'PENDING' && (
                        <button
                          className="btn"
                          onClick={async () => {
                            if (!window.confirm('Mark this invoice as PAID?')) return;
                            
                            try {
                              const token = localStorage.getItem('token');
                              const res = await fetch(`${API_URL}/api/invoices/${inv.id}/pay`, {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.message);
                              
                              setInvoices(prev => prev.map(i => i.id === inv.id ? data.invoice : i));
                              alert('Invoice marked as paid!');
                            } catch (err) {
                              alert('Error: ' + err.message);
                            }
                          }}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#10b981' }}
                        >
                          💳 Mark as Paid
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ENROLLMENTS TAB */}
      {tab === 'enrollments' && (
        <>
          {/* New Student Enrollment Form Modal */}
          {showEnrollmentForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
              overflow: 'auto',
            }}>
              <div style={{
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}>
                <StudentEnrollmentForm
                  onSubmit={async (student) => {
                    // Refresh students list
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${API_URL}/api/admin/students`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setStudents(data);
                    }
                    setShowEnrollmentForm(false);
                    alert('Student created successfully! You can now enroll them in classes.');
                  }}
                  onCancel={() => setShowEnrollmentForm(false)}
                  API_URL={API_URL}
                  token={localStorage.getItem('token')}
                  classes={classes}
                />
              </div>
            </div>
          )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Enrollments</h3>
            <button
              className="btn"
              onClick={() => setShowEnrollmentForm(true)}
              style={{
                padding: '0.6rem 1.2rem',
                fontSize: '0.95rem',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              ✨ Create New Student & Enroll
            </button>
          </div>

          {/* --- Direct enrollment form --- */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Enroll existing student in a class</h4>
            <form onSubmit={handleAdminEnroll}>
              <label style={{ fontSize: '0.85rem' }}>Student</label>
              <select
                value={enrollStudentId}
                onChange={e => setEnrollStudentId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <option value="">Select a student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} (Parent: {s.parent?.name})
                  </option>
                ))}
              </select>

              <label style={{ fontSize: '0.85rem' }}>Class</label>
              <select
                value={enrollClassId}
                onChange={e => setEnrollClassId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <option value="">Select a class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {cls.level ? `(${cls.level})` : ''}
                  </option>
                ))}
              </select>

              {classError && (
                <p style={{ color: 'red', marginBottom: '0.25rem' }}>{classError}</p>
              )}
              {enrollError && (
                <p style={{ color: 'red', marginBottom: '0.25rem' }}>{enrollError}</p>
              )}
              {enrollSuccess && (
                <p style={{ color: 'green', marginBottom: '0.25rem' }}>{enrollSuccess}</p>
              )}

              <button className="btn" type="submit" disabled={creatingEnrollment}>
                {creatingEnrollment ? 'Enrolling...' : 'Enroll student'}
              </button>
            </form>
          </div>

          {/* --- Pending enrollments list + approval --- */}
          <h4 style={{ marginBottom: '0.5rem' }}>Pending enrollments</h4>
          {enrollmentError && <p style={{ color: 'red' }}>{enrollmentError}</p>}

          {loadingEnrollments ? (
            <p>Loading...</p>
          ) : enrollments.length === 0 ? (
            <p>No pending enrollments.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {enrollments.map(en => (
                <li
                  key={en.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                  }}
                >
                  <strong>
                    {en.student.firstName} {en.student.lastName}
                  </strong>{' '}
                  (Parent: {en.student.parent.name})
                  <br />
                  Class: <strong>{en.class.name}</strong>
                  <br />
                  Requested: {new Date(en.createdAt).toLocaleString()}

                  <div style={{ marginTop: '0.75rem' }}>
                    <button
                      className="btn"
                      onClick={() => approveEnrollment(en.id)}
                    >
                      Approve Enrollment
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        </>
      )}

      {/* MESSAGES TAB */}
      {tab === 'messages' && <AdminMessages />}

      {/* PROFILE TAB */}
      {tab === 'profile' && <ProfileSettings />}
      </div>
    </div>
  );
}

/* ======================= ADMIN MESSAGES ======================= */

function AdminMessages() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [contactFilter, setContactFilter] = useState('all'); // 'all' | 'parent' | 'teacher'

  useEffect(() => {
    async function fetchContacts() {
      try {
        setMsgError('');
        setLoadingContacts(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load contacts');
        setContacts(data);
      } catch (err) {
        setMsgError(err.message);
      } finally {
        setLoadingContacts(false);
      }
    }
    fetchContacts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const s = io(API_URL, {
      auth: { token },
    });

    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected (admin):', s.id);
    });

    s.on('chat:new-message', msg => {
      if (
        selectedContact &&
        (msg.senderId === selectedContact.id || msg.receiverId === selectedContact.id)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected (admin)');
    });

    return () => {
      s.disconnect();
    };
  }, [selectedContact]);

  async function loadConversation(contact) {
    try {
      setSelectedContact(contact);
      setMsgError('');
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/chat/conversation/${contact.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load messages');
      setMessages(data);
    } catch (err) {
      setMsgError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!selectedContact || !newMessage.trim()) return;

    try {
      setMsgError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');

      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (err) {
      setMsgError(err.message);
    }
  }

  const filteredContacts = contactFilter === 'all' 
    ? contacts 
    : contacts.filter(c => c.role === contactFilter);

  return (
    <div className="card">
      <h3>Messages</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Chat with your school teachers and parents of enrolled students
      </p>
      {msgError && <p style={{ color: 'red' }}>{msgError}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        {/* Contacts list */}
        <div
          style={{
            width: '35%',
            maxHeight: '300px',
            overflowY: 'auto',
            borderRight: '1px solid #e5e7eb',
            paddingRight: '0.5rem',
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <select
              value={contactFilter}
              onChange={e => setContactFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.85rem',
              }}
            >
              <option value="all">All Contacts</option>
              <option value="parent">Parents Only</option>
              <option value="teacher">School Teachers</option>
            </select>
          </div>

          {loadingContacts ? (
            <p style={{ fontSize: '0.85rem' }}>Loading...</p>
          ) : filteredContacts.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6b7280', padding: '1rem', textAlign: 'center' }}>
              {contactFilter === 'teacher' 
                ? 'No teachers at your school yet.' 
                : contactFilter === 'parent'
                ? 'No parents with enrolled students yet.'
                : 'No contacts available yet.'}
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {filteredContacts.map(c => (
                <li key={c.id} style={{ marginBottom: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => loadConversation(c)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.4rem',
                      borderRadius: '0.5rem',
                      border:
                        selectedContact && selectedContact.id === c.id
                          ? '2px solid #2563eb'
                          : '1px solid #e5e7eb',
                      background:
                        selectedContact && selectedContact.id === c.id
                          ? '#eff6ff'
                          : '#ffffff',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {c.name}{' '}
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.1rem 0.3rem', 
                        borderRadius: '0.25rem',
                        background: c.role === 'parent' ? '#dbeafe' : '#fef3c7',
                        color: c.role === 'parent' ? '#1e40af' : '#92400e'
                      }}>
                        {c.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {c.email}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Conversation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedContact ? (
            <>
              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '0.25rem',
                  marginBottom: '0.25rem',
                }}
              >
                <strong>{selectedContact.name}</strong>
                <span style={{ 
                  fontSize: '0.75rem', 
                  marginLeft: '0.5rem',
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '0.25rem',
                  background: selectedContact.role === 'parent' ? '#dbeafe' : '#fef3c7',
                  color: selectedContact.role === 'parent' ? '#1e40af' : '#92400e'
                }}>
                  {selectedContact.role}
                </span>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  {selectedContact.email}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  marginBottom: '0.5rem',
                  paddingRight: '0.25rem',
                }}
              >
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p style={{ fontSize: '0.85rem' }}>No messages yet. Start the conversation 👋</p>
                ) : (
                  messages.map(m => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent:
                          m.senderId === getCurrentUserId()
                            ? 'flex-end'
                            : 'flex-start',
                        marginBottom: '0.3rem',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '0.75rem',
                          background:
                            m.senderId === getCurrentUserId()
                              ? '#2563eb'
                              : '#e5e7eb',
                          color:
                            m.senderId === getCurrentUserId()
                              ? '#ffffff'
                              : '#111827',
                          fontSize: '0.85rem',
                        }}
                      >
                        {m.content}
                        <div
                          style={{
                            fontSize: '0.7rem',
                            marginTop: '0.15rem',
                            opacity: 0.8,
                          }}
                        >
                          {new Date(m.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                style={{ display: 'flex', gap: '0.25rem' }}
              >
                <input
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem' }}
                />
                <button
                  type="submit"
                  className="btn"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <p style={{ fontSize: '0.85rem' }}>
              Select a contact to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================= SCHOOL SEARCH ======================= */

function SchoolSearch({ students }) {
  const [schools, setSchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Load all schools on mount
  useEffect(() => {
    async function fetchSchools() {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${API_URL}/api/schools`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load schools');

        setSchools(data);
        setAllSchools(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      // If search is empty, show all schools
      setSchools(allSchools);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSelectedSchool(null);
      const token = localStorage.getItem('token');
      
      const res = await fetch(
        `${API_URL}/api/schools?search=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to search schools');

      setSchools(data);
      if (data.length === 0) {
        setError('No schools found matching your search');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function viewSchoolClasses(school) {
    setSelectedSchool(school);
    
    try {
      setLoadingClasses(true);
      setError('');
      const token = localStorage.getItem('token');
      
      // Fetch classes for this school
      const res = await fetch(
        `${API_URL}/api/classes?schoolId=${school.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load classes');

      setSchoolClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingClasses(false);
    }
  }

  return (
    <div className="card">
      <h3>🏫 Browse Schools</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondry)', marginBottom: '1rem' }}>
        Find schools and enroll your children in their classes
      </p>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search by school name, location, or country..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.6rem',
              fontSize: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
          />
          <button 
            className="btn" 
            type="submit" 
            disabled={loading}
            style={{ padding: '0.6rem 1.5rem' }}
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
          {searchQuery && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                setSearchQuery('');
                setSchools(allSchools);
              }}
              style={{ padding: '0.6rem 1rem', backgroundColor: '#6b7280' }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading && !selectedSchool ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <p>Loading schools...</p>
        </div>
      ) : null}

      {/* Schools List */}
      {!selectedSchool && !loading && schools.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>
            {searchQuery ? `Found ${schools.length}` : `All Schools (${schools.length})`}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {schools.map(school => (
              <li
                key={school.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                      🏫 {school.name}
                    </h5>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      {school.address && (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                          <span style={{ marginRight: '0.25rem' }}>📍</span>
                          {school.address}
                          {school.city && `, ${school.city}`}
                        </div>
                      )}
                      {school.country && (
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
                          <span style={{ marginRight: '0.25rem' }}>🌍</span>
                          {school.country}
                        </div>
                      )}
                    </div>

                    {school.description && (
                      <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#4b5563' }}>
                        {school.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      {school._count && (
                        <>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '0.25rem',
                          }}>
                            📚 {school._count.classes} class{school._count.classes !== 1 ? 'es' : ''}
                          </span>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                            borderRadius: '0.25rem',
                          }}>
                            👨‍🎓 {school._count.students} student{school._count.students !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>

                    {(school.phone || school.email || school.website) && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>
                        {school.phone && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            📞 {school.phone}
                          </div>
                        )}
                        {school.email && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            ✉️ {school.email}
                          </div>
                        )}
                        {school.website && (
                          <div>
                            🌐 <a href={school.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                              {school.website}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn"
                    onClick={() => viewSchoolClasses(school)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      fontSize: '0.9rem',
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    View Classes →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!selectedSchool && !loading && schools.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No schools available yet</p>
          <p style={{ fontSize: '0.9rem' }}>Check back later for available schools</p>
        </div>
      )}

      {/* Selected School Classes */}
      {selectedSchool && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid var(--primary-color)',
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>
                🏫 {selectedSchool.name}
              </h4>
              {selectedSchool.address && (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                  📍 {selectedSchool.address}
                </p>
              )}
            </div>
            <button
              className="btn"
              onClick={() => {
                setSelectedSchool(null);
                setSchoolClasses([]);
              }}
              style={{ padding: '0.5rem 1rem' }}
            >
              ← Back to Search
            </button>
          </div>

          {loadingClasses ? (
            <p>Loading classes...</p>
          ) : schoolClasses.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No classes available at this school yet.
            </p>
          ) : (
            <div>
              <h5 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
                Available Classes ({schoolClasses.length})
              </h5>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {schoolClasses.map(cls => (
                  <li
                    key={cls.id}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1.05rem' }}>📚 {cls.name}</strong>
                      {cls.level && (
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#eff6ff',
                          color: '#1e40af',
                          borderRadius: '0.25rem',
                          fontWeight: '600',
                        }}>
                          {cls.level}
                        </span>
                      )}
                    </div>
                    
                    {cls.description && (
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.5rem 0' }}>
                        {cls.description}
                      </p>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      margin: '0.75rem 0',
                      fontSize: '0.85rem',
                    }}>
                      {cls.enrollmentFee && (
                        <div>
                          <span style={{ fontWeight: '600' }}>Enrollment Fee:</span>{' '}
                          {cls.enrollmentFee.amount.toLocaleString()} {cls.enrollmentFee.currency}
                        </div>
                      )}
                      {cls.tuitionFee && (
                        <div>
                          <span style={{ fontWeight: '600' }}>Tuition Fee:</span>{' '}
                          {cls.tuitionFee.amount.toLocaleString()} {cls.tuitionFee.currency}
                        </div>
                      )}
                    </div>

                    {students.length > 0 ? (
                      <div style={{ marginTop: '0.75rem' }}>
                        <EnrollForm cls={cls} students={students} />
                      </div>
                    ) : (
                      <p style={{ 
                        fontSize: '0.85rem', 
                        color: '#d97706', 
                        fontStyle: 'italic',
                        marginTop: '0.75rem',
                      }}>
                        Please add a child in the Children tab before enrolling in classes.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ======================= PROFILE SETTINGS ======================= */

function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load profile');
        
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setProfile(data.user);
      setUpdateSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setPasswordLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/profile/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password change failed');
      
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) return <div className="card"><p>Loading profile...</p></div>;
  if (error) return <div className="card"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!profile) return null;

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3>👤 Profile Information</h3>
        
        {!editing ? (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{profile.name}</div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{profile.email}</div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Role</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', textTransform: 'capitalize' }}>{profile.role}</div>
            </div>
            
            {profile.school && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>School</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{profile.school.name}</div>
              </div>
            )}
            
            <button className="btn" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
            />
            
            <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
            />
            
            {updateError && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{updateError}</p>}
            {updateSuccess && <p style={{ color: 'green', marginBottom: '0.5rem' }}>{updateSuccess}</p>}
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" type="submit" disabled={updating}>
                {updating ? 'Updating...' : '💾 Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setEditing(false);
                  setName(profile.name);
                  setEmail(profile.email);
                  setUpdateError('');
                }}
                style={{ backgroundColor: '#6b7280' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="card">
        <h3>🔒 Change Password</h3>
        
        {!changingPassword ? (
          <button className="btn" onClick={() => setChangingPassword(true)}>
            🔑 Change Password
          </button>
        ) : (
          <form onSubmit={handleChangePassword}>
            <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
            />
            
            <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
            />
            
            <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block' }}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }}
            />
            
            {passwordError && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{passwordError}</p>}
            {passwordSuccess && <p style={{ color: 'green', marginBottom: '0.5rem' }}>{passwordSuccess}</p>}
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : '🔒 Change Password'}
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => {
                  setChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                style={{ backgroundColor: '#6b7280' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ======================= ENROLL FORM ======================= */

function EnrollForm({ cls, students }) {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const selectedStudent = students.find(s => s.id === Number(studentId));
  const totalFees = (cls.enrollmentFee?.amount || 0) + (cls.tuitionFee?.amount || 0);

  async function handleEnroll(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: Number(studentId),
          classId: cls.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enrollment failed');

      setSuccess('Enrollment request submitted successfully! Invoices will be created upon admin approval.');
      setStudentId('');
      setShowDetails(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
    }}>
      <h4 style={{ 
        margin: '0 0 1rem 0', 
        fontSize: '1.2rem',
        color: 'var(--primary-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        📝 Enrollment Form
      </h4>

      {/* School Information */}
      {cls.school && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            School
          </div>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            🏫 {cls.school.name}
          </div>
          {cls.school.address && (
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
              📍 {cls.school.address}
              {cls.school.city && `, ${cls.school.city}`}
              {cls.school.country && `, ${cls.school.country}`}
            </div>
          )}
        </div>
      )}

      {/* Class Information */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
          Class
        </div>
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          📚 {cls.name}
          {cls.level && (
            <span style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.75rem',
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              borderRadius: '0.25rem',
              fontWeight: '600',
            }}>
              {cls.level}
            </span>
          )}
        </div>
        {cls.description && (
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.5rem 0' }}>
            {cls.description}
          </p>
        )}
        {cls.teacher && (
          <div style={{ 
            fontSize: '0.85rem', 
            color: '#4b5563',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span>👨‍🏫</span>
            <span><strong>Teacher:</strong> {cls.teacher.name}</span>
          </div>
        )}
      </div>

      {/* Fee Information */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{ 
          fontSize: '0.95rem', 
          fontWeight: 'bold',
          color: '#92400e',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          💰 Fee Summary
        </div>
        
        {cls.enrollmentFee && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            color: '#78350f',
            marginBottom: '0.5rem',
          }}>
            <span>Enrollment Fee:</span>
            <strong>{cls.enrollmentFee.amount.toLocaleString()} {cls.enrollmentFee.currency}</strong>
          </div>
        )}
        
        {cls.tuitionFee && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            color: '#78350f',
            marginBottom: '0.5rem',
          }}>
            <span>Tuition Fee:</span>
            <strong>{cls.tuitionFee.amount.toLocaleString()} {cls.tuitionFee.currency}</strong>
          </div>
        )}
        
        {totalFees > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#92400e',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '2px solid #fbbf24',
          }}>
            <span>Total Amount:</span>
            <span>{totalFees.toLocaleString()} {cls.enrollmentFee?.currency || cls.tuitionFee?.currency || 'XOF'}</span>
          </div>
        )}

        {!cls.enrollmentFee && !cls.tuitionFee && (
          <div style={{ fontSize: '0.9rem', color: '#78350f', textAlign: 'center' }}>
            No fees assigned to this class
          </div>
        )}
      </div>

      {/* Student Selection Form */}
      <form onSubmit={handleEnroll}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            fontSize: '0.95rem', 
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.5rem',
            color: '#374151',
          }}>
            Select Student to Enroll <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={studentId}
            onChange={e => {
              setStudentId(e.target.value);
              setShowDetails(true);
              setError('');
              setSuccess('');
            }}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">-- Select a child --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} {s.dateOfBirth && `(Born: ${new Date(s.dateOfBirth).toLocaleDateString()})`}
              </option>
            ))}
          </select>
        </div>

        {/* Student Details Preview */}
        {selectedStudent && showDetails && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #60a5fa',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: '600' }}>
              Selected Student
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
              }}>
                👶
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e40af' }}>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </div>
                {selectedStudent.dateOfBirth && (
                  <div style={{ fontSize: '0.85rem', color: '#3b82f6' }}>
                    Date of Birth: {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #60a5fa',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
            <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
              <strong>Important:</strong> After submitting this enrollment request:
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem' }}>
                <li>Your request will be sent to the school admin for approval</li>
                <li>Once approved, invoices will be automatically created for the fees</li>
                <li>You'll be able to view and pay the invoices in the "Fees" tab</li>
                <li>Your child will be enrolled in the class after approval</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#991b1b',
            fontSize: '0.9rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#065f46',
            fontSize: '0.9rem',
          }}>
            ✅ {success}
          </div>
        )}

        <button 
          className="btn" 
          type="submit" 
          disabled={loading || !studentId}
          style={{
            width: '100%',
            padding: '0.875rem',
            fontSize: '1.05rem',
            fontWeight: '600',
            backgroundColor: studentId ? 'var(--primary-color)' : '#9ca3af',
            cursor: studentId ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? '⏳ Submitting Enrollment...' : '📝 Submit Enrollment Request'}
        </button>
      </form>
    </div>
  );
}

export default App;
