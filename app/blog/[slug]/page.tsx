'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const blogPosts = [
  {
    slug: 'design-conferences-in-2022',
    title: 'Design conferences in 2022',
    category: 'Design',
    date: '2022-02-23',
    image: '/assets/images/blog-1.jpg',
    content: `
      <p>The design world has always been dynamic, but 2022 brought unprecedented changes and innovations that reshaped how we approach creative work. From virtual conferences to hybrid experiences, the year marked a significant evolution in how designers connect, learn, and collaborate.</p>

      <h2>The Rise of Virtual Design Communities</h2>
      <p>With the continued impact of global events, virtual conferences became the norm rather than the exception. Platforms like Figma, Adobe, and specialized design communities hosted immersive online experiences that brought together thousands of designers from around the world.</p>

      <p>These virtual spaces offered not only keynote presentations but also interactive workshops, networking opportunities, and real-time collaboration sessions that transcended geographical boundaries.</p>

      <h2>Key Trends That Defined 2022</h2>
      <ul>
        <li><strong>Sustainable Design:</strong> A growing emphasis on eco-friendly practices and materials</li>
        <li><strong>Inclusive Design:</strong> Focus on accessibility and universal design principles</li>
        <li><strong>AI Integration:</strong> How artificial intelligence is augmenting creative workflows</li>
        <li><strong>Remote Collaboration:</strong> Tools and methodologies for distributed design teams</li>
      </ul>

      <h2>Looking Forward</h2>
      <p>As we move beyond 2022, the lessons learned from these conferences continue to influence how we approach design education and professional development. The hybrid model that emerged combines the best of both physical and virtual experiences.</p>

      <p>The design community has proven its resilience and adaptability, emerging stronger and more connected than ever before.</p>
    `
  },
  {
    slug: 'best-fonts-every-designer',
    title: 'Best fonts every designer',
    category: 'Design',
    date: '2022-02-23',
    image: '/assets/images/blog-2.jpg',
    content: `
      <p>Typography is the foundation of good design. The right typeface can elevate your work from ordinary to extraordinary. In this comprehensive guide, we'll explore the essential fonts that every designer should have in their toolkit.</p>

      <h2>The Classics: Timeless Typefaces</h2>
      <p>Some fonts never go out of style. These classic typefaces have stood the test of time and continue to be relevant in modern design:</p>

      <h3>Helvetica</h3>
      <p>The Swiss Army knife of typefaces. Helvetica's clean, neutral design makes it incredibly versatile. It's perfect for both headlines and body text, and its legibility across different sizes and mediums is unmatched.</p>

      <h3>Times New Roman</h3>
      <p>While often associated with formal documents, Times New Roman offers excellent readability and a timeless aesthetic. Its serif design provides good contrast for printed materials.</p>

      <h2>Modern Workhorses</h2>
      <p>Contemporary fonts that have become staples in modern design:</p>

      <h3>Inter</h3>
      <p>Designed specifically for user interfaces, Inter offers excellent readability on screens. Its open shapes and carefully balanced proportions make it ideal for digital design.</p>

      <h3>Source Sans Pro</h3>
      <p>Another excellent choice for digital interfaces, Source Sans Pro provides a clean, professional look with good readability at small sizes.</p>

      <h2>Display Fonts for Impact</h2>
      <p>When you need to make a statement, these display fonts deliver:</p>

      <h3>Bold, decorative typefaces</h3>
      <p>Fonts like Playfair Display or Oswald can add personality and impact to headlines and branding elements.</p>

      <h2>Building Your Font Library</h2>
      <p>Start with a core set of versatile fonts, then expand based on your specific design needs. Remember that quality fonts are an investment in your design work, and having the right tools can make all the difference in your projects.</p>

      <p>The key is balance – mix classic reliability with modern versatility to create designs that stand the test of time.</p>
    `
  },
  {
    slug: 'design-digest-80',
    title: 'Design digest #80',
    category: 'Design',
    date: '2022-02-23',
    image: '/assets/images/blog-3.jpg',
    content: `
      <p>Welcome to Design Digest #80! This edition brings you the latest trends, tools, and insights shaping the design world. From cutting-edge AI tools to sustainable design practices, we've curated the most important developments you need to know about.</p>

      <h2>AI-Powered Design Tools</h2>
      <p>Artificial intelligence continues to revolutionize design workflows. New tools are emerging that can generate concepts, optimize layouts, and even predict user preferences.</p>

      <p>While AI won't replace human creativity, it serves as a powerful assistant that can accelerate the design process and explore possibilities that might not have been considered otherwise.</p>

      <h2>Sustainable Design Practices</h2>
      <p>Environmental consciousness is becoming a core consideration in design decisions. From choosing eco-friendly materials to designing for longevity, sustainable practices are no longer optional.</p>

      <ul>
        <li>Material selection with environmental impact in mind</li>
        <li>Designing for durability and repairability</li>
        <li>Minimizing waste in production processes</li>
        <li>Considering the full lifecycle of products</li>
      </ul>

      <h2>The Hybrid Work Revolution</h2>
      <p>As remote and hybrid work models become standard, design challenges have evolved. We're seeing new patterns emerge in digital collaboration tools, virtual meeting spaces, and distributed team communication.</p>

      <p>Designers are creating solutions that bridge physical and digital experiences, making hybrid work not just functional but enjoyable.</p>

      <h2>Emerging Technologies</h2>
      <p>From Web3 interfaces to AR/VR experiences, new technologies are creating exciting opportunities for designers. Understanding these emerging platforms will be crucial for staying ahead in the field.</p>

      <h2>Community and Education</h2>
      <p>The design community continues to grow and diversify. Online learning platforms, design challenges, and community-driven initiatives are making design education more accessible than ever.</p>

      <p>Remember, the most important tool in any designer's arsenal is curiosity. Stay curious, keep learning, and continue pushing the boundaries of what's possible.</p>
    `
  },
  {
    slug: 'ui-interactions-of-the-week',
    title: 'UI interactions of the week',
    category: 'Design',
    date: '2022-02-23',
    image: '/assets/images/blog-4.jpg',
    content: `
      <p>User interface interactions are the heartbeat of digital experiences. This week, we're highlighting some of the most innovative and delightful interactions that are pushing the boundaries of what's possible in web and mobile interfaces.</p>

      <h2>Micro-Interactions That Matter</h2>
      <p>Small details can make a big difference in user experience. We're seeing increasingly sophisticated micro-interactions that provide feedback, guide users, and add personality to interfaces.</p>

      <h3>Smart Button States</h3>
      <p>Buttons that morph, pulse, or provide contextual feedback based on user actions. These subtle animations help users understand the system state and feel more connected to the interface.</p>

      <h3>Progressive Disclosure</h3>
      <p>Interfaces that reveal information gradually, preventing cognitive overload while maintaining user engagement. This approach uses animations to smoothly transition between different states of information density.</p>

      <h2>Gesture-Based Interactions</h2>
      <p>With touch interfaces becoming ubiquitous, gesture-based interactions are becoming more sophisticated. Swipe gestures, pinch-to-zoom, and multi-touch interactions are being designed with increasing nuance.</p>

      <h2>Voice and Conversational Interfaces</h2>
      <p>Voice interactions are moving beyond simple commands to more natural, conversational experiences. The challenge lies in designing systems that feel intuitive and responsive.</p>

      <h2>Accessibility-First Interactions</h2>
      <p>Inclusive design principles are driving innovation in interaction design. We're seeing more interfaces that work seamlessly with assistive technologies and provide multiple ways to accomplish tasks.</p>

      <h2>Performance and Smoothness</h2>
      <p>As devices become more powerful, expectations for smooth, responsive interactions increase. The best interactions feel natural and immediate, with carefully tuned timing and easing functions.</p>

      <h2>The Future of Interactions</h2>
      <p>Looking ahead, we expect to see more integration of emerging technologies like eye-tracking, haptic feedback, and neural interfaces. The goal remains the same: creating interfaces that feel natural, efficient, and delightful to use.</p>

      <p>The key to great interactions lies in understanding human behavior and designing systems that align with our natural tendencies and preferences.</p>
    `
  },
  {
    slug: 'the-forgotten-art-of-spacing',
    title: 'The forgotten art of spacing',
    category: 'Design',
    date: '2022-02-23',
    image: '/assets/images/blog-5.jpg',
    content: `
      <p>In the rush to add more features, more content, and more visual elements, many designers forget one of the most powerful tools in their arsenal: space. White space, negative space, breathing room – whatever you call it, strategic use of spacing can transform mediocre designs into masterpieces.</p>

      <h2>The Psychology of Space</h2>
      <p>Humans naturally seek order and clarity. When we encounter cluttered designs, our brains work harder to process the information. Well-used white space reduces cognitive load and makes content more digestible.</p>

      <p>Space also conveys meaning. Generous spacing around important elements signals their significance, while tight spacing can create intimacy or urgency.</p>

      <h2>Types of Spacing</h2>
      <p>Understanding different types of spacing helps in applying them effectively:</p>

      <h3>Macro Spacing</h3>
      <p>The large-scale spacing between major sections and components. This creates the overall rhythm and hierarchy of your design.</p>

      <h3>Micro Spacing</h3>
      <p>The small spaces between related elements. Consistent micro spacing creates visual harmony and improves readability.</p>

      <h3>Active White Space</h3>
      <p>Intentionally placed space that serves a specific purpose, like drawing attention to a call-to-action or separating different types of content.</p>

      <h2>Spacing Systems</h2>
      <p>Successful designs often use spacing systems based on consistent units. Whether you use a 4px grid, 8px system, or modular scale, consistency is key to creating cohesive designs.</p>

      <h2>Common Spacing Mistakes</h2>
      <ul>
        <li><strong>Fear of white space:</strong> Many designers fill every available pixel, resulting in cluttered layouts</li>
        <li><strong>Inconsistent spacing:</strong> Random spacing values create visual chaos</li>
        <li><strong>Ignoring content needs:</strong> Different content types require different spacing treatments</li>
      </ul>

      <h2>Practical Applications</h2>
      <p>Spacing principles apply across all mediums:</p>

      <h3>Web Design</h3>
      <p>Use spacing to guide users through content hierarchies and improve readability.</p>

      <h3>Print Design</h3>
      <p>Strategic spacing prevents visual fatigue and enhances comprehension.</p>

      <h3>Mobile Interfaces</h3>
      <p>Proper spacing ensures touch targets are accessible and interfaces feel comfortable to use.</p>

      <h2>The Art of Subtraction</h2>
      <p>Sometimes the most powerful design decision is what you choose not to include. Embrace white space as a design element in its own right, not just as the absence of content.</p>

      <p>Mastering the art of spacing takes practice, but the results are worth it. Well-spaced designs feel more professional, readable, and trustworthy.</p>
    `
  },
  {
    slug: 'design-digest-79',
    title: 'Design digest #79',
    category: 'Design',
    date: '2022-02-23',
    image: '/assets/images/blog-6.jpg',
    content: `
      <p>Design Digest #79 brings you another curated collection of the most important design trends, tools, and insights. This edition focuses on the intersection of technology and creativity, exploring how emerging tools are reshaping design workflows.</p>

      <h2>Design Tools Evolution</h2>
      <p>The design tools landscape continues to evolve rapidly. From AI-assisted design to collaborative platforms, new technologies are changing how we approach creative work.</p>

      <h3>AI Design Assistants</h3>
      <p>Artificial intelligence is becoming an integral part of the design process. Tools that can generate layouts, suggest color palettes, and even predict user preferences are becoming more sophisticated and accessible.</p>

      <h3>Real-time Collaboration</h3>
      <p>Cloud-based design platforms are enabling seamless collaboration across time zones and disciplines. The ability to work together in real-time is transforming how design teams operate.</p>

      <h2>Cross-Disciplinary Design</h2>
      <p>Designers are increasingly working across traditional boundaries. UX designers collaborate with developers, product managers work with marketers, and the lines between disciplines continue to blur.</p>

      <p>This cross-pollination of ideas and methodologies leads to more innovative and holistic solutions.</p>

      <h2>Sustainable Design Thinking</h2>
      <p>Sustainability is no longer a buzzword – it's becoming a core consideration in design decisions. From material choices to energy-efficient interfaces, designers are thinking about the environmental impact of their work.</p>

      <h2>The Rise of Design Systems</h2>
      <p>Design systems are becoming essential for scaling design across large organizations. These comprehensive frameworks ensure consistency while allowing for flexibility and innovation.</p>

      <h2>Accessibility as Standard</h2>
      <p>Inclusive design practices are moving from nice-to-have to must-have. Designers are building accessibility considerations into their processes from the earliest stages.</p>

      <h2>Future-Proofing Design Skills</h2>
      <p>As technology evolves, so must our skills. The most successful designers are those who embrace continuous learning and adapt to new tools and methodologies.</p>

      <h2>Community and Connection</h2>
      <p>Despite the digital nature of much of our work, the importance of human connection in design cannot be overstated. Building relationships, sharing knowledge, and supporting one another remains crucial.</p>

      <p>The design community continues to demonstrate remarkable resilience and creativity. As we navigate these changing times, let's remember that our greatest strength lies in our collective passion for creating meaningful experiences.</p>
    `
  }
]

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <main style={{ margin: '15px 12px', marginBottom: '75px', minWidth: '259px' }} suppressHydrationWarning>
        <div style={{
          background: 'var(--eerie-black-2)',
          border: '1px solid var(--jet)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: 'var(--shadow-1)',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: 'var(--white-2)',
            fontSize: 'var(--fs-1)',
            fontWeight: 'var(--fw-600)',
            marginBottom: '20px',
            position: 'relative',
            paddingBottom: '15px'
          }}>
            Blog Post Not Found
            <span style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '40px',
              height: '5px',
              background: 'var(--text-gradient-yellow)',
              borderRadius: '3px'
            }}></span>
          </h2>

          <p style={{
            color: 'var(--light-gray)',
            fontSize: 'var(--fs-6)',
            marginBottom: '20px'
          }}>
            The blog post you're looking for doesn't exist.
          </p>

          <Link href="/" style={{
            color: 'var(--orange-yellow-crayola)',
            textDecoration: 'none',
            fontSize: 'var(--fs-6)',
            fontWeight: 'var(--fw-300)'
          }}>
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ margin: '15px 12px', marginBottom: '75px', minWidth: '259px' }} suppressHydrationWarning>
      <div style={{
        background: 'var(--eerie-black-2)',
        border: '1px solid var(--jet)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: 'var(--shadow-1)',
        marginBottom: '15px'
      }} suppressHydrationWarning>
        <header style={{ marginBottom: '30px' }} suppressHydrationWarning>
          <h1 style={{
            color: 'var(--white-2)',
            fontSize: 'var(--fs-1)',
            fontWeight: 'var(--fw-600)',
            marginBottom: '20px',
            position: 'relative',
            paddingBottom: '15px'
          }}>
            {post.title}
            <span style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '40px',
              height: '5px',
              background: 'var(--text-gradient-yellow)',
              borderRadius: '3px'
            }}></span>
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px'
          }} suppressHydrationWarning>
            <span style={{
              color: 'var(--orange-yellow-crayola)',
              fontSize: 'var(--fs-6)',
              fontWeight: 'var(--fw-500)'
            }}>
              {post.category}
            </span>
            <span style={{
              color: 'var(--light-gray-70)',
              fontSize: 'var(--fs-6)'
            }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </header>

        <figure style={{
          width: '100%',
          height: '400px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '30px',
          position: 'relative',
          background: 'var(--eerie-black-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </figure>

        <div
          style={{
            color: 'var(--light-gray)',
            fontSize: 'var(--fs-6)',
            lineHeight: 1.7
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
          suppressHydrationWarning
        />

        <footer style={{
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '1px solid var(--jet)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }} suppressHydrationWarning>
          <Link href="/" style={{
            color: 'var(--orange-yellow-crayola)',
            textDecoration: 'none',
            fontSize: 'var(--fs-6)',
            fontWeight: 'var(--fw-300)'
          }}>
            ← Back to Home
          </Link>

          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }} suppressHydrationWarning>
            <button style={{
              background: 'var(--border-gradient-onyx)',
              color: 'var(--orange-yellow-crayola)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: 'var(--fs-7)',
              cursor: 'pointer',
              transition: 'var(--transition-1)'
            }}>
              Share
            </button>
            <button style={{
              background: 'var(--border-gradient-onyx)',
              color: 'var(--orange-yellow-crayola)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: 'var(--fs-7)',
              cursor: 'pointer',
              transition: 'var(--transition-1)'
            }}>
              Bookmark
            </button>
          </div>
        </footer>
      </div>
    </main>
  )
}
