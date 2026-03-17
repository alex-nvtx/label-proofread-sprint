import { useState, useEffect } from "react";

const START = new Date(2026, 2, 16);
const addWorkdays = (from, n) => {
  let d = new Date(from), added = 0;
  while (added < n) { d.setDate(d.getDate()+1); if(d.getDay()!==0&&d.getDay()!==6) added++; }
  return d;
};
const fmtDate = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtShort = d => d.toLocaleDateString("en-GB",{day:"2-digit",month:"short"});
const dayDate = idx => idx===0 ? new Date(START) : addWorkdays(START, idx);
const today = new Date();

const weekRanges = [
  { week:"Week 1", label:"Foundation & Parallel Build",      start:dayDate(0),  end:dayDate(4),  color:"#1e40af" },
  { week:"Week 2", label:"Engine Integration + Proof Logic", start:dayDate(7),  end:dayDate(11), color:"#6d28d9" },
  { week:"Week 3", label:"Hardening + Systematic Testing",   start:dayDate(14), end:dayDate(18), color:"#b45309" },
  { week:"Week 4", label:"Delivery, Hardening & Handover",   start:dayDate(21), end:dayDate(27), color:"#065f46" },
];

const milestones = [
  { label:"🔒 Interface Contracts Frozen",   date:dayDate(2),  week:"Week 1", highlight:false },
  { label:"✅ Integration Checkpoint #1",     date:dayDate(4),  week:"Week 1", highlight:false },
  { label:"✅ Integration Checkpoint #2",     date:dayDate(11), week:"Week 2", highlight:false },
  { label:"🧪 Systematic Testing Begins",     date:dayDate(14), week:"Week 3", highlight:false },
  { label:"📦 Production Docker Build",       date:dayDate(18), week:"Week 3", highlight:false },
  { label:"🚀 Go-Live (Production Delivery)", date:dayDate(20), week:"Week 4", highlight:true  },
  { label:"🔨 P0/P1 Punch List Fixes",        date:dayDate(21), week:"Week 4", highlight:false },
  { label:"🧾 UAT Sessions",                  date:dayDate(23), week:"Week 4", highlight:false },
  { label:"📘 Handover Docs Complete",        date:dayDate(25), week:"Week 4", highlight:false },
  { label:"🏁 Final Handover & Sign-off",     date:dayDate(27), week:"Week 4", highlight:true  },
];

const STATUS_COLORS = {
  "Not Started":{ bg:"#f1f5f9", text:"#64748b", border:"#cbd5e1" },
  "In Progress": { bg:"#eff6ff", text:"#1d4ed8", border:"#93c5fd" },
  "Done":        { bg:"#f0fdf4", text:"#15803d", border:"#86efac" },
  "Blocked":     { bg:"#fef2f2", text:"#dc2626", border:"#fca5a5" },
};
const OWNER_COLORS = {
  "Rooban":"#dbeafe","Shrvaani+Athmika":"#fce7f3",
  "Dhivyashree":"#fef9c3","All":"#f3e8ff","Rooban+Dhivyashree":"#dcfce7",
};
const oc = o => { for(const k of Object.keys(OWNER_COLORS)) if(o?.startsWith(k)) return OWNER_COLORS[k]; return "#f8fafc"; };
const weekColors = {"Week 1":"#1e40af","Week 2":"#6d28d9","Week 3":"#b45309","Week 4":"#065f46"};
const owners = ["Rooban","Shrvaani+Athmika","Dhivyashree","All","Rooban+Dhivyashree"];
const DEPLOYED_LINKS = [
  { label:"Sprint Tracker",   url:"https://label-proofread-sprint.vercel.app/", color:"#1e40af" },
  { label:"Proofing Form",    url:"https://proofing-request-form.lovable.app/", color:"#6d28d9" },
  { label:"Report Template",  url:"https://label-comparator-reports.vercel.app/", color:"#065f46" },
];

const RAW = [
  {id:"1.1",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"Provision Azure VM (Standard D4s v3) · configure ports · install Docker",                              owner:"Rooban",            pri:"P0", output:"Azure VM live"},
  {id:"1.2",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"Write Dockerfile — all system libs (tesseract, libzbar0, libdmtx0b, libGL, poppler)",                   owner:"Rooban",            pri:"P0", output:"Dockerfile + docker-compose.yml"},
  {id:"1.3",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"Set up GitHub repo · branch strategy · .env template · Azure Container Registry",                       owner:"Rooban",            pri:"P0", output:"Repo live + ACR configured"},
  {id:"1.4",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"Ingest real label images · assess resolution, format, scan quality",                                     owner:"Shrvaani+Athmika",  pri:"P0", output:"Label quality report (1 page)"},
  {id:"1.5",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"Review PRD attribute list · flag ambiguous verification methods · symbol library inventory",             owner:"Dhivyashree",       pri:"P1", output:"Annotated PRD notes + symbol list draft"},
  {id:"1.6",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"STANDUP EOD: Azure VM live, all team can run Docker locally ✅",                                         owner:"All",               pri:"P0", output:"Kickoff confirmed"},
  {id:"1.7",wd:0, dl:"Day 1 — Kickoff + Infrastructure",       task:"Audit all 70+ PDF labels — inventory every unique symbol with name + ISO 15223 reference",              owner:"Rooban",            pri:"P0", output:"Symbol inventory spreadsheet"},
  {id:"2.1",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Implement schema.py — 130+ attributes with types, validation rules, verification_method",               owner:"Rooban+Dhivyashree",pri:"P0", output:"form/schema.py"},
  {id:"2.2",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Implement Pydantic models (models.py) for form data + CV findings + proof results",                     owner:"Dhivyashree",       pri:"P0", output:"form/models.py"},
  {id:"2.3",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"MongoDB Atlas setup (Azure region) · create all 5 collections · implement indexes per PRD §7.4",        owner:"Rooban",            pri:"P0", output:"MongoDB Atlas live + db/mongo_client.py"},
  {id:"2.4",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Add attribute_definitions collection · seed with 130+ attributes",                                      owner:"Rooban",            pri:"P0", output:"Collection seeded"},
  {id:"2.5",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Begin image aligner (aligner.py) — SIFT + RANSAC homography",                                           owner:"Shrvaani+Athmika",  pri:"P1", output:"Draft core/aligner.py"},
  {id:"2.6",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Set up pytesseract + easyocr in Docker · smoke test on real labels",                                    owner:"Shrvaani+Athmika",  pri:"P0", output:"OCR working in container"},
  {id:"2.7",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Begin Streamlit UI shell — 5 tabs, navigation, file upload components",                                 owner:"Shrvaani+Athmika",  pri:"P0", output:"app.py skeleton"},
  {id:"2.8",wd:1, dl:"Day 2 — Schema + Form Foundation",       task:"Extract + clean all custom symbols from PDFs via PyMuPDF at 4x resolution · cross-ref ISO 15223",      owner:"Rooban",            pri:"P0", output:"symbols/ folder populated with clean PNGs"},
  {id:"3.1",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"⚠ INTERFACE CONTRACT REVIEW (10am) — sign off all 3 JSON contracts with stakeholder",                  owner:"All",               pri:"P0", output:"Contracts FROZEN ✅"},
  {id:"3.2",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"Implement dynamic form renderer (renderer.py) — attribute picker + edit form (Step 1+2)",               owner:"Shrvaani+Athmika",  pri:"P0", output:"Step 1 + Step 2 of form flow"},
  {id:"3.3",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"Begin symbol detector — symbol library PNG setup + SIFT keypoint matching",                             owner:"Dhivyashree",       pri:"P1", output:"core/detector.py draft + symbols/ folder"},
  {id:"3.4",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"Begin OCR pipeline — CLAHE preprocessing + pytesseract primary + easyocr fallback",                    owner:"Shrvaani+Athmika",  pri:"P1", output:"modules/text_extractor.py draft"},
  {id:"3.5",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"Begin attribute rule definitions (rules.py) — text attributes first (20 rules)",                       owner:"Dhivyashree",       pri:"P1", output:"proofing/rules.py draft — 20 rules"},
  {id:"3.6",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"Azure Blob Storage setup for label image files + report outputs (docx/pdf/json)",                      owner:"Rooban",            pri:"P0", output:"Blob storage containers configured"},
  {id:"3.7",wd:2, dl:"Day 3 — Interface Contracts Frozen",     task:"Run albumentations augmentation pipeline — generate 8 variants per symbol · commit to repo",           owner:"Dhivyashree",       pri:"P0", output:"Augmented symbol variants in symbols/aug/"},
  {id:"4.1",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"Form validation rules (validator.py) — all 8 rules from PRD §3.4",                                     owner:"Rooban",            pri:"P0", output:"form/validator.py"},
  {id:"4.2",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"Form state auto-save to session storage · confirm/preview step (Step 3)",                              owner:"Shrvaani+Athmika",  pri:"P0", output:"Step 3 of form flow complete"},
  {id:"4.3",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"Symbol detector — add ORB fallback + confidence-weighted NMS",                                          owner:"Dhivyashree",       pri:"P1", output:"Detector handles 3 strategies"},
  {id:"4.4",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"SSIM graphics diff module — contour analysis on aligned images",                                        owner:"Shrvaani+Athmika",  pri:"P1", output:"modules/graphics_diff.py draft"},
  {id:"4.5",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"Barcode waterfall — pyzbar → zxingcpp → pylibdmtx → OpenCV-QR",                                       owner:"Shrvaani+Athmika",  pri:"P0", output:"modules/barcode_detector.py"},
  {id:"4.6",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"Text diff engine — fuzzy match (SequenceMatcher) + old/new value comparison",                          owner:"Shrvaani+Athmika",  pri:"P0", output:"modules/text_extractor.py complete"},
  {id:"4.7",wd:3, dl:"Day 4 — Form Complete + CV Building",    task:"Rule definitions — symbol attributes (15 rules) + barcode attributes (14 rules)",                     owner:"Dhivyashree",       pri:"P1", output:"49 rules total in rules.py"},
  {id:"5.1",wd:4, dl:"Day 5 — Integration Checkpoint #1",      task:"Integration test: Form submission → produces valid form_submission.json",                               owner:"Rooban",            pri:"P0", output:"Contract 1 validated ✅"},
  {id:"5.2",wd:4, dl:"Day 5 — Integration Checkpoint #1",      task:"Run symbol detector + OCR + barcode decoder on real labels — collect raw findings",                     owner:"Shrvaani+Athmika",  pri:"P0", output:"Raw findings JSON per module"},
  {id:"5.3",wd:4, dl:"Day 5 — Integration Checkpoint #1",      task:"Gap check: Compare raw findings against Contract 2 schema — fix field mismatches",                     owner:"Shrvaani+Athmika",  pri:"P0", output:"Contract 2 alignment confirmed"},
  {id:"5.4",wd:4, dl:"Day 5 — Integration Checkpoint #1",      task:"Image aligner complete — homography corrects skew on real label scans",                                 owner:"Shrvaani+Athmika",  pri:"P0", output:"core/aligner.py complete"},
  {id:"5.5",wd:4, dl:"Day 5 — Integration Checkpoint #1",      task:"Begin proof engine skeleton — attribute router + matcher stubs",                                        owner:"Dhivyashree",       pri:"P1", output:"proofing/engine.py scaffold"},
  {id:"5.6",wd:4, dl:"Day 5 — Integration Checkpoint #1",      task:"STAKEHOLDER REVIEW: Demo form UI + raw CV findings on real label",                                      owner:"All",               pri:"P0", output:"Week 1 milestone sign-off"},
  {id:"6.1",wd:5, dl:"Days 6–7 — Buffer + Catch-up",           task:"MongoDB Atlas CRUD complete · session auto-save · Azure Key Vault for secrets",                        owner:"Rooban",            pri:"P0", output:"db/mongo_client.py complete"},
  {id:"6.2",wd:5, dl:"Days 6–7 — Buffer + Catch-up",           task:"Symbol comparator — diff logic between base and child detection sets",                                  owner:"Dhivyashree",       pri:"P1", output:"modules/symbol_comparator.py"},
  {id:"6.3",wd:5, dl:"Days 6–7 — Buffer + Catch-up",           task:"GS1 Application Identifier parser for barcode fields",                                                  owner:"Shrvaani+Athmika",  pri:"P0", output:"GS1 AI parser module"},
  {id:"6.4",wd:5, dl:"Days 6–7 — Buffer + Catch-up",           task:"Attribute-to-CV-finding matcher (matchers.py) — exact, fuzzy, symbol normalisation, GS1 AI",           owner:"Dhivyashree",       pri:"P0", output:"proofing/matchers.py"},
  {id:"6.5",wd:6, dl:"Days 6–7 — Buffer + Catch-up",           task:"WEEKEND GATE: All Contract 1 + Contract 2 outputs producing valid JSON ✅",                             owner:"All",               pri:"P0", output:"Gate confirmed before Week 2"},
  {id:"8.1",wd:7, dl:"Day 8 — Proof Engine Core",              task:"Proof engine pipeline steps 1–4: routing, candidate matching, old-value check, new-value verify",      owner:"Dhivyashree",       pri:"P0", output:"Engine processes text attributes end-to-end"},
  {id:"8.2",wd:7, dl:"Day 8 — Proof Engine Core",              task:"Wire CV module outputs into unified cv_findings.json aggregator",                                       owner:"Shrvaani+Athmika",  pri:"P0", output:"Single findings file from all 4 modules"},
  {id:"8.3",wd:7, dl:"Day 8 — Proof Engine Core",              task:"MongoDB Atlas proofing_history schema — add cv_findings, report refs, file hashes",                    owner:"Rooban",            pri:"P0", output:"Schema matches PRD §7.1 exactly"},
  {id:"8.4",wd:7, dl:"Day 8 — Proof Engine Core",              task:"SHA-256 file hashing at image ingestion · store hash in MongoDB session document",                     owner:"Rooban",            pri:"P1", output:"Audit trail integrity implemented"},
  {id:"9.1",wd:8, dl:"Day 9 — Rules + Verdict Logic",          task:"Proof engine pipeline steps 5–8: positional check, completeness, threshold eval, verdict assignment",  owner:"Dhivyashree",       pri:"P0", output:"All 4 verdict types working"},
  {id:"9.2",wd:8, dl:"Day 9 — Rules + Verdict Logic",          task:"Remaining rule definitions — graphic/logo (10) + compliance (10) + custom attributes",                 owner:"Dhivyashree",       pri:"P0", output:"All 130+ attributes have rules"},
  {id:"9.3",wd:8, dl:"Day 9 — Rules + Verdict Logic",          task:"Integration test: Feed real label CV findings into proof engine — check verdicts",                     owner:"Shrvaani+Athmika",  pri:"P0", output:"First real end-to-end verdict"},
  {id:"9.4",wd:8, dl:"Day 9 — Rules + Verdict Logic",          task:"Annotated visual diff — colour-coded bounding boxes on side-by-side image",                            owner:"Shrvaani+Athmika",  pri:"P1", output:"reports/annotator.py"},
  {id:"10.1",wd:9,dl:"Day 10 — Unintended Change + Proof UI",  task:"Unintended change classifier — all 5 classification rules from PRD §5.5",                              owner:"Dhivyashree",       pri:"P0", output:"proofing/engine.py complete"},
  {id:"10.2",wd:9,dl:"Day 10 — Unintended Change + Proof UI",  task:"Proof Engine tab UI — per-attribute verdict table, evidence details, unintended changes",              owner:"Shrvaani+Athmika",  pri:"P0", output:"Tab 3 (✅ Proof Engine) complete"},
  {id:"10.3",wd:9,dl:"Day 10 — Unintended Change + Proof UI",  task:"CV Inspection tab UI — upload, run, annotated diff display, per-module results tabs",                  owner:"Shrvaani+Athmika",  pri:"P0", output:"Tab 2 (🔍 CV Inspection) complete"},
  {id:"10.4",wd:9,dl:"Day 10 — Unintended Change + Proof UI",  task:"Tune CV thresholds on real labels — symbol confidence floors, OCR similarity thresholds",              owner:"Shrvaani+Athmika",  pri:"P1", output:"Threshold config file"},
  {id:"11.1",wd:10,dl:"Day 11 — Report Builder",               task:"Report builder sections 1–5: cover, summary, attribute table, missing cards, incomplete cards",        owner:"Dhivyashree",       pri:"P0", output:"reports/report_builder.py draft"},
  {id:"11.2",wd:10,dl:"Day 11 — Report Builder",               task:"Report builder sections 6–11: unintended, symbol table, OCR, barcode, visual diff, audit trail",       owner:"Dhivyashree",       pri:"P0", output:"Full report structure complete"},
  {id:"11.3",wd:10,dl:"Day 11 — Report Builder",               task:"Word (.docx) report template design + tables + annotated image embed",                                  owner:"Shrvaani+Athmika",  pri:"P1", output:"docx template done"},
  {id:"11.4",wd:10,dl:"Day 11 — Report Builder",               task:"Proof History tab UI — search/filter/sort table, session detail view",                                  owner:"Shrvaani+Athmika",  pri:"P1", output:"Tab 5 (🗄️ Proof History) draft"},
  {id:"11.5",wd:10,dl:"Day 11 — Report Builder",               task:"Azure backend API routes — session save, report retrieve, history query endpoints",                    owner:"Rooban",            pri:"P0", output:"Backend API routes live"},
  {id:"12.1",wd:11,dl:"Day 12 — Integration Checkpoint #2",    task:"Full pipeline run on real label: Form → CV → Proof Engine → Report → MongoDB Atlas",                  owner:"All",               pri:"P0", output:"First complete end-to-end run"},
  {id:"12.2",wd:11,dl:"Day 12 — Integration Checkpoint #2",    task:"STAKEHOLDER REVIEW: Walk through full pipeline output — verdict accuracy check",                       owner:"All",               pri:"P0", output:"Feedback list captured"},
  {id:"12.3",wd:11,dl:"Day 12 — Integration Checkpoint #2",    task:"Identify top 5 verdict errors — root cause (CV threshold? Rule logic? Matcher?)",                     owner:"Dhivyashree",       pri:"P0", output:"Bug/tuning list"},
  {id:"12.4",wd:11,dl:"Day 12 — Integration Checkpoint #2",    task:"PDF export via ReportLab/WeasyPrint · upload to Azure Blob · return download URL",                    owner:"Rooban",            pri:"P1", output:".pdf export + Blob URL working"},
  {id:"13.1",wd:12,dl:"Days 13–14 — Fixes + Robustness",       task:"History tab complete — trend chart (Plotly), CSV export, session diff view",                          owner:"Shrvaani+Athmika",  pri:"P1", output:"Tab 5 fully functional"},
  {id:"13.2",wd:12,dl:"Days 13–14 — Fixes + Robustness",       task:"Handle CV edge cases — low-res scans, partial label images, rotated labels",                          owner:"Shrvaani+Athmika",  pri:"P1", output:"Robust CV on edge cases"},
  {id:"13.3",wd:12,dl:"Days 13–14 — Fixes + Robustness",       task:"OCR edge cases — small fonts, colour backgrounds, multilingual text",                                  owner:"Shrvaani+Athmika",  pri:"P1", output:"OCR hardened"},
  {id:"13.4",wd:12,dl:"Days 13–14 — Fixes + Robustness",       task:"Fix top verdict errors · JSON export · PASS/CONDITIONAL/FAIL overall logic",                          owner:"Dhivyashree",       pri:"P0", output:"Overall verdict logic correct"},
  {id:"13.5",wd:13,dl:"Days 13–14 — Fixes + Robustness",       task:"Auth stub — Azure AD role field on user documents, basic session login",                               owner:"Rooban",            pri:"P2", output:"Role-based access stub in place"},
  {id:"T1",  wd:14,dl:"Days 15–16 — Systematic Testing",       task:"Test all 8 form validation rules with edge case inputs",                                               owner:"Shrvaani+Athmika",  pri:"P0", output:"Validation test report"},
  {id:"T2",  wd:14,dl:"Days 15–16 — Systematic Testing",       task:"Test all 5 verdict types across 10+ real label pairs",                                                 owner:"Dhivyashree",       pri:"P0", output:"Verdict accuracy matrix"},
  {id:"T3",  wd:14,dl:"Days 15–16 — Systematic Testing",       task:"Test all 5 unintended change classifications",                                                         owner:"Dhivyashree",       pri:"P0", output:"Classification test report"},
  {id:"T4",  wd:15,dl:"Days 15–16 — Systematic Testing",       task:"Test barcode grade thresholds — Grade A/B/C/D across real barcodes",                                   owner:"Shrvaani+Athmika",  pri:"P0", output:"Barcode test report"},
  {id:"T5",  wd:15,dl:"Days 15–16 — Systematic Testing",       task:"Performance test — CV < 45s, proof engine < 10s, report < 15s on Azure VM",                           owner:"Rooban",            pri:"P0", output:"Performance benchmark"},
  {id:"T6",  wd:15,dl:"Days 15–16 — Systematic Testing",       task:"MongoDB Atlas write/query latency under 10 concurrent sessions",                                      owner:"Rooban",            pri:"P1", output:"Load test results"},
  {id:"17.1",wd:16,dl:"Days 17–18 — Tuning + Bug Fixes",       task:"Address all test failures from Days 15–16",                                                           owner:"All",               pri:"P0", output:"Zero P0 test failures"},
  {id:"17.2",wd:16,dl:"Days 17–18 — Tuning + Bug Fixes",       task:"Tune SIFT/ORB confidence thresholds per symbol type using real label results",                        owner:"Dhivyashree",       pri:"P1", output:"Updated threshold config"},
  {id:"17.3",wd:16,dl:"Days 17–18 — Tuning + Bug Fixes",       task:"Tune OCR fuzzy match thresholds (default 0.90) per text region type",                                 owner:"Shrvaani+Athmika",  pri:"P1", output:"Updated OCR config"},
  {id:"17.4",wd:17,dl:"Days 17–18 — Tuning + Bug Fixes",       task:"Fix any MongoDB Atlas schema gaps discovered during full pipeline runs",                              owner:"Rooban",            pri:"P0", output:"Schema finalized"},
  {id:"17.5",wd:17,dl:"Days 17–18 — Tuning + Bug Fixes",       task:"Final annotated diff visual polish — directional arrows for repositioned elements",                   owner:"Shrvaani+Athmika",  pri:"P2", output:"Annotated diff polished"},
  {id:"19.1",wd:18,dl:"Day 19 — Pre-Delivery Integration Run", task:"Run 5 complete proofing sessions on different label change scenarios",                                owner:"All",               pri:"P0", output:"5 full session records in MongoDB Atlas"},
  {id:"19.2",wd:18,dl:"Day 19 — Pre-Delivery Integration Run", task:"Verify all 5 MongoDB Atlas collections populated correctly",                                          owner:"Rooban",            pri:"P0", output:"DB integrity confirmed"},
  {id:"19.3",wd:18,dl:"Day 19 — Pre-Delivery Integration Run", task:"Download all export formats (docx, pdf, json, csv) — visual QA",                                    owner:"All",               pri:"P0", output:"Export QA sign-off"},
  {id:"19.4",wd:18,dl:"Day 19 — Pre-Delivery Integration Run", task:"Docker image final build · push to Azure Container Registry · no dev deps",                         owner:"Rooban",            pri:"P0", output:"Production Docker image in ACR"},
  {id:"20.1",wd:19,dl:"Day 20 — Demo Prep + Docs",             task:"Prepare demo script — 3 scenarios (PASS, FAIL, CONDITIONAL)",                                       owner:"Rooban",            pri:"P0", output:"Demo script"},
  {id:"20.2",wd:19,dl:"Day 20 — Demo Prep + Docs",             task:"Write README — Azure VM setup, MongoDB Atlas URI, Docker run + ACR pull instructions",              owner:"Rooban",            pri:"P0", output:"README.md"},
  {id:"20.3",wd:19,dl:"Day 20 — Demo Prep + Docs",             task:"Write user guide — step-by-step workflow matching PRD §8.2",                                        owner:"Dhivyashree",       pri:"P1", output:"USER_GUIDE.md"},
  {id:"20.4",wd:19,dl:"Day 20 — Demo Prep + Docs",             task:"Final stakeholder walkthrough — sign off or log punch list",                                        owner:"All",               pri:"P0", output:"Sign-off or punch list"},
  {id:"21.1",wd:20,dl:"Day 21 — 🚀 GO-LIVE",                   task:"Docker image deployed to Azure VM from ACR · health check passing · GO-LIVE",                      owner:"Rooban",            pri:"P0", output:"App LIVE on Azure VM"},
  {id:"21.2",wd:20,dl:"Day 21 — 🚀 GO-LIVE",                   task:"Azure VM hardened — NSG firewall rules, HTTPS via App Gateway, MongoDB Atlas IP whitelist",        owner:"Rooban",            pri:"P0", output:"VM production-ready"},
  {id:"21.3",wd:20,dl:"Day 21 — 🚀 GO-LIVE",                   task:"All documentation committed to GitHub repo",                                                        owner:"All",               pri:"P0", output:"Docs in repo"},
  {id:"21.4",wd:20,dl:"Day 21 — 🚀 GO-LIVE",                   task:"Punch list items triaged: P0 (block) / P1 (fix) / P2 (backlog)",                                  owner:"All",               pri:"P0", output:"Prioritised punch list"},
  {id:"22.1",wd:21,dl:"Days 22–23 — Punch List Fixes",         task:"Resolve all P0 punch list items",                                                                   owner:"All",               pri:"P0", output:"Zero blocking issues"},
  {id:"22.2",wd:21,dl:"Days 22–23 — Punch List Fixes",         task:"Resolve P1 punch list items (non-blocking but required for handover)",                             owner:"All",               pri:"P1", output:"P1 list cleared"},
  {id:"22.3",wd:22,dl:"Days 22–23 — Punch List Fixes",         task:"Re-run full 5-session integration test post-fixes",                                                 owner:"Rooban",            pri:"P0", output:"Regression confirmed clean"},
  {id:"22.4",wd:22,dl:"Days 22–23 — Punch List Fixes",         task:"CV accuracy re-validation — confirm thresholds still hold after fixes",                            owner:"Shrvaani+Athmika",  pri:"P1", output:"Accuracy report v2"},
  {id:"24.1",wd:23,dl:"Days 24–25 — UAT",                      task:"UAT session 1 — Stakeholder runs 3 real label proofing scenarios end-to-end",                      owner:"All",               pri:"P0", output:"UAT feedback log"},
  {id:"24.2",wd:23,dl:"Days 24–25 — UAT",                      task:"UAT session 2 — Edge case labels (low-res, multilingual, rotated)",                               owner:"Shrvaani+Athmika",  pri:"P1", output:"UAT edge case report"},
  {id:"24.3",wd:24,dl:"Days 24–25 — UAT",                      task:"Fix critical UAT findings (same-day turnaround)",                                                  owner:"All",               pri:"P0", output:"UAT blockers resolved"},
  {id:"24.4",wd:24,dl:"Days 24–25 — UAT",                      task:"Sign-off on verdict accuracy threshold — stakeholder accepts CV performance baseline",             owner:"All",               pri:"P0", output:"Accuracy baseline signed off"},
  {id:"26.1",wd:25,dl:"Days 26–27 — Handover Prep",            task:"Shrvaani+Athmika document CV tuning guide + UI component guide",                                   owner:"Shrvaani+Athmika",  pri:"P1", output:"CV_TUNING_GUIDE.md + UI_GUIDE.md"},
  {id:"26.2",wd:25,dl:"Days 26–27 — Handover Prep",            task:"Dhivyashree documents rule engine + how to add new rules + symbol library guide",                 owner:"Dhivyashree",       pri:"P1", output:"RULES_GUIDE.md + SYMBOL_LIBRARY_GUIDE.md"},
  {id:"26.3",wd:26,dl:"Days 26–27 — Handover Prep",            task:"Rooban documents Azure infra + MongoDB Atlas runbook — VM ops, ACR, Atlas backups, Key Vault",   owner:"Rooban",            pri:"P0", output:"INFRA_RUNBOOK.md"},
  {id:"26.4",wd:26,dl:"Days 26–27 — Handover Prep",            task:"Backlog grooming — all P2 items documented in GitHub Issues for future sprint",                   owner:"All",               pri:"P2", output:"GitHub Issues populated"},
  {id:"28.1",wd:27,dl:"Day 28 — 🏁 Final Handover",            task:"Final live demo to stakeholder — production Azure VM",                                             owner:"All",               pri:"P0", output:"Handover demo complete"},
  {id:"28.2",wd:27,dl:"Day 28 — 🏁 Final Handover",            task:"Credentials + access handover — Azure VM, MongoDB Atlas, ACR, GitHub, Key Vault",                owner:"Rooban",            pri:"P0", output:"Access transfer confirmed"},
  {id:"28.3",wd:27,dl:"Day 28 — 🏁 Final Handover",            task:"Project retrospective — what worked, what to improve in next sprint",                             owner:"All",               pri:"P2", output:"Retrospective notes"},
  {id:"28.4",wd:27,dl:"Day 28 — 🏁 Final Handover",            task:"Archive all sprint artefacts — Dockerfile, contracts, test reports, tuning configs",             owner:"Rooban",            pri:"P1", output:"Sprint archive committed to repo"},
];

const seedTasks = RAW.map(t => {
  const d = dayDate(t.wd);
  const wk = t.wd<=6?"Week 1":t.wd<=13?"Week 2":t.wd<=19?"Week 3":"Week 4";
  return {...t, date:d, dateStr:fmtDate(d), week:wk, status:"Not Started", notes:""};
});

// ── XLSX builder ────────────────────────────────────────────
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const col26=n=>{let s="";do{s=String.fromCharCode(65+(n%26))+s;n=Math.floor(n/26)-1;}while(n>=0);return s;};
const buildXLSX=sheets=>{
  const ss=[],ssMap={};
  const si=v=>{const k=String(v);if(ssMap[k]===undefined){ssMap[k]=ss.length;ss.push(k);}return ssMap[k];};
  const wsXmls=sheets.map(({name,rows})=>{
    let xml=`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>`;
    rows.forEach((row,ri)=>{xml+=`<row r="${ri+1}">`;row.forEach((cell,ci)=>{const addr=`${col26(ci)}${ri+1}`;xml+=`<c r="${addr}" t="s"><v>${si(String(cell??""))}</v></c>`;});xml+=`</row>`;});
    xml+=`</sheetData></worksheet>`;return{name,xml};
  });
  const ssXml=`<?xml version="1.0" encoding="UTF-8"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${ss.length}" uniqueCount="${ss.length}">${ss.map(s=>`<si><t xml:space="preserve">${esc(s)}</t></si>`).join("")}</sst>`;
  const wbXml=`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${wsXmls.map((s,i)=>`<sheet name="${esc(s.name)}" sheetId="${i+1}" r:id="rId${i+2}"/>`).join("")}</sheets></workbook>`;
  const wbRels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>${wsXmls.map((s,i)=>`<Relationship Id="rId${i+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}</Relationships>`;
  const ct=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${wsXmls.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>`;
  const ar=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const files={"[Content_Types].xml":ct,"_rels/.rels":ar,"xl/workbook.xml":wbXml,"xl/_rels/workbook.xml.rels":wbRels,"xl/sharedStrings.xml":ssXml,...Object.fromEntries(wsXmls.map((s,i)=>[`xl/worksheets/sheet${i+1}.xml`,s.xml]))};
  const enc=new TextEncoder();const parts=[],cds=[];let off=0;
  const crc32=b=>{let c=0xFFFFFFFF;const t=new Uint32Array(256);for(let i=0;i<256;i++){let v=i;for(let j=0;j<8;j++)v=v&1?(v>>>1)^0xEDB88320:v>>>1;t[i]=v;}for(let i=0;i<b.length;i++)c=t[(c^b[i])&0xFF]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
  const u32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,n,true);return b;};
  const u16=n=>{const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,n,true);return b;};
  for(const[n,c] of Object.entries(files)){
    const nb=enc.encode(n),db=enc.encode(c),crc=crc32(db);
    const lh=new Uint8Array([0x50,0x4B,0x03,0x04,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(db.length),...u32(db.length),...u16(nb.length),0,0,...nb]);
    const ce=new Uint8Array([0x50,0x4B,0x01,0x02,20,0,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(db.length),...u32(db.length),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,...u32(off),...nb]);
    parts.push(lh,db);cds.push(ce);off+=lh.length+db.length;
  }
  const cdb=new Uint8Array(cds.reduce((a,b)=>a+b.length,0));let co=0;cds.forEach(b=>{cdb.set(b,co);co+=b.length;});
  const eocd=new Uint8Array([0x50,0x4B,0x05,0x06,0,0,0,0,...u16(cds.length),...u16(cds.length),...u32(cdb.length),...u32(off),0,0]);
  const tot=parts.reduce((a,b)=>a+b.length,0)+cdb.length+eocd.length;
  const zip=new Uint8Array(tot);let p=0;parts.forEach(x=>{zip.set(x,p);p+=x.length;});zip.set(cdb,p);p+=cdb.length;zip.set(eocd,p);
  const b64=btoa(String.fromCharCode(...zip));
  const a=document.createElement("a");a.href=`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`;a.download="Azure_MongoDB_Sprint_Plan.xlsx";a.click();
};

const exportXLSX=rows=>{
  const H=["Date","Week","Day Label","Task ID","Task","Owner","Priority","Output / Deliverable","Status","Notes"];
  const all=[H,...rows.map(t=>[t.dateStr,t.week,t.dl,t.id,t.task,t.owner,t.pri,t.output,t.status,t.notes||""])];
  const bw=wk=>{const h=["Date","Day Label","Task ID","Task","Owner","Priority","Output","Status","Notes"];return[h,...rows.filter(t=>t.week===wk).map(t=>[t.dateStr,t.dl,t.id,t.task,t.owner,t.pri,t.output,t.status,t.notes||""])];};
  const ms=[["Milestone","Date","Week"],...milestones.map(m=>[m.label,fmtDate(m.date),m.week])];
  const sum=[["Medical Label Verification — Azure + MongoDB Atlas"],[""],["Start",fmtDate(START)],["Go-Live",fmtDate(dayDate(20))],["Handover",fmtDate(dayDate(27))],[""],["Team","Role"],["Rooban","Azure, MongoDB Atlas, GitHub, Backend"],["Shrvaani+Athmika","CV/OCR/Barcodes, UI, Reports"],["Dhivyashree","Symbol Library, Rules, Proof Engine"],[""],["Week","Dates","Focus"],...weekRanges.map(w=>[w.week,`${fmtShort(w.start)} – ${fmtShort(w.end)}`,w.label]),[""],["P0",rows.filter(t=>t.pri==="P0").length],["P1",rows.filter(t=>t.pri==="P1").length],["P2",rows.filter(t=>t.pri==="P2").length],["Total",rows.length]];
  buildXLSX([{name:"Summary",rows:sum},{name:"Milestones",rows:ms},{name:"All Tasks",rows:all},{name:"Week 1 (Mar 16)",rows:bw("Week 1")},{name:"Week 2 (Mar 23)",rows:bw("Week 2")},{name:"Week 3 (Mar 30)",rows:bw("Week 3")},{name:"Week 4 (Apr 6)",rows:bw("Week 4")}]);
};

// ── New Task Modal ───────────────────────────────────────────
const WEEK_DAY_MAP = {
  "Week 1": ["Day 1","Day 2","Day 3","Day 4","Day 5","Days 6–7"],
  "Week 2": ["Day 8","Day 9","Day 10","Day 11","Day 12","Days 13–14"],
  "Week 3": ["Days 15–16","Days 17–18","Day 19","Day 20"],
  "Week 4": ["Day 21","Days 22–23","Days 24–25","Days 26–27","Day 28"],
};
const DAY_WD_MAP = {
  "Day 1":0,"Day 2":1,"Day 3":2,"Day 4":3,"Day 5":4,"Days 6–7":5,
  "Day 8":7,"Day 9":8,"Day 10":9,"Day 11":10,"Day 12":11,"Days 13–14":12,
  "Days 15–16":14,"Days 17–18":16,"Day 19":18,"Day 20":19,
  "Day 21":20,"Days 22–23":21,"Days 24–25":23,"Days 26–27":25,"Day 28":27,
};

function NewTaskModal({onSave, onClose}) {
  const [form, setForm] = useState({week:"Week 1", day:"Day 1", task:"", owner:"Rooban", pri:"P1", output:""});
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const dayOptions = WEEK_DAY_MAP[form.week] || [];
  const save = () => {
    if(!form.task.trim()) return;
    const wd = DAY_WD_MAP[form.day] ?? 0;
    const d = dayDate(wd);
    const id = "C"+Date.now().toString().slice(-5);
    onSave({...form, id, wd, date:d, dateStr:fmtDate(d), dl:`${form.day} — Custom Task`, status:"Not Started", notes:""});
    onClose();
  };
  const inp = {fontSize:12,border:"1px solid #e2e8f0",borderRadius:4,padding:"6px 8px",width:"100%",boxSizing:"border-box",background:"white"};
  const lbl = {fontSize:11,color:"#64748b",marginBottom:3,display:"block"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
      <div style={{background:"white",borderRadius:10,padding:24,width:480,maxWidth:"95vw",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,color:"#1e3a5f"}}>+ Add New Task</div>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",fontSize:18,color:"#94a3b8"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <label style={lbl}>Week</label>
            <select style={inp} value={form.week} onChange={e=>f("week",e.target.value)}>
              {Object.keys(WEEK_DAY_MAP).map(w=><option key={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Day</label>
            <select style={inp} value={form.day} onChange={e=>f("day",e.target.value)}>
              {dayOptions.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <label style={lbl}>Task Description *</label>
          <input style={inp} value={form.task} onChange={e=>f("task",e.target.value)} placeholder="Describe the task..." />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <label style={lbl}>Owner</label>
            <select style={inp} value={form.owner} onChange={e=>f("owner",e.target.value)}>
              {owners.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Priority</label>
            <select style={inp} value={form.pri} onChange={e=>f("pri",e.target.value)}>
              {["P0","P1","P2"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={lbl}>Output / Deliverable</label>
          <input style={inp} value={form.output} onChange={e=>f("output",e.target.value)} placeholder="What does this produce?" />
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 16px",border:"1px solid #e2e8f0",borderRadius:6,background:"white",cursor:"pointer",fontSize:12}}>Cancel</button>
          <button onClick={save} style={{padding:"7px 16px",border:"none",borderRadius:6,background:"#1e40af",color:"white",cursor:"pointer",fontWeight:600,fontSize:12}}>Add Task</button>
        </div>
      </div>
    </div>
  );
}

// ── Owner progress bar ──────────────────────────────────────
function OwnerBar({name, bg, txt, tasks}) {
  const total = tasks.filter(t=>t.owner===name).length;
  const done  = tasks.filter(t=>t.owner===name&&t.status==="Done").length;
  const pct   = total ? Math.round(done/total*100) : 0;
  return (
    <div style={{background:bg,borderRadius:6,padding:"4px 10px",fontSize:11,color:txt,fontWeight:600,minWidth:120}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span>{name}</span><span style={{opacity:0.7}}>{done}/{total}</span>
      </div>
      <div style={{background:"rgba(0,0,0,0.12)",borderRadius:3,height:4}}>
        <div style={{background:txt,width:`${pct}%`,height:"100%",borderRadius:3,transition:"width 0.3s",opacity:0.8}}/>
      </div>
    </div>
  );
}

export default function App() {
  const [rows, setRows]   = useState(seedTasks);
  const [loaded, setLoaded] = useState(false);
  const [fWeek, setFWeek] = useState("All");
  const [fOwner,setFOwner]= useState("All");
  const [fPri,  setFPri]  = useState("All");
  const [fStat, setFStat] = useState("All");
  const [tab,   setTab]   = useState("timeline");
  const [editNote, setEditNote] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [saving, setSaving]     = useState(false);

  // ── Load persisted data ──────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("sprint-tasks-v2");
        if (r?.value) {
          const saved = JSON.parse(r.value);
          setRows(prev => prev.map(t => {
            const s = saved[t.id];
            return s ? {...t, status:s.status, notes:s.notes} : t;
          }).concat(
            Object.entries(saved)
              .filter(([id]) => id.startsWith("C"))
              .map(([,v]) => ({...v, date: new Date(v.date)}))
          ));
        }
      } catch(_) {}
      setLoaded(true);
    })();
  }, []);

  // ── Persist on every change ──────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    setSaving(true);
    const data = {};
    rows.forEach(t => { data[t.id] = {status:t.status, notes:t.notes, ...(t.id.startsWith("C")?t:{})}; });
    window.storage.set("sprint-tasks-v2", JSON.stringify(data))
      .then(() => setTimeout(() => setSaving(false), 800))
      .catch(() => setSaving(false));
  }, [rows, loaded]);

  const upd = (id,f,v) => setRows(p=>p.map(t=>t.id===id?{...t,[f]:v}:t));
  const addTask = t => setRows(p=>[...p, t]);

  const filtered = rows.filter(t=>
    (fWeek==="All"||t.week===fWeek)&&
    (fOwner==="All"||t.owner===fOwner)&&
    (fPri==="All"||t.pri===fPri)&&
    (fStat==="All"||t.status===fStat)
  );

  const stats = {
    total:rows.length,
    done:rows.filter(t=>t.status==="Done").length,
    ip:rows.filter(t=>t.status==="In Progress").length,
    bl:rows.filter(t=>t.status==="Blocked").length,
    ns:rows.filter(t=>t.status==="Not Started").length,
  };
  const pct = Math.round(stats.done/stats.total*100);
  const sel = {fontSize:12,border:"1px solid #e2e8f0",borderRadius:4,padding:"4px 8px",background:"white",cursor:"pointer"};

  return (
    <div style={{fontFamily:"system-ui,sans-serif",fontSize:13,background:"#f8fafc",minHeight:"100vh"}}>
      {showAdd && <NewTaskModal onSave={addTask} onClose={()=>setShowAdd(false)}/>}

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1e3a5f,#0ea5e9)",padding:"16px 24px",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:16,fontWeight:700}}>🏥 Medical Label Verification Platform</div>
            <div style={{fontSize:12,opacity:0.8,marginTop:2}}>
              Azure VM · MongoDB Atlas · {fmtShort(START)} → Go-Live {fmtShort(dayDate(20))} · Handover {fmtShort(dayDate(27))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saving && <span style={{fontSize:11,opacity:0.7}}>💾 saving...</span>}
            <button onClick={()=>setShowAdd(true)} style={{background:"#7c3aed",color:"white",border:"none",borderRadius:6,padding:"8px 14px",cursor:"pointer",fontWeight:600,fontSize:12}}>+ Add Task</button>
            <button onClick={()=>exportXLSX(rows)} style={{background:"#16a34a",color:"white",border:"none",borderRadius:6,padding:"8px 14px",cursor:"pointer",fontWeight:600,fontSize:12}}>⬇ XLSX</button>
          </div>
        </div>

        {/* Progress bar */}
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

        {/* Deployed links */}
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,opacity:0.7}}>🔗 Deployed:</span>
          {DEPLOYED_LINKS.map(l=>(
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer"
              style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:5,padding:"3px 10px",fontSize:11,color:"white",textDecoration:"none",fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:9,opacity:0.8}}>↗</span>{l.label}
            </a>
          ))}
        </div>

        {/* Owner progress bars */}
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          {[["Rooban","#dbeafe","#1e40af"],["Shrvaani+Athmika","#fce7f3","#9d174d"],["Dhivyashree","#fef9c3","#854d0e"],["All","#f3e8ff","#6d28d9"]].map(([n,bg,txt])=>(
            <OwnerBar key={n} name={n} bg={bg} txt={txt} tasks={rows}/>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:"white",borderBottom:"1px solid #e2e8f0",padding:"0 24px"}}>
        {[["timeline","📅 Timeline"],["plan","📋 Sprint Plan"],["board","📊 Board"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 16px",border:"none",background:"none",cursor:"pointer",fontWeight:tab===id?700:400,color:tab===id?"#0ea5e9":"#64748b",borderBottom:tab===id?"2px solid #0ea5e9":"2px solid transparent",fontSize:13}}>{label}</button>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,padding:"10px 24px",background:"white",borderBottom:"1px solid #e2e8f0",flexWrap:"wrap",alignItems:"center"}}>
        <span style={{color:"#64748b",fontSize:12}}>Filter:</span>
        <select style={sel} value={fWeek} onChange={e=>setFWeek(e.target.value)}><option>All</option>{["Week 1","Week 2","Week 3","Week 4"].map(w=><option key={w}>{w}</option>)}</select>
        <select style={sel} value={fOwner} onChange={e=>setFOwner(e.target.value)}><option>All</option>{["Rooban","Shrvaani+Athmika","Dhivyashree","All"].map(o=><option key={o}>{o}</option>)}</select>
        <select style={sel} value={fPri} onChange={e=>setFPri(e.target.value)}><option>All</option>{["P0","P1","P2"].map(p=><option key={p}>{p}</option>)}</select>
        <select style={sel} value={fStat} onChange={e=>setFStat(e.target.value)}><option>All</option>{Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}</select>
        <span style={{color:"#94a3b8",fontSize:11}}>{filtered.length} tasks</span>
        <button onClick={()=>setShowAdd(true)} style={{marginLeft:"auto",background:"#7c3aed",color:"white",border:"none",borderRadius:5,padding:"4px 12px",cursor:"pointer",fontSize:11,fontWeight:600}}>+ Add Task</button>
      </div>

      <div style={{padding:"16px 24px"}}>

        {/* ── TIMELINE ── */}
        {tab==="timeline" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {weekRanges.map(w=>(
                <div key={w.week} style={{background:w.color,borderRadius:8,padding:"12px 14px",color:"white"}}>
                  <div style={{fontWeight:700,fontSize:13}}>{w.week}</div>
                  <div style={{fontSize:11,opacity:0.85,marginTop:2}}>{fmtShort(w.start)} – {fmtShort(w.end)}</div>
                  <div style={{fontSize:11,opacity:0.75,marginTop:4}}>{w.label}</div>
                  <div style={{marginTop:8,fontSize:12,fontWeight:600}}>{rows.filter(t=>t.week===w.week).length} tasks</div>
                </div>
              ))}
            </div>
            <div style={{background:"white",borderRadius:8,border:"1px solid #e2e8f0",padding:"16px",marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:12,color:"#1e3a5f"}}>📍 Key Milestones & Deliverable Dates</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
                {milestones.map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:m.highlight?"#fef9c3":"#f8fafc",border:m.highlight?"1px solid #fbbf24":"1px solid #e2e8f0",borderRadius:6}}>
                    <div style={{background:weekColors[m.week],borderRadius:4,padding:"2px 7px",color:"white",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{fmtShort(m.date)}</div>
                    <div style={{fontSize:12,color:m.highlight?"#92400e":"#374151",fontWeight:m.highlight?700:400}}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"linear-gradient(135deg,#065f46,#047857)",borderRadius:8,padding:"16px 20px",color:"white"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700}}>🚀 Go-Live: {fmtDate(dayDate(20))}</div>
                  <div style={{fontSize:12,opacity:0.85,marginTop:4}}>Azure VM · Docker from ACR · MongoDB Atlas · HTTPS live</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700}}>🏁 Final Handover: {fmtDate(dayDate(27))}</div>
                  <div style={{fontSize:11,opacity:0.85,marginTop:4}}>UAT sign-off · docs · credentials transfer complete</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PLAN ── */}
        {tab==="plan" && ["Week 1","Week 2","Week 3","Week 4"].map(wk=>{
          const wRows=filtered.filter(t=>t.week===wk); if(!wRows.length) return null;
          const dg={};wRows.forEach(t=>{if(!dg[t.dl])dg[t.dl]=[];dg[t.dl].push(t);});
          const wc=weekColors[wk];
          return (
            <div key={wk} style={{marginBottom:24}}>
              <div style={{background:wc,color:"white",padding:"8px 14px",borderRadius:"8px 8px 0 0",fontWeight:700,fontSize:14,display:"flex",justifyContent:"space-between"}}>
                <span>{wk} — {weekRanges.find(w=>w.week===wk)?.label}</span>
                <span style={{opacity:0.85,fontSize:12,fontWeight:400}}>{fmtShort(weekRanges.find(w=>w.week===wk).start)} – {fmtShort(weekRanges.find(w=>w.week===wk).end)}</span>
              </div>
              {Object.entries(dg).map(([dl,dt])=>(
                <div key={dl} style={{marginBottom:2}}>
                  <div style={{background:"#f1f5f9",padding:"5px 14px",fontSize:12,fontWeight:600,color:"#475569",borderLeft:`3px solid ${wc}`,display:"flex",justifyContent:"space-between"}}>
                    <span>{dl}</span><span style={{color:"#94a3b8",fontWeight:400}}>{dt[0]?.dateStr}</span>
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{background:"#f8fafc",fontSize:11,color:"#64748b"}}>
                      {["ID","Task","Owner","Pri","Output","Status","Notes"].map((h,i)=>(
                        <th key={h} style={{padding:"4px 8px",textAlign:"left",borderBottom:"1px solid #e2e8f0",width:[40,undefined,130,44,190,140,130][i]}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {dt.map(t=>{
                        const sc=STATUS_COLORS[t.status];
                        const overdue = t.date && t.date < today && t.status!=="Done";
                        return (
                          <tr key={t.id} style={{background:overdue?"#fff7ed":"white",borderBottom:"1px solid #f1f5f9"}}>
                            <td style={{padding:"5px 8px",color:"#94a3b8",fontWeight:600,fontSize:11}}>
                              {t.id}{overdue&&<span title="Overdue" style={{color:"#ea580c",marginLeft:3}}>⚠</span>}
                            </td>
                            <td style={{padding:"5px 8px",fontSize:12}}>{t.task}</td>
                            <td style={{padding:"5px 8px"}}><span style={{background:oc(t.owner),borderRadius:4,padding:"2px 6px",fontSize:11,fontWeight:600}}>{t.owner}</span></td>
                            <td style={{padding:"5px 8px"}}><span style={{background:t.pri==="P0"?"#fef2f2":t.pri==="P1"?"#fff7ed":"#f0fdf4",color:t.pri==="P0"?"#dc2626":t.pri==="P1"?"#ea580c":"#16a34a",borderRadius:4,padding:"2px 5px",fontSize:10,fontWeight:700}}>{t.pri}</span></td>
                            <td style={{padding:"5px 8px",fontSize:11,color:"#475569"}}>{t.output}</td>
                            <td style={{padding:"5px 8px"}}>
                              <select value={t.status} onChange={e=>upd(t.id,"status",e.target.value)} style={{fontSize:11,border:`1px solid ${sc.border}`,borderRadius:4,padding:"2px 4px",background:sc.bg,color:sc.text,cursor:"pointer"}}>
                                {Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
                              </select>
                            </td>
                            <td style={{padding:"5px 8px"}}>
                              {editNote===t.id
                                ?<input autoFocus value={t.notes} onChange={e=>upd(t.id,"notes",e.target.value)} onBlur={()=>setEditNote(null)} style={{width:"100%",fontSize:11,border:"1px solid #93c5fd",borderRadius:4,padding:"2px 4px"}}/>
                                :<span onClick={()=>setEditNote(t.id)} style={{fontSize:11,color:t.notes?"#0ea5e9":"#cbd5e1",cursor:"pointer"}}>{t.notes||"＋ note"}</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        })}

        {/* ── BOARD ── */}
        {tab==="board" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
            {Object.keys(STATUS_COLORS).map(status=>{
              const sc=STATUS_COLORS[status];const col=filtered.filter(t=>t.status===status);
              return (
                <div key={status} style={{background:"white",borderRadius:8,border:`1px solid ${sc.border}`,overflow:"hidden"}}>
                  <div style={{background:sc.bg,padding:"8px 12px",borderBottom:`1px solid ${sc.border}`,fontWeight:700,fontSize:12,color:sc.text,display:"flex",justifyContent:"space-between"}}>
                    <span>{status}</span><span style={{background:sc.border,borderRadius:10,padding:"1px 7px"}}>{col.length}</span>
                  </div>
                  <div style={{padding:8,maxHeight:520,overflowY:"auto"}}>
                    {col.map(t=>{
                      const overdue = t.date && t.date < today && t.status!=="Done";
                      return (
                        <div key={t.id} style={{background:overdue?"#fff7ed":"#f8fafc",border:`1px solid ${overdue?"#fed7aa":"#e2e8f0"}`,borderRadius:6,padding:"6px 8px",marginBottom:6}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                            <span style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{t.id}{overdue&&<span style={{color:"#ea580c",marginLeft:3}}>⚠</span>}</span>
                            <span style={{background:oc(t.owner),borderRadius:3,padding:"1px 5px",fontSize:10,fontWeight:600}}>{t.owner}</span>
                          </div>
                          <div style={{fontSize:11,color:"#374151",lineHeight:1.4}}>{t.task}</div>
                          <div style={{marginTop:4,display:"flex",gap:4,alignItems:"center"}}>
                            <span style={{fontSize:10,color:"#64748b"}}>{t.dateStr}</span>
                            <span style={{background:t.pri==="P0"?"#fef2f2":t.pri==="P1"?"#fff7ed":"#f0fdf4",color:t.pri==="P0"?"#dc2626":t.pri==="P1"?"#ea580c":"#16a34a",borderRadius:3,padding:"0 4px",fontSize:10,fontWeight:700}}>{t.pri}</span>
                          </div>
                        </div>
                      );
                    })}
                    {!col.length&&<div style={{color:"#cbd5e1",fontSize:12,textAlign:"center",padding:16}}>No tasks</div>}
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
