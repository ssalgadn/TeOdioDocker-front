import '@testing-library/jest-dom';

import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

jest.mock('next/navigation', () => {
  const actualNav = jest.requireActual('next/navigation');
  return {
    ...actualNav,
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});
