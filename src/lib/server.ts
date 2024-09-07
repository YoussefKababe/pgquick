import { PGlite } from '@electric-sql/pglite'
import { IpcMainEvent, app } from 'electron'
import { Server, createServer } from 'node:net'
import { PostgresConnection } from 'pg-gateway'

import { PGLITE_VERSION, PG_VERSION } from '../constants'
import { databases } from './db'

let server: Server | null = null
const dbs: Record<string, PGlite> = {}

export const startServer = (event: IpcMainEvent) => {
  if (server) {
    event.sender.send('set-ready', true)
    return
  }

  server = createServer((socket) => {
    const connection = new PostgresConnection(socket, {
      serverVersion: `${PG_VERSION} (PGlite ${PGLITE_VERSION})`,
      auth: {
        method: 'password',
        validateCredentials: ({ username }) => username === 'pgquick',
        getClearTextPassword: () => '',
      },
      onStartup: async ({ clientInfo }) => {
        if (!clientInfo) return

        const dbName = clientInfo.parameters['database']
        if (!dbName || !databases.includes(dbName) || dbs[dbName]) return

        dbs[dbName] = new PGlite(`${app.getPath('userData')}/dbs/${dbName}`, {
          username: 'pgquick',
          database: dbName,
        })

        await dbs[dbName].waitReady
      },
      onMessage: async (data, { isAuthenticated, clientInfo }) => {
        if (!isAuthenticated || !clientInfo) return false

        try {
          const dbName = clientInfo.parameters['database']

          if (!dbName || !dbs[dbName]) throw new Error('Database not found.')

          const [[, responseData]] = await dbs[dbName].execProtocol(data)
          connection.sendData(responseData)
        } catch (err) {
          connection.sendError(err)
          connection.sendReadyForQuery()
        }
        return true
      },
    })
  })

  server.listen(5432, () => {
    console.info('Server listening on port 5432')
    event.sender.send('set-ready', true)
  })
}

export const stopServer = async (event: IpcMainEvent) => {
  await new Promise<void>((resolve) => {
    if (!server) return resolve()
    server.close(() => resolve())
  })

  event.sender.send('set-ready', false)
  server = null
}

export const restartServer = async (event: IpcMainEvent) => {
  await stopServer(event)
  startServer(event)
}
