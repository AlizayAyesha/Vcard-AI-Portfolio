'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productSlug = searchParams.get('product')

  // Find the product based on slug (you could also pass more product data)
  const products = [
    { slug: 'finance', title: 'Finance', price: 299 },
    { slug: 'orizon', title: 'Orizon', price: 399 },
    { slug: 'fundo', title: 'Fundo', price: 199 },
    { slug: 'brawlhalla', title: 'Brawlhalla', price: 149 },
    { slug: 'dsm', title: 'DSM.', price: 349 },
    { slug: 'metaspark', title: 'MetaSpark', price: 249 },
    { slug: 'summary', title: 'Summary', price: 179 },
    { slug: 'task-manager', title: 'Task Manager', price: 129 },
    { slug: 'arrival', title: 'Arrival', price: 299 }
  ]

  const product = products.find(p => p.slug === productSlug)

  if (!product) {
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
            Checkout
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
            No product selected for checkout.
          </p>

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
      }}>
        <h1 style={{
          color: 'var(--white-2)',
          fontSize: 'var(--fs-1)',
          fontWeight: 'var(--fw-600)',
          marginBottom: '20px',
          position: 'relative',
          paddingBottom: '15px'
        }}>
          Checkout
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

        {/* Order Summary */}
        <div style={{
          background: 'var(--border-gradient-onyx)',
          padding: '20px',
          borderRadius: '14px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: 'var(--white-2)',
            fontSize: 'var(--fs-2)',
            fontWeight: 'var(--fw-500)',
            marginBottom: '15px'
          }}>
            Order Summary
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span style={{
              color: 'var(--light-gray)',
              fontSize: 'var(--fs-6)'
            }}>
              {product.title}
            </span>
            <span style={{
              color: 'var(--orange-yellow-crayola)',
              fontSize: 'var(--fs-5)',
              fontWeight: 'var(--fw-500)'
            }}>
              ${product.price}
            </span>
          </div>

          <div style={{
            borderTop: '1px solid var(--jet)',
            paddingTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              color: 'var(--white-2)',
              fontSize: 'var(--fs-5)',
              fontWeight: 'var(--fw-500)'
            }}>
              Total
            </span>
            <span style={{
              color: 'var(--orange-yellow-crayola)',
              fontSize: 'var(--fs-3)',
              fontWeight: 'var(--fw-600)'
            }}>
              ${product.price}
            </span>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{
          background: 'var(--border-gradient-onyx)',
          padding: '20px',
          borderRadius: '14px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: 'var(--white-2)',
            fontSize: 'var(--fs-2)',
            fontWeight: 'var(--fw-500)',
            marginBottom: '20px'
          }}>
            Payment Information
          </h3>

          <form style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{
                color: 'var(--light-gray)',
                fontSize: 'var(--fs-6)',
                fontWeight: 'var(--fw-500)',
                display: 'block',
                marginBottom: '8px'
              }}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--eerie-black-1)',
                  border: '1px solid var(--jet)',
                  borderRadius: '8px',
                  color: 'var(--white-2)',
                  fontSize: 'var(--fs-6)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--orange-yellow-crayola)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--jet)'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  color: 'var(--light-gray)',
                  fontSize: 'var(--fs-6)',
                  fontWeight: 'var(--fw-500)',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--eerie-black-1)',
                    border: '1px solid var(--jet)',
                    borderRadius: '8px',
                    color: 'var(--white-2)',
                    fontSize: 'var(--fs-6)',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--orange-yellow-crayola)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--jet)'}
                />
              </div>

              <div>
                <label style={{
                  color: 'var(--light-gray)',
                  fontSize: 'var(--fs-6)',
                  fontWeight: 'var(--fw-500)',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--eerie-black-1)',
                    border: '1px solid var(--jet)',
                    borderRadius: '8px',
                    color: 'var(--white-2)',
                    fontSize: 'var(--fs-6)',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--orange-yellow-crayola)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--jet)'}
                />
              </div>
            </div>

            <div>
              <label style={{
                color: 'var(--light-gray)',
                fontSize: 'var(--fs-6)',
                fontWeight: 'var(--fw-500)',
                display: 'block',
                marginBottom: '8px'
              }}>
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--eerie-black-1)',
                  border: '1px solid var(--jet)',
                  borderRadius: '8px',
                  color: 'var(--white-2)',
                  fontSize: 'var(--fs-6)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--orange-yellow-crayola)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--jet)'}
              />
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button
            style={{
              position: 'relative',
              flex: 1,
              background: 'var(--border-gradient-onyx)',
              color: 'var(--orange-yellow-crayola)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 20px',
              borderRadius: '14px',
              fontSize: 'var(--fs-6)',
              textTransform: 'capitalize',
              boxShadow: 'var(--shadow-3)',
              zIndex: 1,
              transition: 'var(--transition-1)',
              border: 'none',
              cursor: 'pointer',
              minWidth: '150px'
            }}
            onClick={() => {
              // Store order in localStorage
              const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
              const newOrder = {
                id: Date.now().toString(),
                product: product.title,
                price: product.price,
                date: new Date().toLocaleDateString()
              }
              existingOrders.push(newOrder)
              localStorage.setItem('orders', JSON.stringify(existingOrders))

              alert('Payment processed successfully! Thank you for your order.');
              window.location.href = '/';
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
            <span style={{ position: 'relative', zIndex: 1 }}>Complete Payment</span>
          </button>

          <Link href={`/product/${productSlug}`} style={{
            flex: 1,
            textDecoration: 'none',
            minWidth: '150px'
          }}>
            <button
              style={{
                width: '100%',
                background: 'transparent',
                color: 'var(--light-gray)',
                border: '1px solid var(--jet)',
                padding: '16px 20px',
                borderRadius: '14px',
                fontSize: 'var(--fs-6)',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'var(--transition-1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--orange-yellow-crayola)';
                e.currentTarget.style.color = 'var(--orange-yellow-crayola)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--jet)';
                e.currentTarget.style.color = 'var(--light-gray)';
              }}
            >
              Back to Product
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
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
            Checkout
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
            Loading...
          </p>
        </div>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
