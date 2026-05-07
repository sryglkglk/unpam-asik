// Ambil data info umum dari data.json dan render ke daftar
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const umumList = document.getElementById('umum-list');
    umumList.innerHTML = '';

    // Ambil semua data info_umum lalu ubah jadi array + parsing tanggal
    const infos = Object.keys(data)
      .filter(key => key.startsWith('info_umum.'))
      .map(key => {
        const info = data[key];

        let dateObj = null;

        if (info.realease) {
          const tgl = info.realease;

          // format: "Senin, 2026-02-23"
          const match = tgl.match(/^[A-Za-z]+,\s*(\d{4}-\d{2}-\d{2})$/);

          if (match) {
            dateObj = new Date(match[1]);
          } 
          // format bebas yang bisa diparse JS
          else if (!isNaN(Date.parse(tgl))) {
            dateObj = new Date(tgl);
          }
        }

        return {
          ...info,
          _date: dateObj || new Date(0) // fallback kalau kosong
        };
      })
      // SORT TERBARU DI ATAS
      .sort((a, b) => b._date - a._date);

    // Render ke HTML
    infos.forEach(info => {
      let tanggalRilis = '';

      if (info._date && info._date.getTime() !== 0) {
        tanggalRilis = info._date.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } else if (info.realease) {
        // fallback kalau format aneh
        tanggalRilis = info.realease;
      }

      const li = document.createElement('li');

      li.innerHTML = `
        <strong>${info.judul || ''}</strong><br>
        <small style="color: #acacac">[Release: ${tanggalRilis}]</small><br>
        <div style="padding-left: 2em;">${info.isi || ''}</div><br><br>
      `;

      umumList.appendChild(li);
    });

    // Kalau ternyata kosong
    if (infos.length === 0) {
      umumList.innerHTML = '<li class="text-warning">Belum ada info umum.</li>';
    }
  })
  .catch(() => {
    document.getElementById('umum-list').innerHTML =
      '<li class="text-danger">Gagal memuat info umum.</li>';
  });
