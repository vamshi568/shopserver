1. User Authentication
======================
POST /api/auth/register
  - Registers a new user with a name, email, and password.

POST /api/auth/login
  - Logs in an existing user with an email and password, returning a JWT token.


2. Customer Management
======================
POST /api/customers
  - Creates a new customer with a name and phone number.

GET /api/customers
  - Retrieves a list of all customers.

GET /api/customers/:id
  - Retrieves details of a specific customer by ID.

PUT /api/customers/:id
  - Updates the details of a specific customer by ID.

DELETE /api/customers/:id
  - Deletes a specific customer by ID.


3. Order Management
===================
POST /api/orders
  - Creates a new order for a customer, including order date, delivery date, additional details, status, photos, and due amount.

GET /api/orders
  - Retrieves a list of all orders.

GET /api/orders/:id
  - Retrieves details of a specific order by ID.

PUT /api/orders/:id
  - Updates the details of a specific order by ID.

DELETE /api/orders/:id
  - Deletes a specific order by ID.


4. Measurement Management
=========================
POST /api/measurements
  - Creates new measurements for a customer, including shirt and pants measurements.

GET /api/measurements
  - Retrieves a list of all measurements.

GET /api/measurements/:id
  - Retrieves details of specific measurements by ID.

PUT /api/measurements/:id
  - Updates the details of specific measurements by ID.

DELETE /api/measurements/:id
  - Deletes specific measurements by ID.
