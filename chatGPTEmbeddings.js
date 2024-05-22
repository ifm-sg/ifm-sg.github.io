var ajaxCall = (key, urlEmbedding, input) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: urlEmbedding,
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

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, input) {
      const { response } = await ajaxCall(
        apiKey,
        `https://api.openai.com/v1/${endpoint}`,
        input
      );
      console.log(response.choices);
      return response.data[0].embedding;
    }
  }
  customElements.define("custom-widget-embeddings", MainWebComponent);
})();
