// Student Management System
const students = [
  { id: 101, name: "Aman", marks: 82, course: "Java" },
  { id: 102, name: "Priya", marks: 95, course: "Python" },
  { id: 103, name: "Rahul", marks: 67, course: "Java" },
  { id: 104, name: "Neha", marks: 76, course: "Web" },
  { id: 105, name: "Rohan", marks: 88, course: "Python" }
];
// ---------------- Task 1 ----------------
console.log("Task 1 - push()");
students.push({ id: 106, name: "Simran", marks: 91, course: "Java" });
console.log(students);

// ---------------- Task 2 ----------------
console.log("\nTask 2 - pop()");
let removedLast = students.pop();
console.log("Removed Student:");
console.log(removedLast);

// ---------------- Task 3 ----------------
console.log("\nTask 3 - unshift()");
students.unshift({ id: 100, name: "Ankit", marks: 80, course: "Web" });
console.log(students);

// ---------------- Task 4 ----------------
console.log("\nTask 4 - shift()");
let removedFirst = students.shift();
console.log("Removed Student:");
console.log(removedFirst);

// ---------------- Task 5 ----------------
console.log("\nTask 5 - splice()");
let index = students.findIndex(student => student.id === 103);

students.splice(index, 1, {
    id: 107,
    name: "Karan",
    marks: 78,
    course: "Java"
});

console.log(students);

// ---------------- Task 6 ----------------
console.log("\nTask 6 - slice()");
let firstThree = students.slice(0, 3);
console.log(firstThree);

// ---------------- Task 7 ----------------
console.log("\nTask 7 - for...of");

for (let student of students) {
    console.log(`${student.name} - ${student.course} - ${student.marks}`);
}

// ---------------- Task 8 ----------------
console.log("\nTask 8 - forEach()");

students.forEach(student => {
    console.log(student.name);
});

// ---------------- Task 9 ----------------
console.log("\nTask 9 - map()");

let names = students.map(student => student.name);
console.log(names);

// ---------------- Task 10 ----------------
console.log("\nTask 10 - filter()");

let topperStudents = students.filter(student => student.marks >= 80);
console.log(topperStudents);

// ---------------- Task 11 ----------------
console.log("\nTask 11 - reduce()");

// (a) Total Marks
let totalMarks = students.reduce((sum, student) => sum + student.marks, 0);
console.log("Total Marks =", totalMarks);

// (b) Average Marks
let average = totalMarks / students.length;
console.log("Average Marks =", average);

// ---------------- Task 12 ----------------
console.log("\nTask 12 - sort()");

// Ascending
let ascending = [...students].sort((a, b) => a.marks - b.marks);

console.log("Ascending Order:");
ascending.forEach(student => console.log(student.marks));

// Descending
let descending = [...students].sort((a, b) => b.marks - a.marks);

console.log("Descending Order:");
descending.forEach(student => console.log(student.marks));