# 03UserLoginSystem
Learning posts and redirects, along with form verification, image uploads, and mongodb

Had to install multiple things to get bcrypt work


- Instal Visiual Studio 2013 Community
https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs.aspx

- Install Visual C++ 2008 Redistributables (x64)
http://slproweb.com/products/Win32OpenSSL.html

- Install OpenSSL FULL
http://slproweb.com/products/Win32OpenSSL.html

- Install Python
download python 27 and install

- Install Node-gyp
npm install -g node-gyp


-- You may need to do this
npm install bcrypt --msvs_version=2013

Multer
There were some issues I had to fix with the way the tutorial used multer. 
The tutorial said to use
//app.use(multer({ dest: '/uploads'}));
But instead I had to use 

var upload = multer({ dest: '/uploads'})
var cpUpload = upload.single('profileimage');
