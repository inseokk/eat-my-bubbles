function random(min, max) {
  return Math.random() * (max - min) + min;
}

function askAI(message) {
  console.log("Fetching GPT-4o Response...");
  var url = "https://api.openai.com/v1/chat/completions";
  var bearer = 'Bearer ' + OPENAI_API_KEY
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "model": "gpt-4o",
      "messages": [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "You are a helpful assistant for a PDF editor app named Bubbles. Your responses are as helpful and education while not violating any academic dishonesty. Be extra friendly; ask if any more information can be given. At the end of every response, say \\\"Eat my bubbles!\\\""
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": message
            }
          ]
        }
      ],
      "response_format": {
        "type": "text"
      },
      "temperature": 1,
      "max_completion_tokens": 2000,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    })
  })
  .then(res => res.json())
  .then(data => {
    console.dir(data, {depth: null});
    console.log(Object.keys(data));
    console.log(data.choices[0].message.content);
    return data.choices[0].message.content;
  })
  .catch(error => {
    console.error('Error using OpenAI fetch call:', error)
  });
}