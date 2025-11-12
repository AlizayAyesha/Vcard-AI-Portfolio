'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, AreaChart, Area } from 'recharts'
import './admin.css'
import PageViewsTrend from './PageViewsTrend'
import RevenueOverview from './RevenueOverview'

interface Project {
  slug: string
  title: string
  category: string
  image: string
  deadline?: string
  progress?: number
}

interface Blog {
  slug: string
  title: string
  category: string
  image: string
  date: string
  excerpt: string
}

interface Order {
  id: string
  product: string
  price: number
  date: string
  status: 'completed' | 'pending' | 'cancelled'
}

interface PersonalProject {
  id: string
  title: string
  deadline: string
  keyFeatures: string[]
  description: string
  images: string[]
  links: { name: string; url: string }[]
  status: 'active' | 'paused' | 'completed'
  createdAt: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [analytics, setAnalytics] = useState({ views: 0, orders: 0 })
  const [orders, setOrders] = useState<Order[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [personalProjects, setPersonalProjects] = useState<PersonalProject[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'myden'>('overview')
  const [dailyQuote, setDailyQuote] = useState('')

  const [chartData, setChartData] = useState<Array<{day: string; views: number; orders: number; revenue: number}>>([])

  // New project form
  const [newProject, setNewProject] = useState({
    title: '',
    category: '',
    image: '',
    slug: '',
    deadline: '',
    progress: 0
  })

  // New blog form
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: '',
    image: '',
    excerpt: '',
    slug: ''
  })

  // Personal project form
  const [newPersonalProject, setNewPersonalProject] = useState({
    title: '',
    deadline: '',
    keyFeatures: '',
    description: '',
    images: '',
    links: ''
  })
  const [showAddProjectForm, setShowAddProjectForm] = useState(false)

  // Sample data for charts
  const pageViewsData = [
    { day: 'Mon', views: 65, orders: 25, revenue: 1250 },
    { day: 'Tue', views: 78, orders: 32, revenue: 1600 },
    { day: 'Wed', views: 92, orders: 45, revenue: 2250 },
    { day: 'Thu', views: 81, orders: 38, revenue: 1900 },
    { day: 'Fri', views: 105, orders: 52, revenue: 2600 },
    { day: 'Sat', views: 88, orders: 44, revenue: 2200 },
    { day: 'Sun', views: 72, orders: 35, revenue: 1750 },
  ]

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)

    if (loggedIn) {
      loadAdminData()
      generateDailyQuote()
    }
  }, [])

  const generateDailyQuote = async () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
      setDailyQuote('Keep coding and building amazing things! 💻')
      return
    }

    const now = new Date()
    const hour = now.getHours()
    let timeContext = 'morning'

    if (hour >= 12 && hour < 17) {
      timeContext = 'afternoon'
    } else if (hour >= 17) {
      timeContext = 'evening'
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a motivational AI assistant for developers. Generate a short, inspiring quote about programming, technology, or productivity that is contextual to the time of day. Keep it under 100 characters and make it encouraging.`
            },
            {
              role: 'user',
              content: `Generate a ${timeContext} motivational quote for developers.`
            }
          ],
          max_tokens: 80,
          temperature: 0.8
        })
      })

      if (!response.ok) {
        throw new Error('Quote generation failed')
      }

      const data = await response.json()
      const quote = data.choices[0].message.content.trim()
      setDailyQuote(quote)
    } catch (error) {
      console.error('Error generating quote:', error)
      setDailyQuote('Code with passion, build with purpose! 🚀')
    }
  }

  const loadAdminData = () => {
    const views = parseInt(localStorage.getItem('pageViews') || '0')
    const ordersData = JSON.parse(localStorage.getItem('orders') || '[]')
    setAnalytics({ views, orders: ordersData.length });
    setOrders(ordersData);
    
    const dailyOrders = getDailyOrders()
    const dailyRevenue = getDailyRevenue()
    const updatedData = pageViewsData.map(item => ({
      ...item,
      orders: dailyOrders[item.day] || 0,
      revenue: dailyRevenue[item.day] || 0
    }))
    setChartData(updatedData)
    
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]')
    const storedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]')
    const storedPersonalProjects = JSON.parse(localStorage.getItem('personalProjects') || '[]')
    setProjects(storedProjects)
    setBlogs(storedBlogs)
    setPersonalProjects(storedPersonalProjects)
  }

  // Enhanced sample data for charts
  const orderDistributionData = [
    { name: 'Finance', value: orders.filter(o => o.product === 'Finance').length, color: '#00f5ff' },
    { name: 'Orizon', value: orders.filter(o => o.product === 'Orizon').length, color: '#9d4edd' },
    { name: 'Fundo', value: orders.filter(o => o.product === 'Fundo').length, color: '#ff006e' },
    { name: 'Brawlhalla', value: orders.filter(o => o.product === 'Brawlhalla').length, color: '#fb5607' },
    { name: 'DSM.', value: orders.filter(o => o.product === 'DSM.').length, color: '#ffbe0b' },
    { name: 'MetaSpark', value: orders.filter(o => o.product === 'MetaSpark').length, color: '#3a86ff' },
  ].filter(item => item.value > 0)

  const getDailyOrders = () => {
    const daily = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
    const now = new Date()
    orders.forEach(order => {
      const orderDate = new Date(order.date)
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays < 7) {
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][orderDate.getDay()]
        daily[dayName]++
      }
    })
    return daily
  }

  const getDailyRevenue = () => {
    const daily = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
    const now = new Date()
    orders.forEach(order => {
      const orderDate = new Date(order.date)
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays < 7) {
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][orderDate.getDay()]
        daily[dayName] += order.price
      }
    })
    return daily
  }

  const monthlyOrdersData = [
    { month: 'Jan', orders: 12, revenue: 2400 },
    { month: 'Feb', orders: 19, revenue: 4200 },
    { month: 'Mar', orders: 8, revenue: 1800 },
    { month: 'Apr', orders: 24, revenue: 4800 },
    { month: 'May', orders: 15, revenue: 3000 },
    { month: 'Jun', orders: 22, revenue: 4400 },
  ]

  const revenueData = [
    { week: 'Week 1', revenue: 4200, profit: 3200 },
    { week: 'Week 2', revenue: 3800, profit: 2800 },
    { week: 'Week 3', revenue: 5100, profit: 4100 },
    { week: 'Week 4', revenue: 4800, profit: 3600 },
  ]

  const projectProgressData = [
    { name: 'Finance App', progress: 85, deadline: '2024-03-15' },
    { name: 'E-commerce', progress: 60, deadline: '2024-04-01' },
    { name: 'Portfolio Site', progress: 90, deadline: '2024-02-28' },
    { name: 'Mobile App', progress: 45, deadline: '2024-05-10' },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsLoggedIn(true)
      localStorage.setItem('adminLoggedIn', 'true')
      loadAdminData()
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('adminLoggedIn')
    setPassword('')
  }

  const addProject = () => {
    if (!newProject.title || !newProject.category || !newProject.slug) {
      alert('Please fill in all required fields')
      return
    }

    const project: Project = {
      ...newProject,
      image: newProject.image || '/assets/images/project-default.jpg',
      progress: newProject.progress || 0
    }

    const updatedProjects = [...projects, project]
    setProjects(updatedProjects)
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
    setNewProject({ title: '', category: '', image: '', slug: '', deadline: '', progress: 0 })
    alert('Project added successfully!')
  }

  const addBlog = () => {
    if (!newBlog.title || !newBlog.category || !newBlog.slug) {
      alert('Please fill in all required fields')
      return
    }

    const blog: Blog = {
      ...newBlog,
      image: newBlog.image || '/assets/images/blog-default.jpg',
      date: new Date().toISOString().split('T')[0],
      excerpt: newBlog.excerpt || 'No excerpt available.'
    }

    const updatedBlogs = [...blogs, blog]
    setBlogs(updatedBlogs)
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs))
    setNewBlog({ title: '', category: '', image: '', excerpt: '', slug: '' })
    alert('Blog post published successfully!')
  }

  const addPersonalProject = () => {
    if (!newPersonalProject.title || !newPersonalProject.deadline) {
      alert('Please fill in title and deadline')
      return
    }

    const project: PersonalProject = {
      id: Date.now().toString(),
      title: newPersonalProject.title,
      deadline: newPersonalProject.deadline,
      keyFeatures: newPersonalProject.keyFeatures.split('\n').filter(f => f.trim()),
      description: newPersonalProject.description,
      images: newPersonalProject.images.split('\n').filter(i => i.trim()),
      links: newPersonalProject.links.split('\n').map(l => {
        const [name, url] = l.split('|').map(s => s.trim())
        return name && url ? { name, url } : null
      }).filter(Boolean) as { name: string; url: string }[],
      status: 'active',
      createdAt: new Date().toISOString()
    }

    const updatedProjects = [...personalProjects, project]
    setPersonalProjects(updatedProjects)
    localStorage.setItem('personalProjects', JSON.stringify(updatedProjects))
    setNewPersonalProject({ title: '', deadline: '', keyFeatures: '', description: '', images: '', links: '' })
    setShowAddProjectForm(false)
    alert('Personal project added successfully!')
  }

  const deletePersonalProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = personalProjects.filter(p => p.id !== id)
      setPersonalProjects(updatedProjects)
      localStorage.setItem('personalProjects', JSON.stringify(updatedProjects))
    }
  }

  const updateProjectStatus = (id: string, status: 'active' | 'paused' | 'completed') => {
    const updatedProjects = personalProjects.map(p =>
      p.id === id ? { ...p, status } : p
    )
    setPersonalProjects(updatedProjects)
    localStorage.setItem('personalProjects', JSON.stringify(updatedProjects))
  }

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const getProgressPercentage = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const createdDate = new Date() // For simplicity, using current date as created date
    const totalTime = deadlineDate.getTime() - createdDate.getTime()
    const elapsedTime = now.getTime() - createdDate.getTime()
    const progress = Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100))
    return Math.round(progress)
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container" suppressHydrationWarning>
        <div className="login-card" suppressHydrationWarning>
          <div className="login-header" suppressHydrationWarning>
            <h1>Admin Access</h1>
            <p>Enter your password to access the admin dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="login-form" suppressHydrationWarning>
            <div className="form-group" suppressHydrationWarning>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="login-input"
                suppressHydrationWarning
              />
              <small className="password-hint" suppressHydrationWarning>
                Hint: admin123
              </small>
            </div>
            <button type="submit" className="login-btn" suppressHydrationWarning>
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="admin-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-container">
          <h1>Admin Dashboard</h1>
          <div className="navbar-actions">
            <Link href="/" className="portfolio-link">
              ← View Portfolio
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="greeting-text">
              Hi Admin! 🌟
            </div>
            <p className="welcome-text">
              Welcome back! Manage your portfolio analytics and content.
            </p>

            <div className="quote-heading">
              Todays Qoute💡
            </div>

            <div className="daily-quote">
              <div className="quote-text">
                {dailyQuote || 'Loading inspirational quote...'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📊</span>
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <span className="tab-icon">✏️</span>
            Content
          </button>
          <button
            className={`nav-tab ${activeTab === 'myden' ? 'active' : ''}`}
            onClick={() => setActiveTab('myden')}
          >
            <span className="tab-icon">🦾</span>
            My Den
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="tab-content-header">
              <h2>Dashboard Overview</h2>
              <p>Monitor your portfolio performance and recent activity</p>
            </div>
            <div className="overview-grid">
              {/* Key Metrics - Single Row */}
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-icon views">
                    <span>👁️</span>
                  </div>
                  <div className="metric-content">
                    <h3>{analytics.views.toLocaleString()}</h3>
                    <p>Page Views</p>
                    <div className="metric-trend up">+12% this week</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon orders">
                    <span>🛒</span>
                  </div>
                  <div className="metric-content">
                    <h3>{analytics.orders.toLocaleString()}</h3>
                    <p>Total Orders</p>
                    <div className="metric-trend up">+8% this month</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon revenue">
                    <span>💰</span>
                  </div>
                  <div className="metric-content">
                    <h3>${orders.reduce((sum, order) => sum + order.price, 0).toLocaleString()}</h3>
                    <p>Total Revenue</p>
                    <div className="metric-trend up">+15% growth</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon content">
                    <span>📄</span>
                  </div>
                  <div className="metric-content">
                    <h3>{(projects.length + blogs.length).toLocaleString()}</h3>
                    <p>Content Items</p>
                    <div className="metric-trend">Active portfolio</div>
                  </div>
                </div>
              </div>

              {/* Charts Row - Full Width */}
              <div className="charts-full-row">
                <PageViewsTrend data={chartData} />
                <RevenueOverview data={revenueData} />
              </div>

              {/* Recent Activity & Analytics */}
              <div className="activity-analytics-row">
                <div className="activity-card">
                  <div className="activity-header">
                    <h3>Recent Activity</h3>
                    <button className="view-all-btn">View All →</button>
                  </div>
                  <div className="activity-list">
                    {orders.slice(-4).reverse().map((order) => (
                      <div key={order.id} className="activity-item">
                        <div className="activity-icon order">
                          💳
                        </div>
                        <div className="activity-info">
                          <strong>{order.product}</strong>
                          <span>Order • {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="activity-value">${order.price}</div>
                      </div>
                    ))}
                    {[...projects.slice(-2).reverse(), ...blogs.slice(-2).reverse()].map((item: any, index) => (
                      <div key={`${item.slug}-${index}`} className="activity-item">
                        <div className={`activity-icon ${item.category ? 'project' : 'blog'}`}>
                          {item.category ? 'P' : 'B'}
                        </div>
                        <div className="activity-info">
                          <strong>{item.title}</strong>
                          <span>{item.category ? 'Project added' : 'Blog published'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-sidebar">
                  <div className="donut-chart-card">
                    <div className="chart-header">
                      <h3>Monthly Orders</h3>
                      <span className="total-orders">{monthlyOrdersData.reduce((sum, item) => sum + item.orders, 0)} orders</span>
                    </div>
                    <div className="donut-container">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={monthlyOrdersData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="orders"
                          >
                            {monthlyOrdersData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={orderDistributionData[index % orderDistributionData.length]?.color || '#00f5ff'} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(20, 20, 20, 0.95)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '12px',
                              color: '#fff',
                              backdropFilter: 'blur(10px)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="donut-legend">
                      {monthlyOrdersData.slice(0, 4).map((item, index) => (
                        <div key={index} className="legend-item">
                          <div className={`legend-color color-${index}`}></div>
                          <span>{item.month}</span>
                          <strong>{item.orders}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="stats-card">
                    <h4>Content Statistics</h4>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-info">
                          <span>Total Projects</span>
                          <strong>{projects.length}</strong>
                        </div>
                        <div className="stat-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill projects" 
                              style={{width: `${(projects.length / Math.max(projects.length + blogs.length, 1)) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-info">
                          <span>Total Blog Posts</span>
                          <strong>{blogs.length}</strong>
                        </div>
                        <div className="stat-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill blogs" 
                              style={{width: `${(blogs.length / Math.max(projects.length + blogs.length, 1)) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-info">
                          <span>Orders Completed</span>
                          <strong>{orders.filter(o => o.status === 'completed').length}</strong>
                        </div>
                        <div className="stat-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill orders" 
                              style={{width: `${(orders.filter(o => o.status === 'completed').length / Math.max(orders.length, 1)) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="deadlines-card">
                    <h4>Project Deadlines</h4>
                    <div className="deadlines-list">
                      {projectProgressData.map((project, index) => (
                        <div key={index} className="deadline-item">
                          <div className="project-info">
                            <strong>{project.name}</strong>
                            <span>Due: {project.deadline}</span>
                          </div>
                          <div className="progress-section">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{width: `${project.progress}%`}}
                              ></div>
                            </div>
                            <span className="progress-text">{project.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="tab-content">
            <div className="tab-content-header">
              <h2>Content Management</h2>
              <p>Add new projects and blog posts to your portfolio</p>
            </div>
            <div className="content-management">
              <div className="content-grid">
                {/* Add Project Form */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-icon project">
                      <span>📁</span>
                    </div>
                    <div className="card-title">
                      <h3>Add New Project</h3>
                      <p>Create a new portfolio project</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Project Title *</label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                          placeholder="Enter project title"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Category *</label>
                        <input
                          type="text"
                          value={newProject.category}
                          onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                          placeholder="web development"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Slug *</label>
                        <input
                          type="text"
                          value={newProject.slug}
                          onChange={(e) => setNewProject({...newProject, slug: e.target.value})}
                          placeholder="my-project"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Progress (%)</label>
                        <input
                          type="number"
                          value={newProject.progress}
                          onChange={(e) => setNewProject({...newProject, progress: parseInt(e.target.value) || 0})}
                          placeholder="0"
                          min="0"
                          max="100"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={newProject.image}
                        onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Deadline (Optional)</label>
                      <input
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                        className="form-input"
                      />
                    </div>

                    <button onClick={addProject} className="submit-btn primary">
                      <span>➕</span>
                      Add Project
                    </button>
                  </div>
                </div>

                {/* Add Blog Form */}
                <div className="content-card">
                  <div className="card-header">
                    <div className="card-icon blog">
                      <span>📝</span>
                    </div>
                    <div className="card-title">
                      <h3>Add New Blog Post</h3>
                      <p>Publish a new article</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Blog Title *</label>
                      <input
                        type="text"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                        placeholder="Enter blog title"
                        className="form-input"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Category *</label>
                        <input
                          type="text"
                          value={newBlog.category}
                          onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                          placeholder="Design"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Slug *</label>
                        <input
                          type="text"
                          value={newBlog.slug}
                          onChange={(e) => setNewBlog({...newBlog, slug: e.target.value})}
                          placeholder="my-blog-post"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Excerpt</label>
                      <textarea
                        value={newBlog.excerpt}
                        onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                        placeholder="Brief description of the blog post"
                        rows={4}
                        className="form-textarea"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={newBlog.image}
                        onChange={(e) => setNewBlog({...newBlog, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="form-input"
                      />
                    </div>

                    <button onClick={addBlog} className="submit-btn secondary">
                      <span>📝</span>
                      Publish Blog Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'myden' && (
          <div className="tab-content">
            <div className="myden-header">
              <h2>🦾 My Den – Admin Projects</h2>
              <p>Track and manage your personal projects</p>
            </div>
            <div className="projects-grid">
              {personalProjects.length === 0 ? (
                <div className="no-projects">
                  <div className="no-projects-icon">📂</div>
                  <h3>No projects yet</h3>
                  <p>Click the + button to add your first project</p>
                </div>
              ) : (
                personalProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className={`status-badge status-${project.status}`}>
                      {project.status === 'active' ? '🟢' :
                       project.status === 'paused' ? '🟠' : '🔴'} {project.status}
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <div className={`project-deadline ${isOverdue(project.deadline) ? 'overdue' : ''}`}>
                      📅 Due: {new Date(project.deadline).toLocaleDateString()}
                      {isOverdue(project.deadline) && ' (OVERDUE)'}
                    </div>
                    <div className="project-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-value">{getProgressPercentage(project.deadline)}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-fill"
                          style={{width: `${getProgressPercentage(project.deadline)}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="project-actions">
                      <select
                        value={project.status}
                        onChange={(e) => updateProjectStatus(project.id, e.target.value as 'active' | 'paused' | 'completed')}
                        className="status-select"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => deletePersonalProject(project.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Always visible floating add button */}
            <button
              onClick={() => setShowAddProjectForm(true)}
              className="floating-add-btn"
              title="Add New Project"
            >
              +
            </button>

            {/* Add Project Modal */}
            {showAddProjectForm && (
              <div className="add-project-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Add New Personal Project</h3>
                    <button
                      onClick={() => setShowAddProjectForm(false)}
                      className="close-btn"
                    >
                      ×
                    </button>
                  </div>
                  <div className="modal-form">
                    <div className="form-group">
                      <label>Project Title *</label>
                      <input
                        type="text"
                        value={newPersonalProject.title}
                        onChange={(e) => setNewPersonalProject({...newPersonalProject, title: e.target.value})}
                        placeholder="Enter project title"
                        className="modal-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Deadline *</label>
                      <input
                        type="date"
                        value={newPersonalProject.deadline}
                        onChange={(e) => setNewPersonalProject({...newPersonalProject, deadline: e.target.value})}
                        className="modal-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Key Features (one per line)</label>
                      <textarea
                        value={newPersonalProject.keyFeatures}
                        onChange={(e) => setNewPersonalProject({...newPersonalProject, keyFeatures: e.target.value})}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        rows={4}
                        className="modal-textarea"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={newPersonalProject.description}
                        onChange={(e) => setNewPersonalProject({...newPersonalProject, description: e.target.value})}
                        placeholder="Project description"
                        rows={3}
                        className="modal-textarea"
                      />
                    </div>

                    <div className="form-group">
                      <label>Images (one URL per line)</label>
                      <textarea
                        value={newPersonalProject.images}
                        onChange={(e) => setNewPersonalProject({...newPersonalProject, images: e.target.value})}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        rows={2}
                        className="modal-textarea"
                      />
                    </div>

                    <div className="form-group">
                      <label>Links (name|url format, one per line)</label>
                      <textarea
                        value={newPersonalProject.links}
                        onChange={(e) => setNewPersonalProject({...newPersonalProject, links: e.target.value})}
                        placeholder="GitHub|https://github.com/project&#10;Live Demo|https://project.com"
                        rows={2}
                        className="modal-textarea"
                      />
                    </div>

                    <div className="modal-buttons">
                      <button
                        onClick={() => setShowAddProjectForm(false)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addPersonalProject}
                        className="add-btn"
                      >
                        Add Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
