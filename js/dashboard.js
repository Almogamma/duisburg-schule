// js/dashboard.js
async function initDashboard() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    const { data: teacher, error } = await _supabase
        .from('teachers')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

    if (teacher) {
        document.getElementById('navUserName').innerText = `Teacher: ${teacher.first_name} ${teacher.last_name}`;
    }
}

// Start the dashboard check immediately
initDashboard();