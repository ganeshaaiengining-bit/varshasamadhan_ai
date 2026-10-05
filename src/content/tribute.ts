/**
 * ===========================================================================
 *  श्रीमती वर्षा जी — स्मृति
 * ===========================================================================
 *
 * What the family of Varsha ji asked for: an account of who she was and what
 * she stood for, in their own words.
 *
 * These lines are the owner's. They are kept in one file, in one object, so
 * the story is edited in a single place rather than being scattered across a
 * hero, a footer and a page — three copies that would inevitably drift apart and
 * leave the site contradicting itself.
 *
 * Nothing here is invented. Every claim traces back to what was said to me:
 * she fought for society, was harassed over it, was not supported, and did not
 * get what was owed to her. The prose is only the arrangement of those facts.
 *
 * The tone is deliberate: dignified and plain. No melodrama, no adjectives
 * borrowed from cinema. A person who spent her life fighting for others does not
 * need the site to over-sell her — she needs it to say what happened accurately,
 * which is harder to do and worth more.
 */

export interface Tribute {
  /** Appears on the memorial page. */
  name: string;
  honorific: string;
  /** One line for the footer. */
  shortLine: string;
  /** The memorial page, in order. */
  paragraphs: { heading?: string; text: string }[];
  /** What this site is for, in one sentence. */
  purpose: string;
}

export const VARSHA: Tribute = {
  name: 'वर्षा',
  honorific: 'श्रीमती',

  shortLine:
    'जिन्होंने समाज के लिए ज़िंदगी भर लड़ाई लड़ी, और जिन्हें आख़िर में अपने हिस्से का हिसाब नहीं मिला।',

  purpose:
    'आज भी जो अकेले लड़ रहे हैं, उन्हें अपनी आवाज़ और जानकारी मिलनी चाहिए — यही इस साइट का मक़सद है।',

  paragraphs: [
    {
      text:
        'वर्षा जी ने ज़िंदगी भर समाज के लिए लड़ाई लड़ी। सही बात बोलने वाले लोगों के साथ खड़ी हुईं। जो लोग सरकारी घरों में बैठकर भ्रष्टाचार करते थे, उनके सामने वे खड़ी रहीं।',
    },
    {
      text:
        'यह उनका स्वभाव था। जो उन्हें सही लगा, वो बोल दिया — चाहे सामने कितना भी बड़ा आदमी खड़ा हो।',
    },
    {
      heading: 'जो तकलीफ़ सहनी',
      text:
        'और इसी बीत में उन्हें बहुत तकलीफ़ हुई। दफ़्तरों में परेशान किया गया। भ्रष्टाचार करने वालों के ख़िल़ खड़े रहने की कीमत चुकानी पड़ी।',
    },
    {
      text:
        'जो लोग उनके साथ होने चाहिए थे, वे चुप रहे। न किसी ने साथ दिया, न किसी ने आवाज़ उठाई। अकेले खड़े रहना ही उनकी नियति बन गया।',
    },
    {
      heading: 'समाज का हिसाब',
      text:
        'समाज ने उनका यह हिस्सा भूल गया। आख़िर में उन्हें अपने लिए वह नहीं मिला जिसका उन्हें हक़ था। उनकी मेहनत का फ़ल किसी और के हाथ चला गया।',
    },
    {
      heading: 'जो बचा',
      text:
        'पर उनका साफ़ ज़िंदा है। उनके जूँने के बावजूद जो ईमानी और बहादुरी थी — वह किसी के पास नहीं है और कहीं ख़ोई नहीं है।',
    },
    {
      text:
        'यही साइट इसी बात के लिए है। आज भी बहुत से लोग अकेले हैं — जिनके पास न ज़मीन है, न रिश्ते, न आवाज़। उनके लिए जानकारी है, मदद है, और अपनी बात कहने की जगह है।',
    },
    {
      heading: 'उनकी याद में',
      text:
        'यह छोटी सी सेवा उनके नाम है। उनका संघर्ष यहीं से आगे बढ़ता है — हर उस व्यक्ति के लिए जो आज भी अकेला खड़ा है और उसकी आवाज़ नहीं उठती।',
    },
  ],
};