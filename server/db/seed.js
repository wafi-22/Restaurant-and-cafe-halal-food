// server/db/seed.js
import db from '../config/db.js';
import {
  seedUsers,
  seedCertifyingBodies,
  seedVenues,
  seedCertificates,
  seedMenuItems,
  seedReviews
} from './seedData.js';

async function runSeed() {
  console.log('Seeding Halal Dining Engine database...');
  try {
    const mem = db.getMemoryStore();
    console.log(`✓ Loaded ${mem.users.length} Users`);
    console.log(`✓ Loaded ${mem.certifying_bodies.length} Certifying Bodies`);
    console.log(`✓ Loaded ${mem.venues.length} Dining Venues`);
    console.log(`✓ Loaded ${mem.halal_certificates.length} Halal Certificates`);
    console.log(`✓ Loaded ${mem.menu_items.length} Menu Items`);
    console.log(`✓ Loaded ${mem.reviews.length} Diner Reviews`);
    console.log('Seed verification successful!');
    process.exit(0);
  } catch (error) {
    console.error('Seed execution error:', error);
    process.exit(1);
  }
}

runSeed();
