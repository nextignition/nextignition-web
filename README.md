# Next Ignition Website

A professional, modern website for Next Ignition - a platform that helps founders turn startup ideas into reality.

## Features

- **Modern Design**: Clean, minimalist UI with professional animations
- **Brand Colors**: Electric Blue, Navy Blue, Atomic Orange
- **Responsive**: Fully responsive design for all devices
- **Performance**: Built with Next.js 14 and optimized for speed
- **Animations**: Smooth animations using Framer Motion
- **Accessible**: Built with accessibility in mind

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── sections/         # Page sections
│   ├── Navbar.tsx        # Navigation bar
│   └── Footer.tsx        # Footer component
└── lib/
    └── utils.ts          # Utility functions
```

## Sections

1. **Hero** - Above the fold with headline and CTAs
2. **How It Works** - 4-step workflow
3. **Features** - Core and Pro features
4. **User Roles** - Founder, Expert, Investor, Agency
5. **Community Feed** - Live updates and interactions
6. **AI Tools** - Startup tools showcase
7. **Webinars** - Events and learning
8. **Testimonials** - Success stories
9. **Pricing** - Free and Pro plans
10. **About** - Mission and vision
11. **Blog** - Insights and updates
12. **Contact** - Support and contact form

## Brand Colors

- **Electric Blue**: `#666637`
- **Navy Blue**: `#242B64`
- **Atomic Orange**: `#F78405`
- **White**: `#FFFFFF`
- **Black**: `#000000`

## Customization

All components are modular and can be easily customized. Brand colors are defined in `tailwind.config.ts` and can be updated there.

## License

© 2024 Next Ignition. All rights reserved.
