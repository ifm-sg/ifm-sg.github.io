// Function to make an AJAX call to the OpenAI API
var embeddingAjaxCall = (key, input) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.openai.com/v1/embeddings",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "text-embedding-3-small",
        input: input
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
  const embeddingTemplate = document.createElement("template-emb");
  embeddingTemplate.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class EmbeddingWebComponent extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM tree to this instance of the custom element
      this.attachShadow({ mode: 'open' });
      // Clone the template content and append it to the shadow DOM
      this.shadowRoot.appendChild(embeddingTemplate.content.cloneNode(true));
    }

    // Method to fetch embeddings from the OpenAI API
    async getEmbeddings(key, input) {
      try{
        // Validate the input before making the API call
        if (!key || !input) {
          throw new Error('API key and input are required.');
        }
         // Make the API call
        const { emb } = await embeddingAjaxCall(key, input);
        console.log(emb.data);
        // Return the embedding
        return emb.data[0].embedding;
      } catch(error) {
        console.error('Error fetching embeddings:', error)
        throw error;  // Re-throw the error after logging it
      }
    }
  }
  // Define the custom element with a unique name
  customElements.define("custom-widget-chatgpt-embeddings", EmbeddingWebComponent);
})();
