
const ageSelectRadios = document.querySelectorAll('#ageSelect input[type="radio"]');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

const forms = ['ageSelect', 'form48', 'form912']; // Updated form IDs
let currentFormIndex = 0; // Start with the first form (ageSelect)
let nextForm = null; // Determines which form to show next based on the selection

// Initially show the first form and hide others
document.getElementById(forms[currentFormIndex]).style.display = 'block'; 
forms.forEach((formId, index) => {
    if (index !== currentFormIndex) {
        document.getElementById(formId).style.display = 'none'; // Hide other forms
    }
});

// Enable "Next" button when an option is selected in Age Selection Form
ageSelectRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        nextButton.disabled = false; // Enable Next button when selection is made
        // Set the next form based on the selected value
        if (radio.value === '4-8') {
            nextForm = 'form48';
        } else if (radio.value === '9-12') {
            nextForm = 'form912';
        }

        checkRequiredFields(); // Ensure fields are validated when a change is made
    });
});

// Add event listeners to the other form fields to check if they have changed from their default value
document.getElementById('childName').addEventListener('input', checkRequiredFields);
document.getElementById('dateOfBirth').addEventListener('change', checkRequiredFields);
document.getElementById('pregWeeks').addEventListener('input', checkRequiredFields);
document.getElementById('birthProblems').addEventListener('input', checkRequiredFields);
document.getElementById('affectingConditions').addEventListener('input', checkRequiredFields);
document.getElementById('visionConcerns').addEventListener('input', checkRequiredFields);

// Handle "Next" button click
nextButton.addEventListener('click', () => {
    if (nextButton.textContent === "Submit") {
        // Check if all questions in form48 have been answered
        const questions = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10', 'question11', 'question12', 'question13', 'question14', 'question15', 'question16', 'question17', 'question18', 'question19', 'question20', 'question21', 'question22', 'question23', 'question24', 'question25', 'question26', 'question27', 'question28', 'question29', 'question30', 'question31', 'question32', 'question33', 'question34', 'question35', 'question36', 'question37', 'question38', 'question39', 'question40', 'question41', 'question42', 'question43', 'question44', 'question45', 'question46', 'question47', 'question48', 'question49', 'question50', 'question51', 'question52', 'question53'];
        let allAnswered = true;

        // Check if all questions have been answered
        questions.forEach(question => {
            const selectedOption = document.querySelector(`form#form48 input[name="${question}"]:checked`);
            if (!selectedOption) {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            alert("Please answer all questions before submitting.");
            return; // Prevent form submission if there are unanswered questions
        }

        // Collect results from form48 and log to console
        const results = {};
        questions.forEach(question => {
            const selectedOption = document.querySelector(`form#form48 input[name="${question}"]:checked`);
            results[question] = selectedOption ? selectedOption.value : "No option selected";
        });

        // Collect ageSelect form answers (including the new parameters)
        const ageSelectResults = {
            age: document.querySelector('input[name="ageSelect"]:checked') ? document.querySelector('input[name="ageSelect"]:checked').value : "Not selected",
            childName: document.getElementById('childName').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            pregWeeks: document.getElementById('pregWeeks').value,
            birthProblems: document.getElementById('birthProblems').value,
            affectingConditions: document.getElementById('affectingConditions').value,
            visionConcerns: document.getElementById('visionConcerns').value,
            foodPlacement: document.querySelector('input[name="side"]:checked') ? document.querySelector('input[name="side"]:checked').value : "Not selected",
            foodPlacement2: document.querySelector('input[name="side2"]:checked') ? document.querySelector('input[name="side2"]:checked').value : "Not selected",
            roadSide: document.querySelector('input[name="roadSide"]:checked') ? document.querySelector('input[name="roadSide"]:checked').value : "Not selected",
            doorSide: document.querySelector('input[name="doorSide"]:checked') ? document.querySelector('input[name="doorSide"]:checked').value : "Not selected",
            bookSide: document.querySelector('input[name="bookSide"]:checked') ? document.querySelector('input[name="bookSide"]:checked').value : "Not selected"
        };

        console.log("Age Select Results:", ageSelectResults); // Print age select form results
        console.log("Form 48 Results:", results); // Print form48 results

        generateDocx();

        return; // Prevent further navigation
    }

    // Print the results of the ageSelect form before moving to the next form
    const ageSelectResults = {
        age: document.querySelector('input[name="ageSelect"]:checked') ? document.querySelector('input[name="ageSelect"]:checked').value : "Not selected",
        childName: document.getElementById('childName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        pregWeeks: document.getElementById('pregWeeks').value,
        birthProblems: document.getElementById('birthProblems').value,
        affectingConditions: document.getElementById('affectingConditions').value,
        visionConcerns: document.getElementById('visionConcerns').value,
        foodPlacement: document.querySelector('input[name="side"]:checked') ? document.querySelector('input[name="side"]:checked').value : "Not selected",
        foodPlacement2: document.querySelector('input[name="side2"]:checked') ? document.querySelector('input[name="side2"]:checked').value : "Not selected",
        roadSide: document.querySelector('input[name="roadSide"]:checked') ? document.querySelector('input[name="roadSide"]:checked').value : "Not selected",
        doorSide: document.querySelector('input[name="doorSide"]:checked') ? document.querySelector('input[name="doorSide"]:checked').value : "Not selected",
        bookSide: document.querySelector('input[name="bookSide"]:checked') ? document.querySelector('input[name="bookSide"]:checked').value : "Not selected"
    };

    console.log("Age Select Results:", ageSelectResults); // Print age select form results

    // Hide the current form
    const currentForm = document.getElementById(forms[currentFormIndex]);
    if (currentForm) {
        currentForm.style.display = 'none';
    }

    // Determine the next form to display
    if (currentFormIndex === 0) {
        currentFormIndex = forms.indexOf(nextForm); // Set index to the appropriate next form
    } else {
        currentFormIndex++;
    }

    // Debugging to check if the next form is found
    console.log("Current Form Index:", currentFormIndex);
    console.log("Next Form ID:", forms[currentFormIndex]);

    // Show the next form
    const nextFormElement = document.getElementById(forms[currentFormIndex]);
    if (nextFormElement) {
        nextFormElement.style.display = 'block';
    } else {
        console.error("Next form not found!");
    }

    // Update button states
    prevButton.disabled = false;

    // If the next form is form48, update the button to "Submit"
    if (forms[currentFormIndex] === 'form48') {
        nextButton.textContent = "Submit";
        nextButton.disabled = false; // Ensure it is not greyed out
    } else {
        nextButton.textContent = "Next";
        nextButton.disabled = true; // Grey it out if no selection is made
    }
});

// Add an event listener for the form to check if all fields are filled before allowing "Next"
function checkRequiredFields() {
    const requiredFields = [
        'ageSelect', 'childName', 'dateOfBirth', 'pregWeeks', 'birthProblems', 'affectingConditions', 'visionConcerns'
    ];

    let allFilled = true;

    // Check if each required field is filled and changed from its default value (empty)
    requiredFields.forEach(id => {
        const field = document.getElementById(id);
        
        if (field) { // Only proceed if the field exists
            // Check for textarea, input or other field types
            if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
                // Check if the field has a value (not empty)
                if (field.value.trim() === "") {
                    allFilled = false; // If any required field is empty, disable the button
                }
            }
        }
    });

    nextButton.disabled = !allFilled; // Disable the "Next" button if any field is missing
}

// app.js

// Function to generate the .docx file
// app.js



// Function to generate the .docx file
// app.js
function generateDocx() {


    // Fetch the template file
    fetch("template.docx") // Path to your template file
        .then((response) => response.arrayBuffer())
        .then((templateArrayBuffer) => {
            // Load the template file with PizZip
            const zip = new PizZip(templateArrayBuffer);
            const doc = new docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Render the document with dynamic data
            doc.setData({
                childName: childName,
                dateOfBirth: dateOfBirth,
            });

            try {
                doc.render();
                const blob = doc.getZip().generate({
                    type: "blob",
                    mimeType:
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });

                // Trigger the download
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "Generated_Document.docx";
                link.click();
            } catch (error) {
                console.error("Error rendering document:", error);
            }
        })
        .catch((error) => {
            console.error("Error loading template:", error);
        });
}







// Event listener to trigger the docx generation when the button is clicked


// Call checkRequiredFields initially to handle the case where the user may not have selected anything yet
 
checkRequiredFields();
