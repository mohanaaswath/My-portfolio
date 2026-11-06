import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Services from './sections/Services'
import Education from './sections/Education'
import Certificates from './sections/Certificates'
import Contact from './sections/Contact'
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-violet focus:px-3 focus:py-2">Skip to content</a>
      <Navbar />
      <main><Hero /><About /><Skills /><Projects /><Experience /><Services /><Education /><Certificates /><Contact /></main>
      <Footer />
    </MotionConfig>
  )
}
