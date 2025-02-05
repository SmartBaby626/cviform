const ageSelectRadios = document.querySelectorAll('#ageSelect input[type="radio"]');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

const forms = ['ageSelect', 'form48', 'form912']; // Updated form IDs
let currentFormIndex = 0; // Start with the first form
let nextForm = null; // Determines which form to show next

// Initially show the first form and hide others
document.getElementById(forms[currentFormIndex]).style.display = 'block';
forms.forEach((formId, index) => {
    if (index !== currentFormIndex) {
        document.getElementById(formId).style.display = 'none';
    }
});

// Enable "Next" button when an option is selected in Age Selection Form
ageSelectRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        nextButton.disabled = false; // Enable Next button when selection is made
        nextForm = radio.value === '4-8' ? 'form48' : 'form912';
    });
});

// Handle "Next" button click
nextButton.addEventListener('click', () => {
    if (nextButton.textContent === "Submit") {
        let formType = forms[currentFormIndex]; // Identify active form
        
        if (formType === "form48") {
            generateDocx("template.docx", "Generated_Document_48.docx", "form48");
        } else if (formType === "form912") {
            generateDocx("template_912.docx", "Generated_Document_912.docx", "form912");
        }

        return; // Prevent further navigation
    }

    // Hide current form
    document.getElementById(forms[currentFormIndex]).style.display = "none";

    // Determine the next form
    if (currentFormIndex === 0) {
        currentFormIndex = forms.indexOf(nextForm); // Move to the selected form
    } else {
        currentFormIndex++;
    }

    // Show the next form
    document.getElementById(forms[currentFormIndex]).style.display = "block";

    // Update button text
    nextButton.textContent = forms[currentFormIndex] === "form48" || forms[currentFormIndex] === "form912" ? "Submit" : "Next";
    nextButton.disabled = false; // Ensure submit button is active
});

// Function to generate the .docx file
function generateDocx(templateFile, outputFileName, formId) {
    // Define questions separately for each form
    const questions48 = [
        'question1', 'question2', 'question3', 'question4', 'question5',
        'question6', 'question7', 'question8', 'question9', 'question10',
        'question11', 'question12', 'question13', 'question14', 'question15',
        'question16', 'question17', 'question18', 'question19', 'question20',
        'question21', 'question22', 'question23', 'question24', 'question25',
        'question26', 'question27', 'question28', 'question29', 'question30',
        'question31', 'question32', 'question33', 'question34', 'question35',
        'question36', 'question37', 'question38', 'question39', 'question40',
        'question41', 'question42', 'question43', 'question44', 'question45',
        'question46', 'question47', 'question48', 'question49', 'question50',
        'question51', 'question52', 'question53'
    ];

    const questions912 = [
        'question1', 'question2', 'question3', 'question4', 'question5',
        'question6', 'question7', 'question8', 'question9', 'question10',
        'question11', 'question12', 'question13', 'question14', 'question15',
        'question16', 'question17', 'question18', 'question19', 'question20',
        'question21', 'question22', 'question23', 'question24', 'question25',
        'question26', 'question27', 'question28', 'question29', 'question30',
        'question31', 'question32', 'question33', 'question34', 'question35',
        'question36', 'question37', 'question38', 'question39', 'question40',
        'question41', 'question42', 'question43', 'question44', 'question45',
        'question46', 'question47', 'question48', 'question49', 'question50',
        'question51', 'question52', 'question53'
    ];

    // Select correct question set
    const questions = formId === "form48" ? questions48 : questions912;

    // Collect responses
    const results = {};
    questions.forEach(question => {
        const selectedOption = document.querySelector(`form#${formId} input[name="${question}"]:checked`);
        results[question] = selectedOption ? selectedOption.value : "No option selected";
    });

    // Define Likert scale options
    const options = ["never", "rarely", "sometimes", "often", "always", "not_applicable"];

    // Generate Likert table **only if the form has one**
    let tableData = [];
    if (formId === "form48" || formId === "form912") {
        questions.forEach(question => {
            const row = { question };
            options.forEach(option => {
                row[option] = results[question] === option ? "✓" : "";
            });
            tableData.push(row);
        });
    }

    fetch(templateFile)
        .then(response => response.arrayBuffer())
        .then(templateArrayBuffer => {
            const zip = new PizZip(templateArrayBuffer);
            const doc = new docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

            // Render correct data
            doc.render({
                childName: document.getElementById('childName').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                pregWeeks: document.getElementById('pregWeeks').value,
                birthProblems: document.getElementById('birthProblems').value,
                affectingConditions: document.getElementById('affectingConditions').value,
                visionConcerns: document.getElementById('visionConcerns').value,
                likertTable: tableData // Only for forms with a Likert scale
            });

            // Save the document
            const blob = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = outputFileName;
            link.click();
        })
        .catch(error => console.error("Error loading template:", error));
}
