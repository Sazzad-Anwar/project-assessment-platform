/*
* * @Description: Insert bulk users
* * @Route: /api/v1/users/bulkInsert
* * @Method: POST
! * @Access: Admin
*/
const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/User.js");
const { faker } = require('@faker-js/faker');
const bulkUserInsert = require("../../utils/InputValidation/builkUserInsert.js");
const { getRefreshToken } = require("auth-middleware-jwt");
const bcrypt = require('bcryptjs');

const bulkUsersInsert = expressAsyncHandler(async (req, res) => {

    let users = [];

    for (let i = 0; i < 100; i++) {

        let salt = await bcrypt.genSalt(10);

        let newUser = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.phoneNumber(),
            role: i % 2 === 0 ? 'student' : 'mentor',
            password: await bcrypt.hash('user123456', salt)
        };

        newUser.refreshToken = await getRefreshToken({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
        });

        users.push(newUser);

        console.log('user added =>', i);
    }

    let newUsers = await User.insertMany(users);
    let userCount = await User.count();

    res.status(201).json({
        status: "success",
        dataCount: userCount,
        data: newUsers,
    });

});

module.exports = bulkUsersInsert;