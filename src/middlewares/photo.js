import uploader from '../config/cloudinary';

const blogImage = async req => {
	const tmp = req.files.image.tempFilePath;
	const result = await uploader.upload(
		tmp,
		{ folder: 'My Brand' },
		(_, result) => result,
	);
	return result;
};

export default blogImage;
