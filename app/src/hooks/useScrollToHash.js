import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [hash])
}
