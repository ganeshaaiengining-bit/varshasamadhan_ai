import { Icon } from '@/components/ui/icon';

/**
 * ===========================================================================
 *  SETUP WARNING — shown to the owner, only on the owner panel
 * ===========================================================================
 *
 * Reads the environment and says plainly what is not switched on.
 *
 * ── Why this exists ────────────────────────────────────────────────────────
 *
 * A missing API key is completely invisible from the front of the site. Every
 * page loads, every question returns a courteous message, and no error is
 * logged. The only symptom is a queue of visitors who were told the same thing
 * over and over — which is exactly what happened, and it was found by reading a
 * complaint rather than by looking at the site.
 *
 * So the check lives here, on a page only the owner can reach, where the person
 * who can fix it is already looking. It is a server component and reads `process.env`
 * directly: the values are never sent to the browser, so a visitor cannot read
 * the admin page source and learn whether a key is present. Only the fact that
 * something is missing crosses the wire, never its value.
 *
 * ── Why it lists the fix ───────────────────────────────────────────────────
 *
 * "AI is not configured" is not actionable on its own. Each item says what to do
 * and where, because the whole point is to remove the need to guess.
 */

/** A setting that is missing, with the one action that fixes it. */
interface Warning {
  title: string;
  detail: string;
  /** How much it costs, and whether visitors notice. Set for every item. */
  impact: string;
  tone: 'urgent' | 'warn';
}

export function SetupWarning() {
  const key = (process.env.GEMINI_API_KEY ?? '').trim();
  const password = (process.env.ADMIN_PASSWORD ?? '').trim();
  const databaseUrl = (process.env.DATABASE_URL ?? '').trim();

  const warnings: Warning[] = [];

  /*
   * The one that matters. Without it the site can only match its own sixteen
   * articles, so any question outside them returns "no direct answer" — and
   * because that message is correct rather than alarming, nothing looks broken
   * and nobody reports it until a visitor complains.
   *
   * The length check mirrors isConfigured() in src/server/ai/gemini.ts. If the
   * two ever disagree, this banner would promise an AI that is not there, so it
   * duplicates the rule deliberately rather than trusting a shared constant
   * across a server-only module boundary.
   */
  if (key.length <= 10) {
    warnings.push({
      title: 'AI chalu nahi hai — koi bhi naya sawaal ka jawaab nahi milega',
      detail:
        'GEMINI_API_KEY khaali hai. Ye free hai: aistudio.google.com/apikey kholein, ' +
        'Create API key par click karein, aur copy hui key .env me GEMINI_API_KEY ke aage likhein. ' +
        'Uske baad server restart karna hoga.',
      impact:
        'Filhaal sirf 16 lekh se match ho sakta hai. "Bukhar", "pet dard", "paisa khatam" — ' +
        'ye sab koi bhi naye sawaal par jawaab nahi denge. Puri tarah muft hai.',
      tone: 'urgent',
    });
  }

  /*
   * A password shorter than eight characters is treated as "not set" by
   * isOwnerConfigured() in src/server/owner.ts, for the reason documented
   * there: a blank or one-character password let everyone in.
   */
  if (password.length < 8) {
    warnings.push({
      title: 'Admin ka password set nahi hai',
      detail:
        'ADMIN_PASSWORD kam se kam 8 akshar ka rakhein. .env me badalne ke baad server restart karein.',
      impact: 'Filhaal koi bhi is panel me ghus nahi sakta — yaani koi bhi.', // i.e. nobody guards it
      tone: 'urgent',
    });
  }

  /*
   * SQLite will not survive a serverless deploy. The file lives on the build
   * machine's disk, so every article and review written in production would be
   * gone the next time the app redeployed. Caught here rather than discovered by
   * an owner who has just typed up an article.
   */
  if (databaseUrl.startsWith('file:')) {
    warnings.push({
      title: 'Database abhi local file hai — live site par sab kuch chala jayega',
      detail:
        'DATABASE_URL abhi "file:./dev.db" hai. Live karke ke liye Supabase ka ' +
        'postgresql:// wala connection string chahiye (Project Settings → Database → URI), ' +
        'aur .env me wahi likhein.',
      impact: 'Sirf tab jab website live ho. Filhaal sab theek hai.',
      tone: 'warn',
    });
  }

  if (warnings.length === 0) {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-md border border-line bg-surface p-4 text-sm">
        <Icon name="check" size={20} className="mt-0.5 shrink-0 text-leaf" />
        <div>
          <p className="font-bold">Sab kuch set hai</p>
          <p className="mt-1 text-ink-muted">
            AI chalu hai, password set hai, aur database live hai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      {/*
        Announced as an alert region so a screen reader says it when the panel
        loads. The role is on the wrapper rather than each item because the
        owner wants to know "is something wrong", once, not five times.
      */}
      <div role="alert">
        {warnings.map((warning) => (
          <div
            key={warning.title}
            className={[
              'flex items-start gap-3 rounded-md border p-4 text-sm',
              warning.tone === 'urgent'
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-amber/50 bg-amber-soft',
            ].join(' ')}
          >
            <Icon
              name="alert"
              size={20}
              className={`mt-0.5 shrink-0 ${
                warning.tone === 'urgent' ? 'text-red-600' : 'text-amber-700'
              }`}
            />
            <div className="min-w-0">
              <p className="font-bold">{warning.title}</p>
              <p className="mt-1 text-ink-soft">{warning.detail}</p>
              <p className="mt-2 text-ink-muted">{warning.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}