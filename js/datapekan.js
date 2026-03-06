// Ambil data pekan dari file data.json dan isi ke dalam "Pekan ke-"
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    // Misal data = { "pekan_ini": 11 }
    const pekan = data.pekan_ini;
    const strongPekan = document.querySelector('#periode-pekan strong');
    if (strongPekan && pekan) {
      // Format waktu sekarang
      strongPekan.textContent = `Pekan ${pekan}`;
    }
  })
  .catch(err => {
    // Jika gagal, biarkan default
    console.warn('Gagal mengambil data pekan:', err);
  });
// Hitung tanggal Senin dan Sabtu pekan ini
// function getWeekPeriod() {
//   const today = new Date();
//   // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
//   const day = today.getDay();
//   // Jika hari Minggu, geser ke Senin sebelumnya
//   const monday = new Date(today);
//   monday.setDate(today.getDate() - ((day + 6) % 7));
//   const saturday = new Date(monday);
//   saturday.setDate(monday.getDate() + 5);

//   // Format tanggal: Senin, 3 Juni 2025
//   const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
//   const locale = 'id-ID';
//   return `${monday.toLocaleDateString(locale, options)} s/d ${saturday.toLocaleDateString(locale, options)}`;
// }

function getWeekPeriodObj() {
  const today = new Date();
  const day = today.getDay();

  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const locale = 'id-ID';

  return {
    start: monday.toLocaleDateString(locale, options),
    end: saturday.toLocaleDateString(locale, options)
  };
}

// // Pilih strong kedua di #periode-pekan dan isi dengan periode pekan
// const periodeStrong = document.querySelectorAll('#periode-pekan strong')[1];
// if (periodeStrong) {
//   periodeStrong.textContent = getWeekPeriod();
// }

const periodeStrong = document.querySelectorAll('#periode-pekan strong')[1];
if (periodeStrong) {
  const { start, end } = getWeekPeriodObj();

  periodeStrong.innerHTML = `
    <span class="periode-label">📆 Periode:</span>
    <span>${start} s/d</span>
    <span>${end}</span>
  `;
}
