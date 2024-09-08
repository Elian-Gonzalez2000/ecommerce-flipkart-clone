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

export const deleteFirebaseImage = (imgUrl) => {};
