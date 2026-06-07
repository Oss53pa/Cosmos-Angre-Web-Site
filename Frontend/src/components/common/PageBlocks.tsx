import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Reveal from './Reveal';

/**
 * Rend les blocs de contenu additionnels d'une page (cosmos.page_blocks),
 * gérés depuis l'admin (Console → Blocs de page). Inséré une seule fois dans
 * PublicLayout, sous le contenu de chaque page. Aucun bloc → rien n'est rendu.
 */
export interface PageBlock {
  id: string;
  page_path: string;
  type: 'heading' | 'paragraph' | 'image' | 'cta' | 'html';
  title: string | null;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  align: 'left' | 'center';
  variant: 'light' | 'dark';
  sort: number;
  is_visible: boolean;
}

const PageBlocks: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await (
          supabase as unknown as {
            from: (t: string) => {
              select: (c: string) => {
                eq: (
                  c: string,
                  v: string
                ) => {
                  eq: (
                    c: string,
                    v: boolean
                  ) => {
                    order: (
                      c: string,
                      o: { ascending: boolean }
                    ) => Promise<{ data: PageBlock[] | null; error: unknown }>;
                  };
                };
              };
            };
          }
        )
          .from('page_blocks')
          .select('*')
          .eq('page_path', path)
          .eq('is_visible', true)
          .order('sort', { ascending: true });
        if (active && !error && data) setblocksSafe(data);
      } catch {
        /* ignore */
      }
    })();
    function setblocksSafe(d: PageBlock[]) {
      if (active) setBlocks(d);
    }
    return () => {
      active = false;
    };
  }, [path]);

  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((b) => {
        const dark = b.variant === 'dark';
        const center = b.align === 'center';
        return (
          <section
            key={b.id}
            className={`section ${dark ? 'section-dark' : 'bg-cosmos-warm'}`}
          >
            <div className={`container-cosmos ${center ? 'text-center' : ''}`}>
              <Reveal>
                <div className={center ? 'max-w-3xl mx-auto' : 'max-w-3xl'}>
                  {b.title && (
                    <h2
                      className={`font-cormorant text-3xl md:text-4xl font-light mb-4 ${
                        dark ? 'text-cosmos-cream' : 'text-cosmos-night'
                      }`}
                    >
                      {b.title}
                    </h2>
                  )}

                  {b.type === 'image' && b.image_url && (
                    <img
                      src={b.image_url}
                      alt={b.title || ''}
                      className="w-full rounded-xl object-cover mb-4"
                      loading="lazy"
                    />
                  )}

                  {b.type === 'html' && b.body && (
                    <div
                      className={`font-inter font-light leading-relaxed space-y-4 ${
                        dark ? 'text-cosmos-cream/80' : 'text-cosmos-night/80'
                      }`}
                      dangerouslySetInnerHTML={{ __html: b.body }}
                    />
                  )}

                  {(b.type === 'paragraph' || b.type === 'heading') && b.body && (
                    <p
                      className={`font-inter font-light leading-relaxed whitespace-pre-line ${
                        dark ? 'text-cosmos-cream/80' : 'text-cosmos-night/80'
                      }`}
                    >
                      {b.body}
                    </p>
                  )}

                  {b.type === 'cta' && b.link_url && (
                    <div className={center ? 'mt-6' : 'mt-6'}>
                      {b.link_url.startsWith('http') ? (
                        <a href={b.link_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          {b.link_label || 'En savoir plus'}
                        </a>
                      ) : (
                        <Link to={b.link_url} className="btn-primary">
                          {b.link_label || 'En savoir plus'}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default PageBlocks;
