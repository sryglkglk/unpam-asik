    // Ambil data tugas dari data.json dan buat chart dinamis
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            // Ambil semua tugas
            const tugasKeys = Object.keys(data).filter(k => k.startsWith('tugas.'));
            // Urutkan berdasarkan deadline terdekat
            tugasKeys.sort((a, b) => {
                const dA = new Date(data[a].deadline);
                const dB = new Date(data[b].deadline);
                return dA - dB;
            });

            // Siapkan label dan data
            const labels = [];
            const chartData = [];
            const bgColors = [];

            // Mapping prioritas berdasarkan jarak hari ke deadline
            function getPrioritas(deadline) {
                if (!deadline) return 0;
                const now = new Date();
                const d = new Date(deadline);
                // Hitung selisih hari
                const diffTime = d.setHours(0,0,0,0) - now.setHours(0,0,0,0);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 3) return 3; // Sangat Tinggi (≤ 3 hari)
                if (diffDays <= 6) return 2; // Tinggi (≤ 6 hari)
                if (diffDays <= 15) return 1; // Normal (≤ 15 hari)
                if (diffDays > 15) return 0; // Pikirin Nanti (> 15 hari)
                // Jika deadline sudah lewat, tetap sangat tinggi
                if (diffDays < 0) return 3;
                return 0;
            }
            function getColor(prio) {
                switch (prio) {
                    case 3: return '#e74c3c';
                    case 2: return '#f1c40f';
                    case 1: return '#b1c40f';
                    default: return '#95a5a6';
                }
            }

            tugasKeys.forEach(key => {
                const tugas = data[key];
                const mk = data[tugas.id_mk] || {};
                const namaMk = mk.judul || tugas.id_mk || '';
                const deadline = tugas.deadline ? new Date(tugas.deadline) : null;
                // Ubah bagian label di sini:
                const label = `${namaMk}\n${deadline ? '(' + deadline.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }).replace(' ', ' ') + ')' : ''}`;
                labels.push(label);
                const prioritas = getPrioritas(tugas.deadline);
                chartData.push(prioritas);
                bgColors.push(getColor(prioritas));
            });

            // Render Chart.js
            const ctx = document.getElementById('tugasChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Tingkat Prioritas',
                        data: chartData,
                        backgroundColor: bgColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 3,
                            ticks: {
                                stepSize: 1,
                                color: '#000',
                                callback: function (value) {
                                    switch (value) {
                                        case 3: return 'Sangat Tinggi';
                                        case 2: return 'Tinggi';
                                        case 1: return 'Normal';
                                        case 0: return 'Pikirin Nanti';
                                        default: return value;
                                    }
                                }
                            }
                        },
                        x: {
                            ticks: {
                                color: '#000',
                                callback: function(value, index, ticks) {
                                    const label = this.getLabelForValue(value);
                                    return label.split('\n');
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: { 
                            display: false,
                            labels: {
                                color: '#000'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const val = context.raw;
                                    switch (val) {
                                        case 3: return 'Prioritas: Sangat Tinggi';
                                        case 2: return 'Prioritas: Tinggi';
                                        case 1: return 'Prioritas: Normal';
                                        case 0: return 'Prioritas: Pikirin Nanti';
                                        default: return 'Prioritas: ' + val;
                                    }
                                }
                            },
                            bodyColor: '#fff',
                            titleColor: '#fff',
                        }
                    }
                }
            });
        });
