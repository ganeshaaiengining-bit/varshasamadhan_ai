/**
 * ============================================================================
 *  LANGUAGES
 * ============================================================================
 *
 * Every string the interface can show, in every language the site offers.
 *
 * ============================================================================
 *  WHY THE SERVER NEEDS TO KNOW THE LANGUAGE
 * ============================================================================
 *
 * The pages are server components — they read categories and articles from the
 * database before rendering. A React context on the client cannot help them: the
 * server has already produced the HTML by then, and the visitor sees Hindi
 * until something re-renders it. That was the actual bug: switching the language
 * changed `<html lang>` and nothing else.
 *
 * So the chosen language is stored in a cookie and read back on the server.
 * `src/server/i18n.ts` does the reading; this file only holds the data.
 *
 * ============================================================================
 *  SCOPE, STATED PLAINLY
 * ============================================================================
 *
 * This translates the **interface** — navigation, buttons, labels, headings,
 * form prompts, error messages, page furniture. That is roughly 120 strings and
 * it covers everything a visitor uses to *navigate and operate* the site.
 *
 * It does **not** translate the 16 advice articles. Those are long-form prose
 * stored in the database, in Hindi, written for this site. Translating them
 * properly is a separate piece of work, and pretending otherwise would be worse
 * than saying so: a Tamil speaker handed a Tamil interface and an English
 * article body would conclude the site is broken rather than half-translated.
 *
 * So article and category *bodies* stay Hindi, and pages that show them carry a
 * visible notice saying which language the text is in. The article titles and
 * summaries are translated, so someone scanning a list in Tamil sees what each
 * piece is about before opening it.
 *
 * ============================================================================
 *  THE FALLBACK CHAIN, AND WHY IT IS NOT SIMPLE
 * ============================================================================
 *
 * Resolution order: chosen language, then **English**, then Hindi, then the key.
 *
 * The first version fell back straight to Hindi. That is wrong for the audience
 * this site exists for: a Tamil speaker who selects Tamil and lands on an
 * untranslated string would be shown Hindi, which they cannot read — strictly
 * worse than English, which many can at least get by. English is a far better
 * second language than Hindi is, so it goes in between.
 *
 * A missing key renders as its own key name (`ask.send`) so a gap is visible in
 * review rather than silently showing an empty button.
 *
 * ============================================================================
 *  EDITING
 * ============================================================================
 *
 * This is plain data, not code. Correcting a wording is a one-line edit with no
 * risk to the build. Adding a language means adding one table.
 */

/* -------------------------------------------------------------------------- */

export interface Language {
  code: string;
  /** Shown in its own script, which is the only reliable way to find your own. */
  native: string;
  /** Shown in Latin script, so it is findable by someone who cannot read it. */
  english: string;
  direction: 'ltr' | 'rtl';
}

/**
 * Ordered by how many people speak it, roughly. The Indian languages come first
 * because that is who this service is for; the rest follow so a visitor from
 * anywhere on earth can still read the interface.
 */
export const LANGUAGES: Language[] = [
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', direction: 'ltr' },
  { code: 'en', native: 'English', english: 'English', direction: 'ltr' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', direction: 'ltr' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', direction: 'ltr' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', direction: 'ltr' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', direction: 'ltr' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', direction: 'ltr' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', direction: 'ltr' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam', direction: 'ltr' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', direction: 'ltr' },
  { code: 'ur', native: 'اردو', english: 'Urdu', direction: 'rtl' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese', direction: 'ltr' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', direction: 'ltr' },
  { code: 'ne', native: 'नेपाली', english: 'Nepali', direction: 'ltr' },
  { code: 'sa', native: 'संस्कृतम्', english: 'Sanskrit', direction: 'ltr' },
  { code: 'ks', native: 'کٲشُر', english: 'Kashmiri', direction: 'rtl' },
  { code: 'sd', native: 'سنڌي', english: 'Sindhi', direction: 'rtl' },
  { code: 'kok', native: 'कोंकणी', english: 'Konkani', direction: 'ltr' },
  { code: 'mai', native: 'मैथिली', english: 'Maithili', direction: 'ltr' },
  { code: 'doi', native: 'डोगरी', english: 'Dogri', direction: 'ltr' },
  { code: 'brx', native: 'बड़ो', english: 'Bodo', direction: 'ltr' },
  { code: 'mni', native: 'মৈতৈলোন্', english: 'Manipuri', direction: 'ltr' },
  { code: 'sat', native: 'ᱥᱟᱱᱛᱟᱲᱤ', english: 'Santali', direction: 'ltr' },
  { code: 'ar', native: 'العربية', english: 'Arabic', direction: 'rtl' },
  { code: 'es', native: 'Español', english: 'Spanish', direction: 'ltr' },

  /*
   * French, German, Portuguese, Russian and Chinese were listed here and had no
   * translation table behind them. A visitor who chose Russian was shown the
   * site in English with Hindi section headings mixed into the same page — 215
   * stray English words, measured by scripts/check-rendered-language.py.
   *
   * They are removed rather than left listed, because a language in this list
   * is a promise: everything below the switcher will be readable in it. Listing
   * one that cannot be honoured fails in the worst way, because it looks like
   * it worked — the page rendered, the layout was right, only the words were
   * wrong, and the visitor has no way to tell that is a fault rather than their
   * own reading.
   *
   * To add one back: write FRENCH, GERMAN, PORTUGUESE, RUSSIAN or CHINESE as a
   * table with the same keys as HINDI, add it to TABLES, then add the code
   * here. scripts/check-language-tables.py fails if the two lists disagree.
   */
];

/* -------------------------------------------------------------------------- */
/* HINDI — the source language                                                */
/* -------------------------------------------------------------------------- */

const HINDI: Record<string, string> = {
  'jgd.placeSearch': 'शहर का नाम लिखिए',
  'jgd.placeNoMatch': 'यह शहर सूची में नहीं है। इसके पास का शहर चुनिए।',

  'account.name': 'आपका नाम',
  'account.namePlaceholder': 'जैसे: सीता देवी',
  'account.nameHint': 'यह आपकी पहचान के लिए है। कोई भी नाम चलेगा, और यह ज़रूरी नहीं है।',

  /* ---- navigation ------------------------------------------------------- */
  'nav.home': 'होम', 'home.metaTitle': 'मुफ़्त समाधान, आपके अपने शब्दों में',
  'lib.licence.ccZero.name': 'CC0 / सार्वजनिक डोमेन',
  'lib.licence.pd.name': 'सार्वजनिक डोमेन',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिव कॉमन्स (मिश्रित)',
  'lib.licence.freeToRead.name': 'पढ़ने के लिए स्वतंत्र',
  'lib.entry.ncert.title': 'NCERT किताबें — कक्षा 1 से 12 तक',
  'lib.entry.ncert.what': 'हर विषय की सारी किताबें, अभी हर कक्षा के लिए। बिना लॉगिन, सीधी PDF।',
  'lib.entry.ncert.langs': 'हिंदी, अंग्रेज़ी और 30 से ज़्यादा भारतीय भाषाएँ',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल पाठ्यपुस्तक',
  'lib.entry.pm-evidya.what': 'NCERT की किताबों का ऐप, बड़े अक्षर में पढ़ा जा सकता है। बोलकर भी सुन सकते हैं।',
  'lib.entry.pm-evidya.langs': 'भारतीय भाषाएँ',
  'lib.entry.diksha.title': 'DIKSHA — शिक्षकों और बच्चों के लिए',
  'lib.entry.diksha.what': 'पाठ्यक्रम, वीडियो और अभ्यास — कक्षा 1 से 12 तक।',
  'lib.entry.diksha.langs': 'भारतीय भाषाएँ',
  'lib.entry.khan-academy.title': 'Khan Academy — अंग्रेज़ी में गणित और विज्ञान',
  'lib.entry.khan-academy.what': 'वीडियो पाठ, हर कक्षा तक। सीधे पढ़ने वालों के लिए भी लिखित है।',
  'lib.entry.openstax.title': 'OpenStax — अंग्रेज़ी में मुफ़्त किताबें',
  'lib.entry.openstax.what': 'कॉलेज स्तर की किताबें — गणित, विज्ञान, मानविकी। हर पन्ने पर PDF।',
  'lib.entry.nios.title': 'NIOS — दूरस्थ शिक्षा, मुफ़्त सामग्री',
  'lib.entry.nios.what': 'ओपन और ऑनलाइन कोर्स की मुफ़्त पुस्तिकाएँ, बिना दाखिले के।',
  'lib.entry.nios.langs': 'हिंदी, अंग्रेज़ी और अन्य',
  'lib.entry.ignou.title': 'IGNOU — बड़े स्कूल की मुफ़्त पुस्तकें',
  'lib.entry.ignou.what': 'दूरस्थ शिक्षा की किताबें जो बिल्कुल मुफ़्त मिलती हैं।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — अंग्रेज़ी की पुरानी किताबें',
  'lib.entry.gutenberg.what': '70,000 से ज़्यादा किताबें, सब की कॉपीराइट समाप्त। मुफ़्त ई-बुक और ऑडियो।',
  'lib.entry.pratham-books.title': 'Pratham Books — बच्चों की किताबें',
  'lib.entry.pratham-books.what': 'भारतीय भाषाओं में बच्चों की किताबें, बिल्कुल मुफ़्त। कक्षा 1 से 5 के लिए।',
  'lib.entry.pratham-books.langs': 'हिंदी, मराठी, बंगाली, तमिल, तेलुगु और अन्य',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — अख़बार और पुरानी पत्रिकाएँ',
  'lib.entry.internet-archive-texts.what': 'लाखों पुरानी किताबें, पत्रिकाएँ और अख़बार — मुफ़्त।',
  'lib.entry.wikisource.title': 'Wikisource — जन-गद्य पाठ',
  'lib.entry.wikisource.what': 'कोई कॉपीराइट नहीं — ये सबकी दुनिया की पुरानी साहित्यिक किताबें हैं।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — हर तस्वीर',
  'lib.entry.wikimedia-commons.what': 'उपजाति, नक्शा, तारे, ऐतिहास — सब कुछ। हर तस्वीर पर अलग लाइसेंस लिखा है।',
  'lib.entry.pixabay.title': 'Pixabay — तस्वीरें और चित्र',
  'lib.entry.pixabay.what': 'तस्वीरें, रेखाचित्र और छोटी वीडियो।',
  'lib.entry.unsplash.title': 'Unsplash — सुंदर तस्वीरें',
  'lib.entry.unsplash.what': 'मुफ़्त, बड़े अक्षर में, बिना अकाउंट के।',
  'lib.entry.openverse.title': 'Openverse — सब तस्वीरें एक जगह',
  'lib.entry.openverse.what': 'कई मुफ़्त तस्वीरों के साइट एक साथ खोजें।',
  'lib.entry.librivox.title': 'LibriVox — सुनकर किताबें',
  'lib.entry.librivox.what': 'पुरानी अंग्रेज़ी किताबों का मुफ़्त ऑडियो, मनुष्य की आवाज़ में।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ऑडियो संग्रह',
  'lib.entry.internet-archive-audio.what': 'हज़ारों मुफ़्त ऑडियो — किताबें, भाषण, संगीत।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राष्ट्रीय गान और गीत',
  'lib.entry.vande-mataram.what': 'भारत का राष्ट्रीय गान और अन्य राष्ट्रीय गीत, मुफ़्त।',
  'art.aag-aur-bijli-ke-bachav.title': 'आग और बिजली से बचाव के नियम',
  'art.aag-aur-bijli-ke-bachav.summary': 'घर में आग लगने की रोकथाम — सरल नियम',
  'art.aag-lagne-par-kya-karein.title': 'आग लग जाए तो क्या करें',
  'art.aag-lagne-par-kya-karein.summary': 'जलते हुए घर में आग — सबसे पहले क्या करें, क्या न करें',
  'art.bimari-se-bachav.title': 'संक्रमण से बचाव के सात नियम',
  'art.bimari-se-bachav.summary': 'हाथ धोना, मास्क, टीका — आदि से बचाव',
  'art.dhuwan-ka-jhakora.title': 'धुआँ के झकौर के बचाव',
  'art.dhuwan-ka-jhakora.summary': 'भरावूला, साँस नहीं चल रही — क्या करें, कब अस्पताल जाएँ',
  'art.doodh-pani-band-ho.title': 'बिजली या पानी अचानक बंद हो जाए',
  'art.doodh-pani-band-ho.summary': 'क्या करें, किससे बचें, कब मदद माँगें',
  'art.haath-ki-saafai.title': 'बिना साबुन के हाथ साफ़ करने का तरीक़ा',
  'art.haath-ki-saafai.summary': 'जब पानी या साबुन न हो',
  'cat.dhyan-aur-yoog.title': 'ध्यान और योग',
  'cat.dhyan-aur-yoog.subtitle': 'मन शांत करने के सरल उपाय',
  'cat.gharelu-marammat.title': 'घरेलू मरम्मत',
  'cat.gharelu-marammat.subtitle': 'घर की छोटी-छोटी समस्याओं का हल',
  'cat.bachchon-ki-padhai.title': 'बच्चों की पढ़ाई',
  'cat.bachchon-ki-padhai.subtitle': 'पढ़ाई में लगे, परेशान हों',
  'cat.budharge-seva.title': 'बुज़ुर्गों की सेवा',
  'cat.budharge-seva.subtitle': 'देखभाल और सहायता',
  'cat.shishu-dekhbhal.title': 'शिशु देखभाल',
  'cat.shishu-dekhbhal.subtitle': 'नन्हे बच्चे की सही देखभाल',
  'cat.dharmik-upay.title': 'धार्मिक उपाय',
  'cat.dharmik-upay.subtitle': 'मन की शांति के साथ',
  'cat.pavan-grah-aur-aarti.title': 'पावन ग्रंथ व आरती',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धा से पढ़ें और सुनें',
  'cat.aapatkalen-gayide.title': 'आपातकालीन गाइड',
  'cat.aapatkalen-gayide.subtitle': 'जब तुरंत मदद चाहिए',
  'cat.mahamari-suraksha.title': 'महामारी सुरक्षा',
  'cat.mahamari-suraksha.subtitle': 'बीमारी फैलने से बचाव',
  'nav.tribute': 'स्मृति',
  'nav.help': 'सहायता',
  'nav.reference': 'संदर्भ',
  'nav.reviews': 'राय',
  'nav.support': 'मदद करें',
  'nav.birthChart': 'जन्म गण्ठा',
  'jgd.title': 'आपकी जन्म गण्ठा',
  'jgd.intro': 'अपना नाम, जन्म की तारीख़, और हो सके तो जन्म का समय और स्थान लिखिए। सब गणना आपके फ़ोन पर ही होगी — कुछ भी कहीं भेजा नहीं जाता।',
  'jgd.nameLabel': 'जन्म का नाम',
  'jgd.namePlaceholder': 'जैसे पूरा नाम',
  'jgd.nameHint': 'जो नाम बचपन में पड़ा था, वही लिखिए।',
  'jgd.dateLabel': 'जन्म की तारीख़',
  'jgd.timeLabel': 'जन्म का समय',
  'jgd.timeHint': 'न जानें तो खाली छोड़ दीजिए।',
  'jgd.placeLabel': 'जन्म का स्थान',
  'jgd.placeNone': 'पता नहीं / चुनें',
  'jgd.placeHint': 'जन्म का शहर चुनिए।',
  'jgd.submit': 'गणना करें',
  'jgd.savePdf': 'PDF बनाएँ',
  'jgd.again': 'नई गणना',
  'jgd.errDate': 'कृपया जन्म की तारीख़ सही लिखिए।',
  'jgd.errPlace': 'जन्म का शहर सूची से चुनिए, या उसके पास का शहर चुनिए।',
  'jgd.numTitle': 'अंक ज्योतिष',
  'jgd.lifePath': 'जीवन पथ',
  'jgd.nameNumber': 'नाम अंक',
  'jgd.soulNumber': 'आत्मा अंक',
  'jgd.birthdayNumber': 'जन्म दिन अंक',
  'jgd.astroTitle': 'वैदिक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'पद',
  'jgd.rashi': 'राशि',
  'jgd.rashiLord': 'राशि स्वामी',
  'jgd.nakshatraLord': 'नक्षत्र स्वामी',
  'jgd.lagna': 'लग्न',
  'jgd.lagnaMissing': 'लग्न निकालने के लिए जन्म का समय और स्थान चाहिए। ऊपर भरकर फिर गणना करें, और न जानें तो यही भी बहुत है।',
  'jgd.gunTitle': 'गुण मिलान',
  'jgd.gunIntro': 'दूसरे व्यक्ति का नाम और जन्मतारीख भरिए।',
  'jgd.gunName': 'उसका नाम',
  'jgd.gunDate': 'उसकी जन्मतारीख',
  'jgd.gunHint': 'दोनों का नाम और जन्मतारीख हो तो गुण मिलान निकलेगा।',
  'jgd.disclaimer': 'यह परंपरा के अनुसार की गई गणना है, भविष्यवाणी नहीं। कोई संख्या या राशि किसी का स्वास्थ्य, धन या रिश्ता तय नहीं करती। बड़े फैसले डॉक्टर, कानूनी सलाह या अनुभवी की सलाह से लें।',
  'nav.menu': 'मेन्यू',
  'nav.openMenu': 'मेन्यू खोलें',
  'nav.closeMenu': 'मेन्यू बंद करें',
  'nav.expand': 'बाँस खोलें',
  'nav.collapse': 'बाँस बंद करें',
  'nav.skip': 'सीधे सामग्री पर जाएँ',
  'nav.language': 'भाषा बदलें',

  /* ---- footer ----------------------------------------------------------- */
  'footer.pages': 'पन्ने',
  'footer.helplines': 'ज़रूरी नंबर',
  'footer.free': 'यह सेवा पूरी तरह निःशुल्क है। किसी से कोई पैसा नहीं लिया जाता।',
  'footer.readStory': 'उनकी पूरी कथा पढ़िए',
  'footer.admin': 'प्रबंधक',
  'footer.rights': 'निःशुल्क सेवा',
  'footer.emergency': 'आपातकाल',
  'footer.ambulance': 'एम्बुलेंस',
  'footer.women': 'महिला हेल्पलाइन',

  /* ---- home ------------------------------------------------------------- */
  'home.dedication1': 'की स्मृति में — एक पूरी तरह निःशुल्क सेवा।',
  'home.dedication2': 'अपनी समस्या लिखिए या बोलिए।',
  'home.emergencyTitle': 'ज़रूरी — तुरंत मदद चाहिए',
  'home.emergencyNote': 'ये सबसे पहले पढ़ें। बाकी सब बाद में देखा जा सकता है।',
  'home.readMore': 'पूरी जानकारी पढ़ें',
  'home.chooseTopic': 'किस विषय में जानना है?',
  'home.memorialEyebrow': 'यह साइट किसके लिए है',
  'home.memorialLine': 'जिन्होंने समाज के लिए ज़िंदगी भर लड़ाई लड़ी, और जिन्हें आख़िर में अपने हिस्से का हिसाब नहीं मिला।',
  'home.memorialMore': 'उनकी पूरी कहानी पढ़िए',
  'home.kundaliTitle': 'जन्म गण्ठा',
  'home.kundaliNote': 'पूरी कुंडली — 9 ग्रह, विमशोत्तरी दशा, फलादेश, योग, शोडशवर्ग, केपी, लाल किताब और अंक ज्योतिष। सब आपके फ़ोन पर ही गणना होगी।',
  'home.chooseTopicNote':
    'नीचे दिए गए विषय पर टैप कीजिए। हर जगह सरल भाषा में जानकारी दी गई है।',
  'home.askHere': 'इसी विषय में पूछें',
  'home.categoryEmpty': 'इस विषय में अभी कुछ नहीं लिखा गया है।',
  'home.soundTitle': 'शांति के लिए ध्वनि',
  'home.soundIntro': 'कोई शुल्क नहीं, कोई विज्ञापन नहीं। बस मन शांत करने के लिए।',
  'home.howTitle': 'यह सेवा कैसे काम करती है',
  'home.step1Title': 'अपनी बात लिखिए या बोलिए',
  'home.step1Body':
    'हिंदी में टाइप कीजिए, या माइक दबाकर बोलिए। कुछ भी खास नहीं करना — जो मन में है वही लिख दीजिए।',
  'home.step2Title': 'तुरंत जवाब मिलता है',
  'home.step2Body':
    'हर सवाल दर्ज होता है और उसका जवाब तुरंत मिलता है। बहुत लंबे सवाल से पहले छोटे सवाल से शुरू कीजिए।',
  'home.step3Title': 'कोई पैसा नहीं, कोई निजी जानकारी नहीं',
  'home.step3Body':
    'यह सेवा बिल्कुल निःशुल्क है। आपका नाम, पता या फ़ोन नंबर नहीं माँगा जाता, और कोई विज्ञापन नहीं दिखाया जाता।',
  'home.stepLabel': 'चरण',
  'home.freeTitle': 'यह सेवा बिल्कुल निःशुल्क है',
  'home.freeBody':
    'कोई पैसा नहीं लिए जाते, कोई निजी जानकारी नहीं माँगी जाती, और कोई विज्ञापन नहीं दिखाया जाता।',

  /* ---- example questions offered as one-tap buttons --------------------- */
  /*
   * These are the buttons a visitor taps instead of typing, so they are part of
   * the interface rather than content. A Tamil speaker who sees a Hindi button
   * does not learn what it does.
   */
  'help.q1.label': 'बिजली गई है, क्या करूँ?',
  'help.q1.question':
    'घर में बिजली चली गई है। क्या करना चाहिए, और मोबाइल फ़ोन कैसे चार्ज करें?',
  'help.q2.label': 'बच्चे की पढ़ाई में कमज़ोरी',
  'help.q2.question': 'मेरे बच्चे की पढ़ाई में बहुत कमज़ोरी है। घर पर कैसे सुधारूँ?',
  'help.q3.label': 'बुज़ुर्ग का इलाज',
  'help.q3.question': 'मेरे पिताजी की उम्र बहुत ज़्यादा है, उनका इलाज कैसे करूँ?',
  'help.q4.label': 'घर में आग लग जाए तो',
  'help.q4.question': 'अगर रात को घर में आग लग जाए तो सबसे पहले क्या करना चाहिए?',

  /* ---- help page -------------------------------------------------------- */
  'help.title': 'अपनी समस्या लिखिए',
  'help.intro':
    'नीचे लिखिए या बोलिए। पता नहीं हो तो जैसा मन में आए वैसा ही लिख दीजिए — यही सबसे ज़रूरी है।',
  'help.suggested': 'आम सवाल',
  'help.howTitle': 'यह सेवा कैसे काम करती है',
  'help.howBody':
    'हर सवाल दर्ज होता है और उसका जवाब तुरंत मिलता है। आपका नाम, पता या फ़ोन नंबर कहीं नहीं लिया जाता। सब कुछ निःशुल्क है।',

  /* ---- reference page --------------------------------------------------- */
  'ref.title': 'यह सेवा क्या है, और किसके लिए है',
  'ref.intro':
    'यह सेवा श्रीमती VARSHA जी की याद में बनाई गई है। यहाँ सरल भाषा में बताया गया है कि यह क्या करती है, इसमें क्या-क्या है, और इसकी सीमाएँ क्या हैं। सब कुछ बिल्कुल निःशुल्क है — कोई पैसा नहीं लिया जाता, कोई विज्ञापन नहीं दिखाया जाता, और कोई निजी जानकारी नहीं माँगी जाती।',
  'ref.whatTitle': 'इसमें क्या-क्या है',
  'ref.what1':
    'घर में आग लग जाए, बिजली चली जाए, बच्चे की पढ़ाई में कमज़ोरी हो, माँ-बाप की देखभाल करनी हो — ऐसे सामान्य समस्याओं के सरल उपाय, साफ़-सुथरी भाषा में।',
  'ref.what2':
    'सवाल बोलकर पूछने की सुविधा। बोलना न आए तो लिखिए — दोनों का जवाब एक जैसा मिलता है।',
  'ref.what3':
    'हर सवाल दर्ज होता है, इसलिए जो दूसरों को परेशान करता है वह आपसे पहले ही पूछा जा चुका होता है और उसका जवाब मिल जाता है।',
  'ref.what4':
    'कोई विज्ञापन नहीं, कोई अनावश्यक सूचना नहीं, और कोई निजी जानकारी नहीं माँगी जाती। सब कुछ मुफ़्त।',
  'ref.helplineTitle': 'तुरंत मदद के लिए ये नंबर रखिए',
  'ref.helpline1':
    'कोई बड़ा ख़तरा हो — जैसे आग, बिजली का तेज़ कंपन, गिरना या बहुत ज़्यादा खून — तो 112 पर फ़ोन कीजिए।',
  'ref.helpline2':
    'किसी को बीमारी है या चोट लगी है और जाने का कोई रास्ता नहीं, तो 108 पर एम्बुलेंस मँगाइए।',
  'ref.helpline3':
    'महिला के साथ कोई बुरा काम हुआ हो, या महिला को कहीं से परेशान किया जा रहा हो, तो 181 पर फ़ोन कीजिए। यह मुफ़्त है।',
  'ref.helpline4':
    'बच्चे या बुज़ुर्ग के साथ कोई अन्याय हुआ हो, तो 1098 पर शिकायत की जा सकती है।',
  'ref.helpline5':
    'मानसिक तनाव बहुत ज़्यादा हो, या जीने का मन न कर रहा हो, तो 14416 पर बोला जा सकता है। बात करने के लिए ही।',
  'ref.dataTitle': 'हमारा आपके बारे में क्या रखते हैं',
  'ref.dataBody':
    'सिर्फ़ वही सवाल जो आपने पूछा, उसका सार, और सवाल पूछने का समय — ताकि हम बार-बार वही जवाब न दे सकें। आपका नाम, पता, फ़ोन नंबर, या कोई पहचान बताने वाली कोई जानकारी नहीं ली जाती। साइट पर कोई विज्ञापन या ट्रैकिंग स्क्रिप्ट नहीं लगी है।',
  'ref.adminTitle': 'प्रबंधक क्या कर सकते हैं',
  'ref.adminBody':
    'प्रबंधक वे लेख देख सकते हैं जो आपने भेजे हैं, और उनका जवाब लिख सकते हैं। वे आपकी अनुमति के बिना कोई लेख बदल या हटा नहीं सकते, और आपकी जानकारी किसी को नहीं बेच सकते।',
  'ref.statsCategories': 'विषय उपलब्ध हैं',
  'ref.statsArticles': 'लेख लिखे गए हैं',
  'ref.statsQuestions': 'सवाल पूछे जा चुके हैं',
  'ref.ownerNote':
    'यह सेवा किसी कंपनी का नहीं, किसी सरकार का नहीं, बल्कि एक व्यक्ति की स्मृति में चलाई जा रही है। इसलिए यहाँ कोई विज्ञापन नहीं है, कोई सदस्यता नहीं है, और कोई पैसे नहीं लिए जाते।',

  /* ---- support page ----------------------------------------------------- */
  'support.title': 'यह सेवा निःशुल्क है',
  'support.intro':
    'यह सेवा किसी से पैसे नहीं लेती। लेकिन यह चलती है — इसलिए कुछ तरीक़े हैं जिनसे आप मदद कर सकते हैं। सबसे आसान तरीक़ा सबसे काम का है।',
  'support.waysTitle': 'आप कैसे मदद कर सकते हैं',
  'support.way1Title': 'अपना अनुभव लिखिए',
  'support.way1Body':
    'अगर इस साइट से आपको कुछ ठीक मिला हो — या कुछ ऐसा मिला हो जो आपको उलझन में छोड़ गया हो — तो राय पेज पर लिख दीजिए। आपका नाम लेना ज़रूरी नहीं है।',
  'support.way2Title': 'अपने शहर के बारे में बताइए',
  'support.way2Body':
    'आप जहाँ रहते हैं, वहाँ की भाषा, रीति-रिवाज़ और दिक़्क़तें अलग होती हैं। अगर आपके यहाँ की कुछ बात यहाँ नहीं है, तो बता दीजिए — जोड़ा जा सकता है वह जोड़ दिया जाएगा।',
  'support.way3Title': 'अपना अनुभव किसी और को सुनाइए',
  'support.way3Body':
    'जो यहाँ लिखा है वह बहुत से लोगों के काम आ सकता है, अगर उन्हें पता हो। किसी ऐसे व्यक्ति को बताइए जिन्हें यह सच में मदद दे।',
  'support.way4Title': 'यहाँ आकर देखिए',
  'support.way4Body':
    'अगर आपके पास समय हो, तो खुद आकर देखिए कि यह साइट ठीक से चल रही है या नहीं। कुछ बिगड़ा दिखे तो बताइए — बिल्कुल मुफ़्त में ठीक हो जाएगा।',
  'support.contactTitle': 'कुछ बताना है?',
  'support.contactBody':
    'किसी भी बात के लिए यहाँ लिख सकते हैं — चाहे कोई ग़लती हो, चाहे कुछ ज़्यादा मिले, या कोई सवाल। जितना लिखना आसान लगे, उतना ही लिखिए।',
  'support.faqTitle': 'कुछ बातें जो बार-बार पूछी जाती हैं',
  'support.faqBody':
    'क्या यह सच में मुफ़्त है? हाँ। क्या आपका नाम लिया जाता है? नहीं, नाम देना ज़रूरी नहीं है। क्या विज्ञापन आते हैं? नहीं। कोई फ़ोन नंबर या पता तो नहीं माँगा जाता? नहीं। क्या किसी ऐप को डाउनलोड करना पड़ेगा? नहीं, बस ब्राउज़र में खुल जाता है।',

  /* ---- question box ----------------------------------------------------- */
  'ask.label': 'अपनी समस्या लिखिए या माइक से बोलिए',
  'ask.placeholder': 'जैसे: बच्चे की पढ़ाई में कमज़ोरी है',
  'ask.help': 'एंटर दबाकर भी भेज सकते हैं।',
  'ask.send': 'पूछिए',
  'ask.sending': 'सोच रहे हैं…',
  'ask.clear': 'लिखा हुआ मिटाइए',
  'ask.speak': 'बोलकर पूछिए',
  'ask.listening': 'बोलना शुरू कीजिए…',
  'ask.heard': 'सुन रहे हैं',
  'ask.stopListening': 'सुनना रोकिए',
  'ask.suggested': 'आम सवाल',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'सुनिए',
  'ask.stopSpeak': 'रोकिए',
  'ask.aiNote': 'यह उत्तर AI ने दिया है। किसी विशेषज्ञ की सलाह का विकल्प नहीं है।',
  'ask.errorRateLimit':
    'बहुत सारे सवाल एक साथ भेज दिए गए। थोड़ी देर बाद कोशिश कीजिए।',
  'ask.errorNetwork': 'इंटरनेट नहीं चल पा रहा। कनेक्शन जाँचकर फिर कोशिश कीजिए।',
  'ask.notAnswer': 'इस सवाल का सीधा जवाब हमारे पास नहीं है।',
  'ask.emptyAnswer': 'इस बार जवाब नहीं बना पाया। थोड़ा अलग करके फिर पूछिए।',
  'ask.micUnsupported': 'इस ब्राउज़र में बोलकर पूछना काम नहीं करेगा। लिखकर पूछिए।',
  'ask.heardWith': 'यह सुन रहे हैं:',

  /* ---- voice ------------------------------------------------------------ */
  'voice.notAllowed':
    'माइक की अनुमति नहीं मिली। ऊपर जाकर अनुमति दे दीजिए, या लिखकर पूछिए।',
  'voice.serviceNotAllowed':
    'माइक की अनुमति नहीं मिली। ऊपर जाकर अनुमति दे दीजिए, या लिखकर पूछिए।',
  'voice.noSpeech': 'कोई आवाज़ नहीं सुनाई दी। माइक के पास बोलिए, या लिखिए।',
  'voice.audioCapture':
    'कोई माइक नहीं मिला। डिवाइस जोड़िए, या लिखकर पूछिए।',
  'voice.network':
    'बोलकर पूछने के लिए इंटरनेट चाहिए, और वह नहीं चल पा रहा। लिखकर पूछिए — जवाब वही मिलेगा।',
  'voice.aborted': 'रुक गया। दोबारा कोशिश कीजिए।',
  'voice.unsupported': 'इस ब्राउज़र में बोलकर पूछना काम नहीं करेगा। लिखकर पूछिए।',
  'voice.speakFailed': 'यह उत्तर सुनाया नहीं जा सका।',
  'voice.noVoice': 'इस डिवाइस में {name} बोलने वाली आवाज़ नहीं मिली। अभी लिखा हुआ पढ़िए, या फ़ोन की सेटिंग में जाकर आवाज़ जोड़िए।',
  'voice.generic': 'कुछ गड़बड़ हो गई। दोबारा कोशिश कीजिए।',

  /* ---- sound ------------------------------------------------------------ */
  'sound.title': 'शांति के लिए ध्वनि',
  'sound.intro': 'कोई शुल्क नहीं, कोई विज्ञापन नहीं। बस मन शांत करने के लिए।',
  'sound.playing': 'आवाज़ चल रही है। रोकने के लिए दोबारा उसी बटन को दबाइए।',
  'sound.shankh': 'शंख',
  'sound.shankhHint': 'गहरी, लंबी',
  'sound.bansuri': 'बांसुरी',
  'sound.bansuriHint': 'कोमल, धीमी',
  'sound.dhol': 'नगाड़ा',
  'sound.dholHint': 'तीखी, तेज़',
  'sound.all': 'तीनों',
  'sound.allHint': 'एक साथ',
  'sound.listenLabel': 'सुनिए',
  'sound.errUnsupported': 'यह ब्राउज़र ध्वनि नहीं चला पा रहा।',
  'sound.errGeneric': 'ध्वनि चलाने में समस्या हुई।',

  /* ---- opening sound ---------------------------------------------------- */
  'dhun.welcome': 'स्वागत है',
  'dhun.prompt': 'शंख, बांसुरी और नगाड़ा — साथ में सुनने के लिए छुएँ।',
  'dhun.listen': '▶ सुनिए',
  'dhun.skip': 'ध्वनि छोड़िए',
  'dhun.failed': 'ध्वनि नहीं चल पाई।',
  'dhun.label': 'ध्वनि चलाने की अनुमति',

  /* ---- reviews ---------------------------------------------------------- */
  'reviews.title': 'आपकी राय, आपकी बात',
  'reviews.intro':
    'क्या यह सेवा आपके काम आई? अपनी बात लिखिए — आपका नाम लेना ज़रूरी नहीं है।',
  'reviews.pageTitle': 'आपकी राय',
  'reviews.pageIntro':
    'यहाँ वही लिखा है जो लोगों ने लिखा है। कोई राय छिपाई नहीं जाती, और जो लिखा है वह यहीं दिखता है — बस एक बार देख लेने के बाद प्रकाशित किया जाता है।',
  'reviews.write': 'अपनी राय लिखिए',
  'reviews.submit': 'भेजिए',
  'reviews.sending': 'भेज रहे हैं…',
  'reviews.name': 'आपका नाम (ज़रूरी नहीं)',
  'reviews.city': 'आपका शहर (ज़रूरी नहीं)',
  'reviews.comment': 'आपकी बात',
  'reviews.placeholder': 'जो मन में आया वही लिखिए — कुछ सही करने की ज़रूरत नहीं।',
  'reviews.moderated': 'आपकी समीक्षा प्रकाशित होने से पहले एक बार देखी जाती है।',
  'reviews.moderationNote':
    'सब कुछ मिटाने से बचने के लिए, प्रकाशित होने से पहले हर समीक्षा एक बार देख ली जाती है। गाली, नंबर या व्यक्तिगत बातें हटा दी जाती हैं — बाकी सब ज्यों की त्यों प्रकाशित होती है।',
  'reviews.summaryTitle': 'आम राय',
  'reviews.count': 'समीक्षाएँ',
  'reviews.anonymous': 'बिना नाम के',
  'reviews.summaryLine': 'लोगों ने औसतन {rating} में से 5 में से {count} तारका दिए।',
  'reviews.starsLabel': '5 में से {value} तारका',
  'reviews.keepLabel': 'बुरा लगा तो ठीक लगे तो — दोनों लिखिए',
  'reviews.ownerReply': 'जवाब',
  'reviews.replyLabel': 'इस पर लिखा गया है',
  'reviews.empty': 'अभी कोई समीक्षा नहीं है। पहली आप लिखिए।',
  'reviews.toastSent': 'धन्यवाद',
  'reviews.toastFailed': 'राय नहीं भेजी जा सकी',
  'reviews.fieldTooShort': 'कम से कम 10 अक्षर लिखिए।',
  'reviews.rateLimited': 'बहुत तेज़ी से भेजा जा रहा है। थोड़ा रुककर फिर कोशिश कीजिए।',

  /* ---- category and article pages ---------------------------------------- */
  'cat.notFound': 'यह पन्ना नहीं मिला',
  'cat.empty': 'इस विषय में अभी कोई लेख नहीं है।',
  'article.emergency': 'ज़रूरी',
  'article.askAbout': 'इसी विषय में पूछिए',
  'article.readAloud': 'यह लेख सुनिए',
  'article.others': 'इसी विषय के और लेख',
  'article.count': '{count} लेख',

  /* ---- theme and misc --------------------------------------------------- */
  'theme.toLight': 'रोशनी की दिखावट पर जाएँ',
  'theme.toDark': 'अंधेरे की दिखावट पर जाएँ',
  'toast.dismiss': 'बंद करें',

  /* ---- language notice -------------------------------------------------- */
  'language.choose': 'अपनी भाषा चुनिए',
  'language.articlesIn': 'यह लेख हिन्दी में है।',
  'language.articlesInHint':
    'हर भाषा में अलग अनुवाद चाहिए। यह अनुवाद अभी नहीं हुआ है — जो लिखा है वह हिन्दी में ही सही और पूरा है।',

  'ask.welcome': 'आपका स्वागत है! नीचे अपनी समस्या लिखिए या कोई विषय चुनिए।',

  'ref.notTitle': 'यह क्या नहीं करती',

  'ref.not1': 'यह डॉक्टर नहीं है। दवाई की सलाह कभी नहीं दी जाती।',

  'ref.not2': 'यह वकील नहीं है। कानूनी सलाह नहीं दी जाती।',

  'ref.not3': 'कोई भी पैसा नहीं लिया जाता, और कोई विज्ञापन नहीं दिखाया जाता।',

  'ref.not4': 'आपका नाम, पता या फ़ोन नंबर नहीं माँगा जाता और नहीं रखा जाता।',

  'ref.not5': 'कोई सरकारी योजना का दाम या नंबर नहीं बनाया जाता — सही जानकारी न हो तो साफ़ कहा जाता है कि नहीं पता।',

  'ref.medicalTitle': 'ज़रूरी: यह डॉक्टर की सलाह नहीं है',

  'ref.medicalBody': 'बीमारी, दवाई या कोई भी ज़हरीली चीज़ से जुड़ी बात हो, तो सबसे पहले डॉक्टर से मिलिए। यहाँ दी गई जानकारी सिर्फ़ सामान्य मदद के लिए है। बच्चे के टीके, गर्भावस्था, या कोई भी दवाई शुरू करने से पहले डॉक्टर की सलाह ज़रूर लें।',

  'ref.statsTitle': 'कितनी जानकारी मौजूद है',

  'support.howTitle': 'हमारी मदद कैसे करें',

  'support.alwaysFreeTitle': 'यह सेवा हमेशा निःशुल्क रहेगी',

  'support.alwaysFreeBody': 'जो भी मदद मिले, वह सेवा चलाने में लगेगी। किसी से कभी पैसा नहीं लिया जाएगा।',

  'smriti.eyebrow': 'आदरांजलि',

  'smriti.whyTitle': 'यह साइट क्यों है',

  'smriti.ending': 'उनका संघर्ष यहीं आगे बढ़ता है।',

  'article.askAny': 'कोई सवाल पूछिए',

  'article.remember': 'याद रखिए',

  'article.emergencyInfo': 'ज़रूरी जानकारी',

  'article.medicalTitle': 'यह चिकित्सा सलाह नहीं है',

  'article.medicalBody': 'यह जानकारी सामान्य मदद के लिए है। कोई भी दवाई शुरू या बंद न करें — पहले डॉक्टर से मिलें।',

  'article.heading': '{category} के लेख',

  'reviews.rateQuestion': 'कितने तारे देंगे?',

  'reviews.starsShort': '{value} तारे',

  'reviews.averageOutOf': '5 में से {value} तारे',

  'dhun.welcomeTitle': 'स्वागत है',

  'dhun.consent': 'शंख, बांसुरी और नगाड़ा — साथ में सुनने के लिए छुएँ।',

  'dhun.unsupported': 'यह ब्राउज़र ध्वनि नहीं चला पा रहा।',

  'dhun.failedTry': 'ध्वनि चलाने में समस्या हुई।',

  'sound.hintIdle': 'कोई बटन दबाकर ध्वनि सुनिए।',

  'sound.hintPlaying': 'आवाज़ चल रही है। रोकने के लिए दोबारा उसी बटन को दबाएँ।',

  'sound.preparing': 'ध्वनि तैयार हो रही है',

  'nav.path': 'पथ',
  /* ---- health questions, by age ---- */
  'health.heading': 'अपनी उम्र बताइए',
  'health.intro': 'उम्र के हिसाब से जो सवाल अक्सर पूछे जाते हैं, वे यहाँ दिखेंगे। कोई बटन दबाइए — सवाल नीचे भर जाएगा, फिर पूछ लीजिए।',
  'health.ageLabel': 'उम्र (साल)',
  'health.years': 'साल',
  'health.bandsLabel': 'उम्र के हिसाब से चुनिए',
  'health.notAdviceStrong': 'यह चिकित्सा सलाह नहीं है।',
  'health.notAdvice': 'कोई भी दवाई शुरू या बंद न करें — पहले डॉक्टर से मिलें।',
  'health.emergencyStrong': 'आपातकाल में फोन कीजिए:',
  'health.emergencyCall': '(आपातकाल)',
  'health.emergencyAmbulance': '(एम्बुलेंस)',
  'health.emergencyWomen': '(महिला हेल्पलाइन)',
  'health.privacy': 'कोई नाम या पता लिखने की ज़रूरत नहीं है।',
  'health.band.infant.label': '0 – 2 साल',
  'health.band.infant.note': 'नन्हे बच्चे, जो अभी अपनी बात नहीं बता सकते',
  'health.c.infant1': 'तेज़ बुखार',
  'health.q.infant1': 'मेरे बच्चे को तेज़ बुखार है, क्या दूध दूँ?',
  'health.c.infant2': 'खाना नहीं खा रहा',
  'health.q.infant2': 'छोटा बच्चा खाना नहीं खा रहा, क्या करूँ?',
  'health.c.infant3': 'उल्टी हो रही है',
  'health.q.infant3': 'बच्चे को उल्टी हो रही है, कब डॉक्टर को दिखाऊँ?',
  'health.c.infant4': 'दस्त हो रहे हैं',
  'health.q.infant4': 'बच्चे को दस्त हो रहे हैं, क्या खिलाऊँ?',
  'health.band.child.label': '3 – 12 साल',
  'health.band.child.note': 'बच्चे जो बोल सकते हैं, पर सवाल पूछने से डरते हैं',
  'health.c.child1': 'पढ़ाई में मन नहीं',
  'health.q.child1': 'बच्चे की पढ़ाई में मन नहीं लगता, क्या करूँ?',
  'health.c.child2': 'स्कूल से मना करता है',
  'health.q.child2': 'बच्चा रोज़ स्कूल जाने से मना कर रहा है, कारण क्या हो सकता है?',
  'health.c.child3': 'रात में बुखार',
  'health.q.child3': 'बच्चे को रात में बुखार आता है, क्या करूँ?',
  'health.c.child4': 'दाँत टूट रहे हैं',
  'health.q.child4': 'बच्चे के दाँत टूट रहे हैं, दाँतों की देखभाल कैसे करूँ?',
  'health.band.teen.label': '13 – 17 साल',
  'health.band.teen.note': 'किशोर, जिन्हें अक्सर कोई ऐसा व्यक्ति नहीं मिलता जो सुन ले',
  'health.c.teen1': 'पढ़ाई का दबाव',
  'health.q.teen1': 'पढ़ाई का बहुत दबाव है, इसे कैसे सामना करूँ?',
  'health.c.teen2': 'नींद नहीं आती',
  'health.q.teen2': 'रात को नींद ठीक से नहीं आती, क्या करूँ?',
  'health.c.teen3': 'मोबाइल की लत',
  'health.q.teen3': 'मोबाइल की लत लग गई है, छोड़ने का तरीका बताइए।',
  'health.c.teen4': 'बहुत उदासी',
  'health.q.teen4': 'बहुत उदासी महसूस होती है, किससे बात करूँ?',
  'health.band.young.label': '18 – 30 साल',
  'health.band.young.note': 'नौकरी, पैसा और नींद — तीनों का एक साथ बोझ',
  'health.c.young1': 'काम का तनाव',
  'health.q.young1': 'काम का तनाव बहुत ज़्यादा है, कैसे कम करूँ?',
  'health.c.young2': 'बैठने से पीठ दर्द',
  'health.q.young2': 'बैठे रहने से पीठ में दर्द हो रहा है, क्या करूँ?',
  'health.c.young3': 'नींद नहीं आती',
  'health.q.young3': 'रात को नींद नहीं आती, क्या उपाय है?',
  'health.c.young4': 'पैसा कम है',
  'health.q.young4': 'पैसे कम हैं और खर्च ज़्यादा, क्या करूँ?',
  'health.band.middle.label': '31 – 45 साल',
  'health.band.middle.note': 'घर, बच्चे और अपनी सेहत — सबकी ज़िम्मेदारी एक साथ',
  'health.c.middle1': 'कमर में दर्द',
  'health.q.middle1': 'कमर में दर्द हो रहा है, कारण क्या हो सकती है?',
  'health.c.middle2': 'नींद सही नहीं',
  'health.q.middle2': 'नींद अच्छी नहीं आ रही, सुधारने का क्या उपाय है?',
  'health.c.middle3': 'घर का तनाव',
  'health.q.middle3': 'घर का तनाव बहुत है, बच्चों को कैसे संभालूँ?',
  'health.c.middle4': 'पेट में गैस',
  'health.q.middle4': 'काम पर कई साल से पेट में गैस की समस्या है, क्या करूँ?',
  'health.band.later.label': '46 – 60 साल',
  'health.band.later.note': 'शरीर की उम्र और उसकी देखभाल — दोनों एक साथ',
  'health.c.later1': 'पीठ में दर्द',
  'health.q.later1': 'मेरी उम्र 54 साल है और मेरी पीठ में दर्द है, क्या करूँ?',
  'health.c.later2': 'घुटने में दर्द',
  'health.q.later2': 'घुटने में दर्द हो रहा है चढ़ने पर, क्यों?',
  'health.c.later3': 'रात को पैर में ऐंठन',
  'health.q.later3': 'रात को पैर में ऐंठन होता है, क्या करूँ?',
  'health.c.later4': 'सुबह जकड़न',
  'health.q.later4': 'सुबह उठकर कमर में जकड़न होती है, कारण क्या हो सकती है?',
  'health.band.senior.label': '61 – 75 साल',
  'health.band.senior.note': 'दवाई, संतुलन और अकेलापन — तीनों साथ में',
  'health.c.senior1': 'चलने में तकलीफ़',
  'health.q.senior1': 'घुटनों में इतना दर्द है कि चलना मुश्किल है, क्या करूँ?',
  'health.c.senior2': 'दवाई की जाँच',
  'health.q.senior2': 'कई दवाइयाँ रोज़ खानी पड़ती हैं — कैसे पता चलेगा कि कौन सी हानिकारक है?',
  'health.c.senior3': 'रात में पेशाब',
  'health.q.senior3': 'रात को बार-बार पेशाब की दिक़्क़त है, क्या करूँ?',
  'health.c.senior4': 'सुनाई कम',
  'health.q.senior4': 'कम सुनाई देता है, सुनने का कोई उपाय बताइए।',
  'health.band.elder.label': '76 – 100 साल',
  'health.band.elder.note': 'हर दवा की जाँच ज़रूरी, हर गिरना गंभीर',
  'health.c.elder1': 'गिरने का डर',
  'health.q.elder1': 'घर में गिर जाने का डर है, कौन-सी सुरक्षा रखूँ?',
  'health.c.elder2': 'याददाश्त कमज़ोर',
  'health.q.elder2': 'याददाश्त कमज़ोर हो रही है, क्या उपाय है?',
  'health.c.elder3': 'रोज़ की दर्द-दवा',
  'health.q.elder3': 'दर्द की दवा रोज़ खानी पड़ती है — क्या इसका कोई नुकसान है?',
  'health.c.elder4': 'कब डॉक्टर के पास',
  'health.q.elder4': 'कब डॉक्टर के पास जाना ज़रूरी है?',

  'ask.notConfigured': 'यह सेवा अभी अपने पुराने जवाबों के बंद दराज़ से जवाब दे रही है। आपका सवाल उसमें नहीं मिला।',

  'ask.browseTitle': 'यहाँ जो लेख हैं, वे देखिए',

  /* ---- save / download ---- */

  'download.pdf': 'PDF में लिखें',
  'download.text': 'टेक्स्ट में लिखें',
  'download.printNow': 'प्रिंट कीजिए',
  'download.preparing': 'तैयार हो रहा है',
  'download.blocked': 'नया टैब नहीं खुल पाया। Pop-up ब्लॉक हो रहा है — अपने ब्राउज़र में अलग टैब खोलिए।',

  /* ---- attach a document ---- */

  'attach.button': 'अपना दस्तावेज़ या फ़ोटो जोड़िए',
  'attach.formats': 'PDF, फ़ोटो (JPG/PNG) या टेक्स्ट फ़ाइल — 12 MB तक',
  'attach.reading': 'पढ़ रहा है…',
  'attach.attached': 'लगा दिया',
  'attach.remove': 'हटाएँ',
  'attach.tooBigPdf': 'यह PDF 12 MB से बड़ी है। छोटी फ़ाइल चुनिए।',
  'attach.tooBigImage': 'यह फ़ोटो 3 MB से बड़ी है। छोटी फ़ोटो चुनिए।',
  'attach.scannedPdf': 'यह PDF स्कैन की हुई है — इसमें सिर्फ़ तस्वीर है, पढ़ी नहीं जा सकती। इसकी फ़ोटो भेजिए।',
  'attach.pdfFailed': 'यह PDF पढ़ी नहीं गई।',
  'attach.imageFailed': 'यह फ़ोटो लोड नहीं हुई।',
  'attach.wrongType': 'यह फ़ाइल नहीं चलेगी। PDF, फ़ोटो या टेक्स्ट फ़ाइल भेजिए।',
  'attach.hint': 'अपना कागज़ यहाँ लगा कर सवाल पूछिए — हम उसी से जवाब देंगे।',
  'ask.sendWithFile': 'जवाब चाहिए',

  /* ---- free library ---- */

  'lib.title': 'मुफ़्त पुस्तकालय',
  'lib.intro': 'पढ़ाई की किताबें, किताबें, तस्वीरें और ऑडियो — सब मुफ़्त और कानूनी रूप से।',
  'lib.legalTitle': 'कॉपीराइट का कोई झंझट नहीं।',
  'lib.legal': 'यहाँ जो कुछ दिया गया है, वह बिल्कुल मुफ़्त है और आप इसे आगे भी बाँट सकते हैं। जो किताब अभी कॉपीराइट में है, वह यहाँ नहीं होगी — उसे आप कॉपी नहीं कर सकते, यह साफ़ कहना ज़रूरी है।',
  'ask.signInFirst': 'पहले लॉग इन कीजिए, फिर सवाल पूछिए।',
  'ask.signInTitle': 'पहले लॉग इन कीजिए',
  'ask.signInBody': 'सवाल पूछने के लिए अपना खाता बनाइए। इसमें एक मिनट से भी कम लगता है, और आप पूछते रहेंगे।',
  'ask.signInCta': 'खाता बनाइए या लॉग इन कीजिए',
  'ask.signInOr': 'अभी खाता नहीं बना सकते? ये काम भी आपके बिना हो जाएगा:',
  'account.title': 'मेरा खाता',
  'account.intro': 'अपना नाम और पासवर्ड डालकर सवाल पूछना शुरू करें।',
  'account.signIn': 'दाखिल हों',
  'account.register': 'खाता बनाएँ',
  'account.signInNote': 'पिछले बार का नाम और पासवर्ड डालें।',
  'account.registerNote': 'सवाल पूछने के लिए खाता ज़रूरी नहीं। यह सिर्फ आपकी भाषा और जवाब याद रखने के लिए है।',
  'account.handle': 'आपका नाम',
  'account.handlePlaceholder': 'जैसे: sita.ji',
  'account.password': 'पासवर्ड',
  'account.passwordHint': 'कम से कम 6 अक्षर।',
  'account.phone': 'फ़ोन नंबर',
  'account.optional': 'ज़रूरी नहीं',
  'account.phoneHint': 'देना चाहें तो दीजिए। कोई फ़ोन नहीं भी दीजिए तो खाता बन जाएगा।',
  'account.create': 'खाता बनाइए',
  'account.logout': 'बाहर निकलें',
  'account.open': 'खाता खोलें',
  'account.signedInAs': 'आप लॉग इन हैं',
  'account.signedOut': 'खाता नहीं खुला',
  'account.signedOutBody': 'अभी कोई खाता नहीं खुला है।',
  'account.saved': 'जमा किए जवाब',
  'account.savedEmpty': 'अभी कोई जवाब जमा नहीं है। जवाब आने पर \'जमा करें\' दबाइए।',
  'account.savedUnavailable': 'जमा जवाब अभी नहीं दिख रहे हैं। बाकी सब चल रहा है।',
  'account.wait': 'कृपया प्रतीक्षा कीजिए…',
  'account.privacyTitle': 'आपकी बातें सुरक्षित',
  'account.privacyBody': 'खाता बनाने पर सिर्फ आपका नाम, पासवर्ड और भाषा रखी जाती है। सवाल का कोई रिकॉर्ड नहीं बनता। आपके सवाल किसी को भेजे नहीं जाते।',
  'account.errWrong': 'नाम या पासवर्ड गलत है।',
  'account.errTaken': 'यह नाम पहले से लिया जा चुका है। दूसरा नाम चुनिए।',
  'account.errBad': 'जानकारी ठीक से भरिए।',
  'account.errWait': 'बहुत कोशिश हो गई। थोड़ी देर बाद कोशिश कीजिए।',
  'account.errTryLater': 'अभी नहीं हो पाया। कुछ देर बाद कोशिश कीजिए।',
  'lib.licence.ccBy': 'आप इसे कॉपी और शेयर कर सकते हैं, छाप भी सकते हैं — बस स्रोत का नाम देना होगा।',
  'lib.licence.ccBySa': 'आप इसे कॉपी और छाप सकते हैं। जो बदलाव करेंगे, वे भी खुल कर देना होगा।',
  'lib.licence.ccZero': 'पूरी तरह मुफ़्त। स्रोत का नाम देना भी ज़रूरी नहीं।',
  'lib.licence.pd': 'किसी का कॉपीराइट नहीं — जो चाहे कॉपी कर सकते हैं।',
  'lib.licence.govtIndia': 'भारत सरकार की वेबसाइट पर। पढ़ना और छापना दोनों मुफ़्त।',
  'lib.licence.creativeCommons': 'हर फ़ाइल का अपना लाइसेंस है — फ़ाइल पर देखिए।',
  'lib.licence.freeToRead': 'पढ़ना मुफ़्त है। कॉपी करके आगे देना भी उसी शर्त पर है जिस पर यह मिला।',
  'lib.openBadge': 'खुला',
  'lib.openBadgeNote': 'इसे कॉपी कर सकते हैं',
  'lib.freeBadge': 'मुफ़्त',
  'lib.freeBadgeNote': 'पढ़ सकते हैं, कॉपी नहीं',
  'lib.govt': 'सरकारी',
  'lib.noSignup': 'बिना अकाउंट',
  'lib.open': 'यहाँ खोलिए',
  'lib.group.padhai': 'पढ़ाई की किताबें',
  'lib.group.padhai.note': 'स्कूल, कॉलेज और सरकारी शिक्षा सामग्री',
  'lib.group.kitab': 'किताबें',
  'lib.group.kitab.note': 'जिन पर कॉपीराइट नहीं है या जिन्हें कॉपी करने की इजाज़त है',
  'lib.group.tasveer': 'तस्वीरें और चित्र',
  'lib.group.tasveer.note': 'नक्शे, तस्वीरें, चिन्ह — सब कुछ',
  'lib.group.audio': 'आवाज़ में सुनने वाली सामग्री',
  'lib.group.audio.note': 'किताबें सुनकर, बड़े अक्षर से नहीं',
  'lib.warnTitle': 'हर किताब यहाँ नहीं है',
  'lib.warn': 'कुछ किताबें अभी कॉपीराइट में हैं और वे कानून से मुफ़्त नहीं दी जा सकतीं। हम जानबूझकर वहाँ नहीं दिखाते। अगर कोई किताब चाहिए तो नीचे से सवाल पूछिए — जो जवाब मिल सकता है, वह मिल जाएगा।',
  'lib.askInstead': 'सवाल पूछिए',
  'nav.library': 'पुस्तकालय',

  'support.contactMessageLabel': 'आपकी बात',

  'support.contactPlaceholder': 'जो लिखना हो वही लिखिए — गलती हो तो, कुछ अच्छा मिला हो तो, या कोई सवाल हो।',

  'support.contactHelp': 'कम से कम 10 अक्षर। यह सीधे मालिक के पास जाता है।',

  'support.contactSubmit': 'भेजिए',

  'support.contactSending': 'भेज रहे हैं…',

  'support.contactPrivacy': 'आपका नाम लिखना ज़रूरी नहीं है।',

  'support.contactSent': 'पहुँच गया',

  'support.contactSentBody': 'आपकी बात मालिक तक पहुँच गई है।',

  'support.contactFailed': 'नहीं भेजा जा सका',

  'support.faq1Q': 'क्या यह सच में मुफ़्त है?',

  'support.faq1A': 'हाँ। कोई पैसा नहीं लिया जाता, कोई विज्ञापन नहीं दिखता, और कोई सदस्यता नहीं ली जाती। यह एक व्यक्ति के पैसे से चलती है, किसी कंपनी या सरकार के पैसे से नहीं।',

  'support.faq2Q': 'क्या मेरा नाम, पता या फ़ोन नंबर लिया जाता है?',

  'support.faq2A': 'नहीं, और यह भी नहीं लिया जाएगा। यह साइट अपने आप में कोई पहचान नहीं बनाती — कोई लॉगिन नहीं, कोई ट्रैकिंग स्क्रिप्ट नहीं। जो पूछा जाता है वह सिर्फ़ आपका सवाल है और जब आपता है।',

  'support.faq3Q': 'क्या यह डॉक्टर या वकील है?',

  'support.faq3A': 'नहीं। यह कोई दवाई का सलाह नहीं देता और न कोई कानूनी सलाह। जहाँ बात गंभीर होती है वहाँ यह आपको डॉक्टर या अधिकारी के पास जाने की बात कहता है — यह उनकी जगह नहीं लेता।',

  'support.faq4Q': 'क्या हर जवाब सही होता है?',

  'support.faq4A': 'हमेशा नहीं। जवाब एक कंप्यूटर लिखता है, कोई डॉक्टर नहीं — इसलिए हर जवाब के साथ यह लिखा है कि यह चिकित्सा सलाह नहीं है। कोई दवाई शुरू करने या बंद करने से पहले डॉक्टर से ज़रूर मिलें।',

  'support.faq5Q': 'क्या मुझे कोई ऐप डाउनलोड करना होगा?',

  'support.faq5A': 'नहीं। यह सिर्फ़ ब्राउज़र में खुलती है। कोई ऐप इंस्टॉल नहीं, कोई अनुमति नहीं, कोई अपडेट नहीं।',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'घरेलू उपचार',
  'remedy.title': 'आयुर्वेदिक घरेलू उपचार',
  'remedy.intro': 'जो भी तकलीफ़ हो — खांसी, सिरदर्द, गठिया, खाज-खुजली, मधुमेह, पीठ दर्द — नीचे अपनी तकलीफ़ चुनिए या अपने शब्दों में पूछिए। घरेलू काढ़ा, मालिश, खानपान और आयुर्वेदिक उपाय बताए जाएँगे।',
  'remedy.choose': 'अपनी तकलीफ़ चुनिए',
  'remedy.emergencyStrong': 'ये आपातकाल हैं:',
  'remedy.emergency': 'सांप का काटना, बिच्छू का डंक और कुत्ते का काटना — तुरंत अस्पताल जाइए, पहले 112 पर फोन कीजिए। घरेलू उपाय सिर्फ़ रास्ते में करने के लिए हैं, अस्पताल की जगह नहीं।',
  'remedy.note': 'घरेलू और आयुर्वेदिक उपाय तकलीफ़ कम करने में मदद करते हैं; ये डॉक्टर की जाँच और इलाज की जगह नहीं हैं। कोई दवा अपने आप बंद या शुरू न करें।',
  'remedy.cough': 'खांसी',
  'remedy.headache': 'सिरदर्द',
  'remedy.joints': 'गठिया',
  'remedy.itching': 'खाज-खुजली',
  'remedy.snake': 'सांप का काटना',
  'remedy.scorpion': 'बिच्छू का डंक',
  'remedy.dog': 'कुत्ते का काटना',
  'remedy.diabetes': 'मधुमेह',
  'remedy.back': 'पीठ दर्द',
  'remedy.walking': 'चलने में तकलीफ़',
  'home.remedyNote': 'काढ़ा, मालिश, खानपान और आयुर्वेदिक उपाय — हर तकलीफ़ के लिए, आपकी भाषा में।',
  'nav.aarti': 'आरती व भजन',
  'aarti.title': 'आरती व भजन — असली आवाज़ में',
  'aarti.intro': 'यहाँ आरती, कीर्तन और भजन सुनिए — असली गायकों और मंदिरों की आवाज़ में। कोई AI आवाज़ नहीं।',
  'aarti.note': 'आरती या भजन कंप्यूटर की आवाज़ में सुनाना उसकी चाल और भक्ति छीन लेता है। इसलिए यहाँ सिर्फ़ असली रिकॉर्डिंग हैं।',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रिकॉर्डिंग:',
  'aarti.licence': 'लाइसेंस:',
  'aarti.listenLink': 'असली आवाज़ में सुनिए',
  'aarti.textChecked': 'यह पारंपरिक पाठ है, जैसा असली रिकॉर्डिंग में गाया गया है।',
  'aarti.textPrinted': 'यह प्रचलित पाठ है, प्रकाशित संग्रहों से मिलाकर जाँचा गया है।',
  'aarti.textNotStored': 'इस ग्रंथ का पूरा पाठ यहाँ संग्रहीत नहीं है — नीचे रिकॉर्डिंग में पूरा पाठ चलता है।',
  'aarti.granthTitle': 'ग्रंथ, चालीसा और स्तोत्र — असली आवाज़ में',
  'aarti.noRecording': 'इस आरती की असली रिकॉर्डिंग अभी साइट पर नहीं है, इसलिए मैं इसे गाकर नहीं सुना सकता — AI आवाज़ में आरती कभी नहीं गाता।',
  'aarti.textOnlyTitle': 'और आरतियाँ — पाठ भी, असली आवाज़ भी',
  'aarti.fullText': 'पूरा पाठ',
  'aarti.notChecked': 'इस आरती का सत्यापित पाठ अभी साइट पर नहीं है। बिना जाँचा पाठ देना ठीक नहीं, इसलिए वह नहीं दिया जा रहा।',
  'aarti.verifiedList': 'साइट पर इन आरतियों का सत्यापित पाठ है:',

};

/* -------------------------------------------------------------------------- */
/* ENGLISH — the fallback language                                            */
/* -------------------------------------------------------------------------- */

const ENGLISH: Record<string, string> = {
  'jgd.placeSearch': 'Type the name of your town',
  'jgd.placeNoMatch': 'This town is not in the list. Pick the nearest one that is.',

  'account.name': 'Your name',
  'account.namePlaceholder': 'e.g. Sita Devi',
  'account.nameHint': 'So we know who you are. Any name will do, and it is not required.',

  'nav.home': 'Home', 'home.metaTitle': 'Free answers, in your own words',
  'lib.licence.ccZero.name': 'CC0 / Public domain',
  'lib.licence.pd.name': 'Public domain',
  'lib.licence.govtIndia.name': 'Government of India',
  'lib.licence.creativeCommons.name': 'Creative Commons (mixed)',
  'lib.licence.freeToRead.name': 'Free to read',
  'lib.entry.ncert.title': 'NCERT books — classes 1 to 12',
  'lib.entry.ncert.what': 'Every book for every subject, for every class. No login, direct PDF.',
  'lib.entry.ncert.langs': 'Hindi, English and more than 30 Indian languages',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — digital textbooks',
  'lib.entry.pm-evidya.what': 'An app for the NCERT books, with large text, and it can read aloud.',
  'lib.entry.pm-evidya.langs': 'Indian languages',
  'lib.entry.diksha.title': 'DIKSHA — for teachers and children',
  'lib.entry.diksha.what': 'Lessons, videos and practice — classes 1 to 12.',
  'lib.entry.diksha.langs': 'Indian languages',
  'lib.entry.khan-academy.title': 'Khan Academy — maths and science in English',
  'lib.entry.khan-academy.what': 'Video lessons up to every class, with written text as well.',
  'lib.entry.openstax.title': 'OpenStax — free books in English',
  'lib.entry.openstax.what': 'College-level books — maths, science, humanities. PDF on every page.',
  'lib.entry.nios.title': 'NIOS — distance education, free material',
  'lib.entry.nios.what': 'Free booklets for open and online courses, with no admission.',
  'lib.entry.nios.langs': 'Hindi, English and others',
  'lib.entry.ignou.title': 'IGNOU — free books for further study',
  'lib.entry.ignou.what': 'Distance-education books, entirely free.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — old books in English',
  'lib.entry.gutenberg.what': 'More than 70,000 books, all out of copyright. Free e-books and audio.',
  'lib.entry.pratham-books.title': 'Pratham Books — children\'s books',
  'lib.entry.pratham-books.what': 'Children\'s books in Indian languages, entirely free. Classes 1 to 5.',
  'lib.entry.pratham-books.langs': 'Hindi, Marathi, Bengali, Tamil, Telugu and more',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — newspapers and old magazines',
  'lib.entry.internet-archive-texts.what': 'Millions of old books, magazines and newspapers — free.',
  'lib.entry.wikisource.title': 'Wikisource — free public texts',
  'lib.entry.wikisource.what': 'No copyright — these are the world\'s old literary books.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — every kind of image',
  'lib.entry.wikimedia-commons.what': 'Animals, maps, stars, history — everything. Each picture carries its own licence.',
  'lib.entry.pixabay.title': 'Pixabay — photos and illustrations',
  'lib.entry.pixabay.what': 'Photographs, drawings and short videos.',
  'lib.entry.unsplash.title': 'Unsplash — beautiful photographs',
  'lib.entry.unsplash.what': 'Free, large images, no account needed.',
  'lib.entry.openverse.title': 'Openverse — every free image in one place',
  'lib.entry.openverse.what': 'Search several free image sites at once.',
  'lib.entry.librivox.title': 'LibriVox — books to listen to',
  'lib.entry.librivox.what': 'Free audio of old English books, read by people.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — audio archive',
  'lib.entry.internet-archive-audio.what': 'Thousands of free recordings — books, speeches, music.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — the national song and others',
  'lib.entry.vande-mataram.what': 'India\'s national song and other national songs, free.',
  'art.aag-aur-bijli-ke-bachav.title': 'Fire and electricity safety rules',
  'art.aag-aur-bijli-ke-bachav.summary': 'Preventing a house fire — simple rules',
  'art.aag-lagne-par-kya-karein.title': 'What to do if there is a fire',
  'art.aag-lagne-par-kya-karein.summary': 'Fire in a burning house — what to do first, what not to do',
  'art.bimari-se-bachav.title': 'Seven rules against infection',
  'art.bimari-se-bachav.summary': 'Washing hands, masks, vaccination — how to stay safe',
  'art.dhuwan-ka-jhakora.title': 'Protection from choking smoke',
  'art.dhuwan-ka-jhakora.summary': 'Choking, breath not coming — what to do, when to go to hospital',
  'art.doodh-pani-band-ho.title': 'When the electricity or water suddenly stops',
  'art.doodh-pani-band-ho.summary': 'What to do, what to avoid, when to ask for help',
  'art.haath-ki-saafai.title': 'Cleaning hands without soap',
  'art.haath-ki-saafai.summary': 'When there is no water or soap',
  'cat.dhyan-aur-yoog.title': 'Meditation and yoga',
  'cat.dhyan-aur-yoog.subtitle': 'Simple ways to calm the mind',
  'cat.gharelu-marammat.title': 'Home repairs',
  'cat.gharelu-marammat.subtitle': 'Fixes for small problems around the house',
  'cat.bachchon-ki-padhai.title': 'Children\'s studies',
  'cat.bachchon-ki-padhai.subtitle': 'Studying, and worried about it',
  'cat.budharge-seva.title': 'Caring for the elderly',
  'cat.budharge-seva.subtitle': 'Care and support',
  'cat.shishu-dekhbhal.title': 'Baby care',
  'cat.shishu-dekhbhal.subtitle': 'Looking after a small child properly',
  'cat.dharmik-upay.title': 'Religious remedies',
  'cat.dharmik-upay.subtitle': 'With peace of mind',
  'cat.pavan-grah-aur-aarti.title': 'Holy texts and aarti',
  'cat.pavan-grah-aur-aarti.subtitle': 'Read and listen with devotion',
  'cat.aapatkalen-gayide.title': 'Emergency guide',
  'cat.aapatkalen-gayide.subtitle': 'When help is needed at once',
  'cat.mahamari-suraksha.title': 'Epidemic protection',
  'cat.mahamari-suraksha.subtitle': 'Stopping illness from spreading',
  'nav.tribute': 'In memory',
  'nav.help': 'Help',
  'nav.reference': 'About',
  'nav.reviews': 'Reviews',
  'nav.support': 'Support',
  'nav.birthChart': 'Birth chart',
  'jgd.title': 'Your birth chart',
  'jgd.intro': 'Enter your name, date of birth, and if you know them the time and place. Everything is worked out on your own phone — nothing is sent anywhere.',
  'jgd.nameLabel': 'Name at birth',
  'jgd.namePlaceholder': 'e.g. full name',
  'jgd.nameHint': 'The name given in childhood.',
  'jgd.dateLabel': 'Date of birth',
  'jgd.timeLabel': 'Time of birth',
  'jgd.timeHint': 'Leave blank if unknown.',
  'jgd.placeLabel': 'Place of birth',
  'jgd.placeNone': 'I don\'t know / choose',
  'jgd.placeHint': 'Choose the town of birth.',
  'jgd.submit': 'Work it out',
  'jgd.savePdf': 'Save as PDF',
  'jgd.again': 'Start again',
  'jgd.errDate': 'Please enter the date of birth correctly.',
  'jgd.errPlace': 'Choose your town from the list, or the nearest one that is in it.',
  'jgd.numTitle': 'Numerology',
  'jgd.lifePath': 'Life path',
  'jgd.nameNumber': 'Name number',
  'jgd.soulNumber': 'Soul number',
  'jgd.birthdayNumber': 'Birthday number',
  'jgd.astroTitle': 'Vedic astrology',
  'jgd.nakshatra': 'Nakshatra',
  'jgd.pada': 'Pada',
  'jgd.rashi': 'Rashi',
  'jgd.rashiLord': 'Rashi lord',
  'jgd.nakshatraLord': 'Nakshatra lord',
  'jgd.lagna': 'Lagna',
  'jgd.lagnaMissing': 'The lagna needs a birth time and a place. Fill them in above and work it out again — and if they are unknown, this is already plenty.',
  'jgd.gunTitle': 'Gun milan',
  'jgd.gunIntro': 'Enter the other person\'s name and date of birth.',
  'jgd.gunName': 'Their name',
  'jgd.gunDate': 'Their birth date',
  'jgd.gunHint': 'Both names and both dates give a gun milan score.',
  'jgd.disclaimer': 'This is a calculation in the traditional manner, not a prediction. No number or sign settles anyone\'s health, money or relationships. Take important decisions with a doctor, a lawyer or someone experienced.',
  'nav.menu': 'Menu',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.expand': 'Expand the bar',
  'nav.collapse': 'Collapse the bar',
  'nav.skip': 'Skip to content',
  'nav.language': 'Change language',

  'footer.pages': 'Pages',
  'footer.helplines': 'Important numbers',
  'footer.free': 'This service is entirely free. Nobody is charged.',
  'footer.readStory': 'Read her full story',
  'footer.admin': 'Owner',
  'footer.rights': 'Free service',
  'footer.emergency': 'Emergency',
  'footer.ambulance': 'Ambulance',
  'footer.women': "Women's helpline",

  'home.dedication1': ' — a completely free service.',
  'home.dedication2': 'Write your problem down, or say it out loud.',
  'home.emergencyTitle': 'Urgent — help needed now',
  'home.emergencyNote': 'Read these first. Everything else can wait.',
  'home.readMore': 'Read the full information',
  'home.chooseTopic': 'What do you need to know?',
  'home.memorialEyebrow': 'Who this site is for',
  'home.memorialLine': 'Who fought for society all her life, and who did not, in the end, receive her share.',
  'home.memorialMore': 'Read her full story',
  'home.kundaliTitle': 'Birth chart',
  'home.kundaliNote': 'A full chart — the nine grahas, Vimshottari dasha, phaladesh, yoga, shodasvarga, KP, Lal Kitab and Anka. All of it computed on your phone.',
  'home.chooseTopicNote':
    'Tap a subject below. Everything is written in plain language.',
  'home.askHere': 'Ask about this subject',
  'home.categoryEmpty': 'Nothing has been written here yet.',
  'home.soundTitle': 'Sound for peace',
  'home.soundIntro': 'No fee, no adverts. Only to calm the mind.',
  'home.howTitle': 'How this service works',
  'home.step1Title': 'Write it, or say it',
  'home.step1Body':
    'Type in your language, or press the microphone and speak. Nothing needs to be formal — just write whatever is on your mind.',
  'home.step2Title': 'An answer comes back at once',
  'home.step2Body':
    'Every question is recorded and answered straight away. If it is long, try a short one first.',
  'home.step3Title': 'No cost, no personal details',
  'home.step3Body':
    'This service is free. Your name, address and phone number are never asked for, and no advertisements are shown.',
  'home.stepLabel': 'Step',
  'home.freeTitle': 'This service is completely free',
  'home.freeBody':
    'No money is taken, no personal details are asked for, and no advertisements are shown.',
  'help.q1.label': 'The power has gone, what do I do?',
  'help.q1.question':
    'The power in the house has gone. What should I do, and how do I charge my phone?',
  'help.q2.label': 'A child weak at school',
  'help.q2.question': 'My child is very weak in studies. How can I improve this at home?',
  'help.q3.label': 'Care for an elderly parent',
  'help.q3.question': 'My father is very old now. How should I look after him?',
  'help.q4.label': 'If there is a fire at home',
  'help.q4.question': 'If there is a fire in the house at night, what should be done first?',

  'help.title': 'Write your problem',
  'help.intro':
    'Write or speak below. If you are not sure, put it down however it comes — that matters more than anything else.',
  'help.suggested': 'Common questions',
  'help.howTitle': 'How this service works',
  'help.howBody':
    'Every question is recorded and answered at once. Your name, address and phone number are never collected. Everything is free.',

  'ref.title': 'What this service is, and who it is for',
  'ref.intro':
    'This service was built in memory of Smt. VARSHA ji. It explains in plain language what it does, what it contains, and where its limits are. Everything is free — no money is taken, no advertisements are shown, and no personal details are asked for.',
  'ref.whatTitle': 'What it covers',
  'ref.what1':
    'Fire in the house, power cuts, a child falling behind at school, caring for elderly parents — plain answers to ordinary problems.',
  'ref.what2':
    'You can ask by speaking. If speaking is difficult, write instead; the answer is the same either way.',
  'ref.what3':
    'Every question is recorded, so a worry that troubles many people has usually been asked and answered before you arrive.',
  'ref.what4':
    'No advertisements, no unnecessary notices, and no personal details are collected. Everything is free.',
  'ref.helplineTitle': 'Keep these numbers to hand',
  'ref.helpline1':
    'For any serious danger — fire, a strong electric shock, a fall, or heavy bleeding — call 112.',
  'ref.helpline2':
    'If someone is ill or injured and cannot be moved, call 108 for an ambulance.',
  'ref.helpline3':
    'If a woman has been assaulted or is being harassed, call 181. It is free.',
  'ref.helpline4':
    'If a child or an elderly person is being exploited, complaints can be made on 1098.',
  'ref.helpline5':
    'If stress is overwhelming or there is no will to live, call 14416. Just to talk.',
  'ref.dataTitle': 'What is kept about you',
  'ref.dataBody':
    'Only the question you asked, a summary of it, and when it was asked — so the same answer is not given twice. Your name, address, phone number and nothing that identifies you is ever collected. No advertising or tracking scripts run on this site.',
  'ref.adminTitle': 'What the owner can do',
  'ref.adminBody':
    'The owner can read the questions that have been submitted and write replies to them. They cannot change or delete an article without your consent, and they cannot sell your details to anyone.',
  'ref.statsCategories': 'Subjects available',
  'ref.statsArticles': 'Articles written',
  'ref.statsQuestions': 'Questions asked',
  'ref.ownerNote':
    'This service belongs to no company and no government; it runs in memory of one person. That is why there is no advertising, no membership, and no charge.',

  'support.title': 'This service is free',
  'support.intro':
    'It takes no money from anyone. But it does run, and it costs to run — so there are ways you can help. The easiest one helps most.',
  'support.waysTitle': 'How you can help',
  'support.way1Title': 'Write down your experience',
  'support.way1Body':
    'If something here helped you — or if something here left you more confused — write it on the reviews page. You do not have to give your name.',
  'support.way2Title': 'Tell us about where you live',
  'support.way2Body':
    'Language, custom and trouble differ from place to place. If something local is missing here, say so, and it can be added.',
  'support.way3Title': 'Pass it on to someone',
  'support.way3Body':
    'What is written here could help a great many people, if only they knew. Tell someone who would truly be helped.',
  'support.way4Title': 'Come and look',
  'support.way4Body':
    'If you have time, open the site and check that it is working properly. If anything is broken, say so — it will be fixed for nothing.',
  'support.contactTitle': 'Something to tell us?',
  'support.contactBody':
    'Write here about anything at all — a mistake, something useful you found, or a question. As much or as little as is easy.',
  'support.faqTitle': 'Questions that come up often',
  'support.contactMessageLabel': 'Your message',
  'support.contactPlaceholder': 'Write whatever you want to say — a mistake you found, something that helped, or a question.',
  'support.contactHelp': 'At least 10 characters. This goes straight to the owner.',
  'support.contactSubmit': 'Send',
  'support.contactSending': 'Sending…',
  'support.contactPrivacy': 'You do not have to give your name.',
  'support.contactSent': 'It has arrived',
  'support.contactSentBody': 'Your message has reached the owner.',
  'support.contactFailed': 'It could not be sent',
  'support.faq1Q': 'Is this really free?',
  'support.faq1A': 'Yes. No money is taken, no adverts are shown, and no membership is sold. It runs on one person\'s money, not a company\'s or a government\'s.',
  'support.faq2Q': 'Is my name, address or phone number taken?',
  'support.faq2A': 'No, and it will not be. The site builds no identity of its own — no login, no tracking script. All that is asked is your question, and when you ask it.',
  'support.faq3Q': 'Is this a doctor or a lawyer?',
  'support.faq3A': 'No. It gives no medical advice and no legal advice. Where the matter is serious it tells you to see a doctor or an official — it does not take their place.',
  'support.faq4Q': 'Is every answer right?',
  'support.faq4A': 'Not always. A computer writes the answer, not a doctor — which is why every answer carries a line saying it is not medical advice. See a doctor before starting or stopping any medicine.',
  'support.faq5Q': 'Will I have to download an app?',
  'support.faq5A': 'No. It opens in the browser. No app to install, no permission to grant, no update to wait for.',
  'support.faqBody':
    'Is it really free? Yes. Is my name taken? No, and it is not required. Are there advertisements? No. Is a phone number or address asked for? No. Does an app need installing? No, it opens in the browser.',

  'ask.label': 'Write your problem, or speak it',
  'ask.placeholder': 'For example: my child is weak in studies',
  'ask.help': 'You can also press Enter to send.',
  'ask.send': 'Ask',
  'ask.sending': 'Thinking…',
  'ask.clear': 'Clear what you typed',
  'ask.speak': 'Ask by speaking',
  'ask.listening': 'Start speaking…',
  'ask.heard': 'Listening',
  'ask.stopListening': 'Stop listening',
  'ask.suggested': 'Common questions',
  'ask.answerTitle': 'Answer',
  'ask.listen': 'Listen',
  'ask.stopSpeak': 'Stop',
  'ask.aiNote': 'This answer came from AI. It is not a substitute for an expert.',
  'ask.errorRateLimit':
    'Too many questions at once. Please try again in a moment.',
  'ask.errorNetwork': 'The internet is not working. Check the connection and try again.',
  'ask.notAnswer': 'We do not have a direct answer to this question.',
  'ask.emptyAnswer': 'No answer could be made this time. Try asking a little differently.',
  'ask.micUnsupported': 'Speaking is not available in this browser. Please write instead.',
  'ask.heardWith': 'Hearing:',

  'voice.notAllowed':
    'The microphone was not permitted. Allow it above, or write instead.',
  'voice.serviceNotAllowed':
    'The microphone was not permitted. Allow it above, or write instead.',
  'voice.noSpeech': 'No speech was heard. Speak near the microphone, or write.',
  'voice.audioCapture': 'No microphone was found. Connect one, or write instead.',
  'voice.network':
    'Asking by voice needs the internet, and it is not working. Write instead — the answer is the same.',
  'voice.aborted': 'Stopped. Please try again.',
  'voice.unsupported': 'Asking by voice does not work in this browser. Please write instead.',
  'voice.speakFailed': 'This answer could not be read aloud.',
  'voice.noVoice': 'This device has no voice for {name} installed. Read the text for now, or add a voice in your settings.',
  'voice.generic': 'Something went wrong. Please try again.',

  'sound.title': 'Sound for peace',
  'sound.intro': 'No fee, no adverts. Only to calm the mind.',
  'sound.playing': 'Playing. Press the same button again to stop.',
  'sound.shankh': 'Conch',
  'sound.shankhHint': 'Deep, long',
  'sound.bansuri': 'Flute',
  'sound.bansuriHint': 'Soft, slow',
  'sound.dhol': 'Drum',
  'sound.dholHint': 'Sharp, quick',
  'sound.all': 'All three',
  'sound.allHint': 'Together',
  'sound.listenLabel': 'Listen',
  'sound.errUnsupported': 'This browser cannot play the sound.',
  'sound.errGeneric': 'The sound could not be started.',

  'dhun.welcome': 'Welcome',
  'dhun.prompt': 'Conch, flute and drum together — tap to listen.',
  'dhun.listen': '▶ Listen',
  'dhun.skip': 'Skip the sound',
  'dhun.failed': 'The sound could not be played.',
  'dhun.label': 'Permission to play sound',

  'reviews.title': 'Your view, in your own words',
  'reviews.intro':
    'Was this service useful to you? Write what you think — your name is not needed.',
  'reviews.pageTitle': 'Your view',
  'reviews.pageIntro':
    'Everything people have written is shown here. Nothing is hidden, and what is written appears as it is — it is only read once before it is published.',
  'reviews.write': 'Write your review',
  'reviews.submit': 'Send',
  'reviews.sending': 'Sending…',
  'reviews.name': 'Your name (not required)',
  'reviews.city': 'Your town (not required)',
  'reviews.comment': 'What you want to say',
  'reviews.placeholder': 'Write whatever comes to mind — it does not need correcting first.',
  'reviews.moderated': 'Your review is read once before it is published.',
  'reviews.moderationNote':
    'To keep everything safe, each review is read once before it is published. Abuse, phone numbers and personal details are removed; everything else appears exactly as written.',
  'reviews.summaryTitle': 'In general',
  'reviews.count': 'reviews',
  'reviews.anonymous': 'No name given',
  'reviews.summaryLine': 'People gave {rating} out of 5 across {count} reviews.',
  'reviews.starsLabel': '{value} out of 5 stars',
  'reviews.keepLabel': 'Write whether it was bad or good — both are wanted',
  'reviews.ownerReply': 'Reply',
  'reviews.replyLabel': 'They wrote',
  'reviews.empty': 'There are no reviews yet. You could write the first.',
  'reviews.toastSent': 'Thank you',
  'reviews.toastFailed': 'The review could not be sent',
  'reviews.fieldTooShort': 'Please write at least 10 characters.',
  'reviews.rateLimited': 'That was very fast. Wait a moment and try again.',

  'cat.notFound': 'This page was not found',
  'cat.empty': 'There are no articles in this subject yet.',
  'article.emergency': 'Urgent',
  'article.askAbout': 'Ask about this subject',
  'article.readAloud': 'Listen to this article',
  'article.others': 'More articles on this subject',
  'article.count': '{count} articles',

  'theme.toLight': 'Switch to the light appearance',
  'theme.toDark': 'Switch to the dark appearance',
  'toast.dismiss': 'Close',

  'language.choose': 'Choose your language',
  'language.articlesIn': 'This article is in Hindi.',
  'language.articlesInHint':
    'Each language needs its own translation. This one has not been made yet, so what is written here is complete and correct in Hindi.',

  'ask.welcome': 'Welcome! Write your problem below, or choose a topic.',

  'ref.notTitle': 'What it does not do',

  'ref.not1': 'This is not a doctor. It never gives advice about medicines.',

  'ref.not2': 'This is not a lawyer. It gives no legal advice.',

  'ref.not3': 'It takes no money and shows no advertising.',

  'ref.not4': 'It never asks for your name, address or phone number, and never stores them.',

  'ref.not5': 'It never invents a scheme name, a helpline number or a price. If it does not know, it says so plainly.',

  'ref.medicalTitle': 'Important: this is not medical advice',

  'ref.medicalBody': 'For anything to do with illness, medicines or a poison, see a doctor first. The information here is general help only. Get medical advice before a child\'s vaccination, during pregnancy, or before starting any medicine.',

  'ref.statsTitle': 'How much information there is',

  'support.howTitle': 'How you can help us',

  'support.alwaysFreeTitle': 'This service will always stay free',

  'support.alwaysFreeBody': 'Whatever help comes in will go into keeping the service running. Nobody will ever be charged.',

  'smriti.eyebrow': 'In tribute',

  'smriti.whyTitle': 'Why this site exists',

  'smriti.ending': 'Her struggle carries on here.',

  'article.askAny': 'Ask a question',

  'article.remember': 'Remember',

  'article.emergencyInfo': 'Important information',

  'article.medicalTitle': 'This is not medical advice',

  'article.medicalBody': 'This information is general help. Never start or stop any medicine without a doctor.',

  'article.heading': 'Articles on {category}',

  'reviews.rateQuestion': 'How many stars would you give?',

  'reviews.starsShort': '{value} stars',

  'reviews.averageOutOf': '{value} out of 5 stars',

  'dhun.welcomeTitle': 'Welcome',

  'dhun.consent': 'Shell, flute and drum together. Tap to listen.',

  'dhun.unsupported': 'This browser cannot play the sound.',

  'dhun.failedTry': 'There was a problem playing the sound.',

  'sound.hintIdle': 'Press any button to hear a sound.',

  'sound.hintPlaying': 'It is playing. Press the same button again to stop.',

  'sound.preparing': 'Getting the sound ready',

  'nav.path': 'Breadcrumb',
  /* ---- health questions, by age ---- */
  'health.heading': 'Tell us your age',
  'health.intro': 'The questions people of each age ask most often. Tap any one — it fills the box below, then ask it.',
  'health.ageLabel': 'Age (years)',
  'health.years': 'years',
  'health.bandsLabel': 'Choose by age',
  'health.notAdviceStrong': 'This is not medical advice.',
  'health.notAdvice': 'Do not start or stop any medicine — see a doctor first.',
  'health.emergencyStrong': 'In an emergency, call:',
  'health.emergencyCall': '(emergency)',
  'health.emergencyAmbulance': '(ambulance)',
  'health.emergencyWomen': '(women\'s helpline)',
  'health.privacy': 'No name or address is needed.',
  'health.band.infant.label': '0 – 2 years',
  'health.band.infant.note': 'Babies too young to say what is wrong',
  'health.c.infant1': 'High fever',
  'health.q.infant1': 'My baby has a high fever — should I give milk?',
  'health.c.infant2': 'Not eating',
  'health.q.infant2': 'My baby is not eating at all, what should I do?',
  'health.c.infant3': 'Vomiting',
  'health.q.infant3': 'My baby is vomiting, when should I see a doctor?',
  'health.c.infant4': 'Diarrhoea',
  'health.q.infant4': 'My baby has diarrhoea, what should I feed?',
  'health.band.child.label': '3 – 12 years',
  'health.band.child.note': 'Children who can speak, but are afraid to ask',
  'health.c.child1': 'Won\'t study',
  'health.q.child1': 'My child will not concentrate on studies, what should I do?',
  'health.c.child2': 'Refuses school',
  'health.q.child2': 'My child refuses to go to school every day, why might that be?',
  'health.c.child3': 'Night fever',
  'health.q.child3': 'My child gets a fever at night, what should I do?',
  'health.c.child4': 'Teeth breaking',
  'health.q.child4': 'My child\'s teeth are breaking, how do I look after them?',
  'health.band.teen.label': '13 – 17 years',
  'health.band.teen.note': 'Teenagers, who often have nobody who will listen',
  'health.c.teen1': 'Study pressure',
  'health.q.teen1': 'The pressure of studies is too much, how do I handle it?',
  'health.c.teen2': 'No sleep',
  'health.q.teen2': 'I cannot sleep properly at night, what should I do?',
  'health.c.teen3': 'Phone addiction',
  'health.q.teen3': 'I am addicted to my phone, how do I get free of it?',
  'health.c.teen4': 'Very low mood',
  'health.q.teen4': 'I feel very depressed, who should I talk to?',
  'health.band.young.label': '18 – 30 years',
  'health.band.young.note': 'Work, money and sleep — all three at once',
  'health.c.young1': 'Work stress',
  'health.q.young1': 'The stress from work is far too much, how do I reduce it?',
  'health.c.young2': 'Back pain from sitting',
  'health.q.young2': 'My back hurts from sitting all day, what should I do?',
  'health.c.young3': 'No sleep',
  'health.q.young3': 'I cannot fall asleep at night, what can I try?',
  'health.c.young4': 'Money is short',
  'health.q.young4': 'My money is short and my expenses are high, what should I do?',
  'health.band.middle.label': '31 – 45 years',
  'health.band.middle.note': 'Home, children and your own health, all at once',
  'health.c.middle1': 'Lower back pain',
  'health.q.middle1': 'I have lower back pain, what could be causing it?',
  'health.c.middle2': 'Poor sleep',
  'health.q.middle2': 'My sleep is not improving, what can I do about it?',
  'health.c.middle3': 'Stress at home',
  'health.q.middle3': 'There is a lot of stress at home, how do I handle the children?',
  'health.c.middle4': 'Stomach gas',
  'health.q.middle4': 'I have had stomach gas at work for years, what should I do?',
  'health.band.later.label': '46 – 60 years',
  'health.band.later.note': 'The age of the body, and looking after it, together',
  'health.c.later1': 'Back pain',
  'health.q.later1': 'I am 54 years old and I have back pain, what should I do?',
  'health.c.later2': 'Knee pain',
  'health.q.later2': 'My knee hurts when I climb stairs, why is that?',
  'health.c.later3': 'Night cramps',
  'health.q.later3': 'I get cramps in my leg at night, what should I do?',
  'health.c.later4': 'Morning stiffness',
  'health.q.later4': 'My lower back is stiff when I get up in the morning, why?',
  'health.band.senior.label': '61 – 75 years',
  'health.band.senior.note': 'Medicines, balance and loneliness, all together',
  'health.c.senior1': 'Trouble walking',
  'health.q.senior1': 'My knees hurt so much that walking is difficult, what should I do?',
  'health.c.senior2': 'Too many medicines',
  'health.q.senior2': 'I have to take many medicines daily — how do I know which ones are harmful?',
  'health.c.senior3': 'Night urine',
  'health.q.senior3': 'I have to get up for the toilet several times a night, what should I do?',
  'health.c.senior4': 'Hearing loss',
  'health.q.senior4': 'I am finding it hard to hear — what can I do about it?',
  'health.band.elder.label': '76 – 100 years',
  'health.band.elder.note': 'Every medicine needs checking, every fall matters',
  'health.c.elder1': 'Fear of falling',
  'health.q.elder1': 'I am afraid of falling at home — what safety can I add?',
  'health.c.elder2': 'Failing memory',
  'health.q.elder2': 'My memory is getting weaker, what can I do about it?',
  'health.c.elder3': 'Daily painkillers',
  'health.q.elder3': 'I take a painkiller every day — is that harmful?',
  'health.c.elder4': 'When to see a doctor',
  'health.q.elder4': 'When does it become important to see a doctor?',

  'ask.notConfigured': 'This service is answering from its saved library for now. Your question was not in it.',

  'ask.browseTitle': 'Here is what this site does cover',

  /* ---- save / download ---- */

  'download.pdf': 'Save as PDF',
  'download.text': 'Save as text',
  'download.printNow': 'Print',
  'download.preparing': 'Preparing',
  'download.blocked': 'A new tab could not open. Your browser is blocking pop-ups — allow this site.',

  /* ---- attach a document ---- */

  'attach.button': 'Attach your document or photo',
  'attach.formats': 'PDF, photo (JPG/PNG) or text file — up to 12 MB',
  'attach.reading': 'Reading…',
  'attach.attached': 'Attached',
  'attach.remove': 'Remove',
  'attach.tooBigPdf': 'This PDF is over 12 MB. Please pick a smaller file.',
  'attach.tooBigImage': 'This photo is over 3 MB. Please pick a smaller one.',
  'attach.scannedPdf': 'This PDF is a scan, so it contains only a picture of the page and cannot be read. Send a photograph of it instead.',
  'attach.pdfFailed': 'This PDF could not be read.',
  'attach.imageFailed': 'This photo could not be loaded.',
  'attach.wrongType': 'This kind of file cannot be used. Send a PDF, a photo or a text file.',
  'attach.hint': 'Attach your paper and ask your question — the answer will be about that paper.',
  'ask.sendWithFile': 'Answer this',

  /* ---- free library ---- */

  'lib.title': 'Free library',
  'lib.intro': 'School books, books, pictures and audio — all free and all legal.',
  'lib.legalTitle': 'No copyright trouble.',
  'lib.legal': 'Everything here is free to keep and free to pass on. A book still under copyright is not on this page — copying it is not allowed, and saying so plainly is better than pretending.',
  'ask.signInTitle': 'Sign in first',
  'ask.signInBody': 'Make an account to ask a question. It takes under a minute, and then you can keep asking.',
  'ask.signInCta': 'Make an account or sign in',
  'ask.signInFirst': 'Sign in first, then ask your question.',
  'ask.signInOr': 'Cannot make an account now? These work without one:',
  'account.title': 'My account',
  'account.intro': 'Sign in with your handle and password.',
  'account.signIn': 'Sign in',
  'account.register': 'Make an account',
  'account.signInNote': 'Use the handle you chose last time.',
  'account.registerNote': 'You do not need an account to ask a question. This is only so your language and your answers are kept.',
  'account.handle': 'Your handle',
  'account.handlePlaceholder': 'e.g. sita.ji',
  'account.password': 'Password',
  'account.passwordHint': 'At least six characters.',
  'account.phone': 'Phone number',
  'account.optional': 'not required',
  'account.phoneHint': 'Give it if you wish. The account is made without it too.',
  'account.create': 'Make the account',
  'account.logout': 'Sign out',
  'account.open': 'Open my account',
  'account.signedInAs': 'You are signed in as',
  'account.signedOut': 'Not signed in',
  'account.signedOutBody': 'No account is open in this browser.',
  'account.saved': 'Saved answers',
  'account.savedEmpty': 'Nothing saved yet. Use \'Save\' on an answer to keep it.',
  'account.savedUnavailable': 'Saved answers cannot be shown right now. Everything else still works.',
  'account.wait': 'Please wait…',
  'account.privacyTitle': 'What is kept',
  'account.privacyBody': 'An account stores your name, your password and your language. It does not record what you asked. Your questions are not sent to anyone.',
  'account.errWrong': 'Wrong name or password.',
  'account.errTaken': 'That name is taken. Choose another.',
  'account.errBad': 'Please fill in the form correctly.',
  'account.errWait': 'Too many attempts. Try again a little later.',
  'account.errTryLater': 'It did not work right now. Try again shortly.',
  'lib.licence.ccBy': 'You may copy, share and print it, provided you credit the source.',
  'lib.licence.ccBySa': 'You may copy and print it. Any change you make must also be shared openly.',
  'lib.licence.ccZero': 'Entirely free. Not even a credit is required.',
  'lib.licence.pd': 'Nobody holds the copyright — copy it freely.',
  'lib.licence.govtIndia': 'On a Government of India website. Reading and printing are both free.',
  'lib.licence.creativeCommons': 'Each file has its own licence — look at the file.',
  'lib.licence.freeToRead': 'Free to read. Passing it on is allowed on the same terms it came with.',
  'lib.openBadge': 'Open',
  'lib.openBadgeNote': 'you may copy it',
  'lib.freeBadge': 'Free',
  'lib.freeBadgeNote': 'free to read, not to copy',
  'lib.govt': 'Government',
  'lib.noSignup': 'No sign-up',
  'lib.open': 'Open it',
  'lib.group.padhai': 'School and study books',
  'lib.group.padhai.note': 'Textbooks, college material and government education sites',
  'lib.group.kitab': 'Books',
  'lib.group.kitab.note': 'Either out of copyright, or explicitly free to copy',
  'lib.group.tasveer': 'Pictures and diagrams',
  'lib.group.tasveer.note': 'Maps, photographs, illustrations',
  'lib.group.audio': 'Things to listen to',
  'lib.group.audio.note': 'Books as audio, for not wanting to read small print',
  'lib.warnTitle': 'Not every book is here',
  'lib.warn': 'Some books are still under copyright and cannot legally be given away free. They are deliberately not listed. If you need one of those, ask below — whatever can be answered will be.',
  'lib.askInstead': 'Ask instead',
  'nav.library': 'Library',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'Home remedies',
  'remedy.title': 'Ayurvedic home remedies',
  'remedy.intro': 'Whatever the trouble — cough, headache, arthritis, itching, diabetes, back pain — choose it below or ask in your own words. You will get the household kadha, massage, diet and Ayurvedic measures for it.',
  'remedy.choose': 'Choose your trouble',
  'remedy.emergencyStrong': 'These are emergencies:',
  'remedy.emergency': 'A snake bite, a scorpion sting or a dog bite means a hospital at once — call 112 first. Home measures are only for the journey, never instead of the hospital.',
  'remedy.note': 'Home and Ayurvedic measures help ease the trouble; they do not replace examination and treatment by a doctor. Do not start or stop any medicine on your own.',
  'remedy.cough': 'Cough',
  'remedy.headache': 'Headache',
  'remedy.joints': 'Arthritis',
  'remedy.itching': 'Itching',
  'remedy.snake': 'Snake bite',
  'remedy.scorpion': 'Scorpion sting',
  'remedy.dog': 'Dog bite',
  'remedy.diabetes': 'Diabetes',
  'remedy.back': 'Back pain',
  'remedy.walking': 'Difficulty walking',
  'home.remedyNote': 'Kadha, massage, diet and Ayurvedic measures — for every trouble, in your language.',
  'nav.aarti': 'Aarti and bhajan',
  'aarti.title': 'Aarti and bhajan — in a real voice',
  'aarti.intro': 'Listen to aarti, kirtan and bhajan here — in the voices of real singers and real temples. No AI voice.',
  'aarti.note': 'An aarti or a bhajan played in a computer voice loses its chaal and its devotion. So everything here is a real recording.',
  'aarti.kindAarti': 'Aarti',
  'aarti.kindKirtan': 'Kirtan',
  'aarti.kindBhajan': 'Bhajan',
  'aarti.credit': 'Recording:',
  'aarti.licence': 'Licence:',
  'aarti.listenLink': 'Listen in a real voice',
  'aarti.textChecked': 'This is the traditional text, as it is sung in the real recording.',
  'aarti.textPrinted': 'This is the traditional text, checked against published collections.',
  'aarti.textNotStored': 'The full text of this granth is not stored here — the recording below carries the whole of it.',
  'aarti.granthTitle': 'Granths, chalisas and stotras — in a real voice',
  'aarti.noRecording': 'There is no real recording of this aarti on the site yet, so I cannot sing it to you — I never sing an aarti in an AI voice.',
  'aarti.textOnlyTitle': 'More aartis — the words and a real voice',
  'aarti.fullText': 'Full text',
  'aarti.notChecked': 'The verified text of this aarti is not on the site yet. An unchecked text is not given, because a wrong word in a prayer is worse than no words.',
  'aarti.verifiedList': 'The site has verified texts for these aartis:',

};

/* -------------------------------------------------------------------------- */
/* OTHER LANGUAGES                                                            */
/* -------------------------------------------------------------------------- */

/*
 * Coverage is uneven, and the fallback chain covers the gaps: anything missing
 * here resolves to English rather than to Hindi, because English is a language
 * far more visitors can read than Hindi is. The navigation, the question box and
 * the sound panel are translated here, because those are what someone touches
 * first.
 */

const BENGALI: Record<string, string> = {
  'jgd.placeSearch': 'আপনার শহরের নাম লিখুন',
  'jgd.placeNoMatch': 'এই শহরটি তালিকায় নেই। এর নিকটতম শহরটি বেছে নিন।',

  'account.name': 'আপনার নাম',
  'account.namePlaceholder': 'যেমন: সীতা দেবী',
  'account.nameHint': 'যাতে আমরা জানি আপনি কে। যেকোনো নাম চলবে, এবং এটি আবশ্যক নয়।',

  'nav.home': 'হোম', 'home.metaTitle': 'বিনামূল্যে সমাধান, আপনার নিজের শব্দে', 'nav.tribute': 'স্মৃতি', 'nav.help': 'সহায়তা', 'nav.reference': 'পরিচিতি',
  'lib.licence.ccZero.name': 'CC0 / পাবলিক ডোমেইন',
  'lib.licence.pd.name': 'পাবলিক ডোমেইন',
  'lib.licence.govtIndia.name': 'ভারত সরকার',
  'lib.licence.creativeCommons.name': 'ক্রিয়েটিভ কমন্স (মিশ্র)',
  'lib.licence.freeToRead.name': 'পড়ার জন্য মুক্ত',
  'lib.entry.ncert.title': 'NCERT বই — শ্রেণি ১ থেকে ১২',
  'lib.entry.ncert.what': 'প্রতিটি বিষয়ের সব বই, প্রতিটি শ্রেণির জন্য। লগইন ছাড়া, সরাসরি PDF।',
  'lib.entry.ncert.langs': 'হিন্দি, ইংরেজি এবং ৩০-এর বেশি ভারতীয় ভাষা',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ডিজিটাল পাঠ্যপুস্তক',
  'lib.entry.pm-evidya.what': 'NCERT বইয়ের অ্যাপ, বড় হরফে পড়া যায়। উচ্চস্বরে শোনানোও যায়।',
  'lib.entry.pm-evidya.langs': 'ভারতীয় ভাষা',
  'lib.entry.diksha.title': 'DIKSHA — শিক্ষক ও শিশুদের জন্য',
  'lib.entry.diksha.what': 'পাঠ, ভিডিও ও অনুশীলন — শ্রেণি ১ থেকে ১২।',
  'lib.entry.diksha.langs': 'ভারতীয় ভাষা',
  'lib.entry.khan-academy.title': 'Khan Academy — ইংরেজিতে গণিত ও বিজ্ঞান',
  'lib.entry.khan-academy.what': 'প্রতিটি শ্রেণিপর্যন্ত ভিডিও পাঠ, লিখিত পাঠও আছে।',
  'lib.entry.openstax.title': 'OpenStax — ইংরেজিতে বিনামূল্যের বই',
  'lib.entry.openstax.what': 'কলেজ স্তরের বই — গণিত, বিজ্ঞান, মানবিক। প্রতিটি পৃষ্ঠায় PDF।',
  'lib.entry.nios.title': 'NIOS — দূরশিক্ষা, বিনামূল্যের উপকরণ',
  'lib.entry.nios.what': 'ওপেন ও অনলাইন কোর্সের বিনামূল্যের বই, ভর্তি ছাড়াই।',
  'lib.entry.nios.langs': 'হিন্দি, ইংরেজি ও অন্যান্য',
  'lib.entry.ignou.title': 'IGNOU — উচ্চশিক্ষার বিনামূল্যের বই',
  'lib.entry.ignou.what': 'দূরশিক্ষার বই, সম্পূর্ণ বিনামূল্যে।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ইংরেজির পুরনো বই',
  'lib.entry.gutenberg.what': '৭০,০০০-এর বেশি বই, সবের কপিরাইট শেষ। বিনামূল্যের ই-বুক ও অডিও।',
  'lib.entry.pratham-books.title': 'Pratham Books — শিশুদের বই',
  'lib.entry.pratham-books.what': 'ভারতীয় ভাষায় শিশুদের বই, সম্পূর্ণ বিনামূল্যে। শ্রেণি ১ থেকে ৫।',
  'lib.entry.pratham-books.langs': 'হিন্দি, মারাঠি, বাঙালি, তামিল, তেলুগু ও আরও',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — সংবাদপত্র ও পুরনো ম্যাগাজিন',
  'lib.entry.internet-archive-texts.what': 'লক্ষ লক্ষ পুরনো বই, ম্যাগাজিন ও সংবাদপত্র — বিনামূল্যে।',
  'lib.entry.wikisource.title': 'Wikisource — মুক্ত পাঠ',
  'lib.entry.wikisource.what': 'কোনো কপিরাইট নেই — এগুলি পুরনো সাহিত্যের বই।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — প্রতিটি ধরনের ছবি',
  'lib.entry.wikimedia-commons.what': 'প্রাণী, মানচিত্র, তারা, ইতিহাস — সবকিছু। প্রতিটি ছবির নিজস্ব লাইসেন্স আছে।',
  'lib.entry.pixabay.title': 'Pixabay — ছবি ও চিত্র',
  'lib.entry.pixabay.what': 'ছবি, অঙ্কন ও ছোট ভিডিও।',
  'lib.entry.unsplash.title': 'Unsplash — সুন্দর ছবি',
  'lib.entry.unsplash.what': 'বিনামূল্যে, বড় মানের, অ্যাকাউন্ট ছাড়াই।',
  'lib.entry.openverse.title': 'Openverse — সব বিনামূল্যের ছবি এক জায়গায়',
  'lib.entry.openverse.what': 'একসাথে একাধিক বিনামূল্যের ছবির সাইট খুঁজুন।',
  'lib.entry.librivox.title': 'LibriVox — শোনার জন্য বই',
  'lib.entry.librivox.what': 'পুরনো ইংরেজি বইয়ের বিনামূল্যের অডিও, মানুষের গলায়।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — অডিও সংগ্রহ',
  'lib.entry.internet-archive-audio.what': 'হাজার হাজার বিনামূল্যের অডিও — বই, বক্তৃতা, সংগীত।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — জাতীয় সংগীত ও অন্যান্য',
  'lib.entry.vande-mataram.what': 'ভারতের জাতীয় সংগীত ও অন্যান্য জাতীয় গান, বিনামূল্যে।',
  'art.aag-aur-bijli-ke-bachav.title': 'আগ ও বিদ্যুৎ থেকে বাঁচার নিয়ম',
  'art.aag-aur-bijli-ke-bachav.summary': 'বাড়িতে আগ লাগা রোধের উপায় — সহজ নিয়ম',
  'art.aag-lagne-par-kya-karein.title': 'আগ লেগে থাকলে কী করবেন',
  'art.aag-lagne-par-kya-karein.summary': 'জ্বলন্ত বাড়িতে আগ — আগে কী করবেন, কী করবেন না',
  'art.bimari-se-bachav.title': 'সংক্রমণ থেকে বাঁচার সাতটি নিয়ম',
  'art.bimari-se-bachav.summary': 'হাত ধোওয়া, মাস্ক, টিকা — কীভাবে নিরাপদ থাকবেন',
  'art.dhuwan-ka-jhakora.title': 'ধোঁয়ার দম বন্ধ হওয়া থেকে বাঁচুন',
  'art.dhuwan-ka-jhakora.summary': 'দম বন্ধ হচ্ছে, শ্বাস হচ্ছে না — কী করবেন, কবে হাসপাতাল যাবেন',
  'art.doodh-pani-band-ho.title': 'বিদ্যুৎ বা পানি হঠাৎ বন্ধ হয়ে গেলে',
  'art.doodh-pani-band-ho.summary': 'কী করবেন, কী এড়িয়ে চলবেন, কবে সাহায্য চাইবেন',
  'art.haath-ki-saafai.title': 'সাবান ছাড়া হাত পরিষ্কার করার উপায়',
  'art.haath-ki-saafai.summary': 'পানি বা সাবান না থাকলে',
  'cat.dhyan-aur-yoog.title': 'ধ্যান ও যোগ',
  'cat.dhyan-aur-yoog.subtitle': 'মন শান্ত করার সহজ উপায়',
  'cat.gharelu-marammat.title': 'ঘরের মেরামত',
  'cat.gharelu-marammat.subtitle': 'বাড়ির ছোট ছোট সমস্যার সমাধান',
  'cat.bachchon-ki-padhai.title': 'সন্তানের পড়াশোনা',
  'cat.bachchon-ki-padhai.subtitle': 'পড়াশোনায় নিযোজিত, উদ্বিগ্ন',
  'cat.budharge-seva.title': 'বয়স্কদের সেবা',
  'cat.budharge-seva.subtitle': 'যত্ন ও সহায়তা',
  'cat.shishu-dekhbhal.title': 'শিশুর যত্ন',
  'cat.shishu-dekhbhal.subtitle': 'ছোট শিশুর সঠিক যত্ন',
  'cat.dharmik-upay.title': 'ধর্মীয় উপায়',
  'cat.dharmik-upay.subtitle': 'মনের শান্তি নিয়ে',
  'cat.pavan-grah-aur-aarti.title': 'পবিত্র গ্রন্থ ও আরতি',
  'cat.pavan-grah-aur-aarti.subtitle': 'শ্রদ্ধার সাথে পড়ুন ও শুনুন',
  'cat.aapatkalen-gayide.title': 'জরুরি গাইড',
  'cat.aapatkalen-gayide.subtitle': 'যখন তৎক্ষণাৎ সাহায্য দরকার',
  'cat.mahamari-suraksha.title': 'মহামারি সুরক্ষা',
  'cat.mahamari-suraksha.subtitle': 'রোগ ছড়ানো ঠেকানো',
  'nav.reviews': 'মতামত', 'nav.support': 'সহায়তা করুন', 'nav.menu': 'মেনু',
  'nav.birthChart': 'জন্ম গণ্ঠা',
  'jgd.title': 'আপনার জন্ম গণ্ঠা',
  'jgd.intro': 'আপনার নাম, জন্মের তারিখ, এবং জানা থাকলে সময় ও জায়গা লিখুন। সব হিসাব আপনার নিজের ফোনেই হয় — কিছুও কোথাও পাঠানো হয় না।',
  'jgd.nameLabel': 'জন্মের নাম',
  'jgd.namePlaceholder': 'যেমন পূর্ণ নাম',
  'jgd.nameHint': 'যে নাম ছোটবেলায় দেওয়া হয়েছিল।',
  'jgd.dateLabel': 'জন্মের তারিখ',
  'jgd.timeLabel': 'জন্মের সময়',
  'jgd.timeHint': 'জানা না থাকলে খালি রাখুন।',
  'jgd.placeLabel': 'জন্মস্থান',
  'jgd.placeNone': 'জানা নেই / বেছে নিন',
  'jgd.placeHint': 'জন্মের শহর বেছে নিন।',
  'jgd.submit': 'হিসাব করুন',
  'jgd.savePdf': 'PDF তৈরি করুন',
  'jgd.again': 'নতুন হিসাব',
  'jgd.errDate': 'অনুগ্রহ করে জন্মের তারিখ সঠিকভাবে লিখুন।',
  'jgd.errPlace': 'তালিকা থেকে আপনার শহর বেছে নিন, অথবা তার নিকটতম শহর বেছে নিন।',
  'jgd.numTitle': 'সংখ্যা জ্যোতিষ',
  'jgd.lifePath': 'জীবন পথ',
  'jgd.nameNumber': 'নাম সংখ্যা',
  'jgd.soulNumber': 'আত্মা সংখ্যা',
  'jgd.birthdayNumber': 'জন্মদিন সংখ্যা',
  'jgd.astroTitle': 'বৈদিক জ্যোতিষ',
  'jgd.nakshatra': 'নক্ষত্র',
  'jgd.pada': 'পদ',
  'jgd.rashi': 'রাশি',
  'jgd.rashiLord': 'রাশির রাজা',
  'jgd.nakshatraLord': 'নক্ষত্রের রাজা',
  'jgd.lagna': 'লগ্ন',
  'jgd.lagnaMissing': 'লগ্নের জন্য জন্মের সময় ও জায়গা দরকার। উপরে পূরণ করে আবার হিসাব করুন — জানা না থাকলে এটুকুই যথেষ্ট।',
  'jgd.gunTitle': 'গুণ মিলন',
  'jgd.gunIntro': 'অন্য ব্যক্তির নাম ও জন্মের তারিখ দিন।',
  'jgd.gunName': 'তার নাম',
  'jgd.gunDate': 'তার জন্মের তারিখ',
  'jgd.gunHint': 'দুই নাম ও দুই তারিখ থাকলে গুণ মিলন বের হয়।',
  'jgd.disclaimer': 'এটি বিধিবদ্ধ পদ্ধতিতে হিসাব, ভবিষ্যদ্বাণী নয়। কোনো সংখ্যা বা রাশি কারও স্বাস্থ্য, টাকা বা সম্পর্ক ঠিক করে না। বড় সিদ্ধান্তে ডাক্তার, আইনজীবী বা অভিজ্ঞ কারও পরামর্শ নিন।',
  'nav.openMenu': 'মেনু খুলুন', 'nav.closeMenu': 'মেনু বন্ধ করুন', 'nav.language': 'ভাষা বদলান',
  'nav.expand': 'বার খুলুন', 'nav.collapse': 'বার বন্ধ করুন', 'nav.skip': 'সরাসরি বিষয়বস্তুতে যান',
  'ask.label': 'আপনার সমস্যা লিখুন বা বলুন', 'ask.placeholder': 'যেমন: সন্তানের পড়াশোনায় দুর্বলতা',
  'ask.help': 'এন্টার চাপলেও পাঠানো যাবে।', 'ask.send': 'জিজ্ঞাসা করুন', 'ask.sending': 'ভাবছি…',
  'ask.clear': 'লেখা মুছুন', 'ask.speak': 'বলে জিজ্ঞাসা করুন', 'ask.listening': 'বলতে শুরু করুন…',
  'ask.heard': 'শুনছি', 'ask.stopListening': 'শোনা বন্ধ করুন', 'ask.suggested': 'সাধারণ প্রশ্ন',
  'ask.answerTitle': 'উত্তর', 'ask.listen': 'শুনুন', 'ask.stopSpeak': 'থামান',
  'ask.aiNote': 'এই উত্তরটি AI দিয়েছে। বিশেষজ্ঞের বিকল্প নয়।',
  'sound.title': 'শান্তির শব্দ', 'sound.intro': 'কোনো খরচ নেই, কোনো বিজ্ঞাপন নেই।',
  'sound.shankh': 'শঙ্খ', 'sound.bansuri': 'বাঁশি', 'sound.dhol': 'ঢোল', 'sound.all': 'তিনটি',
  'dhun.welcome': 'স্বাগতম', 'dhun.prompt': 'শঙ্খ, বাঁশি ও ঢোল একসাথে শুনতে ছুঁয়ে দিন।',
  'dhun.listen': 'শুনুন', 'dhun.skip': 'বাদ দিন', 'home.readMore': 'সম্পূর্ণ তথ্য পড়ুন',
  'home.chooseTopic': 'কী জানতে চান?', 'home.askHere': 'এই বিষয়ে জিজ্ঞাসা করুন',
  'home.howTitle': 'এই সেবা কীভাবে কাজ করে', 'home.soundTitle': 'শান্তির শব্দ',
  'footer.pages': 'পাতা', 'footer.helplines': 'জরুরি নম্বর', 'footer.readStory': 'তাঁর সম্পূর্ণ কথা পড়ুন',
  'reviews.title': 'আপনার মতামত, আপনার কথা', 'reviews.submit': 'পাঠান', 'reviews.comment': 'আপনার কথা',
  'language.choose': 'আপনার ভাষা বেছে নিন', 'language.articlesIn': 'এই প্রবন্ধটি হিন্দিতে।',
  'home.freeTitle': 'এই সেবা সম্পূর্ণ বিনামূল্যে', 'home.freeBody': 'টাকা নেওয়া হয় না, ব্যক্তিগত তথ্য চাওয়া হয় না, বিজ্ঞাপন দেখানো হয় না।',
  'home.emergencyNote': 'এগুলো আগে পড়ুন। বাকি সব পরে।',

  'ask.welcome': 'স্বাগতম! নিচে আপনার সমস্যা লিখুন বা একটি বিষয় বেছে নিন।',

  'ref.notTitle': 'এটি যা করে না',

  'ref.not1': 'এটি ডাক্তার নয়। ওষুধের পরামর্শ কখনও দেওয়া হয় না।',

  'ref.not2': 'এটি আইনজীবী নয়। আইনি পরামর্শ দেওয়া হয় না।',

  'ref.not3': 'কোনো টাকা নেওয়া হয় না, এবং কোনো বিজ্ঞাপন দেখানো হয় না।',

  'ref.not4': 'আপনার নাম, ঠিকানা বা ফোন নম্বর চাওয়া হয় না এবং রাখা হয় না।',

  'ref.not5': 'সরকারি প্রকল্পের দাম বা নম্বর বানানো হয় না — তথ্য না জানলে স্পষ্ট করে বলা হয় যে জানা নেই।',

  'ref.medicalTitle': 'গুরুত্বপূর্ণ: এটি ডাক্তারের পরামর্শ নয়',

  'ref.medicalBody': 'রোগ, ওষুধ বা বিষাক্ত কিছু নিয়ে হলে সবার আগে ডাক্তারের সাথে দেখা করুন। এখানে দেওয়া তথ্য শুধু সাধারণ সাহায্যের জন্য। সন্তানের টিকা, গর্ভাবস্থা, বা যেকোনো ওষুধ শুরু করার আগে অবশ্যই ডাক্তারের পরামর্শ নিন।',

  'ref.statsTitle': 'কতটা তথ্য আছে',

  'support.howTitle': 'আপনারা আমাদেরকে কীভাবে সাহায্য করবেন',

  'support.alwaysFreeTitle': 'এই সেবা সবসময় বিনামূল্যে থাকবে',

  'support.alwaysFreeBody': 'যত সাহায্য আসবে, তা এই সেবা চালাতে ব্যবহার হবে। কারও কাছ থেকে কখনো টাকা নেওয়া হবে না।',

  'smriti.eyebrow': 'স্মরণে',

  'smriti.whyTitle': 'এই সাইট কেন',

  'smriti.ending': 'তাঁর সংগ্রাম এখানেই এগিয়ে চলে।',

  'article.askAny': 'একটি প্রশ্ন করুন',

  'article.remember': 'মনে রাখবেন',

  'article.emergencyInfo': 'গুরুত্বপূর্ণ তথ্য',

  'article.medicalTitle': 'এটি চিকিৎসা পরামর্শ নয়',

  'article.medicalBody': 'এই তথ্য সাধারণ সাহায্যের জন্য। ডাক্তারের পরামর্শ ছাড়া কোনো ওষুধ শুরু বা বন্ধ করবেন না।',

  'article.heading': '{category} নিয়ে লেখা',

  'reviews.rateQuestion': 'কতগুলো তারা দেবেন?',

  'reviews.starsShort': '{value} তারা',

  'reviews.averageOutOf': '5-এর মধ্যে {value} তারা',

  'dhun.welcomeTitle': 'স্বাগতম',

  'dhun.consent': 'শঙ্খ, বাঁশি ও নগাড়া একসাথে। শুনতে ছুঁয়ে দিন।',

  'dhun.failed': 'ধ্বনি বাজানো যায়নি।',

  'dhun.unsupported': 'এই ব্রাউজার ধ্বনি বাজাতে পারে না।',

  'dhun.failedTry': 'ধ্বনি বাজাতে সমস্যা হয়েছে।',

  'sound.hintIdle': 'কোনো বোতাম চেপে ধ্বনি শুনুন।',

  'sound.hintPlaying': 'আওয়াজ বাজছে। থামাতে একই বোতামে আবার চাপুন।',

  'sound.preparing': 'ধ্বনি প্রস্তুত হচ্ছে',

  'nav.path': 'পথ',

  'toast.dismiss': 'বন্ধ করুন',

  'footer.free': 'এই পরিষেবা সম্পূর্ণ বিনামূল্যে। কারও কাছ থেকে পয়সা নেওয়া হয় না।',

  'cat.empty': 'এই বিষয়ে এখন কোনো লেখা নেই।',
  'cat.notFound': 'এই পাতাটি পাওয়া যায়নি',

  'dhun.label': 'শব্দ চালানোর অনুমতি',

  'language.articlesInHint': 'প্রতিটি ভাষায় আলাদা অনুবাদ দরকার। এই অনুবাদ এখনো হয়নি — যা লেখা আছে তা হিন্দিতেই সবচেয়ে ঠিক ও সম্পূর্ণ।',

  'theme.toDark': 'অন্ধকার রঙে যান',

  'theme.toLight': 'উজ্জ্বল রঙে যান',

  'ask.emptyAnswer': 'এবার উত্তর বানানো গেল না। একটু অন্য কথায় আবার জিজ্ঞাসা করুন।',

  'ask.errorNetwork': 'ইন্টারনেট কাজ করছে না। সংযোগ দেখে আবার চেষ্টা করুন।',

  'ask.errorRateLimit': 'খুব একসাথে অনেক প্রশ্ন পাঠানো হয়েছে। একটু পরে চেষ্টা করুন।',

  'ask.heardWith': 'এখন শুনছি',

  'ask.micUnsupported': 'এই ব্রাউজারে বলে জিজ্ঞাসা করা কাজ করবে না। লিখে জিজ্ঞাসা করুন।',

  'ask.notAnswer': 'এই প্রশ্নের সরাসরি উত্তর আমাদের কাছে নেই।',


  'article.askAbout': 'এই বিষয়ে জিজ্ঞাসা করুন',

  'article.count': '{count}টি লেখা',

  'article.emergency': 'জরুরি',

  'article.others': 'এই বিষয়ের আরও লেখা',

  'article.readAloud': 'এই লেখাটি শুনুন',

  'footer.admin': 'প্রবন্ধক',

  'footer.ambulance': 'অ্যাম্বুলেন্স',

  'footer.emergency': 'জরুরি অবস্থা',

  'footer.rights': 'নিঃশুল্প সেবা',

  'footer.women': 'মহিলা হেল্পলাইন',

  'sound.allHint': 'একসাথে',

  'sound.bansuriHint': 'কোমল, ধীর',

  'sound.dholHint': 'তীক্ষ্ণ, দ্রুত',

  'sound.errGeneric': 'ধ্বনি চালাতে সমস্যা হয়েছে।',

  'sound.errUnsupported': 'এই ব্রাউজার ধ্বনি চালাতে পারছে না।',

  'sound.listenLabel': 'শুনুন',

  'sound.playing': 'আওয়াজ বাজছে। থামাতে একই বোতামে আবার চাপুন।',

  'sound.shankhHint': 'গভীর, দীর্ঘ',

  'voice.aborted': 'থেমে গেছে। আবার চেষ্টা করুন।',

  'voice.audioCapture': 'মাইক পাওয়া যায়নি। ডিভাইসটি লাগান, অথবা লিখে জিজ্ঞাসা করুন।',

  'voice.generic': 'কিছু একটা গোলমাল হয়েছে। আবার চেষ্টা করুন।',

  'voice.network': 'বলে জিজ্ঞাসা করতে ইন্টারনেট দরকার, কিন্তু সেটি চলছে না। লিখে জিজ্ঞাসা করুন — একই উত্তর পাবেন।',

  'voice.noSpeech': 'কোনো কথা শোনা যায়নি। মাইকের কাছে বলুন, অথবা লিখুন।',

  'voice.notAllowed': 'মাইকের অনুমতি পাওয়া যায়নি। উপরে গিয়ে অনুমতি দিন, অথবা লিখে জিজ্ঞাসা করুন।',

  'voice.serviceNotAllowed': 'মাইকের অনুমতি পাওয়া যায়নি। উপরে গিয়ে অনুমতি দিন, অথবা লিখে জিজ্ঞাসা করুন।',

  'voice.speakFailed': 'এই উত্তরটি পড়ে শোনানো যায়নি।',
  'voice.noVoice': 'এই ডিভাইসে {name} ভাষার কোনো কণ্ঠস্বর নেই। এখন লেখাটি পড়ুন, অথবা সেটিংসে গিয়ে কণ্ঠস্বর যোগ করুন।',

  'voice.unsupported': 'এই ব্রাউজারে বলে জিজ্ঞাসা করা কাজ করবে না। লিখে জিজ্ঞাসা করুন।',

  'ask.notConfigured': 'এই সেবাটি এখন সংরক্ষিত উত্তরের ভাণ্ডার থেকে উত্তর দিচ্ছে। আপনার প্রশ্ন সেখানে ছিল না।',

  'ask.browseTitle': 'এখানে যা লেখা আছে, তা দেখুন',

  'health.heading': 'আপনার বয়স বলুন',

  'health.intro': 'বয়স অনুযায়ী যে প্রশ্নগুলি নিয়মিত জিজ্ঞাসা করা হয়, সেগুলি এখানে দেখা যাবে। কোনো বাটন চাপুন — প্রশ্ন নিচে পূরণ হবে, তারপর জিজ্ঞাসা করুন।',

  'health.ageLabel': 'বয়স (বছর)',

  'health.years': 'বছর',

  'health.bandsLabel': 'বয়স অনুযায়ী বেছে নিন',

  'health.notAdviceStrong': 'এটি চিকিৎসা পরামর্শ নয়।',

  'health.notAdvice': 'কোনো ঔষধ শুরু বা বন্ধ করবেন না — আগে ডাক্তারের সাথে দেখা করুন।',

  'health.emergencyStrong': 'জরুরি অবস্থায় ফোন করুন:',

  'health.emergencyCall': '(জরুরি)',

  'health.emergencyAmbulance': '(অ্যাম্বুলেন্স)',

  'health.emergencyWomen': '(নারী সহায়তা)',

  'health.privacy': 'নাম বা ঠিকানা লিখতে হবে না।',

  'health.band.infant.label': '0 – 2 বছর',

  'health.band.child.label': '3 – 12 বছর',

  'health.band.teen.label': '13 – 17 বছর',

  'health.band.young.label': '18 – 30 বছর',

  'health.band.middle.label': '31 – 45 বছর',

  'health.band.later.label': '46 – 60 বছর',

  'health.band.senior.label': '61 – 75 বছর',

  'health.band.elder.label': '76 – 100 বছর',

  /* ---- save / download ---- */

  'download.pdf': 'PDF হিসেবে নিন',
  'download.text': 'লেখা হিসেবে নিন',
  'download.printNow': 'প্রিন্ট করুন',
  'download.preparing': 'তৈরি হচ্ছে',
  'download.blocked': 'নতুন ট্যাব খোলা যায়নি। ব্রাউজার পপ-আপ আটকে দিচ্ছে — অনুমতি দিন।',

  /* ---- attach a document ---- */

  'attach.button': 'আপনার নথি বা ছবি যুক্ত করুন',
  'attach.formats': 'PDF, ছবি (JPG/PNG) বা টেক্সট ফাইল — ১২ MB পর্যন্ত',
  'attach.reading': 'পড়া হচ্ছে…',
  'attach.attached': 'যুক্ত হয়েছে',
  'attach.remove': 'সরান',
  'attach.tooBigPdf': 'এই PDF ১২ MB-এর বেশি। ছোট ফাইল বেছে নিন।',
  'attach.tooBigImage': 'এই ছবি ৩ MB-এর বেশি। ছোট ছবি বেছে নিন।',
  'attach.scannedPdf': 'এই PDF স্ক্যান করা — এতে শুধু ছবি আছে, পড়া যায় না। বদলে এর একটি ছবি পাঠান।',
  'attach.pdfFailed': 'এই PDF পড়া গেল না।',
  'attach.imageFailed': 'এই ছবি লোড হলো না।',
  'attach.wrongType': 'এই ধরনের ফাইল কাজ করবে না। PDF, ছবি বা টেক্সট ফাইল পাঠান।',
  'attach.hint': 'আপনার কাগজ এখানে যুক্ত করে প্রশ্ন করুন — উত্তর সেই কাগজ সম্পর্কেই হবে।',
  'ask.sendWithFile': 'এর উত্তর দিন',

  /* ---- free library ---- */

  'lib.title': 'বিনামূল্যে গ্রন্থাগার',
  'lib.intro': 'পাঠ্যবই, বই, ছবি ও অডিও — সবই বিনামূল্যে এবং বৈধভাবে।',
  'lib.legalTitle': 'কপিরাইটের কোনো সমস্যা নেই।',
  'lib.legal': 'যা এখানে দেওয়া আছে তা সম্পূর্ণ বিনামূল্যে এবং আপনি সেটি ছড়াতে পারেন। যে বই এখনও কপিরাইটের অধীন, সেটি এখানে নেই — সেটি কপি করা অনুমোদিত নয়, সরাসরি বলাই ভালো।',
  'ask.signInTitle': 'আগে ঢুকুন',
  'ask.signInBody': 'প্রশ্ন করতে একটি অ্যাকাউন্ট বানান। এক মিনিটেরও কম লাগে, তারপর আপনি প্রশ্ন করতে পারবেন।',
  'ask.signInCta': 'অ্যাকাউন্ট করুন বা ঢুকুন',
  'ask.signInFirst': 'আগে ঢুকুন, তারপর প্রশ্ন করুন।',
  'ask.signInOr': 'এখন অ্যাকাউন্ট বানানো যাচ্ছে না? এগুলো অ্যাকাউন্ট ছাড়াই কাজ করে:',
  'account.title': 'আমার অ্যাকাউন্ট',
  'account.intro': 'আপনার নাম ও পাসওয়ার্ড দিয়ে ঢুকুন।',
  'account.signIn': 'ঢুকুন',
  'account.register': 'অ্যাকাউন্ট করুন',
  'account.signInNote': 'গতবারের নাম ও পাসওয়ার্ড দিন।',
  'account.registerNote': 'প্রশ্ন করতে অ্যাকাউন্ট লাগে না। এটি শুধু আপনার ভাষা ও উত্তর মনে রাখার জন্য।',
  'account.handle': 'আপনার নাম',
  'account.handlePlaceholder': 'যেমন: sita.ji',
  'account.password': 'পাসওয়ার্ড',
  'account.passwordHint': 'অন্তত ছয়টি অক্ষর।',
  'account.phone': 'ফোন নম্বর',
  'account.optional': 'আবশ্যক নয়',
  'account.phoneHint': 'চাইলে দিন। ছাড়াও খ্যাকাউন্ট হয়ে যাবে।',
  'account.create': 'অ্যাকাউন্ট করুন',
  'account.logout': 'বের হোন',
  'account.open': 'অ্যাকাউন্ট খুলুন',
  'account.signedInAs': 'আপনি ঢেঁকে আছেন',
  'account.signedOut': 'লগইন করা নেই',
  'account.signedOutBody': 'এই ব্রাউজারে কোনো অ্যাকাউন্ট খোলা নেই।',
  'account.saved': 'সংরক্ষিত উত্তর',
  'account.savedEmpty': 'এখনও কিছু সংরক্ষণ করা হয়নি। উত্তরে \'সংরক্ষণ করুন\' চাপুন।',
  'account.savedUnavailable': 'সংরক্ষিত উত্তর এখন দেখা যাচ্ছে না। বাকি সব চলছে।',
  'account.wait': 'অপেক্ষা করুন…',
  'account.privacyTitle': 'আপনার তথ্য',
  'account.privacyBody': 'অ্যাকাউন্টে শুধু আপনার নাম, পাসওয়ার্ড ও ভাষা থাকে। আপনি কী জিজ্ঞেস করেছেন তা রেকর্ড হয় না। আপনার প্রশ্ন কাউকে পাঠানো হয় না।',
  'account.errWrong': 'নাম বা পাসওয়ার্ড ভুল।',
  'account.errTaken': 'এই নাম নেওয়া হয়েছে। অন্য নাম নিন।',
  'account.errBad': 'ফর্ম ঠিকভাবে পূরণ করুন।',
  'account.errWait': 'অনেকবার চেষ্টা হয়েছে। একটু পরে আবার চেষ্টা করুন।',
  'account.errTryLater': 'এখন হতে পারেনি। একটু পরে আবার চেষ্টা করুন।',
  'lib.licence.ccBy': 'আপনি কপি, শেয়ার ও ছাপ করতে পারেন — উৎসের নাম দিতে হবে।',
  'lib.licence.ccBySa': 'আপনি কপি ও ছাপ করতে পারেন। যে পরিবর্তন করবেন, সেটিও খোলা করে দিতে হবে।',
  'lib.licence.ccZero': 'সম্পূর্ণ বিনামূল্যে। উৎসের নামও দিতে হবে না।',
  'lib.licence.pd': 'এর কোনো কপিরাইট নেই — যা খুশি কপি করুন।',
  'lib.licence.govtIndia': 'ভারত সরকারের ওয়েবসাইটে। পড়া ও ছাপা দুটোই বিনামূল্যে।',
  'lib.licence.creativeCommons': 'প্রতিটি ফাইলের নিজস্ব লাইসেন্স আছে — ফাইলে দেখুন।',
  'lib.licence.freeToRead': 'পড়া বিনামূল্যে। অন্যকে দেওয়াও একই শর্তে করা যাবে, যেই শর্তে এসেছে।',
  'lib.openBadge': 'উন্মুক্ত',
  'lib.openBadgeNote': 'অনুলিপি করা যায়',
  'lib.freeBadge': 'বিনামূল্যে',
  'lib.freeBadgeNote': 'পড়া যায়, কপি করা যায় না',
  'lib.govt': 'সরকারি',
  'lib.noSignup': 'অ্যাকাউন্ট ছাড়াই',
  'lib.open': 'এখানে খুলুন',
  'lib.group.padhai': 'পাঠ্যবই ও পড়াশোনা',
  'lib.group.padhai.note': 'পাঠ্যপত্র, মহাবিদ্যালয় ও সরকারি শিক্ষা উপকরণ',
  'lib.group.kitab': 'বই',
  'lib.group.kitab.note': 'যেগুলি কপিরাইটমুক্ত, অথবা কপি করার অনুমতি আছে',
  'lib.group.tasveer': 'ছবি ও মানচিত্র',
  'lib.group.tasveer.note': 'মানচিত্র, ছবি, চিত্র — সবকিছু',
  'lib.group.audio': 'শোনার উপকরণ',
  'lib.group.audio.note': 'বই অডিওতে, ছোট হরফ না পড়ে',
  'lib.warnTitle': 'প্রতিটি বই এখানে নেই',
  'lib.warn': 'কিছু বই এখনও কপিরাইটের অধীন, তাই আইন অনুযায়ী সেগুলি বিনামূল্যে দেওয়া যায় না। সেগুলি ইচ্ছাকৃতভাবে দেখানো হয়নি। কোনো বই লাগলে নিচে জিজ্ঞাসা করুন — যা বলা সম্ভব তা বলা হবে।',
  'lib.askInstead': 'জিজ্ঞাসা করুন',
  'nav.library': 'গ্রন্থাগার',

  'help.title': 'আপনার সমস্যা লিখুন',

  'help.intro': 'নিচে লিখুন বা বলুন। জানা না থাকলে মনে যা আসে লিখে দিন — এটিই সবচেয়ে জরুরি।',

  'help.howTitle': 'এই সেবা কীভাবে কাজ করে',

  'help.howBody': 'প্রতিটি প্রশ্ন নথিভুক্ত হয় এবং তার উত্তর সঙ্গে সঙ্গে পাওয়া যায়। আপনার নাম, ঠিকানা বা ফোন নম্বর কোথাও নেওয়া হয় না। সবই বিনামূল্যে।',

  'help.suggested': 'সাধারণ প্রশ্ন',

  'help.q1.label': 'বিদ্যুৎ চলে গেছে, কী করব?',

  'help.q1.question': 'বাড়িতে বিদ্যুৎ চলে গেছে। কী করা উচিত, আর মোবাইল কীভাবে চার্জ করব?',

  'help.q2.label': 'সন্তানের পড়াশোনায় দুর্বলতা',

  'help.q2.question': 'আমার ছেলের পড়াশোনায় খুব দুর্বলতা আছে। বাড়িতে কীভাবে সুধারাব?',

  'help.q3.label': 'বৃদ্ধের চিকিৎসা',

  'help.q3.question': 'আমার বাবার বয়স খুব বেশি, তাঁর চিকিৎসা কীভাবে করব?',

  'help.q4.label': 'বাড়িতে আগুন লাগলে',

  'help.q4.question': 'রাতে বাড়িতে আগুন লাগলে সবার আগে কী করা উচিত?',

  'home.stepLabel': 'ধাপ',

  'home.step1Title': 'আপনার কথা লিখুন বা বলুন',

  'home.step1Body': 'বাংলায় টাইপ করুন, বা মাইক চেপে বলুন। কিছু বিশেষ করার দরকার নেই — মনে যা আসে তাই লিখুন।',

  'home.step2Title': 'সঙ্গে সঙ্গে উত্তর পাবেন',

  'home.step2Body': 'প্রতিটি প্রশ্ন নথিভুক্ত হয় এবং তার উত্তর সঙ্গে সঙ্গে পাওয়া যায়। খুব বড় প্রশ্নের আগে ছোট প্রশ্ন দিয়ে শুরু করুন।',

  'home.step3Title': 'টাকা নেই, ব্যক্তিগত তথ্য নেই',

  'home.step3Body': 'এই সেবা সম্পূর্ণ বিনামূল্যে। আপনার নাম, ঠিকানা বা ফোন নম্বর চাওয়া হয় না, আর কোনো বিজ্ঞাপনও দেখানো হয় না।',

  'home.memorialEyebrow': 'এই সাইট কার জন্য',
  'home.memorialLine': 'যিনি সারা জীবন সমাজের জন্য লড়াই করেছিলেন, এবং অবশেষে নিজের অংশের হিসাব পাননি।',
  'home.memorialMore': 'তাঁর পুরো গল্প পড়ুন',
  'home.kundaliTitle': 'জন্ম গণ্ঠা',
  'home.kundaliNote': 'পূর্ণ কুণ্ডলী — নয়টি গ্রহ, বিমশোত্তরী দশা, ফলাদেশ, যোগ, শোদশবর্গ, কেপি, লাল কিতাব এবং অঙ্ক জ্যোতিষ। সব আপনার ফোনেই হিসাব হবে।',
  'home.chooseTopicNote': 'নিচের বিষয়ে ট্যাপ করুন। প্রতিটি জায়গায় সহজ ভাষায় তথ্য দেওয়া আছে।',

  'home.categoryEmpty': 'এই বিষয়ে এখনো কোনো লেখা লেখা হয়নি।',

  'home.soundIntro': 'কোনো ফি নেই, কোনো বিজ্ঞাপন নেই। শুধু মন শান্ত করার জন্য।',
  'home.emergencyTitle': 'জরুরি — এখনই সাহায্য দরকার',

  'home.dedication1': 'স্মরণে — সম্পূর্ণ বিনামূল্যে সেবা।',

  'home.dedication2': 'আপনার সমস্যা লিখুন বা বলুন।',

  'ref.title': 'এই সেবা কী, এবং কার জন্য',

  'ref.intro': 'এই সেবাটি তিনি VARSHA মেমে তাঁর স্মৃতিতে তৈরি করা হয়েছে। এখানে সহজ ভাষায় বলা আছে এটি কী করে, এতে কী আছে এবং এর সীমা কী। সবকিছু সম্পূর্ণ বিনামূল্যে — কোনো টাকা নেওয়া হয় না, কোনো বিজ্ঞাপন দেখানো হয় না, এবং কোনো ব্যক্তিগত তথ্য চাওয়া হয় না।',

  'ref.whatTitle': 'এতে কী আছে',

  'ref.what1': 'বাড়িতে আগুন, বিদ্যুৎ চলে যাওয়া, সন্তানের পড়াশোনায় দুর্বলতা, বাবা-মায়ের যত্ন নেওয়া — এসব সাধারণ সমস্যার সহজ উপায়, পরিষ্কার ভাষায়।',

  'ref.what2': 'প্রশ্ন করে বলে জিজ্ঞাসা করার সুবিধা। বলতে না পারলে লিখুন — দুটোর উত্তর এক হয়।',

  'ref.what3': 'প্রতিটি প্রশ্ন নথিভুক্ত হয়, তাই যা অন্যদের কষ্ট দেয় তা আপনার আগেই জিজ্ঞাসিত হয়ে থাকে এবং তার উত্তর পাওয়া যায়।',

  'ref.what4': 'কোনো বিজ্ঞাপন নেই, অপ্রয়োজনীয় তথ্য নেই, এবং কোনো ব্যক্তিগত তথ্য চাওয়া হয় না। সবকিছু বিনামূল্যে।',

  'ref.statsArticles': 'লেখা হয়েছে',

  'ref.statsCategories': 'বিষয় উপলব্ধ',

  'ref.statsQuestions': 'প্রশ্ন করা হয়েছে',

  'ref.adminTitle': 'প্রশাসক যা করতে পারেন',

  'ref.adminBody': 'আপনি যে লেখা পাঠিয়েছেন প্রশাসক তা দেখতে এবং তার উত্তর লিখতে পারেন। আপনার অনুমতি ছাড়া তারা কোনো লেখা বদলাতে বা মুছতে পারেন না, এবং আপনার তথ্য কাউকে বিক্রি করা হয় না।',

  'ref.dataTitle': 'আপনার সম্পর্কে আমরা যা রাখি',

  'ref.dataBody': 'শুধু আপনার জিজ্ঞাসিত প্রশ্ন, তার সারাংশ এবং জিজ্ঞাসার সময় — যাতে একই উত্তর বারবার না দিতে হয়। আপনার নাম, ঠিকানা, ফোন নম্বর বা পরিচয় বোঝায় এমন কোনো তথ্য নেওয়া হয় না। সাইটে কোনো বিজ্ঞাপন বা ট্র্যাকিং স্ক্রিপ্ট নেই।',

  'ref.helplineTitle': 'জরুরি সাহায্যের জন্য এই নম্বরগুলো রাখুন',

  'ref.helpline1': 'বড় বিপদ হলে — আগুন, বিদ্যুৎ ঝটকা, পড়ে যাওয়া বা অতিরিক্ত রক্তপাত — 112 নম্বরে ফোন করুন।',

  'ref.helpline2': 'কারও অসুস্থ বা আঘাত পেয়েছে এবং যাওয়ার বাহন নেই, তাহলে 108 নম্বরে অ্যাম্বুলেন্স চাইুন।',

  'ref.helpline3': 'নারীর সাথে কোনো খারাপ কিছু ঘটলে, বা নারীকে কোথাও কষ্ট দেওয়া হচ্ছে, তাহলে 181 নম্বরে ফোন করুন। এটি বিনামূল্যে।',

  'ref.helpline4': 'সন্তান বা প্রবীণের সাথে কোনো অত্যাচার হলে 1098 নম্বরে অভিযোগ করা যায়।',

  'ref.helpline5': 'মানসিক চাপ অত্যন্ত বেশি হলে, বা বাঁচার ইচ্ছে না হলে, 14416 নম্বরে কথা বলা যায়। শুধু কথা বলার জন্য।',

  'ref.ownerNote': 'এই সেবা কোনো কোম্পানি বা সরকারের নয়, একজন মানুষের স্মৃতিতে চলছে। তাই এখানে কোনো বিজ্ঞাপন নেই, কোনো সদস্য নেই, এবং কোনো টাকা নেওয়া হয় না।',

  'support.title': 'এই সেবা বিনামূল্যে',

  'support.intro': 'এই সেবা কারও কাছ থেকে টাকা নেয় না। কিন্তু এটি চলে — তাই কিছু উপায় আছে যেগুলোতে আপনি সাহায্য করতে পারেন। সবচেয়ে সহজ উপায়টিই সবচেয়ে কাজে লাগে।',

  'support.contactTitle': 'কিছু বলতে চান?',

  'support.contactBody': 'যেকোনো বিষয়ে এখানে লিখতে পারেন — কোনো ভুল হলে, কিছু বেশি পেলে, বা কোনো প্রশ্ন থাকলে। যত লেখা সহজ মনে হয়, ততই লিখুন।',

  'support.faqTitle': 'কিছু কথা যেগুলি বারবার জিজ্ঞাসা করা হয়',

  'support.faqBody': 'এটি কি সত্যিই বিনামূল্যে? হ্যাঁ। আপনার নাম নেওয়া হয়? না, নাম দেওয়া আবশ্যক নয়। বিজ্ঞাপন আসে? না। ফোন নম্বর বা ঠিকানা চাওয়া হয়? না। কোনো অ্যাপ ডাউনলোড করতে হবে? না, শুধু ব্রাউজারে খুলে যায়।',

  'support.waysTitle': 'আপনি কীভাবে সাহায্য করতে পারেন',

  'support.way1Title': 'আপনার অভিজ্ঞতা লিখুন',

  'support.way1Body': 'যদি এই সাইট থেকে আপনার কিছু ভালো লাগে থাকে — বা এমন কিছু পেয়ে থাকেন যা আপনাকে উল্ঝনে ফেলে দিয়েছে — তাহলে রায় পেজে লিখে দিন। আপনার নাম নেওয়া আবশ্যক নয়।',

  'support.way2Title': 'আপনার শহর সম্পর্কে বলুন',

  'support.way2Body': 'আপনি যেখানে থাকেন সেখানকার ভাষা, রীতি এবং সমস্যা আলাদা। আপনার এখানে কিছু কথা এখানে না থাকলে জানান — যা যোগ করা যায় তা যোগ করা হবে।',

  'support.way3Title': 'আপনার অভিজ্ঞতা অন্যকে শোনান',

  'support.way3Body': 'এখানে যা লেখা আছে তা অনেকের কাজে লাগতে পারে, যদি তাঁরা জানেন। এমন কাউকে বলুন যাঁকে এটি সত্যিই সাহায্য করবে।',

  'support.way4Title': 'এসে দেখুন',

  'support.way4Body': 'আপনার সময় থাকলে, নিজে এসে দেখুন এই সাইট ঠিকভাবে চলছে কি না। কিছু ভুল দেখলে জানান — সম্পূর্ণ বিনামূল্যে ঠিক করে দেওয়া হবে।',

  'reviews.pageTitle': 'আপনার মতামত',

  'reviews.pageIntro': 'এখানে যা লোকেরা লিখেছেন তাই লেখা আছে। কোনো মতামত লুকানো হয় না, আর যা লেখা তাই এখানে দেখা যায় — শুধু একবার দেখার পর প্রকাশ করা হয়।',

  'reviews.intro': 'এই সেবা আপনার কাজে লেগেছে? আপনার কথা লিখুন — আপনার নাম নেওয়া আবশ্যক নয়।',

  'reviews.write': 'আপনার মতামত লিখুন',

  'reviews.starsLabel': '5-এর মধ্যে {value} তারা',

  'reviews.summaryTitle': 'সাধারণ মতামত',

  'reviews.summaryLine': 'লোকেরা গড়ে {rating}-এর মধ্যে 5-এ {count} তারা দিয়েছেন।',

  'reviews.count': 'পর্যালোচনা',

  'reviews.name': 'আপনার নাম (আবশ্যক নয়)',

  'reviews.city': 'আপনার শহর (আবশ্যক নয়)',

  'reviews.placeholder': 'মনে যা আসে তাই লিখুন — কিছু শুধরানোর দরকার নেই।',

  'reviews.keepLabel': 'খারাপ লাগলেও লিখুন, ভালো লাগলেও লিখুন — দুটোই',

  'reviews.fieldTooShort': 'অন্তত ১০ অক্ষর লিখুন।',

  'reviews.rateLimited': 'খুব দ্রুত পাঠানো হচ্ছে। একটু থেমে আবার চেষ্টা করুন।',

  'reviews.sending': 'পাঠানো হচ্ছে…',

  'reviews.moderated': 'আপনার পর্যালোচনা প্রকাশের আগে একবার দেখা হয়।',

  'reviews.moderationNote': 'সব কিছু মুছে ফেলা এড়াতে, প্রকাশের আগে প্রতিটি পর্যালোচনা একবার দেখা হয়। গালি, নম্বর বা ব্যক্তিগত কথা সরিয়ে দেওয়া হয় — বাকি সব যেমন আছে তেমনই প্রকাশ হয়।',

  'reviews.replyLabel': 'এর উপরে লেখা হয়েছে',

  'reviews.ownerReply': 'উত্তর',

  'reviews.empty': 'এখনও কোনো পর্যালোচনা নেই। প্রথমটি আপনিই লিখুন।',

  'reviews.anonymous': 'নাম ছাড়া',

  'reviews.toastSent': 'ধন্যবাদ',

  'reviews.toastFailed': 'মতামত পাঠানো যায়নি',

  'health.band.infant.note': 'খুব ছোট শিশু, যারা এখনও নিজের কথা বলতে পারে না',

  'health.band.child.note': 'যে শিশুরা কথা বলতে পারে, কিন্তু প্রশ্ন করতে ভয় পায়',

  'health.band.teen.note': 'কিশোর, যাদের প্রায়ই এমন কাউকে পান না যে শুনে নেয়',

  'health.band.young.note': 'চাকরি, টাকা আর ঘুম — তিনটের একসাথে ভার',

  'health.band.middle.note': 'বাড়ি, সন্তান আর নিজের স্বাস্থ্য — সবার দায়িত্ব একসাথে',

  'health.band.later.note': 'শরীরের বয়স আর তার যত্ন — দুটো একসাথে',

  'health.band.senior.note': 'ওষুধ, ভারসাম্য আর একাকিত্ব — তিনটাই একসাথে',

  'health.band.elder.note': 'প্রতিটি ঔষধ পরীক্ষা করা জরুরি, প্রতিটি পড়ে যাওয়া গুরুতর',

  'health.c.infant1': 'জ্বর তীব্র',

  'health.c.infant2': 'খাচ্ছে না',

  'health.c.infant3': 'বমি হচ্ছে',

  'health.c.infant4': 'ডায়রিয়া হচ্ছে',

  'health.c.child1': 'পড়াশোনায় মন বসে না',

  'health.c.child2': 'স্কুলে যেতে চায় না',

  'health.c.child3': 'রাতে জ্বর',

  'health.c.child4': 'দাঁত ভাঙছে',

  'health.c.teen1': 'পড়ার চাপ',

  'health.c.teen2': 'ঘুম আসছে না',

  'health.c.teen3': 'মোবাইলের অভ্যাস',

  'health.c.teen4': 'খুব বিষণ্ণ',

  'health.c.young1': 'কাজের চাপ',

  'health.c.young2': 'বসে থাকলে পিঠে ব্যথা',

  'health.c.young3': 'ঘুম আসছে না',

  'health.c.young4': 'পয়সা কম',

  'health.c.middle1': 'কোমর ব্যথা',

  'health.c.middle2': 'ঘুম ঠিকমতো হচ্ছে না',

  'health.c.middle3': 'বাড়ির চাপ',

  'health.c.middle4': 'পেটে গ্যাস',

  'health.c.later1': 'পিঠে ব্যথা',

  'health.c.later2': 'হাঁটুতে ব্যথা',

  'health.c.later3': 'রাতে পা টানে',

  'health.c.later4': 'সকালে জড়তা',

  'health.c.senior1': 'হাঁটতে কষ্ট',

  'health.c.senior2': 'ঔষধের পরীক্ষা',

  'health.c.senior3': 'রাতে প্রস্রাব',

  'health.c.senior4': 'কম শুনছি',

  'health.c.elder1': 'পড়ে যাওয়ার ভয়',

  'health.c.elder2': 'স্মৃতি দুর্বল',

  'health.c.elder3': 'প্রতিদিন ব্যথার ঔষধ',

  'health.c.elder4': 'কখন ডাক্তারের কাছে',

  'health.q.infant1': 'আমার ছেলের জ্বর হয়েছে, দুধ দেব কি?',

  'health.q.infant2': 'ছোট বাচ্চা খাচ্ছে না, কী করব?',

  'health.q.infant3': 'বাচ্চার বমি হচ্ছে, কখন ডাক্তারকে দেখাব?',

  'health.q.infant4': 'বাচ্চার ডায়রিয়া হচ্ছে, কী খাওয়াব?',

  'health.q.child1': 'ছেলের পড়াশোনায় মন বসছে না, কী করব?',

  'health.q.child2': 'বাচ্চা প্রতিদিন স্কুলে যেতে মানা করছে, কারণ কী হতে পারে?',

  'health.q.child3': 'বাচ্চার রাতে জ্বর আসে, কী করব?',

  'health.q.child4': 'বাচ্চার দাঁত ভাঙছে, দাঁতের যত্ন কীভাবে করব?',

  'health.q.teen1': 'পড়ার অনেক চাপ আছে, কীভাবে সামলাব?',

  'health.q.teen2': 'রাতে ঠিকমতো ঘুম আসছে না, কী করব?',

  'health.q.teen3': 'মোবাইলের অভ্যাস লেগে গেছে, ছাড়ার উপায় বলুন।',

  'health.q.teen4': 'খুব বিষণ্ণ লাগে, কার সাথে কথা বলব?',

  'health.q.young1': 'কাজের চাপ অনেক বেশি, কীভাবে কমাব?',

  'health.q.young2': 'বসে থাকলে পিঠে ব্যথা হচ্ছে, কী করব?',

  'health.q.young3': 'রাতে ঘুম আসছে না, কী উপায় আছে?',

  'health.q.young4': 'পয়সা কম আর খরচ বেশি, কী করব?',

  'health.q.middle1': 'কোমরে ব্যথা হচ্ছে, কারণ কী হতে পারে?',

  'health.q.middle2': 'ঘুম ভালো আসছে না, উন্নত করতে কী করব?',

  'health.q.middle3': 'বাড়িতে অনেক চাপ, সন্তানদের কীভাবে সামলাব?',

  'health.q.middle4': 'কাজে বছরের পর বছর পেটে গ্যাসের সমস্যা, কী করব?',

  'health.q.later1': 'আমার বয়স 54 বছর এবং পিঠে ব্যথা, কী করব?',

  'health.q.later2': 'হাঁটতে গেলে হাঁটুতে ব্যথা হয়, কেন?',

  'health.q.later3': 'রাতে পায়ে টান পড়ে, কী করব?',

  'health.q.later4': 'সকালে উঠে কোমর শক্ত হয়ে যায়, কারণ কী হতে পারে?',

  'health.q.senior1': 'হাঁটুতে এত ব্যথা যে হাঁটা কঠিন, কী করব?',

  'health.q.senior2': 'অনেক ঔষধ প্রতিদিন খেতে হয় — কোনটি ক্ষতিকর কীভাবে বুঝব?',

  'health.q.senior3': 'রাতে বারবার প্রস্রাবের সমস্যা, কী করব?',

  'health.q.senior4': 'কম শুনি, শোনার কোনো উপায় আছে কি?',

  'health.q.elder1': 'বাড়িতে পড়ে যাওয়ার ভয়, কোন সুরক্ষা রাখব?',

  'health.q.elder2': 'স্মৃতি দুর্বল হচ্ছে, কী উপায় আছে?',

  'health.q.elder3': 'প্রতিদিন ব্যথার ঔষধ খেতে হয় — এর কোনো ক্ষতি আছে কি?',

  'health.q.elder4': 'কখন ডাক্তারের কাছে যাওয়া জরুরি?',

  'support.contactMessageLabel': 'আপনার কথা',

  'support.contactPlaceholder': 'যা লিখতে চান তাই লিখুন — ভুল হলে, কিছু ভালো পেলে, বা কোনো প্রশ্ন থাকলে।',

  'support.contactHelp': 'অন্তত ১০ অক্ষর। এটি সরাসরি মালিকের কাছে পৌঁছায়।',

  'support.contactSubmit': 'পাঠান',

  'support.contactSending': 'পাঠানো হচ্ছে…',

  'support.contactPrivacy': 'আপনার নাম লেখা আবশ্যক নয়।',

  'support.contactSent': 'পৌঁছে গেছে',

  'support.contactSentBody': 'আপনার কথা মালিকের কাছে পৌঁছে গেছে।',

  'support.contactFailed': 'পাঠানো যায়নি',

  'support.faq1Q': 'এটি কি সত্যিই বিনামূল্যে?',

  'support.faq1A': 'হ্যাঁ। কোনো টাকা নেওয়া হয় না, কোনো বিজ্ঞাপন দেখানো হয় না, কোনো সদস্যতা নেওয়া হয় না। এটি একজনের টাকায় চলে, কোনো কোম্পানি বা সরকারের টাকায় নয়।',

  'support.faq2Q': 'আমার নাম, ঠিকানা বা ফোন নম্বর নেওয়া হয়?',

  'support.faq2A': 'না, এবং নেওয়া হবে না। এই সাইট নিজে কোনো পরিচয় তৈরি করে না — কোনো লগইন নেই, কোনো ট্র্যাকিং স্ক্রিপ্ট নেই। যা জিজ্ঞাসা করা হয় তা শুধু আপনার প্রশ্ন এবং ততটুকুই সংরক্ষিত হয়।',

  'support.faq3Q': 'এটি কি ডাক্তার বা আইনজীবী?',

  'support.faq3A': 'না। এটি ওষুধের বা আইনি পরামর্শ দেয় না। যেখানে বিষয়টি গুরুতর সেখানে এটি বলে ডাক্তার বা কর্তৃপক্ষের কাছে যেতে — তাঁদের জায়গা এটি নেয় না।',

  'support.faq4Q': 'প্রতিটি উত্তর কি সঠিক হয়?',

  'support.faq4A': 'সবসময় না। উত্তর লেখে একটি কম্পিউটার, কোনো ডাক্তার নয় — তাই প্রতিটি উত্তরের সাথে লেখা আছে যে এটি চিকিৎসা পরামর্শ নয়। কোনো ঔষধ শুরু বা বন্ধ করার আগে অবশ্যই ডাক্তারের সাথে দেখা করুন।',

  'support.faq5Q': 'আমাকে কি কোনো অ্যাপ ডাউনলোড করতে হবে?',

  'support.faq5A': 'না। এটি শুধু ব্রাউজারে খোলে। কোনো অ্যাপ ইনস্টল নয়, কোনো অনুমতি নয়, কোনো আপডেট নয়।',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'ঘরোয়া প্রতিকার',
  'remedy.title': 'আয়ুর্বেদিক ঘরোয়া প্রতিকার',
  'remedy.intro': 'যে-ই সমস্যা হোক — কাশি, মাথাব্যথা, বাতের ব্যথা, চুলকানি, ডায়াবেটিস, পিঠে ব্যথা — নিচে আপনার সমস্যা বেছে নিন বা নিজের ভাষায় জিজ্ঞাসা করুন। ঘরোয়া কাড়া, মালিশ, খাদ্য ও আয়ুর্বেদিক ব্যবস্থা বলা হবে।',
  'remedy.choose': 'আপনার সমস্যা বেছে নিন',
  'remedy.emergencyStrong': 'এগুলি জরুরি অবস্থা:',
  'remedy.emergency': 'সাপে কাটা, বিছের কামড় ও কুকুরে কামড় — সঙ্গে সঙ্গে হাসপাতালে যান, আগে 112-এ ফোন করুন। ঘরোয়া ব্যবস্থা শুধু পথের জন্য, হাসপাতালের বদলে নয়।',
  'remedy.note': 'ঘরোয়া ও আয়ুর্বেদিক ব্যবস্থা সমস্যা কমাতে সাহায্য করে; ডাক্তারের পরীক্ষা ও চিকিৎসার বিকল্প নয়। নিজে থেকে কোনো ঔষধ শুরু বা বন্ধ করবেন না।',
  'remedy.cough': 'কাশি',
  'remedy.headache': 'মাথাব্যথা',
  'remedy.joints': 'বাতের ব্যথা',
  'remedy.itching': 'চুলকানি',
  'remedy.snake': 'সাপে কাটা',
  'remedy.scorpion': 'বিছের কামড়',
  'remedy.dog': 'কুকুরে কামড়',
  'remedy.diabetes': 'ডায়াবেটিস',
  'remedy.back': 'পিঠে ব্যথা',
  'remedy.walking': 'হাঁটতে অসুবিধা',
  'home.remedyNote': 'কাড়া, মালিশ, খাদ্য ও আয়ুর্বেদিক ব্যবস্থা — প্রতিটি সমস্যার জন্য, আপনার ভাষায়।',
  'nav.aarti': 'আরতি ও ভজন',
  'aarti.title': 'আরতি ও ভজন — সত্যিকারের কণ্ঠে',
  'aarti.intro': 'এখানে আরতি, কীর্তন ও ভজন শুনুন — সত্যিকারের গায়ক ও মন্দিরের কণ্ঠে। কোনো AI কণ্ঠ নেই।',
  'aarti.note': 'আরতি বা ভজন কম্পিউটারের কণ্ঠে বাজানো মানে তার চাল ও ভক্তি হারিয়ে যাওয়া। তাই এখানে সবই সত্যিকারের রেকর্ডিং।',
  'aarti.kindAarti': 'আরতি',
  'aarti.kindKirtan': 'কীর্তন',
  'aarti.kindBhajan': 'ভজন',
  'aarti.credit': 'রেকর্ডিং:',
  'aarti.licence': 'লাইসেন্স:',
  'aarti.listenLink': 'সত্যিকারের কণ্ঠে শুনুন',
  'aarti.textChecked': 'এটি প্রচলিত পাঠ, যেমনটি আসল রেকর্ডিংয়ে গাওয়া হয়েছে।',
  'aarti.textPrinted': 'এটি প্রচলিত পাঠ, প্রকাশিত সংগ্রহের সঙ্গে মিলিয়ে যাচাই করা হয়েছে।',
  'aarti.textNotStored': 'এই গ্রন্থের পুরো পাঠ এখানে সংরক্ষিত নেই — নিচের রেকর্ডিংয়ে পুরো পাঠ শোনা যায়।',
  'aarti.granthTitle': 'গ্রন্থ, চালিশা ও স্তোত্র — সত্যিকারের কণ্ঠে',
  'aarti.noRecording': 'এই আরতির আসল রেকর্ডিং এখনও সাইটে নেই, তাই আমি এটি গেয়ে শোনাতে পারি না — এআই কণ্ঠে আরতি কখনও গাওয়া হয় না।',
  'aarti.textOnlyTitle': 'আরও আরতি — পাঠ ও সত্যিকারের কণ্ঠ',
  'aarti.fullText': 'পুরো পাঠ',
  'aarti.notChecked': 'এই আরতির যাচাই করা পাঠ এখনও সাইটে নেই। না-যাচাই করা পাঠ দেওয়া হয় না, কারণ প্রার্থনায় ভুল শব্দ না-শব্দের চেয়েও খারাপ।',
  'aarti.verifiedList': 'সাইটে এই আরতিগুলির যাচাই করা পাঠ আছে:',

};

const TAMIL: Record<string, string> = {
  'jgd.placeSearch': 'உங்கள் ஊரின் பெயரைத் தட்டச்சு செய்யுங்கள்',
  'jgd.placeNoMatch': 'இந்த ஊர் பட்டியலில் இல்லை. அருகில் உள்ள ஊரைத் தேர்வு செய்யுங்கள்.',

  'account.name': 'உங்கள் பெயர்',
  'account.namePlaceholder': 'எ.கா. சீதா தேவி',
  'account.nameHint': 'நீங்கள் யார் என்பதை அறிய. எந்தப் பெயரும் போதும், இது தேவையில்லை.',

  'nav.home': 'முகப்பு', 'home.metaTitle': 'இலவச தீர்வு, உங்கள் சொற்களில்', 'nav.tribute': 'நினைவு', 'nav.help': 'உதவி', 'nav.reference': 'அறிமுகம்',
  'lib.licence.ccZero.name': 'CC0 / பப்ளிக் டொமைன்',
  'lib.licence.pd.name': 'பப்ளிக் டொமைன்',
  'lib.licence.govtIndia.name': 'இந்திய அரசு',
  'lib.licence.creativeCommons.name': 'கிரியேட்டிவ் காமன்ஸ் (கலவை)',
  'lib.licence.freeToRead.name': 'படிக்க இலவசம்',
  'lib.entry.ncert.title': 'NCERT புத்தகங்கள் — வகுப்பு 1 முதல் 12 வரை',
  'lib.entry.ncert.what': 'ஒவ்வொரு பாடத்தின் அனைத்து புத்தகங்களும், ஒவ்வொரு வகுப்புக்கும். லாகின் இல்லாமல், நேரடி PDF.',
  'lib.entry.ncert.langs': 'இந்தி, ஆங்கிலம் மற்றும் 30-க்கும் மேற்பட்ட இந்திய மொழிகள்',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — டிஜிட்டல் பாடநூல்கள்',
  'lib.entry.pm-evidya.what': 'NCERT புத்தகங்களுக்கான செயலி, பெரிய எழுத்தில் படிக்கலாம். குரலில் கேட்கவும் முடியும்.',
  'lib.entry.pm-evidya.langs': 'இந்திய மொழிகள்',
  'lib.entry.diksha.title': 'DIKSHA — ஆசிரியர்களுக்கும் குழந்தைகளுக்கும்',
  'lib.entry.diksha.what': 'பாடங்கள், காணொளிகள், பயிற்சிகள் — வகுப்பு 1 முதல் 12 வரை.',
  'lib.entry.diksha.langs': 'இந்திய மொழிகள்',
  'lib.entry.khan-academy.title': 'Khan Academy — ஆங்கிலத்தில் கணிதமும் அறிவியலும்',
  'lib.entry.khan-academy.what': 'ஒவ்வொரு வகுப்புக்கும் காணொளிப் பாடங்கள், எழுத்துவடிவமும் உண்டு.',
  'lib.entry.openstax.title': 'OpenStax — ஆங்கிலத்தில் இலவச புத்தகங்கள்',
  'lib.entry.openstax.what': 'கல்லூரி நிலைப் புத்தகங்கள் — கணிதம், அறிவியல், கலை. ஒவ்வொரு பக்கத்திலும் PDF.',
  'lib.entry.nios.title': 'NIOS — தொலைக் கல்வி, இலவசப் பொருள்கள்',
  'lib.entry.nios.what': 'திறந்த மற்றும் ஆன்லைன் பாடங்களுக்கான இலவச நூல்கள், சேர்க்கை இல்லாமல்.',
  'lib.entry.nios.langs': 'இந்தி, ஆங்கிலம் மற்றும் பிற',
  'lib.entry.ignou.title': 'IGNOU — மேல்நிலைப் படிப்புக்கான இலவசப் புத்தகங்கள்',
  'lib.entry.ignou.what': 'தொலைக் கல்விப் புத்தகங்கள், முற்றிலும் இலவசம்.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ஆங்கிலப் பழைய புத்தகங்கள்',
  'lib.entry.gutenberg.what': '70,000-க்கும் மேற்பட்ட புத்தகங்கள், அனைத்தின் பதிப்புரிமையும் முடிந்தது. இலவச மின்னூல்கள், ஒலிப்பதிவுகள்.',
  'lib.entry.pratham-books.title': 'Pratham Books — குழந்தைகள் புத்தகங்கள்',
  'lib.entry.pratham-books.what': 'இந்திய மொழிகளில் குழந்தைகள் புத்தகங்கள், முற்றிலும் இலவசம். வகுப்பு 1 முதல் 5 வரை.',
  'lib.entry.pratham-books.langs': 'இந்தி, மராத்தி, வங்காளம், தமிழ், தெலுங்கு மேலும் பல',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — செய்தித்தாள்களும் பழைய இதழ்களும்',
  'lib.entry.internet-archive-texts.what': 'லட்சக்கணக்கான பழைய புத்தகங்கள், இதழ்கள், செய்தித்தாள்கள் — இலவசம்.',
  'lib.entry.wikisource.title': 'Wikisource — இலவசப் பொது நூல்கள்',
  'lib.entry.wikisource.what': 'பதிப்புரிமை இல்லை — இவை உலகின் பழைய இலக்கியப் புத்தகங்கள்.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — எல்லா வகையான படங்கள்',
  'lib.entry.wikimedia-commons.what': 'விலங்குகள், வரைபடங்கள், நட்சத்திரங்கள், வரலாறு — எல்லாம். ஒவ்வொரு படத்திற்கும் தனி உரிமம் உண்டு.',
  'lib.entry.pixabay.title': 'Pixabay — புகைப்படங்களும் ஓவியங்களும்',
  'lib.entry.pixabay.what': 'புகைப்படங்கள், வரைபடங்கள், குறும்படங்கள்.',
  'lib.entry.unsplash.title': 'Unsplash — அழகான புகைப்படங்கள்',
  'lib.entry.unsplash.what': 'இலவசம், பெரிய அளவில், கணக்கு தேவையில்லை.',
  'lib.entry.openverse.title': 'Openverse — எல்லா இலவசப் படங்களும் ஒரே இடத்தில்',
  'lib.entry.openverse.what': 'பல இலவசப் படத் தளங்களை ஒரே நேரத்தில் தேடுங்கள்.',
  'lib.entry.librivox.title': 'LibriVox — கேட்கும் புத்தகங்கள்',
  'lib.entry.librivox.what': 'பழைய ஆங்கிலப் புத்தகங்களின் இலவச ஒலிப்பதிவு, மனிதக் குரலில்.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ஒலிச் சேகரிப்பு',
  'lib.entry.internet-archive-audio.what': 'ஆயிரக்கணக்கான இலவசப் பதிவுகள் — புத்தகங்கள், உரைகள், இசை.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — தேசியப் பாடலும் மற்றவையும்',
  'lib.entry.vande-mataram.what': 'இந்தியாவின் தேசியப் பாடல் மற்றும் பிற தேசியப் பாடல்கள், இலவசம்.',
  'art.aag-aur-bijli-ke-bachav.title': 'தீ மற்றும் மின்சாரத்திலிருந்து பாதுகாப்பு விதிகள்',
  'art.aag-aur-bijli-ke-bachav.summary': 'வீட்டில் தீ விபத்தைத் தடுப்பது — எளிய விதிகள்',
  'art.aag-lagne-par-kya-karein.title': 'தீ பிடித்தால் என்ன செய்ய வேண்டும்',
  'art.aag-lagne-par-kya-karein.summary': 'எரியும் வீட்டில் தீ — முதலில் என்ன செய்ய வேண்டும், என்ன செய்யக்கூடாது',
  'art.bimari-se-bachav.title': 'தொற்றிலிருந்து பாதுகாப்புக்கான ஏழு விதிகள்',
  'art.bimari-se-bachav.summary': 'கைகளைக் கழுவுதல், முகக்கவசம், தடுப்பூசி — எப்படிப் பாதுகாப்பாக இருப்பது',
  'art.dhuwan-ka-jhakora.title': 'புகை மூச்சுத்திணறலிலிருந்து பாதுகாப்பு',
  'art.dhuwan-ka-jhakora.summary': 'மூச்சுத் திணறல், சுவாசம் வரவில்லை — என்ன செய்ய வேண்டும், எப்போது மருத்துவமனை செல்ல வேண்டும்',
  'art.doodh-pani-band-ho.title': 'மின்சாரம் அல்லது தண்ணீர் திடீரென நின்றால்',
  'art.doodh-pani-band-ho.summary': 'என்ன செய்ய வேண்டும், எதைத் தவிர்க்க வேண்டும், எப்போது உதவி கேட்க வேண்டும்',
  'art.haath-ki-saafai.title': 'சோப்பு இல்லாமல் கைகளைச் சுத்தம் செய்யும் முறை',
  'art.haath-ki-saafai.summary': 'தண்ணீரோ சோப்போ இல்லாதபோது',
  'cat.dhyan-aur-yoog.title': 'தியானமும் யோகாவும்',
  'cat.dhyan-aur-yoog.subtitle': 'மனதை அமைதிப்படுத்த எளிய வழிகள்',
  'cat.gharelu-marammat.title': 'வீட்டு பழுதுபார்ப்பு',
  'cat.gharelu-marammat.subtitle': 'வீட்டின் சிறிய பிரச்சனைகளுக்குத் தீர்வு',
  'cat.bachchon-ki-padhai.title': 'குழந்தைகளின் படிப்பு',
  'cat.bachchon-ki-padhai.subtitle': 'படிப்பில் ஈடுபட்டு, கவலையில்',
  'cat.budharge-seva.title': 'முதியோர் பராமரிப்பு',
  'cat.budharge-seva.subtitle': 'பராமரிப்பும் உதவியும்',
  'cat.shishu-dekhbhal.title': 'குழந்தை பராமரிப்பு',
  'cat.shishu-dekhbhal.subtitle': 'சிறிய குழந்தையை சரியாகப் பார்த்துக்கொள்ள',
  'cat.dharmik-upay.title': 'ஆன்மிக தீர்வுகள்',
  'cat.dharmik-upay.subtitle': 'அமைதியான மனத்துடன்',
  'cat.pavan-grah-aur-aarti.title': 'புனித நூல்களும் ஆரத்தியும்',
  'cat.pavan-grah-aur-aarti.subtitle': 'பக்தியுடன் படியுங்கள், கேளுங்கள்',
  'cat.aapatkalen-gayide.title': 'அவசர வழிகாட்டி',
  'cat.aapatkalen-gayide.subtitle': 'உடனே உதவி தேவைப்படும்போது',
  'cat.mahamari-suraksha.title': 'தொற்றுநோய் பாதுகாப்பு',
  'cat.mahamari-suraksha.subtitle': 'நோய் பரவாமல் தடுப்பது',
  'nav.reviews': 'கருத்து', 'nav.support': 'உதவி செய்யுங்கள்', 'nav.menu': 'பட்டி',
  'nav.birthChart': 'ஜன்ம கட்டு',
  'jgd.title': 'உங்கள் ஜன்ம கட்டு',
  'jgd.intro': 'உங்கள் பெயர், பிறந்த நாள், தெரிந்தால் நேரம் மற்றும் இடம். அனைத்தும் உங்கள் தொலைபேசியிலேயே கணக்கிடப்படும் — எங்கும் அனுப்பப்படுவதில்லை.',
  'jgd.nameLabel': 'பிறந்த பெயர்',
  'jgd.namePlaceholder': 'எ.கா. முழுப் பெயர்',
  'jgd.nameHint': 'குழந்தையாக இருக்கும்போது கொடுக்கப்பட்ட பெயர்.',
  'jgd.dateLabel': 'பிறந்த தேதி',
  'jgd.timeLabel': 'பிறந்த நேரம்',
  'jgd.timeHint': 'தெரியாவிட்டால் காலியாக விடவும்.',
  'jgd.placeLabel': 'பிறப்பிடம்',
  'jgd.placeNone': 'தெரியாது / தேர்வு செய்',
  'jgd.placeHint': 'பிறந்த இடத்தைத் தேர்வு செய்.',
  'jgd.submit': 'கணக்கிடு',
  'jgd.savePdf': 'PDF உருவாக்கு',
  'jgd.again': 'மீண்டும் கணக்கிடு',
  'jgd.errDate': 'பிறந்த தேதியைச் சரியாக உள்ளிடவும்.',
  'jgd.errPlace': 'பட்டியலில் இருந்து உங்கள் ஊரைத் தேர்வு செய்யுங்கள், அல்லது அருகில் உள்ள ஊரைத் தேர்வு செய்யுங்கள்.',
  'jgd.numTitle': 'எண் ஜோதிடம்',
  'jgd.lifePath': 'உயிர் வழி',
  'jgd.nameNumber': 'பெயர் எண்',
  'jgd.soulNumber': 'ஆன்மா எண்',
  'jgd.birthdayNumber': 'பிறந்தநாள் எண்',
  'jgd.astroTitle': 'வேதிக ஜோதிடம்',
  'jgd.nakshatra': 'நட்சத்திரம்',
  'jgd.pada': 'பாதம்',
  'jgd.rashi': 'ராசி',
  'jgd.rashiLord': 'ராசி ராஜன்',
  'jgd.nakshatraLord': 'நட்சத்திர ராஜன்',
  'jgd.lagna': 'லக்னம்',
  'jgd.lagnaMissing': 'லக்னத்திற்கு பிறந்த நேரமும் இடமும் தேவை. மேலே நிரப்பி மீண்டும் கணக்கிடுங்கள் — தெரியாவிட்டால் இதுவும் போதும்.',
  'jgd.gunTitle': 'குண மிலன்',
  'jgd.gunIntro': 'மற்றவரின் பெயர், பிறந்த தேதி கொடுங்கள்.',
  'jgd.gunName': 'அவரது பெயர்',
  'jgd.gunDate': 'அவரது பிறந்த தேதி',
  'jgd.gunHint': 'இரு பெயரும் தேதிகளும் இருந்தால் குண மிலன் கிடைக்கும்.',
  'jgd.disclaimer': 'இது பாரம்பரிய முறையில் கணக்கிடப்பட்டது, எதிர்பார்ப்பு அல்ல. எந்த எண்ணும் ராசியும் யாரையும் நல்ல ஆரோக்கியம், பணம் அல்லது உறவு நிர்ணயிக்காது. பெரிய முடிவுகளுக்கு மருத்துவர், வழக்கறிஞர் அல்லது அனுபவமுள்ளவரின் அறிவுரை பெறுங்கள்.',
  'nav.openMenu': 'பட்டி திற', 'nav.closeMenu': 'பட்டி மூடு', 'nav.language': 'மொழி மாற்று',
  'nav.expand': 'பட்டி விரிவு', 'nav.collapse': 'பட்டி சுருக்கு', 'nav.skip': 'நேரடியாக உள்ளடக்கத்திற்குச் செல்',
  'ask.label': 'உங்கள் பிரச்சினையை எழுதுங்கள் அல்லது பேசுங்கள்', 'ask.placeholder': 'எடுத்துக்காட்டு: குழந்தையின் படிப்பு குறைவு',
  'ask.help': 'என்டர் அழுத்தினாலும் அனுப்பலாம்.', 'ask.send': 'கேளுங்கள்', 'ask.sending': 'சிந்திக்கிறது…',
  'ask.clear': 'எழுதியதை அழியுங்கள்', 'ask.speak': 'பேசி கேளுங்கள்', 'ask.listening': 'பேசத் தொடங்குங்கள்…',
  'ask.heard': 'கேட்டுக்கொண்டிருக்கிறது', 'ask.stopListening': 'கேட்பதை நிறுத்து', 'ask.suggested': 'வழக்கமான கேள்விகள்',
  'ask.answerTitle': 'தீர்வு', 'ask.listen': 'கேட்க', 'ask.stopSpeak': 'நிறுத்து',
  'ask.aiNote': 'இது AI வழங்கிய பதில். நிபுணர் ஆலோசனைக்கு மாற்று அல்ல.',
  'sound.title': 'அமைதிக்கான ஒலி', 'sound.intro': 'கட்டணம் இல்லை, விளம்பரம் இல்லை.',
  'sound.shankh': 'சங்கு', 'sound.bansuri': 'புனாறு', 'sound.dhol': 'தபலாக்', 'sound.all': 'மூன்று',
  'dhun.welcome': 'வரவேற்பு', 'dhun.prompt': 'சங்கு, புல்லாங்குழல், தபலா மூன்றும் கேட்கத் தொடு.',
  'dhun.listen': 'கேட்க', 'dhun.skip': 'விட்டுவிடு',
  'home.emergencyTitle': 'அவசரம் — உடனே உதவி தேவை', 'home.emergencyNote': 'இவற்றை முதலில் படியுங்கள்.',
  'home.readMore': 'முழு விவரம் படி', 'home.chooseTopic': 'எதைப் பற்றி அறிய வேண்டும்?',
  'home.askHere': 'இந்தத் தலைப்பில் கேள்', 'home.howTitle': 'இந்த சேவை எப்படி வேலை செய்கிறது',
  'home.soundTitle': 'அமைதிக்கான ஒலி', 'home.freeTitle': 'இந்த சேவை முற்றிலும் இலவசம்',
  'home.freeBody': 'பணம் பெறப்படுவதில்லை, தனிப்பட்ட விவரம் கேட்கப்படுவதில்லை, விளம்பரம் இல்லை.',
  'footer.pages': 'பக்கங்கள்', 'footer.helplines': 'முக்கிய எண்கள்', 'footer.readStory': 'அவளுடைய முழுக் கதை படி',
  'reviews.title': 'உங்கள் கருத்து, உங்கள் வார்த்தை', 'reviews.submit': 'அனுப்பு', 'reviews.comment': 'உங்கள் வார்த்தை',
  'language.choose': 'உங்கள் மொழியைத் தேர்வு செய்', 'language.articlesIn': 'இந்தக் கட்டுரை ஹிந்தியில் உள்ளது.',

  'ask.welcome': 'வரவேற்கிறோம்! கீழே உங்கள் பிரச்சினையை எழுதுங்கள் அல்லது ஒரு விஷயத்தைத் தேர்ந்தெடுங்கள்.',

  'ref.notTitle': 'இது என்ன செய்வதில்லை',

  'ref.not1': 'இது மருத்துவர் அல்ல. மருந்து ஆலோசனை ஒருபோதும் வழங்கப்படுவதில்லை.',

  'ref.not2': 'இது வழக்குநர் அல்ல. சட்ட ஆலோசனை வழங்கப்படுவதில்லை.',

  'ref.not3': 'எந்த பணமும் எடுக்கப்படுவதில்லை, விளம்பரமும் காட்டப்படுவதில்லை.',

  'ref.not4': 'உங்கள் பெயர், முகவரி அல்லது தொலைபேசி எண் கேட்கப்படுவதில்லை, சேமிக்கப்படுவதில்லை.',

  'ref.not5': 'அரசுத் திட்டத்தின் விலை அல்லது எண் உருவாக்கப்படுவதில்லை — தெரியாவிட்டால் தெளிவாகவே தெரியாவில்லை என்று சொல்லப்படும்.',

  'ref.medicalTitle': 'முக்கியம்: இது மருத்துவர் ஆலோசனை அல்ல',

  'ref.medicalBody': 'நோய், மருந்து அல்லது நச்சுப் பொருள் பற்றிய விஷயம் என்றால் முதலில் மருத்துவரைச் சந்தியுங்கள். இங்கு வழங்கப்படும் தகவல் பொதுவான உதவிக்காக மட்டும். குழந்தையின் தடுப்பூசி, கர்ப்பம், அல்லது எந்த மருந்தையும் தொடங்குவதற்கு முன் மருத்துவரின் ஆலோசனை கட்டாயம் பெறுங்கள்.',

  'ref.statsTitle': 'எவ்வளவு தகவல் உள்ளது',

  'support.howTitle': 'நீங்கள் எங்களுக்கு எப்படி உதவலாம்',

  'support.alwaysFreeTitle': 'இந்தச் சேவை எப்போதும் இலவசமாக இருக்கும்',

  'support.alwaysFreeBody': 'கிடைக்கும் உதவி இந்தச் சேவையை நடத்தப் பயன்படும். யாரிடமிருந்தும் ஒருபோதும் பணம் பெறப்படாது.',

  'smriti.eyebrow': 'நினைவில்',

  'smriti.whyTitle': 'இந்த தளம் ஏன் உள்ளது',

  'smriti.ending': 'அவரது போராட்டம் இங்கே தொடர்கிறது.',

  'article.askAny': 'ஒரு கேள்வி கேளுங்கள்',

  'article.remember': 'நினைவில் கொள்ளுங்கள்',

  'article.emergencyInfo': 'முக்கிய தகவல்',

  'article.medicalTitle': 'இது மருத்துவ ஆலோசனை அல்ல',

  'article.medicalBody': 'இந்தத் தகவல் பொதுவான உதவிக்கு மட்டும். டாக்டரிடம் கேட்காமல் எந்த மருந்தையும் தொடங்காதீர்கள் அல்லது நிறுத்தாதீர்கள்.',

  'article.heading': '{category} பற்றிய கட்டுரைகள்',

  'reviews.rateQuestion': 'எத்தனை நட்சத்திரம் தர்ப்பீர்கள்?',

  'reviews.starsShort': '{value} நட்சத்திரம்',

  'reviews.averageOutOf': '5 இல் {value} நட்சத்திரம்',

  'dhun.welcomeTitle': 'வரவேற்கிறோம்',

  'dhun.consent': 'சங்கு, புல்லாங்குழல், தபலா இணைந்து. கேட்கத் தட்டவும்.',

  'dhun.failed': 'ஒலி இயக்க முடியவில்லை.',

  'dhun.unsupported': 'இந்த உலாவியம் ஒலியை இயக்க முடியவில்லை.',

  'dhun.failedTry': 'ஒலியை இயக்குவதில் சிக்கல் ஏற்பட்டது.',

  'sound.hintIdle': 'எந்த பொத்தானை அழுத்தினாலும் ஒலியைக் கேட்கலாம்.',

  'sound.hintPlaying': 'ஒலி இயங்குகிறது. நிறுத்த அந்தப் பொத்தானை மீண்டும் அழுத்தவும்.',

  'sound.preparing': 'ஒலி தயாராகிறது',

  'nav.path': 'பாதை',

  'toast.dismiss': 'மூடு',

  'footer.free': 'இந்த சேவை முற்றிலும் இலவசம். யாரிடமிருந்தும் பணம் பெறப்படுவதில்லை.',

  'cat.empty': 'இந்தத் தலைப்பில் இன்னும் கட்டுரைகள் இல்லை.',
  'cat.notFound': 'இந்தப் பக்கம் கிடைக்கவில்லை',

  'dhun.label': 'ஒலி இயக்க அனுமதி',

  'language.articlesInHint': 'ஒவ்வொரு மொழிக்கும் தனி மொழிபெயர்ப்பு தேவை. இந்த மொழிபெயர்ப்பு இன்னும் செய்யப்படவில்லை — எழுதியுள்ளது தமிழில் மட்டுமே சரியானதும் முழுமையானதும் ஆகும்.',

  'theme.toDark': 'இருள் வடிவத்திற்குச் செல்லவும்',

  'theme.toLight': 'வெளிர் வடிவத்திற்குச் செல்லவும்',

  'ask.emptyAnswer': 'இந்த முறை பதில் உருவாகவில்லை. வேறு சொல்லி மீண்டும் கேளுங்கள்.',

  'ask.errorNetwork': 'இண்டர்னெட் இயங்கவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',

  'ask.errorRateLimit': 'ஒரே நேரத்தில் பல கேள்விகள் அனுப்பப்பட்டுள்ளன. சிறிது நேரம் கழித்து முயற்சிக்கவும்.',

  'ask.heardWith': 'இப்போது கேட்கிறோம்',

  'ask.micUnsupported': 'இந்த உலாவியில் பேசி கேட்பது வேலை செய்யாது. எழுதி கேளுங்கள்.',

  'ask.notAnswer': 'இந்தக் கேள்விக்கு நேரடி பதில் எங்களிடம் இல்லை.',


  'article.askAbout': 'இந்தத் தலைப்பில் கேளுங்கள்',

  'article.count': '{count} கட்டுரைகள்',

  'article.emergency': 'அவசரம்',

  'article.others': 'இந்தத் தலைப்பின் மேலும் கட்டுரைகள்',

  'article.readAloud': 'இந்தக் கட்டுரையைக் கேட்கவும்',

  'footer.admin': 'நிர்வாகம்',

  'footer.ambulance': 'ஆம்புலன்ஸ்',

  'footer.emergency': 'அவசரம்',

  'footer.rights': 'இலவச சேவை',

  'footer.women': 'பெண்கள் உதவி எண்',

  'sound.allHint': 'ஒன்றாக',

  'sound.bansuriHint': 'மென்மையான, மெதுவான',

  'sound.dholHint': 'கூர்மையான, வேகமான',

  'sound.errGeneric': 'ஒலியை இயக்குவதில் சிக்கல் ஏற்பட்டது.',

  'sound.errUnsupported': 'இந்த உலாவியம் ஒலியை இயக்க முடியவில்லை.',

  'sound.listenLabel': 'கேட்கவும்',

  'sound.playing': 'ஒலி இயங்குகிறது. நிறுத்த அந்தப் பொத்தானை மீண்டும் அழுத்தவும்.',

  'sound.shankhHint': 'ஆழமான, நீண்ட',

  'voice.aborted': 'நிறுத்தப்பட்டது. மீண்டும் முயற்சிக்கவும்.',

  'voice.audioCapture': 'மைக்ரோஃபோன் கிடைக்கவில்லை. சாதனத்தை இணைக்கவும், அல்லது எழுதி கேளுங்கள்.',

  'voice.generic': 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',

  'voice.network': 'பேசி கேட்பதற்கு இண்டர்னெட் தேவை, அது இல்லை. எழுதி கேளுங்கள் — அதே பதிலே கிடைக்கும்.',

  'voice.noSpeech': 'எந்த குரலும் கேட்க முடியவில்லை. மைக்கருகில் பேசுங்கள், அல்லது எழுதுங்கள்.',

  'voice.notAllowed': 'மைக்ரோஃபோன் அனுமதி கிடைக்கவில்லை. மேலே சென்று அனுமதி அளியுங்கள், அல்லது எழுதி கேளுங்கள்.',

  'voice.serviceNotAllowed': 'மைக்ரோஃபோன் அனுமதி கிடைக்கவில்லை. மேலே சென்று அனுமதி அளியுங்கள், அல்லது எழுதி கேளுங்கள்.',

  'voice.speakFailed': 'இந்தப் பதிலைப் படித்து கேட்க முடியவில்லை.',
  'voice.noVoice': 'இந்தச் சாதனத்தில் {name} குரல் இல்லை. இப்போது எழுதியதைப் படியுங்கள், அல்லது அமைப்புகளில் குரலைச் சேர்க்கவும்.',

  'voice.unsupported': 'இந்த உலாவியில் பேசி கேட்பது வேலை செய்யாது. எழுதி கேளுங்கள்.',

  'ask.notConfigured': 'இந்தச் சேவை இப்போது சேமித்த பதிவுகளிலிருந்து பதிலளிக்கிறது. உங்கள் கேள்வி அதில் இல்லை.',

  'ask.browseTitle': 'இங்கு உள்ள கட்டுரைகளைப் பாருங்கள்',

  'health.heading': 'உங்கள் வயதைச் சொல்லுங்கள்',

  'health.intro': 'வயதின் அடிப்படையில் அடிக்கடி கேட்கப்படும் கேள்விகள் இங்கே தெரியும். ஏதேனும் ஒரு பொத்தானை அழுத்தவும் — கேள்வி கீழே நிரப்பப்படும், பின்னர் கேளுங்கள்.',

  'health.ageLabel': 'வயது (ஆண்டுகள்)',

  'health.years': 'ஆண்டுகள்',

  'health.bandsLabel': 'வயதின் அடிப்படையில் தேர்வு செய்யுங்கள்',

  'health.notAdviceStrong': 'இது மருத்துவ ஆலோசனை அல்ல.',

  'health.notAdvice': 'எந்த மருந்தையும் தொடங்கவோ நிறுத்தவோ வேண்டாம் — முதலில் மருத்துவரைச் சந்தியுங்கள்.',

  'health.emergencyStrong': 'அவசரத்தில் அழைக்கவும்:',

  'health.emergencyCall': '(அவசரம்)',

  'health.emergencyAmbulance': '(ஆம்புலன்ஸ்)',

  'health.emergencyWomen': '(பெண் உதவி)',

  'health.privacy': 'பெயர் அல்லது முகவரி எழுத வேண்டியதில்லை.',

  'health.band.infant.label': '0 – 2 வயது',

  'health.band.child.label': '3 – 12 வயது',

  'health.band.teen.label': '13 – 17 வயது',

  'health.band.young.label': '18 – 30 வயது',

  'health.band.middle.label': '31 – 45 வயது',

  'health.band.later.label': '46 – 60 வயது',

  'health.band.senior.label': '61 – 75 வயது',

  'health.band.elder.label': '76 – 100 வயது',

  /* ---- save / download ---- */

  'download.pdf': 'PDF ஆகச் சேமி',
  'download.text': 'உரையாகச் சேமி',
  'download.printNow': 'அச்சிடுக',
  'download.preparing': 'தயாராகிறது',
  'download.blocked': 'புதிய தாவலைத் திறக்க முடியவில்லை. உலாவி பாப்-அப் தடுக்கிறது — அனுமதிக்கவும்.',

  /* ---- attach a document ---- */

  'attach.button': 'உங்கள் ஆவணம் அல்லது படத்தை இணைக்கவும்',
  'attach.formats': 'PDF, படம் (JPG/PNG) அல்லது உரைக் கோப்பு — 12 MB வரை',
  'attach.reading': 'படிக்கிறது…',
  'attach.attached': 'இணைக்கப்பட்டது',
  'attach.remove': 'அகற்று',
  'attach.tooBigPdf': 'இந்த PDF 12 MB-ஐ விட பெரியது. சிறிய கோப்பைத் தேர்ந்தெடுக்கவும்.',
  'attach.tooBigImage': 'இந்த படம் 3 MB-ஐ விட பெரியது. சிறிய படத்தைத் தேர்ந்தெடுக்கவும்.',
  'attach.scannedPdf': 'இந்த PDF ஒரு ஸ்கேன் — அதில் படமே உள்ளது, படிக்க முடியாது. அதற்கு பதிலாக அதன் படத்தை அனுப்புங்கள்.',
  'attach.pdfFailed': 'இந்த PDF-ஐப் படிக்க முடியவில்லை.',
  'attach.imageFailed': 'இந்த படம் ஏற்கப்படவில்லை.',
  'attach.wrongType': 'இந்த வகைக் கோப்பு பயன்படாது. PDF, படம் அல்லது உரைக் கோப்பு அனுப்புங்கள்.',
  'attach.hint': 'உங்கள் பத்தை இங்கே இணைத்து கேள்வியைக் கேளுங்கள் — பதில் அந்தப் பத்தைப் பற்றியதாக இருக்கும்.',
  'ask.sendWithFile': 'இதற்கு பதில்',

  /* ---- free library ---- */

  'lib.title': 'இலவச நூலகம்',
  'lib.intro': 'பாடநூல்கள், நூல்கள், படங்கள், ஒலி — அனைத்தும் இலவசமும் சட்டப்படியும்.',
  'lib.legalTitle': 'பதிப்புரிமை பிரச்சினை இல்லை.',
  'lib.legal': 'இங்கு கொடுக்கப்பட்ட அனைத்தும் முற்றிலும் இலவசம், அதை நீங்கள் பிறருக்கும் கொடுக்கலாம். இன்னும் பதிப்புரிமையில் உள்ள புத்தகம் இங்கு இல்லை — அதை நகலெடுப்பது அனுமதிக்கப்படாது, அதை நேரடியாகச் சொல்வதே சிறந்தது.',
  'ask.signInTitle': 'முதலில் உள்ளே செல்லுங்கள்',
  'ask.signInBody': 'கேள்வி கேட்க ஒரு கணக்கு உருவாக்குங்கள். ஒரு நிமிடத்திற்கும் குறைவுதான், பிறகு கேள்வி கேட்டுக் கொள்ளலாம்.',
  'ask.signInCta': 'கணக்கு உருவாக்கு அல்லது உள்ளே செல்',
  'ask.signInFirst': 'முதலில் உள்ளே செல்லுங்கள், பிறகு கேள்வி கேளுங்கள்.',
  'ask.signInOr': 'இப்போது கணக்கு உருவாக்க முடியவில்லையா? இவை கணக்கு இல்லாமலும் வேலை செய்கின்றன:',
  'account.title': 'என் கணக்கு',
  'account.intro': 'உங்கள் பெயரும் கடவுச்சொல்லும் உட்புகவும்.',
  'account.signIn': 'உள்ளே செல்',
  'account.register': 'கணக்கு உருவாக்கு',
  'account.signInNote': 'முந்தைய பெயரையும் கடவுச்சொல்லையும் பயன்படுத்தவும்.',
  'account.registerNote': 'கேள்வி கேட்க கணக்கு தேவையில்லை. இது உங்கள் மொழியையும் பதில்களையும் நினைவில் வைத்திருக்க மட்டும்.',
  'account.handle': 'உங்கள் பெயர்',
  'account.handlePlaceholder': 'எ.கா: sita.ji',
  'account.password': 'கடவுச்சொல்',
  'account.passwordHint': 'குறைந்தது ஆறு எழுத்துகள்.',
  'account.phone': 'தொலைபேசி எண்',
  'account.optional': 'தேவையில்லை',
  'account.phoneHint': 'விரும்பினால் கொடுங்கள். இல்லாமலும் கணக்கு தயாராகும்.',
  'account.create': 'கணக்கை உருவாக்கு',
  'account.logout': 'வெளியேறு',
  'account.open': 'கணக்கைத் திற',
  'account.signedInAs': 'நீங்கள் உள்ளே உள்ளீர்கள்',
  'account.signedOut': 'உள்ளே இல்லை',
  'account.signedOutBody': 'இந்த உலவரில் எந்த கணக்கும் திறக்கப்படவில்லை.',
  'account.saved': 'சேமித்த பதில்கள்',
  'account.savedEmpty': 'இன்னும் எதுவும் சேமிக்கப்படவில்லை. பதிலில் \'சேமி\' அழுத்துங்கள்.',
  'account.savedUnavailable': 'சேமித்த பதில்கள் இப்போது காட்ட முடியவில்லை. மற்ற அனைத்தும் இயங்குகின்றன.',
  'account.wait': 'காத்திருங்கள்…',
  'account.privacyTitle': 'உங்கள் தரவு',
  'account.privacyBody': 'கணக்கில் உங்கள் பெயர், கடவுச்சொல், மொழி மட்டுமே உள்ளது. நீங்கள் கேட்டதை பதிவு செய்வதில்லை. உங்கள் கேள்வி யாருக்கும் அனுப்பப்படாது.',
  'account.errWrong': 'பெயர் அல்லது கடவுச்சொல் தவறு.',
  'account.errTaken': 'அந்தப் பெயர் எடுக்கப்பட்டது. வேறு பெயர் தேர்ந்தெடுக்கவும்.',
  'account.errBad': 'படிவத்தைச் சரியாக நிரப்பவும்.',
  'account.errWait': 'பல முறை முயற்சி செய்துள்ளீர்கள். சிறிது நேரத்தில் மீண்டும் முயல் செய்யுங்கள்.',
  'account.errTryLater': 'இப்போது முடியவில்லை. சிறிது நேரத்தில் மீண்டும் முயல் செய்யுங்கள்.',
  'lib.licence.ccBy': 'நீங்கள் நகலெடுத்து பகிரலாம் அல்லது அச்சிடலாம் — மூலத்தைக் குறிப்பிட வேண்டும்.',
  'lib.licence.ccBySa': 'நகலெடுத்து அச்சிடலாம். செய்த மாற்றங்களையும் திறந்து பகிர வேண்டும்.',
  'lib.licence.ccZero': 'முற்றிலும் இலவசம். ஆதாரம் கூற வேண்டியதில்லை.',
  'lib.licence.pd': 'இதற்கு யாருக்கும் பதிப்புரிமை இல்லை — நீங்கள் விரும்பியபடி நகலெடுக்கலாம்.',
  'lib.licence.govtIndia': 'இந்திய அரசு இணையதளத்தில். படித்தலும் அச்சிடுதலும் இரண்டும் இலவசம்.',
  'lib.licence.creativeCommons': 'ஒவ்வொரு கோப்புக்கும் தனி உரிமம் உண்டு — கோப்பைப் பாருங்கள்.',
  'lib.licence.freeToRead': 'படிப்பது இலவசம். மற்றொருவருக்குக் கொடுப்பதும் அது கிடைத்த அதே நிபந்தனையில்.',
  'lib.openBadge': 'திறந்த',
  'lib.openBadgeNote': 'நகலெடுக்கலாம்',
  'lib.freeBadge': 'இலவசம்',
  'lib.freeBadgeNote': 'படிக்கலாம், நகலெடுக்க முடியாது',
  'lib.govt': 'அரசு',
  'lib.noSignup': 'கணக்கு வேண்டாம்',
  'lib.open': 'இங்கே திற',
  'lib.group.padhai': 'பாடநூல்கள்',
  'lib.group.padhai.note': 'பாடநூல்கள், கல்லூரி மற்றும் அரசு கல்வி ஆக்கங்கள்',
  'lib.group.kitab': 'நூல்கள்',
  'lib.group.kitab.note': 'பதிப்புரிமையற்றவை அல்லது நகலெடுக்க அனுமதி உள்ளவை',
  'lib.group.tasveer': 'படங்கள்',
  'lib.group.tasveer.note': 'வரைபடங்கள், படங்கள் — அனைத்தும்',
  'lib.group.audio': 'கேட்கக்கூடியவை',
  'lib.group.audio.note': 'நூல்களை ஒலியாக, சிறிய எழுத்துகள் படிக்க விரும்பாதவருக்கு',
  'lib.warnTitle': 'ஒவ்வொரு நூலும் இங்கு இல்லை',
  'lib.warn': 'சில நூல்கள் இன்னும் பதிப்புரிமையில் உள்ளதால் சட்டப்படி இலவசமாக வழங்க முடியாது. அவை வேண்டுமென்றே காட்டப்படவில்லை. நூல் தேவைப்பட்டால் கீழே கேளுங்கள் — சொல்லக்கூடியதை சொல்லப்படும்.',
  'lib.askInstead': 'கேளுங்கள்',
  'nav.library': 'நூலகம்',

  'help.title': 'உங்கள் சிக்கலை எழுதுங்கள்',

  'help.intro': 'கீழே எழுதுங்கள் அல்லது பேசுங்கள். தெரியாவிட்டால் மனதில் வருபனவே எழுதிவிடுங்கள் — இதுவே மிக முக்கியம்.',

  'help.howTitle': 'இந்தச் சேவை எப்படி வேலை செய்கிறது',

  'help.howBody': 'ஒவ்வொரு கேள்வியும் பதிவு செய்யப்படுகிறது, அதற்கான பதில் உடனே கிடைக்கிறது. உங்கள் பெயர், முகவரி அல்லது தொலைபேசி எண் எங்கும் எடுக்கப்படுவதில்லை. அனைத்தும் இலவசம்.',

  'help.suggested': 'வழக்கமான கேள்விகள்',

  'help.q1.label': 'மின்சாரம் போனது, என்ன செய்வது?',

  'help.q1.question': 'வீட்டில் மின்சாரம் போனது. என்ன செய்ய வேண்டும், மொபைல் போன் எப்படி சார்ஜ் செய்வது?',

  'help.q2.label': 'பிள்ளை கல்வியில் குறைபாடு',

  'help.q2.question': 'என் மகனின் படிப்பில் மிகக் குறைபாடு உள்ளது. வீட்டில் எப்படி மேம்படுத்துவது?',

  'help.q3.label': 'மூத்தோர் சிகிச்சை',

  'help.q3.question': 'என் தந்தையின் வயது மிக அதிகம், அவருக்கு சிகிச்சை எப்படி செய்வது?',

  'help.q4.label': 'வீட்டில் தீ வைத்தால்',

  'help.q4.question': 'ராத்திரி வீட்டில் தீ வைத்தால் முதலில் என்ன செய்ய வேண்டும்?',

  'home.stepLabel': 'படி',

  'home.step1Title': 'உங்கள் கூற்றை எழுதுங்கள் அல்லது பேசுங்கள்',

  'home.step1Body': 'தமிழில் தட்டச்சு செய்யுங்கள், அல்லது மைக் அழுத்திப் பேசுங்கள். தனிக்க ஏதும் தேவையில்லை — மனத்தில் உள்ளதை எழுதுங்கள்.',

  'home.step2Title': ' உடனே பதில் கிடைக்கும்',

  'home.step2Body': 'ஒவ்வொரு கேள்வியும் பதிவு செய்யப்படுகிறது, அதற்கான பதில் உடனே கிடைக்கிறது. மிகப் பெரிய கேள்விக்கு முன் சிறிய கேள்வியால் தொடங்குங்கள்.',

  'home.step3Title': 'பணம் இல்லை, தனிப்பட்ட தகவல் இல்லை',

  'home.step3Body': 'இந்தச் சேவை முற்றிலும் இலவசம். உங்கள் பெயர், முகவரி அல்லது தொலைபேசி எண் கேட்கப்படுவதில்லை, விளம்பரமும் காட்டப்படுவதில்லை.',

  'home.memorialEyebrow': 'இந்தத் தளம் யாருக்கு',
  'home.memorialLine': 'தன் வாழ்நாள் முழுவதும் சமூகத்திற்காகப் போராடியவர், ஆனால் இறுதியில் தன் பங்கைப் பெற முடியாதவர்.',
  'home.memorialMore': 'அவரது முழுக் கதையைப் படிங்கள்',
  'home.kundaliTitle': 'பிறந்த நாள் சாத்திரம்',
  'home.kundaliNote': 'முழுக் குண்டலம் — ஒன்பது கிரகங்கள், விமசோத்தரி தசை, பலதேசம், யோகம், சோடசவர்கம், கேபி, லால் கிதப், அங்க ஜோதிஷம். அனைத்தும் உங்கள் தொலைபேசியிலேயே கணக்கிடப்படும்.',
  'home.chooseTopicNote': 'கீழே உள்ள தலைப்பைத் தட்டவும். ஒவ்வொரு இடத்திலும் எளிய மொழியில் விவரம் உள்ளது.',

  'home.categoryEmpty': 'இந்தத் தலைப்பில் இன்னும் எதுவும் எழுதப்படவில்லை.',

  'home.soundIntro': 'கட்டணம் இல்லை, விளம்பரம் இல்லை. மனதை அமைதியாக்க மட்டும்.',

  'home.dedication1': 'நினைவில் — முற்றிலும் இலவசமான சேவை.',

  'home.dedication2': 'உங்கள் சிக்கலை எழுதுங்கள் அல்லது பேசுங்கள்.',

  'ref.title': 'இந்தச் சேவை என்ன, யாருக்கு',

  'ref.intro': 'இந்தச் சேவை திருமதி VARSHA நினைவில் உருவாக்கப்பட்டது. இது என்ன செய்கிறது, இதில் என்ன உள்ளது, இதன் வரம்புகள் என்ன என்பத எளிய மொழியில் சொல்லப்பட்டுள்ளது. அனைத்தும் முற்றிலும் இலவசம் — பணம் எடுக்கப்படுவதில்லை, விளம்பரம் காட்டப்படுவதில்லை, தனிப்பட்ட தகவல் கேட்கப்படுவதில்லை.',

  'ref.whatTitle': 'இதில் என்ன உள்ளது',

  'ref.what1': 'வீட்டில் தீ, மின்சாரம் போகுதல், குழந்தையின் படிப்பில் குறைபாடு, பெற்றோர் பராமரிப்பு — இப்போன்ற பொதுவான சிக்கல்களுக்கான எளிய வழிகள், தெளிவான மொழியில்.',

  'ref.what2': 'கேள்வியைப் பேசி கேட்கும் வசதி. பேச முடியாவிட்டால் எழுதுங்கள் — இரண்டிற்கும் பதில் ஒன்றே.',

  'ref.what3': 'ஒவ்வொரு கேள்வியும் பதிவு செய்யப்படுகிறது, எனவே பிறரைத் துன்பப்படுத்தும் விஷயம் உங்களுக்கு முன்பே கேட்கப்பட்டிருக்கும், அதற்கான பதில் கிடைக்கும்.',

  'ref.what4': 'விளம்பரமும் இல்லை, தேவையற்ற தகவலும் இல்லை, தனிப்பட்ட தகவலும் கேட்கப்படுவதில்லை. அனைத்தும் இலவசம்.',

  'ref.statsArticles': 'கட்டுரைகள் எழுதப்பட்டுள்ளன',

  'ref.statsCategories': 'தலைப்புகள் கிடைக்கின்றன',

  'ref.statsQuestions': 'கேள்விகள் கேட்கப்பட்டுள்ளன',

  'ref.adminTitle': 'நிர்வாகம் என்ன செய்யலாம்',

  'ref.adminBody': 'நீங்கள் அனுப்பிய கட்டுரைகளை நிர்வாகம் பார்க்கவும் அவற்றுக்குப் பதில் எழுதவும் முடியும். உங்கள் அனுமதியின்றி அவர்கள் எந்தக் கட்டுரையையும் மாற்றோ மற்றோ நீக்கோ முடியாது, உங்கள் தகவலை யாருக்கும் விற்க முடியாது.',

  'ref.dataTitle': 'உங்களைப் பற்றி நாங்கள் என்ன வைக்கிறோம்',

  'ref.dataBody': 'உங்கள் கேட்ட கேள்வி, அதன் சுருக்கம், கேட்ட நேரம் மட்டும் — அதே பதிலை மீண்டும் மீண்டும் கொடுக்காமல் இருக்க. உங்கள் பெயர், முகவரி, தொலைபேசி எண் அல்லது அடையாளம் காட்டும் தகவல் எதுவும் எடுக்கப்படுவதில்லை. தளத்தில் விளம்பரமோ டிராக்கிங் ஸ்கிரிப்டோ இல்லை.',

  'ref.helplineTitle': 'அவசர உதவிக்கு இந்த எண்களை வைத்திருங்கள்',

  'ref.helpline1': 'பெரிய ஆபத்து இருந்தால் — தீ, மின்சாரம் அதிர்வு, விழுதல் அல்லது அதிக இரத்தப்போக்கு — 112 எண்ணில் அழைக்கவும்.',

  'ref.helpline2': 'யாருக்கு நோய் அல்லது காயம் இருந்தால், போகும் வாகனம் இல்லை என்றால், 108 எண்ணில் ஆம்புலன்ஸ் கேளுங்கள்.',

  'ref.helpline3': 'பெண்ணுடன் தீங்கு நடந்தால், அல்லது ஒரு பெண் எங்கோ துன்பப்படுத்தப்பட்டால், 181 எண்ணில் அழைக்கவும். இது இலவசம்.',

  'ref.helpline4': 'குழந்தை அல்லது மூத்தோர் மீது அநியாயம் நடந்தால், 1098 எண்ணில் புகார் செய்யலாம்.',

  'ref.helpline5': 'மன அழுத்தம் மிக அதிகமாக இருந்தால், அல்லது வாழ விரும்பாவிட்டால், 14416 எண்ணில் பேசலாம். பேசுவதற்காக மட்டும்.',

  'ref.ownerNote': 'இந்தச் சேவை எந்த நிறுவனத்தினதும் அரசினதும் அல்ல; ஒரு தனி நபரின் நினைவில் நடத்தப்படுகிறது. எனவே இங்கு விளம்பரம் இல்லை, உறுப்பு இல்லை, பணம் எடுக்கப்படுவதில்லை.',

  'support.title': 'இந்தச் சேவை இலவசம்',

  'support.intro': 'இந்தச் சேவை யாரிடமிருந்தும் பணம் பெறுவதில்லை. ஆனால் அது நடக்கிறது — எனவே சில வழிகள் உள்ளன, அவற்றில் நீங்கள் உதவ முடியும். எளிய வழியே அதிகப் பயனுள்ளது.',

  'support.contactTitle': 'ஏதாவது சொல்ல வேண்டுமா?',

  'support.contactBody': 'ஏதாவது விஷயமும் இங்கே எழுதலாம் — ஏதாவது தவறு இருந்தால், அதிகம் எட்டினால், அல்லது ஏதாவது கேள்வி இருந்தால். எழுத எளிதாகத் தெரிந்தால் அதை மட்டும் எழுதுங்கள்.',

  'support.faqTitle': 'அடிக்கடி கேட்கப்படும் சில விஷயங்கள்',

  'support.faqBody': 'இது உண்மையிலேயே இலவசமா? ஆம். உங்கள் பெயர் எடுக்கப்படுகிறதா? இல்லை, பெயர் தர வேண்டியதில்லை. விளம்பரம் வருகிறதா? இல்லை. தொலைபேசி எண் அல்லது முகவரி கேட்கப்படுகிறதா? இல்லை. எந்த செயலியையும் பதிவிற்கிட வேண்டுமா? இல்லை, உலவாளரில் தான் திறக்கிறது.',

  'support.waysTitle': 'நீங்கள் எப்படி உதவ முடியும்',

  'support.way1Title': 'உங்கள் அனுபவத்தை எழுதுங்கள்',

  'support.way1Body': 'இந்தத் தளத்திலிருந்து உங்களுக்கு ஏதாவது நல்லது தட்டியிருந்தால் — அல்லது உங்களை குழப்பமாக்கிய ஏதாவது கிடைத்திருந்தால் — அப்போது கருத்துப் பக்கத்தில் எழுதுங்கள். உங்கள் பெயர் எடுக்க வேண்டியதில்லை.',

  'support.way2Title': 'உங்கள் நகரத்தைப் பற்றிச் சொல்லுங்கள்',

  'support.way2Body': 'நீங்கள் வாழும் இடத்தின் மொழி, பழக்கம் மற்றும் சிரமங்கள் வேறுபடும். உங்கள் இடத்தில் ஏதாவது இங்கு இல்லை என்றால் சொல்லுங்கள் — சேர்க்கக்கூடியது எல்லாம் சேர்க்கப்படும்.',

  'support.way3Title': 'உங்கள் அனுபவத்தை வேறொருவருக்கு கூறுங்கள்',

  'support.way3Body': 'இங்கு எழுதியுள்ளது பலருக்கு உதவும், அவர்கள் தெரிந்தால். இது உண்மையிலே உதவும் ஒருவரிடம் சொல்லுங்கள்.',

  'support.way4Title': 'இங்கே வந்து பாருங்கள்',

  'support.way4Body': 'உங்களுக்கு நேரம் இருந்தால், இந்தத் தளம் சரியாக இயங்குகிறதா என்று நீங்களே வந்து பாருங்கள். ஏதாவது தவறாக இருந்தால் சொல்லுங்கள் — முற்றிலும் இலவசமாகச் சரிசெய்து விடுவோம்.',

  'reviews.pageTitle': 'உங்கள் கருத்து',

  'reviews.pageIntro': 'இங்கே மக்கள் என்று எழுதியதே எழுதப்பட்டுள்ளது. எந்த கருத்தும் மறைக்கப்படுவதில்லை, எழுதியது அங்கேயே காட்டப்படுகிறது — ஒரு முறை பார்த்த பிறகே வெளியிடப்படுகிறது.',

  'reviews.intro': 'இந்தச் சேவை உங்களுக்கு உபயோகமானதா? உங்கள் கருத்தை எழுதுங்கள் — உங்கள் பெயர் எடுக்க வேண்டியதில்லை.',

  'reviews.write': 'உங்கள் கருத்தை எழுதுங்கள்',

  'reviews.starsLabel': '5 இல் {value} நட்சத்திரம்',

  'reviews.summaryTitle': 'பொதுவான கருத்து',

  'reviews.summaryLine': 'மக்கள் சராசரி {rating} இல் 5 இல் {count} நட்சத்திரம் வழங்கினர்.',

  'reviews.count': 'விமர்சனங்கள்',

  'reviews.name': 'உங்கள் பெயர் (தேவையில்லை)',

  'reviews.city': 'உங்கள் நகரம் (தேவையில்லை)',

  'reviews.placeholder': 'மனதில் வருபனவே எழுதுங்கள் — ஏதும் சரிசெய்ய வேண்டியதில்லை.',

  'reviews.keepLabel': 'கெட்டது என்றாலும், நல்லது என்றாலும் — இரண்டையும் எழுதுங்கள்',

  'reviews.fieldTooShort': 'குறைந்தது 10 எழுத்துகள் எழுதுங்கள்.',

  'reviews.rateLimited': 'மிக வேகமாக அனுப்பப்படுகிறது. சிறிது நேரம் நின்று மீண்டும் முயற்சிக்கவும்.',

  'reviews.sending': 'அனுப்பப்படுகிறது…',

  'reviews.moderated': 'உங்கள் விமர்சனம் வெளியிடப்படும் முன் ஒருமுறை பார்க்கப்படுகிறது.',

  'reviews.moderationNote': 'அனைத்தையும் நீக்குவதைத் தவிர்க்க, வெளியிடப்படும் முன் ஒவ்வொரு விமர்சனமும் ஒருமுறை பார்க்கப்படுகிறது. கொடி, எண் அல்லது தனிப்பட்ட சொற்கள் நீக்கப்படுகின்றன — மற்ற அனைத்தும் அப்படியே வெளியிடப்படுகின்றன.',

  'reviews.replyLabel': 'இதற்கு எழுதப்பட்டது',

  'reviews.ownerReply': 'பதில்',

  'reviews.empty': 'இன்னும் எந்த விமர்சனமும் இல்லை. முதலாவதை நீங்களே எழுதுங்கள்.',

  'reviews.anonymous': 'பெயர் இல்லாமல்',

  'reviews.toastSent': 'நன்றி',

  'reviews.toastFailed': 'கருத்து அனுப்பப்படவில்லை',

  'health.band.infant.note': 'சிறிய குழந்தைகள், இன்னும் தமது காரியத்தை சொல்ல முடியாதவர்கள்',

  'health.band.child.note': 'பேசக்கூடிய குழந்தைகள், ஆனால் கேள்வி கேட்பதற்கு பயப்படுபவர்கள்',

  'health.band.teen.note': 'கிஶோரர்கள், அவர்களுக்குப் பொதுவாக கேட்டுக் கொள்ளும் ஒருவர் கிடைப்பதில்லை',

  'health.band.young.note': 'வேலை, பணம், தூக்கம் — மூன்றின் சேர்ந்த பாரம்',

  'health.band.middle.note': 'வீடு, குழந்தைகள், தனது உடல்நலம் — அனைத்து பொறுப்பும் ஒரே சேர்வு',

  'health.band.later.note': 'உடலின் வயதும் அதன் பராமரிப்பும் — இரண்டும் ஒரே நேரத்தில்',

  'health.band.senior.note': 'மருந்து, சமநிலை, தனிமை — மூன்றும் சேர்ந்தே',

  'health.band.elder.note': 'ஒவ்வொரு மருந்தையும் பரிசோதிக்க வேண்டும், ஒவ்வொரு விழுவும் கடுமையானது',

  'health.c.infant1': 'தீவிர காய்ச்சல்',

  'health.c.infant2': 'சாப்பதில்லை',

  'health.c.infant3': 'வாந்தி வருகிறது',

  'health.c.infant4': 'வயிற்றுப்போக்கு',

  'health.c.child1': 'படிப்பில் மனம் இல்லை',

  'health.c.child2': 'பள்ளிக்கு செல்ல மறுக்கிறது',

  'health.c.child3': 'ராத்திரி காய்ச்சல்',

  'health.c.child4': 'பல் உடைகிறது',

  'health.c.teen1': 'படிப்பு அழுத்தம்',

  'health.c.teen2': 'தூக்கம் வரவில்லை',

  'health.c.teen3': 'மொபைல் பழக்கம்',

  'health.c.teen4': 'மிகவும் மனக்கவலி',

  'health.c.young1': 'வேலை அழுத்தம்',

  'health.c.young2': 'உட்கார்ந்தால் வலி',

  'health.c.young3': 'தூக்கம் வரவில்லை',

  'health.c.young4': 'பணம் குறைவு',

  'health.c.middle1': 'இடுப்பில் வலி',

  'health.c.middle2': 'தூக்கம் சரியாக இல்லை',

  'health.c.middle3': 'வீட்டு அழுத்தம்',

  'health.c.middle4': 'வயிற்றில் வாயு',

  'health.c.later1': 'முதுகு வலி',

  'health.c.later2': 'முட்டு வலி',

  'health.c.later3': 'ராத்திரி கால் பிடிப்பு',

  'health.c.later4': 'காலையில் விறைப்பு',

  'health.c.senior1': 'நடக்கச் சிரமம்',

  'health.c.senior2': 'மருந்துப் பரிசோதனை',

  'health.c.senior3': 'ராத்திரி சிறுநீர்',

  'health.c.senior4': 'கேட்பது குறைவு',

  'health.c.elder1': 'விழும் பயம்',

  'health.c.elder2': 'நினைவு பலவீதம்',

  'health.c.elder3': 'தினமும் வலி மருந்து',

  'health.c.elder4': 'மருத்துவர் எப்போது',

  'health.q.infant1': 'என் குழந்தைக்கு காய்ச்சல் வந்துள்ளது, பால் கொடுக்கவா?',

  'health.q.infant2': 'சிறிய குழந்தை சாப்பதில்லை, என்ன செய்வது?',

  'health.q.infant3': 'குழந்தைக்கு வாந்தி வருகிறது, எப்போது மருத்துவரைக் காட்டுவது?',

  'health.q.infant4': 'குழந்தைக்கு வயிற்றுப்போக்கு, என்ன கொடுக்கலாம்?',

  'health.q.child1': 'குழந்தையின் படிப்பில் மனம் பொருட்டதில்லை, என்ன செய்வது?',

  'health.q.child2': 'குழந்தை தினமும் பள்ளிக்குச் செல்ல மறுக்கிறது, காரணம் என்ன இருக்கலாம்?',

  'health.q.child3': 'குழந்தைக்கு இரவில் காய்ச்சல் வருகிறது, என்ன செய்வது?',

  'health.q.child4': 'குழந்தையின் பல் உடைகிறது, பல்லை எப்படி பராமரிக்கலாம்?',

  'health.q.teen1': 'படிப்பில் மிகவும் அழுத்தம் உள்ளது, அதை எப்படி எதிர்கொள்வது?',

  'health.q.teen2': 'இரவில் தூக்கம் சரியாக வரவில்லை, என்ன செய்வது?',

  'health.q.teen3': 'மொபைல் பழக்கம் ஏறிவிட்டது, விடுவதற்கான வழி சொல்லுங்கள்.',

  'health.q.teen4': 'மிகவும் மனக்கவலி தோன்றுகிறது, யாரிடம் பேசுவது?',

  'health.q.young1': 'வேலையில் மிகவும் அழுத்தம், எப்படி குறைக்கலாம்?',

  'health.q.young2': 'உட்கார்ந்தால் முதுகு வலிக்கிறது, என்ன செய்வது?',

  'health.q.young3': 'இரவில் தூக்கம் வரவில்லை, என்ன வழி உள்ளது?',

  'health.q.young4': 'பணம் குறைவு, செலவு அதிகம், என்ன செய்வது?',

  'health.q.middle1': 'இடுப்பில் வலி ஏற்படுகிறது, காரணம் என்ன இருக்கலாம்?',

  'health.q.middle2': 'தூக்கம் சரியாக வரவில்லை, மேம்படுத்த என்ன செய்வது?',

  'health.q.middle3': 'வீட்டில் அதிக அழுத்தம், குழந்தைகளை எப்படி கவனிக்கலாம்?',

  'health.q.middle4': 'வேலையில் பல ஆண்டுகளாக வயிற்றில் வாயு, என்ன செய்வது?',

  'health.q.later1': 'என் வயது 54, முதுகில் வலி உள்ளது, என்ன செய்வது?',

  'health.q.later2': 'ஏறும்போது முட்டுவலிக்கிறது, ஏன்?',

  'health.q.later3': 'இரவில் கால் பிடிப்பு, என்ன செய்வது?',

  'health.q.later4': 'காலையில் எழும்பும்போது இடுப்பு இறுகிப்போகிறது, காரணம் என்ன?',

  'health.q.senior1': 'முட்டுகளில் அதிக வலி, நடக்க கடினமாக உள்ளது, என்ன செய்வது?',

  'health.q.senior2': 'பல மருந்துகள் தினமும் சாப்பிட வேண்டும் — எது தீங்கு விளைவிப்பதை எப்படி அறிவது?',

  'health.q.senior3': 'இரவில் அடிக்கடி சிறுநீர், என்ன செய்வது?',

  'health.q.senior4': 'கேட்பது குறைந்துள்ளது, கேட்பதற்கான ஏதாவது வழி சொல்லுங்கள்.',

  'health.q.elder1': 'வீட்டில் விழும் பயம் உள்ளது, என்ன பாதுகாப்பு வைக்கலாம்?',

  'health.q.elder2': 'நினைவு பலவீதமாகிறது, என்ன வழி உள்ளது?',

  'health.q.elder3': 'தினமும் வலி மருந்து சாப்பிட வேண்டும் — இதற்கு தீங்கு உள்ளதா?',

  'health.q.elder4': 'எப்போது மருத்துவரிடம் செல்வது அவசியம்?',

  'support.contactMessageLabel': 'உங்கள் செய்தி',

  'support.contactPlaceholder': 'எழுத வேண்டியதை எழுதுங்கள் — தவறு இருந்தால், சிறந்தது கிடைத்தால், அல்லது கேள்வி இருந்தால்.',

  'support.contactHelp': 'குறைந்தது 10 எழுத்துகள். இது நேரடியாக உரிமையாளருக்குச் செல்கிறது.',

  'support.contactSubmit': 'அனுப்பு',

  'support.contactSending': 'அனுப்பப்படுகிறது…',

  'support.contactPrivacy': 'உங்கள் பெயர் எழுத வேண்டியதில்லை.',

  'support.contactSent': 'சென்றுவிட்டது',

  'support.contactSentBody': 'உங்கள் செய்தி உரிமையாளரை அடைந்துவிட்டது.',

  'support.contactFailed': 'அனுப்ப முடியவில்லை',

  'support.faq1Q': 'இது உண்மையிலேயே இலவசமா?',

  'support.faq1A': 'ஆம். பணம் எடுக்கப்படுவதில்லை, விளம்பரம் காட்டப்படுவதில்லை, சந்தா நீக்கப்படுவதில்லை. இது ஒருவரின் பணத்தில் நடக்கிறது, நிறுவனத்தின் அல்லது அரசின் பணத்தில் அல்ல.',

  'support.faq2Q': 'என் பெயர், முகவரி அல்லது தொலைபேசி எண் எடுக்கப்படுகிறதா?',

  'support.faq2A': 'இல்லை, எடுக்கப்படாது. இந்தத் தளம் தானாக எந்த அடையாளத்தையும் உருவாக்குவதில்லை — எந்த உள்நுழைவும் இல்லை, எந்த கண்காணிப்பு ஸ்கிரிப்டும் இல்லை. கேட்பது உங்கள் கேள்வி மட்டும், அதுவே சேமிக்கப்படுகிறது.',

  'support.faq3Q': 'இது மருத்துவர் அல்லது வழக்குநரா?',

  'support.faq3A': 'இல்லை. இது மருந்து அல்லது சட்ட ஆலோசனை வழங்காது. விஷயம் கடுமையாக இருக்கும் இடத்தில் இது மருத்துவர் அல்லது அதிகாரி அணுக உரையும் — அவர்களின் இடத்தை இது பற்றாது.',

  'support.faq4Q': 'ஒவ்வொரு பதிலும் சரியானதா?',

  'support.faq4A': 'எப்போதும் அல்ல. பதிலை எழுவது ஒரு கணினி, மருத்துவர் அல்ல — எனவே ஒவ்வொரு பதிலுடனும் இது மருத்துவ ஆலோசனை அல்ல என்று எழுதப்பட்டுள்ளது. எந்த மருந்தையும் தொடங்குவதற்கு முன் அல்லது நிறுத்துவதற்கு முன் மருத்துவரைக் காணுங்கள்.',

  'support.faq5Q': 'ஏதாவது செயலியைப் பதிவிற்கிட வேண்டுமா?',

  'support.faq5A': 'இல்லை. இது உலவாளரில் தான் திறக்கிறது. செயலி நிறுவல் இல்லை, அனுமதி இல்லை, புதுப்பிப்பு இல்லை.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'வீட்டு மருத்துவம்',
  'remedy.title': 'ஆயுர்வேத வீட்டு மருத்துவம்',
  'remedy.intro': 'எந்தத் தொல்லையாக இருந்தாலும் — இருமல், தலைவலி, மூட்டுவலி, அரிப்பு, நீரிழிவு, முதுகுவலி — கீழே தேர்ந்தெடுக்கவும் அல்லது உங்கள் வார்த்தைகளில் கேளுங்கள். வீட்டுக் கஷாயம், மசாஜ், உணவு முறை மற்றும் ஆயுர்வேத முறைகள் சொல்லப்படும்.',
  'remedy.choose': 'உங்கள் தொல்லையைத் தேர்ந்தெடுங்கள்',
  'remedy.emergencyStrong': 'இவை அவசர நிலைகள்:',
  'remedy.emergency': 'பாம்பு கடி, தேள் கொட்டு, நாய் கடி — உடனே மருத்துவமனைக்குச் செல்லுங்கள், முதலில் 112-ஐ அழையுங்கள். வீட்டு முறைகள் வழியில் செய்ய மட்டுமே, மருத்துவமனைக்குப் பதிலாக அல்ல.',
  'remedy.note': 'வீட்டு மற்றும் ஆயுர்வேத முறைகள் தொல்லையைக் குறைக்க உதவும்; மருத்துவர் பரிசோதனைக்கும் சிகிச்சைக்கும் மாற்றல்ல. எந்த மருந்தையும் தாங்களாகவே தொடங்கவோ நிறுத்தவோ வேண்டாம்.',
  'remedy.cough': 'இருமல்',
  'remedy.headache': 'தலைவலி',
  'remedy.joints': 'மூட்டுவலி',
  'remedy.itching': 'அரிப்பு',
  'remedy.snake': 'பாம்பு கடி',
  'remedy.scorpion': 'தேள் கொட்டு',
  'remedy.dog': 'நாய் கடி',
  'remedy.diabetes': 'நீரிழிவு',
  'remedy.back': 'முதுகுவலி',
  'remedy.walking': 'நடக்க சிரமம்',
  'home.remedyNote': 'கஷாயம், மசாஜ், உணவு, ஆயுர்வேத முறைகள் — ஒவ்வொரு தொல்லைக்கும், உங்கள் மொழியில்.',
  'nav.aarti': 'ஆரத்தி மற்றும் பஜன்',
  'aarti.title': 'ஆரத்தியும் பஜனும் — உண்மையான குரலில்',
  'aarti.intro': 'இங்கே ஆரத்தி, கீர்த்தனை, பஜன் ஆகியவற்றை உண்மையான பாடகர்கள், கோயில்களின் குரலில் கேளுங்கள். AI குரல் இல்லை.',
  'aarti.note': 'ஆரத்தியையோ பஜனையையோ கணினிக் குரலில் ஒலிப்பது அதன் தாளத்தையும் பக்தியையும் கெடுக்கும். எனவே இங்கே எல்லாம் உண்மையான ஒலிப்பதிவுகள்.',
  'aarti.kindAarti': 'ஆரத்தி',
  'aarti.kindKirtan': 'கீர்த்தனை',
  'aarti.kindBhajan': 'பஜன்',
  'aarti.credit': 'ஒலிப்பதிவு:',
  'aarti.licence': 'உரிமம்:',
  'aarti.listenLink': 'உண்மையான குரலில் கேளுங்கள்',
  'aarti.textChecked': 'இது பாரம்பரியப் பாடம், உண்மையான பதிவில் பாடப்பட்டபடி.',
  'aarti.textPrinted': 'இது வழக்கமான பாடம், வெளியிடப்பட்ட தொகுப்புகளுடன் ஒப்பிட்டுச் சரிபார்க்கப்பட்டது.',
  'aarti.textNotStored': 'இந்த நூலின் முழுப் பாடம் இங்கே சேமிக்கப்படவில்லை — கீழே உள்ள பதிவில் முழுப் பாடமும் உள்ளது.',
  'aarti.granthTitle': 'நூல்கள், சாலிசா, ஸ்தோத்திரம் — உண்மையான குரலில்',
  'aarti.noRecording': 'இந்த ஆரத்தியின் உண்மையான பதிவு இன்னும் தளத்தில் இல்லை, எனவே அதைப் பாடிக் காட்ட முடியாது — செயற்கைக் குரலில் ஆரத்தி பாடப்படுவதில்லை.',
  'aarti.textOnlyTitle': 'மேலும் ஆரத்திகள் — பாடமும் உண்மையான குரலும்',
  'aarti.fullText': 'முழுப் பாடம்',
  'aarti.notChecked': 'இந்த ஆரத்தியின் சரிபார்க்கப்பட்ட பாடம் இன்னும் தளத்தில் இல்லை. சரிபார்க்காத பாடம் தரப்படுவதில்லை, ஏனெனில் பிரார்த்தனையில் தவறான சொல் சொற்கள் இல்லாததை விட மோசம்.',
  'aarti.verifiedList': 'தளத்தில் இந்த ஆரத்திகளுக்குச் சரிபார்க்கப்பட்ட பாடங்கள் உள்ளன:',

};

const TELUGU: Record<string, string> = {
  'jgd.placeSearch': 'మీ ఊరి పేరు టైప్ చేయండి',
  'jgd.placeNoMatch': 'ఆ ఊరు జాబితాలో లేదు. దగ్గరలో ఉన్న ఊరిని ఎంచుకోండి.',

  'account.name': 'మీ పేరు',
  'account.namePlaceholder': 'ఉదా. సీతా దేవి',
  'account.nameHint': 'మీరు ఎవరో తెలుసుకోవడానికి. ఏ పేరైనా పోతుంది, ఇది అవసరం లేదు.',

  'nav.home': 'హోమ్', 'home.metaTitle': 'ఉచిత సమాధానాలు, మీ సొంత మాటల్లో', 'nav.tribute': 'స్మృతి', 'nav.help': 'సహాయం', 'nav.reference': 'పరిచయం',
  'lib.licence.ccZero.name': 'CC0 / పబ్లిక్ డొమైన్',
  'lib.licence.pd.name': 'పబ్లిక్ డొమైన్',
  'lib.licence.govtIndia.name': 'భారత ప్రభుత్వం',
  'lib.licence.creativeCommons.name': 'క్రియేటివ్ కామన్స్ (మిశ్రమ)',
  'lib.licence.freeToRead.name': 'చదవడానికి ఉచితం',
  'lib.entry.ncert.title': 'NCERT పుస్తకాలు — తరగతి 1 నుండి 12 వరకు',
  'lib.entry.ncert.what': 'ప్రతి సబ్జెక్టు పుస్తకాలు, ప్రతి తరగతికి. లాగిన్ లేకుండా, నేరుగా PDF.',
  'lib.entry.ncert.langs': 'హిందీ, ఇంగ్లిష్ మరియు 30 కంటే ఎక్కువ భారతీయ భాషలు',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — డిజిటల్ పాఠ్యపుస్తకాలు',
  'lib.entry.pm-evidya.what': 'NCERT పుస్తకాల యాప్, పెద్ద అక్షరాల్లో చదవవచ్చు. మాట్లాడి వినిపించవచ్చు.',
  'lib.entry.pm-evidya.langs': 'భారతీయ భాషలు',
  'lib.entry.diksha.title': 'DIKSHA — ఉపాధ్యాయులకు మరియు పిల్లలకు',
  'lib.entry.diksha.what': 'పాఠాలు, వీడియోలు, సాధన — తరగతి 1 నుండి 12 వరకు.',
  'lib.entry.diksha.langs': 'భారతీయ భాషలు',
  'lib.entry.khan-academy.title': 'Khan Academy — ఇంగ్లిష్‌లో గణితం మరియు శాస్త్రం',
  'lib.entry.khan-academy.what': 'ప్రతి తరగతి వరకు వీడియో పాఠాలు, వ్రాతపాఠాలూ ఉన్నాయి.',
  'lib.entry.openstax.title': 'OpenStax — ఇంగ్లిష్‌లో ఉచిత పుస్తకాలు',
  'lib.entry.openstax.what': 'కళాశాల స్థాయి పుస్తకాలు — గణితం, శాస్త్రం, మానవిక. ప్రతి పేజీకీ PDF.',
  'lib.entry.nios.title': 'NIOS — దూర విద్య, ఉచిత సామగ్రి',
  'lib.entry.nios.what': 'ఓపెన్ మరియు ఆన్‌లైన్ కోర్సులకు ఉచిత పుస్తికలు, చేరిక లేకుండా.',
  'lib.entry.nios.langs': 'హిందీ, ఇంగ్లిష్ మరియు ఇతరాలు',
  'lib.entry.ignou.title': 'IGNOU — ఉన్నత చదువులకు ఉచిత పుస్తకాలు',
  'lib.entry.ignou.what': 'దూర విద్య పుస్తకాలు, పూర్తిగా ఉచితం.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ఇంగ్లిష్ పాత పుస్తకాలు',
  'lib.entry.gutenberg.what': '70,000 కంటే ఎక్కువ పుస్తకాలు, అన్నింటి కాపీరైట్ ముగిసింది. ఉచిత ఈ-బుక్‌లు, ఆడియో.',
  'lib.entry.pratham-books.title': 'Pratham Books — పిల్లల పుస్తకాలు',
  'lib.entry.pratham-books.what': 'భారతీయ భాషల్లో పిల్లల పుస్తకాలు, పూర్తిగా ఉచితం. తరగతి 1 నుండి 5 వరకు.',
  'lib.entry.pratham-books.langs': 'హిందీ, మరాఠీ, బెంగాలీ, తమిళం, తెలుగు మరియు మరిన్ని',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — వార్తాపత్రికలు మరియు పాత పత్రికలు',
  'lib.entry.internet-archive-texts.what': 'లక్షల పాత పుస్తకాలు, పత్రికలు, వార్తాపత్రికలు — ఉచితం.',
  'lib.entry.wikisource.title': 'Wikisource — ఉచిత బహిరంగ గ్రంథాలు',
  'lib.entry.wikisource.what': 'కాపీరైట్ లేదు — ఇవి ప్రపంచపు పాత సాహిత్య పుస్తకాలు.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ప్రతి రకమైన చిత్రాలు',
  'lib.entry.wikimedia-commons.what': 'జంతువులు, మ్యాపులు, నక్షత్రాలు, చరిత్ర — అన్నీ. ప్రతి చిత్రానికి దాని లైసెన్స్ ఉంది.',
  'lib.entry.pixabay.title': 'Pixabay — ఫోటోలు మరియు చిత్రాలు',
  'lib.entry.pixabay.what': 'ఫోటోలు, చిత్రాలు, చిన్న వీడియోలు.',
  'lib.entry.unsplash.title': 'Unsplash — అందమైన ఫోటోలు',
  'lib.entry.unsplash.what': 'ఉచితం, పెద్ద నాణ్యత, ఖాతా అవసరం లేదు.',
  'lib.entry.openverse.title': 'Openverse — అన్ని ఉచిత చిత్రాలు ఒకే చోట',
  'lib.entry.openverse.what': 'ఒకేసారి అనేక ఉచిత చిత్ర సైట్లను వెతకండి.',
  'lib.entry.librivox.title': 'LibriVox — వినడానికి పుస్తకాలు',
  'lib.entry.librivox.what': 'పాత ఇంగ్లిష్ పుస్తకాల ఉచిత ఆడియో, మనుషుల గొంతులో.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ఆడియో సేకరణ',
  'lib.entry.internet-archive-audio.what': 'వేలాది ఉచిత రికార్డింగ్‌లు — పుస్తకాలు, ప్రసంగాలు, సంగీతం.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — జాతీయ గీతం మరియు ఇతరాలు',
  'lib.entry.vande-mataram.what': 'భారతదేశ జాతీయ గీతం మరియు ఇతర జాతీయ గీతాలు, ఉచితం.',
  'art.aag-aur-bijli-ke-bachav.title': 'అగ్ని మరియు విద్యుత్ నుండి రక్షణ నియమాలు',
  'art.aag-aur-bijli-ke-bachav.summary': 'ఇంట్లో అగ్నిప్రమాదాన్ని నివారించడం — సులభమైన నియమాలు',
  'art.aag-lagne-par-kya-karein.title': 'అగ్ని ప్రమాదం జరిగితే ఏం చేయాలి',
  'art.aag-lagne-par-kya-karein.summary': 'మండుతున్న ఇంట్లో అగ్ని — ముందుగా ఏం చేయాలి, ఏం చేయకూడదు',
  'art.bimari-se-bachav.title': 'సంక్రమణ నుండి రక్షణకు ఏడు నియమాలు',
  'art.bimari-se-bachav.summary': 'చేతులు కడుకోవడం, మాస్క్, టీకా — ఎలా సురక్షితంగా ఉండాలి',
  'art.dhuwan-ka-jhakora.title': 'పొగ శ్వాసాంతరం నుండి రక్షణ',
  'art.dhuwan-ka-jhakora.summary': 'శ్వాస ఆగిపోతోంది, గాలి రావట్లేదు — ఏం చేయాలి, ఎప్పుడు ఆసుపత్రికి వెళ్ళాలి',
  'art.doodh-pani-band-ho.title': 'విద్యుత్ లేదా నీరు హఠాత్తుగా ఆగిపోతే',
  'art.doodh-pani-band-ho.summary': 'ఏం చేయాలి, ఏం మానాలి, ఎప్పుడు సహాయం అడగాలి',
  'art.haath-ki-saafai.title': 'సబ్బు లేకుండా చేతులు శుభ్రం చేసుకునే పద్ధతి',
  'art.haath-ki-saafai.summary': 'నీరు లేదా సబ్బు లేనప్పుడు',
  'cat.dhyan-aur-yoog.title': 'ధ్యానం మరియు యోగ',
  'cat.dhyan-aur-yoog.subtitle': 'మనసును ప్రశాంతపరచే సులభ మార్గాలు',
  'cat.gharelu-marammat.title': 'ఇంటి మరమ్మత్తు',
  'cat.gharelu-marammat.subtitle': 'ఇంట్లోని చిన్న సమస్యలకు పరిష్కారాలు',
  'cat.bachchon-ki-padhai.title': 'పిల్లల చదువు',
  'cat.bachchon-ki-padhai.subtitle': 'చదువులో ఉన్నారు, ఆందోళనలో ఉన్నారు',
  'cat.budharge-seva.title': 'పెద్దల సేవ',
  'cat.budharge-seva.subtitle': 'శ్రద్ధ మరియు సహాయం',
  'cat.shishu-dekhbhal.title': 'శిశు సంరక్షణ',
  'cat.shishu-dekhbhal.subtitle': 'చిన్న పిల్లల సరైన సంరక్షణ',
  'cat.dharmik-upay.title': 'మతపరమైన పరిష్కారాలు',
  'cat.dharmik-upay.subtitle': 'ప్రశాంతమైన మనసుతో',
  'cat.pavan-grah-aur-aarti.title': 'పవిత్ర గ్రంథాలు మరియు ఆరతి',
  'cat.pavan-grah-aur-aarti.subtitle': 'భక్తితో చదవండి, వినండి',
  'cat.aapatkalen-gayide.title': 'అత్యవసర మార్గదర్శి',
  'cat.aapatkalen-gayide.subtitle': 'వెంటనే సహాయం కావాలంటే',
  'cat.mahamari-suraksha.title': 'వ్యాధి రక్షణ',
  'cat.mahamari-suraksha.subtitle': 'వ్యాధి వ్యాప్తిని అరికట్టడం',
  'nav.reviews': 'అభిప్రాయం', 'nav.support': 'సహాయం చేయండి', 'nav.menu': 'మెనూ',
  'nav.birthChart': 'జన్మ గంఠం',
  'jgd.title': 'మీ జన్మ గంఠం',
  'jgd.intro': 'మీ పేరు, పుట్టిన తేదీ, తెలిస్తే సమయం మరియు స్థలం. అన్నీ మీ ఫోన్‌లోనే లెక్కించబడతాయి — ఎక్కడకూ పంపబడవు.',
  'jgd.nameLabel': 'పుట్టిన పేరు',
  'jgd.namePlaceholder': 'ఉదా. పూర్తి పేరు',
  'jgd.nameHint': 'బాల్యంలో పెట్టబడిన పేరు.',
  'jgd.dateLabel': 'జనన తేదీ',
  'jgd.timeLabel': 'పుట్టిన సమయం',
  'jgd.timeHint': 'తెలియకపోతే ఖాళీగా వద్దండి.',
  'jgd.placeLabel': 'జనన స్థలం',
  'jgd.placeNone': 'తెలియదు / ఎంచుకోండి',
  'jgd.placeHint': 'జనన స్థలాన్ని ఎంచుకోండి.',
  'jgd.submit': 'లెక్కించు',
  'jgd.savePdf': 'PDF ఇవ్వండి',
  'jgd.again': 'మళ్ళీ లెక్కించు',
  'jgd.errDate': 'జనన తేదీని సరిగ్గా ఇవ్వండి.',
  'jgd.errPlace': 'జాబితా నుండి మీ ఊరిని ఎంచుకోండి, లేదా దగ్గరలో ఉన్న ఊరిని ఎంచుకోండి.',
  'jgd.numTitle': 'సంఖ్య జ్యోతిష్యం',
  'jgd.lifePath': 'జీవిత మార్గం',
  'jgd.nameNumber': 'పేరు సంఖ్య',
  'jgd.soulNumber': 'ఆత్మ సంఖ్య',
  'jgd.birthdayNumber': 'జన్మదిన సంఖ్య',
  'jgd.astroTitle': 'వైదిక జ్యోతిష్యం',
  'jgd.nakshatra': 'నక్షత్రం',
  'jgd.pada': 'పద',
  'jgd.rashi': 'రాశి',
  'jgd.rashiLord': 'రాశి అధిపతి',
  'jgd.nakshatraLord': 'నక్షత్ర అధిపతి',
  'jgd.lagna': 'లగ్నం',
  'jgd.lagnaMissing': 'లగ్నానికి పుట్టిన సమయం, స్థలం కావాలి. పైన నింపి మళ్ళీ లెక్కించండి — తెలియకపోతే ఇదీ చాలు.',
  'jgd.gunTitle': 'గుణ మిలన్',
  'jgd.gunIntro': 'మరొకరి పేరు, జనన తేదీ ఇవ్వండి.',
  'jgd.gunName': 'వారి పేరు',
  'jgd.gunDate': 'వారి జనన తేదీ',
  'jgd.gunHint': 'రెండు పేర్లు, రెండు తేదీలు ఉంటే గుణ మిలన్ వస్తుంది.',
  'jgd.disclaimer': 'ఇది సంప్రదాయ పద్ధతిలో లెక్కించినది, భవిష్యవాణి కాదు. ఏ సంఖ్యా, ఏ రాశి ఎవరి ఆరోగ్యాన్ని, డబ్బును లేదా సంబంధాన్ని నిర్ణయించదు. పెద్ద నిర్ణయాలకు వైద్యుడు, న్యాయవాది లేదా అనుభవి వ్యక్తి సలహా తీసుకోండి.',
  'nav.openMenu': 'మెనూ తెరవండి', 'nav.closeMenu': 'మెనూ మూసివేయండి', 'nav.language': 'భాష మార్చండి',
  'nav.expand': 'పట్టీ విస్తరించు', 'nav.collapse': 'పట్టీ మూడివేయి', 'nav.skip': 'సరిగ్గా విషయానికి వెళ్లండి',
  'ask.label': 'మీ సమస్యను టైప్ చేయండి లేదా మాట్లాడండి', 'ask.placeholder': 'ఉదాహరణకు: పిల్లలకు చదవు బలహీనం',
  'ask.help': 'ఎంటర్ నొక్కి పంపవచ్చు.', 'ask.send': 'అడిగండి', 'ask.sending': 'ఆలోచిస్తోంది…',
  'ask.clear': 'రాసినది తొలగించండి', 'ask.speak': 'మాట్లాడి అడిగండి', 'ask.listening': 'మాట్లాడటం ప్రారంభించండి…',
  'ask.heard': 'వింటున్నాం', 'ask.stopListening': 'వినడం ఆపండి', 'ask.suggested': 'సాధారణ ప్రశ్నలు',
  'ask.answerTitle': 'సమాధానం', 'ask.listen': 'వినండి', 'ask.stopSpeak': 'ఆపండి',
  'ask.aiNote': 'ఈ సమాధానం AI ఇచ్చింది. నిపుణుల సలహాకు ప్రత్యామ్నాయం కాదు.',
  'sound.title': 'శాంతికి ధ్వని', 'sound.intro': 'ఫీజు లేదు, ప్రకటన లేదు.',
  'sound.shankh': 'శంఖం', 'sound.bansuri': 'బంసి', 'sound.dhol': 'డ్రమ్', 'sound.all': 'మూడు',
  'dhun.welcome': 'స్వాగతం', 'dhun.prompt': 'శంఖం, వేణువు, డ్రమ్ కలిపి వినడానికి తాకించండి.',
  'dhun.listen': 'వినండి', 'dhun.skip': 'వద్దు',
  'home.emergencyTitle': 'అత్యవసరం — ఇప్పుడే సహాయం కావాలి', 'home.emergencyNote': 'వీటిని మొదట చదవండి.',
  'home.readMore': 'పూర్తి సమాచారం చదవండి', 'home.chooseTopic': 'ఏ విషయం తెలుసుకోవాలి?',
  'home.askHere': 'ఈ విషయంలో అడగండి', 'home.howTitle': 'ఈ సేవ ఎలా పనిచేస్తుంది',
  'home.soundTitle': 'శాంతికి ధ్వని', 'home.freeTitle': 'ఈ సేవ పూర్తిగా ఉచితం',
  'home.freeBody': 'డబ్బు తీసుకోవటం లేదు, వ్యక్తిగత వివరాలు అడగడం లేదు, ప్రకటన లేదు.',
  'footer.pages': 'పేజీలు', 'footer.helplines': 'ముఖ్య నంబర్లు', 'footer.readStory': 'ఇక్కడ పూర్తి కథ చదవండి',
  'reviews.title': 'మీ అభిప్రాయం, మీ మాట', 'reviews.submit': 'పంపండి', 'reviews.comment': 'మీ మాట',
  'language.choose': 'మీ భాషను ఎంచుకోండి', 'language.articlesIn': 'ఈ వ్యాసం హిందీలో ఉంది.',

  'ask.welcome': 'స్వాగతం! కింద మీ సమస్యను రాయండి లేదా ఒక అంశాన్ని ఎంచుకోండి.',

  'ref.notTitle': 'ఇది ఏమి చేయదు',

  'ref.not1': 'ఇది వైద్యుడు కాదు. మందుల సలహా ఎప్పుడూ ఇవ్వబడదు.',

  'ref.not2': 'ఇది న్యాయవాది కాదు. చట్టపరి సలహా ఇవ్వబడదు.',

  'ref.not3': 'ఎట్టి డబ్బు తీసుకోబడదు, ఎట్టి ప్రచారం చూపించడం లేదు.',

  'ref.not4': 'మీ పేరు, చిరునామా లేదా ఫోన్ నంబర్ అడగబడదు, భద్రపరచబడదు.',

  'ref.not5': 'ఏ ప్రభుత్వ పథకానికీ ధర లేదా నంబర్ సృష్టించబడదు — సరైన సమాచారం లేకపోతే తెలియదని స్పష్టంగా చెబుతారు.',

  'ref.medicalTitle': 'ముఖ్యం: ఇది వైద్య సలహా కాదు',

  'ref.medicalBody': 'వ్యాధి, మందులు లేదా విషపదార్థం గురించి అయితే ముందుగా వైద్యుడిని కలవండి. ఇక్కడ ఇవ్వబడిన సమాచారం సాధారణ సహాయం కోసం మాత్రమే. పిల్ల టీకా, గర్భధారణ, లేదా ఏ మందులను ప్రారంభించే ముందు వైద్య సలహా తీసుకోవండి.',

  'ref.statsTitle': 'ఎంత సమాచారం ఉంది',

  'support.howTitle': 'మీరు మాకు ఎలా సహాయం చేయగలరు',

  'support.alwaysFreeTitle': 'ఈ సేవ ఎప్పుడూ ఉచితంగానే ఉంటుంది',

  'support.alwaysFreeBody': 'రాబట్టే సహాయం ఈ సేవను నడపడానికి వినియోగపరచబడుతుంది. ఎవరి నుండీ ఎప్పుడూ డబ్బు తీసుకోబడదు.',

  'smriti.eyebrow': 'స్మరణగా',

  'smriti.whyTitle': 'ఈ సైట్ ఎందుకు ఉంది',

  'smriti.ending': 'ఆమె పోరాటం ఇక్కడే కొనసాగుతుంది.',

  'article.askAny': 'ఒక ప్రశ్న అడగండి',

  'article.remember': 'గుర్తుంచుకోండి',

  'article.emergencyInfo': 'ముఖ్య సమాచారం',

  'article.medicalTitle': 'ఇది వైద్య సలహా కాదు',

  'article.medicalBody': 'ఈ సమాచారం సాధారణ సహాయం మాత్రమే. వైద్యుడి సలహా లేకుండా ఏ మందులను ప్రారంభించవద్దు లేదా ఆపవద్దు.',

  'article.heading': '{category} పై వ్యాసాలు',

  'reviews.rateQuestion': 'ఎన్ని నక్షత్రాలు ఇస్తారు?',

  'reviews.starsShort': '{value} నక్షత్రాలు',

  'reviews.averageOutOf': '5లో {value} నక్షత్రాలు',

  'dhun.welcomeTitle': 'స్వాగతం',

  'dhun.consent': 'శంఖం, వేణువు మరియు డ్రమ్ కలిపి. వినడానికి నొక్కండి.',

  'dhun.failed': 'శబ్దం ప్లే చేయలేకపోయాము.',

  'dhun.unsupported': 'ఈ బ్రౌజర్ శబ్దాన్ని ప్లే చేయలేదు.',

  'dhun.failedTry': 'శబ్దం ప్లే చేయడంలో సమస్య వచ్చింది.',

  'sound.hintIdle': 'ఏ బటన్ నొక్కినా శబ్దం వినండి.',

  'sound.hintPlaying': 'శబ్దం ప్లే అవుతోంది. ఆపడానికి అదే బటన్ మళ్ళీ నొక్కండి.',

  'sound.preparing': 'శబ్దం సిద్ధమవుతోంది',

  'nav.path': 'మార్గం',

  'toast.dismiss': 'మూసివేయి',

  'footer.free': 'ఈ సేవ పూర్తిగా ఉచితం. ఎవరి నుండీ డబ్బు తీసుకోబడ్డు.',

  'cat.empty': 'ఈ అంశంలో ఇంకా వ్యాసాలు లేవు.',
  'cat.notFound': 'ఈ పేజీ కనబడలేదు',

  'dhun.label': 'శబ్దం ప్లే చేయడానికి అనుమతి',

  'language.articlesInHint': 'ప్రతి భాషకు వేర్వేరు అనువాదం అవసరం. ఈ అనువాదం ఇంకా జరగలేదు — ఉన్నది హిందీలోనే సరైనది, పూర్తిది.',

  'theme.toDark': 'చీకటి రంగుకు వెళ్ళండి',

  'theme.toLight': 'ప్రకాశవంతమైన రంగుకు వెళ్ళండి',

  'ask.emptyAnswer': 'ఈసారి సమాధానం కాలేదు. కొంచెం భిన్నంగా మళ్లీ అడగండి.',

  'ask.errorNetwork': 'ఇంటర్నెట్ పనిచేయడం లేదు. కనెక్షన్ చూసి మళ్లీ ప్రయత్నించండి.',

  'ask.errorRateLimit': 'ఒకేసారి చాలా ప్రశ్నలు పంపబడ్డాయి. కొద్ది సేపేల తర్వాత ప్రయత్నించండి.',

  'ask.heardWith': 'ఇప్పుడు వింటున్నాము',

  'ask.micUnsupported': 'ఈ బ్రౌజర్‌లో మాట్లాడి అడగడం పనిచేయదు. టైప్ చేసి అడగండి.',

  'ask.notAnswer': 'ఈ ప్రశ్నకు నేరుగా సమాధానం మేము వద్ద లేదు.',


  'article.askAbout': 'ఈ అంశంలో అడగండి',

  'article.count': '{count} వ్యాసాలు',

  'article.emergency': 'అత్యవసరం',

  'article.others': 'ఈ అంశంలో మరిన్ని వ్యాసాలు',

  'article.readAloud': 'ఈ వ్యాసాన్ని వినండి',

  'footer.admin': 'నిర్వహణ',

  'footer.ambulance': 'అంబులెన్స్',

  'footer.emergency': 'అత్యవసరం',

  'footer.rights': 'ఉచిత సేవ',

  'footer.women': 'మహిళా సహాయం',

  'sound.allHint': 'ఒకటిగా',

  'sound.bansuriHint': 'మృదువైన, నెమ్మది',

  'sound.dholHint': 'తీవ్రంగా, వేగంగా',

  'sound.errGeneric': 'శబ్దం ప్లే చేయడంలో సమస్య వచ్చింది.',

  'sound.errUnsupported': 'ఈ బ్రౌజర్ శబ్దాన్ని ప్లే చేయలేదు.',

  'sound.listenLabel': 'వినండి',

  'sound.playing': 'శబ్దం ప్లే అవుతోంది. ఆపడానికి అదే బటన్ మళ్లీ నొక్కండి.',

  'sound.shankhHint': 'లోతైన, పెద్ద',

  'voice.aborted': 'ఆపేశారు. మళ్లీ ప్రయత్నించండి.',

  'voice.audioCapture': 'మైక్ దొరకలేదు. పరికరం కనెక్ట్ చేయండి, లేదా టైప్ చేసి అడగండి.',

  'voice.generic': 'ఏదో తప్పు జరిగింది. మళ్లీ ప్రయత్నించండి.',

  'voice.network': 'మాట్లాడి అడగడానికి ఇంటర్నెట్ కావాలి, అది లేదు. టైప్ చేసి అడగండి — అదే సమాధానం దొస్తుంది.',

  'voice.noSpeech': 'ఏ మాట కూడా వినబడలేదు. మైక్ దగ్గర మాట్లాడండి, లేదా టైప్ చేయండి.',

  'voice.notAllowed': 'మైక్ అనుమతి రాలేదు. పైకి వెళ్ళి అనుమతి ఇవ్వండి, లేదా టైప్ చేసి అడగండి.',

  'voice.serviceNotAllowed': 'మైక్ అనుమతి రాలేదు. పైకి వెళ్ళి అనుమతి ఇవ్వండి, లేదా టైప్ చేసి అడగండి.',

  'voice.speakFailed': 'ఈ సమాధానాన్ని చదివి వినించలేకపోయాము.',
  'voice.noVoice': 'ఈ పరికరంలో {name} స్వరం లేదు. ఇప్పుడు రాసినది చదవండి, లేదా ఫోన్ సెట్టింగ్స్\u200cలో స్వరాన్ని చేర్చండి.',

  'voice.unsupported': 'ఈ బ్రౌజర్‌లో మాట్లాడి అడగడం పనిచేయదు. టైప్ చేసి అడగండి.',

  'ask.notConfigured': 'ఈ సేవ ఇప్పుడు సేవ్ చేసిన సమాధానాల కోశం నుండి సమాధానమిస్తోంది. మీ ప్రశ్న దానిలో లేదు.',

  'ask.browseTitle': 'ఇక్కడ ఉన్న వ్యాసాలు చూడండి',

  'health.heading': 'మీ వయస్సు చెప్పండి',

  'health.intro': 'వయస్సు ప్రకారం తరచుగా అడిగే ప్రశ్నలు ఇక్కడ కనిపిస్తాయి. ఏ బటనైనా నొక్కండి — ప్రశ్న కింద నింపబడుతుంది, తర్వాత అడగండి.',

  'health.ageLabel': 'వయస్సు (సంవత్సరాలు)',

  'health.years': 'సంవత్సరాలు',

  'health.bandsLabel': 'వయస్సు ప్రకారం ఎంచుకోండి',

  'health.notAdviceStrong': 'ఇది వైద్య సలహా కాదు.',

  'health.notAdvice': 'ఏ మందులైనా ప్రారంభించవద్దు లేదా ఆపవద్దు — ముందుగా వైద్యుడిని కలవండి.',

  'health.emergencyStrong': 'అత్యవసరంలో కాల్ చేయండి:',

  'health.emergencyCall': '(అత్యవసరం)',

  'health.emergencyAmbulance': '(అంబులెన్స్)',

  'health.emergencyWomen': '(మహిళా సహాయం)',

  'health.privacy': 'పేరు లేదా చిరునామా రాయాల్సిన అవసరం లేదు.',

  'health.band.infant.label': '0 – 2 సంవత్సరాలు',

  'health.band.child.label': '3 – 12 సంవత్సరాలు',

  'health.band.teen.label': '13 – 17 సంవత్సరాలు',

  'health.band.young.label': '18 – 30 సంవత్సరాలు',

  'health.band.middle.label': '31 – 45 సంవత్సరాలు',

  'health.band.later.label': '46 – 60 సంవత్సరాలు',

  'health.band.senior.label': '61 – 75 సంవత్సరాలు',

  'health.band.elder.label': '76 – 100 సంవత్సరాలు',

  /* ---- save / download ---- */

  'download.pdf': 'PDFగా సేవ్ చేయి',
  'download.text': 'పాఠ్యంగా సేవ్ చేయి',
  'download.printNow': 'ముద్రించు',
  'download.preparing': 'సిద్ధమవుతోంది',
  'download.blocked': 'కొత్త ట్యాబ్ తెరవలేకపోయాము. బ్రౌజర్ పాప్-అప్ నిరోధిస్తోంది — అనుమతించండి.',

  /* ---- attach a document ---- */

  'attach.button': 'మీ పత్రం లేదా ఫోటో జోడించండి',
  'attach.formats': 'PDF, ఫోటో (JPG/PNG) లేదా పాఠ్య ఫైల్ — 12 MB వరకు',
  'attach.reading': 'చదువుతోంది…',
  'attach.attached': 'జోడించారు',
  'attach.remove': 'తీసివేయి',
  'attach.tooBigPdf': 'ఈ PDF 12 MB కంటే పెద్దది. చిన్న ఫైల్ ఎంచుకోండి.',
  'attach.tooBigImage': 'ఈ ఫోటో 3 MB కంటే పెద్దది. చిన్న ఫోటో ఎంచుకోండి.',
  'attach.scannedPdf': 'ఈ PDF స్కాన్ — దీనిలో ఫోటో మాత్రమే ఉంది, చదవలేము. దాని ఫోటో పంపండి.',
  'attach.pdfFailed': 'ఈ PDF చదవలేకపోయాము.',
  'attach.imageFailed': 'ఈ ఫోటో లోడ్ కాలేదు.',
  'attach.wrongType': 'ఈ రకమైన ఫైల్ పనిచేయదు. PDF, ఫోటో లేదా పాఠ్య ఫైల్ పంపండి.',
  'attach.hint': 'మీ పత్రాన్ని ఇక్కడ జోడించి ప్రశ్న అడగండి — సమాధానం ఆ పత్రం గురించే వస్తుంది.',
  'ask.sendWithFile': 'దీనికి సమాధానం',

  /* ---- free library ---- */

  'lib.title': 'ఉచిత గ్రంథాలయం',
  'lib.intro': 'పాఠ్యపుస్తకాలు, పుస్తకాలు, చిత్రాలు, ఆడియో — అన్నీ ఉచితంగా, చట్టపరంగా.',
  'lib.legalTitle': 'కాపీరైట్ ఇబ్బంది లేదు.',
  'lib.legal': 'ఇక్కడ ఇవ్వబడినవన్నీ పూర్తిగా ఉచితమే, వాటిని మీరు ఇతరులకు పంచుకోవచ్చు. ఇంకా కాపీరైట్‌లో ఉన్న పుస్తకం ఇక్కడ లేదు — దానిని కాపీ చేయడం అనుమతి లేదు, దాన్ని స్పష్టంగా చెప్పడమే సరైనది.',
  'ask.signInTitle': 'ముందుగా సైన్ ఇన్ చేయండి',
  'ask.signInBody': 'ప్రశ్నించడానికి ఖాతా సృష్టించండి. ఒక నిమిషంలోపు తక్కువ సమయమే, తర్వాత మీరు ప్రశ్నలు అడగవచ్చు.',
  'ask.signInCta': 'ఖాతా సృష్టించండి లేదా సైన్ ఇన్ చేయండి',
  'ask.signInFirst': 'ముందుగా సైన్ ఇన్ చేయండి, తర్వాత ప్రశ్న అడగండి.',
  'ask.signInOr': 'ఇప్పుడు ఖాతా సృష్టించలేకపోతున్నారా? ఇవి ఖాతా లేకుండానే పనిచేస్తాయి:',
  'account.title': 'నా ఖాతా',
  'account.intro': 'మీ పేరు మరియు పాస్‌వర్డ్‌తో సైన్ ఇన్ చేయండి.',
  'account.signIn': 'సైన్ ఇన్',
  'account.register': 'ఖాతా సృష్టించండి',
  'account.signInNote': 'మునుగటి సారి ఉపయోగించిన పేరు, పాస్‌వర్డ్ ఇవ్వండి.',
  'account.registerNote': 'ప్రశ్నించడానికి ఖాతా అవసరం లేదు. ఇది మీ భాష, సమాధానాలను గుర్తుంచుకోవడానికి మాత్రమే.',
  'account.handle': 'మీ పేరు',
  'account.handlePlaceholder': 'ఉదా. sita.ji',
  'account.password': 'పాస్‌వర్డ్',
  'account.passwordHint': 'కనీసం ఆరు అక్షరాలు.',
  'account.phone': 'ఫోన్ నంబర్',
  'account.optional': 'అవసరం లేదు',
  'account.phoneHint': 'ఇవ్వాలనుకుంటే ఇవ్వండి. లేకుండానూ ఖాతా అవుతుంది.',
  'account.create': 'ఖాతా సృష్టించండి',
  'account.logout': 'బయటకు వెళ్లండి',
  'account.open': 'ఖాతా తెరవండి',
  'account.signedInAs': 'మీరు సైన్ ఇన్ అయ్యారు',
  'account.signedOut': 'సైన్ ఇన్ కాలేదు',
  'account.signedOutBody': 'ఈ బ్రౌజర్‌లో ఏ ఖాతా తెరవబడలేదు.',
  'account.saved': 'సేవ్ చేసిన సమాధానాలు',
  'account.savedEmpty': 'ఇంకా ఏదీ సేవ్ కాలేదు. సమాధానంలో \'సేవ్\' నొక్కండి.',
  'account.savedUnavailable': 'సేవ్ చేసిన సమాధానాలు ఇప్పుడు కనిపించడం లేదు. మిగిలినవి అన్నీ పనిచేస్తున్నాయి.',
  'account.wait': 'దయచేసి వేచి ఉండండి…',
  'account.privacyTitle': 'మీ సమాచారం',
  'account.privacyBody': 'ఖాతాలో మీ పేరు, పాస్‌వర్డ్, భాష మాత్రమే ఉంటాయి. మీరు ఏమి అడిగారో నమోదు కాదు. మీ ప్రశ్నలు ఎవరికీ పంపబడవు.',
  'account.errWrong': 'పేరు లేదా పాస్‌వర్డ్ తప్పు.',
  'account.errTaken': 'ఆ పేరు తీసేశారు. వేరే పేరు ఎంచుకోండి.',
  'account.errBad': 'దయచేసి సరిగ్గా నమోదు చేయండి.',
  'account.errWait': 'చాలా ప్రయత్నాలు జరిగాయి. కొద్దికాలం తర్వాత మళ్ళీ ప్రయత్నించండి.',
  'account.errTryLater': 'ఇప్పుడు కావలేదు. కొద్దికాలం తర్వాత మళ్ళీ ప్రయత్నించండి.',
  'lib.licence.ccBy': 'మీరు కాపీ చేసి, పంచుకోవచ్చు, ముద్రించవచ్చు — మూలాన్ని పేర్కొనాలి.',
  'lib.licence.ccBySa': 'కాపీ చేసి ముద్రించవచ్చు. చేసిన మార్పులను కూడా తెరిచి పంచాలి.',
  'lib.licence.ccZero': 'పూర్తిగా ఉచితం. మూలాన్ని పేర్కొనాల్సిన అవసరం లేదు.',
  'lib.licence.pd': 'దీనికి కాపీరైట్ లేదు — ఇష్టమేను కాపీ చేయవచ్చు.',
  'lib.licence.govtIndia': 'భారత ప్రభుత్వ వెబ్‌సైట్‌లో. చదవడం, ముద్రించడం రెండూ ఉచితం.',
  'lib.licence.creativeCommons': 'ప్రతి ఫైల్‌కు దాని లైసెన్స్ ఉంది — ఫైల్ చూడండి.',
  'lib.licence.freeToRead': 'చదవడం ఉచితం. ఇతరులకు ఇవ్వడం దాని పొందిన షరతుల్లోనే సాధ్యం.',
  'lib.openBadge': 'తెరిచిన',
  'lib.openBadgeNote': 'కాపీ చేయొచ్చు',
  'lib.freeBadge': 'ఉచితం',
  'lib.freeBadgeNote': 'చదవొచ్చు, కాపీ చేయలేరు',
  'lib.govt': 'ప్రభుత్వం',
  'lib.noSignup': 'ఖాతా అవసరం లేదు',
  'lib.open': 'ఇక్కడ తెరవండి',
  'lib.group.padhai': 'పాఠ్యపుస్తకాలు',
  'lib.group.padhai.note': 'పాఠ్యపుత్రాలు, కాలేజీ, ప్రభుత్వ విద్యా సామగ్రి',
  'lib.group.kitab': 'పుస్తకాలు',
  'lib.group.kitab.note': 'కాపీరైట్ లేనివి లేదా కాపీ చేయడానికి అనుమతి ఉన్నవి',
  'lib.group.tasveer': 'చిత్రాలు',
  'lib.group.tasveer.note': 'మ్యాప్స్, ఫోటోలు — అన్నీ',
  'lib.group.audio': 'వినడానికి',
  'lib.group.audio.note': 'పుస్తకాలు ఆడియోలో, చిన్న అక్షరాలు చదవకుండా',
  'lib.warnTitle': 'ప్రతి పుస్తకం ఇక్కడ లేదు',
  'lib.warn': 'కొన్ని పుస్తకాలు ఇంకా కాపీరైట్‌లో ఉన్నాయి, కాబట్టి చట్టం ప్రకారం ఉచితంగా ఇవ్వలేం. అవి ఉద్దేశించి చూపించలేదు. పుస్తకం కావాలంటే కింద అడగండి — చెప్పగలిగినది చెప్పబడుతుంది.',
  'lib.askInstead': 'అడగండి',
  'nav.library': 'గ్రంథాలయం',

  'help.title': 'మీ సమస్యను రాయండి',

  'help.intro': 'కింద రాయండి లేదా మాట్లాడండి. తెలియకపోతే మనసులో వచ్చినట్టు రాయండి — ఇదే అత్యంత ముఖ్యం.',

  'help.howTitle': 'ఈ సేవ ఎలా పనిచేస్తుంది',

  'help.howBody': 'ప్రతి ప్రశ్న నమోదు అవుతుంది, దానికి సమాధానం వెంటనే అందుబాటులో ఉంటుంది. మీ పేరు, చిరునామా ఫోన్ నంబర్ ఎక్కడా తీసుకోవడం జరగదు. అన్నీ ఉచితం.',

  'help.suggested': 'సాధారణ ప్రశ్నలు',

  'help.q1.label': 'విద్యుత్తు పోయింది, ఏమి చేయాలి?',

  'help.q1.question': 'ఇంట్లో విద్యుత్తు పోయింది. ఏమి చేయాలి, మరియు మొబైల్ ఫోన్ ఎలా చార్జ్ చేయాలి?',

  'help.q2.label': 'పిల్లల విద్యలో బలహీనత',

  'help.q2.question': 'నా కొడుకు చదువులో చాలా బలహీనత ఉంది. ఇంట్లో ఎలా మెరుగుపరచాలి?',

  'help.q3.label': 'వృద్ధుల చికిత్స',

  'help.q3.question': 'నా తండ్రి వయస్సు చాలా ఎక్కువ, వారికి చికిత్స ఎలా చేయాలి?',

  'help.q4.label': 'ఇంట్లో అగ్ని ప్రారంభమైతే',

  'help.q4.question': 'రాత్రి ఇంట్లో అగ్ని ప్రారంభమైతే మొదట ఏమి చేయాలి?',

  'home.stepLabel': 'దశ',

  'home.step1Title': 'మీ మాట రాయండి లేదా మాట్లాడండి',

  'home.step1Body': 'తెలుగులో టైప్ చేయండి, లేదా మైక్ నొక్కి మాట్లాడండి. ప్రత్యేకంగా ఏమీ చేయాల్సిన అవసరం లేదు — మనసులో ఉన్నది రాయండి.',

  'home.step2Title': 'వెంటనే సమాధానం',

  'home.step2Body': 'ప్రతి ప్రశ్న నమోదు అవుతుంది, దానికి సమాధానం వెంటనే అందుబాటులో ఉంటుంది. చాలా పెద్ద ప్రశ్నకు ముందు చిన్న ప్రశ్నతో మొదలైపెట్టండి.',

  'home.step3Title': 'డబ్బు లేదు, వ్యక్తిగత సమాచారం లేదు',

  'home.step3Body': 'ఈ సేవ పూర్తిగా ఉచితం. మీ పేరు, చిరునామా లేదా ఫోన్ నంబర్ అడగబడదు, ప్రచారం కూడా చూపబడదు.',

  'home.memorialEyebrow': 'ఈ సైట్ ఎవరికి',
  'home.memorialLine': 'తన జీవితమంతా సమాజం కోసం పోరాడినవారు, కానీ చివరకు తమ వాటి వాటాన్ని అందుకోలేదు.',
  'home.memorialMore': 'ఆమె పూర్తి కథను చదవండి',
  'home.kundaliTitle': 'జన్మ గంఠ',
  'home.kundaliNote': 'పూర్తి కుండలి — తొమ్మిది గ్రహాలు, విమశోత్తరి దశ, ఫలాదేశ, యోగ, షోడశవర్గ, కెపి, లాల్ కితాబ్ మరియు అంక జ్యోతిషం. అన్నీ మీ ఫోన్‌లోనే లెక్క అవుతాయి.',
  'home.chooseTopicNote': 'కింద ఉన్న అంశాన్ని నొక్కండి. ప్రతి చోట అర్థమయ్యే భాషలో సమాచారం ఇవ్వబడింది.',

  'home.categoryEmpty': 'ఈ అంశంలో ఇంకా ఏమీ రాయలేదు.',

  'home.soundIntro': 'ఫీజు లేదు, ప్రచారం లేదు. మనసు ప్రశాంతం చేయడానికి మాత్రమే.',

  'home.dedication1': 'స్మరణలో — పూర్తిగా ఉచిత సేవ.',

  'home.dedication2': 'మీ సమస్యను రాయండి లేదా మాట్లాడండి.',

  'ref.title': 'ఈ సేవ ఏమిటి, ఎవరికోస్తు',

  'ref.intro': 'ఈ సేవ శ్రీమతి VARSHA గుర్తులో రూపొందించబడింది. ఇది ఏమి చేస్తుంది, దీనిలో ఏమి ఉంది, దీని పరిమితులు ఏమిటో సరళంగా చెప్పబడింది. అన్నీ పూర్తిగా ఉచితం — డబ్బు తీసుకోవడం లేదు, ప్రచారం చూపించడం లేదు, వ్యక్తిగత సమాచారం అడగడం లేదు.',

  'ref.whatTitle': 'దీనిలో ఏమి ఉంది',

  'ref.what1': 'ఇంట్లో అగ్ని, విద్యుత్తు పోవడం, పిల్లల విద్యలో బలహీనత, తల్లిదండ్రుల సంరక్షణ — ఇలాంటి సాధారణ సమస్యలకు సులభమైన పరిష్కారాలు, స్పష్టంగా.',

  'ref.what2': 'ప్రశ్నను మాట్లాడి అడిగే సౌలభ్యం. మాట్లాడలేకపోతే రాయండి — రెండింటికీ సమాధానం ఒకేలా వస్తుంది.',

  'ref.what3': 'ప్రతి ప్రశ్న నమోదు అవుతుంది, కాబట్టి ఇతరులను బాధించే విషయం మీకు ముందే అడిగబడి ఉంటుంది, దానికి సమాధానం అందుబాటులో ఉంటుంది.',

  'ref.what4': 'ప్రచారం లేదు, అనవసర సమాచారం లేదు, వ్యక్తిగత సమాచారం అడగడం లేదు. అన్నీ ఉచితం.',

  'ref.statsArticles': 'వ్యాసాలు రాయబడ్డాయి',

  'ref.statsCategories': 'అంశాలు అందుబాటులో ఉన్నాయి',

  'ref.statsQuestions': 'ప్రశ్నలు అడిగారు',

  'ref.adminTitle': 'నిర్వహణ సిబ్బంది ఏమి చేయగలరు',

  'ref.adminBody': 'మీరు పంపిన వ్యాసాలను నిర్వహణ సిబ్బంది చూడగలరు, వాటికి సమాధానం రాయగలరు. మీ అనుమతి లేకుండా వారు ఏ వ్యాసాన్నీ మార్చలేరు, తొలగించలేరు, మీ సమాచారాన్ని ఎవరికీ అమ్మలేరు.',

  'ref.dataTitle': 'మీ గురించి మేము ఏమి భద్రపరుస్తాము',

  'ref.dataBody': 'మీరు అడిగిన ప్రశ్న, దాని సారాంశం, అడిగిన సమయం మాత్రమే — అదే సమాధానం పదేపదే ఇవ్వకుండా. మీ పేరు, చిరునామా, ఫోన్ నంబర్ లేదా గుర్తించే సమాచారం ఏదీ తీసుకోవడం జరగదు. సైట్‌లో ప్రచారం లేదా ట్రాకింగ్ స్క్రిప్ట్ లేదు.',

  'ref.helplineTitle': 'అత్యవసర సహాయానికి ఈ నంబర్లను భద్రపరచండి',

  'ref.helpline1': 'పెద్ద ప్రమాదం అయితే — అగ్ని, విద్యుత్ షాక్, పడిపోవడం లేదా అధిక రక్తస్రావం — 112కు కాల్ చేయండి.',

  'ref.helpline2': 'ఎవరికి అనారోగ్యం లేదా గాయం అయి, వెళ్ళే వాహనం లేకపోతే 108కు అంబులెన్స్ అడగండి.',

  'ref.helpline3': 'మహిళతో ఏదైనా చెడు జరిగితే, లేదా ఒక మహిళ ఎక్కడైనా బాధించబడితే, 181కు కాల్ చేయండి. ఇది ఉచితం.',

  'ref.helpline4': 'పిల్ల లేదా వృద్ధునికి ఏదైనా అన్యాయం జరిగితే, 1098కు ఫిర్యాదు చేయొచ్చు.',

  'ref.helpline5': 'మానసిక ఒత్తిడి చాలా ఎక్కువైతే, లేదా బ్రతకాలనిపించకపోతే, 14416లో మాట్లాడొచ్చు. మాట్లాడటానికి మాత్రమే.',

  'ref.ownerNote': 'ఈ సేవ ఏ సంస్థకూ కాదు, ప్రభుత్వానికీ కాదు; ఒక వ్యక్తి గుర్తులో నడపబడుతోంది. అందుకే ఇక్కడ ప్రచారం లేదు, సభ్యత్వం లేదు, డబ్బు తీసుకోవడం లేదు.',

  'support.title': 'ఈ సేవ ఉచితం',

  'support.intro': 'ఈ సేవ ఎవరి నుండీ డబ్బు తీసుకోదు. కానీ అది నడుస్తుంది — కాబట్టి కొన్ని మార్గాలు ఉన్నాయి, వాటిలో మీరు సహాయం చేయగలరు. సరళమైన మార్గమే అత్యధిక ఉపయోగపడుతుంది.',

  'support.contactTitle': 'ఏదైనా చెప్పాలా?',

  'support.contactBody': 'ఏ విషయమైనా ఇక్కడ రాయగలరు — ఏదైనా తప్పు ఉంటే, ఎక్కువ దొరికితే, లేదా ఏదైనా ప్రశ్న ఉంటే. రాయడం సులభంగా అనిపిస్తే అంతే రాయండి.',

  'support.faqTitle': 'తరచుగా అడిగే కొన్ని విషయాలు',

  'support.faqBody': 'ఇది నిజంగా ఉచితమా? అవును. మీ పేరు తీసుకుంటారా? కాదు, పేరు ఇవ్వడం అవసరం లేదు. ప్రచారం వస్తాయా? కాదు. ఫోన్ నంబర్ లేదా చిరునామా అడుగుతారా? కాదు. ఏ యాప్ డౌన్‌లోడ్ చేయాలా? కాదు, బ్రౌజర్‌లోనే తెరుచుకుంటుంది.',

  'support.waysTitle': 'మీరు ఎలా సహాయం చేయగలరు',

  'support.way1Title': 'మీ అనుభవం రాయండి',

  'support.way1Body': 'ఈ సైట్ నుండి మీకు ఏదైనా మంచిదిగా అనిపితే — లేదా మీకు గందరగోళం కలిగించిన ఏదైనా దొరికితే — అప్పుడు అభిప్రాయ పేజీలో రాయండి. మీ పేరు తీసుకోవడం అవసరం లేదు.',

  'support.way2Title': 'మీ నగరం గురించి చెప్పండి',

  'support.way2Body': 'మీరు నివసించే చోటి భాష, సంప్రదాయాలు, ఇబ్బందులు వేర్వేరుగా ఉంటాయి. మీ ఇక్కడ ఏదైనా ఇక్కడ లేకపోతే చెప్పండి — చేర్చవచ్చినది చేరుస్తారు.',

  'support.way3Title': 'మీ అనుభవం వారికి చెప్పండి',

  'support.way3Body': 'ఇక్కడ రాసినది చాలా మందికి ఉపయోగపడగలదు, వారికి తెలిస్తే. ఇది నిజంగా సహాయం పొందే వ్యక్తికి చెప్పండి.',

  'support.way4Title': 'ఇక్కడకు వచ్చి చూడండి',

  'support.way4Body': 'మీ వద్ద సమయం ఉంటే, ఈ సైట్ సరిగ్గా పనిచేస్తోందోనేది మీరే వచ్చి చూడండి. ఏదైనా తప్పుగా కనిపిస్తే చెప్పండి — పూర్తిగా ఉచితంగా సరిచేసేయబడుతుంది.',

  'reviews.pageTitle': 'మీ అభిప్రాయం',

  'reviews.pageIntro': 'ఇక్కడ వ్యక్తులు రాసినదే రాసబడింది. ఏ అభిప్రాయం కూడా దాచి ఉంచబడదు, రాసినది ఇక్కడే కనిపిస్తుంది — ఒకసారి చూసిన తర్వాత ప్రచురిస్తారు.',

  'reviews.intro': 'ఈ సేవ మీకు ఉపయోగపడిందా? మీ మాట రాయండి — మీ పేరు తీసుకోవడం అవసరం లేదు.',

  'reviews.write': 'మీ అభిప్రాయం రాయండి',

  'reviews.starsLabel': '5లో {value} నక్షత్రాలు',

  'reviews.summaryTitle': 'సాధారణ అభిప్రాయం',

  'reviews.summaryLine': 'వ్యక్తులు సగటున {rating}లో 5లో {count} నక్షత్రాలు ఇచ్చారు.',

  'reviews.count': 'సమీక్షలు',

  'reviews.name': 'మీ పేరు (అవసరం లేదు)',

  'reviews.city': 'మీ నగరం (అవసరం లేదు)',

  'reviews.placeholder': 'మనసులో వచ్చినదే రాయండి — ఏదీ సరిచేయాల్సి అవసరం లేదు.',

  'reviews.keepLabel': 'చెడ్డదైనా, మంచిదైనా — రెండూ రాయండి',

  'reviews.fieldTooShort': 'కనీసం 10 అక్షరాలు రాయండి.',

  'reviews.rateLimited': 'చాలా వేగంగా పంపుతున్నారు. కొద్ది సేపటి ఆగి మళ్ళీ ప్రయత్నించండి.',

  'reviews.sending': 'పంపుతున్నాము…',

  'reviews.moderated': 'మీ సమీక్ష ప్రచురించే ముందు ఒకసారి చూస్తారు.',

  'reviews.moderationNote': 'అన్నీ తొలగించకుండా, ప్రచురించే ముందు ప్రతి సమీక్షను ఒకసారి చూస్తారు. దూషణలు, నంబర్ లేదా వ్యక్తిగత విషయాలు తీసేస్తారు — మిగతా అన్నీ యథాతథంగా ప్రచురిస్తారు.',

  'reviews.replyLabel': 'దీనిపై రాయబడింది',

  'reviews.ownerReply': 'సమాధానం',

  'reviews.empty': 'ఇంకా ఏ సమీక్షా లేదు. మొదటిది మీరే రాయండి.',

  'reviews.anonymous': 'పేరు లేకుండా',

  'reviews.toastSent': 'ధన్యవాదాలు',

  'reviews.toastFailed': 'అభిప్రాయం పంపబడలేదు',

  'health.band.infant.note': 'పుట్టుక పిల్లలు, ఇంకా తమ మాట చెప్పలేని వారు',

  'health.band.child.note': 'మాట్లాడగల పిల్లలు, కానీ ప్రశ్నించడానికి భయపడే వారు',

  'health.band.teen.note': 'కౌమారులు, వారికి సాధారణంగా విని అవుకునే వ్యక్తి దొరకడం లేదు',

  'health.band.young.note': 'పని, డబ్బు, నిద్ర — మూడు ఒకేసారి భారం',

  'health.band.middle.note': 'ఇల్లు, పిల్లలు, మీ స్వంత ఆరోగ్యం — అన్నీ ఒకే బాధ్యత',

  'health.band.later.note': 'శరీర వయస్సు, దాని సంరక్షణ — రెండూ ఒకేసారి',

  'health.band.senior.note': 'మందులు, సమతుల్యత, ఒంటరితనం — మూడూ కలిపి',

  'health.band.elder.note': 'ప్రతి మందుల పరీక్ష అవసరం, ప్రతి పడిపోవడం తీవ్రం',

  'health.c.infant1': 'తీవ్ర జ్వరం',

  'health.c.infant2': 'తినడం లేదు',

  'health.c.infant3': 'వాంతులు',

  'health.c.infant4': 'విరేచనాలు',

  'health.c.child1': 'చదువులో ఆసక్తి లేదు',

  'health.c.child2': 'బడికి వెళ్ళడం ఇష్టం లేదు',

  'health.c.child3': 'రాత్రి జ్వరం',

  'health.c.child4': 'పళ్ళు పడుతున్నాయి',

  'health.c.teen1': 'చదువు ఒత్తిడి',

  'health.c.teen2': 'నిద్ర రావడం లేదు',

  'health.c.teen3': 'మొబైల్ అలవాటు',

  'health.c.teen4': 'తీవ్ర దుఃఖం',

  'health.c.young1': 'పని ఒత్తిడి',

  'health.c.young2': 'కూర్చుని ఉంటే నొప్పి',

  'health.c.young3': 'నిద్ర రావడం లేదు',

  'health.c.young4': 'డబ్బు తక్కువ',

  'health.c.middle1': 'కమ్ము నొప్పి',

  'health.c.middle2': 'నిద్ర సరిగా రావడం లేదు',

  'health.c.middle3': 'ఇంటి ఒత్తిడి',

  'health.c.middle4': 'పేట్లో గ్యాస్',

  'health.c.later1': 'వెన్ను నొప్పి',

  'health.c.later2': 'మోకాళ్ల నొప్పి',

  'health.c.later3': 'రాత్రి కాలి కుంపులు',

  'health.c.later4': 'ఉదయం బిగుసుకుపోవడం',

  'health.c.senior1': 'నడక కష్టం',

  'health.c.senior2': 'మందుల తనిఖీ',

  'health.c.senior3': 'రాత్రి మూత్రం',

  'health.c.senior4': 'వినిపి తగ్గింది',

  'health.c.elder1': 'పడిపోయే భయం',

  'health.c.elder2': 'జ్ఞాపకశక్తి బలహీనం',

  'health.c.elder3': 'రోజూ నొప్పి మందులు',

  'health.c.elder4': 'వైద్యునికి ఎప్పుడు',

  'health.q.infant1': 'నా బిడ్డికి జ్వరం వచ్చింది, పాలు ఇవ్వాలా?',

  'health.q.infant2': 'చిన్న పిల్ల ఏమి తినడం లేదు, ఏమి చేయాలి?',

  'health.q.infant3': 'పిల్లకు వాంతులు అవుతున్నాయి, ఎప్పుడు వైద్యునికి చూపించాలి?',

  'health.q.infant4': 'పిల్లకు విరేచనాలు అవుతున్నాయి, ఏమి ఇవ్వాలి?',

  'health.q.child1': 'పిల్ల చదువులో మనసు పెట్టుకోవడం లేదు, ఏమి చేయాలి?',

  'health.q.child2': 'పిల్ల ప్రతిరోజూ బడికి వెళ్ళదని చెబుతున్నాడు, కారణమేమిటి?',

  'health.q.child3': 'పిల్లకు రాత్రి జ్వరం వస్తుంది, ఏమి చేయాలి?',

  'health.q.child4': 'పిల్ల పళ్ళు పడుతున్నాయి, పళ్ళ సంరక్షణ ఎలా చేయాలి?',

  'health.q.teen1': 'చదువుపై ఎక్కువ ఒత్తిడి ఉంది, దానిని ఎలా ఎదురుకోవాలి?',

  'health.q.teen2': 'రాత్రి నిద్ర సరిగా రావడం లేదు, ఏమి చేయాలి?',

  'health.q.teen3': 'మొబైల్ అలవాటు కలిగిపోయింది, వదిలే విధానం ఏమిటో చెప్పండి.',

  'health.q.teen4': 'తీవ్ర దుఃఖంగా ఉంది, ఎవరితో మాట్లాడాలి?',

  'health.q.young1': 'పని ఒత్తిడి చాలా ఎక్కువ, ఎలా తగ్గించాలి?',

  'health.q.young2': 'కూర్చుని ఉంటే వెన్ను నొప్పిస్తోంది, ఏమి చేయాలి?',

  'health.q.young3': 'రాత్రి నిద్ర రావడం లేదు, ఏమి చేయాలి?',

  'health.q.young4': 'డబ్బు తక్కువ, ఖర్చు ఎక్కువ, ఏమి చేయాలి?',

  'health.q.middle1': 'కమ్ములో నొప్పి అవుతోంది, కారణమేమిటి?',

  'health.q.middle2': 'నిద్ర సరిగా రావడం లేదు, మెరుగుపరచడానికి ఏమి చేయాలి?',

  'health.q.middle3': 'ఇంట్లో ఎక్కువ ఒత్తిడి, పిల్లలను ఎలా పరిశీలించాలి?',

  'health.q.middle4': 'పనిలో సంవత్సరాలుగా పేట్లో గ్యాస్ సమస్య, ఏమి చేయాలి?',

  'health.q.later1': 'నా వయస్సు 54, వెన్నులో నొప్పి ఉంది, ఏమి చేయాలి?',

  'health.q.later2': 'ఎక్కేటప్పుడు మోకాళ్ల నొప్పిస్తుంది, ఎందుకు?',

  'health.q.later3': 'రాత్రి పాదాల్లో కుంపులు వస్తాయి, ఏమి చేయాలి?',

  'health.q.later4': 'ఉదయం లేచినా కమ్ము బిగుసుకుపోతుంది, కారణమేమిటి?',

  'health.q.senior1': 'మోకాళ్లలో ఎంత నొప్పి ఉన్నందున నడక కష్టంగా ఉంది, ఏమి చేయాలి?',

  'health.q.senior2': 'చాలా మందులు రోజూ తినాల్సి ఉంటాయి — ఏది హానికరం అని ఎలా తెలుసుకోవాలి?',

  'health.q.senior3': 'రాత్రి అది మూత్రం అవుతోంది, ఏమి చేయాలి?',

  'health.q.senior4': 'వినడం తగ్గింది, వినేందుకు ఏదైనా ఉపాయం చెప్పండి.',

  'health.q.elder1': 'ఇంట్లో పడిపోయే భయం ఉంది, ఏ రక్షణ పెట్టాలి?',

  'health.q.elder2': 'జ్ఞాపకశక్తి బలహీనమవుతోంది, ఏమి చేయాలి?',

  'health.q.elder3': 'రోజూ నొప్పి మందులు తినాల్సి ఉంటుంది — దీనికి హాని ఉందా?',

  'health.q.elder4': 'ఎప్పుడు వైద్యునికి వెళ్ళడం అవసరం?',

  'support.contactMessageLabel': 'మీ మాట',

  'support.contactPlaceholder': 'రాయాలనుకున్నది అదే రాయండి — తప్పు ఉంటే, ఏదైనా మంచిదైతే, లేదా ప్రశ్న ఉంటే.',

  'support.contactHelp': 'కనీసం 10 అక్షరాలు. ఇది నేరుగా యజమానికి చేరుతుంది.',

  'support.contactSubmit': 'పంపండి',

  'support.contactSending': 'పంపుతున్నాము…',

  'support.contactPrivacy': 'మీ పేరు రాయడం అవసరం లేదు.',

  'support.contactSent': 'చేరింది',

  'support.contactSentBody': 'మీ మాట యజమానికి చేరింది.',

  'support.contactFailed': 'పంపలేకపోయాము',

  'support.faq1Q': 'ఇది నిజంగా ఉచితమా?',

  'support.faq1A': 'అవును. డబ్బు తీసుకోరు, ప్రచారం చూపరు, సభ్యత్వం తీసుకోరు. ఇది ఒక వ్యక్తి డబ్బుతో నడుస్తుంది, సంస్థ లేదా ప్రభుత్వ డబ్బుతో కాదు.',

  'support.faq2Q': 'నా పేరు, చిరునామా లేదా ఫోన్ నంబర్ తీసుకుంటారా?',

  'support.faq2A': 'కాదు, తీసుకోరు. ఈ సైట్ దానంతట తన గుర్తింపును సృష్టించదు — లాగిన్ లేదు, ట్రాకింగ్ స్క్రిప్ట్ లేదు. అడిగేది మీ ప్రశ్న మాత్రమే, అదే భద్రపరచబడుతుంది.',

  'support.faq3Q': 'ఇది వైద్యుడా లేదా న్యాయవాదియా?',

  'support.faq3A': 'కాదు. ఇది మందుల లేదా చట్ట సలహా ఇవ్వదు. విషయం తీవ్రంగా ఉన్న చోట ఇది వైద్యుని లేదా అధికారిని దగ్గరకు వెళ్ళమని చెబుతుంది — వారి స్థానాన్ని ఇది తీసుకోదు.',

  'support.faq4Q': 'ప్రతి సమాధానం సరైనదా?',

  'support.faq4A': 'ఎప్పుడూ కాదు. సమాధానం రాసేది కంప్యూటర్, వైద్యుడు కాదు — అందుకే ప్రతి సమాధానంతో ఇది వైద్య సలహా కాదని రాయబడింది. ఏ మందులైనా ప్రారంభించే ముందు లేదా ఆపే ముందు వైద్యుడిని కలవండి.',

  'support.faq5Q': 'ఏ యాప్ డౌన్‌లోడ్ చేయాలా?',

  'support.faq5A': 'కాదు. ఇది బ్రౌజర్‌లోనే తెరుచుకుంటుంది. యాప్ ఇన్‌స్టాల్ లేదు, అనుమతి లేదు, అప్‌డేట్ లేదు.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'ఇంటి చికిత్సలు',
  'remedy.title': 'ఆయుర్వేద ఇంటి చికిత్సలు',
  'remedy.intro': 'ఏ బాధ అయినా — దగ్గు, తలనొప్పి, కీళ్ల నొప్పులు, దురద, మధుమేహం, వెన్నునొప్పి — కింద మీ బాధను ఎంచుకోండి లేదా మీ మాటల్లో అడగండి. ఇంటి కషాయం, మసాజ్, ఆహారం, ఆయుర్వేద చికిత్సలు చెబుతారు.',
  'remedy.choose': 'మీ బాధను ఎంచుకోండి',
  'remedy.emergencyStrong': 'ఇవి అత్యవసర పరిస్థితులు:',
  'remedy.emergency': 'పాము కాటు, తేలు కుట్టు, కుక్క కాటు — వెంటనే ఆసుపత్రికి వెళ్లండి, ముందు 112కు కాల్ చేయండి. ఇంటి చికిత్సలు దారిలో మాత్రమే, ఆసుపత్రికి బదులు కాదు.',
  'remedy.note': 'ఇంటి మరియు ఆయుర్వేద చికిత్సలు బాధ తగ్గించడానికి సహాయపడతాయి; వైద్యుని పరీక్షకు, చికిత్సకు ప్రత్యామ్నాయం కావు. ఏ మందునూ మీరే మొదలుపెట్టకండి లేదా ఆపకండి.',
  'remedy.cough': 'దగ్గు',
  'remedy.headache': 'తలనొప్పి',
  'remedy.joints': 'కీళ్ల నొప్పులు',
  'remedy.itching': 'దురద',
  'remedy.snake': 'పాము కాటు',
  'remedy.scorpion': 'తేలు కుట్టు',
  'remedy.dog': 'కుక్క కాటు',
  'remedy.diabetes': 'మధుమేహం',
  'remedy.back': 'వెన్నునొప్పి',
  'remedy.walking': 'నడవడంలో ఇబ్బంది',
  'home.remedyNote': 'కషాయం, మసాజ్, ఆహారం, ఆయుర్వేద చికిత్సలు — ప్రతి బాధకు, మీ భాషలో.',
  'nav.aarti': 'హారతి మరియు భజన',
  'aarti.title': 'హారతి, భజన — నిజమైన గొంతుకలో',
  'aarti.intro': 'ఇక్కడ హారతి, కీర్తన, భజన వినండి — నిజమైన గాయకులు, ఆలయాల గొంతుకలో. AI గొంతు లేదు.',
  'aarti.note': 'హారతిని లేదా భజనను కంప్యూటర్ గొంతుతో వినిపిస్తే దాని లయ, భక్తి పోతాయి. అందుకే ఇక్కడ అన్నీ నిజమైన రికార్డింగ్‌లు.',
  'aarti.kindAarti': 'హారతి',
  'aarti.kindKirtan': 'కీర్తన',
  'aarti.kindBhajan': 'భజన',
  'aarti.credit': 'రికార్డింగ్:',
  'aarti.licence': 'లైసెన్స్:',
  'aarti.listenLink': 'నిజమైన గొంతుకలో వినండి',
  'aarti.textChecked': 'ఇది సాంప్రదాయ పాఠం, నిజమైన రికార్డింగ్‌లో పాడినట్లుగా.',
  'aarti.textPrinted': 'ఇది ప్రచురిత సంకలనాలతో పోల్చి ధృవీకరించిన సాంప్రదాయ పాఠం.',
  'aarti.textNotStored': 'ఈ గ్రంథం పూర్తి పాఠం ఇక్కడ నిల్వ చేయబడలేదు — క్రింది రికార్డింగ్‌లో పూర్తి పాఠం ఉంది.',
  'aarti.granthTitle': 'గ్రంథాలు, చాలీసాలు, స్తోత్రాలు — నిజమైన గొంతుకలో',
  'aarti.noRecording': 'ఈ హారతికి నిజమైన రికార్డింగ్ ఇంకా సైట్‌లో లేదు, కాబట్టి దాన్ని పాడి వినిపించలేను — ఏఐ స్వరంలో హారతి ఎప్పుడూ పాడబడదు.',
  'aarti.textOnlyTitle': 'మరిన్ని హారతులు — పాఠం మరియు నిజమైన స్వరం',
  'aarti.fullText': 'పూర్తి పాఠం',
  'aarti.notChecked': 'ఈ హారతి ధృవీకరించిన పాఠం ఇంకా సైట్‌లో లేదు. ధృవీకరించని పాఠం ఇవ్వబడదు, ఎందుకంటే ప్రార్థనలో తప్పు మాట మాటలు లేకపోవడం కంటే చెడ్డది.',
  'aarti.verifiedList': 'సైట్‌లో ఈ హారతులకు ధృవీకరించిన పాఠాలు ఉన్నాయి:',

};

const MARATHI: Record<string, string> = {
  'jgd.placeSearch': 'तुमच्या शहराचे नाव लिहा',
  'jgd.placeNoMatch': 'हे शहर या यादीत नाही. जवळचे शहर निवडा.',

  'account.name': 'तुमचे नाव',
  'account.namePlaceholder': 'उदा. सीता देवी',
  'account.nameHint': 'हे कळणून आपण कोण आहात. कोणताही नाव चालेल, आणि हे आवश्यक नाही.',

  'nav.home': 'मुख्यपृष्ठ', 'home.metaTitle': 'मोफत उपाय, तुमच्या स्वतःच्या शब्दांत', 'nav.tribute': 'स्मृती', 'nav.help': 'मदत', 'nav.reference': 'माहिती',
  'lib.licence.ccZero.name': 'CC0 / पब्लिक डोमेन',
  'lib.licence.pd.name': 'पब्लिक डोमेन',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिव्ह कॉमन्स (मिश्रित)',
  'lib.licence.freeToRead.name': 'वाचण्यासाठी मोफत',
  'lib.entry.ncert.title': 'NCERT पुस्तके — इयत्ता 1 ते 12',
  'lib.entry.ncert.what': 'प्रत्येक विषयाची सर्व पुस्तके, प्रत्येक इयत्तेसाठी. लॉगिनशिवाय, थेट PDF.',
  'lib.entry.ncert.langs': 'हिंदी, इंग्रजी आणि ३० पेक्षा जास्त भारतीय भाषा',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल धडपद्यपुस्तके',
  'lib.entry.pm-evidya.what': 'NCERT पुस्तकांचे ऍप, मोठ्या अक्षरांत वाचता येते. बोलूनही ऐकता येते.',
  'lib.entry.pm-evidya.langs': 'भारतीय भाषा',
  'lib.entry.diksha.title': 'DIKSHA — शिक्षक आणि मुलांसाठी',
  'lib.entry.diksha.what': 'धडे, व्हिडिओ आणि सराव — इयत्ता 1 ते 12.',
  'lib.entry.diksha.langs': 'भारतीय भाषा',
  'lib.entry.khan-academy.title': 'Khan Academy — इंग्रजीत गणित आणि विज्ञान',
  'lib.entry.khan-academy.what': 'प्रत्येक इयत्तेपर्यंत व्हिडिओ धडे, लिखित मजकूरही आहे.',
  'lib.entry.openstax.title': 'OpenStax — इंग्रजीत मोफत पुस्तके',
  'lib.entry.openstax.what': 'महाविद्यालय स्तराची पुस्तके — गणित, विज्ञान, मानवशास्त्र. प्रत्येक पानावर PDF.',
  'lib.entry.nios.title': 'NIOS — दूरशिक्षण, मोफत साहित्य',
  'lib.entry.nios.what': 'ओपन आणि ऑनलाइन कोर्ससाठी मोफत पुस्तिका, दाखिल्याशिवाय.',
  'lib.entry.nios.langs': 'हिंदी, इंग्रजी आणि इतर',
  'lib.entry.ignou.title': 'IGNOU — उच्च शिक्षेसाठी मोफत पुस्तके',
  'lib.entry.ignou.what': 'दूरशिक्षणाची पुस्तके, पूर्णपणे मोफत.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — इंग्रजीची जुनी पुस्तके',
  'lib.entry.gutenberg.what': '70,000 पेक्षा जास्त पुस्तके, सर्वांचा कॉपीराइट संपला. मोफत ई-बुक आणि ऑडियो.',
  'lib.entry.pratham-books.title': 'Pratham Books — मुलांची पुस्तके',
  'lib.entry.pratham-books.what': 'भारतीय भाषांत मुलांची पुस्तके, पूर्णपणे मोफत. इयत्ता 1 ते 5 साठी.',
  'lib.entry.pratham-books.langs': 'हिंदी, मराठी, बंगाली, तमिळ, तेलुगू आणि इतर',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — वृत्तपत्रे आणि जुनी नियतकालिके',
  'lib.entry.internet-archive-texts.what': 'लाखो जुनी पुस्तके, नियतकालिके आणि वृत्तपत्रे — मोफत.',
  'lib.entry.wikisource.title': 'Wikisource — मोफत सार्वजनिक मजकूर',
  'lib.entry.wikisource.what': 'कॉपीराइट नाही — ही जगभरातील जुनी साहित्यिक पुस्तकें आहेत.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — प्रत्येक प्रकारचे चित्र',
  'lib.entry.wikimedia-commons.what': 'प्राणी, नकाशे, तारे, इतिहास — सर्व काही. प्रत्येक चित्राला स्वतंत्र परवाना आहे.',
  'lib.entry.pixabay.title': 'Pixabay — छानचित्रे आणि आलेख',
  'lib.entry.pixabay.what': 'छानचित्रे, रेषाचित्रे आणि छोट्या व्हिडिओ.',
  'lib.entry.unsplash.title': 'Unsplash — सुंदर छानचित्रे',
  'lib.entry.unsplash.what': 'मोफत, मोठ्या आकारात, खात्याशिवाय.',
  'lib.entry.openverse.title': 'Openverse — सर्व मोफत चित्रे एका ठिकाणी',
  'lib.entry.openverse.what': 'एकाच वेळी अनेक मोफत चित्र साइट शोधा.',
  'lib.entry.librivox.title': 'LibriVox — ऐकतायेणाऱ्या पुस्तके',
  'lib.entry.librivox.what': 'जुन्या इंग्रजी पुस्तकांचे मोफत ऑडियो, माणसांच्या आवाजात.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ऑडियो संग्रह',
  'lib.entry.internet-archive-audio.what': 'हजारो मोफत रेकॉर्डिंग — पुस्तके, भाषणे, संगीत.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राष्ट्रगीत आणि इतर गाणी',
  'lib.entry.vande-mataram.what': 'भारताचे राष्ट्रगीत आणि इतर राष्ट्रीय गाणी, मोफत.',
  'art.aag-aur-bijli-ke-bachav.title': 'आणी आणि वीज वाचण्याचे नियम',
  'art.aag-aur-bijli-ke-bachav.summary': 'घरात आग लागण्यापासून प्रतिबंध — सोपे नियम',
  'art.aag-lagne-par-kya-karein.title': 'आग लागली तर काय करावे',
  'art.aag-lagne-par-kya-karein.summary': 'जागणाऱ्या घरात आग — प्रथम काय करावे, काय न करावे',
  'art.bimari-se-bachav.title': 'संसर्गापासून वाचण्याचे सात नियम',
  'art.bimari-se-bachav.summary': 'हात धुणे, मास्क, लसीकरण — कसे सुरक्षित राहावे',
  'art.dhuwan-ka-jhakora.title': 'धुरामुळे दम घुटण्यापासून रक्षण',
  'art.dhuwan-ka-jhakora.summary': 'दम घुटतोय, श्वास येत नाही — काय करावे, कधी रुग्णालयात जावे',
  'art.doodh-pani-band-ho.title': 'वीज किंवा पाणी अचानक बंद झाले तर',
  'art.doodh-pani-band-ho.summary': 'काय करावे, कशापासून टाळावे, कधी मदत मागावी',
  'art.haath-ki-saafai.title': 'साबण नसताना हात स्वच्छ करण्याची पद्धत',
  'art.haath-ki-saafai.summary': 'पाणी किंवा साबण नसताना',
  'cat.dhyan-aur-yoog.title': 'ध्यान आणि योग',
  'cat.dhyan-aur-yoog.subtitle': 'मन शांत करण्याची सोपी पद्धत',
  'cat.gharelu-marammat.title': 'घरगुती दुरुस्ती',
  'cat.gharelu-marammat.subtitle': 'घरातील छोट्या समस्यांचे उपाय',
  'cat.bachchon-ki-padhai.title': 'मुलांचा अभ्यास',
  'cat.bachchon-ki-padhai.subtitle': 'अभ्यासात लागले, काळजीत',
  'cat.budharge-seva.title': 'वयोवृद्धांची सेवा',
  'cat.budharge-seva.subtitle': 'काळजी आणि मदत',
  'cat.shishu-dekhbhal.title': 'शिशु देखभाल',
  'cat.shishu-dekhbhal.subtitle': 'लहान मुलाची योग्य देखभाल',
  'cat.dharmik-upay.title': 'धार्मिक उपाय',
  'cat.dharmik-upay.subtitle': 'मनाच्या शांतीसह',
  'cat.pavan-grah-aur-aarti.title': 'पवित्र ग्रंथ व आरती',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धेने वाचा आणि ऐका',
  'cat.aapatkalen-gayide.title': 'आपत्तकालीन मार्गदर्शक',
  'cat.aapatkalen-gayide.subtitle': 'लगेच मदत पाहिजे असताना',
  'cat.mahamari-suraksha.title': 'महामारी संरक्षण',
  'cat.mahamari-suraksha.subtitle': 'आजार पसरण्यापासून रक्षण',
  'nav.reviews': 'अभिप्राय', 'nav.support': 'मदत करा', 'nav.menu': 'मेनू',
  'nav.birthChart': 'जन्म पत्रिका',
  'jgd.title': 'तुमची जन्मपत्रिका',
  'jgd.intro': 'तुमचे नाव, जन्मतारीख, आणि माहीत असल्यास वेळ व ठिकाण. सर्व गणना तुमच्या फोनवरच होते — कुठेही पाठवले जात नाही.',
  'jgd.nameLabel': 'जन्माचे नाव',
  'jgd.namePlaceholder': 'उदा. पूर्ण नाव',
  'jgd.nameHint': 'लहानपणात दिलेले नाव.',
  'jgd.dateLabel': 'जन्मतारीख',
  'jgd.timeLabel': 'जन्माची वेळ',
  'jgd.timeHint': 'माहीत नसेल्यास रिकामे ठेवा.',
  'jgd.placeLabel': 'जन्मस्थान',
  'jgd.placeNone': 'माहीत नाही / निवडा',
  'jgd.placeHint': 'जन्माचे शहर निवडा.',
  'jgd.submit': 'गणना करा',
  'jgd.savePdf': 'PDF तयार करा',
  'jgd.again': 'पुन्हा गणना करा',
  'jgd.errDate': 'कृपया जन्मतारीख योग्य लिहा.',
  'jgd.errPlace': 'यादीतून तुमचे शहर निवडा, किंवा जवळचे शहर निवडा.',
  'jgd.numTitle': 'अंक ज्योतिष',
  'jgd.lifePath': 'जीवनमार्ग',
  'jgd.nameNumber': 'नाम अंक',
  'jgd.soulNumber': 'आत्मा अंक',
  'jgd.birthdayNumber': 'जन्मदिन अंक',
  'jgd.astroTitle': 'वैदिक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'पद',
  'jgd.rashi': 'राशि',
  'jgd.rashiLord': 'राशीचे स्वामी',
  'jgd.nakshatraLord': 'नक्षत्राचे स्वामी',
  'jgd.lagna': 'लग्न',
  'jgd.lagnaMissing': 'लग्नासाठी जन्माची वेळ व ठिकाण लागते. वर भरून पुन्हा गणना करा — माहीत नसेल्यास इतकेही पुरेसे.',
  'jgd.gunTitle': 'गुण मिलन',
  'jgd.gunIntro': 'दुसऱ्या व्यक्तीचे नाव व जन्मतारीख भरा.',
  'jgd.gunName': 'त्याचे नाव',
  'jgd.gunDate': 'त्याची जन्मतारीख',
  'jgd.gunHint': 'दोन्ही नावे व तारीखा असल्यास गुण मिलन निघे.',
  'jgd.disclaimer': 'हे पारंपरिक पद्धतीने केलेली गणना आहे, भविष्यवाणी नाही. कोणताही संख्या किंवा राशी कोणाचे आरोग्य, पैसा किंवा नाते ठरवत नाही. मोठ्या निर्णयासाठी डॉक्टर, वकील किंवा अनुभवी माणसाचा सल्ला घ्या.',
  'nav.openMenu': 'मेनू उघडा', 'nav.closeMenu': 'मेनू बंद करा', 'nav.language': 'भाषा बदला',
  'nav.expand': 'बाँस उघडा', 'nav.collapse': 'बाँस बंद करा', 'nav.skip': 'थेट मजकुराकडे जा',
  'ask.label': 'तुमची समस्या लिहा किंवा बोला', 'ask.placeholder': 'उदा.: मुलाचा अभ्यासात कमतरता आहे',
  'ask.help': 'एंटर दाबूनही पाठवता येईल.', 'ask.send': 'विचारा', 'ask.sending': 'विचार करत आहे…',
  'ask.clear': 'लिहिलेला पुसा', 'ask.speak': 'बोलून विचारा', 'ask.listening': 'बोलायला सुरुवात करा…',
  'ask.heard': 'ऐकत आहे', 'ask.stopListening': 'ऐकणे थांबवा', 'ask.suggested': 'नेहमीचे प्रश्न',
  'ask.answerTitle': 'उत्तर', 'ask.listen': 'ऐका', 'ask.stopSpeak': 'थांबवा',
  'ask.aiNote': 'हे उत्तर AI ने दिले आहे. तज्ज्ञांच्या सल्ल्याला पर्याय नाही.',
  'sound.title': 'शांततेसाठी ध्वनी', 'sound.intro': 'शुल्क नाही, जाहिरात नाही.',
  'sound.shankh': 'शंख', 'sound.bansuri': 'बांसुरी', 'sound.dhol': 'ढोल', 'sound.all': 'तीनही',
  'dhun.welcome': 'स्वागत आहे', 'dhun.prompt': 'शंख, बांसुरी आणि ढोल एकत्र ऐकण्यास स्पर्श करा.',
  'dhun.listen': 'ऐका', 'dhun.skip': 'वगळा',
  'home.emergencyTitle': 'अत्यंत महत्त्वाचे — आत्ता मदत हवी', 'home.emergencyNote': 'हे आधी वाचा. बाकी नंतर.',
  'home.readMore': 'संपूर्ण माहिती वाचा', 'home.chooseTopic': 'कोणत्या विषयाबद्दल जाणून घ्यायचे?',
  'home.askHere': 'या विषयाबद्दल विचारा', 'home.howTitle': 'ही सेवा कशी चालते',
  'home.soundTitle': 'शांततेसाठी ध्वनी', 'home.freeTitle': 'ही सेवा पूर्णपणे निःशुल्क आहे',
  'home.freeBody': 'पैसे घेत नाहीत, वैयक्तिक माहिती विचारत नाहीत, जाहिरात दाखवत नाहीत.',
  'footer.pages': 'पाने', 'footer.helplines': 'महत्त्वाचे क्रमांक', 'footer.readStory': 'त्यांची संपूर्ण कथा वाचा',
  'reviews.title': 'तुमची राय, तुमचे म्हणणे', 'reviews.submit': 'पाठवा', 'reviews.comment': 'तुमचे म्हणणे',
  'language.choose': 'तुमची भाषा निवडा', 'language.articlesIn': 'हा लेख हिंदीत आहे.',

  'ask.welcome': 'स्वागत आहे! खाली तुमची समस्या लिहा किंवा एक विषय निवडा.',

  'ref.notTitle': 'ही काय करत नाही',

  'ref.not1': 'ही डॉक्टर नाही. औषधाचा सल्ला कधीही दिला जात नाही.',

  'ref.not2': 'ही वकील नाही. कायदेशी सल्ला दिला जात नाही.',

  'ref.not3': 'कोणतेही पैसे घेतले जात नाहीत, आणि कोणतीही जाहिरात दाखवली जात नाही.',

  'ref.not4': 'तुमचे नाव, पत्ता किंवा फोन नंबर मागितला जात नाही आणि ठेवला जात नाही.',

  'ref.not5': 'सरकारी योजनेची किंमत किंवा नंबर तयार केला जात नाही — माहिती नसेल तर स्पष्टपणे सांगितले जाते की माहीत नाही.',

  'ref.medicalTitle': 'महत्त्वाचे: हे डॉक्टरांचा सल्ला नाही',

  'ref.medicalBody': 'आजार, औषध किंवा कोणत्याही विषारी गोष्टीसंबद्दत असाल तर सर्वात आधी डॉक्टरांना भेट द्या. येथे दिलेली माहिती फक्त सामान्य मदतीसाठी आहे. बाळाच्या लसीकरण, गरोदरपण, किंवा कोणतेही औषध सुरू करण्यापूर्वी डॉक्टरांचा सल्ला जरूर घ्या.',

  'ref.statsTitle': 'किती माहिती उपलब्ध आहे',

  'support.howTitle': 'आमची मदत कशी करायची',

  'support.alwaysFreeTitle': 'ही सेवा नेहमी निःशुल्क राहील',

  'support.alwaysFreeBody': 'जी मदद मिळेल, ती सेवा चालवण्यात लागेल. कोणाकडूनही कधी पैसा घेतला जाणार नाही.',

  'smriti.eyebrow': 'श्रद्धांजलि',

  'smriti.whyTitle': 'ही साइट का आहे',

  'smriti.ending': 'त्यांचा संघर्ष येथूनच पुढे चालू आहे.',

  'article.askAny': 'एक प्रश्न विचारा',

  'article.remember': 'लक्षात ठेवा',

  'article.emergencyInfo': 'महत्त्वाची माहिती',

  'article.medicalTitle': 'हे चिकित्सा सल्ला नाही',

  'article.medicalBody': 'ही माहिती सामान्य मदतीसाठी आहे. डॉक्टरांच्या सल्ल्याशिवाय कोणतेही औषध सुरू किंवा बंद करू नका.',

  'article.heading': '{category} वरील लेख',

  'reviews.rateQuestion': 'किती तारे द्याल?',

  'reviews.starsShort': '{value} तारे',

  'reviews.averageOutOf': '५ पैकी {value} तारे',

  'dhun.welcomeTitle': 'स्वागत आहे',

  'dhun.consent': 'शंख, बांसुरी आणि ढोल एकत्र. ऐकण्यासाठी स्पर्श करा.',

  'dhun.failed': 'ध्वनी चालू होऊ शकली नाही.',

  'dhun.unsupported': 'हा ब्राउझर ध्वनी चालू करू शकत नाही.',

  'dhun.failedTry': 'ध्वनी चालू करण्यात समस्या आली.',

  'sound.hintIdle': 'कोणतेही बटण दाबून ध्वनी ऐका.',

  'sound.hintPlaying': 'आवाज चालू आहे. थांबवण्यासाठी तेच बटण पुन्हा दाबा.',

  'sound.preparing': 'ध्वनी तयार होत आहे',

  'nav.path': 'मार्ग',

  'toast.dismiss': 'बंद करा',

  'footer.free': 'ही सेवा पूर्णपणे निःशुल्क आहे. कोणाच्याही जागून पैसे घेतले जात नाहीत.',

  'cat.empty': 'या विषयात अजून कोणतेही लेख नाहीत.',
  'cat.notFound': 'हे पान सापडले नाही',

  'dhun.label': 'ध्वनी चालवण्याची परवानगी',

  'language.articlesInHint': 'प्रत्येक भाषेला वेगळे अनुवाद लागतो. हा अनुवाद अद्यापर्यंत झालेला नाही — जे लिहिले आहे ते हिन्दीतच सर्वोत्तम आणि पूर्ण आहे.',

  'theme.toDark': 'अंधारदार रंगाकडे जा',

  'theme.toLight': 'उजळ रंगाकडे जा',

  'ask.emptyAnswer': 'यावेळी उत्तर तयार झाले नाही. थोडे वेगळे सांगून पुन्हा विचारा.',

  'ask.errorNetwork': 'इंटरनेट चालू होत नाही. कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',

  'ask.errorRateLimit': 'एकदमच अनेक प्रश्न पाठवले गेले. थोड्या वेळानंतर प्रयत्न करा.',

  'ask.heardWith': 'आता ऐकत आहे',

  'ask.micUnsupported': 'या ब्राउझरमध्ये बोलून विचारणार काम करणार नाही. लिहून विचारा.',

  'ask.notAnswer': 'या प्रश्नाचे थेट उत्तर आमच्याकडे नाही.',


  'article.askAbout': 'या विषयाबद्दल विचारा',

  'article.count': '{count} लेख',

  'article.emergency': 'ज़रूरी',

  'article.others': 'या विषयाचे आणखी लेख',

  'article.readAloud': 'हा लेख ऐका',

  'footer.admin': 'व्यवस्थापक',

  'footer.ambulance': 'रुग्णवाहिका',

  'footer.emergency': 'आपत्कालीन',

  'footer.rights': 'विनामूल्य सेवा',

  'footer.women': 'महिला हेल्पलाइन',

  'sound.allHint': 'एकत्र',

  'sound.bansuriHint': 'कोमल, हळू',

  'sound.dholHint': 'तीव्र, जलद',

  'sound.errGeneric': 'ध्वनी चालवण्यात समस्या आली.',

  'sound.errUnsupported': 'हा ब्राउझर ध्वनी चालू करू शकत नाही.',

  'sound.listenLabel': 'ऐका',

  'sound.playing': 'आवाज चालू आहे. थांबवण्यासाठी तेच बटण पुन्हा दाबा.',

  'sound.shankhHint': 'खोल, दीर्घ',

  'voice.aborted': 'थांबवले. पुन्हा प्रयत्न करा.',

  'voice.audioCapture': 'माइक मिळाला नाही. उपकरण जोडा, किंवा लिहून विचारा.',

  'voice.generic': 'काहीतरी चुकचुकली. पुन्हा प्रयत्न करा.',

  'voice.network': 'बोलून विचारण्यासाठी इंटरनेट हवे, पण ते चालू नाही. लिहून विचारा — तेच उत्तर मिळेल.',

  'voice.noSpeech': 'कोणताही आवाज ऐकली नाही. माइकजवळ बोला, किंवा लिहा.',

  'voice.notAllowed': 'माइकची परवानगी मिळाली नाही. वर जाऊन परवानगी द्या, किंवा लिहून विचारा.',

  'voice.serviceNotAllowed': 'माइकची परवानगी मिळाली नाही. वर जाऊन परवानगी द्या, किंवा लिहून विचारा.',

  'voice.speakFailed': 'हे उत्तर वाचून ऐकता आले नाहीत.',
  'voice.noVoice': 'या उपकरणावर {name} आवाज नाही. आत्ता लिहिलेले वाचा, किंवा फोनच्या सेटिंग्जमध्ये जाऊन आवाज जोडा.',

  'voice.unsupported': 'या ब्राउझरमध्ये बोलून विचारणार काम करणार नाही. लिहून विचारा.',

  'ask.notConfigured': 'ही सेवा सध्या जतन केलेल्या उत्तरांच्या संग्रहातून उत्तर देत आहे. तुमचा प्रश्न त्यात नाही.',

  'ask.browseTitle': 'इथले असलेले लेख पहा',

  'health.heading': 'तुमचे वय सांगा',

  'health.intro': 'वयानुसार जे प्रश्न नेहमी विचारले जातात ते येथे दिसतील. कोणतेही बटण दाबा — प्रश्न खाली भरला जाईल, मग विचारा.',

  'health.ageLabel': 'वय (वर्षे)',

  'health.years': 'वर्षे',

  'health.bandsLabel': 'वयानुसार निवडा',

  'health.notAdviceStrong': 'हे वैद्यकीय सल्ला नाही.',

  'health.notAdvice': 'कोणतेही औषध सुरू किंवा बंद करू नका — आधी डॉक्टरांचा सल्ला घ्या.',

  'health.emergencyStrong': 'आपत्कालीन वेळी फोन करा:',

  'health.emergencyCall': '(आपत्काल)',

  'health.emergencyAmbulance': '(रुग्णवाहिका)',

  'health.emergencyWomen': '(महिला मदतवाहिनी)',

  'health.privacy': 'नाव किंवा पत्ता लिहिण्याची गरज नाही.',

  'health.band.infant.label': '0 – 2 वर्षे',

  'health.band.child.label': '3 – 12 वर्षे',

  'health.band.teen.label': '13 – 17 वर्षे',

  'health.band.young.label': '18 – 30 वर्षे',

  'health.band.middle.label': '31 – 45 वर्षे',

  'health.band.later.label': '46 – 60 वर्षे',

  'health.band.senior.label': '61 – 75 वर्षे',

  'health.band.elder.label': '76 – 100 वर्षे',

  /* ---- save / download ---- */

  'download.pdf': 'PDF मध्ये लिहा',
  'download.text': 'मजकूर मध्ये लिहा',
  'download.printNow': 'प्रिंट करा',
  'download.preparing': 'तयार होत आहे',
  'download.blocked': 'नवीन टॅब उघडता आला नाही. पॉप-अप ब्लॉक होत आहे — परवानगी द्या.',

  /* ---- attach a document ---- */

  'attach.button': 'तुमचा दस्तऐवज किंवा फोटो जोडा',
  'attach.formats': 'PDF, फोटो (JPG/PNG) किंवा मजकूर फाइल — 12 MB पर्यंत',
  'attach.reading': 'वाचत आहे…',
  'attach.attached': 'जोडले',
  'attach.remove': 'काढा',
  'attach.tooBigPdf': 'हा PDF 12 MB पेक्षा मोठा आहे. लहान फाइल निवडा.',
  'attach.tooBigImage': 'हा फोटो 3 MB पेक्षा मोठा आहे. लहान फोटो निवडा.',
  'attach.scannedPdf': 'हा PDF स्कॅन केलेला आहे — त्यात फक्त चित्र आहे, वाचता येत नाही. त्याऐवजी त्याचा फोटो पाठवा.',
  'attach.pdfFailed': 'हा PDF वाचता आला नाही.',
  'attach.imageFailed': 'हा फोटो लोड झाला नाही.',
  'attach.wrongType': 'हा फाइल चालणार नाही. PDF, फोटो किंवा मजकूर फाइल पाठवा.',
  'attach.hint': 'तुमचा कागद इथे जोडून प्रश्न विचारा — उत्तर त्याच कागदाबद्दल येईल.',
  'ask.sendWithFile': 'उत्तर हवा',

  /* ---- free library ---- */

  'lib.title': 'मोफत ग्रंथालय',
  'lib.intro': 'शाळेची पुस्तके, पुस्तके, चित्रे आणि ऑडिओ — सर्व मोफत आणि कायदेशीर.',
  'lib.legalTitle': 'कॉपीराइटचा कोणताही गोंधळ नाही.',
  'lib.legal': 'इथे जे काही दिले आहे ते पूर्णपणे मोफत आहे आणि आपण ते पुढेही पाठवू शकता. जे पुस्तक अजून कॉपीराइटमध्ये आहे ते येथे नाही — ते कॉपी करता येत नाही, हे स्पष्टपणे सांगणे गरजेचे आहे.',
  'ask.signInTitle': 'आधी लॉगिन करा',
  'ask.signInBody': 'प्रश्न विचारण्यासाठी खाते तयार करा. एक मिनिटापेक्षा कमी वेळ लागते, आणि नंतर तुम्ही प्रश्न विचारत रहा.',
  'ask.signInCta': 'खाते तयार करा किंवा लॉगिन करा',
  'ask.signInFirst': 'आधी लॉगिन करा, मग प्रश्न विचारा.',
  'ask.signInOr': 'आता खाते तयार करता येत नाही? हे खात्याशिवायही चालतात:',
  'account.title': 'माझे खाते',
  'account.intro': 'तुमच्या नावाने आणि पासवर्डने लॉगिन करा.',
  'account.signIn': 'लॉगिन करा',
  'account.register': 'खाते तयार करा',
  'account.signInNote': 'आधी वापरलेले नाव आणि पासवर्ड वापरा.',
  'account.registerNote': 'प्रश्न विचारण्यासाठी खातेची गरज नाही. हे फक्त तुमची भाषा आणि उत्तरे लक्षात ठेवण्यासाठी.',
  'account.handle': 'तुमचे नाव',
  'account.handlePlaceholder': 'उदा. sita.ji',
  'account.password': 'पासवर्ड',
  'account.passwordHint': 'किमान ६ अक्षर.',
  'account.phone': 'फोन नंबर',
  'account.optional': 'आवश्यक नाही',
  'account.phoneHint': 'होय तर द्या. त्याशिवायही खाते तयार होते.',
  'account.create': 'खाते तयार करा',
  'account.logout': 'बाहेर पडा',
  'account.open': 'खाते उघडा',
  'account.signedInAs': 'तुम्ही लॉग इन आहात',
  'account.signedOut': 'लॉग इन नाही',
  'account.signedOutBody': 'या ब्राउझरमध्ये कोणतेही खाते उघडे नाही.',
  'account.saved': 'जमा केलेली उत्तरे',
  'account.savedEmpty': 'अजून काही जमा नाही. जवाबावर \'जमा करा\' दाबा.',
  'account.savedUnavailable': 'जमा केलेली उत्तरे आता दिसत नाहीत. बाकी सर्व चालू आहे.',
  'account.wait': 'कृपया थांबा…',
  'account.privacyTitle': 'तुमची माहिती',
  'account.privacyBody': 'खात्यात फक्त तुमचे नाव, पासवर्ड आणि भाषा साठवते. तुम्ही काय विचारले ते नोंदवले जात नाही. तुमचे प्रश्न कोणालाही पाठवले जात नाहीत.',
  'account.errWrong': 'नाव किंवा पासवर्ड चुकीचा.',
  'account.errTaken': 'हे नाव घेतले आहे. दुसरे नाव घ्या.',
  'account.errBad': 'कृपया माहिती योग्य भरा.',
  'account.errWait': 'खूप प्रयत्न झाले. थोड्या वेळाने पुन्हा प्रयत्न करा.',
  'account.errTryLater': 'आता होऊ शकले नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.',
  'lib.licence.ccBy': 'तुम्ही कॉपी, शेअर आणि छापू शकता — स्रोताचे नाव सांगितले पाहिजे.',
  'lib.licence.ccBySa': 'तुम्ही कॉपी आणि छापू शकता. केलेले बदलही उघडेपणे द्यायला हवेत.',
  'lib.licence.ccZero': 'पूर्णपणे मोफत. स्रोताचे नाव सांगण्याची गरज नाही.',
  'lib.licence.pd': 'याचे कोणाचेही कॉपीराइट नाही — हवे तसे कॉपी करा.',
  'lib.licence.govtIndia': 'भारत सरकारच्या संकेतस्थळावर. वाचणे आणि छापणे दोन्ही मोफत.',
  'lib.licence.creativeCommons': 'प्रत्येक फाइलचा स्वतःचा परवाना आहे — फाइल पहा.',
  'lib.licence.freeToRead': 'वाचणे मोफत. पुढे देणेही त्याच नियमांनुसारच शक्य आहे.',
  'lib.openBadge': 'उघडे',
  'lib.openBadgeNote': 'कॉपी करता येईल',
  'lib.freeBadge': 'मोफत',
  'lib.freeBadgeNote': 'वाचता येईल, कॉपी करता येणार नाही',
  'lib.govt': 'सरकारी',
  'lib.noSignup': 'खाते नाही',
  'lib.open': 'इथे उघडा',
  'lib.group.padhai': 'शाळा आणि अभ्यासाची पुस्तके',
  'lib.group.padhai.note': 'पाठ्यपुस्तके, महाविद्यालयीन आणि सरकारी शैक्षणिक साहित्य',
  'lib.group.kitab': 'पुस्तके',
  'lib.group.kitab.note': 'जी कॉपीराइटमुक्त आहेत किंवा ज्यांची कॉपी करण्यास परवानगी आहे',
  'lib.group.tasveer': 'चित्रे आणि नकाशे',
  'lib.group.tasveer.note': 'नकाशे, छायाचित्रे, चित्रे — सर्व काही',
  'lib.group.audio': 'ऐकण्याचे साहित्य',
  'lib.group.audio.note': 'पुस्तके ऐकून, लहान अक्षरांत न वाचता',
  'lib.warnTitle': 'प्रत्येक पुस्तक येथे नाही',
  'lib.warn': 'काही पुस्तके अजून कॉपीराइटमध्ये आहेत आणि कायद्याने ती मोफत देता येत नाहीत. ती जाणून करून दाखवत नाही. एखादे पुस्तक हवे असल्यास खाली विचारा — जे उत्तर देता येईल ते मिळेल.',
  'lib.askInstead': 'विचारा',
  'nav.library': 'ग्रंथालय',

  'help.title': 'तुमची समस्या लिहा',

  'help.intro': 'खाली लिहा किंवा बोला. माहीत नसेल तर जसाच मनात आहे तसाच लिहा — हेच सर्वात महत्त्वाचे आहे.',

  'help.howTitle': 'ही सेवा कशी चालते',

  'help.howBody': 'प्रत्येक प्रश्न नोंदवला जातो आणि त्याचे उत्तर लगेच मिळते. तुमचे नाव, पत्ता किंवा फोन नंबर कुठेही घेतला जात नाही. सर्व काही मोफत आहे.',

  'help.suggested': 'नेहमीचे प्रश्न',

  'help.q1.label': 'वीज गेली आहे, काय करू?',

  'help.q1.question': 'घरात वीज गेली आहे. काय करावे, आणि मोबाइल फोन कसा चार्ज करावा?',

  'help.q2.label': 'मुलाच्या अभ्यासात कमजोरी',

  'help.q2.question': 'माझ्या मुलाच्या अभ्यासात खूप कमजोरी आहे. घरी कसे सुधारू?',

  'help.q3.label': 'वृद्धाचे उपचार',

  'help.q3.question': 'माझ्या बाबांचे वय खूप जास्त आहे, त्यांचे उपचार कसे करावेत?',

  'help.q4.label': 'घरात आग लागल्यास',

  'help.q4.question': 'रात्री घरात आग लागल्यास सर्वात आधी काय करावे?',

  'home.stepLabel': 'टप्पा',

  'home.step1Title': 'तुमचे म्हणणे लिहा किंवा बोला',

  'home.step1Body': 'मराठीत टाइप करा, किंवा मायक दाबून बोला. काहीही वेगळे करायची गरज नाही — जे मनात आहे ते लिहा.',

  'home.step2Title': 'लगेच उत्तर मिळते',

  'home.step2Body': 'प्रत्येक प्रश्न नोंदवला जातो आणि त्याचे उत्तर लगेच मिळते. खूप मोठ्या प्रश्नाआधी लहान प्रश्नापासून सुरुवात करा.',

  'home.step3Title': 'पैसे नाहीत, वैयक्तिक माहिती नाही',

  'home.step3Body': 'ही सेवा पूर्णपणे मोफत आहे. तुमचे नाव, पत्ता किंवा फोन नंबर मागितला जात नाही, आणि जाहिरात दाखवली जात नाही.',

  'home.memorialEyebrow': 'ही साइट कोणासाठी आहे',
  'home.memorialLine': 'ज्यांनी आजीवन समाजासाठी लढले, आणि शेवटी त्यांना त्यांचा हिस्सा मिळाला नाही.',
  'home.memorialMore': 'त्यांची संपूर्ण कथा वाचा',
  'home.kundaliTitle': 'जन्मपत्रिका',
  'home.kundaliNote': 'पूर्ण कुंडली — नऊ ग्रह, विमशोत्तरी दशा, फलादेश, योग, शोडशवर्ग, केपी, लाल किताब आणि अंक ज्योतिष. सर्व आपल्या फोनवरच मोजले जातील.',
  'home.chooseTopicNote': 'खालील विषयांवर टॅप करा. प्रत्येक ठिकाणी साध्या भाषेत माहिती दिली आहे.',

  'home.categoryEmpty': 'या विषयात अद्याप कोणतेही लेख लिहिलेले नाहीत.',

  'home.soundIntro': 'कोणतेही शुल्क नाही, कोणतीही जाहिरात नाही. फक्त मन शांत करण्यासाठी.',

  'home.dedication1': 'स्मृतिमध्ये — पूर्णपणे मोफत सेवा.',

  'home.dedication2': 'तुमची समस्या लिहा किंवा बोला.',

  'ref.title': 'ही सेवा काय आहे, आणि कोणासाठी',

  'ref.intro': 'ही सेवा श्रीमती VARSHA यांच्या स्मृतिमध्ये तयार करण्यात आली आहे. येथे साध्या भाषेत सांगितले आहे की ती काय करते, त्यात काय आहे आणि त्यांच्या मर्यादा काय आहेत. सर्व काही पूर्णपणे मोफत आहे — पैसे घेतले जात नाहीत, जाहिरात दाखवली जात नाही, आणि वैयक्तिक माहिती मागितली जात नाही.',

  'ref.whatTitle': 'यात काय आहे',

  'ref.what1': 'घरात आग लागणे, वीज जाणे, बाळाच्या अभ्यासात कमजोरी, आई-वडिलांची काळजी घेणे — अशा सामान्य समस्यांसाठी सोपे उपाय, स्वच्छ भाषेत.',

  'ref.what2': 'प्रश्न बोलून विचारण्याची सोय. बोलता येत नसेल तर लिहा — दोन्हींचे उत्तर एकसारखेच मिळते.',

  'ref.what3': 'प्रत्येक प्रश्न नोंदवला जातो, म्हणून जे इतरांना त्रास देतं ते तुमच्यापूर्वीच विचारलेले असतं आणि त्याचे उत्तर मिळते.',

  'ref.what4': 'कोणतीही जाहिरात नाही, अनावश्यक माहिती नाही, आणि वैयक्तिक माहिती मागितली जात नाही. सर्व काही मोफत.',

  'ref.statsArticles': 'लेख लिहिले आहेत',

  'ref.statsCategories': 'विषय उपलब्ध आहेत',

  'ref.statsQuestions': 'प्रश्न विचारले गेले आहेत',

  'ref.adminTitle': 'प्रबंधक काय करू शकतात',

  'ref.adminBody': 'तुम्ही पाठवलेले लेख प्रबंधक पाहू शकतात आणि त्यांना उत्तर लिहू शकतात. तुमच्या परवानगीशिवाय ते कोणताही लेख बदलू किंवा हटवू शकत नाहीत, आणि तुमची माहिती कोणालाही विकता येत नाही.',

  'ref.dataTitle': 'तुमच्याबद्दल आम्ही काय ठेवतो',

  'ref.dataBody': 'फक्त तुमचा विचारलेला प्रश्न, त्याचा सार आणि विचारण्याची वेळ — ज्यामुळे आपण वारंवार तेच उत्तर देत राहू. तुमचे नाव, पत्ता, फोन नंबर किंवा ओळख दाखवणारी कोणतीही माहिती घेतली जात नाही. साइटवर कोणतीही जाहिरात किंवा ट्रॅकिंग स्क्रिप्ट नाही.',

  'ref.helplineTitle': 'तातडीच्या मदतीसाठी हे नंबर ठेवा',

  'ref.helpline1': 'मोठा धोका असल्यास — आग, विद्युत् कंपन, पडणे किंवा खूप रक्तस्राव — तर 112 वर फोन करा.',

  'ref.helpline2': 'कोणाला आजार असेल किंवा दुखापत झाले असेल आणि वाहन नसेल, तर 108 वर रुग्णवाहिका मागवा.',

  'ref.helpline3': 'महिलेसोबत काही असे घडले असल्यास, किंवा महिलेला कुठून त्रास दिला जात असल्यास, तर 181 वर फोन करा. हे मोफत आहे.',

  'ref.helpline4': 'बाळ किंवा वृद्ध व्यक्तीसोबत काही अन्याय झाल्यास, 1098 वर तक्रार करता येईल.',

  'ref.helpline5': 'मानसिक ताण अत्यधिक असल्यास, किंवा जगण्याची इच्छा नसल्यास, 14416 वर बोलता येईल. फक्त बोलण्यासाठी.',

  'ref.ownerNote': 'ही सेवा कोणत्याही कंपनीची किंवा सरकारची नाही, तर एका व्यक्तीच्या स्मृतिमध्ये चालवली जात आहे. म्हणून येथे कोणतीही जाहिरात नाही, कोणतीही सदस्यता नाही, आणि कोणतेही पैसे घेतले जात नाहीत.',

  'support.title': 'ही सेवा निःशुल्क आहे',

  'support.intro': 'ही सेवा कोणाकडूनही पैसे घेत नाही. पण ती चालते — म्हणून काही मार्ग आहेत ज्याद्वारे तुम्ही मदत करू शकता. सर्वात सोपा मार्ग सर्वात उपयोगी आहे.',

  'support.contactTitle': 'काही सांगायचे आहे?',

  'support.contactBody': 'काहीही गोष्टीसाठी येथे लिहू शकता — काही चूक असेल, काही जास्त मिळाले, किंवा काही प्रश्न असेल. जे लिहिणे सोपे वाटेल तेवढेच लिहा.',

  'support.faqTitle': 'काही गोष्टी ज्या वारंवार विचारल्या जातात',

  'support.faqBody': 'हे खरेच मोफत आहे? होय. तुमचे नाव घेतले जाते? नाही, नाव देणे आवश्यक नाही. जाहिरात येतात? नाही. फोन नंबर किंवा पत्ता मागितला जातो? नाही. कोणतीही अॅप डाउनलोड करावी लागते? नाही, फक्त ब्राउझरमध्ये उघडते.',

  'support.waysTitle': 'तुम्ही कसे मदत करू शकता',

  'support.way1Title': 'तुमचा अनुभव लिहा',

  'support.way1Body': 'जर या साइटमुळे तुम्हाला काहीतरी चांगले वाटले असेल — किंवा असे काही मिळाले असेल ज्याने तुम्हाला गोंधळले असेल — तर राय पेजवर लिहा. तुमचे नाव घेणे आवश्यक नाही.',

  'support.way2Title': 'आपल्या शहराबद्दल सांगा',

  'support.way2Body': 'तुम्ही जिथे राहता तिथली भाषा, रीती आणि अडचणी वेगळ्या असतात. जर तुमच्या इथे काही गोष्ट इथे नसेल, तर सांगा — जे जोडता येईल ते जोडले जाईल.',

  'support.way3Title': 'तुमचा अनुभव दुसऱ्याला सांगा',

  'support.way3Body': 'इथे लिहिलेले अनेकांना उपयोगी पडू शकते, जर त्यांना माहीत झाले. अशा व्यक्तीला सांगा ज्याला खरेच हे मदत करेल.',

  'support.way4Title': 'इथे येऊन पहा',

  'support.way4Body': 'तुम्हाला वेळ असेल, तर स्वतः येऊन पहा की हे साइट नीट चालते आहे का नाही. काही चुकलेले दिसले तर सांगा — पूर्णपणे मोफत दुरुस्त होईल.',

  'reviews.pageTitle': 'तुमची राय',

  'reviews.pageIntro': 'इथे लोकांनी लिहिलेलेच लिहिले आहे. कोणतीही राय लपवली जात नाही, आणि लिहिलेले तेच इथे दिसते — फक्त एकदा पाहण्यानंतर प्रकाशित केले जाते.',

  'reviews.intro': 'ही सेवा तुमच्या कामास आली का? तुमचे म्हणणे लिहा — तुमचे नाव घेणे आवश्यक नाही.',

  'reviews.write': 'तुमची राय लिहा',

  'reviews.starsLabel': '5 मधून {value} तारे',

  'reviews.summaryTitle': 'नेहमीची राय',

  'reviews.summaryLine': 'लोकांनी सरासरी {rating} मधून 5 पैकी {count} तारे दिले.',

  'reviews.count': 'समीक्षा',

  'reviews.name': 'तुमचे नाव (आवश्यक नाही)',

  'reviews.city': 'तुमचे शहर (आवश्यक नाही)',

  'reviews.placeholder': 'जे मनात आहे तेच लिहा — काही दुरुस्त करण्याची गरज नाही.',

  'reviews.keepLabel': 'वाईट वाटले तर चांगले वाटले तर — दोन्ही लिहा',

  'reviews.fieldTooShort': 'किमान 10 अक्षरे लिहा.',

  'reviews.rateLimited': 'खूप वेगाने पाठवले जात आहे. थोडे थांबून पुन्हा प्रयत्न करा.',

  'reviews.sending': 'पाठवत आहे…',

  'reviews.moderated': 'तुमची समीक्षा प्रकाशित होण्यापूर्वी एकदा पाहिली जाते.',

  'reviews.moderationNote': 'सर्व काही मिटवण्याचा धोका टाळण्यासाठी, प्रकाशित होण्यापूर्वी प्रत्येक समीक्षा एकदा पाहिली जाते. शिवी, नंबर किंवा वैयक्तिक गोष्टी काढून टाकल्या जातात — बाकी सर्व जे आहे तसेच प्रकाशित होते.',

  'reviews.replyLabel': 'यावर लिहिले आहे',

  'reviews.ownerReply': 'जवाब',

  'reviews.empty': 'अजून कोणतीही समीक्षा नाही. पहिली तुम्ही लिहा.',

  'reviews.anonymous': 'नावाशिवाय',

  'reviews.toastSent': 'धन्यवाद',

  'reviews.toastFailed': 'राय पाठवता आली नाही',

  'health.band.infant.note': 'अगदी लहान बाळे, जी अद्याप आपले म्हणणे सांगू शकत नाहीत',

  'health.band.child.note': 'बाळे जी बोलू शकतात, परंतु प्रश्न विचारायला घाबरतात',

  'health.band.teen.note': 'किशोर, ज्यांना नेहमी अशा व्यक्तीचा भेट होत नाही जी ऐकून घेईल',

  'health.band.young.note': 'नोकरी, पैसा आणि झोप — तिन्हींचा एकत्र भार',

  'health.band.middle.note': 'घर, मुले आणि स्वतःचे आरोग्य — सर्वांची जबाबदारी एकत्र',

  'health.band.later.note': 'शरीराचे वय आणि त्याची काळजी — दोन्ही एकत्र',

  'health.band.senior.note': 'औषध, संतुलन आणि एकटेपणा — तिन्ही सोबत',

  'health.band.elder.note': 'प्रत्येक औषधाची तपासणी आवश्यक, प्रत्येक पडणे गंभीर',

  'health.c.infant1': 'ज्वर जास्त',

  'health.c.infant2': 'खाणार नाही',

  'health.c.infant3': 'उल्टी होतेय',

  'health.c.infant4': 'जुलोख्या होताय',

  'health.c.child1': 'अभ्यासात मन नाही',

  'health.c.child2': 'शाळेला जात नाही',

  'health.c.child3': 'रात्री ज्वर',

  'health.c.child4': 'दात तडकताय',

  'health.c.teen1': 'अभ्यासाचा दबाव',

  'health.c.teen2': 'झोप येत नाही',

  'health.c.teen3': 'मोबाइलची सवय',

  'health.c.teen4': 'फार खोल उदासी',

  'health.c.young1': 'कामाचा ताण',

  'health.c.young2': 'बसल्याने पीठ दुखते',

  'health.c.young3': 'झोप येत नाही',

  'health.c.young4': 'पैसा कमी आहे',

  'health.c.middle1': 'कमरेखालील दुखणे',

  'health.c.middle2': 'झोप ठीक येत नाही',

  'health.c.middle3': 'घरातील ताण',

  'health.c.middle4': 'पोटात गॅस',

  'health.c.later1': 'पीठ दुखते',

  'health.c.later2': 'गुडघा दुखते',

  'health.c.later3': 'रात्री पायांची ऐंठण',

  'health.c.later4': 'सकाळी जकडण',

  'health.c.senior1': 'चालणे अडचण आहे',

  'health.c.senior2': 'औषधांची तपासणी',

  'health.c.senior3': 'रात्री पेशाब',

  'health.c.senior4': 'कान कमी ऐकते',

  'health.c.elder1': 'पडण्याची भीती',

  'health.c.elder2': 'नात्री कमजोर',

  'health.c.elder3': 'रोजची दुखण्याची औषधे',

  'health.c.elder4': 'डॉक्टरकडे कधी',

  'health.q.infant1': 'माझ्या बाळाला ज्वर आलेला आहे, दूध द्यायचे का?',

  'health.q.infant2': 'लहान बाळ खात नाही, काय करू?',

  'health.q.infant3': 'बाळाला उल्टी होतेय, डॉक्टरांना कधी दाखवू?',

  'health.q.infant4': 'बाळाला जुलोख्या होताय, काय खिलावू?',

  'health.q.child1': 'बाळाच्या अभ्यासात मन लागत नाही, काय करू?',

  'health.q.child2': 'बाळ रोज शाळेला जाण्यास नकार देत आहे, कारण काय असू शकते?',

  'health.q.child3': 'बाळाला रात्री ज्वर येतो, काय करू?',

  'health.q.child4': 'बाळाचे दात तडकत आहेत, दातांची कशी काळजी घ्यावी?',

  'health.q.teen1': 'अभ्यासाचा खूप दबाव आहे, त्याचा सामना कसा करावा?',

  'health.q.teen2': 'रात्री नींद ठीक येत नाही, काय करू?',

  'health.q.teen3': 'मोबाइलची सवय लागली आहे, सोडण्याचा उपाय सांगा.',

  'health.q.teen4': 'फार खोल उदासी वाटते, कोणाशी बोलावे?',

  'health.q.young1': 'कामाचा खूप ताण आहे, कसा कमी करावा?',

  'health.q.young2': 'बसून राहिल्याने पीठ दुखते आहे, काय करू?',

  'health.q.young3': 'रात्री नींद येत नाही, काय उपाय आहे?',

  'health.q.young4': 'पैसे कमी आहेत आणि खर्च जास्त, काय करू?',

  'health.q.middle1': 'कमरेखालील दुखणे होत आहे, कारण काय असू शकते?',

  'health.q.middle2': 'नींद चांगली येत नाही, सुधारण्यासाठी काय करावे?',

  'health.q.middle3': 'घरात खूप ताण आहे, मुलांना कसे सांभाळू?',

  'health.q.middle4': 'कामावर गेली वर्षे पोटात गॅसची समस्या आहे, काय करू?',

  'health.q.later1': 'माझी वय 54 वर्षे आहे आणि पीठ दुखते आहे, काय करू?',

  'health.q.later2': 'चढताना गुडघा दुखतो, का?',

  'health.q.later3': 'रात्री पायांची ऐंठण होते, काय करू?',

  'health.q.later4': 'सकाळी उठल्यावर कमर जकडते, कारण काय असू शकते?',

  'health.q.senior1': 'गुडघ्यांत इतका दुखणा आहे की चालणे अडचण आहे, काय करू?',

  'health.q.senior2': 'अनेक औषधे रोज खावी लागतात — कोणी हानिकारक आहे हे कसे कळेल?',

  'health.q.senior3': 'रात्री वारंवार पेशाबाची तक्रार आहे, काय करू?',

  'health.q.senior4': 'कानी कमी ऐकते, ऐकण्याचा काही उपाय सांगा.',

  'health.q.elder1': 'घरात पडण्याची भीती आहे, कोणती सुरक्षा ठेवावी?',

  'health.q.elder2': 'नात्री कमजोर होत आहे, काय उपाय आहेत?',

  'health.q.elder3': 'रोज दुखण्याची औषधे खावी लागतात — याचा काही तोटा होतो का?',

  'health.q.elder4': 'कधी डॉक्टरकडे जाणे आवश्यक आहे?',

  'support.contactMessageLabel': 'तुमचे म्हणणे',

  'support.contactPlaceholder': 'जे लिहायचे आहे तेच लिहा — चूक असेल, काहीतरी चांगले मिळाले असेल, किंवा प्रश्न असेल.',

  'support.contactHelp': 'किमान 10 अक्षरे. हे थेट मालकाकडे पोहोचते.',

  'support.contactSubmit': 'पाठवा',

  'support.contactSending': 'पाठवत आहे…',

  'support.contactPrivacy': 'तुमचे नाव लिहिणे आवश्यक नाही.',

  'support.contactSent': 'पोहोचले',

  'support.contactSentBody': 'तुमचे म्हणणे मालकाकडे पोहोचले आहे.',

  'support.contactFailed': 'पाठवता आले नाही',

  'support.faq1Q': 'हे खरेच मोफत आहे?',

  'support.faq1A': 'होय. कोणतेही पैसे घेतले जात नाहीत, कोणतीही जाहिरात दाखवली जात नाही, आणि कोणतीही सदस्यता घेतली जात नाही. हे एका व्यक्तीच्या पैशांनी चालते, कंपनी किंवा सरकारच्या नाही.',

  'support.faq2Q': 'माझे नाव, पत्ता किंवा फोन नंबर घेतला जातो का?',

  'support.faq2A': 'नाही, आणि घेतला जाणार नाही. हे साइट स्वतः कोणतीही ओळख तयार करत नाही — कोणतेही लॉगिन नाही, कोणताही ट्रॅकिंग स्क्रिप्ट नाही. विचारले जाते ते फक्त तुमचा प्रश्न आहे आणि तेवढेच साठवले जाते.',

  'support.faq3Q': 'हे डॉक्टर किंवा वकील आहे का?',

  'support.faq3A': 'नाही. हे औषधाचा किंवा कायदेशी सल्ला देत नाही. जिथे बात गंभीर असते तिथे हे तुम्हाला डॉक्टर किंवा अधिकाऱ्याकडे जाण्याची सांगते — त्यांची जागा हे घेत नाही.',

  'support.faq4Q': 'प्रत्येक जवाब योग्य असतो का?',

  'support.faq4A': 'नेहमी नाही. जवाब संगणक लिहितो, कोणी डॉक्टर नाही — म्हणूनच प्रत्येक जवाबासोबत हे लिहिले आहे की हे चिकित्सा सल्ला नाही. कोणतेही औषध सुरू करण्यापूर्वी किंवा बंद करण्यापूर्वी डॉक्टरांचा सल्ला घ्या.',

  'support.faq5Q': 'मला काही ऐप डाउनलोड करावा लागेल का?',

  'support.faq5A': 'नाही. हे फक्त ब्राउझरमध्ये उघडते. कोणतेही ऐप इन्स्टॉल नाही, कोणतीही परवानगी नाही, कोणतेही अपडेट नाही.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'घरगुती उपचार',
  'remedy.title': 'आयुर्वेदिक घरगुती उपचार',
  'remedy.intro': 'कसलाही त्रास असो — खोकला, डोकेदुखी, संधिवात, खाज-खाजण, मधुमेह, पाठदुखी — खाली तुमचा त्रास निवडा किंवा तुमच्या शब्दांत विचारा. घरगुती काढा, मालिश, आहार आणि आयुर्वेदिक उपाय सांगितले जातील.',
  'remedy.choose': 'तुमचा त्रास निवडा',
  'remedy.emergencyStrong': 'हे आपत्कालीन आहेत:',
  'remedy.emergency': 'साप चावणे, विंचू दंश आणि कुत्रा चावणे — लगेच रुग्णालयात जा, आधी 112 वर फोन करा. घरगुती उपाय फक्त वाटेत करण्यासाठी आहेत, रुग्णालयाच्या जागी नाही.',
  'remedy.note': 'घरगुती आणि आयुर्वेदिक उपाय त्रास कमी करण्यास मदत करतात; डॉक्टरांची तपासणी आणि उपचार यांची जागा घेत नाहीत. कोणतेही औषध स्वतः बंद किंवा सुरू करू नका.',
  'remedy.cough': 'खोकला',
  'remedy.headache': 'डोकेदुखी',
  'remedy.joints': 'संधिवात',
  'remedy.itching': 'खाज-खाजण',
  'remedy.snake': 'साप चावणे',
  'remedy.scorpion': 'विंचू दंश',
  'remedy.dog': 'कुत्रा चावणे',
  'remedy.diabetes': 'मधुमेह',
  'remedy.back': 'पाठदुखी',
  'remedy.walking': 'चालताना त्रास',
  'home.remedyNote': 'काढा, मालिश, आहार आणि आयुर्वेदिक उपाय — प्रत्येक त्रासासाठी, तुमच्या भाषेत.',
  'nav.aarti': 'आरती व भजन',
  'aarti.title': 'आरती व भजन — खऱ्या आवाजात',
  'aarti.intro': 'इथे आरती, कीर्तन आणि भजन ऐका — खऱ्या गायकांच्या आणि मंदिरांच्या आवाजात. AI आवाज नाही.',
  'aarti.note': 'आरती किंवा भजन संगणकाच्या आवाजात लावणे म्हणजे त्याची चाल आणि भक्ती हरवणे. म्हणून इथे फक्त खऱ्या रेकॉर्डिंग आहेत.',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रेकॉर्डिंग:',
  'aarti.licence': 'परवाना:',
  'aarti.listenLink': 'खऱ्या आवाजात ऐका',
  'aarti.textChecked': 'हा पारंपरिक पाठ आहे, जसा खऱ्या रेकॉर्डिंगमध्ये गायला गेला आहे.',
  'aarti.textPrinted': 'हा प्रचलित पाठ आहे, प्रकाशित संग्रहांशी मिळवून तपासलेला.',
  'aarti.textNotStored': 'या ग्रंथाचा संपूर्ण पाठ इथे साठवलेला नाही — खालील रेकॉर्डिंगमध्ये संपूर्ण पाठ ऐकायला मिळतो.',
  'aarti.granthTitle': 'ग्रंथ, चालीसा आणि स्तोत्रे — खऱ्या आवाजात',
  'aarti.noRecording': 'या आरतीची खरी रेकॉर्डिंग साइटवर अजून नाही, म्हणून मी ती गाऊन ऐकवू शकत नाही — AI आवाजात आरती कधीही गात नाही.',
  'aarti.textOnlyTitle': 'अजून आरत्या — पाठ आणि खरा आवाज',
  'aarti.fullText': 'पूर्ण पाठ',
  'aarti.notChecked': 'या आरतीचा तपासलेला पाठ अजून साइटवर नाही. न तपासलेला पाठ दिला जात नाही, कारण प्रार्थनेत चुकीचा शब्द नसण्यापेक्षा वाईट आहे.',
  'aarti.verifiedList': 'साइटवर या आरत्यांचे तपासलेले पाठ आहेत:',

};

const GUJARATI: Record<string, string> = {
  'jgd.placeSearch': 'તમારા શહેરનું નામ લખો',
  'jgd.placeNoMatch': 'આ શહેર યાદીમાં નથી. નજીકનું શહેર પસંદ કરો.',

  'account.name': 'તમારું નામ',
  'account.namePlaceholder': 'દા.ત. સીતા દેવી',
  'account.nameHint': 'આપણે કોણ છો તે જાણવા. કોઈપણ નામ ચાલશે, અને આ જરૂરી નથી.',

  'nav.home': 'હોમ', 'home.metaTitle': 'મફત સમાધાન, તમારા પોતાના શબ્દોમાં', 'nav.tribute': 'સ્મૃતિ', 'nav.help': 'મદદ', 'nav.reference': 'માહિતી',
  'lib.licence.ccZero.name': 'CC0 / પબ્લિક ડોમેન',
  'lib.licence.pd.name': 'પબ્લિક ડોમેન',
  'lib.licence.govtIndia.name': 'ભારત સરકાર',
  'lib.licence.creativeCommons.name': 'ક્રિએટિવ કોમન્સ (મિશ્ર)',
  'lib.licence.freeToRead.name': 'વાંચવા માટે મફત',
  'lib.entry.ncert.title': 'NCERT પુસ્તકો — ધોરણ 1 થી 12',
  'lib.entry.ncert.what': 'દરેક વિષયના બધા પુસ્તકો, દરેક ધોરણ માટે. લૉગિન વિના, સીધી PDF.',
  'lib.entry.ncert.langs': 'હિન્દી, અંગ્રેજી અને ૩૦ થી વધુ ભારતીય ભાષાઓ',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ડિજિટલ પાઠ્યપુસ્તકો',
  'lib.entry.pm-evidya.what': 'NCERT પુસ્તકોની એપ, મોટા અક્ષરે વાંચી શકાય. બોલીને પણ સાંભળી શકાય.',
  'lib.entry.pm-evidya.langs': 'ભારતીય ભાષાઓ',
  'lib.entry.diksha.title': 'DIKSHA — શિક્ષકો અને બાળકો માટે',
  'lib.entry.diksha.what': 'પાઠ, વિડીયો અને સરાવ — ધોરણ 1 થી 12.',
  'lib.entry.diksha.langs': 'ભારતીય ભાષાઓ',
  'lib.entry.khan-academy.title': 'Khan Academy — અંગ્રેજીમાં ગણિત અને વિજ્ઞાન',
  'lib.entry.khan-academy.what': 'દરેક ધોરણ સુધીના વિડીયો પાઠ, લખિત પાઠ પણ છે.',
  'lib.entry.openstax.title': 'OpenStax — અંગ્રેજીમાં મફત પુસ્તકો',
  'lib.entry.openstax.what': 'કૉલેજ સ્તરના પુસ્તકો — ગણિત, વિજ્ઞાન, માનવશાસ્ત્ર. દરેક પાના પર PDF.',
  'lib.entry.nios.title': 'NIOS — દૂરશિક્ષણ, મફત સામગ્રી',
  'lib.entry.nios.what': 'ઓપન અને ઓનલાઇન કોર્સની મફત પુસ્તિકાઓ, દાખલા વિના.',
  'lib.entry.nios.langs': 'હિન્દી, અંગ્રેજી અને અન્ય',
  'lib.entry.ignou.title': 'IGNOU — ઉચ્ચ અભ્યાસ માટે મફત પુસ્તકો',
  'lib.entry.ignou.what': 'દૂરશિક્ષણના પુસ્તકો, સંપૂર્ણ મફત.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — અંગ્રેજીના જૂના પુસ્તકો',
  'lib.entry.gutenberg.what': '70,000 થી વધુ પુસ્તકો, બધાનો કૉપીરાઇટ પૂરો. મફત ઇ-બુક અને ઓડિયો.',
  'lib.entry.pratham-books.title': 'Pratham Books — બાળકોના પુસ્તકો',
  'lib.entry.pratham-books.what': 'ભારતીય ભાષાઓમાં બાળકોના પુસ્તકો, સંપૂર્ણ મફત. ધોરણ 1 થી 5 માટે.',
  'lib.entry.pratham-books.langs': 'હિન્દી, મરાઠી, બંગાળી, તમિલ, તેલુગુ અને વધુ',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — વર્તમાનપત્રો અને જૂના મેગેઝિન',
  'lib.entry.internet-archive-texts.what': 'લાખો જૂના પુસ્તકો, મેગેઝિન અને વર્તમાનપત્રો — મફત.',
  'lib.entry.wikisource.title': 'Wikisource — મફત સાર્વજનિક લેખન',
  'lib.entry.wikisource.what': 'કોપીરાઇટ નથી — આ દુનિયાના જૂના સાહિત્યિક પુસ્તકો છે.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — દરેક પ્રકારના ચિત્રો',
  'lib.entry.wikimedia-commons.what': 'પ્રાણીઓ, નકશા, તારાઓ, ઇતિહાસ — બધું જ. દરેક ચિત્રનું પોતાનું લાઇસન્સ છે.',
  'lib.entry.pixabay.title': 'Pixabay — ફોટા અને ચિત્રો',
  'lib.entry.pixabay.what': 'ફોટા, રેખાચિત્રો અને નાના વિડીયો.',
  'lib.entry.unsplash.title': 'Unsplash — સુંદર ફોટા',
  'lib.entry.unsplash.what': 'મફત, મોટા કદમાં, એકાઉન્ટ વિના.',
  'lib.entry.openverse.title': 'Openverse — બધા મફત ચિત્રો એક જગ્યાએ',
  'lib.entry.openverse.what': 'એકસાથે ઘણી મફત ચિત્ર સાઇટ શોધો.',
  'lib.entry.librivox.title': 'LibriVox — સાંભળવા માટેના પુસ્તકો',
  'lib.entry.librivox.what': 'જૂના અંગ્રેજી પુસ્તકોનું મફત ઓડિયો, માણસોના અવાજમાં.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ઓડિયો સંગ્રહ',
  'lib.entry.internet-archive-audio.what': 'હજારો મફત રેકોર્ડિંગ — પુસ્તકો, ભાષણો, સંગીત.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — રાષ્ટ્રીય ગીત અને અન્ય',
  'lib.entry.vande-mataram.what': 'ભારતનું રાષ્ટ્રીય ગીત અને અન્ય રાષ્ટ્રીય ગીતો, મફત.',
  'art.aag-aur-bijli-ke-bachav.title': 'અગ્નિ અને વીજળીથી બચવાના નિયમો',
  'art.aag-aur-bijli-ke-bachav.summary': 'ઘરમાં અગ્નિકાંડ ટાળવા — સરળ નિયમો',
  'art.aag-lagne-par-kya-karein.title': 'અગ્નિ લાગે તો શું કરવું',
  'art.aag-lagne-par-kya-karein.summary': 'બળતા ઘરમાં અગ્નિ — પહેલાં શું કરવું, શું ન કરવું',
  'art.bimari-se-bachav.title': 'ચેપથી બચવાના સાત નિયમો',
  'art.bimari-se-bachav.summary': 'હાત ધોવા, માસ્ક, રસીકરણ — કેવી રીતે સુરક્ષિત રહેવું',
  'art.dhuwan-ka-jhakora.title': 'ધુમાડાથી શ્વાસ રોકાતા બચવાનું',
  'art.dhuwan-ka-jhakora.summary': 'શ્વાસ રોકાય છે, દમ નથી આવતો — શું કરવું, ક્યારે હોસ્પિટલ જવું',
  'art.doodh-pani-band-ho.title': 'વીજળી કે પાણી અચાનક બંધ થાય ત્યારે',
  'art.doodh-pani-band-ho.summary': 'શું કરવું, શાથી દૂર રહેવું, ક્યારે મદદ માંગવી',
  'art.haath-ki-saafai.title': 'સાબણ વિના હાત સાફ કરવાની રીત',
  'art.haath-ki-saafai.summary': 'પાણી કે સાબણ ન હોય ત્યારે',
  'cat.dhyan-aur-yoog.title': 'ધ્યાન અને યોગ',
  'cat.dhyan-aur-yoog.subtitle': 'મન શાંત કરવાની સરળ રીતો',
  'cat.gharelu-marammat.title': 'ઘરેલુ દુરુસ્તી',
  'cat.gharelu-marammat.subtitle': 'ઘરની નાની સમસ્યાઓના ઉકેલ',
  'cat.bachchon-ki-padhai.title': 'બાળકોના અભ્યાસ',
  'cat.bachchon-ki-padhai.subtitle': 'અભ્યાસમાં લાગેલા, ચિંતિત',
  'cat.budharge-seva.title': 'વૃદ્ધોની સેવા',
  'cat.budharge-seva.subtitle': 'કાળજી અને મદદ',
  'cat.shishu-dekhbhal.title': 'શિશુ સંભાળ',
  'cat.shishu-dekhbhal.subtitle': 'નાના બાળકની યોગ્ય સંભાળ',
  'cat.dharmik-upay.title': 'ધાર્મિક ઉપાય',
  'cat.dharmik-upay.subtitle': 'મનની શાંતિ સાથે',
  'cat.pavan-grah-aur-aarti.title': 'પવિત્ર ગ્રંથ અને આરતી',
  'cat.pavan-grah-aur-aarti.subtitle': 'શ્રદ્ધાથી વાંચો અને સાંભળો',
  'cat.aapatkalen-gayide.title': 'આપત્કાલીન માર્ગદર્શિકા',
  'cat.aapatkalen-gayide.subtitle': 'તરત જ મદદ જોઈએ ત્યારે',
  'cat.mahamari-suraksha.title': 'મહામારી સુરક્ષા',
  'cat.mahamari-suraksha.subtitle': 'રોગ ફેલાતા અટકાવવો',
  'nav.reviews': 'અભિપ્રાય', 'nav.support': 'મદદ કરો', 'nav.menu': 'મેનુ',
  'nav.birthChart': 'જન્મ કુંડળી',
  'jgd.title': 'તમારી જન્મ કુંડળી',
  'jgd.intro': 'તમારું નામ, જન્મ તારીખ, અને જાણો હોય તો સમય અને સ્થળ. બધું તમારા ફોન પર જ થાય છે — ક્યાંય મોકલાતું નથી.',
  'jgd.nameLabel': 'જન્મનું નામ',
  'jgd.namePlaceholder': 'દા.ત. પૂર્ણ નામ',
  'jgd.nameHint': 'બાળપણમાં આપેલું નામ.',
  'jgd.dateLabel': 'જન્મ તારીખ',
  'jgd.timeLabel': 'જન્મનો સમય',
  'jgd.timeHint': 'જાણકરું ન હોય તો ખાલી રાખો.',
  'jgd.placeLabel': 'જન્મ સ્થળ',
  'jgd.placeNone': 'જાણકરું નથી / પસંદ કરો',
  'jgd.placeHint': 'જન્મનું શહેર પસંદ કરો.',
  'jgd.submit': 'ગણતરી કરો',
  'jgd.savePdf': 'PDF બનાવો',
  'jgd.again': 'ફરી ગણતરી કરો',
  'jgd.errDate': 'કૃપા કરી જન્મ તારીખ સાચી લખો.',
  'jgd.errPlace': 'યાદીમાંથી તમારું શહેર પસંદ કરો, અથવા નજીકનું શહેર પસંદ કરો.',
  'jgd.numTitle': 'સંખ્યા જ્યોતિષ',
  'jgd.lifePath': 'જીવન માર્ગ',
  'jgd.nameNumber': 'નામ સંખ્યા',
  'jgd.soulNumber': 'આત્મા સંખ્યા',
  'jgd.birthdayNumber': 'જન્મદિન સંખ્યા',
  'jgd.astroTitle': 'વૈદિક જ્યોતિષ',
  'jgd.nakshatra': 'નક્ષત્ર',
  'jgd.pada': 'પદ',
  'jgd.rashi': 'રાશિ',
  'jgd.rashiLord': 'રાશિનો સ્વામી',
  'jgd.nakshatraLord': 'નક્ષત્રનો સ્વામી',
  'jgd.lagna': 'લગ્ન',
  'jgd.lagnaMissing': 'લગ્ન માટે જન્મનો સમય અને સ્થળ જોઈએ. ઉપર ભરીને ફરી ગણતરી કરો — જાણકરું ન હોય તો આટલું પૂરતું.',
  'jgd.gunTitle': 'ગુણ મિલન',
  'jgd.gunIntro': 'બીજા વ્યક્તિનું નામ અને જન્મ તારીખ ભરો.',
  'jgd.gunName': 'તેમનું નામ',
  'jgd.gunDate': 'તેમની જન્મ તારીખ',
  'jgd.gunHint': 'બંના નામ અને તારીખ હોય તો ગુણ મિલન નીકળે.',
  'jgd.disclaimer': 'આ પરંપરાની પદ્ધતિથી ગણતરી છે, ભવિષ્યવાણી નથી. કોઈ સંખ્યા કે રાશિ કોઈનું આરોગ્ય, પૈસા કે સંબંધ નક્કી કરતી નથી. મોટા નિર્ણય માટે ડૉક્ટર, વકીલ કે અનુભવી વ્યક્તિની સલાહ લો.',
  'nav.openMenu': 'મેનુ ખોલો', 'nav.closeMenu': 'મેનુ બંધ કરો', 'nav.language': 'ભાષા બદલો',
  'nav.expand': 'બાર ખોલો', 'nav.collapse': 'બાર બંધ કરો', 'nav.skip': 'સીધા સામગ્રી પર જાઓ',
  'ask.label': 'તમારી સમસ્યા લખો અથવા બોલો', 'ask.placeholder': 'દા.ત.: બાળકના વિદ્યામાં નબળાઈ',
  'ask.help': 'એન્ટર દબાવીને પણ મોકલી શકાય.', 'ask.send': 'પૂછો', 'ask.sending': 'વિચારી રહ્યા છીએ…',
  'ask.clear': 'લખેલું કાઢો', 'ask.speak': 'બોલીને પૂછો', 'ask.listening': 'બોલવાનું શરૂ કરો…',
  'ask.heard': 'સાંભળી રહ્યા છીએ', 'ask.stopListening': 'સાંભળવાનું બંધ કરો', 'ask.suggested': 'સામાન્ય પ્રશ્નો',
  'ask.answerTitle': 'ઉત્તર', 'ask.listen': 'સાંભળો', 'ask.stopSpeak': 'બંધ કરો',
  'ask.aiNote': 'આ ઉત્તર AI એ આપ્યું છે. નિષ્ણાતની સલાહનો વિકલ્પ નથી.',
  'sound.title': 'શાંતિ માટે ધ્વનિ', 'sound.intro': 'કોઈ ફી નથી, કોઈ જાહેરાત નથી.',
  'sound.shankh': 'શંખ', 'sound.bansuri': 'બાંસુરી', 'sound.dhol': 'ઢોલ', 'sound.all': 'ત્રણેય',
  'dhun.welcome': 'સ્વાગત છે', 'dhun.prompt': 'શંખ, બાંસુરી અને ઢોલ સાથે સાંભળવા સ્પર્શ કરો.',
  'dhun.listen': 'સાંભળો', 'dhun.skip': 'છોડો',
  'home.emergencyTitle': 'અત્યંત જરૂરી — હવે મદદ જોઈએ છે', 'home.emergencyNote': 'આ પહેલાં વાંચો. બાકી પછી.',
  'home.readMore': 'સંપૂર્ણ માહિતી વાંચો', 'home.chooseTopic': 'કયા વિષય વિશે જાણવું છે?',
  'home.askHere': 'આ વિષયે પૂછો', 'home.howTitle': 'આ સેવા કેવી રીતે કામ કરે છે',
  'home.soundTitle': 'શાંતિ માટે ધ્વનિ', 'home.freeTitle': 'આ સેવા સંપૂર્ણપણે મફત છે',
  'home.freeBody': 'પૈસા લેવામાં આવતા નથી, વ્યક્તિગત માહિતી પૂછવામાં આવતી નથી, જાહેરાત દર્શાવતી નથી.',
  'footer.pages': 'પાનાં', 'footer.helplines': 'મહત્વના નંબરો', 'footer.readStory': 'તેમની સંપૂર્ણ કથા વાંચો',
  'reviews.title': 'તમારી રાય, તમારી વાત', 'reviews.submit': 'મોકલો', 'reviews.comment': 'તમારી વાત',
  'language.choose': 'તમારી ભાષા પસંદ કરો', 'language.articlesIn': 'આ લેખ હિન્દીમાં છે.',

  'ask.welcome': 'સ્વાગત છે! નીચે તમારી સમસ્યા લખો અથવા એક વિષય પસંદ કરો.',

  'ref.notTitle': 'આ શું કરતું નથી',

  'ref.not1': 'આ ડૉક્ટર નથી. દવાની સલાહ ક્યારેય આપવામાં આવતી નથી.',

  'ref.not2': 'આ વકીલ નથી. કાનૂની સલાહ આપવામાં આવતી નથી.',

  'ref.not3': 'કોઈ પૈસા લેવાતા નથી, અને કોઈ જાહેરાત બતાવવાતી નથી.',

  'ref.not4': 'તમારું નામ, સરનામું કે ફોન નંબર માંગવાતું નથી અને રાખવાતું પણ નથી.',

  'ref.not5': 'સરકારી યોજનાની કિંમત કે નંબર બનાવવામાં આવતો નથી — માહિતી ન હોય તો સ્પષ્ટ કહે છે કે માહિતી નથી.',

  'ref.medicalTitle': 'મહત્વના: આ ડૉક્ટરની સલાહ નથી',

  'ref.medicalBody': 'બીમારી, દવા કે ઝેરી વસ્તુ વિશે હોય તો પહેલા ડૉક્ટરને મળો. અહીં આપેલ માહિતી ફક્ત સામાન્ય મદદ માટે છે. બાળકના ટીકા, ગર્ભાવસ્થા, કે કોઈ પણ દવા શરૂ કરતાં પહેલાં ડૉક્ટરની સલાહ જરૂર લો.',

  'ref.statsTitle': 'કેટલી માહિતી ઉપલબ્ધ છે',

  'support.howTitle': 'તમે અમારી મદદ કેવી રીતે કરી શકો',

  'support.alwaysFreeTitle': 'આ સેવા હંમેશા મફત રહેશે',

  'support.alwaysFreeBody': 'જે મદદ મળે તે સેવા ચલાવવામાં વપરાશે. કોઈ પાસેથી ક્યારેય પૈસા લેવામાં આવશે નહીં.',

  'smriti.eyebrow': 'શ્રદ્ધાંજલિ',

  'smriti.whyTitle': 'આ સાઇટ કેમ છે',

  'smriti.ending': 'તેમનો અસ્તિત્વ અહીં જ આગળ વધે છે.',

  'article.askAny': 'એક પ્રશ્ન પૂછો',

  'article.remember': 'યાદ રાખજો',

  'article.emergencyInfo': 'મહત્વની માહિતી',

  'article.medicalTitle': 'આ તબીબી સલાહ નથી',

  'article.medicalBody': 'આ માહિતી સામાન્ય મદદ માટે છે. ડૉક્ટરની સલાહ વગર કોઈ દવા શરૂ કે બંધ ન કરો.',

  'article.heading': '{category} વિશેના લેખ',

  'reviews.rateQuestion': 'કેટલા તારા આપશો?',

  'reviews.starsShort': '{value} તારા',

  'reviews.averageOutOf': '5 માંથી {value} તારા',

  'dhun.welcomeTitle': 'સ્વાગત છે',

  'dhun.consent': 'શંખ, બાંસુરી અને ઢોલ સાથે. સાંભળવા સ્પર્શ કરો.',

  'dhun.failed': 'ધ્વનિ વગાડી શકાઈ નથી.',

  'dhun.unsupported': 'આ બ્રાઉઝર ધ્વનિ વગાડી શકતો નથી.',

  'dhun.failedTry': 'ધ્વનિ વગાડવામાં સમસ્યા આવી.',

  'sound.hintIdle': 'કોઈપણ બટન દબાવીને ધ્વનિ સાંભળો.',

  'sound.hintPlaying': 'અવાજ વાગી રહ્યો છે. બંધ કરવા એ જ બટન ફરી દબાવો.',

  'sound.preparing': 'ધ્વનિ તૈયાર થઈ રહી છે',

  'nav.path': 'માર્ગ',

  'toast.dismiss': 'બંધ કરો',

  'footer.free': 'આ સેવા સંપૂર્ણ રીતે મફત છે. કોઈના પૈસા લેવામાં આવતા નથી.',

  'cat.empty': 'આ વિષયમાં હજી કોઈ લેખ નથી.',
  'cat.notFound': 'આ પાનું મળ્યું નથી',

  'dhun.label': 'ધ્વનિ વગાડવાની પરવાનગી',

  'language.articlesInHint': 'દરેક ભાષાનું અલગ અનુવાદ જરૂરી છે. આ અનુવાદ હજી થયો નથી — જે લખ્યું છે તે હિન્દીમાં જ સૌથી યોગ્ય અને પૂર્ણ છે.',

  'theme.toDark': 'અંધારા રંગ પર જાઓ',

  'theme.toLight': 'ઉજળ રંગ પર જાઓ',

  'ask.emptyAnswer': 'આ વાર જવાબ બન્યો નહીં. થોડું અલગ કરીને ફરી પૂછો.',

  'ask.errorNetwork': 'ઇન્ટરનેટ ચાલુ નથી. કનેક્શન તપાસીને ફરી પ્રયત્ન કરો.',

  'ask.errorRateLimit': 'એક સાથે ઘણા પ્રશ્નો મોકલાયા. થોડી વાર પછી પ્રયત્ન કરો.',

  'ask.heardWith': 'અત્યારે સાંભળું રહ્યા છીએ',

  'ask.micUnsupported': 'આ બ્રાઉઝરમાં બોલીને પૂછવાનું કામ નહીં કરે. લખીને પૂછો.',

  'ask.notAnswer': 'આ પ્રશ્નનું સીધું જવાબ અમારી પાસે નથી.',


  'article.askAbout': 'આ વિષય વિશે પૂછો',

  'article.count': '{count} લેખ',

  'article.emergency': 'જરૂરી',

  'article.others': 'આ વિષયના વધુ લેખ',

  'article.readAloud': 'આ લેખ સાંભળો',

  'footer.admin': 'વ્યવસ્થાપક',

  'footer.ambulance': 'એમ્બ્યુલન્સ',

  'footer.emergency': 'કટોકટી',

  'footer.rights': 'મફત સેવા',

  'footer.women': 'મહિલા હેલ્પલાઇન',

  'sound.allHint': 'સાથે જ',

  'sound.bansuriHint': 'કોમળ, ધીમી',

  'sound.dholHint': 'તેજ, ઝડપી',

  'sound.errGeneric': 'ધ્વનિ વગાડવામાં સમસ્યા આવી.',

  'sound.errUnsupported': 'આ બ્રાઉઝર ધ્વનિ વગાડી શકતો નથી.',

  'sound.listenLabel': 'સાંભળો',

  'sound.playing': 'અવાજ વાગી રહ્યો છે. બંધ કરવા એ જ બટન ફરી દબાવો.',

  'sound.shankhHint': 'ઊંડું, લાંબું',

  'voice.aborted': 'થોભાયું. ફરી પ્રયત્ન કરો.',

  'voice.audioCapture': 'માઇક મળ્યો નહીં. ઉપકરણ જોડો, અથવા લખીને પૂછો.',

  'voice.generic': 'કંઈક ગડબડ થઈ. ફરી પ્રયત્ન કરો.',

  'voice.network': 'બોલીને પૂછવા ઇન્ટરનેટ જોઈએ, પણ તે ચાલુ નથી. લખીને પૂછો — એ જ જવાબ મળશે.',

  'voice.noSpeech': 'કોઈ અવાજ સંભળાયો નહીં. માઇક પાસે બોલો, અથવા લખો.',

  'voice.notAllowed': 'માઇકની પરવાનગી મળી નથી. ઉપર જઈને પરવાનગી આપો, અથવા લખીને પૂછો.',

  'voice.serviceNotAllowed': 'માઇકની પરવાનગી મળી નથી. ઉપર જઈને પરવાનગી આપો, અથવા લખીને પૂછો.',

  'voice.speakFailed': 'આ જવાબ વાંચીને સાંભળવામાં આવ્યું નહીં.',
  'voice.noVoice': 'આ ઉપકરણમાં {name} અવાજ નથી. હમણાં લખેલું વાંચો, અથવા ફોનની સેટિંગ્સમાં જઈને અવાજ ઉમેરો.',

  'voice.unsupported': 'આ બ્રાઉઝરમાં બોલીને પૂછવાનું કામ નહીં કરે. લખીને પૂછો.',

  'ask.notConfigured': 'આ સેવા હાલ સચવાયેલા જવાબોના સંગ્રહમાંથી જવાબ આપી રહી છે. તમારો પ્રશ્ન તેમાં નથી.',

  'ask.browseTitle': 'અહીં જે લેખ છે તે જુઓ',

  'health.heading': 'તમારી ઉંમર કહો',

  'health.intro': 'ઉંમર પ્રમાણે જે પ્રશ્નો વારંવાર પૂછાય છે તે અહીં દેખાશે. કોઈ બટન દબાવો — પ્રશ્ન નીચે ભરાશે, પછી પૂછો.',

  'health.ageLabel': 'ઉંમર (વર્ષ)',

  'health.years': 'વર્ષ',

  'health.bandsLabel': 'ઉંમર પ્રમાણે પસંદ કરો',

  'health.notAdviceStrong': 'આ તબીબી સલાહ નથી.',

  'health.notAdvice': 'કોઈ દવા શરૂ કે બંધ ન કરો — પહેલાં ડૉક્ટરની સલાહ લો.',

  'health.emergencyStrong': 'કટોકટીમાં ફોન કરો:',

  'health.emergencyCall': '(કટોકટી)',

  'health.emergencyAmbulance': '(એમ્બ્યુલન્સ)',

  'health.emergencyWomen': '(મહિલા મદદ)',

  'health.privacy': 'નામ કે સરનામું લખવાની જરૂર નથી.',

  'health.band.infant.label': '0 – 2 વર્ષ',

  'health.band.child.label': '3 – 12 વર્ષ',

  'health.band.teen.label': '13 – 17 વર્ષ',

  'health.band.young.label': '18 – 30 વર્ષ',

  'health.band.middle.label': '31 – 45 વર્ષ',

  'health.band.later.label': '46 – 60 વર્ષ',

  'health.band.senior.label': '61 – 75 વર્ષ',

  'health.band.elder.label': '76 – 100 વર્ષ',

  /* ---- save / download ---- */

  'download.pdf': 'PDF માં સાચો',
  'download.text': 'લખાણ માં સાચો',
  'download.printNow': 'છાપો',
  'download.preparing': 'તૈયાર થઈ રહ્યું છે',
  'download.blocked': 'નવું ટૅબ ખૂલી શકાયું નથી. પોપ-અપ બ્લોક થઈ રહ્યું છે — પરવાનગી આપો.',

  /* ---- attach a document ---- */

  'attach.button': 'તમારો દસ્તાવેજ કે ફોટો ઉમેરો',
  'attach.formats': 'PDF, ફોટો (JPG/PNG) કે ટેક્સ્ટ ફાઇલ — 12 MB સુધી',
  'attach.reading': 'વાંચી રહ્યું છે…',
  'attach.attached': 'ઉમેરાયું',
  'attach.remove': 'કાઢી નાખો',
  'attach.tooBigPdf': 'આ PDF 12 MB થી મોટું છે. નાની ફાઇલ પસંદ કરો.',
  'attach.tooBigImage': 'આ ફોટો 3 MB થી મોટો છે. નાનો ફોટો પસંદ કરો.',
  'attach.scannedPdf': 'આ PDF સ્કેન કરેલી છે — તેમાં ફક્ત ચિત્ર છે, વાંચી શકાતું નથી. તેને ફોટો મોકલો.',
  'attach.pdfFailed': 'આ PDF વાંચી શકાયું નથી.',
  'attach.imageFailed': 'આ ફોટો લોડ થયો નથી.',
  'attach.wrongType': 'આ પ્રકારની ફાઇલ ચાલશે નહીં. PDF, ફોટો કે ટેક્સ્ટ ફાઇલ મોકલો.',
  'attach.hint': 'તમારો કાગળ અહીં ઉમેરીને પ્રશ્ન પૂછો — જવાબ એ જ કાગળ વિશે મળશે.',
  'ask.sendWithFile': 'આનો જવાબ જોઈએ',

  /* ---- free library ---- */

  'lib.title': 'મફત ગ્રંથાલય',
  'lib.intro': 'પાઠકપુસ્તકો, પુસ્તકો, તસવીરો, ઓડિયો — બધું મફત અને કાયેદાર.',
  'lib.legalTitle': 'કોપીરાઇટની કોઈ મુશ્કેલી નથી.',
  'lib.legal': 'અહીં જે આપ્યું છે તે સંપૂર્ણ મફત છે અને તમે તે આગળ શેર કરી શકો. જે પુસ્તક હજી કોપીરાઇટમાં છે તે અહીં નથી — તેને કોપી કરવાની પરવાનગી નથી, તે સ્પષ્ટ કહેવું જ યોગ્ય છે.',
  'ask.signInTitle': 'પહેલાં લોગઇન કરો',
  'ask.signInBody': 'પ્રશ્ન પૂછવા ખાતું બનાવો. એક મિનિટથી ઓછો વારનો, પછી તમે પ્રશ્નો પૂછતા રહો.',
  'ask.signInCta': 'ખાતું બનાવો અથવા લોગઇન કરો',
  'ask.signInFirst': 'પહેલાં લોગઇન કરો, પછી પ્રશ્ન પૂછો.',
  'ask.signInOr': 'હાલ ખાતું બનાવી શકતા નથી? આ ખાતા વગર પણ કામ કરે છે:',
  'account.title': 'મારું ખાતું',
  'account.intro': 'તમારા નામ અને પાસવર્ડથી લોગિન કરો.',
  'account.signIn': 'લોગિન કરો',
  'account.register': 'ખાતું બનાવો',
  'account.signInNote': 'અગાઉ વાપરેલું નામ અને પાસવર્ડ વાપરો.',
  'account.registerNote': 'પ્રશ્ન પૂછવા માટે ખાતું જરૂરી નથી. આ ફક્ત તમારી ભાષા અને જવાબો યાદ રાખવા માટે છે.',
  'account.handle': 'તમારું નામ',
  'account.handlePlaceholder': 'દા.ત. sita.ji',
  'account.password': 'પાસવર્ડ',
  'account.passwordHint': 'ઓછામાં છ અક્ષર.',
  'account.phone': 'ફોન નંબર',
  'account.optional': 'જરૂરી નથી',
  'account.phoneHint': 'ઇચ્છા હોય તો આપો. વગર પણ ખાતું બને છે.',
  'account.create': 'ખાતું બનાવો',
  'account.logout': 'બહાર નીકળો',
  'account.open': 'ખાતું ખોલો',
  'account.signedInAs': 'તમે લોગઇન છો',
  'account.signedOut': 'લોગઇન નથી',
  'account.signedOutBody': 'આ બ્રાઉઝરમાં કોઈ ખાતું ખુલ્લું નથી.',
  'account.saved': 'સાચવેલા જવાબો',
  'account.savedEmpty': 'હજી કંઈ સાચવ્યું નથી. જવાબ પર \'સાચવો\' દબાવો.',
  'account.savedUnavailable': 'સાચવેલા જવાબો હાલ દેખાતા નથી. બાકી બધું ચાલુ છે.',
  'account.wait': 'કૃપા કરી રાહ જુઓ…',
  'account.privacyTitle': 'તમારી માહિતી',
  'account.privacyBody': 'ખાતામાં ફક્ત તમારું નામ, પાસવર્ડ અને ભાષા સચવાય છે. તમે શું પૂછ્યું તે નોંધાતું નથી. તમારા પ્રશ્નો કોઈને મોકલાતા નથી.',
  'account.errWrong': 'નામ કે પાસવર્ડ ખોટો.',
  'account.errTaken': 'આ નામ લેવામાં આવ્યું. બીજું નામ પસંદ કરો.',
  'account.errBad': 'કૃપા કરી માહિતી સાચી ભરો.',
  'account.errWait': 'ઘણા પ્રયાસ થયા. થોડી વાર પછી ફરી પ્રયાસ કરો.',
  'account.errTryLater': 'હાલ થઈ શક્યું નહીં. થોડી વાર પછી ફરી પ્રયાસ કરો.',
  'lib.licence.ccBy': 'તમે કૉપિ, શેર અને છાપી શકો — સ્રોતનું નામ આપવું પડશે.',
  'lib.licence.ccBySa': 'તમે કૉપિ અને છાપી શકો. કરેલા ફેરફાર પણ ખુલ્લા કરી શેર કરવા પડશે.',
  'lib.licence.ccZero': 'સંપૂર્ણ મફત. સ્રોતનું નામ આપવાની જરૂર નથી.',
  'lib.licence.pd': 'આનું કોઈનું કોપીરાઇટ નથી — ઇચ્છા મુજબ કૉપિ કરો.',
  'lib.licence.govtIndia': 'ભારત સરકારની વેબસાઇટ પર. વાંચવું અને છાપવું બંને મફત.',
  'lib.licence.creativeCommons': 'દરેક ફાઇલનો પોતાનો લાઇસન્સ છે — ફાઇલ જુઓ.',
  'lib.licence.freeToRead': 'વાંચવું મફત. આગળ આપવું પણ એ જ નિયમો પ્રમાણે જ શક્ય છે.',
  'lib.openBadge': 'ખુલ્લું',
  'lib.openBadgeNote': 'કોપી કરી શકાય',
  'lib.freeBadge': 'મફત',
  'lib.freeBadgeNote': 'વાંચી શકાય, કોપી નહીં',
  'lib.govt': 'સરકારી',
  'lib.noSignup': 'ખાતું જરૂર નથી',
  'lib.open': 'અહીં ખોલો',
  'lib.group.padhai': 'શાળા અને અભ્યાસની પુસ્તકો',
  'lib.group.padhai.note': 'પાઠ્યપુસ્તકો, કિલ્લો અને સરકારી શિક્ષણ સામગ્રી',
  'lib.group.kitab': 'પુસ્તકો',
  'lib.group.kitab.note': 'જે કોપીરાઇટમાં નથી અથવા જેનું કોપી કરવાની પરવાનગી છે',
  'lib.group.tasveer': 'તસવીરો',
  'lib.group.tasveer.note': 'નકશા, તસવીરો — બધું',
  'lib.group.audio': 'સાંભળવાનું સામગ્રી',
  'lib.group.audio.note': 'પુસ્તકો ઓડિયોમાં, નાના અક્ષર વાંચવા ન ઇચ્છા હોય તો',
  'lib.warnTitle': 'દરેક પુસ્તક અહીં નથી',
  'lib.warn': 'કેટલાક પુસ્તકો હજી કોપીરાઇટમાં છે અને કાયેદારને મુજબ મફત આપી શકાતાં નથી. તે ઇરાદાપૂર્વક દર્શાવ્યા નથી. પુસ્તક જોઈતું હોય તો નીચે પૂછો — શું કહી શકાય તે કહેવામાં આવશે.',
  'lib.askInstead': 'પૂછો',
  'nav.library': 'ગ્રંથાલય',

  'help.title': 'તમારી સમસ્યા લખો',

  'help.intro': 'નીચે લખો અથવા બોલો. ખબર ન હોય તો જે મનમાં આવે તે જ લખી દો — આ જ સૌથી અગત્યનું છે.',

  'help.howTitle': 'આ સેવા કેવી રીતે કામ કરે છે',

  'help.howBody': 'દરેક પ્રશ્ન નોંધાય છે અને તેનો જવાબ તરત મળે છે. તમારું નામ, સરનામું કે ફોન નંબર ક્યાંય લેવાતું નથી. બધું મફત છે.',

  'help.suggested': 'સામાન્ય પ્રશ્નો',

  'help.q1.label': 'વીજળી ગઈ છે, શું કરું?',

  'help.q1.question': 'ઘરમાં વીજળી ચાલુ ગઈ છે. શું કરવું જોઈએ, અને મોબાઇલ ફોન કેવી રીતે ચાર્જ કરવો?',

  'help.q2.label': 'બાળકના અભ્યાસમાં નબળાઈ',

  'help.q2.question': 'મારા બાળકના અભ્યાસમાં ઘણી નબળાઈ છે. ઘરે કેવી રીતે સુધારું?',

  'help.q3.label': 'વૃદ્ધનો ઈલાજ',

  'help.q3.question': 'મારા પિતાજીની ઉંમર ઘણી વધુ છે, તેમનો ઈલાજ કેવી રીતે કરું?',

  'help.q4.label': 'ઘરમાં આગ લાગે તો',

  'help.q4.question': 'રાત્રે ઘરમાં આગ લાગે તો સૌથી પહેલા શું કરવું જોઈએ?',

  'home.stepLabel': 'પગલું',

  'home.step1Title': 'તમારી વાત લખો અથવા બોલો',

  'home.step1Body': 'ગુજરાતીમાં ટાઇપ કરો, અથવા માઇક દબાવીને બોલો. કંઈ ખાસ કરવાનું નથી — જે મનમાં છે તે લખી દો.',

  'home.step2Title': 'તરત જવાબ મળે છે',

  'home.step2Body': 'દરેક પ્રશ્ન નોંધાય છે અને તેનો જવાબ તરત મળે છે. ઘણા મોટા પ્રશ્ન પહેલાં નાના પ્રશ્નથી શરૂ કરો.',

  'home.step3Title': 'પૈસા નહીં, વ્યક્તિગત માહિતી નહીં',

  'home.step3Body': 'આ સેવા સંપૂર્ણ મફત છે. તમારું નામ, સરનામું કે ફોન નંબર માંગવામાં આવતું નથી, અને કોઈ જાહેરાત બતાવવામાં આવતી નથી.',

  'home.memorialEyebrow': 'આ સાઇટ કોના માટે છે',
  'home.memorialLine': 'જેઓ આજીવન સમાજ માટે લડ્યા, અને છેલ્લે પોતાનો હિસ્સો મળ્યો ન હતો.',
  'home.memorialMore': 'તેમની સંપૂર્ણ વાર્તા વાંચો',
  'home.kundaliTitle': 'જન્મ કુંડળી',
  'home.kundaliNote': 'સંપૂર્ણ કુંડળી — નવ ગ્રહ, વિમશોત્તરી દશા, ફલાદેશ, યોગ, શોડશવર્ગ, કેપી, લાલ કિતાબ અને અંક જ્યોતિષ. બધું તમારા ફોન પર જ ગણાય છે.',
  'home.chooseTopicNote': 'નીચેના વિષય પર ટેપ કરો. દરેક જગ્યાએ સરળ ભાષામાં માહિતી આપવામાં આવી છે.',

  'home.categoryEmpty': 'આ વિષયમાં હજી કંઈ લખાયું નથી.',

  'home.soundIntro': 'કોઈ ફી નહીં, કોઈ જાહેરાત નહીં. ફક્ત મન શાંત કરવા માટે.',

  'home.dedication1': 'સ્મૃતિમાં — સંપૂર્ણ મફત સેવા.',

  'home.dedication2': 'તમારી સમસ્યા લખો અથવા બોલો.',

  'ref.title': 'આ સેવા શું છે, અને કોના માટે છે',

  'ref.intro': 'આ સેવા શ્રીમતી VARSHA ની સ્મૃતિમાં બનાવવામાં આવી છે. અહીં સાદી ભાષામાં કહેલું છે કે તે શું કરે છે, તેમાં શું છે, અને તેની મર્યાદા શું છે. બધું સંપૂર્ણ મફત છે — પૈસા લેવાતા નથી, જાહેરાત બતાવવાતી નથી, અને નિજી માહિતી માંગવાતી નથી.',

  'ref.whatTitle': 'તેમાં શું છે',

  'ref.what1': 'ઘરમાં આગ, વીજળી જતાં, બાળકના અભ્યાસમાં નબળાઈ, માતાપિતાની સંભાળ — આવા સામાન્ય સમસ્યાની સરળ ઉપાય, સ્પષ્ટ ભાષામાં.',

  'ref.what2': 'પ્રશ્ન બોલીને પૂછવાની સુવિધા. બોલી ન શકાય તો લખો — બંનેનો જવાબ એક જેવો મળે છે.',

  'ref.what3': 'દરેક પ્રશ્ન નોંધાય છે, એટલે જે બીજાને તરસ્યું કરે તે તમારા પહેલાં જ પૂછાયેલું હોય છે અને તેનો જવાબ મળી જાય છે.',

  'ref.what4': 'કોઈ જાહેરાત નથી, અનાવશ્ય માહિતી નથી, અને નિજી માહિતી માંગવાતી નથી. બધું મફત.',

  'ref.statsArticles': 'લેખ લખાયેલા છે',

  'ref.statsCategories': 'વિષય ઉપલબ્ધ છે',

  'ref.statsQuestions': 'પ્રશ્નો પૂછ્યા ગયા છે',

  'ref.adminTitle': 'વ્યવસ્થાપક શું કરી શકે',

  'ref.adminBody': 'તમે મોકલેલા લેખ વ્યવસ્થાપક જોઈ શકે છે અને તેમને જવાબ લખી શકે છે. તમારી પરવાનગી વગર તેઓ કોઈ લેખ બદલી કે દૂર કરી શકતા નથી, અને તમારી માહિતી કોઈને વેચી શકાતી નથી.',

  'ref.dataTitle': 'તમારા વિશે અમે શું રાખીએ છીએ',

  'ref.dataBody': 'ફક્ત તમારો પૂછેલો પ્રશ્ન, તેનો સાર અને પૂછવાનો સમય — જેથી અમે વારંવાર એક જ જવાબ ન આપીએ. તમારું નામ, સરનામું, ફોન નંબર કે ઓળખ બતાવે એવી કોઈ માહિતી લેવાતી નથી. સાઇટ પર કોઈ જાહેરાત કે ટ્રેકિંગ સ્ક્રિપ્ટ નથી.',

  'ref.helplineTitle': 'તાત્કાલિક મદદ માટે આ નંબરો રાખો',

  'ref.helpline1': 'મોટો જોખમો હોય — આગ, વીજળીનું કંપન, પડી જવું કે ઘણું રક્તસ્રાવ — તો 112 પર ફોન કરો.',

  'ref.helpline2': 'કોઈને બીમારી કે ઈજાત હોય અને જવાનું વાહન ન હોય, તો 108 પર એમ્બ્યુલન્સ માંગો.',

  'ref.helpline3': 'મહિલા સાથે કંઈ ખરાબ થયું હોય, કે મહિલાને ક્યાંક તકલીફ પડે, તો 181 પર ફોન કરો. આ મફત છે.',

  'ref.helpline4': 'બાળક કે વૃદ્ધ સાથે અન્યાય થયો હોય, તો 1098 પર ફરિયાદ કરી શકાય.',

  'ref.helpline5': 'માનસિક તણાવ ઘણો વધારે હોય, કે જીવવાનું મન ન થાય, તો 14416 પર વાત કરી શકાય. ફક્ત વાત કરવા માટે.',

  'ref.ownerNote': 'આ સેવા કોઈ કંપનીની કે સરકારની નથી, પણ એક વ્યક્તિની સ્મૃતિમાં ચાલે છે. તેથી અહીં કોઈ જાહેરાત નથી, કોઈ સભ્યસત્તા નથી, અને કોઈ પૈસા લેવાતા નથી.',

  'support.title': 'આ સેવા મફત છે',

  'support.intro': 'આ સેવા કોઈપાસો પૈસા લેતી નથી. પણ તે ચાલે છે — એટલે કેટલાક રસ્તાઓ છે જેથી તમે મદદ કરી શકો. સૌથી સરળ રસ્તો જ સૌથી કામનો આવે છે.',

  'support.contactTitle': 'કંઈક કહેવું છે?',

  'support.contactBody': 'ગમેતે માટે અહીં લખી શકો — કોઈ ભૂલ હોય, કંઈ વધુ મળે, અથવા કોઈ પ્રશ્ન હોય. જેટલું લખવું સરળ લાગે તેટલું જ લખો.',

  'support.faqTitle': 'વારંવાર પૂછાતી કેટલી વાતો',

  'support.faqBody': 'આ ખરેખર મફત છે? હા. તમારું નામ લેવાય છે? ના, નામ આપવું જરૂરી નથી. જાહેરાત આવે છે? ના. ફોન નંબર કે સરનામું માંગવાય છે? ના. કોઈ એપ ડાઉનલોડ કરવી પડે? ના, ફક્ત બ્રાઉઝરમાં ખૂલે છે.',

  'support.waysTitle': 'તમે કેવી રીતે મદદ કરી શકો',

  'support.way1Title': 'તમારો અનુભવ લખો',

  'support.way1Body': 'જો આ સાઇટથી તમને કંઈ સારું લાગ્યું હોય — અથવા એવું કંઈ મળ્યું હોય જેણે તમને ગૂંચવાયું હોય — તો રાય પેજ પર લખી દો. તમારું નામ લેવું જરૂરી નથી.',

  'support.way2Title': 'તમારા શહેર વિશે કહો',

  'support.way2Body': 'તમે જ્યાં રહો છો ત્યાંની ભાષા, રીતિરિવાજ અને મુશ્કેલીઓ અલગ હોય છે. જો તમારા અહીં કંઈ વાત અહીં ન હોય, તો કહો — જે ઉમેરાઈ શકાય તે ઉમેરાઈ જશે.',

  'support.way3Title': 'તમારો અનુભવ બીજાને સંભળાવો',

  'support.way3Body': 'અહીં લખેલું ઘણાને કામ આવી શકે, જો તેમને ખબર પડે. એવી વ્યક્તિને કહો જેને આ ખરેખર મદદ કરે.',

  'support.way4Title': 'અહીં આવીને જુઓ',

  'support.way4Body': 'તમારી પાસે સમય હોય, તો જાતે આવીને જુઓ કે આ સાઇટ ઠીકથી ચાલી રહી છે કે નહીં. કંઈ બગડેલું દેખાય તો કહો — બિલકુલ મફતમાં ઠીક થઈ જશે.',

  'reviews.pageTitle': 'તમારી રાય',

  'reviews.pageIntro': 'અહીં જે લોકોએ લખ્યું છે તે જ લખ્યું છે. કોઈ રાય છુપાવવામાં આવતી નથી, અને જે લખાયું છે તે અહીં જ દેખાય છે — ફક્ત એક વાર જોયા પછી પ્રકાશિત થાય છે.',

  'reviews.intro': 'આ સેવા તમારા કામ આવી? તમારી વાત લખો — તમારું નામ લેવું જરૂરી નથી.',

  'reviews.write': 'તમારી રાય લખો',

  'reviews.starsLabel': '5 માંથી {value} તારા',

  'reviews.summaryTitle': 'સામાન્ય રાય',

  'reviews.summaryLine': 'લોકોએ સરેરાશ {rating} માંથી 5 માંથી {count} તારા આપ્યા.',

  'reviews.count': 'સમીક્ષાઓ',

  'reviews.name': 'તમારું નામ (જરૂરી નથી)',

  'reviews.city': 'તમારું શહેર (જરૂરી નથી)',

  'reviews.placeholder': 'જે મનમાં આવે તે જ લખો — કંઈ સુધારવાની જરૂર નથી.',

  'reviews.keepLabel': 'વાટું લાગે તો સારું લાગે તો — બંને લખો',

  'reviews.fieldTooShort': 'ઓછામાં ઓછા 10 અક્ષર લખો.',

  'reviews.rateLimited': 'ઘણું ઝડપથી મોકલાય છે. થોડું થોંભીને ફરી પ્રયાસ કરો.',

  'reviews.sending': 'મોકલી રહ્યા છીએ…',

  'reviews.moderated': 'તમારી સમીક્ષા પ્રકાશિત થાય તે પહેલાં એક વાર જોવામાં આવે છે.',

  'reviews.moderationNote': 'બધું કાઢી નાખવાનું ટાળવા, પ્રકાશિત થાય તે પહેલાં દરેક સમીક્ષા એક વાર જોવામાં આવે છે. ગાળો, નંબર કે વ્યક્તિગત વાતો કાઢી દેવામાં આવે છે — બાકીનું બધું જેમ છે તેમ જ પ્રકાશિત થાય છે.',

  'reviews.replyLabel': 'આ પર લખેલું છે',

  'reviews.ownerReply': 'જવાબ',

  'reviews.empty': 'હજી કોઈ સમીક્ષા નથી. પહેલી તમે જ લખો.',

  'reviews.anonymous': 'નામ વગર',

  'reviews.toastSent': 'આભાર',

  'reviews.toastFailed': 'રાય મોકલી ન શકાઈ',

  'health.band.infant.note': 'નાનાં બાળકો, જે હજી પોતાનું કહી શકતાં નથી',

  'health.band.child.note': 'બાળકો જે બોલી શકે, પણ પ્રશ્ન પૂછતાં ડરે છે',

  'health.band.teen.note': 'કિશોરો, જેમને ઘણીવાર એવું કોઈ મળતું નથી જે સાંભળે',

  'health.band.young.note': 'નોકરી, પૈસા અને ઊંઘ — ત્રણેય સાથે બોજ',

  'health.band.middle.note': 'ઘર, બાળકો અને પોતાની તબિયત — બધાની જવાબદારી સાથે',

  'health.band.later.note': 'શરીરની ઉંમર અને તેની સંભાળ — બંને સાથે',

  'health.band.senior.note': 'દવા, સંતુલન અને એકલપણ — ત્રણેય સાથે',

  'health.band.elder.note': 'દરેક દવાની ચકાસણી જરૂરી, દરેક પડવું ગંભીર',

  'health.c.infant1': 'તીવ્ર તાવ',

  'health.c.infant2': 'ખાતું નથી',

  'health.c.infant3': 'ઉલટી થાય છે',

  'health.c.infant4': 'ઝાડાનું થાય છે',

  'health.c.child1': 'અભ્યાસમાં મન નથી',

  'health.c.child2': 'શાળાએ જવા ના કરે',

  'health.c.child3': 'રાતે તાવ',

  'health.c.child4': 'દાંત તૂટી રહ્યા',

  'health.c.teen1': 'અભ્યાસનું દબાણ',

  'health.c.teen2': 'ઊંઘ આવતી નથી',

  'health.c.teen3': 'મોબાઇલની ટેવ',

  'health.c.teen4': 'ઘણી ઉદાસી',

  'health.c.young1': 'કામનું તણાવ',

  'health.c.young2': 'બેસતાં પીઠમાં દુખાવો',

  'health.c.young3': 'ઊંઘ આવતી નથી',

  'health.c.young4': 'પૈસા ઓછા',

  'health.c.middle1': 'કમરમાં દુખાવો',

  'health.c.middle2': 'ઊંઘ બરાબર આવતી નથી',

  'health.c.middle3': 'ઘરનું તણાવ',

  'health.c.middle4': 'પેટમાં ગેસ',

  'health.c.later1': 'પીઠમાં દુખાવો',

  'health.c.later2': 'ઘૂટણમાં દુખાવો',

  'health.c.later3': 'રાતે પગ ખેંચાય',

  'health.c.later4': 'સવારે અકડપણ',

  'health.c.senior1': 'ચાલવામાં તકલીફ',

  'health.c.senior2': 'દવાની ચકાસણી',

  'health.c.senior3': 'રાતે પેશાબ',

  'health.c.senior4': 'ઓછું સુંઘાય',

  'health.c.elder1': 'પડવાનો ડર',

  'health.c.elder2': 'યાદશક્તિ નબળી',

  'health.c.elder3': 'રોજની દુખની દવા',

  'health.c.elder4': 'ડૉક્ટર પાસે ક્યારે',

  'health.q.infant1': 'મારા બાળકને તાવ આવ્યો છે, દૂધ પાવું?',

  'health.q.infant2': 'નાનું બાળક ખાતું નથી, શું કરું?',

  'health.q.infant3': 'બાળકને ઉલટી થાય છે, ડૉક્ટરને ક્યારે બતાવું?',

  'health.q.infant4': 'બાળકને ઝાડાનું થાય છે, શું ખિલાવું?',

  'health.q.child1': 'બાળકના અભ્યાસમાં મન લાગતું નથી, શું કરું?',

  'health.q.child2': 'બાળક રોજ સ્કૂલ જવા ના કરે, કારણ શું હોઈ શકે?',

  'health.q.child3': 'બાળકને રાતે તાવ આવે છે, શું કરું?',

  'health.q.child4': 'બાળકના દાંત તૂટી રહ્યા છે, દાંતની સંભાળ કેવી રીતે કરું?',

  'health.q.teen1': 'અભ્યાસનું ઘણું દબાણ છે, તેનો સામ્નો કેવી રીતે કરું?',

  'health.q.teen2': 'રાતે ઊંઘ ઠીકથી આવતી નથી, શું કરું?',

  'health.q.teen3': 'મોબાઇલની ટેવ લાગી ગઈ છે, છોડવાનો ઉપાય કહો.',

  'health.q.teen4': 'ઘણી ઉદાસી લાગે છે, કિસે વાત કરું?',

  'health.q.young1': 'કામનું ઘણું તણાવ છે, કેવી રીતે ઘટાડું?',

  'health.q.young2': 'બેસી રહેતાં પીઠમાં દુખાવો થાય છે, શું કરું?',

  'health.q.young3': 'રાતે ઊંઘ આવતી નથી, શું ઉપાય છે?',

  'health.q.young4': 'પૈસા ઓછા છે અને ખર્ચ વધુ, શું કરું?',

  'health.q.middle1': 'કમરમાં દુખાવો થાય છે, કારણ શું હોઈ શકે?',

  'health.q.middle2': 'ઊંઘ સારી આવતી નથી, સુધારવા શું કરું?',

  'health.q.middle3': 'ઘરમાં ઘણું તણાવ છે, બાળકોને કેવી રીતે સંભાળું?',

  'health.q.middle4': 'કામે વર્ષોથી પેટમાં ગેસની સમસ્યા છે, શું કરું?',

  'health.q.later1': 'મારી ઉંમર 54 વર્ષ છે અને પીઠમાં દુખાવો છે, શું કરું?',

  'health.q.later2': 'ચઢતાં ઘૂટણમાં દુખાવો થાય છે, કેમ?',

  'health.q.later3': 'રાતે પગમાં એંઠણ થાય છે, શું કરું?',

  'health.q.later4': 'સવારે ઊઠીને કમર જકડે છે, કારણ શું હોઈ શકે?',

  'health.q.senior1': 'ઘૂટણમાં એટલો દુખાવો કે ચાલવું મુશ્કેલ છે, શું કરું?',

  'health.q.senior2': 'ઘણી દવાઓ રોજ ખાવી પડે છે — કઈ નુકસાનકારી છે તે કેવી રીતે ખબર પડશે?',

  'health.q.senior3': 'રાતે વારંવાર પેશાબની તકલીફ છે, શું કરું?',

  'health.q.senior4': 'ઓછું સુંઘાય છે, સુંઘવાનો કોઈ ઉપાય કહો.',

  'health.q.elder1': 'ઘરમાં પડી જવાનો ડર છે, કઈ સુરક્ષા રાખું?',

  'health.q.elder2': 'યાદશક્તિ નબળી પડે છે, શું ઉપાય છે?',

  'health.q.elder3': 'રોજ દુખની દવા ખાવી પડે છે — તેનો કોઈ નુકસાન છે?',

  'health.q.elder4': 'ક્યારે ડૉક્ટર પાસે જવું જરૂરી છે?',

  'support.contactMessageLabel': 'તમારી વાત',

  'support.contactPlaceholder': 'જે લખવું હો તે જ લખો — ભૂલ હોય, કંઈ સારું મળે, અથવા કોઈ પ્રશ્ન હોય.',

  'support.contactHelp': 'ઓછામાં ઓછા 10 અક્ષર. આ સીધું માલિક પર્યંતે પહોંચે છે.',

  'support.contactSubmit': 'મોકલો',

  'support.contactSending': 'મોકલી રહ્યા છીએ…',

  'support.contactPrivacy': 'તમારું નામ લખવું જરૂરી નથી.',

  'support.contactSent': 'પહોંચી ગયું',

  'support.contactSentBody': 'તમારી વાત માલિક સુધી પહોંચી ગઈ છે.',

  'support.contactFailed': 'મોકલી શકાયું નહીં',

  'support.faq1Q': 'આ ખરેખર મફત છે?',

  'support.faq1A': 'હા. કોઈ પૈસા લેવાતા નથી, કોઈ જાહેરાત બતાવવાતી નથી, કોઈ સભ્યસત્તા લેવાતી નથી. આ એક વ્યક્તિના પૈસાથી ચાલે છે, કંપની કે સરકારના નહીં.',

  'support.faq2Q': 'મારું નામ, સરનામું કે ફોન નંબર લેવાય છે?',

  'support.faq2A': 'ના, અને લેવામાં આવશે નહીં. આ સાઇટ જાતે કોઈ ઓળખ બનાવતી નથી — કોઈ લોગિન નહીં, કોઈ ટ્રેકિંગ સ્ક્રિપ્ટ નહીં. પૂછાતું તમારો સવાલ જ છે અને ફક્ત એટલું જ સાચવાય છે.',

  'support.faq3Q': 'આ ડૉક્ટર કે વકીલ છે?',

  'support.faq3A': 'ના. આ દવા કે કાનૂની સલાહ આપતી નથી. જ્યાં બાબ ગંભીર હોય ત્યાં આ તમને ડૉક્ટર કે અધિકારી પાસે જવાનું કહે છે — તેમની જગ્યા આ લેતી નથી.',

  'support.faq4Q': 'દરેક જવાબ સાચો હોય છે?',

  'support.faq4A': 'હંમેશાં નહીં. જવાબ કમ્પ્યુટર લખે છે, ડૉક્ટર નહીં — એટલે દરેક જવાબ સાથે લખેલું છે કે આ તબીબી સલાહ નથી. કોઈ દવા શરૂ કે બંદ કરતાં પહેલાં ડૉક્ટરની સલાહ લો.',

  'support.faq5Q': 'મારે કોઈ એપ ડાઉનલોડ કરવી પડશે?',

  'support.faq5A': 'ના. આ ફક્ત બ્રાઉઝરમાં ખૂલે છે. કોઈ એપ ઇન્સ્ટોલ નહીં, કોઈ પરવાનગી નહીં, કોઈ અપડેટ નહીં.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'ઘરેલું ઉપચાર',
  'remedy.title': 'આયુર્વેદિક ઘરેલું ઉપચાર',
  'remedy.intro': 'કોઈ પણ તકલીફ હોય — ઉધરસ, માથું દુખવું, સાંધાનો દુખાવો, ખંજવાળ, ડાયાબિટીસ, પીઠનો દુખાવો — નીચે તમારી તકલીફ પસંદ કરો અથવા તમારા શબ્દોમાં પૂછો. ઘરેલું કાઢો, મસાજ, આહાર અને આયુર્વેદિક ઉપાય જણાવવામાં આવશે.',
  'remedy.choose': 'તમારી તકલીફ પસંદ કરો',
  'remedy.emergencyStrong': 'આ કટોકટી છે:',
  'remedy.emergency': 'સાપ કરડવો, વીંછીનો ડંખ અને કૂતરો કરડવો — તરત હોસ્પિટલ જાઓ, પહેલા 112 પર ફોન કરો. ઘરેલા ઉપાય ફક્ત રસ્તામાં કરવા માટે, હોસ્પિટલની જગ્યાએ નહીં.',
  'remedy.note': 'ઘરેલા અને આયુર્વેદિક ઉપાય તકલીફ ઓછી કરવામાં મદદ કરે છે; ડૉક્ટરની તપાસ અને સારવારની જગ્યા લેતા નથી. કોઈ દવા જાતે શરૂ કે બંધ ન કરો.',
  'remedy.cough': 'ઉધરસ',
  'remedy.headache': 'માથું દુખવું',
  'remedy.joints': 'સાંધાનો દુખાવો',
  'remedy.itching': 'ખંજવાળ',
  'remedy.snake': 'સાપ કરડવો',
  'remedy.scorpion': 'વીંછીનો ડંખ',
  'remedy.dog': 'કૂતરો કરડવો',
  'remedy.diabetes': 'ડાયાબિટીસ',
  'remedy.back': 'પીઠનો દુખાવો',
  'remedy.walking': 'ચાલવામાં તકલીફ',
  'home.remedyNote': 'કાઢો, મસાજ, આહાર અને આયુર્વેદિક ઉપાય — દરેક તકલીફ માટે, તમારી ભાષામાં.',
  'nav.aarti': 'આરતી અને ભજન',
  'aarti.title': 'આરતી અને ભજન — સાચા અવાજમાં',
  'aarti.intro': 'અહીં આરતી, કીર્તન અને ભજન સાંભળો — સાચા ગાયકો અને મંદિરોના અવાજમાં. કોઈ AI અવાજ નહીં.',
  'aarti.note': 'આરતી કે ભજન કમ્પ્યુટરના અવાજમાં વગાડવું એ તેની ચાલ અને ભક્તિ ગુમાવવા જેવું છે. તેથી અહીં ફક્ત સાચી રેકોર્ડિંગ છે.',
  'aarti.kindAarti': 'આરતી',
  'aarti.kindKirtan': 'કીર્તન',
  'aarti.kindBhajan': 'ભજન',
  'aarti.credit': 'રેકોર્ડિંગ:',
  'aarti.licence': 'લાઇસન્સ:',
  'aarti.listenLink': 'સાચા અવાજમાં સાંભળો',
  'aarti.textChecked': 'આ પરંપરાગત પાઠ છે, જેમ સાચી રેકોર્ડિંગમાં ગવાયો છે.',
  'aarti.textPrinted': 'આ પ્રચલિત પાઠ છે, પ્રકાશિત સંગ્રહો સાથે મેળવીને ચકાસાયેલો.',
  'aarti.textNotStored': 'આ ગ્રંથનો આખો પાઠ અહીં સંગ્રહિત નથી — નીચેની રેકોર્ડિંગમાં આખો પાઠ છે.',
  'aarti.granthTitle': 'ગ્રંથ, ચાલીસા અને સ્તોત્ર — સાચા અવાજમાં',
  'aarti.noRecording': 'આ આરતીની સાચી રેકોર્ડિંગ હજી સાઇટ પર નથી, તેથી હું તેને ગાઈને સંભળાવી શકતો નથી — એઆઈ અવાજમાં આરતી કદી ગવાતી નથી.',
  'aarti.textOnlyTitle': 'વધુ આરતીઓ — પાઠ અને સાચો અવાજ',
  'aarti.fullText': 'પૂરો પાઠ',
  'aarti.notChecked': 'આ આરતીનો ચકાસાયેલો પાઠ હજી સાઇટ પર નથી. ચકાસ્યા વિનાનો પાઠ આપવામાં આવતો નથી, કારણ કે પ્રાર્થનામાં ખોટો શબ્દ શબ્દો ન હોવા કરતાં ખરાબ છે.',
  'aarti.verifiedList': 'સાઇટ પર આ આરતીઓના ચકાસાયેલા પાઠ છે:',

};

const KANNADA: Record<string, string> = {
  'jgd.placeSearch': 'ನಿಮ್ಮ ಊರಿನ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ',
  'jgd.placeNoMatch': 'ಆ ಊರು ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ. ಹತ್ತಿರದ ಊರನ್ನು ಆಯ್ಕೆಮಾಡಿ.',

  'account.name': 'ನಿಮ್ಮ ಹೆಸರು',
  'account.namePlaceholder': 'ಉದಾ. ಸೀತಾ ದೇವಿ',
  'account.nameHint': 'ನೀವು ಯಾರು ಎಂದು ತಿಳಿಯಲು. ಯಾವುದೇ ಹೆಸರು ಸ್ವೀಕರಿಸಿದರೂ, ಇದು ಅಗತ್ಯವಿಲ್ಲ.',

  'nav.home': 'ಮುಖಪುಟ', 'home.metaTitle': 'ಉಚಿತ ಪರಿಹಾರ, ನಿಮ್ಮ ಸ್ವಂತ ಪದಗಳಲ್ಲಿ', 'nav.tribute': 'ಸ್ಮರಣೆ', 'nav.help': 'ಸಹಾಯ', 'nav.reference': 'ಪರಿಚಯ',
  'lib.licence.ccZero.name': 'CC0 / ಪಬ್ಲಿಕ್ ಡೊಮೇನ್',
  'lib.licence.pd.name': 'ಪಬ್ಲಿಕ್ ಡೊಮೇನ್',
  'lib.licence.govtIndia.name': 'ಭಾರತ ಸರ್ಕಾರ',
  'lib.licence.creativeCommons.name': 'ಕ್ರಿಯೇಟಿವ್ ಕಾಮನ್ಸ್ (ಮಿಶ್ರ)',
  'lib.licence.freeToRead.name': 'ಓದಲು ಉಚಿತ',
  'lib.entry.ncert.title': 'NCERT ಪುಸ್ತಕಗಳು — ತರಗತಿ 1 ರಿಂದ 12',
  'lib.entry.ncert.what': 'ಪ್ರತಿ ವಿಷಯದ ಎಲ್ಲಾ ಪುಸ್ತಕಗಳು, ಪ್ರತಿ ತರಗತಿಗೆ. ಲಾಗಿನ್ ಇಲ್ಲದೆ, ನೇರ PDF.',
  'lib.entry.ncert.langs': 'ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್ ಮತ್ತು 30ಕ್ಕೂ ಹೆಚ್ಚು ಭಾರತೀಯ ಭಾಷೆಗಳು',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ಡಿಜಿಟಲ್ ಪಠ್ಯಪುಸ್ತಕಗಳು',
  'lib.entry.pm-evidya.what': 'NCERT ಪುಸ್ತಕಗಳ ಆ್ಯಪ್, ದೊಡ್ಡ ಅಕ್ಷರದಲ್ಲಿ ಓದಬಹುದು. ಮಾತನಾಡಿಸಿಯೂ ಕೇಳಬಹುದು.',
  'lib.entry.pm-evidya.langs': 'ಭಾರತೀಯ ಭಾಷೆಗಳು',
  'lib.entry.diksha.title': 'DIKSHA — ಶಿಕ್ಷಕರಿಗೆ ಮತ್ತು ಮಕ್ಕಳಿಗೆ',
  'lib.entry.diksha.what': 'ಪಾಠಗಳು, ವೀಡಿಯೊ ಮತ್ತು ಅಭ್ಯಾಸ — ತರಗತಿ 1 ರಿಂದ 12.',
  'lib.entry.diksha.langs': 'ಭಾರತೀಯ ಭಾಷೆಗಳು',
  'lib.entry.khan-academy.title': 'Khan Academy — ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಗಣಿತ ಮತ್ತು ವಿಜ್ಞಾನ',
  'lib.entry.khan-academy.what': 'ಪ್ರತಿ ತರಗತಿವರೆಗೂ ವೀಡಿಯೋ ಪಾಠಗಳು, ಬರಹದ ಪಠ್ಯವೂ ಇದೆ.',
  'lib.entry.openstax.title': 'OpenStax — ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಉಚಿತ ಪುಸ್ತಕಗಳು',
  'lib.entry.openstax.what': 'ಕಾಲೇಜು ಮಟ್ಟದ ಪುಸ್ತಕಗಳು — ಗಣಿತ, ವಿಜ್ಞಾನ, ಮಾನವಶಾಸ್ತ್ರ. ಪ್ರತಿಪುಟಕ್ಕೂ PDF.',
  'lib.entry.nios.title': 'NIOS — ದೂರ ಶಿಕ್ಷಣ, ಉಚಿತ ಸಾಮಗ್ರಿ',
  'lib.entry.nios.what': 'ಓಪನ್ ಮತ್ತು ಆನ್‌ಲೈನ್ ಕೋರ್ಸ್‌ಗಳ ಉಚಿತ ಪುಸ್ತಿಕೆಗಳು, ದಾಖಲೆ ಇಲ್ಲದೆ.',
  'lib.entry.nios.langs': 'ಹಿಂದಿ, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಇತರೆ',
  'lib.entry.ignou.title': 'IGNOU — ಉನ್ನತ ಅಧ್ಯಯನಕ್ಕೆ ಉಚಿತ ಪುಸ್ತಕಗಳು',
  'lib.entry.ignou.what': 'ದೂರ ಶಿಕ್ಷಣದ ಪುಸ್ತಕಗಳು, ಸಂಪೂರ್ಣ ಉಚಿತ.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ಇಂಗ್ಲಿಷ್ ಹಳೆಯ ಪುಸ್ತಕಗಳು',
  'lib.entry.gutenberg.what': '70,000ಕ್ಕೂ ಹೆಚ್ಚು ಪುಸ್ತಕಗಳು, ಎಲ್ಲದರ ಕಾಪಿರೈಟ್ ಮುಗಿದಿದೆ. ಉಚಿತ ಇ-ಪುಸ್ತಕ ಮತ್ತು ಧ್ವನಿ.',
  'lib.entry.pratham-books.title': 'Pratham Books — ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು',
  'lib.entry.pratham-books.what': 'ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಮಕ್ಕಳ ಪುಸ್ತಕಗಳು, ಸಂಪೂರ್ಣ ಉಚಿತ. ತರಗತಿ 1 ರಿಂದ 5ಗೆ.',
  'lib.entry.pratham-books.langs': 'ಹಿಂದಿ, ಮರಾಠಿ, ಬಂಗಾಳಿ, ತಮಿಳು, ತೆಲುಗು ಮತ್ತು ಇನ್ನಷ್ಟು',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಹಳೆಯ ನಿಯತಕಾಲಿಕೆಗಳು',
  'lib.entry.internet-archive-texts.what': 'ಲಕ್ಷಾಂತರ ಹಳೆಯ ಪುಸ್ತಕಗಳು, ನಿಯತಕಾಲಿಕೆಗಳು, ಪತ್ರಿಕೆಗಳು — ಉಚಿತ.',
  'lib.entry.wikisource.title': 'Wikisource — ಉಚಿತ ಸಾರ್ವಜನಿಕ ಪಠ್ಯಗಳು',
  'lib.entry.wikisource.what': 'ಕಾಪಿರೈಟ್ ಇಲ್ಲ — ಇವು ಜಗತ್ತಿನ ಹಳೆಯ ಸಾಹಿತ್ಯದ ಪುಸ್ತಕಗಳು.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ಪ್ರತಿ ರೀತಿಯ ಚಿತ್ರಗಳು',
  'lib.entry.wikimedia-commons.what': 'ಪ್ರಾಣಿಗಳು, ನಕ್ಶೆಗಳು, ನಕ್ಷತ್ರಗಳು, ಇತಿಹಾಸ — ಎಲ್ಲವೂ. ಪ್ರತಿ ಚಿತ್ರಕ್ಕೂ ತನ್ನದೇ ಪರವಾನಗಿ ಇದೆ.',
  'lib.entry.pixabay.title': 'Pixabay — ಫೋಟೋಗಳು ಮತ್ತು ಚಿತ್ರಗಳು',
  'lib.entry.pixabay.what': 'ಫೋಟೋಗಳು, ರೇಖಾಚಿತ್ರಗಳು, ಚಿಕ್ಕ ವೀಡಿಯೊಗಳು.',
  'lib.entry.unsplash.title': 'Unsplash — ಸುಂದರ ಫೋಟೋಗಳು',
  'lib.entry.unsplash.what': 'ಉಚಿತ, ದೊಡ್ಡ ಗಾತ್ರದಲ್ಲಿ, ಖಾತೆ ಅಗತ್ಯವಿಲ್ಲ.',
  'lib.entry.openverse.title': 'Openverse — ಎಲ್ಲಾ ಉಚಿತ ಚಿತ್ರಗಳು ಒಂದೇ ಕಡೆ',
  'lib.entry.openverse.what': 'ಒಟ್ಟಿಗೆ ಹಲವು ಉಚಿತ ಚಿತ್ರ ತಾಣಗಳನ್ನು ಹುಡುಕಿ.',
  'lib.entry.librivox.title': 'LibriVox — ಕೇಳಲು ಪುಸ್ತಕಗಳು',
  'lib.entry.librivox.what': 'ಹಳೆಯ ಇಂಗ್ಲಿಷ್ ಪುಸ್ತಕಗಳ ಉಚಿತ ಧ್ವನಿ, ಮನುಷ್ಯರ ಧ್ವನಿಯಲ್ಲಿ.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ಧ್ವನಿ ಸಂಗ್ರಹ',
  'lib.entry.internet-archive-audio.what': 'ಸಾವಿರಾರು ಉಚಿತ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು — ಪುಸ್ತಕಗಳು, ಭಾಷಣಗಳು, ಸಂಗೀತ.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — ರಾಷ್ಟ್ರೀಯ ಗೀತೆ ಮತ್ತು ಇತರೆ',
  'lib.entry.vande-mataram.what': 'ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಗೀತೆ ಮತ್ತು ಇತರ ರಾಷ್ಟ್ರೀಯ ಗೀತೆಗಳು, ಉಚಿತ.',
  'art.aag-aur-bijli-ke-bachav.title': 'ಬೆಂಕಿ ಮತ್ತು ವಿದ್ಯುತ್‌ನಿಂದ ಪಾರಾಗುವ ನಿಯಮಗಳು',
  'art.aag-aur-bijli-ke-bachav.summary': 'ಮನೆಯಲ್ಲಿ ಬೆಂಕಿ ಅನಾಹುತ ತಡೆಯುವುದು — ಸರಳ ನಿಯಮಗಳು',
  'art.aag-lagne-par-kya-karein.title': 'ಬೆಂಕಿ ತಗುಲಿದರೆ ಏನು ಮಾಡಬೇಕು',
  'art.aag-lagne-par-kya-karein.summary': 'ಉರಿಯುತ್ತಿರುವ ಮನೆಯಲ್ಲಿ ಬೆಂಕಿ — ಮೊದಲು ಏನು ಮಾಡಬೇಕು, ಏನು ಮಾಡಬಾರದು',
  'art.bimari-se-bachav.title': 'ಸೋಂಕಿನಿಂದ ಪಾರಾಗುವ ಏಳು ನಿಯಮಗಳು',
  'art.bimari-se-bachav.summary': 'ಕೈ ತೊಳೆಯುವುದು, ಮಾಸ್ಕ್, ಲಸಿಕೆ — ಹೇಗೆ ಸುರಕ್ಷಿತರಾಗಬೇಕು',
  'art.dhuwan-ka-jhakora.title': 'ಹೊಗೆಯಿಂದ ಉಸಿರುಕಟ್ಟುವುದರಿಂದ ಪಾರಾಗುವುದು',
  'art.dhuwan-ka-jhakora.summary': 'ಉಸಿರು ನಿಂತಿದೆ, ಗಾಳಿ ಬರುತ್ತಿಲ್ಲ — ಏನು ಮಾಡಬೇಕು, ಯಾವಾಗ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕು',
  'art.doodh-pani-band-ho.title': 'ವಿದ್ಯುತ್ ಅಥವಾ ನೀರು ಇದ್ದಕ್ಕಿದ್ದಂತೆ ನಿಂತರೆ',
  'art.doodh-pani-band-ho.summary': 'ಏನು ಮಾಡಬೇಕು, ಏನು ತಪ್ಪಿಸಬೇಕು, ಯಾವಾಗ ಸಹಾಯ ಕೇಳಬೇಕು',
  'art.haath-ki-saafai.title': 'ಸಾಬುನ ಇಲ್ಲದೆ ಕೈ ಸ್ವಚ್ಛ ಮಾಡುವ ವಿಧಾನ',
  'art.haath-ki-saafai.summary': 'ನೀರು ಅಥವಾ ಸಾಬುನ ಇಲ್ಲದಿದ್ದಾಗ',
  'cat.dhyan-aur-yoog.title': 'ಧ್ಯಾನ ಮತ್ತು ಯೋಗ',
  'cat.dhyan-aur-yoog.subtitle': 'ಮನವನ್ನು ಶಾಂತಪಡಿಸುವ ಸರಳ ವಿಧಾನಗಳು',
  'cat.gharelu-marammat.title': 'ಮನೆ ದುರಸ್ತಿ',
  'cat.gharelu-marammat.subtitle': 'ಮನೆಯ ಸಣ್ಣ ಸಮಸ್ಯೆಗಳಿಗೆ ಪರಿಹಾರಗಳು',
  'cat.bachchon-ki-padhai.title': 'ಮಕ್ಕಳ ಓದು',
  'cat.bachchon-ki-padhai.subtitle': 'ಓದಿನಲ್ಲಿ ತೊಡಗಿದ್ದಾರೆ, ಚಿಂತೆಯಲ್ಲಿ',
  'cat.budharge-seva.title': 'ಹಿರಿಯರ ಸೇವೆ',
  'cat.budharge-seva.subtitle': 'ಆರೈಕೆ ಮತ್ತು ಸಹಾಯ',
  'cat.shishu-dekhbhal.title': 'ಶಿಶು ಆರೈಕೆ',
  'cat.shishu-dekhbhal.subtitle': 'ಚಿಕ್ಕ ಮಗುವಿನ ಸರಿಯಾದ ಆರೈಕೆ',
  'cat.dharmik-upay.title': 'ಧಾರ್ಮಿಕ ಪರಿಹಾರಗಳು',
  'cat.dharmik-upay.subtitle': 'ಶಾಂತ ಮನಸ್ಸಿನೊಂದಿಗೆ',
  'cat.pavan-grah-aur-aarti.title': 'ಪವಿತ್ರ ಗ್ರಂಥ ಮತ್ತು ಆರತಿ',
  'cat.pavan-grah-aur-aarti.subtitle': 'ಭಕ್ತಿಯಿಂದ ಓದಿ ಕೇಳಿ',
  'cat.aapatkalen-gayide.title': 'ತುರ್ತು ಮಾರ್ಗದರ್ಶಿ',
  'cat.aapatkalen-gayide.subtitle': 'ತಕ್ಷಣ ಸಹಾಯ ಬೇಕಾದಾಗ',
  'cat.mahamari-suraksha.title': 'ಮಹಾಮಾರಿ ರಕ್ಷಣೆ',
  'cat.mahamari-suraksha.subtitle': 'ರೋಗ ಹರಡದಂತೆ ತಡೆಯುವುದು',
  'nav.reviews': 'ಅಭಿಪ್ರಾಯ', 'nav.support': 'ಸಹಾಯ ಮಾಡಿ', 'nav.menu': 'ಮೆನು',
  'nav.birthChart': 'ಜನ್ಮ ಗಂಠ',
  'jgd.title': 'ನಿಮ್ಮ ಜನ್ಮ ಗಂಠ',
  'jgd.intro': 'ನಿಮ್ಮ ಹೆಸರು, ಜನನ ದಿನಾಂಕ, ತಿಳಿದಿದ್ದರೆ ಸಮಯ ಮತ್ತು ಸ್ಥಳ. ಎಲ್ಲವೂ ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲೇ ಲೆಕ್ಕವಾಗುತ್ತದೆ — ಎಲ್ಲಿಗೂ ಕಳುಹಿಸಲ್ಪಡುವುದಿಲ್ಲ.',
  'jgd.nameLabel': 'ಜನನ ಹೆಸರು',
  'jgd.namePlaceholder': 'ಉದಾ. ಪೂರ್ಣ ಹೆಸರು',
  'jgd.nameHint': 'ಚಿಕ್ಕವಯಸ್ಸಿನಲ್ಲಿ ಕೊಟ್ಟ ಹೆಸರು.',
  'jgd.dateLabel': 'ಜನನ ದಿನಾಂಕ',
  'jgd.timeLabel': 'ಜನನ ಸಮಯ',
  'jgd.timeHint': 'ಗೊತ್ತಿಲ್ಲದಿದ್ದರೆ ಖಾಲಿ ಬಿಡಿ.',
  'jgd.placeLabel': 'ಜನನ ಸ್ಥಳ',
  'jgd.placeNone': 'ಗೊತ್ತಿಲ್ಲ / ಆಯ್ಕೆಮಾಡಿ',
  'jgd.placeHint': 'ಜನನ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ.',
  'jgd.submit': 'ಲೆಕ್ಕಿಸಿ',
  'jgd.savePdf': 'PDF ಮಾಡಿ',
  'jgd.again': 'ಮತ್ತೆ ಲೆಕ್ಕಿಸಿ',
  'jgd.errDate': 'ಜನನ ದಿನಾಂಕವನ್ನು ಸರಿಯಾಗಿ ನಮೂದಿಸಿ.',
  'jgd.errPlace': 'ಪಟ್ಟಿಯಿಂದ ನಿಮ್ಮ ಊರನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಅಥವಾ ಹತ್ತಿರದ ಊರನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  'jgd.numTitle': 'ಸಂಖ್ಯಾ ಜ್ಯೋತಿಷ',
  'jgd.lifePath': 'ಜೀವನ ಮಾರ್ಗ',
  'jgd.nameNumber': 'ಹೆಸರಿನ ಸಂಖ್ಯೆ',
  'jgd.soulNumber': 'ಆತ್ಮಾ ಸಂಖ್ಯೆ',
  'jgd.birthdayNumber': 'ಜನನದಿನ ಸಂಖ್ಯೆ',
  'jgd.astroTitle': 'ವೈದಿಕ ಜ್ಯೋತಿಷ',
  'jgd.nakshatra': 'ನಕ್ಷತ್ರ',
  'jgd.pada': 'ಪದ',
  'jgd.rashi': 'ರಾಶಿ',
  'jgd.rashiLord': 'ರಾಶಿ ಸ್ವಾಮಿ',
  'jgd.nakshatraLord': 'ನಕ್ಷತ್ರ ಸ್ವಾಮಿ',
  'jgd.lagna': 'ಲಗ್ನ',
  'jgd.lagnaMissing': 'ಲಗ್ನಕ್ಕೆ ಜನನ ಸಮಯ ಮತ್ತು ಸ್ಥಳ ಬೇಕು. ಮೇಲೆ ತುಂಬಿ ಮತ್ತೆ ಲೆಕ್ಕಿಸಿ — ಗೊತ್ತಿಲ್ಲದಿದ್ದರೆ ಇದೂ ಸಾಕು.',
  'jgd.gunTitle': 'ಗುಣ ಮಿಲನ',
  'jgd.gunIntro': 'ಇನ್ನೊಬರ ಹೆಸರು ಮತ್ತು ಜನನ ದಿನಾಂಕ ನಮೂದಿಸಿ.',
  'jgd.gunName': 'ಅವರ ಹೆಸರು',
  'jgd.gunDate': 'ಅವರ ಜನನ ದಿನಾಂಕ',
  'jgd.gunHint': 'ಎರಡೂ ಹೆಸರು ಮತ್ತು ದಿನಾಂಕಗಳಿದ್ದರೆ ಗುಣ ಮಿಲನ ಸಿಗುತ್ತದೆ.',
  'jgd.disclaimer': 'ಇದು ಪಾರಂಪರಿಕ ವಿಧದಲ್ಲಿ ಮಾಡಿದ ಲೆಕ್ಕ, ಭವಿಷ್ಯವಾಣಿ ಅಲ್ಲ. ಯಾವುದೇ ಸಂಖ್ಯೆ ಅಥವಾ ರಾಶಿ ಯಾರ ಆರೋಗ್ಯ, ಹಣ ಅಥವಾ ಸಂಬಂಧವನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ. ದೊಡ್ಡ ನಿರ್ಧಾರಕ್ಕೆ ವೈದ್ಯ, ಅಭಿಜ್ಞ ಅಥವಾ ಅನುಭವಿ ವ್ಯಕ್ತಿಯ ಸಲಹೆ ಪಡೆಯಿರಿ.',
  'nav.openMenu': 'ಮೆನು ತೆರೆಯಿರಿ', 'nav.closeMenu': 'ಮೆನು ಮುಚ್ಚಿ', 'nav.language': 'ಭಾಷೆ ಬದಲಿಸಿ',
  'nav.skip': 'ನೇರವಾಗಿ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
  'ask.label': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ', 'ask.placeholder': 'ಉದಾ.: ಮಕ್ಕಳ ಓದುವಿಕೆ ದುರ್ಬಲತೆ',
  'ask.help': 'ಎಂಟರ್ ಒತ್ತಿದರೂ ಕಳುಹಿಸಬಹುದು.', 'ask.send': 'ಕೇಳಿ', 'ask.sending': 'ಯೋಚಿಸುತ್ತಿದೆ…',
  'ask.speak': 'ಮಾತನಾಡಿ ಕೇಳಿ', 'ask.listening': 'ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ…',
  'ask.suggested': 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು', 'ask.answerTitle': 'ಉತ್ತರ', 'ask.listen': 'ಕೇಳಿ', 'ask.stopSpeak': 'ನಿಲ್ಲಿಸಿ',
  'ask.aiNote': 'ಈ ಉತ್ತರವನ್ನು AI ನೀಡಿದೆ. ತಜ್ಞರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಿಲ್ಲ.',
  'sound.title': 'ಶಾಂತಿಗೆ ಧ್ವನಿ', 'sound.intro': 'ಶುಲ್ಕವಿಲ್ಲ, ಜಾಹೀರಾತವಿಲ್ಲ.',
  'home.soundTitle': 'ಶಾಂತಿಗೆ ಧ್ವನಿ',
  'sound.shankh': 'ಶಂಖ', 'sound.bansuri': 'ಬಂಸಿ', 'sound.dhol': 'ಢೋಲ್', 'sound.all': 'ಮೂರು',
  'dhun.welcome': 'ಸ್ವಾಗತ', 'dhun.prompt': 'ಶಂಖ, ಕೊಳಲು, ಢೋಲ್ ಜೊತೆ ಕೇಳಲು ಮುಟ್ಟಿ.',
  'dhun.listen': 'ಕೇಳಿ', 'dhun.skip': 'ಬಿಟ್ಟುಬಿಡಿ',
  'home.readMore': 'ಪೂರ್ಣ ಮಾಹಿತಿ ಓದಿ', 'home.chooseTopic': 'ಯಾವ ವಿಷಯ ತಿಳಿಯಬೇಕು?',
  'home.askHere': 'ಈ ವಿಷಯದಲ್ಲಿ ಕೇಳಿ', 'home.howTitle': 'ಈ ಸೇವೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
  'home.freeTitle': 'ಈ ಸೇವೆ ಸಂಪೂರ್ಣ ಉಚಿತ', 'home.freeBody': 'ಹಣ ಪಡೆಯುವುದಿಲ್ಲ, ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ, ಜಾಹೀರಾತೆ ಇಲ್ಲ.',
  'footer.pages': 'ಪುಟಗಳು', 'footer.helplines': 'ಮುಖ್ಯ ಸಂಖ್ಯೆಗಳು',
  'reviews.title': 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ, ನಿಮ್ಮ ಮಾತು', 'reviews.submit': 'ಕಳುಹಿಸಿ',
  'language.choose': 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', 'language.articlesIn': 'ಈ ಲೇಖನ ಹಿಂದಿಯಲ್ಲಿದೆ.',

  'ask.welcome': 'ಸ್ವಾಗತ! ಕೆಳಗೆ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಒಂದು ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',

  'ref.notTitle': 'ಇದು ಏನು ಮಾಡುವುದಿಲ್ಲ',

  'ref.not1': 'ಇದು ವೈದ್ಯ ಅಲ್ಲ. ಔಷಧಿಯ ಸಲಹೆ ಎಂದಿಗೂ ನೀಡಲಾಗುವುದಿಲ್ಲ.',

  'ref.not2': 'ಇದು ವಕೀಲ ಅಲ್ಲ. ಕಾನೂನು ಸಲಹೆ ನೀಡಲಾಗುವುದಿಲ್ಲ.',

  'ref.not3': 'ಯಾವುದೇ ಹಣ ತೆಗೆಯುವುದಿಲ್ಲ, ಮತ್ತು ಯಾವುದೇ ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ.',

  'ref.not4': 'ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ನಂಬರ್ ಕೇಳುವುದಿಲ್ಲ ಮತ್ತು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.',

  'ref.not5': 'ಸರ್ಕಾರಿ ಯೋಜನೆಯ ದರ ಅಥವಾ ಸಂಖ್ಯೆ ಕಟ್ಟುವುದಿಲ್ಲ — ಮಾಹಿತಿ ಇಲ್ಲದಿದ್ದರೆ ಸ್ಪಷ್ಟವಾಗೆ ತಿಳಿಸಲಾಗುತ್ತದೆ.',

  'ref.medicalTitle': 'ಮುಖ್ಯ: ಇದು ವೈದ್ಯರ ಸಲಹೆ ಅಲ್ಲ',

  'ref.medicalBody': 'ರೋಗ, ಔಷಧಿ ಅಥವಾ ವಿಷದ ಬಗ್ಗೆ ಇದ್ದರೆ ಮೊದಲು ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ. ಇಲ್ಲಿ ನೀಡಿದ ಮಾಹಿತಿ ಸಾಮಾನ್ಯ ಸಹಾಯಕ್ಕಾಗಿ ಮಾತ್ರ. ಮಗುವಿನ ಲಸಿಕೆ, ಗರ್ಭಿಣಿ, ಅಥವಾ ಯಾವುದೇ ಔಷಧಿ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ತಪ್ಪದೆ ಪಡೆಯಿರಿ.',

  'ref.statsTitle': 'ಎಷ್ಟು ಮಾಹಿತಿ ಇದೆ',

  'support.howTitle': 'ನೀವು ನಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು',

  'support.alwaysFreeTitle': 'ಈ ಸೇವೆ ಯಾವಾಗಲೂ ಉಚಿತವಾಗಿರುತ್ತದೆ',

  'support.alwaysFreeBody': 'ಸಿಗುವ ಸಹಾಯ ಈ ಸೇವೆ ನಡೆಸಲು ಬಳಸಲಾಗುತ್ತದೆ. ಯಾರಿಂದೂ ಒಂದು ಹಣ ತೆಗೆಯಲಾಗುವುದಿಲ್ಲ.',

  'smriti.eyebrow': 'ಸ್ಮರಣದಲ್ಲಿ',

  'smriti.whyTitle': 'ಈ ಸೈಟ್ ಏಕೆ ಇದೆ',

  'smriti.ending': 'ಅವಳ ಹೋರಾಟ ಇಲ್ಲಿಯೇ ಮುಂದುವರೆದುಕೊಳ್ಳುತ್ತದೆ.',

  'article.askAny': 'ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ',

  'article.remember': 'ನೆನಪಿಡಿ',

  'article.emergencyInfo': 'ಮುಖ್ಯ ಮಾಹಿತಿ',

  'article.medicalTitle': 'ಇದು ವೈದ್ಯ ಸಲಹೆ ಅಲ್ಲ',

  'article.medicalBody': 'ಈ ಮಾಹಿತಿ ಸಾಮಾನ್ಯ ಸಹಾಯಕ್ಕೆ. ವೈದ್ಯರ ಸಲಹೆ ಇಲ್ಲದೆ ಯಾವುದೇ ಔಷಧ ಪ್ರಾರಂಭಿಸಬೇಡಿ ಅಥವಾ ನಿಲ್ಲಿಸಬೇಡಿ.',

  'article.heading': '{category} ಬಗ್ಗೆ ಲೇಖನಗಳು',

  'reviews.rateQuestion': 'ಎಷ್ಟು ನಕ್ಷತ್ರ ನೀಡುತ್ತೀರಿ?',

  'reviews.starsShort': '{value} ನಕ್ಷತ್ರ',

  'reviews.averageOutOf': '5 ರಲ್ಲಿ {value} ನಕ್ಷತ್ರ',

  'dhun.welcomeTitle': 'ಸ್ವಾಗತ',

  'dhun.consent': 'ಶಂಖ, ಬಾಂಸುರಿ ಮತ್ತು ಡೊಲ್ ಜೊತೆಗೆ. ಕೇಳಲು ಮುಟ್ಟಿ.',

  'dhun.failed': 'ಧ್ವನಿ ಪ್ಲೇ ಆಗಲಿಲ್ಲ.',

  'dhun.unsupported': 'ಈ ಬ್ರೌಸರ್ ಧ್ವನಿ ಪ್ಲೇ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',

  'dhun.failedTry': 'ಧ್ವನಿ ಪ್ಲೇ ಮಾಡುವಲ್ಲಿ ಸಮಸ್ಯೆ ಆಗಿದೆ.',

  'sound.hintIdle': 'ಯಾವುದೇ ಬಟನ್ ಒತ್ತಿ ಧ್ವನಿ ಕೇಳಿ.',

  'sound.hintPlaying': 'ಧ್ವನಿ ಪ್ಲೇ ಆಗುತ್ತಿದೆ. ನಿಲ್ಲಿಸಲು ಅದೇ ಬಟನ್ ಮತ್ತೆ ಒತ್ತಿ.',

  'sound.preparing': 'ಧ್ವನಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ',

  'nav.path': 'ಮಾರ್ಗ',

  'toast.dismiss': 'ಮುಚ್ಚಿ',

  'footer.free': 'ಈ ಸೇವೆ ಸಂಪೂರ್ಣವಾಗಿ ಉಚಿತ. ಯಾರಿಂದೂ ಹಣ ಪಡೆಯುವುದಿಲ್ಲ.',

  'cat.empty': 'ಈ ವಿಷಯದಲ್ಲಿ ಇನ್ನೂ ಲೇಖನಗಳಿಲ್ಲ.',
  'cat.notFound': 'ಈ ಪುಟ ಸಿಗಲಿಲ್ಲ',

  'dhun.label': 'ಧ್ವನಿ ಪ್ಲೇ ಮಾಡಲು ಅನುಮತಿ',

  'language.articlesInHint': 'ಪ್ರತಿ ಭಾಷೆಗೆ ಪ್ರತ್ಯೇಕ ಅನುವಾದ ಬೇಕು. ಈ ಅನುವಾದ ಇನ್ನೂ ಆಗಿಲ್ಲ — ಬರೆದಿರುವುದು ಹಿಂದಿಯಲ್ಲೇ ಸರಿಯಾದದ್ದು ಮತ್ತು ಪೂರ್ಣವಾಗಿದೆ.',

  'nav.collapse': 'ಟ್ಯಾಬ್ ಮುಚ್ಚಿ',

  'nav.expand': 'ಟ್ಯಾಬ್ ತೆರೆ',

  'theme.toDark': 'ಕಡು ಬಣ್ಣಕ್ಕೆ ಹೋಗಿ',

  'theme.toLight': 'ಉಜ್ಜಲ ಬಣ್ಣಕ್ಕೆ ಹೋಗಿ',

  'ask.clear': 'ಬರೆದಿರುವುದನ್ನು ಅಳಿಸಿ',

  'ask.emptyAnswer': 'ಈ ಬಾರಿ ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಬೇರೆಯ ಮಾತನಾಡಿ ಮತ್ತೆ ಕೇಳಿ.',

  'ask.errorNetwork': 'ಇಂಟರ್ನೆಟ್ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'ask.errorRateLimit': 'ಒಂದೇ ಸಮಯದಲ್ಲಿ ಹಲವಾದ ಪ್ರಶ್ನೆಗಳು ಕಳುಹಿಸಲ್ಪಟ್ಟಿವೆ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',

  'ask.heardWith': 'ಈಗ ಕೇಳುತ್ತಿದ್ದೇವೆ',
  'ask.heard': 'ಕೇಳುತ್ತಿದ್ದೇವೆ',

  'ask.micUnsupported': 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ ಕೇಳುವುದು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. ಬರೆದು ಕೇಳಿ.',

  'ask.notAnswer': 'ಈ ಪ್ರಶ್ನೆಗೆ ನೇರ ಉತ್ತರ ನಮ್ಮ ಬಳಿ ಇಲ್ಲ.',


  'ask.stopListening': 'ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ',

  'article.askAbout': 'ಈ ವಿಷಯದಲ್ಲಿ ಕೇಳಿ',

  'article.count': '{count} ಲೇಖನಗಳು',

  'article.emergency': 'ಅಗತ್ಯ',

  'article.others': 'ಈ ವಿಷಯದ ಇನ್ನಷ್ಟು ಲೇಖನಗಳು',

  'article.readAloud': 'ಈ ಲೇಖನವನ್ನು ಕೇಳಿ',

  'footer.admin': 'ನಿರ್ವಹಣೆ',

  'footer.ambulance': 'ಆಂಬ್ಯುಲೆನ್ಸ್',

  'footer.emergency': 'ತುರ್ತು',

  'footer.readStory': 'ಅವರ ಪೂರ್ಣ ಕಥೆ ಓದಿ',

  'footer.rights': 'ಉಚಿತ ಸೇವೆ',

  'footer.women': 'ಮಹಿಳಾ ಸಹಾಯ',

  'sound.allHint': 'ಒಂದಾಗ',

  'sound.bansuriHint': 'ಮೃದು, ನಿಧಾನ',

  'sound.dholHint': 'ತೀವ್ರ, ವೇಗದ',

  'sound.errGeneric': 'ಧ್ವನಿ ಪ್ಲೇ ಮಾಡುವಲ್ಲಿ ಸಮಸ್ಯೆ ಆಗಿದೆ.',

  'sound.errUnsupported': 'ಈ ಬ್ರೌಸರ್ ಧ್ವನಿ ಪ್ಲೇ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',

  'sound.listenLabel': 'ಕೇಳಿ',

  'sound.playing': 'ಧ್ವನಿ ಪ್ಲೇ ಆಗುತ್ತಿದೆ. ನಿಲ್ಲಿಸಲು ಅದೇ ಬಟನ್ ಮತ್ತೆ ಒತ್ತಿ.',

  'sound.shankhHint': 'ಗಾಢ, ಉದ್ದ',

  'voice.aborted': 'ನಿಲ್ಲಿಸಲಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'voice.audioCapture': 'ಮೈಕ್ ಸಿಗಲಿಲ್ಲ. ಸಾಧನ ಸಂಪರ್ಕಿಸಿ, ಅಥವಾ ಬರೆದು ಕೇಳಿ.',

  'voice.generic': 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'voice.network': 'ಮಾತನಾಡಿ ಕೇಳಲು ಇಂಟರ್ನೆಟ್ ಬೇಕು, ಅದು ಇಲ್ಲ. ಬರೆದು ಕೇಳಿ — ಅದೇ ಉತ್ತರ ಸಿಗುತ್ತದೆ.',

  'voice.noSpeech': 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮೈಕ್ ಹತ್ತಿರ ಮಾತನಾಡಿ, ಅಥವಾ ಬರೆಯಿರಿ.',

  'voice.notAllowed': 'ಮೈಕ್‌ಗೆ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ಮೇಲಕ್ಕೆ ಹೋಗಿ ಅನುಮತಿ ನೀಡಿ, ಅಥವಾ ಬರೆದು ಕೇಳಿ.',

  'voice.serviceNotAllowed': 'ಮೈಕ್‌ಗೆ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ಮೇಲಕ್ಕೆ ಹೋಗಿ ಅನುಮತಿ ನೀಡಿ, ಅಥವಾ ಬರೆದು ಕೇಳಿ.',

  'voice.speakFailed': 'ಈ ಉತ್ತರವನ್ನು ಓದಿ ಕೇಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
  'voice.noVoice': 'ಈ ಸಾಧನದಲ್ಲಿ {name} ಧ್ವನಿ ಇಲ್ಲ. ಈಗ ಬರೆದಿರುವುದನ್ನು ಓದಿ, ಅಥವಾ ಫೋನ್ ಸೆಟ್ಟಿಂಗ್\u200cಗಳಲ್ಲಿ ಧ್ವನಿ ಸೇರಿಸಿ.',

  'voice.unsupported': 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ ಕೇಳುವುದು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. ಬರೆದು ಕೇಳಿ.',

  'ask.notConfigured': 'ಈ ಸೇವೆ ಈಗ ಉಳಿಸಿದ ಉತ್ತರಗಳ ದಾಸ್ತಾನದಿಂದ ಉತ್ತರಿಸುತ್ತಿದೆ. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅದರಲ್ಲಿ ಇಲ್ಲ.',

  'ask.browseTitle': 'ಇಲ್ಲಿರುವ ಲೇಖಗಳನ್ನು ನೋಡಿ',

  'health.heading': 'ನಿಮ್ಮ ವಯಸ್ಸು ತಿಳಿಸಿ',

  'health.intro': 'ವಯಸ್ಸಿಗೆ ತಕ್ಕಂತೆ ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ. ಯಾವುದೇ ಬಟನ್ ಒತ್ತಿ — ಪ್ರಶ್ನೆ ಕೆಳಗೆ ತುಂಬಲಾಗುತ್ತದೆ, ನಂತರ ಕೇಳಿ.',

  'health.ageLabel': 'ವಯಸ್ಸು (ವರ್ಷ)',

  'health.years': 'ವರ್ಷ',

  'health.bandsLabel': 'ವಯಸ್ಸಿಗೆ ತಕ್ಕಂತೆ ಆಯ್ಕೆಮಾಡಿ',

  'health.notAdviceStrong': 'ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ.',

  'health.notAdvice': 'ಯಾವುದೇ ಔಷಧಿ ಆರಂಭಿಸಬೇಡಿ ಅಥವಾ ನಿಲ್ಲಿಸಬೇಡಿ — ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.',

  'health.emergencyStrong': 'ಅಪಾಯಕಾರಿ ಸ್ಥಿತಿಯಲ್ಲಿ ಫೋನ್ ಮಾಡಿ:',

  'health.emergencyCall': '(ಅಪಾಯ)',

  'health.emergencyAmbulance': '(ಆಂಬ್ಯುಲೆನ್ಸ್)',

  'health.emergencyWomen': '(ಮಹಿಳಾ ಸಹಾಯ)',

  'health.privacy': 'ಹೆಸರು ಅಥವಾ ವಿಳಾಸ ಬರೆಯುವುದು ಅಗತ್ಯವಿಲ್ಲ.',

  'health.band.infant.label': '0 – 2 ವರ್ಷ',

  'health.band.child.label': '3 – 12 ವರ್ಷ',

  'health.band.teen.label': '13 – 17 ವರ್ಷ',

  'health.band.young.label': '18 – 30 ವರ್ಷ',

  'health.band.middle.label': '31 – 45 ವರ್ಷ',

  'health.band.later.label': '46 – 60 ವರ್ಷ',

  'health.band.senior.label': '61 – 75 ವರ್ಷ',

  'health.band.elder.label': '76 – 100 ವರ್ಷ',

  /* ---- save / download ---- */

  'download.pdf': 'PDF ಆಗಿ ಉಳಿಸಿ',
  'download.text': 'ಪಠ್ಯವಾಗಿ ಉಳಿಸಿ',
  'download.printNow': 'ಮುದ್ರಿಸಿ',
  'download.preparing': 'ಸಿದ್ಧವಾಗುತ್ತಿದೆ',
  'download.blocked': 'ಹೊಸ ಟ್ಯಾಬ್ ತೆರೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಪಾಪ್-ಅಪ್ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ — ಅನುಮತಿಸಿ.',

  /* ---- attach a document ---- */

  'attach.button': 'ನಿಮ್ಮ ದಾಖಲೆ ಅಥವಾ ಫೋಟೋ ಸೇರಿಸಿ',
  'attach.formats': 'PDF, ಫೋಟೋ (JPG/PNG) ಅಥವಾ ಪಠ್ಯ ಕಡತ — 12 MB ವರೆಗೆ',
  'attach.reading': 'ಓದುತ್ತಿದೆ…',
  'attach.attached': 'ಸೇರಿಸಲಾಗಿದೆ',
  'attach.remove': 'ತೆಗೆದುಹಾಕಿ',
  'attach.tooBigPdf': 'ಈ PDF 12 MBಕ್ಕಿಂತ ದೊಡ್ಡದು. ಚಿಕ್ಕ ಕಡತ ಆಯ್ಕೆಮಾಡಿ.',
  'attach.tooBigImage': 'ಈ ಫೋಟೋ 3 MBಕ್ಕಿಂತ ದೊಡ್ಡದು. ಚಿಕ್ಕ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ.',
  'attach.scannedPdf': 'ಈ PDF ಸ್ಕ್ಯಾನ್ ಆಗಿದೆ — ಇದರಲ್ಲಿ ಕೇವಲ ಚಿತ್ರವಿದೆ, ಓದಲು ಸಾಧ್ಯವಿಲ್ಲ. ಅದರ ಫೋಟೋ ಕಳುಹಿಸಿ.',
  'attach.pdfFailed': 'ಈ PDF ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
  'attach.imageFailed': 'ಈ ಫೋಟೋ ಲೋಡ್ ಆಗಲಿಲ್ಲ.',
  'attach.wrongType': 'ಈ ಬಗೆಯ ಕಡತ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. PDF, ಫೋಟೋ ಅಥವಾ ಪಠ್ಯ ಕಡತ ಕಳುಹಿಸಿ.',
  'attach.hint': 'ನಿಮ್ಮ ದಾಖಲೆಯನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ ಪ್ರಶ್ನೆ ಕೇಳಿ — ಉತ್ತರ ಆ ದಾಖಲೆಯ ಬಗ್ಗೆಯೇ ಬರುತ್ತದೆ.',
  'ask.sendWithFile': 'ಇದರ ಉತ್ತರ ಕೊಡಿ',

  /* ---- free library ---- */

  'lib.title': 'ಉಚಿತ ಗ್ರಂಥಾಲಯ',
  'lib.intro': 'ಪಠ್ಯಪುಸ್ತಕಗಳು, ಪುಸ್ತಕಗಳು, ಚಿತ್ರಗಳು, ಧ್ವನಿ — ಎಲ್ಲಾ ಉಚಿತ ಮತ್ತು ಕಾನೂನುಬದ್ಧ.',
  'lib.legalTitle': 'ಕಾಪಿರೈಟ್ ತೊಂದರೆ ಇಲ್ಲ.',
  'lib.legal': 'ಇಲ್ಲಿ ನೀಡಿದದ್ದು ಸಂಪೂರ್ಣ ಉಚಿತ ಮತ್ತು ನೀವು ಅದನ್ನು ಮುಂದೆ ಹಂಚಬಹುದು. ಇನ್ನೂ ಕಾಪಿರೈಟ್‌ನಲ್ಲಿರುವ ಪುಸ್ತಕ ಇಲ್ಲಿ ಇಲ್ಲ — ಅದನ್ನು ನಕಲು ಮಾಡಲು ಅನುಮತಿ ಇಲ್ಲ, ಅದನ್ನು ನೇರವಾಗಿ ಹೇಳುವುದೇ ಸರಿ.',
  'ask.signInTitle': 'ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ',
  'ask.signInBody': 'ಪ್ರಶ್ನೆ ಕೇಳಲು ಖಾತೆ ತೆರೆಯಿರಿ. ಒಂದು ನಿಮಿಷಕ್ಕಿಂತ ಕಡಿಮೆ, ನಂತರ ನೀವು ಪ್ರಶ್ನೆ ಕೇಳುತ್ತಿರಿ.',
  'ask.signInCta': 'ಖಾತೆ ತೆರೆಯಿರಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ',
  'ask.signInFirst': 'ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ, ನಂತರ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
  'ask.signInOr': 'ಈಗ ಖಾತೆ ತೆರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲವೇ? ಇವು ಖಾತೆಯಿಲ್ಲದೆಯೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ:',
  'account.title': 'ನನ್ನ ಖಾತೆ',
  'account.intro': 'ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್‌ನಿಂದ ಸೈನ್ ಇನ್ ಮಾಡಿ.',
  'account.signIn': 'ಲಾಗಿನ್ ಮಾಡಿ',
  'account.register': 'ಖಾತೆ ತೆರೆಯಿರಿ',
  'account.signInNote': 'ಹಿಂದೆ ಬಳಸಿದ ಹೆಸರು ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ.',
  'account.registerNote': 'ಪ್ರಶ್ನೆ ಕೇಳಲು ಖಾತೆ ಬೇಡ. ಇದು ನಿಮ್ಮ ಭಾಷೆ ಮತ್ತು ಉತ್ತರಗಳನ್ನು ನೆನಪಿಡಿಕೊಳ್ಳಲು ಮಾತ್ರ.',
  'account.handle': 'ನಿಮ್ಮ ಹೆಸರು',
  'account.handlePlaceholder': 'ಉದಾ. sita.ji',
  'account.password': 'ಪಾಸ್‌ವರ್ಡ್',
  'account.passwordHint': 'ಕನಿಷ್ಠ ಆರು ಅಕ್ಷರಗಳು.',
  'account.phone': 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
  'account.optional': 'ಅಗತ್ಯವಿಲ್ಲ',
  'account.phoneHint': 'ಇಚ್ಛೆ ಇದ್ದರೆ ಕೊಡಿ. ಇಲ್ಲದಿದ್ದರೂ ಖಾತೆ ತೆರೆಯುತ್ತದೆ.',
  'account.create': 'ಖಾತೆ ತೆರೆಯಿರಿ',
  'account.logout': 'ಹೊರಡು',
  'account.open': 'ಖಾತೆ ತೆರೆಯಿರಿ',
  'account.signedInAs': 'ನೀವು ಸೈನ್ ಇನ್ ಆಗಿದ್ದೀರಿ',
  'account.signedOut': 'ಸೈನ್ ಇನ್ ಮಾಡಿಲ್ಲ',
  'account.signedOutBody': 'ಈ ಬ್ರೌಸರದಲ್ಲಿ ಯಾವುದೇ ಖಾತೆ ತೆರೆದಿಲ್ಲ.',
  'account.saved': 'ಉಳಿಸಿದ ಉತ್ತರಗಳು',
  'account.savedEmpty': 'ಇನ್ನೂ ಏನೂ ಉಳಿಸಿಲ್ಲ. ಉತ್ತರದ ಮೇಲೆ \'ಉಳಿಸಿ\' ಒತ್ತಿ.',
  'account.savedUnavailable': 'ಉಳಿಸಿದ ಉತ್ತರಗಳು ಈಗ ಕಾಣುವುದಿಲ್ಲ. ಉಳಿದವು ಎಲ್ಲವೂ ಕೆಲಸ ಮಾಡುತ್ತಿವೆ.',
  'account.wait': 'ದಯವಿಟ್ಟು ಕಾಯಿರಿ…',
  'account.privacyTitle': 'ನಿಮ್ಮ ಮಾಹಿತಿ',
  'account.privacyBody': 'ಖಾತೆಯಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು, ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಭಾಷೆ ಮಾತ್ರ ಇದೆ. ನೀವು ಏನು ಕೇಳಿದಿರು ಅದು ದಾಖಲಾಗುವುದಿಲ್ಲ. ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಯಾರಿಗೂ ಕಳುಹಿಸುವುದಿಲ್ಲ.',
  'account.errWrong': 'ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪು.',
  'account.errTaken': 'ಆ ಹೆಸರು ತೆಗೆದಿದ್ದಾರೆ. ಬೇರೆ ಹೆಸರು ಆರಿಸಿ.',
  'account.errBad': 'ದಯವಿಟ್ಟು ಸರಿಯಾಗಿ ತುಂಬಿ.',
  'account.errWait': 'ಹಲವಾರ ಪ್ರಯತ್ನೆಗಳಾಗಿವೆ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  'account.errTryLater': 'ಈಗ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  'lib.licence.ccBy': 'ನೀವು ನಕಲಿಸಿ, ಹಂಚಿಕೊಳ್ಳಬಹುದು, ಮುದ್ರಿಸಬಹುದು — ಮೂಲದ ಹೆಸರು ಹೇಳಬೇಕು.',
  'lib.licence.ccBySa': 'ನೀವು ನಕಲಿಸಿ ಮುದ್ರಿಸಬಹುದು. ಮಾಡಿದ ಬದಲಾವಣೆಗಳನ್ನೂ ತೆರೆದು ಹಂಚಬೇಕು.',
  'lib.licence.ccZero': 'ಸಂಪೂರ್ಣ ಉಚಿತ. ಮೂಲದ ಹೆಸರು ಕೊಡುವ ಅಗತ್ಯವಿಲ್ಲ.',
  'lib.licence.pd': 'ಇದಕ್ಕೆ ಯಾರದೂ ಕಾಪಿರೈಟ್ ಇಲ್ಲ — ಬೇಕಾದರೆ ನಕಲಿಸಿ.',
  'lib.licence.govtIndia': 'ಭಾರತ ಸರ್ಕಾರದ ಜಾಲದಲ್ಲಿ. ಓದುವುದು ಮತ್ತು ಮುದ್ರಿಸುವುದು ಎರಡೂ ಉಚಿತ.',
  'lib.licence.creativeCommons': 'ಪ್ರತಿ ಕಡತಕ್ಕೂ ತನ್ನದೇ ಪರವಾನಗಿ ಇದೆ — ಕಡತ ನೋಡಿ.',
  'lib.licence.freeToRead': 'ಓದುವುದು ಉಚಿತ. ಮುಂದಿಗೆ ಕೊಡುವುದೂ ಅದೇ ನಿಯಮಗಳ ಪ್ರಕಾರವೇ ಸಾಧ್ಯ.',
  'lib.openBadge': 'ತೆರೆದ',
  'lib.openBadgeNote': 'ನಕಲು ಮಾಡಬಹುದು',
  'lib.freeBadge': 'ಉಚಿತ',
  'lib.freeBadgeNote': 'ಓದಬಹುದು, ನಕಲು ಮಾಡಲು ಆಗುವುದಿಲ್ಲ',
  'lib.govt': 'ಸರ್ಕಾರಿ',
  'lib.noSignup': 'ಖಾತೆ ಬೇಡ',
  'lib.open': 'ಇಲ್ಲಿ ತೆರೆಯಿರಿ',
  'lib.group.padhai': 'ಪಠ್ಯಪುಸ್ತಕಗಳು',
  'lib.group.padhai.note': 'ಪಠ್ಯಪತ್ರ, ಮಹಾವಿದ್ಯಾಲಯ ಮತ್ತು ಸರ್ಕಾರಿ ಶಿಕ್ಷಣ ಸಾಮಗ್ರಿ',
  'lib.group.kitab': 'ಪುಸ್ತಕಗಳು',
  'lib.group.kitab.note': 'ಕಾಪಿರೈಟ್ ಇಲ್ಲದವು ಅಥವಾ ನಕಲು ಮಾಡಲು ಅನುಮತಿ ಇರುವವು',
  'lib.group.tasveer': 'ಚಿತ್ರಗಳು',
  'lib.group.tasveer.note': 'ನಕ್ಷೆ, ಚಿತ್ರ — ಎಲ್ಲಾ',
  'lib.group.audio': 'ಕೇಳಲು ಸಾಮಗ್ರಿ',
  'lib.group.audio.note': 'ಪುಸ್ತಕಗಳನ್ನು ಧ್ವನಿಯಾಗಿ, ಚಿಕ್ಕ ಅಕ್ಷರ ಓದಲು ಇಚ್ಛೆ ಇಲ್ಲದವರಿಗೆ',
  'lib.warnTitle': 'ಪ್ರತಿ ಪುಸ್ತಕವೂ ಇಲ್ಲಿ ಇಲ್ಲ',
  'lib.warn': 'ಕೆಲವು ಪುಸ್ತಕಗಳು ಇನ್ನೂ ಕಾಪಿರೈಟ್‌ನಲ್ಲಿವೆ, ಹಾಗಾಗಿ ಕಾನೂನಿನಂತೆ ಉಚಿತವಾಗಿ ಕೊಡಲು ಆಗುವುದಿಲ್ಲ. ಅವನ್ನು ಇರಬಹುದಾಗದೆ ತೋರಿಸಲಾಗಿಲ್ಲ. ಪುಸ್ತಕ ಬೇಕಿದ್ದರೆ ಕೆಳಗೆ ಕೇಳಿ — ಹೇಳಬಹುದಾದದ್ದನ್ನು ಹೇಳಲಾಗುತ್ತದೆ.',
  'lib.askInstead': 'ಕೇಳಿ',
  'nav.library': 'ಗ್ರಂಥಾಲಯ',

  'help.title': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ',

  'help.intro': 'ಕೆಳಗೆ ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ. ಗೊತ್ತಿಲ್ಲದಿದ್ದರೆ ಮನಸಿನಲ್ಲಿ ಬರುವಷ್ಟೇ ಬರೆಯಿರಿ — ಇದೇ ಅತ್ಯಂತ ಮುಖ್ಯ.',

  'help.howTitle': 'ಈ ಸೇವೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',

  'help.howBody': 'ಪ್ರತಿ ಪ್ರಶ್ನೆ ದಾಖಲಾಗುತ್ತದೆ ಮತ್ತು ಅದರ ಉತ್ತರ ತಕ್ಷಣ ಸಿಗುತ್ತದೆ. ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಎಲ್ಲಿಯೂ ತೆಗೆಯುವುದಿಲ್ಲ. ಎಲ್ಲವೂ ಉಚಿತ.',

  'help.suggested': 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',

  'help.q1.label': 'ವಿದ್ಯುತ್ ಹೋಗಿದೆ, ಏನು ಮಾಡಬೇಕು?',

  'help.q1.question': 'ಮನೆಯಲ್ಲಿ ವಿದ್ಯುತ್ ಹೋಗಿದೆ. ಏನು ಮಾಡಬೇಕು, ಮತ್ತು ಮೊಬೈಲ್ ಫೋನ್ ಹೇಗೆ ಚಾರ್ಜ್ ಮಾಡಬೇಕು?',

  'help.q2.label': 'ಮಗುವಿನ ಓದುವಿನಲ್ಲಿ ದುರ್ಬಲತೆ',

  'help.q2.question': 'ನನ್ನ ಮಗನ ಓದುವಿನಲ್ಲಿ ತುಂಬಾ ದುರ್ಬಲತೆ ಇದೆ. ಮನೆಯಲ್ಲಿ ಹೇಗೆ ಸುಧರಿಸಬೇಕು?',

  'help.q3.label': 'ವೃದ್ಧರ ಚಿಕಿತ್ಸೆ',

  'help.q3.question': 'ನನ್ನ ತಂದೆಯ ವಯಸ್ಸು ತುಂಬಾ ಹೆಚ್ಚು, ಅವರಿಗೆ ಚಿಕಿತ್ಸೆ ಹೇಗೆ ಕೊಡಬೇಕು?',

  'help.q4.label': 'ಮನೆಯಲ್ಲಿ ಅಗ್ನಿ ಸಂಭವಿಸಿದರೆ',

  'help.q4.question': 'ರಾತ್ರಿ ಮನೆಯಲ್ಲಿ ಅಗ್ನಿ ಸಂಭವಿಸಿದರೆ ಮೊದಲು ಏನು ಮಾಡಬೇಕು?',

  'home.stepLabel': 'ಹಂತ',

  'home.step1Title': 'ನಿಮ್ಮ ಮಾತನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ',

  'home.step1Body': 'ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ, ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ. ಏನೂ ವಿಶೇಷ ಮಾಡಬೇಕಿಲ್ಲ — ಮನಸಿನಲ್ಲಿರುವದ್ದನ್ನೇ ಬರೆಯಿರಿ.',

  'home.step2Title': 'ತಕ್ಷಣ ಉತ್ತರ ಸಿಗುತ್ತದೆ',

  'home.step2Body': 'ಪ್ರತಿ ಪ್ರಶ್ನೆ ದಾಖಲಾಗುತ್ತದೆ ಮತ್ತು ಅದರ ಉತ್ತರ ತಕ್ಷಣ ಸಿಗುತ್ತದೆ. ತುಂಬಾ ದೊಡ್ಡ ಪ್ರಶ್ನೆಗೆ ಮೊದಲು ಪುಟ್ಟ ಪ್ರಶ್ನೆಯಿಂದ ಆರಂಭಿಸಿ.',

  'home.step3Title': 'ಹಣಯಿಲ್ಲ, ಖಾಸಗಿ ಮಾಹಿತಿಯಿಲ್ಲ',

  'home.step3Body': 'ಈ ಸೇವೆ ಸಂಪೂರ್ಣ ಉಚಿತ. ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಕೇಳುವುದಿಲ್ಲ, ಮತ್ತು ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ.',

  'home.memorialEyebrow': 'ಈ ಸೈಟ್ ಯಾರಿಂದು',
  'home.memorialLine': 'ತಮ್ಮ ಜೀವನದ ಆದ್ಯಂತವೇ ಸಮಾಜಕ್ಕಾಗಿ ಹೋರಾಡಿದವರು, ಆದರೆ ಕೊನೆಗೆ ತಮ್ಮ ಪಾಲು ಸಿಗಲಿಲ್ಲ.',
  'home.memorialMore': 'ಅವರ ಪೂರ್ಣ ಕಥೆ ಓದಿ',
  'home.kundaliTitle': 'ಜನ್ಮ ಗಂಠ',
  'home.kundaliNote': 'ಪೂರ್ಣ ಕುಂಡಳಿ — ಒಂಬತ್ತು ಗ್ರಹಗಳು, ವಿಮಶೋತ್ತರಿ ದಶೆ, ಫಲದೇಶ, ಯೋಗ, ಶೋಡಶವರ್ಗ, ಕೆಪಿ, ಲಾಲ್ ಕಿತಾಬ್ ಮತ್ತು ಅಂಕ ಜ್ಯೋತಿಷ. ಎಲ್ಲವೂ ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲೇ ಲೆಕ್ಕಹವಾಗುತ್ತದೆ.',
  'home.chooseTopicNote': 'ಕೆಳಗಿನ ವಿಷಯಕ್ಕೆ ಒತ್ತಿ. ಪ್ರತಿ ಕಡೆ ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ.',

  'home.categoryEmpty': 'ಈ ವಿಷಯದಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಬರೆಯಲಾಗಿಲ್ಲ.',

  'home.soundIntro': 'ಶುಲ್ಕವಿಲ್ಲ, ಜಾಹೀರಾತಿಲ್ಲ. ಮನಸು ಶಾಂತಗೊಳಿಸಲು ಮಾತ್ರ.',
  'home.emergencyTitle': 'ತುರ್ತ ಸಹಾಯ ಬೇಕೇ?',
  'home.emergencyNote': 'ಇವನ್ನು ಮೊದಲು ಓದಿ. ಉಳಿದವೆಲ್ಲಾ ನಂತರ ನೋಡಬಹುದು.',

  'home.dedication1': 'ಸ್ಮರಣದಲ್ಲಿ — ಸಂಪೂರ್ಣ ಉಚಿತ ಸೇವೆ.',

  'home.dedication2': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ.',

  'ref.title': 'ಈ ಸೇವೆ ಏನು, ಮತ್ತು ಯಾರಿಗೆ',

  'ref.intro': 'ಈ ಸೇವೆಯನ್ನು ಶ್ರೀಮತಿ VARSHA ಸ್ಮರಣದಲ್ಲಿ ಕಟ್ಟಲಾಗಿದೆ. ಇದು ಏನು ಮಾಡುತ್ತದೆ, ಇದರಲ್ಲಿ ಏನಿದೆ, ಮತ್ತು ಇದರ ಮಿತಿಗಳೇನು ಎಂದು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಹೇಳಲಾಗಿದೆ. ಎಲ್ಲವೂ ಸಂಪೂರ್ಣ ಉಚಿತ — ಹಣಯನ್ನು ತೆಗೆಯುವುದಿಲ್ಲ, ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ, ಖಾಸಗಿ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ.',

  'ref.whatTitle': 'ಇದರಲ್ಲಿ ಏನಿದೆ',

  'ref.what1': 'ಮನೆಯಲ್ಲಿ ಅಗ್ನಿ, ವಿದ್ಯುತ್ ಹೋಗುವುದು, ಮಕ್ಕಳ ಓದುವಿನ ದುರ್ಬಲತೆ, ತಂದೆ-ತಾಯಿಯ ಆರೈಕೆ — ಇಂತಹ ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಗಳಿಗೆ ಸರಳ ಪರಿಹಾರ, ಸ್ಪಷ್ಟ ಭಾಷೆಯಲ್ಲಿ.',

  'ref.what2': 'ಪ್ರಶ್ನೆ ಮಾತನಾಡಿ ಕೇಳುವ ಸೌಲಭ್ಯ. ಮಾತನಾಡಲಾಗದಿದ್ದರೆ ಬರೆಯಿರಿ — ಎರಡಕ್ಕೂ ಉತ್ತರ ಒಂದೇ ಆಗುತ್ತದೆ.',

  'ref.what3': 'ಪ್ರತಿ ಪ್ರಶ್ನೆ ದಾಖಲಾಗುತ್ತದೆ, ಹಾಗಾಗಿ ಇತರರಿಗೆ ತೊಂದರೆ ನೀಡುವ ವಿಷಯ ನಿಮ್ಮ ಮೊದಲೇ ಕೇಳಿಗೆ ಬಂದಿರುತ್ತದೆ ಮತ್ತು ಅದರ ಉತ್ತರ ಸಿಗುತ್ತದೆ.',

  'ref.what4': 'ಜಾಹೀರಾತಿಯಿಲ್ಲ, ಅನಾವಶ್ಯಕ ಮಾಹಿತಿಯಿಲ್ಲ, ಖಾಸಗಿ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ. ಎಲ್ಲಾ ಉಚಿತ.',

  'ref.statsArticles': 'ಲೇಖಗಳು ಬರೆದಿದ್ದಾರೆ',

  'ref.statsCategories': 'ವಿಷಯಗಳು ಲಭ್ಯವಿದೆ',

  'ref.statsQuestions': 'ಪ್ರಶ್ನೆಗಳು ಕೇಳಲಾಗಿದ್ದಾರೆ',

  'ref.adminTitle': 'ನಿರ್ವಹಣೆ ಏನು ಮಾಡಬಹುದು',

  'ref.adminBody': 'ನೀವು ಕಳುಹಿಸಿದ ಲೇಖಗಳನ್ನು ನಿರ್ವಹಣೆ ನೋಡಬಹುದು ಮತ್ತು ಅವುಗೆ ಉತ್ತರ ಬರೆಯಬಹುದು. ನಿಮ್ಮ ಅನುಮತಿಯಿಲ್ಲದೆ ಅವರು ಯಾವುದೇ ಲೇಖವನ್ನೂ ಬದಲಿಸಲು ಅಥವಾ ತೆಗೆದುಹಾಕಲು ಆಗುವುದಿಲ್ಲ, ಮತ್ತು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಯಾರಿಗೂ ಮಾರಲಾಗುವುದಿಲ್ಲ.',

  'ref.dataTitle': 'ನಿಮ್ಮ ಬಗ್ಗೆ ನಾವು ಏನು ಸಂಗ್ರಹಿಸುತ್ತೇವೆ',

  'ref.dataBody': 'ನೀವು ಕೇಳಿದ ಪ್ರಶ್ನೆ, ಅದರ ಸಾರಾಂಶ ಮತ್ತು ಕೇಳಿದ ಸಮಯ ಮಾತ್ರ — ಅದೇ ಉತ್ತರವನ್ನು ಪದೇ ಪದೇ ಕೊಡದಿರಲು. ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ, ಫೋನ್ ನಂಬರ್ ಅಥವಾ ಗುರುತಿಸುವ ಯಾವುದೇ ಮಾಹಿತಿ ತೆಗೆಯುವುದಿಲ್ಲ. ಸೈಟ್‌ನಲ್ಲಿ ಜಾಹೀರಾತು ಅಥವಾ ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ಕ್ರಿಪ್ಟ್ ಇಲ್ಲ.',

  'ref.helplineTitle': 'ತುರ್ತು ಸಹಾಯಕ್ಕೆ ಈ ಸಂಖ್ಯೆಗಳನ್ನು ಉಳಿಸಿ',

  'ref.helpline1': 'ದೊಡ್ಡ ಅಪಾಯ ಇದ್ದರೆ — ಅಗ್ನಿ, ವಿದ್ಯುತ್ ಕಂಪನ, ಬೀಳುವಿಕೆ ಅಥವಾ ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ — 112 ಗೆ ಫೋನ್ ಮಾಡಿ.',

  'ref.helpline2': 'ಯಾರಿಗೂ ಅನಾರೋಗ್ಯ ಅಥವಾ ಗಾಯ ಇದ್ದರೆ ಮತ್ತು ಹೋಗಿಕೆ ವಾಹನ ಇಲ್ಲದಿದ್ದರೆ, 108 ಗೆ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕೇಳಿ.',

  'ref.helpline3': 'ಮಹಿಳೆಯೊಂದಿಗೆ ಏನೋ ಕೆಟ್ಟಮಾಟಾದರೆ, ಅಥವಾ ಮಹಿಳೆಯನ್ನು ಎಲ್ಲಿದರೂ ಕಷ್ಟಕ್ಕೆ ಒಳಗೆಮಾಡಿದರೆ, 181 ಗೆ ಫೋನ್ ಮಾಡಿ. ಇದು ಉಚಿತ.',

  'ref.helpline4': 'ಮಗು ಅಥವಾ ವೃದ್ಧರ ಜೊತೆಗೆ ಯಾವುದೋ ಅನ್ಯಾಯ ಆಗಿದ್ದರೆ, 1098 ಗೆ ದೂರು ಹಿಡಿಯಬಹುದು.',

  'ref.helpline5': 'ಮಾನಸಿಕ ಒತ್ತಡ ತುಂಬಾ ಹೆಚ್ಚಾಗಿದ್ದರೆ, ಅಥವಾ ಬದುಕುವ ಮನಸ್ಸಿಲ್ಲದಿದ್ದರೆ, 14416 ಗೆ ಮಾತನಾಡಬಹುದು. ಮಾತನಾಡಲು ಮಾತ್ರ.',

  'ref.ownerNote': 'ಈ ಸೇವೆ ಯಾವುದೇ ಕಂಪನಿಯದ್ದು ಅಥವಾ ಸರ್ಕಾರದ್ದು ಅಲ್ಲ, ಒಂದು ವ್ಯಕ್ತಿಯ ಸ್ಮರಣದಲ್ಲಿ ನಡೆಯುತ್ತದೆ. ಹಾಗಾಗಿ ಇಲ್ಲಿ ಜಾಹೀರಾತಿಯಿಲ್ಲ, ಸದಸ್ಯತ್ವವಿಲ್ಲ, ಮತ್ತು ಹಣ ತೆಗೆಯುವುದಿಲ್ಲ.',

  'support.title': 'ಈ ಸೇವೆ ಉಚಿತ',

  'support.intro': 'ಈ ಸೇವೆ ಯಾರಿಂದೂ ಹಣ ತೆಗೆಯುವುದಿಲ್ಲ. ಆದರೆ ಅದು ನಡೆಯುತ್ತದೆ — ಹಾಗಾಗಿ ಕೆಲವು ಮಾರ್ಗಗಳಿವೆ, ಅವುಗಳಲ್ಲಿ ನೀವು ಸಹಾಯ ಮಾಡಬಹುದು. ಸರಳವಾದ ಮಾರ್ಗವೇ ಹೆಚ್ಚು ಉಪಯೋಗ.',

  'support.contactTitle': 'ಏನದೆಂದೂ ಹೇಳಬೇಕೇ?',

  'support.contactBody': 'ಯಾವುದೇ ವಿಷಯದ ಬಗ್ಗೆ ಇಲ್ಲಿ ಬರೆಯಬಹುದು — ಏನಾದರೂ ತಪ್ಪಿದರೆ, ಏನಾದರೂ ಹೆಚ್ಚು ಸಿಕ್ಕಿದರೆ, ಅಥವಾ ಏನಾದರೂ ಪ್ರಶ್ನೆ ಇದ್ದರೆ. ಬರೆಯುವುದು ಸರಳವಾಗಿ ಕಾಣಿಸಿದರೆ ಅದೇ ಬರೆಯಿರಿ.',

  'support.faqTitle': 'ಪದೇ ಪದೇ ಕೇಳುವ ಕೆಲವು ವಿಷಯಗಳು',

  'support.faqBody': 'ಇದು ನಿಜವಾಗಿಯೂ ಉಚಿತವೇ? ಹೌದು. ನಿಮ್ಮ ಹೆಸರು ತೆಗೆಯಲಾಗುತ್ತದೆ? ಇಲ್ಲ, ಹೆಸರು ಕೊಡುವುದು ಅಗತ್ಯವಿಲ್ಲ. ಜಾಹೀರಾತು ಬರುತ್ತದೆ? ಇಲ್ಲ. ಫೋನ್ ನಂಬರ್ ಅಥವಾ ವಿಳಾಸ ಕೇಳುತ್ತಾರೆ? ಇಲ್ಲ. ಯಾವುದೇ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕೇ? ಇಲ್ಲ, ಬ್ರೌಸರ್‌ನಲ್ಲೇ ತೆರೆಯುತ್ತದೆ.',

  'support.waysTitle': 'ನೀವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು',

  'support.way1Title': 'ನಿಮ್ಮ ಅನುಭವ ಬರೆಯಿರಿ',

  'support.way1Body': 'ಈ ಸೈಟ್‌ನಿಂದ ನಿಮಗೆ ಏನಾದರೂ ಚೆನ್ನಾಗಿದ್ದರೆ — ಅಥವಾ ನಿಮ್ಮನ್ನು ಕಲಸಿಸಿದ ಏನಾದರೂ ಸಿಕ್ಕಿದರೆ — ಅಪ್ರಾಯ ಪುಟದಲ್ಲಿ ಬರೆಯಿರಿ. ನಿಮ್ಮ ಹೆಸರು ತೆಗೆಯುವುದು ಅಗತ್ಯವಿಲ್ಲ.',

  'support.way2Title': 'ನಿಮ್ಮ ನಗರದ ಬಗ್ಗೆ ತಿಳಿಸಿ',

  'support.way2Body': 'ನೀವು ಇರುವ ಕಡೆಯ ಭಾಷೆ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಮಸ್ಯೆಗಳು ಬೇರೆ. ನಿಮ್ಮ ಇಲ್ಲಿಯ ಏನೂ ಇಲ್ಲಿ ಇಲ್ಲದಿದ್ದರೆ ತಿಳಿಸಿ — ಸೇರಿಸಲಾಗುವುದು ಸೇರಿಸಲಾಗುತ್ತದೆ.',

  'support.way3Title': 'ನಿಮ್ಮ ಅನುಭವ ಇನ್ನೊಬರಿಗೆ ಹೇಳಿ',

  'support.way3Body': 'ಇಲ್ಲಿ ಬರೆದಿರುವುದು ಹಲವರಿಗೆ ಉಪಯೋಗವಾಗಬಹುದು, ಅವರಿಗೆ ತಿಳಿದರೆ. ಇದು ನಿಜವಾಗಿಯೂ ಸಹಾಯ ಪಡೆಯುವ ವ್ಯಕ್ತಿಗೆ ಹೇಳಿ.',

  'support.way4Title': 'ಇಲ್ಲಿಗೆ ಬಂದು ನೋಡಿ',

  'support.way4Body': 'ನಿಮಗೆ ಸಮಯ ಇದ್ದರೆ, ಈ ಸೈಟ್ ಸರಿಯಾಗಿ ನಡೆಯುತ್ತಿದೆಯೇ ಎಂದು ನೀವೇ ಬಂದು ನೋಡಿ. ಏನೋ ತಪ್ಪಾಗಿದ್ದರೆ ತಿಳಿಸಿ — ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿ ಸರಿಪಡಿಸಲಾಗುತ್ತದೆ.',

  'reviews.pageTitle': 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ',

  'reviews.pageIntro': 'ಇಲ್ಲಿ ಜನರು ಬರೆದದ್ದೇ ಬರೆದಿದೆ. ಯಾವುದೇ ಅಭಿಪ್ರಾಯ ಮರೆಮಾಡುವುದಿಲ್ಲ, ಮತ್ತು ಬರೆದಿದ್ದೇ ಅಲ್ಲಿಯೇ ಕಾಣುತ್ತದೆ — ಒಮ್ಮೆ ನೋಡಿದ ಮೇಲೆ ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ.',

  'reviews.intro': 'ಈ ಸೇವೆ ನಿಮಗೆ ಉಪಯೋಗವಾದಿತೇ? ನಿಮ್ಮ ಮಾತು ಬರೆಯಿರಿ — ನಿಮ್ಮ ಹೆಸರು ತೆಗೆಯುವುದು ಅಗತ್ಯವಿಲ್ಲ.',

  'reviews.write': 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಬರೆಯಿರಿ',

  'reviews.starsLabel': '5 ರಲ್ಲಿ {value} ನಕ್ಷತ್ರ',

  'reviews.summaryTitle': 'ಸಾಮಾನ್ಯ ಅಭಿಪ್ರಾಯ',

  'reviews.summaryLine': 'ಜನರು ಸರಾಸರಿ {rating} ರಲ್ಲಿ 5 ರಲ್ಲಿ {count} ನಕ್ಷತ್ರ ನೀಡಿದ್ದಾರೆ.',

  'reviews.count': 'ವಿಮರ್ಶೆಗಳು',

  'reviews.name': 'ನಿಮ್ಮ ಹೆಸರು (ಅಗತ್ಯವಿಲ್ಲ)',

  'reviews.city': 'ನಿಮ್ಮ ನಗರ (ಅಗತ್ಯವಿಲ್ಲ)',

  'reviews.comment': 'ನಿಮ್ಮ ಮಾತು',

  'reviews.placeholder': 'ಮನಸ್ಸಿನಲ್ಲಿ ಬರುವದೇ ಬರೆಯಿರಿ — ಏನನ್ನೂ ಸರಿಪಡಿಸುವುದು ಅಗತ್ಯವಿಲ್ಲ.',

  'reviews.keepLabel': 'ಕೆಟ್ಟದಿದ್ದರೂ, ಒಳ್ಳೆಯದಿದ್ದರೂ — ಎರಡನ್ನೂ ಬರೆಯಿರಿ',

  'reviews.fieldTooShort': 'ಕನಿಷ್ಠ 10 ಅಕ್ಷರ ಬರೆಯಿರಿ.',

  'reviews.rateLimited': 'ತುಂಬಾ ವೇಗವಾಗಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ. ಸ್ವಲ್ಪ ನಿಂತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'reviews.sending': 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…',

  'reviews.moderated': 'ನಿಮ್ಮ ವಿಮರ್ಶೆ ಪ್ರಕಟಿಸುವ ಮೊದಲು ಒಮ್ಮೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.',

  'reviews.moderationNote': 'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿಹಾಕದಂತೆ, ಪ್ರಕಟಿಸುವ ಮೊದಲು ಪ್ರತಿ ವಿಮರ್ಶೆ ಒಮ್ಮೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ದೂಷಣೆ, ಸಂಖ್ಯೆ ಅಥವಾ ಖಾಸಗಿ ಮಾತುಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ — ಉಳಿದ್ದಂತೆ ಎಲ್ಲವೂ ಹಾಗೆಯೇ ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ.',

  'reviews.replyLabel': 'ಇದರ ಬಗ್ಗೆ ಬರೆದಿದೆ',

  'reviews.ownerReply': 'ಉತ್ತರ',

  'reviews.empty': 'ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆ ಇಲ್ಲ. ಮೊದಲನ್ನು ನೀವೇ ಬರೆಯಿರಿ.',

  'reviews.anonymous': 'ಹೆಸರಿಲ್ಲದೆ',

  'reviews.toastSent': 'ಧನ್ಯವಾದ',

  'reviews.toastFailed': 'ಅಭಿಪ್ರಾಯ ಕಳುಹಿಸಲಾಗಲಿಲ್ಲ',

  'health.band.infant.note': 'ತುಗ್ಗ ಮಕ್ಕಳು, ಇನ್ನೂ ತಮ್ಮ ವಾತನೆ ಹೇಳಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ',

  'health.band.child.note': 'ಮಾತನಾಡಬಹುದಾದ ಮಕ್ಕಳು, ಆದರೆ ಪ್ರಶ್ನೆ ಕೇಳಲು ಹೆಚ್ಚಿಕೆ ಹೆದುವರುತ್ತಾರೆ',

  'health.band.teen.note': 'ಕಿಶೋರರು, ಅವರಿಗೆ ಸಾಮಾನ್ಯವಾಗಿ ಕೇಳಿ ಕೊಳ್ಳುವ ವ್ಯಕ್ತಿ ಸಿಗುವುದಿಲ್ಲ',

  'health.band.young.note': 'ಕೆಲಸ, ಹಣ ಮತ್ತು ನಿದ್ದೆ — ಮೂರರ ಒಟ್ಟಿಗೆ ಭಾರ',

  'health.band.middle.note': 'ಮನೆ, ಮಕ್ಕಳು ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯ — ಎಲ್ಲರ ಜವಾಬದಾರಿ ಒಟ್ಟಿಗೆ',

  'health.band.later.note': 'ದೇಹದ ವಯಸ್ಸು ಮತ್ತು ಅದರ ಆರೈಕೆ — ಎರಡೂ ಒಟ್ಟಿಗೆ',

  'health.band.senior.note': 'ಔಷಧಿ, ಸಮತೋಲನ ಮತ್ತು ಒಂಟಿಗೆ — ಮೂರೂ ಒಟ್ಟಿಗೆ',

  'health.band.elder.note': 'ಪ್ರತಿ ಔಷಧಿಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ, ಪ್ರತಿ ಉದುರುವಿಕೆ ಗಂಭೀರ',

  'health.c.infant1': 'ತೀವ್ರ ಜ್ವರ',

  'health.c.infant2': 'ತಿನುತ್ತಿಲ್ಲ',

  'health.c.infant3': 'ಎಗೆಯುತ್ತಿದೆ',

  'health.c.infant4': 'ಮಲಗೆಯುತ್ತಿದೆ',

  'health.c.child1': 'ಓದುವಿನಲ್ಲಿ ಮನಸ್ಸಿಲ್ಲ',

  'health.c.child2': 'ಶಾಲೆಗೆ ಹೋಗಲು ಮನಸ್ಸಿಲ್ಲ',

  'health.c.child3': 'ರಾತ್ರಿ ಜ್ವರ',

  'health.c.child4': 'ಹಲ್ಲು ಮುರಿಯುತ್ತಿದೆ',

  'health.c.teen1': 'ಓದಿನ ಒತ್ತಡ',

  'health.c.teen2': 'ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ',

  'health.c.teen3': 'ಮೊಬೈಲ್ ಚಟ',

  'health.c.teen4': 'ತೀವ್ರ ಬೇಸರಗೆ',

  'health.c.young1': 'ಕೆಲಸದ ಒತ್ತಡ',

  'health.c.young2': 'ಕುಳಿತಿದ್ದರೆ ನೋವು',

  'health.c.young3': 'ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ',

  'health.c.young4': 'ಹಣ ಕಡಿಮೆ',

  'health.c.middle1': 'ಬೆನ್ನು ನೋವು',

  'health.c.middle2': 'ನಿದ್ದೆ ಸರಿಯಾಗುತ್ತಿಲ್ಲ',

  'health.c.middle3': 'ಮನೆಯ ಒತ್ತಡ',

  'health.c.middle4': 'ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್',

  'health.c.later1': 'ಬೆನ್ನಿನ ನೋವು',

  'health.c.later2': 'ಮೊಣಕೆಯ ನೋವು',

  'health.c.later3': 'ರಾತ್ರಿ ಕಾಲಿನ ಸೆಳೆತ',

  'health.c.later4': 'ಬೆಳಿಗ್ಗೆ ಬಿಗುವು',

  'health.c.senior1': 'ನಡೆಯಲು ತೊಂದರು',

  'health.c.senior2': 'ಔಷಧಿ ಪರಿಶೀಲನೆ',

  'health.c.senior3': 'ರಾತ್ರಿ ಮೂತ್ರ',

  'health.c.senior4': 'ಕೇಳಿಸುವುದು ಕಡಿಮೆ',

  'health.c.elder1': 'ಉದುರುವ ಭಯ',

  'health.c.elder2': 'ನೆನಪು ದುರ್ಬಲ',

  'health.c.elder3': 'ದಿನದ ನೋವಿನ ಔಷಧಿ',

  'health.c.elder4': 'ವೈದ್ಯರ ಬಗ್ಗೆ ಯಾವಾಗ',

  'health.q.infant1': 'ನನ್ನ ಮಗನಿಗೆ ಜ್ವರ ಬಂದಿದೆ, ಹಾಲು ಕೊಡಬೇಕೇ?',

  'health.q.infant2': 'ಚಿಕ್ಕ ಮಗು ತಿನುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.infant3': 'ಮಗನಿಗೆ ಎಗೆಯುತ್ತಿದೆ, ಯಾವಾಗ ವೈದ್ಯರನ್ನು ತೋರಿಸಬೇಕು?',

  'health.q.infant4': 'ಮಗನಿಗೆ ಮಲಗೆಯುತ್ತಿದೆ, ಏನು ಕೊಡಬೇಕು?',

  'health.q.child1': 'ಮಗನ ಓದುವಿನಲ್ಲಿ ಮನಸ್ಸು ಹಾಕುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.child2': 'ಮಗು ಪ್ರತಿದಿನೂ ಶಾಲೆಗೆ ಹೋಗದೆ ಹೇಳುತ್ತಿದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?',

  'health.q.child3': 'ಮಗನಿಗೆ ರಾತ್ರಿ ಜ್ವರ ಬರುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.child4': 'ಮಗನ ಹಲ್ಲು ಮುರಿಯುತ್ತಿದೆ, ಹಲ್ಲಿನ ಆರೈಕೆ ಹೇಗೆ ಮಾಡಬೇಕು?',

  'health.q.teen1': 'ಓದಿನ ತುಂಬಾ ಒತ್ತಡಿದೆ, ಅದನ್ನು ಹೇಗೆ ಎದುರಿಸಬೇಕು?',

  'health.q.teen2': 'ರಾತ್ರಿ ನಿದ್ದೆ ಸರಿಯಾಗುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.teen3': 'ಮೊಬೈಲ್ ಚಟ ಹತ್ತಿದೆ, ಬಿಡುವುದು ಹೇಗೆ ಎಂದು ಹೇಳಿ.',

  'health.q.teen4': 'ತುಂಬಾ ಬೇಸರಗೆ ಆಗುತ್ತದೆ, ಯಾರೊಂದಿಗೆ ಮಾತನಾಡಬೇಕು?',

  'health.q.young1': 'ಕೆಲಸದ ತುಂಬಾ ಒತ್ತಡಿದೆ, ಹೇಗೆ ಕಡಿಮೆ ಮಾಡಬೇಕು?',

  'health.q.young2': 'ಕುಳಿತಿದ್ದರೆ ಬೆನ್ನಿಗೆ ನೋವಾಗುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.young3': 'ರಾತ್ರಿ ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.young4': 'ಹಣ ಕಡಿಮೆ, ಖರ್ಚ ಹೆಚ್ಚು, ಏನು ಮಾಡಬೇಕು?',

  'health.q.middle1': 'ನಡುವಿಗೆ ನೋವಾಗುತ್ತಿದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?',

  'health.q.middle2': 'ನಿದ್ದೆ ಚೆನ್ನಾಗಿ ಬರುತ್ತಿಲ್ಲ, ಸುಧರಿಸಲು ಏನು ಮಾಡಬೇಕು?',

  'health.q.middle3': 'ಮನೆಯಲ್ಲಿ ತುಂಬಾ ಒತ್ತಡ, ಮಕ್ಕಳನ್ನು ಹೇಗೆ ನೋಡಿಕೊಳ್ಳಬೇಕು?',

  'health.q.middle4': 'ಕೆಲಸದಲ್ಲಿ ವರ್ಷಗಳಿಗೆ ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್ ಸಮಸ್ಯೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.later1': 'ನನ್ನ ವಯಸ್ಸು 54 ಮತ್ತು ಬೆನ್ನಿಗೆ ನೋವು, ಏನು ಮಾಡಬೇಕು?',

  'health.q.later2': 'ಮೆಟ್ಟಿಲು ಹತ್ತುವಾಗ ಮೊಣಕೆಗೆ ನೋವಾಗುತ್ತದೆ, ಏಕೆ?',

  'health.q.later3': 'ರಾತ್ರಿ ಕಾಲಿನಲ್ಲಿ ಸೆಳೆತ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.later4': 'ಬೆಳಗೆದ್ದಾಗ ಬೆನ್ನಿಗೆ ಬಿಗುವು ಆಗುತ್ತದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?',

  'health.q.senior1': 'ಮೊಣಕೆಯಲ್ಲಿ ಇತ್ತ ನೋವು, ನಡೆಯಲು ಕಷ್ಟ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.senior2': 'ಹಲವು ಔಷಧಿ ಪ್ರತಿದಿನೂ ತೆಗೆಯಬೇಕು — ಯಾವುದು ಹಾನಿಕಾರಿ ಎಂದು ಹೇಗೆ ತಿಳಿಯುವುದು?',

  'health.q.senior3': 'ರಾತ್ರಿ ಪದಕ್ಕೆ ಪದ ಮೂತ್ರ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.senior4': 'ಕೇಳುವುದು ಕಡಿಮೆಯಾಗಿದೆ, ಕೇಳುವುದಕ್ಕೆ ಏನೋ ಉಪಾಯ ತಿಳಿಸಿ.',

  'health.q.elder1': 'ಮನೆಯಲ್ಲಿ ಉದುರುವ ಭಯ, ಯಾವ ಸುರಕ್ಷತೆ ಇಡಬೇಕು?',

  'health.q.elder2': 'ನೆನಪು ದುರ್ಬಲವಾಗುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.elder3': 'ಪ್ರತಿದಿನೂ ನೋವಿನ ಔಷಧಿ ತೆಗೆಯಬೇಕು — ಇದರ ಹಾನಿ ಇದೆಯೇ?',

  'health.q.elder4': 'ಯಾವಾಗ ವೈದ್ಯರ ಬಗ್ಗೆ ಹೋಗುವುದು ಅಗತ್ಯ?',

  'support.contactMessageLabel': 'ನಿಮ್ಮ ಮಾತು',

  'support.contactPlaceholder': 'ಬರೆಯಬೇಕಾದದ್ದನ್ನೇ ಬರೆಯಿರಿ — ತಪ್ಪಿದ್ದರೆ, ಏನಾದರೂ ಚೆನ್ನದಿದ್ದರೆ, ಅಥವಾ ಪ್ರಶ್ನೆ ಇದ್ದರೆ.',

  'support.contactHelp': 'ಕನಿಷ್ಠ 10 ಅಕ್ಷರ. ಇದು ನೇರವಾಗಿ ಮಾಲೀಕರಿಗೆ ತಲುಪುತ್ತದೆ.',

  'support.contactSubmit': 'ಕಳುಹಿಸಿ',

  'support.contactSending': 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…',

  'support.contactPrivacy': 'ನಿಮ್ಮ ಹೆಸರು ಬರೆಯುವುದು ಅಗತ್ಯವಿಲ್ಲ.',

  'support.contactSent': 'ತಲುಪಿದೆ',

  'support.contactSentBody': 'ನಿಮ್ಮ ಮಾತು ಮಾಲೀಕರಿಗೆ ತಲುಪಿದೆ.',

  'support.contactFailed': 'ಕಳುಹಿಸಲಾಗಲಿಲ್ಲ',

  'support.faq1Q': 'ಇದು ನಿಜವಾಗಿಯೂ ಉಚಿತವೇ?',

  'support.faq1A': 'ಹೌದು. ಹಣ ತೆಗೆಯುವುದಿಲ್ಲ, ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ, ಸದಸ್ಯತ್ವ ತೆಗೆಯುವುದಿಲ್ಲ. ಇದು ಒಬ್ಬ ವ್ಯಕ್ತಿಯ ಹಣದಿಂದ ನಡೆಯುತ್ತದೆ, ಕಂಪನಿ ಅಥವಾ ಸರ್ಕಾರದದ್ದಲ್ಲ.',

  'support.faq2Q': 'ನನ್ನ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ನಂಬರ್ ತೆಗೆಯುತ್ತಾರೆ?',

  'support.faq2A': 'ಇಲ್ಲ, ಮತ್ತು ತೆಗೆಯುವುದಿಲ್ಲ. ಈ ಸೈಟ್ ತಾನಾಗೆ ಯಾವುದೇ ಗುರುತನ್ನು ರಚಿಸುವುದಿಲ್ಲ — ಲಾಗಿನ್ ಇಲ್ಲ, ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ಕ್ರಿಪ್ಟ್ ಇಲ್ಲ. ಕೇಳುವುದು ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮಾತ್ರ, ಅದೇ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.',

  'support.faq3Q': 'ಇದು ವೈದ್ಯ ಅಥವಾ ವಕೀಲವೇ?',

  'support.faq3A': 'ಇಲ್ಲ. ಇದು ಔಷಧಿ ಅಥವಾ ಕಾನೂನು ಸಲಹೆ ಕೊಡುವುದಿಲ್ಲ. ವಿಷಯವು ಗಂಭೀರವಾದಂತೆ ಇಲ್ಲಿ ನಿಮಗೆ ವೈದ್ಯರ ಅಥವಾ ಅಧಿಕಾರಿಯ ಬಗ್ಗೆ ಹೋಗಬೇಕೆಂದು ಹೇಳುತ್ತದೆ — ಅವರ ಸ್ಥಾನವನ್ನು ಇದು ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.',

  'support.faq4Q': 'ಪ್ರತಿ ಉತ್ತರ ಸರಿಯೇ?',

  'support.faq4A': 'ಎಂದಿಗೂ ಅಲ್ಲ. ಉತ್ತರ ಬರೆದ್ದೇ ಕಂಪ್ಯೂಟರ್, ವೈದ್ಯರಲ್ಲ — ಅತ್ತರಾಗಿ ಪ್ರತಿ ಉತ್ತರದೊಂದಿಗೆ ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ ಎಂದು ಬರೆದಿದೆ. ಯಾವುದೇ ಔಷಧಿ ಆರಂಭಿಸುವ ಮೊದಲು ಅಥವಾ ನಿಲ್ಲಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.',

  'support.faq5Q': 'ನನಗೆ ಯಾವುದೇ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕೇ?',

  'support.faq5A': 'ಇಲ್ಲ. ಇದು ಬ್ರೌಸರ್‌ನಲ್ಲೇ ತೆರೆಯುತ್ತದೆ. ಯಾವುದೇ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಇಲ್ಲ, ಯಾವುದೇ ಅನುಮತಿ ಇಲ್ಲ, ಯಾವುದೇ ಅಪ್‌ಡೇಟ್ ಇಲ್ಲ.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'ಮನೆಮದ್ದು',
  'remedy.title': 'ಆಯುರ್ವೇದ ಮನೆಮದ್ದು',
  'remedy.intro': 'ಯಾವ ತೊಂದರೆಯಾದರೂ — ಕೆಮ್ಮು, ತಲೆನೋವು, ಕೀಲು ನೋವು, ತುರಿಕೆ, ಮಧುಮೇಹ, ಬೆನ್ನು ನೋವು — ಕೆಳಗೆ ನಿಮ್ಮ ತೊಂದರೆ ಆರಿಸಿ ಅಥವಾ ನಿಮ್ಮ ಮಾತಿನಲ್ಲಿ ಕೇಳಿ. ಮನೆಯ ಕಷಾಯ, ಮಸಾಜ್, ಆಹಾರ ಮತ್ತು ಆಯುರ್ವೇದ ಕ್ರಮಗಳನ್ನು ಹೇಳಲಾಗುತ್ತದೆ.',
  'remedy.choose': 'ನಿಮ್ಮ ತೊಂದರೆ ಆರಿಸಿ',
  'remedy.emergencyStrong': 'ಇವು ತುರ್ತು ಸ್ಥಿತಿಗಳು:',
  'remedy.emergency': 'ಹಾವು ಕಡಿತ, ಚೇಳು ಕುಟುಕು ಮತ್ತು ನಾಯಿ ಕಡಿತ — ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ, ಮೊದಲು 112 ಗೆ ಕರೆ ಮಾಡಿ. ಮನೆಮದ್ದು ದಾರಿಯಲ್ಲಿ ಮಾತ್ರ, ಆಸ್ಪತ್ರೆಗೆ ಬದಲಾಗಿ ಅಲ್ಲ.',
  'remedy.note': 'ಮನೆ ಮತ್ತು ಆಯುರ್ವೇದ ಕ್ರಮಗಳು ತೊಂದರೆ ಕಡಿಮೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ; ವೈದ್ಯರ ಪರೀಕ್ಷೆ ಮತ್ತು ಚಿಕಿತ್ಸೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ಯಾವ ಔಷಧಿಯನ್ನೂ ನೀವೇ ಪ್ರಾರಂಭಿಸಬೇಡಿ ಅಥವಾ ನಿಲ್ಲಿಸಬೇಡಿ.',
  'remedy.cough': 'ಕೆಮ್ಮು',
  'remedy.headache': 'ತಲೆನೋವು',
  'remedy.joints': 'ಕೀಲು ನೋವು',
  'remedy.itching': 'ತುರಿಕೆ',
  'remedy.snake': 'ಹಾವು ಕಡಿತ',
  'remedy.scorpion': 'ಚೇಳು ಕುಟುಕು',
  'remedy.dog': 'ನಾಯಿ ಕಡಿತ',
  'remedy.diabetes': 'ಮಧುಮೇಹ',
  'remedy.back': 'ಬೆನ್ನು ನೋವು',
  'remedy.walking': 'ನಡೆಯಲು ತೊಂದರೆ',
  'home.remedyNote': 'ಕಷಾಯ, ಮಸಾಜ್, ಆಹಾರ ಮತ್ತು ಆಯುರ್ವೇದ ಕ್ರಮಗಳು — ಪ್ರತಿ ತೊಂದರೆಗೂ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.',
  'nav.aarti': 'ಆರತಿ ಮತ್ತು ಭಜನೆ',
  'aarti.title': 'ಆರತಿ ಮತ್ತು ಭಜನೆ — ನಿಜವಾದ ಧ್ವನಿಯಲ್ಲಿ',
  'aarti.intro': 'ಇಲ್ಲಿ ಆರತಿ, ಕೀರ್ತನೆ ಮತ್ತು ಭಜನೆ ಕೇಳಿ — ನಿಜವಾದ ಗಾಯಕರು ಮತ್ತು ದೇವಾಲಯಗಳ ಧ್ವನಿಯಲ್ಲಿ. AI ಧ್ವನಿ ಇಲ್ಲ.',
  'aarti.note': 'ಆರತಿ ಅಥವಾ ಭಜನೆಯನ್ನು ಗಣಕದ ಧ್ವನಿಯಲ್ಲಿ ಹಾಕುವುದು ಅದರ ಲಯ ಮತ್ತು ಭಕ್ತಿಯನ್ನು ಕಳೆದುಕೊಳ್ಳುವುದು. ಆದ್ದರಿಂದ ಇಲ್ಲಿ ಎಲ್ಲವೂ ನಿಜವಾದ ಧ್ವನಿಮುದ್ರಿಕೆಗಳು.',
  'aarti.kindAarti': 'ಆರತಿ',
  'aarti.kindKirtan': 'ಕೀರ್ತನೆ',
  'aarti.kindBhajan': 'ಭಜನೆ',
  'aarti.credit': 'ಧ್ವನಿಮುದ್ರಿಕೆ:',
  'aarti.licence': 'ಪರವಾನಗಿ:',
  'aarti.listenLink': 'ನಿಜವಾದ ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ',
  'aarti.textChecked': 'ಇದು ಸಾಂಪ್ರದಾಯಿಕ ಪಾಠ, ನಿಜವಾದ ಧ್ವನಿಮುದ್ರಣದಲ್ಲಿ ಹಾಡಿದಂತೆ.',
  'aarti.textPrinted': 'ಇದು ಪ್ರಕಟಿತ ಸಂಗ್ರಹಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ ಪರಿಶೀಲಿಸಿದ ಸಾಂಪ್ರದಾಯಿಕ ಪಾಠ.',
  'aarti.textNotStored': 'ಈ ಗ್ರಂಥದ ಪೂರ್ಣ ಪಾಠ ಇಲ್ಲಿ ಸಂಗ್ರಹವಾಗಿಲ್ಲ — ಕೆಳಗಿನ ಧ್ವನಿಮುದ್ರಣದಲ್ಲಿ ಪೂರ್ಣ ಪಾಠವಿದೆ.',
  'aarti.granthTitle': 'ಗ್ರಂಥ, ಚಾಲೀಸಾ ಮತ್ತು ಸ್ತೋತ್ರಗಳು — ನಿಜವಾದ ಧ್ವನಿಯಲ್ಲಿ',
  'aarti.noRecording': 'ಈ ಆರತಿಯ ನಿಜವಾದ ಧ್ವನಿಮುದ್ರಣ ಇನ್ನೂ ಸೈಟ್‌ನಲ್ಲಿಲ್ಲ, ಆದ್ದರಿಂದ ನಾನು ಅದನ್ನು ಹಾಡಿ ಕೇಳಿಸಲಾರೆ — ಎಐ ಧ್ವನಿಯಲ್ಲಿ ಆರತಿ ಎಂದಿಗೂ ಹಾಡುವುದಿಲ್ಲ.',
  'aarti.textOnlyTitle': 'ಇನ್ನಷ್ಟು ಆರತಿಗಳು — ಪಾಠ ಮತ್ತು ನಿಜವಾದ ಧ್ವನಿ',
  'aarti.fullText': 'ಪೂರ್ಣ ಪಾಠ',
  'aarti.notChecked': 'ಈ ಆರತಿಯ ಪರಿಶೀಲಿಸಿದ ಪಾಠ ಇನ್ನೂ ಸೈಟ್‌ನಲ್ಲಿಲ್ಲ. ಪರಿಶೀಲಿಸದ ಪಾಠ ನೀಡಲಾಗುವುದಿಲ್ಲ, ಏಕೆಂದರೆ ಪ್ರಾರ್ಥನೆಯಲ್ಲಿ ತಪ್ಪು ಪದ ಪದಗಳಿಲ್ಲದಿರುವುದಕ್ಕಿಂತ ಕೆಟ್ಟದು.',
  'aarti.verifiedList': 'ಸೈಟ್‌ನಲ್ಲಿ ಈ ಆರತಿಗಳ ಪರಿಶೀಲಿಸಿದ ಪಾಠಗಳಿವೆ:',

};

const MALAYALAM: Record<string, string> = {
  'jgd.placeSearch': 'നിങ്ങളുടെ ഊരിന്റെ പേര് ടൈപ്പ് ചെയ്യുക',
  'jgd.placeNoMatch': 'ആ ഊര് പട്ടിയില് ഇല്ല. അടുത്തുള്ള ഊര് തിരഞ്ഞെടുക്കുക.',

  'account.name': 'നിങ്ങളുടെ പേര്',
  'account.namePlaceholder': 'ഉദാ. സീത ദേവി',
  'account.nameHint': 'നിങ്ങൾ ആരാണെന്ന് അറിയാൻ. ഏത് പേരും സ്വീകരിക്കും, ഇത് ആവശ്യമല്ല.',

  'nav.home': 'ഹോം', 'home.metaTitle': 'സൗജന്യ പരിഹാരം, നിങ്ങളുടെ സ്വന്തം വാക്കുകളിൽ', 'nav.tribute': 'സ്മരണം', 'nav.help': 'സഹായം', 'nav.reference': 'വിവരം',
  'lib.licence.ccZero.name': 'CC0 / പബ്ലിക് ഡൊമെയ്ൻ',
  'lib.licence.pd.name': 'പബ്ലിക് ഡൊമെയ്ൻ',
  'lib.licence.govtIndia.name': 'ഇന്ത്യൻ സർക്കാർ',
  'lib.licence.creativeCommons.name': 'ക്രിയേറ്റീവ് കോമൺസ് (മിശ്രിതം)',
  'lib.licence.freeToRead.name': 'വായിക്കാൻ സൗജന്യം',
  'lib.entry.ncert.title': 'NCERT പുസ്തകങ്ങൾ — ക്ലാസ് 1 മുതൽ 12 വരെ',
  'lib.entry.ncert.what': 'ഓരോ വിഷയത്തിലെയും എല്ലാ പുസ്തകങ്ങളും, ഓരോ ക്ലാസിനും. ലോഗിൻ ഇല്ലാതെ, നേരിട്ടുള്ള PDF.',
  'lib.entry.ncert.langs': 'ഹിന്ദി, ഇംഗ്ലീഷ്, 30-ലധികം ഇന്ത്യൻ ഭാഷകൾ',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ഡിജിറ്റൽ പാഠപുസ്തകങ്ങൾ',
  'lib.entry.pm-evidya.what': 'NCERT പുസ്തകങ്ങളുടെ ആപ്പ്, വലിയ അക്ഷരത്തിൽ വായിക്കാം. സംസാരിച്ചും കേൾക്കാം.',
  'lib.entry.pm-evidya.langs': 'ഇന്ത്യൻ ഭാഷകൾ',
  'lib.entry.diksha.title': 'DIKSHA — അധ്യാപകർക്കും കുട്ടികൾക്കും',
  'lib.entry.diksha.what': 'പാഠങ്ങൾ, വീഡിയോ, അഭ്യാസം — ക്ലാസ് 1 മുതൽ 12 വരെ.',
  'lib.entry.diksha.langs': 'ഇന്ത്യൻ ഭാഷകൾ',
  'lib.entry.khan-academy.title': 'Khan Academy — ഇംഗ്ലീഷിൽ ഗണിതവും ശാസ്ത്രവും',
  'lib.entry.khan-academy.what': 'ഓരോ ക്ലാസിലേയും വീഡിയോ പാഠങ്ങൾ, എഴുത്തുരൂപവുമുണ്ട്.',
  'lib.entry.openstax.title': 'OpenStax — ഇംഗ്ലീഷിൽ സൗജന്യ പുസ്തകങ്ങൾ',
  'lib.entry.openstax.what': 'കോളേജ് തലത്തിലുള്ള പുസ്തകങ്ങൾ — ഗണിതം, ശാസ്ത്രം, മാനവികം. ഓരോ പേജിലും PDF.',
  'lib.entry.nios.title': 'NIOS — ദൂരവിദ്യാഭ്യാസം, സൗജന്യ സാമഗ്രി',
  'lib.entry.nios.what': 'ഓപ്പൺ, ഓൺലൈൻ കോഴ്സുകളുടെ സൗജന്യ പുസ്തികകൾ, പ്രവേശനം ഇല്ലാതെ.',
  'lib.entry.nios.langs': 'ഹിന്ദി, ഇംഗ്ലീഷ്, മറ്റുള്ളവ',
  'lib.entry.ignou.title': 'IGNOU — ഉയർന്ന പഠനത്തിനുള്ള സൗജന്യ പുസ്തകങ്ങൾ',
  'lib.entry.ignou.what': 'ദൂരവിദ്യാഭ്യാസ പുസ്തകങ്ങൾ, പൂർണ്ണമായും സൗജന്യം.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ഇംഗ്ലീഷിലെ പഴയ പുസ്തകങ്ങൾ',
  'lib.entry.gutenberg.what': '70,000-ലധികം പുസ്തകങ്ങൾ, എല്ലാത്തിന്റെയും പകർപ്പവകാശം കഴിഞ്ഞു. സൗജന്യ ഇ-ബുക്കുകളും ഓഡിയോയും.',
  'lib.entry.pratham-books.title': 'Pratham Books — കുട്ടികളുടെ പുസ്തകങ്ങൾ',
  'lib.entry.pratham-books.what': 'ഇന്ത്യൻ ഭാഷകളിലെ കുട്ടികളുടെ പുസ്തകങ്ങൾ, പൂർണ്ണമായും സൗജന്യം. ക്ലാസ് 1 മുതൽ 5 വരെ.',
  'lib.entry.pratham-books.langs': 'ഹിന്ദി, മറാത്തി, ബംഗാളി, തമിഴ്, തെലുങ്ങ് തുടങ്ങിയവ',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — പത്രങ്ങളും പഴയ മാഗസിനുകളും',
  'lib.entry.internet-archive-texts.what': 'ലക്ഷക്കണക്കിന് പഴയ പുസ്തകങ്ങൾ, മാഗസിനുകൾ, പത്രങ്ങൾ — സൗജന്യം.',
  'lib.entry.wikisource.title': 'Wikisource — സൗജന്യ പൊതുഗ്രന്ഥങ്ങൾ',
  'lib.entry.wikisource.what': 'പകർപ്പവകാശമില്ല — ഇവ ലോകത്തിന്റെ പഴയ സാഹിത്യപുസ്തകങ്ങളാണ്.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — എല്ലാ തരം ചിത്രങ്ങളും',
  'lib.entry.wikimedia-commons.what': 'ജന്തുക്കൾ, ഭൂപടങ്ങൾ, നക്ഷത്രങ്ങൾ, ചരിത്രം — എല്ലാം. ഓരോ ചിത്രത്തിനും സ്വന്തം ലൈസൻസ് ഉണ്ട്.',
  'lib.entry.pixabay.title': 'Pixabay — ഫോട്ടോകളും ചിത്രങ്ങളും',
  'lib.entry.pixabay.what': 'ഫോട്ടോകൾ, വരയ്ക്കലുകൾ, ചെറിയ വീഡിയോകൾ.',
  'lib.entry.unsplash.title': 'Unsplash — മനോഹരമായ ഫോട്ടോകൾ',
  'lib.entry.unsplash.what': 'സൗജന്യം, വലിയ വലുപ്പത്തിൽ, അക്കൗണ്ട് വേണ്ട.',
  'lib.entry.openverse.title': 'Openverse — എല്ലാ സൗജന്യ ചിത്രങ്ങളും ഒരിടത്ത്',
  'lib.entry.openverse.what': 'ഒരേസമയം നിരവധി സൗജന്യ ചിത്ര സൈറ്റുകൾ തിരയുക.',
  'lib.entry.librivox.title': 'LibriVox — കേൾക്കാനുള്ള പുസ്തകങ്ങൾ',
  'lib.entry.librivox.what': 'പഴയ ഇംഗ്ലീഷ് പുസ്തകങ്ങളുടെ സൗജന്യ ഓഡിയോ, മനുഷ്യശബ്ദത്തിൽ.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ഓഡിയോ ശേഖരം',
  'lib.entry.internet-archive-audio.what': 'ആയിരക്കണക്കിന് സൗജന്യ റെക്കോർഡിംഗുകൾ — പുസ്തകങ്ങൾ, പ്രസംഗങ്ങൾ, സംഗീതം.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — ദേശീയഗാനവും മറ്റുള്ളവയും',
  'lib.entry.vande-mataram.what': 'ഇന്ത്യയുടെ ദേശീയഗാനവും മറ്റ് ദേശീയഗാനങ്ങളും, സൗജന്യം.',
  'art.aag-aur-bijli-ke-bachav.title': 'തീയിൽ നിന്നും വൈദ്യുതിയിൽ നിന്നും സംരക്ഷിക്കാനുള്ള നിയമങ്ങൾ',
  'art.aag-aur-bijli-ke-bachav.summary': 'വീട്ടിൽ തീപിടിത്തം തടയുക — ലളിതമായ നിയമങ്ങൾ',
  'art.aag-lagne-par-kya-karein.title': 'തീപിടിത്തമുണ്ടായാൽ എന്ത് ചെയ്യണം',
  'art.aag-lagne-par-kya-karein.summary': 'കത്തുന്ന വീട്ടിലെ തീ — ആദ്യം എന്ത് ചെയ്യണം, എന്ത് ചെയ്യരുത്',
  'art.bimari-se-bachav.title': 'അണുബാധയിൽ നിന്ന് സംരക്ഷിക്കാനുള്ള ഏഴ് നിയമങ്ങൾ',
  'art.bimari-se-bachav.summary': 'കൈ കഴുകൽ, മാസ്ക്, വാക്സിൻ — എങ്ങനെ സുരക്ഷിതരായിരിക്കാം',
  'art.dhuwan-ka-jhakora.title': 'പുകമൂലം ശ്വാസംമുട്ടുന്നതിൽ നിന്ന് സംരക്ഷണം',
  'art.dhuwan-ka-jhakora.summary': 'ശ്വാസം നിൽക്കുന്നു, കാറ്റ് കയറുന്നില്ല — എന്ത് ചെയ്യണം, എപ്പോൾ ആശുപത്രിയിൽ പോകണം',
  'art.doodh-pani-band-ho.title': 'വൈദ്യുതിയോ വെള്ളമോ പെട്ടെന്ന് നിന്നാൽ',
  'art.doodh-pani-band-ho.summary': 'എന്ത് ചെയ്യണം, എന്ത് ഒഴിവാക്കണം, എപ്പോൾ സഹായം ചോദിക്കണം',
  'art.haath-ki-saafai.title': 'സോപ്പില്ലാതെ കൈ വൃത്തിയാക്കുന്ന വിധം',
  'art.haath-ki-saafai.summary': 'വെള്ളമോ സോപ്പോ ഇല്ലാത്തപ്പോൾ',
  'cat.dhyan-aur-yoog.title': 'ധ്യാനവും യോഗയും',
  'cat.dhyan-aur-yoog.subtitle': 'മനസ്സിനെ ശാന്തമാക്കാനുള്ള ലളിത മാർഗ്ഗങ്ങൾ',
  'cat.gharelu-marammat.title': 'വീട്ടുമുറത്തായ ശരിയാക്കൽ',
  'cat.gharelu-marammat.subtitle': 'വീട്ടിലെ ചെറിയ പ്രശ്നങ്ങൾക്കുള്ള പരിഹാരങ്ങൾ',
  'cat.bachchon-ki-padhai.title': 'കുട്ടികളുടെ പഠനം',
  'cat.bachchon-ki-padhai.subtitle': 'പഠനത്തിലാണ്, ആശങ്കയിലാണ്',
  'cat.budharge-seva.title': 'മുതിർന്നവരുടെ സേവനം',
  'cat.budharge-seva.subtitle': 'പരിചരണവും സഹായവും',
  'cat.shishu-dekhbhal.title': 'ശിശു പരിചരണം',
  'cat.shishu-dekhbhal.subtitle': 'ചെറിയ കുഞ്ഞിന്റെ ശരിയായ പരിചരണം',
  'cat.dharmik-upay.title': 'ആത്മീയ പരിഹാരങ്ങൾ',
  'cat.dharmik-upay.subtitle': 'ശാന്തമായ മനസ്സോടെ',
  'cat.pavan-grah-aur-aarti.title': 'പുണ്യഗ്രന്ഥങ്ങളും ആരതിയും',
  'cat.pavan-grah-aur-aarti.subtitle': 'ഭക്തിയോടെ വായിക്കുകയും കേൾക്കുകയും ചെയ്യുക',
  'cat.aapatkalen-gayide.title': 'അടിയന്തര വഴികാട്ടി',
  'cat.aapatkalen-gayide.subtitle': 'ഉടനെ സഹായം വേണ്ടപ്പോൾ',
  'cat.mahamari-suraksha.title': 'മഹാമാരി സുരക്ഷ',
  'cat.mahamari-suraksha.subtitle': 'രോഗം പരക്കാതെ തടയുക',
  'nav.reviews': 'അഭിപ്രായം', 'nav.support': 'സഹായിക്കൂ', 'nav.menu': 'മെനു',
  'nav.birthChart': 'ജനം ഗണ്ഠം',
  'jgd.title': 'നിങ്ങളുടെ ജനം ഗണ്ഠം',
  'jgd.intro': 'നിങ്ങളുടെ പേര്, ജനന തീയതി, അറിയാമെങ്കിൽ സമയവും സ്ഥലവും. എല്ലാം നിങ്ങളുടെ ഫോണിലേക്കാണ് കണക്കാക്കുന്നത് — എവിടെയോ അയയ്ക്കരുന്നില്ല.',
  'jgd.nameLabel': 'ജനനത്തെയുടെ പേര്',
  'jgd.namePlaceholder': 'ഉദാ. പൂർണ്ണ പേര്',
  'jgd.nameHint': 'കുഞ്ഞിവള്ളിൽ നൽകിയ പേര്.',
  'jgd.dateLabel': 'ജനന തീയതി',
  'jgd.timeLabel': 'ജനന സമയം',
  'jgd.timeHint': 'അറിയില്ലെങ്കിൽ വിട്ടുവേറ്റും.',
  'jgd.placeLabel': 'ജനന സ്ഥലം',
  'jgd.placeNone': 'അറിയില്ല / തിരഞ്ഞെടുക്കുക',
  'jgd.placeHint': 'ജനന സ്ഥലം തിരഞ്ഞെടുക്കുക.',
  'jgd.submit': 'കണക്കാക്കുക',
  'jgd.savePdf': 'PDF ഉണ്ടാക്കുക',
  'jgd.again': 'വീണ്ടും കണക്കാക്കുക',
  'jgd.errDate': 'ജനന തീയതി ശരിയായിട്ട് നൽകുക.',
  'jgd.errPlace': 'പട്ടിയിൽ നിന്ന് നിങ്ങളുടെ ഊര് തിരഞ്ഞെടുക്കുക, അല്ലെങ്കിൽ അടുത്തുള്ള ഊര് തിരഞ്ഞെടുക്കുക.',
  'jgd.numTitle': 'അക്ക ജ്യോതിഷ',
  'jgd.lifePath': 'ജീവിത വഴി',
  'jgd.nameNumber': 'പേര് അക്കം',
  'jgd.soulNumber': 'ആത്മ അക്കം',
  'jgd.birthdayNumber': 'ജനനദിന അക്കം',
  'jgd.astroTitle': 'വൈദിക ജ്യോതിഷ',
  'jgd.nakshatra': 'നക്ഷത്രം',
  'jgd.pada': 'പാദ',
  'jgd.rashi': 'രാശി',
  'jgd.rashiLord': 'രാശി ഉടേശി',
  'jgd.nakshatraLord': 'നക്ഷത്ര ഉടേശി',
  'jgd.lagna': 'ലഗ്നം',
  'jgd.lagnaMissing': 'ലഗ്നത്തിന് ജനന സമയവും സ്ഥലവും വേണം. മുകളിൽ പൂരിപ്പിച്ച് വീണ്ടും കണക്കാക്കുക — അറിയില്ലെങ്കിൽ ഇതും മതി.',
  'jgd.gunTitle': 'ഗുണ മിലനം',
  'jgd.gunIntro': 'മറ്റൊരാളുടെ പേര്, ജനന തീയതി നൽകുക.',
  'jgd.gunName': 'അവരുടെ പേര്',
  'jgd.gunDate': 'അവരുടെ ജനന തീയതി',
  'jgd.gunHint': 'രണ്ടു പേരുകളും തീയതികളും ഉണ്ടെങ്കിൽ ഗുണ മിലനം ലഭിക്കും.',
  'jgd.disclaimer': 'ഇത് പാരമ്പരിക രീതിയിൽ കണക്കാക്കിയതാണ്, പ്രവചനമല്ല. ഏത് അക്കവും രാശിയും ആരുടെയോ ആരോഗ്യം, പണം അല്ലെങ്കിൽ ബന്ധങ്ങൾ തീരുമാനിക്കില്ല. വലിയ തീരുമാനങ്ങൾക്ക് ഡോക്ടർ, അഡ്വികറ്ററ്റോ പരിചയമുള്ളവരുടെ ഉപദേശം എടുക്കുക.',
  'nav.openMenu': 'മെനു തുറക്കുക', 'nav.closeMenu': 'മെനു അടയ്ക്കുക', 'nav.language': 'ഭാഷ മാറ്റുക',
  'ask.label': 'നിങ്ങളുടെ പ്രശ്നം എഴുതുക അല്ലെങ്കിൽ പറയുക',
  'ask.placeholder': 'ഉദാ: കുട്ടിയുടെ പഠനത്തിൽ കുറവ്',
  'ask.help': 'എന്റർ അമർത്തിയാലും അയയ്ക്കാം.', 'ask.send': 'ചോദിക്കുക', 'ask.sending': 'ചിന്തിക്കുന്നു…',
  'ask.speak': 'പറഞ്ഞ് ചോദിക്കുക', 'ask.suggested': 'സ്വാഭാവിക ചോദ്യങ്ങൾ',
  'ask.answerTitle': 'ഉത്തരം', 'ask.listen': 'കേൾക്കുക', 'ask.stopSpeak': 'നിർത്തുക',
  'ask.aiNote': 'ഈ ഉത്തരം AI നൽകിയതാണ്. വിദഗ്ധന്റെ നിർദ്ദേശത്തിന് പകരം അല്ല.',
  'sound.title': 'ശാന്തതയ്ക്കുള്ള ശബ്ദം', 'sound.intro': 'ഫീസില്ല, പരസ്താരങ്ങളില്ല.',
  'home.soundTitle': 'ശാന്തതയ്ക്കുള്ള ശബ്ദം',
  'sound.shankh': 'ശംഖം', 'sound.bansuri': 'ബാംസുരി', 'sound.dhol': 'ഡ്രം', 'sound.all': 'മൂന്നും',
  'dhun.welcome': 'സ്വാഗതം', 'dhun.prompt': 'ശംഖം, ബാംസുരി, ഡ്രം ഒരുമിച്ച് കേൾക്കാൻ സ്പർശിക്കുക.',
  'dhun.listen': 'കേൾക്കുക', 'dhun.skip': 'ഒഴിവാക്കുക',
  'home.readMore': 'പൂർണ്ണ വിവരങ്ങൾ വായിക്കുക', 'home.chooseTopic': 'എന്തുക്കുറിച്ച് അറിയണം?',
  'home.askHere': 'ഈ വിഷയത്തിൽ ചോദിക്കുക', 'home.howTitle': 'ഈ സേവനം എങ്ങനെ പ്രവർത്തിക്കുന്നു',
  'home.freeTitle': 'ഈ സേവനം പൂർണ്ണമായും സൌജന്യം', 'home.freeBody': 'പണം വാങ്ങുന്നില്ല, വ്യക്തിഗത വിവരങ്ങൾ ചോദിക്കുന്നില്ല, പരസ്യവുമില്ല.',
  'footer.pages': 'പേജുകൾ', 'footer.helplines': 'പ്രധാന നമ്പർ',
  'reviews.title': 'നിങ്ങളുടെ അഭിപ്രായം, നിങ്ങളുടെ വാക്കുകൾ', 'reviews.submit': 'അയയ്ക്കൂ',
  'language.choose': 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക', 'language.articlesIn': 'ഈ ലേഖനം ഹിന്ദിയിലാണ്.',

  'ask.welcome': 'സ്വാഗതം! താഴെ നിങ്ങളുടെ പ്രശ്നം എഴുതുക അല്ലെങ്കിൽ ഒരു വിഷയം തിരഞ്ഞെടുക്കുക.',

  'ref.notTitle': 'ഇത് എന്ത് ചെയ്യില്ല',

  'ref.not1': 'ഇത് ഡോക്ടർ അല്ല. മരുന്നിന്റെ ഉപദേശം ഒരിക്കലും നൽകുന്നില്ല.',

  'ref.not2': 'ഇത് അറ്റോർണി അല്ല. നിയമ ഉപദേശം നൽകുന്നില്ല.',

  'ref.not3': 'ഒരു പൈസാ എടുക്കുന്നില്ല, വിളംപരവുമില്ല.',

  'ref.not4': 'നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും ചോദിക്കുന്നില്ല, സൂക്ഷിക്കുന്നതുമില്ല.',

  'ref.not5': 'സർക്കാർ പദ്ധതിയുടെ വിലയോ നമ്പറോ ഉണ്ടാക്കുന്നില്ല — വിവരമില്ലെങ്കിൽ വ്യക്തമായി തിരിച്ചറിയുന്നു.',

  'ref.medicalTitle': 'പ്രധാനം: ഇത് ഡോക്ടറുടെ ഉപദേശമല്ല',

  'ref.medicalBody': 'രോഗവും മരുന്നും വഷയും സംബന്ധിച്ച് ആണെങ്കിൽ ആദ്യം ഡോക്ടറെ കാണുക. ഇവിടെ നൽകിയ വിവരങ്ങൾ പൊതുവായ സഹായത്തിനായി മാത്രം. കുട്ടിയുടെ വാക്സിൻ, ഗർഭാവസ്ഥ, അല്ലെങ്കിൽ ഏത് മരുന്നും തുടങ്ങുന്നതിന് മുമ്പ് ഡോക്ടറുടെ ഉപദേശം നിശ്ചയമായി എടുക്കുക.',

  'ref.statsTitle': 'എത്ര വിവരങ്ങൾ ഉണ്ട്',

  'support.howTitle': 'ഞങ്ങളെ എങ്ങനെ സഹായിക്കാം',

  'support.alwaysFreeTitle': 'ഈ സേവനം എപ്പോഴും സൗജന്യമായിരിക്കും',

  'support.alwaysFreeBody': 'ലഭിക്കുന്ന സഹായം ഈ സേവനം പ്രവർത്തിക്കാൻ ഉപയോഗിക്കും. ആരുടെയും ഒരിക്കലും പണം എടുക്കില്ല.',

  'smriti.eyebrow': 'സ്മരണാർഹത്തിന്',

  'smriti.whyTitle': 'ഈ സൈറ്റ് എന്തുകൊണ്ട്',

  'smriti.ending': 'അവളുടെ പോരാട്ടം ഇവിടെ തന്നെ തുടരുന്നു.',

  'article.askAny': 'ഒരു ചോദ്യം ചോദിക്കുക',

  'article.remember': 'ഓർമ്മിക്കുക',

  'article.emergencyInfo': 'പ്രധാന വിവരങ്ങൾ',

  'article.medicalTitle': 'ഇത് മെഡിക്കൽ നിർദ്ദേശമല്ല',

  'article.medicalBody': 'ഈ വിവരങ്ങൾ പൊതുവായ സഹായത്തിനായി. ഡോക്ടറുടെ നിർദ്ദേശമില്ലാതെ ഏതെങ്കിലും മരുന്ന് തുടങ്ങുകയോ നിർത്തുകയോ ചെയ്യരുത്.',

  'article.heading': '{category} സംബന്ധിച്ചുള്ള ലേഖനങ്ങൾ',

  'reviews.rateQuestion': 'എന്ത് നക്ഷത്രങ്ങൾ നൽകും?',

  'reviews.starsShort': '{value} നക്ഷത്രങ്ങൾ',

  'reviews.averageOutOf': '5-ൽ {value} നക്ഷത്രങ്ങൾ',

  'dhun.welcomeTitle': 'സ്വാഗതം',

  'dhun.consent': 'ശംഖം, ബാംസുരി, ഡ്രം ഒരുമിച്ച് കേൾക്കാൻ സ്പർശിക്കുക.',

  'dhun.failed': 'ശബ്ദം വില്ലാ.',

  'dhun.unsupported': 'ഈ ബ്രൗസറിന് ശബ്ദം കളിക്കാനാവില്ല.',

  'dhun.failedTry': 'ശബ്ദം കളിക്കുമ്പോൾ പ്രശ്നം ഉണ്ടായി.',

  'sound.hintIdle': 'ഏത് ബട്ടണും അമർത്തി ശബ്ദം കേൾക്കുക.',

  'sound.hintPlaying': 'ശബ്ദം കളിക്കുകയാണ്. നിർത്താൻ ആ അതേ ബട്ടൺ വീണ്ടും അമർത്തുക.',

  'sound.preparing': 'ശബ്ദം തയ്യാറാകുകയാണ്',

  'nav.path': 'വഴി',

  'toast.dismiss': 'അടയ്ക്കുക',

  'footer.free': 'ഈ സേവനം പൂർണ്ണമായും സൗജന്യം. ആരോടും പണം ആവശ്യമാക്കില്ല.',

  'cat.empty': 'ഈ വിഷയത്തിൽ ഇതുവരെ ലേഖനങ്ങളില്ല.',
  'cat.notFound': 'ഈ പേജ് കണ്ടെത്താൻ കഴിഞ്ഞില്ല',

  'dhun.label': 'ശബ്ദം കളിക്കാനുള്ള അനുമതി',

  'language.articlesInHint': 'ഓരോ ഭാഷയ്കും വ്യത്യസ്ത പരിഭാഷാപരിഭാഷ വേണം. ഈ പരിഭാഷ ഇതുവരെ നടന്നിട്ടില്ല — എഴുതിയിട്ടുള്ളത് ഹിന്ദിയിൽ തന്നെ ശരിയായതും പൂർണ്ണവും ആണ്.',

  'nav.collapse': 'ടാബ് അടയ്ക്കുക',

  'nav.expand': 'ടാബ് തുറക്കുക',

  'nav.skip': 'നേരിട്ട് ഉള്ളടക്കത്തിലേക്ക് പോകുക',

  'theme.toDark': 'ഇരുണ്ട രൂപത്തിലേക്ക് പോകുക',

  'theme.toLight': 'ഇളംപ്പം വർണ്ണത്തിലേക്ക് പോകുക',

  'ask.clear': 'എഴുതിയത് മായ്ക്കുക',

  'ask.emptyAnswer': 'ഈവാളു ഉത്തരം ഉണ്ടായില്ല. കുറച്ച് വ്യത്യസ്തമായി വീണ്ടും ചോദിക്കുക.',

  'ask.errorNetwork': 'ഇന്റര്‍നെറ്റ് പ്രവർത്തിക്കുന്നില്ല. കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.',

  'ask.errorRateLimit': 'ഒരുസമയം കൂടുതൽ ചോദ്യങ്ങൾ അയച്ചു. കുറച്ച് സമയം കഴിഞ്ഞ് ശ്രമിക്കുക.',

  'ask.heardWith': 'ഇപ്പോൾ കേളുന്നു',
  'ask.heard': 'കേൾക്കുന്നു',

  'ask.listening': 'പറയാൻ തുടങ്ങുക…',

  'ask.micUnsupported': 'ഈ ബ്രൗസറിൽ പറഞ്ഞ് ചോദിക്കിയാൽ പ്രവർത്തിക്കില്ല. എഴുതി ചോദിക്കുക.',

  'ask.notAnswer': 'ഈ ചോദ്യത്തിന് നേരിട്ട ഉത്തരം ഞങ്ങളുടെ കയ്യിൽ ഇല്ല.',


  'ask.stopListening': 'കേൾക്കുന്നത് നിർത്തുക',

  'article.askAbout': 'ഈ വിഷയത്തിൽ ചോദിക്കുക',

  'article.count': '{count} ലേഖനങ്ങൾ',

  'article.emergency': 'അടിയന്തരം',

  'article.others': 'ഈ വിഷയത്തിലെ കൂടുതൽ ലേഖനങ്ങൾ',

  'article.readAloud': 'ഈ ലേഖനം കേൾക്കുക',

  'footer.admin': 'ഉടമ',

  'footer.ambulance': 'ആംബുലൻസ്',

  'footer.emergency': 'അടിയന്തരം',

  'footer.readStory': 'അവളുടെ പൂർണ്ണ കഥ വായിക്കുക',

  'footer.rights': 'സൗജന്യ സേവനം',

  'footer.women': 'വനിതാ സഹായം',

  'sound.allHint': 'ഒരുമിച്ച്',

  'sound.bansuriHint': 'മൃദുവായ, മന്ത്രത്തം',

  'sound.dholHint': 'ശക്തമായ, വേഗമുള്ള',

  'sound.errGeneric': 'ശബ്ദം കളിക്കുമ്പോൾ പ്രശ്നം ഉണ്ടായി.',

  'sound.errUnsupported': 'ഈ ബ്രൗസറിന് ശബ്ദം കളിക്കാനാവില്ല.',

  'sound.listenLabel': 'കേൾക്കുക',

  'sound.playing': 'ശബ്ദം കളിക്കുകയാണ്. നിർത്താൻ ആ അതേ ബട്ടൺ വീണ്ടും അമർത്തുക.',

  'sound.shankhHint': 'ആഴമുള്ള, ദീർഘമായ',

  'voice.aborted': 'നിർത്തി. വീണ്ടും ശ്രമിക്കുക.',

  'voice.audioCapture': 'മൈക്രോഫോൺ ലഭിച്ചില്ല. ഉപകരണം കണക്ഷൻ ചെയ്യുക, അല്ലെങ്കിൽ എഴുതി ചോദിക്കുക.',

  'voice.generic': 'എന്തോ കുഴപ്പം സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.',

  'voice.network': 'പറഞ്ഞ് ചോദിക്കാൻ ഇന്റര്‍നെറ്റ് വേണം, അത് ഇല്ല. എഴുതി ചോദിക്കുക — അതേ ഉത്തരം കിട്ടും.',

  'voice.noSpeech': 'ഒരു ശബ്ദവും കേളാനാകാത്തിരുന്നു. മൈക്രോഫോണിനരികിൽ പറയുക, അല്ലെങ്കിൽ എഴുതുക.',

  'voice.notAllowed': 'മൈക്രോഫോണിന് അനുമതി ലഭിച്ചില്ല. മുകളിലേക്ക് പോയി അനുമതി നൽകുക, അല്ലെങ്കിൽ എഴുതി ചോദിക്കുക.',

  'voice.serviceNotAllowed': 'മൈക്രോഫോണിന് അനുമതി ലഭിച്ചില്ല. മുകളിലേക്ക് പോയി അനുമതി നൽകുക, അല്ലെങ്കിൽ എഴുതി ചോദിക്കുക.',

  'voice.speakFailed': 'ഈ ഉത്തരം വായിക്കുകയാകാത്തിരുന്നു.',
  'voice.noVoice': 'ഈ ഉപകരണത്തിൽ {name} ശബ്ദമില്ല. ഇപ്പോൾ എഴുതിയത് വായിക്കുക, അല്ലെങ്കിൽ ഫോൺ ക്രമീകരണങ്ങളിൽ ശബ്ദം ചേർക്കുക.',

  'voice.unsupported': 'ഈ ബ്രൗസറിൽ പറഞ്ഞ് ചോദിക്കിയാൽ പ്രവർത്തിക്കില്ല. എഴുതി ചോദിക്കുക.',

  'ask.notConfigured': 'ഈ സേവനം ഇപ്പോൾ സംരക്ഷിച്ച ഉത്തരങ്ങളുടെ ആക്കെയിൽ നിന്ന് ഉത്തരിക്കുന്നു. നിങ്ങളുടെ ചോദ്യം അതിൽ ഇല്ല.',

  'ask.browseTitle': 'ഇവിടെയുള്ള ലേഖകൾ കാണുക',

  'health.heading': 'നിങ്ങളുടെ പ്രായം പറയൂ',

  'health.intro': 'പ്രായം അനുസരിച്ച് പതിററാം ചോദിക്കുന്ന ചോദ്യങ്ങൾ ഇവിടെ കാണും. ഏതെങ്കിലും ഒരു ബട്ടൺ അമർത്തൂ — ചോദ്യം താഴെ പൂരിപ്പിക്കും, ശേഷം ചോദിക്കൂ.',

  'health.ageLabel': 'പ്രായം (വർഷം)',

  'health.years': 'വർഷം',

  'health.bandsLabel': 'പ്രായം അനുസരിച്ച് തിരഞ്ഞെടുക്കുക',

  'health.notAdviceStrong': 'ഇത് വൈദ്യ ഉപദേശമല്ല.',

  'health.notAdvice': 'ഏതെങ്കിലും മരുന്ന് തുടങ്ങാതേ നിർത്താതേ — ആദ്യം ഡോക്ടറെ കാണുക.',

  'health.emergencyStrong': 'അടിയന്തരത്തിൽ വിളിക്കുക:',

  'health.emergencyCall': '(അടിയന്തരം)',

  'health.emergencyAmbulance': '(ആംബുലൻസ്)',

  'health.emergencyWomen': '(വനിതാ സഹായം)',

  'health.privacy': 'പേരോ വിലാസമോ എഴുതേണ്ടതില്ല.',

  'health.band.infant.label': '0 – 2 വർഷം',

  'health.band.child.label': '3 – 12 വർഷം',

  'health.band.teen.label': '13 – 17 വർഷം',

  'health.band.young.label': '18 – 30 വർഷം',

  'health.band.middle.label': '31 – 45 വർഷം',

  'health.band.later.label': '46 – 60 വർഷം',

  'health.band.senior.label': '61 – 75 വർഷം',

  'health.band.elder.label': '76 – 100 വർഷം',

  /* ---- save / download ---- */

  'download.pdf': 'PDF ആയി സംരക്ഷിക്കുക',
  'download.text': 'ടെക്സ്റ്റായി സംരക്ഷിക്കുക',
  'download.printNow': 'അച്ചടിക്കുക',
  'download.preparing': 'തയ്യാറാകുന്നു',
  'download.blocked': 'പുതിയ ടാബ് തുറക്കാതിരുന്നു. ബ്രൗസർ പോപ്പ്-അപ്പ് തടയുന്നു — അനുവദിക്കുക.',

  /* ---- attach a document ---- */

  'attach.button': 'നിങ്ങളുടെ രേഖ അല്ലെങ്കിൽ ഫോട്ടോ ചേർക്കുക',
  'attach.formats': 'PDF, ഫോട്ടോ (JPG/PNG) അല്ലെങ്കിൽ ടെക്സ്റ്റ് ഫൈൽ — 12 MB വരെ',
  'attach.reading': 'വായിക്കുന്നു…',
  'attach.attached': 'ചേർത്തു',
  'attach.remove': 'നീക്കുക',
  'attach.tooBigPdf': 'ഈ PDF 12 MB-ൽ കൂടുതലാണ്. ചെറിയ ഫൈൽ തിരഞ്ഞെടുക്കുക.',
  'attach.tooBigImage': 'ഈ ഫോട്ടോ 3 MB-ൽ കൂടുതലാണ്. ചെറിയ ഫോട്ടോ തിരഞ്ഞെടുക്കുക.',
  'attach.scannedPdf': 'ഈ PDF ഒരു സ്കാൻ ആണ് — അതിൽ വെറും ചിത്രമേ ഉണ്ട്, വായിക്കാൻ കഴിയില്ല. അതിന്റെ ഫോട്ടോ അയയ്ക്കുക.',
  'attach.pdfFailed': 'ഈ PDF വായിക്കാത്തു.',
  'attach.imageFailed': 'ഈ ഫോട്ടോ ലോഡ് ആയില്ല.',
  'attach.wrongType': 'ഈ തരം ഫൈൽ പ്രവർത്തിക്കില്ല. PDF, ഫോട്ടോ അല്ലെങ്കിൽ ടെക്സ്റ്റ് ഫൈൽ അയയ്ക്കുക.',
  'attach.hint': 'നിങ്ങളുടെ രേഖ ഇവിടെ ചേർത്ത് ചോദിക്കുക — ഉത്തരം ആ രേഖയെക്കുറിച്ചാണ് വരുക.',
  'ask.sendWithFile': 'ഇതിന് ഉത്തരം',

  /* ---- free library ---- */

  'lib.title': 'സൗജന്യ ഗ്രന്ഥാലയം',
  'lib.intro': 'പാഠപുസ്തകങ്ങൾ, പുസ്തകങ്ങൾ, ചിത്രങ്ങൾ, ഓഡിയോ — എല്ലാം സൗജന്യവും നിയമപരിശോധിതവും.',
  'lib.legalTitle': 'പകർപ്പാട് പ്രശ്നമില്ല.',
  'lib.legal': 'ഇവിടെ നൽകിയവ എല്ലാം പൂർണ്ണമായും സൗജന്യമാണ്, നിങ്ങൾ അത് മുകളിലേക്ക് പങ്കിടാം. ഇതുവരെ പകർപ്പാടിൽ നിൽക്കുന്ന പുസ്തകം ഇവിടെ ഇല്ല — അത് പകർത്തുന്നതിന് അനുമതിയില്ല, അത് നേരിട്ട് പറയുന്നതാണ് ശരി.',
  'ask.signInTitle': 'ആദ്യം ലോഗിൻ ചെയ്യുക',
  'ask.signInBody': 'ചോദ്യങ്ങൾ ചോദിക്കാൻ ഒരു അക്കൗണ്ട് ഉണ്ടാക്കുക. ഒരു മിനിറ്റിൽ താഴെ, ശേഷം നിങ്ങൾ ചോദ്യങ്ങൾ ചോദിക്കാം.',
  'ask.signInCta': 'അക്കൗണ്ട് ഉണ്ടാക്കുക അല്ലെങ്കിൽ സൈൻ ഇൻ ചെയ്യുക',
  'ask.signInFirst': 'ആദ്യം ലോഗിൻ ചെയ്യുക, ശേഷം ചോദ്യം ചോദിക്കുക.',
  'ask.signInOr': 'ഇപ്പോൾ അക്കൗണ്ട് ഉണ്ടാക്കാമോ? ഇവ അക്കൗണ്ടില്ലാതെയും പ്രവർത്തിക്കും:',
  'account.title': 'എന്റെ അക്കൗണ്ട്',
  'account.intro': 'നിങ്ങളുടെ പേരും പാസ്‌വേഡും ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക.',
  'account.signIn': 'സൈൻ ഇൻ ചെയ്യുക',
  'account.register': 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
  'account.signInNote': 'മുമ്പ് ഉപയോഗിച്ച പേരും പാസ്‌വേഡും ഉപയോഗിക്കുക.',
  'account.registerNote': 'ചോദ്യങ്ങൾ ചോദിക്കാൻ അക്കൗണ്ട് ആവശ്യമില്ല. നിങ്ങളുടെ ഭാഷയും ഉത്തരങ്ങളും സ്മരിക്കാൻ മാത്രം.',
  'account.handle': 'നിങ്ങളുടെ പേര്',
  'account.handlePlaceholder': 'ഉദാ. sita.ji',
  'account.password': 'പാസ്‌വേഡ്',
  'account.passwordHint': 'കുറഞ്ഞത് ആറ് അക്ഷരങ്ങൾ.',
  'account.phone': 'ഫോൺ നമ്പർ',
  'account.optional': 'വേണ്ടമില്ല',
  'account.phoneHint': 'വേണമെങ്കിൽ നൽകുക. ഇല്ലാതെയും അക്കൗണ്ട് ഉണ്ടാകും.',
  'account.create': 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
  'account.logout': 'പുറത്തുകടക്കുക',
  'account.open': 'അക്കൗണ്ട് തുറക്കുക',
  'account.signedInAs': 'നിങ്ങൾ സൈൻ ഇൻ ചെയ്തിരിക്കുന്നു',
  'account.signedOut': 'സൈൻ ഇൻ ചെയ്തിട്ടില്ല',
  'account.signedOutBody': 'ഈ ബ്രൗസറിൽ ഒരു അക്കൗണ്ടും തുറന്നിട്ടില്ല.',
  'account.saved': 'സംരക്ഷിത ഉത്തരങ്ങൾ',
  'account.savedEmpty': 'ഇതുവരെ ഒന്നും സംരക്ഷിച്ചിട്ടില്ല. ഉത്തരത്തിൽ \'സംരക്ഷിക്കുക\' അമർത്തുക.',
  'account.savedUnavailable': 'സംരക്ഷിത ഉത്തരങ്ങൾ ഇപ്പോൾ കാണിച്ചുതരിക്കില്ല. ബാക്കിയുള്ളവ പ്രവർത്തിക്കുന്നു.',
  'account.wait': 'കാത്തിരിക്കുക…',
  'account.privacyTitle': 'നിങ്ങളുടെ വിവരങ്ങൾ',
  'account.privacyBody': 'അക്കൗണ്ടിൽ നിങ്ങളുടെ പേരും പാസ്‌വേഡും ഭാഷയും മാത്രമാണ്. നിങ്ങൾ എന്ത് ചോദിച്ചു എന്ന് രേഖപ്പെടുത്തില്ല. നിങ്ങളുടെ ചോദ്യങ്ങൾ ആരെയും അയയ്ക്കരുന്നില്ല.',
  'account.errWrong': 'പേരോ പാസ്‌വേഡോ തെറ്റാണ്.',
  'account.errTaken': 'ആ പേര് എടുത്തിരിക്കുന്നു. മറ്റൊരു പേര് തിരഞ്ഞെടുക്കുക.',
  'account.errBad': 'ദയവേടി ശരിയായി പൂരിപ്പിക്കുക.',
  'account.errWait': 'വളരെ ശ്രമങ്ങൾ. കുറച്ച് സമയത്തിനു വീണ്ടും ശ്രമിക്കുക.',
  'account.errTryLater': 'ഇപ്പോൾ സാധ്യമായില്ല. കുറച്ച് സമയം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.',
  'lib.licence.ccBy': 'നിങ്ങൾക്ക് പകർത്തിയെടുക്കാം, പങ്കിടാം, അച്ചടിക്കാം — ഉറവിന്റെ പേര് പറയണം.',
  'lib.licence.ccBySa': 'പകർത്തിയെടുക്കാം, അച്ചടിക്കാം. വരുത്തിയ മാറ്റങ്ങളും തുറന്ന് പങ്കിടണം.',
  'lib.licence.ccZero': 'പൂർണ്ണമായി സൗജന്യം. ഉറവും പറയണമെന്നില്ല.',
  'lib.licence.pd': 'ഇതിന് കോപ്പിറൈറ്റ് ആരുടെയുമില്ല — ഇഷ്ടമുന്നതുകൊണ്ട് പകർത്താം.',
  'lib.licence.govtIndia': 'ഇന്ത്യൻ സർക്കാർ വെബ്സൈറ്റിൽ. വായന്നുവയും അച്ചടിക്കുന്നും രണ്ടും സൗജന്യം.',
  'lib.licence.creativeCommons': 'ഓരോ ഫയലിനും സ്വന്തം ലൈസൻസ് ഉണ്ട് — ഫയൽ നോക്കുക.',
  'lib.licence.freeToRead': 'വായന്നുവുന്നത് സൗജന്യം. മറ്റൊരാൾക്ക് പങ്കിടുന്നതും അതേ നിബന്ധനകളിൽ.',
  'lib.openBadge': 'തുറന്ന',
  'lib.openBadgeNote': 'പകർത്താം',
  'lib.freeBadge': 'സൗജന്യ',
  'lib.freeBadgeNote': 'വായിക്കാം, പകർത്താൻ പാടില്ല',
  'lib.govt': 'സർക്കാർ',
  'lib.noSignup': 'അക്കൗണ്ട് വേണ്ട',
  'lib.open': 'ഇവിടെ തുറക്കുക',
  'lib.group.padhai': 'പാഠ പുസ്തകങ്ങൾ',
  'lib.group.padhai.note': 'സ്കൂൾ, കോളേജ്, സർക്കാർ വിദ്യാഭ്യാസ സാമഗ്രികൾ',
  'lib.group.kitab': 'പുസ്തകങ്ങൾ',
  'lib.group.kitab.note': 'പകർപ്പാടില്ലാത്തവ അല്ലെങ്കിൽ പകർത്താൻ അനുമതിയുള്ളവ',
  'lib.group.tasveer': 'ചിത്രങ്ങൾ',
  'lib.group.tasveer.note': 'മാപ്പുകൾ, ഫോട്ടോ — എല്ലാം',
  'lib.group.audio': 'കേട്ടതിന്',
  'lib.group.audio.note': 'പുസ്തകങ്ങൾ ഓഡിയോയായി, ചെറിയ അക്ഷരം വായിക്കാത്തവർക്ക്',
  'lib.warnTitle': 'എല്ലാ പുസ്തകവും ഇവിടെയില്ല',
  'lib.warn': 'ചില പുസ്തകങ്ങൾ ഇതുവരെ പകർപ്പാടിൽ ഉള്ളതിനാൽ നിയമപ്രകാരം സൗജന്യമായി നൽകാൻ കഴിയില്ല. അവ മനഃപൂർവം കാണിച്ചിട്ടില്ല. പുസ്തകം വേണമെങ്കിൽ താഴെ ചോദിക്കൂ — പറയാവുന്നത് പറയപ്പെടും.',
  'lib.askInstead': 'ചോദിക്കൂ',
  'nav.library': 'ഗ്രന്ഥാലയം',

  'help.title': 'നിങ്ങളുടെ പ്രശ്നം എഴുതുക',

  'help.intro': 'താഴെ എഴുതുകയോ പറയുകയോ ചെയ്യുക. അറിയില്ലെങ്കിൽ മനസ്സിൽ വരുന്നത് എഴുതിവയ്ക്കുക — ഇതാണ് ഏറ്റവും പ്രധാനം.',

  'help.howTitle': 'ഈ സേവനം എങ്ങനെ പ്രവർത്തിക്കുന്നു',

  'help.howBody': 'ഓരോ ചോദ്യവും രേഖപ്പെടുത്തുകയും അതിന്റെ ഉത്തരം ഉടൻ ലഭിക്കുന്നു. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും എവിടെയും എടുക്കപ്പെട്ടില്ല. എല്ലാം സൗജന്യമാണ്.',

  'help.suggested': 'പ്രത്യേക ചോദ്യങ്ങൾ',

  'help.q1.label': 'വൈദ്യുത് പോയി, എന്ത് ചെയ്യണം?',

  'help.q1.question': 'വീട്ടിൽ വൈദ്യുത് പോയി. എന്ത് ചെയ്യണം, മൊബൈൽ ഫോൺ എങ്ങനെ ചാർജ്ജ് ചെയ്യണം?',

  'help.q2.label': 'കുട്ടിയുടെ പഠനത്തിൽ ദുർബലത',

  'help.q2.question': 'എന്റെ മകന്റെ പഠനത്തിൽ വളരെ ദുർബലതയുണ്ട്. വീട്ടിൽ എങ്ങനെ മാറ്റിയെടുക്കണം?',

  'help.q3.label': 'വൃദ്ധരുടെ ചികിത്സ',

  'help.q3.question': 'എന്റെ അച്ചിന്റെ പ്രായം വളരെ കൂടുതലാണ്, അവർക്ക് ചികിത്സ എങ്ങനെ നൽകണം?',

  'help.q4.label': 'വീട്ടിൽ തീ പൊത്തിട്ടാൽ',

  'help.q4.question': 'രാത്രി വീട്ടിൽ തീ പൊത്തിട്ടാൽ ആദ്യം എന്ത് ചെയ്യണം?',

  'home.stepLabel': 'ഘട്ടം',

  'home.step1Title': 'നിങ്ങളുടെ കാര്യം എഴുതുകയോ പറയുകയോ ചെയ്യുക',

  'home.step1Body': 'മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക, അല്ലെങ്കിൽ മൈക്രോൺ അമർത്തി പറയുക. പ്രത്യേകം ഒന്നും ചെയ്യേണ്ടതില്ല — മനസ്സിലുള്ളത് എഴുതിവയ്ക്കുക.',

  'home.step2Title': 'ഉടൻ ഉത്തരം ലഭിക്കും',

  'home.step2Body': 'ഓരോ ചോദ്യവും രേഖപ്പെടുത്തുകയും അതിന്റെ ഉത്തരം ഉടന്ന് ലഭിക്കുന്നു. വലിയ ചോദ്യത്തിന് മുമ്പ് ചെറിയ ചോദ്യത്തിൽ തുടങ്ങുക.',

  'home.step3Title': 'പണമില്ല, സ്വകാര്യ വിവരമില്ല',

  'home.step3Body': 'ഈ സേവനം പൂർണ്ണമായും സൗജന്യമാണ്. നിങ്ങളുടെ പേരോ വിലാസമോ ഫോൺ നമ്പറോ ചോദിക്കുന്നില്ല, പരസ്യവുമില്ല.',

  'home.memorialEyebrow': 'ഈ സൈറ്റ് ആരക്കുവേണ്ടി',
  'home.memorialLine': 'ജീവിതം മുഴുവൻ സമൂഹത്തിനായി പോരാടിയ ആൾക്ക്, അവർക്ക് അവരുടെ വിഹിതം ഒടുകാലത്തിലും ലഭിച്ചില്ല.',
  'home.memorialMore': 'അവരുടെ മുഴുവൻ കഥ വായിക്കൂ',
  'home.kundaliTitle': 'ജനന ഗണ്ഠ',
  'home.kundaliNote': 'പൂർണ്ണ കുണ്ഡളി — ഒൻപത്ത് ഗ്രഹങ്ങൾ, വിമശോത്തരി ദശ, ഫലാദേശം, യോഗം, ഷോഡശവർഗം, കെപി, ലാൽ കിതാബ്, അങ്ക ജ്യോതിഷം. എല്ലാം നിങ്ങളുടെ ഫോണിൽ തന്നെ കണക്കാക്കും.',
  'home.chooseTopicNote': 'താഴെയുള്ള വിഷയത്തിൽ അമർത്തുക. ഓരോ സ്ഥലത്തും എളുപ്പമായ ഭാഷയിൽ വിവരങ്ങൾ നൽകിയിട്ടുണ്ട്.',

  'home.categoryEmpty': 'ഈ വിഷയത്തിൽ ഇതുവരെ ഒന്നും എഴുതിയിട്ടില്ല.',

  'home.soundIntro': 'ഫീസില്ല, പരസ്താരമില്ല. മനസ്സ് ശാന്തമാക്കാൻ മാത്രം.',
  'home.emergencyTitle': 'ഉടർന്നടെ സഹായം വേണോ?',
  'home.emergencyNote': 'ഇവയെ ആദ്യം വായിക്കൂ. ബാക്കിയുള്ളവ സമയത്തിനു വായിച്ചോണം.',

  'home.dedication1': 'സ്മരണയിൽ — പൂർണ്ണമായും സൗജന്യമായ സേവനം.',

  'home.dedication2': 'നിങ്ങളുടെ പ്രശ്നം എഴുതുകയോ പറയുകയോ ചെയ്യുക.',

  'ref.title': 'ഈ സേവനം എന്താണ്, ആരുക്കാണ്',

  'ref.intro': 'ഈ സേവനം ശ്രീമതി VARSHA -യുടെ സ്മരണദിൽ ഉണ്ടാക്കിയതാണ്. ഇത് എന്ത് ചെയ്യുന്നു, ഇതിൽ എന്തുണ്ട്, ഇതിന്റെ പരിധികൾ എന്ത് എന്നിവ ലളിതമായ ഭാഷയിൽ പറഞ്ഞിട്ടുണ്ട്. എല്ലാം പൂർണ്ണമായും സൗജന്യമാണ് — പണം എടുക്കുന്നില്ല, വിളംപരം കാണിക്കുന്നില്ല, സ്വകാര്യ വിവരങ്ങൾ ചോദിക്കുന്നില്ല.',

  'ref.whatTitle': 'ഇതിൽ എന്തുണ്ട്',

  'ref.what1': 'വീട്ടിൽ തീ, വൈദ്യുത് പോകുന്നു, കുട്ടിയുടെ പഠനത്തിൽ ദുർബലത, മാതാപിതാക്കളുടെ പരിചരണം — ഇത്തരം സാധാരണ പ്രശ്നങ്ങൾക്ക് എളുപ്പമായ പരിഹാരങ്ങൾ, ലളിതമായ ഭാഷയിൽ.',

  'ref.what2': 'ചോദ്യം പറഞ്ഞ് ചോദിക്കാനുള്ള സൗകര്യം. പറയാകാദെങ്കിൽ എഴുതൂ — രണ്ടിനും ഉത്തരം ഒരിട്ടാണ്.',

  'ref.what3': 'ഓരോ ചോദ്യവും രേഖപ്പെടുത്തുകയാണ്, അതിനാൽ മറ്റുള്ളവർക്ക് കുഴപ്പം വരുന്നവ നിങ്ങളുടെ മുമ്പ് ചോദിച്ചിട്ടേ ഉണ്ടായിരിക്കും, അതിന്റെ ഉത്തരം ലഭിക്കും.',

  'ref.what4': 'വിളംപരമില്ല, ആവശ്യമില്ലാത്ത വിവരങ്ങൾ ഇല്ല, സ്വകാര്യ വിവരങ്ങൾ ചോദിക്കുന്നില്ല. എല്ലാം സൗജന്യം.',

  'ref.statsArticles': 'ലേഖകൾ എഴുതിയിട്ടുണ്ട്',

  'ref.statsCategories': 'വിഷയങ്ങൾ ലഭ്യമാണ്',

  'ref.statsQuestions': 'ചോദ്യങ്ങൾ ചോദിച്ചിട്ടുണ്ട്',

  'ref.adminTitle': 'നിരീക്ഷകർ എന്ത് ചെയ്യാം',

  'ref.adminBody': 'നിങ്ങൾ അയച്ച ലേഖകൾ നിരീക്ഷകർ കാണാം, അവർക്ക് മറുപടി എഴുതാം. നിങ്ങളുടെ അനുമതിയില്ലാതെ അവർ ഒരു ലേഖവും മാറ്റോ ഒഴിസോ ചെയ്യാവില്ല, നിങ്ങളുടെ വിവരങ്ങൾ ആരുടെയും വിൽക്കാവില്ല.',

  'ref.dataTitle': 'നിങ്ങളെക്കുറിച്ച് ഞങ്ങൾ എന്ത് സൂക്ഷിക്കുന്നു',

  'ref.dataBody': 'നിങ്ങൾ ചോദിച്ച ചോദ്യം, അതിന്റെ സാരാംശം, ചോദിച്ച സമയം മാത്രം — അതേ ഉത്തരം പദേ പദേ നൽകാത്തിരിക്കാൻ. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും തിരിച്ചറിയുന്ന വിവരവുമില്ല. സൈറ്റിൽ വിളംപരമോ ട്രാക്കിംഗ് സ്ക്രിപ്റ്റോ ഇല്ല.',

  'ref.helplineTitle': 'അടിയന്തര സഹായത്തിന് ഈ നമ്പറുകൾ സൂക്ഷിക്കൂ',

  'ref.helpline1': 'വലിയ അപകടം ഉണ്ടെങ്കിൽ — തീ, വൈദ്യുത് ആഘാതം, വീഴൽ, അമിതമായ രക്തസ്രാവം — 112 ലേക്ക് വിളിക്കൂ.',

  'ref.helpline2': 'ആരെങ്കിലും രോഗിയോ മുറിവുള്ളവരോ ആണെങ്കിലോ, പോകാൻ വാഹനമില്ലെങ്കിലോ, 108 ലേക്ക് ആംബുലൻസ് വിളിക്കൂ.',

  'ref.helpline3': 'സ്ത്രീയുമായി ഏതെങ്കിലും മോശംകാര്യം സംഭവിച്ചിട്ടെങ്കിലോ, അല്ലെങ്കിൽ ഒരു സ്ത്രീയെ എവിടെങ്കിലും ബുദ്ധിമുട്ടിക്കുന്നുണ്ടെങ്കിലോ, 181 ലേക്ക് വിളിക്കൂ. ഇത് സൗജന്യമാണ്.',

  'ref.helpline4': 'കുട്ടിയോ വൃദ്ധനോ പോറ് അന്യായം ഉണ്ടായെങ്കിൽ, 1098 ലേക്ക് പരാതി നൽകാം.',

  'ref.helpline5': 'മാനസിക സമ്മർദം വളരെ ഉയർന്നാണെങ്കിലോ, ജീവിക്കണമെന്ന തോന്നാത്താണെങ്കിലോ, 14416 ലേക്ക് സംസാരിക്കാം. സംസാരിക്കാൻ മാത്രം.',

  'ref.ownerNote': 'ഈ സേവനം ഏതെങ്കിലും കമ്പനിയുടെയോ സർക്കാരിന്റെയോ അല്ല, ഒരു വ്യക്തിയുടെ സ്മരണത്തിൽ നടക്കുന്നതാണ്. അതിനാൽ ഇവിടെ വിളംപരമില്ല, അംഗത്വമില്ല, പണം എടുക്കുന്നില്ല.',

  'support.title': 'ഈ സേവനം സൗജന്യമാണ്',

  'support.intro': 'ഈ സേവനം ആരുടെയും പണം വാങ്ങുന്നില്ല. പക്ഷേ അത് നടക്കുന്നു — അതിനാൽ ചില വഴികളുണ്ട്, അവയിൽ നിങ്ങൾക്ക് സഹായിക്കാം. ഏറ്റവും എളുപ്പമുള്ള വഴിയാണ് ഏറ്റവും ഉപയോഗപ്പെടുന്നത്.',

  'support.contactTitle': 'എന്തോ പറയണോ?',

  'support.contactBody': 'ഏത് കാര്യവും ഇവിടെ എഴുതാം — തെറ്റ് ഉണ്ടായാലും, കൂടുതൽ കിട്ടിയാലും, അല്ലെങ്കിൽ ഏതെങ്കിലും ചോദ്യമുണ്ടായാലും. എഴുതാൻ എളുപ്പമായി തോന്നുന്നത് അത്രയേറെ എഴുതൂ.',

  'support.faqTitle': 'പതിററും ചോദിക്കുന്ന കുറച്ച് കാര്യങ്ങൾ',

  'support.faqBody': 'ശരിക്കും സൗജന്യമാണോ? അതെ. നിങ്ങളുടെ പേര് എടുക്കുന്നുണ്ടോ? ഇല്ല, പേര് നൽകേണ്ടതില്ല. വിളംപരം വരുന്നുണ്ടോ? ഇല്ല. ഫോൺ നമ്പറോ വിലാസമോ ആസ്കങ്കുന്നുണ്ടോ? ഇല്ല. ഏതെങ്കിലും ആപ്പ് ഡൗൺലോഡ് ചെയ്യണോ? ഇല്ല, ബ്രൗസറിൽ തന്നെ തുറക്കുന്നു.',

  'support.waysTitle': 'നിങ്ങൾ എങ്ങനെ സഹായിക്കാം',

  'support.way1Title': 'നിങ്ങളുടെ അനുഭവം എഴുതുക',

  'support.way1Body': 'ഈ സൈറ്റിൽ നിങ്ങൾക്ക് ഏതെങ്കിലും നല്ലതായി തോന്നിയിട്ടുണ്ടെങ്കിൽ — അല്ലെങ്കിൽ നിങ്ങളെ കുഴപ്പത്തിലാക്കിയ ഏതെങ്കിലും കിട്ടിയിട്ടുണ്ടെങ്കിൽ — അപ്പോൾ അഭിപ്രായ പേജിൽ എഴുതൂ. നിങ്ങളുടെ പേര് എടുക്കേണ്ടതില്ല.',

  'support.way2Title': 'നിങ്ങളുടെ നഗരത്തെപ്പറ്റി പറയൂ',

  'support.way2Body': 'നിങ്ങൾ താമസിക്കുന്ന സ്ഥലത്തിന്റെ ഭാഷ, പാരമ്പരാവകാശം, ബുദ്ധിമുട്ടുകൾ വ്യത്യസ്തമാണ്. നിങ്ങളുടെ ഇവിടെ ഏതെങ്കിലും ഇവിടെ ഇല്ലെങ്കിൽ പറയൂ — ചേർക്കാവുന്നത് ചേർക്കും.',

  'support.way3Title': 'നിങ്ങളുടെ അനുഭവം മറ്റൊരാള്ക്ക് പറയൂ',

  'support.way3Body': 'ഇവിടെ എഴുതിയിട്ടുള്ളത് പലർക്കും ഉപയോഗപ്പെട്ടാകാം, അവർക്ക് അറിയാമെങ്കിൽ. ശരിക്കും സഹായിക്കുന്ന വ്യക്തിയോട് പറയൂ.',

  'support.way4Title': 'ഇവിടെ വന്നു നോക്കൂ',

  'support.way4Body': 'നിങ്ങൾക്ക് സമയമുണ്ടെങ്കിൽ, ഈ സൈറ്റ് ശരിയായി പ്രവർത്തിക്കുകന്നുണ്ടോ എന്ന് നിങ്ങൾതന്നെ വന്നു നോക്കൂ. എന്തെങ്കിലും കുഴപ്പം ഉണ്ടെങ്കിൽ പറയൂ — പൂർണ്ണമായും സൗജന്യമായി തിരുത്തിക്കും.',

  'reviews.pageTitle': 'നിങ്ങളുടെ അഭിപ്രായം',

  'reviews.pageIntro': 'ഇവിടെ ആളൾ എഴുതിയതാണ് എഴുതിയിട്ടുള്ളത്. ഒരു അഭിപ്രായവും മറയ്ക്കപ്പെടുന്നില്ല, എഴുതിയതും അവിടെത്തന്ന് കാണുന്നു — ഒരിക്കൽ നോട്ടിയ ശേഷം പ്രസിധിപ്പെടുത്തും.',

  'reviews.intro': 'ഈ സേവനം നിങ്ങൾക്ക് ഉപയോഗപ്പെട്ടോ? നിങ്ങളുടെ വാക്കുകൾ എഴുതൂ — നിങ്ങളുടെ പേര് എടുക്കേണ്ടതില്ല.',

  'reviews.write': 'നിങ്ങളുടെ അഭിപ്രായം എഴുതുക',

  'reviews.starsLabel': '5 ൽ {value} നക്ഷത്രങ്ങൾ',

  'reviews.summaryTitle': 'പൊതുവായ അഭിപ്രായം',

  'reviews.summaryLine': 'ആളൾ ശരാശരി {rating} ൽ 5 ൽ {count} നക്ഷത്രങ്ങൾ നൽകി.',

  'reviews.count': 'അഭിപ്രായങ്ങൾ',

  'reviews.name': 'നിങ്ങളുടെ പേര് (ആവശ്യമില്ല)',

  'reviews.city': 'നിങ്ങളുടെ നഗരം (ആവശ്യമില്ല)',

  'reviews.comment': 'നിങ്ങളുടെ വാക്കുകൾ',

  'reviews.placeholder': 'മനസ്സിൽ വരുന്നത് എഴുതൂ — എന്തെങ്കിലും തിരുത്തണമില്ല.',

  'reviews.keepLabel': 'ചീതമായാലും, നല്ലയായാലും — രണ്ടും എഴുതൂ',

  'reviews.fieldTooShort': 'കുറഞ്ഞത് 10 അക്ഷരങ്ങൾ എഴുതൂ.',

  'reviews.rateLimited': 'വളരെ വേഗത്തിൽ അയയ്ക്കുന്നു. കുറച്ച് നിൽക്കി വീണ്ടും ശ്രമിക്കൂ.',

  'reviews.sending': 'അയയ്ക്കുന്നു…',

  'reviews.moderated': 'നിങ്ങളുടെ അഭിപ്രായം പ്രസിധിപ്പെടുത്തുന്നതിന് മുമ്പ് ഒരിക്കൽ പരിശോധിക്കും.',

  'reviews.moderationNote': 'എല്ലാം ഒഴിവാക്കാതിരിക്കാൻ, പ്രസിധിപ്പെടുത്തുന്നതിന് മുമ്പ് ഓരോ അഭിപ്രായവും ഒരിക്കൽ പരിശോധിക്കും. അഭിയാളം, നമ്പർ, വ്യക്തിഗത കാര്യങ്ങൾ നീക്കം ചെയ്യും — ബാക്കിയുള്ളതെല്ലാം അങ്ങനെയും പ്രസിധിപ്പെടുത്തും.',

  'reviews.replyLabel': 'ഇതിൽ എഴുതിയത്',

  'reviews.ownerReply': 'മറുപടി',

  'reviews.empty': 'ഇതുവരെ ഒരു അഭിപ്രായവുമില്ല. ആദ്യത്തേത് നിങ്ങൾ എഴുതൂ.',

  'reviews.anonymous': 'പേരില്ലാതെ',

  'reviews.toastSent': 'നന്ദി',

  'reviews.toastFailed': 'അഭിപ്രായം അയയ്ക്കാനായില്ല',

  'health.band.infant.note': 'കുഞ്ഞികൾ, ഇനിപ്പോഴും സ്വന്തം കാര്യം പറയാനാകില്ലാത്തവർ',

  'health.band.child.note': 'സംസാരിക്കാനാകുന്ന കുട്ടികൾ, പക്ഷേ ചോദിക്കാൻ ഭയപ്പെടുന്നവർ',

  'health.band.teen.note': 'കൗമാരക്കാർ, അവർക്ക് സാധാരണയായി കേൾക്കാൻ ആളില്ല',

  'health.band.young.note': 'ജോലി, പണം, ഉറക്ക് — മൂന്നിന്റെയും ഒന്നിച്ചുള്ള ഭാരം',

  'health.band.middle.note': 'വീട്, കുട്ടികൾ, സ്വന്തം ആരോഗ്യം — എല്ലാവരുടെയും ഉത്തരാധികാരിതതം ഒരുപാടി',

  'health.band.later.note': 'ശരീരത്തിന്റെ പ്രായവും അതിന്റെ പരിചരണവും — രണ്ടും ഒരുപാടി',

  'health.band.senior.note': 'മരുന്ന്, സന്തുലനം, ഒറ്റയാകല — മൂന്നും ഒരുപാടി',

  'health.band.elder.note': 'ഓരോ മരുന്നിന്റെയും പരിശോധന ആവശ്യം, ഓരോ വീഴ്ചയും ഗുരുതം',

  'health.c.infant1': 'കടുത്ത പനി',

  'health.c.infant2': 'കഴിക്കാരില്ല',

  'health.c.infant3': 'ഛർദ്ദി വരുന്നു',

  'health.c.infant4': 'മലങ്ങളിക്കുന്നു',

  'health.c.child1': 'പഠനത്തിൽ താഴ്മായില്ല',

  'health.c.child2': 'സ്കൂളിൽ പോകാൻ മറക്കുന്നു',

  'health.c.child3': 'രാത്രി പനി',

  'health.c.child4': 'പല്ലുകൾ പൊട്ടുന്നു',

  'health.c.teen1': 'പഠനം സമ്മർദ്ദം',

  'health.c.teen2': 'ഉറക്കം വരുന്നില്ല',

  'health.c.teen3': 'മൊബൈൽ ശീലം',

  'health.c.teen4': 'കടുത്ത ദുഃഖം',

  'health.c.young1': 'ജോലിയുടെ സമ്മർദ്ദം',

  'health.c.young2': 'ഇരിയുമ്പോൾ വേദന',

  'health.c.young3': 'ഉറക്കം വരുന്നില്ല',

  'health.c.young4': 'പണം കുറവ്',

  'health.c.middle1': 'അരയിൽ വേദന',

  'health.c.middle2': 'ഉറക്കം ശരിയായി വരുന്നില്ല',

  'health.c.middle3': 'വീടിന്റെ സമ്മർദ്ദം',

  'health.c.middle4': 'വയറ്റിൽ വായു',

  'health.c.later1': 'പുറത്തിന് വേദന',

  'health.c.later2': 'മട്ടിൽ വേദന',

  'health.c.later3': 'രാത്രി കാലിൽ വലിച്ചുരുക്കൽ',

  'health.c.later4': 'രാവിലെ കാഠം',

  'health.c.senior1': 'നടക്കാൻ ബുദ്ധിമുട്ട്',

  'health.c.senior2': 'മരുന്നിന്റെ പരിശോധന',

  'health.c.senior3': 'രാത്രി മൂത്രം',

  'health.c.senior4': 'കേൾപ്പ് കുറവ്',

  'health.c.elder1': 'വീഴുമെന്ന് ഭയം',

  'health.c.elder2': 'ഓർമ്മപ്പതി ദുർബലം',

  'health.c.elder3': 'ദിവസംപ്രതി വേദനാ മരുന്ന്',

  'health.c.elder4': 'ഡോക്ടറെ എപ്പോൾ',

  'health.q.infant1': 'എന്റെ കുഞ്ഞിക്ക് പനി വന്നിരിക്കുന്നു, പാലു കൊടുക്കണോ?',

  'health.q.infant2': 'ചെറിയ കുഞ്ഞി കഴിക്കാരില്ല, എന്ത് ചെയ്യണം?',

  'health.q.infant3': 'കുഞ്ഞിന് ഛർദ്ദി വരുന്നു, എപ്പോൾ ഡോക്ടറെ കാണിക്കണം?',

  'health.q.infant4': 'കുഞ്ഞിക്ക് മലങ്ങളിക്കുന്നു, എന്ത് കൊടുക്കണം?',

  'health.q.child1': 'കുട്ടിയുടെ പഠനത്തിൽ മനസ്സിൽ താഴ്മായില്ല, എന്ത് ചെയ്യണം?',

  'health.q.child2': 'കുട്ടി എല്ലാ ദിവസവും സ്കൂളിൽ പോകാൻ മറക്കുന്നു, കാരണം എന്താകാം?',

  'health.q.child3': 'കുട്ടിക്ക് രാത്രി പനി വരുന്നു, എന്ത് ചെയ്യണം?',

  'health.q.child4': 'കുട്ടിയുടെ പല്ലുകൾ പൊട്ടുന്നു, പല്ലുകൾ എങ്ങനെ പരിചരിക്കണം?',

  'health.q.teen1': 'പഠനത്തിൽ വളരെ സമ്മർദ്ദമുണ്ട്, അതു എങ്ങനെ നേരിടണം?',

  'health.q.teen2': 'രാത്രി ഉറക്കം ശരിയായി വരുന്നില്ല, എന്ത് ചെയ്യണം?',

  'health.q.teen3': 'മൊബൈൽ ശീലമായി, വിടാൻ വഴി പറയൂ.',

  'health.q.teen4': 'കടുത്ത ദുഃഖം തോന്നുന്നു, ആരുമായി സംസാരിക്കണം?',

  'health.q.young1': 'ജോലിയുടെ സമ്മർദ്ദം വളരെ കൂടുതലാണ്, എങ്ങനെ കുറയ്ക്കണം?',

  'health.q.young2': 'ഇരിയുമ്പോൾ മുട്ടുത്തിന് വേദന, എന്ത് ചെയ്യണം?',

  'health.q.young3': 'രാത്രി ഉറക്കം വരുന്നില്ല, എന്ത് ചെയ്യണം?',

  'health.q.young4': 'പണം കുറവാണ്, ചെലവും കൂടുതല്, എന്ത് ചെയ്യണം?',

  'health.q.middle1': 'അരയിൽ വേദനയുണ്ട്, കാരണം എന്താകാം?',

  'health.q.middle2': 'ഉറക്കം നല്ലയായി വരുന്നില്ല, മെച്ചപ്പെടുക്കാന്‍ എന്ത് ചെയ്യണം?',

  'health.q.middle3': 'വീട്ടിൽ വളരെ സമ്മർദ്ദം, കുട്ടികളെ എങ്ങനെ പരിചരിക്കണം?',

  'health.q.middle4': 'ജോലിയിൽ വർഷങ്ങളായി വയറ്റിൽ വായു, എന്ത് ചെയ്യണം?',

  'health.q.later1': 'എന്റെ പ്രായം 54, പുറത്തിന് വേദന, എന്ത് ചെയ്യണം?',

  'health.q.later2': 'കയറുമ്പോൾ മട്ടിൽ വേദന, എന്തുകൊണ്ട്?',

  'health.q.later3': 'രാത്രി കാലിൽ വലിച്ചുരുക്കൽ, എന്ത് ചെയ്യണം?',

  'health.q.later4': 'രാവിലെ എഴുന്നേറ്റാൽ അരയ്ക്ക് കടുപ്പമുണ്ടാകുന്നു, കാരണം എന്താകാം?',

  'health.q.senior1': 'മട്ടിൽ വേദനയാൽ നടക്കാൻ ബുദ്ധിമുട്ട്, എന്ത് ചെയ്യണം?',

  'health.q.senior2': 'പലത് മരുന്നുകൾ ദിവസവും കഴിക്കണം — ഏത് ദുഷ്ടകരമാണെന്ന് എങ്ങനെ അറിയണം?',

  'health.q.senior3': 'രാത്രി വരിവരി മൂത്രം, എന്ത് ചെയ്യണം?',

  'health.q.senior4': 'കേൾപ്പ് കുറവാണ്, കേളാൻ ഏതെങ്കിലും ഉപായം പറയൂ.',

  'health.q.elder1': 'വീട്ടിൽ വീഴുമെന്ന് ഭയം, ഏത് സുരക്ഷാനിരക്ഷ വേണം?',

  'health.q.elder2': 'ഓർമ്മപ്പതി ദുർബലമാകുന്നു, എന്ത് ചെയ്യണം?',

  'health.q.elder3': 'ദിവസവും വേദനാ മരുന്ന് കഴിക്കണം — ഇതിന് ദോഷമുണ്ടോ?',

  'health.q.elder4': 'എപ്പോൾ ഡോക്ടറെ കാണണം?',

  'support.contactMessageLabel': 'നിങ്ങളുടെ വാക്കുകൾ',

  'support.contactPlaceholder': 'എഴുതണം എന്ന് വിശ്വാസമുള്ളത് എഴുതൂ — തെറ്റ് ഉണ്ടെങ്കിൽ, എന്തെങ്കിലും നല്ലത് കിട്ടിയെങ്കിൽ, അല്ലെങ്കിൽ ചോദ്യമുണ്ടെങ്കിൽ.',

  'support.contactHelp': 'കുറഞ്ഞത് 10 അക്ഷരങ്ങൾ. ഇത് നേരിട്ട് ഉടമയ്ക്ക് എത്തിച്ചേരും.',

  'support.contactSubmit': 'അയയ്ക്കൂ',

  'support.contactSending': 'അയയ്ക്കുന്നു…',

  'support.contactPrivacy': 'നിങ്ങളുടെ പേര് എഴുതേണ്ടതില്ല.',

  'support.contactSent': 'എത്തിച്ചേർന്നു',

  'support.contactSentBody': 'നിങ്ങളുടെ വാക്കുകൾ ഉടമയ്ക്ക് എത്തിച്ചേർന്നു.',

  'support.contactFailed': 'അയയ്ക്കാനായില്ല',

  'support.faq1Q': 'ഇത് ശരിക്കും സൗജന്യമാണോ?',

  'support.faq1A': 'അതെ. പണം എടുക്കുന്നില്ല, വിളംപരം കാണിക്കുന്നില്ല, അംഗത്വം ആനയ്ക്കുന്നില്ല. ഇത് ഒരാളുടെ പണത്തിൽ നടക്കുന്നു, കമ്പനിയുടെയോ സർക്കാർന്റെയോ അല്ല.',

  'support.faq2Q': 'എന്റെ പേരോ വിലാസമോ ഫോൺ നമ്പറോ എടുക്കുന്നുണ്ടോ?',

  'support.faq2A': 'ഇല്ല, എടുക്കുകയില്ല. ഈ സൈറ്റ് സ്വയം ഒരു തിരിച്ചറിയാപ്പെടുത്തിനും ഉംടുന്നില്ല — ലോഗിനില്ല, ട്രാക്കിംഗ് സ്ക്രിപ്റ്റില്ല. ചോദിക്കുന്നത് നിങ്ങളുടെ ചോദ്യം മാത്രമാണ്, അതും അത്ര സംഭവിക്കുന്നു.',

  'support.faq3Q': 'ഇത് ഡോക്ടറോ അറ്റോർണിയോ?',

  'support.faq3A': 'ഇല്ല. ഇത് മരുന്നിന്റെയോ നിയമത്തിന്റെയോ ഉപദേശം നൽകുന്നില്ല. കാര്യം ഗുരുതമാകുമ്പോൾ ഇത് ഡോക്ടറെയോ അധികാരിയെയോ കാണാൻ പറയും — അവരുടെ സ്ഥാനം ഇത് എടുക്കുന്നില്ല.',

  'support.faq4Q': 'ഓരോ ഉത്തരവും ശരിയാണോ?',

  'support.faq4A': 'എപ്പോഴും അല്ല. ഉത്തരം എഴുതുന്നത് ഒരു കമ്പ്യൂട്ടറാണ്, ഡോക്ടർ അല്ല — അതുകൊണ്ട് ഓരോ ഉത്തരത്തോടും ഇത് വൈദ്യ ഉപദേശമല്ല എന്ന് എഴുതിയിട്ടുണ്ട്. ഏതെങ്കിലും മരുന്ന് തുടങ്ങുകയോ നിർത്തുകയോ മുമ്പ് ഡോക്ടറുടെ ഉപദേശം എടുക്കുക.',

  'support.faq5Q': 'എനിക്ക് ഏതെങ്കിലും ആപ്പ് ഡൗൺലോഡ് ചെയ്യണോ?',

  'support.faq5A': 'ഇല്ല. ഇത് ബ്രൗസറിൽ തന്നെ തുറക്കും. ആപ്പ് ഇൻസ്റ്റാൾ ഇല്ല, അനുമതി ഇല്ല, അപ്ഡേറ്റ് ഇല്ല.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'വീട്ടുചികിത്സ',
  'remedy.title': 'ആയുർവേദ വീട്ടുചികിത്സ',
  'remedy.intro': 'ഏതു ബുദ്ധിമുട്ടായാലും — ചുമ, തലവേദന, സന്ധിവാതം, ചൊറിച്ചിൽ, പ്രമേഹം, നടുവേദന — താഴെ നിങ്ങളുടെ ബുദ്ധിമുട്ട് തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ വാക്കുകളിൽ ചോദിക്കുക. വീട്ടിലെ കഷായം, തിരുമ്മൽ, ഭക്ഷണം, ആയുർവേദ മാർഗങ്ങൾ പറയും.',
  'remedy.choose': 'നിങ്ങളുടെ ബുദ്ധിമുട്ട് തിരഞ്ഞെടുക്കുക',
  'remedy.emergencyStrong': 'ഇവ അടിയന്തരാവസ്ഥകളാണ്:',
  'remedy.emergency': 'പാമ്പുകടി, തേൾ കുത്ത്, നായയുടെ കടി — ഉടൻ ആശുപത്രിയിൽ പോകുക, ആദ്യം 112-ൽ വിളിക്കുക. വീട്ടുചികിത്സ വഴിയിൽ മാത്രം, ആശുപത്രിക്ക് പകരമല്ല.',
  'remedy.note': 'വീട്ടുചികിത്സയും ആയുർവേദ മാർഗങ്ങളും ബുദ്ധിമുട്ട് കുറയ്ക്കാൻ സഹായിക്കും; ഡോക്ടറുടെ പരിശോധനയ്ക്കും ചികിത്സയ്ക്കും പകരമല്ല. ഏതെങ്കിലും മരുന്ന് സ്വയം തുടങ്ങരുത്, നിർത്തരുത്.',
  'remedy.cough': 'ചുമ',
  'remedy.headache': 'തലവേദന',
  'remedy.joints': 'സന്ധിവാതം',
  'remedy.itching': 'ചൊറിച്ചിൽ',
  'remedy.snake': 'പാമ്പുകടി',
  'remedy.scorpion': 'തേൾ കുത്ത്',
  'remedy.dog': 'നായയുടെ കടി',
  'remedy.diabetes': 'പ്രമേഹം',
  'remedy.back': 'നടുവേദന',
  'remedy.walking': 'നടക്കാൻ ബുദ്ധിമുട്ട്',
  'home.remedyNote': 'കഷായം, തിരുമ്മൽ, ഭക്ഷണം, ആയുർവേദ മാർഗങ്ങൾ — ഓരോ ബുദ്ധിമുട്ടിനും, നിങ്ങളുടെ ഭാഷയിൽ.',
  'nav.aarti': 'ആരതിയും ഭജനവും',
  'aarti.title': 'ആരതിയും ഭജനവും — യഥാർത്ഥ ശബ്ദത്തിൽ',
  'aarti.intro': 'ഇവിടെ ആരതി, കീർത്തനം, ഭജനം കേൾക്കൂ — യഥാർത്ഥ ഗായകരുടെയും ക്ഷേത്രങ്ങളുടെയും ശബ്ദത്തിൽ. AI ശബ്ദം ഇല്ല.',
  'aarti.note': 'ആരതിയോ ഭജനമോ കമ്പ്യൂട്ടർ ശബ്ദത്തിൽ കേൾപ്പിക്കുന്നത് അതിന്റെ ചാലും ഭക്തിയും നഷ്ടപ്പെടുത്തും. അതിനാൽ ഇവിടെ എല്ലാം യഥാർത്ഥ റെക്കോർഡിംഗുകളാണ്.',
  'aarti.kindAarti': 'ആരതി',
  'aarti.kindKirtan': 'കീർത്തനം',
  'aarti.kindBhajan': 'ഭജനം',
  'aarti.credit': 'റെക്കോർഡിംഗ്:',
  'aarti.licence': 'ലൈസൻസ്:',
  'aarti.listenLink': 'യഥാർത്ഥ ശബ്ദത്തിൽ കേൾക്കൂ',
  'aarti.textChecked': 'ഇത് പരമ്പരാഗത പാഠമാണ്, യഥാർത്ഥ റെക്കോർഡിംഗിൽ പാടിയതുപോലെ.',
  'aarti.textPrinted': 'ഇത് പ്രസിദ്ധീകരിച്ച സമാഹാരങ്ങളുമായി ഒത്തുനോക്കി പരിശോധിച്ച പാരമ്പര്യ പാഠമാണ്.',
  'aarti.textNotStored': 'ഈ ഗ്രന്ഥത്തിന്റെ പൂർണ്ണ പാഠം ഇവിടെ സൂക്ഷിച്ചിട്ടില്ല — താഴെയുള്ള റെക്കോർഡിംഗിൽ പൂർണ്ണ പാഠമുണ്ട്.',
  'aarti.granthTitle': 'ഗ്രന്ഥങ്ങൾ, ചാലീസ, സ്തോത്രങ്ങൾ — യഥാർത്ഥ ശബ്ദത്തിൽ',
  'aarti.noRecording': 'ഈ ആരതിയുടെ യഥാർത്ഥ റെക്കോർഡിംഗ് ഇപ്പോൾ സൈറ്റിൽ ഇല്ല, അതിനാൽ ഞാൻ അത് പാടിക്കേൾപ്പിക്കാൻ കഴിയില്ല — എഐ ശബ്ദത്തിൽ ആരതി ഒരിക്കലും പാടുന്നില്ല.',
  'aarti.textOnlyTitle': 'കൂടുതൽ ആരതികൾ — പാഠവും യഥാർത്ഥ ശബ്ദവും',
  'aarti.fullText': 'പൂർണ്ണ പാഠം',
  'aarti.notChecked': 'ഈ ആരതിയുടെ പരിശോധിച്ച പാഠം ഇപ്പോൾ സൈറ്റിൽ ഇല്ല. പരിശോധിക്കാത്ത പാഠം നൽകുന്നില്ല, കാരണം പ്രാർത്ഥനയിൽ തെറ്റായ വാക്ക് വാക്കുകൾ ഇല്ലാതിരിക്കുന്നതിനേക്കാൾ മോശമാണ്.',
  'aarti.verifiedList': 'സൈറ്റിൽ ഈ ആരതികളുടെ പരിശോധിച്ച പാഠങ്ങളുണ്ട്:',

};

const PUNJABI: Record<string, string> = {
  'jgd.placeSearch': 'ਆਪਣੇ ਸ਼ਹਿਰ ਦਾ ਨਾਮ ਲਿਖੋ',
  'jgd.placeNoMatch': 'ਇਹ ਸ਼ਹਿਰ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ। ਨੇੜੇ ਦਾ ਸ਼ਹਿਰ ਚੁਣੋ।',

  'account.name': 'ਤੁਹਾਡਾ ਨਾਮ',
  'account.namePlaceholder': 'ਉਦਾ. ਸੀਤਾ ਦੇਵੀ',
  'account.nameHint': 'ਤੁਸੀਂ ਕੌਣ ਹੋ ਇਹ ਜਾਣਣ ਲਈ। ਕੋਈ ਵੀ ਨਾਮ ਚੱਲੇਗਾ, ਅਤੇ ਇਹ ਲੋੜੀਂਦਾ ਨਹੀਂ।',

  'nav.home': 'ਹੋਮ', 'home.metaTitle': 'ਮੁਫ਼ਤ ਹੱਲ, ਆਪਣੇ ਸੁਭਾਅ ਦੇ ਸ਼ਬਦਾਂ ਵਿੱਚ', 'nav.tribute': 'ਸਮਰਨ', 'nav.help': 'ਮਦਦ', 'nav.reference': 'ਜਾਣਕਾਰੀ',
  'lib.licence.ccZero.name': 'CC0 / ਪਬਲਿਕ ਡੋਮੇਨ',
  'lib.licence.pd.name': 'ਪਬਲਿਕ ਡੋਮੇਨ',
  'lib.licence.govtIndia.name': 'ਭਾਰਤ ਸਰਕਾਰ',
  'lib.licence.creativeCommons.name': 'ਕ੍ਰਿਏਟਿਵ ਕਾਮਨਜ਼ (ਮਿਸ਼ਰਤ)',
  'lib.licence.freeToRead.name': 'ਪੜ੍ਹਨ ਲਈ ਮੁਫ਼ਤ',
  'lib.entry.ncert.title': 'NCERT ਕਿਤਾਬਾਂ — ਜਮਾਤ 1 ਤੋਂ 12',
  'lib.entry.ncert.what': 'ਹਰ ਵਿਸ਼ੇ ਦੀਆਂ ਸਾਰੀਆਂ ਕਿਤਾਬਾਂ, ਹਰ ਜਮਾਤ ਲਈ. ਲਾਗਇਨ ਬਿਨਾਂ, ਸਿੱਧੀ PDF.',
  'lib.entry.ncert.langs': 'ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ ਅਤੇ 30 ਤੋਂ ਵੱਧ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ਡਿਜੀਟਲ ਪਾਠਬੁੱਕਾਂ',
  'lib.entry.pm-evidya.what': 'NCERT ਕਿਤਾਬਾਂ ਦਾ ਐਪ, ਵੱਡੇ ਅੱਖਰਾਂ ਵਿੱਚ ਪੜ੍ਹਿਆ ਜਾ ਸਕਦਾ ਹੈ. ਬੋਲ ਕੇ ਵੀ ਸੁਣਿਆ ਜਾ ਸਕਦਾ ਹੈ.',
  'lib.entry.pm-evidya.langs': 'ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ',
  'lib.entry.diksha.title': 'DIKSHA — ਅਧਿਆਪਕਾਂ ਅਤੇ ਬੱਚਿਆਂ ਲਈ',
  'lib.entry.diksha.what': 'ਪਾਠ, ਵੀਡੀਓ ਅਤੇ ਅਭਿਆਸ — ਜਮਾਤ 1 ਤੋਂ 12.',
  'lib.entry.diksha.langs': 'ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ',
  'lib.entry.khan-academy.title': 'Khan Academy — ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਗਣਿਤ ਅਤੇ ਸਾਇੰਸ',
  'lib.entry.khan-academy.what': 'ਹਰ ਜਮਾਤ ਤੱਕ ਵੀਡੀਓ ਪਾਠ, ਲਿਖਤੀ ਸਮੱਗਰੀ ਵੀ ਹੈ.',
  'lib.entry.openstax.title': 'OpenStax — ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਮੁਫ਼ਤ ਕਿਤਾਬਾਂ',
  'lib.entry.openstax.what': 'ਕਾਲਜ ਪੱਧਰ ਦੀਆਂ ਕਿਤਾਬਾਂ — ਗਣਿਤ, ਸਾਇੰਸ, ਮਨੁੱਖਵਿਆਂ. ਹਰ ਪੇਜ \'ਤੇ PDF.',
  'lib.entry.nios.title': 'NIOS — ਦੂਰਸਿੱਖਿਆ, ਮੁਫ਼ਤ ਸਮੱਗਰੀ',
  'lib.entry.nios.what': 'ਓਪਨ ਅਤੇ ਆਨਲਾਈਨ ਕੋਰਸਾਂ ਦੀਆਂ ਮੁਫ਼ਤ ਪੁਸਤਕਾਂ, ਦਾਖਲੇ ਤੋਂ ਬਿਨਾਂ.',
  'lib.entry.nios.langs': 'ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਹੋਰ',
  'lib.entry.ignou.title': 'IGNOU — ਉੱਚ ਪੜ੍ਹਾਈ ਲਈ ਮੁਫ਼ਤ ਕਿਤਾਬਾਂ',
  'lib.entry.ignou.what': 'ਦੂਰਸਿੱਖਿਆ ਦੀਆਂ ਕਿਤਾਬਾਂ, ਬਿਲਕੁਲ ਮੁਫ਼ਤ.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ਅੰਗਰੇਜ਼ੀ ਦੀਆਂ ਪੁਰਾਣੀਆਂ ਕਿਤਾਬਾਂ',
  'lib.entry.gutenberg.what': '70,000 ਤੋਂ ਵੱਧ ਕਿਤਾਬਾਂ, ਸਾਰੀਆਂ ਦਾ ਕਾਪੀਰਾਈਟ ਖਤਮ. ਮੁਫ਼ਤ ਈ-ਬੁੱਕ ਅਤੇ ਆਡੀਓ.',
  'lib.entry.pratham-books.title': 'Pratham Books — ਬੱਚਿਆਂ ਦੀਆਂ ਕਿਤਾਬਾਂ',
  'lib.entry.pratham-books.what': 'ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਬੱਚਿਆਂ ਦੀਆਂ ਕਿਤਾਬਾਂ, ਬਿਲਕੁਲ ਮੁਫ਼ਤ. ਜਮਾਤ 1 ਤੋਂ 5 ਲਈ.',
  'lib.entry.pratham-books.langs': 'ਹਿੰਦੀ, ਮਰਾਠੀ, ਬੰਗਾਲੀ, ਤਮਿਲ, ਤੇਲਗੂ ਅਤੇ ਹੋਰ',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — ਅਖਬਾਰ ਅਤੇ ਪੁਰਾਣੀਆਂ ਮੈਗਜ਼ੀਨਾਂ',
  'lib.entry.internet-archive-texts.what': 'ਲੱਖਾਂ ਪੁਰਾਣੀਆਂ ਕਿਤਾਬਾਂ, ਮੈਗਜ਼ੀਨਾਂ ਅਤੇ ਅਖਬਾਰ — ਮੁਫ਼ਤ.',
  'lib.entry.wikisource.title': 'Wikisource — ਮੁਫ਼ਤ ਜਨਤਕ ਪਾਠ',
  'lib.entry.wikisource.what': 'ਕਾਪੀਰਾਈਟ ਨਹੀਂ — ਇਹ ਦੁਨੀਆ ਦੀਆਂ ਪੁਰਾਣੀਆਂ ਸਾਹਿਤਕ ਕਿਤਾਬਾਂ ਹਨ.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ਹਰ ਕਿਸਮ ਦੀਆਂ ਤਸਵੀਰਾਂ',
  'lib.entry.wikimedia-commons.what': 'ਜਾਨਵਰ, ਨਕਸ਼ੇ, ਤਾਰੇ, ਇਤਿਹਾਸ — ਸਭ ਕੁਝ. ਹਰ ਤਸਵੀਰ ਦਾ ਆਪਣਾ ਲਾਇਸੰਸ ਹੈ.',
  'lib.entry.pixabay.title': 'Pixabay — ਫੋਟੋਆਂ ਅਤੇ ਚਿੱਤਰ',
  'lib.entry.pixabay.what': 'ਫੋਟੋਆਂ, ਰੇਖਾ-ਚਿੱਤਰ ਅਤੇ ਛੋਟੀਆਂ ਵੀਡੀਓਆਂ.',
  'lib.entry.unsplash.title': 'Unsplash — ਸੁੰਦਰ ਫੋਟੋਆਂ',
  'lib.entry.unsplash.what': 'ਮੁਫ਼ਤ, ਵੱਡੇ ਸਾਈਜ਼ ਵਿੱਚ, ਖਾਤੇ ਦੀ ਲੋੜ ਨਹੀਂ.',
  'lib.entry.openverse.title': 'Openverse — ਸਾਰੀਆਂ ਮੁਫ਼ਤ ਤਸਵੀਰਾਂ ਇੱਕੋ ਥਾਂ',
  'lib.entry.openverse.what': 'ਇੱਕੋ ਸਮੇਂ ਕਈ ਮੁਫ਼ਤ ਤਸਵੀਰ ਸਾਈਟਾਂ ਖੋਜੋ.',
  'lib.entry.librivox.title': 'LibriVox — ਸੁਣਨ ਲਈ ਕਿਤਾਬਾਂ',
  'lib.entry.librivox.what': 'ਪੁਰਾਣੀਆਂ ਅੰਗਰੇਜ਼ੀ ਕਿਤਾਬਾਂ ਦਾ ਮੁਫ਼ਤ ਆਡੀਓ, ਇਨਸਾਨੀ ਆਵਾਜ਼ ਵਿੱਚ.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ਆਡੀਓ ਸੰਗ੍ਰਹਿ',
  'lib.entry.internet-archive-audio.what': 'ਹਜ਼ਾਰਾਂ ਮੁਫ਼ਤ ਰਿਕਾਰਡਿੰਗਾਂ — ਕਿਤਾਬਾਂ, ਭਾਸ਼ਣ, ਸੰਗੀਤ.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — ਰਾਸ਼ਟਰੀ ਗਾਣ ਅਤੇ ਹੋਰ',
  'lib.entry.vande-mataram.what': 'ਭਾਰਤ ਦਾ ਰਾਸ਼ਟਰੀ ਗਾਣ ਅਤੇ ਹੋਰ ਰਾਸ਼ਟਰੀ ਗਾਣ, ਮੁਫ਼ਤ.',
  'art.aag-aur-bijli-ke-bachav.title': 'ਅੱਗ ਅਤੇ ਬਿਜਲੀ ਤੋਂ ਬਚਾਅ ਦੇ ਨਿਯਮ',
  'art.aag-aur-bijli-ke-bachav.summary': 'ਘਰ ਵਿੱਚ ਅੱਗ ਲੱਗਣ ਤੋਂ ਰੋਕਥਾਮ — ਸੌਖੇ ਨਿਯਮ',
  'art.aag-lagne-par-kya-karein.title': 'ਅੱਗ ਲੱਗ ਜਾਵੇ ਤਾਂ ਕੀ ਕਰੀਏ',
  'art.aag-lagne-par-kya-karein.summary': 'ਸੜਦੇ ਘਰ ਵਿੱਚ ਅੱਗ — ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰੀਏ, ਕੀ ਨਾ ਕਰੀਏ',
  'art.bimari-se-bachav.title': 'ਸੰਕਰਮਣ ਤੋਂ ਬਚਾਅ ਦੇ ਸੱਤ ਨਿਯਮ',
  'art.bimari-se-bachav.summary': 'ਹੱਥ ਧੋਣਾ, ਮਾਸਕ, ਟੀਕਾ — ਕਿਵੇਂ ਸੁਰੱਖਿਅਤ ਰਹੀਏ',
  'art.dhuwan-ka-jhakora.title': 'ਧੂੰਏਂ ਕਰਕੇ ਦਮ ਘੁੱਟਣ ਤੋਂ ਬਚਾਅ',
  'art.dhuwan-ka-jhakora.summary': 'ਦਮ ਘੁੱਟ ਰਿਹਾ ਹੈ, ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ — ਕੀ ਕਰੀਏ, ਕਦੋਂ ਹਸਪਤਾਲ ਜਾਈਏ',
  'art.doodh-pani-band-ho.title': 'ਬਿਜਲੀ ਜਾਂ ਪਾਣੀ ਅਚਾਨਕ ਬੰਦ ਹੋ ਜਾਵੇ',
  'art.doodh-pani-band-ho.summary': 'ਕੀ ਕਰੀਏ, ਕਿਸ ਤੋਂ ਬਚੀਏ, ਕਦੋਂ ਮਦਦ ਮੰਗੀਏ',
  'art.haath-ki-saafai.title': 'ਸਾਬਣ ਤੋਂ ਬਿਨਾਂ ਹੱਥ ਸਾਫ਼ ਕਰਨ ਦਾ ਤਰੀਕ਼ਾ',
  'art.haath-ki-saafai.summary': 'ਜਦੋਂ ਪਾਣੀ ਜਾਂ ਸਾਬਣ ਨਾ ਹੋਵੇ',
  'cat.dhyan-aur-yoog.title': 'ਧਿਆਨ ਅਤੇ ਯੋਗ',
  'cat.dhyan-aur-yoog.subtitle': 'ਮਨ ਸ਼ਾਂਤ ਕਰਨ ਦੇ ਸੌਖੇ ਤਰੀਕੇ',
  'cat.gharelu-marammat.title': 'ਘਰੇਲੂ ਮੁਰੰਮਤ',
  'cat.gharelu-marammat.subtitle': 'ਘਰ ਦੀਆਂ ਛੋਟੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦਾ ਹੱਲ',
  'cat.bachchon-ki-padhai.title': 'ਬੱਚਿਆਂ ਦੀ ਪੜ੍ਹਾਈ',
  'cat.bachchon-ki-padhai.subtitle': 'ਪੜ੍ਹਾਈ ਵਿੱਚ ਲੱਗੇ, ਪਰੇਸ਼ਾਨ',
  'cat.budharge-seva.title': 'ਬਜ਼ੁਰਗਾਂ ਦੀ ਸੇਵਾ',
  'cat.budharge-seva.subtitle': 'ਦੇਖਭਾਲ ਅਤੇ ਮਦਦ',
  'cat.shishu-dekhbhal.title': 'ਸ਼ਿਸ਼ੂ ਦੇਖਭਾਲ',
  'cat.shishu-dekhbhal.subtitle': 'ਛੋਟੇ ਬੱਚੇ ਦੀ ਸਹੀ ਦੇਖਭਾਲ',
  'cat.dharmik-upay.title': 'ਧਾਰਮਿਕ ਹੱਲ',
  'cat.dharmik-upay.subtitle': 'ਮਨ ਦੀ ਸ਼ਾਂਤੀ ਨਾਲ',
  'cat.pavan-grah-aur-aarti.title': 'ਪਵਿੱਤਰ ਗ੍ਰੰਥ ਅਤੇ ਆਰਤੀ',
  'cat.pavan-grah-aur-aarti.subtitle': 'ਸ਼੍ਰਧਾ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਸੁਣੋ',
  'cat.aapatkalen-gayide.title': 'ਐਮਰਜੈਂਸੀ ਗਾਈਡ',
  'cat.aapatkalen-gayide.subtitle': 'ਜਦੋਂ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੋਵੇ',
  'cat.mahamari-suraksha.title': 'ਮਹਾਂਮਾਰੀ ਸੁਰੱਖਿਆ',
  'cat.mahamari-suraksha.subtitle': 'ਬਿਮਾਰੀ ਫੈਲਣ ਤੋਂ ਬਚਾਅ',
  'nav.reviews': 'ਰਾਇ', 'nav.support': 'ਮਦਦ ਕਰੋ', 'nav.menu': 'ਮੀਨੂ',
  'nav.birthChart': 'ਜਨਮ ਗੰਠ',
  'jgd.title': 'ਤੁਹਾਡੀ ਜਨਮ ਗੰਠ',
  'jgd.intro': 'ਆਪਣਾ ਨਾਮ, ਜਨਮ ਮਿਤੀ, ਅਣਕਰ ਸਮਾਂ ਅਤੇ ਸਥਾਨ. ਸਾਰੀ ਗਿਣਤੀ ਤੁਹਾਡੇ ਫੋਨ \'ਤੇ ਹੀ ਹੁੰਦੀ ਹੈ — ਕਿਤੇ ਨਹੀਂ ਭੇਜੀ ਜਾਂਦੀ।',
  'jgd.nameLabel': 'ਜਨਮ ਦਾ ਨਾਮ',
  'jgd.namePlaceholder': 'ਉਦਾ. ਪੂਰਾ ਨਾਮ',
  'jgd.nameHint': 'ਬਚਪਣ ਵਿੱਚ ਪਿਛਵਾਇਆ ਨਾਮ.',
  'jgd.dateLabel': 'ਜਨਮ ਮਿਤੀ',
  'jgd.timeLabel': 'ਜਨਮ ਦਾ ਸਮਾਂ',
  'jgd.timeHint': 'ਨਾ ਪਤਾ ਹੋਵੇ ਤਾਂ ਖਾਲੀ ਛੱਡ ਦਿਓ.',
  'jgd.placeLabel': 'ਜਨਮ ਸਥਾਨ',
  'jgd.placeNone': 'ਪਤਾ ਨਹੀਂ / ਚੁਣੋ',
  'jgd.placeHint': 'ਜਨਮ ਦਾ ਸਥਾਨ ਚੁਣੋ.',
  'jgd.submit': 'ਗਿਣਤੀ ਕਰੋ',
  'jgd.savePdf': 'PDF ਬਣਾਓ',
  'jgd.again': 'ਨਵੀਂ ਗਿਣਤੀ ਕਰੋ',
  'jgd.errDate': 'ਕਿਰਪਾ ਕਰਕੇ ਜਨਮ ਮਿਤੀ ਸਹੀ ਲਿਖੋ.',
  'jgd.errPlace': 'ਸੂਚੀ ਵਿੱਚੋਂ ਆਪਣਾ ਸ਼ਹਿਰ ਚੁਣੋ, ਜਾਂ ਨੇੜੇ ਦਾ ਸ਼ਹਿਰ ਚੁਣੋ.',
  'jgd.numTitle': 'ਅੰਕ ਜੋਤਿਸ',
  'jgd.lifePath': 'ਜੀਵਨ ਪੱਥ',
  'jgd.nameNumber': 'ਨਾਮ ਅੰਕ',
  'jgd.soulNumber': 'ਆਤਮਾ ਅੰਕ',
  'jgd.birthdayNumber': 'ਜਨਮਦਿਨ ਅੰਕ',
  'jgd.astroTitle': 'ਵੈਦਿਕ ਜੋਤਿਸ',
  'jgd.nakshatra': 'ਨਛੱਤਰ',
  'jgd.pada': 'ਪਦ',
  'jgd.rashi': 'ਰਾਸ਼ੀ',
  'jgd.rashiLord': 'ਰਾਸ਼ੀ ਸਵਾਮੀ',
  'jgd.nakshatraLord': 'ਨਛੱਤਰ ਸਵਾਮੀ',
  'jgd.lagna': 'ਲਗਨ',
  'jgd.lagnaMissing': 'ਲਗਨ ਲਈ ਜਨਮ ਦਾ ਸਮਾਂ ਤੇ ਸਥਾਨ ਚਾਹੀਦਾ ਹੈ। ਉੱਪਰ ਭਰ ਕੇ ਫਿਰ ਗਿਣਤੀ ਕਰੋ — ਪਤਾ ਨਾ ਹੋਵੇ ਤਾਂ ਇੰਨਾ ਹੀ ਬਹੁਤ ਹੈ।',
  'jgd.gunTitle': 'ਗੁਣ ਮਿਲਨ',
  'jgd.gunIntro': 'ਦੂਜੇ ਵਿਅਕਤੀ ਦਾ ਨਾਮ ਤੇ ਜਨਮ ਮਿਤੀ ਭਰੋ.',
  'jgd.gunName': 'ਉਸਦਾ ਨਾਮ',
  'jgd.gunDate': 'ਉਸਦੀ ਜਨਮ ਮਿਤੀ',
  'jgd.gunHint': 'ਦੋਵਾਂ ਨਾਮ ਤੇ ਮਿਤੀਆਂ ਹੋਣ ਤਾਂ ਗੁਣ ਮਿਲਨ ਨਿਕਲਦਾ ਹੈ।',
  'jgd.disclaimer': 'ਇਹ ਪਰੰਪਰਾਗਤ ਵਿਧੀ ਨਾਲ ਕੀਤੀ ਗਿਣਤੀ ਹੈ, ਭਵਿਸ਼ਾਟ ਨਹੀਂ। ਕੋਈ ਵੀ ਅੰਕ ਜਾਂ ਰਾਸ਼ੀ ਕਿਸੇ ਦੇ ਸਿਹਤ, ਪੈਸੇ ਜਾਂ ਰਿਸ਼ਤਿਆਂ ਤੱਕ ਨਹੀਂ ਤੱਕੀਂ ਕਰਦੀ। ਵੱਡੇ ਫ਼ੈਸਲਿਆਂ ਲਈ ਡਾਕਟਰ, ਵਕੀਲ ਜਾਂ ਤਜਰਬੇਕਾਰ ਦੀ ਸਲਾਹ ਲਓ।',
  'nav.openMenu': 'ਮੀਨੂ ਖੋਲ੍ਹੋ', 'nav.closeMenu': 'ਮੀਨੂ ਬੰਦ ਕਰੋ', 'nav.language': 'ਭਾਸ਼ਾ ਬਦਲੋ',
  'ask.label': 'ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ ਜਾਂ ਬੋਲੋ',
  'ask.placeholder': 'ਜਿਵੇਂ: ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਕਮਜ਼ੋਰੀ',
  'ask.send': 'ਪੁੱਛੋ', 'ask.sending': 'ਸੋਚ ਰਹੇ ਹਾਂ…', 'ask.speak': 'ਬੋਲ ਕੇ ਪੁੱਛੋ',
  'ask.suggested': 'ਆਮ ਸਵਾਲ', 'ask.answerTitle': 'ਹੱਲ', 'ask.listen': 'ਸੁਣੋ',
  'ask.aiNote': 'ਇਹ ਜਵਾਬ AI ਨੇ ਦਿੱਤਾ ਹੈ। ਮਾਹਰ ਦੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ।',
  'sound.title': 'ਸ਼ਾਂਤੀ ਲਈ ਆਵਾਜ਼', 'sound.intro': 'ਕੋਈ ਫ਼ੀਸ ਨਹੀਂ, ਕੋਈ ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ।',
  'home.soundTitle': 'ਸ਼ਾਂਤੀ ਲਈ ਆਵਾਜ਼',
  'sound.shankh': 'ਸ਼ੰਖ', 'sound.bansuri': 'ਬਾਂਸੁਰੀ', 'sound.dhol': 'ਢੋਲ', 'sound.all': 'ਤਿੰਨੇ',
  'dhun.welcome': 'ਸਵਾਗਤ ਹੈ', 'dhun.prompt': 'ਸ਼ੰਖ, ਬਾਂਸੁਰੀ ਅਤੇ ਢੋਲ ਇਕੱਠੇ ਸੁਣਣ ਲਈ ਛੂਹੋ।',
  'dhun.listen': 'ਸੁਣੋ', 'dhun.skip': 'ਛੱਡੋ',
  'home.readMore': 'ਪੂਰੀ ਜਾਣਕਾਰੀ ਪੜ੍ਹੋ', 'home.chooseTopic': 'ਕਿਸ ਬਾਰੇ ਜਾਣਨਾ ਹੈ?',
  'home.askHere': 'ਇਸ ਵਿਸ਼ੇ ਬਾਰੇ ਪੁੱਛੋ', 'home.howTitle': 'ਇਹ ਸੇਵਾ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ',
  'home.freeTitle': 'ਇਹ ਸੇਵਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ', 'home.freeBody': 'ਪੈਸੇ ਨਹੀਂ ਲਿਏ ਜਾਂਦੇ, ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗੀ ਜਾਂਦੀ, ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ।',
  'footer.pages': 'ਪੰਨੇ', 'footer.helplines': 'ਜ਼ਰੂਰੀ ਨੰਬਰ',
  'reviews.title': 'ਤੁਹਾਡੀ ਰਾਏ, ਤੁਹਾਡੀ ਗੱਲ', 'reviews.submit': 'ਭੇਜੋ',
  'language.choose': 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', 'language.articlesIn': 'ਇਹ ਲੇਖ ਹਿੰਦੀ ਵਿੱਚ ਹੈ।',

  'ask.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ ਸਵਾਗਤ ਹੈ! ਹੇਠ ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ ਜਾਂ ਇੱਕ ਵਿਸ਼ਾ ਚੁਣੋ.',

  'ref.notTitle': 'ਇਹ ਕੀ ਨਹੀਂ ਕਰਦੀ',

  'ref.not1': 'ਇਹ ਡਾਕਟਰ ਨਹੀਂ ਹੈ। ਦਵਾ ਦੀ ਸਲਾਹ ਕਦੇ ਨਹੀਂ ਦਿੱਤੀ ਜਾਂਦੀ।',

  'ref.not2': 'ਇਹ ਵਕੀਲ ਨਹੀਂ ਹੈ। ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ ਦਿੱਤੀ ਜਾਂਦੀ।',

  'ref.not3': 'ਕੋਈ ਪੈਸਾ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ, ਅਤੇ ਕੋਈ ਜਾਹੇਰਾਤ ਨਹੀਂ ਵਿਖਾਈ ਜਾਂਦੀ।',

  'ref.not4': 'ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਨਹੀਂ ਮੰਗਿਆ ਜਾਂਦਾ ਅਤੇ ਨਹੀਂ ਰੱਖਿਆ ਜਾਂਦਾ।',

  'ref.not5': 'ਸਰਕਾਰੀ ਯੋਜਨਾ ਦੀ ਕੀਮਤ ਜਾਂ ਨੰਬਰ ਨਹੀਂ ਬਣਾਇਆ ਜਾਂਦਾ — ਜਾਣਕਾਰੀ ਨਾ ਹੋਵੇ ਤਾਂ ਸਾਫ਼ ਕਹਿਆ ਜਾਂਦਾ ਹੈ ਕਿ ਨਹੀਂ ਪਤਾ।',

  'ref.medicalTitle': 'ਜ਼ਰੂਰੀ: ਇਹ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਨਹੀਂ ਹੈ',

  'ref.medicalBody': 'ਬਿਮਾਰੀ, ਦਵਾ ਜਾਂ ਕੋਈ ਵੀ ਜ਼ਹਰੀਲੀ ਚੀਜ਼ ਬਾਰੇ ਹੋਵੇ ਤਾਂ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ। ਇੱਥੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਆਮ ਮਦਦ ਲਈ ਹੈ। ਬੱਚੇ ਦੇ ਟੀਕੇ, ਗਰਭਾਵਸਥਾ, ਜਾਂ ਕੋਈ ਵੀ ਦਵਾ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਜ਼ਰੂਰ ਲਵੋ।',

  'ref.statsTitle': 'ਕਿੰਨੀ ਜਾਣਕਾਰੀ ਮੌਜੂਦ ਹੈ',

  'support.howTitle': 'ਤੁਸੀਂ ਸਾਡੀ ਮਦਦ ਕਿਵੇਂ ਕਰ ਸਕਦੇ ਹੋ',

  'support.alwaysFreeTitle': 'ਇਹ ਸੇਵਾ ਹਮੇਸ਼ਾ ਮੁਫ਼ਤ ਰਹੇਗੀ',

  'support.alwaysFreeBody': 'ਜੋ ਮਦਦ ਮਿਲੇ, ਉਹ ਸੇਵਾ ਚਲਾਉਣ ਵਿੱਚ ਲੱਗੇਗੀ। ਕਿਸੇ ਤੋਂ ਕਦੇ ਪੈਸੇ ਨਹੀਂ ਲਿਆ ਜਾਵੇਗਾ।',

  'smriti.eyebrow': 'ਯਾਦ ਵਿੱਚ',

  'smriti.whyTitle': 'ਇਹ ਸਾਈਟ ਕਿਉਂ ਹੈ',

  'smriti.ending': 'ਉਹਨਾਂ ਦੀ ਲੜਾਈ ਇੱਥੋਂ ਹੀ ਅੱਗੇ ਵਧਦੀ ਹੈ।',

  'article.askAny': 'ਇੱਕ ਸਵਾਲ ਪੁੱਛੋ',

  'article.remember': 'ਯਾਦ ਰੱਖੋ',

  'article.emergencyInfo': 'ਜ਼ਰੂਰੀ ਜਾਣਕਾਰੀ',

  'article.medicalTitle': 'ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ',

  'article.medicalBody': 'ਇਹ ਜਾਣਕਾਰੀ ਆਮ ਮਦਦ ਲਈ ਹੈ। ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਬਿਨਾਂ ਕੋਈ ਦਵਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਨਾ ਕਰੋ।',

  'article.heading': '{category} ਬਾਰੇ ਲੇਖ',

  'reviews.rateQuestion': 'ਕਿੰਨੇ ਤਾਰੇ ਦੇਣਗੇ?',

  'reviews.starsShort': '{value} ਤਾਰੇ',

  'reviews.averageOutOf': '5 ਵਿੱਚੋਂ {value} ਤਾਰੇ',

  'dhun.welcomeTitle': 'ਜੀ ਆਇਆਂ ਨੂੰ ਸਵਾਗਤ ਹੈ',

  'dhun.consent': 'ਸ਼ੰਖ, ਬਾਂਸੀ ਅਤੇ ਢੋਲ ਇਕੱਠੇ। ਸੁਣਣ ਲਈ ਛੂਹੋ।',

  'dhun.failed': 'ਧੁਨ ਨਹੀਂ ਚੱਲੀ।',

  'dhun.unsupported': 'ਇਹ ਬ੍ਰਾਊਜ਼ਰ ਧੁਨ ਨਹੀਂ ਚਲਾ ਸਕਦਾ।',

  'dhun.failedTry': 'ਧੁਨ ਚਲਾਉਣ ਵਿੱਚ ਸਮੱਸਿਆ ਹੋਈ।',

  'sound.hintIdle': 'ਕੋਈ ਵੀ ਬਟਨ ਦਬਾ ਕੇ ਧੁਨ ਸੁਣੋ।',

  'sound.hintPlaying': 'ਆਵਾਜ਼ ਚੱਲ ਰਹੀ ਹੈ। ਰੋਕਣ ਲਈ ਉਸੇ ਹੀ ਬਟਨ ਦੁਬਾਰਾ ਦਬਾਓ।',

  'sound.preparing': 'ਧੁਨ ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ',

  'nav.path': 'ਰਾਹ',

  'toast.dismiss': 'ਬੰਦ ਕਰੋ',

  'footer.free': 'ਇਹ ਸੇਵਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ। ਕਿਸੇ ਤੋਂ ਪੈਸੇ ਨਹੀਂ ਲਏ ਜਾਂਦੇ।',

  'cat.empty': 'ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਹਾਲੇ ਕੋਈ ਲੇਖ ਨਹੀਂ ਹੈ।',
  'cat.notFound': 'ਇਹ ਪੇਜ ਨਹੀਂ ਮਿਲਿਆ',

  'dhun.label': 'ਧੁਨ ਚਲਾਉਣ ਦੀ ਇਜਾਜ਼ਤ',

  'language.articlesInHint': 'ਹਰ ਭਾਸ਼ਾ ਲਈ ਵੱਖਰੀ ਅਨੁਵਾਦ ਚਾਹੀਦਾ ਹੈ। ਇਹ ਅਨੁਵਾਦ ਹਾਲੇ ਨਹੀਂ ਹੋਇਆ — ਜੋ ਲਿਖਿਆ ਹੈ ਉਹੀ ਹਿੰਦੀ ਵਿੱਚ ਹੀ ਸਭ ਤੋਂ ਸਹੀ ਅਤੇ ਪੂਰਾ ਹੈ।',

  'nav.collapse': 'ਟੈਬ ਬੰਦ ਕਰੋ',

  'nav.expand': 'ਟੈਬ ਖੋਲ੍ਹੋ',

  'nav.skip': 'ਸਿੱਧਾ ਸਮੱਗਰੀ ਤੇ ਜਾਓ',

  'theme.toDark': 'ਹਨੇਰੇ ਰੰਗ ਤੇ ਜਾਓ',

  'theme.toLight': 'ਉਜਲੇ ਰੰਗ ਤੇ ਜਾਓ',

  'ask.clear': 'ਲਿਖਿਆ ਮਿਟਾਓ',

  'ask.emptyAnswer': 'ਇਸ ਵਾਰ ਜਵਾਬ ਨਹੀਂ ਬਣਿਆ। ਥੋੜ੍ਹਾ ਵੱਖਰਾ ਲਿਖ ਕੇ ਦੁਬਾਰਾ ਪੁੱਛੋ।',

  'ask.errorNetwork': 'ਇੰਟਰਨੈੱਟ ਨਹੀਂ ਚੱਲ ਰਿਹਾ। ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ ਅਤੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',

  'ask.errorRateLimit': 'ਇੱਕੋ ਵਾਰ ਬਹੁਤ ਸਾਰੇ ਸਵਾਲ ਭੇਜੇ ਗਏ। ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',

  'ask.heardWith': 'ਹੁਣ ਸੁਣ ਰਹੇ ਹਾਂ',
  'ask.heard': 'ਸੁਣ ਰਹੇ ਹਾਂ',

  'ask.help': 'ਐਂਟਰ ਦਬਾ ਕੇ ਵੀ ਭੇਜ ਸਕਦੇ ਹੋ।',

  'ask.listening': 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ…',

  'ask.micUnsupported': 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਬੋਲ ਕੇ ਪੁੱਛਣਾ ਕੰਮ ਨਹੀਂ ਕਰੇਗਾ। ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'ask.notAnswer': 'ਇਸ ਸਵਾਲ ਦਾ ਸਿੱਧਾ ਜਵਾਬ ਸਾਡੇ ਕੋਲ ਨਹੀਂ ਹੈ।',


  'ask.stopListening': 'ਸੁਣਨਾ ਰੋਕੋ',

  'ask.stopSpeak': 'ਰੋਕੋ',

  'article.askAbout': 'ਇਸ ਵਿਸ਼ੇ ਬਾਰੇ ਪੁੱਛੋ',

  'article.count': '{count} ਲੇਖ',

  'article.emergency': 'ਜ਼ਰੂਰੀ',

  'article.others': 'ਇਸ ਵਿਸ਼ੇ ਦੇ ਹੋਰ ਲੇਖ',

  'article.readAloud': 'ਇਹ ਲੇਖ ਸੁਣੋ',

  'footer.admin': 'ਪ੍ਰਬੰਧਕ',

  'footer.ambulance': 'ਐਂਬੂਲੈਂਸ',

  'footer.emergency': 'ਐਮਰਜੈਂਸੀ',

  'footer.readStory': 'ਉਹਨਾਂ ਦੀ ਪੂਰੀ ਕਹਾਣੀ ਪੜ੍ਹੋ',

  'footer.rights': 'ਮੁਫ਼ਤ ਸੇਵਾ',

  'footer.women': 'ਔਰਤ ਹੈਲਪਲਾਈਨ',

  'sound.allHint': 'ਇਕੱਠ',

  'sound.bansuriHint': 'ਕੋਮਲ, ਹੌਲੀ',

  'sound.dholHint': 'ਤਿੱਖੀ, ਤੇਜ਼',

  'sound.errGeneric': 'ਧੁਨ ਚਲਾਉਣ ਵਿੱਚ ਸਮੱਸਿਆ ਹੋਈ।',

  'sound.errUnsupported': 'ਇਹ ਬ੍ਰਾਊਜ਼ਰ ਧੁਨ ਨਹੀਂ ਚਲਾ ਸਕਦਾ।',

  'sound.listenLabel': 'ਸੁਣੋ',

  'sound.playing': 'ਆਵਾਜ਼ ਚੱਲ ਰਹੀ ਹੈ। ਰੋਕਣ ਲਈ ਉਸੇ ਹੀ ਬਟਨ ਦੁਬਾਰਾ ਦਬਾਓ।',

  'sound.shankhHint': 'ਡੂੰਘੀ, ਲੰਬੀ',

  'voice.aborted': 'ਰੁਕ ਗਿਆ। ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',

  'voice.audioCapture': 'ਮਾਈਕ ਨਹੀਂ ਮਿਲਿਆ। ਡਿਵਾਈਸ ਜੋੜੋ, ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'voice.generic': 'ਕੁਝ ਗੜਬੜ ਹੋਈ। ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',

  'voice.network': 'ਬੋਲ ਕੇ ਪੁੱਛਣ ਲਈ ਇੰਟਰਨੈੱਟ ਚਾਹੀਦਾ, ਪਰ ਉਹ ਨਹੀਂ ਚੱਲ ਰਿਹਾ। ਲਿਖ ਕੇ ਪੁੱਛੋ — ਉਹੀ ਜਵਾਬ ਮਿਲੇਗਾ।',

  'voice.noSpeech': 'ਕੋਈ ਆਵਾਜ਼ ਨਹੀਂ ਸੁਣਾਈ ਦਿੱਤੀ। ਮਾਈਕ ਕੋਲ ਬੋਲੋ, ਜਾਂ ਲਿਖੋ।',

  'voice.notAllowed': 'ਮਾਈਕ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਉੱਪਰ ਜਾ ਕੇ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'voice.serviceNotAllowed': 'ਮਾਈਕ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਉੱਪਰ ਜਾ ਕੇ ਇਜਾਜ਼ਤ ਦਿਓ, ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'voice.speakFailed': 'ਇਹ ਜਵਾਬ ਪੜ੍ਹ ਕੇ ਸੁਣਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।',
  'voice.noVoice': 'ਇਸ ਡਿਵਾਈਸ ਵਿੱਚ {name} ਆਵਾਜ਼ ਨਹੀਂ ਹੈ। ਹੁਣ ਲਿਖਿਆ ਪੜ੍ਹੋ, ਜਾਂ ਫੋਨ ਦੀਆਂ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਜਾ ਕੇ ਆਵਾਜ਼ ਜੋੜੋ।',

  'voice.unsupported': 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਬੋਲ ਕੇ ਪੁੱਛਣਾ ਕੰਮ ਨਹੀਂ ਕਰੇਗਾ। ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'ask.notConfigured': 'ਇਹ ਸੇਵਾ ਹਾਲੇ ਸੰਭਾਲੀਆਂ ਜਵਾਬਾਂ ਦੇ ਭੰਡਾਰ ਤੋਂ ਜਵਾਬ ਦੇ ਰਹੀ ਹੈ। ਤੁਹਾਡਾ ਸਵਾਲ ਉਸਮੇਂ ਨਹੀਂ ਮਿਲਿਆ।',

  'ask.browseTitle': 'ਇੱਥੇ ਜੋ ਲੇਖ ਹਨ ਉਹ ਵੇਖੋ',

  'health.heading': 'ਆਪਣੀ ਉਮਰ ਦੱਸੋ',

  'health.intro': 'ਉਮਰ ਅਨੁਸਾਰ ਜੋ ਸਵਾਲ ਵਾਰ-ਵਾਰ ਪੁੱਛੇ ਜਾਂਦੇ ਹਨ, ਉਹ ਇੱਥੇ ਦਿਸਣਗੇ। ਕੋਈ ਵੀ ਬਟਨ ਦਬਾਓ — ਸਵਾਲ ਹੇਠਾਂ ਭਰਿਆ ਜਾਵੇਗਾ, ਫਿਰ ਪੁੱਛੋ।',

  'health.ageLabel': 'ਉਮਰ (ਸਾਲ)',

  'health.years': 'ਸਾਲ',

  'health.bandsLabel': 'ਉਮਰ ਅਨੁਸਾਰ ਚੁਣੋ',

  'health.notAdviceStrong': 'ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ।',

  'health.notAdvice': 'ਕੋਈ ਵੀ ਦਵਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਨਾ ਕਰੋ — ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ।',

  'health.emergencyStrong': 'ਐਮਰਜੈਂਸੀ ਹਾਲਤ ਵਿੱਚ ਫ਼ੋਨ ਕਰੋ:',

  'health.emergencyCall': '(ਐਮਰਜੈਂਸੀ)',

  'health.emergencyAmbulance': '(ਐਂਬੂਲੈਂਸ)',

  'health.emergencyWomen': '(ਔਰਤ ਹੈਲਪਲਾਈਨ)',

  'health.privacy': 'ਨਾਮ ਜਾਂ ਪਤਾ ਲਿਖਣ ਦੀ ਲੋੜ ਨਹੀਂ।',

  'health.band.infant.label': '0 – 2 ਸਾਲ',

  'health.band.child.label': '3 – 12 ਸਾਲ',

  'health.band.teen.label': '13 – 17 ਸਾਲ',

  'health.band.young.label': '18 – 30 ਸਾਲ',

  'health.band.middle.label': '31 – 45 ਸਾਲ',

  'health.band.later.label': '46 – 60 ਸਾਲ',

  'health.band.senior.label': '61 – 75 ਸਾਲ',

  'health.band.elder.label': '76 – 100 ਸਾਲ',

  /* ---- save / download ---- */

  'download.pdf': 'PDF ਵਜੋਂ ਸੰਭਾਲੋ',
  'download.text': 'ਲਿਖਤ ਵਜੋਂ ਸੰਭਾਲੋ',
  'download.printNow': 'ਛਾਪੋ',
  'download.preparing': 'ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ',
  'download.blocked': 'ਨਵਾਂ ਟੈਬ ਨਹੀਂ ਖੁੱਲ ਸਕਿਆ। ਪਾਪ-ਅੱਪ ਬਲਾਕ ਹੈ — ਇਜਾਜ਼ਤ ਦਿਓ।',

  /* ---- attach a document ---- */

  'attach.button': 'ਆਪਣਾ ਦਸਤਾਵੇਜ ਜਾਂ ਫੋਟੋ ਜੋੜੋ',
  'attach.formats': 'PDF, ਫੋਟੋ (JPG/PNG) ਜਾਂ ਲਿਖਤ ਫਾਈਲ — 12 MB ਤੱਕ',
  'attach.reading': 'ਪੜ੍ਹ ਰਿਹਾ ਹੈ…',
  'attach.attached': 'ਜੋੜਿਆ ਗਿਆ',
  'attach.remove': 'ਹਟਾਓ',
  'attach.tooBigPdf': 'ਇਹ PDF 12 MB ਤੋਂ ਵੱਡੀ ਹੈ. ਛੋਟੀ ਫਾਈਲ ਚੁਣੋ.',
  'attach.tooBigImage': 'ਇਹ ਫੋਟੋ 3 MB ਤੋਂ ਵੱਡਾ ਹੈ. ਛੋਟਾ ਫੋਟੋ ਚੁਣੋ.',
  'attach.scannedPdf': 'ਇਹ PDF ਸਕੈਨ ਹੈ — ਇਸ ਵਿੱਚ ਸਿਰਫ਼ ਤਸਵੀਰ ਹੈ, ਪੜ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ. ਇਸ ਦੀ ਫੋਟੋ ਭੇਜੋ.',
  'attach.pdfFailed': 'ਇਹ PDF ਪੜ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ.',
  'attach.imageFailed': 'ਇਹ ਫੋਟੋ ਲੋਡ ਨਹੀਂ ਹੋਇਆ.',
  'attach.wrongType': 'ਇਸ ਕਿਸਮ ਦੀ ਫਾਈਲ ਨਹੀਂ ਚੱਲੇਗੀ. PDF, ਫੋਟੋ ਜਾਂ ਲਿਖਤ ਫਾਈਲ ਭੇਜੋ.',
  'attach.hint': 'ਆਪਣਾ ਕਾਗਜ਼ ਇੱਥੇ ਜੋੜ ਕੇ ਸਵਾਲ ਪੁੱਛੋ — ਜਵਾਬ ਉਸੇ ਕਾਗਜ਼ ਬਾਰੇ ਮਿਲੇਗਾ.',
  'ask.sendWithFile': 'ਇਸ ਦਾ ਜਵਾਬ ਦਿਓ',

  /* ---- free library ---- */

  'lib.title': 'ਮੁਫ਼ਤ ਗ੍ਰੰਥਾਲਾ',
  'lib.intro': 'ਪਾਠ ਕਿਤਾਬਾਂ, ਕਿਤਾਬਾਂ, ਤਸਵੀਰਾਂ, ਆਡੀਓ — ਸਭ ਮੁਫ਼ਤ ਅਤੇ ਕਾਨੂੰਨੀ।',
  'lib.legalTitle': 'ਕਾਪੀਰਾਈਟ ਦੀ ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ।',
  'lib.legal': 'ਇੱਥੇ ਜੋ ਕੁਝ ਦਿੱਤਾ ਗਿਆ ਹੈ ਉਹ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ ਅਤੇ ਤੁਸੀਂ ਇਸ ਨੂੰ ਅੱਗੇ ਵੀ ਸਾਂਝਾ ਸਕਦੇ ਹੋ। ਜੋ ਕਿਤਾਬ ਅਜੇ ਵੀ ਕਾਪੀਰਾਈਟ ਵਿੱਚ ਹੈ ਉਹ ਇੱਥੇ ਨਹੀਂ — ਉਸ ਨੂੰ ਕਾਪੀ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ, ਇਹ ਸਾਫ਼ ਦੱਸਣਾ ਹੀ ਸਹੀ ਹੈ।',
  'ask.signInTitle': 'ਪਹਿਲਾਂ ਲੌਗਇਨ ਕਰੋ',
  'ask.signInBody': 'ਸਵਾਲ ਪੁੱਛਣ ਲਈ ਖਾਤਾ ਬਣਾਓ. ਇੱਕ ਮਿੰਟ ਤੋਂ ਵੀ ਘੱਟ, ਫਿਰ ਤੁਸੀਂ ਸਵਾਲ ਪੁੱਛਦੇ ਰਹੋ.',
  'ask.signInCta': 'ਖਾਤਾ ਬਣਾਓ ਜਾਂ ਲੌਗਇਨ ਕਰੋ',
  'ask.signInFirst': 'ਪਹਿਲਾਂ ਲੌਗਇਨ ਕਰੋ, ਫਿਰ ਸਵਾਲ ਪੁੱਛੋ।',
  'ask.signInOr': 'ਹੁਣ ਖਾਤਾ ਬਣਾਇਆ ਨਹੀਂ ਜਾ ਸਕਦੇ? ਇਹ ਬਿਨਾਂ ਖਾਤੇ ਵੀ ਕੰਮ ਕਰਦੇ ਹਨ:',
  'account.title': 'ਮੇਰਾ ਖਾਤਾ',
  'account.intro': 'ਆਪਣੇ ਨਾਮ ਅਤੇ ਪਾਸਵਰਡ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ.',
  'account.signIn': 'ਲੌਗਇਨ ਕਰੋ',
  'account.register': 'ਖਾਤਾ ਬਣਾਓ',
  'account.signInNote': 'ਪਹਿਲਾਂ ਵਰਤਿਆ ਨਾਮ ਤੇ ਪਾਸਵਰਡ ਵਰਤੋ।',
  'account.registerNote': 'ਸਵਾਲ ਪੁੱਛਣ ਲਈ ਖਾਤਾ ਲੋੜੀਂਦਾ ਨਹੀਂ। ਇਹ ਸਿਰਫ਼ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਅਤੇ ਜਵਾਬ ਯਾਦ ਰੱਖਣ ਲਈ ਹੈ।',
  'account.handle': 'ਤੁਹਾਡਾ ਨਾਮ',
  'account.handlePlaceholder': 'ਉਦਾ. sita.ji',
  'account.password': 'ਪਾਸਵਰਡ',
  'account.passwordHint': 'ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ।',
  'account.phone': 'ਫ਼ੋਨ ਨੰਬਰ',
  'account.optional': 'ਲੋੜੀਂਦਾ ਨਹੀਂ',
  'account.phoneHint': 'ਚਾਹੁਣ ਹੋਵੇ ਤਾਂ ਦਿਓ। ਬਿਨਾਂ ਵੀ ਖਾਤਾ ਬਣ ਜਾਂਦਾ ਹੈ।',
  'account.create': 'ਖਾਤਾ ਬਣਾਓ',
  'account.logout': 'ਬਾਹਰ ਜਾਓ',
  'account.open': 'ਖਾਤਾ ਖੋਲ੍ਹੋ',
  'account.signedInAs': 'ਤੁਸੀਂ ਲੌਗਇਨ ਹੋ',
  'account.signedOut': 'ਲੌਗਇਨ ਨਹੀਂ',
  'account.signedOutBody': 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਕੋਈ ਖਾਤਾ ਖੁੱਲ੍ਹਾ ਨਹੀਂ।',
  'account.saved': 'ਸੰਭਾਲੇ ਜਵਾਬ',
  'account.savedEmpty': 'ਹਾਲੇ ਕੁਝ ਸੰਭਾਲਿਆ ਨਹੀਂ। ਜਵਾਬ \'ਤੇ \'ਸੰਭਾਲੋ\' ਦਬਾਓ.',
  'account.savedUnavailable': 'ਸੰਭਾਲੇ ਜਵਾਬ ਹਾਲ ਨਹੀਂ ਦਿਸਦੇ। ਬਾਕੀ ਸਭ ਚੱਲ ਰਿਹਾ ਹੈ।',
  'account.wait': 'ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ…',
  'account.privacyTitle': 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ',
  'account.privacyBody': 'ਖਾਤੇ ਵਿੱਚ ਸਿਰਫ਼ ਤੁਹਾਡਾ ਨਾਮ, ਪਾਸਵਰਡ ਅਤੇ ਭਾਸ਼ਾ ਰਹਿੰਦੀ ਹੈ। ਤੁਸੀਂ ਕੀ ਪੁੱਛਿਆ ਇਹ ਰਿਕਾਰਡ ਨਹੀਂ ਹੁੰਦਾ। ਤੁਹਾਡੇ ਸਵਾਲ ਕਿਸੇ ਨੂੰ ਨਹੀਂ ਭੇਜੇ ਜਾਂਦੇ।',
  'account.errWrong': 'ਨਾਮ ਜਾਂ ਪਾਸਵਰਡ ਗਲਤ ਹੈ।',
  'account.errTaken': 'ਇਹ ਨਾਮ ਲਿਆ ਗਿਆ ਹੈ। ਹੋਰ ਨਾਮ ਲਓ।',
  'account.errBad': 'ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਭਰੋ.',
  'account.errWait': 'ਬਹੁਤ ਕੋਸ਼ਿਸ਼ਾਂ ਹੋਈਆਂ। ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ.',
  'account.errTryLater': 'ਹੁਣ ਨਹੀਂ ਹੋ ਸਕਿਆ. ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ.',
  'lib.licence.ccBy': 'ਤੁਸੀਂ ਕਾਪੀ ਕਰ ਸਕਦੇ ਹੋ, ਸਾਂਝਾ ਸਕਦੇ ਹੋ, ਛਾਪ ਸਕਦੇ ਹੋ — ਸਰੋਤ ਦਾ ਨਾਮ ਦੱਸਣਾ ਹੈ।',
  'lib.licence.ccBySa': 'ਤੁਸੀਂ ਕਾਪੀ ਕਰ ਸਕਦੇ ਹੋ, ਛਾਪ ਸਕਦੇ ਹੋ। ਕੀਤੇ ਤਬਦੀਲੀਆਂ ਵੀ ਖੁੱਲ੍ਹੀ ਕਰ ਦੇਣੀਆਂ ਲੱਗਦੀਆਂ ਹਨ।',
  'lib.licence.ccZero': 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ। ਸਰੋਤ ਦਾ ਨਾਮ ਦੱਸਣਾ ਵੀ ਲੋੜੀਂਦਾ ਨਹੀਂ।',
  'lib.licence.pd': 'ਇਸ ਦਾ ਕੋਈ ਕਾਪੀਰਾਈਟ ਨਹੀਂ — ਜਿਵੇਂ ਮਰਜ਼ੀ ਕਾਪੀ ਕਰੋ।',
  'lib.licence.govtIndia': 'ਭਾਰਤ ਸਰਕਾਰ ਦੀ ਵੈੱਬਸਾਈਟ \'ਤੇ। ਪੜ੍ਹਨਾ ਅਤੇ ਛਾਪਣਾ ਦੋਵੇਂ ਮੁਫ਼ਤ।',
  'lib.licence.creativeCommons': 'ਹਰ ਫ਼ਾਈਲ ਦਾ ਆਪਣਾ ਲਾਇਸੰਸ ਹੈ — ਫ਼ਾਈਲ ਵੇਖੋ।',
  'lib.licence.freeToRead': 'ਪੜ੍ਹਨਾ ਮੁਫ਼ਤ। ਅੱਗੇ ਦੇਣਾ ਵੀ ਉਸੇ ਹੀ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ ਹੈ।',
  'lib.openBadge': 'ਖੁੱਲ੍ਹਾ',
  'lib.openBadgeNote': 'ਕਾਪੀ ਕਰ ਸਕਦੇ ਹਾਂ',
  'lib.freeBadge': 'ਮੁਫ਼ਤ',
  'lib.freeBadgeNote': 'ਪੜ੍ਹ ਸਕਦੇ ਹਾਂ, ਕਾਪੀ ਨਹੀਂ',
  'lib.govt': 'ਸਰਕਾਰੀ',
  'lib.noSignup': 'ਖਾਤਾ ਨਹੀਂ',
  'lib.open': 'ਇੱਥੇ ਖੋਲ੍ਹੋ',
  'lib.group.padhai': 'ਪਾਠ ਕਿਤਾਬਾਂ',
  'lib.group.padhai.note': 'ਪਾਠ-ਪੁਸਤਕਾਂ, ਕਾਲਜ ਅਤੇ ਸਰਕਾਰੀ ਸਿੱਖਿਆ ਸਾਮਗਰੀ',
  'lib.group.kitab': 'ਕਿਤਾਬਾਂ',
  'lib.group.kitab.note': 'ਜੋ ਕਾਪੀਰਾਈਟ ਤੋਂ ਬਾਹਰ ਹਨ ਜਾਂ ਜਿਨ੍ਹਾਂ ਕਾਪੀ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਹੈ',
  'lib.group.tasveer': 'ਤਸਵੀਰਾਂ',
  'lib.group.tasveer.note': 'ਨਕਸ਼ੇ, ਤਸਵੀਰਾਂ — ਸਭ ਕੁਝ',
  'lib.group.audio': 'ਸੁਣਨ ਵਾਲੀ ਸਾਮਗਰੀ',
  'lib.group.audio.note': 'ਕਿਤਾਬਾਂ ਆਡੀਓ ਰੂਪ ਵਿੱਚ, ਛੋਟੇ ਅੱਖਰ ਨਾ ਪੜ੍ਹਨ ਵਾਲਿਆਂ ਲਈ',
  'lib.warnTitle': 'ਹਰ ਕਿਤਾਬ ਇੱਥੇ ਨਹੀਂ',
  'lib.warn': 'ਕੁਝ ਕਿਤਾਬਾਂ ਅਜੇ ਵੀ ਕਾਪੀਰਾਈਟ ਵਿੱਚ ਹਨ ਅਤੇ ਕਾਨੂੰਨ ਅਨੁਸਾਰ ਮੁਫ਼ਤ ਦਿੱਤੀਆਂ ਨਹੀਂ ਜਾ ਸਕਦੀਆਂ। ਉਹ ਜਾਣਬੁੱਝ ਕੇ ਨਹੀਂ ਦਿਖਾਈ। ਕਿਤਾਬ ਚਾਹੀਦੀ ਹੋ ਤਾਂ ਹੇਠੇ ਪੁੱਛੋ — ਜੋ ਕਹਿਣਯੋਗ ਹੈ ਉਹ ਕਹਿ ਦਿੱਤਾ ਜਾਵੇਗਾ।',
  'lib.askInstead': 'ਪੁੱਛੋ',
  'nav.library': 'ਗ੍ਰੰਥਾਲਾ',

  'help.title': 'ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ',

  'help.intro': 'ਹੇਠਾਂ ਲਿਖੋ ਜਾਂ ਬੋਲੋ। ਨਾ ਪਤਾ ਹੋਵੇ ਤਾਂ ਜੋ ਮਨ ਵਿੱਚ ਆਵੇ ਲਿਖ ਦਿਓ — ਇਹੀ ਸਭ ਤੋਂ ਜ਼ਰੂਰੀ ਹੈ।',

  'help.howTitle': 'ਇਹ ਸੇਵਾ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ',

  'help.howBody': 'ਹਰ ਸਵਾਲ ਦਰਜ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਜਵਾਬ ਤੁਰੰਤ ਮਿਲਦਾ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਕਿਤੇ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ। ਸਭ ਕੁਝ ਮੁਫ਼ਤ ਹੈ।',

  'help.suggested': 'ਆਮ ਸਵਾਲ',

  'help.q1.label': 'ਬਿਜਲੀ ਚਲੀ ਗਈ, ਕੀ ਕਰੂੰ?',

  'help.q1.question': 'ਘਰ ਵਿੱਚ ਬਿਜਲੀ ਚਲੀ ਗਈ ਹੈ। ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ, ਅਤੇ ਮੋਬਾਈਲ ਫੋਨ ਕਿਵੇਂ ਚਾਰਜ ਕਰੀਏ?',

  'help.q2.label': 'ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਕਮਜ਼ੋਰੀ',

  'help.q2.question': 'ਮੇਰੇ ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਬਹੁਤ ਕਮਜ਼ੋਰੀ ਹੈ। ਘਰ ਵਿੱਚ ਕਿਵੇਂ ਸੁਧਾਰੀਏ?',

  'help.q3.label': 'ਬਜ਼ੁਰਗ ਦਾ ਇਲਾਜ',

  'help.q3.question': 'ਮੇਰੇ ਪਿਤਾ ਜੀ ਦੀ ਉਮਰ ਬਹੁਤ ਵੱਧ ਹੈ, ਉਨ੍ਹਾਂ ਦਾ ਇਲਾਜ ਕਿਵੇਂ ਕਰੂੰ?',

  'help.q4.label': 'ਘਰ ਵਿੱਚ ਅੱਗ ਲੱਗ ਜਾਵੇ ਤਾਂ',

  'help.q4.question': 'ਜੇ ਰਾਤ ਨੂੰ ਘਰ ਵਿੱਚ ਅੱਗ ਲੱਗ ਜਾਵੇ ਤਾਂ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',

  'home.stepLabel': 'ਕਦਮ',

  'home.step1Title': 'ਆਪਣੀ ਗੱਲ ਲਿਖੋ ਜਾਂ ਬੋਲੋ',

  'home.step1Body': 'ਪੰਜਾਬੀ ਵਿੱਚ ਟਾਈਪ ਕਰੋ, ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ। ਕੁਝ ਖ਼ਾਸ ਨਹੀਂ ਕਰਨਾ — ਜੋ ਮਨ ਵਿੱਚ ਹੈ ਲਿਖ ਦਿਓ।',

  'home.step2Title': 'ਤੁਰੰਤ ਜਵਾਬ ਮਿਲਦਾ ਹੈ',

  'home.step2Body': 'ਹਰ ਸਵਾਲ ਦਰਜ ਹੁੰਦਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਜਵਾਬ ਤੁਰੰਤ ਮਿਲਦਾ ਹੈ। ਬਹੁਤ ਲੰਬੇ ਸਵਾਲ ਤੋਂ ਪਹਿਲਾਂ ਛੋਟੇ ਸਵਾਲ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।',

  'home.step3Title': 'ਕੋਈ ਪੈਸਾ ਨਹੀਂ, ਕੋਈ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨਹੀਂ',

  'home.step3Body': 'ਇਹ ਸੇਵਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਨਹੀਂ ਮੰਗਿਆ ਜਾਂਦਾ, ਅਤੇ ਕੋਈ ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ ਦਿਖਾਇਆ ਜਾਂਦਾ।',

  'home.memorialEyebrow': 'ਇਹ ਸਾਈਟ ਕਿਸ ਲਈ ਹੈ',
  'home.memorialLine': 'ਜਿਨ੍ਹਾਂ ਨੇ ਜੀਵਨ ਭਰ ਸਮਾਜ ਲਈ ਲੜਾਈ ਲੜੀ, ਅਤੇ ਆਖ਼ਰ ਵਿੱਚ ਆਪਣਾ ਹਿੱਸਾ ਨਹੀਂ ਮਿਲਿਆ।',
  'home.memorialMore': 'ਉਸਦੀ ਪੂਰੀ ਕਹਾਣੀ ਪੜ੍ਹੋ',
  'home.kundaliTitle': 'ਜਨਮ ਗੰਠ',
  'home.kundaliNote': 'ਪੂਰੀ ਕੁੰਡਲੀ — ਨੌ ਗ੍ਰਹ, ਵਿਮਸ਼ੋਤਤਰੀ ਦਸ਼ਾ, ਫਲਾਦੇਸ਼, ਯੋਗ, ਸ਼ੋਡਸ਼ਵਰਗ, ਕੇਪੀ, ਲਾਲ ਕਿਤਾਬ ਅਤੇ ਅੰਕ ਜੋਤਿਸ਼. ਸਭ ਤੁਹਾਡੇ ਫੋਨ ਉੱਤੇ ਹੀ ਗਿਣਤੀ ਹੋਵੇਗਾ.',
  'home.chooseTopicNote': 'ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਸ਼ੇ \'ਤੇ ਟੈਪ ਕਰੋ। ਹਰ ਥਾਂ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।',

  'home.categoryEmpty': 'ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਹਾਲੇ ਕੁਝ ਵੀ ਨਹੀਂ ਲਿਖਿਆ ਗਿਆ।',

  'home.soundIntro': 'ਕੋਈ ਫ਼ੀਸ ਨਹੀਂ, ਕੋਈ ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ। ਸਿਰਫ਼ ਮਨ ਸ਼ਾਂਤ ਕਰਨ ਲਈ।',
  'home.emergencyTitle': 'ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?',
  'home.emergencyNote': 'ਇਹ ਪਹਿਲਾਂ ਪੜ੍ਹੋ। ਬਾਕੀ ਸਭ ਬਾਅਦ ਵਿੱਚ ਵੇਖ ਸਕਦੇ ਹਾਂ।',

  'home.dedication1': 'ਸ਼ਰਧਾਂਜਲੀ ਵਿੱਚ — ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਸੇਵਾ।',

  'home.dedication2': 'ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ ਜਾਂ ਬੋਲੋ।',

  'ref.title': 'ਇਹ ਸੇਵਾ ਕੀ ਹੈ, ਅਤੇ ਕਿਸ ਲਈ ਹੈ',

  'ref.intro': 'ਇਹ ਸੇਵਾ ਸ੍ਰੀਮਤੀ VARSHA ਜੀ ਦੀ ਸ਼ਰਾਣੀ ਵਿੱਚ ਬਣਾਈ ਗਈ ਹੈ। ਇੱਥੇ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਦੱਸਿਆ ਗਿਆ ਹੈ ਕਿ ਇਹ ਕੀ ਕਰਦੀ ਹੈ, ਇਸ ਵਿੱਚ ਕੀ ਹੈ, ਅਤੇ ਇਸ ਦੀਆਂ ਹੱਦਾਂ ਕੀ ਹਨ। ਸਭ ਕੁਝ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ — ਪੈਸੇ ਨਹੀਂ ਲਿਏ ਜਾਂਦੇ, ਜਾਹੇਰਾਤ ਨਹੀਂ ਵਿਖਾਈ ਜਾਂਦੀ, ਅਤੇ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗੀ ਜਾਂਦੀ।',

  'ref.whatTitle': 'ਇਸ ਵਿੱਚ ਕੀ ਹੈ',

  'ref.what1': 'ਘਰ ਵਿੱਚ ਅੱਗ, ਬਿਜਲੀ ਚਲੀ ਜਾਣਾ, ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਕਮਜ਼ੋਰੀ, ਮਾਂ-ਬਾਪ ਦੀ ਸੰਭਾਲ — ਇਸ ਤਰ੍ਹਾਂ ਦੇ ਆਮ ਸਮੱਸਿਆਵਾਂ ਦੇ ਸੌਖੇ ਹੱਲ, ਸਾਫ਼-ਸੁਥਰੀ ਭਾਸ਼ਾ ਵਿੱਚ।',

  'ref.what2': 'ਸਵਾਲ ਬੋਲ ਕੇ ਪੁੱਛਣ ਦੀ ਸਹੂਲਤ। ਬੋਲ ਨਾ ਸਕੋ ਤਾਂ ਲਿਖੋ — ਦੋਹਾਂ ਦਾ ਜਵਾਬ ਇੱਕ ਜਿਹੜਾ ਮਿਲਦਾ ਹੈ।',

  'ref.what3': 'ਹਰ ਸਵਾਲ ਦਰਜ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਜੋ ਦੂਜਿਆਂ ਨੂੰ ਪਰੇਸ਼ਾਨ ਕਰਦਾ ਹੈ ਉਹ ਤੁਹਾਡੇ ਤੋਂ ਪਹਿਲਾਂ ਹੀ ਪੁੱਛਿਆ ਜਾ ਚੁਕਾ ਹੋਵੇਗਾ ਅਤੇ ਉਸ ਦਾ ਜਵਾਬ ਮਿਲ ਜਾਵੇਗਾ।',

  'ref.what4': 'ਕੋਈ ਜਾਹੇਰਾਤ ਨਹੀਂ, ਕੋਈ ਅਨਾਵਸ਼ਯਕ ਜਾਣਕਾਰੀ ਨਹੀਂ, ਅਤੇ ਕੋਈ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗੀ ਜਾਂਦੀ। ਸਭ ਕੁਝ ਮੁਫ਼ਤ।',

  'ref.statsArticles': 'ਲੇਖ ਲਿਖੇ ਗਏ ਹਨ',

  'ref.statsCategories': 'ਵਿਸ਼ੇ ਉਪਲਬਧ ਹਨ',

  'ref.statsQuestions': 'ਸਵਾਲ ਪੁੱਛੇ ਗਏ ਹਨ',

  'ref.adminTitle': 'ਪ੍ਰਬੰਧਕ ਕੀ ਕਰ ਸਕਦੇ ਹਨ',

  'ref.adminBody': 'ਤੁਸੀਂ ਭੇਜੀਆਂ ਲੇਖ ਪ੍ਰਬੰਧਕ ਵੇਖ ਸਕਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਜਵਾਬ ਲਿਖ ਸਕਦੇ ਹਨ। ਤੁਹਾਡੀ ਇਜਾਜ਼ਤ ਬਿਨਾਂ ਉਹ ਕੋਈ ਲੇਖ ਬਦਲ ਜਾਂ ਮਿਟਾ ਨਹੀਂ ਸਕਦੇ, ਅਤੇ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਕਿਸੇ ਨੂੰ ਨਹੀਂ ਵੇਚ ਸਕਦੇ।',

  'ref.dataTitle': 'ਤੁਹਾਡੇ ਬਾਰੇ ਅਸੀਂ ਕੀ ਰੱਖਦੇ ਹਾਂ',

  'ref.dataBody': 'ਸਿਰਫ਼ ਤੁਹਾਡਾ ਪੁੱਛਿਆ ਸਵਾਲ, ਉਸ ਦਾ ਸਾਰ ਅਤੇ ਪੁੱਛਣ ਦਾ ਸਮਾਂ — ਤਾਂ ਜੋ ਜਵਾਬ ਅਸੀਂ ਵਾਰ-ਵਾਰ ਨਾ ਦਿਵੇਂ। ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ, ਫੋਨ ਨੰਬਰ ਜਾਂ ਪਛਾਣ ਦੱਸਣ ਵਾਲੀ ਕੋਈ ਜਾਣਕਾਰੀ ਨਹੀਂ ਲਈ ਜਾਂਦੀ। ਸਾਈਟ \'ਤੇ ਕੋਈ ਜਾਹੇਰਾਤ ਜਾਂ ਟ੍ਰੈਕਿੰਗ ਸਕ੍ਰਿਪਟ ਨਹੀਂ ਲੱਗੀ ਹੈ।',

  'ref.helplineTitle': 'ਤੁਰੰਤ ਮਦਦ ਲਈ ਇਹ ਨੰਬਰ ਰੱਖੋ',

  'ref.helpline1': 'ਕੋਈ ਵੱਡਾ ਖ਼ਤਰਾ ਹੋਵੇ — ਅੱਗ, ਬਿਜਲੀ ਦਾ ਤੇਜ਼ ਝਟਕਾ, ਗਿਰਨਾ ਜਾਂ ਬਹੁਤ ਜ਼ਿਆਦਾ ਖੂਨ — ਤਾਂ 112 \'ਤੇ ਫ਼ੋਨ ਕਰੋ।',

  'ref.helpline2': 'ਕਿਸੇ ਨੂੰ ਬਿਮਾਰੀ ਹੋਵੇ ਜਾਂ ਚੋਟ ਲੱਗੀ ਹੋਵੇ ਅਤੇ ਜਾਣ ਦੀ ਕੋਈ ਵਾਹਨ ਨਾ ਹੋਵੇ, ਤਾਂ 108 \'ਤੇ ਐਂਬੂਲੈਂਸ ਮੰਗਵਾਓ।',

  'ref.helpline3': 'ਔਰਤ ਨਾਲ ਕੁਝ ਬੁਰਾ ਹੋਇਆ ਹੋਵੇ, ਜਾਂ ਔਰਤ ਨੂੰ ਕਿਸੇ ਥੇ ਪਰੇਸ਼ਾਨ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੋਵੇ, ਤਾਂ 181 \'ਤੇ ਫ਼ੋਨ ਕਰੋ। ਇਹ ਮੁਫ਼ਤ ਹੈ।',

  'ref.helpline4': 'ਬੱਚੇ ਜਾਂ ਬਜ਼ੁਰਗ ਨਾਲ ਕੋਈ ਹੋਰ ਹੋਇਆ ਹੋਵੇ, ਤਾਂ 1098 \'ਤੇ ਸ਼ਿਕਾਇਤ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।',

  'ref.helpline5': 'ਮਾਨਸਿਕ ਤਣਾਵ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੋਵੇ, ਜਾਂ ਜੀਣ ਦਾ ਮਨ ਨਾ ਕਰੇ, ਤਾਂ 14416 \'ਤੇ ਗੱਲ ਕਰਨ ਲਈ ਜਾ ਸਕਦੇ ਹਾਂ।',

  'ref.ownerNote': 'ਇਹ ਸੇਵਾ ਕਿਸੇ ਕੰਪਨੀ ਦੀ ਨਹੀਂ, ਸਰਕਾਰ ਦੀ ਨਹੀਂ, ਸਗੋਂ ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਸ਼ਰਾਣੀ ਵਿੱਚ ਚੱਲ ਰਹੀ ਹੈ। ਇਸ ਲਈ ਇੱਥੇ ਕੋਈ ਜਾਹੇਰਾਤ ਨਹੀਂ, ਕੋਈ ਮੈਂਬਰਸ਼ਿਪ ਨਹੀਂ, ਅਤੇ ਕੋਈ ਪੈਸੇ ਨਹੀਂ ਲਿਏ ਜਾਂਦੇ।',

  'support.title': 'ਇਹ ਸੇਵਾ ਮੁਫ਼ਤ ਹੈ',

  'support.intro': 'ਇਹ ਸੇਵਾ ਕਿਸੇ ਤੋਂ ਪੈਸੇ ਨਹੀਂ ਲੈਂਦੀ। ਪਰ ਇਹ ਚੱਲਦੀ ਹੈ — ਇਸ ਲਈ ਕੁਝ ਰਾਹਤਾਂ ਹਨ ਜਿਨ੍ਹਾਂ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ। ਸਭ ਤੋਂ ਸੌਖੀ ਰਾਹਤ ਹੀ ਸਭ ਤੋਂ ਕਾਮ ਦੀ ਹੈ।',

  'support.contactTitle': 'ਕੁਝ ਦੱਸਣਾ ਹੈ?',

  'support.contactBody': 'ਕਿਸੇ ਵੀ ਗੱਲ ਲਈ ਇੱਥੇ ਲਿਖ ਸਕਦੇ ਹੋ — ਕੋਈ ਗ਼ਲਤੀ ਹੋਵੇ, ਕੁਝ ਵੱਧ ਮਿਲੇ, ਜਾਂ ਕੋਈ ਸਵਾਲ ਹੋਵੇ। ਜਿੰਨੀ ਲਿਖਣਾ ਸੌਖਾ ਲੱਗੇ, ਉੰਨੀ ਹੀ ਲਿਖੋ।',

  'support.faqTitle': 'ਕੁਝ ਗੱਲਾਂ ਜੋ ਵਾਰ-ਵਾਰ ਪੁੱਛੀਆਂ ਜਾਂਦੀਆਂ ਹਨ',

  'support.faqBody': 'ਕੀ ਇਹ ਸੱਚ ਵਿੱਚ ਮੁਫ਼ਤ ਹੈ? ਹਾਂ। ਤੁਹਾਡਾ ਨਾਮ ਲਿਆ ਜਾਂਦਾ ਹੈ? ਨਹੀਂ, ਨਾਮ ਦੇਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ। ਜਾਹੇਰਾਤ ਆਉਂਦੇ ਹਨ? ਨਹੀਂ। ਫੋਨ ਨੰਬਰ ਜਾਂ ਪਤਾ ਤਾਂ ਨਹੀਂ ਮੰਗਿਆ ਜਾਂਦਾ? ਨਹੀਂ। ਕੋਈ ਐਪ ਡਾਊਨਲੋਡ ਕਰਨੀ ਪਵੇ? ਨਹੀਂ, ਸਿਰਫ਼ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਖੁੱਲ ਜਾਂਦਾ ਹੈ।',

  'support.waysTitle': 'ਤੁਸੀਂ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ',

  'support.way1Title': 'ਆਪਣਾ ਅਨੁਭਵ ਲਿਖੋ',

  'support.way1Body': 'ਜੇ ਇਸ ਸਾਈਟ ਤੋਂ ਤੁਹਾਨੂੰ ਕੁਝ ਚੰਗਾ ਲੱਗਿਆ ਹੋਵੇ — ਜਾਂ ਅਜਿਹਾ ਕੁਝ ਮਿਲਿਆ ਹੋਵੇ ਜਿਸ ਨੇ ਤੁਹਾਨੂੰ ਉਲਝਾਣ ਵਿੱਚ ਪਾਓ — ਤਾਂ ਰਾਏ ਪੰਨੇ ਤੇ ਲਿਖ ਦਿਓ। ਤੁਹਾਡਾ ਨਾਮ ਲੈਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ।',

  'support.way2Title': 'ਆਪਣੇ ਸ਼ਹਿਰ ਬਾਰੇ ਦੱਸੋ',

  'support.way2Body': 'ਤੁਸੀਂ ਜਿੱਥੇ ਰਹਿੰਦੇ ਹੋ ਉੱਥੇ ਦੀ ਭਾਸ਼ਾ, ਰੀਤ-ਰਿਵਾਜ ਅਤੇ ਮੁਸ਼ਕਿਲਾਂ ਵੱਖਰੀਆਂ ਹੁੰਦੀਆਂ ਹਨ। ਜੇ ਤੁਹਾਡੇ ਇੱਥੇ ਕੁਝ ਗੱਲ ਇੱਥੇ ਨਹੀਂ ਹੈ, ਤਾਂ ਦੱਸੋ — ਜੋ ਜੋੜਿਆ ਜਾ ਸਕੇ ਉਹ ਜੋੜ ਦਿੱਤਾ ਜਾਵੇਗਾ।',

  'support.way3Title': 'ਆਪਣਾ ਅਨੁਭਵ ਕਿਸੇ ਹੋਰ ਨੂੰ ਸੁਣਾਓ',

  'support.way3Body': 'ਇੱਥੇ ਲਿਖਿਆ ਬਹੁਤ ਸਾਰਿਆਂ ਦੇ ਕੰਮ ਆ ਸਕਦਾ ਹੈ, ਜੇ ਉਨ੍ਹਾਂ ਨੂੰ ਪਤਾ ਹੋਵੇ। ਕਿਸੇ ਅਜਿਹੇ ਵਿਅਕਤੀ ਨੂੰ ਦੱਸੋ ਜੋ ਇਹ ਸੱਚ ਵਿੱਚ ਮਦਦ ਕਰੇ।',

  'support.way4Title': 'ਇੱਥੇ ਆ ਕੇ ਵੇਖੋ',

  'support.way4Body': 'ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਸਮਾਂ ਹੈ, ਤਾਂ ਖੁਦ ਆ ਕੇ ਵੇਖੋ ਕਿ ਇਹ ਸਾਈਟ ਠੀਕ ਤਰ੍ਹਾਂ ਚੱਲ ਰਹੀ ਹੈ ਜਾਂ ਨਹੀਂ। ਕੁਝ ਬਿਗੜਿਆ ਦਿਸੇ ਤਾਂ ਦੱਸੋ — ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਵਿੱਚ ਠੀਕ ਹੋ ਜਾਵੇਗਾ।',

  'reviews.pageTitle': 'ਤੁਹਾਡੀ ਰਾਏ',

  'reviews.pageIntro': 'ਇੱਥੇ ਉਹੀ ਲਿਖਿਆ ਹੈ ਜੋ ਲੋਕਾਂ ਨੇ ਲਿਖਿਆ ਹੈ। ਕੋਈ ਰਾਏ ਲੁਕਾਈ ਨਹੀਂ ਜਾਂਦੀ, ਅਤੇ ਜੋ ਲਿਖਿਆ ਹੈ ਉਹ ਇੱਥੇ ਹੀ ਦਿਸਦਾ ਹੈ — ਬਸ ਇੱਕ ਵਾਰ ਵੇਖ ਲਣ ਤੋਂ ਬਾਅਦ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।',

  'reviews.intro': 'ਕੀ ਇਹ ਸੇਵਾ ਤੁਹਾਡੇ ਕੰਮ ਆਈ? ਆਪਣੀ ਗੱਲ ਲਿਖੋ — ਤੁਹਾਡਾ ਨਾਮ ਲੈਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ।',

  'reviews.write': 'ਆਪਣੀ ਰਾਏ ਲਿਖੋ',

  'reviews.starsLabel': '5 ਵਿੱਚੋਂ {value} ਤਾਰੇ',

  'reviews.summaryTitle': 'ਆਮ ਰਾਏ',

  'reviews.summaryLine': 'ਲੋਕਾਂ ਨੇ ਔਸਤਨ {rating} ਵਿੱਚੋਂ 5 ਵਿੱਚੋਂ {count} ਤਾਰੇ ਦਿੱਤੇ।',

  'reviews.count': 'ਸਮੀਖਿਆਵਾਂ',

  'reviews.name': 'ਤੁਹਾਡਾ ਨਾਮ (ਜ਼ਰੂਰੀ ਨਹੀਂ)',

  'reviews.city': 'ਤੁਹਾਡਾ ਸ਼ਹਿਰ (ਜ਼ਰੂਰੀ ਨਹੀਂ)',

  'reviews.comment': 'ਤੁਹਾਡੀ ਗੱਲ',

  'reviews.placeholder': 'ਜੋ ਮਨ ਵਿੱਚ ਆਇਆ ਵਿਹ ਲਿਖੋ — ਕੁਝ ਠੀਕ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਨਹੀਂ।',

  'reviews.keepLabel': 'ਬੁਰਾ ਲੱਗੇ ਤਾਂ ਠੀਕ ਲੱਗੇ ਤਾਂ — ਦੋਹੋਂ ਲਿਖੋ',

  'reviews.fieldTooShort': 'ਘੱਟੋ-ਘੱਟ 10 ਅੱਖਰ ਲਿਖੋ।',

  'reviews.rateLimited': 'ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ। ਥੋੜ੍ਹਾ ਠੁੱਕ ਕੇ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',

  'reviews.sending': 'ਭੇਜ ਰਹੇ ਹਾਂ…',

  'reviews.moderated': 'ਤੁਹਾਡੀ ਸਮੀਖਿਆ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਵਾਰ ਵੇਖੀ ਜਾਂਦੀ ਹੈ।',

  'reviews.moderationNote': 'ਸਭ ਕੁਝ ਮਿਟਾਉਣ ਤੋਂ ਬਚਣ ਲਈ, ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹਰ ਸਮੀਖਿਆ ਇੱਕ ਵਾਰ ਵੇਖੀ ਜਾਂਦੀ ਹੈ। ਗਾਲੀ, ਨੰਬਰ ਜਾਂ ਨਿੱਜੀ ਗੱਲਾਂ ਹਟਾ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ — ਬਾਕੀ ਸਭ ਜਿਵੇਂ ਦੀ ਤਰ੍ਹਾਂ ਪ੍ਰਕਾਸ਼ਿਤ ਹੁੰਦਾ ਹੈ।',

  'reviews.replyLabel': 'ਇਸ ਤੇ ਲਿਖਿਆ ਗਿਆ ਹੈ',

  'reviews.ownerReply': 'ਜਵਾਬ',

  'reviews.empty': 'ਹਾਲੇ ਕੋਈ ਸਮੀਖਿਆ ਨਹੀਂ। ਪਹਿਲੀ ਤੁਸੀਂ ਲਿਖੋ।',

  'reviews.anonymous': 'ਬਿਨਾਂ ਨਾਮ ਦੇ',

  'reviews.toastSent': 'ਧੰਨਵਾਦ',

  'reviews.toastFailed': 'ਰਾਏ ਨਹੀਂ ਭੇਜੀ ਜਾ ਸਕੀ',

  'health.band.infant.note': 'ਨ੹ਟੇ ਬੱਚੇ, ਜੋ ਹਾਲੇ ਆਪਣੀ ਗੱਲ ਨਹੀਂ ਕਰ ਸਕਦੇ',

  'health.band.child.note': 'ਬੱਚੇ ਜੋ ਬੋਲ ਸਕਦੇ ਹਨ, ਪਰ ਸਵਾਲ ਪੁੱਛਣ ਤੋਂ ਡਰਦੇ ਹਨ',

  'health.band.teen.note': 'ਕਿਸ਼ੋਰ, ਜਿਨ੍ਹਾਂ ਨੂੰ ਆਮ ਤੌਰ \'ਤੇ ਇਹਨਾਂ ਦੀ ਗੱਲ ਕੋਈ ਨਹੀਂ ਮਿਲਦਾ ਜੋ ਸੁਣੇ',

  'health.band.young.note': 'ਨੌਕਰੀ, ਪੈਸਾ ਅਤੇ ਨੀਂਦ — ਤਿੰਨਾਂ ਦਾ ਇਕੱਠਾ ਬੋਝ',

  'health.band.middle.note': 'ਘਰ, ਬੱਚੇ ਅਤੇ ਆਪਣੀ ਸਿਹਤ — ਸਭ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਇਕੱਠੇ',

  'health.band.later.note': 'ਸਰੀਰ ਦੀ ਉਮਰ ਅਤੇ ਉਸਦੀ ਸੰਭਾਲ — ਦੋਵੇਂ ਇਕੱਠੇ',

  'health.band.senior.note': 'ਦਵਾ, ਸੰਤੁਲਨ ਅਤੇ ਤਨਹਾਰੀ — ਤਿੰਨਾਂ ਇਕੱਠੇ',

  'health.band.elder.note': 'ਹਰ ਦਵਾ ਦੀ ਜਾਂਚ ਜ਼ਰੂਰੀ, ਹਰ ਗਿਰਨਾ ਗੰਭੀਰ',

  'health.c.infant1': 'ਤੇਜ਼ ਬੁਖਾਰ',

  'health.c.infant2': 'ਨਹੀਂ ਖਾ ਰਿਹਾ',

  'health.c.infant3': 'ਉਲਟੀ ਹੋ ਰਹੀ',

  'health.c.infant4': 'ਪੇਟ ਖਰਾਬ ਹੈ',

  'health.c.child1': 'ਪੜ੍ਹਾਈ ਵਿੱਚ ਮਨ ਨਹੀਂ',

  'health.c.child2': 'ਸਕੂਲ ਨਹੀਂ ਜਾਂਦਾ',

  'health.c.child3': 'ਰਾਤ ਨੂੰ ਬੁਖਾਰ',

  'health.c.child4': 'ਦੰਦ ਟੁੱਟ ਰਹੇ',

  'health.c.teen1': 'ਪੜ੍ਹਾਈ ਦਾ ਦਬਾਅ',

  'health.c.teen2': 'ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ',

  'health.c.teen3': 'ਮੋਬਾਈਲ ਦੀ ਆਦਤ',

  'health.c.teen4': 'ਬਹੁਤ ਉਦਾਸ',

  'health.c.young1': 'ਕੰਮ ਦਾ ਤਣਾਵ',

  'health.c.young2': 'ਬੈਠਣ ਨਾਲ ਪਿੱਠ ਦਰਦ',

  'health.c.young3': 'ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ',

  'health.c.young4': 'ਪੈਸੇ ਘੱਟ',

  'health.c.middle1': 'ਕਮਰ ਵਿੱਚ ਦਰਦ',

  'health.c.middle2': 'ਨੀਂਦ ਠੀਕ ਨਹੀਂ',

  'health.c.middle3': 'ਘਰ ਦਾ ਤਣਾਵ',

  'health.c.middle4': 'ਪੇਟ ਵਿੱਚ ਗੈਸ',

  'health.c.later1': 'ਪਿੱਠ ਵਿੱਚ ਦਰਦ',

  'health.c.later2': 'ਗੁੱਥੇ ਵਿੱਚ ਦਰਦ',

  'health.c.later3': 'ਰਾਤ ਨੂੰ ਪੈਰ ਵਿੱਚ ਐਂਠਣ',

  'health.c.later4': 'ਸਵੇਰੇ ਜਕੜਨ',

  'health.c.senior1': 'ਚੱਲਣ ਵਿੱਚ ਤਕਲੀਫ਼',

  'health.c.senior2': 'ਦਵਾ ਦੀ ਜਾਂਚ',

  'health.c.senior3': 'ਰਾਤ ਨੂੰ ਪੇਸ਼ਾਬ',

  'health.c.senior4': 'ਘੱਟ ਸੁਣਾਈ ਦਿੰਦਾ',

  'health.c.elder1': 'ਡਿਗਣ ਦਾ ਡਰ',

  'health.c.elder2': 'ਯਾਦਦਾਸ਼ਤ ਕਮਜ਼ੋਰ',

  'health.c.elder3': 'ਰੋਜ਼ਾਨੀ ਦਰਦ-ਦਵਾ',

  'health.c.elder4': 'ਡਾਕਟਰ ਕਦੋਂ',

  'health.q.infant1': 'ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਬੁਖਾਰ ਹੈ, ਦੁੱਧ ਪਾਉਂ?',

  'health.q.infant2': 'ਛੋਟਾ ਬੱਚਾ ਖਾ ਨਹੀਂ ਰਿਹਾ, ਕੀ ਕਰੂਂ?',

  'health.q.infant3': 'ਬੱਚੇ ਨੂੰ ਉਲਟੀ ਹੋ ਰਹੀ ਹੈ, ਡਾਕਟਰ ਨੂੰ ਕਦੋਂ ਦਿਖਾਊਂ?',

  'health.q.infant4': 'ਬੱਚੇ ਨੂੰ ਪੇਟ ਖਰਾਬ ਹੈ, ਕੀ ਖਿਲਾਊਂ?',

  'health.q.child1': 'ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਵਿੱਚ ਮਨ ਨਹੀਂ ਲੱਗਦਾ, ਕੀ ਕਰੂਂ?',

  'health.q.child2': 'ਬੱਚਾ ਰੋਜ਼ ਸਕੂਲ ਜਾਣ ਤੋਂ ਮਨਾ ਕਰਦਾ ਹੈ, ਕਾਰਨ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?',

  'health.q.child3': 'ਬੱਚੇ ਨੂੰ ਰਾਤ ਨੂੰ ਬੁਖਾਰ ਆਉਂਦਾ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.child4': 'ਬੱਚੇ ਦੇ ਦੰਦ ਟੁੱਟ ਰਹੇ ਹਨ, ਦੰਦਾਂ ਦੀ ਸੰਭਾਲ ਕਿਵੇਂ ਕਰੂਂ?',

  'health.q.teen1': 'ਪੜ੍ਹਾਈ ਦਾ ਬਹੁਤ ਦਬਾਅ ਹੈ, ਇਸ ਨਾਲ ਕਿਵੇਂ ਜੁਣਾਂ?',

  'health.q.teen2': 'ਰਾਤ ਨੂੰ ਨੀਂਦ ਠੀਕ ਨਹੀਂ ਆਉਂਦੀ, ਕੀ ਕਰੂਂ?',

  'health.q.teen3': 'ਮੋਬਾਈਲ ਦੀ ਆਦਤ ਲੱਗ ਗਈ ਹੈ, ਛੱਡਣ ਦਾ ਤਰੀਕਾ ਦੱਸੋ।',

  'health.q.teen4': 'ਬਹੁਤ ਉਦਾਸੀ ਹੁੰਦੀ ਹੈ, ਕਿਸ ਨਾਲ ਗੱਲ ਕਰੂਂ?',

  'health.q.young1': 'ਕੰਮ ਦਾ ਤਣਾਵ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ, ਕਿਵੇਂ ਘਟਾਊਂ?',

  'health.q.young2': 'ਬੈਠੇ ਰਹਿੰਦੇ ਪਿੱਠ ਵਿੱਚ ਦਰਦ ਹੁੰਦਾ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.young3': 'ਰਾਤ ਨੂੰ ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ, ਕੀ ਉਪਾਅ ਹੈ?',

  'health.q.young4': 'ਪੈਸੇ ਘੱਟ ਹਨ ਅਤੇ ਖਰਚ ਵੱਧ, ਕੀ ਕਰੂਂ?',

  'health.q.middle1': 'ਕਮਰ ਵਿੱਚ ਦਰਦ ਹੁੰਦਾ ਹੈ, ਕਾਰਨ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?',

  'health.q.middle2': 'ਨੀਂਦ ਚੰਗੀ ਨਹੀਂ ਆ ਰਹੀ, ਸੁਧਾਰਨ ਲਈ ਕੀ ਕਰੂਂ?',

  'health.q.middle3': 'ਘਰ ਦਾ ਤਣਾਵ ਬਹੁਤ ਹੈ, ਬੱਚਿਆਂ ਨੂੰ ਕਿਵੇਂ ਸੰਭਾਲੂਂ?',

  'health.q.middle4': 'ਕੰਮ \'ਤੇ ਕਈ ਸਾਲਾਂ ਤੋਂ ਪੇਟ ਵਿੱਚ ਗੈਸ ਦੀ ਸਮੱਸਿਆ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.later1': 'ਮੇਰੀ ਉਮਰ 54 ਸਾਲ ਹੈ ਅਤੇ ਪਿੱਠ ਵਿੱਚ ਦਰਦ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.later2': 'ਚੜ੍ਹਨ ਤੇ ਗੁੱਥੇ ਵਿੱਚ ਦਰਦ ਹੁੰਦਾ ਹੈ, ਕਿਉਂ?',

  'health.q.later3': 'ਰਾਤ ਨੂੰ ਪੈਰ ਵਿੱਚ ਐਂਠਣ ਹੁੰਦੀ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.later4': 'ਸਵੇਰੇ ਉੱਠ ਕੇ ਕਮਰ ਜਕੜਦੀ ਹੈ, ਕਾਰਨ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?',

  'health.q.senior1': 'ਘੂਟਣਾਂ ਵਿੱਚ ਇੰਨਾ ਦਰਦ ਹੈ ਕਿ ਚੱਲਣਾ ਔਖਾ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.senior2': 'ਕਈ ਦਵਾਇਆਂ ਰੋਜ਼ ਖਾਣੀਆਂ ਪੈਂਦੀਆਂ ਹਨ — ਕਿਉਂਕਿ ਹਾਨੀਕਾਰਕ ਹੈ ਕਿਵੇਂ ਪਤਾ ਲੱਗੇਗਾ?',

  'health.q.senior3': 'ਰਾਤ ਨੂੰ ਵਾਰ-ਵਾਰ ਪੇਸ਼ਾਬ ਦੀ ਦਿਕ਼ਕਤ ਹੈ, ਕੀ ਕਰੂਂ?',

  'health.q.senior4': 'ਕਮ ਸੁਣਾਈ ਦਿੰਦਾ ਹੈ, ਸੁਣਨ ਦਾ ਕੋਈ ਉਪਾਅ ਦੱਸੋ।',

  'health.q.elder1': 'ਘਰ ਵਿੱਚ ਡਿਗੱਗਣ ਦਾ ਡਰ ਹੈ, ਕਿਹੜੀ ਸੁਰੱਖਿਆ ਰੱਖਾਂ?',

  'health.q.elder2': 'ਯਾਦਦਾਸ਼ਤ ਕਮਜ਼ੋਰ ਹੋ ਰਹੀ ਹੈ, ਕੀ ਉਪਾਅ ਹੈ?',

  'health.q.elder3': 'ਰੋਜ਼ਾਨੀ ਦਰਦ ਦੀ ਦਵਾ ਖਾਣੀ ਪੈਂਦੀ ਹੈ — ਇਸ ਦਾ ਕੋਈ ਨੁਕਸਾਨ ਹੈ?',

  'health.q.elder4': 'ਕਦੋਂ ਡਾਕਟਰ ਕੋਲ ਜਾਣਾ ਜ਼ਰੂਰੀ ਹੈ?',

  'support.contactMessageLabel': 'ਤੁਹਾਡੀ ਗੱਲ',

  'support.contactPlaceholder': 'ਜੋ ਲਿਖਣਾ ਹੈ ਉਹੀ ਲਿਖੋ — ਗ਼ਲਤੀ ਹੋਵੇ, ਕੁਝ ਚੰਗਾ ਮਿਲੇ, ਜਾਂ ਕੋਈ ਸਵਾਲ ਹੋਵੇ।',

  'support.contactHelp': 'ਘੱਟੋ-ਘੱਟ 10 ਅੱਖਰ। ਇਹ ਸਿੱਧਾ ਮਾਲਕ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ।',

  'support.contactSubmit': 'ਭੇਜੋ',

  'support.contactSending': 'ਭੇਜ ਰਹੇ ਹਾਂ…',

  'support.contactPrivacy': 'ਤੁਹਾਡਾ ਨਾਮ ਲਿਖਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ।',

  'support.contactSent': 'ਪਹੁੰਚ ਗਿਆ',

  'support.contactSentBody': 'ਤੁਹਾਡੀ ਗੱਲ ਮਾਲਕ ਤੱਕ ਪਹੁੰਚ ਗਈ ਹੈ।',

  'support.contactFailed': 'ਨਹੀਂ ਭੇਜਿਆ ਜਾ ਸਕਾ',

  'support.faq1Q': 'ਕੀ ਇਹ ਸੱਚ ਵਿੱਚ ਮੁਫ਼ਤ ਹੈ?',

  'support.faq1A': 'ਹਾਂ। ਕੋਈ ਪੈਸੇ ਨਹੀਂ ਲਿਏ ਜਾਂਦੇ, ਕੋਈ ਜਾਹੇਰਾਤ ਨਹੀਂ ਦਿਸਾਉਂਦੀ, ਅਤੇ ਕੋਈ ਮੈਂਬਰਸ਼ਿਪ ਨਹੀਂ ਲਈ ਜਾਂਦੀ। ਇਹ ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਪੈਸਿਆਂ ਨਾਲ ਚੱਲਦੀ ਹੈ, ਕੰਪਨੀ ਜਾਂ ਸਰਕਾਰ ਦੇ ਨਹੀਂ।',

  'support.faq2Q': 'ਕੀ ਮੇਰਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫੋਨ ਨੰਬਰ ਲਿਆ ਜਾਂਦਾ ਹੈ?',

  'support.faq2A': 'ਨਹੀਂ, ਅਤੇ ਲਿਆ ਵੀ ਨਹੀਂ ਜਾਵੇਗਾ। ਇਹ ਸਾਈਟ ਆਪਣੇ ਆਪ ਕੋਈ ਪਛਾਣ ਨਹੀਂ ਬਣਾਉਂਦੀ — ਕੋਈ ਲੌਗਇਨ ਨਹੀਂ, ਕੋਈ ਟ੍ਰੈਕਿੰਗ ਸਕ੍ਰਿਪਟ ਨਹੀਂ। ਪੁੱਛਿਆ ਜਾਂਦਾ ਹੈ ਸਿਰਫ਼ ਤੁਹਾਡਾ ਸਵਾਲ ਹੈ ਅਤੇ ਉਹੀ ਸੰਭਾਲਿਆ ਜਾਂਦਾ ਹੈ।',

  'support.faq3Q': 'ਕੀ ਇਹ ਡਾਕਟਰ ਜਾਂ ਵਕੀਲ ਹੈ?',

  'support.faq3A': 'ਨਹੀਂ। ਇਹ ਦਵਾ ਜਾਂ ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ ਦਿੰਦੀ। ਜਿੱਥੇ ਗੱਲ ਗੰਭੀਰ ਹੁੰਦੀ ਹੈ, ਉੱਥੇ ਇਹ ਤੁਹਾਨੂੰ ਡਾਕਟਰ ਜਾਂ ਅਧਿਕਾਰੀ ਕੋਲ ਜਾਣ ਨੂੰ ਕਹਿੰਦੀ ਹੈ — ਉਹਨਾਂ ਦੀ ਥਾਂ ਇਹ ਨਹੀਂ ਲੈਂਦੀ।',

  'support.faq4Q': 'ਕੀ ਹਰ ਜਵਾਬ ਸਹੀ ਹੁੰਦਾ ਹੈ?',

  'support.faq4A': 'ਹਮੇਸ਼ਾ ਨਹੀਂ। ਜਵਾਬ ਕੰਪਿਊਟਰ ਲਿਖਦਾ ਹੈ, ਕੋਈ ਡਾਕਟਰ ਨਹੀਂ — ਇਸ ਲਈ ਹਰ ਜਵਾਬ ਦੇ ਨਾਲ ਲਿਖਿਆ ਹੁੰਦਾ ਹੈ ਕਿ ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ। ਕੋਈ ਵੀ ਦਵਾ ਸ਼ੁਰੂ ਜਾਂ ਬੰਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ।',

  'support.faq5Q': 'ਕੀ ਮੈਨੂੰ ਕੋਈ ਐਪ ਡਾਊਨਲੋਡ ਕਰਨੀ ਪਵੇਗੀ?',

  'support.faq5A': 'ਨਹੀਂ। ਇਹ ਸਿਰਫ਼ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਖੁੱਲਦੀ ਹੈ। ਕੋਈ ਐਪ ਇੰਸਟਾਲ ਨਹੀਂ, ਕੋਈ ਇਜਾਜ਼ਤ ਨਹੀਂ, ਕੋਈ ਅੱਪਡੇਟ ਨਹੀਂ।',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'ਘਰੇਲੂ ਇਲਾਜ',
  'remedy.title': 'ਆਯੁਰਵੇਦਿਕ ਘਰੇਲੂ ਇਲਾਜ',
  'remedy.intro': 'ਕੋਈ ਵੀ ਤਕਲੀਫ਼ ਹੋਵੇ — ਖੰਘ, ਸਿਰ ਦਰਦ, ਜੋੜਾਂ ਦਾ ਦਰਦ, ਖੁਰਕ, ਸ਼ੂਗਰ, ਪਿੱਠ ਦਰਦ — ਹੇਠਾਂ ਆਪਣੀ ਤਕਲੀਫ਼ ਚੁਣੋ ਜਾਂ ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਪੁੱਛੋ। ਘਰੇਲੂ ਕਾੜ੍ਹਾ, ਮਾਲਿਸ਼, ਖੁਰਾਕ ਅਤੇ ਆਯੁਰਵੇਦਿਕ ਉਪਾਅ ਦੱਸੇ ਜਾਣਗੇ।',
  'remedy.choose': 'ਆਪਣੀ ਤਕਲੀਫ਼ ਚੁਣੋ',
  'remedy.emergencyStrong': 'ਇਹ ਐਮਰਜੈਂਸੀ ਹਨ:',
  'remedy.emergency': 'ਸੱਪ ਦਾ ਡੰਗ, ਬਿੱਛੂ ਦਾ ਡੰਗ ਅਤੇ ਕੁੱਤੇ ਦਾ ਕੱਟਣਾ — ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ, ਪਹਿਲਾਂ 112 ’ਤੇ ਫੋਨ ਕਰੋ। ਘਰੇਲੂ ਉਪਾਅ ਸਿਰਫ਼ ਰਾਹ ਵਿੱਚ ਕਰਨ ਲਈ ਹਨ, ਹਸਪਤਾਲ ਦੀ ਥਾਂ ਨਹੀਂ।',
  'remedy.note': 'ਘਰੇਲੂ ਅਤੇ ਆਯੁਰਵੇਦਿਕ ਉਪਾਅ ਤਕਲੀਫ਼ ਘਟਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਨ; ਡਾਕਟਰ ਦੀ ਜਾਂਚ ਅਤੇ ਇਲਾਜ ਦੀ ਥਾਂ ਨਹੀਂ ਲੈਂਦੇ। ਕੋਈ ਦਵਾਈ ਆਪਣੇ ਆਪ ਬੰਦ ਜਾਂ ਸ਼ੁਰੂ ਨਾ ਕਰੋ।',
  'remedy.cough': 'ਖੰਘ',
  'remedy.headache': 'ਸਿਰ ਦਰਦ',
  'remedy.joints': 'ਜੋੜਾਂ ਦਾ ਦਰਦ',
  'remedy.itching': 'ਖੁਰਕ',
  'remedy.snake': 'ਸੱਪ ਦਾ ਡੰਗ',
  'remedy.scorpion': 'ਬਿੱਛੂ ਦਾ ਡੰਗ',
  'remedy.dog': 'ਕੁੱਤੇ ਦਾ ਕੱਟਣਾ',
  'remedy.diabetes': 'ਸ਼ੂਗਰ',
  'remedy.back': 'ਪਿੱਠ ਦਰਦ',
  'remedy.walking': 'ਤੁਰਨ ਵਿੱਚ ਤਕਲੀਫ਼',
  'home.remedyNote': 'ਕਾੜ੍ਹਾ, ਮਾਲਿਸ਼, ਖੁਰਾਕ ਅਤੇ ਆਯੁਰਵੇਦਿਕ ਉਪਾਅ — ਹਰ ਤਕਲੀਫ਼ ਲਈ, ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ।',
  'nav.aarti': 'ਆਰਤੀ ਤੇ ਭਜਨ',
  'aarti.title': 'ਆਰਤੀ ਤੇ ਭਜਨ — ਅਸਲੀ ਆਵਾਜ਼ ਵਿੱਚ',
  'aarti.intro': 'ਇੱਥੇ ਆਰਤੀ, ਕੀਰਤਨ ਤੇ ਭਜਨ ਸੁਣੋ — ਅਸਲੀ ਗਾਇਕਾਂ ਤੇ ਮੰਦਰਾਂ ਦੀ ਆਵਾਜ਼ ਵਿੱਚ। ਕੋਈ AI ਆਵਾਜ਼ ਨਹੀਂ।',
  'aarti.note': 'ਆਰਤੀ ਜਾਂ ਭਜਨ ਨੂੰ ਕੰਪਿਊਟਰ ਦੀ ਆਵਾਜ਼ ਵਿੱਚ ਚਲਾਉਣਾ ਉਸ ਦੀ ਚਾਲ ਤੇ ਭਗਤੀ ਗੁਆਉਣਾ ਹੈ। ਇਸ ਲਈ ਇੱਥੇ ਸਿਰਫ਼ ਅਸਲੀ ਰਿਕਾਰਡਿੰਗਾਂ ਹਨ।',
  'aarti.kindAarti': 'ਆਰਤੀ',
  'aarti.kindKirtan': 'ਕੀਰਤਨ',
  'aarti.kindBhajan': 'ਭਜਨ',
  'aarti.credit': 'ਰਿਕਾਰਡਿੰਗ:',
  'aarti.licence': 'ਲਾਇਸੈਂਸ:',
  'aarti.listenLink': 'ਅਸਲੀ ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ',
  'aarti.textChecked': 'ਇਹ ਰਵਾਇਤੀ ਪਾਠ ਹੈ, ਜਿਵੇਂ ਅਸਲ ਰਿਕਾਰਡਿੰਗ ਵਿੱਚ ਗਾਇਆ ਗਿਆ ਹੈ।',
  'aarti.textPrinted': 'ਇਹ ਪ੍ਰਚਲਿਤ ਪਾਠ ਹੈ, ਪ੍ਰਕਾਸ਼ਿਤ ਸੰਗ੍ਰਹਿਾਂ ਨਾਲ ਮਿਲਾ ਕੇ ਜਾਂਚਿਆ ਗਿਆ।',
  'aarti.textNotStored': 'ਇਸ ਗ੍ਰੰਥ ਦਾ ਪੂਰਾ ਪਾਠ ਇੱਥੇ ਸੰਭਾਲਿਆ ਨਹੀਂ ਗਿਆ — ਹੇਠਾਂ ਦਿੱਤੀ ਰਿਕਾਰਡਿੰਗ ਵਿੱਚ ਪੂਰਾ ਪਾਠ ਹੈ।',
  'aarti.granthTitle': 'ਗ੍ਰੰਥ, ਚਾਲੀਸਾ ਤੇ ਸ਼ਲੋਕ — ਅਸਲੀ ਆਵਾਜ਼ ਵਿੱਚ',
  'aarti.noRecording': 'ਇਸ ਆਰਤੀ ਦੀ ਅਸਲ ਰਿਕਾਰਡਿੰਗ ਹਾਲੇ ਸਾਈਟ ਉੱਤੇ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਇਸਨੂੰ ਗਾ ਕੇ ਨਹੀਂ ਸੁਣਾ ਸਕਦਾ — ਏਆਈ ਆਵਾਜ਼ ਵਿੱਚ ਆਰਤੀ ਕਦੇ ਨਹੀਂ ਗਾਈ ਜਾਂਦੀ।',
  'aarti.textOnlyTitle': 'ਹੋਰ ਆਰਤੀਆਂ — ਪਾਠ ਅਤੇ ਅਸਲੀ ਆਵਾਜ਼',
  'aarti.fullText': 'ਪੂਰਾ ਪਾਠ',
  'aarti.notChecked': 'ਇਸ ਆਰਤੀ ਦਾ ਜਾਂਚਿਆ ਪਾਠ ਹਾਲੇ ਸਾਈਟ ’ਤੇ ਨਹੀਂ। ਬਿਨਾਂ ਜਾਂਚਿਆ ਪਾਠ ਨਹੀਂ ਦਿੱਤਾ ਜਾਂਦਾ, ਕਿਉਂਕਿ ਅਰਦਾਸ ਵਿੱਚ ਗ਼ਲਤ ਸ਼ਬਦ ਸ਼ਬਦ ਨਾ ਹੋਣ ਨਾਲੋਂ ਵੀ ਮਾੜਾ ਹੈ।',
  'aarti.verifiedList': 'ਸਾਈਟ ’ਤੇ ਇਹਨਾਂ ਆਰਤੀਆਂ ਦੇ ਜਾਂਚੇ ਪਾਠ ਹਨ:',

};

const URDU: Record<string, string> = {
  'jgd.placeSearch': 'اپنے شہر کا نام لکھیں',
  'jgd.placeNoMatch': 'یہ شہر فہرست میں نہیں۔ قریب ترین شہر چنیں۔',

  'account.name': 'آپ کا نام',
  'account.namePlaceholder': 'مثلاً سیتا دیوی',
  'account.nameHint': 'یہ جاننے کے لیے کہ آپ کون ہیں۔ کوئی بھی نام چلے گا، اور یہ ضروری نہیں۔',

  'nav.home': 'ہوم', 'home.metaTitle': 'مفت حل، آپ کے اپنے الفاظ میں', 'nav.tribute': 'یادگار', 'nav.help': 'مدد', 'nav.reference': 'تعارف',
  'lib.licence.ccZero.name': 'CC0 / پبلک ڈومین',
  'lib.licence.pd.name': 'پبلک ڈومین',
  'lib.licence.govtIndia.name': 'ہندوستان حکومت',
  'lib.licence.creativeCommons.name': 'کری ایٹو کامنز (آمیختہ)',
  'lib.licence.freeToRead.name': 'پڑھنے کے لیے مفت',
  'lib.entry.ncert.title': 'NCERT کتابیں — جماعت 1 سے 12',
  'lib.entry.ncert.what': 'ہر موضوع کی ساری کتابیں، ہر جماعت کے لیے۔ لاگ اِن کے بغیر، براہ راست PDF۔',
  'lib.entry.ncert.langs': 'ہندی، انگریزی اور 30 سے زائد ہندوستانی زبانیں',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ڈیجیٹل کتبِ تعلیم',
  'lib.entry.pm-evidya.what': 'NCERT کتابوں کی ایپ، بڑے حروف میں پڑھا جا سکتا ہے۔ بول کر بھی سنایا جا سکتا ہے.',
  'lib.entry.pm-evidya.langs': 'ہندوستانی زبانیں',
  'lib.entry.diksha.title': 'DIKSHA — اساتذہ اور بچوں کے لیے',
  'lib.entry.diksha.what': 'اسباق، ویڈیو اور مشق — جماعت 1 سے 12.',
  'lib.entry.diksha.langs': 'ہندوستانی زبانیں',
  'lib.entry.khan-academy.title': 'Khan Academy — انگریزی میں ریاضی اور سائنس',
  'lib.entry.khan-academy.what': 'ہر جماعت تک ویڈیو اسباق، تحریری مواد بھی ہے.',
  'lib.entry.openstax.title': 'OpenStax — انگریزی میں مفت کتابیں',
  'lib.entry.openstax.what': 'کالج کی کتابیں — ریاضی، سائنس، انسانیات۔ ہر صفحے پر PDF۔',
  'lib.entry.nios.title': 'NIOS — دور تعلیم، مفت مواد',
  'lib.entry.nios.what': 'اوپن اور آن لائن کورسز کی مفت کتابیں، بلا داخلے.',
  'lib.entry.nios.langs': 'ہندی، انگریزی اور دیگر',
  'lib.entry.ignou.title': 'IGNOU — اعلیٰ تعلیم کے لیے مفت کتابیں',
  'lib.entry.ignou.what': 'دور تعلیم کی کتابیں، بالکل مفت.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — انگریزی کی پرانی کتابیں',
  'lib.entry.gutenberg.what': '70,000 سے زائد کتابیں، سب کا کاپی رائٹ ختم۔ مفت ای بک اور آڈیو۔',
  'lib.entry.pratham-books.title': 'Pratham Books — بچوں کی کتابیں',
  'lib.entry.pratham-books.what': 'ہندوستانی زبانوں میں بچوں کی کتابیں، بالکل مفت۔ جماعت 1 سے 5 کے لیے.',
  'lib.entry.pratham-books.langs': 'ہندی، مرارٹھی، بنگالی، تامل، تیلوگو اور دیگر',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — اخبار اور پرانی مجلے',
  'lib.entry.internet-archive-texts.what': 'لاکھوں پرانی کتابیں، مجلے اور اخبار — مفت.',
  'lib.entry.wikisource.title': 'Wikisource — مفت عوامی متون',
  'lib.entry.wikisource.what': 'کاپی رائٹ نہیں — یہ دنیا کی پرانی ادبی کتابیں ہیں.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ہر قسم کی تصاویر',
  'lib.entry.wikimedia-commons.what': 'جانور، نقشے، تاریخ — سب کچھ۔ ہر تصویر کا اپنا لائسنس ہے.',
  'lib.entry.pixabay.title': 'Pixabay — تصاویر اور نقشے',
  'lib.entry.pixabay.what': 'تصاویر، نقشے اور چھوٹی ویڈیو.',
  'lib.entry.unsplash.title': 'Unsplash — خوبصورت تصاویر',
  'lib.entry.unsplash.what': 'مفت، بڑے سائز میں، اکاؤنٹ کی ضرورت نہیں.',
  'lib.entry.openverse.title': 'Openverse — تمام مفت تصاویر ایک جگہ',
  'lib.entry.openverse.what': 'ایک ساتھ کئی مفت تصویر سائٹیں تلاش کریں.',
  'lib.entry.librivox.title': 'LibriVox — سننے کے لیے کتابیں',
  'lib.entry.librivox.what': 'پرانی انگریزی کتابوں کا مفت آڈیو، انسانی آواز میں.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — آڈیو مجموعہ',
  'lib.entry.internet-archive-audio.what': 'ہزاروں مفت ریکارڈنگز — کتابیں، تقاریر، موسیقی.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — قومی گیت اور دیگر',
  'lib.entry.vande-mataram.what': 'بھارت کا قومی گیت اور دیگر قومی گیت، مفت.',
  'art.aag-aur-bijli-ke-bachav.title': 'آگ اور بجلی سے بچاو کے اصول',
  'art.aag-aur-bijli-ke-bachav.summary': 'گھر میں آگ لگنے سے روک تھام — آسان اصول',
  'art.aag-lagne-par-kya-karein.title': 'آگ لگ جائے تو کیا کریں',
  'art.aag-lagne-par-kya-karein.summary': 'جلتے گھر میں آگ — سب سے پہلے کیا کریں، کیا نہ کریں',
  'art.bimari-se-bachav.title': 'انتشار سے بچاؤ کے سات اصول',
  'art.bimari-se-bachav.summary': 'ہاتھ دھونا، ماسک، ویکسین — کیسے محفوظ رہیں',
  'art.dhuwan-ka-jhakora.title': 'دھوئیں سے دم گھٹنے سے بچاؤ',
  'art.dhuwan-ka-jhakora.summary': 'دم گھٹ رہا ہے، سانس نہیں آ رہی — کیا کریں، کب ہسپتال جائیں',
  'art.doodh-pani-band-ho.title': 'بجلی یا پانی اچانک بند ہو جائے',
  'art.doodh-pani-band-ho.summary': 'کیا کریں، کس سے بچیں، کب مدد مانگیں',
  'art.haath-ki-saafai.title': 'صابن کے بغیر ہاتھ صاف کرنے کا طریقہ',
  'art.haath-ki-saafai.summary': 'جب پانی یا صابن نہ ہو',
  'cat.dhyan-aur-yoog.title': 'دھیان اور یوگ',
  'cat.dhyan-aur-yoog.subtitle': 'ذہن پرسکون ہونے کے آسان طریقے',
  'cat.gharelu-marammat.title': 'گھریلو مرمت',
  'cat.gharelu-marammat.subtitle': 'گھر کی چھوٹی مسائل کا حل',
  'cat.bachchon-ki-padhai.title': 'بچوں کی پڑھائی',
  'cat.bachchon-ki-padhai.subtitle': 'پڑھائی میں لگے، پریشان',
  'cat.budharge-seva.title': 'بزرگوں کی خدمت',
  'cat.budharge-seva.subtitle': 'نگہداشت اور مدد',
  'cat.shishu-dekhbhal.title': 'شیشے کی دیکھ بھال',
  'cat.shishu-dekhbhal.subtitle': 'چھوٹے بچے کی درست دیکھ بھال',
  'cat.dharmik-upay.title': 'مذہبی حل',
  'cat.dharmik-upay.subtitle': 'پرسکون ذہن کے ساتھ',
  'cat.pavan-grah-aur-aarti.title': 'پاک گرانث اور آرتی',
  'cat.pavan-grah-aur-aarti.subtitle': 'شرداد سے پڑھیں اور سنیں',
  'cat.aapatkalen-gayide.title': 'ایمرجنسی گائیڈ',
  'cat.aapatkalen-gayide.subtitle': 'جب فوری مدد چاہیے',
  'cat.mahamari-suraksha.title': 'وبائی حفاظت',
  'cat.mahamari-suraksha.subtitle': 'بیماری پھیلنے سے بچاؤ',
  'nav.reviews': 'آراء', 'nav.support': 'مدد کریں', 'nav.menu': 'مینو',
  'nav.birthChart': 'جنم گنٹھ',
  'jgd.title': 'آپ کی جنم گنٹھ',
  'jgd.intro': 'اپنا نام، تاریخِ پیدائش، اور اگر معلوم ہو تو وقت اور مقام بھی لکھیں۔ سب حساب آپ کےہی فون پر ہوگا — کہیں بھیجیا نہیں جاتا۔',
  'jgd.nameLabel': 'پیدائشی نام',
  'jgd.namePlaceholder': 'مثلاً نام کامل',
  'jgd.nameHint': 'بچپن میں دیا گیا نام.',
  'jgd.dateLabel': 'تاریخِ پیدائش',
  'jgd.timeLabel': 'وقتِ پیدائش',
  'jgd.timeHint': 'اگر معلوم نہ ہو تو خالی چھوڑیں۔',
  'jgd.placeLabel': 'مقامِ پیدائش',
  'jgd.placeNone': 'معلوم نہیں / منتخب کریں',
  'jgd.placeHint': 'شہرِ پیدائش چنیں۔',
  'jgd.submit': 'حساب لگائیں',
  'jgd.savePdf': 'PDF بنائیں',
  'jgd.again': 'دوبارہ شروع کریں',
  'jgd.errDate': 'براہ کرم تاریخِ پیدائش درست لکھیں۔',
  'jgd.errPlace': 'فہرست سے اپنا شہر چنیں، یا قریب ترین شہر چنیں۔',
  'jgd.numTitle': 'اعداد شناسی',
  'jgd.lifePath': 'راہِ زندگی',
  'jgd.nameNumber': 'نام کا عدد',
  'jgd.soulNumber': 'عدد الروح',
  'jgd.birthdayNumber': 'عدد يوم الميلاد',
  'jgd.astroTitle': 'جیوتیش ویدیک',
  'jgd.nakshatra': 'نکشتر',
  'jgd.pada': 'پَد',
  'jgd.rashi': 'راشی',
  'jgd.rashiLord': 'سیدِ راشی',
  'jgd.nakshatraLord': 'سیدِ نکشتر',
  'jgd.lagna': 'لگن',
  'jgd.lagnaMissing': 'لگن کے لیے وقتِ پیدائش اور مقام درکار ہے۔ اوپر بھر کر دوبارہ حساب لگائیں — اور معلوم نہ ہو تو یہ بھی کافی ہے۔',
  'jgd.gunTitle': 'گن میلان',
  'jgd.gunIntro': 'دوسرے شخص کا نام اور تاریخِ پیدائش درج کریں۔',
  'jgd.gunName': 'اُن کا نام',
  'jgd.gunDate': 'اُن کی تاریخِ پیدائش',
  'jgd.gunHint': 'دونوں نام اور تاریخیں ہوں تو گن میلان نکلتا ہے۔',
  'jgd.disclaimer': 'یہ روایتی طریقے سے کی گئی گنتی ہے، پیش گوئی نہیں۔ کوئی عدد یا راشی کسی کی صحت، دولت یا رشتوں کا فیصلہ نہیں کرتی۔ بڑے فیصلوں کے لیے ڈاکٹر، وکیل یا تجربہ کار کی مشورہ لیں۔',
  'nav.openMenu': 'مینو کھولیں', 'nav.closeMenu': 'مینو بند کریں', 'nav.language': 'زبان بدلیں',
  'ask.label': 'اپنا مسئلہ لکھیں یا بولیں', 'ask.placeholder': 'مثلاً: بچے کے پڑھائی میں کمزوری',
  'ask.help': 'اینٹر دبائ کر بھی بھیج سکتے ہیں۔', 'ask.send': 'پوچھیں', 'ask.sending': 'سوچ رہے ہیں…',
  'ask.speak': 'بول کر پوچھیں', 'ask.listening': 'بولنا شروع کریں…',
  'ask.suggested': 'عام سوالات', 'ask.answerTitle': 'حل', 'ask.listen': 'سنیں', 'ask.stopSpeak': 'روکیں',
  'ask.aiNote': 'یہ جواب AI نے دیا ہے۔ ماہر کی مشورے کا متبادل نہیں۔',
  'sound.title': 'سکون کے لیے آواز', 'sound.intro': 'نہ کوئی فیس، نہ اشتہار۔',
  'home.soundTitle': 'سکون کے لیے آواز',
  'sound.shankh': 'شاخ', 'sound.bansuri': 'بانسُری', 'sound.dhol': 'ڈھول', 'sound.all': 'تینوں',
  'dhun.welcome': 'خوش آمدید', 'dhun.prompt': 'سنکھ، بانسری اور ڈھول ایک ساتھ — سننے کے لیے چھوئیں۔',
  'dhun.listen': 'سنیں', 'dhun.skip': 'چھوڑیں',
  'home.emergencyTitle': 'فوری — ابھی مدد درکار ہے', 'home.emergencyNote': 'پہلے یہ پڑھیں۔',
  'home.readMore': 'مکمل معلومات پڑھیں', 'home.chooseTopic': 'کس موضوع کے بارے میں جاننا ہے؟',
  'home.askHere': 'اس موضوع میں پوچھیں', 'home.howTitle': 'یہ خدمت کیسے کام کرتی ہے',
  'home.freeTitle': 'یہ خدمت مکمل طور پر مفت ہے', 'home.freeBody': 'پیسے نہیں لیے جاتے، نجی معلومات نہیں مانگی جاتیں، اشتہار نہیں۔',
  'footer.pages': 'صفحات', 'footer.helplines': 'اہم نمبر', 'footer.readStory': 'ان کی مکمل کہانی پڑھیں',
  'reviews.title': 'آپ کی رائے، آپ کی بات', 'reviews.submit': 'بھیجیے', 'reviews.comment': 'آپ کی بات',
  'language.choose': 'اپنی زبان منتخب کریں', 'language.articlesIn': 'یہ مضمون ہندی میں ہے۔',

  'ask.welcome': 'خوش آمدید! نیچے اپنا مسئلہ لکھیں یا کوئی موضوع منتخب کریں۔',

  'ref.notTitle': 'یہ کیا نہیں کرتی',

  'ref.not1': 'یہ ڈاکٹر نہیں ہے۔ دوا کا مشورہ کبھی نہیں دیا جاتا۔',

  'ref.not2': 'یہ وکیل نہیں ہے۔ قانونی مشورہ نہیں دیا جاتا۔',

  'ref.not3': 'کوئی پیسے نہیں لیے جاتے، اور کوئی اشتہار نہیں دکھایا جاتا۔',

  'ref.not4': 'آپ کا نام، پتہ یا فون نمبر نہیں مانگا جاتا اور نہیں رکھا جاتا۔',

  'ref.not5': 'سرکاری منصوبے کی قیمت یا نمبر نہیں بنایا جاتا — معلومات نہ ہو تو صاف کہا جاتا ہے کہ معلوم نہیں۔',

  'ref.medicalTitle': 'ضروری: یہ ڈاکٹر کا مشورہ نہیں',

  'ref.medicalBody': 'بیماری، دوا یا کسی زہریلی چیز کے بارے میں ہو تو سب سے پہلے ڈاکٹر سے ملیں۔ یہاں دی گئی معلومات صرف عام مدد کے لیے ہے۔ بچے کے ٹیکے، حمل، یا کوئی بھی دوا شروع کرنے سے پہلے ڈاکٹر کا مشورہ ضرور لیں۔',

  'ref.statsTitle': 'کتنی معلومات موجود ہے',

  'support.howTitle': 'ہماری مدد کیسے کریں',

  'support.alwaysFreeTitle': 'یہ خدمت ہمیشہ مفت رہے گی',

  'support.alwaysFreeBody': 'جو مدد ملے، وہ خدمت چلانے میں لگے گی۔ کسی سے کبھی پیسے نہیں لیے جائیں گے۔',

  'smriti.eyebrow': 'یاد کے طور پر',

  'smriti.whyTitle': 'یہ سائٹ کیوں ہے',

  'smriti.ending': 'ان کی کوشش یہیں سے آگے بڑھ رہی ہے۔',

  'article.askAny': 'ایک سوال پوچھیں',

  'article.remember': 'یاد رکھیں',

  'article.emergencyInfo': 'ضروری معلومات',

  'article.medicalTitle': 'یہ طبی مشورہ نہیں',

  'article.medicalBody': 'یہ معلومات صرف عام مدد کے لیے ہے۔ ڈاکٹر کے مشورے کے بغیر کوئی دوا شروع یا بند نہ کریں۔',

  'article.heading': '{category} پر مضامین',

  'reviews.rateQuestion': 'کتنے ستارے دیں گے؟',

  'reviews.starsShort': '{value} ستارے',

  'reviews.averageOutOf': '5 میں سے {value} ستارے',

  'dhun.welcomeTitle': 'خوش آمدید',

  'dhun.consent': 'سنکھ، بنسوری اور ڈھول مل کر۔ سننے کے لیے چھوئیں۔',

  'dhun.failed': 'آواز نہیں چلی۔',

  'dhun.unsupported': 'یہ براؤزر آواز نہیں چلا سکتا۔',

  'dhun.failedTry': 'آواز چلانے میں مسئلہ پیش آیا۔',

  'sound.hintIdle': 'کوئی بھی بٹن دبا کر آواز سنیں۔',

  'sound.hintPlaying': 'آواز چل رہی ہے۔ روکنے کے لیے وہی بٹن دوبارہ دبائیں۔',

  'sound.preparing': 'آواز تیار ہو رہی ہے',

  'nav.path': 'راستہ',

  'toast.dismiss': 'بند کریں',

  'footer.free': 'یہ خدمت مکمل طور پر مفت ہے۔ کسی سے پیسے نہیں لیے جاتے۔',

  'cat.empty': 'اس موضوع میں ابھی کوئی مضمون نہیں ہے۔',
  'cat.notFound': 'یہ صفحہ نہیں ملا',

  'dhun.label': 'آواز چلانے کی اجازت',

  'language.articlesInHint': 'ہر زبان کا اپنا الگ ترجمہ درکار ہے۔ یہ ترجمہ ابھی نہیں ہوا — جو لکھا گیا ہے وہ ہندی ہی میں سب سے درست اور مکمل ہے۔',

  'nav.collapse': 'ٹیب بند کریں',

  'nav.expand': 'ٹیب کھولیں',

  'nav.skip': 'براہ راست مواد پر جائیں',

  'theme.toDark': 'تاریک رنگ پر جائیں',

  'theme.toLight': 'روشن رنگ پر جائیں',

  'ask.clear': 'لکھا ہوا متن مٹا دیں',

  'ask.emptyAnswer': 'اس بار جواب نہیں بنا۔ تھوڑا مختلف لے کر پوچھیں۔',

  'ask.errorNetwork': 'انٹرنیٹ کام نہیں کر رہا۔ کنکشن دیکھ کر دوبارہ کوشش کریں۔',

  'ask.errorRateLimit': 'ایک ہی وقت میں بہت سے سوالات بھیج دیے گئے۔ کچھ دیر بعد کوشش کریں۔',

  'ask.heardWith': 'اب ہم سن رہے ہیں',
  'ask.heard': 'سن رہے ہیں',

  'ask.micUnsupported': 'اس براؤزر میں بول کر پوچھنا کام نہیں کرے گا۔ لکھ کر پوچھیں۔',

  'ask.notAnswer': 'اس سوال کا براہِ راست جواب ہمارے پاس نہیں ہے۔',


  'ask.stopListening': 'سننا بند کریں',

  'article.askAbout': 'اس موضوع میں پوچھیں',

  'article.count': '{count} مضامین',

  'article.emergency': 'ضروری',

  'article.others': 'اس موضوع کے مزید مضامین',

  'article.readAloud': 'یہ مضمون سنیں',

  'footer.admin': 'منتظم',

  'footer.ambulance': 'ایمبولینس',

  'footer.emergency': 'ہنگامی صورتحال',

  'footer.rights': 'مفت خدمت',

  'footer.women': 'خواتین کی مدد',

  'sound.allHint': 'ایک ساتھ',

  'sound.bansuriHint': 'نرم، آہستہ',

  'sound.dholHint': 'تیز، تیز',

  'sound.errGeneric': 'آواز چلانے میں مسئلہ پیش آیا۔',

  'sound.errUnsupported': 'یہ براؤزر آواز نہیں چلا سکتا۔',

  'sound.listenLabel': 'سنیں',

  'sound.playing': 'آواز چل رہی ہے۔ روکنے کے لیے وہی بٹن دوبارہ دبائیں۔',

  'sound.shankhHint': 'گہری، لمبی',

  'voice.aborted': 'رک گیا۔ دوبارہ کوشش کریں۔',

  'voice.audioCapture': 'مائیک نہیں ملا۔ ڈیوائس لگائیں، یا لکھ کر پوچھیں۔',

  'voice.generic': 'کچھ گڑبڑ ہو گیا۔ دوبارہ کوشش کریں۔',

  'voice.network': 'بول کر پوچھنے کے لیے انٹرنیٹ چاہیے، مگر وہ کام نہیں کر رہا۔ لکھ کر پوچھیں — یہی جواب ملے گا۔',

  'voice.noSpeech': 'کوئی آواز نہیں سنائی دی۔ مائیک کے قریب بولیں، یا لکھیں۔',

  'voice.notAllowed': 'مائیک کی اجازت نہیں ملی۔ اوپر جا کر اجازت دیں، یا لکھ کر پوچھیں۔',

  'voice.serviceNotAllowed': 'مائیک کی اجازت نہیں ملی۔ اوپر جا کر اجازت دیں، یا لکھ کر پوچھیں۔',

  'voice.speakFailed': 'یہ جواب پڑھ کر سنایا نہیں جا سکا۔',
  'voice.noVoice': 'اس ڈیوائس میں {name} کی آواز نہیں ہے۔ ابھی لکھا ہوا پڑھیں، یا فون کی سیٹنگز میں جا کر آواز شامل کریں۔',

  'voice.unsupported': 'اس براؤزر میں بول کر پوچھنا کام نہیں کرے گا۔ لکھ کر پوچھیں۔',

  'ask.notConfigured': 'یہ خدمت اِس وقت محفوظ جوابات کے ذخیرے سے جواب دے رہی ہے۔ آپ کا سوال اس میں نہیں ملا۔',

  'ask.browseTitle': 'یہاں جو مضامین ہیں وہ دیکھیں',

  'health.heading': 'اپنی عمر بتائیے',

  'health.intro': 'عمر کے مطابق جو سوال بار بار پوچھے جاتے ہیں وہ یہاں دکھائی دیں گے۔ کوئی بھی بٹن دبائیں — سوال نیچے بھر جائے گا، پھر پوچھ لیجیے۔',

  'health.ageLabel': 'عمر (سال)',

  'health.years': 'سال',

  'health.bandsLabel': 'عمر کے مطابق منتخب کریے',

  'health.notAdviceStrong': 'یہ طبی مشورہ نہیں ہے۔',

  'health.notAdvice': 'کوئی دوا شروع یا بند نہ کریں — پہلے ڈاکٹر سے ملیں۔',

  'health.emergencyStrong': 'ہنگامی صورتحال میں فون کریے:',

  'health.emergencyCall': '(ہنگامی)',

  'health.emergencyAmbulance': '(ایمبولینس)',

  'health.emergencyWomen': '(خواتین ہیلپ لائن)',

  'health.privacy': 'نام یا پتہ لکھنے کی ضرورت نہیں۔',

  'health.band.infant.label': '0 – 2 سال',

  'health.band.child.label': '3 – 12 سال',

  'health.band.teen.label': '13 – 17 سال',

  'health.band.young.label': '18 – 30 سال',

  'health.band.middle.label': '31 – 45 سال',

  'health.band.later.label': '46 – 60 سال',

  'health.band.senior.label': '61 – 75 سال',

  'health.band.elder.label': '76 – 100 سال',

  /* ---- save / download ---- */

  'download.pdf': 'PDF میں محفوظ کریں',
  'download.text': 'متن میں محفوظ کریں',
  'download.printNow': 'پرنٹ کریں',
  'download.preparing': 'تیار ہو رہا ہے',
  'download.blocked': 'نیا ٹیب نہیں کھل سکا۔ براؤزر پاپ اپ بلاک کر رہا ہے — اجازت دیں۔',

  /* ---- attach a document ---- */

  'attach.button': 'اپنا دستاویز یا تصویر منسلک کریں',
  'attach.formats': 'PDF، تصویر (JPG/PNG) یا ٹیکسٹ فائل — 12 MB تک',
  'attach.reading': 'پڑھ رہا ہے…',
  'attach.attached': 'منسلک ہو گیا',
  'attach.remove': 'ہٹائیں',
  'attach.tooBigPdf': 'یہ PDF 12 MB سے بڑی ہے۔ چھوٹی فائل منتخب کریں۔',
  'attach.tooBigImage': 'یہ تصویر 3 MB سے بڑی ہے۔ چھوٹی تصویر منتخب کریں۔',
  'attach.scannedPdf': 'یہ PDF اسکین شدہ ہے — اس میں صرف تصویر ہے، پڑھا نہیں جا سکتا۔ اس کی تصویر بھیجیں۔',
  'attach.pdfFailed': 'یہ PDF نہیں پڑھی جا سکی۔',
  'attach.imageFailed': 'یہ تصویر لوڈ نہیں ہوئی۔',
  'attach.wrongType': 'اس قسم کی فائل کام نہیں کرے گی۔ PDF، تصویر یا ٹیکسٹ فائل بھیجیں۔',
  'attach.hint': 'اپنا کاغذ یہاں منسلک کر کے سوال پوچھیں — جواب اسی کاغذ کے بارے میں آئے گا۔',
  'ask.sendWithFile': 'اس کا جواب دیں',

  /* ---- free library ---- */

  'lib.title': 'مفت کتب خانہ',
  'lib.intro': 'اسباق کی کتابیں، کتابیں، تصاویر، آڈیو — سب مفت اور قانونی۔',
  'lib.legalTitle': 'کاپی رائٹ کا کوئی مسئلہ نہیں۔',
  'lib.legal': 'جو کچھ یہاں دیا گیا ہے وہ مکمل طور پر مفت ہے اور آپ اسے آگے بھی بھیج سکتے ہیں۔ جو کتاب ابھی کاپی رائٹ میں ہے وہ یہاں نہیں — اسے نقل کرنے کی اجازت نہیں، یہ صاف بتانا ہی بہتر ہے۔',
  'ask.signInTitle': 'پہلے لاگ اِن کریں',
  'ask.signInBody': 'سوال پوچھنے کے لیے اکاؤنٹ بنائیں۔ ایک منٹ سے بھی کم، پھر آپ سوال پوچھتے رہیں۔',
  'ask.signInCta': 'اکاؤنٹ بنائیں یا لاگ اِن کریں',
  'ask.signInFirst': 'پہلے لاگ اِن کریں، پھر سوال پوچھیں۔',
  'ask.signInOr': 'ابھی اکاؤنٹ نہیں بن سکتے؟ یہ اکاؤنٹ کے بغیر بھی کام کرتے ہیں:',
  'account.title': 'میرا اکاؤنٹ',
  'account.intro': 'اپنے نام اور پاس ورڈ سے سائن ان کریں۔',
  'account.signIn': 'سائن اِن',
  'account.register': 'اکاؤنٹ بنائیں',
  'account.signInNote': 'پچھلا نام اور پاس ورڈ استعمال کریں۔',
  'account.registerNote': 'سوال پوچھنے کے لیے اکاؤنٹ ضروری نہیں۔ یہ صرف آپ کی زبان اور جوابات یاد رکھنے کے لیے ہے۔',
  'account.handle': 'آپ کا نام',
  'account.handlePlaceholder': 'مثلاً sita.ji',
  'account.password': 'پاس ورڈ',
  'account.passwordHint': 'کم از کم چھ حروف۔',
  'account.phone': 'فون نمبر',
  'account.optional': 'ضروری نہیں',
  'account.phoneHint': 'چاہیں تو دیں۔ اس کے بغیر بھی اکاؤنٹ بن جائے گا۔',
  'account.create': 'اکاؤنٹ بنائیں',
  'account.logout': 'باہر نکلیں',
  'account.open': 'اکاؤنٹ کھولیں',
  'account.signedInAs': 'آپ لاگ اِن ہیں',
  'account.signedOut': 'لاگ اِن نہیں',
  'account.signedOutBody': 'اس براؤزر میں کوئی اکاؤنٹ کھلا نہیں۔',
  'account.saved': 'محفوظ جوابات',
  'account.savedEmpty': 'ابھی کچھ محفوظ نہیں۔ جواب پر محفوظ کریں دبائیں۔',
  'account.savedUnavailable': 'محفوظ جوابات ابھی نظر نہیں آ رہے۔ باقی سب چل رہا ہے۔',
  'account.wait': 'براہ کرم انتظار کریں…',
  'account.privacyTitle': 'آپ کی معلومات',
  'account.privacyBody': 'اکاؤنٹ میں صرف آپ کا نام، پاس ورڈ اور زبان رہتی ہے۔ آپ نے کیا پوچھا وہ ریکارڈ نہیں ہوتا۔ آپ کے سوال کسی کو نہیں بھیجے جاتے۔',
  'account.errWrong': 'نام یا پاس ورڈ غلط ہے۔',
  'account.errTaken': 'وہ نام پہلے لیا جا چکا ہے۔ دوسرا نام چنیں۔',
  'account.errBad': 'براہ کرم فارم صحیح بھریں۔',
  'account.errWait': 'بہت زیادہ کوششیں۔ کچھ دیر بعد دوبارہ کوشش کریں۔',
  'account.errTryLater': 'ابھی نہیں ہو سکا۔ کچھ دیر بعد کوشش کریں۔',
  'lib.licence.ccBy': 'آپ اسے نقل، شیئر اور چھاپ سکتے ہیں — ماخذ کا نام دینا ہوگا۔',
  'lib.licence.ccBySa': 'اسے نقل اور چھاپا جا سکتا ہے۔ کی گئی تبدیلیاں بھی کھل کر دینی ہوں گی۔',
  'lib.licence.ccZero': 'مکمل طور پر مفت۔ ذریعہ کا نام دینا بھی لازم نہیں۔',
  'lib.licence.pd': 'اس کا کوئی کاپی رائٹ نہیں — جو چاہیۺ کاپی کریں۔',
  'lib.licence.govtIndia': 'بھارتی سرکار کی ویب سائٹ پر۔ پڑھنا اور چھپانا دونوں مفت ہیں۔',
  'lib.licence.creativeCommons': 'ہر فائل کا اپنا لائسنس ہے — فائل دیکھیں۔',
  'lib.licence.freeToRead': 'پڑھنا مفت ہے۔ آگے دینا بھی اُسی شرط کے تحت ہے۔',
  'lib.openBadge': 'کھلا',
  'lib.openBadgeNote': 'نقل کر سکتے ہیں',
  'lib.freeBadge': 'مفت',
  'lib.freeBadgeNote': 'پڑھ سکتے ہیں، نقل نہیں',
  'lib.govt': 'سرکاری',
  'lib.noSignup': 'اکاؤنٹ نہیں',
  'lib.open': 'یہاں کھولیں',
  'lib.group.padhai': 'اسباق کی کتابیں',
  'lib.group.padhai.note': 'متن، کالج اور سرکاری تعلیمی مواد',
  'lib.group.kitab': 'کتابیں',
  'lib.group.kitab.note': 'جن کا کاپی رائٹ ختم ہو چکا ہے یا جن کی نقل کی اجازت ہے',
  'lib.group.tasveer': 'تصاویر',
  'lib.group.tasveer.note': 'نقشے، تصاویر — سب کچھ',
  'lib.group.audio': 'سننے کا مواد',
  'lib.group.audio.note': 'کتابیں آڈیو میں، چھوٹے حروف نہیں پڑھنے والوں کے لیے',
  'lib.warnTitle': 'ہر کتاب یہاں نہیں',
  'lib.warn': 'کچھ کتابیں ابھی کاپی رائٹ میں ہیں اور قانون کے مطابق مفت دی نہیں جا سکتیں۔ وہ جان بوجھ کر نہیں دکھائی گئیں۔ کتاب چاہیے تو نیچے پوچھیں — جو بتایا جا سکتا ہے وہ بتا دیا جائے گا۔',
  'lib.askInstead': 'پوچھیں',
  'nav.library': 'کتب خانہ',

  'help.title': 'اپنا مسئلہ لکھیے',

  'help.intro': 'نیچے لکھیے یا بولیے۔ پتا نہ ہو تو جو دل میں آئے وہی لکھ دیجیے — یہی سب سے ضروری ہے۔',

  'help.howTitle': 'یہ خدمت کیسے کام کرتی ہے',

  'help.howBody': 'ہر سوال درج ہوتا ہے اور اس کا جواب فوراً ملتا ہے۔ آپ کا نام، پتہ یا فون نمبر کہیں نہیں لیا جاتا۔ سب کچھ مفت ہے۔',

  'help.suggested': 'عام سوالات',

  'help.q1.label': 'بجلی چلی گئی، کیا کریں؟',

  'help.q1.question': 'گھر میں بجلی چلی گئی ہے۔ کیا کرنا چاہیے، اور موبائل فون کیسے چارج کریں؟',

  'help.q2.label': 'بچے کی پڑھائی میں کمزوری',

  'help.q2.question': 'میرے بچے کی پڑھائی میں بہت کمزوری ہے۔ گھر پر کیسے بہتر کریں؟',

  'help.q3.label': 'بوڑھے کا علاج',

  'help.q3.question': 'میرے والد صاحب کی عمر بہت زیادہ ہے، ان کا علاج کیسے کروں؟',

  'help.q4.label': 'گھر میں آگ لگے تو',

  'help.q4.question': 'اگر رات کو گھر میں آگ لگے تو سب سے پہلے کیا کرنا چاہیے؟',

  'home.stepLabel': 'مرحلہ',

  'home.step1Title': 'اپنی بات لکھیے یا بولیے',

  'home.step1Body': 'اردو میں ٹائپ کریے، یا مائیک دبا کر بولیے۔ کچھ خاص کرنے کی ضرورت نہیں — جو دل میں ہے وہی لکھ دیجیے۔',

  'home.step2Title': 'فوراً جواب ملتا ہے',

  'home.step2Body': 'ہر سوال درج ہوتا ہے اور اس کا جواب فوراً ملتا ہے۔ بہت لمبے سوال سے پہلے چھوٹے سوال سے شروع کریے۔',

  'home.step3Title': 'پیسے نہیں، نجی معلومات نہیں',

  'home.step3Body': 'یہ خدمت مکمل طور پر مفت ہے۔ آپ کا نام، پتہ یا فون نمبر نہیں مانگا جاتا، اور کوئی اشتہار نہیں دکھایا جاتا۔',

  'home.memorialEyebrow': 'یہ سائٹ کس کے لیے ہے',
  'home.memorialLine': 'جس نے زندگی بھر معاشرے کے لیے جدوجہد کی، اور آخر میں اپنا حصہ نہ مل سکا۔',
  'home.memorialMore': 'ان کی پوری کہانی پڑھیں',
  'home.kundaliTitle': 'جنم گنٹھ',
  'home.kundaliNote': 'مکمل کنڈلی — نو گرہ، ویمشوتتری دشا، فلادیش، یوگ، شودشورگ، کے پی، لال کتاب اور انک جیوتش۔ سب آپ کے فون پر ہی حساب ہوگا۔',
  'home.chooseTopicNote': 'نیچے دیے گئے موضوع پر ٹیپ کریے۔ ہر جگہ آسان زبان میں معلومات دی گئی ہے۔',

  'home.categoryEmpty': 'اس موضوع میں ابھی کچھ بھی نہیں لکھا گیا۔',

  'home.soundIntro': 'کوئی فیس نہیں، کوئی اشتہار نہیں۔ بس ذہن شانت کرنے کے لیے۔',

  'home.dedication1': 'یاد میں — مکمل طور پر مفت خدمت۔',

  'home.dedication2': 'اپنا مسئلہ لکھیے یا بولیے۔',

  'ref.title': 'یہ خدمت کیا ہے، اور کس کے لیے',

  'ref.intro': 'یہ خدمت محترمہ VARSHA جی کی یاد میں بنائی گئی ہے۔ یہاں آسان زبان میں بتایا گیا ہے کہ یہ کیا کرتی ہے، اس میں کیا ہے، اور اس کی حدود کیا ہیں۔ سب کچھ مکمل طور پر مفت ہے — پیسے نہیں لیے جاتے، اشتہار نہیں دکھایا جاتا، اور نجی معلومات نہیں مانگی جاتیں۔',

  'ref.whatTitle': 'اس میں کیا ہے',

  'ref.what1': 'گھر میں آگ، بجلی جانے، بچے کی پڑھائی میں کمزوری، والدین کی دیکھ بھال — ایسی عام مسائل کے آسان حل، صاف ستھری زبان میں۔',

  'ref.what2': 'سوال بول کر پوچھنے کی سہولت۔ بول نہ سکیں تو لکھیے — دونوں کا جواب ایک جیسا ملتا ہے۔',

  'ref.what3': 'ہر سوال درج ہوتا ہے، اس لیے جو دوسروں کو پریشان کرتا ہے وہ آپ سے پہلے ہی پوچھا جا چکا ہوتا ہے اور اس کا جواب مل جاتا ہے۔',

  'ref.what4': 'کوئی اشتہار نہیں، کوئی غیر ضروری معلومات نہیں، اور کوئی نجی معلومات نہیں مانگی جاتی۔ سب کچھ مفت۔',

  'ref.statsArticles': 'مضامین لکھے گئے ہیں',

  'ref.statsCategories': 'موضوعات دستیاب ہیں',

  'ref.statsQuestions': 'سوالات پوچھے جا چکے ہیں',

  'ref.adminTitle': 'منتظم کیا کر سکتے ہیں',

  'ref.adminBody': 'آپ کی بھیجی مضامین منتظم دیکھ سکتے ہیں اور ان کے جواب لکھ سکتے ہیں۔ آپ کی اجازت کے بغیر وہ کوئی مضمون نہیں بدل یا ہٹا سکتے، اور آپ کی معلومات کسی کو نہیں بیچ سکتے۔',

  'ref.dataTitle': 'ہم آپ کے بارے میں کیا رکھتے ہیں',

  'ref.dataBody': 'صرف آپ کا پوچھا گیا سوال، اس کا خلاصہ، اور پوچھنے کا وقت — تاکہ ہم بار بار وہی جواب نہ دیں۔ آپ کا نام، پتہ، فون نمبر یا پہچان دکھانے والی کوئی معلومات نہیں لی جاتی۔ سائٹ پر کوئی اشتہار یا ٹریکنگ اسکرپٹ نہیں لگی ہے۔',

  'ref.helplineTitle': 'فوری مدد کے لیے یہ نمبر رکھیے',

  'ref.helpline1': 'بڑا خطرہ ہو — آگ، بجلی کا تیز جھٹکا، گر جانا یا بہت زیادہ خون — تو 112 پر فون کریں۔',

  'ref.helpline2': 'کسی کو بیماری ہو یا زخم پہنچے اور جانے کا کوئی راستہ نہ ہو، تو 108 پر ایمبولینس مانگوائیں۔',

  'ref.helpline3': 'عورت کے ساتھ کچھ برا ہوا ہو، یا عورت کو کہیں پریشان کیا جا رہا ہو، تو 181 پر فون کریں۔ یہ مفت ہے۔',

  'ref.helpline4': 'بچے یا بزرگ کے ساتھ کوئی ناحقی ہوا ہو، تو 1098 پر شکایت کی جا سکتی ہے۔',

  'ref.helpline5': 'ذہنی دباؤ بہت زیادہ ہو، یا جینے کا دل نہ ہو، تو 14416 پر بات کی جا سکتی ہے۔ صرف بات کرنے کے لیے۔',

  'ref.ownerNote': 'یہ خدمت کسی کمپنی کی نہیں، سرکار کی نہیں، بلکہ ایک فرد کی یاد میں چل رہی ہے۔ اس لیے یہاں کوئی اشتہار نہیں، کوئی رکنیت نہیں، اور کوئی پیسے نہیں لیے جاتے۔',

  'support.title': 'یہ خدمت مفت ہے',

  'support.intro': 'یہ خدمت کسی سے پیسے نہیں لیتی۔ لیکن یہ چلتی ہے — اس لیے کچھ راستے ہیں جن سے آپ مدد کر سکتے ہیں۔ سب سے آسان راستہ ہی سب سے کام کا ہے۔',

  'support.contactTitle': 'کچھ بتانا ہے؟',

  'support.contactBody': 'کسی بھی بات کے لیے یہاں لکھ سکتے ہیں — چاہے کوئی غلطی ہو، چاہے کچھ زیادہ ملے، یا کوئی سوال ہو۔ جتنا لکھنا آسان لگے، اتنا ہی لکھیے۔',

  'support.faqTitle': 'کچھ باتیں جو بار بار پوچھی جاتی ہیں',

  'support.faqBody': 'کیا یہ واقعی مفت ہے؟ ہاں۔ کیا آپ کا نام لیا جاتا ہے؟ نہیں، نام دینا ضروری نہیں۔ کیا اشتہارات آتے ہیں؟ نہیں۔ کیا فون نمبر یا پتہ نہیں مانگا جاتا؟ نہیں۔ کیا کوئی ایپ ڈاؤن لوڈ کرنی پڑے گی؟ نہیں، بس براؤزر میں کھل جاتی ہے۔',

  'support.waysTitle': 'آپ کیسے مدد کر سکتے ہیں',

  'support.way1Title': 'اپنا تجربہ لکھیے',

  'support.way1Body': 'اگر اس سائٹ سے آپ کو کچھ اچھا لگا ہو — یا ایسا کچھ ملا ہو جو آپ کو پریشان کر گیا ہو — تو رائے پیج پر لکھ دیجیے۔ آپ کا نام لینا ضروری نہیں۔',

  'support.way2Title': 'اپنے شہر کے بارے میں بتائیے',

  'support.way2Body': 'جہاں آپ رہتے ہیں وہاں کی زبان، روایات اور مشکلات الگ ہوتی ہیں۔ اگر آپ کے یہاں کی کچھ بات یہاں نہیں ہے، تو بتا دیجیے — جو شامل کیا جا سکتا ہے وہ شامل کر دیا جائے گا۔',

  'support.way3Title': 'اپنا تجربہ کسی اور کو سنائیے',

  'support.way3Body': 'جو یہاں لکھا گیا ہے وہ بہت سے لوگوں کے کام آ سکتا ہے، اگر انہیں پتہ ہو۔ ایسے شخص کو بتائیے جسے یہ واقعی مدد دے۔',

  'support.way4Title': 'یہاں آ کر دیکھیے',

  'support.way4Body': 'اگر آپ کے پاس وقت ہے، تو خود آ کر دیکھیے کہ یہ سائٹ ٹھیک سے چل رہی ہے یا نہیں۔ کچھ گڑبڑ دکھے تو بتائیے — بالکل مفت میں ٹھیک ہو جائے گی۔',

  'reviews.pageTitle': 'آپ کی رائے',

  'reviews.pageIntro': 'یہاں وہی لکھا ہے جو لوگوں نے لکھا ہے۔ کوئی رائے چھپائی نہیں جاتی، اور جو لکھا ہے وہ یہیں دکھتا ہے — بس ایک بار دیکھنے کے بعد شائع کیا جاتا ہے۔',

  'reviews.intro': 'کیا یہ خدمت آپ کے کام آئی؟ اپنی بات لکھیے — آپ کا نام لینا ضروری نہیں۔',

  'reviews.write': 'اپنی رائے لکھیے',

  'reviews.starsLabel': '5 میں سے {value} ستارے',

  'reviews.summaryTitle': 'عام رائے',

  'reviews.summaryLine': 'لوگوں نے اوسط {rating} میں سے 5 میں سے {count} ستارے دیے۔',

  'reviews.count': 'رائے',

  'reviews.name': 'آپ کا نام (ضروری نہیں)',

  'reviews.city': 'آپ کا شہر (ضروری نہیں)',

  'reviews.placeholder': 'جو دل میں آئے وہی لکھیے — کچھ ٹھیک کرنے کی ضرورت نہیں۔',

  'reviews.keepLabel': 'برا لگے تو ٹھیک لگے تو — دونوں لکھیے',

  'reviews.fieldTooShort': 'کم از کم 10 حروف لکھیے۔',

  'reviews.rateLimited': 'بہت تیزی سے بھیجا جا رہا ہے۔ ذرا رک کر دوبارہ کوشش کیجیے۔',

  'reviews.sending': 'بھیج رہے ہیں…',

  'reviews.moderated': 'آپ کی رائے شائع ہونے سے پہلے ایک بار دیکھی جاتی ہے۔',

  'reviews.moderationNote': 'سب کچھ مٹانے سے بچنے کے لیے، شائع ہونے سے پہلے ہر رائے ایک بار دیکھ لی جاتی ہے۔ گالی، نمبر یا ذاتی باتیں ہٹا دی جاتی ہیں — باقی سب جیسے ہے ویسے ہی شائع ہوتا ہے۔',

  'reviews.replyLabel': 'اس پر لکھا گیا ہے',

  'reviews.ownerReply': 'جواب',

  'reviews.empty': 'ابھی کوئی رائے نہیں۔ پہلی آپ لکھیے۔',

  'reviews.anonymous': 'بغیر نام',

  'reviews.toastSent': 'شکریہ',

  'reviews.toastFailed': 'رائے نہیں بھیجی جا سکی',

  'health.band.infant.note': 'ننھے بچے، جو ابھی اپنی بات نہیں کہہ سکتے',

  'health.band.child.note': 'بچے جو بول سکتے ہیں، مگر سوال پوچھنے سے ڈرتے ہیں',

  'health.band.teen.note': 'نوجوان، جن کے لیے اکثر ایسا کوئی فرد نہیں ملتا جو سنے',

  'health.band.young.note': 'نوکری، پیسے اور نیند — تینوں کا ایک ساتھ بوجھ',

  'health.band.middle.note': 'گھر، بچے اور اپنی صحت — سب کی ذمہ داری ایک ساتھ',

  'health.band.later.note': 'جسم کی عمر اور اس کی نگہداشت — دونوں ایک ساتھ',

  'health.band.senior.note': 'دوا، توازن اور تنہائی — تینوں ساتھ',

  'health.band.elder.note': 'ہر دوا کی جانچ ضروری، ہر گرنے کا معاملہ سنگین',

  'health.c.infant1': 'تیز بخار',

  'health.c.infant2': 'کھانا نہیں کھا رہا',

  'health.c.infant3': 'الٹی ہو رہی ہے',

  'health.c.infant4': 'پیچشش ہو رہی ہے',

  'health.c.child1': 'پڑھائی میں دل نہیں',

  'health.c.child2': 'اسکول نہیں جاتا',

  'health.c.child3': 'رات کو بخار',

  'health.c.child4': 'دانت گر رہے',

  'health.c.teen1': 'پڑھائی کا دباؤ',

  'health.c.teen2': 'نیند نہیں آتی',

  'health.c.teen3': 'موبائل کی عادت',

  'health.c.teen4': 'بہت زیادہ اداسی',

  'health.c.young1': 'کام کا دباؤ',

  'health.c.young2': 'بیٹھنے سے کمر درد',

  'health.c.young3': 'نیند نہیں آتی',

  'health.c.young4': 'پیسے کم',

  'health.c.middle1': 'کمر میں درد',

  'health.c.middle2': 'نیند ٹھیک نہیں',

  'health.c.middle3': 'گھر کا دباؤ',

  'health.c.middle4': 'پیٹ میں گیس',

  'health.c.later1': 'پیٹھ میں درد',

  'health.c.later2': 'گھٹنے میں درد',

  'health.c.later3': 'رات کو پاؤں میں کھنچ',

  'health.c.later4': 'صبح اکڑن',

  'health.c.senior1': 'چلنے میں دشواری',

  'health.c.senior2': 'دوا کی جانچ',

  'health.c.senior3': 'رات کو پیشاب',

  'health.c.senior4': 'سنائی کم',

  'health.c.elder1': 'گرنے کا ڈر',

  'health.c.elder2': 'یادداشت کمزور',

  'health.c.elder3': 'روز کی درد کی دوا',

  'health.c.elder4': 'ڈاکٹر کب',

  'health.q.infant1': 'میرے بچے کو بخار ہے، دودھ دوں؟',

  'health.q.infant2': 'چھوٹا بچہ کھا نہیں رہا، کیا کروں؟',

  'health.q.infant3': 'بچے کو الٹی ہو رہی ہے، ڈاکٹر کو کب دکھاؤں؟',

  'health.q.infant4': 'بچے کو پیچشش ہو رہی ہے، کیا کھلاؤں؟',

  'health.q.child1': 'بچے کی پڑھائی میں دل نہیں لگتا، کیا کروں؟',

  'health.q.child2': 'بچہ روز سکول جانے سے انکار کرتا ہے، وجہ کیا ہو سکتی ہے؟',

  'health.q.child3': 'بچے کو رات کو بخار آتا ہے، کیا کروں؟',

  'health.q.child4': 'بچے کے دانت گر رہے ہیں، دانتوں کی دیکھ بھال کیسے کروں؟',

  'health.q.teen1': 'پڑھائی کا بہت دباؤ ہے، اس کا مقابلہ کیسے کروں؟',

  'health.q.teen2': 'رات کو نیند ٹھیک سے نہیں آتی، کیا کروں؟',

  'health.q.teen3': 'موبائل کی عادت لگ گئی ہے، چھوڑنے کا طریقہ بتائیے۔',

  'health.q.teen4': 'بہت زیادہ اداسی محسوس ہوتی ہے، کس سے بات کروں؟',

  'health.q.young1': 'کام کا دباؤ بہت زیادہ ہے، کیسے کم کروں؟',

  'health.q.young2': 'بیٹھے رہنے سے پیٹھ میں درد ہوتا ہے، کیا کروں؟',

  'health.q.young3': 'رات کو نیند نہیں آتی، کیا کیا کریں؟',

  'health.q.young4': 'پیسے کم ہیں اور خرچ زیادہ، کیا کروں؟',

  'health.q.middle1': 'کمر میں درد ہو رہا ہے، وجہ کیا ہو سکتی ہے؟',

  'health.q.middle2': 'نیند اچھی نہیں آ رہی، بہتر کرنے کا کیا طریقہ ہے؟',

  'health.q.middle3': 'گھر کا دباؤ بہت ہے، بچوں کو کیسے سنبھالوں؟',

  'health.q.middle4': 'کام پر کئی سال سے پیٹ میں گیس کی مسئلہ ہے، کیا کروں؟',

  'health.q.later1': 'میری عمر 54 سال ہے اور پیٹھ میں درد ہے، کیا کروں؟',

  'health.q.later2': 'چڑھنے پر گھٹنے میں درد ہوتا ہے، کیوں؟',

  'health.q.later3': 'رات کو پاؤں میں کھنچ ہوتی ہے، کیا کروں؟',

  'health.q.later4': 'صبح اٹھ کر کمر میں سختی ہوتی ہے، وجہ کیا ہو سکتی ہے؟',

  'health.q.senior1': 'گھٹنوں میں اتنا درد ہے کہ چلنا مشکل ہے، کیا کروں؟',

  'health.q.senior2': 'کئی دوایں روز کھانی پڑتی ہیں — کون سی نقصانکار ہے، کیسے پتا چلے گا؟',

  'health.q.senior3': 'رات کو بار بار پیشاب کی دکھل ہے، کیا کروں؟',

  'health.q.senior4': 'کم سنائی دیتا ہے، سننے کا کوئی طریقہ بتائیے۔',

  'health.q.elder1': 'گھر میں گرنے کا ڈر ہے، کون سی حفاظت رکھوں؟',

  'health.q.elder2': 'یادداشت کمزور ہو رہی ہے، کیا کریں؟',

  'health.q.elder3': 'روز درد کی دوا کھانی پڑتی ہے — کیا اس کا کوئی نقصان ہے؟',

  'health.q.elder4': 'کب ڈاکٹر کے پاس جانا ضروری ہے؟',

  'support.contactMessageLabel': 'آپ کی بات',

  'support.contactPlaceholder': 'جو لکھنا ہے وہی لکھیے — غلطی ہو، کچھ اچھا ملے، یا کوئی سوال ہو۔',

  'support.contactHelp': 'کم از کم 10 حروف۔ یہ براہِ راست مالک تک پہنچتا ہے۔',

  'support.contactSubmit': 'بھیجیے',

  'support.contactSending': 'بھیج رہے ہیں…',

  'support.contactPrivacy': 'آپ کا نام لکھنا ضروری نہیں۔',

  'support.contactSent': 'پہنچ گیا',

  'support.contactSentBody': 'آپ کی بات مالک تک پہنچ گئی ہے۔',

  'support.contactFailed': 'نہیں بھیجا جا سکا',

  'support.faq1Q': 'کیا یہ واقعی مفت ہے؟',

  'support.faq1A': 'ہاں۔ کوئی پیسے نہیں لیے جاتے، کوئی اشتہار نہیں دکھایا جاتا، اور کوئی رکنیت نہیں لی جاتی۔ یہ ایک فرد کے پیسوں سے چلتی ہے، کسی کمپنی یا سرکار کے نہیں۔',

  'support.faq2Q': 'کیا میرا نام، پتہ یا فون نمبر لیا جاتا ہے؟',

  'support.faq2A': 'نہیں، اور لیا بھی نہیں جائے گا۔ یہ سائٹ خود کوئی پہچان نہیں بناتی — کوئی لاگ اِن نہیں، کوئی ٹریکنگ اسکرپٹ نہیں۔ پوچھا جاتا ہے صرف آپ کا سوال اور بس اتنا ہی محفوظ ہوتا ہے۔',

  'support.faq3Q': 'کیا یہ ڈاکٹر یا وکیل ہے؟',

  'support.faq3A': 'نہیں۔ یہ دوا کا یا قانونی مشورہ نہیں دیتی۔ جہاں بات سنگین ہو وہاں یہ کہتی ہے کہ ڈاکٹر یا افسر سے ملیں — ان کی جگہ یہ نہیں لیتی۔',

  'support.faq4Q': 'کیا ہر جواب درست ہوتا ہے؟',

  'support.faq4A': 'ہمیشہ نہیں۔ جواب کمپیوٹر لکھتا ہے، کوئی ڈاکٹر نہیں — اسی لیے ہر جواب کے ساتھ یہ لکھا ہوتا ہے کہ یہ طبی مشورہ نہیں ہے۔ کوئی دوا شروع یا بند کرنے سے پہلے ڈاکٹر سے ملیں۔',

  'support.faq5Q': 'کیا مجھے کوئی ایپ ڈاؤن لوڈ کرنی پڑے گی؟',

  'support.faq5A': 'نہیں۔ یہ صرف براؤزر میں کھلتی ہے۔ کوئی ایپ انسٹال نہیں، کوئی اجازت نہیں، کوئی اپ ڈیٹ نہیں۔',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'گھریلو علاج',
  'remedy.title': 'آیورویدک گھریلو علاج',
  'remedy.intro': 'کوئی بھی تکلیف ہو — کھانسی، سر درد، جوڑوں کا درد، خارش، ذیابیطس، کمر درد — نیچے اپنی تکلیف چنیں یا اپنے الفاظ میں پوچھیں۔ گھریلو کاڑھا، مالش، خوراک اور آیورویدک طریقے بتائے جائیں گے۔',
  'remedy.choose': 'اپنی تکلیف چنیں',
  'remedy.emergencyStrong': 'یہ ہنگامی حالتیں ہیں:',
  'remedy.emergency': 'سانپ کا کاٹنا، بچھو کا ڈنک اور کتے کا کاٹنا — فوراً ہسپتال جائیں، پہلے 112 پر فون کریں۔ گھریلو طریقے صرف راستے کے لیے ہیں، ہسپتال کی جگہ نہیں۔',
  'remedy.note': 'گھریلو اور آیورویدک طریقے تکلیف کم کرنے میں مدد دیتے ہیں؛ ڈاکٹر کے معائنے اور علاج کا نعم البدل نہیں۔ کوئی دوا خود شروع یا بند نہ کریں۔',
  'remedy.cough': 'کھانسی',
  'remedy.headache': 'سر درد',
  'remedy.joints': 'جوڑوں کا درد',
  'remedy.itching': 'خارش',
  'remedy.snake': 'سانپ کا کاٹنا',
  'remedy.scorpion': 'بچھو کا ڈنک',
  'remedy.dog': 'کتے کا کاٹنا',
  'remedy.diabetes': 'ذیابیطس',
  'remedy.back': 'کمر درد',
  'remedy.walking': 'چلنے میں تکلیف',
  'home.remedyNote': 'کاڑھا، مالش، خوراک اور آیورویدک طریقے — ہر تکلیف کے لیے، آپ کی زبان میں۔',
  'nav.aarti': 'آرتی اور بھجن',
  'aarti.title': 'آرتی اور بھجن — اصل آواز میں',
  'aarti.intro': 'یہاں آرتی، کیرتن اور بھجن سنیں — اصل گلوکاروں اور مندروں کی آواز میں۔ کوئی AI آواز نہیں۔',
  'aarti.note': 'آرتی یا بھجن کو کمپیوٹر کی آواز میں چلانا اس کی چال اور عقیدت ختم کر دیتا ہے۔ اسی لیے یہاں صرف اصلی ریکارڈنگ ہیں۔',
  'aarti.kindAarti': 'آرتی',
  'aarti.kindKirtan': 'کیرتن',
  'aarti.kindBhajan': 'بھجن',
  'aarti.credit': 'ریکارڈنگ:',
  'aarti.licence': 'لائسنس:',
  'aarti.listenLink': 'اصل آواز میں سنیں',
  'aarti.textChecked': 'یہ روایتی متن ہے، جیسا اصل ریکارڈنگ میں گایا گیا ہے۔',
  'aarti.textPrinted': 'یہ رائج متن ہے، شائع شدہ مجموعوں سے ملا کر جانچا گیا۔',
  'aarti.textNotStored': 'اس گرنتھ کا پورا متن یہاں محفوظ نہیں ہے — نیچے دی گئی ریکارڈنگ میں پورا متن ہے۔',
  'aarti.granthTitle': 'گرنتھ، چالیسا اور شلوک — اصل آواز میں',
  'aarti.noRecording': 'اس آرتی کی اصل ریکارڈنگ ابھی سائٹ پر نہیں ہے، اس لیے میں اسے گا کر نہیں سنا سکتا — مصنوعی آواز میں آرتی کبھی نہیں گائی جاتی۔',
  'aarti.textOnlyTitle': 'مزید آرتیاں — متن اور اصل آواز',
  'aarti.fullText': 'پورا متن',
  'aarti.notChecked': 'اس آرتی کا جانچا ہوا متن ابھی سائٹ پر نہیں۔ بغیر جانچے متن نہیں دیا جاتا، کیونکہ دعا میں غلط لفظ الفاظ نہ ہونے سے بھی بدتر ہے۔',
  'aarti.verifiedList': 'سائٹ پر ان آرتیوں کے جانچے ہوئے متن ہیں:',

};

const ARABIC: Record<string, string> = {
  'jgd.placeSearch': 'اكتب اسم مدينتك',
  'jgd.placeNoMatch': 'هذه المدينة ليست في القائمة. اختر أقرب مدينة إليها.',

  'account.name': 'اسمك',
  'account.namePlaceholder': 'مثلاً سيدة ديفى',
  'account.nameHint': 'حتى نعرف من أنت. أي اسم سيفي، وليس مطلوبًا.',

  'nav.home': 'الرئيسية', 'home.metaTitle': 'حلول مجانية، بكلماتك أنت', 'nav.tribute': 'ذكرى', 'nav.help': 'مساعدة', 'nav.reference': 'تعريف',
  'lib.licence.ccZero.name': 'CC0 / النطاق العام',
  'lib.licence.pd.name': 'النطاق العام',
  'lib.licence.govtIndia.name': 'حكومة الهند',
  'lib.licence.creativeCommons.name': 'كرييتف كومنز (مختلط)',
  'lib.licence.freeToRead.name': 'مجاناً للقراءة',
  'lib.entry.ncert.title': 'كتب NCERT — من الصف الأول إلى الثاني عشر',
  'lib.entry.ncert.what': 'كل كتب كل مادة، لكل صف. بدون تسجيل دخول، ملف PDF مباشر.',
  'lib.entry.ncert.langs': 'الهندية والإنجليزية وأكثر من 30 لغة هندية',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — كتب مدرسية رقمية',
  'lib.entry.pm-evidya.what': 'تطبيق لكتب NCERT، يُقرأ بحروف كبيرة، ويمكن أن يقرأها بصوت مسموع.',
  'lib.entry.pm-evidya.langs': 'اللغات الهندية',
  'lib.entry.diksha.title': 'DIKSHA — للمعلمين والأطفال',
  'lib.entry.diksha.what': 'دروس وفيديوهات وتمارين — من الصف الأول إلى الثاني عشر.',
  'lib.entry.diksha.langs': 'اللغات الهندية',
  'lib.entry.khan-academy.title': 'Khan Academy — الرياضيات والعلوم بالإنجليزية',
  'lib.entry.khan-academy.what': 'دروس مرئية حتى كل صف، مع نص مكتوب أيضاً.',
  'lib.entry.openstax.title': 'OpenStax — كتب مجانية بالإنجليزية',
  'lib.entry.openstax.what': 'كتب بمستوى الجامعة — رياضيات وعلوم وآداب. ملف PDF في كل صفحة.',
  'lib.entry.nios.title': 'NIOS — التعليم عن بعد، مواد مجانية',
  'lib.entry.nios.what': 'كتيّبات مجانية لدورات مفتوحة وعن بُعد، بدون قبول.',
  'lib.entry.nios.langs': 'الهندية والإنجليزية وغيرها',
  'lib.entry.ignou.title': 'IGNOU — كتب مجانية للدراسة المتقدمة',
  'lib.entry.ignou.what': 'كتب التعليم عن بعد، مجانية تماماً.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — كتب إنجليزية قديمة',
  'lib.entry.gutenberg.what': 'أكثر من 70,000 كتاب، جميعها خارج حقوق النشر. كتب إلكترونية وصوتيات مجانية.',
  'lib.entry.pratham-books.title': 'Pratham Books — كتب للأطفال',
  'lib.entry.pratham-books.what': 'كتب أطفال باللغات الهندية، مجانية تماماً. من الصف الأول إلى الخامس.',
  'lib.entry.pratham-books.langs': 'الهندية والمراثية والبنغالية والتاميلية والتيلوغوية وغيرها',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — الصحف والمجلات القديمة',
  'lib.entry.internet-archive-texts.what': 'ملايين الكتب والمجلات والصحف القديمة — مجاناً.',
  'lib.entry.wikisource.title': 'Wikisource — نصوص عامة مجانية',
  'lib.entry.wikisource.what': 'لا حقوق نشر — هذه كتب أدبية قديمة من كل العالم.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — كل أنواع الصور',
  'lib.entry.wikimedia-commons.what': 'حيوانات وخرائط ونجوم وتاريخ — كل شيء. لكل صورة رخصتها الخاصة.',
  'lib.entry.pixabay.title': 'Pixabay — صور ورسومات',
  'lib.entry.pixabay.what': 'صور ورسوم وفيديوهات قصيرة.',
  'lib.entry.unsplash.title': 'Unsplash — صور جميلة',
  'lib.entry.unsplash.what': 'مجاناً وبجودة عالية، بلا حساب.',
  'lib.entry.openverse.title': 'Openverse — كل الصور المجانية في مكان واحد',
  'lib.entry.openverse.what': 'ابحث في عدة مواقع للصور المجانية دفعة واحدة.',
  'lib.entry.librivox.title': 'LibriVox — كتب للاستماع',
  'lib.entry.librivox.what': 'تسجيلات صوتية مجانية لكتب إنجليزية قديمة، بصوت بشري.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — أرشيف صوتي',
  'lib.entry.internet-archive-audio.what': 'آلاف التسجيلات المجانية — كتب ومحاضرات وموسيقى.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — الأنشودة الوطنية وأخرى',
  'lib.entry.vande-mataram.what': 'الأنشودة الوطنية الهندية وأنشودات وطنية أخرى، مجاناً.',
  'art.aag-aur-bijli-ke-bachav.title': 'قواعد الحماية من الحريق والكهرباء',
  'art.aag-aur-bijli-ke-bachav.summary': 'منع الحريق في البيت — قواعد بسيطة',
  'art.aag-lagne-par-kya-karein.title': 'ماذا تفعل عند اندلاع الحريق',
  'art.aag-lagne-par-kya-karein.summary': 'الحريق في بيت يحترق — ماذا تفعل أولاً وماذا لا تفعل',
  'art.bimari-se-bachav.title': 'سبعة قواعد ضد العدوى',
  'art.bimari-se-bachav.summary': 'غسل اليدين والكمامات واللقاح — كيف تبقى بأمان',
  'art.dhuwan-ka-jhakora.title': 'الحماية من اختناق الدخان',
  'art.dhuwan-ka-jhakora.summary': 'اختناق وضيق في النفس — ماذا تفعل ومتى تذهب إلى المستشفى',
  'art.doodh-pani-band-ho.title': 'عندما تنقطع الكهرباء أو الماء فجأة',
  'art.doodh-pani-band-ho.summary': 'ماذا تفعل، وماذا تتجنب، ومتى تطلب المساعدة',
  'art.haath-ki-saafai.title': 'تنظيف اليدين بدون صابون',
  'art.haath-ki-saafai.summary': 'عندما لا يوجد ماء ولا صابون',
  'cat.dhyan-aur-yoog.title': 'اليوغا والتأمل',
  'cat.dhyan-aur-yoog.subtitle': 'طرق بسيطة لتهدئة العقل',
  'cat.gharelu-marammat.title': 'إصلاحات منزلية',
  'cat.gharelu-marammat.subtitle': 'حلول للمشكلات الصغيرة في البيت',
  'cat.bachchon-ki-padhai.title': 'دراسة الأطفال',
  'cat.bachchon-ki-padhai.subtitle': 'يدرسون وهم قلقون',
  'cat.budharge-seva.title': 'رعاية كبار السن',
  'cat.budharge-seva.subtitle': 'رعاية ودعم',
  'cat.shishu-dekhbhal.title': 'رعاية الرضع',
  'cat.shishu-dekhbhal.subtitle': 'رعاية صحية للطفل الصغير',
  'cat.dharmik-upay.title': 'حلول دينية',
  'cat.dharmik-upay.subtitle': 'مع طمأنينة البال',
  'cat.pavan-grah-aur-aarti.title': 'النصوص المقدسة والآرتي',
  'cat.pavan-grah-aur-aarti.subtitle': 'اقرأ وأنصت بإخلاص',
  'cat.aapatkalen-gayide.title': 'دليل الطوارئ',
  'cat.aapatkalen-gayide.subtitle': 'عندما تحتاج المساعدة فوراً',
  'cat.mahamari-suraksha.title': 'الحماية من الأوبئة',
  'cat.mahamari-suraksha.subtitle': 'منع انتشار المرض',
  'nav.reviews': 'آراء', 'nav.support': 'ادعمونا', 'nav.menu': 'القائمة',
  'nav.birthChart': 'ورقة الميلاد',
  'jgd.title': 'ورقة ميلادك',
  'jgd.intro': 'اكتب اسمك وتاريخ ميلادك، وإذا عرفتهما وقت ومكان الميلاد. كل الحسابات تتم على هاتفك وحده ولا يُرسل شيء إلى أي مكان.',
  'jgd.nameLabel': 'الاسم عند الولادة',
  'jgd.namePlaceholder': 'مثلاً الاسم الكامل',
  'jgd.nameHint': 'الاسم الممنوح عند الطفولة.',
  'jgd.dateLabel': 'تاريخ الميلاد',
  'jgd.timeLabel': 'وقت الولادة',
  'jgd.timeHint': 'اتركه فارغًا إن لم تعرفه.',
  'jgd.placeLabel': 'مكان الولادة',
  'jgd.placeNone': 'لا أعرف / اختر',
  'jgd.placeHint': 'اختر مدينة الميلاد.',
  'jgd.submit': 'احسب',
  'jgd.savePdf': 'أنشئ ملف PDF',
  'jgd.again': 'ابدأ من جديد',
  'jgd.errDate': 'اكتب تاريخ الميلاد بصفة صحيحة.',
  'jgd.errPlace': 'اختر مدينتك من القائمة، أو أقرب مدينة إليها.',
  'jgd.numTitle': 'علم الأرقام',
  'jgd.lifePath': 'مسار الحياة',
  'jgd.nameNumber': 'رقم الاسم',
  'jgd.soulNumber': 'رقم الروح',
  'jgd.birthdayNumber': 'رقم يوم الميلاد',
  'jgd.astroTitle': 'الفلك الفيدكي',
  'jgd.nakshatra': 'النجم الفلكي',
  'jgd.pada': 'السِّمة',
  'jgd.rashi': 'البروج',
  'jgd.rashiLord': 'سيد البرج',
  'jgd.nakshatraLord': 'سيد النجم',
  'jgd.lagna': 'الطالع',
  'jgd.lagnaMissing': 'يحتاج الطالع إلى وقت ومكان الولادة. املأهما بالأعلى ثم أعد الحساب — وإن لم تعرفهما فهذا كافٍ.',
  'jgd.gunTitle': 'مطابقة الغُن',
  'jgd.gunIntro': 'اكتب اسم الشخص الآخر وتاريخ ميلاده.',
  'jgd.gunName': 'اسمه',
  'jgd.gunDate': 'تاريخ ميلاده',
  'jgd.gunHint': 'إذا كان للاثنين اسم وتاريخ ميلاد تُحسب المطابقة.',
  'jgd.disclaimer': 'هذه حسابات وفق الطريقة التقليدية وليست تنبؤًا. لا يقرر أي رقم أو برج صحة أحد أو ماله أو علاقاته. خذ القرارات الكبيرة بعد نصيحة طبيب أو محامٍ أو شخص ذي خبرة.',
  'nav.openMenu': 'افتح القائمة', 'nav.closeMenu': 'أغلق القائمة', 'nav.language': 'غيّر اللغة',
  'ask.label': 'اكتب مشكلتك أو تحدث عنها', 'ask.placeholder': 'مثلا: ضعف دراسي عند الطفل',
  'ask.help': 'يمكنك الضغط على Enter للإرسال.', 'ask.send': 'اسأل', 'ask.sending': 'أفكر…',
  'ask.speak': 'اسأل بالصوت', 'ask.listening': 'ابدأ الكلام…',
  'ask.suggested': 'أسئلة شائعة', 'ask.answerTitle': 'الحل', 'ask.listen': 'استمع', 'ask.stopSpeak': 'أوقف',
  'ask.aiNote': 'هذا الرد من الذكاء الاصطناعي وليس بديلا عن المختص.',
  'sound.title': 'صوت للهدوء', 'sound.intro': 'لا رسوم ولا إعلانات.',
  'home.soundTitle': 'صوت للهدوء',
  'sound.shankh': 'الصدفة', 'sound.bansuri': 'الناي', 'sound.dhol': 'الطبول', 'sound.all': 'الثلاثة',
  'dhun.welcome': 'أهلا وسهلا', 'dhun.prompt': 'الصدفة والناي والطبول معًا — المس للاستماع.',
  'dhun.listen': 'استمع', 'dhun.skip': 'تخط',
  'home.emergencyTitle': 'عاجل — نحتاج مساعدة الآن', 'home.emergencyNote': 'اقرأ هذه أولا.',
  'home.readMore': 'اقرأ المعلومات كاملة', 'home.chooseTopic': 'بأي موضوع تريد المعرفة؟',
  'home.askHere': 'اسأل عن هذا الموضوع', 'home.howTitle': 'كيف تعمل هذه الخدمة',
  'home.freeTitle': 'هذه الخدمة مجانية تماما',
  'home.freeBody': 'لا يُطلب أي مقابل، ولا تُطلب بيانات شخصية، ولا تظهر إعلانات.',
  'reviews.title': 'رأيكم، كلمتكم', 'reviews.submit': 'إرسال', 'reviews.comment': 'كلمتك',
  'language.choose': 'اختر لغتك', 'language.articlesIn': 'هذه المقالة بالهندية.',

  'ask.welcome': 'مرحبًا! اكتب مشكلتك في الأسفل أو اختر موضوعًا.',

  'ref.notTitle': 'ما لا تفعله',

  'ref.not1': 'ليست طبيباً. لا يُقدَّم نصيحة دوائية أبداً.',

  'ref.not2': 'ليست محامياً. لا يُقدَّم نصيحة قانونية.',

  'ref.not3': 'لا تُؤخذ أموال، ولا تُعرض إعلانات.',

  'ref.not4': 'لا يُطلب اسمك ولا عنوانك ولا رقم هاتفك، ولا تُحفظ.',

  'ref.not5': 'لا يُختلق سعر أو رقم لأي برنامج حكومي — وإن لم تكن المعلومة معروفة، يُقال ذلك بوضوح.',

  'ref.medicalTitle': 'مهم: هذه ليست نصيحة طبية',

  'ref.medicalBody': 'إن كان الأمر عن مرض أو دواء أو أي مادة سامة، فاذهب إلى الطبيب أولاً. المعلومات هنا للاستعانة العامة فقط. استشر الطبيب قبل أي لقاح للأطفال، أو أثناء الحمل، أو قبل بدء أي دواء.',

  'ref.statsTitle': 'كم من المعلومات متاح',

  'support.howTitle': 'كيف تساعدوننا',

  'support.alwaysFreeTitle': 'ستبقى هذه الخدمة مجانية دائماً',

  'support.alwaysFreeBody': 'كل مساعدة تصل تُنفق على تشغيل الخدمة. لا يُؤخذ مال من أحد أبداً.',

  'smriti.eyebrow': 'تذكارًا',

  'smriti.whyTitle': 'لماذا هذا الموقع',

  'smriti.ending': 'نضالها يستمر من هنا.',

  'article.askAny': 'اطرح سؤالًا',

  'article.remember': 'تذكّر',

  'article.emergencyInfo': 'معلومات مهمة',

  'article.medicalTitle': 'هذه ليست نصيحة طبية',

  'article.medicalBody': 'هذه المعلومات مساعدة عامة. لا تبدأ دواء أو توقفه دون طبيب.',

  'article.heading': 'مقالات عن {category}',

  'reviews.rateQuestion': 'كم نجمة ستعطي؟',

  'reviews.starsShort': '{value} نجوم',

  'reviews.averageOutOf': '{value} من 5 نجوم',

  'dhun.welcomeTitle': 'أهلًا وسهلًا',

  'dhun.consent': 'صدفة وناي وطبلة معًا. المس للاستماع.',

  'dhun.failed': 'تعذّر تشغيل الصوت.',

  'dhun.unsupported': 'هذا المتصفح لا يستطيع تشغيل الصوت.',

  'dhun.failedTry': 'حدثت مشكلة في تشغيل الصوت.',

  'sound.hintIdle': 'اضغط أي زر للاستماع إلى الصوت.',

  'sound.hintPlaying': 'الصوت يعمل. اضغط الزر نفسه لإيقافه.',

  'sound.preparing': 'جارٍ تجهيز الصوت',

  'nav.path': 'المسار',

  'toast.dismiss': 'إغلاق',

  'footer.free': 'هذه الخدمة مجانية تمامًا. لا يُطلب مال من أحد.',

  'footer.pages': 'الصفحات',

  'footer.helplines': 'أرقام مهمة',

  'cat.empty': 'لا توجد مقالات في هذا الموضوع بعد.',
  'cat.notFound': 'هذه الصفحة غير موجودة',

  'dhun.label': 'الإذن بتشغيل الصوت',

  'language.articlesInHint': 'كل لغة تحتاج ترجمة خاصة. هذه الترجمة لم تُنجَز بعد — والنص المكتوب هو الأدق والأكمل بالهندية.',

  'nav.collapse': 'أغلق الشريط',

  'nav.expand': 'وسّع الشريط',

  'nav.skip': 'تخطَّ إلى المحتوى مباشرة',

  'theme.toDark': 'انتقل إلى المظهر الداكن',

  'theme.toLight': 'انتقل إلى المظهر الفاتح',

  'ask.clear': 'امسح ما كتبته',

  'ask.emptyAnswer': 'لم تُنشأ إجابة هذه المرة. صُغ سؤالك بصيغة أخرى وأعد المحاولة.',

  'ask.errorNetwork': 'الإنترنت لا يعمل. افحص الاتصال ثم أعد المحاولة.',

  'ask.errorRateLimit': 'تم إرسال أسئلة كثيرة دفعة واحدة. أعد المحاولة بعد قليل.',

  'ask.heardWith': 'نسمع الآن',
  'ask.heard': 'نستمع',

  'ask.micUnsupported': 'السؤال بالصوت لن يعمل في هذا المتصفح. اكتب سؤالك بدلاً من ذلك.',

  'ask.notAnswer': 'ليس لدينا جواب مباشر عن هذا السؤال.',


  'ask.stopListening': 'إيقاف الاستماع',

  'article.askAbout': 'اسأل عن هذا الموضوع',

  'article.count': '{count} مقالات',

  'article.emergency': 'عاجل',

  'article.others': 'مزيد من المقالات في هذا الموضوع',

  'article.readAloud': 'استمع إلى هذه المقالة',

  'footer.admin': 'المسؤول',

  'footer.ambulance': 'الإسعاف',

  'footer.emergency': 'طوارئ',

  'footer.readStory': 'اقرأ قصتها كاملة',

  'footer.rights': 'خدمة مجانية',

  'footer.women': 'خط مساعدة النساء',

  'sound.allHint': 'معًا',

  'sound.bansuriHint': 'لطيفة، هادئة',

  'sound.dholHint': 'قوية، سريعة',

  'sound.errGeneric': 'حدثت مشكلة في تشغيل الصوت.',

  'sound.errUnsupported': 'هذا المتصفح لا يستطيع تشغيل الصوت.',

  'sound.listenLabel': 'استمع',

  'sound.playing': 'الصوت يعمل. اضغط الزر نفسه لإيقافه.',

  'sound.shankhHint': 'عميقة، طويلة',

  'voice.aborted': 'توقف. أعد المحاولة.',

  'voice.audioCapture': 'لم يُعثر على الميكروفون. وصّل الجهاز، أو اكتب سؤالك.',

  'voice.generic': 'حدث خطأ ما. أعد المحاولة.',

  'voice.network': 'السؤال بالصوت يحتاج إنترنت، وهو غير متاح. اكتب سؤالك — ستحصل على نفس الإجابة.',

  'voice.noSpeech': 'لم يُسمع أي صوت. تحدّث قرب الميكروفون، أو اكتب.',

  'voice.notAllowed': 'لم يُمنح الإذن للميكروفون. اذهب إلى الأعلى وامنح الإذن، أو اكتب سؤالك.',

  'voice.serviceNotAllowed': 'لم يُمنح الإذن للميكروفون. اذهب إلى الأعلى وامنح الإذن، أو اكتب سؤالك.',

  'voice.speakFailed': 'تعذّرت قراءة هذه الإجابة صوتيًا.',
  'voice.noVoice': 'لا يوجد في هذا الجهاز صوت لغة {name}. اقرأ النص الآن، أو أضِف الصوت من إعدادات الهاتف.',

  'voice.unsupported': 'السؤال بالصوت لن يعمل في هذا المتصفح. اكتب سؤالك بدلاً من ذلك.',

  'ask.notConfigured': 'تخدم هذه الخدمة حالياً من مكتبتها المحفوظة. لم يظهر سؤالك فيها.',

  'ask.browseTitle': 'هنا المقالات المتاحة',

  'health.heading': 'أخبر عن عمرك',

  'health.intro': 'الأسئلة التي تُطرح كثيراً بحسب العمر ستظهر هنا. اضغط أي زر — يُكتب السؤال بالأسفل ثم اسأل.',

  'health.ageLabel': 'العمر (سنوات)',

  'health.years': 'سنوات',

  'health.bandsLabel': 'اختر حسب العمر',

  'health.notAdviceStrong': 'هذه ليست نصيحة طبية.',

  'health.notAdvice': 'لا تبدأ أي دواء ولا توقفه — اذهب إلى الطبيب أولاً.',

  'health.emergencyStrong': 'اتصل في الطوارئ:',

  'health.emergencyCall': '(طوارئ)',

  'health.emergencyAmbulance': '(إسعاف)',

  'health.emergencyWomen': '(خط دعم المرأة)',

  'health.privacy': 'لا حاجة لكتابة اسمك أو عنوانك.',

  'health.band.infant.label': '0 – 2 سنة',

  'health.band.child.label': '3 – 12 سنة',

  'health.band.teen.label': '13 – 17 سنة',

  'health.band.young.label': '18 – 30 سنة',

  'health.band.middle.label': '31 – 45 سنة',

  'health.band.later.label': '46 – 60 سنة',

  'health.band.senior.label': '61 – 75 سنة',

  'health.band.elder.label': '76 – 100 سنة',

  /* ---- save / download ---- */

  'download.pdf': 'حفظ كملف PDF',
  'download.text': 'حفظ كنص',
  'download.printNow': 'طباعة',
  'download.preparing': 'جارٍ التحضير',
  'download.blocked': 'تعذر فتح تبويب جديد. المتصفح يحجب النوافذ المنبثقة — اسمح له.',

  /* ---- attach a document ---- */

  'attach.button': 'أرفق مستندك أو صورتك',
  'attach.formats': 'PDF أو صورة (JPG/PNG) أو ملف نصي — حتى 12 ميجابايت',
  'attach.reading': 'جارٍ القراءة…',
  'attach.attached': 'تم الإرفاق',
  'attach.remove': 'إزالة',
  'attach.tooBigPdf': 'هذا الملف أكبر من 12 ميجابايت. اختر ملفًا أصغر.',
  'attach.tooBigImage': 'هذه الصورة أكبر من 3 ميجابايت. اختر صورة أصغر.',
  'attach.scannedPdf': 'هذا PDF مسحوب ضوئيًا — يحتوي على صورة الصفحة فقط ولا يمكن قراءته. أرسل صورة فوتوغرافية له بدلًا من ذلك.',
  'attach.pdfFailed': 'تعذّرت قراءة هذا الملف.',
  'attach.imageFailed': 'تعذّر تحميل هذه الصورة.',
  'attach.wrongType': 'هذا النوع من الملفات غير صالح. أرسل PDF أو صورة أو ملفًا نصيًا.',
  'attach.hint': 'أرفق ورقتك هنا واطرح سؤالك — سيكون الجواب عن تلك الورقة.',
  'ask.sendWithFile': 'أجب عن هذا',

  /* ---- free library ---- */

  'lib.title': 'مكتبة مجانية',
  'lib.intro': 'كتب مدرسية وكتب وصور وصوت — كلها مجانية وقانونية.',
  'lib.legalTitle': 'لا مشكلة في حقوق النشر.',
  'lib.legal': 'كل ما هنا مجاني تماماً ويمكنك مشاركته. الكتاب الذي ما زال محمياً بحقوق النشر ليس هنا — فنسخه غير مسموح، والقول ذلك بصراحة أفضل.',
  'ask.signInTitle': 'سجّل الدخول أولاً',
  'ask.signInBody': 'أنشئ حسابًا لتسأل سؤالًا. يستغرق أقل من دقيقة، ثم يمكنك مواصلة السؤال.',
  'ask.signInCta': 'أنشئ حسابًا أو سجّل الدخول',
  'ask.signInFirst': 'سجّل الدخول أولاً، ثم اسأل سؤالك.',
  'ask.signInOr': 'لا تستطيع إنشاء حساب الآن؟ هذه تعمل بدون حساب:',
  'account.title': 'حسابي',
  'account.intro': 'سجّل الدخول باسمك وكلمة مرورك.',
  'account.signIn': 'تسجيل الدخول',
  'account.register': 'أنشئ حسابا',
  'account.signInNote': 'استخدم الاسم وكلمة المرور السابقين.',
  'account.registerNote': 'لا حاجة إلى حساب لطرح السؤال — هذا فقط ليبقى سؤالك وجواباتك بلغتك.',
  'account.handle': 'اسمك',
  'account.handlePlaceholder': 'مثلاً sita.ji',
  'account.password': 'كلمة المرور',
  'account.passwordHint': 'ستة أحرف على الأقل.',
  'account.phone': 'رقم الهاتف',
  'account.optional': 'غير مطلوب',
  'account.phoneHint': 'أعطه إن أردت. يمكن إنشاء الحساب بدونه أيضًا.',
  'account.create': 'أنشئ الحساب',
  'account.logout': 'تسجيل الخروج',
  'account.open': 'افتح الحساب',
  'account.signedInAs': 'أنت مسجل الدخول',
  'account.signedOut': 'لم تسجل الدخول',
  'account.signedOutBody': 'لا يوجد حساب مفتوح في هذا المتصفح.',
  'account.saved': 'الإجابات المحفوظة',
  'account.savedEmpty': 'لا شيء محفوظ بعد. اضغط حفظ على الإجابة.',
  'account.savedUnavailable': 'الإجابات المحفوظة لا تظهر الآن. كل شيء آخر يعمل.',
  'account.wait': 'من فضلك انتظر…',
  'account.privacyTitle': 'ما نحتفظ به',
  'account.privacyBody': 'يخزّن الحساب اسمك وكلمة مرورك ولغتك فقط. لا يُسجَّل ما تسأل، ولا يُرسل سؤالك إلى أحد.',
  'account.errWrong': 'الاسم أو كلمة المرور غير صحيحة.',
  'account.errTaken': 'هذا الاسم محجوز. اختر اسمًا آخر.',
  'account.errBad': 'من فضلك املأ الاستمارة بشكل صحيح.',
  'account.errWait': 'محاولات كثيرة. حاول بعد قليل.',
  'account.errTryLater': 'لم ينجح الآن. حاول بعد قليل.',
  'lib.licence.ccBy': 'يمكنك نسخها ومشاركتها وطباعتها بشرط ذكر المصدر.',
  'lib.licence.ccBySa': 'يمكنك نسخها وطباعتها. أي تعديل تجريه يجب أن يُشارك مفتوحًا أيضًا.',
  'lib.licence.ccZero': 'حر تمامًا. حتى ذكر المصدر غير مطلوب.',
  'lib.licence.pd': 'لا أحد يملك حقوق النشر — انسخها كما تشاء.',
  'lib.licence.govtIndia': 'على موقع حكومي هندي. القراءة والطباعة مجانًا.',
  'lib.licence.creativeCommons': 'لكل ملف رخصته الخاصة: افحص الملف.',
  'lib.licence.freeToRead': 'القراءة مجانية. والمشاركة مسموحة بالشروط نفسها.',
  'lib.openBadge': 'مفتوح',
  'lib.openBadgeNote': 'يمكنك نسخه',
  'lib.freeBadge': 'مجاني',
  'lib.freeBadgeNote': 'للقراءة، لا للنسخ',
  'lib.govt': 'حكومي',
  'lib.noSignup': 'بلا حساب',
  'lib.open': 'افتحه',
  'lib.group.padhai': 'الكتب الدراسية',
  'lib.group.padhai.note': 'كتب مدرسية ومواد جامعية وتعليمية حكومية',
  'lib.group.kitab': 'الكتب',
  'lib.group.kitab.note': 'ما انتهت حقوقها، أو ما يُسمح بنسخه',
  'lib.group.tasveer': 'الصور والرسوم',
  'lib.group.tasveer.note': 'خرائط وصور ورسوم — كل شيء',
  'lib.group.audio': 'ما يُسمع',
  'lib.group.audio.note': 'كتب صوتية لمن لا يريد قراءة الحروف الصغيرة',
  'lib.warnTitle': 'ليست كل الكتب هنا',
  'lib.warn': 'بعض الكتب ما زالت محمية بحقوق النشر ولا يمكن تقديمها مجاناً قانوناً. لذلك لم ندرجها عن قصد. إن كنت تحتاج أحدها فاسأل بالأسفل — وما يمكن الإجابة عنه سيُجاب عنه.',
  'lib.askInstead': 'اسأل بدلاً من ذلك',
  'nav.library': 'المكتبة',

  'help.title': 'اكتب مشكلتك',

  'help.intro': 'اكتب في الأسفل أو تحدّث. وإن لم تعرف فاكتب ما يخطر ببالك — هذا أهم شيء.',

  'help.howTitle': 'كيف تعمل هذه الخدمة',

  'help.howBody': 'كل سؤال يُسجَّل ويصل جوابه فوراً. لا يُؤخذ اسمك ولا عنوانك ولا رقم هاتفك في أي مكان. كل شيء مجاني.',

  'help.suggested': 'أسئلة شائعة',

  'help.q1.label': 'الكهرباء انقطعت، ماذا أفعل؟',

  'help.q1.question': 'انقطعت الكهرباء في البيت. ماذا يجب أن أفعل، وكيف أشحن الهاتف؟',

  'help.q2.label': 'ضعف في درس الأولاد',

  'help.q2.question': 'ابني يتعثر كثيراً في الدراسة. كيف أحسّن دراسته في البيت؟',

  'help.q3.label': 'علاج كبار السن',

  'help.q3.question': 'والدي كبير في السن جداً، كيف أعتني بعلاجه؟',

  'help.q4.label': 'إذا اشتعل الحريق في البيت',

  'help.q4.question': 'إذا اشتعل الحريق في البيت ليلاً، فما أول ما يجب فعله؟',

  'home.stepLabel': 'خطوة',

  'home.step1Title': 'اكتب كلامك أو تحدّث',

  'home.step1Body': 'اكتب بالعربية، أو اضغط الميكروفون وتحدّث. لا حاجة إلى أي شيء خاص — اكتب ما يخطر ببالك.',

  'home.step2Title': 'الجواب يصل فوراً',

  'home.step2Body': 'كل سؤال يُسجَّل ويصل جوابه فوراً. ابدأ بسؤال صغير قبل أن تسأل سؤالاً طويلاً.',

  'home.step3Title': 'لا مال ولا معلومات شخصية',

  'home.step3Body': 'هذه الخدمة مجانية تماماً. لا يُطلب اسمك ولا عنوانك ولا رقم هاتفك، ولا تظهر أي إعلانات.',

  'home.memorialEyebrow': 'هذا الموقع من أجل',
  'home.memorialLine': 'من قاومت طوال حياتها من أجل المجتمع، ولم تحصل في النهاية على نصيبها.',
  'home.memorialMore': 'اقرأ قصتها كاملة',
  'home.kundaliTitle': 'مخطط الميلاد',
  'home.kundaliNote': 'خريطة كاملة — الكواكب التسعة، فيمشوتتاري داشا، فالاديش، يوغا، شوداشفارغ، كي بي، كتاب لال والأرقام الفلكية. كل شيء يُحسب على هاتفك.',
  'home.chooseTopicNote': 'اضغط على الموضوع أدناه. المعلومات مكتوبة بلغة بسيطة في كل مكان.',

  'home.categoryEmpty': 'لم يُكتب شيء في هذا الموضوع بعد.',

  'home.soundIntro': 'لا رسوم ولا إعلانات. فقط لتهدئة النفس.',

  'home.dedication1': 'في الذاكرة — خدمة مجانية تماماً.',

  'home.dedication2': 'اكتب مشكلتك أو تحدّث.',

  'ref.title': 'ما هي هذه الخدمة، ولمن هي',

  'ref.intro': 'أُنشئت هذه الخدمة تكريماً للسيدة VARSHA. ويبيَّن هنا بلغة بسيطة ما تفعله، وما فيها، وحدودها. كل شيء مجاني تماماً — لا تُؤخذ أموال، ولا تُعرض إعلانات، ولا تُطلب بيانات شخصية.',

  'ref.whatTitle': 'ماذا فيها',

  'ref.what1': 'حريق في البيت، انقطاع الكهرباء، ضعف في دراسة الأولاد، رعاية الوالدين — حلول بسيطة للمشكلات الشائعة، بلغة واضحة.',

  'ref.what2': 'إمكانية سؤال بصوتك. وإن لم تستطع فاكتب — الجواب واحد في الحالتين.',

  'ref.what3': 'كل سؤال يُسجَّل، فما يضايق الآخرين يكون قد سُئل من قبلك وأُجيب عنه.',

  'ref.what4': 'لا إعلانات، ولا معلومات زائدة، ولا بيانات شخصية. كل شيء مجاني.',

  'ref.statsArticles': 'مقالات كُتبت',

  'ref.statsCategories': 'موضوعات متاحة',

  'ref.statsQuestions': 'أسئلة سُئلت',

  'ref.adminTitle': 'ما يستطيع المشرفون',

  'ref.adminBody': 'يمكن للمشرفين قراءة المقالات التي ترسلها والرد عليها. لا يستطيعون تعديل أي مقال أو حذفه دون إذنك، ولا يبيعون معلوماتك لأحد.',

  'ref.dataTitle': 'ما نحتفظ به عنك',

  'ref.dataBody': 'سؤالك الذي سألته، وملخصه، ووقت السؤال فقط — كي لا نكرر الجواب نفسه. لا يُؤخذ اسمك ولا عنوانك ولا رقم هاتفك ولا أي معلومة تعرّف بهما. لا إعلانات ولا أدوات تتبع في الموقع.',

  'ref.helplineTitle': 'احتفظ بهذه الأرقام للطوارئ',

  'ref.helpline1': 'خطر كبير — حريق، اهتزاز كهرباء، سقوط، أو نزيف شديد — فاتصل على 112.',

  'ref.helpline2': 'إن كان أحد مريضاً أو مصاباً ولا وسيلة نقل، اطلب إسعافاً على 108.',

  'ref.helpline3': 'إن حدث ضرر لامرأة، كانت امرأة تتعرض للإزعاج من مكان ما، فاتصل على 181. وهو مجاني.',

  'ref.helpline4': 'إن تعرض طفل أو مسن للظلم، يمكن تقديم شكوى على 1098.',

  'ref.helpline5': 'إن كان الضغط النفسي شديداً جداً، أو فقدت الرغبة في الحياة، يمكنك التحدث على 14416. للتحدث فقط.',

  'ref.ownerNote': 'هذه الخدمة ليست شركة ولا حكومة، بل تعمل ذكرى شخص واحد. ولذلك لا إعلانات هنا، ولا عضويات، ولا أموال تُؤخذ.',

  'support.title': 'هذه الخدمة مجانية',

  'support.intro': 'هذه الخدمة لا تأخذ مالاً من أحد. لكنها تعمل — ولذلك هناك طرق يمكنك أن تساعد بها. أسهل طريقة هي أكثرها نفعاً.',

  'support.contactTitle': 'هل من شيء تريد قوله؟',

  'support.contactBody': 'يمكنك الكتابة هنا لأي شيء — إن كان هناك خطأ، أو إن زادك أمر، أو إن كان لديك سؤال. اكتب بقدر ما تجده سهلاً.',

  'support.faqTitle': 'أسئلة تُطرح مراراً',

  'support.faqBody': 'هل هي مجانية فعلاً؟ نعم. هل يُؤخذ اسمك؟ لا، الاسم ليس مطلوباً. هل تظهر إعلانات؟ لا. هل يُطلب رقم هاتف أو عنوان؟ لا. هل عليّ تحميل أي تطبيق؟ لا، تُفتح في المتصفح فقط.',

  'support.waysTitle': 'كيف يمكنك المساعدة',

  'support.way1Title': 'اكتب تجربتك',

  'support.way1Body': 'إذا أفادك هذا الموقع شيئاً — أو إن وجدتم شيئاً أربكك — فاكتبه في صفحة الآراء. لا حاجة لأخذ اسمك.',

  'support.way2Title': 'أخبر عن مدينتك',

  'support.way2Body': 'اللغة والعادات والمشاكل تختلف في المكان الذي تعيش فيه. إن كان هناك شيء في مدينتك غير موجود هنا، فاذكره — ما يمكن إضافته سيُضاف.',

  'support.way3Title': 'احكِ تجربتك لشخص آخر',

  'support.way3Body': 'ما كُتب هنا قد يفيد كثيرين، إن علموا به. أخبر به من ينفعه فعلاً.',

  'support.way4Title': 'تعال وانظر بنفسك',

  'support.way4Body': 'إن كان لديك وقت، فتعال وشاهد هل يعمل الموقع كما ينبغي. إن رأيت خللاً فأخبر — سيُصلح مجاناً تماماً.',

  'reviews.pageTitle': 'رأيكم',

  'reviews.pageIntro': ' هنا مكتوب ما كتبه الناس فعلاً. لا يُخفى رأي، وما كُتب يظهر هنا — يُنشر بعد مراجعة واحدة فقط.',

  'reviews.intro': 'هل أفادتك هذه الخدمة؟ اكتب كلمتك — لا حاجة لأخذ اسمك.',

  'reviews.write': 'اكتب رأيك',

  'reviews.starsLabel': '{value} من 5 نجوم',

  'reviews.summaryTitle': 'الآراء الشائعة',

  'reviews.summaryLine': 'منح الناس {rating} من 5، أي {count} نجوم في المتوسط.',

  'reviews.count': 'الآراء',

  'reviews.name': 'اسمك (غير مطلوب)',

  'reviews.city': 'مدينتك (غير مطلوبة)',

  'reviews.placeholder': 'اكتب ما يخطر ببالك — لا حاجة لتصحيح شيء.',

  'reviews.keepLabel': 'سواء أسيئ أو أحسنت — اكتب كليهما',

  'reviews.fieldTooShort': 'اكتب 10 أحرف على الأقل.',

  'reviews.rateLimited': 'الإرسال سريع جداً. انتظر قليلاً ثم أعد المحاولة.',

  'reviews.sending': 'جارٍ الإرسال…',

  'reviews.moderated': 'تُراجَع آراؤك مرة واحدة قبل نشرها.',

  'reviews.moderationNote': 'لتجنّب حذف كل شيء، تُراجَع كل مراجعة مرة واحدة قبل نشرها. تُحذف الألفاظ النابية والأرقام والتفاصيل الشخصية — وما عداها يُنشر كما هو.',

  'reviews.replyLabel': 'كُتب عن هذا',

  'reviews.ownerReply': 'رد',

  'reviews.empty': 'لا توجد مراجعات بعد. اكتب أول واحدة.',

  'reviews.anonymous': 'بدون اسم',

  'reviews.toastSent': 'شكراً',

  'reviews.toastFailed': 'تعذّر إرسال الرأي',

  'health.band.infant.note': 'أطفال صغار، لا يزالون لا يستطيعون قول ما يريدون',

  'health.band.child.note': 'أطفال يتحدثون، لكنهم يخافون من السؤال',

  'health.band.teen.note': 'مراهقون، لا يجدون غالباً من يستمع إليهم',

  'health.band.young.note': 'العمل والمال والنوم — عبء الثلاثة معاً',

  'health.band.middle.note': 'البيت والأطفال وصحة النفس — مسؤولية الجميع دفعة واحدة',

  'health.band.later.note': 'سنّ الجسد والعناية به — معاً',

  'health.band.senior.note': 'الدواء والتوازن والعزلة — الثلاثة معاً',

  'health.band.elder.note': 'فحص كل دواء ضروري، وكل سقطة أمر جاد',

  'health.c.infant1': 'حمّى شديدة',

  'health.c.infant2': 'لا يأكل',

  'health.c.infant3': 'يتقيّأ',

  'health.c.infant4': 'إسهال',

  'health.c.child1': 'لا رغبة في الدراسة',

  'health.c.child2': 'لا يذهب إلى المدرسة',

  'health.c.child3': 'حمّى ليلاً',

  'health.c.child4': 'الأسنان تتكسر',

  'health.c.teen1': 'ضغط الدراسة',

  'health.c.teen2': 'لا ينام',

  'health.c.teen3': 'إدمان الهاتف',

  'health.c.teen4': 'حزن شديد',

  'health.c.young1': 'ضغط العمل',

  'health.c.young2': 'ألم الظهر من الجلوس',

  'health.c.young3': 'لا ينام',

  'health.c.young4': 'المال قليل',

  'health.c.middle1': 'ألم أسفل الظهر',

  'health.c.middle2': 'النوم غير مضبوط',

  'health.c.middle3': 'ضغط البيت',

  'health.c.middle4': 'غازات في البطن',

  'health.c.later1': 'ألم الظهر',

  'health.c.later2': 'ألم الركبة',

  'health.c.later3': 'تشنّج في الساق ليلاً',

  'health.c.later4': 'تيبّس الصباح',

  'health.c.senior1': 'مشكلة في المشي',

  'health.c.senior2': 'مراجعة الأدوية',

  'health.c.senior3': 'تبوّل ليلاً',

  'health.c.senior4': 'ضعف السمع',

  'health.c.elder1': 'خوف من السقوط',

  'health.c.elder2': 'ضعف الذاكرة',

  'health.c.elder3': 'مسكّن للألم يومياً',

  'health.c.elder4': 'متى تزور الطبيب',

  'health.q.infant1': 'ابني مصاب بحمّى، هل أعطيه الحليب؟',

  'health.q.infant2': 'الطفل الصغير لا يأكل، ماذا أفعل؟',

  'health.q.infant3': 'ابني يتقيّأ، متى أعرضه على الطبيب؟',

  'health.q.infant4': 'ابني مصاب بالإسهال، ماذا أطعمه؟',

  'health.q.child1': 'ابني لا يركّز في الدراسة، ماذا أفعل؟',

  'health.q.child2': 'ابني يرفض الذهاب إلى المدرسة كل يوم، ما السبب؟',

  'health.q.child3': 'ابني تصيبه حمّى ليلاً، ماذا أفعل؟',

  'health.q.child4': 'أسنان ابني تتكسر، كيف أعتني بها؟',

  'health.q.teen1': 'الضغط على الدراسة كبير، كيف أتعامل معه؟',

  'health.q.teen2': 'لا أنام جيداً في الليل، ماذا أفعل؟',

  'health.q.teen3': 'أصبحت مدمناً للهاتف، ما طريقة التوقف؟',

  'health.q.teen4': 'أشعر بحزن شديد، مع من أتحدث؟',

  'health.q.young1': 'ضغط العمل كبير جداً، كيف أخفّضه؟',

  'health.q.young2': 'وجع ظهري من الجلوس، ماذا أفعل؟',

  'health.q.young3': 'لا ينام في الليل، ما الحل؟',

  'health.q.young4': 'المال قليل والصرف كثير، ماذا أفعل؟',

  'health.q.middle1': 'أشعر بألم أسفل الظهر، ما السبب؟',

  'health.q.middle2': 'النوم غير جيد، كيف أحسّنه؟',

  'health.q.middle3': 'الضغط في البيت كبير، كيف أعتني بالأولاد؟',

  'health.q.middle4': 'غازات في البطن منذ سنوات في العمل، ماذا أفعل؟',

  'health.q.later1': 'عمري 54 سنة ويؤلمني ظهري، ماذا أفعل؟',

  'health.q.later2': 'ألم في الركبة عند صعود الدرج، لماذا؟',

  'health.q.later3': 'تشنّج في الساق ليلاً، ماذا أفعل؟',

  'health.q.later4': 'تيبّس أسفل الظهر عند الاستيقاظ، ما السبب؟',

  'health.q.senior1': 'ألم الركبتين شديد وصراحة صعوب المشي، ماذا أفعل؟',

  'health.q.senior2': 'آخذ عدة أدوية يومياً — كيف أعرف أيها ضار؟',

  'health.q.senior3': 'تبوّل متكرر ليلاً، ماذا أفعل؟',

  'health.q.senior4': 'سمع ضعيف، هل من وسيلة ل تحسين السمع؟',

  'health.q.elder1': 'أخاف السقوط في البيت، أي احتياط أتخذ؟',

  'health.q.elder2': 'ذاكرتي تضعف، ماذا أفعل؟',

  'health.q.elder3': 'آخذ مسكّن للألم يومياً — هل له ضرر؟',

  'health.q.elder4': 'متى يجب أن أزور الطبيب؟',

  'support.contactMessageLabel': 'كلمتك',

  'support.contactPlaceholder': 'اكتب ما تريد — خطأ، أو شيء جيد حدث، أو سؤال عندك.',

  'support.contactHelp': 'عشرة أحرف على الأقل. يذهب هذا مباشرة إلى المالك.',

  'support.contactSubmit': 'إرسال',

  'support.contactSending': 'جارٍ الإرسال…',

  'support.contactPrivacy': 'كتابة اسمك ليست مطلوبة.',

  'support.contactSent': 'وصل',

  'support.contactSentBody': 'وصلت كلمتك إلى المالك.',

  'support.contactFailed': 'تعذّر الإرسال',

  'support.faq1Q': 'هل هي مجانية فعلاً؟',

  'support.faq1A': 'نعم. لا تُؤخذ أموال، ولا تُعرض إعلانات، ولا تُطلب عضوية. تعمل بمال شخص واحد، لا بمال شركة ولا حكومة.',

  'support.faq2Q': 'هل يُؤخذ اسمي أو عنواني أو رقم هاتفي؟',

  'support.faq2A': 'لا، ولن يُؤخذ. الموقع لا ينشئ عنك أي تعريف — لا تسجيل دخول، ولا أدوات تتبع. ما يُسأل هو سؤالك وحده، ولا يُحفظ إلا ذلك.',

  'support.faq3Q': 'هل هو طبيب أو محامٍ؟',

  'support.faq3A': 'لا. لا يعطي نصيحة دوائية ولا قانونية. وحين تكون المسألة خطيرة يقول لك إن تذهب إلى طبيب أو مسؤول — لا يأخذ مكانهما.',

  'support.faq4Q': 'هل كل إجابة صحيحة؟',

  'support.faq4A': 'ليس دائماً. الإجابة يكتبها حاسوب لا طبيب — ولذلك كُتب مع كل إجابة أنها ليست نصيحة طبية. استشر الطبيب قبل بدء أي دواء أو إيقافه.',

  'support.faq5Q': 'هل عليّ تحميل أي تطبيق؟',

  'support.faq5A': 'لا. تُفتح في المتصفح فقط. لا تثبيت تطبيق، ولا أذونات، ولا تحديثات.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'علاج منزلي',
  'remedy.title': 'علاج أيورفيدي منزلي',
  'remedy.intro': 'أيًا كان ما يؤلمك — السعال، الصداع، التهاب المفاصل، الحكة، السكري، ألم الظهر — اختره أدناه أو اسأل بكلماتك. ستُذكر لك الكشاية المنزلية والتدليك والغذاء والطرق الأيورفيدية.',
  'remedy.choose': 'اختر ما يؤلمك',
  'remedy.emergencyStrong': 'هذه حالات طارئة:',
  'remedy.emergency': 'لدغة الأفعى ولسعة العقرب وعضّة الكلب — اذهب إلى المستشفى فورًا، واتصل أولًا بالرقم 112. الوسائل المنزلية للطريق فقط، وليست بديلًا عن المستشفى.',
  'remedy.note': 'الوسائل المنزلية والأيورفيدية تساعد على تخفيف الألم؛ وهي لا تغني عن فحص الطبيب وعلاجه. لا تبدأ أي دواء أو توقفه من تلقاء نفسك.',
  'remedy.cough': 'السعال',
  'remedy.headache': 'الصداع',
  'remedy.joints': 'التهاب المفاصل',
  'remedy.itching': 'الحكة',
  'remedy.snake': 'لدغة أفعى',
  'remedy.scorpion': 'لسعة عقرب',
  'remedy.dog': 'عضّة كلب',
  'remedy.diabetes': 'السكري',
  'remedy.back': 'ألم الظهر',
  'remedy.walking': 'صعوبة المشي',
  'home.remedyNote': 'كشاية وتدليك وغذاء وطرق أيورفيدية — لكل ألم، بلغتك.',
  'nav.aarti': 'آرتي وبجان',
  'aarti.title': 'آرتي وبجان — بصوت حقيقي',
  'aarti.intro': 'استمع هنا إلى الآرتي والكيرتان والبجان بأصوات مغنين حقيقيين ومعابد حقيقية. لا صوت ذكاء اصطناعي.',
  'aarti.note': 'تشغيل الآرتي أو البجان بصوت حاسوب يفقدها إيقاعها وروحانيتها، لذلك كل ما هنا تسجيلات حقيقية.',
  'aarti.kindAarti': 'آرتي',
  'aarti.kindKirtan': 'كيرتان',
  'aarti.kindBhajan': 'بجان',
  'aarti.credit': 'التسجيل:',
  'aarti.licence': 'الترخيص:',
  'aarti.listenLink': 'استمع بصوت حقيقي',
  'aarti.textChecked': 'هذا هو النص التقليدي كما يُنشد في التسجيل الأصلي.',
  'aarti.textPrinted': 'هذا نص متداول، تم التحقق منه بمقارنته بمجموعات منشورة.',
  'aarti.textNotStored': 'النص الكامل لهذا الكتاب غير محفوظ هنا — التسجيل أدناه يحمل النص كاملًا.',
  'aarti.granthTitle': 'الكتب المقدسة والچاليسا والستوترا — بصوت حقيقي',
  'aarti.noRecording': 'لا يوجد تسجيل حقيقي لهذا الآرتي على الموقع بعد، لذلك لا أستطيع أن أغنيه لك — لا يُغنّى الآرتي أبدًا بصوت اصطناعي.',
  'aarti.textOnlyTitle': 'المزيد من الآرتي — النص والصوت الحقيقي',
  'aarti.fullText': 'النص الكامل',
  'aarti.notChecked': 'نص هذه الآرتي المُحقَّق ليس على الموقع بعد. لا يُعطى نص غير محقَّق، لأن كلمة خاطئة في دعاء أسوأ من لا كلمات.',
  'aarti.verifiedList': 'الموقع فيه نصوص محقَّقة لهذه الآرتيات:',

};

const SPANISH: Record<string, string> = {
  'jgd.placeSearch': 'Escribe el nombre de tu pueblo',
  'jgd.placeNoMatch': 'Ese pueblo no está en la lista. Elige el más cercano.',

  'account.name': 'Tu nombre',
  'account.namePlaceholder': 'p. ej. Sita Devi',
  'account.nameHint': 'Para saber quién eres. Cualquier nombre sirve y no es obligatorio.',

  'nav.home': 'Inicio', 'home.metaTitle': 'Soluciones gratis, en tus propias palabras', 'nav.tribute': 'En memoria', 'nav.help': 'Ayuda', 'nav.reference': 'Acerca de',
  'lib.licence.ccZero.name': 'CC0 / Dominio público',
  'lib.licence.pd.name': 'Dominio público',
  'lib.licence.govtIndia.name': 'Gobierno de la India',
  'lib.licence.creativeCommons.name': 'Creative Commons (mixto)',
  'lib.licence.freeToRead.name': 'Gratis para leer',
  'lib.entry.ncert.title': 'Libros NCERT — de 1.º a 12.º',
  'lib.entry.ncert.what': 'Todos los libros de cada materia, para cada clase. Sin iniciar sesión, PDF directo.',
  'lib.entry.ncert.langs': 'Hindi, inglés y más de 30 idiomas de la India',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — libros de texto digitales',
  'lib.entry.pm-evidya.what': 'Una app con los libros NCERT, con letra grande, y también puede leerlos en voz alta.',
  'lib.entry.pm-evidya.langs': 'Idiomas de la India',
  'lib.entry.diksha.title': 'DIKSHA — para maestros y niños',
  'lib.entry.diksha.what': 'Lecciones, videos y práctica — de 1.º a 12.º.',
  'lib.entry.diksha.langs': 'Idiomas de la India',
  'lib.entry.khan-academy.title': 'Khan Academy — matemáticas y ciencias en inglés',
  'lib.entry.khan-academy.what': 'Lecciones en video hasta cada clase, también con texto escrito.',
  'lib.entry.openstax.title': 'OpenStax — libros gratuitos en inglés',
  'lib.entry.openstax.what': 'Libros de nivel universitario — matemáticas, ciencias, humanidades. PDF en cada página.',
  'lib.entry.nios.title': 'NIOS — educación a distancia, material gratuito',
  'lib.entry.nios.what': 'Folletos gratuitos para cursos abiertos y en línea, sin inscripción.',
  'lib.entry.nios.langs': 'Hindi, inglés y otros',
  'lib.entry.ignou.title': 'IGNOU — libros gratuitos para seguir estudiando',
  'lib.entry.ignou.what': 'Libros de educación a distancia, totalmente gratuitos.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — libros antiguos en inglés',
  'lib.entry.gutenberg.what': 'Más de 70.000 libros, todos libres de derechos. E-books y audios gratuitos.',
  'lib.entry.pratham-books.title': 'Pratham Books — libros para niños',
  'lib.entry.pratham-books.what': 'Libros infantiles en idiomas de la India, totalmente gratuitos. De 1.º a 5.º.',
  'lib.entry.pratham-books.langs': 'Hindi, maratí, bengalí, tamil, telugu y más',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — periódicos y revistas antiguos',
  'lib.entry.internet-archive-texts.what': 'Millones de libros, revistas y periódicos antiguos — gratis.',
  'lib.entry.wikisource.title': 'Wikisource — textos públicos gratuitos',
  'lib.entry.wikisource.what': 'Sin derechos de autor: son los libros literarios antiguos del mundo.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — todo tipo de imágenes',
  'lib.entry.wikimedia-commons.what': 'Animales, mapas, estrellas, historia — todo. Cada imagen lleva su propia licencia.',
  'lib.entry.pixabay.title': 'Pixabay — fotos e ilustraciones',
  'lib.entry.pixabay.what': 'Fotografías, dibujos y vídeos cortos.',
  'lib.entry.unsplash.title': 'Unsplash — fotografías bonitas',
  'lib.entry.unsplash.what': 'Gratis, en gran tamaño, sin necesidad de cuenta.',
  'lib.entry.openverse.title': 'Openverse — todas las imágenes libres en un sitio',
  'lib.entry.openverse.what': 'Busca en varios sitios de imágenes libres a la vez.',
  'lib.entry.librivox.title': 'LibriVox — libros para escuchar',
  'lib.entry.librivox.what': 'Audio gratuito de libros antiguos en inglés, leído por personas.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — archivo de audio',
  'lib.entry.internet-archive-audio.what': 'Miles de grabaciones gratuitas — libros, discursos, música.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — el himno nacional y otros',
  'lib.entry.vande-mataram.what': 'El himno nacional de la India y otros himnos, gratis.',
  'art.aag-aur-bijli-ke-bachav.title': 'Reglas de seguridad contra incendios y electricidad',
  'art.aag-aur-bijli-ke-bachav.summary': 'Prevenir un incendio en casa — reglas sencillas',
  'art.aag-lagne-par-kya-karein.title': 'Qué hacer si hay un incendio',
  'art.aag-lagne-par-kya-karein.summary': 'Fuego en una casa en llamas — qué hacer primero, qué no hacer',
  'art.bimari-se-bachav.title': 'Siete reglas contra la infección',
  'art.bimari-se-bachav.summary': 'Lavarse las manos, mascarillas, vacunas — cómo estar a salvo',
  'art.dhuwan-ka-jhakora.title': 'Protección contra la asfixia por el humo',
  'art.dhuwan-ka-jhakora.summary': 'Atragantamiento, no llega el aire — qué hacer, cuándo ir al hospital',
  'art.doodh-pani-band-ho.title': 'Cuando se corta la luz o el agua de repente',
  'art.doodh-pani-band-ho.summary': 'Qué hacer, qué evitar, cuándo pedir ayuda',
  'art.haath-ki-saafai.title': 'Limpiarse las manos sin jabón',
  'art.haath-ki-saafai.summary': 'Cuando no hay agua ni jabón',
  'cat.dhyan-aur-yoog.title': 'Meditación y yoga',
  'cat.dhyan-aur-yoog.subtitle': 'Formas sencillas de calmar la mente',
  'cat.gharelu-marammat.title': 'Reparaciones del hogar',
  'cat.gharelu-marammat.subtitle': 'Soluciones para problemas pequeños de casa',
  'cat.bachchon-ki-padhai.title': 'Los estudios de los niños',
  'cat.bachchon-ki-padhai.subtitle': 'Estudian, y están preocupados',
  'cat.budharge-seva.title': 'Cuidado de las personas mayores',
  'cat.budharge-seva.subtitle': 'Cuidado y ayuda',
  'cat.shishu-dekhbhal.title': 'Cuidado del bebé',
  'cat.shishu-dekhbhal.subtitle': 'Cuidar bien a un niño pequeño',
  'cat.dharmik-upay.title': 'Remedios religiosos',
  'cat.dharmik-upay.subtitle': 'Con paz de interior',
  'cat.pavan-grah-aur-aarti.title': 'Textos sagrados y aarti',
  'cat.pavan-grah-aur-aarti.subtitle': 'Lee y escucha con devoción',
  'cat.aapatkalen-gayide.title': 'Guía de emergencias',
  'cat.aapatkalen-gayide.subtitle': 'Cuando hace falta ayuda ya',
  'cat.mahamari-suraksha.title': 'Protección contra epidemias',
  'cat.mahamari-suraksha.subtitle': 'Evitar que la enfermedad se extienda',
  'nav.reviews': 'Opiniones', 'nav.support': 'Apóyenos', 'nav.menu': 'Menú',
  'nav.birthChart': 'Carta natal',
  'jgd.title': 'Tu carta natal',
  'jgd.intro': 'Escribe tu nombre y fecha de nacimiento, y si los sabes la hora y el lugar. Todo se calcula en tu propio móvil: no se envía nada a ninguna parte.',
  'jgd.nameLabel': 'Nombre al nacer',
  'jgd.namePlaceholder': 'p. ej. nombre completo',
  'jgd.nameHint': 'El nombre recibido en la infancia.',
  'jgd.dateLabel': 'Fecha de nacimiento',
  'jgd.timeLabel': 'Hora de nacimiento',
  'jgd.timeHint': 'Déjalo vacío si no lo sabes.',
  'jgd.placeLabel': 'Lugar de nacimiento',
  'jgd.placeNone': 'No lo sé / elegir',
  'jgd.placeHint': 'Elige la ciudad de nacimiento.',
  'jgd.submit': 'Calcular',
  'jgd.savePdf': 'Guardar como PDF',
  'jgd.again': 'Empezar de nuevo',
  'jgd.errDate': 'Escribe la fecha correctamente.',
  'jgd.errPlace': 'Elige tu pueblo de la lista, o el más cercano que esté en ella.',
  'jgd.numTitle': 'Numerología',
  'jgd.lifePath': 'Camino de vida',
  'jgd.nameNumber': 'Número del nombre',
  'jgd.soulNumber': 'Número del alma',
  'jgd.birthdayNumber': 'Número de cumpleaños',
  'jgd.astroTitle': 'Astrología védica',
  'jgd.nakshatra': 'Estrella natal',
  'jgd.pada': 'Cuarto',
  'jgd.rashi': 'Signo',
  'jgd.rashiLord': 'Señor del signo',
  'jgd.nakshatraLord': 'Señor de la estrella natal',
  'jgd.lagna': 'Ascendente',
  'jgd.lagnaMissing': 'El ascendente necesita la hora y el lugar. Rellénalos arriba y vuelve a calcular; si no los sabes, esto ya es suficiente.',
  'jgd.gunTitle': 'Compatibilidad Gun',
  'jgd.gunIntro': 'Escribe el nombre y la fecha de nacimiento de la otra persona.',
  'jgd.gunName': 'Su nombre',
  'jgd.gunDate': 'Su fecha de nacimiento',
  'jgd.gunHint': 'Con ambos nombres y fechas se calcula la puntuación.',
  'jgd.disclaimer': 'Esto es un cálculo tradicional, no una predicción. Ningún número ni signo decide la salud, el dinero ni las relaciones de nadie. Para las decisiones importantes, consulta a un médico, un abogado o alguien con experiencia.',
  'nav.openMenu': 'Abrir menú', 'nav.closeMenu': 'Cerrar menú', 'nav.language': 'Cambiar idioma',
  'ask.label': 'Escriba o diga su problema', 'ask.placeholder': 'Por ejemplo: a mi hijo le cuesta estudiar',
  'ask.help': 'También puede pulsar Intro para enviar.', 'ask.send': 'Preguntar', 'ask.sending': 'Pensando…',
  'ask.speak': 'Preguntar hablando', 'ask.listening': 'Empiece a hablar…',
  'ask.suggested': 'Preguntas frecuentes', 'ask.answerTitle': 'Respuesta', 'ask.listen': 'Escuchar', 'ask.stopSpeak': 'Detener',
  'ask.aiNote': 'Esta respuesta la dio una IA. No sustituye a un experto.',
  'sound.title': 'Sonido para la calma', 'sound.intro': 'Sin costo, sin anuncios.',
  'home.soundTitle': 'Sonido para la calma',
  'sound.shankh': 'Caracola', 'sound.bansuri': 'Flauta', 'sound.dhol': 'Tambor', 'sound.all': 'Los tres',
  'dhun.welcome': 'Bienvenido', 'dhun.prompt': 'Caracola, flauta y tambor juntos — toque para escuchar.',
  'dhun.listen': 'Escuchar', 'dhun.skip': 'Omitir',
  'home.emergencyTitle': 'Urgente — se necesita ayuda ahora', 'home.emergencyNote': 'Lea esto primero.',
  'home.readMore': 'Leer toda la información', 'home.chooseTopic': '¿Sobre qué quiere saber?',
  'home.askHere': 'Preguntar sobre este tema', 'home.howTitle': 'Cómo funciona este servicio',
  'home.freeTitle': 'Este servicio es completamente gratuito', 'home.freeBody': 'No se cobra nada, no se piden datos personales, no hay anuncios.',
  'footer.pages': 'Páginas', 'footer.helplines': 'Números importantes', 'footer.readStory': 'Lea su historia completa',
  'reviews.title': 'Tu opinión, tu voz', 'reviews.submit': 'Enviar', 'reviews.comment': 'Tu comentario',
  'language.choose': 'Elija su idioma', 'language.articlesIn': 'Este artículo está en hindi.',

  'ask.welcome': '¡Bienvenido! Escribe tu problema abajo o elige un tema.',

  'ref.notTitle': 'Lo que no hace',

  'ref.not1': 'No es un médico. Nunca da indicaciones sobre medicamentos.',

  'ref.not2': 'No es abogado. No da asesoramiento legal.',

  'ref.not3': 'No cobra dinero ni muestra anuncios.',

  'ref.not4': 'No pide ni guarda tu nombre, dirección ni número de teléfono.',

  'ref.not5': 'No inventa precios ni números de programas del gobierno: si no lo sabe, lo dice con claridad.',

  'ref.medicalTitle': 'Importante: esto no es consejo médico',

  'ref.medicalBody': 'Si se trata de una enfermedad, un medicamento o cualquier sustancia venenosa, ve primero al médico. Aquí la información es solo de ayuda general. Pide consejo médico antes de cualquier vacuna infantil, durante el embarazo, o antes de empezar cualquier medicamento.',

  'ref.statsTitle': 'Cuánta información hay',

  'support.howTitle': 'Cómo puedes ayudarnos',

  'support.alwaysFreeTitle': 'Este servicio seguirá siendo gratis siempre',

  'support.alwaysFreeBody': 'La ayuda que llegue se dedica a mantener el servicio. Nunca se cobra nada a nadie.',

  'smriti.eyebrow': 'En memoria',

  'smriti.whyTitle': 'Por qué existe este sitio',

  'smriti.ending': 'Su lucha continúa aquí.',

  'article.askAny': 'Haz una pregunta',

  'article.remember': 'Recuerda',

  'article.emergencyInfo': 'Información importante',

  'article.medicalTitle': 'Esto no es consejo médico',

  'article.medicalBody': 'Esta información es ayuda general. No empieces ni dejes ninguna medicina sin un médico.',

  'article.heading': 'Artículos sobre {category}',

  'reviews.rateQuestion': '¿Cuántas estrellas darás?',

  'reviews.starsShort': '{value} estrellas',

  'reviews.averageOutOf': '{value} de 5 estrellas',

  'dhun.welcomeTitle': 'Bienvenido',

  'dhun.consent': 'Concha, flauta y tambor juntos. Toca para escuchar.',

  'dhun.failed': 'No se pudo reproducir el sonido.',

  'dhun.unsupported': 'Este navegador no puede reproducir el sonido.',

  'dhun.failedTry': 'Hubo un problema al reproducir el sonido.',

  'sound.hintIdle': 'Pulsa cualquier botón para escuchar un sonido.',

  'sound.hintPlaying': 'Sonando. Pulsa el mismo botón para parar.',

  'sound.preparing': 'Preparando el sonido',

  'nav.path': 'Ruta',

  'toast.dismiss': 'Cerrar',

  'footer.free': 'Este servicio es totalmente gratuito. No se cobra a nadie.',

  'cat.empty': 'Todavía no hay artículos sobre este tema.',
  'cat.notFound': 'No se encontró esta página',

  'dhun.label': 'Permiso para reproducir el sonido',

  'language.articlesInHint': 'Cada idioma necesita su propia traducción. Esta traducción aún no existe: lo escrito es lo más correcto y completo en hindi.',

  'nav.collapse': 'Contraer la barra',

  'nav.expand': 'Expandir la barra',

  'nav.skip': 'Ir al contenido principal',

  'theme.toDark': 'Ir al tema oscuro',

  'theme.toLight': 'Ir al tema claro',

  'ask.clear': 'Borrar lo escrito',

  'ask.emptyAnswer': 'Esta vez no se pudo generar una respuesta. Pruébelo con otras palabras.',

  'ask.errorNetwork': 'Internet no funciona. Compruebe la conexión y vuelva a intentarlo.',

  'ask.errorRateLimit': 'Se enviaron muchas preguntas a la vez. Vuelva a intentarlo en unos minutos.',

  'ask.heardWith': 'Escuchando:',
  'ask.heard': 'Escuchando',

  'ask.micUnsupported': 'Hablar para preguntar no funciona en este navegador. Escriba su pregunta.',

  'ask.notAnswer': 'No tenemos una respuesta directa a esta pregunta.',


  'ask.stopListening': 'Dejar de escuchar',

  'article.askAbout': 'Preguntar sobre este tema',

  'article.count': '{count} artículos',

  'article.emergency': 'Importante',

  'article.others': 'Más artículos sobre este tema',

  'article.readAloud': 'Escuchar este artículo',

  'footer.admin': 'Administración',

  'footer.ambulance': 'Ambulancia',

  'footer.emergency': 'Emergencia',

  'footer.rights': 'Servicio gratuito',

  'footer.women': 'Línea de ayuda a la mujer',

  'sound.allHint': 'Juntos',

  'sound.bansuriHint': 'Suave, lenta',

  'sound.dholHint': 'Fuerte, rápida',

  'sound.errGeneric': 'Hubo un problema al reproducir el sonido.',

  'sound.errUnsupported': 'Este navegador no puede reproducir el sonido.',

  'sound.listenLabel': 'Escuchar',

  'sound.playing': 'Está sonando. Pulse el mismo botón para parar.',

  'sound.shankhHint': 'Profunda, larga',

  'voice.aborted': 'Se detuvo. Vuelva a intentarlo.',

  'voice.audioCapture': 'No se encontró el micrófono. Conecte el dispositivo o escriba su pregunta.',

  'voice.generic': 'Algo salió mal. Vuelva a intentarlo.',

  'voice.network': 'Preguntar por voz necesita internet, y no funciona. Escriba su pregunta: recibirá la misma respuesta.',

  'voice.noSpeech': 'No se oyó ninguna voz. Hable cerca del micrófono o escriba.',

  'voice.notAllowed': 'No se concedió permiso para el micrófono. Conceda el permiso arriba o escriba su pregunta.',

  'voice.serviceNotAllowed': 'No se concedió permiso para el micrófono. Conceda el permiso arriba o escriba su pregunta.',

  'voice.speakFailed': 'No se pudo leer esta respuesta en voz alta.',
  'voice.noVoice': 'Este dispositivo no tiene voz en {name}. Lee el texto ahora, o añade una voz en los ajustes del teléfono.',

  'voice.unsupported': 'Hablar para preguntar no funciona en este navegador. Escriba su pregunta.',

  'ask.notConfigured': 'Este servicio responde ahora desde su biblioteca guardada. Tu pregunta no estaba en ella.',

  'ask.browseTitle': 'Esto es lo que cubre este sitio',

  'health.heading': 'Dinos tu edad',

  'health.intro': 'Aquí aparecerán las preguntas que más se hacen según la edad. Pulsa cualquier botón: la pregunta se rellena abajo y luego preguntas.',

  'health.ageLabel': 'Edad (años)',

  'health.years': 'años',

  'health.bandsLabel': 'Elige por edad',

  'health.notAdviceStrong': 'Esto no es consejo médico.',

  'health.notAdvice': 'No empieces ni dejes ninguna medicina — ve antes al médico.',

  'health.emergencyStrong': 'Llama en una emergencia:',

  'health.emergencyCall': '(emergencia)',

  'health.emergencyAmbulance': '(ambulancia)',

  'health.emergencyWomen': '(línea de ayuda a la mujer)',

  'health.privacy': 'No hace falta escribir tu nombre ni tu dirección.',

  'health.band.infant.label': '0 – 2 años',

  'health.band.child.label': '3 – 12 años',

  'health.band.teen.label': '13 – 17 años',

  'health.band.young.label': '18 – 30 años',

  'health.band.middle.label': '31 – 45 años',

  'health.band.later.label': '46 – 60 años',

  'health.band.senior.label': '61 – 75 años',

  'health.band.elder.label': '76 – 100 años',

  /* ---- save / download ---- */

  'download.pdf': 'Guardar como PDF',
  'download.text': 'Guardar como texto',
  'download.printNow': 'Imprimir',
  'download.preparing': 'Preparando',
  'download.blocked': 'No se pudo abrir una pestaña nueva. El navegador está bloqueando las ventanas emergentes: permítelas.',

  /* ---- attach a document ---- */

  'attach.button': 'Adjunta tu documento o foto',
  'attach.formats': 'PDF, foto (JPG/PNG) o archivo de texto — hasta 12 MB',
  'attach.reading': 'Leyendo…',
  'attach.attached': 'Adjunto',
  'attach.remove': 'Quitar',
  'attach.tooBigPdf': 'Este PDF supera los 12 MB. Elige un archivo más pequeño.',
  'attach.tooBigImage': 'Esta foto supera los 3 MB. Elige una más pequeña.',
  'attach.scannedPdf': 'Este PDF es un escaneo: solo contiene la imagen de la página y no se puede leer. Envía una fotografía suya.',
  'attach.pdfFailed': 'No se pudo leer este PDF.',
  'attach.imageFailed': 'No se pudo cargar esta foto.',
  'attach.wrongType': 'Este tipo de archivo no sirve. Envía un PDF, una foto o un archivo de texto.',
  'attach.hint': 'Adjunta tu papel y haz tu pregunta: la respuesta será sobre ese papel.',
  'ask.sendWithFile': 'Responder esto',

  /* ---- free library ---- */

  'lib.title': 'Biblioteca gratuita',
  'lib.intro': 'Libros de texto, libros, imágenes y audio — todo gratis y todo legal.',
  'lib.legalTitle': 'Sin problemas de derechos de autor.',
  'lib.legal': 'Todo lo de aquí es totalmente gratis y puedes compartirlo. Un libro que sigue bajo derechos de autor no está en esta página — copiarlo no está permitido, y decirlo claro es mejor.',
  'ask.signInTitle': 'Inicia sesión primero',
  'ask.signInBody': 'Crea una cuenta para preguntar. Toma menos de un minuto, y después puedes seguir preguntando.',
  'ask.signInCta': 'Crear cuenta o iniciar sesión',
  'ask.signInFirst': 'Inicia sesión primero y luego pregunta.',
  'ask.signInOr': '¿No puedes crear una cuenta ahora? Esto funciona sin ella:',
  'account.title': 'Mi cuenta',
  'account.intro': 'Inicia sesión con tu nombre y contraseña.',
  'account.signIn': 'Entrar',
  'account.register': 'Crear cuenta',
  'account.signInNote': 'Usa el nombre y la contraseña anteriores.',
  'account.registerNote': 'No hace falta una cuenta para preguntar. Esto solo guarda tu idioma y tus respuestas.',
  'account.handle': 'Tu nombre',
  'account.handlePlaceholder': 'p. ej. sita.ji',
  'account.password': 'Contraseña',
  'account.passwordHint': 'Seis caracteres como mínimo.',
  'account.phone': 'Número de teléfono',
  'account.optional': 'opcional',
  'account.phoneHint': 'Dalo si quieres. La cuenta se puede crear sin él.',
  'account.create': 'Crear la cuenta',
  'account.logout': 'Cerrar sesión',
  'account.open': 'Abrir mi cuenta',
  'account.signedInAs': 'Has iniciado sesión como',
  'account.signedOut': 'No has iniciado sesión',
  'account.signedOutBody': 'No hay ninguna cuenta abierta en este navegador.',
  'account.saved': 'Respuestas guardadas',
  'account.savedEmpty': 'Nada guardado todavía. Pulsa Guardar en una respuesta.',
  'account.savedUnavailable': 'Las respuestas guardadas no se muestran ahora. Todo lo demás funciona.',
  'account.wait': 'Espera un momento…',
  'account.privacyTitle': 'Qué guardamos',
  'account.privacyBody': 'Una cuenta guarda solo tu nombre, tu contraseña y tu idioma. No registra lo que preguntas ni envía tus preguntas a nadie.',
  'account.errWrong': 'Nombre o contraseña incorrectos.',
  'account.errTaken': 'Ese nombre está ocupado. Elige otro.',
  'account.errBad': 'Rellena el formulario correctamente.',
  'account.errWait': 'Demasiados intentos. Prueba en un rato.',
  'account.errTryLater': 'No funcionó ahora. Prueba en un momento.',
  'lib.licence.ccBy': 'Puedes copiarla, compartirla e imprimirla citando la fuente.',
  'lib.licence.ccBySa': 'Puedes copiarla e imprimirla. Tus cambios deben compartirse igualmente.',
  'lib.licence.ccZero': 'Totalmente libre. Ni siquiera se necesita citar la fuente.',
  'lib.licence.pd': 'Nadie tiene los derechos: cópiala libremente.',
  'lib.licence.govtIndia': 'En un sitio del Gobierno de la India. Leer e imprimir es gratis.',
  'lib.licence.creativeCommons': 'Cada archivo tiene su propia licencia: míralo.',
  'lib.licence.freeToRead': 'Leer es gratis. Se puede compartir en los mismos términos.',
  'lib.openBadge': 'Abierto',
  'lib.openBadgeNote': 'puedes copiarlo',
  'lib.freeBadge': 'Gratis',
  'lib.freeBadgeNote': 'para leer, no para copiar',
  'lib.govt': 'Gobierno',
  'lib.noSignup': 'Sin cuenta',
  'lib.open': 'Abrir',
  'lib.group.padhai': 'Libros de estudio',
  'lib.group.padhai.note': 'Textos escolares, material universitario y sitios educativos del gobierno',
  'lib.group.kitab': 'Libros',
  'lib.group.kitab.note': 'Los que ya no tienen derechos de autor, o los que sí permiten copiarse',
  'lib.group.tasveer': 'Imágenes y dibujos',
  'lib.group.tasveer.note': 'Mapas, fotos, ilustraciones — de todo',
  'lib.group.audio': 'Cosas para escuchar',
  'lib.group.audio.note': 'Libros en audio, para quien no quiere leer letra pequeña',
  'lib.warnTitle': 'No están todos los libros',
  'lib.warn': 'Algunos libros siguen bajo derechos de autor y no se pueden dar gratis legalmente. No los incluimos a propósito. Si necesitas uno, pregunta abajo: se responderá todo lo que se pueda.',
  'lib.askInstead': 'Preguntar mejor',
  'nav.library': 'Biblioteca',

  'help.title': 'Escribe tu problema',

  'help.intro': 'Escribe abajo o habla. Si no sabes, escribe lo que te venga a la mente: eso es lo más importante.',

  'help.howTitle': 'Cómo funciona este servicio',

  'help.howBody': 'Cada pregunta queda registrada y su respuesta llega enseguida. No se pide tu nombre, ni tu dirección, ni tu teléfono. Todo es gratis.',

  'help.suggested': 'Preguntas frecuentes',

  'help.q1.label': 'Se fue la luz, ¿qué hago?',

  'help.q1.question': 'Se fue la luz en casa. ¿Qué debo hacer y cómo cargo el móvil?',

  'help.q2.label': 'Dificultades en los estudios',

  'help.q2.question': 'Mi hijo tiene muchas dificultades en la escuela. ¿Cómo mejorar en casa?',

  'help.q3.label': 'Cuidado de mayores',

  'help.q3.question': 'Mi padre ya es muy anciano, ¿cómo le cuido?',

  'help.q4.label': 'Si hay fuego en casa',

  'help.q4.question': 'Si hay fuego en casa de noche, ¿qué hago primero?',

  'home.stepLabel': 'Paso',

  'home.step1Title': 'Escribe o habla',

  'home.step1Body': 'Escribe en español, o pulsa el micrófono y habla. No hace falta nada especial: escribe lo que te venga a la mente.',

  'home.step2Title': 'La respuesta llega enseguida',

  'home.step2Body': 'Cada pregunta queda registrada y su respuesta llega enseguida. Empieza con una pregunta corta antes de una larga.',

  'home.step3Title': 'Sin dinero ni datos personales',

  'home.step3Body': 'Este servicio es totalmente gratis. No se pide tu nombre, ni tu dirección, ni tu teléfono, y no se muestran anuncios.',

  'home.memorialEyebrow': 'Para quién es este sitio',
  'home.memorialLine': 'Quien luchó toda su vida por la sociedad y no recibió, al final, su parte.',
  'home.memorialMore': 'Lea su historia completa',
  'home.kundaliTitle': 'Carta natal',
  'home.kundaliNote': 'Carta completa — los nueve planetas, dasha Vimshottari, phaladesh, yoga, shodasvarga, KP, Lal Kitab y Anka. Todo se calcula en su teléfono.',
  'home.chooseTopicNote': 'Toca el tema de abajo. La información está en lenguaje sencillo en todas partes.',

  'home.categoryEmpty': 'Todavía no se ha escrito nada en este tema.',

  'home.soundIntro': 'Sin cuota y sin anuncios. Solo para calmar la mente.',

  'home.dedication1': 'En memoria: un servicio totalmente gratuito.',

  'home.dedication2': 'Escribe tu problema o habla.',

  'ref.title': 'Qué es este servicio y para quién es',

  'ref.intro': 'Este servicio se creó en memoria de la Sra. VARSHA. Aquí, en lenguaje sencillo, se explica qué hace, qué contiene y cuáles son sus límites. Todo es totalmente gratis: no se cobra dinero, no se muestran anuncios y no se piden datos personales.',

  'ref.whatTitle': 'Qué contiene',

  'ref.what1': 'Fuego en casa, se va la luz, hacia los niños les cuesta estudiar, cuidar a los padres: soluciones sencillas para problemas comunes, en lenguaje claro.',

  'ref.what2': 'Puedes preguntar hablando. Si no puedes, escribe: la respuesta es igual en los dos casos.',

  'ref.what3': 'Cada pregunta queda registrada, así que lo que molesta a los demás ya se ha preguntado antes y su respuesta está disponible.',

  'ref.what4': 'Sin anuncios, sin información de sobra y sin datos personales. Todo gratis.',

  'ref.statsArticles': 'artículos escritos',

  'ref.statsCategories': 'temas disponibles',

  'ref.statsQuestions': 'preguntas recibidas',

  'ref.adminTitle': 'Qué pueden hacer los administradores',

  'ref.adminBody': 'Los administradores pueden leer los artículos que envías y responderlos. No pueden cambiar ni borrar ningún artículo sin tu permiso, y no venden tu información a nadie.',

  'ref.dataTitle': 'Qué guardamos sobre ti',

  'ref.dataBody': 'Solo la pregunta que hiciste, un resumen y el momento en que la hiciste, para no repetir la misma respuesta. No se toma tu nombre, dirección, número de teléfono ni nada que te identifique. El sitio no tiene anuncios ni scripts de seguimiento.',

  'ref.helplineTitle': 'Guarda estos números para emergencias',

  'ref.helpline1': 'Peligro grave — fuego, descarga eléctrica, caída o hemorragia abundante: llama al 112.',

  'ref.helpline2': 'Si alguien está enfermo o herido y no hay forma de llevarlo, pide una ambulancia en el 108.',

  'ref.helpline3': 'Si le han hecho daño a una mujer, o si alguien la está molestando, llama al 181. Es gratis.',

  'ref.helpline4': 'Si un niño o una persona mayor ha sufrido abuso, puedes denunciar en el 1098.',

  'ref.helpline5': 'Si la angustia es muy fuerte, o dejas de querer vivir, puedes hablar al 14416. Solo para hablar.',

  'ref.ownerNote': 'Este servicio no pertenece a ninguna empresa ni al gobierno: funciona en memoria de una persona. Por eso aquí no hay anuncios, ni cuotas, ni se cobra dinero.',

  'support.title': 'Este servicio es gratis',

  'support.intro': 'Este servicio no le pide dinero a nadie. Pero funciona, y por eso hay formas en las que puedes ayudar. La más fácil es la más útil.',

  'support.contactTitle': '¿Quieres contarnos algo?',

  'support.contactBody': 'Puedes escribir aquí cualquier cosa: si hay un error, si te llegó algo de más, o si tienes una pregunta. Escribe tanto como te resulte fácil.',

  'support.faqTitle': 'Preguntas que se repiten',

  'support.faqBody': '¿Es realmente gratis? Sí. ¿Piden tu nombre? No, el nombre no es obligatorio. ¿Hay anuncios? No. ¿Piden teléfono o dirección? No. ¿Tengo que instalar una aplicación? No, se abre en el navegador.',

  'support.waysTitle': 'Cómo puedes ayudar',

  'support.way1Title': 'Cuenta tu experiencia',

  'support.way1Body': 'Si este sitio te ha servido de algo — o si te dio algo que te dejó dando vueltas — escríbelo en la página de opiniones. No hace falta tu nombre.',

  'support.way2Title': 'Habla de tu ciudad',

  'support.way2Body': 'El idioma, las costumbres y los problemas cambian de un sitio a otro. Si hay algo de tu ciudad que no esté aquí, dilo — lo que se pueda añadir, se añadirá.',

  'support.way3Title': 'Cuenta tu experiencia a otro',

  'support.way3Body': 'Lo que está escrito aquí puede ayudar a mucha gente, si se llegan a saberlo. Cuéntaselo a alguien a quien esto le sirva de verdad.',

  'support.way4Title': 'Ven a verlo',

  'support.way4Body': 'Si tienes tiempo, ven y comprueba si la web funciona bien. Si algo se ve mal, dilo — se arregla totalmente gratis.',

  'reviews.pageTitle': 'Tu opinión',

  'reviews.pageIntro': 'Aquí está escrito exactamente lo que la gente ha escrito. No se oculta ninguna opinión, y lo escrito se ve aquí — solo se publica después de revisarlo una vez.',

  'reviews.intro': '¿Te ha servido este servicio? Escribe lo que quieras — no hace falta tu nombre.',

  'reviews.write': 'Escribe tu opinión',

  'reviews.starsLabel': '{value} de 5 estrellas',

  'reviews.summaryTitle': 'Opinión general',

  'reviews.summaryLine': 'La gente ha dado {rating} de 5 de media, {count} estrellas.',

  'reviews.count': 'Opiniones',

  'reviews.name': 'Tu nombre (no es obligatorio)',

  'reviews.city': 'Tu ciudad (no es obligatoria)',

  'reviews.placeholder': 'Escribe lo que te venga a la mente — no hace falta corregir nada.',

  'reviews.keepLabel': 'Si te fue mal o si te fue bien — escribe las dos cosas',

  'reviews.fieldTooShort': 'Escribe al menos 10 caracteres.',

  'reviews.rateLimited': 'Se está enviando demasiado rápido. Espera un momento e inténtalo otra vez.',

  'reviews.sending': 'Enviando…',

  'reviews.moderated': 'Tu opinión se revisa una vez antes de publicarse.',

  'reviews.moderationNote': 'Para no tener que borrarlo todo, cada opinión se revisa una vez antes de publicarse. Se quitan los insultos, los números y los datos personales — el resto se publica tal cual.',

  'reviews.replyLabel': 'Esto es lo que se ha escrito',

  'reviews.ownerReply': 'Respuesta',

  'reviews.empty': 'Todavía no hay opiniones. Escribe la primera.',

  'reviews.anonymous': 'Sin nombre',

  'reviews.toastSent': 'Gracias',

  'reviews.toastFailed': 'No se pudo enviar la opinión',

  'health.band.infant.note': 'Bebés pequeños, que todavía no saben decir lo que quieren',

  'health.band.child.note': 'Niños que ya hablan, pero les da miedo preguntar',

  'health.band.teen.note': 'Adolescentes, que rara vez encuentran a alguien que los escuche',

  'health.band.young.note': 'Trabajo, dinero y sueño: las tres cargas a la vez',

  'health.band.middle.note': 'Casa, hijos y tu propia salud: toda la responsabilidad junta',

  'health.band.later.note': 'La edad del cuerpo y su cuidado, los dos a la vez',

  'health.band.senior.note': 'Medicina, equilibrio y soledad: las tres juntas',

  'health.band.elder.note': 'Revisar cada medicina es necesario, cada caída es grave',

  'health.c.infant1': 'Fiebre alta',

  'health.c.infant2': 'No come',

  'health.c.infant3': 'Vomita',

  'health.c.infant4': 'Diarrea',

  'health.c.child1': 'No estudia',

  'health.c.child2': 'No quiere ir al colegio',

  'health.c.child3': 'Fiebre por la noche',

  'health.c.child4': 'Se le caen los dientes',

  'health.c.teen1': 'Presión de los exámenes',

  'health.c.teen2': 'No duerme',

  'health.c.teen3': 'Adicción al móvil',

  'health.c.teen4': 'Mucha tristeza',

  'health.c.young1': 'Estrés del trabajo',

  'health.c.young2': 'Dolor de espalda al sentarse',

  'health.c.young3': 'No duerme',

  'health.c.young4': 'Falta dinero',

  'health.c.middle1': 'Dolor lumbar',

  'health.c.middle2': 'Dormir mal',

  'health.c.middle3': 'Estrés en casa',

  'health.c.middle4': 'Gases en el estómago',

  'health.c.later1': 'Dolor de espalda',

  'health.c.later2': 'Dolor de rodilla',

  'health.c.later3': 'Calambres en la pierna de noche',

  'health.c.later4': 'Rigidez por la mañana',

  'health.c.senior1': 'Cuesta caminar',

  'health.c.senior2': 'Revisión de medicación',

  'health.c.senior3': 'Orinar por la noche',

  'health.c.senior4': 'Oye poco',

  'health.c.elder1': 'Miedo a caerse',

  'health.c.elder2': 'Memoria floja',

  'health.c.elder3': 'Pastillas para el dolor a diario',

  'health.c.elder4': 'Cuándo ir al médico',

  'health.q.infant1': 'Mi niño tiene fiebre, ¿le doy leche?',

  'health.q.infant2': 'El niño pequeño no come, ¿qué hago?',

  'health.q.infant3': 'Mi niño vomita, ¿cuándo lo llevo al médico?',

  'health.q.infant4': 'Mi niño tiene diarrea, ¿qué le doy de comer?',

  'health.q.child1': 'A mi niño no le gusta estudiar, ¿qué hago?',

  'health.q.child2': 'Mi niño se niega a ir al colegio cada día, ¿por qué será?',

  'health.q.child3': 'Mi niño tiene fiebre por la noche, ¿qué hago?',

  'health.q.child4': 'A mi niño se le caen los dientes, ¿cómo los cuido?',

  'health.q.teen1': 'La presión de los estudios es mucha, ¿cómo la afronto?',

  'health.q.teen2': 'No duermo bien por la noche, ¿qué hago?',

  'health.q.teen3': 'Me he enganchado al móvil, ¿cómo lo dejo?',

  'health.q.teen4': 'Me siento muy triste, ¿con quién hablo?',

  'health.q.young1': 'El estrés del trabajo es mucho, ¿cómo lo bajo?',

  'health.q.young2': 'Me duele la espalda de estar sentado, ¿qué hago?',

  'health.q.young3': 'No consigo dormir por la noche, ¿qué hago?',

  'health.q.young4': 'Tengo poco dinero y muchos gastos, ¿qué hago?',

  'health.q.middle1': 'Me duele la zona lumbar, ¿a qué puede deberse?',

  'health.q.middle2': 'No duermo bien, ¿cómo mejorarlo?',

  'health.q.middle3': 'Hay mucha tensión en casa, ¿cómo ayudo a los niños?',

  'health.q.middle4': 'Desde hace años tengo gases en el estómago en el trabajo, ¿qué hago?',

  'health.q.later1': 'Tengo 54 años y me duele la espalda, ¿qué hago?',

  'health.q.later2': 'Me duele la rodilla al subir escaleras, ¿por qué?',

  'health.q.later3': 'De noche me dan calambres en las piernas, ¿qué hago?',

  'health.q.later4': 'Al levantarse por la mañana tengo rigidez en la zona lumbar, ¿a qué se debe?',

  'health.q.senior1': 'Las rodillas me duelen tanto que me cuesta caminar, ¿qué hago?',

  'health.q.senior2': 'Tomo varias medicinas a diario — ¿cómo sé cuál es dañina?',

  'health.q.senior3': 'Me levanto a orinar muchas veces por la noche, ¿qué hago?',

  'health.q.senior4': 'Oigo poco, ¿hay alguna forma de mejorar el oído?',

  'health.q.elder1': 'Tengo miedo de caerme en casa, ¿qué protección pongo?',

  'health.q.elder2': 'Se me está borrando la memoria, ¿qué hago?',

  'health.q.elder3': 'Tomo pastillas para el dolor todos los días — ¿hacen daño?',

  'health.q.elder4': '¿Cuándo es necesario ir al médico?',

  'support.contactMessageLabel': 'Tu mensaje',

  'support.contactPlaceholder': 'Escribe lo que quieras: un error, algo que estuvo bien, o una pregunta.',

  'support.contactHelp': 'Al menos 10 caracteres. Esto va directamente al dueño.',

  'support.contactSubmit': 'Enviar',

  'support.contactSending': 'Enviando…',

  'support.contactPrivacy': 'No hace falta escribir tu nombre.',

  'support.contactSent': 'Ha llegado',

  'support.contactSentBody': 'Tu mensaje ha llegado al dueño.',

  'support.contactFailed': 'No se pudo enviar',

  'support.faq1Q': '¿Es realmente gratis?',

  'support.faq1A': 'Sí. No se cobra dinero, no se muestran anuncios y no se pide membresía. Funciona con el dinero de una persona, no con el de una empresa ni el de un gobierno.',

  'support.faq2Q': '¿Tomáis mi nombre, mi dirección o mi teléfono?',

  'support.faq2A': 'No, y no se tomará. El sitio no crea ninguna identidad sobre ti: ni inicio de sesión ni scripts de seguimiento. Solo se guarda lo que preguntaste.',

  'support.faq3Q': '¿Es un médico o un abogado?',

  'support.faq3A': 'No. No da indicaciones sobre medicamentos ni asesoramiento legal. Cuando el asunto es grave te dice que vayas a un médico o a una autoridad, no ocupa su lugar.',

  'support.faq4Q': '¿Todas las respuestas son correctas?',

  'support.faq4A': 'No siempre. Las respuestas las escribe un ordenador, no un médico, y por eso cada respuesta lleva escrito que no es consejo médico. Consulta a un médico antes de empezar o dejar cualquier medicina.',

  'support.faq5Q': '¿Tengo que instalar alguna aplicación?',

  'support.faq5A': 'No. Se abre en el navegador. Sin instalar aplicaciones, sin permisos, sin actualizaciones.',

  /* Ayurvedic home remedies — the owner's option one. */
  'nav.remedies': 'Remedios caseros',
  'remedy.title': 'Remedios caseros ayurvédicos',
  'remedy.intro': 'Sea cual sea la molestia — tos, dolor de cabeza, artritis, picazón, diabetes, dolor de espalda — elígela abajo o pregúntala con tus palabras. Se te dirán el kadha casero, el masaje, la dieta y las medidas ayurvédicas.',
  'remedy.choose': 'Elige tu molestia',
  'remedy.emergencyStrong': 'Estas son emergencias:',
  'remedy.emergency': 'Mordedura de serpiente, picadura de escorpión o mordedura de perro: al hospital de inmediato — llama primero al 112. Los remedios caseros son solo para el camino, nunca en lugar del hospital.',
  'remedy.note': 'Los remedios caseros y ayurvédicos ayudan a aliviar la molestia; no sustituyen el examen ni el tratamiento del médico. No empieces ni dejes ningún medicamento por tu cuenta.',
  'remedy.cough': 'Tos',
  'remedy.headache': 'Dolor de cabeza',
  'remedy.joints': 'Artritis',
  'remedy.itching': 'Picazón',
  'remedy.snake': 'Mordedura de serpiente',
  'remedy.scorpion': 'Picadura de escorpión',
  'remedy.dog': 'Mordedura de perro',
  'remedy.diabetes': 'Diabetes',
  'remedy.back': 'Dolor de espalda',
  'remedy.walking': 'Dificultad para caminar',
  'home.remedyNote': 'Kadha, masaje, dieta y medidas ayurvédicas — para cada molestia, en tu idioma.',
  'nav.aarti': 'Arati y bhajan',
  'aarti.title': 'Arati y bhajan — con voz real',
  'aarti.intro': 'Escuche aquí arati, kirtan y bhajan con la voz de cantantes y templos reales. Ninguna voz de IA.',
  'aarti.note': 'Reproducir un arati o un bhajan con voz de computadora le quita su ritmo y su devoción. Por eso aquí solo hay grabaciones reales.',
  'aarti.kindAarti': 'Arati',
  'aarti.kindKirtan': 'Kirtan',
  'aarti.kindBhajan': 'Bhajan',
  'aarti.credit': 'Grabación:',
  'aarti.licence': 'Licencia:',
  'aarti.listenLink': 'Escuche con voz real',
  'aarti.textChecked': 'Este es el texto tradicional, tal como se canta en la grabación real.',
  'aarti.textPrinted': 'Este es el texto tradicional, comprobado con colecciones publicadas.',
  'aarti.textNotStored': 'El texto completo de este granth no está guardado aquí: la grabación de abajo lo contiene entero.',
  'aarti.granthTitle': 'Granths, chalisas y estotras — con voz real',
  'aarti.noRecording': 'Todavía no hay una grabación real de este arati en el sitio, así que no puedo cantártelo: nunca canto un arati con voz artificial.',
  'aarti.textOnlyTitle': 'Más aratis: el texto y una voz real',
  'aarti.fullText': 'Texto completo',
  'aarti.notChecked': 'El texto verificado de este arati aún no está en el sitio. No se da un texto sin comprobar, porque una palabra equivocada en una oración es peor que ninguna.',
  'aarti.verifiedList': 'El sitio tiene textos verificados de estos aratis:',

};

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* ASSAMESE                                                                  */
/* -------------------------------------------------------------------------- */

const ASSAMESE: Record<string, string> = {
  'jgd.placeSearch': 'শ্বহৰৰ নাম লিখক',
  'jgd.placeNoMatch': 'এই চহৰখন তালিকাত নাই। ইয়াৰ কাষৰ চহৰখন বাছক।',
  'account.name': 'আপোনাৰ নাম',
  'account.namePlaceholder': 'যেনে: সিতা দেৱী',
  'account.nameHint': 'এইটো আপোনাৰ চিনাকিৰ বাবে। যিকোনো নাম হ\'ব, আৰু এইটো বাধ্যতামূলক নহয়।',
  'nav.home': 'মুখ্য পৃষ্ঠা',
  'home.metaTitle': 'বিনামূলীয়া সমাধান, আপোনাৰ নিজৰ শব্দত',
  'lib.licence.ccZero.name': 'CC0 / ৰাজহুৱা ড\'মেইন',
  'lib.licence.pd.name': 'ৰাজহুৱা ড\'মেইন',
  'lib.licence.govtIndia.name': 'ভাৰত চৰকাৰ',
  'lib.licence.creativeCommons.name': 'ক্ৰিয়েটিভ কমন্স (মিশ্ৰিত)',
  'lib.licence.freeToRead.name': 'পঢ়িবলৈ বিনামূলীয়া',
  'lib.entry.ncert.title': 'NCERT কিতাপ — ১ ৰ পৰা ১২ শ্ৰেণী লৈ',
  'lib.entry.ncert.what': 'প্ৰতিটো বিষয়ৰ সকলো কিতাপ, এতিয়া প্ৰতিটো শ্ৰেণীৰ বাবে। লগইন অবিহনে, পোনপটীয়াকৈ PDF।',
  'lib.entry.ncert.langs': 'হিন্দী, ইংৰাজী আৰু ৩০টাতকৈও অধিক ভাৰতীয় ভাষা',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ডিজিটেল পাঠ্যপুথি',
  'lib.entry.pm-evidya.what': 'NCERT কিতাপৰ এপ, ডাঙৰ আখৰত পঢ়িব পাৰি। ক\'তো শুনক বুলি শুনিব পাৰি।',
  'lib.entry.pm-evidya.langs': 'ভাৰতীয় ভাষা',
  'lib.entry.diksha.title': 'DIKSHA — শিক্ষক আৰু ল\'ৰা-ছোৱালীৰ বাবে',
  'lib.entry.diksha.what': 'পাঠ্যক্ৰম, ভিডিঅ\' আৰু অনুশীলন — ১ ৰ পৰা ১২ শ্ৰেণী লৈ।',
  'lib.entry.diksha.langs': 'ভাৰতীয় ভাষা',
  'lib.entry.khan-academy.title': 'Khan Academy — ইংৰাজীত গণিত আৰু বিজ্ঞান',
  'lib.entry.khan-academy.what': 'ভিডিঅ\' পাঠ, প্ৰতিটো শ্ৰেণীলৈকে। পোনপটীয়াকৈ পঢ়াসকলৰ বাবেও লিখা আছে।',
  'lib.entry.openstax.title': 'OpenStax — ইংৰাজীত বিনামূলীয়া কিতাপ',
  'lib.entry.openstax.what': 'মহাবিদ্যালয় স্তৰৰ কিতাপ — গণিত, বিজ্ঞান, মানৱিকী। প্ৰতিটো পৃষ্ঠাৱেই PDF।',
  'lib.entry.nios.title': 'NIOS — দূৰৱৰ্তী শিক্ষা, বিনামূলীয়া সামগ্ৰী',
  'lib.entry.nios.what': 'অ\'পেন আৰু অনলাইন কোৰ্চৰ বিনামূলীয়া পুথি, নামভৰ্তি নকৰাকৈ।',
  'lib.entry.nios.langs': 'হিন্দী, ইংৰাজী আৰু অন্যান্য',
  'lib.entry.ignou.title': 'IGNOU — ডাঙৰ স্কুলৰ বিনামূলীয়া কিতাপ',
  'lib.entry.ignou.what': 'দূৰৱৰ্তী শিক্ষাৰ কিতাপ যিবোৰ একেবাৰে বিনামূলীয়াকৈ পোৱা যায়।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ইংৰাজী পুৰণি কিতাপ',
  'lib.entry.gutenberg.what': '৭০,০০০ তকৈ অধিক কিতাপ, আটাইৰে কপিৰাইট সমাপ্ত। বিনামূলীয়া ই-বুক আৰু অডিঅ\'।',
  'lib.entry.pratham-books.title': 'Pratham Books — ল\'ৰা-ছোৱালীৰ কিতাপ',
  'lib.entry.pratham-books.what': 'ভাৰতীয় ভাষাত ল\'ৰা-ছোৱালীৰ কিতাপ, একেবাৰে বিনামূলীয়া। ১ ৰ পৰা ৫ শ্ৰেণীৰ বাবে।',
  'lib.entry.pratham-books.langs': 'হিন্দী, মাৰাঠী, বাংলা, তামিল, তেলুগু আৰু অন্যান্য',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — কাকত আৰু পুৰণি আলোচনী',
  'lib.entry.internet-archive-texts.what': 'লাখ লাখ পুৰণি কিতাপ, আলোচনী আৰু খবৰ কাকত — বিনামূলীয়া।',
  'lib.entry.wikisource.title': 'Wikisource — জন-গদ্য পাঠ',
  'lib.entry.wikisource.what': 'কোনো কপিৰাইট নাই — এইবোৰ সকলোৰে সংসাৰৰ পুৰণি সাহিত্যিক কিতাপ।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — প্ৰতিখন ছবি',
  'lib.entry.wikimedia-commons.what': 'উপজাতি, মানচিত্র, তৰা, বুৰঞ্জী — সকলো। প্ৰতিখন ছবিতে বেলেগ লাইচেঞ্চ লিখা আছে।',
  'lib.entry.pixabay.title': 'Pixabay — ছবি আৰু চিত্ৰ',
  'lib.entry.pixabay.what': 'ছবি, ৰেখাচিত্ৰ আৰু সৰু ভিডিঅ\'।',
  'lib.entry.unsplash.title': 'Unsplash — ধুনীয়া ছবি',
  'lib.entry.unsplash.what': 'বিনামূলীয়া, ডাঙৰ আখৰত, একাউণ্ট অবিহনে।',
  'lib.entry.openverse.title': 'Openverse — সকলো ছবি এক ঠাইত',
  'lib.entry.openverse.what': 'বহুতো বিনামূলীয়া ছবিৰ চাইট একেলগে বিচাৰক।',
  'lib.entry.librivox.title': 'LibriVox — শুনি কিতাপ পঢ়া',
  'lib.entry.librivox.what': 'পুৰণি ইংৰাজী কিতাপৰ বিনামূলীয়া অডিঅ\', মানুহৰ মাতেৰে।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — অডিঅ\' সংগ্ৰহ',
  'lib.entry.internet-archive-audio.what': 'হাজাৰ হাজাৰ বিনামূলীয়া অডিঅ\' — কিতাপ, ভাষণ, সংগীত।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — ৰাষ্ট্ৰীয় সংগীত আৰু গীত',
  'lib.entry.vande-mataram.what': 'ভাৰতৰ ৰাষ্ট্ৰীয় সংগীত আৰু অন্যান্য ৰাষ্ট্ৰীয় গীত, বিনামূলীয়া।',
  'art.aag-aur-bijli-ke-bachav.title': 'আগ আৰু বিজুলীৰ পৰা ৰক্ষা পোৱাৰ নিয়ম',
  'art.aag-aur-bijli-ke-bachav.summary': 'ঘৰত জুই লগাৰ প্ৰতিৰোধ — সহজ নিয়ম',
  'art.aag-lagne-par-kya-karein.title': 'জুই লাগিলে কি কৰিব লাগে',
  'art.aag-lagne-par-kya-karein.summary': 'জ্বলি থকা ঘৰত জুই — আটাইতকৈ আগতে কি কৰিব, কি নকৰিব',
  'art.bimari-se-bachav.title': 'সংক্ৰমণৰ পৰা হাত সৰাৰ সাতটা নিয়ম',
  'art.bimari-se-bachav.summary': 'হাত ধোৱা, মাস্ক, টীকা — আদিৰে সুৰক্ষা',
  'art.dhuwan-ka-jhakora.title': 'ধোঁৱাৰ পৰা হাত সৰাৰ উপায়',
  'art.dhuwan-ka-jhakora.summary': 'ভৰা ধোঁৱা, উশাহ ল’ব নোৱাৰা অৱস্থা — কি কৰিব, কেতিয়া হাস্পতাল যাব',
  'art.doodh-pani-band-ho.title': 'বিজুলী বা পানী হঠাত বন্ধ হ’লে',
  'art.doodh-pani-band-ho.summary': 'কি কৰিব, কি সাৱধানতা ল’ব, কেতিয়া সহায় বিচাৰিব',
  'art.haath-ki-saafai.title': 'চাবোন নোহোৱাকৈ হাত চাফা কৰাৰ উপায়',
  'art.haath-ki-saafai.summary': 'যেতিয়া পানী বা চাবোন নাথাকে',
  'cat.dhyan-aur-yoog.title': 'ধ্যান আৰু যোগ',
  'cat.dhyan-aur-yoog.subtitle': 'মন শান্ত কৰাৰ সহজ উপায়',
  'cat.gharelu-marammat.title': 'ঘৰুৱা মেৰামতি',
  'cat.gharelu-marammat.subtitle': 'ঘৰৰ সৰু-সুৰা সমস্যাৰ সমাধান',
  'cat.bachchon-ki-padhai.title': 'ল’ৰা-ছোৱালীৰ পঢ়া-শুনা',
  'cat.bachchon-ki-padhai.subtitle': 'পঢ়াত মন নবহিলে বা অসুবিধা হ’লে',
  'cat.budharge-seva.title': 'বয়োজ্যেষ্ঠৰ সেৱা',
  'cat.budharge-seva.subtitle': 'যত্ন আৰু সহায়',
  'cat.shishu-dekhbhal.title': 'শিশুৰ যত্ন',
  'cat.shishu-dekhbhal.subtitle': 'নৱজাতকৰ সঠিক যত্ন',
  'cat.dharmik-upay.title': 'ধৰ্মীয় উপায়',
  'cat.dharmik-upay.subtitle': 'মনৰ শান্তিৰ বাবে',
  'cat.pavan-grah-aur-aarti.title': 'পৱিত্ৰ গ্ৰন্থ আৰু আৰতি',
  'cat.pavan-grah-aur-aarti.subtitle': 'শ্ৰদ্ধাৰে পঢ়ক আৰু শুনক',
  'cat.aapatkalen-gayide.title': 'জৰুৰীকালীন গাইড',
  'cat.aapatkalen-gayide.subtitle': 'যেতিয়া তৎক্ষণাৎ সহায়ৰ প্ৰয়োজন হয়',
  'cat.mahamari-suraksha.title': 'মহামাৰীৰ পৰা সুৰক্ষা',
  'cat.mahamari-suraksha.subtitle': 'ৰোগ বিয়পাৰ পৰা হাত সৰাৰ উপায়',
  'nav.tribute': 'স্মৃতি',
  'nav.help': 'সহায়',
  'nav.reference': 'তথ্য',
  'nav.reviews': 'মতামত',
  'nav.support': 'সহায় কৰক',
  'nav.birthChart': 'জন্ম কুণ্ডলী',
  'jgd.title': 'আপোনাৰ জন্ম কুণ্ডলী',
  'jgd.intro': 'আপোনাৰ নাম, জন্মৰ তাৰিখ, আৰু পাৰিলে জন্মৰ সময় আৰু ঠাই লিখক। সকলো হিচাপ আপোনাৰ ফোনতেই হ’ব — একো ক’তো পঠিওৱা নহয়। VARSHA SAMADHAN AI-ৰ দ্বাৰা এই সুবিধা দিয়া হৈছে।',
  'jgd.nameLabel': 'জন্মৰ নাম',
  'jgd.namePlaceholder': 'যেনে সম্পূৰ্ণ নাম',
  'jgd.nameHint': 'সৰুতে যি নাম দিয়া হৈছিল, সেয়াই লিখক।',
  'jgd.dateLabel': 'জন্মৰ তাৰিখ',
  'jgd.timeLabel': 'জন্মৰ সময়',
  'jgd.timeHint': 'নাজানিলে খালী ৰাখক।',
  'jgd.placeLabel': 'জন্মৰ ঠাই',
  'jgd.placeNone': 'নাজানো / বাছনি কৰক',
  'jgd.placeHint': 'জন্মৰ চহৰখন বাছনি কৰক।',
  'jgd.submit': 'হিচাপ কৰক',
  'jgd.savePdf': 'PDF বনাওক',
  'jgd.again': 'নতুনকৈ হিচাপ কৰক',
  'jgd.errDate': 'অনুগ্ৰহ কৰি জন্মৰ তাৰিখ শুদ্ধকৈ লিখক।',
  'jgd.errPlace': 'জন্মৰ চহৰখন তালিকাৰ পৰা বাছনি কৰক, বা ওচৰৰ চহৰখন বাছনি কৰক।',
  'jgd.numTitle': 'অংক জ্যোতিষ',
  'jgd.lifePath': 'জীৱন পথ',
  'jgd.nameNumber': 'নামৰ অংক',
  'jgd.soulNumber': 'আত্মাৰ অংক',
  'jgd.birthdayNumber': 'জন্মদিনৰ অংক',
  'jgd.astroTitle': 'বৈদিক জ্যোতিষ',
  'jgd.nakshatra': 'নক্ষত্ৰ',
  'jgd.pada': 'পদ',
  'jgd.rashi': 'ৰাশি',
  'jgd.rashiLord': 'ৰাশি স্বামী',
  'jgd.nakshatraLord': 'নক্ষত্ৰ স্বামী',
  'jgd.lagna': 'লগ্ন',
  'jgd.lagnaMissing': 'লগ্ন উলিয়াবলৈ জন্মৰ সময় আৰু ঠাই লাগিব। ওপৰত ভৰাই লৈ হিচাপ কৰক, আৰু যদি নাজানিব তেন্তে ইয়াতেই কাম চলিব।',
  'jgd.gunTitle': 'গুণ মিলান',
  'jgd.gunIntro': 'অন্য ব্যক্তিৰ নাম আৰু জন্মতাৰিখ ভৰাওক।',
  'jgd.gunName': 'তেওঁৰ নাম',
  'jgd.gunDate': 'তেওঁৰ জন্মতাৰিখ',
  'jgd.gunHint': 'দুয়োৰে নাম আৰু জন্মতাৰিখ থাকিলে গুণ মিলান ওলাব।',
  'jgd.disclaimer': 'এইটো পৰম্পৰা অনুযায়ী কৰা হিচাপহে, ভৱিষ্যদ্বাণী নহয়। কোনো সংখ্যা বা ৰাশিয়ে কাৰো স্বাস্থ্য, ধন বা সম্পৰ্ক ঠিক নকৰে। ডাঙৰ সিদ্ধান্ত ডাক্তৰ, আইনী পৰামৰ্শদাতা বা অভিজ্ঞ লোকৰ পৰামৰ্শ লৈ ল\'ব।',
  'nav.menu': 'মেনু',
  'nav.openMenu': 'মেনু খোলক',
  'nav.closeMenu': 'মেনু বন্ধ কৰক',
  'nav.expand': 'বাছ খোলক',
  'nav.collapse': 'বাছ বন্ধ কৰক',
  'nav.skip': 'োনশাতেই সমললৈ যাওক',
  'nav.language': 'ভাষা সলনি কৰক',
  'footer.pages': 'পৃষ্ঠাসমূহ',
  'footer.helplines': 'দৰকাৰী নম্বৰ',
  'footer.free': 'এই সেৱা সম্পূৰ্ণ বিনামূল্যে। কাৰো পৰা কোনো পইচা লোৱা নহয়।',
  'footer.readStory': 'তেওঁলোকৰ সম্পূৰ্ণ কথা পঢ়ক',
  'footer.admin': 'প্ৰবন্ধক',
  'footer.rights': 'বিনামূলীয়া সেৱা',
  'footer.emergency': 'জৰুৰীকালীন',
  'footer.ambulance': 'এম্বুলেঞ্চ',
  'footer.women': 'মহিলা হেল্পলাইন',
  'home.dedication1': 'ৰ সোঁৱৰণত — এক সম্পূৰ্ণ বিনামূলীয়া সেৱা।',
  'home.dedication2': 'আপোনাৰ সমস্যা লিখক বা কওক।',
  'home.emergencyTitle': 'দৰকাৰী — লগে লগে সাহায্য লাগে',
  'home.emergencyNote': 'এইবোৰ প্ৰথমে পঢ়ক। বাকীবোৰ পিছত দেখা যাব।',
  'home.readMore': 'সম্পূৰ্ণ তথ্য পঢ়ক',
  'home.chooseTopic': 'কোনটো বিষয়ত জানিব বিচাৰে?',
  'home.memorialEyebrow': 'এই চাইটখন কাৰ বাবে',
  'home.memorialLine': 'যিবিলাকে সমাজৰ বাবে গোটেই জীৱন যুঁজ দিলে, আৰু যিবিলাকে শেষত নিজৰ অংশৰ হিচাপ নাপালে।',
  'home.memorialMore': 'তেওঁলোকৰ সম্পূৰ্ণ কাহিনী পঢ়ক',
  'home.kundaliTitle': 'জন্ম কুণ্ডলী',
  'home.kundaliNote': 'সম্পূৰ্ণ কুণ্ডলী — ৯ টা গ্ৰহ, বিমশত্তৰী দশা, ফলাদেশ, যোগ, ষোড়শৱৰ্গ, কেপি, লাল কিতাব আৰু সংখ্যা জ্যোতিষ। সকলো আপোনাৰ ফোনটোতেই হিচাপ কৰা হ\'ব।',
  'home.chooseTopicNote': 'তলত দিয়া বিষয়টোত টিপক। প্ৰতিটো ঠাইতে সহজ ভাষাত তথ্য দিয়া হৈছে।',
  'home.askHere': 'এই বিষয়টোতেই সোধক',
  'home.categoryEmpty': 'এই বিষয়ত এতিয়ালৈকে একো লিখা হোৱা নাই।',
  'home.soundTitle': 'শান্তিৰ বাবে ধ্বনি',
  'home.soundIntro': 'কোনো মাচুল নাই, কোনো বিজ্ঞাপন নাই। কেৱল মন শান্ত কৰাৰ বাবে।',
  'home.howTitle': 'এই সেৱাই কেনেকৈ কাম কৰে',
  'home.step1Title': 'আপোনাৰ কথা লিখক বা কওক',
  'home.step1Body': 'হিন্দীত টাইপ কৰক, বা মাইকটো টিপি কওক। একো বিশেষ কৰিব নালাগে — যি মনত আছে তাকে লিখি দিয়ক।',
  'home.step2Title': 'লগে লগে উত্তৰ পোৱা যায়',
  'home.step2Body': 'প্ৰতিটো প্ৰশ্ন এন্ট্ৰি হয় আৰু তাৰ উত্তৰ লগে লগে পোৱা যায়। বহুত দীঘল প্ৰশ্নৰ আগতে সৰু প্ৰশ্নৰ পৰা আৰম্ভ কৰক।',
  'home.step3Title': 'কোনো পইচা নাই, কোনো ব্যক্তিগত তথ্য নাই',
  'home.step3Body': 'এই সেৱা একেবাৰে বিনামূল্যে। আপোনাৰ নাম, ঠিকনা বা ফোন নম্বৰ বিচৰা নহয়, আৰু কোনো বিজ্ঞাপন দেখুওৱা নহয়।',
  'home.stepLabel': 'ধাপ',
  'home.freeTitle': 'এই সেৱা একেবাৰে বিনামূল্যে',
  'home.freeBody': 'কোনো পইচা লোৱা নহয়, কোনো ব্যক্তিগত তথ্য বিচৰা নহয়, আৰু কোনো বিজ্ঞাপন দেখুওৱা নহয়।',
  'help.q1.label': 'বিদ্যুৎ নাই, মই কি কৰিম?',
  'help.q1.question': 'ঘৰত বিজুলী নাই। কি কৰিব লাগে, আৰু মোবাইল ফোন কেনেকৈ চাৰ্জ কৰিম?',
  'help.q2.label': 'ল’ৰা-ছোৱালীৰ পঢ়াত দুৰ্বলতা',
  'help.q2.question': 'মোৰ ল’ৰা-ছোৱালীৰ পঢ়াত বৰ দুৰ্বলতা আছে। ঘৰত কেনেকৈ শুধৰাম?',
  'help.q3.label': 'বয়োজ্যেষ্ঠৰ চিকিৎসা',
  'help.q3.question': 'মোৰ দেউতাৰ বয়স বৰ বেছি, তেওঁৰ চিকিৎসা কেনেকৈ কৰিম?',
  'help.q4.label': 'ঘৰত জুই লাগিলে কি কৰিব',
  'help.q4.question': 'যদি ৰাতি ঘৰত জুই লাগে তেন্তে আটাইতকৈ আগতে কি কৰিব লাগে?',
  'help.title': 'আপোনাৰ সমস্যাটো লিখক',
  'help.intro': 'তলত লিখক বা কওক। যদি নাজানে তেন্তে মনত যি আহে সেয়াই লিখি দিয়ক — এয়াই আটাইতকৈ দৰকাৰী।',
  'help.suggested': 'সাধাৰণ প্ৰশ্ন',
  'help.howTitle': 'এই সেৱাটো কেনেকৈ কাম কৰে',
  'help.howBody': 'প্ৰতিটো প্ৰশ্ন জমা হয় আৰু তাৰ উত্তৰ লগে লগে পোৱা যায়। আপোনাৰ নাম, ঠিকনা বা ফোন নম্বৰ ক’তো লোৱা নহয়। সকলোবোৰ বিনামূলীয়া।',
  'ref.title': 'এই সেৱাটো কি, আৰু কাৰ বাবে',
  'ref.intro': 'এই সেৱাটো শ্ৰীমতী VARSHA-ৰ সোঁৱৰণত তৈয়াৰ কৰা হৈছে। ইয়াত সহজ ভাষাত কোৱা হৈছে যে ই কি কৰে, ইয়াত কি কি আছে, আৰু ইয়াৰ সীমা কি কি। সকলোবোৰ সম্পূৰ্ণ বিনামূলীয়া — কোনো পইচা লোৱা নহয়, কোনো বিজ্ঞাপন দেখুওৱা নহয়, আৰু কোনো ব্যক্তিগত তথ্য বিচৰা নহয়।',
  'ref.whatTitle': 'ইয়াত কি কি আছে',
  'ref.what1': 'ঘৰত জুই লাগিলে, বিজুলী গ’লে, ল’ৰা-ছোৱালীৰ পঢ়াত দুৰ্বলতা হ’লে, মাক-দেউতাকৰ যত্ন ল’বলগীয়া হ’লে — এনে সাধাৰণ সমস্যাৰ সহজ উপায়, পৰিষ্কাৰ ভাষাত।',
  'ref.what2': 'প্ৰশ্ন কৈ সুধিব পৰা সুবিধা। যদি ক’ব নাজানে তেন্তে লিখক — দুয়োটাৰে উত্তৰ একেই পোৱা যায়।',
  'ref.what3': 'প্ৰতিটো প্ৰশ্ন জমা হয়, সেয়ে যিটোৱে আনক আমনি কৰে সেয়া আপোনাৰ আগতেই সোধা হৈছে আৰু তাৰ উত্তৰ পোৱা গৈছে।',
  'ref.what4': 'কোনো বিজ্ঞাপন নাই, কোনো অলাগতিয়াল তথ্য নাই, আৰু কোনো ব্যক্তিগত তথ্য বিচৰা নহয়। সকলোবোৰ বিনামূলীয়া।',
  'ref.helplineTitle': 'তৎকাল সহায়ৰ বাবে এই নম্বৰবোৰ ৰাখক',
  'ref.helpline1': 'কোনো ডাঙৰ বিপদ হ’লে — যেনে জুই, বিজুলীৰ তীব্ৰ জোকাৰণি, পৰি যোৱা বা বৰ বেছি তেজ ওলোৱা — তেন্তে 112 নম্বৰত ফোন কৰক।',
  'ref.helpline2': 'কাৰোবাৰ বেমাৰ বা আঘাত লাগিছে আৰু যোৱাৰ কোনো উপায় নাই, তেন্তে 108 নম্বৰত এম্বুলেন্স মাতিব।',
  'ref.helpline3': 'মহিলাৰ সৈতে কোনো বেয়া কাম হৈছে, বা মহিলাক ক’ৰবাৰ পৰা আমনি কৰা হৈছে, তেন্তে 181 নম্বৰত ফোন কৰক। ই বিনামূলীয়া।',
  'ref.helpline4': 'শিশু বা বৃদ্ধৰ সৈতে কোনো অন্যায় হৈছে, তেন্তে 1098 নম্বৰত অভিযোগ কৰিব পাৰি।',
  'ref.helpline5': 'মানসিক চাপ বৰ বেছি হ’লে, বা জীয়াই থকাৰ ইচ্ছা নথকা হ’লে, তেন্তে 14416 নম্বৰত ক’ব পাৰি। কেৱল কথা পাতিবলৈ।',
  'ref.dataTitle': 'আপোনাৰ বিষয়ে আমি কি ৰাখোঁ',
  'ref.dataBody': 'কেৱল আপুনি সোধা প্ৰশ্নটো, তাৰ সাৰাংশ, আৰু প্ৰশ্ন সোধাৰ সময় — যাতে আমি বাৰে বাৰে একে উত্তৰ দিব নালাগে। আপোনাৰ নাম, ঠিকনা, ফোন নম্বৰ, বা কোনো পৰিচয় দিব পৰা তথ্য লোৱা নহয়। ছাইটত কোনো বিজ্ঞাপন বা ট্ৰেকিং স্ক্ৰিপ্ট লগোৱা নাই।',
  'ref.adminTitle': 'প্ৰবন্ধকে কি কৰিব পাৰে',
  'ref.adminBody': 'প্ৰবন্ধকে আপুনি পঠিওৱা লেখাবোৰ চাব পাৰে, আৰু তাৰ উত্তৰ লিখিব পাৰে। তেওঁলোকে আপোনাৰ অনুমতি অবিহনে কোনো লেখা সলনি বা আঁতৰাব নোৱাৰে, আৰু আপোনাৰ তথ্য কাকো বিক্ৰী কৰিব নোৱাৰে।',
  'ref.statsCategories': 'বিষয় উপলব্ধ আছে',
  'ref.statsArticles': 'লেখা লিখা হৈছে',
  'ref.statsQuestions': 'প্ৰশ্ন সোধা হৈছে',
  'ref.ownerNote': 'এই সেৱাটো কোনো কোম্পানীৰ নহয়, কোনো চৰকাৰৰ নহয়, বৰঞ্চ এজন ব্যক্তিৰ সোঁৱৰণত চলাই থকা হৈছে। সেয়ে ইয়াত কোনো বিজ্ঞাপন নাই, কোনো সদস্যপদ নাই, আৰু কোনো পইচা লোৱা নহয়।',
  'support.title': 'এই সেৱাটো বিনামূলীয়া',
  'support.intro': 'এই সেৱাই কাৰো পৰা পইচা নলয়। কিন্তু ই চলি থাকে — সেয়ে কিছুমান উপায় আছে যাৰ দ্বাৰা আপুনি সহায় কৰিব পাৰে। আটাইতকৈ সহজ উপায়টোৱেই আটাইতকৈ কামৰ।',
  'support.waysTitle': 'আপুনি কেনেকৈ সহায় কৰিব পাৰে',
  'support.way1Title': 'আপোনাৰ অভিজ্ঞতা লিখক',
  'support.way1Body': 'যদি এই ছাইটৰ পৰা আপুনি কিবা ভাল পাইছে — বা কিবা এনে পাইছে যিয়ে আপোনাক বিভ্ৰান্ত কৰিছে — তেন্তে ৰায় দিয়া পৃষ্ঠাত লিখি দিয়ক। আপোনাৰ নাম লোৱা দৰকাৰী নহয়।',
  'support.way2Title': 'আপোনাৰ চহৰৰ বিষয়ে কওক',
  'support.way2Body': 'আপুনি য’ত থাকে, তাৰ ভাষা, ৰীতি-নীতি আৰু সমস্যাবোৰ বেলেগ হয়। যদি আপোনাৰ ঠাইৰ কিবা কথা ইয়াত নাই, তেন্তে কওক — যোগ কৰিব পৰা হ’লে যোগ কৰি দিয়া হ’ব।',
  'support.way3Title': 'আপোনাৰ অভিজ্ঞতা আনক শুনক',
  'support.way3Body': 'ইয়াত যি লিখা আছে সেয়া বহু মানুহৰ কামত আহিব পাৰে, যদি তেওঁলোকে জানে। এনে কোনো ব্যক্তিক কওক যিয়ে ইয়াৰ পৰা সঁচাকৈ সহায় পাব পাৰে।',
  'support.way4Title': 'ইয়াত আহি চাওক',
  'support.way4Body': 'যদি আপোনাৰ হাতত সময় আছে, তেন্তে নিজে আহি চাওক যে এই ছাইটটো ঠিকমতে চলিছে নে নাই। কিবা বেয়া দেখিলে কওক — সম্পূৰ্ণ বিনামূলীয়াকৈ ঠিক কৰি দিয়া হ’ব।',
  'support.contactTitle': 'কিবা ক’ব বিচাৰে নেকি?',
  'support.contactBody': 'যিকোনো কথাৰ বাবে ইয়াত লিখিব পাৰে — ভুল হওক, কিবা বেছি পাওক, বা কোনো প্ৰশ্ন হওক। যিমান লিখিবলৈ সহজ লাগে, সিমানখিনিয়েই লিখক।',
  'support.faqTitle': 'কিছুমান কথা যিবোৰ বাৰে বাৰে সোধা হয়',
  'support.faqBody': 'ই সঁচাকৈ বিনামূলীয়া নেকি? হয়। আপোনাৰ নাম লোৱা হয় নেকি? নাই, নাম দিয়া দৰকাৰী নহয়। বিজ্ঞাপন আহে নেকি? নাই। কোনো ফোন নম্বৰ বা ঠিকনা বিচৰা হয় নেকি? নাই। কোনো এপ ডাউনলোড কৰিব লাগিব নেকি? নাই, কেৱল ব্ৰাউজাৰত খুলি যায়।',
  'ask.label': 'আপোনাৰ সমস্যা লিখক বা মাইকৰ পৰা কওক',
  'ask.placeholder': 'যেনে: ল’ৰা-ছোৱালীৰ পঢ়াত দুৰ্বলতা আছে',
  'ask.help': 'এণ্টাৰ টিপিও পঠিয়াব পাৰে।',
  'ask.send': 'সোধক',
  'ask.sending': 'ভাবি আছোঁ…',
  'ask.clear': 'লিখাখিনি মচি দিয়ক',
  'ask.speak': 'কৈ সোধক',
  'ask.listening': 'ক\'বলৈ আৰম্ভ কৰক…',
  'ask.heard': 'শুনি আছো',
  'ask.stopListening': 'শুনা বন্ধ কৰক',
  'ask.suggested': 'সাধাৰণ প্ৰশ্ন',
  'ask.answerTitle': 'সমাধান',
  'ask.listen': 'শুনক',
  'ask.stopSpeak': 'ৰখাওক',
  'ask.aiNote': 'এই উত্তৰটো AI-এ দিছে। ই কোনো বিশেষজ্ঞৰ পৰামৰ্শৰ বিকল্প নহয়।',
  'ask.errorRateLimit': 'বহুত বেছি প্ৰশ্ন একেলগে পঠিওৱা হৈছে। অলপ সময়ৰ পাছত চেষ্টা কৰক।',
  'ask.errorNetwork': 'ইণ্টাৰনেট চলি থকা নাই। সংযোগ পৰীক্ষা কৰি আকৌ চেষ্টা কৰক।',
  'ask.notAnswer': 'এই প্ৰশ্নটোৰ পোনপটীয়া উত্তৰ আমাৰ হাতত নাই।',
  'ask.emptyAnswer': 'এইবাৰ উত্তৰ দিব পৰা নগ\'ল। অলপ বেলেগকৈ সুধি চাওক।',
  'ask.micUnsupported': 'এই ব্ৰাউজাৰত মাত দি প্ৰশ্ন সোধা কাম নকৰিব। লিখি সোধক।',
  'ask.heardWith': 'এইটো শুনি আছো:',
  'voice.notAllowed': 'মাইকৰ অনুমতি পোৱা নগ\'ল। ওপৰলৈ গৈ অনুমতি দিয়ক, বা লিখি সোধক।',
  'voice.serviceNotAllowed': 'মাইকৰ অনুমতি পোৱা নগ\'ল। ওপৰলৈ গৈ অনুমতি দিয়ক, বা লিখি সোধক।',
  'voice.noSpeech': 'একো মাত শুনা নগ\'ল। মাইকৰ ওচৰত কওক, বা লিখক।',
  'voice.audioCapture': 'কোনো মাইক পোৱা নগ\'ল। ডিভাইচ সংযোগ কৰক, বা লিখি সোধক।',
  'voice.network': 'মাত দি সোধাৰ বাবে ইণ্টাৰনেট লাগে, আৰু সেয়া চলি থকা নাই। লিখি সোধক — উত্তৰ একেটাই পাব।',
  'voice.aborted': 'ৰৈ গ\'ল। আকৌ চেষ্টা কৰক।',
  'voice.unsupported': 'এই ব্ৰাউজাৰত মাত দি প্ৰশ্ন সোধা কাম নকৰিব। লিখি সোধক।',
  'voice.speakFailed': 'এই উত্তৰটো শুনাব পৰা নগ\'ল।',
  'voice.noVoice': 'এই ডিভাইচত {name} কোৱা মাত পোৱা নগ\'ল। এতিয়া লিখাখিনি পঢ়ক, বা ফোনৰ ছেটিংছত গৈ মাত যোগ কৰক।',
  'voice.generic': 'কিবা এটা ভুল হৈছে। আকৌ চেষ্টা কৰক।',
  'sound.title': 'শান্তিৰ বাবে ধ্বনি',
  'sound.intro': 'কোনো মাচুল নাই, কোনো বিজ্ঞাপন নাই। কেৱল মন শান্ত কৰিবলৈ।',
  'sound.playing': 'ধ্বনি চলি আছে। বন্ধ কৰিবলৈ একেটা বুটামতে আকৌ টিপক।',
  'sound.shankh': 'শংখ',
  'sound.shankhHint': 'গভীৰ, দীঘল',
  'sound.bansuri': 'বাঁহী',
  'sound.bansuriHint': 'কোমল, ধীৰ',
  'sound.dhol': 'ঢোল',
  'sound.dholHint': 'তীক্ষ্ণ, দ্ৰুত',
  'sound.all': 'তিনিওটা',
  'sound.allHint': 'একেলগে',
  'sound.listenLabel': 'শুনক',
  'sound.errUnsupported': 'এই ব্ৰাউজাৰত ধ্বনি চলিব পৰা নাই।',
  'sound.errGeneric': 'ধ্বনি চলোৱাত সমস্যা হৈছে।',
  'dhun.welcome': 'স্বাগতম',
  'dhun.prompt': 'শংখ, বাঁহী আৰু ঢোল — একেলগে শুনিবলৈ স্পৰ্শ কৰক।',
  'dhun.listen': '▶ শুনক',
  'dhun.skip': 'ধ্বনি এৰি যাওক',
  'dhun.failed': 'ধ্বনি চলিব পৰা নাই।',
  'dhun.label': 'ধ্বনি চলোৱাৰ অনুমতি',
  'reviews.title': 'আপোনাৰ মতামত, আপোনাৰ কথা',
  'reviews.intro': 'এই সেৱাটো আপোনাৰ কামত আহিল নে? আপোনাৰ কথা লিখক — আপোনাৰ নাম লোৱাটো জৰুৰী নহয়।',
  'reviews.pageTitle': 'আপোনাৰ মতামত',
  'reviews.pageIntro': 'ইয়াত মানুহে লিখা কথাবোৰ আছে। কোনো মতামত লুকুৱাই ৰখা নহয়, আৰু যি লিখা হৈছে সেয়া ইয়াত দেখা যায় — কেৱল এবাৰ চাই লোৱাৰ পাছত প্ৰকাশ কৰা হয়।',
  'reviews.write': 'আপোনাৰ মতামত লিখক',
  'reviews.submit': 'পঠাওক',
  'reviews.sending': 'পঠাই আছো…',
  'reviews.name': 'আপোনাৰ নাম (জৰুৰী নহয়)',
  'reviews.city': 'আপোনাৰ চহৰ (জৰুৰী নহয়)',
  'reviews.comment': 'আপোনাৰ কথা',
  'reviews.placeholder': 'মনত যি আহে সেয়াই লিখক — একো শুদ্ধ কৰাৰ প্ৰয়োজন নাই।',
  'reviews.moderated': 'আপোনাৰ মতামত প্ৰকাশ হোৱাৰ আগতে এবাৰ পৰীক্ষা কৰি চোৱা হয়।',
  'reviews.moderationNote': 'সকলো কথা যাতে ঠিক থাকে, তাৰ বাবে প্ৰকাশ হোৱাৰ আগতে প্ৰতিটো মতামত এবাৰ পৰীক্ষা কৰি চোৱা হয়। গালি-গালাজ, ফোন নম্বৰ বা ব্যক্তিগত কথা আঁতৰাই দিয়া হয় — বাকী সকলো একেদৰেই প্ৰকাশ কৰা হয়।',
  'reviews.summaryTitle': 'সাধাৰণ মতামত',
  'reviews.count': 'মতামতসমূহ',
  'reviews.anonymous': 'নাম নোহোৱাকৈ',
  'reviews.summaryLine': 'মানুহে গড়ে ৫ তাৰকাৰ ভিতৰত {rating} তাৰকা দিছে, মুঠ {count} জনৰ মতামতৰ আধাৰত।',
  'reviews.starsLabel': '৫ তাৰকাৰ ভিতৰত {value} তাৰকা',
  'reviews.keepLabel': 'বেয়া লাগক বা ভাল লাগক — দুয়োটা কথা লিখক',
  'reviews.ownerReply': 'উত্তৰ',
  'reviews.replyLabel': 'এই বিষয়ে লিখা হৈছে',
  'reviews.empty': 'এতিয়ালৈকে কোনো মতামত নাই। প্ৰথম মতামতটো আপুনিয়ে লিখক।',
  'reviews.toastSent': 'ধন্যবাদ',
  'reviews.toastFailed': 'মতামত পঠিয়াব পৰা নগ\'ল',
  'reviews.fieldTooShort': 'কমকৈ হ\'লেও ১০টা আখৰ লিখক।',
  'reviews.rateLimited': 'বহুত দ্ৰুতগতিত পঠিওৱা হৈছে। অলপ ৰৈ আকৌ চেষ্টা কৰক।',
  'cat.notFound': 'এই পৃষ্ঠাখন পোৱা নগ\'ল',
  'cat.empty': 'এই বিষয়ত এতিয়ালৈকে কোনো প্ৰবন্ধ নাই।',
  'article.emergency': 'জৰুৰী',
  'article.askAbout': 'এই বিষয়ত সোধক',
  'article.readAloud': 'এই প্ৰবন্ধটো শুনক',
  'article.others': 'এই বিষয়ৰ আন প্ৰবন্ধসমূহ',
  'article.count': '{count} টা প্ৰবন্ধ',
  'theme.toLight': 'পোহৰ থকা ৰূপলৈ যাওক',
  'theme.toDark': 'আন্ধাৰ থকা ৰূপলৈ যাওক',
  'toast.dismiss': 'বন্ধ কৰক',
  'language.choose': 'আপোনাৰ ভাষা বাছনি কৰক',
  'language.articlesIn': 'এই প্ৰবন্ধটো হিন্দীত আছে।',
  'language.articlesInHint': 'প্ৰতিটো ভাষাৰ বাবে সুকীয়া অনুবাদৰ প্ৰয়োজন। এই অনুবাদটো এতিয়াও হোৱা নাই — যি লিখা আছে সেয়া হিন্দীতেই সঠিক আৰু সম্পূৰ্ণ।',
  'ask.welcome': 'আপোনাক স্বাগতম! তলত আপোনাৰ সমস্যাটো লিখক বা কোনো এটা বিষয় বাছনি কৰক।',
  'ref.notTitle': 'এই সেৱাই কি নকৰে',
  'ref.not1': 'ই কোনো ডাক্তৰ নহয়। ঔষধৰ পৰামৰ্শ কেতিয়াও দিয়া নহয়।',
  'ref.not2': 'ই কোনো উকীল নহয়। আইনী পৰামৰ্শ দিয়া নহয়।',
  'ref.not3': 'কোনো ধৰণৰ টকা লোৱা নহয় আৰু কোনো বিজ্ঞাপনো দেখুওৱা নহয়।',
  'ref.not4': 'আপোনাৰ নাম, ঠিকনা বা ফোন নম্বৰ বিচৰা নহয় আৰু জমাও ৰখা নহয়।',
  'ref.not5': 'কোনো চৰকাৰী আঁচনিৰ দাম বা নম্বৰ দিয়া নহয় — সঠিক তথ্য নাথাকিলে স্পষ্টকৈ জনাই দিয়া হয় যে নাজানো।',
  'ref.medicalTitle': 'জৰুৰী: ই ডাক্তৰৰ পৰামৰ্শ নহয়',
  'ref.medicalBody': 'ৰোগ, ঔষধ বা কোনো বিষাক্ত বস্তুৰ সৈতে জড়িত কথা হ\'লে, প্ৰথমে ডাক্তৰৰ ওচৰলৈ যাওক। ইয়াত দিয়া তথ্য কেৱল সাধাৰণ সহায়ৰ বাবেহে। শিশুৰ টীকা, গৰ্ভাৱস্থা বা যিকোনো ঔষধ আৰম্ভ কৰাৰ আগতে ডাক্তৰৰ পৰামৰ্শ অৱশ্যেই ল\'ব।',
  'ref.statsTitle': 'কিমান তথ্য উপলব্ধ আছে',
  'support.howTitle': 'আমাৰ সহায় কেনেকৈ কৰিব',
  'support.alwaysFreeTitle': 'এই সেৱা সদায় বিনামূলীয়া হৈ থাকিব',
  'support.alwaysFreeBody': 'যি সহায় পোৱা যায়, সেয়া সেৱাটো চলোৱাত খৰচ কৰা হ\'ব। কাৰো পৰা কেতিয়াও টকা লোৱা নহ\'ব।',
  'smriti.eyebrow': 'শ্ৰদ্ধাঞ্জলি',
  'smriti.whyTitle': 'এই ৱেবছাইটটো কিয় আছে',
  'smriti.ending': 'তেওঁলোকৰ সংগ্ৰাম ইয়াতেই আগবাঢ়ি যায়।',
  'article.askAny': 'যিকোনো প্ৰশ্ন সোধক',
  'article.remember': 'মনত ৰাখিব',
  'article.emergencyInfo': 'জৰুৰী তথ্য',
  'article.medicalTitle': 'ই চিকিৎসা সম্পৰ্কীয় পৰামৰ্শ নহয়',
  'article.medicalBody': 'এই তথ্য কেৱল সাধাৰণ সহায়ৰ বাবেহে। কোনো ঔষধ আৰম্ভ বা বন্ধ নকৰিব — প্ৰথমে ডাক্তৰৰ সৈতে কথা পাতক।',
  'article.heading': '{category} ৰ প্ৰবন্ধসমূহ',
  'reviews.rateQuestion': 'কিমান তাৰকা দিব?',
  'reviews.starsShort': '{value} তাৰকা',
  'reviews.averageOutOf': '৫ তাৰকাৰ ভিতৰত {value} তাৰকা',
  'dhun.welcomeTitle': 'স্বাগতম',
  'dhun.consent': 'শংখ, বাঁহী আৰু নগাৰা — একেলগে শুনিবলৈ স্পৰ্শ কৰক।',
  'dhun.unsupported': 'এই ব্ৰাউজাৰটোৱে শব্দ চলাব নোৱাৰে।',
  'dhun.failedTry': 'শব্দ চলোৱাত সমস্যা হৈছে।',
  'sound.hintIdle': 'যিকোনো এটা বুটামত টিপি শব্দ শুনক।',
  'sound.hintPlaying': 'শব্দ চলি আছে। বন্ধ কৰিবলৈ একেটা বুটামতে আকৌ টিপক।',
  'sound.preparing': 'শব্দ প্ৰস্তুত হৈ আছে',
  'nav.path': 'পথ',
  'health.heading': 'আপোনাৰ বয়স কওক',
  'health.intro': 'বয়স অনুযায়ী যিবোৰ প্ৰশ্ন সঘনাই সোধা হয়, সেইবোৰ ইয়াত দেখা পাব। যিকোনো এটা বুটামত টিপক — প্ৰশ্নটো তলত আহি যাব, তাৰপাছত সুধিব পাৰিব।',
  'health.ageLabel': 'বয়স (বছৰ)',
  'health.years': 'বছৰ',
  'health.bandsLabel': 'বয়স অনুযায়ী বাছক',
  'health.notAdviceStrong': 'এইটো চিকিৎসাৰ পৰামৰ্শ নহয়।',
  'health.notAdvice': 'কোনো ধৰণৰ ঔষধ আৰম্ভ বা বন্ধ নকৰিব — প্ৰথমে ডাক্তৰৰ লগত কথা পাতক।',
  'health.emergencyStrong': 'জৰুৰী অৱস্থাত ফোন কৰক:',
  'health.emergencyCall': '(জৰুৰীকালীন)',
  'health.emergencyAmbulance': '(এম্বুলেন্স)',
  'health.emergencyWomen': '(মহিলা হেল্পলাইন)',
  'health.privacy': 'কোনো নাম বা ঠিকনা লিখাৰ প্ৰয়োজন নাই।',
  'health.band.infant.label': '০ – ২ বছৰ',
  'health.band.infant.note': 'সৰু ল’ৰা-ছোৱালী, যিয়ে এতিয়াও নিজৰ কথা ক’ব নোৱাৰে',
  'health.c.infant1': 'খুব জ্বৰ',
  'health.q.infant1': 'মোৰ কেঁচুৱাৰ খুব জ্বৰ, মই কি গাখীৰ খুৱাব পাৰোঁ?',
  'health.c.infant2': 'খাব খোজা নাই',
  'health.q.infant2': 'সৰু ল’ৰা-ছোৱালীয়ে খাব খোজা নাই, মই কি কৰিম?',
  'health.c.infant3': 'বমি হৈছে',
  'health.q.infant3': 'কেঁচুৱাৰ বমি হৈছে, কেতিয়া ডাক্তৰক দেখুৱাম?',
  'health.c.infant4': 'পাতল শৌচ হৈছে',
  'health.q.infant4': 'কেঁচুৱাৰ পাতল শৌচ হৈছে, কি খুৱাব লাগে?',
  'health.band.child.label': '৩ – ১২ বছৰ',
  'health.band.child.note': 'ল’ৰা-ছোৱালী যিয়ে কথা ক’ব পাৰে, কিন্তু প্ৰশ্ন সুধিবলৈ ভয় কৰে',
  'health.c.child1': 'পঢ়াত মন নাই',
  'health.q.child1': 'ল’ৰা-ছোৱালীৰ পঢ়াত মন নাই, মই কি কৰিম?',
  'health.c.child2': 'স্কুললৈ যাব নিবিচাৰে',
  'health.q.child2': 'ল’ৰা-ছোৱালীয়ে সদায় স্কুললৈ যাবলৈ মানা কৰিছে, ইয়াৰ কাৰণ কি হ’ব পাৰে?',
  'health.c.child3': 'ৰাতি জ্বৰ',
  'health.q.child3': 'ল’ৰা-ছোৱালীৰ ৰাতি জ্বৰ আহে, মই কি কৰিম?',
  'health.c.child4': 'দাঁত সৰিছে',
  'health.q.child4': 'ল’ৰা-ছোৱালীৰ দাঁত সৰিছে, দাঁতৰ যত্ন কেনেকৈ ল’ম?',
  'health.band.teen.label': '১৩ – ১৭ বছৰ',
  'health.band.teen.note': 'কিশোৰ-কিশোৰী, যিয়ে প্ৰায়ে নিজৰ কথা শুনিবলৈ কোনোবা এজনক বিচাৰি নাপায়',
  'health.c.teen1': 'পঢ়াৰ হেঁচা',
  'health.q.teen1': 'পঢ়াৰ বহুত হেঁচা আছে, ইয়াৰ মোকাবিলা কেনেকৈ কৰিম?',
  'health.c.teen2': 'টোপনি নাহে',
  'health.q.teen2': 'ৰাতি ভালদৰে টোপনি নাহে, মই কি কৰিম?',
  'health.c.teen3': 'ম’বাইলৰ নিচা',
  'health.q.teen3': 'ম’বাইলৰ নিচা লাগিছে, এৰাৰ উপায় কওক।',
  'health.c.teen4': 'বহুত দুখ',
  'health.q.teen4': 'বহুত দুখ অনুভৱ হয়, কাৰ লগত কথা পাতিম?',
  'health.band.young.label': '১৮ – ৩০ বছৰ',
  'health.band.young.note': 'কৰ্মক্ষেত্ৰ, টকা-পইচা আৰু টোপনি — তিনিওটাৰ একেলগে বোজা',
  'health.c.young1': 'কামৰ মানসিক চাপ',
  'health.q.young1': 'কামৰ মানসিক চাপ বহুত বেছি, কেনেকৈ কম কৰিম?',
  'health.c.young2': 'বহি থকাৰ বাবে পিঠিৰ বিষ',
  'health.q.young2': 'বহি থকাৰ বাবে পিঠিত বিষ হৈছে, মই কি কৰিম?',
  'health.c.young3': 'টোপনি নাহে',
  'health.q.young3': 'ৰাতি টোপনি নাহে, কি উপায় আছে?',
  'health.c.young4': 'টকাৰ অভাৱ',
  'health.q.young4': 'টকাৰ অভাৱ আৰু খৰচ বেছি, মই কি কৰিম?',
  'health.band.middle.label': '৩১ – ৪৫ বছৰ',
  'health.band.middle.note': 'ঘৰ, ল’ৰা-ছোৱালী আৰু নিজৰ স্বাস্থ্য — সকলোৰে দায়িত্ব একেলগে',
  'health.c.middle1': 'কালৰ বিষ',
  'health.q.middle1': 'কালৰ বিষ হৈছে, ইয়াৰ কাৰণ কি হ’ব পাৰে?',
  'health.c.middle2': 'টোপনিৰ সমস্যা',
  'health.q.middle2': 'টোপনি ভালকৈ নহয়, ভাল কৰাৰ উপায় কি?',
  'health.c.middle3': 'ঘৰুৱা চিন্তা',
  'health.q.middle3': 'ঘৰত বৰ চিন্তা, ল’ৰা-ছোৱালীক কেনেকৈ চম্ভালিম?',
  'health.c.middle4': 'পেটত গেছ',
  'health.q.middle4': 'কামৰ মাজত বহু বছৰ ধৰি পেটত গেছৰ সমস্যা হৈছে, কি কৰিম?',
  'health.band.later.label': '৪৬ – ৬০ বছৰ',
  'health.band.later.note': 'শৰীৰৰ বয়স আৰু তাৰ যত্ন — দুয়োটাই একেলগে',
  'health.c.later1': 'পিঠিৰ বিষ',
  'health.q.later1': 'মোৰ বয়স ৫৪ বছৰ আৰু পিঠিত বিষ হৈছে, কি কৰিম?',
  'health.c.later2': 'ঠুৰীৰ বিষ',
  'health.q.later2': 'ওপৰলৈ উঠিলে ঠুৰীত বিষ হয়, কিয়?',
  'health.c.later3': 'ৰাতি ভৰিত কামোৰণি',
  'health.q.later3': 'ৰাতি ভৰিত কামোৰণি ধৰে, কি কৰিম?',
  'health.c.later4': 'পুৱা শৰীৰ জঠৰ হোৱা',
  'health.q.later4': 'পুৱা উঠিলেই কালৰ বিষ আৰু জঠৰ অনুভৱ হয়, কাৰণ কি হ’ব পাৰে?',
  'health.band.senior.label': '৬১ – ৭৫ বছৰ',
  'health.band.senior.note': 'দৰব, ভাৰসাম্য আৰু অকলশৰীয়া অনুভৱ — তিনিওটা একেলগে',
  'health.c.senior1': 'খোজ কঢ়াত কষ্ট',
  'health.q.senior1': 'ঠুৰীত ইমান বিষ যে খোজ কঢ়া টান হৈ পৰিছে, কি কৰিম?',
  'health.c.senior2': 'দৰবৰ পৰীক্ষা',
  'health.q.senior2': 'প্ৰতিদিনে বহুতো দৰব খাব লাগে — কোনটো ক্ষতিকাৰক কেনেকৈ জানিম?',
  'health.c.senior3': 'ৰাতি প্ৰস্ৰাৱৰ সমস্যা',
  'health.q.senior3': 'ৰাতি বাৰে বাৰে প্ৰস্ৰাৱৰ সমস্যা হয়, কি কৰিম?',
  'health.c.senior4': 'কম শুনা',
  'health.q.senior4': 'কম শুনো, শুনাৰ কিবা উপায় কওক।',
  'health.band.elder.label': '৭৬ – ১০০ বছৰ',
  'health.band.elder.note': 'প্ৰতিটো দৰবৰ পৰীক্ষা দৰকাৰ, পৰি যোৱাটো বিপদজনক',
  'health.c.elder1': 'পৰি যোৱাৰ ভয়',
  'health.q.elder1': 'ঘৰত পৰি যোৱাৰ ভয় থাকে, কি সাৱধানতা ল’ম?',
  'health.c.elder2': 'স্মৃতিশক্তি দুৰ্বল',
  'health.q.elder2': 'স্মৃতিশক্তি কমি আহিছে, কি উপায় আছে?',
  'health.c.elder3': 'প্ৰতিদিনৰ বিষৰ দৰব',
  'health.q.elder3': 'বিষৰ দৰব সদায় খাব লাগে — ইয়াৰ কিবা বেয়া প্ৰভাৱ আছে নেকি?',
  'health.c.elder4': 'কেতিয়া ডাক্তৰৰ ওচৰলৈ যাম',
  'health.q.elder4': 'কেতিয়া ডাক্তৰৰ ওচৰলৈ যোৱাটো দৰকাৰ?',
  'ask.notConfigured': 'এই সেৱাই এতিয়া পুৰণি উত্তৰৰ পৰা উত্তৰ দিছে। আপোনাৰ প্ৰশ্নটো তাত পোৱা নগ’ল।',
  'ask.browseTitle': 'ইয়াত থকা লেখাবোৰ চাওক',
  'download.pdf': 'PDF ত লিখক',
  'download.text': 'টেক্সটত লিখক',
  'download.printNow': 'প্ৰিণ্ট কৰক',
  'download.preparing': 'প্ৰস্তুত হৈ আছে',
  'download.blocked': 'নতুন টেব খোলা নাযায়। পপ-আপ ব্লক হৈ আছে — আপোনাৰ ব্ৰাউজাৰত বেলেগ টেব খোলক।',
  'attach.button': 'আপোনাৰ নথি বা ফটো যোগ কৰক',
  'attach.formats': 'PDF, ফটো (JPG/PNG) বা টেক্সট ফাইল — ১২ MB লৈকে',
  'attach.reading': 'পঢ়ি আছে…',
  'attach.attached': 'যোগ কৰা হ’ল',
  'attach.remove': 'আতৰাওক',
  'attach.tooBigPdf': 'এই PDF টো ১২ MB তকৈ ডাঙৰ। সৰু ফাইল এটা বাছক।',
  'attach.tooBigImage': 'এই ফ’টোখন ৩ MB তকৈ ডাঙৰ। সৰু ফ’টো বাছক।',
  'attach.scannedPdf': 'এই PDF টো স্কেন কৰা — ইয়াত কেৱল ছবি আছে, পঢ়িব নোৱাৰি। ইয়াৰ ফ’টো পঠিয়াওক।',
  'attach.pdfFailed': 'এই PDF টো পঢ়িব পৰা নগ’ল।',
  'attach.imageFailed': 'এই ফ’টো লোড হোৱা নাই।',
  'attach.wrongType': 'এই ফাইলটো নচলিব। PDF, ফ’টো বা টেক্সট ফাইল পঠিয়াওক।',
  'attach.hint': 'আপোনাৰ কাগজখন এখানে লগাই প্ৰশ্ন সোধক — আমি তাৰ পৰাই উত্তৰ দিম।',
  'ask.sendWithFile': 'উত্তৰ লাগে',
  'lib.title': 'বিনামূলীয়া পুথিভঁৰাল',
  'lib.intro': 'পঢ়া কিতাপ, পুথি, ছবি আৰু অডিঅ’ — সকলো একেবাৰে বিনামূলীয়া আৰু আইনীভাৱে।',
  'lib.legalTitle': 'কপিৰাইটৰ কোনো ঝামেলা নাই।',
  'lib.legal': 'এখানে যি দিয়া হৈছে, সেয়া একেবাৰে বিনামূলীয়া আৰু আপুনি ইয়াক আগলৈও বিলাব পাৰে। যিখন কিতাপ এতিয়াও কপিৰাইটৰ অধীনত আছে, সেয়া এখানে নাথাকিব — তাক আপুনি কপি কৰিব নোৱাৰে, এইটো স্পষ্টকৈ কোৱা জৰুৰী।',
  'ask.signInFirst': 'আগতে লগ ইন কৰক, তাৰ পিছত প্ৰশ্ন সোধক।',
  'ask.signInTitle': 'আগতে লগ ইন কৰক',
  'ask.signInBody': 'প্ৰশ্ন সোধাৰ বাবে আপোনাৰ একাউণ্ট বনাওক। ইয়াৰ বাবে এব মিনিটতো কম সময় লাগে, আৰু আপুনি প্ৰশ্ন সুধি থাকিব পাৰিব।',
  'ask.signInCta': 'একাউণ্ট বনাওক বা লগ ইন কৰক',
  'ask.signInOr': 'এতিয়া একাউণ্ট বনাব নোৱাৰে? এই কামবোৰো আপোনাৰ অবিহনেই হৈ যাব:',
  'account.title': 'মোৰ একাউণ্ট',
  'account.intro': 'আপোনাৰ নাম আৰু পাছৱৰ্ড সুমুৱাই প্ৰশ্ন সোধা আৰম্ভ কৰক।',
  'account.signIn': 'সোমাওক',
  'account.register': 'একাউণ্ট বনাওক',
  'account.signInNote': 'যোৱাবাৰৰ নাম আৰু পাছৱৰ্ড দিয়ক।',
  'account.registerNote': 'প্ৰশ্ন সোধাৰ বাবে একাউণ্ট জৰুৰী নহয়। এইটো কেৱল আপোনাৰ ভাষা আৰু উত্তৰ মনত ৰাখিবৰ বাবেহে।',
  'account.handle': 'আপোনাৰ নাম',
  'account.handlePlaceholder': 'যেনে: sita.ji',
  'account.password': 'পাছৱৰ্ড',
  'account.passwordHint': 'কমপক্ষে ৬ টা আখৰ।',
  'account.phone': 'ফোন নম্বৰ',
  'account.optional': 'জৰুৰী নহয়',
  'account.phoneHint': 'দিব বিচাৰিলে দিয়ক। কোনো ফোন নম্বৰ নিদিলেও একাউণ্ট হৈ যাব।',
  'account.create': 'একাউণ্ট বনাওক',
  'account.logout': 'বাহিৰলৈ যাওক',
  'account.open': 'একাউণ্ট খুলক',
  'account.signedInAs': 'আপুনি লগ ইন হৈ আছে',
  'account.signedOut': 'একাউণ্ট খোলা নাই',
  'account.signedOutBody': 'এতিয়া কোনো একাউণ্ট খোলা হোৱা নাই।',
  'account.saved': 'সংৰক্ষণ কৰা উত্তৰসমূহ',
  'account.savedEmpty': 'এতিয়া কোনো উত্তৰ সংৰক্ষণ কৰা নাই। উত্তৰ আহিলে \'সংৰক্ষণ কৰক\' টিপক।',
  'account.savedUnavailable': 'সংৰক্ষণ কৰা উত্তৰসমূহ এতিয়া দেখা পোৱা নাই। বাকীখিনি চলি আছে।',
  'account.wait': 'দয়া কৰি অপেক্ষা কৰক…',
  'account.privacyTitle': 'আপোনাৰ কথাখিনি সুৰক্ষিত',
  'account.privacyBody': 'একাউণ্ট বনালে কেৱল আপোনাৰ নাম, পাছৱৰ্ড আৰু ভাষাখিনিয়েই ৰখা হয়। প্ৰশ্নৰ কোনো ৰেকৰ্ড নাথাকে। আপোনাৰ প্ৰশ্ন কোৱালৈও পঠোৱা নহয়।',
  'account.errWrong': 'নাম বা পাছৱৰ্ড ভুল হৈছে।',
  'account.errTaken': 'এই নামটো আগতেই লোৱা হৈছে। বেলেগ নাম বাছক।',
  'account.errBad': 'তথ্যখিনি ঠিককৈ ভৰাওক।',
  'account.errWait': 'বহুবাৰ চেষ্টা কৰা হ’ল। অলপ সময়ৰ পিছত চেষ্টা কৰক।',
  'account.errTryLater': 'এতিয়া সম্ভৱ নহ’ল। কিছু সময়ৰ পিছত চেষ্টা কৰক।',
  'lib.licence.ccBy': 'আপুনি ইয়াক কপি আৰু শ্বেয়াৰ কৰিব পাৰে, ছপা কৰিবও পাৰে — কেৱল উৎসৰ নাম দিব লাগিব।',
  'lib.licence.ccBySa': 'আপুনি ইয়াক কপি আৰু ছপা কৰিব পাৰে। যিবোৰ সলনি কৰিব, সেইবোৰো মুকলিকৈ দিব লাগিব।',
  'lib.licence.ccZero': 'সম্পূৰ্ণ বিনামূলীয়া। উৎসৰ নাম দিয়াও জৰুৰী নহয়।',
  'lib.licence.pd': 'কাৰো কপিৰাইট নাই — যিয়েই ইচ্ছা কৰে কপি কৰিব পাৰে।',
  'lib.licence.govtIndia': 'ভাৰত চৰকাৰৰ ৱেবছাইটত। পঢ়া আৰু ছপা কৰা দুয়োটাই বিনামূলীয়া।',
  'lib.licence.creativeCommons': 'প্ৰতিটো ফাইলৰে নিজা লাইচেন্স আছে — ফাইলটোত চাই ল’ব।',
  'lib.licence.freeToRead': 'পঢ়াটো বিনামূলীয়া। কপি কৰি আগলৈ দিয়াটোও সেই চৰ্ততে হ’ব যি চৰ্তত এইটো পোৱা গৈছিল।',
  'lib.openBadge': 'মুকলি',
  'lib.openBadgeNote': 'ইয়া কপি কৰিব পাৰিব',
  'lib.freeBadge': 'বিনামূলীয়া',
  'lib.freeBadgeNote': 'পঢ়িব পাৰিব, কপি কৰিব নোৱাৰিব',
  'lib.govt': 'চৰকাৰী',
  'lib.noSignup': 'একাউণ্টৰ প্ৰয়োজন নাই',
  'lib.open': 'ইয়াত খোলক',
  'lib.group.padhai': 'পঢ়া-শুনাৰ কিতাপ',
  'lib.group.padhai.note': 'স্কুল, কলেজ আৰু চৰকাৰী শিক্ষাৰ সামগ্ৰী',
  'lib.group.kitab': 'কিতাপ',
  'lib.group.kitab.note': 'যিবোৰত কপিৰাইট নাই বা যিবোৰ কপি কৰাৰ অনুমতি আছে',
  'lib.group.tasveer': 'ছবি আৰু চিত্ৰ',
  'lib.group.tasveer.note': 'মানচিত্ৰ, ফটো, চিহ্ন — সকলো',
  'lib.group.audio': 'শুনিব পৰা সামগ্ৰী',
  'lib.group.audio.note': 'কিতাপ শুনিব পাৰিব, পঢ়িব নালাগে',
  'lib.warnTitle': 'সকলো কিতাপ ইয়াত নাই',
  'lib.warn': 'কিছুমান কিতাপ এতিয়াও কপিৰাইটৰ অধীনত আছে আৰু আইন অনুসৰি সেইবোৰ বিনামূলীয়াকৈ দিব নোৱাৰি। আমি ইচ্ছাকৃতভাৱে সেইবোৰ ইয়াত দেখুওৱা নাই। যদি কোনো কিতাপৰ প্ৰয়োজন হয়, তেন্তে তলত প্ৰশ্ন কৰক — যিটো উত্তৰ দিব পৰা যায়, সেয়া দিয়া হ\'ব।',
  'lib.askInstead': 'প্ৰশ্ন কৰক',
  'nav.library': 'পুথিভঁৰাল',
  'support.contactMessageLabel': 'আপোনাৰ কথা',
  'support.contactPlaceholder': 'যি লিখিব বিচাৰে লিখক — কিবা ভুল হ\'লে, কিবা ভাল পালে, বা কিবা প্ৰশ্ন থাকিলে।',
  'support.contactHelp': 'কমপক্ষে ১০টা আখৰ। এইটো পোনে পোনে গৰাকীৰ ওচৰলৈ যায়।',
  'support.contactSubmit': 'পঠাওক',
  'support.contactSending': 'পঠাই থকা হৈছে…',
  'support.contactPrivacy': 'আপোনাৰ নাম লিখাটো জৰুৰী নহয়।',
  'support.contactSent': 'গৈ পালে',
  'support.contactSentBody': 'আপোনাৰ কথা গৰাকীৰ ওচৰলৈ গৈ পালে।',
  'support.contactFailed': 'পঠাব পৰা নগ\'ল',
  'support.faq1Q': 'এইটো সঁচাকৈয়ে বিনামূলীয়া নে?',
  'support.faq1A': 'হয়। কোনো পইচা লোৱা নহয়, কোনো বিজ্ঞাপন দেখুওৱা নহয়, আৰু কোনো সদস্যপদৰ প্ৰয়োজন নাই। এইটো এজন ব্যক্তিৰ নিজা খৰচত চলে, কোনো কোম্পানী বা চৰকাৰৰ পইচাৰে নহয়।',
  'support.faq2Q': 'মোৰ নাম, ঠিকনা বা ফোন নম্বৰ লোৱা হয় নেকি?',
  'support.faq2A': 'নহয়, আৰু লোৱাও নহ\'ব। এই ছাইটটোৱে নিজাকৈ কোনো পৰিচয় সৃষ্টি নকৰে — কোনো লগ-ইন নাই, কোনো ট্ৰেকিং স্ক্ৰিপ্ট নাই। কেৱল আপোনাৰ প্ৰশ্নটোহে সোধা হয়।',
  'support.faq3Q': 'এইটো ডাক্তৰ বা উকীল নেকি?',
  'support.faq3A': 'নহয়। ই কোনো ঔষধৰ পৰামৰ্শ বা আইনী পৰামৰ্শ নিদিয়ে। য\'ত কথাটো গুৰুতৰ, তাত ই আপোনাক ডাক্তৰ বা বিষয়াৰ ওচৰলৈ যাবলৈ কয় — ই তেওঁলোকৰ বিকল্প নহয়।',
  'support.faq4Q': 'সকলো উত্তৰ সঠিক হয় নেকি?',
  'support.faq4A': 'সদায় নহয়। উত্তৰটো এটা কম্পিউটাৰে লিখে, কোনো ডাক্তৰে নহয় — সেইবাবে প্ৰতিটো উত্তৰৰ লগত লিখা থাকে যে এইটো চিকিৎসা পৰামৰ্শ নহয়। কোনো ঔষধ আৰম্ভ কৰা বা বন্ধ কৰাৰ আগতে ডাক্তৰৰ লগত অৱশ্যে কথা পাতিব।',
  'support.faq5Q': 'মই কোনো এপ ডাউনলোড কৰিব লাগিব নেকি?',
  'support.faq5A': 'নালাগে। এইটো কেৱল ব্ৰাউজাৰত খোলে। কোনো এপ ইনষ্টল কৰিব নালাগে, কোনো অনুমতি নালাগে, কোনো আপডেটৰ প্ৰয়োজন নাই।',
  'nav.remedies': 'ঘৰুৱা উপায়',
  'remedy.title': 'আয়ুৰ্বেদিক ঘৰুৱা উপায়',
  'remedy.intro': 'যিকোনো সমস্যাই হওক — কাহ, মূৰৰ বিষ, বাতবিষ, খজুৱতি, মধুমেহ, পিঠিৰ বিষ — তলত আপোনাৰ সমস্যাটো বাছক বা নিজৰ ভাষাত সোধক। ঘৰুৱা ক্কাথ, মালিচ, খোৱা-বোৱা আৰু আয়ুৰ্বেদিক উপায় জনোৱা হ\'ব।',
  'remedy.choose': 'আপোনাৰ সমস্যাটো বাছক',
  'remedy.emergencyStrong': 'এইবোৰ জৰুৰী অৱস্থা:',
  'remedy.emergency': 'সাপে কামোৰা, বিছাই ডোকোৱা আৰু কুকুৰে কামোৰা — লগে লগে হাস্পতাললৈ যাওক, প্ৰথমে ১১২ নম্বৰত ফোন কৰক। ঘৰুৱা উপায় কেৱল বাটত কৰিবলৈহে, হাস্পতালৰ বিকল্প নহয়।',
  'remedy.note': 'ঘৰুৱা আৰু আয়ুৰ্বেদিক উপায়ে সমস্যা কমাবলৈ সহায় কৰে; এইবোৰ ডাক্তৰৰ পৰীক্ষা আৰু চিকিৎসাৰ বিকল্প নহয়। কোনো ঔষধ নিজে নিজে বন্ধ বা আৰম্ভ নকৰিব।',
  'remedy.cough': 'কাহ',
  'remedy.headache': 'মূৰৰ বিষ',
  'remedy.joints': 'বাতবিষ',
  'remedy.itching': 'খজুৱতি',
  'remedy.snake': 'সাপে কামোৰা',
  'remedy.scorpion': 'বিছাই ডোকোৱা',
  'remedy.dog': 'কুকুৰে কামোৰা',
  'remedy.diabetes': 'মধুমেহ',
  'remedy.back': 'পিঠিৰ বিষ',
  'remedy.walking': 'খোজ কঢ়াত অসুবিধা',
  'home.remedyNote': 'ক্কাথ, মালিচ, খোৱা-বোৱা আৰু আয়ুৰ্বেদিক উপায় — প্ৰতিটো সমস্যাৰ বাবে, আপোনাৰ ভাষাত। VARSHA SAMADHAN AI',
  'nav.aarti': 'আৰতি আৰু ভজন',
  'aarti.title': 'আৰতি আৰু ভজন — আচল কণ্ঠত',
  'aarti.intro': 'ইয়াত আৰতি, কীৰ্তন আৰু ভজন শুনক — আচল গায়ক আৰু মন্দিৰৰ কণ্ঠত। কোনো AI কণ্ঠ নহয়।',
  'aarti.note': 'আৰতি বা ভজন কম্পিউটাৰৰ কণ্ঠত শুনালে তাৰ ভক্তি আৰু আৱেগ নোহোৱা হৈ যায়। সেয়ে ইয়াত কেৱল আচল ৰেকৰ্ডিংহে আছে।',
  'aarti.kindAarti': 'আৰতি',
  'aarti.kindKirtan': 'কীৰ্তন',
  'aarti.kindBhajan': 'ভজন',
  'aarti.credit': 'ৰেকৰ্ডিং:',
  'aarti.licence': 'লাইচেঞ্চ:',
  'aarti.listenLink': 'আচল কণ্ঠত শুনক',
  'aarti.textChecked': 'এইটো পৰম্পৰাগত পাঠ, যিদৰে আচল ৰেকৰ্ডিংত গোৱা হৈছে।',
  'aarti.textPrinted': 'এইটো প্ৰচলিত পাঠ, প্ৰকাশিত সংগ্ৰহৰ লগত মিলাই পৰীক্ষা কৰা হৈছে।',
  'aarti.textNotStored': 'এই গ্ৰন্থৰ সম্পূৰ্ণ পাঠ ইয়াত সংৰক্ষিত নাই — তলৰ ৰেকৰ্ডিংত সম্পূৰ্ণ পাঠটো শুনিব পাব।',
  'aarti.granthTitle': 'গ্ৰন্থ, চালিচা আৰু স্তোত্ৰ — আচল কণ্ঠত',
  'aarti.noRecording': 'এই আৰতিৰ আচল ৰেকৰ্ডিং এতিয়াও ছাইটত নাই, সেয়ে মই ইয়াক গাই শুনাব নোৱাৰো — VARSHA SAMADHAN AI কেতিয়াও আৰতি নাগায়।',
  'aarti.textOnlyTitle': 'আৰু আৰতিসমূহ — পাঠও আছে, আচল কণ্ঠও আছে',
  'aarti.fullText': 'সম্পূৰ্ণ পাঠ',
  'aarti.notChecked': 'এই আৰতিৰ সত্যতা পৰীক্ষা কৰা পাঠ এতিয়াও ছাইটত নাই। পৰীক্ষা নকৰা পাঠ দিয়াটো উচিত নহয়, সেয়ে সেয়া দিয়া হোৱা নাই।',
  'aarti.verifiedList': 'ছাইটত এই আৰতিসমূহৰ সত্যতা পৰীক্ষা কৰা পাঠ আছে:',

};

/* -------------------------------------------------------------------------- */
/* ODIA                                                                      */
/* -------------------------------------------------------------------------- */

const ODIA: Record<string, string> = {
  'jgd.placeSearch': 'ସହରର ନାମ ଲେଖନ୍ତୁ',
  'jgd.placeNoMatch': 'ଏହି ସହର ତାଲିକାରେ ନାହିଁ। ଏହାର ପାଖ ସହରକୁ ବାଛନ୍ତୁ।',
  'account.name': 'ଆପଣଙ୍କ ନାମ',
  'account.namePlaceholder': 'ଯେପରି: ସୀତା ଦେବୀ',
  'account.nameHint': 'ଏହା ଆପଣଙ୍କ ପରିଚୟ ପାଇଁ ଅଟେ। ଯେକୌଣସି ନାମ ଚଳିବ, ଏବଂ ଏହା ଜରୁରୀ ନୁହେଁ।',
  'nav.home': 'ମୂଳପୃଷ୍ଠା',
  'home.metaTitle': 'ମାଗଣା ସମାଧାନ, ଆପଣଙ୍କ ନିଜ ଭାଷାରେ',
  'lib.licence.ccZero.name': 'ସି.ସି.ଜିରୋ / ସାର୍ବଜନୀନ ଡୋମେନ୍',
  'lib.licence.pd.name': 'ସାର୍ବଜନୀନ ଡୋମେନ୍',
  'lib.licence.govtIndia.name': 'ଭାରତ ସରକାର',
  'lib.licence.creativeCommons.name': 'କ୍ରିଏଟିଭ୍ କମନ୍ସ (ମିଶ୍ରିତ)',
  'lib.licence.freeToRead.name': 'ପଢ଼ିବା ପାଇଁ ମାଗଣା',
  'lib.entry.ncert.title': 'ଏନ୍.ସି.ଇ.ଆର୍.ଟି. ବହି — ଷଷ୍ଠରୁ ଦ୍ୱାଦଶ ଶ୍ରେଣୀ',
  'lib.entry.ncert.what': 'ପ୍ରତି ପ୍ରସଙ୍ଗର ସବୁ ବହି, ବର୍ତ୍ତମାନ ପ୍ରତି ଶ୍ରେଣୀ ପାଇଁ। ଲଗଇନ୍ ବିନା, ସିଧାସଳଖ ପି.ଡି.ଏଫ୍।',
  'lib.entry.ncert.langs': 'ହିନ୍ଦୀ, ଇଂରାଜୀ ଏବଂ ୩୦ ରୁ ଅଧିକ ଭାରତୀୟ ଭାଷା',
  'lib.entry.pm-evidya.title': 'ପି.ଏମ୍. ଇ-ବିଦ୍ୟା — ଡିଜିଟାଲ୍ ପାଠ୍ୟପୁସ୍ତକ',
  'lib.entry.pm-evidya.what': 'ଏନ୍.ସି.ଇ.ଆର୍.ଟି. ବହିର ଆପ୍, ବଡ଼ ଅକ୍ଷରରେ ପଢ଼ାଯାଇପାରିବ। କହିକି ମଧ୍ୟ ଶୁଣିପାରିବେ।',
  'lib.entry.pm-evidya.langs': 'ଭାରତୀୟ ଭାଷା',
  'lib.entry.diksha.title': 'ଦୀକ୍ଷା — ଶିକ୍ଷକ ଏବଂ ପିଲାମାନଙ୍କ ପାଇଁ',
  'lib.entry.diksha.what': 'ପାଠ୍ୟକ୍ରମ, ଭିଡିଓ ଏବଂ ଅଭ୍ୟାସ — ପ୍ରଥମରୁ ଦ୍ୱାଦଶ ଶ୍ରେଣୀ ପର୍ଯ୍ୟନ୍ତ।',
  'lib.entry.diksha.langs': 'ଭାରତୀୟ ଭାଷା',
  'lib.entry.khan-academy.title': 'ଖାନ୍ ଏକାଡେମୀ — ଇଂରାଜୀରେ ଗଣିତ ଏବଂ ବିଜ୍ଞାନ',
  'lib.entry.khan-academy.what': 'ଭିଡିଓ ପାଠ, ପ୍ରତି ଶ୍ରେଣୀ ପର୍ଯ୍ୟନ୍ତ। ସିଧାସଳଖ ପଢ଼ୁଥିବା ଲୋକଙ୍କ ପାଇଁ ମଧ୍ୟ ଲିଖିତ ରହିଛି।',
  'lib.entry.openstax.title': 'ଓପନ୍‌ଷ୍ଟାକ୍ସ — ଇଂରାଜୀରେ ମାଗଣା ବହି',
  'lib.entry.openstax.what': 'କଲେଜ ସ୍ତରର ବହି — ଗଣିତ, ବିଜ୍ଞାନ, ମାନବିକୀ। ପ୍ରତି ପୃଷ୍ଠାରେ ପି.ଡି.ଏଫ୍।',
  'lib.entry.nios.title': 'ଏନ୍.ଆଇ.ଓ.ଏସ୍. — ଦୂରଶିକ୍ଷା, ମାଗଣା ସାମଗ୍ରୀ',
  'lib.entry.nios.what': 'ଓପନ୍ ଏବଂ ଅନଲାଇନ୍ କୋର୍ସର ମାଗଣା ପୁସ୍ତିକା, ନାମଲେଖା ବିନା।',
  'lib.entry.nios.langs': 'ହିନ୍ଦୀ, ଇଂରାଜୀ ଏବଂ ଅନ୍ୟାନ୍ୟ',
  'lib.entry.ignou.title': 'ଇଗ୍ନୋ — ବଡ଼ ସ୍କୁଲର ମାଗଣା ପୁସ୍ତକ',
  'lib.entry.ignou.what': 'ଦୂରଶିକ୍ଷାର ବହି ଯାହା ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣାରେ ମିଳିଥାଏ।',
  'lib.entry.gutenberg.title': 'ପ୍ରୋଜେକ୍ଟ ଗୁଟେନବର୍ଗ — ଇଂରାଜୀର ପୁରୁଣା ବହି',
  'lib.entry.gutenberg.what': '୭୦,୦୦୦ ରୁ ଅଧିକ ବହି, ସବୁଗୁଡ଼ିକର କପିରାଇଟ୍ ଶେଷ ହୋଇଛି। ମାଗଣା ଇ-ବୁକ୍ ଏବଂ ଅଡିଓ।',
  'lib.entry.pratham-books.title': 'ପ୍ରଥମ ବୁକ୍ସ — ପିଲାମାନଙ୍କ ବହି',
  'lib.entry.pratham-books.what': 'ଭାରତୀୟ ଭାଷାରେ ପିଲାମାନଙ୍କ ବହି, ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା। ପ୍ରଥମରୁ ପଞ୍ଚମ ଶ୍ରେଣୀ ପାଇଁ।',
  'lib.entry.pratham-books.langs': 'ହିନ୍ଦୀ, ମରାଠୀ, ବଙ୍ଗାଳୀ, ତମିଲ, ତେଲୁଗୁ ଏବଂ ଅନ୍ୟାନ୍ୟ',
  'lib.entry.internet-archive-texts.title': 'ଇଣ୍ଟରନେଟ୍ ଆର୍କାଇଭ୍ — ସମାଚାର ପତ୍ର ଏବଂ ପୁରୁଣା ପତ୍ରିକା',
  'lib.entry.internet-archive-texts.what': 'ଲକ୍ଷ ଲକ୍ଷ ପୁରୁଣା ବହି, ପତ୍ରିକା ଏବଂ ସମାଚାର ପତ୍ର — ମାଗଣା।',
  'lib.entry.wikisource.title': 'ଓ୍ୱିକିସୋର୍ସ — ଜନ-ଗଦ୍ୟ ପାଠ',
  'lib.entry.wikisource.what': 'କୌଣସି କପିରାଇଟ୍ ନାହିଁ — ଏଗୁଡ଼ିକ ସମସ୍ତଙ୍କ ପୃଥିବୀର ପୁରୁଣା ସାହିତ୍ୟିକ ବହି ଅଟେ।',
  'lib.entry.wikimedia-commons.title': 'ଓ୍ୱିକିମିଡିଆ କମନ୍ସ — ପ୍ରତିଟି ଛବି',
  'lib.entry.wikimedia-commons.what': 'ଜନଜାତି, ମାନଚିତ୍ର, ତାରା, ଇତିହାସ — ସବୁକିଛି। ପ୍ରତିଟି ଛବିରେ ଅଲଗା ଲାଇସେନ୍ସ ଲେଖାଯାଇଛି।',
  'lib.entry.pixabay.title': 'ପିକ୍ସାବେ — ଛବି ଏବଂ ଚିତ୍ର',
  'lib.entry.pixabay.what': 'ଛବି, ରେଖାଚିତ୍ର ଏବଂ ସାନ ଭିଡିଓ।',
  'lib.entry.unsplash.title': 'ଅନ୍‌ସ୍ପ୍ଲାଶ୍ — ସୁନ୍ଦର ଛବି',
  'lib.entry.unsplash.what': 'ମାଗଣା, ବଡ଼ ଅକ୍ଷରରେ, ଆକାଉଣ୍ଟ୍ ବିନା।',
  'lib.entry.openverse.title': 'ଓପନ୍‌ଭର୍ସ — ସବୁ ଛବି ଗୋଟିଏ ଜାଗାରେ',
  'lib.entry.openverse.what': 'ଅନେକ ମାଗଣା ଛବିର ସାଇଟ୍ ଏକାଠି ଖୋଜନ୍ତୁ।',
  'lib.entry.librivox.title': 'ଲିବ୍ରିଭକ୍ସ — ଶୁଣିବା ବହି',
  'lib.entry.librivox.what': 'ପୁରୁଣା ଇଂରାଜୀ ବହିର ମାଗଣା ଅଡିଓ, ମନୁଷ୍ୟର ସ୍ୱରରେ।',
  'lib.entry.internet-archive-audio.title': 'ଇଣ୍ଟରନେଟ୍ ଆର୍କାଇଭ୍ — ଅଡିଓ ସଂଗ୍ରହ',
  'lib.entry.internet-archive-audio.what': 'ହଜାର ହଜାର ମାଗଣା ଅଡିଓ — ବହି, ଭାଷଣ, ସଙ୍ଗୀତ।',
  'lib.entry.vande-mataram.title': 'ବନ୍ଦେ ମାତରମ୍ — ଜାତୀୟ ସଙ୍ଗୀତ ଏବଂ ଗୀତ',
  'lib.entry.vande-mataram.what': 'ଭାରତର ଜାତୀୟ ସଙ୍ଗୀତ ଏବଂ ଅନ୍ୟାନ୍ୟ ଜାତୀୟ ଗୀତ, ମାଗଣା।',
  'art.aag-aur-bijli-ke-bachav.title': 'ନିଆଁ ଏବଂ ବିଜୁଳିରୁ ବର୍ତ୍ତିବାର ନିୟମ',
  'art.aag-aur-bijli-ke-bachav.summary': 'ଘରେ ନିଆଁ ଲାଗିବା ରୋକିବା — ସରଳ ନିୟମ',
  'art.aag-lagne-par-kya-karein.title': 'ନିଆଁ ଲାଗିଗଲେ କ’ଣ କରିବେ',
  'art.aag-lagne-par-kya-karein.summary': 'ଜଳୁଥିବା ଘରେ ନିଆଁ — ସବୁଠାରୁ ପ୍ରଥମେ କ’ଣ କରିବେ, କ’ଣ କରିବେ ନାହିଁ',
  'art.bimari-se-bachav.title': 'ସଂକ୍ରମଣରୁ ବଞ୍ଚିବାର ସାତୋଟି ନିୟମ',
  'art.bimari-se-bachav.summary': 'ହାତ ଧୋଇବା, ମାସ୍କ, ଟିକା — ଆଦି ଦ୍ୱାରା ସୁରକ୍ଷା',
  'art.dhuwan-ka-jhakora.title': 'ଧୂଆଁରୁ ବଞ୍ଚିବାର ଉପାୟ',
  'art.dhuwan-ka-jhakora.summary': 'ଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଲେ କଣ କରିବେ, କେବେ ଡାକ୍ତରଖାନା ଯିବେ',
  'art.doodh-pani-band-ho.title': 'ହଠାତ୍ ବିଜୁଳି କିମ୍ବା ପାଣି ଚାଲିଗଲେ',
  'art.doodh-pani-band-ho.summary': 'କଣ କରିବେ, କାହାଠାରୁ ସାବଧାନ ରହିବେ, କେବେ ସାହାଯ୍ୟ ମାଗିବେ',
  'art.haath-ki-saafai.title': 'ସାବୁନ ବିନା ହାତ ସଫା କରିବାର ଉପାୟ',
  'art.haath-ki-saafai.summary': 'ଯେତେବେଳେ ପାଣି କିମ୍ବା ସାବୁନ ନଥିବ',
  'cat.dhyan-aur-yoog.title': 'ଧ୍ୟାନ ଏବଂ ଯୋଗ',
  'cat.dhyan-aur-yoog.subtitle': 'ମନ ଶାନ୍ତ କରିବାର ସରଳ ଉପାୟ',
  'cat.gharelu-marammat.title': 'ଘରୋଇ ମରାମତି',
  'cat.gharelu-marammat.subtitle': 'ଘରର ଛୋଟ ଛୋଟ ସମସ୍ୟାର ସମାଧାନ',
  'cat.bachchon-ki-padhai.title': 'ପିଲାଙ୍କ ପାଠପଢ଼ା',
  'cat.bachchon-ki-padhai.subtitle': 'ପାଠପଢ଼ାରେ ଅସୁବିଧା କିମ୍ବା ଚିନ୍ତା',
  'cat.budharge-seva.title': 'ବୟସ୍କଙ୍କ ସେବା',
  'cat.budharge-seva.subtitle': 'ଯତ୍ନ ଏବଂ ସହାୟତା',
  'cat.shishu-dekhbhal.title': 'ଶିଶୁ ଯତ୍ନ',
  'cat.shishu-dekhbhal.subtitle': 'ନବଜାତ ଶିଶୁର ସଠିକ୍ ଯତ୍ନ',
  'cat.dharmik-upay.title': 'ଧାର୍ମିକ ଉପାୟ',
  'cat.dharmik-upay.subtitle': 'ମନର ଶାନ୍ତି ପାଇଁ',
  'cat.pavan-grah-aur-aarti.title': 'ପବିତ୍ର ଗ୍ରନ୍ଥ ଓ ଆରତୀ',
  'cat.pavan-grah-aur-aarti.subtitle': 'ଶ୍ରଦ୍ଧାର ସହ ପଢ଼ନ୍ତୁ ଓ ଶୁଣନ୍ତୁ',
  'cat.aapatkalen-gayide.title': 'ଆପାତକାଳୀନ ଗାଇଡ୍',
  'cat.aapatkalen-gayide.subtitle': 'ଯେତେବେଳେ ତୁରନ୍ତ ସାହାଯ୍ୟ ଦରକାର',
  'cat.mahamari-suraksha.title': 'ମହାମାରୀ ସୁରକ୍ଷା',
  'cat.mahamari-suraksha.subtitle': 'ରୋଗ ବ୍ୟାପିବାରୁ ସୁରକ୍ଷା',
  'nav.tribute': 'ସ୍ମୃତି',
  'nav.help': 'ସହାୟତା',
  'nav.reference': 'ସନ୍ଦର୍ଭ',
  'nav.reviews': 'ମତାମତ',
  'nav.support': 'ସାହାଯ୍ୟ କରନ୍ତୁ',
  'nav.birthChart': 'ଜନ୍ମ କୁଣ୍ଡଳୀ',
  'jgd.title': 'ଆପଣଙ୍କ ଜନ୍ମ କୁଣ୍ଡଳୀ',
  'jgd.intro': 'ଆପଣଙ୍କ ନାମ, ଜନ୍ମ ତାରିଖ, ଏବଂ ସମ୍ଭବ ହେଲେ ଜନ୍ମ ସମୟ ଓ ସ୍ଥାନ ଲେଖନ୍ତୁ। ସବୁ ଗଣନା ଆପଣଙ୍କ ଫୋନରେ ହିଁ ହେବ — କିଛି ବି କୁଆଡେ ପଠାଯାଏ ନାହିଁ।',
  'jgd.nameLabel': 'ଜନ୍ମ ନାମ',
  'jgd.namePlaceholder': 'ଯେପରିକି ପୂରା ନାମ',
  'jgd.nameHint': 'ପିଲାଦିନେ ଯେଉଁ ନାମ ଦିଆଯାଇଥିଲା, ତାହା ଲେଖନ୍ତୁ।',
  'jgd.dateLabel': 'ଜନ୍ମ ତାରିଖ',
  'jgd.timeLabel': 'ଜନ୍ମ ସମୟ',
  'jgd.timeHint': 'ଜାଣି ନଥିଲେ ଖାଲି ଛାଡ଼ି ଦିଅନ୍ତୁ।',
  'jgd.placeLabel': 'ଜନ୍ମ ସ୍ଥାନ',
  'jgd.placeNone': 'ଜାଣି ନାହିଁ / ବାଛନ୍ତୁ',
  'jgd.placeHint': 'ଜନ୍ମ ସହର ବାଛନ୍ତୁ।',
  'jgd.submit': 'ଗଣନା କରନ୍ତୁ',
  'jgd.savePdf': 'PDF ତିଆରି କରନ୍ତୁ',
  'jgd.again': 'ନୂଆ ଗଣନା',
  'jgd.errDate': 'ଦୟାକରି ଜନ୍ମ ତାରିଖ ସଠିକ୍ ଭାବେ ଲେଖନ୍ତୁ।',
  'jgd.errPlace': 'ଜନ୍ମ ସହର ତାଲିକାରୁ ବାଛନ୍ତୁ, କିମ୍ବା ପାଖ ସହର ବାଛନ୍ତୁ।',
  'jgd.numTitle': 'ଅଙ୍କ ଜ୍ୟୋତିଷ',
  'jgd.lifePath': 'ଜୀବନ ପଥ',
  'jgd.nameNumber': 'ନାମ ଅଙ୍କ',
  'jgd.soulNumber': 'ଆତ୍ମା ଅଙ୍କ',
  'jgd.birthdayNumber': 'ଜନ୍ମ ଦିନ ଅଙ୍କ',
  'jgd.astroTitle': 'ବୈଦିକ ଜ୍ୟୋତିଷ',
  'jgd.nakshatra': 'ନକ୍ଷତ୍ର',
  'jgd.pada': 'ପାଦ',
  'jgd.rashi': 'ରାଶି',
  'jgd.rashiLord': 'ରାଶି ସ୍ୱାମୀ',
  'jgd.nakshatraLord': 'ନକ୍ଷତ୍ର ସ୍ୱାମୀ',
  'jgd.lagna': 'ଲଗ୍ନ',
  'jgd.lagnaMissing': 'ଲଗ୍ନ ବାହାର କରିବା ପାଇଁ ଜନ୍ମ ସମୟ ଏବଂ ସ୍ଥାନ ଦରକାର। ଉପରେ ଭରଣ କରନ୍ତୁ ଏବଂ ପରେ ଗଣନା କରନ୍ତୁ, ଯଦି ଜାଣି ନାହାଁନ୍ତି ତେବେ ଏତିକି ବି ଯଥେଷ୍ଟ।',
  'jgd.gunTitle': 'ଗୁଣ ମିଳନ',
  'jgd.gunIntro': 'ଅନ୍ୟ ବ୍ୟକ୍ତିଙ୍କ ନାମ ଏବଂ ଜନ୍ମ ତାରିଖ ଭରଣ କରନ୍ତୁ।',
  'jgd.gunName': 'ତାଙ୍କ ନାମ',
  'jgd.gunDate': 'ତାଙ୍କ ଜନ୍ମ ତାରିଖ',
  'jgd.gunHint': 'ଉଭୟଙ୍କ ନାମ ଏବଂ ଜନ୍ମ ତାରିଖ ଥିଲେ ଗୁଣ ମିଳନ ବାହାରିବ।',
  'jgd.disclaimer': 'ଏହା ପରମ୍ପରା ଅନୁସାରେ କରାଯାଇଥିବା ଗଣନା, ଭବିଷ୍ୟବାଣୀ ନୁହେଁ। କୌଣସି ସଂଖ୍ୟା କିମ୍ବା ରାଶି କାହାର ସ୍ୱାସ୍ଥ୍ୟ, ଧନ କିମ୍ବା ସମ୍ପର୍କ ସ୍ଥିର କରେ ନାହିଁ। ବଡ଼ ନିଷ୍ପତ୍ତି ଡାକ୍ତର, ଆଇନଗତ ପରାମର୍ଶ କିମ୍ବା ଅଭିଜ୍ଞ ବ୍ୟକ୍ତିଙ୍କ ପରାମର୍ଶ ନେଇ କରନ୍ତୁ।',
  'nav.menu': 'ମେନୁ',
  'nav.openMenu': 'ମେନୁ ଖୋଲନ୍ତୁ',
  'nav.closeMenu': 'ମେନୁ ବନ୍ଦ କରନ୍ତୁ',
  'nav.expand': 'ବିସ୍ତାର କରନ୍ତୁ',
  'nav.collapse': 'ସଙ୍କୁଚିତ କରନ୍ତୁ',
  'nav.skip': 'ସିଧା ବିଷୟବସ୍ତୁକୁ ଯାଆନ୍ତୁ',
  'nav.language': 'ଭାଷା ପରିବର୍ତ୍ତନ କରନ୍ତୁ',
  'footer.pages': 'ପୃଷ୍ଠା',
  'footer.helplines': 'ଜରୁରୀ ନମ୍ବର',
  'footer.free': 'ଏହି ସେବା ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା। କାହାଠାରୁ କୌଣସି ଟଙ୍କା ନିଆଯାଏ ନାହିଁ।',
  'footer.readStory': 'ତାଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ କାହାଣୀ ପଢ଼ନ୍ତୁ',
  'footer.admin': 'ପ୍ରବନ୍ଧକ',
  'footer.rights': 'ମାଗଣା ସେବା',
  'footer.emergency': 'ଜରୁରୀକାଳୀନ',
  'footer.ambulance': 'ଆମ୍ବୁଲାନ୍ସ',
  'footer.women': 'ମହିଳା ହେଲ୍ପଲାଇନ୍',
  'home.dedication1': 'ଙ୍କ ସ୍ମୃତିରେ — ଏକ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା ସେବା।',
  'home.dedication2': 'ଆପଣଙ୍କ ସମସ୍ୟା ଲେଖନ୍ତୁ କିମ୍ବା କୁହନ୍ତୁ।',
  'home.emergencyTitle': 'ଜରୁରୀ — ତୁରନ୍ତ ସାହାଯ୍ୟ ଦରକାର',
  'home.emergencyNote': 'ଏହା ସର୍ବପ୍ରଥମେ ପଢ଼ନ୍ତୁ। ବାକି ସବୁ ପରେ ଦେଖାଯାଇପାରିବ।',
  'home.readMore': 'ସମ୍ପୂର୍ଣ୍ଣ ସୂଚନା ପଢ଼ନ୍ତୁ',
  'home.chooseTopic': 'କେଉଁ ବିଷୟରେ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?',
  'home.memorialEyebrow': 'ଏହି ସାଇଟ୍ କାହା ପାଇଁ',
  'home.memorialLine': 'ଯେଉଁମାନେ ସମାଜ ପାଇଁ ଜୀବନସାରା ଲଢ଼େଇ କଲେ, ଏବଂ ଯେଉଁମାନଙ୍କୁ ଶେଷରେ ନିଜ ଭାଗର ହିସାବ ମିଳିଲା ନାହିଁ।',
  'home.memorialMore': 'ତାଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ କାହାଣୀ ପଢ଼ନ୍ତୁ',
  'home.kundaliTitle': 'ଜନ୍ମ କୁଣ୍ଡଳୀ',
  'home.kundaliNote': 'ସମ୍ପୂର୍ଣ୍ଣ କୁଣ୍ଡଳୀ — ୯ ଗ୍ରହ, ବିମଶୋତ୍ତରୀ ଦଶା, ଫଳାଦେଶ, ଯୋଗ, ଷୋଡ଼ଶବର୍ଗ, କେପି, ଲାଲ୍ କିତାବ ଏବଂ ଅଙ୍କ ଜ୍ୟୋତିଷ। ସବୁ ଆପଣଙ୍କ ଫୋନରେ ହିଁ ଗଣନା ହେବ।',
  'home.chooseTopicNote': 'ତଳେ ଦିଆଯାଇଥିବା ବିଷୟ ଉପରେ ଟ୍ୟାପ୍ କରନ୍ତୁ। ସବୁଠାରେ ସରଳ ଭାଷାରେ ସୂଚନା ଦିଆଯାଇଛି।',
  'home.askHere': 'ଏହି ବିଷୟରେ ପଚାରନ୍ତୁ',
  'home.categoryEmpty': 'ଏହି ବିଷୟରେ ଏବେ କିଛି ଲେଖାଯାଇ ନାହିଁ।',
  'home.soundTitle': 'ଶାନ୍ତି ପାଇଁ ଧ୍ୱନି',
  'home.soundIntro': 'କୌଣସି ଶୁଳ୍କ ନାହିଁ, କୌଣସି ବିଜ୍ଞାପନ ନାହିଁ। କେବଳ ମନ ଶାନ୍ତ କରିବା ପାଇଁ।',
  'home.howTitle': 'ଏହି ସେବା କିପରି କାମ କରେ',
  'home.step1Title': 'ଆପଣଙ୍କ କଥା ଲେଖନ୍ତୁ କିମ୍ବା କୁହନ୍ତୁ',
  'home.step1Body': 'ହିନ୍ଦୀରେ ଟାଇପ୍ କରନ୍ତୁ, କିମ୍ବା ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ। କିଛି ବିଶେଷ କରିବାକୁ ପଡ଼ିବ ନାହିଁ — ଯାହା ମନରେ ଅଛି ତାହା ଲେଖିଦିଅନ୍ତୁ।',
  'home.step2Title': 'ତୁରନ୍ତ ଉତ୍ତର ମିଳେ',
  'home.step2Body': 'ପ୍ରତ୍ୟେକ ପ୍ରଶ୍ନ ପଞ୍ଜୀକୃତ ହୁଏ ଏବଂ ତାର ଉତ୍ତର ତୁରନ୍ତ ମିଳିଥାଏ। ବହୁତ ବଡ଼ ପ୍ରଶ୍ନ ପୂର୍ବରୁ ଛୋଟ ପ୍ରଶ୍ନରୁ ଆରମ୍ଭ କରନ୍ତୁ।',
  'home.step3Title': 'କୌଣସି ଟଙ୍କା ନାହିଁ, କୌଣସି ବ୍ୟକ୍ତିଗତ ସୂଚନା ନାହିଁ',
  'home.step3Body': 'ଏହି ସେବା ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା। ଆପଣଙ୍କ ନାମ, ଠିକଣା କିମ୍ବା ଫୋନ୍ ନମ୍ବର ମଗାଯାଏ ନାହିଁ, ଏବଂ କୌଣସି ବିଜ୍ଞାପନ ଦେଖାଯାଏ ନାହିଁ।',
  'home.stepLabel': 'ଚରଣ',
  'home.freeTitle': 'ଏହି ସେବା ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା',
  'home.freeBody': 'କୌଣସି ଟଙ୍କା ନିଆଯାଏ ନାହିଁ, କୌଣସି ବ୍ୟକ୍ତିଗତ ସୂଚନା ମଗାଯାଏ ନାହିଁ, ଏବଂ କୌଣସି ବିଜ୍ଞାପନ ଦେଖାଯାଏ ନାହିଁ।',
  'help.q1.label': 'ବିଜୁଳି କଟିଯାଇଛି, ମୁଁ କଣ କରିବି?',
  'help.q1.question': 'ଘରେ ବିଜୁଳି ଚାଲିଯାଇଛି। କଣ କରିବା ଉଚିତ୍, ଏବଂ ମୋବାଇଲ ଫୋନ୍ କେମିତି ଚାର୍ଜ କରିବି?',
  'help.q2.label': 'ପିଲାଙ୍କ ପାଠପଢ଼ାରେ ଦୁର୍ବଳତା',
  'help.q2.question': 'ମୋ ପିଲା ପାଠପଢ଼ାରେ ବହୁତ ଦୁର୍ବଳ। ଘରେ କେମିତି ସୁଧାରିବି?',
  'help.q3.label': 'ବୟସ୍କଙ୍କ ଚିକିତ୍ସା',
  'help.q3.question': 'ମୋ ବାପାଙ୍କ ବୟସ ବହୁତ ହେଲାଣି, ତାଙ୍କ ଚିକିତ୍ସା କେମିତି କରିବି?',
  'help.q4.label': 'ଘରେ ନିଆଁ ଲାଗିଲେ କଣ କରିବେ',
  'help.q4.question': 'ଯଦି ରାତିରେ ଘରେ ନିଆଁ ଲାଗିଯାଏ, ତେବେ ସବୁଠାରୁ ପ୍ରଥମେ କଣ କରିବା ଉଚିତ୍?',
  'help.title': 'ଆପଣଙ୍କ ସମସ୍ୟା ଲେଖନ୍ତୁ',
  'help.intro': 'ତଳେ ଲେଖନ୍ତୁ କିମ୍ବା କୁହନ୍ତୁ। ଯଦି ଜାଣି ନାହାଁନ୍ତି ତେବେ ମନରେ ଯାହା ଆସୁଛି ତାହା ଲେଖି ଦିଅନ୍ତୁ — ଏହା ହିଁ ସବୁଠାରୁ ଜରୁରୀ।',
  'help.suggested': 'ସାଧାରଣ ପ୍ରଶ୍ନ',
  'help.howTitle': 'ଏହି ସେବା କେମିତି କାମ କରେ',
  'help.howBody': 'ପ୍ରତ୍ୟେକ ପ୍ରଶ୍ନ ପଞ୍ଜୀକୃତ ହୁଏ ଏବଂ ତାର ଉତ୍ତର ତୁରନ୍ତ ମିଳିଯାଏ। ଆପଣଙ୍କ ନାମ, ଠିକଣା କିମ୍ବା ଫୋନ୍ ନମ୍ବର କେଉଁଠାରେ ନିଆଯାଏ ନାହିଁ। ସବୁକିଛି ମାଗଣା।',
  'ref.title': 'ଏହି ସେବା କଣ, ଏବଂ କାହା ପାଇଁ',
  'ref.intro': 'ଏହି ସେବା ଶ୍ରୀମତୀ VARSHA ଜୀଙ୍କ ସ୍ମୃତିରେ ତିଆରି କରାଯାଇଛି। ଏଠାରେ ସରଳ ଭାଷାରେ କୁହାଯାଇଛି ଯେ ଏହା କଣ କରେ, ଏଥିରେ କଣ ଅଛି, ଏବଂ ଏହାର ସୀମା କଣ। ସବୁକିଛି ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା — କୌଣସି ଟଙ୍କା ନିଆଯାଏ ନାହିଁ, କୌଣସି ବିଜ୍ଞାପନ ଦେଖାଯାଏ ନାହିଁ, ଏବଂ କୌଣସି ବ୍ୟକ୍ତିଗତ ସୂଚନା ମଗାଯାଏ ନାହିଁ।',
  'ref.whatTitle': 'ଏଥିରେ କଣ କଣ ଅଛି',
  'ref.what1': 'ଘରେ ନିଆଁ ଲାଗିବା, ବିଜୁଳି ଚାଲିଯିବା, ପିଲାଙ୍କ ପାଠପଢ଼ାରେ ଦୁର୍ବଳତା, ବାପା-ମାଆଙ୍କ ଯତ୍ନ ନେବା — ଏଭଳି ସାଧାରଣ ସମସ୍ୟାର ସରଳ ଉପାୟ, ସଫା-ସୁତୁରା ଭାଷାରେ।',
  'ref.what2': 'ପ୍ରଶ୍ନ କହି ପଚାରିବାର ସୁବିଧା। କହିବାକୁ ନ ଆସିଲେ ଲେଖନ୍ତୁ — ଉଭୟର ଉତ୍ତର ସମାନ ମିଳିଥାଏ।',
  'ref.what3': 'ପ୍ରତ୍ୟେକ ପ୍ରଶ୍ନ ପଞ୍ଜୀକୃତ ହୁଏ, ତେଣୁ ଯାହା ଅନ୍ୟମାନଙ୍କୁ ହଇରାଣ କରେ ତାହା ଆପଣଙ୍କ ପୂର୍ବରୁ ପଚରା ସରିଥାଏ ଏବଂ ତାର ଉତ୍ତର ମିଳିଯାଏ।',
  'ref.what4': 'କୌଣସି ବିଜ୍ଞାପନ ନାହିଁ, କୌଣସି ଅନାବଶ୍ୟକ ସୂଚନା ନାହିଁ, ଏବଂ କୌଣସି ବ୍ୟକ୍ତିଗତ ସୂଚନା ମଗାଯାଏ ନାହିଁ। ସବୁକିଛି ମାଗଣା।',
  'ref.helplineTitle': 'ତୁରନ୍ତ ସାହାଯ୍ୟ ପାଇଁ ଏହି ନମ୍ବରଗୁଡ଼ିକ ପାଖରେ ରଖନ୍ତୁ',
  'ref.helpline1': 'କୌଣସି ବଡ଼ ବିପଦ ହେଲେ — ଯେପରିକି ନିଆଁ, ବିଜୁଳିର ତୀବ୍ର ଝଟକା, ପଡ଼ିଯିବା କିମ୍ବା ବହୁତ ଅଧିକ ରକ୍ତସ୍ରାବ — ତେବେ 112 ରେ ଫୋନ୍ କରନ୍ତୁ।',
  'ref.helpline2': 'କାହାର ଅସୁସ୍ଥତା କିମ୍ବା ଆଘାତ ଲାଗିଥିଲେ ଏବଂ ଯିବା ପାଇଁ କୌଣସି ରାସ୍ତା ନଥିଲେ, 108 ରେ ଆମ୍ବୁଲାନ୍ସ ମଗାନ୍ତୁ।',
  'ref.helpline3': 'ମହିଳାଙ୍କ ସହ କୌଣସି ଖରାପ କାମ ହୋଇଥିଲେ, କିମ୍ବା ମହିଳାଙ୍କୁ କେଉଁଠାରୁ ହଇରାଣ କରାଯାଉଥିଲେ, 181 ରେ ଫୋନ୍ କରନ୍ତୁ। ଏହା ମାଗଣା।',
  'ref.helpline4': 'ପିଲା କିମ୍ବା ବୟସ୍କଙ୍କ ସହ କୌଣସି ଅନ୍ୟାୟ ହୋଇଥିଲେ, 1098 ରେ ଅଭିଯୋଗ କରାଯାଇପାରିବ।',
  'ref.helpline5': 'ମାନସିକ ଚାପ ବହୁତ ଅଧିକ ହେଲେ, କିମ୍ବା ବଞ୍ଚିବାକୁ ଇଚ୍ଛା ନ ହେଲେ, 14416 ରେ କଥା ହୋଇପାରିବେ। କେବଳ କଥା ହେବା ପାଇଁ।',
  'ref.dataTitle': 'ଆମେ ଆପଣଙ୍କ ବିଷୟରେ କଣ ରଖୁ',
  'ref.dataBody': 'କେବଳ ସେହି ପ୍ରଶ୍ନ ଯାହା ଆପଣ ପଚାରିଛନ୍ତି, ତାର ସାରାଂଶ, ଏବଂ ପ୍ରଶ୍ନ ପଚାରିବାର ସମୟ — ଯାହାଫଳରେ ଆମେ ବାରମ୍ବାର ସେହି ଉତ୍ତର ନ ଦେଇପାରିବୁ। ଆପଣଙ୍କ ନାମ, ଠିକଣା, ଫୋନ୍ ନମ୍ବର, କିମ୍ବା କୌଣସି ପରିଚୟ ଦେଉଥିବା ସୂଚନା ନିଆଯାଏ ନାହିଁ। ସାଇଟରେ କୌଣସି ବିଜ୍ଞାପନ କିମ୍ବା ଟ୍ରାକିଂ ସ୍କ୍ରିପ୍ଟ ଲାଗିନାହିଁ।',
  'ref.adminTitle': 'ପରିଚାଳକ କଣ କରିପାରିବେ',
  'ref.adminBody': 'ପରିଚାଳକ ସେହି ଲେଖାଗୁଡ଼ିକୁ ଦେଖିପାରିବେ ଯାହା ଆପଣ ପଠାଇଛନ୍ତି, ଏବଂ ତାର ଉତ୍ତର ଲେଖିପାରିବେ। ସେ ଆପଣଙ୍କ ଅନୁମତି ବିନା କୌଣସି ଲେଖା ବଦଳାଇ କିମ୍ବା ହଟାଇ ପାରିବେ ନାହିଁ, ଏବଂ ଆପଣଙ୍କ ସୂଚନା କାହାକୁ ବିକ୍ରି କରିପାରିବେ ନାହିଁ।',
  'ref.statsCategories': 'ବିଷୟ ଉପଲବ୍ଧ ଅଛି',
  'ref.statsArticles': 'ଲେଖା ଲେଖାଯାଇଛି',
  'ref.statsQuestions': 'ପ୍ରଶ୍ନ ପଚରା ସରିଛି',
  'ref.ownerNote': 'ଏହି ସେବା କୌଣସି କମ୍ପାନୀର ନୁହେଁ, କୌଣସି ସରକାରଙ୍କର ନୁହେଁ, ବରଂ ଜଣେ ବ୍ୟକ୍ତିଙ୍କ ସ୍ମୃତିରେ ଚଳାଯାଉଛି। ତେଣୁ ଏଠାରେ କୌଣସି ବିଜ୍ଞାପନ ନାହିଁ, କୌଣସି ସଦସ୍ୟତା ନାହିଁ, ଏବଂ କୌଣସି ଟଙ୍କା ନିଆଯାଏ ନାହିଁ।',
  'support.title': 'ଏହି ସେବା ମାଗଣା',
  'support.intro': 'ଏହି ସେବା କାହାଠାରୁ ଟଙ୍କା ନିଏ ନାହିଁ। କିନ୍ତୁ ଏହା ଚାଲୁଛି — ତେଣୁ କିଛି ଉପାୟ ଅଛି ଯାହା ଦ୍ୱାରା ଆପଣ ସାହାଯ୍ୟ କରିପାରିବେ। ସବୁଠାରୁ ସହଜ ଉପାୟ ସବୁଠାରୁ କାମର।',
  'support.waysTitle': 'ଆପଣ କେମିତି ସାହାଯ୍ୟ କରିପାରିବେ',
  'support.way1Title': 'ଆପଣଙ୍କ ଅନୁଭବ ଲେଖନ୍ତୁ',
  'support.way1Body': 'ଯଦି ଏହି ସାଇଟରୁ ଆପଣଙ୍କୁ କିଛି ଠିକ୍ ମିଳିଛି — କିମ୍ବା କିଛି ଏମିତି ମିଳିଛି ଯାହା ଆପଣଙ୍କୁ ଦ୍ୱନ୍ଦ୍ୱରେ ପକାଇଛି — ତେବେ ମତାମତ ପୃଷ୍ଠାରେ ଲେଖି ଦିଅନ୍ତୁ। ଆପଣଙ୍କ ନାମ ଦେବା ଜରୁରୀ ନୁହେଁ।',
  'support.way2Title': 'ଆପଣଙ୍କ ସହର ବିଷୟରେ କୁହନ୍ତୁ',
  'support.way2Body': 'ଆପଣ ଯେଉଁଠାରେ ରୁହନ୍ତି, ସେଠାର ଭାଷା, ରୀତିନୀତି ଏବଂ ଅସୁବିଧା ଅଲଗା ହୋଇଥାଏ। ଯଦି ଆପଣଙ୍କ ଅଞ୍ଚଳର କିଛି କଥା ଏଠାରେ ନାହିଁ, ତେବେ କୁହନ୍ତୁ — ଯାହା ଯୋଡ଼ା ଯାଇପାରିବ ତାହା ଯୋଡ଼ି ଦିଆଯିବ।',
  'support.way3Title': 'ଆପଣଙ୍କ ଅନୁଭବ ଅନ୍ୟ କାହାକୁ ଶୁଣାନ୍ତୁ',
  'support.way3Body': 'ଏଠାରେ ଯାହା ଲେଖାଅଛି ତାହା ବହୁତ ଲୋକଙ୍କ କାମରେ ଆସିପାରିବ, ଯଦି ସେମାନେ ଜାଣିବେ। କାହାକୁ କୁହନ୍ତୁ ଯାହାଙ୍କୁ ଏହା ପ୍ରକୃତରେ ସାହାଯ୍ୟ କରିବ।',
  'support.way4Title': 'ଏଠାକୁ ଆସି ଦେଖନ୍ତୁ',
  'support.way4Body': 'ଯଦି ଆପଣଙ୍କ ପାଖରେ ସମୟ ଅଛି, ତେବେ ନିଜେ ଆସି ଦେଖନ୍ତୁ ଯେ ଏହି ସାଇଟ୍ ଠିକ୍ ଭାବେ ଚାଲୁଛି କି ନାହିଁ। କିଛି ଖରାପ ଦେଖିଲେ କୁହନ୍ତୁ — ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣାରେ ଠିକ୍ ହୋଇଯିବ।',
  'support.contactTitle': 'କିଛି କହିବାର ଅଛି କି?',
  'support.contactBody': 'ଯେକୌଣସି କଥା ପାଇଁ ଏଠାରେ ଲେଖିପାରିବେ — କୌଣସି ଭୁଲ ହେଉ, କିଛି ଅଧିକ ମିଳୁ, କିମ୍ବା କୌଣସି ପ୍ରଶ୍ନ। ଯେତେ ଲେଖିବା ସହଜ ଲାଗିବ, ସେତେ ହିଁ ଲେଖନ୍ତୁ।',
  'support.faqTitle': 'କିଛି କଥା ଯାହା ବାରମ୍ବାର ପଚରାଯାଏ',
  'support.faqBody': 'ଏହା କଣ ପ୍ରକୃତରେ ମାଗଣା? ହଁ। ଆପଣଙ୍କ ନାମ ନିଆଯାଏ କି? ନାହିଁ, ନାମ ଦେବା ଜରୁରୀ ନୁହେଁ। ବିଜ୍ଞାପନ ଆସେ କି? ନାହିଁ। କୌଣସି ଫୋନ୍ ନମ୍ବର କିମ୍ବା ଠିକଣା ମଗାଯାଏ କି? ନାହିଁ। କୌଣସି ଆପ୍ ଡାଉନଲୋଡ଼ କରିବାକୁ ପଡ଼ିବ କି? ନାହିଁ, ବ୍ରାଉଜରରେ ଖୋଲିଯାଏ।',
  'ask.label': 'ଆପଣଙ୍କ ସମସ୍ୟା ଲେଖନ୍ତୁ କିମ୍ବା ମାଇକ୍‌ରେ କୁହନ୍ତୁ',
  'ask.placeholder': 'ଯେପରି: ପିଲାଙ୍କ ପାଠପଢ଼ାରେ ଦୁର୍ବଳତା ଅଛି',
  'ask.help': 'ଏଣ୍ଟର ଦବାଇ ମଧ୍ୟ ପଠାଇ ପାରିବେ।',
  'ask.send': 'ପଚାରନ୍ତୁ',
  'ask.sending': 'ଭାବୁଛୁ…',
  'ask.clear': 'ଲେଖା ହୋଇଥିବା ମିଟାଇ ଦିଅନ୍ତୁ',
  'ask.speak': 'କହି ପଚାରନ୍ତୁ',
  'ask.listening': 'କହିବା ଆରମ୍ଭ କରନ୍ତୁ…',
  'ask.heard': 'ଶୁଣୁଛୁ',
  'ask.stopListening': 'ଶୁଣିବା ବନ୍ଦ କରନ୍ତୁ',
  'ask.suggested': 'ସାଧାରଣ ପ୍ରଶ୍ନ',
  'ask.answerTitle': 'ସମାଧାନ',
  'ask.listen': 'ଶୁଣନ୍ତୁ',
  'ask.stopSpeak': 'ବନ୍ଦ କରନ୍ତୁ',
  'ask.aiNote': 'ଏହି ଉତ୍ତରଟି AI ଦ୍ୱାରା ଦିଆଯାଇଛି। ଏହା କୌଣସି ବିଶେଷଜ୍ଞଙ୍କ ପରାମର୍ଶର ବିକଳ୍ପ ନୁହେଁ।',
  'ask.errorRateLimit': 'ଅନେକ ପ୍ରଶ୍ନ ଏକାସାଙ୍ଗରେ ପଠାଯାଇଛି। କିଛି ସମୟ ପରେ ଚେଷ୍ଟା କରନ୍ତୁ।',
  'ask.errorNetwork': 'ଇଣ୍ଟରନେଟ୍ ଚାଲୁନାହିଁ। କନେକ୍ସନ୍ ଯାଞ୍ଚ କରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  'ask.notAnswer': 'ଏହି ପ୍ରଶ୍ନର ସିଧାସଳଖ ଉତ୍ତର ଆମ ପାଖରେ ନାହିଁ।',
  'ask.emptyAnswer': 'ଏଥର ଉତ୍ତର ମିଳିପାରିଲା ନାହିଁ। ପ୍ରଶ୍ନଟିକୁ ଟିକେ ବଦଳାଇ ପୁଣି ପଚାରନ୍ତୁ।',
  'ask.micUnsupported': 'ଏହି ବ୍ରାଉଜରରେ କହି ପଚାରିବା କାମ କରିବ ନାହିଁ। ଲେଖିକରି ପଚାରନ୍ତୁ।',
  'ask.heardWith': 'ଏହା ଶୁଣୁଛୁ:',
  'voice.notAllowed': 'ମାଇକ୍ ବ୍ୟବହାର ପାଇଁ ଅନୁମତି ମିଳିନାହିଁ। ଉପରକୁ ଯାଇ ଅନୁମତି ଦିଅନ୍ତୁ, କିମ୍ବା ଲେଖିକରି ପଚାରନ୍ତୁ।',
  'voice.serviceNotAllowed': 'ମାଇକ୍ ବ୍ୟବହାର ପାଇଁ ଅନୁମତି ମିଳିନାହିଁ। ଉପରକୁ ଯାଇ ଅନୁମତି ଦିଅନ୍ତୁ, କିମ୍ବା ଲେଖିକରି ପଚାରନ୍ତୁ।',
  'voice.noSpeech': 'କୌଣସି ଶବ୍ଦ ଶୁଭିଲା ନାହିଁ। ମାଇକ୍ ପାଖରେ କୁହନ୍ତୁ, କିମ୍ବା ଲେଖନ୍ତୁ।',
  'voice.audioCapture': 'କୌଣସି ମାଇକ୍ ମିଳିଲା ନାହିଁ। ଡିଭାଇସ୍ ଯୋଡ଼ନ୍ତୁ, କିମ୍ବା ଲେଖିକରି ପଚାରନ୍ତୁ।',
  'voice.network': 'କହି ପଚାରିବା ପାଇଁ ଇଣ୍ଟରନେଟ୍ ଦରକାର, ଯାହା ଏବେ ଚାଲୁନାହିଁ। ଲେଖିକରି ପଚାରନ୍ତୁ — ଉତ୍ତର ସେଇଆ ମିଳିବ।',
  'voice.aborted': 'ଅଟକି ଗଲା। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  'voice.unsupported': 'ଏହି ବ୍ରାଉଜରରେ କହି ପଚାରିବା କାମ କରିବ ନାହିଁ। ଲେଖିକରି ପଚାରନ୍ତୁ।',
  'voice.speakFailed': 'ଏହି ଉତ୍ତରଟି ଶୁଣାଇ ହେଲା ନାହିଁ।',
  'voice.noVoice': 'ଏହି ଡିଭାଇସରେ {name} କହିବା ପାଇଁ ସ୍ୱର ମିଳିଲା ନାହିଁ। ଏବେ ଲେଖାଟି ପଢ଼ନ୍ତୁ, କିମ୍ବା ଫୋନ୍ ସେଟିଂରେ ଯାଇ ସ୍ୱର ଯୋଡ଼ନ୍ତୁ।',
  'voice.generic': 'କିଛି ଗଡ଼ବଡ଼ ହୋଇଗଲା। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  'sound.title': 'ଶାନ୍ତି ପାଇଁ ଧ୍ୱନି',
  'sound.intro': 'କୌଣସି ଶୁଳ୍କ ନାହିଁ, କୌଣସି ବିଜ୍ଞାପନ ନାହିଁ। କେବଳ ମନ ଶାନ୍ତ କରିବା ପାଇଁ।',
  'sound.playing': 'ଧ୍ୱନି ଚାଲୁଛି। ବନ୍ଦ କରିବା ପାଇଁ ସେହି ବଟନ୍‌କୁ ପୁଣି ଥରେ ଦବାନ୍ତୁ।',
  'sound.shankh': 'ଶଙ୍ଖ',
  'sound.shankhHint': 'ଗଭୀର, ଲମ୍ବା',
  'sound.bansuri': 'ବାଉଁଶୀ',
  'sound.bansuriHint': 'କୋମଳ, ଧୀର',
  'sound.dhol': 'ନଗଡ଼ା',
  'sound.dholHint': 'ତୀକ୍ଷ୍ଣ, ଜୋର',
  'sound.all': 'ତିନୋଟି',
  'sound.allHint': 'ଏକାସାଙ୍ଗରେ',
  'sound.listenLabel': 'ଶୁଣନ୍ତୁ',
  'sound.errUnsupported': 'ଏହି ବ୍ରାଉଜର ଧ୍ୱନି ଚଳାଇ ପାରୁନାହିଁ।',
  'sound.errGeneric': 'ଧ୍ୱନି ଚଳାଇବାରେ ସମସ୍ୟା ହେଲା।',
  'dhun.welcome': 'ସ୍ୱାଗତ',
  'dhun.prompt': 'ଶଙ୍ଖ, ବାଉଁଶୀ ଏବଂ ନଗଡ଼ା — ଏକାସାଙ୍ଗରେ ଶୁଣିବା ପାଇଁ ଛୁଅନ୍ତୁ।',
  'dhun.listen': '▶ ଶୁଣନ୍ତୁ',
  'dhun.skip': 'ଧ୍ୱନି ଛାଡ଼ନ୍ତୁ',
  'dhun.failed': 'ଧ୍ୱନି ଚାଲିପାରିଲା ନାହିଁ।',
  'dhun.label': 'ଧ୍ୱନି ଚଳାଇବା ପାଇଁ ଅନୁମତି',
  'reviews.title': 'ଆପଣଙ୍କ ମତାମତ, ଆପଣଙ୍କ କଥା',
  'reviews.intro': 'ଏହି ସେବା ଆପଣଙ୍କ କାମରେ ଆସିଲା କି? ନିଜ କଥା ଲେଖନ୍ତୁ — ନିଜ ନାମ ଦେବା ଜରୁରୀ ନୁହେଁ।',
  'reviews.pageTitle': 'ଆପଣଙ୍କ ମତାମତ',
  'reviews.pageIntro': 'ଲୋକମାନେ ଯାହା ଲେଖିଛନ୍ତି, ତାହା ଏଠାରେ ଅଛି। କୌଣସି ମତାମତ ଲୁଚାଯାଏ ନାହିଁ, ଏବଂ ଯାହା ଲେଖାଯାଇଛି ତାହା ଏଠାରେ ଦେଖାଯାଏ — କେବଳ ଥରେ ଦେଖିନେବା ପରେ ପ୍ରକାଶ କରାଯାଏ।',
  'reviews.write': 'ନିଜ ମତାମତ ଲେଖନ୍ତୁ',
  'reviews.submit': 'ପଠାନ୍ତୁ',
  'reviews.sending': 'ପଠାଉଛୁ…',
  'reviews.name': 'ଆପଣଙ୍କ ନାମ (ଜରୁରୀ ନୁହେଁ)',
  'reviews.city': 'ଆପଣଙ୍କ ସହର (ଜରୁରୀ ନୁହେଁ)',
  'reviews.comment': 'ଆପଣଙ୍କ କଥା',
  'reviews.placeholder': 'ମନରେ ଯାହା ଆସୁଛି ତାହା ଲେଖନ୍ତୁ — କିଛି ସଠିକ୍ କରିବାର ଆବଶ୍ୟକତା ନାହିଁ।',
  'reviews.moderated': 'ଆପଣଙ୍କ ସମୀକ୍ଷା ପ୍ରକାଶ ପାଇବା ପୂର୍ବରୁ ଥରେ ଯାଞ୍ଚ କରାଯାଏ।',
  'reviews.moderationNote': 'ସବୁକିଛି ଡିଲିଟ୍ ହେବାରୁ ବଞ୍ଚାଇବା ପାଇଁ, ପ୍ରକାଶ ପାଇବା ପୂର୍ବରୁ ପ୍ରତ୍ୟେକ ସମୀକ୍ଷା ଥରେ ଯାଞ୍ଚ କରାଯାଏ। ଗାଳିଗୁଲଜ, ନମ୍ବର କିମ୍ବା ବ୍ୟକ୍ତିଗତ କଥା ହଟାଇ ଦିଆଯାଏ — ବାକି ସବୁ ଯେମିତି ଅଛି ସେମିତି ପ୍ରକାଶ କରାଯାଏ।',
  'reviews.summaryTitle': 'ସାଧାରଣ ମତ',
  'reviews.count': 'ସମୀକ୍ଷା',
  'reviews.anonymous': 'ନାମ ବିନା',
  'reviews.summaryLine': 'ଲୋକମାନେ ହାରାହାରି {rating} ତାରା ଦେଇଛନ୍ତି (5 ମଧ୍ୟରୁ), {count} ଥର।',
  'reviews.starsLabel': '5 ରୁ {value} ତାରା',
  'reviews.keepLabel': 'ଖରାପ ଲାଗିଲେ କି ଭଲ ଲାଗିଲେ — ଉଭୟ ଲେଖନ୍ତୁ',
  'reviews.ownerReply': 'ଉତ୍ତର',
  'reviews.replyLabel': 'ଏହା ଉପରେ ଲେଖାଯାଇଛି',
  'reviews.empty': 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସମୀକ୍ଷା ନାହିଁ। ପ୍ରଥମେ ଆପଣ ଲେଖନ୍ତୁ।',
  'reviews.toastSent': 'ଧନ୍ୟବାଦ',
  'reviews.toastFailed': 'ମତ ପଠାଯାଇ ପାରିଲା ନାହିଁ',
  'reviews.fieldTooShort': 'ଅତି କମରେ 10ଟି ଅକ୍ଷର ଲେଖନ୍ତୁ।',
  'reviews.rateLimited': 'ଖୁବ୍ ଶୀଘ୍ର ପଠାଯାଉଛି। କିଛି ସମୟ ଅପେକ୍ଷା କରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  'cat.notFound': 'ଏହି ପୃଷ୍ଠା ମିଳିଲା ନାହିଁ',
  'cat.empty': 'ଏହି ବିଷୟରେ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଲେଖା ନାହିଁ।',
  'article.emergency': 'ଜରୁରୀ',
  'article.askAbout': 'ଏହି ବିଷୟରେ ପଚାରନ୍ତୁ',
  'article.readAloud': 'ଏହି ଲେଖାଟି ଶୁଣନ୍ତୁ',
  'article.others': 'ଏହି ବିଷୟର ଅନ୍ୟ ଲେଖା',
  'article.count': '{count} ଲେଖା',
  'theme.toLight': 'ଉଜ୍ଜ୍ୱଳ ରୂପକୁ ଯାଆନ୍ତୁ',
  'theme.toDark': 'ଅନ୍ଧାର ରୂପକୁ ଯାଆନ୍ତୁ',
  'toast.dismiss': 'ବନ୍ଦ କରନ୍ତୁ',
  'language.choose': 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
  'language.articlesIn': 'ଏହି ଲେଖାଟି ହିନ୍ଦୀରେ ଅଛି।',
  'language.articlesInHint': 'ପ୍ରତ୍ୟେକ ଭାଷାରେ ଅଲଗା ଅନୁବାଦ ଦରକାର। ଏହି ଅନୁବାଦ ଏପର୍ଯ୍ୟନ୍ତ ହୋଇନାହିଁ — ଯାହା ଲେଖାଅଛି ତାହା ହିନ୍ଦୀରେ ହିଁ ସଠିକ୍ ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ଅଛି।',
  'ask.welcome': 'ଆପଣଙ୍କୁ ସ୍ୱାଗତ! ତଳେ ଆପଣଙ୍କ ସମସ୍ୟା ଲେଖନ୍ତୁ କିମ୍ବା କୌଣସି ବିଷୟ ବାଛନ୍ତୁ।',
  'ref.notTitle': 'ଏହା କ\'ଣ କରେ ନାହିଁ',
  'ref.not1': 'ଏହା ଡାକ୍ତର ନୁହେଁ। ଔଷଧ ପାଇଁ କେବେ ବି ପରାମର୍ଶ ଦିଆଯାଏ ନାହିଁ।',
  'ref.not2': 'ଏହା ଓକିଲ ନୁହେଁ। ଆଇନଗତ ପରାମର୍ଶ ଦିଆଯାଏ ନାହିଁ।',
  'ref.not3': 'କୌଣସି ଟଙ୍କା ନିଆଯାଏ ନାହିଁ, ଏବଂ କୌଣସି ବିଜ୍ଞାପନ ଦେଖାଯାଏ ନାହିଁ।',
  'ref.not4': 'ଆପଣଙ୍କ ନାମ, ଠିକଣା କିମ୍ବା ଫୋନ୍ ନମ୍ବର ମଗାଯାଏ ନାହିଁ ଏବଂ ରଖାଯାଏ ନାହିଁ।',
  'ref.not5': 'କୌଣସି ସରକାରୀ ଯୋଜନାର ଦାମ୍ କିମ୍ବା ନମ୍ବର ତିଆରି କରାଯାଏ ନାହିଁ — ସଠିକ୍ ସୂଚନା ନଥିଲେ ସଫା ସଫା କହିଦିଆଯାଏ ଯେ ଜଣା ନାହିଁ।',
  'ref.medicalTitle': 'ଜରୁରୀ: ଏହା ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନୁହେଁ',
  'ref.medicalBody': 'ରୋଗ, ଔଷଧ କିମ୍ବା କୌଣସି ବିଷାକ୍ତ ଜିନିଷ ସହ ଜଡିତ କଥା ହେଲେ, ସର୍ବପ୍ରଥମେ ଡାକ୍ତରଙ୍କୁ ଭେଟନ୍ତୁ। ଏଠାରେ ଦିଆଯାଇଥିବା ସୂଚନା କେବଳ ସାଧାରଣ ସହାୟତା ପାଇଁ। ଶିଶୁଙ୍କ ଟିକା, ଗର୍ଭାବସ୍ଥା, କିମ୍ବା କୌଣସି ଔଷଧ ଆରମ୍ଭ କରିବା ପୂର୍ବରୁ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଶ୍ଚୟ ନିଅନ୍ତୁ।',
  'ref.statsTitle': 'କେତେ ସୂଚନା ଉପଲବ୍ଧ ଅଛି',
  'support.howTitle': 'ଆମକୁ କିପରି ସାହାଯ୍ୟ କରିବେ',
  'support.alwaysFreeTitle': 'ଏହି ସେବା ସର୍ବଦା ମାଗଣା ରହିବ',
  'support.alwaysFreeBody': 'ଯାହା ବି ସାହାଯ୍ୟ ମିଳିବ, ତାହା ସେବା ଚଲାଇବାରେ ଖର୍ଚ୍ଚ ହେବ। କାହାଠାରୁ କେବେ ବି ଟଙ୍କା ନିଆଯିବ ନାହିଁ।',
  'smriti.eyebrow': 'ଶ୍ରଦ୍ଧାଞ୍ଜଳି',
  'smriti.whyTitle': 'ଏହି ସାଇଟ୍ କାହିଁକି ଅଛି',
  'smriti.ending': 'ତାଙ୍କ ସଂଘର୍ଷ ଏଠାରେ ଆଗକୁ ବଢୁଛି।',
  'article.askAny': 'କିଛି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
  'article.remember': 'ମନେ ରଖନ୍ତୁ',
  'article.emergencyInfo': 'ଜରୁରୀ ସୂଚନା',
  'article.medicalTitle': 'ଏହା ଚିକିତ୍ସା ପରାମର୍ଶ ନୁହେଁ',
  'article.medicalBody': 'ଏହି ସୂଚନା ସାଧାରଣ ସହାୟତା ପାଇଁ। କୌଣସି ଔଷଧ ଆରମ୍ଭ କିମ୍ବା ବନ୍ଦ କରନ୍ତୁ ନାହିଁ — ପ୍ରଥମେ ଡାକ୍ତରଙ୍କୁ ଭେଟନ୍ତୁ।',
  'article.heading': '{category} ର ଲେଖା',
  'reviews.rateQuestion': 'କେତେ ତାରା ଦେବେ?',
  'reviews.starsShort': '{value} ତାରା',
  'reviews.averageOutOf': '5 ରୁ {value} ତାରା',
  'dhun.welcomeTitle': 'ସ୍ୱାଗତ',
  'dhun.consent': 'ଶଙ୍ଖ, ବଂଶୀ ଏବଂ ନଗଡ଼ା — ଏକାଠି ଶୁଣିବା ପାଇଁ ଛୁଅନ୍ତୁ।',
  'dhun.unsupported': 'ଏହି ବ୍ରାଉଜର୍ ଶବ୍ଦ ବଜାଇ ପାରୁନାହିଁ।',
  'dhun.failedTry': 'ଶବ୍ଦ ବଜାଇବାରେ ସମସ୍ୟା ହେଲା।',
  'sound.hintIdle': 'ଗୋଟିଏ ବଟନ୍ ଦବାଇ ଶବ୍ଦ ଶୁଣନ୍ତୁ।',
  'sound.hintPlaying': 'ଆୱାଜ୍ ଚାଲିଛି। ବନ୍ଦ କରିବା ପାଇଁ ସେହି ବଟନ୍କୁ ପୁଣି ଥରେ ଦବାନ୍ତୁ।',
  'sound.preparing': 'ଶବ୍ଦ ପ୍ରସ୍ତୁତ ହେଉଛି',
  'nav.path': 'ବାଟ',
  'health.heading': 'ନିଜର ବୟସ କୁହନ୍ତୁ',
  'health.intro': 'ବୟସ ଅନୁସାରେ ସାଧାରଣତଃ ଯେଉଁ ପ୍ରଶ୍ନ ପଚରାଯାଏ, ସେଗୁଡ଼ିକ ଏଠାରେ ଦୃଶ୍ୟମାନ ହେବ। ଗୋଟିଏ ବଟନ୍ ଦବାନ୍ତୁ — ପ୍ରଶ୍ନ ତଳେ ଭର୍ତ୍ତି ହୋଇଯିବ, ତା\'ପରେ ପଚାରି ଦିଅନ୍ତୁ।',
  'health.ageLabel': 'ବୟସ (ବର୍ଷ)',
  'health.years': 'ବର୍ଷ',
  'health.bandsLabel': 'ବୟସ ଅନୁସାରେ ବାଛନ୍ତୁ',
  'health.notAdviceStrong': 'ଏହା ଡାକ୍ତରୀ ପରାମର୍ଶ ନୁହେଁ।',
  'health.notAdvice': 'କୌଣସି ଔଷଧ ଆରମ୍ଭ କିମ୍ବା ବନ୍ଦ କରନ୍ତୁ ନାହିଁ — ପ୍ରଥମେ ଡାକ୍ତରଙ୍କୁ ଭେଟନ୍ତୁ।',
  'health.emergencyStrong': 'ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତିରେ ଫୋନ୍ କରନ୍ତୁ:',
  'health.emergencyCall': '(ଜରୁରୀକାଳୀନ)',
  'health.emergencyAmbulance': '(ଆମ୍ବୁଲାନ୍ସ)',
  'health.emergencyWomen': '(ମହିଳା ହେଲ୍ପଲାଇନ୍)',
  'health.privacy': 'କୌଣସି ନାମ କିମ୍ବା ଠିକଣା ଲେଖିବାର ଆବଶ୍ୟକତା ନାହିଁ।',
  'health.band.infant.label': '0 – 2 ବର୍ଷ',
  'health.band.infant.note': 'ସାନ ପିଲା, ଯେଉଁମାନେ ଏବେ ନିଜ କଥା କହିପାରିବେ ନାହିଁ',
  'health.c.infant1': 'ଜୋର୍ ଜ୍ୱର',
  'health.q.infant1': 'ମୋ ପିଲାକୁ ଜୋର୍ ଜ୍ୱର ଅଛି, କ୍ଷୀର ଦେବି କି?',
  'health.c.infant2': 'ଖାଉ ନାହିଁ',
  'health.q.infant2': 'ସାନ ପିଲା ଖାଉ ନାହିଁ, କ\'ଣ କରିବି?',
  'health.c.infant3': 'ଓକାର ହେଉଛି',
  'health.q.infant3': 'ପିଲାକୁ ଓକାର ହେଉଛି, କେବେ ଡାକ୍ତରଙ୍କୁ ଦେଖାଇବି?',
  'health.c.infant4': 'ଝାଡ଼ା ହେଉଛି',
  'health.q.infant4': 'ପିଲାକୁ ଝାଡ଼ା ହେଉଛି, କ\'ଣ ଖାଇବାକୁ ଦେବି?',
  'health.band.child.label': '3 – 12 ବର୍ଷ',
  'health.band.child.note': 'ପିଲାମାନେ ଯେଉଁମାନେ କହିପାରନ୍ତି, କିନ୍ତୁ ପ୍ରଶ୍ନ ପଚାରିବାକୁ ଡରନ୍ତି',
  'health.c.child1': 'ପଢ଼ାରେ ମନ ନାହିଁ',
  'health.q.child1': 'ପିଲାର ପଢ଼ାରେ ମନ ଲାଗୁ ନାହିଁ, କ\'ଣ କରିବି?',
  'health.c.child2': 'ସ୍କୁଲ ଯିବାକୁ ମନା କରୁଛି',
  'health.q.child2': 'ପିଲା ପ୍ରତିଦିନ ସ୍କୁଲ ଯିବାକୁ ମନା କରୁଛି, କାରଣ କ\'ଣ ହୋଇପାରେ?',
  'health.c.child3': 'ରାତିରେ ଜ୍ୱର',
  'health.q.child3': 'ପିଲାକୁ ରାତିରେ ଜ୍ୱର ଆସୁଛି, କ\'ଣ କରିବି?',
  'health.c.child4': 'ଦାନ୍ତ ଭାଙ୍ଗୁଛି',
  'health.q.child4': 'ପିଲାର ଦାନ୍ତ ଭାଙ୍ଗୁଛି, ଦାନ୍ତର ଯତ୍ନ କିପରି ନେବି?',
  'health.band.teen.label': '13 – 17 ବର୍ଷ',
  'health.band.teen.note': 'ଶୈଶବରୁ କିଶୋର, ଯାହାଙ୍କୁ ପ୍ରାୟତଃ ଏପରି କେହି ବ୍ୟକ୍ତି ମିଳନ୍ତି ନାହିଁ ଯିଏ ଶୁଣିବ',
  'health.c.teen1': 'ପଢ଼ାର ଚାପ',
  'health.q.teen1': 'ପଢ଼ାର ବହୁତ ଚାପ ଅଛି, ଏହାର ମୁକାବିଲା କିପରି କରିବି?',
  'health.c.teen2': 'ନିଦ ହେଉ ନାହିଁ',
  'health.q.teen2': 'ରାତିରେ ଭଲ ଭାବରେ ନିଦ ହେଉ ନାହିଁ, କ\'ଣ କରିବି?',
  'health.c.teen3': 'ମୋବାଇଲ୍ ନିଶା',
  'health.q.teen3': 'ମୋବାଇଲ୍ ନିଶା ଲାଗିଯାଇଛି, ଛାଡ଼ିବାର ଉପାୟ କୁହନ୍ତୁ।',
  'health.c.teen4': 'ବହୁତ ଦୁଃଖ',
  'health.q.teen4': 'ବହୁତ ଦୁଃଖ ଅନୁଭବ ହେଉଛି, କାହା ସହିତ କଥା ହେବି?',
  'health.band.young.label': '18 – 30 ବର୍ଷ',
  'health.band.young.note': 'ଚାକିରି, ଟଙ୍କା ଏବଂ ନିଦ — ତିନୋଟିର ଏକାସାଙ୍ଗରେ ବୋଝ',
  'health.c.young1': 'କାମର ଚାପ',
  'health.q.young1': 'କାମର ଚାପ ବହୁତ ଅଧିକ ଅଛି, କିପରି କମ କରିବି?',
  'health.c.young2': 'ବସିରହିବାରୁ ପିଠି ଯନ୍ତ୍ରଣା',
  'health.q.young2': 'ବସିରହିବାରୁ ପିଠିରେ ଯନ୍ତ୍ରଣା ହେଉଛି, କ\'ଣ କରିବି?',
  'health.c.young3': 'ନିଦ ହେଉ ନାହିଁ',
  'health.q.young3': 'ରାତିରେ ନିଦ ହେଉନି, କଣ କରିବି?',
  'health.c.young4': 'ଟଙ୍କା ଅଭାବ',
  'health.q.young4': 'ଟଙ୍କା କମ୍ ଅଛି ଆଉ ଖର୍ଚ୍ଚ ଅଧିକ, କଣ କରିବି?',
  'health.band.middle.label': '୩୧ – ୪୫ ବର୍ଷ',
  'health.band.middle.note': 'ଘର, ପିଲା ଏବଂ ନିଜ ସ୍ୱାସ୍ଥ୍ୟ — ସବୁର ଦାୟିତ୍ୱ ଏକାଠି',
  'health.c.middle1': 'କମର ବିନ୍ଧା',
  'health.q.middle1': 'କମର ବିନ୍ଧୁଛି, ଏହାର କାରଣ କଣ ହୋଇପାରେ?',
  'health.c.middle2': 'ନିଦ ଠିକ୍ ହେଉନି',
  'health.q.middle2': 'ନିଦ ଭଲ ହେଉନି, ସୁଧାରିବାର ଉପାୟ କଣ?',
  'health.c.middle3': 'ଘରର ଚିନ୍ତା',
  'health.q.middle3': 'ଘରର ଚିନ୍ତା ବହୁତ ଅଛି, ପିଲାଙ୍କୁ କେମିତି ସମ୍ଭାଳିବି?',
  'health.c.middle4': 'ପେଟରେ ଗ୍ୟାସ୍',
  'health.q.middle4': 'କାମରେ ବହୁ ବର୍ଷ ହେଲା ପେଟରେ ଗ୍ୟାସ୍ ସମସ୍ୟା ଅଛି, କଣ କରିବି?',
  'health.band.later.label': '୪୬ – ୬୦ ବର୍ଷ',
  'health.band.later.note': 'ଶରୀରର ବୟସ ଏବଂ ତାର ଯତ୍ନ — ଦୁଇଟିଯାକ ଏକାଠି',
  'health.c.later1': 'ପିଠି ବିନ୍ଧା',
  'health.q.later1': 'ମୋ ବୟସ ୫୪ ବର୍ଷ ଏବଂ ମୋ ପିଠି ବିନ୍ଧୁଛି, କଣ କରିବି?',
  'health.c.later2': 'ଆଣ୍ଠୁ ବିନ୍ଧା',
  'health.q.later2': 'ଉଠିଲା ବେଳେ ଆଣ୍ଠୁ ବିନ୍ଧୁଛି, କାହିଁକି?',
  'health.c.later3': 'ରାତିରେ ଗୋଡ଼ ଟାଣି ଧରିବା',
  'health.q.later3': 'ରାତିରେ ଗୋଡ଼ ଟାଣି ଧରୁଛି, କଣ କରିବି?',
  'health.c.later4': 'ସକାଳେ ଜକଡ଼ା',
  'health.q.later4': 'ସକାଳେ ଉଠିଲେ କମର ଜକଡ଼ି ଯାଉଛି, କାରଣ କଣ ହୋଇପାରେ?',
  'health.band.senior.label': '୬୧ – ୭୫ ବର୍ଷ',
  'health.band.senior.note': 'ଔଷଧ, ସନ୍ତୁଳନ ଏବଂ ଏକୁଟିଆପଣ — ତିନୋଟିଯାକ ଏକାଠି',
  'health.c.senior1': 'ଚାଲିବାରେ କଷ୍ଟ',
  'health.q.senior1': 'ଆଣ୍ଠୁ ଏତେ ବିନ୍ଧୁଛି ଯେ ଚାଲିବା ମୁସ୍କିଲ, କଣ କରିବି?',
  'health.c.senior2': 'ଔଷଧ ଯାଞ୍ଚ',
  'health.q.senior2': 'ଅନେକ ଔଷଧ ପ୍ରତିଦିନ ଖାଇବାକୁ ପଡ଼ୁଛି — କେମିତି ଜାଣିବି କେଉଁଟି କ୍ଷତିକାରକ?',
  'health.c.senior3': 'ରାତିରେ ପରିସ୍ରା',
  'health.q.senior3': 'ରାତିରେ ବାରମ୍ବାର ପରିସ୍ରା ଲାଗୁଛି, କଣ କରିବି?',
  'health.c.senior4': 'କମ୍ ଶୁଣାଯିବା',
  'health.q.senior4': 'କମ୍ ଶୁଣାଯାଉଛି, ଶୁଣିବା ପାଇଁ କିଛି ଉପାୟ କୁହନ୍ତୁ।',
  'health.band.elder.label': '୭୬ – ୧୦୦ ବର୍ଷ',
  'health.band.elder.note': 'ପ୍ରତି ଔଷଧର ଯାଞ୍ଚ ଜରୁରୀ, ପଡ଼ିଯିବା ବହୁତ ଗମ୍ଭୀର',
  'health.c.elder1': 'ପଡ଼ିଯିବାର ଭୟ',
  'health.q.elder1': 'ଘରେ ପଡ଼ିଯିବାର ଭୟ ଅଛି, କଣ ସୁରକ୍ଷା ରଖିବି?',
  'health.c.elder2': 'ମନେ ରଖିବାରେ ଅସୁବିଧା',
  'health.q.elder2': 'ମନେ ରଖିବାର ଶକ୍ତି କମିଯାଉଛି, କଣ ଉପାୟ ଅଛି?',
  'health.c.elder3': 'ପ୍ରତିଦିନ ଯନ୍ତ୍ରଣା ନାଶକ ଔଷଧ',
  'health.q.elder3': 'ଯନ୍ତ୍ରଣା ନାଶକ ଔଷଧ ପ୍ରତିଦିନ ଖାଇବାକୁ ପଡ଼ୁଛି — ଏହାର କଣ କିଛି କ୍ଷତି ଅଛି?',
  'health.c.elder4': 'କେବେ ଡାକ୍ତରଙ୍କ ପାଖକୁ ଯିବେ',
  'health.q.elder4': 'କେବେ ଡାକ୍ତରଙ୍କ ପାଖକୁ ଯିବା ଜରୁରୀ?',
  'ask.notConfigured': 'ଏହି ସେବା ବର୍ତ୍ତମାନ ପୁରୁଣା ଉତ୍ତରଗୁଡ଼ିକରୁ ଉତ୍ତର ଦେଉଛି। ଆପଣଙ୍କ ପ୍ରଶ୍ନ ସେଥିରେ ମିଳିଲା ନାହିଁ।',
  'ask.browseTitle': 'ଏଠାରେ ଥିବା ଲେଖାଗୁଡ଼ିକ ଦେଖନ୍ତୁ',
  'download.pdf': 'PDF ରେ ଲେଖନ୍ତୁ',
  'download.text': 'ଟେକ୍ସଟ୍ ରେ ଲେଖନ୍ତୁ',
  'download.printNow': 'ପ୍ରିଣ୍ଟ କରନ୍ତୁ',
  'download.preparing': 'ପ୍ରସ୍ତୁତ ହେଉଛି',
  'download.blocked': 'ନୂଆ ଟ୍ୟାବ୍ ଖୋଲି ପାରିଲାନି। ପପ୍-ଅପ୍ ବ୍ଲକ୍ ହେଉଛି — ଆପଣଙ୍କ ବ୍ରାଉଜରରେ ଅଲଗା ଟ୍ୟାବ୍ ଖୋଲନ୍ତୁ।',
  'attach.button': 'ଆପଣଙ୍କ ଡକ୍ୟୁମେଣ୍ଟ କିମ୍ବା ଫଟୋ ଯୋଡ଼ନ୍ତୁ',
  'attach.formats': 'PDF, ଫଟୋ (JPG/PNG) କିମ୍ବା ଟେକ୍ସଟ୍ ଫାଇଲ — ୧୨ MB ପର୍ଯ୍ୟନ୍ତ',
  'attach.reading': 'ପଢ଼ୁଛି…',
  'attach.attached': 'ଲଗାଇ ଦିଆଗଲା',
  'attach.remove': 'ହଟାନ୍ତୁ',
  'attach.tooBigPdf': 'ଏହି PDF ଟି 12 MB ରୁ ବଡ଼ ଅଟେ। ଦୟାକରି ଏକ ଛୋଟ ଫାଇଲ ବାଛନ୍ତୁ।',
  'attach.tooBigImage': 'ଏହି ଫଟୋଟି 3 MB ରୁ ବଡ଼ ଅଟେ। ଦୟାକରି ଏକ ଛୋଟ ଫଟୋ ବାଛନ୍ତୁ।',
  'attach.scannedPdf': 'ଏହି PDF ଟି ସ୍କାନ କରାଯାଇଛି — ଏଥିରେ କେବଳ ଚିତ୍ର ଅଛି, ଏହାକୁ ପଢ଼ି ହେବ ନାହିଁ। ଦୟାକରି ଏହାର ଫଟୋ ପଠାନ୍ତୁ।',
  'attach.pdfFailed': 'ଏହି PDF ଟି ପଢ଼ି ହେଲା ନାହିଁ।',
  'attach.imageFailed': 'ଏହି ଫଟୋଟି ଲୋଡ୍ ହେଲା ନାହିଁ।',
  'attach.wrongType': 'ଏହି ଫାଇଲଟି କାମ କରିବ ନାହିଁ। ଦୟାକରି PDF, ଫଟୋ କିମ୍ବା ଟେକ୍ସଟ୍ ଫାଇଲ ପଠାନ୍ତୁ।',
  'attach.hint': 'ଆପଣଙ୍କ କାଗଜ ଏଠାରେ ଦେଇ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ — ଆମେ ସେଥିରୁ ହିଁ ଉତ୍ତର ଦେବୁ।',
  'ask.sendWithFile': 'ଉତ୍ତର ଦରକାର',
  'lib.title': 'ମାଗଣା ପୁସ୍ତକାଳୟ',
  'lib.intro': 'ପଢ଼ିବା ବହି, ପୁସ୍ତକ, ଚିତ୍ର ଏବଂ ଅଡିଓ — ସବୁ ମାଗଣା ଏବଂ ଆଇନଗତ ଭାବେ।',
  'lib.legalTitle': 'କପିରାଇଟର କୌଣସି ଚିନ୍ତା ନାହିଁ।',
  'lib.legal': 'ଏଠାରେ ଯାହା ଦିଆଯାଇଛି, ତାହା ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା ଏବଂ ଆପଣ ଏହାକୁ ଆଗକୁ ମଧ୍ୟ ବାଣ୍ଟି ପାରିବେ। ଯେଉଁ ବହି ଏବେ କପିରାଇଟ୍ ଅଧୀନରେ ଅଛି, ତାହା ଏଠାରେ ରହିବ ନାହିଁ — ତାହାକୁ ଆପଣ କପି କରିପାରିବେ ନାହିଁ, ଏହା ସ୍ପଷ୍ଟ ଭାବେ କହିବା ଜରୁରୀ।',
  'ask.signInFirst': 'ପ୍ରଥମେ ଲଗ୍ ଇନ୍ କରନ୍ତୁ, ତା\'ପରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।',
  'ask.signInTitle': 'ପ୍ରଥମେ ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
  'ask.signInBody': 'ପ୍ରଶ୍ନ ପଚାରିବା ପାଇଁ ନିଜର ଆକାଉଣ୍ଟ ତିଆରି କରନ୍ତୁ। ଏଥିପାଇଁ ଏକ ମିନିଟରୁ କମ୍ ସମୟ ଲାଗିବ, ଏବଂ ଆପଣ ପଚାରି ପାରିବେ।',
  'ask.signInCta': 'ଆକାଉଣ୍ଟ ତିଆରି କରନ୍ତୁ କିମ୍ବା ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
  'ask.signInOr': 'ଏବେ ଆକାଉଣ୍ଟ ତିଆରି କରିପାରୁ ନାହାନ୍ତି? ଏହି କାମ ଆପଣଙ୍କ ବିନା ମଧ୍ୟ ହୋଇଯିବ:',
  'account.title': 'ମୋ ଆକାଉଣ୍ଟ',
  'account.intro': 'ନିଜ ନାମ ଏବଂ ପାସୱାର୍ଡ ଦେଇ ପ୍ରଶ୍ନ ପଚାରିବା ଆରମ୍ଭ କରନ୍ତୁ।',
  'account.signIn': 'ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
  'account.register': 'ଆକାଉଣ୍ଟ ତିଆରି କରନ୍ତୁ',
  'account.signInNote': 'ଗତଥରର ନାମ ଏବଂ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ।',
  'account.registerNote': 'ପ୍ରଶ୍ନ ପଚାରିବା ପାଇଁ ଆକାଉଣ୍ଟ ଜରୁରୀ ନୁହେଁ। ଏହା କେବଳ ଆପଣଙ୍କ ଭାଷା ଏବଂ ଉତ୍ତର ମନେ ରଖିବା ପାଇଁ ଅଟେ।',
  'account.handle': 'ଆପଣଙ୍କ ନାମ',
  'account.handlePlaceholder': 'ଯେପରି: sita.ji',
  'account.password': 'ପାସୱାର୍ଡ',
  'account.passwordHint': 'ଅତିକମରେ 6 ଅକ୍ଷର।',
  'account.phone': 'ଫୋନ୍ ନମ୍ବର',
  'account.optional': 'ଜରୁରୀ ନୁହେଁ',
  'account.phoneHint': 'ଦେବାକୁ ଚାହିଁଲେ ଦିଅନ୍ତୁ। ଫୋନ୍ ନମ୍ବର ନଦେଲେ ମଧ୍ୟ ଆକାଉଣ୍ଟ ତିଆରି ହୋଇଯିବ।',
  'account.create': 'ଆକାଉଣ୍ଟ ତିଆରି କରନ୍ତୁ',
  'account.logout': 'ବାହାରକୁ ଆସନ୍ତୁ',
  'account.open': 'ଆକାଉଣ୍ଟ ଖୋଲନ୍ତୁ',
  'account.signedInAs': 'ଆପଣ ଲଗ୍ ଇନ୍ ହୋଇଛନ୍ତି',
  'account.signedOut': 'ଆକାଉଣ୍ଟ ଖୋଲା ନାହିଁ',
  'account.signedOutBody': 'ଏବେ କୌଣସି ଆକାଉଣ୍ଟ ଖୋଲା ନାହିଁ।',
  'account.saved': 'ସେଭ୍ ହୋଇଥିବା ଉତ୍ତର',
  'account.savedEmpty': 'ଏବେ କୌଣସି ଉତ୍ତର ସେଭ୍ ହୋଇନାହିଁ। ଉତ୍ତର ଆସିଲେ \'ସେଭ୍ କରନ୍ତୁ\' ଦବାନ୍ତୁ।',
  'account.savedUnavailable': 'ସେଭ୍ ହୋଇଥିବା ଉତ୍ତର ଏବେ ଦେଖାଯାଉ ନାହିଁ। ବାକି ସବୁ ଚାଲୁଛି।',
  'account.wait': 'ଦୟାକରି ଅପେକ୍ଷା କରନ୍ତୁ…',
  'account.privacyTitle': 'ଆପଣଙ୍କ କଥା ସୁରକ୍ଷିତ',
  'account.privacyBody': 'ଆକାଉଣ୍ଟ ତିଆରି କଲେ କେବଳ ଆପଣଙ୍କ ନାମ, ପାସୱାର୍ଡ ଏବଂ ଭାଷା ରଖାଯାଏ। ପ୍ରଶ୍ନର କୌଣସି ରେକର୍ଡ ରଖାଯାଏ ନାହିଁ। ଆପଣଙ୍କ ପ୍ରଶ୍ନ କାହାକୁ ପଠାଯାଏ ନାହିଁ।',
  'account.errWrong': 'ନାମ କିମ୍ବା ପାସୱାର୍ଡ ଭୁଲ ଅଛି।',
  'account.errTaken': 'ଏହି ନାମଟି ପୂର୍ବରୁ ନିଆସରିଛି। ଅନ୍ୟ ଏକ ନାମ ବାଛନ୍ତୁ।',
  'account.errBad': 'ସୂଚନା ଠିକ୍ ଭାବେ ଭରନ୍ତୁ।',
  'account.errWait': 'ଅନେକ ଥର ଚେଷ୍ଟା କଲେଣି। କିଛି ସମୟ ପରେ ଚେଷ୍ଟା କରନ୍ତୁ।',
  'account.errTryLater': 'ଏବେ ହୋଇପାରିଲା ନାହିଁ। କିଛି ସମୟ ପରେ ଚେଷ୍ଟା କରନ୍ତୁ।',
  'lib.licence.ccBy': 'ଆପଣ ଏହାକୁ କପି ଏବଂ ସେୟାର କରିପାରିବେ, ଛାପି ମଧ୍ୟ ପାରିବେ — କେବଳ ଉତ୍ସର ନାମ ଦେବାକୁ ପଡ଼ିବ।',
  'lib.licence.ccBySa': 'ଆପଣ ଏହାକୁ କପି ଏବଂ ଛାପି ପାରିବେ। ଯେଉଁ ପରିବର୍ତ୍ତନ କରିବେ, ତାହା ମଧ୍ୟ ଖୋଲାଖୋଲି ଭାବେ ଦେବାକୁ ପଡ଼ିବ।',
  'lib.licence.ccZero': 'ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା। ଉତ୍ସର ନାମ ଦେବା ମଧ୍ୟ ଜରୁରୀ ନୁହେଁ।',
  'lib.licence.pd': 'କାହାର କପିରାଇଟ୍ ନାହିଁ — ଯିଏ ଚାହିଁବ କପି କରିପାରିବ।',
  'lib.licence.govtIndia': 'ଭାରତ ସରକାରଙ୍କ ୱେବସାଇଟରେ। ପଢ଼ିବା ଏବଂ ଛାପିବା ଦୁଇଟିଯାକ ମାଗଣା।',
  'lib.licence.creativeCommons': 'ପ୍ରତ୍ୟେକ ଫାଇଲର ନିଜସ୍ୱ ଲାଇସେନ୍ସ ଅଛି — ଫାଇଲରେ ଦେଖନ୍ତୁ।',
  'lib.licence.freeToRead': 'ପଢ଼ିବା ମାଗଣା। କପି କରି ଆଗକୁ ଦେବା ମଧ୍ୟ ସେହି ସର୍ତ୍ତରେ ଅଟେ ଯେଉଁଥିରେ ଏହା ମିଳିଛି।',
  'lib.openBadge': 'ଖୋଲା',
  'lib.openBadgeNote': 'ଏହାକୁ କପି କରିପାରିବେ',
  'lib.freeBadge': 'ମାଗଣା',
  'lib.freeBadgeNote': 'ପଢ଼ିପାରିବେ, କପି କରିପାରିବେ ନାହିଁ',
  'lib.govt': 'ସରକାରୀ',
  'lib.noSignup': 'ବିନା ଆକାଉଣ୍ଟରେ',
  'lib.open': 'ଏଠାରେ ଖୋଲନ୍ତୁ',
  'lib.group.padhai': 'ପାଠପଢ଼ା ବହି',
  'lib.group.padhai.note': 'ସ୍କୁଲ, କଲେଜ ଏବଂ ସରକାରୀ ଶିକ୍ଷା ସାମଗ୍ରୀ',
  'lib.group.kitab': 'ବହି',
  'lib.group.kitab.note': 'ଯେଉଁଗୁଡ଼ିକ ଉପରେ କପିରାଇଟ୍ ନାହିଁ କିମ୍ବା କପି କରିବାକୁ ଅନୁମତି ଅଛି',
  'lib.group.tasveer': 'ଫଟୋ ଏବଂ ଚିତ୍ର',
  'lib.group.tasveer.note': 'ନକ୍ସା, ଫଟୋ, ଚିହ୍ନ — ସବୁକିଛି',
  'lib.group.audio': 'ଶୁଣିବା ଯୋଗ୍ୟ ସାମଗ୍ରୀ',
  'lib.group.audio.note': 'ବହି ଶୁଣିବା ପାଇଁ, ପଢ଼ିବା ପାଇଁ ନୁହେଁ',
  'lib.warnTitle': 'ସବୁ ବହି ଏଠାରେ ନାହିଁ',
  'lib.warn': 'କିଛି ବହି ଏବେ କପିରାଇଟ୍ ଅଧୀନରେ ଅଛି ଏବଂ ଆଇନ ଅନୁସାରେ ସେଗୁଡ଼ିକୁ ମାଗଣାରେ ଦିଆଯାଇପାରିବ ନାହିଁ। ଆମେ ଜାଣିଶୁଣି ସେଗୁଡ଼ିକୁ ଦେଖାଉନାହୁଁ। ଯଦି କୌଣସି ବହି ଦରକାର, ତେବେ ତଳେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ — ଯେଉଁ ଉତ୍ତର ମିଳିପାରିବ, ତାହା ମିଳିଯିବ।',
  'lib.askInstead': 'ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
  'nav.library': 'ପୁସ୍ତକାଳୟ',
  'support.contactMessageLabel': 'ଆପଣଙ୍କ କଥା',
  'support.contactPlaceholder': 'ଯାହା ଲେଖିବାକୁ ଚାହୁଁଛନ୍ତି ଲେଖନ୍ତୁ — ଯଦି କିଛି ଭୁଲ୍ ଥାଏ, କିଛି ଭଲ ମିଳିଥାଏ, କିମ୍ବା କୌଣସି ପ୍ରଶ୍ନ ଥାଏ।',
  'support.contactHelp': 'ଅତି କମରେ ୧୦ଟି ଅକ୍ଷର। ଏହା ସିଧା ମାଲିକଙ୍କ ପାଖକୁ ଯାଏ।',
  'support.contactSubmit': 'ପଠାନ୍ତୁ',
  'support.contactSending': 'ପଠାଉଛୁ…',
  'support.contactPrivacy': 'ଆପଣଙ୍କ ନାମ ଲେଖିବା ଜରୁରୀ ନୁହେଁ।',
  'support.contactSent': 'ପହଞ୍ଚିଗଲା',
  'support.contactSentBody': 'ଆପଣଙ୍କ କଥା ମାଲିକଙ୍କ ପାଖରେ ପହଞ୍ଚିଯାଇଛି।',
  'support.contactFailed': 'ପଠାଯାଇ ପାରିଲା ନାହିଁ',
  'support.faq1Q': 'ଏହା କଣ ସତରେ ମାଗଣା?',
  'support.faq1A': 'ହଁ। କୌଣସି ପଇସା ନିଆଯାଏ ନାହିଁ, କୌଣସି ବିଜ୍ଞାପନ ଦେଖାଯାଏ ନାହିଁ, ଏବଂ କୌଣସି ସଦସ୍ୟତା ନିଆଯାଏ ନାହିଁ। ଏହା ଜଣେ ବ୍ୟକ୍ତିଙ୍କ ପଇସାରେ ଚାଲେ, କୌଣସି କମ୍ପାନୀ କିମ୍ବା ସରକାରଙ୍କ ପଇସାରେ ନୁହେଁ।',
  'support.faq2Q': 'ମୋର ନାମ, ଠିକଣା କିମ୍ବା ଫୋନ୍ ନମ୍ବର କଣ ନିଆଯାଏ?',
  'support.faq2A': 'ନା, ଏବଂ ଏହା କେବେବି ନିଆଯିବ ନାହିଁ। ଏହି ସାଇଟ୍ ନିଜେ କୌଣସି ପରିଚୟ ସୃଷ୍ଟି କରେ ନାହିଁ — କୌଣସି ଲଗଇନ୍ ନାହିଁ, କୌଣସି ଟ୍ରାକିଂ ସ୍କ୍ରିପ୍ଟ ନାହିଁ। କେବଳ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପଚରାଯାଏ।',
  'support.faq3Q': 'ଏହା କଣ ଡାକ୍ତର କିମ୍ବା ଓକିଲ?',
  'support.faq3A': 'ନା। ଏହା କୌଣସି ଔଷଧ ପରାମର୍ଶ କିମ୍ବା ଆଇନଗତ ପରାମର୍ଶ ଦିଏ ନାହିଁ। ଯେଉଁଠାରେ କଥା ଗମ୍ଭୀର, ସେଠାରେ ଏହା ଆପଣଙ୍କୁ ଡାକ୍ତର କିମ୍ବା ଅଧିକାରୀଙ୍କ ପାଖକୁ ଯିବାକୁ କହିଥାଏ — ଏହା ସେମାନଙ୍କ ସ୍ଥାନ ନେଇପାରିବ ନାହିଁ।',
  'support.faq4Q': 'ସବୁ ଉତ୍ତର କଣ ସଠିକ୍ ହୋଇଥାଏ?',
  'support.faq4A': 'ସବୁବେଳେ ନୁହେଁ। ଉତ୍ତର ଏକ କମ୍ପ୍ୟୁଟର ଲେଖିଥାଏ, କୌଣସି ଡାକ୍ତର ନୁହେଁ — ତେଣୁ ପ୍ରତ୍ୟେକ ଉତ୍ତର ସହିତ ଲେଖାଥାଏ ଯେ ଏହା ଚିକିତ୍ସା ପରାମର୍ଶ ନୁହେଁ। କୌଣସି ଔଷଧ ଆରମ୍ଭ କରିବା କିମ୍ବା ବନ୍ଦ କରିବା ପୂର୍ବରୁ ଡାକ୍ତରଙ୍କୁ ନିଶ୍ଚୟ ଭେଟନ୍ତୁ।',
  'support.faq5Q': 'ମୋତେ କଣ କୌଣସି ଆପ୍ ଡାଉନଲୋଡ୍ କରିବାକୁ ହେବ?',
  'support.faq5A': 'ନା। ଏହା କେବଳ ବ୍ରାଉଜରରେ ଖୋଲିଥାଏ। କୌଣସି ଆପ୍ ଇନଷ୍ଟଲ୍ କରିବାକୁ ପଡ଼ିବ ନାହିଁ, କୌଣସି ଅନୁମତି ଦରକାର ନାହିଁ, କୌଣସି ଅପଡେଟ୍ ନାହିଁ।',
  'nav.remedies': 'ଘରୋଇ ଉପଚାର',
  'remedy.title': 'ଆୟୁର୍ବେଦିକ ଘରୋଇ ଉପଚାର',
  'remedy.intro': 'ଯେଉଁ କଷ୍ଟ ହେଉଥିଲେ ବି — କାଶ, ମୁଣ୍ଡବିନ୍ଧା, ଗଣ୍ଠିବାତ, ଚର୍ମ ରୋଗ, ମଧୁମେହ, ପିଠି ଦରଜ — ତଳେ ନିଜର କଷ୍ଟ ବାଛନ୍ତୁ କିମ୍ବା ନିଜ ଭାଷାରେ ପଚାରନ୍ତୁ। ଘରୋଇ କାଢ଼ା, ମାଲିସ, ଖାଦ୍ୟପେୟ ଏବଂ ଆୟୁର୍ବେଦିକ ଉପାୟ କୁହାଯିବ।',
  'remedy.choose': 'ନିଜର କଷ୍ଟ ବାଛନ୍ତୁ',
  'remedy.emergencyStrong': 'ଏଗୁଡ଼ିକ ଜରୁରୀକାଳୀନ ଅବସ୍ଥା:',
  'remedy.emergency': 'ସାପ କାମୁଡ଼ିବା, ବିଛା କାମୁଡ଼ିବା ଏବଂ କୁକୁର କାମୁଡ଼ିବା — ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ, ପ୍ରଥମେ 112 ନମ୍ବରରେ ଫୋନ୍ କରନ୍ତୁ। ଘରୋଇ ଉପାୟ କେବଳ ବାଟରେ କରିବା ପାଇଁ, ଡାକ୍ତରଖାନାର ବିକଳ୍ପ ନୁହେଁ।',
  'remedy.note': 'ଘରୋଇ ଏବଂ ଆୟୁର୍ବେଦିକ ଉପାୟ କଷ୍ଟ କମ କରିବାରେ ସାହାଯ୍ୟ କରେ; ଏହା ଡାକ୍ତରୀ ପରୀକ୍ଷା ଏବଂ ଚିକିତ୍ସାର ବିକଳ୍ପ ନୁହେଁ। କୌଣସି ଔଷଧ ନିଜେ ବନ୍ଦ କିମ୍ବା ଆରମ୍ଭ କରନ୍ତୁ ନାହିଁ।',
  'remedy.cough': 'କାଶ',
  'remedy.headache': 'ମୁଣ୍ଡବିନ୍ଧା',
  'remedy.joints': 'ଗଣ୍ଠିବାତ',
  'remedy.itching': 'ଚର୍ମ ରୋଗ',
  'remedy.snake': 'ସାପ କାମୁଡ଼ିବା',
  'remedy.scorpion': 'ବିଛା କାମୁଡ଼ିବା',
  'remedy.dog': 'କୁକୁର କାମୁଡ଼ିବା',
  'remedy.diabetes': 'ମଧୁମେହ',
  'remedy.back': 'ପିଠି ଦରଜ',
  'remedy.walking': 'ଚାଲିବାରେ କଷ୍ଟ',
  'home.remedyNote': 'କାଢ଼ା, ମାଲିସ, ଖାଦ୍ୟପେୟ ଏବଂ ଆୟୁର୍ବେଦିକ ଉପାୟ — ପ୍ରତ୍ୟେକ କଷ୍ଟ ପାଇଁ, ଆପଣଙ୍କ ଭାଷାରେ।',
  'nav.aarti': 'ଆରତୀ ଓ ଭଜନ',
  'aarti.title': 'ଆରତୀ ଓ ଭଜନ — ପ୍ରକୃତ କଣ୍ଠରେ',
  'aarti.intro': 'ଏଠାରେ ଆରତୀ, କୀର୍ତ୍ତନ ଏବଂ ଭଜନ ଶୁଣନ୍ତୁ — ପ୍ରକୃତ ଗାୟକ ଓ ମନ୍ଦିରର କଣ୍ଠରେ। କୌଣସି AI କଣ୍ଠ ନୁହେଁ।',
  'aarti.note': 'କମ୍ପ୍ୟୁଟର କଣ୍ଠରେ ଆରତୀ ବା ଭଜନ ଶୁଣାଇବା ଦ୍ୱାରା ତାର ଭାବ ଏବଂ ଭକ୍ତି ନଷ୍ଟ ହୋଇଯାଏ। ସେଥିପାଇଁ ଏଠାରେ କେବଳ ପ୍ରକୃତ ରେକର୍ଡିଂ ରହିଛି।',
  'aarti.kindAarti': 'ଆରତୀ',
  'aarti.kindKirtan': 'କୀର୍ତ୍ତନ',
  'aarti.kindBhajan': 'ଭଜନ',
  'aarti.credit': 'ରେକର୍ଡିଂ:',
  'aarti.licence': 'ଲାଇସେନ୍ସ:',
  'aarti.listenLink': 'ପ୍ରକୃତ କଣ୍ଠରେ ଶୁଣନ୍ତୁ',
  'aarti.textChecked': 'ଏହା ଏକ ପାରମ୍ପରିକ ପାଠ, ଯେପରି ପ୍ରକୃତ ରେକର୍ଡିଂରେ ଗାୟନ କରାଯାଇଛି।',
  'aarti.textPrinted': 'ଏହା ଏକ ପ୍ରଚଳିତ ପାଠ, ପ୍ରକାଶିତ ସଂଗ୍ରହଗୁଡ଼ିକ ସହିତ ମିଳାଇ ଯାଞ୍ଚ କରାଯାଇଛି।',
  'aarti.textNotStored': 'ଏହି ଗ୍ରନ୍ଥର ସମ୍ପୂର୍ଣ୍ଣ ପାଠ ଏଠାରେ ସଂଗ୍ରହ କରାଯାଇ ନାହିଁ — ତଳେ ରେକର୍ଡିଂରେ ସମ୍ପୂର୍ଣ୍ଣ ପାଠ ବାଜୁଛି।',
  'aarti.granthTitle': 'ଗ୍ରନ୍ଥ, ଚାଳିଶା ଏବଂ ସ୍ତୋତ୍ର — ପ୍ରକୃତ କଣ୍ଠରେ',
  'aarti.noRecording': 'ଏହି ଆରତୀର ପ୍ରକୃତ ରେକର୍ଡିଂ ବର୍ତ୍ତମାନ ସାଇଟ୍‌ରେ ନାହିଁ, ତେଣୁ ମୁଁ ଏହାକୁ ଗାଇ ଶୁଣାଇ ପାରିବି ନାହିଁ — AI କଣ୍ଠରେ କେବେ ମଧ୍ୟ ଆରତୀ ଗାଏ ନାହିଁ।',
  'aarti.textOnlyTitle': 'ଅନ୍ୟାନ୍ୟ ଆରତୀ — ପାଠ ମଧ୍ୟ, ପ୍ରକୃତ କଣ୍ଠ ମଧ୍ୟ',
  'aarti.fullText': 'ସମ୍ପୂର୍ଣ୍ଣ ପାଠ',
  'aarti.notChecked': 'ଏହି ଆରତୀର ଯାଞ୍ଚ ହୋଇଥିବା ପାଠ ବର୍ତ୍ତମାନ ସାଇଟ୍‌ରେ ନାହିଁ। ବିନା ଯାଞ୍ଚରେ ପାଠ ଦେବା ଠିକ୍ ନୁହେଁ, ତେଣୁ ତାହା ଦିଆଯାଉ ନାହିଁ।',
  'aarti.verifiedList': 'ସାଇଟ୍‌ରେ ଏହି ଆରତୀଗୁଡ଼ିକର ଯାଞ୍ଚ ହୋଇଥିବା ପାଠ ରହିଛି:',

};

/* -------------------------------------------------------------------------- */
/* NEPALI                                                                    */
/* -------------------------------------------------------------------------- */

const NEPALI: Record<string, string> = {
  'jgd.placeSearch': 'सहरको नाम लेख्नुहोस्',
  'jgd.placeNoMatch': 'यो सहर सूचीमा छैन। यसको नजिकको सहर छान्नुहोस्।',
  'account.name': 'तपाईंको नाम',
  'account.namePlaceholder': 'जस्तै: सीता देवी',
  'account.nameHint': 'यो तपाईंको पहिचानको लागि हो। कुनै पनि नाम राख्न सक्नुहुन्छ, र यो अनिवार्य छैन।',
  'nav.home': 'गृहपृष्ठ',
  'home.metaTitle': 'निःशुल्क समाधान, तपाईंको आफ्नै शब्दमा',
  'lib.licence.ccZero.name': 'CC0 / सार्वजनिक डोमेन',
  'lib.licence.pd.name': 'सार्वजनिक डोमेन',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिभ कमन्स (मिश्रित)',
  'lib.licence.freeToRead.name': 'पढ्नको लागि स्वतन्त्र',
  'lib.entry.ncert.title': 'NCERT किताबहरू — कक्षा १ देखि १२ सम्म',
  'lib.entry.ncert.what': 'हरेक विषयका सबै किताबहरू, अहिले हरेक कक्षाको लागि। लगइन बिना, सिधै PDF।',
  'lib.entry.ncert.langs': 'हिन्दी, अङ्ग्रेजी र ३० भन्दा बढी भारतीय भाषाहरू',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल पाठ्यपुस्तक',
  'lib.entry.pm-evidya.what': 'NCERT को किताबहरूको एप, ठूला अक्षरमा पढ्न सकिन्छ। बोलेको पनि सुन्न सकिन्छ।',
  'lib.entry.pm-evidya.langs': 'भारतीय भाषाहरू',
  'lib.entry.diksha.title': 'DIKSHA — शिक्षक र बालबालिकाको लागि',
  'lib.entry.diksha.what': 'पाठ्यक्रम, भिडियो र अभ्यास — कक्षा १ देखि १२ सम्म।',
  'lib.entry.diksha.langs': 'भारतीय भाषाहरू',
  'lib.entry.khan-academy.title': 'Khan Academy — अङ्ग्रेजीमा गणित र विज्ञान',
  'lib.entry.khan-academy.what': 'भिडियो पाठ, हरेक कक्षाको लागि। सिधै पढ्नेहरूका लागि लिखित सामग्री पनि छ।',
  'lib.entry.openstax.title': 'OpenStax — अङ्ग्रेजीमा निःशुल्क किताबहरू',
  'lib.entry.openstax.what': 'कलेज स्तरका किताबहरू — गणित, विज्ञान, मानविकी। हरेक पानामा PDF।',
  'lib.entry.nios.title': 'NIOS — दूरस्थ शिक्षा, निःशुल्क सामग्री',
  'lib.entry.nios.what': 'ओपन र अनलाइन कोर्सका निःशुल्क पुस्तिका, भर्ना बिना नै।',
  'lib.entry.nios.langs': 'हिन्दी, अङ्ग्रेजी र अन्य',
  'lib.entry.ignou.title': 'IGNOU — ठूला स्कूलका निःशुल्क पुस्तकहरू',
  'lib.entry.ignou.what': 'दूरस्थ शिक्षाका किताबहरू जुन बिल्कुल निःशुल्क पाइन्छन्।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — अङ्ग्रेजीका पुराना किताबहरू',
  'lib.entry.gutenberg.what': '७०,००० भन्दा बढी किताबहरू, सबैको प्रतिलिपि अधिकार समाप्त। निःशुल्क ई-बुक र अडियो।',
  'lib.entry.pratham-books.title': 'Pratham Books — बालबालिकाका किताबहरू',
  'lib.entry.pratham-books.what': 'भारतीय भाषाहरूमा बालबालिकाका किताबहरू, बिल्कुल निःशुल्क। कक्षा १ देखि ५ को लागि।',
  'lib.entry.pratham-books.langs': 'हिन्दी, मराठी, बङ्गाली, तमिल, तेलुगु र अन्य',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — अखबार र पुराना पत्रिकाहरू',
  'lib.entry.internet-archive-texts.what': 'लाखौं पुराना किताबहरू, पत्रिकाहरू र अखबारहरू — निःशुल्क।',
  'lib.entry.wikisource.title': 'Wikisource — जन-गद्य पाठ',
  'lib.entry.wikisource.what': 'कुनै प्रतिलिपि अधिकार छैन — यी संसारका पुराना साहित्यिक किताबहरू हुन्।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — हरेक तस्बिर',
  'lib.entry.wikimedia-commons.what': 'उपजाति, नक्सा, तारा, इतिहास — सबै कुरा। हरेक तस्बिरमा छुट्टै लाइसेन्स लेखिएको छ।',
  'lib.entry.pixabay.title': 'Pixabay — तस्बिर र चित्रहरू',
  'lib.entry.pixabay.what': 'तस्बिरहरू, रेखाचित्र र छोटो भिडियोहरू।',
  'lib.entry.unsplash.title': 'Unsplash — सुन्दर तस्बिरहरू',
  'lib.entry.unsplash.what': 'निःशुल्क, ठूला अक्षरमा, खाता नखोली।',
  'lib.entry.openverse.title': 'Openverse — सबै तस्बिरहरू एकै ठाउँमा',
  'lib.entry.openverse.what': 'धेरै निःशुल्क तस्बिरहरू भएका साइटहरू एकै पटक खोज्नुहोस्।',
  'lib.entry.librivox.title': 'LibriVox — सुनेर पढ्ने किताबहरू',
  'lib.entry.librivox.what': 'पुराना अङ्ग्रेजी किताबहरूको निःशुल्क अडियो, मानिसको आवाजमा।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — अडियो सङ्ग्रह',
  'lib.entry.internet-archive-audio.what': 'हजारौं निःशुल्क अडियो — किताबहरू, भाषण, सङ्गीत।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राष्ट्रिय गान र गीतहरू',
  'lib.entry.vande-mataram.what': 'भारतको राष्ट्रिय गान र अन्य राष्ट्रिय गीतहरू, निःशुल्क।',
  'art.aag-aur-bijli-ke-bachav.title': 'आगो र बिजुलीबाट बच्ने नियमहरू',
  'art.aag-aur-bijli-ke-bachav.summary': 'घरमा आगो लाग्नबाट जोगाउने — सरल नियमहरू',
  'art.aag-lagne-par-kya-karein.title': 'आगो लाग्यो भने के गर्ने',
  'art.aag-lagne-par-kya-karein.summary': 'जलिरहेको घरमा आगो — सबैभन्दा पहिले के गर्ने, के नगर्ने',
  'art.bimari-se-bachav.title': 'संक्रमणबाट बच्ने सातवटा नियम',
  'art.bimari-se-bachav.summary': 'हात धुने, मास्क, खोप — आदिको माध्यमबाट बचावट',
  'art.dhuwan-ka-jhakora.title': 'धολो र धुवाँको प्रदूषणबाट बचावट',
  'art.dhuwan-ka-jhakora.summary': 'श्वास फेर्न गाह्रो भयो, सास चलेको छैन — के गर्ने, कहिले अस्पताल जाने',
  'art.doodh-pani-band-ho.title': 'बिजुली वा पानी अचानक बन्द भएमा',
  'art.doodh-pani-band-ho.summary': 'के गर्ने, कोसँग जोगिने, कहिले मद्दत माग्ने',
  'art.haath-ki-saafai.title': 'साबुनबिना हात सफा गर्ने तरिका',
  'art.haath-ki-saafai.summary': 'जब पानी वा साबुन हुँदैन',
  'cat.dhyan-aur-yoog.title': 'ध्यान र योग',
  'cat.dhyan-aur-yoog.subtitle': 'मन शान्त गर्ने सरल उपायहरू',
  'cat.gharelu-marammat.title': 'घरेलु मर्मत',
  'cat.gharelu-marammat.subtitle': 'घरका सानातिना समस्याहरूको समाधान',
  'cat.bachchon-ki-padhai.title': 'बालबालिकाको पढाइ',
  'cat.bachchon-ki-padhai.subtitle': 'पढाइमा अल्झिएका वा चिन्तित भएमा',
  'cat.budharge-seva.title': 'जेष्ठ नागरिक सेवा',
  'cat.budharge-seva.subtitle': 'हेरचाह र सहयोग',
  'cat.shishu-dekhbhal.title': 'शिशु हेरचाह',
  'cat.shishu-dekhbhal.subtitle': 'साना नानीहरूको सहि हेरचाह',
  'cat.dharmik-upay.title': 'धार्मिक उपाय',
  'cat.dharmik-upay.subtitle': 'मनको शान्तिका साथ',
  'cat.pavan-grah-aur-aarti.title': 'पवित्र ग्रन्थ र आरती',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धापूर्वक पढ्नुहोस् र सुन्नुहोस्',
  'cat.aapatkalen-gayide.title': 'आपत्कालीन गाइड',
  'cat.aapatkalen-gayide.subtitle': 'जब तुरुन्तै मद्दत चाहिन्छ',
  'cat.mahamari-suraksha.title': 'महामारी सुरक्षा',
  'cat.mahamari-suraksha.subtitle': 'रोग फैलिनबाट बचावट',
  'nav.tribute': 'स्मृति',
  'nav.help': 'सहायता',
  'nav.reference': 'सन्दर्भ',
  'nav.reviews': 'सल्लाह',
  'nav.support': 'मद्दत गर्नुहोस्',
  'nav.birthChart': 'चिना',
  'jgd.title': 'तपाईंको चिना',
  'jgd.intro': 'आफ्नो नाम, जन्म मिति, र सम्भव भए जन्मको समय र ठाउँ लेख्नुहोस्। सबै हिसाब तपाईंको फोनमै हुनेछ — कुनै पनि कुरा कतै पठाइँदैन।',
  'jgd.nameLabel': 'जन्मको नाम',
  'jgd.namePlaceholder': 'जस्तै पूरा नाम',
  'jgd.nameHint': 'बचतमा राखिएको नाम नै लेख्नुहोस्।',
  'jgd.dateLabel': 'जन्म मिति',
  'jgd.timeLabel': 'जन्मको समय',
  'jgd.timeHint': 'थाहा छैन भने खाली छाड्नुहोस्।',
  'jgd.placeLabel': 'जन्मस्थान',
  'jgd.placeNone': 'थाहा छैन / छान्नुहोस्',
  'jgd.placeHint': 'जन्म भएको सहर छान्नुहोस्।',
  'jgd.submit': 'हिसाब गर्नुहोस्',
  'jgd.savePdf': 'PDF बनाउनुहोस्',
  'jgd.again': 'नयाँ गणना',
  'jgd.errDate': 'कृपया जन्म मिति सहि लेख्नुहोस्।',
  'jgd.errPlace': 'सूचीबाट जन्मस्थानको सहर छान्नुहोस्, वा नजिकैको सहर छान्नुहोस्।',
  'jgd.numTitle': 'अंक ज्योतिष',
  'jgd.lifePath': 'जीवन मार्ग',
  'jgd.nameNumber': 'नाम अंक',
  'jgd.soulNumber': 'आत्मा अंक',
  'jgd.birthdayNumber': 'जन्मदिन अंक',
  'jgd.astroTitle': 'वैदिक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'पद',
  'jgd.rashi': 'राशि',
  'jgd.rashiLord': 'राशि स्वामी',
  'jgd.nakshatraLord': 'नक्षत्र स्वामी',
  'jgd.lagna': 'लग्न',
  'jgd.lagnaMissing': 'लग्न निकाल्नका लागि जन्मको समय र स्थान चाहिन्छ। माथि भरेर गणना गर्नुहोस्, र थाहा छैन भने यति नै पनि धेरै हो।',
  'jgd.gunTitle': 'गुण मिलान',
  'jgd.gunIntro': 'दोस्रो व्यक्तिको नाम र जन्ममिति भर्नुहोस्।',
  'jgd.gunName': 'उसको नाम',
  'jgd.gunDate': 'उसको जन्ममिति',
  'jgd.gunHint': 'दुवैको नाम र जन्ममिति भएमा गुण मिलान निस्कनेछ।',
  'jgd.disclaimer': 'यो परम्परा अनुसार गरिएको गणना हो, भविष्यवाणी होइन। कुनै संख्या वा राशिले कसैको स्वास्थ्य, धन वा सम्बन्ध तय गर्दैन। ठूला निर्णयहरू डाक्टर, कानुनी सल्लाह वा अनुभवीको सल्लाह लिएर गर्नुहोस्।',
  'nav.menu': 'मेनु',
  'nav.openMenu': 'मेनु खोल्नुहोस्',
  'nav.closeMenu': 'मेनु बन्द गर्नुहोस्',
  'nav.expand': 'खोल्नुहोस्',
  'nav.collapse': 'बन्द गर्नुहोस्',
  'nav.skip': 'सिधै सामग्रीमा जानुहोस्',
  'nav.language': 'भाषा परिवर्तन गर्नुहोस्',
  'footer.pages': 'पृष्ठहरू',
  'footer.helplines': 'जरूरी नम्बरहरू',
  'footer.free': 'यो सेवा पूर्ण रूपमा निःशुल्क छ। कसैसँग कुनै पैसा लिइँदैन।',
  'footer.readStory': 'उहाँको पूर्ण कथा पढ्नुहोस्',
  'footer.admin': 'प्रबन्धक',
  'footer.rights': 'निःशुल्क सेवा',
  'footer.emergency': 'आकस्मिक सेवा',
  'footer.ambulance': 'एम्बुलेन्स',
  'footer.women': 'महिला हेल्पलाइन',
  'home.dedication1': 'को स्मृतिमा — एक पूर्ण रूपमा निःशुल्क सेवा।',
  'home.dedication2': 'आफ्नो समस्या लेख्नुहोस् वा बोल्नुहोस्।',
  'home.emergencyTitle': 'जरूरी — तुरुन्त मद्दत चाहिन्छ',
  'home.emergencyNote': 'यी सबैभन्दा पहिले पढ्नुहोस्। बाँकी सबै पछि हेर्न सकिन्छ।',
  'home.readMore': 'पूर्ण जानकारी पढ्नुहोस्',
  'home.chooseTopic': 'कुन विषयमा जान्न चाहनुहुन्छ?',
  'home.memorialEyebrow': 'यो साइट कसका लागि हो',
  'home.memorialLine': 'जसले समाजका लागि जीवनभर लडाइँ लडे, र जसले अन्त्यमा आफ्नो भागको हिसाब पाएनन्।',
  'home.memorialMore': 'उहाँहरूको पूर्ण कथा पढ्नुहोस्',
  'home.kundaliTitle': 'जन्म कुण्डली',
  'home.kundaliNote': 'पूर्ण कुण्डली — ९ ग्रह, विमशोत्तरी दशा, फलादेश, योग, षोडशवर्ग, केपी, लाल किताब र अंक ज्योतिष। सबै तपाईंको फोनमै गणना हुनेछ।',
  'home.chooseTopicNote': 'तल दिइएको विषयमा ट्याप गर्नुहोस्। हरेक ठाउँमा सरल भाषामा जानकारी दिइएको छ।',
  'home.askHere': 'यही विषयमा सोध्नुहोस्',
  'home.categoryEmpty': 'यस विषयमा अहिले केही लेखिएको छैन।',
  'home.soundTitle': 'शान्तिका लागि ध्वनि',
  'home.soundIntro': 'कुनै शुल्क छैन, कुनै विज्ञापन छैन। केवल मन शान्त पार्नका लागि।',
  'home.howTitle': 'यो सेवा कसरी काम गर्छ',
  'home.step1Title': 'आफ्नो कुरा लेख्नुहोस् वा बोल्नुहोस्',
  'home.step1Body': 'हिन्दीमा टाइप गर्नुहोस्, वा माइक थिचेर बोल्नुहोस्। केही विशेष गर्नुपर्दैन — जे मनमा छ त्यही लेखिदिनुहोस्।',
  'home.step2Title': 'तुरुन्त जवाफ पाइन्छ',
  'home.step2Body': 'हरेक प्रश्न दर्ता हुन्छ र त्यसको जवाफ तुरुन्त पाइन्छ। धेरै लामो प्रश्न भन्दा पहिले छोटो प्रश्नबाट सुरु गर्नुहोस्।',
  'home.step3Title': 'कुनै पैसा लाग्दैन, कुनै व्यक्तिगत जानकारी चाहिँदैन',
  'home.step3Body': 'यो सेवा पूर्ण रूपमा निःशुल्क छ। तपाईंको नाम, ठेगाना वा फोन नम्बर मागिँदैन, र कुनै विज्ञापन देखाइँदैन।',
  'home.stepLabel': 'चरण',
  'home.freeTitle': 'यो सेवा पूर्ण रूपमा निःशुल्क छ',
  'home.freeBody': 'कुनै पैसा लिइँदैन, कुनै व्यक्तिगत जानकारी मागिँदैन, र कुनै विज्ञापन देखाइँदैन।',
  'help.q1.label': 'बिजुली गएको छ, के गर्ने?',
  'help.q1.question': 'घरमा बत्ती गएको छ। के गर्ने, र मोबाइल फोन कसरी चार्ज गर्ने?',
  'help.q2.label': 'बच्चाको पढाइमा कमजोरी',
  'help.q2.question': 'मेरो बच्चाको पढाइमा धेरै कमजोरी छ। घरमा कसरी सुधार गर्ने?',
  'help.q3.label': 'बुढापाकाको उपचार',
  'help.q3.question': 'मेरो बुबाको उमेर धेरै भयो, उहाँको उपचार कसरी गर्ने?',
  'help.q4.label': 'घरमा आगो लाग्यो भने',
  'help.q4.question': 'यदि राति घरमा आगो लाग्यो भने सबैभन्दा पहिले के गर्नुपर्छ?',
  'help.title': 'आफ्नो समस्या लेख्नुहोस्',
  'help.intro': 'तल लेख्नुहोस् वा बोल्नुहोस्। थाहा छैन भने मनमा जे आउँछ त्यही लेखिदिनुहोस् — यही सबैभन्दा जरुरी छ।',
  'help.suggested': 'सामान्य प्रश्नहरू',
  'help.howTitle': 'यो सेवा कसरी काम गर्छ',
  'help.howBody': 'हरेक प्रश्न दर्ता हुन्छ र त्यसको जवाफ तुरुन्तै पाइन्छ। तपाईंको नाम, ठेगाना वा फोन नम्बर कतै लिइँदैन। सबै कुरा निःशुल्क छ।',
  'ref.title': 'यो सेवा के हो, र कसका लागि हो',
  'ref.intro': 'यो सेवा श्रीमती VARSHA जीको सम्झनामा बनाइएको हो। यहाँ सरल भाषामा बताइएको छ कि यसले के गर्छ, यसमा के-के छ, र यसका सीमाहरू के हुन्। सबै कुरा बिल्कुल निःशुल्क छ — कुनै पैसा लिइँदैन, कुनै विज्ञापन देखाइँदैन, र कुनै व्यक्तिगत जानकारी मागिँदैन।',
  'ref.whatTitle': 'यसमा के-के छ',
  'ref.what1': 'घरमा आगो लाग्यो, बत्ती गयो, बच्चाको पढाइमा कमजोरी भयो, आमा-बुबाको हेरचाह गर्नुपर्यो — यस्ता सामान्य समस्याहरूको सरल उपाय, सफा भाषामा।',
  'ref.what2': 'प्रश्न बोलेर सोध्ने सुविधा। बोल्न आउँदैन भने लेख्नुहोस् — दुवैको जवाफ एउटै पाइन्छ।',
  'ref.what3': 'हरेक प्रश्न दर्ता हुन्छ, त्यसैले अरूलाई जुन कुराले सताउँछ त्यो तपाईंले सोध्नु अघि नै सोधिसकिएको हुन्छ र त्यसको जवाफ पाइसकिएको हुन्छ।',
  'ref.what4': 'कुनै विज्ञापन छैन, कुनै अनावश्यक सूचना छैन, र कुनै व्यक्तिगत जानकारी मागिँदैन। सबै कुरा निःशुल्क।',
  'ref.helplineTitle': 'तुरुन्त मद्दतका लागि यी नम्बरहरू राख्नुहोस्',
  'ref.helpline1': 'कुनै ठूलो खतरा छ — जस्तै आगो, बिजुलीको झट्का, लड्नु वा धेरै रगत बग्नु — भने 112 मा फोन गर्नुहोस्।',
  'ref.helpline2': 'कसैलाई बिरामी छ वा चोट लागेको छ र जाने कुनै बाटो छैन भने, 108 मा एम्बुलेन्स बोलाउनुहोस्।',
  'ref.helpline3': 'महिलामाथि कुनै नराम्रो काम भएको छ, वा महिलालाई कतैबाट सताइँदै छ भने, 181 मा फोन गर्नुहोस्। यो निःशुल्क छ।',
  'ref.helpline4': 'बच्चा वा बुढापाका माथि कुनै अन्याय भएको छ भने, 1098 मा उजुरी गर्न सकिन्छ।',
  'ref.helpline5': 'मानसिक तनाव धेरै छ, वा बाँच्ने मन छैन भने, 14416 मा कुरा गर्न सकिन्छ। कुरा गर्नका लागि मात्र।',
  'ref.dataTitle': 'हामी तपाईंको बारेमा के राख्छौं',
  'ref.dataBody': 'तपाईंले सोध्नुभएको प्रश्न मात्र, त्यसको सार, र प्रश्न सोधेको समय — ताकि हामी बारम्बार एउटै जवाफ नदिऔं। तपाईंको नाम, ठेगाना, फोन नम्बर, वा कुनै पहिचान खुल्ने जानकारी लिइँदैन। साइटमा कुनै विज्ञापन वा ट्र्याकिङ स्क्रिप्ट राखिएको छैन।',
  'ref.adminTitle': 'प्रबन्धकले के गर्न सक्छन्',
  'ref.adminBody': 'प्रबन्धकले तपाईंले पठाउनुभएका लेखहरू हेर्न सक्छन्, र तिनको जवाफ लेख्न सक्छन्। उनीहरूले तपाईंको अनुमति बिना कुनै लेख परिवर्तन वा हटाउन सक्दैनन्, र तपाईंको जानकारी कसैलाई बेच्न सक्दैनन्।',
  'ref.statsCategories': 'विषयहरू उपलब्ध छन्',
  'ref.statsArticles': 'लेखहरू लेखिएका छन्',
  'ref.statsQuestions': 'प्रश्नहरू सोधिसकिएका छन्',
  'ref.ownerNote': 'यो सेवा कुनै कम्पनीको होइन, कुनै सरकारको होइन, बरु एक व्यक्तिको स्मृतिमा चलाइँदै छ। त्यसैले यहाँ कुनै विज्ञापन छैन, कुनै सदस्यता छैन, र कुनै पैसा लिइँदैन।',
  'support.title': 'यो सेवा निःशुल्क छ',
  'support.intro': 'यो सेवाले कसैसँग पैसा लिँदैन। तर यो चल्छ — त्यसैले केही तरिकाहरू छन् जसबाट तपाईं मद्दत गर्न सक्नुहुन्छ। सबैभन्दा सजिलो तरिका सबैभन्दा कामको छ।',
  'support.waysTitle': 'तपाईं कसरी मद्दत गर्न सक्नुहुन्छ',
  'support.way1Title': 'आफ्नो अनुभव लेख्नुहोस्',
  'support.way1Body': 'यदि यो साइटबाट तपाईंले केही राम्रो पाउनुभयो — वा केही यस्तो पाउनुभयो जसले तपाईंलाई अलमलमा पार्यो — भने राय पेजमा लेखिदिनुहोस्। तपाईंको नाम लिनु जरुरी छैन।',
  'support.way2Title': 'आफ्नो सहरको बारेमा बताउनुहोस्',
  'support.way2Body': 'तपाईं जहाँ बस्नुहुन्छ, त्यहाँको भाषा, रीति-रिवाज र समस्याहरू फरक हुन्छन्। यदि तपाईंको ठाउँको केही कुरा यहाँ छैन भने, बताइदिनुहोस् — थप्न सकिने कुरा थपिनेछ।',
  'support.way3Title': 'आफ्नो अनुभव अरूलाई सुनाउनुहोस्',
  'support.way3Body': 'यहाँ जे लेखिएको छ त्यो धेरै मानिसहरूको काम आउन सक्छ, यदि उनीहरूलाई थाहा भयो भने। यस्तो मद्दत चाहिने व्यक्तिलाई बताउनुहोस्।',
  'support.way4Title': 'यहाँ आएर हेर्नुहोस्',
  'support.way4Body': 'यदि तपाईंसँग समय छ भने, आफैं आएर हेर्नुहोस् कि यो साइट ठीकसँग चलिरहेको छ कि छैन। केही बिग्रिएको देख्नुभयो भने बताउनुहोस् — बिल्कुल निःशुल्क ठीक हुनेछ।',
  'support.contactTitle': 'केही भन्नु छ?',
  'support.contactBody': 'कुनै पनि कुराका लागि यहाँ लेख्न सक्नुहुन्छ — चाहे कुनै गल्ती होस्, चाहे केही बढी पाउनुहोस्, वा कुनै प्रश्न। जति लेख्न सजिलो लाग्छ, त्यति नै लेख्नुहोस्।',
  'support.faqTitle': 'केही कुराहरू जुन बारम्बार सोधिन्छन्',
  'support.faqBody': 'के यो साँच्चै निःशुल्क हो? हो। के तपाईंको नाम लिइन्छ? होइन, नाम दिनु जरुरी छैन। के विज्ञापन आउँछन्? होइन। कुनै फोन नम्बर वा ठेगाना त मागिँदैन? होइन। के कुनै एप डाउनलोड गर्नुपर्छ? होइन, ब्राउजरमै खुल्छ।',
  'ask.label': 'आफ्नो समस्या लेख्नुहोस् वा माइकबाट बोल्नुहोस्',
  'ask.placeholder': 'जस्तै: बच्चाको पढाइमा कमजोरी छ',
  'ask.help': 'इन्टर थिचेर पनि पठाउन सक्नुहुन्छ।',
  'ask.send': 'सोध्नुहोस्',
  'ask.sending': 'सोच्दै छौं…',
  'ask.clear': 'लेखेको मेटाउनुहोस्',
  'ask.speak': 'बोलेर सोध्नुहोस्',
  'ask.listening': 'बोल्न सुरु गर्नुहोस्…',
  'ask.heard': 'सुन्दैछ',
  'ask.stopListening': 'सुन्न बन्द गर्नुहोस्',
  'ask.suggested': 'सामान्य प्रश्नहरू',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'सुन्नुहोस्',
  'ask.stopSpeak': 'रोक्नुहोस्',
  'ask.aiNote': 'यो उत्तर AI ले दिएको हो। यो कुनै विशेषज्ञको सल्लाहको विकल्प होइन।',
  'ask.errorRateLimit': 'एकैपटक धेरै प्रश्नहरू पठाइए। केही समयपछि प्रयास गर्नुहोस्।',
  'ask.errorNetwork': 'इन्टरनेट चलेको छैन। जडान जाँच गरेर फेरि प्रयास गर्नुहोस्।',
  'ask.notAnswer': 'यो प्रश्नको सीधा जवाफ हामीसँग छैन।',
  'ask.emptyAnswer': 'यसपटक जवाफ बन्न सकेन। अलि फरक तरिकाले फेरि सोध्नुहोस्।',
  'ask.micUnsupported': 'यो ब्राउजरमा बोलेर सोध्ने काम गर्दैन। लेखेर सोध्नुहोस्।',
  'ask.heardWith': 'यो सुन्दैछ:',
  'voice.notAllowed': 'माइक्रोफोनको अनुमति पाइएन। माथि गएर अनुमति दिनुहोस्, वा लेखेर सोध्नुहोस्।',
  'voice.serviceNotAllowed': 'माइक्रोफोनको अनुमति पाइएन। माथि गएर अनुमति दिनुहोस्, वा लेखेर सोध्नुहोस्।',
  'voice.noSpeech': 'कुनै आवाज सुनिएन। माइकको नजिक बोलेर वा लेखेर प्रयास गर्नुहोस्।',
  'voice.audioCapture': 'कुनै माइक फेला परेन। यन्त्र जोड्नुहोस्, वा लेखेर सोध्नुहोस्।',
  'voice.network': 'बोलेर सोध्नका लागि इन्टरनेट चाहिन्छ, र त्यो चलेको छैन। लेखेर सोध्नुहोस् — जवाफ त्यही पाइनेछ।',
  'voice.aborted': 'रोकियो। फेरि प्रयास गर्नुहोस्।',
  'voice.unsupported': 'यो ब्राउजरमा बोलेर सोध्ने काम गर्दैन। लेखेर सोध्नुहोस्।',
  'voice.speakFailed': 'यो उत्तर सुनाउन सकिएन।',
  'voice.noVoice': 'यो यन्त्रमा {name} बोल्ने आवाज फेला परेन। अहिले लेखेको पढ्नुहोस्, वा फोनको सेटिङमा गएर आवाज थप्नुहोस्।',
  'voice.generic': 'केही गडबड भयो। फेरि प्रयास गर्नुहोस्।',
  'sound.title': 'शान्तिका लागि ध्वनि',
  'sound.intro': 'कुनै शुल्क छैन, कुनै विज्ञापन छैन। केवल मन शान्त गर्नका लागि।',
  'sound.playing': 'आवाज बजिरहेको छ। रोक्नका लागि फेरि त्यही बटन थिच्नुहोस्।',
  'sound.shankh': 'शंख',
  'sound.shankhHint': 'गहिरो, लामो',
  'sound.bansuri': 'बाँसुरी',
  'sound.bansuriHint': 'कोमल, ढिलो',
  'sound.dhol': 'नगारो',
  'sound.dholHint': 'िख्खो, छिटो',
  'sound.all': 'तीन वटै',
  'sound.allHint': 'एकसाथ',
  'sound.listenLabel': 'सुन्नुहोस्',
  'sound.errUnsupported': 'यो ब्राउजरले ध्वनि बजाउन सकेन।',
  'sound.errGeneric': 'ध्वनि बजाउँदा समस्या भयो।',
  'dhun.welcome': 'स्वागत छ',
  'dhun.prompt': 'शंख, बाँसुरी र नगारो — सँगै सुन्नका लागि छुनुहोस्।',
  'dhun.listen': '▶ सुन्नुहोस्',
  'dhun.skip': 'ध्वनि छोड्नुहोस्',
  'dhun.failed': 'ध्वनि बज्न सकेन।',
  'dhun.label': 'ध्वनि बजाउने अनुमति',
  'reviews.title': 'तपाईँको विचार, तपाईँको कुरा',
  'reviews.intro': 'के यो सेवा तपाईँको काम आयो? आफ्नो कुरा लेख्नुहोस् — तपाईँको नाम दिनैपर्छ भन्ने छैन।',
  'reviews.pageTitle': 'तपाईँको विचार',
  'reviews.pageIntro': 'यहाँ मानिसहरूले लेखेका कुराहरू मात्र राखिएका छन्। कुनै पनि विचार लुकाइँदैन, र जे लेखिएको छ त्यो यहीं देखिन्छ — तर एकचोटि हेरिसकेपछि मात्र प्रकाशित गरिन्छ।',
  'reviews.write': 'आफ्नो विचार लेख्नुहोस्',
  'reviews.submit': 'पठाउनुहोस्',
  'reviews.sending': 'पठाउँदैछ…',
  'reviews.name': 'तपाईँको नाम (आवश्यक छैन)',
  'reviews.city': 'तपाईँको सहर (आवश्यक छैन)',
  'reviews.comment': 'तपाईँको कुरा',
  'reviews.placeholder': 'मनमा आएको कुरा लेख्नुहोस् — केही मिलाइरहनुपर्दैन।',
  'reviews.moderated': 'तपाईंको समीक्षा प्रकाशित हुनु अघि एक पटक जाँच गरिन्छ।',
  'reviews.moderationNote': 'सबै कुरा मेटिन नदिन, प्रकाशित हुनु अघि हरेक समीक्षा एक पटक जाँच गरिन्छ। गाली, नम्बर वा व्यक्तिगत कुराहरू हटाइन्छन् — बाँकी सबै जस्ताको तस्तै प्रकाशित हुन्छन्।',
  'reviews.summaryTitle': 'आम राय',
  'reviews.count': 'समीक्षाहरू',
  'reviews.anonymous': 'नाम बिना',
  'reviews.summaryLine': 'मानिसहरूले औसतमा ५ मध्ये {rating} तारा दिएका छन् — {count} पटक।',
  'reviews.starsLabel': '५ मा {value} तारा',
  'reviews.keepLabel': 'नराम्रो लाग्यो वा राम्रो लाग्यो — दुवै लेख्नुहोस्',
  'reviews.ownerReply': 'जवाफ',
  'reviews.replyLabel': 'यसमा लेखिएको छ',
  'reviews.empty': 'अहिले कुनै समीक्षा छैन। पहिलो समीक्षा तपाईं लेख्नुहोस्।',
  'reviews.toastSent': 'धन्यवाद',
  'reviews.toastFailed': 'राय पठाउन सकिएन',
  'reviews.fieldTooShort': 'कम्तीमा १० अक्षर लेख्नुहोस्।',
  'reviews.rateLimited': 'धेरै छिटो पठाइँदै छ। अलि बेर पर्खेर फेरि प्रयास गर्नुहोस्।',
  'cat.notFound': 'यो पाना भेटिएन',
  'cat.empty': 'यस विषयमा अहिले कुनै लेख छैन।',
  'article.emergency': 'जरूरी',
  'article.askAbout': 'यसै विषयमा सोध्नुहोस्',
  'article.readAloud': 'यो लेख सुन्नुहोस्',
  'article.others': 'यसै विषयका थप लेखहरू',
  'article.count': '{count} लेख',
  'theme.toLight': 'उज्यालो मोडमा जानुहोस्',
  'theme.toDark': 'अध्यारो मोडमा जानुहोस्',
  'toast.dismiss': 'बन्द गर्नुहोस्',
  'language.choose': 'आफ्नो भाषा छान्नुहोस्',
  'language.articlesIn': 'यो लेख हिन्दीमा छ।',
  'language.articlesInHint': 'हरेक भाषामा छुट्टै अनुवाद चाहिन्छ। यो अनुवाद अझै भएको छैन — जे लेखिएको छ त्यो हिन्दीमा नै सही र पूरा छ।',
  'ask.welcome': 'स्वागत छ! तल आफ्नो समस्या लेख्नुहोस् वा कुनै विषय छान्नुहोस्।',
  'ref.notTitle': 'यसले के गर्दैन',
  'ref.not1': 'यो डाक्टर होइन। औषधिको सल्लाह कहिल्यै दिइँदैन।',
  'ref.not2': 'यो वकिल होइन। कानुनी सल्लाह दिइँदैन।',
  'ref.not3': 'कुनै पनि पैसा लिइँदैन, र कुनै विज्ञापन देखाइँदैन।',
  'ref.not4': 'तपाईंको नाम, ठेगाना वा फोन नम्बर मागिँदैन र राखिँदैन।',
  'ref.not5': 'कुनै सरकारी योजनाको दाम वा नम्बर बनाइँदैन — सही जानकारी नभएमा स्पष्ट भनिन्छ कि थाहा छैन।',
  'ref.medicalTitle': 'जरूरी: यो डाक्टरको सल्लाह होइन',
  'ref.medicalBody': 'बिरामी, औषधि वा कुनै पनि विषालु कुरासँग सम्बन्धित विषय भएमा, सबैभन्दा पहिले डाक्टरलाई भेट्नुहोस्। यहाँ दिइएको जानकारी सामान्य मद्दतका लागि मात्र हो। बच्चाको खोप, गर्भावस्था, वा कुनै पनि औषधि सुरु गर्नु अघि डाक्टरको सल्लाह अवश्य लिनुहोस्।',
  'ref.statsTitle': 'कति जानकारी उपलब्ध छ',
  'support.howTitle': 'हामीलाई कसरी मद्दत गर्ने',
  'support.alwaysFreeTitle': 'यो सेवा सधैं निःशुल्क रहनेछ',
  'support.alwaysFreeBody': 'जुनसुकै मद्दत मिले पनि, त्यो सेवा चलाउनमा खर्च गरिनेछ। कसैबाट कहिल्यै पैसा लिइने छैन।',
  'smriti.eyebrow': 'श्रद्धाञ्जली',
  'smriti.whyTitle': 'यो साइट किन छ',
  'smriti.ending': 'उहाँहरूको संघर्ष यहाँ अगाडि बढ्छ।',
  'article.askAny': 'कुनै प्रश्न सोध्नुहोस्',
  'article.remember': 'याद राख्नुहोस्',
  'article.emergencyInfo': 'जरूरी जानकारी',
  'article.medicalTitle': 'यो चिकित्सा सल्लाह होइन',
  'article.medicalBody': 'यो जानकारी सामान्य मद्दतका लागि हो। कुनै पनि औषधि सुरु वा बन्द नगर्नुहोस् — पहिले डाक्टरलाई भेट्नुहोस्।',
  'article.heading': '{category} का लेखहरू',
  'reviews.rateQuestion': 'कति तारा दिनुहुन्छ?',
  'reviews.starsShort': '{value} तारा',
  'reviews.averageOutOf': '५ मा {value} तारा',
  'dhun.welcomeTitle': 'स्वागत छ',
  'dhun.consent': 'शंख, बाँसुरी र नगाडा — सँगै सुन्नका लागि छुनुहोस्।',
  'dhun.unsupported': 'यो ब्राउजरले ध्वनि बजाउन सक्दैन।',
  'dhun.failedTry': 'ध्वनि बजाउनमा समस्या भयो।',
  'sound.hintIdle': 'कुनै बटन थिचेर ध्वनि सुन्नुहोस्।',
  'sound.hintPlaying': 'आवाज बजिरहेको छ। रोक्नको लागि फेरि त्यही बटन थिच्नुहोस्।',
  'sound.preparing': 'ध्वनि तयार हुँदैछ',
  'nav.path': 'बाटो',
  'health.heading': 'आफ्नो उमेर बताउनुहोस्',
  'health.intro': 'उमेर अनुसार प्रायः सोधिने प्रश्नहरू यहाँ देखिनेछन्। कुनै बटन थिच्नुहोस् — प्रश्न तल भरिनेछ, त्यसपछि सोध्नुहोस्।',
  'health.ageLabel': 'उमेर (वर्ष)',
  'health.years': 'वर्ष',
  'health.bandsLabel': 'उमेर अनुसार रोज्नुहोस्',
  'health.notAdviceStrong': 'यो डाक्टरको सल्लाह होइन।',
  'health.notAdvice': 'कुनै पनि औषधि सुरु वा बन्द नगर्नुहोस् — पहिले डाक्टरलाई भेट्नुहोस्।',
  'health.emergencyStrong': 'आपतकालमा फोन गर्नुहोस्:',
  'health.emergencyCall': '(आपतकाल)',
  'health.emergencyAmbulance': '(एम्बुलेन्स)',
  'health.emergencyWomen': '(महिला हेल्पलाइन)',
  'health.privacy': 'कुनै नाम वा ठेगाना लेख्नु पर्दैन।',
  'health.band.infant.label': '० – २ वर्ष',
  'health.band.infant.note': 'साना बालबालिका, जो अहिले आफ्ना कुरा भन्न सक्दैनन्',
  'health.c.infant1': 'कडा ज्वरो',
  'health.q.infant1': 'मेरो बच्चालाई कडा ज्वरो आएको छ, के दूध दिऊँ?',
  'health.c.infant2': 'खाना खाएको छैन',
  'health.q.infant2': 'सानो बच्चाले खाना खाएको छैन, के गरूँ?',
  'health.c.infant3': 'वान्ता भइरहेको छ',
  'health.q.infant3': 'बच्चालाई वान्ता भइरहेको छ, कहिले डाक्टरलाई देखाऊँ?',
  'health.c.infant4': 'खाता पखाला लागेको छ',
  'health.q.infant4': 'बच्चालाई पखाला लागेको छ, के खुवाऊँ?',
  'health.band.child.label': '३ – १२ वर्ष',
  'health.band.child.note': 'बोल्न सक्ने तर प्रश्न सोध्न डराउने बालबालिका',
  'health.c.child1': 'पढाइमा मन लाग्दैन',
  'health.q.child1': 'बच्चाको पढाइमा मन लाग्दैन, के गरूँ?',
  'health.c.child2': 'स्कुल जान मान्दैन',
  'health.q.child2': 'बच्चाले रोज स्कुल जान मानिरहेको छैन, कारण के हुन सक्छ?',
  'health.c.child3': 'राति ज्वरो',
  'health.q.child3': 'बच्चालाई राति ज्वरो आउँछ, के गरूँ?',
  'health.c.child4': 'दाँत भाँचिदैछ',
  'health.q.child4': 'बच्चाको दाँत भाँचिदैछ, दाँतको हेरचाह कसरी गरूँ?',
  'health.band.teen.label': '१३ – १७ वर्ष',
  'health.band.teen.note': 'किशोरकिशोरी, जसले प्रायः सुन्ने मान्छे पाउँदैनन्',
  'health.c.teen1': 'पढाइको दबाब',
  'health.q.teen1': 'पढाइको धेरै दबाब छ, यसको सामना कसरी गरूँ?',
  'health.c.teen2': 'निद्रा लाग्दैन',
  'health.q.teen2': 'राति राम्ररी निद्रा लाग्दैन, के गरूँ?',
  'health.c.teen3': 'मोबाइलको कुलत',
  'health.q.teen3': 'मोबाइलको कुलत लागेको छ, छुटाउने तरिका बताउनुहोस्।',
  'health.c.teen4': 'धेरै खिन्नता',
  'health.q.teen4': 'धेरै खिन्न महसुस हुन्छ, कोसँग कुरा गरूँ?',
  'health.band.young.label': '१८ – ३० वर्ष',
  'health.band.young.note': 'जागिर, पैसा र निद्रा — तीनवटैको एकसाथ बोझ',
  'health.c.young1': 'कामको तनाव',
  'health.q.young1': 'कामको तनाव धेरै छ, कसरी कम गरूँ?',
  'health.c.young2': 'बसिरहँदा ढाड दुख्ने',
  'health.q.young2': 'बसिरहनाले ढाड दुखीरहेको छ, के गरूँ?',
  'health.c.young3': 'निद्रा लाग्दैन',
  'health.q.young3': 'राति निद्रा लाग्दैन, के उपाय छ?',
  'health.c.young4': 'पैसा कम छ',
  'health.q.young4': 'पैसा कम छ र खर्च धेरै, के गरूँ?',
  'health.band.middle.label': '३१ – ४५ वर्ष',
  'health.band.middle.note': 'घर, बालबच्चा र आफ्नो स्वास्थ्य — सबैको जिम्मेवारी एकसाथ',
  'health.c.middle1': 'कम्मर दुख्ने',
  'health.q.middle1': 'कम्मर दुख्दै छ, कारण के हुन सक्छ?',
  'health.c.middle2': 'निद्रा नलाग्ने',
  'health.q.middle2': 'राम्रो निद्रा लाग्दैन, सुधार्ने के उपाय छ?',
  'health.c.middle3': 'घरको तनाव',
  'health.q.middle3': 'घरमा धेरै तनाव छ, बालबच्चालाई कसरी सम्हाल्ने?',
  'health.c.middle4': 'पेटमा ग्यास',
  'health.q.middle4': 'काममा धेरै वर्षदेखि पेटमा ग्यासको समस्या छ, के गरूँ?',
  'health.band.later.label': '४६ – ६० वर्ष',
  'health.band.later.note': 'शरीरको उमेर र त्यसको हेरचाह — दुवै एकसाथ',
  'health.c.later1': 'ढाड दुख्ने',
  'health.q.later1': 'मेरो उमेर ५४ वर्ष भयो र मेरो ढाड दुख्छ, के गरूँ?',
  'health.c.later2': 'घुँडा दुख्ने',
  'health.q.later2': 'उकालो चढ्दा घुँडा दुख्छ, किन?',
  'health.c.later3': 'राति खुट्टा बाउँडिने',
  'health.q.later3': 'राति खुट्टा बाउँडिन्छ, के गरूँ?',
  'health.c.later4': 'बिहान कम्मर जकडिने',
  'health.q.later4': 'बिहान उठ्दा कम्मर जकडिएको हुन्छ, कारण के हुन सक्छ?',
  'health.band.senior.label': '६१ – ७५ वर्ष',
  'health.band.senior.note': 'औषधि, सन्तुलन र एक्लोपन — तीनै कुरा एकसाथ',
  'health.c.senior1': 'हिँड्न गाह्रो',
  'health.q.senior1': 'घुँडा यति दुख्छ कि हिँड्न गाह्रो छ, के गरूँ?',
  'health.c.senior2': 'औषधिको जाँच',
  'health.q.senior2': 'धेरै औषधिहरू दैनिक खानुपर्छ — कुन हानिकारक छ कसरी थाहा पाउने?',
  'health.c.senior3': 'राति पिसाब लाग्ने',
  'health.q.senior3': 'राति पटक-पटक पिसाब लाग्ने समस्या छ, के गरूँ?',
  'health.c.senior4': 'कम सुन्ने',
  'health.q.senior4': 'कम सुनिन्छ, सुन्ने कुनै उपाय बताउनुहोस्।',
  'health.band.elder.label': '७६ – १०० वर्ष',
  'health.band.elder.note': 'हरेक औषधिको जाँच जरुरी, लड्नु गम्भीर',
  'health.c.elder1': 'लड्ने डर',
  'health.q.elder1': 'घरमा लड्ने डर छ, कस्तो सुरक्षा अपनाऊँ?',
  'health.c.elder2': 'स्मरणशक्ति कमजोर',
  'health.q.elder2': 'स्मरणशक्ति कमजोर हुँदैछ, के उपाय छ?',
  'health.c.elder3': 'दैनिक दुखाइको औषधि',
  'health.q.elder3': 'दुखाइको औषधि दैनिक खानुपर्छ — के यसको कुनै हानी छ?',
  'health.c.elder4': 'कहिले डाक्टरकहाँ जाने',
  'health.q.elder4': 'कहिले डाक्टरकहाँ जानु जरुरी छ?',
  'ask.notConfigured': 'यो सेवाले अहिले पुराना जवाफहरूबाट मात्र उत्तर दिइरहेको छ। तपाईंको प्रश्न त्यसमा भेटिएन।',
  'ask.browseTitle': 'यहाँ भएका लेखहरू हेर्नुहोस्',
  'download.pdf': 'PDF मा लेख्नुहोस्',
  'download.text': 'टेक्स्टमा लेख्नुहोस्',
  'download.printNow': 'प्रिन्ट गर्नुहोस्',
  'download.preparing': 'तयार हुँदैछ',
  'download.blocked': 'नयाँ ट्याब खुल्न सकेन। Pop-up ब्लक भइरहेको छ — आफ्नो ब्राउजरमा छुट्टै ट्याब खोल्नुहोस्।',
  'attach.button': 'आफ्नो कागजात वा फोटो जोड्नुहोस्',
  'attach.formats': 'PDF, फोटो (JPG/PNG) वा टेक्स्ट फाइल — १२ MB सम्म',
  'attach.reading': 'पढ्दै छ…',
  'attach.attached': 'जोडियो',
  'attach.remove': 'हटाउनुहोस्',
  'attach.tooBigPdf': 'यो PDF १२ MB भन्दा ठूलो छ। सानो फाइल छान्नुहोस्।',
  'attach.tooBigImage': 'यो फोटो ३ MB भन्दा ठूलो छ। सानो फोटो छान्नुहोस्।',
  'attach.scannedPdf': 'यो PDF स्क्यान गरिएको हो — यसमा केवल तस्बिर छ, पढ्न सकिंदैन। यसको फोटो पठाउनुहोस्।',
  'attach.pdfFailed': 'यो PDF पढ्न सकिएन।',
  'attach.imageFailed': 'यो फोटो लोड भएन।',
  'attach.wrongType': 'यो फाइल चल्दैन। PDF, फोटो वा टेक्स्ट फाइल पठाउनुहोस्।',
  'attach.hint': 'आफ्नो कागज यहाँ राखेर प्रश्न सोध्नुहोस् — हामी त्यहीबाट जवाफ दिनेछौं।',
  'ask.sendWithFile': 'जवाफ चाहियो',
  'lib.title': 'निःशुल्क पुस्तकालय',
  'lib.intro': 'पढाइका किताबहरू, तस्बिरहरू र अडियो — सबै निःशुल्क र कानुनी रूपमा।',
  'lib.legalTitle': 'प्रतिलिपि अधिकारको कुनै झन्झट छैन।',
  'lib.legal': 'यहाँ जे-जति दिइएको छ, त्यो बिल्कुल निःशुल्क छ र तपाईं यसलाई अगाडि पनि बाँड्न सक्नुहुन्छ। जुन किताब अहिले प्रतिलिपि अधिकारमा छ, त्यो यहाँ हुने छैन — त्यसलाई तपाईं कपी गर्न सक्नुहुन्न, यो प्रष्ट भन्नु जरुरी छ।',
  'ask.signInFirst': 'पहिले लगइन गर्नुहोस्, त्यसपछि प्रश्न सोध्नुहोस्।',
  'ask.signInTitle': 'पहिले लगइन गर्नुहोस्',
  'ask.signInBody': 'प्रश्न सोध्नको लागि आफ्नो खाता बनाउनुहोस्। यसमा एक मिनेटभन्दा कम लाग्छ, र तपाईं सोधिरहन सक्नुहुन्छ।',
  'ask.signInCta': 'खाता बनाउनुहोस् वा लगइन गर्नुहोस्',
  'ask.signInOr': 'अहिले खाता बनाउन सक्नुहुन्न? यी कामहरू पनि तपाईं बिना नै हुन्छन्:',
  'account.title': 'मेरो खाता',
  'account.intro': 'आफ्नो नाम र पासवर्ड राखेर प्रश्न सोध्न सुरु गर्नुहोस्।',
  'account.signIn': 'प्रवेश गर्नुहोस्',
  'account.register': 'खाता बनाउनुहोस्',
  'account.signInNote': 'अघिल्लो पटकको नाम र पासवर्ड हाल्नुहोस्।',
  'account.registerNote': 'प्रश्न सोध्नको लागि खाता जरुरी छैन। यो केवल तपाईंको भाषा र जवाफ सम्झनको लागि हो।',
  'account.handle': 'तपाईंको नाम',
  'account.handlePlaceholder': 'जस्तै: sita.ji',
  'account.password': 'पासवर्ड',
  'account.passwordHint': 'कर्तीकति ६ अक्षर।',
  'account.phone': 'फोन नम्बर',
  'account.optional': 'जरुरी छैन',
  'account.phoneHint': 'दिन चाहनुहुन्छ भने दिनुहोस्। कुनै फोन नम्बर नदिँदा पनि खाता बन्नेछ।',
  'account.create': 'खाता बनाउनुहोस्',
  'account.logout': 'बाहिर निस्कनुहोस्',
  'account.open': 'खाता खोल्नुहोस्',
  'account.signedInAs': 'तपाईं लगइन हुनुहुन्छ',
  'account.signedOut': 'खाता खुलेको छैन',
  'account.signedOutBody': 'अहिले कुनै खाता खुलेको छैन।',
  'account.saved': 'सञ्चित जवाफहरू',
  'account.savedEmpty': 'अहिले कुनै जवाफ सञ्चित छैन। जवाफ आउँदा \'सञ्चित गर्नुहोस्\' थिच्नुहोस्।',
  'account.savedUnavailable': 'सञ्चित जवाफहरू अहिले देखिएका छैनन्। बाँकी सबै चलिरहेको छ।',
  'account.wait': 'कृपया प्रतीक्षा गर्नुहोस्…',
  'account.privacyTitle': 'तपाईंका कुराहरू सुरक्षित',
  'account.privacyBody': 'खाता बनाउँदा केवल तपाईंको नाम, पासवर्ड र भाषा राखिन्छ। प्रश्नको कुनै रेकर्ड बन्ददैन। तपाईंको प्रश्न कसैलाई पठाइंदैन।',
  'account.errWrong': 'नाम वा पासवर्ड गलत छ।',
  'account.errTaken': 'यो नाम पहिले नै लिइसकेको छ। अर्को नाम छान्नुहोस्।',
  'account.errBad': 'जानकारी ठीकसँग भर्नुहोस्।',
  'account.errWait': 'धेरै प्रयास भयो। अलि पछि प्रयास गर्नुहोस्।',
  'account.errTryLater': 'अहिले हुन सकेन। केही समय पछि प्रयास गर्नुहोस्।',
  'lib.licence.ccBy': 'तपाईं यसलाई कपी र सेयर गर्न सक्नुहुन्छ, छाप्न पनि सक्नुहुन्छ — केवल स्रोतको नाम दिनुपर्नेछ।',
  'lib.licence.ccBySa': 'तपाईं यसलाई कपी र छाप्न सक्नुहुन्छ। जed्जेड परिवर्तन गर्नुहुन्छ, ती पनि खुला रूपमा दिनुपर्नेछ।',
  'lib.licence.ccZero': 'पूर्ण रूपमा निःशुल्क। स्रोतको नाम दिनु पनि जरुरी छैन।',
  'lib.licence.pd': 'कसैको प्रतिलिपि अधिकार छैन — जो चाहन्छन् कपी गर्न सक्छन्।',
  'lib.licence.govtIndia': 'भारत सरकारको वेबसाइटमा। पढ्न र छाप्न दुवै निःशुल्क।',
  'lib.licence.creativeCommons': 'प्रत्येक फाइलको आफ्नै इजाजतपत्र छ — फाइलमा हेर्नुहोस्।',
  'lib.licence.freeToRead': 'पढ्न निःशुल्क छ। कपी गरेर अगाडि दिनु पनि त्यही सर्तमा हो जसमा यो प्राप्त भएको थियो।',
  'lib.openBadge': 'खुला',
  'lib.openBadgeNote': 'यसलाई कपी गर्न सकिन्छ',
  'lib.freeBadge': 'नि:शुल्क',
  'lib.freeBadgeNote': 'पढ्न सकिन्छ, कपी गर्न मिल्दैन',
  'lib.govt': 'सरकारी',
  'lib.noSignup': 'खाता नचाहिने',
  'lib.open': 'यहाँ खोल्नुहोस्',
  'lib.group.padhai': 'पढाइका किताबहरू',
  'lib.group.padhai.note': 'स्कूल, कलेज र सरकारी शिक्षा सामग्री',
  'lib.group.kitab': 'किताबहरू',
  'lib.group.kitab.note': 'जसमा कपीराइट छैन वा जसलाई कपी गर्ने अनुमति छ',
  'lib.group.tasveer': 'तस्बिर र चित्रहरू',
  'lib.group.tasveer.note': 'नक्सा, तस्बिर, चिन्ह — सबै कुरा',
  'lib.group.audio': 'सुन्न मिल्ने सामग्री',
  'lib.group.audio.note': 'किताबहरू सुनेर, ठूला अक्षरबाट होइन',
  'lib.warnTitle': 'सबै किताब यहाँ छैनन्',
  'lib.warn': 'केही किताबहरू अहिले कपीराइटमा छन् र ती कानुन अनुसार नि:शुल्क दिन मिल्दैन। हामी जानाजानी त्यहाँ देखाउँदैनौँ। यदि कुनै किताब चाहिएको छ भने तल प्रश्न सोध्नुहोस् — जुन जवाफ दिन सकिन्छ, त्यो दिइनेछ।',
  'lib.askInstead': 'प्रश्न सोध्नुहोस्',
  'nav.library': 'पुस्तकालय',
  'support.contactMessageLabel': 'तपाईंको कुरा',
  'support.contactPlaceholder': 'जे लेख्न मन छ त्यही लेख्नुहोस् — गल्ती भएमा, केही राम्रो भेटिएमा, वा कुनै प्रश्न भएमा।',
  'support.contactHelp': 'कम्तीमा १० अक्षर। यो सिधै मालिककहाँ जान्छ।',
  'support.contactSubmit': 'पठाउनुहोस्',
  'support.contactSending': 'पठाउँदै छ…',
  'support.contactPrivacy': 'तपाईंको नाम लेख्नु जरुरी छैन।',
  'support.contactSent': 'पुग्यो',
  'support.contactSentBody': 'तपाईंको कुरा मालिकसम्म पुगिसकेको छ।',
  'support.contactFailed': 'पठाउन सकिएन',
  'support.faq1Q': 'के यो साँच्चै नि:शुल्क हो?',
  'support.faq1A': 'हो। कुनै पैसा लिइँदैन, कुनै विज्ञापन देखिँदैन, र कुनै सदस्यता लिइँदैन। यो एक व्यक्तिको पैसाले चल्छ, कुनै कम्पनी वा सरकारको पैसाले होइन।',
  'support.faq2Q': 'के मेरो नाम, ठेगाना वा फोन नम्बर लिइन्छ?',
  'support.faq2A': 'छैन, र यो लिइने पनि छैन। यो साइटले आफैँमा कुनै पहिचान बनाउँदैन — कुनै लगइन छैन, कुनै ट्र्याकिङ स्क्रिप्ट छैन। जे सोधिन्छ त्यो केवल तपाईंको प्रश्न हो र जब तपाईं सोध्नुहुन्छ।',
  'support.faq3Q': 'के यो डाक्टर वा वकिल हो?',
  'support.faq3A': 'होइन। यसले कुनै औषधिको सल्लाह दिँदैन र न त कुनै कानुनी सल्लाह। जहाँ कुरा गम्भीर हुन्छ त्यहाँ यसले तपाईंलाई डाक्टर वा अधिकारीकहाँ जान भन्छ — यसले उनीहरूको ठाउँ लिँदैन।',
  'support.faq4Q': 'के हरेक जवाफ सही हुन्छ?',
  'support.faq4A': 'सधैँ होइन। जवाफ एउटा कम्प्युटरले लेख्छ, कुनै डाक्टरले होइन — त्यसैले हरेक जवाफसँग यो लेखिएको हुन्छ कि यो चिकित्सा सल्लाह होइन। कुनै औषधि सुरु गर्नु वा बन्द गर्नुअघि डाक्टरसँग पक्कै भेट्नुहोस्।',
  'support.faq5Q': 'के मैले कुनै एप डाउनलोड गर्नुपर्छ?',
  'support.faq5A': 'पर्दैन। यो ब्राउजरमा मात्र खुल्छ। कुनै एप इन्स्टल गर्नु पर्दैन, कुनै अनुमति चाहिँदैन, कुनै अपडेट चाहिँदैन।',
  'nav.remedies': 'घरेलु उपचार',
  'remedy.title': 'आयुर्वेदिक घरेलु उपचार',
  'remedy.intro': 'जुनसुकै समस्या होस् — खोकी, टाउको दुखाइ, बाथ, चिलाउने समस्या, मधुमेह, ढाड दुखाइ — तल आफ्नो समस्या छान्नुहोस् वा आफ्नै शब्दमा सोध्नुहोस्। घरेलु काढा, मालिस, खानपान र आयुर्वेदिक उपायहरू बताइएका छन्।',
  'remedy.choose': 'आफ्नो समस्या छान्नुहोस्',
  'remedy.emergencyStrong': 'यी आपत्काल हुन्:',
  'remedy.emergency': 'सर्पले टोकेमा, बिच्छीले चिल्दा र कुकुरले टोकेमा — तुरुन्त अस्पताल जानुहोस्, पहिले ११२ मा फोन गर्नुहोस्। घरेलु उपाय केवल बाटोमा गर्नका लागि हुन्, अस्पतालको विकल्प होइनन्।',
  'remedy.note': 'घरेलु र आयुर्वेदिक उपायले समस्या कम गर्न मद्दत गर्छन्; यी डाक्टरको जाँच र उपचारको विकल्प होइनन्। कुनै औषधि आफैँ बन्द वा सुरु नगर्नुहोस्।',
  'remedy.cough': 'खोकी',
  'remedy.headache': 'टाउको दुखाइ',
  'remedy.joints': 'बाथ',
  'remedy.itching': 'चिलाउने समस्या',
  'remedy.snake': 'सर्पले टोकेमा',
  'remedy.scorpion': 'बिच्छीले चिल्दा',
  'remedy.dog': 'कुकुरले टोकेमा',
  'remedy.diabetes': 'मधुमेह',
  'remedy.back': 'ढाड दुखाइ',
  'remedy.walking': 'हिँड्न समस्या',
  'home.remedyNote': 'काढा, मालिस, खानपान र आयुर्वेदिक उपाय — हरेक समस्याका लागि, तपाईंको भाषामा। VARSHA SAMADHAN AI',
  'nav.aarti': 'आरती र भजन',
  'aarti.title': 'आरती र भजन — सक्कली आवाजमा',
  'aarti.intro': 'यहाँ आरती, कीर्तन र भजन सुन्नुहोस् — सक्कली गायक र मन्दिरहरूको आवाजमा। कुनै AI आवाज होइन।',
  'aarti.note': 'आरती वा भजन कम्प्युटरको आवाजमा सुनाउँदा त्यसको लय र भक्ति हराउँछ। त्यसैले यहाँ केवल सक्कली रेकर्डिङहरू मात्र छन्।',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रेकर्डिङ:',
  'aarti.licence': 'लाइसेन्स:',
  'aarti.listenLink': 'सक्कली आवाजमा सुन्नुहोस्',
  'aarti.textChecked': 'यो परम्परागत पाठ हो, जसरी सक्कली रेकर्डिङमा गाइएको छ।',
  'aarti.textPrinted': 'यो प्रचलित पाठ हो, प्रकाशित संग्रहहरूसँग मिलाएर जाँचिएको छ।',
  'aarti.textNotStored': 'यस ग्रन्थको पूरा पाठ यहाँ राखिएको छैन — तलको रेकर्डिङमा पूरा पाठ सुन्न सकिन्छ।',
  'aarti.granthTitle': 'ग्रन्थ, चालिसा र स्तोत्र — सक्कली आवाजमा',
  'aarti.noRecording': 'यस आरतीको सक्कली रेकर्डिङ अहिले साइटमा छैन, त्यसैले म यसलाई गाएर सुनाउन सक्दिनँ — VARSHA SAMADHAN AI ले कहिल्यै पनि AI आवाजमा आरती गाउँदैन।',
  'aarti.textOnlyTitle': 'अरू आरतीहरू — पाठ पनि, सक्कली आवाज पनि',
  'aarti.fullText': 'पूरा पाठ',
  'aarti.notChecked': 'यस आरतीको प्रमाणित पाठ अहिले साइटमा छैन। नजाँचिएको पाठ दिनु ठीक हुँदैन, त्यसैले त्यो दिइएको छैन।',
  'aarti.verifiedList': 'साइटमा यी आरतीहरूको प्रमाणित पाठ छ:',

};

/* -------------------------------------------------------------------------- */
/* SANSKRIT                                                                  */
/* -------------------------------------------------------------------------- */

const SANSKRIT: Record<string, string> = {
  'jgd.placeSearch': 'नगरस्य नाम लिखन्तु',
  'jgd.placeNoMatch': 'एषः नगरः सूच्यां नास्ति। समीपस्थं नगरं चिनुत।',
  'account.name': 'भवतः नाम',
  'account.namePlaceholder': 'यथा: सीता देवी',
  'account.nameHint': 'एतत् भवतां परिचयार्थम् अस्ति। किमपि नाम भवितुम् अर्हति, एतत् अनिवार्यं नास्ति।',
  'nav.home': 'गृहम्',
  'home.metaTitle': 'निःशुल्कसमाधानम्, भवताम् स्वकीयशब्देषु',
  'lib.licence.ccZero.name': 'CC0 / सार्वजनिकक्षेत्रम्',
  'lib.licence.pd.name': 'सार्वजनिकक्षेत्रम्',
  'lib.licence.govtIndia.name': 'भारतसर्वकारः',
  'lib.licence.creativeCommons.name': 'क्रिएटिव कॉमन्स (मिश्रितम्)',
  'lib.licence.freeToRead.name': 'पठनाय स्वतन्त्रम्',
  'lib.entry.ncert.title': 'NCERT पुस्तकानि — कक्षा १ तः १२ पर्यन्तम्',
  'lib.entry.ncert.what': 'सर्वेषां विषयाणां सर्वाणि पुस्तकानि, अधुना प्रत्येकं कक्षायै। विना लॉगिन, प्रत्यक्षं PDF।',
  'lib.entry.ncert.langs': 'हिन्दी, आङ्ग्लभाषा तथा ३० तः अधिकाः भारतीयभाषाः',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल-पाठ्यपुस्तकानि',
  'lib.entry.pm-evidya.what': 'NCERT पुस्तकानाम् ऐप, बृहत् अक्षरेषु पठितुं शक्यते। श्रोतुमपि शक्यते।',
  'lib.entry.pm-evidya.langs': 'भारतीयभाषाः',
  'lib.entry.diksha.title': 'DIKSHA — शिक्षकेभ्यः छात्रेभ्यश्च',
  'lib.entry.diksha.what': 'पाठ्यक्रमः, विडियो तथा अभ्यासः — कक्षा १ तः १२ पर्यन्तम्।',
  'lib.entry.diksha.langs': 'भारतीयभाषाः',
  'lib.entry.khan-academy.title': 'Khan Academy — आङ्ग्लभाषायां गणितं विज्ञानं च',
  'lib.entry.khan-academy.what': 'विडियो-पाठाः, प्रत्येकं कक्षायै। पठितुम् इच्छुकेभ्यः लिखितपाठाः अपि सन्ति।',
  'lib.entry.openstax.title': 'OpenStax — आङ्ग्लभाषायां निःशुल्कपुस्तकानि',
  'lib.entry.openstax.what': 'महाविद्यालयस्तरीयाणि पुस्तकानि — गणितं, विज्ञानं, मानविकी। प्रत्येकं पृष्ठे PDF।',
  'lib.entry.nios.title': 'NIOS — दूरस्थशिक्षा, निःशुल्कसामग्री',
  'lib.entry.nios.what': 'मुक्त-ऑनलाइन-पाठ्यक्रमाणाम् निःशुल्कपुस्तकानि, प्रवेशं विना।',
  'lib.entry.nios.langs': 'हिन्दी, आङ्ग्लभाषा अन्याश्च',
  'lib.entry.ignou.title': 'IGNOU — मुक्तविश्वविद्यालयस्य निःशुल्कपुस्तकानि',
  'lib.entry.ignou.what': 'दूरस्थशिक्षायाः पुस्तकानि यानि सर्वथा निःशुल्कं प्राप्यन्ते।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — आङ्ग्लभाषायाः प्राचीनपुस्तकानि',
  'lib.entry.gutenberg.what': '७०,००० तः अधिकानि पुस्तकानि, सर्वाणि प्रतिलिपि-अधिकारमुक्तानि। निःशुल्कं ई-बुक तथा ऑडियो।',
  'lib.entry.pratham-books.title': 'Pratham Books — बालपुस्तकानि',
  'lib.entry.pratham-books.what': 'भारतीयभाषासु बालपुस्तकानि, सर्वथा निःशुल्कम्। कक्षा १ तः ५ पर्यन्तम्।',
  'lib.entry.pratham-books.langs': 'हिन्दी, मराठी, बङ्गाली, तमिल, तेलुगु अन्याश्च',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — समाचारपत्राणि प्राचीनपत्रिकाश्च',
  'lib.entry.internet-archive-texts.what': 'लक्षशः प्राचीनपुस्तकानि, पत्रिकाः तथा समाचारपत्राणि — निःशुल्कम्।',
  'lib.entry.wikisource.title': 'Wikisource — जन-गद्यपाठाः',
  'lib.entry.wikisource.what': 'प्रतिलिपि-अधिकारमुक्तानि — एतानि विश्वस्य प्राचीनसाहित्यिकपुस्तकानि सन्ति।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — सर्वाणि चित्राणि',
  'lib.entry.wikimedia-commons.what': 'उपजातयः, मानचित्रं, नक्षत्राणि, इतिहासः — सर्वम्। प्रत्येकं चित्रस्य पृथक् अनुज्ञापत्रं लिखितम् अस्ति।',
  'lib.entry.pixabay.title': 'Pixabay — चित्राणि आकृतयश्च',
  'lib.entry.pixabay.what': 'चित्राणि, रेखाचित्राणि तथा लघूनि विडियो।',
  'lib.entry.unsplash.title': 'Unsplash — सुन्दराणि चित्राणि',
  'lib.entry.unsplash.what': 'निःशुल्कं, बृहत् अक्षरेषु, विना अकाउंट।',
  'lib.entry.openverse.title': 'Openverse — सर्वाणि चित्राणि एकस्मिन् स्थाने',
  'lib.entry.openverse.what': 'अनेकानि निःशुल्कचित्रस्थलानि एकदैव अन्वेष्टुं शक्यन्ते।',
  'lib.entry.librivox.title': 'LibriVox — श्रव्यपुस्तकानि',
  'lib.entry.librivox.what': 'प्राचीन-आङ्ग्लपुस्तकानां निःशुल्कं ऑडियो, मानवीये स्वरे।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ऑडियो-सङ्ग्रहः',
  'lib.entry.internet-archive-audio.what': 'सहस्रशः निःशुल्क-ऑडियो — पुस्तकानि, भाषणानि, सङ्गीतम्।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राष्ट्रगानं राष्ट्रगीतानि च',
  'lib.entry.vande-mataram.what': 'भारतस्य राष्ट्रगानम् अन्यानि राष्ट्रगीतानि च, निःशुल्कम्।',
  'art.aag-aur-bijli-ke-bachav.title': 'अग्नि-विद्युत्-सुरक्षायाः नियमाः',
  'art.aag-aur-bijli-ke-bachav.summary': 'गृहे अग्नि-निवारणम् — सरलाः नियमाः',
  'art.aag-lagne-par-kya-karein.title': 'अग्नि-दुर्घटनायां किं करणीयम्',
  'art.aag-lagne-par-kya-karein.summary': 'ज्वलति गृहे अग्निः — प्रथमं किं करणीयम्, किं न करणीयम्',
  'art.bimari-se-bachav.title': 'संक्रमणात् रक्षणस्य सप्त नियमाः',
  'art.bimari-se-bachav.summary': 'हस्तप्रक्षालनम्, मुखावरणम्, टीका — इत्यादिभिः रक्षणम्',
  'art.dhuwan-ka-jhakora.title': 'धूम्रस्य झकोरात् रक्षणम्',
  'art.dhuwan-ka-jhakora.summary': 'श्वासकष्टम्, श्वासोच्छ्वासस्य अभावः — किं करणीयम्, कदा चिकित्सालयं गन्तव्यम्',
  'art.doodh-pani-band-ho.title': 'विद्युत् वा जलं अकस्मात् अवरुद्धं चेत्',
  'art.doodh-pani-band-ho.summary': 'किं करणीयम्, कस्मात् रक्षितव्यम्, कदा साहाय्यं याचनीयम्',
  'art.haath-ki-saafai.title': 'साबुनं विना हस्तप्रक्षालनस्य उपायः',
  'art.haath-ki-saafai.summary': 'यदा जलं वा साबुनं न स्यात्',
  'cat.dhyan-aur-yoog.title': 'ध्यानं योगश्च',
  'cat.dhyan-aur-yoog.subtitle': 'मनः शान्त्यै सरलोपायाः',
  'cat.gharelu-marammat.title': 'गृहस्य मरम्मतम्',
  'cat.gharelu-marammat.subtitle': 'गृहस्य लघुसमस्यानां समाधानम्',
  'cat.bachchon-ki-padhai.title': 'बालकानाम् अध्ययनम्',
  'cat.bachchon-ki-padhai.subtitle': 'अध्ययने मग्नाः, चिन्तिताः वा',
  'cat.budharge-seva.title': 'वृद्धानां सेवा',
  'cat.budharge-seva.subtitle': 'परिचर्या साहाय्यं च',
  'cat.shishu-dekhbhal.title': 'शिशुपरिचर्या',
  'cat.shishu-dekhbhal.subtitle': 'लघुशिशोः सम्यक् परिचर्या',
  'cat.dharmik-upay.title': 'धार्मिकोपायः',
  'cat.dharmik-upay.subtitle': 'मनःशान्त्या सह',
  'cat.pavan-grah-aur-aarti.title': 'पवित्रग्रन्थाः आरती च',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धया पठन्तु शृण्वन्तु च',
  'cat.aapatkalen-gayide.title': 'आपातकालीन-मार्गदर्शिका',
  'cat.aapatkalen-gayide.subtitle': 'यदा शीघ्रं साहाय्यम् आवश्यकम्',
  'cat.mahamari-suraksha.title': 'महामारी-सुरक्षा',
  'cat.mahamari-suraksha.subtitle': 'रोगप्रसारात् रक्षणम्',
  'nav.tribute': 'स्मृतिः',
  'nav.help': 'साहाय्यम्',
  'nav.reference': 'सन्दर्भः',
  'nav.reviews': 'अभिप्रायः',
  'nav.support': 'साहाय्यं कुर्वन्तु',
  'nav.birthChart': 'जन्मपत्रिका',
  'jgd.title': 'भवतः जन्मपत्रिका',
  'jgd.intro': 'स्वनाम, जन्मतिथिं, जन्मसमयं स्थानं च लिखन्तु। सर्वा गणना भवतः दूरभाषे एव भविष्यति — किमपि अन्यत्र न प्रेष्यते। VARSHA SAMADHAN AI',
  'jgd.nameLabel': 'जन्मनाम',
  'jgd.namePlaceholder': 'यथा पूर्णनाम',
  'jgd.nameHint': 'यत् नाम बाल्ये आसीत्, तत् एव लिखन्तु।',
  'jgd.dateLabel': 'जन्मतिथिः',
  'jgd.timeLabel': 'जन्मसमयः',
  'jgd.timeHint': 'न ज्ञातं चेत् रिक्तं त्यजन्तु।',
  'jgd.placeLabel': 'जन्मस्थानम्',
  'jgd.placeNone': 'अज्ञातम् / चिनोतु',
  'jgd.placeHint': 'जन्मस्थानस्य नगरं चिनोतु।',
  'jgd.submit': 'गणनां कुर्वन्तु',
  'jgd.savePdf': 'PDF निर्मातु',
  'jgd.again': 'नूतना गणना',
  'jgd.errDate': 'कृपया जन्मतिथिं सम्यक् लिखन्तु।',
  'jgd.errPlace': 'जन्मस्थानस्य नगरं सूचीतः चिनोतु, अथवा तत्समीपस्थं नगरं चिनोतु।',
  'jgd.numTitle': 'अङ्कज्योतिषम्',
  'jgd.lifePath': 'जीवनपथः',
  'jgd.nameNumber': 'नामाङ्कः',
  'jgd.soulNumber': 'आत्माङ्कः',
  'jgd.birthdayNumber': 'जन्मतिथ्यङ्कः',
  'jgd.astroTitle': 'वैदिकज्योतिषम्',
  'jgd.nakshatra': 'नक्षत्रम्',
  'jgd.pada': 'पादः',
  'jgd.rashi': 'राशिः',
  'jgd.rashiLord': 'राशिस्वामी',
  'jgd.nakshatraLord': 'नक्षत्रस्वामी',
  'jgd.lagna': 'लग्नम्',
  'jgd.lagnaMissing': 'लग्नस्य गणनायै जन्मसमयः जन्मस्थानं च आवश्यकम्। उपरि पूरयित्वा गणनां कुर्वन्तु, यदि न जानन्ति तर्हि एतावदेव पर्याप्तम्।',
  'jgd.gunTitle': 'गुणमेलनम्',
  'jgd.gunIntro': 'द्वितीयस्य व्यक्तिस्य नाम जन्मतिथिं च पूरयन्तु।',
  'jgd.gunName': 'तस्य नाम',
  'jgd.gunDate': 'तस्य जन्मतिथिः',
  'jgd.gunHint': 'उभयोः नाम जन्मतिथिः च चेत् गुणमेलनं भविष्यति।',
  'jgd.disclaimer': 'एषा परम्परानुसारं कृता गणना अस्ति, न तु भविष्यवाणी। कापि संख्या वा राशिः स्वास्थ्यं, धनं वा सम्बन्धं न निर्धारयति। महता निर्णयाय चिकित्सकात्, विधिकपरामर्शात् वा अनुभवीजनात् परामर्शं स्वीकुर्वन्तु।',
  'nav.menu': 'सूची',
  'nav.openMenu': 'सूचीं उद्घाटयन्तु',
  'nav.closeMenu': 'सूचीं पिदधतु',
  'nav.expand': 'विस्तारयन्तु',
  'nav.collapse': 'सङ्कोचयन्तु',
  'nav.skip': 'सीधे विषयं प्रति गच्छन्तु',
  'nav.language': 'भाषां परिवर्तयन्तु',
  'footer.pages': 'पृष्ठानि',
  'footer.helplines': 'आवश्यकसङ्ख्याः',
  'footer.free': 'एषा सेवा पूर्णतः निःशुल्का अस्ति। कस्मादपि धनं न स्वीक्रियते।',
  'footer.readStory': 'तेषां सम्पूर्णकथां पठन्तु',
  'footer.admin': 'प्रबन्धकः',
  'footer.rights': 'निःशुल्कसेवा',
  'footer.emergency': 'आपातकालः',
  'footer.ambulance': 'रोगवाहिनी',
  'footer.women': 'महिलासहायतासङ्ख्या',
  'home.dedication1': 'स्मृतौ — एका पूर्णतः निःशुल्कसेवा VARSHA SAMADHAN AI।',
  'home.dedication2': 'स्वस्यां समस्यां लिखन्तु वदन्तु वा।',
  'home.emergencyTitle': 'आवश्यकम् — शीघ्रं सहायताम् इच्छन्ति',
  'home.emergencyNote': 'एतत् प्रथमं पठन्तु। शेषं पश्चात् द्रष्टुं शक्यते।',
  'home.readMore': 'सम्पूर्णं विवरणं पठन्तु',
  'home.chooseTopic': 'कस्मिन् विषये ज्ञातुम् इच्छन्ति?',
  'home.memorialEyebrow': 'एषा जालपुटं केभ्यः अस्ति',
  'home.memorialLine': 'ये समाजस्य कृते जीवनपर्यन्तं सङ्घर्षं कृतवन्तः, येभ्यः अन्ते स्वभागस्य न्यायः न प्राप्तः।',
  'home.memorialMore': 'तेषां सम्पूर्णकथां पठन्तु',
  'home.kundaliTitle': 'जन्मपत्रिका',
  'home.kundaliNote': 'सम्पूर्णा कुण्डली — ९ ग्रहाः, विंशोत्तरीदशा, फलकथनं, योगाः, षोडशवर्गाः, केपी, लालकिताबः अङ्कज्योतिषं च। सर्वं भवतां दूरभाषे एव गणयिष्यते।',
  'home.chooseTopicNote': 'अधोदत्ते विषये स्पृशन्तु। सर्वत्र सरलया भाषया विवरणं दत्तम् अस्ति।',
  'home.askHere': 'अस्मिन् विषये पृच्छन्तु',
  'home.categoryEmpty': 'अस्मिन् विषये अद्यापि किमपि न लिखितम्।',
  'home.soundTitle': 'शान्तये ध्वनिः',
  'home.soundIntro': 'शुल्कं नास्ति, विज्ञापनं नास्ति। केवलं मनः शान्त्यै।',
  'home.howTitle': 'एषा सेवा कथं कार्यं करोति',
  'home.step1Title': 'स्वविषयं लिखन्तु वदन्तु वा',
  'home.step1Body': 'हिन्दीभाषायां टङ्कयन्तु, अथवा माइकं दाबित्वा वदन्तु। किमपि विशेषं न करणीयम् — यत् मनसि अस्ति तत् लिखन्तु।',
  'home.step2Title': 'शीघ्रं उत्तरं प्राप्यते',
  'home.step2Body': 'प्रत्येकः प्रश्नः पञ्जीक्रियते तस्य उत्तरं च शीघ्रं प्राप्यते। दीर्घप्रश्नात् पूर्वं लघुप्रश्नात् आरभन्तु।',
  'home.step3Title': 'धनं नास्ति, व्यक्तिगतविवरणं नास्ति',
  'home.step3Body': 'एषा सेवा पूर्णतः निःशुल्का अस्ति। भवतां नाम, पता, दूरभाषसङ्ख्या वा न याच्यते, किमपि विज्ञापनं न दर्शयिष्यते।',
  'home.stepLabel': 'चरणम्',
  'home.freeTitle': 'एषा सेवा पूर्णतः निःशुल्का अस्ति',
  'home.freeBody': 'धनं न स्वीक्रियते, व्यक्तिगतविवरणं न याच्यते, किमपि विज्ञापनं न दर्शयिष्यते।',
  'help.q1.label': 'विद्युत् गता अस्ति, किं करोमि?',
  'help.q1.question': 'गृहे विद्युत् गता। किं करणीयम्, तथा च चलदूरवाणीं (मोबाइल) कथं आवेशयितुं शक्यते?',
  'help.q2.label': 'बालकस्य अध्ययने दुर्बलता',
  'help.q2.question': 'मम बालकस्य अध्ययने बहु दुर्बलता अस्ति। गृहे कथं सुधारं कुर्याम्?',
  'help.q3.label': 'वृद्धस्य चिकित्सा',
  'help.q3.question': 'मम पितुः आयुः बहु अधिका अस्ति, तस्य चिकित्सां कथं कुर्याम्?',
  'help.q4.label': 'गृहे अग्निः चेत्',
  'help.q4.question': 'यदि रात्रौ गृहे अग्निः प्रज्वलेत् तर्हि सर्वप्रथमं किं करणीयम्?',
  'help.title': 'स्वस्याः समस्यां लिखन्तु',
  'help.intro': 'अधः लिखन्तु अथवा वदन्तु। यदि न ज्ञायते तर्हि यथा मनसि वर्तते तथा लिखन्तु — एतदेव सर्वतो महत्त्वपूर्णम्।',
  'help.suggested': 'सामान्यप्रश्नाः',
  'help.howTitle': 'एषा सेवा कथं कार्यं करोति',
  'help.howBody': 'प्रत्येकः प्रश्नः पञ्जीकृतः भवति तथा च तस्य उत्तरं शीघ्रमेव प्राप्यते। भवतां नाम, पता अथवा दूरभाषसङ्ख्या कुत्रापि न स्वीक्रियते। सर्वं निःशुल्कम् अस्ति।',
  'ref.title': 'एषा सेवा का अस्ति, तथा च केभ्यः अस्ति',
  'ref.intro': 'एषा सेवा श्रीमती VARSHA इत्यस्याः स्मृतौ निर्मिता अस्ति। अत्र सरलभाषया उक्तम् अस्ति यत् एषा किं करोति, अत्र किं किं अस्ति, तथा च अस्याः सीमाः काः सन्ति। सर्वं पूर्णतः निःशुल्कम् — न किमपि धनं स्वीक्रियते, न विज्ञापनं दर्शयते, न च कापि वैयक्तिकसूचना याच्यते।',
  'ref.whatTitle': 'अत्र किं किं अस्ति',
  'ref.what1': 'गृहे अग्निः प्रज्वलेत्, विद्युत् गच्छेत्, बालकस्य अध्ययने दुर्बलता स्यात्, मातापितृणां सेवा करणीया स्यात् — एतादृशानां सामान्यसमस्यानां सरलसमाधानानि, स्वच्छभाषया।',
  'ref.what2': 'प्रश्नं वदित्वा प्रष्टुं सुविधा। यदि वक्तुं न ज्ञायते तर्हि लिखन्तु — द्वयोरपि उत्तरं समानमेव प्राप्यते।',
  'ref.what3': 'प्रत्येकः प्रश्नः पञ्जीकृतः भवति, अतः यत् अन्यान् पीडयति तत् भवद्भ्यः पूर्वमेव पृष्टं स्यात् तथा च तस्य उत्तरं प्राप्यते।',
  'ref.what4': 'न किमपि विज्ञापनम्, न अनावश्यकसूचना, न च कापि वैयक्तिकसूचना याच्यते। सर्वं निःशुल्कम्।',
  'ref.helplineTitle': 'त्वरितसहायतायै एतान् सङ्ख्यान् रक्षन्तु',
  'ref.helpline1': 'यदि कोऽपि महान् भयः स्यात् — यथा अग्निः, विद्युतः तीव्रः आघातः, पतनम् अथवा अत्यधिकरक्तस्रावः — तर्हि 112 इत्यत्र दूरभाषं कुर्वन्तु।',
  'ref.helpline2': 'यदि कस्यचित् रोगः स्यात् अथवा चोटः स्यात् तथा च गन्तुं मार्गः न स्यात्, तर्हि 108 इत्यत्र रुग्णवाहिकां (एम्बुलेंस) आह्वयन्तु।',
  'ref.helpline3': 'यदि महिलायाः सह किमपि दुर्व्यवहारः अभवत्, अथवा महिलां कुत्रापि पीडयन्ति, तर्हि 181 इत्यत्र दूरभाषं कुर्वन्तु। एतत् निःशुल्कम् अस्ति।',
  'ref.helpline4': 'यदि बालकस्य अथवा वृद्धस्य सह किमपि अन्यायः अभवत्, तर्हि 1098 इत्यत्र शिकायतं कर्तुं शक्यते।',
  'ref.helpline5': 'यदि मानसिकतनावः अत्यधिकः स्यात्, अथवा जीवितुं इच्छा न स्यात्, तर्हि 14416 इत्यत्र वक्तुं शक्यते। केवलं सम्भाषणाय।',
  'ref.dataTitle': 'वयं भवतां विषये किं रक्षामः',
  'ref.dataBody': 'केवलम् सः प्रश्नः यः भवद्भिः पृष्टः, तस्य सारः, तथा च प्रश्नस्य समयः — येन वयं पुनः पुनः समानम् उत्तरं न दद्युः। भवतां नाम, पता, दूरभाषसङ्ख्या, अथवा कापि परिचयात्मिका सूचना न स्वीक्रियते। जालपुटे (साइट) न किमपि विज्ञापनं न च ट्रैकिंग स्क्रिप्ट् अस्ति।',
  'ref.adminTitle': 'प्रबन्धकाः किं कर्तुं शक्नुवन्ति',
  'ref.adminBody': 'प्रबन्धकाः तान् लेखान् द्रष्टुं शक्नुवन्ति ये भवद्भिः प्रेषिताः, तथा च तेषां उत्तरं लेखितुं शक्नुवन्ति। ते भवतां अनुमतिं विना किमपि लेखं परिवर्तयितुं वा अपसारयितुं वा न शक्नुवन्ति, तथा च भवतां सूचनां कस्मैचित् विक्रेतुं न शक्नुवन्ति।',
  'ref.statsCategories': 'विषयाः उपलभ्यन्ते',
  'ref.statsArticles': 'लेखाः लिखिताः सन्ति',
  'ref.statsQuestions': 'प्रश्नाः पृष्टाः सन्ति',
  'ref.ownerNote': 'एषा सेवा कस्यापि कम्पनीयाः न, कस्यापि सर्वकारस्य न, अपितु एकस्य जनस्य स्मृतौ चाल्यते। अतः अत्र न विज्ञापनम् अस्ति, न सदस्यता अस्ति, न च धनं स्वीक्रियते।',
  'support.title': 'एषा सेवा निःशुल्कम् अस्ति',
  'support.intro': 'एषा सेवा कस्मादपि धनं न स्वीकरोति। परन्तु एषा चाल्यते — अतः केचन उपायाः सन्ति यैः भवान् सहायतां कर्तुं शक्नोति। सरलतमः उपायः सर्वाधिकः उपयोगी अस्ति।',
  'support.waysTitle': 'भवान् कथं सहायतां कर्तुं शक्नोति',
  'support.way1Title': 'स्वस्य अनुभवं लिखन्तु',
  'support.way1Body': 'यदि अस्याः जालपुटात् भवद्भ्यः किमपि उचितं प्राप्तम् — अथवा किमपि एतादृशं प्राप्तं यत् भवन्तं द्विविधायां स्थापितवत् — तर्हि राय-पृष्ठे लिखन्तु। भवतां नाम ग्रहणं आवश्यकं नास्ति।',
  'support.way2Title': 'स्वस्य नगरस्य विषये वदन्तु',
  'support.way2Body': 'भवान् यत्र निवसति, तत्रत्या भाषा, रीतिरिवाजाः तथा च समस्याः भिन्नाः भवन्ति। यदि भवतां प्रदेशस्य कापि वार्ता अत्र नास्ति, तर्हि वदन्तु — यत् योजयितुं शक्यते तत् योजयिष्यते।',
  'support.way3Title': 'स्वस्य अनुभवम् अन्यस्मै श्रावयन्तु',
  'support.way3Body': 'यत् अत्र लिखितम् अस्ति तत् बहूनां जनानां कार्ये आगन्तुं शक्नोति, यदि ते जानन्ति। कञ्चित् एतादृशं जनं वदन्तु यस्मै एषा वास्तविकी सहायतां ददाति।',
  'support.way4Title': 'अत्र आगत्य पश्यन्तु',
  'support.way4Body': 'यदि भवतां समीपे समयः अस्ति, तर्हि स्वयम् आगत्य पश्यन्तु यत् एषा जालपुटं सम्यक् चलति वा न वा। किमपि त्रुटियुक्तं दृश्यते तर्हि वदन्तु — निःशुल्कमेव तत् सम्यक् भविष्यति।',
  'support.contactTitle': 'किमपि वक्तव्यम् अस्ति?',
  'support.contactBody': 'कस्यापि वार्तायै अत्र लेखितुं शक्यते — त्रुटिः स्यात्, किमपि अधिकं प्राप्तं स्यात्, अथवा कश्चित् प्रश्नः स्यात्। यावत् लेखितुं सरलं भासते, तावदेव लिखन्तु।',
  'support.faqTitle': 'काश्चन वार्ताः याः पुनः पुनः पृच्छ्यन्ते',
  'support.faqBody': 'किम् एतत् वास्तवतः निःशुल्कम् अस्ति? आम्। किम् भवतां नाम गृह्यते? न, नाम दातुं आवश्यकं नास्ति। किम् विज्ञापनम् आगच्छति? न। कापि दूरभाषसङ्ख्या अथवा पता न याच्यते? न। किम् किमपि ऐप (App) डाउनलोड् करणीयम्? न, केवलं ब्राउज़र् मध्ये उद्घाट्यते।',
  'ask.label': 'स्वस्याः समस्यां लिखन्तु अथवा माइक-द्वारा वदन्तु',
  'ask.placeholder': 'यथा: बालकस्य अध्ययने दुर्बलता अस्ति',
  'ask.help': 'एण्टर् (Enter) दाबित्वा अपि प्रेषयितुं शक्यते।',
  'ask.send': 'पृच्छन्तु',
  'ask.sending': 'चिन्तयामः…',
  'ask.clear': 'लिखितं मार्जयन्तु',
  'ask.speak': 'वदित्वा पृच्छन्तु',
  'ask.listening': 'वक्तव्यं प्रारभत…',
  'ask.heard': 'श्रूयते',
  'ask.stopListening': 'श्रवणं स्थगयत',
  'ask.suggested': 'सामान्यप्रश्नाः',
  'ask.answerTitle': 'समाधानम्',
  'ask.listen': 'शृणुध्वम्',
  'ask.stopSpeak': 'स्थगयत',
  'ask.aiNote': 'इदम् उत्तरं VARSHA SAMADHAN AI इत्यनेन प्रदत्तम्। कस्यापि विशेषज्ञस्य परामर्शस्य विकल्पो नास्ति।',
  'ask.errorRateLimit': 'अतिबहुप्रश्नाः युगपत् प्रेषिताः। किञ्चित्कालानन्तरं प्रयतध्वम्।',
  'ask.errorNetwork': 'अन्तर्जालं न चलति। सम्पर्कं परीक्ष्य पुनः प्रयतध्वम्।',
  'ask.notAnswer': 'अस्य प्रश्नस्य सरलम् उत्तरं अस्माकं समीपे नास्ति।',
  'ask.emptyAnswer': 'अस्मिन् समये उत्तरं रचयितुं न शक्यते। किञ्चित् भिन्नतया पुनः पृच्छत।',
  'ask.micUnsupported': 'अस्मिन् ब्राउझर्-मध्ये वदित्वा पृच्छा न करिष्यति। लिखित्वैव पृच्छत।',
  'ask.heardWith': 'इदं श्रूयते:',
  'voice.notAllowed': 'माइक्रोफोन्-अनुज्ञा न प्राप्ता। उपरि गत्वा अनुज्ञां ददत, अथवा लिखित्वैव पृच्छत।',
  'voice.serviceNotAllowed': 'माइक्रोफोन्-अनुज्ञा न प्राप्ता। उपरि गत्वा अनुज्ञां ददत, अथवा लिखित्वैव पृच्छत।',
  'voice.noSpeech': 'किञ्चिदपि स्वरं न श्रुतम्। माइक्रोफोन्-समीपे वदत, अथवा लिखत।',
  'voice.audioCapture': 'कश्चिदपि माइक्रोफोन् न प्राप्तः। यन्त्रं संयोजयत, अथवा लिखित्वैव पृच्छत।',
  'voice.network': 'वदित्वा प्रष्टुम् अन्तर्जालम् आवश्यकम्, तत् तु न प्रचलति। लिखित्वैव पृच्छत — उत्तरं तथैव प्राप्स्यते।',
  'voice.aborted': 'विरामः जातः। पुनः प्रयतध्वम्।',
  'voice.unsupported': 'अस्मिन् ब्राउझर्-मध्ये वदित्वा पृच्छा न करिष्यति। लिखित्वैव पृच्छत।',
  'voice.speakFailed': 'इदम् उत्तरं श्रावयितुं न शक्यते।',
  'voice.noVoice': 'अस्मिन् यन्त्रे {name} भाषणस्वरः न प्राप्तः। अधुना लिखितं पठत, अथवा दूरभाषस्य विन्यासे गत्वा स्वरं योजयत।',
  'voice.generic': 'किञ्चित् त्रुटिः जाता। पुनः प्रयतध्वम्।',
  'sound.title': 'शान्त्यर्थं ध्वनिः',
  'sound.intro': 'शुल्कं नास्ति, विज्ञापनमपि नास्ति। केवलं मनः शान्त्यै।',
  'sound.playing': 'ध्वनिः प्रचलति। स्थगयितुम् तमेव बटनं पुनः नुदतु।',
  'sound.shankh': 'शङ्खः',
  'sound.shankhHint': 'गम्भीरः, दीर्घः',
  'sound.bansuri': 'वंशी',
  'sound.bansuriHint': 'कोमला, मन्दः',
  'sound.dhol': 'नगाडा',
  'sound.dholHint': 'तीक्ष्णा, तीव्रः',
  'sound.all': 'त्रयमपि',
  'sound.allHint': 'एकत्र',
  'sound.listenLabel': 'शृणुध्वम्',
  'sound.errUnsupported': 'अयम् ब्राउझर् ध्वनिं चालयितुं न शक्नोति।',
  'sound.errGeneric': 'ध्वनिचालने समस्या जाता।',
  'dhun.welcome': 'स्वागतम्',
  'dhun.prompt': 'शङ्खः, वंशी नगाडा च — एकत्र श्रोतुं स्पृशत।',
  'dhun.listen': '▶ शृणुध्वम्',
  'dhun.skip': 'ध्वनिं त्यजत',
  'dhun.failed': 'ध्वनिः चालितुं न शक्ता।',
  'dhun.label': 'ध्वनिचालनस्य अनुज्ञा',
  'reviews.title': 'भवतः अभिप्रायः, भवतः वचः',
  'reviews.intro': 'किम् इयं सेवा भवते उपयुक्ता? स्वकीयम् अभिप्रायं लिखत — नामोल्लेखः अनिवार्यः नास्ति।',
  'reviews.pageTitle': 'भवतः अभिप्रायः',
  'reviews.pageIntro': 'अत्र यत्िखितं तदेव यज्जनैः लिखितम्। कोऽपि अभिप्रायः न गोपनार्हः, यच्च लिखितं तत् अत्रैव दृश्यते — केवलम् एकवारं वीक्षणानन्तरं प्रकाश्यते।',
  'reviews.write': 'स्वकीयम् अभिप्रायं लिखत',
  'reviews.submit': 'प्रेषयत',
  'reviews.sending': 'प्रेष्यते…',
  'reviews.name': 'भवतः नाम (अनिवार्यं नास्ति)',
  'reviews.city': 'भवतः नगरम् (अनिवार्यं नास्ति)',
  'reviews.comment': 'भवतः वचः',
  'reviews.placeholder': 'मनसि यदागतं तदेव लिखत — किमपि सम्यग् कर्तुम् आवश्यकता नास्ति।',
  'reviews.moderated': 'भवतः समीक्षा प्रकाशनात् पूर्वं निरीक्ष्यते।',
  'reviews.moderationNote': 'अशिष्टता निवारणाय, प्रत्येका समीक्षा प्रकाशनात् पूर्वं निरीक्ष्यते। गाली, दूरभाष-क्रमाङ्कः अथवा वैयक्तिक-विषयाः निष्कास्यन्ते — अवशिष्टं सर्वं यथावत् प्रकाश्यते।',
  'reviews.summaryTitle': 'सामान्य-मतम्',
  'reviews.count': 'समीक्षाः',
  'reviews.anonymous': 'नामविहीनम्',
  'reviews.summaryLine': 'जनैः औसतन {rating} मध्ये 5 तारकाः प्रदत्ताः, कुलम् {count} समीक्षाः।',
  'reviews.starsLabel': '5 मध्ये {value} तारकाः',
  'reviews.keepLabel': 'सम्यक् वा असमीचीनम् — उभयमपि लिखन्तु',
  'reviews.ownerReply': 'उत्तरम्',
  'reviews.replyLabel': 'अत्र लिखितम्',
  'reviews.empty': 'अद्यावधि कापि समीक्षा नास्ति। प्रथमां भवान् लिखतु।',
  'reviews.toastSent': 'धन्यवादः',
  'reviews.toastFailed': 'मतं प्रेषितुं न शक्यते',
  'reviews.fieldTooShort': 'न्यूनतमं 10 अक्षराणि लिखन्तु।',
  'reviews.rateLimited': 'अतिशीघ्रं प्रेष्यते। किञ्चित् प्रतीक्ष्य पुनः प्रयत्नं कुर्वन्तु।',
  'cat.notFound': 'इदं पृष्ठं न प्राप्तम्',
  'cat.empty': 'अस्मिन् विषये अद्यावधि कोऽपि लेखः नास्ति।',
  'article.emergency': 'आवश्यकम्',
  'article.askAbout': 'अस्मिन् विषये पृच्छन्तु',
  'article.readAloud': 'इदं लेखं शृण्वन्तु',
  'article.others': 'अस्मिन् विषये अन्यलेखाः',
  'article.count': '{count} लेखाः',
  'theme.toLight': 'प्रकाश-दृश्यं प्रति गच्छन्तु',
  'theme.toDark': 'अन्धकार-दृश्यं प्रति गच्छन्तु',
  'toast.dismiss': 'पिधायताम्',
  'language.choose': 'स्वभाषां चिनुत',
  'language.articlesIn': 'इदं लेखं हिन्दी-भाषायाम् अस्ति।',
  'language.articlesInHint': 'प्रत्येकभाषायां पृथक् अनुवादः आवश्यकः। अयं अनुवादः अद्यावधि न कृतः — यत् लिखितं तत् हिन्दी-भाषायामेव पूर्णं सत्यं च अस्ति।',
  'ask.welcome': 'स्वागतम्! अधः स्वसमस्यां लिखन्तु अथवा विषयं चिनुत।',
  'ref.notTitle': 'इदं किं न करोति',
  'ref.not1': 'इदं वैद्यः नास्ति। औषध-परामर्शः कदापि न दीयते।',
  'ref.not2': 'इदं अधिवक्ता नास्ति। विधिक-परामर्शः न दीयते।',
  'ref.not3': 'किमपि शुल्कं न गृह्यते, न च विज्ञापनं दर्शयते।',
  'ref.not4': 'भवतः नाम, पता अथवा दूरभाष-क्रमाङ्कः न याच्यते न च रक्ष्यते।',
  'ref.not5': 'कापि सरकारी योजनायाः मूल्यं वा क्रमाङ्कं न निर्मीयते — यदि सत्यं न ज्ञायते तर्हि स्पष्टं कथ्यते यत् न ज्ञायते।',
  'ref.medicalTitle': 'आवश्यकम्: इदं वैद्यकीय-परामर्शः नास्ति',
  'ref.medicalBody': 'रोगः, औषधं वा विषयुक्त-वस्तुभिः सम्बद्धं किमपि चेत्, प्रथमं वैद्यं मिलन्तु। अत्र प्रदत्ता जानकारी केवलं सामान्य-सहायतायै अस्ति। शिशोः टीका, गर्भावस्था, अथवा किमपि औषधं आरभ्यमाणं पूर्वं वैद्यस्य परामर्शः अवश्यं स्वीक्रियताम्।',
  'ref.statsTitle': 'कियती जानकारी उपलभ्यते',
  'support.howTitle': 'अस्माकं सहायतां कथं कुर्वन्तु',
  'support.alwaysFreeTitle': 'इयं सेवा सर्वदा निःशुल्का भविष्यति',
  'support.alwaysFreeBody': 'या कापि सहायता प्राप्यते, सा सेवा-सञ्चालने प्रयोक्ष्यते। कस्मादपि कदापि शुल्कं न गृह्यते।',
  'smriti.eyebrow': 'आदराञ्जलिः',
  'smriti.whyTitle': 'इयं जालस्थलम् किमर्थम्',
  'smriti.ending': 'तेषां सङ्घर्षः अत्रैव अग्रे वर्धते।',
  'article.askAny': 'किमपि प्रश्नं पृच्छन्तु',
  'article.remember': 'स्मरन्तु',
  'article.emergencyInfo': 'आवश्यक-जानकारी',
  'article.medicalTitle': 'इदं चिकित्सा-परामर्शः नास्ति',
  'article.medicalBody': 'इयं जानकारी सामान्य-सहायतायै अस्ति। किमपि औषधं न आरभ्यन्तां न च स्थगयन्तु — प्रथमं वैद्यं मिलन्तु।',
  'article.heading': '{category} इत्यस्य लेखाः',
  'reviews.rateQuestion': 'कति तारकाः दास्यन्ति?',
  'reviews.starsShort': '{value} तारकाः',
  'reviews.averageOutOf': '5 मध्ये {value} तारकाः',
  'dhun.welcomeTitle': 'स्वागतम्',
  'dhun.consent': 'शङ्खः, वंशी, नगाडा च — सह श्रवणाय स्पृशन्तु।',
  'dhun.unsupported': 'अयं सङ्गणक-जाल-पटलः (ब्राउज़र) ध्वनिं न चालयति।',
  'dhun.failedTry': 'ध्वनि-चालने समस्या जाता।',
  'sound.hintIdle': 'ध्वनिं श्रोतुं कञ्चन बटनं नुदन्तु।',
  'sound.hintPlaying': 'ध्वनिः प्रचलति। स्थगयितुं पुनः तमेव बटनं नुदन्तु।',
  'sound.preparing': 'ध्वनिः सज्जीक्रियते',
  'nav.path': 'मार्गः',
  'health.heading': 'स्वकीयां वयः वदन्तु',
  'health.intro': 'वयः अनुसृत्य ये प्रश्नाः प्रायः पृच्छ्यन्ते, ते अत्र दृश्यन्ते। कञ्चन बटनं नुदन्तु — प्रश्नः अधः पूरितः भविष्यति, ततः पृच्छन्तु।',
  'health.ageLabel': 'वयः (वत्सराः)',
  'health.years': 'वत्सराः',
  'health.bandsLabel': 'वयः अनुसृत्य चिनुवन्तु',
  'health.notAdviceStrong': 'एषा चिकित्सा-परामर्शः नास्ति।',
  'health.notAdvice': 'कांऽपि औषधिं मा आरभन्तां मा वा स्थगयन्तु — पूर्वं वैद्यं मिलन्तु।',
  'health.emergencyStrong': 'आपातकाले दूरभाषं कुर्वन्तु:',
  'health.emergencyCall': '(आपातकालः)',
  'health.emergencyAmbulance': '(रुग्णवाहिका)',
  'health.emergencyWomen': '(महिला-सहायता-केन्द्रम्)',
  'health.privacy': 'नाम वा गृह-सङ्केतं लेखितुम् आवश्यकता नास्ति।',
  'health.band.infant.label': '0 – 2 वत्सराः',
  'health.band.infant.note': 'लघुशिशवः, ये स्वकीयां वार्तां वक्तुं न शक्नुवन्ति',
  'health.c.infant1': 'तीव्रज्वरः',
  'health.q.infant1': 'मम शिशोः तीव्रज्वरः अस्ति, किं दुग्धं दास्यामि?',
  'health.c.infant2': 'आहारं न खादति',
  'health.q.infant2': 'लघुशिशुः आहारं न खादति, किं करवाणि?',
  'health.c.infant3': 'वमनं भवति',
  'health.q.infant3': 'शिशोः वमनं भवति, कदा वैद्यं दर्शयामि?',
  'health.c.infant4': 'अतिसारः (दस्त)',
  'health.q.infant4': 'शिशोः अतिसारः अस्ति, किं भोजयामि?',
  'health.band.child.label': '3 – 12 वत्सराः',
  'health.band.child.note': 'बालकाः ये वक्तुं शक्नुवन्ति, परन्तु प्रश्नं प्रष्टुं बिभ्यति',
  'health.c.child1': 'अध्ययने मनः न',
  'health.q.child1': 'बालकस्य अध्ययने मनः न लगति, किं करवाणि?',
  'health.c.child2': 'विद्यालयं गन्तुं निराकरोति',
  'health.q.child2': 'बालकः प्रतिदिनं विद्यालयं गन्तुं निराकरोति, किं कारणं स्यात्?',
  'health.c.child3': 'रात्रौ ज्वरः',
  'health.q.child3': 'बालकाय रात्रौ ज्वरः आगच्छति, किं करवाणि?',
  'health.c.child4': 'दन्ताः पतन्ति',
  'health.q.child4': 'बालकस्य दन्ताः पतन्ति, दन्तानां रक्षणं कथं करवाणि?',
  'health.band.teen.label': '13 – 17 वत्सराः',
  'health.band.teen.note': 'किशोरवयस्काः, येभ्यः प्रायः कोऽपि श्रोता न लभ्यते',
  'health.c.teen1': 'अध्ययनस्य भारः',
  'health.q.teen1': 'अध्ययनस्य बहु भारः अस्ति, अस्य सामनां कथं करवाणि?',
  'health.c.teen2': 'निद्रा न आगच्छति',
  'health.q.teen2': 'रात्रौ निद्रा सम्यक् न आगच्छति, किं करवाणि?',
  'health.c.teen3': 'दूरभाषस्य व्यसनम्',
  'health.q.teen3': 'दूरभाषस्य व्यसनं जातम्, परित्यागस्य उपायं वदन्तु।',
  'health.c.teen4': 'अतीव विषादः',
  'health.q.teen4': 'अतीव विषादः अनुभूयते, केन सह सम्भाषणं करवाणि?',
  'health.band.young.label': '18 – 30 वत्सराः',
  'health.band.young.note': 'जीविका, धनं च निद्रा — त्रयाणामपि युगपत् भारः',
  'health.c.young1': 'कार्यस्य तनावः',
  'health.q.young1': 'कार्यस्य तनावः अतीव अस्ति, कथं न्यूनं करवाणि?',
  'health.c.young2': 'उपवेशनेन पृष्ठवेदना',
  'health.q.young2': 'उपविष्टवतः पृष्ठे वेदना भवति, किं करवाणि?',
  'health.c.young3': 'निद्रा न आगच्छति',
  'health.q.young3': 'रात्रौ निद्रा न आगच्छति, उपायः कः?',
  'health.c.young4': 'धनस्य न्यूनता',
  'health.q.young4': 'धनं न्यूनं व्ययः अधिकः, किं करोमि?',
  'health.band.middle.label': '३१ – ४५ वत्सराः',
  'health.band.middle.note': 'गृहं, बालकाः, स्वास्थ्यं च — सर्वेषां दायित्वं युगपत्',
  'health.c.middle1': 'कटिशूलम्',
  'health.q.middle1': 'कटिशूलं वर्तते, कारणं किं स्यात्?',
  'health.c.middle2': 'निद्रायाः अभावः',
  'health.q.middle2': 'निद्रा सम्यक् न आगच्छति, सुधारार्थं उपायः कः?',
  'health.c.middle3': 'गृहक्लेशः',
  'health.q.middle3': 'गृहक्लेशः अधिकः अस्ति, बालकान् कथं रक्षामि?',
  'health.c.middle4': 'उदरे वायुदोषः',
  'health.q.middle4': 'कार्यस्थले बहुवर्षेभ्यः उदरवायुदोषः अस्ति, किं करोमि?',
  'health.band.later.label': '४६ – ६० वत्सराः',
  'health.band.later.note': 'शरीरस्य वयः तस्य रक्षणं च — द्वयमपि सह',
  'health.c.later1': 'पृष्ठशूलम्',
  'health.q.later1': 'मम वयः ५४ वत्सराः, पृष्ठशूलं च अस्ति, किं करोमि?',
  'health.c.later2': 'जानुशूलम्',
  'health.q.later2': 'आरोहणे जानुशूलं भवति, कुतः?',
  'health.c.later3': 'रात्रौ पादसंकोचः',
  'health.q.later3': 'रात्रौ पादसंकोचः भवति, किं करोमि?',
  'health.c.later4': 'प्रातः स्तब्धता',
  'health.q.later4': 'प्रातः उत्थाने कट्यां स्तब्धता भवति, कारणं किं स्यात्?',
  'health.band.senior.label': '६१ – ७५ वत्सराः',
  'health.band.senior.note': 'औषधं, संतुलनं, एकाकीत्वं च — त्रयमपि सह',
  'health.c.senior1': 'चलने कष्टम्',
  'health.q.senior1': 'जानुशूलं तावदस्ति यत् चलनं कठिनम्, किं करोमि?',
  'health.c.senior2': 'औषधपरीक्षणम्',
  'health.q.senior2': 'प्रतिदिनं बहूनि औषधानि खादामि — हानिकारकं किं इति कथं ज्ञायते?',
  'health.c.senior3': 'रात्रौ मूत्रवेगः',
  'health.q.senior3': 'रात्रौ पुनः पुनः मूत्रवेगस्य कष्टम् अस्ति, किं करोमि?',
  'health.c.senior4': 'श्रवणदोषः',
  'health.q.senior4': 'अल्पं श्रूयते, श्रवणाय कश्चित् उपायं वदतु।',
  'health.band.elder.label': '७६ – १०० वत्सराः',
  'health.band.elder.note': 'प्रत्येकस्य औषधस्य परीक्षणम् आवश्यकं, पतनं च गम्भीरम्',
  'health.c.elder1': 'पतनभीतिः',
  'health.q.elder1': 'गृहे पतनभीतिः अस्ति, का सुरक्षा कर्तव्या?',
  'health.c.elder2': 'स्मृतिदौर्बल्यम्',
  'health.q.elder2': 'स्मृतिः क्षीयते, उपायः कः?',
  'health.c.elder3': 'दैनिकं वेदनानाशकम्',
  'health.q.elder3': 'वेदनानाशकम् औषधं प्रतिदिनं खादामि — अस्य काचित् हानिः अस्ति वा?',
  'health.c.elder4': 'वैद्यसमीपं कदा',
  'health.q.elder4': 'वैद्यसमीपं कदा गन्तव्यम्?',
  'ask.notConfigured': 'एषा सेवा अधुना स्वस्य पुरातन-उत्तरैः कार्यं करोति। भवतः प्रश्नः तत्र न लब्धः।',
  'ask.browseTitle': 'अत्र विद्यमानान् लेखान् पश्यन्तु',
  'download.pdf': 'PDF मध्ये लिखतु',
  'download.text': 'TEXT मध्ये लिखतु',
  'download.printNow': 'मुद्रणम् (Print) करोतु',
  'download.preparing': 'सिद्धं भवति',
  'download.blocked': 'नूतन-टैब न उद्घाटितः। Pop-up अवरुद्धम् अस्ति — स्वस्य ब्राउज़रे पृथक् टैब उद्घाटयतु।',
  'attach.button': 'स्वस्य दस्तावेज़ं वा चित्रं योजयतु',
  'attach.formats': 'PDF, चित्रं (JPG/PNG) वा TEXT सञ्चिका — १२ MB पर्यन्तम्',
  'attach.reading': 'पठति...',
  'attach.attached': 'योजितम्',
  'attach.remove': 'अपसारयतु',
  'attach.tooBigPdf': 'इदं PDF १२ MB तः बृहत्तरम् अस्ति। लघुतरं सञ्चिकां चिनुत।',
  'attach.tooBigImage': 'इदं चित्रं ३ MB तः बृहत्तरम् अस्ति। लघुतरं चित्रं चिनुत।',
  'attach.scannedPdf': 'इदं PDF स्कैन-कृतम् अस्ति — अत्र केवलं चित्रम् अस्ति, न पठितुं शक्यते। अस्य चित्रं प्रेषयन्तु।',
  'attach.pdfFailed': 'इदं PDF न पठितम्।',
  'attach.imageFailed': 'इदं चित्रं न लोड अभवत्।',
  'attach.wrongType': 'इयं सञ्चिका न कार्यं करिष्यति। PDF, चित्रं वा पाठ्य-सञ्चिकां प्रेषयन्तु।',
  'attach.hint': 'स्वपत्रम् अत्र योजयित्वा प्रश्नं पृच्छन्तु — वयं ततः एव उत्तरं दास्यामः।',
  'ask.sendWithFile': 'उत्तरम् इच्छामि',
  'lib.title': 'विनामूल्य-पुस्तकालयः',
  'lib.intro': 'अध्ययन-पुस्तकानि, चित्राणि, ध्वनयः च — सर्वं विनामूल्यं वैधानिकं च।',
  'lib.legalTitle': 'कॉपीराइट-स्य कोऽपि क्लेशः नास्ति।',
  'lib.legal': 'अत्र यत् किमपि दत्तम् अस्ति, तत् पूर्णतः विनामूल्यम् अस्ति तथा च भवान् एतत् अन्येभ्यः अपि दातुं शक्नोति। यत् पुस्तकम् अधुना कॉपीराइट-मध्ये अस्ति, तत् अत्र न भविष्यति — तत् भवान् प्रतिलिपिं कर्तुं न शक्नोति, एतत् स्पष्टं वक्तव्यम्।',
  'ask.signInFirst': 'पूर्वं लॉग-इन कुर्वन्तु, ततः प्रश्नं पृच्छन्तु।',
  'ask.signInTitle': 'पूर्वं लॉग-इन कुर्वन्तु',
  'ask.signInBody': 'प्रश्नं प्रष्टुं स्व-खातं रचयन्तु। अत्र एकनिमेषात् न्यूनः समयः लगति, भवान् च निरन्तरं प्रष्टुं शक्ष्यति।',
  'ask.signInCta': 'खातं रचयन्तु अथवा लॉग-इन कुर्वन्तु',
  'ask.signInOr': 'अधुना खातं रचयितुं न शक्नोति? एतत् कार्यम् अपि भवतः विना भविष्यति:',
  'account.title': 'मम खाता',
  'account.intro': 'स्वनाम-कूटशब्दौ प्रविश्य प्रश्नं प्रष्टुम् आरभन्ताम्।',
  'account.signIn': 'प्रविशन्तु',
  'account.register': 'खातं रचयन्तु',
  'account.signInNote': 'पूर्वतनं नाम कूटशब्दं च प्रविशन्तु।',
  'account.registerNote': 'प्रश्नं प्रष्टुं खाता अनिवार्यं नास्ति। एतत् केवलं भवतः भाषां तथा उत्तराणि स्मर्तुम् अस्ति।',
  'account.handle': 'भवतः नाम',
  'account.handlePlaceholder': 'यथा: sita.ji',
  'account.password': 'कूटशब्दः',
  'account.passwordHint': 'न्यूनतमं ६ अक्षराणि।',
  'account.phone': 'दूरभाष-सङ्ख्या',
  'account.optional': 'अनिवार्यं नास्ति',
  'account.phoneHint': 'दातुम् इच्छन्ति चेत् ददतु। दूरभाषं विनापि खाता भविष्यति।',
  'account.create': 'खातं रचयन्तु',
  'account.logout': 'बहिः गच्छन्तु',
  'account.open': 'खातं उद्घाटयन्तु',
  'account.signedInAs': 'भवान् लॉग-इन कृतवान् अस्ति',
  'account.signedOut': 'खातं न उद्घाटितम्',
  'account.signedOutBody': 'अधुना किमपि खातां न उद्घाटितम्।',
  'account.saved': 'सङ्ग्रहीतानि उत्तराणि',
  'account.savedEmpty': 'अधुना किमपि उत्तरं सङ्ग्रहीतं नास्ति। उत्तरम् आगते \'सङ्ग्रह\' इति नुदन्तु।',
  'account.savedUnavailable': 'सङ्ग्रहीतानि उत्तराणि अधुना न दृश्यन्ते। अन्यत् सर्वं कार्यं करोति।',
  'account.wait': 'कृपया प्रतीक्षां कुर्वन्तु…',
  'account.privacyTitle': 'भवतः वार्ताः सुरक्षिताः',
  'account.privacyBody': 'खातं रचयित्वा केवलं भवतः नाम, कूटशब्दः, भाषा च रक्ष्यते। प्रश्नस्य कोऽपि अभिलेखः न क्रियते। भवतः प्रश्नाः कस्मै अपि न प्रेष्यन्ते।',
  'account.errWrong': 'नाम अथवा कूटशब्दः त्रुटिपूर्णः अस्ति।',
  'account.errTaken': 'इदं नाम पूर्वमेव स्वीकृतम् अस्ति। अन्यं नाम चिनुत।',
  'account.errBad': 'सूचनां सम्यक् पूरयन्तु।',
  'account.errWait': 'अत्यधिकः प्रयासः कृतः। किञ्चित् कालानन्तरं प्रयासः कुर्वन्तु।',
  'account.errTryLater': 'अधुना न अभवत्। किञ्चित् कालानन्तरं प्रयासः कुर्वन्तु।',
  'lib.licence.ccBy': 'भवान् एतत् प्रतिलिपिं कर्तुं, प्रेषयितुं, मुद्रयितुं च शक्नोति — केवलं स्रोतस्य नाम दातव्यम्।',
  'lib.licence.ccBySa': 'भवान् एतत् प्रतिलिपिं मुद्रयितुं च शक्नोति। यत् परिवर्तनं करिष्यति, तत् अपि मुक्तहस्तेन दातव्यम्।',
  'lib.licence.ccZero': 'पूर्णतः विनामूल्यम्। स्रोतस्य नाम दातुमपि आवश्यकता नास्ति।',
  'lib.licence.pd': 'कस्यापि कॉपीराइट नास्ति — यः इच्छति सः प्रतिलिपिं कर्तुं शक्नोति।',
  'lib.licence.govtIndia': 'भारतसर्वकारस्य जालपुटे। पठनं मुद्रणं च उभयमपि विनामूल्यम्।',
  'lib.licence.creativeCommons': 'प्रत्येकस्याः सञ्चिकायाः स्वकीयं लाइसेंसम् अस्ति — सञ्चिकायां पश्यन्तु।',
  'lib.licence.freeToRead': 'पठनं विनामूल्यम्। प्रतिलिपिं कृत्वा अन्येभ्यः दातुमपि तस्यामेव शर्ते यस्यां प्राप्तम्।',
  'lib.openBadge': 'मुक्तम्',
  'lib.openBadgeNote': 'एतत् प्रतिलिपिं कर्तुं शक्यते',
  'lib.freeBadge': 'निःशुल्कम्',
  'lib.freeBadgeNote': 'पठितुं शक्यते, प्रतिलिपिं कर्तुं न शक्यते',
  'lib.govt': 'शासकीयम्',
  'lib.noSignup': 'पञ्जीकरणं विना',
  'lib.open': 'अत्र उद्घाटयतु',
  'lib.group.padhai': 'अध्ययनपुस्तकानि',
  'lib.group.padhai.note': 'विद्यालयस्य, महाविद्यालयस्य तथा शासकीयशिक्षणसामग्री',
  'lib.group.kitab': 'पुस्तकानि',
  'lib.group.kitab.note': 'येषां प्रतिलिपिस्वत्वं नास्ति अथवा येषां प्रतिलिपिं कर्तुम् अनुमतिः अस्ति',
  'lib.group.tasveer': 'चित्राणि तथा आकृतयः',
  'lib.group.tasveer.note': 'मानचित्राणि, चित्राणि, चिह्नानि — सर्वम्',
  'lib.group.audio': 'श्रव्यसामग्री',
  'lib.group.audio.note': 'पुस्तकानि श्रुत्वा, न तु बृहदक्षरैः',
  'lib.warnTitle': 'सर्वाणि पुस्तकानि अत्र न सन्ति',
  'lib.warn': 'कानिचन पुस्तकानि अधुना प्रतिलिपिस्वत्वस्य अन्तर्गतं सन्ति, अतः तानि नियमानुसारेण निःशुल्कं दातुं न शक्यन्ते। वयं तानि मुद्रेण न दर्शयामः। यदि किमपि पुस्तकम् आवश्यकं चेत् अधः प्रश्नं पृच्छतु — यः उत्तरं लब्धुं शक्यते, सः प्राप्स्यते।',
  'lib.askInstead': 'प्रश्नं पृच्छतु',
  'nav.library': 'पुस्तकालयः',
  'support.contactMessageLabel': 'भवतः विचारः',
  'support.contactPlaceholder': 'यत् किमपि लेखनीयं तत् लिखतु — यदि त्रुटिः अस्ति, यदि किमपि उत्तमं प्राप्तम्, अथवा कश्चित् प्रश्नः अस्ति।',
  'support.contactHelp': 'न्यूनतमं १० अक्षराणि। एतत् सीधे स्वामिनः समीपं गच्छति।',
  'support.contactSubmit': 'प्रेषयतु',
  'support.contactSending': 'प्रेष्यते...',
  'support.contactPrivacy': 'भवतः नाम लेखनम् आवश्यकं नास्ति।',
  'support.contactSent': 'प्राप्तम्',
  'support.contactSentBody': 'भवतः विचारः स्वामिनं प्राप्तः अस्ति।',
  'support.contactFailed': 'प्रेषितुं न शक्यते',
  'support.faq1Q': 'किम् एतत् सत्यमेव निःशुल्कम् अस्ति?',
  'support.faq1A': 'आम्। किमपि धनं न स्वीक्रियते, किमपि विज्ञापनं न दृश्यते, तथा कापि सदस्यता न स्वीक्रियते। एतत् एकस्य व्यक्तिस्य धनेन चलति, न तु कस्यापि कम्पनीयाः अथवा शासनस्य धनेन।',
  'support.faq2Q': 'किं मम नाम, पता अथवा दूरभाषसङ्ख्या स्वीक्रियते?',
  'support.faq2A': 'न, एतत् कदापि न स्वीकरिष्यते। एतत् जालस्थलम् स्वयमेव कापि पहचानं न निर्माति — न पञ्जीकरणम्, न ट्रैकिंग्। यत् पृच्छ्यते तत् केवलं भवतः प्रश्नः अस्ति तथा च यदा भवान् पृच्छति।',
  'support.faq3Q': 'किम् एतत् चिकित्सकः अथवा अधिवक्ता अस्ति?',
  'support.faq3A': 'न। एतत् न तु औषधस्य परामर्शं ददाति न च कानूनीपरामर्शम्। यत्र विषयः गम्भीरः भवति तत्र एतत् भवन्तं चिकित्सकस्य अथवा अधिकारिणः समीपं गन्तुं कथयति — एतत् तेषां स्थानं न गृह्णाति।',
  'support.faq4Q': 'किं प्रत्येकम् उत्तरं सत्यं भवति?',
  'support.faq4A': 'सर्वदा न। उत्तरं सङ्गणकः लिखति, न तु कश्चित् चिकित्सकः — अतः प्रत्येकम् उत्तरस्य सह एतत् लिखितम् अस्ति यत् एतत् चिकित्सापरामर्शः नास्ति। किमपि औषधं आरब्धुं वा बन्दं कर्तुं पूर्वं चिकित्सकेन सह अवश्यं मिलतु।',
  'support.faq5Q': 'किं मया किमपि ऐप डाउनलोड् करणीयम्?',
  'support.faq5A': 'न। एतत् केवलं ब्राउज़र् मध्ये उद्घाट्यते। किमपि ऐप इन्स्टॉल् न, कापि अनुमतिः न, किमपि अपडेट् न।',
  'nav.remedies': 'घरेलू-उपचाराः',
  'remedy.title': 'आयुर्वेदिक-घरेलू-उपचाराः',
  'remedy.intro': 'या कापि पीडा भवतु — कासः, शिरोवेदना, सन्धिवात, कण्डूयनम्, मधुमेहः, पृष्ठवेदना — अधः स्वपीडां चिनोतु अथवा स्वशब्दैः पृच्छतु। घरेलू-काथः, मालिशः, आहारः तथा आयुर्वेदिक-उपायः कथयिष्यन्ते।',
  'remedy.choose': 'स्वपीडां चिनोतु',
  'remedy.emergencyStrong': 'एतानि आपत्कालानि सन्ति:',
  'remedy.emergency': 'सर्पदंशः, वृश्चिकदंशः तथा श्वानदंशः — शीघ्रं चिकित्सालयं गच्छतु, प्रथमं 112 इति दूरभाषसङ्ख्यायां फोनं करोतु। घरेलू-उपायः केवलं मार्गे कर्तुं सन्ति, चिकित्सालयस्य स्थानं न।',
  'remedy.note': 'घरेलू तथा आयुर्वेदिक-उपायः पीडां न्यूनीकर्तुं साहाय्यं कुर्वन्ति; एते चिकित्सकस्य परीक्षणस्य तथा उपचारस्य स्थानं न सन्ति। किमपि औषधं स्वयमेव बन्दं वा आरम्भं वा न करोतु।',
  'remedy.cough': 'कासः',
  'remedy.headache': 'शिरोवेदना',
  'remedy.joints': 'सन्धिवात',
  'remedy.itching': 'कण्डूयनम्',
  'remedy.snake': 'सर्पदंशः',
  'remedy.scorpion': 'वृश्चिकदंशः',
  'remedy.dog': 'श्वानदंशः',
  'remedy.diabetes': 'मधुमेहः',
  'remedy.back': 'पृष्ठवेदना',
  'remedy.walking': 'चलने पीडा',
  'home.remedyNote': 'VARSHA SAMADHAN AI: काथः, मालिशः, आहारः तथा आयुर्वेदिक-उपायः — प्रत्येकं पीडाकृते, भवतः भाषायाम्।',
  'nav.aarti': 'आरती व भजन',
  'aarti.title': 'आरती व भजन — वास्तविक स्वरेषु',
  'aarti.intro': 'अत्र आरती, कीर्तनं भजनं च शृण्वन्तु — वास्तविकगायकानां मन्दिराणां च स्वरेषु। न किमपि AI स्वरम्।',
  'aarti.note': 'यन्त्रस्य स्वरेण आरती वा भजनं श्रावणं तस्य भावं भक्तिं च नश्यति। अतः अत्र केवलं वास्तविकध्वनिमुद्रणानि सन्ति।',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'ध्वनिमुद्रणम्:',
  'aarti.licence': 'अनुज्ञापत्रम्:',
  'aarti.listenLink': 'वास्तविक स्वरे शृण्वन्तु',
  'aarti.textChecked': 'इदं पारम्परिकं पाठम् अस्ति, यथा वास्तविकध्वनिमुद्रणे गीतम्।',
  'aarti.textPrinted': 'इदं प्रचलितं पाठम् अस्ति, प्रकाशितसंग्रहैः सह मिलित्वा परीक्षितम्।',
  'aarti.textNotStored': 'अस्य ग्रन्थस्य पूर्णपाठः अत्र न संगृहीतः — अधः ध्वनिमुद्रणे पूर्णपाठः श्रूयते।',
  'aarti.granthTitle': 'ग्रन्थः, चालीसा स्तोत्राणि च — वास्तविक स्वरेषु',
  'aarti.noRecording': 'अस्याः आरत्याः वास्तविकध्वनिमुद्रणं अद्यापि जालपुटे नास्ति, अतः अहं तत् गात्वा न श्रावयामि — AI स्वरः कदापि आरतीं न गायति।',
  'aarti.textOnlyTitle': 'अन्याः आरत्यः — पाठः अपि, वास्तविक स्वरः अपि',
  'aarti.fullText': 'पूर्णपाठः',
  'aarti.notChecked': 'अस्याः आरत्याः परीक्षितपाठः अद्यापि जालपुटे नास्ति। अपरीक्षितपाठस्य दानं न समीचीनम्, अतः सः न दीयते।',
  'aarti.verifiedList': 'जालपुटे एतासां आरत्यानां परीक्षितपाठः अस्ति:',

};

/* -------------------------------------------------------------------------- */
/* KASHMIRI                                                                  */
/* -------------------------------------------------------------------------- */

const KASHMIRI: Record<string, string> = {
  'jgd.placeSearch': 'شہرک ناو لِکھِو',
  'jgd.placeNoMatch': 'یہ شہر فہرستس منز چھُ نہ۔ نزدیکِک شہر منتخب کرِو۔',
  'account.name': 'تُہند ناو',
  'account.namePlaceholder': 'مثال: سیتا دیوی',
  'account.nameHint': 'یہ چھُ تُہنٛز شناختہ خٲطرٕ۔ کُنہِ تہِ ناوہ سٟتؠ گژھِ کٲم، تہِ یہِ چھُ نہ لازمی۔',
  'nav.home': 'گرٕ',
  'home.metaTitle': 'مُفت حل، پنٛنین لفظن مَنٛز',
  'lib.licence.ccZero.name': 'CC0 / پبلک ڈومین',
  'lib.licence.pd.name': 'پبلک ڈومین',
  'lib.licence.govtIndia.name': 'ہندوستان سرکار',
  'lib.licence.creativeCommons.name': 'کریٹیو کامنز (مِشِرت)',
  'lib.licence.freeToRead.name': 'پڑھنہ خٲطرٕ آزاد',
  'lib.entry.ncert.title': 'NCERT کتابہٕ — جماعت 1 پیٹھ 12 تام',
  'lib.entry.ncert.what': 'ہر مضمونٕچ تمام کتابہٕ، ہر جماعتہٕ خٲطرٕ۔ بغیر لاگ ان، سِیدھی PDF۔',
  'lib.entry.ncert.langs': 'ہندی، انگریزی تہِ 30 کھوتہٕ زیٛادٕ ہندوستانی زبانہٕ',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ڈیجیٹل نصابی کتابہٕ',
  'lib.entry.pm-evidya.what': 'NCERT کتابن ہنٛز ایپ، یَتھ منز وڑؠن اکھرن سٟتؠ پرِتھ ہیٚکِو۔ بوزِتھ تہِ ہیٚکِو۔',
  'lib.entry.pm-evidya.langs': 'ہندوستانی زبانہٕ',
  'lib.entry.diksha.title': 'DIKSHA — استادن تہِ بچن خٲطرٕ',
  'lib.entry.diksha.what': 'نصاب، ویڈیو تہِ مشقہٕ — جماعت 1 پیٹھ 12 تام۔',
  'lib.entry.diksha.langs': 'ہندوستانی زبانہٕ',
  'lib.entry.khan-academy.title': 'Khan Academy — انگریزی منز ریاضی تہِ سائنس',
  'lib.entry.khan-academy.what': 'ویڈیو سبق، ہر جماعتہٕ خٲطرٕ۔ پڑھن والین خٲطرٕ چھُ تحریری مواد تہِ موجود۔',
  'lib.entry.openstax.title': 'OpenStax — انگریزی منز مفت کتابہٕ',
  'lib.entry.openstax.what': 'کالج سطحٕچ کتابہٕ — ریاضی، سائنس، ہیومینٹیز۔ ہر صفحس پیٹھ PDF۔',
  'lib.entry.nios.title': 'NIOS — دور دراز تعلیم، مفت مواد',
  'lib.entry.nios.what': 'اوپن تہِ آن لائن کورسٕچ مفت کتابہٕ، بغیر داخلہ۔',
  'lib.entry.nios.langs': 'ہندی، انگریزی تہِ باقی',
  'lib.entry.ignou.title': 'IGNOU — بڑن سکولن ہنٛز مفت کتابہٕ',
  'lib.entry.ignou.what': 'دور دراز تعلیمٕچ کتابہٕ یۄس بالکل مفت چھِ۔',
  'lib.entry.gutenberg.title': 'Project Gutenberg — انگریزی ہنٛز پرانہٕ کتابہٕ',
  'lib.entry.gutenberg.what': '70,000 کھوتہٕ زیٛادٕ کتابہٕ، یمن ہنٛز کاپی رائٹ ختم گژھمژ چھِ۔ مفت ای-بُک تہِ آڈیو۔',
  'lib.entry.pratham-books.title': 'Pratham Books — بچن ہنٛز کتابہٕ',
  'lib.entry.pratham-books.what': 'ہندوستانی زبانن منز بچن ہنٛز کتابہٕ، بالکل مفت۔ جماعت 1 پیٹھ 5 تام۔',
  'lib.entry.pratham-books.langs': 'ہندی، مراٹھی، بنگالی، تمل، تیلگو تہِ باقی',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — اخبار تہِ پرانہٕ رسالہٕ',
  'lib.entry.internet-archive-texts.what': 'لکھن پرانہٕ کتابہٕ، رسالہٕ تہِ اخبار — مفت۔',
  'lib.entry.wikisource.title': 'Wikisource — عوامی ادبی مواد',
  'lib.entry.wikisource.what': 'کُنہِ قسمک کاپی رائٹ چھُ نہ — یہِ چھِ دنیاہٕچ پرانہٕ ادبی کتابہٕ۔',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ہر تصویر',
  'lib.entry.wikimedia-commons.what': 'نسل، نقشہ، ستارہ، تٲریخ — سب کچھ۔ ہر تصویرس پیٹھ الگ لائسنس چھُ۔',
  'lib.entry.pixabay.title': 'Pixabay — تصویرہٕ تہِ آرٹ',
  'lib.entry.pixabay.what': 'تصویرہٕ، ڈرائنگ تہِ مختصر ویڈیو۔',
  'lib.entry.unsplash.title': 'Unsplash — خوبصورت تصویرہٕ',
  'lib.entry.unsplash.what': 'مفت، وڑؠن اکھرن سٟتؠ، بغیر اکاؤنٹ۔',
  'lib.entry.openverse.title': 'Openverse — تمام تصویرہٕ اکھہ جایہ',
  'lib.entry.openverse.what': 'کئی مفت تصویرن ہنٛز ویب سائٹ اکھہ لٹہ تلاش کرِو۔',
  'lib.entry.librivox.title': 'LibriVox — آڈیو کتابہٕ',
  'lib.entry.librivox.what': 'پرانہٕ انگریزی کتابن ہُنٛد مفت آڈیو، انسانن ہنٛز آوازس منز۔',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — آڈیو مجموعہ',
  'lib.entry.internet-archive-audio.what': 'ہزارن مفت آڈیو — کتابہٕ، تقریر، موسیقی۔',
  'lib.entry.vande-mataram.title': 'Vande Mataram — قومی ترانہٕ تہِ گیت',
  'lib.entry.vande-mataram.what': 'ہندوستانٕچ قومی ترانہٕ تہِ باقی قومی گیت، مفت۔',
  'art.aag-aur-bijli-ke-bachav.title': 'آگ تہِ بجلی سٟتؠ بچاؤک اصول',
  'art.aag-aur-bijli-ke-bachav.summary': 'گھرس منز آگ لگنٕچ روک تھام — آسان اصول',
  'art.aag-lagne-par-kya-karein.title': 'آگ لگہِ تہِ کیا کرُن',
  'art.aag-lagne-par-kya-karein.summary': 'جلن والہٕ گھرس منز آگ — سبہِ کھوتہٕ برونٹھ کیا کرُن، کیا نہ کرُن',
  'art.bimari-se-bachav.title': 'بیماریہٕ پیٹھ بچنہٕ خٲطرٕ سات اصول',
  'art.bimari-se-bachav.summary': 'ہتھ چھلان، ماسک، ٹیکہٕ — وغیرہ سٟتؠ بچاؤ',
  'art.dhuwan-ka-jhakora.title': 'دھوٗنٕچ لہرہٕ پیٹھ بچاؤ',
  'art.dhuwan-ka-jhakora.summary': 'دم گژھن، ساہ نہٕ گژھن — کیا کٔرِو، کینہہ وقتہٕ ہسپتال گژھن',
  'art.doodh-pani-band-ho.title': 'بجلی یا آبہٕ ہند اچانک بند گژھن',
  'art.doodh-pani-band-ho.summary': 'کیا کٔرِو، کینہہ بچن، کینہہ وقتہٕ مدد منگن',
  'art.haath-ki-saafai.title': 'صٲبنہٕ بغیر ہتھ صاف کرنک طریقہٕ',
  'art.haath-ki-saafai.summary': 'ییلہٕ آب یا صٲبن نہٕ آسہِ',
  'cat.dhyan-aur-yoog.title': 'دھیان تہٕ یوگ',
  'cat.dhyan-aur-yoog.subtitle': 'منہٕ سکونہٕ خٲطرٕ آسان طریقہٕ',
  'cat.gharelu-marammat.title': 'گھرٕچ مرمت',
  'cat.gharelu-marammat.subtitle': 'گھرٕچ لۄکٹؠ مسلہٕ حل کرُن',
  'cat.bachchon-ki-padhai.title': 'بچن ہند پارُن',
  'cat.bachchon-ki-padhai.subtitle': 'پارنہٕ منز لگہِ، پریشان آسہِ',
  'cat.budharge-seva.title': 'بُڈؠ لُکن ہند خدمت',
  'cat.budharge-seva.subtitle': 'دیکھ بھال تہٕ مدد',
  'cat.shishu-dekhbhal.title': 'شِشُ دیکھ بھال',
  'cat.shishu-dekhbhal.subtitle': 'نٔو زامِت بچس صحیح دیکھ بھال',
  'cat.dharmik-upay.title': 'مذہبی طریقہٕ',
  'cat.dharmik-upay.subtitle': 'منہٕ سکونہٕ سٟتؠ',
  'cat.pavan-grah-aur-aarti.title': 'پاک کتاب تہٕ آرتی',
  'cat.pavan-grah-aur-aarti.subtitle': 'عقیدت سٟتؠ پرِو تہٕ بوزِو',
  'cat.aapatkalen-gayide.title': 'ہنگامی گائیڈ',
  'cat.aapatkalen-gayide.subtitle': 'ییلہٕ فوراً مدد گژھہِ',
  'cat.mahamari-suraksha.title': 'وبائی تحفظ',
  'cat.mahamari-suraksha.subtitle': 'بیماریہٕ پھیلنہٕ پیٹھ بچاؤ',
  'nav.tribute': 'یاد',
  'nav.help': 'مدد',
  'nav.reference': 'حوالہٕ',
  'nav.reviews': 'رائے',
  'nav.support': 'مدد کٔرِو',
  'nav.birthChart': 'زایہِ چکر',
  'jgd.title': 'تۄہند زایہِ چکر',
  'jgd.intro': 'پنُن ناو، زایہِ تٲریخ، تہٕ اگر ممکن آسہِ تہٕ زایہِ وقت تہٕ جاہ لِکھِو۔ سٲری حساب کتاب چھُ تۄہندِس فونَس پیٹھ گژھان — کینہہ تہٕ کانہہ جایہِ نہٕ چھُ گژھان۔',
  'jgd.nameLabel': 'زایہِ ناو',
  'jgd.namePlaceholder': 'مثلاً پورو ناو',
  'jgd.nameHint': 'یُس ناو بچپنَس منز اوس، سُے لِکھِو۔',
  'jgd.dateLabel': 'زایہِ تٲریخ',
  'jgd.timeLabel': 'زایہِ وقت',
  'jgd.timeHint': 'اگر نہٕ پتاہ، تہٕ خالی تھٲوِو۔',
  'jgd.placeLabel': 'زایہِ جاہ',
  'jgd.placeNone': 'پتاہ نہٕ / وُچھِو',
  'jgd.placeHint': 'زایہِ شہر وُچھِو۔',
  'jgd.submit': 'حساب کٔرِو',
  'jgd.savePdf': 'PDF بٔنایو',
  'jgd.again': 'نٔو حساب',
  'jgd.errDate': 'مہربٲنی کٔرِتھ زایہِ تٲریخ صحیح لِکھِو۔',
  'jgd.errPlace': 'زایہِ شہر فہرستہٕ وُچھِو، یا تَتھ نزدیک شہر وُچھِو۔',
  'jgd.numTitle': 'اعداد و شمار',
  'jgd.lifePath': 'زندگی ہند راستہٕ',
  'jgd.nameNumber': 'ناو نمبر',
  'jgd.soulNumber': 'روح نمبر',
  'jgd.birthdayNumber': 'زایہِ دۄہ نمبر',
  'jgd.astroTitle': 'ویدک جوتش',
  'jgd.nakshatra': 'نکشتر',
  'jgd.pada': 'پاد',
  'jgd.rashi': 'راشی',
  'jgd.rashiLord': 'راشی سوامی',
  'jgd.nakshatraLord': 'نکشتر سوامی',
  'jgd.lagna': 'لگن',
  'jgd.lagnaMissing': 'لگن کڈنہ خٲطرہ چھہ زایہِ وقت تہٕ جاے ضۆروٗری۔ پؠٹھہٕ یہِ پُر کٔرِتھ حساب کٔرِو، تہٕ اگر نہ زانِو تہٕ یہِ تہٕ چھہ کافی۔',
  'jgd.gunTitle': 'گُن مِلان',
  'jgd.gunIntro': 'بیٚسہِ شخٕص سٕند ناو تہٕ زایہِ تٲریخ لِکھِو۔',
  'jgd.gunName': 'تُہُنٛد ناو',
  'jgd.gunDate': 'تُہُنٛز زایہِ تٲریخ',
  'jgd.gunHint': 'اگر دۄشوٕنی ہُنٛد ناو تہٕ زایہِ تٲریخ آسہِ، تِلہِ گُن مِلان گژھہِ۔',
  'jgd.disclaimer': 'یہِ چھہ روایتس مطابق حساب، نہ کہ پیشین گوئی۔ کانہہ تہِ نمبر یا راشی چھنہٕ صحت، دولت یا رشتہ طے کران۔ بٔڈے فٲصلہٕ چھہِ ڈاکٹر، قانونی مشورہ یا تجربہ کار لوکن ہٕنٛدِ مشورٕ سٟتؠ کرُن۔',
  'nav.menu': 'مینو',
  'nav.openMenu': 'مینو کھولِو',
  'nav.closeMenu': 'مینو بند کٔرِو',
  'nav.expand': 'کھولِو',
  'nav.collapse': 'بند کٔرِو',
  'nav.skip': 'سیدھا موادَس پؠٹھ گژھِو',
  'nav.language': 'زبان بدلاوِو',
  'footer.pages': 'صفہٕ',
  'footer.helplines': 'ضروری نمبر',
  'footer.free': 'یہِ خدمت چھہِ مکمل مفت۔ کانہہ تہِ پیسہٕ چھنہٕ نوان۔',
  'footer.readStory': 'تمن ہٕنٛز پوٗرٕ کتھا پرِو',
  'footer.admin': 'انتظامیہ',
  'footer.rights': 'مفت خدمت',
  'footer.emergency': 'ہنگامی حالت',
  'footer.ambulance': 'ایمبولینس',
  'footer.women': 'زنانہ ہیلپ لائن',
  'home.dedication1': 'یادگارِ — اکھ مکمل مفت خدمت۔',
  'home.dedication2': 'پنُن مسلہٕ لِکھِو یا ونِو۔',
  'home.emergencyTitle': 'ضروری — فوراً مدد گژھہِ',
  'home.emergencyNote': 'یہِ چھہِ سارِوے کھوتہٕ برونٹھ پرُن۔ باقی چیزہٕ ہیٚکِو پتہٕ تہٕ وُچھِتھ۔',
  'home.readMore': 'پوٗرٕ جانکاری پرِو',
  'home.chooseTopic': 'کُنہِ موضوعس بارے منٛز جانُن چھہِ؟',
  'home.memorialEyebrow': 'یہِ سائٹ چھہِ کینہہ خٲطرہ',
  'home.memorialLine': 'تمن خٲطرہ یمن معاشرس خٲطرہ پوٗرٕ زندگی لڑٲئی کٔر، تہٕ یمن آخرس منٛز پنُن حق نہ ملہِ۔',
  'home.memorialMore': 'تمن ہٕنٛز پوٗرٕ کہانی پرِو',
  'home.kundaliTitle': 'زایہِ کنڈلی',
  'home.kundaliNote': 'پوٗرٕ کنڈلی — 9 گرہ، وِمشوتری دشا، پھلادیش، یوگ، شوشورگ، کے پی، لال کتاب تہٕ انک جوتش۔ سارِوے حساب چھہِ تُہندِ فونَس پؠٹھ گژھُن۔',
  'home.chooseTopicNote': 'تلہِ دِتِمتِ موضوعس پؠٹھ ٹیپ کٔرِو۔ ہر جاے چھہِ آسان زبان منٛز جانکاری دِتِمت۔',
  'home.askHere': 'یہِ موضوعس منٛز پُچھِو',
  'home.categoryEmpty': 'یہِ موضوعس منٛز چھہِ فی الحال کانہہ تہِ نہ لِکھِتھ۔',
  'home.soundTitle': 'سکون خٲطرہ آواز',
  'home.soundIntro': 'نہ کانہہ فیس، نہ کانہہ اشتہار۔ صرف من سکون خٲطرہ۔',
  'home.howTitle': 'یہِ خدمت کٔسِہ کٲم کران چھہِ',
  'home.step1Title': 'پنُن خیال لِکھِو یا ونِو',
  'home.step1Body': 'ہندی منٛز ٹائپ کٔرِو، یا مائک دَبٲوتھ ونِو۔ کانہہ خاص کرُن چھنہٕ ضۆروٗری — یُس منٛز چھہِ، سُہ لِکھِو۔',
  'home.step2Title': 'فوراً جواب ملان چھہِ',
  'home.step2Body': 'ہر سوال چھہِ درج گژھان تہٕ جواب فوراً ملان چھہِ۔ بٔڈس سوالہٕ برونٹھ چھہِ لۄکٹ سوالہٕ شروٗع کرُن بہتر۔',
  'home.step3Title': 'نہ کانہہ پیسہٕ، نہ کانہہ ذاتی جانکاری',
  'home.step3Body': 'یہِ خدمت چھہِ مکمل مفت۔ تُہُنٛد ناو، پتہٕ یا فون نمبر چھنہٕ مۄنگان، تہٕ کانہہ تہِ اشتہار چھنہٕ دِکھان۔',
  'home.stepLabel': 'مرحلہ',
  'home.freeTitle': 'یہِ خدمت چھہِ مکمل مفت',
  'home.freeBody': 'نہ کانہہ پیسہٕ چھہِ نوان، نہ کانہہ ذاتی جانکاری چھہِ مۄنگان، تہٕ نہ کانہہ اشتہار چھہِ دِکھان۔',
  'help.q1.label': 'بجلی گٔیہِ، کیا کٔرِو؟',
  'help.q1.question': 'گھر منز بجلی گژھہِ گژھِ۔ کیاہ کرُن چھُ، تہ موبائل فون کژھہِ چارج کرُن؟',
  'help.q2.label': 'بچہٕ سُند تعلیمی کمزوری',
  'help.q2.question': 'میہِ بچہٕ چھُ تعلیمی لحاظہٕ واریاہ کمزور۔ گھرس منز کژھہِ کرہِ سُدھار؟',
  'help.q3.label': 'بُزرگ سُند علاج',
  'help.q3.question': 'میہِ مول چھِ واریاہ وُڈھہِ گژھمژ، تمن ہُنٛد علاج کژھہِ کرہِ؟',
  'help.q4.label': 'گھرس منز آگِ لَگہِ تہ',
  'help.q4.question': 'اگر راتس منز گھرس منز آگِ لَگہِ تہ گژھہِ گۄڈنِ کیاہ کرُن؟',
  'help.title': 'پانہٕ پننہِ مشکلہِ ہِندِ بابت لِکھِو',
  'help.intro': 'تلہِ لِکھِو یا ونِو۔ اگر پتہٕ نہِ گژھہِ تہ یُس دلہِ منز چھُ سُہ لِکھِو — یُہ چھُ سارِوے کھوتہٕ اہم۔',
  'help.suggested': 'عام سوال',
  'help.howTitle': 'یہِ خدمت کژھہِ چھِ کٲم کران',
  'help.howBody': 'ہر سوال چھُ درج گژھان تہ تَتھ چھُ فوراً جواب ملان۔ تُہند ناو، پتہٕ یا فون نمبر چھُ نہِ کانہہِ جایہِ گژھان۔ سارِوے چھُ مفت۔',
  'ref.title': 'یہِ خدمت کیاہ چھِ، تہ کِس خٲطرٕ چھِ',
  'ref.intro': 'یہِ خدمت چھِ محترمہ VARSHA جی سٕندِ یادِ منز بناونہٕ آمژ۔ اتہِ چھُ سادٕ زبانِ منز وننہٕ آمُت زِ یہِ کیاہ چھِ کران، اتہِ کیاہ چھِ، تہ اَتھ کیاہ حد چھِ۔ سارِوے چھُ بالکل مفت — کانہہِ پئسہِ چھِ نہِ گژھان، کانہہِ اشتہار چھُ نہِ دِکھاونہٕ یِوان، تہ کانہہِ ذاتی معلومات چھِ نہِ گژھان۔',
  'ref.whatTitle': 'اَتھ منز کیاہ چھِ',
  'ref.what1': 'گھرس منز آگِ لَگہِ، بجلی گژھہِ، بچہٕ سُند تعلیمی کمزوری، مٲلِہِ سٕندِ دیکھ بھال — یِتھِ کِینِ عام مشکلن ہُنٛد سادٕ حل، صاف زبانِ منز۔',
  'ref.what2': 'سوال ونِتھ پُچھنہٕ ہُنٛد سہولت۔ اگر ونُن نہِ یِیہِ تہ لِکھِو — دۄنُی ہُنٛد جواب چھُ اکھِ پٲٹھِ ملان۔',
  'ref.what3': 'ہر سوال چھُ درج گژھان، تِہِندِ سٲتِ یُس باقی لوکن پریشان کران چھُ، سُہ چھُ تُہہِ کھوتہٕ برونٹھ پُچھنہٕ آمُت تہ تَتھ چھُ جواب ملِتھ۔',
  'ref.what4': 'کانہہِ اشتہار نہِ، کانہہِ فالتو اطلاع نہِ، تہ کانہہِ ذاتی معلومات چھِ نہِ گژھان۔ سارِوے مفت۔',
  'ref.helplineTitle': 'فوراً مدد خٲطرٕ یہِ نمبر تھاوِو',
  'ref.helpline1': 'اگر کانہہِ بٔڈِ خطرہِ گژھہِ — یِتھِ کِینِ آگِ، بجلی سُند جھٹکہِ، پٔرُن یا واریاہ خون گژھُن — تہ 112 نمبرس پؠٹھ فون کرِو۔',
  'ref.helpline2': 'اگر کانہہِ بیمار چھُ یا زخمی چھُ تہ ہسپتال وُنُک کانہہِ راستہِ چھُ نہِ، تہ 108 نمبرس پؠٹھ ایمبولینس منگوِو۔',
  'ref.helpline3': 'اگر کانہہِ زنانہِ سٲتِ کانہہِ بُرِ کٲم گژھہِ، یا زنانہِ کانہہِ پریشان کران چھِ، تہ 181 نمبرس پؠٹھ فون کرِو۔ یہِ چھُ مفت۔',
  'ref.helpline4': 'اگر بچہٕ یا بُزرگ سٲتِ کانہہِ ناانصافی گژھہِ، تہ 1098 نمبرس پؠٹھ شکایت کرِتھ یِیہِ۔',
  'ref.helpline5': 'اگر ذہنی دباؤ واریاہ چھُ، یا زِندٕ روزنُک دل چھُ نہِ کران، تہ 14416 نمبرس پؠٹھ ونِتھ یِیہِ۔ صرف گژھہِ کانہہِ سٲتِ کتھ کرُن۔',
  'ref.dataTitle': 'تُہہِ بابت اسہِ کیاہ تھاوان',
  'ref.dataBody': 'صرف سُہ سوال یُس تُہہِ پُچھُت، تَتھ ہُنٛد خلاصہِ، تہ سوال پُچھنُک وقت — تاکہ اسہِ گژھہِ نہِ بار بار اکھِ جواب دِتُن۔ تُہند ناو، پتہٕ، فون نمبر، یا کانہہِ شناخت ظاہر کرنہٕ وٲلِہِ معلومات چھِ نہِ گژھان۔ سائٹس پؠٹھ چھِ نہِ کانہہِ اشتہار یا ٹریکنگ سکرپٹ۔',
  'ref.adminTitle': 'انتظامیہ کیاہ کرِتھ چھِ',
  'ref.adminBody': 'انتظامیہ چھِ تِہِندِ مضمونن وُچھان یُس تُہہِ چھِو ترٲوتھ، تہ تمن ہُنٛد جواب لِکھان۔ تِہِندِ اجازتِ بٔغیر چھِ نہِ تِہِندِ کانہہِ مضمون بدلنُک یا ہٹاونُک حق، تہ تُہندِ معلومات چھِ نہِ کانہہِ سٲتِ ویچان۔',
  'ref.statsCategories': 'موضوع دستیاب چھِ',
  'ref.statsArticles': 'مضمون لِکھنہٕ آمتِ',
  'ref.statsQuestions': 'سوال پُچھنہٕ آمتِ',
  'ref.ownerNote': 'یہِ خدمت چھِ نہِ کانہہِ کمپنی ہٕنٛز، نہِ کانہہِ سرکار ہٕنٛز، بلکہ اکھِ فرد سٕندِ یادِ منز چلاونہٕ یِوان۔ تِہِندِ سٲتِ چھِ نہِ اتہِ کانہہِ اشتہار، کانہہِ ممبرشپ، تہ کانہہِ پئسہِ چھِ نہِ گژھان۔',
  'support.title': 'یہِ خدمت چھِ مفت',
  'support.intro': 'یہِ خدمت چھِ نہِ کانہہِ سٕندِ پئسہِ گژھان۔ مگر یہِ چھِ چلاونہٕ یِوان — تِہِندِ سٲتِ چھِ کٔنٛہہ طریقہِ یِمن سٲتِ تُہہِ مدد کرِتھ چھِو۔ سارِوے کھوتہٕ آسان طریقہِ چھُ سارِوے کھوتہٕ اہم۔',
  'support.waysTitle': 'تُہہِ کژھہِ کرِتھ چھِو مدد',
  'support.way1Title': 'پنُن تجربہِ لِکھِو',
  'support.way1Body': 'اگر اَتھ سائٹہِ سٲتِ تُہہِ کٔنٛہہ ٹھیک ملِتھ چھُ — یا کٔنٛہہ یُس تُہہِ الجھن منز ترٲوتھ چھُ — تہ رائے صفحس پؠٹھ لِکھِو۔ تُہند ناو ونُن چھُ نہِ ضروری۔',
  'support.way2Title': 'پننہِ شہرِ بابت ونِو',
  'support.way2Body': 'تُہہِ یتہِ چھِو روزان، تِتہِ ہٕنٛز زبان، رواج تہ مشکلہِ چھِ الگ۔ اگر تُہہِ ہٕنٛز کٔنٛہہ کتھ اتہِ چھِ نہِ، تہ ونِو — یُس جوڑُن گژھہِ سُہ جوڑنہٕ یِیہِ۔',
  'support.way3Title': 'پنُن تجربہِ باقی لوکن ونِو',
  'support.way3Body': 'یُس اتہِ لِکھِتھ چھُ سُہ چھُ واریاہ لوکن کٲم یِوان، اگر تمن پتہِ گژھہِ۔ کانہہِ یِتھِ کِینِ انسانس ونِو یُس اَتھ سٲتِ مدد حٲصل کرِتھ چھُ۔',
  'support.way4Title': 'اتہِ یِتھِ وُچھِو',
  'support.way4Body': 'اگر تُہہِ وقت چھُ، تہ پانہٕ یِتھِ وُچھِو زِ یہِ سائٹ ٹھیک چھِ نہِ چلاونہٕ یِوان۔ کٔنٛہہ خراب وُچھِو تہ ونِو — بالکل مفت ٹھیک گژھہِ۔',
  'support.contactTitle': 'کٔنٛہہ ونُن چھُ؟',
  'support.contactBody': 'کانہہِ کتھِ خٲطرٕ چھِو اتہِ لِکھِتھ — چاہے کانہہِ غلطی گژھہِ، چاہے کٔنٛہہ فالتو ملِتھ، یا کانہہِ سوال۔ یتہِ لِکھُن آسان گژھہِ، تِتہِ لِکھِو۔',
  'support.faqTitle': 'کٔنٛہہ کتھہِ یِمہِ بار بار پُچھنہٕ یِوان چھِ',
  'support.faqBody': 'کیاہ یہِ سچِہِ مفت چھِ؟ آ۔ کیاہ تُہند ناو وننہٕ یِوان چھُ؟ نہِ، ناو دِتُن چھُ نہِ ضروری۔ کیاہ اشتہار یِوان چھِ؟ نہِ۔ کانہہِ فون نمبر یا پتہِ چھُ نہِ گژھان؟ نہِ۔ کیاہ کانہہِ ایپ ڈاؤن لوڈ کرُن پٔرِ؟ نہِ، صرف براؤزر منز چھِ یہِ کھلان۔',
  'ask.label': 'پننہِ مشکلہِ لِکھِو یا مائک سٲتِ ونِو',
  'ask.placeholder': 'مثلاً: بچہٕ سُند تعلیمی کمزوری',
  'ask.help': 'انٹر دَبٲتِتھ تہ یِیہِ وننہٕ۔',
  'ask.send': 'پُچھِو',
  'ask.sending': 'سوچن چھِ…',
  'ask.clear': 'لِکھِتھ مِٹٲوِو',
  'ask.speak': 'ونِتھ پُچھِو',
  'ask.listening': 'بولن شرو کریو…',
  'ask.heard': 'بوزان چھس',
  'ask.stopListening': 'بوزن روکیو',
  'ask.suggested': 'عام سوال',
  'ask.answerTitle': 'حل',
  'ask.listen': 'بوزیو',
  'ask.stopSpeak': 'روکیو',
  'ask.aiNote': 'یہ جواب VARSHA SAMADHAN AI ہند طرفہ چھ۔ یہ چھنہ ماہرن ہند مشورن متبادل۔',
  'ask.errorRateLimit': 'زیادہ سوال چھ اکھ لٹہ ترہاونہ آمت۔ تھوڑا وقتہ پتہ کوشش کریو۔',
  'ask.errorNetwork': 'انٹرنیٹ چھنہ کام کران۔ کنکشن چیک کرتہ پتہ کوشش کریو۔',
  'ask.notAnswer': 'اسہ چھنہ یہ سوال سیدھہ جواب۔',
  'ask.emptyAnswer': 'یہ لٹہ جواب چھنہ بنہمت۔ تھوڑا الگ طریقہ سیت پریتھ پچھو۔',
  'ask.micUnsupported': 'یہ براؤزر چھنہ بولتھ پچھنک سہولت دیت۔ لکھتھ پچھیو۔',
  'ask.heardWith': 'یہ چھ بوزان:',
  'voice.notAllowed': 'مائک ہند اجازت چھنہ ملہمت۔ بونہ کنہ اجازت دیو، یا لکھتھ پچھیو۔',
  'voice.serviceNotAllowed': 'مائک ہند اجازت چھنہ ملہمت۔ بونہ کنہ اجازت دیو، یا لکھتھ پچھیو۔',
  'voice.noSpeech': 'کاہ آواز چھنہ بوزنہ آمت۔ مائک نزدیک بولیو، یا لکھیو۔',
  'voice.audioCapture': 'کاہ مائک چھنہ لبہمت۔ ڈیوائس جوڑیو، یا لکھتھ پچھیو۔',
  'voice.network': 'بولتھ پچھنہ خاطر چھ انٹرنیٹ ضرورت، تہ چھنہ کام کران۔ لکھتھ پچھیو — جواب چھ وہی ملن۔',
  'voice.aborted': 'روک گیو۔ دوبارہ کوشش کریو۔',
  'voice.unsupported': 'یہ براؤزر چھنہ بولتھ پچھنک سہولت دیت۔ لکھتھ پچھیو۔',
  'voice.speakFailed': 'یہ جواب چھنہ بوزنہ آمت۔',
  'voice.noVoice': 'یہ ڈیوائسس منز چھنہ {name} ہند آواز ملہمت۔ فی الحال لکھتھ پڑھو، یا فون ہند سیٹنگس منز آواز جوڑیو۔',
  'voice.generic': 'کچھ گژھہ خرابی۔ دوبارہ کوشش کریو۔',
  'sound.title': 'سکونہ خاطر آواز',
  'sound.intro': 'کاہ فیس نہ، کاہ اشتہار نہ۔ صرف من سکونہ خاطر۔',
  'sound.playing': 'آواز چھ چلان۔ روکنہ خاطر دوبارہ وہی بٹن دبیو۔',
  'sound.shankh': 'شنگھ',
  'sound.shankhHint': 'گہہ، زیٹھ',
  'sound.bansuri': 'بانسری',
  'sound.bansuriHint': 'نرم، ہولہ',
  'sound.dhol': 'نگاڑہ',
  'sound.dholHint': 'تیکھ، تیز',
  'sound.all': 'ترے',
  'sound.allHint': 'اکھ ساتھ',
  'sound.listenLabel': 'بوزیو',
  'sound.errUnsupported': 'یہ براؤزر چھنہ آواز چلاوتھ۔',
  'sound.errGeneric': 'آواز چلاونہ منز گژھہ مسئلہ۔',
  'dhun.welcome': 'خوش آمدید',
  'dhun.prompt': 'شنگھ، بانسری تہ نگاڑہ — ساتھ بوزنہ خاطر چھویو۔',
  'dhun.listen': '▶ بوزیو',
  'dhun.skip': 'آواز چھوڑیو',
  'dhun.failed': 'آواز چھنہ چلیہمت۔',
  'dhun.label': 'آواز چلاونہ ہند اجازت',
  'reviews.title': 'تہند رائے، تہند کتھ',
  'reviews.intro': 'کیا یہ خدمت تہند کام آیہ؟ پنن کتھ لکھیو — تہند ناو لکھن چھنہ ضروری۔',
  'reviews.pageTitle': 'تہند رائے',
  'reviews.pageIntro': 'یہ چھ وہی لکھتھ یوس لوکن لکھمت چھ۔ کاہ رائے چھنہ چھپاونہ یوان، تہ یوس لکھتھ چھ وہہ اتہ چھ وچھنہ یوان — صرف اکھ لٹہ وچھنہ پتہ چھ یہ شائع کرنہ یوان۔',
  'reviews.write': 'پنن رائے لکھیو',
  'reviews.submit': 'ترہیو',
  'reviews.sending': 'ترہاونہ چھ…',
  'reviews.name': 'تہند ناو (ضروری نہ)',
  'reviews.city': 'تہند شہر (ضروری نہ)',
  'reviews.comment': 'تہند کتھ',
  'reviews.placeholder': 'یوس منس آیہ وہی لکھیو — کچھ صحیح کرنک چھنہ ضرورت۔',
  'reviews.moderated': 'تہندِ رائے چھِ شائع گژھنہٕ برونٹھ اکھ لٹہٕ وچھنہٕ یوان۔',
  'reviews.moderationNote': 'کُنہِ قسمکِ غلط مواد روکنہٕ خٲطرٕ چھِ ہر اکھ رائے شائع گژھنہٕ برونٹھ وچھنہٕ یوان۔ گال، نمبر یا ذاتی گژھن وٲلِہِ چیزہٕ چھِ کڈنِ یوان — باقی سارِے چھِ یتھٕے شائع گژھان۔',
  'reviews.summaryTitle': 'عام رائے',
  'reviews.count': 'رائے',
  'reviews.anonymous': 'بغیر ناوٕ',
  'reviews.summaryLine': 'لوکن دِژِتھ چھِ اوسطاً {rating} تارہٕ 5 مَنٛز، کُل {count} رائے۔',
  'reviews.starsLabel': '5 مَنٛز {value} تارہٕ',
  'reviews.keepLabel': 'اگر کُنہِ چیزس پؠٹھ خوش چھِو یا ناراض — دۄشوے لِکھِو',
  'reviews.ownerReply': 'جواب',
  'reviews.replyLabel': 'یہِ چھُ اَتھ پؠٹھ لِکھنہٕ آمت',
  'reviews.empty': 'حالِہ کُنہِ رائے چھنہٕ۔ گۄڈنِک تُہؠ لِکھِو۔',
  'reviews.toastSent': 'بڑِ مہربٲنی',
  'reviews.toastFailed': 'رائے نہٕ ہیٚکِہِ ترٲوتھ',
  'reviews.fieldTooShort': 'کم از کم 10 اکھر لِکھِو۔',
  'reviews.rateLimited': 'بہُت تیزی سٟتِ چھُ یوان ترٲونہٕ۔ تھوڑِہِ رُکِتھ کٔرِو کوشش۔',
  'cat.notFound': 'یہِ صفحہٕ چھُنہٕ لبنہٕ آمت',
  'cat.empty': 'اَتھ موضوعس پؠٹھ چھُنہٕ حالِہ کُنہِ مضمون۔',
  'article.emergency': 'ضروری',
  'article.askAbout': 'اَتھ موضوعس پؠٹھ پُچھِو',
  'article.readAloud': 'یہِ مضمون بوزِو',
  'article.others': 'اَتھ موضوعس پؠٹھ باقی مضمون',
  'article.count': '{count} مضمون',
  'theme.toLight': 'روشنِ ہُنٛد نظارہ وُچھِو',
  'theme.toDark': 'تارِک نظارہ وُچھِو',
  'toast.dismiss': 'بند کٔرِو',
  'language.choose': 'پنُن زبانہٕ وُچھِو',
  'language.articlesIn': 'یہِ مضمون چھُ ہندی زبانہٕ مَنٛز۔',
  'language.articlesInHint': 'ہر زبانہٕ مَنٛز چھُ الگ ترجمہٕ درکار۔ یہِ ترجمہٕ چھُنہٕ حالِہ گژھنہٕ آمت — یُس لِکھنہٕ چھُ، سہُ ہندی مَنٛز چھُ پورٕ تہٕ صحیح۔',
  'ask.welcome': 'تُہنٛز خیر مقدم! تل پنُن مسئلہٕ لِکھِو یا کُنہِ موضوعس پؠٹھ وُچھِو۔',
  'ref.notTitle': 'یہِ کیا چھُنہٕ کران',
  'ref.not1': 'یہِ چھُنہٕ ڈاکٹر۔ دوٲئی ہُنٛد مشورہٕ چھُنہٕ کُنہِ حالس مَنٛز دِنہٕ یوان۔',
  'ref.not2': 'یہِ چھُنہٕ وکیل۔ قانونی مشورہٕ چھُنہٕ دِنہٕ یوان۔',
  'ref.not3': 'کُنہِ قسمکِہِ پیسن ہُنٛد مطالبہٕ چھُنہٕ کرنہٕ یوان، تہٕ نہٕ کُنہِ قسمکِہِ اشتہار دِکھنہٕ یوان۔',
  'ref.not4': 'تُہُنٛد ناو، پتہٕ یا فون نمبر چھُنہٕ منگنہٕ یوان تہٕ نہٕ چھُنہٕ کُنہِ جاے تھاونہٕ یوان۔',
  'ref.not5': 'کُنہِ سرکاری سکیمکِہِ قیمت یا نمبر چھُنہٕ بناونہٕ یوان — اگر صحیح جانکاری نہٕ آسہِ، تِلہِ چھُ صاف وننہٕ یوان زِ یہِ چھُنہٕ معلوم۔',
  'ref.medicalTitle': 'ضروری: یہِ چھُنہٕ ڈاکٹر سُنٛد مشورہٕ',
  'ref.medicalBody': 'بیمٲری، دوٲئی یا کُنہِ زہریلی چیزس متعلق اگر کُنہِ قسمکِہِ مددِ ہُنٛد سوال آسہِ، تِلہِ گژِھ ڈاکٹرس سٟتِ مِلُن۔ یتہِ دِنہٕ آمتِہِ جانکاری چھِ صرف عام مددِ خٲطرٕ۔ بچن ہنٛد ٹیکہٕ، حمل، یا کُنہِ دوٲئی شروٗع کرنہٕ برونٹھ گژِھ ڈاکٹرس سٟتِ مشورہٕ ضرور کرُن۔',
  'ref.statsTitle': 'کتِہِ جانکاری چھِ موجود',
  'support.howTitle': 'اسہِ کِتھ کٔنِہ مدد کٔرِو',
  'support.alwaysFreeTitle': 'یہِ خدمت چھِ ہمیشہ مفت',
  'support.alwaysFreeBody': 'یُس کُنہِ قسمکِہِ مدد مِلِہ، سہِ چھِ خدمتِ ہُنٛد نظام چلاونہٕ خٲطرٕ استعمال گژھان۔ کُنہِ سٟتِ کُنہِ قسمکِہِ پیسن ہُنٛد مطالبہٕ کرنہٕ ییہِ نہٕ۔',
  'smriti.eyebrow': 'خراجِ تحسین',
  'smriti.whyTitle': 'یہِ سائٹ کیازِ چھِ',
  'smriti.ending': 'تہندِ جدوجہد چھِ یتہِ پؠٹھہٕ برونٹھ پکُن۔',
  'article.askAny': 'کُنہِ قسمکِہِ سوال پُچھِو',
  'article.remember': 'یاد تھاوِو',
  'article.emergencyInfo': 'ضروری جانکاری',
  'article.medicalTitle': 'یہِ چھُنہٕ طبی مشورہٕ',
  'article.medicalBody': 'یہِ جانکاری چھِ صرف عام مددِ خٲطرٕ۔ کُنہِ قسمکِہِ دوٲئی شروٗع یا بند نہٕ کٔرِو — برونٹھ ڈاکٹرس سٟتِ مِلِو۔',
  'article.heading': '{category} ہنٛد مضمون',
  'reviews.rateQuestion': 'کتِہِ تارہٕ دِو؟',
  'reviews.starsShort': '{value} تارہٕ',
  'reviews.averageOutOf': '5 مَنٛز {value} تارہٕ',
  'dhun.welcomeTitle': 'خیر مقدم',
  'dhun.consent': 'شنگھ، بانسری تہٕ نگاڑہٕ — رلِتھ بوزنہٕ خٲطرٕ چھوِو۔',
  'dhun.unsupported': 'یہ براؤزر آواز چلانے سے قاصر ہے۔',
  'dhun.failedTry': 'آواز چلانے میں مسئلہ پیش آیا۔',
  'sound.hintIdle': 'کوئی بٹن دبا کر آواز سنیں۔',
  'sound.hintPlaying': 'آواز چل رہی ہے۔ روکنے کے لیے دوبارہ اسی بٹن کو دبائیں۔',
  'sound.preparing': 'آواز تیار ہو رہی ہے',
  'nav.path': 'رست',
  'health.heading': 'پنٕنہِ وٲنٛس ვٔچھیو',
  'health.intro': 'عمرہ ہندٕ حسابہٕ یم سوالہٕ اکثر پٔرِژھنہٕ یوان چھِ، سہِ یتھہِ وُچھِو۔ کانہہ بٹن دَبِیو — سوالہٕ چھُ بۄنہِ پٔرِتھ گژھُن، تِہِ پتہٕ پٔرِژھِو۔',
  'health.ageLabel': 'وٲنٛس (ؤری)',
  'health.years': 'ؤری',
  'health.bandsLabel': 'وٲنٛس مطٲبق ژَرِو',
  'health.notAdviceStrong': 'یہ طبی مشورہ نہیں ہے۔',
  'health.notAdvice': 'کانٛہہ تہِ دَوا کۆرِو نہٕ شۆروٗع یا بَنٛد — برٛونٛہہ کٔنؠ وٕچھِو دۄکتر سٕتی۔',
  'health.emergencyStrong': 'ہنگامی حالَتس مَنٛز کٔرِو فون:',
  'health.emergencyCall': '(ہنگامی حالت)',
  'health.emergencyAmbulance': '(ایمبولینس)',
  'health.emergencyWomen': '(زنانہِ ہیلپ لائن)',
  'health.privacy': 'کانٛہہ ناو یا پتہٕ لېکھنٕچ ضۆروٗرت چھہِ نہٕ۔',
  'health.band.infant.label': '0 – 2 ؤری',
  'health.band.infant.note': 'لۄکٕٹ بٔچِہ، یم پنٕنِہ کتھہِ ہیکَن نہِ ونِتھ',
  'health.c.infant1': 'تیز تپ',
  'health.q.infant1': 'مؠ سنٛدِس شُرِس چھُ تیز تپ، کیا دِمہِ دوٗد؟',
  'health.c.infant2': 'قوت چھُ نہٕ کھۄوان',
  'health.q.infant2': 'لۭکُٹ شُرُ چھُ نہٕ قوت کھۄوان، کیا کَرِہٕ؟',
  'health.c.infant3': 'قے گژھان چھےٚ',
  'health.q.infant3': 'شُرِس چھِ قے گژھان، کب وٕچھاوہِ دۄکترس?',
  'health.c.infant4': 'پٲش گژھان چھےٚ',
  'health.q.infant4': 'شُرِس چھِ پٲش گژھان، کیا کھایاوہِ؟',
  'health.band.child.label': '3 – 12 ؤری',
  'health.band.child.note': 'شُرؠ یِم ვ۪تھ چھِ ہیکان، مگر سوال پچھنہٕ سۭتی چھِ ترسان',
  'health.c.child1': 'پۆرتھ مَنٛز چھُ نہٕ دل لگان',
  'health.q.child1': 'شُرٕ سنٛد پۆرتھ مَنٛز چھُ نہٕ دل لگان، کیا کَرِہٕ؟',
  'health.c.child2': 'اسکول گژھنہٕ سۭتی چھُ کَران انکار',
  'health.q.child2': 'شُرُ چھُ دۄہہ دۄہہ اسکول گژھنہٕ سۭتی کَران انکار، کیا وجہ ہیٚکہِ آسِتھ؟',
  'health.c.child3': 'راتس مَنٛز تپ',
  'health.q.child3': 'شُرِس چھُ راتس مَنٛز تپ یوان، کیا کَرِہٕ؟',
  'health.c.child4': 'دۆدٕ روٗٹ چھِ پگان',
  'health.q.child4': 'شُرٕ سنٛدؠ دۆدٕ روٗٹ چھِ پگان، دۆدٕ روٗٹن ہُنٛد خیٚال کِتھ کٔنؠ رۆکھِو؟',
  'health.band.teen.label': '13 – 17 ؤری',
  'health.band.teen.note': 'نوجوان، جنہیں اکثر کوئی ایسا شخص نہیں ملتا جو ان کی بات سن سکے',
  'health.c.teen1': 'پۆرتھ ہُنٛد دَب',
  'health.q.teen1': 'پۆرتھ ہُنٛد چھُ سٔزیٛادٕ دَب، یِم کِتھ کٔنؠ سہۆד کَرِہٕ؟',
  'health.c.teen2': 'نِنٛد چھِ نہٕ یوان',
  'health.q.teen2': 'راتس چھِ نہٕ نِنٛد پوٗرٕ یوان، کیا کَرِہٕ؟',
  'health.c.teen3': 'موبایل ہُنٛد عادَت',
  'health.q.teen3': 'موبایل ہُنٛد چھُ عادَت پٔלؠ گومُت، تروُنچ ریتھ ვٔچھیو۔',
  'health.c.teen4': 'سٔزیٛادٕ پٲری',
  'health.q.teen4': 'بہت اداسی محسوس ہوتی ہے، میں کس سے بات کروں؟',
  'health.band.young.label': '18 – 30 ؤری',
  'health.band.young.note': 'نوکری، پَیسہٕ تہٕ نِنٛد — ترٛیٚیؠ چھِ اَکھ لؠٹھ بُوجھ',
  'health.c.young1': 'کٲم ہُنٛد دَب',
  'health.q.young1': 'کٲم ہُنٛد چھُ سٔزیٛادٕ دَب، کم کِتھ کٔنؠ کَرِہٕ؟',
  'health.c.young2': 'بہنہٕ سۭتی پُٹ دۆرد',
  'health.q.young2': 'تسلسل بہنہٕ سۭتی چھُ پُٹِس مَنٛز دۆرد گژھان، کیا کَرِہٕ؟',
  'health.c.young3': 'نِنٛد چھِ نہٕ یوان',
  'health.q.young3': 'راتس نِند چھہ نہ یوان، کیاہ چھہ علاج؟',
  'health.c.young4': 'پیسہ چھہ کم',
  'health.q.young4': 'پیسہ چھہ کم تہ خرچ چھہ زیڈہ، کیاہ کرہ؟',
  'health.band.middle.label': '31 – 45 ؤری',
  'health.band.middle.note': 'گھر، اولاد تہ پنن صحت — سارنی ہند ذمہ داری اکھ ساتھ',
  'health.c.middle1': 'کمرہ منز درد',
  'health.q.middle1': 'کمرہ منز چھہ درد گژھان، کیاہ ہیہ سبب ٲستھ؟',
  'health.c.middle2': 'نِند چھہ نہ ٹھیک',
  'health.q.middle2': 'نِند چھہ نہ ٹھیک یوان، بہتر کرنہٕ خٲطرٕ کیاہ کرہ؟',
  'health.c.middle3': 'گھرک تناؤ',
  'health.q.middle3': 'گھرہ منز چھہ زیڈہ تناؤ، اولاد کٮ۪تھ سنبھالے؟',
  'health.c.middle4': 'پیٹہ منز گیس',
  'health.q.middle4': 'کامس پؠٹھ چھہ کٮ۪ن ؤرؠن پیٹہ منز گیسک مسئلہ، کیاہ کرہ؟',
  'health.band.later.label': '46 – 60 ؤری',
  'health.band.later.note': 'جسمک عمر تہ تیمس سنبھالُن — دونے اکھ ساتھ',
  'health.c.later1': 'پٔٹھس منز درد',
  'health.q.later1': 'مےٚ چھہ 54 ؤری عمر تہ پٔٹھس منز چھہ درد، کیاہ کرہ؟',
  'health.c.later2': 'گھٹنن منز درد',
  'health.q.later2': 'گھٹنن منز چھہ درد گژھان ییلہ زینہٕ پؠٹھ گژھہ، کیاہ وجہ؟',
  'health.c.later3': 'راتس پؠٹھس منز کھن',
  'health.q.later3': 'راتس چھہ پؠٹھس منز کھن گژھان، کیاہ کرہ؟',
  'health.c.later4': 'سحرہ جکڑن',
  'health.q.later4': 'سحرہ ؤتھتھ چھہ کمرہ منز جکڑن گژھان، کیاہ ہیہ سبب ٲستھ؟',
  'health.band.senior.label': '61 – 75 ؤری',
  'health.band.senior.note': 'دوا، توازن تہ تنہائی — ترے اکھ ساتھ',
  'health.c.senior1': 'پتھن منز تکلیف',
  'health.q.senior1': 'گھٹنن منز چھہ اتھہ زیڈہ درد زہ پتھن چھہ مشکل، کیاہ کرہ؟',
  'health.c.senior2': 'دواہ ہند جانچ',
  'health.q.senior2': 'روزہ چھہ واریاہ دواہ کھینہٕ یوان — کٮ۪تھ پتہ لگہ ز کانہہ نقصان دہ چھہ؟',
  'health.c.senior3': 'راتس پیشاب',
  'health.q.senior3': 'راتس چھہ بار بار پیشابک مسئلہ، کیاہ کرہ؟',
  'health.c.senior4': 'کم بوزُن',
  'health.q.senior4': 'کم چھہ بوزان، بوزنہٕ خٲطرٕ کانہہ طریقہ ؤنِو۔',
  'health.band.elder.label': '76 – 100 ؤری',
  'health.band.elder.note': 'ہر دواہ ہند جانچ ضروری، ہر پٔتھ گژھن چھہ خطرناک',
  'health.c.elder1': 'پٔتھنک ڈر',
  'health.q.elder1': 'گھرہ منز پٔتھنک ڈر چھہ، کیاہ احتیاط کرہ؟',
  'health.c.elder2': 'یادداشت کمزور',
  'health.q.elder2': 'یادداشت چھہ کمزور گژھان، کیاہ علاج چھہ؟',
  'health.c.elder3': 'روزہ دردک دوا',
  'health.q.elder3': 'دردک دوا چھہ روزہ کھینہٕ یوان — کیاہ اتھہ کانہہ نقصان چھہ؟',
  'health.c.elder4': 'کب ڈاکٹرس کُن',
  'health.q.elder4': 'کب ڈاکٹرس کُن گژھن چھہ ضروری؟',
  'ask.notConfigured': 'یہ خدمت چھہ فی الحال پننِ پرنِ جوابن ہندِ کھاتہٕ جواب دیوان۔ توہہ سُند سوال چھہ نہ تَتھ منز لبنہٕ آمت۔',
  'ask.browseTitle': 'یہہ یم مضمون چھہ، تم ؤچھِو',
  'download.pdf': 'PDF منز لکھِو',
  'download.text': 'ٹیکسٹ منز لکھِو',
  'download.printNow': 'پرنٹ کرِو',
  'download.preparing': 'تیار گژھان',
  'download.blocked': 'نو ٹیب چھہ نہ کھلِتھ۔ پاپ اپ چھہ بلاک گژھان — پننہٕ براؤزر منز الگ ٹیب کھولِو۔',
  'attach.button': 'پنن دستاویز یا فوٹو جوڑِو',
  'attach.formats': 'PDF، فوٹو (JPG/PNG) یا ٹیکسٹ فائل — 12 MB تام',
  'attach.reading': 'پٔرِتھ چھہ…',
  'attach.attached': 'جوڑنہٕ آمت',
  'attach.remove': 'ہٹٲو',
  'attach.tooBigPdf': 'یہ PDF 12 MB کھوتہٕ زیٛادٕ چھِ۔ کُنہِ لۄکٕٹِ فائلٕچ انتخاب کٔرِو۔',
  'attach.tooBigImage': 'یہ فوٹو 3 MB کھوتہٕ زیٛادٕ چھِ۔ کُنہِ لۄکٕٹِ فوٹوچ انتخاب کٔرِو۔',
  'attach.scannedPdf': 'یہ PDF چھِ سکین کٔرمٕژ — اَتھ مَنٛز چھِ صرف تصویر، یہِ پٔرِتھ چھِ نہٕ یِوان۔ اَتھ ہُنٛد فوٹو ترٲوِو۔',
  'attach.pdfFailed': 'یہ PDF پٔرِتھ نہٕ آیہِ۔',
  'attach.imageFailed': 'یہ فوٹو لوڈ نہٕ آیہِ۔',
  'attach.wrongType': 'یہ فائل کٲم نہٕ کٔرِ۔ PDF، فوٹو یا ٹیکسٹ فائل ترٲوِو۔',
  'attach.hint': 'پنُن کاغذ ییتہِ ترٲوِتھ سوال پٔرِو — اسہِ دیوِتھ اَتھ ہُنٛد جواب۔',
  'ask.sendWithFile': 'جواب گژھِ',
  'lib.title': 'مُفت لائبریری',
  'lib.intro': 'پڑھنٕچ کتابہٕ، تصویرہٕ تہٕ آڈیو — سٲری مُفت تہٕ قانونی طور پٲٹھؠ۔',
  'lib.legalTitle': 'کاپی رائٹُک کُنہِ قسمُک رٔٹہٕ چھُ نہٕ۔',
  'lib.legal': 'یتہِ یُس کُنہِ چھُ دِنہٕ آمت، سہُ چھُ بالکل مُفت تہٕ تُہؠ ہیٚکِو اَتھ آکھِ پٲٹھؠ ونِتھ۔ یُس کتاب اَز کاپی رائٹ مَنٛز چھِ، سہِ چھِ نہٕ ییتہِ آسہِ — سہِ ہیٚکِو تُہؠ کاپی کٔرِتھ نہٕ، یہِ صاف ونُن چھُ ضروٗری۔',
  'ask.signInFirst': 'گوڈنِ لاگ اِن کٔرِو، تِتہِ پَتہٕ سوال پٔرِو۔',
  'ask.signInTitle': 'گوڈنِ لاگ اِن کٔرِو',
  'ask.signInBody': 'سوال پٔرنہٕ خٲطرٕ پنُن اکاؤنٹ بناوِو۔ اَتھ مَنٛز چھُ اکھ منٹ کھوتہٕ کم وقت لگان، تہٕ تُہؠ ہیٚکِو سوال پٔرِتھ۔',
  'ask.signInCta': 'اکاؤنٹ بناوِو یا لاگ اِن کٔرِو',
  'ask.signInOr': 'اَز اکاؤنٹ بناوِتھ نہٕ ہیٚکِو؟ یہِ کٲم تہِ ہیٚکِو تُہؠ بِہِ کٔرِتھ:',
  'account.title': 'میٚون اکاؤنٹ',
  'account.intro': 'پنُن ناو تہٕ پاس ورڈ دِتھ سوال پٔرُن شۆروٗع کٔرِو۔',
  'account.signIn': 'اندر گژھِو',
  'account.register': 'اکاؤنٹ بناوِو',
  'account.signInNote': 'پتھِ لٹہِ ہُنٛد ناو تہٕ پاس ورڈ دِو۔',
  'account.registerNote': 'سوال پٔرنہٕ خٲطرٕ اکاؤنٹ چھُ نہٕ ضروٗری۔ یہِ چھُ صرف تُہٕنٛز زبان تہٕ جواب یاد تھاونہٕ خٲطرٕ۔',
  'account.handle': 'تُہُنٛد ناو',
  'account.handlePlaceholder': 'مثال: sita.ji',
  'account.password': 'پاس ورڈ',
  'account.passwordHint': 'کم از کم 6 اکھر۔',
  'account.phone': 'فون نمبر',
  'account.optional': 'ضروٗری نہٕ',
  'account.phoneHint': 'اگر دِتھ چِھو، تِلہِ دِو۔ اگر فون نمبر نہٕ دِو، تِلہِ تہِ اکاؤنٹ بنِیہِ۔',
  'account.create': 'اکاؤنٹ بناوِو',
  'account.logout': 'باہِر گژھِو',
  'account.open': 'اکاؤنٹ کھولِو',
  'account.signedInAs': 'تُہؠ چھِو لاگ اِن',
  'account.signedOut': 'اکاؤنٹ چھُ نہٕ کھُلِتھ',
  'account.signedOutBody': 'فی الحال کُنہِ اکاؤنٹ چھُ نہٕ کھُلِتھ۔',
  'account.saved': 'جمع کٔرمٕژ جواب',
  'account.savedEmpty': 'فی الحال کُنہِ جواب چھُ نہٕ جمع۔ جواب یِیہِ تِلہِ \'جمع کٔرِو\' دَبٲوِو۔',
  'account.savedUnavailable': 'جمع کٔرمٕژ جواب اَز نہٕ چھِ وُچھان۔ باقی سٲری کٲم چھِ گژھان۔',
  'account.wait': 'مہربٲنی کٔرِتھ انتظار کٔرِو…',
  'account.privacyTitle': 'تُہٕنٛز گژھِ نہٕ کُنہِ سٲتؠ شیئر',
  'account.privacyBody': 'اکاؤنٹ بناونہٕ سٲتؠ صرف تُہُنٛد ناو، پاس ورڈ تہٕ زبان تھاونہٕ یِوان۔ سوالُک کُنہِ ریکارڈ چھُ نہٕ بنان۔ تُہٕنٛد سوال کُنہِ کِس سٲتؠ شیئر کرنہٕ یِوان نہٕ۔',
  'account.errWrong': 'ناو یا پاس ورڈ چھُ غلط۔',
  'account.errTaken': 'یہِ ناو چھُ پہلے ہی کُنہِ ہُنٛد۔ بیٛاکھ ناو چُنِو۔',
  'account.errBad': 'جانکاری ٹھیک پٲٹھؠ پُر کٔرِو۔',
  'account.errWait': 'زیٛادٕ کوشش گٔیہِ۔ کُنہِ وقتہٕ پَتہٕ کوشش کٔرِو۔',
  'account.errTryLater': 'اَز نہٕ گٔیہِ۔ کُنہِ وقتہٕ پَتہٕ کوشش کٔرِو۔',
  'lib.licence.ccBy': 'تُہؠ ہیٚکِو یہِ کاپی تہٕ شیئر کٔرِتھ، چھاپِتھ تہِ ہیٚکِو — بس ذریعہٕ ہُنٛد ناو دِوُن چھُ ضروٗری۔',
  'lib.licence.ccBySa': 'تُہؠ ہیٚکِو یہِ کاپی تہٕ چھاپِتھ۔ یُس تبدیلی کٔرِو، سہِ تہِ گژھِ کُھلِتھ دِتھ۔',
  'lib.licence.ccZero': 'مکمل مُفت۔ ذریعہٕ ہُنٛد ناو دِوُن تہِ چھُ نہٕ ضروٗری۔',
  'lib.licence.pd': 'کُنہِ سُنٛد کاپی رائٹ چھُ نہٕ — یُس چِھو سہِ ہیٚکِو کاپی کٔرِتھ۔',
  'lib.licence.govtIndia': 'ہندوستان سرکارٕچ ویب سائٹ پؠٹھ۔ پرُن تہٕ چھاپُن دۄنوی چھِ مُفت۔',
  'lib.licence.creativeCommons': 'ہر فائلُک چھُ پنُن لائسنس — فائل پؠٹھ وُچھِو۔',
  'lib.licence.freeToRead': 'پرُن چھُ مُفت۔ کاپی کٔرِتھ آکھِ دِتھ تہِ چھُ اِتھہِ شرط پؠٹھ یَتھ پؠٹھ یہِ میوٗل۔',
  'lib.openBadge': 'کُھلٕہ',
  'lib.openBadgeNote': 'تُہہ کِتھہِ کٔرِتھ کٲپی',
  'lib.freeBadge': 'مُفت',
  'lib.freeBadgeNote': 'پٔرِتھ کٔرِو، مگر کٲپی چھُنہٕ یِوان کٔرِتھ',
  'lib.govt': 'سرکاری',
  'lib.noSignup': 'بغیر اکاؤنٹ',
  'lib.open': 'اَتھہِ کھولِو',
  'lib.group.padhai': 'پڑھنٕچ کِتابہٕ',
  'lib.group.padhai.note': 'سکول، کالج تہٕ سرکاری تعلیمی مواد',
  'lib.group.kitab': 'کِتابہٕ',
  'lib.group.kitab.note': 'یِمَن پؠٹھ چھُنہٕ کاپی رائٹ، یا یِمَن کٲپی کرنہٕ کِتھہِ چھُ اجازت',
  'lib.group.tasveer': 'تصویرہٕ تہٕ نقشہٕ',
  'lib.group.tasveer.note': 'نقشہٕ، تصویرہٕ، نشانہٕ — سُہ سٲری',
  'lib.group.audio': 'آوازہِ مَنٛز سُننٕچ مواد',
  'lib.group.audio.note': 'کِتابہٕ سُنِو، نہ کہِ وُچھِو',
  'lib.warnTitle': 'سٲری کِتابہٕ چھِ نہٕ اَتھہِ',
  'lib.warn': 'کُنہِ کِتابَن چھُ کاپی رائٹ، تِہہِ کٔنؠ چھِ نہٕ یِمَن مُفت دِنہٕ یِوان۔ اَسہِ چھِ نہٕ جان بوجھِتھ یِمَن ہِوان۔ اگر کُنہِ کِتابہٕ کِتھہِ ضٔرورت چھِ، تِہہِ تَل سوال پٔرِو — یُس جواب مِلنُک چھُ، سُہ مِلی۔',
  'lib.askInstead': 'سوال پٔرِو',
  'nav.library': 'کِتاب خانہٕ',
  'support.contactMessageLabel': 'تُہنٛزِ رائے',
  'support.contactPlaceholder': 'یُس لِکھُن چھُ، سُہ لِکھِو — اگر کُنہِ غلطی چھِ، یا کُنہِ کٲمِچ تعریف، یا کُنہِ سوال۔',
  'support.contactHelp': 'کم از کم 10 حرف۔ یہِ چھُ سِیدو مالکَس کُن گژھان۔',
  'support.contactSubmit': 'تَرٲوِو',
  'support.contactSending': 'تَرٲوان چھِ…',
  'support.contactPrivacy': 'تُہنٛز ناو لِکھُن چھُنہٕ ضٔروری۔',
  'support.contactSent': 'پُتھو',
  'support.contactSentBody': 'تُہنٛزِ رائے چھِ مالکَس تام پُتھمٕژ۔',
  'support.contactFailed': 'نہ گٔیہِ تَرٲوِتھ',
  'support.faq1Q': 'کیا یہِ چھُ سچ مٕچ مُفت؟',
  'support.faq1A': 'ہو۔ کُنہِ قِسمُک پٲسہِ چھِ نہٕ گِنان، نہ کُنہِ اشتہار، نہ کُنہِ رُکنیت۔ یہِ چھُ اَکھ اِنسان پننؠ پٲسہِ سٟتؠ چلاوان، نہ کُنہِ کمپنی یا سرکار سٟتؠ۔',
  'support.faq2Q': 'کیا مؠہِ سُنٛد ناو، پتہٕ یا فون نمبر چھُنہٕ گِنان؟',
  'support.faq2A': 'نہ، تہٕ یہِ گِنہِ نہٕ کانہِ۔ یہِ سائیٹ چھُنہٕ کانہِ پٔہچان بناوان — نہ کانہِ لاگ اِن، نہ کانہِ ٹریکنگ۔ یُس پٔرِتھ چھُ، سُہ چھُ صرف تُہنٛد سوال۔',
  'support.faq3Q': 'کیا یہِ چھُ ڈاکٹر یا وکیل؟',
  'support.faq3A': 'نہ۔ یہِ چھُنہٕ کانہِ دوٲئی یا قانونی صلاح دِوان۔ یتہِ معاملہٕ سِنگین چھُ، تتہِ چھُ یہِ ڈاکٹر یا افسرَس کُن وُنہِ ونان — یہِ چھُنہٕ تِمَن ہٕنٛز جاہ گِنان۔',
  'support.faq4Q': 'کیا ہر جواب چھُ صٔحی؟',
  'support.faq4A': 'ہمیشہ نہ۔ جواب چھُ اَکھ کمپیوٹر لِکھان، نہ کانہِ ڈاکٹر — اَتھہِ کٔنؠ چھُ ہر جوابس سٟتؠ لِکھِتھ زِ یہِ چھُنہٕ طبی صلاح۔ کانہِ دوٲئی شُرو یا بند کرنہٕ برونٹھ ڈاکٹرس سٟتؠ ضرور مِلِو۔',
  'support.faq5Q': 'کیا مؠہِ کانہِ ایپ ڈاؤن لوڈ کرُن پٔری؟',
  'support.faq5A': 'نہ۔ یہِ چھُ صرف براؤزرَس مَنٛز کھلان۔ نہ کانہِ ایپ انسٹال، نہ کانہِ اجازت، نہ کانہِ اپڈیٹ۔',
  'nav.remedies': 'گھریلو علاج',
  'remedy.title': 'آیورویدک گھریلو علاج',
  'remedy.intro': 'کانہِ تہِ تکلیف — کھانسی، سر درد، جوڑن ہُنٛد درد، کھُجلی، ذیابیطس، کمر درد — تَل پننؠ تکلیف وُچھِو یا پننؠ لفظَن مَنٛز پٔرِو۔ گھریلو کاڑہ، مالش، خوراک تہٕ آیورویدک علاج بتٲونہٕ یِیہِ۔',
  'remedy.choose': 'پننؠ تکلیف وُچھِو',
  'remedy.emergencyStrong': 'یہِ چھِ ہنگامی حالتہٕ:',
  'remedy.emergency': 'سٲپ کٔرُن، وِچھُ کٔرُن تہٕ کُکُر کٔرُن — فوراً ہسپتال گژھِو، برونٹھ 112 پؠٹھ فون کٔرِو۔ گھریلو علاج چھِ صرف راستس مَنٛز کرنہٕ کِتھہِ، ہسپتالٕچ جاہ نہ۔',
  'remedy.note': 'گھریلو تہٕ آیورویدک علاج چھِ تکلیف کم کرنہٕ مَنٛز مدد کران؛ یہِ چھِ نہٕ ڈاکٹرٕچ جانچ تہٕ علاجٕچ جاہ۔ کانہِ دوٲئی پننؠ مرضی سٟتؠ بند یا شُرو نہ کٔرِو۔',
  'remedy.cough': 'کھانسی',
  'remedy.headache': 'سر درد',
  'remedy.joints': 'جوڑن ہُنٛد درد',
  'remedy.itching': 'کھُجلی',
  'remedy.snake': 'سٲپ کٔرُن',
  'remedy.scorpion': 'وِچھُ کٔرُن',
  'remedy.dog': 'کُکُر کٔرُن',
  'remedy.diabetes': 'ذیابیطس',
  'remedy.back': 'کمر درد',
  'remedy.walking': 'چَلنَس مَنٛز تکلیف',
  'home.remedyNote': 'کاڑہ، مالش، خوراک تہٕ آیورویدک علاج — ہر تکلیف کِتھہِ، تُہنٛزِ زبان مَنٛز۔',
  'nav.aarti': 'آرتی تہٕ بھجن',
  'aarti.title': 'آرتی تہٕ بھجن — اصلی آوازس مَنٛز',
  'aarti.intro': 'اتھ جایہِ بوزِو آرتی، کیرتن تہٕ بھجن — اصلی گلوکارن تہٕ مندرن ہنٛز آواز۔ کانہہ تہٕ AI آواز چھنہٕ۔',
  'aarti.note': 'کمپیوٹرس مَنٛز آرتی یا بھجن بوزن چھُ تَتھ سٕنٛز روحانیت ختم کران۔ اَتھ خاطرہٕ چھِ اتہٕ صرف اصلی ریکارڈنگ موجود۔',
  'aarti.kindAarti': 'آرتی',
  'aarti.kindKirtan': 'کیرتن',
  'aarti.kindBhajan': 'بھجن',
  'aarti.credit': 'ریکارڈنگ:',
  'aarti.licence': 'لائسنس:',
  'aarti.listenLink': 'اصلی آوازس مَنٛز بوزِو',
  'aarti.textChecked': 'یہِ چھُ روایتی متن، یُس اصلی ریکارڈنگس مَنٛز گٲیِتھ چھُ۔',
  'aarti.textPrinted': 'یہِ چھُ عام متن، یُس چھاپہٕ شدہ کتابن سٟتؠ ملاونہٕ آمت چھُ۔',
  'aarti.textNotStored': 'اَتھ گرنتھُک مکمل متن چھُنہٕ اتہٕ موجود — ریکارڈنگس مَنٛز بوزِو مکمل متن۔',
  'aarti.granthTitle': 'گرنتھ، چالیسا تہٕ ستوتر — اصلی آوازس مَنٛز',
  'aarti.noRecording': 'اَتھ آرتی ہنٛز اصلی ریکارڈنگ چھُنہٕ سائٹَس پؠٹھ موجود، اَتھ خاطرہٕ ہیکہٕ نہٕ یہِ گٲیِتھ بوزِتھ — VARSHA SAMADHAN AI چھُنہٕ کانہہ تہٕ آرتی گٲوان۔',
  'aarti.textOnlyTitle': 'باقی آرتیہٕ — متن تہٕ، اصلی آواز تہٕ',
  'aarti.fullText': 'مکمل متن',
  'aarti.notChecked': 'اَتھ آرتی ہُنٛد تصدیق شدہ متن چھُنہٕ سائٹَس پؠٹھ موجود۔ بغیر تصدیق متن دِینہٕ چھُنہٕ ٹھیک، اَتھ خاطرہٕ چھُنہٕ یہِ دِینہٕ یِوان۔',
  'aarti.verifiedList': 'سائٹس پؠٹھ چھِ اِتھ آرتی ہُنٛد تصدیق شدہ متن موجود:',

};

/* -------------------------------------------------------------------------- */
/* SINDHI                                                                    */
/* -------------------------------------------------------------------------- */

const SINDHI: Record<string, string> = {
  'jgd.placeSearch': 'شهر جو نالو لکو',
  'jgd.placeNoMatch': 'هي شهر لسٽ ۾ ناهي. ان جي ويجهو ڪو شهر چونڊيو.',
  'account.name': 'توهان جو نالو',
  'account.namePlaceholder': 'جيئن: سيتا ديوي',
  'account.nameHint': 'هي توهان جي سڃاڻپ لاءِ آهي. ڪو به نالو هلي سگهي ٿو، ۽ اهو ضروري ناهي.',
  'nav.home': 'گھر',
  'home.metaTitle': 'مفت حل، توهان جي پنهنجن لفظن ۾',
  'lib.licence.ccZero.name': 'CC0 / پبلڪ ڊومين',
  'lib.licence.pd.name': 'پبلڪ ڊومين',
  'lib.licence.govtIndia.name': 'ڀارت سرڪار',
  'lib.licence.creativeCommons.name': 'ڪريئيٽو ڪامنز (مخلوط)',
  'lib.licence.freeToRead.name': 'پڙهڻ لاءِ آزاد',
  'lib.entry.ncert.title': 'NCERT ڪتاب — ڪلاس 1 کان 12 تائين',
  'lib.entry.ncert.what': 'هر مضمون جا سڀ ڪتاب، هاڻي هر ڪلاس لاءِ. بغير لاگ ان، سڌو PDF.',
  'lib.entry.ncert.langs': 'هندي، انگريزي ۽ 30 کان وڌيڪ ڀارتي ٻوليون',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ڊجيٽل درسي ڪتاب',
  'lib.entry.pm-evidya.what': 'NCERT جي ڪتابن جو ايپ، وڏن اکرن ۾ پڙهي سگهجي ٿو. ٻڌي به سگهجي ٿو.',
  'lib.entry.pm-evidya.langs': 'ڀارتي ٻوليون',
  'lib.entry.diksha.title': 'DIKSHA — استادن ۽ ٻارن لاءِ',
  'lib.entry.diksha.what': 'نصاب، وڊيو ۽ مشق — ڪلاس 1 کان 12 تائين.',
  'lib.entry.diksha.langs': 'ڀارتي ٻوليون',
  'lib.entry.khan-academy.title': 'Khan Academy — انگريزي ۾ رياضي ۽ سائنس',
  'lib.entry.khan-academy.what': 'وڊيو سبق، هر ڪلاس تائين. سڌو پڙهندڙن لاءِ لکيل مواد به موجود آهي.',
  'lib.entry.openstax.title': 'OpenStax — انگريزي ۾ مفت ڪتاب',
  'lib.entry.openstax.what': 'ڪاليج ليول جا ڪتاب — رياضي، سائنس، انسانيت. هر صفحي تي PDF.',
  'lib.entry.nios.title': 'NIOS — فاصلي جي تعليم، مفت مواد',
  'lib.entry.nios.what': 'اوپن ۽ آن لائن ڪورس جا مفت ڪتاب، بغير داخلا جي.',
  'lib.entry.nios.langs': 'هندي، انگريزي ۽ ٻيون',
  'lib.entry.ignou.title': 'IGNOU — وڏن اسڪول جا مفت ڪتاب',
  'lib.entry.ignou.what': 'فاصلي جي تعليم جا ڪتاب جيڪي بلڪل مفت ملن ٿا.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — انگريزي جا پراڻا ڪتاب',
  'lib.entry.gutenberg.what': '70,000 کان وڌيڪ ڪتاب، سڀني جا ڪاپي رائيٽ ختم. مفت اي-بڪ ۽ آڊيو.',
  'lib.entry.pratham-books.title': 'Pratham Books — ٻارن جا ڪتاب',
  'lib.entry.pratham-books.what': 'ڀارتي ٻولين ۾ ٻارن جا ڪتاب، بلڪل مفت. ڪلاس 1 کان 5 لاءِ.',
  'lib.entry.pratham-books.langs': 'هندي، مراٺي، بنگالي، تامل، تيلگو ۽ ٻيون',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — اخبارون ۽ پراڻا رسالا',
  'lib.entry.internet-archive-texts.what': 'لکين پراڻا ڪتاب، رسالا ۽ اخبارون — مفت.',
  'lib.entry.wikisource.title': 'Wikisource — عوامي ادبي متن',
  'lib.entry.wikisource.what': 'ڪو ڪاپي رائيٽ ناهي — اهي سڀني جي دنيا جا پراڻا ادبي ڪتاب آهن.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — هر تصوير',
  'lib.entry.wikimedia-commons.what': 'ذات، نقشو، تارا، تاريخ — سڀ ڪجهه. هر تصوير تي الڳ لائسنس لکيل آهي.',
  'lib.entry.pixabay.title': 'Pixabay — تصويرون ۽ چتر',
  'lib.entry.pixabay.what': 'تصويرون، ليڪاچتر ۽ ننڍيون وڊيوز.',
  'lib.entry.unsplash.title': 'Unsplash — سهڻيون تصويرون',
  'lib.entry.unsplash.what': 'مفت، وڏن اکرن ۾، بغير اڪائونٽ جي.',
  'lib.entry.openverse.title': 'Openverse — سڀ تصويرون هڪ جاءِ تي',
  'lib.entry.openverse.what': 'ڪيتريون ئي مفت تصويرن جون سائيٽون هڪ گڏ ڳوليو.',
  'lib.entry.librivox.title': 'LibriVox — ٻڌڻ وارا ڪتاب',
  'lib.entry.librivox.what': 'پراڻن انگريزي ڪتابن جو مفت آڊيو، انسان جي آواز ۾.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — آڊيو مجموعو',
  'lib.entry.internet-archive-audio.what': 'هزارين مفت آڊيو — ڪتاب، تقريرون، موسيقي.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — قومي ترانو ۽ گيت',
  'lib.entry.vande-mataram.what': 'ڀارت جو قومي ترانو ۽ ٻيا قومي گيت، مفت.',
  'art.aag-aur-bijli-ke-bachav.title': 'باھ ۽ بجلي کان بچاءُ جا اصول',
  'art.aag-aur-bijli-ke-bachav.summary': 'گهر ۾ باھ لڳڻ کان بچاءُ — سادا اصول',
  'art.aag-lagne-par-kya-karein.title': 'جيڪڏهن باھ لڳي وڃي ته ڇا ڪجي',
  'art.aag-lagne-par-kya-karein.summary': 'ٻرندڙ گهر ۾ باھ — سڀ کان پهريان ڇا ڪجي، ڇا نه ڪجي',
  'art.bimari-se-bachav.title': 'بيمارين کان بچاءَ جا ست اصول',
  'art.bimari-se-bachav.summary': 'هٿ ڌوئڻ، ماسڪ، ٽيڪا — وغيره سان بچاءَ',
  'art.dhuwan-ka-jhakora.title': 'دونهين جي لهرن کان بچاءَ',
  'art.dhuwan-ka-jhakora.summary': 'دم گهٽجڻ، ساهه کڻڻ ۾ تڪليف — ڇا ڪجي، ڪڏهن اسپتال وڃجي',
  'art.doodh-pani-band-ho.title': 'بجلي يا پاڻي اوچتو بند ٿي وڃي',
  'art.doodh-pani-band-ho.summary': 'ڇا ڪجي، ڪنهن کان بچجي، ڪڏهن مدد گهرجي',
  'art.haath-ki-saafai.title': 'صابڻ کان سواءِ هٿ صاف ڪرڻ جو طريقو',
  'art.haath-ki-saafai.summary': 'جڏهن پاڻي يا صابڻ موجود نه هجي',
  'cat.dhyan-aur-yoog.title': 'ڌيان ۽ يوگا',
  'cat.dhyan-aur-yoog.subtitle': 'من کي پرسڪون رکڻ جا سادا طريقا',
  'cat.gharelu-marammat.title': 'گهريلو مرمت',
  'cat.gharelu-marammat.subtitle': 'گهر جي ننڍين ننڍين مسئلن جو حل',
  'cat.bachchon-ki-padhai.title': 'ٻارن جي پڙهائي',
  'cat.bachchon-ki-padhai.subtitle': 'پڙهائي ۾ رڌل، پريشان آهيو',
  'cat.budharge-seva.title': 'بزرگن جي خدمت',
  'cat.budharge-seva.subtitle': 'سنڀال ۽ مدد',
  'cat.shishu-dekhbhal.title': 'ننڍڙن ٻارن جي سنڀال',
  'cat.shishu-dekhbhal.subtitle': 'ننڍڙي ٻار جي صحيح سنڀال',
  'cat.dharmik-upay.title': 'مذهبي اپاءَ',
  'cat.dharmik-upay.subtitle': 'من جي سڪون سان گڏ',
  'cat.pavan-grah-aur-aarti.title': 'مقدس ڪتاب ۽ آر تي',
  'cat.pavan-grah-aur-aarti.subtitle': 'عقيدت سان پڙهو ۽ ٻڌو',
  'cat.aapatkalen-gayide.title': 'ايمرجنسي گائيڊ',
  'cat.aapatkalen-gayide.subtitle': 'جڏهن فوري مدد جي ضرورت هجي',
  'cat.mahamari-suraksha.title': 'وبائي مرض کان تحفظ',
  'cat.mahamari-suraksha.subtitle': 'بيماري پکڙجڻ کان بچاءَ',
  'nav.tribute': 'يادگيري',
  'nav.help': 'مدد',
  'nav.reference': 'حوالو',
  'nav.reviews': 'راءِ',
  'nav.support': 'مدد ڪريو',
  'nav.birthChart': 'ڄم جو ڪنڊلي',
  'jgd.title': 'توهان جي ڄم جي ڪنڊلي',
  'jgd.intro': 'پنهنجو نالو، ڄم جي تاريخ، ۽ جيڪڏهن ممڪن هجي ته ڄم جو وقت ۽ هنڌ لکو. سڀ حساب ڪتاب توهان جي فون تي ئي ٿيندو — ڪجهه به ڪٿي به موڪليو نه ويندو. VARSHA SAMADHAN AI پاران.',
  'jgd.nameLabel': 'ڄم جو نالو',
  'jgd.namePlaceholder': 'مثال طور پورو نالو',
  'jgd.nameHint': 'جيڪو نالو ننڍپڻ ۾ رکيو ويو هو، اهو ئي لکو.',
  'jgd.dateLabel': 'ڄم جي تاريخ',
  'jgd.timeLabel': 'ڄم جو وقت',
  'jgd.timeHint': 'جيڪڏهن خبر ناهي ته خالي ڇڏي ڏيو.',
  'jgd.placeLabel': 'ڄم جو هنڌ',
  'jgd.placeNone': 'خبر ناهي / چونڊيو',
  'jgd.placeHint': 'پنهنجي ڄم جو شهر چونڊيو.',
  'jgd.submit': 'حساب ڪريو',
  'jgd.savePdf': 'PDF ٺاهيو',
  'jgd.again': 'نئون حساب',
  'jgd.errDate': 'مهرباني ڪري ڄم جي تاريخ صحيح لکو.',
  'jgd.errPlace': 'ڄم جو شهر لسٽ مان چونڊيو، يا ان جي ويجهو شهر چونڊيو.',
  'jgd.numTitle': 'عددن جو علم',
  'jgd.lifePath': 'زندگي جو رستو',
  'jgd.nameNumber': 'نالي جو عدد',
  'jgd.soulNumber': 'روح جو عدد',
  'jgd.birthdayNumber': 'ڄم جي ڏينهن جو عدد',
  'jgd.astroTitle': 'ويدڪ جوتش',
  'jgd.nakshatra': 'نڪشتر',
  'jgd.pada': 'پد',
  'jgd.rashi': 'راشي',
  'jgd.rashiLord': 'راشي سوامي',
  'jgd.nakshatraLord': 'نکشتر سوامي',
  'jgd.lagna': 'لگن',
  'jgd.lagnaMissing': 'لگن ڪڍڻ لاءِ جنم جو وقت ۽ جاءِ گهرجي. مٿي ڀري پوءِ حساب ڪريو، ۽ جيڪڏهن نه ڄاڻو ته ايترو به گهڻو آهي.',
  'jgd.gunTitle': 'گڻ ملان',
  'jgd.gunIntro': 'ٻئي شخص جو نالو ۽ جنم تاريخ ڀريو.',
  'jgd.gunName': 'ان جو نالو',
  'jgd.gunDate': 'ان جي جنم تاريخ',
  'jgd.gunHint': 'ٻنهي جو نالو ۽ جنم تاريخ هوندي ته گڻ ملان نڪرندو.',
  'jgd.disclaimer': 'هي روايت مطابق ڪيل حساب آهي، اڳڪٿي ناهي. ڪا به انگ يا راشي ڪنهن جي صحت، دولت يا رشتو طئي نٿي ڪري. وڏا فيصلا ڊاڪٽر، قانوني صلاح يا تجربيڪار جي صلاح سان وٺو.',
  'nav.menu': 'مينيو',
  'nav.openMenu': 'مينيو کوليو',
  'nav.closeMenu': 'مينيو بند ڪريو',
  'nav.expand': 'کوليو',
  'nav.collapse': 'بند ڪريو',
  'nav.skip': 'سڌو مواد ڏانهن وڃو',
  'nav.language': 'ٻولي تبديل ڪريو',
  'footer.pages': 'صفحا',
  'footer.helplines': 'ضروري نمبر',
  'footer.free': 'هي سهولت مڪمل طور تي مفت آهي. ڪنهن کان به ڪو پئسو نه ورتو ويندو آهي.',
  'footer.readStory': 'انهن جي پوري ڪهاڻي پڙهو',
  'footer.admin': 'منتظم',
  'footer.rights': 'مفت سهولت',
  'footer.emergency': 'ايمرجنسي',
  'footer.ambulance': 'ايمبولينس',
  'footer.women': 'عورتن جي هيلپ لائن',
  'home.dedication1': 'جي ياد ۾ — هڪ مڪمل طور تي مفت سهولت.',
  'home.dedication2': 'پنهنجو مسئلو لکو يا ٻڌايو.',
  'home.emergencyTitle': 'ضروري — فوري مدد گهرجي',
  'home.emergencyNote': 'اهي سڀ کان پهريان پڙهو. باقي سڀ پوءِ ڏسي سگهجي ٿو.',
  'home.readMore': 'پوري ڄاڻ پڙهو',
  'home.chooseTopic': 'ڪهڙي موضوع بابت ڄاڻڻو آهي؟',
  'home.memorialEyebrow': 'هي سائيٽ ڪنهن لاءِ آهي',
  'home.memorialLine': 'جن سماج لاءِ زندگي ڀر ويڙهه ڪئي، ۽ جن کي آخر ۾ پنهنجي حصي جو حساب نه مليو.',
  'home.memorialMore': 'انهن جي پوري ڪهاڻي پڙهو',
  'home.kundaliTitle': 'جنم ڪنڊلي',
  'home.kundaliNote': 'پوري ڪنڊلي — 9 گرھ، وِمشوتري دشا، ڦلاديش، يوگ، شوڊش ورگ، ڪي پي، لال ڪتاب ۽ انگ جوتش. سڀ توهان جي فون تي ئي حساب ٿيندو.',
  'home.chooseTopicNote': 'هيٺ ڏنل موضوع تي ٽيپ ڪريو. هر جاءِ تي سادي ٻوليءَ ۾ ڄاڻ ڏني وئي آهي.',
  'home.askHere': 'هن موضوع بابت پڇو',
  'home.categoryEmpty': 'هن موضوع بابت اڃا ڪجهه نه لکيو ويو آهي.',
  'home.soundTitle': 'امن لاءِ آواز',
  'home.soundIntro': 'ڪو فيس ناهي، ڪا اشتهار بازي ناهي. بس ذهن کي پرسڪون ڪرڻ لاءِ.',
  'home.howTitle': 'هي سهولت ڪيئن ڪم ڪري ٿي',
  'home.step1Title': 'پنهنجي ڳالهه لکو يا ٻڌايو',
  'home.step1Body': 'هندي ۾ ٽائپ ڪريو، يا مائڪ دٻائي ٻڌايو. ڪجهه به خاص نه ڪرڻو آهي — جيڪو ذهن ۾ آهي اهو لکي ڇڏيو.',
  'home.step2Title': 'فوري جواب ملي ٿو',
  'home.step2Body': 'هر سوال درج ٿئي ٿو ۽ ان جو جواب فوري ملي ٿو. تمام گهڻي ڊگهي سوال کان پهريان ننڍي سوال کان شروع ڪريو.',
  'home.step3Title': 'ڪو پئسو ناهي، ڪا ذاتي ڄاڻ ناهي',
  'home.step3Body': 'هي سهولت بلڪل مفت آهي. توهان جو نالو، پتو يا فون نمبر نه گهريو ويندو آهي، ۽ ڪو به اشتهار نه ڏيکاريو ويندو آهي.',
  'home.stepLabel': 'قدم',
  'home.freeTitle': 'هي سهولت بلڪل مفت آهي',
  'home.freeBody': 'ڪو پئسو نه ورتو ويندو آهي، ڪا ذاتي ڄاڻ نه گهري ويندي آهي، ۽ ڪو به اشتهار نه ڏيکاريو ويندو آهي.',
  'help.q1.label': 'بجلي هلي وئي آهي، ڇا ڪريان؟',
  'help.q1.question': 'گھر ۾ بجلي هلي وئي آهي. ڇا ڪرڻ گهرجي، ۽ موبائل فون ڪيئن چارج ڪجي؟',
  'help.q2.label': 'ٻار جي پڙهائي ۾ ڪمزوري',
  'help.q2.question': 'منهنجي ٻار جي پڙهائي ۾ تمام گهڻي ڪمزوري آهي. گهر تي ڪيئن سڌاريان؟',
  'help.q3.label': 'بزرگ جو علاج',
  'help.q3.question': 'منهنجي والد جي عمر تمام گهڻي آهي، انهن جو علاج ڪيئن ڪيان؟',
  'help.q4.label': 'گهر ۾ باهه لڳي وڃي ته',
  'help.q4.question': 'جيڪڏهن رات جو گهر ۾ باهه لڳي وڃي ته سڀ کان پهريان ڇا ڪرڻ گهرجي؟',
  'help.title': 'پنهنجو مسئلو لکو',
  'help.intro': 'هيٺ لکو يا ٻڌايو. جيڪڏهن خبر نه هجي ته جيئن ذهن ۾ اچي تيئن ئي لکي ڇڏيو — اهو ئي سڀ کان ضروري آهي.',
  'help.suggested': 'عام سوال',
  'help.howTitle': 'هي سهولت ڪيئن ڪم ڪري ٿي',
  'help.howBody': 'هر سوال درج ٿئي ٿو ۽ ان جو جواب فوري ملي ٿو. توهان جو نالو، پتو يا فون نمبر ڪٿي به نه ورتو ويندو آهي. سڀ ڪجهه مفت آهي.',
  'ref.title': 'هي سهولت ڇا آهي، ۽ ڪنهن لاءِ آهي',
  'ref.intro': 'هي سهولت محترمه VARSHA جي ياد ۾ ٺاهي وئي آهي. هتي سادي ٻولي ۾ ٻڌايو ويو آهي ته هي ڇا ڪري ٿي، هن ۾ ڇا ڇا آهي، ۽ ان جون حدون ڇا آهن. سڀ ڪجهه بلڪل مفت آهي — ڪو پئسو نه ورتو ويندو آهي، ڪا اشتهار بازي نه ڏيکاري ويندي آهي، ۽ ڪا ذاتي ڄاڻ نه گهري ويندي آهي.',
  'ref.whatTitle': 'هن ۾ ڇا ڇا آهي',
  'ref.what1': 'گهر ۾ باهه لڳي وڃي، بجلي هلي وڃي، ٻار جي پڙهائي ۾ ڪمزوري هجي، ماءُ پيءُ جي سنڀال ڪرڻي هجي — اهڙن عام مسئلن جا سادا اپاءَ، صاف سٿري ٻولي ۾.',
  'ref.what2': 'سوال ٻولي پڇڻ جي سهولت. جيڪڏهن ڳالهائڻ نه اچي ته لکو — ٻنهي جو جواب هڪ جهڙو ملي ٿو.',
  'ref.what3': 'هر سوال درج ٿئي ٿو، ان ڪري جيڪو ٻين کي پريشان ڪري ٿو اهو توهان کان پهريان ئي پڇيو ويو هوندو آهي ۽ ان جو جواب ملي ويندو آهي.',
  'ref.what4': 'ڪو اشتهار ناهي، ڪا غير ضروري ڄاڻ ناهي، ۽ ڪا ذاتي ڄاڻ نه گهري ويندي آهي. سڀ ڪجهه مفت.',
  'ref.helplineTitle': 'فوري مدد لاءِ اهي نمبر ياد رکو',
  'ref.helpline1': 'ڪو وڏو خطرو هجي — جيئن باهه، بجلي جو زوردار جهٽڪو، ڪرڻ يا تمام گهڻو رت وهڻ — ته 112 تي فون ڪريو.',
  'ref.helpline2': 'ڪنهن کي بيماري هجي يا چوٽ لڳي هجي ۽ وڃڻ جو ڪو رستو نه هجي، ته 108 تي ايمبولينس گهرائي.',
  'ref.helpline3': 'عورت سان ڪو برو ڪم ٿيو هجي، يا عورت کي ڪٿان پريشان ڪيو پيو وڃي، ته 181 تي فون ڪريو. هي مفت آهي.',
  'ref.helpline4': 'ٻار يا بزرگ سان ڪو ظلم ٿيو هجي، ته 1098 تي شڪايت ڪري سگهجي ٿي.',
  'ref.helpline5': 'ذهني دٻاءُ تمام گهڻو هجي، يا جيئڻ جي خواهش نه هجي، ته 14416 تي ڳالهائي سگهجي ٿو. صرف ڳالهائڻ لاءِ.',
  'ref.dataTitle': 'اسان توهان جي باري ۾ ڇا رکون ٿا',
  'ref.dataBody': 'صرف اهو سوال جيڪو توهان پڇيو، ان جو خلاصو، ۽ سوال پڇڻ جو وقت — ته جيئن اسان بار بار اهو ئي جواب نه ڏئي سگهون. توهان جو نالو، پتو، فون نمبر، يا ڪا سڃاڻپ ٻڌائيندڙ ڪا ڄاڻ نه ورتي ويندي آهي. سائيٽ تي ڪو اشتهار يا ٽريڪنگ اسڪرپٽ ناهي لڳل.',
  'ref.adminTitle': 'منتظم ڇا ڪري سگهن ٿا',
  'ref.adminBody': 'منتظم اهي ليک ڏسي سگهن ٿا جيڪي توهان موڪليا آهن، ۽ انهن جو جواب لکي سگهن ٿا. اهي توهان جي اجازت کان سواءِ ڪو ليک تبديل يا ختم نٿا ڪري سگهن، ۽ توهان جي ڄاڻ ڪنهن کي نٿا وڪڻي سگهن.',
  'ref.statsCategories': 'موضوع موجود آهن',
  'ref.statsArticles': 'ليک لکيا ويا آهن',
  'ref.statsQuestions': 'سوال پڇيا وڃي چڪا آهن',
  'ref.ownerNote': 'هي سهولت ڪنهن ڪمپني جي ناهي، ڪنهن سرڪار جي ناهي، بلڪه هڪ فرد جي ياد ۾ هلائي پئي وڃي. ان ڪري هتي ڪو اشتهار ناهي، ڪا رڪنيت ناهي، ۽ ڪو پئسو نه ورتو ويندو آهي.',
  'support.title': 'هي سهولت مفت آهي',
  'support.intro': 'هي سهولت ڪنهن کان پئسا نه وٺندي آهي. پر هي هلندي آهي — ان ڪري ڪجهه طريقا آهن جن سان توهان مدد ڪري سگهو ٿا. سڀ کان آسان طريقو سڀ کان ڪارآمد آهي.',
  'support.waysTitle': 'توهان ڪيئن مدد ڪري سگهو ٿا',
  'support.way1Title': 'پنهنجو تجربو لکو',
  'support.way1Body': 'جيڪڏهن هن سائيٽ مان توهان کي ڪجهه صحيح مليو هجي — يا ڪجهه اهڙو مليو هجي جيڪو توهان کي مونجهاري ۾ ڇڏي ويو هجي — ته راءِ واري صفحي تي لکي ڇڏيو. توهان جو نالو لکڻ ضروري ناهي.',
  'support.way2Title': 'پنهنجي شهر جي باري ۾ ٻڌايو',
  'support.way2Body': 'توهان جتي رهو ٿا، اتي جي ٻولي، ريتون رسمون ۽ مشڪلاتون الڳ هونديون آهن. جيڪڏهن توهان جي علائقي جي ڪا ڳالهه هتي ناهي، ته ٻڌايو — جيڪو شامل ڪري سگهجي ٿو اهو شامل ڪيو ويندو.',
  'support.way3Title': 'پنهنجو تجربو ڪنهن ٻئي کي ٻڌايو',
  'support.way3Body': 'جيڪو هتي لکيل آهي اهو ڪيترن ئي ماڻهن جي ڪم اچي سگهي ٿو، جيڪڏهن انهن کي خبر هجي. ڪنهن اهڙي شخص کي ٻڌايو جن کي هن مان سچ پچ مدد ملي سگهي.',
  'support.way4Title': 'هتي اچي ڏسو',
  'support.way4Body': 'جيڪڏهن توهان وٽ وقت هجي، ته پاڻ اچي ڏسو ته هي سائيٽ صحيح طريقي سان هلي رهي آهي يا نه. ڪجهه خراب ڏسڻ ۾ اچي ته ٻڌايو — بلڪل مفت ۾ صحيح ٿي ويندو.',
  'support.contactTitle': 'ڪجهه ٻڌائڻو آهي؟',
  'support.contactBody': 'ڪنهن به ڳالهه لاءِ هتي لکي سگهو ٿا — چاهي ڪا غلطي هجي، چاهي ڪجهه وڌيڪ ملي، يا ڪو سوال. جيترو لکڻ آسان لڳي، اوترو ئي لکو.',
  'support.faqTitle': 'ڪجهه ڳالهيون جيڪي بار بار پڇيون وينديون آهن',
  'support.faqBody': 'ڇا هي سچ پچ مفت آهي؟ ها. ڇا توهان جو نالو ورتو ويندو آهي؟ نه، نالو ڏيڻ ضروري ناهي. ڇا اشتهار ايندا آهن؟ نه. ڪو فون نمبر يا پتو ته نه گهريو ويندو آهي؟ نه. ڇا ڪنهن ايپ کي ڊائونلوڊ ڪرڻو پوندو؟ نه، بس برائوزر ۾ کلي ويندو آهي.',
  'ask.label': 'پنهنجو مسئلو لکو يا مائڪ سان ٻڌايو',
  'ask.placeholder': 'جيئن: ٻار جي پڙهائي ۾ ڪمزوري آهي',
  'ask.help': 'انٽر دٻائي به موڪلي سگهو ٿا.',
  'ask.send': 'پڇو',
  'ask.sending': 'سوچي رهيا آهيون…',
  'ask.clear': 'لکيل مٽايو',
  'ask.speak': 'ٻولي پڇو',
  'ask.listening': 'ڳالهائڻ شروع ڪريو…',
  'ask.heard': 'ٻڌي رهيا آهيون',
  'ask.stopListening': 'ٻڌڻ بند ڪريو',
  'ask.suggested': 'عام سوال',
  'ask.answerTitle': 'حل',
  'ask.listen': 'ٻڌو',
  'ask.stopSpeak': 'روڪيو',
  'ask.aiNote': 'هي جواب AI ڏنو آهي. هي ڪنهن ماهر جي صلاح جو متبادل ناهي.',
  'ask.errorRateLimit': 'گهڻا سوال هڪ ئي وقت موڪليا ويا آهن. ٿوري دير کان پوءِ ڪوشش ڪريو.',
  'ask.errorNetwork': 'انٽرنيٽ نٿو هلي. ڪنيڪشن چيڪ ڪري ٻيهر ڪوشش ڪريو.',
  'ask.notAnswer': 'هن سوال جو سڌو جواب اسان وٽ ناهي.',
  'ask.emptyAnswer': 'هن ڀيري جواب نه ملي سگهيو. ٿورو مختلف ڪري ٻيهر پڇو.',
  'ask.micUnsupported': 'هن برائوزر ۾ ڳالهائي پڇڻ ڪم نه ڪندو. لکي پڇو.',
  'ask.heardWith': 'هي ٻڌي رهيا آهيون:',
  'voice.notAllowed': 'مائڪ جي اجازت نه ملي آهي. مٿي وڃي اجازت ڏيو، يا لکي پڇو.',
  'voice.serviceNotAllowed': 'مائڪ جي اجازت نه ملي آهي. مٿي وڃي اجازت ڏيو، يا لکي پڇو.',
  'voice.noSpeech': 'ڪا آواز نه ٻڌڻ ۾ آئي. مائڪ جي ويجهو ڳالهايو، يا لکو.',
  'voice.audioCapture': 'ڪو مائڪ نه مليو. ڊيوائس لڳايو، يا لکي پڇو.',
  'voice.network': 'ڳالهائي پڇڻ لاءِ انٽرنيٽ گهرجي، جيڪو نٿو هلي. لکي پڇو — جواب ساڳيو ملندو.',
  'voice.aborted': 'روڪجي ويو. ٻيهر ڪوشش ڪريو.',
  'voice.unsupported': 'هن برائوزر ۾ ڳالهائي پڇڻ ڪم نه ڪندو. لکي پڇو.',
  'voice.speakFailed': 'هي جواب ٻڌائي نه سگهيو.',
  'voice.noVoice': 'هن ڊيوائس ۾ {name} ڳالهائڻ واري آواز نه ملي. في الحال لکيل پڙهو، يا فون جي سيٽنگ ۾ وڃي آواز شامل ڪريو.',
  'voice.generic': 'ڪجهه گڙٻڙ ٿي وئي. ٻيهر ڪوشش ڪريو.',
  'sound.title': 'امن لاءِ آواز',
  'sound.intro': 'ڪو خرچ ناهي، ڪا اشتهار بازي ناهي. بس ذهن کي پرسکون ڪرڻ لاءِ.',
  'sound.playing': 'آواز هلي رهيو آهي. روڪڻ لاءِ ٻيهر ساڳيو بٽڻ دٻايو.',
  'sound.shankh': 'سنگهه',
  'sound.shankhHint': 'گهرو، ڊگهو',
  'sound.bansuri': 'ٻانسري',
  'sound.bansuriHint': 'نرم، هلڪو',
  'sound.dhol': 'نغارو',
  'sound.dholHint': 'تيز، زوردار',
  'sound.all': 'ٽئي',
  'sound.allHint': 'هڪ گڏ',
  'sound.listenLabel': 'ٻڌو',
  'sound.errUnsupported': 'هي برائوزر آواز نٿو هلائي سگهي.',
  'sound.errGeneric': 'آواز هلائڻ ۾ مسئلو ٿيو.',
  'dhun.welcome': 'ڀليڪار',
  'dhun.prompt': 'سنگهه، ٻانسري ۽ نغارو — گڏ ٻڌڻ لاءِ ٽچ ڪريو.',
  'dhun.listen': '▶ ٻڌو',
  'dhun.skip': 'آواز ڇڏيو',
  'dhun.failed': 'آواز نه هلي سگهيو.',
  'dhun.label': 'آواز هلائڻ جي اجازت',
  'reviews.title': 'توهان جي راءِ، توهان جي ڳالهه',
  'reviews.intro': 'ڇا هي سهولت توهان جي ڪم آئي؟ پنهنجي ڳالهه لکو — توهان جو نالو لکڻ ضروري ناهي.',
  'reviews.pageTitle': 'توهان جي راءِ',
  'reviews.pageIntro': 'هتي اهو لکيل آهي جيڪو ماڻهن لکيو آهي. ڪا راءِ لڪائي نه ويندي آهي، ۽ جيڪو لکيو آهي اهو هتي ئي ڏسڻ ۾ ايندو آهي — بس هڪ ڀيرو ڏسڻ کان پوءِ شايع ڪيو ويندو آهي.',
  'reviews.write': 'پنهنجي راءِ لکو',
  'reviews.submit': 'موڪليو',
  'reviews.sending': 'موڪلي رهيا آهيون…',
  'reviews.name': 'توهان جو نالو (ضروري ناهي)',
  'reviews.city': 'توهان جو شهر (ضروري ناهي)',
  'reviews.comment': 'توهان جي ڳالهه',
  'reviews.placeholder': 'جيڪو ذهن ۾ اچي اهو لکو — ڪجهه صحيح ڪرڻ جي ضرورت ناهي.',
  'reviews.moderated': 'توهان جي راءِ شايع ٿيڻ کان اڳ هڪ ڀيرو چڪاس ڪئي ويندي آهي.',
  'reviews.moderationNote': 'سڀ ڪجهه ختم ٿيڻ کان بچائڻ لاءِ، هر راءِ شايع ٿيڻ کان اڳ هڪ ڀيرو ڏٺي ويندي آهي. گاريون، نمبر يا ذاتي ڳالهيون هٽايون وينديون آهن — باقي سڀ جيئن جو تيئن شايع ڪيو ويندو آهي.',
  'reviews.summaryTitle': 'عام راءِ',
  'reviews.count': 'راءِ',
  'reviews.anonymous': 'بغير نالي جي',
  'reviews.summaryLine': 'ماڻهن سراسري طور تي {rating} مان 5 تارا ڏنا آهن، ڪل {count} راين جي بنياد تي.',
  'reviews.starsLabel': '5 مان {value} تارا',
  'reviews.keepLabel': 'خراب لڳو ته ٺيڪ لڳو — ٻئي لکو',
  'reviews.ownerReply': 'جواب',
  'reviews.replyLabel': 'هن تي لکيو ويو آهي',
  'reviews.empty': 'اڃا ڪا به راءِ ناهي. پهرين توهان لکو.',
  'reviews.toastSent': 'مهرباني',
  'reviews.toastFailed': 'راءِ موڪلي نه سگهي',
  'reviews.fieldTooShort': 'گهٽ ۾ گهٽ 10 اکر لکو.',
  'reviews.rateLimited': 'تمام تيزي سان موڪليو پيو وڃي. ٿورو ترسڻ کان پوءِ ٻيهر ڪوشش ڪريو.',
  'cat.notFound': 'هي صفحو نه مليو',
  'cat.empty': 'هن موضوع تي اڃا ڪو به مضمون ناهي.',
  'article.emergency': 'ضروري',
  'article.askAbout': 'هن موضوع بابت پڇو',
  'article.readAloud': 'هي مضمون ٻڌو',
  'article.others': 'هن موضوع جا ٻيا مضمون',
  'article.count': '{count} مضمون',
  'theme.toLight': 'روشني واري ڏيک ڏانهن وڃو',
  'theme.toDark': 'اونداهي واري ڏيک ڏانهن وڃو',
  'toast.dismiss': 'بند ڪريو',
  'language.choose': 'پنهنجي ٻولي چونڊيو',
  'language.articlesIn': 'هي مضمون هندي ۾ آهي.',
  'language.articlesInHint': 'هر ٻولي ۾ الڳ ترجمو گهرجي. هي ترجمو اڃا ناهي ٿيو — جيڪو لکيل آهي اهو هندي ۾ ئي صحيح ۽ مڪمل آهي.',
  'ask.welcome': 'توهان کي ڀليڪار! هيٺ پنهنجو مسئلو لکو يا ڪو موضوع چونڊيو.',
  'ref.notTitle': 'هي ڇا نٿي ڪري',
  'ref.not1': 'هي ڊاڪٽر ناهي. دوائن جي صلاح ڪڏهن به نه ڏني ويندي آهي.',
  'ref.not2': 'هي وڪيل ناهي. قانوني صلاح نه ڏني ويندي آهي.',
  'ref.not3': 'ڪو به پئسو نه ورتو ويندو آهي، ۽ ڪا به اشتهار بازي نه ڏيکاري ويندي آهي.',
  'ref.not4': 'توهان جو نالو، پتو يا فون نمبر نه گهريو ويندو آهي ۽ نه ئي رکيو ويندو آهي.',
  'ref.not5': 'ڪا سرڪاري اسڪيم جو اگهه يا نمبر نه ٺاهيو ويندو آهي — جيڪڏهن صحيح ڄاڻ نه هجي ته صاف چيو ويندو آهي ته خبر ناهي.',
  'ref.medicalTitle': 'ضروري: هي ڊاڪٽر جي صلاح ناهي',
  'ref.medicalBody': 'بيماري، دوا يا ڪنهن به زهريلي شيءِ سان جڙيل ڳالهه هجي، ته سڀ کان پهريان ڊاڪٽر سان مليو. هتي ڏنل ڄاڻ صرف عام مدد لاءِ آهي. ٻارن جا ٽيڪا، حمل، يا ڪا به دوا شروع ڪرڻ کان اڳ ڊاڪٽر جي صلاح ضرور وٺو.',
  'ref.statsTitle': 'ڪيتري ڄاڻ موجود آهي',
  'support.howTitle': 'اسان جي مدد ڪيئن ڪجي',
  'support.alwaysFreeTitle': 'هي سهولت هميشه مفت رهندي',
  'support.alwaysFreeBody': 'جيڪا به مدد ملي، اها سهولت هلائڻ ۾ لڳندي. ڪنهن کان به ڪڏهن پئسا نه ورتا ويندا.',
  'smriti.eyebrow': 'خراجِ تحسين',
  'smriti.whyTitle': 'هي سائيٽ ڇو آهي',
  'smriti.ending': 'سندن جدوجهد هتي اڳتي وڌي ٿي.',
  'article.askAny': 'ڪو سوال پڇو',
  'article.remember': 'ياد رکو',
  'article.emergencyInfo': 'ضروري ڄاڻ',
  'article.medicalTitle': 'هي طبي صلاح ناهي',
  'article.medicalBody': 'هي ڄاڻ عام مدد لاءِ آهي. ڪا به دوا شروع يا بند نه ڪريو — پهريان ڊاڪٽر سان مليو.',
  'article.heading': '{category} جا مضمون',
  'reviews.rateQuestion': 'ڪيترا تارا ڏيندؤ؟',
  'reviews.starsShort': '{value} تارا',
  'reviews.averageOutOf': '5 مان {value} تارا',
  'dhun.welcomeTitle': 'ڀليڪار',
  'dhun.consent': 'سنگ، بانسري ۽ نقارو — گڏ ٻڌڻ لاءِ ڇهو.',
  'dhun.unsupported': 'هي برائوزر آواز نٿو هلائي سگهي.',
  'dhun.failedTry': 'آواز هلائڻ ۾ مسئلو ٿيو.',
  'sound.hintIdle': 'ڪو بٽڻ دٻائي آواز ٻڌو.',
  'sound.hintPlaying': 'آواز هلي رهيو آهي. روڪڻ لاءِ ساڳيو بٽڻ ٻيهر دٻايو.',
  'sound.preparing': 'آواز تيار ٿي رهيو آهي',
  'nav.path': 'رستو',
  'health.heading': 'پنهنجي عمر ٻڌايو',
  'health.intro': 'عمر جي حساب سان جيڪي سوال اڪثر پڇيا ويندا آهن، اهي هتي نظر ايندا. ڪو بٽڻ دٻايو — سوال هيٺ ڀرجي ويندو، پوءِ پڇي وٺو.',
  'health.ageLabel': 'عمر (سال)',
  'health.years': 'سال',
  'health.bandsLabel': 'عمر جي حساب سان چونڊيو',
  'health.notAdviceStrong': 'هي طبي صلاح ناهي.',
  'health.notAdvice': 'ڪا به دوا شروع يا بند نه ڪريو — پهرين ڊاڪٽر سان ملڻ وڃو.',
  'health.emergencyStrong': 'ايمرجنسي ۾ فون ڪريو:',
  'health.emergencyCall': '(ايمرجنسي)',
  'health.emergencyAmbulance': '(ايمبولينس)',
  'health.emergencyWomen': '(عورتن جي هيلپ لائن)',
  'health.privacy': 'ڪو نالو يا پتو لکڻ جي ضرورت ناهي.',
  'health.band.infant.label': '0 – 2 سال',
  'health.band.infant.note': 'ننڍڙا ٻار، جيڪي اڃا پنهنجي ڳالهه نٿا ٻڌائي سگهن',
  'health.c.infant1': 'تيز بخار',
  'health.q.infant1': 'منهنجي ٻار کي تيز بخار آهي، ڇا کير ڏيان؟',
  'health.c.infant2': 'کائڻ نٿو کائي',
  'health.q.infant2': 'ننڍڙو ٻار کائڻ نٿو کائي، ڇا ڪريان؟',
  'health.c.infant3': 'الٽي ٿي رهي آهي',
  'health.q.infant3': 'ٻار کي الٽي ٿي رهي آهي، ڪڏهن ڊاڪٽر کي ڏيکاريان؟',
  'health.c.infant4': 'دست ٿي رهيا آهن',
  'health.q.infant4': 'ٻار کي دست ٿي رهيا آهن، ڇا کارايان؟',
  'health.band.child.label': '3 – 12 سال',
  'health.band.child.note': 'ٻار جيڪي ڳالهائي سگهن ٿا، پر سوال پڇڻ کان ڊڄن ٿا',
  'health.c.child1': 'پڙهائي ۾ دل نٿي لڳي',
  'health.q.child1': 'ٻار جي پڙهائي ۾ دل نٿي لڳي، ڇا ڪريان؟',
  'health.c.child2': 'اسڪول وڃڻ کان انڪار',
  'health.q.child2': 'ٻار روز اسڪول وڃڻ کان انڪار ڪري رهيو آهي، سبب ڇا ٿي سگهي ٿو؟',
  'health.c.child3': 'رات جو بخار',
  'health.q.child3': 'ٻار کي رات جو بخار اچي ٿو، ڇا ڪريان؟',
  'health.c.child4': 'ڏند ٽٽي رهيا آهن',
  'health.q.child4': 'ٻار جا ڏند ٽٽي رهيا آهن، ڏندن جي سنڀال ڪيئن ڪريان؟',
  'health.band.teen.label': '13 – 17 سال',
  'health.band.teen.note': 'نوجوان، جن کي اڪثر ڪو اهڙو ماڻهو نٿو ملي جيڪو ٻڌي',
  'health.c.teen1': 'پڙهائي جو دٻاءُ',
  'health.q.teen1': 'پڙهائي جو گهڻو دٻاءُ آهي، ان کي ڪيئن منهن ڏيان؟',
  'health.c.teen2': 'ننڊ نٿي اچي',
  'health.q.teen2': 'رات جو ننڊ صحيح نٿي اچي، ڇا ڪريان؟',
  'health.c.teen3': 'موبائيل جي لت',
  'health.q.teen3': 'موبائيل جي لت لڳي وئي آهي، ڇڏڻ جو طريقو ٻڌايو.',
  'health.c.teen4': 'گهڻي اداسي',
  'health.q.teen4': 'گهڻي اداسي محسوس ٿئي ٿي، ڪنهن سان ڳالهايان؟',
  'health.band.young.label': '18 – 30 سال',
  'health.band.young.note': 'نوڪري، پئسا ۽ ننڊ — ٽنهي جو گڏيل بار',
  'health.c.young1': 'ڪم جو دٻاءُ',
  'health.q.young1': 'ڪم جو دٻاءُ گهڻو آهي، ڪيئن گهٽ ڪريان؟',
  'health.c.young2': 'ويهڻ سان پٺيءَ ۾ سور',
  'health.q.young2': 'ويهي رهڻ سان پٺيءَ ۾ سور ٿي رهيو آهي، ڇا ڪريان؟',
  'health.c.young3': 'ننڊ نٿي اچي',
  'health.q.young3': 'رات جو ننڊ نٿي اچي، ڪهڙو علاج آهي؟',
  'health.c.young4': 'پئسو گهٽ آهي',
  'health.q.young4': 'پئسا گهٽ آهن ۽ خرچ گهڻو، ڇا ڪيان؟',
  'health.band.middle.label': '31 – 45 سال',
  'health.band.middle.note': 'گهر، ٻار ۽ پنهنجي صحت — سڀني جي ذميواري گڏجي',
  'health.c.middle1': 'لِڪَ ۾ سور',
  'health.q.middle1': 'لِڪَ ۾ سور پيو ٿئي، ڪهڙو سبب ٿي سگهي ٿو؟',
  'health.c.middle2': 'ننڊ صحيح ناهي',
  'health.q.middle2': 'ننڊ سٺي نٿي اچي، سڌارڻ جو ڪهڙو طريقو آهي؟',
  'health.c.middle3': 'گهر جو تڻُ',
  'health.q.middle3': 'گهر جو تڻُ گهڻو آهي، ٻارن کي ڪيئن سنوارين؟',
  'health.c.middle4': 'پيٽ ۾ گئس',
  'health.q.middle4': 'ڪم تي ڪيترن سالن کان پيٽ ۾ گئس جو مسئلو آهي، ڇا ڪيان؟',
  'health.band.later.label': '46 – 60 سال',
  'health.band.later.note': 'جسم جي عمر ۽ ان جي سنڀال — ٻئي گڏجي',
  'health.c.later1': 'پٺيءَ ۾ سور',
  'health.q.later1': 'ممون جي عمر 54 سال آهي ۽ مون کي پٺيءَ ۾ سور آهي، ڇا ڪيان؟',
  'health.c.later2': 'ڏونڍيءَ ۾ سور',
  'health.q.later2': 'ڏونڍيءَ ۾ سور پيو ٿئي چڙهڻ وقت، ڇو؟',
  'health.c.later3': 'رات جو پير ۾ واهڙ',
  'health.q.later3': 'رات جو پير ۾ واهڙ پوي ٿي، ڇا ڪيان؟',
  'health.c.later4': 'صبح جو اَٽڪاءُ',
  'health.q.later4': 'صبح جو اٿي لِڪَ ۾ اَٽڪاءُ ٿئي ٿو، سبب ڪهڙو ٿي سگهي ٿو؟',
  'health.band.senior.label': '61 – 75 سال',
  'health.band.senior.note': 'دوا، توازن ۽ اڪيلائي — ٽئي گڏجي',
  'health.c.senior1': 'هلڻ ۾ تڪليف',
  'health.q.senior1': 'ڏونڍين ۾ ايترو سور آهي جو هلڻ ڏکيو آهي، ڇا ڪيان؟',
  'health.c.senior2': 'دوا جي جاچ',
  'health.q.senior2': 'گهڻيون دوائون روز کائڻيون پونديون آهن — ڪيئن خبر پوندي ته ڪهڙي نقصانڪار آهي؟',
  'health.c.senior3': 'رات جو پيشاب',
  'health.q.senior3': 'رات جو وار وار پيشاب جو مسئلو آهي، ڇا ڪيان؟',
  'health.c.senior4': 'ٻڌڻ ۾ گهٽ',
  'health.q.senior4': 'گهٽ ٻڌڻ ۾ اچي ٿو، ٻڌڻ جو ڪو علاج ٻڌايو.',
  'health.band.elder.label': '76 – 100 سال',
  'health.band.elder.note': 'هر دوا جي جاچ ضروري، هر πε ڪرڻ خطرناڪ',
  'health.c.elder1': 'πε جو ڊڄ',
  'health.q.elder1': 'گهر ۾ πε وڃڻ جو ڊڄ آهي، ڪهڙي حفاظت رکان؟',
  'health.c.elder2': 'يافت ڪمزور',
  'health.q.elder2': 'يافت ڪمزور ٿي رهي آهي، ڪهڙو علاج آهي؟',
  'health.c.elder3': 'روز جي سور جي دوا',
  'health.q.elder3': 'سور جي دوا روز کائڻي پوي ٿي — ڇا ان جو ڪو نقصان آهي؟',
  'health.c.elder4': 'ڪڏهن ڊاڪٽر وٽ',
  'health.q.elder4': 'ڪڏهن ڊاڪٽر وٽ وڃڻ ضروري آهي؟',
  'ask.notConfigured': 'هيءَ خدمت هينئر پنهنجن پراڻن جوابن مان جواب ڏئي رهي آهي. توهان جو سوال ان ۾ نه مليو.',
  'ask.browseTitle': 'هتي جيڪي ليک آهن، سي ڏسو',
  'download.pdf': 'PDF ۾ لکو',
  'download.text': 'ٽيڪسٽ ۾ لکو',
  'download.printNow': 'پرنٽ ڪريو',
  'download.preparing': 'تيار ٿي رهيو آهي',
  'download.blocked': 'نئون ٽيب نه کلي سگهيو. Pop-up بلاڪ ٿي رهيو آهي — پنهنجي برائوزر ۾ الڳ ٽيب کوليو.',
  'attach.button': 'پنهنجو دستاويز يا فوٽو شامل ڪريو',
  'attach.formats': 'PDF، فوٽو (JPG/PNG) يا ٽيڪسٽ فائل — 12 MB تائين',
  'attach.reading': 'پڙهي رهيو آهي…',
  'attach.attached': 'لڳائي ڇڏيو',
  'attach.remove': 'هٽايو',
  'attach.tooBigPdf': 'هي PDF 12 MB کان وڏي آهي. ننڍي فائل چونڊيو.',
  'attach.tooBigImage': 'هي فوٽو 3 MB کان وڏو آهي. ننڍو فوٽو چونڊيو.',
  'attach.scannedPdf': 'هي PDF اسڪين ٿيل آهي — هن ۾ صرف تصوير آهي، پڙهي نٿي سگهجي. هن جو فوٽو موڪليو.',
  'attach.pdfFailed': 'هي PDF پڙهي نه وئي.',
  'attach.imageFailed': 'هي فوٽو لوڊ نه ٿيو.',
  'attach.wrongType': 'هي فائل نه هلي سگهندي. PDF، فوٽو يا ٽئڪسٽ فائل موڪليو.',
  'attach.hint': 'پنهنجو ڪاغذ هتي لڳائي سوال پڇو — اسين ان مان ئي جواب ڏينداسين.',
  'ask.sendWithFile': 'جواب گهرجي',
  'lib.title': 'مفت لائبريري',
  'lib.intro': 'پڙهائي جون ڪتابون، ڪتاب، تصويرون ۽ آڊيو — سڀ مفت ۽ قانوني طريقي سان.',
  'lib.legalTitle': 'ڪاپي رائيٽ جو ڪو مسئلو ناهي.',
  'lib.legal': 'هتي جيڪو ڪجهه ڏنو ويو آهي، اهو بلڪل مفت آهي ۽ توهان ان کي اڳتي به ونڊ ڪري سگهو ٿا. جيڪو ڪتاب اڃا ڪاپي رائيٽ ۾ آهي، اهو هتي نه هوندو — ان کي توهان ڪاپي نٿا ڪري سگهو، اهو صاف چوڻ ضروري آهي.',
  'ask.signInFirst': 'پهرين لاگ ان ٿيو، پوءِ سوال پڇو.',
  'ask.signInTitle': 'پهرين لاگ ان ٿيو',
  'ask.signInBody': 'سوال پڇڻ لاءِ پنهنجو کاتو ٺاهيو. هن ۾ هڪ منٽ کان به گهٽ وقت لڳي ٿو، ۽ توهان پڇندا رهندا.',
  'ask.signInCta': 'کاتو ٺاهيو يا لاگ ان ٿيو',
  'ask.signInOr': 'اڃا کاتو نٿا ٺاهي سگهو؟ هي ڪم به توهان کان سواءِ ٿي ويندو:',
  'account.title': 'مُهنجو کاتو',
  'account.intro': 'پنهنجو نالو ۽ پاسورڊ وجهي سوال پڇڻ شروع ڪريو.',
  'account.signIn': 'داخل ٿيو',
  'account.register': 'کاتو ٺاهيو',
  'account.signInNote': 'پوئين دفعي جو نالو ۽ پاسورڊ وجهو.',
  'account.registerNote': 'سوال پڇڻ لاءِ کاتو ضروري ناهي. اهو صرف توهان جي ٻولي ۽ جواب ياد رکڻ لاءِ آهي.',
  'account.handle': 'توهان جو نالو',
  'account.handlePlaceholder': 'جيئن ته: sita.ji',
  'account.password': 'پاسورڊ',
  'account.passwordHint': 'گهٽ ۾ گهٽ 6 اکر.',
  'account.phone': 'فون نمبر',
  'account.optional': 'ضروري ناهي',
  'account.phoneHint': 'ڏيڻ چاهيو ته ڏيو. ڪوبه فون نه به ڏيو ته کاتو بڻجي ويندو.',
  'account.create': 'کاتو ٺاهيو',
  'account.logout': 'باهير نڪريو',
  'account.open': 'کاتو کوليو',
  'account.signedInAs': 'توهان لاگ ان آهيو',
  'account.signedOut': 'کاتو نه کليو',
  'account.signedOutBody': 'اڃا ڪوبه کاتو ناهي کليو.',
  'account.saved': 'جمع ڪيل جواب',
  'account.savedEmpty': 'اڃا ڪوبه جواب جمع ناهي. جواب اچڻ تي \'جمع ڪريو\' دٻايو.',
  'account.savedUnavailable': 'جمع جواب اڃا نٿا ڏسجن. باقي سڀ هلي رهيو آهي.',
  'account.wait': 'مهرباني ڪري انتظار ڪريو…',
  'account.privacyTitle': 'توهان جون ڳالهيون محفوظ',
  'account.privacyBody': 'کاتو ٺاهڻ تي صرف توهان جو نالو، پاسورڊ ۽ ٻولي رکي وڃي ٿي. سوال جو ڪوبه رڪارڊ نٿو بڻجي. توهان جا سوال ڪنهن کي موڪليا نٿا وڃن.',
  'account.errWrong': 'نالو يا پاسورڊ غلط آهي.',
  'account.errTaken': 'هي نالو پهريان ئي ورتو ويو آهي. ٻيو نالو چونڊيو.',
  'account.errBad': 'ڄاڻ صحيح طرح ڀريو.',
  'account.errWait': 'تمام گهڻي ڪوشش ٿي وئي. ٿوري دير بعد ڪوشش ڪريو.',
  'account.errTryLater': 'اڃا نه ٿي سگهيو. ڪجهه دير بعد ڪوشش ڪريو.',
  'lib.licence.ccBy': 'توهان ان کي ڪاپي ۽ شيئر ڪري سگهو ٿا، ڇاڻي به سگهو ٿا — بس ذريعي جو نالو ڏيڻو پوندو.',
  'lib.licence.ccBySa': 'توهان ان کي ڪاپي ۽ ڇاڻي سگهو ٿا. جيڪي تبديليون ڪندا، اهي پڻ کلي طرح ڏيڻيون پونديون.',
  'lib.licence.ccZero': 'پوري طرح مفت. ذريعي جو نالو ڏيڻ به ضروري ناهي.',
  'lib.licence.pd': 'ڪنهن جو ڪاپي رائيٽ ناهي — جيڪو چاهي ڪاپي ڪري سگهي ٿو.',
  'lib.licence.govtIndia': 'حڪومتِ هند جي ويب سائيٽ تي. پڙهڻ ۽ ڇاپڻ ٻئي مفت آهن.',
  'lib.licence.creativeCommons': 'هر فائل جو پنهنجو لائسنس آهي — فائل تي ڏسو.',
  'lib.licence.freeToRead': 'پڙهڻ مفت آهي. ڪاپي ڪري اڳتي ڏيڻ به ساڳئي شرط تي آهي جنهن تي هي مليو.',
  'lib.openBadge': 'کليل',
  'lib.openBadgeNote': 'هن کي ڪاپي ڪري سگهو ٿا',
  'lib.freeBadge': 'مفت',
  'lib.freeBadgeNote': 'پڙهي سگهو ٿا، ڪاپي نٿا ڪري سگهو',
  'lib.govt': 'سرڪاري',
  'lib.noSignup': 'بغير اڪائونٽ جي',
  'lib.open': 'هتي کوليو',
  'lib.group.padhai': 'پڙهائيءَ جون ڪتابون',
  'lib.group.padhai.note': 'اسڪول، ڪاليج ۽ سرڪاري تعليمي مواد',
  'lib.group.kitab': 'ڪتابون',
  'lib.group.kitab.note': 'جن تي ڪاپي رائيٽ ناهي يا جن کي ڪاپي ڪرڻ جي اجازت آهي',
  'lib.group.tasveer': 'تصويرون ۽ نقشا',
  'lib.group.tasveer.note': 'نقشا، تصويرون، نشان - سڀ ڪجهه',
  'lib.group.audio': 'ٻڌڻ وارو مواد',
  'lib.group.audio.note': 'ڪتاب ٻڌي سگهو ٿا، پڙهڻ جي ضرورت ناهي',
  'lib.warnTitle': 'هر ڪتاب هتي موجود ناهي',
  'lib.warn': 'ڪجهه ڪتابن تي ڪاپي رائيٽ آهي ۽ اهي قانون موجب مفت نٿا ڏئي سگهجن. اسان ڄاڻي ٻجهي اهي نٿا ڏيکاريون. جيڪڏهن ڪو ڪتاب گهرجي ته هيٺ سوال پڇو — جيڪو جواب ملي سگهندو، اهو ملي ويندو.',
  'lib.askInstead': 'سوال پڇو',
  'nav.library': 'لائبريري',
  'support.contactMessageLabel': 'توهان جي ڳالهه',
  'support.contactPlaceholder': 'جيڪو لکڻو هجي اهو لکو — جيڪڏهن ڪا غلطي هجي، ڪجهه سٺو مليو هجي، يا ڪو سوال هجي.',
  'support.contactHelp': 'گهٽ ۾ گهٽ 10 اکر. هي سڌو مالڪ وٽ وڃي ٿو.',
  'support.contactSubmit': 'موڪليو',
  'support.contactSending': 'موڪلي رهيا آهيون...',
  'support.contactPrivacy': 'توهان جو نالو لکڻ ضروري ناهي.',
  'support.contactSent': 'پئجي ويو',
  'support.contactSentBody': 'توهان جي ڳالهه مالڪ تائين پهچي وئي آهي.',
  'support.contactFailed': 'موڪلي نه سگهياسين',
  'support.faq1Q': 'ڇا هي واقعي مفت آهي؟',
  'support.faq1A': 'ها. ڪو پئسو نٿو ورتو وڃي، ڪو اشتهار نٿو ڏيکاريو وڃي، ۽ ڪا رڪنيت (سبسڪرپشن) ناهي. هي هڪ فرد جي پئسن سان هلي ٿي، ڪنهن ڪمپني يا سرڪار جي پئسن سان نه.',
  'support.faq2Q': 'ڇا منهنجو نالو، پتو يا فون نمبر ورتو وڃي ٿو؟',
  'support.faq2A': 'نه، ۽ اهو ڪڏهن به نه ورتو ويندو. هي سائيٽ پنهنجي پاڻ ۾ ڪا سڃاڻپ نٿي ٺاهي — ڪو لاگ ان ناهي، ڪا ٽريڪنگ اسڪرپٽ ناهي. جيڪو پڇيو وڃي ٿو اهو صرف توهان جو سوال آهي.',
  'support.faq3Q': 'ڇا هي ڊاڪٽر يا وڪيل آهي؟',
  'support.faq3A': 'نه. هي ڪا دوائن جي صلاح نٿو ڏئي ۽ نه ئي ڪا قانوني صلاح. جتي ڳالهه سنگين هوندي آهي اتي هي توهان کي ڊاڪٽر يا آفيسر وٽ وڃڻ لاءِ چوندو آهي — هي انهن جي جاءِ نٿو وٺي.',
  'support.faq4Q': 'ڇا هر جواب صحيح هوندو آهي؟',
  'support.faq4A': 'هميشه نه. جواب هڪ ڪمپيوٽر لکي ٿو، ڪو ڊاڪٽر نه — تنهنڪري هر جواب سان گڏ هي لکيل آهي ته هي طبي صلاح ناهي. ڪا به دوا شروع ڪرڻ يا بند ڪرڻ کان اڳ ڊاڪٽر سان ضرور ملڻ گهرجي.',
  'support.faq5Q': 'ڇا مون کي ڪو ايپ ڊائونلوڊ ڪرڻو پوندو؟',
  'support.faq5A': 'نه. هي صرف برائوزر ۾ کلي ٿي. ڪا ايپ انسٽال نه، ڪا اجازت نه، ڪو اپڊيٽ نه.',
  'nav.remedies': 'گهريلو علاج',
  'remedy.title': 'آيورويدڪ گهريلو علاج',
  'remedy.intro': 'جيڪا به تڪليف هجي — کنگهه، مٿي جو سور، جوڙن جو سور، خارش، شگر، پٺيءَ جو سور — هيٺ پنهنجي تڪليف چونڊيو يا پنهنجن لفظن ۾ پڇو. گهريلو ڪاڙهو، مالش، کائڻ پيئڻ ۽ آيورويدڪ اپاءَ ٻڌايا ويندا.',
  'remedy.choose': 'پنهنجي تڪليف چونڊيو',
  'remedy.emergencyStrong': 'اهي ايمرجنسي آهن:',
  'remedy.emergency': 'سُپ جو ڏنگڻ، ٻيڇو (ويڇو) جو ڏنگڻ ۽ ڪتي جو ڏنگڻ — فوري طور اسپتال وڃو، پهريان 112 تي فون ڪريو. گهريلو اپاءَ صرف رستي ۾ ڪرڻ لاءِ آهن، اسپتال جي جاءِ ناهن.',
  'remedy.note': 'گهريلو ۽ آيورويدڪ اپاءَ تڪليف گهٽ ڪرڻ ۾ مدد ڪن ٿا؛ اهي ڊاڪٽر جي چڪاس ۽ علاج جي جاءِ ناهن. ڪا به دوا پنهنجي مرضي سان بند يا شروع نه ڪريو.',
  'remedy.cough': 'کنگهه',
  'remedy.headache': 'مٿي جو سور',
  'remedy.joints': 'جوڙن جو سور',
  'remedy.itching': 'خارش',
  'remedy.snake': 'سُپ جو ڏنگڻ',
  'remedy.scorpion': 'ٻيڇو جو ڏنگڻ',
  'remedy.dog': 'ڪتي جو ڏنگڻ',
  'remedy.diabetes': 'شگر',
  'remedy.back': 'پٺيءَ جو سور',
  'remedy.walking': 'هلڻ ۾ تڪليف',
  'home.remedyNote': 'VARSHA SAMADHAN AI: ڪاڙهو، مالش، کائڻ پيئڻ ۽ آيورويدڪ اپاءَ — هر تڪليف لاءِ، توهان جي ٻوليءَ ۾.',
  'nav.aarti': 'آرتي ۽ ڀڄن',
  'aarti.title': 'آرتي ۽ ڀڄن — اصل آواز ۾',
  'aarti.intro': 'هتي آرتي، ڪيرتن ۽ ڀڄن ٻڌو — اصل ڳائڻن ۽ مندرن جي آواز ۾. ڪو به AI آواز ناهي.',
  'aarti.note': 'ڪمپيوٽر جي آواز ۾ آرتي يا ڀڄن ٻڌڻ سان ان جي لئه ۽ عقيدت ختم ٿي ويندي آهي. ان ڪري هتي صرف اصل رڪارڊنگون آهن.',
  'aarti.kindAarti': 'آرتي',
  'aarti.kindKirtan': 'ڪيرتن',
  'aarti.kindBhajan': 'ڀڄن',
  'aarti.credit': 'رڪارڊنگ:',
  'aarti.licence': 'لائسنس:',
  'aarti.listenLink': 'اصل آواز ۾ ٻڌو',
  'aarti.textChecked': 'هي روايتي متن آهي، جيئن اصل رڪارڊنگ ۾ ڳايو ويو آهي.',
  'aarti.textPrinted': 'هي مروج متن آهي، جنهن کي شايع ٿيل مجموعن سان ڀيٽي چڪاسيو ويو آهي.',
  'aarti.textNotStored': 'هن گرنٿ جو پورو متن هتي محفوظ ناهي — هيٺ رڪارڊنگ ۾ پورو متن هلي ٿو.',
  'aarti.granthTitle': 'گرنٿ، چالِيسا ۽ استوتر — اصل آواز ۾',
  'aarti.noRecording': 'هن آرتي جي اصل رڪارڊنگ اڃا سائيٽ تي ناهي، ان ڪري مان ان کي ڳائي نٿو ٻڌائي سگهان — VARSHA SAMADHAN AI ڪڏهن به AI آواز ۾ آرتي ناهي ڳائيندو.',
  'aarti.textOnlyTitle': 'ٻيون آرتيون — متن به، اصل آواز به',
  'aarti.fullText': 'پورو متن',
  'aarti.notChecked': 'هن آرتي جو تصديق ٿيل متن اڃا سائيٽ تي ناهي. بغير چڪاس جي متن ڏيڻ صحيح ناهي، ان ڪري اهو نٿو ڏنو وڃي.',
  'aarti.verifiedList': 'سائيٽ تي انهن آرتين جو تصديق ٿيل متن موجود آهي:',

};

/* -------------------------------------------------------------------------- */
/* KONKANI                                                                   */
/* -------------------------------------------------------------------------- */

const KONKANI: Record<string, string> = {
  'jgd.placeSearch': 'शाराचें नांव बरोयात',
  'jgd.placeNoMatch': 'हें शार वळेरेंत ना. लागींचें दुसरें शार वेंचून काडात.',
  'account.name': 'तुमचें नांव',
  'account.namePlaceholder': 'देखीक: सीता देवी',
  'account.nameHint': 'हें तुमची वळख पटोवपाखातीर आसा. खंयचेंय नांव चलत, आनी हें अनिवार्य न्हय.',
  'nav.home': 'घर',
  'home.metaTitle': 'फुकट समाधान, तुंच्या आपल्या उतरांनी',
  'lib.licence.ccZero.name': 'CC0 / सार्वजनिक डोमेन',
  'lib.licence.pd.name': 'सार्वजनिक डोमेन',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिव कॉमन्स (मिश्रित)',
  'lib.licence.freeToRead.name': 'वाचपाखातीर मुक्त',
  'lib.entry.ncert.title': 'NCERT पुस्तकां — इयत्ता 1 ते 12',
  'lib.entry.ncert.what': 'दर एका विशयाचीं सगळीं पुस्तकां, आतां दर इयत्तेखातीर. लॉगिन नासताना, थेट PDF.',
  'lib.entry.ncert.langs': 'हिंदी, इंग्लीश आनी 30 वयर भारतीय भासो',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल पाठ्यपुस्तकां',
  'lib.entry.pm-evidya.what': 'NCERT पुस्तकांचें ॲप, व्हड अक्षरांनी वाचूं येता. आयकूनूय घेवंक मेळटा.',
  'lib.entry.pm-evidya.langs': 'भारतीय भासो',
  'lib.entry.diksha.title': 'DIKSHA — शिक्षक आनी भुरग्याखातीर',
  'lib.entry.diksha.what': 'अभ्यासक्रम, व्हिडिओ आनी सराव — इयत्ता 1 ते 12.',
  'lib.entry.diksha.langs': 'भारतीय भासो',
  'lib.entry.khan-academy.title': 'Khan Academy — इंग्लीश भाशेंत गणित आनी विज्ञान',
  'lib.entry.khan-academy.what': 'व्हिडिओ धडे, दर इयत्तेखातीर. वाचपी लोकांखातीर बरयल्लेंय आसा.',
  'lib.entry.openstax.title': 'OpenStax — इंग्लीश भाशेंत फुकट पुस्तकां',
  'lib.entry.openstax.what': 'कॉलेज पांवड्याचीं पुस्तकां — गणित, विज्ञान, मानविकी. दर पानाचेर PDF.',
  'lib.entry.nios.title': 'NIOS — दुरस्थ शिक्षण, फुकट साहित्य',
  'lib.entry.nios.what': 'ओपन आनी ऑनलाईन कोर्सचीं फुकट पुस्तकां, प्रवेश घेनासतना.',
  'lib.entry.nios.langs': 'हिंदी, इंग्लीश आनी हेर',
  'lib.entry.ignou.title': 'IGNOU — व्हड शाळेंतलीं फुकट पुस्तकां',
  'lib.entry.ignou.what': 'दुरस्थ शिक्षणाचीं पुस्तकां जीं एकदम फुकट मेळटात.',
  'lib.entry.gutenberg.title': 'Project Gutenberg — इंग्लीश भाशेंतलीं जुनीं पुस्तकां',
  'lib.entry.gutenberg.what': '70,000 वयर पुस्तकां, सगळीं कॉपीराइट सोंपिल्लीं. फुकट ई-बुक आनी ऑडिओ.',
  'lib.entry.pratham-books.title': 'Pratham Books — भुरग्यांचीं पुस्तकां',
  'lib.entry.pratham-books.what': 'भारतीय भासांतल्यान भुरग्यांचीं पुस्तकां, एकदम फुकट. इयत्ता 1 ते 5 खातीर.',
  'lib.entry.pratham-books.langs': 'हिंदी, मराठी, बंगाली, तमिळ, तेलगू आनी हेर',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — खबरांपत्रां आनी जुनीं नेमाळीं',
  'lib.entry.internet-archive-texts.what': 'लाखांनी जुनीं पुस्तकां, नेमाळीं आनी खबरांपत्रां — फुकट.',
  'lib.entry.wikisource.title': 'Wikisource — लोक-गद्य पाठ',
  'lib.entry.wikisource.what': 'कॉपीराइट ना — हीं संवसारांतलीं जुनीं साहित्यीक पुस्तकां आसात.',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — दर एक चित्र',
  'lib.entry.wikimedia-commons.what': 'उपजाती, नकाशे, ताऱ्यां, इतिहास — सगळें कांय. दर चित्राचेर वेगळो परवानो बरयल्लो आसा.',
  'lib.entry.pixabay.title': 'Pixabay — चित्रां आनी रेखाचित्रां',
  'lib.entry.pixabay.what': 'चित्रां, रेखाचित्रां आनी ल्हान व्हिडिओ.',
  'lib.entry.unsplash.title': 'Unsplash — सुंदर चित्रां',
  'lib.entry.unsplash.what': 'फुकट, व्हड अक्षरांनी, अकाउंट नासताना.',
  'lib.entry.openverse.title': 'Openverse — सगळीं चित्रां एकाच सुवातेर',
  'lib.entry.openverse.what': 'अनेक फुकट चित्रांच्या साईट्स एकाच वेळार सोदून काडात.',
  'lib.entry.librivox.title': 'LibriVox — आयकून घेवपाचीं पुस्तकां',
  'lib.entry.librivox.what': 'जुन्या इंग्लीश पुस्तकांचो फुकट ऑडिओ, मनशाच्या आवाजांत.',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ऑडिओ संग्रह',
  'lib.entry.internet-archive-audio.what': 'हजारों फुकट ऑडिओ — पुस्तकां, भाशणां, संगीत.',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राश्ट्रगीत आनी देशभक्तीपर गितां',
  'lib.entry.vande-mataram.what': 'भारताचें राश्ट्रगीत आनी हेर राश्ट्रीय गितां, फुकट.',
  'art.aag-aur-bijli-ke-bachav.title': 'उजो आनी वीज हांचेपसून बचाव करपाचे नेम',
  'art.aag-aur-bijli-ke-bachav.summary': 'घरांत उजो लागना जावपाखातीर उपाय — साधे नेम',
  'art.aag-lagne-par-kya-karein.title': 'उजो लागल्यार काय करचें',
  'art.aag-lagne-par-kya-karein.summary': 'पेटिल्ल्या घरांत उजो — पयलीं काय करचें, काय करचें न्हय',
  'art.bimari-se-bachav.title': 'संसर्ग सावन सांत नेम',
  'art.bimari-se-bachav.summary': 'हात धुवप, मास्क, लस — हाचेवरल्यान सावन',
  'art.dhuwan-ka-jhakora.title': 'धुवाँच्या झोतासावन सावन',
  'art.dhuwan-ka-jhakora.summary': 'दम कोंडप, श्वास घेवपाक त्रास जावप — कितें करचें, केन्ना हॉस्पिटलांत वचचें',
  'art.doodh-pani-band-ho.title': 'वीज वा उदक अचानक बंद जाल्यार',
  'art.doodh-pani-band-ho.summary': 'कितें करचें, कशें सांबाळचें, केन्ना मदत मागची',
  'art.haath-ki-saafai.title': 'साबणाशिवाय हात धुवपाची रीत',
  'art.haath-ki-saafai.summary': 'जेन्ना उदक वा साबण नासता',
  'cat.dhyan-aur-yoog.title': 'ध्यान आनी योग',
  'cat.dhyan-aur-yoog.subtitle': 'मन शांत करपाचे सोपे उपाय',
  'cat.gharelu-marammat.title': 'घराची दुरुस्ती',
  'cat.gharelu-marammat.subtitle': 'घराच्या ल्हान-ल्हान समस्यांचो उपाय',
  'cat.bachchon-ki-padhai.title': 'भुरग्यांचो अभ्यास',
  'cat.bachchon-ki-padhai.subtitle': 'अभ्यासांत लक्ष, त्रास जाल्यार',
  'cat.budharge-seva.title': 'जाणट्यांची सेवा',
  'cat.budharge-seva.subtitle': 'सांबाळ आनी आदार',
  'cat.shishu-dekhbhal.title': 'भुरग्यांची सांबाळ',
  'cat.shishu-dekhbhal.subtitle': 'ल्हान भुरग्याची बरी सांबाळ',
  'cat.dharmik-upay.title': 'धर्मीक उपाय',
  'cat.dharmik-upay.subtitle': 'मनाच्या शांतीखातीर',
  'cat.pavan-grah-aur-aarti.title': 'पवित्र ग्रंथ आनी आरती',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धेन वाचात आनी आयकात',
  'cat.aapatkalen-gayide.title': 'आणीबाणीची मार्गदर्शिका',
  'cat.aapatkalen-gayide.subtitle': 'जेन्ना तातडीची मदत जाय',
  'cat.mahamari-suraksha.title': 'महामारी सावन सुरक्षा',
  'cat.mahamari-suraksha.subtitle': 'रोग पातळपासावन सावन',
  'nav.tribute': 'स्मरण',
  'nav.help': 'मदत',
  'nav.reference': 'संदर्भ',
  'nav.reviews': 'अभिप्राय',
  'nav.support': 'मदत करात',
  'nav.birthChart': 'जल्म कुंडली',
  'jgd.title': 'तुमची जल्म कुंडली',
  'jgd.intro': 'तुमचें नांव, जल्माची तारीख, आनी शक्य जाल्यार जल्माची वेळ आनी सुवात बरयात. सगळी गणना तुमच्या फोनारच जातली — खंयच कांय धाडपाची गरज ना. VARSHA SAMADHAN AI',
  'jgd.nameLabel': 'जल्मावेळचें नांव',
  'jgd.namePlaceholder': 'पूर्ण नांव',
  'jgd.nameHint': 'लहानपणाचे नांव बरयात.',
  'jgd.dateLabel': 'जल्माची तारीख',
  'jgd.timeLabel': 'जल्माची वेळ',
  'jgd.timeHint': 'माहित नासल्यार रिकामी दवरात.',
  'jgd.placeLabel': 'जल्माची सुवात',
  'jgd.placeNone': 'खबर ना / वेंचून काडात',
  'jgd.placeHint': 'जल्माचें शार वेंचून काडात.',
  'jgd.submit': 'गणना करात',
  'jgd.savePdf': 'PDF तयार करात',
  'jgd.again': 'नवी गणना',
  'jgd.errDate': 'कृपया जल्माची तारीख बरोबर बरयात.',
  'jgd.errPlace': 'जल्माचें शार वळेरेंतल्यान वेंचून काडात, वा लागींचें शार वेंचात.',
  'jgd.numTitle': 'अंकशास्त्र',
  'jgd.lifePath': 'जीवन मार्ग',
  'jgd.nameNumber': 'नांवाचो अंक',
  'jgd.soulNumber': 'आत्म्याचो अंक',
  'jgd.birthdayNumber': 'जल्म दिसाचो अंक',
  'jgd.astroTitle': 'वैदीक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'पद',
  'jgd.rashi': 'रास',
  'jgd.rashiLord': 'रास स्वामी',
  'jgd.nakshatraLord': 'नक्षत्र स्वामी',
  'jgd.lagna': 'लग्न',
  'jgd.lagnaMissing': 'लग्न काडपा खातीर जल्माची वेळ आनी सुवात जाय. वयर भरून उपरांत गणना करात, आनी खबर ना जाल्यार इतलेंय पुरो.',
  'jgd.gunTitle': 'गुण मेळवणी',
  'jgd.gunIntro': 'दुसऱ्या व्यक्तीचें नांव आनी जल्मतारीख भरा.',
  'jgd.gunName': 'ताचे नांव',
  'jgd.gunDate': 'ताची जल्मतारीख',
  'jgd.gunHint': 'दोगांयचें नांव आनी जल्मतारीख आसल्यार गुण मेळवणी मेळटली.',
  'jgd.disclaimer': 'ही परंपरेप्रमाण केल्ली गणना आसा, भविश्यवाणी न्हय. खंयचीय संख्या वा रास कोणाचेंय भलायकी, धन वा संबंद थारावना. व्हड निर्णय डॉक्टर, कायदेशीर सल्ल्या वा जाणकारांच्या सल्ल्यान घेयात.',
  'nav.menu': 'मेन्यू',
  'nav.openMenu': 'मेन्यू उगडा',
  'nav.closeMenu': 'मेन्यू बंद करा',
  'nav.expand': 'विस्तार करा',
  'nav.collapse': 'लहान करा',
  'nav.skip': 'थेट मजकुराचेर वचा',
  'nav.language': 'भास बदलची',
  'footer.pages': 'पानां',
  'footer.helplines': 'गरजेचे नंबर',
  'footer.free': 'ही सेवा पुरायपणान फुकट आसा. कोणाकडल्यानूच पयशे घेनात.',
  'footer.readStory': 'तांची पुराय कथा वाचा',
  'footer.admin': 'प्रबंधक',
  'footer.rights': 'फुकट सेवा',
  'footer.emergency': 'आणीबाणी',
  'footer.ambulance': 'अँब्युलन्स',
  'footer.women': 'महिला हेल्पलाइन',
  'home.dedication1': 'च्या यादस्तित — एक पुरायपणान फुकट सेवा.',
  'home.dedication2': 'तुमची समस्या बरयात वा सांगा.',
  'home.emergencyTitle': 'गरजेचें — बेगीन मदत जाय',
  'home.emergencyNote': 'हे पयलीं वाचा. बाकी सगळें उपरांत पळोवंक येता.',
  'home.readMore': 'पुराय म्हायती वाचा',
  'home.chooseTopic': 'खंयच्या विशयार जाणून घेवपाचें आसा?',
  'home.memorialEyebrow': 'ही साइट कोणा खातीर आसा',
  'home.memorialLine': 'जानी समाजा खातीर पुराय जिवित झुजले, आनी जंकां निमाणे आपल्या वांट्याचे हिशोब मेळ्ळेनात.',
  'home.memorialMore': 'तांची पुराय कथा वाचा',
  'home.kundaliTitle': 'जल्म कुंडली',
  'home.kundaliNote': 'पुराय कुंडली — ९ ग्रह, विमशोत्तरी दशा, फलादेश, योग, शोडशवर्ग, केपी, लाल किताब आनी अंक ज्योतिष. सगळी गणना तुमच्या फोनारच जातली.',
  'home.chooseTopicNote': 'सकयल दिल्ल्या विशयार टॅप करा. दर सुवातेर सोंप्या भाशेंत म्हायती दिल्या.',
  'home.askHere': 'ह्याच विशयार विचारा',
  'home.categoryEmpty': 'ह्या विशयार अजून कांयच बरयल्लें ना.',
  'home.soundTitle': 'शांतते खातीर आवाज',
  'home.soundIntro': 'कसलोच शुल्क ना, कसलीच जाहिरात ना. फकत मन शांत करपा खातीर.',
  'home.howTitle': 'ही सेवा कशी काम करता',
  'home.step1Title': 'तुमची गजाल बरयात वा सांगा',
  'home.step1Body': 'हिंदींत टाइप करा, वा माईक दाबून सांगा. कांयच वेगळें करपाची गरज ना — जें मनांत आसा तें बरयात.',
  'home.step2Title': 'बेगीन जाप मेळटा',
  'home.step2Body': 'दर एक प्रस्न नोंद जाता आनी ताची जाप बेगीन मेळटा. खूब लांब प्रस्नां पयलीं ल्हान प्रस्नां सावन सुरवात करा.',
  'home.step3Title': 'कसलेच पयशे ना, कसलीच खाजगी म्हायती ना',
  'home.step3Body': 'ही सेवा पुरायपणान फुकट आसा. तुमचें नांव, पत्तो वा फोन नंबर मागनात, आनी कसलीच जाहिरात दाखयनात.',
  'home.stepLabel': 'पावल',
  'home.freeTitle': 'ही सेवा पुरायपणान फुकट आसा',
  'home.freeBody': 'कसलेच पयशे घेनात, कसलीच खाजगी म्हायती मागनात, आनी कसलीच जाहिरात दाखयनात.',
  'help.q1.label': 'वीज वचून गेल्या, काय करूं?',
  'help.q1.question': 'घरात वीज गेली आसा. काय करपाक जाय, आनी मोबाईल फोन कसो चार्ज करचो?',
  'help.q2.label': 'भुरग्याची अभ्यासांत उणीव',
  'help.q2.question': 'मझ्या भुरग्याची अभ्यासांत खूब उणीव आसा. घरांत कशी सुदारणा करची?',
  'help.q3.label': 'जाणट्यांचे उपचार',
  'help.q3.question': 'मझ्या बापायचें वय खूब जालां, तांचे उपचार कसे करचे?',
  'help.q4.label': 'घरांत आग लागल्यार',
  'help.q4.question': 'रात्री घरांत आग लागल्यार सगळ्यात पयलीं काय करपाक जाय?',
  'help.title': 'तुमची समस्या बरोयात',
  'help.intro': 'सकयल बरोयात वा सांगात. खबर ना जाल्यार जशें मनांत येता तशें बरोयात — हेंच सगळ्यात म्हत्वाचें.',
  'help.suggested': 'सामान्य प्रस्न',
  'help.howTitle': 'ही सेवा कशी काम करता',
  'help.howBody': 'दर एक प्रस्न नोंद जाता आनी ताचें उत्तर लगेच मेळटा. तुमचें नांव, पत्तो वा फोन नंबर खंयच घेनात. सगळें फुकट आसा.',
  'ref.title': 'ही सेवा काय आसा, आनी कोणा खातीर आसा',
  'ref.intro': 'ही सेवा श्रीमती VARSHA हांच्या यादस्तीक तयार केल्या. हांगा सोंप्या भाशेंत सांगलां की ही काय करता, हातूंत काय आसा, आनी ताचे मर्यादे काय आसात. सगळें एकदम फुकट आसा — कसलेच पैसे घेनात, कसलीच जाहिरात दाखयनात, आनी कसलीच खाजगी म्हायती मागनात.',
  'ref.whatTitle': 'हातूंत काय काय आसा',
  'ref.what1': 'घरांत आग लागल्यार, वीज गेल्यार, भुरग्याची अभ्यासांत उणीव आसल्यार, आवय-बापायची राखण करची आसल्यार — अशा सामान्य समस्यांचे सोंपे उपाय, नितळ भाशेंत.',
  'ref.what2': 'प्रस्न सांगून विचारपाची सोय. सांगपाक येना जाल्यार बरोयात — दोगांयचें उत्तर सारकेंच मेळटा.',
  'ref.what3': 'दर एक प्रस्न नोंद जाता, देखून जें हेरांक त्रास दिता तें तुज्या पयलींच विचारलां आनी ताचें उत्तर मेळ्ळां.',
  'ref.what4': 'कसलीच जाहिरात ना, कसलीच नको ती म्हायती ना, आनी कसलीच खाजगी म्हायती मागनात. सगळें फुकट.',
  'ref.helplineTitle': 'लगेच मदती खातीर हे नंबर दवरात',
  'ref.helpline1': 'खंयचोय व्हड धोको आसल्यार — जशें आग, विजेचो धक्को, पडप वा खूब रक्त वचप — जाल्यार 112 नंबरार फोन करात.',
  'ref.helpline2': 'कोणाक आजार वा दुखापत जाल्यार आनी वचपाक खंयचोय मार्ग ना जाल्यार, 108 नंबरार ॲम्ब्युलन्स आपयात.',
  'ref.helpline3': 'बायले वांगडा खंयचोय वायट प्रकार जाल्यार, वा बायलेक खंय त्रास दितात जाल्यार, 181 नंबरार फोन करात. हें फुकट आसा.',
  'ref.helpline4': 'भुरग्या वा जाणट्या वांगडा अन्याय जाल्यार, 1098 नंबरार तक्रार करूंक येता.',
  'ref.helpline5': 'मानसीक ताण खूब आसल्यार, वा जगपाची इत्सा ना जाल्यार, 14416 नंबरार उलोवंक येता. फक्त उलोवपा खातीर.',
  'ref.dataTitle': 'आमी तुज्या विशीं काय दवरतात',
  'ref.dataBody': 'फक्त तो प्रस्न जो तूं विचारला, ताचो सार, आनी प्रस्न विचारपाची वेळ — जेणेकरून आमी सारकीं उत्तरां परत-परत दिवंक नजो. तुमचें नांव, पत्तो, फोन नंबर, वा तुमची वळख पटपी कसलीच म्हायती घेनात. साईटार कसलीच जाहिरात वा ट्रॅकिंग स्क्रिप्ट ना.',
  'ref.adminTitle': 'प्रबंधक काय करूंक शकतात',
  'ref.adminBody': 'प्रबंधक ते लेख पळोवंक शकतात जे तूं धाडल्यात, आनी तांचीं उत्तरां बरोवंक शकतात. तुजे परवानगी बगर ते खंयचोय लेख बदलूंक वा काडून उडोवंक शकनात, आनी तुजी म्हायती कोणाकय विकूंक शकनात.',
  'ref.statsCategories': 'विषय उपलब्ध आसात',
  'ref.statsArticles': 'लेख बरयल्यात',
  'ref.statsQuestions': 'प्रस्न विचारल्यात',
  'ref.ownerNote': 'ही सेवा खंयच्याय कंपनीची न्हय, खंयच्याय सरकाराची न्हय, तर एका व्यक्तीच्या यादस्तीक चलयतात. देखून हांगा कसलीच जाहिरात ना, कसलीच मेंबरशिप ना, आनी कसलेच पैसे घेनात.',
  'support.title': 'ही सेवा फुकट आसा',
  'support.intro': 'ही सेवा कोणा कडल्यानूच पैसे घेना. पूण ही चलपा खातीर — कांय मार्ग आसात जांतल्यान तूं मदत करूंक शकता. सगळ्यात सोंपो मार्ग सगळ्यात उपेगी आसा.',
  'support.waysTitle': 'तूं कशी मदत करूंक शकता',
  'support.way1Title': 'तुजो अणभव बरोयात',
  'support.way1Body': 'जर ह्या साईटा कडल्यान तुका कांय बरें मेळ्ळां — वा कांय अशें मेळ्ळां जें तुका गोंदळांत घालता — जाल्यार राय (Opinion) पेजचेर बरोयात. तुजें नांव सांगप गरजेचें ना.',
  'support.way2Title': 'तुज्या शारा विशीं सांगात',
  'support.way2Body': 'तूं जंय रावता, थंयची भास, रिती-रिवाज आनी अडचणी वेगळ्यो आसतात. जर तुज्या थंयची कांय गजाल हांगा ना जाल्यार, सांगात — जोडपा सारकी आसल्यार ती जोडून घेतलें.',
  'support.way3Title': 'तुजो अणभव हेरांक सांगात',
  'support.way3Body': 'जें हांगा बरयलां तें खूब लोकांक उपेगी पडूंक शकता, जर तांकां खबर आसली जाल्यार. खंयच्याय अशा मनशाक सांगात जाका हाची खऱ्यानीच गरज आसा.',
  'support.way4Title': 'हांगा येवन पळयात',
  'support.way4Body': 'जर तुजे कडेन वेळ आसल्यार, तर स्वता येवन पळयात की ही साईट नीट चलटा वा ना. कांय बिघडिल्लें दिसल्यार सांगात — एकदम फुकट नीट जातलें.',
  'support.contactTitle': 'कांय सांगपाचें आसा?',
  'support.contactBody': 'खंयचेय गजाली खातीर हांगा बरोवंक शकता — खंय चूक आसल्यार, कांय चड मेळ्ळां जाल्यार, वा खंयचोय प्रस्न आसल्यार. जितलें बरोवंक सोंपें वाटता, तितलेंच बरोयात.',
  'support.faqTitle': 'कांय गजाली ज्या वारंवार विचारतात',
  'support.faqBody': 'हें खऱ्यानीच फुकट आसा? हो. तुमचें नांव घेतात? ना, नांव दिवप गरजेचें ना. जाहिराती येतात? ना. खंयचोय फोन नंबर वा पत्तो मागनात? ना. खंयचेंय ॲप डाऊनलोड करपाक पडटलें? ना, फक्त ब्राउझरांत उघडटा.',
  'ask.label': 'तुमची समस्या बरोयात वा माईकचेर सांगात',
  'ask.placeholder': 'जशें: भुरग्याची अभ्यासांत उणीव आसा',
  'ask.help': 'एंटर दाबूनय धाडूंक शकता.',
  'ask.send': 'विचारयात',
  'ask.sending': 'विचार करतां…',
  'ask.clear': 'बरयल्लें पुसून उडयात',
  'ask.speak': 'सांगून विचारयात',
  'ask.listening': 'उलोवपाक सुरवात करा…',
  'ask.heard': 'आयकत आसा',
  'ask.stopListening': 'आयकुपाचे थांबयात',
  'ask.suggested': 'सामान्य प्रस्न',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'आयकात',
  'ask.stopSpeak': 'थांबयात',
  'ask.aiNote': 'हे उत्तर AI न दिला आसा. हें तज्ञांच्या सल्ल्याक पर्याय न्हय.',
  'ask.errorRateLimit': 'खूब प्रस्न एकाच वेळार धाडले. थोड्या वेळान परत प्रयत्न करा.',
  'ask.errorNetwork': 'इंटरनेट चलनात. कनेक्शन तपासून परत प्रयत्न करा.',
  'ask.notAnswer': 'ह्या प्रस्नाचें सरळ उत्तर आमचे कडेन ना.',
  'ask.emptyAnswer': 'ह्या वेळार उत्तर मेळूंक ना. थोडें वेगळें विचारून परत प्रयत्न करा.',
  'ask.micUnsupported': 'ह्या ब्राउझरांत उलोवन विचारपाक मेळचें ना. बरयून विचारयात.',
  'ask.heardWith': 'हें आयकत आसा:',
  'voice.notAllowed': 'मायकाची परवानगी मेळूंक ना. वयर वचून परवानगी द्यात, वा बरयून विचारयात.',
  'voice.serviceNotAllowed': 'मायकाची परवानगी मेळूंक ना. वयर वचून परवानगी द्यात, वा बरयून विचारयात.',
  'voice.noSpeech': 'खंयचोच आवाज आयकूंक येना. मायका लागीं उलोयात, वा बरयात.',
  'voice.audioCapture': 'खंयचोच मायक मेळूंक ना. डिव्हाइस जोडा, वा बरयून विचारयात.',
  'voice.network': 'उलोवन विचारपाखातीर इंटरनेट जाय, आनी तें चलनात. बरयून विचारयात — उत्तर तेंच मेळटलें.',
  'voice.aborted': 'थांबला. परत प्रयत्न करा.',
  'voice.unsupported': 'ह्या ब्राउझरांत उलोवन विचारपाक मेळचें ना. बरयून विचारयात.',
  'voice.speakFailed': 'हें उत्तर आयकपाक मेळूंक ना.',
  'voice.noVoice': 'ह्या डिव्हाइसार {name} उलोवपाचो आवाज मेळूंक ना. आतां बरयिल्लें वाचयात, वा फोनच्या सेटिंगांत वचून आवाज जोडा.',
  'voice.generic': 'कांयतरी गडबड जाल्या. परत प्रयत्न करा.',
  'sound.title': 'शांततेखातीर ध्वनी',
  'sound.intro': 'शुल्क ना, जाहिरात ना. फकत मन शांत करपाखातीर.',
  'sound.playing': 'आवाज चालू आसा. थांबवपाखातीर परत तेच बटण दाबात.',
  'sound.shankh': 'शंख',
  'sound.shankhHint': 'गंभीर, लांब',
  'sound.bansuri': 'बासरी',
  'sound.bansuriHint': 'मृदू, धिमे',
  'sound.dhol': 'नगाडो',
  'sound.dholHint': 'तीक्ष्ण, वेगवान',
  'sound.all': 'तिन्हीं',
  'sound.allHint': 'एकाच वेळार',
  'sound.listenLabel': 'आयकात',
  'sound.errUnsupported': 'हें ब्राउझर ध्वनी चलवपाक असमर्थ आसा.',
  'sound.errGeneric': 'ध्वनी चलवपांत अडचण आयल्या.',
  'dhun.welcome': 'स्वागत आसा',
  'dhun.prompt': 'शंख, बासरी आनी नगाडो — वांगडा आयकपाखातीर स्पर्श करा.',
  'dhun.listen': '▶ आयकात',
  'dhun.skip': 'ध्वनी वगळात',
  'dhun.failed': 'ध्वनी चलूंक ना.',
  'dhun.label': 'ध्वनी चलवपाची परवानगी',
  'reviews.title': 'तुमची प्रतिक्रिया, तुमची मळां',
  'reviews.intro': 'ही सेवा तुका उपकारली काय? तुमची मळां बरयात — तुमचें नांव सांगप गरजेचें न्हय.',
  'reviews.pageTitle': 'तुमची प्रतिक्रिया',
  'reviews.pageIntro': 'हांगा लोकांनी बरयिल्लें तेंच आसा. खंयचोच अभिप्राय लपोवपांत येना, आनी जें बरयलां तें हांगा दिसता — फकत एकदां तपासून पळयल्या उपरांत तें उजवाडाक येता.',
  'reviews.write': 'तुमची प्रतिक्रिया बरयात',
  'reviews.submit': 'धाडात',
  'reviews.sending': 'धाडटा आसा…',
  'reviews.name': 'तुमचें नांव (गरजेचें न्हय)',
  'reviews.city': 'तुमचें शार (गरजेचें न्हय)',
  'reviews.comment': 'तुमची मळां',
  'reviews.placeholder': 'मनांत जें आसा तें बरयात — कांयच दुरुस्त करपाची गरज ना.',
  'reviews.moderated': 'तुमची समीक्षा उजवाडाक येवचे पयलीं ती एकदा पळयतात.',
  'reviews.moderationNote': 'सगळें पुसून वचचें न्हय म्हणून, उजवाडाक येवचे पयलीं दर एक समीक्षा पळयतात. वायट उतरां, नंबर वा खाजगी गजाली काडून उडयतात — बाकी सगळें तशेंच उजवाडाक येता.',
  'reviews.summaryTitle': 'सामान्य मत',
  'reviews.count': 'समीक्षा',
  'reviews.anonymous': 'नांवाशिवाय',
  'reviews.summaryLine': 'लोकांनी सरासरी 5 पैकी {rating} तारके दिल्यात — {count} फावट.',
  'reviews.starsLabel': '5 पैकी {value} तारकां',
  'reviews.keepLabel': 'बरें वा वायट — दोनूय बरयात',
  'reviews.ownerReply': 'जबाब',
  'reviews.replyLabel': 'हाचेर बरयला',
  'reviews.empty': 'आतां मेरेन एकूय समीक्षा ना. पयली तुम्ही बरयात.',
  'reviews.toastSent': 'धन्यवाद',
  'reviews.toastFailed': 'मत धाडपाक मेळ्ळें ना',
  'reviews.fieldTooShort': 'उण्यांत उणें 10 अक्षरां बरयात.',
  'reviews.rateLimited': 'खूब बेगीन धाडटात. थोडो वेळ थांबून परत यत्न करात.',
  'cat.notFound': 'हें पान मेळ्ळें ना',
  'cat.empty': 'ह्या विशयार आतां एकूय लेख ना.',
  'article.emergency': 'गरजेचें',
  'article.askAbout': 'ह्याच विशयार विचारयात',
  'article.readAloud': 'हें लेख आयकात',
  'article.others': 'ह्याच विशयार हेर लेख',
  'article.count': '{count} लेख',
  'theme.toLight': 'उजवाडाच्या दिसपाचेर वचात',
  'theme.toDark': 'अंधाराच्या दिसपाचेर वचात',
  'toast.dismiss': 'बंद करात',
  'language.choose': 'तुमची भास वेंचून काडात',
  'language.articlesIn': 'हें लेख हिंदींत आसा.',
  'language.articlesInHint': 'दर एका भाशेंत वेगळो अणकार जाय. हो अणकार अजून जावंक ना — जें बरयला तें हिंदींतूच बरें आनी पूर्ण आसा.',
  'ask.welcome': 'तुमचें स्वागत आसा! सकयल तुमची समस्या बरयात वा एक विशय वेंचून काडात.',
  'ref.notTitle': 'हें काय करूंक शकना',
  'ref.not1': 'हें डॉक्टर न्हय. वखदांविशीं सल्ला केन्नाच दिवंक मेळना.',
  'ref.not2': 'हें वकील न्हय. कायदेशीर सल्ला दिवंक मेळना.',
  'ref.not3': 'कसलेच पैसे घेनात, आनी कसलीच जाहिरात दाखयनात.',
  'ref.not4': 'तुमचें नांव, पत्तो वा फोन नंबर मागतनात आनी दवरनात.',
  'ref.not5': 'कसलीच सरकारी येवजण वा नंबर तयार करूंक मेळना — जर म्हायती ना जाल्यार, म्हायती ना अशें स्पश्ट सांगतात.',
  'ref.medicalTitle': 'गरजेचें: हो डॉक्टरांचो सल्ला न्हय',
  'ref.medicalBody': 'आजार, वखदां वा कसल्याय विषारी वस्तूविशीं गजाली आसल्यार, पयलीं डॉक्टरांक मेळात. हांगा दिल्ले म्हायती फकत सामान्य मदतीखातीर आसा. भुरग्यांचे टोचण, गर्भधारणेविशीं, वा कसलीच वखदां सुरू करचे पयलीं डॉक्टरांचो सल्ला नक्की घेयात.',
  'ref.statsTitle': 'कितली म्हायती उपलब्ध आसा',
  'support.howTitle': 'आमी कशी मदत करप',
  'support.alwaysFreeTitle': 'ही सेवा सदांच फुकट आसतली',
  'support.alwaysFreeBody': 'जीय मदत मेळटली, ती सेवा चलोवपाक वापरतले. कोणाकडल्यानूच केन्नाच पैसे घेवचे नात.',
  'smriti.eyebrow': 'आदरांजली',
  'smriti.whyTitle': 'ही साइट कित्याक आसा',
  'smriti.ending': 'तांचो संघर्ष हांगा फुडें वचत रावता.',
  'article.askAny': 'कसलोय प्रस्न विचारयात',
  'article.remember': 'लक्षांत दवरात',
  'article.emergencyInfo': 'गरजेची म्हायती',
  'article.medicalTitle': 'हो वैजकी सल्ला न्हय',
  'article.medicalBody': 'ही म्हायती फकत सामान्य मदतीखातीर आसा. कसलीच वखदां सुरू वा बंद करू नका — पयलीं डॉक्टरांक मेळात.',
  'article.heading': '{category} चे लेख',
  'reviews.rateQuestion': 'कितले तारे दितले?',
  'reviews.starsShort': '{value} तारे',
  'reviews.averageOutOf': '5 पैकी {value} तारे',
  'dhun.welcomeTitle': 'स्वागत आसा',
  'dhun.consent': 'शंख, बासरी आनी नगारा — वांगडा आयकपाखातीर स्पर्श करात.',
  'dhun.unsupported': 'ह्या ब्राउझरान आवाज वाजूंक जायना.',
  'dhun.failedTry': 'आवाज वाजोवपांत अडचण आयली.',
  'sound.hintIdle': 'खंयचोय बटन दाबून आवाज आयकात.',
  'sound.hintPlaying': 'आवाज चालू आसा. बंद करपाक परत तोच बटन दाबात.',
  'sound.preparing': 'आवाज तयार जाता',
  'nav.path': 'वाट',
  'health.heading': 'तुमचे वय सांगा',
  'health.intro': 'वयाप्रमाण जे प्रस्न चड करून विचारतात, ते हांगा दिसतले. खंयचोय बटन दाबात — प्रस्न सकयल भरतलो, उपरांत विचारून घेयात.',
  'health.ageLabel': 'वय (वर्स)',
  'health.years': 'वर्स',
  'health.bandsLabel': 'वयाप्रमाण वेंचून काडात',
  'health.notAdviceStrong': 'हो वखदाचो सल्ल ना.',
  'health.notAdvice': 'खंयचेंय वखद सुरू वा बंद करू नाकात — पयलीं डॉक्टरांक मेळात.',
  'health.emergencyStrong': 'आणीबाणीच्या वेळार फोन करात:',
  'health.emergencyCall': '(आणीबाणी)',
  'health.emergencyAmbulance': '(अँब्युलन्स)',
  'health.emergencyWomen': '(महिला हेल्पलाईन)',
  'health.privacy': 'खंयचेंय नांव वा पत्तो बरोवपाची गरज ना.',
  'health.band.infant.label': '0 – 2 वर्सां',
  'health.band.infant.note': 'लहान भुरगीं, जीं आपली गजाल सांगूंक शकनात',
  'health.c.infant1': 'भयंकर ताप',
  'health.q.infant1': 'म्हाज्या भुरग्याक भयंकर ताप आसा, दुद दिवं का?',
  'health.c.infant2': 'जेवण घेना',
  'health.q.infant2': 'लहान भुरगें जेवण घेना, काय करूं?',
  'health.c.infant3': 'उबळ येता',
  'health.q.infant3': 'भुरग्याक उबळ येता, केन्ना डॉक्टरांक दाखवूं?',
  'health.c.infant4': 'जुलाब जातात',
  'health.q.infant4': 'भुरग्याक जुलाब जातात, काय खावपाक दिवं?',
  'health.band.child.label': '3 – 12 वर्सां',
  'health.band.child.note': 'भुरगीं जीं उलोवंक शकतात, पूण प्रस्न विचारपाक भियेतात',
  'health.c.child1': 'अभ्यासांत लक्ष ना',
  'health.q.child1': 'भुरग्याचें अभ्यासांत लक्ष ना, काय करूं?',
  'health.c.child2': 'शाळेत वचपाक न्हय म्हणटा',
  'health.q.child2': 'भुरगें दर दिसा शाळेत वचपाक न्हय म्हणटा, कारण काय आसूं येता?',
  'health.c.child3': 'रात्री ताप येता',
  'health.q.child3': 'भुरग्याक रात्री ताप येता, काय करूं?',
  'health.c.child4': 'दांत पडटात',
  'health.q.child4': 'भुरग्याचे दांत पडटात, दातांची राखण कशी करूं?',
  'health.band.teen.label': '13 – 17 वर्सां',
  'health.band.teen.note': 'तरणाटीं, ज्यांका चड करून कोण आयकून घेवपी मेळना',
  'health.c.teen1': 'अभ्यासाचो ताण',
  'health.q.teen1': 'अभ्यासाचो खूब ताण आसा, ताचो सामना कसो करूं?',
  'health.c.teen2': 'नद्रेची अडचण',
  'health.q.teen2': 'रात्री नीट न्हीद येना, काय करूं?',
  'health.c.teen3': 'मोबाईलचो नाद',
  'health.q.teen3': 'मोबाईलचो नाद लागला, तो सोडपाचो उपाय सांगा.',
  'health.c.teen4': 'खूब दुख्ख',
  'health.q.teen4': 'खूब दुख्ख जाता, कोणाकडे उलोवूं?',
  'health.band.young.label': '18 – 30 वर्सां',
  'health.band.young.note': 'नोकरी, पयशे आनी न्हीद — तिगांचोय एकाच वेळार भार',
  'health.c.young1': 'कामाचो ताण',
  'health.q.young1': 'कामाचो ताण खूब आसा, कसो उणो करूं?',
  'health.c.young2': 'बसून पाठीचें दुखणे',
  'health.q.young2': 'बसून रावल्यान पाठींत दुखता, काय करूं?',
  'health.c.young3': 'नद्रेची अडचण',
  'health.q.young3': 'राति न्हिद येना, उपाय कितें?',
  'health.c.young4': 'पैसे उणे आसात',
  'health.q.young4': 'पैसे उणे आसात आनी खर्च चड, कितें करूं?',
  'health.band.middle.label': '31 – 45 वर्सां',
  'health.band.middle.note': 'घर, भुरगीं आनी आपली भलायकी — सगळीं जबाबदारीं एकठांय',
  'health.c.middle1': 'कंबर दुखप',
  'health.q.middle1': 'कंबर दुखता, कारण कितें आसूं येता?',
  'health.c.middle2': 'न्हिद बरोबर येना',
  'health.q.middle2': 'न्हिद बरी येना, सुदारपाखातीर उपाय कितें?',
  'health.c.middle3': 'घरांतलो ताण',
  'health.q.middle3': 'घरांत खूब ताण आसा, भुरग्यांक कशें सांबाळूं?',
  'health.c.middle4': 'पोटांत गॅस',
  'health.q.middle4': 'कामाचेर कितल्याशाच वर्सां सावन पोटांत गॅसाची समस्या आसा, कितें करूं?',
  'health.band.later.label': '46 – 60 वर्सां',
  'health.band.later.note': 'कुडीचे वय आनी तिची राखण — दोनूय एकठांय',
  'health.c.later1': 'पाट दुखप',
  'health.q.later1': 'मजें वय 54 वर्सां आनी म्हजी पाट दुखता, कितें करूं?',
  'health.c.later2': 'गुडघे दुखप',
  'health.q.later2': 'वयर चडटना गुडघे दुखतात, कित्याक?',
  'health.c.later3': 'राति पांयांत गोळे येवप',
  'health.q.later3': 'राति पांयांत गोळे येतात, कितें करूं?',
  'health.c.later4': 'सकाळीं ताठरपण',
  'health.q.later4': 'सकाळीं उठल्या उपरांत कंबर ताठर जाता, कारण कितें आसूं येता?',
  'health.band.senior.label': '61 – 75 वर्सां',
  'health.band.senior.note': 'वखदां, तोल आनी एकटेपण — तिन्हीं एकठांय',
  'health.c.senior1': 'चलपाक त्रास',
  'health.q.senior1': 'गुडघ्यांत इतलो त्रास आसा की चलप कठीण जालां, कितें करूं?',
  'health.c.senior2': 'वखदांची तपासणी',
  'health.q.senior2': 'दर दिसा खूब वखदां घेवचीं पडटात — कोणतें अपायकारक आसा हें कशें कळटलें?',
  'health.c.senior3': 'राति लघवी जावप',
  'health.q.senior3': 'राति वारंवार लघवीचो त्रास जाता, कितें करूं?',
  'health.c.senior4': 'आयकुपाक उणें',
  'health.q.senior4': 'आयकुपाक उणें जाता, आयकुपाखातीर कांय उपाय सांगा.',
  'health.band.elder.label': '76 – 100 वर्सां',
  'health.band.elder.note': 'दर वखदाची तपासणी गरजेची, पडप म्हळ्यार गंभीर',
  'health.c.elder1': 'पडपाची भिरांत',
  'health.q.elder1': 'घरांत पडपाची भिरांत आसा, कशी राखण करूं?',
  'health.c.elder2': 'उजवाडाची उणीव (विस्मरण)',
  'health.q.elder2': 'उजवाडाची उणीव (विस्मरण) जाता, उपाय कितें?',
  'health.c.elder3': 'दर दिसाची दुखण्याची वखदां',
  'health.q.elder3': 'दुखण्याची वखदां दर दिसा घेवचीं पडटात — हाचो कांय अपाय आसा काय?',
  'health.c.elder4': 'डॉक्टरांक केन्ना वचचें',
  'health.q.elder4': 'डॉक्टरांक केन्ना वचप गरजेचें आसा?',
  'ask.notConfigured': 'ही सेवा सद्या आपल्या पोरन्या जापेंतल्यान जाप दिता. तुमचो प्रस्न थंय मेळूंक ना.',
  'ask.browseTitle': 'हांगा आशिल्ले लेख पळयात',
  'download.pdf': 'PDF-आंत बरयात',
  'download.text': 'टेक्स्ट-आंत बरयात',
  'download.printNow': 'प्रिंट करात',
  'download.preparing': 'तयार जाता',
  'download.blocked': 'नवो टॅब उगतो जावंक ना. Pop-up ब्लॉक जालां — तुमच्या ब्राउझरांत वेगळो टॅब उगयात.',
  'attach.button': 'तुमचें कागदपत्र वा फोटो जोडा',
  'attach.formats': 'PDF, फोटो (JPG/PNG) वा टेक्स्ट फाईल — 12 MB मेरेन',
  'attach.reading': 'वाचता…',
  'attach.attached': 'जोडलें',
  'attach.remove': 'काडून उडयात',
  'attach.tooBigPdf': 'ही PDF 12 MB परस व्हड आसा. ल्हान फाईल वेंचून काडात.',
  'attach.tooBigImage': 'ही फोटो 3 MB परस व्हड आसा. ल्हान फोटो वेंचून काडात.',
  'attach.scannedPdf': 'ही PDF स्कॅन केल्ली आसा — हातूंत फकत चित्र आसा, वाचपाक मेळना. हाची फोटो धाडात.',
  'attach.pdfFailed': 'ही PDF वाचपाक मेळना.',
  'attach.imageFailed': 'ही फोटो लोड जाली ना.',
  'attach.wrongType': 'ही फाईल चलची ना. PDF, फोटो वा टेक्स्ट फाईल धाडात.',
  'attach.hint': 'तुमचो कागद हांगा लावन प्रस्न विचारात — आमी ताचेवयल्यानच जाप दितले.',
  'ask.sendWithFile': 'जाप जाय',
  'lib.title': 'फुकट पुस्तकालय',
  'lib.intro': 'अभ्यासाचीं पुस्तकां, हेर पुस्तकां, चित्रां आनी ऑडिओ — सगळें फुकट आनी कायदेशीर रितीन.',
  'lib.legalTitle': 'कॉपीरायटाचो कसलोच त्रास ना.',
  'lib.legal': 'हांगा जें कितें दिलां, तें पुराय फुकट आसा आनी तुमी तें फुडेंय वांटूंक शकतात. जें पुस्तक सध्या कॉपीरायटांत आसा, तें हांगा आसचें ना — तें तुमी कॉपी करूंक शकनात, हें स्पश्ट सांगप गरजेचें आसा.',
  'ask.signInFirst': 'पयलीं लॉग इन करात, मागीर प्रस्न विचारात.',
  'ask.signInTitle': 'पयलीं लॉग इन करात',
  'ask.signInBody': 'प्रस्न विचारपाखातीर तुमचें खातें तयार करात. हाका एका मिनटापरस कमी वेळ लागता, आनी तुमी प्रस्न विचारूंक शकतात.',
  'ask.signInCta': 'खातें तयार करात वा लॉग इन करात',
  'ask.signInOr': 'आतां खातें तयार करूंक शकनात? हीं कामांय तुमच्याशिवाय जातलीं:',
  'account.title': 'माझें खातें',
  'account.intro': 'तुमचें नांव आनी पासवर्ड घालून प्रस्न विचारपाक सुरवात करात.',
  'account.signIn': 'भितर सरयात',
  'account.register': 'खातें तयार करात',
  'account.signInNote': 'फाटल्या वेळचें नांव आनी पासवर्ड घालात.',
  'account.registerNote': 'प्रस्न विचारपाखातीर खातें गरजेचें ना. हें फकत तुमची भास आनी जाप याद दवरपाखातीर आसा.',
  'account.handle': 'तुमचें नांव',
  'account.handlePlaceholder': 'देखीक: sita.ji',
  'account.password': 'पासवर्ड',
  'account.passwordHint': 'उण्यांत उणे 6 अक्षर.',
  'account.phone': 'फोन नंबर',
  'account.optional': 'गरजेचें ना',
  'account.phoneHint': 'दिवंक जाय जाल्यार दित. फोन नंबर दिवंक ना जाल्यारय खातें तयार जातलें.',
  'account.create': 'खातें तयार करात',
  'account.logout': 'भायर सरयात',
  'account.open': 'खातें उगडात',
  'account.signedInAs': 'तुमी लॉग इन आसात',
  'account.signedOut': 'खातें उगडलें ना',
  'account.signedOutBody': 'आतां कसलेच खातें उगडलें ना.',
  'account.saved': 'जमा केल्ल्यो जापो',
  'account.savedEmpty': 'आतां कसलीच जाप जमा ना. जाप आयल्यार \'जमा करात\' हें बटण दाबात.',
  'account.savedUnavailable': 'जमा केल्ल्यो जापो आतां दिसनात. बाकी सगळें चालू आसा.',
  'account.wait': 'कृपया वाट पळयात…',
  'account.privacyTitle': 'तुमच्यो गजाली सुरक्षित',
  'account.privacyBody': 'खातें तयार केल्यार फकत तुमचें नांव, पासवर्ड आनी भास दवरतात. प्रस्नाचो कसलोच रेकॉर्ड दवरनात. तुमचे प्रस्न कोणाकूच धाडनात.',
  'account.errWrong': 'नांव वा पासवर्ड चुकीचो आसा.',
  'account.errTaken': 'हें नांव पयलींच कोणातरी घेतलां. दुसरें नांव वेंचात.',
  'account.errBad': 'माहिती नीट भरात.',
  'account.errWait': 'खूब वेळा प्रयत्न केला. थोड्या वेळान परत प्रयत्न करात.',
  'account.errTryLater': 'आतां जावंक ना. थोड्या वेळान परत प्रयत्न करात.',
  'lib.licence.ccBy': 'तुमी हें कॉपी आनी शेअर करूंक शकतात, छापूनय काडूंक शकतात — फकत मूळ स्रोताचें नांव दिवंक जाय.',
  'lib.licence.ccBySa': 'तुमी हें कॉपी आनी छापून काडूंक शकतात. जें बदल करतले, तेंय उक्तेपणान दिवंक जाय.',
  'lib.licence.ccZero': 'पुराय फुकट. स्रोताचें नांव दिवपाचीय गरज ना.',
  'lib.licence.pd': 'कोणाचोच कॉपीरायट ना — कोणूय कॉपी करूंक शकता.',
  'lib.licence.govtIndia': 'भारत सरकाराचे वेबसाईटचेर. वाचप आनी छापप दोनूय फुकट.',
  'lib.licence.creativeCommons': 'दर एका फाईलीक आपलें लायसन्स आसा — फाईलेचेर पळयात.',
  'lib.licence.freeToRead': 'वाचप फुकट आसा. कॉपी करून फुडें दिवप त्याच अटीचेर आसा जशेर हें मेळ्ळां.',
  'lib.openBadge': 'उक्तें',
  'lib.openBadgeNote': 'हे कॉपी करूंक जाता',
  'lib.freeBadge': 'फुकट',
  'lib.freeBadgeNote': 'वाचूंक जाता, कॉपी करूंक मेळना',
  'lib.govt': 'सरकारी',
  'lib.noSignup': 'खात्याशिवाय',
  'lib.open': 'हांगा उगडा',
  'lib.group.padhai': 'अभ्यासाची पुस्तकां',
  'lib.group.padhai.note': 'शाळा, कॉलेज आनी सरकारी शिक्षणाची माहिती',
  'lib.group.kitab': 'पुस्तकां',
  'lib.group.kitab.note': 'ज्यांचेर कॉपीराइट ना किंवा जी कॉपी करूंक परवानगी आसा',
  'lib.group.tasveer': 'चित्रां आनी फोटो',
  'lib.group.tasveer.note': 'नकाशे, फोटो, चिन्नां — सगळें',
  'lib.group.audio': 'आयकुपाचीं साहित्यां',
  'lib.group.audio.note': 'पुस्तकां आयकून, वाचून न्हय',
  'lib.warnTitle': 'सगळीं पुस्तकां हांगा नात',
  'lib.warn': 'कांय पुस्तकां अजून कॉपीराइट कायद्यांत आसात आनी तीं फुकट दिवंक मेळना. आमी तीं मुद्दाम दाखयना. जर खंयचीं पुस्तकां जाय जाल्यार सकयल विचारपूस करात — जें उत्तर मेळूंक शकता, तें मेळटलें.',
  'lib.askInstead': 'प्रश्न विचारात',
  'nav.library': 'पुस्तकालय',
  'support.contactMessageLabel': 'तुमचें म्हणणें',
  'support.contactPlaceholder': 'जें बरयपाचें आसा तें बरयात — चूक जाल्यार, कांय बरें मेळ्ळ्यार, वा खंयचोय प्रश्न आसल्यार.',
  'support.contactHelp': 'कमीत कमी 10 अक्षरां. हें थेट मालकाकडेन वता.',
  'support.contactSubmit': 'धाडा',
  'support.contactSending': 'धाडटा…',
  'support.contactPrivacy': 'तुमचें नांव बरयपाची गरज ना.',
  'support.contactSent': 'पावलें',
  'support.contactSentBody': 'तुमचें म्हणणें मालकाकडेन पावलें.',
  'support.contactFailed': 'धाडंक मेळ्ळें ना',
  'support.faq1Q': 'हें खरोखर फुकट आसा?',
  'support.faq1A': 'हय. कसलेच पैसे घेनात, जाहिराती नात, आनी कसलीच मेंबरशिप ना. हें एका व्यक्तीच्या पैशांचेर चलता, खंयच्याय कंपनीच्या वा सरकाराच्या पैशांचेर न्हय.',
  'support.faq2Q': 'माझें नांव, पत्तो वा फोन नंबर घेतात काय?',
  'support.faq2A': 'ना, आनी तो घेवपाचोय ना. ही साइट आपली वळख तयार करिना — लॉगिन ना, ट्रॅकिंग ना. फक्त तुमचो प्रश्न आनी तुमचें उत्तर इतलेंच हांगा आसता.',
  'support.faq3Q': 'हें डॉक्टर वा वकील आसा काय?',
  'support.faq3A': 'ना. हें कसलोच वखदाचो वा कायदेशीर सल्लो दिना. जंय गंभीर प्रसंग आसता, थंय हें तुम्हाला डॉक्टर वा अधिकाऱ्याकडेन वचपाचो सल्लो दिता — हें तांची सुवात घेना.',
  'support.faq4Q': 'सगळीं उत्तरां बरोबर आसतात काय?',
  'support.faq4A': 'सगळे वेळ न्हय. उत्तर एक कॉम्प्युटर बरयता, डॉक्टर न्हय — म्हणून दर एका उत्तराकडेन हें बरयल्लें आसता की हो वैद्यकीय सल्लो न्हय. खंयचेंय वखद सुरू करचे पयलीं वा बंद करचे पयलीं डॉक्टरांक नक्की मेळात.',
  'support.faq5Q': 'मका खंयचेंय ॲप डाऊनलोड करचें पडटलें काय?',
  'support.faq5A': 'ना. हें फक्त ब्राउझरांत उगडटा. कसलेच ॲप इन्स्टॉल करपाची गरज ना, कसलीच परवानगी ना, कसलेच अपडेट ना.',
  'nav.remedies': 'घरगुती उपाय',
  'remedy.title': 'आयुर्वेदिक घरगुती उपाय',
  'remedy.intro': 'खंयचीय पिडा आसल्यार — खोकली, तकली दुखप, सांधेदुखी, खाज, मधुमेह, पाठदुखी — सकयल तुमची पिडा वेंचून काडात वा तुमच्या शब्दांत विचारात. घरगुती काडो, मालिश, खाण-जेवण आनी आयुर्वेदिक उपाय सांगतले.',
  'remedy.choose': 'तुमची पिडा वेंचून काडात',
  'remedy.emergencyStrong': 'हे आपत्कालीन प्रसंग:',
  'remedy.emergency': 'साप चावप, विंचू चावप आनी कुत्रें चावप — तातडीन हॉस्पिटलांत वचात, पयलीं 112 नंबरार फोन करात. घरगुती उपाय फक्त वाटेर करपाखातीर आसात, हॉस्पिटलाची सुवात घेवंक न्हय.',
  'remedy.note': 'घरगुती आनी आयुर्वेदिक उपाय पिडा उणी करपाक मदत करतात; हे डॉक्टरांच्या तपासणीची आनी उपचाराची सुवात घेनात. कसलीच वखदां स्वता बंद वा सुरू करू नका.',
  'remedy.cough': 'खोकली',
  'remedy.headache': 'तकली दुखप',
  'remedy.joints': 'सांधेदुखी',
  'remedy.itching': 'खाज',
  'remedy.snake': 'साप चावप',
  'remedy.scorpion': 'विंचू चावप',
  'remedy.dog': 'कुत्रें चावप',
  'remedy.diabetes': 'मधुमेह',
  'remedy.back': 'पाठदुखी',
  'remedy.walking': 'चलपाक त्रास',
  'home.remedyNote': 'काडो, मालिश, खाण-जेवण आनी आयुर्वेदिक उपाय — दर एका पिडेखातीर, तुमच्या भाशेंत. VARSHA SAMADHAN AI',
  'nav.aarti': 'आरती आनी भजन',
  'aarti.title': 'आरती आनी भजन — अस्सल आवाजांत',
  'aarti.intro': 'हांगा आरती, कीर्तन आनी भजन आयकात — अस्सल गायकांच्या आनी देवळांतल्या आवाजांत. खंयचोय AI आवाज न्हय.',
  'aarti.note': 'आरती वा भजन संगणकाच्या आवाजांत आयकल्यार ताचो भाव आनी भक्ती उणी जाता. देखून हांगा फक्त अस्सल रेकॉर्डिंग आसात.',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रेकॉर्डिंग:',
  'aarti.licence': 'परवानो:',
  'aarti.listenLink': 'अस्सल आवाजांत आयकात',
  'aarti.textChecked': 'हें पारंपारिक पाठ आसा, जशें अस्सल रेकॉर्डिंगांत गायलां.',
  'aarti.textPrinted': 'हें प्रचलित पाठ आसा, उजवाडाक आयिल्ल्या संग्रहासावन तपासून घेतिल्लें.',
  'aarti.textNotStored': 'ह्या ग्रंथाचें पुराय पाठ हांगा साठोवन दवरिल्लें ना — सकयल रेकॉर्डिंगांत पुराय पाठ आयकपाक मेळटलो.',
  'aarti.granthTitle': 'ग्रंथ, चालीसा आनी स्तोत्र — अस्सल आवाजांत',
  'aarti.noRecording': 'ह्या आरतीची अस्सल रेकॉर्डिंग सद्या साइटार ना, देखून हांव ती गावन दाखोवंक शकना — VARSHA SAMADHAN AI केन्नाच आरती गावन दाखोवना.',
  'aarti.textOnlyTitle': 'आनी आरत्यो — पाठ लेगीत, अस्सल आवाज लेगीत',
  'aarti.fullText': 'पुराय पाठ',
  'aarti.notChecked': 'ह्या आरतीचें तपासिल्लें पाठ सद्या साइटार ना. तपासनासतना पाठ दिवप बरें न्हय, देखून तें हांगा दिवंक ना.',
  'aarti.verifiedList': 'साइटार ह्यो आरत्यो तपासिल्ल्या स्वरूपांत आसात:',

};

/* -------------------------------------------------------------------------- */
/* MAITHILI                                                                  */
/* -------------------------------------------------------------------------- */

const MAITHILI: Record<string, string> = {
  'jgd.placeSearch': 'शहरक नाम लिखू',
  'jgd.placeNoMatch': 'ई शहर सूची में नहि अछि। एकर लाग्गुक शहर चुनू।',
  'account.name': 'अहाँक नाम',
  'account.namePlaceholder': 'जहिना: सीता देवी',
  'account.nameHint': 'ई अहाँक पहिचान लेल अछि। कोनो नाम चलत, आ ई जरूरी नहि अछि।',
  'nav.home': 'होम',
  'home.metaTitle': 'मुफ़्त समाधान, अहाँक अपन शब्द में',
  'lib.licence.ccZero.name': 'सी.सी.जीरो / सार्वजनिक डोमेन',
  'lib.licence.pd.name': 'सार्वजनिक डोमेन',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिव कॉमन्स (मिश्रित)',
  'lib.licence.freeToRead.name': 'पढ़बा लेल स्वतंत्र',
  'lib.entry.ncert.title': 'एन.सी.ई.आर.टी. किताब — कक्षा 1 सँ 12 धरि',
  'lib.entry.ncert.what': 'हर विषयक सबटा किताब, अखन हर कक्षा लेल। बिना लॉगिन, सीधा पी.डी.एफ.',
  'lib.entry.ncert.langs': 'हिंदी, अंग्रेजी आ 30 सँ बेसी भारतीय भाषा सब',
  'lib.entry.pm-evidya.title': 'पी.एम. इविद्या — डिजिटल पाठ्यपुस्तक',
  'lib.entry.pm-evidya.what': 'एन.सी.ई.आर.टी. किताबक ऐप, बड़ अक्षर में पढ़ल जा सकैछ। बोलि कऽ सेहो सुनि सकै छी।',
  'lib.entry.pm-evidya.langs': 'भारतीय भाषा सब',
  'lib.entry.diksha.title': 'दीक्षा — शिक्षक आ बच्चा सब लेल',
  'lib.entry.diksha.what': 'पाठ्यक्रम, वीडियो आ अभ्यास — कक्षा 1 सँ 12 धरि।',
  'lib.entry.diksha.langs': 'भारतीय भाषा सब',
  'lib.entry.khan-academy.title': 'खान एकेडेमी — अंग्रेजी में गणित आ विज्ञान',
  'lib.entry.khan-academy.what': 'वीडियो पाठ, हर कक्षा धरि। सीधा पढ़निहार लेल लिखलो अछि।',
  'lib.entry.openstax.title': 'ओपनस्टैक्स — अंग्रेजी में मुफ्त किताब',
  'lib.entry.openstax.what': 'कलेज स्तरक किताब — गणित, विज्ञान, मानविकी। हर पांना पर पी.डी.एफ.',
  'lib.entry.nios.title': 'एन.आई.ओ.एस. — दूरस्थ शिक्षा, मुफ्त सामग्री',
  'lib.entry.nios.what': 'ओपन आ ऑनलाइन कोर्सक मुफ्त पुस्तिका, बिना दाखिला के।',
  'lib.entry.nios.langs': 'हिंदी, अंग्रेजी आ अन्य',
  'lib.entry.ignou.title': 'इग्नू — बड़ स्कूलक मुफ्त पुस्तक',
  'lib.entry.ignou.what': 'दूरस्थ शिक्षाक किताब जे एकदम मुफ्त भेटैछ।',
  'lib.entry.gutenberg.title': 'प्रोजेक्ट गुटेनबर्ग — अंग्रेजीक पुरान किताब',
  'lib.entry.gutenberg.what': '70,000 सँ बेसी किताब, सबकर कॉपीराइट समाप्त। मुफ्त ई-बुक आ अडियो।',
  'lib.entry.pratham-books.title': 'प्रथम बुक्स — बच्चाक किताब',
  'lib.entry.pratham-books.what': 'भारतीय भाषा में बच्चाक किताब, एकदम मुफ्त। कक्षा 1 सँ 5 लेल।',
  'lib.entry.pratham-books.langs': 'हिंदी, मराठी, बंगाली, तमिल, तेलुगु आ अन्य',
  'lib.entry.internet-archive-texts.title': 'इंटरनेट आर्काइव — अखबार आ पुरान पत्रिका',
  'lib.entry.internet-archive-texts.what': 'लाखों पुरान किताब, पत्रिका आ अखबार — मुफ्त।',
  'lib.entry.wikisource.title': 'विकिस्रोत — जन-गद्य पाठ',
  'lib.entry.wikisource.what': 'कोनो कॉपीराइट नहि — ई सबटा दुनियाक पुरान साहित्यिक किताब अछि।',
  'lib.entry.wikimedia-commons.title': 'विकिमीडिया कॉमन्स — हर फोटो',
  'lib.entry.wikimedia-commons.what': 'जाति, नक्शा, तारा, इतिहास — सब किछु। हर फोटो पर अलग लाइसेंस लिखल अछि।',
  'lib.entry.pixabay.title': 'पिक्साबे — फोटो आ चित्र',
  'lib.entry.pixabay.what': 'फोटो, रेखाचित्र आ छोट वीडियो।',
  'lib.entry.unsplash.title': 'अनस्प्लैश — सुंदर फोटो',
  'lib.entry.unsplash.what': 'मुफ्त, बड़ अक्षर में, बिना खाता के।',
  'lib.entry.openverse.title': 'ओपनवर्स — सब फोटो एक ठाम',
  'lib.entry.openverse.what': 'कोनो-कोनो मुफ्त फोटोक साइट एक संग खोजू।',
  'lib.entry.librivox.title': 'लिब्रीवॉक्स — सुनि कऽ किताब',
  'lib.entry.librivox.what': 'पुरान अंग्रेजी किताबक मुफ्त अडियो, मनुष्यक आवाज में।',
  'lib.entry.internet-archive-audio.title': 'इंटरनेट आर्काइव — अडियो संग्रह',
  'lib.entry.internet-archive-audio.what': 'हजारों मुफ्त अडियो — किताब, भाषण, संगीत।',
  'lib.entry.vande-mataram.title': 'वंदे मातरम — राष्ट्रगान आ गीत',
  'lib.entry.vande-mataram.what': 'भारतक राष्ट्रगान आ अन्य राष्ट्रीय गीत, मुफ्त।',
  'art.aag-aur-bijli-ke-bachav.title': 'आग आ बिजली सँ बचावुक नियम',
  'art.aag-aur-bijli-ke-bachav.summary': 'घर में आग लागबक रोकथान — सरल नियम',
  'art.aag-lagne-par-kya-karein.title': 'आग लागि जाय तँ की करी',
  'art.aag-lagne-par-kya-karein.summary': 'जारैत घर में आग — सबसँ पहिने की करी, की नहि करी',
  'art.bimari-se-bachav.title': 'संक्रमण सँ बचाव क सात नियम',
  'art.bimari-se-bachav.summary': 'हाथ धोना, मास्क, टीका — आदि सँ बचाव',
  'art.dhuwan-ka-jhakora.title': 'धुआँ क झकौर सँ बचाव',
  'art.dhuwan-ka-jhakora.summary': 'दम घुटब, साँस लेबामे दिक्कत — की करी, कहिया अस्पताल जाई',
  'art.doodh-pani-band-ho.title': 'बिजली या पानी अचानक बंद भ जाय',
  'art.doodh-pani-band-ho.summary': 'की करी, ककरा सँ बची, कहिया मदद माँगी',
  'art.haath-ki-saafai.title': 'बिना साबुन क हाथ साफ करबाक तरीका',
  'art.haath-ki-saafai.summary': 'जखन पानी या साबुन नहि हो',
  'cat.dhyan-aur-yoog.title': 'ध्यान आ योग',
  'cat.dhyan-aur-yoog.subtitle': 'मन शांत करबाक सरल उपाय',
  'cat.gharelu-marammat.title': 'घरेलू मरम्मत',
  'cat.gharelu-marammat.subtitle': 'घरक छोट-छोट समस्याक समाधान',
  'cat.bachchon-ki-padhai.title': 'बच्चाक पढ़ाई',
  'cat.bachchon-ki-padhai.subtitle': 'पढ़ाई में लागल, परेशान छी',
  'cat.budharge-seva.title': 'बुजुर्गक सेवा',
  'cat.budharge-seva.subtitle': 'देखभाल आ सहायता',
  'cat.shishu-dekhbhal.title': 'शिशु देखभाल',
  'cat.shishu-dekhbhal.subtitle': 'नन्हा बच्चाक सही देखभाल',
  'cat.dharmik-upay.title': 'धार्मिक उपाय',
  'cat.dharmik-upay.subtitle': 'मनक शांति क संग',
  'cat.pavan-grah-aur-aarti.title': 'पावन ग्रंथ आ आरती',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धा सँ पढ़ू आ सुनू',
  'cat.aapatkalen-gayide.title': 'आपातकालीन गाइड',
  'cat.aapatkalen-gayide.subtitle': 'जखन तुरंत मदद चाही',
  'cat.mahamari-suraksha.title': 'महामारी सुरक्षा',
  'cat.mahamari-suraksha.subtitle': 'बीमारी फैलबा सँ बचाव',
  'nav.tribute': 'स्मृति',
  'nav.help': 'सहायता',
  'nav.reference': 'संदर्भ',
  'nav.reviews': 'राय',
  'nav.support': 'मदद करू',
  'nav.birthChart': 'जन्म कुंडली',
  'jgd.title': 'अहाँक जन्म कुंडली',
  'jgd.intro': 'अपन नाम, जन्मक तारीख, आ होय तँ जन्मक समय आ स्थान लिखू। सब गणना अहाँक फोन पर हेतै — किछु कतौ भेजल नहि जाइत अछि।',
  'jgd.nameLabel': 'जन्म क नाम',
  'jgd.namePlaceholder': 'जहिना पूरा नाम',
  'jgd.nameHint': 'जे नाम बचपन में राखल गेल छल, ओही लिखू।',
  'jgd.dateLabel': 'जन्म क तारीख',
  'jgd.timeLabel': 'जन्म क समय',
  'jgd.timeHint': 'नहि जनैत छी तँ खाली छोड़ि दियौ।',
  'jgd.placeLabel': 'जन्म क स्थान',
  'jgd.placeNone': 'पता नहि / चुनू',
  'jgd.placeHint': 'जन्म क शहर चुनू।',
  'jgd.submit': 'गणना करू',
  'jgd.savePdf': 'PDF बनाबू',
  'jgd.again': 'नब गणना',
  'jgd.errDate': 'कृपया जन्म क तारीख सही लिखू।',
  'jgd.errPlace': 'जन्म क शहर सूची सँ चुनू, या ओकर नजदीक क शहर चुनू।',
  'jgd.numTitle': 'अंक ज्योतिष',
  'jgd.lifePath': 'जीवन पथ',
  'jgd.nameNumber': 'नाम अंक',
  'jgd.soulNumber': 'आत्मा अंक',
  'jgd.birthdayNumber': 'जन्म दिन अंक',
  'jgd.astroTitle': 'वैदिक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'पद',
  'jgd.rashi': 'राशि',
  'jgd.rashiLord': 'राशि स्वामी',
  'jgd.nakshatraLord': 'नक्षत्र स्वामी',
  'jgd.lagna': 'लग्न',
  'jgd.lagnaMissing': 'लग्न निकालय लेल जन्मक समय आ स्थान चाही। ऊपर भरि कय फेर गणना करू, आ नहि जनैत छी त एतबे बहुत अछि।',
  'jgd.gunTitle': 'गुण मिलान',
  'jgd.gunIntro': 'दोसर व्यक्ति क नाम आ जन्मतिथि भरू।',
  'jgd.gunName': 'ओकर नाम',
  'jgd.gunDate': 'ओकर जन्मतिथि',
  'jgd.gunHint': 'दुनू गोटे क नाम आ जन्मतिथि रहत त गुण मिलान निकलि जेतै।',
  'jgd.disclaimer': 'ई परंपराक अनुसार कयल गेल गणना अछि, भविष्यवाणी नहि। कोनो संख्या या राशि केकरो स्वास्थ्य, धन या रिश्ता तय नहि करैत अछि। पैघ फैसला डॉक्टर, कानूनी सलाह या अनुभवी लोकक सलाह सँ लिअ।',
  'nav.menu': 'मेन्यू',
  'nav.openMenu': 'मेन्यू खोलू',
  'nav.closeMenu': 'मेन्यू बन्न करू',
  'nav.expand': 'विस्तार करू',
  'nav.collapse': 'समेटू',
  'nav.skip': 'सीधे सामग्री पर जाउ',
  'nav.language': 'भाषा बदलू',
  'footer.pages': 'पन्ना',
  'footer.helplines': 'जरूरी नंबर',
  'footer.free': 'ई सेवा पूरा तरीका सँ निःशुल्क अछि। केकरो सँ कोनो पैसा नहि लेल जाइत अछि।',
  'footer.readStory': 'ओकर पूरा कथा पढ़ू',
  'footer.admin': 'प्रबंधक',
  'footer.rights': 'निःशुल्क सेवा',
  'footer.emergency': 'आपातकाल',
  'footer.ambulance': 'एम्बुलेंस',
  'footer.women': 'महिला हेल्पलाइन',
  'home.dedication1': 'क स्मृति में — एकटा पूरा तरीका सँ निःशुल्क सेवा।',
  'home.dedication2': 'अपन समस्या लिखू या बोलू।',
  'home.emergencyTitle': 'जरूरी — तुरंत मदद चाही',
  'home.emergencyNote': 'ई सबसे पहिने पढ़ू। बाकी सब बाद में देखल जा सकैत अछि।',
  'home.readMore': 'पूरा जानकारी पढ़ू',
  'home.chooseTopic': 'कोन विषय में जानय के अछि?',
  'home.memorialEyebrow': 'ई साइट केकर लेल अछि',
  'home.memorialLine': 'जे समाज लेल जिंदगी भर लड़ल, आ जेकरा अंत में अपन हिस्साक हिसाब नहि भेटल।',
  'home.memorialMore': 'ओकर पूरा कहानी पढ़ू',
  'home.kundaliTitle': 'जन्म कुंडली',
  'home.kundaliNote': 'पूरा कुंडली — 9 ग्रह, विमशोत्तरी दशा, फलादेश, योग, शोडशवर्ग, केपी, लाल किताब आ अंक ज्योतिष। सब अहाँक फोन पर ही गणना हेतै।',
  'home.chooseTopicNote': 'नीचा देल विषय पर टैप करू। हर जगह सरल भाषा में जानकारी देल गेल अछि।',
  'home.askHere': 'एही विषय में पूछू',
  'home.categoryEmpty': 'एही विषय में अखन धरि किछु नहि लिखल गेल अछि।',
  'home.soundTitle': 'शांति लेल ध्वनि',
  'home.soundIntro': 'कोनो शुल्क नहि, कोनो विज्ञापन नहि। बस मन शांत करय लेल।',
  'home.howTitle': 'ई सेवा कना काज करैत अछि',
  'home.step1Title': 'अपन बात लिखू या बोलू',
  'home.step1Body': 'हिंदी में टाइप करू, या माइक दाबि कय बोलू। किछु खास नहि करय के अछि — जे मन में अछि ओही लिखि दिअ।',
  'home.step2Title': 'तुरंत जवाब भेटैत अछि',
  'home.step2Body': 'हर सवाल दर्ज होइत अछि आ ओकर जवाब तुरंत भेटैत अछि। बहुत लंबा सवाल सँ पहिने छोट सवाल सँ शुरू करू।',
  'home.step3Title': 'कोनो पैसा नहि, कोनो निजी जानकारी नहि',
  'home.step3Body': 'ई सेवा एकदम निःशुल्क अछि। अहाँक नाम, पता या फोन नंबर नहि मांगैत छी, आ कोनो विज्ञापन नहि देखबैत छी।',
  'home.stepLabel': 'चरण',
  'home.freeTitle': 'ई सेवा एकदम निःशुल्क अछि',
  'home.freeBody': 'कोनो पैसा नहि लेल जाइत अछि, कोनो निजी जानकारी नहि मांगैत छी, आ कोनो विज्ञापन नहि देखबैत छी।',
  'help.q1.label': 'बिजली चलि गेल अछि, की करी?',
  'help.q1.question': 'घर में बिजली चलि गेल अछि। की करबाक चाही, आ मोबाइल फ़ोन कना चार्ज करी?',
  'help.q2.label': 'बच्चाक पढ़ाई में कमज़ोरी',
  'help.q2.question': 'हमर बच्चा पढ़ाई में बहुत कमज़ोर अछि। घर पर कना सुधारि?',
  'help.q3.label': 'बुज़ुर्गक इलाज',
  'help.q3.question': 'हमर पिताजीक उमिर बहुत बेसी अछि, हुनकर इलाज कना करी?',
  'help.q4.label': 'घर में आग लागि जाय त',
  'help.q4.question': 'जँ राति में घर में आग लागि जाय त सबसँ पहिने की करबाक चाही?',
  'help.title': 'अपन समस्या लिखू',
  'help.intro': 'नीचाँ लिखू या बोलू। जँ पता नहि हो त जहिना मन में आबै अछि ओहिना लिखि दियौ — ई सबसँ ज़रूरी अछि।',
  'help.suggested': 'आम सवाल',
  'help.howTitle': 'ई सेवा कना काज करैत अछि',
  'help.howBody': 'हर सवाल दर्ज होइत अछि आ ओकर जवाब तुरंत भेटैत अछि। अहाँक नाम, पता या फ़ोन नंबर कतौ नहि लेल जाइत अछि। सब किछु निःशुल्क अछि।',
  'ref.title': 'ई सेवा की अछि, आ केकरा लेल अछि',
  'ref.intro': 'ई सेवा श्रीमती VARSHA जी क याद में बनाओल गेल अछि। एतय सरल भाषा में बताओल गेल अछि जे ई की करैत अछि, एकरा में की-की अछि, आ एकर सीमा की अछि। सब किछु बिल्कुल निःशुल्क अछि — कोनो टाका नहि लेल जाइत अछि, कोनो विज्ञापन नहि देखायल जाइत अछि, आ कोनो निजी जानकारी नहि माँगल जाइत अछि।',
  'ref.whatTitle': 'एकरा में की-की अछि',
  'ref.what1': 'घर में आग लागि जाय, बिजली चलि जाय, बच्चाक पढ़ाई में कमज़ोरी हो, माए-बाप क देखभाल करबाक हो — अइना सामान्य समस्याक सरल उपाय, साफ़-सुथरा भाषा में।',
  'ref.what2': 'सवाल बोलिकय पूछबाक सुविधा। बोलब नहि आबै त लिखू — दुनूक जवाब एक समान भेटैत अछि।',
  'ref.what3': 'हर सवाल दर्ज होइत अछि, ताहि लेल जे दोसर के परेशान करैत अछि ओ अहाँसँ पहिने पूछल जा चुकल होइत अछि आ ओकर जवाब भेटि जाइत अछि।',
  'ref.what4': 'कोनो विज्ञापन नहि, कोनो अनावश्यक सूचना नहि, आ कोनो निजी जानकारी नहि माँगल जाइत अछि। सब किछु मुफ़्त।',
  'ref.helplineTitle': 'तुरंत मदद लेल ई नंबर राखू',
  'ref.helpline1': 'कोनो बड़ खतरा हो — जहिना आग, बिजलीक तेज़ झटका, गिरब या बहुत बेसी खून — त 112 पर फ़ोन करू।',
  'ref.helpline2': 'केकरो बीमारी अछि या चोट लागि गेल अछि आ जायक कोनो रास्ता नहि अछि, त 108 पर एम्बुलेंस मँगाऊ।',
  'ref.helpline3': 'महिलाक साथ कोनो बुरा काज भेल हो, या महिला के कतौसँ परेशान कयल जा रहल हो, त 181 पर फ़ोन करू। ई मुफ़्त अछि।',
  'ref.helpline4': 'बच्चा या बुज़ुर्गक साथ कोनो अन्याय भेल हो, त 1098 पर शिकायत कयल जा सकैत अछि।',
  'ref.helpline5': 'मानसिक तनाव बहुत बेसी हो, या जीबक मन नहि करैत हो, त 14416 पर बात कयल जा सकैत अछि। सिर्फ बात करबाक लेल।',
  'ref.dataTitle': 'हम अहाँक बारे में की राखैत छी',
  'ref.dataBody': 'सिर्फ ओ सवाल जे अहाँ पूछलहुँ, ओकर सार, आ सवाल पूछबाक समय — ताकि हम बार-बार ओहि जवाब नहि द सकि। अहाँक नाम, पता, फ़ोन नंबर, या कोनो पहचान बताबय वाली कोनो जानकारी नहि लेल जाइत अछि। साइट पर कोनो विज्ञापन या ट्रैकिंग स्क्रिप्ट नहि लागल अछि।',
  'ref.adminTitle': 'प्रबंधक की क सकैत छथि',
  'ref.adminBody': 'प्रबंधक ओ लेख देख सकैत छथि जे अहाँ पठाने छी, आ ओकर जवाब लिख सकैत छथि। ओ अहाँक अनुमति बिना कोनो लेख बदल या हटा नहि सकैत छथि, आ अहाँक जानकारी केकरो नहि बेच सकैत छथि।',
  'ref.statsCategories': 'विषय उपलब्ध अछि',
  'ref.statsArticles': 'लेख लिखल गेल अछि',
  'ref.statsQuestions': 'सवाल पूछल जा चुकल अछि',
  'ref.ownerNote': 'ई सेवा कोनो कंपनीक नहि, कोनो सरकारक नहि, बल्कि एक व्यक्ति क स्मृति में चलाओल जा रहल अछि। ताहि लेल एतय कोनो विज्ञापन नहि अछि, कोनो सदस्यता नहि अछि, आ कोनो टाका नहि लेल जाइत अछि।',
  'support.title': 'ई सेवा निःशुल्क अछि',
  'support.intro': 'ई सेवा केकरोसँ टाका नहि लेल जाइत अछि। मुदा ई चलैत अछि — ताहि लेल किछु तरीका अछि जहिना अहाँ मदद क सकैत छी। सबसँ आसान तरीका सबसँ कामक अछि।',
  'support.waysTitle': 'अहाँ कना मदद क सकैत छी',
  'support.way1Title': 'अपन अनुभव लिखू',
  'support.way1Body': 'जँ अइ साइटसँ अहाँक किछु ठीक भेटल हो — या किछु अइना भेटल हो जे अहाँक उलझन में छोड़ि देलक अछि — त राय पेज पर लिखि दियौ। अहाँक नाम लेब ज़रूरी नहि अछि।',
  'support.way2Title': 'अपन शहरक बारे में बताऊ',
  'support.way2Body': 'अहाँ जतय रहैत छी, ओतय क भाषा, रीति-रिवाज़ आ दिक़्क़त अलग होइत अछि। जँ अहाँक एतय क किछु बात एतय नहि अछि, त बता दियौ — जोड़ल जा सकैत अछि ओ जोड़ि देल जायत।',
  'support.way3Title': 'अपन अनुभव केकरो दोसर के सुनाऊ',
  'support.way3Body': 'जे एतय लिखल अछि ओ बहुत रास लोकक काम आ सकैत अछि, जँ हुनका पता हो। केकरो अइना लोक के बताऊ जकरा ई सच में मदद द सकैत अछि।',
  'support.way4Title': 'एतय आबि क देखू',
  'support.way4Body': 'जँ अहाँक लग समय हो, त खुद आबि क देखू जे ई साइट ठीकसँ चलि रहल अछि या नहि। किछु बिगाड़ देखाय त बताऊ — बिल्कुल मुफ़्त में ठीक भ जायत।',
  'support.contactTitle': 'किछु बताबय क अछि?',
  'support.contactBody': 'कोनो बात लेल एतय लिख सकैत छी — चाहे कोनो गलती हो, चाहे किछु बेसी भेटय, या कोनो सवाल। जतेक लिखब आसान लागय, ओतेक लिखू।',
  'support.faqTitle': 'किछु बात जे बार-बार पूछल जाइत अछि',
  'support.faqBody': 'की ई सच में मुफ़्त अछि? अहाँ। की अहाँक नाम लेल जाइत अछि? नहि, नाम देब ज़रूरी नहि अछि। की विज्ञापन आबैत अछि? नहि। कोनो फ़ोन नंबर या पता त नहि माँगल जाइत अछि? नहि। की कोनो ऐप डाउनलोड करबाक पड़त? नहि, बस ब्राउज़र में खुलि जाइत अछि।',
  'ask.label': 'अपन समस्या लिखू या माइकसँ बोलू',
  'ask.placeholder': 'जहिना: बच्चाक पढ़ाई में कमज़ोरी अछि',
  'ask.help': 'एंटर दाबि कय सेहो पठा सकैत छी।',
  'ask.send': 'पूछू',
  'ask.sending': 'सोचि रहल छी…',
  'ask.clear': 'लिखल मिटाऊ',
  'ask.speak': 'बोलिकय पूछू',
  'ask.listening': 'बोलना शुरू करू…',
  'ask.heard': 'सुनि रहल छी',
  'ask.stopListening': 'सुनना रोकू',
  'ask.suggested': 'सामान्य सवाल',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'सुनू',
  'ask.stopSpeak': 'रोकू',
  'ask.aiNote': 'ई जवाब AI द्वारा देल गेल अछि। ई कोनो विशेषज्ञ के सलाह के विकल्प नहि अछि।',
  'ask.errorRateLimit': 'बहुत रास सवाल एक संगे भेज देल गेल अछि। किछु देर बाद कोशिश करू।',
  'ask.errorNetwork': 'इंटरनेट नहि चलि रहल अछि। कनेक्शन जाँच कय फेर कोशिश करू।',
  'ask.notAnswer': 'एहि सवाल के सीधा जवाब हमरा लग नहि अछि।',
  'ask.emptyAnswer': 'एहि बेर जवाब नहि बनि सकल। थोड़ा अलग तरीका सँ फेर पूछू।',
  'ask.micUnsupported': 'एहि ब्राउज़र में बोलि कय पूछना काम नहि करत। लिखि कय पूछू।',
  'ask.heardWith': 'ई सुनि रहल छी:',
  'voice.notAllowed': 'माइक के अनुमति नहि भेटल। ऊपर जा कय अनुमति दियौ, या लिखि कय पूछू।',
  'voice.serviceNotAllowed': 'माइक के अनुमति नहि भेटल। ऊपर जा कय अनुमति दियौ, या लिखि कय पूछू।',
  'voice.noSpeech': 'कोनो आवाज नहि सुनि पड़ल। माइक के लग बोलू, या लिखू।',
  'voice.audioCapture': 'कोनो माइक नहि भेटल। डिवाइस जोड़ू, या लिखि कय पूछू।',
  'voice.network': 'बोलि कय पूछय लेल इंटरनेट चाही, आ ओ नहि चलि रहल अछि। लिखि कय पूछू — जवाब ओतबे भेटत।',
  'voice.aborted': 'रुक गेल। फेर सँ कोशिश करू।',
  'voice.unsupported': 'एहि ब्राउज़र में बोलि कय पूछना काम नहि करत। लिखि कय पूछू।',
  'voice.speakFailed': 'ई जवाब सुनाओल नहि जा सकल।',
  'voice.noVoice': 'एहि डिवाइस में {name} के बोलय वाली आवाज नहि भेटल। अखन लिखल पढ़ू, या फोन के सेटिंग में जा कय आवाज जोड़ू।',
  'voice.generic': 'किछु गड़बड़ भेल अछि। फेर सँ कोशिश करू।',
  'sound.title': 'शांति लेल ध्वनि',
  'sound.intro': 'कोनो शुल्क नहि, कोनो विज्ञापन नहि। बस मन शांत करय लेल।',
  'sound.playing': 'आवाज चलि रहल अछि। रोकय लेल फेर सँ ओही बटन के दाबू।',
  'sound.shankh': 'शंख',
  'sound.shankhHint': 'गहीर, लम्बा',
  'sound.bansuri': 'बांसुरी',
  'sound.bansuriHint': 'कोमल, धीमा',
  'sound.dhol': 'नगाड़ा',
  'sound.dholHint': 'तीखा, तेज',
  'sound.all': 'तीनु',
  'sound.allHint': 'एक संगे',
  'sound.listenLabel': 'सुनू',
  'sound.errUnsupported': 'ई ब्राउज़र ध्वनि नहि चलय पाबि रहल अछि।',
  'sound.errGeneric': 'ध्वनि चलौनाय में समस्या भेल।',
  'dhun.welcome': 'स्वागत अछि',
  'dhun.prompt': 'शंख, बांसुरी आ नगाड़ा — संगे सुनय लेल छुबू।',
  'dhun.listen': '▶ सुनू',
  'dhun.skip': 'ध्वनि छोड़ू',
  'dhun.failed': 'ध्वनि नहि चलि सकल।',
  'dhun.label': 'ध्वनि चलौनाय के अनुमति',
  'reviews.title': 'अहाँक राय, अहाँक बात',
  'reviews.intro': 'की ई सेवा अहाँक काम आयल? अपन बात लिखू — अहाँक नाम लेब जरूरी नहि अछि।',
  'reviews.pageTitle': 'अहाँक राय',
  'reviews.pageIntro': 'एतय ओही लिखल अछि जे लोक सब लिखलनि अछि। कोनो राय लुकाओल नहि जाइत अछि, आ जे लिखल अछि से एतय देखैत अछि — बस एक बेर देखला के बाद प्रकाशित कयल जाइत अछि।',
  'reviews.write': 'अपन राय लिखू',
  'reviews.submit': 'भेजू',
  'reviews.sending': 'भेजि रहल छी…',
  'reviews.name': 'अहाँक नाम (जरूरी नहि)',
  'reviews.city': 'अहाँक शहर (जरूरी नहि)',
  'reviews.comment': 'अहाँक बात',
  'reviews.placeholder': 'जे मन में आयल से लिखू — किछु सही करय के जरूरत नहि अछि।',
  'reviews.moderated': 'अहाँक समीक्षा प्रकाशित होय सँ पहिने एक बेर देखल जाइत अछि।',
  'reviews.moderationNote': 'सब किछु मिटाए सँ बचय लेल, प्रकाशित होय सँ पहिने हर समीक्षा एक बेर देखल जाइत अछि। गाली, नंबर या व्यक्तिगत बात हटा देल जाइत अछि — बाकी सब ज्यों के त्यों प्रकाशित होइत अछि।',
  'reviews.summaryTitle': 'आम राय',
  'reviews.count': 'समीक्षा',
  'reviews.anonymous': 'बिना नाम के',
  'reviews.summaryLine': 'लोकनि औसतन 5 में सँ {rating} तारका देलनि, कुल {count} समीक्षा अछि।',
  'reviews.starsLabel': '5 में सँ {value} तारका',
  'reviews.keepLabel': 'बुरा लागल तँ नीक लागल तँ — दुनू लिखू',
  'reviews.ownerReply': 'जवाब',
  'reviews.replyLabel': 'एहि पर लिखल गेल अछि',
  'reviews.empty': 'अखन धरि कोनो समीक्षा नहि अछि। पहिल अहाँ लिखू।',
  'reviews.toastSent': 'धन्यवाद',
  'reviews.toastFailed': 'राय नहि भेजल जा सकल',
  'reviews.fieldTooShort': 'कम सँ कम 10 अक्षर लिखू।',
  'reviews.rateLimited': 'बहुत तेजी सँ भेजल जा रहल अछि। अहाँ थोरिक रुकि कऽ फेर कोशिश करू।',
  'cat.notFound': 'ई पन्ना नहि भेटल',
  'cat.empty': 'एहि विषय में अखन कोनो लेख नहि अछि।',
  'article.emergency': 'जरूरी',
  'article.askAbout': 'एहि विषय में पूछू',
  'article.readAloud': 'ई लेख सुनू',
  'article.others': 'एहि विषय के आर लेख',
  'article.count': '{count} लेख',
  'theme.toLight': 'उज्जर रूप पर जाउ',
  'theme.toDark': 'अन्हार रूप पर जाउ',
  'toast.dismiss': 'बंद करू',
  'language.choose': 'अपन भाषा चुनू',
  'language.articlesIn': 'ई लेख हिन्दी में अछि।',
  'language.articlesInHint': 'हर भाषा में अलग अनुवाद चाही। ई अनुवाद अखन नहि भेल अछि — जे लिखल अछि से हिन्दी में ही नीक आ पूरा अछि।',
  'ask.welcome': 'अहाँक स्वागत अछि! नीचाँ अपन समस्या लिखू या कोनो विषय चुनू।',
  'ref.notTitle': 'ई की नहि करैत अछि',
  'ref.not1': 'ई डॉक्टर नहि अछि। दवाई के सलाह कखनो नहि देल जाइत अछि।',
  'ref.not2': 'ई वकील नहि अछि। कानूनी सलाह नहि देल जाइत अछि।',
  'ref.not3': 'कोनो टाका नहि लेल जाइत अछि, आ कोनो विज्ञापन नहि देखायल जाइत अछि।',
  'ref.not4': 'अहाँक नाम, पता या फोन नंबर नहि मांगल जाइत अछि आ नहि राखल जाइत अछि।',
  'ref.not5': 'कोनो सरकारी योजना के दाम या नंबर नहि बनैत अछि — सही जानकारी नहि हो तँ साफ कहल जाइत अछि कि नहि पता।',
  'ref.medicalTitle': 'जरूरी: ई डॉक्टर के सलाह नहि अछि',
  'ref.medicalBody': 'बीमारी, दवाई या कोनो जहरीली चीज सँ जुडल बात हो, तँ सबसे पहिने डॉक्टर सँ मिलू। एतय देल गेल जानकारी सिर्फ सामान्य मदद लेल अछि। बच्चा के टीका, गर्भावस्था, या कोनो दवाई शुरू करय सँ पहिने डॉक्टर के सलाह जरूर लेल जाउ।',
  'ref.statsTitle': 'कतेक जानकारी मौजूद अछि',
  'support.howTitle': 'हमर मदद कना करू',
  'support.alwaysFreeTitle': 'ई सेवा हमेशा निःशुल्क रहत',
  'support.alwaysFreeBody': 'जे भी मदद मिलत, से सेवा चलबै में लागत। केकरो सँ कखनो टाका नहि लेल जेतै।',
  'smriti.eyebrow': 'आदरांजलि',
  'smriti.whyTitle': 'ई साइट किएक अछि',
  'smriti.ending': 'ओकर संघर्ष एतय सँ आगू बढ़ैत अछि।',
  'article.askAny': 'कोनो सवाल पूछू',
  'article.remember': 'राखू याद',
  'article.emergencyInfo': 'जरूरी जानकारी',
  'article.medicalTitle': 'ई चिकित्सा सलाह नहि अछि',
  'article.medicalBody': 'ई जानकारी सामान्य मदद लेल अछि। कोनो दवाई शुरू या बंद नहि करू — पहिने डॉक्टर सँ मिलू।',
  'article.heading': '{category} के लेख',
  'reviews.rateQuestion': 'कतेक तारा देबय?',
  'reviews.starsShort': '{value} तारा',
  'reviews.averageOutOf': '5 में सँ {value} तारा',
  'dhun.welcomeTitle': 'स्वागत अछि',
  'dhun.consent': 'शंख, बांसुरी आ नगाड़ा — संगे सुनय लेल छुबू।',
  'dhun.unsupported': 'ई ब्राउज़र आवाज नहि बजा पा रहल अछि।',
  'dhun.failedTry': 'आवाज बजाबय में समस्या भेल।',
  'sound.hintIdle': 'कोनो बटन दबा कऽ आवाज सुनू।',
  'sound.hintPlaying': 'आवाज बज रहल अछि। रोकय लेल फेर सँ ओही बटन केँ दबाउ।',
  'sound.preparing': 'आवाज तैयार भऽ रहल अछि',
  'nav.path': 'रास्ता',
  'health.heading': 'अपन उमिर बताउ',
  'health.intro': 'उमिर के हिसाब सँ जे सवाल अक्सर पूछल जाइत अछि, से एतय देखतहुँ। कोनो बटन दबाउ — सवाल नीचाँ भरि जेतै, फेर पूछि लिअ।',
  'health.ageLabel': 'उमिर (साल)',
  'health.years': 'साल',
  'health.bandsLabel': 'उमिर के हिसाब सँ चुनू',
  'health.notAdviceStrong': 'ई इलाज के सलाह नहि अछि।',
  'health.notAdvice': 'कोनो दवाई शुरू वा बंद नहि करू — पहिने डॉक्टर सँ मिलू।',
  'health.emergencyStrong': 'आपातकाल में फोन करू:',
  'health.emergencyCall': '(आपातकाल)',
  'health.emergencyAmbulance': '(एम्बुलेंस)',
  'health.emergencyWomen': '(महिला हेल्पलाइन)',
  'health.privacy': 'कोनो नाम वा पता लिखय के जरूरत नहि अछि।',
  'health.band.infant.label': '0 – 2 साल',
  'health.band.infant.note': 'नन्हा बच्चा, जे अखन अपन बात नहि बता सकैत अछि',
  'health.c.infant1': 'तेज बुखार',
  'health.q.infant1': 'हमर बच्चा के तेज बुखार अछि, की दूध दी?',
  'health.c.infant2': 'खाना नहि खा रहल अछि',
  'health.q.infant2': 'छोट बच्चा खाना नहि खा रहल अछि, की करी?',
  'health.c.infant3': 'उल्टी भऽ रहल अछि',
  'health.q.infant3': 'बच्चा के उल्टी भऽ रहल अछि, कहिया डॉक्टर के देखाबी?',
  'health.c.infant4': 'दस्त भऽ रहल अछि',
  'health.q.infant4': 'बच्चा के दस्त भऽ रहल अछि, की खियाबी?',
  'health.band.child.label': '3 – 12 साल',
  'health.band.child.note': 'बच्चा जे बोलि सकैत अछि, मुदा सवाल पूछय सँ डरैत अछि',
  'health.c.child1': 'पढ़ाई में मन नहि',
  'health.q.child1': 'बच्चा के पढ़ाई में मन नहि लगैत अछि, की करी?',
  'health.c.child2': 'स्कूल जाय सँ मना करैत अछि',
  'health.q.child2': 'बच्चा रोज स्कूल जाय सँ मना कऽ रहल अछि, कारण की भऽ सकैत अछि?',
  'health.c.child3': 'राति में बुखार',
  'health.q.child3': 'बच्चा के राति में बुखार आबैत अछि, की करी?',
  'health.c.child4': 'दाँत टूट रहल अछि',
  'health.q.child4': 'बच्चा के दाँत टूट रहल अछि, दाँत के देखभाल कना करू?',
  'health.band.teen.label': '13 – 17 साल',
  'health.band.teen.note': 'किशोर, जकरा अक्सर कोनो अइहन व्यक्ति नहि मिलैत अछि जे सुन ले',
  'health.c.teen1': 'पढ़ाई के दबाव',
  'health.q.teen1': 'पढ़ाई के बहुत दबाव अछि, एकर सामना कना करी?',
  'health.c.teen2': 'नींद नहि आबैत अछि',
  'health.q.teen2': 'राति में नींद नीक सँ नहि आबैत अछि, की करी?',
  'health.c.teen3': 'मोबाइल के लत',
  'health.q.teen3': 'मोबाइल के लत लागि गेल अछि, छोड़य के तरीका बताउ।',
  'health.c.teen4': 'बहुत उदासी',
  'health.q.teen4': 'बहुत उदासी महसूस होइत अछि, केकरा सँ बात करी?',
  'health.band.young.label': '18 – 30 साल',
  'health.band.young.note': 'नौकरी, पइसा आ नींद — तीनों के एक संगे बोझ',
  'health.c.young1': 'काम के तनाव',
  'health.q.young1': 'काम के तनाव बहुत बेसी अछि, कना कम करी?',
  'health.c.young2': 'बैठला सँ पीठ दर्द',
  'health.q.young2': 'बैठल रहला सँ पीठ में दर्द भऽ रहल अछि, की करी?',
  'health.c.young3': 'नींद नहि आबैत अछि',
  'health.q.young3': 'रातिके नींद नहि अबै छै, की उपाय छै?',
  'health.c.young4': 'टक्का कम छै',
  'health.q.young4': 'टक्का कम छै आओर खर्चा बेसी, की करी?',
  'health.band.middle.label': '31 – 45 बरिष',
  'health.band.middle.note': 'घर, बच्चा आओर अपन सेहत — सभक जिम्मवारी एक साथ',
  'health.c.middle1': 'पिपरी में दरद',
  'health.q.middle1': 'पिपरी में दरद भेल जा रहल छै, कारण की भ सकै छै?',
  'health.c.middle2': 'नींद निक नहि',
  'health.q.middle2': 'नींद निक नहि अबै छै, सुधारबाक की उपाय छै?',
  'health.c.middle3': 'घरक तनाव',
  'health.q.middle3': 'घरक तनाव बहुत छै, बच्चा सबके कना संभालू?',
  'health.c.middle4': 'पेट में गैस',
  'health.q.middle4': 'काज पर बहुत बरिष सँ पेट में गैस की समस्या छै, की करी?',
  'health.band.later.label': '46 – 60 बरिष',
  'health.band.later.note': 'शरीरक उमिर आओर ओकर देखरेख — दुनू एक साथ',
  'health.c.later1': 'पिठ्ठी में दरद',
  'health.q.later1': 'हमर उमिर 54 बरिष छै आओर हमर पिठ्ठी में दरद छै, की करी?',
  'health.c.later2': 'घुटना में दरद',
  'health.q.later2': 'घुटना में दरद भ रहल छै पायर पर चढ़ैत काल, किएक?',
  'health.c.later3': 'रातिके गोड़ में बइता',
  'health.q.later3': 'रातिके गोड़ में बइता होइ छै, की करी?',
  'health.c.later4': 'भोरुक जकड़न',
  'health.q.later4': 'भोर में उठि क पिपरी में जकड़न होइ छै, कारण की भ सकै छै?',
  'health.band.senior.label': '61 – 75 बरिष',
  'health.band.senior.note': 'दवाई, संतुलन आओर एकाकीपन — तीनू साथ में',
  'health.c.senior1': 'चलै में दिक्कत',
  'health.q.senior1': 'घुटना में एतेक दरद छै जे चलब मुश्किल छै, की करी?',
  'health.c.senior2': 'दवाईक जाँच',
  'health.q.senior2': 'बहुत रास दवाई रोज खाए पड़ै छै — कना पता चलत जे कोनो हानिकारक छै?',
  'health.c.senior3': 'रोजुक दरद-दवाई',
  'health.q.senior3': 'रातिके बेर-बेर पिसाबक दिक्कत छै, की करी?',
  'health.c.senior4': 'सुनाई कम',
  'health.q.senior4': 'कम सुनै पड़ै छै, सुनबाक कोनो उपाय बताउ।',
  'health.band.elder.label': '76 – 100 बरिष',
  'health.band.elder.note': 'हर दवाईक जाँच जरूरी, हर पानि गिरब गंभीर',
  'health.c.elder1': 'गिरबाक डर',
  'health.q.elder1': 'घर में गिर जएबाक डर छै, कोना सुरक्षा राखी?',
  'health.c.elder2': 'स्मृति कमजोर',
  'health.q.elder2': 'याददाश्त कमजोर भ रहल छै, की उपाय छै?',
  'health.c.elder3': 'प्रतिदिनक दरद-दवा',
  'health.q.elder3': 'दरदक दवाई रोज खाए पड़ै छै — की एकर कोनो नुकसान छै?',
  'health.c.elder4': 'कखन डॉक्टर लग',
  'health.q.elder4': 'कखन डॉक्टर लग जबे जरूरी छै?',
  'ask.notConfigured': 'ई सेवा एखन अपन पुरान जबाब सब बन्द दराज सँ द रहल छै। अहाँक सवाल ओहिमें नहि भेटल।',
  'ask.browseTitle': 'इहाँ जे लेख छै, ओ देखू',
  'download.pdf': 'PDF में लिखू',
  'download.text': 'टेक्स्ट में लिखू',
  'download.printNow': 'प्रिंट करू',
  'download.preparing': 'तैयार भ रहल छै',
  'download.blocked': 'नया टैब नहि खुलि पाएल। Pop-up बन्द भ रहल छै — अपन ब्राउजर में अलग टैब खोलू।',
  'attach.button': 'अपन कागज वा फोटो जोड़ू',
  'attach.formats': 'PDF, फोटो (JPG/PNG) वा टेक्स्ट फाइल — 12 MB धरि',
  'attach.reading': 'पढ़ि रहल छै…',
  'attach.attached': 'लगा देल गेल',
  'attach.remove': 'हटाउ',
  'attach.tooBigPdf': 'ई PDF 12 MB सं पैघ अछि। छोट फ़ाइल चुनू।',
  'attach.tooBigImage': 'ई फ़ोटो 3 MB सं पैघ अछि। छोट फ़ोटो चुनू।',
  'attach.scannedPdf': 'ई PDF स्कैन कएल गेल अछि — एकरा में खाली तस्वीर अछि, पढ़ल नहि जा सकैत अछि। एकर फ़ोटो पठाबू।',
  'attach.pdfFailed': 'ई PDF पढ़ल नहि गेल।',
  'attach.imageFailed': 'ई फ़ोटो लोड नहि भेल।',
  'attach.wrongType': 'ई फ़ाइल नहि चलत। PDF, फ़ोटो वा टेक्स्ट फ़ाइल पठाबू।',
  'attach.hint': 'अपना कागज इहाँ लगा कए सवाल पूछू — हम सब ओहि सं जवाब देब।',
  'ask.sendWithFile': 'जवाब चाही',
  'lib.title': 'मुफ़्त पुस्तकालय',
  'lib.intro': 'पढ़ाई के किताब, किताब, तस्वीर आ ऑडियो — सब मुफ़्त आ कानूनी रूप सं।',
  'lib.legalTitle': 'कॉपीराइट के कोनो झंझट नहि।',
  'lib.legal': 'इहाँ जे किछु देल गेल अछि, ओ एकदम मुफ़्त अछि आ अहाँ एकरा आगू सेहो बाँटि सकैत छी। जे किताब अभी कॉपीराइट में अछि, ओ इहाँ नहि रहत — ओकरा अहाँ कॉपी नहि कऽ सकैत छी, इ साफ़ कहब जरूरी अछि।',
  'ask.signInFirst': 'पहिले लॉग इन करू, फेर सवाल पूछू।',
  'ask.signInTitle': 'पहिले लॉग इन करू',
  'ask.signInBody': 'सवाल पूछब लेल अपना खाता बनाबू। एकरा में एक मिनट सं कम समय लगैत अछि, आ अहाँ पूछैत रहब।',
  'ask.signInCta': 'खाता बनाबू वा लॉग इन करू',
  'ask.signInOr': 'अभी खाता नहि बना सकैत छी? इ काज सेहो अहाँ बिना भऽ जेत:',
  'account.title': 'हमर खाता',
  'account.intro': 'अपना नाम आ पासवर्ड डाकि कए सवाल पूछना शुरू करू।',
  'account.signIn': 'प्रवेश करू',
  'account.register': 'खाता बनाबू',
  'account.signInNote': 'पिछला बेर के नाम आ पासवर्ड डाकू।',
  'account.registerNote': 'सवाल पूछब लेल खाता जरूरी नहि। इ खाली अहाँक भाषा आ जवाब याद रखब लेल अछि।',
  'account.handle': 'अहाँक नाम',
  'account.handlePlaceholder': 'जैसे: sita.ji',
  'account.password': 'पासवर्ड',
  'account.passwordHint': 'कम्ति में 6 अक्षर।',
  'account.phone': 'फ़ोन नंबर',
  'account.optional': 'जरूरी नहि',
  'account.phoneHint': 'देब चाहू तऽ दिअ। कोनो फ़ोन नहि सेहो देब तऽ खाता बनि जेत।',
  'account.create': 'खाता बनाबू',
  'account.logout': 'बाहर निकलू',
  'account.open': 'खाता खोलू',
  'account.signedInAs': 'अहाँ लॉग इन छी',
  'account.signedOut': 'खाता नहि खुलल',
  'account.signedOutBody': 'अभी कोनो खाता नहि खुलल अछि।',
  'account.saved': 'जमा कएल गेल जवाब',
  'account.savedEmpty': 'अभी कोनो जवाब जमा नहि अछि। जवाब आबए पर \'जमा करू\' दाबू।',
  'account.savedUnavailable': 'जमा जवाब अभी नहि देखाइ रहल अछि। बाकी सब चलि रहल अछि।',
  'account.wait': 'कृपया प्रतीक्षा करू…',
  'account.privacyTitle': 'अहाँक बात सुरक्षित',
  'account.privacyBody': 'खाता बनाब पर खाली अहाँक नाम, पासवर्ड आ भाषा राखल जाइत अछि। सवाल के कोनो रेकॉर्ड नहि बनैत अछि। अहाँक सवाल ककरो भेजल नहि जाइत अछि।',
  'account.errWrong': 'नाम वा पासवर्ड गलत अछि।',
  'account.errTaken': 'ई नाम पहिले सं लेल जा चुकल अछि। दोसर नाम चुनू।',
  'account.errBad': 'जानकारी निक सं भरू।',
  'account.errWait': 'बेसी कोशिश भऽ गेल। किछु देर बाद कोशिश करू।',
  'account.errTryLater': 'अभी नहि भऽ पाएल। किछु देर बाद कोशिश करू।',
  'lib.licence.ccBy': 'अहाँ एकरा कॉपी आ शेयर कऽ सकैत छी, छाप सेहो सकैत छी — बस स्रोत के नाम देब पड़त।',
  'lib.licence.ccBySa': 'अहाँ एकरा कॉपी आ छाप सकैत छी। जे बदलाव करब, ओकरा सेहो खुल्लम-खुल्ला देब पड़त।',
  'lib.licence.ccZero': 'पूरि तरह सं मुफ़्त। स्रोत के नाम देब सेहो जरूरी नहि।',
  'lib.licence.pd': 'ककरो कॉपीराइट नहि — जे चाहैत अछि कॉपी कऽ सकैत अछि।',
  'lib.licence.govtIndia': 'भारत सरकार के वेबसाइट पर। पढ़ब आ छापब दोनों मुफ़्त।',
  'lib.licence.creativeCommons': 'हर फ़ाइल के अपना लाइसेंस अछि — फ़ाइल पर देखू।',
  'lib.licence.freeToRead': 'पढ़ब मुफ़्त अछि। कॉपी कऽ कऽ आगू देब सेहो ओहि शर्त पर अछि जेहि पर इ भेटल छेल।',
  'lib.openBadge': 'खुल्ल',
  'lib.openBadgeNote': 'एकरा कॉपी क सकैत छी',
  'lib.freeBadge': 'मुफ़्त',
  'lib.freeBadgeNote': 'पढ़ि सकैत छी, कॉपी नहि',
  'lib.govt': 'सरकारी',
  'lib.noSignup': 'बिना अकाउंट',
  'lib.open': 'एतय खोलू',
  'lib.group.padhai': 'पढ़ाइक किताब',
  'lib.group.padhai.note': 'स्कूल, कॉलेज आ सरकारी शिक्षा सामग्री',
  'lib.group.kitab': 'किताब',
  'lib.group.kitab.note': 'जेकरा पर कॉपीराइट नहि अछि या जेकरा कॉपी करबाक अनुमति अछि',
  'lib.group.tasveer': 'तस्वीर आ चित्र',
  'lib.group.tasveer.note': 'नक्शा, तस्वीर, चिन्ह — सब किछु',
  'lib.group.audio': 'आवाज़ में सुनबाक सामग्री',
  'lib.group.audio.note': 'किताब सुनि क\', बड़ अक्षर सँ नहि',
  'lib.warnTitle': 'सब किताब एतय नहि अछि',
  'lib.warn': 'किछु किताब अखन कॉपीराइट में अछि आ ओकरा कानून सँ मुफ़्त नहि देल जा सकैत अछि। हम जानबूझ क\' ओतय नहि देखबैत छी। जँ कोनो किताब चाही तँ नीचाँ सँ सवाल पूछू — जे जवाब मिलि सकैत अछि, से मिलि जेतै।',
  'lib.askInstead': 'सवाल पूछू',
  'nav.library': 'पुस्तकालय',
  'support.contactMessageLabel': 'अहाँक बात',
  'support.contactPlaceholder': 'जे लिखबाक हो ओही लिखू — गलती हो तँ, किछु नीक मिलल हो तँ, या कोनो सवाल हो।',
  'support.contactHelp': 'कम सँ कम 10 अक्षर। ई सीधे मालिक लग जाइत अछि।',
  'support.contactSubmit': 'पठाउ',
  'support.contactSending': 'पठा रहल छी…',
  'support.contactPrivacy': 'अहाँक नाम लिखब ज़रूरी नहि अछि।',
  'support.contactSent': 'पहुँच गेल',
  'support.contactSentBody': 'अहाँक बात मालिक धरि पहुँच गेल अछि।',
  'support.contactFailed': 'नहि पठाओल जा सकल',
  'support.faq1Q': 'की ई सचमुच मुफ़्त अछि?',
  'support.faq1A': 'हँ। कोनो पइसा नहि लेल जाइत अछि, कोनो विज्ञापन नहि देखैत अछि, आ कोनो सदस्यता नहि लेल जाइत अछि। ई एक व्यक्ति क\' पइसा सँ चलैत अछि, कोनो कंपनी या सरकार क\' पइसा सँ नहि।',
  'support.faq2Q': 'की हमर नाम, पता या फ़ोन नंबर लेल जाइत अछि?',
  'support.faq2A': 'नहि, आ ईहो नहि लेल जेतै। ई साइट अपने आप में कोनो पहचान नहि बनबैत अछि — कोनो लॉगिन नहि, कोनो ट्रैकिंग स्क्रिप्ट नहि। जे पूछल जाइत अछि से सिर्फ अहाँक सवाल अछि आ जखन अहाँक जवाब भेटैत अछि।',
  'support.faq3Q': 'की ई डॉक्टर या वकील अछि?',
  'support.faq3A': 'नहि। ई कोनो दवाई क\' सलाह नहि दैत अछि आ न कोनो कानूनी सलाह। जतय बात गंभीर होइत अछि ओतय ई अहाँक डॉक्टर या अधिकारी लग जेबाक बात कहैत अछि — ई हुनकर जगह नहि लेत।',
  'support.faq4Q': 'की हर जवाब सही होइत अछि?',
  'support.faq4A': 'सदा नहि। जवाब एकटा कंप्यूटर लिखैत अछि, कोनो डॉक्टर नहि — ताहि लेल हर जवाब क\' साथ ई लिखल अछि कि ई चिकित्सा सलाह नहि अछि। कोनो दवाई शुरू करबा सँ पहिने या बंद करबा सँ पहिने डॉक्टर सँ ज़रूर मिलू।',
  'support.faq5Q': 'की हमरा कोनो ऐप डाउनलोड करबाक पड़त?',
  'support.faq5A': 'नहि। ई सिर्फ ब्राउज़र में खुलैत अछि। कोनो ऐप इंस्टॉल नहि, कोनो अनुमति नहि, कोनो अपडेट नहि।',
  'nav.remedies': 'घरेलू उपचार',
  'remedy.title': 'आयुर्वेदिक घरेलू उपचार',
  'remedy.intro': 'जेहो तकलीफ़ हो — खांसी, माथ दर्द, गठिया, खाज-खुजली, मधुमेह, पीठ दर्द — नीचाँ अपन तकलीफ़ चुनू या अपन शब्द में पूछू। घरेलू काढ़ा, मालिश, खानपान आ आयुर्वेदिक उपाय बताओल जेतै।',
  'remedy.choose': 'अपन तकलीफ़ चुनू',
  'remedy.emergencyStrong': 'ई आपातकाल अछि:',
  'remedy.emergency': 'साँप क\' काटब, बिच्छी क\' डंक आ कुकुर क\' काटब — तुरंत अस्पताल जाउ, पहिने 112 पर फोन करू। घरेलू उपाय सिर्फ रास्ता में करबाक लेल अछि, अस्पताल क\' जगह नहि।',
  'remedy.note': 'घरेलू आ आयुर्वेदिक उपाय तकलीफ़ कम करब में मदद करैत अछि; ई डॉक्टर क\' जाँच आ इलाज क\' जगह नहि अछि। कोनो दवा अपने सँ बंद या शुरू नहि करू।',
  'remedy.cough': 'खांसी',
  'remedy.headache': 'माथ दर्द',
  'remedy.joints': 'गठिया',
  'remedy.itching': 'खाज-खुजली',
  'remedy.snake': 'साँप क\' काटब',
  'remedy.scorpion': 'बिच्छी क\' डंक',
  'remedy.dog': 'कुकुर क\' काटब',
  'remedy.diabetes': 'मधुमेह',
  'remedy.back': 'पीठ दर्द',
  'remedy.walking': 'चलबा में तकलीफ़',
  'home.remedyNote': 'काढ़ा, मालिश, खानपान आ आयुर्वेदिक उपाय — हर तकलीफ़ लेल, अहाँक भाषा में।',
  'nav.aarti': 'आरती आ भजन',
  'aarti.title': 'आरती आ भजन — असली आवाज में',
  'aarti.intro': 'एतय आरती, कीर्तन आ भजन सुनू — असली गायक आ मंदिरक आवाज में। कोनो AI आवाज नहि।',
  'aarti.note': 'कंप्यूटरक आवाज में आरती वा भजन सुनावै सँ ओकर चाल आ भक्ति खत्म भ जाइत छै। तेसरे एतय खाली असली रेकॉर्डिंग छै।',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रेकॉर्डिंग:',
  'aarti.licence': 'लाइसेंस:',
  'aarti.listenLink': 'असली आवाज में सुनू',
  'aarti.textChecked': 'ई पारंपरिक पाठ छै, जेना असली रेकording में गाओल गेल छै।',
  'aarti.textPrinted': 'ई प्रचलित पाठ छै, प्रकाशित संग्रह सँ मिला कऽ जाँचल गेल छै।',
  'aarti.textNotStored': 'एहि ग्रंथक पूरा पाठ एतय जमा नहि छै — नीचाँ रेकॉर्डिंग में पूरा पाठ बजैत छै।',
  'aarti.granthTitle': 'ग्रंथ, चालीसा आ स्तोत्र — असली आवाज में',
  'aarti.noRecording': 'एहि आरतीक असली रेकॉर्डिंग अखन साइट पर नहि छै, तेसरे हम इ गा कऽ नहि सुना सकै छी — AI आवाज में आरती कखनो नहि गाबै छै।',
  'aarti.textOnlyTitle': 'आरो आरती सब — पाठ सेहो, असली आवाज सेहो',
  'aarti.fullText': 'पूरा पाठ',
  'aarti.notChecked': 'एहि आरतीक जाँचल पाठ अखन साइट पर नहि छै। बिना जाँचल पाठ देब निक नहि छै, तेसरे ओ नहि देल जा रहल छै।',
  'aarti.verifiedList': 'साइट पर इ सब आरतीक जाँचल पाठ छै:',

};

/* -------------------------------------------------------------------------- */
/* DOGRI                                                                     */
/* -------------------------------------------------------------------------- */

const DOGRI: Record<string, string> = {
  'jgd.placeSearch': 'शहर दा नां लिखो',
  'jgd.placeNoMatch': 'ए शहर सूची च नेईं है। अपने नेड़े दा शहर चुनो।',
  'account.name': 'तुआडा नां',
  'account.namePlaceholder': 'जियां: सीता देवी',
  'account.nameHint': 'ए तुआडी पछाण लेई है। कोई बी नां चलग, ते ए ज़रूरी नेईं है।',
  'nav.home': 'घर',
  'home.metaTitle': 'मुफ़्त समाधान, अपने अपने शब्दां च',
  'lib.licence.ccZero.name': 'CC0 / सार्वजनिक डोमेन',
  'lib.licence.pd.name': 'सार्वजनिक डोमेन',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिव कॉमन्स (मिश्रित)',
  'lib.licence.freeToRead.name': 'पढ़ने लेई स्वतंत्र',
  'lib.entry.ncert.title': 'NCERT किताबें — कक्षा 1 थमां 12 तकर',
  'lib.entry.ncert.what': 'हर विषय दीयां सारी किताबें, इसलै हर कक्षा लेई। बिना लॉगिन, सीधी PDF।',
  'lib.entry.ncert.langs': 'हिंदी, अंग्रेज़ी ते 30 थमां बद्ध भारतीय भाशाएं',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल पाठ्यपुस्तक',
  'lib.entry.pm-evidya.what': 'NCERT दीयां किताबां दा ऐप, बड्डे अखरें च पढ़ सकदे ओ। बोलियै बी सुन सकदे ओ।',
  'lib.entry.pm-evidya.langs': 'भारतीय भाशाएं',
  'lib.entry.diksha.title': 'DIKSHA — अध्यापकें ते बच्चें लेई',
  'lib.entry.diksha.what': 'पाठ्यक्रम, वीडियो ते अभ्यास — कक्षा 1 थमां 12 तकर।',
  'lib.entry.diksha.langs': 'भारतीय भाशाएं',
  'lib.entry.khan-academy.title': 'Khan Academy — अंग्रेज़ी च गणित ते विज्ञान',
  'lib.entry.khan-academy.what': 'वीडियो पाठ, हर कक्षा तकर। सीधे पढ़ने आह्ले लेई लिखित बी है।',
  'lib.entry.openstax.title': 'OpenStax — अंग्रेज़ी च मुफ़्त किताबें',
  'lib.entry.openstax.what': 'कॉलेज स्तर दीयां किताबें — गणित, विज्ञान, मानविकी। हर सफ़े पर PDF।',
  'lib.entry.nios.title': 'NIOS — दूरस्थ शिक्षा, मुफ़्त सामग्री',
  'lib.entry.nios.what': 'ओपन ते ऑनलाइन कोर्स दीयां मुफ़्त पुस्तिकाएं, बिना दाखिले दे।',
  'lib.entry.nios.langs': 'हिंदी, अंग्रेज़ी ते होर',
  'lib.entry.ignou.title': 'IGNOU — बड्डे स्कूल दीयां मुफ़्त किताबें',
  'lib.entry.ignou.what': 'दूरस्थ शिक्षा दीयां किताबें जेहड़ीयां बिल्कुल मुफ़्त मिलदीयां न।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — अंग्रेज़ी दीयां पुरानियां किताबें',
  'lib.entry.gutenberg.what': '70,000 थमां बद्ध किताबें, सब दा कॉपीराइट खत्म। मुफ़्त ई-बुक ते ऑडियो।',
  'lib.entry.pratham-books.title': 'Pratham Books — बच्चें दीयां किताबें',
  'lib.entry.pratham-books.what': 'भारतीय भाशाएं च बच्चें दीयां किताबें, बिल्कुल मुफ़्त। कक्षा 1 थमां 5 लेई।',
  'lib.entry.pratham-books.langs': 'हिंदी, मराठी, बंगाली, तमिल, तेलुगु ते होर',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — अख़बार ते पुरानियां पत्रिकाएं',
  'lib.entry.internet-archive-texts.what': 'लक्खां पुरानियां किताबें, पत्रिकाएं ते अख़बार — मुफ़्त।',
  'lib.entry.wikisource.title': 'Wikisource — जन-गद्य पाठ',
  'lib.entry.wikisource.what': 'कोई कॉपीराइट नेईं — ए सारी दुनिया दीयां पुरानियां साहित्यिक किताबें न।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — हर तस्वीर',
  'lib.entry.wikimedia-commons.what': 'उपजाति, नक्शा, तारे, इतिहास — सब कुछ। हर तस्वीर पर अलग लाइसेंस लिखिया है।',
  'lib.entry.pixabay.title': 'Pixabay — तस्वीरें ते चित्र',
  'lib.entry.pixabay.what': 'तस्वीरें, रेखाचित्र ते छोटी वीडियो।',
  'lib.entry.unsplash.title': 'Unsplash — सुंदर तस्वीरें',
  'lib.entry.unsplash.what': 'मुफ़्त, बड्डे अखरें च, बिना अकाउंट दे।',
  'lib.entry.openverse.title': 'Openverse — सारी तस्वीरें इकठ्ठी',
  'lib.entry.openverse.what': 'कई मुफ़्त तस्वीरें दीयां साइटें इकठ्ठी खोजो।',
  'lib.entry.librivox.title': 'LibriVox — सुनन आह्लीयां किताबें',
  'lib.entry.librivox.what': 'पुरानियां अंग्रेज़ी किताबां दा मुफ़्त ऑडियो, इंसान दी आवाज़ च।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ऑडियो संग्रह',
  'lib.entry.internet-archive-audio.what': 'हज़ारां मुफ़्त ऑडियो — किताबें, भाषण, संगीत।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राष्ट्रीय गान ते गीत',
  'lib.entry.vande-mataram.what': 'भारत दा राष्ट्रीय गान ते होर राष्ट्रीय गीत, मुफ़्त।',
  'art.aag-aur-bijli-ke-bachav.title': 'अग्ग ते बिजली थमां बचाव दे नियम',
  'art.aag-aur-bijli-ke-bachav.summary': 'घर च अग्ग लगन थमां बचाव — सरल नियम',
  'art.aag-lagne-par-kya-karein.title': 'अग्ग लग जाए तां क्या करो',
  'art.aag-lagne-par-kya-karein.summary': 'सड़दे होए घर च अग्ग — सब थमां पैहले क्या करो, क्या नेईं करो',
  'art.bimari-se-bachav.title': 'बीमारी थमां बचाव दे सत्त नियम',
  'art.bimari-se-bachav.summary': 'हत्थ धोना, मास्क, टीका — वगैरा थमां बचाव',
  'art.dhuwan-ka-jhakora.title': 'धुएं दे झकोरे थमां बचाव',
  'art.dhuwan-ka-jhakora.summary': 'दम घुटना, सांस नहीं आ रही — क्या करना, कद्दू अस्पताल जाना',
  'art.doodh-pani-band-ho.title': 'बिजली या पानी अचानक बंद हो जाना',
  'art.doodh-pani-band-ho.summary': 'क्या करना, कदे बचना, कद्दू मदद मंगनी',
  'art.haath-ki-saafai.title': 'बिना साबुन दे हत्थ साफ करने दा तरीका',
  'art.haath-ki-saafai.summary': 'जद पानी या साबुन न हो',
  'cat.dhyan-aur-yoog.title': 'ध्यान ते योग',
  'cat.dhyan-aur-yoog.subtitle': 'मन शांत करने दे सरल उपाय',
  'cat.gharelu-marammat.title': 'घरेलू मरम्मत',
  'cat.gharelu-marammat.subtitle': 'घर दी छोटी-मोटी समस्यां दा हल',
  'cat.bachchon-ki-padhai.title': 'बच्चें दी पढ़ाई',
  'cat.bachchon-ki-padhai.subtitle': 'पढ़ाई च लगे, परेशान हो',
  'cat.budharge-seva.title': 'बुजुर्गें दी सेवा',
  'cat.budharge-seva.subtitle': 'देखभाल ते सहायता',
  'cat.shishu-dekhbhal.title': 'शिशु देखभाल',
  'cat.shishu-dekhbhal.subtitle': 'नन्हे बच्चे दी सही देखभाल',
  'cat.dharmik-upay.title': 'धार्मिक उपाय',
  'cat.dharmik-upay.subtitle': 'मन दी शांति दे नाल',
  'cat.pavan-grah-aur-aarti.title': 'पावन ग्रंथ ते आरती',
  'cat.pavan-grah-aur-aarti.subtitle': 'श्रद्धा दे नाल पढ़ो ते सुनो',
  'cat.aapatkalen-gayide.title': 'आपातकालीन गाइड',
  'cat.aapatkalen-gayide.subtitle': 'जद तुरंत मदद चाहिदी हो',
  'cat.mahamari-suraksha.title': 'महामारी सुरक्षा',
  'cat.mahamari-suraksha.subtitle': 'बीमारी फैलने थमां बचाव',
  'nav.tribute': 'याद',
  'nav.help': 'सहायता',
  'nav.reference': 'संदर्भ',
  'nav.reviews': 'राय',
  'nav.support': 'मदद करो',
  'nav.birthChart': 'जन्म कुंडली',
  'jgd.title': 'तहाड़ी जन्म कुंडली',
  'jgd.intro': 'अपना नाम, जन्म दी तारीख, ते जे हो सके तां जन्म दा समय ते स्थान लिखो। सारी गणना तहाड़े फोन पर ही होग — कोई भी चीज किते भेजी नहीं जंदी।',
  'jgd.nameLabel': 'जन्म दा नाम',
  'jgd.namePlaceholder': 'जियां पूरा नाम',
  'jgd.nameHint': 'जेड़ा नाम बचपन च रख्या हा, ओई लिखो।',
  'jgd.dateLabel': 'जन्म दी तारीख',
  'jgd.timeLabel': 'जन्म दा समय',
  'jgd.timeHint': 'जे नहीं पता तां खाली छोड़ द्यो।',
  'jgd.placeLabel': 'जन्म दा स्थान',
  'jgd.placeNone': 'पता नहीं / चुनो',
  'jgd.placeHint': 'जन्म दा शहर चुनो।',
  'jgd.submit': 'गणना करो',
  'jgd.savePdf': 'PDF बनाओ',
  'jgd.again': 'नमीं गणना',
  'jgd.errDate': 'कृपया जन्म दी तारीख सही लिखो।',
  'jgd.errPlace': 'जन्म दा शहर सूची थमां चुनो, या ओदे नेड़े दा शहर चुनो।',
  'jgd.numTitle': 'अंक ज्योतिष',
  'jgd.lifePath': 'जीवन पथ',
  'jgd.nameNumber': 'नाम अंक',
  'jgd.soulNumber': 'आत्मा अंक',
  'jgd.birthdayNumber': 'जन्म दिन अंक',
  'jgd.astroTitle': 'वैदिक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'पद',
  'jgd.rashi': 'राशि',
  'jgd.rashiLord': 'राशि स्वामी',
  'jgd.nakshatraLord': 'नक्षत्र स्वामी',
  'jgd.lagna': 'लग्न',
  'jgd.lagnaMissing': 'लग्न कढने लेई जम्मै दा समां ते थां चाहिदी। उप्पर भरियै फेर गणना करो, ते जे नहीं पता तां एह् बी बहुत ऐ।',
  'jgd.gunTitle': 'गुण मिलान',
  'jgd.gunIntro': 'दूजे बंदे दा नां ते जम्मै दी तारीख भरो।',
  'jgd.gunName': 'उसदा नां',
  'jgd.gunDate': 'उसदी जम्मै दी तारीख',
  'jgd.gunHint': 'दोनुआं दा नां ते जम्मै दी तारीख होवे तां गुण मिलान निकलैगा।',
  'jgd.disclaimer': 'एह् परंपरा दे अनुसार कीती गई गणना ऐ, भविष्यवाणी नहीं। कोई संख्या या राशि किसे दी सेहत, धन या रिश्ता तय नहीं करदी। बड्डे फैसले डॉक्टर, कानूनी सलाह या अनुभवी दी सलाह कन्नै लो।',
  'nav.menu': 'मेन्यू',
  'nav.openMenu': 'मेन्यू खोलो',
  'nav.closeMenu': 'मेन्यू बंद करो',
  'nav.expand': 'बांस खोलो',
  'nav.collapse': 'बांस बंद करो',
  'nav.skip': 'सीधे सामग्री पर जाओ',
  'nav.language': 'भाषा बदलो',
  'footer.pages': 'पन्ने',
  'footer.helplines': 'ज़रूरी नंबर',
  'footer.free': 'एह् सेवा पूरी तरां मुफ्त ऐ। किसे कोलै कोई पैसा नहीं लिया जांदा।',
  'footer.readStory': 'उन्ह्नां दी पूरी कथा पढ़ो',
  'footer.admin': 'प्रबंधक',
  'footer.rights': 'मुफ्त सेवा',
  'footer.emergency': 'आपातकाल',
  'footer.ambulance': 'एम्बुलेंस',
  'footer.women': 'महिला हेल्पलाइन',
  'home.dedication1': 'दी याद विच — एक पूरी तरां मुफ्त सेवा।',
  'home.dedication2': 'अपनी समस्या लिखो या बोलो।',
  'home.emergencyTitle': 'ज़रूरी — तुरंत मदद चाहिदी',
  'home.emergencyNote': 'एह् सबसे पैहलै पढ़ो। बाकी सब बाद विच देखिया जा सकदा ऐ।',
  'home.readMore': 'पूरी जानकारी पढ़ो',
  'home.chooseTopic': 'किस विषय बारे जानना ऐ?',
  'home.memorialEyebrow': 'एह् साइट किनदे लेई ऐ',
  'home.memorialLine': 'जिन्ह्नां समाज लेई जिंदगी भर लड़ाई लड़ी, ते जिन्ह्नां आख़िर विच अपने हिस्से दा हिसाब नहीं मिलिया।',
  'home.memorialMore': 'उन्ह्नां दी पूरी कहानी पढ़ो',
  'home.kundaliTitle': 'जम्मै दी कुंडली',
  'home.kundaliNote': 'पूरी कुंडली — 9 ग्रह, विमशोत्तरी दशा, फलादेश, योग, शोडशवर्ग, केपी, लाल किताब ते अंक ज्योतिष। सब तुंदे फोन पर ही गणना होवेगी।',
  'home.chooseTopicNote': 'थल्ले दित्ते विषय पर टैप करो। हर जगह सरल भाषा विच जानकारी दित्ती गई ऐ।',
  'home.askHere': 'एसे विषय बारे पूछो',
  'home.categoryEmpty': 'इस विषय विच अभी कुछ नहीं लिखिया गया।',
  'home.soundTitle': 'शांति लेई ध्वनि',
  'home.soundIntro': 'कोई शुल्क नहीं, कोई विज्ञापन नहीं। बस मन शांत करने लेई।',
  'home.howTitle': 'एह् सेवा किवें कम्म करदी ऐ',
  'home.step1Title': 'अपनी गल्ल लिखो या बोलो',
  'home.step1Body': 'हिंदी विच टाइप करो, या माइक दबाईकै बोलो। कुछ बी खास नहीं करना — जो मन विच ऐ ओही लिख दियो।',
  'home.step2Title': 'तुरंत जवाब मिलदा ऐ',
  'home.step2Body': 'हर सवाल दर्ज होंदा ऐ ते उसदा जवाब तुरंत मिलदा ऐ। बहुत लंबे सवाल थों पैहलै छोटे सवाल थों शुरू करो।',
  'home.step3Title': 'कोई पैसा नहीं, कोई निजी जानकारी नहीं',
  'home.step3Body': 'एह् सेवा बिल्कुल मुफ्त ऐ। तुंदा नां, पता या फोन नंबर नहीं मंगिया जांदा, ते कोई विज्ञापन नहीं दस्सिया जांदा।',
  'home.stepLabel': 'चरण',
  'home.freeTitle': 'एह् सेवा बिल्कुल मुफ्त ऐ',
  'home.freeBody': 'कोई पैसा नहीं लिया जांदा, कोई निजी जानकारी नहीं मंगिया जांदा, ते कोई विज्ञापन नहीं दस्सिया जांदा।',
  'help.q1.label': 'बिजली चली गई ऐ, क्या करां?',
  'help.q1.question': 'घर च बिजली चली गई ऐ। की करना चाहिदा, ते मोबाइल फ़ोन केंह चार्ज करीए?',
  'help.q2.label': 'बच्चे दी पढ़ाई च कमजोरी',
  'help.q2.question': 'मेरे बच्चे दी पढ़ाई च बड़ी कमजोरी ऐ। घर पर केंह सुधारें?',
  'help.q3.label': 'बुजुर्ग दा इलाज',
  'help.q3.question': 'मेरे पिताजी दी उम्र बहुत ज्यादा ऐ, उंदे इलाज लेई की करिए?',
  'help.q4.label': 'जेकर घर च अग्ग लग जाए',
  'help.q4.question': 'जेकर रात दे बेले घर च अग्ग लग जाए तां सब तूं पैहले की करना चाहिदा?',
  'help.title': 'अपनी समस्या लिखो',
  'help.intro': 'थल्ले लिखो जां बोल। पता नेईं होए तां जिवें मन च आवे उवें ही लिख द्यो — एई सब तूं जरूरी ऐ।',
  'help.suggested': 'आम सवाल',
  'help.howTitle': 'ए सेवा केंह कम करदी ऐ',
  'help.howBody': 'हर सवाल दर्ज होंदा ऐ ते उंदा जवाब तुरंत मिलदा ऐ। तुंदा नाम, पता जां फ़ोन नंबर कतई नेईं लिया जांदा। सब कुछ मुफ्त ऐ।',
  'ref.title': 'ए सेवा की ऐ, ते किनदे लेई ऐ',
  'ref.intro': 'ए सेवा श्रीमती VARSHA जी दी याद च बनाई गई ऐ। इत्थै सरल भाषा च दस्सेया गया ऐ कि ए की करदी ऐ, इंदे च की-की ऐ, ते इंदी सीमाएं की न। सब कुछ बिल्कुल मुफ्त ऐ — कोई पैसा नेईं लिया जांदा, कोई विज्ञापन नेईं दस्सेया जांदा, ते कोई निजी जानकारी नेईं मंगी जांदी।',
  'ref.whatTitle': 'इंदे च की-की ऐ',
  'ref.what1': 'घर च अग्ग लग जाए, बिजली चली जाए, बच्चे दी पढ़ाई च कमजोरी हो, मां-प्यो दी देखभाल करनी हो — एजे आम समस्याएं दे सरल उपाय, साफ-सुथरी भाषा च।',
  'ref.what2': 'सवाल बोलियै पुच्छने दी सुविधा। बोलना नेईं आवे तां लिखो — दोंह दा जवाब इक जिया मिलदा ऐ।',
  'ref.what3': 'हर सवाल दर्ज होंदा ऐ, इस लेई जेहड़ा दूजें परेशान करदा ऐ ओ तुस तूं पैहले ही पुच्छेया जाई चुक्केया होंदा ऐ ते उंदा जवाब मिल जांदा ऐ।',
  'ref.what4': 'कोई विज्ञापन नेईं, कोई फालतू सूचना नेईं, ते कोई निजी जानकारी नेईं मंगी जांदी। सब कुछ मुफ्त।',
  'ref.helplineTitle': 'तुरंत मदद लेई ए नंबर कोल रखो',
  'ref.helpline1': 'कोई बड़ा खतरा होवे — जिवें अग्ग, बिजली दा तेज झटका, डिग्गना जां बहुत ज्यादा खून — तां 112 पर फ़ोन करो।',
  'ref.helpline2': 'किसी बीमार होवे जां चोट लगी होवे ते जान लेई कोई रास्ता नेईं होवे, तां 108 पर एम्बुलेंस मंगवाओ।',
  'ref.helpline3': 'महिला दे नाल कोई बुरा कम होया होवे, जां महिला परेशान कीती जा रही होवे, तां 181 पर फ़ोन करो। ए मुफ्त ऐ।',
  'ref.helpline4': 'बच्चे जां बुजुर्ग दे नाल कोई अन्याय होया होवे, तां 1098 पर शिकायत कीती जा सकदी ऐ।',
  'ref.helpline5': 'मानसिक तनाव बहुत ज्यादा होवे, जां जीने दा मन नेईं करदा होवे, तां 14416 पर गल्ल कीती जा सकदी ऐ। सिर्फ गल्ल करने लेई।',
  'ref.dataTitle': 'असीं तुंदे बारे च की रखदे आं',
  'ref.dataBody': 'सिर्फ ओ सवाल जेहड़ा तुस पुच्छेया, उंदा सार, ते सवाल पुच्छने दा समां — तां जे असीं बार-बार ओई जवाब न दई सकिए। तुंदा नाम, पता, फ़ोन नंबर, जां कोई पहचान दस्सन आली जानकारी नेईं ली जांदी। साइट पर कोई विज्ञापन जां ट्रैकिंग स्क्रिप्ट नेईं लगी ऐ।',
  'ref.adminTitle': 'प्रबंधक की कर सकदे न',
  'ref.adminBody': 'प्रबंधक ओ लेख देख सकदे न जेहड़े तुस भेजे न, ते उंदा जवाब लिख सकदे न। ओ तुंदी मर्जी बिना कोई लेख बदल जां हटा नेईं सकदे, ते तुंदी जानकारी किसी होर गी नेईं बेच सकदे।',
  'ref.statsCategories': 'विषय उपलब्ध न',
  'ref.statsArticles': 'लेख लिखे गए न',
  'ref.statsQuestions': 'सवाल पुच्छे जाई चुक्के न',
  'ref.ownerNote': 'ए सेवा किसी कंपनी दी नेईं, किसी सरकार दी नेईं, बल्कि इक व्यक्ति दी याद च चलाई जा रही ऐ। इस लेई इत्थै कोई विज्ञापन नेईं, कोई सदस्यता नेईं, ते कोई पैसा नेईं लिया जांदा।',
  'support.title': 'ए सेवा मुफ्त ऐ',
  'support.intro': 'ए सेवा किसी तूं पैसा नेईं लेंदी। पर ए चलदी ऐ — इस लेई कुझ तरीके न जिनदे नाल तुस मदद कर सकदे ओ। सब तूं सौखा तरीका सब तूं काम दा ऐ।',
  'support.waysTitle': 'तुस केंह मदद कर सकदे ओ',
  'support.way1Title': 'अपना अनुभव लिखो',
  'support.way1Body': 'जेकर इस साइट तूं तुसें गी कुझ ठीक मिलया होवे — जां कुझ एजा मिलया होवे जेहड़ा तुसें गी उलझन च छड्ड गया होवे — तां राय पेज पर लिख द्यो। तुंदा नाम लेना जरूरी नेईं ऐ।',
  'support.way2Title': 'अपने शहर बारे दस्सो',
  'support.way2Body': 'तुस जित्थे रौंदे ओ, उत्थें दी भाषा, रीति-रिवाज ते दिक्कतां अलग हुंदियां न। जेकर तुंदे इलाके दी कोई गल्ल इत्थै नेईं ऐ, तां दस्सो — जेहड़ा जोड़ा जा सकदा ऐ ओ जोड़ दित्ता जावेगा।',
  'support.way3Title': 'अपना अनुभव किसी होर गी सुनाओ',
  'support.way3Body': 'जेहड़ा इत्थै लिखेया ऐ ओ बहुत सारे लोकें दे कम आ सकदा ऐ, जेकर उंदे गी पता होवे। किसी एजे व्यक्ति गी दस्सो जिनदे लेई ए सचमुच मदद होवे।',
  'support.way4Title': 'इत्थै आके देखो',
  'support.way4Body': 'जेकर तुंदे कोल समां होवे, तां खुद आके देखो कि ए साइट ठीक चलदी ऐ जां नेईं। कुझ बिगड़ेया दस्से तां दस्सो — बिल्कुल मुफ्त च ठीक हो जावेगा।',
  'support.contactTitle': 'कुझ दस्सना ऐ?',
  'support.contactBody': 'किसी भी गल्ल लेई इत्थै लिख सकदे ओ — चाहे कोई गलती होवे, चाहे कुझ ज्यादा मिले, जां कोई सवाल। जिन्ना लिखना सौखा लगे, उन्ना ही लिखो।',
  'support.faqTitle': 'कुझ गल्लां जेहड़ियां बार-बार पुच्छियां जांदियां न',
  'support.faqBody': 'की ए सचमुच मुफ्त ऐ? हां। की तुंदा नाम लिया जांदा ऐ? नेईं, नाम देना जरूरी नेईं ऐ। की विज्ञापन आंदे न? नेईं। कोई फ़ोन नंबर जां पता तां नेईं मंगेया जांदा? नेईं। की किसी ऐप गी डाउनलोड करना पैवेगा? नेईं, बस ब्राउज़र च खुल जांदी ऐ।',
  'ask.label': 'अपनी समस्या लिखो जां माइक तूं बोलो',
  'ask.placeholder': 'जिवें: बच्चे दी पढ़ाई च कमजोरी ऐ',
  'ask.help': 'एंटर दबाईयै बी भेज सकदे ओ।',
  'ask.send': 'पुच्छो',
  'ask.sending': 'सोच रहे आं…',
  'ask.clear': 'लिखेया मिटाओ',
  'ask.speak': 'बोलियै पुच्छो',
  'ask.listening': 'बोलना शुरू करो…',
  'ask.heard': 'सुन रहे हैं',
  'ask.stopListening': 'सुनना बंद करो',
  'ask.suggested': 'आम सवाल',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'सुनो',
  'ask.stopSpeak': 'रुको',
  'ask.aiNote': 'एह जवाब VARSHA SAMADHAN AI ने दित्ता है। एह् किसी विशेषज्ञ दी सलाह दा विकल्प नहीं है।',
  'ask.errorRateLimit': 'बहुत सारे सवाल इकट्ठे भेज दित्ते। थोड़ी देर बाद कोशिश करो।',
  'ask.errorNetwork': 'इंटरनेट नहीं चल रहा। कनेक्शन चेक करो ते फिर कोशिश करो।',
  'ask.notAnswer': 'इस सवाल दा सीधा जवाब साढ़े कोल नहीं है।',
  'ask.emptyAnswer': 'इस बार जवाब नहीं बन सक्या। थोड़ा अलग तरीके कन्नै फिर पूछो।',
  'ask.micUnsupported': 'इस ब्राउज़र च बोलियै पूछना काम नहीं करग। लिखियै पूछो।',
  'ask.heardWith': 'एह सुन रहे हैं:',
  'voice.notAllowed': 'माइक दी इजाजत नहीं मिली। ऊपर जाईक इजाजत द्यो, या लिखियै पूछो।',
  'voice.serviceNotAllowed': 'माइक दी इजाजत नहीं मिली। ऊपर जाईक इजाजत द्यो, या लिखियै पूछो।',
  'voice.noSpeech': 'कोई आवाज़ नहीं सुनाई दित्ती। माइक दे कोल बोलियै, या लिखो।',
  'voice.audioCapture': 'कोई माइक नहीं मिल्या। डिवाइस जोड़ो, या लिखियै पूछो।',
  'voice.network': 'बोलियै पूछने लेई इंटरनेट चाहिदा, ते ओ नहीं चल रहा। लिखियै पूछो — जवाब ओई मिलग।',
  'voice.aborted': 'रुक गया। दोबारा कोशिश करो।',
  'voice.unsupported': 'इस ब्राउज़र च बोलियै पूछना काम नहीं करग। लिखियै पूछो।',
  'voice.speakFailed': 'एह जवाब सुनाया नहीं जा सक्या।',
  'voice.noVoice': 'इस डिवाइस च {name} बोलने वाली आवाज़ नहीं मिली। अभी लिखियै पढ़ो, या फ़ोन दी सेटिंग च जाईक आवाज़ जोड़ो।',
  'voice.generic': 'कुछ गड़बड़ हो गई। दोबारा कोशिश करो।',
  'sound.title': 'शांति लेई ध्वनि',
  'sound.intro': 'कोई फीस नहीं, कोई विज्ञापन नहीं। बस मन शांत करने लेई।',
  'sound.playing': 'आवाज़ चल रही है। रोकने लेई दोबारा उसी बटन दबाओ।',
  'sound.shankh': 'शंख',
  'sound.shankhHint': 'गहरी, लंबी',
  'sound.bansuri': 'बांसुरी',
  'sound.bansuriHint': 'कोमल, धीमी',
  'sound.dhol': 'नगाड़ा',
  'sound.dholHint': 'तीखी, तेज़',
  'sound.all': 'तन्ने',
  'sound.allHint': 'इकट्ठे',
  'sound.listenLabel': 'सुनो',
  'sound.errUnsupported': 'एह ब्राउज़र ध्वनि नहीं चला सकदा।',
  'sound.errGeneric': 'ध्वनि चलाने च समस्या होई।',
  'dhun.welcome': 'स्वागत है',
  'dhun.prompt': 'शंख, बांसुरी ते नगाड़ा — इकट्ठे सुनने लेई छुओ।',
  'dhun.listen': '▶ सुनो',
  'dhun.skip': 'ध्वनि छोड़ो',
  'dhun.failed': 'ध्वनि नहीं चल सकी।',
  'dhun.label': 'ध्वनि चलाने दी इजाजत',
  'reviews.title': 'तहाड़ी राय, तहाड़ी गल्ल',
  'reviews.intro': 'क्या एह् सेवा तहाड़े कम आई? अपनी गल्ल लिखो — तहाड़ा नाम लेना ज़रूरी नहीं है।',
  'reviews.pageTitle': 'तहाड़ी राय',
  'reviews.pageIntro': 'इत्थै ओई लिख्या है जो लोकें लिख्या है। कोई राय लुकाई नहीं जंदी, ते जो लिख्या है ओ इत्थै ई दिखदा है — बस इक बार देख लेने दे बाद प्रकाशित कीता जंदा है।',
  'reviews.write': 'अपनी राय लिखो',
  'reviews.submit': 'भेजो',
  'reviews.sending': 'भेज रहे हैं…',
  'reviews.name': 'तहाड़ा नाम (ज़रूरी नहीं)',
  'reviews.city': 'तहाड़ा शहर (ज़रूरी नहीं)',
  'reviews.comment': 'तहाड़ी गल्ल',
  'reviews.placeholder': 'जो मन च आया ओई लिखो — कुछ सही करने दी ज़रूरत नहीं।',
  'reviews.moderated': 'तुसां दी समीक्षा छपݨ थारै पैह्लै इक बार देखी जोगी।',
  'reviews.moderationNote': 'सब कुझ मिटݨ थारै बचाए आस्ने, छपݨ थारै पैह्लै हर समीक्षा इक बार देखी जोगी। गाली, नंबर जां व्यक्तिगत गल्लां कड्ढी दित्तियाँ जोगीआं — बाकी सब तिज्जै दी तिज्जी छपी जोगी।',
  'reviews.summaryTitle': 'आम राय',
  'reviews.count': 'समीक्षाएं',
  'reviews.anonymous': 'बिना नां दे',
  'reviews.summaryLine': 'लोकां औसतन {rating} चों 5 चों {count} तारे दित्ते।',
  'reviews.starsLabel': '5 चों {value} तारा',
  'reviews.keepLabel': 'माड़ा लग्गा तां ठीक लग्गा तां — दोनों लिखो',
  'reviews.ownerReply': 'जवाब',
  'reviews.replyLabel': 'एस उप्पर लिख्या गेदा ऐ',
  'reviews.empty': 'अभी कोई समीक्षा नी ऐ। पैह्लू तुसां लिखो।',
  'reviews.toastSent': 'धन्यवाद',
  'reviews.toastFailed': 'राय नी भेजी जाई सकी',
  'reviews.fieldTooShort': 'घट्ट-घट्ट 10 अक्षर लिखो।',
  'reviews.rateLimited': 'बड़ी तेज़ी कन्नै भेजी जाई रिया ऐ। थोड़ा रुक्की कन्नै परै कोशिश करो।',
  'cat.notFound': 'यह पन्ना नी मिल्या',
  'cat.empty': 'एस विषय च अभी कोई लेख नी ऐ।',
  'article.emergency': 'ज़रूरी',
  'article.askAbout': 'एसई विषय च पुछो',
  'article.readAloud': 'यह लेख सुणो',
  'article.others': 'एसई विषय दे होर लेख',
  'article.count': '{count} लेख',
  'theme.toLight': 'चाह्ते दी दिखावट उप्पर जाओ',
  'theme.toDark': 'अन्नेरे दी दिखावट उप्पर जाओ',
  'toast.dismiss': 'बंद करो',
  'language.choose': 'अपनी भाषा चुणो',
  'language.articlesIn': 'यह लेख डोगरी च ऐ।',
  'language.articlesInHint': 'हर भाषा च अलग अनुवाद चाहिदा। यह अनुवाद अभी नी होया — जो लिख्या ऐ वह डोगरी चई सही ते पूरा ऐ।',
  'ask.welcome': 'तुसां दा स्वागत ऐ! नेईं अपनी समस्या लिखो जां कोई विषय चुणो।',
  'ref.notTitle': 'यह क्या नी करदी',
  'ref.not1': 'यह डॉक्टर नी ऐ। दवाई दी सलाह कदे नी दित्ती जोगी।',
  'ref.not2': 'यह वकील नी ऐ। कानूनी सलाह नी दित्ती जोगी।',
  'ref.not3': 'कोई बी पैसा नी लिया जंदा, ते कोई विज्ञापन नी दस्स्या जंदा।',
  'ref.not4': 'तुसां दा नां, पता जां फोन नंबर नी मंग्या जंदा ते नी रख्या जंदा।',
  'ref.not5': 'कोई सरकारी योजना दा दाम जां नंबर नी बणाया जंदा — सही जानकारी ना हो तां साफ आक्या जंदा ऐ की नी पता।',
  'ref.medicalTitle': 'ज़रूरी: यह डॉक्टर दी सलाह नी ऐ',
  'ref.medicalBody': 'बीमारी, दवाई जां कोई बी जहरीली चीजें कन्नै जुड़ी गल्ल होवे, तां सब थारै पैह्लै डॉक्टर कन्नै मिलो। एत्थै दित्ती गेदी जानकारी सिर्फ सामान्य मदद आस्तै ऐ। बच्चे दे टीके, गर्भावस्था, जां कोई बी दवाई शुरू करणा थारै पैह्लै डॉक्टर दी सलाह जरूर लो।',
  'ref.statsTitle': 'किन्नी जानकारी मौजूद ऐ',
  'support.howTitle': 'साडी मदद किक्कर करो',
  'support.alwaysFreeTitle': 'यह सेवा हमेशा मुफ़्त रौह्गी',
  'support.alwaysFreeBody': 'जो बी मदद मिलोगी, वह सेवा चलान च लगोगी। किसे थारै कदे पैसा नी लिया जंदा।',
  'smriti.eyebrow': 'श्रद्धांजलि',
  'smriti.whyTitle': 'यह साइट क्यों ऐ',
  'smriti.ending': 'उन्नां दा संघर्ष एत्थैई अग्गे बधांदा ऐ।',
  'article.askAny': 'कोई सवाल पुछो',
  'article.remember': 'याद रखो',
  'article.emergencyInfo': 'ज़रूरी जानकारी',
  'article.medicalTitle': 'यह चिकित्सा सलाह नी ऐ',
  'article.medicalBody': 'यह जानकारी सामान्य मदद आस्तै ऐ। कोई बी दवाई शुरू जां बंद ना करो — पैह्लै डॉक्टर कन्नै मिलो।',
  'article.heading': '{category} दे लेख',
  'reviews.rateQuestion': 'किन्ने तारे देंगै?',
  'reviews.starsShort': '{value} तारे',
  'reviews.averageOutOf': '5 चों {value} तारे',
  'dhun.welcomeTitle': 'स्वागत ऐ',
  'dhun.consent': 'शंख, बांसुरी ते नगाड़ा — कन्नै सुणण आस्तै छुओ।',
  'dhun.unsupported': 'ए ब्राउज़र आवाज़ नई चला सकदा।',
  'dhun.failedTry': 'आवाज़ चलाने च समस्या होई।',
  'sound.hintIdle': 'कोई बटन दबाओ ते आवाज़ सुनो।',
  'sound.hintPlaying': 'आवाज़ चलदी ऐ। रोकने लेई दोबारा उसी बटन गी दबाओ।',
  'sound.preparing': 'आवाज़ तैयार हो रही ऐ',
  'nav.path': 'रास्ता',
  'health.heading': 'अपनी उम्र दस्सो',
  'health.intro': 'उम्र दे हिसाब कन्नै जेहड़े सवाल अक्सर पूछे जंदे न, ओ एत्थै दिखनगे। कोई बटन दबाओ — सवाल नीचे भर जाऐगा, फेर पूछ लो।',
  'health.ageLabel': 'उम्र (साल)',
  'health.years': 'साल',
  'health.bandsLabel': 'उम्र दे हिसाब कन्नै चुनो',
  'health.notAdviceStrong': 'ए डाक्टरी सलाह नई ऐ।',
  'health.notAdvice': 'कोई बी दवाई शुरू या बंद न करो — पैह्ले डाक्टर कन्नै मिलो।',
  'health.emergencyStrong': 'आपातकाल च फोन करो:',
  'health.emergencyCall': '(आपातकाल)',
  'health.emergencyAmbulance': '(एम्बुलेंस)',
  'health.emergencyWomen': '(महिला हेल्पलाइन)',
  'health.privacy': 'कोई नां या पता लिख्ने दी लोड़ नई ऐ।',
  'health.band.infant.label': '0 – 2 साल',
  'health.band.infant.note': 'निक्के बच्चे, जेहड़े अभी अपनी गल्ल नई दस्स सकदे',
  'health.c.infant1': 'तेज़ बुखार',
  'health.q.infant1': 'मेरे बच्चे गी तेज़ बुखार ऐ, क्या दुध दियूं?',
  'health.c.infant2': 'रोटी नई खांदा',
  'health.q.infant2': 'निक्का बच्चा रोटी नई खांदा, क्या करां?',
  'health.c.infant3': 'उल्टियां हो रही न',
  'health.q.infant3': 'बच्चे गी उल्टियां हो रही न, कद्दू डाक्टर गी दिखाऊं?',
  'health.c.infant4': 'दस्त हो रहे न',
  'health.q.infant4': 'बच्चे गी दस्त हो रहे न, क्या खिलाऊं?',
  'health.band.child.label': '3 – 12 साल',
  'health.band.child.note': 'बच्चे जेहड़े बोल सकदे न, पर सवाल पुछने कन्नै डरदे न',
  'health.c.child1': 'पढ़ाई च मन नई',
  'health.q.child1': 'बच्चे दा पढ़ाई च मन नई लगदा, क्या करां?',
  'health.c.child2': 'स्कूल जाने थमां मना करदा',
  'health.q.child2': 'बच्चा रोज़ स्कूल जाने थमां मना करदा ऐ, कारण क्या हो सकदा ऐ?',
  'health.c.child3': 'रात च बुखार',
  'health.q.child3': 'बच्चे गी रात च बुखार औंदा ऐ, क्या करां?',
  'health.c.child4': 'दंद टूट रहे न',
  'health.q.child4': 'बच्चे दे दंद टूट रहे न, दंदां दी देखभाल कियां करां?',
  'health.band.teen.label': '13 – 17 साल',
  'health.band.teen.note': 'किशोर, जिनेंगी अक्सर कोई ऐसा बंदा नई मिलदा जेहड़ा सुन ले',
  'health.c.teen1': 'पढ़ाई दा दबाव',
  'health.q.teen1': 'पढ़ाई दा बड़ा दबाव ऐ, एदा सामना कियां करां?',
  'health.c.teen2': 'नींद नई औंदी',
  'health.q.teen2': 'रात गी नींद ठीक कन्नै नई औंदी, क्या करां?',
  'health.c.teen3': 'मोबाइल दी लत',
  'health.q.teen3': 'मोबाइल दी लत लग गई ऐ, छड्डने दा तरीका दस्सो।',
  'health.c.teen4': 'बड़ी उदासी',
  'health.q.teen4': 'बड़ी उदासी महसूस होंदी ऐ, कदे कन्नै गल्ल करां?',
  'health.band.young.label': '18 – 30 साल',
  'health.band.young.note': 'नौकरी, पैसा ते नींद — तिनें दा इकठ्ठा बोझ',
  'health.c.young1': 'कम्म दा तनाव',
  'health.q.young1': 'कम्म दा तनाव बड़ा ज्यादा ऐ, कियां घट्ट करां?',
  'health.c.young2': 'बैहने कन्नै पीठ दर्द',
  'health.q.young2': 'बैहने कन्नै पीठ च दर्द हो रहा ऐ, क्या करां?',
  'health.c.young3': 'नींद नई औंदी',
  'health.q.young3': 'रातै नींद नेईं आंदी, की उपाय ऐ?',
  'health.c.young4': 'पैसे घट्ट न',
  'health.q.young4': 'पैसे घट्ट न ते खर्चे बधे, मैं की करां?',
  'health.band.middle.label': '31 – 45 साल',
  'health.band.middle.note': 'घर, बच्चे ते अपनी सेहत — सब दी जिम्मेदारी इकट्ठी',
  'health.c.middle1': 'कमर च दर्द',
  'health.q.middle1': 'कमर च दर्द होइ रया ऐ, कारण की होइ सकदा ऐ?',
  'health.c.middle2': 'नींद ठीक नेईं',
  'health.q.middle2': 'नींद ठीक नेईं आ रही, सुधारने दा की उपाय ऐ?',
  'health.c.middle3': 'घर दा तनाव',
  'health.q.middle3': 'घर दा तनाव बड़ा ऐ, बच्चें गी कश्मी संभालूं?',
  'health.c.middle4': 'पेट च गैस',
  'health.q.middle4': 'कम्म उप्पर कइयां बर्सें थमां पेट च गैस दी समस्या ऐ, की करां?',
  'health.band.later.label': '46 – 60 साल',
  'health.band.later.note': 'शरीर दी उम्र ते ओदी देखभाल — दोंह इकट्ठे',
  'health.c.later1': 'पीठ च दर्द',
  'health.q.later1': 'मेरी उम्र 54 साल ऐ ते मेरी पीठ च दर्द ऐ, की करां?',
  'health.c.later2': 'घुटने च दर्द',
  'health.q.later2': 'चढ़ने उप्पर घुटने च दर्द होइ रया ऐ, क्यों?',
  'health.c.later3': 'रातै पैर च खिंचाव',
  'health.q.later3': 'रातै पैर च खिंचाव (ऐंठन) होंदी ऐ, की करां?',
  'health.c.later4': 'सवेरे जकड़न',
  'health.q.later4': 'सवेरे उठने उप्पर कमर च जकड़न होंदी ऐ, कारण की होइ सकदा ऐ?',
  'health.band.senior.label': '61 – 75 साल',
  'health.band.senior.note': 'दवाई, संतुलन ते अकेलापन — तिनें इकट्ठे',
  'health.c.senior1': 'चलने च तकलीफ',
  'health.q.senior1': 'घुटने च इत्ना दर्द ऐ कि चलना मुशकिल ऐ, की करां?',
  'health.c.senior2': 'दवाई दी जांच',
  'health.q.senior2': 'कइयां दवाइयां रोज खानी पैंदी न — कश्मी पता चलग कि केहड़ी नुकसानदेह ऐ?',
  'health.c.senior3': 'रातै पेशाब',
  'health.q.senior3': 'रातै बार-बार पेशाब दी दिक्कत ऐ, की करां?',
  'health.c.senior4': 'सुणने च घट्ट',
  'health.q.senior4': 'घट्ट सुणदा ऐ, सुणने दा कोई उपाय दस्सो।',
  'health.band.elder.label': '76 – 100 साल',
  'health.band.elder.note': 'हर दवाई दी जांच जरूरी, हर डिगना गंभीर',
  'health.c.elder1': 'डिगने दा डर',
  'health.q.elder1': 'घर च डिगने दा डर ऐ, केहड़ी सुरक्षा रक्खां?',
  'health.c.elder2': 'याददाश्त कमजोर',
  'health.q.elder2': 'याददाश्त कमजोर होइ रही ऐ, की उपाय ऐ?',
  'health.c.elder3': 'रोज दी दर्द-दवाई',
  'health.q.elder3': 'दर्द दी दवाई रोज खानी पैंदी ऐ — की एदा कोई नुकसान ऐ?',
  'health.c.elder4': 'कद्द डॉक्टर दे कोल',
  'health.q.elder4': 'कद्द डॉक्टर दे कोल जाना जरूरी ऐ?',
  'ask.notConfigured': 'ए सेवा अज्जै अपने पुराने जवाबें दे बंद दराज थमां जवाब दे रही ऐ। तुंदा सवाल ओदे च नेईं मिलिया।',
  'ask.browseTitle': 'एत्थे जेहड़े लेख न, ओ देखो',
  'download.pdf': 'PDF च लिखो',
  'download.text': 'टेक्स्ट च लिखो',
  'download.printNow': 'प्रिंट करो',
  'download.preparing': 'तैयार होइ रया ऐ',
  'download.blocked': 'नवां टैब नेईं खुलिया। Pop-up ब्लॉक होइ रया ऐ — अपने ब्राउज़र च अलग टैब खोलो।',
  'attach.button': 'अपना दस्तावेज या फोटो जोड़ो',
  'attach.formats': 'PDF, फोटो (JPG/PNG) या टेक्स्ट फाइल — 12 MB तकर',
  'attach.reading': 'पढ़ रया ऐ…',
  'attach.attached': 'ला दित्ता',
  'attach.remove': 'हटाओ',
  'attach.tooBigPdf': 'एह PDF 12 MB थमां बड्डी ऐ। कोई छोटी फाइल चुनो।',
  'attach.tooBigImage': 'एह फोटो 3 MB थमां बड्डी ऐ। कोई छोटी फोटो चुनो।',
  'attach.scannedPdf': 'एह PDF स्कैन कीती होई ऐ — एदे च सिर्फ फोटो ऐ, पढ़ी नी जा सकदी। एदी फोटो भेजो।',
  'attach.pdfFailed': 'एह PDF पढ़ी नी जा सकी।',
  'attach.imageFailed': 'एह फोटो लोड नी होई।',
  'attach.wrongType': 'एह फाइल नी चलग। PDF, फोटो या टेक्स्ट फाइल भेजो।',
  'attach.hint': 'अपना कागज़ एत्थै लाओ ते सवाल पुच्छो — असीं ओदे थमां जवाब दियेंगे।',
  'ask.sendWithFile': 'जवाब चाहिदा',
  'lib.title': 'मुफ्त पुस्तकालय',
  'lib.intro': 'पढ़ाई दीयां किताबें, तस्वीरें ते ऑडियो — सब मुफ्त ते कानूनी तौर पर।',
  'lib.legalTitle': 'कॉपीराइट दा कोई झंझट नी।',
  'lib.legal': 'एत्थै जेहड़ा कुछ दित्ता गया ऐ, ओ बिल्कुल मुफ्त ऐ ते तुस एह्‌ने अग्गे बी बंड सकदे ओ। जेहड़ी किताब इसलै कॉपीराइट च ऐ, ओ एत्थै नी होग — ओह्‌ तुस कॉपी नी कर सकदे, एह्‌ साफ कहना जरूरी ऐ।',
  'ask.signInFirst': 'पैहलें लॉग इन करो, फेर सवाल पुच्छो।',
  'ask.signInTitle': 'पैहलें लॉग इन करो',
  'ask.signInBody': 'सवाल पुच्छने लेई अपना खाता बनाओ। एदे च इक मिनट थमां बी घट्ट लगदा ऐ, ते तुस पुच्छदे रहोगे।',
  'ask.signInCta': 'खाता बनाओ या लॉग इन करो',
  'ask.signInOr': 'इसलै खाता नी बना सकदे? एह्‌ कम्म बी तुहाडे बिना हो जाग:',
  'account.title': 'मेरा खाता',
  'account.intro': 'अपना नां ते पासवर्ड पाकर सवाल पुच्छना शुरू करो।',
  'account.signIn': 'दाखिल होओ',
  'account.register': 'खाता बनाओ',
  'account.signInNote': 'पिछली बार दा नां ते पासवर्ड पाओ।',
  'account.registerNote': 'सवाल पुच्छने लेई खाता जरूरी नी। एह्‌ सिर्फ तुहाडी भाषा ते जवाब याद रखने लेई ऐ।',
  'account.handle': 'तुहाडा नां',
  'account.handlePlaceholder': 'जियां: sita.ji',
  'account.password': 'पासवर्ड',
  'account.passwordHint': 'घट्ट थमां घट्ट 6 अक्षर।',
  'account.phone': 'फोन नंबर',
  'account.optional': 'जरूरी नी',
  'account.phoneHint': 'देना चाहो तां दियो। कोई फोन नंबर नी बी दित्ता तां बी खाता बन जाग।',
  'account.create': 'खाता बनाओ',
  'account.logout': 'बाहर निकलो',
  'account.open': 'खाता खोलो',
  'account.signedInAs': 'तुस लॉग इन ओ',
  'account.signedOut': 'खाता नी खुल्या',
  'account.signedOutBody': 'इसलै कोई खाता नी खुल्या ऐ।',
  'account.saved': 'जमा कीते जवाब',
  'account.savedEmpty': 'इसलै कोई जवाब जमा नी ऐ। जवाब आने पर \'जमा करो\' दबाओ।',
  'account.savedUnavailable': 'जमा जवाब इसलै नी दिखदे पए। बाकी सब चलदा पया ऐ।',
  'account.wait': 'कृपया प्रतीक्षा करो…',
  'account.privacyTitle': 'तुहाडी गल्ल-बात सुरक्षित',
  'account.privacyBody': 'खाता बनाने पर सिर्फ तुहाडा नां, पासवर्ड ते भाषा रखी जंदी ऐ। सवाल दा कोई रिकॉर्ड नी बणदा। तुहाडे सवाल किसे होर गी नी भेजे जंदे।',
  'account.errWrong': 'नां या पासवर्ड गलत ऐ।',
  'account.errTaken': 'एह नां पैहलें ई ले लिया गया ऐ। दूजा नां चुनो।',
  'account.errBad': 'जानकारी ठीक तरीके कन्नै भरो।',
  'account.errWait': 'बहुत कोशिश हो गई। थोड़ी देर बाद कोशिश करो।',
  'account.errTryLater': 'इसलै नी होइया। कुछ देर बाद कोशिश करो।',
  'lib.licence.ccBy': 'तुस एह्‌ कॉपी ते शेयर कर सकदे ओ, छाप बी सकदे ओ — बस स्रोत दा नां देना होग।',
  'lib.licence.ccBySa': 'तुस एह्‌ कॉपी ते छाप सकदे ओ। जेहड़े बदलाव करोगे, ओ बी खुल के देने पैने।',
  'lib.licence.ccZero': 'पूरी तरह मुफ्त। स्रोत दा नां देना बी जरूरी नी।',
  'lib.licence.pd': 'किसे दा कॉपीराइट नी — जेहड़ा चाहे कॉपी कर सकदा ऐ।',
  'lib.licence.govtIndia': 'भारत सरकार दी वेबसाइट पर। पढ़ना ते छापना दोंवें मुफ्त।',
  'lib.licence.creativeCommons': 'हर फाइल दा अपना लाइसेंस ऐ — फाइल पर देखो।',
  'lib.licence.freeToRead': 'पढ़ना मुफ्त ऐ। कॉपी करके अग्गे देना बी उसी शर्त पर ऐ जिस पर एह्‌ मिल्या ऐ।',
  'lib.openBadge': 'खुल्ला',
  'lib.openBadgeNote': 'एह् कापी करी सकदे ओ',
  'lib.freeBadge': 'मुफ्त',
  'lib.freeBadgeNote': 'पढ़ सकदे ओ, कापी नी',
  'lib.govt': 'सरकारी',
  'lib.noSignup': 'बिना खाते दे',
  'lib.open': 'एत्थै खोलो',
  'lib.group.padhai': 'पढ़ाई दीयां किताबें',
  'lib.group.padhai.note': 'स्कूल, कालेज ते सरकारी शिक्षा सामग्री',
  'lib.group.kitab': 'किताबें',
  'lib.group.kitab.note': 'जेह्नां पर कापीराइट नी ऐ या जेह्नां गी कापी करने दी इजाजत ऐ',
  'lib.group.tasveer': 'तस्वीरें ते चित्र',
  'lib.group.tasveer.note': 'नक्शे, तस्वीरें, निशानियां — सब कुछ',
  'lib.group.audio': 'सुनने आली सामग्री',
  'lib.group.audio.note': 'किताबें सुनके, बड्डे अखरें च नी',
  'lib.warnTitle': 'हर किताब एत्थै नी ऐ',
  'lib.warn': 'VARSHA SAMADHAN AI',
  'lib.askInstead': 'सवाल पुच्छो',
  'nav.library': 'पुस्तकालय',
  'support.contactMessageLabel': 'तहाड़ी गल्ल',
  'support.contactPlaceholder': 'जेह्ड़ा लिखना ऐ ओई लिखो — गलती होए तां, कुझ चंगा मिल्या होए तां, या कोई सवाल होए।',
  'support.contactHelp': 'घट्टो-घट्ट 10 अखर। ए सीधा मालिक दे कोल जांदा ऐ।',
  'support.contactSubmit': 'भेजो',
  'support.contactSending': 'भेज रहे आं…',
  'support.contactPrivacy': 'तहाड़ा नां लिखना जरूरी नी ऐ।',
  'support.contactSent': 'पुज्ज गया',
  'support.contactSentBody': 'तहाड़ी गल्ल मालिक तकर पुज्ज गई ऐ।',
  'support.contactFailed': 'नी भेजा जा सक्या',
  'support.faq1Q': 'क्या ए सचमुच मुफ्त ऐ?',
  'support.faq1A': 'हां। कोई पैसा नी लित्ता जांदा, कोई विज्ञापन नी दिक़दा, ते कोई सदस्यता नी लित्ती जांदी। ए इक बंदे दे पैसे कन्नै चलदी ऐ, किसी कंपनी या सरकार दे पैसे कन्नै नी।',
  'support.faq2Q': 'क्या मेरा नां, पता या फोन नंबर लित्ता जांदा ऐ?',
  'support.faq2A': 'नी, ते ए कदे नी लित्ता जाग। ए साइट अपने आप च कोई पहचान नी बनांदी — कोई लॉगिन नी, कोई ट्रैकिंग स्क्रिप्ट नी। जेह्ड़ा पुच्छ्या जांदा ऐ ओ सिर्फ तहाड़ा सवाल ऐ ते जदों तहाड़ा जवाब औंदा ऐ।',
  'support.faq3Q': 'क्या ए डॉक्टर या वकील ऐ?',
  'support.faq3A': 'नी। ए कोई दवाई दी सलाह नी दिंदी ते न कोई कानूनी सलाह। जत्थै गल्ल गंभीर होंदी ऐ उत्थै ए तहाने डॉक्टर या अफसर दे कोल जाने दी सलाह दिंदी ऐ — ए उंदे दी जगह नी लेंदी।',
  'support.faq4Q': 'क्या हर जवाब सही होंदा ऐ?',
  'support.faq4A': 'हमेशा नी। जवाब इक कंप्यूटर लिखदा ऐ, कोई डॉक्टर नी — इसलै हर जवाब दे कन्नै ए लिख्या ऐ कि ए चिकित्सा सलाह नी ऐ। कोई दवाई शुरू करने या बंद करने तूं पैह्ले डॉक्टर कन्नै जरूर मिलो।',
  'support.faq5Q': 'क्या मने कोई ऐप डाउनलोड करना पैग?',
  'support.faq5A': 'नी। ए सिर्फ ब्राउज़र च खुलदी ऐ। कोई ऐप इंस्टॉल नी, कोई अनुमति नी, कोई अपडेट नी।',
  'nav.remedies': 'घरेलू उपचार',
  'remedy.title': 'आयुर्वेदिक घरेलू उपचार',
  'remedy.intro': 'जेह्ड़ी बी तकलीफ होए — खांघ, सिरदर्द, गठिया, खाज-खुजली, मधुमेह, पीठ दर्द — थल्ले अपनी तकलीफ चुनो या अपने शब्दें च पुच्छो। घरेलू काढ़ा, मालिश, खान-पान ते आयुर्वेदिक उपाय दस्से जाग।',
  'remedy.choose': 'अपनी तकलीफ चुनो',
  'remedy.emergencyStrong': 'ए आपातकाल न:',
  'remedy.emergency': 'सप्प दा डंगना, बिच्छू दा डंग ते कुत्ते दा कटना — फौरन अस्पताल जाओ, पैह्ले 112 पर फोन करो। घरेलू उपाय सिर्फ रस्ते च करने लेई न, अस्पताल दी जगह नी।',
  'remedy.note': 'घरेलू ते आयुर्वेदिक उपाय तकलीफ घट्ट करने च मदद करदे न; ए डॉक्टर दी जांच ते इलाज दी जगह नी न। कोई दवाई अपने आप बंद या शुरू न करो।',
  'remedy.cough': 'खांघ',
  'remedy.headache': 'सिरदर्द',
  'remedy.joints': 'गठिया',
  'remedy.itching': 'खाज-खुजली',
  'remedy.snake': 'सप्प दा डंगना',
  'remedy.scorpion': 'बिच्छू दा डंग',
  'remedy.dog': 'कुत्ते दा कटना',
  'remedy.diabetes': 'मधुमेह',
  'remedy.back': 'पीठ दर्द',
  'remedy.walking': 'चलने च तकलीफ',
  'home.remedyNote': 'काढ़ा, मालिश, खान-पान ते आयुर्वेदिक उपाय — हर तकलीफ लेई, तहाड़ी भाषा च।',
  'nav.aarti': 'आरती ते भजन',
  'aarti.title': 'आरती ते भजन — असली आवाज़ च',
  'aarti.intro': 'इत्थूँ आरती, कीर्तन ते भजन सुणो — असली गायिकां ते मंदिरां दी आवाज़ च। कोई AI आवाज़ नी।',
  'aarti.note': 'आरती जां भजन कंप्यूटर दी आवाज़ च सुणाना उसदी चाल ते भक्ति कन्न खिलवाड़ ऐ। इलै इत्थूँ सिर्फ़ असली रिकॉर्डिंग न्‍हैन।',
  'aarti.kindAarti': 'आरती',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रिकॉर्डिंग:',
  'aarti.licence': 'लाइसेंस:',
  'aarti.listenLink': 'असली आवाज़ च सुणो',
  'aarti.textChecked': 'यह पारंपरिक पाठ ऐ, जिਦ્దాਂ असली रिकॉर्डिंग च गाया गेआ ऐ।',
  'aarti.textPrinted': 'यह प्रचलित पाठ ऐ, छपे हुए संग्रहां कन्न मिलाई करी जाँच्या गेआ ऐ।',
  'aarti.textNotStored': 'इस ग्रंथ दा पूरा पाठ इत्थूँ संग्रहीत नी ऐ — थल्ले रिकॉर्डिंग च पूरा पाठ चलदा ऐ।',
  'aarti.granthTitle': 'ग्रंथ, चालीसा ते स्तोत्र — असली आवाज़ च',
  'aarti.noRecording': 'इस आरती दी असली रिकॉर्डिंग हने साईट उप्पर नी ऐ, एह्दी ला कन्नी मैं इकुਹूँ गाई करी नी सुणा सकदा — AI आवाज़ च आरती कदे नी गांदी।',
  'aarti.textOnlyTitle': 'होरो आरती — पाठ बी, असली आवाज़ बी',
  'aarti.fullText': 'पूरा पाठ',
  'aarti.notChecked': 'इस आरती दा जाँच्या दा पाठ हने साईट उप्पर नी ऐ। बिना जाँचे दा पाठ देना ठीक नी, एह्दी ला ओह् नी दिता जाँदा।',
  'aarti.verifiedList': 'साइट उप्पर इनें आरतियां दा जाँच्या दा पाठ है:',

};

/* -------------------------------------------------------------------------- */
/* BODO                                                                      */
/* -------------------------------------------------------------------------- */

const BODO: Record<string, string> = {
  'jgd.placeSearch': 'नोगोरनि मुंखा लिर',
  'jgd.placeNoMatch': 'बे नोगोरा फराइसालियाव गैया। बेनिनि खाथिनि नोगोरखौ सायख।',
  'account.name': 'नोंनि मुं',
  'account.namePlaceholder': 'जेरै: सिता देबि',
  'account.nameHint': 'बेया नोंखौ सिनायथिनो थाखाय। जेखुनु मुं लिरनो हागौ, बेखौ लिरनाया गोनांथि नङा।',
  'nav.home': 'गृह',
  'home.metaTitle': 'गोनां मावफुंथाइ, नोंथांनि गावनि रावजों',
  'lib.licence.ccZero.name': 'CC0 / राइजोनि सम्पति',
  'lib.licence.pd.name': 'राइजोनि सम्पति',
  'lib.licence.govtIndia.name': 'भारत सरकार',
  'lib.licence.creativeCommons.name': 'क्रिएटिव कमन्स (मिस्त्रित)',
  'lib.licence.freeToRead.name': 'फरायनाया उदां',
  'lib.entry.ncert.title': 'NCERT फराय बिजाब — क्लास 1 निफ्राय 12 सिम',
  'lib.entry.ncert.what': 'गासै आयदानि गासै फराय बिजाब, दानिया गासै क्लासनि थाखाय। लगइन गैया, सिधा PDF।',
  'lib.entry.ncert.langs': 'हिंदी, इंराजि आरो 30 नि बांसिन भारतनि रावफोर',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — डिजिटल फराय बिजाब',
  'lib.entry.pm-evidya.what': 'NCERT नि फराय बिजाबनि एप, गेदेर आखरजों फरायना हागौ। खोनासंनोबो हागौ।',
  'lib.entry.pm-evidya.langs': 'भारतनि रावफोर',
  'lib.entry.diksha.title': 'DIKSHA — फरायसा आरो फरायगिरिफोरनि थाखाय',
  'lib.entry.diksha.what': 'सिलिबास, भिडिअ आरो फरायनाय — क्लास 1 निफ्राय 12 सिम।',
  'lib.entry.diksha.langs': 'भारतनि रावफोर',
  'lib.entry.khan-academy.title': 'Khan Academy — इंराजि रावजों गनित आरो बिग्यान',
  'lib.entry.khan-academy.what': 'भिडिअ फरायनाय, गासै क्लासनि थाखाय। सिधा फरायग्राफोरनि थाखाय लिरनायबो दं।',
  'lib.entry.openstax.title': 'OpenStax — इंराजि रावजों उदां फराय बिजाब',
  'lib.entry.openstax.what': 'कलेज लेबेलनि फराय बिजाब — गनित, बिग्यान, मानबिकि। गासै फरायसालियाव PDF।',
  'lib.entry.nios.title': 'NIOS — गोजान फरायनाय, उदां सामग्री',
  'lib.entry.nios.what': 'ओपेन आरो अनलाइन कोर्सनि उदां फराय बिजाब, भर्ति जानायनि गोनांथि गैया।',
  'lib.entry.nios.langs': 'हिंदी, इंराजि आरो गुबुनफोर',
  'lib.entry.ignou.title': 'IGNOU — गेदेर फरायसालिनि उदां फराय बिजाब',
  'lib.entry.ignou.what': 'गोजान फरायनायनि फराय बिजाब जायखौ जोबोद उदां मोनो।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — इंराजि रावनि पुराना फराय बिजाब',
  'lib.entry.gutenberg.what': '70,000 नि बांसिन फराय बिजाब, गासैबो कपीराइट गैया। उदां इ-बुक आरो अडिअ।',
  'lib.entry.pratham-books.title': 'Pratham Books — गथ\'फोरनि फराय बिजाब',
  'lib.entry.pratham-books.what': 'भारतनि रावफोराव गथ\'फोरनि फराय बिजाब, जोबोद उदां। क्लास 1 निफ्राय 5 सिम।',
  'lib.entry.pratham-books.langs': 'हिंदी, मराठी, बंगाली, तामिल, तेलिगु आरो गुबुनफोर',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — खौरां बिलाइ आरो पुराना म्यागाजिन',
  'lib.entry.internet-archive-texts.what': 'लाख लाख पुराना फराय बिजाब, म्यागाजिन आरो खौरां बिलाइ — उदां।',
  'lib.entry.wikisource.title': 'Wikisource — राइजोनि फरायनाय',
  'lib.entry.wikisource.what': 'कपीराइट गैया — बेफोर गासै राइजोनि पुराना साहित्य फराय बिजाब।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — गासै सावगारिफोर',
  'lib.entry.wikimedia-commons.what': 'उपजाति, नक्सा, तारा, इतिहास — गासैबो। गासै सावगारियावनो आलादा लाइसेन्स लिरनाय दं।',
  'lib.entry.pixabay.title': 'Pixabay — सावगारि आरो चित्र',
  'lib.entry.pixabay.what': 'सावगारि, रेखाचित्र आरो फिसा भिडिअ।',
  'lib.entry.unsplash.title': 'Unsplash — मोजां सावगारिफोर',
  'lib.entry.unsplash.what': 'उदां, गेदेर आखर, एकाउन्ट गैया।',
  'lib.entry.openverse.title': 'Openverse — गासै सावगारिफोर मोनसे जायगायाव',
  'lib.entry.openverse.what': 'गोबां उदां सावगारि साइटखौ मोनसेयावनो नागिर।',
  'lib.entry.librivox.title': 'LibriVox — खोनासंनो हानाय फराय बिजाब',
  'lib.entry.librivox.what': 'पुराना इंराजि फराय बिजाबनि उदां अडिअ, सुबुंनि मेथाइजों।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — अडिअ संग्रह',
  'lib.entry.internet-archive-audio.what': 'हजारनि बांसिन उदां अडिअ — फराय बिजाब, बाथ्रा, मेथाइ।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — राइजोनि मेथाइ',
  'lib.entry.vande-mataram.what': 'भारतनि राइजोनि मेथाइ आरो गुबुन राइजोनि मेथाइफोर, उदां।',
  'art.aag-aur-bijli-ke-bachav.title': 'आग आरो बिजुलिनिफ्राय रैखाथि मोननायनि नेम',
  'art.aag-aur-bijli-ke-bachav.summary': 'नआव आग लांनायनिफ्राय रैखाथि — गोरलै नेम',
  'art.aag-lagne-par-kya-karein.title': 'आग लांब्ला मा खालामनांगौ',
  'art.aag-lagne-par-kya-karein.summary': 'जलायनाय नआव आग — गिबियाव मा खालामनांगौ, मा खालामनाङा',
  'art.bimari-se-bachav.title': 'सान्द्रायनिफ्राय रैखाथि थानायनि गुइ नियम',
  'art.bimari-se-bachav.summary': 'सावगारि होनाय, मास्क, टिका — बायदिजों रैखाथि',
  'art.dhuwan-ka-jhakora.title': 'मुंफ्रुनि खुंथाइनिफ्राय रैखाथि',
  'art.dhuwan-ka-jhakora.summary': 'मुंफ्रु, सास लांनो हायाखै — मा खालामनांगोन, माब्ला हस्पिटालाव थांनांगोन',
  'art.doodh-pani-band-ho.title': 'विजुली एबा दै गोथारै बन्द जाब्ला',
  'art.doodh-pani-band-ho.summary': 'मा खालामनांगोन, nisim-ni nibe, maब्ला मदद नागिरनांगोन',
  'art.haath-ki-saafai.title': 'साबुन गैयैिफलै आखाइ थार खालामनायनि राहा',
  'art.haath-ki-saafai.summary': 'जेब्ला दै एबा साबुन थानाय जाया',
  'cat.dhyan-aur-yoog.title': 'थियान आरो योग',
  'cat.dhyan-aur-yoog.subtitle': 'मुंदांखा गोजोन खालामनायनि फुंखा राहा',
  'cat.gharelu-marammat.title': 'नोगरनि खामि',
  'cat.gharelu-marammat.subtitle': 'नोगरनि फिसा फिसा समस्याफोरनि सुस्रां',
  'cat.bachchon-ki-padhai.title': 'गथाइफोरनि फरायनाय',
  'cat.bachchon-ki-padhai.subtitle': 'फरायनायाव गोनांथि, दुखु मोननाय',
  'cat.budharge-seva.title': 'बैसो गोनांफोरनि सिबिनाय',
  'cat.budharge-seva.subtitle': 'हाथाय-हुथाय आरो हेफाजाब',
  'cat.shishu-dekhbhal.title': 'गथ\'नि जथोन',
  'cat.shishu-dekhbhal.subtitle': 'फिसा गथ\'नि थार जथोन',
  'cat.dharmik-upay.title': 'धार्मिक राहा',
  'cat.dharmik-upay.subtitle': 'मोनसे गोसोनि गोजोनजों',
  'cat.pavan-grah-aur-aarti.title': 'गेदेर फरायनाय आरो आरति',
  'cat.pavan-grah-aur-aarti.subtitle': 'अनजालिजों फराय आरो खोनासं',
  'cat.aapatkalen-gayide.title': 'आपातकालिन गाईड',
  'cat.aapatkalen-gayide.subtitle': 'जेब्ला थाबैनो हेफाजाब नांगौ',
  'cat.mahamari-suraksha.title': 'महामारी रैखाथि',
  'cat.mahamari-suraksha.subtitle': 'बेरामनिफ्राय रैखाथि',
  'nav.tribute': 'सोरिथि',
  'nav.help': 'हेफाजाब',
  'nav.reference': 'फरमान',
  'nav.reviews': 'मंतब्य',
  'nav.support': 'हेफाजाब हो',
  'nav.birthChart': 'जायखोनथि',
  'jgd.title': 'नोंनि जायखोनथि',
  'jgd.intro': 'नोंनि मुं, जोनोमनि तारिख, आरो जुदि हायोब्ला जोनोमनि समा आरो जायगाखौ लिर। गासै हिसाबखौ नोंनि फनावसो खालामगोन — माबोरैबो बेखौ सोरनोबो दैथाय हरनाय नङा।',
  'jgd.nameLabel': 'जोनोमनि मुं',
  'jgd.namePlaceholder': 'जेरै गासै मुं',
  'jgd.nameHint': 'गथ\' समाव होखानाय मुंलखौनो लिर।',
  'jgd.dateLabel': 'जोनोमनि तारिख',
  'jgd.timeLabel': 'जोनोमनि समा',
  'jgd.timeHint': 'जुदि मिथियाब्ला खाली दोन।',
  'jgd.placeLabel': 'जोनोमनि जायगा',
  'jgd.placeNone': 'मिथिया / सायख\'',
  'jgd.placeHint': 'जोनोमनि नोगोरखौ सायख\'।',
  'jgd.submit': 'हिसाब खालाम',
  'jgd.savePdf': 'PDF बानाय',
  'jgd.again': 'गोदान हिसाब',
  'jgd.errDate': 'अनग्रनानै जोनोमनि तारिखखौ थारै लिर।',
  'jgd.errPlace': 'जोनोमनि नोगोरखौ फारिलाइनिफ्राय सायख\', एबा बेनिनो खाथिनि नोगोरखौ सायख\'।',
  'jgd.numTitle': 'अनख\' ज्योतिष',
  'jgd.lifePath': 'जिवन लामा',
  'jgd.nameNumber': 'मुंनि अनख\'',
  'jgd.soulNumber': 'आत्मा अनख\'',
  'jgd.birthdayNumber': 'जोनोम साननि अनख\'',
  'jgd.astroTitle': 'बैदिक ज्योतिष',
  'jgd.nakshatra': 'नक्षत्र',
  'jgd.pada': 'थाखो',
  'jgd.rashi': 'रासि',
  'jgd.rashiLord': 'रासि मालिक',
  'jgd.nakshatraLord': 'नक्षत्र मालिक',
  'jgd.lagna': 'लगन',
  'jgd.lagnaMissing': 'लगन दिहुनोनो थाखाय जोनोमनि समा आरो जायगा नांगौ। सायाव फराफ फनानै हिसाब खालाम, आरो जुदि मिथियाब्ला बेसेबांआनो जाबाय।',
  'jgd.gunTitle': 'गुन मिलान',
  'jgd.gunIntro': 'गुबुन सुबुंनि मुं आरो जोनोम तारिखखौ फराफ फनाय।',
  'jgd.gunName': 'बिनि मुं',
  'jgd.gunDate': 'बिनि जोनोम तारिख',
  'jgd.gunHint': 'नैयैबो सुबुंनि मुं आरो जोनोम तारिख थायोब्लासो गुन मिलानखौ मोनगोन।',
  'jgd.disclaimer': 'बेयो खान्थिनि बायदि हिसाब खालामनायसो, बिथांथि नङा। माबोरैबा अनजिमा एबा रासिया सोरनिबा देहा, रां एबा सोमोन्दोखौ थि खालामना हायो। गेदेर सिध्दान्तखौ डाक्टर, आइननि सल्लाह एबा बिजिरगिरिनि सल्लाह लानानै ला।',
  'nav.menu': 'मेनु',
  'nav.openMenu': 'मेनु खेव',
  'nav.closeMenu': 'मेनु बन्द खालाम',
  'nav.expand': 'खेव',
  'nav.collapse': 'बन्द खालाम',
  'nav.skip': 'सिधा आयदायाव थां',
  'nav.language': 'राव सोलाय',
  'footer.pages': 'बिलाइ',
  'footer.helplines': 'नांगौ नाम्बार',
  'footer.free': 'बे सेवाया जोबोद फ्रि। सोरनिबाफ्रायबो रां लानाय जाया।',
  'footer.readStory': 'बिसोरनि गासै खौरां फरा',
  'footer.admin': 'प्रबन्धक',
  'footer.rights': 'फ्रि सेवा',
  'footer.emergency': 'आपातकाल',
  'footer.ambulance': 'एम्बुलेन्स',
  'footer.women': 'मिजिं होग्रा हेल्पलाइन',
  'home.dedication1': 'नि सानथौआव — मोनसे जोबोद फ्रि सेवा।',
  'home.dedication2': 'नोंनि समस्याखौ लिर एबा बुं।',
  'home.emergencyTitle': 'नांगौ — थाबैनो मदद नांगौ',
  'home.emergencyNote': 'बेखौ सिगां फरा। गुबुनखौ उनाव नुनाय जागोन।',
  'home.readMore': 'गासै खौरां फरा',
  'home.chooseTopic': 'मा आयदानि सोमोन्दै मिथिनो नांगौ?',
  'home.memorialEyebrow': 'बे साइटआ सोरनि थाखाय',
  'home.memorialLine': 'जायफोरा समाजनि थाखाय जिउ गोबां नाजादोंमोन, आरो जायफोरा जोबनायाव गावनि बाहागोखौ मोनथाराखैमोन।',
  'home.memorialMore': 'बिसोरनि गासै खौरां फरा',
  'home.kundaliTitle': 'जोनोम कुण्डलि',
  'home.kundaliNote': 'गासै कुण्डलि — 9 ग्रह, बिमशोत्तरी दशा, फलादेश, योग, शोडशवर्ग, केपी, लाल किताब आरो अनजिमा ज्योतिष। गासैखौबो नोंनि फनाव हिसाब खालामनाय जागोन।',
  'home.chooseTopicNote': 'गाहायाव होनाय आयदायाव थु। गासै जायगायावनो गोरलै रावजों खौरां होनाय दं।',
  'home.askHere': 'बे आयदानि सोमोन्दै सों',
  'home.categoryEmpty': 'बे आयदानि सोमोन्दै दासिम माब्लाबो लिरनाय जायाखै।',
  'home.soundTitle': 'गोजोननि थाखाय खौरां',
  'home.soundIntro': 'माब्लाबो रां नाङा, माब्लाबो विज्ञापन गैया। गोसोखौ गोजोन खालामनो थाखाय।',
  'home.howTitle': 'बे सेवाया माबोरै खामानि मावो',
  'home.step1Title': 'नोंनि बाथ्राखौ लिर एबा बुं',
  'home.step1Body': 'टाइप खालाम, एबा माइकखौ थुनानै बुं। माब्लाबो गोनांथि गैया — गोसोआव थानायखौ लिर।',
  'home.step2Title': 'थाबैनो फिननाय मोनगोन',
  'home.step2Body': 'गासै सोंथिया रेकर्ड जायो आरो फिननायखौ थाबैनो मोनगोन। गोबां गोलाव सोंथिनि सिगां गोरलै सोंथिनिफ्राय जागाय।',
  'home.step3Title': 'रां नाङा, माब्लाबो ब्यक्तिगत खौरां नाङा',
  'home.step3Body': 'बे सेवाया जोबोद फ्रि। नोंनि मुं, थि जायगा एबा फन नाम्बार नाङा, आरो माब्लाबो विज्ञापन दिन्थिया।',
  'home.stepLabel': 'थाखो',
  'home.freeTitle': 'बे सेवाया जोबोद फ्रि',
  'home.freeBody': 'माब्लाबो रां नाङा, माब्लाबो ब्यक्तिगत खौरां नाङा, आरो माब्लाबो विज्ञापन दिन्थिया।',
  'help.q1.label': 'बिजुली गैया, मा खालामगोन?',
  'help.q1.question': 'नोगरावआव सानथ्रि गैया। मा खालामनांगौ, आरो मोबाइल फोनखौ माबोरै चार्ज खालामनांगौ?',
  'help.q2.label': 'सासे गथ\'नि फरायनायाव गोहो गैयि',
  'help.q2.question': 'आंनि गथ\'नि फरायनायाव जोबोद गोहो गैयि। न\'आव माबोरै सुद्रायनांगौ?',
  'help.q3.label': 'बैसो गोनां सुबुंनि देहा फाहामनाय',
  'help.q3.question': 'आंनि बिफाया जोबोद बैसो गोनां, बिथांखौ माबोरै फाहामनांगौ?',
  'help.q4.label': 'न\'आव आगोलाबा मा खालामनांगौ',
  'help.q4.question': 'जदि हरनि समाव न\'आव आगोलायोब्ला गिबियाव मा खालामनांगौ?',
  'help.title': 'नोंनि समस्याखौ लिर',
  'help.intro': 'गाहायाव लिर एबा बुं। जदि मिथियाब्ला नोंनि गोसोआव थानायखौनो लिर — बेनो जोबोद गोनांथि।',
  'help.suggested': 'सराहा सोंथिफोर',
  'help.howTitle': 'बे सेवाया माबोरै खामानि मावो',
  'help.howBody': 'गासै सोंथिफोरखौ रेकर्ड खालामनाय जायो आरो बेनिनो फिननायखौ थाबैनो मोननाय जायो। नोंनि मुं, थि थानो एबा फोन नम्बरखौ माब्लाबो नाजाया। गासैबो फ्रि एबा दानखौनो।',
  'ref.title': 'बे सेवाया मा आरो सोरनि थाखाय',
  'ref.intro': 'बे सेवाखौ श्रीमती VARSHA नि साननायाव बानायनाय जादों। बेयाव सराहा रावजों बेयो मा मावनांगौ, बेयाव मा मा दं, आरो बेनिनो सिमाफोरा मा मा, बेखौ फोरमायनाय जादों। गासैबो फ्रि — माब्लाबो रां नाजाया, माब्लाबो एड देखायनाय जाया, आरो माब्लाबो गाज्रि बाथ्रा एबा निजि फोरमान नाजाया।',
  'ref.whatTitle': 'बेयाव मा मा दं',
  'ref.what1': 'न\'आव आगोलायनाय, सानथ्रि गैया जानाय, गथ\'नि फरायनायाव गोहो गैयि, बिफा-बिमाखौ नायबिजिरनाय — बेफोरबायदि सराहा समस्याफोरनि सुलुंफोरखौ सराहा रावजों लिरनाय दं।',
  'ref.what2': 'सोंथिफोरखौ बुंनानै सोंनो हागौ। बुंनो रोंङाब्ला लिर — मोननैबो सोंथिनि फिननायखौ एखेयैनो मोनगोन।',
  'ref.what3': 'गासै सोंथिफोरखौ रेकर्ड खालामनाय जायो, बेनिखायनो गुबुनफोरनि समस्याखौ नोंनि सिगाङावनो सोंखाबाय आरो बेनिनो फिननायखौ मोनखाबाय।',
  'ref.what4': 'माब्लाबो एड गैया, माब्लाबो गोनांथि गैयि खौरां गैया, आरो माब्लाबो निजि फोरमान नाजाया। गासैबो फ्रि।',
  'ref.helplineTitle': 'थाबैनो मददनि थाखाय बे नम्बरफोरखौ लाखि',
  'ref.helpline1': 'माबा मोनसे गेदेर बिपद — जेरै आगोलायनाय, सानथ्रिनि गोख्रों थुख्रा, गोग्लैनाय एबा जोबोद बेदर गोमानाय — जायोब्ला 112 आव फोन खालाम।',
  'ref.helpline2': 'सोरबा बेरामाव दं एबा चोट मोनदों आरो थांनो लामा गैयाब्ला, 108 आव एम्बुलेन्स सों।',
  'ref.helpline3': 'हिनजावसाफोरनि सायाव माबा मोनसे गाज्रि खामानि जादोंब्ला, एबा हिनजावसाखौ सोरबा दुखु होदोंब्ला, 181 आव फोन खालाम। बेयो फ्रि।',
  'ref.helpline4': 'गथ\' एबा बैसो गोनां सुबुंनि सायाव माबा मोनसे अन्याय जादोंब्ला, 1098 आव उजुद खालामनो हागौ।',
  'ref.helpline5': 'गोसोनि दुखु जोबोद गोख्रोंब्ला, एबा जिउ फोजोबनो गोसो जायोब्ला, 14416 आव बुंनो हागौ। खन्थायनायनि थाखायनो।',
  'ref.dataTitle': 'नोंनि सोमोन्दै जों मा लाखियो',
  'ref.dataBody': 'नों सोंनाय सोंथिफोरखौ, बेनिनो सारमर्मो, आरो सोंथिफोरखौ सोंनाय समाखौसो लाखियो — जाहाथे जों एखे फिननायखौ बार-बार होनो नाङा। नोंनि मुं, थि थानो, फोन नम्बर, एबा नोंखौ सिनायथि होनो हानाय माबा मोनसे फोरमानखौ जों नाजाया। साइटआव माब्लाबो एड एबा ट्रयाकिंग स्क्रिप्ट गैया।',
  'ref.adminTitle': 'प्रबन्धकफोरा मा मा खालामनो हागौ',
  'ref.adminBody': 'प्रबन्धकफोरा नोंनि हरनाय लिरथायफोरखौ नायनो हागौ, आरो बेनिनो फिननायखौ लिरनो हागौ। नोंनि अनुमति गैयिब्ला बिथांमोना माबा मोनसे लिरथायखौ सोलायनो एबा बोखारनो हाया, आरो नोंनि फोरमानखौ सोरनोबो बेखोनो हाया।',
  'ref.statsCategories': 'बिषयफोर दं',
  'ref.statsArticles': 'लिरथायफोर लिरनाय जादों',
  'ref.statsQuestions': 'सोंथिफोर सोंनाय जाबाय',
  'ref.ownerNote': 'बे सेवाया माबा मोनसे कम्पानि एबा सरकारनि नङा, सासे सुबुंनि साननायावसो बेखौ दैदेननाय जादों। बेनिखायनो बेयाव माब्लाबो एड गैया, माब्लाबो मेम्बरसिप गैया, आरो माब्लाबो रां नाजाया।',
  'support.title': 'बे सेवाया फ्रि',
  'support.intro': 'बे सेवाया सोरनिफ्रायबो रां नाजाया। नाथाय बेयो थायो — बेनिखायनो नोंथाङा मदद खालामनो हानाय माखासे लामाफोर दं। जोबोद गोरलै लामाया जोबोद खामानि गोनां।',
  'support.waysTitle': 'नोंथाङा माबोरै मदद खालामनो हागौ',
  'support.way1Title': 'नोंनि साननायखौ लिर',
  'support.way1Body': 'जदि बे साइटनिफ्राय नोंथाङा माबा मोनसे मोजां मोनदों — एबा माबा मोनसे दुखु मोनदों — अब्ला राय पेजआव लिर। नोंनि मुं लिरनाया गोनांथि नङा।',
  'support.way2Title': 'नोंनि नोगोरनि सोमोन्दै बुं',
  'support.way2Body': 'नोंथाङा जाय जायगायाव थायो, बे जायगानि राव, हारिमु आरो समस्याफोरा गुबुन जायो। जदि नोंनि जायगानि माबा मोनसे बाथ्रा बेयाव गैयाब्ला, बुं — बेखौ दाजाबनो हागौ।',
  'support.way3Title': 'नोंनि साननायखौ गुबुननो बुं',
  'support.way3Body': 'बेयाव लिरनायफोरखौ जोबोद सुबुंफोरा बाहायनांगौ, जदि बिथांमोना मिथियोब्ला। सोरबा बेफोरबायदि सुबुंफोरनो बुं जाय बिथांमोननो बेयो जोबोद मदद खालामगोन।',
  'support.way4Title': 'बेयाव फैनानै नाय',
  'support.way4Body': 'जदि नोंथाङाव समा दंब्ला, गावनो फैनानै नाय बे साइटआ मोजाङै खामानि मावगासिनो दं नामा। माबा मोनसे गाज्रि नुयोब्ला बुं — बेखौ फ्रिनो मोजां खालामनाय जागोन।',
  'support.contactTitle': 'माबा मोनसे बुंनो दं नामा?',
  'support.contactBody': 'माबा मोनसेनि थाखायबो बेयाव लिरनो हागौ — माबा मोनसे गोरोन्थि जायोब्ला, एबा माबा मोनसे बांद्राय मोनदोंब्ला, एबा माबा मोनसे सोंथि दंब्ला। जेसेबां गोरलैयै लिरनो हागौ, एसेनो लिर।',
  'support.faqTitle': 'बार-बार सोंनाय माखासे बाथ्राफोर',
  'support.faqBody': 'बेयो थारैनो फ्रि नामा? होय। नोंनि मुं नाजानाय जायो नामा? नङा, मुं होननाया गोनांथि नङा। एड फैयो नामा? नङा। माबा मोनसे फोन नम्बर एबा थि थानो नाजाया नामा? नङा। माबा मोनसे एप डाउनलोड खालामनांगौ नामा? नङा, बेयो ब्राउजरआवनो खुलियो।',
  'ask.label': 'नोंनि समस्याखौ लिर एबा माइकजों बुं',
  'ask.placeholder': 'जेरै: गथ\'नि फरायनायाव गोहो गैयि',
  'ask.help': 'एन्टर थुनानैबो हरनो हागौ।',
  'ask.send': 'सों',
  'ask.sending': 'सानगासिनो दं…',
  'ask.clear': 'लिरनायखौ बोखार',
  'ask.speak': 'बुंनानै सों',
  'ask.listening': 'रायखौ फालिनो जागायनाय…',
  'ask.heard': 'खनासंथि दं',
  'ask.stopListening': 'खनासंथिखौ दोनथ',
  'ask.suggested': 'सराहा सोंथिफोर',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'खनासं',
  'ask.stopSpeak': 'दोनथ',
  'ask.aiNote': 'बे फिननायखौ AI निफ्राय मोननाय जादों। बेयो माबेबा बिसेसज्ञनि सल्लाहनि जागायाव नङा।',
  'ask.errorRateLimit': 'बांद्राय सोंथिफोरखौ एखे समावनो दैथोननाय जादों। खसे समा उनाव नाजाफिन।',
  'ask.errorNetwork': 'इन्टरनेट खामानि मावाखै। जोंखानि (connection) नायफिननानै उनाव नाजाफिन।',
  'ask.notAnswer': 'बे सोंथिनि थोंजों फिननाय जोंहा गैया।',
  'ask.emptyAnswer': 'बे खेबाव फिननायखौ दिहुननो हायाखै। गुबुन रोखोमनि सोंथिफोर सोंनानै नाय।',
  'ask.micUnsupported': 'बे ब्राउजाराव रायलायनानै सोंनाया खामानि मावा। लिरनानै सों।',
  'ask.heardWith': 'बेखौ खनासंथि दं:',
  'voice.notAllowed': 'माइकनि अनमति मोनथवाखै। गोजौआव थांनानै अनमति हो, एबा लिरनानै सों।',
  'voice.serviceNotAllowed': 'माइकनि अनमति मोनथवाखै। गोजौआव थांनानै अनमति हो, एबा लिरनानै सों।',
  'voice.noSpeech': 'माबेबा राव खनासंथवाखै। माइकनि खाथियाव रायलाय, एबा लिर।',
  'voice.audioCapture': 'माबेबा माइक मोनथवाखै। डिभाइसखौ जोंनानै नाय, एबा लिरनानै सों।',
  'voice.network': 'रायलायनानै सोंनो थाखाय इन्टरनेट नांगौ, आरो बे खामानि मावाखै। लिरनानै सों — फिननाया एखेनो जागोन।',
  'voice.aborted': 'दोनथबाय। फिन नाजाफिन।',
  'voice.unsupported': 'बे ब्राउजाराव रायलायनानै सोंनाया खामानि मावा। लिरनानै सों।',
  'voice.speakFailed': 'बे फिननायखौ खनासंथिनो हायाखै।',
  'voice.noVoice': 'बे डिभाइसाव {name} नि रायलायनाय राव मोनथवाखै। दा लिरनायखौ फराय, एबा फोननि सेटिंआव थांनानै राव दाजाब।',
  'voice.generic': 'माबेबा गोरोन्थि जादों। फिन नाजाफिन।',
  'sound.title': 'गोसोनि सान्थिनि थाखाय खौरां',
  'sound.intro': 'माबेबा फिस गैया, माबेबा बिज्ञापन गैया। गोसोखौ सान्थि खालामनो थाखाय।',
  'sound.playing': 'खौरां जागायबाय। दोनथनो थाखाय एखे बटनाव फिन थु।',
  'sound.shankh': 'संख',
  'sound.shankhHint': 'गिदिं, लाउ',
  'sound.bansuri': 'बांसुरी',
  'sound.bansuriHint': 'मोजां, खम',
  'sound.dhol': 'नागाडा',
  'sound.dholHint': 'गोख्रों, लाउ',
  'sound.all': 'गासैबो',
  'sound.allHint': 'एखे समाव',
  'sound.listenLabel': 'खनासं',
  'sound.errUnsupported': 'बे ब्राउजाराव खौरां खनासंनो हायाखै।',
  'sound.errGeneric': 'खौरां खनासंनो थाखाय माबेबा गोरोन्थि जादों।',
  'dhun.welcome': 'सिबिनाय जाबाय',
  'dhun.prompt': 'संख, बांसुरी आरो नागाडा — लोगोसे खनासंनो थाखाय थु।',
  'dhun.listen': '▶ खनासं',
  'dhun.skip': 'खौरां नागार',
  'dhun.failed': 'खौरां खनासंनो हायाखै।',
  'dhun.label': 'खौरां खनासंनो अनमति',
  'reviews.title': 'नोंनि साननाय, नोंनि बाथ्रा',
  'reviews.intro': 'बे सेवाया नोंनि खामानियाव फैदों नामा? नोंनि बाथ्राखौ लिर — नोंनि मुं लिरनाया गोनां नङा।',
  'reviews.pageTitle': 'नोंनि साननाय',
  'reviews.pageIntro': 'बेयाव सुबुंफोरा मा लिरदों बेखौनो लिरनाय दं। माबेबा साननायखौ लुखैनाय जाया, आरो मा लिरनाय दं बेखौ बेयावनो नुयो — नायनायनि उनावसो दिहुननाय जायो।',
  'reviews.write': 'नोंनि साननायखौ लिर',
  'reviews.submit': 'दैथोन',
  'reviews.sending': 'दैथोनगासिनो दं…',
  'reviews.name': 'नोंनि मुं (गोनां नङा)',
  'reviews.city': 'नोंनि नोगोर (गोनां नङा)',
  'reviews.comment': 'नोंनि बाथ्रा',
  'reviews.placeholder': 'गोसोआव मा फैयो बेखौनो लिर — माबेबा थार खालामनाया गोनां नङा।',
  'reviews.moderated': 'नोंथांनि नायनायखौ दिहुननायनि सिगां मोनसे खेप नायफिननाय जायो।',
  'reviews.moderationNote': 'गासैखौबो फोजोबनायनिफ्राय रैखा खालामनो थाखाय, दिहुननायनि सिगां गासै नायनायखौबो मोनसे खेप नायफिननाय जायो। गाज्रि राव, नाम्बार एबा सुबुंनि बाथ्राफोरखौ दानख\'नाय जायो — गुबुन गासैखौबो जेरै थानाय बादिनो दिहुननाय जायो।',
  'reviews.summaryTitle': 'साधारण मोदोम',
  'reviews.count': 'नायनायफोर',
  'reviews.anonymous': 'मुं गैयै',
  'reviews.summaryLine': 'मानसिफोरा सरासरी 5 नि गेजेराव {rating} नि {count} तारा होदों।',
  'reviews.starsLabel': '5 नि गेजेराव {value} तारा',
  'reviews.keepLabel': 'गाज्रि मोनदोंब्ला एबा मोजां मोनदोंब्ला — मोननैखौबो लिर',
  'reviews.ownerReply': 'फिननाय',
  'reviews.replyLabel': 'बेनि सायाव लिरनाय',
  'reviews.empty': 'दासिमबो माबोरैबो नायनाय गैया। गिबिया नों लिर।',
  'reviews.toastSent': 'रोजा रोजा साबायखर',
  'reviews.toastFailed': 'मोदोमखौ दैथायहरनो हायाखै',
  'reviews.fieldTooShort': 'खमसेखोम 10 आखर लिर।',
  'reviews.rateLimited': 'जोबोद खरथारै दैथायहरगासिनो दं। खसे थाद\'नानै फिन नाजा।',
  'cat.notFound': 'बे बिलाइखौ मोनथवाखै',
  'cat.empty': 'बे आयदानि सायाव दासिमबो माबोरैबो लिरनाय गैया।',
  'article.emergency': 'गोनां',
  'article.askAbout': 'बे आयदानि सायाव सों',
  'article.readAloud': 'बे लिरनायखौ खोनासं',
  'article.others': 'बे आयदानि गुबुन लिरनायफोर',
  'article.count': '{count} लिरनाय',
  'theme.toLight': 'आलखि नुथायसिम थां',
  'theme.toDark': 'गोथार नुथायसिम थां',
  'toast.dismiss': 'फोजोब',
  'language.choose': 'नोंनि रावखौ सायख\'',
  'language.articlesIn': 'बे लिरनाया हिन्दी रावाव दं।',
  'language.articlesInHint': 'गासै रावफोराव आलादा राव सोलायनाय नांगौ। बे राव सोलायनाया दासिम जायाखै — जाय लिरनाय दं बेयो हिन्दी रावावनो थार आरो आबुं।',
  'ask.welcome': 'नोंखौ बरायनाय जाबाय! गाहायाव नोंनि समस्याखौ लिर एबा माखासे आयदा सायख\'।',
  'ref.notTitle': 'बेयो मा खालामनो हाया',
  'ref.not1': 'बेयो डॉक्टर नङा। देहा फाहामनायनि सल्लाह माब्लाबाबो होआ।',
  'ref.not2': 'बेयो उकिल नङा। आइननि सल्लाह होआ।',
  'ref.not3': 'माबोरैबो रां लानाय जाया, आरो माबोरैबो बिज्ञापन दिहुननाय जाया।',
  'ref.not4': 'नोंनि मुं, थानो जायगा एबा फोन नाम्बारखौ सोंनाय जाया आरो लाखिनायबो जाया।',
  'ref.not5': 'माबोरैबो सरकारि सुबिदानि रां एबा नाम्बार बानायनाय जाया — थार खौरां गैयैब्ला बेयो मिथिया होननानै थोंजों बुंनाय जायो।',
  'ref.medicalTitle': 'गोनां: बेयो डॉक्टरनि सल्लाह नङा',
  'ref.medicalBody': 'बेरामि, देहा फाहामनाय एबा माबोरैबो बिखांनि बेसादनि सायाव बाथ्रा दंब्ला, गिबियाव डॉक्टरखौ लोगो नां। बेयाव होखानाय खौराङा फालतु मददनि थाखायसो। गथ\'नि खोबथानाय, गभर्बस्थि, एबा माबोरैबो देहा फाहामनाय जागायनायनि सिगां डॉक्टरनि सल्लाहखौ थारैनो ला।',
  'ref.statsTitle': 'बेसेबां खौरां दं',
  'support.howTitle': 'जौखौ माबोरै मदद खालामगोन',
  'support.alwaysFreeTitle': 'बे सेवाया सानफ्रोमबो फ्रि थागोन',
  'support.alwaysFreeBody': 'जायखिजाया मदद मोननायखौ सेवा चालायनो बाहायनाय जागोन। रावखौबो माब्लाबाबो रां सोंनाय जाया।',
  'smriti.eyebrow': 'मान बावनाय',
  'smriti.whyTitle': 'बे साइटखौ मानो बानायनाय जादों',
  'smriti.ending': 'बिसोरनि नाजानाया बेयावनो सिगां फारसे थाङो।',
  'article.askAny': 'माबोरैबो सोंथि सों',
  'article.remember': 'सिंखां',
  'article.emergencyInfo': 'गोनां खौरां',
  'article.medicalTitle': 'बेयो देहा फाहामनायनि सल्लाह नङा',
  'article.medicalBody': 'बे खौराङा फालतु मददनि थाखायसो। माबोरैबो देहा फाहामनायखौ जागायनाय एबा फोजोबनाय दाखालाम — गिबियाव डॉक्टरखौ लोगो नां।',
  'article.heading': '{category} नि लिरनायफोर',
  'reviews.rateQuestion': 'बेसेबां तारा होगोन?',
  'reviews.starsShort': '{value} तारा',
  'reviews.averageOutOf': '5 नि गेजेराव {value} तारा',
  'dhun.welcomeTitle': 'बरायनाय जाबाय',
  'dhun.consent': 'शंख, बांसुरी आरो नगाडा — लोगोसे खोनासंनो थाखाय थु।',
  'dhun.unsupported': 'बे ब्राउजारा खौरां खौनायैखौ फानो हाया।',
  'dhun.failedTry': 'खौरां फाननायाव जेंना जादों।',
  'sound.hintIdle': 'खौरां खोनानो थाखाय माबा मोनसे बुथां थुनानै नाय।',
  'sound.hintPlaying': 'खौरां फानगासिनो दं। दोनथोनो थाखाय बे बुथांखौनो फिन थु।',
  'sound.preparing': 'खौरां थियारि जागासिनो दं',
  'nav.path': 'लामा',
  'health.heading': 'नोंनि बैसोखौ बुं',
  'health.intro': 'बैसोनि बादि जेरै सुबुंफोरा सोंनाय सोंनाय जायो, बेफोरखौ बेयाव नुनो मोनगोन। माबा मोनसे बुथां थुनानै नाय — सोंनाया गाहायाव फैगोन, अब्ला सोंनानै ला।',
  'health.ageLabel': 'बैसो (बोसोर)',
  'health.years': 'बोसोर',
  'health.bandsLabel': 'बैसोनि बादि सायख\'',
  'health.notAdviceStrong': 'बेया जाहाजथिनि सल्लाह नङा।',
  'health.notAdvice': 'जेखुनु बेसादखौनो जाथारनाय एबा दोनथनाय खालामनां — सिगाङाव डाक्टरखौ लोगो ला।',
  'health.emergencyStrong': 'आपातकालिन समाव फोन खालाम:',
  'health.emergencyCall': '(आपातकाल)',
  'health.emergencyAmbulance': '(एम्बुलेन्स)',
  'health.emergencyWomen': '(मिजिंनि हेफाजाब)',
  'health.privacy': 'माबा मोनसे मुं एबा थि जायगा लिरनायनि गोनांथि गैया।',
  'health.band.infant.label': '0 – 2 बोसोर',
  'health.band.infant.note': 'फिफां गथ\'फोर, जायफोरा गावनि बाथ्राखौ बुंनो हाया',
  'health.c.infant1': 'गोख्रों बुखार',
  'health.q.infant1': 'आंनि गथ\'नि बुखारआ गोख्रों, आं बिदै होनो ना?',
  'health.c.infant2': 'जायखौ जानो हायाखै',
  'health.q.infant2': 'फिफां गथ\'आ जाथारनाय गैया, आं मा खालामनांगौ?',
  'health.c.infant3': 'बान्दायगासिनो दं',
  'health.q.infant3': 'गथ\'आ बान्दायगासिनो दं, माब्ला डाक्टरखौ दिन्थिनो?',
  'health.c.infant4': 'पेट खारायगासिनो दं',
  'health.q.infant4': 'गथ\'नि पेट खारायगासिनो दं, आं मा जाहोनांगौ?',
  'health.band.child.label': '3 – 12 बोसोर',
  'health.band.child.note': 'गथ\'फोर जायफोरा बुंनो हायो, नाथाय सोंनो गिनाय मोनो',
  'health.c.child1': 'फरायनायाव गोसो गैया',
  'health.q.child1': 'गथ\'नि फरायनायाव गोसो गैया, आं मा खालामनांगौ?',
  'health.c.child2': 'स्कुलाव थांनो नागारो',
  'health.q.child2': 'गथ\'आ सानफ्रोमबो स्कुलाव थांनो नागारो, मा जाहोना जानो हागौ?',
  'health.c.child3': 'राति बुखार',
  'health.q.child3': 'गथ\'नि राति बुखार जायो, आं मा खालामनांगौ?',
  'health.c.child4': 'दांथां खोख्लैगासिनो दं',
  'health.q.child4': 'गथ\'नि दांथां खोख्लैगासिनो दं, दांथांखौ माबोरै थियारि खालामनांगौ?',
  'health.band.teen.label': '13 – 17 बोसोर',
  'health.band.teen.note': 'गथ\'फोर, जायफोरखौ खोनासंनो थाखाय सुबुं मोननाय गैया',
  'health.c.teen1': 'फरायनायनि चाप',
  'health.q.teen1': 'फरायनायनि जोबोद चाप दं, बेखौ माबोरै सामलायनांगौ?',
  'health.c.teen2': 'थुफुरनो हायाखै',
  'health.q.teen2': 'राति थुफुरनो हायाखै, आं मा खालामनांगौ?',
  'health.c.teen3': 'मोबाइलनि लत',
  'health.q.teen3': 'मोबाइलनि लत जाबाय, बेखौ नागारनायनि लामा बुं।',
  'health.c.teen4': 'जोबोद दुखु मोननाय',
  'health.q.teen4': 'जोबोद दुखु मोनगासिनो दं, आं सोरजों बाथ्रा रायज्लायनांगौ?',
  'health.band.young.label': '18 – 30 बोसोर',
  'health.band.young.note': 'हाबा, रां आरो थुफुरनाय — गासैबो मोनसेयावनो',
  'health.c.young1': 'हाबानि चाप',
  'health.q.young1': 'हाबानि चापआ जोबोद दं, माबोरै खम खालामनांगौ?',
  'health.c.young2': 'दुंफायनायनि थाखाय बेखौ दुखु',
  'health.q.young2': 'दुंफायनायनि थाखाय बेखौ दुखु जादों, आं मा खालामनांगौ?',
  'health.c.young3': 'थुफुरनो हायाखै',
  'health.q.young3': 'राति निद्रानो फैयो, मा खालामनांगौ?',
  'health.c.young4': 'फैसा खम',
  'health.q.young4': 'फैसा खम आरो खरसाना बांसिन, आं मा खालामनांगौ?',
  'health.band.middle.label': '31 – 45 बोसोर',
  'health.band.middle.note': 'न\', गथ\' आरो गावनि देहा — गासैबो दायित्वखौ लोगोसे लाबोनाय',
  'health.c.middle1': 'खामफानि दुखु',
  'health.q.middle1': 'खामफानि दुखु जादों, मा जाहोन जानो हागौ?',
  'health.c.middle2': 'निद्रा मोजां नङा',
  'health.q.middle2': 'निद्रा मोजां फैयैखै, मोजां खालामनायनि मा उपाय दं?',
  'health.c.middle3': 'न\'नि दुखु-सुखु',
  'health.q.middle3': 'न\'आव जोबोद दुखु-सुखु दं, गथ\'फोरखौ माबोरै सामलायनो?',
  'health.c.middle4': 'पेटआव गैस',
  'health.q.middle4': 'हाबा मावनो थांनायनिफ्रायनो पेटआव गैसनि समस्या जादों, मा खालामनांगौ?',
  'health.band.later.label': '46 – 60 बोसोर',
  'health.band.later.note': 'देहानि बैसो आरो जथोन — मोननैबो लोगोसे',
  'health.c.later1': 'सिंनि दुखु',
  'health.q.later1': 'आंनि बैसो 54 बोसोर आरो आंनि सिंआव दुखु जादों, मा खालामनांगौ?',
  'health.c.later2': 'गोदोनि दुखु',
  'health.q.later2': 'गोजौआव थाङोब्ला गोदोआव दुखु जायो, मानो?',
  'health.c.later3': 'रातिनि गोदानि खैफोद',
  'health.q.later3': 'राति गोदा थुख्रा जायो, मा खालामनांगौ?',
  'health.c.later4': 'फुंनि थुख्रा',
  'health.q.later4': 'फुंआव सिखारनानै खामफा थुख्रा जायो, मा जाहोन जानो हागौ?',
  'health.band.senior.label': '61 – 75 बोसोर',
  'health.band.senior.note': 'देहा फाहामनाय, सुन्तुलन आरो गावनो थानाय — गासैबो लोगोसे',
  'health.c.senior1': 'थांनो-फैनायाव असुबिदा',
  'health.q.senior1': 'गोदोआव जोबोद दुखु, थांनो-फैनायाव असुबिदा जादों, मा खालामनांगौ?',
  'health.c.senior2': 'देहा फाहामनायनि नायबिजिरनाय',
  'health.q.senior2': 'खिथिनि देहा फाहामनायखौ सानफ्रोमबो लोंनांगौ जायो — बबेया गाज्रि बेखौ माबोरै मिथिनो?',
  'health.c.senior3': 'रातिनि फिसानि असुबिदा',
  'health.q.senior3': 'राति बार-बार फिसा फैयो, मा खालामनांगौ?',
  'health.c.senior4': 'खोनानाया खम',
  'health.q.senior4': 'खोनानाया खम जादों, खोनानो मा उपाय दं?',
  'health.band.elder.label': '76 – 100 बोसोर',
  'health.band.elder.note': 'गासै देहा फाहामनायखौ नायबिजिरनाय गोनां, गोग्लैनाया जोबोद खैफोद',
  'health.c.elder1': 'गोग्लैनायनि गिनाय',
  'health.q.elder1': 'न\'आव गोग्लैनायनि गिनाय दं, माबोरै रैखाथि खालामनांगौ?',
  'health.c.elder2': 'मोजां साननो हाया',
  'health.q.elder2': 'साननो हानाया खम जालांदों, मा उपाय दं?',
  'health.c.elder3': 'सनि दुखुनि देहा फाहामनाय',
  'health.q.elder3': 'दुखुनि देहा फाहामनायखौ सानफ्रोमबो लोंनांगौ जायो — बेयो गाज्रि जागोन नामा?',
  'health.c.elder4': 'माब्ला डाक्टरनि सिम थांनो',
  'health.q.elder4': 'माब्ला डाक्टरनि सिम थांनाया गोनां?',
  'ask.notConfigured': 'बे सेवाया दासिमबो पुरानो फिननायफोरखौसो होदों। नोंनि सोंथिया बेयाव मोनथारला।',
  'ask.browseTitle': 'बेयाव थानाय लिरथायफोरखौ नाय',
  'download.pdf': 'PDF आव लिर',
  'download.text': 'टेक्स्टआव लिर',
  'download.printNow': 'प्रिन्ट खालाम',
  'download.preparing': 'प्रस्तुत जाबाय दं',
  'download.blocked': 'गोदान ट्याब खुलिनो हायाखै। Pop-up खौ बन्द खालामनाय दं — नोंनि ब्राउझारआव गुबुन ट्याब खुलि',
  'attach.button': 'नोंनि कागोज एबा फटोखौ दाजाब',
  'attach.formats': 'PDF, फटो (JPG/PNG) एबा टेक्स्ट फाइल — 12 MB सिम',
  'attach.reading': 'परायबाय दं…',
  'attach.attached': 'दाजाबबाय',
  'attach.remove': 'हुखुमोर',
  'attach.tooBigPdf': 'बे PDF आसाया 12 MB निख्रुइ देरसिन। गुसुंद फाइलखौ सायख।',
  'attach.tooBigImage': 'बे सावगारिया 3 MB निख्रुइ देरसिन। गुसुंद सावगारिखौ सायख।',
  'attach.scannedPdf': 'बे PDF आ स्कान खालामजानाय — बेयाव सानगुदै नामा लासै सावगारिथ’ दं, पडिनो हाया। बे सावगारिखौ दैथाय।',
  'attach.pdfFailed': 'बे PDF खौ पडिनो हायाखै।',
  'attach.imageFailed': 'बे सावगारिया लोड जानाय नङा।',
  'attach.wrongType': 'बे फाइलआ खामानि मावनाय नङा। PDF, सावगारि एबा टिक्स फाइल दैथाय।',
  'attach.hint': 'नोंनि लाइजामखौ बेयाव दोनना सावरायनाय नागिर — जों बेजोंनो फिननाय लिरगोन।',
  'ask.sendWithFile': 'फिननाय नागिरो',
  'lib.title': 'फ्रि लाइब्रारी',
  'lib.intro': 'फरायनायनि बिजाब, फरायनाय, सावगारि आरो अडिअ — गासैबो फ्रि आरो आइनि बायदि।',
  'lib.legalTitle': 'कपिराइटनि जेबो प्रब्लेम गैया।',
  'lib.legal': 'बेयाव जेखिनि होनाय दं, बे गासैबो फ्रि आरो नों बेखौ सिगां थिथ ‘नो हागोन। जाय बिजाबा दाबो कपिराइटनि सिंआव दं, बेयाव थानाय नङा — बेखौ नों कपि खालामना हाया, बेखौ प्रस्टै बुंनो गोनां।',
  'ask.signInFirst': 'सिगाङाव साइन इन खालाम, बिनि उनाव सावरायनाय नागिर।',
  'ask.signInTitle': 'सिगाङाव साइन इन खालाम',
  'ask.signInBody': 'सावरायनाय नागिरनो थाखाय नोंनि एकाउन्ट खालाम। बेयाव मोनसे मिनेटनि सिगां सम लायै, आरो नों साना थानाय नङा।',
  'ask.signInCta': 'एकाउन्ट खालाम एबा साइन इन खालाम',
  'ask.signInOr': 'दाबो एकाउन्ट खालामनो हायाखै? बे खामानियाबो नों गावनो मावफुंनो हागोन:',
  'account.title': 'आंनि एकाउन्ट',
  'account.intro': 'नोंनि मुंखौ आरो पासवार्डखौ होनानै सावरायनाय नागिरनो जागाय।',
  'account.signIn': 'हाब',
  'account.register': 'एकाउन्ट खालाम',
  'account.signInNote': 'सिगांनि मुंखौ आरो पासवार्डखौ थिसन।',
  'account.registerNote': 'सावरायनाय नागिरनो थाखाय एकाउन्ट गोनां नङा। बेयो लासै नोंनि राव आरो फिननायखौ मन्थिनो थाखाय लोंनो।',
  'account.handle': 'नोंनि मुं',
  'account.handlePlaceholder': 'जेरै: sita.ji',
  'account.password': 'पासवार्ड',
  'account.passwordHint': 'कम्सेकम् 6 आखुर।',
  'account.phone': 'प ‘न नम्बर',
  'account.optional': 'गोनां नङा',
  'account.phoneHint': 'होनो लुबैयोब्ला हो। जायफोरा प ‘न होलाब्लाबो एकाउन्ट जानायोनो।',
  'account.create': 'एकाउन्ट खालाम',
  'account.logout': 'बाहिरायाव नागिर',
  'account.open': 'एकाउन्ट खेव',
  'account.signedInAs': 'नों साइन इन खालामबाय',
  'account.signedOut': 'एकाउन्ट खेवैयाखै',
  'account.signedOutBody': 'दासिम जेबो एकाउन्ट खेवैयाखै।',
  'account.saved': 'दोनथुमनाय फिननाय',
  'account.savedEmpty': 'दासिम जेबो फिननाय दोनथुमनाय गैया। फिननाय फैब्ला \'जमा करें\' दाब।',
  'account.savedUnavailable': 'दोनथुमनाय फिननायखौ दासिम नुवाखै। गुबुन गासैबो chalte दं।',
  'account.wait': 'अनग्रनानै ने…',
  'account.privacyTitle': 'नोंनि खथ’फोरा रैखाथि दं',
  'account.privacyBody': 'एकाउन्ट खालामब्ला लासै नोंनि मुं, पासवार्ड आरो रावखौ दोनथुमनाय जायो। सावरायनायनि जेबो रेकर्ड गैया। नोंनि सावरायनायखौ कसैबो दैथायनाय नङा।',
  'account.errWrong': 'मुं एबा पासवार्डआ गोरोन्थि।',
  'account.errTaken': 'बे मुंखौ सिगाङावनो लानाय जाबाय। गुबुन मुं सायख।',
  'account.errBad': 'खौरां गासैबो थिकै थिसन।',
  'account.errWait': 'जोबोद थिंख्लायबाय। ख’से समनि उनाव चेस्टा खालाम।',
  'account.errTryLater': 'दासिम मावनो हायाखै। ख’से समनि उनाव चेस्टा खालाम।',
  'lib.licence.ccBy': 'नों बेखौ कपि आरो सेयार खालामनो हागोन, साफायनोबो हागोन — नाथाय फुंखाखौ होनो नांगोन।',
  'lib.licence.ccBySa': 'नों बेखौ कपि आरो सावगारि थिसनो हागौ। जाय थिरथार खालामगोन, बेखौबो प्रस्टै होनो गोनां जागोन।',
  'lib.licence.ccZero': 'गासैबो फ्रि। सोरनिफ्राय फैदों बे मुंखौ होनायनिबो गोनांथि गैया।',
  'lib.licence.pd': 'सोरनिबो कपिराइट गैया — जाय लुबैयो कपि खालामनो हागौ।',
  'lib.licence.govtIndia': 'भारत सरकारनि वेवसाइटआव। फरायनो आरो सावगारि थिसनो मोनैबो फ्रि।',
  'lib.licence.creativeCommons': 'फाइल फिफ्राइनि निजोम लाइसेन्स दं — फाइलआव नाय।',
  'lib.licence.freeToRead': 'फरायनो फ्रि। कपि खालामनानै सिगां थिथ ‘नायाबो बे सर्तखौनो मानिनानै जानांगोन जायजों बेखौ मोनदोंमोन।',
  'lib.openBadge': 'खेवनाय',
  'lib.openBadgeNote': 'बेखौबै बेखौ कपी खालामना हायो',
  'lib.freeBadge': 'फ्री',
  'lib.freeBadgeNote': 'फरायना हायो, कपी खालामना हायोआ',
  'lib.govt': 'सोरखारि',
  'lib.noSignup': 'एकाउन्ट गैयि',
  'lib.open': 'बेयाव खेव',
  'lib.group.padhai': 'फरायनायनि बिजाबफोर',
  'lib.group.padhai.note': 'स्कुल, कलेज आरो सोरखारि फरायनायनि मुवाफोर',
  'lib.group.kitab': 'बिजाबफोर',
  'lib.group.kitab.note': 'जेराव कपीराइट गैयि एबा कपी खालामनायनि थि खालामनाय दं',
  'lib.group.tasveer': 'सावगारि आरो मुसुखाफोर',
  'lib.group.tasveer.note': 'मेप, सावगारि, सिन — गासैबो',
  'lib.group.audio': 'खोनासंनो हायि मुवाफोर',
  'lib.group.audio.note': 'बिजाबफोरखौ खोनासं, फरायनाय नङा',
  'lib.warnTitle': 'गासै बिजाबफोरा बेयाव गैयि',
  'lib.warn': 'गेजेरनि माखासे बिजाबफोरा कपीराइटनि सिङाव दं आरो आइनि बायदि बेफोरखौ फ्री होनो हायोआ। जों बेफोरखौ जानला-मोनला दिन्थिया। जुदि माबा बिजाब नांगौ जायोब्ला गाहायाव सोंनाय हो — जेरैबो फिननाय मोननो हायो, बेखौ मोनगोन।',
  'lib.askInstead': 'सोंनाय हो',
  'nav.library': 'बिजाब फरायसालि',
  'support.contactMessageLabel': 'नोंनि बाथ्रा',
  'support.contactPlaceholder': 'जे लिरनो गोनां बेखौनो लिर — जुदि गोरोन्थि जायो, माबा मोजां मोनोब्ला, एबा माबा सोंनाय दंब्ला।',
  'support.contactHelp': 'जोबोद खमब्लाबो 10 आखर। बे सिधा मालिकनि सिगाङाव थाङो।',
  'support.contactSubmit': 'थोन',
  'support.contactSending': 'थोनगासिनो दं…',
  'support.contactPrivacy': 'नोंनि मुं लिरनाया गोनांथि गैयि।',
  'support.contactSent': 'सौहैबाय',
  'support.contactSentBody': 'नोंनि बाथ्राया मालिकसिम सौहैबाय।',
  'support.contactFailed': 'थोननो हायाखै',
  'support.faq1Q': 'बेया थारैनो फ्री नामा?',
  'support.faq1A': 'हौ। माबाबो रां नाङा, माबाबो विज्ञापन गैयि, आरो माबाबो मेम्बरशिप गैयि। बेखौ मोनसे सुबुंनि रांजों फलायनाय जायो, माबा कम्पनि एबा सोरखारनि रांजों नङा।',
  'support.faq2Q': 'आंनि मुं, थानोय जायगा एबा फोन नम्बरखौ लानाय जायो नामा?',
  'support.faq2A': 'नङा, आरो बेखौबो लानाय नङा। बे साइटआ गावआरि जेबो सिनायथि दिहुननाय नङा — जेबो लगइन गैया, जेबो ट्रेकिं स्क्रिप्ट गैया। नोंथाङा मा सोंदों बेखौसो सोंनाय जायो आरो बेयो फैयो।',
  'support.faq3Q': 'बेया डाक्टर एबा उकिल नामा?',
  'support.faq3A': 'नङा। बेयो माबाबो देहा फाहामनायनि एबा आइनि सल्लाह होआ। जेराव बाथ्राया गोख्रों जायो, बेयाव बेयो नोंखौ डाक्टर एबा अफिसारनि सिगाङाव थांनो बुङो — बेयो बिसोरनि जायगाखौ लानो हाया।',
  'support.faq4Q': 'गासै फिननायफोरा थार जायो नामा?',
  'support.faq4A': 'गासैबो समाव नङा। फिननायखौ कम्पिउटारा लिरो, डाक्टर नङा — बेनिखायनो गासै फिननायनि लोगोआव बेयो लिरनाय दं दि बेयो देहा फाहामनायनि सल्लाह नङा। माबाबो देहा फाहामनायनि मुवा जागायनाय एबा दोनथनायनि सिगां डाक्टरखौ लोगो लाथार।',
  'support.faq5Q': 'आं माबाबो एप डाउनलोड खालामनांगौ नामा?',
  'support.faq5A': 'नङा। बेयो ब्राउजारावसो खेवनाय जायो। माबाबो एप इन्स्टल खालामनाय गैयि, माबाबो अनुमति गैयि, माबाबो आपडेट गैयि।',
  'nav.remedies': 'नोगोरनि फाहामनाय',
  'remedy.title': 'आयुर्वेदिक नोगोरनि फाहामनाय',
  'remedy.intro': 'जेखुनु बेराम — खोख्लैनाय, मथा बेथानाय, गाथिया, खायज-खुलि, सुगर, सिगांनि बेथानाय — गाहायाव नोंनि बेरामखौ सायख\' एबा नोंनि बाथ्राजों सों। नोगोरनि काढा, मालिस, जाग्रा मुवा आरो आयुर्वेदिक उपायफोरखौ फोरमायनाय जागोन।',
  'remedy.choose': 'नोंनि बेरामखौ सायख\'',
  'remedy.emergencyStrong': 'बेफोरखौ गोख्रों आबादकाल होनना बुङो:',
  'remedy.emergency': 'उइ थुनाय, बिच्छु थुनाय आरो कुकुर थुनाय — गोख्रै हस्पिटालाव था, सिगाङाव 112 आव फोन खालाम। नोगोरनि उपायफोरा लामायाव खालामनायनि थाखायसो, हस्पिटालनि जायगा नङा।',
  'remedy.note': 'नोगोरनि आरो आयुर्वेदिक उपायफोरा बेरामखौ खम खालामनो मदद खालामो; बेफोर डाक्टरनि नायबिजिरनाय आरो फाहामनायनि जायगा नङा। माबाबो मुवाखौ गाव गावनो दोनथ\' एबा जागाय दा।',
  'remedy.cough': 'खोख्लैनाय',
  'remedy.headache': 'मथा बेथानाय',
  'remedy.joints': 'गाथिया',
  'remedy.itching': 'खायज-खुलि',
  'remedy.snake': 'उइ थुनाय',
  'remedy.scorpion': 'बिच्छु थुनाय',
  'remedy.dog': 'कुकुर थुनाय',
  'remedy.diabetes': 'सुगर',
  'remedy.back': 'सिगांनि बेथानाय',
  'remedy.walking': 'थांनायाव बेथानाय',
  'home.remedyNote': 'काढा, मालिस, जाग्रा मुवा आरो आयुर्वेदिक उपाय — गासै बेरामनि थाखाय, नोंनि रावजों।',
  'nav.aarti': 'आरति आरो भजन',
  'aarti.title': 'आरति आरो भजन — थारि गाबनायनि खौरां',
  'aarti.intro': 'बेयाव आरति, कीर्तन आरो भजन खोनासं — थारि रोजाबगिरि आरो मन्दिरनि गाबनायजों। जेबो AI गाबनाय नङा।',
  'aarti.note': 'कम्प्युटरनि गाबनायजों आरति एबा भजन खोनासंब्ला बेनि गोख्रोंथि आरो भक्तिआ खमायो। बेनिखायनो बेयाव गासैबो थारि रेकर्डिंल\' दं।',
  'aarti.kindAarti': 'आरति',
  'aarti.kindKirtan': 'कीर्तन',
  'aarti.kindBhajan': 'भजन',
  'aarti.credit': 'रेकर्डिं:',
  'aarti.licence': 'लाइसेन्स:',
  'aarti.listenLink': 'थारि गाबनायजों खोनासं',
  'aarti.textChecked': 'बेयो थारि आरति, जेरै थारि रेकर्डिंआव रोजाबनाय जादों।',
  'aarti.textPrinted': 'बेयो जाथायनि आरति, दिहुननाय फरायसालिफोरनिफ्राय नायबिजिरनाय।',
  'aarti.textNotStored': 'बे ग्रन्थनि गासै खन्थाइया बेयाव गैया — गाहायाव थानाय रेकर्डिंआव गासै खन्थाइखौ खोनासंनो हागोन।',
  'aarti.granthTitle': 'ग्रन्थ, चालिसा आरो स्तोत्र — थारि गाबनायजों',
  'aarti.noRecording': 'बे आरतिनि थारि रेकर्डिंआ दासिमबो साइटआव गैया, बेनिखायनो आं बेखौ रोजाबना खोनासंनो हाया — VARSHA SAMADHAN AI आ जेब्लाबो AI गाबनायजों आरति रोजाबनाय नङा।',
  'aarti.textOnlyTitle': 'गुबुन आरतिफोर — खन्थाइ आरो थारि गाबनाय',
  'aarti.fullText': 'गासै खन्थाइ',
  'aarti.notChecked': 'बे आरतिनि नायबिजिरनाय खन्थाइया दासिमबो साइटआव गैया। नायबिजिरिजायाखैब्ला खन्थाइखौ होनो नाङा, बेनिखायनो बेखौ होआखै।',
  'aarti.verifiedList': 'साइटआव बे आरतिफोरनि नायबिजिरनाय खन्थाइ दं:',

};

/* -------------------------------------------------------------------------- */
/* MANIPURI                                                                  */
/* -------------------------------------------------------------------------- */

const MANIPURI: Record<string, string> = {
  'jgd.placeSearch': 'শহরগী মিং ইরি',
  'jgd.placeNoMatch': 'শহর অসি লিস্ততা লৈতে। নক্নবা শহর অমা খল্লু।',
  'account.name': 'নহাক্কী মিং',
  'account.namePlaceholder': 'খুদম চাউনা: সিতা দেবী',
  'account.nameHint': 'অসি নহাক্কী খঙনবা ওইনা খক্তনি। মমিং অমা হেক্তা থম্বা য়াই, অমসুং অসি তঙাইফদবা নত্তে।',
  'nav.home': 'হোম',
  'home.metaTitle': 'ফ্রি সমাধান, ঐঙহগী মতিক মথক্তা',
  'lib.licence.ccZero.name': 'CC0 / পব্লিক দোমেইন',
  'lib.licence.pd.name': 'পব্লিক দোমেইন',
  'lib.licence.govtIndia.name': 'ভারত সরকার',
  'lib.licence.creativeCommons.name': 'ক্রিয়েতিভ কমন্স (মিশ্রিত)',
  'lib.licence.freeToRead.name': 'পনবা য়াবা',
  'lib.entry.ncert.title': 'NCERT লাইরিকশিং — ক্লাস ১ দগী ১২ ফাওবা',
  'lib.entry.ncert.what': 'সবজেক্ট খুদিংমক্কী লাইরিক পুম্নমক, হৌজিক ক্লাস খুদিংমক্কীদমক। লোগিন তৌদনা, সিধা PDF ওইনা ফংগনি।',
  'lib.entry.ncert.langs': 'হিন্দি, ইংলিশ অমসুং ভারতকী অতোপ্পা লোল ৩০ হেন্না',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — দিজিতেল লাইরিক',
  'lib.entry.pm-evidya.what': 'NCERT লাইরিকশিংগী অ্যাপ, অইবা ময়েক চাউনা পনবা য়াই। হায়নবা তাবা য়াই।',
  'lib.entry.pm-evidya.langs': 'ভারতকী লোলশিং',
  'lib.entry.diksha.title': 'DIKSHA — তমহনবা অমসুং অঙাংশিংগীদমক',
  'lib.entry.diksha.what': 'কোর্স, ভিদিও অমসুং প্রাকতিস — ক্লাস ১ দগী ১২ ফাওবা।',
  'lib.entry.diksha.langs': 'ভারতকী লোলশিং',
  'lib.entry.khan-academy.title': 'Khan Academy — ইংলিশতা মেথস অমসুং সাইন্স',
  'lib.entry.khan-academy.what': 'ভিদিও লেসন, ক্লাস খুদিংমক্কী। সিধা পনবা য়াবা অইবা লৈরি।',
  'lib.entry.openstax.title': 'OpenStax — ইংলিশতা লৈবা মফমদগী ফংবা লাইরিক',
  'lib.entry.openstax.what': 'কলেজ লেভেলগী লাইরিকশিং — মেথস, সাইন্স, হিউমানিতিস। পেজ খুদিংমক PDF ওইনা লৈ।',
  'lib.entry.nios.title': 'NIOS — অরাপ্পা মফমদগী তম্বা, মফমদগী ফংবা লাইরিক',
  'lib.entry.nios.what': 'ওপন অমসুং ওনলাইন কোর্সকী মফমদগী ফংবা লাইরিক, এডমিশন তৌদনা।',
  'lib.entry.nios.langs': 'হিন্দি, ইংলিশ অমসুং অতোপ্পা',
  'lib.entry.ignou.title': 'IGNOU — চাউরবা স্কুলগী মফমদগী ফংবা লাইরিক',
  'lib.entry.ignou.what': 'অরাপ্পা মফমদগী তম্বগী লাইরিকশিং মফমদগী ফংগনি।',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ইংলিশকী অরিবা লাইরিকশিং',
  'lib.entry.gutenberg.what': '৭০০০০ হেনবা লাইরিক, পুম্নমক কপিরাইট লৈত্রে। মফমদগী ফংবা ই-বুক অমসুং অদিও।',
  'lib.entry.pratham-books.title': 'Pratham Books — অঙাংশিংগী লাইরিক',
  'lib.entry.pratham-books.what': 'ভারতকী লোলশিংদা অঙাংশিংগী লাইরিক, মফমদগী ফংগনি। ক্লাস ১ দগী ৫ ফাওবা।',
  'lib.entry.pratham-books.langs': 'হিন্দি, মরাঠি, বেঙ্গলি, তামিল, তেলুগু অমসুং অতোপ্পা',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — নুমিৎ খুদিংগী পাউচৎ অমসুং অরিবা ম্যাগাজিন',
  'lib.entry.internet-archive-texts.what': 'লাখ কয়া অরিবা লাইরিক, ম্যাগাজিন অমসুং পাউচৎ — মফমদগী ফংগনি।',
  'lib.entry.wikisource.title': 'Wikisource — মীয়ামগী লাইরিক',
  'lib.entry.wikisource.what': 'কপিরাইট লৈত্রে — অসি মালেমগী অরিবা সাহিত্যগী লাইরিকশিংনি।',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ফীচার খুদিংমক',
  'lib.entry.wikimedia-commons.what': 'জাতি, ম্যাপ, তারা, পুৱারি — পুম্নমক। ফীচার খুদিংমক্তা তোঙানবা লাইসেন্স ইরি।',
  'lib.entry.pixabay.title': 'Pixabay — ফীচার অমসুং মমি',
  'lib.entry.pixabay.what': 'ফীচার, মমি অমসুং ইচং-থৌবা ভিদিও।',
  'lib.entry.unsplash.title': 'Unsplash — ফজরবা ফীচার',
  'lib.entry.unsplash.what': 'মফমদগী ফংবা, ময়েক চাউনা, একাউন্ট লৈদনা।',
  'lib.entry.openverse.title': 'Openverse — ফীচার পুম্নমক মফম অমদা',
  'lib.entry.openverse.what': 'মফমদগী ফংবা ফীচারগী সাইট কয়া অমা অমুক্তা থিবা য়াই।',
  'lib.entry.librivox.title': 'LibriVox — তাবা য়াবা লাইরিক',
  'lib.entry.librivox.what': 'অরিবা ইংলিশ লাইরিকশিংগী মফমদগী ফংবা অদিও, মীওইবগী মথৌদা।',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — অদিও কালেকশন',
  'lib.entry.internet-archive-audio.what': 'হাজার কয়া মফমদগী ফংবা অদিও — লাইরিক, ৱাহৈ, ইসৈ।',
  'lib.entry.vande-mataram.title': 'Vande Mataram — নেসনেল এন্থেম অমসুং ইসৈ',
  'lib.entry.vande-mataram.what': 'ভারতকী নেসনেল এন্থেম অমসুং অতোপ্পা নেসনেল ইসৈশিং, মফমদগী ফংগনি।',
  'art.aag-aur-bijli-ke-bachav.title': 'মৈ অমসুং কারেন্টদগী কনবগী নিয়ম',
  'art.aag-aur-bijli-ke-bachav.summary': 'য়ুমদা মৈ চাউবগী কনবগী নিয়ম — অসিবা নিয়ম',
  'art.aag-lagne-par-kya-karein.title': 'মৈ চাউরবদি করি তৌগনি',
  'art.aag-lagne-par-kya-karein.summary': 'চাউরিবা য়ুমদা মৈ — খ্বাইদগী অহানবদা করি তৌগনি, করি তৌরোইদবনি',
  'art.bimari-se-bachav.title': 'লাইনা-লাইচৎ থিংনবগী নিংথিরবা নিয়ম তরেৎ',
  'art.bimari-se-bachav.summary': 'খুৎ থুব, মাস্ক, ভেক্সিন — অসিগুম্বা থবকশিংনা লাইনা-লাইচৎ থিংনবা',
  'art.dhuwan-ka-jhakora.title': 'দুম-থোংবা নত্ত্রগা অৱাবা অমা লাকপদা থিংনবগী উপায়',
  'art.dhuwan-ka-jhakora.summary': 'হাও-হাও তৌবা, উন-হাওবা — করি তৌগনি, করম্না হসপিটাল চৎকনি',
  'art.doodh-pani-band-ho.title': 'কারেন্ট নত্ত্রগা ঈশিং অমা-অমত্তা লেপখিবদা',
  'art.doodh-pani-band-ho.summary': 'করি তৌগনি, করম্না থিংগনি, করম্না মতেং লৌগনি',
  'art.haath-ki-saafai.title': 'সাবুন লৈতনা খুৎ থুবগী উপায়',
  'art.haath-ki-saafai.summary': 'ঈশিং নত্ত্রগা সাবুন লৈতবা মতমদা',
  'cat.dhyan-aur-yoog.title': 'ধ্যান অমসুং যোগ',
  'cat.dhyan-aur-yoog.subtitle': 'মকোক থীংনবা অমসুং নুংঙাইবা ফংনবগী উপায়',
  'cat.gharelu-marammat.title': 'হুম্নগী অমাং-অতা শেমদোকপা',
  'cat.gharelu-marammat.subtitle': 'হুম্নগী অঙকপা অমাং-অতা শেমদোকপগী উপায়',
  'cat.bachchon-ki-padhai.title': 'অঙাংশিংগী পঢ়াই',
  'cat.bachchon-ki-padhai.subtitle': 'পঢ়াইদা পুক্নিং চংবা অমসুং অৱাবা ফাওবা',
  'cat.budharge-seva.title': 'নুপামচা-নুপীমহৈগী সেবা',
  'cat.budharge-seva.subtitle': 'মখোয়গী য়েংশিনবা অমসুং মতেং পাংবা',
  'cat.shishu-dekhbhal.title': 'অঙাংশিংগী য়েংশিনবা',
  'cat.shishu-dekhbhal.subtitle': 'অঙাংশিংবু ফনা য়েংশিনবা',
  'cat.dharmik-upay.title': 'ধর্মগী উপায়',
  'cat.dharmik-upay.subtitle': 'মকোক থীংনবা অমসুং নুংঙাইবা',
  'cat.pavan-grah-aur-aarti.title': 'পাবন গ্রন্থ অমসুং আরতি',
  'cat.pavan-grah-aur-aarti.subtitle': 'ভক্তিগা লোয়ননা পঢ়িবু অমসুং তাবা',
  'cat.aapatkalen-gayide.title': 'ইমার্জেন্সি গাইড',
  'cat.aapatkalen-gayide.subtitle': 'মতম চানা মতেং মথৌ তাবা',
  'cat.mahamari-suraksha.title': 'লাইনা-লাইচৎ থিংনবগী সুরক্ষ',
  'cat.mahamari-suraksha.subtitle': 'লাইনা-লাইচৎ থিংনবগী উপায়',
  'nav.tribute': 'নিংশিংবা',
  'nav.help': 'মতেং',
  'nav.reference': 'রেফরেল',
  'nav.reviews': 'মতামত',
  'nav.support': 'মতেং পাংবিয়ু',
  'nav.birthChart': 'জন্ম কুণ্ডলী',
  'jgd.title': 'ঙাক্কী জন্ম কুণ্ডলী',
  'jgd.intro': 'ঙাক্কী মিং, জন্ম তৌখিবা নুমিৎ, অমসুং জন্ম তৌখিবা মতম অমসুং মফম অদু ইবিয়ু। পুম্নমক অসি ঙাক্কী ফোনদা খক্তা ওইগনি — করিগুম্বা অমত্তা মফম অতোপ্পদা থাখিবনি।',
  'jgd.nameLabel': 'জন্মগী মিং',
  'jgd.namePlaceholder': 'মপুং ফাবা মিং',
  'jgd.nameHint': 'অঙাং ওইরিঙৈগী মিং অদু ইবিয়ু।',
  'jgd.dateLabel': 'জন্ম তৌখিবা নুমিৎ',
  'jgd.timeLabel': 'জন্ম তৌখিবা মতম',
  'jgd.timeHint': 'মতম খঙদবদি অসি খল্লিবা অসি থম্লু।',
  'jgd.placeLabel': 'জন্ম তৌখিবা মফম',
  'jgd.placeNone': 'খঙদে / খল্লু',
  'jgd.placeHint': 'জন্ম তৌখিবা সহর অদু খল্লু।',
  'jgd.submit': 'হিসাব তৌবা',
  'jgd.savePdf': 'PDF শেম্নবা',
  'jgd.again': 'অনৌবা হিসাব',
  'jgd.errDate': 'জন্ম তৌখিবা নুমিৎ অদু চুম্না ইবিয়ু।',
  'jgd.errPlace': 'জন্ম তৌখিবা সহর অদু লিষ্টতগী খল্লু, নত্ত্রগা নক্নবা সহর অদু খল্লু।',
  'jgd.numTitle': 'অঙ্ক জ্যোতিষ',
  'jgd.lifePath': 'পুন্সিগী লম্বী',
  'jgd.nameNumber': 'মিংগী নম্বর',
  'jgd.soulNumber': 'আত্মাগী নম্বর',
  'jgd.birthdayNumber': 'জন্ম নুমিৎকী নম্বর',
  'jgd.astroTitle': 'বৈদিক জ্যোতিষ',
  'jgd.nakshatra': 'নক্ষত্র',
  'jgd.pada': 'পদ',
  'jgd.rashi': 'রাশি',
  'jgd.rashiLord': 'রাশিগী লর্ড',
  'jgd.nakshatraLord': 'নক্ষত্রগী লর্ড',
  'jgd.lagna': 'লগ্ন',
  'jgd.lagnaMissing': 'লগ্ন খঙনবগীদমক জন্ম তৌখিবা মতম অমসুং মফম মথৌ তাই। মথক্তা ইবিয়ু, নত্ত্রগা খঙদবদি অসি খক্তনা ওইগনি।',
  'jgd.gunTitle': 'গুন মিলায়ন',
  'jgd.gunIntro': 'মতম অতোপ্পা মীওই অমগী মিং অমসুং পোকপা নুমিৎ অসি চংগদবনি।',
  'jgd.gunName': 'মখোয়গী মিং',
  'jgd.gunDate': 'মখোয়গী পোকপা নুমিৎ',
  'jgd.gunHint': 'অনিপক্কী মিং অমসুং পোকপা নুমিৎ লৈরবদি গুন মিলায়ন খঙবা ঙমগনি।',
  'jgd.disclaimer': 'অসি চৎনবীগী মতুং ইন্না তৌবা হিশাবনি, মঙলান নত্তে। অমত্তবা মশিং নত্ত্রগা রাশি অমত্তনা মীওই অমগী হকশেল, লন-থুম নত্ত্রগা মরী অসি লেপপা ঙমদবনি। চাউরবা ৱারেপশিং অসি দোক্তর, আইনগী পাউতাক নত্ত্রগা খঙবা মীওইশিংগী পাউতাক লৌবীয়ু।',
  'nav.menu': 'মেনু',
  'nav.openMenu': 'মেনু হাংদোকউ',
  'nav.closeMenu': 'মেনু থিংজিনউ',
  'nav.expand': 'হাংদোকউ',
  'nav.collapse': 'থিংজিনউ',
  'nav.skip': 'মপুং ওইবা ৱারোলদা চৎলু',
  'nav.language': 'লোন অহোংবা',
  'footer.pages': 'পাউরোল',
  'footer.helplines': 'মথৌ তাবা মশিং',
  'footer.free': 'VARSHA SAMADHAN AI অসি কনাদসু শেনফম লৌদে। অসি মপুং ওইনা লেম্না ফংগদবা সেৱানি।',
  'footer.readStory': 'মখোয়গী মপুং ওইবা ৱারী অসি পাবীয়ু',
  'footer.admin': 'মপুং ওইবা',
  'footer.rights': 'লেম্না ফংগদবা সেৱা',
  'footer.emergency': 'খুদক্কী ওইবা',
  'footer.ambulance': 'এম্বুলেন্স',
  'footer.women': 'নুপীগী হেল্পলাইন',
  'home.dedication1': 'গী নিংশিংবা ওইনা — মপুং ওইনা লেম্না ফংগদবা সেৱা।',
  'home.dedication2': 'নহাক্কী অৱাৎপা অদু ইবীয়ু নত্ত্রগা হায়বীয়ু।',
  'home.emergencyTitle': 'মথৌ তাবা — অথুবদা মতেং মথৌ তাই',
  'home.emergencyNote': 'অসি খ্বাইদগী হান্না পাবীয়ু। অতোপ্পা অদু মতম লৈরবদা পাবীয়ু।',
  'home.readMore': 'মপুং ওইবা পাউতাক পাবীয়ু',
  'home.chooseTopic': 'করম্বা হীরমদা খঙবা পাম্মি?',
  'home.memorialEyebrow': 'সাইট অসি কীনী',
  'home.memorialLine': 'মীয়ামগীদমক পুন্সি চুপ্পা লান্থেংনখিবা, অমসুং অরোইবদা মখোয়গী ফংগদবা অদু ফংদ্রিবা মীওইশিংগীদমক।',
  'home.memorialMore': 'মখোয়গী মপুং ওইবা ৱারী অসি পাবীয়ু',
  'home.kundaliTitle': 'পোকপা কুণ্ডলী',
  'home.kundaliNote': 'মপুং ওইবা কুণ্ডলী — ৯ গ্রহ, বিমশত্তরী দশা, ফলদেশ, যোগ, ষোড়শবর্গ, কেপি, লাল কিতাব অমসুং মশিংগী জ্যোতিষ। পুম্নমক নহাক্কী ফোনদা হিশাব তৌগনি।',
  'home.chooseTopicNote': 'মখাদা পীরিবা হীরম অসিদা ত্যাপ তৌবীয়ু। মফম খুদিংমক্তা লায়না খঙবা ঙম্নবা ৱাহৈ শিজিন্নরি।',
  'home.askHere': 'হীরম অসিগী মতাংদা হংবীয়ু',
  'home.categoryEmpty': 'হীরম অসিগী মতাংদা হৌজিক ফাওবা অমাশু ইদ্রি।',
  'home.soundTitle': 'শান্তি ওইনবা থৌনম',
  'home.soundIntro': 'শেনফম লৌদে, বিজ্ঞাপন লৈতে। মনুংগী শান্তি ওইনবা খক্তনি।',
  'home.howTitle': 'সেৱা অসি করম্না থবক তৌরি',
  'home.step1Title': 'নহাক্কী ৱাফম অদু ইবীয়ু নত্ত্রগা হায়বীয়ু',
  'home.step1Body': 'হিন্দিদা টাইপ তৌবীয়ু, নত্ত্রগা মাইক অদু ত্যাপ তৌগা হায়বীয়ু। অখন্নবা তৌবা মথৌ তাদে — নহাক্কী পুক্নিংদা লৈবা অদু ইবীয়ু।',
  'home.step2Title': 'অথুবদা পাউখুম ফংগনি',
  'home.step2Body': 'হংলকপা খুদিংমক রেজিস্তর তৌগনি অমসুং অথুবদা পাউখুম ফংগনি। চাউরবা হংবা অদুগী মমাংদা ইচিল-ইনাও ওইবা হংবা অদুনা হৌবীয়ু।',
  'home.step3Title': 'শেনফম লৌদে, অখন্নবা পাউতাক মথৌ তাদে',
  'home.step3Body': 'সেৱা অসি মপুং ওইনা লেম্ননি। নহাক্কী মিং, লৈফম নত্ত্রগা ফোন মশিং মথৌ তাদে, অমসুং বিজ্ঞাপনসু লৈতে।',
  'home.stepLabel': 'চৎনগদবা',
  'home.freeTitle': 'সেৱা অসি মপুং ওইনা লেম্ননি',
  'home.freeBody': 'শেনফম লৌদে, অখন্নবা পাউতাক মথৌ তাদে, অমসুং বিজ্ঞাপনসু লৈতে।',
  'help.q1.label': 'মৈ চৎখ্রে, করি তৌগনি?',
  'help.q1.question': 'হুমদা মৈরাক চৎখ্রে। করি তৌগনি, অমসুং মোবাইল ফোন করম্না চার্জ তৌগনি?',
  'help.q2.label': 'অঙাংশিংগী মহৈ-মশিংগী অৱাৎপা',
  'help.q2.question': 'ঐহাক্কী অঙাংশিংগী মহৈ-মশিংদা য়াম্না অৱাৎপা লৈ। ময়ুমদা করম্না ফগৎহনগনি?',
  'help.q3.label': 'নুপামাগী লায়েং',
  'help.q3.question': 'ঐহাক্কী ইপাগী চহি য়াম্না লৈরে, মহাকপু করম্না লায়েংগনি?',
  'help.q4.label': 'ময়ুমদা মৈ চাউবা',
  'help.q4.question': 'নুমিদাংদা ময়ুমদা মৈ চাউরবদি খ্বাইদগী মমাংদা করি তৌগনি?',
  'help.title': 'নহাক্কী অৱাৎপা অদু ইবিয়ু',
  'help.intro': 'মখাদা ইবিয়ু নত্ত্রগা হায়বিয়ু। খঙদবদি নহাক্কী পুক্নীংদা লৈবা অদু ইবিয়ু — অদু খ্বাইদগী মরু ওই।',
  'help.suggested': 'মীয়াম্না হংবা ৱাহং',
  'help.howTitle': 'সেবা অসি করম্না থবক তৌই',
  'help.howBody': 'হংলকপা ৱাহং খুদিংমক রেজিস্তর তৌই অমসুং চপ চাবা পাউখুম ফংই। নহাক্কী মিং, লৈফম নত্ত্রগা ফোন নম্বর কনাদসু হংদ্রে। পুম্নমক শেনফম লৈতে।',
  'ref.title': 'সেবা অসি করি অমসুং কীনগীদমকনি',
  'ref.intro': 'সেবা অসি শ্রীমতী VARSHA গী নিংশিংদা শেমখিবনি। মসিদা করি তৌই, করি লৈ, অমসুং মসিগী অরোইবা অদু করম্ননো হায়বা অদু লাইবা ৱাহৈদা হায়রি। পুম্নমক শেনফম লৈতে — শেনফম লৌদে, এদভাইজ তৌদে, অমসুং নহাক্কী পার্সোনাল ইনফরমেশন হংদে।',
  'ref.whatTitle': 'মসিদা করি লৈ',
  'ref.what1': 'ময়ুমদা মৈ চাউবা, মৈরাক চৎপা, অঙাংশিংগী মহৈ-মশিংগী অৱাৎপা, নুপা-নুপীগী য়েংশিনবা — অসিগুম্বা অৱাৎপশিংগী লাইবা পাম্বৈশিং, লাইবা ৱাহৈদা।',
  'ref.what2': 'ৱাহং হায়দুনা হংবগী খুদোংচাবা। হায়বা খঙদবদি ইবিয়ু — অনিমক্কী পাউখুম চপ মান্নৈ।',
  'ref.what3': 'হংলকপা ৱাহং খুদিংমক রেজিস্তর তৌই, মরম অদুনা অতোপ্পনা অৱাৎপা লৈবা অদু নহাক্কী মমাংদা হংলমগনি অমসুং পাউখুম ফংলমগনি।',
  'ref.what4': 'এদভাইজ লৈতে, মথৌ তাদবা পাউ লৈতে, অমসুং নহাক্কী পার্সোনাল ইনফরমেশন হংদে। পুম্নমক শেনফম লৈতে।',
  'ref.helplineTitle': 'থুনা মতেং ফংনবা নম্বর অসি থমবিয়ু',
  'ref.helpline1': 'খ্বাইদগী চাউবা অৱাৎপা লৈরবদি — মৈ চাউবা, মৈরাক চৎপা, লৈতেংবা নত্ত্রগা হুরানবা — 112 দা ফোন তৌবিয়ু।',
  'ref.helpline2': 'কনাগুম্বদা নাবা নত্ত্রগা অশোক-অপন লৈরবদি, 108 দা এম্বুলেন্স হংবিয়ু।',
  'ref.helpline3': 'নুপী অমদা অৱাৎপা লৈরবদি, নত্ত্রগা নুপী অমবু অৱাৎপা পীরবদি, 181 দা ফোন তৌবিয়ু। মসি শেনফম লৈতে।',
  'ref.helpline4': 'অঙাংশিং নত্ত্রগা নুপামাগী মতাংদা অৱাৎপা লৈরবদি, 1098 দা কমপ্লেন তৌবা য়াই।',
  'ref.helpline5': 'মীনুংদা অৱাৎপা লৈরবদি, নত্ত্রগা পুন্সিগী পুক্নীং চংদরবদি, 14416 দা হায়বা য়াই। ৱারী শাননবা খক্তনি।',
  'ref.dataTitle': 'ঐখোয়না নহাক্কী মতাংদা করি থম্লি',
  'ref.dataBody': 'নহাক্না হংলকপা ৱাহং খক্তা, মসিগী মরু ওইবা অদু, অমসুং হংলকপা মতম — মরমদি ঐখোয়না চপ চাবা পাউখুম অদু অমুক হন্না পীনবা। নহাক্কী মিং, লৈফম, ফোন নম্বর, নত্ত্রগা নহাক্কী মতাংদা খঙবা ঙম্বা ইনফরমেশন অমত্তা লৌদে। সাইত অসিদা এদভাইজ নত্ত্রগা ত্র্যাকিং স্ক্রিপ্ট লৈতে।',
  'ref.adminTitle': 'ম্যানেজরনা করি তৌবা য়াই',
  'ref.adminBody': 'ম্যানেজরনা নহাক্না থারকপা ৱাহং অদু উবা য়াই, অমসুং পাউখুম ইবা য়াই। নহাক্কী পার্মিসন লৈতনা মখোয়না অহোংবা পুরকপা নত্ত্রগা লৌথোকপা য়াদে, অমসুং নহাক্কী ইনফরমেশন কনাদসু য়োনবা য়াদে।',
  'ref.statsCategories': 'বিষয়শিং লৈরি',
  'ref.statsArticles': 'ৱাহৈশিং ইরি',
  'ref.statsQuestions': 'ৱাহং হংলক্লে',
  'ref.ownerNote': 'সেবা অসি কম্পেনী অমগী নত্ত্রগা সরকারগী নত্তে, মসি মীওই অমগী নিংশিংদা চৎথরি। মরম অদুনা মসিদা এদভাইজ লৈতে, মেম্বরশিপ লৈতে, অমসুং শেনফম লৌদে।',
  'support.title': 'সেবা অসি শেনফম লৈতে',
  'support.intro': 'সেবা অসি কনাদসু শেনফম লৌদে। অদুবু মসি চৎথরি — মরম অদুনা নহাক্না মতেং পাংবা য়াবা পাম্বৈ খর লৈ। খ্বাইদগী লাইবা পাম্বৈ অদু খ্বাইদগী কান্নৈ।',
  'support.waysTitle': 'নহাক্না করম্না মতেং পাংবা য়াই',
  'support.way1Title': 'নহাক্কী এক্সপিরিয়েন্স ইবিয়ু',
  'support.way1Body': 'সাইত অসিদগী নহাক্না কান্নবা ফংলবদি — নত্ত্রগা নহাকপু অৱাৎপা পীরবদি — অদু রাইত পেজদা ইবিয়ু। নহাক্কী মিং হায়বা মথৌ তাদে।',
  'support.way2Title': 'নহাক্কী সহরগী মতাংদা হায়বিয়ু',
  'support.way2Body': 'নহাক লৈরিবা মফম অদুগী ৱাহৈ, চৎনবী অমসুং অৱাৎপশিং অতোপ্পনি। নহাক্কী মফমগী ৱাফম খর মসিদা লৈরবদি, হায়বিয়ু — মসিদা হাপচিনবা য়াই।',
  'support.way3Title': 'নহাক্কী এক্সপিরিয়েন্স অতোপ্পদা হায়বিয়ু',
  'support.way3Body': 'মসিদা ইরিবা অসি মীয়াম কয়াগী কান্নবা ওইবা য়াই, মখোয়না খঙলবদি। মসিগী মতেং মথৌ তাবা মীওই অমদা হায়বিয়ু।',
  'support.way4Title': 'মসিদা লাক্লগা উবিয়ু',
  'support.way4Body': 'নহাক্কী মতম লৈরবদি, সাইত অসি ফনা চৎলিরা নত্ত্রগা নত্ত্রগা উবিয়ু। অৱাৎপা লৈরবদি হায়বিয়ু — শেনফম লৈতনা ফগৎহনগনি।',
  'support.contactTitle': 'করিগুম্বা হায়বা লৈরা?',
  'support.contactBody': 'করিগুম্বা ৱাফমগীদমক মসিদা ইবা য়াই — অৱাৎপা লৈরবদি, নত্ত্রগা হেন্না ফংলবদি, নত্ত্রগা ৱাহং লৈরবদি। নহাক্না ইবা লাইবা ফাওরবদি, অদু খক্তা ইবিয়ু।',
  'support.faqTitle': 'মীয়াম্না হংবা ৱাহং খর',
  'support.faqBody': 'মসি থাজবা য়াইদনা শেনফম লৈতে? অদুনি। নহাক্কী মিং হায়বা মথৌ তাদে? নত্তে, মিং হায়বা মথৌ তাদে। এদভাইজ লৈরা? লৈতে। ফোন নম্বর নত্ত্রগা লৈফম হংদে? নত্তে। অ্যাপ ডাউনলোড তৌগদবরা? নত্তে, ব্রাউজরদা হংবা য়াই।',
  'ask.label': 'নহাক্কী অৱাৎপা অদু ইবিয়ু নত্ত্রগা মাইকনা হায়বিয়ু',
  'ask.placeholder': 'খুদম: অঙাংশিংগী মহৈ-মশিংদা অৱাৎপা লৈ',
  'ask.help': 'এন্তর তৌদুনা থারকপা য়াই।',
  'ask.send': 'হংবিয়ু',
  'ask.sending': 'খল্লি…',
  'ask.clear': 'ইবা অদু মুত্থোকপা',
  'ask.speak': 'হায়দুনা হংবিয়ু',
  'ask.listening': 'হায়বা হৌবীয়…',
  'ask.heard': 'খঙজিল্লি',
  'ask.stopListening': 'খঙবা থমথৌ',
  'ask.suggested': 'মখল কয়াগী হংনবা ৱাহং',
  'ask.answerTitle': 'পাউখুম',
  'ask.listen': 'খঙবীয়',
  'ask.stopSpeak': 'থমথৌ',
  'ask.aiNote': 'পাউখুম অসি AI না পীরকপনি। অখঙ-অহৈগী পাউতাক্কী মহুৎ শিনবা ঙম্লোই।',
  'ask.errorRateLimit': 'ৱাহং কয়া অমুক্তদা হংলকপা ঙম্লোই। খরা থম্লগা অমুক হন্না হোৎনবীয়।',
  'ask.errorNetwork': 'ইন্তরনেত চৎতদ্রি। কনেক্সন য়েংশিনবীয় অমসুং অমুক হন্না হোৎনবীয়।',
  'ask.notAnswer': 'ৱাহং অসিগী চপ চাবা পাউখুম ঐখোয়দা লৈতে।',
  'ask.emptyAnswer': 'মসিগী পাউখুম অসি পীরকপা ঙমদ্রে। খরা তোঙান্না হংবীয়।',
  'ask.micUnsupported': 'ব্রাউজর অসিদা হায়দুনা হংবা ঙম্লোই। ইখৎলগা হংবীয়।',
  'ask.heardWith': 'মসি খঙজিল্লি:',
  'voice.notAllowed': 'মাইক শিজিন্ননবা পার্মিসন লৈতে। মথক্তা চৎলগা পার্মিসন পীবীয়, নত্রগা ইখৎলগা হংবীয়।',
  'voice.serviceNotAllowed': 'মাইক শিজিন্ননবা পার্মিসন লৈতে। মথক্তা চৎলগা পার্মিসন পীবীয়, নত্রগা ইখৎলগা হংবীয়।',
  'voice.noSpeech': 'হায়বা অমত্তা তাদ্রে। মাইক মনাক্তা হায়বীয়, নত্রগা ইখৎলগা হংবীয়।',
  'voice.audioCapture': 'মাইক অমত্তা ফংদ্রে। দিভাইস অমুক হন্না শম্নবীয়, নত্রগা ইখৎলগা হংবীয়।',
  'voice.network': 'হায়দুনা হংনবা ইন্তরনেত মথৌ তাই, অদুবু চৎতদ্রি। ইখৎলগা হংবীয় — পাউখুম অদু অদুনা ফংগনি।',
  'voice.aborted': 'থমথৌরে। অমুক হন্না হোৎনবীয়।',
  'voice.unsupported': 'ব্রাউজর অসিদা হায়দুনা হংবা ঙম্লোই। ইখৎলগা হংবীয়।',
  'voice.speakFailed': 'পাউখুম অসি হায়বা ঙমদ্রে।',
  'voice.noVoice': 'দিভাইস অসিদা {name} হায়বা ঙম্বা মথৌ লৈতে। হৌজিক ইখৎলিবসি পাবীয়, নত্রগা ফোনগী সেত্তিঙদা চৎলগা মথৌ অদু শম্নবীয়।',
  'voice.generic': 'খরা ফত্তে। অমুক হন্না হোৎনবীয়।',
  'sound.title': 'থৌনা ফংনবা ইশৈ',
  'sound.intro': 'শেল লৈতে, অদুমক বিজ্ঞাপন লৈতে। নুংঙাইবা ফংনবা খক্তনি।',
  'sound.playing': 'ইশৈ চৎলি। থমথৌনবা অমুক হন্না বাত্তন অদু নীবীয়।',
  'sound.shankh': 'শঙ্খ',
  'sound.shankhHint': 'মথৌ অৱাংবা, শাংবা',
  'sound.bansuri': 'বাংসুরি',
  'sound.bansuriHint': 'মথৌ নেম্বা, অঙনবা',
  'sound.dhol': 'নগারা',
  'sound.dholHint': 'মথৌ অৱাংবা, থুনা',
  'sound.all': 'অহুম্মক',
  'sound.allHint': 'অমুক্তদা',
  'sound.listenLabel': 'খঙবীয়',
  'sound.errUnsupported': 'ব্রাউজর অসিদা ইশৈ অসি চৎপা ঙম্লোই।',
  'sound.errGeneric': 'ইশৈ চৎপদা অৱাবা লৈরে।',
  'dhun.welcome': 'স্বাগতম',
  'dhun.prompt': 'শঙ্খ, বাংসুরি অমসুং নগারা — অমুক্তদা খঙনবা নীবীয়।',
  'dhun.listen': '▶ খঙবীয়',
  'dhun.skip': 'ইশৈ অসি থাদোকপীয়',
  'dhun.failed': 'ইশৈ অসি চৎপা ঙমদ্রে।',
  'dhun.label': 'ইশৈ চৎনবা পার্মিসন',
  'reviews.title': 'নহাক্কী ৱাখল্লোন, নহাক্কী ৱারী',
  'reviews.intro': 'সেবা অসি নহাক্কী কান্নবা ওইব্রা? নহাক্কী ৱাখল্লোন ইবীয় — নহাক্কী মিং ইবা মথৌ তাদে।',
  'reviews.pageTitle': 'নহাক্কী ৱাখল্লোন',
  'reviews.pageIntro': 'মফম অসিদা মীওইশিংনা ইবীরিবা অদু লৈরি। অমত্তা লুপথোকপা লৈতে, অমসুং ইবীরিবা অদু মফম অসিদা উগনি — য়েংলবা মতুংদা ফোঙগনি।',
  'reviews.write': 'নহাক্কী ৱাখল্লোন ইবীয়',
  'reviews.submit': 'থাবীয়',
  'reviews.sending': 'থারি…',
  'reviews.name': 'নহাক্কী মিং (মথৌ তাদে)',
  'reviews.city': 'নহাক্কী সহর (মথৌ তাদে)',
  'reviews.comment': 'নহাক্কী ৱারী',
  'reviews.placeholder': 'নহাক্কী ৱাখলদা লৈবা অদু ইবীয় — অৱাৎপা লৈরবসু ফৈ।',
  'reviews.moderated': 'নৌংমৈনবাগী মমাংদা নহাক্কী রিভ্যু অদু য়েংশিনগনি।',
  'reviews.moderationNote': 'খুদম চংদনবগীদমক, রিভ্যু খুদিংমক ফোংদ্রিঙৈদা য়েংশিনগনি। অশৈবা ৱাহৈ, নম্বর নত্রগা মথৌ তাবা নত্তবা ৱাফমশিং লৌথোক্কনি — অতোপ্পা পুম্নমক অসিগুম্না ফোংগনি।',
  'reviews.summaryTitle': 'মীয়ামগী ৱাখল্লোন',
  'reviews.count': 'রিভ্যুশিং',
  'reviews.anonymous': 'মিং লৈতনা',
  'reviews.summaryLine': 'মীয়াম্না অপুনবা ওইনা 5 দগী {rating} ফংহনখি, {count} তারকশিং পীরি।',
  'reviews.starsLabel': '5 দগী {value} তারক',
  'reviews.keepLabel': 'অফবা নত্রগা অরাইবা — অনিমক ইবিয়ু',
  'reviews.ownerReply': 'পাউখুম',
  'reviews.replyLabel': 'মসিগী মতাংদা ইরি',
  'reviews.empty': 'হৌজিক ফাওবা রিভ্যু অমত্তা লৈতে। অহানবা ওইনা নহাক ইবিয়ু।',
  'reviews.toastSent': 'থাগৎচরি',
  'reviews.toastFailed': 'রিভ্যু থাবা ঙমখিদ্রে',
  'reviews.fieldTooShort': 'ময়াম অসিদা 10 মরম চানা ইবিয়ু।',
  'reviews.rateLimited': 'খুংগংদা থারিবা অসি য়াম্না থুনা ওইরি। খরা থীংজিন্দুনা অমুক হন্না হোৎনবীয়ু।',
  'cat.notFound': 'মসিগী পেজ অসি ফংদ্রে',
  'cat.empty': 'মসিগী মতাংদা হৌজিক ফাওবা অইবা লৈতে।',
  'article.emergency': 'মথৌ তাবা',
  'article.askAbout': 'মসিগী মতাংদা হংবিয়ু',
  'article.readAloud': 'মসিগী অইবা অসি তাশিনবিয়ু',
  'article.others': 'মসিগী মতাংদা অতোপ্পা অইবা',
  'article.count': '{count} অইবা',
  'theme.toLight': 'মৈ অসিদা ওন্থোকপা',
  'theme.toDark': 'অঙনবা অসিদা ওন্থোকপা',
  'toast.dismiss': 'লোইশিনবিয়ু',
  'language.choose': 'নহাক্কী লোল খনবিয়ু',
  'language.articlesIn': 'মসিগী অইবা অসি হিন্দীদা লৈরি।',
  'language.articlesInHint': 'লোল খুদিংমক্তা অতোপ্পা ওনবা মথৌ তাই। মসিগী ওনবা অসি হৌজিক ফাওবা লৈতে — মসি হিন্দীদা লৈরিবা অসি মপুং ফানা লৈরি।',
  'ask.welcome': 'স্বাগতম! মখাদা নহাক্কী অৱাবা অদু ইবিয়ু নত্রগা মতাং অমা খনবিয়ু।',
  'ref.notTitle': 'মসিদা তৌবা ঙমদবশিং',
  'ref.not1': 'মসি ডোক্তর নত্তে। হিদাক-লাংথককী পাউতাক পীরোই।',
  'ref.not2': 'মসি লয়্যার নত্তে। আইনগী পাউতাক পীরোই।',
  'ref.not3': 'হকচিনবা অমত্তা লৈতে, অমসুং অতোপ্পা অইবা অমত্তা উৎলোই।',
  'ref.not4': 'নহাক্কী মিং, লৈফম নত্রগা ফোন নম্বর হংলোই অমসুং থমলোই।',
  'ref.not5': 'সরকারগী স্কিমগী মমল নত্রগা নম্বর পীরোই — মপুং ফানা খঙদবা ৱাফমদি খঙদে হায়না খঙহনগনি।',
  'ref.medicalTitle': 'মথৌ তাবা: মসি ডোক্তরগী পাউতাক নত্তে',
  'ref.medicalBody': 'না-নাৎ, হিদাক-লাংথক নত্রগা অতোপ্পা অৱাবা অমহেক্তা ওইরবদি, অহানবা ওইনা ডোক্তরগা উনবিয়ু। মসিদা পীরিবা পাউ অসি সাধারণ মতেংগীদমক খক্তনি। অঙাংগী ভেক্সিন, মফম লৈবা, নত্রগা হিদাক হৌদ্রিঙৈদা ডোক্তরগী পাউতাক লৌবিয়ু।',
  'ref.statsTitle': 'মখল কয়াগী পাউ লৈরি',
  'support.howTitle': 'ঐখোয়দা মতেং কয়া পাংগনি',
  'support.alwaysFreeTitle': 'মসিগী সেবা অসি মতম পুম্বদা লৈতে',
  'support.alwaysFreeBody': 'মতেং পাংবা পুম্নমক অসি সেবা অসি চলাইবদা শিজিন্নগনি। মসিগীদমক অমত্তদা হংলোই।',
  'smriti.eyebrow': 'নিংশিংবা',
  'smriti.whyTitle': 'মসিগী সাইট অসি করিগী লৈরি',
  'smriti.ending': 'মখোয়গী লান্থেংনবা অদু মখা চৎথরি।',
  'article.askAny': 'হংবা পাম্বিবা হংবিয়ু',
  'article.remember': 'নিংশিংবিয়ু',
  'article.emergencyInfo': 'মথৌ তাবা পাউ',
  'article.medicalTitle': 'মসি হিদাক-লাংথককী পাউতাক নত্তে',
  'article.medicalBody': 'মসি সাধারণ মতেংগীদমক খক্তনি। হিদাক অমত্তা হৌদোকপা নত্রগা লোইশিনবা তৌবিয়ু — অহানবা ওইনা ডোক্তরগা উনবিয়ু।',
  'article.heading': '{category} গী অইবা',
  'reviews.rateQuestion': 'তারক কয়া পীরি?',
  'reviews.starsShort': '{value} তারক',
  'reviews.averageOutOf': '5 দগী {value} তারক',
  'dhun.welcomeTitle': 'স্বাগতম',
  'dhun.consent': 'শঙ্খ, বাঁশুরী অমসুং নগাডা — পুন্না তাশিনবগীদমক চিপ তৌবিয়ু।',
  'dhun.unsupported': 'ব্রাউজার অসিদা সাউন্দ হৌদবা ঙমদ্রে।',
  'dhun.failedTry': 'সাউন্দ হৌদবদা অৱাবা লৈরে।',
  'sound.hintIdle': 'বাটন অমদা নোত্পু সাউন্দ তাবা ঙমগনি।',
  'sound.hintPlaying': 'সাউন্দ হৌরে। লেপহন্নবা অমুক হন্না বাটন অদুদা নোত্পু।',
  'sound.preparing': 'সাউন্দ শেমশিল্লি',
  'nav.path': 'লমজিং',
  'health.heading': 'নহাক্কী চহি খঙহনবিয়ু',
  'health.intro': 'চহিগী মতুং ইন্না হংবা য়াবা ৱাহং কয়া অসিদা উগনি। বাটন অমদা নোত্পু — ৱাহং অদু মখাদা লাক্কনি, অদুগা হংবিয়ু।',
  'health.ageLabel': 'চহি',
  'health.years': 'চহি',
  'health.bandsLabel': 'চহিগী মতুং ইন্না খনবীয়ু',
  'health.notAdviceStrong': 'মসি লাইয়েংবগী পাউতাক নত্তে।',
  'health.notAdvice': 'হিদাক-লাংথক অমত্তা হৌদোকপা নত্ত্রগা লেপকনু — হান্না দোক্তরগা ৱারী শান্নবিয়ু।',
  'health.emergencyStrong': 'খ্বাইদগী মথৌ তাবদা ফোন তৌবিয়ু:',
  'health.emergencyCall': '(খ্বাইদগী মথৌ তাবা)',
  'health.emergencyAmbulance': '(এম্বুলেন্স)',
  'health.emergencyWomen': '(নুপীগী হেল্পলাইন)',
  'health.privacy': 'মিং নত্ত্রগা লৈফম খঙহনবগী মথৌ তাদে।',
  'health.band.infant.label': '0 – 2 চহি',
  'health.band.infant.note': 'মচিন-মনা খঙদ্রিবা অঙাংশিং',
  'health.c.infant1': 'অনা-অয়েক অৱাবা',
  'health.q.infant1': 'অঙাং অসিদা অনা-অয়েক অৱাবা লৈরে, ঈশিং-ঈথৈ পীরিবা?',
  'health.c.infant2': 'চাক চাদ্রে',
  'health.q.infant2': 'অঙাং অসি চাক চাদ্রে, করি তৌগনি?',
  'health.c.infant3': 'অৱাই-অহুম তৌরি',
  'health.q.infant3': 'অঙাং অসি অৱাই-অহুম তৌরি, কনা দোক্তরদা উৎলুগনি?',
  'health.c.infant4': 'হুম-হুম তৌরি',
  'health.q.infant4': 'অঙাং অসি হুম-হুম তৌরি, করি পীরিবা?',
  'health.band.child.label': '3 – 12 চহি',
  'health.band.child.note': 'ৱা ঙাংবা ঙম্বা অদুবু ৱাহং হংবা কাইবা অঙাংশিং',
  'health.c.child1': 'পড়াইদা পুক্নিং চংদে',
  'health.q.child1': 'পড়াইদা পুক্নিং চংদ্রে, করি তৌগনি?',
  'health.c.child2': 'স্কুল চৎপা পামদে',
  'health.q.child2': 'স্কুল চৎপা পামদ্রে, মরম অসি করি ওইবা য়াই?',
  'health.c.child3': 'নুমীদা অনা-অয়েক',
  'health.q.child3': 'নুমীদা অনা-অয়েক অৱাবা লৈরে, করি তৌগনি?',
  'health.c.child4': 'হাকচিং হুরকপা',
  'health.q.child4': 'হাকচিং হুরকপা, করি তৌগনি?',
  'health.band.teen.label': '13 – 17 চহি',
  'health.band.teen.note': 'ৱা খঙবা ঙম্বা অদুবু ৱারী শান্নবা মীওই লৈদবা অঙাংশিং',
  'health.c.teen1': 'পড়াইগী অৱাবা',
  'health.q.teen1': 'পড়াইগী অৱাবা লৈরে, করি তৌগনি?',
  'health.c.teen2': 'ইমুম তৌদে',
  'health.q.teen2': 'ইমুম তৌদ্রে, করি তৌগনি?',
  'health.c.teen3': 'মোবাইলগী অৱাবা',
  'health.q.teen3': 'মোবাইলগী অৱাবা লৈরে, করি তৌগনি?',
  'health.c.teen4': 'খল্লগা অৱাবা',
  'health.q.teen4': 'খল্লগা অৱাবা ওইরে, কনাগা ৱারী শান্নগনি?',
  'health.band.young.label': '18 – 30 চহি',
  'health.band.young.note': 'থবক, শেল অমসুং ইমুম — অৱাবা কয়া লৈবা',
  'health.c.young1': 'থবককী অৱাবা',
  'health.q.young1': 'থবককী অৱাবা লৈরে, করি তৌগনি?',
  'health.c.young2': 'খং-খুদা অৱাবা',
  'health.q.young2': 'খং-খুদা অৱাবা লৈরে, করি তৌগনি?',
  'health.c.young3': 'ইমুম তৌদে',
  'health.q.young3': 'নুংথিলকপা ঙমদ্রে, করি তৌগনি?',
  'health.c.young4': 'পৈসা অৱাৎপা',
  'health.q.young4': 'পৈসা অৱাৎপা অমসুং চৎখৎপা য়ামজিল্লি, করি তৌগনি?',
  'health.band.middle.label': '৩১ – ৪৫ চহি',
  'health.band.middle.note': 'ইমুং, অঙাং অমসুং মশাগী হকশেল — পুম্নমক অমুক্তদা থৌদাং লৌবা',
  'health.c.middle1': 'কোকথুম নাবা',
  'health.q.middle1': 'কোকথুম নাবা অসি করিগুম্বনা ওইবগে?',
  'health.c.middle2': 'নুংথিলকপা ফত্তবা',
  'health.q.middle2': 'নুংথিলকপা ফত্তে, ফগৎহন্নবা করি তৌগনি?',
  'health.c.middle3': 'ইমুংগী অৱাবা',
  'health.q.middle3': 'ইমুংদা অৱাবা য়ামজিল্লি, অঙাংশিং অসি করম্না য়েংশিনগনি?',
  'health.c.middle4': 'পাকথোক নাবা',
  'health.q.middle4': 'থবক তৌবদা চহি কয়াগী মমাংদগী পাকথোক নাবা অসি ওইরি, করি তৌগনি?',
  'health.band.later.label': '৪৬ – ৬০ চহি',
  'health.band.later.note': 'হকচাংগী চহি অমসুং মসিগী য়েংশিনবা — অনিমক অমুক্তদা',
  'health.c.later1': 'মপুং নাবা',
  'health.q.later1': 'ঐহাক্কী চহি ৫৪নি অমসুং মপুং নাবা অসি করিগুম্বনা ওইবগে?',
  'health.c.later2': 'কোক নাবা',
  'health.q.later2': 'কোক নাবা অসি চৎপা-থোকপদা ওইরি, করিগুম্বনা?',
  'health.c.later3': 'নুংথিলকপা খোং নাবা',
  'health.q.later3': 'নুংথিলকপা খোং নাবা অসি ওইরি, করি তৌগনি?',
  'health.c.later4': 'নুংথিরকপা মফম নাবা',
  'health.q.later4': 'নুংথিরকপা মফম নাবা অসি করিগুম্বনা ওইবগে?',
  'health.band.senior.label': '৬১ – ৭৫ চহি',
  'health.band.senior.note': 'হিদাক-লাংথক, তৌবা-ঙম্বা অমসুং খেন্নবা — অহুম্মক অমুক্তদা',
  'health.c.senior1': 'চৎপদা অৱাবা',
  'health.q.senior1': 'কোক নাবা অসি য়াম্না নাবা মরমনা চৎপা ঙমদ্রে, করি তৌগনি?',
  'health.c.senior2': 'হিদাক য়েংশিনবা',
  'health.q.senior2': 'হিদাক কয়া নুংতি চাবা তৌই — করিগুম্বা অসিগী মরমদা করম্না খঙগনি?',
  'health.c.senior3': 'নুংথিলকপা ঈশিন থোকপা',
  'health.q.senior3': 'নুংথিলকপা ঈশিন থোকপা অসি য়াম্না ওইরি, করি তৌগনি?',
  'health.c.senior4': 'তৌবা ফত্তবা',
  'health.q.senior4': 'তৌবা ফত্তে, তৌবা ফগৎহন্নবা করি তৌগনি?',
  'health.band.elder.label': '৭৬ – ১০০ চহি',
  'health.band.elder.note': 'হিদাক খুদিংমক য়েংশিনবা মথৌ তাই, তিংবা খুদিংমক অৱাবা ওই',
  'health.c.elder1': 'তিংবগী অকিবা',
  'health.q.elder1': 'ইমুংদা তিংবগী অকিবা লৈ, করি ঙাকশেল লৌগনি?',
  'health.c.elder2': 'মিৎয়েং ফত্তবা',
  'health.q.elder2': 'মিৎয়েং ফত্তবা অসি ওইরি, করি তৌগনি?',
  'health.c.elder3': 'নুংতি নাবা হিদাক',
  'health.q.elder3': 'নাবা হিদাক নুংতি চাবা তৌই — মসিগী অৱাবা লৈব্রা?',
  'health.c.elder4': 'ডাক্তরগী মফমদা',
  'health.q.elder4': 'খুদমদা ডাক্তারগী মফমদা চৎপা মথৌ তাই?',
  'ask.notConfigured': 'VARSHA SAMADHAN AI অসি হৌজিক অরিবা পাউখুমশিংদগী পাউখুম পীরি। নহাক্কী হংবা অদু ফংদ্রে।',
  'ask.browseTitle': 'মফম অসিদা লৈরিবা ই-পাউশিং অসি য়েংবীয়ু',
  'download.pdf': 'PDF দা ইবীয়ু',
  'download.text': 'টেক্সট দা ইবীয়ু',
  'download.printNow': 'প্রিন্ট তৌবীয়ু',
  'download.preparing': 'শেম-শারি',
  'download.blocked': 'অনৌবা ট্যাব হাংদবা ঙমদ্রে। Pop-up অসি ব্লক তৌরি — নহাক্কী ব্রাউজরতগী অতোপ্পা ট্যাব অমা হাংবীয়ু।',
  'attach.button': 'নহাক্কী দকুমেন্ত নত্ত্রগা ফোটো হাপচিনবীয়ু',
  'attach.formats': 'PDF, ফোটো (JPG/PNG) নত্ত্রগা টেক্সট ফাইল — ১২ MB ফাওবা',
  'attach.reading': 'পারি...',
  'attach.attached': 'হাপচিনখ্রে',
  'attach.remove': 'হাৎথোকপীয়ু',
  'attach.tooBigPdf': 'PDF অসি 12 MBদগী হেন্না চাউই। অমত্তা নৌনা চামজবা ফাইলে অমগা হন্থরকউ।',
  'attach.tooBigImage': 'ফোটো অসি 3 MBদগী হেন্না চাউই। চামজবা ফোটো অমগা হন্থরকউ।',
  'attach.scannedPdf': 'PDF অসি স্কান তৌরবনি — মসিদা ফোটো খক্তা লৈ, পবা ঙমদ্রে। মসিগী ফোটো অমগা থবীরকউ।',
  'attach.pdfFailed': 'PDF অসি পবা ঙমদ্রে।',
  'attach.imageFailed': 'ফোটো অসি লোৎলকদ্রে।',
  'attach.wrongType': 'ফাইল অসি চৎলোই। PDF, ফোটো নত্রগা তেক্ত ফাইল অমগা থবীরকউ।',
  'attach.hint': 'নগী কাগজ মসিদা থিদুনা হংবীরকউ — ঐখোয়না মদুগী মতুং ইন্না পাউখুম পীরগনি।',
  'ask.sendWithFile': 'পাউখুম পীরকউ',
  'lib.title': 'ফ্রি লাইব্রেরি',
  'lib.intro': 'পারিবা লাইরমশিং, লাইরিকশিং, ফোটো অমসুং অওদিও — পুম্নমকফ্রি অমসুং লৈঙাক্কী মতিক চানা।',
  'lib.legalTitle': 'কোপিরাইটকী অৱাবা করিম্বসু লৈতে।',
  'lib.legal': 'মসিদা পীরিবা পুম্নমক অসি লেমহৌরবনি অমসুং মসি মখা তারগা শিংনবসু য়াই। হৌজিক কোপিরাইট লৈরিবা লাইরিক অসিদা লৈতে — মসি কোপি তৌবা য়াদে, মসি মীক্না য়েংসিবা ৱার্নি।',
  'ask.signInFirst': 'হৌগৎনবা পুংথোং লমজিং অমদা লৈবীরকউ, মদুতা হংবীরকউ।',
  'ask.signInTitle': 'হৌগৎনবা পুংথোং লমজিং অমদা লৈবীরকউ',
  'ask.signInBody': 'ৱাহং হংনবা নগী একাউন্ট শেম্মু। মসি পুংজি অমগী মখাদা মতম চঙদে, অমসুং নহাক্না মখা তারগা হংবা য়াই।',
  'ask.signInCta': 'একাউন্ট শেম্মু নত্রগা লৈবীরকউ',
  'ask.signInOr': 'হৌজিক একাউন্ট শেম্বা ঙমদ্রিরা? মসিগা লোয়ননা নখোয়গী থবক তৌবা য়াই:',
  'account.title': 'ঐগী একাউন্ট',
  'account.intro': 'নগী মমীং অমসুং পাসৱর্দ থমদুনা ৱাহং হংবা হৌগৎকউ।',
  'account.signIn': 'লৈবীরকউ',
  'account.register': 'একাউন্ট শেম্মু',
  'account.signInNote': 'হৌখিবা তাংকক্তা থমখিবা মমীং অমসুং পাসৱর্দ থমউ।',
  'account.registerNote': 'ৱাহং হংনবা একাউন্ট তঙাইফদে। মসি নগী লোল অমসুং পাউখুম নিংশিংনবনি।',
  'account.handle': 'নগী মমীং',
  'account.handlePlaceholder': 'খুদম ওইনা: sita.ji',
  'account.password': 'পাসৱর্দ',
  'account.passwordHint': 'খ্বাইদগী নেপসি 6 চঙই।',
  'account.phone': 'ফোন নম্বর',
  'account.optional': 'তঙাইফদে',
  'account.phoneHint': 'পীনবা পাম্লবদি পীবীয়ু। ফোন নম্বর পীদবা য়াওরবসু একাউন্ট শেমগনি।',
  'account.create': 'একাউন্ট শেম্মু',
  'account.logout': 'থোরকউ',
  'account.open': 'একাউন্ট হাংদোকউ',
  'account.signedInAs': 'নহাক লৈবীরক্লে',
  'account.signedOut': 'একাউন্ট হাংদোক্লি',
  'account.signedOutBody': 'হৌজিক একাউন্ট অমত্তা হাংদোক্লিদে।',
  'account.saved': 'লুপ্পা পাউখুমশিং',
  'account.savedEmpty': 'হৌজিক পাউখুম লুপ্পা অমত্তা লৈতে। পাউখুম লাকপদা \'লুপ্পা\' থেক্কউ।',
  'account.savedUnavailable': 'লুপ্পা পাউখুমশিং হৌজিক উদের। অতোপ্পা পুম্নমক চৎলি।',
  'account.wait': 'করমদুগী ঙাইরকউ…',
  'account.privacyTitle': 'নগী ৱাথোকশিং হিংনা লৈ',
  'account.privacyBody': 'একাউন্ট শেমবদা নগী মমীং, পাসৱর্দ অমসুং লোল খক্তা থম্লি। ৱাহংগী রেকোদ অমত্তা থমদে। নগী ৱাহং কনাগুম্বদা থাথে।',
  'account.errWrong': 'মমীং নত্রগা পাসৱর্দ চঙদ্রে।',
  'account.errTaken': 'মমীং অসি হান্ননা লৌখ্রে। অতোপ্পা মমীং অম খংদোকউ।',
  'account.errBad': 'পাউ অসি মতিক চানা থমউ।',
  'account.errWait': 'হায়বা য়াম্না লৈখ্রে। মতম অমগী মতুংদা হোৎনবিয়ু।',
  'account.errTryLater': 'হৌজিক তৌবা ঙমদ্রে। মতম অমগী মতুংদা হোৎনবিয়ু।',
  'lib.licence.ccBy': 'নহাক্না মসি কোপি অমসুং শেয়র তৌবা য়াই, শিংনবসু য়াই — মফমগী মমীং পীবীয়ু।',
  'lib.licence.ccBySa': 'নহাক্না মসি কোপি অমসুং শিংনবা য়াই। অহোংবা পুরকপশিং মীয়ামদা ফোংদোক্কদবনি।',
  'lib.licence.ccZero': 'মপুং ফানা ফ্রি। মফমগী মমীং পীবসু তঙাইফদে।',
  'lib.licence.pd': 'কোপিরাইট করিম্বসু লৈতে — পাম্বসিনা কোপি তৌবা য়াই।',
  'lib.licence.govtIndia': 'ভারত সরকারগী ৱেবসাইটতা লৈরি। পবা অমসুং শিংনবদি ফ্রি অদুনি।',
  'lib.licence.creativeCommons': 'ফাইল খুদিংমক মশা মগী লাইসেন্স লৈ — ফাইলদা য়েংবিয়ু।',
  'lib.licence.freeToRead': 'পবা অসি ফ্রি অদুনি। কোপি তৌদুনা মখা তারগা পীবদি মসি ফংখিবগী মতিক ইন্না তৌগনি।',
  'lib.openBadge': 'হাংবা',
  'lib.openBadgeNote': 'মসি কপি তৌবা য়াই',
  'lib.freeBadge': 'মফৎ',
  'lib.freeBadgeNote': 'পাবা য়াই, কপি তৌবা য়াদে',
  'lib.govt': 'সরকারি',
  'lib.noSignup': 'অ্যাকাউন্ট লৈতনা',
  'lib.open': 'মফম অসিদা হাংদোকউ',
  'lib.group.padhai': 'পাওখুমগী লাইরিকশিং',
  'lib.group.padhai.note': 'স্কুল, কলেজ অমসুং সরকারি মহৈ-মশিংগী পাউতাক',
  'lib.group.kitab': 'লাইরিকশিং',
  'lib.group.kitab.note': 'কপিরাইট লৈতবা নত্ত্রগা কপি তৌনবা অয়াবা লৈবা',
  'lib.group.tasveer': 'মমি অমসুং ছবি',
  'lib.group.tasveer.note': 'ম্যাপ, মমি, চিহ্ণ — পুম্নমক',
  'lib.group.audio': 'থাংগদবা পাউতাক',
  'lib.group.audio.note': 'লাইরিক তাবা, ইবা নত্তে',
  'lib.warnTitle': 'লাইরিক পুম্নমক মফম অসিদা লৈতে',
  'lib.warn': 'খরা লাইরিকশিং কপিরাইট লৈরি অমসুং আইনগী মতুং ইন্না মফৎতা পীনবা য়াদে। ঐখোয়না মসি খঙনা উৎলিদে। করিগুম্বা লাইরিক অমত্তা মথৌ তাইরবদি মখাদা হংবিয়ু — ফংবা য়াবা পাউখুমদি ফংগনি।',
  'lib.askInstead': 'হংবিয়ু',
  'nav.library': 'লাইব্রেরি',
  'support.contactMessageLabel': 'নহাক্কী পাউ',
  'support.contactPlaceholder': 'মসিদা ইবিয়ু — করিগুম্বা অরেম্বা লৈরবদি, ফবা অমত্তা ফংলবদি, নত্ত্রগা করিগুম্বা হংবা লৈরবদি।',
  'support.contactHelp': 'ময়েক ১০দগী তানা ইগনু। মসি হকথেংননা ওনরদা চৎলি।',
  'support.contactSubmit': 'থল্লু',
  'support.contactSending': 'থল্লি…',
  'support.contactPrivacy': 'নহাক্কী মিং ইবা মথৌ তাদে।',
  'support.contactSent': 'ফংলে',
  'support.contactSentBody': 'নহাক্কী পাউ অদু ওনরদা ফংলে।',
  'support.contactFailed': 'থলবা ঙমদে',
  'support.faq1Q': 'মসি মফৎনি হায়বা অসি থাজবা য়াইরা?',
  'support.faq1A': 'হৈ। শেল লৌদে, বিজ্ঞাপন লৈতে, অমসুং মেম্বরশিপ লৈতে। মসি মীওই অমগী শেলনা চৎলি, কম্পানি নত্ত্রগা সরকারগী শেলনা নত্তে।',
  'support.faq2Q': 'ঐহাক্কী মিং, লৈফম নত্ত্রগা ফোন নম্বর লৌইরা?',
  'support.faq2A': 'লৌদে, অমসুং লৌরোইদবনি। মসিগী সাইট অসিদা খঙনবা লৈতে — লগইন লৈতে, ট্র্যাকিং লৈতে। নহাক্কী হংবা খক্তা হংই।',
  'support.faq3Q': 'মসি ডোক্তর নত্ত্রগা লয়্যারনিরা?',
  'support.faq3A': 'নত্তে। মসিদা হিদাক-লাংথক্কী নত্ত্রগা আইনগী পাউতাক পীরমদে। করিগুম্বা অৱাবা লৈরবদি ডোক্তর নত্ত্রগা অফিশলদা চৎনবা হায়গনি — মসি মখোয়গী মহুৎ শিনবা নত্তে।',
  'support.faq4Q': 'পুম্নমক পাউখুম অসি চুম্মি হায়বা য়াইরা?',
  'support.faq4A': 'হায়বা য়াদে। পাউখুম অসি কম্পিউটারনা ইবনি, ডোক্তরনা নত্তে — মরম অদুনা মসি হিদাক-লাংথক্কী পাউতাক নত্তে হায়না ইরি। হিদাক চাবা হৌবা নত্ত্রগা থাদোকপগী মমাংদা ডোক্তরগা উনবিয়ু।',
  'support.faq5Q': 'ঐহাক্না অ্যাপ ডাউনলোড তৌগদবনিরা?',
  'support.faq5A': 'নত্তে। মসি ব্রাউজরমক্তদা হাংই। অ্যাপ ইন্সটল তৌবা মথৌ তাদে।',
  'nav.remedies': 'হুমগী হিদাক',
  'remedy.title': 'আয়ুর্বেদিক হুমগী হিদাক',
  'remedy.intro': 'করিগুম্বা অৱাবা লৈরবদি — খোংনাইনবা, মকোক নাবা, হিদাক-লাংথক, মচিন-মচিন, ডায়াবেটিস, খুৎশিন-খুংনাবা — মখাদা নহাক্কী অৱাবা অদু খল্লু নত্ত্রগা নহাক্কী মওংদা হংবিয়ু। হুমগী হিদাক, মৈশিনবা, চাক-চাবা অমসুং আয়ুর্বেদিক পাম্বৈশিং হায়গনি।',
  'remedy.choose': 'নহাক্কী অৱাবা খল্লু',
  'remedy.emergencyStrong': 'মসি ইমার্জেন্সি ওই:',
  'remedy.emergency': 'তিলহৌনা শিংবা, লৈহৌনা শিংবা অমসুং হৱাইনা শিংবা — হকথেংননা হসপিটাল চৎলু, মমাংদা ১১২দা ফোন তৌ। হুমগী হিদাক অসি লম্বীদা তৌনবা খক্তনি, হসপিটালগী মহুৎ নত্তে।',
  'remedy.note': 'হুমগী অমসুং আয়ুর্বেদিক পাম্বৈশিংনা অৱাবা হন্থনবা মতেং পাংই; মসি ডোক্তরগী চেক-অপ নত্তে। হিদাক মশানা থাদোকপা নত্ত্রগা হৌবা তৌগনু।',
  'remedy.cough': 'খোংনাইনবা',
  'remedy.headache': 'মকোক নাবা',
  'remedy.joints': 'হিদাক-লাংথক',
  'remedy.itching': 'মচিন-মচিন',
  'remedy.snake': 'তিলহৌনা শিংবা',
  'remedy.scorpion': 'লৈহৌনা শিংবা',
  'remedy.dog': 'হৱাইনা শিংবা',
  'remedy.diabetes': 'ডায়াবেটিস',
  'remedy.back': 'খুৎশিন-খুংনাবা',
  'remedy.walking': 'চৎপদা অৱাবা',
  'home.remedyNote': 'হুমগী হিদাক, মৈশিনবা, চাক-চাবা অমসুং আয়ুর্বেদিক পাম্বৈ — অৱাবা খুদিংমক্কীদমক, নহাক্কী মওংদা।',
  'nav.aarti': 'আরতি অমসুং ভজন',
  'aarti.title': 'আরতি অমসুং ভজন — অশেংবা মথক',
  'aarti.intro': 'মফম অসিদা আরতী, কীর্তন অমসুং ভজন তাগনি — চহি থবক তৌরবা অমসুং মন্দিপুরগী মরূপ্কী মথক্তা। AIগী মরূপ নত্তে।',
  'aarti.note': 'কম্প্যুটরগী মরূপ্তা আরতী নত্রগা ভজন তাহনবা অসিনা মসিগী মখল অমসুং ভক্তি অদু মাঙহনই। মরম অসিন মফম অসিদা অঙনবা রেকর্দিং খক্তা লৈরি।',
  'aarti.kindAarti': 'আরতি',
  'aarti.kindKirtan': 'কীর্তন',
  'aarti.kindBhajan': 'ভজন',
  'aarti.credit': 'রেকর্দিং:',
  'aarti.licence': 'লাইসেন্স:',
  'aarti.listenLink': 'মরূপ খঙনা তাগনি',
  'aarti.textChecked': 'মসি চহিগী মথক্তা লৈবা ইপাকনি, মরূপতা রেকর্দ তৌরবা মতুং ইন্না থোকপা।',
  'aarti.textPrinted': 'মসি চহিগী মথক্তা থোকপা ইপাকনি, ইবা লাইরিকশিংগা মান্ননা চেক তৌরবা।',
  'aarti.textNotStored': 'গ্রান্থ অসিমগী মপুং ফবা ইপাক মফম অসিদা লৈতে — মখাদা রেকর্দিংদা মপুং ফবা ইপাক চৎলি।',
  'aarti.granthTitle': 'গ্রন্থ, চালিসা অমসুং স্তোত্র — অশেংবা মথক',
  'aarti.noRecording': 'আরতী অসিগী অঙনবা রেকর্দিংহৌদরি সাইটতা লৈতে, মরম অসিনা ঐনা মসিা তাহনবা ঙমদ্রে — AIগী মরূপনা আরতী কাইনা তাঙদ্রে।',
  'aarti.textOnlyTitle': 'আর আরতিয়ানা — ইপাকসু, অঙনবা মরূপসু',
  'aarti.fullText': 'মপুং ফবা ইপাক',
  'aarti.notChecked': 'আরতী অসিগী চেক তৌরবা ইপাক মফম অসিদা লৈতে। চেক তৌদবা ইপাক পীবদি ফত্তে, মরম অসিনা মসি পীবুদে।',
  'aarti.verifiedList': 'সাইট অসিদা আরতীশিং অসিগী চেক তৌরবা ইপাক লৈরি:',

};

/* -------------------------------------------------------------------------- */
/* SANTALI                                                                   */
/* -------------------------------------------------------------------------- */

const SANTALI: Record<string, string> = {
  'jgd.placeSearch': 'ᱱᱟᱜᱟᱨ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ',
  'jgd.placeNoMatch': 'ᱱᱚᱣᱟ ᱱᱟᱜᱟᱨ ᱫᱚ ᱞᱤᱥᱴᱤ ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱱᱚᱣᱟ ᱟᱰᱮᱯᱟᱥᱮ ᱨᱮᱱᱟᱜ ᱱᱟᱜᱟᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'account.name': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ',
  'account.namePlaceholder': 'ᱡᱮᱞᱮᱠᱟ: ᱥᱤᱛᱟ ᱫᱮᱵᱤ',
  'account.nameHint': 'ᱱᱚᱣᱟ ᱫᱚ ᱟᱢᱟᱜ ᱩᱯᱨᱩᱢ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ᱾ ᱡᱟᱦᱟᱸ ᱧᱩᱛᱩᱢ ᱜᱮ ᱦᱩᱭᱩᱜᱼᱟ, ᱟᱨ ᱱᱚᱣᱟ ᱫᱚ ᱵᱟᱝ ᱡᱟᱹᱨᱩᱲᱟ᱾',
  'nav.home': 'ᱚᱲᱟᱜ',
  'home.metaTitle': 'ᱯᱷᱩᱴᱠᱟᱹᱨ ᱥᱚᱢᱟᱫᱷᱟᱱ, ᱟᱯᱟᱱᱟᱨ ᱟᱜ ᱟᱲᱟᱝ ᱛᱮ',
  'lib.licence.ccZero.name': 'CC0 / ᱥᱟᱱᱟᱢ ᱦᱚᱲᱟᱜ ᱰᱚᱢᱮᱱ',
  'lib.licence.pd.name': 'ᱥᱟᱱᱟᱢ ᱦᱚᱲᱟᱜ ᱰᱚᱢᱮᱱ',
  'lib.licence.govtIndia.name': 'ᱥᱤᱧᱚᱛ ᱥᱚᱨᱠᱟᱨ',
  'lib.licence.creativeCommons.name': 'ᱠᱨᱤᱭᱮᱴᱤᱵᱽ ᱠᱚᱢᱚᱱᱥ (ᱢᱤᱥᱟᱹᱞ)',
  'lib.licence.freeToRead.name': 'ᱯᱟᱲᱦᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱯᱷᱩᱨᱜᱟᱹᱞ',
  'lib.entry.ncert.title': 'NCERT ᱯᱩᱛᱷᱤᱠᱚ — ᱪᱮᱬᱮ ᱑ ᱠᱷᱚᱱ ᱑᱒ ᱫᱷᱟᱹᱵᱤᱡ',
  'lib.entry.ncert.what': 'ᱡᱚᱛᱚ ᱥᱟᱛᱟᱢ ᱨᱮᱱᱟᱜ ᱯᱩᱛᱷᱤ, ᱱᱤᱛᱚᱜ ᱡᱚᱛᱚ ᱪᱮᱬᱮ ᱞᱟᱹᱜᱤᱫ᱾ ᱞᱚᱜᱤᱱ ᱵᱮᱜᱚᱨ, ᱥᱚᱡᱷᱮ PDF᱾',
  'lib.entry.ncert.langs': 'ᱦᱤᱱᱫᱤ, ᱤᱝᱞᱤᱥ ᱟᱨ ᱓᱐ ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱥᱤᱧᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤᱠᱚ',
  'lib.entry.pm-evidya.title': 'PM eVIDYA — ᱰᱤᱡᱤᱴᱟᱞ ᱯᱟᱲᱦᱟᱣ ᱯᱩᱛᱷᱤ',
  'lib.entry.pm-evidya.what': 'NCERT ᱯᱩᱛᱷᱤᱠᱚᱣᱟᱜ ᱮᱯ, ᱢᱟᱨᱟᱝ ᱟᱠᱷᱚᱨ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱜᱟᱱᱚᱜᱼᱟ᱾ ᱟᱸᱡᱚᱢ ᱦᱚᱸ ᱜᱟᱱᱚᱜᱼᱟ᱾',
  'lib.entry.pm-evidya.langs': 'ᱥᱤᱧᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤᱠᱚ',
  'lib.entry.diksha.title': 'DIKSHA — ᱢᱟᱪᱮᱫ ᱟᱨ ᱜᱤᱫᱽᱨᱟᱹᱠᱚ ᱞᱟᱹᱜᱤᱫ',
  'lib.entry.diksha.what': 'ᱯᱟᱲᱦᱟᱣ ᱦᱚᱨᱟ, ᱵᱷᱤᱰᱤᱭᱳ ᱟᱨ ᱯᱨᱮᱠᱴᱤᱥ — ᱪᱮᱬᱮ ᱑ ᱠᱷᱚᱱ ᱑᱒ ᱫᱷᱟᱹᱵᱤᱡ᱾',
  'lib.entry.diksha.langs': 'ᱥᱤᱧᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤᱠᱚ',
  'lib.entry.khan-academy.title': 'Khan Academy — ᱤᱝᱞᱤᱥ ᱛᱮ ᱮᱞᱠᱷᱟ ᱟᱨ ᱥᱟᱬᱮᱥ',
  'lib.entry.khan-academy.what': 'ᱵᱷᱤᱰᱤᱭᱳ ᱯᱟᱲᱦᱟᱣ, ᱡᱚᱛᱚ ᱪᱮᱬᱮ ᱞᱟᱹᱜᱤᱫ᱾ ᱯᱟᱲᱦᱟᱣ ᱦᱚᱲ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱚᱞ ᱦᱚᱸ ᱢᱮᱱᱟᱜᱼᱟ᱾',
  'lib.entry.openstax.title': 'OpenStax — ᱤᱝᱞᱤᱥ ᱛᱮ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱯᱩᱛᱷᱤᱠᱚ',
  'lib.entry.openstax.what': 'ᱠᱚᱞᱮᱡᱽ ᱛᱷᱚᱠ ᱨᱮᱱᱟᱜ ᱯᱩᱛᱷᱤᱠᱚ — ᱮᱞᱠᱷᱟ, ᱥᱟᱬᱮᱥ, ᱢᱟᱱᱚᱵᱤᱠᱤ᱾ ᱡᱚᱛᱚ ᱥᱟᱦᱴᱟ ᱨᱮ PDF᱾',
  'lib.entry.nios.title': 'NIOS — ᱥᱟᱺᱜᱤᱧ ᱥᱮᱪᱮᱫ, ᱯᱷᱩᱨᱜᱟᱹᱞ ᱥᱟᱢᱟᱱ',
  'lib.entry.nios.what': 'ᱚᱯᱮᱱ ᱟᱨ ᱚᱱᱞᱟᱭᱤᱱ ᱠᱳᱨᱥ ᱨᱮᱱᱟᱜ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱯᱩᱛᱷᱤᱠᱚ, ᱵᱷᱩᱨᱛᱤ ᱵᱮᱜᱚᱨ᱾',
  'lib.entry.nios.langs': 'ᱦᱤᱱᱫᱤ, ᱤᱝᱞᱤᱥ ᱟᱨ ᱮᱴᱟᱜ ᱠᱚ',
  'lib.entry.ignou.title': 'IGNOU — ᱢᱟᱨᱟᱝ ᱟᱥᱲᱟ ᱨᱮᱱᱟᱜ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱯᱩᱛᱷᱤᱠᱚ',
  'lib.entry.ignou.what': 'ᱥᱟᱺᱜᱤᱧ ᱥᱮᱪᱮᱫ ᱨᱮᱱᱟᱜ ᱯᱩᱛᱷᱤᱠᱚ ᱡᱟᱦᱟᱸ ᱫᱚ ᱯᱩᱨᱟᱹ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱧᱟᱢᱚᱜᱼᱟ᱾',
  'lib.entry.gutenberg.title': 'Project Gutenberg — ᱤᱝᱞᱤᱥ ᱨᱮᱱᱟᱜ ᱢᱟᱨᱮ ᱯᱩᱛᱷᱤᱠᱚ',
  'lib.entry.gutenberg.what': '᱗᱐,᱐᱐᱐ ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱯᱩᱛᱷᱤᱠᱚ, ᱡᱚᱛᱚᱣᱟᱜ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱢᱩᱪᱟᱹᱫ ᱟᱠᱟᱱᱟ᱾ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱤ-ᱵᱩᱠ ᱟᱨ ᱚᱰᱤᱭᱳ᱾',
  'lib.entry.pratham-books.title': 'Pratham Books — ᱜᱤᱫᱽᱨᱟᱹᱠᱚᱣᱟᱜ ᱯᱩᱛᱷᱤᱠᱚ',
  'lib.entry.pratham-books.what': 'ᱥᱤᱧᱚᱛᱤᱭᱟᱹ ᱯᱟᱹᱨᱥᱤᱠᱚ ᱛᱮ ᱜᱤᱫᱽᱨᱟᱹᱠᱚᱣᱟᱜ ᱯᱩᱛᱷᱤᱠᱚ, ᱯᱩᱨᱟᱹ ᱯᱷᱩᱨᱜᱟᱹᱞ᱾ ᱪᱮᱬᱮ ᱑ ᱠᱷᱚᱱ ᱕ ᱞᱟᱹᱜᱤᱫ᱾',
  'lib.entry.pratham-books.langs': 'ᱦᱤᱱᱫᱤ, ᱢᱟᱨᱟᱴᱷᱤ, ᱵᱟᱝᱞᱟ, ᱛᱟᱢᱤᱞ, ᱛᱮᱞᱩᱜᱩ ᱟᱨ ᱮᱴᱟᱜ ᱠᱚ',
  'lib.entry.internet-archive-texts.title': 'Internet Archive — ᱠᱷᱚᱵᱚᱨ ᱠᱟᱜᱚᱡᱽ ᱟᱨ ᱢᱟᱨᱮ ᱯᱟᱛᱷᱟᱢᱠᱚ',
  'lib.entry.internet-archive-texts.what': 'ᱞᱟᱠᱷ ᱞᱟᱠᱷ ᱢᱟᱨᱮ ᱯᱩᱛᱷᱤᱠᱚ, ᱯᱟᱛᱷᱟᱢᱠᱚ ᱟᱨ ᱠᱷᱚᱵᱚᱨ ᱠᱟᱜᱚᱡᱽ — ᱯᱷᱩᱨᱜᱟᱹᱞ᱾',
  'lib.entry.wikisource.title': 'Wikisource — ᱦᱚᱲ ᱜᱟᱫᱮᱞ ᱯᱟᱲᱦᱟᱣ',
  'lib.entry.wikisource.what': 'ᱡᱟᱦᱟᱸ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱵᱟᱹᱱᱩᱜᱼᱟ — ᱱᱚᱣᱟ ᱫᱚ ᱡᱮᱜᱮᱛ ᱨᱮᱱᱟᱜ ᱢᱟᱨᱮ ᱥᱟᱶᱦᱮᱫ ᱯᱩᱛᱷᱤᱠᱚ ᱠᱟᱱᱟ᱾',
  'lib.entry.wikimedia-commons.title': 'Wikimedia Commons — ᱡᱚᱛᱚ ᱪᱤᱛᱟᱹᱨ',
  'lib.entry.wikimedia-commons.what': 'ᱡᱟᱹᱛᱤ, ᱱᱚᱠᱥᱟ, ᱤᱯᱤᱞ, ᱱᱟᱜᱟᱢ — ᱡᱚᱛᱚ ᱠᱤᱪᱷᱩ᱾ ᱡᱚᱛᱚ ᱪᱤᱛᱟᱹᱨ ᱨᱮ ᱵᱷᱮᱜᱟᱨ ᱞᱟᱭᱥᱮᱱᱥ ᱚᱞ ᱟᱠᱟᱱᱟ᱾',
  'lib.entry.pixabay.title': 'Pixabay — ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱵᱷᱤᱰᱤᱭᱳ',
  'lib.entry.pixabay.what': 'ᱪᱤᱛᱟᱹᱨ, ᱨᱮᱠᱷᱟᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱦᱩᱰᱤᱧ ᱵᱷᱤᱰᱤᱭᱳ᱾',
  'lib.entry.unsplash.title': 'Unsplash — ᱪᱚᱨᱚᱠ ᱪᱤᱛᱟᱹᱨᱠᱚ',
  'lib.entry.unsplash.what': 'ᱯᱷᱩᱨᱜᱟᱹᱞ, ᱢᱟᱨᱟᱝ ᱟᱠᱷᱚᱨ ᱛᱮ, ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱜᱚᱨ᱾',
  'lib.entry.openverse.title': 'Openverse — ᱡᱚᱛᱚ ᱪᱤᱛᱟᱹᱨ ᱢᱤᱫ ᱴᱷᱮᱱ',
  'lib.entry.openverse.what': 'ᱟᱭᱢᱟ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱪᱤᱛᱟᱹᱨ ᱥᱟᱭᱤᱴ ᱢᱤᱫ ᱥᱟᱶᱛᱮ ᱯᱟᱱᱛᱮ ᱢᱮ᱾',
  'lib.entry.librivox.title': 'LibriVox — ᱟᱸᱡᱚᱢ ᱯᱩᱛᱷᱤᱠᱚ',
  'lib.entry.librivox.what': 'ᱢᱟᱨᱮ ᱤᱝᱞᱤᱥ ᱯᱩᱛᱷᱤᱠᱚᱣᱟᱜ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱚᱰᱤᱭᱳ, ᱢᱟᱹᱱᱢᱤᱭᱟᱜ ᱟᱲᱟᱝ ᱛᱮ᱾',
  'lib.entry.internet-archive-audio.title': 'Internet Archive — ᱚᱰᱤᱭᱳ ᱥᱟᱧᱪᱟᱣ',
  'lib.entry.internet-archive-audio.what': 'ᱦᱟᱡᱟᱨ ᱜᱟᱱ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱚᱰᱤᱭᱳ — ᱯᱩᱛᱷᱤᱠᱚ, ᱚᱱᱚᱬᱦᱮ, ᱥᱮᱨᱮᱧ᱾',
  'lib.entry.vande-mataram.title': 'Vande Mataram — ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱥᱮᱨᱮᱧ ᱟᱨ ᱜᱟᱱ',
  'lib.entry.vande-mataram.what': 'ᱥᱤᱧᱚᱛ ᱨᱮᱱᱟᱜ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱥᱮᱨᱮᱧ ᱟᱨ ᱮᱴᱟᱜ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱥᱮᱨᱮᱧ, ᱯᱷᱩᱨᱜᱟᱹᱞ᱾',
  'art.aag-aur-bijli-ke-bachav.title': 'ᱟᱹᱛᱤᱧ ᱟᱨ ᱵᱤᱡᱽᱞᱤ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱨᱮᱱᱟᱜ ᱱᱤᱭᱚᱢ',
  'art.aag-aur-bijli-ke-bachav.summary': 'ᱚᱲᱟᱜ ᱨᱮ ᱟᱹᱛᱤᱧ ᱞᱟᱜᱟᱣ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ — ᱥᱚᱡᱷᱮ ᱱᱤᱭᱚᱢ',
  'art.aag-lagne-par-kya-karein.title': 'ᱟᱹᱛᱤᱧ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱪᱮᱫ ᱪᱤᱠᱟᱹᱭᱟ',
  'art.aag-lagne-par-kya-karein.summary': 'ᱡᱩᱞᱩᱜ ᱠᱟᱱ ᱚᱲᱟᱜ ᱨᱮ ᱟᱹᱛᱤᱧ — ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱲᱟᱝ ᱪᱮᱫ ᱪᱤᱠᱟᱹᱭᱟ, ᱪᱮᱫ ᱟᱞᱚᱢ ᱪᱤᱠᱟᱹᱭᱟ',
  'art.bimari-se-bachav.title': 'ᱨᱚᱜᱽ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱨᱮᱱᱟᱜ ᱮᱭᱟᱭ ᱱᱤᱭᱚᱢ',
  'art.bimari-se-bachav.summary': 'ᱛᱤ ᱥᱟᱯᱷᱟ, ᱢᱟᱥᱠ, ᱴᱤᱠᱟᱹ — ᱮᱢᱟᱱ ᱠᱚᱛᱮ ᱵᱟᱧᱪᱟᱣ',
  'art.dhuwan-ka-jhakora.title': 'ᱫᱷᱩᱸᱣᱟᱹ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ',
  'art.dhuwan-ka-jhakora.summary': 'ᱥᱟᱦᱮᱫ ᱵᱟᱝ ᱦᱟᱹᱡᱩᱜ ᱠᱟᱱᱟ — ᱪᱮᱫ ᱮᱢ ᱪᱤᱠᱟᱹᱭᱟ, ᱛᱤᱥ ᱟᱥᱯᱟᱛᱟᱞ ᱪᱟᱞᱟᱜᱼᱟ',
  'art.doodh-pani-band-ho.title': 'ᱵᱤᱡᱽᱞᱤ ᱥᱮ ᱫᱟᱜ ᱟᱪᱠᱟ ᱜᱮ ᱵᱚᱸᱫᱚ ᱞᱮᱱᱠᱷᱟᱱ',
  'art.doodh-pani-band-ho.summary': 'ᱪᱮᱫ ᱮᱢ ᱪᱤᱠᱟᱹᱭᱟ, ᱪᱮᱫ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣᱟ, ᱛᱤᱥ ᱜᱚᱲᱚᱢ ᱠᱷᱚᱡᱟ',
  'art.haath-ki-saafai.title': 'ᱥᱟᱵᱟᱱ ᱵᱮᱜᱚᱨ ᱛᱤ ᱥᱟᱯᱷᱟ ᱨᱮᱱᱟᱜ ᱩᱯᱟᱹᱭ',
  'art.haath-ki-saafai.summary': 'ᱡᱚᱠᱷᱚᱱ ᱫᱟᱜ ᱥᱮ ᱥᱟᱵᱟᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ',
  'cat.dhyan-aur-yoog.title': 'ᱫᱷᱮᱭᱟᱱ ᱟᱨ ᱭᱚᱜᱽ',
  'cat.dhyan-aur-yoog.subtitle': 'ᱢᱚᱱᱮ ᱛᱷᱤᱨ ᱫᱚᱦᱚ ᱨᱮᱱᱟᱜ ᱟᱞᱜᱟ ᱩᱯᱟᱹᱭ',
  'cat.gharelu-marammat.title': 'ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ',
  'cat.gharelu-marammat.subtitle': 'ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱦᱩᱰᱤᱧ ᱦᱩᱰᱤᱧ ᱥᱚᱢᱚᱥᱭᱟ ᱨᱮᱱᱟᱜ ᱦᱟᱞ',
  'cat.bachchon-ki-padhai.title': 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚᱣᱟᱜ ᱯᱟᱲᱦᱟᱣ',
  'cat.bachchon-ki-padhai.subtitle': 'ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱢᱚᱱᱮ ᱵᱟᱝ ᱞᱟᱜᱟᱜ ᱠᱟᱱᱟ, ᱪᱤᱱᱛᱟᱹ ᱨᱮ ᱢᱮᱱᱟᱢᱟ',
  'cat.budharge-seva.title': 'ᱦᱟᱲᱟᱢ ᱵᱩᱰᱷᱤ ᱠᱚᱣᱟᱜ ᱥᱮᱵᱟ',
  'cat.budharge-seva.subtitle': 'ᱡᱚᱛᱚᱱ ᱟᱨ ᱜᱚᱲᱚ',
  'cat.shishu-dekhbhal.title': 'ᱜᱤᱫᱽᱨᱟᱹ ᱡᱚᱛᱚᱱ',
  'cat.shishu-dekhbhal.subtitle': 'ᱦᱩᱰᱤᱧ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱜ ᱥᱟᱹᱦᱤ ᱡᱚᱛᱚᱱ',
  'cat.dharmik-upay.title': 'ᱫᱷᱚᱨᱚᱢ ᱠᱟᱹᱢᱤ',
  'cat.dharmik-upay.subtitle': 'ᱢᱚᱱᱮ ᱨᱮ ᱥᱟᱹᱱᱛᱤ ᱞᱟᱹᱜᱤᱫ',
  'cat.pavan-grah-aur-aarti.title': 'ᱯᱟᱹᱵᱤᱛᱨᱚ ᱯᱩᱛᱷᱤ ᱟᱨ ᱟᱨᱛᱤ',
  'cat.pavan-grah-aur-aarti.subtitle': 'ᱥᱟᱹᱨᱫᱷᱟᱹ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱟᱨ ᱟᱸᱡᱚᱢ',
  'cat.aapatkalen-gayide.title': 'ᱟᱯᱚᱛᱠᱟᱞᱤᱱ ᱜᱟᱭᱤᱰ',
  'cat.aapatkalen-gayide.subtitle': 'ᱡᱚᱠᱷᱚᱱ ᱟᱹᱰᱤ ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤᱜᱼᱟ',
  'cat.mahamari-suraksha.title': 'ᱢᱟᱦᱟᱢᱟᱨᱤ ᱠᱷᱚᱱ ᱥᱩᱨᱚᱠᱷᱭᱟ',
  'cat.mahamari-suraksha.subtitle': 'ᱨᱚᱜᱽ ᱯᱟᱥᱱᱟᱣ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ',
  'nav.tribute': 'ᱥᱚᱢᱟᱱ',
  'nav.help': 'ᱜᱚᱲᱚ',
  'nav.reference': 'ᱥᱟᱹᱠᱷᱭᱟᱹᱛ',
  'nav.reviews': 'ᱨᱟᱭ',
  'nav.support': 'ᱜᱚᱲᱚ ᱮᱢ',
  'nav.birthChart': 'ᱡᱟᱱᱟᱢ ᱠᱩᱱᱰᱞᱤ',
  'jgd.title': 'ᱟᱢᱟᱜ ᱡᱟᱱᱟᱢ ᱠᱩᱱᱰᱞᱤ',
  'jgd.intro': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ, ᱡᱟᱱᱟᱢ ᱢᱟᱹᱦᱤᱛ, ᱟᱨ ᱡᱩᱫᱤ ᱦᱩᱭᱩᱜᱼᱟ ᱛᱚᱵᱮ ᱡᱟᱱᱟᱢ ᱚᱠᱛᱚ ᱟᱨ ᱴᱷᱟᱶ ᱚᱞ ᱢᱮ᱾ ᱡᱚᱛᱚ ᱦᱤᱥᱟᱹᱵᱽ ᱟᱢᱟᱜ ᱯᱷᱚᱱ ᱨᱮᱜᱮ ᱦᱩᱭᱩᱜᱼᱟ — ᱪᱮᱫ ᱦᱚᱸ ᱚᱠᱟᱨᱮ ᱦᱚᱸ ᱵᱟᱝ ᱠᱩᱞᱚᱜᱼᱟ᱾ VARSHA SAMADHAN AI ᱨᱮ ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱫᱚ ᱥᱩᱨᱚᱠᱷᱤᱛ ᱜᱮᱭᱟ᱾',
  'jgd.nameLabel': 'ᱡᱟᱱᱟᱢ ᱧᱩᱛᱩᱢ',
  'jgd.namePlaceholder': 'ᱡᱮᱞᱮᱠᱟ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
  'jgd.nameHint': 'ᱡᱟᱦᱟᱸ ᱧᱩᱛᱩᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱚᱠᱛᱚ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ, ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱢᱮ᱾',
  'jgd.dateLabel': 'ᱡᱟᱱᱟᱢ ᱢᱟᱹᱦᱤᱛ',
  'jgd.timeLabel': 'ᱡᱟᱱᱟᱢ ᱚᱠᱛᱚ',
  'jgd.timeHint': 'ᱵᱟᱢ ᱵᱟᱰᱟᱭ ᱞᱮᱠᱷᱟᱱ ᱵᱟᱹᱜᱤ ᱟᱹᱨᱤ ᱢᱮ᱾',
  'jgd.placeLabel': 'ᱡᱟᱱᱟᱢ ᱴᱷᱟᱶ',
  'jgd.placeNone': 'ᱵᱟᱹᱧ ᱵᱟᱰᱟᱭᱟ / ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
  'jgd.placeHint': 'ᱡᱟᱱᱟᱢ ᱥᱚᱦᱚᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'jgd.submit': 'ᱦᱤᱥᱟᱹᱵᱽ ᱢᱮ',
  'jgd.savePdf': 'PDF ᱵᱮᱱᱟᱣ',
  'jgd.again': 'ᱱᱟᱣᱟ ᱦᱤᱥᱟᱹᱵᱽ',
  'jgd.errDate': 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱡᱟᱱᱟᱢ ᱢᱟᱹᱦᱤᱛ ᱥᱟᱹᱦᱤ ᱚᱞ ᱢᱮ᱾',
  'jgd.errPlace': 'ᱡᱟᱱᱟᱢ ᱥᱚᱦᱚᱨ ᱞᱤᱥᱴ ᱠᱷᱚᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ, ᱥᱮ ᱚᱱᱟ ᱥᱩᱨ ᱨᱮᱱᱟᱜ ᱥᱚᱦᱚᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'jgd.numTitle': 'ᱚᱝᱠᱚ ᱡᱚᱭᱛᱤᱥ',
  'jgd.lifePath': 'ᱡᱤᱭᱚᱱ ᱦᱚᱨᱟ',
  'jgd.nameNumber': 'ᱧᱩᱛᱩᱢ ᱚᱝᱠᱚ',
  'jgd.soulNumber': 'ᱟᱛᱢᱟ ᱚᱝᱠᱚ',
  'jgd.birthdayNumber': 'ᱡᱟᱱᱟᱢ ᱢᱟᱦᱟᱸ ᱚᱝᱠᱚ',
  'jgd.astroTitle': 'ᱵᱮᱫᱤᱠ ᱡᱚᱭᱛᱤᱥ',
  'jgd.nakshatra': 'ᱱᱚᱠᱷᱚᱛᱨᱚ',
  'jgd.pada': 'ᱯᱟᱫ',
  'jgd.rashi': 'ᱨᱟᱥᱤ',
  'jgd.rashiLord': 'ᱨᱟᱥᱤ ᱢᱟᱹᱞᱤᱠ',
  'jgd.nakshatraLord': 'ᱱᱚᱠᱷᱚᱛᱨᱚ ᱢᱟᱹᱞᱤᱠ',
  'jgd.lagna': 'ᱞᱚᱜᱱᱚ',
  'jgd.lagnaMissing': 'ᱞᱚᱜᱱᱚ ᱚᱰᱚᱠ ᱞᱟᱹᱜᱤᱫ ᱡᱟᱱᱟᱢ ᱚᱠᱛᱚ ᱟᱨ ᱴᱷᱟᱶ ᱞᱟᱹᱠᱛᱤᱜᱼᱟ᱾ ᱪᱮᱛᱟᱱ ᱨᱮ ᱯᱮᱨᱮᱡ ᱠᱟᱛᱮ ᱦᱤᱥᱟᱹᱵᱽ ᱯᱮ, ᱟᱨ ᱡᱩᱫᱤ ᱵᱟᱝ ᱵᱟᱰᱟᱭᱟ ᱮᱱᱠᱷᱟᱱ ᱱᱤᱭᱟᱹ ᱜᱮ ᱟᱹᱰᱤ ᱜᱟᱱᱚᱜᱼᱟ᱾',
  'jgd.gunTitle': 'ᱜᱩᱱ ᱢᱤᱞᱟᱹᱱ',
  'jgd.gunIntro': 'ᱮᱴᱟᱜ ᱦᱚᱲᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱡᱟᱱᱟᱢ ᱢᱟᱹᱦᱤᱛ ᱯᱮᱨᱮᱡ ᱯᱮ᱾',
  'jgd.gunName': 'ᱩᱱᱤᱭᱟᱜ ᱧᱩᱛᱩᱢ',
  'jgd.gunDate': 'ᱩᱱᱤᱭᱟᱜ ᱡᱟᱱᱟᱢ ᱢᱟᱹᱦᱤᱛ',
  'jgd.gunHint': 'ᱵᱟᱱᱟᱨᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱡᱟᱱᱟᱢ ᱢᱟᱹᱦᱤᱛ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ ᱜᱩᱱ ᱢᱤᱞᱟᱹᱱ ᱚᱰᱚᱠᱚᱜᱼᱟ᱾',
  'jgd.disclaimer': 'ᱱᱤᱭᱟᱹ ᱫᱚ ᱟᱹᱨᱤᱪᱟᱹᱞᱤ ᱞᱮᱠᱟᱛᱮ ᱦᱩᱭ ᱟᱠᱟᱱ ᱦᱤᱥᱟᱹᱵᱽ ᱠᱟᱱᱟ, ᱵᱷᱟᱹᱵᱤᱥᱭᱚᱛ ᱵᱟᱝ ᱠᱟᱱᱟ᱾ ᱚᱠᱟ ᱮᱞ ᱟᱨ ᱨᱟᱥᱤ ᱦᱚᱸ ᱚᱠᱚᱭᱟᱜ ᱦᱚᱲᱢᱚ ᱥᱟᱶᱟᱨ, ᱫᱷᱚᱱ ᱟᱨ ᱥᱟᱹᱜᱟᱹᱭ ᱵᱟᱭ ᱴᱷᱟᱹᱣᱠᱟᱹᱭᱟ᱾ ᱢᱟᱨᱟᱝ ᱜᱚᱴᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨ, ᱟᱹᱱᱟᱹᱨᱤ ᱥᱮ ᱟᱹᱠᱤᱞᱟᱱ ᱦᱚᱲᱟᱜ ᱯᱟᱹᱛᱭᱟᱹᱣ ᱛᱮ ᱦᱟᱛᱟᱣ ᱯᱮ᱾',
  'nav.menu': 'ᱢᱮᱱᱩ',
  'nav.openMenu': 'ᱢᱮᱱᱩ ᱡᱷᱤᱡ ᱢᱮ',
  'nav.closeMenu': 'ᱢᱮᱱᱩ ᱵᱚᱸᱫᱚᱭ ᱢᱮ',
  'nav.expand': 'ᱯᱟᱥᱱᱟᱣ ᱢᱮ',
  'nav.collapse': 'ᱡᱟᱣᱨᱟᱭ ᱢᱮ',
  'nav.skip': 'ᱥᱚᱡᱷᱮ ᱥᱟᱛᱟᱢ ᱛᱮ ᱪᱟᱞᱟᱜ ᱢᱮ',
  'nav.language': 'ᱯᱟᱹᱨᱥᱤ ᱵᱚᱫᱚᱞ ᱢᱮ',
  'footer.pages': 'ᱥᱟᱠᱟᱢ',
  'footer.helplines': 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱮᱞ',
  'footer.free': 'ᱱᱤᱭᱟᱹ ᱥᱮᱵᱟ ᱫᱚ ᱯᱩᱨᱟᱹ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱜᱮᱭᱟ᱾ ᱚᱠᱚᱭ ᱴᱷᱮᱱ ᱦᱚᱸ ᱴᱟᱠᱟ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ᱾',
  'footer.readStory': 'ᱩᱱᱠᱩᱣᱟᱜ ᱯᱩᱨᱟᱹ ᱠᱟᱹᱦᱱᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
  'footer.admin': 'ᱯᱨᱚᱵᱚᱱᱫᱷᱚᱠ',
  'footer.rights': 'ᱯᱷᱩᱨᱜᱟᱹᱞ ᱥᱮᱵᱟ',
  'footer.emergency': 'ᱟᱯᱚᱛᱠᱟᱞ',
  'footer.ambulance': 'ᱮᱢᱵᱩᱞᱮᱱᱥ',
  'footer.women': 'ᱢᱟᱭᱡᱤᱣ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ',
  'home.dedication1': 'ᱟᱜ ᱩᱭᱦᱟᱹᱨ ᱨᱮ — ᱢᱤᱫ ᱯᱩᱨᱟᱹ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱥᱮᱵᱟ᱾',
  'home.dedication2': 'ᱟᱢᱟᱜ ᱥᱚᱢᱚᱥᱭᱟ ᱚᱞ ᱢᱮ ᱥᱮ ᱨᱚᱲ ᱢᱮ᱾',
  'home.emergencyTitle': 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ — ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ',
  'home.emergencyNote': 'ᱱᱤᱭᱟᱹ ᱠᱚ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱲᱟᱝ ᱯᱟᱲᱦᱟᱣ ᱯᱮ᱾ ᱮᱴᱟᱜ ᱫᱚ ᱛᱟᱭᱚᱢ ᱛᱮ ᱧᱮᱞ ᱜᱟᱱᱚᱜᱼᱟ᱾',
  'home.readMore': 'ᱯᱩᱨᱟᱹ ᱠᱟᱛᱷᱟ ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
  'home.chooseTopic': 'ᱚᱠᱟ ᱥᱟᱛᱟᱢ ᱨᱮ ᱵᱟᱰᱟᱭ ᱥᱟᱱᱟᱭᱮᱫ ᱢᱮᱭᱟ?',
  'home.memorialEyebrow': 'ᱱᱤᱭᱟᱹ ᱥᱟᱭᱤᱴ ᱫᱚ ᱚᱠᱚᱭ ᱞᱟᱹᱜᱤᱫ',
  'home.memorialLine': 'ᱡᱟᱦᱟᱸᱭ ᱫᱚ ᱥᱟᱶᱛᱟ ᱞᱟᱹᱜᱤᱫ ᱡᱤᱭᱚᱱ ᱯᱩᱨᱟᱹ ᱞᱟᱹᱲᱦᱟᱹᱭ ᱟᱠᱟᱫᱟ, ᱟᱨ ᱡᱟᱦᱟᱸᱭ ᱫᱚ ᱢᱩᱪᱟᱹᱫ ᱨᱮ ᱟᱡᱟᱜ ᱦᱤᱥ ᱵᱟᱭ ᱧᱟᱢ ᱟᱠᱟᱫᱟ᱾',
  'home.memorialMore': 'ᱩᱱᱠᱩᱣᱟᱜ ᱯᱩᱨᱟᱹ ᱠᱟᱹᱦᱱᱤ ᱯᱟᱲᱦᱟᱣ ᱢᱮ',
  'home.kundaliTitle': 'ᱡᱟᱱᱟᱢ ᱜᱚᱱᱴᱷᱟ',
  'home.kundaliNote': 'ᱯᱩᱨᱟᱹ ᱠᱩᱱᱰᱚᱞᱤ — ᱙ ᱜᱨᱚᱦᱚ, ᱵᱤᱢᱚᱥᱚᱛᱛᱚᱨᱤ ᱫᱚᱥᱟ, ᱯᱷᱚᱞᱟᱫᱮᱥ, ᱭᱚᱜᱚ, ᱥᱚᱲᱚᱥᱵᱚᱨᱜᱚ, ᱠᱮᱯᱤ, ᱞᱟᱞ ᱠᱤᱛᱟᱵᱽ ᱟᱨ ᱮᱞ ᱡᱚᱛᱤᱥ᱾ ᱡᱚᱛᱚ ᱟᱢᱟᱜ ᱯᱷᱚᱱ ᱨᱮᱜᱮ ᱦᱤᱥᱟᱹᱵᱚᱜᱼᱟ᱾',
  'home.chooseTopicNote': 'ᱞᱟᱛᱟᱨ ᱨᱮ ᱮᱢ ᱟᱠᱟᱱ ᱥᱟᱛᱟᱢ ᱨᱮ ᱴᱮᱯ ᱢᱮ᱾ ᱡᱚᱛᱚ ᱴᱷᱟᱶ ᱨᱮ ᱥᱚᱡᱷᱮ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱠᱟᱛᱷᱟ ᱚᱞ ᱟᱠᱟᱱᱟ᱾',
  'home.askHere': 'ᱱᱤᱭᱟᱹ ᱥᱟᱛᱟᱢ ᱨᱮᱜᱮ ᱠᱩᱞᱤ ᱢᱮ',
  'home.categoryEmpty': 'ᱱᱤᱭᱟᱹ ᱥᱟᱛᱟᱢ ᱨᱮ ᱱᱤᱛᱚᱜ ᱫᱚ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱝ ᱚᱞ ᱟᱠᱟᱱᱟ᱾',
  'home.soundTitle': 'ᱥᱟᱹᱱᱛᱤ ᱞᱟᱹᱜᱤᱫ ᱟᱲᱟᱝ',
  'home.soundIntro': 'ᱪᱮᱫ ᱦᱚᱸ ᱠᱷᱚᱨᱚᱪ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱭᱟᱯᱚᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱥᱩᱢᱩᱝ ᱢᱚᱱᱮ ᱥᱟᱹᱱᱛᱤ ᱞᱟᱹᱜᱤᱫ᱾',
  'home.howTitle': 'ᱱᱤᱭᱟᱹ ᱥᱮᱵᱟ ᱪᱮᱫ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ',
  'home.step1Title': 'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱚᱞ ᱢᱮ ᱥᱮ ᱨᱚᱲ ᱢᱮ',
  'home.step1Body': 'ᱦᱤᱱᱫᱤ ᱛᱮ ᱴᱟᱭᱤᱯ ᱢᱮ, ᱥᱮ ᱢᱟᱭᱤᱠ ᱫᱟᱵᱟᱣ ᱠᱟᱛᱮ ᱨᱚᱲ ᱢᱮ᱾ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱹᱲᱛᱤ ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱦᱩᱭᱩᱜᱼᱟ — ᱡᱟᱦᱟᱸ ᱢᱚᱱᱮ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱢᱮ᱾',
  'home.step2Title': 'ᱞᱚᱜᱚᱱ ᱛᱮᱞᱟ ᱧᱟᱢᱚᱜᱼᱟ',
  'home.step2Body': 'ᱡᱚᱛᱚ ᱠᱩᱞᱤ ᱠᱟᱛᱷᱟ ᱫᱚᱨᱡᱚᱜᱼᱟ ᱟᱨ ᱚᱱᱟᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱞᱚᱜᱚᱱ ᱧᱟᱢᱚᱜᱼᱟ᱾ ᱟᱹᱰᱤ ᱡᱤᱞᱤᱧ ᱠᱩᱞᱤ ᱠᱷᱚᱱ ᱢᱟᱲᱟᱝ ᱦᱩᱰᱤᱧ ᱠᱩᱞᱤ ᱠᱷᱚᱱ ᱮᱦᱚᱵ ᱢᱮ᱾',
  'home.step3Title': 'ᱪᱮᱫ ᱦᱚᱸ ᱴᱟᱠᱟ ᱵᱟᱝ, ᱪᱮᱫ ᱦᱚᱸ ᱱᱤᱡᱮᱨᱟᱜ ᱠᱟᱛᱷᱟ ᱵᱟᱝ',
  'home.step3Body': 'ᱱᱤᱭᱟᱹ ᱥᱮᱵᱟ ᱫᱚ ᱯᱩᱨᱟᱹ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱜᱮᱭᱟ᱾ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ, ᱴᱷᱟᱶ ᱥᱮ ᱯᱷᱚᱱ ᱮᱞ ᱵᱟᱝ ᱠᱷᱚᱡᱚᱜᱼᱟ, ᱟᱨ ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱭᱟᱯᱚᱱ ᱵᱟᱝ ᱩᱫᱩᱜᱚᱜᱼᱟ᱾',
  'home.stepLabel': 'ᱛᱷᱟᱯ',
  'home.freeTitle': 'ᱱᱤᱭᱟᱹ ᱥᱮᱵᱟ ᱫᱚ ᱯᱩᱨᱟᱹ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱜᱮᱭᱟ',
  'home.freeBody': 'ᱪᱮᱫ ᱦᱚᱸ ᱴᱟᱠᱟ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ, ᱪᱮᱫ ᱦᱚᱸ ᱱᱤᱡᱮᱨᱟᱜ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱠᱷᱚᱡᱚᱜᱼᱟ, ᱟᱨ ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱭᱟᱯᱚᱱ ᱵᱟᱝ ᱩᱫᱩᱜᱚᱜᱼᱟ᱾',
  'help.q1.label': 'ᱵᱤᱡᱽᱞᱤ ᱪᱟᱞᱟᱣ ᱟᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱠᱟᱹᱢᱤᱭᱟ?',
  'help.q1.question': 'ᱚᱲᱟᱜ ᱨᱮ ᱵᱤᱡᱽᱞᱤ ᱪᱟᱞᱟᱣ ᱟᱠᱟᱱᱟ᱾ ᱪᱮᱫ ᱠᱚ ᱪᱤᱠᱟᱹᱭᱟ, ᱟᱨ ᱢᱚᱵᱟᱭᱤᱞ ᱯᱷᱚᱱ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱪᱟᱨᱡᱽᱟ?',
  'help.q2.label': 'ᱜᱤᱫᱽᱨᱟᱹᱣᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱠᱚᱢᱡᱚᱨᱤ',
  'help.q2.question': 'ᱤᱧᱤᱡ ᱜᱤᱫᱽᱨᱟᱹ ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱟᱹᱰᱤ ᱠᱚᱢᱡᱚᱨ ᱜᱮᱭᱟ᱾ ᱚᱲᱟᱜ ᱨᱮ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮᱧ ᱥᱩᱫᱷᱟᱹᱨᱟ?',
  'help.q3.label': 'ᱟᱹᱛᱩ ᱦᱚᱲᱟᱜ ᱵᱷᱟᱹᱞᱟᱹᱭ',
  'help.q3.question': 'ᱤᱧᱤᱡ ᱵᱟᱵᱟ ᱟᱹᱰᱤ ᱩᱢᱮᱨ ᱟᱠᱟᱱᱟᱭ, ᱩᱱᱤᱭᱟᱜ ᱦᱚᱲᱢᱚ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮᱧ ᱧᱮᱞᱟ?',
  'help.q4.label': 'ᱚᱲᱟᱜ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ',
  'help.q4.question': 'ᱡᱩᱫᱤ ᱧᱤᱫᱟᱹ ᱚᱲᱟᱜ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱬᱟᱝ ᱪᱮᱫ ᱠᱚ ᱪᱤᱠᱟᱹᱭᱟ?',
  'help.title': 'ᱟᱢᱟᱜ ᱚᱥᱩᱵᱤᱫᱷᱟ ᱚᱞ ᱢᱮ',
  'help.intro': 'ᱞᱟᱛᱟᱨ ᱨᱮ ᱚᱞ ᱢᱮ ᱟᱨᱵᱟᱝ ᱞᱟᱹᱭ ᱢᱮ᱾ ᱡᱩᱫᱤ ᱵᱟᱢ ᱵᱟᱰᱟᱭᱟ ᱮᱱᱠᱷᱟᱱ ᱢᱚᱱᱮ ᱨᱮ ᱡᱟᱦᱟᱸ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱢᱮ — ᱱᱚᱣᱟ ᱜᱮ ᱟᱹᱰᱤ ᱞᱟᱹᱠᱛᱤᱭᱟᱱᱟ᱾',
  'help.suggested': 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱩᱞᱤ',
  'help.howTitle': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱠᱟᱹᱢᱤᱭᱟ',
  'help.howBody': 'ᱡᱚᱛᱚ ᱠᱩᱞᱤ ᱜᱮ ᱚᱞ ᱛᱟᱦᱮᱸᱱᱟ ᱟᱨ ᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱩᱥᱟᱹᱨᱟ ᱧᱟᱢᱚᱜᱼᱟ᱾ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ, ᱴᱷᱤᱠᱟᱹᱱᱟ ᱟᱨᱵᱟᱝ ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ ᱚᱠᱟᱨᱮᱦᱚᱸ ᱵᱟᱝ ᱠᱚ ᱠᱷᱚᱡᱟ᱾ ᱡᱚᱛᱚ ᱠᱤᱪᱷᱩ ᱯᱷᱩᱨᱪᱟᱹ ᱜᱮᱭᱟ᱾',
  'ref.title': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱪᱮᱫ ᱠᱟᱱᱟ, ᱟᱨ ᱚᱠᱚᱭ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ',
  'ref.intro': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱫᱚ ᱥᱨᱤᱢᱚᱛᱤ VARSHA ᱟᱜ ᱩᱭᱦᱟᱹᱨ ᱛᱮ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾ ᱱᱚᱸᱰᱮ ᱥᱚᱡᱷᱮ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱞᱟᱹᱭ ᱟᱠᱟᱱᱟ ᱡᱮ ᱱᱚᱣᱟ ᱪᱮᱫ ᱠᱟᱹᱢᱤᱭᱟ, ᱱᱚᱸᱰᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱱᱟᱜᱼᱟ, ᱟᱨ ᱱᱚᱣᱟ ᱨᱮᱱᱟᱜ ᱥᱤᱢᱟᱹ ᱪᱮᱫ ᱠᱚ ᱠᱟᱱᱟ᱾ ᱡᱚᱛᱚ ᱠᱤᱪᱷᱩ ᱯᱷᱩᱨᱪᱟᱹ ᱜᱮᱭᱟ — ᱴᱟᱠᱟ ᱵᱟᱝ ᱠᱚ ᱠᱷᱚᱡᱟ, ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱽᱭᱟᱯᱚᱱ ᱵᱟᱝ ᱠᱚ ᱩᱫᱩᱜᱟ, ᱟᱨ ᱱᱤᱡᱮᱨᱟᱜ ᱡᱟᱦᱟᱱ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱠᱚ ᱠᱷᱚᱡᱟ᱾',
  'ref.whatTitle': 'ᱱᱚᱸᱰᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱱᱟᱜᱼᱟ',
  'ref.what1': 'ᱚᱲᱟᱜ ᱨᱮ ᱥᱮᱸᱜᱮᱞ ᱞᱟᱜᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ, ᱵᱤᱡᱽᱞᱤ ᱪᱟᱞᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ, ᱜᱤᱫᱽᱨᱟᱹᱣᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱠᱚᱢᱡᱚᱨᱤ, ᱟᱭᱳ-ᱵᱟᱵᱟ ᱧᱮᱞ ᱡᱚᱛᱚᱱ — ᱱᱚᱝᱠᱟᱱ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱚᱥᱩᱵᱤᱫᱷᱟ ᱨᱮᱱᱟᱜ ᱥᱚᱡᱷᱮ ᱩᱯᱟᱹᱭ, ᱯᱷᱩᱨᱪᱟᱹ ᱯᱟᱹᱨᱥᱤ ᱛᱮ᱾',
  'ref.what2': 'ᱠᱩᱞᱤ ᱞᱟᱹᱭ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱨᱮᱱᱟᱜ ᱥᱩᱵᱤᱫᱷᱟ᱾ ᱞᱟᱹᱭ ᱵᱟᱢ ᱵᱟᱰᱟᱭᱟ ᱮᱱᱠᱷᱟᱱ ᱚᱞ ᱢᱮ — ᱵᱟᱱᱟᱨ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱢᱤᱫ ᱞᱮᱠᱟ ᱜᱮ ᱧᱟᱢᱚᱜᱼᱟ᱾',
  'ref.what3': 'ᱡᱚᱛᱚ ᱠᱩᱞᱤ ᱚᱞ ᱛᱟᱦᱮᱸᱱᱟ, ᱚᱱᱟᱛᱮ ᱡᱟᱦᱟᱸ ᱮᱴᱟᱜ ᱦᱚᱲ ᱠᱚ ᱚᱥᱩᱵᱤᱫᱷᱟ ᱮᱫ ᱠᱚᱣᱟ ᱚᱱᱟ ᱫᱚ ᱟᱢ ᱢᱟᱬᱟᱝ ᱨᱮᱜᱮ ᱠᱚ ᱠᱩᱞᱤ ᱟᱠᱟᱫᱟ ᱟᱨ ᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱧᱟᱢᱚᱜᱼᱟ᱾',
  'ref.what4': 'ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱽᱭᱟᱯᱚᱱ ᱵᱟᱝ, ᱵᱟᱹᱲᱛᱤ ᱠᱟᱛᱷᱟ ᱵᱟᱝ, ᱟᱨ ᱱᱤᱡᱮᱨᱟᱜ ᱡᱟᱦᱟᱱ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱠᱚ ᱠᱷᱚᱡᱟ᱾ ᱡᱚᱛᱚ ᱠᱤᱪᱷᱩ ᱯᱷᱩᱨᱪᱟᱹ᱾',
  'ref.helplineTitle': 'ᱩᱥᱟᱹᱨᱟ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱣᱟ ᱱᱚᱢᱵᱚᱨ ᱫᱚᱦᱚᱭ ᱢᱮ',
  'ref.helpline1': 'ᱡᱟᱦᱟᱸ ᱢᱟᱨᱟᱝ ᱵᱤᱯᱚᱫᱽ ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ — ᱡᱮᱞᱮᱠ ᱥᱮᱸᱜᱮᱞ, ᱵᱤᱡᱽᱞᱤ ᱛᱮ ᱛᱷᱟᱯᱚᱲ ᱦᱚᱪᱚ, ᱧᱩᱨᱩᱜ ᱟᱨᱵᱟᱝ ᱟᱹᱰᱤ ᱵᱟᱹᱲᱛᱤ ᱢᱟᱭᱟᱢ ᱞᱤᱸᱜᱤᱱ — ᱮᱱᱠᱷᱟᱱ 112 ᱨᱮ ᱯᱷᱚᱱ ᱢᱮ᱾',
  'ref.helpline2': 'ᱡᱟᱦᱟᱸᱭ ᱦᱚᱲ ᱟᱡᱟᱨ ᱟᱠᱟᱱᱟᱭ ᱟᱨᱵᱟᱝ ᱜᱷᱟᱹᱞ ᱟᱠᱟᱱᱟᱭ ᱟᱨ ᱪᱟᱞᱟᱜ ᱨᱮᱱᱟᱜ ᱦᱚᱨ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱮᱱᱠᱷᱟᱱ 108 ᱨᱮ ᱮᱢᱵᱩᱞᱮᱱᱥ ᱦᱚᱦᱚᱭ ᱢᱮ᱾',
  'ref.helpline3': 'ᱠᱩᱲᱤ ᱦᱚᱯᱚᱱ ᱥᱟᱶ ᱡᱟᱦᱟᱸ ᱵᱟᱹᱲᱤᱡ ᱠᱟᱹᱢᱤ ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ, ᱟᱨᱵᱟᱝ ᱠᱩᱲᱤ ᱦᱚᱯᱚᱱ ᱚᱠᱟᱨᱮᱦᱚᱸ ᱠᱚ ᱚᱥᱩᱵᱤᱫᱷᱟ ᱮᱫ ᱠᱚᱣᱟ, ᱮᱱᱠᱷᱟᱱ 181 ᱨᱮ ᱯᱷᱚᱱ ᱢᱮ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱯᱷᱩᱨᱪᱟᱹ ᱜᱮᱭᱟ᱾',
  'ref.helpline4': 'ᱜᱤᱫᱽᱨᱟᱹ ᱟᱨᱵᱟᱝ ᱟᱹᱛᱩ ᱦᱚᱲ ᱥᱟᱶ ᱡᱟᱦᱟᱸ ᱵᱟᱹᱲᱤᱡ ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ, 1098 ᱨᱮ ᱥᱤᱠᱟᱭᱚᱛ ᱮᱢ ᱜᱟᱱᱚᱜᱼᱟ᱾',
  'ref.helpline5': 'ᱢᱚᱱᱮ ᱨᱮ ᱟᱹᱰᱤ ᱵᱟᱹᱲᱛᱤ ᱪᱤᱱᱛᱟᱹ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ, ᱟᱨᱵᱟᱝ ᱡᱤᱭᱚᱱ ᱨᱮᱱᱟᱜ ᱟᱥᱟ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱮᱱᱠᱷᱟᱱ 14416 ᱨᱮ ᱞᱟᱹᱭ ᱜᱟᱱᱚᱜᱼᱟ᱾ ᱠᱷᱟᱹᱞᱤ ᱨᱚᱲ ᱞᱟᱹᱜᱤᱫ ᱜᱮ᱾',
  'ref.dataTitle': 'ᱟᱢᱟᱜ ᱵᱟᱵᱚᱛ ᱪᱮᱫ ᱞᱮ ᱫᱚᱦᱚᱭᱟ',
  'ref.dataBody': 'ᱠᱷᱟᱹᱞᱤ ᱚᱱᱟ ᱠᱩᱞᱤ ᱡᱟᱦᱟᱸ ᱟᱢᱮᱢ ᱠᱩᱞᱤ ᱟᱠᱟᱫᱟ, ᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱠᱟᱛᱷᱟ, ᱟᱨ ᱠᱩᱞᱤ ᱨᱮᱱᱟᱜ ᱚᱠᱛᱚ — ᱡᱮᱢᱚᱱ ᱟᱞᱮ ᱫᱚᱦᱲᱟ ᱫᱚᱦᱲᱟ ᱢᱤᱫ ᱛᱮᱞᱟ ᱟᱞᱮ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ ᱢᱟ᱾ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ, ᱴᱷᱤᱠᱟᱹᱱᱟ, ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ, ᱟᱨᱵᱟᱝ ᱟᱢ ᱪᱤᱱᱦᱟᱹᱣ ᱞᱟᱹᱜᱤᱫ ᱡᱟᱦᱟᱱ ᱠᱟᱛᱷᱟ ᱵᱟᱞᱮ ᱠᱷᱚᱡᱟ᱾ ᱥᱟᱭᱤᱴ ᱨᱮ ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱽᱭᱟᱯᱚᱱ ᱟᱨᱵᱟᱝ ᱴᱨᱮᱠᱤᱝ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'ref.adminTitle': 'ᱯᱨᱚᱵᱚᱱᱫᱷᱚᱠ ᱪᱮᱫ ᱠᱚ ᱠᱟᱹᱢᱤ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
  'ref.adminBody': 'ᱯᱨᱚᱵᱚᱱᱫᱷᱚᱠ ᱚᱱᱟ ᱚᱞ ᱠᱚ ᱧᱮᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ ᱡᱟᱦᱟᱸ ᱟᱢᱮᱢ ᱠᱩᱞᱤ ᱟᱠᱟᱫᱟ, ᱟᱨ ᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱩᱱᱠᱩ ᱟᱢᱟᱜ ᱢᱟᱹᱱ ᱵᱮᱜᱚᱨ ᱡᱟᱦᱟᱱ ᱚᱞ ᱵᱟᱝ ᱠᱚ ᱵᱚᱫᱚᱞ ᱟᱨᱵᱟᱝ ᱚᱪᱚᱜ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ, ᱟᱨ ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱚᱠᱚᱭ ᱴᱷᱮᱱ ᱦᱚᱸ ᱵᱟᱝ ᱠᱚ ᱟᱹᱠᱷᱨᱤᱧᱟ᱾',
  'ref.statsCategories': 'ᱵᱤᱥᱚᱭ ᱢᱮᱱᱟᱜᱼᱟ',
  'ref.statsArticles': 'ᱚᱞ ᱚᱞ ᱟᱠᱟᱱᱟ',
  'ref.statsQuestions': 'ᱠᱩᱞᱤ ᱦᱩᱭ ᱟᱠᱟᱱᱟ',
  'ref.ownerNote': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱫᱚ ᱡᱟᱦᱟᱸ ᱠᱚᱢᱯᱟᱹᱱᱤ ᱟᱜ ᱵᱟᱝ ᱠᱟᱱᱟ, ᱥᱚᱨᱠᱟᱨᱟᱜ ᱵᱟᱝ ᱠᱟᱱᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱢᱤᱫ ᱦᱚᱲᱟᱜ ᱩᱭᱦᱟᱹᱨ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ᱾ ᱚᱱᱟᱛᱮ ᱱᱚᱸᱰᱮ ᱪᱮᱫ ᱦᱚᱸ ᱵᱤᱜᱽᱭᱟᱯᱚᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱥᱚᱫᱚᱥᱭᱚᱛᱟ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱟᱨ ᱴᱟᱠᱟ ᱵᱟᱝ ᱠᱚ ᱠᱷᱚᱡᱟ᱾',
  'support.title': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱯᱷᱩᱨᱪᱟᱹ ᱜᱮᱭᱟ',
  'support.intro': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱚᱠᱚᱭ ᱴᱷᱮᱱ ᱦᱚᱸ ᱴᱟᱠᱟ ᱵᱟᱝ ᱠᱚ ᱠᱷᱚᱡᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ ᱱᱚᱣᱟ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ — ᱚᱱᱟᱛᱮ ᱛᱤᱱᱟᱹᱜ ᱜᱟᱱ ᱩᱯᱟᱹᱭ ᱢᱮᱱᱟᱜᱼᱟ ᱡᱟᱦᱟᱸ ᱛᱮ ᱟᱢ ᱜᱚᱲᱚ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱥᱚᱡᱷᱮ ᱩᱯᱟᱹᱭ ᱜᱮ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱠᱟᱹᱢᱤᱭᱟᱱᱟ᱾',
  'support.waysTitle': 'ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮᱢ ᱜᱚᱲᱚ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
  'support.way1Title': 'ᱟᱢᱟᱜ ᱚᱱᱩᱵᱷᱚᱵ ᱚᱞ ᱢᱮ',
  'support.way1Body': 'ᱡᱩᱫᱤ ᱱᱚᱣᱟ ᱥᱟᱭᱤᱴ ᱠᱷᱚᱱ ᱟᱢ ᱪᱮᱫ ᱦᱚᱸ ᱴᱷᱤᱠ ᱮᱢ ᱧᱟᱢ ᱟᱠᱟᱫᱟ — ᱟᱨᱵᱟᱝ ᱪᱮᱫ ᱦᱚᱸ ᱚᱱᱠᱟᱱᱟᱜ ᱧᱟᱢ ᱟᱠᱟᱫᱟ ᱡᱟᱦᱟᱸ ᱟᱢᱮᱢ ᱦᱟᱭᱨᱟᱱ ᱟᱠᱟᱱᱟ — ᱮᱱᱠᱷᱟᱱ ᱨᱟᱭ ᱯᱮᱡᱽ ᱨᱮ ᱚᱞ ᱢᱮ᱾ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱞᱟᱹᱠᱛᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'support.way2Title': 'ᱟᱢᱟᱜ ᱥᱚᱦᱚᱨ ᱵᱟᱵᱚᱛ ᱞᱟᱹᱭ ᱢᱮ',
  'support.way2Body': 'ᱟᱢ ᱡᱟᱦᱟᱸᱨᱮᱢ ᱛᱟᱦᱮᱸᱱᱟ, ᱚᱸᱰᱮᱱᱟᱜ ᱯᱟᱹᱨᱥᱤ, ᱨᱤᱛ-ᱨᱤᱣᱟᱡᱽ ᱟᱨ ᱚᱥᱩᱵᱤᱫᱷᱟ ᱮᱴᱟᱜ ᱜᱮᱭᱟ᱾ ᱡᱩᱫᱤ ᱟᱢᱟᱜ ᱚᱸᱰᱮᱱᱟᱜ ᱪᱮᱫ ᱠᱟᱛᱷᱟ ᱱᱚᱸᱰᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱮᱱᱠᱷᱟᱱ ᱞᱟᱹᱭ ᱢᱮ — ᱡᱚᱲᱟᱣ ᱜᱟᱱᱚᱜᱼᱟ ᱚᱱᱟ ᱡᱚᱲᱟᱣ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'support.way3Title': 'ᱟᱢᱟᱜ ᱚᱱᱩᱵᱷᱚᱵ ᱮᱴᱟᱜ ᱦᱚᱲ ᱞᱟᱹᱭ ᱟᱠᱚ ᱢᱮ',
  'support.way3Body': 'ᱡᱟᱦᱟᱸ ᱱᱚᱸᱰᱮ ᱚᱞ ᱟᱠᱟᱱᱟ ᱚᱱᱟ ᱟᱹᱰᱤ ᱦᱚᱲᱟᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱦᱤᱡᱩᱜᱼᱟ, ᱡᱩᱫᱤ ᱩᱱᱠᱩ ᱠᱚ ᱵᱟᱰᱟᱭᱟ᱾ ᱡᱟᱦᱟᱸᱭ ᱱᱚᱣᱟ ᱥᱟᱹᱨᱤ ᱜᱮ ᱜᱚᱲᱚ ᱮᱢᱟᱭᱟ ᱩᱱᱤ ᱞᱟᱹᱭ ᱟᱭ ᱢᱮ᱾',
  'support.way4Title': 'ᱱᱚᱸᱰᱮ ᱦᱮᱡ ᱠᱟᱛᱮ ᱧᱮᱞ ᱢᱮ',
  'support.way4Body': 'ᱡᱩᱫᱤ ᱟᱢᱟᱜ ᱚᱠᱛᱚ ᱢᱮᱱᱟᱜᱼᱟ, ᱮᱱᱠᱷᱟᱱ ᱟᱢ ᱛᱮᱜᱮ ᱦᱮᱡ ᱠᱟᱛᱮ ᱧᱮᱞ ᱢᱮ ᱡᱮ ᱱᱚᱣᱟ ᱥᱟᱭᱤᱴ ᱴᱷᱤᱠ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ ᱥᱮ ᱵᱟᱝ᱾ ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱹᱲᱤᱡ ᱧᱮᱞᱚᱜ ᱠᱷᱟᱱ ᱞᱟᱹᱭ ᱢᱮ — ᱯᱷᱩᱨᱪᱟᱹ ᱛᱮᱜᱮ ᱴᱷᱤᱠ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'support.contactTitle': 'ᱪᱮᱫ ᱞᱟᱹᱭ ᱥᱟᱱᱟᱢ ᱠᱟᱱᱟ?',
  'support.contactBody': 'ᱡᱟᱦᱟᱸ ᱠᱟᱛᱷᱟ ᱞᱟᱹᱜᱤᱫ ᱱᱚᱸᱰᱮ ᱚᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ — ᱪᱮᱫ ᱦᱚᱸ ᱵᱷᱩᱞ ᱦᱩᱭ ᱞᱮᱱᱠᱷᱟᱱ, ᱪᱮᱫ ᱦᱚᱸ ᱵᱟᱹᱲᱛᱤ ᱧᱟᱢ ᱞᱮᱱᱠᱷᱟᱱ, ᱟᱨᱵᱟᱝ ᱡᱟᱦᱟᱸ ᱠᱩᱞᱤ᱾ ᱡᱟᱦᱟᱸ ᱛᱤᱱᱟᱹᱜ ᱚᱞ ᱥᱚᱡᱷᱮ ᱵᱩᱡᱷᱟᱹᱜᱼᱟ, ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱢᱮ᱾',
  'support.faqTitle': 'ᱛᱤᱱᱟᱹᱜ ᱜᱟᱱ ᱠᱟᱛᱷᱟ ᱡᱟᱦᱟᱸ ᱫᱚᱦᱲᱟ ᱫᱚᱦᱲᱟ ᱠᱚ ᱠᱩᱞᱤᱭᱟ',
  'support.faqBody': 'ᱱᱚᱣᱟ ᱥᱟᱹᱨᱤ ᱜᱮ ᱯᱷᱩᱨᱪᱟᱹ ᱜᱮᱭᱟ? ᱦᱮᱸ᱾ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱠᱚ ᱦᱟᱛᱟᱣᱟ? ᱵᱟᱝ, ᱧᱩᱛᱩᱢ ᱮᱢ ᱞᱟᱹᱠᱛᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱵᱤᱜᱽᱭᱟᱯᱚᱱ ᱦᱤᱡᱩᱜᱼᱟ? ᱵᱟᱝ᱾ ᱡᱟᱦᱟᱸ ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ ᱟᱨᱵᱟᱝ ᱴᱷᱤᱠᱟᱹᱱᱟ ᱠᱚ ᱠᱷᱚᱡᱟ? ᱵᱟᱝ᱾ ᱡᱟᱦᱟᱸ ᱮᱯ ᱰᱟᱣᱩᱱᱞᱚᱰ ᱦᱩᱭᱩᱜᱼᱟ? ᱵᱟᱝ, ᱵᱽᱨᱟᱣᱡᱟᱨ ᱨᱮᱜᱮ ᱡᱷᱤᱡᱚᱜᱼᱟ᱾',
  'ask.label': 'ᱟᱢᱟᱜ ᱚᱥᱩᱵᱤᱫᱷᱟ ᱚᱞ ᱢᱮ ᱟᱨᱵᱟᱝ ᱢᱟᱭᱤᱠ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ',
  'ask.placeholder': 'ᱡᱮᱞᱮᱠ: ᱜᱤᱫᱽᱨᱟᱹᱣᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱠᱚᱢᱡᱚᱨᱤ ᱢᱮᱱᱟᱜᱼᱟ',
  'ask.help': 'ᱮᱱᱴᱟᱨ ᱫᱟᱵᱟᱣ ᱠᱟᱛᱮ ᱦᱚᱸ ᱠᱩᱞ ᱜᱟᱱᱚᱜᱼᱟ᱾',
  'ask.send': 'ᱠᱩᱞᱤ ᱢᱮ',
  'ask.sending': 'ᱩᱭᱦᱟᱹᱨ ᱮᱫᱟᱞᱮ…',
  'ask.clear': 'ᱚᱞ ᱟᱠᱟᱱᱟᱜ ᱢᱮᱴᱟᱣ ᱢᱮ',
  'ask.speak': 'ᱞᱟᱹᱭ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ',
  'ask.listening': 'ᱨᱚᱲ ᱮᱦᱚᱵ ᱢᱮ…',
  'ask.heard': 'ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ',
  'ask.stopListening': 'ᱟᱸᱡᱚᱢ ᱛᱷᱤᱨ ᱢᱮ',
  'ask.suggested': 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱠᱩᱞᱤ',
  'ask.answerTitle': 'ᱥᱟᱢᱟᱫᱷᱟᱱ',
  'ask.listen': 'ᱟᱸᱡᱚᱢ ᱢᱮ',
  'ask.stopSpeak': 'ᱛᱷᱤᱨ ᱢᱮ',
  'ask.aiNote': 'ᱱᱚᱣᱟ ᱛᱮᱞᱟ ᱫᱚ AI ᱮᱢᱟᱫ ᱢᱮᱭᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱚᱠᱚᱭ ᱵᱤᱥᱮᱥᱚᱜᱽᱭᱚ ᱟᱜ ᱥᱟᱞᱟᱦ ᱵᱟᱝ ᱠᱟᱱᱟ᱾',
  'ask.errorRateLimit': 'ᱟᱹᱰᱤ ᱜᱟᱱ ᱠᱩᱞᱤ ᱢᱤᱫ ᱫᱷᱟᱣ ᱛᱮ ᱠᱩᱞ ᱟᱠᱟᱱᱟ᱾ ᱛᱷᱚᱲᱟ ᱚᱠᱛᱚ ᱯᱚᱨᱮ ᱨᱤᱠᱟᱹᱭ ᱢᱮ᱾',
  'ask.errorNetwork': 'ᱤᱱᱴᱟᱨᱱᱮᱴ ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾ ᱠᱚᱱᱮᱠᱥᱚᱱ ᱧᱮᱞ ᱠᱟᱛᱮ ᱟᱨᱦᱚᱸ ᱨᱤᱠᱟᱹᱭ ᱢᱮ᱾',
  'ask.notAnswer': 'ᱱᱚᱣᱟ ᱠᱩᱞᱤ ᱨᱮᱱᱟᱜ ᱥᱚᱡᱷᱮ ᱛᱮᱞᱟ ᱟᱞᱮ ᱴᱷᱮᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'ask.emptyAnswer': 'ᱱᱚᱣᱟ ᱫᱷᱟᱣ ᱛᱮᱞᱟ ᱵᱟᱝ ᱵᱮᱱᱟᱣ ᱫᱟᱲᱮᱭᱟᱫᱟ᱾ ᱛᱷᱚᱲᱟ ᱵᱷᱮᱜᱟᱨ ᱛᱮ ᱟᱨᱦᱚᱸ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'ask.micUnsupported': 'ᱱᱚᱣᱟ ᱵᱨᱟᱣᱡᱟᱨ ᱨᱮ ᱨᱚᱲ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ᱾ ᱚᱞ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'ask.heardWith': 'ᱱᱚᱣᱟ ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ:',
  'voice.notAllowed': 'ᱢᱟᱭᱤᱠ ᱨᱮᱱᱟᱜ ᱯᱟᱨᱢᱤᱥᱚᱱ ᱵᱟᱝ ᱧᱟᱢ ᱟᱠᱟᱱᱟ᱾ ᱪᱮᱛᱟᱱ ᱨᱮ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱯᱟᱨᱢᱤᱥᱚᱱ ᱮᱢ ᱢᱮ, ᱵᱟᱝᱠᱷᱟᱱ ᱚᱞ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'voice.serviceNotAllowed': 'ᱢᱟᱭᱤᱠ ᱨᱮᱱᱟᱜ ᱯᱟᱨᱢᱤᱥᱚᱱ ᱵᱟᱝ ᱧᱟᱢ ᱟᱠᱟᱱᱟ᱾ ᱪᱮᱛᱟᱱ ᱨᱮ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱯᱟᱨᱢᱤᱥᱚᱱ ᱮᱢ ᱢᱮ, ᱵᱟᱝᱠᱷᱟᱱ ᱚᱞ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'voice.noSpeech': 'ᱚᱠᱟ ᱟᱲᱟᱝ ᱦᱚᱸ ᱵᱟᱝ ᱟᱸᱡᱚᱢ ᱞᱮᱱᱟ᱾ ᱢᱟᱭᱤᱠ ᱥᱩᱨ ᱨᱮ ᱨᱚᱲ ᱢᱮ, ᱵᱟᱝᱠᱷᱟᱱ ᱚᱞ ᱢᱮ᱾',
  'voice.audioCapture': 'ᱚᱠᱟ ᱢᱟᱭᱤᱠ ᱦᱚᱸ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱡᱚᱲᱟᱣ ᱢᱮ, ᱵᱟᱝᱠᱷᱟᱱ ᱚᱞ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'voice.network': 'ᱨᱚᱲ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱞᱟᱹᱜᱤᱫ ᱤᱱᱴᱟᱨᱱᱮᱴ ᱞᱟᱹᱠᱛᱤᱜᱼᱟ, ᱟᱨ ᱚᱱᱟ ᱵᱟᱝ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾ ᱚᱞ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ — ᱛᱮᱞᱟ ᱚᱱᱟ ᱜᱮ ᱧᱟᱢᱚᱜᱼᱟ᱾',
  'voice.aborted': 'ᱛᱷᱤᱨ ᱮᱱᱟ᱾ ᱟᱨᱦᱚᱸ ᱨᱤᱠᱟᱹᱭ ᱢᱮ᱾',
  'voice.unsupported': 'ᱱᱚᱣᱟ ᱵᱨᱟᱣᱡᱟᱨ ᱨᱮ ᱨᱚᱲ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ᱾ ᱚᱞ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'voice.speakFailed': 'ᱱᱚᱣᱟ ᱛᱮᱞᱟ ᱟᱸᱡᱚᱢ ᱦᱚᱪᱚ ᱵᱟᱝ ᱜᱟᱱ ᱞᱮᱱᱟ᱾',
  'voice.noVoice': 'ᱱᱚᱣᱟ ᱰᱤᱵᱷᱟᱭᱤᱥ ᱨᱮ {name} ᱨᱚᱲ ᱟᱲᱟᱝ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾ ᱱᱤᱛᱚᱜ ᱚᱞ ᱟᱠᱟᱱᱟ ᱯᱟᱲᱦᱟᱣ ᱢᱮ, ᱵᱟᱝᱠᱷᱟᱱ ᱯᱷᱚᱱ ᱥᱮᱴᱤᱝ ᱨᱮ ᱪᱟᱞᱟᱣ ᱠᱟᱛᱮ ᱟᱲᱟᱝ ᱡᱚᱲᱟᱣ ᱢᱮ᱾',
  'voice.generic': 'ᱪᱮᱫ ᱪᱚ ᱜᱟᱹᱞᱛᱤ ᱮᱱᱟ᱾ ᱟᱨᱦᱚᱸ ᱨᱤᱠᱟᱹᱭ ᱢᱮ᱾',
  'sound.title': 'ᱛᱷᱤᱨ ᱞᱟᱹᱜᱤᱫ ᱟᱲᱟᱝ',
  'sound.intro': 'ᱚᱠᱟ ᱯᱩᱭᱥᱟᱹ ᱵᱟᱝ, ᱚᱠᱟ ᱮᱰᱵᱷᱟᱨᱴᱟᱭᱤᱡᱽ ᱵᱟᱝ᱾ ᱥᱩᱢᱩᱝ ᱢᱚᱱᱮ ᱛᱷᱤᱨ ᱞᱟᱹᱜᱤᱫ᱾',
  'sound.playing': 'ᱟᱲᱟᱝ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ᱾ ᱛᱷᱤᱨ ᱞᱟᱹᱜᱤᱫ ᱟᱨᱦᱚᱸ ᱚᱱᱟ ᱵᱚᱴᱚᱱ ᱜᱮ ᱚᱛᱟᱭ ᱢᱮ᱾',
  'sound.shankh': 'ᱥᱟᱸᱠᱷ',
  'sound.shankhHint': 'ᱜᱟᱹᱦᱤᱨ, ᱡᱤᱞᱤᱧ',
  'sound.bansuri': 'ᱵᱟᱸᱥᱩᱨᱤ',
  'sound.bansuriHint': 'ᱱᱚᱨᱚᱢ, ᱛᱷᱤᱨ',
  'sound.dhol': 'ᱱᱟᱜᱟᱲᱟ',
  'sound.dholHint': 'ᱛᱤᱠᱷᱤᱱ, ᱟᱹᱰᱤ ᱩᱥᱟᱹᱨᱟ',
  'sound.all': 'ᱯᱮᱭᱟ',
  'sound.allHint': 'ᱢᱤᱫ ᱥᱟᱶᱛᱮ',
  'sound.listenLabel': 'ᱟᱸᱡᱚᱢ ᱢᱮ',
  'sound.errUnsupported': 'ᱱᱚᱣᱟ ᱵᱨᱟᱣᱡᱟᱨ ᱟᱲᱟᱝ ᱵᱟᱝ ᱪᱟᱹᱞᱩ ᱫᱟᱲᱮᱭᱟᱜ ᱠᱟᱱᱟ᱾',
  'sound.errGeneric': 'ᱟᱲᱟᱝ ᱪᱟᱹᱞᱩ ᱨᱮ ᱥᱚᱢᱚᱥᱭᱟ ᱦᱩᱭ ᱮᱱᱟ᱾',
  'dhun.welcome': 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ',
  'dhun.prompt': 'ᱥᱟᱸᱠᱷ, ᱵᱟᱸᱥᱩᱨᱤ ᱟᱨ ᱱᱟᱜᱟᱲᱟ — ᱥᱟᱶᱛᱮ ᱟᱸᱡᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱚᱛᱟᱭ ᱢᱮ᱾',
  'dhun.listen': '▶ ᱟᱸᱡᱚᱢ ᱢᱮ',
  'dhun.skip': 'ᱟᱲᱟᱝ ᱵᱟᱹᱜᱤᱭᱟᱜ ᱢᱮ',
  'dhun.failed': 'ᱟᱲᱟᱝ ᱵᱟᱝ ᱪᱟᱹᱞᱩ ᱞᱮᱱᱟ᱾',
  'dhun.label': 'ᱟᱲᱟᱝ ᱪᱟᱹᱞᱩ ᱞᱟᱹᱜᱤᱫ ᱯᱟᱨᱢᱤᱥᱚᱱ',
  'reviews.title': 'ᱟᱢᱟᱜ ᱢᱚᱛᱚ, ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ',
  'reviews.intro': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱟᱢᱟᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱦᱮᱡ ᱮᱱᱟ? ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱚᱞ ᱢᱮ — ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱫᱚ ᱞᱟᱹᱠᱛᱤ ᱵᱟᱝ ᱠᱟᱱᱟ᱾',
  'reviews.pageTitle': 'ᱟᱢᱟᱜ ᱢᱚᱛᱚ',
  'reviews.pageIntro': 'ᱱᱚᱸᱰᱮ ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱟᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱦᱚᱲ ᱠᱚ ᱚᱞ ᱟᱠᱟᱫᱟ᱾ ᱚᱠᱟ ᱢᱚᱛᱚ ᱦᱚᱸ ᱵᱟᱝ ᱫᱟᱯᱟᱞ ᱟᱠᱟᱱᱟ, ᱟᱨ ᱡᱟᱦᱟᱸ ᱚᱞ ᱟᱠᱟᱱᱟ ᱚᱱᱟ ᱱᱚᱸᱰᱮ ᱜᱮ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ — ᱥᱩᱢᱩᱝ ᱢᱤᱫ ᱫᱷᱟᱣ ᱧᱮᱞ ᱠᱮᱫ ᱯᱚᱨᱮ ᱯᱟᱨᱠᱟᱥᱚᱱ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'reviews.write': 'ᱟᱢᱟᱜ ᱢᱚᱛᱚ ᱚᱞ ᱢᱮ',
  'reviews.submit': 'ᱠᱩᱞ ᱢᱮ',
  'reviews.sending': 'ᱠᱩᱞ ᱮᱫᱟᱞᱮ…',
  'reviews.name': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ (ᱞᱟᱹᱠᱛᱤ ᱵᱟᱝ)',
  'reviews.city': 'ᱟᱢᱟᱜ ᱱᱟᱜᱟᱨ (ᱞᱟᱹᱠᱛᱤ ᱵᱟᱝ)',
  'reviews.comment': 'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ',
  'reviews.placeholder': 'ᱡᱟᱦᱟᱸ ᱢᱚᱱᱮ ᱨᱮ ᱦᱮᱡ ᱮᱱᱟ ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱢᱮ — ᱪᱮᱫ ᱦᱚᱸ ᱥᱟᱹᱦᱤ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱹᱠᱛᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'reviews.moderated': 'ᱟᱢᱟᱜ ᱨᱟᱭ ᱯᱟᱨᱥᱟᱞᱚᱜ ᱢᱟᱬᱟᱝ ᱛᱮ ᱢᱤᱫ ᱫᱷᱟᱣ ᱧᱮᱞᱚᱜᱼᱟ᱾',
  'reviews.moderationNote': 'ᱡᱚᱛᱚ ᱜᱮ ᱟᱞᱚ ᱢᱮᱴᱟᱜ ᱢᱟ ᱢᱮᱱᱛᱮ, ᱯᱟᱨᱥᱟᱞᱚᱜ ᱢᱟᱬᱟᱝ ᱛᱮ ᱡᱚᱛᱚ ᱨᱟᱭ ᱢᱤᱫ ᱫᱷᱟᱣ ᱧᱮᱞᱚᱜᱼᱟ᱾ ᱜᱟᱞᱤ, ᱱᱚᱢᱵᱚᱨ ᱥᱮ ᱱᱤᱡᱮᱨᱟᱜ ᱠᱟᱛᱷᱟ ᱠᱚ ᱚᱪᱚᱜᱚᱜᱼᱟ — ᱵᱟᱹᱠᱤ ᱫᱚ ᱚᱱᱠᱟ ᱜᱮ ᱯᱟᱨᱥᱟᱞᱚᱜᱼᱟ᱾',
  'reviews.summaryTitle': 'ᱥᱟᱱᱟᱢᱟᱜ ᱨᱟᱭ',
  'reviews.count': 'ᱨᱟᱭ ᱠᱚ',
  'reviews.anonymous': 'ᱧᱩᱛᱩᱢ ᱵᱮᱜᱚᱨ',
  'reviews.summaryLine': 'ᱦᱚᱲ ᱠᱚ ᱫᱚ ᱥᱟᱨᱟᱥᱟᱨᱤ {rating} ᱢᱩᱫᱽ ᱨᱮ 5 ᱛᱟᱨᱟ ᱠᱚ ᱮᱢᱟᱫᱟ {count} ᱫᱷᱟᱣ᱾',
  'reviews.starsLabel': '5 ᱢᱩᱫᱽ ᱨᱮ {value} ᱛᱟᱨᱟ',
  'reviews.keepLabel': 'ᱵᱟᱹᱲᱤᱡ ᱮᱱ ᱠᱷᱟᱱ ᱥᱮ ᱱᱟᱯᱟᱭ ᱮᱱ ᱠᱷᱟᱱ — ᱵᱟᱱᱟᱨ ᱜᱮ ᱚᱞ ᱢᱮ',
  'reviews.ownerReply': 'ᱛᱮᱞᱟ',
  'reviews.replyLabel': 'ᱱᱚᱣᱟ ᱪᱮᱛᱟᱱ ᱨᱮ ᱚᱞ ᱟᱠᱟᱱᱟ',
  'reviews.empty': 'ᱱᱤᱛᱚᱜ ᱫᱚ ᱚᱠᱚᱭᱟᱜ ᱦᱚᱸ ᱨᱟᱭ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱯᱩᱭᱞᱩ ᱫᱚ ᱟᱢ ᱚᱞ ᱢᱮ᱾',
  'reviews.toastSent': 'ᱥᱟᱨᱦᱟᱣ',
  'reviews.toastFailed': 'ᱨᱟᱭ ᱵᱟᱝ ᱠᱩᱞ ᱫᱟᱲᱮᱭᱟᱫᱟ',
  'reviews.fieldTooShort': 'ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ 10 ᱜᱚᱴᱟᱝ ᱟᱠᱷᱚᱨ ᱚᱞ ᱢᱮ᱾',
  'reviews.rateLimited': 'ᱟᱹᱰᱤ ᱩᱥᱟᱹᱨᱟ ᱠᱩᱞᱚᱜ ᱠᱟᱱᱟ᱾ ᱛᱷᱚᱲᱟ ᱡᱤᱨᱟᱹᱣ ᱠᱟᱛᱮ ᱟᱨᱦᱚᱸ ᱠᱩᱥᱤᱥ ᱢᱮ᱾',
  'cat.notFound': 'ᱱᱚᱣᱟ ᱥᱟᱦᱴᱟ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ',
  'cat.empty': 'ᱱᱚᱣᱟ ᱥᱟᱛᱟᱢ ᱨᱮ ᱱᱤᱛᱚᱜ ᱫᱚ ᱚᱠᱟ ᱚᱱᱚᱞ ᱦᱚᱸ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'article.emergency': 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ',
  'article.askAbout': 'ᱱᱚᱣᱟ ᱥᱟᱛᱟᱢ ᱨᱮ ᱠᱩᱞᱤ ᱢᱮ',
  'article.readAloud': 'ᱱᱚᱣᱟ ᱚᱱᱚᱞ ᱟᱸᱡᱚᱢ ᱢᱮ',
  'article.others': 'ᱱᱚᱣᱟ ᱥᱟᱛᱟᱢ ᱨᱮᱱᱟᱜ ᱮᱴᱟᱜ ᱚᱱᱚᱞ ᱠᱚ',
  'article.count': '{count} ᱚᱱᱚᱞ',
  'theme.toLight': 'ᱢᱟᱨᱥᱟᱞ ᱧᱮᱞᱚᱜ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ',
  'theme.toDark': 'ᱧᱩᱛ ᱧᱮᱞᱚᱜ ᱥᱮᱫ ᱪᱟᱞᱟᱜ ᱢᱮ',
  'toast.dismiss': 'ᱵᱚᱸᱫᱽ ᱢᱮ',
  'language.choose': 'ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
  'language.articlesIn': 'ᱱᱚᱣᱟ ᱚᱱᱚᱞ ᱫᱚ ᱦᱤᱱᱫᱤ ᱛᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
  'language.articlesInHint': 'ᱡᱚᱛᱚ ᱯᱟᱹᱨᱥᱤ ᱨᱮ ᱵᱷᱮᱜᱟᱨ ᱛᱚᱨᱡᱚᱢᱟ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱱᱚᱣᱟ ᱛᱚᱨᱡᱚᱢᱟ ᱫᱚ ᱱᱤᱛᱚᱜ ᱵᱟᱝ ᱦᱩᱭ ᱟᱠᱟᱱᱟ — ᱡᱟᱦᱟᱸ ᱚᱞ ᱟᱠᱟᱱᱟ ᱚᱱᱟ ᱫᱚ ᱦᱤᱱᱫᱤ ᱛᱮᱜᱮ ᱴᱷᱤᱠ ᱟᱨ ᱯᱩᱨᱟᱹᱣ ᱜᱮᱭᱟ᱾',
  'ask.welcome': 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ! ᱞᱟᱛᱟᱨ ᱨᱮ ᱟᱢᱟᱜ ᱟᱹᱥᱩᱞ ᱚᱞ ᱢᱮ ᱥᱮ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱥᱟᱛᱟᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'ref.notTitle': 'ᱱᱚᱣᱟ ᱪᱮᱫ ᱵᱟᱭ ᱪᱤᱠᱟᱹᱭᱟ',
  'ref.not1': 'ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟᱭ᱾ ᱨᱟᱱ ᱨᱮᱱᱟᱜ ᱥᱟᱞᱟᱦ ᱫᱚ ᱛᱤᱥ ᱦᱚᱸ ᱵᱟᱝ ᱮᱢᱚᱜᱼᱟ᱾',
  'ref.not2': 'ᱱᱚᱣᱟ ᱫᱚ ᱩᱠᱤᱞ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟᱭ᱾ ᱟᱹᱱ ᱨᱮᱱᱟᱜ ᱥᱟᱞᱟᱦ ᱫᱚ ᱵᱟᱝ ᱮᱢᱚᱜᱼᱟ᱾',
  'ref.not3': 'ᱚᱠᱟ ᱴᱟᱠᱟ ᱦᱚᱸ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ, ᱟᱨ ᱚᱠᱟ ᱯᱟᱨᱪᱟᱨ ᱦᱚᱸ ᱵᱟᱝ ᱩᱫᱩᱜᱚᱜᱼᱟ᱾',
  'ref.not4': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ, ᱴᱷᱤᱠᱟᱹᱱᱟ ᱥᱮ ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ ᱵᱟᱝ ᱠᱷᱚᱡᱚᱜᱼᱟ ᱟᱨ ᱵᱟᱝ ᱫᱚᱦᱚᱜᱼᱟ᱾',
  'ref.not5': 'ᱚᱠᱟ ᱥᱚᱨᱠᱟᱨᱤ ᱡᱚᱡᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱫᱟᱢ ᱥᱮ ᱱᱚᱢᱵᱚᱨ ᱵᱟᱝ ᱵᱮᱱᱟᱜᱼᱟ — ᱥᱟᱹᱨᱤ ᱠᱟᱛᱷᱟ ᱵᱟᱝ ᱵᱟᱰᱟᱭ ᱞᱮᱱ ᱠᱷᱟᱱ ᱥᱟᱯᱷᱟ ᱞᱟᱹᱭᱚᱜᱼᱟ ᱡᱮ ᱵᱟᱝ ᱵᱟᱰᱟᱭᱟ᱾',
  'ref.medicalTitle': 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ: ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨᱟᱜ ᱥᱟᱞᱟᱦ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ',
  'ref.medicalBody': 'ᱟᱡᱟᱨ, ᱨᱟᱱ ᱥᱮ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱵᱤᱥᱟᱹᱞᱩ ᱡᱤᱱᱤᱥ ᱥᱟᱶ ᱡᱚᱲᱟᱣ ᱠᱟᱛᱷᱟ ᱛᱟᱦᱮᱸᱱ ᱠᱷᱟᱱ, ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱬᱟᱝ ᱰᱟᱠᱛᱟᱨ ᱥᱟᱶ ᱧᱟᱯᱟᱢ ᱢᱮ᱾ ᱱᱚᱰᱮ ᱮᱢ ᱟᱠᱟᱱ ᱠᱟᱛᱷᱟ ᱫᱚ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱜᱮᱭᱟ᱾ ᱜᱤᱫᱽᱨᱟᱹᱣᱟᱜ ᱴᱤᱠᱟᱹ, ᱦᱟᱢᱮᱞ ᱚᱠᱛᱚ, ᱥᱮ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱨᱟᱱ ᱮᱛᱚᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱰᱟᱠᱛᱟᱨᱟᱜ ᱥᱟᱞᱟᱦ ᱡᱟᱹᱨᱩᱲ ᱦᱟᱛᱟᱣ ᱢᱮ᱾',
  'ref.statsTitle': 'ᱛᱤᱱᱟᱹᱜ ᱠᱟᱛᱷᱟ ᱢᱮᱱᱟᱜᱼᱟ',
  'support.howTitle': 'ᱟᱞᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱜᱚᱲᱚ ᱟᱞᱮᱭᱟ',
  'support.alwaysFreeTitle': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱫᱚ ᱡᱟᱣᱜᱮ ᱯᱷᱨᱤ ᱛᱟᱦᱮᱸᱱᱟ',
  'support.alwaysFreeBody': 'ᱡᱟᱦᱟᱸ ᱜᱚᱲᱚ ᱜᱮ ᱧᱟᱢᱚᱜᱼᱟ, ᱚᱱᱟ ᱫᱚ ᱥᱮᱵᱟ ᱪᱟᱞᱟᱣ ᱨᱮᱜᱮ ᱞᱟᱜᱟᱜᱼᱟ᱾ ᱚᱠᱚᱭ ᱴᱷᱮᱱ ᱠᱷᱚᱱ ᱦᱚᱸ ᱴᱟᱠᱟ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ᱾',
  'smriti.eyebrow': 'ᱟᱫᱚᱨᱟᱧᱡᱚᱞᱤ',
  'smriti.whyTitle': 'ᱱᱚᱣᱟ ᱥᱟᱭᱤᱴ ᱫᱚ ᱪᱮᱫᱟᱜ ᱢᱮᱱᱟᱜᱼᱟ',
  'smriti.ending': 'ᱩᱱᱠᱩᱣᱟᱜ ᱞᱟᱹᱲᱦᱟᱹᱭ ᱱᱚᱰᱮ ᱜᱮ ᱞᱟᱦᱟ ᱤᱫᱤᱜᱼᱟ᱾',
  'article.askAny': 'ᱡᱟᱦᱟᱸᱱᱟᱜ ᱠᱩᱞᱤ ᱢᱮ',
  'article.remember': 'ᱩᱭᱦᱟᱹᱨ ᱫᱚᱦᱚᱭ ᱢᱮ',
  'article.emergencyInfo': 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱛᱷᱟ',
  'article.medicalTitle': 'ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨᱟᱜ ᱥᱟᱞᱟᱦ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ',
  'article.medicalBody': 'ᱱᱚᱣᱟ ᱠᱟᱛᱷᱟ ᱫᱚ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱜᱚᱲᱚ ᱞᱟᱹᱜᱤᱫ ᱜᱮᱭᱟ᱾ ᱚᱠᱟ ᱨᱟᱱ ᱦᱚᱸ ᱮᱛᱚᱦᱚᱵ ᱥᱮ ᱵᱚᱸᱫᱽ ᱟᱞᱚᱢ ᱪᱤᱠᱟᱹᱭᱟ — ᱢᱟᱬᱟᱝ ᱰᱟᱠᱛᱟᱨ ᱥᱟᱶ ᱧᱟᱯᱟᱢ ᱢᱮ᱾',
  'article.heading': '{category} ᱨᱮᱱᱟᱜ ᱚᱱᱚᱞ',
  'reviews.rateQuestion': 'ᱛᱤᱱᱟᱹᱜ ᱛᱟᱨᱟ ᱮᱢᱚᱜᱼᱟ?',
  'reviews.starsShort': '{value} ᱛᱟᱨᱟ',
  'reviews.averageOutOf': '5 ᱢᱩᱫᱽ ᱨᱮ {value} ᱛᱟᱨᱟ',
  'dhun.welcomeTitle': 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ',
  'dhun.consent': 'ᱥᱟᱸᱠᱷ, ᱵᱟᱸᱥᱩᱨᱤ ᱟᱨ ᱱᱟᱜᱟᱲᱟ — ᱥᱟᱶᱛᱮ ᱟᱸᱡᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱹᱴᱟᱹᱣ ᱢᱮ᱾',
  'dhun.unsupported': 'ᱱᱚᱣᱟ ᱵᱨᱟᱣᱡᱟᱨ ᱨᱮ ᱟᱲᱟᱝ ᱵᱟᱝ ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ᱾',
  'dhun.failedTry': 'ᱟᱲᱟᱝ ᱪᱟᱹᱞᱩ ᱨᱮ ᱟᱹᱥᱩᱞ ᱦᱩᱭ ᱮᱱᱟ᱾',
  'sound.hintIdle': 'ᱡᱟᱦᱟᱸᱱᱟᱜ ᱵᱚᱴᱚᱱ ᱫᱟᱵᱟᱣ ᱠᱟᱛᱮ ᱟᱲᱟᱝ ᱟᱸᱡᱚᱢ ᱢᱮ᱾',
  'sound.hintPlaying': 'ᱟᱲᱟᱝ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ᱾ ᱛᱷᱟᱢᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱚᱱᱟ ᱵᱚᱴᱚᱱ ᱜᱮ ᱟᱨᱦᱚᱸ ᱫᱟᱵᱟᱣ ᱢᱮ᱾',
  'sound.preparing': 'ᱟᱲᱟᱝ ᱥᱟᱯᱲᱟᱣ ᱟᱠᱟᱱᱟ',
  'nav.path': 'ᱰᱟᱦᱟᱨ',
  'health.heading': 'ᱟᱢᱟᱜ ᱩᱢᱮᱨ ᱞᱟᱹᱭ ᱢᱮ',
  'health.intro': 'ᱩᱢᱮᱨ ᱞᱮᱠᱟᱛᱮ ᱡᱟᱦᱟᱸ ᱠᱩᱞᱤ ᱠᱚ ᱟᱹᱰᱤ ᱫᱷᱟᱣ ᱠᱩᱞᱤ ᱦᱩᱭᱩᱜᱼᱟ, ᱚᱱᱟ ᱱᱚᱰᱮ ᱧᱮᱞᱚᱜᱼᱟ᱾ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱵᱚᱴᱚᱱ ᱫᱟᱵᱟᱣ ᱢᱮ — ᱠᱩᱞᱤ ᱞᱟᱛᱟᱨ ᱨᱮ ᱯᱮᱨᱮᱡᱚᱜᱼᱟ, ᱚᱱᱟ ᱛᱟᱭᱚᱢ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'health.ageLabel': 'ᱩᱢᱮᱨ (ᱥᱮᱨᱢᱟ)',
  'health.years': 'ᱥᱮᱨᱢᱟ',
  'health.bandsLabel': 'ᱩᱢᱮᱨ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
  'health.notAdviceStrong': 'ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨᱤ ᱥᱟᱞᱟᱦ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ᱾',
  'health.notAdvice': 'ᱡᱟᱦᱟᱸᱱᱟᱜ ᱜᱮ ᱨᱟᱱ ᱮᱦᱚᱵ ᱟᱨᱵᱟᱝ ᱵᱚᱸᱫᱚ ᱟᱞᱚᱢ ᱠᱟᱹᱢᱤᱭᱟ — ᱢᱟᱬᱟᱝ ᱰᱟᱠᱛᱟᱨ ᱥᱟᱞᱟᱜ ᱧᱟᱯᱟᱢ ᱢᱮ᱾',
  'health.emergencyStrong': 'ᱡᱟᱹᱨᱩᱲ ᱚᱠᱛᱚ ᱯᱷᱚᱱ ᱢᱮ:',
  'health.emergencyCall': '(ᱡᱟᱹᱨᱩᱲ ᱚᱠᱛᱚ)',
  'health.emergencyAmbulance': '(ᱮᱢᱵᱩᱞᱮᱱᱥ)',
  'health.emergencyWomen': '(ᱢᱟᱭᱡᱤᱣ ᱦᱮᱞᱯᱞᱟᱭᱤᱱ)',
  'health.privacy': 'ᱡᱟᱦᱟᱸᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨᱵᱟᱝ ᱴᱷᱟᱶ ᱚᱞ ᱨᱮᱱᱟᱜ ᱫᱚᱨᱠᱟᱨ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'health.band.infant.label': '0 – 2 ᱥᱮᱨᱢᱟ',
  'health.band.infant.note': 'ᱦᱩᱰᱤᱧ ᱜᱤᱫᱽᱨᱟᱹ, ᱡᱟᱦᱟᱸᱭ ᱟᱠᱚᱣᱟᱜ ᱠᱟᱛᱷᱟ ᱵᱟᱠᱚ ᱞᱟᱹᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ',
  'health.c.infant1': 'ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱚᱨᱚᱜ',
  'health.q.infant1': 'ᱤᱧᱤᱡ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱹᱰᱤ ᱡᱩᱨ ᱦᱚᱨᱚᱜ ᱟᱠᱟᱱᱟ, ᱛᱚᱣᱟᱧ ᱮᱢᱟᱭᱟ?',
  'health.c.infant2': 'ᱡᱚᱢ ᱵᱟᱭ ᱡᱚᱢᱮᱫᱟ',
  'health.q.infant2': 'ᱦᱩᱰᱤᱧ ᱜᱤᱫᱽᱨᱟᱹ ᱡᱚᱢ ᱵᱟᱭ ᱡᱚᱢᱮᱫᱟ, ᱪᱮᱫ ᱤᱧ ᱠᱟᱹᱢᱤᱭᱟ?',
  'health.c.infant3': 'ᱩᱞᱴᱤ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ',
  'health.q.infant3': 'ᱜᱤᱫᱽᱨᱟᱹ ᱩᱞᱴᱤ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ, ᱛᱤᱥ ᱰᱟᱠᱛᱟᱨ ᱴᱷᱮᱱ ᱤᱧ ᱤᱫᱤᱭᱮᱭᱟ?',
  'health.c.infant4': 'ᱵᱟᱹᱲᱤᱡ ᱯᱮᱴ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ',
  'health.q.infant4': 'ᱜᱤᱫᱽᱨᱟᱹ ᱵᱟᱹᱲᱤᱡ ᱯᱮᱴ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱡᱚᱢ ᱚᱪᱚᱭᱟ?',
  'health.band.child.label': '3 – 12 ᱥᱮᱨᱢᱟ',
  'health.band.child.note': 'ᱜᱤᱫᱽᱨᱟᱹ ᱡᱟᱦᱟᱸᱭ ᱠᱚ ᱨᱚᱲ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ, ᱢᱮᱱᱠᱷᱟᱱ ᱠᱩᱞᱤ ᱠᱷᱚᱱ ᱠᱚ ᱵᱚᱛᱚᱨᱚᱜᱼᱟ',
  'health.c.child1': 'ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱢᱚᱱᱮ ᱵᱟᱹᱱᱩᱜ',
  'health.q.child1': 'ᱜᱤᱫᱽᱨᱟᱹᱣᱟᱜ ᱯᱟᱲᱦᱟᱣ ᱨᱮ ᱢᱚᱱᱮ ᱵᱟᱹᱱᱩᱜ, ᱪᱮᱫ ᱤᱧ ᱠᱟᱹᱢᱤᱭᱟ?',
  'health.c.child2': 'ᱟᱥᱲᱟ ᱪᱟᱞᱟᱜ ᱵᱟᱭ ᱠᱩᱥᱤᱭᱟᱜ',
  'health.q.child2': 'ᱜᱤᱫᱽᱨᱟᱹ ᱫᱤᱱᱟᱹᱢ ᱟᱥᱲᱟ ᱪᱟᱞᱟᱜ ᱮ ᱢᱟᱱᱟᱭᱮᱫᱟ, ᱪᱮᱫ ᱮ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?',
  'health.c.child3': 'ᱧᱤᱫᱟᱹ ᱦᱚᱨᱚᱜ',
  'health.q.child3': 'ᱜᱤᱫᱽᱨᱟᱹ ᱧᱤᱫᱟᱹ ᱦᱚᱨᱚᱜ ᱮ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱠᱟᱹᱢᱤᱭᱟ?',
  'health.c.child4': 'ᱫᱟᱸᱛ ᱨᱟᱹᱯᱩᱫᱚᱜ ᱠᱟᱱᱟ',
  'health.q.child4': 'ᱜᱤᱫᱽᱨᱟᱹᱣᱟᱜ ᱫᱟᱸᱛ ᱨᱟᱹᱯᱩᱫᱚᱜ ᱠᱟᱱᱟ, ᱫᱟᱸᱛ ᱪᱮᱫ ᱞᱮᱠᱟᱧ ᱧᱮᱞ ᱥᱟᱢᱴᱟᱣᱟ?',
  'health.band.teen.label': '13 – 17 ᱥᱮᱨᱢᱟ',
  'health.band.teen.note': 'ᱠᱩᱲᱤ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱨ ᱠᱚᱲᱟ ᱜᱤᱫᱽᱨᱟᱹ, ᱡᱟᱦᱟᱸᱭ ᱠᱚ ᱟᱸᱡᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱦᱚᱲ ᱵᱟᱠᱚ ᱧᱟᱢᱮᱫ ᱠᱚᱣᱟ',
  'health.c.teen1': 'ᱯᱟᱲᱦᱟᱣ ᱨᱮᱱᱟᱜ ᱵᱷᱟᱨ',
  'health.q.teen1': 'ᱯᱟᱲᱦᱟᱣ ᱨᱮᱱᱟᱜ ᱟᱹᱰᱤ ᱵᱷᱟᱨ ᱢᱮᱱᱟᱜᱼᱟ, ᱪᱮᱫ ᱞᱮᱠᱟᱧ ᱥᱟᱢᱟᱝᱟ?',
  'health.c.teen2': 'ᱡᱟᱹᱯᱤᱫ ᱵᱟᱝ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ',
  'health.q.teen2': 'ᱧᱤᱫᱟᱹ ᱡᱟᱹᱯᱤᱫ ᱴᱷᱤᱠ ᱛᱮ ᱵᱟᱝ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱠᱟᱹᱢᱤᱭᱟ?',
  'health.c.teen3': 'ᱢᱚᱵᱟᱭᱤᱞ ᱨᱮᱱᱟᱜ ᱟᱹᱵᱷᱭᱟᱥ',
  'health.q.teen3': 'ᱢᱚᱵᱟᱭᱤᱞ ᱨᱮᱱᱟᱜ ᱟᱹᱵᱷᱭᱟᱥ ᱦᱩᱭ ᱟᱠᱟᱱᱟ, ᱵᱟᱹᱜᱤᱭᱟᱜ ᱩᱯᱟᱹᱭ ᱞᱟᱹᱭ ᱢᱮ᱾',
  'health.c.teen4': 'ᱟᱹᱰᱤ ᱫᱩᱠ',
  'health.q.teen4': 'ᱟᱹᱰᱤ ᱫᱩᱠ ᱵᱩᱡᱷᱟᱹᱜ ᱠᱟᱱᱟ, ᱚᱠᱚᱭ ᱥᱟᱞᱟᱜ ᱤᱧ ᱨᱚᱲᱟ?',
  'health.band.young.label': '18 – 30 ᱥᱮᱨᱢᱟ',
  'health.band.young.note': 'ᱠᱟᱹᱢᱤ, ᱯᱩᱭᱥᱟᱹ ᱟᱨ ᱡᱟᱹᱯᱤᱫ — ᱯᱮᱭᱟ ᱨᱮᱱᱟᱜ ᱵᱷᱟᱨ',
  'health.c.young1': 'ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱛᱟᱱᱟᱣ',
  'health.q.young1': 'ᱠᱟᱹᱢᱤ ᱨᱮᱱᱟᱜ ᱛᱟᱱᱟᱣ ᱟᱹᱰᱤ ᱡᱟᱹᱥᱛᱤ ᱢᱮᱱᱟᱜᱼᱟ, ᱪᱮᱫ ᱞᱮᱠᱟᱧ ᱠᱚᱢᱟᱣᱟ?',
  'health.c.young2': 'ᱫᱩᱲᱩᱵ ᱛᱟᱦᱮᱸᱱ ᱛᱮ ᱛᱤᱠᱤᱱ ᱦᱟᱹᱥᱩ',
  'health.q.young2': 'ᱫᱩᱲᱩᱵ ᱛᱟᱦᱮᱸᱱ ᱛᱮ ᱛᱤᱠᱤᱱ ᱦᱟᱹᱥᱩ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱠᱟᱹᱢᱤᱭᱟ?',
  'health.c.young3': 'ᱡᱟᱹᱯᱤᱫ ᱵᱟᱝ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ',
  'health.q.young3': 'ᱧᱤᱫᱟᱹ ᱡᱟᱹᱯᱤᱫ ᱵᱟᱝ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱩᱯᱟᱹᱭ ᱢᱮᱱᱟᱜᱼᱟ?',
  'health.c.young4': 'ᱴᱟᱠᱟ ᱠᱚᱢ ᱜᱮᱭᱟ',
  'health.q.young4': 'ᱴᱟᱠᱟ ᱠᱚᱢ ᱜᱮᱭᱟ ᱟᱨ ᱠᱷᱚᱨᱚᱪ ᱵᱟᱹᱲᱛᱤ, ᱪᱮᱫ ᱤᱧ ᱪᱤᱠᱟᱹᱭᱟ?',
  'health.band.middle.label': '᱓᱑ – ᱔᱕ ᱥᱮᱨᱢᱟ',
  'health.band.middle.note': 'ᱚᱲᱟᱜ, ᱜᱤᱫᱽᱨᱟᱹ ᱟᱨ ᱟᱡᱟᱜ ᱦᱚᱲᱢᱚ — ᱡᱚᱛᱚᱣᱟᱜ ᱫᱟᱭᱤᱛᱛᱚ ᱢᱤᱫ ᱥᱟᱶᱛᱮ',
  'health.c.middle1': 'ᱛᱤᱸᱜᱩ ᱦᱟᱹᱥᱩ',
  'health.q.middle1': 'ᱛᱤᱸᱜᱩ ᱦᱟᱹᱥᱩ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?',
  'health.c.middle2': 'ᱡᱟᱹᱯᱤᱫ ᱴᱷᱤᱠ ᱵᱟᱝ',
  'health.q.middle2': 'ᱡᱟᱹᱯᱤᱫ ᱴᱷᱤᱠ ᱵᱟᱝ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ, ᱱᱟᱯᱟᱭ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱩᱯᱟᱹᱭ ᱢᱮᱱᱟᱜᱼᱟ?',
  'health.c.middle3': 'ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱪᱤᱱᱛᱟᱹ',
  'health.q.middle3': 'ᱚᱲᱟᱜ ᱨᱮ ᱟᱹᱰᱤ ᱪᱤᱱᱛᱟᱹ ᱢᱮᱱᱟᱜᱼᱟ, ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱪᱮᱫ ᱞᱮᱠᱟᱧ ᱥᱟᱢᱵᱽᱲᱟᱣ ᱠᱚᱣᱟ?',
  'health.c.middle4': 'ᱯᱮᱴ ᱨᱮ ᱜᱮᱥ',
  'health.q.middle4': 'ᱠᱟᱹᱢᱤ ᱨᱮ ᱟᱹᱰᱤ ᱥᱮᱨᱢᱟ ᱠᱷᱚᱱ ᱯᱮᱴ ᱨᱮ ᱜᱮᱥ ᱨᱮᱱᱟᱜ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱢᱮᱱᱟᱜᱼᱟ, ᱪᱮᱫ ᱤᱧ ᱪᱤᱠᱟᱹᱭᱟ?',
  'health.band.later.label': '᱔᱖ – ᱖᱐ ᱥᱮᱨᱢᱟ',
  'health.band.later.note': 'ᱦᱚᱲᱢᱚ ᱨᱮᱱᱟᱜ ᱩᱢᱮᱨ ᱟᱨ ᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱡᱚᱛᱚᱱ — ᱵᱟᱱᱟᱨ ᱢᱤᱫ ᱥᱟᱶᱛᱮ',
  'health.c.later1': 'ᱯᱤᱴᱷᱟᱹ ᱦᱟᱹᱥᱩ',
  'health.q.later1': 'ᱤᱧᱟᱜ ᱩᱢᱮᱨ ᱕᱔ ᱥᱮᱨᱢᱟ ᱟᱨ ᱤᱧᱟᱜ ᱯᱤᱴᱷᱟᱹ ᱦᱟᱹᱥᱩ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱪᱤᱠᱟᱹᱭᱟ?',
  'health.c.later2': 'ᱡᱟᱸᱜᱟ ᱦᱟᱹᱥᱩ',
  'health.q.later2': 'ᱫᱮᱡᱚᱜ ᱚᱠᱛᱚ ᱡᱟᱸᱜᱟ ᱦᱟᱹᱥᱩ ᱠᱟᱱᱟ, ᱪᱮᱫᱟᱜ?',
  'health.c.later3': 'ᱧᱤᱫᱟᱹ ᱡᱟᱸᱜᱟ ᱛᱟᱹᱲᱤ ᱦᱟᱹᱥᱩ',
  'health.q.later3': 'ᱧᱤᱫᱟᱹ ᱡᱟᱸᱜᱟ ᱛᱟᱹᱲᱤ ᱦᱟᱹᱥᱩ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱤᱧ ᱪᱤᱠᱟᱹᱭᱟ?',
  'health.c.later4': 'ᱥᱮᱛᱟᱜ ᱡᱟᱹᱲᱤ',
  'health.q.later4': 'ᱥᱮᱛᱟᱜ ᱵᱮᱨᱮᱫ ᱠᱟᱛᱮ ᱛᱤᱸᱜᱩ ᱡᱟᱹᱲᱤ ᱜᱮ ᱵᱩᱡᱷᱟᱹᱜᱼᱟ, ᱪᱮᱫ ᱠᱷᱟᱹᱛᱤᱨ ᱦᱩᱭ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?',
  'health.band.senior.label': '᱖᱑ – ᱗᱕ ᱥᱮᱨᱢᱟ',
  'health.band.senior.note': 'ᱫᱟᱹᱨᱩ, ᱥᱚᱱᱛᱩᱞᱚᱱ ᱟᱨ ᱮᱠᱞᱟ ᱛᱟᱦᱮᱸᱱ — ᱯᱮᱭᱟ ᱢᱤᱫ ᱥᱟᱶᱛᱮ',
  'health.c.senior1': 'ᱛᱟᱲᱟᱢ ᱨᱮ ᱟᱥᱩᱵᱤᱫᱷᱟ',
  'health.q.senior1': 'ᱡᱟᱸᱜᱟ ᱟᱹᱰᱤ ᱦᱟᱹᱥᱩ ᱠᱟᱱᱟ ᱛᱟᱲᱟᱢ ᱦᱚᱸ ᱟᱹᱰᱤ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱜᱮᱭᱟ, ᱪᱮᱫ ᱤᱧ ᱪᱤᱠᱟᱹᱭᱟ?',
  'health.c.senior2': 'ᱫᱟᱹᱨᱩ ᱨᱮᱱᱟᱜ ᱡᱟᱸᱪ',
  'health.q.senior2': 'ᱟᱹᱰᱤ ᱜᱟᱱ ᱫᱟᱹᱨᱩ ᱫᱤᱱᱟᱹᱢ ᱡᱚᱢ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ — ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱰᱟᱭᱚᱜᱼᱟ ᱚᱠᱟᱴᱟᱜ ᱠᱷᱟᱛᱨᱟ ᱜᱮᱭᱟ?',
  'health.c.senior3': 'ᱧᱤᱫᱟᱹ ᱯᱤᱥᱟᱵᱽ',
  'health.q.senior3': 'ᱧᱤᱫᱟᱹ ᱟᱹᱰᱤ ᱫᱷᱟᱣ ᱯᱤᱥᱟᱵᱽ ᱨᱮᱱᱟᱜ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱢᱮᱱᱟᱜᱼᱟ, ᱪᱮᱫ ᱤᱧ ᱪᱤᱠᱟᱹᱭᱟ?',
  'health.c.senior4': 'ᱠᱚᱢ ᱟᱸᱡᱚᱢ',
  'health.q.senior4': 'ᱠᱚᱢ ᱟᱸᱡᱚᱢᱚᱜ ᱠᱟᱱᱟ, ᱟᱸᱡᱚᱢ ᱨᱮᱱᱟᱜ ᱪᱮᱫ ᱩᱯᱟᱹᱭ ᱢᱮᱱᱟᱜᱼᱟ?',
  'health.band.elder.label': '᱗᱖ – ᱑᱐᱐ ᱥᱮᱨᱢᱟ',
  'health.band.elder.note': 'ᱡᱚᱛᱚ ᱫᱟᱹᱨᱩ ᱨᱮᱱᱟᱜ ᱡᱟᱸᱪ ᱞᱟᱹᱠᱛᱤ, ᱡᱚᱛᱚ ᱧᱩᱨᱩᱜ ᱜᱮ ᱜᱟᱹᱦᱤᱨ',
  'health.c.elder1': 'ᱧᱩᱨᱩᱜ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ',
  'health.q.elder1': 'ᱚᱲᱟᱜ ᱨᱮ ᱧᱩᱨᱩᱜ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨ ᱢᱮᱱᱟᱜᱼᱟ, ᱪᱮᱫ ᱞᱮᱠᱟᱱ ᱥᱩᱨᱚᱠᱷᱟ ᱤᱧ ᱫᱚᱦᱚᱭᱟ?',
  'health.c.elder2': 'ᱩᱭᱦᱟᱹᱨ ᱫᱟᱲᱮ ᱠᱚᱢ',
  'health.q.elder2': 'ᱩᱭᱦᱟᱹᱨ ᱫᱟᱲᱮ ᱠᱚᱢᱚᱜ ᱠᱟᱱᱟ, ᱪᱮᱫ ᱩᱯᱟᱹᱭ ᱢᱮᱱᱟᱜᱼᱟ?',
  'health.c.elder3': 'ᱫᱤᱱᱟᱹᱢ ᱦᱟᱹᱥᱩ ᱫᱟᱹᱨᱩ',
  'health.q.elder3': 'ᱦᱟᱹᱥᱩ ᱫᱟᱹᱨᱩ ᱫᱤᱱᱟᱹᱢ ᱡᱚᱢ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ — ᱱᱚᱣᱟ ᱨᱮᱱᱟᱜ ᱪᱮᱫ ᱠᱷᱟᱛᱨᱟ ᱢᱮᱱᱟᱜᱼᱟ?',
  'health.c.elder4': 'ᱛᱤᱥ ᱰᱟᱠᱛᱚᱨ ᱴᱷᱮᱱ',
  'health.q.elder4': 'ᱛᱤᱥ ᱰᱟᱠᱛᱚᱨ ᱴᱷᱮᱱ ᱪᱟᱞᱟᱜ ᱞᱟᱹᱠᱛᱤ ᱜᱮᱭᱟ?',
  'ask.notConfigured': 'ᱱᱚᱣᱟ ᱥᱮᱵᱟ ᱱᱤᱛᱚᱜ ᱟᱡᱟᱜ ᱢᱟᱨᱮ ᱛᱮᱞᱟ ᱠᱷᱚᱱ ᱛᱮᱞᱟ ᱮᱢᱚᱜ ᱠᱟᱱᱟ᱾ ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱚᱸᱰᱮ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾',
  'ask.browseTitle': 'ᱱᱚᱸᱰᱮ ᱡᱟᱦᱟᱸ ᱚᱱᱚᱞ ᱢᱮᱱᱟᱜᱼᱟ, ᱚᱱᱟ ᱧᱮᱞ ᱢᱮ',
  'download.pdf': 'PDF ᱛᱮ ᱚᱞ ᱢᱮ',
  'download.text': 'ᱴᱮᱠᱥᱴ ᱛᱮ ᱚᱞ ᱢᱮ',
  'download.printNow': 'ᱯᱨᱤᱱᱴ ᱢᱮ',
  'download.preparing': 'ᱛᱮᱭᱟᱨᱚᱜ ᱠᱟᱱᱟ',
  'download.blocked': 'ᱱᱟᱣᱟ ᱴᱮᱵᱽ ᱵᱟᱝ ᱡᱷᱤᱡ ᱞᱮᱱᱟ᱾ Pop-up ᱵᱚᱱᱫᱚ ᱢᱮᱱᱟᱜᱼᱟ — ᱟᱢᱟᱜ ᱵᱨᱟᱣᱡᱟᱨ ᱨᱮ ᱵᱷᱮᱜᱟᱨ ᱴᱮᱵᱽ ᱡᱷᱤᱡ ᱢᱮ᱾',
  'attach.button': 'ᱟᱢᱟᱜ ᱫᱚᱥᱛᱟᱵᱮᱡᱽ ᱥᱮ ᱯᱷᱚᱴᱚ ᱡᱚᱲᱟᱣ ᱢᱮ',
  'attach.formats': 'PDF, ᱯᱷᱚᱴᱚ (JPG/PNG) ᱥᱮ ᱴᱮᱠᱥᱴ ᱯᱷᱟᱭᱤᱞ — ᱑᱒ MB ᱫᱷᱟᱹᱵᱤᱡ',
  'attach.reading': 'ᱯᱟᱲᱦᱟᱣᱮᱫᱟᱭ…',
  'attach.attached': 'ᱞᱟᱜᱟᱣ ᱮᱱᱟ',
  'attach.remove': 'ᱚᱪᱚᱜ ᱢᱮ',
  'attach.tooBigPdf': 'ᱱᱚᱣᱟ PDF ᱫᱚ 12 MB ᱠᱷᱚᱱ ᱢᱟᱨᱟᱝ ᱜᱮᱭᱟ᱾ ᱦᱩᱰᱤᱧ ᱯᱷᱟᱭᱤᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'attach.tooBigImage': 'ᱱᱚᱣᱟ ᱯᱷᱚᱴᱚ ᱫᱚ 3 MB ᱠᱷᱚᱱ ᱢᱟᱨᱟᱝ ᱜᱮᱭᱟ᱾ ᱦᱩᱰᱤᱧ ᱯᱷᱚᱴᱚ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'attach.scannedPdf': 'ᱱᱚᱣᱟ PDF ᱫᱚ ᱥᱠᱮᱱ ᱟᱠᱟᱱᱟ — ᱱᱚᱣᱟ ᱨᱮ ᱥᱩᱢᱩᱝ ᱪᱤᱛᱟᱹᱨ ᱢᱮᱱᱟᱜᱼᱟ, ᱯᱟᱲᱦᱟᱣ ᱵᱟᱝ ᱜᱟᱱᱚᱜᱼᱟ᱾ ᱱᱚᱣᱟ ᱨᱮᱱᱟᱜ ᱯᱷᱚᱴᱚ ᱠᱩᱞ ᱢᱮ᱾',
  'attach.pdfFailed': 'ᱱᱚᱣᱟ PDF ᱵᱟᱝ ᱯᱟᱲᱦᱟᱣ ᱞᱮᱱᱟ᱾',
  'attach.imageFailed': 'ᱱᱚᱣᱟ ᱯᱷᱚᱴᱚ ᱵᱟᱝ ᱞᱚᱰ ᱞᱮᱱᱟ᱾',
  'attach.wrongType': 'ᱱᱚᱣᱟ ᱯᱷᱟᱭᱤᱞ ᱫᱚ ᱵᱟᱝ ᱠᱟᱹᱢᱤᱭᱟ᱾ PDF, ᱯᱷᱚᱴᱚ ᱥᱮ ᱴᱮᱠᱥᱴ ᱯᱷᱟᱭᱤᱞ ᱠᱩᱞ ᱢᱮ᱾',
  'attach.hint': 'ᱟᱢᱟᱜ ᱠᱟᱜᱚᱡᱽ ᱱᱚᱰᱮ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱢᱮ — ᱟᱞᱮ ᱚᱱᱟ ᱠᱷᱚᱱ ᱜᱮᱞᱮ ᱞᱟᱹᱭᱟ᱾',
  'ask.sendWithFile': 'ᱛᱮᱞᱟ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ',
  'lib.title': 'ᱯᱷᱨᱤ ᱞᱟᱭᱵᱨᱮᱨᱤ',
  'lib.intro': 'ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱚᱵ, ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱚᱰᱤᱭᱳ — ᱡᱚᱛᱚ ᱯᱷᱨᱤ ᱟᱨ ᱟᱹᱱᱟᱹᱨᱤ ᱞᱮᱠᱟᱛᱮ᱾',
  'lib.legalTitle': 'ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱨᱮᱱᱟᱜ ᱪᱮᱫ ᱦᱚᱸ ᱡᱷᱟᱹᱞ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'lib.legal': 'ᱱᱚᱰᱮ ᱡᱟᱦᱟᱸ ᱜᱮ ᱮᱢ ᱟᱠᱟᱱᱟ, ᱚᱱᱟ ᱫᱚ ᱯᱩᱨᱟᱹ ᱯᱷᱨᱤ ᱜᱮᱭᱟ ᱟᱨ ᱟᱢ ᱱᱚᱣᱟ ᱫᱚ ᱮᱴᱟᱜ ᱠᱚ ᱴᱷᱮᱱ ᱦᱚᱸ ᱦᱟᱹᱴᱤᱧ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱡᱟᱦᱟᱸ ᱯᱚᱛᱚᱵ ᱱᱤᱛᱚᱜ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ, ᱚᱱᱟ ᱫᱚ ᱱᱚᱰᱮ ᱵᱟᱝ ᱛᱟᱦᱮᱸᱱᱟ — ᱚᱱᱟ ᱫᱚ ᱟᱢ ᱵᱟᱢ ᱠᱚᱯᱤ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ, ᱱᱚᱣᱟ ᱥᱟᱯᱷᱟ ᱞᱟᱹᱭ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾',
  'ask.signInFirst': 'ᱢᱟᱲᱟᱝ ᱞᱚᱜᱽ ᱤᱱ ᱢᱮ, ᱤᱱᱟᱹ ᱛᱟᱭᱚᱢ ᱠᱩᱞᱤ ᱢᱮ᱾',
  'ask.signInTitle': 'ᱢᱟᱲᱟᱝ ᱞᱚᱜᱽ ᱤᱱ ᱢᱮ',
  'ask.signInBody': 'ᱠᱩᱞᱤ ᱞᱟᱹᱜᱤᱫ ᱟᱢᱟᱜ ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱢᱮ᱾ ᱱᱚᱣᱟ ᱨᱮ ᱢᱤᱫ ᱴᱤᱯᱤᱡ ᱠᱷᱚᱱ ᱦᱚᱸ ᱠᱚᱢ ᱚᱠᱛᱚ ᱞᱟᱜᱟᱜᱼᱟ, ᱟᱨ ᱟᱢ ᱠᱩᱞᱤ ᱛᱟᱦᱮᱸᱱᱟᱢ᱾',
  'ask.signInCta': 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱢᱮ ᱥᱮ ᱞᱚᱜᱽ ᱤᱱ ᱢᱮ',
  'ask.signInOr': 'ᱱᱤᱛᱚᱜ ᱮᱠᱟᱣᱩᱱᱴ ᱵᱟᱢ ᱵᱮᱱᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ? ᱱᱚᱣᱟ ᱠᱟᱹᱢᱤ ᱦᱚᱸ ᱟᱢ ᱵᱮᱜᱚᱨ ᱦᱩᱭᱩᱜᱼᱟ:',
  'account.title': 'ᱤᱧᱟᱜ ᱮᱠᱟᱣᱩᱱᱴ',
  'account.intro': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱯᱟᱥᱣᱚᱨᱰ ᱮᱢ ᱠᱟᱛᱮ ᱠᱩᱞᱤ ᱮᱦᱚᱵ ᱢᱮ᱾',
  'account.signIn': 'ᱵᱚᱞᱚᱱ ᱢᱮ',
  'account.register': 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱢᱮ',
  'account.signInNote': 'ᱢᱟᱲᱟᱝ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱟᱨ ᱯᱟᱥᱣᱚᱨᱰ ᱮᱢ ᱢᱮ᱾',
  'account.registerNote': 'ᱠᱩᱞᱤ ᱞᱟᱹᱜᱤᱫ ᱮᱠᱟᱣᱩᱱᱴ ᱫᱚ ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱥᱩᱢᱩᱝ ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱛᱮᱞᱟ ᱫᱚᱦᱚ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ᱾',
  'account.handle': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ',
  'account.handlePlaceholder': 'ᱡᱮᱢᱚᱱ: sita.ji',
  'account.password': 'ᱯᱟᱥᱣᱚᱨᱰ',
  'account.passwordHint': 'ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ 6 ᱜᱚᱴᱟᱝ ᱟᱠᱷᱚᱨ᱾',
  'account.phone': 'ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ',
  'account.optional': 'ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ',
  'account.phoneHint': 'ᱮᱢ ᱥᱟᱱᱟ ᱞᱮᱱᱠᱷᱟᱱ ᱮᱢ ᱢᱮ᱾ ᱯᱷᱚᱱ ᱵᱟᱢ ᱮᱢ ᱞᱮᱱ ᱨᱮᱦᱚᱸ ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣᱚᱜᱼᱟ᱾',
  'account.create': 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱢᱮ',
  'account.logout': 'ᱚᱰᱚᱠᱚᱜ ᱢᱮ',
  'account.open': 'ᱮᱠᱟᱣᱩᱱᱴ ᱡᱷᱤᱡ ᱢᱮ',
  'account.signedInAs': 'ᱟᱢ ᱞᱚᱜᱽ ᱤᱱ ᱟᱠᱟᱱᱟᱢ',
  'account.signedOut': 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱟᱝ ᱡᱷᱤᱡ ᱟᱠᱟᱱᱟ',
  'account.signedOutBody': 'ᱱᱤᱛᱚᱜ ᱪᱮᱫ ᱦᱚᱸ ᱮᱠᱟᱣᱩᱱᱴ ᱵᱟᱝ ᱡᱷᱤᱡ ᱟᱠᱟᱱᱟ᱾',
  'account.saved': 'ᱫᱚᱦᱚ ᱟᱠᱟᱱ ᱛᱮᱞᱟ',
  'account.savedEmpty': 'ᱱᱤᱛᱚᱜ ᱪᱮᱫ ᱦᱚᱸ ᱛᱮᱞᱟ ᱵᱟᱝ ᱫᱚᱦᱚ ᱟᱠᱟᱱᱟ᱾ ᱛᱮᱞᱟ ᱦᱮᱡ ᱞᱮᱱᱠᱷᱟᱱ \'ᱫᱚᱦᱚ ᱢᱮ\' ᱫᱟᱵᱟᱣ ᱢᱮ᱾',
  'account.savedUnavailable': 'ᱫᱚᱦᱚ ᱟᱠᱟᱱ ᱛᱮᱞᱟ ᱱᱤᱛᱚᱜ ᱵᱟᱝ ᱧᱮᱞᱚᱜ ᱠᱟᱱᱟ᱾ ᱮᱴᱟᱜ ᱡᱚᱛᱚ ᱪᱟᱹᱞᱩᱜ ᱠᱟᱱᱟ᱾',
  'account.wait': 'ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱛᱟᱺᱜᱤ ᱢᱮ…',
  'account.privacyTitle': 'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱫᱚ ᱥᱩᱨᱚᱠᱷᱤᱛ',
  'account.privacyBody': 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱞᱮᱱᱠᱷᱟᱱ ᱥᱩᱢᱩᱝ ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ, ᱯᱟᱥᱣᱚᱨᱰ ᱟᱨ ᱯᱟᱹᱨᱥᱤ ᱫᱚᱦᱚ ᱦᱩᱭᱩᱜᱼᱟ᱾ ᱠᱩᱞᱤ ᱨᱮᱱᱟᱜ ᱪᱮᱫ ᱦᱚᱸ ᱨᱮᱠᱚᱨᱰ ᱵᱟᱝ ᱵᱮᱱᱟᱣᱚᱜᱼᱟ᱾ ᱟᱢᱟᱜ ᱠᱩᱞᱤ ᱫᱚ ᱚᱠᱚᱭ ᱴᱷᱮᱱ ᱦᱚᱸ ᱵᱟᱝ ᱠᱩᱞ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'account.errWrong': 'ᱧᱩᱛᱩᱢ ᱥᱮ ᱯᱟᱥᱣᱚᱨᱰ ᱵᱷᱩᱞ ᱜᱮᱭᱟ᱾',
  'account.errTaken': 'ᱱᱚᱣᱟ ᱧᱩᱛᱩᱢ ᱫᱚ ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱜᱮ ᱦᱟᱛᱟᱣ ᱟᱠᱟᱱᱟ᱾ ᱮᱴᱟᱜ ᱧᱩᱛᱩᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ᱾',
  'account.errBad': 'ᱡᱟᱱᱠᱟᱨᱤ ᱴᱷᱤᱠ ᱛᱮ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾',
  'account.errWait': 'ᱟᱹᱰᱤ ᱫᱷᱟᱣ ᱪᱮᱥᱴᱟ ᱦᱩᱭ ᱮᱱᱟ᱾ ᱛᱷᱚᱲᱟ ᱚᱠᱛᱚ ᱛᱟᱭᱚᱢ ᱪᱮᱥᱴᱟ ᱢᱮ᱾',
  'account.errTryLater': 'ᱱᱤᱛᱚᱜ ᱵᱟᱝ ᱦᱩᱭ ᱞᱮᱱᱟ᱾ ᱛᱷᱚᱲᱟ ᱚᱠᱛᱚ ᱛᱟᱭᱚᱢ ᱪᱮᱥᱴᱟ ᱢᱮ᱾',
  'lib.licence.ccBy': 'ᱟᱢ ᱱᱚᱣᱟ ᱠᱚᱯᱤ ᱟᱨ ᱥᱮᱭᱟᱨ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ, ᱪᱷᱟᱯᱟ ᱦᱚᱸ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ — ᱥᱩᱢᱩᱝ ᱥᱚᱨᱚᱥ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱮᱢ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'lib.licence.ccBySa': 'ᱟᱢ ᱱᱚᱣᱟ ᱠᱚᱯᱤ ᱟᱨ ᱪᱷᱟᱯᱟ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾ ᱡᱟᱦᱟᱸ ᱵᱚᱫᱚᱞ ᱮᱢ ᱠᱟᱹᱢᱤᱭᱟ, ᱚᱱᱟ ᱦᱚᱸ ᱡᱷᱤᱡ ᱠᱟᱛᱮ ᱮᱢ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'lib.licence.ccZero': 'ᱯᱩᱨᱟᱹ ᱯᱷᱨᱤ᱾ ᱥᱚᱨᱚᱥ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ ᱮᱢ ᱦᱚᱸ ᱵᱟᱝ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
  'lib.licence.pd': 'ᱚᱠᱚᱭᱟᱜ ᱦᱚᱸ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱵᱟᱹᱱᱩᱜᱼᱟ — ᱡᱟᱦᱟᱸᱭ ᱠᱩᱥᱤ ᱠᱚᱯᱤ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾',
  'lib.licence.govtIndia': 'ᱥᱤᱧᱚᱛ ᱥᱚᱨᱠᱟᱨᱟᱜ ᱣᱮᱵᱥᱟᱭᱤᱴ ᱨᱮ᱾ ᱯᱟᱲᱦᱟᱣ ᱟᱨ ᱪᱷᱟᱯᱟ ᱵᱟᱱᱟᱨ ᱜᱮ ᱯᱷᱨᱤ᱾',
  'lib.licence.creativeCommons': 'ᱡᱚᱛᱚ ᱯᱷᱟᱭᱤᱞ ᱨᱮᱱᱟᱜ ᱟᱡᱟᱜ ᱞᱟᱭᱥᱮᱱᱥ ᱢᱮᱱᱟᱜᱼᱟ — ᱯᱷᱟᱭᱤᱞ ᱨᱮ ᱧᱮᱞ ᱢᱮ᱾',
  'lib.licence.freeToRead': 'ᱯᱟᱲᱦᱟᱣ ᱫᱚ ᱯᱷᱨᱤ ᱜᱮᱭᱟ᱾ ᱠᱚᱯᱤ ᱠᱟᱛᱮ ᱮᱴᱟᱜ ᱠᱚ ᱮᱢ ᱦᱚᱸ ᱚᱱᱟ ᱥᱚᱨᱛᱚ ᱛᱮᱜᱮ ᱦᱩᱭᱩᱜᱼᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱱᱚᱣᱟ ᱧᱟᱢ ᱟᱠᱟᱱᱟ᱾',
  'lib.openBadge': 'ᱡᱷᱤᱡ',
  'lib.openBadgeNote': 'ᱱᱚᱣᱟ ᱫᱚ ᱠᱚᱯᱤ ᱜᱟᱱᱚᱜᱼᱟ',
  'lib.freeBadge': 'ᱯᱷᱩᱨᱜᱟᱹᱞ',
  'lib.freeBadgeNote': 'ᱯᱟᱲᱦᱟᱣ ᱜᱟᱱᱚᱜᱼᱟ, ᱠᱚᱯᱤ ᱫᱚ ᱵᱟᱝ',
  'lib.govt': 'ᱥᱚᱨᱠᱟᱨᱤ',
  'lib.noSignup': 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱜᱚᱨ',
  'lib.open': 'ᱱᱚᱸᱰᱮ ᱡᱷᱤᱡ ᱢᱮ',
  'lib.group.padhai': 'ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱚᱵ',
  'lib.group.padhai.note': 'ᱟᱥᱲᱟ, ᱠᱚᱞᱮᱡᱽ ᱟᱨ ᱥᱚᱨᱠᱟᱨᱤ ᱥᱮᱪᱮᱫ ᱥᱟᱢᱟᱱ',
  'lib.group.kitab': 'ᱯᱚᱛᱚᱵ',
  'lib.group.kitab.note': 'ᱡᱟᱦᱟᱸ ᱨᱮ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱵᱟᱹᱱᱩᱜᱼᱟ ᱟᱨᱵᱟᱝ ᱠᱚᱯᱤ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱣ ᱢᱮᱱᱟᱜᱼᱟ',
  'lib.group.tasveer': 'ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱱᱚᱠᱥᱟ',
  'lib.group.tasveer.note': 'ᱱᱚᱠᱥᱟ, ᱪᱤᱛᱟᱹᱨ, ᱪᱤᱱᱦᱟᱹ — ᱡᱚᱛᱚ ᱜᱮ',
  'lib.group.audio': 'ᱟᱸᱡᱚᱢ ᱞᱮᱠᱟᱱ ᱥᱟᱢᱟᱱ',
  'lib.group.audio.note': 'ᱯᱚᱛᱚᱵ ᱟᱸᱡᱚᱢ ᱠᱟᱛᱮ, ᱢᱟᱨᱟᱝ ᱟᱠᱷᱚᱨ ᱛᱮ ᱫᱚ ᱵᱟᱝ',
  'lib.warnTitle': 'ᱡᱚᱛᱚ ᱯᱚᱛᱚᱵ ᱱᱚᱸᱰᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ',
  'lib.warn': 'ᱛᱤᱱᱟᱹᱜ ᱜᱟᱱ ᱯᱚᱛᱚᱵ ᱱᱤᱛᱚᱜ ᱠᱚᱯᱤᱨᱟᱭᱤᱴ ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ ᱟᱨ ᱚᱱᱟ ᱠᱚ ᱟᱹᱱᱟᱹᱨᱤ ᱞᱮᱠᱟᱛᱮ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱛᱮ ᱵᱟᱝ ᱮᱢ ᱜᱟᱱᱚᱜᱼᱟ᱾ ᱟᱞᱮ ᱫᱚ ᱵᱟᱰᱟᱭ ᱠᱟᱛᱮ ᱚᱱᱟ ᱫᱚ ᱵᱟᱞᱮ ᱩᱫᱩᱜᱟ᱾ ᱡᱩᱫᱤ ᱡᱟᱦᱟᱸ ᱯᱚᱛᱚᱵ ᱞᱟᱹᱠᱛᱤᱜ ᱠᱟᱱᱟ ᱮᱱᱠᱷᱟᱱ ᱞᱟᱛᱟᱨ ᱨᱮ ᱠᱩᱞᱤ ᱢᱮ — ᱡᱟᱦᱟᱸ ᱛᱮᱞᱟ ᱧᱟᱢᱚᱜᱼᱟ, ᱚᱱᱟ ᱫᱚ ᱧᱟᱢᱚᱜ ᱜᱮᱭᱟ᱾',
  'lib.askInstead': 'ᱠᱩᱞᱤ ᱢᱮ',
  'nav.library': 'ᱯᱚᱛᱚᱵ ᱚᱲᱟᱜ',
  'support.contactMessageLabel': 'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ',
  'support.contactPlaceholder': 'ᱡᱟᱦᱟᱸ ᱚᱞ ᱥᱟᱱᱟᱢ ᱠᱟᱱᱟ ᱚᱱᱟ ᱜᱮ ᱚᱞ ᱢᱮ — ᱡᱩᱫᱤ ᱵᱷᱩᱞ ᱢᱮᱱᱟᱜᱼᱟ, ᱡᱩᱫᱤ ᱱᱟᱯᱟᱭ ᱧᱟᱢ ᱟᱠᱟᱱᱟ, ᱟᱨᱵᱟᱝ ᱡᱟᱦᱟᱸ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜᱼᱟ᱾',
  'support.contactHelp': 'ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱑᱐ ᱜᱚᱴᱟᱝ ᱟᱠᱷᱚᱨ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱥᱚᱡᱷᱮ ᱢᱟᱹᱞᱤᱠ ᱴᱷᱮᱱ ᱥᱮᱱᱚᱜᱼᱟ᱾',
  'support.contactSubmit': 'ᱠᱩᱞ ᱢᱮ',
  'support.contactSending': 'ᱠᱩᱞ ᱮᱫᱟᱭ…',
  'support.contactPrivacy': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱞ ᱫᱚ ᱞᱟᱹᱠᱛᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾',
  'support.contactSent': 'ᱥᱮᱴᱮᱨ ᱮᱱᱟ',
  'support.contactSentBody': 'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱢᱟᱹᱞᱤᱠ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨ ᱟᱠᱟᱱᱟ᱾',
  'support.contactFailed': 'ᱵᱟᱝ ᱠᱩᱞ ᱜᱟᱱ ᱞᱮᱱᱟ',
  'support.faq1Q': 'ᱱᱚᱣᱟ ᱫᱚ ᱥᱟᱹᱨᱤ ᱜᱮ ᱯᱷᱩᱨᱜᱟᱹᱞ ᱜᱮᱭᱟ?',
  'support.faq1A': 'ᱦᱮᱸ᱾ ᱪᱮᱫ ᱯᱩᱭᱥᱟᱹ ᱦᱚᱸ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ, ᱪᱮᱫ ᱮᱰᱵᱷᱟᱨᱴᱟᱭᱤᱡᱽᱢᱮᱱᱴ ᱦᱚᱸ ᱵᱟᱝ ᱧᱮᱞᱚᱜᱼᱟ, ᱟᱨ ᱪᱮᱫ ᱥᱚᱫᱚᱥᱭᱚᱛᱟ ᱦᱚᱸ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱢᱤᱫ ᱦᱚᱲᱟᱜ ᱯᱩᱭᱥᱟᱹ ᱛᱮ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸᱭ ᱠᱚᱢᱯᱟᱹᱱᱤ ᱟᱨᱵᱟᱝ ᱥᱚᱨᱠᱟᱨᱟᱜ ᱯᱩᱭᱥᱟᱹ ᱛᱮ ᱫᱚ ᱵᱟᱝ᱾',
  'support.faq2Q': 'ᱤᱧᱟᱜ ᱧᱩᱛᱩᱢ, ᱴᱷᱤᱠᱟᱹᱱᱟ ᱟᱨᱵᱟᱝ ᱯᱷᱚᱱ ᱱᱚᱢᱵᱚᱨ ᱠᱚ ᱦᱟᱛᱟᱣᱟ?',
  'support.faq2A': 'ᱵᱟᱝ, ᱟᱨ ᱱᱚᱣᱟ ᱫᱚ ᱵᱟᱝ ᱦᱟᱛᱟᱣᱚᱜᱼᱟ᱾ ᱱᱚᱣᱟ ᱥᱟᱭᱤᱴ ᱫᱚ ᱟᱡᱟᱜ ᱛᱮ ᱪᱮᱫ ᱯᱚᱨᱤᱪᱚᱭ ᱦᱚᱸ ᱵᱟᱭ ᱵᱮᱱᱟᱣᱟ — ᱪᱮᱫ ᱞᱚᱜᱤᱱ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱪᱮᱫ ᱴᱨᱮᱠᱤᱝ ᱥᱠᱨᱤᱯᱴ ᱦᱚᱸ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱡᱟᱦᱟᱸ ᱠᱩᱞᱤ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ ᱚᱱᱟ ᱫᱚ ᱥᱩᱢᱩᱝ ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱠᱟᱱᱟ ᱟᱨ ᱡᱚᱠᱷᱚᱱ ᱟᱢ ᱮᱢ ᱠᱩᱞᱤᱭᱟ᱾',
  'support.faq3Q': 'ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨ ᱟᱨᱵᱟᱝ ᱩᱠᱤᱞ ᱠᱟᱱᱟᱭ?',
  'support.faq3A': 'ᱵᱟᱝ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱪᱮᱫ ᱨᱟᱱ ᱨᱮᱱᱟᱜ ᱥᱟᱞᱟᱦ ᱵᱟᱭ ᱮᱢᱟ ᱟᱨ ᱵᱟᱝ ᱪᱮᱫ ᱟᱹᱱᱟᱹᱨᱤ ᱥᱟᱞᱟᱦ᱾ ᱡᱟᱦᱟᱸ ᱨᱮ ᱠᱟᱛᱷᱟ ᱜᱟᱹᱦᱤᱨ ᱜᱮᱭᱟ ᱚᱸᱰᱮ ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨ ᱟᱨᱵᱟᱝ ᱚᱯᱷᱤᱥᱟᱨ ᱴᱷᱮᱱ ᱥᱮᱱᱚᱜ ᱞᱟᱹᱜᱤᱫ ᱮ ᱢᱮᱛᱟᱢᱟ — ᱱᱚᱣᱟ ᱫᱚ ᱩᱱᱠᱩᱣᱟᱜ ᱡᱟᱭᱜᱟ ᱫᱚ ᱵᱟᱭ ᱦᱟᱛᱟᱣᱟ᱾',
  'support.faq4Q': 'ᱡᱚᱛᱚ ᱛᱮᱞᱟ ᱪᱮ ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ?',
  'support.faq4A': 'ᱡᱚᱛᱚ ᱫᱷᱟᱣ ᱫᱚ ᱵᱟᱝ᱾ ᱛᱮᱞᱟ ᱫᱚ ᱢᱤᱫ ᱠᱚᱢᱯᱭᱩᱴᱟᱨ ᱚᱞᱟ, ᱪᱮᱫ ᱰᱟᱠᱛᱟᱨ ᱫᱚ ᱵᱟᱝ — ᱚᱱᱟᱛᱮ ᱡᱚᱛᱚ ᱛᱮᱞᱟ ᱥᱟᱶ ᱱᱚᱣᱟ ᱚᱞ ᱟᱠᱟᱱᱟ ᱡᱮ ᱱᱚᱣᱟ ᱫᱚ ᱢᱮᱰᱤᱠᱟᱞ ᱥᱟᱞᱟᱦ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ᱾ ᱡᱟᱦᱟᱸ ᱨᱟᱱ ᱮᱦᱚᱵ ᱟᱨᱵᱟᱝ ᱵᱚᱸᱫᱚ ᱞᱟᱦᱟ ᱨᱮ ᱰᱟᱠᱛᱟᱨ ᱥᱟᱶ ᱡᱟᱹᱨᱩᱨ ᱧᱟᱯᱟᱢ ᱢᱮ᱾',
  'support.faq5Q': 'ᱤᱧ ᱪᱮ ᱮᱯ ᱰᱟᱭᱩᱱᱞᱚᱰ ᱦᱩᱭᱩᱜ ᱛᱤᱧᱟ?',
  'support.faq5A': 'ᱵᱟᱝ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱥᱩᱢᱩᱝ ᱵᱨᱟᱣᱡᱟᱨ ᱨᱮ ᱡᱷᱤᱡᱚᱜᱼᱟ᱾ ᱪᱮᱫ ᱮᱯ ᱤᱱᱥᱴᱚᱞ ᱵᱟᱝ, ᱪᱮᱫ ᱟᱱᱩᱢᱟᱛᱤ ᱵᱟᱝ, ᱪᱮᱫ ᱟᱯᱰᱮᱴ ᱦᱚᱸ ᱵᱟᱝ᱾',
  'nav.remedies': 'ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱨᱟᱱ',
  'remedy.title': 'ᱟᱭᱩᱨᱵᱮᱫᱤᱠ ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱨᱟᱱ',
  'remedy.intro': 'ᱡᱟᱦᱟᱸ ᱜᱮ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱦᱩᱭᱩᱜ — ᱠᱟᱹᱭ, ᱵᱚᱦᱚᱜ ᱦᱟᱹᱥᱩ, ᱜᱟᱹᱴᱷᱤᱭᱟᱹ, ᱠᱚᱪᱚᱼᱠᱚᱪᱚ, ᱰᱟᱭᱟᱵᱮᱴᱤᱥ, ᱛᱤᱸᱜᱩ ᱦᱟᱹᱥᱩ — ᱞᱟᱛᱟᱨ ᱨᱮ ᱟᱢᱟᱜ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱟᱨᱵᱟᱝ ᱟᱢᱟᱜ ᱟᱹᱲᱟᱹ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ᱾ ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱠᱟᱲᱟ, ᱢᱟᱞᱤᱥ, ᱡᱚᱢᱟᱜ ᱟᱨ ᱟᱭᱩᱨᱵᱮᱫᱤᱠ ᱩᱯᱟᱹᱭ ᱠᱚ ᱞᱟᱹᱭ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  'remedy.choose': 'ᱟᱢᱟᱜ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ',
  'remedy.emergencyStrong': 'ᱱᱚᱣᱟ ᱠᱚ ᱫᱚ ᱟᱯᱟᱛᱠᱟᱞ ᱠᱟᱱᱟ:',
  'remedy.emergency': 'ᱵᱤᱧ ᱠᱟᱹᱢᱟᱹᱲ, ᱵᱤᱪᱠᱚᱢ ᱟᱨ ᱮᱸᱜᱟ ᱥᱮᱛᱟ ᱠᱟᱹᱢᱟᱹᱲ — ᱩᱥᱟᱹᱨᱟ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱥᱮᱱᱚᱜ ᱢᱮ, ᱞᱟᱦᱟ ᱨᱮ ᱑᱑᱒ ᱨᱮ ᱯᱷᱚᱱ ᱢᱮ᱾ ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱩᱯᱟᱹᱭ ᱫᱚ ᱥᱩᱢᱩᱝ ᱦᱚᱨ ᱨᱮ ᱠᱚᱨᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱱᱟ, ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱮᱱᱟᱜ ᱡᱟᱭᱜᱟ ᱫᱚ ᱵᱟᱝ᱾',
  'remedy.note': 'ᱚᱲᱟᱜ ᱨᱮᱱᱟᱜ ᱟᱨ ᱟᱭᱩᱨᱵᱮᱫᱤᱠ ᱩᱯᱟᱹᱭ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱠᱚᱢ ᱞᱟᱹᱜᱤᱫ ᱜᱚᱲᱚᱭ ᱮᱢᱚᱜᱼᱟ; ᱱᱚᱣᱟ ᱫᱚ ᱰᱟᱠᱛᱟᱨᱟᱜ ᱡᱟᱸᱪ ᱟᱨ ᱨᱟᱱ ᱨᱮᱱᱟᱜ ᱡᱟᱭᱜᱟ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ᱾ ᱪᱮᱫ ᱨᱟᱱ ᱟᱡ ᱛᱮ ᱵᱚᱸᱫᱚ ᱟᱨᱵᱟᱝ ᱮᱦᱚᱵ ᱟᱞᱚᱢ ᱠᱚᱨᱟᱣᱟ᱾',
  'remedy.cough': 'ᱠᱟᱹᱭ',
  'remedy.headache': 'ᱵᱚᱦᱚᱜ ᱦᱟᱹᱥᱩ',
  'remedy.joints': 'ᱜᱟᱹᱴᱷᱤᱭᱟᱹ',
  'remedy.itching': 'ᱠᱚᱪᱚᱼᱠᱚᱪᱚ',
  'remedy.snake': 'ᱵᱤᱧ ᱠᱟᱹᱢᱟᱹᱲ',
  'remedy.scorpion': 'ᱵᱤᱪᱠᱚᱢ',
  'remedy.dog': 'ᱥᱮᱛᱟ ᱠᱟᱹᱢᱟᱹᱲ',
  'remedy.diabetes': 'ᱰᱟᱭᱟᱵᱮᱴᱤᱥ',
  'remedy.back': 'ᱛᱤᱸᱜᱩ ᱦᱟᱹᱥᱩ',
  'remedy.walking': 'ᱛᱟᱲᱟᱢ ᱨᱮ ᱟᱥᱩᱵᱤᱫᱷᱟ',
  'home.remedyNote': 'ᱠᱟᱲᱟ, ᱢᱟᱞᱤᱥ, ᱡᱚᱢᱟᱜ ᱟᱨ ᱟᱭᱩᱨᱵᱮᱫᱤᱠ ᱩᱯᱟᱹᱭ — ᱡᱚᱛᱚ ᱟᱥᱩᱵᱤᱫᱷᱟ ᱞᱟᱹᱜᱤᱫ, ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱛᱮ᱾',
  'nav.aarti': 'ᱟᱨᱛᱤ ᱟᱨ ᱵᱷᱚᱡᱚᱱ',
  'aarti.title': 'ᱟᱨᱛᱤ ᱟᱨ ᱵᱷᱚᱡᱚᱱ — ᱟᱥᱚᱞ ᱟᱲᱟᱝ ᱛᱮ',
  'aarti.intro': 'ᱱᱚᱸᱰᱮ ᱟᱨᱛᱤ, ᱠᱤᱨᱛᱚᱱ ᱟᱨ ᱵᱷᱚᱡᱚᱱ ᱟᱸᱡᱚᱢ ᱯᱮ — ᱟᱥᱚᱞ ᱥᱮᱨᱮᱧᱤᱭᱟᱹ ᱟᱨ ᱢᱚᱱᱫᱤᱨ ᱠᱚᱣᱟᱜ ᱟᱲᱟᱝ ᱛᱮ᱾ ᱚᱠᱟ ᱮ.ᱟᱭ. (AI) ᱟᱲᱟᱝ ᱫᱚ ᱵᱟᱝᱟ᱾',
  'aarti.note': 'ᱟᱨᱛᱤ ᱥᱮ ᱵᱷᱚᱡᱚᱱ ᱠᱚᱢᱯᱭᱩᱴᱚᱨ ᱟᱲᱟᱝ ᱛᱮ ᱟᱸᱡᱚᱢ ᱞᱮᱠᱷᱟᱱ ᱚᱱᱟ ᱨᱮᱱᱟᱜ ᱨᱟᱹᱥᱠᱟᱹ ᱟᱨ ᱵᱷᱚᱠᱛᱤ ᱪᱟᱵᱟᱜᱼᱟ᱾ ᱚᱱᱟᱛᱮ ᱱᱚᱸᱰᱮ ᱫᱚ ᱥᱩᱢᱩᱝ ᱟᱥᱚᱞ ᱨᱮᱠᱚᱰᱤᱝ ᱜᱮ ᱢᱮᱱᱟᱜᱼᱟ᱾',
  'aarti.kindAarti': 'ᱟᱨᱛᱤ',
  'aarti.kindKirtan': 'ᱠᱤᱨᱛᱚᱱ',
  'aarti.kindBhajan': 'ᱵᱷᱚᱡᱚᱱ',
  'aarti.credit': 'ᱨᱮᱠᱚᱰᱤᱝ:',
  'aarti.licence': 'ᱞᱟᱭᱥᱮᱱᱥ:',
  'aarti.listenLink': 'ᱟᱥᱚᱞ ᱟᱲᱟᱝ ᱛᱮ ᱟᱸᱡᱚᱢ ᱯᱮ',
  'aarti.textChecked': 'ᱱᱚᱣᱟ ᱫᱚ ᱯᱟᱹᱨᱤᱥ ᱯᱟᱹᱴᱷ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱟᱥᱚᱞ ᱨᱮᱠᱚᱰᱤᱝ ᱨᱮ ᱠᱚ ᱥᱮᱨᱮᱧ ᱟᱠᱟᱫᱟ᱾',
  'aarti.textPrinted': 'ᱱᱚᱣᱟ ᱫᱚ ᱪᱟᱹᱞᱩ ᱯᱟᱹᱴᱷ ᱠᱟᱱᱟ, ᱯᱟᱨᱥᱟᱞ ᱟᱠᱟᱱ ᱯᱩᱛᱷᱤ ᱠᱷᱚᱱ ᱧᱮᱞ ᱠᱟᱛᱮ ᱠᱚ ᱯᱟᱹᱛᱭᱟᱹᱣ ᱟᱠᱟᱫᱟ᱾',
  'aarti.textNotStored': 'ᱱᱚᱣᱟ ᱯᱩᱛᱷᱤ ᱨᱮᱱᱟᱜ ᱯᱩᱨᱟᱹ ᱯᱟᱹᱴᱷ ᱱᱚᱸᱰᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ — ᱞᱟᱛᱟᱨ ᱨᱮ ᱨᱮᱠᱚᱰᱤᱝ ᱨᱮ ᱯᱩᱨᱟᱹ ᱯᱟᱹᱴᱷ ᱟᱸᱡᱚᱢᱚᱜᱼᱟ᱾',
  'aarti.granthTitle': 'ᱯᱩᱛᱷᱤ, ᱪᱟᱞᱤᱥᱟ ᱟᱨ ᱥᱛᱚᱛᱨᱚ — ᱟᱥᱚᱞ ᱟᱲᱟᱝ ᱛᱮ',
  'aarti.noRecording': 'ᱱᱚᱣᱟ ᱟᱨᱛᱤ ᱨᱮᱱᱟᱜ ᱟᱥᱚᱞ ᱨᱮᱠᱚᱰᱤᱝ ᱱᱤᱛᱚᱜ ᱥᱟᱭᱤᱴ ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱚᱱᱟᱛᱮ ᱤᱧ ᱱᱚᱣᱟ ᱥᱮᱨᱮᱧ ᱠᱟᱛᱮ ᱵᱟᱹᱧ ᱟᱸᱡᱚᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ — VARSHA SAMADHAN AI ᱫᱚ ᱟᱨᱛᱤ ᱫᱚ ᱛᱤᱥ ᱦᱚᱸ ᱵᱟᱭ ᱥᱮᱨᱮᱧᱟ᱾',
  'aarti.textOnlyTitle': 'ᱟᱨ ᱦᱚᱸ ᱟᱨᱛᱤ ᱠᱚ — ᱯᱟᱹᱴᱷ ᱦᱚᱸ, ᱟᱥᱚᱞ ᱟᱲᱟᱝ ᱦᱚᱸ',
  'aarti.fullText': 'ᱯᱩᱨᱟᱹ ᱯᱟᱹᱴᱷ',
  'aarti.notChecked': 'ᱱᱚᱣᱟ ᱟᱨᱛᱤ ᱨᱮᱱᱟᱜ ᱯᱟᱹᱛᱭᱟᱹᱣ ᱟᱠᱟᱱ ᱯᱟᱹᱴᱷ ᱱᱤᱛᱚᱜ ᱥᱟᱭᱤᱴ ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ᱾ ᱵᱟᱝ ᱧᱮᱞ ᱟᱠᱟᱱ ᱯᱟᱹᱴᱷ ᱮᱢ ᱫᱚ ᱵᱟᱝ ᱴᱷᱤᱠᱟ, ᱚᱱᱟᱛᱮ ᱵᱟᱝ ᱮᱢᱚᱜ ᱠᱟᱱᱟ᱾',
  'aarti.verifiedList': 'ᱥᱟᱭᱤᱴ ᱨᱮ ᱱᱚᱣᱟ ᱟᱨᱛᱤ ᱠᱚᱣᱟᱜ ᱯᱟᱹᱛᱭᱟᱹᱣ ᱟᱠᱟᱱ ᱯᱟᱹᱴᱷ ᱢᱮᱱᱟᱜᱼᱟ:',

};

const TABLES: Record<string, Record<string, string>> = {
  hi: HINDI,
  en: ENGLISH,
  bn: BENGALI,
  ta: TAMIL,
  te: TELUGU,
  mr: MARATHI,
  gu: GUJARATI,
  kn: KANNADA,
  ml: MALAYALAM,
  pa: PUNJABI,
  ur: URDU,
  as: ASSAMESE,
  or: ODIA,
  ne: NEPALI,
  sa: SANSKRIT,
  ks: KASHMIRI,
  sd: SINDHI,
  kok: KONKANI,
  mai: MAITHILI,
  doi: DOGRI,
  brx: BODO,
  mni: MANIPURI,
  sat: SANTALI,
  ar: ARABIC,
  es: SPANISH,
};

/**
 * Resolve a string.
 *
 * Chain: the chosen language, then English, then Hindi, then the key itself.
 *
 * See the note at the top of this file for why English sits in the middle — it
 * is the difference between a Tamil speaker seeing English and seeing Hindi they
 * cannot read.
 */
export function translate(language: string, key: string): string {
  const table = TABLES[language];
  if (table?.[key]) return table[key];

  const english = ENGLISH[key];
  if (english) return english;

  const hindi = HINDI[key];
  if (hindi) return hindi;

  // Surfacing the key is deliberate: a missing string should be visible in
  // review, not render as an empty button nobody notices.
  return key;
}

export function stringsFor(language: string): (key: string) => string {
  return (key: string) => translate(language, key);
}

/** Substitute {name} placeholders. Missing values are left as-is, not blank. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name) =>
    name in values ? String(values[name]) : whole,
  );
}

export function isKnownLanguage(code: string): boolean {
  return LANGUAGES.some((l) => l.code === code);
}

export function languageMeta(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

/**
 * A full BCP-47 tag for each language, for `Intl` and the Web Speech APIs.
 *
 * `Intl.DateTimeFormat` will not accept a bare two-letter code on its own and
 * throws `RangeError` on some engines, so a caller that passes `ta` gets either
 * an exception or an English month name. Every place that formats a date or
 * picks a voice should go through this instead of building a tag by hand.
 *
 * Kept here rather than at each call site so the date on a review, the voice
 * that reads an article, and the speech-recognition tag can never disagree about
 * what "Tamil" means as a locale.
 */
const LOCALE_TAGS: Record<string, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-PK',
  as: 'as-IN',
  or: 'or-IN',
  ne: 'ne-IN',
  sa: 'sa-IN',
  ks: 'ks-IN',
  sd: 'sd-IN',
  kok: 'kok-IN',
  mai: 'mai-IN',
  doi: 'doi-IN',
  brx: 'brx-IN',
  mni: 'mni-IN',
  sat: 'sat-IN',
  ar: 'ar-SA',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-PT',
  ru: 'ru-RU',
  zh: 'zh-CN',
};

export function localeTag(code: string): string {
  return LOCALE_TAGS[code] ?? LOCALE_TAGS.hi;
}

export { HINDI, ENGLISH };
