# 📄 Roast My Resume

**Roast My Resume** is a fun and sarcastic AI-powered web app that analyzes uploaded resumes in `.pdf` or `.txt` format, and roasts them in a playful but constructive tone using **Groq's LLaMA 3-70B** model.

## 🔗 Live Demo

👉 [Try it out now](https://roast-resume.onrender.com)

---

## 🚀 Features

- 📤 Upload your `.pdf` or `.txt` resume
- 🔥 Get:
  - A funny summary
  - 3 roast-style improvement suggestions
  - 3 mildly insulting job roles you could (maybe) qualify for
- ⚙️ AI-powered using **Groq API**
- 📁 File upload support
- ✨ Clean UI with instant feedback

---

## 🧰 Tech Stack

| Frontend        | Backend         | AI Model        | Other         |
|----------------|-----------------|-----------------|---------------|
| HTML + JavaScript (vanilla) | Node.js + Express | Groq LLaMA3-70B | pdf-parse, multer, dotenv |

---

## 🛠️ How It Works

1. User uploads a resume file (PDF or TXT)
2. Resume is parsed on the backend
3. Extracted text is sent to Groq’s AI via API
4. Roast-style feedback is generated and sent back to the frontend

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/your-username/resume-roaster.git
cd resume-roaster

# Install backend dependencies
cd server
npm install

# Add your Groq API Key
echo "GROQ_API_KEY=your_groq_api_key" > .env

# Start backend server
node index.js
```

Then open `public/index.html` in your browser.

---

## 📁 Folder Structure

```
resume-roaster/
├── public/
│   ├── index.html
│   └── script.js
├── server/
│   ├── index.js
│   ├── .env
│   └── utils/
│       └── extractText.js
```

---

## 🤖 AI Prompt

> "Roast this resume in a fun, sarcastic, but helpful tone.  
>  Return:  
>  1. A funny summary  
>  2. 3 roast-style suggestions for improvement  
>  3. 3 job roles they might (barely) qualify for"

---

## 🙌 Credits

- 🧠 Powered by [Groq AI](https://console.groq.com/)
- 💻 Built with Node.js, Express, and plain HTML/JS

