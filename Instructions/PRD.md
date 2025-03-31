# 📚 BookSummarizer AI

## Objective
A tool that lets users upload a PDF of a book and receive a high-quality summary using OpenAI's GPT API.

---

## Features

- ✅ Upload a PDF file (via drag & drop or file picker)
- 🧠 Extract text from the PDF
- 🔀 Chunk the text for API processing
- ✨ Summarize each chunk using OpenAI API
- 🧵 Combine and clean final summary
- 📄 Output available as bullet list, paragraph, or downloadable file

---

## Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **Backend:** FastAPI or Node.js
- **PDF Extraction:** PyMuPDF or pdfplumber
- **AI API:** OpenAI GPT-4
- **Storage:** AWS S3 or Firebase Storage
- **Deployment:** Vercel / Railway / Heroku

---

## Milestones

| Milestone                     | Timeline       | Description                                                                 |
|------------------------------|----------------|-----------------------------------------------------------------------------|
| Requirements & Planning      | Day 0 – Day 2   | Finalize feature list, pick tech stack, set up repo                         |
| UI/UX Mockups                | Day 3 – Day 4   | Design file upload, summary results page                                    |
| PDF Upload & Text Extraction | Day 5 – Day 7   | Implement file upload and extract text using libraries like `pdfplumber`   |
| Chunking & API Integration   | Day 8 – Day 10  | Split large texts and send to OpenAI API for summarization                 |
| Stitching & Formatting       | Day 11 – Day 12 | Combine summaries into cohesive output                                      |
| User Settings & Output       | Day 13 – Day 14 | Add summary format options and download feature                             |
| Testing & Bug Fixes          | Day 15 – Day 16 | Ensure stability and polish                                                 |
| Launch MVP                   | Day 17          | Deploy to production, share with users                                      |

---

## License

MIT License
