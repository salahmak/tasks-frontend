# Tasks Management Application (Frontend)

## **Project Description**

This project is a **frontend for the TO-DO List application**, built using **Next.js** with Redux Toolkit and Redux Toolkit Query for state management and API interactions. It provides a user-friendly interface for managing tasks, including creating, updating, deleting, and viewing tasks. The app integrates seamlessly with the backend API to provide a responsive and efficient user experience.

---

## **Setup Instructions**

### **1. Clone the Repository**
Clone the frontend repository to your local machine:
```bash
git clone https://github.com/salahmak/tasks-frontend
cd tasks-frontend
```

### **2. Create a `.env` File**
Create a `.env` file in the project root and define the backend API endpoint URL:
```
NEXT_PUBLIC_API_ENDPOINT_URL=http://localhost:8000/api/v1
```

> **Note**: Use the URL of the backend you configured earlier. For local development, the default value is `http://localhost:8000/api/v1`.

### **3. Install Dependencies**
Install the required dependencies using your preferred package manager:
```bash
# Using yarn
yarn install

# OR using npm
npm install
```

### **4. Run the Development Server**
Start the development server:
```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## **API Integration with Redux Toolkit Query**

### **Why Redux Toolkit Query (RTK Query)?**

The project uses **Redux Toolkit Query (RTK Query)** to manage API interactions. RTK Query simplifies API requests by:
1. **Abstracting API Logic**: Automatically handling fetching, caching, and updating API data.
2. **Centralized State Management**: Integrating API interactions directly into Redux for consistency across the app.
3. **Code Reduction**: Eliminating the need for boilerplate code like `useEffect` and `axios` or `fetch` for API calls.


#### **Advantages in This Project**
- **Consistency**: All API calls (`GET`, `POST`, etc.) are handled through RTK Query, ensuring a consistent approach.
- **Automatic Caching**: Data from API responses is cached and automatically updated.
- **Error Handling**: Provides built-in mechanisms for handling API errors.

---

## **Separation of UI and State Logic**

To keep the codebase clean and maintainable, the project utilizes **custom hooks** to separate UI components from state and business logic. This improves reusability and ensures components are focused on rendering, not managing data.
