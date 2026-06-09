import { supabase } from './supabase';
import { sendAdminNotification } from './email';

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré. Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
};

// Helpers to map between local camelCase state and DB snake_case columns
const mapPropertyFromDB = (row: any) => ({
  ...row,
  priceIndicator: row.price_indicator || row.priceIndicator,
  isNego: row.is_nego !== undefined ? row.is_nego : row.isNego,
  ownerName: row.owner_name || row.ownerName,
  ownerPhone: row.owner_phone || row.ownerPhone,
  ownerEmail: row.owner_email || row.ownerEmail,
  createdAt: row.created_at || row.createdAt,
  updatedAt: row.updated_at || row.updatedAt,
  characteristics: typeof row.characteristics === 'string' ? JSON.parse(row.characteristics) : row.characteristics || [],
  images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
  featured: row.featured === true || row.featured === 1,
});

const mapPropertyToDB = (data: any) => ({
  id: data.id || Date.now().toString(),
  title: data.title,
  type: data.type,
  status: data.status,
  price: data.price,
  price_indicator: data.priceIndicator,
  surface: data.surface,
  bedrooms: data.bedrooms,
  bathrooms: data.bathrooms,
  region: data.region,
  city: data.city,
  quarter: data.quarter,
  description: data.description,
  characteristics: data.characteristics || [],
  images: data.images || [],
  featured: typeof data.featured !== 'undefined' ? data.featured : false,
  is_nego: typeof data.isNego !== 'undefined' ? data.isNego : false,
  owner_name: data.ownerName,
  owner_phone: data.ownerPhone,
  owner_email: data.ownerEmail,
  created_at: data.createdAt || new Date().toISOString(),
  updated_at: data.updatedAt || new Date().toISOString(),
});

const mapRequestFromDB = (row: any) => ({
  ...row,
  budgetMax: row.budget_max || row.budgetMax,
  clientName: row.client_name || row.clientName,
  clientPhone: row.client_phone || row.clientPhone,
  clientEmail: row.client_email || row.clientEmail,
  createdAt: row.created_at || row.createdAt,
  updatedAt: row.updated_at || row.updatedAt,
});

const mapRequestToDB = (data: any) => ({
  id: data.id || Date.now().toString(),
  type: data.type,
  budget_max: data.budgetMax,
  region: data.region,
  city: data.city,
  quarter: data.quarter,
  surface: data.surface,
  bedrooms: data.bedrooms,
  bathrooms: data.bathrooms,
  description: data.description,
  status: data.status || 'pending',
  client_name: data.clientName,
  client_phone: data.clientPhone,
  client_email: data.clientEmail,
  created_at: data.createdAt || new Date().toISOString(),
  updated_at: data.updatedAt || new Date().toISOString(),
});

export const api = {
  async getProperties() {
    const db = requireSupabase();
    // Sort by created_at, fallback to parsing them after if not present
    const { data, error } = await db.from('properties').select('*').order('created_at', { ascending: false });
    if (error) {
      // If error because table structure relies on createdAt instead of created_at:
      if (error.message.includes('created_at does not exist')) {
         const { data: fallbackData, error: fbError } = await db.from('properties').select('*');
         if (fbError) throw new Error(fbError.message);
         return (fallbackData || []).map(mapPropertyFromDB).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      throw new Error(error.message);
    }
    return (data || []).map(mapPropertyFromDB);
  },
  
  async createProperty(data: any) {
    const db = requireSupabase();
    const payload = mapPropertyToDB(data);
    
    const { error } = await db.from('properties').insert([payload]);
    if (error) {
       // if we hit camelCase vs snake_case errors
       if (error.message.includes('column') && error.message.includes('does not exist')) {
          console.warn('Snake case columns failed, attempting camelCase payload for backwards compatibility...');
          const { error: camelErr } = await db.from('properties').insert([{
             ...data,
             id: payload.id,
             createdAt: payload.created_at,
             updatedAt: payload.updated_at
          }]);
          if (camelErr) throw new Error(camelErr.message);
       } else {
         throw new Error(error.message);
       }
    }
    
    // Notify admin
    sendAdminNotification("Nouvelle offre de propriété publiée", {
      Titre: data.title,
      Prix: data.price,
      Type: data.type,
      "Nom du propriétaire": data.ownerName,
      "Téléphone": data.ownerPhone,
    }).catch(console.error);

    return { id: payload.id };
  },

  async updateProperty(id: string, data: any) {
    const db = requireSupabase();
    const payload = mapPropertyToDB({ ...data, id });
    delete (payload as any).id;
    
    const { error } = await db.from('properties').update(payload).eq('id', id);
    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        const fallbackPayload = { ...data };
        delete fallbackPayload.id;
        const { error: fbErr } = await db.from('properties').update(fallbackPayload).eq('id', id);
        if (fbErr) throw new Error(fbErr.message);
      } else {
        throw new Error(error.message);
      }
    }
    return { success: true };
  },

  async deleteProperty(id: string) {
    const db = requireSupabase();
    const { error } = await db.from('properties').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  async getRequests() {
    const db = requireSupabase();
    const { data, error } = await db.from('requests').select('*').order('created_at', { ascending: false });
    if (error) {
      if (error.message.includes('created_at does not exist')) {
         const { data: fallbackData, error: fbError } = await db.from('requests').select('*');
         if (fbError) throw new Error(fbError.message);
         return (fallbackData || []).map(mapRequestFromDB).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      throw new Error(error.message);
    }
    return (data || []).map(mapRequestFromDB);
  },

  async createRequest(data: any) {
    const db = requireSupabase();
    const payload = mapRequestToDB(data);
    const { error } = await db.from('requests').insert([payload]);
    if (error) {
       if (error.message.includes('column') && error.message.includes('does not exist')) {
          const { error: camelErr } = await db.from('requests').insert([{
             ...data,
             id: payload.id,
             createdAt: payload.created_at,
             updatedAt: payload.updated_at
          }]);
          if (camelErr) throw new Error(camelErr.message);
       } else {
         throw new Error(error.message);
       }
    }

    // Notify admin
    sendAdminNotification("Nouvelle demande de recherche", {
      Type: data.type,
      Budget_Max: data.budgetMax,
      Ville: data.city,
      "Nom du client": data.clientName,
      "Téléphone": data.clientPhone,
    }).catch(console.error);

    return { id: payload.id };
  },

  async login(name: string, password: string) {
    const adminUser = import.meta.env.VITE_ADMIN_USERNAME || "Felix Ernest";
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "Felix00";

    if (name.trim().toLowerCase() === adminUser.toLowerCase() && password === adminPass) {
       return { token: "client_mock_token_123", user: { name, role: 'admin' } };
    }
    throw new Error('Identifiants incorrects.');
  },

  async verify() {
    const token = localStorage.getItem('se_token');
    if (!token) throw new Error('No token');
    if (token === "client_mock_token_123") {
       return { user: { role: 'admin' } };
    }
    throw new Error('Verify failed');
  },
  
  async uploadImages(files: File[]) {
    const db = requireSupabase();
    if (!files || files.length === 0) return [];
    const urls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      const { data, error } = await db.storage
        .from('properties')
        .upload(filePath, file);

      if (error) {
         console.error('Upload Error:', error);
         throw new Error('Failed to upload images');
      }

      const { data: { publicUrl } } = db.storage.from('properties').getPublicUrl(filePath);
      urls.push(publicUrl);
    }
    return urls;
  }
};
