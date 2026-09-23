import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized successfully!')
  const users = await payload.find({ collection: 'users', limit: 1 })
  console.log(`Found ${users.totalDocs} users in database.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Payload init error:', err)
  process.exit(1)
})
