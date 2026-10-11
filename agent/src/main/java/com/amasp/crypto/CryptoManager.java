package com.amasp.crypto;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;
import javax.crypto.spec.SecretKeySpec;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.MGF1ParameterSpec;

public class CryptoManager {

    private static final int AES_KEY_SIZE = 256;
    private static final int GCM_NONCE_SIZE = 12;
    private static final int GCM_TAG_SIZE = 128;

    private static final SecureRandom SECURE_RANDOM =
            new SecureRandom();

    private static final OAEPParameterSpec OAEP_PARAMS =
            new OAEPParameterSpec(
                    "SHA-256",
                    "MGF1",
                    MGF1ParameterSpec.SHA256,
                    PSource.PSpecified.DEFAULT
            );

    private KeyPair keyPair;

    // Generate RSA public and private keys
    public void generateKeyPair() throws Exception {

        KeyPairGenerator generator =
                KeyPairGenerator.getInstance("RSA");

        generator.initialize(2048, SECURE_RANDOM);

        keyPair = generator.generateKeyPair();
    }

    public PublicKey getPublicKey() {
        return keyPair.getPublic();
    }

    public PrivateKey getPrivateKey() {
        return keyPair.getPrivate();
    }

    // Encrypt a byte array using AES-GCM
    // Encrypt the AES key using the RSA public key
    public byte[] encrypt(byte[] data) throws Exception {

        if (data == null) {
            throw new IllegalArgumentException(
                    "Data cannot be null"
            );
        }

        // Generate a random AES-256 key
        KeyGenerator keyGenerator =
                KeyGenerator.getInstance("AES");

        keyGenerator.init(AES_KEY_SIZE, SECURE_RANDOM);

        SecretKey aesKey = keyGenerator.generateKey();

        // Generate a random 12-byte nonce
        byte[] nonce = new byte[GCM_NONCE_SIZE];
        SECURE_RANDOM.nextBytes(nonce);

        // Encrypt the data using AES-GCM
        Cipher aesCipher = Cipher.getInstance("AES/GCM/NoPadding");

        aesCipher.init(
                Cipher.ENCRYPT_MODE,
                aesKey,
                new GCMParameterSpec(GCM_TAG_SIZE, nonce)
        );

        byte[] ciphertext = aesCipher.doFinal(data);

        // Encrypt the AES key using the RSA public key
        Cipher rsaCipher = Cipher.getInstance(
                "RSA/ECB/OAEPWithSHA-256AndMGF1Padding"
        );

        rsaCipher.init(
                Cipher.ENCRYPT_MODE,
                getPublicKey(),
                OAEP_PARAMS
        );

        byte[] encryptedAESKey =
                rsaCipher.doFinal(aesKey.getEncoded());

        // Pack everything into a single byte array:
        // [encrypted AES key length]
        // [encrypted AES key]
        // [nonce]
        // [ciphertext + GCM authentication tag]

        ByteArrayOutputStream buffer =
                new ByteArrayOutputStream();

        DataOutputStream output =
                new DataOutputStream(buffer);

        output.writeInt(encryptedAESKey.length);
        output.write(encryptedAESKey);
        output.write(nonce);
        output.write(ciphertext);

        return buffer.toByteArray();
    }

    // Decrypt the byte array using the RSA private key
    // and then decrypt the data using AES-GCM
    public byte[] decrypt(byte[] encryptedData) throws Exception {

        if (encryptedData == null) {
            throw new IllegalArgumentException(
                    "Encrypted data cannot be null"
            );
        }

        if (keyPair == null) {
            throw new IllegalStateException(
                    "RSA key pair has not been generated"
            );
        }

        ByteArrayInputStream buffer =
                new ByteArrayInputStream(encryptedData);

        DataInputStream input =
                new DataInputStream(buffer);

        // Read the encrypted AES key length
        int encryptedKeyLength = input.readInt();

        // RSA-2048 produces a 256-byte ciphertext
        if (encryptedKeyLength != 256 ||
                input.available() < encryptedKeyLength
                        + GCM_NONCE_SIZE + 16) {

            throw new IllegalArgumentException(
                    "Invalid encrypted data format"
            );
        }

        // Read the encrypted AES key
        byte[] encryptedAESKey =
                input.readNBytes(encryptedKeyLength);

        // Decrypt the AES key using the RSA private key
        Cipher rsaCipher = Cipher.getInstance(
                "RSA/ECB/OAEPWithSHA-256AndMGF1Padding"
        );

        rsaCipher.init(
                Cipher.DECRYPT_MODE,
                getPrivateKey(),
                OAEP_PARAMS
        );

        byte[] aesKeyBytes =
                rsaCipher.doFinal(encryptedAESKey);

        SecretKey aesKey =
                new SecretKeySpec(aesKeyBytes, "AES");

        // Read the nonce
        byte[] nonce = input.readNBytes(GCM_NONCE_SIZE);

        // Read the remaining bytes as ciphertext
        byte[] ciphertext = input.readAllBytes();

        // Decrypt the data using AES-GCM
        Cipher aesCipher = Cipher.getInstance("AES/GCM/NoPadding");

        aesCipher.init(
                Cipher.DECRYPT_MODE,
                aesKey,
                new GCMParameterSpec(GCM_TAG_SIZE, nonce)
        );

        return aesCipher.doFinal(ciphertext);
    }
}
