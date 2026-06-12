// --- 1. POPUP UTILITIES ---
function showPopup(title, message, isError = false) {
    const popup = document.getElementById('custom-popup');
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-message').innerText = message;

    // Set icon based on status
    const iconElement = document.querySelector('.popup-icon');
    iconElement.innerText = isError ? "❌" : "✅";

    popup.style.display = 'flex';
    // Small delay to allow the browser to register display:flex before adding the active class for animation
    setTimeout(() => popup.classList.add('active'), 10);
}

function closePopup() {
    const popup = document.getElementById('custom-popup');
    popup.classList.remove('active');
    setTimeout(() => {
        popup.style.display = 'none';
        location.reload(); // Refresh to reset form state
    }, 300);
}

// --- 2. MOBILE MENU LOGIC ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-content a');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener('click', toggleMobileMenu);

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// --- 3. FORM SUBMISSION LOGIC ---
async function handleForm(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;

    // Using FormData ensures we capture values by the "name" attribute we added to the HTML
    const formData = new FormData(e.target);
    const service = document.getElementById('serviceType').value;

    const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        whatsapp: formData.get('whatsapp') || 'N/A',
        telegram: formData.get('telegram') || 'N/A',
        message: formData.get('message') || 'No message provided',
        service: service
    };


    // UI Feedback
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showPopup(
                "Application Received!",
                `Thanks ${payload.name}. Your interest in ${service} is saved. A coach will contact you on Telegram shortly.`
            );
        } else {
            throw new Error(result.error || "Server error");
        }
    } catch (error) {
        console.error("Submission Error:", error);
        showPopup("Oops!", "There was a problem saving your info. Please try again or contact us via WhatsApp.", true);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

// --- 3. UI NAVIGATION & STAGE LOGIC ---
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById('lead-form-container').style.display = 'none';
    document.getElementById('selection-stage').style.display = 'block';
    $('html, body').animate({ scrollTop: $("#start-training").offset().top - 71 }, 500);
});

function showForm(serviceName) {
    document.getElementById('selection-stage').style.display = 'none';
    document.getElementById('lead-form-container').style.display = 'block';
    document.getElementById('selected-service').innerText = serviceName;
    document.getElementById('serviceType').value = serviceName;

    $('html, body').animate({
        scrollTop: $("#start-training").offset().top - 71
    }, 500);
}

// --- 4. SLIDER INITIALIZATION ---
$(document).ready(function () {
    // Transformation Slider
    $('.transform-slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1, arrows: false } }
        ]
    });

    // Review Slider
    $('.review-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 1, arrows: false } }
        ]
    });
});

// --- 5. NAVBAR SCROLL EFFECTS ---
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for Nav Links
$('nav a, .footer-links a, .hero-content a').on('click', function (event) {
    if (this.hash !== "") {
        event.preventDefault();
        const hash = this.hash;
        const navHeight = 71; // Fixed nav height to prevent alignment issues

        $('html, body').animate({
            scrollTop: $(hash).offset().top - navHeight
        }, 800);
    }
});

// --- 6. MAP LOGIC ---
const maps = {
    gast: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d391.7781155613034!2d38.839188499999995!3d9.021178599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9a9f64478817%3A0x5b428fa97b3a44a0!2sGAST%20Entertainment!5e0!3m2!1sen!2set!4v1735230000000!5m2!1sen!2set",
    bellevue: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.460834445873!2d38.80027217569131!3d9.021657189102486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b851e8312dbc5%3A0x31392bebd3ae1b57!2sBellevue%20Fitness!5e0!3m2!1sen!2set!4v1766758154512!5m2!1sen!2set",
    roots: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5675500666334!2d38.814814575691166!3d9.011878889255362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85fdc1c1b607%3A0x8f17ae09a6084792!2sRoots%20Fitness!5e0!3m2!1sen!2set!4v1766755973342!5m2!1sen!2set",
};

document.querySelectorAll(".gym-badge").forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-map");
        const url = maps[key];
        const mapFrame = document.getElementById("gym-map");

        // Highlight active badge
        document.querySelectorAll(".gym-badge").forEach(b => b.style.background = "#fff");
        btn.style.background = "#e5e5e5";

        // Fade animation
        mapFrame.style.opacity = "0";
        setTimeout(() => {
            mapFrame.src = url;
            mapFrame.style.opacity = "1";
        }, 400);
    });
});

