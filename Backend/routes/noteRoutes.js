import express from 'express';
import { getNotes,createNotes,updateNotes} from '../controllers/noteController.js';

const router = express.Router();

router.get('/',getNotes);
router.post('/',createNotes);
router.put('/:id',updateNotes);

export default router;