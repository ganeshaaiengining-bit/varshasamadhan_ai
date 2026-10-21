/**
 * ============================================================================
 *  SPEECH CHUNKING — the part of read-aloud that was actually broken
 * ============================================================================
 *
 *     npx tsx scripts/test-speech-chunks.ts
 *
 * ── Why this can be tested at all, and why it matters ──────────────────────
 * Speech itself needs a browser with a voice installed, which is not something
 * a script can rely on. But the reason the audio stopped halfway was not the
 * voice: it was that the whole answer went out as one utterance, and Chrome
 * drops those after roughly fifteen seconds. Chunking is plain string work, so
 * it can be checked here, and it is where the bug was.
 *
 * What must hold is not just "the chunks are short enough". It is that the text
 * is *unchanged* — every word still there, in order, nothing dropped at a
 * boundary. An audio reader that loses the last line of every aarti is the same
 * bug in a new place.
 */
import { chunksForSpeech, bestVoiceFor } from '../src/components/voice/use-voice';
import { LANGUAGES, translate } from '../src/content/i18n';

let ok = 0;
let fail = 0;

function check(name: string, condition: boolean, detail = ''): void {
  if (condition) {
    ok += 1;
    console.log('  [ ok ]', name);
  } else {
    fail += 1;
    console.log('  [FAIL]', name, detail ? '| ' + detail : '');
  }
}

const LIMIT = 120;

const aarti = `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, क्षण में दूर करे।
जो ध्यावे फल पावे, दुख बिनसे मन का।
स्वामी दुख बिनसे मन का।
सुख सम्पत्ति घर आवे, कष्ट मिटे तन का।
ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
माता पिता तुम मेरे, शरण गहूँ किसकी।
तुम बिन और न दूजा, आस करूँ जिसकी।
ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
तुम पूरण परमात्मा, तुम अंतर्यामी।
पारब्रह्म परमेश्वर, तुम सबके स्वामी।
ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
तुम करुणा के सागर, तुम पालनकर्ता।
मैं मूरख खल कामी, कृपा करो भर्ता।
ॐ जय जगीश हरे, स्वामी जय जगदीश हरे।`;

console.log('\n=== a full aarti ===');
const chunks = chunksForSpeech(aarti);
check('ek se zyada chunk bane', chunks.length > 1, `chunks: ${chunks.length}`);
check('har chunk limit ke andar', chunks.every((c) => c.length <= LIMIT),
  'sabse lamba: ' + Math.max(...chunks.map((c) => c.length)));
check('koi chunk khali nahi', chunks.every((c) => c.trim().length > 0));

/*
 * The check that matters: put it back together and compare words.
 *
 * Whitespace is normalised on the way in, so the comparison is on the sequence
 * of words — which is exactly the thing a person singing along would notice
 * missing, and the thing a length check cannot see.
 */
const wordsIn = (s: string) => s.split(/\s+/).filter(Boolean);
const original = wordsIn(aarti.replace(/[।॥]/g, ' '));
const rejoined = wordsIn(chunks.join(' ').replace(/[।॥]/g, ' '));

check('koi shabd gayab nahi hua', original.length === rejoined.length,
  `${original.length} vs ${rejoined.length}`);
check('aur wahi shabd wahi kram me hain', original.join(' ') === rejoined.join(' '));

console.log('\n=== chhota text ===');
const short = chunksForSpeech('ॐ नमः शिवाय।');
check('ek hi chunk', short.length === 1, `chunks: ${short.length}`);
check('text waisa hi', short[0] === 'ॐ नमः शिवाय।');

console.log('\n=== khali text ===');
check('khali text se koi chunk nahi', chunksForSpeech('   \n\t ').length === 0);
check('bilkul khali string', chunksForSpeech('').length === 0);

console.log('\n=== ek bahut lamba vaakya (bina danda) ===');
const oneLong = 'राम '.repeat(200).trim();
const longChunks = chunksForSpeech(oneLong);
check('toda gaya', longChunks.length > 1, `chunks: ${longChunks.length}`);
check('har chunk limit ke andar', longChunks.every((c) => c.length <= LIMIT),
  'sabse lamba: ' + Math.max(...longChunks.map((c) => c.length)));
check('lamba vaakya bhi adhoora nahi', wordsIn(longChunks.join(' ')).length === 200,
  String(wordsIn(longChunks.join(' ')).length));

console.log('\n=== angrezi / doosri bhasha ===');
const english = 'This is one sentence. This is another one! Is this a third? Yes.';
const enChunks = chunksForSpeech(english);
check('angrezi bhi toda jaata hai ya poora rehta hai',
  enChunks.every((c) => c.length <= LIMIT));
const enWords = wordsIn(english);
check('angrezi me bhi kuch nahi khoya',
  wordsIn(enChunks.join(' ')).join(' ') === enWords.join(' '));

console.log('\n=== nayi line bhi ek seema hai ===');
// Short lines are deliberately merged: three one-line entries should not become
// three separate utterances. That is the behaviour, not a bug.
const shortLines = chunksForSpeech('पंक्ति एक\nपंक्ति दो\nपंक्ति तीन');
check('chhoti lines jud jaati hain', shortLines.length === 1, `chunks: ${shortLines.length}`);

// But a newline must not let the buffer run past the limit: three lines of a
// hundred characters cannot all live in one chunk.
const longLines = [
  'ॐ जय जगदीश हरे स्वामी जय जगदीश हरे भक्त जनों के संकट क्षण में दूर करे जो ध्यावे फल पावे',
  'सुख सम्पत्ति घर आवे कष्ट मिटे तन का माता पिता तुम मेरे शरण गहूँ किसकी तुम बिन और न दूजा',
  'तुम पूरण परमात्मा तुम अंतर्यामी पारब्रह्म परमेश्वर तुम सबके स्वामी तुम करुणा के सागर तुम',
].join('\n');
const longLineChunks = chunksForSpeech(longLines);
check('lambi lines alag chunks me', longLineChunks.length === 3, `chunks: ${longLineChunks.length}`);
check('har chunk limit ke andar', longLineChunks.every((c) => c.length <= LIMIT));
check('lambi lines me bhi kuch nahi khoya',
  wordsIn(longLineChunks.join(' ')).join(' ') === wordsIn(longLines).join(' '));

console.log('\n=== kya is device me us bhasha ki awaaz hai? ===');
/*
 * The question that stopped this site from reading Devanagari with an English
 * voice. Measured on the owner's machine: three `en-GB` voices and nothing else,
 * so `bestVoiceFor` must return null rather than silently fall back to whatever
 * the browser would have picked.
 */
const voices = (langs: string[]): SpeechSynthesisVoice[] =>
  langs.map((lang, i) => ({
    lang,
    name: `Voice ${i}`,
    default: i === 0,
    localService: true,
    voiceURI: `voice-${i}`,
  } as SpeechSynthesisVoice));

check('exact tag (hi-IN) milta hai',
  bestVoiceFor(voices(['hi-IN', 'en-GB']), 'hi-IN')?.lang === 'hi-IN');
check('bare language (hi) bhi chalta hai',
  bestVoiceFor(voices(['hi', 'en-GB']), 'hi-IN')?.lang === 'hi');
check('case-insensitive hai',
  bestVoiceFor(voices(['EN-in']), 'en-IN')?.lang === 'EN-in');
check('koi match nahi to null — chupke se angrezi awaaz nahi',
  bestVoiceFor(voices(['en-GB']), 'hi-IN') === null);
check('khali list to null (awaaz abhi load ho rahi hai)',
  bestVoiceFor([], 'hi-IN') === null);
check('doosri lipi ka naam match nahi karta',
  bestVoiceFor(voices(['ta-IN', 'te-IN']), 'bn-IN') === null);
check('farsi-Latin ho ya Devanagari, base code par milta hai',
  bestVoiceFor(voices(['mr-IN']), 'mr-IN')?.lang === 'mr-IN');

console.log('\n=== message 13 bhashaon me hai ===');
/*
 * `voice.noVoice` is the sentence a person sees when their device cannot read
 * the language at all. Falling back to English for eleven of them would be a
 * second, quieter version of the same problem: a message meant to explain a
 * language mismatch, in a language the reader did not choose.
 */
for (const language of LANGUAGES) {
  const value = translate(language.code, 'voice.noVoice');
  const okForKey =
    value !== 'voice.noVoice' &&
    value.includes('{name}') &&
    value.length > 30;
  check(`${language.code}: message maujood aur {name} bhara hua`, okForKey,
    JSON.stringify(value).slice(0, 70));
}

console.log('===========================================');
console.log(`  ${ok} me se ${ok + fail} check pass, ${fail} fail`);
if (fail > 0) process.exitCode = 1;
