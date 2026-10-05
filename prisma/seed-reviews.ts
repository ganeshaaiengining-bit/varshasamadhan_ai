/**
 * ===========================================================================
 *  REVIEWS — seed
 *
 *  Fictional testimonials, clearly written as samples so no real person is
 *  quoted. They exist to show the owner what a filled-in reviews section looks
 *  like; delete or replace them before the site goes live.
 *
 *  Every one carries `is_approved: false` except the first few, so the admin
 *  queue has something real to moderate.
 *
 *  Run:  npx tsx prisma/seed-reviews.ts
 * ===========================================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REVIEWS = [
  {
    authorName: 'कमला देवी',
    city: 'पुणे',
    rating: 5,
    comment:
      'मैं 68 साल की हूँ और नेटवर्क नहीं चलाता। आवाज़ से पूछा, तुरंत हिंदी में जवाब मिला और वो सुन भी आया। पहली बार ऐसा लगा कि कोई सच में सुन रहा है।',
    isApproved: true,
    reply: 'आपका अनुभव सुनकर अच्छा लगा। आप हमेशा आवाज़ से पूछ सकती हैं — कोई दिक्क़त नहीं।',
  },
  {
    authorName: null,
    city: 'नासिक',
    rating: 5,
    comment:
      'बिजली चली गई थी रात में। सिलेंडर बंद करने का तरीक़ा यहाँ पढ़ा, पहले बहुत डर लग रहा था। धन्यवाद।',
    isApproved: true,
    reply: null,
  },
  {
    authorName: 'रमेश चंद्र',
    city: 'सोलापुर',
    rating: 4,
    comment:
      'बच्चे की पढ़ाई वाली जानकारी बहुत काम आई। लेकिन कहीं-कहीं बड़े अक्षरों में लिखा हो तो और अच्छा होता, आँखों में दर्द होता है।',
    isApproved: true,
    reply:
      'आपकी बात सही है। अक्षरों का आकार बढ़ाने का विकल्प जल्द जोड़ा जाएगा। धन्यवाद कि बताया।',
  },
  {
    authorName: 'सुनीता',
    city: 'मुम्बई',
    rating: 5,
    comment:
      'माँ को दवा का समय याद नहीं रहता। यहाँ सामान्य दिनचर्या लिखी है, उससे मदद मिली। मुफ़्त है, किसी ने पैसे नहीं लिए।',
    isApproved: true,
    reply: null,
  },
  {
    authorName: 'अनिल कुमार',
    city: 'अहमदाबाद',
    rating: 3,
    comment: 'सवाल पूछा तो जवाब आया, पर थोड़ा देर में। और जवाब कभी-कभी अधूरा लगता है।',
    isApproved: false,
    reply: null,
  },
  {
    authorName: null,
    city: 'भोपाल',
    rating: 5,
    comment:
      'मेरे पिताजी ने ऐप कभी नहीं चलाया। मैंने उन्हें पढ़कर सुना दिया, उन्होंने कहा अच्छा लिखा है।',
    isApproved: false,
    reply: null,
  },
  {
    authorName: 'गीता अय्यर',
    city: 'कोच्चि',
    rating: 4,
    comment:
      'आपातकाल वाला हिस्सा बहुत अच्छा है। नंबर साफ़ दिखते हैं। धन्यवाद ईश्वर को।',
    isApproved: false,
    reply: null,
  },
  {
    authorName: 'हरप्रीत सिंह',
    city: 'लुधियाना',
    rating: 2,
    comment:
      'मैंने बार-बार कोशिश की पर काम नहीं कर रहा। बहुत परेशान हुआ। कोई और तरीक़ा बताइए।',
    isApproved: false,
    reply: null,
  },
];

async function main() {
  const existing = await prisma.review.count();

  for (const review of REVIEWS) {
    await prisma.review.create({ data: { target: '*', ...review } });
  }

  const total = await prisma.review.count();
  const pending = await prisma.review.count({ where: { isApproved: false } });
  const live = await prisma.review.count({ where: { isApproved: true } });

  console.log(`  नई समीक्षाएँ जोड़ी गईं: ${REVIEWS.length}`);
  console.log(`  अब कुल: ${total} (पहले से थीं: ${existing})`);
  console.log(`    दिख रही हैं: ${live}`);
  console.log(`    मंज़ूरी बाकी: ${pending}\n`);
  console.log('  ये सब नमूना हैं — वास्तविक लोगों का कथन नहीं।');
  console.log('  लाइव जाने से पहले /admin/reviews से हटा दें।');
  console.log('\n  /reviews — समीक्षाएँ देखें और अपनी लिखें।');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());