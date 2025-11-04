// src/models/abstract.repository.ts
import { Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
    constructor(private readonly model: Model<T>) {}

    public async create(item: Partial<T>){
        const doc = new this.model(item);
        return doc.save();
    }

    public async getOne(
        filter: RootFilterQuery<T>,
        projection: ProjectionType<T> = {},
        options: QueryOptions = {},
    ){
        return this.model.findOne(filter, projection, options);
    }

    // إصلاح دوال التحديث
    public async updateOne(
        filter: RootFilterQuery<T>,
        update: UpdateQuery<T>,
        options: QueryOptions & { new?: boolean } = { new: true }
    ) {
        return this.model.findOneAndUpdate(filter, update, options);
    }

public async updateMany(
    filter: RootFilterQuery<T>,
    update: UpdateQuery<T>,
    options: MongooseUpdateQueryOptions<T> = {}
) {
    return this.model.updateMany(filter, update, options);
}
}