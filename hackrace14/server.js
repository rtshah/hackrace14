const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const adminDb = require('./src/firebase-admin');


const app = express();
app.use(express.json());
app.use(cors()); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/summarize/:date', async (req, res) => {
  try {
    const { text } = req.body;
    const dateString = req.params.date; // Format: YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day+1));
    const collectionName = getCollectionName(date);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes nurse's daily actions. Format the summary as follows: 1) Patient's name or 'undetermined', 2) Other nurses involved or 'I completed this action on my own', 3) A bullet list of actions performed.",
        },
        {
          role: "user",
          content: `Please summarize the following text in the specified format: ${text}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content.trim();

    // Store the summary in Firestore
    await adminDb.collection(collectionName).add({
      summary,
    });

    // Send the response after storing in Firestore
    res.json({ summary });
    
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Error generating summary.' });
  }
});


const csvWriter = createObjectCsvWriter({
  path: './summaries.csv', // Path to save CSV
  header: [
    { id: 'patientName', title: 'Patient Name' },
    { id: 'twoAssist', title: 'Two Assist' },
    { id: 'tookShower', title: 'Took Shower' },
    { id: 'otherDetails', title: 'Other Details' },
  ],
});

// Route to generate CSV from summaries in Firestore and OpenAI analysis
app.get('/generate-csv', async (req, res) => {
  try {
    // 1. Fetch all summaries from Firestore
    const summariesSnapshot = await adminDb.collection('summaries').get();
    const summaries = summariesSnapshot.docs.map((doc) => doc.data());

    // 2. Process each summary using OpenAI
    const rows = [];
    for (const summary of summaries) {
      const openAIResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that processes daily patient summaries.' },
          {
            role: 'user',
            content: `Analyze this patient summary and extract: 1) Is the patient a "two assist"? 2) Did the patient take a shower? 3) Any other important details. Here is the summary: "${summary.summary}"`,
          },
        ],
      });

      const openAIContent = openAIResponse.data.choices[0].message.content;

      // Extract required fields from OpenAI response
      const twoAssist = openAIContent.includes('two assist') ? 'Yes' : 'No';
      const tookShower = openAIContent.includes('shower') ? 'Yes' : 'No';

      // Add the processed row to the CSV
      rows.push({
        patientName: summary.patientName || 'Unknown',
        twoAssist,
        tookShower,
        otherDetails: openAIContent,
      });
    }

    // 3. Generate the CSV using the processed summaries
    await csvWriter.writeRecords(rows);

    // 4. Serve the generated CSV as a downloadable file
    res.download(path.join(__dirname, 'summaries.csv'), 'summaries.csv', (err) => {
      if (err) {
        res.status(500).send('Error downloading the file.');
      }
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('An error occurred while generating the CSV.');
  }
});
function getCollectionName(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `summaries_${year}_${month}_${day}`;
}
app.get('/api/documents/:date', async (req, res) => {
  try {
    const dateString = req.params.date; // Format: YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Create a Date object in UTC
    const date = new Date(Date.UTC(year, month -1, day+1));
    
    const collectionName = getCollectionName(date);
    
    const snapshot = await adminDb.collection(collectionName).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No documents found for this date' });
    }

    const summaries = snapshot.docs.map(doc => ({
      id: doc.id,
      summary: doc.data().summary
    }));

    return res.status(200).json(summaries);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// DELETE endpoint to delete a summary by document ID
app.delete('/api/summary/:id', async (req, res) => {
  const summaryId = req.params.id;
  try {
    const docRef = adminDb.collection('summaries').doc(summaryId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    await docRef.delete();
    return res.status(200).json({ message: `Summary with ID ${summaryId} has been deleted.` });
  } catch (error) {
    console.error('Error deleting summary:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/summary/:id', async (req, res) => {
  const summaryId = req.params.id;
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ message: 'Summary content is required' });
  }

  try {
    const docRef = adminDb.collection('summaries').doc(summaryId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    await docRef.update({ summary });
    return res.status(200).json({ message: `Summary with ID ${summaryId} has been updated.` });
  } catch (error) {
    console.error('Error updating summary:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
