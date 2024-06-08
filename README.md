# Sellucose

Capstone project that been made using expressjs, as database firestore

## Fitur
(masih beta)
- Registrasi pengguna
- Login pengguna
- Proteksi rute dengan JWT
- Penyimpanan pengguna di Firestore

## Persyaratan

- Node.js
- NPM
- Akun Google Cloud Platform dengan Firestore diaktifkan
- File kunci akun layanan dari GCP

## Instalasi

1. Clone repository ini:

    ```bash
    git clone https://github.com/username/auth-firestore.git
    cd auth-firestore
    ```

2. Instal dependensi:

    ```bash
    npm install
    ```

3. Buat file `.env` di root direktori proyek Anda dan tambahkan variabel lingkungan berikut:

    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret_key
    PROJECT_ID=your_gcp_project_id
    SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json
    ```

4. Tambahkan file kunci akun layanan (`serviceAccountKey.json`) ke path yang Anda tentukan di variabel lingkungan `SERVICE_ACCOUNT_PATH`.

## API Endpoints

### Register

- **URL:** `/register`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```

- **Response:**
    ```json
    {
        "message": "User registered successfully",
        "userId": "generated_user_id"
    }
    ```

### Login

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```

- **Response:**
    ```json
    {
        "token": "your_jwt_token"
    }
    ```