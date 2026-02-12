import { motion } from "framer-motion";
import { ArrowRight, Code, Wrench } from "lucide-react";
import { Link } from "react-scroll";

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-transparent">
            {/* Background Elements removed to favor global AnimatedBackground */}


            <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-secondary/30 border border-brand-secondary/50 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-6">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        Building the Future
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6">
                        Architects of <br />
                        <span className="text-brand-accent">Software</span> & <span className="text-blue-400">Hardware</span>
                    </h1>
                    <p className="text-lg text-brand-mute mb-8 max-w-lg leading-relaxed">
                        Ark Builders delivers enterprise-grade custom software solutions and reliable hardware supply chains for businesses that demand excellence.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="services"
                            smooth
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-accent text-brand-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors cursor-pointer"
                        >
                            Our Services <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="contact"
                            smooth
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-brand-secondary bg-transparent hover:bg-brand-secondary/30 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                            Contact Us
                        </Link>
                    </div>
                </motion.div>

                {/* Right Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden md:block"
                >
                    <div className="relative z-10 grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                            <div className="p-6 bg-brand-primary/50 backdrop-blur-sm rounded-2xl border border-brand-secondary hover:border-brand-accent/50 transition-colors group">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Code className="text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Custom Software</h3>
                                <p className="text-sm text-brand-mute">Tailored applications built for scale and performance.</p>
                            </div>
                            <div className="p-6 bg-brand-primary/50 backdrop-blur-sm rounded-2xl border border-brand-secondary hover:border-brand-accent/50 transition-colors group">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <div className="text-purple-400 font-mono font-bold text-lg">API</div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Integrations</h3>
                                <p className="text-sm text-brand-mute">Seamless connectivity between your critical systems.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-6 bg-brand-primary/50 backdrop-blur-sm rounded-2xl border border-brand-secondary hover:border-brand-accent/50 transition-colors group">
                                <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Wrench className="text-brand-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Hardware Supply</h3>
                                <p className="text-sm text-brand-mute">Sourcing high-quality parts and enterprise equipment.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
