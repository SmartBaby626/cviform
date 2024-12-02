import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";
import express from "express";


// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
function makeDoc(childName, dateOfBirth){
    
}


// Done! A file called 'My Document.docx' will be in your file system.


const PORT = 3000;
const app = express();

app.get('/makeDoc', (req, res) => {
    const childName = req.query.childName; // Expecting string
    const dateOfBirth = req.query.dateOfBirth; // Expecting string

    if (!childName || !dateOfBirth) {
        return res.status(400).send({ error: 'Missing parameters' });
    }

    // Create a Word document with childName and dateOfBirth
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Child Name: ",
                                bold: true,
                            }),
                            new TextRun({
                                text: childName,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Date of Birth: ",
                                bold: true,
                            }),
                            new TextRun({
                                text: dateOfBirth,
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    // Export the document to a .docx file
    Packer.toBuffer(doc)
        .then((buffer) => {
            fs.writeFileSync("My_Document.docx", buffer);
            res.send({ message: "Document created successfully!" });
        })
        .catch((error) => {
            console.error("Error creating document:", error);
            res.status(500).send({ error: "Error creating document" });
        });
});


app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
