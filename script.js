const API_KEY = 'ab2c60d23cmsh46c6a772ecad223p1bb0d7jsnbb9e6322673a';
const API_HOST = 'zodiac-horoscope-api-rashifal.p.rapidapi.com';

// Google Translate API configuration
const TRANSLATE_API_KEY = 'your-google-translate-api-key'; // You'll need to get this from Google Cloud
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Language Selection Elements
const languageSection = document.getElementById('language-section');
const mainContent = document.getElementById('main-content');
const languageButtons = document.querySelectorAll('.language-btn');

// Animation Elements
const sidewaysTrack = document.getElementById('sideways-track');

// Language switcher elements
const langButtons = document.querySelectorAll('.lang-btn');
let currentLanguage = 'en';

// Sections
const nameSection = document.getElementById('name-section');
const knowSignSection = document.getElementById('know-sign-section');
const zodiacSection = document.getElementById('zodiac-section');
const dobSection = document.getElementById('dob-section');
const result = document.querySelector('.result');

// Buttons and inputs
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name-btn');
const yesKnowSignBtn = document.getElementById('yes-know-sign-btn');
const noKnowSignBtn = document.getElementById('no-know-sign-btn');
const dobInput = document.getElementById('dob-input');
const findSignBtn = document.getElementById('find-sign-btn');
const detectedSign = document.getElementById('detected-sign');
const buttons = document.querySelectorAll('.zodiac-btn');
const backButton = document.getElementById('back-button');

// Result elements
const loading = document.querySelector('.loading');
const errorDiv = document.querySelector('.error');
const userName = document.getElementById('user-name');
const signName = document.getElementById('sign-name');
const horoscopeText = document.getElementById('horoscope-text');
const dateRange = document.getElementById('date-range');

let currentUser = '';
let currentSign = '';

// Language Selection
languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedLang = btn.getAttribute('data-lang');
        currentLanguage = selectedLang;
        
        // Hide language selection and show main content
        languageSection.classList.remove('show');
        mainContent.classList.add('show');
        
        // Update all content to selected language
        updateLanguage();
        updateSidewaysAnimation();
        
        // Set active state for language switcher
        langButtons.forEach(langBtn => {
            langBtn.classList.remove('active');
            if (langBtn.getAttribute('data-lang') === selectedLang) {
                langBtn.classList.add('active');
            }
        });
    });
});

// Language switcher in main content
langButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const selectedLang = btn.getAttribute('data-lang');
        currentLanguage = selectedLang;
        
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        updateLanguage();
        updateSidewaysAnimation();
        
        if (result.classList.contains('show')) {
            if (currentSign) {
                await fetchHoroscope(currentSign);
            }
        }
    });
});

// Zodiac data for animations
const zodiacData = {
    en: [
        { symbol: '♈', name: 'Aries', sign: 'aries' },
        { symbol: '♉', name: 'Taurus', sign: 'taurus' },
        { symbol: '♊', name: 'Gemini', sign: 'gemini' },
        { symbol: '♋', name: 'Cancer', sign: 'cancer' },
        { symbol: '♌', name: 'Leo', sign: 'leo' },
        { symbol: '♍', name: 'Virgo', sign: 'virgo' },
        { symbol: '♎', name: 'Libra', sign: 'libra' },
        { symbol: '♏', name: 'Scorpio', sign: 'scorpio' },
        { symbol: '♐', name: 'Sagittarius', sign: 'sagittarius' },
        { symbol: '♑', name: 'Capricorn', sign: 'capricorn' },
        { symbol: '♒', name: 'Aquarius', sign: 'aquarius' },
        { symbol: '♓', name: 'Pisces', sign: 'pisces' }
    ],
    hi: [
        { symbol: '♈', name: 'मेष', sign: 'aries' },
        { symbol: '♉', name: 'वृषभ', sign: 'taurus' },
        { symbol: '♊', name: 'मिथुन', sign: 'gemini' },
        { symbol: '♋', name: 'कर्कट', sign: 'cancer' },
        { symbol: '♌', name: 'सिंह', sign: 'leo' },
        { symbol: '♍', name: 'कन्या', sign: 'virgo' },
        { symbol: '♎', name: 'तुला', sign: 'libra' },
        { symbol: '♏', name: 'वृश्चिक', sign: 'scorpio' },
        { symbol: '♐', name: 'धनु', sign: 'sagittarius' },
        { symbol: '♑', name: 'मकर', sign: 'capricorn' },
        { symbol: '♒', name: 'कुम्भ', sign: 'aquarius' },
        { symbol: '♓', name: 'मीन', sign: 'pisces' }
    ],
    np: [
        { symbol: '♈', name: 'मेष', sign: 'aries' },
        { symbol: '♉', name: 'वृषभ', sign: 'taurus' },
        { symbol: '♊', name: 'मिथुन', sign: 'gemini' },
        { symbol: '♋', name: 'कर्कट', sign: 'cancer' },
        { symbol: '♌', name: 'सिंह', sign: 'leo' },
        { symbol: '♍', name: 'कन्या', sign: 'virgo' },
        { symbol: '♎', name: 'तुला', sign: 'libra' },
        { symbol: '♏', name: 'वृश्चिक', sign: 'scorpio' },
        { symbol: '♐', name: 'धनु', sign: 'sagittarius' },
        { symbol: '♑', name: 'मकर', sign: 'capricorn' },
        { symbol: '♒', name: 'कुम्भ', sign: 'aquarius' },
        { symbol: '♓', name: 'मीन', sign: 'pisces' }
    ],
    es: [
        { symbol: '♈', name: 'Aries', sign: 'aries' },
        { symbol: '♉', name: 'Tauro', sign: 'taurus' },
        { symbol: '♊', name: 'Géminis', sign: 'gemini' },
        { symbol: '♋', name: 'Cáncer', sign: 'cancer' },
        { symbol: '♌', name: 'Leo', sign: 'leo' },
        { symbol: '♍', name: 'Virgo', sign: 'virgo' },
        { symbol: '♎', name: 'Libra', sign: 'libra' },
        { symbol: '♏', name: 'Escorpio', sign: 'scorpio' },
        { symbol: '♐', name: 'Sagitario', sign: 'sagittarius' },
        { symbol: '♑', name: 'Capricornio', sign: 'capricorn' },
        { symbol: '♒', name: 'Acuario', sign: 'aquarius' },
        { symbol: '♓', name: 'Piscis', sign: 'pisces' }
    ],
    zh: [
        { symbol: '♈', name: '白羊座', sign: 'aries' },
        { symbol: '♉', name: '金牛座', sign: 'taurus' },
        { symbol: '♊', name: '双子座', sign: 'gemini' },
        { symbol: '♋', name: '巨蟹座', sign: 'cancer' },
        { symbol: '♌', name: '狮子座', sign: 'leo' },
        { symbol: '♍', name: '处女座', sign: 'virgo' },
        { symbol: '♎', name: '天秤座', sign: 'libra' },
        { symbol: '♏', name: '天蝎座', sign: 'scorpio' },
        { symbol: '♐', name: '射手座', sign: 'sagittarius' },
        { symbol: '♑', name: '摩羯座', sign: 'capricorn' },
        { symbol: '♒', name: '水瓶座', sign: 'aquarius' },
        { symbol: '♓', name: '双鱼座', sign: 'pisces' }
    ]
};

// Initialize animations
function initAnimations() {
    updateSidewaysAnimation();
}

function updateSidewaysAnimation() {
    const data = zodiacData[currentLanguage] || zodiacData.en;
    
    sidewaysTrack.innerHTML = '';
    
    // Create two sets for seamless looping
    const zodiacSet = [...data, ...data];
    
    zodiacSet.forEach((zodiac, index) => {
        const zodiacElement = document.createElement('div');
        zodiacElement.className = 'sideways-zodiac';
        zodiacElement.innerHTML = `
            <span class="sideways-symbol">${zodiac.symbol}</span>
            <span class="sideways-name">${zodiac.name}</span>
        `;
        
        sidewaysTrack.appendChild(zodiacElement);
    });
}

// Back to language selection
function backToLanguageSelection() {
    // Hide main content and show language selection
    mainContent.classList.remove('show');
    languageSection.classList.add('show');
    
    // Reset all sections
    knowSignSection.classList.remove('show');
    zodiacSection.classList.remove('show');
    dobSection.classList.remove('show');
    result.classList.remove('show');
    errorDiv.classList.remove('show');
    detectedSign.classList.remove('show');
    
    // Reset inputs
    nameInput.value = '';
    dobInput.value = '';
    currentUser = '';
    currentSign = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.backToLanguageSelection = backToLanguageSelection;

// Date ranges for all languages
const dateRanges = {
    en: {
        aries: 'March 21 - April 19',
        taurus: 'April 20 - May 20',
        gemini: 'May 21 - June 20',
        cancer: 'June 21 - July 22',
        leo: 'July 23 - August 22',
        virgo: 'August 23 - September 22',
        libra: 'September 23 - October 22',
        scorpio: 'October 23 - November 21',
        sagittarius: 'November 22 - December 21',
        capricorn: 'December 22 - January 19',
        aquarius: 'January 20 - February 18',
        pisces: 'February 19 - March 20'
    },
    hi: {
        aries: '21 मार्च - 19 अप्रैल',
        taurus: '20 अप्रैल - 20 मई',
        gemini: '21 मई - 20 जून',
        cancer: '21 जून - 22 जुलाई',
        leo: '23 जुलाई - 22 अगस्त',
        virgo: '23 अगस्त - 22 सितंबर',
        libra: '23 सितंबर - 22 अक्टूबर',
        scorpio: '23 अक्टूबर - 21 नवंबर',
        sagittarius: '22 नवंबर - 21 दिसंबर',
        capricorn: '22 दिसंबर - 19 जनवरी',
        aquarius: '20 जनवरी - 18 फरवरी',
        pisces: '19 फरवरी - 20 मार्च'
    },
    np: {
        aries: 'चैत ७ - बैशाख ६',
        taurus: 'बैशाख ७ - जेठ ७',
        gemini: 'जेठ ८ - असार ७',
        cancer: 'असार ८ - साउन ७',
        leo: 'साउन ८ - भदौ ७',
        virgo: 'भदौ ८ - असोज ७',
        libra: 'असोज ८ - कार्तिक ७',
        scorpio: 'कार्तिक ८ - मंसिर ७',
        sagittarius: 'मंसिर ८ - पुष ७',
        capricorn: 'पुष ८ - माघ ५',
        aquarius: 'माघ ६ - फागुन ६',
        pisces: 'फागुन ७ - चैत ६'
    },
    es: {
        aries: '21 de marzo - 19 de abril',
        taurus: '20 de abril - 20 de mayo',
        gemini: '21 de mayo - 20 de junio',
        cancer: '21 de junio - 22 de julio',
        leo: '23 de julio - 22 de agosto',
        virgo: '23 de agosto - 22 de septiembre',
        libra: '23 de septiembre - 22 de octubre',
        scorpio: '23 de octubre - 21 de noviembre',
        sagittarius: '22 de noviembre - 21 de diciembre',
        capricorn: '22 de diciembre - 19 de enero',
        aquarius: '20 de enero - 18 de febrero',
        pisces: '19 de febrero - 20 de marzo'
    },
    zh: {
        aries: '3月21日 - 4月19日',
        taurus: '4月20日 - 5月20日',
        gemini: '5月21日 - 6月20日',
        cancer: '6月21日 - 7月22日',
        leo: '7月23日 - 8月22日',
        virgo: '8月23日 - 9月22日',
        libra: '9月23日 - 10月22日',
        scorpio: '10月23日 - 11月21日',
        sagittarius: '11月22日 - 12月21日',
        capricorn: '12月22日 - 1月19日',
        aquarius: '1月20日 - 2月18日',
        pisces: '2月19日 - 3月20日'
    }
};

const zodiacNames = {
    en: {
        aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
        leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
        sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
    },
    hi: {
        aries: 'मेष', taurus: 'वृषभ', gemini: 'मिथुन', cancer: 'कर्कट',
        leo: 'सिंह', virgo: 'कन्या', libra: 'तुला', scorpio: 'वृश्चिक',
        sagittarius: 'धनु', capricorn: 'मकर', aquarius: 'कुम्भ', pisces: 'मीन'
    },
    np: {
        aries: 'मेष', taurus: 'वृषभ', gemini: 'मिथुन', cancer: 'कर्कट',
        leo: 'सिंह', virgo: 'कन्या', libra: 'तुला', scorpio: 'वृश्चिक',
        sagittarius: 'धनु', capricorn: 'मकर', aquarius: 'कुम्भ', pisces: 'मीन'
    },
    es: {
        aries: 'Aries', taurus: 'Tauro', gemini: 'Géminis', cancer: 'Cáncer',
        leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Escorpio',
        sagittarius: 'Sagitario', capricorn: 'Capricornio', aquarius: 'Acuario', pisces: 'Piscis'
    },
    zh: {
        aries: '白羊座', taurus: '金牛座', gemini: '双子座', cancer: '巨蟹座',
        leo: '狮子座', virgo: '处女座', libra: '天秤座', scorpio: '天蝎座',
        sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '双鱼座'
    }
};

const apiRashiMapping = {
    aries: 'mesha', taurus: 'vrishabha', gemini: 'mithuna', cancer: 'karka',
    leo: 'simha', virgo: 'kanya', libra: 'tula', scorpio: 'vrishchika',
    sagittarius: 'dhanu', capricorn: 'makara', aquarius: 'kumbha', pisces: 'meena'
};

// Language mapping for Google Translate
const translateLangMapping = {
    en: 'en',
    hi: 'hi',
    np: 'ne', // Nepali
    es: 'es',
    zh: 'zh'
};

const translations = {
    en: {
        title: '🌟 Daily Horoscope 🌟',
        enterName: 'Enter your full name',
        saveName: 'Get Your Horoscope',
        helperText: 'Enter your name to get your personalized horoscope',
        knowSignQuestion: 'Do you know your zodiac sign?',
        yes: 'Yes, I know my sign',
        no: 'No, find from my birth date',
        dobTitle: 'Enter Your Date of Birth',
        findSign: 'Find My Zodiac Sign',
        selectSign: 'Select Your Zodiac Sign',
        loading: 'Loading your horoscope...',
        backToStart: 'Check Another Horoscope',
        yourSign: 'Your Zodiac Sign is:'
    },
    hi: {
        title: '🌟 दैनिक राशिफल 🌟',
        enterName: 'अपना पूरा नाम दर्ज करें',
        saveName: 'अपना राशिफल प्राप्त करें',
        helperText: 'अपना व्यक्तिगत राशिफल प्राप्त करने के लिए नाम दर्ज करें',
        knowSignQuestion: 'क्या आप अपनी राशि जानते हैं?',
        yes: 'हाँ, मैं अपनी राशि जानता हूँ',
        no: 'नहीं, मेरी जन्म तिथि से खोजें',
        dobTitle: 'अपनी जन्म तिथि दर्ज करें',
        findSign: 'मेरी राशि खोजें',
        selectSign: 'अपनी राशि चुनें',
        loading: 'आपका राशिफल लोड हो रहा है...',
        backToStart: 'दूसरा राशिफल देखें',
        yourSign: 'आपकी राशि है:'
    },
    np: {
        title: '🌟 दैनिक राशिफल 🌟',
        enterName: 'आफ्नो पूरा नाम लेख्नुहोस्',
        saveName: 'राशिफल प्राप्त गर्नुहोस्',
        helperText: 'आफ्नो व्यक्तिगत राशिफल प्राप्त गर्न नाम प्रविष्ट गर्नुहोस्',
        knowSignQuestion: 'के तपाईंलाई आफ्नो राशि थाहा छ?',
        yes: 'हो, मलाई मेरो राशि थाहा छ',
        no: 'होइन, मेरो जन्म मिति बाट खोज्नुहोस्',
        dobTitle: 'आफ्नो जन्म मिति प्रविष्ट गर्नुहोस्',
        findSign: 'मेरो राशि खोज्नुहोस्',
        selectSign: 'आफ्नो राशि चयन गर्नुहोस्',
        loading: 'तपाईंको राशिफल लोड भइरहेको छ...',
        backToStart: 'अर्को राशिफल हेर्नुहोस्',
        yourSign: 'तपाईंको राशि हो:'
    },
    es: {
        title: '🌟 Horóscopo Diario 🌟',
        enterName: 'Ingresa tu nombre completo',
        saveName: 'Obtener Tu Horóscopo',
        helperText: 'Ingresa tu nombre para obtener tu horóscopo personalizado',
        knowSignQuestion: '¿Conoces tu signo zodiacal?',
        yes: 'Sí, conozco mi signo',
        no: 'No, encontrar desde mi fecha de nacimiento',
        dobTitle: 'Ingresa Tu Fecha de Nacimiento',
        findSign: 'Encontrar Mi Signo Zodiacal',
        selectSign: 'Selecciona Tu Signo Zodiacal',
        loading: 'Cargando tu horóscopo...',
        backToStart: 'Ver Otro Horóscopo',
        yourSign: 'Tu Signo Zodiacal es:'
    },
    zh: {
        title: '🌟 每日星座运势 🌟',
        enterName: '请输入您的全名',
        saveName: '获取您的星座运势',
        helperText: '输入您的姓名以获取个性化星座运势',
        knowSignQuestion: '您知道您的星座吗？',
        yes: '是的，我知道我的星座',
        no: '不知道，从我的出生日期查找',
        dobTitle: '输入您的出生日期',
        findSign: '查找我的星座',
        selectSign: '选择您的星座',
        loading: '正在加载您的星座运势...',
        backToStart: '查看其他星座运势',
        yourSign: '您的星座是：'
    }
};

dobInput.max = new Date().toISOString().split('T')[0];

window.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    
    document.querySelectorAll('h1').forEach(h1 => {
        if (h1.closest('.main-content') || h1.closest('.language-section')) {
            h1.textContent = t.title;
        }
    });
    
    nameInput.placeholder = t.enterName;
    saveNameBtn.textContent = t.saveName;
    document.querySelector('.helper-text').textContent = t.helperText;
    
    if (knowSignSection.querySelector('h3')) {
        knowSignSection.querySelector('h3').textContent = t.knowSignQuestion;
    }
    yesKnowSignBtn.querySelector('span').textContent = t.yes;
    noKnowSignBtn.querySelector('span').textContent = t.no;
    
    if (dobSection.querySelector('h3')) {
        dobSection.querySelector('h3').textContent = t.dobTitle;
    }
    findSignBtn.textContent = t.findSign;
    
    if (zodiacSection.querySelector('h3')) {
        zodiacSection.querySelector('h3').textContent = t.selectSign;
    }
    
    document.querySelector('.loading').textContent = t.loading;
    
    document.querySelectorAll('.zodiac-btn').forEach(btn => {
        const sign = btn.getAttribute('data-sign');
        const symbol = btn.textContent.split(' ')[0];
        btn.textContent = `${symbol} ${zodiacNames[currentLanguage][sign]}`;
    });
    
    if (backButton) {
        backButton.textContent = t.backToStart;
    }
    
    if (result.classList.contains('show')) {
        if (currentSign) {
            signName.textContent = zodiacNames[currentLanguage][currentSign];
            dateRange.textContent = dateRanges[currentLanguage][currentSign];
        }
    }
}

saveNameBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    
    if (name === '') {
        const alerts = {
            en: 'Please enter your name!',
            hi: 'कृपया अपना नाम दर्ज करें!',
            np: 'कृपया आफ्नो नाम प्रविष्ट गर्नुहोस्!',
            es: '¡Por favor ingresa tu nombre!',
            zh: '请输入您的姓名！'
        };
        alert(alerts[currentLanguage] || alerts.en);
        return;
    }
    
    currentUser = name;
    nameSection.classList.remove('show');
    knowSignSection.classList.add('show');
    nameInput.value = '';
    
    knowSignSection.scrollIntoView({ behavior: 'smooth' });
});

nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveNameBtn.click();
    }
});

yesKnowSignBtn.addEventListener('click', () => {
    knowSignSection.classList.remove('show');
    zodiacSection.classList.add('show');
    zodiacSection.scrollIntoView({ behavior: 'smooth' });
});

noKnowSignBtn.addEventListener('click', () => {
    knowSignSection.classList.remove('show');
    dobSection.classList.add('show');
    dobSection.scrollIntoView({ behavior: 'smooth' });
});

findSignBtn.addEventListener('click', () => {
    const dob = dobInput.value;
    
    if (!dob) {
        const alerts = {
            en: 'Please select your date of birth!',
            hi: 'कृपया अपनी जन्म तिथि चुनें!',
            np: 'कृपया आफ्नो जन्म मिति चयन गर्नुहोस्!',
            es: '¡Por favor selecciona tu fecha de nacimiento!',
            zh: '请选择您的出生日期！'
        };
        alert(alerts[currentLanguage] || alerts.en);
        return;
    }
    
    const zodiacSign = getZodiacSign(dob);
    const t = translations[currentLanguage];
    
    detectedSign.textContent = `${t.yourSign} ${zodiacNames[currentLanguage][zodiacSign]}`;
    detectedSign.classList.add('show');
    
    setTimeout(() => {
        fetchHoroscope(zodiacSign);
    }, 1000);
});

function getZodiacSign(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces';
}

buttons.forEach(button => {
    button.addEventListener('click', async () => {
        const sign = button.getAttribute('data-sign');
        await fetchHoroscope(sign);
    });
});

// Google Translate function
async function translateText(text, targetLang) {
    // If target language is English, return original text
    if (targetLang === 'en') {
        return text;
    }
    
    try {
        // Note: You need to set up Google Cloud Translate API and get an API key
        // This is a placeholder implementation
        const response = await fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLang,
                source: 'en'
            })
        });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        // Return original text if translation fails
        return text;
    }
}

// Alternative free translation service (MyMemory Translation)
async function translateWithMyMemory(text, targetLang) {
    if (targetLang === 'en') {
        return text;
    }
    
    try {
        const langMap = {
            'hi': 'hi',
            'np': 'ne',
            'es': 'es',
            'zh': 'zh-CN'
        };
        
        const langCode = langMap[targetLang] || 'en';
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`);
        
        if (!response.ok) {
            throw new Error('Translation failed');
        }
        
        const data = await response.json();
        return data.responseData.translatedText;
    } catch (error) {
        console.error('MyMemory translation error:', error);
        return text;
    }
}

async function fetchHoroscope(sign) {
    currentSign = sign;
    
    zodiacSection.classList.remove('show');
    dobSection.classList.remove('show');
    result.classList.remove('show');
    errorDiv.classList.remove('show');
    loading.classList.add('show');

    try {
        const apiRashiName = apiRashiMapping[sign];
        
        // Always fetch horoscope in English
        const response = await fetch(
            `https://${API_HOST}/astro/rashi/daily?rashi=${apiRashiName}&day=today&lang=en`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': API_HOST,
                    'x-rapidapi-key': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        let horoscopeContent = '';
        
        if (data.status === true && data.desc) {
            // If current language is not English, translate the content
            if (currentLanguage !== 'en') {
                const englishContent = `${data.desc}`;
                // Use MyMemory translation (free alternative)
                horoscopeContent = await translateWithMyMemory(englishContent, currentLanguage);
            } else {
                horoscopeContent = `${data.desc}`;
            }
        } else {
            const fallbackMessages = {
                en: 'Horoscope content not available for today.',
                hi: 'आज के लिए राशिफल उपलब्ध नहीं है।',
                np: 'आजको राशिफल उपलब्ध छैन।',
                es: 'Contenido del horóscopo no disponible para hoy.',
                zh: '今日星座运势暂不可用。'
            };
            horoscopeContent = fallbackMessages[currentLanguage] || fallbackMessages.en;
        }
        
        userName.textContent = currentUser;
        signName.textContent = zodiacNames[currentLanguage][sign];
        horoscopeText.textContent = horoscopeContent;
        
        loading.classList.remove('show');
        result.classList.add('show');
        result.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('API Error:', error);
        loading.classList.remove('show');
        
        const errorMessages = {
            en: `Error: ${error.message}. Please check your API subscription and try again.`,
            hi: `त्रुटि: ${error.message}। कृपया अपनी API सदस्यता जांचें और पुनः प्रयास करें।`,
            np: `त्रुटि: ${error.message}। कृपया आफ्नो API सदस्यता जाँच गर्नुहोस् र पुन: प्रयास गर्नुहोस्।`,
            es: `Error: ${error.message}. Por favor verifica tu suscripción API e intenta de nuevo.`,
            zh: `错误：${error.message}。请检查您的API订阅并重试。`
        };
        
        errorDiv.textContent = errorMessages[currentLanguage] || errorMessages.en;
        errorDiv.classList.add('show');
    }
}