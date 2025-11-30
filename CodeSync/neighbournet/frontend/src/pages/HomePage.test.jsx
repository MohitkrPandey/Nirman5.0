import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

describe('HomePage', () => {
    it('renders the main heading', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText('One Tap. Neighbors Respond.')).toBeInTheDocument();
    });

    it('renders all metrics', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText('10,000+')).toBeInTheDocument();
        expect(screen.getByText('5,000+')).toBeInTheDocument();
        expect(screen.getByText('<3 min')).toBeInTheDocument();
        expect(screen.getByText('300+')).toBeInTheDocument();
    });

    it('renders three steps section', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText('Request Help')).toBeInTheDocument();
        expect(screen.getByText('Get Matched')).toBeInTheDocument();
        expect(screen.getByText('Receive Support')).toBeInTheDocument();
    });

    it('renders all six features', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText('Real-Time Alerts')).toBeInTheDocument();
        expect(screen.getByText('Verified Volunteers')).toBeInTheDocument();
        expect(screen.getByText('GPS Tracking')).toBeInTheDocument();
        expect(screen.getByText('Emergency Contacts')).toBeInTheDocument();
        expect(screen.getByText('Community Network')).toBeInTheDocument();
        expect(screen.getByText('24/7 Availability')).toBeInTheDocument();
    });

    it('renders CTA buttons', () => {
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText('Get Help Now')).toBeInTheDocument();
        expect(screen.getByText('Get Started Today')).toBeInTheDocument();
    });
});
