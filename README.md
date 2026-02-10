## Endpoints mapping between frontend and backend
UI ROUTES                  API ROUTES
------------------------------------------------
/blogs           →         GET    /api/blogs  
/blogs/write     →         POST   /api/blogs  
/blogs/[slug]    →         GET    /api/blogs/:slug  
/blogs/edit/...  →         PUT    /api/blogs/:slug  
