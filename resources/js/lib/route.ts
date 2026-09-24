/**
 * Helper to build URLs that respect the application base path
 * across local development (root or artisan serve) and production
 * reverse proxy subpaths (/club-tia/).
 */
export function appUrl(path: string = ''): string {
    if (!path || path === '/') {
        const base = typeof window !== 'undefined' && (window as any).__APP_BASE__
            ? (window as any).__APP_BASE__
            : '';
        return base || '/';
    }

    if (path.startsWith('#') || path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const base = typeof window !== 'undefined' && (window as any).__APP_BASE__
        ? (window as any).__APP_BASE__
        : '';

    if (!base) {
        return '/' + cleanPath;
    }

    return `${base.replace(/\/+$/, '')}/${cleanPath}`;
}
