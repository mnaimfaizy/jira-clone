# SEO Optimization Guide

This document outlines the SEO optimization implemented for the Jira Clone application.

## Overview

Comprehensive SEO optimization has been implemented including:

- Meta tags and Open Graph tags
- Twitter Card support
- Sitemap generation
- Robots.txt configuration
- Favicon and app icons
- Web app manifest for PWA support

## Files Added/Modified

### Metadata Configuration

- **[src/app/layout.tsx](src/app/layout.tsx)** - Root layout with comprehensive metadata
- **[src/lib/metadata.ts](src/lib/metadata.ts)** - Reusable metadata utilities
- **[src/app/sitemap.ts](src/app/sitemap.ts)** - Dynamic sitemap generation
- **[public/robots.txt](public/robots.txt)** - Search engine crawling rules
- **[public/manifest.json](public/manifest.json)** - PWA manifest

### Page Metadata

All authentication and main pages now include proper metadata:

- Sign In, Sign Up, Forgot Password, Reset Password
- Verify Email, Resend Verification
- Dashboard

### Icons and Images

Generated icons in the `public/` folder:

- `favicon.ico` - 32x32 browser favicon
- `icon.svg` - Scalable vector icon
- `icon-192.png` - 192x192 app icon
- `icon-512.png` - 512x512 app icon
- `apple-icon.png` - 180x180 Apple touch icon
- `og-image.png` - 1200x630 Open Graph image

## Favicon Generation

To generate the actual PNG/ICO files:

1. Open `public/generate-favicons.html` in your browser
2. Click each button to generate the icon files
3. Save each file with the exact name shown
4. Place all files in the `public/` folder

Alternatively, you can use online tools like:

- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon Generator](https://www.favicon-generator.org/)

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For local development, it defaults to `http://localhost:3001`.

## Metadata Structure

### Root Layout (Global)

- Site title with template
- Description and keywords
- Open Graph tags for social sharing
- Twitter Card tags
- Robots configuration
- Icon references
- Manifest reference

### Page-Specific Metadata

Each page can override:

- Title (using template)
- Description
- Robots directives
- Images

Example:

```typescript
export const metadata: Metadata = {
  title: "Page Title", // Becomes "Page Title | Jira Clone"
  description: "Page description",
};
```

## Robots.txt

The robots.txt file:

- Allows all crawlers
- Disallows authentication pages (sign-in, sign-up, etc.)
- Disallows API routes
- References the sitemap

## Sitemap

The sitemap is auto-generated at `/sitemap.xml` and includes:

- Homepage
- Public pages (sign-in, sign-up)
- Change frequency and priority

To add more pages, edit [src/app/sitemap.ts](src/app/sitemap.ts).

## Open Graph & Twitter Cards

All pages include:

- og:title, og:description, og:image
- twitter:card, twitter:title, twitter:description, twitter:image

Update the image at `public/og-image.png` with your branding.

## Testing SEO

### Tools

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Local Testing

```bash
# Check sitemap
curl http://localhost:3001/sitemap.xml

# Check robots.txt
curl http://localhost:3001/robots.txt

# Check manifest
curl http://localhost:3001/manifest.json

# Check metadata (view source)
curl http://localhost:3001 | grep "meta"
```

## Best Practices Implemented

✅ Unique title and description for each page  
✅ Title template for consistent branding  
✅ Open Graph tags for social sharing  
✅ Twitter Card support  
✅ Proper robots directives (noindex for auth pages)  
✅ Sitemap for search engines  
✅ Favicon and app icons (multiple sizes)  
✅ Web app manifest for PWA  
✅ Semantic HTML structure  
✅ Mobile-friendly viewport settings  
✅ Language attribute on HTML tag

## Next Steps

1. **Generate actual favicon files** using the HTML generator
2. **Create a custom OG image** at `public/og-image.png` (1200x630px)
3. **Add NEXT_PUBLIC_APP_URL** to your production environment
4. **Update robots.txt** Sitemap URL for production
5. **Submit sitemap** to Google Search Console
6. **Test social sharing** links on Facebook, Twitter, LinkedIn
7. **Add structured data** (JSON-LD) for rich snippets (optional)
8. **Monitor** with Google Analytics and Search Console

## Production Checklist

Before deploying:

- [ ] Set NEXT_PUBLIC_APP_URL in production environment
- [ ] Generate and add all favicon files
- [ ] Create custom og-image.png with branding
- [ ] Update robots.txt sitemap URL
- [ ] Test all meta tags
- [ ] Submit sitemap to search engines
- [ ] Verify Open Graph tags
- [ ] Test Twitter Cards
- [ ] Check mobile responsiveness
- [ ] Validate HTML structure

## Additional Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
