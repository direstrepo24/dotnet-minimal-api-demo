// Azion Edge Function for .NET Minimal API Demo
async function handleRequest(request) {
  try {
    // Get the request path and query
    const pathname = request.url.pathname || '/';
    const search = request.url.search || '';
    
    // Forward the request to the Docker container
    // Note: Azion replaces this URL with the actual container address
    const containerUrl = "http://localhost:8080";
    
    console.log(`Processing request to: ${pathname}${search}`);
    console.log(`Forwarding to: ${containerUrl}${pathname}${search}`);
    
    // Clone the original request
    const requestInit = {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined
    };
    
    // Add additional headers that might help with debugging
    requestInit.headers.set('X-Forwarded-Host', request.headers.get('host') || '');
    requestInit.headers.set('X-Original-URL', request.url.toString());
    
    // Forward the request to the container
    const fullUrl = `${containerUrl}${pathname}${search}`;
    console.log(`Full request URL: ${fullUrl}`);
    
    const response = await fetch(fullUrl, requestInit);
    console.log(`Response status: ${response.status}`);
    
    // Return the response from the container
    return response;
  } catch (error) {
    console.error(`Error in handleRequest: ${error.message}`);
    console.error(error.stack);
    
    // Return an error response with detailed information
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack,
      time: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Export the handler function
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
