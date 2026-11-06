import { Wallet, Mic, Gamepad2, Bus, BarChart3, type LucideIcon } from 'lucide-react'
export type Project = {
  id: string
  title: string
  desc: string
  tech: string[]
  repo: string
  live?: string
  img?: string
  icon?: LucideIcon
  details: string[]
  status?: string
  isCustom?: boolean
}

export const initialProjects: Project[] = [
  {
    id: 'pennywise-ai',
    title: 'Pennywise AI',
    icon: Wallet,
    img: 'img/pennywise.webp',
    repo: 'https://github.com/mohanaaswath/Pennywise_AI',
    live: 'https://pennywise-ai-six.vercel.app/',
    desc: 'An AI-powered personal finance app that provides intelligent financial assistance and context-aware insights.',
    tech: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'LLM integration'],
    details: ['Supabase handles authentication and data storage', 'AI chat runs through Supabase edge functions', 'Built with React 18, TypeScript and Vite'],
  },
  {
    id: 'jarvis-ai',
    title: 'Jarvis AI',
    icon: Mic,
    repo: 'https://github.com/mohanaaswath/AI-JARVIS-VOICE-AGENT-',
    status: 'In development',
    desc: 'A voice assistant for Windows focused on natural voice interaction and computer-control tools.',
    tech: ['Python', 'FastAPI', 'LiveKit', 'Google Realtime Voice', 'React'],
    details: ['Real-time voice conversation through a LiveKit agent', 'Tools for apps, audio, files, settings and system info', 'Clap-based wake detection', 'Browser automation and standalone desktop mode are still in progress'],
  },
  {
    id: 'chess-game-ai',
    title: 'Chess Game AI',
    icon: Gamepad2,
    img: 'img/chess.webp',
    repo: 'https://github.com/mohanaaswath/Chess_Game_AI',
    live: 'https://mohanaaswath.github.io/Chess_Game_AI/',
    desc: 'An interactive chess application where you play against an AI opponent.',
    tech: ['React', 'JavaScript', 'Vite', 'Minimax'],
    details: ['Minimax search with alpha-beta pruning', '10 selectable difficulty levels', 'Deployed on GitHub Pages'],
  },
  {
    id: 'bus-tracking',
    title: 'Tamil Nadu Bus Tracking',
    icon: Bus,
    img: 'img/bus.webp',
    repo: 'https://github.com/mohanaaswath/TamilNadu_bus_tracking_app',
    live: 'https://mohanaaswath.github.io/TamilNadu_bus_tracking_app/',
    status: 'Simulation prototype',
    desc: 'A web app for exploring bus transportation across Tamil Nadu on an interactive map.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Leaflet'],
    details: ['Interactive map interface built with Leaflet', 'Bus movement is simulated; it does not use live GPS data'],
  },
  {
    id: 'covid-19',
    title: 'COVID-19 Data Analysis',
    icon: BarChart3,
    repo: 'https://github.com/mohanaaswath/covid-19-data-analysis-and-visualization-project',
    desc: 'A data analysis and visualization project exploring COVID-19 datasets and presenting insights through charts.',
    tech: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn'],
    details: ['Exploratory analysis in a Jupyter/Colab notebook', 'Visualizations of case and death data'],
  },
]

export const projects = initialProjects
export const smallProjects = [
  { title: 'TODO List', tech: 'HTML · CSS · JavaScript', repo: 'https://github.com/mohanaaswath/TODO-LIST', img: 'img/todo.webp' },
  { title: 'Calculator', tech: 'HTML · CSS · JavaScript', repo: 'https://github.com/mohanaaswath/Calculator', img: 'img/calculator.webp' },
]
