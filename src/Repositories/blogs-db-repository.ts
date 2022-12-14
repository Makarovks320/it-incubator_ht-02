import {blogCollection} from "./db";

export type blog = {
    id?: string,
    name?: string,
    description?: string,
    websiteUrl?: string,
    createdAt?: string
}
const DEFAULT_PROJECTION = { _id: false };

export const blogsRepository = {
    async getAllBlogs(): Promise<blog[]>{//todo почему здесь без эвэйта?
        return blogCollection.find({}, { projection: DEFAULT_PROJECTION}).toArray();
    },

    async findBlogById(id: string): Promise<blog | null>{
        const blog: blog | null = await blogCollection.findOne({id}, { projection: DEFAULT_PROJECTION});
        console.log(blog);
        return blog ? blog : null;
    },
    async deleteAllBlogs(): Promise<void> {
        const result = await blogCollection.deleteMany({});
        console.log(result);
    },
    async createNewBlog(b: blog): Promise<blog> {
        const newBlog: blog = {
            id: (new Date().valueOf()).toString(),
            name: b.name || 'mock',
            description: b.description || 'mock',
            websiteUrl: b.websiteUrl || 'mock',
            createdAt: (new Date()).toISOString()
        };
        const result = await blogCollection.insertOne({...newBlog});
        return newBlog;
    },
    async updateBlogById(id: string, b: blog): Promise<boolean> {
        const result = await blogCollection.updateOne({id},{$set: {...b}});
        return result.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await blogCollection.deleteOne({id});
        return result.deletedCount === 1
    }
};
