import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import Language from '../components/language/Language';

window.React = React;

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('Language Component', () => {
    const mockPush = jest.fn();
    const mockRouter = {
        locale: 'en',
        pathname: '/test',
        asPath: '/test',
        query: {},
        push: mockPush,
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders Language component with default locale', () => {
        render(<Language />);

        expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/english/i)).toBeInTheDocument();
    });

    test('changes language to Español', () => {
        render(<Language />);

        fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'es' } });

        expect(mockPush).toHaveBeenCalledWith(
            { pathname: mockRouter.pathname, query: mockRouter.query },
            mockRouter.asPath,
            { locale: 'es' }
        );
    });

    test('changes language to English', () => {
        mockRouter.locale = 'es';
        render(<Language />);

        fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'en' } });

        expect(mockPush).toHaveBeenCalledWith(
            { pathname: mockRouter.pathname, query: mockRouter.query },
            mockRouter.asPath,
            { locale: 'en' }
        );
    });
});