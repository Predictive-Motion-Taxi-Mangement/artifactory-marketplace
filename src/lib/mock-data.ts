
export interface Artwork {
  id: string;
  title: string;
  description: string;
  artistId: string;
  artistName: string;
  price: number;
  image: string;
  category: string;
  createdAt: string;
  medium: string;
  dimensions: string;
  aiModel: string;
  views: number;
  likes: number;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  artworks: number;
  followers: number;
  website?: string;
  instagram?: string;
  twitter?: string;
  joinedDate: string;
}

export const artworks: Artwork[] = [
  {
    id: "artwork-1",
    title: "Cosmic Convergence",
    description: "A vibrant exploration of celestial forms and cosmic energies merging in a dance of color and light. This piece captures the essence of universal connection through algorithmic interpretation.",
    artistId: "artist-1",
    artistName: "NeuroArtisan",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    category: "abstract",
    createdAt: "2023-11-15",
    medium: "Digital",
    dimensions: "3000x4000px",
    aiModel: "Midjourney v5",
    views: 1240,
    likes: 246,
  },
  {
    id: "artwork-2",
    title: "Digital Dreamscape",
    description: "An AI-generated landscape that blurs the line between reality and imagination, featuring surreal architectural elements embedded in an otherworldly natural setting.",
    artistId: "artist-2",
    artistName: "SynthWave",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1681412327205-8d8781d7d121?auto=format&fit=crop&w=800&q=80",
    category: "landscape",
    createdAt: "2023-10-22",
    medium: "Digital",
    dimensions: "4500x2500px",
    aiModel: "Stable Diffusion XL",
    views: 890,
    likes: 157,
  },
  {
    id: "artwork-3",
    title: "Neural Nocturne",
    description: "A deep exploration of nighttime aesthetics through the perspective of artificial intelligence. This piece merges organic textures with digital precision in a haunting nocturnal scene.",
    artistId: "artist-3",
    artistName: "PixelMind",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
    category: "abstract",
    createdAt: "2023-12-05",
    medium: "Digital",
    dimensions: "5000x5000px",
    aiModel: "DALL-E 3",
    views: 1550,
    likes: 312,
  },
  {
    id: "artwork-4",
    title: "Quantum Reverie",
    description: "An intricate visualization of quantum mechanics principles, rendered through advanced AI algorithms. The piece captures the beautiful uncertainty and probabilistic nature of subatomic phenomena.",
    artistId: "artist-4",
    artistName: "AImagination",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1633186710895-309db2ddaf00?auto=format&fit=crop&w=800&q=80",
    category: "abstract",
    createdAt: "2023-09-18",
    medium: "Digital",
    dimensions: "4000x3000px",
    aiModel: "Midjourney v5",
    views: 975,
    likes: 184,
  },
  {
    id: "artwork-5",
    title: "Synthetic Serenity",
    description: "A peaceful landscape generated through AI that evokes a sense of calm and tranquility. The artwork combines traditional landscape elements with subtle digital artifacts to create a unique visual experience.",
    artistId: "artist-2",
    artistName: "SynthWave",
    price: 279.99,
    image: "https://images.unsplash.com/photo-1633077705106-9e1109153274?auto=format&fit=crop&w=800&q=80",
    category: "landscape",
    createdAt: "2023-11-28",
    medium: "Digital",
    dimensions: "4500x2500px",
    aiModel: "Stable Diffusion XL",
    views: 720,
    likes: 143,
  },
  {
    id: "artwork-6",
    title: "Digital Identity",
    description: "An AI-generated portrait that explores the concept of identity in the digital age. The ambiguous facial features challenge viewers to question what defines us in an era of synthetic media.",
    artistId: "artist-3",
    artistName: "PixelMind",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80",
    category: "portrait",
    createdAt: "2023-10-05",
    medium: "Digital",
    dimensions: "3000x3000px",
    aiModel: "DALL-E 3",
    views: 1670,
    likes: 389,
  },
  {
    id: "artwork-7",
    title: "Algorithmic Aurora",
    description: "A stunning interpretation of the northern lights as processed through neural networks. The piece captures the ethereal quality of aurora borealis with a distinctly computational aesthetic.",
    artistId: "artist-1",
    artistName: "NeuroArtisan",
    price: 329.99,
    image: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=800&q=80",
    category: "landscape",
    createdAt: "2023-12-12",
    medium: "Digital",
    dimensions: "5000x3000px",
    aiModel: "Midjourney v5",
    views: 1120,
    likes: 276,
  },
  {
    id: "artwork-8",
    title: "Synthetic Soul",
    description: "An emotive AI-generated portrait that searches for the essence of humanity within digital creation. The artwork poses questions about consciousness and emotion in artificial systems.",
    artistId: "artist-4",
    artistName: "AImagination",
    price: 289.99,
    image: "https://images.unsplash.com/photo-1650721646028-8ce3df923155?auto=format&fit=crop&w=800&q=80",
    category: "portrait",
    createdAt: "2023-11-02",
    medium: "Digital",
    dimensions: "4000x4000px",
    aiModel: "Stable Diffusion XL",
    views: 940,
    likes: 217,
  },
];

export const artists: Artist[] = [
  {
    id: "artist-1",
    name: "NeuroArtisan",
    bio: "Creating ethereal abstract art through neural networks and digital manipulation. Specializing in cosmic and elemental themes that explore the intersection of technology and nature.",
    avatar: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=200&h=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
    artworks: 24,
    followers: 1850,
    website: "https://neuroartisan.ai",
    instagram: "neuro_artisan",
    twitter: "NeuroArtisan",
    joinedDate: "2023-01-15",
  },
  {
    id: "artist-2",
    name: "SynthWave",
    bio: "Pioneering the fusion of retro aesthetics with futuristic AI-generated visuals. My work explores nostalgic landscapes reimagined through algorithmic processes to create surreal environments.",
    avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=200&h=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80",
    artworks: 18,
    followers: 1240,
    instagram: "synth_wave_art",
    twitter: "SynthWaveArt",
    joinedDate: "2023-03-22",
  },
  {
    id: "artist-3",
    name: "PixelMind",
    bio: "Merging classical art techniques with cutting-edge AI to create unique digital worlds. My work aims to bridge the gap between traditional artistic expression and computational creativity.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1200&q=80",
    artworks: 32,
    followers: 2460,
    website: "https://pixelmind-studio.com",
    instagram: "pixel_mind_art",
    twitter: "PixelMindArt",
    joinedDate: "2022-11-05",
  },
  {
    id: "artist-4",
    name: "AImagination",
    bio: "Exploring the boundaries of perception through AI-generated imagery. My work focuses on the philosophical implications of artificial creativity and the future of human-machine collaboration in art.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
    artworks: 15,
    followers: 980,
    instagram: "aimagination_art",
    twitter: "AImaginationArt",
    joinedDate: "2023-05-18",
  },
];

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find(artwork => artwork.id === id);
};

export const getArtworksByArtist = (artistId: string): Artwork[] => {
  return artworks.filter(artwork => artwork.artistId === artistId);
};

export const getArtistById = (id: string): Artist | undefined => {
  return artists.find(artist => artist.id === id);
};

export const getRelatedArtworks = (artwork: Artwork, limit: number = 4): Artwork[] => {
  return artworks
    .filter(a => a.id !== artwork.id && (a.category === artwork.category || a.artistId === artwork.artistId))
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};
