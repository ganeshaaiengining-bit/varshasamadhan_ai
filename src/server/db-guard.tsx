import 'server-only';

import { NextResponse } from 'next/server';

/**
 * ===========================================================================
 *  DATABASE OUTAGE — how a page fails
 * ===========================================================================
 *
 * Every content page on this site reads the database before it renders: the
 * articles, the categories, the reviews. That is the right design — the owner
 * edits content in a form, so the content cannot live in the code.
 *
 * But it has one bad consequence: if the database is unreachable, an unguarded
 * `await prisma.article.findMany()` throws, and a visitor gets a stack trace
 * page. For a service that exists to help people who are often elderly,
 * frightened, and in a hurry, that is the worst possible outcome of a hosting
 * problem — and it is also the outcome a stranger is most likely to hit first,
 * because the moment the site is deployed the database is usually the one thing
 * not configured yet.
 *
 * So failures are caught at the page level and turned into a sentence a person
 * can act on. Three rules:
 *
 *   1. **Never show the error.** Not the message, not the stack, not the query.
 *      A `PrismaClientInitializationError` contains the connection string, and a
 *      connection string contains the database password. The site promises not to
 *      collect personal information; leaking a credential to whoever opens the
 *      link would break that promise and hand over the whole database.
 *
 *   2. **Say what happened and what to do.** "Please try again in a few minutes"
 *      is honest and actionable. A 500 is neither.
 *
 *   3. **Keep the site up around the failure.** The static pages — the memorial,
 *      the "how you can help" page — do not touch the database, so they keep
 *      working, and the emergency numbers in the footer keep being reachable. A
 *      database outage should degrade the service, not end it.
 *
 * `logDatabaseFailure()` is for the owner's terminal, never for a visitor.
 */

const GENERIC_MESSAGE =
  'यह सेवा अभी उपलब्ध नहीं है। कृपया कुछ देर बाद दोबारा कोशिश कीजिए।';

/**
 * One line for the page, in the visitor's language, keyed the same as i18n.
 *
 * Typed as a plain record because the keys here are validated by `isKnownLanguage`
 * upstream — but this module is also called with a raw string from a page that has
 * not checked it, and an index signature is what makes that safe to write.
 */
const MESSAGES: Record<string, string> = {
  hi: 'यह सेवा अभी उपलब्ध नहीं है। कृपया कुछ देर बाद दोबारा कोशिश कीजिए। आपातकाल में 112 पर फ़ोन कीजिए।',
  en: 'This service is unavailable right now. Please try again in a few minutes. In an emergency call 112.',
  bn: 'এই পরিষেবাটি এখন উপলব্ধ নয়। কিছুক্ষণ পরে আবার চেষ্টা করুন। জরুরি অবস্থায় 112 নম্বরে ফোন করুন।',
  ta: 'இந்தச் சேவை தற்போது கிடைக்கவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும். அவசரத்தில் 112 எண்ணுக் கcalling செய்யவும்.',
  te: 'ఈ సేవ ఇప్పుడు అందుబాటులో లేదు. కొద్ది సేపేల తర్వాత మళ్లీ ప్రయత్నించండి. అత్యవసరంలో 112కు కॉల్ చేయండి.',
  mr: 'ही सेवा सध्या उपलब्ध नाही. काही वेळानंतर पुन्हा प्रयत्न करा. आणीबाणीत 112 वर फोन करा.',
  gu: 'આ સેવા હમણાં ઉપલબ્ધ નથી. થોડી વાર પછી ફરી પ્રયત્ન કરો. કટોકટીમાં 112 પર ફોન કરો.',
  kn: 'ಈ ಸೇವೆ ಈಗ ಲಭ್ಯವಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. ತುರ್ತ ಸಂತರಗಳಲ್ಲಿ 112 ಗೆ ಕರೆ ಮಾಡಿ.',
  ml: 'ഈ സേവനം ഇപ്പോൾ ലഭ്യമായില്ല. കുറച്ച് സമയം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക. അടിയന്തരമായി 112 ലേക്ക് വിളിക്കുക.',
  pa: 'ਇਹ ਸੇਵਾ ਹੁਣ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਐਮਰਜੈਂਸੀ ਵਿੱਚ 112 ਤੇ ਫ਼ੋਨ ਕਰੋ।',
  ur: 'یہ خدمت اِس وقت دستیاب نہیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔ ہنگامی صورتحال میں 112 پر فون کریں۔',
  ar: 'هذه الخدمة غير متاحة حاليًا. يرجى المحاولة بعد قليل. في حالة الطوارئ اتصل على 112.',
  es: 'Este servicio no está disponible ahora. Vuelva a intentarlo en unos minutos. En una emergencia, llame al 112.',
};

function messageFor(language: string): string {
  return MESSAGES[language] ?? MESSAGES.hi;
}

/**
 * Prisma's codes that mean "the database could not be reached or is refusing us",
 * as opposed to "your query was wrong".
 *
 * Listed explicitly rather than matched as `/^P1/` because that prefix also covers
 * `P1012`, a *validation* error — a mistyped connection string or a schema that
 * disagrees with the provider. That is a deployment mistake, not an outage, and
 * hiding it behind "please try again later" would leave the owner staring at a
 * polite message with no idea that a variable is misspelled.
 *
 * The codes deliberately *excluded* are the data ones: `P2002` (unique violation)
 * and `P2003` (foreign key) mean the code asked for something impossible, and
 * quietly degrading that would bury a real bug.
 */
const OUTAGE_CODES = new Set([
  'P1000', // authentication failed
  'P1001', // cannot reach the database server
  'P1002', // the database server was reached but timed out
  'P1008', // the operation timed out
  'P1009', // database is already connected / argument count mismatch
  'P1010', // access denied by the database
  'P1011', // TLS connection error
  'P1017', // the server has closed the connection
  'P2024', // timed out while fetching a connection from the pool
  'P2028', // transaction API error, which is what a dropped pooler looks like
  'P2034', // write conflict / deadlock
]);

/**
 * Whether a thrown value is a database problem rather than a bug in a component.
 *
 * Kept narrow on purpose. Swallowing every exception would hide a genuine
 * programming error behind a polite message that changes nothing, which is worse
 * than a visible failure: the bug would never be fixed because it never surfaced.
 */
export function isDatabaseFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = (error as { code?: unknown }).code;
  if (typeof code === 'string' && OUTAGE_CODES.has(code)) return true;

  /*
   * `PrismaClientInitializationError` is thrown when the client cannot even reach
   * the pooler — the exact case on a fresh deploy with no database configured.
   *
   * `PrismaClientValidationError` is included for a specific reason: Prisma
   * validates the datasource URL *before* connecting, so a `postgresql://` URL
   * against a schema that still says `sqlite` fails here rather than at the
   * socket. That is a deployment mistake, but it is also the most likely first
   * thing to go wrong on a brand new site, and answering a visitor with a stack
   * trace because of it is not an acceptable trade.
   */
  if (
    error.name === 'PrismaClientInitializationError' ||
    error.name === 'PrismaClientValidationError'
  ) {
    return true;
  }

  // Postgres connection failures surface as a driver error with no Prisma code
  // when the failure is in the TCP layer rather than in the query.
  return /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|Connection terminated|server closed the connection|timeout exceeded|Connection reset by peer|Can't reach database server/i.test(
    error.message,
  );
}

/**
 * Report a database failure without disclosing anything about it.
 *
 * The message is logged because the owner needs it and never shown because it
 * carries the connection string.
 */
export function logDatabaseFailure(where: string, error: unknown): void {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[db] ${where} could not be read:`, detail);
}

/**
 * Wrap a database read so a failure becomes a page instead of a crash.
 *
 *     const categories = await safeRead('home:categories', () => prisma.category.findMany());
 *
 * Returns `fallback` when the database is unreachable, so the caller can render
 * a shortened page instead of a broken one. Any other exception is rethrown —
 * see the note on `isDatabaseFailure`.
 */
export async function safeRead<T>(
  where: string,
  read: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    if (!isDatabaseFailure(error)) throw error;
    logDatabaseFailure(where, error);
    return fallback;
  }
}

/**
 * The page a visitor sees when the site cannot reach its own content.
 *
 * Rendered inside the site's own chrome, so the navigation, the emergency
 * numbers and the language switch all still work. Those are the three things that
 * must survive a database outage: getting to another page, reaching the
 * emergency helplines, and reading it in one's own language.
 */
export async function DatabaseUnavailable({ language = 'hi' }: { language?: string }) {
  /*
   * The language is whatever the caller resolved from the cookie, already
   * validated by `getT()`. No header lookup here: reading headers from a
   * component forces the route dynamic for no gain, since every caller on this
   * site is already `force-dynamic` and already knows the language.
   */
  const chosen = MESSAGES[language] ? language : 'hi';

  return (
    <div className="wrap-narrow py-12 sm:py-16">
      <div className="card border-amber/40 bg-amber-soft p-6 text-center sm:p-8">
        <h1 className="text-2xl">सेवा उपलब्ध नहीं है</h1>

        <p className="mx-auto mt-3 max-w-xl text-lg">{messageFor(chosen)}</p>

        {/*
          The emergency numbers are repeated here on purpose. A visitor who
          arrived on a broken page may be here *because* of the emergency, and
          scrolling to the footer to find 112 is one step too many.
        */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="tel:112" className="btn-primary">
            112 — आपातकाल
          </a>
          <a href="tel:108" className="btn-outline">
            108 — एम्बुलेंस
          </a>
          <a href="/smriti" className="btn-outline">
            स्मृति पन्ना
          </a>
        </div>

        <p className="mt-6 text-sm text-ink-subtle">{GENERIC_MESSAGE}</p>
      </div>
    </div>
  );
}

/** Kept for the API routes, which must answer with JSON rather than a page. */
export function databaseUnavailableResponse(): NextResponse {
  return NextResponse.json(
    { ok: false, fallback: true, reasonKey: 'ask.errorNetwork' },
    { status: 503, headers: { 'cache-control': 'no-store' } },
  );
}