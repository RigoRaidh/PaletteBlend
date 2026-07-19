import { useState } from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ value = 0, onChange, readOnly = false, size = 18 }) {
  const [hovered, setHovered] = useState(0)
  const interactive = !readOnly && typeof onChange === 'function'
  const displayValue = interactive && hovered ? hovered : value

  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Rating' : `Rated ${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          role={interactive ? 'radio' : undefined}
          aria-checked={interactive ? value === star : undefined}
          aria-label={interactive ? `${star} star${star > 1 ? 's' : ''}` : undefined}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer rounded' : 'cursor-default'}
        >
          <Star
            size={size}
            className="transition-colors"
            fill={star <= displayValue ? '#d4af37' : 'transparent'}
            stroke={star <= displayValue ? '#d4af37' : '#96969f'}
          />
        </button>
      ))}
    </div>
  )
}
