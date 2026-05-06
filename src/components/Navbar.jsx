import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.logo} onClick={() => navigate('/')}>TaskManager</span>
      <div>
        <button style={styles.btn} onClick={() => navigate('/')}>Dashboard</button>
        <button style={styles.btn} onClick={() => navigate('/projects')}>Projects</button>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#001529', color: 'white' },
  logo: { fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: 'white' },
  btn: { marginRight: '12px', padding: '6px 16px', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', cursor: 'pointer' },
  logoutBtn: { padding: '6px 16px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
}