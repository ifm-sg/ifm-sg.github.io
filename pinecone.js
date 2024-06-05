// Function to make an AJAX call to the Pinecone API
var pineconeAjaxCall = (key, indexHost, embedding, countryFilter, yearFilter) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${indexHost}/query`,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        vector: embedding,
        filter: {"country": {"$in": countryFilter},
                "year": {"$in": yearFilter}},
        topK: 5,
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
    async post(apiKey, indexHost, embedding, countryFilter, yearFilter) {
      // Validate inputs
      if (!apiKey || !indexHost || !Array.isArray(embedding) || embedding.length === 0 || !Array.isArray(countryFilter) || countryFilter.length === 0 || !Array.isArray(yearFilter) || yearFilter.length === 0) {
        throw new Error('API key, index host, non-empty embedding / country filter / year filter array are required.');
      }
      try {
        const { response } = await pineconeAjaxCall(apiKey, indexHost, embedding, countryFilter, yearFilter);
        console.log(response);
        let responseArray = [];
        let content = "";
        for (let i = 0; i < response.matches.length; i++) {
          content += ` Option ${i}: ${response.matches[i].metadata.text};`;
        }
        responseArray.push(content);
        let ids = `${response.matches[0].id}`;
        for (let i = 1; i < response.matches.length; i++) {
          ids += `,${response.matches[i].id}`;
        }
        responseArray.push(ids);
        return responseArray;
      } catch (error) {
        console.error('Error in post method:', error);
        throw error;
      }
    }
  }
  customElements.define("custom-widget-pinecone", PineconeWebComponent);
})();
