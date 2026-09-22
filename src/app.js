"use strict";
const express = require("express");
const { port } = require("./config");
const { exportHandler } = require("./export");
const { partnerRouter } = require("./partner");

const app = express();
app.use(express.json());

app.get("/version", (_req, res) =>
  res.json({ service: "invoice-svc", version: process.env.APP_VERSION || "dev" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/invoices/export", exportHandler);
app.post("/invoices/export", exportHandler);

// Partner invoice API (Session 5). The route inside is deliberately vulnerable
// to path traversal — that is INC-0492, fixed in Lab 2.
app.use("/partner", partnerRouter);

if (require.main === module || process.env.APP_START === "1") {
  app.listen(port, () => console.log(`invoice-svc listening on :${port}`));
}

module.exports = app;
