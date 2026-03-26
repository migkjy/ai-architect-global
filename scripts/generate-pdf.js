#!/usr/bin/env node
/**
 * Generate AI Starter Guide PDF
 * Uses PDFKit to create a branded PDF with content from:
 * - Getting Started page
 * - Skill Guide page
 * - Quick Start guides (all 6 books)
 */

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "..", "public", "guides", "ai-starter-guide.pdf");

// Brand colors
const NAVY = "#0B1120";
const GOLD = "#D4A843";
const GOLD_LIGHT = "#E8C96A";
const WHITE = "#FFFFFF";
const GRAY = "#9CA3AF";
const LIGHT_GRAY = "#D1D5DB";

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 60, bottom: 60, left: 50, right: 50 },
  info: {
    Title: "AI Native Playbook - Starter Guide",
    Author: "AI Native Playbook",
    Subject: "Complete guide to getting started with AI Native Playbook Series",
    Keywords: "AI, business, frameworks, playbook, starter guide",
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const PAGE_WIDTH = doc.page.width - 100; // minus margins

// Helper functions
function drawGoldBar(y, width = 40) {
  doc.save();
  doc.rect(50, y, 3, width).fill(GOLD);
  doc.restore();
}

function addPageNumber() {
  const pageNum = doc.bufferedPageRange();
  // We'll skip page numbers on cover
}

function heading1(text, y) {
  doc.font("Helvetica-Bold").fontSize(24).fillColor(NAVY);
  doc.text(text, 50, y, { width: PAGE_WIDTH });
  return doc.y + 10;
}

function heading2(text) {
  const y = doc.y;
  drawGoldBar(y, 18);
  doc.font("Helvetica-Bold").fontSize(16).fillColor(NAVY);
  doc.text(text, 60, y, { width: PAGE_WIDTH - 10 });
  doc.moveDown(0.5);
  return doc.y;
}

function heading3(text) {
  doc.font("Helvetica-Bold").fontSize(13).fillColor(NAVY);
  doc.text(text, 50, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(0.3);
}

function bodyText(text) {
  doc.font("Helvetica").fontSize(10).fillColor("#374151");
  doc.text(text, 50, doc.y, { width: PAGE_WIDTH, lineGap: 3 });
  doc.moveDown(0.5);
}

function bulletPoint(text, indent = 60) {
  const y = doc.y;
  doc.font("Helvetica").fontSize(10).fillColor(GOLD);
  doc.text("\u2022", indent - 10, y);
  doc.font("Helvetica").fontSize(10).fillColor("#374151");
  doc.text(text, indent, y, { width: PAGE_WIDTH - (indent - 50), lineGap: 3 });
  doc.moveDown(0.3);
}

function numberedItem(num, title, desc) {
  const y = doc.y;
  // Number circle
  doc.save();
  doc.roundedRect(50, y, 22, 22, 4).fill(GOLD);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(WHITE);
  doc.text(String(num), 50, y + 5, { width: 22, align: "center" });
  doc.restore();

  // Title + description
  doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY);
  doc.text(title, 80, y + 2, { width: PAGE_WIDTH - 30 });
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(9.5).fillColor("#4B5563");
  doc.text(desc, 80, doc.y, { width: PAGE_WIDTH - 30, lineGap: 2 });
  doc.moveDown(0.8);
}

function checkIfNeedNewPage(minSpace = 120) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - minSpace) {
    doc.addPage();
  }
}

function addSeparator() {
  doc.save();
  doc.moveTo(50, doc.y).lineTo(50 + PAGE_WIDTH, doc.y).lineWidth(0.5).strokeColor("#E5E7EB").stroke();
  doc.restore();
  doc.moveDown(1);
}

// ============================================================
// COVER PAGE
// ============================================================

// Background
doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);

// Gold accent line at top
doc.rect(0, 0, doc.page.width, 4).fill(GOLD);

// Title area
doc.font("Helvetica-Bold").fontSize(14).fillColor(GOLD);
doc.text("AI NATIVE PLAYBOOK", 50, 200, { width: PAGE_WIDTH, align: "center", characterSpacing: 4 });

doc.moveDown(1.5);
doc.font("Helvetica-Bold").fontSize(36).fillColor(WHITE);
doc.text("Starter Guide", 50, doc.y, { width: PAGE_WIDTH, align: "center" });

doc.moveDown(0.8);
doc.font("Helvetica").fontSize(13).fillColor(GRAY);
doc.text(
  "Your complete guide to getting started with AI Native Playbook.\nFrom download to your first AI-generated business output.",
  50,
  doc.y,
  { width: PAGE_WIDTH, align: "center", lineGap: 4 }
);

// Decorative gold bar
doc.moveDown(2);
const barY = doc.y;
doc.rect(doc.page.width / 2 - 40, barY, 80, 2).fill(GOLD);

// Bottom info
doc.font("Helvetica").fontSize(10).fillColor(GRAY);
doc.text("ai-native-playbook.com", 50, doc.page.height - 120, {
  width: PAGE_WIDTH,
  align: "center",
});
doc.moveDown(0.5);
doc.font("Helvetica").fontSize(9).fillColor("#6B7280");
doc.text("Free Guide Edition", 50, doc.y, { width: PAGE_WIDTH, align: "center" });

// ============================================================
// TABLE OF CONTENTS
// ============================================================
doc.addPage();

heading1("Table of Contents", 60);
doc.moveDown(1);

const tocItems = [
  { num: "1", title: "What You Received", page: "3" },
  { num: "2", title: "5 Steps to Your First Result", page: "3" },
  { num: "3", title: "What Is an AI Agent Skill?", page: "5" },
  { num: "4", title: "How to Load Your Skill", page: "5" },
  { num: "5", title: "Best Practices", page: "7" },
  { num: "6", title: "Combining Multiple Skills", page: "8" },
  { num: "7", title: "Quick Start: AI Marketing Architect", page: "9" },
  { num: "8", title: "Quick Start: AI Brand Architect", page: "10" },
  { num: "9", title: "Quick Start: AI Traffic Architect", page: "11" },
  { num: "10", title: "Quick Start: AI Story Architect", page: "12" },
  { num: "11", title: "Quick Start: AI Startup Architect", page: "13" },
  { num: "12", title: "Quick Start: AI Content Architect", page: "14" },
  { num: "13", title: "Troubleshooting & FAQ", page: "15" },
];

tocItems.forEach((item) => {
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD);
  doc.text(item.num + ".", 60, y, { continued: false });
  doc.font("Helvetica").fontSize(11).fillColor(NAVY);
  doc.text(item.title, 85, y, { width: PAGE_WIDTH - 80 });
  doc.moveDown(0.6);
});

// ============================================================
// CHAPTER 1: GETTING STARTED
// ============================================================
doc.addPage();

doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD);
doc.text("CHAPTER 1", 50, 60, { characterSpacing: 2 });
doc.moveDown(0.3);
heading1("Welcome \u2014 Here Is Exactly What to Do Next", doc.y);
doc.moveDown(0.5);

bodyText(
  "You have a PDF guide, an AI Agent Skill file, and a 5-day quickstart plan. This page shows you how to use all three \u2014 from download to your first AI-generated business output in under an hour."
);

doc.moveDown(0.5);
heading2("What You Received");

const receivedItems = [
  {
    title: "PDF Guide (20 pages)",
    desc: "A framework overview, worked examples, and the 5-day quickstart checklist at the end. Read it for context \u2014 the AI Agent Skill handles the application.",
  },
  {
    title: "AI Agent Skill (.md file)",
    desc: "A structured knowledge file you load into Claude, ChatGPT, or any AI. Once loaded, the AI operates as a specialist in the framework \u2014 applying it step by step to your specific business, not giving generic answers.",
  },
  {
    title: "Prompt Templates",
    desc: "Copy-paste prompts for each major framework step. These are not generic \u2014 they are designed to extract the maximum output from the Skill. Use them exactly as written, then customize from there.",
  },
];

receivedItems.forEach((item) => {
  checkIfNeedNewPage(80);
  heading3(item.title);
  bodyText(item.desc);
});

doc.moveDown(0.5);
heading2("5 Steps to Your First Result");

const steps = [
  {
    title: "Read the PDF Guide (30 min)",
    desc: "Skim the full guide first for the big picture. You do not need to memorize anything \u2014 just understand the framework structure and what the AI Agent Skill will do with it. The 5-day quickstart checklist is at the end of the PDF.",
  },
  {
    title: "Load the AI Agent Skill",
    desc: "The .md file in your download is not a document to read \u2014 it is a system prompt that gives your AI specialist-level expertise in the framework. Without it, you get generic AI output. With it, you get framework-driven analysis applied to your specific business.",
  },
  {
    title: "Run Your First Prompt",
    desc: "Each book has a 'Start Here' prompt built into the framework. With the Skill loaded, paste it into your AI and describe your business in plain language. The AI applies the full expert framework to your specific situation.",
  },
  {
    title: "Follow the 5-Day Quickstart",
    desc: "Each book has a day-by-day action plan. One focused task per day. By Day 5 you have a working system \u2014 not just a plan, but actual output you can deploy: a funnel structure, a launch sequence, a brand narrative, a traffic strategy.",
  },
  {
    title: "Iterate and Improve",
    desc: "The first output is your starting point. Feed it back to the AI with your feedback and the framework tightens. The more context you give across sessions, the more precise the output becomes.",
  },
];

steps.forEach((step, i) => {
  checkIfNeedNewPage(80);
  numberedItem(i + 1, step.title, step.desc);
});

// ============================================================
// CHAPTER 2: SKILL GUIDE
// ============================================================
doc.addPage();

doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD);
doc.text("CHAPTER 2", 50, 60, { characterSpacing: 2 });
doc.moveDown(0.3);
heading1("How to Use Your AI Agent Skill", doc.y);
doc.moveDown(0.5);

bodyText(
  "Your .md file gives any AI domain-level expertise in a proven business framework. Here is how to load it into Claude, ChatGPT, or Gemini \u2014 and get results from day one."
);

doc.moveDown(0.5);
heading2("What Is an AI Agent Skill?");

const skillExplanations = [
  {
    title: "The .md File",
    desc: "A structured plain-text file that encodes a complete expert framework \u2014 its methodology, decision trees, output templates, and evaluation criteria \u2014 as AI-executable instructions. When an AI reads this file, it does not just know about the framework. It follows the framework's methodology when responding to your prompts.",
  },
  {
    title: "vs. Regular Prompts",
    desc: "A regular prompt is a one-shot question. The AI answers from general training data \u2014 broad, often shallow. A Skill-loaded conversation is different: the AI operates with the complete expert framework in context for the entire session. Every answer is filtered through that methodology.",
  },
  {
    title: "The Analogy",
    desc: "Loading the Marketing Architect skill is like hiring Russell Brunson to sit next to you while you work. He does not just answer questions \u2014 he runs you through his Secret Formula, builds your Value Ladder, writes your Hook-Story-Offer. Loading the Skill gives any AI that same specialist capability.",
  },
];

skillExplanations.forEach((item) => {
  checkIfNeedNewPage(80);
  heading3(item.title);
  bodyText(item.desc);
});

doc.moveDown(0.3);
heading2("How to Load Your Skill");

const platforms = [
  {
    name: "Claude (Recommended)",
    steps: [
      "Open Claude at claude.ai and click 'Projects' in the left sidebar.",
      "Create a new Project named after the framework (e.g., 'Marketing Architect').",
      "Click 'Add to project knowledge' and upload your .md skill file.",
      "Start a new conversation inside the project. The skill is now active and persists across every conversation in this project.",
    ],
    note: "Claude Projects is recommended because the skill persists. For bundle buyers: create one project per skill.",
  },
  {
    name: "ChatGPT",
    steps: [
      "Go to Settings, then select Custom Instructions.",
      "Open your .md skill file in any text editor and select all contents.",
      "Paste into the 'What would you like ChatGPT to know about you?' field and save.",
      "Start a new conversation. The skill context will be active for all new conversations.",
    ],
    note: "Alternative: paste the full .md contents as your first message before describing your business.",
  },
  {
    name: "Gemini",
    steps: [
      "Open your .md skill file in any text editor and select all contents.",
      "Start a new Gemini conversation at gemini.google.com.",
      "Paste the skill contents as your first message, followed by your business description.",
      "Continue with your framework prompts. Gemini will apply the skill throughout.",
    ],
    note: "Gemini Gems allow you to save the skill as a persistent Gem \u2014 similar to Claude Projects.",
  },
  {
    name: "Any Other LLM",
    steps: [
      "Open your .md skill file in any text editor.",
      "If the LLM has a system prompt field, paste the skill contents there.",
      "Otherwise, paste as your first user message, then add your business description.",
    ],
    note: "Any LLM that supports long-context input can use the AI Agent Skills. The skill is plain text.",
  },
];

platforms.forEach((platform) => {
  checkIfNeedNewPage(120);
  heading3(platform.name);
  platform.steps.forEach((step, i) => {
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(GOLD);
    doc.text(`${i + 1}.`, 60, y);
    doc.font("Helvetica").fontSize(9.5).fillColor("#4B5563");
    doc.text(step, 75, y, { width: PAGE_WIDTH - 25, lineGap: 2 });
    doc.moveDown(0.2);
  });
  if (platform.note) {
    doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(GRAY);
    doc.text(platform.note, 60, doc.y, { width: PAGE_WIDTH - 10, lineGap: 2 });
    doc.moveDown(0.6);
  }
});

// ============================================================
// BEST PRACTICES
// ============================================================
checkIfNeedNewPage(200);
if (doc.y > 400) doc.addPage();

heading2("Best Practices");

const bestPractices = [
  {
    title: "One Skill Per Conversation",
    desc: "Each skill sets a specific expert context. Mixing multiple frameworks in one session forces the AI to context-switch, which degrades precision. Use one skill per conversation. Feed outputs from one session into the next.",
  },
  {
    title: "Provide Specific Business Context",
    desc: "The more specific your business details \u2014 your niche, audience, revenue, specific problem \u2014 the more precisely the AI applies the framework. 'I sell coaching' produces generic output. 'I sell 90-day coaching to freelance designers earning $40K who want to reach $100K' produces actionable profiles.",
  },
  {
    title: "Use the Built-in Prompt Templates",
    desc: "Each book includes copy-paste prompts designed to extract maximum value from the specific skill. These are structured inputs that trigger the framework's full methodology. Use them exactly as written first, then customize.",
  },
  {
    title: "Save and Iterate",
    desc: "Save every AI output. In the next session, paste the previous output and ask for refinement. The iteration cycle is where value compounds \u2014 each round makes the output more precise and more ready to deploy.",
  },
];

bestPractices.forEach((bp) => {
  checkIfNeedNewPage(80);
  heading3(bp.title);
  bodyText(bp.desc);
});

// ============================================================
// COMBINING SKILLS
// ============================================================
checkIfNeedNewPage(150);
heading2("Combining Multiple Skills (Bundle)");

bodyText(
  "Each skill's output becomes the input for the next. Here is the recommended sequence:"
);

const skillChain = [
  "Vol. 1: AI Marketing Architect \u2014 Define your Dream Customer and Value Ladder",
  "Vol. 2: AI Brand Architect \u2014 Craft your positioning, Big Domino, and origin story",
  "Vol. 3: AI Traffic Architect \u2014 Build your Dream 100 list and platform strategy",
  "Vol. 4: AI Story Architect \u2014 Write sales copy using FRED analysis and Stealth Close",
  "Vol. 5: AI Startup Architect \u2014 Design your launch sequence with PLF methodology",
  "Vol. 6: AI Content Architect \u2014 Produce ongoing content using the 4A Framework",
];

skillChain.forEach((item) => {
  checkIfNeedNewPage(30);
  bulletPoint(item);
});

doc.moveDown(0.3);
bodyText(
  "Start with Marketing Architect to define your Dream Customer and Value Ladder. Feed that profile into Traffic Architect to build your Dream 100 list. Use Brand Architect to craft your positioning and origin story. Hand that story to Story Architect to write your sales copy. Use Startup Architect to design your launch sequence. Then Content Architect to produce the ongoing content that fills your funnel."
);

// ============================================================
// QUICK START GUIDES (all 6 books)
// ============================================================

const quickStarts = [
  {
    vol: 1,
    title: "AI Marketing Architect",
    framework: "DotCom Secrets (Russell Brunson)",
    actions: [
      "Answer the 4 Secret Formula questions: Who is your Dream Customer? Where are they congregating? What bait will you use? What result do you want to give them?",
      "Feed your answers to the AI with marketing-architect loaded and request a complete Dream Customer Profile Card.",
      "Take the profile and ask the AI to map your Value Ladder \u2014 identify gaps and propose a complete ascension model.",
    ],
    outcomes: {
      week1: "Complete Dream Customer Profile Card and Value Ladder map.",
      month1: "First leads entering the funnel. Soap Opera Sequence live.",
      month3: "Full Value Ladder operational with automated email sequences.",
    },
    prompt:
      "I sell [product/service] to [audience]. My industry is [niche]. Using Russell Brunson's Secret Formula, build a Dream Customer Profile Card with: demographics, psychographics (fears, desires, false beliefs), congregation map, three bait ideas, and a Before/After transformation statement.",
  },
  {
    vol: 2,
    title: "AI Brand Architect",
    framework: "Expert Secrets (Russell Brunson)",
    actions: [
      "Define your New Opportunity: 'Instead of [old way], my customers get [new opportunity] that [delivers result].'",
      "Identify your Big Domino \u2014 the ONE belief that makes every other objection irrelevant.",
      "Feed both to the AI and request: Big Domino Statement + Three False Belief breakdown.",
    ],
    outcomes: {
      week1: "Big Domino Statement and Three False Beliefs identified.",
      month1: "Perfect Webinar script generated and tested.",
      month3: "Mass Movement building with consistent brand narrative.",
    },
    prompt:
      "Using Russell Brunson's Big Domino framework, take my business context and produce: (1) Big Domino Statement, (2) Three False Belief patterns (Vehicle, Internal, External) with story frameworks. My business: [describe what you sell and who you sell it to].",
  },
  {
    vol: 3,
    title: "AI Traffic Architect",
    framework: "Traffic Secrets (Russell Brunson)",
    actions: [
      "Build your Dream Customer Avatar with psychographics, daily information diet, and purchase triggers.",
      "Build your Dream 100 list across 6 categories: Podcasters, YouTubers, Bloggers, Influencers, Community Owners, Newsletter Owners.",
      "Choose your primary platform and generate the first week of platform-native content.",
    ],
    outcomes: {
      week1: "Dream Customer Avatar and Dream 100 list complete.",
      month1: "First traffic results from Dream 100 engagement.",
      month3: "At least 10 active Dream 100 relationships.",
    },
    prompt:
      "Using Russell Brunson's Dream 100 strategy, build a categorized Dream 100 framework. My niche: [describe]. My target audience: [describe]. For each category, provide: what to look for, how to find them, 15-20 target profiles, and a 3-step approach strategy.",
  },
  {
    vol: 4,
    title: "AI Story Architect",
    framework: "Copywriting Secrets (Jim Edwards)",
    actions: [
      "Run the FRED analysis \u2014 map your audience's Fears, Results, Expectations, and Desires.",
      "Identify primary and secondary buying motivators from the 10 Motivators framework.",
      "Request a complete sales page using the Stealth Close structure.",
    ],
    outcomes: {
      week1: "FRED analysis complete. New sales copy drafted.",
      month1: "Measurable conversion lift on rewritten pages.",
      month3: "Full copy library built across all channels.",
    },
    prompt:
      "I need sales copy for [product]. Price: [price]. Target audience: [describe]. Using Jim Edwards' framework, complete a FRED analysis, identify top 2 buying motivators, then write a sales page using the Stealth Close structure.",
  },
  {
    vol: 5,
    title: "AI Startup Architect",
    framework: "Launch (Jeff Walker)",
    actions: [
      "Choose your launch type: Seed Launch (50-500 people), Internal Launch (500+), or JV Launch (proven data).",
      "Design your 3-part Pre-Launch Content (PLC) sequence.",
      "Write the complete launch email series from Cart Open through Final Close.",
    ],
    outcomes: {
      week1: "Launch type selected. PLC sequence designed. Email series drafted.",
      month1: "First launch executed with conversion data collected.",
      month3: "Scalable launch system with documented conversion rates.",
    },
    prompt:
      "I want to launch [product]. My situation: [list size, platforms, product status]. Using Jeff Walker's Product Launch Formula, recommend my launch type and design the complete PLC sequence with delivery format for each piece.",
  },
  {
    vol: 6,
    title: "AI Content Architect",
    framework: "The 4A Framework (Nicolas Cole)",
    actions: [
      "Choose one topic and request four content pieces using the 4A Framework: Actionable, Analytical, Aspirational, Anthropological.",
      "Publish the piece that resonates most. Save others for following days.",
      "Atomize your best piece across platforms: LinkedIn, Twitter/X, newsletter, video script.",
    ],
    outcomes: {
      week1: "4A content batch completed and first piece published.",
      month1: "30-day content calendar live with 16 pieces.",
      month3: "Systematic content production. Audience data showing best A-type.",
    },
    prompt:
      "Using Nicolas Cole's 4A Framework, take my topic and write four content pieces. Topic: [your topic]. Audience: [who]. Platform: [preferred]. Write one Actionable, one Analytical, one Aspirational, and one Anthropological piece. Each 300-500 words with strong hook.",
  },
];

quickStarts.forEach((qs) => {
  doc.addPage();

  doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD);
  doc.text(`QUICK START \u2014 VOL. ${qs.vol}`, 50, 60, { characterSpacing: 2 });
  doc.moveDown(0.3);
  heading1(qs.title, doc.y);
  doc.moveDown(0.2);
  doc.font("Helvetica-Oblique").fontSize(10).fillColor(GRAY);
  doc.text(`Based on ${qs.framework}`, 50, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(0.8);

  heading2("Your First 3 Actions");
  qs.actions.forEach((action, i) => {
    checkIfNeedNewPage(60);
    numberedItem(i + 1, `Action ${i + 1}`, action);
  });

  heading2("Expected Outcomes");
  const outcomes = [
    { label: "Week 1", value: qs.outcomes.week1 },
    { label: "Month 1", value: qs.outcomes.month1 },
    { label: "Month 3", value: qs.outcomes.month3 },
  ];
  outcomes.forEach((o) => {
    checkIfNeedNewPage(40);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(GOLD);
    doc.text(o.label + ":", 60, doc.y, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor("#4B5563");
    doc.text(" " + o.value, { width: PAGE_WIDTH - 10 });
    doc.moveDown(0.3);
  });

  doc.moveDown(0.3);
  heading2("Copy-Paste Prompt");

  // Prompt box
  checkIfNeedNewPage(100);
  const promptY = doc.y;
  doc.save();
  doc.roundedRect(55, promptY, PAGE_WIDTH - 10, 10, 3); // placeholder for height
  // We need to measure height first
  doc.restore();

  doc.font("Courier").fontSize(8.5).fillColor("#374151");
  doc.text(qs.prompt, 65, promptY + 5, { width: PAGE_WIDTH - 40, lineGap: 3 });

  // Draw box around prompt after text
  const promptEndY = doc.y + 5;
  doc.save();
  doc.roundedRect(55, promptY - 5, PAGE_WIDTH - 10, promptEndY - promptY + 10, 4)
    .lineWidth(0.5)
    .strokeColor("#D1D5DB")
    .stroke();
  doc.restore();
  doc.y = promptEndY + 5;
});

// ============================================================
// TROUBLESHOOTING & FAQ
// ============================================================
doc.addPage();

doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD);
doc.text("CHAPTER 4", 50, 60, { characterSpacing: 2 });
doc.moveDown(0.3);
heading1("Troubleshooting & FAQ", doc.y);
doc.moveDown(0.5);

const faqs = [
  {
    q: "The AI isn't following the framework. What should I do?",
    a: "Start a new conversation and reload the skill. Long conversations can dilute framework adherence as context fills up. Shorter, focused sessions with one clear objective produce more consistent framework application.",
  },
  {
    q: "The output is too generic. How do I get more specific results?",
    a: "Generic input produces generic output. Provide your exact niche, your current situation (list size, revenue, platforms), your specific customer, and the exact problem you need solved. The framework needs real inputs to produce real outputs.",
  },
  {
    q: "How do I know the skill is working?",
    a: "Run the same prompt with and without the skill loaded and compare. A skill-loaded AI will reference specific framework terminology and structure its output according to the framework's methodology.",
  },
  {
    q: "Can I use multiple skills together?",
    a: "Use separate conversations per skill and feed outputs from one into the next. Marketing Architect output becomes input for Traffic Architect. This chaining is more effective than mixing skills in one session.",
  },
  {
    q: "Which skill should I start with?",
    a: "Start with the skill that addresses your most urgent business problem. If you don't know who your customer is \u2014 Marketing Architect. If you don't know how to reach them \u2014 Traffic Architect. If you have an offer but no converting copy \u2014 Story Architect. If you're ready to launch \u2014 Startup Architect.",
  },
];

faqs.forEach((faq) => {
  checkIfNeedNewPage(80);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(NAVY);
  doc.text("Q: " + faq.q, 50, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(10).fillColor("#4B5563");
  doc.text(faq.a, 50, doc.y, { width: PAGE_WIDTH, lineGap: 3 });
  doc.moveDown(1);
});

// ============================================================
// FINAL CTA PAGE
// ============================================================
doc.addPage();

// Dark background
doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
doc.rect(0, 0, doc.page.width, 4).fill(GOLD);

doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD);
doc.text("NEXT STEPS", 50, 200, { width: PAGE_WIDTH, align: "center", characterSpacing: 3 });

doc.moveDown(1.5);
doc.font("Helvetica-Bold").fontSize(28).fillColor(WHITE);
doc.text("Ready to Build Your\nAI-Powered Business?", 50, doc.y, { width: PAGE_WIDTH, align: "center", lineGap: 6 });

doc.moveDown(1.5);
doc.font("Helvetica").fontSize(12).fillColor(GRAY);
doc.text(
  "Each book is a complete expert framework \u2014 AI Agent Skill included \u2014 for $17.\nAll 6 books are available as a bundle for $47.",
  50,
  doc.y,
  { width: PAGE_WIDTH, align: "center", lineGap: 4 }
);

doc.moveDown(2);

// CTA button-like area
const ctaY = doc.y;
doc.roundedRect(doc.page.width / 2 - 120, ctaY, 240, 44, 8).fill(GOLD);
doc.font("Helvetica-Bold").fontSize(14).fillColor(NAVY);
doc.text("Visit ai-native-playbook.com", doc.page.width / 2 - 120, ctaY + 13, {
  width: 240,
  align: "center",
});

doc.moveDown(3);
doc.font("Helvetica").fontSize(10).fillColor("#6B7280");
doc.text(
  "Browse individual books, get the complete bundle,\nor start with the free Getting Started guide.",
  50,
  doc.y,
  { width: PAGE_WIDTH, align: "center", lineGap: 3 }
);

// Footer
doc.font("Helvetica").fontSize(8).fillColor("#4B5563");
doc.text(
  "\u00A9 AI Native Playbook. All rights reserved.",
  50,
  doc.page.height - 80,
  { width: PAGE_WIDTH, align: "center" }
);

// Finalize
doc.end();

stream.on("finish", () => {
  const stats = fs.statSync(outputPath);
  console.log(`PDF generated successfully: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
});
