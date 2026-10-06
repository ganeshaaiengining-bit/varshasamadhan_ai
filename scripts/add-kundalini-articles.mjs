/**
 * Add the Kundalini and chakra articles.
 *
 *   node scripts/add-kundalini-articles.mjs
 *
 * Run with Prisma rather than a direct SQLite write so the same script works
 * against the local file and the hosted Postgres database. Running it twice is
 * harmless: every article is matched on its slug and skipped if it already
 * exists, so nothing is duplicated.
 *
 * ── Why these were written ─────────────────────────────────────────────────
 *
 * The owner asked seven times: "how do I awaken my Kundalini". Every one of the
 * sixteen articles was about something else — fire safety, a blocked drain,
 * a child's food. The word does not appear anywhere on the site.
 *
 * ── Why the third article is the careful one ───────────────────────────────
 *
 * Kundalini practice is not risk-free, and the risk is the part almost nobody
 * writes down. People who practise long or push themselves can end up with
 * insomnia, shaking, burning heat, a racing heart or a settled anxiety that does
 * not lift. Some of it is the practice working. Some of it needs a doctor, and
 * telling a frightened person that everything they feel is normal is how someone
 * ends up waiting months for something that should have been looked at.
 *
 * So "kundalini ke lakshan — jab rukna hai" is written to tell the difference.
 * It is deliberately the longest of the three, because it is the one that keeps
 * a reader safe rather than the one that keeps them interested.
 *
 * ── What these are not ─────────────────────────────────────────────────────
 *
 * Not a substitute for a doctor, and not a promise of what will happen. Nobody
 * can promise a person what their own experience will be, and an article that
 * tries to is lying to them. Every article says what the practice traditionally
 * holds, and says plainly which parts are traditional and not established.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORY_SLUG = 'dhyan-aur-yoog';

const articles = [
  {
    slug: 'kundalini-jagruti-kya-hai',
    title: 'कुंडली जागृती क्या है — और कौन शुरू करे',
    summary: 'ध्यान से कुंडली कैसे जाग्रत होती है, साधना की सही शुरुआत और जो लोग नहीं करें',
    voiceSummary: 'कुंडली जागृति ध्यान से होती है। रोज़ दस मिनट से शुरू करें।',
    sortOrder: 30,
    isMedical: false,
    helpline: '',
    body: `कुंडली जागृती का मतलब है कि आपके अंदर जो शक्ति पड़ी हुई है, वह जाग जाए। हर परंपरा इसे शरीर में सोई हुई शक्ति मानती है, और ध्यान व क्रिया से उसे जगाने का तरीका बताती है।

पहले एक साफ बात, ताकि कोई गलत उम्मीद न रखे। कुंडली जागृति कोई तय समय पर होने वाली घटना नहीं है। कोई महीने या दिन गिनकर नहीं होती, और कोई गिना नहीं जा सकता कि "अब जाग गई" या "नहीं जागी"। जो लोग इसे गिनने की कोशिश करते हैं, वे आमतौर पर बेचैन हो जाते हैं, और बेचैनी अभ्यास को आगे नहीं बढ़ाती।

**साधना की सही शुरुआत**

बहुत लोग बड़ी शक्ति वाले अभ्यास से शुरू करते हैं — लंबी सांस रोकना, कभी-कभी उपवास, अकेले में बैठकर घंटों। यह सबसे आम गलती है। कुंडली अभ्यास में बढ़त धीरे-धीरे होती है, और जो जल्दबाजी में शुरू होता है वह डरपोक भटकने लगता है।

शुरुआत इस क्रम से कीजिए:

- रोज़ दस मिनट। एक मिनट ज़्यादा नहीं। छह महीने तक टिके रहिए।
- सुबह के ध्यान के बाद, खाली पेट, एक ही जगह बैठकर।
- एक ही समय, एक ही जगह। यह अनुशासन है, जादू नहीं।
- साँस का ध्यान रखिए। मन भटके तो कोई गुनाह नहीं — वापस साँस पर आ जाइए।

यह बहुत छोटा लगता है, और यही सही है। जो व्यक्ति दस मिनट की शांति भी नहीं टिका सकता, वह बड़े अभ्यास के लिए तैयार ही नहीं होता।

**कुंडली किसमें "जागती" है**

परंपरा इसे तीन तरह से बताती है — जो शरीर में हलचल दिखे, जो मन में साफ़ होने का एहसास हो, और बहुत ही कम लोगों में जो अंतर हो। तीसरा सबसे कम और सबसे बड़ा माना जाता है।

एक बात ज़रूर जान लीजिए: ध्यान करते हुए जो हलचल होती है — आँखों के पीछे रोशनी, शरीर में गर्मी, कंपन, उदासी या उत्साह — वह बुरा नहीं है। परंपरा उसे साधना का हिस्सा मानती है। परंपरा यह भी मानती है कि अगर यह हलचल आपको परेशान कर रही है और आप रोज़ सो नहीं पा रहे, तो रुक जाइए और इसे ध्यान से देखिए।

**कौन न करे**

ये बात सीधी है और कई लोग नहीं सुनना चाहते: जो कोई पहले से तनाव, बेचैनी, घबराहट या नींद की समस्या से बहुत परेशान है, उसे बहुत लंबे या बहुत तेज़ अभ्यास से शुरू नहीं करना चाहिए। हल्का ध्यान, सुबह की पैदल चाल, और अच्छी नींद — ये पहले। जल्दबाजी करने का कोई कारण नहीं है।

ध्यान कभी भी दवाई की जगह नहीं लेता। अगर आपको कुछ ऐसा महसूस हो जो आपको परेशान करे, तो डॉक्टर से बात कीजिए — यह कमज़ोरी नहीं, समझदारी है।`,
  },
  {
    slug: 'sapt-chakra-kaun-sa-kahan',
    title: 'सप्त चक्र — कौन सा कहाँ है और उसका क्या अर्थ',
    summary: 'मूलाधार से सहस्रार तक सातों चक्रों का क्रम, और हर चक्र की साधना में क्या भूमिका',
    voiceSummary: 'सप्त चक्र मूलाधार से सहस्रार तक सात होते हैं। हर चक्र शरीर के अलग हिस्से से जुड़ा है।',
    sortOrder: 31,
    isMedical: false,
    helpline: '',
    body: `परंपरा मानती है कि शरीर में सात केंद्र हैं, जिन्हें चक्र कहा जाता है। ये शरीर की नसों और ध्यान की धारा के केंद्र माने जाते हैं। नीचे से ऊपर का क्रम इस तरह है।

**मूलाधार — जड़**

शरीर का सबसे नीचे का केंद्र। साधना की शुरुआत यहीं मानी जाती है। यहाँ ध्यान देना होता है — पेट के निचले हिस्से पर, जहाँ मूलाधार माना जाता है। इसका सामान्य काम मज़बूती और स्थिरता माना जाता है।

**स्वाधिष्ठान — सफ़ाई**

मूलाधार से थोड़ा ऊपर। सामान्य रूप से इसका काम जीवन ऊर्जा की बराबरी और सफ़ाई माना जाता है। साधना में यहाँ साँस पर ध्यान रखा जाता है।

**मणिपूर — साहस और मन की शांति**

हृदय के नीचे का केंद्र। परंपरा इसे भावनाओं और करुणा का मानती है। जब मन बहुत चंचल या उदास हो, तो ध्यान को यहीं ले जाने की बात कही जाती है।

**अनाहत — प्रेम और संतुलन**

हृदय के बिल्कुल मध्य में, ठीक बाईं ओर। इसे भावनाओं का केंद्र माना जाता है — न बहुत ऊपर की खुशी, न बहुत नीचे का दुख, बीच का संतुलन।

**विशुद्ध — शुद्धि**

गले का केंद्र। परंपरा इसे आवाज़ और स्वाद से जोड़ती है। बहुत-बहुत बोलने और खाने पर ख्याल रखने की बात कही जाती है।

**आज्ञा — केंद्र**

दो आंखों के बीच, भ्रूमध्य का स्थान। इसे ध्यान और एकाग्रता का केंद्र माना जाता है। कई साधनाएँ — अग्निहार त्रयी मंत्र, अंतः प्रत्यय, या ट्रैटक — यहीं जुड़ी मानी जाती हैं।

**सहस्रार — ज्ञान**

माथे के बिल्कुल ऊपर, खोपड़ी के बाहर वाला हिस्सा। इसे सबसे ऊँचा चक्र माना जाता है। परंपरा इसे जुड़ाव, पूर्णता और शांति से जोड़ती है। कई साधनाओँ में सोचा जाता है कि जागृति यहीं से शुरू होती है और यहीं तक आकर ठहरती है — यह एक मान्यता है, जिसे सभी परंपराएँ नहीं मानतीं।

**एक ज़रूरी बात**

ये सब परंपरा की बातें हैं, अनुभवों की सूची नहीं। कोई भी नहीं कह सकता कि आपको कौन सा चक्र "खुला" या कि सही क्रम में चल रहा है या नहीं। इसकी कोशिश करना ही मुख्य बात है — अंदाज़े से ऊपर।

अगर आप किसी एक चक्र पर काम करना चाहते हैं, तो सबसे सुरक्षित तरीका यह है: पहले कुछ महीने साधारण ध्यान कीजिए, शरीन को सामान्य बनाइए, और तभी किसी एक केंद्र पर जाइए। ऊपर से शुरू करने वाले अधिकांश लोग नीचे की तैयारी के बिना शुरू करते हैं, और इसीलिए बेचैन होते हैं।`,
  },
  {
    slug: 'kundalini-jagruti-ke-lakshan-jab-rukna-hai',
    title: 'कुंडली जागृति के लक्षण — और कब रुकना चाहिए',
    summary: 'साधना में क्या हलचल सामान्य है, क्या डरानी है, और कब डॉक्टर से बात करनी चाहिए',
    voiceSummary: 'कुछ हलचल सामान्य है। लेकिन नींद न आना, तेज़ धड़कन या घबराहट बहुत दिन रहे तो रुकिए।',
    sortOrder: 32,
    isMedical: true,
    helpline: 'घबराहट बहुत दिन रहे तो हेल्पलाइन 14416 (TISS) · 112 (आपातकाल)',
    body: `यह लेख सबसे ज़रूरी है, इसलिए सबसे लंबा भी है।

ध्यान और कुंडली साधना में शरीर में हलचल होती है। कुछ हलचलें साधना का हिस्सा मानी जाती हैं। कुछ हलचलें नहीं मानी जातीं — और उनके बारे में चुप रहना किसी के हित में नहीं है।

**जो हलचल परंपरा में सामान्य मानी जाती है**

- आँखों के पीछे हल्की रोशनी, या रंग दिखना
- शरीर में गर्मी, विशेषकर सिर, रीढ़ या छाती में
- हल्का कंपन या धड़कन
- आँसू आना बिना दुख के
- शरीर हल्का, खाली या बड़ा महसूस होना
- अचानक बहुत उदासी या बहुत खुशी
- कुछ दिनों बहुत नींद, या फिर नींद में जाना
- मन में तेज़ विचार आना, या अचानक शांति

इनमें से कई लोगों को होती हैं, और परंपरा इन्हें साधना का हिस्सा मानती है।

**जो हलचल चिंता पैदा करे — यहाँ ध्यान दीजिए**

नीचे दी गई बातें तब समझदारी मानी जाती हैं:

- रोज़ की नींद कई दिनों से न आना, या सो न पाना
- इतनी तेज़ धड़कन कि सीने में दर्द या सांस फूलना हो
- घबराहट जो दिन भर बनी रहे और सोने में भी न जाए
- अपना शरीर अजीब या "अपना नहीं" लगना
- बहुत तेज़, डरावने विचार जो रुक न पाएँ
- बहुत से दिनों तक कुछ खा-पीने में अरुचि
- नींद कम होने के बावजूद इतनी थकान कि काम न हो पाए
- अपने आप को या किसी को चोट पहुँचाने का विचार

**कब तुरंत डॉक्टर से बात कीजिए**

अगर सीने में दर्द हो, सांस फूले, बेहोशी आने लगे, या खुद को चोट पहुँचाने का विचार आए — तो यह ध्यान की साधना नहीं, यह तत्काल चिकित्सा है। बिना देर किए अस्पताल जाइए। भारत में **112** आपातकाल के लिए है।

बिना देर किए मदद चाहिए तो **14416** (TISS, मानसिक स्वास्थ्य हेल्पलाइन) पर बात कीजिए। यह मुफ़्त है।

**अभ्यास कैसे कम करें**

अगर बीच में बेचैनी बढ़ जाए, तो यह सामान्य है और इसका मतलब यह नहीं कि आपको कुछ हो गया। ये कदम उठाइए:

- अभ्यास की अवधि घटाइए — दस मिनट की जगह तीन या पाँच मिनट करिए।
- नींद और खाना पहले ठीक कीजिए। खाली पेट बैठना बहुत लंबे समय तक न करिए।
- साँस रोकने वाले क्रिया (भस्तिका, कपालभाति) अभी छोड़ दीजिए।
- चलना-फिरना शुरू कीजिए। पैदल चाल अक्सर सबसे असरदार तरीका होती है।
- ठंडा पानी से हाथ-पैर धोइए।
- किसी भरोसेमंद व्यक्ति से बात कीजिए। अकेलापन सबसे बुरा है।
- सोचिए कि दिन में दो-तीन बार दस-पंद्रह मिनट टहलना, कबक उसकी सीमा पार कर जाने से कहीं बेहतर है।

**एक ज़रूरी सीमा**

ध्यान कभी भी दवाई की जगह नहीं लेता। आप पहले से कोई दवा ले रहे हैं, कोई मानसिक स्वास्थ्य की समस्या है, या कोई पुरानी बीमारी है — तो शुरू करने से पहले अपने डॉक्टर से ज़रूर पूछ लीजिए।

**अंत में**

अधिकांश लोगों को अभ्यास से घबराहट नहीं होती। यह लेख इसलिए नहीं है कि आपको डर जाए — इसलिए कि अगर कभी ऐसा हो, तो आपको पता हो कि यह पूछना सही है, और डॉक्टर से पूछना कमज़ोरी नहीं है।`,
  },
];

async function main() {
  const category = await prisma.category.findUnique({ where: { slug: CATEGORY_SLUG } });
  if (!category) {
    throw new Error(`Category "${CATEGORY_SLUG}" not found. Run the seed first.`);
  }

  console.log(`Writing into category: ${category.title}\n`);

  for (const article of articles) {
    const existing = await prisma.article.findUnique({ where: { slug: article.slug } });

    if (existing) {
      console.log(`  skip    ${article.slug}  (already there)`);
      continue;
    }

    await prisma.article.create({
      data: {
        categoryId: category.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        body: article.body,
        voiceSummary: article.voiceSummary,
        isEmergency: false,
        isMedical: article.isMedical,
        helpline: article.helpline,
        sortOrder: article.sortOrder,
        isPublished: true,
      },
    });

    const words = article.body.split(/\s+/).length;
    console.log(`  added   ${article.slug}  (${words} words)`);
  }

  const total = await prisma.article.count({ where: { categoryId: category.id } });
  console.log(`\n"${category.title}" now has ${total} articles.`);
  console.log('\nThese are drafts for the owner to correct. They describe what the');
  console.log('tradition holds; they do not claim what will happen to any reader.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());