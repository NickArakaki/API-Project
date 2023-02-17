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
            ownerId: [Number(i) + 1],
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
    const imageURLs = [
        "https://miro.medium.com/max/1050/1*NuBoIpSdzvEpRDY9ClE-Uw.jpeg",
        "https://m.media-amazon.com/images/I/71ZPlj+mwrL.jpg",
        "https://m.media-amazon.com/images/I/81iRdPGmFUL._AC_UF894,1000_QL80_.jpg",
        "https://thecrochetcrowd.com/wp-content/uploads/2020/11/Crochet-Kitty-Couch.jpg",
        "https://i.etsystatic.com/11337588/r/il/0f41fd/3407240441/il_fullxfull.3407240441_g6e6.jpg",
        "http://static.demilked.com/wp-content/uploads/2020/05/5eafc5cebfbbe-Bx6DA5vBVXY-png__700.jpg",
        "https://www.yarnspirations.com/dw/image/v2/BBZD_PRD/on/demandware.static/-/Sites-master-catalog-spinrite/default/dw118935d5/images/hi-res/RHC0720-029832M-2.jpg?sw=2000&sh=2000&sm=fit&q=60",
        "https://thecrochetcrowd.com/wp-content/uploads/2020/11/Crochet-Kitty-Couch.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYemmqE5DVphge9SQ61VGcwjPLzCKpDE9ZNLNtwl9nO35PYlw7jK2RfTfz9MoEDCzWbyk&usqp=CAU",
        "https://mymodernmet.com/wp/wp-content/uploads/2017/10/okawa-city-cat-furniture-thumbnail.jpg",
        "https://cdn0.wideopenpets.com/wp-content/uploads/2017/10/cat-1.jpg",
        "https://cdn.shopify.com/s/files/1/1914/3207/products/Moccasin-Brown-Cover_1024x1024@2x.jpg?v=1597027574",
        "https://images4-f.ravelrycache.com/uploads/mintyrae/380685549/green_sofa_medium2.jpg",
        "https://cattitudedaily.com/wp-content/uploads/2021/04/il_1140xN.2995155468_k2hr.jpg",
        "https://www.thesprucepets.com/thmb/-Y_jh8lqLq9K8THyaXJYtnWNbR8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1221733442-6f9b4e36ba4d4b3aa87167e2b4cb9dc4.jpg",
        "https://secure.img1-cg.wfcdn.com/im/50703345/compr-r85/8807/88077577/heise-dog-sofa-in-silver.jpg",
        "https://assets.orvis.com/is/image/orvisprd/2Z7L6321SD_W_038?wid=1200&src=is($object$:1-1)",
        "https://cdni.llbean.net/is/image/wim/266678_13808_41?hei=1095&wid=950&resMode=sharp2&defaultImage=llbprod/A0211793_2",
        "https://media.architecturaldigest.com/photos/61646e5cec23e344aa35c601/master/pass/il_794xN.2728208951_3unu.jpg",
        "https://foter.com/photos/424/scrolled-dog-sofa.jpeg",
        "https://people.com/thmb/uA9JjA_ShPTxQnt_athReWvbjxA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/dogbedstout-836c92587e974b60873ca1328275b409.jpg",
        "https://boingboing.net/wp-content/uploads/2014/08/BmYkl3OCcAEYigY.jpg-large.jpeg?w=640",
        "https://media.gq.com/photos/5e5e98493cd32e0008c31f58/master/w_3000,h_2175,c_limit/ugly-chairs-gqstyle-spring-05.jpg",
        "https://www.allthingsthrifty.com/wp-content/uploads/2014/04/dont-paint-a-couch.jpg",
        "https://m.media-amazon.com/images/I/714dyLk7jJL._AC_SX425_.jpg",
        "https://thehardtimes.net/wp-content/uploads/2017/02/unnamed-29.jpg",
        "https://cdn.shopify.com/s/files/1/0514/6794/4099/products/statelymodernsofaingoldenolivevelvet-brooklynspace32_2.jpg?v=1673197881",
        "https://ak1.ostkcdn.com/images/products/is/images/direct/61190cf4bec16c656f2e0011561886e72592d5b4/104%22-Modern-Velvet-Upholstered-Sofa-4-Seater-Sofa-Luxury-Sofa-Solid-Wood-Frame.jpg",
        "https://cdn2.sofadreams.com/media/catalog/product/cache/c41fae4236734eb803fb4c6a8d783161/s/c/schlaffunktion_palermo_xl_5.jpg",
        "https://passerini.com/wp-content/uploads/2020/03/Luxury-Sofas-Online.jpg",
        "https://cdn.shopify.com/s/files/1/1425/0242/products/3edc.jpg?v=1626132030",
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1656426290-14-1656426285.jpg",
        "https://nyfurnitureoutlets.com/product/benetti-s-salvatore-luxury-tufted-sectional-sofa-rark-brown-wood-classic/original/077012-1-198906583301.jpg",
        "https://img1.homary.com/filters:format(webp)/fit-in/600x600/mall/2021/04/06/8456bff9d2a6434cbba15ce21a980f1b.jpg"
    ]
    const spotImages = new Array(num * 5).fill('');

    for (const i in spotImages) {
        spotImages[i] = {
            spotId: (Math.floor(Number(i) / 5) + 1),
            url: imageURLs[randomNum(imageURLs.length - 2)],
            preview: Number(i) % 5 === 0 ? true : false
        }
    }

    // loop over spotImages replace the obj with preview true with random image?

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
