import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importCsvData() {
  try {
    const csvData = fs.readFileSync('data/scraped-businesses.csv', 'utf-8');
    const lines = csvData.split('\n').slice(1); // Skip header
    
    console.log('📊 Importing', lines.filter(l => l.trim()).length, 'businesses from CSV...');
    
    // Get or create owner for scraped businesses
    let user = await prisma.user.findUnique({ where: { email: 'scraped@wellingborough.ai' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'scraped@wellingborough.ai',
          name: 'Scraped Business Owner',
          password: 'temp-password',
          role: 'business'
        }
      });
    }
    
    let imported = 0;
    let skipped = 0;
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Parse CSV line carefully
      const matches = line.match(/("(?:[^"]+|"")*"|[^,]*)/g);
      if (!matches || matches.length < 6) continue;
      
      const [name, category, address, phone, email, website, source] = matches.map(s => 
        s.replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"').trim()
      );
      
      if (!name || name.length < 3) continue;
      
      try {
        const existing = await prisma.business.findFirst({
          where: { name: name }
        });
        
        if (existing) {
          console.log(`⏭️  Skipping existing: ${name}`);
          skipped++;
          continue;
        }
        
        await prisma.business.create({
          data: {
            name,
            slug: name.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim(),
            category: category || 'Professional Services',
            address: address || 'Wellingborough, Northamptonshire',
            phone: phone || null,
            email: email || null,
            website: website || null,
            description: `${name} is a local ${(category || 'Professional Services').toLowerCase()} business in Wellingborough.`,
            status: 'ACTIVE',
            rating: 3.5 + Math.random() * 1.5, // Random rating between 3.5-5.0
            reviewCount: Math.floor(Math.random() * 15) + 1, // 1-15 reviews
            ownerId: user.id
          }
        });
        
        console.log(`✅ Imported: ${name}`);
        imported++;
      } catch (error: any) {
        console.error(`❌ Error importing ${name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`✅ Imported: ${imported} new businesses`);
    console.log(`⏭️  Skipped: ${skipped} existing businesses`);
    
  } catch (error: any) {
    console.error('❌ Import failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importCsvData(); 