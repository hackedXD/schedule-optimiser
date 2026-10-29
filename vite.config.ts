import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchDetailCached, fetchFceCached, fetchInstructorFcesCached } from './src/engine/detailCache.ts'

/** Dev-only endpoint: GET /api/detail?course=15150&semester=S27 -> CourseDetail JSON, cached in public/data/details.json. */
function socDetails(): Plugin {
  return {
    name: 'soc-details',
    configureServer(server) {
      server.middlewares.use('/api/instructor-fces', async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const surname = url.searchParams.get('surname') ?? ''
        res.setHeader('content-type', 'application/json')
        if (!/^[A-Za-z' -]{2,40}$/.test(surname)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'bad surname' })); return }
        try { res.end(JSON.stringify(await fetchInstructorFcesCached(surname))) }
        catch (e) { res.statusCode = 502; res.end(JSON.stringify({ error: String(e) })) }
      })
      server.middlewares.use('/api/fce', async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const code = url.searchParams.get('course') ?? ''
        res.setHeader('content-type', 'application/json')
        if (!/^\d{5}$/.test(code)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'bad course' })); return }
        try { res.end(JSON.stringify(await fetchFceCached(code))) }
        catch (e) { res.statusCode = 502; res.end(JSON.stringify({ error: String(e) })) }
      })
      server.middlewares.use('/api/detail', async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const code = url.searchParams.get('course') ?? ''
        const semester = url.searchParams.get('semester') ?? ''
        res.setHeader('content-type', 'application/json')
        if (!/^\d{5}$/.test(code) || !/^[SFM]\d{2}$/.test(semester)) { res.statusCode = 400; res.end(JSON.stringify({ error: 'bad course or semester' })); return }
        try {
          const detail = await fetchDetailCached(code, semester)
          if (!detail) { res.statusCode = 404; res.end(JSON.stringify({ error: 'no SOC detail page' })); return }
          res.end(JSON.stringify(detail))
        } catch (e) {
          res.statusCode = 502
          res.end(JSON.stringify({ error: String(e) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), socDetails()],
})
