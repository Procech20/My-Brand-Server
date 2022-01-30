import User from '../models/user';


class userServices {
        static async findUser({ id: _id }) {
                const user = await User.findOne({_id});
                return user;
        }

        static async createUser(user) {
                const createduser = await User.create(user);
                return createduser;
        }

        static async findUsers() {
                const users = await User.find().sort({ time: -1 });
                return {usersCount: users.length, users};
        }

        static async updateUser(user, {id: _id}) {
                const updatedUser = await User.findOneAndUpdate(user, {_id});
                return updatedUser;
        }

        static async deleteOne({id: _id}) {
                const user = await User.deleteOne({ _id });
                return user;
        }
}

export default userServices;
