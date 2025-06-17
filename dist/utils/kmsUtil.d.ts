/**
 * Utility class for AWS KMS operations
 */
export declare class KmsUtil {
    private kms;
    constructor(region?: string);
    /**
     * Decrypt an encrypted API key
     * @param encryptedKey Base64-encoded encrypted key
     * @returns Decrypted plaintext key as string
     */
    decryptApiKey(encryptedKey: string): Promise<string>;
    /**
     * Helper method to encrypt a plain text API key (for setup purposes)
     * @param plaintextKey Plain text API key
     * @param keyId KMS Key ID to use for encryption
     * @returns Base64-encoded encrypted key
     */
    encryptApiKey(plaintextKey: string, keyId: string): Promise<string>;
}
