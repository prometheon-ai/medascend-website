import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Activity, Baby, Brain, Bone, Zap, AlertTriangle, AlertCircle,
  ChevronRight, ChevronLeft, Check, Circle, Phone, MessageSquare,
  Wifi, Timer, Droplet, Shield, Syringe, FileText, Radio,
  PlayCircle, PauseCircle, RotateCcw, Hash, Ambulance, Info,
  Battery, Signal, Lock, ShieldAlert, Wind, HandMetal, Search,
  Layers, Eye, Thermometer, User, Clock, Stethoscope,
  Volume2, Play, X, Film
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ══════════════════════════════════════════════════════════════════
const i18n = {
  en: {
    brand: 'SahAI', tagline: 'PHC Co-Pilot',
    stationId: 'PHC-KAR-2847 · Nurse Meera',
    choose: 'Choose emergency', chooseSub: 'Tap a protocol to start',
    priority: 'Priority', other: 'Other emergencies',
    back: 'Back', next: 'Next', continue: 'Continue',
    step: 'Step', of: 'of',
    vitals: 'Vital signs',
    systolic: 'Systolic BP', heartRate: 'Heart rate', spo2: 'SpO₂', rr: 'Resp rate',
    bloodLoss: 'Blood loss (est.)',
    uterineTone: 'Uterine tone', soft: 'Soft · Boggy', firm: 'Firm · Contracted',
    placenta: 'Placenta', pComplete: 'Delivered complete',
    pIncomplete: 'Incomplete', pUndelivered: 'Not yet delivered',
    staff: 'Who is here right now?', solo: 'Just me', team: 'Me + others',
    shockIndex: 'Shock Index',
    triggerReferral: 'Generate Referral',
    referralPassport: 'Referral Passport',
    passportId: 'Passport ID', sendVia: 'Send via',
    whatsapp: 'WhatsApp', nfcTap: 'NFC wristband', sms: 'SMS', qrPrint: 'Print QR',
    referralSent: 'Referral sent',
    openMonitor: 'Open patient monitor',
    backHome: 'Back to home',
    takeNow: 'Take now', logged: 'Logged',
    monitor: 'Patient monitor', sinceReferral: 'Since referral',
    endMonitoring: 'End monitoring',
    goldenMinute: 'Golden Minute',
  },
  hi: {
    brand: 'SahAI', tagline: 'PHC सहायक',
    stationId: 'PHC-KAR-2847 · नर्स मीरा',
    choose: 'आपातकाल चुनें', chooseSub: 'शुरू करने के लिए प्रोटोकॉल पर टैप करें',
    priority: 'प्राथमिकता', other: 'अन्य आपातकाल',
    back: 'वापस', next: 'आगे', continue: 'जारी रखें',
    step: 'चरण', of: 'में से',
    vitals: 'महत्वपूर्ण संकेत',
    systolic: 'सिस्टोलिक BP', heartRate: 'हृदय गति', spo2: 'SpO₂', rr: 'श्वसन दर',
    bloodLoss: 'रक्त हानि (अनुमान)',
    uterineTone: 'गर्भाशय टोन', soft: 'मुलायम · शिथिल', firm: 'कठोर · संकुचित',
    placenta: 'प्लेसेंटा', pComplete: 'पूर्ण रूप से निकली',
    pIncomplete: 'अधूरी', pUndelivered: 'अभी नहीं निकली',
    staff: 'अभी कौन मौजूद है?', solo: 'केवल मैं', team: 'मैं + अन्य',
    shockIndex: 'शॉक इंडेक्स',
    triggerReferral: 'रेफरल बनाएँ',
    referralPassport: 'रेफरल पासपोर्ट',
    passportId: 'पासपोर्ट ID', sendVia: 'भेजें',
    whatsapp: 'व्हाट्सएप', nfcTap: 'NFC बैंड', sms: 'SMS', qrPrint: 'QR प्रिंट',
    referralSent: 'रेफरल भेजा गया',
    openMonitor: 'रोगी निगरानी खोलें',
    backHome: 'होम पर वापस',
    takeNow: 'अभी लें', logged: 'दर्ज',
    monitor: 'रोगी निगरानी', sinceReferral: 'रेफरल के बाद',
    endMonitoring: 'निगरानी समाप्त',
    goldenMinute: 'गोल्डन मिनट',
  },
  mr: {
    brand: 'SahAI', tagline: 'PHC सहाय्यक',
    stationId: 'PHC-KAR-2847 · परिचारिका मीरा',
    choose: 'आपत्काल निवडा', chooseSub: 'प्रोटोकॉलवर टॅप करा',
    priority: 'प्राधान्य', other: 'इतर आपत्काल',
    back: 'मागे', next: 'पुढे', continue: 'सुरू ठेवा',
    step: 'पायरी', of: 'पैकी',
    vitals: 'महत्त्वाची चिन्हे',
    systolic: 'सिस्टोलिक BP', heartRate: 'हृदय गती', spo2: 'SpO₂', rr: 'श्वसन दर',
    bloodLoss: 'रक्त तोटा (अंदाज)',
    uterineTone: 'गर्भाशय टोन', soft: 'मऊ · शिथिल', firm: 'कठोर · आकुंचित',
    placenta: 'नाळ', pComplete: 'पूर्ण निघाली',
    pIncomplete: 'अपूर्ण', pUndelivered: 'अजून निघाली नाही',
    staff: 'सध्या कोण आहे?', solo: 'फक्त मी', team: 'मी + इतर',
    shockIndex: 'शॉक इंडेक्स',
    triggerReferral: 'रेफरल तयार करा',
    referralPassport: 'रेफरल पासपोर्ट',
    passportId: 'पासपोर्ट ID', sendVia: 'पाठवा',
    whatsapp: 'व्हॉट्सअ‍ॅप', nfcTap: 'NFC बँड', sms: 'SMS', qrPrint: 'QR प्रिंट',
    referralSent: 'रेफरल पाठवला',
    openMonitor: 'रुग्ण निरीक्षण उघडा',
    backHome: 'होमवर परत',
    takeNow: 'आता करा', logged: 'नोंदवले',
    monitor: 'रुग्ण निरीक्षण', sinceReferral: 'रेफरलनंतर',
    endMonitoring: 'निरीक्षण थांबवा',
    goldenMinute: 'गोल्डन मिनिट',
  },
};

// ══════════════════════════════════════════════════════════════════
// PROTOCOLS
// ══════════════════════════════════════════════════════════════════

const PROTOCOLS = {
  pph: {
    id: 'pph', featured: true,
    category: { en: 'Obstetric Emergency', hi: 'प्रसूति आपातकाल', mr: 'प्रसूती आणीबाणी' },
    title: { en: 'Postpartum Haemorrhage', hi: 'प्रसवोत्तर रक्तस्राव', mr: 'प्रसवानंतर रक्तस्त्राव' },
    subtitle: { en: 'Blood loss ≥500ml post-delivery · escalate on any haemodynamic instability', hi: 'प्रसव के बाद ≥500ml रक्त हानि', mr: 'प्रसवानंतर ≥500ml रक्त तोटा' },
    actWithin: { en: '60 seconds', hi: '60 सेकंड', mr: '60 सेकंद' },
    tag: 'CODE RED',
  },
  neonatal: {
    id: 'neonatal', featured: true,
    category: { en: 'Neonatal Emergency', hi: 'नवजात आपातकाल', mr: 'नवजात आपत्काल' },
    title: { en: 'Birth Asphyxia', hi: 'नवजात श्वासावरोध', mr: 'नवजात श्वासावरोध' },
    subtitle: { en: 'Newborn not breathing · gasping · HR <100 at birth', hi: 'नवजात साँस नहीं ले रहा', mr: 'नवजात श्वास घेत नाही' },
    actWithin: { en: '60 seconds', hi: '60 सेकंड', mr: '60 सेकंद' },
    tag: 'GOLDEN MINUTE',
  },
  eclampsia: {
    id: 'eclampsia',
    category: { en: 'Obstetric', hi: 'प्रसूति', mr: 'प्रसूती' },
    title: { en: 'Eclampsia', hi: 'एक्लेम्प्सिया', mr: 'एक्लेम्प्सिया' },
    subtitle: { en: 'Convulsions in pregnancy / postpartum with hypertension', hi: 'गर्भावस्था में दौरे', mr: 'गर्भावस्थेत झटके' },
  },
  snakebite: {
    id: 'snakebite',
    category: { en: 'Envenomation', hi: 'विषाक्तता', mr: 'विषबाधा' },
    title: { en: 'Snakebite', hi: 'साँप का काटा', mr: 'सर्पदंश' },
    subtitle: { en: 'Suspected Big Four envenomation', hi: 'साँप के काटने का संदेह', mr: 'सर्पदंशाचा संशय' },
  },
  stroke: {
    id: 'stroke',
    category: { en: 'Neurological', hi: 'न्यूरोलॉजिकल', mr: 'न्यूरोलॉजिकल' },
    title: { en: 'Acute Stroke', hi: 'तीव्र स्ट्रोक', mr: 'तीव्र स्ट्रोक' },
    subtitle: { en: 'FAST positive · thrombolysis window', hi: 'FAST सकारात्मक', mr: 'FAST सकारात्मक' },
  },
  trauma: {
    id: 'trauma',
    category: { en: 'Trauma', hi: 'आघात', mr: 'अपघात' },
    title: { en: 'Trauma & Shock', hi: 'आघात व शॉक', mr: 'अपघात व शॉक' },
    subtitle: { en: 'Major bleed · RTA · poly-trauma', hi: 'गंभीर रक्तस्राव', mr: 'गंभीर रक्तस्त्राव' },
  },
};

// ══════════════════════════════════════════════════════════════════
// PPH — 6 step protocol
// ══════════════════════════════════════════════════════════════════

const PPH_STEPS = [
  {
    id: 'assess',
    label: { en: 'Assess', hi: 'मूल्यांकन', mr: 'मूल्यांकन' },
    title: { en: 'Assessment', hi: 'मूल्यांकन', mr: 'मूल्यांकन' },
    summary: {
      en: 'Vitals, blood loss, uterine tone, placenta, staff present. Tone determines the downstream pathway.',
      hi: 'वाइटल्स, रक्त हानि, गर्भाशय टोन, प्लेसेंटा, स्टाफ।',
      mr: 'व्हायटल्स, रक्त तोटा, गर्भाशय टोन, नाळ, कर्मचारी.',
    },
  },
  {
    id: 'firstActions',
    label: { en: 'Act', hi: 'क्रिया', mr: 'क्रिया' },
    title: { en: 'First Actions', hi: 'पहली क्रियाएँ', mr: 'पहिल्या क्रिया' },
    summary: {
      en: 'Actions adapt to whether you are alone or with team.',
      hi: 'स्टाफ के अनुसार क्रियाएँ बदलती हैं।',
      mr: 'कर्मचाऱ्यांनुसार क्रिया बदलतात.',
    },
  },
  {
    id: 'medicate',
    label: { en: 'Drugs', hi: 'औषधि', mr: 'औषध' },
    title: { en: 'TXA + Uterotonics', hi: 'TXA + यूटरोटोनिक', mr: 'TXA + यूटरोटोनिक' },
    summary: {
      en: 'TXA 1g IV + Oxytocin 10 IU IM within 1 minute for ALL PPH. Escalate ladder if atonic.',
      hi: 'सभी PPH में TXA 1g IV + ऑक्सीटोसिन 10 IU IM तुरंत।',
      mr: 'सर्व PPH मध्ये TXA 1g IV + ऑक्सीटोसिन 10 IU IM तात्काळ.',
    },
  },
  {
    id: 'fluids',
    label: { en: 'Fluids', hi: 'द्रव', mr: 'द्रव' },
    title: { en: 'Oxygen, IV Access, Fluids', hi: 'ऑक्सीजन, IV, द्रव', mr: 'ऑक्सिजन, IV, द्रव' },
    summary: {
      en: 'Oxygen first. Two IVs. Controlled fluids — NEVER exceed 2L crystalloid. After 2L the patient needs blood at district hospital.',
      hi: 'पहले ऑक्सीजन। 2L से अधिक द्रव न दें।',
      mr: 'आधी ऑक्सिजन. 2L पेक्षा जास्त नको.',
    },
    actions: [
      { en: 'Oxygen 8–10 L/min via face mask — start now', hi: 'ऑक्सीजन 8–10 L/min — तुरंत', mr: 'ऑक्सिजन 8–10 L/min — तात्काळ' },
      { en: 'Two 16G or 18G IV cannulae — both antecubital', hi: 'दो 16G/18G IV', mr: 'दोन 16G/18G IV' },
      { en: 'Collect blood sample for grouping · send WITH patient to district blood bank', hi: 'रक्त का नमूना — रेफरल के साथ भेजें', mr: 'रक्त नमुना — रेफरलसह पाठवा' },
      { en: 'Normal Saline or Ringer Lactate 1L rapid if SBP <90', hi: 'NS/RL 1L यदि SBP <90', mr: 'NS/RL 1L SBP <90 असल्यास' },
      { en: 'After 1L — REASSESS BP and pulse before next bolus', hi: '1L के बाद — पहले BP जाँचें', mr: '1L नंतर — आधी BP तपासा' },
      { en: 'STOP at 2L total — more crystalloid worsens clotting', hi: '2L पर रुकें', mr: '2L वर थांबा' },
      { en: 'Foley catheter · measure urine output hourly', hi: 'फोले कैथेटर', mr: 'फोले कॅथेटर' },
    ],
  },
  {
    id: 'control',
    label: { en: 'Control', hi: 'नियंत्रण', mr: 'नियंत्रण' },
    title: { en: 'Control Bleeding', hi: 'रक्तस्राव नियंत्रण', mr: 'रक्तस्त्राव नियंत्रण' },
    summary: {
      en: 'Pathway depends on uterine tone. Atonic → compression, tamponade. Firm → inspect for tears.',
      hi: 'टोन पर निर्भर।',
      mr: 'टोनवर अवलंबून.',
    },
  },
  {
    id: 'refer',
    label: { en: 'Refer', hi: 'रेफर', mr: 'रेफर' },
    title: { en: 'Generate Referral', hi: 'रेफरल बनाएँ', mr: 'रेफरल तयार करा' },
    summary: {
      en: 'All captured data packages into a passport. Referral fires if any red-flag criterion is met.',
      hi: 'सभी डेटा स्वचालित पैक।',
      mr: 'सर्व डेटा स्वयंचलित पॅक.',
    },
  },
];

// Uterotonic ladder - drugs actually on NHM list for PHCs
const PPH_DRUGS = [
  {
    name: 'Tranexamic Acid (TXA)',
    when: {
      en: 'GIVE TO EVERY PPH — no exceptions. First drug, before anything else.',
      hi: 'हर PPH में दें — कोई अपवाद नहीं। पहली दवा।',
      mr: 'प्रत्येक PPH मध्ये द्या — अपवाद नाही. पहिलं औषध.',
    },
    dose: '1 g (10 ml)',
    route: 'IV slow over 10 min',
    dilution: {
      en: 'Draw 1 g (10 ml of 100 mg/ml) from 2 ampoules into the same syringe. Add to 100 ml Normal Saline bag. Run at 10 ml/min (≈ 10 drops/min with standard macro drip set). Full 100 ml finishes in 10 minutes.',
      hi: '1 g (10 ml, 100 mg/ml) को 2 एम्पूल से एक सिरिंज में लें। 100 ml NS की बोतल में मिलाएँ। 10 ml/min की दर से चलाएँ (मैक्रो सेट से ≈10 बूँद/मिनट)। 10 मिनट में पूरा।',
      mr: '1 g (10 ml, 100 mg/ml) 2 अँपुलमधून एकाच सिरिंजमध्ये घ्या. 100 ml NS बॅगमध्ये मिसळा. 10 ml/min दराने चालवा (मॅक्रो सेटने ≈10 थेंब/मिनिट). 10 मिनिटांत पूर्ण.',
    },
    why: {
      en: 'Stops clots from breaking down. Cuts bleeding deaths by 19% — but only if given within 3 hours of bleeding start (WOMAN trial).',
      hi: 'थक्के टूटने से रोकता है। 3 घंटे में दें तो मौत 19% कम (WOMAN ट्रायल)।',
      mr: 'गोठण्यांचे तुटणे थांबवते. 3 तासांत दिल्यास मृत्यू 19% कमी (WOMAN ट्रायल).',
    },
    warning: {
      en: 'Do not wait for other drugs — start TXA while someone prepares oxytocin. Never push undiluted fast — causes sudden low BP.',
      hi: 'देरी न करें। कभी बिना पतला किए तेज़ी से न दें — BP गिर सकता है।',
      mr: 'विलंब नको. कधीही पातळ न करता जोरात देऊ नका — BP पडू शकते.',
    },
    nextIf: {
      en: 'If still bleeding after 30 minutes → give another 1 g IV (same dilution, same rate)',
      hi: '30 मिनट बाद भी खून बहे → फिर 1 g IV दें (उसी तरह पतला करें)',
      mr: '30 मिनिटांनंतरही रक्तस्त्राव → पुन्हा 1 g IV द्या (त्याच प्रकारे पातळ करा)',
    },
    tier: 0, critical: true,
  },
  {
    name: 'Oxytocin',
    when: {
      en: 'Uterus is SOFT (atonic) · FIRST drug for atony · give within 1 minute',
      hi: 'गर्भाशय नरम है → पहली दवा · 1 मिनट में',
      mr: 'गर्भाशय मऊ आहे → पहिलं औषध · 1 मिनिटात',
    },
    dose: '10 IU',
    route: 'IM — thigh or deltoid (no dilution needed)',
    dilution: {
      en: 'FIRST dose: 10 IU IM straight from 10 IU/ml ampoule — no dilution, no mixing. Give into thigh or shoulder muscle. \n\nMAINTENANCE drip (after first IM dose): Add 20 IU oxytocin (2 ampoules) to 500 ml Normal Saline. Run at 125 ml/hr = about 40 drops/min with macro drip set. Continues over 4 hours.',
      hi: 'पहली खुराक: 10 IU IM — सीधे एम्पूल से, पतला न करें। जाँघ या कंधे की मांसपेशी में।\n\nमेंटेनेंस ड्रिप: 20 IU (2 एम्पूल) को 500 ml NS में मिलाएँ। 125 ml/घंटा = ≈40 बूँद/मिनट। 4 घंटे चले।',
      mr: 'पहिला डोस: 10 IU IM — थेट अँपुलमधून, पातळ करू नका. मांडी किंवा खांद्याच्या स्नायूत.\n\nमेंटेनन्स ड्रिप: 20 IU (2 अँपुल) 500 ml NS मध्ये मिसळा. 125 ml/तास = ≈40 थेंब/मिनिट. 4 तास चालवा.',
    },
    why: {
      en: 'Makes the uterus contract tightly. A contracted uterus squeezes the bleeding vessels shut — the main way PPH stops.',
      hi: 'गर्भाशय को सिकोड़ता है। सिकुड़ा गर्भाशय रक्त वाहिकाओं को बंद करता है।',
      mr: 'गर्भाशय आकुंचित करते. आकुंचित गर्भाशय रक्तवाहिन्या बंद करते.',
    },
    warning: {
      en: 'NEVER give as IV bolus push — can cause sudden low BP and cardiac arrest. Always either IM, or dilute in NS and run slowly. Keep vials below 8°C.',
      hi: 'कभी IV बोलस न दें — दिल रुक सकता है। हमेशा IM या NS में पतला करके धीरे चलाएँ।',
      mr: 'कधीही IV बोलस देऊ नका — हृदय थांबू शकते. नेहमी IM किंवा NS मध्ये पातळ करून हळू.',
    },
    nextIf: {
      en: 'If bleeding continues at 15 minutes → try Ergometrine (but ONLY if BP is safe)',
      hi: '15 मिनट बाद भी खून → Ergometrine (BP सुरक्षित हो तो)',
      mr: '15 मिनिटांनंतरही रक्तस्त्राव → Ergometrine (BP सुरक्षित असल्यास)',
    },
    tier: 1,
  },
  {
    name: 'Methylergometrine',
    when: {
      en: 'Oxytocin already given but bleeding continues AND SBP is below 140, no pre-eclampsia, no heart disease',
      hi: 'Oxytocin काम नहीं किया · BP सुरक्षित है',
      mr: 'Oxytocin काम करत नाही · BP सुरक्षित आहे',
    },
    dose: '0.2 mg',
    route: 'IM — inject in muscle',
    why: {
      en: 'Second-line drug. Also contracts the uterus but different mechanism from oxytocin.',
      hi: 'दूसरी दवा। गर्भाशय को और सिकोड़ती है।',
      mr: 'दुसरं औषध. गर्भाशयाला अधिक आकुंचित करते.',
    },
    warning: {
      en: 'MUST CHECK BP FIRST. If SBP ≥140 OR patient has pre-eclampsia / heart disease — SKIP this drug completely.',
      hi: 'पहले BP देखें। 140+ हो तो न दें।',
      mr: 'आधी BP पहा. 140+ असल्यास देऊ नका.',
    },
    nextIf: {
      en: 'If BP is high OR drug unavailable → skip to Misoprostol',
      hi: 'BP ज्यादा है या दवा नहीं है → Misoprostol',
      mr: 'BP जास्त आहे किंवा औषध नाही → Misoprostol',
    },
    tier: 2, requiresBPCheck: true,
    dilution: {
      en: 'Draw 0.2 mg (1 ml of 200 mcg/ml ampoule) into syringe. Give IM straight — no dilution. Can also give IV slow over 1 minute if diluted with 5 ml NS (but IM is preferred and safer).',
      hi: '0.2 mg (200 mcg/ml एम्पूल से 1 ml) सिरिंज में लें। सीधे IM दें — पतला न करें। IV देना हो तो 5 ml NS में पतला करके 1 मिनट में धीरे (IM बेहतर है)।',
      mr: '0.2 mg (200 mcg/ml अँपुलमधून 1 ml) सिरिंजमध्ये घ्या. थेट IM द्या — पातळ करू नका. IV द्यायचंच असेल तर 5 ml NS मध्ये पातळ करून 1 मिनिटात हळू (IM चांगलं).',
    },
  },
  {
    name: 'Misoprostol',
    when: {
      en: 'Ergometrine cannot be given (high BP) OR no injection drugs available at PHC',
      hi: 'Ergometrine नहीं दे सकते या इंजेक्शन नहीं हैं',
      mr: 'Ergometrine देता येत नाही किंवा इंजेक्शन नाहीत',
    },
    dose: '800 mcg (4 tablets × 200 mcg)',
    route: 'Sublingual — under the tongue',
    dilution: {
      en: 'No dilution. Place all 4 tablets (200 mcg each) under the patient\'s tongue. Tell her NOT to swallow them — they dissolve and absorb through the mouth lining over 5–10 minutes. Do not give water.',
      hi: 'पतला नहीं करना। चारों गोलियाँ (प्रत्येक 200 mcg) जीभ के नीचे रखें। निगलने को न कहें — 5–10 मिनट में मुँह से अवशोषित होंगी। पानी न दें।',
      mr: 'पातळ करायचं नाही. चारही गोळ्या (प्रत्येकी 200 mcg) जिभेखाली ठेवा. गिळायला सांगू नका — 5–10 मिनिटांत तोंडातून शोषल्या जातात. पाणी देऊ नका.',
    },
    why: {
      en: 'Backup drug. Works at room temperature — needs no cold chain. Available in most PHCs even when others are not.',
      hi: 'बैकअप दवा। रूम टेम्परेचर पर काम करती है।',
      mr: 'बॅकअप औषध. खोलीच्या तापमानावर काम करते.',
    },
    warning: {
      en: 'Fever and shivering are common after this — warn the family it is expected, not a reaction.',
      hi: 'बुखार, कंपकंपी सामान्य है — परिवार को बताएँ।',
      mr: 'ताप, थंडी सामान्य — कुटुंबाला सांगा.',
    },
    nextIf: {
      en: 'If bleeding still continues → STOP escalating drugs. Move to mechanical measures (massage, bimanual, condom tamponade).',
      hi: 'अब भी खून बहे → दवा बंद करें, मैकेनिकल उपाय करें',
      mr: 'तरीही रक्तस्त्राव → औषध थांबवा, यांत्रिक उपाय करा',
    },
    tier: 3,
  },
];

// Condom tamponade — elaborated step-by-step
const CONDOM_TAMPONADE = [
  {
    n: 1,
    title: { en: 'Prepare the balloon', hi: 'बैलून तैयार करें', mr: 'बलून तयार करा' },
    body: {
      en: 'Take a standard male condom. Unroll it over the tip of a 16F Foley catheter. Tie the open end firmly around the catheter shaft with silk thread — like tying a balloon to a straw.',
      hi: 'साधारण कंडोम लें। 16F फोले कैथेटर की नोक पर चढ़ाएँ। कैथेटर पर सिल्क धागे से कसकर बांधें — बैलून बंधाने की तरह।',
      mr: 'साधा कंडोम घ्या. 16F फोले कॅथेटरच्या टोकावर चढवा. सिल्क धाग्याने घट्ट बांधा — बलून बांधल्याप्रमाणे.',
    },
  },
  {
    n: 2,
    title: { en: 'Empty bladder, insert catheter', hi: 'मूत्राशय खाली करें, कैथेटर डालें', mr: 'मूत्राशय रिकामे करा, कॅथेटर घाला' },
    body: {
      en: 'First put in a urinary catheter and drain the bladder fully — a full bladder blocks the uterus from contracting. Then, using a Sims speculum for clear view, pass the tamponade catheter through the cervix into the uterine cavity.',
      hi: 'पहले यूरीनरी कैथेटर डालकर मूत्राशय पूरी तरह खाली करें (भरा मूत्राशय गर्भाशय को रोकता है)। फिर Sims स्पेकुलम से देखते हुए, टैम्पोनेड कैथेटर को गर्भाशय ग्रीवा से गर्भाशय में डालें।',
      mr: 'आधी लघवी कॅथेटरने मूत्राशय पूर्ण रिकामे करा (भरलेलं मूत्राशय गर्भाशयाला अडवतं). मग Sims स्पेकुलमने पाहत, टॅम्पोनेड कॅथेटर गर्भाशय ग्रीवेतून गर्भाशयात घाला.',
    },
  },
  {
    n: 3,
    title: { en: 'Inflate with warm saline', hi: 'गर्म सलाइन भरें', mr: 'कोमट सलाइन भरा' },
    body: {
      en: 'Using a 50 ml syringe, push warm normal saline into the catheter — 250 ml to start, up to 500 ml. The condom balloon expands inside the uterus and presses against the walls. Stop when you see bleeding from the vagina slow or stop.',
      hi: '50 ml सिरिंज से गर्म NS कैथेटर में डालें — 250 ml से शुरू, 500 ml तक। कंडोम बैलून गर्भाशय में फूलकर दीवारों पर दबाव डालता है। खून रुकने पर भरना बंद करें।',
      mr: '50 ml सिरिंजने कोमट NS कॅथेटरमध्ये टाका — 250 ml पासून सुरू, 500 ml पर्यंत. कंडोम बलून गर्भाशयात फुगतो व भिंतींवर दाब देतो. रक्तस्त्राव थांबल्यावर भरणं थांबवा.',
    },
  },
  {
    n: 4,
    title: { en: 'Clamp and watch', hi: 'क्लैंप करें, देखें', mr: 'क्लॅम्प करा, पहा' },
    body: {
      en: 'Clamp the outside end of the catheter so saline cannot leak back out. Watch for 5 minutes. Bleeding from the vagina should visibly reduce. If it does not reduce, the tamponade has failed — refer immediately.',
      hi: 'कैथेटर के बाहरी सिरे को क्लैंप करें ताकि सलाइन वापस न निकले। 5 मिनट देखें। खून कम होना चाहिए। न हो तो तुरंत रेफर करें।',
      mr: 'कॅथेटरच्या बाह्य टोकाला क्लॅम्प करा म्हणजे सलाइन परत येणार नाही. 5 मिनिटे पहा. रक्तस्त्राव कमी व्हायला हवा. न झाल्यास त्वरित रेफर करा.',
    },
  },
  {
    n: 5,
    title: { en: 'Continue oxytocin drip', hi: 'Oxytocin ड्रिप जारी रखें', mr: 'Oxytocin ड्रिप सुरू ठेवा' },
    body: {
      en: 'Keep the oxytocin infusion running: 20 IU of oxytocin mixed in 500 ml of normal saline, given IV over 4 hours. This keeps the uterus contracting tightly around the balloon.',
      hi: 'Oxytocin ड्रिप जारी रखें: 20 IU Oxytocin + 500 ml NS, 4 घंटे में IV। गर्भाशय बैलून के चारों ओर सिकुड़ा रहेगा।',
      mr: 'Oxytocin ड्रिप सुरू ठेवा: 20 IU Oxytocin + 500 ml NS, 4 तासांत IV. गर्भाशय बलूनभोवती आकुंचित राहील.',
    },
  },
  {
    n: 6,
    title: { en: 'Transfer with balloon in place', hi: 'बैलून के साथ रेफर करें', mr: 'बलूनसह रेफर करा' },
    body: {
      en: 'Do NOT remove the balloon. Send the patient to the district hospital with the catheter and inflated condom still inside the uterus. District hospital will remove it safely only after 24 hours.',
      hi: 'बैलून न निकालें। कैथेटर और फूला हुआ कंडोम गर्भाशय में छोड़कर जिला अस्पताल रेफर करें। वहाँ 24 घंटे बाद सुरक्षित हटाया जाएगा।',
      mr: 'बलून काढू नका. कॅथेटर आणि फुगलेला कंडोम गर्भाशयात तसाच ठेवून जिल्हा रुग्णालयात पाठवा. तिथे 24 तासांनी सुरक्षितपणे काढतील.',
    },
  },
];

const REFERRAL_TRIGGERS = [
  { en: 'Shock Index >1.1', hi: 'SI >1.1', mr: 'SI >1.1' },
  { en: 'SBP <90 after 1L fluids', hi: 'SBP <90 द्रव के बाद', mr: 'SBP <90 द्रवानंतर' },
  { en: 'Estimated blood loss >1000 ml', hi: 'रक्त हानि >1000ml', mr: 'रक्त तोटा >1000ml' },
  { en: 'Uterus not contracting after 2 doses oxytocin', hi: '2 खुराक ऑक्सीटोसिन बाद भी अटोनी', mr: '2 डोस ऑक्सीटोसिननंतरही अटोनी' },
  { en: 'Retained placenta at 30 min', hi: '30 मिनट बाद भी प्लेसेंटा', mr: '30 मिनिटांनंतरही नाळ' },
  { en: 'Altered consciousness · oozing from IV sites', hi: 'चेतना कम', mr: 'चेतना कमी' },
];

// Monitor tasks — 3 essential ones only
const MONITOR_TASKS = [
  { id: 'bp', label: { en: 'BP + pulse', hi: 'BP + नाड़ी', mr: 'BP + नाडी' }, intervalSec: 300 },
  { id: 'conscious', label: { en: 'Consciousness (AVPU)', hi: 'चेतना', mr: 'चेतना' }, intervalSec: 600 },
  { id: 'massage', label: { en: 'Uterine massage (if atonic)', hi: 'गर्भाशय मालिश', mr: 'गर्भाशय मसाज' }, intervalSec: 900 },
];

// ══════════════════════════════════════════════════════════════════
// NEONATAL — NRP / HBB
// ══════════════════════════════════════════════════════════════════

const NEONATAL_STEPS = [
  {
    id: 'initial', time: '0–30s',
    label: { en: 'Initial', hi: 'प्रारंभिक', mr: 'प्रारंभिक' },
    title: { en: 'Initial Steps · 30 seconds', hi: 'प्रारंभिक चरण · 30 सेकंड', mr: 'प्रारंभिक पायऱ्या · 30 सेकंद' },
    actions: [
      { en: 'Warm — radiant warmer or skin-to-skin · remove wet linen', hi: 'गर्म करें — गीले कपड़े हटाएँ', mr: 'उबदार ठेवा — ओली कपडे काढा' },
      { en: 'Position airway — sniffing position · shoulder roll', hi: 'वायुमार्ग — सूंघने की मुद्रा', mr: 'श्वासमार्ग — वास घेण्याची मुद्रा' },
      { en: 'Clear secretions — mouth first, then nose', hi: 'सक्शन — पहले मुँह', mr: 'सक्शन — आधी तोंड' },
      { en: 'Dry thoroughly and stimulate — rub back, flick soles', hi: 'सुखाएँ और उत्तेजित करें', mr: 'कोरडे करा आणि उत्तेजित करा' },
      { en: 'Assess breathing and heart rate', hi: 'श्वास व HR जाँच', mr: 'श्वास व HR तपासा' },
    ],
  },
  {
    id: 'ppv', time: '30–60s',
    label: { en: 'Ventilate', hi: 'वेंटिलेट', mr: 'व्हेंटिलेट' },
    title: { en: 'Positive Pressure Ventilation', hi: 'सकारात्मक दबाव वेंटिलेशन', mr: 'सकारात्मक दाब व्हेंटिलेशन' },
    trigger: { en: 'If apnoeic/gasping OR HR <100 → start PPV NOW', hi: 'साँस नहीं या HR <100 → PPV', mr: 'श्वास नाही किंवा HR <100 → PPV' },
    actions: [
      { en: 'Bag-mask ventilation 40–60 breaths/min', hi: 'बैग-मास्क 40–60/मिनट', mr: 'बॅग-मास्क 40–60/मिनिट' },
      { en: 'Start with room air (term) or 21–30% O₂ (preterm)', hi: 'कमरे की हवा से शुरू', mr: 'खोलीच्या हवेपासून सुरू' },
      { en: 'Watch chest rise — if poor, run MR SOPA', hi: 'छाती की गति देखें', mr: 'छाती हालचाल पहा' },
      { en: 'Reassess HR at 30 seconds of effective PPV', hi: '30 सेकंड बाद HR जाँचें', mr: '30 सेकंद नंतर HR तपासा' },
    ],
    mrSopa: true,
  },
  {
    id: 'compressions', time: '60–90s',
    label: { en: 'Compressions', hi: 'दबाव', mr: 'दाब' },
    title: { en: 'Chest Compressions', hi: 'सीने का दबाव', mr: 'छातीवर दाब' },
    trigger: { en: 'If HR <60 after 30s of EFFECTIVE PPV', hi: 'प्रभावी PPV के बाद HR <60', mr: 'प्रभावी PPV नंतर HR <60' },
    actions: [
      { en: '2-thumb technique on lower third of sternum', hi: '2-थंब तकनीक', mr: '2-अंगठा तंत्र' },
      { en: 'Depth: 1/3 of antero-posterior chest diameter', hi: 'गहराई 1/3 AP व्यास', mr: 'खोली 1/3 AP व्यास' },
      { en: 'Ratio 3:1 — 90 compressions + 30 breaths / min', hi: '3:1 — 90 दबाव + 30 श्वास', mr: '3:1 — 90 दाब + 30 श्वास' },
      { en: 'Increase FiO₂ to 100%', hi: 'FiO₂ 100%', mr: 'FiO₂ 100%' },
      { en: 'Reassess HR every 60 seconds', hi: 'हर 60 सेकंड HR', mr: 'दर 60 सेकंद HR' },
    ],
  },
  {
    id: 'epinephrine', time: '90s+',
    label: { en: 'Epinephrine', hi: 'एपिनेफ्रिन', mr: 'एपिनेफ्रिन' },
    title: { en: 'Epinephrine & IV Access', hi: 'एपिनेफ्रिन', mr: 'एपिनेफ्रिन' },
    trigger: { en: 'If HR <60 despite 60s of PPV + compressions', hi: '60s PPV+दबाव के बाद HR <60', mr: '60s PPV+दाब नंतर HR <60' },
    actions: [
      { en: 'Epinephrine 1:10,000 — 0.01–0.03 mg/kg IV (umbilical vein)', hi: 'एपिनेफ्रिन 0.01–0.03 mg/kg IV', mr: 'एपिनेफ्रिन 0.01–0.03 mg/kg IV' },
      { en: 'Via ETT if IV not ready: 0.05–0.1 mg/kg', hi: 'ETT: 0.05–0.1 mg/kg', mr: 'ETT: 0.05–0.1 mg/kg' },
      { en: 'Volume: NS 10 ml/kg IV over 5–10 min if hypovolaemic', hi: 'NS 10 ml/kg IV', mr: 'NS 10 ml/kg IV' },
      { en: 'Repeat epinephrine every 3–5 min', hi: 'हर 3–5 मिनट', mr: 'दर 3–5 मिनिट' },
      { en: 'If no HR after 20 min — discuss with MO', hi: '20 मिनट बाद HR नहीं — MO', mr: '20 मिनिटांनंतर HR नाही — MO' },
    ],
  },
  {
    id: 'transfer', time: 'Post',
    label: { en: 'Transfer', hi: 'स्थानांतरण', mr: 'हस्तांतरण' },
    title: { en: 'Post-Resuscitation Care', hi: 'पुनर्जीवन के बाद', mr: 'पुनरुज्जीवनानंतर' },
    actions: [
      { en: 'Maintain temperature 36.5–37.5°C (avoid hyperthermia)', hi: 'तापमान 36.5–37.5°C', mr: 'तापमान 36.5–37.5°C' },
      { en: 'Dextrose 10% 2 ml/kg IV if glucose <40 mg/dL', hi: 'D10 यदि ग्लूकोज <40', mr: 'D10 ग्लुकोज <40 असल्यास' },
      { en: 'Oxygen saturation target 91–95%', hi: 'SpO₂ 91–95%', mr: 'SpO₂ 91–95%' },
      { en: 'Transfer in kangaroo care or warmer', hi: 'कंगारू देखभाल', mr: 'कांगारू काळजी' },
      { en: 'Notify SNCU/NICU before arrival', hi: 'SNCU को सूचित', mr: 'SNCU ला कळवा' },
    ],
  },
];

const MR_SOPA = [
  { l: 'M', t: { en: 'Mask adjustment', hi: 'मास्क समायोजन', mr: 'मास्क समायोजन' } },
  { l: 'R', t: { en: 'Reposition airway', hi: 'वायुमार्ग पुनः स्थापित', mr: 'श्वासमार्ग पुनर्स्थापन' } },
  { l: 'S', t: { en: 'Suction mouth, nose', hi: 'मुँह, नाक सक्शन', mr: 'तोंड, नाक सक्शन' } },
  { l: 'O', t: { en: 'Open mouth', hi: 'मुँह खोलें', mr: 'तोंड उघडा' } },
  { l: 'P', t: { en: 'Pressure increase', hi: 'दबाव बढ़ाएँ', mr: 'दाब वाढवा' } },
  { l: 'A', t: { en: 'Alternative airway (ETT/LMA)', hi: 'वैकल्पिक वायुमार्ग', mr: 'पर्यायी श्वासमार्ग' } },
];

// ══════════════════════════════════════════════════════════════════
// BRIEF PROTOCOLS
// ══════════════════════════════════════════════════════════════════

const BRIEF_PROTOCOLS = {
  eclampsia: {
    key: 'Magnesium Sulfate (Pritchard)',
    loading: '4g IV over 15 min + 10g IM deep',
    maintenance: '5g IM every 4 hrs × 24 hrs post-seizure',
    antidote: 'Calcium gluconate 10% 10ml IV over 10 min',
    bp: 'Labetalol 20 mg IV or Hydralazine 5–10 mg IV if DBP >110',
    monitor: ['Patellar reflex q1h', 'RR >12/min', 'Urine >30ml/hr'],
    refer: 'All cases · transfer in left lateral position',
  },
  snakebite: {
    key: 'Polyvalent ASV (Big Four)',
    loading: '10 vials (100 ml) in 200 ml NS IV over 1 hour',
    maintenance: 'Repeat 6–8 vials q6h until 20-WBCT normalises',
    antidote: 'Adrenaline 0.5 mg IM if anaphylaxis',
    bp: 'Neostigmine 0.5 mg IV + Atropine 0.6 mg IV if neurotoxic (ptosis)',
    monitor: ['20-WBCT at 0, 6, 12, 18, 24 hrs', 'Ptosis', 'Urine colour'],
    refer: 'All systemic envenomation after first ASV dose started',
  },
  stroke: {
    key: 'FAST + stabilise + refer',
    loading: 'Face · Arms · Speech · Time',
    maintenance: 'Last known well <4.5 hrs = thrombolysis candidate',
    antidote: '—',
    bp: 'Lower BP cautiously if haemorrhagic · MAP >65 if ischaemic',
    monitor: ['GCS q15min', 'Glucose (treat <70 or >180)'],
    refer: 'Direct to stroke-ready centre · skip nearer facility if slower',
  },
  trauma: {
    key: 'Tranexamic Acid 1g IV',
    loading: 'Within 3 hours of injury (CRASH-2 trial)',
    maintenance: 'Target SBP 80–90 until haemostasis (permissive hypotension)',
    antidote: '—',
    bp: 'C-spine · Airway · Breathing · Circulation · Disability · Exposure',
    monitor: ['2 wide-bore IVs', 'Pelvic binder if pelvic fracture'],
    refer: 'Load-and-go if SBP <90 after 1L crystalloid',
  },
};

// ══════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════

export default function SahAI() {
  const [screen, setScreen] = useState('home');
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [lang, setLang] = useState('en');
  const [patient, setPatient] = useState({
    age: 26, weight: 55, gravida: 'G2P1',
    vitals: { sbp: '', hr: '', spo2: '', rr: '' },
    bloodLoss: '', uterineTone: null, placentaStatus: null, staffCount: null,
    drugsGiven: [], timeline: [], startTime: Date.now(),
  });
  const [timerActive, setTimerActive] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [apgarMinute, setApgarMinute] = useState(1);
  const [apgarScores, setApgarScores] = useState({ a: 0, p: 0, g: 0, ac: 0, r: 0 });
  const [completedActions, setCompletedActions] = useState(new Set());
  const [ergoBPConfirmed, setErgoBPConfirmed] = useState(false);
  const [tamponadeSteps, setTamponadeSteps] = useState(new Set());
  const [monitorTicks, setMonitorTicks] = useState({});
  const [videoModal, setVideoModal] = useState(null);
  const [manualTriggers, setManualTriggers] = useState(new Set());
  const [monitorElapsed, setMonitorElapsed] = useState(0);

  const t = (key) => i18n[lang][key] || i18n.en[key] || key;
  const tr = (obj) => (obj ? obj[lang] || obj.en : '');

  // Memoized vital input handlers
  const updateVitalSBP = useCallback((v) => setPatient((p) => ({ ...p, vitals: { ...p.vitals, sbp: v } })), []);
  const updateVitalHR = useCallback((v) => setPatient((p) => ({ ...p, vitals: { ...p.vitals, hr: v } })), []);
  const updateVitalSPO2 = useCallback((v) => setPatient((p) => ({ ...p, vitals: { ...p.vitals, spo2: v } })), []);
  const updateVitalRR = useCallback((v) => setPatient((p) => ({ ...p, vitals: { ...p.vitals, rr: v } })), []);

  const speak = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN' }[lang] || 'en-US';
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  useEffect(() => {
    if (screen !== 'monitor') return;
    const id = setInterval(() => setMonitorElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [screen]);

  const openProtocol = (id) => {
    setActiveProtocol(id);
    setStepIndex(0);
    setCompletedActions(new Set());
    setErgoBPConfirmed(false);
    setTamponadeSteps(new Set());
    setMonitorTicks({});
    setMonitorElapsed(0);
    setElapsedSec(0);
    setTimerActive(false);
    setPatient({
      age: 26, weight: 55, gravida: 'G2P1',
      vitals: { sbp: '', hr: '', spo2: '', rr: '' },
      bloodLoss: '', uterineTone: null, placentaStatus: null, staffCount: null,
      drugsGiven: [], timeline: [], startTime: Date.now(),
    });
    setScreen('protocol');
    if (id === 'neonatal') setTimeout(() => setTimerActive(true), 300);
  };

  const closeProtocol = () => {
    setScreen('home');
    setActiveProtocol(null);
    setTimerActive(false);
  };

  const addDrug = (drug) => {
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPatient((p) => ({
      ...p,
      drugsGiven: [...p.drugsGiven, { ...drug, timestamp: ts }],
      timeline: [...p.timeline, { event: `${drug.name} ${drug.dose} ${drug.route}`, time: ts }],
    }));
  };

  const shockIndex = useMemo(() => {
    const sbp = parseFloat(patient.vitals.sbp);
    const hr = parseFloat(patient.vitals.hr);
    if (sbp > 0 && hr > 0) return (hr / sbp).toFixed(2);
    return null;
  }, [patient.vitals.sbp, patient.vitals.hr]);

  const riskLevel = useMemo(() => {
    const si = parseFloat(shockIndex);
    if (!si) return null;
    if (si > 1.7) return 'critical';
    if (si >= 1.1) return 'high';
    if (si >= 0.9) return 'moderate';
    return 'stable';
  }, [shockIndex]);

  const sbpVal = parseFloat(patient.vitals.sbp) || 0;
  const ergoSafe = sbpVal > 0 && sbpVal < 140;
  const apgarTotal = apgarScores.a + apgarScores.p + apgarScores.g + apgarScores.ac + apgarScores.r;

  // ──────────────────────────────────────────────────
  // SHARED TOP
  // ──────────────────────────────────────────────────

  const StatusBar = () => (
    <div className="flex items-center justify-between px-4 sm:px-5 pt-2 sm:pt-3 pb-2 text-xs sm:text-sm tracking-wide text-sky font-mono">
      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex items-center gap-1 sm:gap-1.5">
        <Signal className="w-3 h-3 sm:w-3.5 sm:h-3.5" /><Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5" /><Battery className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
    </div>
  );

  const TopBar = ({ onClose, title, subtitle }) => (
    <div className="sticky top-17 z-40 backdrop-blur-2xl bg-dark-card/95 border-b border-teal/10">
      <StatusBar />
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 gap-2 sm:gap-3 flex-wrap">
        {onClose ? (
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center hover:bg-teal/20 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal/50">
            <ChevronLeft className="w-4 h-4 text-cream" />
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-linear-to-br from-terracotta to-terra-deep flex items-center justify-center shadow-lg shadow-terracotta/20 shrink-0">
              <Stethoscope className="w-4 h-4 text-cream" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-semibold tracking-tight text-cream">{t('brand')}</div>
              <div className="text-xs text-sky tracking-wider uppercase">{t('tagline')}</div>
            </div>
          </div>
        )}

        {title && (
          <div className="text-center flex-1 px-1 sm:px-2 min-w-0 w-full sm:w-auto">
            <div className="text-xs sm:text-sm font-semibold text-cream truncate">{title}</div>
            {subtitle && <div className="text-[10px] sm:text-xs text-sky truncate">{subtitle}</div>}
          </div>
        )}

        <div className="flex items-center gap-0.5 bg-teal/5 rounded-full p-0.5 border border-teal/10">
          {['en', 'hi', 'mr'].map((code) => (
            <button key={code} onClick={() => setLang(code)}
              className={`px-2 py-1 text-xs font-semibold tracking-wider uppercase rounded-full transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal/50 ${
                lang === code ? 'bg-cream text-dark font-bold' : 'text-sky hover:bg-teal/10'
              }`}
              aria-label={`Switch to ${code === 'en' ? 'English' : code === 'hi' ? 'Hindi' : 'Marathi'}`}
              aria-pressed={lang === code}>
              {code === 'en' ? 'EN' : code === 'hi' ? 'हि' : 'मरा'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────
  // HOME
  // ──────────────────────────────────────────────────

  const HomeScreen = () => {
    const featured = ['pph', 'neonatal'];
    const others = ['eclampsia', 'snakebite', 'stroke', 'trauma'];
    const icons = { pph: Droplet, neonatal: Baby, eclampsia: Brain, snakebite: Zap, stroke: Activity, trauma: Bone };

    return (
      <div className="pt-0">
        <TopBar />
        <div className="w-full px-3 sm:px-5 md:px-8 pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8">
          <div className="mb-6 sm:mb-7">
            <div className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sky mb-1 sm:mb-2">{t('stationId')}</div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight font-semibold text-cream tracking-tight">
              {t('choose')}
            </h1>
            <p className="text-xs sm:text-sm text-stone mt-1 sm:mt-2">{t('chooseSub')}</p>
          </div>

          <div className="mb-6 sm:mb-7">
            <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sky font-semibold">{t('priority')}</h2>
              <div className="flex items-center gap-1 text-xs text-terracotta">
                <div className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                <span>PRIORITY</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {featured.map((id) => {
                const p = PROTOCOLS[id];
                const Icon = icons[id];
                const isPPH = id === 'pph';
                return (
                  <button key={id} onClick={() => openProtocol(id)}
                    className="group relative w-full text-left overflow-hidden rounded-2xl sm:rounded-3xl transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-teal/50 cursor-pointer hover:shadow-lg hover:shadow-terracotta/20"
                    aria-label={`Emergency protocol: ${tr(p.title)}`}>
                    <div className={`absolute inset-0 ${isPPH ? 'bg-linear-to-br from-terra-deep/40 via-terracotta/30 to-dark' : 'bg-linear-to-br from-gold/20 via-terracotta/10 to-dark'}`} />
                    <div className={`absolute inset-0 border rounded-2xl sm:rounded-3xl ${isPPH ? 'border-terracotta/30' : 'border-gold/20'}`} />
                    {!isPPH && <Icon className="absolute -right-4 sm:-right-6 -bottom-4 sm:-bottom-6 w-28 sm:w-36 h-28 sm:h-36 text-gold/8" strokeWidth={1} />}
                    <div className="relative p-4 sm:p-5 md:p-6">
                      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className={`w-10 sm:w-11 h-10 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 ${isPPH ? 'bg-terracotta/20 text-terracotta' : 'bg-gold/15 text-gold'}`}>
                          <Icon className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-semibold tracking-[0.15em] uppercase ${isPPH ? 'text-terracotta' : 'text-gold'} mb-0.5 sm:mb-1`}>
                            {tr(p.category)}
                          </div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-cream leading-tight tracking-tight">
                            {tr(p.title)}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-stone leading-relaxed mb-3 sm:mb-4 pr-6 sm:pr-8">{tr(p.subtitle)}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 text-sky">
                          <Timer className="w-3 h-3 shrink-0" />
                          <span>Act within <span className="text-cream font-semibold">{tr(p.actWithin)}</span></span>
                        </div>
                        <div className="hidden sm:block w-px h-3 bg-teal/20" />
                        <div className={`text-xs font-bold tracking-wider ${isPPH ? 'text-terracotta' : 'text-gold'}`}>
                          {p.tag}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sky font-semibold mb-2 sm:mb-3">{t('other')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {others.map((id) => {
                const p = PROTOCOLS[id];
                const Icon = icons[id];
                return (
                  <button key={id} onClick={() => openProtocol(id)}
                    className="text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-teal/5 border border-teal/20 transition active:scale-[0.98] hover:bg-teal/10 focus:outline-none focus:ring-2 focus:ring-teal/50 cursor-pointer"
                    aria-label={`Emergency protocol: ${tr(p.title)}`}>
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg sm:rounded-xl bg-teal/10 flex items-center justify-center mb-2 sm:mb-3">
                      <Icon className="w-4 h-4 text-cream" strokeWidth={2} />
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase text-sky mb-0.5 sm:mb-1">{tr(p.category)}</div>
                    <div className="text-xs sm:text-sm font-semibold text-cream leading-tight">{tr(p.title)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────
  // PPH FLOW
  // ──────────────────────────────────────────────────

  const PPHFlow = () => {
    const currentStep = PPH_STEPS[stepIndex];
    const protocol = PROTOCOLS.pph;
    const atonic = patient.uterineTone === 'soft';
    const firm = patient.uterineTone === 'firm';
    const retainedTissue = patient.placentaStatus === 'incomplete' || patient.placentaStatus === 'undelivered';
    const nextStep = () => stepIndex < PPH_STEPS.length - 1 ? setStepIndex(stepIndex + 1) : setScreen('passport');

    const toggle = (key) => {
      const ns = new Set(completedActions);
      if (ns.has(key)) ns.delete(key); else ns.add(key);
      setCompletedActions(ns);
    };

    return (
      <div>
        <TopBar onClose={closeProtocol} title={tr(protocol.title)} subtitle={tr(protocol.category)} />

        <div className="sticky top-40 z-30 bg-dark-card/90 backdrop-blur-xl border-b border-teal/10 px-3 sm:px-5 py-3">
          <div className="flex items-center gap-1">
            {PPH_STEPS.map((s, i) => (
              <button key={s.id} onClick={() => setStepIndex(i)} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer transition">
                <div className={`h-1 w-full rounded-full transition-all ${
                  i < stepIndex ? 'bg-emerald-400' : i === stepIndex ? 'bg-terracotta' : 'bg-teal/20'
                }`} />
                <div className={`text-[9px] font-semibold tracking-wider uppercase ${
                  i === stepIndex ? 'text-terracotta' : i < stepIndex ? 'text-emerald-400/60' : 'text-sky'
                }`}>
                  {tr(s.label)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full px-3 sm:px-5 pt-24 sm:pt-28 md:pt-32 pb-28 sm:pb-32">
          <div className="mb-5">
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1">
              {t('step')} {stepIndex + 1} {t('of')} {PPH_STEPS.length}
            </div>
            <h2 className="text-[22px] font-semibold text-stone-50 leading-tight tracking-tight" style={{ fontFamily: 'var(--display)' }}>
              {tr(currentStep.title)}
            </h2>
            <p className="text-sm text-stone-400 mt-2 leading-relaxed">{tr(currentStep.summary)}</p>
          </div>

          {/* ASSESS */}
          {currentStep.id === 'assess' && (
            <div className="space-y-4">
              <Card title={t('vitals')}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <VitalInput label={t('systolic')} unit="mmHg" value={patient.vitals.sbp}
                    onChange={updateVitalSBP} placeholder="120" />
                  <VitalInput label={t('heartRate')} unit="bpm" value={patient.vitals.hr}
                    onChange={updateVitalHR} placeholder="80" />
                  <VitalInput label={t('spo2')} unit="%" value={patient.vitals.spo2}
                    onChange={updateVitalSPO2} placeholder="98" />
                  <VitalInput label={t('rr')} unit="/min" value={patient.vitals.rr}
                    onChange={updateVitalRR} placeholder="18" />
                </div>
              </Card>

              {shockIndex && <ShockCard si={shockIndex} level={riskLevel} t={t} />}

              <Card title={t('bloodLoss')}>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'mild', l: '<500 ml' },
                    { v: 'moderate', l: '500–1000' },
                    { v: 'severe', l: '>1000 ml' },
                  ].map((o) => (
                    <button key={o.v} onClick={() => setPatient((p) => ({ ...p, bloodLoss: o.v }))}
                      className={`p-2.5 rounded-xl text-center border transition ${
                        patient.bloodLoss === o.v ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          : 'bg-white/2 border-white/6 text-stone-400'
                      }`}>
                      <div className="text-[13px] font-semibold">{o.l}</div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card title={t('uterineTone')} badge="BRANCH">
                <div className="text-[11px] text-stone-400 mb-3">Palpate fundus. Your answer changes the pathway.</div>
                <div className="grid grid-cols-2 gap-2">
                  <SelectButton active={atonic} onClick={() => setPatient((p) => ({ ...p, uterineTone: 'soft' }))}
                    title={t('soft')} hint="Atonic · 70–80%" color="rose" />
                  <SelectButton active={firm} onClick={() => setPatient((p) => ({ ...p, uterineTone: 'firm' }))}
                    title={t('firm')} hint="Trauma or tissue" color="amber" />
                </div>
              </Card>

              <Card title={t('placenta')}>
                <div className="space-y-2">
                  {[
                    { v: 'delivered', l: t('pComplete'), c: 'emerald' },
                    { v: 'incomplete', l: t('pIncomplete'), c: 'amber' },
                    { v: 'undelivered', l: t('pUndelivered'), c: 'rose' },
                  ].map((o) => (
                    <RadioRow key={o.v} active={patient.placentaStatus === o.v}
                      onClick={() => setPatient((p) => ({ ...p, placentaStatus: o.v }))}
                      label={o.l} color={o.c} />
                  ))}
                </div>
              </Card>

              <Card title={t('staff')}>
                <div className="grid grid-cols-2 gap-2">
                  <SelectButton active={patient.staffCount === 'solo'}
                    onClick={() => setPatient((p) => ({ ...p, staffCount: 'solo' }))}
                    title={t('solo')} hint="Solo mode" color="amber" />
                  <SelectButton active={patient.staffCount === 'team'}
                    onClick={() => setPatient((p) => ({ ...p, staffCount: 'team' }))}
                    title={t('team')} hint="Split roles" color="emerald" />
                </div>
              </Card>
            </div>
          )}

          {/* FIRST ACTIONS */}
          {currentStep.id === 'firstActions' && (
            <div className="space-y-3">
              {!patient.staffCount && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center">
                  <AlertCircle className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                  <div className="text-[13px] text-amber-100 font-semibold mb-2">Set staff count in Step 1 first</div>
                  <button onClick={() => setStepIndex(0)} className="px-4 py-2 rounded-lg bg-amber-500/20 text-[11px] font-semibold text-amber-100">
                    Back to Step 1
                  </button>
                </div>
              )}

              {patient.staffCount === 'solo' && (
                <>
                  <div className="p-4 rounded-2xl bg-linear-to-br from-amber-950/50 to-stone-950 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider mb-1">You are alone</div>
                        <p className="text-[12px] text-stone-200 leading-relaxed">
                          Stay at the patient's side. Do NOT leave to fetch supplies. Patient care comes before documentation — app auto-timestamps everything.
                        </p>
                      </div>
                    </div>
                  </div>

                  {[
                    { en: 'Shout loudly — attendant, family, anyone in the PHC', hi: 'ज़ोर से बुलाएँ', mr: 'जोराने बोलवा' },
                    { en: 'Keep patient flat · legs raised · blanket for warmth', hi: 'सपाट · पैर ऊँचे · कंबल', mr: 'सपाट · पाय उंच · पांघरूण' },
                    { en: 'Ask a family member or attendant to press firmly on the patient\'s lower belly (on the uterus, just below the belly button) with the flat of their hand. Show them exactly where and how hard — constant firm downward pressure, do NOT lift off. This buys you seconds to go call MO and 108.', hi: 'परिवार के किसी सदस्य को रोगी के पेट पर नाभि के ठीक नीचे (गर्भाशय पर) हथेली से ज़ोर से दबाव डालने को कहें। उन्हें दिखाएँ कहाँ और कितना ज़ोर — लगातार दबाव, हटाना नहीं। तब तक आप MO और 108 को कॉल करें।', mr: 'कुटुंबातील सदस्याला रुग्णाच्या पोटावर नाभीच्या अगदी खाली (गर्भाशयावर) तळहाताने घट्ट दाब द्यायला सांगा. कुठे व किती जोर, हे दाखवा — सतत दाब, उचलू नका. तेव्हा तुम्ही MO व 108 ला कॉल करा.' },
                  ].map((a, i) => (
                    <ChecklistItem key={i} label={tr(a)} checked={completedActions.has(`solo-${i}`)} onToggle={() => toggle(`solo-${i}`)} />
                  ))}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <PhoneButton icon={Phone} label="Call MO" sub="+91 98XXX 47291" color="emerald" />
                    <PhoneButton icon={Ambulance} label="Call 108" sub="Ambulance" color="rose" />
                  </div>
                </>
              )}

              {patient.staffCount === 'team' && (
                <>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-300" />
                    <div className="text-[12px] text-emerald-100">
                      <span className="font-semibold">Team present.</span> Split roles: one manages patient, one calls + documents.
                    </div>
                  </div>

                  {[
                    { en: 'Second person: hold uterine massage / compression', hi: 'दूसरा: गर्भाशय मालिश', mr: 'दुसरा: गर्भाशय मसाज' },
                    { en: 'Assign one person as timekeeper + documenter', hi: 'टाइमकीपर नियुक्त', mr: 'टाइमकीपर नेमा' },
                    { en: 'Position flat · legs raised · keep warm', hi: 'सपाट · पैर ऊँचे · गर्म', mr: 'सपाट · पाय उंच · उबदार' },
                    { en: 'One person calls MO + 108', hi: 'एक MO + 108 कॉल करे', mr: 'एकाने MO + 108 ला फोन करा' },
                  ].map((a, i) => (
                    <ChecklistItem key={i} label={tr(a)} checked={completedActions.has(`team-${i}`)} onToggle={() => toggle(`team-${i}`)} />
                  ))}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <PhoneButton icon={Phone} label="Call MO" sub="+91 98XXX 47291" color="emerald" />
                    <PhoneButton icon={Ambulance} label="Call 108" sub="Ambulance" color="rose" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* MEDICATE */}
          {currentStep.id === 'medicate' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <div className="text-[12px] text-sky-100/90 leading-relaxed">
                  <span className="font-semibold">TXA + Oxytocin</span> for ALL PPH immediately.{' '}
                  {atonic && <>Atonic → escalate every 15 min if bleeding persists.</>}
                  {firm && <>Firm uterus → uterotonics won't help. Skip to next step for inspection.</>}
                  {!patient.uterineTone && <>Set tone in Step 1 to unlock full ladder.</>}
                </div>
              </div>

              {PPH_DRUGS.map((drug) => {
                const given = patient.drugsGiven.find((d) => d.name === drug.name);
                const bpLocked = drug.requiresBPCheck && !ergoSafe && !ergoBPConfirmed;
                if (firm && drug.tier > 1) return null;

                return (
                  <DrugCard key={drug.name} drug={drug} given={given} locked={bpLocked}
                    sbpVal={sbpVal} ergoSafe={ergoSafe}
                    onConfirmBP={() => setErgoBPConfirmed(true)}
                    onGive={() => addDrug(drug)}
                    onSpeak={() => speak(`${drug.name}. When to give: ${tr(drug.when)}. Dose ${drug.dose}, ${drug.route}. ${drug.dilution ? 'How to give: ' + tr(drug.dilution) + '. ' : ''}Why: ${tr(drug.why)}. Warning: ${tr(drug.warning)}. If not enough: ${tr(drug.nextIf)}.`)}
                    tr={tr} />
                );
              })}

              {firm && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-100 leading-relaxed">
                    Firm uterus but bleeding continues — cause is likely trauma or tissue. Proceed to next step.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FLUIDS */}
          {currentStep.id === 'fluids' && (
            <div className="space-y-3">
              {[
                {
                  title: { en: 'Oxygen 8–10 L/min', hi: 'ऑक्सीजन 8–10 L/min', mr: 'ऑक्सिजन 8–10 L/min' },
                  body: { en: 'Start oxygen immediately via face mask. Do this BEFORE you start the IV line.', hi: 'चेहरे के मास्क से तुरंत ऑक्सीजन शुरू करें। IV से पहले।', mr: 'चेहऱ्याच्या मास्कने त्वरित ऑक्सिजन सुरू करा. IV पूर्वी.' },
                },
                {
                  title: { en: 'Two large IV cannulae', hi: 'दो बड़ी IV लाइन', mr: 'दोन मोठ्या IV लाइन' },
                  body: { en: 'Insert two 16G or 18G cannulae — one in each antecubital fossa (inside of elbow). Big cannulae = fast fluid, small cannulae = waste of time.', hi: 'दो 16G या 18G कैन्युला लगाएँ — एक-एक कोहनी की सील में। बड़े कैन्युला = तेज़ द्रव।', mr: 'दोन 16G किंवा 18G कॅन्युला लावा — एक-एक कोपराच्या आतल्या बाजूला. मोठे कॅन्युला = जलद द्रव.' },
                },
                {
                  title: { en: 'Draw blood sample for grouping', hi: 'ग्रुपिंग के लिए रक्त का नमूना', mr: 'ग्रुपिंगसाठी रक्त नमुना' },
                  body: { en: 'Before you start fluids, draw 5 ml of blood into a plain (red top) tube. Write patient\'s name and current time on the tube. This sample goes WITH the patient in the ambulance — the district hospital will match blood for transfusion from this sample. We do NOT do crossmatch at PHC.', hi: 'द्रव से पहले 5 ml खून एक प्लेन ट्यूब में लें। ट्यूब पर रोगी का नाम और समय लिखें। यह नमूना रोगी के साथ एम्बुलेंस में जाए — जिला अस्पताल में इसी से खून मिलाया जाएगा।', mr: 'द्रवापूर्वी 5 ml रक्त प्लेन ट्यूबमध्ये घ्या. ट्यूबवर नाव व वेळ लिहा. हा नमुना रुग्णासोबत रुग्णवाहिकेत पाठवा — जिल्हा रुग्णालयात त्याच नमुन्यावरून रक्त जुळवले जाईल.' },
                },
                {
                  title: { en: '1 L Normal Saline or Ringer Lactate', hi: '1 L NS या RL', mr: '1 L NS किंवा RL' },
                  body: { en: 'Only if SBP is below 90. Run 1 litre rapidly over 15 minutes. If SBP is normal, do NOT start fluids yet — wait and reassess.', hi: 'केवल अगर SBP 90 से कम है। 15 मिनट में 1 लीटर चलाएँ। SBP सामान्य है तो द्रव न दें।', mr: 'फक्त SBP 90 पेक्षा कमी असल्यास. 15 मिनिटांत 1 लिटर चालवा. SBP सामान्य असल्यास द्रव देऊ नका.' },
                },
                {
                  title: { en: 'REASSESS before more fluid', hi: 'और द्रव से पहले BP दोबारा जाँचें', mr: 'अधिक द्रवापूर्वी BP पुन्हा तपासा' },
                  body: { en: 'After the first 1 litre, STOP and check BP and pulse again. Only give another bolus if SBP is still below 90. Do not keep pouring fluid blindly.', hi: '1 लीटर के बाद रुकें। BP और नाड़ी दोबारा देखें। अगर SBP अब भी 90 से कम है तभी और द्रव दें।', mr: '1 लिटरनंतर थांबा. BP आणि नाडी पुन्हा पहा. SBP अजूनही 90 पेक्षा कमी असल्यासच अधिक द्रव द्या.' },
                },
                {
                  title: { en: 'STOP at 2 L total', hi: '2 L पर रुकें', mr: '2 L वर थांबा' },
                  body: { en: 'Never give more than 2 litres of crystalloid. More than this dilutes the clotting factors in blood — the patient bleeds MORE, not less. If still shocked after 2 L, the patient needs BLOOD at district hospital. Load and go.', hi: '2 लीटर से अधिक कभी न दें। अधिक देने से थक्का बनाने वाले तत्व पतले हो जाते हैं — खून और बढ़ता है। 2 L के बाद भी शॉक हो तो खून चाहिए — अस्पताल भेजें।', mr: '2 लिटरपेक्षा जास्त कधीही देऊ नका. जास्त दिल्यास गोठण घटक पातळ होतात — रक्तस्त्राव वाढतो. 2 L नंतरही शॉक असल्यास रक्त हवे — रुग्णालयात पाठवा.' },
                },
                {
                  title: { en: 'Insert Foley catheter', hi: 'फोले कैथेटर लगाएँ', mr: 'फोले कॅथेटर लावा' },
                  body: { en: 'Put in a urinary catheter. Measure how much urine comes out each hour. Less than 30 ml/hour = kidneys not getting enough blood = serious shock.', hi: 'फोले कैथेटर लगाएँ। हर घंटे मूत्र की मात्रा नापें। 30 ml/घंटे से कम = गंभीर शॉक।', mr: 'फोले कॅथेटर लावा. दर तासाला लघवीचे प्रमाण मोजा. 30 ml/तास पेक्षा कमी = गंभीर शॉक.' },
                },
              ].map((item, i) => (
                <NumberedStep key={i} n={i + 1} title={tr(item.title)} body={tr(item.body)}
                  checked={completedActions.has(`f-${i}`)}
                  onToggle={() => toggle(`f-${i}`)}
                  onSpeak={() => speak(`${tr(item.title)}. ${tr(item.body)}`)}
                />
              ))}

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div className="text-[12px] text-amber-100 leading-relaxed">
                  <span className="font-semibold">Fluid ceiling: 2 L.</span> Beyond this, crystalloid dilutes clotting factors. If SBP stays &lt;90 after 2 L — patient needs blood at district hospital. Load and go.
                </div>
              </div>
            </div>
          )}

          {/* CONTROL — branches on tone */}
          {currentStep.id === 'control' && (
            <div className="space-y-4">
              {!patient.uterineTone && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center">
                  <AlertCircle className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                  <div className="text-[13px] text-amber-100 font-semibold mb-2">Set uterine tone in Step 1</div>
                  <button onClick={() => setStepIndex(0)} className="px-4 py-2 rounded-lg bg-amber-500/20 text-[11px] font-semibold text-amber-100">
                    Back to Step 1
                  </button>
                </div>
              )}

              {atonic && (
                <>
                  <BranchBadge label="Atonic pathway · compression cascade" color="rose" />

                  <Card title="Manual compression — in order">
                    <div className="text-[11px] text-stone-400 mb-1">Do step 1 first. If bleeding continues, escalate to 2, then 3, then 4.</div>
                    {[
                      {
                        title: { en: 'Uterine massage', hi: 'गर्भाशय मालिश', mr: 'गर्भाशय मसाज' },
                        body: {
                          en: 'Place one hand on lower belly just above pubic bone to hold the uterus still. Use your other hand on top of the uterus (fundus) to massage in firm circular motion. Do NOT stop — keep massaging continuously until the uterus becomes hard like a ball.',
                          hi: 'एक हाथ पेट के निचले हिस्से पर प्यूबिक हड्डी के ऊपर रखें (गर्भाशय को स्थिर रखने के लिए)। दूसरे हाथ से गर्भाशय के ऊपर (fundus) गोल-गोल दबाव डालें। रुकें नहीं — गर्भाशय सख्त होने तक लगातार मालिश करें।',
                          mr: 'एक हात ओटीपोटावर पबिक हाडाच्या वर ठेवा (गर्भाशय स्थिर ठेवण्यासाठी). दुसऱ्या हाताने गर्भाशयाच्या वर (fundus) गोलाकार दाब द्या. थांबू नका — गर्भाशय कडक होईपर्यंत सतत मसाज करा.',
                        },
                      },
                      {
                        title: { en: 'External bimanual compression', hi: 'बाहरी द्विमैनुअल दबाव', mr: 'बाह्य द्विहस्त दाब' },
                        body: {
                          en: 'If massage alone is not enough: press one hand firmly on the lower belly pushing the uterus downward. At the same time, cup your other hand on the front of the belly. Squeeze both hands toward each other, compressing the uterus between them.',
                          hi: 'अगर मालिश काफी नहीं है: एक हाथ पेट के निचले हिस्से पर रखकर गर्भाशय को नीचे दबाएँ। साथ ही दूसरा हाथ पेट के सामने रखें। दोनों हाथों को आपस में दबाएँ — गर्भाशय बीच में दबेगा।',
                          mr: 'मसाज पुरेशी नसेल तर: एक हात ओटीपोटावर ठेवून गर्भाशय खाली दाबा. त्याच वेळी दुसरा हात पोटाच्या समोर ठेवा. दोन्ही हात एकमेकांकडे दाबा — गर्भाशय मध्ये दाबले जाईल.',
                        },
                      },
                      {
                        title: { en: 'Internal bimanual compression', hi: 'आंतरिक द्विमैनुअल दबाव', mr: 'आंतरिक द्विहस्त दाब' },
                        body: {
                          en: 'Wear sterile gloves. Make a fist with one hand. Insert the fist into the vagina and push upward into the anterior fornix (the pocket in front, behind the pubic bone). Place your other hand on the lower belly and press down onto the uterus. Squeeze the uterus between your two hands. Hold firmly until bleeding slows.',
                          hi: 'स्टेराइल दस्ताने पहनें। एक हाथ की मुट्ठी बनाएँ। मुट्ठी योनि में डालें और आगे वाले fornix तक ऊपर धकेलें (प्यूबिक हड्डी के पीछे की जेब)। दूसरा हाथ पेट पर रखें और गर्भाशय पर नीचे दबाएँ। गर्भाशय को दोनों हाथों के बीच दबाएँ। खून कम होने तक मजबूती से पकड़ें।',
                          mr: 'निर्जंतुक हातमोजे घाला. एका हाताची मूठ करा. मूठ योनीत घालून समोरच्या fornix मध्ये वर ढकला (पबिक हाडाच्या मागे). दुसरा हात ओटीपोटावर ठेवून गर्भाशयावर खाली दाब द्या. गर्भाशय दोन हातांमध्ये दाबा. रक्तस्त्राव कमी होईपर्यंत घट्ट धरा.',
                        },
                      },
                      {
                        title: { en: 'Aortic compression', hi: 'महाधमनी दबाव', mr: 'महाधमनी दाब' },
                        body: {
                          en: 'Emergency last resort while waiting for ambulance. Find the umbilicus (belly button). Make a firm fist. Press the fist hard into the belly just above the umbilicus, slightly to the LEFT of midline. You are compressing the aorta against the spine — this temporarily reduces blood flow to the uterus and slows bleeding until transfer.',
                          hi: 'आपातकालीन अंतिम उपाय, एम्बुलेंस की प्रतीक्षा के दौरान। नाभि ढूँढें। मजबूत मुट्ठी बनाएँ। मुट्ठी को नाभि के ठीक ऊपर, बीच से थोड़ा बाईं ओर, पेट में ज़ोर से दबाएँ। आप महाधमनी को रीढ़ के विरुद्ध दबा रहे हैं — इससे गर्भाशय में खून का बहाव कम होगा।',
                          mr: 'आणीबाणीचा शेवटचा उपाय, रुग्णवाहिकेची वाट पाहत असताना. नाभी शोधा. घट्ट मूठ करा. मूठ नाभीच्या अगदी वर, मध्यरेषेच्या थोडं डावीकडे, पोटात जोरात दाबा. तुम्ही महाधमनीला मणक्याच्या विरुद्ध दाबत आहात — यामुळे गर्भाशयात रक्तप्रवाह तात्पुरता कमी होतो.',
                        },
                      },
                    ].map((s, i) => (
                      <NumberedStep key={i} n={i + 1} title={tr(s.title)} body={tr(s.body)}
                        checked={completedActions.has(`mc-${i}`)}
                        onToggle={() => toggle(`mc-${i}`)}
                        onSpeak={() => speak(`${tr(s.title)}. ${tr(s.body)}`)}
                        onVideo={() => setVideoModal({ title: tr(s.title), duration: '15 sec' })}
                      />
                    ))}
                  </Card>

                  <Card title="Condom tamponade" badge="PHC-FEASIBLE" accent="sky">
                    <div className="text-[11px] text-stone-400 mb-1">If refractory after uterotonics + compression. This buys 2 hours for safe transfer.</div>
                    <div className="space-y-1.5">
                      {CONDOM_TAMPONADE.map((s) => {
                        const done = tamponadeSteps.has(s.n);
                        return (
                          <div key={s.n}
                            className={`rounded-lg border transition ${done ? 'bg-sky-500/10 border-sky-500/25' : 'bg-white/3 border-white/6'}`}>
                            <button
                              onClick={() => {
                                const ns = new Set(tamponadeSteps);
                                if (ns.has(s.n)) ns.delete(s.n); else ns.add(s.n);
                                setTamponadeSteps(ns);
                              }}
                              className="w-full text-left flex items-start gap-3 p-3">
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 font-mono text-[12px] font-bold ${
                                done ? 'bg-sky-500 text-stone-900' : 'bg-white/10 text-stone-400'
                              }`}>{s.n}</div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-[13px] font-semibold ${done ? 'text-stone-400' : 'text-stone-100'}`}>
                                  {tr(s.title)}
                                </div>
                                <div className={`text-[11px] leading-relaxed mt-1 ${done ? 'text-stone-500' : 'text-stone-300'}`}>
                                  {tr(s.body)}
                                </div>
                              </div>
                            </button>
                            <div className="flex gap-1.5 px-3 pb-2.5 pl-12">
                              <button onClick={(e) => { e.stopPropagation(); speak(`Step ${s.n}. ${tr(s.title)}. ${tr(s.body)}`); }}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-300 text-[10px] font-semibold">
                                <Volume2 className="w-3 h-3" /><span>Listen</span>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setVideoModal({ title: `Tamponade Step ${s.n}: ${tr(s.title)}`, duration: '20 sec' }); }}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-300 text-[10px] font-semibold">
                                <Film className="w-3 h-3" /><span>Watch demo</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </>
              )}

              {firm && (
                <>
                  <BranchBadge label="Trauma inspection · firm uterus, bleeding continues" color="amber" />

                  <Card title="Inspect systematically">
                    {[
                      { en: 'Perineum — perineal tears, episiotomy extension', hi: 'पेरिनियम', mr: 'पेरिनियम' },
                      { en: 'Vagina — lateral walls (often missed)', hi: 'योनि — पार्श्व दीवार', mr: 'योनी — बाजूची भिंत' },
                      { en: 'Cervix — under good light with Sims speculum', hi: 'गर्भाशय ग्रीवा', mr: 'गर्भाशय ग्रीवा' },
                      { en: 'Direct pressure with gauze · suture if trained', hi: 'सीधा दबाव', mr: 'थेट दाब' },
                      { en: 'If tear beyond skill — pack with gauze, refer now', hi: 'पैक करें, रेफर', mr: 'पॅक, रेफर' },
                    ].map((a, i) => (
                      <ChecklistItem key={i} label={tr(a)} checked={completedActions.has(`in-${i}`)} onToggle={() => toggle(`in-${i}`)} />
                    ))}
                  </Card>
                </>
              )}

              {retainedTissue && (
                <Card title="Retained placenta" badge="TISSUE" accent="rose">
                  {[
                    { en: 'Do NOT pull on cord — risk of uterine inversion', hi: 'कॉर्ड न खींचें', mr: 'कॉर्ड ओढू नका' },
                    { en: 'Oxytocin 10 IU IM to stimulate contraction', hi: 'ऑक्सीटोसिन 10 IU IM', mr: 'ऑक्सीटोसिन 10 IU IM' },
                    { en: 'Encourage breastfeeding / nipple stimulation', hi: 'स्तनपान उत्तेजना', mr: 'स्तनपान उत्तेजना' },
                    { en: 'Brandt-Andrews — controlled cord traction with counter-pressure', hi: 'ब्रांट-एंड्र्यूज़', mr: 'ब्रांट-अँड्र्यूज' },
                    { en: 'Empty bladder — full bladder prevents separation', hi: 'मूत्राशय खाली करें', mr: 'मूत्राशय रिकामे करा' },
                    { en: 'Not delivered at 30 min → refer for manual removal', hi: '30 मिनट → मैनुअल निकासी', mr: '30 मिनिट → हस्त काढणे' },
                  ].map((a, i) => (
                    <ChecklistItem key={i} label={tr(a)} checked={completedActions.has(`rp-${i}`)} onToggle={() => toggle(`rp-${i}`)} />
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* REFER */}
          {currentStep.id === 'refer' && (
            <div className="space-y-4">
              <Card title="Referral triggers · tap to mark, or auto-detected">
                <div className="text-[11px] text-stone-400 mb-2">Any one trigger means you must refer now. Red = detected from your data. Tap any other that applies.</div>
                <div className="space-y-1.5">
                  {REFERRAL_TRIGGERS.map((trig, i) => {
                    let autoFiring = false;
                    if (i === 0 && shockIndex && parseFloat(shockIndex) > 1.1) autoFiring = true;
                    if (i === 1 && sbpVal > 0 && sbpVal < 90) autoFiring = true;
                    if (i === 2 && patient.bloodLoss === 'severe') autoFiring = true;
                    if (i === 4 && patient.placentaStatus === 'undelivered') autoFiring = true;
                    const manualFiring = manualTriggers.has(i);
                    const firing = autoFiring || manualFiring;

                    return (
                      <button key={i}
                        onClick={() => {
                          const ns = new Set(manualTriggers);
                          if (ns.has(i)) ns.delete(i); else ns.add(i);
                          setManualTriggers(ns);
                        }}
                        className={`w-full text-left flex items-start gap-2.5 p-3 rounded-lg border transition active:scale-[0.99] ${
                          firing ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/2 border-white/6'
                        }`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          firing ? 'bg-rose-500 border-rose-500' : 'border-stone-600'
                        }`}>
                          {firing && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <div className={`flex-1 text-[12px] leading-relaxed ${firing ? 'text-rose-100 font-medium' : 'text-stone-400'}`}>
                          {tr(trig)}
                        </div>
                        {autoFiring && (
                          <span className="text-[9px] font-bold tracking-wider text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded">AUTO</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>

              <div className="p-5 rounded-2xl bg-linear-to-br from-rose-950/50 to-stone-950 border border-rose-500/30 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-rose-300" />
                </div>
                <div className="text-[22px] font-semibold text-stone-50 tracking-tight mb-1" style={{ fontFamily: 'var(--display)' }}>
                  All data captured
                </div>
                <p className="text-[12px] text-stone-400 leading-relaxed max-w-xs mx-auto">
                  {patient.drugsGiven.length} drugs · {completedActions.size} actions logged. Tap below to package into referral passport.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-stone-950 via-stone-950/95 to-transparent pt-6 pb-5 px-5 z-40">
          <div className="flex gap-2 max-w-5xl mx-auto">
            {stepIndex > 0 && (
              <button onClick={() => setStepIndex(stepIndex - 1)}
                className="px-4 py-3.5 rounded-2xl bg-white/6 text-stone-300 text-sm active:scale-95 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button onClick={nextStep}
              className={`flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2 ${
                stepIndex === PPH_STEPS.length - 1
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30'
                  : 'bg-stone-50 text-stone-900'
              }`}>
              {stepIndex === PPH_STEPS.length - 1 ? (
                <><FileText className="w-4 h-4" /><span>{t('triggerReferral')}</span></>
              ) : (
                <><span>{t('continue')}</span><ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────
  // NEONATAL FLOW
  // ──────────────────────────────────────────────────

  const NeonatalFlow = () => {
    const currentStep = NEONATAL_STEPS[stepIndex];
    const protocol = PROTOCOLS.neonatal;
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    const critical30 = elapsedSec >= 30 && elapsedSec < 60;
    const past60 = elapsedSec >= 60;
    const nextStep = () => stepIndex < NEONATAL_STEPS.length - 1 ? setStepIndex(stepIndex + 1) : setScreen('passport');

    const toggle = (key) => {
      const ns = new Set(completedActions);
      if (ns.has(key)) ns.delete(key); else ns.add(key);
      setCompletedActions(ns);
    };

    return (
      <div>
        <TopBar onClose={closeProtocol} title={tr(protocol.title)} />

        <div className={`sticky top-40 z-30 px-5 py-4 border-b ${
          past60 ? 'bg-rose-950/70 border-rose-500/30' :
          critical30 ? 'bg-amber-950/70 border-amber-500/30' :
          'bg-emerald-950/70 border-emerald-500/30'
        } backdrop-blur-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                past60 ? 'bg-rose-500/30' : critical30 ? 'bg-amber-500/30' : 'bg-emerald-500/30'
              }`}>
                <Timer className={`w-5 h-5 ${past60 ? 'text-rose-200' : critical30 ? 'text-amber-200' : 'text-emerald-200'} ${timerActive ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <div className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${
                  past60 ? 'text-rose-300' : critical30 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  {past60 ? 'BEYOND GOLDEN MINUTE' : critical30 ? 'HALFWAY — ACT NOW' : t('goldenMinute')}
                </div>
                <div className="text-[26px] font-semibold text-stone-50 leading-none tabular-nums mt-0.5 font-mono">
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setTimerActive(!timerActive)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                {timerActive ? <PauseCircle className="w-5 h-5 text-white" /> : <PlayCircle className="w-5 h-5 text-white" />}
              </button>
              <button onClick={() => { setElapsedSec(0); setTimerActive(false); }} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <div className="mt-3 h-1 rounded-full bg-black/30 overflow-hidden">
            <div className={`h-full transition-all ${past60 ? 'bg-rose-400' : critical30 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, (elapsedSec / 60) * 100)}%` }} />
          </div>
        </div>

        <div className="sticky top-67.5 z-20 bg-stone-950/90 backdrop-blur-xl border-b border-white/6 px-5 py-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {NEONATAL_STEPS.map((s, i) => (
              <button key={s.id} onClick={() => setStepIndex(i)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase transition ${
                  i === stepIndex ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/30'
                    : i < stepIndex ? 'text-emerald-400' : 'text-stone-500'
                }`}>
                <span className="font-mono mr-1 opacity-70">{s.time}</span>{tr(s.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pt-44 sm:pt-52 md:pt-60 pb-20">
          <div className="mb-5">
            <h2 className="text-[22px] font-semibold text-stone-50 leading-tight tracking-tight" style={{ fontFamily: 'var(--display)' }}>
              {tr(currentStep.title)}
            </h2>
            {currentStep.trigger && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-[12px] text-amber-100 leading-relaxed">
                    <span className="font-semibold">Trigger: </span>{tr(currentStep.trigger)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {currentStep.actions.map((a, i) => (
              <ChecklistItem key={i} label={tr(a)} checked={completedActions.has(`n-${stepIndex}-${i}`)} onToggle={() => toggle(`n-${stepIndex}-${i}`)} />
            ))}
          </div>

          {currentStep.mrSopa && (
            <div className="mt-4 p-4 rounded-2xl bg-linear-to-br from-sky-950/40 to-stone-950 border border-sky-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Wind className="w-3.5 h-3.5 text-sky-300" />
                <div className="text-[10px] uppercase tracking-wider text-sky-300 font-semibold">Ventilation troubleshooting — MR SOPA</div>
              </div>
              <div className="space-y-1.5">
                {MR_SOPA.map((item) => (
                  <div key={item.l} className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                    <div className="w-7 h-7 rounded-md bg-sky-500/15 flex items-center justify-center text-[13px] font-bold text-sky-300 font-mono">{item.l}</div>
                    <div className="text-[12px] text-stone-200">{tr(item.t)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stepIndex === 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-white/3 border border-white/6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">APGAR Score</div>
                  <div className="text-[10px] text-stone-500">At {apgarMinute} minute</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 5, 10].map((m) => (
                    <button key={m} onClick={() => setApgarMinute(m)}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition ${
                        apgarMinute === m ? 'bg-stone-50 text-stone-900' : 'bg-white/5 text-stone-400'
                      }`}>{m}'</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {[
                  { k: 'a', letter: 'A' }, { k: 'p', letter: 'P' }, { k: 'g', letter: 'G' },
                  { k: 'ac', letter: 'A' }, { k: 'r', letter: 'R' },
                ].map((cat) => (
                  <div key={cat.k} className="text-center">
                    <div className="text-[10px] font-bold text-stone-500 mb-1">{cat.letter}</div>
                    <div className="space-y-1">
                      {[0, 1, 2].map((score) => (
                        <button key={score} onClick={() => setApgarScores({ ...apgarScores, [cat.k]: score })}
                          className={`w-full py-1.5 rounded text-[11px] font-semibold transition ${
                            apgarScores[cat.k] === score
                              ? score === 0 ? 'bg-rose-500/20 text-rose-200'
                                : score === 1 ? 'bg-amber-500/20 text-amber-200'
                                : 'bg-emerald-500/20 text-emerald-200'
                              : 'bg-white/3 text-stone-500'
                          }`}>{score}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-3 rounded-xl text-center ${
                apgarTotal <= 3 ? 'bg-rose-500/10 border border-rose-500/20'
                  : apgarTotal <= 6 ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-emerald-500/10 border border-emerald-500/20'
              }`}>
                <div className="text-[10px] uppercase tracking-wider text-stone-400">Total</div>
                <div className="flex items-baseline justify-center gap-2 mt-0.5">
                  <span className="text-[28px] font-semibold tabular-nums" style={{ fontFamily: 'var(--display)' }}>{apgarTotal}</span>
                  <span className="text-[14px] text-stone-500">/ 10</span>
                </div>
                <div className={`text-[10px] font-semibold tracking-wider uppercase mt-1 ${
                  apgarTotal <= 3 ? 'text-rose-300' : apgarTotal <= 6 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  {apgarTotal <= 3 ? 'Severe depression' : apgarTotal <= 6 ? 'Moderate' : 'Reassuring'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-stone-950 via-stone-950/95 to-transparent pt-6 pb-5 px-5 z-40">
          <div className="flex gap-2 max-w-5xl mx-auto">
            {stepIndex > 0 && (
              <button onClick={() => setStepIndex(stepIndex - 1)}
                className="px-4 py-3.5 rounded-2xl bg-white/6 text-stone-300 text-sm active:scale-95 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button onClick={nextStep}
              className={`flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2 ${
                stepIndex === NEONATAL_STEPS.length - 1 ? 'bg-amber-500 text-stone-950 shadow-xl shadow-amber-500/30' : 'bg-stone-50 text-stone-900'
              }`}>
              {stepIndex === NEONATAL_STEPS.length - 1 ? (
                <><FileText className="w-4 h-4" /><span>{t('triggerReferral')}</span></>
              ) : (
                <><span>{t('continue')}</span><ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────
  // BRIEF PROTOCOL
  // ──────────────────────────────────────────────────

  const BriefProtocolFlow = ({ id }) => {
    const protocol = PROTOCOLS[id];
    const data = BRIEF_PROTOCOLS[id];
    const icons = { eclampsia: Brain, snakebite: Zap, stroke: Activity, trauma: Bone };
    const Icon = icons[id];

    return (
      <div>
        <TopBar onClose={closeProtocol} title={tr(protocol.title)} />
        <div className="px-5 pt-16 sm:pt-20 md:pt-24 pb-20">
          <div className="mb-5 p-5 rounded-2xl bg-linear-to-br from-sky-950/40 to-stone-950 border border-sky-500/20">
            <div className="w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-sky-300" strokeWidth={2} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-sky-300 font-semibold mb-1">{tr(protocol.category)}</div>
            <h2 className="text-[22px] font-semibold text-stone-50 tracking-tight leading-tight" style={{ fontFamily: 'var(--display)' }}>
              {tr(protocol.title)}
            </h2>
            <p className="text-sm text-stone-400 mt-2">{tr(protocol.subtitle)}</p>
          </div>

          <Card title="Primary drug / decision" accent="rose">
            <div className="text-[18px] font-semibold text-stone-50 mb-2" style={{ fontFamily: 'var(--display)' }}>{data.key}</div>
            <InfoRow label="Loading" value={data.loading} />
            <InfoRow label="Maintenance" value={data.maintenance} />
            {data.antidote !== '—' && <InfoRow label="Rescue" value={data.antidote} />}
            <InfoRow label="Adjunct" value={data.bp} />
          </Card>

          <Card title="Monitor">
            <ul className="space-y-1.5">
              {data.monitor.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-stone-300">
                  <Circle className="w-2 h-2 fill-stone-500 text-stone-500 shrink-0 mt-1.5" /><span>{m}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Referral trigger" accent="rose">
            <div className="flex items-start gap-2.5">
              <Ambulance className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <div className="text-[12px] text-stone-200 leading-relaxed">{data.refer}</div>
            </div>
          </Card>

          <button onClick={() => setScreen('passport')}
            className="mt-4 w-full py-3.5 rounded-2xl bg-stone-50 text-stone-900 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition">
            <FileText className="w-4 h-4" /><span>{t('triggerReferral')}</span>
          </button>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────
  // PASSPORT
  // ──────────────────────────────────────────────────

  const PassportScreen = () => {
    const passportId = `SAHAI-${Date.now().toString().slice(-8)}`;
    const protocol = PROTOCOLS[activeProtocol];

    return (
      <div>
        <TopBar onClose={() => setScreen('protocol')} title={t('referralPassport')} />
        <div className="px-5 pt-16 sm:pt-20 md:pt-24 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-stone-900 to-stone-950 border border-white/10 shadow-2xl">
            <div className="absolute -top-8 -right-8 opacity-[0.04]">
              <Stethoscope className="w-40 h-40 text-white" />
            </div>
            <div className="relative p-5">
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-semibold mb-1">
                    Sahayak AI · Referral Passport
                  </div>
                  <h2 className="text-[18px] font-semibold text-stone-50 tracking-tight" style={{ fontFamily: 'var(--display)' }}>
                    {tr(protocol.title)}
                  </h2>
                  <div className="text-[10px] font-mono text-stone-500 mt-1">{passportId}</div>
                </div>
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 shrink-0">
                  <QRCodePattern seed={passportId} />
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Patient</div>
                <div className="grid grid-cols-3 gap-3">
                  <div><div className="text-[9px] text-stone-500">Age</div><div className="text-[14px] font-semibold text-stone-100">{patient.age} y</div></div>
                  <div><div className="text-[9px] text-stone-500">Weight</div><div className="text-[14px] font-semibold text-stone-100">{patient.weight} kg</div></div>
                  <div><div className="text-[9px] text-stone-500">Gravida</div><div className="text-[14px] font-semibold text-stone-100">{patient.gravida}</div></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Vitals</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { l: 'SBP', v: patient.vitals.sbp || '—', u: 'mmHg' },
                    { l: 'HR', v: patient.vitals.hr || '—', u: 'bpm' },
                    { l: 'SpO₂', v: patient.vitals.spo2 || '—', u: '%' },
                    { l: 'SI', v: shockIndex || '—', u: '' },
                  ].map((v) => (
                    <div key={v.l} className="p-2 rounded-lg bg-white/3 text-center">
                      <div className="text-[8px] text-stone-500 uppercase tracking-wider font-semibold">{v.l}</div>
                      <div className="text-[13px] font-semibold text-stone-100 mt-0.5 font-mono tabular-nums">{v.v}</div>
                      {v.u && <div className="text-[7px] text-stone-600 uppercase">{v.u}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {activeProtocol === 'pph' && (patient.uterineTone || patient.placentaStatus || patient.bloodLoss) && (
                <div className="mb-4">
                  <div className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Findings</div>
                  <div className="space-y-1">
                    {patient.uterineTone && <KV label="Uterine tone" value={patient.uterineTone} />}
                    {patient.placentaStatus && <KV label="Placenta" value={patient.placentaStatus} />}
                    {patient.bloodLoss && <KV label="Blood loss" value={patient.bloodLoss} />}
                    {patient.staffCount && <KV label="Staff present" value={patient.staffCount} />}
                  </div>
                </div>
              )}

              {patient.drugsGiven.length > 0 && (
                <div className="mb-2">
                  <div className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Interventions given</div>
                  <div className="space-y-1">
                    {patient.drugsGiven.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <div className="text-[11px] text-stone-200">
                          <span className="font-semibold">{d.name}</span>
                          <span className="text-stone-500 ml-1.5">{d.dose} {d.route}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-300">{d.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-3">{t('sendVia')}</div>
            <div className="grid grid-cols-2 gap-3">
              <TransferMethod icon={MessageSquare} name={t('whatsapp')} desc="Structured note + GPS" color="emerald" onClick={() => setScreen('success')} />
              <TransferMethod icon={Radio} name={t('nfcTap')} desc="Tap patient wristband" color="sky" onClick={() => setScreen('success')} />
              <TransferMethod icon={Phone} name={t('sms')} desc="Works on 2G networks" color="amber" onClick={() => setScreen('success')} />
              <TransferMethod icon={Hash} name={t('qrPrint')} desc="Sticker for paper" color="rose" onClick={() => setScreen('success')} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────
  // SUCCESS
  // ──────────────────────────────────────────────────

  const SuccessScreen = () => (
    <div>
      <TopBar />
      <div className="px-5 pt-16 sm:pt-20 md:pt-24 pb-20 text-center">
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="relative w-20 h-20 mx-auto rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Check className="w-9 h-9 text-white" strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-[26px] font-semibold text-stone-50 tracking-tight leading-tight" style={{ fontFamily: 'var(--display)' }}>
          {t('referralSent')}
        </h1>
        <p className="text-sm text-stone-400 mt-2 max-w-xs mx-auto leading-relaxed">
          Passport transmitted. Ambulance on the way. Stay with the patient — open the monitor to keep BP checks on schedule.
        </p>

        <div className="mt-8 space-y-2">
          <button onClick={() => setScreen('monitor')}
            className="w-full py-3.5 rounded-2xl bg-amber-500 text-stone-950 font-semibold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20">
            <Clock className="w-4 h-4" /><span>{t('openMonitor')}</span>
          </button>
          <button onClick={closeProtocol}
            className="w-full py-3.5 rounded-2xl bg-white/6 text-stone-200 font-semibold text-sm active:scale-[0.98] transition">
            {t('backHome')}
          </button>
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────
  // MONITOR
  // ──────────────────────────────────────────────────

  const MonitorScreen = () => {
    const mins = Math.floor(monitorElapsed / 60);
    const secs = monitorElapsed % 60;

    return (
      <div>
        <TopBar onClose={closeProtocol} title={t('monitor')} />

        <div className="px-5 pt-16 sm:pt-20 md:pt-24 pb-20">
          <div className="p-5 rounded-3xl bg-linear-to-br from-emerald-950/40 to-stone-950 border border-emerald-500/25 mb-5 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.08]"><Ambulance className="w-32 h-32" /></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-300" />
                <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 font-semibold">
                  {t('referralSent')}
                </div>
              </div>
              <div className="text-[11px] text-stone-400 mt-2">{t('sinceReferral')}</div>
              <div className="text-[48px] font-semibold text-stone-50 tabular-nums leading-none font-mono mt-1" style={{ fontFamily: 'var(--display)' }}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[11px] uppercase tracking-[0.15em] text-stone-500 font-semibold mb-3">
              Active monitoring
            </div>
            <div className="space-y-2">
              {MONITOR_TASKS.map((task) => {
                const last = monitorTicks[task.id] || 0;
                const sinceLast = monitorElapsed - last;
                const overdue = sinceLast >= task.intervalSec;
                const soon = sinceLast >= task.intervalSec - 30 && !overdue;
                const remaining = Math.max(0, task.intervalSec - sinceLast);
                const taskIcons = { bp: Activity, conscious: Eye, massage: HandMetal };
                const Icon = taskIcons[task.id];

                return (
                  <div key={task.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      overdue ? 'bg-rose-950/40 border-rose-500/40 animate-pulse' :
                      soon ? 'bg-amber-950/30 border-amber-500/30' :
                      'bg-white/3 border-white/6'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        overdue ? 'bg-rose-500/25 text-rose-300' :
                        soon ? 'bg-amber-500/25 text-amber-300' :
                        'bg-white/6 text-stone-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-[13px] font-semibold text-stone-100">{tr(task.label)}</div>
                          <div className="text-[9px] font-mono text-stone-500">
                            every {Math.floor(task.intervalSec / 60)} min
                          </div>
                        </div>
                        <div className={`text-[11px] font-mono mt-0.5 tabular-nums ${
                          overdue ? 'text-rose-300' : soon ? 'text-amber-300' : 'text-stone-400'
                        }`}>
                          {overdue
                            ? `Overdue ${Math.floor((sinceLast - task.intervalSec) / 60)}m ${(sinceLast - task.intervalSec) % 60}s`
                            : `Next in ${Math.floor(remaining / 60)}m ${remaining % 60}s`}
                        </div>
                      </div>
                      <button onClick={() => setMonitorTicks({ ...monitorTicks, [task.id]: monitorElapsed })}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition ${
                          overdue ? 'bg-rose-500 text-white' :
                          soon ? 'bg-amber-500 text-stone-950' :
                          'bg-white/10 text-stone-300'
                        }`}>
                        {overdue ? t('takeNow') : t('logged')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/3 border border-white/6">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Keep doing</div>
            <ul className="space-y-1.5">
              {[
                'Stay at bedside — do not leave patient alone',
                'Keep patient warm · oxygen running',
                'Brief family · arrange attendant to accompany',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-stone-300 leading-relaxed">
                  <div className="w-1 h-1 rounded-full bg-stone-500 shrink-0 mt-1.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-dark via-dark/95 to-transparent pt-6 pb-5 px-3 sm:px-5 z-40">
          <div className="w-full">
            <button onClick={closeProtocol}
              className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-cream text-dark font-semibold text-sm sm:text-base active:scale-[0.98] transition cursor-pointer hover:bg-cream-dark">
              {t('endMonitoring')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────────────
  // ROUTER
  // ──────────────────────────────────────────────────

  const ProtocolScreen = () => {
    if (activeProtocol === 'pph') return PPHFlow();
    if (activeProtocol === 'neonatal') return NeonatalFlow();
    return BriefProtocolFlow({ id: activeProtocol });
  };

  return (
    <div className="min-h-screen w-full bg-dark text-cream antialiased" style={{ fontFamily: 'var(--font-family-primary)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        body, html { background: #0c0a09; }
        :root {
          --display: "Fraunces", Georgia, serif;
          --sans: "Inter", "Noto Sans Devanagari", system-ui, sans-serif;
          --mono: "JetBrains Mono", monospace;
        }
        .font-mono { font-family: var(--mono); font-feature-settings: "cv11", "ss01"; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="w-full min-h-screen pt-0">
        {screen === 'home' && HomeScreen()}
        {screen === 'protocol' && ProtocolScreen()}
        {screen === 'passport' && PassportScreen()}
        {screen === 'success' && SuccessScreen()}
        {screen === 'monitor' && MonitorScreen()}
      </div>

      {/* Video demo modal */}
      {videoModal && (
        <div onClick={() => setVideoModal(null)}
          className="fixed inset-0 bg-dark/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
          <div onClick={(e) => e.stopPropagation()}
            className="bg-dark-card rounded-2xl p-4 sm:p-5 w-full max-w-sm border border-teal/20 shadow-2xl">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-[0.15em] text-sky font-bold">Procedure demo</div>
                <div className="text-sm sm:text-base font-semibold text-cream mt-0.5">{videoModal.title}</div>
              </div>
              <button onClick={() => setVideoModal(null)}
                className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center shrink-0 cursor-pointer hover:bg-teal/20 transition">
                <X className="w-4 h-4 text-cream" />
              </button>
            </div>
            <div className="aspect-video bg-linear-to-br from-dark-surface to-dark-card rounded-xl relative overflow-hidden mb-3">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-teal/15 backdrop-blur-sm flex items-center justify-center active:scale-95 transition cursor-pointer hover:bg-teal/25">
                  <Play className="w-7 h-7 text-cream ml-1" fill="currentColor" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-teal/20 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-terracotta rounded-full" />
                </div>
                <span className="text-cream text-xs font-mono">0:00 / {videoModal.duration || '0:15'}</span>
              </div>
            </div>
            <div className="text-[11px] text-stone-500 leading-relaxed">
              Short clinical demonstration of the technique. Tap play to view.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════

function Card({ title, children, badge, accent = 'stone' }) {
  const accentMap = {
    stone: 'bg-white/3 border-white/6',
    rose: 'bg-linear-to-br from-rose-950/20 to-stone-950 border-rose-500/20',
    sky: 'bg-linear-to-br from-sky-950/30 to-stone-950 border-sky-500/20',
  };
  return (
    <div className={`p-4 rounded-2xl border ${accentMap[accent] || accentMap.stone}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">{title}</div>
        {badge && (
          <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded ${
            accent === 'sky' ? 'bg-sky-500/20 text-sky-200'
              : accent === 'rose' ? 'bg-rose-500/20 text-rose-200'
              : 'bg-rose-500/15 text-rose-300'
          }`}>{badge}</span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const VitalInput = React.memo(function VitalInput({ label, unit, value, onChange, placeholder }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+(\.\d*)?$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm uppercase tracking-wider text-sky font-semibold mb-1.5 sm:mb-2">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={label}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-teal/10 border-2 border-teal/30 text-base sm:text-lg font-semibold text-cream tabular-nums placeholder:text-sky/50 focus:outline-none focus:border-teal focus:bg-teal/15 focus:ring-2 focus:ring-teal/30 transition"
        />
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-sky font-mono uppercase tracking-wider pointer-events-none">{unit}</div>
      </div>
    </div>
  );
});

function ShockCard({ si, level, t }) {
  const cfg = {
    critical: { bg: 'from-terracotta/30 to-dark border-terracotta/40', bar: 'bg-terracotta', pill: 'bg-terracotta/20 text-terracotta' },
    high: { bg: 'from-gold/25 to-dark border-gold/30', bar: 'bg-gold', pill: 'bg-gold/20 text-gold' },
    moderate: { bg: 'from-gold/15 to-dark border-gold/20', bar: 'bg-gold-light', pill: 'bg-gold/15 text-gold-light' },
    stable: { bg: 'from-emerald-400/20 to-dark border-emerald-500/20', bar: 'bg-emerald-400', pill: 'bg-emerald-400/20 text-emerald-300' },
  }[level];
  const labelMap = {
    critical: 'CRITICAL >1.7',
    high: 'HIGH · REFER NOW',
    moderate: 'MODERATE · PREPARE',
    stable: 'STABLE · MONITOR'
  };
  return (
    <div className={`p-4 sm:p-5 rounded-2xl border bg-linear-to-br ${cfg.bg}`}>
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <div>
          <div className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-sky font-semibold">{t('shockIndex')}</div>
          <div className="text-3xl sm:text-4xl leading-none font-semibold text-cream mt-1 sm:mt-2 tabular-nums">{si}</div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap ${cfg.pill}`}>{labelMap[level]}</div>
      </div>
      <div className="mt-4">
        <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-400 via-orange-400 to-rose-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, (parseFloat(si) / 1.8) * 100)}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-[9px] text-stone-500 font-mono">
          <span>0.5</span><span>0.9 ⚠</span><span>1.1 🚨</span><span>1.7</span>
        </div>
      </div>
    </div>
  );
}

function SelectButton({ active, onClick, title, hint, color }) {
  const colorMap = {
    rose: active ? 'bg-rose-500/15 border-rose-500/40 text-rose-200' : 'bg-white/2 border-white/6 text-stone-200',
    amber: active ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-white/2 border-white/6 text-stone-200',
    emerald: active ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200' : 'bg-white/2 border-white/6 text-stone-200',
  };
  return (
    <button onClick={onClick} className={`p-3.5 rounded-xl text-left border transition ${colorMap[color]}`}>
      <div className="text-[13px] font-semibold mb-0.5">{title}</div>
      <div className="text-[10px] text-stone-500">{hint}</div>
    </button>
  );
}

function RadioRow({ active, onClick, label, color }) {
  const bg = active
    ? color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30'
    : color === 'amber' ? 'bg-amber-500/10 border-amber-500/30'
    : 'bg-rose-500/10 border-rose-500/30'
    : 'bg-white/2 border-white/6';
  const dot = active
    ? color === 'emerald' ? 'bg-emerald-500 border-emerald-500'
    : color === 'amber' ? 'bg-amber-500 border-amber-500'
    : 'bg-rose-500 border-rose-500'
    : 'border-stone-600';
  return (
    <button onClick={onClick} className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 border transition ${bg}`}>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dot}`}>
        {active && <Check className="w-2.5 h-2.5 text-stone-900" strokeWidth={3} />}
      </div>
      <span className="text-[13px] text-stone-200">{label}</span>
    </button>
  );
}

function ChecklistItem({ label, checked, onToggle, onSpeak }) {
  return (
    <div className={`rounded-xl border transition ${
      checked ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-white/3 border-white/6'
    }`}>
      <button onClick={onToggle}
        className="w-full text-left flex items-start gap-3 p-3.5 active:scale-[0.99] transition">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
          checked ? 'bg-emerald-500 border-emerald-500' : 'border-stone-600'
        }`}>
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
        <div className={`flex-1 text-[13px] leading-relaxed ${checked ? 'text-stone-400 line-through' : 'text-stone-200'}`}>
          {label}
        </div>
      </button>
      {onSpeak && (
        <div className="px-3 pb-2.5 pl-11">
          <button onClick={(e) => { e.stopPropagation(); onSpeak(); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-300 text-[10px] font-semibold">
            <Volume2 className="w-3 h-3" /><span>Listen</span>
          </button>
        </div>
      )}
    </div>
  );
}

function NumberedStep({ n, title, body, checked, onToggle, onSpeak, onVideo }) {
  return (
    <div className={`rounded-xl border transition ${
      checked ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-white/3 border-white/6'
    }`}>
      <button onClick={onToggle}
        className="w-full text-left flex items-start gap-2.5 p-3 active:scale-[0.99] transition">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          checked ? 'bg-emerald-500 border-emerald-500' : 'border-stone-600'
        }`}>
          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </div>
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 font-mono text-[11px] font-bold ${
          checked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-stone-400'
        }`}>
          {n}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[13px] font-semibold ${checked ? 'text-stone-400' : 'text-stone-100'}`}>
            {title}
          </div>
          <div className={`text-[11px] leading-relaxed mt-1 ${checked ? 'text-stone-500' : 'text-stone-300'}`}>
            {body}
          </div>
        </div>
      </button>
      {(onSpeak || onVideo) && (
        <div className="flex gap-1.5 px-3 pb-2.5 pl-14">
          {onSpeak && (
            <button onClick={(e) => { e.stopPropagation(); onSpeak(); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/15 text-sky-300 text-[10px] font-semibold">
              <Volume2 className="w-3 h-3" /><span>Listen</span>
            </button>
          )}
          {onVideo && (
            <button onClick={(e) => { e.stopPropagation(); onVideo(); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-300 text-[10px] font-semibold">
              <Film className="w-3 h-3" /><span>Watch demo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PhoneButton({ icon: Icon, label, sub, color }) {
  const cls = {
    emerald: 'bg-emerald-500/15 border-emerald-500/30',
    rose: 'bg-rose-500/15 border-rose-500/30',
  }[color];
  const txt = {
    emerald: 'text-emerald-300',
    rose: 'text-rose-300',
  }[color];
  const txtSub = {
    emerald: 'text-emerald-200/70',
    rose: 'text-rose-200/70',
  }[color];
  return (
    <button className={`p-3.5 rounded-xl border text-left active:scale-95 transition ${cls}`}>
      <Icon className={`w-4 h-4 mb-1.5 ${txt}`} />
      <div className={`text-[12px] font-semibold ${txt.replace('300', '100')}`}>{label}</div>
      <div className={`text-[10px] font-mono ${txtSub}`}>{sub}</div>
    </button>
  );
}

function DrugCard({ drug, given, locked, sbpVal, onConfirmBP, onGive, onSpeak, tr }) {
  const whenMap = {
    0: 'bg-sky-500/15 border-sky-500/30 text-sky-100',
    1: 'bg-rose-500/15 border-rose-500/30 text-rose-100',
    2: 'bg-amber-500/15 border-amber-500/30 text-amber-100',
    3: 'bg-violet-500/15 border-violet-500/30 text-violet-100',
  };

  return (
    <div className={`p-4 rounded-2xl border transition ${
      given ? 'bg-emerald-950/40 border-emerald-500/30'
        : drug.critical ? 'bg-linear-to-br from-sky-950/40 to-stone-950 border-sky-500/30'
        : locked ? 'bg-white/2 border-amber-500/20 opacity-85'
        : 'bg-white/3 border-white/6'
    }`}>
      {/* WHEN TO GIVE — condition highlighted FIRST */}
      <div className={`mb-3 p-2.5 rounded-lg border ${whenMap[drug.tier] || whenMap[3]}`}>
        <div className="text-[9px] uppercase tracking-[0.15em] font-bold mb-1 opacity-80">
          When to give
        </div>
        <div className="text-[12px] font-semibold leading-relaxed">
          {tr(drug.when)}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          given ? 'bg-emerald-500/20 text-emerald-300'
            : drug.critical ? 'bg-sky-500/20 text-sky-300'
            : locked ? 'bg-amber-500/15 text-amber-300'
            : 'bg-white/5 text-stone-400'
        }`}>
          {given ? <Check className="w-4 h-4" /> : locked ? <Lock className="w-4 h-4" /> : <Syringe className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="text-[15px] font-semibold text-stone-50">{drug.name}</h3>
            {drug.critical && <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded bg-sky-500/20 text-sky-200">GIVE TO ALL</span>}
            <span className="text-[9px] font-mono text-stone-500">Tier {drug.tier}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[22px] font-semibold text-stone-50 tabular-nums" style={{ fontFamily: 'var(--display)' }}>{drug.dose}</span>
            <span className="text-[11px] text-stone-400 font-mono">{drug.route}</span>
          </div>

          {drug.dilution && (
            <div className="mb-2 p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
              <div className="text-[9px] uppercase tracking-[0.15em] text-sky-300 font-bold mb-1">
                How to give · dilution
              </div>
              <div className="text-[11px] text-stone-200 leading-relaxed whitespace-pre-line">
                {tr(drug.dilution)}
              </div>
            </div>
          )}

          <p className="text-[11px] text-stone-300 leading-relaxed mb-2">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[9px] mr-1.5">Why</span>
            {tr(drug.why)}
          </p>

          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-2">
            <p className="text-[11px] text-amber-200 leading-relaxed">
              ⚠ {tr(drug.warning)}
            </p>
          </div>

          {drug.maintenance && (
            <p className="text-[10px] text-stone-500 font-mono leading-relaxed mb-2">{drug.maintenance}</p>
          )}

          {locked && drug.requiresBPCheck && (
            <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-amber-200 uppercase tracking-wider mb-1">BP check required</div>
                  {sbpVal > 0 && sbpVal >= 140 ? (
                    <div className="text-[11px] text-rose-200 leading-relaxed">
                      SBP <span className="font-mono font-bold">{sbpVal}</span> — CONTRAINDICATED. Skip this drug. Use Misoprostol 800 mcg SL instead.
                    </div>
                  ) : (
                    <>
                      <div className="text-[11px] text-stone-300 leading-relaxed mb-2">
                        Confirm SBP &lt;140, no pre-eclampsia, no cardiac disease.
                      </div>
                      <button onClick={onConfirmBP}
                        className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 text-[10px] font-bold tracking-wider uppercase">
                        Confirm BP safe
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {!given && !locked && (
              <button onClick={onGive}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                  drug.critical ? 'bg-sky-500 text-stone-950' : 'bg-white/10 text-stone-200'
                }`}>
                Log administration
              </button>
            )}
            {given && <div className="text-[11px] text-emerald-300 font-mono">✓ Given at {given.timestamp}</div>}
            {onSpeak && (
              <button onClick={onSpeak}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/15 text-sky-300 text-[10px] font-semibold ml-auto">
                <Volume2 className="w-3 h-3" /><span>Listen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OR logic — If not enough */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-start gap-2">
        <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-[9px] uppercase tracking-[0.15em] text-stone-500 font-bold mb-0.5">
            If not enough
          </div>
          <div className="text-[11px] text-stone-300 leading-relaxed">
            {tr(drug.nextIf)}
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchBadge({ label, color }) {
  const cfg = {
    rose: 'bg-terracotta/15 border-terracotta/30 text-terracotta',
    amber: 'bg-gold/15 border-gold/30 text-gold',
  }[color];
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold tracking-[0.15em] uppercase w-fit ${cfg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${color === 'rose' ? 'bg-terracotta' : 'bg-gold'} animate-pulse`} />
      <span>{label}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs sm:text-sm uppercase tracking-wider text-sky font-semibold">{label}</div>
      <div className="text-sm sm:text-base text-cream font-mono mt-0.5 sm:mt-1">{value}</div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-teal/5 border border-teal/20">
      <span className="text-xs sm:text-sm text-sky uppercase tracking-wider font-semibold">{label}</span>
      <span className="text-xs sm:text-sm text-cream font-semibold capitalize">{value}</span>
    </div>
  );
}

function TransferMethod({ icon: Icon, name, desc, color, onClick }) {
  const colorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/15',
    sky: 'bg-sky/15 border-sky/30 text-sky hover:bg-sky/20',
    gold: 'bg-gold/15 border-gold/30 text-gold hover:bg-gold/20',
    terracotta: 'bg-terracotta/15 border-terracotta/30 text-terracotta hover:bg-terracotta/20',
  };
  return (
    <button onClick={onClick}
      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-teal/50 ${colorMap[color] || colorMap.sky}`}
      aria-label={`${name}: ${desc}`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-2 sm:mb-3" />
      <div className="text-sm sm:text-base font-semibold text-cream">{name}</div>
      <div className="text-xs sm:text-sm text-sky/70 mt-0.5 sm:mt-1">{desc}</div>
    </button>
  );
}

function QRCodePattern({ seed }) {
  const cells = 21;
  const pattern = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = ((h << 5) - h) + seed.charCodeAt(i);
      h |= 0;
    }
    const rnd = () => { h = (h * 9301 + 49297) % 233280; return h / 233280; };
    const grid = [];
    for (let r = 0; r < cells; r++) {
      const row = [];
      for (let c = 0; c < cells; c++) {
        const inFinder = ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7));
        if (inFinder) {
          const lr = r < 7 ? r : r - (cells - 7);
          const lc = c < 7 ? c : c >= cells - 7 ? c - (cells - 7) : c;
          const isBorder = lr === 0 || lr === 6 || lc === 0 || lc === 6;
          const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
          row.push(isBorder || isInner ? 1 : 0);
        } else {
          row.push(rnd() > 0.5 ? 1 : 0);
        }
      }
      grid.push(row);
    }
    return grid;
  }, [seed]);

  return (
    <svg viewBox={`0 0 ${cells} ${cells}`} className="w-full h-full">
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0c0a09" /> : null
        )
      )}
    </svg>
  );
}

