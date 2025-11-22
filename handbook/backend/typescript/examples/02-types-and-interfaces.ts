export {}; // делает файл модулем, предотвращая глобальные конфликты

let calculator = { //
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b
};



console.log(calculator.add(5, 3)); 

//TYPE ALIAS

let user: { name: string; age: number } = { //

  name: "Alice",
  age: 25
};

type User = { // определение типа User
  name: string;
  age: number;
  isActive: boolean;
};

type Admin = User & { // определение типа Admin
  role: string;
};

let user1: Admin = { 
  name: "Bob",
  age: 30,
  isActive: true,
  role: "superadmin"
};

type Status = '01' | '02' | '03'; // определение типа Status
type ID = number | string; // определение типа ID

type ApiResponse = 
| { status: Status; data: any }
| { status: 'error'; error: string };

let response: ApiResponse = {
  status: '01',
  data: { message: "Success" }
};

console.log(response);
console.log(user1);

//INTERFACES

interface IUser { // определение интерфейса IUser
  name: string;
  age: number;
  isActive: boolean;
}

interface IUser {
    getDetails(): string;
}

interface IAdmin extends IUser { // определение интерфейса IAdmin
  role: string;
}

let admin1: IAdmin = { 
  name: "Charlie",
  age: 28,
  isActive: false,
  role: "admin",
  getDetails() {
    return `${this.name}, ${this.age} years old, Role: ${this.role}`;
  }
};

console.log(admin1);
console.log(admin1.getDetails());

//OPTIONAL PROPERTIES AND READONLY PROPERTIES

interface UserProfile {
    id: number;
    name: string;
    email?: string; // необязательное
    phone?: string; 
}

const profile1: UserProfile = {
    id: 1,
    name: "David",
    email: "david@example.com",
    phone: "123-456-7890"
};

const profile2: UserProfile = {
    id: 2,
    name: "Eva"
};

function printProfile(profile: UserProfile): void {
    if (profile.email) {
        console.log(`Email: ${profile.email}`);
    } else {
        console.log("Email not provided");
    }

    if (profile.phone) {
        console.log(`Phone: ${profile.phone}`);
    } else {
        console.log("Phone not provided");
    }
}

printProfile(profile1);
printProfile(profile2);
