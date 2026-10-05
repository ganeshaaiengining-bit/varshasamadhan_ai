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
  { code: 'fr', native: 'Français', english: 'French', direction: 'ltr' },
  { code: 'de', native: 'Deutsch', english: 'German', direction: 'ltr' },
  { code: 'pt', native: 'Português', english: 'Portuguese', direction: 'ltr' },
  { code: 'ru', native: 'Русский', english: 'Russian', direction: 'ltr' },
  { code: 'zh', native: '中文', english: 'Chinese', direction: 'ltr' },
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
  'ask.help': 'Enter दबाकर भी भेज सकते हैं।',
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
  'ask.serviceNote': 'यह सेवा-संबंधी उत्तर है।',
  'ask.errorRateLimit':
    'बहुत सारे सवाल एक साथ भेज दिए गए। थोड़ी देर बाद कोशिश कीजिए।',
  'ask.errorNetwork': 'इंटरनेट नहीं चल पा रहा। कनेक्शन जाँचकर फिर कोशिश कीजिए।',
  'ask.notAnswer': 'कोई जवाब नहीं मिल पाया। दोबारा पूछने के लिए ऊपर का बटन दबाइए।',
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
  'ask.serviceNote': 'This is an informational answer.',
  'ask.errorRateLimit':
    'Too many questions at once. Please try again in a moment.',
  'ask.errorNetwork': 'The internet is not working. Check the connection and try again.',
  'ask.notAnswer': 'No answer came back. Press the button above to ask again.',
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
  'nav.openMenu': 'মেনু খুলুন', 'nav.closeMenu': 'মেনু বন্ধ করুন', 'nav.language': 'ভাষা বদলান',
  'nav.expand': 'বার খুলুন', 'nav.collapse': 'বার বন্ধ করুন', 'nav.skip': 'সরাসরি বিষয়বস্তুতে যান',
  'nav.main': 'প্রধান',
  'ask.label': 'আপনার সমস্যা লিখুন বা বলুন', 'ask.placeholder': 'যেমন: সন্তানের পড়াশোনায় দুর্বলতা',
  'ask.help': 'Enter চাপলেও পাঠানো যাবে।', 'ask.send': 'জিজ্ঞাসা করুন', 'ask.sending': 'ভাবছি…',
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
  'reviews.title': 'আপনার মতামত', 'reviews.submit': 'পাঠান', 'reviews.comment': 'আপনার কথা',
  'language.choose': 'আপনার ভাষা বেছে নিন', 'language.articlesIn': 'এই প্রবন্ধটি হিন্দিতে।',
  'home.freeTitle': 'এই সেবা সম্পূর্ণ বিনামূল্যে', 'home.freeBody': 'টাকা নেওয়া হয় না, ব্যক্তিগত তথ্য চাওয়া হয় না, বিজ্ঞাপন দেখানো হয় না।',
  'home.emergencyNote': 'এগুলো আগে পড়ুন। বাকি সব পরে।',
};

const TAMIL: Record<string, string> = {
  'nav.home': 'முகப்பு', 'nav.tribute': 'நினைவு', 'nav.help': 'உதவி', 'nav.reference': 'அறிமுகம்',
  'nav.reviews': 'கருத்து', 'nav.support': 'உதவி செய்யுங்கள்', 'nav.menu': 'பட்டி',
  'nav.openMenu': 'பட்டி திற', 'nav.closeMenu': 'பட்டி மூடு', 'nav.language': 'மொழி மாற்று',
  'nav.expand': 'பட்டி விரிவு', 'nav.collapse': 'பட்டி சுருக்கு', 'nav.skip': 'நேரடியாக உள்ளடக்கத்திற்குச் செல்',
  'nav.main': 'முதன்மை',
  'ask.label': 'உங்கள் பிரச்சினையை எழுதுங்கள் அல்லது பேசுங்கள்', 'ask.placeholder': 'எடுத்துக்காட்டு: குழந்தையின் படிப்பு குறைவு',
  'ask.help': 'Enter அழுத்தினாலும் அனுப்பலாம்.', 'ask.send': 'கேளுங்கள்', 'ask.sending': 'சிந்திக்கிறது…',
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
  'reviews.title': 'உங்கள் கருத்து', 'reviews.submit': 'அனுப்பு', 'reviews.comment': 'நீங்கள் கூற்று',
  'language.choose': 'உங்கள் மொழியைத் தேர்வு செய்', 'language.articlesIn': 'இந்தக் கட்டுரை ஹிந்தியில் உள்ளது.',
};

const TELUGU: Record<string, string> = {
  'nav.home': 'హోమ్', 'nav.tribute': 'స్మృతి', 'nav.help': 'సహాయం', 'nav.reference': 'పరిచయం',
  'nav.reviews': 'అభిప్రాయం', 'nav.support': 'సహాయం చేయండి', 'nav.menu': 'మెనూ',
  'nav.openMenu': 'మెనూ తెరవండి', 'nav.closeMenu': 'మెనూ మూసివేయండి', 'nav.language': 'భాష మార్చండి',
  'nav.expand': 'పట్టీ విస్తరించు', 'nav.collapse': 'పట్టీ మూడివేయి', 'nav.skip': 'సరిగ్గా విషయానికి వెళ్లండి',
  'nav.main': 'ప్రధాన',
  'ask.label': 'మీ సమస్యను టైప్ చేయండి లేదా మాట్లాడండి', 'ask.placeholder': 'ఉదాహరణకు: పిల్లలకు చదవు బలహీనం',
  'ask.help': 'Enter నొక్కి పంపవచ్చు.', 'ask.send': 'అడిగండి', 'ask.sending': 'ఆలోచిస్తోంది…',
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
  'footer.pages': 'పేజీలు', 'footer.helplines': 'ముఖ్య నంబర్లు', 'footer.readStory': ' her పూర్తి కథ చదవండి',
  'reviews.title': 'మీ అభిప్రాయం', 'reviews.submit': 'పంపండి', 'reviews.comment': 'మీ మాటలు',
  'language.choose': 'మీ భాషను ఎంచుకోండి', 'language.articlesIn': 'ఈ వ్యాసం హిందీలో ఉంది.',
};

const MARATHI: Record<string, string> = {
  'nav.home': 'मुख्यपृष्ठ', 'nav.tribute': 'स्मृती', 'nav.help': 'मदत', 'nav.reference': 'माहिती',
  'nav.reviews': 'अभिप्राय', 'nav.support': 'मदत करा', 'nav.menu': 'मेनू',
  'nav.openMenu': 'मेनू उघडा', 'nav.closeMenu': 'मेनू बंद करा', 'nav.language': 'भाषा बदला',
  'nav.expand': 'बाँस उघडा', 'nav.collapse': 'बाँस बंद करा', 'nav.skip': 'थेट मजकुराकडे जा',
  'nav.main': 'मुख्य',
  'ask.label': 'तुमची समस्या लिहा किंवा बोला', 'ask.placeholder': 'उदा.: मुलाचा अभ्यासात कमतरता आहे',
  'ask.help': 'Enter दाबूनही पाठवता येईल.', 'ask.send': 'विचारा', 'ask.sending': 'विचार करत आहे…',
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
  'reviews.title': 'तुमचा अभिप्राय', 'reviews.submit': 'पाठवा', 'reviews.comment': 'तुमचे म्हणणे',
  'language.choose': 'तुमची भाषा निवडा', 'language.articlesIn': 'हा लेख हिंदीत आहे.',
};

const GUJARATI: Record<string, string> = {
  'nav.home': 'હોમ', 'nav.tribute': 'સ્મૃતિ', 'nav.help': 'મદદ', 'nav.reference': 'માહિતી',
  'nav.reviews': 'અભિપ્રાય', 'nav.support': 'મદદ કરો', 'nav.menu': 'મેનુ',
  'nav.openMenu': 'મેનુ ખોલો', 'nav.closeMenu': 'મેનુ બંધ કરો', 'nav.language': 'ભાષા બદલો',
  'nav.expand': 'બાર ખોલો', 'nav.collapse': 'બાર બંધ કરો', 'nav.skip': 'સીધા સામગ્રી પર જાઓ',
  'nav.main': 'મુખ્ય',
  'ask.label': 'તમારી સમસ્યા લખો અથવા બોલો', 'ask.placeholder': 'દા.ત.: બાળકના વિદ્યામાં નબળાઈ',
  'ask.help': 'Enter દબાવીને પણ મોકલી શકાય.', 'ask.send': 'પૂછો', 'ask.sending': 'વિચારુ છે…',
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
  'reviews.title': 'તમારો અભિપ્રાય', 'reviews.submit': 'મોકલો', 'reviews.comment': 'તમારા શબ્દો',
  'language.choose': 'તમારી ભાષા પસંદ કરો', 'language.articlesIn': 'આ લેખ હિન્દીમાં છે.',
};

const KANNADA: Record<string, string> = {
  'nav.home': 'ಮುಖಪುಟ', 'nav.tribute': 'ಸ್ಮರಣೆ', 'nav.help': 'ಸಹಾಯ', 'nav.reference': 'ಪರಿಚಯ',
  'nav.reviews': 'ಅಭಿಪ್ರಾಯ', 'nav.support': 'ಸಹಾಯ ಮಾಡಿ', 'nav.menu': 'ಮೆನು',
  'nav.openMenu': 'ಮೆನು ತೆರೆಯಿರಿ', 'nav.closeMenu': 'ಮೆನು ಮುಚ್ಚಿ', 'nav.language': 'ಭಾಷೆ ಬದಲಿಸಿ',
  'nav.skip': 'ನೇರವಾಗಿ ವಿಷಯಕ್ಕೆ ಹೋಗಿ',
  'ask.label': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ', 'ask.placeholder': 'ಉದಾ.: ಮಕ್ಕಳ ಓದುವಿಕೆ ದುರ್ಬಲತೆ',
  'ask.help': 'Enter ಒತ್ತಿದರೂ ಕಳುಹಿಸಬಹುದು.', 'ask.send': 'ಕೇಳಿ', 'ask.sending': 'ಯೋಚಿಸುತ್ತಿದೆ…',
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
  'reviews.title': 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ', 'reviews.submit': 'ಕಳುಹಿಸಿ',
  'language.choose': 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', 'language.articlesIn': 'ಈ ಲೇಖನ ಹಿಂದಿಯಲ್ಲಿದೆ.',
};

const MALAYALAM: Record<string, string> = {
  'nav.home': 'ഹോം', 'nav.tribute': 'സ്മരണം', 'nav.help': 'സഹായം', 'nav.reference': 'വിവരം',
  'nav.reviews': 'അഭിപ്രായം', 'nav.support': 'സഹായിക്കൂ', 'nav.menu': 'മെനു',
  'nav.openMenu': 'മെനു തുറക്കുക', 'nav.closeMenu': 'മെനു അടയ്ക്കുക', 'nav.language': 'ഭാഷ മാറ്റുക',
  'ask.label': 'നിങ്ങളുടെ പ്രശ്നം എഴുതുക അല്ലെങ്കിൽ പറയുക',
  'ask.placeholder': 'ഉദാ: കുട്ടിയുടെ പഠനത്തിൽ കുറവ്',
  'ask.help': 'Enter അമർത്തിയാലും അയയ്ക്കാം.', 'ask.send': 'ചോദിക്കുക', 'ask.sending': 'ചിന്തിക്കുന്നു…',
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
  'reviews.title': 'നിങ്ങളുടെ അഭിപ്രായം', 'reviews.submit': 'അയയ്ക്കുക',
  'language.choose': 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക', 'language.articlesIn': 'ഈ ലേഖനം ഹിന്ദിയിലാണ്.',
};

const PUNJABI: Record<string, string> = {
  'nav.home': 'ਹੋਮ', 'nav.tribute': 'ਸਮਰਨ', 'nav.help': 'ਮਦਦ', 'nav.reference': 'ਜਾਣਕਾਰੀ',
  'nav.reviews': 'ਰਾਇ', 'nav.support': 'ਮਦਦ ਕਰੋ', 'nav.menu': 'ਮੀਨੂ',
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
  'reviews.title': 'ਤੁਹਾਡੀ ਰਾਇ', 'reviews.submit': 'ਭੇਜੋ',
  'language.choose': 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', 'language.articlesIn': 'ਇਹ ਲੇਖ ਹਿੰਦੀ ਵਿੱਚ ਹੈ।',
};

const URDU: Record<string, string> = {
  'nav.home': 'ہوم', 'nav.tribute': 'یادگار', 'nav.help': 'مدد', 'nav.reference': 'تعارف',
  'nav.reviews': 'آراء', 'nav.support': 'مدد کریں', 'nav.menu': 'مینو',
  'nav.openMenu': 'مینو کھولیں', 'nav.closeMenu': 'مینو بند کریں', 'nav.language': 'زبان بدلیں',
  'ask.label': 'اپنا مسئلہ لکھیں یا بولیں', 'ask.placeholder': 'مثلاً: بچے کے پڑھائی میں کمزوری',
  'ask.help': 'Enter دبائ کر بھی بھیج سکتے ہیں۔', 'ask.send': 'پوچھیں', 'ask.sending': 'سوچ رہے ہیں…',
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
  'reviews.title': 'آپ کی رائے', 'reviews.submit': 'بھیجیں', 'reviews.comment': 'آپ کی بات',
  'language.choose': 'اپنی زبان منتخب کریں', 'language.articlesIn': 'یہ مضمون ہندی میں ہے۔',
};

const ARABIC: Record<string, string> = {
  'nav.home': 'الرئيسية', 'nav.tribute': 'ذكرى', 'nav.help': 'مساعدة', 'nav.reference': 'تعريف',
  'nav.reviews': 'آراء', 'nav.support': 'ادعمونا', 'nav.menu': 'القائمة',
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
  'reviews.title': 'رأيك', 'reviews.submit': 'إرسال', 'reviews.comment': 'ما تريد قوله',
  'language.choose': 'اختر لغتك', 'language.articlesIn': 'هذه المقالة بالهندية.',
};

const SPANISH: Record<string, string> = {
  'nav.home': 'Inicio', 'nav.tribute': 'En memoria', 'nav.help': 'Ayuda', 'nav.reference': 'Acerca de',
  'nav.reviews': 'Opiniones', 'nav.support': 'Apóyenos', 'nav.menu': 'Menú',
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
  'reviews.title': 'Su opinión', 'reviews.submit': 'Enviar', 'reviews.comment': 'Lo que quiera decir',
  'language.choose': 'Elija su idioma', 'language.articlesIn': 'Este artículo está en hindi.',
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

export { HINDI, ENGLISH };
