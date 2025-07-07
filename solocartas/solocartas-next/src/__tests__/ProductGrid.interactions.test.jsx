import { render, screen, fireEvent } from '@testing-library/react';
import ProductGrid from '@/app/components/productPage/ProductGrid';

const createSearchParams = (params = {}) =>
  new URLSearchParams(Object.entries(params));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/productos',
  useSearchParams: () => createSearchParams(),
}));

jest.mock('@/app/components/productPage/CardProduct', () => (props) => (
  <div data-testid="card-product">{props.product?.name}</div>
));
jest.mock('multi-range-slider-react', () => () => <div />);

describe('ProductGrid interactions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls router.push with filters when clicking "Aplicar filtros"', () => {
    render(<ProductGrid initialProducts={[]} />);

    fireEvent.change(screen.getByLabelText(/Buscar por nombre/i), {
      target: { value: 'Pikachu' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Aplicar filtros/i }));

    expect(mockPush).toHaveBeenCalled();
    const calledUrl = mockPush.mock.calls[0][0];
    expect(calledUrl).toMatch(/name=Pikachu/);
  });

  it('updates items per page select and pushes router', () => {
    render(<ProductGrid initialProducts={[]} />);

    fireEvent.change(screen.getByLabelText(/Items por página/i), {
      target: { value: '24' },
    });

    expect(mockPush).toHaveBeenCalled();
    expect(mockPush.mock.calls[0][0]).toMatch(/limit=24/);
  });

  it('shows message when no products found', () => {
    render(<ProductGrid initialProducts={[]} />);
    expect(
      screen.getByText(/No se encontraron cartas con esos criterios\./i)
    ).toBeInTheDocument();
  });
});
