function pad(value) {
  return String(value).padStart(2, '0');
}

function toDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getRecordDate(record, fieldName) {
  if (!record || !fieldName) {
    return null;
  }

  if (record[fieldName]) {
    return record[fieldName];
  }

  const snakeCaseField = fieldName.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
  return record[snakeCaseField] || null;
}

function formatMoney(value, currency = 'USD') {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export { formatDateTime, formatMoney, getRecordDate, toDateTimeLocal };