<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mercado Nicoleño — Comercios y Ofertas de San Nicolás</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }

    @keyframes slideLeft {
      0% { opacity: 0; transform: translateX(-48px) scale(0.9); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }

    @keyframes slideRight {
      0% { opacity: 0; transform: translateX(48px) scale(0.9); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }

    @keyframes fusionCentro {
      0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
      55% { transform: scale(1.15); filter: drop-shadow(0 0 22px rgba(255,255,255,0.65)); }
      100% { transform: scale(1.05); filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
    }

    @keyframes fadeSubtitulo {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .mn-letra-m {
      animation: slideLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .mn-letra-n {
      animation: slideRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .mn-fusion-activa {
      animation: fusionCentro 0.5s ease-in-out forwards;
    }

    .mn-subtitulo-intro {
      animation: fadeSubtitulo 0.55s ease-out 0.8s both;
    }
  </style>
</head>
<body class="bg-neutral-50 text-neutral-900 min-h-screen">
  <div
    id="splash-mn"
    class="fixed inset-0 z-50 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 flex flex-col items-center justify-center text-white text-center px-4 transition-opacity duration-500"
  >
    <div id="splash-mn-letras" class="flex items-center justify-center gap-2 text-6xl sm:text-7xl font-black tracking-tight transition-all duration-300">
      <span class="mn-letra-m inline-block">M</span>
      <span class="mn-letra-n inline-block">N</span>
    </div>
    <p class="mn-subtitulo-intro mt-4 w-full text-center text-base sm:text-xl font-extrabold tracking-[0.22em] uppercase text-white">
      Mercado Nicoleño
    </p>
  </div>

  <header class="bg-gradient-to-r from-orange-500 to-amber-500 text-white sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
      <button
        type="button"
        onclick="irA('inicio')"
        class="flex items-center gap-2 shrink-0 hover:opacity-95"
      >
        <span class="w-8 h-8 rounded-lg bg-white text-orange-600 font-black flex items-center justify-center shadow-xs">
          MN
        </span>
        <span class="font-extrabold text-base sm:text-lg tracking-tight">
          Mercado Nicoleño
        </span>
      </button>

      <button
        type="button"
        onclick="toggleMenu()"
        aria-label="Abrir menú"
        class="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-lg font-bold shrink-0"
      >
        ☰
      </button>
    </div>

    <nav
      id="menu-desplegable"
      class="hidden bg-white text-neutral-800 border-t border-orange-400/30 shadow-lg"
    >
      <div class="max-w-6xl mx-auto px-4 py-2.5 flex flex-col gap-1 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onclick="irA('inicio')"
          class="text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-neutral-800 flex items-center gap-2"
        >
          <span>🏠</span>
          <span>Inicio</span>
        </button>
        <button
          type="button"
          onclick="irACategorias()"
          class="text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-neutral-800 flex items-center gap-2"
        >
          <span>🗂️</span>
          <span>Categorías</span>
        </button>
        <button
          type="button"
          onclick="document.getElementById('menu-desplegable')?.classList.add('hidden'); seleccionarCategoria('Farmacia de Turno'); document.getElementById('seccion-farmacias-turno-sn')?.scrollIntoView({ behavior: 'smooth' });"
          class="text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center gap-2"
        >
          <span>✚</span>
          <span>Farmacia de Turno</span>
        </button>
        <button
          type="button"
          onclick="irAMapa()"
          class="text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-neutral-800 flex items-center gap-2"
        >
          <span>📍</span>
          <span>Mapa y cercanía</span>
        </button>
        <button
          type="button"
          onclick="toggleFormularioLocal(true)"
          class="text-left px-3 py-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center gap-2"
        >
          <span>🏪</span>
          <span>Sumá tu local</span>
        </button>
        <div class="border-t border-neutral-100 my-1"></div>
        <button
          type="button"
          onclick="abrirPanel('comerciante')"
          class="text-left px-3 py-2 rounded-lg hover:bg-amber-50 text-amber-800 flex items-center gap-2"
        >
          <span>🧑‍💼</span>
          <span>Panel de Comerciante</span>
        </button>
        <button
          type="button"
          onclick="abrirPanel('admin')"
          class="text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-800 flex items-center gap-2"
        >
          <span>🛡️</span>
          <span>Panel de Administrador</span>
        </button>
      </div>
    </nav>
  </header>

  <section class="bg-gradient-to-b from-orange-500 via-orange-500 to-amber-500 text-white px-4 pt-8 pb-10 text-center">
    <div class="max-w-2xl mx-auto space-y-4">
      <div
        id="barra-clima-portada"
        class="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs font-semibold text-white/90 bg-black/15 px-3 py-1 rounded-full w-fit mx-auto"
      >
        <span id="clima-dia-fecha">Sábado 28/11</span>
        <span aria-hidden="true">·</span>
        <span id="clima-temp-estado">☀️ 21°C · Soleado · San Nicolás</span>
      </div>
      <p class="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-orange-100">
        SAN NICOLÁS DE LOS ARROYOS
      </p>
      <h1
        style="text-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3);"
        class="text-2xl sm:text-4xl font-black tracking-tight leading-tight uppercase"
      >
        COMERCIOS Y OFERTAS DE SAN NICOLÁS
      </h1>
      <p class="text-sm sm:text-base text-orange-50 max-w-md mx-auto leading-relaxed">
        Descubrí negocios locales, consultá precios y contactá directo por WhatsApp.
      </p>

      <div class="pt-2 flex flex-col items-center justify-center gap-2.5">
        <div class="w-full max-w-md bg-white rounded-xl flex items-center overflow-hidden shadow-md ring-1 ring-white/40">
          <input
            id="buscador-input"
            type="text"
            oninput="filtrarComercios()"
            onkeydown="if (event.key === 'Enter') { filtrarComercios(); document.getElementById('seccion-comercios-sn')?.scrollIntoView({ behavior: 'smooth' }); }"
            placeholder="Buscar comercio, rubro o producto..."
            class="w-full px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            onclick="filtrarComercios(); document.getElementById('seccion-comercios-sn')?.scrollIntoView({ behavior: 'smooth' });"
            aria-label="Buscar"
            title="Buscar"
            class="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 active:bg-orange-200 text-orange-600 border-l border-orange-100 flex items-center justify-center shrink-0 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="20" y1="20" x2="16.35" y2="16.35"></line>
            </svg>
          </button>
        </div>

        <button
          type="button"
          onclick="irAMapa()"
          class="w-60 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-2"
        >
          <span>➤</span>
          <span>Mapa y cercanía</span>
        </button>

        <button
          type="button"
          onclick="toggleFormularioLocal()"
          class="w-60 bg-amber-700/85 hover:bg-amber-800 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-2"
        >
          <span>🏪</span>
          <span>Sumá tu local</span>
        </button>
      </div>
    </div>
  </section>

  <main class="max-w-5xl mx-auto px-4 py-7 space-y-8">
    <section
      id="seccion-sumar-local"
      class="hidden bg-white rounded-2xl border border-orange-200 p-4 sm:p-5 space-y-3 shadow-sm"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-base font-extrabold text-neutral-900">Sumá tu local</h2>
        <button
          type="button"
          onclick="toggleFormularioLocal(false)"
          class="text-xs font-bold text-neutral-500 hover:text-neutral-800"
        >
          Cerrar
        </button>
      </div>

      <form onsubmit="guardarLocal(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          id="local-nombre"
          type="text"
          placeholder="Nombre del comercio"
          class="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
        <select
          id="local-rubro"
          class="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm bg-white focus:outline-none focus:border-orange-500"
        ></select>
        <input
          id="local-direccion"
          type="text"
          placeholder="Dirección en San Nicolás (ej.: Mitre 250)"
          class="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
        <input
          id="local-whatsapp"
          type="text"
          placeholder="WhatsApp (ej.: 5493364000199)"
          class="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
        <input
          id="local-descripcion"
          type="text"
          placeholder="Qué ofrecés (productos, horarios, servicios)"
          class="sm:col-span-2 rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
        <div class="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            class="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl"
          >
            Guardar y ubicar en el mapa
          </button>
        </div>
      </form>
    </section>

    <section
      id="panel-comerciante-sn"
      class="hidden bg-white rounded-2xl border border-amber-300 p-4 sm:p-5 space-y-4 shadow-sm"
    >
      <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
            Gestión de Local
          </span>
          <h2 class="text-base sm:text-lg font-extrabold text-neutral-900 mt-1">
            Panel de Comerciante
          </h2>
        </div>
        <button
          type="button"
          onclick="cerrarPaneles()"
          class="text-xs font-bold text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg bg-neutral-100"
        >
          Cerrar
        </button>
      </div>

      <div class="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h3 id="titulo-auth-comerciante" class="text-sm font-extrabold text-neutral-900">
            Ingresar a mi cuenta de comerciante
          </h3>
          <button
            type="button"
            id="btn-cerrar-sesion-comerciante"
            onclick="cerrarSesionComerciante()"
            class="hidden text-xs font-bold text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        <div id="tabs-auth-comerciante" class="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-amber-200">
          <button
            type="button"
            id="tab-ingresar-comerciante"
            onclick="cambiarModoComerciante(false)"
            class="py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white"
          >
            Ya tengo cuenta
          </button>
          <button
            type="button"
            id="tab-crear-comerciante"
            onclick="cambiarModoComerciante(true)"
            class="py-1.5 text-xs font-bold rounded-lg text-neutral-700 hover:bg-neutral-50"
          >
            Crear cuenta nueva
          </button>
        </div>

        <form id="form-auth-comerciante" onsubmit="enviarAuthComerciante(event)" class="space-y-3">
          <div>
            <label for="comerciante-email" class="block text-xs font-bold text-neutral-700 mb-1">
              Correo electrónico real
            </label>
            <input
              id="comerciante-email"
              type="email"
              required
              placeholder="tucomercio@gmail.com"
              class="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div id="grupo-password-comerciante">
            <label id="label-password-comerciante" for="comerciante-password" class="block text-xs font-bold text-neutral-700 mb-1">
              Contraseña única
            </label>
            <div class="relative flex items-center">
              <input
                id="comerciante-password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full rounded-xl border border-neutral-200 bg-white pl-3.5 pr-11 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onclick="togglePassword('comerciante-password')"
                aria-label="Mostrar u ocultar contraseña"
                className="absolute right-2.5 text-neutral-500 hover:text-neutral-800 p-1 rounded-lg text-sm"
              >
                👁️
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              id="btn-recuperar-comerciante"
              onclick="alternarRecuperarComerciante()"
              class="text-xs font-bold text-orange-600 hover:underline"
            >
              ¿Olvidaste tu contraseña? Recuperarla
            </button>
            <span id="nota-aprobacion-comerciante" class="hidden text-[11px] text-neutral-600">
              Requiere aprobación del administrador tras registrarte.
            </span>

            <button
              type="submit"
              id="btn-submit-comerciante"
              class="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl"
            >
              Ingresar
            </button>
          </div>
        </form>
        <p id="error-auth-comerciante" class="hidden text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2"></p>
        <p id="mensaje-auth-comerciante" class="hidden text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2"></p>
      </div>

      <div id="contenido-comerciante-autenticado" class="hidden space-y-3">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs sm:text-sm text-neutral-600">
            Administrá tus locales cargados en San Nicolás o agregá uno nuevo.
          </p>
          <button
            type="button"
            onclick="cerrarPaneles(); toggleFormularioLocal(true);"
            class="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shrink-0"
          >
            + Nuevo local
          </button>
        </div>

        <div id="lista-panel-comerciante" class="space-y-2.5"></div>
      </div>
    </section>

    <section
      id="panel-admin-sn"
      class="hidden bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 space-y-4 shadow-sm"
    >
      <div class="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full">
            Control General
          </span>
          <h2 class="text-base sm:text-lg font-extrabold text-neutral-900 mt-1">
            Panel de Administrador
          </h2>
        </div>
        <button
          type="button"
          onclick="cerrarPaneles()"
          class="text-xs font-bold text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg bg-neutral-100"
        >
          Cerrar
        </button>
      </div>

      <div class="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h3 id="titulo-auth-admin" class="text-sm font-extrabold text-neutral-900">
            Acceso exclusivo de administrador
          </h3>
          <button
            type="button"
            id="btn-cerrar-sesion-admin"
            onclick="cerrarSesionAdmin()"
            class="hidden text-xs font-bold text-red-600 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
        <form id="form-auth-admin" onsubmit="enviarAuthAdmin(event)" class="space-y-3">
          <div>
            <label for="admin-email" class="block text-xs font-bold text-neutral-700 mb-1">
              Correo de administrador
            </label>
            <input
              id="admin-email"
              type="email"
              required
              placeholder="Correo autorizado del administrador"
              class="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          <div id="grupo-password-admin">
            <label for="admin-password" class="block text-xs font-bold text-neutral-700 mb-1">
              Contraseña
            </label>
            <div class="relative flex items-center">
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                class="w-full rounded-xl border border-neutral-200 bg-white pl-3.5 pr-11 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onclick="togglePassword('admin-password')"
                aria-label="Mostrar u ocultar contraseña de administrador"
                class="absolute right-2.5 text-neutral-500 hover:text-neutral-800 p-1 rounded-lg text-sm"
              >
                👁️
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              id="btn-recuperar-admin"
              onclick="alternarRecuperarAdmin()"
              class="text-xs font-bold text-orange-600 hover:underline"
            >
              ¿Olvidaste tu contraseña? Recuperarla
            </button>

            <button
              type="submit"
              id="btn-submit-admin"
              class="bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl"
            >
              Ingresar
            </button>
          </div>
        </form>
        <p id="error-auth-admin" class="hidden text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2"></p>
        <p id="mensaje-auth-admin" class="hidden text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2"></p>
      </div>

      <div id="lista-panel-admin" class="hidden space-y-4"></div>
    </section>

    <section id="seccion-categorias-sn" class="space-y-4">
      <div class="text-center space-y-1">
        <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900">Categorías</h2>
        <p class="text-xs sm:text-sm text-neutral-500">
          Elegí un rubro para ver productos y servicios disponibles
        </p>
        <div id="filtro-activo-barra" class="hidden pt-1">
          <button
            type="button"
            onclick="seleccionarCategoria('Todos')"
            class="text-xs font-bold text-orange-600 hover:underline"
          >
            Mostrando: <span id="filtro-activo-texto"></span> · Ver todas
          </button>
        </div>
      </div>

      <div id="grilla-categorias" class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"></div>
    </section>

    <section
      id="seccion-farmacias-turno-sn"
      class="hidden bg-white rounded-2xl border border-emerald-200 p-4 sm:p-6 space-y-5 shadow-sm"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
        <div>
          <span class="inline-block text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Servicio Público · Guardia 24 hs (08:30 a 08:30)
          </span>
          <h2 class="text-lg sm:text-xl font-extrabold text-neutral-900 mt-1">
            Farmacias de Turno en San Nicolás de los Arroyos
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Esta categoría es exclusivamente informativa para consultar qué farmacias están de guardia hoy.
          </p>
        </div>
        <button
          type="button"
          onclick="seleccionarCategoria('Todos')"
          class="text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg self-start sm:self-center shrink-0"
        >
          ← Volver a rubros
        </button>
      </div>

      <div id="contenido-farmacias-turno" class="space-y-4"></div>
    </section>

    <section id="seccion-comercios-sn" class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-extrabold text-neutral-900">Comercios disponibles</h2>
        <span id="contador-comercios" class="text-xs font-semibold text-neutral-600">0 locales</span>
      </div>

      <div id="grilla-comercios" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
    </section>

    <section
      id="seccion-mapa-san-nicolas"
      class="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 space-y-4"
    >
      <div>
        <h2 class="text-base sm:text-lg font-extrabold text-neutral-900">
          Ubicación en San Nicolás
        </h2>
        <p id="detalle-mapa-texto" class="text-xs sm:text-sm text-neutral-600">
          Tocá "Ver en mapa" en cualquier comercio o farmacia de turno para ver su ubicación.
        </p>
      </div>

      <p
        id="mensaje-estado-mapa"
        class="hidden text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2"
      ></p>

      <div class="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
        <iframe
          id="iframe-mapa-sn"
          title="Mapa de San Nicolás de los Arroyos"
          src="https://maps.google.com/maps?q=San+Nicol%C3%A1s+de+los+Arroyos,+Buenos+Aires,+Argentina&t=m&z=14&output=embed"
          class="w-full h-full border-0"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  </main>

  <script>
    const CATEGORIAS = [
      {
        nombre: 'Carnicería y Verdulería',
        imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Panadería',
        imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Rotisería',
        imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Indumentaria y Calzado',
        imagen: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Ferretería',
        imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Oficios y Servicios',
        imagen: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Veterinaria y Mascotas',
        imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Hogar, Bazar y Deco',
        imagen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Electrónica y Celulares',
        imagen: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80'
      },
      {
        nombre: 'Farmacia de Turno',
        soloTurno: true,
        imagen: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=700&q=80'
      }
    ];

    const TURNOS_FARMACIAS_SN = [
      {
        letra: 'A',
        farmacias: [
          { nombre: 'Farmacia Alberdi', direccion: 'Alberdi 210' },
          { nombre: 'Farmacia Central', direccion: 'Bartolomé Mitre 195' },
          { nombre: 'Farmacia Del Acuerdo', direccion: 'Av. Savio 640' }
        ]
      },
      {
        letra: 'B',
        farmacias: [
          { nombre: 'Farmacia Belgrano', direccion: 'Belgrano 450' },
          { nombre: 'Farmacia Italia', direccion: 'Italia 312' },
          { nombre: 'Farmacia Somisa', direccion: 'Av. Central 1820' }
        ]
      },
      {
        letra: 'C',
        farmacias: [
          { nombre: 'Farmacia Colón', direccion: 'Colón 185' },
          { nombre: 'Farmacia De La Nación', direccion: 'Nación 380' },
          { nombre: 'Farmacia San Cayetano', direccion: 'Av. Falcón 520' }
        ]
      },
      {
        letra: 'D',
        farmacias: [
          { nombre: 'Farmacia Don Bosco', direccion: 'Don Bosco 415' },
          { nombre: 'Farmacia Rivadavia', direccion: 'Rivadavia 290' },
          { nombre: 'Farmacia Santa Teresita', direccion: 'Av. Álvarez 710' }
        ]
      },
      {
        letra: 'E',
        farmacias: [
          { nombre: 'Farmacia El Norte', direccion: 'Pellegrini 330' },
          { nombre: 'Farmacia Moreno', direccion: 'Av. Moreno 465' },
          { nombre: 'Farmacia San Martín', direccion: 'San Martín 120' }
        ]
      },
      {
        letra: 'F',
        farmacias: [
          { nombre: 'Farmacia Cantondebat', direccion: 'Brown 598' },
          { nombre: 'Farmacia Cavara', direccion: 'Necochea 148' },
          { nombre: 'Farmacia Fénix', direccion: 'Garibaldi 281' },
          { nombre: 'Farmacia Frattini', direccion: 'Av. Moreno 108' },
          { nombre: 'Farmacia Prat', direccion: 'Juan Domingo Perón 1093' },
          { nombre: 'Farmacia Zonta', direccion: 'Urquiza 422' }
        ]
      },
      {
        letra: 'G',
        farmacias: [
          { nombre: 'Farmacia Conde', direccion: 'Nación 701' },
          { nombre: 'Farmacia Garaguso', direccion: 'Belgrano 320' },
          { nombre: 'Farmacia Prina', direccion: 'Av. Illia 739' }
        ]
      },
      {
        letra: 'H',
        farmacias: [
          { nombre: 'Farmacia Garibaldi', direccion: 'Garibaldi 540' },
          { nombre: 'Farmacia Mitre', direccion: 'Bartolomé Mitre 480' },
          { nombre: 'Farmacia Oeste', direccion: 'Av. Alberdi 890' }
        ]
      },
      {
        letra: 'I',
        farmacias: [
          { nombre: 'Farmacia Lavalle', direccion: 'Lavalle 260' },
          { nombre: 'Farmacia Sarmiento', direccion: 'Sarmiento 310' },
          { nombre: 'Farmacia Sur', direccion: 'Av. Savio 1420' }
        ]
      },
      {
        letra: 'J',
        farmacias: [
          { nombre: 'Farmacia Ameghino', direccion: 'Ameghino 375' },
          { nombre: 'Farmacia Pellegrini', direccion: 'Pellegrini 610' },
          { nombre: 'Farmacia 9 de Julio', direccion: '9 de Julio 240' }
        ]
      }
    ];

    function construirUrlMapaSN(direccion, nombreLugar) {
      const dirLimpia = (direccion || '').trim();
      const nombreLimpio = (nombreLugar || '').trim();
      if (!dirLimpia && !nombreLimpio) {
        return 'https://maps.google.com/maps?q=San+Nicol%C3%A1s+de+los+Arroyos,+Buenos+Aires,+Argentina&t=m&z=14&output=embed';
      }
      const base = dirLimpia || nombreLimpio;
      const conCiudad = /san nicol[aá]s/i.test(base)
        ? `${base}, Buenos Aires, Argentina`
        : `${base}, San Nicolás de los Arroyos, Buenos Aires, Argentina`;
      const consulta =
        nombreLimpio && !conCiudad.toLowerCase().includes(nombreLimpio.toLowerCase())
          ? `${nombreLimpio}, ${conCiudad}`
          : conCiudad;
      return `https://maps.google.com/maps?q=${encodeURIComponent(consulta)}&t=m&z=17&output=embed`;
    }

    const DIAS_SEMANA_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    function formatearFechaCortaSN(fecha) {
      const diaNombre = DIAS_SEMANA_ES[fecha.getDay()];
      const dd = String(fecha.getDate()).padStart(2, '0');
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      return `${diaNombre} ${dd}/${mm}`;
    }

    function obtenerTurnosFarmaciasHoy(ahora = new Date()) {
      const minutosDelDia = ahora.getHours() * 60 + ahora.getMinutes();
      const antesDe0830 = minutosDelDia < 8 * 60 + 30;

      const inicioJornadaTurno = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      if (antesDe0830) {
        inicioJornadaTurno.setDate(inicioJornadaTurno.getDate() - 1);
      }
      const finJornadaTurno = new Date(inicioJornadaTurno);
      finJornadaTurno.setDate(finJornadaTurno.getDate() + 1);
      const finSiguienteTurno = new Date(finJornadaTurno);
      finSiguienteTurno.setDate(finSiguienteTurno.getDate() + 1);

      const fechaAncla = new Date(2026, 10, 28); // 28/11/2026 -> Turno G (índice 6)
      const diffDias = Math.round((inicioJornadaTurno - fechaAncla) / (1000 * 60 * 60 * 24));
      const total = TURNOS_FARMACIAS_SN.length;
      const indiceVigente = (((6 + diffDias) % total) + total) % total;
      const indiceSiguiente = (indiceVigente + 1) % total;

      const turnoVigente = TURNOS_FARMACIAS_SN[indiceVigente];
      const turnoSiguiente = TURNOS_FARMACIAS_SN[indiceSiguiente];

      return {
        vigente: {
          etiqueta: `Turno ${turnoVigente.letra} · De guardia ahora (hasta ${formatearFechaCortaSN(finJornadaTurno)} a las 08:30 hs)`,
          farmacias: turnoVigente.farmacias
        },
        siguiente: {
          etiqueta: `Turno ${turnoSiguiente.letra} · Próxima guardia (${formatearFechaCortaSN(finJornadaTurno)} 08:30 hs a ${formatearFechaCortaSN(finSiguienteTurno)} 08:30 hs)`,
          farmacias: turnoSiguiente.farmacias
        }
      };
    }

    let rubroSeleccionado = 'Todos';
    let comercios = [];
    let recComerciante = false;
    let regComerciante = false;
    let recAdmin = false;
    let adminAutenticado = false;
    let comercianteAutenticado = '';
    let intentosFallidosComerciante = 0;
    const ADMIN_EMAIL_UNICO = 'hbonaterra@gmail.com';
    const ADMIN_PASSWORD_UNICA = 'renoleta';
    const COMERCIANTES_CUENTAS_KEY = 'mn_comerciantes_cuentas_unicas_v1';
    const DOMINIOS_CORREO_FALSO = [
      'example.com',
      'ejemplo.com',
      'test.com',
      'prueba.com',
      'mailinator.com',
      'tempmail.com',
      'yopmail.com',
      '10minutemail.com',
      'guerrillamail.com',
      'fake.com'
    ];

    function esCorreoRealValido(correo) {
      const limpio = (correo || '').trim().toLowerCase();
      const match = limpio.match(/^[^\s@]+@([^\s@]+\.[^\s@]{2,})$/);
      if (!match) return false;
      return !DOMINIOS_CORREO_FALSO.includes(match[1]);
    }

    function leerCuentasComerciantes() {
      try {
        const raw = JSON.parse(localStorage.getItem(COMERCIANTES_CUENTAS_KEY) || '{}');
        const res = {};
        Object.entries(raw).forEach(([correo, val]) => {
          if (typeof val === 'string') {
            res[correo] = { password: val, aprobado: true };
          } else if (val && typeof val === 'object') {
            res[correo] = {
              password: val.password || '',
              aprobado: Boolean(val.aprobado)
            };
          }
        });
        return res;
      } catch {
        return {};
      }
    }

    function guardarCuentasComerciantes(cuentas) {
      localStorage.setItem(COMERCIANTES_CUENTAS_KEY, JSON.stringify(cuentas));
    }

    window.addEventListener('DOMContentLoaded', () => {
      const splash = document.getElementById('splash-mn');
      const letras = document.getElementById('splash-mn-letras');
      if (!splash) return;
      setTimeout(() => {
        if (letras) {
          letras.classList.remove('gap-2');
          letras.classList.add('gap-0.5', 'mn-fusion-activa');
        }
      }, 650);
      setTimeout(() => {
        splash.classList.add('opacity-0');
        setTimeout(() => splash.remove(), 500);
      }, 1250);
    });

    function toggleMenu() {
      document.getElementById('menu-desplegable')?.classList.toggle('hidden');
    }

    function irA(destino) {
      document.getElementById('menu-desplegable')?.classList.add('hidden');
      cerrarPaneles();
      toggleFormularioLocal(false);
      if (destino === 'inicio') {
        rubroSeleccionado = 'Todos';
        const buscador = document.getElementById('buscador-input');
        if (buscador) buscador.value = '';
        renderizarCategorias();
        filtrarComercios();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function irACategorias() {
      document.getElementById('menu-desplegable')?.classList.add('hidden');
      document.getElementById('seccion-categorias-sn')?.scrollIntoView({ behavior: 'smooth' });
    }

    function irAMapa() {
      document.getElementById('menu-desplegable')?.classList.add('hidden');
      document.getElementById('seccion-mapa-san-nicolas')?.scrollIntoView({ behavior: 'smooth' });
    }

    function toggleFormularioLocal(forzar) {
      document.getElementById('menu-desplegable')?.classList.add('hidden');
      const sec = document.getElementById('seccion-sumar-local');
      if (!sec) return;

      const quiereAbrir = typeof forzar === 'boolean' ? forzar : sec.classList.contains('hidden');
      if (quiereAbrir && !comercianteAutenticado) {
        sec.classList.add('hidden');
        abrirPanel('comerciante');
        const err = document.getElementById('error-auth-comerciante');
        if (err) {
          err.textContent =
            'Para sumar tu local primero iniciá sesión con tu cuenta de comerciante aprobada (o creala y esperá la aprobación del administrador).';
          err.classList.remove('hidden');
        }
        return;
      }

      if (typeof forzar === 'boolean') {
        sec.classList.toggle('hidden', !forzar);
      } else {
        sec.classList.toggle('hidden');
      }
    }

    function abrirPanel(tipo) {
      document.getElementById('menu-desplegable')?.classList.add('hidden');
      toggleFormularioLocal(false);
      document.getElementById('panel-comerciante-sn')?.classList.toggle('hidden', tipo !== 'comerciante');
      document.getElementById('panel-admin-sn')?.classList.toggle('hidden', tipo !== 'admin');
      renderizarPaneles();
    }

    function cerrarPaneles() {
      document.getElementById('panel-comerciante-sn')?.classList.add('hidden');
      document.getElementById('panel-admin-sn')?.classList.add('hidden');
    }

    function togglePassword(inputId) {
      const input = document.getElementById(inputId);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    }

    function cambiarModoComerciante(crearCuenta) {
      regComerciante = Boolean(crearCuenta);
      recComerciante = false;
      intentosFallidosComerciante = 0;

      const tabIng = document.getElementById('tab-ingresar-comerciante');
      const tabCrear = document.getElementById('tab-crear-comerciante');
      const titulo = document.getElementById('titulo-auth-comerciante');
      const label = document.getElementById('label-password-comerciante');
      const input = document.getElementById('comerciante-password');
      const btnRec = document.getElementById('btn-recuperar-comerciante');
      const notaAprob = document.getElementById('nota-aprobacion-comerciante');
      const btnSub = document.getElementById('btn-submit-comerciante');
      const msg = document.getElementById('mensaje-auth-comerciante');
      const err = document.getElementById('error-auth-comerciante');

      if (msg) msg.classList.add('hidden');
      if (err) err.classList.add('hidden');
      if (input) {
        input.value = '';
        input.placeholder = '••••••••';
      }
      if (label) label.textContent = 'Contraseña única';

      if (tabIng && tabCrear) {
        tabIng.className = !regComerciante
          ? 'py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white'
          : 'py-1.5 text-xs font-bold rounded-lg text-neutral-700 hover:bg-neutral-50';
        tabCrear.className = regComerciante
          ? 'py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white'
          : 'py-1.5 text-xs font-bold rounded-lg text-neutral-700 hover:bg-neutral-50';
      }

      if (titulo) {
        titulo.textContent = regComerciante
          ? 'Crear cuenta única de comerciante'
          : 'Ingresar a mi cuenta de comerciante';
      }
      if (btnRec) {
        btnRec.classList.toggle('hidden', regComerciante);
        btnRec.textContent = '¿Olvidaste tu contraseña? Recuperarla';
      }
      if (notaAprob) {
        notaAprob.classList.toggle('hidden', !regComerciante);
      }
      if (btnSub) {
        btnSub.textContent = regComerciante ? 'Crear cuenta' : 'Ingresar';
      }
    }

    function alternarRecuperarComerciante() {
      recComerciante = !recComerciante;
      intentosFallidosComerciante = 0;
      const tabs = document.getElementById('tabs-auth-comerciante');
      const titulo = document.getElementById('titulo-auth-comerciante');
      const label = document.getElementById('label-password-comerciante');
      const input = document.getElementById('comerciante-password');
      const btnRec = document.getElementById('btn-recuperar-comerciante');
      const btnSub = document.getElementById('btn-submit-comerciante');
      const msg = document.getElementById('mensaje-auth-comerciante');
      const err = document.getElementById('error-auth-comerciante');
      if (msg) msg.classList.add('hidden');
      if (err) err.classList.add('hidden');
      if (tabs) tabs.classList.toggle('hidden', recComerciante);
      if (input) input.value = '';
      if (titulo) {
        titulo.textContent = recComerciante
          ? 'Recuperar contraseña de comerciante'
          : 'Ingresar a mi cuenta de comerciante';
      }
      if (label) {
        label.textContent = recComerciante ? 'Nueva contraseña única' : 'Contraseña única';
      }
      if (input) {
        input.placeholder = recComerciante ? 'Escribí tu nueva contraseña' : '••••••••';
      }
      if (btnRec) {
        btnRec.textContent = recComerciante
          ? '← Volver a iniciar sesión'
          : '¿Olvidaste tu contraseña? Recuperarla';
      }
      if (btnSub) {
        btnSub.textContent = recComerciante ? 'Guardar nueva contraseña' : 'Ingresar';
      }
    }

    function cerrarSesionComerciante() {
      comercianteAutenticado = '';
      document.getElementById('tabs-auth-comerciante')?.classList.remove('hidden');
      document.getElementById('form-auth-comerciante')?.classList.remove('hidden');
      document.getElementById('btn-cerrar-sesion-comerciante')?.classList.add('hidden');
      document.getElementById('contenido-comerciante-autenticado')?.classList.add('hidden');
      const pass = document.getElementById('comerciante-password');
      if (pass) pass.value = '';
      const err = document.getElementById('error-auth-comerciante');
      if (err) err.classList.add('hidden');
      const msg = document.getElementById('mensaje-auth-comerciante');
      if (msg) {
        msg.textContent = 'Sesión de comerciante cerrada.';
        msg.classList.remove('hidden');
      }
    }

    function enviarAuthComerciante(e) {
      e.preventDefault();
      const email = (document.getElementById('comerciante-email')?.value || '').trim().toLowerCase();
      const password = document.getElementById('comerciante-password')?.value || '';
      const msg = document.getElementById('mensaje-auth-comerciante');
      const err = document.getElementById('error-auth-comerciante');
      if (!email || !msg || !err) return;

      err.classList.add('hidden');
      msg.classList.add('hidden');

      if (email === ADMIN_EMAIL_UNICO) {
        err.textContent = 'Este correo corresponde al administrador. Ingresá desde el Panel de Administrador.';
        err.classList.remove('hidden');
        return;
      }

      if (!esCorreoRealValido(email)) {
        err.textContent = 'Ingresá un correo electrónico real y válido (ej.: tunombre@gmail.com).';
        err.classList.remove('hidden');
        return;
      }

      const cuentas = leerCuentasComerciantes();

      if (recComerciante) {
        if (!cuentas[email]) {
          err.textContent = 'No existe una cuenta registrada con ese correo de comerciante.';
          err.classList.remove('hidden');
          return;
        }
        if (!password.trim() || password.trim().length < 4) {
          err.textContent = 'Ingresá una nueva contraseña única de al menos 4 caracteres.';
          err.classList.remove('hidden');
          return;
        }
        cuentas[email].password = password;
        guardarCuentasComerciantes(cuentas);
        alternarRecuperarComerciante();
        msg.textContent = `Contraseña actualizada para ${email}. Ya podés iniciar sesión con tu nueva clave.`;
        msg.classList.remove('hidden');
        return;
      }

      if (!password.trim() || password.trim().length < 4) {
        err.textContent = 'Ingresá tu contraseña única (mínimo 4 caracteres).';
        err.classList.remove('hidden');
        return;
      }

      if (regComerciante) {
        if (cuentas[email]) {
          err.textContent = 'Ya existe una cuenta registrada con este correo. Tocá "Ya tengo cuenta" para ingresar.';
          err.classList.remove('hidden');
          return;
        }
        cuentas[email] = { password, aprobado: false };
        guardarCuentasComerciantes(cuentas);
        cambiarModoComerciante(false);
        msg.textContent = `Cuenta creada para ${email}. Quedó pendiente de aprobación por el administrador antes de poder ingresar.`;
        msg.classList.remove('hidden');
        renderizarPaneles();
        return;
      }

      const cuenta = cuentas[email];
      if (!cuenta) {
        err.textContent = 'Todavía no creaste una cuenta con este correo. Tocá "Crear cuenta nueva" para registrarte.';
        err.classList.remove('hidden');
        return;
      }

      if (cuenta.password !== password) {
        intentosFallidosComerciante += 1;
        err.textContent =
          `Contraseña incorrecta (intento ${intentosFallidosComerciante}). Podés volver a intentarlo las veces que quieras o elegir "¿Olvidaste tu contraseña? Recuperarla".`;
        err.classList.remove('hidden');
        return;
      }

      if (!cuenta.aprobado) {
        intentosFallidosComerciante = 0;
        err.textContent = `Tu cuenta (${email}) ya fue creada, pero todavía está pendiente de aprobación por el administrador.`;
        err.classList.remove('hidden');
        return;
      }

      intentosFallidosComerciante = 0;
      comercianteAutenticado = email;
      document.getElementById('tabs-auth-comerciante')?.classList.add('hidden');
      document.getElementById('form-auth-comerciante')?.classList.add('hidden');
      document.getElementById('btn-cerrar-sesion-comerciante')?.classList.remove('hidden');
      document.getElementById('contenido-comerciante-autenticado')?.classList.remove('hidden');
      msg.textContent = `Sesión activa como comerciante aprobado (${email}).`;
      msg.classList.remove('hidden');
      renderizarPaneles();
    }

    function alternarRecuperarAdmin() {
      recAdmin = !recAdmin;
      const titulo = document.getElementById('titulo-auth-admin');
      const grupoPass = document.getElementById('grupo-password-admin');
      const btnRec = document.getElementById('btn-recuperar-admin');
      const btnSub = document.getElementById('btn-submit-admin');
      const msg = document.getElementById('mensaje-auth-admin');
      const err = document.getElementById('error-auth-admin');
      if (msg) msg.classList.add('hidden');
      if (err) err.classList.add('hidden');
      if (titulo) {
        titulo.textContent = recAdmin
          ? 'Recuperar contraseña de administrador'
          : 'Acceso exclusivo de administrador';
      }
      if (grupoPass) grupoPass.classList.toggle('hidden', recAdmin);
      if (btnRec) {
        btnRec.textContent = recAdmin
          ? '← Volver a iniciar sesión'
          : '¿Olvidaste tu contraseña? Recuperarla';
      }
      if (btnSub) btnSub.textContent = recAdmin ? 'Enviar recuperación' : 'Ingresar';
    }

    function cerrarSesionAdmin() {
      adminAutenticado = false;
      document.getElementById('form-auth-admin')?.classList.remove('hidden');
      document.getElementById('btn-cerrar-sesion-admin')?.classList.add('hidden');
      document.getElementById('lista-panel-admin')?.classList.add('hidden');
      const pass = document.getElementById('admin-password');
      if (pass) pass.value = '';
      const err = document.getElementById('error-auth-admin');
      if (err) err.classList.add('hidden');
      const msg = document.getElementById('mensaje-auth-admin');
      if (msg) {
        msg.textContent = 'Sesión de administrador cerrada.';
        msg.classList.remove('hidden');
      }
    }

    function enviarAuthAdmin(e) {
      e.preventDefault();
      const email = (document.getElementById('admin-email')?.value || '').trim().toLowerCase();
      const password = document.getElementById('admin-password')?.value || '';
      const msg = document.getElementById('mensaje-auth-admin');
      const err = document.getElementById('error-auth-admin');
      if (!msg || !err) return;

      err.classList.add('hidden');
      msg.classList.add('hidden');

      if (email !== ADMIN_EMAIL_UNICO) {
        err.textContent =
          'Acceso denegado: este panel está habilitado únicamente para la cuenta principal del administrador.';
        err.classList.remove('hidden');
        return;
      }

      if (recAdmin) {
        msg.textContent = `Enviamos las instrucciones de recuperación al correo autorizado (${ADMIN_EMAIL_UNICO}).`;
        msg.classList.remove('hidden');
        return;
      }

      if (!password.trim()) {
        err.textContent = 'Ingresá la contraseña de administrador.';
        err.classList.remove('hidden');
        return;
      }

      if (password !== ADMIN_PASSWORD_UNICA) {
        err.textContent = 'Contraseña incorrecta para la cuenta de administrador.';
        err.classList.remove('hidden');
        return;
      }

      adminAutenticado = true;
      document.getElementById('form-auth-admin')?.classList.add('hidden');
      document.getElementById('btn-cerrar-sesion-admin')?.classList.remove('hidden');
      document.getElementById('lista-panel-admin')?.classList.remove('hidden');
      msg.textContent = `Sesión activa como único administrador autorizado (${ADMIN_EMAIL_UNICO}).`;
      msg.classList.remove('hidden');
      renderizarPaneles();
    }

    function aprobarCuentaComerciante(correo, aprobado) {
      const cuentas = leerCuentasComerciantes();
      if (!cuentas[correo]) return;
      cuentas[correo].aprobado = Boolean(aprobado);
      guardarCuentasComerciantes(cuentas);
      if (!aprobado && comercianteAutenticado === correo) {
        cerrarSesionComerciante();
      }
      renderizarPaneles();
    }

    function eliminarCuentaComerciante(correo) {
      const cuentas = leerCuentasComerciantes();
      delete cuentas[correo];
      guardarCuentasComerciantes(cuentas);
      if (comercianteAutenticado === correo) {
        cerrarSesionComerciante();
      }
      renderizarPaneles();
    }

    function seleccionarCategoria(nombre) {
      rubroSeleccionado = nombre;
      renderizarCategorias();
      filtrarComercios();
      if (nombre === 'Farmacia de Turno') {
        document.getElementById('seccion-farmacias-turno-sn')?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function renderizarFarmaciasTurno() {
      const cont = document.getElementById('contenido-farmacias-turno');
      if (!cont) return;

      const turnosHoy = obtenerTurnosFarmaciasHoy(new Date());

      const renderGrupo = (grupo, esActivo) => `
        <div class="space-y-3 ${!esActivo ? 'pt-3 border-t border-neutral-100' : ''}">
          <div class="flex items-center gap-2">
            ${esActivo ? '<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>' : ''}
            <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wide ${
              esActivo ? 'text-emerald-800' : 'text-neutral-800'
            }">
              ${grupo.etiqueta}
            </h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${grupo.farmacias
              .map(
                (f) => `
                <div class="rounded-xl border ${
                  esActivo ? 'border-emerald-200 bg-emerald-50/40' : 'border-neutral-200 bg-neutral-50'
                } p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-extrabold text-neutral-900">${f.nombre}</p>
                    <p class="text-xs text-neutral-600">${f.direccion}</p>
                  </div>
                  <button
                    type="button"
                    onclick="seleccionarDireccionEnMapa('${f.nombre.replace(/'/g, "\\'")}', '${f.direccion.replace(/'/g, "\\'")}'); mostrarMensajeMapa('Farmacia de turno ubicada en el mapa: ${f.nombre.replace(/'/g, "\\'")} (${f.direccion.replace(/'/g, "\\'")})'); irAMapa();"
                    class="text-xs font-bold ${
                      esActivo
                        ? 'text-emerald-700 bg-white hover:bg-emerald-100 border-emerald-200'
                        : 'text-orange-700 bg-white hover:bg-orange-50 border-neutral-200'
                    } border px-3 py-1.5 rounded-lg shrink-0"
                  >
                    Ver en mapa
                  </button>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      `;

      cont.innerHTML =
        renderGrupo(turnosHoy.vigente, true) +
        renderGrupo(turnosHoy.siguiente, false);
    }

    setInterval(() => {
      if (rubroSeleccionado === 'Farmacia de Turno') {
        renderizarFarmaciasTurno();
      }
    }, 60000);

    function renderizarCategorias() {
      const select = document.getElementById('local-rubro');
      if (select && select.options.length === 0) {
        CATEGORIAS.filter((cat) => !cat.soloTurno).forEach((cat) => {
          const opt = document.createElement('option');
          opt.value = cat.nombre;
          opt.textContent = cat.nombre;
          select.appendChild(opt);
        });
      }

      const barra = document.getElementById('filtro-activo-barra');
      const textoBarra = document.getElementById('filtro-activo-texto');
      if (barra && textoBarra) {
        if (rubroSeleccionado !== 'Todos') {
          textoBarra.textContent = rubroSeleccionado;
          barra.classList.remove('hidden');
        } else {
          barra.classList.add('hidden');
        }
      }

      const grilla = document.getElementById('grilla-categorias');
      if (!grilla) return;

      grilla.innerHTML = CATEGORIAS.map((cat) => {
        const activa = rubroSeleccionado === cat.nombre;
        const bordeClase = activa
          ? cat.soloTurno
            ? 'border-emerald-600 ring-2 ring-emerald-200'
            : 'border-orange-500 ring-2 ring-orange-200'
          : cat.soloTurno
            ? 'border-emerald-200 hover:border-emerald-400'
            : 'border-neutral-200 hover:border-orange-300';
        return `
          <button
            type="button"
            onclick="seleccionarCategoria('${activa ? 'Todos' : cat.nombre.replace(/'/g, "\\'")}')"
            class="bg-white rounded-xl border overflow-hidden text-center flex flex-col transition-transform hover:-translate-y-0.5 ${bordeClase}"
          >
            <div class="h-28 sm:h-32 w-full overflow-hidden bg-neutral-100 relative">
              <img src="${cat.imagen}" alt="${cat.nombre}" class="w-full h-full object-cover" />
              ${
                cat.soloTurno
                  ? '<span class="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">Solo turno</span>'
                  : ''
              }
            </div>
            <div class="p-2.5 sm:p-3 flex-1 flex items-center justify-center">
              <span class="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">${cat.nombre}</span>
            </div>
          </button>
        `;
      }).join('');
    }

    function filtrarComercios() {
      const secFarmacia = document.getElementById('seccion-farmacias-turno-sn');
      const secComercios = document.getElementById('seccion-comercios-sn');
      const esFarmacia = rubroSeleccionado === 'Farmacia de Turno';

      if (secFarmacia) secFarmacia.classList.toggle('hidden', !esFarmacia);
      if (secComercios) secComercios.classList.toggle('hidden', esFarmacia);

      if (esFarmacia) {
        renderizarFarmaciasTurno();
        return;
      }

      const texto = (document.getElementById('buscador-input')?.value || '').trim().toLowerCase();
      const visibles = comercios.filter((c) => {
        const okRubro = rubroSeleccionado === 'Todos' || c.rubro === rubroSeleccionado;
        const okTexto =
          !texto || `${c.nombre} ${c.rubro} ${c.direccion} ${c.descripcion}`.toLowerCase().includes(texto);
        return okRubro && okTexto;
      });

      const contador = document.getElementById('contador-comercios');
      if (contador) {
        contador.textContent = `${visibles.length} ${visibles.length === 1 ? 'local' : 'locales'}`;
      }

      const grilla = document.getElementById('grilla-comercios');
      if (!grilla) return;

      if (visibles.length === 0) {
        grilla.innerHTML = `
          <div class="md:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 text-center space-y-2">
            <p class="font-bold text-neutral-800">Todavía no hay comercios cargados</p>
            <p class="text-sm text-neutral-500">
              Usá el botón "Sumá tu local" para cargar el primer comercio y ubicarlo en el mapa.
            </p>
          </div>
        `;
        return;
      }

      grilla.innerHTML = visibles
        .map(
          (c) => `
          <article class="bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col justify-between">
            <div>
              <div class="h-44 w-full overflow-hidden bg-neutral-100">
                <img src="${c.imagen}" alt="${c.nombre}" class="w-full h-full object-cover" />
              </div>
              <div class="p-4 space-y-2">
                <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full">
                  ${c.rubro}
                </span>
                <h3 class="text-base font-extrabold text-neutral-900">${c.nombre}</h3>
                <p class="text-xs font-medium text-neutral-500">${c.direccion}</p>
                <p class="text-sm text-neutral-600">${c.descripcion}</p>
              </div>
            </div>
            <div class="px-4 py-3 border-t border-neutral-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onclick="seleccionarDireccionEnMapa('${c.nombre.replace(/'/g, "\\'")}', '${c.direccion.replace(/'/g, "\\'")}'); irAMapa();"
                class="text-xs font-bold text-orange-600 hover:underline"
              >
                Ver en mapa
              </button>
              <a
                href="https://wa.me/${c.whatsapp}?text=${encodeURIComponent(`Hola ${c.nombre}, los vi en Mercado Nicoleño.`)}"
                target="_blank"
                rel="noreferrer"
                class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg"
              >
                WhatsApp
              </a>
            </div>
          </article>
        `
        )
        .join('');
    }

    function guardarLocal(e) {
      e.preventDefault();
      const nombre = (document.getElementById('local-nombre')?.value || '').trim();
      const rubro = document.getElementById('local-rubro')?.value || CATEGORIAS[0].nombre;
      const direccion = (document.getElementById('local-direccion')?.value || '').trim();
      const whatsapp = (document.getElementById('local-whatsapp')?.value || '').trim() || '5493364000199';
      const descripcion =
        (document.getElementById('local-descripcion')?.value || '').trim() ||
        'Comercio local de San Nicolás de los Arroyos.';

      if (!nombre || !direccion) {
        mostrarMensajeMapa('Completá el nombre del local y su dirección en San Nicolás.');
        irAMapa();
        return;
      }

      const cat = CATEGORIAS.find((item) => item.nombre === rubro) || CATEGORIAS[0];
      const nuevo = {
        id: String(Date.now()),
        nombre,
        rubro,
        direccion,
        whatsapp,
        descripcion,
        imagen: cat.imagen
      };

      comercios.unshift(nuevo);
      document.getElementById('local-nombre').value = '';
      document.getElementById('local-direccion').value = '';
      document.getElementById('local-descripcion').value = '';
      toggleFormularioLocal(false);
      filtrarComercios();
      renderizarPaneles();
      seleccionarDireccionEnMapa(nuevo.nombre, nuevo.direccion);
      mostrarMensajeMapa(`Local agregado y ubicado en el mapa: ${nuevo.direccion}`);
      irAMapa();
    }

    function eliminarComercio(id) {
      comercios = comercios.filter((c) => c.id !== id);
      filtrarComercios();
      renderizarPaneles();
    }

    function seleccionarDireccionEnMapa(nombre, direccion) {
      const detalle = document.getElementById('detalle-mapa-texto');
      const iframe = document.getElementById('iframe-mapa-sn');
      if (detalle) detalle.textContent = `Ubicación: ${nombre} — ${direccion}`;
      if (iframe) {
        iframe.title = `Mapa de ${direccion}`;
        iframe.src = construirUrlMapaSN(direccion, nombre);
      }
    }

    function mostrarMensajeMapa(texto) {
      const msg = document.getElementById('mensaje-estado-mapa');
      if (!msg) return;
      msg.textContent = texto;
      msg.classList.remove('hidden');
    }

    function renderizarPaneles() {
      const listaCom = document.getElementById('lista-panel-comerciante');
      const contCom = document.getElementById('contenido-comerciante-autenticado');
      if (contCom) {
        contCom.classList.toggle('hidden', !comercianteAutenticado);
      }
      if (listaCom) {
        listaCom.innerHTML = comercios.length
          ? comercios
              .map(
                (c) => `
                <div class="flex items-center justify-between gap-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div>
                    <p class="text-sm font-extrabold text-neutral-900">${c.nombre}</p>
                    <p class="text-xs text-neutral-600">${c.rubro} · ${c.direccion}</p>
                  </div>
                  <button
                    type="button"
                    onclick="eliminarComercio('${c.id}')"
                    class="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    Quitar
                  </button>
                </div>
              `
              )
              .join('')
          : `<p class="text-xs text-neutral-500 text-center py-3">Aún no hay comercios cargados.</p>`;
      }

      const listaAdmin = document.getElementById('lista-panel-admin');
      if (listaAdmin) {
        listaAdmin.classList.toggle('hidden', !adminAutenticado);
        if (!adminAutenticado) {
          listaAdmin.innerHTML = '';
          return;
        }
        const cuentasEntries = Object.entries(leerCuentasComerciantes());
        const bloqueCuentas = `
          <div class="space-y-2">
            <h3 class="text-sm font-extrabold text-neutral-900">
              Cuentas de comerciantes (${cuentasEntries.length})
            </h3>
            ${
              cuentasEntries.length
                ? cuentasEntries
                    .map(
                      ([correo, datos]) => `
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50">
                        <div>
                          <p class="text-sm font-extrabold text-neutral-900">${correo}</p>
                          <span class="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            datos.aprobado
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }">
                            ${datos.aprobado ? 'Aprobada' : 'Pendiente de aprobación'}
                          </span>
                        </div>
                        <div class="flex items-center gap-2">
                          ${
                            !datos.aprobado
                              ? `<button type="button" onclick="aprobarCuentaComerciante('${correo.replace(/'/g, "\\'")}', true)" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Aprobar cuenta</button>`
                              : `<button type="button" onclick="aprobarCuentaComerciante('${correo.replace(/'/g, "\\'")}', false)" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200">Suspender</button>`
                          }
                          <button type="button" onclick="eliminarCuentaComerciante('${correo.replace(/'/g, "\\'")}')" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700">Eliminar</button>
                        </div>
                      </div>
                    `
                    )
                    .join('')
                : `<p class="text-xs text-neutral-500 text-center py-3 bg-neutral-50 rounded-xl border border-neutral-200">Todavía no hay comerciantes registrados esperando aprobación.</p>`
            }
          </div>
        `;

        const bloqueComercios = `
          <div class="space-y-2 pt-2 border-t border-neutral-100">
            <h3 class="text-sm font-extrabold text-neutral-900">
              Comercios publicados (${comercios.length})
            </h3>
            ${
              comercios.length
                ? comercios
                    .map(
                      (c) => `
                      <div class="flex items-center justify-between gap-2 p-3 rounded-xl border border-neutral-200 bg-neutral-50">
                        <div>
                          <p class="text-sm font-extrabold text-neutral-900">${c.nombre}</p>
                          <p class="text-xs text-neutral-500">${c.rubro} · ${c.direccion} · WhatsApp: ${c.whatsapp}</p>
                        </div>
                        <button
                          type="button"
                          onclick="eliminarComercio('${c.id}')"
                          class="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    `
                    )
                    .join('')
                : `<p class="text-xs text-neutral-500 text-center py-3 bg-neutral-50 rounded-xl border border-neutral-200">No hay comercios registrados para moderar todavía.</p>`
            }
          </div>
        `;

        listaAdmin.innerHTML = bloqueCuentas + bloqueComercios;
      }
    }

    renderizarCategorias();
    filtrarComercios();

    function describirClimaWmoCelsius(codigo) {
      if (codigo === 0) return { icono: '☀️', estado: 'Soleado' };
      if (codigo === 1 || codigo === 2) return { icono: '🌤️', estado: 'Algo nublado' };
      if (codigo === 3) return { icono: '☁️', estado: 'Nublado' };
      if (codigo === 45 || codigo === 48) return { icono: '🌫️', estado: 'Neblina' };
      if ((codigo >= 51 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) {
        return { icono: '🌧️', estado: 'Lluvia' };
      }
      if (codigo >= 95) return { icono: '⛈️', estado: 'Tormenta' };
      return { icono: '🌡️', estado: 'Despejado' };
    }

    function obtenerClimaRespaldoCelsiusSN(fecha = new Date()) {
      const mmdd = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
      const pronosticoDiario = {
        '11-28': { mat: 21, tar: 33, noc: 25, icono: '☀️', estado: 'Soleado' },
        '11-29': { mat: 23, tar: 33, noc: 25, icono: '☁️', estado: 'Nublado' },
        '11-30': { mat: 24, tar: 35, noc: 26, icono: '☀️', estado: 'Soleado' },
        '12-01': { mat: 23, tar: 27, noc: 22, icono: '🌧️', estado: 'Lluvia' },
        '12-02': { mat: 19, tar: 24, noc: 18, icono: '☁️', estado: 'Nublado' },
        '12-03': { mat: 17, tar: 25, noc: 17, icono: '🌤️', estado: 'Algo nublado' },
        '12-04': { mat: 20, tar: 28, noc: 21, icono: '🌤️', estado: 'Algo nublado' }
      };
      const base = pronosticoDiario[mmdd] || { mat: 22, tar: 30, noc: 23, icono: '☀️', estado: 'Soleado' };
      const hora = fecha.getHours();
      const tempC = hora < 11 ? base.mat : hora < 19 ? base.tar : base.noc;
      return { temperaturaC: tempC, icono: base.icono, estado: base.estado };
    }

    function pintarClimaCelsiusEnPortada(infoClima) {
      const elClima = document.getElementById('clima-temp-estado');
      if (!elClima) return;
      elClima.textContent = `${infoClima.icono} ${infoClima.temperaturaC}°C · ${infoClima.estado} · San Nicolás`;
    }

    async function actualizarClimaCelsiusSN() {
      try {
        const url =
          'https://api.open-meteo.com/v1/forecast?latitude=-33.3335&longitude=-60.211&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=America%2FArgentina%2FBuenos_Aires';
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Error de red');
        const data = await resp.json();
        const tempActual = data?.current?.temperature_2m;
        const codigoWmo = data?.current?.weather_code;
        if (typeof tempActual === 'number' && !Number.isNaN(tempActual)) {
          const desc = describirClimaWmoCelsius(Number(codigoWmo));
          pintarClimaCelsiusEnPortada({
            temperaturaC: Math.round(tempActual),
            icono: desc.icono,
            estado: desc.estado
          });
          return;
        }
      } catch {
        // Respaldo automático en grados Celsius si no hay conexión
      }
      pintarClimaCelsiusEnPortada(obtenerClimaRespaldoCelsiusSN(new Date()));
    }

    function actualizarDiaFechaClimaPortada() {
      const el = document.getElementById('clima-dia-fecha');
      if (!el) return;
      const ahora = new Date();
      const dia = DIAS_SEMANA_ES[ahora.getDay()];
      const dd = String(ahora.getDate()).padStart(2, '0');
      const mm = String(ahora.getMonth() + 1).padStart(2, '0');
      el.textContent = `${dia.charAt(0).toUpperCase() + dia.slice(1)} ${dd}/${mm}`;
    }

    actualizarDiaFechaClimaPortada();
    actualizarClimaCelsiusSN();
    setInterval(actualizarDiaFechaClimaPortada, 60000);
    setInterval(actualizarClimaCelsiusSN, 30 * 60 * 1000);
  </script>
</body>
</html>
