# BoozyDev LinkShortener API
## Overview
boozyLinks is a simple API for creating and managing short links. It allows you to generate unique short keys for your long URLs, making them easier to share and manage.

## Features
- **Create Short Links:** Generate short keys for your long URLs.
- **Retrieve Short Links:** Retrieve the original URL by providing the short key.
- **Status Check:** Check the status of the API.

## Getting Started
Follow the steps below to set up and use the ShortLink API:

### Prerequisites
- Node.js installed on your machine.
- SQLite database.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/WardGr/linkShortener.git
   cd shortlink-api
   ```
2. Install dependencies:
  ```
  npm install
```
3. Configuration:
- Make sure you have the required SSL certificates for HTTPS (replace placeholders in the options object in index.js). Or rewrite it to HTTP.
- Change the API to https://yourdomain.com:8443 if using https, localhost:8443 otherwise.
- Possibly, set up the database. The default configuration assumes a database file named db.sqlite. If none existent, it creates this file.

### Usage
1. Start the server:
   ```
   node server.js
   ```
2. Access the API at https://yourdomain.com:8443. With http this is localhost:8443.

## API Endpoints

1. Create Short Link
   
#### Endpoint: PUT /api/addKey
Request Body:
```
{
  "link": "https://example.com"
}
```

Response:
```
{
  "result": "shortkey"
}
```
2. Retrieve Original Link

#### Endpoint: GET /api/:key
https://yourdomain.com:8443/api/shortkey
Response:
Redirects to the original URL if the key is found.

3. Check if API is alive

#### Endpoint: GET /api
Response:
```
{
  "status": "alive"
}
```

## Important Notes

Ensure that your SSL certificates are correctly configured.
The default short key length is set to 5 characters. You can modify the generateRandomCombination function in index.js if you want a different length.
Feel free to explore and modify the code to suit your needs. If you encounter any issues or have suggestions, please open an issue on GitHub. 
