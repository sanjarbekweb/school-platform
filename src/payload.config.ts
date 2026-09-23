import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

// Database adapters
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Staff } from './collections/Staff'
import { Notices } from './collections/Notices'
import { Awards } from './collections/Awards'
import { Magazines } from './collections/Magazines'
import { Albums } from './collections/Albums'
import { BlogPosts } from './collections/BlogPosts'
import { Pages } from './collections/Pages'
import { Redirects } from './collections/Redirects'

// Globals
import { SiteSettings } from './globals/SiteSettings'
import { HelpGuide } from './globals/HelpGuide'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri = process.env.DATABASE_URI || 'file:./school.db'
const isPostgres = databaseUri.startsWith('postgres://') || databaseUri.startsWith('postgresql://')

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— 25-maktab Boshqaruv Paneli',
    },
  },
  collections: [
    News,
    Notices,
    Staff,
    Awards,
    Magazines,
    Albums,
    BlogPosts,
    Pages,
    Media,
    Users,
    Redirects,
  ],
  globals: [
    SiteSettings,
    HelpGuide,
  ],
  editor: lexicalEditor({}),
  secret: (() => {
    const isProduction = process.env.NODE_ENV === 'production'
    const secret = process.env.PAYLOAD_SECRET
    if (isProduction && (!secret || secret.length < 32 || secret === 'school_platform_default_payload_secret_key_2026')) {
      throw new Error('FATAL: PAYLOAD_SECRET environment variable must be set to a secure random string (at least 32 characters) in production.')
    }
    return secret || 'school_platform_default_payload_secret_key_2026'
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: databaseUri,
        },
      })
    : sqliteAdapter({
        client: {
          url: databaseUri,
        },
        push: false,
      }),
})
