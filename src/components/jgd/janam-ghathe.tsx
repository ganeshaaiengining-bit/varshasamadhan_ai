'use client';

import * as React from 'react';
import { numerology, type BirthInput, type NumerologyResult } from '@/content/numerology';
import { vedic, gunMilan, RASHIS, type AstroResult, type GunResult } from '@/content/astrology';
import { JyotishSheet } from './jyotish-sheet';
import { useLanguage } from '@/components/language/language';

/**
 * ===========================================================================
 *  JANAM GATHE — name, date, time, place
 * ===========================================================================
 *
 * Numerology and Vedic astrology from what a person knows about a birth:
 * name, date, and if they have it, the time and the place.
 *
 * ── Why this runs in the browser and not on the server ─────────────────────
 *
 * A birth date, a name and a birth time together identify one person. Sending
 * that to a server puts it in a place the owner has to protect, and this
 * service's whole argument is that it is free, private and collects nothing.
 * Both engines in src/content are pure functions with no imports beyond each
 * other, so they run exactly the same in the browser as on a server, and
 * nothing about the calculation needs a machine elsewhere.
 *
 * So no form is submitted anywhere. There is no fetch, no action, no body. A
 * visitor who types a birth date and closes the tab has not told anyone.
 *
 * ── Why the time and place are optional and what they change ───────────────
 *
 * Without a time and place the result is still substantial: the life path
 * number, the name number, the soul number, the birthday number, the Moon's
 * nakshatra, its rashi and its lord. With them there is one more, the lagna,
 * and the lagna is the sign most people mean when they say "my star sign".
 *
 * Rather than making both fields mandatory, the form asks for them and then
 * says plainly what it could and could not work out. A visitor who does not
 * know their birth time is common, and a form that refuses to give them
 * anything would be refusing the common case.
 *
 * ── Why the limits are shown ──────────────────────────────────────────────
 *
 * Every result carries a `limit` string, written to say what the number does
 * not settle. They are rendered here rather than hidden, because a page that
 * only shows the flattering half is how people end up making decisions on a
 * number. The engine already refuses to return a number whose meaning it does
 * not have, so there is never a heading with nothing under it.
 */

/*
 * The stored result.
 *
 * `num` is not nullable even though the engine's return type is, because
 * onSubmit returns early when the engine refuses the date — a result is only
 * ever stored after both the engine and the guard agreed the date was usable.
 * Typing it as nullable here meant every use needed a null check that could
 * never fire, which is how a type gets quietly disabled instead of obeyed.
 */
interface Result {
  input: BirthInput;
  num: NumerologyResult;
  astro: AstroResult | null;
  gun: GunResult | null;
  /**
   * The parts the full sheet needs, which the old two-field engines do not have.
   *
   * `vedic()` takes a date and an optional time and answers one question about
   * the Moon. The eight systems on the sheet all read the whole chart, and the
   * lagna needs a latitude and a longitude that `BirthInput` only carries when a
   * city was picked. So the parts are parsed here, once, and the sheet is given
   * numbers rather than strings — no second parse, no second set of defaults to
   * keep in step with the first.
   */
  jyotish: {
    year: number; month: number; day: number;
    hour: number; minute: number;
    latitude: number; longitude: number;
    name: string;
  } | null;
}

/** Rough centre of a named place, for the visitor who knows the city but not the coordinates. */
/**
 * Every city a visitor might plausibly name, grouped by state.
 *
 * ── Why a list at all, rather than asking for coordinates ───────────────────
 *
 * The ascendant needs a latitude and a longitude, and no visitor knows theirs.
 * So the form asks for the town, which everybody knows, and looks the numbers
 * up here. That is why this file is long: every town that is not in it cannot be
 * answered at all, and the visitor is not in a position to work out what is
 * missing and fix it.
 *
 * The fourteen that were here first were not chosen — they were the ones that
 * came to mind, which meant that most of India could not be born anywhere.
 *
 * ── Accuracy, and what it costs ─────────────────────────────────────────────
 *
 * One latitude and longitude per city, for the centre of it. The ascendant
 * moves about one degree every four minutes, so a person born at one edge of
 * Mumbai may find their sign differs from one born at the other. The result is
 * marked approximate and says so on the page. It is far better than refusing to
 * answer, and it is not what an astrologer with a chart would produce.
 *
 * Districts are included, not only the state capitals, because the town people
 * were born in is usually not the state capital.
 */
const PLACES: Array<{ name: string; lat: number; lon: number; group: string }> = [
  // ── Maharashtra ──────────────────────────────────────────────────────────
  { name: 'Mumbai / मुंबई', lat: 19.076, lon: 72.8777, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Pune / पुणे', lat: 18.5204, lon: 73.8567, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Nagpur / नागपुर', lat: 21.1458, lon: 79.0882, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Nashik / नाशिक', lat: 19.9975, lon: 73.7898, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Thane / ठाणे', lat: 19.2183, lon: 72.9781, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Aurangabad / औरंगाबाद', lat: 19.8762, lon: 75.3433, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Solapur / सोलापुर', lat: 17.6599, lon: 75.9064, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Kolhapur / कोल्हापुर', lat: 16.705, lon: 74.2433, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Amravati / अमरावती', lat: 20.9374, lon: 77.7796, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Nanded / नांदेड़', lat: 19.1383, lon: 77.321, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Ambernath / अंबरनाथ', lat: 19.0725, lon: 72.8814, group: 'Maharashtra / महाराष्ट्र' },
  { name: 'Akola / अकोला', lat: 20.7002, lon: 77.0082, group: 'Maharashtra / महाराष्ट्र' },

  // ── Delhi and the National Capital Territory ──────────────────────────────
  { name: 'Delhi / दिल्ली', lat: 28.6139, lon: 77.209, group: 'Delhi / दिल्ली' },
  { name: 'New Delhi / नई दिल्ली', lat: 28.5355, lon: 77.2588, group: 'Delhi / दिल्ली' },
  { name: 'Dwarka / द्वारका', lat: 28.5921, lon: 77.046, group: 'Delhi / दिल्ली' },
  { name: 'Rohini / रोहिणी', lat: 28.7495, lon: 77.0565, group: 'Delhi / दिल्ली' },
  { name: 'Saket / साकेत', lat: 28.5245, lon: 77.2066, group: 'Delhi / दिल्ली' },

  // ── Karnataka ────────────────────────────────────────────────────────────
  { name: 'Bengaluru / बेंगलुरु', lat: 12.9716, lon: 77.5946, group: 'Karnataka / कर्नाटक' },
  { name: 'Mysuru / मैसूर', lat: 12.2958, lon: 76.6394, group: 'Karnataka / कर्नाटक' },
  { name: 'Davanagere / दावनगेरे', lat: 14.4644, lon: 75.9218, group: 'Karnataka / कर्नाटक' },
  { name: 'Hubballi / हुबली', lat: 15.3647, lon: 75.124, group: 'Karnataka / कर्नाटक' },
  { name: 'Mangaluru / मैंगलोरू', lat: 12.9141, lon: 74.856, group: 'Karnataka / कर्नाटक' },
  { name: 'Belagavi / बेलगाम', lat: 15.8497, lon: 74.4977, group: 'Karnataka / कर्नाटक' },
  { name: 'Kalaburagi / कलबुर्गी', lat: 17.3297, lon: 76.8343, group: 'Karnataka / कर्नाटक' },

  // ── Tamil Nadu ───────────────────────────────────────────────────────────
  { name: 'Chennai / चेन्नई', lat: 13.0827, lon: 80.2707, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Coimbatore / कोयंबटूर', lat: 11.0168, lon: 76.9558, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Madurai / मदुरै', lat: 9.9252, lon: 78.1198, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Tiruchirappalli / तिरुचिरापल्ली', lat: 10.7905, lon: 78.7047, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Salem / सेलम', lat: 11.6643, lon: 78.146, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Tirunelveli / तिरुनेल्वेलि', lat: 8.7139, lon: 77.7567, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Erode / इरोड', lat: 11.341, lon: 77.7172, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Vellore / वेल्लोर', lat: 12.9165, lon: 79.1325, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Thoothukudi / तूतुकुडी', lat: 8.7642, lon: 78.1348, group: 'Tamil Nadu / तमिलनाडु' },
  { name: 'Thanjavur / तंजावुर', lat: 10.787, lon: 79.1378, group: 'Tamil Nadu / तमिलनाडु' },

  // ── Uttar Pradesh ────────────────────────────────────────────────────────
  { name: 'Lucknow / लखनऊ', lat: 26.8467, lon: 80.9462, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Kanpur / कानपुर', lat: 26.4499, lon: 80.3319, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Agra / आगरा', lat: 27.1767, lon: 78.0081, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Varanasi / वाराणसी', lat: 25.3176, lon: 82.9739, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Prayagraj / प्रयागराज', lat: 25.4358, lon: 81.8463, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Meerut / मेरठ', lat: 28.9845, lon: 77.7064, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Bareilly / बरेली', lat: 28.367, lon: 79.4304, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Aligarh / अलीगढ़', lat: 27.8974, lon: 78.088, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Moradabad / मुरादाबाद', lat: 28.8386, lon: 78.7733, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Saharanpur / सहारनपुर', lat: 29.968, lon: 77.5552, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Gorakhpur / गोरखपुर', lat: 26.7606, lon: 83.3732, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Firozabad / फिरोज़ाबाद', lat: 27.1591, lon: 78.3957, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Jhansi / झाँसी', lat: 25.4484, lon: 78.5685, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Muzaffarnagar / मुज़फ़्फ़रनगर', lat: 29.4727, lon: 77.7085, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Mathura / मथुरा', lat: 27.4924, lon: 77.6737, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Rampur / रामपुर', lat: 28.8154, lon: 79.0251, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Shahjahanpur / शाहजहाँपुर', lat: 27.8815, lon: 79.9099, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Mau / मऊ', lat: 25.9417, lon: 83.5611, group: 'Uttar Pradesh / उत्तर प्रदेश' },
  { name: 'Jaunpur / जौनपुर', lat: 25.7333, lon: 82.6833, group: 'Uttar Pradesh / उत्तर प्रदेश' },

  // ── Gujarat ──────────────────────────────────────────────────────────────
  { name: 'Ahmedabad / अहमदाबाद', lat: 23.0225, lon: 72.5714, group: 'Gujarat / गुजरात' },
  { name: 'Surat / सूरत', lat: 21.1702, lon: 72.8311, group: 'Gujarat / गुजरात' },
  { name: 'Vadodara / वडोदरा', lat: 22.3072, lon: 73.1812, group: 'Gujarat / गुजरात' },
  { name: 'Rajkot / राजकोट', lat: 22.3039, lon: 70.8022, group: 'Gujarat / गुजरात' },
  { name: 'Bhavnagar / भावनगर', lat: 21.7645, lon: 72.1519, group: 'Gujarat / गुजरात' },
  { name: 'Jamnagar / जामनगर', lat: 22.4707, lon: 70.0577, group: 'Gujarat / गुजरात' },
  { name: 'Junagadh / जूनागढ़', lat: 21.5222, lon: 70.4579, group: 'Gujarat / गुजरात' },
  { name: 'Gandhinagar / गांधीनगर', lat: 23.2156, lon: 72.6369, group: 'Gujarat / गुजरात' },
  { name: 'Anand / आनंद', lat: 22.5645, lon: 72.9289, group: 'Gujarat / गुजरात' },
  { name: 'Bharuch / भरूच', lat: 21.7051, lon: 72.9959, group: 'Gujarat / गुजरात' },
  { name: 'Navsari / नवसारी', lat: 20.9467, lon: 72.952, group: 'Gujarat / गुजरात' },
  { name: 'Mehsana / मेहसाणा', lat: 23.588, lon: 72.3693, group: 'Gujarat / गुजरात' },
  { name: 'Bhuj / भुज', lat: 23.242, lon: 69.6669, group: 'Gujarat / गुजरात' },

  // ── Rajasthan ────────────────────────────────────────────────────────────
  { name: 'Jaipur / जयपुर', lat: 26.9124, lon: 75.7873, group: 'Rajasthan / राजस्थान' },
  { name: 'Jodhpur / जोधपुर', lat: 26.2389, lon: 73.0243, group: 'Rajasthan / राजस्थान' },
  { name: 'Udaipur / उदयपुर', lat: 24.5854, lon: 73.7125, group: 'Rajasthan / राजस्थान' },
  { name: 'Kota / कोटा', lat: 25.2138, lon: 75.8648, group: 'Rajasthan / राजस्थान' },
  { name: 'Ajmer / अजमेर', lat: 26.4499, lon: 74.6399, group: 'Rajasthan / राजस्थान' },
  { name: 'Bikaner / बीकानेर', lat: 28.0229, lon: 73.3119, group: 'Rajasthan / राजस्थान' },
  { name: 'Jhalawar / झालावाड़', lat: 24.5937, lon: 75.5772, group: 'Rajasthan / राजस्थान' },
  { name: 'Bharatpur / भरतपुर', lat: 27.2152, lon: 77.503, group: 'Rajasthan / राजस्थान' },
  { name: 'Pali / पाली', lat: 25.7711, lon: 73.3234, group: 'Rajasthan / राजस्थान' },
  { name: 'Sikar / सीकर', lat: 27.6094, lon: 75.1399, group: 'Rajasthan / राजस्थान' },
  { name: 'Alwar / अलवर', lat: 27.5665, lon: 76.625, group: 'Rajasthan / राजस्थान' },
  { name: 'Barmer / बाड़मेर', lat: 25.7451, lon: 71.3874, group: 'Rajasthan / राजस्थान' },
  { name: 'Kota / कोटा (Rajasthan)', lat: 25.2138, lon: 75.8648, group: 'Rajasthan / राजस्थान' },
  { name: 'Dausa / दौसा', lat: 26.7525, lon: 77.335, group: 'Rajasthan / राजस्थान' },

  // ── West Bengal ──────────────────────────────────────────────────────────
  { name: 'Kolkata / कोलकाता', lat: 22.5726, lon: 88.3639, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Howrah / हावड़ा', lat: 22.5958, lon: 88.2636, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Asansol / आसनसोल', lat: 23.6739, lon: 86.9524, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Siliguri / सिलीगुड़ी', lat: 26.7271, lon: 88.3953, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Durgapur / दुर्गापुर', lat: 23.5204, lon: 87.3119, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Bardhaman / बर्द्धमान', lat: 23.2324, lon: 87.8615, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Malda / मालदा', lat: 25.0119, lon: 88.1433, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Kharagpur / खड़गपुर', lat: 22.346, lon: 87.232, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Haldia / हल्दिया', lat: 22.0667, lon: 88.0698, group: 'West Bengal / पश्चिम बंगाल' },
  { name: 'Krishnanagar / कृष্ণनगर', lat: 23.4748, lon: 88.2939, group: 'West Bengal / पश्चिम बंगाल' },

  // ── Telangana ────────────────────────────────────────────────────────────
  { name: 'Hyderabad / हैदराबाद', lat: 17.385, lon: 78.4867, group: 'Telangana / तेलंगाना' },
  { name: 'Warangal / वारंगल', lat: 17.9689, lon: 79.5941, group: 'Telangana / तेलंगाना' },
  { name: 'Nizamabad / निजामाबाद', lat: 18.6725, lon: 78.0942, group: 'Telangana / तेलंगाना' },
  { name: 'Karimnagar / करीमनगर', lat: 18.4386, lon: 79.1288, group: 'Telangana / तेलंगाना' },
  { name: 'Ramagundam / रामगुंडम', lat: 18.7557, lon: 79.474, group: 'Telangana / तेलंगाना' },
  { name: 'Mancherial / मांचेरियल', lat: 18.8675, lon: 79.3534, group: 'Telangana / तेलंगाना' },

  // ── Kerala ───────────────────────────────────────────────────────────────
  { name: 'Kochi / कोच्चि', lat: 9.9312, lon: 76.2673, group: 'Kerala / केरल' },
  { name: 'Thiruvananthapuram / तिरुवनांतपुरम', lat: 8.5241, lon: 76.9366, group: 'Kerala / केरल' },
  { name: 'Kozhikode / कोझिकोड', lat: 11.2588, lon: 75.7804, group: 'Kerala / केरल' },
  { name: 'Thrissur / त्रिश्सूर', lat: 10.5276, lon: 76.2144, group: 'Kerala / केरल' },
  { name: 'Kollam / कोल्लम', lat: 8.8932, lon: 76.6141, group: 'Kerala / केरल' },
  { name: 'Alappuzha / अलपुझा', lat: 9.4981, lon: 76.3388, group: 'Kerala / केरल' },
  { name: 'Kottayam / कोट्टयम', lat: 9.9312, lon: 76.2673, group: 'Kerala / केरल' },
  { name: 'Kannur / कन्नूर', lat: 11.8745, lon: 75.3704, group: 'Kerala / केरल' },
  { name: 'Palakkad / पालक्काड', lat: 10.7867, lon: 76.6548, group: 'Kerala / केरल' },
  { name: 'Malappuram / मलप्पुरम', lat: 11.041, lon: 76.0788, group: 'Kerala / केरल' },

  // ── Punjab ───────────────────────────────────────────────────────────────
  { name: 'Ludhiana / लुधियाना', lat: 30.901, lon: 75.8573, group: 'Punjab / पंजाब' },
  { name: 'Amritsar / अमृतसर', lat: 31.634, lon: 74.8723, group: 'Punjab / पंजाब' },
  { name: 'Patiala / पटियाला', lat: 30.3398, lon: 76.3869, group: 'Punjab / पंजाब' },
  { name: 'Jalandhar / जालंधर', lat: 31.326, lon: 75.5762, group: 'Punjab / पंजाब' },
  { name: 'Bathinda / बathिंडा', lat: 30.211, lon: 74.9455, group: 'Punjab / पंजाब' },
  { name: 'Pathankot / पठानकोट', lat: 32.2643, lon: 75.6421, group: 'Punjab / पंजाब' },
  { name: 'Hoshiarpur / होशियारपुर', lat: 31.5322, lon: 75.9119, group: 'Punjab / पंजाब' },
  { name: 'Moga / मोगा', lat: 30.9735, lon: 75.1727, group: 'Punjab / पंजाब' },
  { name: 'Firozpur / फिरोज़पुर', lat: 30.9582, lon: 74.3081, group: 'Punjab / पंजाब' },
  { name: 'Sri Ganganagar / श्री गंगानगर', lat: 29.9039, lon: 73.8773, group: 'Punjab / पंजाब' },

  // ── Bihar ────────────────────────────────────────────────────────────────
  { name: 'Patna / पटना', lat: 25.5941, lon: 85.1376, group: 'Bihar / बिहार' },
  { name: 'Gaya / गया', lat: 24.7955, lon: 85.0002, group: 'Bihar / बिहार' },
  { name: 'Bhagalpur / भागलपुर', lat: 25.2425, lon: 86.9842, group: 'Bihar / बिहार' },
  { name: 'Muzaffarpur / मुज़फ़्फ़रपुर', lat: 26.1209, lon: 85.3647, group: 'Bihar / बिहार' },
  { name: 'Darbhanga / दरभंगा', lat: 26.1542, lon: 85.8918, group: 'Bihar / बिहार' },
  { name: 'Purnia / पूर्णिया', lat: 25.7771, lon: 87.4753, group: 'Bihar / बिहार' },
  { name: 'Begusarai / बेगूसराय', lat: 25.4182, lon: 86.1272, group: 'Bihar / बिहार' },
  { name: 'Chapra / चपड़ा', lat: 25.7815, lon: 84.7274, group: 'Bihar / बिहार' },
  { name: 'Katihar / कटिहार', lat: 25.5391, lon: 87.5719, group: 'Bihar / बिहार' },
  { name: 'Munger / मुंगेर', lat: 25.3708, lon: 86.4734, group: 'Bihar / बिहार' },

  // ── Odisha ───────────────────────────────────────────────────────────────
  { name: 'Bhubaneswar / भुबनेश्वर', lat: 20.2961, lon: 85.8245, group: 'Odisha / ओडिशा' },
  { name: 'Cuttack / कटक', lat: 20.4625, lon: 85.8828, group: 'Odisha / ओडिशा' },
  { name: 'Rourkela / राउरकेला', lat: 22.2604, lon: 84.8536, group: 'Odisha / ओडिशा' },
  { name: 'Puri / पुरी', lat: 19.8135, lon: 85.8312, group: 'Odisha / ओडिशा' },
  { name: 'Sambalpur / संबलपुर', lat: 21.4669, lon: 83.9756, group: 'Odisha / ओडिशा' },
  { name: 'Balasore / बालेश्वर', lat: 21.4934, lon: 86.9335, group: 'Odisha / ओडिशा' },
  { name: 'Baripada / बारीपदा', lat: 21.3549, lon: 86.6946, group: 'Odisha / ओडिशा' },

  // ── Assam ────────────────────────────────────────────────────────────────
  { name: 'Guwahati / गुवाहाटी', lat: 26.1445, lon: 91.7362, group: 'Assam / असम' },
  { name: 'Dibrugarh / डिब्रूगढ़', lat: 27.4728, lon: 94.912, group: 'Assam / असम' },
  { name: 'Silchar / सिलचर', lat: 24.8333, lon: 92.7789, group: 'Assam / असम' },
  { name: 'Jorhat / जोरहाट', lat: 26.7509, lon: 94.2037, group: 'Assam / असम' },
  { name: 'Nagaon / नागाँव', lat: 26.3465, lon: 92.6845, group: 'Assam / असम' },
  { name: 'Tezpur / तेजपुर', lat: 26.6337, lon: 92.1587, group: 'Assam / असम' },

  // ── Madhya Pradesh ───────────────────────────────────────────────────────
  { name: 'Bhopal / भोपाल', lat: 23.2599, lon: 77.4126, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Indore / इंदौर', lat: 22.7196, lon: 75.8577, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Jabalpur / जबलपुर', lat: 23.1815, lon: 79.9864, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Gwalior / ग्वालियर', lat: 26.2183, lon: 78.1828, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Ujjain / उज्जैन', lat: 23.1765, lon: 75.7885, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Sagar / सागर', lat: 23.8388, lon: 78.7378, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Dewas / देवास', lat: 22.9676, lon: 76.0534, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Satna / सतना', lat: 24.5854, lon: 80.8324, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Ratlam / रतलाम', lat: 23.334, lon: 75.0376, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Rewa / रीवा', lat: 24.5362, lon: 81.3037, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Singrauli / सिंगरौली', lat: 24.1994, lon: 82.6754, group: 'Madhya Pradesh / मध्य प्रदेश' },
  { name: 'Burhanpur / बुरहानपुर', lat: 21.3009, lon: 76.2294, group: 'Madhya Pradesh / मध्य प्रदेश' },

  // ── Chhattisgarh ─────────────────────────────────────────────────────────
  { name: 'Raipur / रायपुर', lat: 21.2514, lon: 81.6296, group: 'Chhattisgarh / छत्तीसगढ़' },
  { name: 'Bhilai / भिलाई', lat: 21.209, lon: 81.379, group: 'Chhattisgarh / छत्तीसगढ़' },
  { name: 'Bilaspur / बिलासपुर', lat: 22.0797, lon: 82.1409, group: 'Chhattisgarh / छत्तीसगढ़' },
  { name: 'Korba / कोरबा', lat: 22.3595, lon: 82.7501, group: 'Chhattisgarh / छत्तीसगढ़' },
  { name: 'Durg / दुर्ग', lat: 21.1904, lon: 81.2849, group: 'Chhattisgarh / छत्तीसगढ़' },
  { name: 'Jagdalpur / जगदलपुर', lat: 19.0721, lon: 82.0159, group: 'Chhattisgarh / छत्तीसगढ़' },

  // ── Jharkhand ────────────────────────────────────────────────────────────
  { name: 'Ranchi / रांची', lat: 23.3441, lon: 85.3096, group: 'Jharkhand / झारखंड' },
  { name: 'Jamshedpur / जमशेदपुर', lat: 22.8046, lon: 86.2029, group: 'Jharkhand / झारखंड' },
  { name: 'Dhanbad / धनबाद', lat: 23.7957, lon: 86.4304, group: 'Jharkhand / झारखंड' },
  { name: 'Jamshedpur / जमशेदपुर (Steel City)', lat: 22.8046, lon: 86.2029, group: 'Jharkhand / झारखंड' },
  { name: 'Bokaro / बोकारो', lat: 23.6693, lon: 86.1511, group: 'Jharkhand / झारखंड' },
  { name: 'Deoghar / देवगढ़', lat: 24.4823, lon: 86.6969, group: 'Jharkhand / झारखंड' },
  { name: 'Hazaribagh / हज़ारीबाग', lat: 23.9925, lon: 85.3637, group: 'Jharkhand / झारखंड' },
  { name: 'Giridih / गिरीदिह', lat: 23.3465, lon: 85.984, group: 'Jharkhand / झारखंड' },

  // ── Uttarakhand ──────────────────────────────────────────────────────────
  { name: 'Dehradun / देहरादून', lat: 30.3165, lon: 78.0322, group: 'Uttarakhand / उत्तराखंड' },
  { name: 'Haridwar / हरिद्वार', lat: 29.9457, lon: 78.1642, group: 'Uttarakhand / उत्तराखंड' },
  { name: 'Haldwani / हल्द्वानी', lat: 29.2183, lon: 79.513, group: 'Uttarakhand / उत्तराखंड' },
  { name: 'Rudrapur / रुद्रपुर', lat: 28.9845, lon: 79.4141, group: 'Uttarakhand / उत्तराखंड' },
  { name: 'Rishikesh / ऋषिकेश', lat: 30.0869, lon: 78.2676, group: 'Uttarakhand / उत्तराखंड' },
  { name: 'Srinagar / श्रीनगर', lat: 30.3165, lon: 78.0322, group: 'Uttarakhand / उत्तराखंड' },

  // ── Himachal Pradesh ──────────────────────────────────────────────────────
  { name: 'Shimla / शिमला', lat: 31.1048, lon: 77.1734, group: 'Himachal Pradesh / हिमाचल प्रदेश' },
  { name: 'Dharamshala / धर्मशाला', lat: 32.219, lon: 76.3234, group: 'Himachal Pradesh / हिमाचल प्रदेश' },
  { name: 'Solan / सोलन', lat: 30.9045, lon: 77.0967, group: 'Himachal Pradesh / हिमाचल प्रदेश' },
  { name: 'Mandi / मंडी', lat: 31.7085, lon: 76.9314, group: 'Himachal Pradesh / हिमाचल प्रदेश' },
  { name: 'Kullu / कुल्लू', lat: 31.9573, lon: 77.1084, group: 'Himachal Pradesh / हिमाचल प्रदेश' },
  { name: 'Kangra / कांगड़ा', lat: 32.0433, lon: 76.2673, group: 'Himachal Pradesh / हिमाचल प्रदेश' },

  // ── Haryana ──────────────────────────────────────────────────────────────
  { name: 'Faridabad / फरीदाबाद', lat: 28.4089, lon: 77.3178, group: 'Haryana / हरियाणा' },
  { name: 'Gurugram / गुरुग्राम', lat: 28.4595, lon: 77.0266, group: 'Haryana / हरियाणा' },
  { name: 'Panipat / पानीपत', lat: 29.3909, lon: 76.9635, group: 'Haryana / हरियाणा' },
  { name: 'Ambala / अंबाला', lat: 30.3782, lon: 76.7767, group: 'Haryana / हरियाणा' },
  { name: 'Hisar / हिसार', lat: 29.1492, lon: 75.7217, group: 'Haryana / हरियाणा' },
  { name: 'Rohtak / रोहतक', lat: 28.8955, lon: 76.6066, group: 'Haryana / हरियाणा' },
  { name: 'Sonipat / सोनीपत', lat: 28.9931, lon: 77.0151, group: 'Haryana / हरियाणा' },
  { name: 'Karnal / करनाल', lat: 29.6857, lon: 76.9905, group: 'Haryana / हरियाणा' },
  { name: 'Yamunanagar / यमुनानगर', lat: 30.129, lon: 77.2674, group: 'Haryana / हरियाणा' },

  // ── Chhattisgarh-adjacent and the rest of the north-east ────────────────
  { name: 'Shillong / शिलांग', lat: 25.5788, lon: 91.8933, group: 'Meghalaya / मेघालय' },
  { name: 'Agartala / अगरतला', lat: 23.8315, lon: 91.2868, group: 'Tripura / त्रिपुरा' },
  { name: 'Imphal / इम्फाल', lat: 24.817, lon: 93.9369, group: 'Manipur / मणिपुर' },
  { name: 'Shamator / शमोटर', lat: 24.8333, lon: 93.9408, group: 'Manipur / मणिपुर' },
  { name: 'Kohima / कोहिमा', lat: 25.6751, lon: 94.1086, group: 'Nagaland / नागालैंड' },
  { name: 'Itanagar / इटानगर', lat: 27.0844, lon: 93.6053, group: 'Arunachal Pradesh / अरुणाचल प्रदेश' },
  { name: 'Gangtok / गैंगटोक', lat: 27.3389, lon: 88.6065, group: 'Sikkim / सिक्किम' },
  { name: 'Aizawl / आइज़ोल', lat: 23.7271, lon: 92.7176, group: 'Mizoram / मिज़ोरम' },

  // ── Goa ──────────────────────────────────────────────────────────────────
  { name: 'Panaji / पणजी', lat: 15.4909, lon: 73.8278, group: 'Goa / गोवा' },
  { name: 'Margao / मारगाओ', lat: 15.2832, lon: 73.9862, group: 'Goa / गोवा' },
  { name: 'Vasco da Gama / वास्को द गामा', lat: 15.3959, lon: 73.8157, group: 'Goa / गोवा' },
  { name: 'Mapusa / मापुसा', lat: 15.6167, lon: 73.8, group: 'Goa / गोवा' },

  // ── Gujarat-adjacent and central ─────────────────────────────────────────
  { name: 'Daman / दमन', lat: 20.3974, lon: 72.8328, group: 'Dadra and Nagar Haveli / दादरा नगर हवेली' },
  { name: 'Silvassa / सिल्वासा', lat: 20.2738, lon: 73.0123, group: 'Dadra and Nagar Haveli / दादरा नगर हवेली' },
  { name: 'Chandigarh / चंडीगढ़', lat: 30.7333, lon: 76.7794, group: 'Chandigarh / चंडीगढ़' },
  { name: 'Port Blair / पोर्ट ब्लेयर', lat: 11.6234, lon: 92.7265, group: 'Andaman and Nicobar / अंडमान' },
  { name: 'Kavar / कावर', lat: 10.5669, lon: 72.642, group: 'Gujarat / गुजरात' },
];

/** The unique state names in the order they were written, for grouping. */
const STATES = Array.from(new Set(PLACES.map((p) => p.group)));

export function JanamGhathe() {
  const { t } = useLanguage();

  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [placeQuery, setPlaceQuery] = React.useState('');
  const [placeOpen, setPlaceOpen] = React.useState(false);
  const [partnerName, setPartnerName] = React.useState('');
  const [partnerDate, setPartnerDate] = React.useState('');
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState<Result | null>(null);

  /*
   * Narrow the list as they type.
   *
   * Matches the Latin name and the native one both, because somebody typing
   * into a Hindi form often types in Roman letters — that is how most of them
   * search on a phone — and somebody whose keyboard is in the native script
   * types there instead. Matching only one of the two would hide half the list
   * from half the people using it.
   */
  const needle = placeQuery.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    const matched = needle
      ? PLACES.filter((p) => p.name.toLowerCase().includes(needle))
      : PLACES;

    const byGroup = new Map<string, typeof PLACES>();
    for (const entry of matched) {
      const bucket = byGroup.get(entry.group);
      if (bucket) bucket.push(entry);
      else byGroup.set(entry.group, [entry]);
    }

    // STATES order, so the groups appear as written rather than in the order
    // somebody happened to type them.
    return STATES.filter((group) => byGroup.has(group)).map((group) => ({
      group,
      place: group,
      items: byGroup.get(group) ?? [],
    }));
  }, [needle]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError(t('jgd.errDate'));
      return;
    }

    const input: BirthInput = { date, name: name.trim() || undefined };
    if (/^\d{2}:\d{2}$/.test(time)) input.time = time;

    const coords = PLACES.find((p) => p.name === place);
    if (coords) {
      input.latitude = coords.lat;
      input.longitude = coords.lon;
    }

    const num = numerology(input);
    if (!num) {
      setError(t('jgd.errDate'));
      return;
    }

    let gun: GunResult | null = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(partnerDate)) {
      const partnerNum = numerology({ date: partnerDate, name: partnerName.trim() || undefined });
      const partnerAstro = vedic({ date: partnerDate });
      const selfAstro = vedic(input);

      if (partnerNum && partnerAstro && selfAstro) {
        gun = gunMilan(
          {
            rashiIndex: RASHI_INDEX(selfAstro.rashi),
            nameNumber: num.nameNumber,
          },
          {
            rashiIndex: RASHI_INDEX(partnerAstro.rashi),
            nameNumber: partnerNum.nameNumber,
          },
        );
      }
    }

    /*
     * The eight systems need the full chart, which means a latitude and a
     * longitude for the lagna. Without a city there is none to be had, and a
     * guessed one would put the lagna a whole sign out for anybody who was not
     * born near the middle of the country — so the sheet is simply not offered.
     *
     * It used to fall back to a rough centre of India, which produced a
     * confident-looking chart for people born in Chennai and Kashmir alike.
     */
    let jyotish: Result['jyotish'] = null;
    if (coords) {
      const [hour, minute] = /^\d{2}:\d{2}$/.test(time)
        ? time.split(':').map(Number)
        : [12, 0];

      jyotish = {
        year: Number(date.slice(0, 4)),
        month: Number(date.slice(5, 7)),
        day: Number(date.slice(8, 10)),
        hour,
        minute,
        latitude: coords.lat,
        longitude: coords.lon,
        name: name.trim(),
      };
    }

    setResult({ input, num, astro: vedic(input), gun, jyotish });
  };

  const reset = () => {
    setResult(null);
    setName('');
    setDate('');
    setTime('');
    setPlace('');
    setPartnerName('');
    setPartnerDate('');
    setError('');
  };

  return (
    <div className="wrap-narrow py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl">{t('jgd.title')}</h1>
      <p className="mt-3 text-ink-subtle">{t('jgd.intro')}</p>

      {!result && (
        <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-6 sm:p-8">
          <div className="grid gap-2">
            <label htmlFor="jgd-name" className="font-medium">{t('jgd.nameLabel')}</label>
            <input
              id="jgd-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
              placeholder={t('jgd.namePlaceholder')}
            />
            <p className="text-sm text-ink-subtle">{t('jgd.nameHint')}</p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="jgd-date" className="font-medium">{t('jgd.dateLabel')}</label>
            <input
              id="jgd-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="jgd-time" className="font-medium">{t('jgd.timeLabel')}</label>
              <input
                id="jgd-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
              />
              <p className="text-sm text-ink-subtle">{t('jgd.timeHint')}</p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="jgd-place" className="font-medium">{t('jgd.placeLabel')}</label>
              {/*
                A type-and-narrow box rather than a select.

                A plain dropdown of every town in India is about two hundred
                options on a phone, which is a list nobody scrolls and nobody
                finds anything in. Typing three letters — and everybody's town is
                in the first three of its name — leaves a list of a handful.

                Grouped by state, because a visitor who types nothing should be
                able to open it and see their own state rather than a wall.

                The list is closed on blur rather than on Escape alone, because a
                person on a phone closes a list by tapping outside it, and a box
                that stays open behind their finger is worse than one that never
                opened.
              */}
              <div className="relative">
                <input
                  id="jgd-place"
                  value={placeQuery}
                  onChange={(e) => {
                    setPlaceQuery(e.target.value);
                    setPlaceOpen(true);
                  }}
                  onFocus={() => setPlaceOpen(true)}
                  onBlur={() => {
                    // A short delay, so a tap on an option lands before the
                    // list closes underneath it.
                    window.setTimeout(() => setPlaceOpen(false), 150);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setPlaceOpen(false);
                    if (e.key === 'ArrowDown') setPlaceOpen(true);
                  }}
                  role="combobox"
                  aria-expanded={placeOpen}
                  aria-controls="jgd-place-list"
                  autoComplete="off"
                  placeholder={t('jgd.placeSearch')}
                  className="rounded-lg border border-line bg-paper px-4 py-3 text-lg"
                />

                {placeOpen && (
                  <ul
                    id="jgd-place-list"
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-surface shadow-lift"
                  >
                    {filtered.length === 0 ? (
                      <li className="px-4 py-3 text-ink-subtle">{t('jgd.placeNoMatch')}</li>
                    ) : (
                      filtered.map(({ place: entry, group, items }) => (
                        <li key={group} role="none">
                          <p className="border-b border-line bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-subtle">
                            {group}
                          </p>
                          {items.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              role="option"
                              aria-selected={place === p.name}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setPlace(p.name);
                                setPlaceQuery(p.name);
                                setPlaceOpen(false);
                              }}
                              className="block w-full px-4 py-3 text-left text-lg hover:bg-sun/10"
                            >
                              {p.name}
                            </button>
                          ))}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
              <p className="text-sm text-ink-subtle">{t('jgd.placeHint')}</p>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 px-4 py-3 text-danger">{error}</p>
          )}

          <button type="submit" className="btn-primary text-lg">{t('jgd.submit')}</button>

          <details className="rounded-lg bg-sun/10 p-4 text-sm">
            <summary className="cursor-pointer font-medium">{t('jgd.gunTitle')}</summary>
            <p className="mt-2 text-ink-subtle">{t('jgd.gunIntro')}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={t('jgd.gunName')}
                className="rounded-lg border border-line bg-paper px-4 py-3"
                aria-label={t('jgd.gunName')}
              />
              <input
                type="date"
                value={partnerDate}
                onChange={(e) => setPartnerDate(e.target.value)}
                className="rounded-lg border border-line bg-paper px-4 py-3"
                aria-label={t('jgd.gunDate')}
              />
            </div>
            <p className="mt-2 text-sm text-ink-subtle">{t('jgd.gunHint')}</p>
          </details>
        </form>
      )}

      {result && (
        <div className="mt-8">
          <div className="flex flex-wrap gap-3 print:hidden">
            <button type="button" onClick={() => window.print()} className="btn-primary">
              {t('jgd.savePdf')}
            </button>
            <button type="button" onClick={reset} className="btn-ghost">{t('jgd.again')}</button>
          </div>

          <section className="card mt-6 p-6 sm:p-8">
            <h2 className="font-display text-2xl">{t('jgd.numTitle')}</h2>

            <div className="mt-4 rounded-lg bg-saffron/10 p-5">
              <p className="text-sm text-ink-subtle">{t('jgd.lifePath')}</p>
              <p className="font-display text-5xl text-saffron-deep">{result.num.lifePath}</p>
              <p className="mt-2 font-medium">{result.num.meaning.title}</p>
              <p className="mt-1 text-ink-subtle">{result.num.meaning.keyword}</p>
              <p className="mt-3">{result.num.meaning.text}</p>
              <p className="mt-3 border-t border-line pt-3 text-sm text-ink-subtle">
                {result.num.meaning.limit}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {result.num.nameNumber !== null && (
                <div className="rounded-lg border border-line p-4">
                  <p className="text-sm text-ink-subtle">{t('jgd.nameNumber')}</p>
                  <p className="font-display text-3xl">{result.num.nameNumber}</p>
                </div>
              )}
              {result.num.soulNumber !== null && (
                <div className="rounded-lg border border-line p-4">
                  <p className="text-sm text-ink-subtle">{t('jgd.soulNumber')}</p>
                  <p className="font-display text-3xl">{result.num.soulNumber}</p>
                </div>
              )}
              <div className="rounded-lg border border-line p-4">
                <p className="text-sm text-ink-subtle">{t('jgd.birthdayNumber')}</p>
                <p className="font-display text-3xl">{result.num.birthdayNumber}</p>
              </div>
            </div>
          </section>

          {result.astro && (
            <section className="card mt-6 p-6 sm:p-8">
              <h2 className="font-display text-2xl">{t('jgd.astroTitle')}</h2>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <Row label={t('jgd.nakshatra')} value={result.astro.nakshatra.name} />
                <Row label={t('jgd.pada')} value={String(result.astro.nakshatra.pada)} />
                <Row label={t('jgd.rashi')} value={result.astro.rashi} />
                <Row label={t('jgd.rashiLord')} value={result.astro.rashiLord} />
                <Row label={t('jgd.nakshatraLord')} value={result.astro.nakshatra.lord} />
                {result.astro.lagna && (
                  <Row
                    label={t('jgd.lagna')}
                    value={`${result.astro.lagna.rashi} (${formatDegrees(result.astro.lagna.degrees)})`}
                  />
                )}
              </dl>

              {!result.astro.lagna && (
                <p className="mt-4 rounded-lg bg-sun/10 p-4 text-sm">
                  {t('jgd.lagnaMissing')}
                </p>
              )}
            </section>
          )}

          {result.gun && (
            <section className="card mt-6 p-6 sm:p-8">
              <h2 className="font-display text-2xl">{t('jgd.gunTitle')}</h2>
              <p className="mt-3 font-display text-4xl text-saffron-deep">
                {result.gun.score} <span className="text-lg text-ink-subtle">/ {result.gun.max}</span>
              </p>
              <p className="mt-2">{result.gun.verdict}</p>

              <ul className="mt-4 grid gap-1 text-sm">
                {result.gun.breakdown.map((b) => (
                  <li key={b.graha} className="flex justify-between border-b border-line py-1">
                    <span>{b.graha}</span>
                    <span>{b.score} / {b.max}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 border-t border-line pt-3 text-sm text-ink-subtle">{result.gun.limit}</p>
            </section>
          )}

          {result.jyotish && <JyotishSheet input={result.jyotish} />}

          {!result.jyotish && (
            <p className="mt-6 rounded-lg bg-sun/10 p-4 text-sm text-ink-subtle">
              पूरी ज्योतिश कुंडली के लिए जन्म स्थान ज़रूरी है — लग्न सिर्फ समय और स्थान से निकलता है।
              ऊपर से शहर चुनिए और पूरी कुंडली खुल जाएगी।
            </p>
          )}

          <p className="mt-8 rounded-lg bg-sun/10 p-4 text-sm text-ink-subtle">{t('jgd.disclaimer')}</p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line p-4">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className="mt-1 text-lg">{value}</dd>
    </div>
  );
}

function formatDegrees(degrees: number): string {
  const d = Math.floor(degrees);
  const m = Math.round((degrees - d) * 60);
  return `${d}° ${m}′`;
}

/**
 * The engine returns a rashi by name; gunMilan wants its position in the zodiac.
 *
 * The names are matched against RASHIS rather than against a hand-written list,
 * because that list was written in Latin transliteration while the table holds
 * Devanagari names — every lookup missed and every match silently scored as
 * Aries, which is the sort of wrong answer that still looks like an answer.
 */
function RASHI_INDEX(rashi: string): number {
  const at = RASHIS.findIndex((r) => r.name === rashi);
  return at < 0 ? 0 : at;
}