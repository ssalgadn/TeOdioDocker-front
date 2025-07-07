import { render } from '@testing-library/react';
import Navbar from '@/app/components/Navbar';

jest.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light', setTheme: jest.fn() }) }));
jest.mock('next/navigation', () => ({ usePathname: () => '/', useRouter: () => ({ push: jest.fn() }) }));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null, isLoading: false, logout: jest.fn() }),
}));

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('next/image', () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

describe('Navbar snapshot', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Navbar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
