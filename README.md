# **Bookstore API**

This is a simple Bookstore API built with Node.js, Express, MySQL, and TypeScript. Follow the steps below to set up and run the application.

---

## **Installation and Setup Instructions**

### **1. Install MySQL on macOS (using Installer)**

1. **Download the MySQL Installer**

   - Go to the official MySQL [downloads page](https://dev.mysql.com/downloads/mysql/).
   - Download the macOS installer for MySQL Community Server.

2. **Install MySQL**

   - Run the downloaded installer and follow the instructions.

3. **Set the Root Password**

   - During installation, set the MySQL root password to **`bitask`** (this is the password that will be used in the `.env` file).

4. **Start MySQL Server**

   - Once installed, you can start the MySQL server either from **System Preferences** or by running the following terminal command:

   ```bash
   mysql.server start
   ```

### **2. Seed the database**

To populate the database with initial data, run the `seed.js` file:

```bash
node ./server/seed.js
```

### **3. Start server**

After seeding the database, you can start the application by running the following command:

```bash
npm run start
```

This will start the server on port 5000. The server will be available at http://localhost:5000.
