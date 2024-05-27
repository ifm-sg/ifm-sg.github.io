// Function to make an AJAX call to the Pinecone API
var pineconeAjaxCall = (key, values) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://sample-movies-9lkj2gj.svc.aped-4627-b74a.pinecone.io/query',
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        vector: values,
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
  pineConeTemplate.innerHTML = `
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
    async post(apiKey, values) {
      // Validate inputs
      if (!apiKey || !Array.isArray(values) || values.length === 0) {
        throw new Error('API key and non-empty values array are required.');
      }
      try {
        const { response } = await pineconeAjaxCall(apiKey, values);
        console.log(response);
        return response.matches.metadata.text;
      } catch (error) {
        console.error('Error in post method:', error);
        throw error;
      }
    }
  }
  customElements.define("custom-widget-pinecone", PineconeWebComponent);
})();
