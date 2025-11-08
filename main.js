// متغيرات عامة لنحفظ فيها المشغل والأوقات
let player;
let startTime = 0;
let endTime = 0;
let checkInterval; // متغير لحفظ الـ interval لمراقبة الوقت

// 1. هذه الدالة يتم استدعاؤها تلقائيًا عند تحميل مكتبة اليوتيوب
function onYouTubeIframeAPIReady() {
    // لا تفعل شيئًا هنا حتى يضغط المستخدم "تحميل"
    console.log("API جاهز.");
}

// 2. دالة مساعدة لاستخراج ID الفيديو من أي رابط يوتيوب
function getYoutubeId(url) {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    } else {
        ID = url;
    }
    return ID;
}

// 3. ربط الأزرار بوظائفها
document.getElementById('load-video').addEventListener('click', loadAndPlayVideo);
document.getElementById('replay-segment').addEventListener('click', replaySegment);

// 4. دالة تحميل الفيديو
function loadAndPlayVideo() {
    // الحصول على رابط الفيديو
    const videoUrl = document.getElementById('video-url').value;
    const videoId = getYoutubeId(videoUrl);

    if (!videoId) {
        alert("الرجاء إدخال رابط يوتيوب صالح.");
        return;
    }

    // حساب أوقات البداية والنهاية بالثواني
    const startMin = parseInt(document.getElementById('start-min').value) || 0;
    const startSec = parseInt(document.getElementById('start-sec').value) || 0;
    startTime = (startMin * 60) + startSec;

    const endMin = parseInt(document.getElementById('end-min').value) || 0;
    const endSec = parseInt(document.getElementById('end-sec').value) || 0;
    endTime = (endMin * 60) + endSec;

    if (endTime <= startTime) {
        alert("وقت النهاية يجب أن يكون بعد وقت البداية.");
        return;
    }

    // إذا كان هناك مشغل قديم، قم بتدميره
    if (player) {
        player.destroy();
    }
    
    // إيقاف أي مؤقت قديم
    if (checkInterval) {
        clearInterval(checkInterval);
    }

    // إنشاء مشغل يوتيوب جديد
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'autoplay': 1, // تشغيل تلقائي عند التحميل
            'start': startTime // تحديد نقطة البداية
        },
        events: {
            'onReady': onPlayerReady, // عند جاهزية المشغل
            'onStateChange': onPlayerStateChange // عند تغير حالة المشغل
        }
    });
}

// 5. هذه الدالة تعمل عندما يكون المشغل جاهزًا
function onPlayerReady(event) {
    // تم تحديد وقت البداية في 'playerVars'، سيبدأ التشغيل تلقائيًا
    console.log("المشغل جاهز.");
}

// 6. هذه الدالة تراقب حالة المشغل
function onPlayerStateChange(event) {
    // "1" تعني أن الفيديو "يشتغل"
    if (event.data === YT.PlayerState.PLAYING) {
        // بدء مراقبة الوقت
        // إيقاف أي مراقب قديم أولاً
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        
        // بدء مراقب جديد
        checkInterval = setInterval(() => {
            checkCurrentTime();
        }, 250); // يفحص كل ربع ثانية
    } else {
        // إذا توقف الفيديو (pause, ended, etc.)
        // أوقف المراقبة
        if (checkInterval) {
            clearInterval(checkInterval);
        }
    }
}

// 7. دالة مراقبة الوقت
function checkCurrentTime() {
    if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        
        // إذا وصل الوقت الحالي إلى نقطة النهاية المحددة
        if (currentTime >= endTime) {
            player.pauseVideo(); // أوقف الفيديو
            clearInterval(checkInterval); // أوقف المراقبة
        }
    }
}

// 8. دالة زر "إعادة المقطع"
function replaySegment() {
    if (player) {
        player.seekTo(startTime); // ارجع إلى نقطة البداية
        player.playVideo(); // شغل الفيديو
    } else {
        alert("يرجى تحميل فيديو أولاً.");
    }
}

