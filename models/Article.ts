// @ts-nocheck
/**
 * VEXTONY OMEGA VAULT - THE MASTER ARTICLE SCHEMA
 * [DNA: 60-LAYER QUANTUM STORAGE | WIKIPEDIA KILLER v2.0]
 * [VERSION: 60.0.0-SUPREME-FINAL]
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVextonyArticle extends Document {
  sovereignId: string; 
  slug: string;        
  metadata: {
    language: string;  
    category: 'SOVEREIGN' | 'UNIVERSE';
    depth_level: number; 
    version: string;     
  };
  content: {
    layers: {
      quantum_definition: string; 
      divine_purpose: string;     
      mechanical_logic: string;   
      primordial_source: string;  
      sacred_geometry: string;    
      predictive_evolution: string; 
      moral_legacy: string;       
    };
    analytical_deep_dive: string; 
    vextony_questions: string[];  
    vortex_viral_hooks: string[]; 
  };
  security: {
    divine_compliance_verified: boolean; 
    architect_signature: string;        
  };
  createdAt: Date;
}

const ArticleSchema: Schema = new Schema({
  sovereignId: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  metadata: {
    language: { type: String, required: true, index: true },
    category: { type: String, enum: ['SOVEREIGN', 'UNIVERSE'], required: true },
    depth_level: { type: Number, default: 60 }, 
    version: { type: String, default: 'V60-SUPREME' }
  },
  content: {
    layers: {
      quantum_definition: { type: String, required: true },
      divine_purpose: { type: String, required: true },
      mechanical_logic: { type: String, required: true },
      primordial_source: { type: String, required: true },
      sacred_geometry: { type: String, required: true },
      predictive_evolution: { type: String, required: true },
      moral_legacy: { type: String, required: true }
    },
    analytical_deep_dive: { type: String, required: true },
    vextony_questions: [String],
    vortex_viral_hooks: [String]
  },
  security: {
    divine_compliance_verified: { type: Boolean, default: true },
    architect_signature: { type: String, default: 'VEXTONY-ARCHITECT-786' }
  }
}, { timestamps: true });

// High-speed Search Indexing for Google & Vextony Search
ArticleSchema.index({ "metadata.language": 1, "metadata.category": 1 });

const Article: Model<IVextonyArticle> = mongoose.models.Article || mongoose.model<IVextonyArticle>('Article', ArticleSchema);
export default Article;
