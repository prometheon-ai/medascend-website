import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowLeft, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ArenaWalletPanel from '../components/ArenaWalletPanel'

export default function ArenaWalletPage({ onAuth }) {
  const { token, loading: authLoading } = useAuth()
  const activeToken = token || localStorage.getItem('access_token')

  return (
    <>
      <Helmet>
        <title>Wallet — MedAscend Arena</title>
        <meta name="description" content="Top up your Arena wallet, check balances, and review wallet transactions." />
      </Helmet>

      <div className="pt-17 min-h-screen bg-dark">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              to="/arena"
              className="inline-flex items-center gap-2 text-xs text-sky/50 hover:text-teal transition-colors no-underline"
            >
              <ArrowLeft size={14} />
              Back to Arena
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal/15 bg-dark-card px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal/70">
              <Wallet size={14} />
              Wallet
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-cream tracking-tight">Arena Wallet</h1>
            <p className="mt-2 text-sm font-family-secondary text-sky/70">
              Top up money here, then come back to Arena to register for quizzes.
            </p>
          </div>

          {!authLoading && !activeToken ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center rounded-3xl border border-teal/10 bg-dark-card">
              <Wallet size={40} className="text-teal/40" />
              <div>
                <p className="text-lg font-bold text-cream mb-2">Login to access your wallet</p>
                <p className="text-sm text-sky/60">Sign in first, then open the wallet to add money.</p>
              </div>
              <button
                onClick={onAuth}
                className="px-8 py-3 bg-teal text-cream font-bold text-sm rounded-xl hover:bg-teal/90 transition-all cursor-pointer border-none"
              >
                Login / Register
              </button>
            </div>
          ) : (
            <ArenaWalletPanel token={activeToken} onAuth={onAuth} />
          )}
        </div>
      </div>
    </>
  )
}