import { Document, Model } from "mongoose";

export class CrudService<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(query: Record<string, any> = {}): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async findOne(params: any, relations?: Array<string>): Promise<T | null> {
    return await this.model.findOne(
      relations ? { ...params, relations: [...relations] } : { ...params }
    );
  }

  async updateOne(params:Record<string, any>, newFields: Record<string, any>): Promise<T | null>{
    return this.model.findOneAndUpdate(params, newFields)
  }
}