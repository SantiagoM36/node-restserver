// ================================
//               PORT
// ================================

process.env.PORT = process.env.PORT || 8080;

// ================================
//              ENTORNO
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
//               BD
// ================================

let uriDB;

if( process.env.NODE_ENV === 'dev' ){
    uriDB = 'mongodb://127.0.0.1:27017/cafe';
}else {
    uriDB = process.env.MONGO_URI;
}

process.env.URLDB = uriDB;

