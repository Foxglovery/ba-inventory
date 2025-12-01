export function generateBatchCode(productCode, oilBatchNumber, date = new Date()) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${productCode}-DC${oilBatchNumber}-${mm}-${dd}-${yy}`;
}

