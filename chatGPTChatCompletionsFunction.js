// Function to make an AJAX call to the OpenAI API
var chatCompletionsFunctionAjaxCall = (key, parsedQuery) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url:  "https://api.openai.com/v1/chat/completions",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: parsedQuery,
        temperature: 0,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });
};

// Immediately Invoked Function Expression (IIFE) to define the custom element
(function () {
  // Create a template for the custom element
  const chatCompletionsFunctionTemplate = document.createElement("template");
  chatCompletionsFunctionTemplate.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;

  // Define the custom element class
  class ChatCompletionsFunctionWebComponent extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM tree to this instance of the custom element
      this.attachShadow({ mode: 'open' });  
      // Clone the template content and append it to the shadow DOM
      this.shadowRoot.appendChild(chatCompletionsFunctionTemplate.content.cloneNode(true));
    }
    // Method to make a POST request to the OpenAI API
    async post(apiKey, query) {
      try{
        // Ensure messages is properly formatted JSON string
        const parsedQuery = JSON.parse(messages);
        // Make the API call
        const { response } = await chatCompletionsFunctionAjaxCall(apiKey, parsedQuery);
        console.log(response.choices);
        // Return the first message content
        return response.choices[0].message.content;
      } catch (error) {
        console.error('Error in post method:', error);
        throw error;
      }
    }
  }
   // Define the custom element with a unique name
  customElements.define("custom-widget-chatgpt-chat-completions-function", ChatCompletionsFunctionWebComponent);
})();
