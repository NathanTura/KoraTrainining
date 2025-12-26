// --- POPUP UTILITIES ---
function showPopup(title, message, isError = false) {
    const popup = document.getElementById('custom-popup');
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-message').innerText = message;
    document.querySelector('.popup-icon').innerText = isError ? "❌" : "✅";
    popup.style.display = 'flex';
    setTimeout(() => popup.classList.add('active'), 10);
}

function closePopup() {
    location.reload(); // Replaces the reload in handleForm
}

// --- FORM LOGIC ---
async function handleForm(e) {
    e.preventDefault();
    
    const elements = e.target.elements;
    const submitBtn = e.target.querySelector('button');
    const service = document.getElementById('serviceType').value;

    // Capture all fields for the database update we discussed
    const payload = {
        name: elements[0].value,
        email: elements[1].value,
        phone: elements[2].value,
        message: elements[3].value,
        service: service
    };

    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showPopup(
                "Application Received!", 
                `Thanks ${payload.name}. Your interest in ${service} is saved. A coach will contact you shortly.`
            );
        } else {
            throw new Error(result.error || "Server error");
        }
    } catch (error) {
        showPopup("Oops!", "There was a problem saving your info. Please try again.", true);
        submitBtn.innerText = "Submit Application";
        submitBtn.disabled = false;
    }
}

// --- EXISTING UI LOGIC (Sliders, Nav, Maps) ---
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById('lead-form-container').style.display = 'none';
    document.getElementById('selection-stage').style.display = 'block';
    $('html, body').animate({ scrollTop: $("#start-training").offset().top }, 500);
});

$(document).ready(function () {
    $('.transform-slider').slick({
        dots: true, infinite: true, speed: 300, slidesToShow: 3, slidesToScroll: 1, autoplay: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1, arrows: false } }
        ]
    });

    $('.review-slider').slick({
        dots: true, infinite: true, speed: 500, slidesToShow: 2, slidesToScroll: 1, autoplay: true,
        responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, arrows: false } }]
    });
});

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    window.scrollY > 20 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
});

function showForm(serviceName) {
    document.getElementById('selection-stage').style.display = 'none';
    document.getElementById('lead-form-container').style.display = 'block';
    document.getElementById('selected-service').innerText = serviceName;
    document.getElementById('serviceType').value = serviceName;
    $('html, body').animate({ scrollTop: $("#start-training").offset().top }, 500);
}

// Map Logic
const maps = {
    gast: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d391.7781155613034!2d38.839188499999995!3d9.021178599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9a9f64478817%3A0x5b428fa97b3a44a0!2sGAST%20Entertainment!5e0!3m2!1sen!2set!4v1735230000000!5m2!1sen!2set",
    bellevue: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.460834445873!2d38.80027217569131!3d9.021657189102486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b851e8312dbc5%3A0x31392bebd3ae1b57!2sBellevue%20Fitness!5e0!3m2!1sen!2set!4v1766758154512!5m2!1sen!2set",
    roots: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5675500666334!2d38.814814575691166!3d9.011878889255362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85fdc1c1b607%3A0x8f17ae09a6084792!2sRoots%20Fitness!5e0!3m2!1sen!2set!4v1766755973342!5m2!1sen!2set",
};

document.querySelectorAll(".gym-badge").forEach(btn => {
    btn.addEventListener("click", () => {
        const url = maps[btn.getAttribute("data-map")];
        document.querySelectorAll(".gym-badge").forEach(b => b.style.background = "#fff");
        btn.style.background = "#e5e5e5";
        const mapFrame = document.getElementById("gym-map");
        mapFrame.style.opacity = "0";
        setTimeout(() => { mapFrame.src = url; mapFrame.style.opacity = "1"; }, 400);
    });
});

// Smooth Scroll
$('nav a, .footer-links a').on('click', function(event) {
    if (this.hash !== "") {
        event.preventDefault();
        const hash = this.hash;
        const navHeight = $('#navbar').outerHeight();
        $('html, body').animate({ scrollTop: $(hash).offset().top - navHeight }, 800);
    }
});