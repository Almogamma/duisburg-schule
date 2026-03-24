async function showProfile() {
    // 1. Hide all other sections
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('attendanceSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'block';

    // 2. Set Active Tab
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
    document.getElementById('navProfile').classList.add('active');

    // 3. Load Data
    const { data: { user } } = await _supabase.auth.getUser();
    const { data: teacher } = await _supabase.from('teachers').select('*').eq('id', user.id).single();

    if (teacher) {
        // Display the name dynamically
        document.getElementById('profileNameDisplay').innerText = `${teacher.first_name} ${teacher.last_name}`;
        document.getElementById('editPhone').value = teacher.phone || "";
        if (teacher.photo_url) document.getElementById('profileImage').src = teacher.photo_url;
    }
}

async function updateTeacherInfo() {
    const { data: { user } } = await _supabase.auth.getUser();
    
    // Only fetch and update the phone number
    const updates = {
        phone: document.getElementById('editPhone').value
    };

    const { error } = await _supabase.from('teachers').update(updates).eq('id', user.id);
    if (error) alert("Update failed: " + error.message);
    else alert("Phone number updated successfully!");
}

// Keep your uploadPhoto() function exactly as it is!

async function uploadPhoto(input) {
    const file = input.files[0];
    const { data: { user } } = await _supabase.auth.getUser();
    const filePath = `avatars/${user.id}`;

    const { error: uploadError } = await _supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) return alert("Upload failed: " + uploadError.message);

    const { data: { publicUrl } } = _supabase.storage.from('avatars').getPublicUrl(filePath);
    await _supabase.from('teachers').update({ photo_url: publicUrl }).eq('id', user.id);
    
    document.getElementById('profileImage').src = publicUrl;
    alert("Photo updated!");
}