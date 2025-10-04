import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx"
import { saveAs } from "file-saver"

interface Assignment {
  id: string
  subject: string
  topic: string
  difficulty: string
  questionCount: number
  questionTypes: string
  content: string
  createdAt: string
}

export async function exportToDocx(assignment: Assignment) {
  try {
    // Split content into lines and create paragraphs
    const lines = assignment.content.split("\n")
    const paragraphs: Paragraph[] = []

    // Add title
    paragraphs.push(
      new Paragraph({
        text: `${assignment.subject} - ${assignment.topic}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
    )

    // Add metadata
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Difficulty: ${assignment.difficulty} | Questions: ${assignment.questionCount} | Date: ${new Date(assignment.createdAt).toLocaleDateString("en-GB")}`,
            italics: true,
            size: 20,
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // Add content
    for (const line of lines) {
      if (line.trim()) {
        // Check if line is a heading (starts with # or is all caps)
        const isHeading = line.startsWith("#") || (line === line.toUpperCase() && line.length > 3)

        if (isHeading) {
          paragraphs.push(
            new Paragraph({
              text: line.replace(/^#+\s*/, ""),
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
          )
        } else {
          paragraphs.push(
            new Paragraph({
              text: line,
              spacing: { after: 100 },
            }),
          )
        }
      } else {
        paragraphs.push(new Paragraph({ text: "" }))
      }
    }

    // Add footer
    paragraphs.push(
      new Paragraph({
        text: "",
        spacing: { before: 400 },
      }),
    )
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Created by Michael MUSONDA Chawe | Built with Base 44",
            italics: true,
            size: 18,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    )

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    const filename = `${assignment.subject}_${assignment.topic.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.docx`
    saveAs(blob, filename)
  } catch (error) {
    console.error("[v0] Error exporting to DOCX:", error)
    throw new Error("Failed to export to DOCX")
  }
}

export function exportToPdf(assignment: Assignment) {
  try {
    // Create a printable version
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      throw new Error("Failed to open print window")
    }

    const content = `
      <!DOCTYPE html>
      <html lang="en-GB">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${assignment.subject} - ${assignment.topic}</title>
          <style>
            @page {
              margin: 2cm;
            }
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              line-height: 1.6;
              color: #000;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              color: #000;
            }
            .metadata {
              font-size: 12px;
              color: #666;
              margin-bottom: 30px;
              font-style: italic;
            }
            .content {
              white-space: pre-wrap;
              font-size: 14px;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ccc;
              text-align: center;
              font-size: 11px;
              color: #666;
              font-style: italic;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${assignment.subject} - ${assignment.topic}</h1>
          <div class="metadata">
            Difficulty: ${assignment.difficulty} | 
            Questions: ${assignment.questionCount} | 
            Date: ${new Date(assignment.createdAt).toLocaleDateString("en-GB")}
          </div>
          <div class="content">${assignment.content}</div>
          <div class="footer">
            Created by Michael MUSONDA Chawe | Built with Base 44
          </div>
        </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print()
    }
  } catch (error) {
    console.error("[v0] Error exporting to PDF:", error)
    throw new Error("Failed to export to PDF")
  }
}
