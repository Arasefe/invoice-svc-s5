"use strict";
// Partner invoice API.  (Session 5)
//
// LAB NOTE — INC-0492 / SAST:  this route is DELIBERATELY VULNERABLE to PATH
// TRAVERSAL.  It builds a file path from caller-controlled input (req.query.file)
// and serves it with no containment check, so a request like
//     /partner/invoices?file=../globex/inv-7.pdf
// escapes the partner's own folder and reads another customer's invoice.
//
// Semgrep (`semgrep scan --config auto`) flags the taint flow
//     req.query.file  ->  path.join(...)  ->  res.sendFile(...)
// Lab 2 fixes it: accept an invoice id, resolve it for the partner, and reject
// anything that escapes BASE. The instructor answer-key is web01/assets/partner.fixed.js.
//
// The route is key-gated (X-Partner-Key or ?key=). The key is a BENIGN lab value.
// The point of INC-0492 is that a VALID key still must not read other customers'
// files — an AUTHORIZATION bug, distinct from the leaked-credential (AUTHENTICATION)
// bug in INC-0485.
const path = require("path");
const express = require("express");

const BASE = process.env.PARTNER_BASE || "/srv/invoices/partner-acme";
const PARTNER_API_KEY = process.env.PARTNER_API_KEY || "pk_live_lab_demo";

const router = express.Router();

// key gate + feature flag (Session 5 containment switches PARTNER_API=off)
router.use((req, res, next) => {
  const key = req.get("x-partner-key") || (req.query && req.query.key);
  if (key !== PARTNER_API_KEY) return res.status(401).type("text/plain").send("invalid partner key");
  if (String(process.env.PARTNER_API || "on").toLowerCase() === "off")
    return res.status(503).type("text/plain").send("Partner API is temporarily disabled.");
  next();
});

// GET /partner/invoices?file=<name>   <-- VULNERABLE: user input -> file path, no containment
router.get("/invoices", (req, res) => {
  const p = path.join(BASE, String((req.query && req.query.file) || ""));
  res.sendFile(p, (err) => { if (err) res.status(404).type("text/plain").send("not found"); });
});

// GET /partner/export   — bulk export (key-gated lab stub)
router.get("/export", (_req, res) =>
  res.type("application/json").send(JSON.stringify({ partner: "acme", invoices: 128, note: "lab stub" })));

module.exports = { partnerRouter: router };
