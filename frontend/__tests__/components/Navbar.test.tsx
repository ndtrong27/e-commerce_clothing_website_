
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../../src/components/Navbar';
import { useCart } from '../../src/hooks/useCart';

// Mock useCart hook
jest.mock('../../src/hooks/useCart');

describe('Navbar Component', () => {
    it('renders the brand name', () => {
        (useCart as unknown as jest.Mock).mockReturnValue([]);
        render(<Navbar />);
        expect(screen.getByText('StyleStore')).toBeInTheDocument();
    });

    it('displays cart item count when items exist', () => {
        (useCart as unknown as jest.Mock).mockReturnValue([{ id: '1', quantity: 3 }]);
        render(<Navbar />);
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not display badge when cart is empty', () => {
        (useCart as unknown as jest.Mock).mockReturnValue([]);
        render(<Navbar />);
        const badge = screen.queryByText('0');
        expect(badge).not.toBeInTheDocument();
    });
});
