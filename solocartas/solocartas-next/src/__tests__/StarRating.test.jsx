import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '@/app/components/shared/StarRating';

jest.mock('lucide-react', () => ({
  Star: (props) => <svg data-testid="star" {...props} />,
}));

describe('StarRating', () => {
  it('renders given number of stars', () => {
    render(<StarRating count={3} />);
    expect(screen.getAllByTestId('star')).toHaveLength(3);
  });

  it('calls onRatingChange when star clicked', () => {
    const handleChange = jest.fn();
    render(<StarRating count={5} onRatingChange={handleChange} />);
    const stars = screen.getAllByTestId('star');
    fireEvent.click(stars[2]); // third star (rating 3)
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('is readonly when readonly prop passed', () => {
    const handleChange = jest.fn();
    render(<StarRating readonly onRatingChange={handleChange} />);
    const stars = screen.getAllByTestId('star');
    fireEvent.click(stars[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
