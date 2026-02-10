"use strict";
const express = require("express");
const { port } = require("./config");
const { exportHandler } = require("./export");

const app = express();
app.use(express.json());

app.get("/version", (_req, res) =>
  res.json({ service: "invoice-svc", version: process.env.APP_VERSION || "dev" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/invoices/export", exportHandler);
app.post("/invoices/export", exportHandler);


if (require.main === module || process.env.APP_START === "1") {
  app.listen(port, () => console.log(`invoice-svc listening on :${port}`));
}

module.exports = app;
