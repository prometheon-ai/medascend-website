import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowUpRight, Loader2, Plus, RefreshCw, Wallet } from 'lucide-react'
import {
  createWalletTopUpOrder,
  formatRupees,
  getArenaWalletSummary,
  getArenaWalletTransactions,
  loadRazorpayCheckoutScript,
} from '../lib/api'

function moneyLabel(data, rupeeKey, paiseKey) {
  if (data?.[rupeeKey] !== undefined && data?.[rupeeKey] !== null) {
    const value = Number(data[rupeeKey])
    if (Number.isFinite(value)) return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  }

  if (data?.[paiseKey] !== undefined && data?.[paiseKey] !== null) {
    return formatRupees(data[paiseKey])
  }

  return '₹0'
}

function moneyLabelFromKeys(data, rupeeKeys = [], paiseKeys = []) {
  for (const key of rupeeKeys) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      const value = Number(data[key])
      if (Number.isFinite(value)) return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    }
  }

  for (const key of paiseKeys) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      return formatRupees(data[key])
    }
  }

  return '₹0'
}

function getNumericMoney(data, keys = []) {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      const value = Number(data[key])
      if (Number.isFinite(value)) return value
    }
  }
  return null
}

function parseTransactionLabel(entry) {
  return entry?.type || entry?.category || entry?.kind || entry?.title || 'transaction'
}

function parseTransactionAmount(entry) {
  if (entry?.amount_rupees !== undefined && entry?.amount_rupees !== null) {
    const value = Number(entry.amount_rupees)
    if (Number.isFinite(value)) return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  }
  if (entry?.amount_paise !== undefined && entry?.amount_paise !== null) {
    return formatRupees(entry.amount_paise)
  }
  if (entry?.amount !== undefined && entry?.amount !== null) {
    const value = Number(entry.amount)
    if (Number.isFinite(value)) {
      const shouldTreatAsPaise = entry?.amount_unit !== 'rupees' && entry?.currency !== 'RUPEES'
      return shouldTreatAsPaise
        ? formatRupees(value)
        : `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    }
  }
  return '—'
}

function parseTransactionMeta(entry) {
  return entry?.status || entry?.description || entry?.note || entry?.reference || ''
}

function parseTransactionDate(entry) {
  return entry?.created_at || entry?.createdAt || entry?.updated_at || entry?.updatedAt || null
}

export default function ArenaWalletPanel({ token, onAuth, refreshSeed = 0, onWalletChanged }) {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [amountRupees, setAmountRupees] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const canUseWallet = Boolean(token)

  const loadWallet = async ({ silent = false } = {}) => {
    if (!token) return
    if (silent) setRefreshing(true)
    else setLoading(true)

    setError('')
    try {
      const [summary, tx] = await Promise.all([
        getArenaWalletSummary(token),
        getArenaWalletTransactions(token, { page: 1, page_size: 10 }),
      ])
      setWallet(summary)
      setTransactions(Array.isArray(tx) ? tx : tx?.transactions ?? tx?.items ?? tx?.results ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load wallet.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshSeed])

  const summaryRows = useMemo(() => ([
    {
      label: 'Locked Deposit',
      value: moneyLabelFromKeys(wallet, ['deposit_rupees', 'deposit_balance_rupees'], ['deposit_paise', 'deposit_balance_paise']),
    },
    {
      label: 'Withdrawable Winnings',
      value: moneyLabelFromKeys(wallet, ['winnings_rupees', 'winnings_balance_rupees'], ['winnings_paise', 'winnings_balance_paise']),
    },
    {
      label: 'Total',
      value: (() => {
        const balanceValue = getNumericMoney(wallet, ['balance_paise', 'balance', 'balance_rupees'])
        if (balanceValue && balanceValue > 0) {
          return wallet?.balance_rupees !== undefined
            ? `₹${Number(wallet.balance_rupees).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
            : formatRupees(balanceValue)
        }

        const depositValue = getNumericMoney(wallet, ['deposit_paise', 'deposit_balance_paise', 'deposit']) || 0
        const winningsValue = getNumericMoney(wallet, ['winnings_paise', 'winnings_balance_paise', 'winnings']) || 0
        return formatRupees(depositValue + winningsValue)
      })(),
    },
    {
      label: 'Withdrawable Total',
      value: moneyLabelFromKeys(wallet, ['withdrawable_rupees', 'withdrawable_balance_rupees'], ['withdrawable_paise', 'withdrawable_balance_paise']),
    },
  ]), [wallet])

  const refreshWallet = async () => {
    await loadWallet({ silent: true })
  }

  const [disabledNotice, setDisabledNotice] = useState(false)

  const openTopUp = () => {
    setDisabledNotice(true)
  }

  const handleTopUp = async (event) => {
    event.preventDefault()
    if (!token) {
      onAuth?.()
      return
    }

    const parsedAmount = Number(amountRupees)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setSubmitError('Enter a valid amount in rupees.')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    setStatusMessage('Creating Razorpay order...')

    try {
      const order = await createWalletTopUpOrder(token, parsedAmount)
      const isLoaded = await loadRazorpayCheckoutScript()
      if (!isLoaded || typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay checkout could not be loaded.')
      }

      const razorpay = new window.Razorpay({
        key: order.razorpay_key,
        amount: order.amount_paise,
        currency: order.currency || 'INR',
        order_id: order.order_id,
        name: 'MedAscend',
        description: 'Wallet top-up',
        notes: {
          purpose: 'wallet_topup',
        },
        theme: {
          color: '#2c8d7b',
        },
        handler: async () => {
          setStatusMessage('Payment completed. Waiting for wallet settlement.')
          await refreshWallet()
          window.setTimeout(() => {
            refreshWallet().catch(() => {})
            onWalletChanged?.()
          }, 1500)
          setModalOpen(false)
        },
        modal: {
          ondismiss: () => {
            setStatusMessage('Payment popup closed.')
          },
        },
      })

      razorpay.open()
      setStatusMessage('Checkout opened. Complete the payment to add money.')
    } catch (err) {
      setSubmitError(err.message || 'Unable to start payment right now.')
      setStatusMessage('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mb-8 rounded-3xl border border-teal/15 bg-dark-card p-5 md:p-6 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal/10 border border-teal/20">
              <Wallet size={20} className="text-teal" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal/70">Arena Wallet</p>
              <h2 className="text-lg font-extrabold text-cream">Top up, register, and compete</h2>
            </div>
          </div>

          {statusMessage && <p className="mt-3 text-xs font-medium text-sky/60">{statusMessage}</p>}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refreshWallet}
            disabled={!canUseWallet || loading || refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-teal/20 px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-teal/40 hover:bg-teal/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openTopUp}
            disabled={!canUseWallet}
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-bold text-cream transition-all hover:bg-teal/90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={15} />
            Add Money
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-3 text-sm text-sky/50">
          <Loader2 size={18} className="animate-spin" />
          Loading wallet...
        </div>
      ) : error ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {summaryRows.map((row) => (
              <div key={row.label} className="rounded-2xl border border-teal/10 bg-dark-surface/80 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky/40">{row.label}</p>
                <p className="mt-2 text-lg font-extrabold text-cream tabular-nums">{row.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-teal/10 bg-dark-surface/40">
            <div className="flex items-center justify-between border-b border-teal/10 px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-sky/60">Recent Transactions</h3>
              <span className="text-xs text-sky/40">Last 10 entries</span>
            </div>
            {transactions.length > 0 ? (
              <div className="divide-y divide-teal/5">
                {transactions.map((entry, index) => {
                  const date = parseTransactionDate(entry)
                  return (
                    <div key={entry.id || entry._id || `${parseTransactionLabel(entry)}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-cream">{parseTransactionLabel(entry)}</p>
                        <p className="mt-1 text-xs text-sky/45">{parseTransactionMeta(entry) || date || '—'}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                        <span className="text-sm font-bold text-cream tabular-nums">{parseTransactionAmount(entry)}</span>
                        {date && (
                          <span className="text-[11px] text-sky/40">
                            {new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-sky/45">No wallet transactions yet.</div>
            )}
          </div>
        </>
      )}

      {disabledNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDisabledNotice(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-3xl border border-teal/20 bg-dark-card p-6 shadow-2xl shadow-black/50 text-center">
            <p className="text-lg font-extrabold text-cream mb-2">Temporarily Disabled</p>
            <p className="text-sm text-sky/60 mb-5">Wallet top-ups are currently unavailable. Please check back soon.</p>
            <button
              type="button"
              onClick={() => setDisabledNotice(false)}
              className="px-6 py-2.5 rounded-xl bg-teal text-cream text-sm font-bold hover:bg-teal/90 transition-colors cursor-pointer border-none"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close top up modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && setModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-teal/20 bg-dark-card p-6 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal/70">Wallet Top-Up</p>
                <h3 className="mt-1 text-xl font-extrabold text-cream">Add money with Razorpay</h3>
              </div>
              <button
                type="button"
                onClick={() => !submitting && setModalOpen(false)}
                className="rounded-full border border-teal/15 px-3 py-1 text-xs font-semibold text-sky/50 transition-colors hover:border-teal/30 hover:text-cream"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-sky/50">Amount in rupees</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  inputMode="decimal"
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(e.target.value)}
                  placeholder="199"
                  className="w-full rounded-2xl border border-teal/15 bg-dark-surface px-4 py-3 text-base text-cream outline-none transition-colors placeholder:text-sky/25 focus:border-teal/40"
                />
              </label>

              <p className="text-xs leading-relaxed text-sky/45">
                The backend creates the Razorpay order, then the webhook credits your wallet after payment capture.
              </p>

              {submitError && (
                <div className="flex items-start gap-2 rounded-2xl border border-terracotta/20 bg-terracotta/5 px-4 py-3 text-sm text-terracotta">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !submitting && setModalOpen(false)}
                  className="flex-1 rounded-xl border border-teal/15 px-4 py-3 text-sm font-semibold text-cream transition-colors hover:border-teal/30 hover:bg-teal/10 disabled:opacity-60"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-teal px-4 py-3 text-sm font-bold text-cream transition-all hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Processing
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      Continue
                      <ArrowUpRight size={16} />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}