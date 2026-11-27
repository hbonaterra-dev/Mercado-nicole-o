import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Store, Tag, Phone, Clock, Truck, CheckCircle,
  Menu, X, Navigation, Filter, Plus, ShieldCheck,
  ArrowLeft, Package,
  Check, XCircle, Eye, RefreshCw, Camera, LogIn, LogOut, UserCheck, Compass
} from 'lucide-react';

// ============================================================================
// 0. CONEXIÓN A SUPABASE (CREDENCIALES PÚBLICAS DEL PROYECTO)
// ============================================================================

const SUPABASE_URL = 'https://zogdgendyrqktymlwhzf.supabase.co/rest/v1/;
const SUPABASE_ANON_KEY = 'sb_secret_db8HViN18VnV3e2yuRbS-A_CxYZFOTk';

async function supabaseFetch(endpoint, options = {}, accessToken = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

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
  const timeoutId = setTimeout(() => controller.abort(), 4000);
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
  const timeoutId = setTimeout(() => controller.abort(), 6000);

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
          <span className="text-xs font-bold text-neutral-500 uppercase mr-1">O elegí una zona de referencia:</span>
          {ZONAS_REFERENCIA.map((z) => {
            const activa = ubicacionUsuario.nombre === z.nombre;
            return (
              <button
                type="button"
                key={z.nombre}
                onClick={() => seleccionarZonaManual(z)}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer ${
                  activa
                    ? 'bg-orange-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {z.nombre}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setFiltroAbiertoCercanos(!filtroAbiertoCercanos)}
            className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
              filtroAbiertoCercanos
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            Abiertos ahora
          </button>
          <button
            type="button"
            onClick={() => setFiltroEnvioCercanos(!filtroEnvioCercanos)}
            className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
              filtroEnvioCercanos
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            Envío a domicilio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-md p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Mapa de proximidad • {ubicacionUsuario.nombre}
            </span>
            <span className="text-xs font-semibold text-orange-600">
              {comerciosConDistancia.length} locales
            </span>
          </div>

          <div className="relative w-full h-72 sm:h-80 rounded bg-amber-50/70 border border-amber-200/80 overflow-hidden">
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #d6d3d1 1px, transparent 1px), linear-gradient(to bottom, #d6d3d1 1px, transparent 1px)',
                backgroundSize: '36px 36px'
              }}
            />
            <div className="absolute top-3 left-3 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-600 border border-neutral-200">
              Río Paraná (Este)
            </div>
            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-0.5 rounded text-[10px] font-semibold text-neutral-600 border border-neutral-200">
              San Nicolás de los Arroyos
            </div>

            <div
              style={{ left: '50%', top: '50%' }}
              className="-translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
            >
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md ring-4 ring-blue-400/30" />
              <span className="mt-1 bg-blue-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                Tu ubicación
              </span>
            </div>

            {comerciosConDistancia.slice(0, 10).map((c) => {
              const dx = Math.max(-40, Math.min(40, (c.lng - ubicacionUsuario.lng) * 950));
              const dy = Math.max(-38, Math.min(38, -(c.lat - ubicacionUsuario.lat) * 950));
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => verFichaComercio(c.id)}
                  title={`${c.nombre} (${formatearDistancia(c.distanciaKm)})`}
                  style={{
                    left: `${50 + dx}%`,
                    top: `${50 + dy}%`
                  }}
                  className="-translate-x-1/2 -translate-y-1/2 z-10 bg-white hover:bg-orange-500 hover:text-white text-neutral-800 border border-orange-400 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-xs transition cursor-pointer"
                >
                  {c.emoji}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Tocá cualquier ícono de comercio en el mapa para abrir su ficha completa.
          </p>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {comerciosConDistancia.map((com, idx) => {
            const cat = CATEGORIAS.find((ct) => ct.id === com.rubro);
            return (
              <div
                key={com.id}
                onClick={() => verFichaComercio(com.id)}
                className="bg-white border border-neutral-200/90 hover:border-orange-400 rounded-md p-4 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl shrink-0">
                    {com.emoji}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-orange-600">#{idx + 1}</span>
                      <h2 className="font-bold text-neutral-900 text-base">{com.nombre}</h2>
                      <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                        {formatearDistancia(com.distanciaKm)}
                      </span>
                      {com.esReal && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          REAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {cat?.nombre} • {com.direccion} ({com.zona})
                    </p>
                    <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2">{com.descripcion}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          com.abiertoAhora ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {com.abiertoAhora ? 'Abierto ahora' : 'Cerrado'}
                      </span>
                      {com.envioDomicilio && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                          Envío a domicilio
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                  <span className="text-xs font-bold text-neutral-500">{com.rangoPrecio}</span>
                  <span className="text-xs font-semibold text-orange-600">Ver local →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VistaCatalogo({
  productos,
  comercios,
  categoriaFiltro,
  setCategoriaFiltro,
  soloOfertas,
  setSoloOfertas,
  soloAbiertos,
  soloEnvio,
  setSoloEnvio,
  busquedaGlobal,
  setBusquedaGlobal,
  verFichaComercio
}) {
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  const productosFiltrados = productos.filter((p) => {
    if (!p.disponible) return false;
    const com = comercios.find((c) => c.id === p.comercioId);
    if (!com || com.estado !== 'aprobado') return false;
    if (categoriaFiltro !== 'todas' && p.categoria !== categoriaFiltro) return false;
    if (soloOfertas && !p.esOferta) return false;
    if (tipoFiltro !== 'Todos' && p.tipo !== tipoFiltro) return false;
    if (soloAbiertos && !com.abiertoAhora) return false;
    if (soloEnvio && !com.envioDomicilio) return false;

    if (busquedaGlobal.trim()) {
      const q = busquedaGlobal.toLowerCase();
      const coincideProd =
        p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q);
      const coincideCom =
        com.nombre.toLowerCase().includes(q) || com.zona.toLowerCase().includes(q);
      if (!coincideProd && !coincideCom) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Catálogo de Productos y Servicios en San Nicolás
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Mostrando {productosFiltrados.length} publicaciones de comercios locales verificados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Todos', 'Producto', 'Servicio'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTipoFiltro(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
                  tipoFiltro === t
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {t === 'Todos' ? 'Todo' : `${t}s`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSoloOfertas(!soloOfertas)}
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
                soloOfertas
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              Solo ofertas
            </button>
            <button
              type="button"
              onClick={() => setSoloEnvio(!soloEnvio)}
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
                soloEnvio
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              Con envío
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setCategoriaFiltro('todas')}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer ${
              categoriaFiltro === 'todas'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Todos los rubros
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setCategoriaFiltro(cat.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer ${
                categoriaFiltro === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat.icon} {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-md p-10 text-center space-y-3">
          <Package className="w-10 h-10 text-neutral-400 mx-auto" />
          <h2 className="font-bold text-neutral-800 text-lg">No encontramos artículos con ese filtro</h2>
          <p className="text-sm text-neutral-500">
            Probá limpiando la búsqueda o seleccionando otro rubro de San Nicolás.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoriaFiltro('todas');
              setSoloOfertas(false);
              setSoloEnvio(false);
              setTipoFiltro('Todos');
              setBusquedaGlobal('');
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded text-sm cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((prod) => {
            const com = comercios.find((c) => c.id === prod.comercioId);
            return (
              <div
                key={prod.id}
                className="bg-white border border-neutral-200/80 rounded-md overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => com && verFichaComercio(com.id)}
                    className="h-44 bg-white border-b border-neutral-100 relative flex items-center justify-center text-6xl cursor-pointer overflow-hidden"
                  >
                    {prod.imagenUrl ? (
                      <img
                        src={prod.imagenUrl}
                        alt={prod.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span>{prod.emoji}</span>
                    )}
                    {prod.esOferta && (
                      <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Oferta del día
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-neutral-100/90 text-neutral-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {prod.tipo}
                    </span>
                  </div>

                  <div className="p-4">
                    {prod.precioAnterior && (
                      <p className="text-xs text-neutral-400 line-through">
                        {formatearPrecio(prod.precioAnterior)}
                      </p>
                    )}
                    <p className="text-xl font-bold text-neutral-900">{formatearPrecio(prod.precio)}</p>
                    <h3 className="font-semibold text-neutral-800 text-sm mt-1 line-clamp-2">
                      {prod.nombre}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{prod.descripcion}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => com && verFichaComercio(com.id)}
                    className="text-left min-w-0 cursor-pointer"
                  >
                    <p className="text-xs font-bold text-neutral-800 truncate hover:text-orange-600">
                      {com?.nombre}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">{com?.zona}</p>
                  </button>

                  {com && (
                    <a
                      href={crearLinkWhatsApp(
                        com.whatsapp,
                        `Hola ${com.nombre}, vi "${prod.nombre}" (${formatearPrecio(prod.precio)}) en Mercado Nicoleño. ¿Tenés disponibilidad?`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded shrink-0 transition"
                    >
                      Consultar
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VistaRegistroComercio({ setComercios, irAVista, mostrarNotificacion }) {
  const [nombre, setNombre] = useState('');
  const [responsable, setResponsable] = useState('');
  const [rubro, setRubro] = useState('alimentos');
  const [tipo, setTipo] = useState('Ambos');
  const [direccion, setDireccion] = useState('');
  const [zona, setZona] = useState('Centro / Plaza Mitre');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horarios, setHorarios] = useState('Lun a Sáb 9:00 a 13:00 y 17:00 a 20:30');
  const [envioDomicilio, setEnvioDomicilio] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);

    const zonaCoords = ZONAS_REFERENCIA.find((z) => z.nombre === zona) || ZONAS_REFERENCIA[0];
    const catObj = CATEGORIAS.find((c) => c.id === rubro);
    const jitterLat = (Math.random() - 0.5) * 0.008;
    const jitterLng = (Math.random() - 0.5) * 0.008;

    const nuevoComercioLocal = {
      id: `com-local-${Date.now()}`,
      nombre,
      responsable,
      rubro,
      tipo,
      direccion,
      zona,
      lat: zonaCoords.lat + jitterLat,
      lng: zonaCoords.lng + jitterLng,
      whatsapp: whatsapp || '5493364510099',
      instagram: instagram || '@comercio.nicoleno',
      descripcion,
      horarios,
      abiertoAhora: true,
      envioDomicilio,
      destacado: false,
      estado: 'pendiente',
      rangoPrecio: '$$',
      emoji: catObj?.icon || '🏪',
      esReal: false
    };

    try {
      const previos = JSON.parse(localStorage.getItem('mn_comercios_local') || '[]');
      localStorage.setItem('mn_comercios_local', JSON.stringify([nuevoComercioLocal, ...previos]));
    } catch (err) {}

    setComercios((prev) => [nuevoComercioLocal, ...prev]);

    supabaseFetch('comercios', {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        responsable,
        rubro,
        tipo,
        direccion,
        zona,
        lat: nuevoComercioLocal.lat,
        lng: nuevoComercioLocal.lng,
        whatsapp: nuevoComercioLocal.whatsapp,
        instagram: nuevoComercioLocal.instagram,
        descripcion,
        horarios,
        abierto_ahora: true,
        envio_domicilio: envioDomicilio,
        estado: 'pendiente',
        rango_precio: '$$'
      })
    }).catch(() => {});

    setGuardando(false);
    setEnviado(true);
    mostrarNotificacion(
      'Solicitud registrada',
      `"${nombre}" ya figura como Pendiente en el Panel Administrador.`
    );
  };

  if (enviado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white border border-emerald-200 rounded-md p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">¡Solicitud registrada con éxito!</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Tu comercio <strong>{nombre}</strong> quedó guardado en estado <strong>Pendiente</strong>.
            Desde el <strong>Panel Administrador</strong> podés aprobarlo para que aparezca público en San Nicolás.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => irAVista('panel_admin')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded text-sm cursor-pointer"
            >
              Ir a aprobarlo en Panel Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEnviado(false);
                setNombre('');
                setResponsable('');
                setDireccion('');
                setWhatsapp('');
                setDescripcion('');
              }}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-5 py-2.5 rounded text-sm cursor-pointer"
            >
              Registrar otro comercio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white border border-neutral-200 rounded-md p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded mb-2">
            100% GRATUITO PARA COMERCIOS DE SAN NICOLÁS
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">Sumá tu comercio a Mercado Nicoleño</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Completá los datos de tu local o emprendimiento. Luego podés aprobarlo desde el Panel Admin y cargar tus productos.
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Nombre del comercio *
              </label>
              <input
                required
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Panadería Don Luis"
                className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Nombre del responsable *
              </label>
              <input
                required
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Ej: Luis Pereyra"
                className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Rubro *</label>
              <select
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">¿Qué ofrecés?</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="Ambos">Productos y Servicios</option>
                <option value="Productos">Solo Productos</option>
                <option value="Servicios">Solo Servicios</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Zona en San Nicolás</label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white"
              >
                {ZONAS_REFERENCIA.map((z) => (
                  <option key={z.nombre} value={z.nombre}>
                    {z.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Dirección *</label>
              <input
                required
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Nación 230"
                className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">WhatsApp *</label>
              <input
                required
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: 3364551234"
                className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Instagram (opcional)</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@tucomercio.sn"
                className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Horarios de atención</label>
            <input
              type="text"
              value={horarios}
              onChange={(e) => setHorarios(e.target.value)}
              className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Descripción de tu comercio *
            </label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Contales a los vecinos de San Nicolás qué hacés, qué te distingue y cómo pueden encargarte."
              className="w-full border border-neutral-300 rounded px-3.5 py-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={envioDomicilio}
              onChange={(e) => setEnvioDomicilio(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Realizo envío a domicilio o entrega coordinada en San Nicolás</span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => irAVista('inicio')}
              className="px-4 py-2.5 rounded text-sm font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded text-sm transition cursor-pointer disabled:opacity-60"
            >
              {guardando ? 'Registrando...' : 'Enviar solicitud gratuita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VistaPanelComerciante({
  comercios,
  productos,
  setProductos,
  verFichaComercio,
  mostrarNotificacion,
  usuarioActual,
  onCerrarSesion
}) {
  const [miComercioId, setMiComercioId] = useState(comercios[0]?.id || 'com-1');
  const miComercio = comercios.find((c) => c.id === miComercioId) || comercios[0];
  const misProductos = productos.filter((p) => p.comercioId === miComercio?.id);

  const [nuevoProdNombre, setNuevoProdNombre] = useState('');
  const [nuevoProdPrecio, setNuevoProdPrecio] = useState('');
  const [nuevoProdDesc, setNuevoProdDesc] = useState('');
  const [nuevoProdOferta, setNuevoProdOferta] = useState(false);
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');
  const [subiendoProd, setSubiendoProd] = useState(false);

  const manejarSeleccionFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoFoto(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewFoto(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    const precioNum = parsearPrecioPesos(nuevoProdPrecio);
    if (!nuevoProdNombre || precioNum <= 0 || !miComercio) return;
    setSubiendoProd(true);

    let urlImagenFinal = previewFoto || null;
    if (archivoFoto) {
      try {
        urlImagenFinal = await subirImagenSupabase(archivoFoto, usuarioActual?.accessToken);
      } catch (err) {
        // Mantiene previsualización local si no hay red externa
      }
    }

    const precioAnt = nuevoProdOferta ? Math.round(precioNum * 1.15) : null;

    const nuevo = {
      id: `prod-${Date.now()}`,
      comercioId: miComercio.id,
      nombre: nuevoProdNombre,
      categoria: miComercio.rubro,
      precio: precioNum,
      precioAnterior: precioAnt,
      esOferta: nuevoProdOferta,
      disponible: true,
      tipo: 'Producto',
      descripcion: nuevoProdDesc || 'Publicado desde el panel del comerciante.',
      imagenUrl: urlImagenFinal,
      emoji: miComercio.emoji,
      esReal: miComercio.esReal
    };

    try {
      const previos = JSON.parse(localStorage.getItem('mn_productos_local') || '[]');
      localStorage.setItem('mn_productos_local', JSON.stringify([nuevo, ...previos]));
    } catch (err) {}

    if (miComercio.esReal) {
      supabaseFetch(
        'productos',
        {
          method: 'POST',
          body: JSON.stringify({
            comercio_id: miComercio.id,
            nombre: nuevo.nombre,
            categoria: nuevo.categoria,
            precio: nuevo.precio,
            precio_anterior: nuevo.precioAnterior,
            es_oferta: nuevo.esOferta,
            disponible: true,
            tipo: 'Producto',
            descripcion: nuevo.descripcion,
            imagen_url: urlImagenFinal && urlImagenFinal.startsWith('http') ? urlImagenFinal : null
          })
        },
        usuarioActual?.accessToken
      ).catch(() => {});
    }

    setProductos((prev) => [nuevo, ...prev]);
    setNuevoProdNombre('');
    setNuevoProdPrecio('');
    setNuevoProdDesc('');
    setNuevoProdOferta(false);
    setArchivoFoto(null);
    setPreviewFoto('');
    setSubiendoProd(false);
    mostrarNotificacion('Artículo publicado', `"${nuevo.nombre}" ya aparece en tu catálogo público.`);
  };

  const alternarDisponibilidadProducto = (prod) => {
    const nuevoEstado = !prod.disponible;
    setProductos((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, disponible: nuevoEstado } : p))
    );
  };

  if (!miComercio) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="bg-orange-50 border border-orange-200 rounded-md p-3.5 text-xs text-orange-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            Sesión activa: <strong>{usuarioActual?.email || 'Modo Demostración'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={miComercioId}
            onChange={(e) => setMiComercioId(e.target.value)}
            className="bg-white border border-orange-300 rounded px-2.5 py-1.5 font-semibold text-neutral-800"
          >
            {comercios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.estado})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onCerrarSesion}
            className="bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 font-semibold px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-md border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Panel del Comerciante</h1>
          <p className="text-sm text-neutral-500">
            Gestionando: <strong>{miComercio.nombre}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => verFichaComercio(miComercio.id)}
          className="bg-orange-50 text-orange-700 hover:bg-orange-100 font-semibold px-4 py-2.5 rounded text-sm flex items-center gap-2 self-start cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Ver cómo me ven los clientes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-md p-5 shadow-2xs h-fit space-y-4">
          <h2 className="font-bold text-base text-neutral-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" />
            <span>Publicar producto o servicio</span>
          </h2>

          <form onSubmit={agregarProducto} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Foto del producto (opcional)
              </label>
              <label className="border-2 border-dashed border-neutral-300 hover:border-orange-400 rounded-md p-3 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-50 transition">
                {previewFoto ? (
                  <div className="relative w-full h-36">
                    <img
                      src={previewFoto}
                      alt="Vista previa"
                      className="w-full h-full object-cover rounded"
                    />
                    <span className="absolute bottom-1.5 right-1.5 bg-neutral-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                      Cambiar foto
                    </span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-orange-500 mb-1" />
                    <span className="text-xs font-semibold text-neutral-700">
                      Sacar foto o elegir de galería
                    </span>
                    <span className="text-[11px] text-neutral-400">JPG, PNG o WebP</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarSeleccionFoto}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Nombre del artículo *
              </label>
              <input
                required
                type="text"
                value={nuevoProdNombre}
                onChange={(e) => setNuevoProdNombre(e.target.value)}
                placeholder="Ej: Juego de llaves combinadas"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Precio en pesos ($) *
              </label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={nuevoProdPrecio}
                onChange={(e) => setNuevoProdPrecio(e.target.value)}
                placeholder="Ej: 25000 o 25.000"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Descripción breve
              </label>
              <input
                type="text"
                value={nuevoProdDesc}
                onChange={(e) => setNuevoProdDesc(e.target.value)}
                placeholder="Ej: Medidas del 8 al 19, acero cromo vanadio"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={nuevoProdOferta}
                onChange={(e) => setNuevoProdOferta(e.target.checked)}
                className="rounded text-orange-500"
              />
              <span>Destacar como Oferta / Promoción</span>
            </label>

            <button
              type="submit"
              disabled={subiendoProd}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded text-sm transition cursor-pointer disabled:opacity-60"
            >
              {subiendoProd ? 'Subiendo foto y publicando...' : 'Publicar ahora'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-md p-5 shadow-2xs space-y-4">
          <h2 className="font-bold text-base text-neutral-900">
            Mis publicaciones ({misProductos.length})
          </h2>

          <div className="divide-y divide-neutral-100">
            {misProductos.length === 0 ? (
              <p className="text-sm text-neutral-500 py-4">
                Aún no publicaste artículos en este comercio.
              </p>
            ) : (
              misProductos.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.imagenUrl ? (
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        className="w-12 h-12 rounded object-cover border border-neutral-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-neutral-100 flex items-center justify-center text-xl shrink-0">
                        {p.emoji}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-800 text-sm truncate">{p.nombre}</p>
                      <p className="text-xs font-bold text-neutral-900">{formatearPrecio(p.precio)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alternarDisponibilidadProducto(p)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded shrink-0 cursor-pointer ${
                      p.disponible
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {p.disponible ? 'Activo' : 'Pausado'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VistaAcceso({ destino, onLoginExitoso, onCancelar }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const esAdmin = destino === 'panel_admin';

  const manejarAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setCargando(true);

    try {
      const endpoint = modo === 'login' ? 'token?grant_type=password' : 'signup';
      const data = await supabaseAuthRequest(endpoint, { email, password });
      const token = data.access_token || data.session?.access_token;
      const userEmail = data.user?.email || email;

      onLoginExitoso({
        email: userEmail,
        rol: esAdmin ? 'admin' : 'comerciante',
        accessToken: token || null,
        esDemo: false
      });
    } catch (err) {
      const msg = String(err.message || '');
      if (msg.includes('Failed to fetch') || msg.includes('AbortError')) {
        onLoginExitoso({
          email:
            email ||
            (esAdmin ? 'admin@mercadonicoleno.com.ar' : 'comercio@mercadonicoleno.com.ar'),
          rol: esAdmin ? 'admin' : 'comerciante',
          accessToken: null,
          esDemo: true
        });
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setCargando(false);
    }
  };

  const entrarModoDemo = () => {
    onLoginExitoso({
      email: esAdmin ? 'admin@mercadonicoleno.com.ar' : 'comercio@mercadonicoleno.com.ar',
      rol: esAdmin ? 'admin' : 'comerciante',
      accessToken: null,
      esDemo: true
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white border border-neutral-200 rounded-md p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded mb-2">
            <LogIn className="w-3.5 h-3.5" />
            <span>{esAdmin ? 'Acceso Administrador' : 'Acceso Comerciantes'}</span>
          </span>
          <h1 className="text-2xl font-bold text-neutral-900">
            {modo === 'login' ? 'Iniciá sesión en tu cuenta' : 'Creá tu cuenta gratuita'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {esAdmin
              ? 'Ingresá con tu correo de administrador para moderar comercios.'
              : 'Gestioná tu tienda, subí fotos de productos y actualizá tus precios.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={manejarAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Correo electrónico
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              className="w-full border border-neutral-300 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Contraseña
            </label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-neutral-300 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded text-sm transition cursor-pointer disabled:opacity-60"
          >
            {cargando ? 'Verificando...' : modo === 'login' ? 'Ingresar ahora' : 'Crear cuenta y entrar'}
          </button>
        </form>

        {!esAdmin && (
          <div className="text-center text-xs text-neutral-600">
            {modo === 'login' ? (
              <>
                ¿Todavía no tenés usuario?{' '}
                <button
                  type="button"
                  onClick={() => setModo('signup')}
                  className="text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  Registrate gratis acá
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setModo('login')}
                  className="text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  Iniciá sesión
                </button>
              </>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-neutral-100 space-y-2">
          <button
            type="button"
            onClick={entrarModoDemo}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-2.5 rounded text-xs transition cursor-pointer"
          >
            Entrar directo en Modo Simulación (sin contraseña)
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="w-full text-neutral-500 hover:text-neutral-700 text-xs py-1 cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

function VistaPanelAdmin({
  comercios,
  setComercios,
  productos,
  verFichaComercio,
  mostrarNotificacion,
  cargarDatosDesdeSupabase,
  cargandoDb,
  usuarioActual,
  onCerrarSesion
}) {
  const pendientes = comercios.filter((c) => c.estado === 'pendiente');
  const aprobados = comercios.filter((c) => c.estado === 'aprobado');

  const cambiarEstadoComercio = async (comercio, nuevoEstado) => {
    setComercios((prev) =>
      prev.map((c) => (c.id === comercio.id ? { ...c, estado: nuevoEstado } : c))
    );

    try {
      const locales = JSON.parse(localStorage.getItem('mn_comercios_local') || '[]');
      const actualizados = locales.map((c) =>
        c.id === comercio.id ? { ...c, estado: nuevoEstado } : c
      );
      localStorage.setItem('mn_comercios_local', JSON.stringify(actualizados));
    } catch (err) {}

    if (comercio.esReal) {
      supabaseFetch(
        `comercios?id=eq.${comercio.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ estado: nuevoEstado })
        },
        usuarioActual?.accessToken
      ).catch(() => {});
    }

    mostrarNotificacion(
      nuevoEstado === 'aprobado' ? 'Comercio aprobado' : 'Comercio rechazado',
      `${comercio.nombre} ahora figura como ${nuevoEstado}.`
    );
  };

  const alternarDestacado = (comercio) => {
    const nuevoDest = !comercio.destacado;
    setComercios((prev) =>
      prev.map((c) => (c.id === comercio.id ? { ...c, destacado: nuevoDest } : c))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="bg-white p-5 rounded-md border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administración General • {usuarioActual?.email || 'Admin'}</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Moderación y Control de Plataforma</h1>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            type="button"
            onClick={cargarDatosDesdeSupabase}
            disabled={cargandoDb}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-3.5 py-2 rounded text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargandoDb ? 'animate-spin' : ''}`} />
            <span>Actualizar datos</span>
          </button>
          <button
            type="button"
            onClick={onCerrarSesion}
            className="bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 font-semibold px-3 py-2 rounded text-xs flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-neutral-200 rounded-md p-4">
          <p className="text-xs text-neutral-500 font-semibold">Pendientes</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{pendientes.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md p-4">
          <p className="text-xs text-neutral-500 font-semibold">Publicados</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{aprobados.length}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md p-4">
          <p className="text-xs text-neutral-500 font-semibold">Artículos</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{productos.length}</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
        <h2 className="font-bold text-base text-neutral-900">
          Solicitudes pendientes de revisión ({pendientes.length})
        </h2>

        {pendientes.length === 0 ? (
          <p className="text-sm text-neutral-500 py-3">No hay comercios pendientes de aprobación.</p>
        ) : (
          <div className="space-y-3">
            {pendientes.map((c) => (
              <div
                key={c.id}
                className="border border-orange-200 bg-orange-50/40 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.emoji}</span>
                    <h3 className="font-bold text-neutral-900">{c.nombre}</h3>
                    <span className="text-[11px] font-bold bg-orange-200 text-orange-900 px-2 py-0.5 rounded">
                      Pendiente
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Responsable: <strong>{c.responsable}</strong> • {c.direccion} ({c.zona}) • WhatsApp: {c.whatsapp}
                  </p>
                  <p className="text-xs text-neutral-700 mt-1">{c.descripcion}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => cambiarEstadoComercio(c, 'aprobado')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aprobar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cambiarEstadoComercio(c, 'rechazado')}
                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
        <h2 className="font-bold text-base text-neutral-900">
          Comercios publicados en San Nicolás ({aprobados.length})
        </h2>
        <div className="divide-y divide-neutral-100">
          {aprobados.map((c) => (
            <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
                  <span>{c.emoji}</span>
                  <span>{c.nombre}</span>
                  {c.destacado && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Destacado
                    </span>
                  )}
                </p>
                <p className="text-xs text-neutral-500">
                  {c.direccion} ({c.zona}) • {c.horarios}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alternarDestacado(c)}
                  className="text-xs font-semibold px-3 py-1.5 rounded border border-neutral-300 hover:bg-neutral-50 cursor-pointer"
                >
                  {c.destacado ? 'Quitar destacado' : 'Destacar'}
                </button>
                <button
                  type="button"
                  onClick={() => verFichaComercio(c.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer"
                >
                  Ver ficha
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. COMPONENTE PRINCIPAL DE MERCADO NICOLEÑO
// ============================================================================

export default function App() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [destinoPostLogin, setDestinoPostLogin] = useState('panel_comerciante');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const [comercios, setComercios] = useState(() => {
    try {
      const locales = JSON.parse(localStorage.getItem('mn_comercios_local') || '[]');
      return [...locales, ...COMERCIOS_INICIALES];
    } catch (e) {
      return COMERCIOS_INICIALES;
    }
  });

  const [productos, setProductos] = useState(() => {
    try {
      const locales = JSON.parse(localStorage.getItem('mn_productos_local') || '[]');
      return [...locales, ...PRODUCTOS_INICIALES];
    } catch (e) {
      return PRODUCTOS_INICIALES;
    }
  });

  const [estadoDb, setEstadoDb] = useState('preview');
  const [cargandoDb, setCargandoDb] = useState(false);

  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [soloAbiertos, setSoloAbiertos] = useState(false);
  const [soloEnvio, setSoloEnvio] = useState(false);
  const [comercioSeleccionadoId, setComercioSeleccionadoId] = useState('com-1');

  const [ubicacionUsuario, setUbicacionUsuario] = useState(ZONAS_REFERENCIA[0]);
  const [estadoGps, setEstadoGps] = useState('listo');
  const [mensajeGps, setMensajeGps] = useState(
    'Mostrando distancias desde Centro / Plaza Mitre (San Nicolás)'
  );

  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = (titulo, detalle) => {
    setNotificacion({ titulo, detalle });
    setTimeout(() => {
      setNotificacion(null);
    }, 4200);
  };

  useEffect(() => {
    try {
      const sesionGuardada = localStorage.getItem('mn_usuario_sesion');
      if (sesionGuardada) setUsuarioActual(JSON.parse(sesionGuardada));
    } catch (e) {}
  }, []);

  const iniciarSesion = (usuario) => {
    setUsuarioActual(usuario);
    try {
      localStorage.setItem('mn_usuario_sesion', JSON.stringify(usuario));
    } catch (e) {}
    mostrarNotificacion('Sesión iniciada', `Bienvenido/a ${usuario.email}`);
    irAVista(destinoPostLogin);
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    try {
      localStorage.removeItem('mn_usuario_sesion');
    } catch (e) {}
    mostrarNotificacion('Sesión cerrada', 'Saliste de tu cuenta correctamente.');
    irAVista('inicio');
  };

  const abrirPanelProtegido = (panelDestino) => {
    if (usuarioActual) {
      irAVista(panelDestino);
    } else {
      setDestinoPostLogin(panelDestino);
      irAVista('acceso');
    }
  };

  const cargarDatosDesdeSupabase = async () => {
    setCargandoDb(true);
    try {
      const [comerciosDb, productosDb] = await Promise.all([
        supabaseFetch('comercios?select=*&order=creado_en.desc'),
        supabaseFetch('productos?select=*&order=creado_en.desc')
      ]);

      setEstadoDb('conectado');

      const comerciosNormalizados = comerciosDb.map((c) => {
        const catObj = CATEGORIAS.find((cat) => cat.id === c.rubro);
        return {
          id: c.id,
          nombre: c.nombre,
          responsable: c.responsable,
          rubro: c.rubro,
          tipo: c.tipo || 'Ambos',
          direccion: c.direccion,
          zona: c.zona,
          lat: Number(c.lat) || -33.3335,
          lng: Number(c.lng) || -60.211,
          whatsapp: c.whatsapp,
          instagram: c.instagram || '',
          descripcion: c.descripcion,
          horarios: c.horarios || 'Lun a Sáb 9:00 a 13:00 y 17:00 a 20:30',
          abiertoAhora: c.abierto_ahora ?? true,
          envioDomicilio: c.envio_domicilio ?? false,
          destacado: c.destacado ?? false,
          estado: c.estado || 'pendiente',
          rangoPrecio: c.rango_precio || '$$',
          emoji: catObj?.icon || '🏪',
          esReal: true
        };
      });

      const productosNormalizados = productosDb.map((p) => {
        const catObj = CATEGORIAS.find((cat) => cat.id === p.categoria);
        return {
          id: p.id,
          comercioId: p.comercio_id,
          nombre: p.nombre,
          categoria: p.categoria,
          precio: Number(p.precio),
          precioAnterior: p.precio_anterior ? Number(p.precio_anterior) : null,
          esOferta: p.es_oferta ?? false,
          disponible: p.disponible ?? true,
          tipo: p.tipo || 'Producto',
          descripcion: p.descripcion || '',
          imagenUrl: p.imagen_url || null,
          emoji: catObj?.icon || '📦',
          esReal: true
        };
      });

      setComercios([...comerciosNormalizados, ...COMERCIOS_INICIALES]);
      setProductos([...productosNormalizados, ...PRODUCTOS_INICIALES]);
    } catch (err) {
      setEstadoDb('preview');
    } finally {
      setCargandoDb(false);
    }
  };

  useEffect(() => {
    cargarDatosDesdeSupabase();
  }, []);

  const irAVista = (nuevaVista) => {
    setVistaActual(nuevaVista);
    setMenuMovilAbierto(false);
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {}
  };

  const verFichaComercio = (id) => {
    setComercioSeleccionadoId(id);
    irAVista('ficha');
  };

  const solicitarUbicacionGPS = () => {
    if (!navigator.geolocation) {
      setEstadoGps('error');
      setMensajeGps('Tu navegador no soporta GPS. Elegí una zona de referencia.');
      return;
    }
    setEstadoGps('cargando');
    setMensajeGps('Buscando tu ubicación en San Nicolás de los Arroyos...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacionUsuario({
          nombre: 'Mi ubicación actual (GPS)',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setEstadoGps('activo');
        setMensajeGps('Ubicación GPS activa • Ordenado por cercanía real');
        mostrarNotificacion('GPS activado', 'Ordenamos los comercios según tu ubicación actual.');
      },
      () => {
        setEstadoGps('error');
        setMensajeGps('No se pudo leer el GPS. Usando zona de referencia en San Nicolás.');
      },
      { timeout: 6000 }
    );
  };

  const seleccionarZonaManual = (zonaObj) => {
    setUbicacionUsuario(zonaObj);
    setEstadoGps('manual');
    setMensajeGps(`Mostrando distancias desde ${zonaObj.nombre} (San Nicolás)`);
  };

  const comerciosPublicos = comercios.filter((c) => c.estado === 'aprobado');

  const productosDestacados = productos
    .filter((p) => {
      if (!p.disponible) return false;
      const com = comerciosPublicos.find((c) => c.id === p.comercioId);
      if (!com) return false;
      if (categoriaFiltro !== 'todas' && p.categoria !== categoriaFiltro) return false;
      if (soloOfertas && !p.esOferta) return false;
      if (soloAbiertos && !com.abiertoAhora) return false;
      if (soloEnvio && !com.envioDomicilio) return false;
      if (busquedaGlobal.trim()) {
        const q = busquedaGlobal.toLowerCase();
        return (
          p.nombre.toLowerCase().includes(q) ||
          com.nombre.toLowerCase().includes(q) ||
          com.zona.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .slice(0, 8);

  const renderInicio = () => (
    <div className="space-y-8 pb-12">
      <section className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded text-xs font-semibold tracking-wide">
                <MapPin className="w-3.5 h-3.5" />
                <span>SAN NICOLÁS DE LOS ARROYOS • COMERCIO LOCAL</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                Todo lo que necesitás en San Nicolás, cerca tuyo y a un mensaje de distancia.
              </h1>

              <p className="text-orange-50 text-sm sm:text-base max-w-2xl leading-relaxed">
                Descubrí comercios de barrio, productos frescos, ofertas diarias y servicios de confianza.
                Consultá directo por WhatsApp sin comisiones ni intermediarios.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => irAVista('cercanos')}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-4 py-2.5 rounded text-sm inline-flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Ver comercios cerca de mí</span>
                </button>

                <button
                  type="button"
                  onClick={() => irAVista('registro')}
                  className="bg-orange-950/35 hover:bg-orange-950/50 text-white border border-white/30 font-semibold px-4 py-2.5 rounded text-sm inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Registrar mi comercio gratis</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white text-neutral-800 rounded-md p-4 shadow-md border border-orange-200/60 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                    Pulso Nicoleño Hoy
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-neutral-50 p-2.5 rounded border border-neutral-100">
                    <p className="text-xl font-bold text-neutral-900">{comerciosPublicos.length}</p>
                    <p className="text-[11px] text-neutral-500">Comercios activos</p>
                  </div>
                  <div className="bg-neutral-50 p-2.5 rounded border border-neutral-100">
                    <p className="text-xl font-bold text-orange-600">
                      {productos.filter((p) => p.esOferta && p.disponible).length}
                    </p>
                    <p className="text-[11px] text-neutral-500">Ofertas del día</p>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Centro, Costanera, Somisa, Zona Oeste y Zona Norte conectados en un solo lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-neutral-800">Explorar por rubro</h2>
          <button
            type="button"
            onClick={() => {
              setCategoriaFiltro('todas');
              irAVista('catalogo');
            }}
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            Ver todo el catálogo →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {CATEGORIAS.map((cat) => {
            const activa = categoriaFiltro === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  setCategoriaFiltro(activa ? 'todas' : cat.id);
                  irAVista('catalogo');
                }}
                className={`p-3 rounded-md border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                  activa
                    ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                    : 'bg-white hover:border-orange-300 text-neutral-700 border-neutral-200/90 shadow-2xs'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold leading-tight line-clamp-2">{cat.nombre}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-neutral-200/90 rounded-md p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filtros rápidos:
            </span>

            <button
              type="button"
              onClick={() => setSoloOfertas(!soloOfertas)}
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
                soloOfertas
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              Ofertas del día
            </button>

            <button
              type="button"
              onClick={() => setSoloAbiertos(!soloAbiertos)}
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
                soloAbiertos
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              Abiertos ahora
            </button>

            <button
              type="button"
              onClick={() => setSoloEnvio(!soloEnvio)}
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition cursor-pointer ${
                soloEnvio
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              Envío a domicilio
            </button>
          </div>

          {(soloOfertas || soloAbiertos || soloEnvio || categoriaFiltro !== 'todas' || busquedaGlobal) && (
            <button
              type="button"
              onClick={() => {
                setSoloOfertas(false);
                setSoloAbiertos(false);
                setSoloEnvio(false);
                setCategoriaFiltro('todas');
                setBusquedaGlobal('');
              }}
              className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
              {soloOfertas ? 'Ofertas destacadas en San Nicolás' : 'Productos y servicios destacados'}
            </h2>
            <p className="text-xs text-neutral-500">
              Precios de referencia publicados por comercios locales
            </p>
          </div>
          <button
            type="button"
            onClick={() => irAVista('catalogo')}
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            Ver todos →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {productosDestacados.map((prod) => {
            const com = comerciosPublicos.find((c) => c.id === prod.comercioId);
            const dist = com
              ? calcularDistanciaKm(ubicacionUsuario.lat, ubicacionUsuario.lng, com.lat, com.lng)
              : null;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-md shadow-xs hover:shadow-lg transition border border-neutral-200/70 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => com && verFichaComercio(com.id)}
                    className="h-44 bg-white border-b border-neutral-100 relative flex items-center justify-center text-6xl cursor-pointer overflow-hidden"
                  >
                    {prod.imagenUrl ? (
                      <img
                        src={prod.imagenUrl}
                        alt={prod.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="group-hover:scale-105 transition-transform">{prod.emoji}</span>
                    )}
                    <span className="absolute top-2.5 right-2.5 bg-neutral-100/90 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded">
                      LOCAL
                    </span>
                    {prod.esOferta && (
                      <span className="absolute bottom-2.5 left-2.5 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Oferta
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    {prod.precioAnterior && (
                      <p className="text-xs text-neutral-400 line-through">
                        {formatearPrecio(prod.precioAnterior)}
                      </p>
                    )}
                    <p className="text-xl font-bold text-neutral-900 tracking-tight">
                      {formatearPrecio(prod.precio)}
                    </p>

                    <h3 className="font-medium text-neutral-800 text-sm mt-1 line-clamp-2 leading-snug">
                      {prod.nombre}
                    </h3>

                    {com?.envioDomicilio && (
                      <p className="text-xs font-semibold text-emerald-700 mt-1.5">
                        Envío en San Nicolás
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-3.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <button
                    type="button"
                    onClick={() => com && verFichaComercio(com.id)}
                    className="font-semibold text-neutral-700 hover:text-orange-600 truncate max-w-[145px] cursor-pointer"
                  >
                    {com?.nombre}
                  </button>
                  {dist !== null && <span className="shrink-0">{formatearDistancia(dist)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-neutral-200/90 rounded-md p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                Comercios destacados en San Nicolás
              </h2>
              <p className="text-xs text-neutral-500">
                Locales verificados con atención directa y datos actualizados
              </p>
            </div>
            <button
              type="button"
              onClick={() => irAVista('cercanos')}
              className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 self-start sm:self-auto cursor-pointer"
            >
              Ver mapa y cercanía →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comerciosPublicos.slice(0, 6).map((com) => {
              const dist = calcularDistanciaKm(
                ubicacionUsuario.lat,
                ubicacionUsuario.lng,
                com.lat,
                com.lng
              );
              return (
                <div
                  key={com.id}
                  onClick={() => verFichaComercio(com.id)}
                  className="border border-neutral-200/80 hover:border-orange-400 rounded-md p-4 transition cursor-pointer bg-neutral-50/40 hover:bg-white flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{com.emoji}</span>
                        <div>
                          <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-tight">
                            {com.nombre}
                          </h3>
                          <p className="text-xs text-neutral-500">
                            {com.direccion} • {com.zona}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                        {formatearDistancia(dist)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {com.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                    <span
                      className={`font-semibold ${
                        com.abiertoAhora ? 'text-emerald-700' : 'text-neutral-400'
                      }`}
                    >
                      {com.abiertoAhora ? '● Abierto ahora' : '○ Cerrado'}
                    </span>
                    <span className="font-semibold text-orange-600">Ver tienda →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );

  const renderFichaComercio = () => {
    const com = comercios.find((c) => c.id === comercioSeleccionadoId) || comerciosPublicos[0];
    if (!com) return null;

    const productosComercio = productos.filter((p) => p.comercioId === com.id && p.disponible);
    const dist = calcularDistanciaKm(ubicacionUsuario.lat, ubicacionUsuario.lng, com.lat, com.lng);
    const catObj = CATEGORIAS.find((c) => c.id === com.rubro);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <button
          type="button"
          onClick={() => irAVista('inicio')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-orange-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a explorar</span>
        </button>

        <div className="bg-white border border-neutral-200 rounded-md p-5 sm:p-7 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center text-4xl shrink-0">
                {com.emoji}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded">
                    {catObj?.nombre || com.rubro}
                  </span>
                  <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded">
                    {formatearDistancia(dist)} de {ubicacionUsuario.nombre}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      com.abiertoAhora
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {com.abiertoAhora ? 'Abierto ahora' : 'Cerrado por ahora'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{com.nombre}</h1>
                <p className="text-sm text-neutral-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    {com.direccion} • {com.zona}, San Nicolás de los Arroyos
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <a
                href={crearLinkWhatsApp(
                  com.whatsapp,
                  `Hola ${com.nombre}, te escribo desde Mercado Nicoleño en San Nicolás.`
                )}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded text-sm text-center flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>

              {com.instagram && (
                <div className="text-xs text-center text-neutral-500 bg-neutral-50 border border-neutral-200 rounded py-1.5 px-3">
                  Instagram: <strong className="text-neutral-700">{com.instagram}</strong>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-neutral-700 leading-relaxed border-t border-neutral-100 pt-4">
            {com.descripcion}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="bg-neutral-50 border border-neutral-200/80 rounded p-3 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <p className="font-bold text-neutral-700">Horarios</p>
                <p className="text-neutral-600">{com.horarios}</p>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/80 rounded p-3 flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <p className="font-bold text-neutral-700">Entrega / Retiro</p>
                <p className="text-neutral-600">
                  {com.envioDomicilio ? 'Envío a domicilio y retiro en local' : 'Retiro en el local'}
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200/80 rounded p-3 flex items-center gap-2.5">
              <Tag className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <p className="font-bold text-neutral-700">Referencia de precios</p>
                <p className="text-neutral-600">
                  {com.rangoPrecio} • Atención directa sin comisiones
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900">
            Productos y servicios de {com.nombre} ({productosComercio.length})
          </h2>

          {productosComercio.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-md p-6 text-sm text-neutral-500">
              Este comercio aún no cargó artículos individuales, pero podés consultarle directo por WhatsApp.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productosComercio.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    {prod.imagenUrl && (
                      <img
                        src={prod.imagenUrl}
                        alt={prod.nombre}
                        className="w-full h-36 object-cover rounded mb-3 border border-neutral-100"
                      />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      {!prod.imagenUrl && <span className="text-3xl">{prod.emoji}</span>}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          {prod.tipo}
                        </span>
                        {prod.esOferta && (
                          <span className="text-[11px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            Oferta
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-sm">{prod.nombre}</h3>
                    <p className="text-xs text-neutral-500 mt-1">{prod.descripcion}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div>
                      {prod.precioAnterior && (
                        <span className="block text-[11px] text-neutral-400 line-through">
                          {formatearPrecio(prod.precioAnterior)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-neutral-900">
                        {formatearPrecio(prod.precio)}
                      </span>
                    </div>

                    <a
                      href={crearLinkWhatsApp(
                        com.whatsapp,
                        `Hola ${com.nombre}, me interesa "${prod.nombre}" (${formatearPrecio(prod.precio)}) que vi en Mercado Nicoleño.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded transition"
                    >
                      Pedir por WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-neutral-800 font-sans">
      {notificacion && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-neutral-900 text-white rounded-md shadow-xl p-4 border-l-4 border-orange-500 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">{notificacion.titulo}</p>
            <p className="text-neutral-300 mt-0.5">{notificacion.detalle}</p>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => irAVista('inicio')}
              className="flex items-center gap-2 text-left shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded bg-white text-orange-600 flex items-center justify-center font-black text-lg shadow-2xs">
                MN
              </div>
              <div className="leading-none">
                <span className="font-extrabold text-base sm:text-lg tracking-tight block">
                  Mercado Nicoleño
                </span>
                <span className="text-[10px] text-orange-100 font-medium hidden sm:block">
                  San Nicolás de los Arroyos
                </span>
              </div>
            </button>

            <div className="flex-1 max-w-xl">
              <div className="relative flex items-center bg-white rounded shadow-2xs overflow-hidden">
                <input
                  type="text"
                  value={busquedaGlobal}
                  onChange={(e) => setBusquedaGlobal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && vistaActual === 'inicio') {
                      irAVista('catalogo');
                    }
                  }}
                  placeholder="Buscar productos, rubros o comercios..."
                  className="w-full px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
                />
                {busquedaGlobal && (
                  <button
                    type="button"
                    onClick={() => setBusquedaGlobal('')}
                    className="px-2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => irAVista('catalogo')}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 border-l border-neutral-200 transition cursor-pointer"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => irAVista('cercanos')}
                className={`hover:text-white transition cursor-pointer ${
                  vistaActual === 'cercanos' ? 'font-bold underline underline-offset-4' : 'text-orange-50'
                }`}
              >
                Cerca de mí
              </button>
              <button
                type="button"
                onClick={() => irAVista('catalogo')}
                className={`hover:text-white transition cursor-pointer ${
                  vistaActual === 'catalogo' ? 'font-bold underline underline-offset-4' : 'text-orange-50'
                }`}
              >
                Catálogo
              </button>
              <button
                type="button"
                onClick={() => abrirPanelProtegido('panel_comerciante')}
                className={`hover:text-white transition cursor-pointer ${
                  vistaActual === 'panel_comerciante'
                    ? 'font-bold underline underline-offset-4'
                    : 'text-orange-50'
                }`}
              >
                Panel Comerciante
              </button>
              <button
                type="button"
                onClick={() => abrirPanelProtegido('panel_admin')}
                className={`hover:text-white transition cursor-pointer ${
                  vistaActual === 'panel_admin'
                    ? 'font-bold underline underline-offset-4'
                    : 'text-orange-50'
                }`}
              >
                Admin
              </button>
              <span className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded text-[11px] font-semibold text-white">
                <span
                  className={`w-2 h-2 rounded-full ${
                    estadoDb === 'conectado' ? 'bg-emerald-300' : 'bg-amber-200'
                  }`}
                />
                <span>{estadoDb === 'conectado' ? 'BD Online' : 'Simulación'}</span>
              </span>
              <button
                type="button"
                onClick={() => irAVista('registro')}
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-3 py-1.5 rounded shadow-2xs transition cursor-pointer"
              >
                Sumá tu local
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="md:hidden p-2 rounded bg-white/15 hover:bg-white/25 text-white shrink-0"
              aria-label="Abrir menú"
            >
              {menuMovilAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="mt-2 pt-1.5 border-t border-white/15 flex items-center justify-between gap-2 text-xs text-orange-50">
            <button
              type="button"
              onClick={() => irAVista('cercanos')}
              className="flex items-center gap-1.5 hover:text-white truncate cursor-pointer text-left min-w-0"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                Enviar a: <strong className="text-white">{ubicacionUsuario.nombre}</strong> • San Nicolás
              </span>
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => abrirPanelProtegido('panel_admin')}
                className="bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px] font-bold text-white"
              >
                Admin
              </button>
              <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    estadoDb === 'conectado' ? 'bg-emerald-300' : 'bg-amber-200'
                  }`}
                />
                <span>{estadoDb === 'conectado' ? 'BD Online' : 'Simulación'}</span>
              </span>
            </div>
          </div>
        </div>

        {menuMovilAbierto && (
          <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-3 space-y-1 shadow-lg">
            {[
              { id: 'inicio', label: 'Inicio', accion: () => irAVista('inicio') },
              {
                id: 'cercanos',
                label: 'Comercios cerca de mí',
                accion: () => irAVista('cercanos')
              },
              {
                id: 'catalogo',
                label: 'Catálogo de productos y servicios',
                accion: () => irAVista('catalogo')
              },
              {
                id: 'registro',
                label: 'Registrar mi comercio gratis',
                accion: () => irAVista('registro')
              },
              {
                id: 'panel_comerciante',
                label: 'Panel del Comerciante',
                accion: () => abrirPanelProtegido('panel_comerciante')
              },
              {
                id: 'panel_admin',
                label: 'Panel Administrador',
                accion: () => abrirPanelProtegido('panel_admin')
              }
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={item.accion}
                className={`w-full text-left px-3 py-2.5 rounded text-sm font-semibold block ${
                  vistaActual === item.id ? 'bg-orange-50 text-orange-600' : 'text-neutral-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        {vistaActual === 'inicio' && renderInicio()}
        {vistaActual === 'cercanos' && (
          <VistaCercanos
            comerciosPublicos={comerciosPublicos}
            ubicacionUsuario={ubicacionUsuario}
            estadoGps={estadoGps}
            mensajeGps={mensajeGps}
            solicitarUbicacionGPS={solicitarUbicacionGPS}
            seleccionarZonaManual={seleccionarZonaManual}
            verFichaComercio={verFichaComercio}
          />
        )}
        {vistaActual === 'catalogo' && (
          <VistaCatalogo
            productos={productos}
            comercios={comercios}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            soloOfertas={soloOfertas}
            setSoloOfertas={setSoloOfertas}
            soloAbiertos={soloAbiertos}
            soloEnvio={soloEnvio}
            setSoloEnvio={setSoloEnvio}
            busquedaGlobal={busquedaGlobal}
            setBusquedaGlobal={setBusquedaGlobal}
            verFichaComercio={verFichaComercio}
          />
        )}
        {vistaActual === 'ficha' && renderFichaComercio()}
        {vistaActual === 'registro' && (
          <VistaRegistroComercio
            setComercios={setComercios}
            irAVista={irAVista}
            mostrarNotificacion={mostrarNotificacion}
          />
        )}
        {vistaActual === 'acceso' && (
          <VistaAcceso
            destino={destinoPostLogin}
            onLoginExitoso={iniciarSesion}
            onCancelar={() => irAVista('inicio')}
          />
        )}
        {vistaActual === 'panel_comerciante' && (
          <VistaPanelComerciante
            comercios={comercios}
            productos={productos}
            setProductos={setProductos}
            verFichaComercio={verFichaComercio}
            mostrarNotificacion={mostrarNotificacion}
            usuarioActual={usuarioActual}
            onCerrarSesion={cerrarSesion}
          />
        )}
        {vistaActual === 'panel_admin' && (
          <VistaPanelAdmin
            comercios={comercios}
            setComercios={setComercios}
            productos={productos}
            verFichaComercio={verFichaComercio}
            mostrarNotificacion={mostrarNotificacion}
            cargarDatosDesdeSupabase={cargarDatosDesdeSupabase}
            cargandoDb={cargandoDb}
            usuarioActual={usuarioActual}
            onCerrarSesion={cerrarSesion}
          />
        )}
      </main>

      <footer className="bg-white border-t border-neutral-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600">
          <div className="space-y-2">
            <p className="font-bold text-neutral-900 text-sm">Mercado Nicoleño</p>
            <p className="leading-relaxed">
              Plataforma local para conectar a los vecinos y comercios de San Nicolás de los Arroyos.
              Contacto directo por WhatsApp sin comisiones por venta.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-neutral-900 text-sm">Secciones</p>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => irAVista('cercanos')}
                  className="hover:text-orange-600 cursor-pointer"
                >
                  Comercios cerca de mí
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => irAVista('catalogo')}
                  className="hover:text-orange-600 cursor-pointer"
                >
                  Catálogo de productos y servicios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => irAVista('registro')}
                  className="hover:text-orange-600 cursor-pointer"
                >
                  Registrar mi comercio gratis
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-neutral-900 text-sm">Gestión y Moderación</p>
            <p className="text-neutral-500 leading-relaxed">
              Los comercios y ofertas publicados son gestionados por cada locatario y revisados para
              mantener información clara en San Nicolás.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => abrirPanelProtegido('panel_comerciante')}
                className="text-orange-600 font-semibold hover:underline cursor-pointer"
              >
                Panel Comerciante
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => abrirPanelProtegido('panel_admin')}
                className="text-orange-600 font-semibold hover:underline cursor-pointer"
              >
                Panel Admin
              </button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-100 border-t border-neutral-200 py-3 px-4 text-center text-[11px] text-neutral-500">
          Mercado Nicoleño • San Nicolás de los Arroyos, Provincia de Buenos Aires
        </div>
      </footer>
    </div>
  );
}
