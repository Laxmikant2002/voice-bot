"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KmsUtil = void 0;
const aws_sdk_1 = require("aws-sdk");
/**
 * Utility class for AWS KMS operations
 */
class KmsUtil {
    constructor(region = 'us-east-1') {
        this.kms = new aws_sdk_1.KMS({ region });
    }
    /**
     * Decrypt an encrypted API key
     * @param encryptedKey Base64-encoded encrypted key
     * @returns Decrypted plaintext key as string
     */
    async decryptApiKey(encryptedKey) {
        try {
            if (!encryptedKey) {
                throw new Error('No encrypted key provided');
            }
            const params = {
                CiphertextBlob: Buffer.from(encryptedKey, 'base64')
            };
            const decrypted = await this.kms.decrypt(params).promise();
            if (!decrypted.Plaintext) {
                throw new Error('Decryption returned no plaintext');
            }
            // AWS SDK can return Plaintext as a Buffer or Uint8Array
            return Buffer.from(decrypted.Plaintext).toString('utf-8');
        }
        catch (error) {
            console.error('KMS decryption error:', error);
            throw new Error('Failed to decrypt API key');
        }
    }
    /**
     * Helper method to encrypt a plain text API key (for setup purposes)
     * @param plaintextKey Plain text API key
     * @param keyId KMS Key ID to use for encryption
     * @returns Base64-encoded encrypted key
     */
    async encryptApiKey(plaintextKey, keyId) {
        try {
            if (!plaintextKey) {
                throw new Error('No plaintext key provided');
            }
            if (!keyId) {
                throw new Error('No KMS key ID provided');
            }
            const params = {
                KeyId: keyId,
                Plaintext: Buffer.from(plaintextKey, 'utf-8')
            };
            const encrypted = await this.kms.encrypt(params).promise();
            if (!encrypted.CiphertextBlob) {
                throw new Error('Encryption returned no ciphertext blob');
            }
            // AWS SDK can return CiphertextBlob as a Buffer or Uint8Array
            return Buffer.from(encrypted.CiphertextBlob).toString('base64');
        }
        catch (error) {
            console.error('KMS encryption error:', error);
            throw new Error('Failed to encrypt API key');
        }
    }
}
exports.KmsUtil = KmsUtil;
//# sourceMappingURL=kmsUtil.js.map