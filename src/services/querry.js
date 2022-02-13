import Querry from '../models/querry';

class querryServices {
	static async findQuerry({ id: _id }) {
		const querry = await Querry.findOne({ _id });
		return querry;
	}

	static async createQuerry(querry) {
		const createdquerry = await Querry.create(querry);
		return createdquerry;
	}

	static async findQuerries() {
		const querries = await Querry.find().sort({ time: -1 });
		return { querryCount: querries.length, querries };
	}

	static async updateQuerry({ id: _id }, querry) {
		const updatedquerry = await Querry.findOneAndUpdate({ _id }, querry, {
			new: true,
			runValidators: true,
		});
		return updatedquerry;
	}

	static async deleteQuerry({ id: _id }) {
		const querry = await Querry.findOneAndDelete({ _id });
		return querry;
	}
}

export default querryServices;
