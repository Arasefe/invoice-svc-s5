"use strict";
// Invoice math. Totals are summed in integer cents to avoid floating-point drift.
function lineTotalCents(item) {
  return Math.round(Number(item.unitPrice) * 100) * Number(item.qty);
}
function invoiceTotal(items) {
  const cents = (items || []).reduce((sum, it) => sum + lineTotalCents(it), 0);
  return cents / 100;
}
module.exports = { lineTotalCents, invoiceTotal };
