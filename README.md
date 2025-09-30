Plataforma de Carga y Procesamiento de Documentos
Aplicación Angular para cargar, validar, procesar y descargar documentos (PDF y otros formatos) integrándose con servicios backend, ideal para procesos de vinculación y cumplimiento normativo.

Características
  Carga de archivos mediante drag & drop o selector.
  Validación de extensión y tamaño de archivos.
  Subida y procesamiento asíncrono de documentos vía servicios backend.
  Visualización y descarga de documentos originales y procesados.
  Interfaz intuitiva y responsiva.
  Estructura del Proyecto
    src/
      app/
        components/
          header/
          table-docs/
          upload-documents/
        constants/
        directives/
        pages/
        services/
      assets/
        images/
        
Instalación
Clona el repositorio:
  https://github.com/marianao57/drag-and-drop.git
  
Instala las dependencias:
  npm install
  
Ejecuta la aplicación:
  ng serve 
  
Abre http://localhost:4200 en tu navegador.

Uso
  Arrastra o selecciona un archivo PDF (u otro permitido).
  Espera a que el archivo sea procesado.
  Descarga el archivo procesado desde la tabla de documentos.
  
Personalización
  Modifica las extensiones y tamaño máximo permitidos en upload-documents.component.ts.
  Configura las URLs de los servicios en constants/urls.constants.ts.
  
Pruebas
  Ejecuta las pruebas unitarias con: ng test

Contribuciones
  ¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.
