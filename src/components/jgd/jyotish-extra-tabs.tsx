'use client';

import { chalitOf, type ChalitResult } from '@/content/chalit';
import { ashtakavarga, signVerdict, PRAK_MAX } from '@/content/ashtakavarga';
import { gochar } from '@/content/gochar';
import { grahaShakti, shubhAshubh, janamVivaran } from '@/content/shakti';
import { RASHIS } from '@/content/astrology';
import { NAKSHATRAS } from '@/content/astrology';
import type { Planet } from '@/content/grahas';

/**
 * The four panels that came after the first nine: Chalit, Ashtakavarga, Gochar
 * and Shakti.
 *
 * ── Why they live in their own file ──────────────────────────────────────────
 *
 * jyotish-sheet.tsx had grown past the point where a reader — of the source, not
 * of the page — could find anything. Four more panels in it would have made it
 * worse. What they share is one thing: each one is a whole tab, a single reading
 * with a single heading, and none of them needs the machinery the earlier panels
 * share.
 *
 * ── The rule every panel here follows ────────────────────────────────────────
 *
 * Nothing on this page is printed unless it was computed, and nothing is printed
 * as a number that could not be checked. Where a traditional figure needs a table
 * nobody here has verified — the Bhinn groups of ashtakavarga, the adhika masa,
 * the sixty-year samvatsara name — the panel says so in words instead of showing
 * a confident blank or a confident wrong number.
 */

/** A small titled card, used by every panel below. */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-4">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      {children}
    </section>
  );
}

/** A row of label and value, the shape every panel on this site uses. */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-0">
      <span className="text-ink-subtle">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

/**
 * What every panel here must be able to say when there is no ascendant.
 *
 * Chalit and Karakamsha cannot be worked out without a birth place, because both
 * need a second ascendant. Rather than print the first two charts and leave the
 * other two blank, the panel says which is missing and why — a reader who can see
 * the reason will add a place; one who is told nothing will assume the page is
 * broken.
 */
function NeedsPlace() {
  return (
    <Card title="जन्म का स्थान चाहिए">
      <p className="text-ink-subtle">
        चालित और कार्कांश दोनों में लग्न चाहिए, और लग्न जन्म के स्थान पर निर्भर करता है।
        ऊपर जन्म का नाम, तारीख़, समय और स्थान भरकर दोबारा गणना कीजिए।
      </p>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   चालित · चंद्र · कार्कांश · स्वांश
   ═══════════════════════════════════════════════════════════════════════════ */

export function ChalitPanel({
  jd, latitude, longitudeEast,
}: { jd: number; latitude: number; longitudeEast: number }) {
  const chalit: ChalitResult | null = chalitOf(jd, latitude, longitudeEast);

  if (!chalit) return <NeedsPlace />;

  return (
    <div className="grid gap-5">
      <Card title="चालित · चंद्र · कार्कांश · स्वांश">
        <p className="mb-3 text-ink-subtle">
          एक ही जन्म की चार पढ़ाइयाँ — हर एक अलग राशि से गिनी हुई। चालित लग्न से एक राशि
          पीछे गिनती है, इसलिए लग्न की ही राशि में बैठा ग्रह चालित में द्वादश भाव में आता है।
          चंद्र कुंडली चंद्र की राशि से गिनती है।
        </p>

        <Row label="लग्न" value={`${RASHIS[chalit.lagnaRashi].name} (भाव 1)`} />
        <Row label="चंद्र की राशि" value={RASHIS[chalit.moonRashi].name} />
        <Row label="कार्कांश" value={chalit.karakamshaName} />
        <Row
          label="कार्कांश कब निकला"
          value={`जन्म के ${chalit.karakamshaAfterDays.toFixed(1)} दिन बाद, चंद्र जब उसी अंश पर लौटा`}
        />
        <Row label="स्वांश (शूल राशि)" value={chalit.swanshName} />
        <Row label="चंद्र कुंडली में स्वांश" value={`${chalit.swanshChandraHouse}वाँ भाव`} />
      </Card>

      <Card title="हर ग्रह — चालित और चंद्र भाव">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-sm text-ink-subtle">
                <th className="py-2 pr-3">ग्रह</th>
                <th className="py-2 pr-3">राशि</th>
                <th className="py-2 pr-3">भाव</th>
                <th className="py-2 pr-3">चालित</th>
                <th className="py-2">चंद्र</th>
              </tr>
            </thead>
            <tbody>
              {chalit.grahas.map((g) => (
                <tr key={g.graha} className={g.chalitHouse === 12 ? 'bg-sun/10' : undefined}>
                  <td className="py-2 pr-3 font-medium">{g.name}</td>
                  <td className="py-2 pr-3">{g.rashiName}</td>
                  <td className="py-2 pr-3 tabular-nums">{g.house}</td>
                  <td className="py-2 pr-3 tabular-nums font-bold">{g.chalitHouse}</td>
                  <td className="py-2 tabular-nums">{g.chandraHouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-ink-subtle">
          हल्की पंक्ति वही है जहाँ चालित भाव बारह है — यानी ग्रह लग्न की ही राशि में है।
          यही चालित कुंडली देखने का मुख्य कारण है।
        </p>
      </Card>

      <Card title="कार्कांश कैसे निकाला गया">
        <p className="text-ink-subtle">
          जन्म के समय चंद्र जिस अंश पर था, वही अंश पर चंद्र जब लौटता है — लगभग{' '}
          {chalit.karakamshaAfterDays.toFixed(1)} दिन में — उस समय आकाश में जो लग्न था, वही
          कार्कांश है। गणना यहाँ ब्रह्म पराशर के अनुसार की गई है, पुस्तक से उठाई हुई सूची से नहीं।
        </p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   अष्टकवर्ग
   ═══════════════════════════════════════════════════════════════════════════ */

export function AshtakavargaPanel({ jd }: { jd: number }) {
  const sheet = ashtakavarga(jd);

  return (
    <div className="grid gap-5">
      <Card title="अष्टकवर्ग — हर राशि कितने बिंदु लेती है">
        <p className="mb-3 text-ink-subtle">
          हर ग्रह हर राशि में कुछ न कुछ बिंदु लेता है। जोड़कर देखने पर पता चलता है कि कौनसा
          भाव मज़बूत है और कौनसा कमज़ोर। नीचे "हाल" इसी कुंडली की सबसे मज़बूत राशि से
          मिला कर बताया गया है — इसलिए हर कुंडली का पैमाना अपना अलग होता है।
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-subtle">
                <th className="py-2 pr-3">राशि</th>
                <th className="py-2 pr-3">सर्वाष्टकवर्ग</th>
                <th className="py-2 pr-3">हाल</th>
                <th className="py-2">किसका बिंदु</th>
              </tr>
            </thead>
            <tbody>
              {sheet.sarva.map((total, sign) => {
                // Which graha carries this sign, so a reader can see *why* it is
                // strong rather than being handed a number.
                const best = sheet.grahas
                  .map((g) => ({ name: g.name, value: g.prak[sign] }))
                  .sort((a, b) => b.value - a.value)[0];

                return (
                  <tr key={sign}>
                    <td className="py-2 pr-3 font-medium">{RASHIS[sign].name}</td>
                    <td className="py-2 pr-3 tabular-nums font-bold">{total}</td>
                    <td className="py-2 pr-3">{signVerdict(total, sheet.best)}</td>
                    <td className="py-2 text-ink-subtle">{best.name} ({best.value})</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-ink-subtle">
          अधिकतम {PRAK_MAX * 9} — सब नौ ग्रह मिलकर। अभी इस कुंडली में सबसे ऊँचा{' '}
          {sheet.best} और सबसे नीचा {Math.min(...sheet.sarva)}। ये बिंदु राशि के हैं, भाव के नहीं।
        </p>
      </Card>

      <Card title="हर ग्रह का अपना अष्टकवर्ग">
        <p className="mb-3 text-ink-subtle">
          यहाँ राशियाँ मेष से मीन तक हैं। याद रहे — ग्रह का अष्टकवर्ग उसी कुंडली का होता है
          जिसमें वह पैदा हुआ, इसलिए दो ग्रहों के आकड़े आपस में सीधे मिलाए नहीं जाते।
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-subtle">
                <th className="py-2 pr-3">ग्रह</th>
                {RASHIS.map((r) => (
                  <th key={r.name} className="py-2 pr-2 tabular-nums" title={r.name}>
                    {r.name.slice(0, 2)}
                  </th>
                ))}
                <th className="py-2 tabular-nums">कुल</th>
              </tr>
            </thead>
            <tbody>
              {sheet.grahas.map((g) => (
                <tr key={g.graha}>
                  <td className="py-2 pr-3 font-medium">{g.name}</td>
                  {g.prak.map((value, sign) => (
                    <td
                      key={sign}
                      className={
                        'py-2 pr-2 tabular-nums ' +
                        (value >= 4 ? 'font-bold text-leaf' : value <= 1 ? 'text-ink-subtle' : '')
                      }
                    >
                      {value}
                    </td>
                  ))}
                  <td className="py-2 tabular-nums font-bold">{g.total}</td>
                </tr>
              ))}
            </tbody>
            <tr className="border-t border-line font-bold">
              <td className="py-2 pr-3">सर्वाष्टकवर्ग</td>
              {sheet.sarva.map((total, sign) => (
                <td key={sign} className="py-2 pr-2 tabular-nums">{total}</td>
              ))}
              <td className="py-2 tabular-nums">{sheet.sarvaTotal}</td>
            </tr>
          </table>
        </div>
      </Card>

      <Card title="क्या यहाँ नहीं दिखाया गया, और क्यों">
        <p className="text-ink-subtle">
          भिन्न अष्टकवर्ग — बिन्दु, क्षेत्र, संख्या, त्रिकोण और दृष्टि — यहाँ नहीं है। ये पाँचों
          ब्रह्म पराशर की सूचियों से निकलते हैं, किसी नियम से नहीं। कोई सूची यहाँ याद से नहीं
          लिखी गई है, क्योंकि जाँचने योग्य तरीका न होने पर कोई भी आकड़ा भरोसेमंद नहीं होता।
          इसलिए यहाँ केवल प्राक् और सर्वाष्टकवर्ग दिया गया है, जो गणना से निकलते हैं।
        </p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   गोचर — आज का आकाश
   ═══════════════════════════════════════════════════════════════════════════ */

export function GocharPanel({ jd }: { jd: number }) {
  /*
   * "Now" is the machine's clock, taken as a Julian day so it goes through the
   * same engine as everything else. The instant is printed on the panel so that a
   * reader who opens it twice gets two answers and can tell which is which.
   */
  const now = Date.now() / 86400000 + 2440587.5;
  void jd;

  const sky = gochar(now);

  const when = new Date((now - 2440587.5) * 86400000);

  return (
    <div className="grid gap-5">
      <Card title="आज का आकाश">
        <p className="mb-3 text-ink-subtle">
          यह आज की स्थिति है, जन्म की नहीं। ग्रह चलते रहते हैं — इसलिए यही वह पन्ना है जो
          कोई खोजता है जब कुछ <em>अभी</em> हुआ हो।
        </p>
        <Row
          label="जिस समय की गणना की गई"
          value={when.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
        />
        <Row
          label="वक्री ग्रह"
          value={
            sky.grahas.filter((g) => g.retrograde).map((g) => g.name).join(', ') || 'कोई नहीं'
          }
        />
        <Row
          label="अपनी राशि में"
          value={sky.grahas.filter((g) => g.inOwnSign).map((g) => g.name).join(', ') || 'कोई नहीं'}
        />
      </Card>

      <Card title="नौ ग्रह कहाँ हैं">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-subtle">
                <th className="py-2 pr-3">ग्रह</th>
                <th className="py-2 pr-3">राशि</th>
                <th className="py-2 pr-3">अंश</th>
                <th className="py-2 pr-3">नक्षत्र</th>
                <th className="py-2">गति</th>
              </tr>
            </thead>
            <tbody>
              {sky.grahas.map((g) => (
                <tr key={g.graha}>
                  <td className="py-2 pr-3 font-medium">
                    {g.name}
                    {g.retrograde && <span className="ml-1 text-ink-subtle">(वक्री)</span>}
                  </td>
                  <td className="py-2 pr-3">
                    {g.rashiName}
                    {g.inOwnSign && <span className="ml-1 text-xs text-leaf">अपनी</span>}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">
                    {Math.floor(g.degreesInRashi)}° {Math.round((g.degreesInRashi % 1) * 60)}′
                  </td>
                  <td className="py-2 pr-3">{NAKSHATRAS[g.nakshatra - 1]}</td>
                  <td className="py-2 tabular-nums">
                    {g.dailyMotion.toFixed(3)}°
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="प्रत्येक ग्रह की अपनी दशा">
        <p className="mb-3 text-ink-subtle">
          यह आपकी दशा नहीं है — यह ग्रह की अपनी दशा है, आज जिस राशि में वह है उसके स्वामी
          की। आपकी अपनी विमशोत्तरी दशा दूसरे टैब पर है।
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-subtle">
                <th className="py-2 pr-3">ग्रह</th>
                <th className="py-2 pr-3">राशि</th>
                <th className="py-2 pr-3">दशा</th>
                <th className="py-2">बचे साल</th>
              </tr>
            </thead>
            <tbody>
              {sky.grahaDashas.map((d) => (
                <tr key={d.graha}>
                  <td className="py-2 pr-3 font-medium">{d.name}</td>
                  <td className="py-2 pr-3">{d.sign}</td>
                  <td className="py-2 pr-3">{d.lord} की दशा</td>
                  <td className="py-2 tabular-nums">{d.years.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="यह पन्ना क्या नहीं बताता">
        <p className="text-ink-subtle">
          ग्रह की स्थिति एक <em>स्थिति</em> है, घटना नहीं। एक ही बृहस्पति किसी के सप्तम भाव में
          विवाह के समय भी होता है और विधवा होने के समय भी। अंतर आकाश में नहीं था। इसलिए यहाँ
          यह नहीं लिखा कि क्या होगा — वह बात यहाँ नहीं जानी जा सकती।
        </p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ग्रह शक्ति · शुभ-अशुभ · जन्म विवरण
   ═══════════════════════════════════════════════════════════════════════════ */

export function ShaktiPanel({
  jd, lagnaRashi, weekday,
}: { jd: number; lagnaRashi: number; weekday: number }) {
  const shakti = grahaShakti(jd, lagnaRashi);
  const shubh = shubhAshubh(jd, lagnaRashi);
  const vivaran = janamVivaran(jd, weekday);

  return (
    <div className="grid gap-5">
      <Card title="जन्म विवरण">
        <p className="mb-3 text-ink-subtle">
          जन्म के समय के सारे तथ्य। यही ढाँचा है जिस पर बाकी सब गणना बैठी है।
        </p>
        <Row label="तिथि" value={`${vivaran.tithi} (${vivaran.paksha} पक्ष)`} />
        <Row label="नक्षत्र" value={`${vivaran.nakshatra}, पद ${vivaran.pada}`} />
        <Row label="योग" value={vivaran.yoga} />
        <Row label="करण" value={vivaran.karana} />
        <Row label="वार" value={vivaran.vaara} />
        <Row label="चंद्र मास" value={vivaran.masa} />
        <Row label="अधिक मास" value={vivaran.adhikaMasa === null ? 'यहाँ गिना नहीं गया' : (vivaran.adhikaMasa ? 'है' : 'नहीं')} />
        <Row label="विक्रम संवत" value={vivaran.samvat} />
      </Card>

      <Card title="ग्रह शक्ति — हर ग्रह कितना बलवान">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-subtle">
                <th className="py-2 pr-3">ग्रह</th>
                <th className="py-2 pr-3">बिंदु</th>
                <th className="py-2 pr-3">हाल</th>
                <th className="py-2">कारण</th>
              </tr>
            </thead>
            <tbody>
              {shakti.map((g) => (
                <tr key={g.graha}>
                  <td className="py-2 pr-3 font-medium">{g.name}</td>
                  <td className="py-2 pr-3 tabular-nums font-bold">{g.points}</td>
                  <td className="py-2 pr-3">
                    {g.verdict}
                    {g.combust && <span className="ml-1 text-xs text-danger">दग्ध</span>}
                  </td>
                  <td className="py-2 text-ink-subtle">{g.reasons.join(' · ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-ink-subtle">
          अस्ति यानी सूर्य के बिल्कुल पास — ग्रह का प्रभाव कम हो जाता है। चंद्र को कभी दग्ध नहीं
          माना जाता; नया चंद्र दग्ध नहीं, बस अभी दिखा नहीं।
        </p>
      </Card>

      <Card title="शुभ-अशुभ चालित">
        <p className="mb-3 text-ink-subtle">
          सूर्य की राशि से गिना जाता है। पहले छह राशियाँ शुभ, आगे छह अशुभ।
        </p>
        <Row label="सूर्य की राशि से" value={shubh.fromRashiName} />
        <Row
          label="लग्न किस पक्ष में"
          value={
            shubh.lagnaShubh
              ? `शुभ — ${shubh.shubhSigns.map((s) => RASHIS[s].name).slice(0, 1).join('')} से ${shubh.shubhSigns.map((s) => RASHIS[s].name).slice(-1).join('')} तक`
              : `अशुभ — ${shubh.ashubhSigns.map((s) => RASHIS[s].name).slice(0, 1).join('')} से ${shubh.ashubhSigns.map((s) => RASHIS[s].name).slice(-1).join('')} तक`
          }
        />
        <Row
          label="शुभ राशियाँ"
          value={shubh.shubhSigns.map((s) => RASHIS[s].name).join(', ')}
        />
        <Row
          label="अशुभ राशियाँ"
          value={shubh.ashubhSigns.map((s) => RASHIS[s].name).join(', ')}
        />
      </Card>
    </div>
  );
}

export type { Planet };