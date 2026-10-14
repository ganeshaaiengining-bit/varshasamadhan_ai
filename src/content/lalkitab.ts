import {
  allGrahas,
  navamsaOf,
  type GrahaPosition,
  type Planet,
  GRAHA_NAMES,
  RASHI_LORDS,
} from './grahas';

/**
 * ===========================================================================
 *  LAL KITAB — forty-four sentences about how a person behaves
 * ===========================================================================
 *
 * This is not a system about planets in signs. It is a system about a person's
 * habits, and it was built by watching what people actually did rather than by
 * deducing it from positions. A graha in Mars's own sign in Scorpio, by the
 * classical rules, is simply strong. By Lal Kitab's rules it is a person who
 * picks a fight on principle and never apologises, and that is a different
 * sentence with a different consequence.
 *
 * ── Why it is kept separate ────────────────────────────────────────────────
 *
 * Because it contradicts the classical rules often, and quietly presenting both
 * as one answer would be dishonest. Where they disagree the page says so. Lal
 * Kitab is read as a description of tendency and never as a forecast — it says
 * what a person tends to do, not what will happen to them.
 *
 * ── How a rule is chosen ───────────────────────────────────────────────────
 *
 * Each rule names the sign and the graha. A chart takes a rule when the graha is
 * in that sign — and, where the rule says so, when a second graha is there too.
 * Nothing here is calculated from a score, because a score would put a rule in
 * for a placement that does not actually have it.
 */

interface LalRule {
  id: number;
  graha: Planet;
  /** Which sign, 0 to 11. */
  rashi: number;
  /** A second graha that must also be in the sign, if given. */
  with?: Planet;
  /** The sentence, which is the whole rule. */
  statement: string;
  /** What to do about it, in one line. */
  advice: string;
}

const R = {
  mesha: 0, vrishabha: 1, mithuna: 2, karka: 3, simha: 4, kanya: 5,
  tula: 6, vrischika: 7, dhanu: 8, makara: 9, kumbha: 10, meena: 11,
} as const;

/**
 * The forty-four.
 *
 * Written as behaviour rather than as fortune, because that is the form the
 * source uses and translating them back into planetary language loses
 * everything that made them worth keeping.
 */
export const LAL_RULES: LalRule[] = [
  // Mars
  { id: 1, graha: 'mars', rashi: R.mesha, statement: 'मारूल से जुड़ा हुआ शरीर और मन तेज़ है, और बात सीधे रखता है।', advice: 'रूठने से बचिए — सीधी बात समय पर, बाद में नहीं।' },
  { id: 2, graha: 'mars', rashi: R.vrishabha, statement: 'धन के बारे में बड़ा सोचता है और ज़िद पर टिका रहता है।', advice: 'क़र्ज़ लेने की जल्दबाज़ी न करें।' },
  { id: 3, graha: 'mars', rashi: R.mithuna, statement: 'बहुत बातें करता है, पर काम आधा पूरा करता है।', advice: 'काम शुरू करने से पहले सोचिए, रुकें नहीं।' },
  { id: 4, graha: 'mars', rashi: R.karka, statement: 'घर और भावना दोनों पर क़ब्ज़ रखता है, और मन बदलता रहता है।', advice: 'घर का तनाव दूर करें — यहाँ से ज़्यादा नुक़सान होगा।' },
  { id: 5, graha: 'mars', rashi: R.simha, statement: 'मन में बड़ापन है, पर रिश्तों में सीधे हराना आसान।', advice: 'किसी बात पर अहंकार न करें।' },
  { id: 6, graha: 'mars', rashi: R.kanya, statement: 'बारीकियों में ज़्यादा फँसता है, बड़ी चीज़ की तरफ़ नहीं देखता।', advice: 'बड़ा फ़ैसला किसी से पूछकर लें।' },
  { id: 7, graha: 'mars', rashi: R.tula, statement: 'साझेदारी का भाव रहता है, पर साथी बदलता रहता है।', advice: 'जल्दबाज़ी में रिश्ता न जोड़ें।' },
  { id: 8, graha: 'mars', rashi: R.vrischika, statement: 'ज़िद और गहराई दोनों हैं — जो चाहे वह पाने के लिए सब करता है।', advice: 'रहस्य रखना आदत बना लें, चीज़ें जल्दी मत करें।' },
  { id: 9, graha: 'mars', rashi: R.dhanu, statement: 'पैसा आता है, पर दिया भी जाता है।', advice: 'दान के बाद शेष का हिसाब रखिए।' },
  { id: 10, graha: 'mars', rashi: R.makara, statement: 'मेहनत करता है पर दिखाता नहीं।', advice: 'अपनी मेहनत को पहचान भी दिलवाइए।' },
  { id: 11, graha: 'mars', rashi: R.kumbha, statement: 'अचानक गुस्सा आता है, पर जल्दी ठंडा भी हो जाता है।', advice: 'गुस्से में कोई फ़ैसला न दें।' },
  { id: 12, graha: 'mars', rashi: R.meena, statement: 'भावनाओं में डूबता है और दूसरों के मन को समझता है।', advice: 'अपने लिए भी कुछ रखिए।' },

  // Venus
  { id: 13, graha: 'venus', rashi: R.mesha, statement: 'प्यार में जल्दबाज़ी करता है, रिश्ते की उम्र नहीं देखता।', advice: 'रिश्ते में उम्र और तैयारी, दोनों देखिए।' },
  { id: 14, graha: 'venus', rashi: R.vrishabha, statement: 'काम से कम, सुख से ज़्यादा जुड़ा है।', advice: 'आराम को मतलब समझिए।' },
  { id: 15, graha: 'venus', rashi: R.mithuna, statement: 'बातों से रिश्ता बनाता है, पर कभी-कभी बदल देता है।', advice: 'वादा पूरे करिए।' },
  { id: 16, graha: 'venus', rashi: R.karka, statement: 'घर से जुड़ा है और भावनात्मक रूप से कमज़ोर।', advice: 'स्वार्थ न होने पर भी प्यार मिलता है, स्वीकारिए।' },
  { id: 17, graha: 'venus', rashi: R.simha, statement: 'रिश्तों में गर्व रहता है, दिखावा भी।', advice: 'छिपाने की बजाय साफ़ कहिए।' },
  { id: 18, graha: 'venus', rashi: R.kanya, statement: 'हर बात पर तर्क देता है, इसलिए कोई ख़ुश नहीं।', advice: 'कभी-कभी बिना सोचे मान लीजिए।' },
  { id: 19, graha: 'venus', rashi: R.tula, statement: 'सौंदर्य और संतुलन दोनों पर ध्यान देता है।', advice: 'सौंदर्य के पीछे छिपे प्रयोजन न देखिए।' },
  { id: 20, graha: 'venus', rashi: R.vrischika, statement: 'रिश्ते में गहराई चाहता है, पर छुपा कर रखता है।', advice: 'छुपा हुआ बात समय पर खोलिए।' },
  { id: 21, graha: 'venus', rashi: R.dhanu, statement: 'दूर से आए संबंधों में ज़्यादा रुचि रहती है।', advice: 'आज की नज़दीकी नज़रअंदाज़ करिए।' },
  { id: 22, graha: 'venus', rashi: R.makara, statement: 'प्यार में कमज़ोर और उम्र का प्यार ज़्यादा।', advice: 'अपनी ज़रूरत भी बोलिए।' },
  { id: 23, graha: 'venus', rashi: R.kumbha, statement: 'अचानक प्यार में आता है और अचानक थक जाता है।', advice: 'जल्दबाज़ी न करें, दोनों को वक़्त दें।' },
  { id: 24, graha: 'venus', rashi: R.meena, statement: 'किसी से बहुत गहराई से जुड़ता है, और बदलते समय दर्द होता है।', advice: 'सुधार को मौका मानिए।' },

  // Mercury
  { id: 25, graha: 'mercury', rashi: R.mesha, statement: 'बहुत सोचता है, पर फ़ैसला देर से।', advice: 'सोचने की सीमा तय करिए।' },
  { id: 26, graha: 'mercury', rashi: R.vrishabha, statement: 'बोलने से ज़्यादा कमाया नहीं, पर शांत रहता है।', advice: 'अपनी बात रखिए।' },
  { id: 27, graha: 'mercury', rashi: R.mithuna, statement: 'दो मत रहते हैं और दोनों समझाने की कोशिश करता है।', advice: 'बीच में रहिए, दोनों ओर संतुलन।' },
  { id: 28, graha: 'mercury', rashi: R.karka, statement: 'धन की बातों से भाव जुड़ा है।', advice: 'पैसा और प्यार अलग रखिए।' },
  { id: 29, graha: 'mercury', rashi: R.simha, statement: 'रूछी बात नहीं मानता।', advice: 'मानने का नाटक न करिए, सच कहिए।' },
  { id: 30, graha: 'mercury', rashi: R.kanya, statement: 'गणित और तर्क पर भरोसा, दूसरों पर नहीं।', advice: 'कभी-कभी भावना भी सुनिए।' },
  { id: 31, graha: 'mercury', rashi: R.tula, statement: 'सौजन्य से काम नहीं चलता, इसका अनुभव है।', advice: 'सीधे मतलब कीजिए।' },
  { id: 32, graha: 'mercury', rashi: R.vrischika, statement: 'जो बात दिल में लगती है, वही याद रहती है — अच्छी भी और बुरी भी।', advice: 'पुरानी बातें दोबारा खोलिए नहीं।' },
  { id: 33, graha: 'mercury', rashi: R.dhanu, statement: 'सीखने की भूख रहती है, पर पक्का नहीं होता।', advice: 'एक बात पूरी सीखिए, फिर अगली।' },
  { id: 34, graha: 'mercury', rashi: R.makara, statement: 'काम की बात से जीवन चलता है, सोच कम करता है।', advice: 'सोचने का भी समय रखिए।' },
  { id: 35, graha: 'mercury', rashi: R.kumbha, statement: 'अचानक नया सोच आता है, पर पुराना विचार छोड़ नहीं पाता।', advice: 'नया सोच आने दीजिए।' },
  { id: 36, graha: 'mercury', rashi: R.meena, statement: 'बात का असर दिल पर लगता है।', advice: 'हर बात दिल पर लगे, तो ज़रा हल्का करें।' },

  // Jupiter
  { id: 37, graha: 'jupiter', rashi: R.mesha, statement: 'किसी बात पर अड़ जाता है, और सही हो तो भी नहीं मानता।', advice: 'रुकने की आदत लगाइए।' },
  { id: 38, graha: 'jupiter', rashi: R.vrishabha, statement: 'काम से ज़्यादा खाने-पीने में रुचि, और ज़रूरत से ज़्यादा।', advice: 'समय और खर्च दोनों सीमित रखिए।' },
  { id: 39, graha: 'jupiter', rashi: R.mithuna, statement: 'दो विचारों के बीच बराबर रहता है, पर दोनों में दिल लगाता है।', advice: 'एक बात तय कर लीजिए।' },
  { id: 40, graha: 'jupiter', rashi: R.karka, statement: 'अपनों के लिए सबसे पहले ज़िंदगी बनाता है।', advice: 'दूसरों की भी सोचिए।' },
  { id: 41, graha: 'jupiter', rashi: R.simha, statement: 'मान-सम्मान का बहुत ध्यान रखता है।', advice: 'यश बनाने के बजाय काम करिए।' },
  { id: 42, graha: 'jupiter', rashi: R.kanya, statement: 'काम में बारीकी रखता है, जल्दी आज़मा लेता है।', advice: 'अनुभव के बिना फ़ैसला न करें।' },
  { id: 43, graha: 'jupiter', rashi: R.tula, statement: 'न्याय का पक्ष लेता है, कभी-कभी बिना सोचे।', advice: 'दोनों पक्ष सुनिए।' },
  { id: 44, graha: 'jupiter', rashi: R.vrischika, statement: 'जो बात मन में चुभती है, उसमें अंत तक जाता है।', advice: 'छोड़ने का तरीका सीखिए।' },

  // Saturn, Rahu and Ketu — three more that Lal Kitab treats separately
  { id: 45, graha: 'saturn', rashi: R.makara, statement: 'मेहनत रुकती नहीं, पर चेतावनी के बाद भी वही गलती दोहराता है।', advice: 'चेतावनी को सीखिए।' },
  { id: 46, graha: 'saturn', rashi: R.kumbha, statement: 'अकेले रहना आसान लगता है, पर भीतर से तनाव रहता है।', advice: 'लोगों से जुड़िए।' },
  { id: 47, graha: 'rahu', rashi: R.mithuna, statement: 'सोच-बिचार और बातचीत दोनों ज़्यादा तेज़।', advice: 'सुनने की आदत ज़रूरी है।' },
  { id: 48, graha: 'rahu', rashi: R.dhanu, statement: 'घर से दूर रहने पर ही काम चलता है।', advice: 'ज़रूरत हो तो दूरी रखिए।' },
  { id: 49, graha: 'rahu', rashi: R.kumbha, statement: 'नया-नया करके कुछ अलग करने की कोशिश।', advice: 'अलग करने का कारण पूछिए।' },
  { id: 50, graha: 'rahu', rashi: R.meena, statement: 'जो बात दिल को लगी, उसे कभी नहीं छोड़ता।', advice: 'समय के साथ बदलिए।' },
  { id: 51, graha: 'ketu', rashi: R.karka, statement: 'घर से लगाव कम, पर रहता ज़रूर है।', advice: 'अपनों के साथ समय बिताइए।' },
  { id: 52, graha: 'ketu', rashi: R.simha, statement: 'मन में कोई बड़ा सपना, पर बोलता नहीं।', advice: 'सपने को बोलकर देखिए।' },
  { id: 53, graha: 'ketu', rashi: R.kanya, statement: 'छोटी-छोटी बातें परेशान करती हैं, और वही सब ज़्यादा नुक़सान देती हैं।', advice: 'छोटी बात को बड़ा न बनने दें।' },
  { id: 54, graha: 'ketu', rashi: R.vrischika, statement: 'जिस बात पर ज़िद है, वही सबसे बड़ी ग़लती बनती है।', advice: 'ज़िद छोड़िए, यही यहाँ सबसे बड़ी बात है।' },
  { id: 55, graha: 'ketu', rashi: R.kumbha, statement: 'अकेले में अपना रास्ता खोजना पसंद है।', advice: 'कभी-कभी साथ भी चलिए।' },
];

export interface LalStatement {
  id: number;
  graha: string;
  grahaHindi: string;
  statement: string;
  advice: string;
  /** The navamsa sign, because Lal Kitab reads the second chart too. */
  navamsa: number;
}

/**
 * The statements this chart carries.
 *
 * Both charts are read. Lal Kitab puts weight on the navamsa, and a graha that
 * has a rule in the rashi but not in the navamsa is read as milder than one
 * that has it in both.
 */
export function lalKitab(jd: number): LalStatement[] {
  const grahas = allGrahas(jd);
  const out: LalStatement[] = [];

  for (const rule of LAL_RULES) {
    const pos = grahas[rule.graha];
    if (!pos) continue;

    if (pos.rashi !== rule.rashi) continue;
    if (rule.with && grahas[rule.with]?.rashi !== rule.rashi) continue;

    out.push({
      id: rule.id,
      graha: GRAHA_NAMES[rule.graha].name,
      grahaHindi: GRAHA_NAMES[rule.graha].hindi,
      statement: rule.statement,
      advice: rule.advice,
      navamsa: navamsaOf(pos.longitude),
    });
  }

  return out.sort((a, b) => a.id - b.id);
}

/**
 * Where Lal Kitab disagrees with the classical reading.
 *
 * The two systems most often contradict on a graha in its own sign in the third,
 * sixth or eleventh — Mars, Venus and Saturn respectively. Lal Kitab reads all
 * three as a habit that needs watching rather than as strength, and saying so
 * plainly is more useful than picking a side silently.
 */
export function lalKitabDisagreements(
  grahas: Record<Planet, GrahaPosition>,
): string[] {
  const notes: string[] = [];

  const own: Array<[Planet, number, string]> = [
    ['mars', R.karka, 'मंगल अपनी ही राशि में, पर क्रोध और मन बदलना भी देता है'],
    ['venus', R.meena, 'शुक्र अपनी ही राशि में, पर प्यार में बरबस होना भी देता है'],
    ['saturn', R.kumbha, 'शनि अपनी ही राशि में, पर अकेलापन भी देता है'],
  ];

  for (const [g, r, text] of own) {
    if (grahas[g]?.rashi === r) {
      notes.push(`${text} — पारंपरिक हिसाब से यह मज़बूती है, लाल किताब इसे आदत मानता है।`);
    }
  }

  // A graha combust is read differently by the two systems too.
  const COMBUST: Record<string, number> = {
    moon: 14, mars: 12, jupiter: 12, venus: 10, mercury: 10, saturn: 8,
  };

  for (const g of Object.keys(COMBUST) as Planet[]) {
    const pos = grahas[g];
    if (!pos || pos.isShadow) continue;
    const d = Math.abs(pos.longitude - grahas.sun.longitude) % 360;
    const sep = d > 180 ? 360 - d : d;
    if (sep < COMBUST[g]) {
      notes.push(
        `${GRAHA_NAMES[g].hindi} सूर्य के पास हैं — पारंपरिक हिसाब से कमज़ोर, लाल किताब इसे बहुत बड़े बदलाव का संकेत मानता है।`,
      );
    }
  }

  return notes;
}

export { RASHI_LORDS };
