'use client'

import { useEffect, useState } from 'react'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'ion-icon': any;
      }
    }
  }
}

interface Review {
  id: string
  name: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([])
  const [dynamicBlogs, setDynamicBlogs] = useState<any[]>([])

  // Review state management
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    name: '',
    avatar: '👩‍💻',
    rating: 0,
    comment: ''
  })
  const [hoveredRating, setHoveredRating] = useState(0)

  // Voice interaction state
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [hasSpokenIntro, setHasSpokenIntro] = useState(false)

  // Avatar options (using the same images as testimonials)
  const avatarOptions = [
    { src: '/assets/images/avatar-1.png', alt: 'Avatar 1' },
    { src: '/assets/images/avatar-2.png', alt: 'Avatar 2' },
    { src: '/assets/images/avatar-3.png', alt: 'Avatar 3' },
    { src: '/assets/images/avatar-4.png', alt: 'Avatar 4' }
  ]

  // Review functions
  const handleStarClick = (rating: number) => {
    setNewReview({...newReview, rating})
  }

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const submitReview = () => {
    if (!newReview.name.trim() || !newReview.comment.trim() || newReview.rating === 0) {
      alert('Please fill in all required fields and select a rating')
      return
    }

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name.trim(),
      avatar: newReview.avatar,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: new Date().toISOString().split('T')[0]
    }

    const updatedReviews = [review, ...reviews]
    setReviews(updatedReviews)
    localStorage.setItem('reviews', JSON.stringify(updatedReviews))

    // Reset form
    setNewReview({
      name: '',
      avatar: '👩‍💻',
      rating: 0,
      comment: ''
    })

    alert('Thank you for your review!')
  }

  // Voice interaction functions
  const startRecording = async () => {
    if (isRecording) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        await sendToWhisper(blob)
        stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
      }

      recorder.start()
      setIsRecording(true)

      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop()
        }
      }, 5000)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Microphone access denied or not available.')
    }
  }

  const sendToWhisper = async (audioBlob: Blob) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
      setTranscript('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file.')
      return
    }

    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')

    try {
      // First, transcribe the audio
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      })

      if (!whisperResponse.ok) {
        const errorData = await whisperResponse.json().catch(() => ({}))
        throw new Error(`Whisper API error: ${whisperResponse.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const whisperData = await whisperResponse.json()
      const userMessage = whisperData.text

      // Now generate AI response using ChatGPT
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are Richard Hanrick, a full-stack developer specializing in AI-driven web apps. Respond helpfully and professionally to user questions about your work, skills, or portfolio. Keep responses concise and engaging.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      })

      if (!chatResponse.ok) {
        const errorData = await chatResponse.json().catch(() => ({}))
        throw new Error(`Chat API error: ${chatResponse.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const chatData = await chatResponse.json()
      const aiResponse = chatData.choices[0].message.content

      setTranscript(aiResponse)

      // Speak the AI response
      if ('speechSynthesis' in window) {
        const responseUtterance = new SpeechSynthesisUtterance(aiResponse)
        responseUtterance.rate = 0.9
        responseUtterance.pitch = 1
        responseUtterance.volume = 1
        responseUtterance.lang = 'en-US'

        // Set a preferred male voice if available
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(voice =>
          (voice.name.includes('Male') || voice.name.includes('Man')) &&
          (voice.name.includes('Google') || voice.name.includes('English') || voice.lang.startsWith('en'))
        ) || voices.find(voice =>
          voice.name.includes('Google') || voice.name.includes('English')
        ) || voices[0]
        if (preferredVoice) {
          responseUtterance.voice = preferredVoice
        }
        // Adjust pitch to sound more male
        responseUtterance.pitch = 0.7

        responseUtterance.onend = () => {
          console.log('AI response speech completed')
        }

        responseUtterance.onerror = (event) => {
          console.error('AI response speech synthesis error:', event.error)
        }

        window.speechSynthesis.speak(responseUtterance)
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      setTranscript(`Error: ${error.message}`)
    }
  }

  useEffect(() => {
    // Track page views
    const currentViews = parseInt(localStorage.getItem('pageViews') || '0')
    localStorage.setItem('pageViews', (currentViews + 1).toString())

    // Load dynamic projects and blogs
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]')
    setDynamicProjects(projects)
    setDynamicBlogs(blogs)

    // Load reviews from localStorage
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    setReviews(storedReviews)


    // Navigation functionality
    const handleNavClick = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.matches('[data-nav-link]')) {
        const navLink = target as HTMLButtonElement
        const navValue = navLink.dataset.navLink

        // Remove active class from all nav links
        document.querySelectorAll('[data-nav-link]').forEach(link => {
          link.classList.remove('active')
        })

        // Add active class to clicked nav link
        navLink.classList.add('active')

        // Hide all articles
        document.querySelectorAll('[data-page]').forEach(page => {
          page.classList.remove('active')
        })

        // Show the corresponding article
        const targetPage = document.querySelector(`[data-page="${navValue}"]`)
        if (targetPage) {
          targetPage.classList.add('active')
        }
      }
    }

    // Sidebar toggle functionality
    const handleSidebarToggle = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.matches('[data-sidebar-btn]')) {
        const sidebar = document.querySelector('[data-sidebar]') as HTMLElement
        if (sidebar) {
          sidebar.classList.toggle('active')
        }
      }
    }

    // Portfolio filter functionality
    const handleFilterClick = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.matches('[data-filter-btn]')) {
        const filterBtn = target as HTMLButtonElement
        const filterValue = filterBtn.textContent?.toLowerCase()

        // Remove active class from all filter buttons
        document.querySelectorAll('[data-filter-btn]').forEach(btn => {
          btn.classList.remove('active')
        })

        // Add active class to clicked filter button
        filterBtn.classList.add('active')

        // Filter portfolio items
        const projectItems = document.querySelectorAll('[data-filter-item]')

        projectItems.forEach(item => {
          const element = item as HTMLElement
          const category = element.dataset.category

          if (filterValue === 'all' || category === filterValue) {
            element.classList.add('active')
          } else {
            element.classList.remove('active')
          }
        })
      }
    }

    // Add event listeners
    document.addEventListener('click', handleNavClick)
    document.addEventListener('click', handleSidebarToggle)
    document.addEventListener('click', handleFilterClick)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleNavClick)
      document.removeEventListener('click', handleSidebarToggle)
      document.removeEventListener('click', handleFilterClick)
    }
  }, [])

  return (
    <main suppressHydrationWarning={true}>
      {/* Sidebar */}
      <aside className="sidebar" data-sidebar suppressHydrationWarning>
        <div className="sidebar-info">
          <figure className="avatar-box">
            <img src="/assets/images/my-avatar.png" alt="Richard hanrick" width="80" />
          </figure>

          <div className="info-content">
            <h1 className="name" title="Richard hanrick">Richard hanrick</h1>
            <p className="title">Web developer</p>
          </div>

          <button className="info_more-btn" data-sidebar-btn>
            <span>Show Contacts</span>
            <ion-icon name="chevron-down" suppressHydrationWarning></ion-icon>
          </button>
        </div>

        <div className="sidebar-info_more">
          <div className="separator"></div>

          <ul className="contacts-list">
            <li className="contact-item">
              <div className="icon-box">
                <ion-icon name="mail-outline" suppressHydrationWarning></ion-icon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Email</p>
                <a href="mailto:richard@example.com" className="contact-link">richard@example.com</a>
              </div>
            </li>

            <li className="contact-item">
              <div className="icon-box">
                <ion-icon name="phone-portrait-outline" suppressHydrationWarning></ion-icon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Phone</p>
                <a href="tel:+12133522795" className="contact-link">+1 (213) 352-2795</a>
              </div>
            </li>

            <li className="contact-item">
              <div className="icon-box">
                <ion-icon name="calendar-outline" suppressHydrationWarning></ion-icon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Birthday</p>
                <time dateTime="1982-06-23">June 23, 1982</time>
              </div>
            </li>

            <li className="contact-item">
              <div className="icon-box">
                <ion-icon name="location-outline" suppressHydrationWarning></ion-icon>
              </div>
              <div className="contact-info">
                <p className="contact-title">Location</p>
                <address>Sacramento, California, USA</address>
              </div>
            </li>
          </ul>

          <div className="separator"></div>

          <div style={{ marginBottom: '20px' }}>
            <a href="/admin" style={{
              color: 'var(--orange-yellow-crayola)',
              textDecoration: 'none',
              fontSize: 'var(--fs-6)',
              fontWeight: 'var(--fw-500)',
              display: 'inline-block',
              padding: '8px 12px',
              border: '1px solid var(--orange-yellow-crayola)',
              borderRadius: '6px',
              transition: 'var(--transition-1)'
            }}>
              Admin Panel
            </a>
          </div>

          <div className="separator"></div>

          <ul className="social-list">
            <li className="social-item">
              <a href="#" className="social-link">
                <ion-icon name="logo-facebook" suppressHydrationWarning></ion-icon>
              </a>
            </li>
            <li className="social-item">
              <a href="#" className="social-link">
                <ion-icon name="logo-twitter" suppressHydrationWarning></ion-icon>
              </a>
            </li>
            <li className="social-item">
              <a href="#" className="social-link">
                <ion-icon name="logo-instagram" suppressHydrationWarning></ion-icon>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item">
              <button className="navbar-link active" data-nav-link="about">About</button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" data-nav-link="resume">Resume</button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" data-nav-link="portfolio">Portfolio</button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" data-nav-link="blog">Blog</button>
            </li>
            <li className="navbar-item">
              <button className="navbar-link" data-nav-link="contact">Contact</button>
            </li>
          </ul>
        </nav>

        {/* About Section */}
        <article className="about active" data-page="about">
          <header>
            <h2 className="h2 article-title">About me</h2>
          </header>

          <section className="about-text">
            <p>
              I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media.
              I enjoy turning complex problems into simple, beautiful and intuitive designs.
            </p>
            <p>
              My job is to build your website so that it is functional and user-friendly but at the same time attractive.
              Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. My aim is to bring
              across your message and identity in the most creative way. I created web design for many famous brand companies.
            </p>
          </section>

          {/* Voice Interaction */}
          <section className="voice-interaction" suppressHydrationWarning>
            <h3 className="h3 voice-title">Voice Interaction</h3>
            <p>Click the microphone to speak with me!</p>
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
            >
              <ion-icon name={isRecording ? "radio-button-on" : "mic"} suppressHydrationWarning></ion-icon>
              <span>{isRecording ? 'Recording...' : 'Start Recording'}</span>
            </button>
            {transcript && (
              <div className="transcript-display" suppressHydrationWarning>
                <h4>AI generated response:</h4>
                <p>{transcript}</p>
              </div>
            )}
          </section>

          {/* Service */}
          <section className="service">
            <h3 className="h3 service-title">What i'm doing</h3>
            <ul className="service-list">
              <li className="service-item">
                <div className="service-icon-box">
                  <img src="/assets/images/icon-design.svg" alt="design icon" width="40" />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">Web design</h4>
                  <p className="service-item-text">
                    The most modern and high-quality design made at a professional level.
                  </p>
                </div>
              </li>

              <li className="service-item">
                <div className="service-icon-box">
                  <img src="/assets/images/icon-dev.svg" alt="Web development icon" width="40" />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">Web development</h4>
                  <p className="service-item-text">
                    High-quality development of sites at the professional level.
                  </p>
                </div>
              </li>

              <li className="service-item">
                <div className="service-icon-box">
                  <img src="/assets/images/icon-app.svg" alt="mobile app icon" width="40" />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">Mobile apps</h4>
                  <p className="service-item-text">
                    Professional development of applications for iOS and Android.
                  </p>
                </div>
              </li>

              <li className="service-item">
                <div className="service-icon-box">
                  <img src="/assets/images/icon-photo.svg" alt="camera icon" width="40" />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">Photography</h4>
                  <p className="service-item-text">
                    I make high-quality photos of any category at a professional level.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* Reviews Section (Includes Original Testimonials + Customer Reviews) */}
          <section className="testimonials">
            <h3 className="h3 testimonials-title">Reviews</h3>
            <ul className="testimonials-list has-scrollbar">
              {/* Original Testimonials */}
              <li className="testimonials-item">
                <div className="content-card" data-testimonials-item>
                  <figure className="testimonials-avatar-box">
                    <img src="/assets/images/avatar-1.png" alt="Daniel lewis" width="60" data-testimonials-avatar />
                  </figure>
                  <h4 className="h4 testimonials-item-title" data-testimonials-title>Daniel lewis</h4>
                  <div className="testimonials-text" data-testimonials-text>
                    <p>
                      Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                      lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                      consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                    </p>
                  </div>
                </div>
              </li>

              <li className="testimonials-item">
                <div className="content-card" data-testimonials-item>
                  <figure className="testimonials-avatar-box">
                    <img src="/assets/images/avatar-2.png" alt="Jessica miller" width="60" data-testimonials-avatar />
                  </figure>
                  <h4 className="h4 testimonials-item-title" data-testimonials-title>Jessica miller</h4>
                  <div className="testimonials-text" data-testimonials-text>
                    <p>
                      Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                      lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                      consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                    </p>
                  </div>
                </div>
              </li>

              <li className="testimonials-item">
                <div className="content-card" data-testimonials-item>
                  <figure className="testimonials-avatar-box">
                    <img src="/assets/images/avatar-3.png" alt="Emily evans" width="60" data-testimonials-avatar />
                  </figure>
                  <h4 className="h4 testimonials-item-title" data-testimonials-title>Emily evans</h4>
                  <div className="testimonials-text" data-testimonials-text>
                    <p>
                      Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                      lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                      consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                    </p>
                  </div>
                </div>
              </li>

              <li className="testimonials-item">
                <div className="content-card" data-testimonials-item>
                  <figure className="testimonials-avatar-box">
                    <img src="/assets/images/avatar-4.png" alt="Henry william" width="60" data-testimonials-avatar />
                  </figure>
                  <h4 className="h4 testimonials-item-title" data-testimonials-title>Henry william</h4>
                  <div className="testimonials-text" data-testimonials-text>
                    <p>
                      Richard was hired to create a corporate identity. We were very pleased with the work done. She has a
                      lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt
                      consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.
                    </p>
                  </div>
                </div>
              </li>

              {/* Customer Reviews */}
              {reviews.map((review) => (
                <li key={review.id} className="testimonials-item">
                  <div className="content-card" data-testimonials-item>
                    <figure className="testimonials-avatar-box">
                      <img src={review.avatar} alt={`${review.name} avatar`} width="60" data-testimonials-avatar />
                    </figure>
                    <h4 className="h4 testimonials-item-title" data-testimonials-title>{review.name}</h4>
                    <div className="review-stars-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`review-star ${star <= review.rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="testimonials-text" data-testimonials-text>
                      <p>{review.comment}</p>
                      <span className="review-date-small">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Reviews Section */}
          <section className="reviews">
            <h3 className="h3 reviews-title">Leave a Review</h3>

            {/* Review Form */}
            <div className="review-form-card">
              <div className="review-form-header">
                <h4>Share Your Experience</h4>
                <p>Your feedback helps us improve!</p>
              </div>

              <div className="review-form-content">
                {/* Avatar Selection */}
                <div className="avatar-selector">
                  <label>Choose Avatar:</label>
                  <div className="avatar-options">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`avatar-option ${newReview.avatar === avatar.src ? 'selected' : ''}`}
                        onClick={() => setNewReview({...newReview, avatar: avatar.src})}
                      >
                        <img src={avatar.src} alt={avatar.alt} width="40" height="40" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="rating-selector">
                  <label>Rate your experience:</label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= (hoveredRating || newReview.rating) ? 'filled' : ''}`}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="rating-text">
                    {newReview.rating > 0 && `${newReview.rating} star${newReview.rating !== 1 ? 's' : ''}`}
                  </span>
                </div>

                {/* Name Input */}
                <div className="form-group">
                  <label>Your Name:</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    placeholder="Enter your name"
                    className="review-input"
                  />
                </div>

                {/* Comment Input */}
                <div className="form-group">
                  <label>Your Review:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Share your thoughts about this portfolio..."
                    rows={4}
                    className="review-textarea"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={submitReview}
                  className="review-submit-btn"
                  disabled={!newReview.name.trim() || !newReview.comment.trim() || newReview.rating === 0}
                >
                  Submit Review
                </button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
              <h4>Recent Reviews</h4>
              {reviews.length === 0 ? (
                <div className="no-reviews">
                  <div className="no-reviews-icon">💬</div>
                  <p>No reviews yet. Be the first to leave a review!</p>
                </div>
              ) : (
                <div className="reviews-grid">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <img src={review.avatar} alt={`${review.name} avatar`} className="review-avatar" />
                        <div className="review-info">
                          <h5 className="review-name">{review.name}</h5>
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`review-star ${star <= review.rating ? 'filled' : ''}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="review-content">
                        <p className="review-text">{review.comment}</p>
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Clients */}
          <section className="clients">
            <h3 className="h3 clients-title">Clients</h3>
            <ul className="clients-list has-scrollbar">
              <li className="clients-item">
                <a href="#">
                  <img src="/assets/images/logo-1-color.png" alt="client logo" />
                </a>
              </li>
              <li className="clients-item">
                <a href="#">
                  <img src="/assets/images/logo-2-color.png" alt="client logo" />
                </a>
              </li>
              <li className="clients-item">
                <a href="#">
                  <img src="/assets/images/logo-3-color.png" alt="client logo" />
                </a>
              </li>
              <li className="clients-item">
                <a href="#">
                  <img src="/assets/images/logo-4-color.png" alt="client logo" />
                </a>
              </li>
              <li className="clients-item">
                <a href="#">
                  <img src="/assets/images/logo-5-color.png" alt="client logo" />
                </a>
              </li>
              <li className="clients-item">
                <a href="#">
                  <img src="/assets/images/logo-6-color.png" alt="client logo" />
                </a>
              </li>
            </ul>
          </section>
        </article>

        {/* Resume Section */}
        <article className="resume" data-page="resume">
          <header>
            <h2 className="h2 article-title">Resume</h2>
          </header>

          <section className="timeline">
            <div className="title-wrapper">
              <div className="icon-box">
                <ion-icon name="book-outline" suppressHydrationWarning></ion-icon>
              </div>
              <h3 className="h3">Education</h3>
            </div>
            <ol className="timeline-list">
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">University school of the arts</h4>
                <span>2007 — 2008</span>
                <p className="timeline-text">
                  Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et
                  quas molestias exceptur.
                </p>
              </li>
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">New york academy of art</h4>
                <span>2006 — 2007</span>
                <p className="timeline-text">
                  Ratione voluptatem sequi nesciunt, facere quisquams facere menda ossimus, omnis voluptas assumenda est
                  omnis..
                </p>
              </li>
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">High school of art and design</h4>
                <span>2002 — 2004</span>
                <p className="timeline-text">
                  Duis aute irure dolor in reprehenderit in voluptate, quila voluptas mag odit aut fugit, sed consequuntur
                  magni dolores eos.
                </p>
              </li>
            </ol>
          </section>

          <section className="timeline">
            <div className="title-wrapper">
              <div className="icon-box">
                <ion-icon name="book-outline" suppressHydrationWarning></ion-icon>
              </div>
              <h3 className="h3">Experience</h3>
            </div>
            <ol className="timeline-list">
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Creative director</h4>
                <span>2015 — Present</span>
                <p className="timeline-text">
                  Nemo enim ipsam voluptatem blanditiis praesentium voluptum delenit atque corrupti, quos dolores et qvuas
                  molestias exceptur.
                </p>
              </li>
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Art director</h4>
                <span>2013 — 2015</span>
                <p className="timeline-text">
                  Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et
                  quas molestias exceptur.
                </p>
              </li>
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Web designer</h4>
                <span>2010 — 2013</span>
                <p className="timeline-text">
                  Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et
                  quas molestias exceptur.
                </p>
              </li>
            </ol>
          </section>

          <section className="skill">
            <h3 className="h3 skills-title">My skills</h3>
            <ul className="skills-list content-card">
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Web design</h5>
                  <data value="80">80%</data>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill" style={{ width: '80%' }}></div>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Graphic design</h5>
                  <data value="70">70%</data>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill" style={{ width: '70%' }}></div>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Branding</h5>
                  <data value="90">90%</data>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill" style={{ width: '90%' }}></div>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">WordPress</h5>
                  <data value="50">50%</data>
                </div>
                <div className="skill-progress-bg">
                  <div className="skill-progress-fill" style={{ width: '50%' }}></div>
                </div>
              </li>
            </ul>
          </section>
        </article>

        {/* Portfolio Section */}
        <article className="portfolio" data-page="portfolio">
          <header>
            <h2 className="h2 article-title">Portfolio</h2>
          </header>

          <section className="projects">
            <ul className="filter-list">
              <li className="filter-item">
                <button className="active" data-filter-btn>All</button>
              </li>
              <li className="filter-item">
                <button data-filter-btn>Web design</button>
              </li>
              <li className="filter-item">
                <button data-filter-btn>Applications</button>
              </li>
              <li className="filter-item">
                <button data-filter-btn>Web development</button>
              </li>
            </ul>



            <ul className="project-list">
              {/* Web Development Projects */}
              <li className="project-item active" data-filter-item data-category="web development">
                <a href="/product/finance">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-1.jpg" alt="finance" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Finance</h3>
                  <p className="project-category">Web development</p>
                </a>
              </li>

              <li className="project-item active" data-filter-item data-category="web development">
                <a href="/product/orizon">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-2.png" alt="orizon" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Orizon</h3>
                  <p className="project-category">Web development</p>
                </a>
              </li>

              <li className="project-item active" data-filter-item data-category="web development">
                <a href="/product/summary">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-7.png" alt="summary" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Summary</h3>
                  <p className="project-category">Web development</p>
                </a>
              </li>

              <li className="project-item active" data-filter-item data-category="web development">
                <a href="/product/arrival">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-9.png" alt="arrival" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Arrival</h3>
                  <p className="project-category">Web development</p>
                </a>
              </li>

              {/* Web Design Projects */}
              <li className="project-item active" data-filter-item data-category="web design">
                <a href="/product/fundo">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-3.jpg" alt="fundo" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Fundo</h3>
                  <p className="project-category">Web design</p>
                </a>
              </li>

              <li className="project-item active" data-filter-item data-category="web design">
                <a href="/product/dsm">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-5.png" alt="dsm." loading="lazy" />
                  </figure>
                  <h3 className="project-title">DSM.</h3>
                  <p className="project-category">Web design</p>
                </a>
              </li>

              <li className="project-item active" data-filter-item data-category="web design">
                <a href="/product/metaspark">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-6.png" alt="metaspark" loading="lazy" />
                  </figure>
                  <h3 className="project-title">MetaSpark</h3>
                  <p className="project-category">Web design</p>
                </a>
              </li>

              {/* Applications Projects */}
              <li className="project-item active" data-filter-item data-category="applications">
                <a href="/product/brawlhalla">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-4.png" alt="brawlhalla" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Brawlhalla</h3>
                  <p className="project-category">Applications</p>
                </a>
              </li>

              <li className="project-item active" data-filter-item data-category="applications">
                <a href="/product/task-manager">
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                    </div>
                    <img src="/assets/images/project-8.jpg" alt="task manager" loading="lazy" />
                  </figure>
                  <h3 className="project-title">Task Manager</h3>
                  <p className="project-category">Applications</p>
                </a>
              </li>

              {/* Dynamic Projects */}
              {dynamicProjects.map((project: any) => (
                <li key={project.slug} className="project-item active" data-filter-item data-category={project.category.toLowerCase()}>
                  <a href={`/product/${project.slug}`}>
                    <figure className="project-img">
                      <div className="project-item-icon-box">
                        <ion-icon name="eye-outline" suppressHydrationWarning></ion-icon>
                      </div>
                      <img src={project.image} alt={project.title} loading="lazy" />
                    </figure>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-category">{project.category}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Blog Section */}
        <article className="blog" data-page="blog">
          <header>
            <h2 className="h2 article-title">Blog</h2>
          </header>

          <section className="blog-posts">
            <ul className="blog-posts-list">
              <li className="blog-post-item">
                <a href="/blog/design-conferences-in-2022">
                  <figure className="blog-banner-box">
                    <img src="/assets/images/blog-1.jpg" alt="Design conferences in 2022" loading="lazy" />
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <p className="blog-category">Design</p>
                      <span className="dot"></span>
                      <time dateTime="2022-02-23">Fab 23, 2022</time>
                    </div>
                    <h3 className="h3 blog-item-title">Design conferences in 2022</h3>
                    <p className="blog-text">
                      Veritatis et quasi architecto beatae vitae dicta sunt, explicabo.
                    </p>
                  </div>
                </a>
              </li>

              <li className="blog-post-item">
                <a href="/blog/best-fonts-every-designer">
                  <figure className="blog-banner-box">
                    <img src="/assets/images/blog-2.jpg" alt="Best fonts every designer" loading="lazy" />
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <p className="blog-category">Design</p>
                      <span className="dot"></span>
                      <time dateTime="2022-02-23">Fab 23, 2022</time>
                    </div>
                    <h3 className="h3 blog-item-title">Best fonts every designer</h3>
                    <p className="blog-text">
                      Sed ut perspiciatis, nam libero tempore, cum soluta nobis est eligendi.
                    </p>
                  </div>
                </a>
              </li>

              <li className="blog-post-item">
                <a href="/blog/design-digest-80">
                  <figure className="blog-banner-box">
                    <img src="/assets/images/blog-3.jpg" alt="Design digest #80" loading="lazy" />
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <p className="blog-category">Design</p>
                      <span className="dot"></span>
                      <time dateTime="2022-02-23">Fab 23, 2022</time>
                    </div>
                    <h3 className="h3 blog-item-title">Design digest #80</h3>
                    <p className="blog-text">
                      Excepteur sint occaecat cupidatat no proident, quis nostrum exercitationem ullam corporis suscipit.
                    </p>
                  </div>
                </a>
              </li>

              <li className="blog-post-item">
                <a href="/blog/ui-interactions-of-the-week">
                  <figure className="blog-banner-box">
                    <img src="/assets/images/blog-4.jpg" alt="UI interactions of the week" loading="lazy" />
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <p className="blog-category">Design</p>
                      <span className="dot"></span>
                      <time dateTime="2022-02-23">Fab 23, 2022</time>
                    </div>
                    <h3 className="h3 blog-item-title">UI interactions of the week</h3>
                    <p className="blog-text">
                      Enim ad minim veniam, consectetur adipiscing elit, quis nostrud exercitation ullamco laboris nisi.
                    </p>
                  </div>
                </a>
              </li>

              <li className="blog-post-item">
                <a href="/blog/the-forgotten-art-of-spacing">
                  <figure className="blog-banner-box">
                    <img src="/assets/images/blog-5.jpg" alt="The forgotten art of spacing" loading="lazy" />
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <p className="blog-category">Design</p>
                      <span className="dot"></span>
                      <time dateTime="2022-02-23">Fab 23, 2022</time>
                    </div>
                    <h3 className="h3 blog-item-title">The forgotten art of spacing</h3>
                    <p className="blog-text">
                      Maxime placeat, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </a>
              </li>

              <li className="blog-post-item">
                <a href="/blog/design-digest-79">
                  <figure className="blog-banner-box">
                    <img src="/assets/images/blog-6.jpg" alt="Design digest #79" loading="lazy" />
                  </figure>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <p className="blog-category">Design</p>
                      <span className="dot"></span>
                      <time dateTime="2022-02-23">Fab 23, 2022</time>
                    </div>
                    <h3 className="h3 blog-item-title">Design digest #79</h3>
                    <p className="blog-text">
                      Optio cumque nihil impedit uo minus quod maxime placeat, velit esse cillum.
                    </p>
                  </div>
                </a>
              </li>

              {/* Dynamic Blogs */}
              {dynamicBlogs.map((blog: any) => (
                <li key={blog.slug} className="blog-post-item">
                  <a href={`/blog/${blog.slug}`}>
                    <figure className="blog-banner-box">
                      <img src={blog.image} alt={blog.title} loading="lazy" />
                    </figure>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <p className="blog-category">{blog.category}</p>
                        <span className="dot"></span>
                        <time dateTime={blog.date}>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                      </div>
                      <h3 className="h3 blog-item-title">{blog.title}</h3>
                      <p className="blog-text">
                        {blog.excerpt}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Contact Section */}
        <article className="contact" data-page="contact">
          <header>
            <h2 className="h2 article-title">Contact</h2>
          </header>

          <section className="mapbox" data-mapbox>
            <figure>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d199666.5651251294!2d-121.58334177520186!3d38.56165006739519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac672b28397f9%3A0x921f6aaa74197fdb!2sSacramento%2C%20CA%2C%20USA!5e0!3m2!1sen!2sbd!4v1647608789441!5m2!1sen!2sbd"
                width="400" height="300" loading="lazy">
              </iframe>
            </figure>
          </section>

          <section className="contact-form">
            <h3 className="h3 form-title">Contact Form</h3>
            <form action="#" className="form" data-form>
              <div className="input-wrapper">
                <input type="text" name="fullname" className="form-input" placeholder="Full name" required data-form-input />
                <input type="email" name="email" className="form-input" placeholder="Email address" required data-form-input />
              </div>
              <textarea name="message" className="form-input" placeholder="Your Message" required data-form-input></textarea>
              <button className="form-btn" type="submit" disabled data-form-btn>
                <ion-icon name="paper-plane" suppressHydrationWarning></ion-icon>
                <span>Send Message</span>
              </button>
            </form>
          </section>
        </article>
      </div>
    </main>
  )
}
