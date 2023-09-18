import * as dotenv from 'dotenv';
dotenv.config();
export const user = process.env.DB_USER;
export const passwd = process.env.DB_PASSWORD;
export const db = process.env.DB_NAME;
export const secret = process.env.JWT_SECRET;
export const firebaseConfig = {
    apiKey: 'AIzaSyDPYRh5fwOp8Ogwkx89GTIUinXluk_97lQ',
    authDomain: 'fproyectalfredob.firebaseapp.com',
    projectId: 'fproyectalfredob',
    storageBucket: 'fproyectalfredob.appspot.com',
    messagingSenderId: '774685775079',
    appId: '1:774685775079:web:bbe1f50ae4c9efae8a7e42',
    measurementId: 'G-N355GS1C22',
};
