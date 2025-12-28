import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Partner } from '../models/Partner';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Apply authentication to all admin routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// GET /api/partners - Get all partners for admin (including inactive)
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching partners'
    });
  }
});

// POST /api/partners - Create new partner
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('logo_url').trim().notEmpty().withMessage('Logo URL is required'),
    body('website_url').optional().isURL().withMessage('Website URL must be a valid URL'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { name, logo_url, website_url, description, isActive = true, sort_order = 0 } = req.body;

      const partner = await Partner.create({
        name,
        logo_url,
        website_url,
        description,
        isActive,
        sort_order
      });

      res.status(201).json({
        success: true,
        data: partner,
        message: 'Partner created successfully'
      });
    } catch (error) {
      console.error('Error creating partner:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating partner'
      });
    }
  }
);

// PUT /api/partners/:id - Update partner
router.put('/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('logo_url').optional().trim().notEmpty().withMessage('Logo URL cannot be empty'),
    body('website_url').optional().isURL().withMessage('Website URL must be a valid URL'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const partner = await Partner.findByPk(id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Partner not found'
        });
      }

      const { name, logo_url, website_url, description, isActive, sort_order } = req.body;

      await partner.update({
        ...(name !== undefined && { name }),
        ...(logo_url !== undefined && { logo_url }),
        ...(website_url !== undefined && { website_url }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(sort_order !== undefined && { sort_order })
      });

      res.json({
        success: true,
        data: partner,
        message: 'Partner updated successfully'
      });
    } catch (error) {
      console.error('Error updating partner:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating partner'
      });
    }
  }
);

// DELETE /api/partners/:id - Delete partner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    await partner.destroy();

    res.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting partner'
    });
  }
});

// GET /api/partners/count - Get partner count for stats
router.get('/count', async (req, res) => {
  try {
    const count = await Partner.count({
      where: { isActive: true }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error counting partners:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting partners'
    });
  }
});

export default router;