# SoloCartas

**SoloCartas** es una aplicación web desarrollada con Next.js y Tailwind CSS, orientada a la gestión y visualización de cartas coleccionables. El proyecto utiliza TypeScript, ESLint para el linting, y sigue una arquitectura modular y escalable basada en `src`.

---

## 🚀 Instalación y uso

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd solocartas-next
   ```

2. **Instalar dependencias**:
   ```bash
   yarn install
   ```

3. **Configurar variables de entorno**:
   - Copiar `.env.template` y renombrarlo a `.env.local`.
   - Completar los valores según sea necesario.

4. **Ejecutar el proyecto en desarrollo**:
   ```bash
   yarn dev
   ```

5. **Build para producción**:
   ```bash
   yarn build
   yarn start
   ```

---

## 📁 Estructura del Proyecto

```
solocartas-next/
├── public/              # Archivos estáticos (SVGs, íconos)
├── src/
│   ├── app/             # Rutas y componentes de páginas (estructura Next.js App Router)
│   ├── contexts/        # Context API (manejo de estado global)
│   ├── lib/             # Funciones reutilizables / lógica de negocio
│   ├── types/           # Definiciones TypeScript
│   └── utils/           # Utilidades auxiliares
├── .env.template        # Archivo base para variables de entorno
├── next.config.ts       # Configuración de Next.js
├── tailwind.config.ts   # Configuración de Tailwind CSS
├── tsconfig.json        # Configuración TypeScript
└── package.json         # Dependencias y scripts
```

---

## 🛠️ Por hacer

- [ ] Documentación técnica por módulo
- [ ] Mensajes de error claros y amigables en frontend
- [ ] Testeo unitario y de integración
- [ ] Mejora del manejo de estados de carga y errores

---

## 🧪 Linting y Formato

Este proyecto usa ESLint. Puedes ejecutar el lint manualmente con:

```bash
yarn lint
```

---

## 🧾 Licencia


