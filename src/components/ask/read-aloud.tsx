'use client';

import * as React from 'react';
import { Icon } from '@/components/ui/icon';

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
 */
export function ReadAloud({ text, label = 'सुनें' }: { text: string; label?: string }) {
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
      onEnd: () => setSpeaking(false),
      onError: (message) => {
        setSpeaking(false);
        setError(message);
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
        {speaking ? 'रोकें' : label}
      </button>

      {error ? (
        <span role="alert" className="text-sm text-danger">
          {error}
        </span>
      ) : null}
    </span>
  );
}