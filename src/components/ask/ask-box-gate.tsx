import { currentUser } from '@/server/auth/session';
import { SignInWall } from '@/components/ask/sign-in-wall';

/**
 * The gate in front of every question box.
 *
 * A thin server wrapper so that every page which offers a question box gets the
 * same rule from one place, rather than each page remembering to check. There
 * are four such places — the home page, the help page, a subject page and the
 * health box — and a check written four times is a check that will be missed
 * once.
 *
 * ── Why this decides on the server ─────────────────────────────────────────
 *
 * A client-side check would have to ask the server who is signed in, which means
 * a render that says "signed in" and then changes, or one that says "signed out"
 * and then changes. Deciding here means the HTML leaving the server is already
 * the right HTML: no flash of a usable box for somebody who is not signed in, and
 * no layout jump when the answer comes back.
 *
 * ── This is a courtesy, not the enforcement ────────────────────────────────
 *
 * The rule that actually holds is in /api/ask, which refuses the question before
 * it is sent to any provider. This is what a person can see; that is what
 * cannot be talked past.
 */
export async function AskBoxGate({
  category = '',
  suggested = [],
  onAnswered,
}: {
  category?: string;
  suggested?: { question: string; label: string }[];
  onAnswered?: () => void;
}) {
  const user = await currentUser();

  if (!user) {
    return <SignInWall />;
  }

  const { AskBox } = await import('@/components/ask/ask-box');
  return (
    <AskBox category={category} suggested={suggested} onAnswered={onAnswered} />
  );
}