// Upload any image and return its public URL.
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};
