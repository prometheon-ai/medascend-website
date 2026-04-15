import { motion } from 'framer-motion'

export default function AnimatedText({
  text,
  mode = 'word',
  stagger = 0.05,
  delay = 0,
  className = '',
  once = true,
  as: Tag = 'p',
}) {
  const MotionTag = motion.create(Tag)
  const items = mode === 'word' ? text.split(' ') : text.split('')
  const separator = mode === 'word' ? '\u00A0' : ''

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-10%' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
            },
          }}
        >
          {item}{separator}
        </motion.span>
      ))}
    </MotionTag>
  )
}
