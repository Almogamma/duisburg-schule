const SUPABASE_URL = 'https://gjwecfjgdtlkijgvikcq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DHdvOOg77cG1LmUkHLutgw_OZchRvwo';

// Fix: Use a different name for the constant to avoid self-reference error
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.innerText = 'Connecting...';
    loginBtn.style.opacity = '0.7';

    // 1. Authenticate User
    const { data: authData, error: authError } = await _supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        showError(authError.message);
        return;
    }

    // 2. Simplified Routing (Checks if login worked, moves to home)
    if (authData.user) {
        window.location.href = 'home.html';
    } else {
        showError('Unexpected error. Please try again.');
    }
});

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.innerText = 'SIGN IN';
    loginBtn.style.opacity = '1';
}