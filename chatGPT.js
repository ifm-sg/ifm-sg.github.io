var ajaxCall = (key, url, parsedMessages, temperature) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        messages: parsedMessages,
        max_tokens: 3500,
        n: 1,
        temperature: temperature,
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

const url = "https://api.openai.com/v1";

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class MainWebComponent extends HTMLElement {
    async post(apiKey, endpoint, messages, temperature) {
      const items = messages.split(";");
      // Parse message strings into an array of message objects
      const parsedMessages = items.map(item => {
      const [role, content] = item.split(",");
      const roleValue = role.split(":")[1].trim();
      const contentValue = content.split(":")[1].trim();
      return {
        role: roleValue,
        content: contentValue
      };
    });
      const { response } = await ajaxCall(
        apiKey,
        `${url}/${endpoint}`,
        parsedMessages,
        temperature
      );
      //console.log(response.choices[0].text);
      return response.choices[0].text;
    }
  }
  customElements.define("custom-widget", MainWebComponent);
})();
