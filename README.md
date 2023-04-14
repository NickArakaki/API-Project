# About Couch Crashers
Couch crashers is a web application inspired by AirBnB, that provides an online marketplace for lodging, primarily homestays with an extra couch for vacationers or traveling business people. [Click here to view the Couch Crashers site.](https://couchcrashers.onrender.com/)

### Landing Page
![couch-crashers-landing-page]

[couch-crashers-landing-page]:./assets/landing-page.png

### Helpful Links:
- [API Routes](https://github.com/NickArakaki/Couch-Crashers/wiki/API-routes)
- [Database Schema](https://github.com/NickArakaki/Couch-Crashers/wiki/Database-schema)
- [Features](https://github.com/NickArakaki/Couch-Crashers/wiki/Features)
- [Redux State Shape](https://github.com/NickArakaki/Couch-Crashers/wiki/Redux-State-Shape)

### This project was built with:
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


### Launch Application Locally
To launch Couch Crashers locally:
1. Clone this repository:
   ```
   https://github.com/NickArakaki/Couch-Crashers.git
   ```
   
2. Install dependencies in both the backend and frontend directories.  Make a new terminal for each directory and run the following command:
   ```
   npm install
   ```
   
3. Create a .env file in the backend folder that will be used to define environment variables.
    * Populate the .env file based on the .env.example file in the backend folder
    * Recommended to assign PORT to 8000 (if you choose to use a different port be sure to update the proxy path in `frontend/package.json` )
    
4. In the root of the backend directory, run the command:
   ```
   npm run db-reset && npm start
   ``` 
      * This will seed and start the database
      
5. In the root of the frontend directory, run the command:
   ```
   npm start
   ```
   * This will start the app for the frontend
   * You should be redirect to `http://localhost:3000/` and see the Couch Crashers landing page
   
### API Routes
Some of the API Routes implemented in this project.
To see more please checkout the [API Routes](https://github.com/NickArakaki/Couch-Crashers/wiki/API-routes) in the wiki

#### All endpoints that require authentication
All endpoints that require a current user to be logged in.
* Request: endpoints that require authentication
* Error Response: Require Authentication
   * Status Code: 401
   * Headers:
      * Content-Type: application/json
   * Body:
   ```json
   {
     "message": "Authentication required",
     "statusCode": 401
   }
   ```

#### All endpoints that require proper authorization
All endpoints that require authentication and the current user does not have the correct role(s) or permission(s)

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
   * Status Code: 403
   * Headers:
      * Content-Type: application/json
   * Body:
   ```json
   {
     "message": "Forbidden",
     "statusCode": 403
   }
   ```

#### Create a Spot
Creates and returns a new spot

* Require Authentication: true

* Request: 
   * Method: POST
   * URL: /api/spots
   * Headers:
      * Content-Type: application/json
   * Body:
   ```json
   {
     "address": "123 Disney Lane",
     "city": "San Francisco",
     "state": "California",
     "country": "United States of America",
     "lat": 37.7645358,
     "lng": -122.4730327,
     "name": "App Academy",
     "description": "Place where web developers are created",
     "price": 123
   }
   ```

* Successful Response:
   * Status Code: 201
   * Headers:
      * Content-Type: application/json
   * Body:
   ```json
   {
     "id": 1,
     "ownerId": 1,
     "address": "123 Disney Lane",
     "city": "San Francisco",
     "state": "California",
     "country": "United States of America",
     "lat": 37.7645358,
     "lng": -122.4730327,
     "name": "App Academy",
     "description": "Place where web developers are created",
     "price": 123,
     "createdAt": "2021-11-19 20:39:36",
     "updatedAt": "2021-11-19 20:39:36"
   }
   ```

* Error Response: Body Validation Error
   * Status Code: 400
   * Headers: 
      * Content-Type: application/json
   * Body:
   ```json
   {
     "message": "Validation Error",
     "statusCode": 400,
     "errors": {
       "address": "Street address is required",
       "city": "City is required",
       "state": "State is required",
       "country": "Country is required",
       "lat": "Latitude is not valid",
       "lng": "Longitude is not valid",
       "name": "Name must be less than 50 characters",
       "description": "Description is required",
       "price": "Price per day is required"
     }
   }
   ``` 
