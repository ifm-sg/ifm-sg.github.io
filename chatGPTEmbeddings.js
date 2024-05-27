var ajaxCall = (key, input) => {
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

(function () {
  const template_emb = document.createElement("template");
  template_emb.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class EmbeddingWebComponent extends HTMLElement {
    async getEmbeddings(key, input) {
      try{
        const { emb } = await ajaxCall(key, input);
        console.log(emb.data);
        return emb.data[0].embedding;
      } catch(error) {
        console.error('Error fetching embeddings:', error)
      }
    }
  }
  customElements.define("custom-widget-chatgpt-embeddings", EmbeddingWebComponent);
})();
