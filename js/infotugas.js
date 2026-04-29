      // Ambil data tugas dari data.json dan render ke daftar
      fetch('./data.json')
        .then(response => response.json())
        .then(data => {
          const tugasList = document.querySelector('#tugas-list');
          tugasList.innerHTML = '';
          const tugasItems = Object.keys(data)
            .filter(key => key.startsWith('tugas.'))
            .map(key => {
              const tugas = data[key];
              const mk = data[tugas.id_mk] || {};
              const namaMk = mk.judul || tugas.id_mk || '';
              const deadline = tugas.deadline ? new Date(tugas.deadline) : null;
              return { key, tugas, mk, namaMk, deadline };
            })
            .sort((a, b) => {
              if (!a.deadline && !b.deadline) return 0;
              if (!a.deadline) return 1;
              if (!b.deadline) return -1;
              return a.deadline - b.deadline;
            });

          tugasItems.forEach(item => {
            const { tugas, namaMk, deadline } = item;
            const deadlineHtml = deadline
              ? `<span style="display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;font-size:0.85em;color:blue;background:yellow;border-radius:4px;padding:2px 10px;min-width:70px;min-height:24px;text-align:center;"><b>${deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</b></span>`
              : '';
            const li = document.createElement('li');
            li.innerHTML = `
                    <div style="text-align: justify; max-width: 600px;">
                    <strong style="color: #a3f7fd;">${namaMk}</strong> ${deadlineHtml}
                    <br><b style="color: #00ff3c;">${tugas.namatugas || ''}</b>
                    <br><span style="padding-left: 2em;">${tugas.deskripsi || ''}</span>
                    ${tugas.cara ? `<br><div style="font-size:0.85em; font-style:italic; font-weight:300; color:#d1d5db;">${tugas.cara}</div>` : ''}
                    <br><br>
                    </div>
                  `;      tugasList.appendChild(li);
          });      })
        .catch(err => {
          // Jika gagal, tampilkan pesan error
          const tugasList = document.querySelector('#tugas-list');
          tugasList.innerHTML = '<li class="text-danger">Gagal memuat data tugas.</li>';
        });