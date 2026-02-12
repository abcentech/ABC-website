import { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Menu, X, Hammer } from "lucide-react";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", to: "hero" },
        { name: "Services", to: "services" },
        { name: "About", to: "about" },
        { name: "Contact", to: "contact" },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-brand-primary/90 backdrop-blur-md shadow-lg" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link
                    to="hero"
                    smooth
                    className="flex items-center gap-2 text-2xl font-bold text-white cursor-pointer group"
                >
                    <div className="bg-brand-accent p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Hammer className="text-brand-dark w-6 h-6" />
                    </div>
                    Ark<span className="text-brand-accent">Builders</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            smooth={true}
                            duration={500}
                            className="text-brand-mute hover:text-brand-accent cursor-pointer transition-colors font-medium text-sm tracking-wide uppercase"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="contact"
                        smooth
                        className="px-5 py-2 border border-brand-accent text-brand-accent rounded hover:bg-brand-accent hover:text-brand-dark transition-colors font-semibold cursor-pointer"
                    >
                        Get a Quote
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white hover:text-brand-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-brand-primary border-t border-brand-secondary absolute w-full left-0 top-full shadow-xl">
                    <nav className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                smooth={true}
                                duration={500}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-brand-mute hover:text-brand-accent cursor-pointer text-lg font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
