/**
 * ===========================================================================
 *  ANKA JYOTISH — the fifty-two numbers
 * ===========================================================================
 *
 * A number is taken from the birth date and again from the birth name, and the
 * two are reduced by a rule that is not the usual numerology one. Ordinary
 * numerology reduces a sum to a single digit. Anka does not — it keeps the
 * compound until it has said what the compound means, and only then reduces.
 *
 *   1  2  3  4  5  6  7  8  9  10  11 ... 52
 *
 * Fifty-two and not fifty: the system runs to fifty-two because the numbers of
 * the full moon, of the alphabet, and of the weeks all end there, and a reading
 * that stops at nine cannot say anything about a person born on the nineteenth.
 *
 * ── Why the name is counted a second time ──────────────────────────────────
 *
 * Because the date is what was given and the name is what was chosen, and this
 * system reads them as two different statements about the same person. Where
 * they agree it is called an Anka Uchchhishta and given extra weight. Where they
 * do not, that disagreement is itself the reading, and it is shown rather than
 * averaged away.
 */

/** What each of the fifty-two numbers is about. */
interface AnkaMeaning {
  title: string;
  /** The one line the page leads with. */
  line: string;
  /** What it tends to produce in a life. */
  body: string;
  /** The weakness that comes with it. */
  shadow: string;
  /** What to do about the weakness. */
  remedy: string;
}

const M: Record<number, AnkaMeaning> = {
  1: { title: 'सूर्य', line: 'अकेला चलने वाला, नेतृत्व करने वाला।', body: 'अपना रास्ता खुद बनाता है और भीड़ से अलग रहता है। काम शुरू करने की ताक़त है।', shadow: 'अकेलापन, और दूसरों की सहायता लेने में कठिनाई।', remedy: 'किसी एक काम में लोगों को साथ लीजिए — अकेले नहीं।' },
  2: { title: 'चंद्र', line: 'भावना और साथ, पर निर्णय में देर।', body: 'दूसरों को समझता है, मन की बात पहचानता है, साथ देने का स्वभाव है।', shadow: 'देरी और कभी-कभी सही-ग़लत का फ़ैसला देर से।', remedy: 'सोच लेने के बाद एक महीने की तारीख़ रखिए और उस दिन फ़ैसला लीजिए।' },
  3: { title: 'भृगु', line: 'शक्ति और साहस, पर रूठना भी।', body: 'ज़िद, मेहनत और काम करने की ताक़त। कठिन समय में सबसे आगे खड़ा होता है।', shadow: 'झगड़ा और बात न मानना।', remedy: 'जब गुस्सा आए, बीस मिनट चलिए — फिर बात कीजिए।' },
  4: { title: 'बुध', line: 'बुद्धि, लेखन और व्यापार।', body: 'सोच-समझ, हिसाब और बातचीत से काम चलाने की शक्ति।', shadow: 'बहुत सोचना, काम का टालना।', remedy: 'सोचने की तारीख़ रखिए, उस दिन तक और न सोचिए।' },
  5: { title: 'गुरु', line: 'ज्ञान, धर्म और उत्साह।', body: 'सिखाने, समझाने और मार्गदर्शन की प्रवृत्ति। बड़े लोगों का साथ मिलता है।', shadow: 'कभी-कभी उपदेश देने की बहुत ज़्यादा।', remedy: 'दूसरों की बात सुनकर भी कहीजिए — अकेला तर्क नहीं।' },
  6: { title: 'शुक्र', line: 'कला, प्रेम और आराम।', body: 'सौंदर्य और संतुलन की समझ, लोगों को जोड़ने का स्वभाव।', shadow: 'आराम में समय बीत जाना।', remedy: 'काम से जुड़ने के लिए खुद को समय दीजिए, पहले से।' },
  7: { title: 'शनि', line: 'कर्म, मेहनत और देर का फल।', body: 'धैर्य और लगातार मेहनत — जो एक बार शुरू करे वह करता है।', shadow: 'रुकावट और अकेलापन, ख़ासकर कम उम्र में।', remedy: 'किसी काम को साथी के साथ शुरू कीजिए।' },
  8: { title: 'राहु', line: 'अचानक बदलाव और बड़ी सोच।', body: 'जो नहीं होता वह करने की हिम्मत, और ज़रूरत से ज़्यादा।', shadow: 'अचानक बदलाव, और ज़रूरत से ज़्यादा ख़र्च।', remedy: 'हर महीने एक बार ख़र्च देखिए, बाकी बाद में।' },
  9: { title: 'केतु', line: 'साधना, अलगाव और दूर दृष्टि।', body: 'किसी बात पर एकदम अलग नज़र, जो बाकी नहीं देखते वह दिखता है।', shadow: 'अलग होना, जो बात रहने देनी चाहिए वह छोड़ देना।', remedy: 'दूर रहने का हक़ है — पर जानबूझकर लीजिए, ज़बरदस्ती नहीं।' },
  10: { title: 'रवि-शनि', line: 'साहस जो ज़िद बन जाता है।', body: 'संकट में सामने खड़ा होने की प्रवृत्ति।', shadow: 'ज़िद और नुक़सान।', remedy: 'ज़िद छोड़िए, यही इसका इलाज है।' },
  11: { title: 'चंद्र-शनि', line: 'भावना और अनुभव का मिलन।', body: 'लोगों की बात सुनने की गहराई, अंदर तक की समझ।', shadow: 'ज़्यादा सोचना, अकेलापन।', remedy: 'समझिए, पर निर्णय जल्दी लीजिए।' },
  12: { title: 'मंगल-बृहस्पति', line: 'कर्म और ज्ञान का जोड़।', body: 'मेहनत के साथ समझ — काम और अध्ययन दोनों।', shadow: 'बड़ा सोच, छोटा काम।', remedy: 'काम छोटा करें, सोच छोड़ें।' },
  13: { title: 'भृगु-शुक्र', line: 'काम और कला।', body: 'रचना, और जो चाहा वह पाने की हिम्मत।', shadow: 'जल्दबाज़ी, कभी-कभी बुरा स्वाद।', remedy: 'कला और रिश्ता दोनों में धीरेज रखिए।' },
  14: { title: 'बुध-गुरु', line: 'बुद्धि और ज्ञान।', body: 'पढ़ाई में रुचि, समझने की गहराई।', shadow: 'विश्वास और तर्क में फँसना।', remedy: 'दोनों को जगह दीजिए — एक अकेला न बढ़े।' },
  15: { title: 'भृगु-शनि', line: 'मेहनत का फल, पर कड़ा।', body: 'जो मिले उसमें ज़िद, देर से लेकिन पक्का।', shadow: 'कड़ापन और कम संवाद।', remedy: 'नरमी सीखिए, यही कमज़ोरी नहीं है।' },
  16: { title: 'शुक्र-शनि', line: 'सुख और अनुशासन।', body: 'काम और आराम दोनों में संतुलन बनाने वाला।', shadow: 'आराम की आदत, कभी-कभी अकेलापन।', remedy: 'दोनों के बीच समय बाँटिए।' },
  17: { title: 'रवि-राहु', line: 'बड़ा सोच, बड़ा दावा।', body: 'महत्वाकांक्षा जो कभी-कभी ज़रूरत से आगे निकल जाती है।', shadow: 'अतिरेक और कम संतोष।', remedy: 'ख़ुद से पूछिए — "यह ज़रूरी भी है?"' },
  18: { title: 'चंद्र-राहु', line: 'भावना के साथ अचानक बदलाव।', body: 'पुरानी बातों की याद, पर उनसे आगे बढ़ने की हिम्मत।', shadow: 'मन का चक्कर, अचानक फ़ैसले।', remedy: 'अचानक फ़ैसला बड़ा न हो, तो कम करिए।' },
  19: { title: 'भृगु-राहु', line: 'साहस और अचानक बदलाव।', body: 'जो चाहा वह करने की ज़िद, बड़े स्तर पर।', shadow: 'अचानक काम, बड़ा जोख़िम।', remedy: 'हर बड़े कदम पर एक बार रुकिए।' },
  20: { title: 'बुध-राहु', line: 'नया सोच, अलग सोच।', body: 'चतुराई और कुछ अलग करने की सोच।', shadow: 'चालाकी की छवि, छोटे ठगने की शक।', remedy: 'बात सीधी रखिए — यही सबसे बड़ी रक्षा है।' },
  21: { title: 'गुरु-राहु', line: 'ज्ञान के साथ बड़ा बदलाव।', body: 'अचानक कुछ बड़ा सीखना या सीखाना।', shadow: 'अति-विश्वास और बड़े दावे।', remedy: 'दावा छोटा कीजिए, काम बड़ा करिए।' },
  22: { title: 'शुक्र-राहु', line: 'अचानक रिश्ता या पैसे की बात।', body: 'बड़ी अचानक आय या बड़ा अचानक खर्च।', shadow: 'पैसों का चक्कर।', remedy: 'अचानक पैसे आए तो रुकिए, ख़र्च मत कीजिए।' },
  23: { title: 'शनि-राहु', line: 'देर और अचानक बदलाव।', body: 'मेहनत के बावजूद ज़िद चलती है।', shadow: 'कड़ापन और अचानक मुसीबतें।', remedy: 'धीरेज रखिए, यही इसकी ताक़त है।' },
  24: { title: 'रवि-केतु', line: 'नेता और साधक — दोनों एक साथ।', body: 'अपना रास्ता बनाना, और अंत में आत्मज्ञान।', shadow: 'अहंकार और आलस्य।', remedy: 'काम का एक हिस्सा दूसरों को दीजिए।' },
  25: { title: 'चंद्र-केतु', line: 'भावना और दूरी।', body: 'दूर रहकर भी जुड़ा रहना।', shadow: 'अलग होने का बहुत सोच।', remedy: 'दूरी तभी, जब ज़रूरी हो।' },
  26: { title: 'भृगु-केतु', line: 'साहस और साधना।', body: 'जो चाहा वह पाने की ज़िद, और छोड़ने का संयम।', shadow: 'अधूरा काम छोड़ देना।', remedy: 'काम पूरा करने की एक तारीख़ तय कीजिए।' },
  27: { title: 'बुध-केतु', line: 'बुद्धि और आध्यात्मिकता।', body: 'गहराई में जाने की प्रवृत्ति, और व्यवहार में साधुता।', shadow: 'नीचे मन लगा देना, कम करना।', remedy: 'कम करने के बाद जो बचे, उसका उपयोग कीजिए।' },
  28: { title: 'गुरु-केतु', line: 'ज्ञान और अलगाव।', body: 'पढ़ाई, और फिर अपना रास्ता अलग बनाना।', shadow: 'पढ़ाई में फँसा रहना।', remedy: 'पढ़ाई के बाद इसे काम में लगाइए।' },
  29: { title: 'शुक्र-केतु', line: 'कला और साधना।', body: 'रचना की समझ और आंतरिक शांति।', shadow: 'रिश्तों में दूरी, अचानक।', remedy: 'दूरी अपनी मर्ज़ी से लीजिए, टालकर नहीं।' },
  30: { title: 'शनि-केतु', line: 'कर्म और अलग होना।', body: 'मेहनत करना, और बीच में छोड़ देना।', shadow: 'बीच में छोड़ना, फिर लौटना।', remedy: 'छोड़ने की बात पक्की कर लीजिए।' },
  31: { title: 'विजयी', line: 'जीतने वाला — अकेलापन के साथ।', body: 'ज़िद्दी जीत, जो कभी नहीं मानता।', shadow: 'अकेलापन और उच्च होने का अहंकार।', remedy: 'साथी लेकर चलिए, अकेले नहीं।' },
  32: { title: 'विजयादित्य', line: 'किस्मत और सोच का मिलन।', body: 'बड़ा सोच, पर काम कम।', shadow: 'सोच में खो जाना, काम न होना।', remedy: 'सोच का लिखित रूप दिखाइए — फिर चलिए।' },
  33: { title: 'विप्रलब्ध', line: 'अचानक बदलाव और खोया हुआ।', body: 'जो था, वह मिल जाता है — अचानक।', shadow: 'कुछ भी स्थायी नहीं लगना।', remedy: 'जो मिले उसे पकड़े रखिए।' },
  34: { title: 'ज्ञानी', line: 'तेज़ दिमाग़ और हर बात में शंका।', body: 'बहुत कुछ पूछता और समझता है।', shadow: 'सबको सही-ग़लत बताने की आदत।', remedy: 'एक बार पूछिए, फिर मान लीजिए।' },
  35: { title: 'अतिह्री', line: 'ज़्यादा परेक्षा और त्याग।', body: 'काम बनता है, पर सुख कम मिलता है।', shadow: 'कमज़ोरी का एहसास।', remedy: 'शरीर और नींद का पूरा ध्यान रखिए।' },
  36: { title: 'शत्रुघाती', line: 'शत्रु से लड़ता रहता है।', body: 'बहुत संघर्ष, पर जीतता हुआ।', shadow: 'कम बात, ज़्यादा लड़ना।', remedy: 'आधी बात छोड़ दीजिए — जीत जाएगा।' },
  37: { title: 'दीप्त', line: 'भाग्य और आँखों की चमक।', body: 'काम सहज होता है, पर आँखों का ध्यान रखना पड़ता है।', shadow: 'आँखों की थकान और अनिद्रा।', remedy: 'रोशनी वाला काम और आँखों का हिसाब रखिए।' },
  38: { title: 'अनुकूल', line: 'सबके साथ ढल जाता है।', body: 'जनता से मेल खाता है, तालमेल ज़्यादा।', shadow: 'अपना स्वभाव खो जाना।', remedy: 'कभी-कभी "ना" कहिए।' },
  39: { title: 'आवेश', line: 'ज़बरदस्ती और काम पर ज़ोर।', body: 'काम पूरा होता ही है, रुकता नहीं।', shadow: 'बीच में कोई दूसरा ज़रूरी काम।', remedy: 'एक काम के बाद दूसरा, साथ नहीं।' },
  40: { title: 'सहज', line: 'सब आसान होता है, पर ख़ुद नहीं करता।', body: 'काम सरल, पर श्रम कम।', shadow: 'मेहनत से भागना।', remedy: 'रोज़ कुछ न कुछ मेहनत कीजिए, चाहे छोटी हो।' },
  41: { title: 'शान्त', line: 'शांति और संतोष।', body: 'कम लालच, स्थिर मन, अच्छे रिश्ते।', shadow: 'न बहुत उम्मीद, न निराशा।', remedy: 'जो मिला उसी में रहिए, यही सबसे बड़ी योग्यता है।' },
  42: { title: 'ईश्वरीय', line: 'कर्म और प्रार्थना दोनों में पूर्णता।', body: 'जो करता है वह पूरा होता है, भाग्य साथ देता है।', shadow: 'कभी-कभी सोच भी अधूरी रह जाती है।', remedy: 'काम शुरू करने से पहले एक मिनट ठहरिए।' },
  43: { title: 'बलवान', line: 'ज़ोर और रुचि दोनों उच्च।', body: 'जो शुरू करता है वह पूरा करता है।', shadow: 'ज़िद और अनुशासन का अभाव।', remedy: 'नियम बनाइए और टूटने न दीजिए।' },
  44: { title: 'विपदा', line: 'मुसीबत से पैदा होता है।', body: 'पहले कठिन, फिर बहुत मज़बूत।', shadow: 'जल्दबाज़ी में और बड़ी मुसीबत।', remedy: 'मुसीबत में धीरज — यही इसकी दवा है।' },
  45: { title: 'अभय', line: 'डर के बावजूद आगे बढ़ता है।', body: 'संकट में सबसे आगे खड़ा होता है।', shadow: 'डर को छुपाना, शांत दिखना।', remedy: 'डर को बोलिए — छिपाने से बड़ा होता है।' },
  46: { title: 'हरिराज', line: 'मेहनत, पर समय के साथ।', body: 'कम देर में बड़ा, पर पहले कुछ नहीं।', shadow: 'धैर्य टूटकर सही समय पर छोड़ देना।', remedy: 'समय को दीजिए — पहले साल सबसे कठिन होते हैं।' },
  47: { title: 'विराट', line: 'छोटे काम, पर विशाल संतोष।', body: 'थोड़े में बहुत, और मन ख़ुश।', shadow: 'बड़े सोच का अभाव।', remedy: 'बड़ा सोच छोड़िए नहीं — बस डर छोड़िए।' },
  48: { title: 'शम्भु', line: 'कर्म और समझ, गहराई में।', body: 'कठिन काम, पर गहराई से समझता है।', shadow: 'सोच में गँठ लग जाना।', remedy: 'हर बात को तीन दिन रुककर सोचिए।' },
  49: { title: 'सर्वेश्वर', line: 'सब कुछ हाथ में मिलता है।', body: 'आज जो चाहा वह मिलता है।', shadow: 'सब कुछ पा लेने की आदत।', remedy: 'दो चीज़ें न छोड़िए — समय और दूर।' },
  50: { title: 'शम्भु (द्वितीय)', line: 'कर्म, दोहरा हुआ।', body: 'जो किया वह दूसरी बार और अच्छा हुआ।', shadow: 'पुरानी ग़लती दोहराना।', remedy: 'जो हुआ उसका हिसाब रखिए।' },
  51: { title: 'कलत्र', line: 'दशहरा — पूर्णता।', body: 'जो बोएगा वह काटेगा, यही नियम है।', shadow: 'छोटे खेल, छोटी सोच।', remedy: 'बड़ा सोचिए, छोटा नहीं।' },
  52: { title: 'बैधृति', line: 'जड़ विकृत — संसार का नियम।', body: 'जो बकवास है, वह भी ठहरता है।', shadow: 'बड़े दावे और जल्दबाज़ी।', remedy: 'बैठकर पाँच मिनट सोचिए, फिर फ़ैसला कीजिए।' },
};

/**
 * Reduce a sum the Anka way.
 *
 * Ordinary numerology stops at nine. This keeps adding until it reaches a
 * number between one and fifty-two, which is why a birth on the nineteenth does
 * not become a one.
 */
export function ankaNumber(dateNumber: number): number {
  let n = dateNumber;

  // Past fifty-two the number is folded back by subtracting the multiples of
  // fifty-two that leave it inside the range, rather than by digit sum.
  while (n > 52) n -= 52;
  while (n < 1) n += 52;

  return n;
}

/** Day, month and year, summed and folded. */
export function ankaFromDate(day: number, month: number, year: number): number {
  return ankaNumber(day + month + year);
}

/**
 * Count the name, the Anka way.
 *
 * Letters are counted A=1 to Z=26 and folded by the same rule. This is not the
 * Chaldean table numerology uses; the system does not have one.
 */
export function ankaFromName(name: string): number {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  if (!letters) return 1;

  let sum = 0;
  for (const ch of letters) sum += ch.charCodeAt(0) - 64;

  return ankaNumber(sum);
}

export interface AnkaResult {
  fromDate: number;
  fromName: number;
  /** Do the two agree. */
  matched: boolean;
  dateMeaning: AnkaMeaning;
  nameMeaning: AnkaMeaning;
  /** What the agreement or the gap means. */
  reading: string;
}

/**
 * The Anka reading of one birth.
 *
 * Both numbers are shown whether or not they match. Averaging them would
 * destroy the only thing this system has that ordinary numerology does not,
 * which is an opinion about whether a person matches their own name.
 */
export function ankaJyotish(day: number, month: number, year: number, name: string): AnkaResult {
  const fromDate = ankaFromDate(day, month, year);
  const fromName = ankaFromName(name);
  const matched = fromDate === fromName;

  const reading = matched
    ? `जन्म-तिथि और नाम दोनों का अंक ${fromDate} है। यह "अंक उच्छिष्ट" माना जाता है — दोनों कहें तो यह अपना मूल्य रखता है।`
    : `जन्म-तिथि का अंक ${fromDate} है और नाम का ${fromName}। दोनों अलग हैं, इसलिए जो तारीख़ कहती है और जो नाम कहता है, वह सामान्यतः एक नहीं होता — दोनों पढ़िए।`;

  return {
    fromDate,
    fromName,
    matched,
    dateMeaning: M[fromDate],
    nameMeaning: M[fromName],
    reading,
  };
}

/** Every meaning, for the reference table on the page. */
export function allAnkaMeanings(): Array<{ number: number } & AnkaMeaning> {
  return Object.keys(M)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({ number: n, ...M[n] }));
}

export type { AnkaMeaning };
