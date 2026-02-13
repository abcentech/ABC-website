import { motion } from "framer-motion";

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-brand-dark pointer-events-none">
            {/* Soft Animated Gradient Blobs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[130px]"
            />

            {/* Grid Shimmer */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}>
                <motion.div
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark"
                />
            </div>

            {/* Light Beams / Fields */}
            <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{
                            x: "200%",
                            opacity: [0, 0.1, 0]
                        }}
                        transition={{
                            duration: 15 + i * 5,
                            repeat: Infinity,
                            delay: i * 7,
                            ease: "linear"
                        }}
                        className="absolute top-0 left-0 w-[300px] h-full bg-gradient-to-r from-transparent via-brand-accent/5 to-transparent skew-x-[-25deg]"
                    />
                ))}
            </div>

            {/* Particle Drift */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100],
                            opacity: [0, 0.3, 0],
                            x: [0, Math.random() * 50 - 25]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100 + 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Parallax Abstract Shapes */}
            <motion.div
                animate={{
                    rotate: [0, 20, 0],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[30%] left-[15%] opacity-[0.02]"
            >
                <svg width="400" height="400" viewBox="0 0 200 200" fill="currentColor" className="text-brand-accent">
                    <path d="M40,-60C50,-50,55,-35,58,-20C61,-5,62,10,58,25C54,40,45,55,30,62C15,69,0,68,-15,63C-30,58,-45,49,-54,35C-63,21,-66,2,-62,-15C-58,-32,-47,-47,-35,-56C-23,-65,-12,-68,0,-69C12,-70,24,-70,40,-60Z" transform="translate(100 100)" />
                </svg>
            </motion.div>
        </div>
    );
};

export default AnimatedBackground;
