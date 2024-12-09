import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // In production, use environment variable

export function useEncryption() {
  const encryptData = (data: any) => {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  };

  const decryptData = (encryptedData: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  };

  return { encryptData, decryptData };
}