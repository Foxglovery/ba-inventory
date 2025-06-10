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
  const dose = parseInt(productInfo.match(/\d+/)?.[0] || '0');
  const cannabinoid = productInfo.match(/[A-Za-z]+/)?.[0] || '';
  const productAbbr = productInfo.slice(dose.toString().length + cannabinoid.length);
  
  return {
    dose,
    cannabinoid,
    productAbbr,
    date: dateInfo,
    oilBatchCode: oilBatch,
    batchNumber: parseInt(batchNumber),
  };
}; 