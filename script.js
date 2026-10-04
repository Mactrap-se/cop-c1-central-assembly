let lang = localStorage.getItem('lang') || 'en';

const dict = {
    en: {
        service: "📖 Sunday Service Order",
        preacher: "Preacher:",
        theme: "Theme:",
        prayerTitle: "🙏 Prayer Request",
        prayerBtn: "Submit / Fa Kɔ",
        admin: "Admin Login",
        sunday: "Sunday School / Kwasiada Sukuu",
        main: "Main Service / Som Kɛseɛ",
        langBtn: "TWI"
    },
    twi: {
        service: "📖 Kwasiada Som Nhyehyɛeɛ",
        preacher: "Ɔsɛnkafoɔ:",
        theme: "Asɛmti:",
        prayerTitle: "🙏 Mpaebɔ",
        prayerBtn: "Fa Kɔ / Submit",
        admin: "Pastor Kɔ Mu",
        sunday: "Kwasiada Sukuu / Sunday School",
        main: "Som Kɛseɛ / Main Service",
        langBtn: "ENGLISH"
    }
};

function toggleLang() {
    lang = (lang === 'en') ? 'twi' : 'en';
    localStorage.setItem('lang', lang);
    applyLang();
}

function applyLang() {
    let d = dict[lang];
    document.getElementById('txtService').innerText = d.service;
    document.getElementById('txtPreacher').innerText = d.preacher;
    document.getElementById('txtPrayerTitle').innerText = d.prayerTitle;
    document.getElementById('txtPrayerBtn').innerText = d.prayerBtn;
    document.getElementById('txtAdmin').innerText = d.admin;
    document.getElementById('langBtn').innerText = d.langBtn;
    
    let t1 = document.querySelector('.t1');
    let t2 = document.querySelector('.t2');
    if (t1) t1.innerText = d.sunday;
    if (t2) t2.innerText = d.main;
}

let announcements = JSON.parse(localStorage.getItem('cop_dzefe') || '[]');

if (announcements.length === 0) {
    announcements = [
        { title: "All Night Service Friday / Anadwo Som", desc: "9PM-4AM. Be blessed! / Bra bɛnya nhyira!", date: "2026-10-10" },
        { title: "Youth Meeting Saturday", desc: "4PM rehearsals / Mmeranteɛ nhyiamu", date: "2026-10-04" }
    ];
    localStorage.setItem('cop_dzefe', JSON.stringify(announcements));
}

function render() {
    let list = document.getElementById('announcementsList');
    list.innerHTML = '<div style="padding:0 12px"><h3>📢 Announcements / Nkaebɔ</h3></div>';
    
    announcements.slice().reverse().forEach(a => {
        list.innerHTML += `
            <div class="card">
                <div style="color:#D50000; font-size:12px; font-weight:bold">📅 ${a.date}</div>
                <div style="font-weight:bold; font-size:17px; margin:6px 0">${a.title}</div>
                <p>${a.desc}</p>
            </div>`;
    });
    
    document.getElementById('todayDate').innerText = new Date().toDateString();
}

const GOOGLE_SHEET_URL = "  https://script.google.com/macros/s/AKfycbxlrCc55vVvBpXVL-pvOR0StBN8ttc-eKBQpPcf-TrDTNEUplKB9GSZMhBAe2A6lhx1ug/exec";

async function backupToSheet(data) {
    if (GOOGLE_SHEET_URL.includes("YOUR_ID")) return;
    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
    } catch (e) {}
}

function addAnnouncement() {
    if (document.getElementById('adminPass').value !== 'dzefe2026') {
        alert('Wrong password!');
        return;
    }
    
    let title = document.getElementById('aTitle').value;
    let desc = document.getElementById('aDesc').value;
    let date = document.getElementById('aDate').value || new Date().toISOString().split('T')[0];
    
    if (!title || !desc) {
        alert('Fill all');
        return;
    }
    
    let newAnn = { title, desc, date };
    announcements.push(newAnn);
    localStorage.setItem('cop_dzefe', JSON.stringify(announcements));
    render();
    
    if (document.getElementById('backupOpt').value === 'sheet') {
        backupToSheet(newAnn);
    }
    
    alert('Posted! ✅');
}

function showAdmin() {
    let b = document.getElementById('adminBox');
    b.style.display = b.style.display === 'block' ? 'none' : 'block';
}

function sendPrayer() {
    let name = document.getElementById('pName').value;
    let req = document.getElementById('pRequest').value;
    
    if (!req) {
        alert('Write request');
        return;
    }
    
    let prayers = JSON.parse(localStorage.getItem('prayers_dzefe') || '[]');
    prayers.push({ name, req, date: new Date().toLocaleString() });
    localStorage.setItem('prayers_dzefe', JSON.stringify(prayers));
    
    backupToSheet({ type: 'prayer', name, req });
    window.open(`https://wa.me/2330208783717?text=${encodeURIComponent('Prayer: ' + name + ' - ' + req)}`);
    alert('Saved 🙏 / Wɔakora so 🙏');
}

// Initialize on page load
applyLang();
render();