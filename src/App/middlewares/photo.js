import uploader from '../config/cloudinary';

const blogImage = async req => {
        const tmp = req.files.photo.tempFilePath;
        const result = await uploader.upload(tmp, (_, results) => results);
        return result.url;
};
export default blogImage;
