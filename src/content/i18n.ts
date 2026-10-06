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

  'ask.welcome': 'স্বাগতম! নিচে আপনার সমস্যা লিখুন বা একটি বিষয় বেছে নিন।',

  'ref.notTitle': 'যা এটি করে না',

  'ref.not1': 'এটি ডাক্তার নয়। কখনও ওষুধের পরামর্শ দেয় না।',

  'ref.not2': 'এটি আইনজীবী নয়। কোনো আইনি পরামর্শ দেয় না।',

  'ref.not3': 'এটি কোনো টাকা নেয় না এবং কোনো বিজ্ঞাপন দেখায় না।',

  'ref.not4': 'এটি কখনও আপনার নাম, ঠিকানা বা ফোন নম্বর চায় না, আর রাখেও না।',

  'ref.not5': 'এটি কোনো সরকারি প্রকল্পের নাম, হেল্পলাইন নম্বর বা দাম বানায় না — জানা না থাকলে স্পষ্ট করে বলে।',

  'ref.medicalTitle': 'গুরুত্বপূর্ণ: এটি চিকিৎসা পরামর্শ নয়',

  'ref.medicalBody': 'অসুস্থতা, ওষুধ বা বিষাক্ত কিছু নিয়ে কোনো কথা হলে আগে ডাক্তারের সাথে দেখা করুন। এখানে দেওয়া তথ্য শুধু সাধারণ সাহায্যের জন্য। শিশুর টিকা, গর্ভাবস্থা, বা যেকোনো ওষুধ শুরু করার আগে ডাক্তারের পরামর্শ নিন।',

  'ref.statsTitle': 'কতটা তথ্য আছে',

  'support.howTitle': 'আপনি কীভাবে সাহায্য করতে পারেন',

  'support.alwaysFreeTitle': 'এই পরিষেবা সবসময় বিনামূল্যে থাকবে',

  'support.alwaysFreeBody': 'যে সাহায্য আসবে, তা সেবা চালানোতেই ব্যয় হবে। কারও কাছ থেকে কখনও টাকা নেওয়া হবে না।',

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

  'reviews.averageOutOf': '5 এর মধ্যে {value} তারা',

  'dhun.welcomeTitle': 'স্বাগতম',

  'dhun.consent': 'শঙ্খ, বাঁশি ও নাগাদা একসাথে। শুনতে ছুঁয়ে দিন।',

  'dhun.failed': 'ধ্বনি বাজানো যায়নি।',

  'dhun.unsupported': 'এই ব্রাউজ़ার ধ্বনি বাজাতে পারে না।',

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

  'ask.serviceNote': 'এটি সেবা সম্পর্কিত উত্তর।',

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

  'ask.welcome': 'வரவேற்கிறோம்! கீழே உங்கள் பிரச்சினையை எழுதுங்கள் அல்லது ஒரு விஷயத்தைத் தேர்ந்தெடுங்கள்.',

  'ref.notTitle': 'இது என்ன செய்வதில்லை',

  'ref.not1': 'இது மருத்துவர் அல்ல. மருந்துகள் பற்றிய ஆலோசனை ஒருபோதும் தரப்படுவதில்லை.',

  'ref.not2': 'இது வழக்கமாற்றுபவர் அல்ல. சட்ட ஆலோசனை வழங்குவதில்லை.',

  'ref.not3': 'இது பணம் ஏற்காது, விளம்பரமும் காட்டாது.',

  'ref.not4': 'இது உங்கள் பெயர், முகவரி அல்லது தொலைபேசி எண்ணை ஒருபோதும் கேட்காது, சேமிப்பதுமில்லை.',

  'ref.not5': 'அரசு திட்டத்தின் பெயர், உதவி எண் அல்லது விலையை இது உருவாக்காது — தெரியாவிட்டால் தெளிவாகச் சொல்லும்.',

  'ref.medicalTitle': 'முக்கியம்: இது மருத்துவ ஆலோசனை அல்ல',

  'ref.medicalBody': 'நோய், மருந்து அல்லது நஞ்சு தொடர்பான எதுவும் இருந்தால் முதலில் மருத்துவரைச் சந்தியுங்கள். இங்கு தரப்படும் தகவல் பொதுவான உதவிக்கு மட்டுமே. குழந்தையின் தடுப்பு உinject, கர்ப்ப காலம், அல்லது எந்த மருந்தையும் தொடங்குவத前的 மருத்துவர் ஆலோசனை பெறுங்கள்.',

  'ref.statsTitle': 'எவ்வளவு தகவல் உள்ளது',

  'support.howTitle': 'நீங்கள் எப்படி உதவ முடியும்',

  'support.alwaysFreeTitle': 'இந்த சேவை எப்போதும் இலவசமாக இருக்கும்',

  'support.alwaysFreeBody': 'கிடைக்கும் உதவி சேவையை இயக்குவதற்கே பயன்படும். யாரிடமிருந்தும் ஒருபோதும் பணம் வசிக்கப்படாது.',

  'smriti.eyebrow': 'நினைவில்',

  'smriti.whyTitle': 'இந்த தளம் ஏன் உள்ளது',

  'smriti.ending': 'அவரது போராட்டம் இங்கே தொடர்கிறது.',

  'article.askAny': 'ஒரு கேள்வி கேளுங்கள்',

  'article.remember': 'நினைவில் கொள்ளுங்கள்',

  'article.emergencyInfo': 'முக்கிய தகவல்',

  'article.medicalTitle': 'இது மருத்துவ ஆலோசனை அல்ல',

  'article.medicalBody': 'இந்தத் தகவல் பொதுவான உதவிக்கு மட்டும். டாக்டரிடம் கேட்காமல் எந்த மருந்தையும் தொடங்காதீர்கள் அல்லது நிறுத்தாதீர்கள்.',

  'article.heading': '{category} பற்றிய கட்டுரைகள்',

  'reviews.rateQuestion': 'எத்தனை நட்சத்திரங்கள் தருவீர்கள்?',

  'reviews.starsShort': '{value} நட்சத்திரங்கள்',

  'reviews.averageOutOf': '5 இல் {value} நட்சத்திரங்கள்',

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

  'ask.serviceNote': 'இது சேவை தொடர்பான பதில்.',

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

  'ask.welcome': 'స్వాగతం! కింద మీ సమస్యను రాయండి లేదా ఒక అంశాన్ని ఎంచుకోండి.',

  'ref.notTitle': 'ఇది ఏమి చేయదు',

  'ref.not1': 'ఇది వైద్యుడు కాదు. మందుల గురించి ఎప్పుడూ సలహా ఇవ్వదు.',

  'ref.not2': 'ఇది న్యాయవాది కాదు. చట్టపరచnameless సలహా ఇవ్వదు.',

  'ref.not3': 'ఇది డబ్బు తీసుకోదు, ప్రకటనలు కూడా చూపదు.',

  'ref.not4': 'ఇది మీ పేరు, చిరునామా ఫోన్ నంబర్‌ను ఎప్పుడూ అడగదు, భద్రపరచదు.',

  'ref.not5': 'ఇది ప్రభుత్వ పథకం పేరు, సహాయక వర్గ్ సంఖ్య లేదా ధరను అ Invent చేయదు — తెలియకపోతే స్పష్టంగా చెబుతుంది.',

  'ref.medicalTitle': 'ముఖ్యం: ఇది వైద్య సలహా కాదు',

  'ref.medicalBody': 'అనారోగ్యం, మందులు లేదా విషం గురించి ఏదైనా అయితే మొదట వైద్యుడిని కలవండి. ఇక్కడ ఇవ్వబడిన సమాచారం సాధారణ సహాయం మాత్రమే. పిల్లల టీకా, గర్భధారణ, లేదా ఏ మందులను ప్రారంభించే ముందు వైద్య సలహా తీసుకోండి.',

  'ref.statsTitle': 'ఎంత సమాచారం ఉంది',

  'support.howTitle': 'మీరు ఎలా సహాయం చేయగలరు',

  'support.alwaysFreeTitle': 'ఈ సేవ ఎప్పుడూ ఉచితంగా ఉంటుంది',

  'support.alwaysFreeBody': 'వచ్చే సహాయం సేవను నడపడానికే వాడబడుతుంది. ఎవరి నుండీ ఎప్పుడూ డబ్బు తీసుకోబడ్డు.',

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

  'reviews.averageOutOf': '5 లో {value} నక్షత్రాలు',

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

  'ask.serviceNote': 'ఇది సేవకు సంబంధించిన సమాధానం.',

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

  'ask.welcome': 'स्वागत आहे! खाली तुमची समस्या लिहा किंवा एक विषय निवडा.',

  'ref.notTitle': 'हे काय करत नाही',

  'ref.not1': 'हे डॉक्टर नाही. औषधांचा सल्ला कधीही दिला जात नाही.',

  'ref.not2': 'हे वकील नाहीत. कायदेशीर सल्ला दिला जात नाही.',

  'ref.not3': 'हे पैसे घेत नाही, जाहिरातही दाखवत नाही.',

  'ref.not4': 'हे तुमचे नाव, पत्ता किंवा फोन नंबर कधीही विचारत नाही, ठेवतही नाही.',

  'ref.not5': 'सरकारी योजनेचे नाव, मदतवाहिनी क्रमांक किंवा दाम हे कधीही बनवत नाही — माहीत नसेल्यास स्पष्ट सांगते.',

  'ref.medicalTitle': 'महत्त्वाचे: हे डॉक्टरचा सल्ला नाही',

  'ref.medicalBody': 'आजार, औषध किंवा विषारी पदार्थांच्या बाबतीत काही असेल तर आधी डॉक्टरांना भेटा. येथील माहिती फक्त सामान्य मदतीसाठी आहे. मुलांचा लस, गरोदरपण, किंवा कोणतेही औषध सुरू करण्यापूर्वी डॉक्टरांचा सल्ला घ्या.',

  'ref.statsTitle': 'किती माहिती उपलब्ध आहे',

  'support.howTitle': 'तुम्ही कसे मदत करू शकता',

  'support.alwaysFreeTitle': 'ही सेवा नेहमी विनामूल्य राहील',

  'support.alwaysFreeBody': 'जे मदत मिळेली ती सेवा चालवण्यात वापरली जाईल. कोणाच्याही जागून पैसे घेतले जाणार नाहीत.',

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

  'reviews.averageOutOf': '5 पैकी {value} तारे',

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

  'ask.serviceNote': 'हे सेवेसंबंधी उत्तर आहे.',

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

  'ask.welcome': 'સ્વાગત છે! નીચે તમારી સમસ્યા લખો અથવા એક વિષય પસંદ કરો.',

  'ref.notTitle': 'આ શું કરતું નથી',

  'ref.not1': 'આ ડૉક્ટર નથી. દવાની સલાહ ક્યારેય આપવામાં આવતી નથી.',

  'ref.not2': 'આ વકીલ નથી. કાનૂની સલાહ આપવામાં આવતી નથી.',

  'ref.not3': 'આ પૈસા લેતું નથી અને જાહેરાત બતાવતું નથી.',

  'ref.not4': 'આ તમારું નામ, સરનામું કે ફોન નંબર ક્યારેય પૂછતું નથી, કે રાખતું નથી.',

  'ref.not5': 'સરકારી યોજનાનું નામ, મદદ નંબર કે ભાવ આ ક્યારેય બનાવતું નથી — માહિતી ન હોય તો સ્પષ્ટ કહે છે.',

  'ref.medicalTitle': 'મહત્વનું: આ ડૉક્ટરની સલાહ નથી',

  'ref.medicalBody': 'બીમારી, દવા કે ઝેરી વસ્તુ વિશે કોઈ વાત હોય તો પહેલાં ડૉક્ટરને મળો. અહીં આપેલ માહિતી ફક્ત સામાન્ય મદદ માટે છે. બાળનું રસીકરણ, સગર્ભાવસ્થા, કે કોઈપણ દવા શરૂ કરતાં પહેલાં ડૉક્ટરની સલાહ લો.',

  'ref.statsTitle': 'કેટલી માહિતી ઉપલબ્ધ છે',

  'support.howTitle': 'તમે કેવી રીતે મદદ કરી શકો',

  'support.alwaysFreeTitle': 'આ સેવા હંમેશા મફત રહેશે',

  'support.alwaysFreeBody': 'જે મદદ મળશે તે સેવા ચલાવવા માટે વાપરાશે. કોઈના પૈસા ક્યારેય લેવામાં આવશે નહીં.',

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

  'reviews.averageOutOf': '5 માંથી {value} તારા',

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

  'ask.serviceNote': 'આ સેવા સંબંધી જવાબ છે.',

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

  'voice.audioCapture': 'માઇક મળ્યો નહીં. ઉપकरણ જોડો, અથવા લખીને પૂછો.',

  'voice.generic': 'કંઈક ગડબડ થઈ. ફરી પ્રયત્ન કરો.',

  'voice.network': 'બોલીને પૂછવા ઇન્ટરનેટ જોઈએ, પણ તે ચાલુ નથી. લખીને પૂછો — એ જ જવાબ મળશે.',

  'voice.noSpeech': 'કોઈ અવાજ સુધરાયો નહીં. માઇક પાસે બોલો, અથવા લખો.',

  'voice.notAllowed': 'માઇકની પરવાનગી મળી નથી. ઉપર જઈને પરવાનગી આપો, અથવા લખીને પૂછો.',

  'voice.serviceNotAllowed': 'માઇકની પરવાનગી મળી નથી. ઉપર જઈને પરવાનગી આપો, અથવા લખીને પૂછો.',

  'voice.speakFailed': 'આ જવાબ વાંચીને સાંભળવામાં આવ્યું નહીં.',

  'voice.unsupported': 'આ બ્રાઉઝરમાં બોલીને પૂછવાનું કામ નહીં કરે. લખીને પૂછો.',

  'ask.notConfigured': 'આ સેવા હાલ સચવાયેલા જવાબોના ભંડોળમાંથી જવાબ આપી રહી છે. તમારો પ્રશ્ન તેમાં નથી.',

  'ask.browseTitle': 'અહીં જે લેખ છે તે જુઓ',

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

  'ask.welcome': 'ಸ್ವಾಗತ! ಕೆಳಗೆ ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಒಂದು ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',

  'ref.notTitle': 'ಇದು ಏನು ಮಾಡುವುದಿಲ್ಲ',

  'ref.not1': 'ಇದು ವೈದ್ಯರು ಅಲ್ಲ. ಔಷಧಿಗೆ ಸಲಹೆ ಎಂದಿಗೂ ಕೊಡುವುದಿಲ್ಲ.',

  'ref.not2': 'ಇದು ವಕೀಲ ಅಲ್ಲ. ಕಾನೂನು ಸಲಹೆ ನೀಡುವುದಿಲ್ಲ.',

  'ref.not3': 'ಇದು ಹಣ ತೆಗೆಯುವುದಿಲ್ಲ, ಜಾಹೀರಾತು ತೋರಿಸುವುದಿಲ್ಲ.',

  'ref.not4': 'ಇದು ನಿಮ್ಮ ಹೆಸರು, ವಿಳಾಸ ಅಥವಾ ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ಎಂದಿಗೂ ಕೇಳುವುದಿಲ್ಲ, ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.',

  'ref.not5': 'ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಹೆಸರು, ಸಹायಕ ಸಂಖ್ಯೆ ಅಥವಾ ಬೆಲೆಯನ್ನು ಇದು ಕಾಲ್ಪಡಿಸುವುದಿಲ್ಲ — ಗೊತ್ತಿಲ್ಲದಿದ್ದರೆ ಸ್ಪಷ್ಟವಾಗೆ ಹೇಳುತ್ತದೆ.',

  'ref.medicalTitle': 'ಮುಖ್ಯ: ಇದು ವೈದ್ಯ ಸಲಹೆ ಅಲ್ಲ',

  'ref.medicalBody': 'ಅನಾರೋಗ್ಯ, ಔಷಧ ಅಥವಾ ವಿಷದ ವಿಷಯವಾದಿದ್ದರೆ ಮೊದಲು ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ. ಇಲ್ಲಿ ನೀಡಿದ ಮಾಹಿತಿ ಕೇವಲ ಸಾಮಾನ್ಯ ಸಹಾಯಕ್ಕೆ. ಮಕುಗಳ ಲಸಿಕೆ, ಗರ್ಭಿಣಿ, ಅಥವಾ ಯಾವುದೇ ಔಷಧ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.',

  'ref.statsTitle': 'ಎಷ್ಟು ಮಾಹಿತಿ ಇದೆ',

  'support.howTitle': 'ನೀವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು',

  'support.alwaysFreeTitle': 'ಈ ಸೇವೆಯು ಯಾವಾಗಲೂ ಉಚಿತವಾಗಿರುತ್ತದೆ',

  'support.alwaysFreeBody': 'ಸಿಕ್ಕುವ ಸಹಾಯ ಸೇವೆಯನ್ನು ನಡೆಸಲು ಬಳಸಲಾಗುತ್ತದೆ. ಯಾರಿಂದೂ ಎಂದಿಗೂ ಹಣವನ್ನು ಪಡೆಯುವುದಿಲ್ಲ.',

  'smriti.eyebrow': 'ಸ್ಮರಣದಲ್ಲಿ',

  'smriti.whyTitle': 'ಈ ಸೈಟ್ ಏಕೆ ಇದೆ',

  'smriti.ending': 'ಅವಳ ಹೋರಾಟ ಇಲ್ಲಿಯೇ ಮುಂದುವರೆದುಕೊಳ್ಳುತ್ತದೆ.',

  'article.askAny': 'ಒಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ',

  'article.remember': 'ನೆನಪಿಡಿ',

  'article.emergencyInfo': 'ಮುಖ್ಯ ಮಾಹಿತಿ',

  'article.medicalTitle': 'ಇದು ವೈದ್ಯ ಸಲಹೆ ಅಲ್ಲ',

  'article.medicalBody': 'ಈ ಮಾಹಿತಿ ಸಾಮಾನ್ಯ ಸಹಾಯಕ್ಕೆ. ವೈದ್ಯರ ಸಲಹೆ ಇಲ್ಲದೆ ಯಾವುದೇ ಔಷಧ ಪ್ರಾರಂಭಿಸಬೇಡಿ ಅಥವಾ ನಿಲ್ಲಿಸಬೇಡಿ.',

  'article.heading': '{category} ಬಗ್ಗೆ ಲೇಖನಗಳು',

  'reviews.rateQuestion': 'ಎಷ್ಟು ನಕ್ಷತ್ರಗಳನ್ನು ನೀಡುತ್ತೀರಿ?',

  'reviews.starsShort': '{value} ನಕ್ಷತ್ರಗಳು',

  'reviews.averageOutOf': '5 ರಲ್ಲಿ {value} ನಕ್ಷತ್ರಗಳು',

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

  'ask.serviceNote': 'ಇದು ಸೇವೆಯ ಸಂಬಂಧದ ಉತ್ತರ.',

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

  'ask.welcome': 'സ്വാഗതം! താഴെ നിങ്ങളുടെ പ്രശ്നം എഴുതുക അല്ലെങ്കിൽ ഒരു വിഷയം തിരഞ്ഞെടുക്കുക.',

  'ref.notTitle': 'ഇത് ചെയ്യാത്തത്',

  'ref.not1': 'ഇത് ഡോക്ടറല്ല. മരുന്നുകളെക്കുറിച്ച് ഒരിക്കലും നിർദ്ദേശം നൽകില്ല.',

  'ref.not2': 'ഇത് വകീലല്ല. നിയമപരിശോധനയുടെ നിർദ്ദേശങ്ങൾ നൽകില്ല.',

  'ref.not3': 'ഇത് പണം എടുക്കുന്നില്ല, വിളംപരം കാണിക്കുന്നുമില്ല.',

  'ref.not4': 'ഇത് നിങ്ങളുടെ പേരോ വിലാസമോ ഫോൺ നമ്പറോ ഒരിക്കലും ചോദിക്കില്ല, സൂക്ഷിക്കുന്നുമില്ല.',

  'ref.not5': 'സർക്കാർ പദ്ധതിയുടെ പേരോ സഹായനമ്പർ നമ്പറോ വിലയോ ഇത് ഉണ്ടാക്കില്ല — അറിയാമെങ്കിൽ വ്യക്തമായി പറയും.',

  'ref.medicalTitle': 'പ്രധാനം: ഇത് മെഡിക്കൽ നിർദ്ദേശമല്ല',

  'ref.medicalBody': 'രോഗം, മരുന്ന് അല്ലെങ്കിൽ വിഷം എന്നിവയുമായി ബന്ധപ്പെട്ടതാണെങ്കിൽ ആദ്യം ഡോക്ടറെ കാണുക. ഇവിടെ നൽകിയ വിവരങ്ങൾ പൊതുവായ സഹായത്തിനായി മാത്രമാണ്. കുഞ്ഞിന്റെ വാക്സീൻ, ഗർഭകാലം, അല്ലെങ്കിൽ ഏതെങ്കിലും മരുന്ന് തുടങ്ങുന്നതിന് മുമ്പ് ഡോക്ടറുടെ നിർദ്ദേശം എടുക്കുക.',

  'ref.statsTitle': 'എത്ര വിവരങ്ങളുണ്ട്',

  'support.howTitle': 'നിങ്ങൾ എങ്ങനെ സഹായിക്കാം',

  'support.alwaysFreeTitle': 'ഈ സേവനം എപ്പോഴും സൗജന്യമായിരിക്കും',

  'support.alwaysFreeBody': 'ലഭിക്കുന്ന സഹായം സേവനം നടത്താൻ ഉപയോഗിക്കും. ആരോടും ഒരിക്കലും പണം ആവശ്യമാക്കില്ല.',

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

  'reviews.averageOutOf': '5 ൽ {value} നക്ഷത്രങ്ങൾ',

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

  'ask.serviceNote': 'ഇത് സേവനവുമായി ബന്ധപ്പെട്ട ഉത്തരമാണ്.',

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

  'ask.welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ ਸਵਾਗਤ ਹੈ! ਹੇਠ ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ ਜਾਂ ਇੱਕ ਵਿਸ਼ਾ ਚੁਣੋ.',

  'ref.notTitle': 'ਇਹ ਕੀ ਨਹੀਂ ਕਰਦੀ',

  'ref.not1': 'ਇਹ ਡਾਕਟਰ ਨਹੀਂ। ਦਵਾ ਦੀ ਸਲਾਹ ਕਦੇ ਨਹੀਂ ਦਿੰਦੀ।',

  'ref.not2': 'ਇਹ ਵਕੀਲ ਨਹੀਂ। ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ ਦਿੰਦੀ।',

  'ref.not3': 'ਇਹ ਪੈਸੇ ਨਹੀਂ ਲੈਂਦੀ ਅਤੇ ਇਸਤਿਹਾਨ ਨਹੀਂ ਦਿਖਾਉਂਦੀ।',

  'ref.not4': 'ਇਹ ਤੁਹਾਡਾ ਨਾਮ, ਪਤਾ ਜਾਂ ਫ਼ੋਨ ਨੰਬਰ ਕਦੇ ਨਹੀਂ ਪੁੱਛਦੀ, ਅਤੇ ਨਹੀਂ ਰੱਖਦੀ।',

  'ref.not5': 'ਸਰਕਾਰੀ ਯੋਜਨਾ ਦਾ ਨਾਮ, ਮਦਦ ਨੰਬਰ ਜਾਂ ਕੀਮਤ ਇਹ ਕਦੇ ਨਹੀਂ ਬਣਾਉਂਦੀ — ਪਤਾ ਨਾ ਲੱਗੇ ਤਾਂ ਸਾਫ਼ ਦੱਸਦੀ ਹੈ।',

  'ref.medicalTitle': 'ਜ਼ਰੂਰੀ: ਇਹ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਨਹੀਂ',

  'ref.medicalBody': 'ਬੀਮਾਰੀ, ਦਵਾ ਜਾਂ ਜ਼ਹਿਰਲੀ ਚੀਜ਼ ਬਾਰੇ ਕੋਈ ਗੱਲ ਹੋਵੇ ਤਾਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਨਾਲ ਮਿਲੋ। ਇੱਥੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਆਮ ਮਦਦ ਲਈ ਹੈ। ਬੱਚੇ ਦੀ ਟੀਕਾ, ਗਰਭਾਵਸਥਾ, ਜਾਂ ਕੋਈ ਵੀ ਦਵਾ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।',

  'ref.statsTitle': 'ਕਿੰਨੀ ਜਾਣਕਾਰੀ ਉਪਲਬਧ ਹੈ',

  'support.howTitle': 'ਤੁਸੀਂ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ',

  'support.alwaysFreeTitle': 'ਇਹ ਸੇਵਾ ਹਮੇਸ਼ਾ ਮੁਫ਼ਤ ਰਹੇਗੀ',

  'support.alwaysFreeBody': 'ਜੋ ਮਦਦ ਮਿਲੇ ਉਹ ਸੇਵਾ ਚਲਾਉਣ ਲਈ ਵਰਤੀ ਜਾਵੇਗੀ। ਕਿਸੇ ਤੋਂ ਕਦੇ ਪੈਸੇ ਨਹੀਂ ਲਏ ਜਾਣਗੇ।',

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

  'ask.help': 'Enter ਦਬਾ ਕੇ ਵੀ ਭੇਜ ਸਕਦੇ ਹੋ।',

  'ask.listening': 'ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ…',

  'ask.micUnsupported': 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਬੋਲ ਕੇ ਪੁੱਛਣਾ ਕੰਮ ਨਹੀਂ ਕਰੇਗਾ। ਲਿਖ ਕੇ ਪੁੱਛੋ।',

  'ask.notAnswer': 'ਇਸ ਸਵਾਲ ਦਾ ਸਿੱਧਾ ਜਵਾਬ ਸਾਡੇ ਕੋਲ ਨਹੀਂ ਹੈ।',

  'ask.serviceNote': 'ਇਹ ਸੇਵਾ ਸੰਬੰਧੀ ਜਵਾਬ ਹੈ।',

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

  'ask.welcome': 'خوش آمدید! نیچے اپنا مسئلہ لکھیں یا کوئی موضوع منتخب کریں۔',

  'ref.notTitle': 'یہ کیا نہیں کرتی',

  'ref.not1': 'یہ ڈاکٹر نہیں ہے۔ دوا کے بارے میں کبھی مشورہ نہیں دیا جاتا۔',

  'ref.not2': 'یہ وکیل نہیں ہے۔ قانونی مشورہ نہیں دیا جاتا۔',

  'ref.not3': 'یہ پیسہ نہیں لیتی اور اشتہار نہیں دکھاتی۔',

  'ref.not4': 'یہ کبھی آپ کا نام، پتہ یا فون نمبر نہیں پوچھتی اور نہ رکھتی۔',

  'ref.not5': 'یہ کسی سرکاری منصوبے کا نام، ہیلپ لائن نمبر یا قیمت نہیں بناتی — معلوم نہ ہو تو صاف کہہ دیتی ہے۔',

  'ref.medicalTitle': 'ضروری: یہ ڈاکٹر کی مشورہ نہیں',

  'ref.medicalBody': 'بیماری، دوا یا کسی زہریلی چیز سے متعلق بات हो تو پہلے ڈاکٹر سے ملیں۔ یہاں دی گئی معلومات صرف عام مدد کے لیے ہے۔ بچے کی ویکسین، حاملگی، یا کوئی بھی دوا شروع کرنے سے پہلے ڈاکٹر کی مشورہ ضرور لیں۔',

  'ref.statsTitle': 'کتنی معلومات موجود ہیں',

  'support.howTitle': 'آپ کیسے مدد کر سکتے ہیں',

  'support.alwaysFreeTitle': 'یہ خدمت ہمیشہ مفت رہے گی',

  'support.alwaysFreeBody': 'جو مدد ملے گی وہ خدمت چلانے میں لگے گی۔ کسی سے کبھی پیسے نہیں لیے جائیں گے۔',

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

  'dhun.consent': 'شاخ، bansuri اور ڈھول مل کر۔ سننے کے لیے چھوئیں۔',

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

  'ask.serviceNote': 'یہ خدمت سے متعلق جواب ہے۔',

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

  'voice.speakFailed': 'یہ جواب پڑھ کر سنायا نہیں جا سکا۔',

  'voice.unsupported': 'اس براؤزر میں بول کر پوچھنا کام نہیں کرے گا۔ لکھ کر پوچھیں۔',

  'ask.notConfigured': 'یہ خدمت اِس وقت محفوظ جوابات کے ذخیرے سے جواب دے رہی ہے۔ آپ کا سوال اس میں نہیں ملا۔',

  'ask.browseTitle': 'یہاں جو مضامین ہیں وہ دیکھیں',

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

  'ask.welcome': 'مرحبًا! اكتب مشكلتك في الأسفل أو اختر موضوعًا.',

  'ref.notTitle': 'ما لا تفعله',

  'ref.not1': 'هذه ليست طبيبًا. لا تقدم نصيحة عن الأدوية أبدًا.',

  'ref.not2': 'هذا ليس محاميًا. لا تقدم استشارة قانونية.',

  'ref.not3': 'لا تأخذ مالًا ولا تعرض إعلانات.',

  'ref.not4': 'لا تسأل عن اسمك أو عنوانك أو رقم هاتفك، ولا تحفظها.',

  'ref.not5': 'لا تختلق اسم مشروع حكومي أو رقم خط مساعدة أو سعرًا. وإن لم تعرف فتقول ذلك بوضوح.',

  'ref.medicalTitle': 'مهم: هذه ليست نصيحة طبية',

  'ref.medicalBody': 'في أي أمر يتعلق بالمرض أو الأدوية أو السموم، راجع طبيبًا أولًا. المعلومات هنا مساعدة عامة فقط. خذ نصيحة طبية قبل تطعيم الطفل أو أثناء الحمل أو قبل بدء أي دواء.',

  'ref.statsTitle': 'كم من المعلومات متاح',

  'support.howTitle': 'كيف يمكنك المساعدة',

  'support.alwaysFreeTitle': 'ستبقى هذه الخدمة مجانية دائمًا',

  'support.alwaysFreeBody': 'كل مساعدة تأتي ستُنفق على تشغيل الخدمة. لن يُطلب المال من أحد أبدًا.',

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

  'ask.serviceNote': 'هذه إجابة informacyjna عن الخدمة.',

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

  'ask.welcome': '¡Bienvenido! Escribe tu problema abajo o elige un tema.',

  'ref.notTitle': 'Lo que no hace',

  'ref.not1': 'Esto no es un médico. Nunca da consejos sobre medicamentos.',

  'ref.not2': 'Esto no es un abogado. No da asesoramiento legal.',

  'ref.not3': 'No cobra dinero ni muestra publicidad.',

  'ref.not4': 'Nunca pide tu nombre, dirección ni teléfono, ni los guarda.',

  'ref.not5': 'No inventa nombres de programas, números de ayuda ni precios. Si no lo sabe, lo dice.',

  'ref.medicalTitle': 'Importante: esto no es consejo médico',

  'ref.medicalBody': 'Para cualquier cosa relacionada con enfermedad, medicamentos o veneno, consulta primero a un médico. Aquí solo hay ayuda general. Pide consejo médico antes de vaccinar a un niño, durante el embarazo o antes de empezar cualquier medicamento.',

  'ref.statsTitle': 'Cuánta información hay',

  'support.howTitle': 'Cómo puedes ayudar',

  'support.alwaysFreeTitle': 'Este servicio siempre será gratuito',

  'support.alwaysFreeBody': 'Toda la ayuda que llegue se usará para mantener el servicio en marcha. Nunca se le pedirá dinero a nadie.',

  'smriti.eyebrow': 'En memoria',

  'smriti.whyTitle': 'Por qué existe este sitio',

  'smriti.ending': 'Su lucha continúa aquí.',

  'article.askAny': 'Haz una pregunta',

  'article.remember': 'Recuerda',

  'article.emergencyInfo': 'Información importante',

  'article.medicalTitle': 'Esto no es consejo médico',

  'article.medicalBody': 'Esta información es ayuda general. No empieces ni dejes ninguna medicina sin un médico.',

  'article.heading': 'Artículos sobre {category}',

  'reviews.rateQuestion': '¿Cuántas estrellas daría?',

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

  'ask.serviceNote': 'Esta es una respuesta informativa sobre el servicio.',

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
