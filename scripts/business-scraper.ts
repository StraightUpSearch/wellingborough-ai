import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface ScrapedBusiness {
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  address: string;
  addressLine2?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: any;
  services?: string[];
  specialties?: string[];
  latitude?: number;
  longitude?: number;
  source: string;
  sourceUrl?: string;
}

export class BusinessScraper {
  private scrapingBeeApiKey: string | null = null;
  
  private sources = [
    {
      name: 'Wellingborough Town Council',
      url: 'https://www.wellingboroughtowncouncil.gov.uk/business-directory/',
      enabled: true,
      useScrapingBee: true // Enable for better results
    },
    {
      name: 'LiveLocalAds',
      url: 'https://livelocalads.co.uk/search-for-local-businesses/',
      enabled: true,
      useScrapingBee: true // Enable for JavaScript content
    },
    {
      name: 'Business Magnet',
      url: 'https://www.businessmagnet.co.uk/town/wellingborough.htm',
      enabled: true,
      useScrapingBee: true // Help with 403 errors
    },
    {
      name: 'Northampton.co.uk',
      url: 'https://www.northampton.co.uk/in/wellingborough/',
      enabled: true,
      useScrapingBee: true // Handle complex JavaScript
    }
  ];

  private businessCategories = [
    'Food & Drink',
    'Retail',
    'Health & Beauty',
    'Professional Services',
    'Home & Garden',
    'Automotive',
    'Entertainment',
    'Education',
    'Technology',
    'Property',
    'Sports & Fitness',
    'Charity & Community'
  ];

  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  constructor(scrapingBeeApiKey?: string) {
    this.scrapingBeeApiKey = scrapingBeeApiKey || process.env.SCRAPINGBEE_API_KEY || null;
    this.setupAxios();
  }

  private setupAxios() {
    axios.defaults.headers.common['User-Agent'] = this.userAgent;
    axios.defaults.timeout = 30000;
    axios.defaults.maxRedirects = 5;
  }

  /**
   * Enhanced web scraping using ScrapingBee API
   */
  private async scrapeWithScrapingBee(url: string): Promise<string> {
    if (!this.scrapingBeeApiKey) {
      throw new Error('ScrapingBee API key not provided');
    }

    const scrapingBeeUrl = 'https://app.scrapingbee.com/api/v1/';
    
    try {
      console.log(`🐝 Using ScrapingBee to scrape: ${url}`);
      
      const response = await axios.get(scrapingBeeUrl, {
        params: {
          api_key: this.scrapingBeeApiKey,
          url: url,
          render_js: 'true', // Enable JavaScript rendering
          wait: '3000', // Wait 3 seconds for content to load
          window_width: '1920',
          window_height: '1080'
        },
        timeout: 45000 // Longer timeout for ScrapingBee
      });

      console.log(`✅ ScrapingBee successful for: ${url}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ ScrapingBee failed for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Fallback to direct scraping if ScrapingBee fails
   */
  private async scrapeDirectly(url: string): Promise<string> {
    console.log(`🔄 Fallback direct scraping: ${url}`);
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * Smart scraping method that tries ScrapingBee first, then fallback
   */
  private async smartScrape(url: string, useScrapingBee: boolean = true): Promise<string> {
    if (useScrapingBee && this.scrapingBeeApiKey) {
      try {
        return await this.scrapeWithScrapingBee(url);
      } catch (error) {
        console.warn(`⚠️  ScrapingBee failed, trying direct scraping...`);
        return await this.scrapeDirectly(url);
      }
    } else {
      return await this.scrapeDirectly(url);
    }
  }

  /**
   * Main scraping orchestrator
   */
  async scrapeAllSources(): Promise<ScrapedBusiness[]> {
    console.log('🚀 Starting business scraping from all sources...');
    
    if (this.scrapingBeeApiKey) {
      console.log('🐝 ScrapingBee API enabled for enhanced scraping');
    } else {
      console.log('⚠️  No ScrapingBee API key - using direct scraping only');
    }
    
    const allBusinesses: ScrapedBusiness[] = [];
    
    for (const source of this.sources) {
      if (!source.enabled) continue;
      
      try {
        console.log(`📡 Scraping ${source.name}...`);
        const businesses = await this.scrapeSource(source);
        allBusinesses.push(...businesses);
        console.log(`✅ Found ${businesses.length} businesses from ${source.name}`);
        
        // Rate limiting - be respectful
        await this.delay(3000); // Longer delay for ScrapingBee
      } catch (error: any) {
        console.error(`❌ Error scraping ${source.name}:`, error.message);
      }
    }

    console.log(`🎯 Total businesses found: ${allBusinesses.length}`);
    return this.deduplicateBusinesses(allBusinesses);
  }

  /**
   * Scrape individual source based on its type
   */
  private async scrapeSource(source: any): Promise<ScrapedBusiness[]> {
    switch (source.name) {
      case 'Wellingborough Town Council':
        return await this.scrapeWellingboroughCouncil(source.url, source.useScrapingBee);
      case 'LiveLocalAds':
        return await this.scrapeLiveLocalAds(source.url, source.useScrapingBee);
      case 'Business Magnet':
        return await this.scrapeBusinessMagnet(source.url, source.useScrapingBee);
      case 'Northampton.co.uk':
        return await this.scrapeNorthampton(source.url, source.useScrapingBee);
      default:
        return [];
    }
  }

  /**
   * Enhanced Wellingborough Town Council scraping
   */
  private async scrapeWellingboroughCouncil(url: string, useScrapingBee: boolean = true): Promise<ScrapedBusiness[]> {
    try {
      const html = await this.smartScrape(url, useScrapingBee);
      const $ = cheerio.load(html);
      const businesses: ScrapedBusiness[] = [];

      console.log('🏛️ Parsing Wellingborough Council business directory...');
      
      // The council directory uses FAQ-style collapsible sections
      // Each section has a question (category) and answer (business links)
      $('.q-and-a').each((index, sectionElement) => {
        const $section = $(sectionElement);
        
        // Extract category from the question
        const categoryText = $section.find('.question a').text().trim();
        const category = this.mapCouncilCategoryToOurCategory(categoryText);
        
        console.log(`📂 Processing category: ${categoryText} → ${category}`);
        
        // Extract business links from the answer
        const $answer = $section.find('.answer');
        
        // Find all business links in this category
        $answer.find('a').each((linkIndex, linkElement) => {
          const $link = $(linkElement);
          const businessName = $link.text().trim();
          const businessUrl = $link.attr('href');
          
          // Skip empty or invalid links
          if (!businessName || businessName.length < 3 || !businessUrl) return;
          
          // Clean up business name
          const cleanName = businessName
            .replace(/^[\d\s\-–]+/, '') // Remove leading numbers/dashes
            .replace(/\s*–\s*.+$/, '') // Remove everything after dash (often descriptions)
            .trim();
          
          if (cleanName.length < 3) return;
          
          console.log(`  ✓ Found business: ${cleanName}`);
          
          businesses.push({
            name: cleanName,
            category: category,
            address: 'Wellingborough, Northamptonshire', // Default address
            source: 'Wellingborough Town Council',
            sourceUrl: businessUrl?.startsWith('http') ? businessUrl : 
                      businessUrl?.startsWith('/') ? `https://www.wellingboroughtowncouncil.gov.uk${businessUrl}` : 
                      url,
            description: `${cleanName} is a local ${category.toLowerCase()} business listed in the Wellingborough Town Council business directory.`
          });
        });
      });

      console.log(`🎯 Found ${businesses.length} businesses from Council directory`);
      return this.deduplicateBusinesses(businesses);
      
    } catch (error: any) {
      console.error('Error scraping Wellingborough Council:', error.message);
      return [];
    }
  }

  /**
   * Map Council category names to our standardized categories
   */
  private mapCouncilCategoryToOurCategory(councilCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'Community': 'Community Services',
      'Retail': 'Retail',
      'Food and Drink': 'Food & Drink',
      'Health and Beauty': 'Health & Beauty',
      'Business Support': 'Professional Services',
      'Estate Agents and Chartered Surveyors': 'Property Services',
      'Education': 'Education',
      'Transport': 'Transport',
      'Places of Worship': 'Community Services',
      'Other Services': 'Professional Services',
      'Places to Stay': 'Accommodation'
    };
    
    return categoryMap[councilCategory] || 'Professional Services';
  }

  /**
   * Enhanced LiveLocalAds scraping
   */
  private async scrapeLiveLocalAds(url: string, useScrapingBee: boolean = true): Promise<ScrapedBusiness[]> {
    try {
      const html = await this.smartScrape(url, useScrapingBee);
      const $ = cheerio.load(html);
      const businesses: ScrapedBusiness[] = [];

      // Enhanced selectors for LiveLocalAds
      const selectors = [
        '.business-card',
        '.listing-item',
        '.business-profile',
        '.search-result',
        '.business-listing',
        '.directory-item',
        'div:contains("Telephone")',
        'div:contains("Email")',
        'p:contains("01933")', // Local phone numbers
        'a[href*="mailto"]'
      ];

      for (const selector of selectors) {
        $(selector).each((index, element) => {
          const $element = $(element);
          const businessInfo = this.parseBusinessElement($element);
          if (businessInfo.name && businessInfo.category && businessInfo.address) {
            businesses.push({
              name: businessInfo.name,
              description: businessInfo.description,
              category: businessInfo.category,
              subcategory: businessInfo.subcategory,
              address: businessInfo.address,
              addressLine2: businessInfo.addressLine2,
              postcode: businessInfo.postcode,
              phone: businessInfo.phone,
              email: businessInfo.email,
              website: businessInfo.website,
              openingHours: businessInfo.openingHours,
              services: businessInfo.services,
              specialties: businessInfo.specialties,
              latitude: businessInfo.latitude,
              longitude: businessInfo.longitude,
              source: 'LiveLocalAds',
              sourceUrl: url
            });
          }
        });
      }

      return this.deduplicateBusinesses(businesses);
    } catch (error: any) {
      console.error('Error scraping LiveLocalAds:', error.message);
      return [];
    }
  }

  /**
   * Enhanced Business Magnet scraping
   */
  private async scrapeBusinessMagnet(url: string, useScrapingBee: boolean = true): Promise<ScrapedBusiness[]> {
    try {
      const html = await this.smartScrape(url, useScrapingBee);
      const $ = cheerio.load(html);
      const businesses: ScrapedBusiness[] = [];

      // Target table rows and directory entries
      $('tr, .business-listing, .company-listing, .directory-entry').each((index, element) => {
        const $element = $(element);
        const businessInfo = this.parseBusinessElement($element);
        if (businessInfo.name && businessInfo.category && businessInfo.address && !businessInfo.name.includes('Company Name')) {
          businesses.push({
            name: businessInfo.name,
            description: businessInfo.description,
            category: businessInfo.category,
            subcategory: businessInfo.subcategory,
            address: businessInfo.address,
            addressLine2: businessInfo.addressLine2,
            postcode: businessInfo.postcode,
            phone: businessInfo.phone,
            email: businessInfo.email,
            website: businessInfo.website,
            openingHours: businessInfo.openingHours,
            services: businessInfo.services,
            specialties: businessInfo.specialties,
            latitude: businessInfo.latitude,
            longitude: businessInfo.longitude,
            source: 'Business Magnet',
            sourceUrl: url
          });
        }
      });

      return this.deduplicateBusinesses(businesses);
    } catch (error: any) {
      console.error('Error scraping Business Magnet:', error.message);
      return [];
    }
  }

  /**
   * Enhanced Northampton.co.uk scraping
   */
  private async scrapeNorthampton(url: string, useScrapingBee: boolean = true): Promise<ScrapedBusiness[]> {
    try {
      const html = await this.smartScrape(url, useScrapingBee);
      const $ = cheerio.load(html);
      const businesses: ScrapedBusiness[] = [];

      $('.listing, .business-entry, .directory-item, .business-info').each((index, element) => {
        const $element = $(element);
        const businessInfo = this.parseBusinessElement($element);
        if (businessInfo.name && businessInfo.category && businessInfo.address) {
          businesses.push({
            name: businessInfo.name,
            description: businessInfo.description,
            category: businessInfo.category,
            subcategory: businessInfo.subcategory,
            address: businessInfo.address,
            addressLine2: businessInfo.addressLine2,
            postcode: businessInfo.postcode,
            phone: businessInfo.phone,
            email: businessInfo.email,
            website: businessInfo.website,
            openingHours: businessInfo.openingHours,
            services: businessInfo.services,
            specialties: businessInfo.specialties,
            latitude: businessInfo.latitude,
            longitude: businessInfo.longitude,
            source: 'Northampton.co.uk',
            sourceUrl: url
          });
        }
      });

      return this.deduplicateBusinesses(businesses);
    } catch (error: any) {
      console.error('Error scraping Northampton:', error.message);
      return [];
    }
  }

  /**
   * Parse business information from element
   */
  private parseBusinessElement($element: any): Partial<ScrapedBusiness> {
    const text = $element.text().trim();
    const html = $element.html() || '';
    
    // Extract business name (multiple strategies)
    let name = $element.find('.business-name, h3, h2, .title, .name, strong, b, td:first-child, .company-name, a').first().text().trim();
    
    if (!name) {
      // Try to extract from text patterns
      const lines = text.split('\n').filter((line: string) => line.trim().length > 3);
      name = lines[0]?.trim() || '';
    }
    
    if (!name || name.length < 3) return {};
    
    const description = $element.find('.business-description, .description, .summary, .details, td:nth-child(2)').text().trim();
    const category = $element.find('.category, .business-type, .sector').text().trim();
    
    return {
      name,
      description: description || undefined,
      category: category || this.categorizeFromText(name + ' ' + description),
      address: this.extractAddress(text) || 'Wellingborough, Northamptonshire',
      phone: this.extractPhone(text),
      email: this.extractEmail(text),
      website: this.extractWebsite(html)
    };
  }

  /**
   * Parse business information from text
   */
  private parseBusinessText(text: string): Partial<ScrapedBusiness> {
    const lines = text.split('\n').filter(line => line.trim().length > 3);
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip lines that are clearly not business names
      if (trimmedLine.length < 5 || 
          trimmedLine.includes('Phone:') || 
          trimmedLine.includes('Email:') ||
          trimmedLine.includes('Website:') ||
          trimmedLine.startsWith('Tel:') ||
          trimmedLine.startsWith('www.')) continue;
      
      // Extract potential business name
      const businessName = trimmedLine.split(/[,\-\|]/)[0].trim();
      
      if (businessName && businessName.length > 3) {
        return {
          name: businessName,
          description: text.length > businessName.length ? text.substring(businessName.length + 1, 200) : undefined,
          category: this.categorizeFromText(businessName + ' ' + text),
          address: this.extractAddress(text) || 'Wellingborough, Northamptonshire',
          phone: this.extractPhone(text),
          email: this.extractEmail(text),
          website: this.extractWebsite(text)
        };
      }
    }
    
    return {};
  }

  /**
   * Extract business patterns from large text blocks
   */
  private extractBusinessPatternsFromText(text: string): Partial<ScrapedBusiness>[] {
    const businesses: Partial<ScrapedBusiness>[] = [];
    
    // Look for business patterns like "Business Name - Phone: 01933..."
    const businessRegex = /([A-Z][A-Za-z\s&'-]+(?:Ltd|Limited|LLP|plc)?)\s*[-–]\s*(?:Phone|Tel|Telephone)?\s*:?\s*(01\d{3}\s?\d{6})/g;
    
    let match;
    while ((match = businessRegex.exec(text)) !== null) {
      const name = match[1].trim();
      const phone = match[2].trim();
      
      if (name.length > 3 && name.length < 100) {
        businesses.push({
          name,
          phone,
          category: this.categorizeFromText(name),
          address: 'Wellingborough, Northamptonshire'
        });
      }
    }
    
    return businesses;
  }

  // Utility functions
  private extractPhone(text: string): string | undefined {
    const ukPhoneRegex = /(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)/;
    
    const match = text.match(ukPhoneRegex);
    return match ? match[0].trim() : undefined;
  }

  private extractEmail(text: string): string | undefined {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = text.match(emailRegex);
    return match ? match[0] : undefined;
  }

  private extractWebsite(text: string): string | undefined {
    const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = text.match(websiteRegex);
    if (match) {
      const url = match[0];
      return url.startsWith('http') ? url : `https://${url}`;
    }
    return undefined;
  }

  private extractAddress(text: string): string | undefined {
    // Look for UK address patterns including Wellingborough specific postcodes
    const addressRegex = /(?:\d+\s+)?[A-Za-z\s,]+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Close|Cl|Drive|Dr|Way|Place|Pl|Square|Sq|Court|Ct|Crescent|Cres|Gardens|Gdns|Walk|Hill|Green)[A-Za-z\s,]*(?:NN\d+\s*\d[A-Z]{2})?/i;
    const match = text.match(addressRegex);
    return match ? match[0].trim() : undefined;
  }

  private categorizeFromText(text: string): string {
    const lowercaseText = text.toLowerCase();
    
    const categoryKeywords = {
      'Food & Drink': ['restaurant', 'cafe', 'pub', 'bar', 'takeaway', 'food', 'catering', 'bakery', 'coffee', 'dining', 'pizza', 'chinese', 'indian', 'fish', 'chips'],
      'Retail': ['shop', 'store', 'boutique', 'retail', 'clothes', 'fashion', 'gifts', 'florist', 'newsagent', 'supermarket', 'pharmacy', 'chemist'],
      'Health & Beauty': ['salon', 'spa', 'beauty', 'health', 'dental', 'medical', 'pharmacy', 'optician', 'physiotherapy', 'massage', 'nails', 'barber', 'hairdresser'],
      'Professional Services': ['solicitor', 'accountant', 'lawyer', 'consultant', 'service', 'agency', 'financial', 'insurance', 'estate agent', 'recruitment'],
      'Home & Garden': ['garden', 'home', 'furniture', 'diy', 'cleaning', 'maintenance', 'decorating', 'plumbing', 'electrical', 'landscaping'],
      'Automotive': ['garage', 'car', 'auto', 'motor', 'vehicle', 'repair', 'mot', 'tyres', 'parts', 'dealership'],
      'Technology': ['computer', 'tech', 'digital', 'web', 'software', 'it', 'mobile', 'repair', 'development'],
      'Property': ['estate', 'property', 'letting', 'rent', 'building', 'construction', 'surveyor', 'architect'],
      'Education': ['school', 'college', 'training', 'tuition', 'education', 'nursery', 'childcare'],
      'Sports & Fitness': ['gym', 'fitness', 'sport', 'football', 'rugby', 'tennis', 'swimming', 'martial arts']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        return category;
      }
    }

    return 'Professional Services'; // Default category
  }

  private mapGooglePlaceType(types: string[]): string {
    const typeMapping: Record<string, string> = {
      'restaurant': 'Food & Drink',
      'food': 'Food & Drink',
      'meal_takeaway': 'Food & Drink',
      'cafe': 'Food & Drink',
      'bar': 'Food & Drink',
      'store': 'Retail',
      'clothing_store': 'Retail',
      'shoe_store': 'Retail',
      'health': 'Health & Beauty',
      'beauty_salon': 'Health & Beauty',
      'hair_care': 'Health & Beauty',
      'dentist': 'Health & Beauty',
      'lawyer': 'Professional Services',
      'accounting': 'Professional Services',
      'insurance_agency': 'Professional Services',
      'real_estate_agency': 'Property',
      'car_dealer': 'Automotive',
      'car_repair': 'Automotive',
      'gas_station': 'Automotive',
      'electronics_store': 'Technology',
      'gym': 'Sports & Fitness',
      'school': 'Education'
    };

    for (const type of types) {
      if (typeMapping[type]) {
        return typeMapping[type];
      }
    }

    return 'Professional Services';
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private deduplicateBusinesses(businesses: ScrapedBusiness[]): ScrapedBusiness[] {
    const seen = new Set();
    return businesses.filter(business => {
      const key = `${business.name.toLowerCase()}-${business.address.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private async getOrCreateScrapedBusinessOwner(): Promise<string> {
    const email = 'scraped-businesses@wellingborough.ai';
    
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: 'Scraped Business Data',
          role: 'business',
          password: 'temp-scraped-user-password' // Temporary password for scraped business owner
        }
      });
    }
    
    return user.id;
  }

  /**
   * Enhanced Google Places API integration
   */
  async scrapeGooglePlaces(apiKey: string, location = 'Wellingborough, UK'): Promise<ScrapedBusiness[]> {
    console.log('📍 Scraping Google Places API...');
    const businesses: ScrapedBusiness[] = [];
    
    try {
      // Search for businesses in different categories
      for (const category of this.businessCategories) {
        await this.delay(1000); // Rate limiting
        
        const searchQuery = `${category} in ${location}`;
        const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
        
        const response = await axios.get(placesUrl);
        const results = response.data.results || [];
        
        for (const place of results) {
          // Get place details
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,types,geometry,business_status&key=${apiKey}`;
          
          try {
            const detailsResponse = await axios.get(detailsUrl);
            const details = detailsResponse.data.result;
            
            if (details && details.business_status === 'OPERATIONAL') {
              businesses.push({
                name: details.name,
                category: this.mapGooglePlaceType(details.types),
                address: details.formatted_address,
                phone: details.formatted_phone_number,
                website: details.website,
                latitude: details.geometry?.location?.lat,
                longitude: details.geometry?.location?.lng,
                openingHours: details.opening_hours,
                source: 'Google Places API'
              });
            }
            
            await this.delay(100); // API rate limiting
          } catch (detailError: any) {
            console.warn('Error fetching place details:', detailError.message);
          }
        }
        
        console.log(`✅ Found ${results.length} businesses for ${category}`);
      }
      
      return businesses;
    } catch (error: any) {
      console.error('Error with Google Places API:', error.message);
      return [];
    }
  }

  /**
   * Save businesses to database
   */
  async saveToDatabase(businesses: ScrapedBusiness[]): Promise<void> {
    console.log(`💾 Saving ${businesses.length} businesses to database...`);
    
    for (const business of businesses) {
      try {
        // Check if business already exists
        const existing = await prisma.business.findFirst({
          where: {
            OR: [
              { name: business.name },
              { 
                AND: [
                  { address: { contains: business.address.split(',')[0] } },
                  { name: { contains: business.name.split(' ')[0] } }
                ]
              }
            ]
          }
        });

        if (existing) {
          console.log(`⏭️  Skipping duplicate: ${business.name}`);
          continue;
        }

        // Create business record
        await prisma.business.create({
          data: {
            name: business.name,
            slug: this.generateSlug(business.name),
            description: business.description,
            category: business.category,
            subcategory: business.subcategory,
            address: business.address,
            addressLine2: business.addressLine2,
            postcode: business.postcode,
            phone: business.phone,
            email: business.email,
            website: business.website,
            latitude: business.latitude,
            longitude: business.longitude,
            openingHours: business.openingHours ? JSON.stringify(business.openingHours) : null,
            services: business.services ? JSON.stringify(business.services) : null,
            specialties: business.specialties ? JSON.stringify(business.specialties) : null,
            status: 'ACTIVE',
            // Create a temporary user for scraped businesses
            ownerId: await this.getOrCreateScrapedBusinessOwner()
          }
        });
        
        console.log(`✅ Saved: ${business.name}`);
      } catch (error: any) {
        console.error(`❌ Error saving ${business.name}:`, error.message);
      }
    }
  }

  /**
   * Export businesses to CSV for review
   */
  async exportToCSV(businesses: ScrapedBusiness[], filename = 'scraped-businesses.csv'): Promise<void> {
    const csvHeader = 'Name,Category,Address,Phone,Email,Website,Source\n';
    const csvRows = businesses.map(b => 
      `"${b.name}","${b.category}","${b.address}","${b.phone || ''}","${b.email || ''}","${b.website || ''}","${b.source}"`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    // Ensure data directory exists
    try {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    
    await fs.writeFile(path.join(process.cwd(), 'data', filename), csvContent);
    console.log(`📊 Exported ${businesses.length} businesses to ${filename}`);
  }

  /**
   * Test Council directory scraping specifically
   */
  async scrapeCouncilDirectoryOnly(): Promise<ScrapedBusiness[]> {
    console.log('🏛️ Testing Wellingborough Council directory scraping...');
    
    const councilUrl = 'https://www.wellingboroughtowncouncil.gov.uk/business-directory/';
    const businesses = await this.scrapeWellingboroughCouncil(councilUrl, false); // Don't use ScrapingBee for testing
    
    console.log(`\n📊 RESULTS SUMMARY:`);
    console.log(`Total businesses found: ${businesses.length}`);
    
    // Group by category for summary
    const categoryCounts: { [key: string]: number } = {};
    businesses.forEach(business => {
      categoryCounts[business.category] = (categoryCounts[business.category] || 0) + 1;
    });
    
    console.log('\n📂 Businesses by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} businesses`);
    });
    
    return businesses;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const scraper = new BusinessScraper();
  
  try {
    switch (command) {
      case 'council-test':
        const councilBusinesses = await scraper.scrapeCouncilDirectoryOnly();
        await scraper.exportToCSV(councilBusinesses, 'council-directory-test.csv');
        console.log('✅ Council directory data exported to council-directory-test.csv');
        break;
        
      case 'council-import':
        const businesses = await scraper.scrapeCouncilDirectoryOnly();
        await scraper.saveToDatabase(businesses);
        console.log('✅ Council directory businesses imported to database');
        break;
        
      case 'scrape':
        const allBusinesses = await scraper.scrapeAllSources();
        await scraper.exportToCSV(allBusinesses);
        console.log('✅ All businesses scraped and exported');
        break;
        
      case 'google':
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
          console.error('❌ GOOGLE_PLACES_API_KEY environment variable not set');
          process.exit(1);
        }
        const googleBusinesses = await scraper.scrapeGooglePlaces(apiKey);
        await scraper.exportToCSV(googleBusinesses, 'google-places-businesses.csv');
        console.log('✅ Google Places businesses exported');
        break;
        
      case 'export':
        // This will read from database and export existing businesses
        console.log('📊 Exporting existing businesses from database...');
        // Implementation would go here
        break;
        
      default:
        console.log(`
🔧 Business Scraper Commands:

  council-test    Test scraping the Council directory only (exports to CSV)
  council-import  Scrape Council directory and import to database
  scrape          Scrape all sources and export to CSV
  google          Scrape Google Places API (requires GOOGLE_PLACES_API_KEY)
  export          Export existing businesses from database to CSV

Examples:
  npm run scrape:council-test
  npm run scrape:council-import
  npm run scrape:all
        `);
        break;
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
} 