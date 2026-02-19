// @ts-nocheck
/**
 * VEXTONY SUPREME VAULT - THE OMEGA SCHEMA v60.0
 * [DNA: 50-LAYER CONSTITUTION | 7-LAYER ANALYSIS | 1 TRILLION% DEPTH]
 * [WIKIPEDIA KILLER v2.0 | ALGORITHM-EXECUTIONER]
 */

import mongoose, { Schema, model, models } from 'mongoose';

const ArticleSchema = new Schema({
  pillarId: { type: String, required: true, index: true }, // P-1 to P-600 tracking
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String, enum: ['Sovereign', 'Universe', 'Vortex'], required: true },
  
  // ১. দ্য ৭-লেয়ার এনালিসিস (The Wikipedia Killer Core)
  analysis: {
    layer1_what: { type: String, required: true }, // অস্তিত্ব ও কোয়ান্টাম সংজ্ঞা
    layer2_why: { type: String, required: true },  // সৃষ্টির উদ্দেশ্য ও ডিভাইন লজিক
    layer3_how: { type: String, required: true },  // গাণিতিক ও বৈজ্ঞানিক মেকানিজম
    layer4_source: { type: String, required: true }, // আদি উৎস ও বিবর্তনের ধারা
    layer5_divine_art: { type: String, required: true }, // স্রষ্টার জ্যামিতিক নকশা
    layer6_future: { type: String, required: true }, // ৫০০ বছরের ভবিষ্যৎ প্রেডিকশন
    layer7_action: { type: String, required: true }  // বাস্তব জীবনের অজেয় শিক্ষা
  },

  // ২. দ্য ওমেগা ম্যাট্রিক্স (Authority Data)
  omega_metadata: {
    scientific_citations: [String], // Vextony Council Evidence
    divine_proofs: [String],        // Mathematical Proofs of One Creator
    interlinked_nodes: [String],    // Spider-web Internal Links
    prediction_accuracy: { type: String, default: "99.99%" }, 
    legacy_status: { type: String, default: "500-Year Evergreen" },
    architect_seal: { type: String, default: "VEXTONY-ARCHITECT-786" }
  },

  content_html: { type: String, required: true }, 
  language: { type: String, default: 'en', index: true }, 
  
  // ৩. এসইও ও অ্যালগরিদম ডমিনেন্স (Search Engine Executioner)
  seo_dominance: {
    meta_title: String,
    meta_desc: String,
    keywords: [String],
    canonical_url: String,
    semantic_score: { type: Number, default: 100 },
    google_index_status: { type: Boolean, default: false }
  },

  author: { type: String, default: 'Vextony Sovereign Council' },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  // শার্ডিং লজিক: ১ বিলিয়ন পেজ হ্যান্ডেল করার জন্য অত্যন্ত জরুরি
  shardKey: { slug: 1 } 
});

// হাই-স্পিড মাল্টি-ডাইমেনশনাল ইনডেক্সিং
ArticleSchema.index({ slug: 1, language: 1, status: 1 });
ArticleSchema.index({ pillarId: 1, category: 1 });

const Article = models.Article || model('Article', ArticleSchema);
export default Article;
