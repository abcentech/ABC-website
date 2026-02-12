import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
    return (
        <div className="relative min-h-screen text-white overflow-x-hidden scroll-smooth">
            <AnimatedBackground />
            <Header />
            <main className="relative z-10">
                <Hero />
                <Services />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default App;
