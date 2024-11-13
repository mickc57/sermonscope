import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testAPI() {
  try {
    // Test server health
    const healthCheck = await fetch('http://localhost:3000/api/health');
    console.log('Server health:', healthCheck.ok ? 'OK' : 'Failed');

    // Test file upload
    const formData = new FormData();
    const testFile = fs.createReadStream('test.mp3');
    formData.append('audio', testFile);

    const uploadResponse = await fetch('http://localhost:3000/api/transcribe', {
      method: 'POST',
      body: formData
    });

    const { transcriptionId } = await uploadResponse.json();
    console.log('Transcription started:', transcriptionId);

    // Poll for status
    let status;
    do {
      const statusResponse = await fetch(`http://localhost:3000/api/transcribe/${transcriptionId}/status`);
      status = await statusResponse.json();
      console.log('Status:', status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (status.status !== 'completed' && status.status !== 'error');

    if (status.status === 'completed') {
      // Get results
      const resultResponse = await fetch(`http://localhost:3000/api/transcribe/${transcriptionId}/result`);
      const result = await resultResponse.json();
      console.log('Transcription result:', result);

      const analysisResponse = await fetch(`http://localhost:3000/api/analyze/${transcriptionId}`);
      const analysis = await analysisResponse.json();
      console.log('Analysis result:', analysis);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();