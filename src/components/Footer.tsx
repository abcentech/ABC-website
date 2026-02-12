import { Hammer, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-scroll";

const Footer = () => {
    return (
        <footer className="bg-brand-dark border-t border-brand-secondary pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link
                            to="hero"
                            smooth
                            className="flex items-center gap-2 text-2xl font-bold text-white mb-6 cursor-pointer"
                        >
                            <div className="bg-brand-accent p-1.5 rounded-lg">
                                <Hammer className="text-brand-dark w-6 h-6" />
                            </div>
                            Ark<span className="text-brand-accent">Builders</span>
                        </Link>
                        <p className="text-brand-mute max-w-sm mb-6">
                            Constructing the digital and physical backbones for modern enterprises. Quality, reliability, and innovation in every byte and bolt.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-brand-mute hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-brand-mute hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-brand-mute hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Services</h4>
                        <ul className="space-y-4 text-brand-mute">
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">Custom Software</li>
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">Hardware Supply</li>
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">System Integration</li>
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">Consultancy</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-brand-mute">
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">About Us</li>
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="hover:text-brand-accent cursor-pointer transition-colors">Terms of Service</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-secondary pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-mute">
                    <p>&copy; {new Date().getFullYear()} Ark Builders. All rights reserved.</p>
                    <p>Designed for Excellence.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
