# PERSONAL STORAGE
Personal Storage (Your files on lighthouse.storage)

This project is a proof of concept  
Is made with React and lighthouse-web3 library in a few hours   
Just exploring the library functions  
It let the user select a file to upload in lighthouse storage and paying a small fee is pinned forever!  
You get back the CID of the uploaded file and you can retrieve it with a given url.  

<br>
<br>

# INSTALL
```bash
git clone https://github.com/acul71/personal-storage
cd personal-storage
npm install
npm start #will run the program in the browser
```
<br>

# TODO:
## Let the user encrypt the file(s) content with a password

Ideas:  
- for web3 file owner it could be used public key to encrypt and decript with private key?  

for sharing:  
- sharing with a web3 user could be encrypted with dest user public key (But how to know dest user pubkey?)
- sharing with a web2 user (also a web3 user can act like a web2 user in this case) could be encrypted with a password but the password has to be given to the dest user  

<br>

## File list
- let the user manage the uploaded files (delete, share, etc.)