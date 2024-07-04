import PropTypes from 'prop-types';

const apiKey = 'YWl0b29sc2Z4bUBnbWFpbC5jb20:edOdSn7wseCKh5MoIQu63';
const talksLink = 'https://api.d-id.com/talks';

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
      config: { fluent: 'false', pad_audio: '0.0' },
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
    const response = await fetch(`${talksLink}/${id}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Response from GET talks:', data);
    return data.pending_url; 
  } catch (error) {
    console.error('Error getting talks:', error);
    throw error;
  }
};

postTalk.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

export { postTalk, getTalks };
