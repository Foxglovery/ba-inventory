import { format } from 'date-fns';

interface GenerateBatchCodeParams {
  dose: number;
  cannabinoid: string;
  productAcronym: string;
  oilBatchCode: string;
  batchNumber: number;
}

export const generateBatchCode = ({
  dose,
  cannabinoid,
  productAcronym,
  oilBatchCode,
  batchNumber,
}: GenerateBatchCodeParams): string => {
  const today = new Date();
  const dateStr = format(today, 'MM-DD-YY');
  
  return `${dose}${cannabinoid}${productAcronym}-${dateStr}-DC-${oilBatchCode}.${batchNumber}`;
};

export const parseBatchCode = (batchCode: string) => {
  const [mainPart, batchNumber] = batchCode.split('.');
  const [productInfo, dateInfo, dc, oilBatch] = mainPart.split('-');
  
  // Extract dose, cannabinoid, and product acronym
  const dose = parseInt(productInfo.match(/\d+/)?.[0] || '0');
  const cannabinoid = productInfo.match(/[A-Za-z]+/)?.[0] || '';
  const productAcronym = productInfo.slice(dose.toString().length + cannabinoid.length);
  
  return {
    dose,
    cannabinoid,
    productAcronym,
    date: dateInfo,
    oilBatchCode: oilBatch,
    batchNumber: parseInt(batchNumber),
  };
}; 