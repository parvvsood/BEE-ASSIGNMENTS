const form = document.getElementById("feedbackForm");

const name = document.getElementById("name");
const email = document.getElementById("email");
const course = document.getElementById("course");
const feedback = document.getElementById("feedback");

// Remove error when user types
name.addEventListener("input", () => {
    document.getElementById("nameError").innerHTML = "";
});

email.addEventListener("input", () => {
    document.getElementById("emailError").innerHTML = "";
});

course.addEventListener("change", () => {
    document.getElementById("courseError").innerHTML = "";
});

feedback.addEventListener("input", () => {
    document.getElementById("feedbackError").innerHTML = "";
});

// Form Submit
form.addEventListener("submit", function(e){

    e.preventDefault();

    let valid = true;

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(name.value.trim() == ""){
        document.getElementById("nameError").innerHTML = "Student Name is required";
        valid = false;
    }

    if(email.value.trim() == ""){
        document.getElementById("emailError").innerHTML = "Email is required";
        valid = false;
    }
    else if(!emailPattern.test(email.value)){
        document.getElementById("emailError").innerHTML = "Enter a valid email";
        valid = false;
    }

    if(course.value == ""){
        document.getElementById("courseError").innerHTML = "Please select a course";
        valid = false;
    }

    if(feedback.value.trim() == ""){
        document.getElementById("feedbackError").innerHTML = "Feedback cannot be empty";
        valid = false;
    }

    if(valid){

        const student = {
            name: name.value,
            email: email.value,
            course: course.value,
            feedback: feedback.value
        };

        // Local Storage
        localStorage.setItem("studentFeedback", JSON.stringify(student));

        // Session Storage
        sessionStorage.setItem("sessionUser", name.value);

        displayData();

        form.reset();
    }

});

// Display Data
function displayData(){

    const data = localStorage.getItem("studentFeedback");

    if(data){

        const student = JSON.parse(data);

        document.getElementById("displayArea").innerHTML = `
            <h3>Stored Feedback</h3>
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Feedback:</strong> ${student.feedback}</p>
        `;
    }
    else{
        document.getElementById("displayArea").innerHTML = "No feedback stored.";
    }

    const sessionUser = sessionStorage.getItem("sessionUser");

    if(sessionUser){
        document.getElementById("sessionUser").innerHTML =
        "Current Session User: " + sessionUser;
    }
    else{
        document.getElementById("sessionUser").innerHTML = "";
    }

}

// Delete Data
function deleteData(){

    localStorage.removeItem("studentFeedback");
    sessionStorage.removeItem("sessionUser");

    document.getElementById("displayArea").innerHTML =
    "No feedback stored.";

    document.getElementById("sessionUser").innerHTML = "";
}

// Display saved data when page loads
displayData();