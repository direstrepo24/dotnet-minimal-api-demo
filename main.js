// Azion Edge Function for .NET Minimal API Demo
async function handleRequest(request) {
  try {
    // Forward the request to the Docker container
    const containerUrl = "http://localhost:8080"; // This will be replaced by Azion with the actual container URL
    
    // Clone the original request
    const requestInit = {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined
    };
    
    // Forward the request to the container
    const response = await fetch(containerUrl + request.url.pathname + request.url.search, requestInit);
    
    // Return the response from the container
    return response;
  } catch (error) {
    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Export the handler function
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
