function askAI(message) {
  return new Promise(res => {
    setTimeout(() => {
      res('Test');
    }, 1000);
  });
}

function OpenaiFetchAPI() {
  console.log("Calling GPT3");
  var url = "https://api.openai.com/v1/chat/completions";
  var bearer = 'Bearer ' + OPENAI_API_KEY
  fetch(url, {
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
  })
  .catch(error => {
    console.error('Error using OpenAI fetch call:', error)
  });
}