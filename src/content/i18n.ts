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
  /* ---- navigation ------------------------------------------------------- */
  'nav.home': 'होम',
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
  'nav.main': 'मुख्य',

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
  'home.q1.label': 'बिजली चली गई तो क्या करें?',
  'home.q1.question': 'घर में अचानक बिजली चली गई है, अंधेरा हो गया है। क्या करना चाहिए?',
  'home.q2.label': 'बच्चे की पढ़ाई में कमज़ोरी',
  'home.q2.question': 'मेरे बच्चे की पढ़ाई में बहुत कमज़ोरी है। घर पर उसकी पढ़ाई कैसे बेहतर करें?',
  'home.q3.label': 'माँ की देखभाल',
  'home.q3.question': 'मेरी माँ की बहुत उम्र हो गई है। उनकी देखभाल कैसे करूँ?',
  'home.q4.label': 'आग लग जाए तो',
  'home.q4.question': 'अगर घर में आग लग जाए तो सबसे पहले क्या करना चाहिए?',
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
    'यह सेवा श्रीमती वर्षा जी की याद में बनाई गई है। यहाँ सरल भाषा में बताया गया है कि यह क्या करती है, इसमें क्या-क्या है, और इसकी सीमाएँ क्या हैं। सब कुछ बिल्कुल निःशुल्क है — कोई पैसा नहीं लिया जाता, कोई विज्ञापन नहीं दिखाया जाता, और कोई निजी जानकारी नहीं माँगी जाती।',
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
  'ask.speakShort': 'बोलिए',
  'ask.speakLong': 'माइक से बोलकर पूछिए',
  'ask.listening': 'बोलना शुरू कीजिए…',
  'ask.heard': 'सुन रहे हैं',
  'ask.stopListening': 'सुनना रोकिए',
  'ask.suggested': 'आम सवाल',
  'ask.answerTitle': 'समाधान',
  'ask.listen': 'सुनिए',
  'ask.stopSpeak': 'रोकिए',
  'ask.readAloud': 'सुनिए',
  'ask.aiNote': 'यह उत्तर AI ने दिया है। किसी विशेषज्ञ की सलाह का विकल्प नहीं है।',
  'ask.errorRateLimit':
    'बहुत सारे सवाल एक साथ भेज दिए गए। थोड़ी देर बाद कोशिश कीजिए।',
  'ask.errorNetwork': 'इंटरनेट नहीं चल पा रहा। कनेक्शन जाँचकर फिर कोशिश कीजिए।',
  'ask.notAnswer': 'इस सवाल का सीधा जवाब हमारे पास नहीं है।',
  'ask.emptyAnswer': 'इस बार जवाब नहीं बना पाया। थोड़ा अलग करके फिर पूछिए।',
  'ask.micUnsupported': 'इस ब्राउज़र में बोलकर पूछना काम नहीं करेगा। लिखकर पूछिए।',
  'ask.speakHint': 'बोलना शुरू करने के लिए माइक दबाइए।',
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
  'voice.generic': 'कुछ गड़बड़ हो गई। दोबारा कोशिश कीजिए।',
  'voice.noHindiVoice':
    'इस फ़ोन में हिन्दी बोलने वाली आवाज़ नहीं मिली। जवाब लिखकर पढ़ा जा सकता है।',

  /* ---- sound ------------------------------------------------------------ */
  'sound.title': 'शांति के लिए ध्वनि',
  'sound.intro': 'कोई शुल्क नहीं, कोई विज्ञापन नहीं। बस मन शांत करने के लिए।',
  'sound.playing': 'आवाज़ चल रही है। रोकने के लिए दोबारा उसी बटन को दबाइए।',
  'sound.tap': 'कोई बटन दबाकर ध्वनि सुनिए।',
  'sound.shankh': 'शंख',
  'sound.shankhHint': 'गहरी, लंबी',
  'sound.bansuri': 'बांसुरी',
  'sound.bansuriHint': 'कोमल, धीमी',
  'sound.dhol': 'नगाड़ा',
  'sound.dholHint': 'तीखी, तेज़',
  'sound.all': 'तीनों',
  'sound.allHint': 'एक साथ',
  'sound.playingLabel': 'बज रही है',
  'sound.listenLabel': 'सुनिए',
  'sound.errUnsupported': 'यह ब्राउज़र ध्वनि नहीं चला पा रहा।',
  'sound.errGeneric': 'ध्वनि चलाने में समस्या हुई।',
  'sound.statusLabel': 'ध्वनि बज रही है',

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
  'article.voiceLabel': 'यह लेख सुनिए',
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

  'reviews.averageOutOf': '{value} में से 5 तारे',

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

  'download.pdf': 'PDF me lekh',
  'download.text': 'Text me lekh',
  'download.printNow': 'Print karein',
  'download.preparing': 'Taiyar ho raha hai',
  'download.blocked': 'Naya tab khul nahi paya. Pop-up block ho raha hai — apne browser me allow karein.',

  /* ---- attach a document ---- */

  'attach.button': 'अपना दस्तावेज़ या फ़ोटो जोड़िए',
  'attach.formats': 'PDF, photo (JPG/PNG) ya text file — 12 MB tak',
  'attach.reading': 'Padh raha hai…',
  'attach.attached': 'Laga diya',
  'attach.remove': 'Hataayein',
  'attach.tooBigPdf': 'Yeh PDF 12 MB se badi hai. Chhoti file chuniye.',
  'attach.tooBigImage': 'Yeh photo 3 MB se badi hai. Chhoti photo chuniye.',
  'attach.scannedPdf': 'Yeh PDF scan ki hui hai — isme sirf tasveer hai, padhi nahi ja sakti. Iske bajaye iska photo bhej dijiye.',
  'attach.pdfFailed': 'Yeh PDF padh nahi hui.',
  'attach.imageFailed': 'Yeh photo load nahi hui.',
  'attach.wrongType': 'Yeh file nahi chalegi. PDF, photo ya text file bhejiye.',
  'attach.hint': 'Apna kagaz yahan laga kar sawal poochhiye — hum usi se jawab denge.',
  'ask.sendWithFile': 'Jawab chahiye',

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

};

/* -------------------------------------------------------------------------- */
/* ENGLISH — the fallback language                                            */
/* -------------------------------------------------------------------------- */

const ENGLISH: Record<string, string> = {
  'nav.home': 'Home',
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
  'nav.main': 'Main',

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

  'home.q1.label': 'The power has gone',
  'home.q1.question': 'The power in the house has suddenly gone off and it is dark. What should I do?',
  'home.q2.label': 'A child weak at school',
  'home.q2.question': 'My child is very weak in studies. How can I improve this at home?',
  'home.q3.label': "Caring for my mother",
  'home.q3.question': 'My mother has become very old. How should I look after her?',
  'home.q4.label': 'If there is a fire',
  'home.q4.question': 'If there is a fire in the house, what should be done first?',
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
    'This service was built in memory of Smt. Varsha ji. It explains in plain language what it does, what it contains, and where its limits are. Everything is free — no money is taken, no advertisements are shown, and no personal details are asked for.',
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
  'support.faqBody':
    'Is it really free? Yes. Is my name taken? No, and it is not required. Are there advertisements? No. Is a phone number or address asked for? No. Does an app need installing? No, it opens in the browser.',

  'ask.label': 'Write your problem, or speak it',
  'ask.placeholder': 'For example: my child is weak in studies',
  'ask.help': 'You can also press Enter to send.',
  'ask.send': 'Ask',
  'ask.sending': 'Thinking…',
  'ask.clear': 'Clear what you typed',
  'ask.speak': 'Ask by speaking',
  'ask.speakShort': 'Speak',
  'ask.speakLong': 'Ask by speaking',
  'ask.listening': 'Start speaking…',
  'ask.heard': 'Listening',
  'ask.stopListening': 'Stop listening',
  'ask.suggested': 'Common questions',
  'ask.answerTitle': 'Answer',
  'ask.listen': 'Listen',
  'ask.stopSpeak': 'Stop',
  'ask.readAloud': 'Listen',
  'ask.aiNote': 'This answer came from AI. It is not a substitute for an expert.',
  'ask.errorRateLimit':
    'Too many questions at once. Please try again in a moment.',
  'ask.errorNetwork': 'The internet is not working. Check the connection and try again.',
  'ask.notAnswer': 'We do not have a direct answer to this question.',
  'ask.emptyAnswer': 'No answer could be made this time. Try asking a little differently.',
  'ask.micUnsupported': 'Speaking is not available in this browser. Please write instead.',
  'ask.speakHint': 'Press the microphone to start speaking.',
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
  'voice.generic': 'Something went wrong. Please try again.',
  'voice.noHindiVoice':
    'No Hindi speaking voice was found on this phone. The answer can be read on screen.',

  'sound.title': 'Sound for peace',
  'sound.intro': 'No fee, no adverts. Only to calm the mind.',
  'sound.playing': 'Playing. Press the same button again to stop.',
  'sound.tap': 'Press any button to hear the sound.',
  'sound.shankh': 'Conch',
  'sound.shankhHint': 'Deep, long',
  'sound.bansuri': 'Flute',
  'sound.bansuriHint': 'Soft, slow',
  'sound.dhol': 'Drum',
  'sound.dholHint': 'Sharp, quick',
  'sound.all': 'All three',
  'sound.allHint': 'Together',
  'sound.playingLabel': 'Playing',
  'sound.listenLabel': 'Listen',
  'sound.errUnsupported': 'This browser cannot play the sound.',
  'sound.errGeneric': 'The sound could not be started.',
  'sound.statusLabel': 'Sound is playing',

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
  'article.voiceLabel': 'Listen to this article',
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
  'nav.home': 'হোম', 'nav.tribute': 'স্মৃতি', 'nav.help': 'সহায়তা', 'nav.reference': 'পরিচিতি',
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
  'nav.main': 'প্রধান',
  'ask.label': 'আপনার সমস্যা লিখুন বা বলুন', 'ask.placeholder': 'যেমন: সন্তানের পড়াশোনায় দুর্বলতা',
  'ask.help': 'এন্টার চাপলেও পাঠানো যাবে।', 'ask.send': 'জিজ্ঞাসা করুন', 'ask.sending': 'ভাবছি…',
  'ask.clear': 'লেখা মুছুন', 'ask.speak': 'বলে জিজ্ঞাসা করুন', 'ask.listening': 'বলতে শুরু করুন…',
  'ask.heard': 'শুনছি', 'ask.stopListening': 'শোনা বন্ধ করুন', 'ask.suggested': 'সাধারণ প্রশ্ন',
  'ask.answerTitle': 'উত্তর', 'ask.listen': 'শুনুন', 'ask.stopSpeak': 'থামান', 'ask.readAloud': 'শুনুন',
  'ask.aiNote': 'এই উত্তরটি AI দিয়েছে। বিশেষজ্ঞের বিকল্প নয়।',
  'sound.title': 'শান্তির শব্দ', 'sound.intro': 'কোনো খরচ নেই, কোনো বিজ্ঞাপন নেই।',
  'sound.shankh': 'শঙ্খ', 'sound.bansuri': 'বাঁশি', 'sound.dhol': 'ঢোল', 'sound.all': 'তিনটি',
  'dhun.welcome': 'স্বাগতম', 'dhun.prompt': 'শঙ্খ, বাঁশি ও ঢোল একসাথে শুনতে ছুঁয়ে দিন।',
  'dhun.listen': 'শুনুন', 'dhun.skip': 'বাদ দিন',
  'cta.emergencyTitle': 'জরুরি — এখনই সাহায্য দরকার', 'home.readMore': 'সম্পূর্ণ তথ্য পড়ুন',
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

  'support.howTitle': 'আমরা কীভাবে সাহায্য করি',

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

  'reviews.averageOutOf': '{value}-এর মধ্যে 5 তারা',

  'dhun.welcomeTitle': 'স্বাগতম',

  'dhun.consent': 'শঙ্খ, বাঁশি ও নাগাদা একসাথে। শুনতে ছুঁয়ে দিন।',

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

  'voice.unsupported': 'এই ব্রাউজারে বলে জিজ্ঞাসা করা কাজ করবে না। লিখে জিজ্ঞাসা করুন।',

  'ask.notConfigured': 'এই সেবাটি এখন সংরক্ষিত উত্তরের ভাণ্ডার থেকে উত্তর দিচ্ছে। আপনার প্রশ্ন সেখানে ছিল না।',

  'ask.browseTitle': 'এখানে যা লেখা আছে, তা দেখুন',

  'health.heading': 'আপনার বয়স বলুন',

  'health.intro': 'বয়স অনুযায়ী যে প্রশ্নগুলি নিয়মিত জিজ্ঞাসা করা হয়, সেগুলি এখানে দেখা যাবে। কোনো বাটন চাপবেন না — প্রশ্ন নিচে পূরণ হবে, তারপর জিজ্ঞাসা করুন।',

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

  'home.chooseTopicNote': 'নিচের বিষয়ে ট্যাপ করুন। প্রতিটি জায়গায় সহজ ভাষায় তথ্য দেওয়া আছে।',

  'home.categoryEmpty': 'এই বিষয়ে এখনো কোনো লেখা লেখা হয়নি।',

  'home.soundIntro': 'কোনো ফি নেই, কোনো বিজ্ঞাপন নেই। শুধু মন শান্ত করার জন্য।',
  'home.emergencyTitle': 'জরুরি — এখনই সাহায্য দরকার',

  'home.dedication1': 'স্মরণে — সম্পূর্ণ বিনামূল্যে সেবা।',

  'home.dedication2': 'আপনার সমস্যা লিখুন বা বলুন।',

  'ref.title': 'এই সেবা কী, এবং কার জন্য',

  'ref.intro': 'এই সেবাটি তিনি বর্ষা মেমে তাঁর স্মৃতিতে তৈরি করা হয়েছে। এখানে সহজ ভাষায় বলা আছে এটি কী করে, এতে কী আছে এবং এর সীমা কী। সবকিছু সম্পূর্ণ বিনামূল্যে — কোনো টাকা নেওয়া হয় না, কোনো বিজ্ঞাপন দেখানো হয় না, এবং কোনো ব্যক্তিগত তথ্য চাওয়া হয় না।',

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

  'ref.helpline1': 'বড় বিপদ হলে — আগুন, বিদ্যুৎ একটানোর মতো কাঁপা, পড়ে যাওয়া বা অতিরিক্ত রক্তপাত — 112 নম্বরে ফোন করুন।',

  'ref.helpline2': 'কারও অসুস্থ বা আঘাত পড়েছে এবং যাওয়ার বাহন নেই, তাহলে 108 নম্বরে অ্যাম্বুলেন্স চাইুন।',

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

  'support.way1Body': 'যদি এই সাইট থেকে আপনার কিছু ভালো লাগে থাকে — বা এমন কিছু পেয়ে থাকেন যা আপনাকে কোনোলপে ফেলে দিয়েছে — তাহলে রায় পেজে লিখে দিন। আপনার নাম নেওয়া আবশ্যক নয়।',

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

  'health.band.elder.note': 'প্রতিটি ঔষধ পরীক্ষা করা জরুরি, প্রতিটি পড়া গুরুতর',

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

  'health.c.teen4': 'খুব মেসেজিত',

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

  'health.q.teen4': 'খুব মেসেজিত লাগে, কার সাথে কথা বলব?',

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

};

const TAMIL: Record<string, string> = {
  'nav.home': 'முகப்பு', 'nav.tribute': 'நினைவு', 'nav.help': 'உதவி', 'nav.reference': 'அறிமுகம்',
  'nav.reviews': 'கருத்து', 'nav.support': 'உதவி செய்யுங்கள்', 'nav.menu': 'பட்டி',
  'nav.birthChart': 'ஜन्म கட்டு',
  'jgd.title': 'உங்கள் ஜन्म கட்டு',
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
  'nav.main': 'முதன்மை',
  'ask.label': 'உங்கள் பிரச்சினையை எழுதுங்கள் அல்லது பேசுங்கள்', 'ask.placeholder': 'எடுத்துக்காட்டு: குழந்தையின் படிப்பு குறைவு',
  'ask.help': 'என்டர் அழுத்தினாலும் அனுப்பலாம்.', 'ask.send': 'கேளுங்கள்', 'ask.sending': 'சிந்திக்கிறது…',
  'ask.clear': 'எழுதியதை அழியுங்கள்', 'ask.speak': 'பேசி கேளுங்கள்', 'ask.listening': 'பேசத் தொடங்குங்கள்…',
  'ask.heard': 'கேட்டுக்கொண்டிருக்கிறது', 'ask.stopListening': 'கேட்பதை நிறுத்து', 'ask.suggested': 'வழக்கமான கேள்விகள்',
  'ask.answerTitle': 'தீர்வு', 'ask.listen': 'கேட்க', 'ask.stopSpeak': 'நிறுத்து', 'ask.readAloud': 'கேட்க',
  'ask.aiNote': 'இது AI வழங்கிய பதில். நிபுணர் ஆலோசனைக்கு மாற்று அல்ல.',
  'sound.title': 'அமைதிக்கான ஒலி', 'sound.intro': 'கட்டணம் இல்லை, விளம்பரம் இல்லை.',
  'sound.shankh': 'சங்கு', 'sound.bansuri': 'புனாறு', 'sound.dhol': 'தபலாக்', 'sound.all': 'மூன்று',
  'dhun.welcome': 'வரவேற்பு', 'dhun.prompt': 'சங்கு, புனாறு, தபலாக் கொன்றும் கேட்கத் தொடு.',
  'dhun.listen': 'கேட்க', 'dhun.skip': 'விட்டுவிடு',
  'home.emergencyTitle': 'அவசரம் — உடனே உதவி தேவை', 'home.emergencyNote': 'இவற்றை முதலில் படியுங்கள்.',
  'home.readMore': 'முழு விவரம் படி', 'home.chooseTopic': 'எதைப் பற்றி அறிய வேண்டும்?',
  'home.askHere': 'இந்தத் தலைப்பில் கேள்', 'home.howTitle': 'இந்த சேவை எப்படி வேலை செய்கிறது',
  'home.soundTitle': 'அமைதிக்கான ஒலி', 'home.freeTitle': 'இந்த சேவை முற்றிலும் இலவசம்',
  'home.freeBody': 'பணம் பெறப்படுவதில்லை, தனிப்பட்ட விவரம் கேட்கப்படுவதில்லை, விளம்பரம் இல்லை.',
  'footer.pages': 'பக்கங்கள்', 'footer.helplines': 'முக்கிய எண்கள்', 'footer.readStory': 'அவளுடைய முழுக் கதை படி',
  'reviews.title': 'உங்கள் கருத்து, உங்கள் மொழி', 'reviews.submit': 'அனுப்பு', 'reviews.comment': 'உங்கள் மொழி',
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

  'support.howTitle': 'எங்கள் எப்படி உதவுவது',

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

  'reviews.averageOutOf': '{value} இல் 5 நட்சத்திரம்',

  'dhun.welcomeTitle': 'வரவேற்கிறோம்',

  'dhun.consent': 'சங்க், புல்லி மற்றும் டொம் இணைந்து. கேட்கத் தட்டவும்.',

  'dhun.failed': 'ஒலி இயக்க முடியவில்லை.',

  'dhun.unsupported': 'இந்த உலாவியம் ஒலியை இயக்க முடியவில்லை.',

  'dhun.failedTry': 'ஒலியை இயக்குவதில் சிக்கல் ஏற்பட்டது.',

  'sound.hintIdle': 'எந்த பொத்தானை அழுத்தினாலும் ஒலியைக் கேட்கலாம்.',

  'sound.hintPlaying': 'ஒலி இயங்குகிறது. நிறுத்த அந்தப் பொத்தானை மீண்டும் அழுத்தவும்.',

  'sound.preparing': 'ஒலி தயாராகிறது',

  'nav.path': 'பாதை',

  'toast.dismiss': 'மூடு',

  'footer.free': 'இந்த சேவை முற்றிலும் இலவசம். யாரிடமிருந்தும் பணம் வசிக்கப்படுவதில்லை.',

  'cat.empty': 'இந்தத் தலைப்பில் இன்னும் கட்டுரைகள் இல்லை.',

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

  'footer.women': 'மகள் உதவி எண்',

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

  'voice.unsupported': 'இந்த உலாவியில் பேசி கேட்பது வேலை செய்யாது. எழுதி கேளுங்கள்.',

  'ask.notConfigured': 'இந்தச் சேவை இப்போது சேமித்த பதிவுகளிலிருந்து பதிலளிக்கிறது. உங்கள் கேள்வி அதில் இல்லை.',

  'ask.browseTitle': 'இங்கு உள்ள கட்டுரைகளைப் பாருங்கள்',

  'health.heading': 'உங்கள் வயதைச் சொல்லுங்கள்',

  'health.intro': 'வயதின் அடிப்படையில் அடிக்கடி கேட்கப்படும் கேள்விகள் இங்கே தெரியும். எந்த பொத்தானையும் அழுத்த வேண்டாம் — கேள்வி கீழே நிரப்பப்படும், பின்னர் கேளுங்கள்.',

  'health.ageLabel': 'வயது (ஆண்டுகள்)',

  'health.years': 'ஆண்டுகள்',

  'health.bandsLabel': 'வயதின் அடிப்படையில் தேர்வு செய்யுங்கள்',

  'health.notAdviceStrong': 'இது மருத்துவ ஆலோசனை அல்ல.',

  'health.notAdvice': 'எந்த மருந்தையும் தொடங்கவும் நிறுத்தவும் — முதலில் மருத்துவரைச் சந்தியுங்கள்.',

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
  'lib.licence.pd': 'இதற்கு பொறுப்புடைய அண்டர் இல்லை — நீங்கள் விரும்பியபடி நகலெடுக்கலாம்.',
  'lib.licence.govtIndia': 'இந்திய அரசு வலதசாலையில். படித்தலும் அச்சித்தலும் இரண்டும் இலவசம்.',
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

  'home.chooseTopicNote': 'கீழே உள்ள தலைப்பைத் தட்டவும். ஒவ்வொரு இடத்திலும் எளிய மொழியில் விவரம் உள்ளது.',

  'home.categoryEmpty': 'இந்தத் தலைப்பில் இன்னும் எதுவும் எழுதப்படவில்லை.',

  'home.soundIntro': 'கட்டணம் இல்லை, விளம்பரம் இல்லை. மனதை அமைதியாக்க மட்டும்.',

  'home.dedication1': 'நினைவில் — முற்றிலும் இலவசமான சேவை.',

  'home.dedication2': 'உங்கள் சிக்கலை எழுதுங்கள் அல்லது பேசுங்கள்.',

  'ref.title': 'இந்தச் சேவை என்ன, யாருக்கு',

  'ref.intro': 'இந்தச் சேவை திருமதி வர்ஷா நினைவில் உருவாக்கப்பட்டது. இது என்ன செய்கிறது, இதில் என்ன உள்ளது, இதன் வரம்புகள் என்ன என்பத எளிய மொழியில் சொல்லப்பட்டுள்ளது. அனைத்தும் முற்றிலும் இலவசம் — பணம் எடுக்கப்படுவதில்லை, விளம்பரம் காட்டப்படுவதில்லை, தனிப்பட்ட தகவல் கேட்கப்படுவதில்லை.',

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

  'ref.helpline2': 'யாருக்கு நோய் அல்லது காயம் இருந்தால், போக்க வாகனம் இல்லை என்றால், 108 எண்ணில் ஆம்புலன்ஸ் கேளுங்கள்.',

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

  'reviews.intro': 'இந்தச் சேவை உங்களுக்கு உபயோகமானதா? உங்கள் மொழியை எழுதுங்கள் — உங்கள் பெயர் எடுக்க வேண்டியதில்லை.',

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

  'health.band.teen.note': 'இளம் பிரதமர்கள், அவர்களுக்குப் பொதுவாக கேட்டுக் கொள்ளும் ஒருவர் கிடைப்பதில்லை',

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

  'health.c.middle1': 'நீட்டில் வலி',

  'health.c.middle2': 'தூக்கம் சரியாக இல்லை',

  'health.c.middle3': 'வீட்டு அழுத்தம்',

  'health.c.middle4': 'வயிற்றில் வாயு',

  'health.c.later1': 'முதுகு வலி',

  'health.c.later2': 'முட்டு வலி',

  'health.c.later3': 'ராத்திரி கால் இருப்பு',

  'health.c.later4': 'காலையில் விறைப்பு',

  'health.c.senior1': 'நடக்கச் சிரமம்',

  'health.c.senior2': 'மருந்துப் பரிசோதனை',

  'health.c.senior3': 'ராத்திரி சிறுநீர்',

  'health.c.senior4': 'கேள்வி குறைவு',

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

  'health.q.middle1': 'கீட்டில் வலி ஏற்படுகிறது, காரணம் என்ன இருக்கலாம்?',

  'health.q.middle2': 'தூக்கம் சரியாக வரவில்லை, மேம்படுத்த என்ன செய்வது?',

  'health.q.middle3': 'வீட்டில் அதிக அழுத்தம், குழந்தைகளை எப்படி கவனிக்கலாம்?',

  'health.q.middle4': 'வேலையில் பல ஆண்டுகளாக வயிற்றில் வாயு, என்ன செய்வது?',

  'health.q.later1': 'என் வயது 54, முதுகில் வலி உள்ளது, என்ன செய்வது?',

  'health.q.later2': 'ஏறும்போது முட்டுவலிக்கிறது, ஏன்?',

  'health.q.later3': 'இரவில் கால் இருப்பு, என்ன செய்வது?',

  'health.q.later4': 'காலையில் எழும்பும்போது கீட்டு கட்டுப்பட்டுபோகிறது, காரணம் என்ன?',

  'health.q.senior1': 'முட்டுகளில் அதிக வலி, நடக்க கடினமாக உள்ளது, என்ன செய்வது?',

  'health.q.senior2': 'பல மருந்துகள் தினமும் செவ்வது — எது தீங்கு விளைவிப்பதை எப்படி அறியும்?',

  'health.q.senior3': 'இரவில் அடிக்கடி சிறுநீர், என்ன செய்வது?',

  'health.q.senior4': 'கேட்பது குறைந்துள்ளது, கேட்பதற்கான ஏதாவது வழி சொல்லுங்கள்.',

  'health.q.elder1': 'வீட்டில் விழும் பயம் உள்ளது, என்ன பாதுகாப்பு வைக்கலாம்?',

  'health.q.elder2': 'நினைவு பலவீதமாகிறது, என்ன வழி உள்ளது?',

  'health.q.elder3': 'தினமும் வலி மருந்து செவ்வது — இதற்கு தீங்கு உள்ளதா?',

  'health.q.elder4': 'எப்போது மருத்துவரிடம் செல்வது அவசியம்?',

  'support.contactMessageLabel': 'உங்கள் மொழி',

  'support.contactPlaceholder': 'எழுத வேண்டியதை எழுதுங்கள் — தவறு இருந்தால், சிறந்தது கிடைத்தால், அல்லது கேள்வி இருந்தால்.',

  'support.contactHelp': 'குறைந்தது 10 எழுத்துகள். இது நேரடியாக உரிமையாளருக்குச் செல்கிறது.',

  'support.contactSubmit': 'அனுப்பு',

  'support.contactSending': 'அனுப்பப்படுகிறது…',

  'support.contactPrivacy': 'உங்கள் பெயர் எழுத வேண்டியதில்லை.',

  'support.contactSent': 'சென்றுவிட்டது',

  'support.contactSentBody': 'உங்கள் மொழி உரிமையாளரை அடைந்துவிட்டது.',

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

};

const TELUGU: Record<string, string> = {
  'nav.home': 'హోమ్', 'nav.tribute': 'స్మృతి', 'nav.help': 'సహాయం', 'nav.reference': 'పరిచయం',
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
  'jgd.disclaimer': 'ఇది సంప్రదాయ పద్ధతిలో లెక్కించినది, జాతిచేక కాదు. ఏ సంఖ్యా, ఏ రాశి ఎవరి ఆరోగ్యాన్ని, డబ్బును లేదా సంబంధాన్ని నిర్ణయించదు. పెద్ద నిర్ణయాలకు వైద్యుడు, న్యాయవాది లేదా అనుభవి వ్యక్తి సలహా తీసుకోండి.',
  'nav.openMenu': 'మెనూ తెరవండి', 'nav.closeMenu': 'మెనూ మూసివేయండి', 'nav.language': 'భాష మార్చండి',
  'nav.expand': 'పట్టీ విస్తరించు', 'nav.collapse': 'పట్టీ మూడివేయి', 'nav.skip': 'సరిగ్గా విషయానికి వెళ్లండి',
  'nav.main': 'ప్రధాన',
  'ask.label': 'మీ సమస్యను టైప్ చేయండి లేదా మాట్లాడండి', 'ask.placeholder': 'ఉదాహరణకు: పిల్లలకు చదవు బలహీనం',
  'ask.help': 'ఎంటర్ నొక్కి పంపవచ్చు.', 'ask.send': 'అడిగండి', 'ask.sending': 'ఆలోచిస్తోంది…',
  'ask.clear': 'రాసినది తొలగించండి', 'ask.speak': 'మాట్లాడి అడిగండి', 'ask.listening': 'మాట్లాడటం ప్రారంభించండి…',
  'ask.heard': 'వింటున్నాం', 'ask.stopListening': 'వినడం ఆపండి', 'ask.suggested': 'సాధారణ ప్రశ్నలు',
  'ask.answerTitle': 'సమాధానం', 'ask.listen': 'వినండి', 'ask.stopSpeak': 'ఆపండి', 'ask.readAloud': 'వినండి',
  'ask.aiNote': 'ఈ సమాధానం AI ఇచ్చింది. నిపుణుల సలహాకు ప్రత్యామ్నాయం కాదు.',
  'sound.title': 'శాంతికి ధ్వని', 'sound.intro': 'ఫీజు లేదు, ప్రకటన లేదు.',
  'sound.shankh': 'శంఖం', 'sound.bansuri': 'బంసి', 'sound.dhol': 'డ్రమ్', 'sound.all': 'మూడు',
  'dhun.welcome': 'స్వాగతం', 'dhun.prompt': 'శంఖం, బంసి, డ్రమ్ కలిపి వినడానికి తాకించండి.',
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

  'ref.not3': 'ఎట్టి సముపాయం తీసుకోవడం లేదు, ఎట్టి ప్రచారం చూపించడం లేదు.',

  'ref.not4': 'మీ పేరు, చిరునామా లేదా ఫోన్ నంబర్ అడగబడదు, భద్రపరచబడదు.',

  'ref.not5': 'ప్రభుత్వ పథకం ధర లేదా సంఖ్య కలిపి ఉండదు — తెలియకపోతే స్పష్టంగా తెలియదు అని చెబుతారు.',

  'ref.medicalTitle': 'ముఖ్యం: ఇది వైద్య సలహా కాదు',

  'ref.medicalBody': 'వ్యాధి, మందులు లేదా విషపదార్థం గురించి అయితే ముందుగా వైద్యుడిని కలవండి. ఇక్కడ ఇవ్వబడిన సమాచారం సాధారణ సహాయం కోసం మాత్రమే. పిల్ల టీకా, గర్భధారణ, లేదా ఏ మందులను ప్రారంభించే ముందు వైద్య సలహా తీసుకోవండి.',

  'ref.statsTitle': 'ఎంత సమాచారం ఉంది',

  'support.howTitle': 'మేము ఎలా సహాయం చేస్తాము',

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

  'reviews.averageOutOf': '{value}లో 5 నక్షత్రాలు',

  'dhun.welcomeTitle': 'స్వాగతం',

  'dhun.consent': 'శంఖం, బంగీ మరియు డ్రమ్ కలిపి. వినడానికి నొక్కండి.',

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

  'dhun.label': 'శబ్దం ప్లే చేయడానికి అనుమతి',

  'language.articlesInHint': 'ప్రతి భాషకు వేర్వేరు అనువాదం అవసరం. ఈ అనువాదం ఇంకా జరగలేదు — ఉన్నది తెలుగులోనే సరైనది పూర్తిదనా.',

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

  'voice.unsupported': 'ఈ బ్రౌజర్‌లో మాట్లాడి అడగడం పనిచేయదు. టైప్ చేసి అడగండి.',

  'ask.notConfigured': 'ఈ సేవ ఇప్పుడు సేవ్ చేసిన సమాధానాల కోస్తం నుండి సమాధానమిస్తోంది. మీ ప్రశ్న దానిలో లేదు.',

  'ask.browseTitle': 'ఇక్కడ ఉన్న వ్యాసాలు చూడండి',

  'health.heading': 'మీ వయస్సు చెప్పండి',

  'health.intro': 'వయస్సు ప్రకారం తరచుగా అడిగే ప్రశ్నలు ఇక్కడ కనిపిస్తాయి. ఏ బటన్‌నూ నొక్కవద్దు — ప్రశ్న కింద నింపబడుతుంది, తర్వాత అడగండి.',

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
  'account.phone': 'ఫ़ोన్ నంబర్',
  'account.optional': 'అవసరం లేదు',
  'account.phoneHint': 'ఇచ్చినా ఇవ్వండి. లేకుండానూ ఖాతా అవుతుంది.',
  'account.create': 'ఖాతా సృష్టించండి',
  'account.logout': 'బయటకు వెళ్లండి',
  'account.open': 'ఖాతా తెరవండి',
  'account.signedInAs': 'మీరు సైన్ ఇన్ అయ్యారు',
  'account.signedOut': 'సైన్ ఇన్ కాలేదు',
  'account.signedOutBody': 'ఈ బ్రౌజర్‌లో ఏ ఖాతా అవి కలిలేదు.',
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

  'home.chooseTopicNote': 'కింద ఉన్న అంశాన్ని నొక్కండి. ప్రతి చోట అర్థమయ్యే భాషలో సమాచారం ఇవ్వబడింది.',

  'home.categoryEmpty': 'ఈ అంశంలో ఇంకా ఏమీ రాయలేదు.',

  'home.soundIntro': 'ఫీజు లేదు, ప్రచారం లేదు. మనసు ప్రశాంతం చేయడానికి మాత్రమే.',

  'home.dedication1': 'స్మరణలో — పూర్తిగా ఉచిత సేవ.',

  'home.dedication2': 'మీ సమస్యను రాయండి లేదా మాట్లాడండి.',

  'ref.title': 'ఈ సేవ ఏమిటి, ఎవరికోస్తు',

  'ref.intro': 'ఈ సేవ శ్రీమతి వర్షా గుర్తులో రూపొందించబడింది. ఇది ఏమి చేస్తుంది, దీనిలో ఏమి ఉంది, దీని పరిమితులు ఏమిటో సరళంగా చెప్పబడింది. అన్నీ పూర్తిగా ఉచితం — డబ్బు తీసుకోవడం లేదు, ప్రచారం చూపించడం లేదు, వ్యక్తిగత సమాచారం అడగడం లేదు.',

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

  'ref.helpline1': 'పెద్ద ప్రమాదం అయితే — అగ్ని, విద్యుత్తు విరామం, పడిపోవడం లేదా అధిక రక్తస్రావం — 112కు కాల్ చేయండి.',

  'ref.helpline2': 'ఎవరికి అనారోగ్యం లేదా గాయం అయి, వెళ్ళే వాహనం లేకపోతే 108కు అంబులెన్స్ అడగండి.',

  'ref.helpline3': 'మహిళతో ఏదైనా చెడు జరిగితే, లేదా ఒక మహిళ ఎక్కడైనా బాధించబడితే, 181కు కాల్ చేయండి. ఇది ఉచితం.',

  'ref.helpline4': 'పిల్ల లేదా వృద్ధునికి ఏదైనా అన్యాయం జరిగితే, 1098కు ఫిర్యాదు చేయొచ్చు.',

  'ref.helpline5': 'మానసిక ఒత్తిడి చాలా ఎక్కువైతే, లేదా బ్రతకాలని అనిపిస్తే, 14416లో మాట్లాడొచ్చు. మాట్లాడటానికి మాత్రమే.',

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

  'support.way3Body': 'ఇక్కడ రాసినది చాలా మందికి ఉపయోగపడగలదు, వారికి తెలిస్తే. ఇది నిజంగా సహాయం చేసే వ్యక్తికి చెప్పండి.',

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

  'reviews.moderationNote': 'అన్నీ తొలగించకుండా, ప్రచురించే ముందు ప్రతి సమీక్షను ఒకసారి చూస్తారు. ఇంపు, నంబర్ లేదా వ్యక్తిగత విషయాలు తీసేస్తారు — మిగతా అన్నీ యథాతథంగా ప్రచురిస్తారు.',

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

  'health.band.elder.note': 'ప్రతి మందుల పరీక్ష అవసరం, ప్రతి పడకపోవడం తీవ్రం',

  'health.c.infant1': 'తీవ్ర జ్వరం',

  'health.c.infant2': 'తినడం లేదు',

  'health.c.infant3': 'విరేచనాలు',

  'health.c.infant4': 'విరేచనాలు',

  'health.c.child1': 'చదువులో ఆసక్తి లేదు',

  'health.c.child2': 'బడికి వెళ్ళడం ఇష్టం లేదు',

  'health.c.child3': 'రాత్రి జ్వరం',

  'health.c.child4': 'పంట్లు పడుతున్నాయి',

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

  'health.c.later1': 'మోపు నొప్పి',

  'health.c.later2': 'కళ్ల నొప్పి',

  'health.c.later3': 'రాత్రి కాలి కుంపులు',

  'health.c.later4': 'ఉదయం వాచిపోవడం',

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

  'health.q.infant3': 'పిల్లకు విరేచనాలు అవుతున్నాయి, ఎప్పుడు వైద్యునికి చూపించాలి?',

  'health.q.infant4': 'పిల్లకు విరేచనాలు అవుతున్నాయి, ఏమి ఇవ్వాలి?',

  'health.q.child1': 'పిల్ల చదువులో మనసు పెట్టుకోవడం లేదు, ఏమి చేయాలి?',

  'health.q.child2': 'పిల్ల ప్రతిరోజూ బడికి వెళ్ళదని చెబుతున్నాడు, కారణమేమిటి?',

  'health.q.child3': 'పిల్లకు రాత్రి జ్వరం వస్తుంది, ఏమి చేయాలి?',

  'health.q.child4': 'పిల్ల పంట్లు పడుతున్నాయి, పంట్ల సంరక్షణ ఎలా చేయాలి?',

  'health.q.teen1': 'చదువుపై ఎక్కువ ఒత్తిడి ఉంది, దానిని ఎలా ఎదురుకోవాలి?',

  'health.q.teen2': 'రాత్రి నిద్ర సరిగా రావడం లేదు, ఏమి చేయాలి?',

  'health.q.teen3': 'మొబైల్ అలవాటు కలిగిపోయింది, వదిలే విధానం ఏమిటో చెప్పండి.',

  'health.q.teen4': 'తీవ్ర దుఃఖంగా ఉంది, ఎవరితో మాట్లాడాలి?',

  'health.q.young1': 'పని ఒత్తిడి చాలా ఎక్కువ, ఎలా తగ్గించాలి?',

  'health.q.young2': 'కూర్చుని ఉంటే మోపు నొప్పిస్తోంది, ఏమి చేయాలి?',

  'health.q.young3': 'రాత్రి నిద్ర రావడం లేదు, ఏమి చేయాలి?',

  'health.q.young4': 'డబ్బు తక్కువ, ఖర్చు ఎక్కువ, ఏమి చేయాలి?',

  'health.q.middle1': 'కమ్ములో నొప్పి అవుతోంది, కారణమేమిటి?',

  'health.q.middle2': 'నిద్ర సరిగా రావడం లేదు, మెరుగుపరచడానికి ఏమి చేయాలి?',

  'health.q.middle3': 'ఇంట్లో ఎక్కువ ఒత్తిడి, పిల్లలను ఎలా పరిశీలించాలి?',

  'health.q.middle4': 'పనిలో సంవత్సరాలుగా పేట్లో గ్యాస్ సమస్య, ఏమి చేయాలి?',

  'health.q.later1': 'నా వయస్సు 54, మోపులో నొప్పి ఉంది, ఏమి చేయాలి?',

  'health.q.later2': 'ఎబ్బేటప్పుడు కళ్ల నొప్పిస్తుంది, ఎందుకు?',

  'health.q.later3': 'రాత్రి పాదాల్లో కుంపులు వస్తాయి, ఏమి చేయాలి?',

  'health.q.later4': 'ఉదయం లేచినా కమ్ము గడ్డిపోతుంది, కారణమేమిటి?',

  'health.q.senior1': 'కళ్లలో ఎంత నొప్పి ఉందండే, నడక కష్టంగా ఉంది, ఏమి చేయాలి?',

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

};

const MARATHI: Record<string, string> = {
  'nav.home': 'मुख्यपृष्ठ', 'nav.tribute': 'स्मृती', 'nav.help': 'मदत', 'nav.reference': 'माहिती',
  'nav.reviews': 'अभिप्राय', 'nav.support': 'मदत करा', 'nav.menu': 'मेनू',
  'nav.birthChart': 'जन्म पत्रिका',
  'jgd.title': 'तुमचे जन्म पत्रिका',
  'jgd.intro': 'तुमचे नाव, जन्मतारीख, आणि माहीत असल्यास वेळ व ठिकाण. सर्व गणना तुमच्या फोनवरच होते — कुठेही पाठवले जात नाही.',
  'jgd.nameLabel': 'जन्मताचे नाव',
  'jgd.namePlaceholder': 'उदा. पूर्ण नाव',
  'jgd.nameHint': 'लहपनात दिलेले नाव.',
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
  'nav.main': 'मुख्य',
  'ask.label': 'तुमची समस्या लिहा किंवा बोला', 'ask.placeholder': 'उदा.: मुलाचा अभ्यासात कमतरता आहे',
  'ask.help': 'एंटर दाबूनही पाठवता येईल.', 'ask.send': 'विचारा', 'ask.sending': 'विचार करत आहे…',
  'ask.clear': 'लिहिलेला पुसा', 'ask.speak': 'बोलून विचारा', 'ask.listening': 'बोलायला सुरुवात करा…',
  'ask.heard': 'ऐकत आहे', 'ask.stopListening': 'ऐकणे थांबवा', 'ask.suggested': 'नेहमीचे प्रश्न',
  'ask.answerTitle': 'उत्तर', 'ask.listen': 'ऐका', 'ask.stopSpeak': 'थांबवा', 'ask.readAloud': 'ऐका',
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
  'footer.pages': 'पाने', 'footer.helplines': 'महत्त्वाचे क्रमांक', 'footer.readStory': 'तिची संपूर्ण कथा वाचा',
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

  'smriti.eyebrow': 'स्मृतित',

  'smriti.whyTitle': 'ही साइट का बाय',

  'smriti.ending': 'त्यांचा संघर्ष येथूनच पुढे चालू आहे.',

  'article.askAny': 'एक प्रश्न विचारा',

  'article.remember': 'लक्षात ठेवा',

  'article.emergencyInfo': 'महत्त्वाची माहिती',

  'article.medicalTitle': 'हे चिकित्सा सल्ला नाही',

  'article.medicalBody': 'ही माहिती सामान्य मदतीसाठी आहे. डॉक्टरांच्या सल्ल्याशिवाय कोणतेही औषध सुरू किंवा बंद करू नका.',

  'article.heading': '{category} वरील लेख',

  'reviews.rateQuestion': 'किती तारे द्याल?',

  'reviews.starsShort': '{value} तारे',

  'reviews.averageOutOf': '{value} पैकी 5 तारे',

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

  'footer.women': 'महिला मदतवाहिनी',

  'sound.allHint': 'एकत्र',

  'sound.bansuriHint': 'कोमल, हळू',

  'sound.dholHint': 'तीव्र, जलद',

  'sound.errGeneric': 'ध्वनी चालवण्यात समस्या आली.',

  'sound.errUnsupported': 'हा ब्राउझर ध्वनी चालू करू शकत नाही.',

  'sound.listenLabel': 'ऐका',

  'sound.playing': 'आवाज चालू आहे. थांबवण्यासाठी तेच बटण पुन्हा दाबा.',

  'sound.shankhHint': 'खोल, लांब',

  'voice.aborted': 'थांबवले. पुन्हा प्रयत्न करा.',

  'voice.audioCapture': 'माइक मिळाला नाही. उपकरण जोडा, किंवा लिहून विचारा.',

  'voice.generic': 'काहीतरी चुकचुकली. पुन्हा प्रयत्न करा.',

  'voice.network': 'बोलून विचारण्यासाठी इंटरनेट हवे, पण ते चालू नाही. लिहून विचारा — तेच उत्तर मिळेल.',

  'voice.noSpeech': 'कोणताही आवाज ऐकली नाही. माइकजवळ बोला, किंवा लिहा.',

  'voice.notAllowed': 'माइकची परवानगी मिळाली नाही. वर जाऊन परवानगी द्या, किंवा लिहून विचारा.',

  'voice.serviceNotAllowed': 'माइकची परवानगी मिळाली नाही. वर जाऊन परवानगी द्या, किंवा लिहून विचारा.',

  'voice.speakFailed': 'हे उत्तर वाचून ऐकता आले नाहीत.',

  'voice.unsupported': 'या ब्राउझरमध्ये बोलून विचारणार काम करणार नाही. लिहून विचारा.',

  'ask.notConfigured': 'ही सेवा सध्या जतन केलेल्या उत्तरांच्या संग्रहातून उत्तर देत आहे. तुमचा प्रश्न त्यात नाही.',

  'ask.browseTitle': 'इथले असलेले लेख पहा',

  'health.heading': 'तुमचे वय सांगा',

  'health.intro': 'वयानुसार जे प्रश्न नेहमी विचारले जातात ते येथे दिसतील. कोणतेही बटण दाबू नका — प्रश्न खाली भरला जाईल, मग विचारा.',

  'health.ageLabel': 'वय (वर्षे)',

  'health.years': 'वर्षे',

  'health.bandsLabel': 'वयानुसार निवडा',

  'health.notAdviceStrong': 'हे वैद्यकीय सल्ला नाही.',

  'health.notAdvice': 'कोणतेही औषध सुरू किंवा बंद करू नका — आधी डॉक्टरांचा सल्ला घ्या.',

  'health.emergencyStrong': 'आपत्काली फोन करा:',

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

  'download.pdf': 'PDF मध्ये लेख',
  'download.text': 'मजकूर मध्ये लेख',
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
  'ask.sendWithFile': 'उत्तर द्या',

  /* ---- free library ---- */

  'lib.title': 'मोफत ग्रंथालय',
  'lib.intro': 'शाळेची पुस्तके, पुस्तके, चित्रे आणि ऑडिओ — सर्व मोफत आणि कायदेशीर.',
  'lib.legalTitle': 'कॉपीराइटचा कोणताही त्रुटी नाही.',
  'lib.legal': 'इथे जे काही दिले आहे ते पूर्णपणे मोफत आहे आणि आपण ते पुढेही पाठवू शकता. जे पुस्तक अजून कॉपीराइटमध्ये आहे ते येथे नाही — ते कॉपी करणे परवानगी नाही, हे स्पष्ट सांगणेच बरोबेर.',
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
  'lib.group.padhai': 'शाळेच्या पुस्तकांसह अभ्यास',
  'lib.group.padhai.note': 'पाठ्यपुस्तके, महाविद्यालयीन आणि सरकारी शैक्षणिक साहित्य',
  'lib.group.kitab': 'पुस्तके',
  'lib.group.kitab.note': 'जी कॉपीराइटमुक्त आहेत किंवा ज्यांची कॉपी करण्यास परवानगी आहे',
  'lib.group.tasveer': 'चित्रे आणि नकाशे',
  'lib.group.tasveer.note': 'नकाशे, छायाचित्रे, आकडे — सर्व काही',
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

  'help.q1.label': 'वीज गेले आहे, काय करू?',

  'help.q1.question': 'घरात वीज चालू गेली आहे. काय करावे, आणि मोबाइल फोन कसा चार्ज करावा?',

  'help.q2.label': 'मुलाचा अभ्यासात कमजोरी',

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

  'home.chooseTopicNote': 'खालील विषयांवर टॅप करा. प्रत्येक ठिकाणी साध्या भाषेत माहिती दिली आहे.',

  'home.categoryEmpty': 'या विषयात अद्याप कोणतेही लेख लिहिलेले नाहीत.',

  'home.soundIntro': 'कोणतेही शुल्क नाही, कोणतीही जाहिरात नाही. फक्त मन शांत करण्यासाठी.',

  'home.dedication1': 'स्मृतिमध्ये — पूर्णपणे मोफत सेवा.',

  'home.dedication2': 'तुमची समस्या लिहा किंवा बोला.',

  'ref.title': 'ही सेवा काय आहे, आणि कोणासाठी',

  'ref.intro': 'ही सेवा श्रीमती वर्षा यांच्या स्मृतिमध्ये तयार करण्यात आली आहे. येथे साध्या भाषेत सांगितले आहे की ती काय करते, त्यात काय आहे आणि त्यांच्या मर्यादा काय आहेत. सर्व काही पूर्णपणे मोफत आहे — पैसे घेतले जात नाहीत, जाहिरात दाखवली जात नाही, आणि वैयक्तिक माहिती मागितली जात नाही.',

  'ref.whatTitle': 'यात काय आहे',

  'ref.what1': 'घरात आग लागणे, वीज जाणे, बाळाच्या अभ्यासात कमजोरी, आई-वडिलांची काळजी घेणे — अशा सामान्य समस्यांची सोपी उपाययोजना, स्वच्छ भाषेत.',

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

  'support.way1Body': 'जर या साइटमुळे तुम्हाला काहीतरी चांगले वाटले असेल — किंवा असे काही मिळाले असेल ज्याने तुम्ही घुंटले — तर राय पेजवर लिहा. तुमचे नाव घेणे आवश्यक नाही.',

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

  'reviews.moderationNote': 'सर्व काही मिटवण्याचा धोका टाळण्यासाठी, प्रकाशित होण्यापूर्वी प्रत्येक समीक्षा एकदा पाहिली जाते. शिव, नंबर किंवा वैयक्तिक गोष्टी काढून टाकल्या जातात — बाकी सर्व जे आहे तसेच प्रकाशित होते.',

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

  'health.c.later4': 'सकाळी आकडण',

  'health.c.senior1': 'चालणे अडचण आहे',

  'health.c.senior2': 'औषधांची तपासणी',

  'health.c.senior3': 'रात्री पेशाब',

  'health.c.senior4': 'कान कमी ऐकते',

  'health.c.elder1': 'पडण्याची भीती',

  'health.c.elder2': 'नात्री कमजोर',

  'health.c.elder3': 'रोजची दुखी-औषधी',

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

  'health.q.later2': 'चढ़ताना गुडघा दुखतो, का?',

  'health.q.later3': 'रात्री पायांची ऐंठण होते, काय करू?',

  'health.q.later4': 'सकाळी उठल्यावर कमर जकडते, कारण काय असू शकते?',

  'health.q.senior1': 'गुडघ्यांत इतका दुखणा आहे की चालणे अडचण आहे, काय करू?',

  'health.q.senior2': 'अनेक औषधे रोज खावी लागतात — कोणी हानिकारक आहे हे कसे कळेल?',

  'health.q.senior3': 'रात्री वारंवार पेशाबाची तक्रार आहे, काय करू?',

  'health.q.senior4': 'कानी कमी ऐकते, ऐकण्याचा काही उपाय सांगा.',

  'health.q.elder1': 'घरात पडण्याची भीती आहे, कोणती सुरक्षा ठेवावी?',

  'health.q.elder2': 'नात्री कमजोर होत आहे, काय उपाय आहेत?',

  'health.q.elder3': 'रोज दुखीचे औषध खावे लागते — याचा काही तोटा होतो का?',

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

};

const GUJARATI: Record<string, string> = {
  'nav.home': 'હોમ', 'nav.tribute': 'સ્મૃતિ', 'nav.help': 'મદદ', 'nav.reference': 'માહિતી',
  'nav.reviews': 'અભિપ્રાય', 'nav.support': 'મદદ કરો', 'nav.menu': 'મેનુ',
  'nav.birthChart': 'જન્મ ગંઠ',
  'jgd.title': 'તમારી જન્મ ગંઠ',
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
  'nav.main': 'મુખ્ય',
  'ask.label': 'તમારી સમસ્યા લખો અથવા બોલો', 'ask.placeholder': 'દા.ત.: બાળકના વિદ્યામાં નબળાઈ',
  'ask.help': 'એન્ટર દબાવીને પણ મોકલી શકાય.', 'ask.send': 'પૂછો', 'ask.sending': 'વિચારુ છે…',
  'ask.clear': 'લખેલું કાઢો', 'ask.speak': 'બોલીને પૂછો', 'ask.listening': 'બોલવાનું શરૂ કરો…',
  'ask.heard': 'સાંભળી રહ્યા છીએ', 'ask.stopListening': 'સાંભળવાનું બંધ કરો', 'ask.suggested': 'સામાન્ય પ્રશ્નો',
  'ask.answerTitle': 'ઉત્તર', 'ask.listen': 'સાંભળો', 'ask.stopSpeak': 'બંધ કરો', 'ask.readAloud': 'સાંભળો',
  'ask.aiNote': 'આ ઉત્તર AI એ આપ્યું છે. નિષ્ણાતની સલાહનો વિકલ્પ નથી.',
  'sound.title': 'શાંતિ માટે ધ્વનિ', 'sound.intro': 'કોઈ ફી નથી, કોઈ જાહેરાત નથી.',
  'sound.shankh': 'શંખ', 'sound.bansuri': 'બાંસુરી', 'sound.dhol': 'ઢોલ', 'sound.all': 'ત્રણેય',
  'dhun.welcome': 'સ્વાગત છે', 'dhun.prompt': 'શંખ, બાંસુરી અને ઢોલ સાથે સાંભળવા સ્પર્શ કરો.',
  'dhun.listen': 'સાંભળો', 'dhun.skip': 'છોડો',
  'home.emergencyTitle': 'અત્યંત જરૂરી — હવે મદદ જોઈએ છે', 'home.emergencyNote': 'આ પહેલાં વાંચો. બાકી પછી.',
  'home.readMore': 'સંપૂર્ણ માહિતી વાંચો', 'home.chooseTopic': 'કયા વિષયે જાણું છે?',
  'home.askHere': 'આ વિષયે પૂછો', 'home.howTitle': 'આ સેવા કેવી રીતે કામ કરે છે',
  'home.soundTitle': 'શાંતિ માટે ધ્વનિ', 'home.freeTitle': 'આ સેવા સંપૂર્ણપણે મફત છે',
  'home.freeBody': 'પૈસા લેવામાં આવતા નથી, વ્યક્તિગત માહિતી પૂછવામાં આવતી નથી, જાહેરાત દર્શાવતી નથી.',
  'footer.pages': 'પાનાં', 'footer.helplines': 'મહત્વના નંબરો', 'footer.readStory': 'તેણીની સંપૂર્ણ વાત વાંચો',
  'reviews.title': 'તમારી રાય, તમારી વાત', 'reviews.submit': 'મોકલો', 'reviews.comment': 'તમારી વાત',
  'language.choose': 'તમારી ભાષા પસંદ કરો', 'language.articlesIn': 'આ લેખ હિન્દીમાં છે.',

  'ask.welcome': 'સ્વાગત છે! નીચે તમારી સમસ્યા લખો અથવા એક વિષય પસંદ કરો.',

  'ref.notTitle': 'આ શું કરતું નથી',

  'ref.not1': 'આ ડૉક્ટર નથી. દવાની સલાહ ક્યારેય આપવામાં આવતી નથી.',

  'ref.not2': 'આ વકીલ નથી. કાનૂની સલાહ આપવામાં આવતી નથી.',

  'ref.not3': 'કોઈ પૈસા લેવાતા નથી, અને કોઈ જાહેરાત બતાવવાતી નથી.',

  'ref.not4': 'તમારું નામ, સરનામું કે ફોન નંબર માંગવાતું નથી અને રાખવાતું પણ નથી.',

  'ref.not5': 'સરકારી યોજનાની કિંમત કે નંબર બનાવવાતો નથી — માહિતી ન હોય તો સ્પષ્ટ કહે છે કે માહિતી નથી.',

  'ref.medicalTitle': 'મહત્વના: આ ડૉક્ટરની સલાહ નથી',

  'ref.medicalBody': 'બીમારી, દવા કે ઝેરી વસ્તુ વિશે હોય તો પહેલા ડૉક્ટરને મળો. અહીં આપેલ માહિતી ફક્ત સામાન્ય મદદ માટે છે. બાળકના ટીકા, ગર્ભાવસ્થા, કે કોઈ પણ દવા શરૂ કરતાં પહેલાં ડૉક્ટરની સલાહ જરૂર લો.',

  'ref.statsTitle': 'કેટલી માહિતી ઉપલબ્ધ છે',

  'support.howTitle': 'આપણી મદદ કેવી રીતે કરવી',

  'support.alwaysFreeTitle': 'આ સેવા હંમેશા મફત રહેશે',

  'support.alwaysFreeBody': 'જે મદદ મળે તે સેવા ચલાવવામાં વપરાશે. કોઈપાસો ક્યારેય પૈસા લેવામાં આવશે નહીં.',

  'smriti.eyebrow': 'સમરણમાં',

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

  'reviews.averageOutOf': '{value} માંથી 5 તારા',

  'dhun.welcomeTitle': 'સ્વાગત છે',

  'dhun.consent': 'શંખ, બાંસુરી અને ઢોલ સાથે. સાંભળવા છૂટો.',

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

  'dhun.label': 'ધ્વનિ વગાડવાની પરવાનગી',

  'language.articlesInHint': 'દરેક ભાષાનું અલગ અનુવાદ જરૂરી છે. આ અનુવાદ હજી થયો નથી — જે લખ્યું છે તે હિન્દીમાં જ સૌથી યોગ્ય અને પૂર્ણ છે.',

  'theme.toDark': 'અંધારા રંગ પર જાઓ',

  'theme.toLight': 'ઉજળ રંગ પર જાઓ',

  'ask.emptyAnswer': 'આ વાર જવાબ બન્યો નહીં. થોડું અલગ કરીને ફરી પૂછો.',

  'ask.errorNetwork': 'ઇન્ટરનેટ ચાલુ નથી. કનેક્શન તપાસીને ફરી પ્રયત્ન કરો.',

  'ask.errorRateLimit': 'એક સાથે ઘણા પ્રશ્નો મોકલાયા. થોડી વાર પછી પ્રયત્ન કરો.',

  'ask.heardWith': 'અત્યારે સાંભળું રહ્યા છીએ',

  'ask.micUnsupported': 'આ બ્રાઉઝરમાં બોલીને પૂછવાનું કામ નહીં કરે. લખીને પૂછો.',

  'ask.notAnswer': 'આ પ્રશ્નનું સીધું જવાબ અમારે પાસે નથી.',


  'article.askAbout': 'આ વિષય વિશે પૂછો',

  'article.count': '{count} લેખ',

  'article.emergency': 'જરૂરી',

  'article.others': 'આ વિષયના વધુ લેખ',

  'article.readAloud': 'આ લેખ સાંભળો',

  'footer.admin': 'વ્યવસ્થાપક',

  'footer.ambulance': 'એમ્બ્યુલન્સ',

  'footer.emergency': 'કટોકટી',

  'footer.rights': 'મફત સેવા',

  'footer.women': 'મહિલા મદદ',

  'sound.allHint': 'સાથે જ',

  'sound.bansuriHint': 'કોમળ, ધીમી',

  'sound.dholHint': 'તેજ, ઝડપી',

  'sound.errGeneric': 'ધ્વનિ વગાડવામાં સમસ્યા આવી.',

  'sound.errUnsupported': 'આ બ્રાઉઝર ધ્વનિ વગાડી શકતો નથી.',

  'sound.listenLabel': 'સાંભળો',

  'sound.playing': 'અવાજ વાગી રહ્યો છે. બંધ કરવા એ જ બટન ફરી દબાવો.',

  'sound.shankhHint': 'ઘેલું, લાંબું',

  'voice.aborted': 'થોભાયું. ફરી પ્રયત્ન કરો.',

  'voice.audioCapture': 'માઇક મળ્યો નહીં. ઉપકરણ જોડો, અથવા લખીને પૂછો.',

  'voice.generic': 'કંઈક ગડબડ થઈ. ફરી પ્રયત્ન કરો.',

  'voice.network': 'બોલીને પૂછવા ઇન્ટરનેટ જોઈએ, પણ તે ચાલુ નથી. લખીને પૂછો — એ જ જવાબ મળશે.',

  'voice.noSpeech': 'કોઈ અવાજ સુધરાયો નહીં. માઇક પાસે બોલો, અથવા લખો.',

  'voice.notAllowed': 'માઇકની પરવાનગી મળી નથી. ઉપર જઈને પરવાનગી આપો, અથવા લખીને પૂછો.',

  'voice.serviceNotAllowed': 'માઇકની પરવાનગી મળી નથી. ઉપર જઈને પરવાનગી આપો, અથવા લખીને પૂછો.',

  'voice.speakFailed': 'આ જવાબ વાંચીને સાંભળવામાં આવ્યું નહીં.',

  'voice.unsupported': 'આ બ્રાઉઝરમાં બોલીને પૂછવાનું કામ નહીં કરે. લખીને પૂછો.',

  'ask.notConfigured': 'આ સેવા હાલ સચવાયેલા જવાબોના ભંડોળમાંથી જવાબ આપી રહી છે. તમારો પ્રશ્ન તેમાં નથી.',

  'ask.browseTitle': 'અહીં જે લેખ છે તે જુઓ',

  'health.heading': 'તમારી ઉંમર કહો',

  'health.intro': 'ઉંમર પ્રમાણે જે પ્રશ્નો વારંવાર પૂછાય છે તે અહીં દેખાશે. કોઈ બટન દબાવવું નહીં — પ્રશ્ન નીચે ભરાશે, પછી પૂછો.',

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
  'ask.sendWithFile': 'આનો જવાબ આપો',

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

  'home.chooseTopicNote': 'નીચેના વિષય પર ટેપ કરો. દરેક જગ્યાએ સરળ ભાષામાં માહિતી આપવામાં આવી છે.',

  'home.categoryEmpty': 'આ વિષયમાં હજી કંઈ લખાયું નથી.',

  'home.soundIntro': 'કોઈ ફી નહીં, કોઈ જાહેરાત નહીં. ફક્ત મન શાંત કરવા માટે.',

  'home.dedication1': 'સ્મૃતિમાં — સંપૂર્ણ મફત સેવા.',

  'home.dedication2': 'તમારી સમસ્યા લખો અથવા બોલો.',

  'ref.title': 'આ સેવા શું છે, અને કોના માટે છે',

  'ref.intro': 'આ સેવા શ્રીમતી વર્ષાની સ્મૃતિમાં બનાવવામાં આવી છે. અહીં સાદી ભાષામાં કહેલું છે કે તે શું કરે છે, તેમાં શું છે, અને તેની મર્યાદા શું છે. બધું સંપૂર્ણ મફત છે — પૈસા લેવાતા નથી, જાહેરાત બતાવવાતી નથી, અને નિજી માહિતી માંગવાતી નથી.',

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

  'ref.helpline3': 'મહિલા સાથે કંઈ ખરાબ થયું હોય, કે મહિલાને ક્યાંથી તકલીફ પડે, તો 181 પર ફોન કરો. આ મફત છે.',

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

};

const KANNADA: Record<string, string> = {
  'nav.home': 'ಮುಖಪುಟ', 'nav.tribute': 'ಸ್ಮರಣೆ', 'nav.help': 'ಸಹಾಯ', 'nav.reference': 'ಪರಿಚಯ',
  'nav.reviews': 'ಅಭಿಪ್ರಾಯ', 'nav.support': 'ಸಹಾಯ ಮಾಡಿ', 'nav.menu': 'ಮೆನು',
  'nav.birthChart': 'ಜನ್ಮ ಗಂಠ',
  'jgd.title': 'ನಿಮ್ಮ ಜನ್ಮ ಗಂಠ',
  'jgd.intro': 'ನಿಮ್ಮ ಹೆಸರು, ಜನನ ದಿನಾಂಕ, ತಿಳಿದಿದ್ದರೆ ಸಮಯ ಮತ್ತು ಸ್ಥಳ. ಎಲ್ಲವೂ ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲೇ ಲೆಕ್ಕವಾಗುತ್ತದೆ — ಎಲ್ಲಿಗೂ ಕಳುಹಿಸಲ್ಪಡುವುದಿಲ್ಲ.',
  'jgd.nameLabel': 'ಜನನ ಹೆಸರು',
  'jgd.namePlaceholder': 'ಉದಾ. ಪೂರ್ಣ ಹೆಸರು',
  'jgd.nameHint': 'ಮಕುವಿನಲ್ಲಿ ಕೊಡಲಾದ ಹೆಸರು.',
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
  'jgd.disclaimer': 'ಇದು ಪಾರಂಪರಿಕ ವಿಧದಲ್ಲಿ ಮಾಡಿದ ಲೆಕ್ಕ, ಜ್ಞಾನವಾದವಲ್ಲ. ಯಾವುದೇ ಸಂಖ್ಯೆ ಅಥವಾ ರಾಶಿ ಯಾರ ಆರೋಗ್ಯ, ಹಣ ಅಥವಾ ಸಂಬಂಧವನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ. ದೊಡ್ಡ ನಿರ್ಧಾರಕ್ಕೆ ವೈದ್ಯ, ಅಭಿಜ್ಞ ಅಥವಾ ಅನುಭವಿ ವ್ಯಕ್ತಿಯ ಸಲಹೆ ಪಡೆಯಿರಿ.',
  'nav.openMenu': 'ಮೆನು ತೆರೆಯಿರಿ', 'nav.closeMenu': 'ಮೆನು ಮುಚ್ಚಿ', 'nav.language': 'ಭಾಷೆ ಬದಲಿಸಿ',
  'nav.skip': 'ನೇರವಾಗಿ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
  'ask.label': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ', 'ask.placeholder': 'ಉದಾ.: ಮಕ್ಕಳ ಓದುವಿಕೆ ದುರ್ಬಲತೆ',
  'ask.help': 'ಎಂಟರ್ ಒತ್ತಿದರೂ ಕಳುಹಿಸಬಹುದು.', 'ask.send': 'ಕೇಳಿ', 'ask.sending': 'ಯೋಚಿಸುತ್ತಿದೆ…',
  'ask.speak': 'ಮಾತನಾಡಿ ಕೇಳಿ', 'ask.listening': 'ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ…',
  'ask.suggested': 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು', 'ask.answerTitle': 'ಉತ್ತರ', 'ask.listen': 'ಕೇಳಿ', 'ask.stopSpeak': 'ನಿಲ್ಲಿಸಿ',
  'ask.aiNote': 'ಈ ಉತ್ತರವನ್ನು AI ನೀಡಿದೆ. ತಜ್ಞರ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಿಲ್ಲ.',
  'sound.title': 'ಶಾಂತಿಗೆ ಧ್ವನಿ', 'sound.intro': 'ಶುಲ್ಕವಿಲ್ಲ, ಜಾಹೀರಾತವಿಲ್ಲ.',
  'sound.shankh': 'ಶಂಖ', 'sound.bansuri': 'ಬಂಸಿ', 'sound.dhol': 'ಢೋಲ್', 'sound.all': 'ಮೂರು',
  'dhun.welcome': 'ಸ್ವಾಗತ', 'dhun.prompt': 'ಶಂಖ, ಬಂಸಿ, ಢೋಲ್ ಜೊತೆ ಕೇಳಲು ಮುಟ್ಟಿ.',
  'dhun.listen': 'ಕೇಳಿ', 'dhun.skip': 'ಬಿಟ್ಟುಬಿಡಿ',
  'home.readMore': 'ಪೂರ್ಣ ಮಾಹಿತಿ ಓದಿ', 'home.chooseTopic': 'ಯಾವ ವಿಷಯ ತಿಳಿಯಬೇಕು?',
  'home.askHere': 'ಈ ವಿಷಯದಲ್ಲಿ ಕೇಳಿ', 'home.howTitle': 'ಈ ಸೇವೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
  'home.freeTitle': 'ಈ ಸೇವೆ ಸಂಪೂರ್ಣ ಉಚಿತ', 'home.freeBody': 'ಹಣಕ ಪಡೆಯುವುದಿಲ್ಲ, ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ, ಜಾಹೀರಾತೆ ಇಲ್ಲ.',
  'footer.pages': 'ಪುಟಗಳು', 'footer.helplines': 'ಮುಖ್ಯ ಸಂಖ್ಯೆಗಳು',
  'reviews.title': 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ, ನಿಮ್ಮ ಮಾತು', 'reviews.submit': 'ಕಳುಹಿಸಿ',
  'language.choose': 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', 'language.articlesIn': 'ಈ ಲೇಖನ ಹಿಂದಿಯಲ್ಲಿದೆ.',

  'ask.welcome': 'ಸ್ವಾಗತ! ಕೆಳಗೆ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಒಂದು ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',

  'ref.notTitle': 'ಇದು ಏನು ಮಾಡುವುದಿಲ್ಲ',

  'ref.not1': 'ಇದು ವೈದ್ಯ ಅಲ್ಲ. ಔಷಧಿಯ ಸಲಹೆ ಎಂದಿಗೂ ನೀಡಲಾಗುವುದಿಲ್ಲ.',

  'ref.not2': 'ಇದು ವಕೀಲ ಅಲ್ಲ. ಕಾನೂನು ಸಲಹೆ ನೀಡಲಾಗುವುದಿಲ್ಲ.',

  'ref.not3': 'ಯಾವುದೇ ಹಣಕಟಿ ತೆಗೆಯುವುದಿಲ್ಲ, ಮತ್ತು ಯಾವುದೇ ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ.',

  'ref.not4': 'ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ನಂಬರ್ ಕೇಳುವುದಿಲ್ಲ ಮತ್ತು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.',

  'ref.not5': 'ಸರ್ಕಾರಿ ಯೋಜನೆಯ ದರ ಅಥವಾ ಸಂಖ್ಯೆ ಕಟ್ಟುವುದಿಲ್ಲ — ಮಾಹಿತಿ ಇಲ್ಲದಿದ್ದರೆ ಸ್ಪಷ್ಟವಾಗೆ ತಿಳಿಸಲಾಗುತ್ತದೆ.',

  'ref.medicalTitle': 'ಮುಖ್ಯ: ಇದು ವೈದ್ಯರ ಸಲಹೆ ಅಲ್ಲ',

  'ref.medicalBody': 'ಕಾಯಕೋಶ, ಔಷಧಿ ಅಥವಾ ವಿಷದ ಬಗ್ಗೆ ಇದ್ದರೆ ಮೊದಲು ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ. ಇಲ್ಲಿ ನೀಡಿದ ಮಾಹಿತಿ ಸಾಮಾನ್ಯ ಸಹಾಯಕ್ಕಾಗಿ ಮಾತ್ರ. ಬಕ್ಕಳ ಲಸಿಕೆ, ಗರ್ಭಿಣಿ, ಅಥವಾ ಯಾವುದೇ ಔಷಧಿ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ತಪ್ಪದೆ ಪಡೆಯಿರಿ.',

  'ref.statsTitle': 'ಎಷ್ಟು ಮಾಹಿತಿ ಇದೆ',

  'support.howTitle': 'ನಮ್ಮ ಸಹಾಯ ಹೇಗೆ ಮಾಡುವುದು',

  'support.alwaysFreeTitle': 'ಈ ಸೇವೆ ಯಾವಾಗಲೂ ಉಚಿತವಾಗಿರುತ್ತದೆ',

  'support.alwaysFreeBody': 'ಸಿಗುವ ಸಹಾಯ ಈ ಸೇವೆ ನಡೆಸಲು ಬಳಸಲಾಗುತ್ತದೆ. ಯಾರಿಂದೂ ಒಂದು ಹಣಕಟಿ ತೆಗೆಯಲಾಗುವುದಿಲ್ಲ.',

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

  'reviews.averageOutOf': '{value} ರಲ್ಲಿ 5 ನಕ್ಷತ್ರ',

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

  'dhun.label': 'ಧ್ವನಿ ಪ್ಲೇ ಮಾಡಲು ಅನುಮತಿ',

  'language.articlesInHint': 'ಪ್ರತಿ ಭಾಷೆಗೆ ಪ್ರತ್ಯೇಕ ಅನುವಾದ ಬೇಕು. ಈ ಅನುವಾದ ಇನ್ನೂ ಆಗಿಲ್ಲ — ಬರೆದಿರುವುದು ಕನ್ನಡದಲ್ಲೇ ಸರಿಯಾದದ್ದು ಮತ್ತು ಪೂರ್ಣವಾಗಿದೆ.',

  'nav.collapse': 'ಟ್ಯಾಬ್ ಮುಚ್ಚಿ',

  'nav.expand': 'ಟ್ಯಾಬ್ ತೆರೆ',

  'theme.toDark': 'ಕಡು ಬಣ್ಣಕ್ಕೆ ಹೋಗಿ',

  'theme.toLight': 'ಉಜ್ಜಲ ಬಣ್ಣಕ್ಕೆ ಹೋಗಿ',

  'ask.clear': 'ಬರೆದಿರುವುದನ್ನು ಅಳಿಸಿ',

  'ask.emptyAnswer': 'ಈ ಬಾರಿ ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಬೇರೆಯ ಮಾತನಾಡಿ ಮತ್ತೆ ಕೇಳಿ.',

  'ask.errorNetwork': 'ಇಂಟರ್ನೆಟ್ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'ask.errorRateLimit': 'ಒಂದೇ ಸಮಯದಲ್ಲಿ ಹಲವಾದ ಪ್ರಶ್ನೆಗಳು ಕಳುಹಿಸಲ್ಪಟ್ಟಿವೆ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',

  'ask.heardWith': 'ಈಗ ಕೇಳುತ್ತಿದ್ದೇವೆ',

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

  'sound.shankhHint': 'ದಾವದ, ಉದ್ದ',

  'voice.aborted': 'ನಿಲ್ಲಿಸಲಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'voice.audioCapture': 'ಮೈಕ್ ಸಿಗಲಿಲ್ಲ. ಸಾಧನ ಸಂಪರ್ಕಿಸಿ, ಅಥವಾ ಬರೆದು ಕೇಳಿ.',

  'voice.generic': 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

  'voice.network': 'ಮಾತನಾಡಿ ಕೇಳಲು ಇಂಟರ್ನೆಟ್ ಬೇಕು, ಅದು ಇಲ್ಲ. ಬರೆದು ಕೇಳಿ — ಅದೇ ಉತ್ತರ ಸಿಗುತ್ತದೆ.',

  'voice.noSpeech': 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮೈಕ್ ಹತ್ತಿರ ಮಾತನಾಡಿ, ಅಥವಾ ಬರೆಯಿರಿ.',

  'voice.notAllowed': 'ಮೈಕ್‌ಗೆ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ಮೇಲಕ್ಕೆ ಹೋಗಿ ಅನುಮತಿ ನೀಡಿ, ಅಥವಾ ಬರೆದು ಕೇಳಿ.',

  'voice.serviceNotAllowed': 'ಮೈಕ್‌ಗೆ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ಮೇಲಕ್ಕೆ ಹೋಗಿ ಅನುಮತಿ ನೀಡಿ, ಅಥವಾ ಬರೆದು ಕೇಳಿ.',

  'voice.speakFailed': 'ಈ ಉತ್ತರವನ್ನು ಓದಿ ಕೇಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',

  'voice.unsupported': 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ ಕೇಳುವುದು ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. ಬರೆದು ಕೇಳಿ.',

  'ask.notConfigured': 'ಈ ಸೇವೆ ಈಗ ಉಳಿಸಿದ ಉತ್ತರಗಳ ದಾಸ್ತಾನದಿಂದ ಉತ್ತರಿಸುತ್ತಿದೆ. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅದರಲ್ಲಿ ಇಲ್ಲ.',

  'ask.browseTitle': 'ಇಲ್ಲಿರುವ ಲೇಖಗಳನ್ನು ನೋಡಿ',

  'health.heading': 'ನಿಮ್ಮ ವಯಸ್ಸು ತಿಳಿಸಿ',

  'health.intro': 'ವಯಸ್ಸಿಗೆ ತಕ್ಕಂತೆ ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ. ಯಾವುದೇ ಬಟನ್ ಒತ್ತಬೇಡಿ — ಪ್ರಶ್ನೆ ಕೆಳಗೆ ತುಂಬಲಾಗುತ್ತದೆ, ನಂತರ ಕೇಳಿ.',

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

  'help.q2.label': 'ಮಕುವಿನ ಓದುವಿನಲ್ಲಿ ದುರ್ಬಲತೆ',

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

  'home.step3Title': 'ಹಣಕಟಿಯಿಲ್ಲ, ಖಾಸಗಿ ಮಾಹಿತಿಯಿಲ್ಲ',

  'home.step3Body': 'ಈ ಸೇವೆ ಸಂಪೂರ್ಣ ಉಚಿತ. ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಕೇಳುವುದಿಲ್ಲ, ಮತ್ತು ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ.',

  'home.chooseTopicNote': 'ಕೆಳಗಿನ ವಿಷಯಕ್ಕೆ ಒತ್ತಿ. ಪ್ರತಿ ಕಡೆ ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ.',

  'home.categoryEmpty': 'ಈ ವಿಷಯದಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಬರೆಯಲಾಗಿಲ್ಲ.',

  'home.soundIntro': 'ಶುಲ್ಕವಿಲ್ಲ, ಜಾಹೀರಾತಿಲ್ಲ. ಮನಸು ಶಾಂತಗೊಳಿಸಲು ಮಾತ್ರ.',
  'home.emergencyTitle': 'ತುರ್ತ ಸಹಾಯ ಬೇಕೇ?',
  'home.emergencyNote': 'ಇವನ್ನು ಮೊದಲು ಓದಿ. ಉಳಿದವೆಲ್ಲಾ ನಂತರ ನೋಡಬಹುದು.',

  'home.dedication1': 'ಸ್ಮರಣದಲ್ಲಿ — ಸಂಪೂರ್ಣ ಉಚಿತ ಸೇವೆ.',

  'home.dedication2': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ.',

  'ref.title': 'ಈ ಸೇವೆ ಏನು, ಮತ್ತು ಯಾರಿಗೆ',

  'ref.intro': 'ಈ ಸೇವೆಯನ್ನು ಶ್ರೀಮತಿ ವರ್ಷಾ ಸ್ಮರಣದಲ್ಲಿ ಕಟ್ಟಲಾಗಿದೆ. ಇದು ಏನು ಮಾಡುತ್ತದೆ, ಇದರಲ್ಲಿ ಏನಿದೆ, ಮತ್ತು ಇದರ ಮಿತಿಗಳೇನು ಎಂದು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಹೇಳಲಾಗಿದೆ. ಎಲ್ಲವೂ ಸಂಪೂರ್ಣ ಉಚಿತ — ಹಣಕಟಿಯನ್ನು ತೆಗೆಯುವುದಿಲ್ಲ, ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ, ಖಾಸಗಿ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ.',

  'ref.whatTitle': 'ಇದರಲ್ಲಿ ಏನಿದೆ',

  'ref.what1': 'ಮನೆಯಲ್ಲಿ ಅಗ್ನಿ, ವಿದ್ಯುತ್ ಹೋಗುವುದು, ಬಕ್ಕಳ ಓದುವಿನ ದುರ್ಬಲತೆ, ತಂದೆ-ತಾಯಿಯ ಆರೈಕೆ — ಇಂತಹ ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಗಳಿಗೆ ಸರಳ ಪರಿಹಾರ, ಸ್ಪಷ್ಟ ಭಾಷೆಯಲ್ಲಿ.',

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

  'ref.helpline1': 'ದೊಡ್ಡ ಅಪಾಯ ಇದ್ದರೆ — ಅಗ್ನಿ, ವಿದ್ಯುತ್ ಕಂಪನ, ಉಪ್ಪಿತುವಿಕೆ ಅಥವಾ ಹೆಚ್ಚು ರಕ್ತಸ್ರಾವ — 112 ಗೆ ಫೋನ್ ಮಾಡಿ.',

  'ref.helpline2': 'ಯಾರಿಗೂ ಅನಾರೋಗ್ಯ ಅಥವಾ ಗಾಯ ಇದ್ದರೆ ಮತ್ತು ಹೋಗಿಕೆ ವಾಹನ ಇಲ್ಲದಿದ್ದರೆ, 108 ಗೆ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕೇಳಿ.',

  'ref.helpline3': 'ಮಹಿಳೆಯೊಂದಿಗೆ ಏನೋ ಕೆಟ್ಟಮಾಟಾದರೆ, ಅಥವಾ ಮಹಿಳೆಯನ್ನು ಎಲ್ಲಿದರೂ ಕಷ್ಟಕ್ಕೆ ಒಳಗೆಮಾಡಿದರೆ, 181 ಗೆ ಫೋನ್ ಮಾಡಿ. ಇದು ಉಚಿತ.',

  'ref.helpline4': 'ಬಕ್ಕ ಅಥವಾ ವೃದ್ಧರ ಜೊತೆಗೆ ಯಾವುದೋ ಅನ್ಯಾಯ ಆಗಿದ್ದರೆ, 1098 ಗೆ ದೂರು ಹಿಡಿಯಬಹುದು.',

  'ref.helpline5': 'ಮಾನಸಿಕ ಒತ್ತಡ ತುಂಬಾ ಹೆಚ್ಚಾಗಿದ್ದರೆ, ಅಥವಾ ಬದುಕಿ ಇರಬೇಣ ಎಂದು ಮನಸೆ ಬರಲ್ಪಡಿದರೆ, 14416 ಗೆ ಮಾತನಾಡಬಹುದು. ಮಾತನಾಡಲು ಮಾತ್ರ.',

  'ref.ownerNote': 'ಈ ಸೇವೆ ಯಾವುದೇ ಕಂಪನಿಯದ್ದು ಅಥವಾ ಸರ್ಕಾರದ್ದು ಅಲ್ಲ, ಒಂದು ವ್ಯಕ್ತಿಯ ಸ್ಮರಣದಲ್ಲಿ ನಡೆಯುತ್ತದೆ. ಹಾಗಾಗಿ ಇಲ್ಲಿ ಜಾಹೀರಾತಿಯಿಲ್ಲ, ಸದಸ್ಯತ್ವವಿಲ್ಲ, ಮತ್ತು ಹಣಕಟಿ ತೆಗೆಯುವುದಿಲ್ಲ.',

  'support.title': 'ಈ ಸೇವೆ ಉಚಿತ',

  'support.intro': 'ಈ ಸೇವೆ ಯಾರಿಂದೂ ಹಣಕಟಿ ತೆಗೆಯುವುದಿಲ್ಲ. ಆದರೆ ಅದು ನಡೆಯುತ್ತದೆ — ಹಾಗಾಗಿ ಕೆಲವು ಮಾರ್ಗಗಳಿವೆ, ಅವುಗಳಲ್ಲಿ ನೀವು ಸಹಾಯ ಮಾಡಬಹುದು. ಸರಳವಾದ ಮಾರ್ಗವೇ ಹೆಚ್ಚು ಉಪಯೋಗ.',

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

  'support.way3Body': 'ಇಲ್ಲಿ ಬರೆದಿರುವುದು ಹಲವರಿಗೆ ಉಪಯೋಗವಾಗಬಹುದು, ಅವರಿಗೆ ತಿಳಿದರೆ. ಇದು ನಿಜವಾಗಿಯೂ ಸಹಾಯ ಮಾಡುವ ವ್ಯಕ್ತಿಗೆ ಹೇಳಿ.',

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

  'reviews.moderationNote': 'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿಹಾಕದಂತೆ, ಪ್ರಕಟಿಸುವ ಮೊದಲು ಪ್ರತಿ ವಿಮರ್ಶೆ ಒಮ್ಮೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ಗುಂಡು, ಸಂಖ್ಯೆ ಅಥವಾ ಖಾಸಗಿ ಮಾತುಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ — ಉಳಿದ್ದಂತೆ ಎಲ್ಲವೂ ಹಾಗೆಯೇ ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ.',

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

  'health.c.infant3': 'ವಾತಿಸುತ್ತಿದೆ',

  'health.c.infant4': 'ಮಲಗೆಯುತ್ತಿದೆ',

  'health.c.child1': 'ಓದುವಿನಲ್ಲಿ ಮನಸ್ಸಿಲ್ಲ',

  'health.c.child2': 'ಶಾಲೆಗೆ ಹೋಗಲು ಮನಸ್ಸಿಲ್ಲ',

  'health.c.child3': 'ರಾತ್ರಿ ಜ್ವರ',

  'health.c.child4': 'ಹಲ್ಲು ಉಡುತ್ತಿದೆ',

  'health.c.teen1': 'ಓದಿನ ಒತ್ತಡ',

  'health.c.teen2': 'ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ',

  'health.c.teen3': 'ಮೊಬೈಲ್ ಅಭಿವಾದ',

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

  'health.c.later3': 'ರಾತ್ರಿ ಕಾಲಿನ ಮಂಜೂರಿ',

  'health.c.later4': 'ಬೆಳಗಿನಲ್ಲಿ ಕೂಸುವುದು',

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

  'health.q.infant3': 'ಮಗನಿಗೆ ವಾತಿಸುತ್ತಿದೆ, ಯಾವಾಗ ವೈದ್ಯರನ್ನು ತೋರಿಸಬೇಕು?',

  'health.q.infant4': 'ಮಗನಿಗೆ ಮಲಗೆಯುತ್ತಿದೆ, ಏನು ಕೊಡಬೇಕು?',

  'health.q.child1': 'ಮಗನ ಓದುವಿನಲ್ಲಿ ಮನಸ್ಸು ಹಾಕುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.child2': 'ಮಗು ಪ್ರತಿದಿನೂ ಶಾಲೆಗೆ ಹೋಗದೆ ಹೇಳುತ್ತಿದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?',

  'health.q.child3': 'ಮಗನಿಗೆ ರಾತ್ರಿ ಜ್ವರ ಬರುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.child4': 'ಮಗನ ಹಲ್ಲು ಉಡುತ್ತಿದೆ, ಹಲ್ಲಿನ ಆರೈಕೆ ಹೇಗೆ ಮಾಡಬೇಕು?',

  'health.q.teen1': 'ಓದಿನ ತುಂಬಾ ಒತ್ತಡಿದೆ, ಅದನ್ನು ಹೇಗೆ ಎದುರಿಸಬೇಕು?',

  'health.q.teen2': 'ರಾತ್ರಿ ನಿದ್ದೆ ಸರಿಯಾಗುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.teen3': 'ಮೊಬೈಲ್ ಅಭಿವಾದ ಹಡಗಿದೆ, ಬಿಡಲು ಹೇಗೆ ಮಾಡಬೇಕೆಂದು ಹೇಳಿ.',

  'health.q.teen4': 'ತುಂಬಾ ಬೇಸರಗೆ ಆಗುತ್ತದೆ, ಯಾರೊಂದಿಗೆ ಮಾತನಾಡಬೇಕು?',

  'health.q.young1': 'ಕೆಲಸದ ತುಂಬಾ ಒತ್ತಡಿದೆ, ಹೇಗೆ ಕಡಿಮೆ ಮಾಡಬೇಕು?',

  'health.q.young2': 'ಕುಳಿತಿದ್ದರೆ ಬೆನ್ನಿಗೆ ನೋವಾಗುತ್ತದೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.young3': 'ರಾತ್ರಿ ನಿದ್ದೆ ಬರುತ್ತಿಲ್ಲ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.young4': 'ಹಣ ಕಡಿಮೆ, ಖರ್ಚ ಹೆಚ್ಚು, ಏನು ಮಾಡಬೇಕು?',

  'health.q.middle1': 'ಕೆನ್ನಿಗೆ ನೋವಾಗುತ್ತಿದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?',

  'health.q.middle2': 'ನಿದ್ದೆ ಚೆನ್ನಾಗಿ ಬರುತ್ತಿಲ್ಲ, ಸುಧರಿಸಲು ಏನು ಮಾಡಬೇಕು?',

  'health.q.middle3': 'ಮನೆಯಲ್ಲಿ ತುಂಬಾ ಒತ್ತಡ, ಮಕ್ಕಳನ್ನು ಹೇಗೆ ನೋಡಿಕೊಳ್ಳಬೇಕು?',

  'health.q.middle4': 'ಕೆಲಸದಲ್ಲಿ ವರ್ಷಗಳಿಗೆ ಹೊಟ್ಟೆಯಲ್ಲಿ ಗ್ಯಾಸ್ ಸಮಸ್ಯೆ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.later1': 'ನನ್ನ ವಯಸ್ಸು 54 ಮತ್ತು ಬೆನ್ನಿಗೆ ನೋವು, ಏನು ಮಾಡಬೇಕು?',

  'health.q.later2': 'ಹಣ ಹಾರುವಾಗ ಮೊಣಕೆಗೆ ನೋವಾಗುತ್ತದೆ, ಏಕೆ?',

  'health.q.later3': 'ರಾತ್ರಿ ಕಾಲಿನಲ್ಲಿ ಮಂಜೂರಿ, ಏನು ಮಾಡಬೇಕು?',

  'health.q.later4': 'ಬೆಳಗಿನಲ್ಲಿ ಕೂಗಿದಾಗ ಬೆನ್ನು ಕೂಸುತ್ತದೆ, ಕಾರಣ ಏನಾಗಿರಬಹುದು?',

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

  'support.faq1A': 'ಹೌದು. ಹಣಕಟಿ ತೆಗೆಯುವುದಿಲ್ಲ, ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ, ಸದಸ್ಯತ್ವ ತೆಗೆಯುವುದಿಲ್ಲ. ಇದು ಒಬ್ಬ ವ್ಯಕ್ತಿಯ ಹಣದಿಂದ ನಡೆಯುತ್ತದೆ, ಕಂಪನಿ ಅಥವಾ ಸರ್ಕಾರದದ್ದಲ್ಲ.',

  'support.faq2Q': 'ನನ್ನ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ನಂಬರ್ ತೆಗೆಯುತ್ತಾರೆ?',

  'support.faq2A': 'ಇಲ್ಲ, ಮತ್ತು ತೆಗೆಯುವುದಿಲ್ಲ. ಈ ಸೈಟ್ ತಾನಾಗೆ ಯಾವುದೇ ಗುರುತನ್ನು ರಚಿಸುವುದಿಲ್ಲ — ಲಾಗಿನ್ ಇಲ್ಲ, ಟ್ರ್ಯಾಕಿಂಗ್ ಸ್ಕ್ರಿಪ್ಟ್ ಇಲ್ಲ. ಕೇಳುವುದು ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮಾತ್ರ, ಅದೇ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.',

  'support.faq3Q': 'ಇದು ವೈದ್ಯ ಅಥವಾ ವಕೀಲವೇ?',

  'support.faq3A': 'ಇಲ್ಲ. ಇದು ಔಷಧಿ ಅಥವಾ ಕಾನೂನು ಸಲಹೆ ಕೊಡುವುದಿಲ್ಲ. ವಿಷಯವು ಗಂಭೀರವಾದಂತೆ ಇಲ್ಲಿ ನಿಮಗೆ ವೈದ್ಯರ ಅಥವಾ ಅಧಿಕಾರಿಯ ಬಗ್ಗೆ ಹೋಗಬೇಕೆಂದು ಹೇಳುತ್ತದೆ — ಅವರ ಸ್ಥಾನವನ್ನು ಇದು ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.',

  'support.faq4Q': 'ಪ್ರತಿ ಉತ್ತರ ಸರಿಯೇ?',

  'support.faq4A': 'ಎಂದಿಗೂ ಅಲ್ಲ. ಉತ್ತರ ಬರೆದ್ದೇ ಕಂಪ್ಯೂಟರ್, ವೈದ್ಯರಲ್ಲ — ಅತ್ತರಾಗಿ ಪ್ರತಿ ಉತ್ತರದೊಂದಿಗೆ ಇದು ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ ಎಂದು ಬರೆದಿದೆ. ಯಾವುದೇ ಔಷಧಿ ಆರಂಭಿಸುವ ಮೊದಲು ಅಥವಾ ನಿಲ್ಲಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.',

  'support.faq5Q': 'ನನಗೆ ಯಾವುದೇ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕೇ?',

  'support.faq5A': 'ಇಲ್ಲ. ಇದು ಬ್ರೌಸರ್‌ನಲ್ಲೇ ತೆರೆಯುತ್ತದೆ. ಯಾವುದೇ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಇಲ್ಲ, ಯಾವುದೇ ಅನುಮತಿ ಇಲ್ಲ, ಯಾವುದೇ ಅಪ್‌ಡೇಟ್ ಇಲ್ಲ.',

};

const MALAYALAM: Record<string, string> = {
  'nav.home': 'ഹോം', 'nav.tribute': 'സ്മരണം', 'nav.help': 'സഹായം', 'nav.reference': 'വിവരം',
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
  'sound.shankh': 'ശംഖം', 'sound.bansuri': 'ബാംസുരി', 'sound.dhol': 'ഡ്രം', 'sound.all': 'മൂന്നും',
  'dhun.welcome': 'സ്വാഗതം', 'dhun.prompt': 'ശംഖം, ബാംസുരി, ഡ്രം ഒരുടെ കേൾക്കാൻ സ്പർശിക്കുക.',
  'dhun.listen': 'കേൾക്കുക', 'dhun.skip': 'ഒഴിവാക്കുക',
  'home.readMore': 'പൂർണ്ണ വിവരങ്ങൾ വായിക്കുക', 'home.chooseTopic': 'എന്തുക്കുറിച്ച് അറിയണം?',
  'home.askHere': 'ഈ വിഷയത്തിൽ ചോദിക്കുക', 'home.howTitle': 'ഈ സേവനം എങ്ങനെ പ്രവർത്തിക്കുന്നു',
  'home.freeTitle': 'ഈ സേവനം പൂർണ്ണമായും സൌജന്യം', 'home.freeBody': 'പണം ആകും വാകും വ്യക്തിഗത വിവരങ്ങൾ ആകാം പരസ്താരവുമില്ല.',
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

  'support.howTitle': 'ഞങ്ങൾ എങ്ങനെ സഹായിക്കാം',

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

  'reviews.averageOutOf': '{value} ൽ 5 നക്ഷത്രങ്ങൾ',

  'dhun.welcomeTitle': 'സ്വാഗതം',

  'dhun.consent': 'ശംഖം, വിളംപം, മേല്. കേളാൻ തൊടുക.',

  'dhun.failed': 'ശബ്ദം വില്ലാ.',

  'dhun.unsupported': 'ഈ ബ്രൗസറിന് ശബ്ദം കളിക്കാം.',

  'dhun.failedTry': 'ശബ്ദം കളിക്കുമ്പോൾ പ്രശ്നം ഉണ്ടായി.',

  'sound.hintIdle': 'ഏത് ബട്ടണും അമർത്തി ശബ്ദം കേൾക്കുക.',

  'sound.hintPlaying': 'ശബ്ദം കളിക്കുകയാണ്. നിർത്താൻ ആ അതേ ബട്ടൺ വീണ്ടും അമർത്തുക.',

  'sound.preparing': 'ശബ്ദം തയ്യാറാകുകയാണ്',

  'nav.path': 'വഴി',

  'toast.dismiss': 'അടയ്ക്കുക',

  'footer.free': 'ഈ സേവനം പൂർണ്ണമായും സൗജന്യം. ആരോടും പണം ആവശ്യമാക്കില്ല.',

  'cat.empty': 'ഈ വിഷയത്തിൽ ഇതുവരെ ലേഖനങ്ങളില്ല.',

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

  'ask.listening': 'പറയാൻ തുടങ്ങുക…',

  'ask.micUnsupported': 'ഈ ബ്രൗസറിൽ പറഞ്ഞ് ചോദിക്കിയാൽ പ്രവർത്തിക്കില്ല. എഴുതി ചോദിക്കുക.',

  'ask.notAnswer': 'ഈ ചോദ്യത്തിന് നേരിട്ട ഉത്തരം ഞങ്ങളുടെ കയ്യിൽ ഇല്ല.',


  'ask.stopListening': 'കേൾക്കുന്നത് നിർത്തുക',

  'article.askAbout': 'ഈ വിഷയത്തിൽ ചോദിക്കുക',

  'article.count': '{count} ലേഖനങ്ങൾ',

  'article.emergency': 'അടിയന്തരം',

  'article.others': 'ഈ വിഷയത്തിലെ കൂടുതൽ ലേഖനങ്ങൾ',

  'article.readAloud': 'ഈ ലേഖനം കേൾക്കുക',

  'footer.admin': 'നിരൂപണം',

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

  'voice.unsupported': 'ഈ ബ്രൗസറിൽ പറഞ്ഞ് ചോദിക്കിയാൽ പ്രവർത്തിക്കില്ല. എഴുതി ചോദിക്കുക.',

  'ask.notConfigured': 'ഈ സേവനം ഇപ്പോൾ സംരക്ഷിച്ച ഉത്തരങ്ങളുടെ ആക്കെയിൽ നിന്ന് ഉത്തരിക്കുന്നു. നിങ്ങളുടെ ചോദ്യം അതിൽ ഇല്ല.',

  'ask.browseTitle': 'ഇവിടെയുള്ള ലേഖകൾ കാണുക',

  'health.heading': 'നിങ്ങളുടെ പ്രായം പറയൂ',

  'health.intro': 'പ്രായം അനുസരിച്ച് പതിററാം ചോദിക്കുന്ന ചോദ്യങ്ങൾ ഇവിടെ കാണും. ഏതെങ്കിലും ബട്ടൺ അമർത്തരുത് — ചോദ്യം താഴെ പൂരിപ്പിക്കും, ശേഷം ചോദിക്കൂ.',

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
  'lib.freeBadgeNote': 'വായിക്കാം, പകർത്താൻ ആവശ്യമില്ല',
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

  'home.step3Body': 'ഈ സേവനം പൂർണ്ണമായും സൗജന്യമാണ്. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും ആരോഗ്യദാരും ചോദിക്കപ്പെട്ടില്ല, പരസ്താരവുമില്ല.',

  'home.chooseTopicNote': 'താഴെയുള്ള വിഷയത്തിൽ അമർത്തുക. ഓരോ സ്ഥലത്തും എളുപ്പമായ ഭാഷയിൽ വിവരങ്ങൾ നൽകിയിട്ടുണ്ട്.',

  'home.categoryEmpty': 'ഈ വിഷയത്തിൽ ഇതുവരെ ഒന്നും എഴുതിയിട്ടില്ല.',

  'home.soundIntro': 'ഫീസില്ല, പരസ്താരമില്ല. മനസ്സ് ശാന്തമാക്കാൻ മാത്രം.',
  'home.emergencyTitle': 'ഉടർന്നടെ സഹായം വേണോ?',
  'home.emergencyNote': 'ഇവയെ ആദ്യം വായിക്കൂ. ബാക്കിയുള്ളവ സമയത്തിനു വായിച്ചോണം.',

  'home.dedication1': 'സ്മരണയിൽ — പൂർണ്ണമായും സൗജന്യമായ സേവനം.',

  'home.dedication2': 'നിങ്ങളുടെ പ്രശ്നം എഴുതുകയോ പറയുകയോ ചെയ്യുക.',

  'ref.title': 'ഈ സേവനം എന്താണ്, ആരുക്കാണ്',

  'ref.intro': 'ഈ സേവനം ശ്രീമതി വർഷയുടെ സ്മരണദിൽ ഉണ്ടാക്കിയതാണ്. ഇത് എന്ത് ചെയ്യുന്നു, ഇതിൽ എന്തുണ്ട്, ഇതിന്റെ പരിധികൾ എന്ത് എന്നിവ ലളിതമായ ഭാഷയിൽ പറഞ്ഞിട്ടുണ്ട്. എല്ലാം പൂർണ്ണമായും സൗജന്യമാണ് — പണം എടുക്കുന്നില്ല, വിളംപരം കാണിക്കുന്നില്ല, സ്വകാര്യ വിവരങ്ങൾ ചോദിക്കുന്നില്ല.',

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

  'ref.dataTitle': 'നിങ്ങളെക്കുറിച്ച് നാവ് എന്ത് സൂക്ഷിക്കുന്നു',

  'ref.dataBody': 'നിങ്ങൾ ചോദിച്ച ചോദ്യം, അതിന്റെ സാരാംശം, ചോദിച്ച സമയം മാത്രം — അതേ ഉത്തരം പദേ പദേ നൽകാത്തിരിക്കാൻ. നിങ്ങളുടെ പേരും വിലാസവും ഫോൺ നമ്പറും തിരിച്ചറിയുന്ന വിവരവുമില്ല. സൈറ്റിൽ വിളംപരമോ ട്രാക്കിംഗ് സ്ക്രിപ്റ്റോ ഇല്ല.',

  'ref.helplineTitle': 'അടിയന്തര സഹായത്തിന് ഈ നമ്പറുകൾ സൂക്ഷിക്കൂ',

  'ref.helpline1': 'വലിയ അപകടം ഉണ്ടെങ്കിൽ — തീ, വൈദ്യുത് കംപനം, വീണ്ടുവൻ, അമിതമായ രക്തസ്രാവം — 112 ലേക്ക് വിളിക്കൂ.',

  'ref.helpline2': 'ആരെങ്കിലും അസൂക്ഷ്മവും പ്രതികാരവും ഉള്ളതും പോകാനുള്ള വാഹനമില്ലാത്തവർക്ക് 108 ലേക്ക് ആംബുലൻസ് വിളിക്കൂ.',

  'ref.helpline3': 'വീട്ടെയോരുമായി ഏതെങ്കിലും ദുരുത്തം സംഭവിച്ചിട്ടെങ്കിലോ, അല്ലെങ്കിൽ ഒരു വീട്ടെയോർ എവിടെങ്കിലും കുഴപ്പം അനുഭവിക്കുന്നുണ്ടെങ്കിലോ, 181 ലേക്ക് വിളിക്കൂ. ഇത് സൗജന്യമാണ്.',

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

  'health.band.teen.note': 'ഇവലാവർ, അവർക്ക് സാധാരണമായി കേൾക്കുന്ന ഒരാൾ കിട്ടുമെങ്കിൽ അല്ല',

  'health.band.young.note': 'ജോലി, പണം, ഉറക്ക് — മൂന്നിന്റെയും ഒന്നിച്ചുള്ള ഭാരം',

  'health.band.middle.note': 'വീട്, കുട്ടികൾ, സ്വന്തം ആരോഗ്യം — എല്ലാവരുടെയും ഉത്തരാധികാരിതതം ഒരുപാടി',

  'health.band.later.note': 'ശരീരത്തിന്റെ പ്രായവും അതിന്റെ പരിചരണവും — രണ്ടും ഒരുപാടി',

  'health.band.senior.note': 'മരുന്ന്, സന്തുലനം, ഒറ്റയാകല — മൂന്നും ഒരുപാടി',

  'health.band.elder.note': 'ഓരോ മരുന്നിന്റെയും പരിശോധന ആവശ്യം, ഓരോ വീഴ്ചയും ഗുരുതം',

  'health.c.infant1': 'കടുത്ത പനി',

  'health.c.infant2': 'കഴിക്കാരില്ല',

  'health.c.infant3': 'ഓക്കരുകളിക്കുന്നു',

  'health.c.infant4': 'മലങ്ങളിക്കുന്നു',

  'health.c.child1': 'പഠനത്തിൽ താഴ്മായില്ല',

  'health.c.child2': 'സ്കൂളിൽ പോകാൻ മറക്കുന്നു',

  'health.c.child3': 'രാത്രി പനി',

  'health.c.child4': 'പല്ലുകൾ ഉടിക്കുന്നു',

  'health.c.teen1': 'പഠനം സമ്മർദ്ദം',

  'health.c.teen2': 'ഉറക്കം വരുന്നില്ല',

  'health.c.teen3': 'മൊബൈൽ ശീലം',

  'health.c.teen4': 'കടുത്ത ദുഃഖം',

  'health.c.young1': 'ജോലിയുടെ സമ്മർദ്ദം',

  'health.c.young2': 'ഇരിയുമ്പോൾ വേദന',

  'health.c.young3': 'ഉറക്കം വരുന്നില്ല',

  'health.c.young4': 'പണം കുറവ്',

  'health.c.middle1': 'കടുവിൽ വേദന',

  'health.c.middle2': 'ഉറക്കം ശരിയായി വരുന്നില്ല',

  'health.c.middle3': 'വീടിന്റെ സമ്മർദ്ദം',

  'health.c.middle4': 'വയറ്റിൽ വായു',

  'health.c.later1': 'മുട്ടിൽ വേദന',

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

  'health.q.infant3': 'കുഞ്ഞിക്ക് ഓക്കരുകളിക്കുന്നു, എപ്പോൾ ഡോക്ടറെ കാണിക്കണം?',

  'health.q.infant4': 'കുഞ്ഞിക്ക് മലങ്ങളിക്കുന്നു, എന്ത് കൊടുക്കണം?',

  'health.q.child1': 'കുട്ടിയുടെ പഠനത്തിൽ മനസ്സിൽ താഴ്മായില്ല, എന്ത് ചെയ്യണം?',

  'health.q.child2': 'കുട്ടി എല്ലാ ദിവസവും സ്കൂളിൽ പോകാൻ മറക്കുന്നു, കാരണം എന്താകാം?',

  'health.q.child3': 'കുട്ടിക്ക് രാത്രി പനി വരുന്നു, എന്ത് ചെയ്യണം?',

  'health.q.child4': 'കുട്ടിയുടെ പല്ലുകൾ പടിക്കുന്നു, പല്ലുകൾ എങ്ങനെ പരിചരിക്കണം?',

  'health.q.teen1': 'പഠനത്തിൽ വളരെ സമ്മർദ്ദമുണ്ട്, അതു എങ്ങനെ നേരിക്കണം?',

  'health.q.teen2': 'രാത്രി ഉറക്കം ശരിയായി വരുന്നില്ല, എന്ത് ചെയ്യണം?',

  'health.q.teen3': 'മൊബൈൽ ശീലം പൂർത്തിയായി, വിടലാക്കാന്‍ ഉപായം പറയൂ.',

  'health.q.teen4': 'കടുത്ത ദുഃഖം തോന്നുന്നു, ആരുമായി സംസാരിക്കണം?',

  'health.q.young1': 'ജോലിയുടെ സമ്മർദ്ദം വളരെ കൂടുതലാണ്, എങ്ങനെ കുറയ്ക്കണം?',

  'health.q.young2': 'ഇരിയുമ്പോൾ മുട്ടുത്തിന് വേദന, എന്ത് ചെയ്യണം?',

  'health.q.young3': 'രാത്രി ഉറക്കം വരുന്നില്ല, എന്ത് ചെയ്യണം?',

  'health.q.young4': 'പണം കുറവാണ്, ചെലവും കൂടുതല്, എന്ത് ചെയ്യണം?',

  'health.q.middle1': 'കടുവിൽ വേദനയാകുന്നു, കാരണം എന്താകാം?',

  'health.q.middle2': 'ഉറക്കം നല്ലയായി വരുന്നില്ല, മെച്ചപ്പെടുക്കാന്‍ എന്ത് ചെയ്യണം?',

  'health.q.middle3': 'വീട്ടിൽ വളരെ സമ്മർദ്ദം, കുട്ടികളെ എങ്ങനെ പരിചരിക്കണം?',

  'health.q.middle4': 'ജോലിയിൽ വർഷങ്ങായി വയറ്റിൽ വായു, എന്ത് ചെയ്യണം?',

  'health.q.later1': 'എന്റെ പ്രായം 54, മുട്ടിൽ വേദന, എന്ത് ചെയ്യണം?',

  'health.q.later2': 'കയറുമ്പോൾ മട്ടിൽ വേദന, എന്തുകൊണ്ട്?',

  'health.q.later3': 'രാത്രി കാലിൽ വലിച്ചുരുക്കൽ, എന്ത് ചെയ്യണം?',

  'health.q.later4': 'രാവിലെ കയറുമ്പോൾ കടുവ് കാഠമാകുന്നു, കാരണം എന്താകാം?',

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

};

const PUNJABI: Record<string, string> = {
  'nav.home': 'ਹੋਮ', 'nav.tribute': 'ਸਮਰਨ', 'nav.help': 'ਮਦਦ', 'nav.reference': 'ਜਾਣਕਾਰੀ',
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

  'support.howTitle': 'ਅਸੀਂ ਦੀ ਮਦਦ ਕਿਵੇਂ ਕਰਾਈਏ',

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

  'reviews.averageOutOf': '{value} ਵਿੱਚੋਂ 5 ਤਾਰੇ',

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

  'footer.admin': 'ਵਿਅਪਤੀ',

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

  'voice.unsupported': 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਬੋਲ ਕੇ ਪੁੱਛਣਾ ਕੰਮ ਨਹੀਂ ਕਰੇਗਾ। ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'ask.notConfigured': 'ਇਹ ਸੇਵਾ ਹਾਲੇ ਸੰਭਾਲੀਆਂ ਜਵਾਬਾਂ ਦੇ ਭੰਡਾਰ ਤੋਂ ਜਵਾਬ ਦੇ ਰਹੀ ਹੈ। ਤੁਹਾਡਾ ਸਵਾਲ ਉਸਮੇਂ ਨਹੀਂ ਮਿਲਿਆ।',

  'ask.browseTitle': 'ਇੱਥੇ ਜੋ ਲੇਖ ਹਨ ਉਹ ਵੇਖੋ',

  'health.heading': 'ਆਪਣੀ ਉਮਰ ਦੱਸੋ',

  'health.intro': 'ਉਮਰ ਅਨੁਸਾਰ ਜੋ ਸਵਾਲ ਵਾਰ-ਵਾਰ ਪੁੱਛੇ ਜਾਂਦੇ ਹਨ, ਉਹ ਇੱਥੇ ਦਿਸਣਗੇ। ਕੋਈ ਬਟਨ ਨਾ ਦਬਾਓ — ਸਵਾਲ ਹੇਠਾਂ ਭਰਿਆ ਜਾਵੇਗਾ, ਫਿਰ ਪੁੱਛੋ।',

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
  'account.errTryLater': 'હાલ શક્ય બન્યું નહીં. થોડી વાર પછી ફરી પ્રયાસ કરો.',
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

  'home.chooseTopicNote': 'ਹੇਠਾਂ ਦਿੱਤੇ ਵਿਸ਼ੇ \'ਤੇ ਟੈਪ ਕਰੋ। ਹਰ ਥਾਂ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ।',

  'home.categoryEmpty': 'ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਹਾਲੇ ਕੁਝ ਵੀ ਨਹੀਂ ਲਿਖਿਆ ਗਿਆ।',

  'home.soundIntro': 'ਕੋਈ ਫ਼ੀਸ ਨਹੀਂ, ਕੋਈ ਇਸ਼ਤਿਹਾਨ ਨਹੀਂ। ਸਿਰਫ਼ ਮਨ ਸ਼ਾਂਤ ਕਰਨ ਲਈ।',
  'home.emergencyTitle': 'ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?',
  'home.emergencyNote': 'ਇਹ ਪਹਿਲਾਂ ਪੜ੍ਹੋ। ਬਾਕੀ ਸਭ ਬਾਅਦ ਵਿੱਚ ਵੇਖ ਸਕਦੇ ਹਾਂ।',

  'home.dedication1': 'ਸ਼ਰਧਾਂਜਲੀ ਵਿੱਚ — ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਸੇਵਾ।',

  'home.dedication2': 'ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ ਜਾਂ ਬੋਲੋ।',

  'ref.title': 'ਇਹ ਸੇਵਾ ਕੀ ਹੈ, ਅਤੇ ਕਿਸ ਲਈ ਹੈ',

  'ref.intro': 'ਇਹ ਸੇਵਾ ਸ੍ਰੀਮਤੀ ਵਰਸ਼ਾ ਜੀ ਦੀ ਸ਼ਰਾਣੀ ਵਿੱਚ ਬਣਾਈ ਗਈ ਹੈ। ਇੱਥੇ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਦੱਸਿਆ ਗਿਆ ਹੈ ਕਿ ਇਹ ਕੀ ਕਰਦੀ ਹੈ, ਇਸ ਵਿੱਚ ਕੀ ਹੈ, ਅਤੇ ਇਸ ਦੀਆਂ ਹੱਦਾਂ ਕੀ ਹਨ। ਸਭ ਕੁਝ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ ਹੈ — ਪੈਸੇ ਨਹੀਂ ਲਿਏ ਜਾਂਦੇ, ਜਾਹੇਰਾਤ ਨਹੀਂ ਵਿਖਾਈ ਜਾਂਦੀ, ਅਤੇ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗੀ ਜਾਂਦੀ।',

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

  'ref.helpline1': 'ਕੋਈ ਵੱਡਾ ਖ਼ਤਰਾ ਹੋਵੇ — ਅੱਗ, ਬਿਜਲੀ ਦਾ ਤੇਜ਼ ਕੰਪਨ, ਡਿਗੱਗਣਾ ਜਾਂ ਬਹੁਤ ਜ਼ਿਆਦਾ ਖੂਨ — ਤਾਂ 112 \'ਤੇ ਫ਼ੋਨ ਕਰੋ।',

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

  'health.band.teen.note': 'ਕਿਸਾਨ, ਜਿਨ੍ਹਾਂ ਨੂੰ ਆਮ ਤੌਰ \'ਤੇ ਇਹਨਾਂ ਦੀ ਗੱਲ ਕੋਈ ਨਹੀਂ ਮਿਲਦਾ ਜੋ ਸੁਣੇ',

  'health.band.young.note': 'ਨੌਕਰੀ, ਪੈਸਾ ਅਤੇ ਨੀਂਦ — ਤਿੰਨਾਂ ਦਾ ਇਕੱਠਾ ਬੋਝ',

  'health.band.middle.note': 'ਘਰ, ਬੱਚੇ ਅਤੇ ਆਪਣੀ ਸਿਹਤ — ਸਭ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਇਕੱਠੇ',

  'health.band.later.note': 'ਸਰੀਰ ਦੀ ਉਮਰ ਅਤੇ ਉਸਦੀ ਸੰਭਾਲ — ਦੋਵੇਂ ਇਕੱਠੇ',

  'health.band.senior.note': 'ਦਵਾ, ਸੰਤੁਲਨ ਅਤੇ ਤਨਹਾਰੀ — ਤਿੰਨਾਂ ਇਕੱਠੇ',

  'health.band.elder.note': 'ਹਰ ਦਵਾ ਦੀ ਜਾਂਚ ਜ਼ਰੂਰੀ, ਹਰ ਡਿਗੱਗਣਾ ਗੰਭੀਰ',

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

};

const URDU: Record<string, string> = {
  'nav.home': 'ہوم', 'nav.tribute': 'یادگار', 'nav.help': 'مدد', 'nav.reference': 'تعارف',
  'nav.reviews': 'آراء', 'nav.support': 'مدد کریں', 'nav.menu': 'مینو',
  'nav.birthChart': 'جन्म گنٹھ',
  'jgd.title': 'آپ کی جन्म گنٹھ',
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
  'sound.shankh': 'شاخ', 'sound.bansuri': 'بانسُری', 'sound.dhol': 'ڈھول', 'sound.all': 'تینوں',
  'dhun.welcome': 'خوش آمدید', 'dhun.prompt': 'شاخ، بانسری اور ڈھول ایک ساتھ — سننے کے لیے چھوئیں۔',
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

  'support.howTitle': 'ہم مدد کیسے کر سکتے ہیں',

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

  'reviews.averageOutOf': '{value} میں سے 5 ستارے',

  'dhun.welcomeTitle': 'خوش آمدید',

  'dhun.consent': 'شاخ، بنسوری اور ڈھول مل کر۔ سننے کے لیے چھوئیں۔',

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

  'voice.unsupported': 'اس براؤزر میں بول کر پوچھنا کام نہیں کرے گا۔ لکھ کر پوچھیں۔',

  'ask.notConfigured': 'یہ خدمت اِس وقت محفوظ جوابات کے ذخیرے سے جواب دے رہی ہے۔ آپ کا سوال اس میں نہیں ملا۔',

  'ask.browseTitle': 'یہاں جو مضامین ہیں وہ دیکھیں',

  'health.heading': 'اپنی عمر بتائیے',

  'health.intro': 'عمر کے مطابق جو سوال بار بار پوچھے جاتے ہیں وہ یہاں دکھائی دیں گے۔ کوئی بٹن نہ دبائیں — سوال نیچے بھر جائے گا، پھر پوچھ لیجیے۔',

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
  'lib.legal': 'جو کچھ یہاں دیا گیا ہے وہ مکمل طور پر مفت ہے اور آپ اسے آگے بھی سکتا ہیں۔ جو کتاب ابھی کاپی رائٹ میں ہے وہ یہاں نہیں — اسے نقل کرنے کی اجازت نہیں، یہ صاف بتانا ہی بہتر ہے۔',
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
  'lib.licence.govtIndia': 'بھارتی سرکٹر کی ویب سائٹ پر۔ پڑھنا اور چھپانا دونوں مفت ہیں۔',
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

  'home.chooseTopicNote': 'نیچے دیے گئے موضوع پر ٹیپ کریے۔ ہر جگہ آسان زبان میں معلومات دی گئی ہے۔',

  'home.categoryEmpty': 'اس موضوع میں ابھی کچھ بھی نہیں لکھا گیا۔',

  'home.soundIntro': 'کوئی فیس نہیں، کوئی اشتہار نہیں۔ بس ذہن شانت کرنے کے لیے۔',

  'home.dedication1': 'یاد میں — مکمل طور پر مفت خدمت۔',

  'home.dedication2': 'اپنا مسئلہ لکھیے یا بولیے۔',

  'ref.title': 'یہ خدمت کیا ہے، اور کس کے لیے',

  'ref.intro': 'یہ خدمت محترمہ ورشا جی کی یاد میں بنائی گئی ہے۔ یہاں آسان زبان میں بتایا گیا ہے کہ یہ کیا کرتی ہے، اس میں کیا ہے، اور اس کی حدود کیا ہیں۔ سب کچھ مکمل طور پر مفت ہے — پیسے نہیں لیے جاتے، اشتہار نہیں دکھایا جاتا، اور نجی معلومات نہیں مانگی جاتیں۔',

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

  'ref.helpline1': 'بڑا خطرہ ہو — آگ، بجلی کا تیز کمپن، گر جانا یا بہت زیادہ خون — تو 112 پر فون کریں۔',

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

  'health.band.infant.note': 'نوم بچے، جو ابھی اپنی بات نہیں کہہ سکتے',

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

};

const ARABIC: Record<string, string> = {
  'nav.home': 'الرئيسية', 'nav.tribute': 'ذكرى', 'nav.help': 'مساعدة', 'nav.reference': 'تعريف',
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
  'sound.shankh': 'صدى الأبواق', 'sound.bansuri': 'الناي', 'sound.dhol': 'الطبول', 'sound.all': 'الثلاثة',
  'dhun.welcome': 'أهلا وسهلا', 'dhun.prompt': 'صدى الأبواق والناي والطبول معا — المس للاستماع.',
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

  'support.howTitle': 'كيف نساعد',

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

  'voice.unsupported': 'السؤال بالصوت لن يعمل في هذا المتصفح. اكتب سؤالك بدلاً من ذلك.',

  'ask.notConfigured': 'تخدم هذه الخدمة حالياً من مكتبتها المحفوظة. لم يظهر سؤالك فيها.',

  'ask.browseTitle': 'هنا المقالات المتاحة',

  'health.heading': 'أخبر عن عمرك',

  'health.intro': 'الأسئلة التي تُطرح كثيراً بحسب العمر ستظهر هنا. لا تضغط أي زر — يُكتب السؤال بالأسفل ثم اسأل.',

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
  'account.registerNote': 'حساب لازم نہیں۔ صرف آپ کی زبان اور جوابات محفوظ رہیں گے۔',
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
  'lib.licence.ccBySa': 'Puedes copiarla e imprimirla. Tus cambios deben compartirse también de forma abierta.',
  'lib.licence.ccZero': 'Totalmente libre. Ni siquiera hace falta atribuir la fuente.',
  'lib.licence.pd': 'Nadie tiene los derechos de autor: cópiala libremente.',
  'lib.licence.govtIndia': 'En un sitio del Gobierno de la India. Leer e imprimir son gratis.',
  'lib.licence.creativeCommons': 'Cada archivo tiene su propia licencia: mira el archivo.',
  'lib.licence.freeToRead': 'Leer es gratis. Compartirlo se permite en los mismos términos.',
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

  'home.chooseTopicNote': 'اضغط على الموضوع أدناه. المعلومات مكتوبة بلغة بسيطة في كل مكان.',

  'home.categoryEmpty': 'لم يُكتب شيء في هذا الموضوع بعد.',

  'home.soundIntro': 'لا رسوم ولا إعلانات. فقط لتهدئة النفس.',

  'home.dedication1': 'في الذاكرة — خدمة مجانية تماماً.',

  'home.dedication2': 'اكتب مشكلتك أو تحدّث.',

  'ref.title': 'ما هي هذه الخدمة، ولمن هي',

  'ref.intro': 'أُنشئت هذه الخدمة تكريماً للسيدة ورشا. ويبيَّن هنا بلغة بسيطة ما تفعله، وما فيها، وحدودها. كل شيء مجاني تماماً — لا تُؤخذ أموال، ولا تُعرض إعلانات، ولا تُطلب بيانات شخصية.',

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

};

const SPANISH: Record<string, string> = {
  'nav.home': 'Inicio', 'nav.tribute': 'En memoria', 'nav.help': 'Ayuda', 'nav.reference': 'Acerca de',
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
  'jgd.numTitle': 'Numerología',
  'jgd.lifePath': 'Camino de vida',
  'jgd.nameNumber': 'Número del nombre',
  'jgd.soulNumber': 'Número del alma',
  'jgd.birthdayNumber': 'Número de cumpleaños',
  'jgd.astroTitle': 'Astrología védica',
  'jgd.nakshatra': 'Nakshatra',
  'jgd.pada': 'Pada',
  'jgd.rashi': 'Rashi',
  'jgd.rashiLord': 'Señor del signo',
  'jgd.nakshatraLord': 'Señor del nakshatra',
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

  'support.howTitle': 'Cómo ayudamos',

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

  'voice.network': 'Preguntar por voz necesita internet, y no funciona. Escriba su pregunta: receberá la misma respuesta.',

  'voice.noSpeech': 'No se oyó ninguna voz. Hable cerca del micrófono o escriba.',

  'voice.notAllowed': 'No se concedió permiso para el micrófono. Conceda el permiso arriba o escriba su pregunta.',

  'voice.serviceNotAllowed': 'No se concedió permiso para el micrófono. Conceda el permiso arriba o escriba su pregunta.',

  'voice.speakFailed': 'No se pudo leer esta respuesta en voz alta.',

  'voice.unsupported': 'Hablar para preguntar no funciona en este navegador. Escriba su pregunta.',

  'ask.notConfigured': 'Este servicio responde ahora desde su biblioteca guardada. Tu pregunta no estaba en ella.',

  'ask.browseTitle': 'Esto es lo que cubre este sitio',

  'health.heading': 'Dinos tu edad',

  'health.intro': 'Aquí aparecerán las preguntas que más se hacen según la edad. No pulses ningún botón: la pregunta se rellena abajo y luego preguntas.',

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

  'home.chooseTopicNote': 'Toca el tema de abajo. La información está en lenguaje sencillo en todas partes.',

  'home.categoryEmpty': 'Todavía no se ha escrito nada en este tema.',

  'home.soundIntro': 'Sin cuota y sin anuncios. Solo para calmar la mente.',

  'home.dedication1': 'En memoria: un servicio totalmente gratuito.',

  'home.dedication2': 'Escribe tu problema o habla.',

  'ref.title': 'Qué es este servicio y para quién es',

  'ref.intro': 'Este servicio se creó en memoria de la Sra. Varsha. Aquí, en lenguaje sencillo, se explica qué hace, qué contiene y cuáles son sus límites. Todo es totalmente gratis: no se cobra dinero, no se muestran anuncios y no se piden datos personales.',

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

  'health.q.later3': 'De noche se me calaman las piernas, ¿qué hago?',

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

};

/* -------------------------------------------------------------------------- */

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
