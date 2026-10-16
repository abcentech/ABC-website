import { useEffect } from 'react'
export function useMotion(path: string) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pressed = new Set<HTMLElement>()
    const clear = () => {
      pressed.forEach((element) => delete element.dataset.pressed)
      pressed.clear()
    }
    const press = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && (!['Enter', ' '].includes(event.key) || event.repeat))
        return
      if (event instanceof PointerEvent && event.button !== 0) return
      const element = (event.target as Element).closest<HTMLElement>(
        'a[href], button:not(:disabled), summary',
      )
      if (!element) return
      clear()
      element.dataset.pressed = 'true'
      pressed.add(element)
    }
    document.addEventListener('pointerdown', press)
    document.addEventListener('keydown', press)
    document.addEventListener('pointerup', clear)
    document.addEventListener('pointercancel', clear)
    document.addEventListener('keyup', clear)
    window.addEventListener('blur', clear)
    let observer: IntersectionObserver | undefined
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.section-heading, .steps article, .project-card, .industry-grid article',
      ),
    )
    function reveal() {
      observer?.disconnect()
      sections.forEach((element) => delete element.dataset.reveal)
      if (reduced.matches || !('IntersectionObserver' in window)) return
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              ;(entry.target as HTMLElement).dataset.reveal = 'ready'
              observer?.unobserve(entry.target)
            }
          }),
        { rootMargin: '0px 0px 60px 0px', threshold: 0.05 },
      )
      sections.forEach((element) => {
        element.dataset.reveal = 'waiting'
        observer?.observe(element)
      })
    }
    reveal()
    reduced.addEventListener('change', reveal)
    return () => {
      clear()
      observer?.disconnect()
      sections.forEach((element) => delete element.dataset.reveal)
      reduced.removeEventListener('change', reveal)
      document.removeEventListener('pointerdown', press)
      document.removeEventListener('keydown', press)
      document.removeEventListener('pointerup', clear)
      document.removeEventListener('pointercancel', clear)
      document.removeEventListener('keyup', clear)
      window.removeEventListener('blur', clear)
    }
  }, [path])
}
