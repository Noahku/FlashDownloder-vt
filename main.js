async function downloadVideo() {
    const tiktokUrl = document.getElementById('tiktokUrl').value;
    const apiKey = '410b4bf81ca44e3b';
    const apiUrl = `https://api.caliph.biz.id/api/tiktok?url=${encodeURIComponent(tiktokUrl)}&apikey=${apiKey}`;
  
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const loader = document.getElementById('loader');
    const downloadLink = document.getElementById('downloadLink');
  
    // Reset tampilan
    resultDiv.style.display = 'none';
    errorDiv.innerHTML = '';
    loader.style.display = 'block';
  
    if (!tiktokUrl) {
      loader.style.display = 'none';
      // errorDiv.innerHTML = 'Harap masukkan link TikTok.';
      alert(`masukan link nya brok`)
      return;
    }
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
  
      if (data.status && data.data && data.data.video) {
        const videoUrl = data.data.video.noWatermark || data.data.video.watermark; // Pilih versi tanpa watermark (noWatermark) atau dengan watermark (watermark)
        
        // Tampilkan tombol download
        downloadLink.href = videoUrl;
        resultDiv.style.display = 'block';
  
        // Download otomatis menggunakan FileSaver.js
        fetch(videoUrl)
          .then(response => response.blob())
          .then(blob => {
            saveAs(blob, 'Thanks_bang_udah_bantu_download'); // Nama file download
          })
          .catch(error => {
            console.error('Error downloading video:', error);
            errorDiv.innerHTML = 'Gagal mendownload video. Silakan coba lagi.';
          });
      } else {
        errorDiv.innerHTML = 'Gagal mendownload video. Pastikan link valid.';
      }
    } catch (error) {
      errorDiv.innerHTML = 'Terjadi kesalahan. Silakan coba lagi.';
      console.error('Error:', error);
    } finally {
      loader.style.display = 'none';
    }
  }
  var video = document.getElementById("myVideo");
var btn = document.getElementById("myBtn");

function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}

{
  alert(`jika saat melakukan pengunduhan eror, langsung lapor aja brok`)
}