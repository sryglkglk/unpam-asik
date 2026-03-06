    function updateTanggalJam() {
      const now = new Date();
      const hari = now.toLocaleDateString('id-ID', { weekday: 'long' });
      const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      document.getElementById('tanggal-hari').textContent = `[ ${hari}, ${tanggal} ]`;

      // Format jam: [22:30]
      const jam = now.getHours().toString().padStart(2, '0');
      const menit = now.getMinutes().toString().padStart(2, '0');
      document.getElementById('jam-sekarang').textContent = `[ ${jam}:${menit} ]`;
    }
    updateTanggalJam();
    setInterval(updateTanggalJam, 1000);