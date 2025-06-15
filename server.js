const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    let resumeText = '';

   
    if (req.file.mimetype === 'application/pdf') {
      
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
    } else if (req.file.mimetype === 'text/plain') {
     
      resumeText = fs.readFileSync(req.file.path, 'utf8');
    }

    
    fs.unlinkSync(req.file.path);

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the resume' });
    }

    
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'user',
            content: `Please analyze this resume and provide feedback in the following EXACT format with emojis and proper sections:

🔥 RESUME ROAST SUMMARY
[Write a witty, sarcastic but constructive 2-3 sentence summary of the overall resume]

📝 WHAT NEEDS FIXING 
1. [First major improvement with specific actionable advice]
2. [Second major improvement with specific actionable advice] 
3. [Third major improvement with specific actionable advice]

💼 JOBS YOU MIGHT (BARELY) QUALIFY FOR
• [First job role with a humorous but realistic comment]
• [Second job role with a humorous but realistic comment]
• [Third job role with a humorous but realistic comment]

⭐ THE BRIGHT SIDE
[End with 1-2 positive things about the resume to keep it constructive]

Resume to analyze:
${resumeText}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const roastContent = groqResponse.data.choices[0].message.content;

    res.json({ roast: roastContent });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    
   
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.response && error.response.status === 401) {
      res.status(401).json({ error: 'Invalid Groq API key' });
    } else if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
    }
  }
});


app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`🔥 Roast My Resume server running on http://localhost:${PORT}`);
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  Warning: GROQ_API_KEY not found in environment variables');
  }
});