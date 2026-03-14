import { useState } from "react";

// ── Date helpers ────────────────────────────────────────────
const START = new Date(2026, 2, 16); // March 16 2026
const addWorkdays = (from, n) => {
  let d = new Date(from), added = 0;
  while (added < n) { d.setDate(d.getDate()+1); if(d.getDay()!==0&&d.getDay()!==6) added++; }
  return d;
};
const fmtDate = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtShort = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"short"});

// Map day-index (0-based workday) to actual calendar date
const dayDate = (workdayIdx) => {
  if(workdayIdx===0) return new Date(START);
  return addWorkdays(START, workdayIdx);
};

// Week date ranges
const weekRanges = [
  { week:"Week 1", label:"Foundation & Parallel Build",      start: dayDate(0),  end: dayDate(4),  color:"#1e40af" },
  { week:"Week 2", label:"Engine Integration + Proof Logic", start: dayDate(7),  end: dayDate(11), color:"#6d28d9" },
  { week:"Week 3", label:"Hardening + Systematic Testing",   start: dayDate(14), end: dayDate(18), color:"#b45309" },
  { week:"Week 4", label:"Delivery, Hardening & Handover",   start: dayDate(21), end: dayDate(27), color:"#065f46" },
];

// Key milestone dates
const milestones = [
  { label:"🔒 Interface Contracts Frozen",    date: dayDate(2),  week:"Week 1" },
  { label:"✅ Integration Checkpoint #1",      date: dayDate(4),  week:"Week 1" },
  { label:"✅ Integration Checkpoint #2",      date: dayDate(11), week:"Week 2" },
  { label:"🧪 Systematic Testing Begins",      date: dayDate(14), week:"Week 3" },
  { label:"📦 Production Docker Build",        date: dayDate(18), week:"Week 3" },
  { label:"🚀 Go-Live (Production Delivery)",  date: dayDate(20), week:"Week 3", highlight:true },
  { label:"🔨 P0/P1 Punch List Fixes",         date: dayDate(21), week:"Week 4" },
  { label:"🧾 UAT Sessions",                   date: dayDate(23), week:"Week 4" },
  { label:"📘 Handover Docs Complete",         date: dayDate(25), week:"Week 4" },
  { label:"🏁 Final Handover & Sign-off",      date: dayDate(27), week:"Week 4", highlight:true },
];

const STATUS_COLORS = {
  "Not Started": { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1" },
  "In Progress":  { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
  "Done":         { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  "Blocked":      { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" },
};

const OWNER_COLORS = {
  "Rooban":            "#dbeafe",
  "Shrvaani+Athmika":  "#fce7f3",
  "Shrvaani + Athmika":"#fce7f3",
  "Dhivyashree":       "#fef9c3",
  "All":               "#f3e8ff",
  "Rooban+Dhivyashree":"#dcfce7",
  "Rooban+All":        "#e0f2fe",
};

const oc = (o) => {
  if (!o) return "#f8fafc";
  for (const k of Object.keys(OWNER_COLORS)) if (o.startsWith(k)) return OWNER_COLORS[k];
  return "#f8fafc";
};

// ── Task data with workday index ─────────────────────────────
const RAW = [
  // WEEK 1
  {id:"1.1", wd:0,  dl:"Day 1 — Kickoff + Infrastructure",     task:"Provision Azure VM (Standard D4s v3) · configure ports · install Docker",                                  owner:"Rooban",             pri:"P0", output:"Azure VM live"},
  {id:"1.2", wd:0,  dl:"Day 1 — Kickoff + Infrastructure",     task:"Write Dockerfile — all system libs (tesseract, libzbar0, libdmtx0b, libGL, poppler)",                owner:"Rooban",             pri:"P0", output:"Dockerfile + docker-compose.yml"},
  {id:"1.3", wd:0,  dl:"Day 1 — Kickoff + Infrastructure",     task:"Set up GitHub repo · branch strategy (main/dev/feature) · .env template · Azure Container Registry", owner:"Rooban",             pri:"P0", output:"Repo live + ACR configured"},
  {id:"1.4", wd:0,  dl:"Day 1 — Kickoff + Infrastructure",     task:"Ingest real label images · assess resolution, format, scan quality",                                  owner:"Shrvaani+Athmika",   pri:"P0", output:"Label quality report (1 page)"},
  {id:"1.5", wd:0,  dl:"Day 1 — Kickoff + Infrastructure",     task:"Review PRD attribute list · flag ambiguous verification methods · begin symbol library inventory",    owner:"Dhivyashree",        pri:"P1", output:"Annotated PRD notes + symbol list draft"},
  {id:"1.6", wd:0,  dl:"Day 1 — Kickoff + Infrastructure",     task:"STANDUP EOD: Azure VM live, all team members can run Docker locally ✅",                              owner:"All",                pri:"P0", output:"Kickoff confirmed"},
  {id:"2.1", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Implement schema.py — 130+ attributes with types, validation rules, verification_method",             owner:"Rooban+Dhivyashree", pri:"P0", output:"form/schema.py"},
  {id:"2.2", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Implement Pydantic models (models.py) for form data + CV findings + proof results",                   owner:"Dhivyashree",        pri:"P0", output:"form/models.py"},
  {id:"2.3", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Azure Cosmos DB for MongoDB API setup · create all 5 collections · implement indexes PRD §7.4",       owner:"Rooban",             pri:"P0", output:"CosmosDB live + db/mongo_client.py"},
  {id:"2.4", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Add attribute_definitions collection · seed with 130+ attributes",                                    owner:"Rooban",             pri:"P0", output:"Collection seeded"},
  {id:"2.5", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Begin image aligner (aligner.py) — SIFT + RANSAC homography",                                        owner:"Shrvaani+Athmika",   pri:"P1", output:"Draft core/aligner.py"},
  {id:"2.6", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Set up pytesseract + easyocr in Docker · smoke test on real labels",                                  owner:"Shrvaani+Athmika",   pri:"P0", output:"OCR working in container"},
  {id:"2.7", wd:1,  dl:"Day 2 — Schema + Form Foundation",     task:"Begin Streamlit UI shell — 5 tabs, navigation, file upload components",                               owner:"Shrvaani+Athmika",   pri:"P0", output:"app.py skeleton"},
  {id:"3.1", wd:2,  dl:"Day 3 — Interface Contracts Frozen",   task:"⚠ INTERFACE CONTRACT REVIEW (10am) — sign off all 3 JSON contracts with stakeholder",                owner:"All",                pri:"P0", output:"Contracts FROZEN ✅"},
  {id:"3.2", wd:2,  dl:"Day 3 — Interface Contracts Frozen",   task:"Implement dynamic form renderer (renderer.py) — attribute picker + edit form (Step 1+2)",             owner:"Shrvaani+Athmika",   pri:"P0", output:"Step 1 + Step 2 of form flow"},
  {id:"3.3", wd:2,  dl:"Day 3 — Interface Contracts Frozen",   task:"Begin symbol detector — symbol library PNG setup + SIFT keypoint matching",                           owner:"Dhivyashree",        pri:"P1", output:"core/detector.py draft + symbols/ folder"},
  {id:"3.4", wd:2,  dl:"Day 3 — Interface Contracts Frozen",   task:"Begin OCR pipeline — CLAHE preprocessing + pytesseract primary + easyocr fallback",                  owner:"Shrvaani+Athmika",   pri:"P1", output:"modules/text_extractor.py draft"},
  {id:"3.5", wd:2,  dl:"Day 3 — Interface Contracts Frozen",   task:"Begin attribute rule definitions (rules.py) — text attributes first (20 rules)",                      owner:"Dhivyashree",        pri:"P1", output:"proofing/rules.py draft — 20 rules"},
  {id:"3.6", wd:2,  dl:"Day 3 — Interface Contracts Frozen",   task:"Azure Blob Storage setup for label image files + report outputs (docx/pdf/json)",                     owner:"Rooban",             pri:"P0", output:"Blob storage containers configured"},
  {id:"4.1", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"Form validation rules (validator.py) — all 8 rules from PRD §3.4",                                   owner:"Rooban",             pri:"P0", output:"form/validator.py"},
  {id:"4.2", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"Form state auto-save to session storage · confirm/preview step (Step 3)",                            owner:"Shrvaani+Athmika",   pri:"P0", output:"Step 3 of form flow complete"},
  {id:"4.3", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"Symbol detector — add ORB fallback + confidence-weighted NMS",                                        owner:"Dhivyashree",        pri:"P1", output:"Detector handles 3 strategies"},
  {id:"4.4", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"SSIM graphics diff module — contour analysis on aligned images",                                       owner:"Shrvaani+Athmika",   pri:"P1", output:"modules/graphics_diff.py draft"},
  {id:"4.5", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"Barcode waterfall — pyzbar → zxingcpp → pylibdmtx → OpenCV-QR",                                     owner:"Shrvaani+Athmika",   pri:"P0", output:"modules/barcode_detector.py"},
  {id:"4.6", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"Text diff engine — fuzzy match (SequenceMatcher) + old/new value comparison",                        owner:"Shrvaani+Athmika",   pri:"P0", output:"modules/text_extractor.py complete"},
  {id:"4.7", wd:3,  dl:"Day 4 — Form Complete + CV Building",  task:"Rule definitions — symbol attributes (15 rules) + barcode attributes (14 rules)",                    owner:"Dhivyashree",        pri:"P1", output:"49 rules total in rules.py"},
  {id:"5.1", wd:4,  dl:"Day 5 — Integration Checkpoint #1",    task:"Integration test: Form submission → produces valid form_submission.json",                             owner:"Rooban",             pri:"P0", output:"Contract 1 validated ✅"},
  {id:"5.2", wd:4,  dl:"Day 5 — Integration Checkpoint #1",    task:"Run symbol detector + OCR + barcode decoder on real labels — collect raw findings",                   owner:"Shrvaani+Athmika",   pri:"P0", output:"Raw findings JSON per module"},
  {id:"5.3", wd:4,  dl:"Day 5 — Integration Checkpoint #1",    task:"Gap check: Compare raw findings against Contract 2 schema — fix field mismatches",                   owner:"Shrvaani+Athmika",   pri:"P0", output:"Contract 2 alignment confirmed"},
  {id:"5.4", wd:4,  dl:"Day 5 — Integration Checkpoint #1",    task:"Image aligner complete — homography corrects skew on real label scans",                              owner:"Shrvaani+Athmika",   pri:"P0", output:"core/aligner.py complete"},
  {id:"5.5", wd:4,  dl:"Day 5 — Integration Checkpoint #1",    task:"Begin proof engine skeleton — attribute router + matcher stubs",                                      owner:"Dhivyashree",        pri:"P1", output:"proofing/engine.py scaffold"},
  {id:"5.6", wd:4,  dl:"Day 5 — Integration Checkpoint #1",    task:"STAKEHOLDER REVIEW: Demo form UI + raw CV findings on real label",                                   owner:"All",                pri:"P0", output:"Week 1 milestone sign-off"},
  {id:"6.1", wd:5,  dl:"Days 6–7 — Buffer + Catch-up",         task:"MongoDB CRUD operations complete · session auto-save wired to form submit · Azure Key Vault for secrets", owner:"Rooban",          pri:"P0", output:"db/mongo_client.py complete"},
  {id:"6.2", wd:5,  dl:"Days 6–7 — Buffer + Catch-up",         task:"Symbol comparator — diff logic between base and child detection sets",                               owner:"Dhivyashree",        pri:"P1", output:"modules/symbol_comparator.py"},
  {id:"6.3", wd:5,  dl:"Days 6–7 — Buffer + Catch-up",         task:"GS1 Application Identifier parser for barcode fields",                                               owner:"Shrvaani+Athmika",   pri:"P0", output:"GS1 AI parser module"},
  {id:"6.4", wd:5,  dl:"Days 6–7 — Buffer + Catch-up",         task:"Attribute-to-CV-finding matcher (matchers.py) — exact, fuzzy, symbol normalisation, GS1 AI",        owner:"Dhivyashree",        pri:"P0", output:"proofing/matchers.py"},
  {id:"6.5", wd:5,  dl:"Days 6–7 — Buffer + Catch-up",         task:"WEEKEND GATE: All Contract 1 + Contract 2 outputs producing valid JSON ✅",                          owner:"All",                pri:"P0", output:"Gate confirmed before Week 2"},
  {id:"8.1", wd:7,  dl:"Day 8 — Proof Engine Core",            task:"Proof engine pipeline steps 1–4: routing, candidate matching, old-value check, new-value verify",    owner:"Dhivyashree",        pri:"P0", output:"Engine processes text attributes end-to-end"},
  {id:"8.2", wd:7,  dl:"Day 8 — Proof Engine Core",            task:"Wire CV module outputs into unified cv_findings.json aggregator",                                    owner:"Shrvaani+Athmika",   pri:"P0", output:"Single findings file from all 4 modules"},
  {id:"8.3", wd:7,  dl:"Day 8 — Proof Engine Core",            task:"Azure CosmosDB proofing_history schema — add cv_findings, report refs, file hashes",                owner:"Rooban",             pri:"P0", output:"Schema matches PRD §7.1 exactly"},
  {id:"8.4", wd:7,  dl:"Day 8 — Proof Engine Core",            task:"SHA-256 file hashing at image ingestion · store in session document · Azure Blob path references",   owner:"Rooban",             pri:"P1", output:"Audit trail integrity implemented"},
  {id:"9.1", wd:8,  dl:"Day 9 — Proof Engine Rules + Verdict Logic", task:"Proof engine pipeline steps 5–8: positional check, completeness, threshold eval, verdict assignment", owner:"Dhivyashree",      pri:"P0", output:"All 4 verdict types working"},
  {id:"9.2", wd:8,  dl:"Day 9 — Proof Engine Rules + Verdict Logic", task:"Remaining rule definitions — graphic/logo (10 rules) + compliance (10 rules) + custom attributes",  owner:"Dhivyashree",        pri:"P0", output:"All 130+ attributes have rules"},
  {id:"9.3", wd:8,  dl:"Day 9 — Proof Engine Rules + Verdict Logic", task:"Integration test: Feed real label CV findings into proof engine — check verdicts",                   owner:"Shrvaani+Athmika",   pri:"P0", output:"First real end-to-end verdict"},
  {id:"9.4", wd:8,  dl:"Day 9 — Proof Engine Rules + Verdict Logic", task:"Annotated visual diff — colour-coded bounding boxes on side-by-side image",                         owner:"Shrvaani+Athmika",   pri:"P1", output:"reports/annotator.py"},
  {id:"10.1", wd:9, dl:"Day 10 — Unintended Change Classifier + Proof UI", task:"Unintended change classifier — all 5 classification rules from PRD §5.5",                    owner:"Dhivyashree",        pri:"P0", output:"proofing/engine.py complete"},
  {id:"10.2", wd:9, dl:"Day 10 — Unintended Change Classifier + Proof UI", task:"Proof Engine tab UI — per-attribute verdict table, evidence details, unintended changes section", owner:"Shrvaani+Athmika", pri:"P0", output:"Tab 3 (✅ Proof Engine) complete"},
  {id:"10.3", wd:9, dl:"Day 10 — Unintended Change Classifier + Proof UI", task:"CV Inspection tab UI — upload, run, annotated diff display, per-module results tabs",          owner:"Shrvaani+Athmika",   pri:"P0", output:"Tab 2 (🔍 CV Inspection) complete"},
  {id:"10.4", wd:9, dl:"Day 10 — Unintended Change Classifier + Proof UI", task:"Tune CV thresholds on real labels — symbol confidence floors, OCR similarity thresholds",     owner:"Shrvaani+Athmika",   pri:"P1", output:"Threshold config file"},
  {id:"11.1", wd:10, dl:"Day 11 — Report Builder",                  task:"Report builder sections 1–5: cover, summary, attribute table, missing cards, incomplete cards",      owner:"Dhivyashree",        pri:"P0", output:"reports/report_builder.py draft"},
  {id:"11.2", wd:10, dl:"Day 11 — Report Builder",                  task:"Report builder sections 6–11: unintended, symbol table, OCR, barcode, visual diff, audit trail",     owner:"Dhivyashree",        pri:"P0", output:"Full report structure complete"},
  {id:"11.3", wd:10, dl:"Day 11 — Report Builder",                  task:"Word (.docx) report template design + tables + annotated image embed",                               owner:"Shrvaani+Athmika",   pri:"P1", output:"reports/pdf_export.py — docx template done"},
  {id:"11.4", wd:10, dl:"Day 11 — Report Builder",                  task:"Proof History tab UI — search/filter/sort table, session detail view",                               owner:"Shrvaani+Athmika",   pri:"P1", output:"Tab 5 (🗄️ Proof History) draft"},
  {id:"11.5", wd:10, dl:"Day 11 — Report Builder",                  task:"Azure backend API routes — session save, report retrieve, history query endpoints",                  owner:"Rooban",             pri:"P0", output:"Backend API routes live"},
  {id:"12.1", wd:11, dl:"Day 12 — Integration Checkpoint #2",       task:"Full pipeline run on real label: Form → CV → Proof Engine → Report → CosmosDB",                     owner:"All",                pri:"P0", output:"First complete end-to-end run"},
  {id:"12.2", wd:11, dl:"Day 12 — Integration Checkpoint #2",       task:"STAKEHOLDER REVIEW: Walk through full pipeline output — verdict accuracy check",                     owner:"All",                pri:"P0", output:"Feedback list captured"},
  {id:"12.3", wd:11, dl:"Day 12 — Integration Checkpoint #2",       task:"Identify top 5 verdict errors — root cause (CV threshold? Rule logic? Matcher?)",                   owner:"Dhivyashree",        pri:"P0", output:"Bug/tuning list"},
  {id:"12.4", wd:11, dl:"Day 12 — Integration Checkpoint #2",       task:"PDF export via ReportLab/WeasyPrint · upload to Azure Blob · return download URL",                  owner:"Rooban",             pri:"P1", output:".pdf export + Blob URL working"},
  {id:"13.1", wd:12, dl:"Days 13–14 — Fixes + Robustness",        task:"History tab complete — trend chart (Plotly), CSV export, session diff view",                         owner:"Shrvaani+Athmika",   pri:"P1", output:"Tab 5 fully functional"},
  {id:"13.2", wd:12, dl:"Days 13–14 — Fixes + Robustness",        task:"Handle CV edge cases — low-res scans, partial label images, rotated labels",                         owner:"Shrvaani+Athmika",   pri:"P1", output:"Robust CV on edge cases"},
  {id:"13.3", wd:12, dl:"Days 13–14 — Fixes + Robustness",        task:"OCR edge cases — small fonts, colour backgrounds, multilingual text",                                owner:"Shrvaani+Athmika",   pri:"P1", output:"OCR hardened"},
  {id:"13.4", wd:12, dl:"Days 13–14 — Fixes + Robustness",        task:"Fix top verdict errors identified Day 12 · JSON export · PASS/CONDITIONAL/FAIL overall logic",       owner:"Dhivyashree",        pri:"P0", output:"Overall verdict logic correct"},
  {id:"13.5", wd:12, dl:"Days 13–14 — Fixes + Robustness",        task:"Auth stub — Azure AD role field on user documents, basic session login",                             owner:"Rooban",             pri:"P2", output:"Role-based access stub in place"},
  {id:"T1",   wd:14, dl:"Days 15–16 — Systematic Testing",        task:"Test all 8 form validation rules with edge case inputs",                                             owner:"Shrvaani+Athmika",   pri:"P0", output:"Validation test report"},
  {id:"T2",   wd:14, dl:"Days 15–16 — Systematic Testing",        task:"Test all 5 verdict types across 10+ real label pairs",                                              owner:"Dhivyashree",        pri:"P0", output:"Verdict accuracy matrix"},
  {id:"T3",   wd:14, dl:"Days 15–16 — Systematic Testing",        task:"Test all 5 unintended change classifications",                                                      owner:"Dhivyashree",        pri:"P0", output:"Classification test report"},
  {id:"T4",   wd:14, dl:"Days 15–16 — Systematic Testing",        task:"Test barcode grade thresholds — Grade A/B/C/D across real barcodes",                               owner:"Shrvaani+Athmika",   pri:"P0", output:"Barcode test report"},
  {id:"T5",   wd:14, dl:"Days 15–16 — Systematic Testing",        task:"Performance test — CV < 45s, proof engine < 10s, report < 15s on Azure VM",                        owner:"Rooban",             pri:"P0", output:"Performance benchmark"},
  {id:"T6",   wd:14, dl:"Days 15–16 — Systematic Testing",        task:"CosmosDB write/query latency under 10 concurrent sessions",                                         owner:"Rooban",             pri:"P1", output:"Load test results"},
  {id:"17.1", wd:16, dl:"Days 17–18 — Tuning + Bug Fixes",        task:"Address all test failures from Days 15–16",                                                         owner:"All",                pri:"P0", output:"Zero P0 test failures"},
  {id:"17.2", wd:16, dl:"Days 17–18 — Tuning + Bug Fixes",        task:"Tune SIFT/ORB confidence thresholds per symbol type using real label results",                      owner:"Dhivyashree",        pri:"P1", output:"Updated threshold config"},
  {id:"17.3", wd:16, dl:"Days 17–18 — Tuning + Bug Fixes",        task:"Tune OCR fuzzy match thresholds (default 0.90) per text region type",                              owner:"Shrvaani+Athmika",   pri:"P1", output:"Updated OCR config"},
  {id:"17.4", wd:16, dl:"Days 17–18 — Tuning + Bug Fixes",        task:"Fix any CosmosDB schema gaps discovered during full pipeline runs",                                 owner:"Rooban",             pri:"P0", output:"Schema finalized"},
  {id:"17.5", wd:16, dl:"Days 17–18 — Tuning + Bug Fixes",        task:"Final annotated diff visual polish — directional arrows for repositioned elements",                 owner:"Shrvaani+Athmika",   pri:"P2", output:"Annotated diff polished"},
  {id:"19.1", wd:18, dl:"Day 19 — Pre-Delivery Integration Run",    task:"Run 5 complete proofing sessions on different label change scenarios",                               owner:"All",                pri:"P0", output:"5 full session records in CosmosDB"},
  {id:"19.2", wd:18, dl:"Day 19 — Pre-Delivery Integration Run",    task:"Verify all 5 CosmosDB collections populated correctly",                                             owner:"Rooban",             pri:"P0", output:"DB integrity confirmed"},
  {id:"19.3", wd:18, dl:"Day 19 — Pre-Delivery Integration Run",    task:"Download all export formats (docx, pdf, json, csv) — visual QA",                                   owner:"All",                pri:"P0", output:"Export QA sign-off"},
  {id:"19.4", wd:18, dl:"Day 19 — Pre-Delivery Integration Run",    task:"Docker image final build · push to Azure Container Registry · clean env, no dev deps",             owner:"Rooban",             pri:"P0", output:"Production Docker image in ACR"},
  {id:"20.1", wd:19, dl:"Day 20 — Demo Prep + Docs",                task:"Prepare demo script — 3 scenarios (PASS, FAIL, CONDITIONAL)",                                      owner:"Rooban",             pri:"P0", output:"Demo script"},
  {id:"20.2", wd:19, dl:"Day 20 — Demo Prep + Docs",                task:"Write README — Azure setup, .env config, Docker run + ACR pull instructions",                      owner:"Rooban",             pri:"P0", output:"README.md"},
  {id:"20.3", wd:19, dl:"Day 20 — Demo Prep + Docs",                task:"Write user guide — step-by-step workflow matching PRD §8.2",                                        owner:"Dhivyashree",        pri:"P1", output:"USER_GUIDE.md"},
  {id:"20.4", wd:19, dl:"Day 20 — Demo Prep + Docs",                task:"Final stakeholder walkthrough — sign off or log punch list",                                        owner:"All",                pri:"P0", output:"Sign-off or punch list"},
  {id:"21.1", wd:20, dl:"Day 21 — Production Delivery",             task:"Docker image deployed to Azure VM from ACR · health check passing",                                owner:"Rooban",             pri:"P0", output:"App live on Azure VM"},
  {id:"21.2", wd:20, dl:"Day 21 — Production Delivery",             task:"Azure VM hardened — NSG firewall rules, HTTPS via Azure App Gateway, CosmosDB IP whitelist",       owner:"Rooban",             pri:"P0", output:"VM production-ready"},
  {id:"21.3", wd:20, dl:"Day 21 — Production Delivery",             task:"All documentation committed to GitHub repo",                                                        owner:"All",                pri:"P0", output:"Docs in repo"},
  {id:"21.4", wd:20, dl:"Day 21 — Production Delivery",             task:"Punch list items triaged: P0 (block) / P1 (fix) / P2 (backlog)",                                  owner:"All",                pri:"P0", output:"Prioritised punch list"},
  {id:"22.1", wd:21, dl:"Days 22–23 — Punch List Fixes",          task:"Resolve all P0 punch list items from Day 21",                                                      owner:"All",                pri:"P0", output:"Zero blocking issues"},
  {id:"22.2", wd:21, dl:"Days 22–23 — Punch List Fixes",          task:"Resolve P1 punch list items (non-blocking but required for handover)",                             owner:"All",                pri:"P1", output:"P1 list cleared"},
  {id:"22.3", wd:21, dl:"Days 22–23 — Punch List Fixes",          task:"Re-run full 5-session integration test post-fixes",                                                owner:"Rooban",             pri:"P0", output:"Regression confirmed clean"},
  {id:"22.4", wd:21, dl:"Days 22–23 — Punch List Fixes",          task:"CV accuracy re-validation — confirm thresholds still hold after fixes",                            owner:"Shrvaani+Athmika",   pri:"P1", output:"Accuracy report v2"},
  {id:"24.1", wd:23, dl:"Days 24–25 — User Acceptance Testing",   task:"UAT session 1 — Stakeholder runs 3 real label proofing scenarios end-to-end",                      owner:"All",                pri:"P0", output:"UAT feedback log"},
  {id:"24.2", wd:23, dl:"Days 24–25 — User Acceptance Testing",   task:"UAT session 2 — Edge case labels (low-res, multilingual, rotated)",                               owner:"Shrvaani+Athmika",   pri:"P1", output:"UAT edge case report"},
  {id:"24.3", wd:23, dl:"Days 24–25 — User Acceptance Testing",   task:"Fix critical UAT findings (same-day turnaround)",                                                  owner:"All",                pri:"P0", output:"UAT blockers resolved"},
  {id:"24.4", wd:23, dl:"Days 24–25 — User Acceptance Testing",   task:"Sign-off on verdict accuracy threshold — stakeholder accepts CV performance baseline",             owner:"All",                pri:"P0", output:"Accuracy baseline signed off"},
  {id:"26.1", wd:25, dl:"Days 26–27 — Handover Preparation",      task:"Shrvaani+Athmika document CV tuning guide + UI component guide",                                   owner:"Shrvaani+Athmika",   pri:"P1", output:"CV_TUNING_GUIDE.md + UI_GUIDE.md"},
  {id:"26.2", wd:25, dl:"Days 26–27 — Handover Preparation",      task:"Dhivyashree documents rule engine + how to add new rules + symbol library guide",                  owner:"Dhivyashree",        pri:"P1", output:"RULES_GUIDE.md + SYMBOL_LIBRARY_GUIDE.md"},
  {id:"26.3", wd:25, dl:"Days 26–27 — Handover Preparation",      task:"Rooban documents Azure infra runbook — VM ops, ACR, CosmosDB backup, Key Vault",                  owner:"Rooban",             pri:"P0", output:"AZURE_INFRA_RUNBOOK.md"},
  {id:"26.4", wd:25, dl:"Days 26–27 — Handover Preparation",      task:"Backlog grooming — all P2 items documented in GitHub Issues for future sprint",                    owner:"All",                pri:"P2", output:"GitHub Issues populated"},
  {id:"28.1", wd:27, dl:"Day 28 — Final Handover",                task:"Final live demo to stakeholder — production Azure VM",                                              owner:"All",                pri:"P0", output:"Handover demo complete"},
  {id:"28.2", wd:27, dl:"Day 28 — Final Handover",                task:"Credentials + access handover — Azure VM, CosmosDB, ACR, GitHub, Key Vault",                      owner:"Rooban",             pri:"P0", output:"Access transfer confirmed"},
  {id:"28.3", wd:27, dl:"Day 28 — Final Handover",                task:"Project retrospective — what worked, what to improve in next sprint",                               owner:"All",                pri:"P2", output:"Retrospective notes"},
  {id:"28.4", wd:27, dl:"Day 28 — Final Handover",                task:"Archive all sprint artefacts — Dockerfile, contracts, test reports, tuning configs",               owner:"Rooban",             pri:"P1", output:"Sprint archive committed to repo"},
];

// Map RAW to add computed fields
const tasks = RAW.map(t => ({
  ...t,
  date: dayDate(t.wd),
  dateStr: fmtDate(dayDate(t.wd)),
  week: t.wd <= 6 ? "Week 1" : t.wd <= 13 ? "Week 2" : t.wd <= 19 ? "Week 3" : "Week 4",
  status: "Not Started",
  notes: "",
  // Legacy compatibility (for exports)
  day: t.dl.split("—")[0].trim(),
  dayLabel: t.dl,
  priority: t.pri,
}));

// ── Minimal XLSX builder (no external lib) ──────────────────
const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const col26 = n => { let s=""; do { s=String.fromCharCode(65+(n%26))+s; n=Math.floor(n/26)-1; } while(n>=0); return s; };

const buildXLSX = (sheets) => {
  // sheets = [{ name, rows: [[cell,...]] }]
  const sharedStrings = []; const ssMap = {};
  const si = v => { const k=String(v); if(ssMap[k]===undefined){ssMap[k]=sharedStrings.length;sharedStrings.push(k);} return ssMap[k]; };

  const wsXmls = sheets.map(({name, rows}) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>`;
    rows.forEach((row, ri) => {
      xml += `<row r="${ri+1}">`;
      row.forEach((cell, ci) => {
        const addr = `${col26(ci)}${ri+1}`;
        const v = String(cell ?? "");
        xml += `<c r="${addr}" t="s"><v>${si(v)}</v></c>`;
      });
      xml += `</row>`;
    });
    xml += `</sheetData></worksheet>`;
    return { name, xml };
  });

  const ssXml = `<?xml version="1.0" encoding="UTF-8"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${sharedStrings.length}" uniqueCount="${sharedStrings.length}">${sharedStrings.map(s=>`<si><t xml:space="preserve">${esc(s)}</t></si>`).join("")}</sst>`;

  const wbXml = `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${wsXmls.map((s,i)=>`<sheet name="${esc(s.name)}" sheetId="${i+1}" r:id="rId${i+2}"/>`).join("")}</sheets></workbook>`;

  const wbRels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>${wsXmls.map((s,i)=>`<Relationship Id="rId${i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${wsXmls.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>`;

  const appRels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  // Build zip using fflate (available via CDN-less inline approach — we base64 encode manually)
  // Since we can't use external libs, output as CSV-in-xlsx wrapper via data URI with XML
  // Instead: encode as a proper flat OPC zip using pure JS
  const files = {
    "[Content_Types].xml": contentTypes,
    "_rels/.rels": appRels,
    "xl/workbook.xml": wbXml,
    "xl/_rels/workbook.xml.rels": wbRels,
    "xl/sharedStrings.xml": ssXml,
    ...Object.fromEntries(wsXmls.map((s,i)=>[`xl/worksheets/sheet${i+1}.xml`, s.xml]))
  };

  // Minimal ZIP writer
  const enc = new TextEncoder();
  const parts = []; const centralDir = []; let offset = 0;

  const crc32 = (buf) => {
    let c = 0xFFFFFFFF;
    const t = new Uint32Array(256);
    for(let i=0;i<256;i++){let v=i;for(let j=0;j<8;j++)v=v&1?(v>>>1)^0xEDB88320:v>>>1;t[i]=v;}
    for(let i=0;i<buf.length;i++)c=t[(c^buf[i])&0xFF]^(c>>>8);
    return (c^0xFFFFFFFF)>>>0;
  };

  const u32le = n => { const b=new Uint8Array(4); new DataView(b.buffer).setUint32(0,n,true); return b; };
  const u16le = n => { const b=new Uint8Array(2); new DataView(b.buffer).setUint16(0,n,true); return b; };

  for(const [name, content] of Object.entries(files)) {
    const nameBuf = enc.encode(name);
    const dataBuf = enc.encode(content);
    const crc = crc32(dataBuf);
    const localHeader = new Uint8Array([
      0x50,0x4B,0x03,0x04, // sig
      20,0, // version
      0,0,  // flags
      0,0,  // compression (stored)
      0,0,0,0, // mod time/date
      ...u32le(crc),
      ...u32le(dataBuf.length),
      ...u32le(dataBuf.length),
      ...u16le(nameBuf.length),
      0,0,  // extra len
      ...nameBuf
    ]);
    const cdEntry = new Uint8Array([
      0x50,0x4B,0x01,0x02,
      20,0,20,0,
      0,0,0,0,0,0,0,0,
      ...u32le(crc),
      ...u32le(dataBuf.length),
      ...u32le(dataBuf.length),
      ...u16le(nameBuf.length),
      0,0,0,0,0,0,0,0,0,0,
      ...u32le(offset),
      ...nameBuf
    ]);
    parts.push(localHeader, dataBuf);
    centralDir.push(cdEntry);
    offset += localHeader.length + dataBuf.length;
  }

  const cdBuf = new Uint8Array(centralDir.reduce((a,b)=>a+b.length,0));
  let cdOff=0; centralDir.forEach(b=>{cdBuf.set(b,cdOff);cdOff+=b.length;});

  const eocd = new Uint8Array([
    0x50,0x4B,0x05,0x06,
    0,0,0,0,
    ...u16le(centralDir.length),
    ...u16le(centralDir.length),
    ...u32le(cdBuf.length),
    ...u32le(offset),
    0,0
  ]);

  const totalSize = parts.reduce((a,b)=>a+b.length,0)+cdBuf.length+eocd.length;
  const zip = new Uint8Array(totalSize);
  let pos=0;
  parts.forEach(p=>{zip.set(p,pos);pos+=p.length;});
  zip.set(cdBuf,pos); pos+=cdBuf.length;
  zip.set(eocd,pos);

  const b64 = btoa(String.fromCharCode(...zip));
  const a = document.createElement("a");
  a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`;
  a.download = "Azure_Sprint_Plan.xlsx";
  a.click();
};

const exportXLSX = (rows) => {
  const headers = ["Week","Day","Task ID","Task Description","Owner","Priority","Output / Deliverable","Status","Notes"];
  const allRows = [headers, ...rows.map(t=>[t.week,t.day,t.id,t.task,t.owner,t.priority,t.output,t.status,t.notes||""])];

  const byWeek = (wk) => {
    const h = ["Day","Task ID","Task Description","Owner","Priority","Output / Deliverable","Status","Notes"];
    return [h, ...rows.filter(t=>t.week===wk).map(t=>[t.day,t.id,t.task,t.owner,t.priority,t.output,t.status,t.notes||""])];
  };

  const summary = [
    ["Medical Label Verification Platform — Azure Sprint Plan"],
    [""],
    ["Team",""],
    ["Rooban","Azure Infra, CosmosDB, GitHub, Backend API"],
    ["Shrvaani + Athmika","CV/OCR/Barcodes, All UI Tabs, Report Templates"],
    ["Dhivyashree","Symbol Library, Rule Engine, Proof Logic, Verdicts"],
    [""],
    ["Total Tasks", rows.length],
    ["Week 1 Tasks", rows.filter(t=>t.week==="Week 1").length],
    ["Week 2 Tasks", rows.filter(t=>t.week==="Week 2").length],
    ["Week 3 Tasks", rows.filter(t=>t.week==="Week 3").length],
    ["Week 4 Tasks", rows.filter(t=>t.week==="Week 4").length],
    ["P0 Tasks", rows.filter(t=>t.priority==="P0").length],
    ["P1 Tasks", rows.filter(t=>t.priority==="P1").length],
    ["P2 Tasks", rows.filter(t=>t.priority==="P2").length],
  ];

  buildXLSX([
    { name:"Summary", rows: summary },
    { name:"All Tasks", rows: allRows },
    { name:"Week 1", rows: byWeek("Week 1") },
    { name:"Week 2", rows: byWeek("Week 2") },
    { name:"Week 3", rows: byWeek("Week 3") },
    { name:"Week 4", rows: byWeek("Week 4") },
  ]);
};

export default function App() {
  const [rows, setRows] = useState(tasks);
  const [fWeek, setFWeek] = useState("All");
  const [fOwner, setFOwner] = useState("All");
  const [fPri, setFPri] = useState("All");
  const [fStatus, setFStatus] = useState("All");
  const [tab, setTab] = useState("timeline");
  const [editNote, setEditNote] = useState(null);

  const upd = (id, f, v) => setRows(p => p.map(t => t.id===id ? {...t,[f]:v} : t));

  const owners = ["Rooban","Shrvaani+Athmika","Dhivyashree","All"];

  const filtered = rows.filter(t =>
    (fWeek==="All" || t.week===fWeek) &&
    (fOwner==="All" || t.owner===fOwner) &&
    (fPri==="All" || t.priority===fPri) &&
    (fStatus==="All" || t.status===fStatus)
  );

  const stats = {
    total: rows.length,
    done: rows.filter(t=>t.status==="Done").length,
    ip: rows.filter(t=>t.status==="In Progress").length,
    bl: rows.filter(t=>t.status==="Blocked").length,
    ns: rows.filter(t=>t.status==="Not Started").length,
  };
  const pct = Math.round(stats.done/stats.total*100);

  // owner task count breakdown
  const ownerCounts = {};
  owners.forEach(o => { ownerCounts[o] = rows.filter(t=>t.owner===o).length; });

  const sel = { fontSize:12, border:"1px solid #e2e8f0", borderRadius:4, padding:"4px 8px", background:"white", cursor:"pointer" };

  const weekColors = { "Week 1":"#1e40af","Week 2":"#6d28d9","Week 3":"#b45309","Week 4":"#065f46" };

  return (
    <div style={{fontFamily:"system-ui,sans-serif",fontSize:13,background:"#f8fafc",minHeight:"100vh"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",padding:"16px 24px",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:16,fontWeight:700}}>🏥 Medical Label Verification Platform</div>
            <div style={{fontSize:12,opacity:0.8,marginTop:2}}>4-Week Sprint · Azure VM + CosmosDB · Rooban · Shrvaani+Athmika · Dhivyashree</div>
          </div>
          <button onClick={()=>exportXLSX(rows)} style={{background:"#16a34a",color:"white",border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontWeight:600,fontSize:13}}>
            ⬇ Export XLSX
          </button>
        </div>

        {/* Progress */}
        <div style={{marginTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
            <span>Overall Progress</span><span>{stats.done}/{stats.total} tasks · {pct}%</span>
          </div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:4,height:6}}>
            <div style={{background:"#4ade80",width:`${pct}%`,height:"100%",borderRadius:4,transition:"width 0.3s"}}/>
          </div>
        </div>

        {/* Status pills */}
        <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
          {[["Done",stats.done,"#4ade80"],["In Progress",stats.ip,"#60a5fa"],["Blocked",stats.bl,"#f87171"],["Not Started",stats.ns,"#94a3b8"]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.1)",borderRadius:6,padding:"4px 10px",fontSize:12}}>
              <span style={{color:c,fontWeight:700}}>{v}</span> <span style={{opacity:0.8}}>{l}</span>
            </div>
          ))}
        </div>

        {/* Owner workload */}
        <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
          {[["Rooban","#dbeafe","#1e40af"],["Shrvaani+Athmika","#fce7f3","#9d174d"],["Dhivyashree","#fef9c3","#854d0e"],["All","#f3e8ff","#6d28d9"]].map(([n,bg,txt])=>(
            <div key={n} style={{background:bg,borderRadius:6,padding:"3px 10px",fontSize:11,color:txt,fontWeight:600}}>
              {n}: {ownerCounts[n]||0} tasks
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:"white",borderBottom:"1px solid #e2e8f0",padding:"0 24px"}}>
        {[["timeline","📅 Timeline"],["plan","📋 Sprint Plan"],["board","📊 Board View"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 18px",border:"none",background:"none",cursor:"pointer",fontWeight:tab===id?700:400,color:tab===id?"#0ea5e9":"#64748b",borderBottom:tab===id?"2px solid #0ea5e9":"2px solid transparent",fontSize:13}}>
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,padding:"10px 24px",background:"white",borderBottom:"1px solid #e2e8f0",flexWrap:"wrap",alignItems:"center"}}>
        <span style={{color:"#64748b",fontSize:12}}>Filter:</span>
        <select style={sel} value={fWeek} onChange={e=>setFWeek(e.target.value)}>
          <option>All</option>{["Week 1","Week 2","Week 3","Week 4"].map(w=><option key={w}>{w}</option>)}
        </select>
        <select style={sel} value={fOwner} onChange={e=>setFOwner(e.target.value)}>
          <option>All</option>{owners.map(o=><option key={o}>{o}</option>)}
        </select>
        <select style={sel} value={fPri} onChange={e=>setFPri(e.target.value)}>
          <option>All</option>{["P0","P1","P2"].map(p=><option key={p}>{p}</option>)}
        </select>
        <select style={sel} value={fStatus} onChange={e=>setFStatus(e.target.value)}>
          <option>All</option>{Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
        </select>
        <span style={{color:"#94a3b8",fontSize:11}}>{filtered.length} tasks shown</span>
      </div>

      <div style={{padding:"16px 24px"}}>

        {/* ── TIMELINE VIEW ── */}
        {tab==="timeline" && (
          <div>
            <h2 style={{fontSize:16,fontWeight:700,marginBottom:16,color:"#1e293b"}}>📅 Sprint Timeline</h2>
            
            {/* Week Bands */}
            <div style={{marginBottom:24}}>
              <h3 style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8}}>Week Overview</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
                {weekRanges.map(w=>{
                  const weekTasks = rows.filter(t=>t.week===w.week);
                  return (
                    <div key={w.week} style={{background:"white",border:`2px solid ${w.color}`,borderRadius:8,padding:12}}>
                      <div style={{background:w.color,color:"white",padding:"6px 8px",borderRadius:4,marginBottom:8,fontWeight:700,fontSize:12}}>{w.week}</div>
                      <div style={{fontSize:11,color:"#475569",marginBottom:6}}>{w.label}</div>
                      <div style={{fontSize:10,color:"#94a3b8"}}>
                        {fmtShort(w.start)} – {fmtShort(w.end)}<br/>{weekTasks.length} tasks
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Milestones */}
            <div style={{marginBottom:24}}>
              <h3 style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8}}>Key Milestones</h3>
              <div style={{background:"white",borderRadius:8,border:"1px solid #e2e8f0",padding:12}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
                  {milestones.map((m,i)=>(
                    <div key={i} style={{
                      padding:10,
                      borderRadius:6,
                      background:m.highlight?"#fef3c7":"#f8fafc",
                      border:m.highlight?"2px solid #f59e0b":"1px solid #e2e8f0",
                      fontWeight:m.highlight?700:400
                    }}>
                      <div style={{fontSize:11,color:m.highlight?"#b45309":"#475569"}}>{m.label}</div>
                      <div style={{fontSize:10,color:"#94a3b8",marginTop:4}}>
                        {fmtDate(m.date)} · {m.week}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Go-Live & Handover Callout */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
              <div style={{background:"#065f46",color:"white",borderRadius:8,padding:16}}>
                <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>🚀 Go-Live</div>
                <div style={{fontSize:13,marginBottom:8}}>Production Delivery</div>
                <div style={{fontSize:12,opacity:0.9}}>{fmtDate(dayDate(20))}</div>
              </div>
              <div style={{background:"#1e40af",color:"white",borderRadius:8,padding:16}}>
                <div style={{fontSize:18,fontWeight:700,marginBottom:4}}>🏁 Final Handover</div>
                <div style={{fontSize:13,marginBottom:8}}>Project Complete</div>
                <div style={{fontSize:12,opacity:0.9}}>{fmtDate(dayDate(27))}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── PLAN VIEW ── */}
        {tab==="plan" && ["Week 1","Week 2","Week 3","Week 4"].map(wk=>{
          const wRows = filtered.filter(t=>t.week===wk);
          if (!wRows.length) return null;
          const dayGroups = {};
          wRows.forEach(t=>{ if(!dayGroups[t.day]) dayGroups[t.day]=[]; dayGroups[t.day].push(t); });
          const wc = weekColors[wk];
          return (
            <div key={wk} style={{marginBottom:24}}>
              <div style={{background:wc,color:"white",padding:"8px 14px",borderRadius:"8px 8px 0 0",fontWeight:700,fontSize:14}}>
                {wk} — {wk==="Week 1"?"Foundation & Parallel Build":wk==="Week 2"?"Engine Integration + Proof Logic":wk==="Week 3"?"Hardening + Systematic Testing":"Delivery, Hardening & Handover"}
              </div>
              {Object.entries(dayGroups).map(([day,dayTasks])=>{
                const dl = dayTasks[0]?.dayLabel || day;
                return (
                  <div key={day} style={{marginBottom:2}}>
                    <div style={{background:"#f1f5f9",padding:"5px 14px",fontSize:12,fontWeight:600,color:"#475569",borderLeft:`3px solid ${wc}`}}>{dl}</div>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{background:"#f8fafc",fontSize:11,color:"#64748b"}}>
                          {["ID","Task","Owner","Pri","Output","Status","Notes"].map((h,i)=>(
                            <th key={h} style={{padding:"4px 8px",textAlign:"left",borderBottom:"1px solid #e2e8f0",width:[40,undefined,140,44,190,140,140][i]}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dayTasks.map(t=>{
                          const sc = STATUS_COLORS[t.status];
                          return (
                            <tr key={t.id} style={{background:"white",borderBottom:"1px solid #f1f5f9"}}>
                              <td style={{padding:"5px 8px",color:"#94a3b8",fontWeight:600,fontSize:11}}>{t.id}</td>
                              <td style={{padding:"5px 8px",fontSize:12}}>{t.task}</td>
                              <td style={{padding:"5px 8px"}}>
                                <span style={{background:oc(t.owner),borderRadius:4,padding:"2px 6px",fontSize:11,fontWeight:600}}>{t.owner}</span>
                              </td>
                              <td style={{padding:"5px 8px"}}>
                                <span style={{background:t.priority==="P0"?"#fef2f2":t.priority==="P1"?"#fff7ed":"#f0fdf4",color:t.priority==="P0"?"#dc2626":t.priority==="P1"?"#ea580c":"#16a34a",borderRadius:4,padding:"2px 5px",fontSize:10,fontWeight:700}}>{t.priority}</span>
                              </td>
                              <td style={{padding:"5px 8px",fontSize:11,color:"#475569"}}>{t.output}</td>
                              <td style={{padding:"5px 8px"}}>
                                <select value={t.status} onChange={e=>upd(t.id,"status",e.target.value)}
                                  style={{fontSize:11,border:`1px solid ${sc.border}`,borderRadius:4,padding:"2px 4px",background:sc.bg,color:sc.text,cursor:"pointer"}}>
                                  {Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
                                </select>
                              </td>
                              <td style={{padding:"5px 8px"}}>
                                {editNote===t.id
                                  ? <input autoFocus value={t.notes} onChange={e=>upd(t.id,"notes",e.target.value)} onBlur={()=>setEditNote(null)} style={{width:"100%",fontSize:11,border:"1px solid #93c5fd",borderRadius:4,padding:"2px 4px"}}/>
                                  : <span onClick={()=>setEditNote(t.id)} style={{fontSize:11,color:t.notes?"#0ea5e9":"#cbd5e1",cursor:"pointer"}}>{t.notes||"＋ note"}</span>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── BOARD VIEW ── */}
        {tab==="board" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {Object.keys(STATUS_COLORS).map(status=>{
              const sc = STATUS_COLORS[status];
              const col = filtered.filter(t=>t.status===status);
              return (
                <div key={status} style={{background:"white",borderRadius:8,border:`1px solid ${sc.border}`,overflow:"hidden"}}>
                  <div style={{background:sc.bg,padding:"8px 12px",borderBottom:`1px solid ${sc.border}`,fontWeight:700,fontSize:12,color:sc.text,display:"flex",justifyContent:"space-between"}}>
                    <span>{status}</span><span style={{background:sc.border,borderRadius:10,padding:"1px 7px"}}>{col.length}</span>
                  </div>
                  <div style={{padding:8,maxHeight:500,overflowY:"auto"}}>
                    {col.map(t=>(
                      <div key={t.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 8px",marginBottom:6}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{t.id}</span>
                          <span style={{background:oc(t.owner),borderRadius:3,padding:"1px 5px",fontSize:10,fontWeight:600}}>{t.owner}</span>
                        </div>
                        <div style={{fontSize:11,color:"#374151",lineHeight:1.4}}>{t.task}</div>
                        <div style={{marginTop:4,display:"flex",gap:4}}>
                          <span style={{fontSize:10,color:"#64748b"}}>{t.week}</span>
                          <span style={{background:t.priority==="P0"?"#fef2f2":t.priority==="P1"?"#fff7ed":"#f0fdf4",color:t.priority==="P0"?"#dc2626":t.priority==="P1"?"#ea580c":"#16a34a",borderRadius:3,padding:"0 4px",fontSize:10,fontWeight:700}}>{t.priority}</span>
                        </div>
                      </div>
                    ))}
                    {!col.length && <div style={{color:"#cbd5e1",fontSize:12,textAlign:"center",padding:16}}>No tasks</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
