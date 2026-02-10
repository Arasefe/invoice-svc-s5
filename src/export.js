"use strict";
// Invoice PDF export — the "door" in INC-0452 / INC-0471 (earlier sessions).
//
// In production this renders an invoice (Markdown) to PDF through md-to-pdf.
// md-to-pdf < 5.2.5 has CVE-2025-65108 (CVSS 10): arbitrary code execution when it
// parses attacker-controlled front matter. The fix is simply md-to-pdf >= 5.2.5,
// which is what this repo ships (the Session 4 fix). It is kept here so the SBOM
// coda in Session 5 has a real component to inventory.
//
// LAB NOTE: this handler is a stub. It never launches a browser and never evaluates
// attacker input, so nothing is exploitable here.
let mdToPdf = null;
try { ({ mdToPdf } = require("md-to-pdf")); } catch { /* present for scanning; render stubbed */ }

function invoiceMarkdown(id) {
  return `# Invoice ${id}\n\nAcme Ltd\n\n| Item | Qty | Price |\n|------|-----|-------|\n| Widget | 1 | 10.00 |\n`;
}

async function exportHandler(req, res) {
  if (String(process.env.PDF_EXPORT || "on").toLowerCase() === "off") {
    return res.status(503).type("text/plain").send("PDF export is paused. Please try again later.");
  }
  const id = String((req.query && req.query.id) || (req.body && req.body.id) || "0");
  res.type("application/pdf").send(`%PDF-1.4 lab-stub invoice ${id}\n`);
}

module.exports = { exportHandler, invoiceMarkdown };
