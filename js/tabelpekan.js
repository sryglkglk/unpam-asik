        // Ambil data matkul dari data.json dan render ke tabel
        fetch('./data.json')
          .then(response => response.json())
          .then(data => {
            const tbody = document.querySelector('#matkul-table tbody');
            tbody.innerHTML = '';
            const pertemuan2 = data.pertemuan_2sks;
            const pertemuan3 = data.pertemuan_3sks;
            Object.keys(data)
              .filter(key => key.startsWith('mk'))
              .forEach(key => {
                const mk = data[key];
                // Ambil jumlah pertemuan sesuai sks tanpa kurung
                let pertemuan = '';
                if (mk.sks == 2 && pertemuan2) {
                  pertemuan = `${pertemuan2}`;
                } else if (mk.sks == 3 && pertemuan3) {
                  pertemuan = `${pertemuan3}`;
                }
                // Jika mk.jadwal sudah mengandung P..., jangan duplikat
                let jadwal = mk.jadwal || '';
                if (pertemuan && !jadwal.includes('P')) {
                  jadwal = `${jadwal}<br>${pertemuan}`;
                  }

                  // Deadline logic
                  let deadlineText = '';
                  let deadlineRaw = '';
                  if (mk.deadline) {
                    // Format: "[2025-06-06, 23:59:59]"
                    const match = mk.deadline.match(/\[(\d{4}-\d{2}-\d{2}),\s*([\d:]+)\]/);
                    if (match) {
                      const deadlineDate = new Date(`${match[1]}T${match[2]}`);
                      const now = new Date();
                      // Hitung selisih hari (dibulatkan ke bawah)
                      const diffTime = deadlineDate - now;
                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays > 4) {
                        deadlineText = '&gt;4 Hari tersisa 🔵';
                      } else if (diffDays === 4) {
                        deadlineText = '4 Hari tersisa 🟢';
                      } else if (diffDays === 3) {
                        deadlineText = '3 Hari tersisa 🟡';
                      } else if (diffDays === 2) {
                        deadlineText = '2 Hari tersisa 🟠';
                      } else if (diffDays === 1) {
                        deadlineText = '1 Hari tersisa 🔴';
                      } else if (diffDays < 1) {
                        deadlineText = 'Batas waktu habis 💀';
                      }
                      // Format deadlineRaw: Hari, DD-MM-YYYY, HH:mm
                      const jamMenit = match[2].slice(0,5); // ambil HH:mm
                      const tgl = match[1].split('-'); // YYYY, MM, DD
                      const dateObj = new Date(`${match[1]}T${match[2]}`);
                      const hariArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
                      const hari = hariArr[dateObj.getDay()];
                      deadlineRaw = `<br><small>${hari}, ${tgl[2]}-${tgl[1]}-${tgl[0]}, ${jamMenit}</small>`;
                    } else {
                      // Jika format deadline sembarang, tampilkan apa adanya
                      deadlineText = mk.deadline;
                      deadlineRaw = '';
                    }
                  } else {
                    // Jika data deadline tidak diisi
                    deadlineText = 'data tidak tersedia';
                  }
                  
                //   const tr = document.createElement('tr');
                //   tr.innerHTML = `
                //   <td class="align-middle">${mk.alias || ''}</td>
                //   <td class="align-middle">${mk.judul || ''}<br><small>${mk.dosen || ''}</small></td>
                //   <td class="text-center align-middle">${mk.sks || ''}</td>
                //   <td>${jadwal}</td>
                //   <td class="text-center align-middle">${deadlineText}${deadlineRaw}</td>
                //   <td class="text-center align-middle">
                //     <a href="${mk.link || '#'}" class="btn btn-info btn-sm" target="_blank">Buka</a>
                //   </td>
                // `;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                  <td data-label="Matkul" class="align-middle">${mk.alias || ''}</td>

                  <td data-label="Details" class="align-middle">
                    ${mk.judul || ''}<br>
                    <small>${mk.dosen || ''}</small>
                  </td>

                  <td data-label="SKS" align-middle">
                    ${mk.sks || ''}
                  </td>

                  <td data-label="Jadwal">
                    ${jadwal}
                  </td>

                  <td data-label="Deadline" align-middle">
                    ${deadlineText}${deadlineRaw}
                  </td>

                  <td data-label="Link" align-middle">
                    <a href="${mk.link || '#'}" class="btn btn-info btn-sm" target="_blank">Buka</a>
                  </td>
                `;
                tbody.appendChild(tr);
              });
          })
          .catch(err => {
            // Jika gagal, tampilkan pesan error
            const tbody = document.querySelector('#matkul-table tbody');
            tbody.innerHTML = '<tr><td colspan="6" class="text-danger">Gagal memuat data matkul.</td></tr>';
          });