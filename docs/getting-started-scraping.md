# Getting Started with Business Scraping

## Quick Setup Guide

### 1. Install Dependencies
```bash
npm install axios cheerio openai @types/cheerio
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and add your API keys:

```bash
# Required for Google Places integration
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Required for AI content enhancement
OPENAI_API_KEY=your_openai_api_key_here

# Database connection (required)
DATABASE_URL="your_database_connection_string"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

## Scraping Commands

### Basic Web Scraping
```bash
# Scrape all configured sources and save to database
npm run scrape:all

# Export scraped data to CSV for review
npm run scrape:export
```

### Google Places API Integration
```bash
# Scrape using Google Places API (requires API key)
npm run scrape:google
```

### AI Content Enhancement
```bash
# Enhance business descriptions with AI
npm run ai:enhance

# Improve business categorization
npm run ai:categorize

# Generate review response templates
npm run ai:templates

# Generate SEO content for specific business
npm run ai:seo [business-id]
```

## Data Sources

### Configured Sources
1. **Wellingborough Town Council** - Official business directory
2. **LiveLocalAds** - Competitor analysis and business discovery
3. **Business Magnet** - Regional business listings
4. **Northampton.co.uk** - Tourism and retail businesses

### API Sources
1. **Google Places API** - Comprehensive business data with reviews
2. **OpenAI API** - Content enhancement and categorization

## Expected Results

### Initial Scraping Run
- **200-300 businesses** from Council directory
- **100-150 businesses** from competitive sources
- **500+ businesses** from Google Places API (if configured)

### After AI Enhancement
- **100% unique descriptions** for all businesses
- **Improved categorization** accuracy
- **SEO-optimized content** for better search visibility
- **Professional business profiles** ready for platform launch

## Data Quality Features

### Automatic Deduplication
- Name and address matching
- Phone number validation
- Website URL consolidation
- Geographic proximity analysis

### Content Enhancement
- AI-generated business descriptions
- Local SEO optimization
- Category accuracy improvement
- Social media profile discovery

### Verification Pipeline
- Phone number format validation
- Email address verification
- Website accessibility testing
- Address geocoding

## Troubleshooting

### Common Issues

**"GOOGLE_PLACES_API_KEY not found"**
- Add your Google Places API key to `.env.local`
- Ensure you have enabled the Google Places API in Google Cloud Console

**"Database connection error"**
- Check your `DATABASE_URL` in `.env.local`
- Run `npm run db:migrate` to ensure database is set up

**"Rate limit exceeded"**
- The scraper includes built-in rate limiting
- For Google Places API, check your quota in Google Cloud Console

**"No businesses found"**
- Website structures may have changed
- Check the documentation for updated selectors

### Performance Optimization

**For Large-Scale Scraping:**
```bash
# Process in smaller batches
npm run scrape:export  # Review data first
npm run scrape:all     # Then import to database
```

**For API Cost Control:**
- Use web scraping first to build initial dataset
- Use Google Places API for verification and enhancement
- Monitor API usage in Google Cloud Console

## Next Steps

1. **Review scraped data** in `data/scraped-businesses.csv`
2. **Verify business information** manually for top 50 businesses
3. **Run AI enhancement** to improve content quality
4. **Test business profiles** on the live platform
5. **Set up monitoring** for ongoing data updates

## Support

For technical issues or questions about the scraping process:
- Check the [main documentation](../README.md)
- Review the [business data collection strategy](./business-data-collection-strategy.md)
- Contact the development team for API key configuration help 