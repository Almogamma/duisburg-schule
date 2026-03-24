// js/register.js

async function handleRegistration() {
    // 1. Collect all inputs from the form
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value.trim();
    const subject = document.getElementById('regSubject').value.trim();
    const classesInput = document.getElementById('regClasses').value;

    // Basic validation
    if (!username || !password || !firstName || !lastName) {
        return alert("Please fill in all required fields.");
    }

    // Format the email and the classes array securely
    const fakeEmail = `${username}@school.com`;
    const classesArray = classesInput.split(',')
        .map(item => item.trim())
        .filter(item => item !== "");

    const btn = document.querySelector('button');
    btn.innerText = "Processing...";
    btn.disabled = true;

    // 2. Create the Authentication Login
    const { data: authData, error: authError } = await _supabase.auth.signUp({
        email: fakeEmail,
        password: password,
    });

    if (authError) {
        alert("Auth Error: " + authError.message);
        btn.innerText = "CREATE TEACHER PROFILE";
        btn.disabled = false;
        return;
    }

    const userId = authData.user.id;

    // 3. Link the new user to both Database Tables
    const profileInsert = _supabase.from('profiles').insert([{ 
        id: userId, 
        role: 'teacher', 
        first_name: firstName,
        last_name: lastName,
        email: fakeEmail 
    }]);

    const teacherInsert = _supabase.from('teachers').insert([{ 
        id: userId, 
        first_name: firstName,
        last_name: lastName,
        subject: subject,
        phone: phone,
        email: fakeEmail,
        assigned_classes: classesArray 
    }]);

    const [profRes, teachRes] = await Promise.all([profileInsert, teacherInsert]);

    if (profRes.error || teachRes.error) {
        console.error("Profile Error:", profRes.error);
        console.error("Teacher Error:", teachRes.error);
        alert("Account created, but database entry failed. Check your RLS policies.");
        btn.innerText = "CREATE TEACHER PROFILE";
        btn.disabled = false;
    } else {
        alert(`Success! ${firstName} ${lastName} is now registered.`);
        window.location.href = 'home.html';
    }
}