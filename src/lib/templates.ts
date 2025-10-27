export const templateData = {
  // === DOCUMENTS ===
  'cv-modern': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 794, height: 200, fill: '#3b82f6' },
      { type: 'i-text', left: 50, top: 60, text: 'JOHN DOE', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 120, text: 'Full Stack Developer', fontSize: 24, fill: '#ffffff', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 250, text: 'EXPERIENCE', fontSize: 20, fontWeight: 'bold', fill: '#3b82f6', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 290, text: 'Senior Developer at Tech Corp\n2020 - Present\n\n• Led team of 5 developers\n• Built scalable web applications\n• Improved performance by 40%', fontSize: 14, fill: '#000000', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 480, text: 'EDUCATION', fontSize: 20, fontWeight: 'bold', fill: '#3b82f6', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 520, text: 'Bachelor of Computer Science\nUniversity Name, 2016-2020', fontSize: 14, fill: '#000000', fontFamily: 'Arial' },
      { type: 'rect', left: 550, top: 0, width: 244, height: 1123, fill: '#f3f4f6' },
      { type: 'i-text', left: 570, top: 220, text: 'CONTACT', fontSize: 16, fontWeight: 'bold', fill: '#1f2937', fontFamily: 'Arial' },
      { type: 'i-text', left: 570, top: 250, text: 'john@email.com\n+1 234 567 890\nLinkedIn: johndoe', fontSize: 12, fill: '#4b5563', fontFamily: 'Arial' },
      { type: 'i-text', left: 570, top: 350, text: 'SKILLS', fontSize: 16, fontWeight: 'bold', fill: '#1f2937', fontFamily: 'Arial' },
      { type: 'i-text', left: 570, top: 380, text: '• JavaScript/TypeScript\n• React & Next.js\n• Node.js\n• Python\n• SQL & NoSQL', fontSize: 12, fill: '#4b5563', fontFamily: 'Arial' },
    ],
  },

  'cv-creative': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 794, height: 1123, fill: '#fef3c7' },
      { type: 'circle', left: 100, top: 80, radius: 80, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 5 },
      { type: 'i-text', left: 220, top: 80, text: 'JANE SMITH', fontSize: 42, fontWeight: 'bold', fill: '#92400e', fontFamily: 'Poppins' },
      { type: 'i-text', left: 220, top: 130, text: 'Creative Designer', fontSize: 24, fill: '#b45309', fontFamily: 'Poppins' },
      { type: 'rect', left: 50, top: 220, width: 694, height: 3, fill: '#f59e0b' },
      { type: 'i-text', left: 50, top: 260, text: '🎨 ABOUT ME', fontSize: 22, fontWeight: 'bold', fill: '#92400e', fontFamily: 'Poppins' },
      { type: 'i-text', left: 50, top: 300, text: 'Passionate designer with 5+ years of experience creating\nbeautiful and functional designs for web and mobile.', fontSize: 14, fill: '#78350f', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 400, text: '💼 EXPERIENCE', fontSize: 22, fontWeight: 'bold', fill: '#92400e', fontFamily: 'Poppins' },
      { type: 'i-text', left: 50, top: 440, text: 'Lead Designer | Creative Agency\n2021 - Present', fontSize: 16, fontWeight: 'bold', fill: '#b45309', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 485, text: '• Design system creation\n• UI/UX for mobile apps\n• Brand identity development', fontSize: 14, fill: '#78350f', fontFamily: 'Arial' },
    ],
  },

  'cv-minimal': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 794, height: 1123, fill: '#ffffff' },
      { type: 'i-text', left: 50, top: 50, text: 'Alex Johnson', fontSize: 52, fontWeight: '300', fill: '#000000', fontFamily: 'Helvetica' },
      { type: 'rect', left: 50, top: 120, width: 200, height: 2, fill: '#000000' },
      { type: 'i-text', left: 50, top: 140, text: 'Product Manager', fontSize: 18, fontWeight: '300', fill: '#666666', fontFamily: 'Helvetica' },
      { type: 'i-text', left: 50, top: 200, text: 'Experience', fontSize: 16, fontWeight: 'bold', fill: '#000000', fontFamily: 'Helvetica' },
      { type: 'i-text', left: 50, top: 230, text: '2019-Present  Senior PM at StartupCo', fontSize: 14, fill: '#000000', fontFamily: 'Helvetica' },
      { type: 'i-text', left: 50, top: 400, text: 'Education', fontSize: 16, fontWeight: 'bold', fill: '#000000', fontFamily: 'Helvetica' },
      { type: 'i-text', left: 50, top: 430, text: 'MBA, Business School 2019', fontSize: 14, fill: '#000000', fontFamily: 'Helvetica' },
    ],
  },

  // === SOCIAL MEDIA ===
  'social-instagram': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#fbbf24' },
      { type: 'circle', left: 540, top: 200, radius: 120, fill: '#ffffff', originX: 'center', originY: 'center' },
      { type: 'i-text', left: 540, top: 450, text: 'STAY MOTIVATED', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Montserrat', textAlign: 'center', originX: 'center', originY: 'center' },
      { type: 'i-text', left: 540, top: 600, text: 'Dream big, work hard, stay focused', fontSize: 28, fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center' },
      { type: 'i-text', left: 540, top: 900, text: '@yourbrand', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center' },
    ],
  },

  'social-instagram-quote': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { type: 'i-text', left: 100, top: 300, text: '"The best way to\npredict the future\nis to create it."', fontSize: 64, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Georgia', lineHeight: 1.4 },
      { type: 'i-text', left: 100, top: 650, text: '— Peter Drucker', fontSize: 32, fontStyle: 'italic', fill: '#e9d5ff', fontFamily: 'Georgia' },
    ],
  },

  'social-story': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: 'linear-gradient(to bottom, #ec4899 0%, #8b5cf6 100%)' },
      { type: 'i-text', left: 540, top: 800, text: 'NEW\nARRIVAL', fontSize: 120, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Impact', textAlign: 'center', originX: 'center', originY: 'center', lineHeight: 1.1 },
      { type: 'i-text', left: 540, top: 1100, text: 'SHOP NOW', fontSize: 48, fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center' },
      { type: 'rect', left: 390, top: 1150, width: 300, height: 80, fill: '#ffffff', rx: 40, ry: 40 },
      { type: 'i-text', left: 540, top: 1190, text: 'SWIPE UP', fontSize: 32, fontWeight: 'bold', fill: '#ec4899', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center' },
    ],
  },

  'social-linkedin': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1200, height: 627, fill: '#0a66c2' },
      { type: 'i-text', left: 100, top: 200, text: 'Industry Insights:', fontSize: 56, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial' },
      { type: 'i-text', left: 100, top: 280, text: 'The Future of Tech in 2025', fontSize: 64, fontWeight: 'bold', fill: '#fbbf24', fontFamily: 'Arial' },
      { type: 'i-text', left: 100, top: 450, text: 'Read more on our blog →', fontSize: 32, fill: '#ffffff', fontFamily: 'Arial' },
    ],
  },

  'social-facebook-event': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1200, height: 630, fill: '#1877f2' },
      { type: 'i-text', left: 600, top: 180, text: '🎉 BIG EVENT 🎉', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 600, top: 280, text: 'Join us for an amazing experience!', fontSize: 36, fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'rect', left: 400, top: 380, width: 400, height: 100, fill: '#ffffff', rx: 10, ry: 10 },
      { type: 'i-text', left: 600, top: 420, text: 'DECEMBER 25, 2025', fontSize: 40, fontWeight: 'bold', fill: '#1877f2', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },

  // === PRESENTATIONS ===
  'presentation-business': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1920, height: 1080, fill: '#1e293b' },
      { type: 'i-text', left: 960, top: 400, text: 'QUARTERLY REVIEW', fontSize: 96, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 960, top: 540, text: 'Q4 2025 Results', fontSize: 48, fill: '#94a3b8', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'rect', left: 860, top: 620, width: 200, height: 4, fill: '#3b82f6' },
      { type: 'i-text', left: 960, top: 700, text: 'Company Name', fontSize: 32, fill: '#cbd5e1', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },

  'presentation-pitch': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1920, height: 1080, fill: '#ffffff' },
      { type: 'rect', left: 0, top: 0, width: 1920, height: 400, fill: '#6366f1' },
      { type: 'i-text', left: 100, top: 150, text: 'THE PROBLEM', fontSize: 80, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial' },
      { type: 'i-text', left: 100, top: 500, text: 'Current solutions are inefficient and costly', fontSize: 48, fill: '#1f2937', fontFamily: 'Arial' },
      { type: 'i-text', left: 100, top: 600, text: '• 60% of users are unsatisfied\n• $10B market opportunity\n• Growing demand for better solutions', fontSize: 36, fill: '#4b5563', fontFamily: 'Arial' },
    ],
  },

  'presentation-creative': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1920, height: 1080, fill: '#fef3c7' },
      { type: 'circle', left: 200, top: 200, radius: 150, fill: '#fbbf24', opacity: 0.3 },
      { type: 'circle', left: 1700, top: 800, radius: 200, fill: '#f59e0b', opacity: 0.2 },
      { type: 'i-text', left: 960, top: 400, text: 'Think Different', fontSize: 120, fontWeight: 'bold', fill: '#92400e', fontFamily: 'Impact', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 960, top: 580, text: 'Innovation starts here', fontSize: 48, fill: '#b45309', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },

  // === EMAIL ===
  'email-newsletter': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 600, height: 100, fill: '#3b82f6' },
      { type: 'i-text', left: 300, top: 40, text: 'WEEKLY NEWSLETTER', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 50, top: 150, text: 'This Week\'s Highlights', fontSize: 28, fontWeight: 'bold', fill: '#1f2937', fontFamily: 'Arial' },
      { type: 'i-text', left: 50, top: 200, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSed do eiusmod tempor incididunt ut labore.', fontSize: 16, fill: '#4b5563', fontFamily: 'Arial' },
      { type: 'rect', left: 50, top: 300, width: 500, height: 150, fill: '#f3f4f6', rx: 10, ry: 10 },
      { type: 'i-text', left: 70, top: 330, text: '📰 Article of the Week', fontSize: 20, fontWeight: 'bold', fill: '#1f2937', fontFamily: 'Arial' },
      { type: 'rect', left: 200, top: 500, width: 200, height: 50, fill: '#3b82f6', rx: 25, ry: 25 },
      { type: 'i-text', left: 300, top: 520, text: 'READ MORE', fontSize: 18, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },

  'email-promo': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 600, height: 800, fill: '#fef3c7' },
      { type: 'i-text', left: 300, top: 100, text: '🎉 SPECIAL OFFER 🎉', fontSize: 48, fontWeight: 'bold', fill: '#92400e', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 300, top: 200, text: '50% OFF', fontSize: 120, fontWeight: 'bold', fill: '#f59e0b', fontFamily: 'Impact', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 300, top: 330, text: 'All Products', fontSize: 36, fill: '#b45309', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'rect', left: 150, top: 450, width: 300, height: 70, fill: '#f59e0b', rx: 35, ry: 35 },
      { type: 'i-text', left: 300, top: 480, text: 'SHOP NOW', fontSize: 32, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 300, top: 600, text: 'Limited time only!', fontSize: 24, fill: '#78350f', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },

  // === VIDEO ===
  'video-youtube': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1280, height: 720, fill: 'linear-gradient(135deg, #ff0080 0%, #7928ca 100%)' },
      { type: 'i-text', left: 640, top: 280, text: 'HOW TO:', fontSize: 72, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Impact', textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 640, top: 370, text: 'Master Design in 10 Minutes', fontSize: 48, fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'circle', left: 640, top: 500, radius: 60, fill: '#ffffff', originX: 'center', originY: 'center' },
      { type: 'triangle', left: 660, top: 500, width: 40, height: 40, fill: '#ff0080', angle: 90, originX: 'center', originY: 'center' },
    ],
  },

  'video-tiktok': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#000000' },
      { type: 'i-text', left: 540, top: 800, text: 'WATCH\nTHIS!', fontSize: 140, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Impact', textAlign: 'center', originX: 'center', lineHeight: 0.9 },
      { type: 'i-text', left: 540, top: 1100, text: '👀', fontSize: 120, textAlign: 'center', originX: 'center' },
      { type: 'i-text', left: 540, top: 1600, text: '#viral #trending #fyp', fontSize: 36, fill: '#00f2ea', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },

  // === INFOGRAPHICS ===
  'infographic-stats': {
    version: '5.3.0',
    objects: [
      { type: 'rect', left: 0, top: 0, width: 800, height: 2000, fill: '#ffffff' },
      { type: 'rect', left: 0, top: 0, width: 800, height: 150, fill: '#3b82f6' },
      { type: 'i-text', left: 400, top: 60, text: 'KEY STATISTICS 2025', fontSize: 48, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'circle', left: 400, top: 350, radius: 100, fill: '#10b981', originX: 'center', originY: 'center' },
      { type: 'i-text', left: 400, top: 350, text: '85%', fontSize: 64, fontWeight: 'bold', fill: '#ffffff', fontFamily: 'Arial', textAlign: 'center', originX: 'center', originY: 'center' },
      { type: 'i-text', left: 400, top: 480, text: 'Customer Satisfaction', fontSize: 24, fill: '#1f2937', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
      { type: 'rect', left: 100, top: 600, width: 600, height: 200, fill: '#eff6ff', rx: 10, ry: 10 },
      { type: 'i-text', left: 400, top: 650, text: '2M+ Users', fontSize: 48, fontWeight: 'bold', fill: '#3b82f6', fontFamily: 'Arial', textAlign: 'center', originX: 'center' },
    ],
  },
}

export type TemplateId = keyof typeof templateData

export const templateList = [
  // Documents
  { id: 'cv-modern', name: 'Modern CV', category: 'document', width: 794, height: 1123, description: 'Professional blue CV template' },
  { id: 'cv-creative', name: 'Creative CV', category: 'document', width: 794, height: 1123, description: 'Colorful creative resume' },
  { id: 'cv-minimal', name: 'Minimal CV', category: 'document', width: 794, height: 1123, description: 'Clean minimalist resume' },
  
  // Social Media
  { id: 'social-instagram', name: 'Instagram Post', category: 'social', width: 1080, height: 1080, description: 'Motivational square post' },
  { id: 'social-instagram-quote', name: 'Instagram Quote', category: 'social', width: 1080, height: 1080, description: 'Gradient quote design' },
  { id: 'social-story', name: 'Instagram Story', category: 'social', width: 1080, height: 1920, description: 'Story with CTA button' },
  { id: 'social-linkedin', name: 'LinkedIn Post', category: 'social', width: 1200, height: 627, description: 'Professional LinkedIn banner' },
  { id: 'social-facebook-event', name: 'Facebook Event', category: 'social', width: 1200, height: 630, description: 'Event announcement design' },
  
  // Presentations
  { id: 'presentation-business', name: 'Business Slide', category: 'presentation', width: 1920, height: 1080, description: 'Corporate presentation' },
  { id: 'presentation-pitch', name: 'Pitch Deck', category: 'presentation', width: 1920, height: 1080, description: 'Startup pitch slide' },
  { id: 'presentation-creative', name: 'Creative Slide', category: 'presentation', width: 1920, height: 1080, description: 'Colorful creative slide' },
  
  // Email
  { id: 'email-newsletter', name: 'Newsletter', category: 'email', width: 600, height: 800, description: 'Weekly newsletter template' },
  { id: 'email-promo', name: 'Promo Email', category: 'email', width: 600, height: 800, description: 'Promotional email design' },
  
  // Video
  { id: 'video-youtube', name: 'YouTube Thumbnail', category: 'video', width: 1280, height: 720, description: 'Eye-catching thumbnail' },
  { id: 'video-tiktok', name: 'TikTok Cover', category: 'video', width: 1080, height: 1920, description: 'Vertical video cover' },
  
  // Infographics
  { id: 'infographic-stats', name: 'Statistics', category: 'infographic', width: 800, height: 2000, description: 'Data visualization' },
] as const
