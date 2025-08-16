// Mock data for LoyalHOOD VPS Hosting

export const vpsPlans = [
  {
    id: 1,
    name: "LoyalHOOD-1",
    subtitle: "Starter",
    disk: "50 GiB",
    ram: "8 GiB", 
    cpu: "4 cores @ 5700 MHz",
    panel: "SSH",
    price: "$11.05/m",
    popular: false,
    features: [
      "DDoS Protection",
      "99.9% Uptime SLA",
      "SSH Access",
      "Root Access",
      "24/7 Support"
    ]
  },
  {
    id: 2,
    name: "LoyalHOOD-2",
    subtitle: "Professional",
    disk: "100 GiB",
    ram: "16 GiB",
    cpu: "8 cores @ 5700 MHz", 
    panel: "SSH + Web Panel",
    price: "$22.10/m",
    popular: true,
    features: [
      "DDoS Protection",
      "99.9% Uptime SLA", 
      "SSH + Web Panel Access",
      "Root Access",
      "Priority Support",
      "Auto Backups"
    ]
  },
  {
    id: 3,
    name: "LoyalHOOD-3",
    subtitle: "Enterprise",
    disk: "250 GiB",
    ram: "32 GiB",
    cpu: "16 cores @ 5700 MHz",
    panel: "Full Management Suite",
    price: "$44.20/m",
    popular: false,
    features: [
      "Advanced DDoS Protection",
      "99.99% Uptime SLA",
      "Full Management Suite",
      "Root Access",
      "Dedicated Support",
      "Daily Auto Backups",
      "Load Balancing"
    ]
  }
];

export const features = [
  {
    id: 1,
    icon: "⚡",
    title: "Hyper-Speed Processing",
    description: "5700 MHz cores for zero-lag performance with cutting-edge hardware optimization.",
    interactive: true
  },
  {
    id: 2,
    icon: "🛡️",
    title: "Enterprise Security", 
    description: "DDoS protection + encrypted SSH access with multi-layer security protocols.",
    interactive: true
  },
  {
    id: 3,
    icon: "🌍",
    title: "Global Edge Nodes",
    description: "Ultra-low latency worldwide with strategically positioned data centers.",
    interactive: false
  },
  {
    id: 4,
    icon: "🤖",
    title: "AI Resource Optimization",
    description: "Automated load balancing for best performance using machine learning.",
    interactive: true
  },
  {
    id: 5,
    icon: "🚀",
    title: "Instant Deployment",
    description: "Get your VPS running in under 30 seconds with automated provisioning.",
    interactive: false
  },
  {
    id: 6,
    icon: "📊",
    title: "Real-time Monitoring",
    description: "Advanced analytics dashboard with live performance metrics and alerts.",
    interactive: true
  }
];

export const mockServerStats = {
  cpu: {
    usage: 45.2,
    cores: 8,
    frequency: "5700 MHz"
  },
  memory: {
    used: 12.8,
    total: 32,
    percentage: 40
  },
  disk: {
    used: 85.5,
    total: 250,
    percentage: 34.2
  },
  network: {
    inbound: 1240,
    outbound: 890,
    total: 2130
  },
  uptime: "15 days, 7 hours",
  status: "online"
};

export const realtimeMetrics = [
  { time: "00:00", cpu: 25, memory: 38, network: 1200 },
  { time: "00:05", cpu: 30, memory: 40, network: 1450 },
  { time: "00:10", cpu: 45, memory: 42, network: 1800 },
  { time: "00:15", cpu: 38, memory: 39, network: 1600 },
  { time: "00:20", cpu: 52, memory: 45, network: 2100 },
  { time: "00:25", cpu: 41, memory: 41, network: 1750 },
  { time: "00:30", cpu: 48, memory: 43, network: 1950 }
];

export const socialLinks = [
  {
    name: "Discord",
    url: "https://loyalhood.xyz/discord",
    icon: "discord"
  },
  {
    name: "Instagram", 
    url: "https://instagram.com/loyalhood",
    icon: "instagram"
  },
  {
    name: "YouTube",
    url: "https://youtube.com/loyalhood", 
    icon: "youtube"
  }
];

export const statusData = {
  overall: "operational",
  services: [
    {
      name: "VPS Hosting",
      status: "operational",
      uptime: "99.98%"
    },
    {
      name: "Web Panel",
      status: "operational", 
      uptime: "99.95%"
    },
    {
      name: "API Services",
      status: "operational",
      uptime: "99.99%"
    },
    {
      name: "Support System",
      status: "operational",
      uptime: "100%"
    }
  ],
  incidents: [
    {
      date: "2024-01-15",
      title: "Scheduled Maintenance",
      status: "resolved",
      duration: "2 hours"
    }
  ]
};