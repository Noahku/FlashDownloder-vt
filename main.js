async function downloadVideo() {
    const tiktokUrl = document.getElementById('tiktokUrl').value;
    
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const loader = document.getElementById('loader');
    const downloadLink = document.getElementById('downloadLink');

    // Reset tampilan
    resultDiv.style.display = 'none';
    errorDiv.innerHTML = '';
    errorDiv.style.display = 'none';
    loader.style.display = 'block';

    if (!tiktokUrl) {
        loader.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = 'Harap masukkan link TikTok.';
        return;
    }

    // Validasi format URL TikTok
    if (!tiktokUrl.includes('tiktok.com') && !tiktokUrl.includes('vm.tiktok.com') && !tiktokUrl.includes('vt.tiktok.com')) {
        loader.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = 'Format link TikTok tidak valid.';
        return;
    }

    try {
        // API alternatif yang lebih reliable
        const apiUrls = [
            `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}`,
            `https://api.tiklydown.com/api/download?url=${encodeURIComponent(tiktokUrl)}`,
            `https://tikdown.org/api?url=${encodeURIComponent(tiktokUrl)}`
        ];

        let data = null;
        let lastError = null;

        // Coba semua API sampai yang berhasil
        for (const apiUrl of apiUrls) {
            try {
                console.log('Mencoba API:', apiUrl);
                const response = await fetch(apiUrl);
                
                if (response.ok) {
                    data = await response.json();
                    console.log('Response dari API:', data);
                    
                    // Cek jika data valid
                    if (data && (data.data || data.video || data.urls)) {
                        break;
                    }
                }
            } catch (apiError) {
                console.log('API gagal:', apiUrl, apiError);
                lastError = apiError;
                continue;
            }
        }

        if (!data) {
            throw new Error('Semua API gagal. Silakan coba lagi nanti.');
        }

        // Ekstrak URL video berdasarkan struktur response yang berbeda
        let videoUrl = null;

        // Untuk API tikwm.com
        if (data.data && data.data.wm) {
            videoUrl = data.data.wm;
        } else if (data.data && data.data.nowm) {
            videoUrl = data.data.nowm;
        } 
        // Untuk API tiklydown.com
        else if (data.video && data.video.noWatermark) {
            videoUrl = data.video.noWatermark;
        } else if (data.video && data.video.watermark) {
            videoUrl = data.video.watermark;
        }
        // Untuk API tikdown.org
        else if (data.urls && data.urls.video) {
            videoUrl = data.urls.video;
        }
        // Fallback - cari URL video di struktur manapun
        else if (data.data && data.data.play) {
            videoUrl = data.data.play;
        } else if (data.video_url) {
            videoUrl = data.video_url;
        }

        if (!videoUrl) {
            console.log('Struktur data tidak dikenali:', data);
            throw new Error('Link eror bosqu');
        }

        // Pastikan URL lengkap (beberapa API return relative URL)
        if (videoUrl.startsWith('//')) {
            videoUrl = 'https:' + videoUrl;
        } else if (videoUrl.startsWith('/')) {
            videoUrl = 'https://www.tikwm.com' + videoUrl;
        }

        console.log('Video URL yang akan didownload:', videoUrl);

        // Tampilkan tombol download manual
        downloadLink.href = videoUrl;
        downloadLink.textContent = 'Klik di sini untuk download manual';
        downloadLink.setAttribute('download', 'tiktok_video.mp4');
        downloadLink.setAttribute('target', '_blank');
        resultDiv.style.display = 'block';

        // Coba download otomatis
        try {
            console.log('Memulai download otomatis...');
            const videoResponse = await fetch(videoUrl);
            
            if (!videoResponse.ok) {
                throw new Error(`HTTP ${videoResponse.status}`);
            }

            const blob = await videoResponse.blob();
            console.log('Ukuran video:', blob.size, 'bytes');

            if (blob.size > 0) {
                const timestamp = new Date().getTime();
                const filename = `tiktok_video_${timestamp}.mp4`;
                
                saveAs(blob, filename);
                console.log('Download otomatis berhasil');
            } else {
                throw new Error('Video kosong');
            }

        } catch (autoDownloadError) {
            console.warn('Download otomatis gagal, menggunakan manual:', autoDownloadError);
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = 'Download otomatis gagal. Silakan klik link di atas untuk download manual.';
        }

    } catch (error) {
        console.error('Error utama:', error);
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `${error.message} .Coba link yang berbeda atau laporkan masalah.`;
    } finally {
        loader.style.display = 'none';
    }
}

// Event listener untuk Enter key
document.getElementById('tiktokUrl').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        downloadVideo();
    }
});

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('TikTok Downloader loaded');
    
    setTimeout(() => {
        alert('Selamat datang! Masukkan link TikTok dan klik download. Jika error, akan tersedia link download manual.');
    }, 1000);
});