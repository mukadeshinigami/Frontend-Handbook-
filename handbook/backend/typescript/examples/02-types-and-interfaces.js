"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculator = {
    add: function (a, b) { return a + b; },
    subtract: function (a, b) { return a - b; }
};
console.log(calculator.add(5, 3));
//TYPE ALIAS
var user = {
    name: "Alice",
    age: 25
};
var user1 = {
    name: "Bob",
    age: 30,
    isActive: true,
    role: "superadmin"
};
var response = {
    status: '01',
    data: { message: "Success" }
};
console.log(response);
console.log(user1);
var admin1 = {
    name: "Charlie",
    age: 28,
    isActive: false,
    role: "admin",
    getDetails: function () {
        return "".concat(this.name, ", ").concat(this.age, " years old, Role: ").concat(this.role);
    }
};
console.log(admin1);
console.log(admin1.getDetails());
var profile1 = {
    id: 1,
    name: "David",
    email: "david@example.com",
    phone: "123-456-7890"
};
var profile2 = {
    id: 2,
    name: "Eva"
};
function printProfile(profile) {
    if (profile.email) {
        console.log("Email: ".concat(profile.email));
    }
    else {
        console.log("Email not provided");
    }
    if (profile.phone) {
        console.log("Phone: ".concat(profile.phone));
    }
    else {
        console.log("Phone not provided");
    }
}
printProfile(profile1);
printProfile(profile2);
