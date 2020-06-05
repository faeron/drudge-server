import { Account } from "./account.model";

export class AccountService {
  public async signup(newAccount) {
    return Account.create(newAccount);
  }

  public async getNode(id) {
    return Account.findById(id);
  }
}
