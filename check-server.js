const http = require('http');
const https = require('https');

const host = 'srvc08.trwww.com';

console.log('Sunucu kontrol ediliyor...');
console.log('Host:', host);

// Try HTTP
const req = http.get('http://' + host, (res) => {
    console.log('\nHTTP Durum:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    
    if (res.headers.server) {
        console.log('\nSunucu yazılımı:', res.headers.server);
    }
});

req.on('error', (e) => {
    console.error('Hata:', e.message);
});

req.setTimeout(5000, () => {
    console.log('Zaman aşımı');
    req.destroy();
});
