import { AnyZodObject, ZodEffects } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest =
    (scema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await scema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });

            return next();
        } catch (error) {
            next(error);
        }
    };

export default validateRequest;
