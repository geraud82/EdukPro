import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../utils/config';
import './OwnerDashboard.css';

function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Refs for sections
  const analyticsRef = useRef(null);
  const schoolsRef = useRef(null);
  const usersRef = useRef(null);
  
  // Filters
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
    status: '',
    schoolId: ''
  });
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30');

  // Load dashboard stats
  useEffect(() => {
    loadDashboardStats();
    loadSchools();
    loadUsers();
  }, []);

  // Load analytics when period changes
  useEffect(() => {
    loadAnalytics();
  }, [analyticsPeriod]);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      
      if (hash === 'analytics' && analyticsRef.current) {
        analyticsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (hash === 'schools' && schoolsRef.current) {
        schoolsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (hash === 'users' && usersRef.current) {
        usersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Handle initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [analytics, schools, users]);

  async function loadDashboardStats() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/owner/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAnalytics() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/owner/analytics?period=${analyticsPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load analytics');
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }

  async function loadSchools() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/owner/schools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load schools');
      setSchools(data);
    } catch (err) {
      console.error('Schools error:', err);
    }
  }

  async function loadUsers() {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (userFilters.search) params.append('search', userFilters.search);
      if (userFilters.role) params.append('role', userFilters.role);
      if (userFilters.status) params.append('status', userFilters.status);
      if (userFilters.schoolId) params.append('schoolId', userFilters.schoolId);
      
      const res = await fetch(`${API_URL}/api/owner/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load users');
      setUsers(data);
    } catch (err) {
      console.error('Users error:', err);
    }
  }

  if (loading) {
    return (
      <div className="owner-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="owner-dashboard">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">👑 Platform Overview</h1>
          <p className="dashboard-subtitle">
            Monitor and manage your entire EduckPro platform
          </p>
        </div>
        <button className="btn btn-primary" onClick={loadDashboardStats}>
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics Grid */}
      {stats && (
        <div className="metrics-grid">
          <MetricCard
            icon="👥"
            title="Total Users"
            value={stats.overview.totalUsers}
            subtitle={`${stats.overview.activeUsers} active`}
            trend={`+${stats.growth.newUsersThisWeek} this week`}
            color="blue"
          />
          <MetricCard
            icon="🏫"
            title="Schools"
            value={stats.overview.totalSchools}
            subtitle={`${stats.overview.totalClasses} classes`}
            trend={`+${stats.growth.newSchoolsThisWeek} this week`}
            color="green"
          />
          <MetricCard
            icon="👨‍🎓"
            title="Students"
            value={stats.overview.totalStudents}
            subtitle={`${stats.overview.totalEnrollments} enrollments`}
            color="purple"
          />
          <MetricCard
            icon="💰"
            title="Revenue"
            value={`${stats.financial.totalRevenue.toLocaleString()} XOF`}
            subtitle={`${stats.financial.paidInvoices} paid invoices`}
            trend={`${stats.financial.pendingInvoices} pending`}
            color="yellow"
          />
        </div>
      )}

      {/* User Distribution */}
      {stats && (
        <div className="card dashboard-card">
          <h3 className="card-title">
            <span>📊</span> User Distribution
          </h3>
          <div className="distribution-grid">
            <DistributionItem
              icon="👨‍👩‍👧"
              label="Parents"
              count={stats.userDistribution.parent}
              total={stats.overview.totalUsers}
              color="#3b82f6"
            />
            <DistributionItem
              icon="👨‍🏫"
              label="Teachers"
              count={stats.userDistribution.teacher}
              total={stats.overview.totalUsers}
              color="#10b981"
            />
            <DistributionItem
              icon="👔"
              label="Admins"
              count={stats.userDistribution.admin}
              total={stats.overview.totalUsers}
              color="#f59e0b"
            />
            <DistributionItem
              icon="👑"
              label="Owners"
              count={stats.userDistribution.owner}
              total={stats.overview.totalUsers}
              color="#8b5cf6"
            />
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {analytics && (
        <div ref={analyticsRef} id="analytics" className="card dashboard-card">
          <div className="card-header-with-controls">
            <h3 className="card-title">
              <span>📈</span> Platform Analytics
            </h3>
            <select
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value)}
              className="period-selector"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          
          <div className="analytics-summary">
            <div className="analytics-item">
              <div className="analytics-label">User Growth</div>
              <div className="analytics-value">{analytics.userGrowth.length}</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">New Schools</div>
              <div className="analytics-value">{analytics.schoolGrowth.length}</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">New Enrollments</div>
              <div className="analytics-value">{analytics.enrollmentGrowth.length}</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Revenue Growth</div>
              <div className="analytics-value">
                {analytics.revenueGrowth.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()} XOF
              </div>
            </div>
          </div>

          {/* Top Schools */}
          {analytics.topSchools.length > 0 && (
            <div className="top-schools">
              <h4 className="subsection-title">🏆 Top Schools by Students</h4>
              <div className="top-schools-list">
                {analytics.topSchools.slice(0, 5).map((school, index) => (
                  <div key={school.id} className="top-school-item">
                    <div className="school-rank">{index + 1}</div>
                    <div className="school-info">
                      <div className="school-name">{school.name}</div>
                      <div className="school-stats">
                        {school.studentsCount} students · {school.classesCount} classes · {school.usersCount} users
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      {stats && stats.recentActivity.recentUsers.length > 0 && (
        <div className="card dashboard-card">
          <h3 className="card-title">
            <span>🕒</span> Recent Activity
          </h3>
          <div className="activity-list">
            {stats.recentActivity.recentUsers.map(user => (
              <div key={user.id} className="activity-item">
                <div className="activity-icon">
                  {getRoleIcon(user.role)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    New {user.role} registered: <strong>{user.name}</strong>
                  </div>
                  <div className="activity-meta">
                    {user.email} {user.school && `· ${user.school.name}`}
                  </div>
                  <div className="activity-time">
                    {new Date(user.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card dashboard-card">
        <h3 className="card-title">
          <span>⚡</span> Quick Actions
        </h3>
        <div className="quick-actions">
          <button 
            className="action-button" 
            onClick={() => {
              if (analyticsRef.current) {
                window.location.hash = '#analytics';
              }
            }}
          >
            <span className="action-icon">📊</span>
            <span className="action-label">View Analytics</span>
          </button>
          <button 
            className="action-button" 
            onClick={() => {
              // Scroll to top for user management
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="action-icon">👥</span>
            <span className="action-label">Manage Users</span>
          </button>
          <button 
            className="action-button" 
            onClick={() => {
              // Scroll to top for school management
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="action-icon">🏫</span>
            <span className="action-label">Manage Schools</span>
          </button>
          <button className="action-button" onClick={loadDashboardStats}>
            <span className="action-icon">🔄</span>
            <span className="action-label">Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, title, value, subtitle, trend, color = 'blue' }) {
  return (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <div className="metric-title">{title}</div>
        <div className="metric-value">{value}</div>
        {subtitle && <div className="metric-subtitle">{subtitle}</div>}
        {trend && <div className="metric-trend">↗ {trend}</div>}
      </div>
    </div>
  );
}

// Distribution Item Component
function DistributionItem({ icon, label, count, total, color }) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="distribution-item">
      <div className="distribution-header">
        <span className="distribution-icon">{icon}</span>
        <span className="distribution-label">{label}</span>
      </div>
      <div className="distribution-count">{count}</div>
      <div className="distribution-bar">
        <div 
          className="distribution-fill" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="distribution-percentage">{percentage}%</div>
    </div>
  );
}

// Helper function
function getRoleIcon(role) {
  const icons = {
    parent: '👨‍👩‍👧',
    teacher: '👨‍🏫',
    admin: '👔',
    owner: '👑'
  };
  return icons[role] || '👤';
}

export default OwnerDashboard;
