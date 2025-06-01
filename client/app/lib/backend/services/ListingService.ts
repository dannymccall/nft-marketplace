import { CrudService } from "../crudService";
import Listing from "../models/listing.model";

class ListingService extends CrudService<any> {
  private static crudService = new CrudService(Listing);
  constructor() {
    super(Listing);
  }

  static async newListing(data: any) {
    return this.crudService.create(data);
  }

  static async getAllListing(query: Record<string, any>) {
    return this.crudService.findAll(query);
  }
  static async getListing(query: Record<string, any>) {
    return this.crudService.findOne(query);
  }

  static async updateModel(
    relation: Record<string, any>,
    newFields: Record<string, any>
  ): Promise<any> {
    return this.crudService.updateOne(relation, newFields);
  }
}


export {ListingService};