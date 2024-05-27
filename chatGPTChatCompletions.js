var ajaxCall = (key, parsedMessages, temperature) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url:  "https://api.openai.com/v1/chat/completions",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: parsedMessages,
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


(function () {
  const template_cc = document.createElement("template");
  template_cc.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `;
  class ChatCompletionWebComponent extends HTMLElement {
    async post(apiKey, messages, temperature) {
      // Ensure messages is properly formatted JSON string
      const parsedMessages = JSON.parse(messages);
      const { response } = await ajaxCall(
        apiKey,
        parsedMessages,
        temperature
      );
      console.log(response.choices);
      return response.choices[0].message.content;
    }
  }
  customElements.define("custom-widget-chatgpt-chat-completions", ChatCompletionWebComponent);
})();
