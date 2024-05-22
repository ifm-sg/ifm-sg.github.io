var ajaxCall = (key, values) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://sample-movies-9lkj2gj.svc.aped-4627-b74a.pinecone.io',
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
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, values) {
      const { response } = await ajaxCall(
        apiKey,
        values
      );
      console.log(response);
      return response.matches.metadata.text;
    }
  }
  customElements.define("custom-widget-pinecone", MainWebComponent);
})();
