// GenZ Live — Production Data Layer

export const CATEGORIES = [
  { id: 'all', name: 'All Feed', icon: 'Sparkles' },
  { id: 'trending', name: '🔥 Trending', icon: 'Flame' },
  { id: 'tech', name: '💻 Tech', icon: 'Cpu' },
  { id: 'ai', name: '🤖 AI', icon: 'Bot' },
  { id: 'india', name: '🇮🇳 India', icon: 'Globe' },
  { id: 'world', name: '🌍 World', icon: 'Globe2' },
  { id: 'business', name: '💼 Business', icon: 'Briefcase' },
  { id: 'markets', name: '📈 Markets', icon: 'TrendingUp' },
  { id: 'entertainment', name: '🎬 Entertainment', icon: 'Film' },
  { id: 'sports', name: '⚽ Sports', icon: 'Trophy' },
  { id: 'culture', name: '🎨 Culture', icon: 'Palette' },
];

export const BREAKING_HEADLINES = [
  { id: 'b1', text: "🚨 OpenAI & Anthropic Announce Next-Gen Autonomous AI Agents", category: "AI", time: "2m ago" },
  { id: 'b2', text: "⚡ India Tech Summit 2026: GenZ Founders Secure $1.2B in Funding", category: "India", time: "5m ago" },
  { id: 'b3', text: "📈 Global Crypto & Digital Asset Markets Reach Record High Volume", category: "Markets", time: "12m ago" },
  { id: 'b4', text: "🎬 Streaming Revolution: Independent Creators Take 45% Viewership Share", category: "Entertainment", time: "18m ago" },
  { id: 'b5', text: "🌍 Global Youth Climate Summit Begins with 190 Country Delegates", category: "World", time: "25m ago" },
];

export const FEATURED_STORIES = [
  {
    id: 'f1',
    title: 'The AI Autonomy Shift: How GenZ Engineers Are Building Autonomous Digital Workforces',
    subtitle: 'From code synthesis to automated media production, a new wave of young developers is fundamentally redefining software engineering.',
    category: 'ai',
    categoryName: 'AI & Future',
    author: 'Aarav Mehta',
    authorRole: 'Senior Tech Editor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publishedAt: '10 Mins Ago',
    readTime: '4 min read',
    views: '42.8k',
    likes: 3420,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    content: `
      <p class="lead">The landscape of software development and artificial intelligence is experiencing its most seismic transition since the advent of cloud computing. Autonomous AI agents are no longer experimental prototypes—they are becoming core team members in tech startups globally.</p>
      
      <h3>The Rise of Agentic Coding Systems</h3>
      <p>Young developers and GenZ founders across San Francisco, Bengaluru, London, and Tokyo are building native agent workflows where AI assistants orchestrate multi-step code execution, container deployments, and real-time database management without manual intervention.</p>
      
      <blockquote>"We aren't just prompting models anymore; we are managing synthetic development teams that work 24/7 with precision."</blockquote>
      
      <p>According to recent industry data, over 64% of developers under the age of 25 utilize autonomous coding agents daily, resulting in a 3x speedup in shipping production-ready applications.</p>

      <h3>What This Means for Digital Media</h3>
      <p>Platforms like GenZ Live are leveraging these capabilities to deliver instant news verification, automated real-time translation, and dynamic video content indexing. As AI continues to evolve, the distinction between content consumer and creator continues to blur.</p>
    `
  },
  {
    id: 'f2',
    title: 'India Tech Boom 2026: Bengaluru & Hyderabad Emerge as Global AI Innovation Hubs',
    subtitle: 'Venture capital inflow reaches unprecedented levels as Indian deep-tech startups disrupt global markets.',
    category: 'india',
    categoryName: 'India Tech',
    author: 'Riya Sharma',
    authorRole: 'National Affairs Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    publishedAt: '25 Mins Ago',
    readTime: '3 min read',
    views: '28.4k',
    likes: 2150,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    content: `
      <p>India’s technology ecosystem has entered a transformative era. Driven by world-class engineering talent, robust digital infrastructure, and explosive growth in AI startups, major global investors are shifting allocation focus toward Indian innovation labs.</p>
      <p>Key sectors attracting funding include autonomous robotics, clean energy intelligence, sovereign language models, and high-frequency digital finance.</p>
    `
  },
  {
    id: 'f3',
    title: 'Next-Gen Content Creators: Why GenZ Prefers Live Interactive News Over Cable TV',
    subtitle: 'Authenticity, real-time community engagement, and unfiltered digital coverage dominate modern media consumption.',
    category: 'trending',
    categoryName: 'Trending Media',
    author: 'Kabir Verma',
    authorRole: 'Culture & Media Critic',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    publishedAt: '45 Mins Ago',
    readTime: '5 min read',
    views: '35.1k',
    likes: 4890,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    content: `
      <p>Traditional broadcasting is undergoing a permanent shift. Audiences under 30 are turning away from scripted TV broadcasts in favor of live streaming platforms, creator-led journalism, and community-driven discussion rooms.</p>
      <p>GenZ Live stands at the forefront of this shift, providing raw, verified, and interactive media tailored to digital natives.</p>
    `
  }
];

export const ARTICLES = [
  ...FEATURED_STORIES,
  {
    id: 'a1',
    title: 'Quantum Computing Breaksthrough: Quantum Supremacy in Financial Modeling Achieved',
    category: 'tech',
    categoryName: 'Technology',
    author: 'Elena Rostova',
    publishedAt: '1 Hour Ago',
    readTime: '4 min read',
    views: '19.2k',
    likes: 1820,
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    content: '<p>Researchers have demonstrated quantum algorithms performing complex portfolio optimization and risk calculation in seconds—a task that previously required days of supercomputer processing.</p>'
  },
  {
    id: 'a2',
    title: 'Global Markets Rally as Green Energy Investments Surpass Fossil Fuels Worldwide',
    category: 'markets',
    categoryName: 'Markets',
    author: 'David Chen',
    publishedAt: '2 Hours Ago',
    readTime: '3 min read',
    views: '15.7k',
    likes: 1240,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    content: '<p>Solar, wind, and battery infrastructure capital expenditure officially crossed historical milestones today, propelling clean energy index funds to all-time highs.</p>'
  },
  {
    id: 'a3',
    title: 'The Creator Economy 3.0: Micro-Communities and Direct Token Monetization',
    category: 'business',
    categoryName: 'Business',
    author: 'Siddharth Rao',
    publishedAt: '3 Hours Ago',
    readTime: '5 min read',
    views: '22.1k',
    likes: 2940,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    content: '<p>Digital creators are building resilient business models away from ad-reliant platforms, leaning into direct subscriber support, micro-subscriptions, and exclusive community experiences.</p>'
  },
  {
    id: 'a4',
    title: 'Esports World Cup 2026 Sets Record Attendance with Over 100 Million Virtual Viewers',
    category: 'sports',
    categoryName: 'Sports',
    author: 'Marcus Vance',
    publishedAt: '4 Hours Ago',
    readTime: '3 min read',
    views: '54.3k',
    likes: 6710,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    content: '<p>The global gaming tournament reached unprecedented viewership numbers across Twitch, YouTube, and VR broadcast channels, confirming esports as a premier global sporting event.</p>'
  },
  {
    id: 'a5',
    title: 'Generative Cinema: Independent Filmmakers Premiere First Fully AI-Assisted Feature',
    category: 'entertainment',
    categoryName: 'Entertainment',
    author: 'Zoe Kravitz',
    publishedAt: '5 Hours Ago',
    readTime: '4 min read',
    views: '31.8k',
    likes: 3890,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    content: '<p>Premiering at the international film festival, the groundbreaking motion picture utilized neural rendering for visual effects, reducing production costs by 80% while retaining human directorial vision.</p>'
  },
  {
    id: 'a6',
    title: 'The Digital Renaissance: How GenZ Artists Are Reviving Fine Arts in Virtual Galleries',
    category: 'culture',
    categoryName: 'Culture',
    author: 'Ananya Deshmukh',
    publishedAt: '6 Hours Ago',
    readTime: '4 min read',
    views: '14.9k',
    likes: 1560,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    content: '<p>Immersion, interactive 3D spaces, and spatial audio are redefining how art is experienced by younger demographics around the globe.</p>'
  },
  {
    id: 'a7',
    title: 'UN Youth Climate Summit Reaches Historic Multilateral Agreement in Geneva',
    category: 'world',
    categoryName: 'World',
    author: 'Lars Lindqvist',
    publishedAt: '7 Hours Ago',
    readTime: '5 min read',
    views: '18.3k',
    likes: 2100,
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&auto=format&fit=crop&q=80',
    content: '<p>Youth leaders representing 190 countries signed a binding resolution targeting plastic pollution reduction and green job creation programs for under-30 workers.</p>'
  }
];

export const YOUTUBE_VIDEOS = [
  {
    id: 'yt1',
    title: 'LIVE: GenZ Live Daily Tech & AI Briefing — The Future of Autonomous Coding',
    duration: 'LIVE NOW',
    views: '14,280 watching',
    thumbnail: '/brand/02_YouTube_Banner_2560x1440.png',
    embedId: 'dQw4w9WgXcQ',
    isLive: true,
    published: 'Started 20m ago'
  },
  {
    id: 'yt2',
    title: 'India Tech Boom 2026: Behind the Scenes with GenZ Founders in Bengaluru',
    duration: '14:25',
    views: '89.4k views',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    embedId: 'M7lc1UVf-VE',
    isLive: false,
    published: '1 day ago'
  },
  {
    id: 'yt3',
    title: 'Top 5 AI Tools Every Developer & Creator Needs in 2026 | GenZ Tech Review',
    duration: '18:40',
    views: '124k views',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    embedId: 'dQw4w9WgXcQ',
    isLive: false,
    published: '3 days ago'
  }
];

export const SOCIAL_LINKS = {
  youtube: 'https://youtube.com/@genz-live-official',
  instagram: 'https://instagram.com/genzliveofficial',
  facebook: 'https://facebook.com/genzliveofficial',
  domain: 'https://genz-live.com',
  handle: '@genz-live-official'
};
