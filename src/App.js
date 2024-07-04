import React, { useState } from 'react';
import { postTalk, getTalks, idleTalk, getIdle } from './api';

function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoIdle, setVideoIdle] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [uploadMessage, setUploadMessage] = useState('');

  const apiKey = 'YWl0b29sc2Z4bUBnbWFpbC5jb20:edOdSn7wseCKh5MoIQu63';

  const onChangeFile = async (e) => {
    const data = e.target.files[0];
    setFile(data);
    await uploadImage(data);
  };

  const uploadImage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Basic ${btoa(apiKey)}`,
      }
    };

    setUploadMessage('Uploading image...');
    try {
      const response = await fetch('https://api.d-id.com/images', options);
      if (!response.ok) {
        throw new Error(`Error uploading image: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setImageUrl(data.url);
      setUploadMessage('Image uploaded successfully.');
      console.log(`Successfully uploaded. Here's the link: ${data.url}`);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadMessage('Error uploading image.');
    } finally {
      setTimeout(() => {
        setUploadMessage('');
      }, 2000);
    }
  };

const generateHandler = async () => {
  if (imageUrl) {
    setIsLoading(true); 
    try {
      const talkId = await postTalk(imageUrl);
      console.log(`Successfully generated talk. Talk ID: ${talkId}`);

      const idleTalkId = await idleTalk(imageUrl);
      console.log(`Successfully generated idle talk. Idle Talk ID: ${idleTalkId}`);

      const result = await getTalks(talkId); 
      const result_idle = await getIdle(idleTalkId);
      setVideoUrl(result);
      setVideoIdle(result_idle);
      console.log('Generated video URL:', result);
      console.log('Generated idle video URL:', result_idle);
    } catch (error) {
      console.error('Error generating talk:', error);
    } finally {
      setIsLoading(false);
    }
  } else {
    console.error('Image URL is not set');
  }
};


  return (
    <div className="App h-screen">
      <div className='flex flex-col justify-center items-center mt-10 gap-3'>
        <div className='flex gap-3 items-center justify-center'>
          <input type='file' accept="image/*" onChange={onChangeFile} />
        </div>
        {uploadMessage && <p>{uploadMessage}</p>}
        <div className='image-space'>
          {file === null ? null : <img className='max-w-full h-96' src={URL.createObjectURL(file)} alt='images' />}
        </div>
        <button className='bg-blue-500 hover:bg-blue-700 p-5 rounded-md text-white' onClick={generateHandler} disabled={isLoading || !imageUrl}>
          {isLoading ? 'Loading...' : 'GENERATE'}
        </button>
        <div className='flex flex-col md:flex-row gap-5 m-5'>
          {videoUrl &&
              <video className='w-auto h-96' controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>}
          {videoIdle &&
              <video className='w-auto h-96' controls>
                <source src={videoIdle} type="video/mp4" />
                Your browser does not support the video tag.
              </video>}
        </div>
      </div>
    </div>
  );
}

export default App;
