import { format } from 'date-fns';
import { getProductAbbreviation } from './productAbbreviations';

interface GenerateBatchCodeParams {
  dose: number;
  cannabinoid: string;
  productName: string;
  oilBatchCode: string;
  batchNumber: number;
}

export const generateBatchCode = ({
  dose,
  cannabinoid,
  productName,
  oilBatchCode,
  batchNumber,
}: GenerateBatchCodeParams): string => {
  const today = new Date();
  const dateStr = format(today, 'MM-DD-YY');
  const productAbbr = getProductAbbreviation(productName);
  
  return `${dose}${cannabinoid}${productAbbr}-${dateStr}-DC-${oilBatchCode}.${batchNumber}`;
};

export const parseBatchCode = (batchCode: string) => {
  const [mainPart, batchNumber] = batchCode.split('.');
  const [productInfo, dateInfo, dc, oilBatch] = mainPart.split('-');

  // Extract dose, cannabinoid, and product acronym
  const doseMatch = productInfo.match(/^\d+/);
  const dose = parseInt(doseMatch ? doseMatch[0] : '0');
  let remainder = productInfo.slice(doseMatch ? doseMatch[0].length : 0);

  // Common cannabinoid identifiers ordered by length to avoid partial matches
  const cannabinoidTokens = ['THCO', 'COMBO', 'CAF', 'FS', 'D9', 'D8'];
  let cannabinoid = '';
  let productAbbr = '';
  for (const token of cannabinoidTokens) {
    if (remainder.startsWith(token)) {
      cannabinoid = token;
      productAbbr = remainder.slice(token.length);
      break;
    }
  }

  // Fallback parsing if token not recognized
  if (!cannabinoid) {
    const match = remainder.match(/^[A-Za-z0-9]+/);
    cannabinoid = match ? match[0] : '';
    productAbbr = remainder.slice(cannabinoid.length);
  }

  return {
    dose,
    cannabinoid,
    productAbbr,
    date: dateInfo,
    oilBatchCode: oilBatch,
    batchNumber: parseInt(batchNumber),
  };
}; 