var ajaxCall = (apiKey, prompt) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.openai.com/v1/completions",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: prompt,
        max_tokens: 3500,
        n: 1,
        temperature: 0.6,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
    async post(apiKey, prompt) {
      const { response } = await ajaxCall(
        apiKey,
        prompt
      );
      //console.log(response.choices[0].text);
      return response.choices[0].text;
    }
  }
  customElements.define("custom-widget-chatgpt-completions", MainWebComponent);
})();
