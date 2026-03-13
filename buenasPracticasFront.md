Buenas prácticas para un frontend moderno con React
🧱 Arquitectura clara
- Componentes pequeños y reutilizables.
- Hooks personalizados para lógica compartida.
- Carpetas organizadas por dominio, no por tipo:
/users
  - UserList.jsx
  - useUsers.js
  - userService.js

⚡ Rendimiento
- Usa React.memo cuando tenga sentido.
- Suspense + lazy loading para rutas pesadas.
- Evita renders innecesarios con dependencias bien definidas.
🧪 Testing
- Tests de componentes con React Testing Library.
- Tests de lógica con Jest.
🎯 UX y accesibilidad
- Usa roles ARIA.
- Navegación accesible con teclado.
- Feedback inmediato en formularios.
🧩 Estado global bien gestionado
- Usa Zustand, Redux Toolkit o Jotai según complejidad.
- Evita sobreusar Redux si no lo necesitas.
📡 Comunicación con la API
- Usa React Query o SWR para manejo de datos remoto.
- Cache, revalidación, sincronización automática… todo gratis.

🧠 Consejos de senior que marcan la diferencia
🔍 Piensa en escalabilidad desde el principio
No programes solo para que funcione hoy. Programa para que funcione cuando tengas 10x más tráfico.
🧭 Escribe código para humanos, no para máquinas
El código se lee 10 veces más de lo que se escribe.
🧰 Automatiza todo lo repetitivo
- Scripts de deploy
- Linter + Prettier
- CI/CD con GitHub Actions
🧼 Mantén tu repo limpio
- Commits claros
- Ramas bien nombradas
- Pull requests pequeños
