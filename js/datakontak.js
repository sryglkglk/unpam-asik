fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    // Ketua Kelas
    const ketua = data.ketua || {};
    const ketuaDiv = document.getElementById('kontak-ketua');
    let ketuaWhatsappLink = '';
    if (ketua.no_hp) {
      // Pastikan nomor HP hanya angka dan awali dengan 62 jika perlu
      let hp = ketua.no_hp.replace(/\D/g, '');
      if (hp.startsWith('0')) hp = '62' + hp.slice(1);
      if (!hp.startsWith('62')) hp = '62' + hp;
      ketuaWhatsappLink = `<a href="https://wa.me/${hp}" target="_blank">Chat WhatsApp</a>`;
    }
    ketuaDiv.innerHTML = `
      <p><strong>Kang Atmin (Ketua Kelas):<br></strong> ${ketua.nama || ''} (${ketua.nim || ''})<br>
      <span style="user-select:all;">${ketua.no_hp || ''}</span>
      ${ketuaWhatsappLink ? `<br><a href="https://wa.me/${ketua.no_hp ? (ketua.no_hp.replace(/\D/g, '').replace(/^0/, '62').replace(/^(?!62)/, '62')) : ''}" target="_blank" style="color:#25D366;">Chat WhatsApp</a>` : ''}
      ${ketua.email ? `<br><a href="mailto:${ketua.email}" style="color:#e75480;">${ketua.email}</a>` : ''}
      </p>
    `;

    // Dosen - dua kolom
    const dosenDiv = document.getElementById('kontak-dosen');
    let dosenList = [];
    Object.keys(data)
      .filter(key => key.startsWith('mk.'))
      .forEach(mkKey => {
        const mk = data[mkKey];
        const kontakKey = Object.keys(data).find(k => data[k].id_mk === mkKey && k.startsWith('kontak.'));
        const kontak = kontakKey ? data[kontakKey] : {};
        let dosenWhatsappLink = '';
        if (kontak.no_hp) {
          let hp = kontak.no_hp.replace(/\D/g, '');
          if (hp.startsWith('0')) hp = '62' + hp.slice(1);
          if (!hp.startsWith('62')) hp = '62' + hp;
          dosenWhatsappLink = `<a href="${kontak.link || `https://wa.me/${hp}`}" target="_blank">Chat WhatsApp</a>`;
        }
        dosenList.push(`
          <div style="margin-bottom:1em;">
            <strong>${mk.judul || ''}</strong><br>
            ${mk.dosen || ''}<br>
            <span style="user-select:all;">${kontak.no_hp || ''}</span>
            ${dosenWhatsappLink ? `<br><a href="${kontak.link || `https://wa.me/${kontak.no_hp ? (kontak.no_hp.replace(/\D/g, '').replace(/^0/, '62').replace(/^(?!62)/, '62')) : ''}`}" target="_blank" style="color:#25D366;">Chat WhatsApp</a>` : ''}
            ${kontak.email ? `<br><a href="mailto:${kontak.email}" style="color:#e75480;">${kontak.email}</a>` : ''}
          </div>
        `);
      });
    // Bagi dua kolom
    const half = Math.ceil(dosenList.length / 2);
    const col1 = dosenList.slice(0, half).join('');
    const col2 = dosenList.slice(half).join('');
    dosenDiv.innerHTML = `
      <p><strong>Dosen:</strong></p>
      <div class="row">
        <div class="col-md-6">${col1}</div>
        <div class="col-md-6">${col2}</div>
      </div>
    `;
  })
  .catch(() => {
    document.getElementById('kontak-ketua').innerHTML = '<p class="text-danger">Gagal memuat kontak ketua kelas.</p>';
    document.getElementById('kontak-dosen').innerHTML = '<p class="text-danger">Gagal memuat kontak dosen.</p>';
  });