This project is built for learning backend development with:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt password hashing
- MVC structure

Now this project has two modules:
- Authentication Module
- Event Management Module

The code is intentionally simple and heavily commented.

## 1) Project Structure

```text
Event Booking App/
  .env
  .env.example
  .gitignore
  package.json
  server.js
  src/
    config/
      db.js
    models/
      User.js
      Event.js
    controllers/
      authController.js
      eventController.js
    routes/
      authRoutes.js
      userRoutes.js
      eventRoutes.js
    middleware/
      authMiddleware.js
      errorMiddleware.js
      validateRequest.js
    utils/
      generateToken.js
```

## 2) Why Each Folder Exists

- src/config
  - Keeps app configuration logic.
  - Here we keep MongoDB connection in db.js.

- src/models
  - Keeps MongoDB data schemas.
  - Here User.js describes how user records are stored.
  - Event.js describes how event records are stored.

- src/controllers
  - Keeps business logic for each request.
  - Here we register, login, logout, and fetch logged-in user.
  - eventController.js contains create/get/update/delete/search/filter logic for events.

- src/routes
  - Keeps API endpoints.
  - Each route file is separate to keep things clean and simple.
  - authRoutes.js has register/login/logout routes.
  - userRoutes.js has protected user route.
  - eventRoutes.js has all event endpoints.

- src/middleware
  - Keeps reusable middle functions that run before controllers.
  - authMiddleware.js checks JWT.
  - validateRequest.js checks validation errors.
  - errorMiddleware.js handles errors globally.

- src/utils
  - Keeps helper functions.
  - generateToken.js creates JWT token.

## 2.1) Beginner Explanation of Every File

- server.js
  - Starts the Express app.
  - Connects MongoDB.
  - Registers middleware.
  - Connects all route files.

- src/config/db.js
  - Contains database connection function.
  - Uses Mongoose to connect to MongoDB.

- src/models/User.js
  - Defines user fields (name, email, password).
  - Tells MongoDB how user documents should look.

- src/models/Event.js
  - Defines event fields (title, description, location, date, time, price, seats, image, category, organizer).
  - Tells MongoDB how event documents should look.

- src/controllers/authController.js
  - Handles auth business logic.
  - Register, login, logged-in user, logout.

- src/controllers/eventController.js
  - Handles event business logic.
  - Create Event, Get All, Get One, Update, Delete.
  - Also handles search/filter/pagination/sorting in one simple function.

- src/routes/authRoutes.js
  - Defines auth API URLs and validation rules.

- src/routes/userRoutes.js
  - Defines protected user URL (/me).

- src/routes/eventRoutes.js
  - Defines event API URLs and validation rules.

- src/middleware/authMiddleware.js
  - Checks JWT token.
  - Allows only logged-in users for protected routes.

- src/middleware/validateRequest.js
  - Checks validation result from express-validator.
  - Returns 400 if user input is invalid.

- src/middleware/errorMiddleware.js
  - Handles not found routes.
  - Handles all runtime errors in one place.

- src/utils/generateToken.js
  - Creates JWT token after login/register.

## 3) How to Run

1. Install MongoDB locally and make sure it is running.
2. Open terminal in project folder.
3. Install dependencies:

```bash
npm install
```

4. Update .env values if needed.
5. Run development server:

```bash
npm run dev
```

Server should run at:
- http://localhost:5000

## 4) API Endpoints

Base URL:
- http://localhost:5000

### A) Register User
- Method: POST
- URL: /api/auth/register
- Body (JSON):

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Success Response:

```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### B) Login User
- Method: POST
- URL: /api/auth/login
- Body (JSON):

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Success Response:

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### C) Get Logged-In User (Protected)
- Method: GET
- URL: /api/users/me
- Headers:

```text
Authorization: Bearer <jwt_token_here>
```

Success Response:

```json
{
  "message": "Logged-in user fetched successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### D) Logout
- Method: POST
- URL: /api/auth/logout

Success Response:

```json
{
  "message": "Logout successful"
}

## 4.1) Event Management APIs

### A) Create Event (Protected)
- Method: POST
- URL: /api/events
- Headers:

```text
Authorization: Bearer <jwt_token_here>
Content-Type: application/json
```

- Body:

```json
{
  "title": "Node.js Workshop",
  "description": "Beginner workshop for backend development",
  "location": "Community Hall",
  "date": "2026-09-10",
  "time": "10:30 AM",
  "price": 499,
  "availableSeats": 120,
  "image": "https://example.com/poster.jpg",
  "category": "Tech"
}
```

### B) Get All Events
- Method: GET
- URL: /api/events

Optional query parameters:
- search
- category
- minPrice
- maxPrice
- page
- limit
- sortBy
- order (asc or desc)

Example:

```text
GET /api/events?search=workshop&category=Tech&minPrice=100&maxPrice=1000&page=1&limit=5&sortBy=price&order=asc
```

### C) Get Single Event
- Method: GET
- URL: /api/events/:id

### D) Update Event (Protected)
- Method: PUT
- URL: /api/events/:id
- Headers:

```text
Authorization: Bearer <jwt_token_here>
Content-Type: application/json
```

- Body (send only fields you want to update):

```json
{
  "price": 599,
  "availableSeats": 100
}
```

### E) Delete Event (Protected)
- Method: DELETE
- URL: /api/events/:id
```

## 5) Postman Examples (Copy-Paste)

### Register Request
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Headers:
  - Content-Type: application/json
- Body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "123456"
}
```

### Login Request
- Method: POST
- URL: http://localhost:5000/api/auth/login
- Headers:
  - Content-Type: application/json
- Body:

```json
{
  "email": "alice@example.com",
  "password": "123456"
}
```

### Protected Route Request
- Method: GET
- URL: http://localhost:5000/api/users/me
- Headers:
  - Authorization: Bearer paste_token_from_login

### Logout Request
- Method: POST
- URL: http://localhost:5000/api/auth/logout

### Create Event Request
- Method: POST
- URL: http://localhost:5000/api/events
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer paste_token_from_login
- Body:

```json
{
  "title": "React Meetup",
  "description": "Community meetup for frontend developers",
  "location": "Downtown Center",
  "date": "2026-10-15",
  "time": "06:00 PM",
  "price": 300,
  "availableSeats": 80,
  "image": "https://example.com/react.jpg",
  "category": "Tech"
}
```

### Get All Events Request
- Method: GET
- URL: http://localhost:5000/api/events

### Search + Filter + Pagination + Sorting Request
- Method: GET
- URL: http://localhost:5000/api/events?search=meetup&category=Tech&minPrice=100&maxPrice=500&page=1&limit=10&sortBy=price&order=asc

### Get Single Event Request
- Method: GET
- URL: http://localhost:5000/api/events/<event_id>

### Update Event Request
- Method: PUT
- URL: http://localhost:5000/api/events/<event_id>
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer paste_token_from_login
- Body:

```json
{
  "location": "Updated Hall",
  "price": 450
}
```

### Delete Event Request
- Method: DELETE
- URL: http://localhost:5000/api/events/<event_id>
- Headers:
  - Authorization: Bearer paste_token_from_login

## 6) Validation and Error Handling

- Validation:
  - express-validator checks input fields in routes.
  - validateRequest middleware returns 400 if input is wrong.

- Error handling:
  - Controllers throw errors when something fails.
  - errorHandler middleware sends clean JSON error responses.
  - notFound middleware handles unknown routes.

## 6.1) CRUD Explanation (Beginner)

CRUD means the 4 basic data operations:
- Create: add new data
- Read: get data
- Update: change existing data
- Delete: remove data

In this Event module:
- Create -> POST /api/events
- Read all -> GET /api/events
- Read one -> GET /api/events/:id
- Update -> PUT /api/events/:id
- Delete -> DELETE /api/events/:id

## 6.2) HTTP Methods Used

- POST
  - Used when we create data.
  - Example: create event, register, login.

- GET
  - Used when we read/fetch data.
  - Example: get all events, get one event.

- PUT
  - Used when we update existing data.
  - Example: update event.

- DELETE
  - Used when we remove existing data.
  - Example: delete event.

## 6.3) Status Codes Used

- 200 OK
  - Request succeeded.
  - Example: fetch events, update success, delete success.

- 201 Created
  - New resource created.
  - Example: register user, create event.

- 400 Bad Request
  - Input is wrong or invalid.
  - Example: validation fail, invalid event id format.

- 401 Unauthorized
  - User not logged in or token invalid.
  - Example: protected route without valid token.

- 404 Not Found
  - Requested resource does not exist.
  - Example: event id not found.

- 500 Internal Server Error
  - Unexpected server-side error.

## 7) Request Travel (Beginner Explanation)

Flow:
Client -> Route -> Controller -> Model -> MongoDB -> Response

Step-by-step:
1. Client sends HTTP request.
   - Example: POST /api/auth/register from Postman.

2. Route receives request first.
   - In authRoutes.js, Express matches /register.
   - Validation middleware checks request body.

3. Controller runs after route.
   - registerUser function reads name/email/password.
   - It checks if user already exists.
   - It hashes password with bcrypt.

4. Model talks to MongoDB.
   - User model creates document in users collection.
   - Mongoose converts JS object to MongoDB document.

5. MongoDB stores or fetches data.
   - Data is inserted or queried from database.

6. Controller builds response.
   - Generates JWT token.
   - Sends JSON response back to client.

7. Client receives response.
   - Postman/frontend now gets success or error JSON.

That is the full lifecycle of one API request.

## 7.1) MongoDB Queries in Simple English

These queries are used in controllers:

- find()
  - Used in Get All Events.
  - Simple meaning: "Give me all event documents that match these conditions."
  - Example in this project: search text, filter category, filter price, then return matching events.

- findById()
  - Used in Get Single Event and Get Logged-in User.
  - Simple meaning: "Give me one document that has this exact _id."

- save()
  - Used in Create Event when we do `new Event(...)` then `event.save()`.
  - Simple meaning: "Take this new event object and store it in MongoDB."

- findByIdAndUpdate()
  - Used in Update Event.
  - Simple meaning: "Find this document by _id, update it, and return the updated version."

- findByIdAndDelete()
  - Used in Delete Event.
  - Simple meaning: "Find this document by _id and remove it from MongoDB."

## 7.2) How Express Talks with MongoDB

Express does not talk directly to MongoDB by itself.
It uses Mongoose as a bridge.

Step-by-step:
1. You send request to Express route.
2. Route calls controller function.
3. Controller uses Mongoose model (User/Event).
4. Mongoose converts JS query/object into MongoDB query format.
5. MongoDB executes query and sends result back to Mongoose.
6. Mongoose returns data to controller.
7. Controller sends final JSON response to client.

In short:
- Express handles HTTP.
- Mongoose handles database communication.
- MongoDB stores data.

## 8) Next Learning Steps

1. Add event model and event CRUD routes.
2. Add role-based authorization (admin/user).
3. Add refresh token flow.
4. Add automated tests using Jest + Supertest.

## 9) Booking Module (New Feature)

### 9.1 Files Added for Booking

- src/models/Booking.js
  - Stores booking data.
  - Links a user with an event.
  - Saves seatsBooked, totalPrice, and status.

- src/controllers/bookingController.js
  - Contains booking business logic.
  - Create booking.
  - Get my bookings.
  - Cancel booking.

- src/routes/bookingRoutes.js
  - Contains booking endpoints.
  - Adds request validation.
  - Protects routes using JWT middleware.

### 9.2 Booking Endpoints

- POST /api/bookings
  - Create a booking.
  - Protected route (requires JWT token).

- GET /api/bookings/my
  - Get all bookings of logged-in user.
  - Protected route.

- PUT /api/bookings/:id/cancel
  - Cancel one booking.
  - Protected route.

### 9.3 Postman Testing Steps (Backend First)

1. Register user.
2. Login user and copy token from response.
3. Create event using /api/events and your token.
4. Copy event id.
5. Create booking using /api/bookings.
6. Call /api/bookings/my to see your booking list.
7. Cancel booking using /api/bookings/:id/cancel.

Create Booking request body:

```json
{
  "eventId": "paste_event_id_here",
  "seatsBooked": 1
}
```

Authorization header for protected routes:

```text
Authorization: Bearer paste_jwt_token_here
```

## 10) Flutter App (Simple Client)

Flutter client folder:
- mobile_app

### 10.1 Packages Used in Flutter

- http
  - Used to call backend APIs.
  - Sends GET, POST, PUT requests.

- shared_preferences
  - Used to store JWT token locally.
  - Token stays saved after app restart.

### 10.2 Flutter Files Added

- mobile_app/lib/config/api_config.dart
  - Stores backend API base URL.

- mobile_app/lib/services/api_service.dart
  - Keeps API call code in one place.
  - Handles register, login, get events, create booking, get bookings, cancel booking.

- mobile_app/lib/screens/auth_screen.dart
  - Login/Register UI.

- mobile_app/lib/screens/events_screen.dart
  - Shows all events.
  - Lets user book one seat.

- mobile_app/lib/screens/my_bookings_screen.dart
  - Shows user bookings.
  - Allows booking cancel action.

- mobile_app/lib/main.dart
  - App entry point.
  - Checks token and opens auth or events screen.

## 11) Request-Response Cycle (Complete Beginner View)

Example: Flutter creates booking

1. User taps "Book 1 Seat" in Flutter.
2. Flutter sends POST /api/bookings with JSON body.
3. Flutter includes JWT in Authorization header.
4. Express route /api/bookings receives request.
5. auth middleware verifies JWT token.
6. controller createBooking runs logic.
7. controller queries Event model by eventId.
8. MongoDB returns event data.
9. controller updates available seats and saves booking.
10. MongoDB stores changes.
11. controller sends JSON success response.
12. Flutter reads JSON and shows message on screen.

## 12) JSON Send/Receive Example

JSON sent by Flutter:

```json
{
  "eventId": "68b1234abc...",
  "seatsBooked": 2
}
```

JSON returned by backend:

```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "68b999...",
    "user": "68a111...",
    "event": "68b1234abc...",
    "seatsBooked": 2,
    "totalPrice": 998,
    "status": "booked"
  }
}
```

## 13) JWT Authentication in Simple English

- JWT is a token string returned after login/register.
- Flutter stores this token in SharedPreferences.
- For protected endpoints, Flutter sends token in header:

```text
Authorization: Bearer your_token_here
```

- Backend middleware verifies token.
- If valid, request continues.
- If invalid or missing, backend returns 401.

## 14) MongoDB Queries Used in Booking Module

- Event.findById(eventId)
  - Meaning: find one event by id.

- event.save()
  - Meaning: save updated event document (for seats change).

- booking.save()
  - Meaning: save new booking document.

- Booking.find({ user: req.user.id })
  - Meaning: get all bookings where logged-in user id matches.

- Booking.findById(id)
  - Meaning: find one booking by id.

## 15) Common Errors and Debugging Tips

- 401 Not authorized
  - Cause: missing or invalid token.
  - Fix: login again and send Authorization header.

- 400 Validation failed
  - Cause: required field missing or wrong type.
  - Fix: check request body and route validation rules.

- 404 Not found
  - Cause: wrong endpoint or wrong Mongo id.
  - Fix: verify URL path and id.

- MongoDB connection error
  - Cause: MongoDB server is not running or wrong MONGO_URI.
  - Fix: start MongoDB and verify .env values.

- Flutter cannot reach API
  - Cause: wrong base URL.
  - Fix: use 10.0.2.2 for Android emulator, or device-accessible LAN IP for physical device.

## 16) Feature Summary (Booking)

What we built:
- Backend booking APIs with seat handling.
- Protected routes using JWT.
- Flutter screens to consume auth, event, and booking APIs.
- Token storage using SharedPreferences.

Simple API flow diagram:

```mermaid
flowchart LR
  A[Flutter App] --> B[Express Route]
  B --> C[Auth Middleware JWT Check]
  C --> D[Booking Controller]
  D --> E[Mongoose Model]
  E --> F[MongoDB]
  F --> D
  D --> A
```

Short quiz:
1. Which HTTP method is used to create a booking?
2. Where is JWT stored in Flutter in this project?
3. What does Booking.find({ user: req.user.id }) return?
4. Why do we decrease availableSeats when booking is created?

Practice task (without solution):
1. Add a new endpoint to get one booking by id for logged-in user only.
2. Add a Flutter button to refresh bookings manually.

## 17) Complete Authentication Module (Backend + Flutter)

This section focuses only on authentication learning.

### 17.1 Authentication Files and Why They Exist

- src/models/User.js
  - Stores user data in MongoDB.
  - Fields: name, email, password.

- src/controllers/authController.js
  - Contains auth business logic.
  - registerUser, loginUser, logoutUser, getCurrentUser.

- src/routes/authRoutes.js
  - Contains auth endpoints.
  - Adds validation rules.
  - Uses protect middleware on /me and /logout.

- src/middleware/authMiddleware.js
  - Verifies JWT token from Authorization header or cookie.
  - If valid, user data is attached to req.user.

- src/utils/generateToken.js
  - Creates JWT token after login/register.

- mobile_app/lib/services/api_service.dart
  - Flutter API calls for register/login/logout/current-user.

- mobile_app/lib/screens/auth_screen.dart
  - Register and login form UI.

- mobile_app/lib/screens/events_screen.dart
  - Uses getCurrentUser() and logout() to show auth in action.

### 17.2 Authentication Endpoints Explained

- POST /api/auth/register
  - Creates new user account.
  - Hashes password before saving.
  - Returns JWT token and basic user info.

- POST /api/auth/login
  - Checks email + password.
  - If valid, returns JWT token and user info.

- GET /api/auth/me
  - Protected route.
  - Reads token, verifies it, returns current user profile.

- POST /api/auth/logout
  - Protected route.
  - Clears token cookie on backend.
  - Flutter also removes token from SharedPreferences.

### 17.3 Postman Test First (Step by Step)

1. Register
  - Method: POST
  - URL: http://localhost:5000/api/auth/register
  - Body:

```json
{
  "name": "Beginner User",
  "email": "beginner@example.com",
  "password": "123456"
}
```

2. Login
  - Method: POST
  - URL: http://localhost:5000/api/auth/login
  - Body:

```json
{
  "email": "beginner@example.com",
  "password": "123456"
}
```

3. Copy token from login response.

4. Get Current User
  - Method: GET
  - URL: http://localhost:5000/api/auth/me
  - Header:

```text
Authorization: Bearer paste_token_here
```

5. Logout
  - Method: POST
  - URL: http://localhost:5000/api/auth/logout
  - Header:

```text
Authorization: Bearer paste_token_here
```

### 17.4 MongoDB Queries Used in Auth (Simple English)

- User.findOne({ email })
  - Meaning: "Find one user document that has this email."
  - Used in register/login to check existing user or find login user.

- User.create({ ... })
  - Meaning: "Create and insert a new user document in MongoDB."
  - Used in register.

- User.findById(req.user.id).select('-password')
  - Meaning: "Find current user by id and do not include password field in response."
  - Used in /api/auth/me.

### 17.5 Request-Response Flow for Login

1. Flutter user enters email/password.
2. Flutter sends POST /api/auth/login with JSON body.
3. Express route matches /api/auth/login.
4. Validation middleware checks fields.
5. authController.loginUser runs.
6. loginUser queries MongoDB using User.findOne({ email }).
7. bcrypt.compare checks plain password with hashed password.
8. If valid, JWT token is created.
9. Backend sends JSON response with token.
10. Flutter receives JSON and saves token in SharedPreferences.

Simple flow diagram:

```mermaid
flowchart LR
  A[Flutter Auth Screen] --> B[POST /api/auth/login]
  B --> C[Validation Middleware]
  C --> D[Auth Controller]
  D --> E[User.findOne Query]
  E --> F[MongoDB]
  F --> D
  D --> G[bcrypt.compare + JWT create]
  G --> A
```

### 17.6 Common Auth Errors and Debugging

- 400 Validation failed
  - Usually missing/invalid email or short password.
  - Check request body and route validation rules.

- 401 Invalid email or password
  - Wrong credentials.
  - Try correct email/password.

- 401 Not authorized. Token missing or invalid.
  - Protected endpoint called without proper Bearer token.
  - Ensure header format is exactly: Authorization: Bearer token.

- 500 Server error
  - Could be DB connection issue.
  - Check backend terminal logs and .env values.

## 18) Event Management Module (Backend + Flutter)

This section explains Create, Read, Update, Delete, Search, Filter, Sort, and Pagination.

### 18.1 Event Files and Their Purpose

- src/models/Event.js
  - Defines event fields in MongoDB.
  - Fields: title, description, location, date, time, price, availableSeats, image, category, organizer.

- src/controllers/eventController.js
  - Business logic for all event operations.
  - Handles Create Event, Get All Events, Get Event By ID, Update Event, Delete Event.
  - Also handles search/filter/sort/pagination using query params.

- src/routes/eventRoutes.js
  - Maps event endpoints to controller functions.
  - Adds validation for body and query fields.

- mobile_app/lib/services/api_service.dart
  - Contains Flutter API calls for event list and event details.

- mobile_app/lib/screens/events_screen.dart
  - Event List screen.
  - Displays events and allows quick booking.

- mobile_app/lib/screens/event_details_screen.dart
  - Event Details screen.
  - Calls Get Event By ID endpoint.

- mobile_app/lib/screens/event_search_screen.dart
  - Search Screen.
  - Sends search/filter/sort/pagination query params to backend.

### 18.2 Event Endpoints Explained

- POST /api/events
  - Create Event.
  - Protected route.
  - Requires JWT token.

- GET /api/events
  - Get All Events.
  - Supports search, filter, sort, pagination.

- GET /api/events/:id
  - Get Event By ID.

- PUT /api/events/:id
  - Update Event.
  - Protected route.

- DELETE /api/events/:id
  - Delete Event.
  - Protected route.

### 18.3 Search, Filter, Sort, Pagination Query Params

Use these on GET /api/events:

- search
  - Searches title, description, location.

- category
  - Filters by exact category.

- minPrice and maxPrice
  - Filters events by price range.

- sortBy
  - Field name used for sorting.
  - Examples: createdAt, price, date, title.

- order
  - asc or desc.

- page and limit
  - Controls pagination.

Example request:
GET /api/events?search=workshop&category=Tech&minPrice=100&maxPrice=1000&sortBy=price&order=asc&page=1&limit=5

### 18.4 MongoDB Queries (Simple English)

These are the exact query patterns used in Event controller:

- new Event({...})
  - Meaning: create an event object in memory.
  - Not yet saved to database.

- event.save()
  - Meaning: insert this new event into MongoDB.

- Event.countDocuments(queryObject)
  - Meaning: count how many events match search/filter conditions.
  - Used to calculate totalPages for pagination.

- Event.find(queryObject)
  - Meaning: get all events that match conditions.

- .sort(sortObject)
  - Meaning: arrange matched events in ascending or descending order.

- .skip(skip)
  - Meaning: skip previous records for pagination.

- .limit(limitNumber)
  - Meaning: return only limited number of records per page.

- Event.findById(id)
  - Meaning: get one event using its _id.

- Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  - Meaning: find event by id and update it.
  - new: true returns updated document.
  - runValidators: true checks schema rules while updating.

- Event.findByIdAndDelete(id)
  - Meaning: find event by id and remove it from MongoDB.

### 18.5 Flutter API Calls (Simple English)

In mobile_app/lib/services/api_service.dart:

- getEvents({...})
  - Sends GET request to /api/events.
  - Adds optional query parameters for search/filter/sort/pagination.
  - Used by Event List and Search screens.

- getEventById(eventId)
  - Sends GET request to /api/events/:id.
  - Used by Event Details screen.

In mobile_app/lib/screens/events_screen.dart:

- _loadEvents()
  - Calls apiService.getEvents().
  - Receives JSON response and stores events list in state.

In mobile_app/lib/screens/event_details_screen.dart:

- _loadEventById()
  - Calls apiService.getEventById(widget.eventId).
  - Receives one event JSON and shows complete details.

In mobile_app/lib/screens/event_search_screen.dart:

- _searchEvents()
  - Reads form values.
  - Sends values to apiService.getEvents(...) as query params.
  - Receives filtered/sorted paginated list.

### 18.6 Postman Test Order (Backend First)

1. Login and copy token.
2. Create Event using POST /api/events with Authorization header.
3. Get All Events using GET /api/events.
4. Search and filter using query params on GET /api/events.
5. Get Event By ID using GET /api/events/:id.
6. Update Event using PUT /api/events/:id with token.
7. Delete Event using DELETE /api/events/:id with token.

### 18.7 Request-Response Flow (Event Search from Flutter)

1. User enters search/filter values in Search screen.
2. Flutter builds query params and sends GET /api/events?... .
3. Express route /api/events receives request.
4. eventController.getAllEvents reads req.query.
5. Controller builds queryObject and sortObject.
6. Mongoose runs countDocuments and find with sort/skip/limit.
7. MongoDB returns matching events.
8. Controller sends JSON response with events and pagination metadata.
9. Flutter reads JSON and updates list UI.

## 19) Event Categories Module (Backend + Flutter)

This module adds a dedicated Category collection and links Events to Categories.

### 19.1 Files Added and Why

- src/models/Category.js
  - Stores category data (name, description).

- src/controllers/categoryController.js
  - Contains category business logic.
  - Handles create, read, update, delete categories.
  - Also returns events for a category.

- src/routes/categoryRoutes.js
  - Contains all category endpoints.
  - Adds validation and protected routes for write operations.

- mobile_app/lib/screens/category_list_screen.dart
  - Shows list of categories in Flutter.

- mobile_app/lib/screens/category_details_screen.dart
  - Shows one category and events that belong to it.

### 19.2 Category Endpoints

- POST /api/categories
  - Create Category.
  - Protected route.

- GET /api/categories
  - Get Categories.
  - Public route.

- GET /api/categories/:id
  - Category Details.
  - Returns category + events in that category.

- PUT /api/categories/:id
  - Update Category.
  - Protected route.

- DELETE /api/categories/:id
  - Delete Category.
  - Protected route.
  - Blocked if events are still linked to that category.

- GET /api/categories/:id/events
  - Show Events By Category.

### 19.3 MongoDB Queries in Category Module (Simple English)

- Category.findOne({ name })
  - Meaning: check if same category name already exists.

- new Category({...}) + category.save()
  - Meaning: create and store a new category document.

- Category.find({})
  - Meaning: get all categories.

- Category.findById(id)
  - Meaning: get one category document by id.

- Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
  - Meaning: update one category and return updated data.

- Event.find({ categoryId: id })
  - Meaning: get events where categoryId equals this category id.

- Event.countDocuments({ categoryId: id })
  - Meaning: count events linked to this category (used before delete).

- Category.findByIdAndDelete(id)
  - Meaning: remove category by id.

### 19.4 Relationship Between Event and Category

Type of relationship:
- One-to-Many

Simple explanation:
- One Category can have many Events.
- One Event belongs to one Category.

How it is stored:
- Event has categoryId field.
- categoryId references Category collection document _id.

Why category name is also stored in Event:
- For beginner-friendly display and backward compatibility.
- category keeps readable text.
- categoryId keeps actual database relationship.

### 19.5 Flutter Category APIs and Screens

In mobile_app/lib/services/api_service.dart:

- getCategories()
  - Calls GET /api/categories.
  - Used by Category List screen.

- getCategoryDetails(categoryId)
  - Calls GET /api/categories/:id.
  - Used by Category Details screen.

Screens:

- Category List
  - File: mobile_app/lib/screens/category_list_screen.dart
  - Shows all categories.
  - Tap one category to open details.

- Category Details
  - File: mobile_app/lib/screens/category_details_screen.dart
  - Shows category name + description.
  - Shows all events linked to that category.
  - Tap event to open Event Details screen.

### 19.6 Postman Quick Test for Categories

1. Login and copy token.
2. Create category:
  - POST /api/categories
  - Header: Authorization Bearer token
  - Body example:

```json
{
  "name": "Tech",
  "description": "Technology related events"
}
```

3. Get all categories:
  - GET /api/categories

4. Get category details:
  - GET /api/categories/:id

5. Update category:
  - PUT /api/categories/:id
  - Header: Authorization Bearer token

6. Show events by category:
  - GET /api/categories/:id/events

7. Delete category:
  - DELETE /api/categories/:id
  - Header: Authorization Bearer token

## 20) Review System Module (Backend + Flutter)

This module lets logged-in users add, edit, and delete reviews for events. It also calculates the average rating for each event.

### 20.1 Files Added and Why

- src/models/Review.js
  - Stores review data: event, user, rating, and comment.

- src/controllers/reviewController.js
  - Contains review business logic.
  - Adds, lists, edits, deletes reviews.
  - Calculates average rating with MongoDB aggregation.

- src/routes/reviewRoutes.js
  - Contains review endpoints and validation rules.

- mobile_app/lib/screens/add_review_screen.dart
  - Flutter form for Add Review and Edit Review.

- mobile_app/lib/screens/review_list_screen.dart
  - Shows Review List, Average Rating, Add, Edit, and Delete actions.

### 20.2 Review Endpoints

- POST /api/reviews
  - Add Review.
  - Protected route.

- GET /api/reviews/event/:eventId
  - Review List for one event.
  - Includes averageRating and totalReviews.

- GET /api/reviews/average/:eventId
  - Average Rating only.

- PUT /api/reviews/:id
  - Edit Review.
  - Protected route.
  - User can edit only their own review.

- DELETE /api/reviews/:id
  - Delete Review.
  - Protected route.
  - User can delete only their own review.

### 20.3 Request Body Examples

Add Review:

```json
{
  "eventId": "event_mongodb_id_here",
  "rating": 5,
  "comment": "Great event and smooth booking experience."
}
```

Edit Review:

```json
{
  "rating": 4,
  "comment": "Updated review text."
}
```

### 20.4 MongoDB Relationships Explained

MongoDB does not require foreign keys like SQL, but Mongoose can store ObjectId references between collections.

Review relationships:
- One Event can have many Reviews.
- One User can write many Reviews.
- One Review belongs to one Event and one User.

How it is stored:
- Review.event stores the _id of an Event document.
- Review.user stores the _id of a User document.
- populate('event') can show event details with a review.
- populate('user') can show reviewer name/email with a review.

Why Review is a separate collection:
- Reviews can grow large, so keeping them outside Event documents avoids making event documents too heavy.
- Editing/deleting a review is simpler because each review has its own _id.
- Average Rating can be calculated from the Review collection whenever needed.

Average Rating:
- Review.aggregate([...]) groups reviews by event.
- $avg calculates average rating.
- $sum counts total reviews.

One-review rule:
- Review.js has a unique index on event + user.
- This means the same user cannot review the same event twice.

### 20.5 Flutter Review Screens

In Event Details:
- Tap Reviews to open Review List.

Review List:
- Shows Average Rating.
- Shows all reviews for that event.
- Add Review button opens Add Review Screen.
- Edit and Delete buttons show only for the logged-in user's own reviews.

Add Review Screen:
- Select rating from 1 to 5 stars.
- Write a comment.
- Submit to POST /api/reviews.
- When editing, submit to PUT /api/reviews/:id.

## 21) Favorites Module (Backend + Flutter)

This module lets a logged-in user save events they like.

### 21.1 Favorites Features

- Add Favorite
- Remove Favorite
- Get Favorites
- Favorite Screen in Flutter
- Favorite Button on event cards and event details

### 21.2 Favorites Endpoints

- POST /api/favorites
  - Add Favorite.
  - Protected route.

- GET /api/favorites
  - Get Favorites for logged-in user.
  - Protected route.

- DELETE /api/favorites/:eventId
  - Remove Favorite by event id.
  - Protected route.

### 21.3 User-Event Relationship

Type of relationship:
- Many-to-Many

Simple explanation:
- One User can favorite many Events.
- One Event can be favorited by many Users.

How it is stored:
- Favorite collection works like a joining table.
- Favorite.user stores User _id.
- Favorite.event stores Event _id.
- A unique index on user + event prevents duplicate favorites.

Example:
- User A favorites Event 1 and Event 2.
- User B can also favorite Event 1.
- Each favorite action creates one Favorite document.

## 22) Profile Module (Backend + Flutter)

This module manages user account details after login.

### 22.1 Profile Features

- Get Profile
- Update Profile
- Upload Profile Picture
- Change Password
- Profile Screen in Flutter
- Edit Profile Screen in Flutter

### 22.2 Profile Endpoints

- GET /api/users/profile
  - Get logged-in user's profile.

- PUT /api/users/profile
  - Update name and email.

- POST /api/users/profile-picture
  - Upload profile image using multipart/form-data.
  - Field name: image.

- PUT /api/users/change-password
  - Change password after checking current password.

### 22.3 Authentication Flow Explained

1. User registers or logs in.
2. Backend checks email/password.
3. Backend creates a JWT token with user id and email.
4. Flutter saves token in SharedPreferences.
5. For protected routes, Flutter sends:

```text
Authorization: Bearer <jwt_token_here>
```

6. authMiddleware verifies the token.
7. If token is valid, middleware stores decoded user data in req.user.
8. Controller uses req.user.id to get or update only the logged-in user's data.
9. If token is missing or invalid, backend returns 401.

## 23) Image Upload Module

This module uploads image files with Multer and serves them from the backend.

### 23.1 Image Upload Features

Backend:
- Multer
- Store Images in uploads folder
- Image API

Flutter:
- Pick Image with image_picker
- Upload Image
- Show Uploaded Image

### 23.2 Image Upload Endpoints

- POST /api/uploads/image
  - Upload a normal image.
  - Protected route.
  - multipart/form-data field name: image.

- POST /api/users/profile-picture
  - Upload profile picture.
  - Protected route.
  - multipart/form-data field name: image.

- GET /uploads/:filename
  - Public URL for viewing uploaded image files.

### 23.3 multipart/form-data Explained

Normal JSON requests send text data:

```json
{
  "name": "John"
}
```

Image upload needs a different format because a file contains binary data.

multipart/form-data sends data in parts:
- One part can be text.
- One part can be an image file.
- Backend middleware like Multer reads the file part.
- Multer saves the image to uploads folder.
- Backend returns the image URL to Flutter.

Flutter uses MultipartRequest:
- Add Authorization header.
- Attach file using field name image.
- Send request to backend.

## 24) Search and Filter System

This module expands event search and filtering.

### 24.1 Search Features

- Search by Name
- Search by Location
- Search by Category
- Search by Date
- Filter by Price
- Sorting
- Flutter Search Screen
- Flutter Filter Bottom Sheet

### 24.2 Search Query Parameters

GET /api/events supports:

- name
  - Searches event title.

- location
  - Searches event location.

- category
  - Filters event category.

- date
  - Filters events on a specific date.

- minPrice
  - Minimum ticket price.

- maxPrice
  - Maximum ticket price.

- sortBy
  - Example: price, date, title, createdAt.

- order
  - asc or desc.

### 24.3 MongoDB Queries Explained

Search by name:

```js
{ title: { $regex: name, $options: 'i' } }
```

Meaning:
- Find events where title contains the name text.
- i means case-insensitive.

Search by location:

```js
{ location: { $regex: location, $options: 'i' } }
```

Meaning:
- Find events where location contains the location text.

Filter by category:

```js
{ category: category }
```

Meaning:
- Find events where category exactly matches.

Filter by date:

```js
{
  date: {
    $gte: startDate,
    $lt: endDate
  }
}
```

Meaning:
- Find events from the start of that date up to before the next date.

Filter by price:

```js
{
  price: {
    $gte: minPrice,
    $lte: maxPrice
  }
}
```

Meaning:
- $gte means greater than or equal.
- $lte means less than or equal.

Sorting:

```js
{ [sortBy]: sortOrder }
```

Meaning:
- sortBy chooses the field.
- sortOrder is 1 for ascending and -1 for descending.
"# Event_booking_app" 
