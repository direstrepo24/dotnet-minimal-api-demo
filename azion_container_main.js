/**
 * Azion Edge Function para .NET Minimal API
 * 
 * Este script maneja solicitudes entrantes y las delega al contenedor Docker
 * configurado en args.json, que ejecuta la aplicación .NET Minimal API.
 * 
 * Configurado para trabajar tanto con la imagen multi-arquitectura como con la normal.
 */

// Configuración
const DEBUG = true;

/**
 * Maneja todas las solicitudes entrantes
 */
async function handleRequest(request) {
  try {
    if (DEBUG) {
      console.log(`[DEBUG] Request received: ${request.method} ${request.url.pathname}`);
      logHeaders(request);
    }
    
    // En el modelo de contenedor de Azion, simplemente devolver la solicitud
    // hace que Azion la redirija al contenedor configurado en args.json
    return request;
    
  } catch (error) {
    console.error(`[ERROR] handleRequest: ${error.message}`);
    if (DEBUG) console.error(error.stack);
    
    return new Response(JSON.stringify({
      error: error.message,
      time: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Registra los encabezados de la solicitud para debugging
 */
function logHeaders(request) {
  let headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }
  console.log(`[DEBUG] Request headers: ${JSON.stringify(headers)}`);
}

// Registrar un único event listener para el evento 'fetch'
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
