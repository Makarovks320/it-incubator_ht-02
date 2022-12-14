import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {blogsRepository} from "../Repositories/blogs-db-repository";
import {inputValidator} from "../middlewares/inputValidator";
import {authorization} from "../middlewares/authorization";
// import {checkIdParam} from "../middlewares/checkIdParam";

export const blogsRouter = Router();

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getAllBlogs();
    res.send(blogs);
});

blogsRouter.delete('/', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs();
    res.sendStatus(204);
});

blogsRouter.get('/:id', async (req: Request, res: Response) => {
        const blog = await blogsRepository.findBlogById(req.params.id);
        blog ? res.send(blog) : res.status(404).send();
    });

blogsRouter.post('/',
    authorization,
    body('websiteUrl').trim().isURL(),
    body('name').trim().isLength({max: 15}).withMessage('should be string').not().isEmpty(),
    inputValidator,
    async (req: Request, res: Response) => {
        const blog = req.body;
        const newBlog = await blogsRepository.createNewBlog(blog);
        res.status(201).send(newBlog);
    });

blogsRouter.put('/:id',
    authorization,
    body('name').isString().withMessage('string').trim().not().isEmpty().withMessage('empty').isLength({min: 1, max: 15}).withMessage('max length: 15'),
    body('websiteUrl').trim().isURL(),
    // todo: как убедиться, что параметр :id передан?
    // param().notEmpty().withMessage('param id is required')
    // checkIdParam, todo: сделал проверку, но она не работает - почему?
    inputValidator,
    async (req: Request, res: Response) => {
        const updatedBlog = await blogsRepository.updateBlogById(req.params.id, req.body);
        updatedBlog ? res.status(204).send() : res.status(404).send();
    });

blogsRouter.delete('/:id',
    authorization,
    async (req: Request, res: Response) => {
        const blog = await blogsRepository.deleteBlogById(req.params.id);
        blog ? res.status(204).send() : res.status(404).send();
    });