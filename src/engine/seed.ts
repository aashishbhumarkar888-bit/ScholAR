import { ApplicationRecord, ApplicantCategory } from '../types';

// Deterministic Pseudo-Random Number Generator (Mulberry32)
export function createPRNG(seed: number = 20260401) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DISTRICTS = [
  'Raipur',
  'Bilaspur',
  'Bastar',
  'Surguja',
  'Durg',
  'Rajnandgaon',
  'Korba',
  'Raigarh',
  'Dhamtari',
  'Kanker',
];

const SCHEMES = [
  'Post-Matric ST Scholarship',
  'Post-Matric SC Scholarship',
  'Post-Matric OBC Scholarship',
  'Central Sector Scheme for College and University Students',
  'Mukhyamantri Gyanprotsahan Yojana',
];

const COLLEGES = [
  { id: 'COL-GEC-RAI', name: 'Government Engineering College Raipur', district: 'Raipur' },
  { id: 'COL-BIT-BIL', name: 'Bilaspur Institute of Technology', district: 'Bilaspur' },
  { id: 'COL-BTD-BAS', name: 'Bastar Tribal Degree College Jagdalpur', district: 'Bastar' },
  { id: 'COL-GDC-SUR', name: 'Government Degree College Ambikapur', district: 'Surguja' },
  { id: 'COL-CSV-DUR', name: 'CSVTU Bhilai University Campus', district: 'Durg' },
  { id: 'COL-GMC-KOR', name: 'Government Polytechnic Korba', district: 'Korba' },
  { id: 'COL-KGC-RAI', name: 'Kirodimal Government Arts & Science Raigarh', district: 'Raigarh' },
  { id: 'COL-PGD-DHM', name: 'Babu Chhotelal Shrivastava PG College Dhamtari', district: 'Dhamtari' },
];

const FIRST_NAMES = [
  'Aashish', 'Ashish', 'Amit', 'Anjali', 'Arun', 'Bhumika', 'Chetan', 'Deepak', 'Devendra',
  'Dinesh', 'Divya', 'Gajendra', 'Gita', 'Harish', 'Hemant', 'Indira', 'Jagdish', 'Jitendra',
  'Jyoti', 'Kamlesh', 'Kavita', 'Kiran', 'Komal', 'Kumari', 'Lalita', 'Laxman', 'Madhu',
  'Mahesh', 'Manisha', 'Mohan', 'Mukesh', 'Narendra', 'Neelam', 'Nirmala', 'Omkar', 'Pooja',
  'Prakash', 'Prashant', 'Priya', 'Priyanka', 'Rahul', 'Rajesh', 'Rakesh', 'Ramesh', 'Rashmi',
  'Rekha', 'Rupesh', 'Sachin', 'Sandhya', 'Sangeeta', 'Santosh', 'Sarita', 'Satish', 'Seema',
  'Shailendra', 'Shashi', 'Sheetal', 'Shubham', 'Sunil', 'Sunita', 'Suresh', 'Sushila', 'Tarun',
  'Umesh', 'Vandana', 'Vijay', 'Vikas', 'Vinod', 'Yogesh',
];

const SURNAMES = [
  'Sahu', 'Netam', 'Markam', 'Mandavi', 'Tiwari', 'Verma', 'Kashyap', 'Baghel', 'Dewangan',
  'Yadav', 'Sidar', 'Banjare', 'Kanwar', 'Patel', 'Chouhan', 'Thakur', 'Gond', 'Korram',
  'Ekka', 'Kujur', 'Toppo', 'Ogre', 'Kurrey', 'Jangde', 'Bhagat', 'Minj', 'Dhurve', 'Poyam',
];

// Helper to format simulated bank token
function makeBankToken(raw: string, last4: string = '8821'): string {
  const hashPart = raw.slice(0, 4) + '…' + raw.slice(-3);
  return `FD-${hashPart}`;
}

export function generateSyntheticDataset(): ApplicationRecord[] {
  const rng = createPRNG(20260401);
  const records: ApplicationRecord[] = [];

  // Helper for random selection
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const randomHex = (len: number): string => {
    let out = '';
    const hex = '0123456789abcdef';
    for (let i = 0; i < len; i++) out += hex[Math.floor(rng() * 16)];
    return out;
  };

  let appSeq = 1;

  // 1. GENERATE 895 CLEAN NORMAL APPLICATIONS
  for (let i = 0; i < 895; i++) {
    const col = pick(COLLEGES);
    const cat: ApplicantCategory = pick(['SC', 'ST', 'OBC', 'GEN']);
    const firstName = pick(FIRST_NAMES);
    const surname = pick(SURNAMES);
    const id = `CG-SCH-2026-${String(appSeq++).padStart(5, '0')}`;
    const tokenHex = randomHex(8);

    records.push({
      id,
      studentName: `${firstName} ${surname}`,
      aadhaarHash: `UID-${randomHex(4)}…${randomHex(3)}`,
      householdId: `HH-CG-${col.district.slice(0, 3).toUpperCase()}-${String(1000 + i).padStart(5, '0')}`,
      collegeId: col.id,
      collegeName: col.name,
      district: col.district,
      scheme: pick(SCHEMES),
      bankToken: `FD-${tokenHex.slice(0, 4)}…${tokenHex.slice(-3)}`,
      ifscPrefix: pick(['SBIN000', 'PUNB012', 'UBIN054', 'BKID000']),
      docHash: `DOC-${randomHex(6)}`,
      amount: pick([24000, 36000, 42000, 48000, 54000]),
      category: cat,
      recordType: 'normal',
      submittedAt: `2026-03-${String(Math.floor(rng() * 20) + 1).padStart(2, '0')}`,
    });
  }

  // 2. GENERATE 50 BENIGN TYPO / TRANSLITERATION VARIANTS
  const TYPO_PATTERNS = [
    { canonical: 'Ashish Kumar Sahu', typo: 'Aashish Kumar Sahu', reason: 'Common tribal vowel transliteration (A -> Aa)' },
    { canonical: 'Mohammad Tariq', typo: 'Mohd Tariq', reason: 'Honorific abbreviation variation (Mohd -> Mohammad)' },
    { canonical: 'Kumari Sunita Netam', typo: 'Kumarii Sunita Netam', reason: 'Trailing vowel elongation in local dialect portal entry' },
    { canonical: 'Laxmi Mandavi', typo: 'Lakshmi Mandavi', reason: 'Phonetic script transliteration difference (x -> ksh)' },
    { canonical: 'Sunil Kumar Markam', typo: 'Suneel Kumar Markam', reason: 'Phonetic double-e substitution' },
    { canonical: 'Deepak Patel', typo: 'Deepaak Patel', reason: 'Regional accent double vowel recording' },
    { canonical: 'Pradeep Banjare', typo: 'Pardeep Banjare', reason: 'Metathesis vowel position inversion (ra -> ar)' },
    { canonical: 'Gita Kashyap', typo: 'Geeta Kashyap', reason: 'Equivalent romanization variant (i -> ee)' },
    { canonical: 'Rakesh Dewangan', typo: 'Rakeysh Dewangan', reason: 'Phonetic diphthong variation (e -> ey)' },
    { canonical: 'Rekha Poyam', typo: 'Rekhaa Poyam', reason: 'Aspirated trailing vowel representation' },
  ];

  for (let i = 0; i < 50; i++) {
    const pattern = TYPO_PATTERNS[i % TYPO_PATTERNS.length];
    const col = pick(COLLEGES);
    const cat: ApplicantCategory = pick(['ST', 'SC', 'OBC']);
    const id = `CG-SCH-2026-${String(appSeq++).padStart(5, '0')}`;
    const tokenHex = randomHex(8);

    records.push({
      id,
      studentName: pattern.typo,
      canonicalName: pattern.canonical,
      aadhaarHash: `UID-${randomHex(4)}…${randomHex(3)}`,
      householdId: `HH-CG-${col.district.slice(0, 3).toUpperCase()}-TYP${String(i + 1).padStart(3, '0')}`,
      collegeId: col.id,
      collegeName: col.name,
      district: col.district,
      scheme: pick(SCHEMES),
      bankToken: `FD-${tokenHex.slice(0, 4)}…${tokenHex.slice(-3)}`,
      ifscPrefix: 'SBIN000',
      docHash: `DOC-${randomHex(6)}`,
      amount: pick([32000, 44000, 48000]),
      category: cat,
      recordType: 'typo_variant',
      submittedAt: `2026-03-${String(Math.floor(rng() * 15) + 5).padStart(2, '0')}`,
      notes: pattern.reason,
    });
  }

  // 3. GENERATE 40 LEGITIMATE SHARED-ACCOUNT RECORDS (20 Sibling Pairs)
  // Sibling pairs sharing 1 household AND 1 bank account
  const SIBLING_PAIRS = [
    { s1: 'Rameshwar Netam', s2: 'Kavita Netam', dist: 'Bastar', col: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur' },
    { s1: 'Santosh Baghel', s2: 'Sarita Baghel', dist: 'Raipur', col: 'COL-GEC-RAI', colName: 'Government Engineering College Raipur' },
    { s1: 'Dinesh Markam', s2: 'Bhumika Markam', dist: 'Bastar', col: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur' },
    { s1: 'Kamlesh Minj', s2: 'Neelam Minj', dist: 'Surguja', col: 'COL-GDC-SUR', colName: 'Government Degree College Ambikapur' },
    { s1: 'Arun Sidar', s2: 'Manisha Sidar', dist: 'Raigarh', col: 'COL-KGC-RAI', colName: 'Kirodimal Government Arts & Science Raigarh' },
    { s1: 'Hemant Banjare', s2: 'Priyanka Banjare', dist: 'Bilaspur', col: 'COL-BIT-BIL', colName: 'Bilaspur Institute of Technology' },
    { s1: 'Mahesh Gond', s2: 'Sangeeta Gond', dist: 'Durg', col: 'COL-CSV-DUR', colName: 'CSVTU Bhilai University Campus' },
    { s1: 'Yogesh Dhurve', s2: 'Indira Dhurve', dist: 'Kanker', col: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur' },
    { s1: 'Mukesh Jangde', s2: 'Sandhya Jangde', dist: 'Raipur', col: 'COL-GEC-RAI', colName: 'Government Engineering College Raipur' },
    { s1: 'Shubham Kanwar', s2: 'Divya Kanwar', dist: 'Korba', col: 'COL-GMC-KOR', colName: 'Government Polytechnic Korba' },
    { s1: 'Prakash Poyam', s2: 'Lalita Poyam', dist: 'Bastar', col: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur' },
    { s1: 'Devendra Kurrey', s2: 'Sushila Kurrey', dist: 'Bilaspur', col: 'COL-BIT-BIL', colName: 'Bilaspur Institute of Technology' },
    { s1: 'Vinod Ekka', s2: 'Nirmala Ekka', dist: 'Surguja', col: 'COL-GDC-SUR', colName: 'Government Degree College Ambikapur' },
    { s1: 'Chetan Mandavi', s2: 'Kiran Mandavi', dist: 'Bastar', col: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur' },
    { s1: 'Gajendra Ogre', s2: 'Rashmi Ogre', dist: 'Dhamtari', col: 'COL-PGD-DHM', colName: 'Babu Chhotelal Shrivastava PG College Dhamtari' },
    { s1: 'Tarun Kujur', s2: 'Jyoti Kujur', dist: 'Surguja', col: 'COL-GDC-SUR', colName: 'Government Degree College Ambikapur' },
    { s1: 'Harish Toppo', s2: 'Madhu Toppo', dist: 'Surguja', col: 'COL-GDC-SUR', colName: 'Government Degree College Ambikapur' },
    { s1: 'Jitendra Korram', s2: 'Shashi Korram', dist: 'Kanker', col: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur' },
    { s1: 'Narendra Bhagat', s2: 'Sheetal Bhagat', dist: 'Raigarh', col: 'COL-KGC-RAI', colName: 'Kirodimal Government Arts & Science Raigarh' },
    { s1: 'Satish Dewangan', s2: 'Pooja Dewangan', dist: 'Durg', col: 'COL-CSV-DUR', colName: 'CSVTU Bhilai University Campus' },
  ];

  for (let i = 0; i < 20; i++) {
    const pair = SIBLING_PAIRS[i];
    const sharedHousehold = `HH-CG-${pair.dist.slice(0, 3).toUpperCase()}-FAM${String(i + 1).padStart(3, '0')}`;
    const sharedBankToken = `FD-${randomHex(4)}…${randomHex(3)}`;
    const ifsc = 'SBIN001';

    // Sibling 1
    records.push({
      id: `CG-SCH-2026-${String(appSeq++).padStart(5, '0')}`,
      studentName: pair.s1,
      aadhaarHash: `UID-${randomHex(4)}…${randomHex(3)}`,
      householdId: sharedHousehold,
      collegeId: pair.col,
      collegeName: pair.colName,
      district: pair.dist,
      scheme: 'Post-Matric ST Scholarship',
      bankToken: sharedBankToken,
      ifscPrefix: ifsc,
      docHash: `DOC-RATION-${sharedHousehold.slice(-6)}`,
      amount: 42000,
      category: 'ST',
      recordType: 'sibling_cleared',
      submittedAt: '2026-03-12',
      notes: `Legitimate sibling pair in household ${sharedHousehold}`,
    });

    // Sibling 2
    records.push({
      id: `CG-SCH-2026-${String(appSeq++).padStart(5, '0')}`,
      studentName: pair.s2,
      aadhaarHash: `UID-${randomHex(4)}…${randomHex(3)}`,
      householdId: sharedHousehold,
      collegeId: pair.col,
      collegeName: pair.colName,
      district: pair.dist,
      scheme: 'Post-Matric ST Scholarship',
      bankToken: sharedBankToken,
      ifscPrefix: ifsc,
      docHash: `DOC-RATION-${sharedHousehold.slice(-6)}`,
      amount: 42000,
      category: 'ST',
      recordType: 'sibling_cleared',
      submittedAt: '2026-03-14',
      notes: `Legitimate sibling pair in household ${sharedHousehold}`,
    });
  }

  // 4. GENERATE 15 PLANTED SCAM RECORDS
  // (A) 8 RING APPLICATIONS across 3 distinct colleges converging on 2 hashed bank destinations with 0 shared households
  // Destination 1: FD-7a3f…c91
  // Destination 2: FD-9e2b…a44
  const BANK_DEST_1 = 'FD-7a3f…c91';
  const BANK_DEST_2 = 'FD-9e2b…a44';

  const RING_SPECS = [
    // Group A (Bank Dest 1)
    {
      name: 'Rajat Verma',
      colId: 'COL-GEC-RAI',
      colName: 'Government Engineering College Raipur',
      dist: 'Raipur',
      bank: BANK_DEST_1,
      hh: 'HH-CG-RAI-SCAM01',
      group: 'Ring-Cluster-Alpha',
    },
    {
      name: 'Pawan Kumar Sahu',
      colId: 'COL-BIT-BIL',
      colName: 'Bilaspur Institute of Technology',
      dist: 'Bilaspur',
      bank: BANK_DEST_1,
      hh: 'HH-CG-BIL-SCAM02',
      group: 'Ring-Cluster-Alpha',
    },
    {
      name: 'Sohan Lal Kashyap',
      colId: 'COL-BTD-BAS',
      colName: 'Bastar Tribal Degree College Jagdalpur',
      dist: 'Bastar',
      bank: BANK_DEST_1,
      hh: 'HH-CG-BAS-SCAM03',
      group: 'Ring-Cluster-Alpha',
    },
    {
      name: 'Vikas Dewangan',
      colId: 'COL-GEC-RAI',
      colName: 'Government Engineering College Raipur',
      dist: 'Raipur',
      bank: BANK_DEST_1,
      hh: 'HH-CG-RAI-SCAM04',
      group: 'Ring-Cluster-Alpha',
    },

    // Group B (Bank Dest 2)
    {
      name: 'Anupama Tiwari',
      colId: 'COL-BIT-BIL',
      colName: 'Bilaspur Institute of Technology',
      dist: 'Bilaspur',
      bank: BANK_DEST_2,
      hh: 'HH-CG-BIL-SCAM05',
      group: 'Ring-Cluster-Beta',
    },
    {
      name: 'Dhananjay Netam',
      colId: 'COL-BTD-BAS',
      colName: 'Bastar Tribal Degree College Jagdalpur',
      dist: 'Bastar',
      bank: BANK_DEST_2,
      hh: 'HH-CG-BAS-SCAM06',
      group: 'Ring-Cluster-Beta',
    },
    {
      name: 'Sunita Chouhan',
      colId: 'COL-GEC-RAI',
      colName: 'Government Engineering College Raipur',
      dist: 'Raipur',
      bank: BANK_DEST_2,
      hh: 'HH-CG-RAI-SCAM07',
      group: 'Ring-Cluster-Beta',
    },
    {
      name: 'Naveen Kumar Markam',
      colId: 'COL-BIT-BIL',
      colName: 'Bilaspur Institute of Technology',
      dist: 'Bilaspur',
      bank: BANK_DEST_2,
      hh: 'HH-CG-BIL-SCAM08',
      group: 'Ring-Cluster-Beta',
    },
  ];

  for (const item of RING_SPECS) {
    records.push({
      id: `CG-SCH-2026-${String(appSeq++).padStart(5, '0')}`,
      studentName: item.name,
      aadhaarHash: `UID-${randomHex(4)}…${randomHex(3)}`,
      householdId: item.hh,
      collegeId: item.colId,
      collegeName: item.colName,
      district: item.dist,
      scheme: 'Post-Matric OBC Scholarship',
      bankToken: item.bank,
      ifscPrefix: 'PUNB012',
      docHash: `DOC-FLAGGED-${randomHex(4)}`,
      amount: 48000,
      category: 'OBC',
      recordType: 'scam_ring',
      submittedAt: '2026-03-18',
      ringGroup: item.group,
      notes: 'Planted ring record: multi-institutional bank destination convergence',
    });
  }

  // (B) 7 CAMOUFLAGE RECORDS (same colleges or similar names, but distinct accounts; MUST NOT trigger FIN-002)
  const CAMOUFLAGE_SPECS = [
    { name: 'Rajeev Verma', colId: 'COL-GEC-RAI', colName: 'Government Engineering College Raipur', dist: 'Raipur' },
    { name: 'Pawan Kumar Baghel', colId: 'COL-BIT-BIL', colName: 'Bilaspur Institute of Technology', dist: 'Bilaspur' },
    { name: 'Sohan Lal Mandavi', colId: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur', dist: 'Bastar' },
    { name: 'Vimal Dewangan', colId: 'COL-GEC-RAI', colName: 'Government Engineering College Raipur', dist: 'Raipur' },
    { name: 'Anuradha Tiwari', colId: 'COL-BIT-BIL', colName: 'Bilaspur Institute of Technology', dist: 'Bilaspur' },
    { name: 'Dharmendra Netam', colId: 'COL-BTD-BAS', colName: 'Bastar Tribal Degree College Jagdalpur', dist: 'Bastar' },
    { name: 'Sunil Chouhan', colId: 'COL-GEC-RAI', colName: 'Government Engineering College Raipur', dist: 'Raipur' },
  ];

  for (let i = 0; i < 7; i++) {
    const item = CAMOUFLAGE_SPECS[i];
    const tokenHex = randomHex(8);
    records.push({
      id: `CG-SCH-2026-${String(appSeq++).padStart(5, '0')}`,
      studentName: item.name,
      aadhaarHash: `UID-${randomHex(4)}…${randomHex(3)}`,
      householdId: `HH-CG-${item.dist.slice(0, 3).toUpperCase()}-CAM${String(i + 1).padStart(3, '0')}`,
      collegeId: item.colId,
      collegeName: item.colName,
      district: item.dist,
      scheme: 'Post-Matric OBC Scholarship',
      bankToken: `FD-${tokenHex.slice(0, 4)}…${tokenHex.slice(-3)}`, // Distinct account!
      ifscPrefix: 'SBIN000',
      docHash: `DOC-${randomHex(6)}`,
      amount: 42000,
      category: 'OBC',
      recordType: 'camouflage',
      submittedAt: '2026-03-19',
      notes: 'Camouflage baseline: legitimate individual account in target institution',
    });
  }

  return records;
}
