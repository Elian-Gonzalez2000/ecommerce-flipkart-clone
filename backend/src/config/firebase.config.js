const { initializeApp } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fetch = require("node-fetch");
const serviceAccount = require("../../public/ecommerce-flipkart-clone-firebase-adminsdk-bkou2-73d92315a4.json");

/**
 * Configuración inicial de Firebase Admin
 * Las credenciales se obtienen del archivo .env
 */
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "ecommerce-flipkart-clone.appspot.com",
};

// Inicializar Firebase Admin
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const bucket = storage.bucket();

/**
 * Validar el tipo de archivo
 * @param {string} mimetype - Tipo MIME del archivo
 * @returns {boolean} - true si es válido, false si no lo es
 */
const validateFileType = (mimetype) => {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return validTypes.includes(mimetype);
};

/**
 * Validar el tamaño del archivo
 * @param {number} size - Tamaño del archivo en bytes
 * @param {number} maxSize - Tamaño máximo permitido en MB
 * @returns {boolean} - true si es válido, false si no lo es
 */
const validateFileSize = (size, maxSize = 5) => {
  const maxBytes = maxSize * 1024 * 1024; // Convertir MB a bytes
  return size <= maxBytes;
};

/**
 * Generar un nombre único para el archivo
 * @param {string} originalname - Nombre original del archivo
 * @returns {string} - Nombre único generado
 */
const generateUniqueFileName = (originalname) => {
  const extension = path.extname(originalname);
  const uniqueId = uuidv4();
  return `${uniqueId}${extension}`;
};

/**
 * Subir un archivo a Firebase Storage
 * @param {Object} file - Objeto del archivo (Buffer or Stream)
 * @param {string} file.originalname - Nombre original del archivo
 * @param {string} file.mimetype - Tipo MIME del archivo
 * @param {number} file.size - Tamaño del archivo en bytes
 * @param {Buffer|Stream} file.buffer - Contenido del archivo
 * @param {Object} options - Opciones adicionales
 * @param {string} options.folder - Carpeta donde se guardará el archivo
 * @param {number} options.maxSize - Tamaño máximo permitido en MB
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
const uploadFile = async (
  file,
  options = { folder: "products", maxSize: 5 }
) => {
  try {
    // Validar tipo de archivo
    if (!validateFileType(file.mimetype)) {
      return {
        success: false,
        error:
          "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WEBP, GIF)",
      };
    }

    // Validar tamaño de archivo
    if (!validateFileSize(file.size, options.maxSize)) {
      return {
        success: false,
        error: `El archivo excede el tamaño máximo permitido de ${options.maxSize}MB`,
      };
    }

    // Generar nombre único
    const fileName = generateUniqueFileName(file.originalname);
    const filePath = `${options.folder}/${fileName}`;

    // Crear referencia al archivo en Firebase
    const fileRef = bucket.file(filePath);

    // Configurar metadata del archivo
    const metadata = {
      contentType: file.mimetype,
      metadata: {
        originalname: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    };

    // Subir archivo
    await fileRef.save(file.buffer, {
      metadata: metadata,
      public: true, // Hacer el archivo públicamente accesible
      validation: "md5",
    });

    // Obtener URL pública
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return {
      success: true,
      url: publicUrl,
      fileName: fileName,
    };
  } catch (error) {
    console.error("Error al subir archivo a Firebase:", error);
    return {
      success: false,
      error: "Error al subir el archivo",
    };
  }
};

/**
 * Eliminar un archivo de Firebase Storage
 * @param {string} fileName - Nombre del archivo a eliminar
 * @param {string} folder - Carpeta donde está el archivo
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const deleteFile = async (fileName, folder = "products") => {
  try {
    const filePath = `${folder}/${fileName}`;
    const file = bucket.file(filePath);

    // Verificar si el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      return {
        success: false,
        error: "El archivo no existe",
      };
    }

    // Eliminar archivo
    await file.delete();

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error al eliminar archivo de Firebase:", error);
    return {
      success: false,
      error: "Error al eliminar el archivo",
    };
  }
};

/**
 * Obtener URL pública de un archivo
 * @param {string} fileName - Nombre del archivo
 * @param {string} folder - Carpeta donde está el archivo
 * @returns {string} URL pública del archivo
 */
const getPublicUrl = (fileName, folder = "products") => {
  return `https://storage.googleapis.com/${bucket.name}/${folder}/${fileName}`;
};

const downloadImage = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    return {
      buffer,
      mimetype: response.headers.get("content-type"),
      originalname: url.split("/").pop(),
    };
  } catch (error) {
    console.error("Error descargando imagen:", error);
    return null;
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getPublicUrl,
  validateFileType,
  validateFileSize,
  downloadImage,
};
