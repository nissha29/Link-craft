import { Router } from 'express';
import generateShortURL from "../controllers/generateShortURL.controller.js";
import redirectURL from '../controllers/redirectURL.controller.js'
import linkHistory from '../controllers/linkHistory.controller.js';
import deleteUrl from '../controllers/deleteUrl.controller.js';

const urlRouter = Router()

urlRouter.post('/', generateShortURL)
urlRouter.get('/:shortId', redirectURL) 
urlRouter.get('/link/history', linkHistory)
urlRouter.delete('/link/:id', deleteUrl)

export default urlRouter