// js/attendance.js


// 1. Load Students for the Attendance List
async function loadTeacherStudents() {
    // 1. Hide all other sections
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('profileSection').style.display = 'none';
    
    const attendanceSection = document.getElementById('attendanceSection');
    attendanceSection.style.display = 'block';

    // 2. Set Active Tab
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
    document.getElementById('navAttendance').classList.add('active');
    
    const { data: { user } } = await _supabase.auth.getUser();
    const container = document.getElementById('mainContent');
    container.innerHTML = "<h2>Loading Students...</h2>";

    // Get Teacher's assigned classes from the array
    const { data: teacher, error: tError } = await _supabase
        .from('teachers')
        .select('assigned_classes')
        .eq('id', user.id)
        .single();

    if (tError || !teacher) {
        alert("Teacher record not found. Please check your database ID.");
        location.reload();
        return;
    }

    // Get students whose class_name is in the teacher's array
    const { data: students, error: sError } = await _supabase
        .from('students')
        .select('*')
        .in('class_name', teacher.assigned_classes);

    if (sError) {
        alert("Error loading students: " + sError.message);
        return;
    }

    renderStudentList(students, teacher.assigned_classes);
}

// 2. Render the Student Table
function renderStudentList(students, classes) {
    // 1. Hide the main menu and show the attendance section
    document.getElementById('mainContent').style.display = 'none';
    const attendanceSection = document.getElementById('attendanceSection');
    attendanceSection.style.display = 'block';

    // 2. Setup the Dropdown Filter
    const filter = document.getElementById('classFilter');
    filter.innerHTML = '<option value="all">All My Classes</option>';
    classes.forEach(c => {
        filter.innerHTML += `<option value="${c}">Class ${c}</option>`;
    });

    // 3. Setup the Table Body and Template
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = ''; // Clear out any old data
    const template = document.getElementById('studentRowTemplate');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">No students found.</td></tr>';
        return;
    }

    // 4. Loop through students and stamp out the template
    students.forEach(student => {
        // Clone the HTML template
        const clone = template.content.cloneNode(true);
        
        // Fill in the data
        clone.querySelector('.student-row').setAttribute('data-class', student.class_name);
        clone.querySelector('.ui-name').textContent = `${student.first_name} ${student.last_name}`;
        clone.querySelector('.ui-class').textContent = student.class_name;
        
        // Setup the button
        const btn = clone.querySelector('.present-btn');
        btn.onclick = function() { markPresent(student.id, this); };

        // Add the finished row to the table
        tbody.appendChild(clone);
    });
}

// 3. Helper: Local row filtering
function filterByClass(selectedClass) {
    const rows = document.querySelectorAll('.student-row');
    rows.forEach(row => {
        if (selectedClass === 'all' || row.getAttribute('data-class') === selectedClass) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 4. Submit Attendance log
async function markPresent(studentId, btn) {
    const { error } = await _supabase
        .from('attendance_logs')
        .insert([{
            student_id: studentId,
            status: 'present',
            date: new Date().toISOString().split('T')[0]
        }]);

    if (error) {
        alert("Save error: " + error.message);
    } else {
        btn.innerText = "✅ Marked";
        btn.style.background = "#6c757d";
        btn.disabled = true;
    }
}