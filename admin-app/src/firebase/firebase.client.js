import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  getMetadata,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHiAkVnjPO_17EUPKKoYfie0leCFHLvBM",
  authDomain: "ecommerce-flipkart-clone.firebaseapp.com",
  projectId: "ecommerce-flipkart-clone",
  storageBucket: "ecommerce-flipkart-clone.appspot.com",
  messagingSenderId: "467485500356",
  appId: "1:467485500356:web:50cf3cf846341408337a91",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadImage = async (file) => {
  const imgRef = ref(storage, `images/${file.name}`);

  const imgUrl = await uploadBytes(imgRef, file)
    .then((res) => {
      // console.log("Imagen subida", res.metadata);
      return getDownloadURL(imgRef);
    })
    .then((imgUpload) => {
      //console.log(imgUpload);
      return imgUpload;
    });
  //console.log("referencia: ", imgRef);
  const getMetadataImg = await getMetadata(imgRef).then((metadata) => metadata);

  return imgUrl && getMetadataImg
    ? { imgUrl, name: getMetadataImg.name }
    : undefined;
};

export const deleteFirebaseImage = (name) => {
  if (Array.isArray(name)) {
    // Si es un array, usamos Promise.all para ejecutar todas las promesas de eliminaciónç
    const deletePromises = name.map((img) => {
      const imgRef = ref(storage, `images/${img.name}`);
      return deleteObject(imgRef)
        .then((res) => res)
        .catch((error) => error);
    });

    return Promise.all(deletePromises)
      .then((results) => {
        console.log("Todas las imágenes fueron eliminadas correctamente");
        return results;
      })
      .catch((error) => {
        console.error({
          message: "Error al eliminar alguna de las imágenes",
          error,
        });
        return error;
      });
  } else {
    // Si no es un array, elimina una sola imagen
    const imgRef = ref(storage, `images/${name}`);

    return deleteObject(imgRef)
      .then((res) => {
        console.log("Imagen eliminada correctamente ");
        return res;
      })
      .catch((error) => {
        console.log("Error al eliminar imagen");
        return error;
      });
  }
};
