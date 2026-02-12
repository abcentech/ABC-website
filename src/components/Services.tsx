import { motion } from "framer-motion";
import { Monitor, Server, Smartphone, Cpu, Truck, Hammer } from "lucide-react";

const services = [
    {
        category: "Software Development",
        items: [
            {
                icon: <Monitor className="w-6 h-6" />,
                title: "Web Applications",
                desc: "Responsive, high-performance web apps built with modern frameworks like React and Next.js.",
            },
            {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Mobile Solutions",
                desc: "Native and cross-platform mobile functionality ensuring your business is everywhere.",
            },
            {
                icon: <Server className="w-6 h-6" />,
                title: "Backend Infrastructure",
                desc: "Robust APIs, database management, and cloud architecture for scalable growth.",
            },
        ],
    },
    {
        category: "Hardware & Supply",
        items: [
            {
                icon: <Cpu className="w-6 h-6" />,
                title: "Component Sourcing",
                desc: "Procurement of high-grade electronic components, processors, and specialized parts.",
            },
            {
                icon: <Truck className="w-6 h-6" />,
                title: "Logistics & Delivery",
                desc: "Secure supply chain management ensuring your hardware arrives on time, every time.",
            },
            {
                icon: <Hammer className="w-6 h-6" />,
                title: "Custom Builds",
                desc: "Assembly and configuration of enterprise workstations and server racks.",
            },
        ],
    },
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-transparent relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Our Expertise</h2>
                    <p className="text-brand-mute max-w-2xl mx-auto">
                        We bridge the gap between digital innovation and physical infrastructure.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {services.map((section, idx) => (
                        <motion.div
                            key={section.category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-brand-accent mb-8 border-l-4 border-brand-accent pl-4">
                                {section.category}
                            </h3>
                            <div className="space-y-6">
                                {section.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 p-6 rounded-xl bg-brand-primary/40 backdrop-blur-sm hover:bg-brand-secondary/40 border border-brand-secondary/20 hover:border-brand-secondary transition-all group"
                                    >
                                        <div className="mt-1 p-3 rounded-lg bg-brand-dark text-brand-accent group-hover:scale-110 transition-transform h-fit">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-white mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-brand-mute/80 text-sm leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
