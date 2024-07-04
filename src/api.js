import PropTypes from 'prop-types';

const apiKey = 'YWl0b29sc2Z4bUBnbWFpbC5jb20:edOdSn7wseCKh5MoIQu63';
const talksLink = 'https://api.d-id.com/talks';

// idle talks - no talk
const idleTalk = async (url) => {
  const encodedApiKey = btoa(apiKey);

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedApiKey}`
    },
    body: JSON.stringify({
      script: {
        type: 'text',
        subtitles: 'false',
        provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
        ssml: true,
        input: "<break time=\"5000ms\"/><break time=\"5000ms\"/><break time=\"5000ms\"/>",
      },
      config: { fluent: 'false', pad_audio: '0.0', stitch: 'true' },
      source_url: url
    })
  };

  try {
    const response = await fetch(talksLink, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Response from POST create idle talks:', data);
    return data.id;
  } catch (error) {
    console.error('Error posting idle talk:', error);
    throw error;
  }
};

  // post talk
  const postTalk = async (imageUrl) => {
  const encodedApiKey = btoa(apiKey);

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedApiKey}`
    },
    body: JSON.stringify({
      script: {
        type: 'text',
        subtitles: 'false',
        provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
        input: "A good example of a paragraph contains a topic sentence, details and a conclusion. 'There are many different kinds of animals that live in China. Tigers and leopards are animals that live in China's forests in the north."
      },
      config: { fluent: 'false', pad_audio: '0.0', stitch: 'true' },
      source_url: imageUrl
    })
  };

  try {
    const response = await fetch(talksLink, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Response from POST create talks:', data);
    return data.id;
  } catch (error) {
    console.error('Error posting talk:', error);
    throw error;
  }
};


// get talks
const getTalks = async (id) => {
  const encodedApiKey = btoa(apiKey);
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${encodedApiKey}`
    }
  };

  try {
    const fetchTalks = async () => {
      const response = await fetch(`${talksLink}/${id}`, options);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response from GET talks:', data);
      if (data.status === 'done') {
        return data.result_url;
      } else if (data.status === 'started') {
        // if the status still started, recall api
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchTalks();
      } else {
        throw new Error(`Unexpected status: ${data.status}`);
      }
    };

    return await fetchTalks();
  } catch (error) {
    console.error('Error getting talks:', error);
    throw error;
  }
};

//get idle talks
const getIdle = async (id) => {
  const encodedApiKey = btoa(apiKey);
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${encodedApiKey}`
    }
  };

  const fetchIdle = async () => {
    try {
      const response = await fetch(`https://api.d-id.com/talks/${id}`, options);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response from GET idle talks:', data);
      if (data.status === 'done') {
        console.log('Idle talk generation is complete.');
        return data.result_url;
      } else if (data.status === 'started') {
        console.log('Idle talk generation is in progress. Checking again in 2 seconds.');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchIdle();
      } else {
        throw new Error(`Unexpected status: ${data.status}`);
      }
    } catch (error) {
      console.error('Error getting idle talks:', error);
      throw error;
    }
  };

  return await fetchIdle();
};


postTalk.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

export { idleTalk, postTalk, getTalks, getIdle };
