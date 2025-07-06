import '@testing-library/jest-dom';

// Mock next/navigation for components that use it
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
