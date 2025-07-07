import { render, screen, fireEvent } from '@testing-library/react';
import CardProduct from '@/app/components/productPage/CardProduct';
import { formatPriceCLP } from '@/utils/format';
import { axe } from 'jest-axe';

jest.mock('next/image', () => (props) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

describe('utils/format', () => {
  it('formats number to Chilean peso', () => {
    expect(formatPriceCLP(1234)).toBe('$1.234');
  });
});

describe('CardProduct component', () => {
  const product = {
    id: 1,
    name: 'Charizard VMAX',
    img_url: '/charizard.png',
    min_price: 15000,
  };

  it('renders product data correctly', () => {
    render(<CardProduct product={product} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(formatPriceCLP(product.min_price))).toBeInTheDocument();
    expect(screen.getByAltText(`Carta ${product.name}`)).toBeInTheDocument();
  });

  it('navigates to product detail when clicked', () => {
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({ push: mockPush }));
    render(<CardProduct product={product} />);

    fireEvent.click(screen.getByAltText(`Carta ${product.name}`));
    expect(mockPush).toHaveBeenCalledWith(`/products/${product.id}`);
  });

  it('is accessible', async () => {
    const { container } = render(<CardProduct product={product} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<CardProduct product={product} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
