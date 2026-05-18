// components/Grid.tsx
'use client'

const COLS = 40
const ROWS = 25

type Block = {
  x: number
  y: number
  ownerId: string | null
  owner?: { colour: string; username: string } | null
}

type Props = {
  blocks: Block[]
  currentUserId: string
  onClaim: (x: number, y: number) => void
}

export default function Grid({ blocks, currentUserId, onClaim }: Props) {
  const getBlock = (x: number, y: number) =>
    blocks.find((b) => b.x === x && b.y === y)

  return (
    <div className="p-4">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: '2px',
          width: '100%',
        }}
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const x = i % COLS
          const y = Math.floor(i / COLS)
          const block = getBlock(x, y)
          const isMine = block?.ownerId === currentUserId
          const isClaimed = !!block?.ownerId

          const bg = !isClaimed
            ? '#7DD3FC'                          // unclaimed — sky blue
            : isMine
            ? block?.owner?.colour ?? '#A78BFA'  // yours
            : block?.owner?.colour ?? '#FB923C'  // others

          return (
            <div
              key={i}
              title={block?.owner?.username ?? `(${x}, ${y})`}
              onClick={() => !isClaimed && onClaim(x, y)}
              style={{
                aspectRatio: '1',
                background: bg,
                borderRadius: '2px',
                cursor: isClaimed ? 'default' : 'pointer',
                border: '0.5px solid rgba(0,0,0,0.1)',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          )
        })}
      </div>
    </div>
  )
}