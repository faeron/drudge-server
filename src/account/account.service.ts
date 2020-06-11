import { Account } from "./account.model";

export class AccountService {
  public async signup(newAccount) {
    const account = await Account.create(newAccount);
    return account.toObject();
  }

  public async signIn(username: string, password: string) {
    const existingAccount = await Account.findOne({ email: username });
    if (!existingAccount) {
      return null;
    }
    const validPassword = await existingAccount.verifyPassword(password);
    if (!validPassword) {
      return null;
    }
    return existingAccount.toObject();
  }

  public async getById(id) {
    const account = await Account.findById(id);
    if (!account) {
      return null;
    }
    return account.toObject();
  }
}
