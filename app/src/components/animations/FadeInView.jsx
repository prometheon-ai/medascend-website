import { motion } from 'framer-motion'

const directionMap = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
}

export default function FadeInView({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  className = '',
}) {
  const offset = directionMap[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset, filter: 'blur(4px)' }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
      }}
      viewport={{ once, margin: '-10%' }}
    >
      {children}
    </motion.div>
  )
}
