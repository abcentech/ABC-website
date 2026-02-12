import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-transparent relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Start Your Project</h2>
                    <p className="text-brand-mute">
                        Ready to build something great? Get in touch with us today.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-start gap-4 p-6 bg-brand-primary/20 backdrop-blur-sm rounded-xl border border-brand-secondary/30">
                            <div className="p-3 bg-brand-accent/10 rounded-lg text-brand-accent">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Visit Us</h3>
                                <p className="text-brand-mute">
                                    Sholuyi, Gbagada<br />
                                    Lagos, Nigeria
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-brand-primary/20 backdrop-blur-sm rounded-xl border border-brand-secondary/30">
                            <div className="p-3 bg-brand-accent/10 rounded-lg text-brand-accent">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                                <p className="text-brand-mute">
                                    arkbuildersenterprise@gmail.com
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-brand-primary/20 backdrop-blur-sm rounded-xl border border-brand-secondary/30">
                            <div className="p-3 bg-brand-accent/10 rounded-lg text-brand-accent">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Call / WhatsApp</h3>
                                <p className="text-brand-mute">
                                    +234 916 301 4192
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-brand-primary/40 backdrop-blur-md p-8 rounded-2xl border border-brand-secondary/50 shadow-lg"
                    >
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-mute">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-brand-dark border border-brand-secondary rounded-lg focus:outline-none focus:border-brand-accent text-white transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-brand-mute">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-brand-dark border border-brand-secondary rounded-lg focus:outline-none focus:border-brand-accent text-white transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-mute">Service Interest</label>
                                <select className="w-full px-4 py-3 bg-brand-dark border border-brand-secondary rounded-lg focus:outline-none focus:border-brand-accent text-white transition-colors">
                                    <option>Software Development</option>
                                    <option>Hardware Supply</option>
                                    <option>General Inquiry</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-mute">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 bg-brand-dark border border-brand-secondary rounded-lg focus:outline-none focus:border-brand-accent text-white transition-colors resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-brand-accent text-brand-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                            >
                                Send Message <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
