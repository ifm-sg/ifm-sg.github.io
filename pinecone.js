// Function to make an AJAX call to the Pinecone API
var pineconeAjaxCall = (key, indexHost, vector, countryFilter, yearFilter) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${indexHost}/query`,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        vector: vector,
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
    async post(apiKey, indexHost, vector, countryFilter, yearFilter) {
      // Validate inputs
      if (!apiKey || !indexHost || !Array.isArray(vector) || vector.length === 0 || !Array.isArray(countryFilter) || countryFilter.length === 0 || !Array.isArray(yearFilter) || yearFilter.length === 0) {
        throw new Error('API key, index host, non-empty vector / country filter / year filter array are required.');
      }
      try {
        const { response } = await pineconeAjaxCall(apiKey, indexHost, vector, countryFilter, yearFilter);
        console.log(response);
        let content = "";
        for (let i = 0; i < response.matches.length; i++) {
          content += ` Option ${i}: ${response.matches[i].metadata.text};`;
        }
        let ids = "";
        for (let i = 0; i < response.matches.length; i++) {
          ids += ` ${response.matches[i].id},`;
        }
        let responseArray = [];
        responseArray.push(content);
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
