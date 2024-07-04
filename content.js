chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPassword") {
      const passwordField = document.querySelector('input[type="password"]');
      if (passwordField) {
        sendResponse({ password: passwordField.value });
      } else {
        sendResponse({ password: null });
      }
    }
  });
  