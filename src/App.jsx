import React, { useState, useEffect, useRef } from 'react';
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

// ============================================================================
// 2. CARGADOR DE LEAFLET / OPENSTREETMAP (MAPA REAL CON CALLES)
// ============================================================================

let promesaLeaflet = null;

function cargarLeaflet() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.L) return Promise.resolve(window.L);
  if (promesaLeaflet) return promesaLeaflet;

  promesaLeaflet = new Promise((resolve, reject) => {
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('No se pudo cargar el mapa interactivo'));
    document.head.appendChild(script);
  });

  return promesaLeaflet;
}

function MapaInteractivoCalles({
  centro,
  comercios = [],
  verComercio,
  seleccionable = false,
  alSeleccionarPunto
}) {
  const contenedorRef = useRef(null);
  const mapaRef = useRef(null);
  const capaMarcadoresRef = useRef(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let activo = true;

    cargarLeaflet()
      .then((L) => {
        if (!activo || !L || !contenedorRef.current || mapaRef.current) return;

        const mapa = L.map(contenedorRef.current, {
          center: [centro.lat, centro.lng],
          zoom: seleccionable ? 15 : 14,
          zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(mapa);

        capaMarcadoresRef.current = L.layerGroup().addTo(mapa);

        if (seleccionable && alSeleccionarPunto) {
          mapa.on('click', (e) => {
            alSeleccionarPunto({
              lat: Number(e.latlng.lat.toFixed(6)),
              lng: Number(e.latlng.lng.toFixed(6))
            });
          });
        }

        mapaRef.current = mapa;
        setListo(true);
        setTimeout(() => mapa.invalidateSize(), 150);
      })
      .catch(() => {});

    return () => {
      activo = false;
      if (mapaRef.current) {
        mapaRef.current.remove();
        mapaRef.current = null;
        capaMarcadoresRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    const mapa = mapaRef.current;
    const capa = capaMarcadoresRef.current;
    if (!listo || !L || !mapa || !capa) return;

    capa.clearLayers();
    mapa.setView([centro.lat, centro.lng], mapa.getZoom());

    if (seleccionable) {
      const iconoLocal = L.divIcon({
        className: '',
        html: `<div style="background:#f97316;color:#fff;width:32px;height:32px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([centro.lat, centro.lng], { icon: iconoLocal })
        .addTo(capa)
        .bindPopup('<strong>Ubicación de tu comercio</strong><br/>Tocá otra calle para mover el pin');
      return;
    }

    const iconoUsuario = L.divIcon({
      className: '',
      html: `<div style="background:#2563eb;color:#fff;padding:2px 7px;border-radius:9999px;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);white-space:nowrap;">Vos</div>`,
      iconSize: [38, 22],
      iconAnchor: [19, 11]
    });

    L.marker([centro.lat, centro.lng], { icon: iconoUsuario })
      .addTo(capa)
      .bindPopup(`<strong>Tu ubicación:</strong> ${centro.nombre}`);

    comercios.forEach((c) => {
      const iconoCom = L.divIcon({
        className: '',
        html: `<div style="background:#ffffff;width:34px;height:34px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:17px;border:2px solid #f97316;box-shadow:0 2px 6px rgba(0,0,0,0.28);cursor:pointer;">${c.emoji}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marcador = L.marker([c.lat, c.lng], { icon: iconoCom }).addTo(capa);

      const popupContenedor = document.createElement('div');
      popupContenedor.style.textAlign = 'center';
      popupContenedor.style.minWidth = '150px';
      popupContenedor.innerHTML = `
        <div style="font-weight:700;font-size:13px;color:#171717;">${c.nombre}</div>
        <div style="font-size:11px;color:#525252;margin:2px 0 6px;">${c.direccion}</div>
      `;

      if (verComercio) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Ver ficha del local';
        btn.style.cssText =
          'background:#f97316;color:#fff;border:none;border-radius:4px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;';
        btn.onclick = () => verComercio(c.id);
        popupContenedor.appendChild(btn);
      }

      marcador.bindPopup(popupContenedor);
    });
  }, [listo, centro, comercios, seleccionable]);

  return (
    <div className="relative w-full h-80 rounded border border-neutral-300 overflow-hidden bg-neutral-100 z-0">
      <div ref={contenedorRef} className="w-full h-full" />
      {!listo && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-xs text-neutral-500">
          Cargando mapa de calles de San Nicolás...
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. UTILIDADES DE RED, COMPRESIÓN DE FOTOS Y FORMATO
// ============================================================================

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

function comprimirImagen(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const urlTemporal = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(urlTemporal);
      const maxAncho = 1200;
      const escala = img.width > maxAncho ? maxAncho / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg',
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(urlTemporal);
      resolve(file);
    };
    img.src = urlTemporal;
  });
}

async function sbUploadImg(file, token = null) {
  const archivoOptimizado = await comprimirImagen(file);
  const nombreArchivo = `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${nombreArchivo}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true'
    },
    body: archivoOptimizado
  });

  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(detalle || 'No se pudo subir la foto al Storage');
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${nombreArchivo}`;
}

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
// 4. SUB-VISTAS DE LA APLICACIÓN
// ============================================================================

function VistaCercanos({ comerciosPublicos, ubicacion, pedirGPS, elegirZona, verComercio }) {
  const ordenados = comerciosPublicos
    .map((c) => ({ ...c, km: calcKm(ubicacion.lat, ubicacion.lng, c.lat, c.lng) }))
    .sort((a, b) => a.km - b.km);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-5 text-center space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 text-center flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-orange-500 shrink-0" />
          <span>Comercios cerca de mí en San Nicolás</span>
        </h1>
        <p className="text-sm text-neutral-600 text-center">
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
        <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-md p-4 space-y-2">
          <h2 className="text-xs font-bold uppercase text-neutral-500 text-center">
            Mapa interactivo de calles — San Nicolás de los Arroyos
          </h2>
          <MapaInteractivoCalles
            centro={ubicacion}
            comercios={ordenados}
            verComercio={verComercio}
          />
          <p className="text-[11px] text-neutral-500 text-center">
            Mové o acercá el mapa para recorrer las calles y tocá un ícono para ver el comercio
          </p>
        </div>

        <div className="lg:col-span-6 space-y-3">
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
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 text-center">
          Catálogo de productos y servicios
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 text-center">
          Explorá ofertas y artículos disponibles en comercios de San Nicolás
        </p>

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
          <h2 className="font-bold text-neutral-800 text-center">No hay artículos publicados todavía</h2>
          <p className="text-xs text-neutral-500 text-center">
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
                  <div className="p-4 text-center">
                    {prod.precioAnterior && (
                      <p className="text-xs text-neutral-400 line-through">
                        {fmtPrecio(prod.precioAnterior)}
                      </p>
                    )}
                    <p className="text-lg font-bold text-neutral-900">{fmtPrecio(prod.precio)}</p>
                    <h3 className="font-semibold text-sm text-neutral-800 mt-1 line-clamp-2 text-center">
                      {prod.nombre}
                    </h3>
                    {prod.descripcion && (
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 text-center">
                        {prod.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => com && verComercio(com.id)}
                    className="text-left min-w-0 cursor-pointer"
                  >
                    <p className="text-xs font-bold text-neutral-800 truncate">{com?.nombre}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{com?.zona}</p>
                  </button>
                  {com && (
                    <a
                      href={waUrl(
                        com.whatsapp,
                        `Hola ${com.nombre}, vi "${prod.nombre}" (${fmtPrecio(prod.precio)}) en Mercado Nicoleño.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded shrink-0"
                    >
                      WhatsApp
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

function VistaRegistro({ irA, notificar, recargar }) {
  const [form, setForm] = useState({
    nombre: '',
    responsable: '',
    rubro: 'alimentos',
    direccion: '',
    zona: ZONAS_REFERENCIA[0].nombre,
    lat: ZONAS_REFERENCIA[0].lat,
    lng: ZONAS_REFERENCIA[0].lng,
    whatsapp: '',
    descripcion: '',
    envioDomicilio: true
  });
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  const usarGpsEnLocal = () => {
    if (!navigator.geolocation) {
      notificar('GPS no disponible', 'Tocá tu calle directamente en el mapa.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6))
        }));
        notificar('Ubicación marcada', 'Se fijó el pin en tu ubicación actual.');
      },
      () => {
        notificar('Sin permiso GPS', 'Podés tocar la calle exacta de tu local en el mapa.');
      }
    );
  };

  const guardar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await sbFetch('comercios', {
        method: 'POST',
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          responsable: form.responsable.trim(),
          rubro: form.rubro,
          direccion: form.direccion.trim(),
          zona: form.zona,
          lat: form.lat,
          lng: form.lng,
          whatsapp: form.whatsapp.trim(),
          descripcion: form.descripcion.trim(),
          envio_domicilio: form.envioDomicilio,
          estado: 'pendiente'
        })
      });

      await recargar();
      setListo(true);
      notificar('Solicitud enviada', `${form.nombre.trim()} quedó pendiente de aprobación.`);
    } catch (err) {
      notificar('Error al guardar', err.message || 'Revisá tu conexión e intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (listo) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white border border-emerald-200 rounded-md p-6 text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900 text-center">Comercio registrado</h2>
          <p className="text-sm text-neutral-600 text-center">
            La solicitud ya quedó guardada en la base de datos. Un administrador la revisará para publicarla.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => irA('inicio')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded text-sm cursor-pointer"
            >
              Volver al inicio
            </button>
            <button
              type="button"
              onClick={() => {
                setListo(false);
                setForm({
                  nombre: '',
                  responsable: '',
                  rubro: 'alimentos',
                  direccion: '',
                  zona: ZONAS_REFERENCIA[0].nombre,
                  lat: ZONAS_REFERENCIA[0].lat,
                  lng: ZONAS_REFERENCIA[0].lng,
                  whatsapp: '',
                  descripcion: '',
                  envioDomicilio: true
                });
              }}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold px-4 py-2.5 rounded text-sm cursor-pointer"
            >
              Cargar otro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900 text-center">Sumá tu comercio</h1>
        <p className="text-xs text-neutral-500 text-center">
          Completá los datos básicos y marcá la calle exacta de tu local en San Nicolás.
        </p>

        <form onSubmit={guardar} className="space-y-3">
          <input
            required
            type="text"
            placeholder="Nombre del comercio *"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
          />
          <input
            required
            type="text"
            placeholder="Responsable o titular *"
            value={form.responsable}
            onChange={(e) => setForm({ ...form, responsable: e.target.value })}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.rubro}
              onChange={(e) => setForm({ ...form, rubro: e.target.value })}
              className="border border-neutral-300 rounded px-3 py-2 text-sm bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <select
              value={form.zona}
              onChange={(e) => {
                const z = ZONAS_REFERENCIA.find((item) => item.nombre === e.target.value) || ZONAS_REFERENCIA[0];
                setForm({ ...form, zona: z.nombre, lat: z.lat, lng: z.lng });
              }}
              className="border border-neutral-300 rounded px-3 py-2 text-sm bg-white"
            >
              {ZONAS_REFERENCIA.map((z) => (
                <option key={z.nombre} value={z.nombre}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              type="text"
              placeholder="Dirección (ej: Mitre 250) *"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
            />
            <input
              required
              type="text"
              placeholder="WhatsApp (ej: 5493364551234) *"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs font-semibold text-neutral-700 text-center sm:text-left">
                Tocá en el mapa la ubicación exacta de tu local:
              </p>
              <button
                type="button"
                onClick={usarGpsEnLocal}
                className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 rounded inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-orange-500" />
                <span>Estoy en el local (GPS)</span>
              </button>
            </div>
            <MapaInteractivoCalles
              centro={{ lat: form.lat, lng: form.lng, nombre: form.nombre || 'Tu local' }}
              seleccionable
              alSeleccionarPunto={({ lat, lng }) => setForm((prev) => ({ ...prev, lat, lng }))}
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="¿Qué productos o servicios ofrecés? *"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.envioDomicilio}
              onChange={(e) => setForm({ ...form, envioDomicilio: e.target.checked })}
            />
            <span>Ofrezco envío a domicilio en San Nicolás</span>
          </label>
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded text-sm cursor-pointer"
          >
            {enviando ? 'Guardando...' : 'Guardar comercio'}
          </button>
        </form>
      </div>
    </div>
  );
}

function VistaComerciante({ comercios, productos, recargar, usuario, salir, verComercio, notificar }) {
  const comerciosDisponibles = comercios.filter(
    (c) => c.ownerId === usuario?.id || !c.ownerId
  );

  const [comId, setComId] = useState(comerciosDisponibles[0]?.id || '');
  const com = comerciosDisponibles.find((c) => c.id === comId) || comerciosDisponibles[0];
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esOferta, setEsOferta] = useState(false);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [publicando, setPublicando] = useState(false);

  const publicar = async (e) => {
    e.preventDefault();
    const pNum = parsePrecio(precio);
    if (!com || !nombre.trim() || pNum <= 0) return;

    setPublicando(true);
    try {
      let imgUrl = null;
      if (foto) {
        imgUrl = await sbUploadImg(foto, usuario?.accessToken);
      }

      await sbFetch(
        'productos',
        {
          method: 'POST',
          body: JSON.stringify({
            comercio_id: com.id,
            nombre: nombre.trim(),
            categoria: com.rubro,
            precio: pNum,
            precio_anterior: esOferta ? Math.round(pNum * 1.15) : null,
            es_oferta: esOferta,
            disponible: true,
            tipo: 'Producto',
            descripcion: descripcion.trim() || `Disponible en ${com.nombre} (${com.zona}).`,
            imagen_url: imgUrl
          })
        },
        usuario?.accessToken
      );

      await recargar();
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setEsOferta(false);
      setFoto(null);
      setPreview('');
      notificar('Publicado', `"${nombre.trim()}" ya figura en el catálogo.`);
    } catch (err) {
      notificar('No se pudo publicar', err.message || 'Verificá tu conexión o el Storage.');
    } finally {
      setPublicando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-4 text-center space-y-3">
        <h1 className="text-lg font-bold text-neutral-900 text-center">Panel del Comerciante</h1>
        <p className="text-xs text-neutral-500 text-center flex items-center justify-center gap-1.5">
          <UserCheck className="w-4 h-4 text-orange-500" />
          <span>{usuario?.email}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {comerciosDisponibles.length > 0 && (
            <select
              value={com?.id || ''}
              onChange={(e) => setComId(e.target.value)}
              className="border border-neutral-300 rounded px-2.5 py-1.5 text-xs font-semibold bg-white"
            >
              {comerciosDisponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={salir}
            className="border border-neutral-300 hover:bg-neutral-50 rounded px-2.5 py-1.5 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir de Comerciante
          </button>
        </div>
      </div>

      {!com ? (
        <div className="bg-white border border-neutral-200 rounded-md p-8 text-center text-sm text-neutral-500">
          Todavía no tenés un comercio asociado a esta cuenta.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
            <div className="text-center space-y-1">
              <h2 className="font-bold text-base text-center">Publicar en {com.nombre}</h2>
              <button
                type="button"
                onClick={() => verComercio(com.id)}
                className="text-xs font-semibold text-orange-600 inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Ver ficha pública
              </button>
            </div>

            <form onSubmit={publicar} className="space-y-3">
              <label className="border-2 border-dashed border-neutral-300 rounded p-3 flex flex-col items-center cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition">
                {preview ? (
                  <img src={preview} alt="Vista previa" className="w-full h-32 object-cover rounded" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-orange-500 mb-1" />
                    <span className="text-xs font-semibold">Elegir foto del producto</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setFoto(f);
                    const lector = new FileReader();
                    lector.onload = () => setPreview(String(lector.result || ''));
                    lector.readAsDataURL(f);
                  }}
                  className="hidden"
                />
              </label>

              <input
                required
                type="text"
                placeholder="Nombre del producto o servicio *"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
              <input
                required
                type="text"
                inputMode="numeric"
                placeholder="Precio en $ (ej: 12500) *"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
              <textarea
                rows={2}
                placeholder="Breve detalle (opcional)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esOferta}
                  onChange={(e) => setEsOferta(e.target.checked)}
                />
                <span>Marcar como oferta del día</span>
              </label>
              <button
                type="submit"
                disabled={publicando}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded text-sm cursor-pointer"
              >
                {publicando ? 'Subiendo foto y publicando...' : 'Publicar ahora'}
              </button>
            </form>
          </div>

          <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
            <h2 className="font-bold text-base text-center">Publicaciones de {com.nombre}</h2>
            {productos.filter((p) => p.comercioId === com.id).length === 0 ? (
              <p className="text-xs text-neutral-500 text-center">
                Todavía no cargaste publicaciones para este local.
              </p>
            ) : (
              productos
                .filter((p) => p.comercioId === com.id)
                .map((p) => (
                  <div
                    key={p.id}
                    className="py-2 border-b border-neutral-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {p.imagenUrl && (
                        <img
                          src={p.imagenUrl}
                          alt={p.nombre}
                          className="w-10 h-10 rounded object-cover shrink-0 border border-neutral-200"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{p.nombre}</p>
                        <p className="text-xs font-bold text-orange-600">{fmtPrecio(p.precio)}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold shrink-0">
                      Activo
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VistaAcceso({ destino, onLogin, cancelar }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const esAdminDestino = destino === 'panel_admin';

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const endpoint = modo === 'login' ? 'token?grant_type=password' : 'signup';
      const data = await sbAuth(endpoint, { email: email.trim(), password });
      const token = data.access_token || data.session?.access_token || null;
      const userId = data.user?.id || null;
      const userEmail = data.user?.email || email.trim();

      if (!token || !userId) {
        throw new Error('Revisá tu correo para confirmar la cuenta antes de ingresar.');
      }

      let rol = 'comerciante';
      try {
        const perfiles = await sbFetch(`perfiles?id=eq.${userId}&select=rol`, {}, token);
        if (perfiles && perfiles[0]?.rol) {
          rol = perfiles[0].rol;
        }
      } catch {
        rol = 'comerciante';
      }

      if (esAdminDestino && rol !== 'admin') {
        throw new Error('Esta cuenta no tiene permisos de Administrador.');
      }

      onLogin({
        id: userId,
        email: userEmail,
        accessToken: token,
        rol: esAdminDestino ? 'admin' : 'comerciante'
      });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4 text-center">
        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded">
          <LogIn className="w-3.5 h-3.5" />
          <span>{esAdminDestino ? 'Acceso Administrador' : 'Acceso Comerciantes'}</span>
        </span>
        <h1 className="text-xl font-bold text-neutral-900 text-center">
          {modo === 'login'
            ? esAdminDestino
              ? 'Ingresar como Administrador'
              : 'Ingresar como Comerciante'
            : 'Crear cuenta de comerciante'}
        </h1>
        <p className="text-xs text-neutral-500 text-center">
          {esAdminDestino
            ? 'Sesión exclusiva para administración y moderación del sitio'
            : 'Sesión independiente para gestionar tu local y publicaciones'}
        </p>

        {error && (
          <p className="text-xs bg-red-50 text-red-700 p-2.5 rounded border border-red-200">{error}</p>
        )}

        <form onSubmit={enviar} className="space-y-3 text-left">
          <input
            required
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded text-sm cursor-pointer"
          >
            {enviando ? 'Verificando...' : modo === 'login' ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        {!esAdminDestino && (
          <button
            type="button"
            onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
            className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
          >
            {modo === 'login' ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
          </button>
        )}

        <div className="pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={cancelar}
            className="w-full text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

function VistaAdmin({
  comercios,
  setComercios,
  productos,
  setProductos,
  usuario,
  salir,
  recargar,
  cargando,
  verComercio,
  notificar
}) {
  const [borrarComId, setBorrarComId] = useState(null);
  const [borrarProdId, setBorrarProdId] = useState(null);

  const cambiarEstado = async (c, estado) => {
    try {
      await sbFetch(
        `comercios?id=eq.${c.id}`,
        { method: 'PATCH', body: JSON.stringify({ estado }) },
        usuario?.accessToken
      );
      setComercios((prev) => prev.map((item) => (item.id === c.id ? { ...item, estado } : item)));
      notificar('Estado actualizado', `${c.nombre} ahora está ${estado}.`);
    } catch (err) {
      notificar('Error al actualizar', err.message || 'No se pudo cambiar el estado.');
    }
  };

  const alternarDestacado = async (c) => {
    const destacado = !c.destacado;
    try {
      await sbFetch(
        `comercios?id=eq.${c.id}`,
        { method: 'PATCH', body: JSON.stringify({ destacado }) },
        usuario?.accessToken
      );
      setComercios((prev) => prev.map((item) => (item.id === c.id ? { ...item, destacado } : item)));
      notificar(
        destacado ? 'Comercio destacado' : 'Destacado quitado',
        `${c.nombre} ${destacado ? 'aparecerá primero en portada.' : 'volvió al orden normal.'}`
      );
    } catch (err) {
      notificar('Error', err.message || 'No se pudo actualizar el destacado.');
    }
  };

  const eliminarComercio = async (c) => {
    try {
      await sbFetch(`comercios?id=eq.${c.id}`, { method: 'DELETE' }, usuario?.accessToken);
      setComercios((prev) => prev.filter((item) => item.id !== c.id));
      setProductos((prev) => prev.filter((item) => item.comercioId !== c.id));
      setBorrarComId(null);
      notificar('Comercio eliminado', `Se quitó ${c.nombre} de la base de datos.`);
    } catch (err) {
      notificar('No se pudo eliminar', err.message || 'Ejecutá el SQL Etapa 1 en Supabase.');
    }
  };

  const eliminarProducto = async (p) => {
    try {
      await sbFetch(`productos?id=eq.${p.id}`, { method: 'DELETE' }, usuario?.accessToken);
      setProductos((prev) => prev.filter((item) => item.id !== p.id));
      setBorrarProdId(null);
      notificar('Publicación eliminada', `Se borró "${p.nombre}".`);
    } catch (err) {
      notificar('No se pudo borrar', err.message || 'Verificá permisos de administrador.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="bg-white border border-neutral-200 rounded-md p-5 text-center space-y-3">
        <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded">
          <ShieldCheck className="w-4 h-4" /> Panel Administrador ({usuario?.email})
        </span>
        <h1 className="text-xl font-bold text-neutral-900 text-center">
          Gestión de Comercios y Publicaciones
        </h1>
        <p className="text-xs text-neutral-500 text-center">
          Aprobá solicitudes, destacá locales y moderá el catálogo de San Nicolás
        </p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={recargar}
            className="bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold px-3 py-2 rounded inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? 'animate-spin' : ''}`} />
            <span>Actualizar datos</span>
          </button>
          <button
            type="button"
            onClick={salir}
            className="border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold px-3 py-2 rounded inline-flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir de Admin</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
        <h2 className="font-bold text-base text-center">Comercios ({comercios.length})</h2>
        {comercios.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center">No hay comercios cargados en la base de datos.</p>
        ) : (
          comercios.map((c) => (
            <div
              key={c.id}
              className="border border-neutral-200 rounded p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-sm text-neutral-900">
                  {c.nombre}{' '}
                  <span className="text-xs font-normal text-orange-700">({c.estado})</span>
                  {c.destacado && (
                    <span className="ml-2 text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                      Destacado
                    </span>
                  )}
                </p>
                <p className="text-xs text-neutral-500">
                  {c.direccion} • {c.zona}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {c.estado !== 'aprobado' && (
                  <button
                    type="button"
                    onClick={() => cambiarEstado(c, 'aprobado')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Aprobar
                  </button>
                )}
                {c.estado === 'pendiente' && (
                  <button
                    type="button"
                    onClick={() => cambiarEstado(c, 'rechazado')}
                    className="border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Rechazar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => alternarDestacado(c)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" /> {c.destacado ? 'Quitar destaque' : 'Destacar'}
                </button>
                <button
                  type="button"
                  onClick={() => verComercio(c.id)}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer"
                >
                  Ver ficha
                </button>
                {borrarComId === c.id ? (
                  <button
                    type="button"
                    onClick={() => eliminarComercio(c)}
                    className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
                  >
                    Confirmar eliminar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBorrarComId(c.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
        <h2 className="font-bold text-base text-center">Publicaciones ({productos.length})</h2>
        {productos.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center">No hay publicaciones cargadas.</p>
        ) : (
          productos.map((p) => (
            <div
              key={p.id}
              className="py-2.5 border-b border-neutral-100 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold">{p.nombre}</p>
                <p className="text-xs font-bold text-orange-600">{fmtPrecio(p.precio)}</p>
              </div>
              {borrarProdId === p.id ? (
                <button
                  type="button"
                  onClick={() => eliminarProducto(p)}
                  className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
                >
                  Confirmar borrar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBorrarProdId(p.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Borrar
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================

export default function App() {
  const [vista, setVista] = useState('inicio');
  const [destinoLogin, setDestinoLogin] = useState('panel_comerciante');
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);
  const [usuarioComerciante, setUsuarioComerciante] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [comercios, setComercios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [bdOnline, setBdOnline] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [comIdFicha, setComIdFicha] = useState('');
  const [ubicacion, setUbicacion] = useState(ZONAS_REFERENCIA[0]);
  const [aviso, setAviso] = useState(null);

  const notificar = (titulo, detalle) => {
    setAviso({ titulo, detalle });
    setTimeout(() => setAviso(null), 4000);
  };

  const cargarBD = async () => {
    setCargando(true);
    try {
      const tokenActual = usuarioAdmin?.accessToken || usuarioComerciante?.accessToken || null;
      const [cDb, pDb] = await Promise.all([
        sbFetch('comercios?select=*&order=creado_en.desc', {}, tokenActual),
        sbFetch('productos?select=*&order=creado_en.desc', {}, tokenActual)
      ]);

      setBdOnline(true);

      const mapeadosCom = cDb.map((c) => {
        const cat = CATEGORIAS.find((x) => x.id === c.rubro);
        return {
          id: c.id,
          ownerId: c.owner_id || null,
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
          horarios: c.horarios || 'Lun a Sáb 9:00 a 20:00',
          abiertoAhora: c.abierto_ahora ?? true,
          envioDomicilio: Boolean(c.envio_domicilio),
          destacado: Boolean(c.destacado),
          estado: c.estado || 'pendiente',
          emoji: cat?.icon || '🏪',
          esReal: true
        };
      });

      const mapeadosProd = pDb.map((p) => {
        const cat = CATEGORIAS.find((x) => x.id === p.categoria);
        return {
          id: p.id,
          comercioId: p.comercio_id,
          nombre: p.nombre,
          categoria: p.categoria,
          precio: Number(p.precio),
          precioAnterior: p.precio_anterior ? Number(p.precio_anterior) : null,
          esOferta: Boolean(p.es_oferta),
          disponible: p.disponible ?? true,
          tipo: p.tipo || 'Producto',
          descripcion: p.descripcion || '',
          imagenUrl: p.imagen_url || null,
          emoji: cat?.icon || '📦',
          esReal: true
        };
      });

      setComercios(mapeadosCom);
      setProductos(mapeadosProd);
    } catch {
      setBdOnline(false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarBD();
  }, [usuarioAdmin, usuarioComerciante]);

  const irA = (v) => {
    setVista(v);
    setMenuOpen(false);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const abrirPanel = (dest) => {
    if (dest === 'panel_admin') {
      if (usuarioAdmin) {
        irA('panel_admin');
      } else {
        setDestinoLogin('panel_admin');
        irA('acceso');
      }
      return;
    }

    if (usuarioComerciante) {
      irA('panel_comerciante');
    } else {
      setDestinoLogin('panel_comerciante');
      irA('acceso');
    }
  };

  const pedirGPS = () => {
    if (!navigator.geolocation) {
      notificar('GPS no disponible', 'Podés elegir una zona de San Nicolás.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({
          nombre: 'Mi ubicación (GPS)',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        notificar('Ubicación actualizada', 'Calculando distancias en San Nicolás.');
      },
      () => {
        notificar('Permiso pendiente', 'Seleccioná una zona de referencia en el mapa.');
      }
    );
  };

  const comerciosAprobados = comercios
    .filter((c) => c.estado === 'aprobado')
    .sort((a, b) => Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)));

  const ficha = comercios.find((c) => c.id === comIdFicha) || comerciosAprobados[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-neutral-800">
      {aviso && (
        <div className="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white text-xs p-3.5 rounded shadow-lg border-l-4 border-orange-500 max-w-xs">
          <p className="font-bold">{aviso.titulo}</p>
          <p className="text-neutral-300 mt-0.5">{aviso.detalle}</p>
        </div>
      )}

      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => irA('inicio')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="w-8 h-8 rounded bg-white text-orange-600 font-black flex items-center justify-center">
              MN
            </span>
            <span className="font-extrabold text-base sm:text-lg">Mercado Nicoleño</span>
          </button>

          <div className="flex-1 max-w-md bg-white rounded flex items-center overflow-hidden">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') irA('catalogo');
              }}
              placeholder="Buscar en San Nicolás..."
              className="w-full px-3 py-1.5 text-xs sm:text-sm text-neutral-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => irA('catalogo')}
              aria-label="Buscar"
              className="px-2.5 py-1.5 text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-3 text-xs font-semibold shrink-0">
            <button type="button" onClick={() => irA('cercanos')} className="hover:underline cursor-pointer">
              Cerca de mí
            </button>
            <button type="button" onClick={() => irA('catalogo')} className="hover:underline cursor-pointer">
              Catálogo
            </button>
            <button
              type="button"
              onClick={() => abrirPanel('panel_comerciante')}
              className="hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Comerciante</span>
              {usuarioComerciante && <span className="w-2 h-2 rounded-full bg-emerald-300" />}
            </button>
            <button
              type="button"
              onClick={() => abrirPanel('panel_admin')}
              className="hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Admin</span>
              {usuarioAdmin && <span className="w-2 h-2 rounded-full bg-emerald-300" />}
            </button>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">
              {bdOnline ? 'BD Online' : 'Conectando...'}
            </span>
            <button
              type="button"
              onClick={() => irA('registro')}
              className="bg-white text-orange-600 font-bold px-3 py-1.5 rounded hover:bg-orange-50 cursor-pointer"
            >
              Sumá tu local
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="md:hidden p-2 rounded bg-white/15 cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white text-neutral-800 px-4 py-3 space-y-1 text-sm font-semibold border-t">
            <button type="button" onClick={() => irA('inicio')} className="block w-full text-left py-2">
              Inicio
            </button>
            <button type="button" onClick={() => irA('cercanos')} className="block w-full text-left py-2">
              Cerca de mí
            </button>
            <button type="button" onClick={() => irA('catalogo')} className="block w-full text-left py-2">
              Catálogo
            </button>
            <button type="button" onClick={() => irA('registro')} className="block w-full text-left py-2">
              Sumá tu local
            </button>
            <button
              type="button"
              onClick={() => abrirPanel('panel_comerciante')}
              className="block w-full text-left py-2"
            >
              Panel Comerciante {usuarioComerciante ? '• Conectado' : ''}
            </button>
            <button
              type="button"
              onClick={() => abrirPanel('panel_admin')}
              className="block w-full text-left py-2"
            >
              Panel Admin {usuarioAdmin ? '• Conectado' : ''}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {vista === 'inicio' && (
          <div className="space-y-8 pb-10">
            <section className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-10 px-4 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-center">
                San Nicolás de los Arroyos
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold text-center">
                Comercios y ofertas de San Nicolás
              </h1>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto text-center">
                Descubrí negocios locales, consultá precios y contactá directo por WhatsApp.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => irA('cercanos')}
                  className="bg-white text-orange-600 font-semibold px-4 py-2 rounded text-sm inline-flex items-center gap-1.5 hover:bg-orange-50 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" /> Mapa y cercanía
                </button>
                <button
                  type="button"
                  onClick={() => irA('registro')}
                  className="bg-orange-950/30 border border-white/40 text-white font-semibold px-4 py-2 rounded text-sm inline-flex items-center gap-1.5 hover:bg-orange-950/45 cursor-pointer"
                >
                  <Store className="w-4 h-4" /> Sumá tu local
                </button>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 space-y-3">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-center text-neutral-900">Categorías</h2>
                <p className="text-xs text-neutral-500 text-center">
                  Elegí un rubro para ver productos y servicios disponibles
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {CATEGORIAS.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setCategoria(cat.id);
                      irA('catalogo');
                    }}
                    className="bg-white border border-neutral-200 hover:border-orange-400 rounded p-3 text-center flex flex-col items-center gap-1.5 cursor-pointer transition"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-semibold leading-tight text-center">{cat.nombre}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 space-y-3">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-center text-neutral-900">Comercios</h2>
                <p className="text-xs text-neutral-500 text-center">
                  Locales y emprendimientos adheridos en San Nicolás
                </p>
              </div>
              {cargando ? (
                <div className="bg-white border border-neutral-200 rounded p-6 text-center text-sm text-neutral-500">
                  Cargando comercios de San Nicolás...
                </div>
              ) : comerciosAprobados.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded p-6 text-center text-sm text-neutral-500">
                  Todavía no hay comercios aprobados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comerciosAprobados.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setComIdFicha(c.id);
                        irA('ficha');
                      }}
                      className="bg-white border border-neutral-200 hover:border-orange-400 rounded p-4 cursor-pointer space-y-1.5 text-center transition"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{c.emoji}</span>
                        {c.destacado && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                            Destacado
                          </span>
                        )}
                        <span className="text-xs font-bold text-orange-600">
                          {fmtDist(calcKm(ubicacion.lat, ubicacion.lng, c.lat, c.lng))}
                        </span>
                      </div>
                      <h3 className="font-bold text-neutral-900 text-center">{c.nombre}</h3>
                      <p className="text-xs text-neutral-500 text-center">
                        {c.direccion} • {c.zona}
                      </p>
                      <p className="text-xs text-neutral-600 line-clamp-2 text-center">{c.descripcion}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {vista === 'cercanos' && (
          <VistaCercanos
            comerciosPublicos={comerciosAprobados}
            ubicacion={ubicacion}
            pedirGPS={pedirGPS}
            elegirZona={setUbicacion}
            verComercio={(id) => {
              setComIdFicha(id);
              irA('ficha');
            }}
          />
        )}

        {vista === 'catalogo' && (
          <VistaCatalogo
            productos={productos}
            comercios={comercios}
            categoria={categoria}
            setCategoria={setCategoria}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            verComercio={(id) => {
              setComIdFicha(id);
              irA('ficha');
            }}
          />
        )}

        {vista === 'registro' && (
          <VistaRegistro irA={irA} notificar={notificar} recargar={cargarBD} />
        )}

        {vista === 'acceso' && (
          <VistaAcceso
            destino={destinoLogin}
            onLogin={(u) => {
              if (destinoLogin === 'panel_admin') {
                setUsuarioAdmin(u);
                irA('panel_admin');
              } else {
                setUsuarioComerciante(u);
                irA('panel_comerciante');
              }
            }}
            cancelar={() => irA('inicio')}
          />
        )}

        {vista === 'panel_comerciante' && (
          <VistaComerciante
            comercios={comercios}
            productos={productos}
            recargar={cargarBD}
            usuario={usuarioComerciante}
            salir={() => {
              setUsuarioComerciante(null);
              irA('inicio');
              notificar('Sesión cerrada', 'Saliste del Panel Comerciante.');
            }}
            verComercio={(id) => {
              setComIdFicha(id);
              irA('ficha');
            }}
            notificar={notificar}
          />
        )}

        {vista === 'panel_admin' && (
          <VistaAdmin
            comercios={comercios}
            setComercios={setComercios}
            productos={productos}
            setProductos={setProductos}
            usuario={usuarioAdmin}
            salir={() => {
              setUsuarioAdmin(null);
              irA('inicio');
              notificar('Sesión cerrada', 'Saliste del Panel Administrador.');
            }}
            recargar={cargarBD}
            cargando={cargando}
            verComercio={(id) => {
              setComIdFicha(id);
              irA('ficha');
            }}
            notificar={notificar}
          />
        )}

        {vista === 'ficha' && ficha && (
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
            <button
              type="button"
              onClick={() => irA('inicio')}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>

            <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4 text-center">
              <div className="space-y-1 text-center">
                <h1 className="text-2xl font-bold text-neutral-900 text-center">
                  {ficha.emoji} {ficha.nombre}
                </h1>
                <p className="text-sm text-neutral-500 flex items-center justify-center gap-1 mt-1 text-center">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    {ficha.direccion} • {ficha.zona}, San Nicolás
                  </span>
                </p>
              </div>

              <div className="flex justify-center">
                <a
                  href={waUrl(
                    ficha.whatsapp,
                    `Hola ${ficha.nombre}, te escribo desde Mercado Nicoleño.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded text-sm inline-flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" /> Contactar por WhatsApp
                </a>
              </div>

              <p className="text-sm text-neutral-700 text-center max-w-2xl mx-auto">
                {ficha.descripcion}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="bg-neutral-50 p-3 rounded border flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{ficha.horarios}</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded border flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    {ficha.envioDomicilio
                      ? 'Envío a domicilio disponible'
                      : 'Retiro en el local'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 text-center">
                Productos y servicios publicados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {productos
                  .filter((p) => p.comercioId === ficha.id && p.disponible)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-neutral-200 rounded p-4 flex flex-col justify-between text-center"
                    >
                      <div>
                        {p.imagenUrl && (
                          <img
                            src={p.imagenUrl}
                            alt={p.nombre}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        <h3 className="font-bold text-sm text-center">{p.nombre}</h3>
                        {p.descripcion && (
                          <p className="text-xs text-neutral-500 mt-1 text-center">{p.descripcion}</p>
                        )}
                      </div>
                      <div className="mt-3 pt-2 border-t flex items-center justify-between">
                        <span className="font-bold text-orange-600">{fmtPrecio(p.precio)}</span>
                        <a
                          href={waUrl(
                            ficha.whatsapp,
                            `Hola ${ficha.nombre}, consulto por "${p.nombre}".`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded"
                        >
                          Pedir
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-neutral-200 py-4 px-4 text-center text-xs text-neutral-500">
        Mercado Nicoleño • San Nicolás de los Arroyos
      </footer>
    </div>
  );
}
