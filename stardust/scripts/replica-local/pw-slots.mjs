// Preload (NODE_OPTIONS="--import <this>"): caps concurrent Chromium launches machine-wide
// for this project's instruments via lock files in $PW_SLOTS_DIR (default /tmp/pw-slots), max $PW_SLOTS (default 3).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const DIR = process.env.PW_SLOTS_DIR || '/tmp/pw-slots'; const MAX = +(process.env.PW_SLOTS || 3);
fs.mkdirSync(DIR, { recursive: true });
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
const held = new Set();
async function acquire() {
  for (;;) {
    for (let i = 0; i < MAX; i++) {
      const f = path.join(DIR, `slot-${i}`);
      try { const fd = fs.openSync(f, 'wx'); fs.writeSync(fd, String(process.pid)); fs.closeSync(fd); held.add(f); return f; }
      catch { try { const pid = +fs.readFileSync(f, 'utf8'); if (pid && !alive(pid)) fs.rmSync(f, { force: true }); } catch {} }
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}
const release = (f) => { if (held.delete(f)) fs.rmSync(f, { force: true }); };
process.on('exit', () => { for (const f of held) fs.rmSync(f, { force: true }); });
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => process.exit(128));
try {
  const pw = createRequire(path.join(process.cwd(), 'x.js'))('playwright');
  const bt = pw.chromium; const proto = Object.getPrototypeOf(bt);
  for (const m of ['launch', 'launchPersistentContext']) {
    const orig = proto[m];
    proto[m] = async function (...a) {
      const f = await acquire();
      try { const r = await orig.apply(this, a); const b = r.browser ? (r.browser() || r) : r;
        b.on('disconnected', () => release(f)); if (r.on && r !== b) r.on('close', () => release(f)); return r; }
      catch (e) { release(f); throw e; }
    };
  }
} catch (e) { /* playwright not resolvable: no-op */ }
