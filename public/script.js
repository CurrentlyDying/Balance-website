window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('fade-out');

        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 2000);
});


const form = document.getElementById('signup-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    if (res.ok) {
        form.innerHTML = '<p>✅ You’re on the list.</p>';
    } else {
        alert('Something went wrong. Try again.');
    }
});
