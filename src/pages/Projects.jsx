import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProjects, createProject, getAllUsers, addMember, deleteProject } from '../services/api'
import Navbar from '../components/Navbar'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedUser, setSelectedUser] = useState('')
  const navigate = useNavigate()

  const loadProjects = () => {
    getAllProjects().then(res => setProjects(res.data.data)).catch(err => console.log(err))
  }

  useEffect(() => {
    loadProjects()
    getAllUsers().then(res => setUsers(res.data.data)).catch(err => console.log(err))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createProject(form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      loadProjects()
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddMember = async (projectId) => {
    if (!selectedUser) return
    try {
      await addMember(projectId, selectedUser)
      setSelectedUser('')
      setSelectedProject(null)
      loadProjects()
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      loadProjects()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Projects</h2>
          <button style={styles.btn} onClick={() => setShowForm(!showForm)}>+ New Project</button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={styles.form}>
            <input style={styles.input} placeholder="Project Name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Description"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button style={styles.btn} type="submit">Create</button>
          </form>
        )}

        <div style={styles.grid}>
          {projects.map(project => (
            <div key={project.id} style={styles.card}>
              <h3 style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => navigate(`/projects/${project.id}`)}>
                {project.name}
              </h3>
              <p>{project.description}</p>
              <p><b>Owner:</b> {project.owner.name}</p>
              <p><b>Members:</b> {project.members ? project.members.length : 0}</p>

              <div style={{ marginTop: '10px' }}>
                <select style={styles.select} value={selectedProject === project.id ? selectedUser : ''}
                  onChange={e => { setSelectedProject(project.id); setSelectedUser(e.target.value) }}>
                  <option value="">Add Member</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <button style={styles.smallBtn} onClick={() => handleAddMember(project.id)}>Add</button>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <button style={styles.smallBtn} onClick={() => navigate(`/projects/${project.id}`)}>View Tasks</button>
                <button style={styles.dangerBtn} onClick={() => handleDelete(project.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  form: { background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' },
  select: { padding: '6px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '6px' },
  btn: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  smallBtn: { padding: '6px 12px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  dangerBtn: { padding: '6px 12px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
}