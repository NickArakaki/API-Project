# Acceptance Criteria
Goal: complete 100% of all the "Acceptance Criteria" checklist
## Feature: Application Header
Acceptance Criteria:
* On everypage of the site, the browser tab shows the app name and favicon
* On every page of the site, the logo is on the top left of the page
* On every page of the site, clicking the logo returns the user to the home page
* As the browser is resized, the header's width adjusts dynamically so the logo stays on the lfet, and the auth/user buttons stay on the right
## Feature: Log in
Acceptance Criteria:
* On every page of the site:
    * a "Log in" button (or drop down menu containing "Log in") must be at the top-right of the page
    * If using a drop down:
        * must contain a "Log in" option
        * must contain a "Sign up" option
* When clicking "Log in" it opens a modal pop-up that prompts the Username and Password input boxes and a "Log in" button
* Within the modal, the "Log in" button must be disable anytime the username is fewer than 4 characters, or the password is fewer than 6 characters
* Attempting to login with an invalid username or password must prompt the error message "The provided credentials were invalid"
* Upon logging in with a valid username and password, it must successfully log-in the user and sets their session cookie
* Upon logging in with a valid username and password, the "login" and "signup" buttons at the top of the page are hidden
* Upon logging n with a valid username and password, it shows the User Menu Button
* In the log-in modal, an extra link or button is available with the label "log in as Demo User". When clicked it will log the user into the "demo" account
* Upon closing the log-in modal, it resets errors and clears all data entered
## Feature: User Menu and Log Out
Acceptance Criteria:
* On every page of the site, I should be able to see a User Menu Button in the upper-right corner that opens a user drop down menu when clicked
* After a user successfully logs in, the user drop down menu contains the logged in user's first name as a greeting: "Hello, "first name""
* After a user successfully logs in, the user drop down menu contains the logged in user's email
* after a user successfully logs in, the user drop down menu contains a "log out" button as a menu option
* after a user successfully logs in, the user menu does NOT contain the "log in" or "sign up" menu options
* Upon clicking anywhere outside the User Menu (including on the User Menu Button), the menu drop down hides
* Upon clicking the "Log out" menu option, it performs a logout where it will clear the session/cookie
* Upon clicking the "log out" button, it performs a log out where it will close the user drop down menu
* Upon clicking the "log out" button, it performs a logout where it will navigate the user to the home page ('/')
## Feature: Sign Up
Acceptance Criteria:
* When logged out, I should see a "Sign up" button next to the "login" button (or drop down menu containing a "Sign up" menu option below a "login" menu option) int he top-right corner of the header on every page of the site
* Upon clicking "Sign up" to open the sign-up modal pop-up window, a new user account form
* The new user account form should show placeholders or labels and input boxes for: "First Name", "Last Name", "Email", "Username", "Password", and "Confirm Password"
* The new user account form should show a "Sign up" button after all the input boxes
* The "Sign up" button should be disabled when any field is empty
* The the "Sign up" button should be disabled when the "Username" field is fewer than 4 characters
* The "Signup" button should be disabled when the "Password" field is fewer than 6 characters
* The "Sign up" button should be disabled when the field for "Confirm password" does not match the field for "Password"
* When clicking "Sign up" button on the new user account form with errors in teh form, it must show all error messages returned from the backend
* Upon closing and reopening sign-up modal, the errors are reset (all errors displayed before closing the modal are gone)
* Upon closing and reopening sign-up modal, all fields are empty (all data entered before has been cleared)
* Upon closing and reopening sign-up modal, the "Sign up" button on the new user account from is diabled
* After a successful sign-up is completed, the new user should automatically be logged in and see the User Menu with their information entered during sign-up with a "Log out" menu option, but not "login" or "signup" menu options
* After a successful sign-up is completed, if the new user refereshes the browser, they should still see the User Menu Button with the new user's information
## Feature: MVP Styling Requirements for Auth
Acceptance Criteria:
* The layout and element positioning is equivalent to the wireframes
* Buttons look like actual buttons. Form elements should look like form elements
* The text must be readable and colors be non-offensive
## Feature: Landing Page - List of All Spots
Acceptance Criteria:
* On the landing page of the site, I should see a tile list of all the spots
* Each spot tile in the tile list should have:
    * a thumbnail image
    * name of the spot
    * a star rating of "New" (if there are no reviews for that spot) or the average star rating of the spot as a decimal
    * the price for the spot followed by the label "night"
* Clicking any part of the spot tile should navigate to that spot's detail page
## Feature: View Spot Details
Acceptance Criteria:
* On the spot's detail page, the following info should be presented:
    * Heading (Spot Name)
    * Location (City, State, Country)
    * Images (1 large image, 4 small images)
    * Text (Hosted by firstName, lastName)
    * Paragraph (description)
    * Callout Information box on the right, below the images
* The callout info box on the right of the spot's detail page should state the price for the spot followed by the label "night", and have a "Reserve" button
* When the "Reserve button on the spot's detail page is clicked, it should open an alert with the text "feature coming soon"
## Feature: View Rating and Reviews
Acceptance Criteria:
* When viewing the home page, each spot tile in the tile list must show the avg star rating for that spot immediately below the thumbnail of the tile and to the right of the spot's name. The avg star rating should have a star icon followed by the avg start rating of all the reviews for that sopt as a decimal (e.g 3.0 or 4.9 not 3 or 5)
* When viewing a spot's detail page, the reivew summary info should be in two different places, the callout information box and the heading before the list of reviews. The review summary info should show the average star rating of all the reviews for that spot and the review count for that spot
* The average star rating in the spot's detail page should have a star icon followed by the average star rating of all the reviews for that spot as a decimal (e.g. 3.0 or 4.89, NOT 3 or 5).
* If there are no reviews for the spot, the text, "New", should be next to the star icon instead.
* The review count on the spot's detail page should be an integer representing the total number of reviews for that spot followed by the text "Reviews" (e.g. "4 Reviews")
* If the review count is 1, it should show "1 Review" (not "1 Reviews").
* There should be a centered dot (·) between the star rating and the review count
* If the review count is zero (there are no reviews yet for this spot), it should not show the centered dot or the review count (only the average star rating should be displayed)
* When viewing the spot's detail page, show a list of the reviews for the spot below the spot's information with the newest reviews at the top, and the oldest reviews at the bottom.
* Each review in the review list must include: The reviewer's first name, the month and the year that the review was posted (e.g. December 2022), and the review comment text.
* If no reviews have been posted yet and the current user is logged-in and is NOT the owner of the spot, replace the reviews list with the text "Be the first to post a review!"
## Feature: Create a New Spot
Acceptance Criteria:
* There should be a "Create a New Spot" button in the navigation bar to the left of the User Menu button for logged-in users.
* Upon clicking the "Create a New Spot" button, the user should be navigated to a blank form to gather the data for a new spot (see wireframe).
* On the new spot form, there should be: a title at the top with the text "Create a New Spot".
* The first section should include: a heading of "Where's your place located?", a caption of "Guests will only get your exact address once they booked a reservation.", and text inputs with labels and placeholders for "Country", "Street Address", "City", and "State" ("Latitude" and "Longitude" inputs are optional for MVP)
* The second section should include: a heading of "Describe your place to guests", a caption of "Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.", and a text area with a placeholder of "Please write at least 30 characters".
* The third section should include: a heading of "Create a title for your spot", a caption of "Catch guests' attention with a spot title that highlights what makes your place special.", and a text input with a placeholder of "Name of your spot".
* The fourth section should include: a heading of "Set a base price for your spot", a caption of "Competitive pricing can help your listing stand out and rank higher in search results.", and a number input with a placeholder of "Price per night (USD)".
* The fifth section should include: a heading of "Liven up your spot with photos", a caption of "Submit a link to at least one photo to publish your spot.", and five text inputs where the first input has a placeholder of "Preview Image URL" and the rest of the inputs have a placeholder of "Image URL".
* The submit button should have the text of "Create Spot".
* Validation messages must show at the top of the form or under each field with an error if the user tries to submit an incomplete form. Examples: a Required Field: " is required" (e.g. "Price per night is required", etc.), a Description Min Length: "Description needs 30 or more characters". Out of the five image URL inputs, only the first Image URL input (the Preview Image URL) is required.
* When a spot is successfully created, the user should automatically be navigated to the new spot's detail page.
* Navigating away and back to the create spot form form resets any errors and clears all data entered, so it displays in the default state (no errors, empty inputs, button disabled).
## Feature: Post a Review
Acceptance Criteria:
* If the current user is logged-in and they are viewing a spot's detail page for a spot that they HAVE NOT posted a review yet, a "Post Your Review" button shows between the rating/reviews heading and the list of reviews.
* If the current user is logged-in and they are viewing a spot's detail page for a spot that they are an owner of, the "Post Your Review" button should be hidden.
* If the current user is logged-in and they are viewing a spot's detail page for a spot that they HAVE posted a review for, the "Post Your Review" button should be hidden.
* If the current user is NOT logged-in and they are viewing a spot's detail page for a spot, the "Post Your Review" button should be hidden.
* Clicking "Post Your Review", opens a modal popup window containing the new review form.
* On the new review form, there should be a title at the top with the text "Create a New Spot"
* There should be a comment text area with a placeholder of "Leave your review here...".
* There should be a star rating input ranging from 1 to 5 stars followed by a label of "Stars".
* The submit button should have the text of "Submit Your Review".
* The "Submit Your Review" button is disabled when there are fewer than 10 characters in the comment text area and when the star rating input has no stars selected.
* If a server error occurs, show it below the title. (But that shouldn't happen under normal circumstances).
* When the review is successfully created, the newly created review should show up at the bottom of the reviews list.
* When the review is successfully created, the average star rating and review summary info should be updated in both places.
* Closing the model resets any errors and clears all data entered. Once it reopens, it must be in the default state (no errors, empty inputs, button disabled).
## Feature: Manage Spots
Acceptance Criteria:
* When opening the user drop down menu and selecting "Manage Spots", it should navigate the user to the spot management page which shows the the list of all the spots created by the user.
* The spot management page should contain a heading with the text "Manage Spots".
* If no spots have been posted yet by the user, show a "Create a New Spot" link, which links to the new spot form page, instead of the spot list.
* The spot management page should contain a spot tile list similar to the one in the landing page (thumbnail image, location, rating, price).
* Each spot in the spot tile list on the spot management page should contain an additional two buttons, "Update" and "Delete" buttons, to the right of the price.
## Feature: Update a Spot
Acceptance Criteria:
* Clicking "Update" on one of the spot tiles on the spot management page navigates the user to the update spot form which looks like the same as the create a new spot form, but pre-populated with the values stored in the database for the spot that was clicked, the title changed to "Update your Spot", and with a submit button text of "Update your Spot". Image URL inputs on the update spot form are optional for MVP.
* Navigating to the update spot form as a user who is logged-in but does not own the spot or as a user who is not logged-in will not show the update spot form and automatically navigate the user to the landing page.
* When the update form submission is successful, the user is navigated to the updated spot's details page.
* The updated spot's detail page should display the updated information. No refresh should be necessary.
## Feature: Delete a Spot
Acceptance Criteria:
* Clicking "Delete" on one of the spot tiles on the spot management page opens a confirmation modal popup that should contain: a Title: "Confirm Delete", a Message: "Are you sure you want to remove this spot?", a Red button: "Yes (Delete Spot)", and a Dark grey button: "No (Keep Spot)".
* After a spot is deleted, it should be removed from the spot list in the spot management page and in the landing page. No refresh should be necessary.
## Feature: Delete a Review:
Acceptance Criteria:
* On a review that the logged-in user has posted, there should be a "Delete" button below the review's comment.
* On a review that the logged-in user did NOT post, the "Delete" button should be hidden.
* Clicking the "Delete" button on a review will open a confirmation modal popup window that should contain: a Title: "Confirm Delete", a Message: "Are you sure you want to delete this review?", a Red button: "Yes (Delete Review)", and a Dark grey button: "No (Keep Review)".
* Clicking the "Delete" button on a review should not delete the review. Clicking the "Yes (Delete Review)" button in the confirmation modal should delete the review.
* After a review is deleted, it should be removed from the review list in the review management page and in the spot's detail page. No refresh should be necessary.
