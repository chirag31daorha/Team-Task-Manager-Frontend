import { useState, useEffect } from 'react'
import { getDashboard } from '../services/api'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data.data))
      .catch(err => console.log(err))
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Dashboard</h2>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Tasks</h3>
            <p style={styles.number}>{data.totalTasks}</p>
          </div>
          <div style={styles.card}>
            <h3>Todo</h3>
            <p style={styles.number}>{data.todo}</p>
          </div>
          <div style={styles.card}>
            <h3>In Progress</h3>
            <p style={styles.number}>{data.inProgress}</p>
          </div>
          <div style={styles.card}>
            <h3>In Review</h3>
            <p style={styles.number}>{data.inReview}</p>
          </div>
          <div style={styles.card}>
            <h3>Done</h3>
            <p style={styles.number}>{data.done}</p>
          </div>
          <div style={{ ...styles.card, background: '#fff1f0' }}>
            <h3>Overdue</h3>
            <p style={{ ...styles.number, color: 'red' }}>{data.overdue}</p>
          </div>
        </div>

        {data.overdueTasks.length > 0 && (
          <div style={styles.section}>
            <h3>Overdue Tasks</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {data.overdueTasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.project.name}</td>
                    <td style={{ color: 'red' }}>{task.dueDate}</td>
                    <td>{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '24px' },
  cards: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
  card: { background: 'white', padding: '20px', borderRadius: '8px', minWidth: '150px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  number: { fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#1890ff' },
  section: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' }
}