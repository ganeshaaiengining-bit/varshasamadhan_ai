'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { useLanguage } from '@/components/language/language';

/**
 * Read-aloud button.
 *
 * Every article needs a voice version. The audience includes people who cannot
 * read comfortably, and a wall of Hindi text on a phone is exactly the wrong
 * thing to hand them.
 *
 * The prototype's version read the whole page with no speed control and no
 * error message — on a machine with no Hindi voice it produced silence and the
 * user assumed the button was broken.
 *
 * ── The language of the audio ──────────────────────────────────────────────
 * The text being read is an article body, which is the owner's own writing and
 * is in Hindi regardless of the interface language. So the voice is chosen from
 * the *text's* language rather than the visitor's choice: a Tamil visitor who
 * opens a Hindi article should hear it read as Hindi, because that is what is
 * written on the screen. Reading it with a Tamil voice produces something the
 * listener cannot decipher while having no way to tell the audio is at fault.
 * Pass `language` explicitly to override.
 */
export function ReadAloud({
  text,
  label,
  language = 'hi',
}: {
  text: string;
  label?: string;
  language?: string;
}) {
  const { t } = useLanguage();
  const [speaking, setSpeaking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(
    () => () => {
      // Leaving the page mid-playback otherwise keeps talking.
      import('@/components/voice/use-voice').then((m) => m.stopSpeaking());
    },
    [],
  );

  const play = async () => {
    if (speaking) {
      const { stopSpeaking } = await import('@/components/voice/use-voice');
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    setError(null);
    const { speak } = await import('@/components/voice/use-voice');
    setSpeaking(true);
    speak(text, {
      rate: 0.85,
      language,
      onEnd: () => setSpeaking(false),
      onError: (reasonKey) => {
        setSpeaking(false);
        setError(t(reasonKey));
      },
    });
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={play}
        aria-pressed={speaking}
        className={speaking ? 'btn !min-h-[2.75rem] !px-4 text-sm' : 'btn-outline !min-h-[2.75rem] !px-4 text-sm'}
      >
        <Icon name="speaker" size={20} />
        {speaking ? t('ask.stopSpeak') : (label ?? t('ask.listen'))}
      </button>

      {error ? (
        <span role="alert" className="text-sm text-danger">
          {error}
        </span>
      ) : null}
    </span>
  );
}