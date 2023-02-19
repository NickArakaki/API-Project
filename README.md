# About Couch Crashers
Couch crashers is a web application inspired by AirBnB, that provides an online marketplace for lodging, primarily homestays with an extra couch for vacationers or traveling business people. [Click here to view the Couch Crashers site.](https://couchcrashers.onrender.com/)

### Links to the project wiki:
- [API Routes](https://github.com/NickArakaki/Couch-Crashers/wiki/API-routes)
- [Database Schema](https://github.com/NickArakaki/Couch-Crashers/wiki/Database-schema)
- [Features](https://github.com/NickArakaki/Couch-Crashers/wiki/Features)
- [Redux State Shape](https://github.com/NickArakaki/Couch-Crashers/wiki/Redux-State-Shape)

### This project was built with:
- NodeJS
- JavaScript
- PostgreSQL (production)
- SQLite3 (development)
- Sequelize
- Express
- React
- Redux

### Launch Application Locally
To launch Couch Crashers locally be sure to:
* Install the dependencies in both the frontend and backend folders using the command `npm install`
* Create a .env file in the backend folder that will be used to define environment variables.
    * Populate the .env file based on the .env.example file in the backend folder
    * Recommended to assign PORT to 8000 (if you choose to use a different port be sure to update the proxy path in `frontend/package.json` )
* run the command `npm run db-reset && npm start` in the root of the backend folder, and in another terminal run the command `npm start` in the root of the frontend folder
