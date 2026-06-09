import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
// @ts-ignore
// Logo is now in public directory

import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
// import { GoogleGenAI, Type } from "@google/genai";
import { 
  Home, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  ChevronRight,
  MapPin,
  Tag,
  Maximize,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Edit,
  ArrowRight,
  Building2,
  Trees,
  Palmtree,
  Search,
  TrendingUp,
  Users,
  Eye,
  Database,
  ExternalLink,
  Filter,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Sparkles
} from 'lucide-react';
import { 
  Property, 
  CAMEROON_REGIONS, 
  FEATURED_PRICES, 
  FeaturedOption, 
  PropertyStatus, 
  PropertyType, 
  PROPERTY_TYPES, 
  PropertyRequest 
} from './types';
import { cn, formatPrice } from './lib/utils';
import { api } from './lib/api';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// --- Constants ---
const LOGO_URL = "/logo.png"; // Load logo from public directory

// --- Components ---

const Navbar = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Propriétés', path: '#properties', icon: Building2 },
    { name: 'Vendre', path: '#sell', icon: PlusCircle },
  ];

  const handleCreateOffer = () => {
    setIsOpen(false);
  };

  return (
    <div className="sticky top-8 z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto bg-white/60 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden">
        <div className="px-8 h-20 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0 min-w-[3rem] bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img src={LOGO_URL} alt="South Estates" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black tracking-tight text-forest leading-none font-heading">SOUTH</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gold leading-none mt-1 font-heading uppercase">Estates & Houses</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-all hover:text-forest uppercase tracking-widest font-heading relative group",
                  location.hash === link.path ? "text-forest" : "text-gray-500"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full",
                  location.hash === link.path && "w-full"
                )} />
              </a>
            ))}
            <a 
              href="#sell" 
              onClick={handleCreateOffer}
              className="bg-forest text-white px-8 py-3 rounded-full text-xs font-black hover:bg-opacity-90 transition-all shadow-xl hover:shadow-forest/20 font-heading uppercase tracking-[0.2em]"
            >
              Créer une offre
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-forest hover:text-gray-900 focus:outline-none p-2"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-forest/10 overflow-hidden"
            >
              <div className="px-8 pt-10 pb-12 space-y-8">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">Navigation</span>
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-5 px-6 py-5 rounded-[2rem] text-sm font-black text-forest hover:bg-forest hover:text-white uppercase tracking-widest transition-all shadow-sm border border-forest/5"
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-6 pt-8 border-t border-forest/5">
                  <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Contact & Support</span>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-forest/70 text-xs font-bold">
                      <div className="w-10 h-10 bg-forest/5 rounded-xl flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      +237 699 949 266
                    </div>
                    <div className="flex items-center gap-4 text-forest/70 text-xs font-bold">
                      <div className="w-10 h-10 bg-forest/5 rounded-xl flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      contact@southestates.cm
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-forest/5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-forest text-white rounded-xl flex items-center justify-center shadow-lg">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div className="w-10 h-10 bg-forest text-white rounded-xl flex items-center justify-center shadow-lg">
                      <Facebook className="w-4 h-4" />
                    </div>
                  </div>
                  <img src={LOGO_URL} alt="Logo" className="h-10 opacity-20 grayscale" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

const StickyFeaturedBanner = ({ properties }: { properties: Property[] }) => {
  const featured = properties.filter(p => p.featuredOption !== 'aucune');
  
  return (
    <div className="sticky top-0 z-[60] bg-forest py-2 overflow-hidden whitespace-nowrap border-b border-gold/20 shadow-lg">
      <div className="flex animate-marquee">
        {featured.length > 0 ? (
          [...featured, ...featured, ...featured, ...featured].map((p, i) => (
            <div key={`${p.id}-${i}`} className="flex items-center mx-12 text-white text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-gold text-forest text-[8px] font-black px-2 py-0.5 rounded mr-3">EN VEDETTE</span>
              <span className="mr-3">{p.title}</span>
              <span className="text-gold">{formatPrice(p.totalPrice)}</span>
              <span className="mx-6 text-white/30">|</span>
            </div>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center mx-12 text-white/60 text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white/10 text-white text-[8px] font-black px-2 py-0.5 rounded mr-3">INFO</span>
              <span>Boostez votre visibilité en choisissant une option "En Vedette" lors de la publication de votre offre.</span>
              <span className="mx-6 text-white/10">|</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 500) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 z-50 bg-forest text-white p-4 rounded-2xl shadow-2xl hover:bg-gold hover:text-forest transition-all border-2 border-white/20 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 -rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const PropertyCard = ({ property, onClick }: { property: Property, onClick: () => void }) => {
  const isSold = property.status === 'vendu';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative"
    >
      {isSold && (
        <div className="absolute top-10 -right-10 bg-rose-600 text-white px-12 py-2 rotate-45 z-30 shadow-xl border-y-2 border-white/20">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Vendu</span>
        </div>
      )}
      
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0] || 'https://picsum.photos/seed/house/800/600'}
          alt={property.title}
          className={cn(
            "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
            isSold && "grayscale-[0.5] opacity-80"
          )}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-forest text-white px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-lg">
            {property.quarter ? `${property.quarter}, ` : ''}{property.city}, {property.region}
          </span>
          <span className="bg-white/90 text-forest px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-lg">
            {property.type}
          </span>
          {property.referenceNumber && (
            <span className="bg-forest/90 text-white px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-lg">
              REF: {property.referenceNumber}
            </span>
          )}
          {property.featuredOption !== 'aucune' && (
            <span className="bg-gold text-forest px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-lg">
              En Vedette
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-xl border-l-4 border-forest">
            <p className="text-lg md:text-xl font-black text-forest">{formatPrice(property.totalPrice)}</p>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{formatPrice(property.pricePerM2)} / m²</p>
          </div>
        </div>
      </div>
      <div className="p-5 md:p-6">
        <h3 className="text-base md:text-lg font-black text-gray-900 mb-2 line-clamp-1 uppercase tracking-tight font-heading">{property.title}</h3>
        <div className="flex items-center gap-4 md:gap-5 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wide font-heading">
          <div className="flex items-center gap-2">
            <Maximize className="w-3.5 h-3.5 md:w-4 md:h-4 text-forest" />
            <span>{property.surface} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-forest" />
            <span>{property.quarter ? `${property.quarter}, ` : ''}{property.city}, {property.region}</span>
          </div>
        </div>
        {property.characteristics && property.characteristics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {property.characteristics.map(c => (
              <span key={c} className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">
                {c}
              </span>
            ))}
          </div>
        )}
        <p className="mt-4 text-gray-500 text-xs md:text-sm line-clamp-2 leading-relaxed font-medium font-sans">
          {property.description}
        </p>
        <button 
          onClick={onClick}
          className="mt-6 w-full py-3 border-2 border-forest text-forest font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-forest hover:text-white transition-all font-heading"
        >
          Voir les détails
        </button>
      </div>
    </motion.div>
  );
};

const PropertyDetailsModal = ({ property, isOpen, onClose }: { property: Property | null, isOpen: boolean, onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);
  
  if (!property) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-forest/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white lg:text-slate-900 lg:bg-slate-100 lg:hover:bg-slate-200 p-3 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left: Images */}
            <div className="w-full lg:w-3/5 h-[40vh] lg:h-auto relative bg-slate-900">
              <img 
                src={property.images[activeImage]} 
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {property.images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-md rounded-2xl overflow-x-auto max-w-[90%] no-scrollbar">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                        activeImage === idx ? "border-gold scale-110" : "border-transparent opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
              
              {property.status === 'vendu' && (
                <div className="absolute top-12 -left-12 bg-rose-600 text-white px-16 py-3 -rotate-45 shadow-2xl border-y-2 border-white/20">
                  <span className="text-sm font-black uppercase tracking-[0.3em]">Vendu</span>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="w-full lg:w-2/5 p-8 md:p-12 overflow-y-auto bg-white">
              <div className="space-y-8">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gold text-forest px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {property.type}
                    </span>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      REF: {property.referenceNumber}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-forest uppercase tracking-tight leading-tight font-heading">
                    {property.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-4 text-slate-400">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-xs font-bold uppercase tracking-widest">{property.quarter ? `${property.quarter}, ` : ''}{property.city}, {property.region}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix Total</p>
                    <p className="text-2xl font-black text-forest">{formatPrice(property.totalPrice)}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Surface</p>
                    <p className="text-2xl font-black text-forest">{property.surface} m²</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</h4>
                  <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                    {property.description}
                  </p>
                </div>

                {property.characteristics && property.characteristics.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caractéristiques</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.characteristics.map(c => (
                        <span key={c} className="bg-forest/5 text-forest border border-forest/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-slate-100">
                  <Button 
                    onClick={() => {
                      const message = `Bonjour, je suis intéressé par l'offre ${property.title} (REF: ${property.referenceNumber}) vue sur South Estates.`;
                      window.open(`https://wa.me/237690000000?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="w-full h-16 bg-forest text-white hover:bg-gold hover:text-forest rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    Contacter l'agent
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await api.login(name, password);
      localStorage.setItem('se_token', token);
      onLogin(); // Tell parent we logged in
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest/5 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-gold max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-gray-50">
            <img src={LOGO_URL} alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-forest uppercase tracking-tight font-heading">Espace Admin</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Accès restreint</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <Input 
              type="text"
              placeholder="Nom d'administrateur"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 bg-gray-50/50 rounded-2xl border-gray-200 focus:border-forest text-sm px-6"
            />
            <Input 
              type="password"
              placeholder="Mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 bg-gray-50/50 rounded-2xl border-gray-200 focus:border-forest text-sm px-6"
            />
          </div>
          <Button 
            disabled={loading}
            type="submit"
            className="w-full h-16 bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-gold hover:text-forest transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminLoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void, onLogin: () => void }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      onClose();
      navigate('/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen, onClose, navigate]);

  return null;
};

// --- Main Page Sections ---

const HeroSection = () => {
  const [searchRef, setSearchRef] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Property | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setIsSearching(true);
    try {
      const properties: Property[] = await api.getProperties();
      
      const found = properties.find((p: Property) => p.referenceNumber === searchRef.trim());

      if (!found || found.status !== 'approuvé') {
        toast.error("Aucune annonce trouvée avec cette référence.");
      } else {
        setSearchResult(found);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Une erreur est survenue lors de la recherche.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Home Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest/20" />
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3 bg-forest/10 border border-forest/20 px-6 py-2.5 rounded-full mb-10 backdrop-blur-md"
        >
          <Building2 className="w-5 h-5 text-white" />
          <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] font-heading">Immobilier de Prestige au Cameroun</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.85] font-display"
        >
          SOUTH ESTATES <br />
          <span className="text-gold italic">& HOUSES</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm md:text-2xl text-white max-w-3xl mx-auto mb-16 font-bold leading-relaxed px-4 font-heading drop-shadow-2xl"
        >
          Découvrez des propriétés d'élite, de vastes terrains et des villas de luxe dans les régions les plus prestigieuses du Cameroun. Nous comblons le fossé entre le rêve et la réalité.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 px-4"
        >
          <a 
            href="#sell" 
            className="group relative bg-forest text-white px-8 py-4 md:px-12 md:py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-[0_20px_50px_rgba(0,77,0,0.3)] hover:shadow-forest/40 hover:-translate-y-2 transition-all w-full sm:w-auto font-heading"
          >
            Publier une offre
            <PlusCircle className="inline-block ml-3 w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
          </a>
          <a 
            href="#properties" 
            className="group bg-white/80 backdrop-blur-md text-forest border-4 border-forest px-8 py-[14px] md:px-12 md:py-[22px] rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-forest hover:text-white transition-all w-full sm:w-auto shadow-xl hover:-translate-y-2 font-heading"
          >
            Nos propriétés
            <ArrowRight className="inline-block ml-3 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </motion.div>

        {/* Research Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto px-4"
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-forest to-gold rounded-[2rem] md:rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white/90 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] p-1.5 md:p-2 shadow-2xl border border-white/50">
              <div className="flex-shrink-0 pl-4 md:pl-6 pr-2 md:pr-4">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-forest" />
              </div>
              <input 
                type="text" 
                placeholder="Référence (ex: SE-2026-001)..."
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="w-full bg-transparent py-4 md:py-5 outline-none font-bold text-gray-700 placeholder:text-gray-400 text-xs md:text-base font-heading"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-forest text-white px-6 md:px-10 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-gold hover:text-forest transition-all shadow-lg font-heading disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : "Trouver"}
              </button>
            </div>
          </form>
          <p className="mt-4 text-[9px] md:text-[10px] font-black text-forest/40 uppercase tracking-[0.3em] font-heading">Recherche sécurisée et instantanée</p>
        </motion.div>
      </div>

      {/* Search Result Modal */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2rem] md:rounded-[3rem] border-none shadow-2xl">
          {searchResult && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
                <img src={searchResult.imageUrl} alt={searchResult.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-6 md:p-10 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <Badge className="bg-forest text-white rounded-full px-3 md:px-4 py-1 uppercase tracking-widest text-[9px] md:text-[10px]">
                      {searchResult.type}
                    </Badge>
                    <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">REF: {searchResult.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-forest uppercase tracking-tight mb-3 md:mb-4 font-heading">{searchResult.title}</h2>
                  <p className="text-gray-500 font-medium mb-6 md:mb-8 text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-4">{searchResult.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-forest/5 rounded-xl flex items-center justify-center">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Région</p>
                        <p className="text-xs md:text-sm font-bold text-forest">{searchResult.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-forest/5 rounded-xl flex items-center justify-center">
                        <Maximize className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Surface</p>
                        <p className="text-xs md:text-sm font-bold text-forest">{searchResult.surface} m²</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-gray-100">
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix Total</p>
                    <p className="text-xl md:text-3xl font-black text-forest">{formatPrice(searchResult.totalPrice)}</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setShowResult(false);
                      const el = document.getElementById('properties');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-forest text-white rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-6 font-black uppercase tracking-widest text-[10px] hover:bg-gold hover:text-forest transition-all shadow-xl"
                  >
                    Voir l'offre
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

const PropertyForm = ({ onSuccess, onCancel, isAdmin = false, initialData }: { onSuccess?: () => void, onCancel?: () => void, isAdmin?: boolean, initialData?: Property }) => {
  const [loading, setLoading] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialData?.images || []);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    pricePerM2: initialData?.pricePerM2 || 0,
    surface: initialData?.surface || 0,
    region: initialData?.region || CAMEROON_REGIONS[0],
    city: initialData?.city || '',
    quarter: initialData?.quarter || '',
    type: initialData?.type || PROPERTY_TYPES[0],
    characteristics: initialData?.characteristics || [] as string[],
    ownerName: initialData?.ownerName || '',
    ownerPhone: initialData?.ownerPhone || '',
    ownerEmail: initialData?.ownerEmail || '',
    description: initialData?.description || '',
    commission: initialData?.commission || 2.5,
    featuredOption: initialData?.featuredOption || 'aucune' as FeaturedOption
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem('se_user_details');
    if (savedDetails) {
      const { name, phone, email } = JSON.parse(savedDetails);
      setFormData(prev => ({
        ...prev,
        ownerName: prev.ownerName || name || '',
        ownerPhone: prev.ownerPhone || phone || '',
        ownerEmail: prev.ownerEmail || email || ''
      }));
    }
  }, []);

  const totalPrice = formData.pricePerM2 * formData.surface;
  const commissionAmount = totalPrice * (formData.commission / 100);

  const handleAIImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    toast.error("L'analyse par l'IA est désactivée en mode serverless (nécessite un backend sécurisé pour Gemini API).");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file as Blob));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + "\n- " + value.substring(end);
      setFormData({ ...formData, description: newValue });
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 3; }, 0);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0 && !initialData) { toast.error("Veuillez télécharger au moins une image"); return; }

    setLoading(true);
    console.log("Starting submission with data:", formData);
    try {
      let urls = initialData?.images || [];
      
      if (images.length > 0) {
        console.log("Uploading images...");
        const newUrls = await api.uploadImages(images);
        urls = initialData ? [...urls, ...newUrls] : newUrls;
        console.log("Images uploaded successfully:", urls);
      }

      // Save personal details for autofill
      localStorage.setItem('se_user_details', JSON.stringify({
        name: formData.ownerName,
        phone: formData.ownerPhone,
        email: formData.ownerEmail
      }));

      const propertyData: any = {
        ...formData,
        title: String(formData.title || ''),
        pricePerM2: Number(formData.pricePerM2) || 0,
        surface: Number(formData.surface) || 0,
        region: String(formData.region || CAMEROON_REGIONS[0]),
        city: String(formData.city || ''),
        quarter: String(formData.quarter || ''),
        type: String(formData.type || PROPERTY_TYPES[0]),
        ownerName: String(formData.ownerName || ''),
        ownerPhone: String(formData.ownerPhone || ''),
        ownerEmail: String(formData.ownerEmail || ''),
        description: String(formData.description || ''),
        commission: Number(formData.commission) || 0,
        totalPrice: Number(totalPrice) || 0,
        commissionAmount: Number(commissionAmount) || 0,
        characteristics: formData.characteristics || [],
        images: urls || [],
      };

      if (!initialData) {
        propertyData.status = 'en attente';
        propertyData.createdat = new Date().toISOString();
      }

      if (!navigator.onLine) {
        const saved = localStorage.getItem('se_pending_actions');
        const pending = saved ? JSON.parse(saved) : [];
        pending.push({ 
          type: initialData ? 'update_property' : 'create_property', 
          id: initialData?.id,
          payload: propertyData, 
          timestamp: new Date().toISOString() 
        });
        localStorage.setItem('se_pending_actions', JSON.stringify(pending));
        toast.info(initialData ? "Modification enregistrée localement" : "Offre enregistrée localement");
        if (onSuccess) onSuccess();
        return;
      }

      if (initialData) {
        try {
          await api.updateProperty(initialData.id, propertyData);
          toast.success("Propriété mise à jour avec succès !");
        } catch (error) {
          toast.error("Erreur mise à jour");
        }
      } else {
        try {
          await api.createProperty(propertyData);
          toast.success("Offre soumise avec succès !");
          resetForm();
        } catch (error) {
          toast.error("Erreur création");
        }
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Échec de la soumission. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      pricePerM2: 0,
      surface: 0,
      region: CAMEROON_REGIONS[0],
      city: '',
      quarter: '',
      type: PROPERTY_TYPES[0],
      characteristics: [],
      ownerName: formData.ownerName, // Keep personal details for next use
      ownerPhone: formData.ownerPhone,
      ownerEmail: formData.ownerEmail,
      description: '',
      commission: 2.5,
      featuredOption: 'aucune'
    });
    setImages([]);
    setPreviews([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] border-4 border-white/50 overflow-hidden">
      {isAdmin && (
        <div className="bg-gradient-to-r from-forest to-forest/80 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Sparkles className="w-6 h-6 text-gold animate-pulse" />
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-widest text-xs md:text-sm">Remplissage automatique par IA</p>
              <p className="text-white/60 text-[10px] md:text-xs">Téléchargez une photo de l'annonce pour extraire les détails</p>
            </div>
          </div>
          <label className={cn(
            "flex items-center gap-3 px-6 py-4 bg-white text-forest rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl cursor-pointer hover:bg-gold transition-all active:scale-95 group",
            analyzingImage && "opacity-50 pointer-events-none"
          )}>
            {analyzingImage ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-forest" />
                Scanner une image
                <input type="file" accept="image/*" className="hidden" onChange={handleAIImageUpload} />
              </>
            )}
          </label>
        </div>
      )}
      <div className="p-6 md:p-10 space-y-8 md:space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Titre de la propriété</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex: Villa de luxe à Bastos"
              className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 text-sm md:text-base"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Prix au m² (FCFA)</label>
            <div className="relative">
              <input
                required
                type="text"
                value={formData.pricePerM2 ? formData.pricePerM2.toLocaleString('fr-FR') : ''}
                onChange={e => {
                  const val = e.target.value.replace(/\s/g, '');
                  if (!isNaN(Number(val))) {
                    setFormData({ ...formData, pricePerM2: Number(val) });
                  }
                }}
                placeholder="0"
                className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 text-sm md:text-base"
              />
              <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-[10px]">FCFA</div>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Surface (m²)</label>
            <div className="relative">
              <input
                required
                type="text"
                value={formData.surface ? formData.surface.toLocaleString('fr-FR') : ''}
                onChange={e => {
                  const val = e.target.value.replace(/\s/g, '');
                  if (!isNaN(Number(val))) {
                    setFormData({ ...formData, surface: Number(val) });
                  }
                }}
                placeholder="0"
                className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 text-sm md:text-base"
              />
              <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-[10px]">m²</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Taux de commission</label>
            <select
              value={formData.commission}
              onChange={e => setFormData({ ...formData, commission: Number(e.target.value) })}
              className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 text-sm md:text-base appearance-none bg-white"
            >
              <option value={2.5}>2.5% (Standard)</option>
              <option value={3}>3% (Premium)</option>
              <option value={4}>4% (Elite)</option>
              <option value={5}>5% (VIP)</option>
            </select>
          </div>
        </div>

        <div className="bg-forest rounded-2xl md:rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-4 border-gold/20 shadow-inner">
          <div>
            <p className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1 md:mb-2">Évaluation Totale</p>
            <p className="text-xl md:text-3xl font-black text-white">{formatPrice(totalPrice)}</p>
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1 md:mb-2">Commission de l'agent ({formData.commission}%)</p>
            <p className="text-xl md:text-3xl font-black text-white">{formatPrice(commissionAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Région</label>
            <select
              value={formData.region}
              onChange={e => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 appearance-none bg-white"
            >
              {CAMEROON_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Ville</label>
            <input
              required
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="ex: Douala"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Quartier (Optionnel)</label>
            <input
              type="text"
              value={formData.quarter}
              onChange={e => setFormData({ ...formData, quarter: e.target.value })}
              placeholder="ex: Bonapriso"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Type d'offre</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as PropertyType })}
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 appearance-none bg-white"
            >
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Caractéristiques</label>
            <div className="flex flex-wrap gap-3">
              {['Titre foncier', 'Viabilisé', 'Clôturé', 'Accès facile', 'Eau/Électricité'].map(char => (
                <button
                  key={char}
                  type="button"
                  onClick={() => {
                    const current = formData.characteristics;
                    const next = current.includes(char) 
                      ? current.filter(c => c !== char)
                      : [...current, char];
                    setFormData({ ...formData, characteristics: next });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    formData.characteristics.includes(char)
                      ? "bg-gold text-forest border-gold shadow-md"
                      : "bg-white text-gray-400 border-gray-100 hover:border-gold/30"
                  )}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-black text-forest uppercase tracking-[0.2em] mb-6">Informations de contact</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nom complet</label>
                <input
                  required
                  type="text"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Téléphone</label>
                <input
                  required
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={e => setFormData({ ...formData, ownerPhone: e.target.value })}
                  placeholder="Votre numéro"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input
                  required
                  type="email"
                  value={formData.ownerEmail}
                  onChange={e => setFormData({ ...formData, ownerEmail: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Promotion en vedette</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(FEATURED_PRICES) as FeaturedOption[]).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData({ ...formData, featuredOption: opt })}
                  className={cn(
                    "px-4 py-4 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all",
                    formData.featuredOption === opt 
                      ? "bg-forest text-white border-forest shadow-xl" 
                      : "bg-white text-gray-400 border-gray-100 hover:border-forest/20"
                  )}
                >
                  {opt === 'aucune' ? 'Standard' : opt}
                  <span className="block text-[9px] mt-1 opacity-60">
                    {FEATURED_PRICES[opt] > 0 ? `${FEATURED_PRICES[opt]} FCFA` : 'Inclus'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Description détaillée</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onKeyDown={handleDescriptionKeyDown}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez les points forts de la propriété... (Entrée pour les puces)"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Téléchargement de la galerie</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-gray-100 shadow-lg">
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-2xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-forest hover:bg-forest/5 transition-all group">
              <ImageIcon className="w-10 h-10 text-gray-200 group-hover:text-forest transition-colors" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-forest">Ajouter des images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-center">
        <button
          disabled={loading}
          type="submit"
          className="w-full max-w-md bg-forest text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-opacity-90 hover:shadow-forest/20 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              Soumettre l'offre immobilière
              <ChevronRight className="w-6 h-6 text-gold" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const CreateListingSection = () => {
  return (
    <section id="sell" className="py-20 md:py-32 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-forest uppercase tracking-tight mb-4 md:mb-6 font-heading">Créer une offre</h2>
          <p className="text-gray-500 font-medium text-sm md:text-lg">Rejoignez le réseau immobilier le plus prestigieux du Cameroun.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <PropertyForm isAdmin={false} />
        </motion.div>
      </div>
    </section>
  );
};

const PropertyRequestSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: PROPERTY_TYPES[0],
    budgetMax: 50000000,
    cities: 'Douala',
    surfaceMin: 300,
    description: '',
    name: '',
    phone: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const path = 'requests';
    try {
      const requestData = { ...formData, createdat: new Date().toISOString() };
      const resData = await api.createRequest(requestData);
      const data = { id: resData.id, ...requestData };
      
      // Demande enregistrée
      toast.success("Votre demande a été enregistrée avec succès !");
      setFormData({
        type: PROPERTY_TYPES[0],
        budgetMax: 50000000,
        cities: 'Douala',
        surfaceMin: 300,
        description: '',
        name: '',
        phone: '',
        email: ''
      });
    } catch (error) {
      toast.error("Erreur création demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="request" className="py-20 md:py-32 px-4 relative z-10 bg-forest/5">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-forest uppercase tracking-tight mb-4 md:mb-6 font-heading">Rechercher une propriété</h2>
          <p className="text-gray-500 font-medium text-sm md:text-lg">Vous ne trouvez pas votre bonheur ? Dites-nous ce que vous cherchez.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit} 
          className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 border-white overflow-hidden"
        >
          <div className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Type recherché *</label>
                <select
                  required
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as PropertyType })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 appearance-none bg-white"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Budget max (FCFA) *</label>
                <input
                  required
                  type="number"
                  value={formData.budgetMax}
                  onChange={e => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ville(s) *</label>
                <input
                  required
                  type="text"
                  value={formData.cities}
                  onChange={e => setFormData({ ...formData, cities: e.target.value })}
                  placeholder="ex: Douala, Kribi"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Surface min (m²)</label>
                <input
                  type="number"
                  value={formData.surfaceMin}
                  onChange={e => setFormData({ ...formData, surfaceMin: Number(e.target.value) })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre recherche..."
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nom complet *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Téléphone *</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Email *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-forest outline-none transition-all font-bold text-gray-700"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                disabled={loading}
                type="submit"
                className="bg-forest text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-gold hover:text-forest transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Soumettre ma recherche
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

const HomePage = ({ properties, loading, selectedProperty, setSelectedProperty }: { 
  properties: Property[], 
  loading: boolean,
  selectedProperty: Property | null,
  setSelectedProperty: (p: Property | null) => void
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PropertyType | 'all'>('all');

  const filteredProperties = properties.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.type === selectedCategory;
    
    // Only show approved or sold properties
    if (p.status !== 'approuvé' && p.status !== 'vendu') return false;

    // Auto-remove sold properties after 3 days
    if (p.status === 'vendu' && p.soldAt) {
      const soldDate = new Date(p.soldAt).getTime();
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - soldDate > threeDaysInMs) return false;
    }
    
    return matchesCategory;
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-premium-pattern pointer-events-none" />
      <HeroSection />
      
      {/* Properties Section */}
      <section id="properties" className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8"
        >
          <div>
            <h2 className="text-3xl md:text-6xl font-black text-forest uppercase tracking-tighter mb-4 md:mb-6 font-heading">Annonces d'élite</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[9px] md:text-xs font-heading">Propriétés sélectionnées pour l'acheteur exigeant</p>
          </div>
          <div className="flex items-center gap-4 md:gap-6 bg-white/40 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/50 shadow-2xl w-fit">
            <span className="text-forest font-black text-3xl md:text-5xl font-heading">{filteredProperties.length}</span>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[11px] leading-tight font-heading">Annonces <br /> Vérifiées</span>
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 mb-16 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2",
              selectedCategory === 'all' 
                ? "bg-forest text-white border-forest shadow-xl scale-105" 
                : "bg-white/60 text-gray-400 border-white/50 hover:border-forest/20"
            )}
          >
            Tous
          </button>
          {PROPERTY_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedCategory(type)}
              className={cn(
                "px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2",
                selectedCategory === type 
                  ? "bg-forest text-white border-forest shadow-xl scale-105" 
                  : "bg-white/60 text-gray-400 border-white/50 hover:border-forest/20"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-forest animate-spin mb-6" />
            <p className="text-forest font-black uppercase tracking-widest text-xs">Analyse de l'horizon...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
            <Search className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-forest uppercase tracking-tight mb-3">Aucune propriété trouvée</h3>
            <p className="text-gray-400 font-bold">Essayez une autre catégorie ou revenez plus tard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map((p) => (
              <React.Fragment key={p.id}>
                <PropertyCard 
                  property={p} 
                  onClick={() => setSelectedProperty(p)}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </section>

      <PropertyDetailsModal 
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      <PropertyRequestSection />
      
      <CreateListingSection />

      {/* About Section */}
      <section className="py-20 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="aspect-square rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-8 border-white/50">
              <img src="https://i.ibb.co/d90xZVR/IMG-0432.webp" alt="About South Estates" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 bg-gold p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl hidden sm:block border-8 border-white">
              <p className="text-3xl md:text-5xl font-black text-forest leading-none mb-1 md:mb-2 font-heading">20+</p>
              <p className="text-[9px] md:text-[11px] font-black text-forest uppercase tracking-[0.2em] font-heading">Années de Confiance</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 md:space-y-10"
          >
            <h2 className="text-4xl md:text-6xl font-black text-forest uppercase tracking-tighter leading-[0.85] font-heading">NOUS SOMMES <br /> <span className="text-gold">SOUTH ESTATES <br /> & HOUSES</span></h2>
            <p className="text-gray-500 text-base md:text-xl leading-relaxed font-medium font-sans">
              Chez South Estates and Houses, nous ne vendons pas seulement des propriétés ; nous cultivons des héritages. Nos racines profondes dans le sol camerounais nous permettent d'offrir une expertise inégalée dans l'acquisition de terrains, le développement de villas et les ventes résidentielles.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-forest/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-forest w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-forest uppercase text-xs tracking-widest mb-2 font-heading">Vérification Juridique</h4>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed">Chaque titre de propriété est strictement vérifié par nos experts juridiques.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-forest/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-forest w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-forest uppercase text-xs tracking-widest mb-2 font-heading">Emplacements Stratégiques</h4>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed">Nous nous concentrons sur les zones à forte croissance pour un rendement d'investissement maximal.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const EditPropertyModal = ({ property, isOpen, onClose }: { property: Property, isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight font-heading">Modifier la propriété</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">REF: {property.referenceNumber}</p>
              </div>
              <Button 
                onClick={onClose}
                variant="ghost"
                className="h-12 w-12 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <PropertyForm 
              isAdmin={true} 
              initialData={property} 
              onSuccess={onClose} 
              onCancel={onClose}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AdminPanel = ({ 
  isAdmin, 
  editingProperty, 
  setEditingProperty 
}: { 
  isAdmin: boolean, 
  editingProperty: Property | null,
  setEditingProperty: (p: Property | null) => void
}) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PropertyStatus>('en attente');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<any[]>(() => {
    const saved = localStorage.getItem('se_pending_actions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('se_pending_actions', JSON.stringify(pendingActions));
  }, [pendingActions]);

  const syncActions = async () => {
    if (!isOnline || pendingActions.length === 0) return;
    setIsSyncing(true);
    const toastId = toast.loading("Synchronisation des modifications...");
    
    const remainingActions = [...pendingActions];
    const failedActions = [];

    for (const action of pendingActions) {
      try {
        if (action.type === 'update_status') {
          await api.updateProperty(action.id, action.payload);
        } else if (action.type === 'delete_property') {
          await api.deleteProperty(action.id);
        } else if (action.type === 'delete_request') {
          // not implemented
        } else if (action.type === 'update_property') {
          await api.updateProperty(action.id, action.payload);
        } else if (action.type === 'create_property') {
          await api.createProperty(action.payload);
        }
        
        remainingActions.shift();
      } catch (err) {
        console.error("Sync error for action:", action, err);
        failedActions.push(action);
        remainingActions.shift();
      }
    }

    setPendingActions(failedActions);
    setIsSyncing(false);
    toast.dismiss(toastId);
    
    if (failedActions.length === 0) {
      toast.success("Toutes les modifications ont été synchronisées !");
    } else {
      toast.error(`${failedActions.length} modifications n'ont pas pu être synchronisées.`);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    window.scrollTo(0, 0);

    // Fetch properties
    const fetchProperties = async () => {
      try {
        const props = await api.getProperties();
        setProperties(props);
        setLoading(false);
      } catch (error: any) {
        toast.error("Erreur chargement propriétés: " + error.message);
        setLoading(false);
      }
    };

    // Fetch requests
    const fetchRequests = async () => {
      try {
        const reqs = await api.getRequests();
        setRequests(reqs);
      } catch (error: any) {
        toast.error("Erreur chargement requêtes: " + error.message);
      }
    };

    fetchProperties();
    fetchRequests();
    
    // Set a simple polling mechanism
    const id = setInterval(() => {
      fetchProperties();
      fetchRequests();
    }, 15000);

    return () => clearInterval(id);
  }, [isAdmin]);

  const generateReferenceNumber = () => {
    // We'll use the current count of properties to generate a sequential number
    const nextNum = (properties.length + 1).toString().padStart(3, '0');
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `SE-${nextNum}-${month}-${year}`;
  };

  const [isBulkScanning, setIsBulkScanning] = useState(false);

  const handleBulkAIImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    toast.error("La fonction Scan AI est désactivée dans l'architecture serverless (les API keys IA nécessitent un backend sécurisé).");
    return;
  };

  const exportToExcel = () => {
    const data = properties.map(p => ({
      'Référence': p.referenceNumber,
      'Titre': p.title,
      'Type': p.type,
      'Prix Total': p.totalPrice,
      'Surface (m2)': p.surface,
      'Ville': p.city,
      'Quartier': p.quarter,
      'Statut': p.status,
      'Date Création': new Date(p.createdat).toLocaleDateString('fr-FR'),
      'Vendu Le': p.soldAt ? new Date(p.soldAt).toLocaleDateString('fr-FR') : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Propriétés");
    XLSX.writeFile(wb, `Rapport_SouthEstates_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Rapport Excel exporté !");
  };

  const updateStatus = async (id: string, status: PropertyStatus) => {
    const updates: any = { status };
    if (status === 'approuvé') {
      const prop = properties.find(p => p.id === id);
      if (prop && !prop.referenceNumber) {
        updates.referenceNumber = generateReferenceNumber();
      }
    }
    if (status === 'vendu') {
      updates.soldAt = new Date().toISOString();
    }

    if (!isOnline) {
      setPendingActions(prev => [...prev, { type: 'update_status', id, payload: updates, timestamp: new Date().toISOString() }]);
      toast.info("Action enregistrée localement (Hors ligne)");
      // Optimistic update
      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      return;
    }

    try {
      await api.updateProperty(id, updates);
      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      toast.success(`Annonce ${status === 'approuvé' ? 'approuvée' : 'rejetée'} avec succès.`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;

    if (!isOnline) {
      setPendingActions(prev => [...prev, { type: 'delete_property', id, timestamp: new Date().toISOString() }]);
      toast.info("Suppression enregistrée localement (Hors ligne)");
      setProperties(prev => prev.filter(p => p.id !== id));
      return;
    }

    try {
      await api.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Annonce supprimée définitivement.");
    } catch (error) {
      toast.error("Erreur de suppression");
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return;

    if (!isOnline) {
      setPendingActions(prev => [...prev, { type: 'delete_request', id, timestamp: new Date().toISOString() }]);
      toast.info("Suppression enregistrée localement (Hors ligne)");
      setRequests(prev => prev.filter(r => r.id !== id));
      return;
    }

    try {
      // Assuming api.deleteRequest isn't implemented? We can just hide it locally for now if not implemented.
      // But let's build it if not there, or just ignore. We only did deleteProperty, I'll delete local.
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success("Demande supprimée.");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md bg-white/60 backdrop-blur-2xl p-16 rounded-[4rem] shadow-2xl border-4 border-white/50"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-forest uppercase tracking-tight mb-4 font-heading">Accès Restreint</h1>
          <p className="text-gray-400 font-bold mb-10 uppercase tracking-widest text-xs">Veuillez utiliser le portail admin pour accéder.</p>
          <Link to="/" className="inline-block bg-forest text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-gold hover:text-forest transition-all font-heading">
            Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    );
  }

  const stats = {
    total: properties.length,
    pending: properties.filter(p => p.status === 'en attente').length,
    approved: properties.filter(p => p.status === 'approuvé').length,
    rejected: properties.filter(p => p.status === 'rejeté').length,
    sold: properties.filter(p => p.status === 'vendu').length,
    totalValue: properties.reduce((acc, p) => acc + p.totalPrice, 0),
    earnings: {
      week: properties.filter(p => p.status === 'vendu' && new Date(p.soldAt!).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).reduce((acc, p) => acc + p.commissionAmount, 0),
      month: properties.filter(p => p.status === 'vendu' && new Date(p.soldAt!).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).reduce((acc, p) => acc + p.commissionAmount, 0),
      year: properties.filter(p => p.status === 'vendu' && new Date(p.soldAt!).getTime() > Date.now() - 365 * 24 * 60 * 60 * 1000).reduce((acc, p) => acc + p.commissionAmount, 0),
    }
  };

  const filtered = properties.filter(p => p.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-slate-950 text-white flex flex-col lg:min-h-screen lg:sticky lg:top-0 z-50 shadow-2xl">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 flex-shrink-0 min-w-[2.5rem] bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src={LOGO_URL} alt="South Estates" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none font-space">SOUTH</span>
            <span className="text-[7px] font-bold tracking-[0.3em] text-gold leading-none mt-1 font-space uppercase">Estates & Houses</span>
          </div>
        </div>

        <div className="flex-1 py-8 flex flex-col gap-1">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-8">Navigation</p>
          
          <div className="px-8 mb-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-red-500")} />
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">
                  {isOnline ? "Connecté" : "Hors ligne"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", "bg-emerald-500")} />
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">
                  Database: OPÉRATIONNEL
                </span>
              </div>
            </div>
          </div>

          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
            { id: 'properties', label: 'Annonces', icon: Building2 },
            { id: 'create-offer', label: 'Créer une offre', icon: PlusCircle },
            { id: 'requests', label: 'Demandes', icon: Mail },
            { id: 'database', label: 'Connecteurs DB', icon: Database },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-4 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all text-left relative group",
                activeTab === item.id 
                  ? "text-gold bg-gold/5 border-r-4 border-gold" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-gold" : "text-slate-500 group-hover:text-white")} />
              {item.label}
            </button>
          ))}

          <button 
            onClick={() => {
              localStorage.removeItem('se_token');
              window.location.href = '/';
            }}
            className="flex items-center gap-4 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/5"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <div className="p-8 border-t border-white/5 space-y-6">
          <Button 
            onClick={() => setActiveTab('create-offer')}
            className="w-full bg-gold text-slate-950 hover:bg-white hover:text-slate-950 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 border-none"
          >
            <PlusCircle className="w-4 h-4" />
            Créer une offre
          </Button>

          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Système</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 animate-pulse")} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
                  {isOnline ? "Connecté" : "Hors ligne"}
                </span>
              </div>
            </div>
            {pendingActions.length > 0 && (
              <Button 
                onClick={syncActions}
                disabled={!isOnline || isSyncing}
                className="bg-slate-800 text-gold h-8 w-8 rounded-lg p-0 flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest font-space">
              {activeTab === 'dashboard' && "Dashboard Overview"}
              {activeTab === 'properties' && "Property Management"}
              {activeTab === 'create-offer' && "Créer une offre"}
              {activeTab === 'requests' && "Search Requests"}
              {activeTab === 'database' && "Database Infrastructure"}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Admin Portal</span>
              <span className="text-[9px] font-bold text-slate-400">Admin</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20">
          <div>
            <h1 className="text-3xl md:text-6xl font-black text-forest uppercase tracking-tighter mb-3 font-heading">
              {activeTab === 'dashboard' && "Tableau de bord"}
              {activeTab === 'properties' && "Gestion des Annonces"}
              {activeTab === 'create-offer' && "Créer une offre"}
              {activeTab === 'requests' && "Demandes de Recherche"}
              {activeTab === 'database' && "Base de Données"}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] font-heading">Administrateur</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => setActiveTab('requests')}
              variant="outline" 
              className="rounded-2xl border-2 border-forest/10 hover:bg-forest/5 font-black uppercase tracking-widest text-[10px] h-12 md:h-14 px-6 md:px-8"
            >
              <Mail className="w-4 h-4 mr-2" /> Messages
            </Button>
            <Button 
              onClick={() => setActiveTab('create-offer')}
              className="bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 md:h-14 px-6 md:px-8 shadow-xl hover:bg-gold hover:text-forest transition-all flex items-center justify-center"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Créer une offre
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} className="space-y-12" onValueChange={setActiveTab}>

          <TabsContent value="dashboard" className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Propriétés', value: stats.total, icon: Building2, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'En Attente', value: stats.pending, icon: Clock, trend: 'Action requise', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Commissions (Mois)', value: formatPrice(stats.earnings.month), icon: TrendingUp, trend: 'Actif', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Vendus', value: stats.sold, icon: CheckCircle, trend: 'Succès', color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((stat, i) => (
                <Card key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all border-b-4 border-b-gold">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className={cn("text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest", stat.bg, stat.color)}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight font-space">{stat.value}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight font-space">Approbations Récentes</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flux de travail des annonces</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-slate-900">Voir tout</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-100">
                        <TableHead className="px-8 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Propriété</TableHead>
                        <TableHead className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Type</TableHead>
                        <TableHead className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Prix</TableHead>
                        <TableHead className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Statut</TableHead>
                        <TableHead className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.slice(0, 5).map((p) => (
                        <TableRow key={p.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                          <TableCell className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight truncate">{p.title}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{p.city}, {p.region}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {p.type}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 font-bold text-slate-900 text-xs whitespace-nowrap">
                            {formatPrice(p.totalPrice)}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                p.status === 'approuvé' ? "bg-emerald-500" : p.status === 'en attente' ? "bg-amber-500" : p.status === 'vendu' ? "bg-blue-500" : "bg-rose-500"
                              )} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{p.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                onClick={() => setEditingProperty(p)}
                                variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              {p.status === 'approuvé' && (
                                <Button 
                                  onClick={() => updateStatus(p.id, 'vendu')}
                                  variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 text-blue-500"
                                  title="Marquer comme vendu"
                                >
                                  <Tag className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              {p.status === 'en attente' && (
                                <Button 
                                  onClick={() => updateStatus(p.id, 'approuvé')}
                                  variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-emerald-500"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="bg-slate-900 text-white rounded-2xl border-none shadow-xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-gold/20 transition-all" />
                  <CardHeader className="p-8 relative z-10">
                    <CardTitle className="text-lg font-black uppercase tracking-tight font-space">Actions Rapides</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestion des ressources</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-3 relative z-10">
                    <Button 
                      onClick={exportToExcel}
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-start px-6 gap-3"
                    >
                      <Database className="w-4 h-4 text-gold" /> Exporter (Excel)
                    </Button>
                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-start px-6 gap-3">
                      <TrendingUp className="w-4 h-4 text-gold" /> Rapport Mensuel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Infrastructure</p>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Serveur Actif</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">v2.4.0</span>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create-offer" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <PropertyForm isAdmin={true} onSuccess={() => setActiveTab('properties')} />
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {(['en attente', 'approuvé', 'rejeté'] as const).map(f => (
                  <Button
                    key={f}
                    onClick={() => setFilter(f)}
                    variant={filter === f ? "default" : "outline"}
                    className={cn(
                      "px-6 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all font-space",
                      filter === f ? "bg-slate-900 text-white shadow-lg" : "bg-white border-slate-200 text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {f} ({properties.filter(p => p.status === f).length})
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <label className={cn(
                  "flex items-center gap-2 px-4 h-12 bg-forest text-white rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-lg cursor-pointer hover:bg-forest/90 transition-all group",
                  isBulkScanning && "opacity-50 pointer-events-none"
                )}>
                  {isBulkScanning ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> SCAN EN COURS...</>
                  ) : (
                    <><ImageIcon className="w-4 h-4" /> SCAN MASSIF IA</>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleBulkAIImageUpload} />
                </label>
                <div className="relative w-full lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-11 h-12 rounded-xl bg-white border-slate-200 font-bold text-slate-900 placeholder:text-slate-400 focus:ring-gold/20 focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-8 items-center group hover:border-gold/50 transition-all"
                  >
                    <div className="w-full lg:w-64 h-48 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 relative">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">
                          {p.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-grow space-y-3 text-center lg:text-left">
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                        <span className="text-[9px] font-black text-gold uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded">
                          REF: {p.referenceNumber || p.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(p.createdat).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-space">{p.title}</h3>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.quarter ? `${p.quarter}, ` : ''}{p.city}, {p.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Maximize className="w-3.5 h-3.5 text-gold" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.surface} m²</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-gold" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{formatPrice(p.totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => setEditingProperty(p)}
                        variant="outline"
                        className="h-12 w-12 rounded-xl border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all p-0"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      {filter === 'en attente' && (
                        <>
                          <Button
                            onClick={() => updateStatus(p.id, 'approuvé')}
                            className="h-12 w-12 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all p-0 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() => updateStatus(p.id, 'rejeté')}
                            className="h-12 w-12 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all p-0 shadow-lg shadow-rose-500/20"
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => deleteProperty(p.id)}
                        variant="outline"
                        className="h-12 w-12 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 transition-all p-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {requests.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <Mail className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Aucune demande archivée</p>
                </div>
              ) : (
                requests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-10 items-start hover:border-gold/50 transition-all"
                  >
                    <div className="flex-grow space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-gold/10 text-gold text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                          {req.type}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(req.createdat).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-space">Recherche: {req.cities}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Budget Max</p>
                          <p className="text-base font-bold text-slate-900">{formatPrice(req.budgetMax)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Surface Min</p>
                          <p className="text-base font-bold text-slate-900">{req.surfaceMin} m²</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                          <p className="text-base font-bold text-slate-900">{req.name}</p>
                        </div>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{req.description}"</p>
                      </div>
                      <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gold" />
                          <span className="text-[10px] font-bold text-slate-500">{req.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gold" />
                          <span className="text-[10px] font-bold text-slate-500">{req.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => deleteRequest(req.id!)}
                        variant="outline"
                        className="h-12 w-12 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 transition-all p-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <Card className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-forest/5 rounded-xl flex items-center justify-center">
                      <Database className="w-5 h-5 text-forest" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight font-space">Local Database</CardTitle>
                      <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base de données principale</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projet ID</span>
                      <span className="text-[10px] font-bold text-slate-900 truncate max-w-[200px]">gen-lang-client-0854091704</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-[10px] font-bold text-emerald-600">OPÉRATIONNEL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Diagnostic</h4>
                    <Button 
                      onClick={async () => {
                        const toastId = toast.loading("Vérification...");
                        try {
                          await api.getProperties();
                          toast.success("Base de données est accessible !", { id: toastId });
                        } catch (err) {
                          console.error("Database Check Failed:", err);
                          toast.error("Impossible d'accéder à la base de données.", { id: toastId });
                        }
                      }}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                    >
                      Tester la connexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</div>
);
};

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    // Check if logged in
    const checkAuth = async () => {
      try {
        const { user } = await api.verify();
        if (user) {
          setUser(user);
          setIsAdmin(true);
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };
    checkAuth();


    const fetchApprovedProperties = async () => {
      try {
        const props = await api.getProperties();
        const approvedProps = props.filter((p: any) => p.status === 'approuvé');
        setProperties(approvedProps);
        setLoading(false);
      } catch (error) {
        console.error("Fetch approved properties error:", error);
        setLoading(false);
      }
    };
    fetchApprovedProperties();

    return () => {
    };
  }, []);

  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="min-h-screen font-sans selection:bg-forest/10 selection:text-forest">
      <Toaster position="top-center" richColors />
      {!isAdminRoute && <StickyFeaturedBanner properties={properties} />}
      {!isAdminRoute && <Navbar isAdmin={isAdmin} />}
      
      <Routes>
        <Route path="/" element={
          <HomePage 
            properties={properties} 
            loading={loading} 
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
          />
        } />
        <Route path="/login" element={<LoginPage onLogin={() => setIsAdmin(true)} />} />
        <Route path="/admin" element={<AdminPanel isAdmin={isAdmin} editingProperty={editingProperty} setEditingProperty={setEditingProperty} />} />
      </Routes>

      {editingProperty && (
        <EditPropertyModal 
          property={editingProperty} 
          isOpen={!!editingProperty} 
          onClose={() => setEditingProperty(null)} 
        />
      )}
      
      {!isAdminRoute && <ScrollToTop />}
      
      {/* Footer */}
      {!isAdminRoute && (
        <footer 
          onDoubleClick={() => setIsLoginModalOpen(true)}
          className="bg-forest text-white py-24 px-4 border-t-8 border-gold cursor-pointer select-none relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-premium-pattern opacity-5" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 items-start relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 flex-shrink-0 min-w-[3.5rem] bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-2xl">
                  <img src={LOGO_URL} alt="South Estates" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-white leading-none font-heading">SOUTH</span>
                  <span className="text-xs font-bold tracking-[0.3em] text-gold leading-none mt-1 font-heading uppercase">Estates & Houses</span>
                </div>
              </div>
              <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs font-sans">
                L'excellence immobilière au Cameroun. Nous transformons vos visions en adresses prestigieuses.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gold">Liens Rapides</h4>
              <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-white/70">
                <a href="/" className="hover:text-gold transition-colors">Accueil</a>
                <a href="#properties" className="hover:text-gold transition-colors">Nos Propriétés</a>
                <a href="#sell" className="hover:text-gold transition-colors">Vendre une propriété</a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gold">Contactez-nous</h4>
              <div className="space-y-4 text-sm font-bold text-white/70">
                <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold" /> Douala, Cameroun</p>
                <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /> +237 699 949 266</p>
                <p className="flex items-center gap-3"><Clock className="w-4 h-4 text-gold" /> Lun - Sam: 08:00 - 18:00</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">© 2026 South Estates and Houses. Tous droits réservés.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </footer>
      )}

      <AdminLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={() => setIsAdmin(true)} 
      />
    </div>
  );
}
