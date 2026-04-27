import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'users', renderMode: RenderMode.Server },
  { path: 'authors', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender }
];
