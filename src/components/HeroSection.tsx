import { TrendingUp, TrendingDown, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import logoImage from "figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png";
import rocketImage from "figma:asset/82eb0254e6f3e728e5562a8e7c2d26574216fd8e.png";
import { brandColors } from "../utils/colors";

export function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* 4 Vertical Dashed Lines Background - Hide on mobile */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
        <div className="max-w-7xl mx-auto h-full relative px-8">
          {/* Line 1 - After first column */}
          <svg
            className="absolute left-[calc(25%+2rem)] top-0 h-full w-px"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Line 2 - After second column */}
          <svg
            className="absolute left-[calc(50%+2rem)] top-0 h-full w-px"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Line 3 - After third column */}
          <svg
            className="absolute left-[calc(75%+2rem)] top-0 h-full w-px"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 py-4">
          {/* Logo - Outside background */}
          <div className="flex items-center gap-2">
            <img
              src={logoImage}
              alt="Next Ignition Logo"
              className="h-6 lg:h-8"
            />
          </div>

          {/* Navigation Links and Buttons - Desktop only */}
          <div className="hidden lg:flex items-center gap-6 bg-gray-50/80 backdrop-blur-sm rounded-full px-6 py-2.5">
            <div className="flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#ai-tools"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                AI Tools
              </a>
              <a
                href="#community"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Community
              </a>
              <a
                href="#webinars"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Webinars
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
              >
                About
              </a>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <a href="#login" className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100 bg-white">
                Log In
              </a>
              <a
                href="#signup"
                className="px-5 py-2 text-sm font-medium text-white rounded-full transition-colors"
                style={{
                  backgroundColor: brandColors.atomicOrange,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Launch App
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: mobileMenuOpen ? 1 : 0, 
          height: mobileMenuOpen ? "auto" : 0 
        }}
        transition={{ duration: 0.3 }}
        className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-20 overflow-hidden"
      >
        {mobileMenuOpen && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#ai-tools"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Tools
              </a>
              <a
                href="#community"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </a>
              <a
                href="#webinars"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Webinars
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-gray-600 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              
              {/* Mobile Action Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <a href="#login" className="px-5 py-3 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100 bg-white text-center">
                  Log In
                </a>
                <a
                  href="#signup"
                  className="px-5 py-3 text-sm font-medium text-white rounded-full transition-opacity text-center"
                  style={{
                    backgroundColor: brandColors.atomicOrange,
                  }}
                >
                  Launch App
                </a>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Content - Responsive Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block mb-4"
            >
              <span
                className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-[10px] lg:text-xs font-semibold tracking-wide uppercase text-white"
                style={{
                  backgroundColor: `${brandColors.atomicOrange}33`,
                }}
              >
                <span
                  style={{ color: brandColors.atomicOrange }}
                >
                  STARTUP LAUNCH MADE EASY
                </span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-6xl leading-[1.1] tracking-tight mb-4 lg:mb-6"
            >
              Turning Startup Ideas
              <br />
              into Reality
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm lg:text-base mb-6 lg:mb-8 text-gray-700 leading-relaxed max-w-md"
            >
              NextIgnition helps founders grow from idea to
              launch. Connect with experts, get mentorship,
              build your MVP, and raise funding all on one
              platform.
            </motion.p>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8"
            >
              <span className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 rounded-full text-xs lg:text-sm font-medium">
                AI Powered Matching
              </span>
              <span className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 rounded-full text-xs lg:text-sm font-medium">
                All in One Platform
              </span>
              <span className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gray-100 text-gray-700 rounded-full text-xs lg:text-sm font-medium">
                Global Community
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-2 lg:gap-3 mb-8 lg:mb-16"
            >
              <button
                className="px-4 lg:px-6 py-2 lg:py-3 text-white rounded-md transition-opacity font-medium text-sm lg:text-base"
                style={{
                  backgroundColor: brandColors.atomicOrange,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Join as Founder
              </button>
              <button
                className="px-4 lg:px-6 py-2 lg:py-3 text-white rounded-md transition-opacity font-medium text-sm lg:text-base"
                style={{
                  backgroundColor: brandColors.navyBlue,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Join as Co-founder
              </button>
              <button
                className="px-4 lg:px-6 py-2 lg:py-3 text-white rounded-md transition-opacity font-medium text-sm lg:text-base"
                style={{
                  backgroundColor: brandColors.electricBlue,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Join as Expert
              </button>
              <button
                className="px-4 lg:px-6 py-2 lg:py-3 text-white rounded-md transition-opacity font-medium text-sm lg:text-base"
                style={{
                  backgroundColor: brandColors.electricBlue,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Join as Investor
              </button>
              <button
                className="px-4 lg:px-6 py-2 lg:py-3 bg-white rounded-md transition-all font-medium text-sm lg:text-base"
                style={{
                  border: `2px solid ${brandColors.atomicOrange}`,
                  color: brandColors.atomicOrange,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${brandColors.atomicOrange}11`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    brandColors.white;
                }}
              >
                Request a Demo
              </button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center gap-4 lg:gap-6"
            >
              <div className="flex -space-x-2">
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] lg:text-xs font-semibold"
                  style={{
                    backgroundColor: brandColors.atomicOrange,
                  }}
                >
                  AC
                </div>
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] lg:text-xs font-semibold"
                  style={{
                    backgroundColor: brandColors.electricBlue,
                  }}
                >
                  RF
                </div>
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] lg:text-xs font-semibold"
                  style={{
                    backgroundColor: brandColors.navyBlue,
                  }}
                >
                  DF
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-white text-[10px] lg:text-xs font-semibold">
                  HK
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs lg:text-sm font-semibold text-gray-800">
                  2,500+ founders joined
                </p>
                <p className="text-[10px] lg:text-xs text-gray-600">
                  500+ experts available • AI powered matching
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side - 3D Sphere - Show on all devices */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative min-h-[200px] lg:min-h-[700px]"
          >
            <Sphere />
          </motion.div>
        </div>
      </div>

      {/* Bottom Orange Gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 lg:h-96 opacity-30 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${brandColors.atomicOrange}, transparent)`,
        }}
      ></div>
    </div>
  );
}

function Sphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      1,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(700, 700);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 4.1;

    // Create sphere with wireframe
    const geometry = new THREE.SphereGeometry(2.4, 32, 32);

    // Gradient material (simulated with vertex colors)
    const material = new THREE.MeshBasicMaterial({
      color: 0x444444,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Wireframe overlay
    const wireframeGeometry = new THREE.SphereGeometry(
      2.51,
      16,
      16,
    );
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x555555,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframe = new THREE.Mesh(
      wireframeGeometry,
      wireframeMaterial,
    );
    scene.add(wireframe);

    // Orange wireframe at bottom
    const orangeWireframeGeometry = new THREE.SphereGeometry(
      2.52,
      12,
      8,
    );
    const orangeWireframeMaterial = new THREE.MeshBasicMaterial(
      {
        color: 0xff6b00,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      },
    );
    const orangeWireframe = new THREE.Mesh(
      orangeWireframeGeometry,
      orangeWireframeMaterial,
    );
    orangeWireframe.rotation.x = Math.PI / 4;
    scene.add(orangeWireframe);

    // Rocket Emoji 🚀
    // Load custom rocket image
    let rocketSprite: THREE.Sprite | null = null;
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
      rocketImage,
      (texture) => {
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true,
        });
        rocketSprite = new THREE.Sprite(spriteMaterial);
        
        // Position and scale the sprite (adjusted for better visibility)
        rocketSprite.position.set(-2.1, 2.2, 0.6);
        rocketSprite.scale.set(0.65, 0.65, 1);
        
        // Tilt towards right (rotate around Z axis)
        rocketSprite.material.rotation = 1.6; // radians for right tilt
        
        scene.add(rocketSprite);
      },
      undefined,
      (error) => {
        console.error('Error loading rocket image:', error);
      }
    );

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffa500,
      0.8,
    );
    directionalLight.position.set(0, -1, 1);
    scene.add(directionalLight);

    // Animation
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;
      wireframe.rotation.y += 0.002;
      wireframe.rotation.x += 0.001;
      orangeWireframe.rotation.y -= 0.003;

      // Gentle floating motion for rocket (if loaded)
      if (rocketSprite) {
        const time = Date.now() * 0.001;
        rocketSprite.position.y = 2.2 + Math.sin(time * 0.8) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      orangeWireframeGeometry.dispose();
      orangeWireframeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute bottom-0 right-0 w-[700px] h-[700px] overflow-visible">
      {/* Background gradient circle - Responsive sizing and positioning */}
      <div
        className="absolute w-[750px] h-[750px] lg:w-[750px] lg:h-[750px] rounded-full opacity-70 bottom-0 right-1/2 translate-x-[87%] translate-y-[70%] lg:right-0 lg:translate-x-[25%] lg:translate-y-[15%]"
        style={{
          background: `radial-gradient(circle at center, #4a3428 0%, #2a1f1a 40%, ${brandColors.black} 70%)`,
        }}
      ></div>

      {/* Three.js Canvas - Responsive sizing and positioning */}
      <canvas
        ref={canvasRef}
        className="absolute w-[250px] h-[250px] lg:w-[600px] lg:h-[600px] bottom-0 right-1/2 translate-x-[90%] translate-y-[70%] lg:right-0 lg:translate-x-[25%] lg:translate-y-[15%]"
      />

      {/* Floating Analytics Card - Hide on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 1.2,
          ease: "easeOut",
        }}
        className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 z-10 pointer-events-auto"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Orange Header */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{
              backgroundColor: brandColors.atomicOrange,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: brandColors.atomicOrange,
                }}
              ></div>
            </motion.div>
            <span className="text-white text-sm font-medium">
              NextIgnition Platform Insights
            </span>
          </div>

          {/* Card Content */}
          <div className="p-5">
            <div
              className="text-xs font-semibold mb-4 tracking-wide"
              style={{ color: brandColors.atomicOrange }}
            >
              Live Platform Stats
            </div>

            <div className="grid grid-cols-4 gap-4">
              {/* Active Founders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="text-xs text-gray-500 mb-1">
                  Founders
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-[16px]">2.5K</span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Success Rate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <div className="text-xs text-gray-500 mb-1">
                  Success
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-[16px]">87%</span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Funding Raised */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                <div className="text-xs text-gray-500 mb-1">
                  Funding
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-[16px]">$42M</span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  >
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Active Experts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                <div className="text-xs text-gray-500 mb-1">
                  Experts
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[
                    { bg: "bg-orange-500", letter: "AI" },
                    { bg: "bg-green-500", letter: "ML" },
                    { bg: "bg-blue-500", letter: "PM" },
                    { bg: "bg-yellow-500", letter: "VC" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 1.9 + i * 0.1,
                        duration: 0.3,
                      }}
                      whileHover={{ scale: 1.2 }}
                      className={`w-5 h-5 ${item.bg} rounded text-white text-[8px] flex items-center justify-center font-bold cursor-pointer`}
                    >
                      {item.letter}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}