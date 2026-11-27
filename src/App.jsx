react
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
// 1. CATEGORÍAS, ZONAS Y DATOS BASE (SIN MUESTRAS RECURRENTES)
// ============================================================================

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

const COMERCIOS_INICIALES = [];
const PRODUCTOS_INICIALES = [];

// ============================================================================
// 2. FUNCIONES AUXILIARES
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
// 3. SUB-VISTAS
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
        <div className="flex flex-col items-center text-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center justify-center gap-2">
              <Compass className="w-6 h-6 text-orange-500" />
              <span>Comercios cerca de mí en San Nicolás</span>
            </h1>
            <p className="text-sm text-neutral-600 mt-0.5">{mensajeGps}</p>
          </div>

          <button
            type="button"
            onClick={solicitarUbicacionGPS}
            disabled={estadoGps === 'cargando'}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded text-sm inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 ${estadoGps === 'cargando' ? 'animate-spin' : ''}`} />
            <span>{estadoGps === 'cargando' ? 'Obteniendo GPS...' : 'Usar mi ubicación GPS'}</span>
          </button>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase mr-1 w-full text-center">
            O elegí una zona de referencia:
          </span>
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
              Mapa de San Nicolás • {ubicacionUsuario.nombre}
            </span>
            <span className="text-xs font-semibold text-orange-600">
              {comerciosConDistancia.length} locales
            </span>
          </div>

          <div className="relative w-full h-72 sm:h-80 rounded bg-[#eef3ea] border border-neutral-300 overflow-hidden select-none">
            <div
              className="absolute inset-0 opacity-45"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 2px, transparent 2px), linear-gradient(to bottom, #ffffff 2px, transparent 2px)',
                backgroundSize: '42px 42px'
              }}
            />

            <div className="absolute top-0 right-0 bottom-0 w-10 bg-sky-200/70 border-l border-sky-300/80 flex items-center justify-center">
              <span className="-rotate-90 text-[9px] font-extrabold tracking-wider text-sky-900 whitespace-nowrap">
                RÍO PARANÁ
              </span>
            </div>

            <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-900 border border-emerald-200 shadow-2xs">
              Parque Aguiar / Costanera
            </div>
            <div className="absolute top-1/2 left-2.5 -translate-y-1/2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-700 border border-neutral-200 shadow-2xs">
              Av. Savio / Centro
            </div>
            <div className="absolute bottom-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded text-[10px] font-semibold text-neutral-700 border border-neutral-200 shadow-2xs">
              San Nicolás • Sur / Somisa
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
              const dx = Math.max(-38, Math.min(34, (c.lng - ubicacionUsuario.lng) * 950));
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
          {comerciosConDistancia.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-md p-8 text-center text-sm text-neutral-500">
              Todavía no hay comercios aprobados para mostrar en esta vista. Registrá uno desde <strong>Sumá tu local</strong> y aprobalo en <strong>Admin</strong>.
            </div>
          ) : (
            comerciosConDistancia.map((com, idx) => {
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
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {cat?.nombre} • {com.direccion} ({com.zona})
                      </p>
                      <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2">{com.descripcion}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                    <span className="text-xs font-bold text-neutral-500">{com.rangoPrecio}</span>
                    <span className="text-xs font-semibold text-orange-600">Ver local →</span>
                  </div>
                </div>
              );
            })
          )}
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
        <div className="flex flex-col items-center text-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Catálogo de Productos y Servicios en San Nicolás
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Mostrando {productosFiltrados.length} publicaciones de comercios locales.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
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

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onCl
