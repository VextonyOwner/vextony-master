/**
 * VEXTONY DATABASE BRIDGE - MONGODB ATLAS CONNECTOR
 * [DNA: SECURE PERSISTENT CONNECTION | 1 BILLION PAGE SCALABILITY]
 */

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // ডেভেলপমেন্ট মোডে কানেকশন বারবার তৈরি হওয়া রোধ করে
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // প্রোডাকশন মোডে সরাসরি কানেক্ট করে
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
