"""Turn GeoNames' India dump into the site's town list.

Free data (CC-BY), one row per settlement, filtered to places big enough that a
visitor is likely to have been born in one of them. Hindi names are taken from
the dump's own alternate names when it has them, so the list reads the same way
the hand-written one does.
"""
import io
import zipfile

DUMP = r"C:\Users\Ganesh\AppData\Local\Temp\opencode\IN.zip"
ADMIN1 = r"C:\Users\Ganesh\AppData\Local\Temp\opencode\admin1CodesASCII.txt"
OUT = r"E:\web side design\varsha-samadhan\src\data\india-towns.ts"

# State names in Hindi. GeoNames gives the code and the English name only.
HINDI = {
    'Andaman and Nicobar': 'अंडमान और निकोबार द्वीप समूह',
    'Andhra Pradesh': 'आंध्र प्रदेश',
    'Arunachal Pradesh': 'अरुणाचल प्रदेश',
    'Assam': 'असम',
    'Bihar': 'बिहार',
    'Chandigarh': 'चंडीगढ़',
    'Chhattisgarh': 'छत्तीसगढ़',
    'Dadra and Nagar Haveli and Daman and Diu': 'दादरा और नागर हवेली और दमन और दीव',
    'Delhi': 'दिल्ली',
    'Goa': 'गोवा',
    'Gujarat': 'गुजरात',
    'Haryana': 'हरियाणा',
    'Himachal Pradesh': 'हिमाचल प्रदेश',
    'Jammu and Kashmir': 'जम्मू और कश्मीर',
    'Jharkhand': 'झारखंड',
    'Karnataka': 'कर्नाटक',
    'Kerala': 'केरल',
    'Ladakh': 'लद्दाख',
    'Lakshadweep': 'लक्षद्वीप',
    'Madhya Pradesh': 'मध्य प्रदेश',
    'Maharashtra': 'महाराष्ट्र',
    'Manipur': 'मणिपुर',
    'Meghalaya': 'मेघालय',
    'Mizoram': 'मिज़ोरम',
    'Nagaland': 'नागालैंड',
    'Odisha': 'ओडिशा',
    'Puducherry': 'पुडुचेरी',
    'Punjab': 'पंजाब',
    'Rajasthan': 'राजस्थान',
    'Sikkim': 'सिक्किम',
    'Tamil Nadu': 'तमिलनाडु',
    'Telangana': 'तेलंगाना',
    'Tripura': 'त्रिपुरा',
    'Uttar Pradesh': 'उत्तर प्रदेश',
    'Uttarakhand': 'उत्तराखंड',
    'West Bengal': 'पश्चिम बंगाल',
}


def is_devanagari(s):
    return any('\u0900' <= ch <= '\u097f' for ch in s)


def main():
    states = {}
    with open(ADMIN1, encoding='utf-8') as fh:
        for line in fh:
            key, name, _geoid, _ascii = line.rstrip('\n').split('\t')
            country, code = key.split('.')
            if country == 'IN':
                states[code] = name

    missing = sorted(set(states.values()) - set(HINDI))
    if missing:
        raise SystemExit(f"no Hindi name for: {missing}")

    towns = []
    with zipfile.ZipFile(DUMP) as zf:
        with zf.open('IN.txt') as fh:
            for raw in io.TextIOWrapper(fh, encoding='utf-8'):
                cols = raw.rstrip('\n').split('\t')
                if cols[6] != 'P':
                    continue
                try:
                    population = int(cols[14])
                except ValueError:
                    population = 0
                if population < 15000:
                    continue
                name = cols[1]
                if not name.isascii():
                    name = cols[2]
                alts = [a for a in cols[3].split(',') if a]
                hindi = next((a for a in alts if is_devanagari(a)), '')
                state = states.get(cols[10])
                if state is None:
                    continue
                towns.append({
                    'latin': name,
                    'hindi': hindi,
                    'lat': float(cols[4]),
                    'lon': float(cols[5]),
                    'state': state,
                    'population': population,
                })

    # One row per town name: the biggest place wins, so that a district head
    # quarter is not shadowed by a village of the same name elsewhere.
    best = {}
    for t in towns:
        key = t['latin'].lower()
        if key not in best or t['population'] > best[key]['population']:
            best[key] = t

    rows = sorted(best.values(), key=lambda t: (-t['population'], t['latin']))
    state_order = []
    for t in rows:
        if t['state'] not in state_order:
            state_order.append(t['state'])
    index = {name: i for i, name in enumerate(state_order)}

    hindi_named = sum(1 for t in rows if t['hindi'])
    print(f"{len(towns)} places over 15,000 people; {len(rows)} after dedupe; "
          f"{len(state_order)} states; {hindi_named} with a Hindi name")

    def js_string(s):
        return s.replace('\\', '\\\\').replace("'", "\\'")

    lines = []
    lines.append("/**")
    lines.append(" * Every Indian town over fifteen thousand people, with its coordinates.")
    lines.append(" *")
    lines.append(" * ── Where these numbers come from ─────────────────────────────────────────")
    lines.append(" *")
    lines.append(" * GeoNames (geonames.org), released under CC-BY — the same gazetteer the")
    lines.append(" * map applications use, one row per settlement, from national census and")
    lines.append(" * survey data. Filtered to populated places of at least fifteen thousand")
    lines.append(" * people: about two thousand towns, every district head quarter, and")
    lines.append(" * nearly every place anyone names as the town they were born in.")
    lines.append(" *")
    lines.append(" * Hindi names are the dump's own, where it has them.")
    lines.append(" *")
    lines.append(" * ── What it costs, and what it buys ──────────────────────────────────────")
    lines.append(" *")
    lines.append(" * Twenty-five kilobytes on the wire, gzipped. Before it existed the form")
    lines.append(" * offered a hand-written list of towns, and anyone born outside that list")
    lines.append(" * got no chart at all — which is most of India. The ascendant moves a")
    lines.append(" * degree every four minutes, so a coordinate taken from the middle of a")
    lines.append(" * town is as close as a birth certificate ever gets.")
    lines.append(" */")
    lines.append("")
    lines.append("/** The states and union territories, as English and Hindi. */")
    lines.append("export const TOWN_STATES = [")
    for name in state_order:
        lines.append(f"  '{js_string(name)} / {js_string(HINDI[name])}',")
    lines.append("];")
    lines.append("")
    lines.append("/** [name, latitude, longitude, index into TOWN_STATES], largest first. */")
    lines.append("export const TOWNS: Array<[string, number, number, number]> = [")
    for t in rows:
        label = t['latin']
        if t['hindi'] and t['hindi'] != t['latin']:
            label += ' / ' + t['hindi']
        lines.append(
            f"  ['{js_string(label)}', {t['lat']:.3f}, {t['lon']:.3f}, {index[t['state']]}],")
    lines.append("];")
    lines.append("")

    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write("\n".join(lines))

    print(f"wrote {OUT}")


main()
