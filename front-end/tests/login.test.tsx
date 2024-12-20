import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import UserLoginForm from '../components/users/UserLoginForm';
import UserService from '../services/UserService';
import { useTranslation } from 'next-i18next';

window.React = React;

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../services/UserService');
jest.mock('next-i18next', () => ({
    useTranslation: jest.fn(),
}));

describe('UserLoginForm Component', () => {
    const mockPush = jest.fn();
    const mockRouter = {
        push: mockPush,
    };

    const t = jest.fn((key) => key);

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useTranslation as jest.Mock).mockReturnValue({ t });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders UserLoginForm component', () => {
        render(<UserLoginForm />);

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login.button/i })).toBeInTheDocument();
    });

    test('shows validation errors when fields are empty', async () => {
        render(<UserLoginForm />);

        fireEvent.click(screen.getByRole('button', { name: /login.button/i }));

        await waitFor(() => {
            expect(screen.getByText(/login.validate.name/i)).toBeInTheDocument();
            expect(screen.getByText(/login.validate.password/i)).toBeInTheDocument();
        });
    });

    test('calls UserService.loginUser on form submission', async () => {
        const mockLoginUser = UserService.loginUser as jest.Mock;
        mockLoginUser.mockResolvedValue({
            status: 200,
            json: async () => ({
                token: 'mockToken',
                fullname: 'Mock User',
                username: 'mockuser',
                role: 'user',
            }),
        });

        render(<UserLoginForm />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'mockuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'mockpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login.button/i }));

        await waitFor(() => {
            expect(mockLoginUser).toHaveBeenCalledWith({ username: 'mockuser', password: 'mockpassword' });
        });

        // Wait for the setTimeout to complete
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        }, { timeout: 3000 });
    });

    test('shows error message on invalid credentials', async () => {
        const mockLoginUser = UserService.loginUser as jest.Mock;
        mockLoginUser.mockResolvedValue({
            status: 401,
            json: async () => ({
                errorMessage: 'Invalid credentials',
            }),
        });

        render(<UserLoginForm />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'mockuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'mockpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login.button/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    test('shows general error message on server error', async () => {
        const mockLoginUser = UserService.loginUser as jest.Mock;
        mockLoginUser.mockResolvedValue({
            status: 500,
            json: async () => ({}),
        });

        render(<UserLoginForm />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'mockuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'mockpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login.button/i }));

        await waitFor(() => {
            expect(screen.getByText(/general.error/i)).toBeInTheDocument();
        });
    });
});