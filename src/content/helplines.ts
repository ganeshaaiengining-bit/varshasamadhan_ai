/**
 * ===========================================================================
 *  EMERGENCY HELPLINES, BY COUNTRY
 * ===========================================================================
 *
 * The audience is not all in one place. A visitor in India, one in Britain and
 * one in Kenya all need "who do I call" — and the numbers are not the same.
 * Showing 112 to someone whose ambulance number is 108, or 911 to someone in
 * India, wastes the one moment the number mattered.
 *
 * ── A caveat that is part of the data, not a footnote ──────────────────────
 *
 * These numbers are correct as far as they are widely published, and the
 * international prefix for emergency services is stable almost everywhere.
 * Numbers are still **not** something to rely on blindly: local arrangements
 * change, some countries have several valid numbers, and mobile networks route
 * differently from landlines. The interface says so wherever it shows a number.
 * A service for people who may be in difficulty should not imply a certainty it
 * does not have.
 *
 * `primary` is the single number to reach for. The rest are the specific
 * services, shown as secondary because they vary more between districts than
 * the primary does.
 *
 * Run:  node scripts/check-helplines.mjs
 * ===========================================================================
 */

export interface Helpline {
  /** The label shown next to the number. */
  label: string;
  /** Digits only, as dialled domestically. */
  number: string;
  /** `tel:` value. Kept separate so a number with spaces still dials. */
  tel: string;
  /** Whether this one is free to call, where that is known. */
  free?: boolean;
}

export interface Country {
  /** ISO 3166-1 alpha-2. */
  code: string;
  /** Name in the visitor's own language is not stored; this is the English name. */
  name: string;
  /** Shown on the picker, in the script the visitor is likely to read. */
  native: string;
  primary: string;
  tel: string;
  secondary: Helpline[];
}

export const COUNTRIES: Country[] = [
  {
    code: 'IN', name: 'India', native: 'भारत', primary: '112', tel: '112',
    secondary: [
      { label: 'एम्बुलेंस / Ambulance', number: '108', tel: '108' },
      { label: 'महिला हेल्पलाइन / Women', number: '181', tel: '181', free: true },
      { label: 'बच्चों की शिकायत / Child protection', number: '1098', tel: '1098', free: true },
      { label: 'मानसिक सहायता / Mental health', number: '14416', tel: '14416', free: true },
    ],
  },
  { code: 'US', name: 'United States', native: 'United States', primary: '911', tel: '911',
    secondary: [{ label: 'Poison control', number: '1-800-222-1222', tel: '18002221222' }] },
  { code: 'CA', name: 'Canada', native: 'Canada', primary: '911', tel: '911', secondary: [] },
  { code: 'GB', name: 'United Kingdom', native: 'United Kingdom', primary: '999', tel: '999',
    secondary: [{ label: 'NHS non-emergency', number: '111', tel: '111' }] },
  { code: 'IE', name: 'Ireland', native: 'Ireland', primary: '112', tel: '112', secondary: [] },
  { code: 'AU', name: 'Australia', native: 'Australia', primary: '000', tel: '000',
    secondary: [{ label: 'Lifeline', number: '13 11 14', tel: '131114', free: true }] },
  { code: 'NZ', name: 'New Zealand', native: 'New Zealand', primary: '111', tel: '111', secondary: [] },
  { code: 'AE', name: 'United Arab Emirates', native: 'الإمارات', primary: '999', tel: '999',
    secondary: [{ label: 'Ambulance / الإسعاف', number: '998', tel: '998' }] },
  { code: 'SA', name: 'Saudi Arabia', native: 'السعودية', primary: '911', tel: '911', secondary: [] },
  { code: 'QA', name: 'Qatar', native: 'قطر', primary: '999', tel: '999', secondary: [] },
  { code: 'KW', name: 'Kuwait', native: 'الكويت', primary: '112', tel: '112', secondary: [] },
  { code: 'PK', name: 'Pakistan', native: 'پاکستان', primary: '15', tel: '15',
    secondary: [{ label: 'Rescue / emergency', number: '1122', tel: '1122' }] },
  { code: 'BD', name: 'Bangladesh', native: 'বাংলাদেশ', primary: '999', tel: '999',
    secondary: [{ label: 'Women and children', number: '109', tel: '109', free: true }] },
  { code: 'LK', name: 'Sri Lanka', native: 'ශ්‍රී ලංකා', primary: '119', tel: '119',
    secondary: [{ label: 'Police / පොලිස', number: '110', tel: '110' }] },
  { code: 'NP', name: 'Nepal', native: 'नेपाल', primary: '100', tel: '100',
    secondary: [{ label: 'Ambulance', number: '102', tel: '102' }] },
  { code: 'BT', name: 'Bhutan', native: 'འབྲུག', primary: '113', tel: '113', secondary: [] },
  { code: 'MV', name: 'Maldives', native: 'ދިވެހިރާއްޖެ', primary: '999', tel: '999', secondary: [] },
  { code: 'CN', name: 'China', native: '中国', primary: '110', tel: '110',
    secondary: [
      { label: '救护车 / Ambulance', number: '120', tel: '120' },
      { label: '火警 / Fire', number: '119', tel: '119' },
    ] },
  { code: 'JP', name: 'Japan', native: '日本', primary: '110', tel: '110',
    secondary: [{ label: '救急車 / Ambulance and fire', number: '119', tel: '119' }] },
  { code: 'KR', name: 'South Korea', native: '대한민국', primary: '112', tel: '112', secondary: [] },
  { code: 'SG', name: 'Singapore', native: 'Singapore', primary: '999', tel: '999',
    secondary: [{ label: 'Ambulance', number: '995', tel: '995' }] },
  { code: 'MY', name: 'Malaysia', native: 'Malaysia', primary: '999', tel: '999', secondary: [] },
  { code: 'ID', name: 'Indonesia', native: 'Indonesia', primary: '112', tel: '112', secondary: [] },
  { code: 'TH', name: 'Thailand', native: 'ประเทศไทย', primary: '191', tel: '191',
    secondary: [{ label: 'Ambulance', number: '1669', tel: '1669' }] },
  { code: 'VN', name: 'Vietnam', native: 'Việt Nam', primary: '113', tel: '113',
    secondary: [{ label: 'Cứu thương / Ambulance', number: '115', tel: '115' }] },
  { code: 'PH', name: 'Philippines', native: 'Pilipinas', primary: '911', tel: '911', secondary: [] },
  { code: 'KH', name: 'Cambodia', native: 'កម្ពុជា', primary: '119', tel: '119', secondary: [] },
  { code: 'MM', name: 'Myanmar', native: 'မြန်မာ', primary: '199', tel: '199', secondary: [] },
  { code: 'DE', name: 'Germany', native: 'Deutschland', primary: '112', tel: '112', secondary: [] },
  { code: 'FR', name: 'France', native: 'France', primary: '112', tel: '112',
    secondary: [{ label: 'Samu / Ambulance', number: '15', tel: '15' }] },
  { code: 'IT', name: 'Italy', native: 'Italia', primary: '112', tel: '112', secondary: [] },
  { code: 'ES', name: 'Spain', native: 'España', primary: '112', tel: '112', secondary: [] },
  { code: 'PT', name: 'Portugal', native: 'Portugal', primary: '112', tel: '112', secondary: [] },
  { code: 'NL', name: 'Netherlands', native: 'Nederland', primary: '112', tel: '112', secondary: [] },
  { code: 'BE', name: 'Belgium', native: 'België', primary: '112', tel: '112', secondary: [] },
  { code: 'CH', name: 'Switzerland', native: 'Schweiz', primary: '112', tel: '112', secondary: [] },
  { code: 'AT', name: 'Austria', native: 'Österreich', primary: '112', tel: '112', secondary: [] },
  { code: 'SE', name: 'Sweden', native: 'Sverige', primary: '112', tel: '112', secondary: [] },
  { code: 'NO', name: 'Norway', native: 'Norge', primary: '112', tel: '112', secondary: [] },
  { code: 'DK', name: 'Denmark', native: 'Danmark', primary: '112', tel: '112', secondary: [] },
  { code: 'FI', name: 'Finland', native: 'Suomi', primary: '112', tel: '112', secondary: [] },
  { code: 'PL', name: 'Poland', native: 'Polska', primary: '112', tel: '112', secondary: [] },
  { code: 'CZ', name: 'Czechia', native: 'Česko', primary: '112', tel: '112', secondary: [] },
  { code: 'TR', name: 'Turkey', native: 'Türkiye', primary: '112', tel: '112', secondary: [] },
  { code: 'RU', name: 'Russia', native: 'Россия', primary: '112', tel: '112', secondary: [] },
  { code: 'UA', name: 'Ukraine', native: 'Україна', primary: '112', tel: '112', secondary: [] },
  { code: 'KZ', name: 'Kazakhstan', native: 'Қазақстан', primary: '112', tel: '112', secondary: [] },
  { code: 'IL', name: 'Israel', native: 'ישראל', primary: '100', tel: '100',
    secondary: [{ label: 'Ambulance / מד"א', number: '101', tel: '101' }] },
  { code: 'IR', name: 'Iran', native: 'ایران', primary: '110', tel: '110',
    secondary: [{ label: 'Ambulance / اورژانس', number: '115', tel: '115' }] },
  { code: 'ZA', name: 'South Africa', native: 'South Africa', primary: '10111', tel: '10111',
    secondary: [
      { label: 'Ambulance', number: '10177', tel: '10177' },
      { label: 'Mobile emergency', number: '112', tel: '112' },
    ] },
  { code: 'NG', name: 'Nigeria', native: 'Nigeria', primary: '112', tel: '112', secondary: [] },
  { code: 'GH', name: 'Ghana', native: 'Ghana', primary: '112', tel: '112', secondary: [] },
  { code: 'KE', name: 'Kenya', native: 'Kenya', primary: '112', tel: '112',
    secondary: [{ label: 'Police / Dhaika', number: '999', tel: '999' }] },
  { code: 'ET', name: 'Ethiopia', native: 'ኢትዮጵያ', primary: '911', tel: '911', secondary: [] },
  { code: 'TZ', name: 'Tanzania', native: 'Tanzania', primary: '112', tel: '112', secondary: [] },
  { code: 'UG', name: 'Uganda', native: 'Uganda', primary: '999', tel: '999', secondary: [] },
  { code: 'EG', name: 'Egypt', native: 'مصر', primary: '122', tel: '122',
    secondary: [{ label: 'Ambulance / الإسعاف', number: '123', tel: '123' }] },
  { code: 'MA', name: 'Morocco', native: 'المغرب', primary: '19', tel: '19',
    secondary: [{ label: 'Ambulance / الإسعاف', number: '15', tel: '15' }] },
  { code: 'DZ', name: 'Algeria', native: 'الجزائر', primary: '14', tel: '14', secondary: [] },
  { code: 'BR', name: 'Brazil', native: 'Brasil', primary: '190', tel: '190',
    secondary: [
      { label: 'Ambulance / SAMU', number: '192', tel: '192' },
      { label: 'Bombeiros / Fire', number: '193', tel: '193' },
    ] },
  { code: 'MX', name: 'Mexico', native: 'México', primary: '911', tel: '911', secondary: [] },
  { code: 'AR', name: 'Argentina', native: 'Argentina', primary: '911', tel: '911', secondary: [] },
  { code: 'CO', name: 'Colombia', native: 'Colombia', primary: '123', tel: '123', secondary: [] },
  { code: 'PE', name: 'Peru', native: 'Perú', primary: '105', tel: '105', secondary: [] },
  { code: 'CL', name: 'Chile', native: 'Chile', primary: '133', tel: '133', secondary: [] },
  { code: 'VE', name: 'Venezuela', native: 'Venezuela', primary: '911', tel: '911', secondary: [] },
];

export const DEFAULT_COUNTRY = 'IN';

export function countryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}