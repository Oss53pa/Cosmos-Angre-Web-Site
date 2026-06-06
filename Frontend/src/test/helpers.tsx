import React from 'react';
import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

interface ProvidersProps {
  initialEntries?: string[];
  helmetContext?: { helmet?: unknown };
}

export const TestProviders: React.FC<ProvidersProps & { children: React.ReactNode }> = ({
  children,
  initialEntries = ['/'],
  helmetContext = {},
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <HelmetProvider context={helmetContext}>{children}</HelmetProvider>
  </MemoryRouter>
);

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries, helmetContext, ...rest }: ProvidersProps & RenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders initialEntries={initialEntries} helmetContext={helmetContext}>
        {children}
      </TestProviders>
    ),
    ...rest,
  });
}
