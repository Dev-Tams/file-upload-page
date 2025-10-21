    const apiBase = 'https://file-upload-c2qe.onrender.com';
    const choose = document.getElementById('choose');
    const inputArea = document.getElementById('inputArea');
    const form = document.getElementById('apiForm');
    const output = document.getElementById('output');
    const clearBtn = document.getElementById('clearBtn');

    const templates = {
      login: `
        <input id="email" placeholder="Email" required />
        <input id="password" type="password" placeholder="Password" required />
      `,
      register: `
        <input id="email" placeholder="Email" required />
        <input id="password" type="password" placeholder="Password" required />
      `,
      files: `
        <input id="token" placeholder="JWT token (optional for public test)" />
      `,
      restore: `
        <input id="emailRestore" placeholder="User email to restore (admin)" required />
        <input id="token" placeholder="Admin JWT token" required />
      `,
      files_restore: `
        <input id="fileId" placeholder="File ID to restore (admin)" required />
        <input id="token" placeholder="Admin JWT token" required />
      `
    };

    function renderTemplate(){
      inputArea.innerHTML = templates[choose.value] || '';
    }
    choose.addEventListener('change', renderTemplate);
    renderTemplate();

    clearBtn.addEventListener('click', () => {
      output.textContent = 'Cleared.';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      output.textContent = '⏳ Sending request...';

      const endpoint = choose.value;
      let url = apiBase;
      let opts = { method: 'GET', headers: {} };

      try {
        if(endpoint === 'login'){
          url += '/api/login';
          opts.method = 'POST';
          opts.headers['Content-Type'] = 'application/json';
          opts.body = JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
          });
        } else if(endpoint === 'register'){
          url += '/api/register';
          opts.method = 'POST';
          opts.headers['Content-Type'] = 'application/json';
          opts.body = JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
          });
        } else if(endpoint === 'files'){
          url += '/api/files';
          opts.method = 'GET';
          const token = document.getElementById('token').value.trim();
          if(token) opts.headers['Authorization'] = 'Bearer ' + token;
        } else if(endpoint === 'restore'){
          const email = document.getElementById('emailRestore').value.trim();
          url += `/api/admin/users/restore/${encodeURIComponent(email)}`;
          opts.method = 'PATCH';
          const token = document.getElementById('token').value.trim();
          if(token) opts.headers['Authorization'] = 'Bearer ' + token;
        } else if(endpoint === 'files_restore'){
          const id = document.getElementById('fileId').value.trim();
          url += `/api/files/restore/${encodeURIComponent(id)}`;
          opts.method = 'PATCH';
          const token = document.getElementById('token').value.trim();
          if(token) opts.headers['Authorization'] = 'Bearer ' + token;
        }

        const res = await fetch(url, opts);
        const text = await res.text();

        // try parse json
        try {
          const json = JSON.parse(text);
          output.textContent = JSON.stringify(json, null, 2);
        } catch (err) {
          output.textContent = text;
        }

      } catch (err){
        output.textContent = 'Request failed: ' + err.message;
      }
    });

    // small accessibility: allow theme toggle by keyboard
    toggleKey = document.getElementById('themeToggle');
    toggleKey.addEventListener('keyup', (e) => {
      if(e.key === 'Enter') toggleKey.click();
    });