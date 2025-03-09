import React from 'react';

const HeroSection = () => {
    return (
        <section className="hero-section d-flex align-items-center text-center bg-primary text-white py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h1 className="display-4 fw-bold">Simplify Your Hiring Process</h1>
                        <p className="lead mt-3">
                            Extract, analyze, and manage job applications effortlessly with our  platform.
                            Save time and focus on what matters most — finding the right talent!
                        </p>
                        <a href="#get-started" className="btn btn-light btn-lg mt-4">Get Started</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-4">
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-6">
                        <p className="mb-0">&copy; 2025 Job Application Extractor. All rights reserved.</p>
                    </div>
                    <div className="col-md-6">
                        <a href="#privacy" className="text-white me-3">Privacy Policy</a>
                        <a href="#terms" className="text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { HeroSection, Footer };

