/**
 * @method isAadhaarCardContentValid
 * @description Checks if the extracted text contains Aadhaar-specific keywords and UID patterns.
 * @param {string} frontText - The text extracted from the front image.
 * @param {string} backText - The text extracted from the back image.
 * @returns {boolean} True if the images are likely Aadhaar cards.
 */
export const isAadhaarCardContentValid = (frontText: string, backText: string): boolean => {
  const requiredFrontKeywords = ['aadhaar', 'uidai'];
  const optionalFrontKeywords = ['dob', 'gender', 'male', 'female', 'government of india'];

  const frontNormalized = frontText.toLowerCase();
  const backNormalized = backText.toLowerCase();

  let score = 0;

  if (requiredFrontKeywords.every(keyword => frontNormalized.includes(keyword))) {
    score += 2;
  }

  score += optionalFrontKeywords.filter(keyword => frontNormalized.includes(keyword)).length * 0.5;
  
  const uidPattern = /\d{4}\s?\d{4}\s?\d{4}/;
  if (uidPattern.test(frontText)) score += 2;
  if (uidPattern.test(backText)) score += 2;
  
  if (backNormalized.includes('unique identification authority of india')) score += 1;

  return score >= 5; 
};

