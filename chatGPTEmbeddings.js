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
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async getEmbeddings(key, input) {
      const { emb } = await ajaxCall(
        key,
        input
      );
      console.log(emb.data);
      return emb.data[0].embedding;
    }
  }
  customElements.define("custom-widget-chatgpt-embeddings", MainWebComponent);
})();
