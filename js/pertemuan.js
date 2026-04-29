// Ambil data info pertemuan dari data.json dan render ke daftar
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const pertemuanList = document.getElementById('pertemuan-list');
    pertemuanList.innerHTML = '';

    // Ambil semua key yang diawali 'info.' → map ke array dengan parsing tanggal
    const infos = Object.keys(data)
      .filter(key => key.startsWith('info.'))
      .map(key => {
        const info = data[key];
        let dateObj = null;
        const tglRaw = info.realease || '';

        // Parsing format "Senin, 2025-06-02"
        const match = tglRaw.match(/^[A-Za-z]+,\s*(\d{4}-\d{2}-\d{2})$/);
        if (match) {
          dateObj = new Date(match[1]);
        } else if (!isNaN(Date.parse(tglRaw))) {
          dateObj = new Date(tglRaw);
        }

        return { key, info, dateObj };
      })
      // Sort berdasarkan tanggal terbaru di atas
      .sort((a, b) => {
        if (a.dateObj && b.dateObj) return b.dateObj - a.dateObj;
        if (a.dateObj) return -1;
        if (b.dateObj) return 1;
        return 0;
      });

    // Render semua info ke dalam <li>
    infos.forEach(item => {
      const info = item.info;
      let tanggalRilis = '';

      if (item.dateObj) {
        tanggalRilis = item.dateObj.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } else {
        tanggalRilis = info.realease || '';
      }

      const li = document.createElement('li');
      li.innerHTML = `
        <strong style="color: #a3f7fd;">${info.judul || ''}</strong><br>
        <small class="text-muted" style="color:#fff !important;">[${tanggalRilis}]</small><br>
        <div style="padding-left: 2em;">${info.isi || ''}</div><br><br>
      `;
      pertemuanList.appendChild(li);
    });
  })
  .catch(err => {
    const pertemuanList = document.getElementById('pertemuan-list');
    pertemuanList.innerHTML = '<li class="text-danger">Gagal memuat info pertemuan.</li>';
    console.error(err);
  });