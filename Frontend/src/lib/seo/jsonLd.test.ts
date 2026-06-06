import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd,
  shoppingCenterJsonLd,
  websiteJsonLd,
  storeJsonLd,
  eventJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from './jsonLd';

describe('jsonLd', () => {
  describe('organizationJsonLd', () => {
    it('contient @context et @type Organization', () => {
      const j = organizationJsonLd();
      expect(j['@context']).toBe('https://schema.org');
      expect(j['@type']).toBe('Organization');
      expect(j.name).toBe('Cosmos Angré');
    });

    it('inclut une adresse postale et un contactPoint', () => {
      const j = organizationJsonLd();
      expect(j.address).toBeDefined();
      expect((j.address as { addressCountry: string }).addressCountry).toBe('CI');
      expect(j.contactPoint).toBeDefined();
    });
  });

  describe('shoppingCenterJsonLd', () => {
    it('expose @type ShoppingCenter avec coordonnées géo', () => {
      const j = shoppingCenterJsonLd();
      expect(j['@type']).toBe('ShoppingCenter');
      expect((j.geo as { latitude: number }).latitude).toBeCloseTo(5.385);
    });
  });

  describe('websiteJsonLd', () => {
    it('inclut une SearchAction', () => {
      const j = websiteJsonLd();
      expect(j['@type']).toBe('WebSite');
      expect((j.potentialAction as { '@type': string })['@type']).toBe('SearchAction');
    });
  });

  describe('storeJsonLd', () => {
    it('génère un Store complet à partir des champs métier', () => {
      const j = storeJsonLd({
        name: 'Nike',
        slug: 'nike',
        description: 'Boutique sport',
        category: 'Sport',
        phone: '+225 27 22',
        rating: 4.5,
      });
      expect(j['@type']).toBe('Store');
      expect(j.name).toBe('Nike');
      expect(j.url).toContain('/boutiques/nike');
      expect((j.aggregateRating as { ratingValue: number }).ratingValue).toBe(4.5);
    });

    it('omet aggregateRating si rating absent', () => {
      const j = storeJsonLd({ name: 'X', slug: 'x' });
      expect(j.aggregateRating).toBeUndefined();
    });
  });

  describe('eventJsonLd', () => {
    it('combine date et heure en startDate ISO', () => {
      const j = eventJsonLd({
        title: 'Gala',
        slug: 'gala',
        start_date: '2026-12-15',
        start_time: '18:00',
      });
      expect(j.startDate).toBe('2026-12-15T18:00');
      expect(j['@type']).toBe('Event');
    });

    it('marque cancelled correctement', () => {
      const j = eventJsonLd({ title: 'X', slug: 'x', status: 'cancelled' });
      expect(j.eventStatus).toBe('https://schema.org/EventCancelled');
    });
  });

  describe('articleJsonLd', () => {
    it('inclut author, headline et image absolue', () => {
      const j = articleJsonLd({
        title: 'Test',
        slug: 'test',
        excerpt: 'Excerpt',
        featured_image: '/img.jpg',
        author_name: 'John',
        publish_date: '2026-01-01',
      });
      expect(j.headline).toBe('Test');
      expect((j.author as { name: string }).name).toBe('John');
      expect((j.image as string[])[0]).toMatch(/^https:\/\//);
    });
  });

  describe('breadcrumbJsonLd', () => {
    it('numérote correctement les positions', () => {
      const j = breadcrumbJsonLd([
        { name: 'A', url: '/' },
        { name: 'B', url: '/b' },
        { name: 'C', url: '/b/c' },
      ]);
      const items = j.itemListElement as { position: number; name: string }[];
      expect(items).toHaveLength(3);
      expect(items[0]?.position).toBe(1);
      expect(items[2]?.position).toBe(3);
    });
  });

  describe('faqJsonLd', () => {
    it('génère un FAQPage avec mainEntity', () => {
      const j = faqJsonLd([{ question: 'Q1?', answer: 'A1' }]);
      expect(j['@type']).toBe('FAQPage');
      const entities = j.mainEntity as { '@type': string }[];
      expect(entities[0]?.['@type']).toBe('Question');
    });
  });
});
