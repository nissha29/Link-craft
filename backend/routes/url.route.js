import { Router } from 'express';
import generateShortURL from "../controllers/generateShortURL.controller.js";
import redirectURL from '../controllers/redirectURL.controller.js'
import analytics from '../controllers/analytics.controller.js';

const urlRouter = Router()

urlRouter.post('/', generateShortURL)
urlRouter.get('/:shortId', redirectURL) 
urlRouter.get('/analytics/:shortId', analytics)

export default urlRouter