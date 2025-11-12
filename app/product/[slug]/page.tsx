'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const products = [
  {
    slug: 'finance',
    title: 'Finance',
    category: 'Web development',
    image: '/assets/images/project-1.jpg',
    description: 'A comprehensive financial management web application designed to help users track their expenses, investments, and financial goals. Built with modern web technologies for optimal performance and user experience.'
  },
  {
    slug: 'orizon',
    title: 'Orizon',
    category: 'Web development',
    image: '/assets/images/project-2.png',
    description: 'An innovative platform for horizon planning and strategic development. Features advanced analytics and visualization tools to help businesses plan for the future.'
  },
  {
    slug: 'fundo',
    title: 'Fundo',
    category: 'Web design',
    image: '/assets/images/project-3.jpg',
    description: 'A creative web design project focused on modern UI/UX principles. Showcases responsive design techniques and beautiful visual elements.'
  },
  {
    slug: 'brawlhalla',
    title: 'Brawlhalla',
    category: 'Applications',
    image: '/assets/images/project-4.png',
    description: 'A mobile application for competitive gaming. Features real-time matchmaking, leaderboards, and social features for gamers.'
  },
  {
    slug: 'dsm',
    title: 'DSM.',
    category: 'Web design',
    image: '/assets/images/project-5.png',
    description: 'Digital Service Management platform with intuitive design and powerful features for managing digital services and workflows.'
  },
  {
    slug: 'metaspark',
    title: 'MetaSpark',
    category: 'Web design',
    image: '/assets/images/project-6.png',
    description: 'A cutting-edge web design project incorporating meta elements and spark animations. Demonstrates advanced CSS techniques and modern design trends.'
  },
  {
    slug: 'summary',
    title: 'Summary',
    category: 'Web development',
    image: '/assets/images/project-7.png',
    description: 'A data summarization and reporting web application. Processes large datasets and presents insights in clear, actionable formats.'
  },
  {
    slug: 'task-manager',
    title: 'Task Manager',
    category: 'Applications',
    image: '/assets/images/project-8.jpg',
    description: 'A comprehensive task management application with features like project tracking, team collaboration, and deadline management.'
  },
  {
    slug: 'arrival',
    title: 'Arrival',
    category: 'Web development',
    image: '/assets/images/project-9.png',
    description: 'A web platform for managing arrivals and scheduling. Perfect for businesses dealing with time-sensitive operations and logistics.'
  }
]

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  const product = products.find(p => p.slug === slug)

  if (!product) {
    return (
      <main style={{ margin: '15px 12px', marginBottom: '75px', minWidth: '259px' }} suppressHydrationWarning>
        <div style={{
          background: 'var(--eerie-black-2)',
          border: '1px solid var(--jet)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: 'var(--shadow-1)',
          marginBottom: '15px'
        }}>
          <h2 style={{
            color: 'var(--white-2)',
            fontSize: 'var(--fs-1)',
            fontWeight: 'var(--fw-600)',
            marginBottom: '20px',
            position: 'relative',
            paddingBottom: '15px'
          }}>
            Product Not Found
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

          <Link href="/" style={{
            color: 'var(--orange-yellow-crayola)',
            textDecoration: 'none',
            fontSize: 'var(--fs-6)',
            fontWeight: 'var(--fw-300)'
          }}>
            ← Back to Portfolio
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
        <h1 style={{
          color: 'var(--white-2)',
          fontSize: 'var(--fs-1)',
          fontWeight: 'var(--fw-600)',
          marginBottom: '20px',
          position: 'relative',
          paddingBottom: '15px'
        }}>
          {product.title}
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

        <Link href="/" style={{
          color: 'var(--orange-yellow-crayola)',
          textDecoration: 'none',
          fontSize: 'var(--fs-6)',
          fontWeight: 'var(--fw-300)',
          marginBottom: '30px',
          display: 'inline-block'
        }}>
          ← Back to Portfolio
        </Link>

        <div style={{ marginBottom: '30px' }} suppressHydrationWarning>
          <figure style={{
            width: '100%',
            height: '300px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '20px',
            position: 'relative',
            background: 'var(--eerie-black-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </figure>

          <div suppressHydrationWarning>
            <p style={{
              color: 'var(--light-gray-70)',
              fontSize: 'var(--fs-6)',
              fontWeight: 'var(--fw-300)',
              marginBottom: '15px'
            }}>
              {product.category}
            </p>
            <p style={{
              color: 'var(--light-gray)',
              fontSize: 'var(--fs-6)',
              fontWeight: 'var(--fw-300)',
              lineHeight: 1.6,
              marginBottom: '25px'
            }}>
              {product.description}
            </p>

            <Link href={`/checkout?product=${slug}`} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  position: 'relative',
                  width: 'auto',
                  background: 'var(--border-gradient-onyx)',
                  color: 'var(--orange-yellow-crayola)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 20px',
                  borderRadius: '14px',
                  fontSize: 'var(--fs-6)',
                  textTransform: 'capitalize',
                  boxShadow: 'var(--shadow-3)',
                  zIndex: 1,
                  transition: 'var(--transition-1)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-gradient-yellow-1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--border-gradient-onyx)';
                }}
              >
                <span style={{
                  position: 'absolute',
                  inset: '1px',
                  borderRadius: 'inherit',
                  background: 'var(--bg-gradient-jet)',
                  transition: 'var(--transition-1)',
                  zIndex: -1
                }}></span>
                <span style={{ position: 'relative', zIndex: 1 }}>Order Now</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
