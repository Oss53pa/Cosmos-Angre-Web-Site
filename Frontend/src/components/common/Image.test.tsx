import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Image } from './Image';

describe('Image component', () => {
  it('Image renders avec alt', () => {
    render(<Image src="/x.jpg" alt="Hello world" />);
    expect(screen.getByAltText('Hello world')).toBeInTheDocument();
  });

  it('priority=true → loading="eager"', () => {
    render(<Image src="/x.jpg" alt="hero" priority />);
    const img = screen.getByAltText('hero') as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('eager');
  });

  it('priority=false → loading="lazy"', () => {
    render(<Image src="/x.jpg" alt="lazy" />);
    const img = screen.getByAltText('lazy') as HTMLImageElement;
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('avifSrc/webpSrc → renders <source> elements', () => {
    const { container } = render(
      <Image src="/x.jpg" alt="multi" avifSrc="/x.avif" webpSrc="/x.webp" />
    );
    const sources = container.querySelectorAll('source');
    expect(sources).toHaveLength(2);
    expect(sources[0].getAttribute('type')).toBe('image/avif');
    expect(sources[1].getAttribute('type')).toBe('image/webp');
  });

  it('onLoad fires + applique opacity-100', () => {
    render(<Image src="/x.jpg" alt="fade" />);
    const img = screen.getByAltText('fade') as HTMLImageElement;
    expect(img.className).toContain('opacity-0');
    fireEvent.load(img);
    expect(img.className).toContain('opacity-100');
  });
});
