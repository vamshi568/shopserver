# InFitting Server

This repository contains the backend server for the InFitting app, a customer and order management app for tailor shops. It is built using Node.js, Express, and MongoDB.

## Features

- RESTful API for managing customers, measurements, orders, and order details.
- Integration with Cloudinary for image storage.
- Efficient data storage and retrieval using MongoDB.
- Secure data handling with proper validation and error handling.

## Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file:
   - `MONGO_URI`: Your MongoDB connection string.
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
4. Start the server using `npm start`.

## API Endpoints

- `/api/customers`: Manage customer details.
- `/api/measurements`: Manage customer measurements.
- `/api/orders`: Manage orders and order details.
- `/api/photos`: Handle image uploads and retrievals from Cloudinary.

## Contributing

If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Commit and push your changes to your forked repository.
6. Create a pull request.


## Contact

If you have any questions or need help with this project, feel free to contact me at [kyadarivamshi568@gmail.com](mailto:kyadarivamshi568@gmail.com). You can also find me on [LinkedIn](https://www.linkedin.com/in/vamshi-kris/).

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
