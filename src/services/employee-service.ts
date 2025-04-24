// src/services/employee-service.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Employee {
  id: string;
  name: string;
  position: string;
  hourlyWage: string;
  fnpfNo: string;
  bankCode: string;
  bankAccountNumber: string;
  paymentMethod: 'cash' | 'online';
  branch: 'labasa' | 'suva';
}

const EMPLOYEE_COLLECTION = 'employees';

// Function to retrieve employees from Firebase
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const employeeCollection = collection(db, EMPLOYEE_COLLECTION);
    const employeeSnapshot = await getDocs(employeeCollection);
    const employeeList = employeeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Employee[];
    return employeeList;
  } catch (error: any) {
    console.error("Error retrieving employees from Firebase:", error);
    throw new Error(error.message || "Failed to retrieve employees from Firebase");
  }
};

// Function to add a new employee to Firebase
export const addEmployee = async (employee: Employee): Promise<void> => {
  try {
    const employeeCollection = collection(db, EMPLOYEE_COLLECTION);
    await addDoc(employeeCollection, employee);
  } catch (error: any) {
    console.error("Error adding employee to Firebase:", error);
    throw new Error(error.message || "Failed to add employee to Firebase");
  }
};

// Function to update an existing employee in Firebase
export const updateEmployee = async (employee: Employee): Promise<void> => {
  try {
    const employeeDoc = doc(db, EMPLOYEE_COLLECTION, employee.id);
    await updateDoc(employeeDoc, employee);
  } catch (error: any) {
    console.error("Error updating employee in Firebase:", error);
    throw new Error(error.message || "Failed to update employee in Firebase");
  }
};

