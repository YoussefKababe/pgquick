import { PGlite } from '@electric-sql/pglite'
import { adminpack } from '@electric-sql/pglite/contrib/adminpack'
import { amcheck } from '@electric-sql/pglite/contrib/amcheck'
import { auto_explain } from '@electric-sql/pglite/contrib/auto_explain'
import { bloom } from '@electric-sql/pglite/contrib/bloom'
import { btree_gin } from '@electric-sql/pglite/contrib/btree_gin'
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist'
import { citext } from '@electric-sql/pglite/contrib/citext'
import { cube } from '@electric-sql/pglite/contrib/cube'
import { earthdistance } from '@electric-sql/pglite/contrib/earthdistance'
import { fuzzystrmatch } from '@electric-sql/pglite/contrib/fuzzystrmatch'
import { hstore } from '@electric-sql/pglite/contrib/hstore'
import { isn } from '@electric-sql/pglite/contrib/isn'
import { lo } from '@electric-sql/pglite/contrib/lo'
import { ltree } from '@electric-sql/pglite/contrib/ltree'
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm'
import { seg } from '@electric-sql/pglite/contrib/seg'
import { tablefunc } from '@electric-sql/pglite/contrib/tablefunc'
import { tcn } from '@electric-sql/pglite/contrib/tcn'
import { tsm_system_rows } from '@electric-sql/pglite/contrib/tsm_system_rows'
import { tsm_system_time } from '@electric-sql/pglite/contrib/tsm_system_time'
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp'
import { vector } from '@electric-sql/pglite/vector'
import { IpcMainEvent, app } from 'electron'
import { Server, createServer } from 'node:net'
import { PostgresConnection, PostgresConnectionOptions } from 'pg-gateway'

import { PGLITE_VERSION, PG_VERSION } from '../constants'
import { databases, pglInstances } from './db'

let server: Server | null = null

export const startServer = (event: IpcMainEvent) => {
  if (server) {
    event.sender.send('set-ready', true)
    return
  }

  server = createServer((socket) => {
    const onStartup: PostgresConnectionOptions['onStartup'] = async ({
      clientInfo,
    }) => {
      if (!clientInfo) return

      const dbName = clientInfo.parameters['database']
      if (!dbName || !databases.includes(dbName) || pglInstances[dbName]) return

      pglInstances[dbName] = new PGlite(
        `${app.getPath('userData')}/dbs/${dbName}`,
        {
          username: 'pgquick',
          database: dbName,
          extensions: {
            adminpack,
            amcheck,
            auto_explain,
            bloom,
            btree_gin,
            btree_gist,
            citext,
            cube,
            earthdistance,
            fuzzystrmatch,
            hstore,
            isn,
            lo,
            ltree,
            pg_trgm,
            seg,
            tablefunc,
            tcn,
            tsm_system_rows,
            tsm_system_time,
            uuid_ossp,
            vector,
          },
        },
      )

      await pglInstances[dbName].waitReady
    }

    const connection = new PostgresConnection(socket, {
      serverVersion: `${PG_VERSION} (PGlite ${PGLITE_VERSION})`,
      auth: {
        method: 'password',
        validateCredentials: ({ username }) => username === 'pgquick',
        getClearTextPassword: () => '',
      },
      onStartup: onStartup,
      onMessage: async (
        data,
        { isAuthenticated, clientInfo, ...otherInfo },
      ) => {
        if (!isAuthenticated || !clientInfo) return false

        try {
          const dbName = clientInfo.parameters['database']

          if (!dbName || !pglInstances[dbName]) {
            await onStartup({ clientInfo, isAuthenticated, ...otherInfo })

            if (!dbName || !pglInstances[dbName])
              throw new Error('Database not found.')
          }

          const [[, responseData]] =
            await pglInstances[dbName].execProtocol(data)
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
