import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProjectById, getTasksByProject, createTask, updateTaskStatus, deleteTask, getAllUsers } from '../services/api'
import Navbar from '../components/Navbar'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
  const [assigneeId, setAssigneeId] = useState('')

  const loadTasks = () => {
    getTasksByProject(id).then(res => setTasks(res.data.data)).catch(err => console.log(err))
  }

  useEffect(() => {
    getProjectById(id).then(res => setProject(res.data.data)).catch(err => console.log(err))
    loadTasks()
    getAllUsers().then(res => setUsers(res.data.data)).catch(err => console.log(err))
  }, [id])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      await createTask(id, assigneeId, form)
      setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
      setAssigneeId('')
      setShowForm(false)
      loadTasks()
    } catch (err) {
      console.log(err)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status)
      loadTasks()
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      loadTasks()
    } catch (err) {
      console.log(err)
    }
  }

  if (!project) return <p>Loading...</p>

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <p><b>Owner:</b> {project.owner.name}</p>

        <div style={styles.header}>
          <h3>Tasks</h3>
          <button style={styles.btn} onClick={() => setShowForm(!showForm)}>+ Add Task</button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateTask} style={styles.form}>
            <input style={styles.input} placeholder="Task Title"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input style={styles.input} placeholder="Description"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <select style={styles.input} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <input style={styles.input} type="date"
              value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            <select style={styles.input} value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
              <option value="">Assign To</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <button style={styles.btn} type="submit">Create Task</button>
          </form>
        )}

        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={styles.tr}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td style={{ color: task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'red' : 'black' }}>
                  {task.dueDate || '-'}
                </td>
                <td>{task.assignee ? task.assignee.name : 'Unassigned'}</td>
                <td>
                  <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}>
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </td>
                <td>
                  <button style={styles.dangerBtn} onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' },
  form: { background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' },
  btn: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  dangerBtn: { padding: '6px 12px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  thead: { background: '#1890ff', color: 'white' },
  tr: { borderBottom: '1px solid #f0f0f0' }
}