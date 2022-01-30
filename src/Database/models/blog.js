import mongoose from 'mongoose';



const blogSchema = new mongoose.Schema({
        userId: { type: DataTypes.INTEGER(), unique: false, allowedNull: false },
        title: { type: DataTypes.STRING(10), unique: false, allowedNull: false },
        description: {
                type: DataTypes.STRING(250),
                unique: false,
                allowedNull: false,
        },
        image: {
                imageId: {type: DataTypes.INTEGER},
                imageUrl: { type: DataTypes.STRING}
        }
})


export default blogSchema;
