"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ParticleBackground } from "@/components/ui/particles"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  DollarSign,
  ArrowRight,
  BarChart4,
  Wallet,
  LineChart,
  Sparkles,
  Target,
  Lock,
} from "lucide-react"

// Testimonial data with avatars
const testimonials = [
  {
    text: "Money Manager has completely changed how I track my finances. The visualizations make it easy to spot trends and adjust my spending habits.",
    author: "Sarah Johnson",
    role: "Small Business Owner",
    avatar: "/next.svg",
  },
  {
    text: "I've tried many finance apps, but this one finally helped me stick to a budget. The insights feature is a game-changer for financial planning.",
    author: "Michael Chen",
    role: "Software Engineer",
    avatar: "/next.svg",
  },
  {
    text: "The budget tracking tools helped me save for my dream vacation in just 6 months. I can finally see where every dollar goes!",
    author: "Jessica Martinez",
    role: "Marketing Manager",
    avatar: "/next.svg",
  },
]

// Enhanced feature data
const features = [
  {
    icon: <BarChart4 className="h-10 w-10" />,
    title: "AI-Powered Analytics",
    description: "Intelligent insights that analyze your spending patterns and suggest optimization strategies",
    gradientClass: "from-violet-500 to-purple-600",
    iconBgClass: "bg-gradient-to-br from-violet-500 to-purple-600",
    delay: 0,
  },
  {
    icon: <Wallet className="h-10 w-10" />,
    title: "Smart Budgeting",
    description: "Adaptive budget recommendations based on your income, goals, and spending history",
    gradientClass: "from-blue-500 to-cyan-600",
    iconBgClass: "bg-gradient-to-br from-blue-500 to-cyan-600",
    delay: 0.1,
  },
  {
    icon: <Lock className="h-10 w-10" />,
    title: "Bank-Level Security",
    description: "Enterprise-grade encryption and security protocols to protect your financial data",
    gradientClass: "from-emerald-500 to-teal-600",
    iconBgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
    delay: 0.2,
  },
]

// How it works steps
const steps = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Connect Your Accounts",
    description: "Securely link your financial accounts for a comprehensive overview of your finances",
    gradientClass: "from-pink-500 to-rose-600",
    iconBgClass: "bg-gradient-to-br from-pink-500 to-rose-600",
    delay: 0,
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Visualize Your Finances",
    description: "Interactive charts and reports that make understanding your money intuitive and insightful",
    gradientClass: "from-amber-500 to-orange-600",
    iconBgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
    delay: 0.1,
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Achieve Your Goals",
    description: "Set financial targets and track your progress with personalized recommendations",
    gradientClass: "from-emerald-500 to-teal-600",
    iconBgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
    delay: 0.2,
  },
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Refs for scrolling
  const featuresRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-black">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Header/Navigation */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-emerald-400" />
          <span className="text-xl font-bold tracking-tight">FTRAKT</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection(featuresRef)} className="hover:text-emerald-400 transition-colors">
            Features
          </button>
          <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-emerald-400 transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollToSection(testimonialsRef)} className="hover:text-emerald-400 transition-colors">
            Testimonials
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hover:text-emerald-400 transition-all">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="py-20 px-4 max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Transform Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
              Finances
            </span>{" "}
            with Smart Management
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Track spending, create budgets, and gain valuable insights into your financial habits. Take control of your
            money today.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-8 py-6 text-lg">
                Get Started Free
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <button
              onClick={() => scrollToSection(howItWorksRef)}
              className="inline-flex items-center justify-center whitespace-nowrap border border-white/20 hover:bg-white/10 px-8 py-6 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-700/20 rounded-xl p-1">
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
                <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <img
                  src="assets/landing-page.jpg"
                  alt="Money Manager Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features - Enhanced with modern design */}
        <section id="features" ref={featuresRef} className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 mb-4">
                  Powerful Features
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 mt-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Everything You Need
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Cutting-edge tools designed to transform how you manage, track, and grow your finances
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900/80 to-black/80 p-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`}
                  />
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    <div className={`mb-6 p-3 rounded-xl ${feature.iconBgClass} w-fit`}>{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 group-hover:text-white/90 transition-colors">{feature.description}</p>
                    <div className="mt-auto pt-6 flex items-center text-sm font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Enhanced with modern design */}
        <section id="how-it-works" ref={howItWorksRef} className="py-20 px-4 relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/10 to-black -z-10"></div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 mb-4">
                  Simple Process
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 mt-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Three simple steps to transform your financial future
              </motion.p>
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-amber-500 to-emerald-500 transform -translate-y-1/2 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: step.delay }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-black/80 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${step.iconBgClass} shadow-lg`}
                      >
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                      <p className="text-gray-300">{step.description}</p>
                    </div>

                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Enhanced with modern design */}
        <section id="testimonials" ref={testimonialsRef} className="py-20 px-4 relative">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 mb-4">
                  Testimonials
                </span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 mt-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                What Our Users Say
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of satisfied users who have transformed their financial lives
              </motion.p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/50 p-1">
                          <img
                            src={testimonials[currentTestimonial].avatar || "/next.svg"}
                            alt={testimonials[currentTestimonial].author}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xl mb-6 italic text-gray-200">{testimonials[currentTestimonial].text}</p>
                        <div>
                          <p className="font-bold text-lg">{testimonials[currentTestimonial].author}</p>
                          <p className="text-emerald-400">{testimonials[currentTestimonial].role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 text-4xl text-emerald-500 opacity-50">-</div>
                  <div className="absolute -bottom-4 -right-4 text-4xl text-emerald-500 opacity-50">-</div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4 z-20">
                <button
                  onClick={() =>
                    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-emerald-500/20 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-emerald-500/20 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? "bg-emerald-400 w-8" : "bg-white/30 hover:bg-white/50"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-12 rounded-2xl backdrop-blur-md border border-emerald-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have already taken control of their financial future
            </p>

            <Link href="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white px-8 py-6 text-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold">FTRAKT</span>
            </div>
            <p className="text-gray-400">Your personal financial companion for smart money management.</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => scrollToSection(featuresRef)} className="hover:text-emerald-400">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-emerald-400">
                  How It Works
                </button>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Money Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
