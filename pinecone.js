var ajaxCall = (key, indexHost, values) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://${indexHost}/query',
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        vector: values,
        filter: {"genre": {"$eq": "documentary"}},
        topK: 1,
        includeValues: true
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
    async post(apiKey, indexHost, values) {
      const { response } = await ajaxCall(
        apiKey,
        indexHost,
        values
      );
      //console.log(response.choices[0].text);
      return response.choices[0].text;
    }
  }
  customElements.define("custom-widget-chatgpt-completions", MainWebComponent);
})();
