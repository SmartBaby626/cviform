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
nextButton.addEventListener('click', async () => {
    if (nextButton.textContent === "Submit") {
        const childName = document.getElementById('childName').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;

        // Validate required fields and alert if missing
        if (!childName || !dateOfBirth) {
            alert("Please fill in all required fields.");
            return;
        }

        // Collect data to send to the server
        const ageSelectResults = {
            age: document.querySelector('input[name="ageSelect"]:checked')?.value || "Not selected",
            childName,
            dateOfBirth,
            pregWeeks: document.getElementById('pregWeeks').value,
            birthProblems: document.getElementById('birthProblems').value,
            affectingConditions: document.getElementById('affectingConditions').value,
            visionConcerns: document.getElementById('visionConcerns').value,
            foodPlacement: document.querySelector('input[name="side"]:checked')?.value || "Not selected",
            foodPlacement2: document.querySelector('input[name="side2"]:checked')?.value || "Not selected",
            roadSide: document.querySelector('input[name="roadSide"]:checked')?.value || "Not selected",
            doorSide: document.querySelector('input[name="doorSide"]:checked')?.value || "Not selected",
            bookSide: document.querySelector('input[name="bookSide"]:checked')?.value || "Not selected",
        };

        console.log("Submitting data:", ageSelectResults);

        // Submit form data to the server
        try {
            const response = await fetch('https://cviform-server.netlify.app/netlify/functions/submit-results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ageSelectResults),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Server response:", data);
                alert("Form submitted successfully!");

                // Generate and download the document
                await buildDocument(childName, dateOfBirth);
            } else {
                alert("Error submitting form: " + response.statusText);
            }
        } catch (error) {
            console.error("Error sending data to server:", error);
            alert("Error submitting form: " + error.message);
        }

        return; // Prevent further navigation
    }

    // Hide the current form and show the next form
    const currentForm = document.getElementById(forms[currentFormIndex]);
    if (currentForm) currentForm.style.display = 'none';

    currentFormIndex = currentFormIndex === 0 ? forms.indexOf(nextForm) : currentFormIndex + 1;

    const nextFormElement = document.getElementById(forms[currentFormIndex]);
    if (nextFormElement) {
        nextFormElement.style.display = 'block';
        nextButton.disabled = currentFormIndex !== 0;
        nextButton.textContent = currentFormIndex === forms.length - 1 ? "Submit" : "Next";
    }
});

// Build and download the Word document
async function buildDocument(childName, dateOfBirth) {
    try {
        const response = await fetch(
            `https://cviform-server.netlify.app/netlify/functions/makeDoc?childName=${encodeURIComponent(childName)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`,
            { method: "GET" }
        );

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Generated_Document.docx";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            alert("Error generating document: " + response.statusText);
        }
    } catch (error) {
        console.error("Error generating document:", error);
        alert("Error generating document: " + error.message);
    }
}

// Call checkRequiredFields initially to handle the case where the user may not have selected anything yet
checkRequiredFields();
