import { render, screen } from '@testing-library/react';
import ProductGrid from '@/app/components/productPage/ProductGrid';

jest.mock('@/app/components/productPage/CardProduct', () => (props) => (
  <div data-testid="card-product">{props.product.name}</div>
));

jest.mock('multi-range-slider-react', () => () => (
  <div data-testid="slider" />
));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/productos',
  useSearchParams: () => new URLSearchParams(),
}));

describe('ProductGrid', () => {
  const sampleProducts = [
    { id: 1, name: 'Carta 1' },
    { id: 2, name: 'Carta 2' },
    { id: 3, name: 'Carta 3' },
  ];

  it('renders correct number of CardProduct components', async () => {
    render(<ProductGrid initialProducts={sampleProducts} />);
    const cards = await screen.findAllByTestId('card-product');
    expect(cards).toHaveLength(sampleProducts.length);
  });

  it('shows loading fallback when initialProducts is undefined', () => {
    render(<ProductGrid initialProducts={undefined} />);
    expect(screen.getByText(/Cargando productos\.\.\./i)).toBeInTheDocument();
  });
});
