/**
 * ===========================================================================
 *  FREE LIBRARY — books, textbooks, images, audio
 * ===========================================================================
 *
 * A directory of things a visitor can actually download, kept here rather than
 * stored.
 *
 * ── Why links and not copies ───────────────────────────────────────────────
 *
 * The owner asked for any PDF a visitor might want — school books, books, even
 * pictures — free of charge and with no copyright problem. That last clause is
 * the whole design.
 *
 * Nothing here is hosted, mirrored or re-uploaded. Every entry is a link to
 * somewhere the material was already published for exactly this purpose by
 * people entitled to publish it. That is not a workaround for copyright; it is
 * the ordinary, intended way material reaches the public, and it means the site
 * never becomes liable for somebody else's work and never needs to take
 * anything down.
 *
 * ── What counts as free ────────────────────────────────────────────────────
 *
 * Two different meanings, and the visitor is told which one applies:
 *
 *   FREE      no account, no payment, no "add to cart"
 *   OPEN      additionally free to copy, share and adapt, with a licence that
 *             permits it — Creative Commons, public domain, or an explicit
 *             government open licence
 *
 * The distinction matters because a book can be free to *read* on a government
 * site while being under copyright. That is a legitimate and generous offer,
 * and the entry is listed as FREE, not OPEN — claiming otherwise would be a lie
 * that only surfaces when somebody tries to share it.
 *
 * ── Every entry carries its licence ────────────────────────────────────────
 *
 * Not decoration. The whole value of this page is that a person can pass a
 * link on without owing anybody anything, so "you may share this" has to be
 * stated or it cannot be relied on. An entry with no licence named is a bug in
 * the data, not an oversight.
 */

/**
 * A licence, named so a person can pass the link on without owing anyone.
 *
 * reeness lives here rather than on each entry, because it is a property of
 * the licence and not of the resource: every book under CC BY is open whatever
 * else it is. It is a field and not something worked out by matching on the
 * wording, which is how the first version did it and which would break the
 * moment a licence was reworded in another language.
 */
export interface Licence {
  /** Shown as a badge. */
  name: string;
  /** Whether copying and sharing are permitted, or only reading is free. */
  freeness: Freeness;
  /**
   * What a visitor may actually do, in one line, in plain words.
   *
   * "Can I share this?" is the question nobody asks a Creative Commons page and
   * everybody needs answered, so the answer is here rather than behind a link.
   */
  shares: string;
}

/** How free it is. See the note at the top of this file. */
export type Freeness = 'open' | 'free';

/** Which licences permit sharing, and which only permit reading. */
export const isOpen = (licence: Licence): boolean => licence.freeness === 'open';

export interface LibraryGroup {
  id: string;
  labelKey: string;
  noteKey: string;
}

export interface LibraryEntry {
  title: string;
  /** One line on what it actually contains, not a slogan. */
  what: string;
  url: string;
  licence: Licence;
  /** Languages the material is available in, if not all of them. */
  languages?: string;
  /** Government or not. Not a judgement — some visitors trust a .gov.in more. */
  government?: boolean;
  /** True when no account or sign-up is needed. */
  noSignup: boolean;
}

export const GROUPS: LibraryGroup[] = [
  { id: 'padhai', labelKey: 'lib.group.padhai', noteKey: 'lib.group.padhai.note' },
  { id: 'kitab', labelKey: 'lib.group.kitab', noteKey: 'lib.group.kitab.note' },
  { id: 'tasveer', labelKey: 'lib.group.tasveer', noteKey: 'lib.group.tasveer.note' },
  { id: 'audio', labelKey: 'lib.group.audio', noteKey: 'lib.group.audio.note' },
];

export const LICENCES = {
  ccBy: { freeness: 'open', name: 'CC BY 4.0', shares: 'Aap ise copy, share aur chhapwa sakte ho — sirf credit dena hoga.' },
  ccBySa: { freeness: 'open', name: 'CC BY-SA 4.0', shares: 'Aap ise copy aur chhapwa sakte ho. Jo badlav karein, wahi bhi khul kar dena hoga.' },
  ccZero: { freeness: 'open', name: 'CC0 / Public domain', shares: 'Bilkul free. Credit bhi zaroori nahi.' },
  pd: { freeness: 'open', name: 'Public domain', shares: 'Kisi ka copyright nahi — jo chahein copy kar sakte ho.' },
  govtIndia: {
    freeness: 'open',
    name: 'Government of India',
    shares: 'Bharat sarkar ki website par. Padhna aur chhapwana dono free.',
  },
  creativeCommons: {
    freeness: 'open',
    name: 'Creative Commons (mixed)',
    shares: 'Har file ka apna licence hai — file par dekhiye.',
  },
  freeToRead: {
    freeness: 'free',
    name: 'Free to read',
    shares: 'Padhna free hai. Copy karke aage dena kisi aur ke condition par hai.',
  },
} satisfies Record<string, Licence>;

export const ENTRIES: Array<LibraryEntry & { group: string }> = [
  /* ------------------------------------------------------ शिक्षा / education */
  {
    group: 'padhai',
    title: 'NCERT किताबें — कक्षा 1 से 12 तक',
    what: 'हर विषय की सारी किताबें, अभी हर कक्षा के लिए। बिना लॉगिन, सीधी PDF।',
    url: 'https://ncert.nic.in/textbook.php',
    licence: LICENCES.freeToRead,
    languages: 'हिंदी, अंग्रेज़ी और 30 से ज़्यादा भारतीय भाषाएँ',
    government: true,
    noSignup: true,
  },
  {
    group: 'padhai',
    title: 'PM eVIDYA — डिजिटल पाठ्यपुस्तक',
    what: 'NCERT की किताबों का ऐप, बड़े अक्षर में पढ़ा जा सकता है। बोलकर भी सुन सकते हैं।',
    url: 'https://pmvidya.education.gov.in/',
    licence: LICENCES.freeToRead,
    languages: 'भारतीय भाषाएँ',
    government: true,
    noSignup: true,
  },
  {
    group: 'padhai',
    title: 'DIKSHA — शिक्षकों और बच्चों के लिए',
    what: 'पाठ्यक्रम, वीडियो और अभ्यास — कक्षा 1 से 12 तक।',
    url: 'https://diksha.gov.in/',
    licence: LICENCES.freeToRead,
    languages: 'भारतीय भाषाएँ',
    government: true,
    noSignup: true,
  },
  {
    group: 'padhai',
    title: 'Khan Academy — अंग्रेज़ी में गणित और विज्ञान',
    what: 'वीडियो पाठ, हर कक्षा तक। सीधे पढ़ने वालों के लिए भी लिखित है।',
    url: 'https://www.khanacademy.org/in/',
    licence: LICENCES.ccBy,
    noSignup: true,
  },
  {
    group: 'padhai',
    title: 'OpenStax — अंग्रेज़ी में मुफ़्त किताबें',
    what: 'कॉलेज स्तर की किताबें — गणित, विज्ञान, मानविकी। हर पन्ने पर PDF।',
    url: 'https://openstax.org/subjects',
    licence: LICENCES.ccBy,
    noSignup: true,
  },
  {
    group: 'padhai',
    title: 'NIOS — दूरस्थ शिक्षा, मुफ़्त सामग्री',
    what: 'ओपन और ऑनलाइन कोर्स की मुफ़्त पुस्तिकाएँ, बिना दाखिले के।',
    url: 'https://www.nios.ac.in/',
    licence: LICENCES.freeToRead,
    languages: 'हिंदी, अंग्रेज़ी और अन्य',
    government: true,
    noSignup: true,
  },
  {
    group: 'padhai',
    title: 'IGNOU — बड़े स्कूल की मुफ़्त पुस्तकें',
    what: 'दूरस्थ शिक्षा की किताबें जो बिल्कुल मुफ़्त मिलती हैं।',
    url: 'https://www.ignou.ac.in/econtent/',
    licence: LICENCES.freeToRead,
    government: true,
    noSignup: true,
  },

  /* ------------------------------------------------- पुस्तकें / free books */
  {
    group: 'kitab',
    title: 'Project Gutenberg — अंग्रेज़ी की पुरानी किताबें',
    what: '70,000 से ज़्यादा किताबें, सब की copyright समाप्त। मुफ़्त ई-बुक और ऑडियो।',
    url: 'https://www.gutenberg.org/',
    licence: LICENCES.pd,
    noSignup: true,
  },
  {
    group: 'kitab',
    title: 'Pratham Books — बच्चों की किताबें',
    what: 'भारतीय भाषाओं में बच्चों की किताबें, बिल्कुल मुफ़्त। कक्षा 1 से 5 के लिए।',
    url: 'https://prathambooks.org/',
    licence: LICENCES.ccBySa,
    languages: 'हिंदी, मराठी, बंगाली, तमिल, तेलुगु और अन्य',
    noSignup: true,
  },
  {
    group: 'kitab',
    title: 'Internet Archive — अख़बार और पुरानी पत्रिकाएँ',
    what: 'लाखों पुरानी किताबें, पत्रिकाएँ और अख़बार — मुफ़्त।',
    url: 'https://archive.org/details/texts',
    licence: LICENCES.creativeCommons,
    noSignup: true,
  },
  {
    group: 'kitab',
    title: 'Wikisource — जन-गद्य पाठ',
    what: 'कोई कॉपीराइट नहीं — ये सबकी दुनिया की पुरानी साहित्यिक किताबें हैं।',
    url: 'https://en.wikisource.org/wiki/Main_Page',
    licence: LICENCES.pd,
    noSignup: true,
  },

  /* ------------------------------------------------ तस्वीरें / images */
  {
    group: 'tasveer',
    title: 'Wikimedia Commons — हर तस्वीर',
    what: 'उपजाति, नक्शा, तारे, ऐतिहास — सब कुछ। हर तस्वीर पर अलग लाइसेंस लिखा है।',
    url: 'https://commons.wikimedia.org/wiki/Main_Page',
    licence: LICENCES.creativeCommons,
    noSignup: true,
  },
  {
    group: 'tasveer',
    title: 'Pixabay — तस्वीरें और चित्र',
    what: 'तस्वीरें, रेखाचित्र और छोटी वीडियो।',
    url: 'https://pixabay.com/images/',
    licence: LICENCES.creativeCommons,
    noSignup: true,
  },
  {
    group: 'tasveer',
    title: 'Unsplash — सुंदर तस्वीरें',
    what: 'मुफ़्त, बड़े अक्षर में, बिना अकाउंट के।',
    url: 'https://unsplash.com/photos',
    licence: LICENCES.freeToRead,
    noSignup: true,
  },
  {
    group: 'tasveer',
    title: 'Openverse — सब तस्वीरें एक जगह',
    what: 'कई मुफ़्त तस्वीरों के साइट एक साथ खोजें।',
    url: 'https://openverse.org/',
    licence: LICENCES.ccBy,
    noSignup: true,
  },

  /* -------------------------------------------------------- audio / audio */
  {
    group: 'audio',
    title: 'LibriVox — सुनकर किताबें',
    what: 'पुरानी अंग्रेज़ी किताबों का मुफ़्त ऑडियो, मनुष्य की आवाज़ में।',
    url: 'https://librivox.org/',
    licence: LICENCES.pd,
    noSignup: true,
  },
  {
    group: 'audio',
    title: 'Internet Archive — ऑडियो संग्रह',
    what: 'हज़ारों मुफ़्त ऑडियो — किताबें, भाषण, संगीत।',
    url: 'https://archive.org/details/audio',
    licence: LICENCES.creativeCommons,
    noSignup: true,
  },
  {
    group: 'audio',
    title: 'Vande Mataram — राष्ट्रीय गान और गीत',
    what: 'भारत का राष्ट्रीय गान और अन्य राष्ट्रीय गीत, मुफ़्त।',
    url: 'https://www.indiaculture.gov.in/',
    licence: LICENCES.freeToRead,
    government: true,
    noSignup: true,
  },
];