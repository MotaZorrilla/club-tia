<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <base href="{{ rtrim(url('/'), '/') }}/">
    <script>
        (function() {
            var theme = localStorage.getItem('tia_theme');
            if (theme === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }
            window.__APP_BASE__ = "{{ rtrim(url('/'), '/') }}";
        })();
    </script>
    <title inertia>{{ config('app.name', 'Club T.I.A. · Colegio Monte Carmelo') }}</title>
    
    <!-- Core SEO Meta Tags -->
    <meta name="description" content="Portal Educativo del Club de Tecnologías de la Información e Inteligencia Artificial (T.I.A.) de la U.E. Colegio Monte Carmelo en Puerto Ordaz. Formación escolar en Python, visión artificial, desarrollo web y modelos de lenguaje.">
    <meta name="keywords" content="Club TIA, Colegio Monte Carmelo, Inteligencia Artificial escolar, Tecnologías de la Información, Puerto Ordaz, Ciudad Guayana, programación para jóvenes, ConTech, Python, Teachable Machine, NotebookLM, robótica educativa">
    <meta name="author" content="Ing. Héctor Mota Zorrilla">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Geo & Local SEO Tags (Puerto Ordaz, Venezuela) -->
    <meta name="geo.region" content="VE-F">
    <meta name="geo.placename" content="Puerto Ordaz, Ciudad Guayana">
    <meta name="geo.position" content="8.2974;-62.7303">
    <meta name="ICBM" content="8.2974, -62.7303">

    <!-- Open Graph Protocol (Facebook, WhatsApp, LinkedIn, Discord) -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Club T.I.A. · Colegio Monte Carmelo">
    <meta property="og:title" content="Club T.I.A. · Tecnologías de la Información e Inteligencia Artificial">
    <meta property="og:description" content="Living Lab escolar del Colegio Monte Carmelo. Misiones interactivas de IA, desarrollo web, algoritmia, visión computacional y preparación olímpica.">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ url('/og-image.svg') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Club T.I.A. - Tecnologías de la Información e Inteligencia Artificial">
    <meta property="og:locale" content="es_VE">

    <!-- Twitter Cards (X) -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Club T.I.A. · Tecnologías de la Información e Inteligencia Artificial">
    <meta name="twitter:description" content="Living Lab escolar del Colegio Monte Carmelo. Misiones interactivas de IA, programación web, algoritmia y visión computacional.">
    <meta name="twitter:image" content="{{ url('/og-image.svg') }}">

    <!-- Favicon & PWA App Manifest -->
    <link rel="icon" type="image/svg+xml" href="{{ url('/favicon.svg') }}">
    <link rel="apple-touch-icon" href="{{ url('/favicon.svg') }}">
    <link rel="manifest" href="{{ url('/site.webmanifest') }}">
    <meta name="theme-color" content="#8b5cf6">

    <!-- JSON-LD Structured Data: EducationalOrganization & WebSite -->
    <script type="application/ld+json">
    {!! json_encode([
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'EducationalOrganization',
                '@id' => url('/') . '#organization',
                'name' => 'Club T.I.A. - Tecnologías de la Información e Inteligencia Artificial',
                'alternateName' => 'Club TIA Monte Carmelo',
                'url' => url('/'),
                'logo' => url('/favicon.svg'),
                'description' => 'Club escolar de ciencias computacionales e inteligencia artificial de la U.E. Colegio Monte Carmelo.',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => 'Puerto Ordaz',
                    'addressRegion' => 'Estado Bolívar',
                    'addressCountry' => 'VE',
                ],
                'founder' => [
                    '@type' => 'Person',
                    'name' => 'Ing. Héctor Mota Zorrilla',
                    'jobTitle' => 'Facilitador & Mentor Técnico',
                ],
                'parentOrganization' => [
                    '@type' => 'School',
                    'name' => 'U.E. Colegio Monte Carmelo',
                ],
            ],
            [
                '@type' => 'WebSite',
                '@id' => url('/') . '#website',
                'url' => url('/'),
                'name' => 'Club T.I.A. · Portal Educativo',
                'publisher' => [
                    '@id' => url('/') . '#organization',
                ],
                'inLanguage' => 'es-VE',
            ],
        ],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) !!}
    </script>

    <!-- Theme Detection Script (Prevents Theme Flash) -->
    <script>
        try {
            if (localStorage.getItem('tia_theme') === 'light' || (!('tia_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }
        } catch (e) {}
    </script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans selection:bg-purple-500 selection:text-white transition-colors duration-200">
    @inertia
</body>
</html>
