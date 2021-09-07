const httpStatus = require("http-status");
const faker = require("faker");

const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
	const user = {
		id: faker.datatype.uuid(),
		...req.body
	};

	res.location(`${req.baseUrl}${req.path}/${user.id}`.replace("//", "/"))
		.status(httpStatus.CREATED)
		.send(user);
});

const getUsers = catchAsync(async (req, res) => {
	const response = { users: [] };
	const count = faker.datatype.number({ min: 0, max: 100 });

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < count; i++) {
		response.users.push({
			id: faker.datatype.uuid(),
			name: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email()
		});
	}

	res.status(httpStatus.OK).send(response);
});

const getUser = catchAsync(async (req, res) => {
	const user =
		faker.datatype.number({ min: 0, max: 1 }) >= 0.5
			? {
					id: req.params.userId,
					name: faker.name.firstName(),
					lastName: faker.name.lastName(),
					email: faker.internet.email()
			  }
			: undefined;

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	res.status(httpStatus.FOUND).send(user);
});

const updateUser = catchAsync(async (req, res) => {
	const user = {
		id: req.params.userId,
		...req.body
	};

	res.status(
		faker.datatype.number({ min: 0, max: 1 }) >= 0.5
			? httpStatus.OK
			: httpStatus.CREATED
	).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
	// req.params.userId
	const number = faker.datatype.number({ min: 0, max: 1 });

	if (number >= 0.5) {
		res.status(httpStatus.OK).send();
	} else {
		res.status(httpStatus.NOT_FOUND).send();
	}
});

module.exports = {
	createUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser
};
