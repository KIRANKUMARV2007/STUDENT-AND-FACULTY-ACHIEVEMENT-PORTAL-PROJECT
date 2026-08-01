import { supabase } from './supabaseClient.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button');
    
    errorMessage.style.display = 'none';
    submitBtn.textContent = 'Authenticating...';
    submitBtn.disabled = true;

    try {
        // 1. Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) throw authError;

        const userId = authData.user.id;

        // 2. Fetch the user's role from the public.users table using their UUID
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        // 3. Redirect to the correct dashboard based on the fetched role
        const role = userData.role;
        if (role === 'student') {
            window.location.href = 'student-dashboard.html';
        } else if (role === 'faculty') {
            window.location.href = 'faculty-dashboard.html';
        } else if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            throw new Error("Unknown role assigned to user");
        }

    } catch (error) {
        console.error("Login failed:", error);
        errorMessage.textContent = error.message || "An error occurred during login.";
        errorMessage.style.display = 'block';
    } finally {
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
});
