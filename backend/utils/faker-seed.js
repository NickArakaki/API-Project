const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const randomNum = num => Math.ceil(Math.random() * num);

const seedUsers = num => {
    const users = new Array(num).fill('');

    for (const i in users) {
        users[i] = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.userName(),
            hashedPassword: bcrypt.hashSync('password'),
            email: faker.internet.email()
        };
    }

    // DEMO USER
    users[0] = {
        firstName: "Demo",
        lastName: "User",
        username: "DemoUser",
        hashedPassword: bcrypt.hashSync('password'),
        email: "demo@user.com"
    };

    return users;
}

const seedSpots = num => {
    const spots = new Array(num).fill('');

    for (const i in spots) {
        spots[i] = {
            ownerId: Number(i) + 1,
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(),
            country: 'USA',
            lat: faker.address.latitude(),
            lng: faker.address.longitude(),
            name: faker.company.name(),
            description: faker.lorem.paragraph(randomNum(3)),
            price: faker.commerce.price()
        }
    }

    return spots;
}

const seedBookings = num => {
    const bookings = new Array(num).fill('');

    for (const i in bookings) {
        bookings[i] = {
            spotId: randomNum(100),
            userId: randomNum(100),
            startDate: faker.date.past(),
            endDate: faker.date.soon(),
        }
    }

    return bookings
}

const seedReviews = num => {
    const reviews = new Array(num).fill('');

    for (const i in reviews) {
        reviews[i] = {
            spotId: randomNum(100),
            userId: randomNum(100),
            review: faker.lorem.paragraph(randomNum(7)),
            stars: randomNum(5)
        }
    }

    return reviews;
}

const seedSpotImages = num => {
    const spotImages = new Array(num * 5).fill('');

    for (const i in spotImages) {
        spotImages[i] = {
            spotId: (Math.floor(Number(i) / 5) + 1),
            url: faker.image.cats(),
            preview: Number(i) % 5 === 0 ? true : false
        }
    }

    return spotImages
}

const seedReviewImages = num => {
    const reviewImages = new Array(num).fill('');

    for (const i in reviewImages) {
        reviewImages[i] = {
            reviewId: randomNum(100),
            url: faker.image.animals(),
        }
    }

    return reviewImages
}

module.exports = {
    seedUsers,
    seedSpots,
    seedBookings,
    seedReviews,
    seedSpotImages,
    seedReviewImages
}
