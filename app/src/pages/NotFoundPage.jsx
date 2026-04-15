import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage({ theme }) {
  const d = theme === 'dark'

  return (
    <>
      <Helmet>
        <title>Page Not Found — MedAscend</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <h1 className={`text-8xl font-bold mb-4 ${d ? 'text-teal' : 'text-teal-deep'}`}>404</h1>
          <h2 className={`text-2xl font-semibold mb-4 ${d ? 'text-cream' : 'text-dark'}`}>
            Page Not Found
          </h2>
          <p className={`text-lg mb-8 ${d ? 'text-cream/70' : 'text-dark/70'}`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-cream rounded-xl font-semibold hover:bg-teal-deep transition-colors"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </section>
    </>
  )
}
