import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * REPLACE THE VALUES BELOW WITH YOUR ACTUAL SUPABASE CREDENTIALS
 *
 * To get these values:
 * 1. Go to your Supabase project dashboard
 * 2. Settings → API
 * 3. Copy Project URL and anon public key
 * 4. Replace the values below
 */

// 🔥 REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS 🔥
const TEMP_SUPABASE_URL = "https://your-project-id.supabase.co"
const TEMP_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key-here"

// Try to get from environment variables first, then fall back to temp values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || TEMP_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || TEMP_SUPABASE_ANON_KEY

type Row = Record<string, any>

function createFallbackClient() {
  // A super-tiny fake client that mimics the few methods we need
  // and keeps everything in localStorage under "keepfresh-food-items".
  const LS_KEY = "keepfresh-food-items"

  function from(tableName: string) {
    function read(): Row[] {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) || "[]")
      } catch {
        return []
      }
    }

    function write(rows: Row[]) {
      localStorage.setItem(LS_KEY, JSON.stringify(rows))
    }

    return {
      // ── SELECT ────────────────────────────────────────────────
      select(_columns = "*") {
        let rows = read()

        /* return a lightweight query-builder that supports .order()  */
        const builder = {
          order(column: string, opts: { ascending?: boolean } = {}) {
            const asc = opts.ascending !== false
            rows = [...rows].sort((a, b) => (asc ? (a[column] > b[column] ? 1 : -1) : a[column] < b[column] ? 1 : -1))
            return { data: rows, error: null as any }
          },
          /* if the user doesn't chain .order() we still give data back */
          data: rows,
          error: null as any,
        } as const

        return builder
      },

      // ── INSERT ────────────────────────────────────────────────
      async insert(rows: Row[]) {
        const current = read()
        const withIds = rows.map((r) => ({
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...r,
        }))
        write([...current, ...withIds])
        return { data: withIds, error: null as any }
      },

      // ── DELETE ────────────────────────────────────────────────
      delete() {
        return {
          eq(_: string, id: string) {
            const remaining = read().filter((r) => r.id !== id)
            write(remaining)
            return Promise.resolve({ error: null as any })
          },
        }
      },
    }
  }

  return {
    from,
  }
}

export function createClient() {
  // Check if we have real Supabase credentials
  if (
    supabaseUrl &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey &&
    supabaseAnonKey !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key-here"
  ) {
    console.log("✅ Using real Supabase database")
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  console.warn(
    "⚠️ Using localStorage fallback. To use real database:\n" +
      "1. Replace TEMP_SUPABASE_URL and TEMP_SUPABASE_ANON_KEY in lib/supabase.ts\n" +
      "2. Or set up environment variables in your deployment",
  )
  return createFallbackClient()
}
