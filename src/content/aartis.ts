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
 * ── The five with no recording yet ─────────────────────────────────────────
 *
 * लवथवती विक्राळा, ॐ जय शिव ओंकारा, ॐ जय लक्ष्मी माता, युगे अठ्ठावीस and दुर्गे
 * दुर्घट भारी have no free recording on the site, so their words were taken
 * from published texts and checked against a second source:
 *
 *   • लवथवती विक्राळा — Drik Panchang (Marathi) and the Marathi Wikipedia page
 *     "मराठी आरत्या", which agree line for line.
 *   • ॐ जय शिव ओंकारा — Drik Panchang (Hindi), completed from the Hindi
 *     Wikipedia page "शिव की आरती" for the verses it carries.
 *   • ॐ जय लक्ष्मी माता — Drik Panchang (Hindi).
 *   • युगे अठ्ठावीस, दुर्गे दुर्घट भारी — the Marathi Wikipedia page
 *     "मराठी आरत्या", with its typos corrected against the metre.
 *
 * They are here because the owner asked for Shankar's Marathi aarti and got a
 * list of names instead of the aarti. A missing text is now the exception, not
 * the rule.
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
  /**
   * True when these words were checked against the recording that plays on
   * `/aarti`. False (absent) means there is no free recording yet and the text
   * was checked against published collections instead.
   */
  withRecording?: boolean;
  /** The words, in order, with an empty string where a verse breaks. */
  lines: string[];
}

export const AARTIS: AartiText[] = [
  {
    slug: 'aarti-sukhkarta-dukhharta',
    name: 'सुखकर्ता दुःखहर्ता',
    sungIn: 'मराठी',
    dedication: 'श्री गणपतीची आरती',
    withRecording: true,
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
    withRecording: true,
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
    withRecording: true,
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
    withRecording: true,
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
    withRecording: true,
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
    withRecording: true,
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
  {
    slug: 'aarti-lavthavati-vikrala',
    name: 'लवथवती विक्राळा',
    sungIn: 'मराठी',
    dedication: 'श्री शंकराची आरती',
    lines: [
      'लवथवती विक्राळा ब्रह्मांडी माळा ।',
      'विषे कंठ काळा त्रिनेत्री ज्वाळा ।',
      'लावण्य सुंदर मस्तकी बाळा ।',
      'तेथुनिया जळ निर्मळ वाहे झुळझुळा ॥ १ ॥',
      '',
      'जय देव जय देव जय श्रीशंकरा ।',
      'आरती ओवाळू तुज कर्पूरगौरा ॥ ध्रु ॥',
      '',
      'कर्पूरगौरा भोळा नयनी विशाळा ।',
      'अर्धांगी पार्वती सुमनांच्या माळा ।',
      'विभुतीचे उधळण शितिकंठ नीळा ।',
      'ऐसा शंकर शोभे उमावेल्हाळा ॥ २ ॥',
      '',
      'जय देव जय देव जय श्रीशंकरा ।',
      'आरती ओवाळू तुज कर्पूरगौरा ॥ ध्रु ॥',
      '',
      'देवी दैत्यी सागरमंथन पै केलें ।',
      'त्यामाजी अवचित हळाहळ जें उठिले ।',
      'ते त्वां असुरपणे प्राशन केलें ।',
      'नीलकंठ नाम प्रसिद्ध झालें ॥ ३ ॥',
      '',
      'जय देव जय देव जय श्रीशंकरा ।',
      'आरती ओवाळू तुज कर्पूरगौरा ॥ ध्रु ॥',
      '',
      'व्याघ्रांबर फणिवरधर सुंदर मदनारी ।',
      'पंचानन मनमोहन मुनिजन सुखकारी ।',
      'शतकोटींचें बीज वाचे उच्चारी ।',
      'रघुकुळटिळक रामदासा अंतरी ॥ ४ ॥',
      '',
      'जय देव जय देव जय श्रीशंकरा ।',
      'आरती ओवाळू तुज कर्पूरगौरा ॥ ध्रु ॥',
    ],
  },
  {
    slug: 'aarti-om-jai-shiv-omkara',
    name: 'ॐ जय शिव ओंकारा',
    sungIn: 'हिंदी',
    dedication: 'श्री शिव जी की आरती',
    lines: [
      'ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा ।',
      'ब्रह्मा विष्णु सदाशिव, अर्द्धांगी धारा ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'एकानन चतुरानन पंचानन राजे ।',
      'हंसासन गरुड़ासन वृषवाहन साजे ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'दो भुज चार चतुर्भुज दस भुज अति सोहे ।',
      'तीनों रूप निरखते त्रिभुवन मन मोहे ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'अक्षमाला बनमाला मुण्डमाला धारी ।',
      'चंदन मृगमद चंदा सोहे भाल त्रिपुरारी ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'श्वेतांबर पीतांबर बाघंबर अंगे ।',
      'सनकादिक गरुणादिक भूतादिक संगे ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'कर के मध्य कमंडलु चक्र त्रिशूल धर्ता ।',
      'जगकर्ता जगहर्ता जगपालनकर्ता ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'ब्रह्मा विष्णु सदाशिव जानत अविवेका ।',
      'प्रणवाक्षर मध्ये ये तीनों एका ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'लक्ष्मी सावित्री पार्वती संगा ।',
      'पार्वती अर्द्धांगी शिवलहरी गंगा ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'पर्वत सोहे पार्वती शंकर कैलासा ।',
      'भांग धतूर का भोजन भस्मी में वासा ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'जटा में गंगा बहत है गल मुंडन माला ।',
      'शेष नाग लिपटावत ओढ़त मृगछाला ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'काशी में विराजे विश्वनाथ नंदी ब्रह्मचारी ।',
      'नित उठ दर्शन पावत महिमा अति भारी ॥',
      'ॐ हर हर हर महादेव ॥',
      '',
      'त्रिगुण शिवजी की आरती जो कोई नर गावे ।',
      'कहत शिवानंद स्वामी मनवांछित फल पावे ॥',
      'ॐ हर हर हर महादेव ॥',
    ],
  },
  {
    slug: 'aarti-om-jai-lakshmi-mata',
    name: 'ॐ जय लक्ष्मी माता',
    sungIn: 'हिंदी',
    dedication: 'श्री लक्ष्मी जी की आरती',
    lines: [
      'ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता ।',
      'तुमको निशिदिन सेवत, हरि विष्णु विधाता ॥',
      '',
      'उमा, रमा, ब्रह्माणी, तुम ही जग-माता ।',
      'सूर्य-चन्द्रमा ध्यावत, नारद ऋषि गाता ॥',
      '',
      'दुर्गा रूप निरंजनी, सुख सम्पत्ति दाता ।',
      'जो कोई तुमको ध्यावत, ऋद्धि-सिद्धि धन पाता ॥',
      '',
      'तुम पाताल-निवासिनि, तुम ही शुभदाता ।',
      'कर्म-प्रभाव-प्रकाशिनी, भवनिधि की त्राता ॥',
      '',
      'जिस घर में तुम रहतीं, सब सद्गुण आता ।',
      'सब सम्भव हो जाता, मन नहीं घबराता ॥',
      '',
      'तुम बिन यज्ञ न होते, वस्त्र न कोई पाता ।',
      'खान-पान का वैभव, सब तुमसे आता ॥',
      '',
      'शुभ-गुण मन्दिर सुन्दर, क्षीरोदधि-जाता ।',
      'रत्न चतुर्दश तुम बिन, कोई नहीं पाता ॥',
      '',
      'महालक्ष्मी जी की आरती, जो कोई जन गाता ।',
      'उर आनन्द समाता, पाप उतर जाता ॥',
    ],
  },
  {
    slug: 'aarti-yuge-atthavis',
    name: 'युगे अठ्ठावीस विटेवरी',
    sungIn: 'मराठी',
    dedication: 'श्री विठ्ठलाची आरती',
    lines: [
      'युगे अठ्ठावीस विटेवरी उभा ।',
      'वामांगी रखुमाई दिसे दिव्य शोभा ॥',
      'पुंडलिकाच्या भेटी परब्रह्म आले गा ।',
      'चरणी वाहे भीमा उद्धरी जगा ॥ १ ॥',
      '',
      'जय देव जय देव जय पांडुरंगा ।',
      'रखुमाईवल्लभा राईच्या वल्लभा पावे जिवलगा ॥ ध्रु ॥',
      '',
      'तुळसीमाळा गळा कर ठेवुनि कटीं ।',
      'कांसे पीतांबर कस्तुरी लल्लाटीं ।',
      'देव सुरवर नित्य येती भेटी ।',
      'गरुड हनुमंत पुढे उभे राहती ॥ २ ॥',
      '',
      'धन्य वेणुनाद अनुक्षेत्रपाळा ।',
      'सुवर्णाची कमळे वनमाळा गळा ।',
      'राई रखुमाबाई राणीया सकळा ।',
      'ओंवाळीती राजा विठोबा सांवळा ॥ ३ ॥',
      '',
      'ओंवाळू आरत्या कुरवंड्या येती ।',
      'चंद्रभागेमाजी सोडुनिया देती ।',
      'दिंड्या पताका वैष्णव नाचती ।',
      'पंढरीचा महिमा वर्णावा किती ॥ ४ ॥',
      '',
      'आषाढी कार्तिकी भक्तजन येती ।',
      'चंद्रभागेमध्ये स्नाने जे करिती ।',
      'दर्शनहेळामात्रे तयां होय मुक्ती ।',
      'केशवासी नामदेव भावे ओंवाळीती ॥ ५ ॥',
    ],
  },
  {
    slug: 'aarti-durge-durghat-bhari',
    name: 'दुर्गे दुर्घट भारी',
    sungIn: 'मराठी',
    dedication: 'श्री देवीची आरती',
    lines: [
      'दुर्गे दुर्घट भारी तुजविण संसारी ।',
      'अनाथनाथे अंबे करुणा विस्तारी ।',
      'वारी वारी जन्ममरणाते वारी ।',
      'हारी पडलों आता संकट निवारी ॥ १ ॥',
      '',
      'जय देवी जय देवी महिषासुरमर्दिनी ।',
      'सुरवर ईश्वरवरदे तारक संजीवनी ॥ ध्रु ॥',
      '',
      'त्रिभुवनभुवनी पाहतां तुजऐसी नाही ।',
      'चारी श्रमले परंतु न बोलावे काही ।',
      'साही विवाद करितां पडले प्रवाही ।',
      'ते तूं भक्तांलागी पावसी लवलाही ॥ २ ॥',
      '',
      'प्रसन्नवदने प्रसन्न होती निजदासां ।',
      'क्लेशांपासुनि सोडवि तोडी भवपाशा ।',
      'अंबे तुजवाचून कोण पुरविल आशा ।',
      'नरहरि तल्लिन झाला पदपंकजलेशा ॥ ३ ॥',
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

/**
 * Questions *about* an aarti rather than for it: how to do it, when, what it
 * means. Those go to the model, which explains well and is not inventing words.
 */
const NOT_A_TEXT_REQUEST =
  /(कैसे|कसे|कसा|कशी|कसली|तरीका|पद्धत|विधि|विधी|नियम|सामग्री|अर्थ|मतलब|how|meaning|method|steps|कब|केव्हा|when)/i;

/** Which aarti-text (if any) is already verified and stored here. */
function storedText(id: string): AartiText | null {
  const slugById: Record<string, string> = {
    'ganesh-mr': 'aarti-sukhkarta-dukhharta',
    'ganesh-hi': 'aarti-jai-ganesh-deva',
    jagdish: 'aarti-om-jai-jagdish-hare',
    ambe: 'aarti-jai-ambe-gauri',
    saraswati: 'aarti-jai-saraswati-mata',
    hanuman: 'aarti-hanuman-lala-ki',
    'shiv-mr': 'aarti-lavthavati-vikrala',
    'shiv-hi': 'aarti-om-jai-shiv-omkara',
    lakshmi: 'aarti-om-jai-lakshmi-mata',
    viththal: 'aarti-yuge-atthavis',
    'durga-mr': 'aarti-durge-durghat-bhari',
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

  /*
   * Shiva and the Devi have a Marathi aarti and a Hindi one, and the language
   * decides which is meant — a Marathi household sings लवथवती विक्राळा, a Hindi
   * one sings ॐ जय शिव ओंकारा. A visitor who names one of them explicitly gets
   * that one whatever their language is set to.
   */
  if (/लवथवती|lavthavati|lavthavti/.test(q)) return 'shiv-mr';
  if (/ॐ\s*जय\s*शिव|om\s*jai\s*shiv|शिव\s*ओंकारा/.test(q)) return 'shiv-hi';
  if (/शिव|shiv|शंकर|shankar|महादेव|mahadev|भोलेनाथ|bholenath/.test(q)) {
    return lang === 'mr' ? 'shiv-mr' : 'shiv-hi';
  }
  /*
   * "जय अम्बे गौरी" is named in full — that is the Hindi aarti, whatever
   * language the visitor reads the site in.
   */
  if (/जय\s*अ(?:म्)?बे|जय\s*अंबे|jai\s*ambe/.test(q)) return 'ambe';
  if (/दुर्घट|durghat/.test(q)) return 'durga-mr';
  if (lang === 'mr' && /दुर्गा|devī|देवी|अंबे|अम्बे/.test(q)) return 'durga-mr';

  for (const deity of DEITIES) {
    if (deity.words.some((word) => q.includes(word.toLowerCase()))) return deity.id;
  }
  return null;
}

/**
 * A short question like "आरती" or "मराठी आरती" names no deity. Rather than
 * asking one back, the answer gives the first aarti every household sings and
 * the list of the rest.
 */
function genericAarti(question: string): AartiText | null {
  if (question.trim().split(/\s+/).length > 5) return null;
  return AARTIS[0] ?? null;
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

  /*
   * "आरती कैसे करें", "आरती का अर्थ", "आरती कब करें" — these ask about the
   * ritual, the meaning or the occasion. They are not requests for the words,
   * and the model answers them well.
   */
  if (NOT_A_TEXT_REQUEST.test(question)) return null;

  const t = stringsFor(lang);
  const id = deityIn(question, lang);
  const stored = id ? storedText(id) : genericAarti(question);

  if (stored) {
    const answer = [
      `${stored.name} — ${stored.dedication} (${stored.sungIn})`,
      '',
      ...stored.lines,
      '',
      /*
       * Say how the words were checked, and only promise a recording when there
       * really is one. Claiming a recording we do not have is the kind of small
       * lie that makes every other answer doubtful.
       */
      stored.withRecording ? t('aarti.textChecked') : t('aarti.textPrinted'),
      ...(stored.withRecording ? [`${t('aarti.listenLink')}: ${LISTEN_URL}`] : []),
    ]
      .join('\n')
      .trim();

    return { answer, slug: stored.slug };
  }

  // No deity named and nothing to default to: the model may answer freely.
  if (!id) return null;

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
