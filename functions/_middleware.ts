export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  
  // For JavaScript files, set correct MIME type BEFORE calling next()
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
    const response = await context.next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Content-Type', 'application/javascript; charset=utf-8');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
  
  // For CSS files
  if (url.pathname.endsWith('.css')) {
    const response = await context.next();
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Content-Type', 'text/css; charset=utf-8');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
  
  return context.next();
}
