import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Store, Tag, Phone, Clock, Truck, CheckCircle,
  Menu, X, Navigation, Filter, Plus, ShieldCheck,
  ArrowLeft, Package,
  Check, XCircle, Eye, RefreshCw, Camera, LogIn, LogOut, UserCheck, Compass, Trash2
} from 'lucide-react';

// ============================================================================
// 0. CONEXIÓN A SUPABASE (CREDENCIALES PÚBLICAS DEL PROYECTO)
// ============================================================================

const SUPABASE_URL = 'https://zogdgendyrqktymlwhzf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w601K0oEr5Eg-V8Jg2XAnQ_g_lAUCdn';

async function supabaseFetch(endpoint, options = {}, accessToken = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `Error HTTP ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function supabaseAuthRequest(path, body) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || data.msg || data.message || 'Error de autenticación');
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function subirImagenSupabase(file, accessToken = null) {
  const ext = file.name?.split('.').pop() || 'jpg';
  const fileName = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/imagenes-mercado/${fileName}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true'
      },
      body: file,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error('No se pudo subir al bucket imagenes-mercado');
    }
    return `${SUPABASE_URL}/storage/v1/object/public/imagenes-mercado/${fileName}`;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ============================================================================
// 1. DATOS DE DEMOSTRACIÓN (SAN NICOLÁS DE LOS ARROYOS)
// ============================================================================

const CATEGORIAS = [
  { id: 'indumentaria', nombre: 'Indumentaria y Calzado', icon: '👕', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'hogar', nombre: 'Hogar, Bazar y Deco', icon: '🏡', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'ferreteria', nombre: 'Ferretería y Construcción', icon: '🔧', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  { id: 'alimentos', nombre: 'Almacén, Panadería y Frescos', icon: '🥐', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'electronica', nombre: 'Tecnología y Celulares', icon: '📱', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  { id: 'servicios', nombre: 'Servicios y Oficios Locales', icon: '🛠️', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'mascotas', nombre: 'Mascotas y Veterinaria', icon: '🐾', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  { id: 'salud', nombre: 'Salud, Óptica y Estética', icon: '✨', color: 'bg-teal-50 text-teal-800 border-teal-200' }
];

const ZONAS_REFERENCIA = [
  { nombre: 'Centro / Plaza Mitre', lat: -33.3335, lng: -60.2110 },
  { nombre: 'Costanera / Parque Aguiar', lat: -33.3260, lng: -60.2035 },
  { nombre: 'Barrio Somisa', lat: -33.3740, lng: -60.1840 },
  { nombre: 'Zona Oeste / Av. Savio', lat: -33.3410, lng: -60.2360 },
  { nombre: 'Zona Norte / La Emilia', lat: -33.2980, lng: -60.2420 }
];

const COMERCIOS_INICIALES = [
  {
    id: 'com-1',
    nombre: 'Ferretería del Acuerdo',
    responsable: 'Carlos Mansilla',
    rubro: 'ferreteria',
    tipo: 'Ambos',
    direccion: 'Av. Moreno 245',
    zona: 'Centro',
    lat: -33.3348,
    lng: -60.2135,
    whatsapp: '5493364510001',
    instagram: '@ferreteriadelacuerdo.sn',
    descripcion: 'Todo para la obra, plomería, electricidad y herramientas de mano con atención de oficio en el centro nicoleno.',
    horarios: 'Lun a Sáb 8:00 a 12:30 y 16:00 a 20:00',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: true,
    estado: 'aprobado',
    rangoPrecio: '$$',
    emoji: '🔧',
    esReal: false
  },
  {
    id: 'com-2',
    nombre: 'Rincón Nicoleño Panadería & Café',
    responsable: 'Lucía Fernández',
    rubro: 'alimentos',
    tipo: 'Productos',
    direccion: 'Mitre 118',
    zona: 'Centro / Plaza Mitre',
    lat: -33.3329,
    lng: -60.2102,
    whatsapp: '5493364510002',
    instagram: '@rinconnicoleno.sn',
    descripcion: 'Facturas recién horneadas, pan de masa madre, tortas artesanales y café de especialidad a metros de Plaza Mitre.',
    horarios: 'Todos los días 7:00 a 20:30',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: true,
    estado: 'aprobado',
    rangoPrecio: '$$',
    emoji: '🥐',
    esReal: false
  },
  {
    id: 'com-3',
    nombre: 'Moda Paraná',
    responsable: 'Valeria Gómez',
    rubro: 'indumentaria',
    tipo: 'Productos',
    direccion: 'Urquiza 89',
    zona: 'Centro',
    lat: -33.3318,
    lng: -60.2090,
    whatsapp: '5493364510003',
    instagram: '@modaparana.sn',
    descripcion: 'Indumentaria urbana, camisas de lino, tejidos de estación y accesorios seleccionados para cada temporada.',
    horarios: 'Lun a Sáb 9:00 a 13:00 y 17:00 a 20:30',
    abiertoAhora: true,
    envioDomicilio: false,
    destacado: true,
    estado: 'aprobado',
    rangoPrecio: '$$',
    emoji: '👕',
    esReal: false
  },
  {
    id: 'com-4',
    nombre: 'TecnoSur San Nicolás',
    responsable: 'Martín Pereyra',
    rubro: 'electronica',
    tipo: 'Ambos',
    direccion: 'Av. Álvaro Barros 412',
    zona: 'Barrio Somisa',
    lat: -33.3732,
    lng: -60.1855,
    whatsapp: '5493364510004',
    instagram: '@tecnosur.sn',
    descripcion: 'Servicio técnico multimarca de celulares y notebooks, cambio de módulos en el día, cargadores originales y audio.',
    horarios: 'Lun a Vie 9:00 a 18:00 • Sáb 9:00 a 13:00',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: false,
    estado: 'aprobado',
    rangoPrecio: '$$$',
    emoji: '📱',
    esReal: false
  },
  {
    id: 'com-5',
    nombre: 'Deco & Hogar Costanera',
    responsable: 'Sofía Benítez',
    rubro: 'hogar',
    tipo: 'Productos',
    direccion: 'Garibaldi 310',
    zona: 'Costanera',
    lat: -33.3274,
    lng: -60.2052,
    whatsapp: '5493364510005',
    instagram: '@decohogarcostanera',
    descripcion: 'Textiles para el hogar, mates de algarrobo y acero, vajilla artesanal y objetos cálidos para renovar tus ambientes.',
    horarios: 'Lun a Sáb 9:30 a 13:00 y 16:30 a 20:00',
    abiertoAhora: false,
    envioDomicilio: true,
    destacado: true,
    estado: 'aprobado',
    rangoPrecio: '$$',
    emoji: '🏡',
    esReal: false
  },
  {
    id: 'com-6',
    nombre: 'Servicios Técnicos del Arroyo',
    responsable: 'Diego Quiroga',
    rubro: 'servicios',
    tipo: 'Servicios',
    direccion: 'Av. Savio 680',
    zona: 'Zona Oeste',
    lat: -33.3405,
    lng: -60.2330,
    whatsapp: '5493364510006',
    instagram: '@serviciostecnicos.sn',
    descripcion: 'Instalación y carga de gas de aires acondicionados, reparación de lavarropas y urgencias eléctricas domiciliarias.',
    horarios: 'Lun a Sáb 8:00 a 19:00',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: false,
    estado: 'aprobado',
    rangoPrecio: '$$',
    emoji: '🛠️',
    esReal: false
  },
  {
    id: 'com-7',
    nombre: 'Huellas & Patitas',
    responsable: 'Carolina Ruiz',
    rubro: 'mascotas',
    tipo: 'Ambos',
    direccion: 'Nation 164',
    zona: 'Centro',
    lat: -33.3359,
    lng: -60.2121,
    whatsapp: '5493364510007',
    instagram: '@huellasypatitas.sn',
    descripcion: 'Alimento balanceado por bolsa y suelto, pipetas, juguetes resistentes, camas y baño con turno previo.',
    horarios: 'Lun a Vie 9:00 a 19:30 • Sáb 9:00 a 13:30',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: false,
    estado: 'aprobado',
    rangoPrecio: '$',
    emoji: '🐾',
    esReal: false
  },
  {
    id: 'com-8',
    nombre: 'Óptica del Río',
    responsable: 'Esteban Alarcón',
    rubro: 'salud',
    tipo: 'Ambos',
    direccion: 'Belgrano 152',
    zona: 'Centro',
    lat: -33.3340,
    lng: -60.2085,
    whatsapp: '5493364510008',
    instagram: '@opticadelrio.sn',
    descripcion: 'Anteojos recetados con laboratorio propio, lentes de sol con filtro UV400 certificado y control visual.',
    horarios: 'Lun a Vie 9:00 a 12:30 y 16:30 a 20:00',
    abiertoAhora: true,
    envioDomicilio: false,
    destacado: false,
    estado: 'aprobado',
    rangoPrecio: '$$$',
    emoji: '✨',
    esReal: false
  },
  {
    id: 'com-9',
    nombre: 'Verde y Tierra Vivero Urbano',
    responsable: 'Mariana Sosa',
    rubro: 'hogar',
    tipo: 'Productos',
    direccion: 'Av. Falcón 520',
    zona: 'Zona Norte',
    lat: -33.3195,
    lng: -60.2190,
    whatsapp: '5493364510009',
    instagram: '@verdeytierra.sn',
    descripcion: 'Plantas de interior y exterior, aromáticas, tierra fértil, macetas de barro y asesoramiento para balcones y patios.',
    horarios: 'Mar a Dom 9:00 a 18:30',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: false,
    estado: 'aprobado',
    rangoPrecio: '$',
    emoji: '🌿',
    esReal: false
  },
  {
    id: 'com-10',
    nombre: 'Sabores de la Ribera',
    responsable: 'Hernán Duarte',
    rubro: 'alimentos',
    tipo: 'Productos',
    direccion: 'Paseo Costanero 95',
    zona: 'Costanera',
    lat: -33.3252,
    lng: -60.2022,
    whatsapp: '5493364510010',
    instagram: '@saboresdelaribera.sn',
    descripcion: 'Empanadas de río, pastas caseras frescas, conservas regionales y viandas listas para llevar a la costanera.',
    horarios: 'Mié a Dom 10:00 a 22:00',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: false,
    estado: 'aprobado',
    rangoPrecio: '$$',
    emoji: '🥟',
    esReal: false
  },
  {
    id: 'com-11',
    nombre: 'Bicicletería El Puente',
    responsable: 'Raúl Montenegro',
    rubro: 'servicios',
    tipo: 'Ambos',
    direccion: 'Av. Savio 1240',
    zona: 'Barrio Somisa',
    lat: -33.3680,
    lng: -60.1940,
    whatsapp: '5493364510011',
    instagram: '@bicicletariaelpuente.sn',
    descripcion: 'Service completo, centrado de ruedas, cámaras, cubiertas y accesorios para paseos por el parque y la ciudad.',
    horarios: 'Lun a Vie 8:30 a 18:00 • Sáb 9:00 a 13:00',
    abiertoAhora: false,
    envioDomicilio: false,
    destacado: false,
    estado: 'pendiente',
    rangoPrecio: '$',
    emoji: '🚲',
    esReal: false
  }
];

const PRODUCTOS_INICIALES = [
  {
    id: 'prod-1',
    comercioId: 'com-1',
    nombre: 'Taladro Percutor 650W con Maletín',
    categoria: 'ferreteria',
    precio: 84500,
    precioAnterior: 98000,
    esOferta: true,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Ideal para mampostería, madera y metal. Incluye juego de mechas y empuñadura lateral.',
    imagenUrl: null,
    emoji: '🔩',
    esReal: false
  },
  {
    id: 'prod-2',
    comercioId: 'com-2',
    nombre: 'Docena de Facturas Artesanales Surtidas',
    categoria: 'alimentos',
    precio: 9600,
    precioAnterior: 11500,
    esOferta: true,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Medialunas de manteca, vigilantes, tortitas negras y pastelera con dulce de membrillo.',
    imagenUrl: null,
    emoji: '🥐',
    esReal: false
  },
  {
    id: 'prod-3',
    comercioId: 'com-3',
    nombre: 'Camisa Urbana de Algodón Peinado',
    categoria: 'indumentaria',
    precio: 36900,
    precioAnterior: null,
    esOferta: false,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Corte clásico cómodo, disponible en tonos arena, celeste suave y negro. Talles S al XXL.',
    imagenUrl: null,
    emoji: '👔',
    esReal: false
  },
  {
    id: 'prod-4',
    comercioId: 'com-4',
    nombre: 'Service y Limpieza Profunda de Notebook',
    categoria: 'electronica',
    precio: 24000,
    precioAnterior: 30000,
    esOferta: true,
    disponible: true,
    tipo: 'Servicio',
    descripcion: 'Cambio de pasta térmica, limpieza de coolers y optimización del sistema en 24 horas.',
    imagenUrl: null,
    emoji: '💻',
    esReal: false
  },
  {
    id: 'prod-5',
    comercioId: 'com-5',
    nombre: 'Mate Imperial de Calabaza y Alpaca',
    categoria: 'hogar',
    precio: 28500,
    precioAnterior: null,
    esOferta: false,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Virola cincelada a mano y base reforzada. Listo para curar y disfrutar.',
    imagenUrl: null,
    emoji: '🧉',
    esReal: false
  },
  {
    id: 'prod-6',
    comercioId: 'com-6',
    nombre: 'Instalación Completa de Aire Acondicionado',
    categoria: 'servicios',
    precio: 75000,
    precioAnterior: null,
    esOferta: false,
    disponible: true,
    tipo: 'Servicio',
    descripcion: 'Incluye mensura reforzada, prueba de hermeticidad y puesta en marcha garantizada.',
    imagenUrl: null,
    emoji: '❄️',
    esReal: false
  },
  {
    id: 'prod-7',
    comercioId: 'com-7',
    nombre: 'Alimento Balanceado Premium 15 kg',
    categoria: 'mascotas',
    precio: 42000,
    precioAnterior: 48500,
    esOferta: true,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Fórmula equilibrada para perros adultos de todos los tamaños. Envío sin cargo en zona centro.',
    imagenUrl: null,
    emoji: '🐕',
    esReal: false
  },
  {
    id: 'prod-8',
    comercioId: 'com-8',
    nombre: 'Anteojos de Sol Polarizados UV400',
    categoria: 'salud',
    precio: 39000,
    precioAnterior: null,
    esOferta: false,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Armazón liviano con lentes polarizadas que reducen el reflejo del sol en calle y río.',
    imagenUrl: null,
    emoji: '🕶️',
    esReal: false
  },
  {
    id: 'prod-9',
    comercioId: 'com-9',
    nombre: 'Combo 3 Plantas Aromáticas + Macetas',
    categoria: 'hogar',
    precio: 16500,
    precioAnterior: 20000,
    esOferta: true,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Romero, albahaca y menta en macetas sopladas listas para sol directo.',
    imagenUrl: null,
    emoji: '🌱',
    esReal: false
  },
  {
    id: 'prod-10',
    comercioId: 'com-10',
    nombre: 'Docena de Empanadas Caseras al Horno',
    categoria: 'alimentos',
    precio: 15600,
    precioAnterior: null,
    esOferta: false,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Carne cortada a cuchillo, cebolla de verdeo, huevo y aceituna. Masa casera.',
    imagenUrl: null,
    emoji: '🥟',
    esReal: false
  }
];

// ============================================================================
// 2. FUNCIONES AUXILIARES DE GEOLOCALIZACIÓN, FORMATO Y WHATSAPP
// ============================================================================

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatearDistancia(km) {
  if (km < 1) {
    const metros = Math.round((km * 1000) / 10) * 10;
    return `a ${metros} m`;
  }
  return `a ${km.toFixed(1)} km`;
}

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);
}

function parsearPrecioPesos(entrada) {
  if (typeof entrada === 'number') return Number.isFinite(entrada) ? Math.round(entrada) : 0;
  const limpio = String(entrada || '').replace(/[^\d.,]/g, '').trim();
  if (!limpio) return 0;

  if (/^\d{1,3}([.,]\d{3})+$/.test(limpio)) {
    return Number(limpio.replace(/[.,]/g, '')) || 0;
  }

  const sinCentavos = limpio.split(',')[0].replace(/\./g, '');
  return Number(sinCentavos) || 0;
}

function crearLinkWhatsApp(telefono, texto) {
  const limpio = String(telefono || '').replace(/\D/g, '');
  return `https://wa.me/${limpio}?text=${encodeURIComponent(texto)}`;
}

// ============================================================================
// 3. SUB-VISTAS DE LA PLATAFORMA (EVITA RE-MONTAJES AL ESCRIBIR)
// ============================================================================

function VistaCercanos({
  comerciosPublicos,
  ubicacionUsuario,
  estadoGps,
  mensajeGps,
  solicitarUbicacionGPS,
  seleccionarZonaManual,
  verFichaComercio
}) {
  const [filtroAbiertoCercanos, setFiltroAbiertoCercanos] = useState(false);
  const [filtroEnvioCercanos, setFiltroEnvioCercanos] = useState(false);

  const comerciosConDistancia = comerciosPublicos
    .map((c) => ({
      ...c,
      distanciaKm: calcularDistanciaKm(ubicacionUsuario.lat, ubicacionUsuario.lng, c.lat, c.lng)
    }))
    .filter((c) => (!filtroAbiertoCercanos || c.abiertoAhora) && (!filtroEnvioCercanos || c.envioDomicilio))
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-orange-500" />
              <span>Comercios cerca de mí en San Nicolás</span>
            </h1>
            <p className="text-sm text-neutral-600 mt-0.5">{mensajeGps}</p>
          </div>

          <button
            type="button"
            onClick={solicitarUbicacionGPS}
            disabled={estadoGps === 'cargando'}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded text-sm inline-flex items-center gap-2 transition self-start lg:self-auto cursor-pointer disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 ${estadoGps === 'cargando' ? 'animate-spin' : ''}`} />
            <span>{estadoGps === 'cargando' ? 'Obteniendo GPS...' : 'Usar mi ubicación GPS'}</span>
          </button>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase mr-1">O elegí una zona de referencia:</s
