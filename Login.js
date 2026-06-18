import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://yrgydqeiucbtcrfmjura.supabase.co";

const supabaseKey = "sb_publishable_ZU3DjhAgxTsqfqPFiH4WVg_z5qLYjz5";

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  if (email ==="" || password === "") {
    showAlert("Please fill all fields");
    return;
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    showAlert(error.message);
    return;
  }

  showAlert("Login successful!");

  // Redirect user
  window.location.href = "dashboard.html";
});

function showAlert(message, type = "success") {

  const alert = document.getElementById("alert");

  alert.textContent = message;

  // color based on type
  alert.style.background =
    type === "error" ? "#e74c3c" : "#111";

  alert.classList.add("show");

  setTimeout(() => {
    alert.classList.remove("show");
  }, 2500);

}