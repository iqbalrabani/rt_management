# RT Management Website Project 👨‍💻

This website is designed to assist RT (Rukun Tetangga) in managing residential administration efficiently. It includes several key features, such as:

- **Resident Management**: Add, update, and track residents
- **House Management**: Assign and manage residents per house
- **Payment Management**: Record and track monthly contributions
- **Expense Tracking**: Monitor expenses and generate financial reports
- **Comprehensive Reporting**: View summaries and detailed financial insights

These features ensure streamlined administrative tasks and improved financial transparency within the community.

## Requirements 📋
Before starting, make sure your machine has the following dependencies installed:

- **PHP** ([Version 8.2 or higher](https://www.php.net/downloads.php))
- **Composer** ([Latest LTS version](https://getcomposer.org/download/))
- **Node.js** ([Latest LTS version](https://nodejs.org/en/download))
- **NPM** ([Latest LTS version](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
- **MySQL** ([Latest version](https://www.mysql.com/downloads/))

## Installation Guide 📌

### A. Clone Repository
Copy and paste the following command in your terminal to clone this project repository:

```bash
git clone https://github.com/iqbalrabani/rt_management.git
```

### B. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend/
   ```
2. Install Composer dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
   Then, edit the `.env` file with your database credentials:
   ```
   DB_DATABASE=perumahan_db
   DB_USERNAME=root
   DB_PASSWORD=yourpassword  # Use a strong password!
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. Start the Laravel server:
   ```bash
   php artisan serve
   ```
   - The backend server will run at `http://localhost:8000`
   - For full API documentation, refer to the backend documentation ([here](https://github.com/iqbalrabani/rt_management/tree/main/backend#readme))

### C. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend/
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   - The frontend will run at `http://localhost:3000`

## Additional Notes ✨
- Ensure MySQL is running before starting the backend.
- If ports `8000` or `3000` are in use, specify alternative ports.
- Clear cache if necessary:
  ```bash
  php artisan cache:clear && php artisan config:clear
  ```
- If you encounter permission issues, use:
  ```bash
  chmod -R 777 storage bootstrap/cache
  ```

Enjoy building and managing the RT administration efficiently! 🚀