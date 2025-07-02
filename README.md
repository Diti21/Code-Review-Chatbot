#  Code-Review-Chatbot

**Code-Review-Chatbot** is a full-stack web application that uses OpenAI's GPT-4o model to provide intelligent, real-time code reviews. Simply paste your code, choose the programming language, and get structured, markdown-formatted suggestions, bug fixes, and best practice insights.

---

##  Features

-  **AI-powered Code Review** using GPT-4o API
-  Supports multiple languages: JavaScript, Python, Java, C++, Go, Ruby
-  **Frontend:** React with Markdown-to-HTML rendering using `marked`
-  **Backend:** Express.js with OpenAI API and rate limiting
-  Handles up to **3000 characters** of code per review
-  Shows token truncation warning when code exceeds limit
-  Response within **5 seconds** on average
-  Download review as `.txt` file
-  Deployed: **Frontend on [Vercel](https://vercel.com/)** and **Backend on [Render](https://render.com/)**

---

##  Tech Stack

- **Frontend:** React, HTML, CSS, `marked`
- **Backend:** Node.js, Express.js, `node-fetch`, `rate-limit`, `cors`, `dotenv`
- **AI Engine:** OpenAI GPT-4o API
- **Deployment:** Render (Backend) & Vercel (Frontend)

---

##  Setup Instructions

###  Prerequisites

- Node.js and npm installed
- OpenAI API key

###  Clone the Repository

```bash
git clone https://github.com/your-username/code-review-gpt.git
cd code-review-gpt

Link: https://code-review-chatbot.vercel.app/
