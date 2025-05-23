import { CrudService } from "../crudService";
import { User } from "../models/user.model";

class UserService extends CrudService<any> {
  constructor() {
    super(User);
  }

  async updateUser(id: string, data: any) {
    return this.update(id, data);
  }

  async findOneUser(query: Record<string, any>) {
    return this.findOne(query);
  }
}

const userService = new UserService();

export { userService };
