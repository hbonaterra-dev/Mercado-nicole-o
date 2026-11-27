import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Store,
  Phone,
  Clock,
  Truck,
  CheckCircle,
  Menu,
  X,
  Navigation,
  ShieldCheck,
  ArrowLeft,
  Package,
  Check,
  XCircle,
  Eye,
  RefreshCw,
  Camera,
  LogIn,
  LogOut,
  UserCheck,
  Compass,
  Trash2,
  Star
} from 'lucide-react';

// ============================================================================
// 1. CONFIGURACIÓN DE SUPABASE Y CONSTANTES LOCALES DE SAN NICOLÁS
// ============================================================================

const SUPABASE_URL = 'https://zogdgendyrqktymlwhzf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w601K0oEr5Eg-V8Jg2XAnQ_g_lAUCdn';
const STORAGE_BUCKET = 'imagenes-mercado';
const TIEMPO_ESPERA_RED_MS = 10000;

const CATEGORIAS = [
  { id: 'indumentaria', nombre: 'Indumentaria y Calzado', icon: '👕' },
  { id: 'hogar', nombre: 'Hogar, Bazar y Deco', icon: '🏡' },
  { id: 'ferreteria', nombre: 'Ferretería y Construcción', icon: '🔧' },
  { id: 'alimentos', nombre: 'Almacén, Panadería y Frescos', icon: '🥐' },
  { id: 'electronica', nombre: 'Tecnología y Celulares', icon: '📱' },
  { id: 'servicios', nombre: 'Servicios y Oficios Locales', icon: '🛠️' },
  { id: 'mascotas', nombre: 'Mascotas y Veterinaria', icon: '🐾' },
  { id: 'salud', nombre: 'Salud, Óptica y Estética', icon: '✨' }
];

const ZONAS_REFERENCIA = [
  { nombre: 'Centro / Plaza Mitre', lat: -33.3335, lng: -60.2110 },
  { nombre: 'Costanera / Parque Aguiar', lat: -33.3260, lng: -60.2035 },
  { nombre: 'Barrio Somisa', lat: -33.3740, lng: -60.1840 },
  { nombre: 'Zona Oeste / Av. Savio', lat: -33.3410, lng: -60.2360 },
  { nombre: 'Zona Norte / La Emilia', lat: -33.2980, lng: -60.2420 }
];

const COMERCIOS_DEMO = [
  {
    id: 'demo-com-1',
    nombre: 'Panadería del Paraná',
    responsable: 'Martín Gómez',
    rubro: 'alimentos',
    tipo: 'Ambos',
    direccion: 'Urquiza 245',
    zona: 'Centro / Plaza Mitre',
    lat: -33.3328,
    lng: -60.2102,
    whatsapp: '5493364550101',
    instagram: '@panaderiadelparana.sn',
    descripcion: 'Facturas frescas cada mañana, pan de campo, sándwiches de miga y tortas artesanales.',
    horarios: 'Lun a Dom 7:00 a 20:30',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: true,
    estado: 'aprobado',
    emoji: '🥐',
    esReal: false
  },
  {
    id: 'demo-com-2',
    nombre: 'Ferretería San Nicolás',
    responsable: 'Carlos Pereyra',
    rubro: 'ferreteria',
    tipo: 'Producto',
    direccion: 'Av. Savio 680',
    zona: 'Zona Oeste / Av. Savio',
    lat: -33.3405,
    lng: -60.2345,
    whatsapp: '5493364550102',
    instagram: '@ferreteriasannicolas',
    descripcion: 'Bulonería, herramientas eléctricas, pinturas, sanitarios y materiales de obra.',
    horarios: 'Lun a Vie 8:00 a 18:00 / Sáb 8:30 a 13:00',
    abiertoAhora: true,
    envioDomicilio: true,
    destacado: false,
    estado: 'aprobado',
    emoji: '🔧',
    esReal: false
  },
  {
    id: 'demo-com-3',
    nombre: 'TecnoFix Nicoleño',
    responsable: 'Lucía Fernández',
    rubro: 'electronica',
    tipo: 'Ambos',
    direccion: 'Mitre 412',
    zona: 'Centro / Plaza Mitre',
    lat: -33.3342,
    lng: -60.2125,
    whatsapp: '5493364550103',
    instagram: '@tecnofix.sn',
    descripcion: 'Cambio de módulos, baterías originales, cargadores rápidos y accesorios para celulares.',
    horarios: 'Lun a Sáb 9:30 a 19:30',
    abiertoAhora: true,
    envioDomicilio: false,
    destacado: false,
    estado: 'aprobado',
    emoji: '📱',
    esReal: false
  }
];

const PRODUCTOS_DEMO = [
  {
    id: 'demo-prod-1',
    comercioId: 'demo-com-1',
    nombre: 'Docena de facturas surtidas',
    categoria: 'alimentos',
    precio: 6800,
    precioAnterior: 7900,
    esOferta: true,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Recién horneadas con crema pastelera, membrillo y dulce de leche.',
    imagenUrl: null,
    emoji: '🥐',
    esReal: false
  },
  {
    id: 'demo-prod-2',
    comercioId: 'demo-com-2',
    nombre: 'Taladro percutor 650W con maletín',
    categoria: 'ferreteria',
    precio: 84500,
    precioAnterior: null,
    esOferta: false,
    disponible: true,
    tipo: 'Producto',
    descripcion: 'Ideal para trabajos en mampostería, madera y metal con velocidad variable.',
    imagenUrl: null,
    emoji: '🔧',
    esReal: false
  },
  {
    id: 'demo-prod-3',
    comercioId: 'demo-com-3',
    nombre: 'Service integral de pantalla y limpieza',
    categoria: 'electronica',
    precio: 29000,
    precioAnterior: 35000,
    esOferta: true,
    disponible: true,
    tipo: 'Servicio',
    descripcion: 'Diagnóstico sin cargo y entrega en el día en el centro de San Nicolás.',
    imagenUrl: null,
    emoji: '📱',
    esReal: false
  }
];

// ============================================================================
// 2. UTILIDADES DE RED, CÁLCULO GEOGRÁFICO Y FORMATO
// ============================================================================

/**
 * Realiza una petición HTTP a Supabase REST API con timeout de seguridad.
 */
async function sbFetch(endpoint, options = {}, token = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIEMPO_ESPERA_RED_MS);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      const detalle = await res.text();
      throw new Error(detalle || `Error HTTP ${res.status}`);
    }

    const texto = await res.text();
    return texto ? JSON.parse(texto) : [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Autentica o registra usuarios contra Supabase Auth.
 */
async function sbAuth(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIEMPO_ESPERA_RED_MS);

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || data.message || data.error_description || 'Error de acceso');
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Sube una imagen al bucket público de Supabase Storage y retorna su URL pública.
 */
async function sbUploadImg(file, token = null) {
  const extension = (file.name && file.name.split('.').pop()) || 'jpg';
  const nombreArchivo = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${extension}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${nombreArchivo}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
      'Content-Type': file.type || 'image/jpeg',
      'x-upsert': 'true'
    },
    body: file
  });

  if (!res.ok) {
    throw new Error('No se pudo subir la imagen al almacenamiento');
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${nombreArchivo}`;
}

/**
 * Calcula la distancia en kilómetros entre dos puntos geográficos (fórmula de Haversine).
 */
function calcKm(lat1, lon1, lat2, lon2) {
  const radioTierraKm = 6371;
  const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const dLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((Number(lat1) * Math.PI) / 180) *
      Math.cos((Number(lat2) * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return radioTierraKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fmtDist(km) {
  if (!Number.isFinite(km)) return 'En San Nicolás';
  return km < 1 ? `a ${Math.round((km * 1000) / 10) * 10} m` : `a ${km.toFixed(1)} km`;
}

function fmtPrecio(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(valor) || 0);
}

function parsePrecio(entrada) {
  const limpio = String(entrada || '').replace(/[^\d.,]/g, '').trim();
  if (!limpio) return 0;
  if (/^\d{1,3}([.,]\d{3})+$/.test(limpio)) {
    return Number(limpio.replace(/[.,]/g, '')) || 0;
  }
  return Number(limpio.split(',')[0].replace(/\./g, '')) || 0;
}

function waUrl(telefono, mensaje) {
  const digitos = String(telefono || '').replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

// ============================================================================
// 3. SUB-VISTAS DE LA APLICACIÓN
// ============================================================================

function VistaCercanos({ comerciosPublicos, ubicacion, pedirGPS, elegirZona, verComercio }) {
  const ordenados = comerciosPublicos
    .map((c) => ({ ...c, km: calcKm(ubicacion.lat, ubicacion.lng, c.lat, c.lng) }))
    .sort((a, b) => a.km - b.km);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-5 text-center space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-orange-500" />
          <span>Comercios cerca de mí en San Nicolás</span>
        </h1>
        <p className="text-sm text-neutral-600">
          Ubicación de referencia: <strong>{ubicacion.nombre}</strong>
        </p>

        <button
          type="button"
          onClick={pedirGPS}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded text-sm inline-flex items-center gap-2 cursor-pointer transition"
        >
          <Navigation className="w-4 h-4" />
          <span>Usar mi ubicación GPS</span>
        </button>

        <div className="pt-3 border-t border-neutral-100 flex flex-wrap justify-center gap-2">
          {ZONAS_REFERENCIA.map((z) => (
            <button
              type="button"
              key={z.nombre}
              onClick={() => elegirZona(z)}
              className={`text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition ${
                ubicacion.nombre === z.nombre
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {z.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-md p-4">
          <h2 className="text-xs font-bold uppercase text-neutral-500 text-center mb-3">
            Mapa de San Nicolás de los Arroyos
          </h2>
          <div className="relative w-full h-72 rounded bg-[#eef3ea] border border-neutral-300 overflow-hidden select-none">
            <div className="absolute top-0 right-0 bottom-0 w-9 bg-sky-200/75 border-l border-sky-300 flex items-center justify-center">
              <span className="-rotate-90 text-[9px] font-extrabold text-sky-900 whitespace-nowrap">
                RÍO PARANÁ
              </span>
            </div>
            <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-700">
              Costanera / Norte
            </div>
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-700">
              Centro / Sur
            </div>

            <div
              style={{ left: '46%', top: '50%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 text-center"
            >
              <div className="w-4 h-4 mx-auto rounded-full bg-blue-600 border-2 border-white shadow" />
              <span className="bg-blue-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Vos
              </span>
            </div>

            {ordenados.slice(0, 10).map((c) => {
              const dx = Math.max(-36, Math.min(30, (c.lng - ubicacion.lng) * 900));
              const dy = Math.max(-36, Math.min(36, -(c.lat - ubicacion.lat) * 900));
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => verComercio(c.id)}
                  title={`${c.nombre} (${fmtDist(c.km)})`}
                  style={{ left: `${46 + dx}%`, top: `${50 + dy}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-orange-400 hover:scale-110 transition-transform rounded-full w-8 h-8 flex items-center justify-center text-sm shadow cursor-pointer"
                >
                  {c.emoji}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          {ordenados.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-md p-8 text-center text-sm text-neutral-500">
              No hay comercios aprobados para mostrar en este momento.
            </div>
          ) : (
            ordenados.map((c) => (
              <div
                key={c.id}
                onClick={() => verComercio(c.id)}
                className="bg-white border border-neutral-200 hover:border-orange-400 rounded-md p-4 cursor-pointer flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{c.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-neutral-900 text-sm sm:text-base truncate">
                      {c.nombre}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate">
                      {c.direccion} • {c.zona}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded shrink-0">
                  {fmtDist(c.km)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function VistaCatalogo({ productos, comercios, categoria, setCategoria, busqueda, setBusqueda, verComercio }) {
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [soloEnvio, setSoloEnvio] = useState(false);

  const lista = productos.filter((p) => {
    if (!p.disponible) return false;
    const com = comercios.find((c) => c.id === p.comercioId);
    if (!com || com.estado !== 'aprobado') return false;
    if (categoria !== 'todas' && p.categoria !== categoria) return false;
    if (soloOfertas && !p.esOferta) return false;
    if (soloEnvio && !com.envioDomicilio) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(q) ||
        (p.descripcion || '').toLowerCase().includes(q) ||
        com.nombre.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-5 text-center space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
          Catálogo de productos y servicios
        </h1>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setCategoria('todas')}
            className={`text-xs font-semibold px-3 py-1.5 rounded cursor-pointer ${
              categoria === 'todas'
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
              onClick={() => setCategoria(cat.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded cursor-pointer ${
                categoria === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat.icon} {cat.nombre}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setSoloOfertas(!soloOfertas)}
            className={`text-xs font-semibold px-3 py-1.5 rounded cursor-pointer ${
              soloOfertas ? 'bg-amber-500 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            Solo ofertas
          </button>
          <button
            type="button"
            onClick={() => setSoloEnvio(!soloEnvio)}
            className={`text-xs font-semibold px-3 py-1.5 rounded cursor-pointer ${
              soloEnvio ? 'bg-sky-600 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            Con envío a domicilio
          </button>
          {(categoria !== 'todas' || soloOfertas || soloEnvio || busqueda.trim()) && (
            <button
              type="button"
              onClick={() => {
                setCategoria('todas');
                setSoloOfertas(false);
                setSoloEnvio(false);
                setBusqueda('');
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-md p-10 text-center space-y-2">
          <Package className="w-9 h-9 text-neutral-400 mx-auto" />
          <h2 className="font-bold text-neutral-800">No hay artículos con esos filtros</h2>
          <p className="text-xs text-neutral-500">
            Probá cambiando de rubro o limpiando los filtros activos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lista.map((prod) => {
            const com = comercios.find((c) => c.id === prod.comercioId);
            return (
              <div
                key={prod.id}
                className="bg-white border border-neutral-200 rounded-md overflow-hidden flex flex-col justify-between hover:border-orange-300 transition"
              >
                <div>
                  <div
                    onClick={() => com && verComercio(com.id)}
                    className="h-40 bg-neutral-50 border-b border-neutral-100 relative flex items-center justify-center text-5xl cursor-pointer overflow-hidden"
                  >
                    {prod.imagenUrl ? (
                      <img
                        src={prod.imagenUrl}
                        alt={prod.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{prod.emoji}</span>
                    )}
                    {prod.esOferta && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Oferta
                      </span>
                    )}
                  </div>
               
