import Models from '../models/server';

const { User } = Models;
class userServices {
        static async findUser(param) {
                const user = await User.findOne({ where: param });
                return user;
        }

        static async createUser(user) {
                const createduser = await User.create(user);
                return createduser;
        }

        static async findUsers() {
                const users = await User.findAll();
                return users;
        }

        static async updateUser(user, param) {
                const updatedUser = await User.update(user, {
                        where: [param],
                });
                return updatedUser;
        }

        static async deleteOne(param) {
                const user = await User.destroy({
                        where: param,
                });
                return user;
        }
}

export default userServices;
