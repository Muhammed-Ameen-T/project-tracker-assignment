import { parse } from 'date-fns';
import { ParsedAadhaarData } from '../types/PaarsedAadhaar';

const NAME_LABEL_REGEX = /^[A-Za-z\s.]+$/;
const DOB_REGEX = /(?:DOB|Date of Birth|जन्म तिथि)\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i;
const UID_REGEX = /\b(\d{4})\s?(\d{4})\s?(\d{4})\b/g;
const PINCODE_REGEX = /\b\d{6}\b/;
const ADDRESS_PREFIX_REGEX = /.*(Address[:\-]?\s*)/i;
/**
 * Parses raw text extracted from Aadhaar card images to find specific data fields.
 * @param frontText Text from the front side of the Aadhaar card.
 * @param backText Text from the back side of the Aadhaar card.
 * @returns An object containing the parsed Aadhaar data.
 */
export const parseAadhaarData = (frontText: string, backText: string): ParsedAadhaarData => {
  const frontLines = frontText.split('\n').map(line => line.trim()).filter(Boolean);
  const backLines = backText.split('\n').map(line => line.trim()).filter(Boolean);

  let name = '';
  let dob = '';
  let gender = '';

  const dobMatch = frontText.match(DOB_REGEX);
  if (dobMatch?.[1]) dob = dobMatch[1];

  if (dob) {
    const dobLineIndex = frontLines.findIndex(line => line.includes(dob));
    if (dobLineIndex > 0) {
      const candidate = frontLines[dobLineIndex - 1];
      if (NAME_LABEL_REGEX.test(candidate)) {
        name = candidate;
      }
    }
  }

  const genderLine = frontLines.find(line => /male|female/i.test(line));
  gender = genderLine?.toLowerCase().includes('female') ? 'FEMALE' : 'MALE';

  const uidFrontMatch = frontText.matchAll(UID_REGEX);
  const uid_front_raw = uidFrontMatch ? [...uidFrontMatch][0]?.slice(1, 4).join('') : '';

  const uidBackMatch = backText.matchAll(UID_REGEX);
  const uid_back_raw = uidBackMatch ? [...uidBackMatch][0]?.slice(1, 4).join('') : '';

  let rawAddress = backText.replace(/\n/g, ' ').trim();
  rawAddress = rawAddress.replace(ADDRESS_PREFIX_REGEX, '').trim();

  const pinMatch = rawAddress.match(PINCODE_REGEX);
  const pincode = pinMatch?.[0] || '';
  if (pinMatch) {
    const cutoff = rawAddress.indexOf(pinMatch[0]) + pinMatch[0].length;
    rawAddress = rawAddress.slice(0, cutoff).trim();
  }

  let age_band = 'N/A';
  if (dob) {
    const dobDate = parse(dob, 'dd/MM/yyyy', new Date());
    const age = new Date().getFullYear() - dobDate.getFullYear();
    if (age < 18) age_band = 'Underage';
    else if (age <= 30) age_band = '20-30';
    else if (age <= 50) age_band = '30-50';
    else age_band = 'Senior';
  }

  return {
    name,
    dob,
    gender,
    uid_front: uid_front_raw.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'),
    uid_back: uid_back_raw.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'),
    address: rawAddress,
    pincode,
    age_band,
  };
};