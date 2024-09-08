import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Database, X } from 'lucide-react'
import { useState } from 'react'

import { useApp } from './AppContext'

export const DatabaseList = () => {
  const app = useApp()
  const [loading, setLoading] = useState(false)
  const [listRef] = useAutoAnimate()

  return (
    <ul
      ref={listRef}
      className="flex w-[calc(100%+30px)] flex-1 flex-col gap-3 overflow-y-auto p-3 pr-[42px]"
    >
      {app.databases
        .filter((db) => !app.search || db.includes(app.search))
        .map((db) => (
          <li
            key={db}
            className="group box-border flex w-full items-center rounded border border-white/10 bg-gray-900"
          >
            <div className="relative flex h-full w-[60px] items-center justify-center border-r border-white/10 text-blue-600">
              <Database />
              <button
                className="pointer-events-none absolute inset-3 flex items-center justify-center rounded bg-red-500 text-white opacity-0 transition-opacity disabled:pointer-events-none disabled:bg-gray-500 group-hover:pointer-events-auto group-hover:opacity-100"
                disabled={loading}
                onClick={async () => {
                  setLoading(true)
                  await window.electronAPI.removeDatabase(db)
                  setLoading(false)
                }}
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-2 px-3">
              <p className="font-bold">{db}</p>
              <p className="text-xs text-white/40">pgquick@localhost:5432</p>
            </div>
          </li>
        ))}
    </ul>
  )
}
