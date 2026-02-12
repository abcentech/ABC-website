import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const goals = [
    "Deliver enterprise-grade software solutions.",
    "Ensure reliable supply of critical hardware components.",
    "Build long-term partnerships through transparency.",
    "Innovate with the latest technology trends."
];

const About = () => {
    return (
        <section id="about" className="py-24 bg-transparent relative overflow-hidden">
            {/* Static asset removed to favor global AnimatedBackground */}

            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <h2 className="text-4xl font-bold text-white mb-6">Building The Infrastructure of Tomorrow</h2>
                    <p className="text-brand-mute leading-relaxed mb-6">
                        At Ark Builders, we believe that the foundation of any successful enterprise lies in the synergy between robust software and reliable hardware.
                    </p>
                    <p className="text-brand-mute leading-relaxed mb-8">
                        Founded with a mission to empower businesses across Nigeria and beyond, we have established ourselves as a premier provider of custom technology solutions. Our team of expert engineers and supply chain specialists work tirelessly to ensure your operations never miss a beat.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {goals.map((goal, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="text-brand-accent min-w-[20px]" size={20} />
                                <span className="text-sm text-slate-300">{goal}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative md:h-[500px] h-[300px] bg-brand-primary/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-brand-secondary"
                >
                    {/* Abstract tech visualization */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-dark to-black p-8 flex flex-col justify-center items-center text-center">
                        <div className="text-6xl font-black text-brand-secondary/20 select-none">ARK</div>
                        <div className="mt-4 text-brand-accent font-mono text-xl">EST. 2024</div>
                        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs opacity-50">
                            <div className="h-2 bg-brand-secondary rounded animate-pulse" />
                            <div className="h-2 bg-brand-accent rounded col-span-2 animate-pulse delay-75" />
                            <div className="h-2 bg-brand-secondary rounded col-span-2 animate-pulse delay-150" />
                            <div className="h-2 bg-brand-secondary rounded animate-pulse delay-200" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
