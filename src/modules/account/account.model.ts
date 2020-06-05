import mongoose, { Document } from "mongoose";
import crypto from "crypto";

// larger numbers mean better security, less
const config = {
  // size of the generated hash
  hashBytes: 32,
  // larger salt means hashed passwords are more resistant to rainbow table, but
  // you get diminishing returns pretty fast
  saltBytes: 16,
  // more iterations means an attacker has to take longer to brute force an
  // individual password, so larger is better. however, larger also means longer
  // to hash the password. tune so that hashing the password takes about a
  // second
  iterations: 872791,
  // A selected HMAC digest algorithm specified by digest is applied to derive
  // a key of the requested byte length (keylen) from the password, salt and
  // iterations.
  // - sha512, sha256
  // - whirlpool
  // and more.
  digest: "sha512",
};

interface AccountInterface extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  verifyPassword(password: string): Promise<boolean>;
}

const AccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

AccountSchema.set("toObject", { virtuals: true });

AccountSchema.pre<AccountInterface>("save", async function (next) {
  return new Promise((resolve, reject) => {
    const account = this;

    if (!account.isModified("password")) {
      return resolve();
    }
    // generate a salt for pbkdf2
    crypto.randomBytes(config.saltBytes, function (err, salt) {
      if (err) {
        return reject(err);
      }

      crypto.pbkdf2(account.password, salt, config.iterations, config.hashBytes, config.digest, function (err, hash) {
        if (err) {
          return reject(err);
        }

        // var combined = new Buffer(hash.length + salt.length + 8);
        const combined = Buffer.alloc(hash.length + salt.length + 8);

        // include the size of the salt so that we can, during verification,
        // figure out how much of the hash is salt
        combined.writeUInt32BE(salt.length, 0);
        // similarly, include the iteration count
        combined.writeUInt32BE(config.iterations, 4);

        salt.copy(combined, 8);
        hash.copy(combined, salt.length + 8);
        account.password = combined.toString("hex");
        resolve();
      });
    });
  });
});

AccountSchema.methods.verifyPassword = function (passwordToCheck) {
  const account = this;
  return new Promise((resolve, reject) => {
    const savedHash = Buffer.from(account.password, "hex");
    // extract the salt and hash from the combined buffer
    var saltBytes = savedHash.readUInt32BE(0);
    var hashBytes = savedHash.length - saltBytes - 8;
    var iterations = savedHash.readUInt32BE(4);
    var salt = savedHash.slice(8, saltBytes + 8);
    var hash = savedHash.toString("binary", saltBytes + 8);

    // verify the salt and hash against the password
    crypto.pbkdf2(passwordToCheck, salt, iterations, hashBytes, config.digest, function (err, verify) {
      if (err) {
        return reject(err);
      }
      resolve(verify.toString("binary") === hash);
    });
  });
};

export const Account = mongoose.model<AccountInterface>("Account", AccountSchema);
