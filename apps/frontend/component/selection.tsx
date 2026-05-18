
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Grid from './Grid'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'

type Block = {
  blockId: string
  x: number
  y: number
  ownerId: string
  username: string
  colour: string
  claimedAt: string
}

type Props = {
  token: string
  currentUserId: string
}

export default function BoardClient({ token, currentUserId }: Props) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const wsRef = useRef<WebSocket | null>(null)

  const handleMessage = useCallback((event: MessageEvent) => {
    const message = JSON.parse(event.data)

    switch (message.type) {

      case 'board_state': {
        setBlocks(message.blocks)
        break
      }

      case 'block_claimed': {
        setBlocks(prev => {
          const filtered = prev.filter(b => !(b.x === message.x && b.y === message.y))
          return [...filtered, message]
        })
        break
      }

      case 'block_released': {
        setBlocks(prev => prev.filter(b => !(b.x === message.x && b.y === message.y)))
        break
      }

      case 'claim_rejected': {
        console.warn('Claim rejected:', message.reason)
        break
      }

      case 'system': {
        console.log('Server:', message.message)
        break
      }

      case 'error': {
        console.error('Server error:', message.message)
        break
      }
    }
  }, [])

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('connected')
      // Request full board state on connect
      ws.send(JSON.stringify({ type: 'get-board' }))
    }

    ws.onmessage = handleMessage

    ws.onclose = () => {
      setStatus('disconnected')
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      setStatus('disconnected')
    }

    return () => {
      ws.close()
    }
  }, [token, handleMessage])

  const handleClaim = useCallback((x: number, y: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'claim_block', x, y }))
    }
  }, [])

  // Map Block type to what Grid expects
  const gridBlocks = blocks.map(b => ({
    x: b.x,
    y: b.y,
    ownerId: b.ownerId,
    owner: { colour: b.colour, username: b.username }
  }))

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
        <h1 className="text-white font-bold text-lg">Grid War</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            status === 'connected' ? 'bg-green-400' :
            status === 'connecting' ? 'bg-yellow-400' :
            'bg-red-400'
          }`} />
          <span className="text-gray-400 text-sm capitalize">{status}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 px-6 py-2 bg-gray-900 border-b border-gray-800 text-sm text-gray-400">
        <span>Total claimed: <strong className="text-white">{blocks.length}</strong></span>
        <span>Yours: <strong className="text-white">
          {blocks.filter(b => b.ownerId === currentUserId).length}
        </strong></span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <Grid
          blocks={gridBlocks}
          currentUserId={currentUserId}
          onClaim={handleClaim}
        />
      </div>

      {/* Disconnected banner */}
      {status === 'disconnected' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          Disconnected from server — refresh to reconnect
        </div>
      )}

    </div>
  )
}