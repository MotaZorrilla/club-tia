<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="{{ rtrim(url('/'), '/') }}/">
    <title inertia>{{ config('app.name', 'Club T.I.A. · Colegio Monte Carmelo') }}</title>
    <meta name="description" content="Portal Educativo Gamificado del Club de Tecnologías de la Información & Inteligencia Artificial de la U.E. Colegio Monte Carmelo.">

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
