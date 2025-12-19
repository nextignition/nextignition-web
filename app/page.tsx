import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import HowItWorks from '@/components/sections/HowItWorks'
import Features from '@/components/sections/Features'
import UserRoles from '@/components/sections/UserRoles'
import CommunityFeed from '@/components/sections/CommunityFeed'
import AITools from '@/components/sections/AITools'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import About from '@/components/sections/About'
import Blog from '@/components/sections/Blog'
import Waitlist from '@/components/sections/Waitlist'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <UserRoles />
      <CommunityFeed />
      <AITools />
      <Testimonials />
      <Pricing />
      <About />
      <Blog />
      <Waitlist />
      <Contact />
      <Footer />
    </main>
  )
}

