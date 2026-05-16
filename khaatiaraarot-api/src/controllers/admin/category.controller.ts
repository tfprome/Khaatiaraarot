import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as categoryService from '../../services/admin/category.service';
import { createCategorySchema, updateCategorySchema } from '../../schemas/admin.schema';

export async function listCategories(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await categoryService.listCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = createCategorySchema.parse(req.body);
    const data = await categoryService.createCategory(input);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = updateCategorySchema.parse(req.body);
    const data = await categoryService.updateCategory(req.params.id, input);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function uploadCategoryImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { AppError } = await import('../../utils/errors');
    if (!req.file) throw new AppError(400, 'NO_FILE', 'No file provided');
    const data = await categoryService.uploadCategoryImage(req.params.id, req.file.buffer);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
