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
    uriDB = 'mongodb://localhost:27017/cafe';
}else {
    uriDB = 'mongodb+srv://thekiller-cafe:lIxlhZjekHTWOKwz@cluster0.oygno.mongodb.net/coffe-store'
}

process.env.URLDB = uriDB;

