
document.getElementById("back-btn").addEventListener("click", () => {
    document.getElementById('lead-form-container').style.display = 'none';
    document.getElementById('selection-stage').style.display = 'block';

    $('html, body').animate({
        scrollTop: $("#start-training").offset().top
    }, 500);
});

// --- 1. SLIDER INITIALIZATION ---
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
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1, arrows: false }
            }
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
            {
                breakpoint: 768,
                settings: { slidesToShow: 1, arrows: false }
            }
        ]
    });
});

// --- 2. NAVIGATION SCROLL EFFECT ---
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- 3. FOOTER SNAP EFFECT ---
// This makes sure the footer snaps into view like a "End Screen"
const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // If user scrolls enough that footer starts appearing
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            // Optional: You can uncomment this to force snap, 
            // but usually just letting it sit at 100vh is smoother.
            /*
            entry.target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end' 
            });
            */
        }
    });
}, { threshold: [0.1] });

footerObserver.observe(document.querySelector('footer'));

// --- 4. FORM LOGIC ---
function showForm(serviceName) {
    document.getElementById('selection-stage').style.display = 'none';
    const formContainer = document.getElementById('lead-form-container');
    formContainer.style.display = 'block';

    document.getElementById('selected-service').innerText = serviceName;
    document.getElementById('serviceType').value = serviceName;

    $('html, body').animate({
        scrollTop: $("#start-training").offset().top
    }, 500);
}


const mapFrame = document.getElementById("gym-map");
const gymButtons = document.querySelectorAll(".gym-badge");

const maps = {
    gast: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d391.7781155613034!2d38.839188499999995!3d9.021178599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9a9f64478817%3A0x5b428fa97b3a44a0!2sGAST%20Entertainment!5e0!3m2!1sen!2set!4v1735230000000!5m2!1sen!2set",
    bellevue: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.460834445873!2d38.80027217569131!3d9.021657189102486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b851e8312dbc5%3A0x31392bebd3ae1b57!2sBellevue%20Fitness!5e0!3m2!1sen!2set!4v1766758154512!5m2!1sen!2set",
    roots: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5675500666334!2d38.814814575691166!3d9.011878889255362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85fdc1c1b607%3A0x8f17ae09a6084792!2sRoots%20Fitness!5e0!3m2!1sen!2set!4v1766755973342!5m2!1sen!2set",
};

gymButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-map");
        const url = maps[key];

        // Highlight active badge
        gymButtons.forEach(b => b.style.background = "#fff");
        btn.style.background = "#e5e5e5";

        // Fade animation
        mapFrame.style.opacity = "0";
        setTimeout(() => {
            mapFrame.src = url;
            mapFrame.style.opacity = "1";
        }, 400);
    });
});


async function handleForm(e) {
        e.preventDefault();
        
        // Get form values
        const nameInput = e.target.elements[0];
        const service = document.getElementById('serviceType').value;
        const submitBtn = e.target.querySelector('button');

        // UI Feedback: Loading state
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        try {
            // SEND DATA TO VERCEL BACKEND
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: nameInput.value, 
                    service: service 
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert(`Application Received, ${nameInput.value}!\n\nYour interest in ${service} is saved in our database.\nA coach has been notified and will contact you via Telegram/WhatsApp shortly.`);
                location.reload(); // Reset page on success
            } else {
                throw new Error(result.error || "Server error");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Sorry, there was a problem saving your info. Please try again.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
        
    location.reload();
    }

// --- NAVBAR SMOOTH SCROLL ---
$('nav a, .footer-links a').on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
        event.preventDefault();

        // Store hash
        const hash = this.hash;
        const navHeight = $('#navbar').outerHeight(); // Offset for fixed navbar

        $('html, body').animate({
            scrollTop: $(hash).offset().top - navHeight // Subtract navbar height so title isn't hidden
        }, 800, function() {
            // Add hash (#) to URL when done scrolling (optional)
            window.location.hash = hash;
        });
    }
});

$(window).on('scroll', function() {
    const scrollPos = $(document).scrollTop();
    $('nav a').each(function() {
        const currLink = $(this);
        const refElement = $(currLink.attr("href"));
        
        if (refElement.position().top <= scrollPos + 100 && 
            refElement.position().top + refElement.height() > scrollPos) {
            $('nav a').removeClass("active");
            currLink.addClass("active");
        }
    });
});