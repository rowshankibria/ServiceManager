using System;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.IO;
using System.Xml.Serialization;
using System.Xml;


namespace LoanManager.Shared
{
    /// <summary>
    /// Encryption helper class
    /// </summary>
    public class Encryption
    {
        /// <summary>
        /// Will exception be thrown during decryption process
        /// </summary>
        public static bool ThrowException = true;

        public const string AppGK = "63521219005403524c07124706575645480700160656420218570b#y3ar2016";
        public const string AppGV = "6906554a0003070448065240060509014d#y3ar2016";

        static string _gK;
        static byte[] gK
        {
            get
            {
                if (_gK == null)
                {
                    var gk = AppGK;
                    if (string.IsNullOrEmpty(gk)) gk = "H3LL0K188y";
                    else
                    {
                        gk = DecryptQueryString(gk.Split('#')[0], true, gk.Split('#')[1]);
                    }
                    _gK = string.IsNullOrEmpty(gk) ? null : gk;// ASCIIEncoding.ASCII.GetBytes(gk);
                }               
                return ASCIIEncoding.ASCII.GetBytes(_gK);
            }           
        }
        static string _gV;
        static byte[] gV
        {
            get
            {
                if (_gV == null)
                {
                    var gv = AppGV;
                    if (string.IsNullOrEmpty(gv)) gv = "1563422765542168";
                    else
                    {
                        gv = DecryptQueryString(gv.Split('#')[0], true, gv.Split('#')[1]);
                    }
                    _gV = string.IsNullOrEmpty(gv) ? null : gv;// ASCIIEncoding.ASCII.GetBytes(gv);
                }               
                return ASCIIEncoding.ASCII.GetBytes(_gV);
            }
        }        
        /// <summary>
        /// EncryptSHA
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string EncryptSHA(string text)
        {
            if (string.IsNullOrEmpty(text)) return null;
            return Convert.ToBase64String(EncryptSHAData(EncryptSHAData(ASCIIEncoding.UTF8.GetBytes(text))));
        }
        private static byte[] EncryptSHAData(byte[] plainTextBytes)
        {
            Byte[] saltBytes = gK; //System.Text.Encoding.UTF8.GetBytes(keyName);//get salt
            // Convert plain text into a byte array.
            //byte[] plainTextBytes = Encoding.UTF8.GetBytes(text);
            // Allocate array, which will hold plain text and salt.
            byte[] plainTextWithSaltBytes =
                    new byte[plainTextBytes.Length + saltBytes.Length];
            // Copy plain text bytes into resulting array.
            for (int i = 0; i < plainTextBytes.Length; i++)
                plainTextWithSaltBytes[i] = plainTextBytes[i];
            // Append salt bytes to the resulting array.
            for (int i = 0; i < saltBytes.Length; i++)
                plainTextWithSaltBytes[plainTextBytes.Length + i] = saltBytes[i];
            // Because we support multiple hashing algorithms, we must define
            // hash object as a common (abstract) base class. We will specify the
            // actual hashing algorithm class later during object creation.
            using (HashAlgorithm hash = new SHA512Managed())
            {
                // Compute hash value of our plain text with appended salt.
                byte[] hashBytes = hash.ComputeHash(plainTextWithSaltBytes);
                // Create array which will hold hash and original salt bytes.
                byte[] hashWithSaltBytes = new byte[hashBytes.Length +
                                                    saltBytes.Length];
                // Copy hash bytes into resulting array.
                for (int i = 0; i < hashBytes.Length; i++)
                    hashWithSaltBytes[i] = hashBytes[i];
                // Append salt bytes to the result.
                for (int i = 0; i < saltBytes.Length; i++)
                    hashWithSaltBytes[hashBytes.Length + i] = saltBytes[i];
                return hashWithSaltBytes;
                // Convert result into a base64-encoded string.
                //string hashValue = Convert.ToBase64String(hashWithSaltBytes);
                // Return the result.
                //return hashValue;
            }
        }
        /// <summary>
        /// Encrypt
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string Encrypt(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;
            byte[] plainTextBytes = ASCIIEncoding.UTF8.GetBytes(text);

            using (PasswordDeriveBytes password = new PasswordDeriveBytes(gK, null))
            {
                byte[] keyBytes = password.GetBytes(256 / 8);
                using (RijndaelManaged symmetricKey = new RijndaelManaged())
                {
                    symmetricKey.Mode = CipherMode.CBC;
                    using (ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, gV))
                    {
                        using (MemoryStream memoryStream = new MemoryStream())
                        {
                            using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                            {
                                cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                                cryptoStream.FlushFinalBlock();
                                byte[] cipherTextBytes = memoryStream.ToArray();
                                return Convert.ToBase64String(cipherTextBytes);
                            }
                        }
                    }
                }
            }
        }
        /// <summary>
        /// Decrypt text
        /// </summary>
        /// <param name="text">Text to decrypt</param>
        /// <param name="throwException"></param>
        /// <returns>Decrypted text</returns>
        public static string Decrypt(string text, bool throwException = false)
        {
            if (string.IsNullOrEmpty(text)) return text;
            try
            {
                byte[] cipherTextBytes = Convert.FromBase64String(text);
                using (PasswordDeriveBytes password = new PasswordDeriveBytes(gK, null))
                {
                    byte[] keyBytes = password.GetBytes(256 / 8);
                    using (RijndaelManaged symmetricKey = new RijndaelManaged())
                    {
                        symmetricKey.Mode = CipherMode.CBC;
                        using (ICryptoTransform decryptor = symmetricKey.CreateDecryptor(keyBytes, gV))
                        {
                            using (MemoryStream memoryStream = new MemoryStream(cipherTextBytes))
                            {
                                using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                                {
                                    byte[] plainTextBytes = new byte[cipherTextBytes.Length];
                                    int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                                    return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (throwException) throw ex;
                else return text;
            }
        }
        #region Object Encryption & Decryption
        /// <summary>
        /// Encrypts object
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>byte array</returns>
        public static byte[] EncryptObject(object obj)
        {
            if (obj == null) return null;
            //encrypt object
            var serializer = new XmlSerializer(obj.GetType());
            string plainText = null;
            using (TextWriter w = new StringWriter())
            {
                serializer.Serialize(w, obj);
                plainText = w.ToString();
                w.Close();
            }
            serializer = null;
            // Check arguments.
            if (plainText == null || plainText.Length <= 0) return null;
            using (var aesAlg = new RijndaelManaged())
            {
                aesAlg.Key = gK;
                aesAlg.IV = gV;
                // Create an encryptor to perform the stream transform.
                using (ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
                {
                    // Create the streams used for encryption.
                    using (var msEncrypt = new MemoryStream())
                    {
                        using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                            {
                                //Write all data to the stream.
                                swEncrypt.Write(plainText);
                            }
                        }
                        var bytes = msEncrypt.ToArray();
                        msEncrypt.Dispose();
                        return bytes;
                    }
                }
            }
        }
        /// <summary>
        /// Decrypts object
        /// </summary>
        /// <typeparam name="T">Type</typeparam>
        /// <param name="cipherText">Cipher Text</param>
        /// <returns>Type</returns>
        public static T DecryptObject<T>(byte[] cipherText)
        {
            if (cipherText == null || cipherText.Length <= 0) throw new NullReferenceException();
            string plaintext = null;
            using (var aesAlg = new RijndaelManaged())
            {
                aesAlg.Key = gK;
                aesAlg.IV = gV;
                using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                {
                    using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                    {
                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                            {
                                plaintext = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                }
                aesAlg.Clear();
            }
            XmlSerializer xs = new XmlSerializer(typeof(T));
            var stringReader = new StringReader(plaintext);
            XmlTextReader xmlReader = new XmlTextReader(stringReader);
            return (T)xs.Deserialize(xmlReader);
        }
        #endregion

        #region Internal Encryption
        /// <summary>
        /// Encrypt function
        /// </summary>
        /// <param name="text">Text to encrypt</param>
        /// <param name="key">own key</param>
        /// <returns>Encrypted text</returns>
        public static string EncryptQueryString(string text, string key = null)
        {
            if (string.IsNullOrEmpty(text)) return text;
            string encrypt = null;
            try
            {
                int i = 0;
                key = key ?? ASCIIEncoding.UTF8.GetString(gK);
                char textChar, keyChar;
                char[] textData, charKey;

                //Save Length of Pass
                text = (char)(text.Length) + text;

                //Pad Password with space upto 10 Characters
                if (text.Length < 10)
                {
                    text = text.PadRight(10, ' ');
                }
                textData = text.ToCharArray();

                //Make the key big enough
                while (key.Length < text.Length)
                {
                    key = key + key;
                }
                key = key.Substring(0, text.Length);
                charKey = key.ToCharArray();

                //Encrypting Data
                for (i = 0; i < text.Length; i++)
                {
                    textChar = (char)textData.GetValue(i);
                    keyChar = (char)charKey.GetValue(i);
                    encrypt = encrypt + IntToHex((int)(textChar) ^ (int)(keyChar));
                }
            }
            catch
            {
                encrypt = null;
            }
            return encrypt;
        }
        /// <summary>
        /// Decrypt text
        /// </summary>
        /// <param name="text">Text to decrypt</param>
        /// <param name="onErrorThrowEx">Will exception be thrown on error</param>
        /// <param name="key">own key</param>
        /// <returns>Decrypted text</returns>
        public static string DecryptQueryString(string text, bool onErrorThrowEx = false, string key = null)
        {
            if (string.IsNullOrEmpty(text)) return null;
            string decrypt = "";
            try
            {
                int j = 0, i = 0, len = 0;
                string textByte = "";
                key = key ?? ASCIIEncoding.UTF8.GetString(gK);
                char[] textData, charKey;
                char textChar, keyChar;

                //Taking Lenght, half of Encrypting data  
                len = text.Length / 2;

                //Making key is big Enough
                while (key.Length < len)
                {
                    key = key + key;
                }
                key = key.Substring(0, len);
                charKey = key.ToCharArray();
                textData = text.ToCharArray();

                //Decripting data
                for (i = 0; i < len; i++)
                {
                    textByte = "";
                    for (j = i * 2; j < (i * 2 + 2); j++)
                    {
                        textByte = textByte + textData.GetValue(j).ToString();
                    }
                    textChar = (char)HexToInt(textByte);
                    keyChar = (char)charKey.GetValue(i);
                    decrypt = decrypt + (char)((int)(keyChar) ^ (int)(textChar));
                }

                len = (int)decrypt.ToCharArray()[0];
                decrypt = decrypt.Substring(1, len);
            }
            catch (Exception ex)
            {
                if (onErrorThrowEx)
                    throw ex;
                else
                    decrypt = text;
            }
            return decrypt;
        }
        private static string IntToHex(int intData)
        {
            return Convert.ToString(intData, 16).PadLeft(2, '0');
        }
        private static int HexToInt(string hexData)
        {
            return Convert.ToInt32(hexData, 16);
        }

        public static string ConvertStringToHex(String input, System.Text.Encoding encoding)
        {
            Byte[] stringBytes = encoding.GetBytes(input);
            StringBuilder sbBytes = new StringBuilder(stringBytes.Length * 2);
            foreach (byte b in stringBytes)
            {
                sbBytes.AppendFormat("{0:X2}", b);
            }
            return sbBytes.ToString();
        }

        public static string ConvertHexToString(String hexInput, System.Text.Encoding encoding)
        {
            int numberChars = hexInput.Length;
            byte[] bytes = new byte[numberChars / 2];
            for (int i = 0; i < numberChars; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hexInput.Substring(i, 2), 16);
            }
            return encoding.GetString(bytes);
        }

        #endregion
    }
}
