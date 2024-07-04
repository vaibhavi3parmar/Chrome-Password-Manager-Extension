document.getElementById('savePassword').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const passwordField = document.querySelector('input[type="password"]');
            const siteName = document.title;
            return { password: passwordField ? passwordField.value : null, siteName };
          },
        },
        (results) => {
          if (chrome.runtime.lastError) {
            document.getElementById('status').textContent = 'Error: ' + chrome.runtime.lastError.message;
            return;
          }
          if (results && results[0]) {
            const { password, siteName } = results[0].result;
            if (password) {
              const url = new URL(tabs[0].url);
              const domain = url.hostname;
              chrome.storage.local.get({ passwords: {} }, (data) => {
                const passwords = data.passwords;
                passwords[domain] = { password, siteName };
                chrome.storage.local.set({ passwords }, () => {
                  document.getElementById('status').textContent = 'Password saved successfully!';
                });
              });
            } else {
              document.getElementById('status').textContent = 'No password found on this page.';
            }
          } else {
            document.getElementById('status').textContent = 'No password found on this page.';
          }
        }
      );
    } else {
      document.getElementById('status').textContent = 'No active tab found.';
    }
  });
});

document.getElementById('viewPassword').addEventListener('click', () => {
  chrome.storage.local.get('passwords', (data) => {
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';
    const passwords = data.passwords || {};
    for (const { password, siteName } of Object.values(passwords)) {
      const li = document.createElement('li');
      li.textContent = `${siteName}: ${password}`;
      passwordList.appendChild(li);
    }
    if (passwordList.innerHTML === '') {
      document.getElementById('status').textContent = 'No saved passwords found.';
    } else {
      document.getElementById('status').textContent = 'Saved passwords loaded.';
      document.getElementById('savedPasswords').style.display = 'block';
    }
  });
});
