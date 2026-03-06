      // Ambil data tugas dari data.json dan render ke daftar
      fetch('./data.json')
        .then(response => response.json())
        .then(data => {
          const tugasList = document.querySelector('#tugas-list');
          tugasList.innerHTML = '';
          Object.keys(data)
            .filter(key => key.startsWith('tugas.'))
            .forEach(key => {
              const tugas = data[key];
              const mk = data[tugas.id_mk] || {};
              const namaMk = mk.judul || tugas.id_mk || '';
              const deadline = tugas.deadline ? new Date(tugas.deadline) : null;
              const deadlineHtml = deadline
                ? `<span style="display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;font-size:0.85em;color:blue;background:yellow;border-radius:4px;padding:2px 10px;min-width:70px;min-height:24px;text-align:center;"><b>${deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</b></span>`
                : '';
              const li = document.createElement('li');
              li.innerHTML = `
                <strong>${namaMk}</strong> ${deadlineHtml}
                <br><b>${tugas.namatugas || ''}</b>
                <br>${tugas.deskripsi || ''}
                ${tugas.cara ? `<br><span style="font-size:0.85em; font-style:italic; font-weight:300; color:#d1d5db;">${tugas.cara}</span>` : ''}
                <br><br>
              `;
              tugasList.appendChild(li);
            });
        })
        .catch(err => {
          // Jika gagal, tampilkan pesan error
          const tugasList = document.querySelector('#tugas-list');
          tugasList.innerHTML = '<li class="text-danger">Gagal memuat data tugas.</li>';
        });