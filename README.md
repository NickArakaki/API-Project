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
