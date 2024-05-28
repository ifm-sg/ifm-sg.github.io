// Function to make an AJAX call to the Pinecone API
var pineconeAjaxCall = (key, indexHost, vector) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://${indexHost}/query`,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        vector: vector,
        filter: {"genre": {"$eq": "documentary"}},
        topK: 1,
        includeValues: false,
        includeMetadata: true
      }),
      headers: {
        "Content-Type": "application/json",
        "Api-Key": key,
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

(function () {
  const pineconeTemplate = document.createElement("template");
  pineconeTemplate.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  
  class PineconeWebComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(pineconeTemplate.content.cloneNode(true));
    }
    async post(apiKey, indexHost, vector) {
      // Validate inputs
      if (!apiKey || !indexHost || !Array.isArray(vector) || vector.length === 0) {
        throw new Error('API key, index host and non-empty vector array are required.');
      }
      try {
        const { response } = await pineconeAjaxCall(apiKey, indexHost, vector);
        console.log(response);
        return response.matches[0].metadata;
      } catch (error) {
        console.error('Error in post method:', error);
        throw error;
      }
    }
  }
  customElements.define("custom-widget-pinecone", PineconeWebComponent);
})();
