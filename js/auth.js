const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        let loginEmail = input.includes('@') ? input : `${input}@school.com`;
        loginBtn.innerText = 'Connecting...';

        const { data, error } = await _supabase.auth.signInWithPassword({
            email: loginEmail,
            password: password
        });

        if (error) {
            errorMsg.innerText = error.message;
            errorMsg.style.display = 'block';
            loginBtn.innerText = 'SIGN IN';
        } else {
            window.location.href = 'pages/home.html';
        }
    });
}

async function logout() {
    await _supabase.auth.signOut();
    window.location.href = '../index.html';
}

async function resetPassword() {
    const newPassword = prompt("Enter your new password (min 6 characters):");
    if (!newPassword || newPassword.length < 6) return alert("Invalid password.");

    const { error } = await _supabase.auth.updateUser({ password: newPassword });
    if (error) alert("Error: " + error.message);
    else alert("Password updated successfully!");
}