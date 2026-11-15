/**
 * ===========================================================================
 *  VERIFIED AARTI TEXTS — the words come from here, never from the model
 * ===========================================================================
 *
 * The owner asked for the aarti page to play real singers instead of a made-up
 * voice. The audio was fixed. But the answers had the same disease in text: ask
 * the model for "मराठी गणपतीची आरती" and it wrote back lines that are not in any
 * aarti — "पूर्वीιकृती कृपा जयाची", "रक्तंबर मंबर गोद करू कैशी" — and even put
 * the site's own name into the verse. The owner's verdict was exact: "कौनसी
 * भाषा है ये भी नहीं पता". A prayer with invented words is worse than no prayer.
 *
 * So recited text is no longer generated. It is stored. The model may explain,
 * compare, translate meaning, and answer anything else; it may not write the
 * words of an aarti.
 *
 * ── Where each text comes from ─────────────────────────────────────────────
 *
 * Every aarti below is one of the six recordings on `/aarti`, and every text was
 * checked against that recording: the sung words were transcribed from the
 * publisher's own MP3 and compared with the printed traditional form line by
 * line. Where a singer's variant differs from the common print ("सदा सुहाई" for
 * "सदा सहाई"), the text follows the recording, because that is what a visitor
 * will hear when they press play.
 *
 * Nothing is added to these texts and nothing is left out. The Devanagari stays
 * Devanagari in every language: a sacred text is never translated, and a
 * transliteration is a copy of the sound, not a licence to reword it.
 *
 * ── What happens when the text is not here ─────────────────────────────────
 *
 * The answer says so, plainly, and lists what is available. That is deliberate.
 * The owner's standing rule is that a wrong answer must be removed rather than
 * shown; a half-remembered aarti in a confident voice is exactly the wrong
 * answer this file exists to stop.
 *
 * To add a seventh: verify the words against a real recording or a published
 * source, add one entry to `AARTIS`, and add the deity's words to `DEITIES`.
 */

import { stringsFor } from './i18n';

/** Which deity an aarti belongs to, and which language it is sung in. */
export interface AartiText {
  /** Matches the recording slug on `/aarti`. */
  slug: string;
  /** The aarti's own name, in Devanagari, as it is written in the tradition. */
  name: string;
  /** The language it is sung in, in that language's own script. */
  sungIn: string;
  /** One line, in Devanagari, saying whose aarti it is. */
  dedication: string;
  /** The words, in order, with an empty string where a verse breaks. */
  lines: string[];
}

export const AARTIS: AartiText[] = [
  {
    slug: 'aarti-sukhkarta-dukhharta',
    name: 'सुखकर्ता दुःखहर्ता',
    sungIn: 'मराठी',
    dedication: 'श्री गणपतीची आरती',
    lines: [
      'सुखकर्ता दुःखहर्ता वार्ता विघ्नाची ।',
      'नुरवी पुरवी प्रेम कृपा जयाची ।',
      'सर्वांगी सुंदर उटी शेंदुराची ।',
      'कंठी झळके माळ मुक्ताफळांची ॥ १ ॥',
      '',
      'जय देव जय देव जय मंगलमूर्ती ।',
      'दर्शनमात्रे मनकामना पुरती ॥ ध्रु ॥',
      '',
      'रत्नखचित फरा तुज गौरीकुमरा ।',
      'चंदनाची उटी कुंकुम केशरा ।',
      'हिरेजडित मुकुट शोभतो बरा ।',
      'रुणझुणती नूपुरे चरणी घागरिया ॥ २ ॥',
      '',
      'जय देव जय देव जय मंगलमूर्ती ।',
      'दर्शनमात्रे मनकामना पुरती ॥ ध्रु ॥',
      '',
      'लंबोदर पीतांबर फणिवरबंधना ।',
      'सरळ सोंड वक्रतुंड त्रिनयना ।',
      'दास रामाचा वाट पाहे सदना ।',
      'संकटी पावावे निर्वाणी रक्षावे सुरवरवंदना ॥ ३ ॥',
      '',
      'जय देव जय देव जय मंगलमूर्ती ।',
      'दर्शनमात्रे मनकामना पुरती ॥ ध्रु ॥',
    ],
  },
  {
    slug: 'aarti-jai-ganesh-deva',
    name: 'जय गणेश जय गणेश जय गणेश देवा',
    sungIn: 'हिंदी',
    dedication: 'श्री गणेश की आरती',
    lines: [
      'जय गणेश जय गणेश जय गणेश देवा ।',
      'माता जाकी पार्वती पिता महादेवा ॥',
      '',
      'एकदंत दयावंत चार भुजाधारी ।',
      'माथे सिंदूर सोहे मूसे की सवारी ॥',
      '',
      'पान चढ़े फूल चढ़े और चढ़े मेवा ।',
      'लड्डुअन का भोग लगे संत करें सेवा ॥',
      '',
      'अंधन को आँख देत कोढ़िन को काया ।',
      'बांझन को पुत्र देत निर्धन को माया ॥',
      '',
      'शूर श्याम शरण आए सफल कीजे सेवा ।',
      'जय गणेश जय गणेश जय गणेश देवा ॥',
    ],
  },
  {
    slug: 'aarti-om-jai-jagdish-hare',
    name: 'ॐ जय जगदीश हरे',
    sungIn: 'हिंदी',
    dedication: 'श्री विष्णु जी की आरती',
    lines: [
      'ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।',
      'भक्त जनों के संकट, क्षण में दूर करे ॥',
      '',
      'जो ध्यावे फल पावे, दुख बिनसे मन का ।',
      'स्वामी दुख बिनसे मन का ।',
      'सुख सम्पति घर आवे, कष्ट मिटे तन का ॥',
      '',
      'माता पिता तुम मेरे, शरण गहूँ मैं किसकी ।',
      'स्वामी शरण गहूँ मैं किसकी ।',
      'तुम बिन और न दूजा, आस करूँ मैं जिसकी ॥',
      '',
      'तुम पूरण परमात्मा, तुम अंतर्यामी ।',
      'स्वामी तुम अंतर्यामी ।',
      'पारब्रह्म परमेश्वर, तुम सबके स्वामी ॥',
      '',
      'तुम करुणा के सागर, तुम पालनकर्ता ।',
      'स्वामी तुम पालनकर्ता ।',
      'मैं मूरख खल कामी, कृपा करो भर्ता ॥',
      '',
      'तुम हो एक अगोचर, सबके प्राणपति ।',
      'स्वामी सबके प्राणपति ।',
      'किस विधि मिलूँ दयामय, तुमको मैं कुमति ॥',
      '',
      'दीन-दयाल दयानिधि, तुम हो मेरे स्वामी ।',
      'स्वामी तुम हो मेरे स्वामी ।',
      'दुख दरिद्र निवारण, ठाकुर तुम्हारे नामी ॥',
      '',
      'ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।',
      'भक्त जनों के संकट, क्षण में दूर करे ॥',
    ],
  },
  {
    slug: 'aarti-jai-ambe-gauri',
    name: 'जय अम्बे गौरी',
    sungIn: 'हिंदी',
    dedication: 'श्री दुर्गा जी की आरती',
    lines: [
      'जय अम्बे गौरी, मैया जय श्यामा गौरी ।',
      'तुमको निसिदिन ध्यावत, हरि ब्रह्मा शिवरी ॥',
      '',
      'मांग सिंदूर विराजत, टीको मृगमद को ।',
      'उज्ज्वल से दोउ नैना, चंद्रवदन नीको ॥',
      '',
      'कनक समान कलेवर, रक्ताम्बर राजै ।',
      'रक्तपुष्प गल माला, कंठन पर साजै ॥',
      '',
      'केहरि वाहन राजत, खड्ग खप्पर धारी ।',
      'सुर-नर-मुनिजन सेवत, तिनके दुखहारी ॥',
      '',
      'कानन कुंडल शोभित, नासाग्रे मोती ।',
      'कोटिक चंद्र दिवाकर, राजत सम ज्योति ॥',
      '',
      'शुंभ निशुंभ विदार्ये, महिषासुर घातियो ।',
      'धूम्र विलोचन नैना, निशदिन मदमाती ॥',
      '',
      'चंड मुंड संहारे, शोणित बीज हरे ।',
      'मधु कैटभ दोउ मारे, सुर भयहीन करे ॥',
      '',
      'ब्रह्माणी रुद्राणी, तुम कमला रानी ।',
      'आगम निगम बखानी, तुम शिव पटरानी ॥',
      '',
      'चौंसठ योगिनि गावत, नृत्य करत भैरव ।',
      'बाजत ताल मृदंगा, और बाजत डमरू ॥',
      '',
      'श्री अम्बे जी की आरती, जो कोई नर गावे ।',
      'कहत शिवानंद स्वामी, सुख संपति पावे ॥',
    ],
  },
  {
    slug: 'aarti-jai-saraswati-mata',
    name: 'जय सरस्वती माता',
    sungIn: 'हिंदी',
    dedication: 'श्री सरस्वती जी की आरती',
    lines: [
      'जय सरस्वती माता, मैया जय सरस्वती माता ।',
      'सद्गुण वैभव शालिनी, त्रिभुवन विख्याता ॥',
      '',
      'चंद्रवदनी पद्मासनी, दयते मंगलकारी ।',
      'सोहे शुभ हंस सवारी, अतुल तेजधारी ॥',
      '',
      'बाएँ कर में वीणा, दायें कर में माला ।',
      'शीश मुकुट मणि सोहे, गल मोतियों माला ॥',
      '',
      'देवी शरण जो आए, उनका उद्धार किया ।',
      'बैठी मंदिर दासी, रावण संहार किया ॥',
      '',
      'विद्या ज्ञान की प्रदायनी, ज्ञान प्रकाश भरो ।',
      'मोह अज्ञान और तिमिर का, जग से नाश करो ॥',
      '',
      'धूप दीप फल मेवा, मां स्वीकार करो ।',
      'ज्ञान चक्षु दे माता, जग निस्तार करो ॥',
      '',
      'मां सरस्वती जी की आरती, जो कोई जन गावे ।',
      'हितकारी सुखकारी, ज्ञान भक्ति पावे ॥',
    ],
  },
  {
    slug: 'aarti-hanuman-lala-ki',
    name: 'आरती कीजै हनुमान लला की',
    sungIn: 'हिंदी',
    dedication: 'श्री हनुमान जी की आरती',
    lines: [
      'आरती कीजै हनुमान लला की ।',
      'दुष्ट दलन रघुनाथ कला की ॥',
      '',
      'जाके बल से गिरिवर कांपे ।',
      'रोग दोष जाके निकट न झांपे ॥',
      '',
      'अंजनि पुत्र महा बलदाई ।',
      'संतन के प्रभु सदा सुहाई ॥',
      '',
      'दे बीरा रघुनाथ पठाये ।',
      'लंका जारि सिया सुधि लाये ॥',
      '',
      'लंका सो कोट समुद्र सी खाई ।',
      'जात पवनसुत बार न लाई ॥',
      '',
      'लंका जारि असुर संहारे ।',
      'सियारामजी के काज सँवारे ॥',
      '',
      'लक्ष्मण मूर्छित पड़े सुधारे ।',
      'आनि संजीवन प्राण उबारे ॥',
      '',
      'पैठि पाताल तोरि जमकाया ।',
      'अहिरावण की भुजा काटी काया ॥',
      '',
      'बांधे मूंद पर प्रभु जब आए ।',
      'कपि सबै हरषित देवन गाए ॥',
      '',
      'सब सुख लहै तुम्हारी सरना ।',
      'तुम रक्षक काहू को डर ना ॥',
      '',
      'आपन तेज सम्हारो आपै ।',
      'तीनों लोक हाँक तें काँपै ॥',
      '',
      'भूत पिशाच निकट नहिं आवै ।',
      'महावीर जब नाम सुनावै ॥',
      '',
      'नासै रोग हरै सब पीरा ।',
      'जपत निरंतर हनुमत बीरा ॥',
      '',
      'संकट तें हनुमान छुड़ावै ।',
      'मन क्रम वचन ध्यान जो लावै ॥',
      '',
      'राम रसायन तुम्हारे पासा ।',
      'सदा रहो रघुपति के दासा ॥',
    ],
  },
];

/**
 * The words a visitor uses to name a deity, in the scripts this site is read in.
 *
 * Kept deliberately wider than the six texts above. If somebody asks for the
 * Lakshmi aarti, the honest answer is "that text is not verified here yet" —
 * not a confident invention — and that answer is only reachable if the deity is
 * recognised in the first place.
 */
const DEITIES: Array<{ id: string; words: string[] }> = [
  { id: 'jagdish', words: ['जगदीश', 'जगदीशहरे', 'jagdish', 'विष्णु', 'vishnu', 'नारायण', 'narayan'] },
  {
    id: 'ambe',
    words: [
      'अम्बे',
      'अंबे',
      'अम्बे गौरी',
      'ambe',
      'ambey',
      'अम्बेगौरी',
      'दुर्गा',
      'durga',
      'गौरी',
      'gauri',
      'शेरावाली',
      'sheranwali',
      'शेरा वाली',
      'काली',
      'kali',
    ],
  },
  { id: 'saraswati', words: ['सरस्वती', 'saraswati', 'सरस्वती माता', 'शारदा', 'sharda'] },
  {
    id: 'hanuman',
    words: ['हनुमान', 'hanuman', 'बजरंग', 'bajrang', 'बजरंगबली', 'bajrangbali', 'महावीर', 'mahavir'],
  },
  { id: 'lakshmi', words: ['लक्ष्मी', 'laxmi', 'lakshmi', 'महालक्ष्मी', 'mahalakshmi'] },
  { id: 'shiv', words: ['शिव', 'shiv', 'शंकर', 'shankar', 'शंकर जी', 'महादेव', 'mahadev', 'भोलेनाथ', 'bholenath'] },
  { id: 'viththal', words: ['विठ्ठल', 'विठोबा', 'vitthal', 'vithoba', 'पांडुरंग', 'pandurang'] },
  { id: 'datta', words: ['दत्त', 'दत्तात्रेय', 'datta', 'dattatreya'] },
  { id: 'satyanarayan', words: ['सत्यनारायण', 'satyanarayan', 'सत्य नारायण'] },
  { id: 'krishna', words: ['कृष्ण', 'krishna', 'गोविंद', 'govind', 'राधे', 'radhe', 'युगल'] },
  { id: 'rama', words: ['राम', 'ram', 'रघुनाथ', 'raghunath', 'सीता', 'sita'] },
  { id: 'gayatri', words: ['गायत्री', 'gayatri'] },
  { id: 'santoshi', words: ['संतोषी', 'santoshi'] },
  { id: 'shani', words: ['शनि', 'shani'] },
  { id: 'ganga', words: ['गंगा', 'ganga', 'गंगे'] },
  { id: 'tulsi', words: ['तुलसी', 'tulsi'] },
  { id: 'sai', words: ['साई', 'sai'] },
  { id: 'khatu', words: ['खाटू', 'khatu', 'श्याम', 'shyam'] },
];

/** Is the visitor asking for the words of an aarti? */
const AARTI_QUESTION = /(आरती|आरता|आरत्यांच|aarati|aarti|\barti\b|\barati\b)/i;

/** Which aarti-text (if any) is already verified and stored here. */
function storedText(id: string): AartiText | null {
  const slugById: Record<string, string> = {
    'ganesh-mr': 'aarti-sukhkarta-dukhharta',
    'ganesh-hi': 'aarti-jai-ganesh-deva',
    jagdish: 'aarti-om-jai-jagdish-hare',
    ambe: 'aarti-jai-ambe-gauri',
    saraswati: 'aarti-jai-saraswati-mata',
    hanuman: 'aarti-hanuman-lala-ki',
  };
  const slug = slugById[id];
  return slug ? (AARTIS.find((a) => a.slug === slug) ?? null) : null;
}

/** The deity named in the question, or null. */
function deityIn(question: string, lang: string): string | null {
  const q = question.toLowerCase();

  /*
   * Ganpati first, and separately, because the language changes which aarti is
   * meant: a Marathi household means सुखकर्ता दुःखहर्ता, a Hindi one means जय
   * गणेश देवा, and a Marathi visitor who types "जय गणेश" has named the Hindi
   * one on purpose.
   */
  if (/सुखकर्ता|sukhkarta|दुःखहर्ता|dukhharta/.test(q)) return 'ganesh-mr';
  if (/जय\s*गणेश|jai\s*ganesh/.test(q)) return 'ganesh-hi';
  if (/गणेश|गणपती|गणपति|ganesh|ganpati|ganapati/.test(q)) {
    return lang === 'mr' ? 'ganesh-mr' : 'ganesh-hi';
  }

  for (const deity of DEITIES) {
    if (deity.words.some((word) => q.includes(word.toLowerCase()))) return deity.id;
  }
  return null;
}

/** Where the real recordings live, so the answer can point at them. */
const LISTEN_URL = `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://varsha-samadhan.vercel.app').replace(/\/+$/, '')}/aarti`;

/**
 * The answer to an aarti question, or null when the question is not one.
 *
 * Returns finished text in the visitor's language. The words of the aarti stay
 * in Devanagari in every language: they are the prayer itself, and a copy of the
 * prayer is not a translation of it.
 */
export function aartiAnswer(question: string, lang: string): { answer: string; slug: string } | null {
  if (!AARTI_QUESTION.test(question)) return null;

  const t = stringsFor(lang);
  const id = deityIn(question, lang);

  // "आरती कैसे करें" is a method question, not a request for words. No deity
  // named means the model should answer it; only a named deity is handled here.
  if (!id) return null;

  const stored = storedText(id);

  if (stored) {
    const answer = [
      `${stored.name} — ${stored.dedication} (${stored.sungIn})`,
      '',
      ...stored.lines,
      '',
      t('aarti.textChecked'),
      `${t('aarti.listenLink')}: ${LISTEN_URL}`,
    ]
      .join('\n')
      .trim();

    return { answer, slug: stored.slug };
  }

  const answer = [
    t('aarti.notChecked'),
    '',
    t('aarti.verifiedList'),
    ...AARTIS.map((a) => `• ${a.name} — ${a.dedication} (${a.sungIn})`),
    '',
    `${t('aarti.listenLink')}: ${LISTEN_URL}`,
  ]
    .join('\n')
    .trim();

  return { answer, slug: '' };
}
